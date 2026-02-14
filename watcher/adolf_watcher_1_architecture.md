---
title: "Раздел 1: Архитектура"
mode: "wide"
---

**Проект:** ADOLF — AI-Driven Operations Layer Framework  
**Модуль:** Watcher / Architecture  
**Версия:** 4.0  
**Дата:** Февраль 2026

---

## 1.1 Принципы проектирования

| Принцип | Описание |
|---------|----------|
| Двухчастность | Collector (сбор данных) и Analyzer (аналитика) — независимые подсистемы |
| Автономность Collector | Работает без подключения к основному серверу ADOLF; связь только через Knowledge Pipeline |
| Распределённость | Домашние ПК как браузерные агенты, VPS как управляющий узел |
| Отказоустойчивость | Выход ПК из строя не останавливает систему; автоматическое обнаружение и повторные попытки |
| Масштабируемость | Пул ПК расширяется без изменения архитектуры (порты 9300–9399, до 100 агентов) |
| Защита от блокировок | Домашние IP, FRP-туннели, эмуляция поведения, оркестрация чередования |
| Минимализм зависимостей | 4 npm-пакета для Collector; native HTTP-серверы без фреймворков |

---

## 1.2 Топология развёртывания

```mermaid
graph TB
    subgraph HOMES["Домашние ПК (Chrome + frpc)"]
        direction LR
        H1["ПК 1<br/>Chrome :9222<br/>frpc → :9301"]
        H2["ПК 2<br/>Chrome :9222<br/>frpc → :9347"]
        HN["ПК N<br/>Chrome :9222<br/>frpc → :93XX"]
    end

    subgraph VPS["VPS Collector (Node.js)"]
        direction TB
        subgraph INFRA["Инфраструктура"]
            FRPS["frps<br/>:7000 (туннели)<br/>:7500 (Admin API)"]
            NGINX["Nginx<br/>:443 (SSL)<br/>agent.adolf.su"]
        end

        subgraph SERVICES["Сервисы"]
            POOL["cdp-pool.js<br/>:3000"]
            MONITOR["monitor/server.js<br/>:3001"]
            API["api.js<br/>:3002"]
            BOT["bot.js<br/>(scheduler + orchestrator + runner)"]
        end

        subgraph STORAGE["Хранение"]
            SQLITE[("watcher.db<br/>SQLite WAL")]
            FILES["results/<br/>catalog/ + enriched/"]
            LOGS["logs/<br/>scan_*.log"]
            CONFIG["config.json<br/>(hot-reload)"]
        end
    end

    subgraph MAIN["Основной сервер ADOLF (Python/FastAPI)"]
        KNOW_IN["Knowledge<br/>входная директория"]
        QDRANT[("Qdrant<br/>vector DB")]
        ANALYZER["Watcher Analyzer<br/>FastAPI"]
        OWUI["Open WebUI"]
    end

    H1 & H2 & HN ====>|FRP-туннели :7000| FRPS
    FRPS -->|TCP proxy :93XX| POOL

    NGINX -->|/api/v1/*| API
    NGINX -->|/api/* + /ws| MONITOR
    NGINX -->|/| MONITOR

    BOT --> POOL
    BOT --> SQLITE
    BOT --> FILES
    POOL --> FRPS
    API --> SQLITE
    MONITOR --> POOL

    FILES -->|"Knowledge Pipeline<br/>(JSON→MD, rsync/scp)"| KNOW_IN
    KNOW_IN --> QDRANT
    QDRANT --> ANALYZER
    ANALYZER --> OWUI
```

---

## 1.3 Компоненты Collector

### Карта процессов и портов

| Процесс | systemd-сервис | Порт | Протокол | Описание |
|---------|---------------|------|----------|----------|
| frps | `frps.service` | 7000 (туннели), 7500 (Admin API) | TCP, HTTP | FRP-сервер для туннелей к домашним ПК |
| cdp-pool.js | `cdp-pool.service` | 3000 | HTTP | Управление пулом браузеров |
| bot.js | `watcher-bot.service` | — | Telegram API | Бот + scheduler + orchestrator + runner |
| api.js | `watcher-api.service` | 3002 | HTTP/JSON | REST API для программного доступа |
| monitor/server.js | `watcher-monitor.service` | 3001 | HTTP + WebSocket | Web-интерфейс мониторинга |
| nginx | `nginx.service` | 443 | HTTPS | Reverse proxy + SSL (agent.adolf.su) |

### Взаимодействие компонентов

```mermaid
graph LR
    subgraph BOT_PROC["bot.js (единый процесс)"]
        BOT["Telegram Bot"]
        SCHED["Scheduler"]
        ORCH["Orchestrator"]
        RUNNER["Runner"]
    end

    POOL["cdp-pool.js<br/>:3000"]
    DB[("SQLite")]
    SKILL["SKILL/<br/>scanner_*.js<br/>enricher_*.js"]
    API["api.js<br/>:3002"]
    MON["monitor/<br/>server.js<br/>:3001"]
    CFG["config.json"]

    BOT -->|команды| SCHED
    SCHED -->|расписания| ORCH
    SCHED -->|расписания| RUNNER
    ORCH -->|выбор ПК| POOL
    ORCH -->|история| DB
    RUNNER -->|child_process| SKILL
    RUNNER -->|acquire/release| POOL
    RUNNER -->|результаты| DB
    SKILL -->|CDP| POOL

    API -->|read| DB
    MON -->|read| POOL
    MON -->|read/write| CFG

    CFG -.->|hot-reload<br/>fs.watchFile 2с| BOT_PROC
```

### Жизненный цикл задачи

```mermaid
stateDiagram-v2
    [*] --> queued: Telegram-команда<br/>или расписание

    queued --> waiting_pc: Scheduler.tryRunNext()
    waiting_pc --> queued: Нет свободных ПК
    waiting_pc --> cooldown: Все ПК нарушают<br/>правила чередования
    cooldown --> waiting_pc: Cooldown истёк<br/>(5–10 мин)

    waiting_pc --> running: Orchestrator.choosePC()<br/>→ Runner.runScan()

    running --> completed: Скан завершён
    running --> failed: Ошибка / таймаут

    failed --> queued: Retry<br/>(до 3 попыток)
    failed --> [*]: maxRetries исчерпан

    completed --> [*]: Результаты в БД<br/>и на диске
```

---

## 1.4 Подробная архитектура компонентов

### cdp-pool.js — Пул браузеров

Автономный процесс, управляющий жизненным циклом подключений к домашним ПК.

```mermaid
flowchart TB
    subgraph DISCOVERY["Цикл обнаружения (каждые 10 сек)"]
        FRP_API["FRP Admin API<br/>:7500 /api/proxy/tcp"]
        CHECK["Проверка CDP<br/>/json/version"]
        STATES["Обновление состояний"]
        CLEANUP["Удаление offline &gt; 30 мин"]

        FRP_API --> CHECK
        CHECK --> STATES
        STATES --> CLEANUP
    end

    subgraph POOL_STATE["Состояния ПК"]
        OFFLINE["Offline<br/>(нет туннеля / Chrome не отвечает)"]
        ALIVE["Alive<br/>(туннель + Chrome отвечает)"]
        STABLE["Stable<br/>(online &gt; 60 сек)"]
        BUSY["Busy<br/>(занят задачей)"]

        OFFLINE -->|туннель + CDP ответ| ALIVE
        ALIVE -->|60 сек| STABLE
        STABLE -->|/acquire| BUSY
        BUSY -->|/release| STABLE
        ALIVE -->|потеря связи| OFFLINE
        STABLE -->|потеря связи| OFFLINE
    end

    subgraph API["HTTP API :3000"]
        STATUS["/status → список ПК"]
        SUMMARY["/summary → total, online, stable, busy, free"]
        ACQUIRE["/acquire?task=X&amp;port=P → занять ПК"]
        RELEASE["/release?port=P → освободить"]
        SYNC["/sync → принудительный опрос"]
    end
```

Ключевые параметры: стабильность после 60 секунд online (защита от flapping), удаление из пула после 30 минут offline, автообнаружение новых ПК через FRP Admin API.

### bot.js — Telegram-бот

Точка входа Collector (`node bot.js`). Запускает scheduler.js при старте. Принимает команды из Telegram и обрабатывает их.

Типы входных данных:

| Ввод | Интерпретация |
|------|---------------|
| `WB125487` | Быстрый скан продавца 125487 на Wildberries |
| `OZ465656` | Быстрый скан продавца 465656 на Ozon |
| `YM213246` | Быстрый скан продавца 213246 на Яндекс.Маркет |
| Голое число | Выбор маркетплейса через inline-кнопки |
| `/add <mp> <id> <имя>` | Добавление продавца в отслеживание |
| `/scan <id>` | Ручной запуск сканирования |
| `/enrich <id>` | Ручной запуск обогащения |

Полный список команд описан в [Разделе 2: Telegram-бот и планировщик](/watcher/adolf_watcher_2_bot_scheduler).

### scheduler.js — Планировщик

Работает внутри процесса bot.js. Управляет шестью циклическими задачами.

| Цикл | Интервал по умолчанию | Hot-reload | Описание |
|------|----------------------|:----------:|----------|
| checkSchedules | 5 мин | Нет (после рестарта) | Проверяет `next_scan_at`, создаёт задачи в очереди |
| checkEnrichSchedules | 5 мин | Нет (после рестарта) | Проверяет `next_enrich_at`, создаёт enrich-задачи |
| tryRunNext | 30 сек | Нет (после рестарта) | Берёт задачи из очереди, запрашивает ПК, запускает |
| monitorPCs | 15 сек | Нет (после рестарта) | Отслеживает online/offline ПК, отправляет алерты |
| rotateFiles | 24 часа | Нет (после рестарта) | Удаляет старые файлы результатов |
| morningSummary | 05:00 UTC (ежедневно) | Да | Утренняя сводка в Telegram |

Пять интервалов планировщика применяются только после перезапуска сервиса. Остальные 18 параметров конфигурации (оркестратор, раннер, монитор) применяются мгновенно через hot-reload.

### orchestrator.js — Оркестратор

Алгоритм выбора ПК для задачи. Реализует скоринговую модель с штрафами и бонусами.

```mermaid
flowchart TB
    START["Входящая задача<br/>(marketplace, seller_id)"] --> GET_FREE["Получить свободные ПК<br/>из CDP Pool"]
    GET_FREE -->|Нет свободных| RETURN_NULL["return null"]
    GET_FREE -->|Есть свободные| SCORE["Рассчитать score<br/>для каждого ПК"]

    SCORE --> CHECK_COOL["Отфильтровать ПК<br/>на cooldown"]
    CHECK_COOL --> CALC["Для каждого ПК:<br/>+ штраф за того же продавца (+100)<br/>+ штраф за тот же МП (+50)<br/>+ количество задач за 24ч<br/>− бонус за простой (до −20)<br/>− бонус если не использовался (−20)"]

    CALC --> SORT["Сортировка по score ↑<br/>(меньше = лучше)"]
    SORT --> BEST["Лучший кандидат"]
    BEST -->|Без нарушений| RETURN_PC["return ПК"]
    BEST -->|Есть чистый кандидат| RETURN_CLEAN["return чистый ПК"]
    BEST -->|Все нарушают| COOLDOWN["Cooldown 5–10 мин<br/>return null"]
```

История назначений хранится в таблице `assignments` (SQLite), что обеспечивает персистентность при перезапусках.

### runner.js — Исполнитель

Запускает сканеры и обогатители как дочерние процессы (`child_process.spawn`).

| Параметр | Сканирование | Обогащение |
|----------|-------------|------------|
| Процесс | `node SKILL/scanner_*.js <seller_id>` | `node SKILL/enricher_*.js <seller_id>` |
| Переменные окружения | `CDP_PORT`, `MARKETPLACE`, `SELLER_SLUG` | `CDP_PORT` (если нужен CDP) |
| Таймаут | 3 часа (`runner.scanTimeoutMs`) | 30 мин (`runner.enrichTimeoutMs`) |
| Повторные попытки | До 3 (`runner.maxRetries`) | Нет |
| Требует CDP | Всегда | WB — нет; Ozon, YM — да |
| Результат | `results/results_seller_<id>.json` | `results/enriched_seller_<id>.json` |
| Архивная копия | `results/catalog/{mp}_seller_{id}_{date}.json` | `results/enriched/{mp}_seller_{id}_{date}.json` |

Параллельность: runner поддерживает запуск нескольких задач одновременно (по числу свободных ПК). Каждая задача отслеживается в `Map` по `scanId`.

---

## 1.5 Компоненты Analyzer

Analyzer работает на основном сервере ADOLF в составе Python/FastAPI-стека.

```mermaid
graph TB
    subgraph ANALYZER_SRV["Основной сервер ADOLF"]
        subgraph WATCHER_ANALYZER["Watcher Analyzer"]
            API_AN["FastAPI endpoints<br/>/api/v1/watcher/analytics/*"]
            CELERY_AN["Celery tasks<br/>аналитические задачи"]
            CACHE["Redis cache<br/>кэш аналитики"]
        end

        CORE["ADOLF Core<br/>Middleware, Auth"]
        KNOWLEDGE_MOD["Knowledge Module"]
        QDRANT[("Qdrant")]
        OWUI["Open WebUI<br/>Pipeline &amp; Tools"]
    end

    CORE --> API_AN
    API_AN --> KNOWLEDGE_MOD
    KNOWLEDGE_MOD --> QDRANT
    API_AN --> CACHE
    CELERY_AN --> KNOWLEDGE_MOD
    CELERY_AN --> CACHE
    OWUI -->|RAG запросы| QDRANT
    OWUI -->|API вызовы| API_AN
```

### Взаимодействие с Knowledge

Analyzer не хранит данные о конкурентах самостоятельно. Все данные извлекаются из Qdrant через модуль Knowledge:

| Операция | Метод | Описание |
|----------|-------|----------|
| Поиск по продавцу | Semantic search | Поиск документов по `seller_id` + `marketplace` |
| Поиск по SKU | Semantic search | Поиск обогащённых данных конкретного товара |
| Поиск изменений | Metadata filter | Фильтр по `subcategory: price_changes` + дате |
| Агрегация | Multi-query | Сбор данных за период для трендового анализа |

### Open WebUI интеграция

| Компонент | Тип | Описание |
|-----------|-----|----------|
| Watcher Pipeline | Pipeline | Обработка запросов о конкурентах через RAG |
| Watcher Tools | Tool | Прямые API-вызовы для структурированных данных |
| Watcher Alerts | Notification | Push-уведомления о критических изменениях |

---

## 1.6 Потоки данных

### Поток 1: Сканирование каталога

```mermaid
sequenceDiagram
    participant TG as Telegram / Scheduler
    participant BOT as bot.js
    participant ORCH as orchestrator.js
    participant POOL as cdp-pool.js
    participant RUNNER as runner.js
    participant SCAN as scanner_*.js
    participant CHROME as Chrome (домашний ПК)
    participant DB as SQLite
    participant FS as Файловая система

    TG->>BOT: WB1025130 / расписание
    BOT->>DB: createScan (status: queued)

    loop Каждые 30 сек (tryRunNext)
        BOT->>ORCH: choosePC(marketplace, sellerId)
        ORCH->>POOL: GET /status
        POOL-->>ORCH: список свободных ПК
        ORCH->>DB: getLastAssignment, getTaskCount
        ORCH-->>BOT: выбранный порт + имя ПК
    end

    BOT->>RUNNER: runScan(scan, port)
    RUNNER->>POOL: GET /acquire?port=XXXX
    POOL-->>RUNNER: ОК (ПК занят)

    RUNNER->>SCAN: spawn("node scanner_wb.js 1025130")
    SCAN->>CHROME: CDP: navigate, scroll, collect
    CHROME-->>SCAN: HTML → JSON данные
    SCAN-->>RUNNER: results_seller_1025130.json

    RUNNER->>DB: INSERT products, price_history
    RUNNER->>FS: copy → results/catalog/{mp}_seller_{id}_{date}.json
    RUNNER->>POOL: GET /release?port=XXXX
    RUNNER->>DB: UPDATE scans SET status=completed
    RUNNER->>DB: UPDATE sellers SET next_scan_at
    RUNNER-->>BOT: результат
    BOT->>TG: Текстовый отчёт
```

### Поток 2: Обогащение данных

```mermaid
sequenceDiagram
    participant TG as Telegram / Scheduler
    participant BOT as bot.js
    participant RUNNER as runner.js
    participant ENRICH as enricher_*.js
    participant CHROME as Chrome / HTTP API
    participant DB as SQLite
    participant FS as Файловая система

    TG->>BOT: /enrich 1025130 / авторасписание
    BOT->>DB: createEnrichScan (task_type: enrich)

    BOT->>RUNNER: runEnrich(scan)
    Note over RUNNER: WB enricher: HTTP (без CDP)<br/>Ozon/YM enricher: CDP (через Pool)

    RUNNER->>ENRICH: spawn("node enricher_*.js 1025130")
    ENRICH->>CHROME: Запрос детальных данных по каждому SKU
    CHROME-->>ENRICH: Детальные данные

    ENRICH-->>RUNNER: enriched_seller_1025130.json

    RUNNER->>DB: UPSERT product_details (data_json)
    RUNNER->>FS: copy → results/enriched/{mp}_seller_{id}_{date}.json
    RUNNER->>DB: UPDATE sellers SET last_enriched_at, next_enrich_at

    alt Ручной запуск
        BOT->>TG: Отчёт + JSON-файл
    else Автообогащение
        BOT->>TG: Только текстовый отчёт
    end
```

### Поток 3: Knowledge Pipeline

```mermaid
sequenceDiagram
    participant FS as Файловая система VPS
    participant CONV as Converter (JSON→MD)
    participant NET as Сетевая передача
    participant KNOW as Knowledge (входная директория)
    participant QDRANT as Qdrant
    participant ANALYZER as Analyzer (FastAPI)
    participant OWUI as Open WebUI

    FS->>CONV: enriched_seller_1025130.json
    CONV->>CONV: Парсинг JSON
    CONV->>CONV: Формирование YAML-заголовка
    CONV->>CONV: Генерация Markdown-таблиц
    CONV->>NET: seller_1025130_enriched.md

    NET->>KNOW: rsync / scp (VPS → основной сервер)
    KNOW->>QDRANT: Индексация (chunk + embed)

    OWUI->>QDRANT: RAG-запрос: "цены конкурента X"
    QDRANT-->>OWUI: Релевантные чанки
    OWUI->>ANALYZER: API: /analytics/price-comparison
    ANALYZER->>QDRANT: Structured query
    QDRANT-->>ANALYZER: Данные
    ANALYZER-->>OWUI: Аналитический отчёт
```

---

## 1.7 Инфраструктура

### FRP-туннели

FRP (Fast Reverse Proxy) обеспечивает подключение к домашним ПК без проброса портов на роутерах.

| Компонент | Расположение | Конфигурация |
|-----------|-------------|--------------|
| frps (сервер) | VPS | Порт 7000 (туннели), 7500 (Admin API, Basic auth) |
| frpc (клиент) | Каждый домашний ПК | Пробрасывает локальный Chrome CDP-порт (9222) на VPS (9300–9399) |

Автоназначение портов: `remotePort = 0` в конфиге frpc — сервер выделяет порт из диапазона 9300–9399 автоматически. CDP Pool обнаруживает новые туннели через FRP Admin API каждые 10 секунд.

### Nginx

Reverse proxy `agent.adolf.su` с SSL (Let's Encrypt).

| Location | Upstream | Описание |
|----------|----------|----------|
| `/api/v1/*` | `127.0.0.1:3002` | REST API (api.js) |
| `/api/*` | `127.0.0.1:3001` | Monitor API |
| `/ws` | `127.0.0.1:3001` | WebSocket (Monitor) |
| `/` | `127.0.0.1:3001` | Frontend Monitor (через Node.js для auth-проверки) |

### systemd-сервисы

| Сервис | Зависимости | Описание |
|--------|-------------|----------|
| `frps.service` | — | FRP-сервер (запускается первым) |
| `cdp-pool.service` | `frps.service` | CDP Pool API |
| `watcher-bot.service` | `cdp-pool.service` | Telegram-бот + scheduler + orchestrator + runner |
| `watcher-api.service` | — | REST API (независимый процесс) |
| `watcher-monitor.service` | `cdp-pool.service` | Web UI backend |
| `nginx.service` | — | Reverse proxy |

Порядок запуска: frps → cdp-pool → watcher-bot. Остальные сервисы могут запускаться параллельно.

---

## 1.8 Система конфигурации

### Централизованный конфиг (config.js)

Все настраиваемые параметры хранятся в `config.json` и управляются через модуль `config.js`.

| Характеристика | Описание |
|----------------|----------|
| Формат | JSON (`config.json`) |
| Дефолты | Встроены в `config.js`, применяются при отсутствии файла |
| Hot-reload | `fs.watchFile` с интервалом 2 секунды |
| Валидация | Тип, min/max, кросс-валидация |
| API | `get(dotPath)`, `set(dotPath, value)`, `getAll()`, `getSchema()` |
| Параметров | 23 (7 оркестратор, 12 планировщик, 3 раннер, 1 монитор) |

### Группы параметров

| Группа | Кол-во | Hot-reload | Примеры |
|--------|:------:|:----------:|---------|
| orchestrator | 7 | Да | `penaltySameSeller`, `cooldownMinMs`, `idleBonusMax` |
| scheduler | 12 | Частично (5 интервалов — после рестарта) | `defaultScanScheduleHours`, `enrichLimit`, `catalogKeepPerSeller` |
| runner | 3 | Да | `scanTimeoutMs`, `enrichTimeoutMs`, `maxRetries` |
| monitor | 1 | Да | `pollIntervalMs` |

Изменение через Web UI: вкладка «Настройки» на agent.adolf.su. Автосохранение с debounce 800 мс, WebSocket-синхронизация между вкладками.

---

## 1.9 Зависимости

### npm-пакеты Collector

| Пакет | Версия | Назначение |
|-------|--------|------------|
| `better-sqlite3` | ^12.6.2 | SQLite с синхронным API |
| `dotenv` | ^17.2.4 | Переменные окружения из .env |
| `node-telegram-bot-api` | ^0.63.0 | Telegram Bot API |
| `playwright-core` | ^1.58.2 | CDP-подключение к браузерам |

Сканеры и обогатители используют `playwright-core` для CDP-подключения. Playwright не управляет установкой браузера — Chrome установлен на домашних ПК пользователями вручную.

### Внешние зависимости Monitor

| Ресурс | Источник | Назначение |
|--------|----------|------------|
| Tailwind CSS | CDN | Стилизация UI |
| Lucide Icons | CDN | Иконки |
| WebSocket (ws) | npm (в monitor/package.json) | Realtime-обновления |

### Python-зависимости Analyzer

| Пакет | Назначение |
|-------|------------|
| FastAPI | REST API |
| Celery | Фоновые аналитические задачи |
| Redis | Кэш и очередь |
| qdrant-client | Взаимодействие с Qdrant |
| httpx | HTTP-запросы (при необходимости) |

---

## 1.10 Безопасность

### Collector

| Уровень | Механизм |
|---------|----------|
| Telegram | `ADMIN_CHAT_ID` — доступ только для администратора |
| Web Monitor | Login/password, HttpOnly cookie-сессия (7 дней) |
| REST API | Слушает `127.0.0.1:3002` — недоступен извне напрямую |
| CDP Pool | Слушает `127.0.0.1:3000` — только локальный доступ |
| FRP Admin | Basic auth на `127.0.0.1:7500` |
| Nginx | SSL (Let's Encrypt), проксирование через auth-проверку |
| .env | Секреты (`BOT_TOKEN`, `ADMIN_CHAT_ID`) вне git |

### Analyzer

| Уровень | Механизм |
|---------|----------|
| API | ADOLF Core Middleware (JWT, роли) |
| Данные | Фильтрация по `brand_id` и `access_level` через ролевую модель |
| Open WebUI | Стандартная авторизация ADOLF |

---

## 1.11 Отказоустойчивость

| Сценарий | Поведение |
|----------|-----------|
| ПК ушёл offline во время задачи | Runner фиксирует таймаут, задача переходит в `failed`, автоповтор (до 3 раз) |
| CDP Pool недоступен | Scheduler использует fallback: если runner не занят, пытается запустить одну задачу |
| Все ПК нарушают правила чередования | Orchestrator назначает cooldown (5–10 мин), задача откладывается |
| Ошибка сканера (CAPTCHA, crash) | try/catch на уровне SKU, сохранение прогресса каждые 20 SKU, resume при рестарте |
| config.json повреждён | config.js использует встроенные дефолты |
| Перезапуск bot.js | Состояние задач в SQLite, очередь восстанавливается; история назначений сохранена |
| Потеря связи VPS → основной сервер | Knowledge Pipeline откладывает передачу; данные накапливаются на VPS |

---

## 1.12 Файловая структура проекта

```
/opt/watcher/
├── bot.js                  # Telegram-бот (точка входа)
├── scheduler.js            # Планировщик задач
├── orchestrator.js         # Оркестратор (распределение по ПК)
├── runner.js               # Исполнитель задач
├── config.js               # Конфигурация (hot-reload)
├── config.json             # Файл конфига (создаётся автоматически)
├── api.js                  # REST API (:3002)
├── cdp-pool.js             # CDP Pool Service (:3000)
├── cdp.js                  # CDP Client Module
├── db.js                   # БД (SQLite)
├── utils.js                # Утилиты (computeDiff)
├── package.json            # 4 зависимости
├── .env                    # Секреты (gitignored)
├── watcher.db              # SQLite база (gitignored)
├── frp-port-memory.json    # Персистентная карта FRP-портов
│
├── SKILL/
│   ├── SKILL.md            # Описание skill для Claude Code
│   ├── scanner_wb.js       # Сканер Wildberries (CDP)
│   ├── scanner_ozon.js     # Сканер Ozon (CDP)
│   ├── scanner_ymarket.js  # Сканер Яндекс.Маркет (CDP)
│   ├── enricher_wb.js      # Обогатитель Wildberries (HTTP)
│   ├── enricher_ozon.js    # Обогатитель Ozon (CDP)
│   ├── enricher_ymarket.js # Обогатитель Яндекс.Маркет (CDP)
│   └── human.js            # Эмуляция поведения
│
├── monitor/
│   ├── server.js           # Backend Web UI (:3001)
│   ├── package.json        # Зависимость: ws
│   └── public/             # Frontend (HTML/CSS/JS)
│       ├── index.html
│       ├── login.html
│       └── ...
│
├── results/                # JSON-результаты (gitignored)
│   ├── results_seller_*.json     # Текущие результаты сканов
│   ├── enriched_seller_*.json    # Текущие результаты обогащения
│   ├── catalog/                  # Архив сканов (датированные)
│   └── enriched/                 # Архив обогащений (датированные)
│
└── logs/                   # Логи сканов (gitignored)
    └── scan_<id>_<seller>.log
```

---

**Документ подготовлен:** Февраль 2026  
**Версия:** 4.0  
**Статус:** Черновик

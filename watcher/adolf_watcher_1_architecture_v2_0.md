# ADOLF WATCHER — Раздел 1: Architecture

**Проект:** Интеллектуальная система мониторинга цен конкурентов  
**Модуль:** Watcher / Architecture  
**Версия:** 2.0  
**Дата:** Январь 2026

---

## 1.1 Обзор архитектуры

### Принципы проектирования

| Принцип | Описание |
|---------|----------|
| Распределённость | Агенты на офисных ПК, сервер на VPS |
| Отказоустойчивость | Выход агента из строя не останавливает систему |
| Масштабируемость | От 3 до 15 агентов без изменения архитектуры |
| Защита от блокировок | Множество IP, эмуляция поведения, cookies менеджеров |
| AI-first | Извлечение данных через LLM, без CSS-селекторов |

### Общая схема

```mermaid
graph TB
    subgraph OFFICE["Офис"]
        subgraph PC1["ПК Менеджера 1"]
            CHROME1["Chrome<br/>(дневной режим)"]
            AGENT1["Watcher Agent<br/>(ночной режим)"]
            MODEM1["USB-модем"]
        end
        
        subgraph PC2["ПК Менеджера 2"]
            CHROME2["Chrome"]
            AGENT2["Watcher Agent"]
            MODEM2["USB-модем"]
        end
        
        subgraph PCN["ПК Менеджера N"]
            CHROMEN["Chrome"]
            AGENTN["Watcher Agent"]
            MODEMN["USB-модем"]
        end
    end
    
    subgraph VPS["VPS Timeweb Cloud"]
        subgraph API_LAYER["API Layer"]
            REST["REST API<br/>(FastAPI)"]
            WS["WebSocket<br/>Server"]
        end
        
        subgraph CORE["Core Services"]
            TD["Task Dispatcher"]
            SEM["IP Semaphore"]
            PARSER["AI Parser"]
        end
        
        subgraph STORAGE["Storage"]
            PG[("PostgreSQL")]
            REDIS[("Redis")]
        end
        
        subgraph WORKERS["Background Workers"]
            CELERY["Celery Workers"]
            BEAT["Celery Beat"]
        end
    end
    
    subgraph EXTERNAL["External Services"]
        AI["Timeweb AI<br/>(GPT-5 mini)"]
        WB["Wildberries"]
        OZ["Ozon"]
        YM["Yandex.Market"]
    end
    
    CHROME1 -.->|cookies| AGENT1
    CHROME2 -.->|cookies| AGENT2
    CHROMEN -.->|cookies| AGENTN
    
    AGENT1 & AGENT2 & AGENTN <-->|HTTPS| REST
    AGENT1 & AGENT2 & AGENTN <-->|WSS| WS
    
    AGENT1 -->|mobile IP| MODEM1 --> WB & OZ & YM
    AGENT2 -->|mobile IP| MODEM2 --> WB & OZ & YM
    AGENTN -->|mobile IP| MODEMN --> WB & OZ & YM
    
    REST --> TD
    WS --> TD
    TD <--> SEM
    TD <--> REDIS
    TD --> PARSER
    PARSER --> AI
    PARSER --> PG
    
    CELERY --> PG
    CELERY --> REDIS
    BEAT --> CELERY
```

---

## 1.2 Компоненты системы

### 1.2.1 Клиентская часть (Office)

| Компонент | Назначение | Технология |
|-----------|------------|------------|
| **Watcher Agent** | Основное приложение парсинга | Python + Playwright |
| **Browser Cloner** | Копирование cookies из Chrome | Python (sqlite3, cryptography) |
| **Network Switcher** | Переключение сетевых интерфейсов | Python (subprocess, netsh) |
| **Modem Controller** | Управление USB-модемом | Python (pyserial, AT-commands) |
| **Local Cache** | Кэш задач при потере связи | SQLite |

### 1.2.2 Серверная часть (VPS)

| Компонент | Назначение | Технология |
|-----------|------------|------------|
| **REST API** | Получение задач, отправка результатов | FastAPI |
| **WebSocket Server** | Команды управления агентами | FastAPI WebSocket |
| **Task Dispatcher** | Распределение задач между агентами | Python |
| **IP Semaphore** | Предотвращение коллизий IP | Redis |
| **AI Parser** | Извлечение данных из текста | GPT-5 mini |
| **Alert Engine** | Генерация демпинг-алертов | Python |
| **Celery Workers** | Фоновые задачи | Celery |
| **Celery Beat** | Планировщик задач | Celery Beat |

### 1.2.3 Хранилища данных

| Хранилище | Назначение | Данные |
|-----------|------------|--------|
| **PostgreSQL** | Основное хранилище | Агенты, задачи, история цен, подписки, конкуренты |
| **Redis** | Оперативные данные | Очередь задач, IP Semaphore, сессии WebSocket |

---

## 1.3 Потоки данных

### 1.3.1 Поток получения задачи

```mermaid
sequenceDiagram
    participant AG as Watcher Agent
    participant API as REST API
    participant TD as Task Dispatcher
    participant SEM as IP Semaphore
    participant REDIS as Redis
    participant PG as PostgreSQL
    
    AG->>API: GET /api/v1/watcher/tasks/next
    API->>TD: request_task(agent_id, agent_ip)
    
    TD->>SEM: acquire(agent_ip, target_domain)
    SEM->>REDIS: SETNX ip:{ip}:domain:{domain}
    
    alt IP свободен
        REDIS-->>SEM: OK
        SEM-->>TD: acquired
        
        TD->>REDIS: LPOP task_queue:{marketplace}
        REDIS-->>TD: task_id
        
        TD->>PG: UPDATE tasks SET status='in_progress', agent_id=?
        PG-->>TD: OK
        
        TD-->>API: task_data
        API-->>AG: 200 OK {task}
    else IP занят
        REDIS-->>SEM: FAIL
        SEM-->>TD: blocked
        TD-->>API: no_task
        API-->>AG: 204 No Content
    end
```

### 1.3.2 Поток отправки результата

```mermaid
sequenceDiagram
    participant AG as Watcher Agent
    participant API as REST API
    participant TD as Task Dispatcher
    participant PARSER as AI Parser
    participant AI as GPT-5 mini
    participant PG as PostgreSQL
    participant SEM as IP Semaphore
    participant ALERT as Alert Engine
    
    AG->>API: POST /api/v1/watcher/tasks/{id}/report
    Note over AG,API: {raw_text, screenshot_base64, timing}
    
    API->>TD: process_report(task_id, raw_text)
    
    TD->>PARSER: parse(raw_text, marketplace)
    PARSER->>AI: Extract product data...
    AI-->>PARSER: JSON {price, stock, rating, ...}
    PARSER-->>TD: parsed_data
    
    TD->>PG: INSERT INTO price_history
    TD->>PG: UPDATE tasks SET status='completed'
    
    TD->>SEM: release(agent_ip, target_domain)
    
    TD->>ALERT: check_alerts(sku, new_price, old_price)
    
    alt Демпинг обнаружен
        ALERT->>PG: INSERT INTO notifications
        ALERT->>API: send_notification(users, alert)
    end
    
    TD-->>API: success
    API-->>AG: 200 OK
```

### 1.3.3 Поток команд управления

```mermaid
sequenceDiagram
    participant ADMIN as Admin (Open WebUI)
    participant MW as Middleware
    participant WS as WebSocket Server
    participant AG as Watcher Agent
    
    ADMIN->>MW: POST /api/v1/watcher/agents/{id}/command
    Note over ADMIN,MW: {command: "pause"}
    
    MW->>WS: send_command(agent_id, "pause")
    WS->>AG: WSS: {"type": "command", "action": "pause"}
    
    AG->>AG: pause_execution()
    AG->>WS: WSS: {"type": "ack", "status": "paused"}
    
    WS-->>MW: command_delivered
    MW-->>ADMIN: 200 OK
```

### 1.3.4 Поток копирования cookies

```mermaid
sequenceDiagram
    participant SCHED as Windows Scheduler
    participant CLONER as Browser Cloner
    participant CHROME as Chrome Profile
    participant AGENT as Watcher Agent
    participant API as REST API
    
    Note over SCHED: 20:00 - Trigger
    
    SCHED->>CLONER: run()
    
    CLONER->>CLONER: kill_chrome_processes()
    CLONER->>CHROME: read Cookies SQLite
    CLONER->>CLONER: decrypt_cookies(DPAPI)
    CLONER->>AGENT: save_cookies(cookies.json)
    
    CLONER->>CLONER: switch_network(USB_MODEM)
    
    CLONER->>API: POST /api/v1/watcher/agents/{id}/status
    Note over CLONER,API: {status: "ready", cookies_updated: true}
    
    API-->>CLONER: 200 OK
```

---

## 1.4 Сетевая архитектура

### 1.4.1 Split Tunneling

```mermaid
graph LR
    subgraph AGENT_PC["ПК Агента"]
        AGENT["Watcher Agent"]
        SYSTEM["System Services"]
    end
    
    subgraph NETWORK["Сетевые интерфейсы"]
        ETH["Ethernet<br/>(Office LAN)"]
        USB["USB-модем<br/>(Mobile IP)"]
    end
    
    subgraph DESTINATIONS["Назначение"]
        VPS["VPS Server<br/>(API)"]
        MP["Маркетплейсы<br/>(WB, Ozon, YM)"]
        CORP["Корпоративные<br/>ресурсы"]
    end
    
    AGENT -->|Route: Marketplaces| USB --> MP
    AGENT -->|Route: VPS API| ETH --> VPS
    SYSTEM -->|Default route| ETH --> CORP
```

### 1.4.2 Таблица маршрутизации агента

| Назначение | Маска | Интерфейс | Примечание |
|------------|-------|-----------|------------|
| `*.wildberries.ru` | — | USB-модем | Парсинг WB |
| `*.ozon.ru` | — | USB-модем | Парсинг Ozon |
| `*.yandex.ru` | — | USB-модем | Парсинг YM |
| `market.yandex.ru` | — | USB-модем | Парсинг YM |
| VPS IP | /32 | Ethernet | API сервера |
| `0.0.0.0` | /0 | Ethernet | Default route |

### 1.4.3 IP Semaphore

```mermaid
graph TB
    subgraph AGENTS["Агенты"]
        A1["Agent 1<br/>IP: 10.0.0.1"]
        A2["Agent 2<br/>IP: 10.0.0.2"]
        A3["Agent 3<br/>IP: 10.0.0.3"]
    end
    
    subgraph SEMAPHORE["IP Semaphore (Redis)"]
        S1["ip:10.0.0.1:wb.ru = locked"]
        S2["ip:10.0.0.2:ozon.ru = locked"]
        S3["ip:10.0.0.3:wb.ru = locked"]
    end
    
    subgraph RULE["Правило"]
        R["1 IP = 1 домен<br/>в единицу времени"]
    end
    
    A1 -.->|lock| S1
    A2 -.->|lock| S2
    A3 -.->|lock| S3
```

**Логика:**

1. Агент запрашивает задачу
2. Task Dispatcher проверяет: свободен ли IP агента для целевого домена?
3. Если да — выдаёт задачу и блокирует `ip:{agent_ip}:domain:{domain}`
4. Если нет — возвращает 204 No Content
5. После завершения задачи — снимает блокировку

**TTL блокировки:** 5 минут (защита от зависших агентов)

---

## 1.5 Зависимости от ADOLF Core

### 1.5.1 Middleware

```mermaid
graph LR
    subgraph CLIENT["Client"]
        OWUI["Open WebUI"]
        AGENT["Watcher Agent"]
    end
    
    subgraph CORE["ADOLF Core"]
        MW["Middleware"]
        AUTH["Auth Service"]
    end
    
    subgraph WATCHER["Watcher"]
        API["Watcher API"]
    end
    
    OWUI -->|user_id, role| MW
    MW -->|auth check| AUTH
    MW -->|proxy| API
    
    AGENT -->|api_key| API
```

**Функции Middleware для Watcher:**

| Функция | Описание |
|---------|----------|
| Авторизация пользователей | Проверка роли (Manager+) для Open WebUI |
| Фильтрация по бренду | brand_id injection в запросы |
| Проксирование | Маршрутизация `/api/v1/watcher/*` |
| Аудит | Логирование действий пользователей |

### 1.5.2 PostgreSQL

Watcher добавляет следующие таблицы в общую БД:

| Таблица | Назначение |
|---------|------------|
| `watcher_agents` | Реестр агентов |
| `watcher_tasks` | Очередь и история задач |
| `watcher_competitors` | Конкуренты |
| `watcher_subscriptions` | Подписки на мониторинг SKU |
| `watcher_price_history` | История цен |
| `watcher_alerts` | Демпинг-алерты |
| `watcher_settings` | Настройки модуля |

### 1.5.3 Celery

Watcher использует общую инфраструктуру Celery:

| Задача | Очередь | Расписание |
|--------|---------|------------|
| `watcher.generate_tasks` | default | 20:30 ежедневно |
| `watcher.check_alerts` | default | */15 минут |
| `watcher.cleanup_old_tasks` | default | 03:00 ежедневно |
| `watcher.sync_agent_status` | critical | */1 минута |
| `watcher.calculate_priorities` | heavy | 04:00 ежедневно |

### 1.5.4 Redis

| Ключ | Назначение | TTL |
|------|------------|-----|
| `watcher:task_queue:{marketplace}` | Очередь задач по маркетплейсам | — |
| `watcher:ip_semaphore:{ip}:{domain}` | Блокировка IP для домена | 5 мин |
| `watcher:agent:{id}:status` | Текущий статус агента | 2 мин |
| `watcher:agent:{id}:ws_session` | WebSocket session ID | — |
| `watcher:stats:daily` | Дневная статистика | 24 ч |

### 1.5.5 Notifications

| Событие | Уровень | Получатели |
|---------|---------|------------|
| Демпинг-алерт | warning | Manager (по бренду), Senior, Director |
| Агент offline | warning | Administrator |
| CAPTCHA/блокировка | warning | Administrator |
| Cookies истекли | warning | Administrator |
| Критическая ошибка | critical | Administrator |

---

## 1.6 Интеграция с модулями-потребителями

### 1.6.1 Marketing

```mermaid
sequenceDiagram
    participant MKT as Marketing Module
    participant API as Watcher API
    participant PG as PostgreSQL
    
    MKT->>API: GET /api/v1/watcher/prices/competitors
    Note over MKT,API: ?sku=OM-12345&marketplace=wb
    
    API->>PG: SELECT FROM watcher_price_history
    PG-->>API: competitor_prices[]
    
    API-->>MKT: {competitors: [{name, price, position, bid}]}
    
    Note over MKT: Bid Correction:<br/>new_bid = competitor_bid + 1₽
```

### 1.6.2 Scout

```mermaid
sequenceDiagram
    participant SCOUT as Scout Module
    participant API as Watcher API
    participant PG as PostgreSQL
    
    SCOUT->>API: GET /api/v1/watcher/category/analysis
    Note over SCOUT,API: ?category_url=...
    
    API->>PG: SELECT FROM watcher_price_history
    Note over API,PG: Агрегация: avg_price, price_range,<br/>top_sellers, monopoly_rate
    
    PG-->>API: aggregated_data
    API-->>SCOUT: {avg_price, monopoly_rate, top_sellers[]}
    
    Note over SCOUT: Unit-Calc:<br/>margin = market_price - costs
```

### 1.6.3 Content Factory (v2.0)

```mermaid
sequenceDiagram
    participant CF as Content Factory
    participant API as Watcher API
    participant PG as PostgreSQL
    
    CF->>API: GET /api/v1/watcher/competitors/cards
    Note over CF,API: ?sku=OM-12345&top=20
    
    API->>PG: SELECT FROM watcher_price_history
    Note over API,PG: JOIN card_content
    
    PG-->>API: competitor_cards[]
    API-->>CF: {cards: [{title, description, attributes}]}
    
    Note over CF: TF-IDF анализ<br/>для генерации контента
```

### 1.6.4 Lex

Lex использует инфраструктуру Watcher:

| Компонент Watcher | Использование в Lex |
|-------------------|---------------------|
| Agent | Парсинг КонсультантПлюс, Гарант |
| Task Dispatcher | Распределение задач парсинга |
| Browser Cloner | Не используется (публичный доступ) |
| AI Parser | Извлечение текста документов |

**Отличия:**

| Параметр | Watcher | Lex |
|----------|---------|-----|
| Цели | WB, Ozon, YM | КонсультантПлюс, Гарант |
| Расписание | Ежедневно 21:00–07:00 | Выходные + вечера |
| Output | JSON → PostgreSQL | Markdown → Knowledge Base |
| Cookies | Менеджера | Не требуются |

---

## 1.7 Безопасность

### 1.7.1 Аутентификация

| Компонент | Метод | Описание |
|-----------|-------|----------|
| Open WebUI → Middleware | JWT | Сессия пользователя |
| Agent → API | API Key | Уникальный ключ агента |
| WebSocket | API Key | В query string при подключении |

### 1.7.2 Авторизация

| Действие | Проверка |
|----------|----------|
| Просмотр цен | role ∈ {manager, senior, director, admin} |
| Добавление SKU | role ∈ {manager, senior, director, admin} |
| Настройка алертов | role = admin |
| Управление агентами | role = admin |
| Выполнение задач | valid api_key |

### 1.7.3 Защита данных

| Данные | Защита |
|--------|--------|
| Cookies менеджеров | Локальное хранение, не передаются на сервер |
| API Keys | Хеширование в БД, передача по HTTPS |
| Результаты парсинга | Шифрование в transit (TLS) |
| История цен | Фильтрация по brand_id |

### 1.7.4 Сетевая безопасность

| Мера | Описание |
|------|----------|
| HTTPS only | Все API endpoints |
| WSS only | WebSocket соединения |
| IP whitelist | Опционально для агентов |
| Rate limiting | 100 req/min на агента |

---

## 1.8 Отказоустойчивость

### 1.8.1 Сбой агента

```mermaid
graph TD
    A["Агент перестал отвечать"] --> B["Heartbeat timeout (2 мин)"]
    B --> C["Статус = offline"]
    C --> D["Задачи агента возвращаются в очередь"]
    D --> E["Алерт администратору"]
    E --> F["Task Dispatcher исключает агента"]
    F --> G["Задачи распределяются на других агентов"]
```

### 1.8.2 Потеря связи агента с сервером

```mermaid
graph TD
    A["Потеря связи"] --> B["Агент продолжает из локального кэша"]
    B --> C["Результаты накапливаются локально"]
    C --> D["Retry с exponential backoff"]
    D --> E{"Связь восстановлена?"}
    E -->|Да| F["Отправка накопленных результатов"]
    E -->|Нет| G["Продолжение из кэша"]
    G --> D
```

### 1.8.3 CAPTCHA / Блокировка

```mermaid
graph TD
    A["Обнаружена CAPTCHA/403"] --> B["PANIC mode"]
    B --> C["Отправка флага на сервер"]
    C --> D["Блокировка IP на 60 мин"]
    D --> E["Попытка перезагрузки модема"]
    E --> F{"Программная перезагрузка?"}
    F -->|Успех| G["Новый IP, продолжение"]
    F -->|Неудача| H["Аппаратная перезагрузка"]
    H --> I{"Успех?"}
    I -->|Да| G
    I -->|Нет| J["Алерт администратору"]
    J --> K["Агент ждёт ручного вмешательства"]
```

### 1.8.4 Невалидные cookies

```mermaid
graph TD
    A["Cookies истекли/невалидны"] --> B["Ошибка авторизации на маркетплейсе"]
    B --> C["Агент помечается как cookie_expired"]
    C --> D["Задачи перераспределяются"]
    D --> E["Алерт администратору"]
    E --> F["Ожидание следующего копирования cookies"]
```

---

## 1.9 Мониторинг

### 1.9.1 Метрики агентов

| Метрика | Описание | Хранение |
|---------|----------|----------|
| `agent_status` | online/offline/error | Redis |
| `agent_tasks_completed` | Выполнено задач за ночь | PostgreSQL |
| `agent_tasks_failed` | Ошибки за ночь | PostgreSQL |
| `agent_speed` | URL/минута | Redis |
| `agent_last_activity` | Timestamp | Redis |
| `agent_current_task` | ID текущей задачи | Redis |

### 1.9.2 Метрики системы

| Метрика | Описание |
|---------|----------|
| `total_tasks_queued` | Задач в очереди |
| `total_tasks_completed` | Выполнено за период |
| `total_tasks_failed` | Ошибок за период |
| `avg_parse_time` | Среднее время парсинга |
| `captcha_rate` | % CAPTCHA от общего числа |
| `alert_count` | Сгенерировано алертов |

### 1.9.3 Health Checks

| Проверка | Интервал | Действие при сбое |
|----------|----------|-------------------|
| Agent heartbeat | 30 сек | Статус = offline через 2 мин |
| API availability | 1 мин | Алерт администратору |
| Redis connection | 30 сек | Алерт, fallback |
| PostgreSQL connection | 30 сек | Алерт, retry |
| AI Parser availability | 5 мин | Алерт, очередь накапливается |

---

## 1.10 Конфигурация

### 1.10.1 Серверная конфигурация (Environment)

```bash
# Database
DATABASE_URL=postgresql://adolf:password@postgres:5432/adolf

# Redis
REDIS_URL=redis://redis:6379/0

# AI
TIMEWEB_AI_URL=https://api.timeweb.cloud/ai/v1
TIMEWEB_AI_KEY=xxx

# Watcher settings
WATCHER_TASK_BATCH_SIZE=100
WATCHER_IP_SEMAPHORE_TTL=300
WATCHER_AGENT_HEARTBEAT_TIMEOUT=120
WATCHER_PANIC_COOLDOWN=3600

# Alerts
WATCHER_ALERT_CHECK_INTERVAL=900
```

### 1.10.2 Конфигурация агента (config.yaml)

```yaml
# Идентификация
agent_id: "AGENT-PC1"
api_key: "watcher_agent_key_xxx"

# Сервер
server:
  api_url: "https://adolf.su/api/v1/watcher"
  ws_url: "wss://adolf.su/ws/watcher"
  timeout: 30
  retry_attempts: 3
  retry_delay: 5

# Сеть
network:
  modem_interface: "Mobile Broadband"
  office_interface: "Ethernet"
  modem_com_port: "COM3"
  modem_baud_rate: 115200

# Расписание
schedule:
  cookies_copy_time: "20:00"
  work_start_time: "21:00"
  work_end_time: "07:00"

# Браузер
browser:
  chrome_profile_path: "C:\\Users\\Manager\\AppData\\Local\\Google\\Chrome\\User Data\\Default"
  headless: true
  user_agent: "Mozilla/5.0 ..."

# Эмуляция (локальные переопределения)
emulation:
  # null = использовать серверные настройки
  min_delay: null
  max_delay: null
  scroll_enabled: null
  mouse_movement: null

# Локальный кэш
cache:
  enabled: true
  max_tasks: 500
  db_path: "./cache.db"

# Логирование
logging:
  level: "INFO"
  file: "./logs/agent.log"
  max_size_mb: 50
  backup_count: 5
```

### 1.10.3 Глобальные настройки эмуляции (PostgreSQL)

```sql
-- watcher_settings
INSERT INTO watcher_settings (key, value, description) VALUES
('emulation.min_delay_ms', '2000', 'Минимальная задержка между действиями'),
('emulation.max_delay_ms', '5000', 'Максимальная задержка между действиями'),
('emulation.scroll_enabled', 'true', 'Включить эмуляцию скролла'),
('emulation.scroll_steps', '3', 'Количество шагов скролла'),
('emulation.mouse_movement', 'true', 'Включить движения мыши'),
('emulation.mouse_curve', 'bezier', 'Тип кривой движения мыши'),
('emulation.page_view_min_ms', '3000', 'Минимальное время просмотра страницы'),
('emulation.page_view_max_ms', '8000', 'Максимальное время просмотра страницы'),
('emulation.random_order', 'true', 'Случайный порядок обхода URL');
```

---

## 1.11 Масштабирование

### 1.11.1 Горизонтальное (агенты)

| Параметр | Мин | Рекомендуемо | Макс |
|----------|:---:|:------------:|:----:|
| Агентов | 3 | 10 | 15 |
| URL/ночь | 33 000 | 33 000 | 33 000 |
| URL/агент | 11 000 | 3 300 | 2 200 |
| URL/мин | 18 | 5.5 | 3.7 |

### 1.11.2 Вертикальное (сервер)

| Нагрузка | CPU | RAM | Описание |
|----------|:---:|:---:|----------|
| 3-5 агентов | 2 | 4 GB | Минимальная |
| 6-10 агентов | 4 | 8 GB | Рекомендуемая |
| 11-15 агентов | 4 | 16 GB | Максимальная |

### 1.11.3 Ограничения

| Ресурс | Лимит | Причина |
|--------|-------|---------|
| Агентов | 15 | Количество офисных ПК |
| URL/ночь | ~50 000 | 10-часовое окно × производительность |
| AI Parser | 60 req/min | Rate limit Timeweb AI |

---

## 1.12 Диаграмма развёртывания

```mermaid
graph TB
    subgraph OFFICE["Офис (Windows 10/11)"]
        subgraph PC1["PC-MANAGER-1"]
            SVC1["Watcher Service"]
            CONF1["config.yaml"]
            CACHE1["cache.db"]
            LOG1["logs/"]
        end
        
        subgraph PC2["PC-MANAGER-2"]
            SVC2["Watcher Service"]
            CONF2["config.yaml"]
            CACHE2["cache.db"]
            LOG2["logs/"]
        end
    end
    
    subgraph VPS["VPS Timeweb Cloud (Ubuntu 24)"]
        subgraph DOCKER["Docker Compose"]
            NGINX["Nginx<br/>:443"]
            API["Watcher API<br/>:8001"]
            CELERY_W["Celery Worker"]
            CELERY_B["Celery Beat"]
        end
        
        subgraph DATA["Data Layer"]
            PG["PostgreSQL<br/>:5432"]
            REDIS["Redis<br/>:6379"]
        end
    end
    
    subgraph EXTERNAL["External"]
        AI["Timeweb AI"]
    end
    
    PC1 & PC2 <-->|HTTPS/WSS| NGINX
    NGINX --> API
    API --> PG & REDIS
    API --> AI
    CELERY_W --> PG & REDIS
    CELERY_B --> REDIS
```

---

## Приложение А: Контрольные точки архитектуры

| Критерий | Проверка |
|----------|----------|
| Агенты подключаются | WebSocket сессии активны |
| Task Dispatcher работает | Задачи распределяются равномерно |
| IP Semaphore работает | Нет коллизий IP в логах |
| AI Parser отвечает | Время ответа < 5 сек |
| Алерты генерируются | Уведомления приходят в Open WebUI |
| Данные сохраняются | Записи в price_history появляются |
| Интеграции работают | Marketing, Scout получают данные |

---

**Документ подготовлен:** Январь 2026  
**Версия:** 2.0  
**Статус:** Черновик

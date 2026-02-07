---
title: "Раздел 1: Архитектура"
mode: "wide"
---

**Проект:** Автоматизированный правовой мониторинг для e-commerce  
**Модуль:** Lex / Architecture  
**Версия:** 1.0  
**Дата:** Январь 2026

---

## 1.1 Обзор архитектуры

### Принципы проектирования

| Принцип | Описание |
|---------|----------|
| Reuse Infrastructure | Использование инфраструктуры Watcher (агенты, Task Dispatcher) |
| AI-First | Фильтрация, классификация и резюмирование через LLM |
| Knowledge-Centric | Все документы индексируются в Knowledge Base для RAG |
| Event-Driven | Алерты генерируются при обнаружении релевантных документов |
| Configurable | Ключевые слова и пороги настраиваются администратором |

### Ключевая особенность

Lex не имеет собственных агентов — задачи парсинга добавляются в очередь Watcher и выполняются теми же агентами в ночное время. Это обеспечивает:

- Отсутствие дублирования инфраструктуры
- Единое управление агентами
- Общий пул ресурсов (IP-адреса, вычислительные мощности)
- Упрощённое администрирование

---

## 1.2 Границы модуля

### Входит в модуль Lex

| Компонент | Описание |
|-----------|----------|
| Task Generator | Формирование задач парсинга для Watcher |
| Source Adapters | Адаптеры для КонсультантПлюс и Гарант |
| AI Filter | Оценка релевантности документа (GPT-5 mini) |
| AI Classifier | Определение категории и уровня релевантности |
| AI Summarizer | Генерация резюме документа |
| Document Formatter | Формирование Markdown для Knowledge Base |
| Alert Engine | Генерация алертов о новых документах |
| REST API | Endpoints для управления модулем |
| Open WebUI Pipeline | Интерфейс `@Adolf_Lex` |
| Manual Upload Handler | Обработка ручной загрузки документов |

### Не входит в модуль Lex (используется из других модулей)

| Компонент | Где реализовано | Тип взаимодействия |
|-----------|-----------------|-------------------|
| Watcher Agents | ADOLF Watcher | Выполнение задач парсинга |
| Task Dispatcher | ADOLF Watcher | Распределение задач |
| IP Semaphore | ADOLF Watcher | Предотвращение коллизий |
| Knowledge Base | ADOLF Knowledge | Хранение документов |
| RAG Pipeline | ADOLF Knowledge | Поиск по документам |
| ETL | ADOLF Core | Индексация документов в KB |
| Авторизация | ADOLF Core (Middleware) | Проверка ролей |
| PostgreSQL | ADOLF Core | Метаданные, алерты, настройки |
| Notifications | ADOLF Core | Отправка алертов |
| Celery | ADOLF Core | Фоновые задачи |

### Функционал v2.0 (не входит в MVP)

| Компонент | Описание |
|-----------|----------|
| Additional Sources | 6 дополнительных источников (pravo.gov.ru, ФНС и др.) |
| Deadline Reminders | Напоминания о сроках вступления в силу |
| Reputation Integration | Подсказки статей закона при ответе на претензию |
| Content Factory Integration | Проверка описаний на соответствие требованиям |
| CFO Integration | Алерты об изменениях налогового законодательства |
| Weekly Digest | Еженедельный дайджест изменений |
| Version Compare | Сравнение версий документа |

---

## 1.3 Архитектура модуля

### 1.3.1 Общая схема

```mermaid
graph TB
    subgraph USERS["Пользователи"]
        U1["Manager"]
        U2["Senior"]
        U3["Director"]
        U4["Admin"]
    end

    subgraph INTERFACE["Интерфейс"]
        OWUI_LEX["Open WebUI<br/>@Adolf_Lex"]
        OWUI_KB["Open WebUI<br/>@Adolf_Knowledge"]
    end

    subgraph LEX_MODULE["Lex Module"]
        API["REST API"]
        TASK_GEN["Task Generator"]
        FILTER["AI Filter"]
        CLASSIFIER["AI Classifier"]
        SUMMARIZER["AI Summarizer"]
        FORMATTER["Document Formatter"]
        ALERT["Alert Engine"]
        UPLOAD["Manual Upload Handler"]
    end

    subgraph WATCHER["ADOLF Watcher"]
        TD["Task Dispatcher"]
        AGENTS["Watcher Agents"]
        QUEUE["Task Queue<br/>(Redis)"]
    end

    subgraph CORE["ADOLF Core"]
        MW["Middleware"]
        PG["PostgreSQL"]
        CELERY["Celery"]
        ETL["ETL"]
        NOTIF["Notifications"]
    end

    subgraph KNOWLEDGE["ADOLF Knowledge"]
        KB["Knowledge Base<br/>(Timeweb KB)"]
        RAG["RAG Pipeline"]
    end

    subgraph EXTERNAL["Внешние сервисы"]
        CP["КонсультантПлюс"]
        GR["Гарант"]
        GPT["GPT-5 mini"]
    end

    U1 & U2 & U3 & U4 --> OWUI_LEX
    U1 & U2 & U3 & U4 --> OWUI_KB
    
    OWUI_LEX --> MW
    OWUI_KB --> MW
    MW --> API
    MW --> RAG
    
    API --> TASK_GEN
    API --> ALERT
    API --> UPLOAD
    
    TASK_GEN --> QUEUE
    QUEUE --> TD
    TD --> AGENTS
    AGENTS -->|парсинг| CP & GR
    AGENTS -->|raw HTML| TD
    
    TD --> FILTER
    FILTER --> GPT
    FILTER -->|релевантные| CLASSIFIER
    CLASSIFIER --> GPT
    CLASSIFIER --> SUMMARIZER
    SUMMARIZER --> GPT
    SUMMARIZER --> FORMATTER
    
    FORMATTER --> ETL
    ETL --> KB
    FORMATTER --> PG
    
    FILTER --> ALERT
    ALERT --> NOTIF
    ALERT --> PG
    
    UPLOAD --> FILTER
    
    CELERY --> TASK_GEN
    RAG --> KB
```

### 1.3.2 Схема потока данных

```mermaid
flowchart LR
    subgraph INPUT["Входные данные"]
        AUTO["Автоматический сбор<br/>(Watcher Agents)"]
        MANUAL["Ручная загрузка<br/>(Senior+)"]
    end

    subgraph PARSE["Парсинг"]
        EXTRACT["Извлечение текста"]
        METADATA["Извлечение метаданных"]
    end

    subgraph AI_PROCESS["AI-обработка"]
        RELEVANCE["Оценка релевантности"]
        CATEGORY["Классификация"]
        SUMMARY["Генерация резюме"]
    end

    subgraph OUTPUT["Результат"]
        KB_DOC["Документ в KB"]
        DB_META["Метаданные в PostgreSQL"]
        ALERT_OUT["Алерт пользователям"]
    end

    AUTO --> EXTRACT
    MANUAL --> EXTRACT
    
    EXTRACT --> METADATA
    METADATA --> RELEVANCE
    
    RELEVANCE -->|< порога| REJECT["Отклонён"]
    RELEVANCE -->|>= порога| CATEGORY
    
    CATEGORY --> SUMMARY
    SUMMARY --> KB_DOC
    SUMMARY --> DB_META
    SUMMARY --> ALERT_OUT
```

### 1.3.3 Схема компонентов

```mermaid
graph TB
    subgraph LEX_API["Lex REST API"]
        ROUTES["Router"]
        
        subgraph ENDPOINTS["Endpoints"]
            EP_ALERTS["/alerts"]
            EP_DOCS["/documents"]
            EP_STATS["/statistics"]
            EP_SETTINGS["/settings"]
            EP_UPLOAD["/upload"]
        end
    end

    subgraph LEX_SERVICES["Lex Services"]
        TASK_SVC["Task Generator Service"]
        FILTER_SVC["AI Filter Service"]
        CLASS_SVC["AI Classifier Service"]
        SUMMARY_SVC["AI Summarizer Service"]
        FORMAT_SVC["Document Formatter Service"]
        ALERT_SVC["Alert Engine Service"]
        UPLOAD_SVC["Upload Service"]
        STATS_SVC["Statistics Service"]
    end

    subgraph LEX_ADAPTERS["Source Adapters"]
        CP_ADAPTER["КонсультантПлюс Adapter"]
        GR_ADAPTER["Гарант Adapter"]
    end

    subgraph AI_LAYER["AI Layer"]
        GPT["GPT-5 mini Client"]
    end

    ROUTES --> EP_ALERTS & EP_DOCS & EP_STATS & EP_SETTINGS & EP_UPLOAD
    
    EP_ALERTS --> ALERT_SVC
    EP_DOCS --> FILTER_SVC & FORMAT_SVC
    EP_STATS --> STATS_SVC
    EP_SETTINGS --> TASK_SVC
    EP_UPLOAD --> UPLOAD_SVC
    
    TASK_SVC --> CP_ADAPTER & GR_ADAPTER
    UPLOAD_SVC --> FILTER_SVC
    FILTER_SVC --> GPT
    CLASS_SVC --> GPT
    SUMMARY_SVC --> GPT
```

---

## 1.4 Зависимости от ADOLF Watcher

### 1.4.1 Используемые компоненты

| Компонент Watcher | Использование в Lex | Модификации |
|-------------------|---------------------|-------------|
| Task Dispatcher | Распределение задач парсинга | Новый тип задач `lex_parse` |
| Task Queue (Redis) | Очередь задач | Общая очередь с Watcher |
| Watcher Agents | Выполнение парсинга | Без изменений |
| AI Parser | Базовое извлечение текста | Расширен для правовых документов |
| IP Semaphore | Предотвращение коллизий | Без изменений |

### 1.4.2 Интеграция с Task Dispatcher

```mermaid
sequenceDiagram
    participant CELERY as Celery Beat
    participant LEX as Lex Task Generator
    participant QUEUE as Redis Queue
    participant TD as Task Dispatcher
    participant AGENT as Watcher Agent
    participant SOURCE as КонсультантПлюс/Гарант

    Note over CELERY: 21:00 - Trigger

    CELERY->>LEX: generate_lex_tasks()
    
    LEX->>LEX: Загрузить список источников
    LEX->>LEX: Сформировать URL для парсинга
    
    loop Для каждого URL
        LEX->>QUEUE: RPUSH task_queue:lex {task}
    end
    
    Note over TD: Task Dispatcher обрабатывает<br/>задачи lex наравне с watcher

    TD->>QUEUE: LPOP task_queue:lex
    QUEUE-->>TD: task_data
    
    TD->>AGENT: Assign task
    AGENT->>SOURCE: GET URL (Playwright)
    SOURCE-->>AGENT: HTML
    
    AGENT->>TD: POST /report {raw_html}
    
    Note over TD: Передача в Lex AI Pipeline
    TD->>LEX: process_document(raw_html)
```

### 1.4.3 Типы задач

| Тип задачи | Очередь | Источник | Обработчик |
|------------|---------|----------|------------|
| `watcher_parse` | `task_queue:watcher` | WB, Ozon, YM | Watcher AI Parser |
| `lex_parse` | `task_queue:lex` | КонсультантПлюс, Гарант | Lex AI Pipeline |

### 1.4.4 Отличия от задач Watcher

| Параметр | Watcher Task | Lex Task |
|----------|--------------|----------|
| Cookies | Требуются (менеджера МП) | Не требуются |
| Эмуляция поведения | Полная (scroll, mouse) | Минимальная |
| Output | JSON → PostgreSQL | Markdown → Knowledge Base |
| AI-обработка | Извлечение структурированных данных | Фильтрация + резюме |
| Приоритет | Высокий (ценовой мониторинг) | Средний |

---

## 1.5 Зависимости от ADOLF Knowledge

### 1.5.1 Используемые компоненты

| Компонент Knowledge | Использование в Lex |
|---------------------|---------------------|
| Timeweb KB | Хранение полных текстов документов |
| RAG Pipeline | Поиск по правовым документам |
| ETL | Индексация новых документов |
| Document Metadata | Структура YAML-заголовка |

### 1.5.2 Формат документа для KB

```yaml
---
# Системные метаданные (совместимо с Knowledge)
source: consultant_plus
category: consumer_rights
access_level: manager
brand_id: shared
indexed_at: 2026-01-20T10:30:00Z

# Специфичные метаданные Lex
document_type: federal_law
document_number: "ФЗ-2300-1"
document_date: 2025-12-15
effective_date: 2026-03-01
relevance: high
original_url: "https://www.consultant.ru/document/..."
---

## Резюме

**Название:** О защите прав потребителей (в редакции от 15.12.2025)
**Суть:** Новые правила возврата товаров, купленных дистанционным способом
**На кого распространяется:** Продавцы, маркетплейсы, покупатели
**Срок вступления в силу:** 01.03.2026
**Ключевые положения:**
- Срок возврата увеличен до 30 дней для товаров, купленных на маркетплейсах
- Маркетплейс несёт солидарную ответственность с продавцом
- Новые требования к информированию покупателя

**Влияние на бизнес:** Высокое. Необходимо обновить политику возврата и информационные материалы.

---

## Полный текст

[Полный текст документа]
```

### 1.5.3 Интеграция с RAG Pipeline

```mermaid
sequenceDiagram
    participant USER as Пользователь
    participant OWUI as @Adolf_Knowledge
    participant RAG as RAG Pipeline
    participant KB as Knowledge Base
    
    USER->>OWUI: "Какие штрафы за отсутствие маркировки?"
    OWUI->>RAG: search(query, filters)
    
    Note over RAG: filters: {category: marking,<br/>access_level <= user.access_level}
    
    RAG->>KB: Vector search
    KB-->>RAG: Relevant chunks (включая документы Lex)
    
    RAG->>RAG: Rerank & filter
    RAG-->>OWUI: Top-3 chunks + sources
    
    OWUI->>OWUI: Generate response with citations
    OWUI-->>USER: Ответ со ссылками на НПА
```

---

## 1.6 Зависимости от ADOLF Core

### 1.6.1 Middleware (FastAPI)

| Возможность | Применение в Lex |
|-------------|------------------|
| Авторизация | Проверка `role IN (manager, senior, director, admin)` |
| Идентификация | Получение `user_id`, `role` из сессии |
| Роутинг | Регистрация endpoints `/api/v1/lex/*` |
| Аудит | Логирование действий в `audit_log` |

**Разграничение доступа:**

```python
# Проверка доступа к Lex
ALLOWED_ROLES = ["manager", "senior", "director", "admin"]

# Функции с ограниченным доступом
SENIOR_PLUS_FUNCTIONS = [
    "manual_upload",
    "delete_document"
]

ADMIN_ONLY_FUNCTIONS = [
    "edit_keywords",
    "edit_relevance_threshold",
    "manage_sources"
]

def check_lex_access(user: User, function: str) -> bool:
    if user.role not in ALLOWED_ROLES:
        return False
    
    if function in ADMIN_ONLY_FUNCTIONS:
        return user.role == "admin"
    
    if function in SENIOR_PLUS_FUNCTIONS:
        return user.role in ["senior", "director", "admin"]
    
    return True
```

### 1.6.2 PostgreSQL

**Используемые таблицы (существующие):**

| Таблица | Назначение |
|---------|------------|
| `users` | Роль пользователя, проверка доступа |
| `audit_log` | Логи всех действий |
| `notifications` | Уведомления (алерты) |

**Новые таблицы Lex:**

| Таблица | Назначение |
|---------|------------|
| `lex_documents` | Метаданные документов |
| `lex_alerts` | История алертов |
| `lex_keywords` | Ключевые слова для фильтрации |
| `lex_sources` | Источники данных |
| `lex_settings` | Настройки модуля |
| `lex_statistics` | Статистика сбора |

### 1.6.3 Celery

**Фоновые задачи:**

| Задача | Расписание | Описание |
|--------|------------|----------|
| `lex.generate_tasks` | 20:30 (до старта Watcher) | Генерация задач парсинга |
| `lex.process_results` | Continuous | Обработка результатов парсинга |
| `lex.cleanup_old_alerts` | 03:00 ежедневно | Очистка старых алертов |
| `lex.generate_statistics` | 08:00 ежедневно | Формирование статистики |

### 1.6.4 Notifications

**События для уведомлений:**

| Событие | Тип | Уровень | Получатели |
|---------|-----|---------|------------|
| `lex.new_law` | Новый закон | `info` | Manager+ |
| `lex.amendment` | Изменение НПА | `warning` | Manager+ |
| `lex.court_decision` | Судебное решение | `info` | Manager+ |
| `lex.clarification` | Разъяснение госоргана | `info` | Manager+ |
| `lex.effective_soon` | Скоро вступает в силу | `warning` | Manager+ |
| `lex.marketplace_mention` | Упоминание МП | `info` | Manager+ |
| `lex.parse_error` | Ошибка парсинга | `critical` | Admin |
| `lex.source_unavailable` | Источник недоступен | `critical` | Admin |

---

## 1.7 Потоки данных

### 1.7.1 Автоматический сбор документов

```mermaid
sequenceDiagram
    participant BEAT as Celery Beat
    participant LEX as Lex Task Generator
    participant REDIS as Redis
    participant TD as Task Dispatcher
    participant AGENT as Watcher Agent
    participant SOURCE as Источник
    participant FILTER as AI Filter
    participant CLASS as AI Classifier
    participant SUMM as AI Summarizer
    participant KB as Knowledge Base
    participant PG as PostgreSQL
    participant NOTIF as Notifications

    Note over BEAT: 20:30 - Генерация задач Lex

    BEAT->>LEX: generate_tasks()
    LEX->>LEX: Загрузить lex_sources
    LEX->>LEX: Сформировать URL новых документов
    
    loop Для каждого URL
        LEX->>REDIS: RPUSH task_queue:lex
    end
    
    Note over TD: 21:00 - Начало работы агентов

    loop Пока есть задачи
        TD->>REDIS: LPOP task_queue:lex
        REDIS-->>TD: task
        TD->>AGENT: Assign task
        
        AGENT->>SOURCE: GET URL
        SOURCE-->>AGENT: HTML
        AGENT->>TD: POST /report {html, metadata}
        
        TD->>FILTER: evaluate_relevance(text)
        FILTER-->>TD: {score: 0.85, relevant: true}
        
        alt Релевантен
            TD->>CLASS: classify(text)
            CLASS-->>TD: {category: "consumer_rights", relevance: "high"}
            
            TD->>SUMM: summarize(text)
            SUMM-->>TD: {summary: "..."}
            
            TD->>KB: Upload document (Markdown)
            TD->>PG: INSERT INTO lex_documents
            
            TD->>NOTIF: send_alert(document)
        else Не релевантен
            TD->>PG: INSERT INTO lex_statistics (rejected)
        end
    end
```

### 1.7.2 Ручная загрузка документа

```mermaid
sequenceDiagram
    participant USER as Senior/Director
    participant OWUI as @Adolf_Lex
    participant API as Lex API
    participant UPLOAD as Upload Handler
    participant FILTER as AI Filter
    participant CLASS as AI Classifier
    participant SUMM as AI Summarizer
    participant KB as Knowledge Base
    participant PG as PostgreSQL

    USER->>OWUI: Загрузить документ (URL или файл)
    OWUI->>API: POST /api/v1/lex/upload
    
    API->>UPLOAD: process_upload(file_or_url)
    
    alt URL
        UPLOAD->>UPLOAD: fetch_url(url)
        UPLOAD->>UPLOAD: extract_text(html)
    else Файл
        UPLOAD->>UPLOAD: parse_file(pdf/docx)
    end
    
    UPLOAD->>FILTER: evaluate_relevance(text)
    FILTER-->>UPLOAD: {score: 0.72, relevant: true}
    
    alt Релевантен
        UPLOAD->>CLASS: classify(text)
        CLASS-->>UPLOAD: {category, relevance_level}
        
        UPLOAD->>SUMM: summarize(text)
        SUMM-->>UPLOAD: {summary}
        
        UPLOAD->>KB: Upload document
        UPLOAD->>PG: INSERT INTO lex_documents
        
        UPLOAD-->>API: {success: true, document_id: 123}
        API-->>OWUI: Документ добавлен
        OWUI-->>USER: ✅ Документ успешно добавлен
    else Не релевантен
        UPLOAD-->>API: {success: false, reason: "low_relevance"}
        API-->>OWUI: Документ не релевантен
        OWUI-->>USER: ⚠️ Документ не прошёл фильтр релевантности (72%)
    end
```

### 1.7.3 Запрос алертов

```mermaid
sequenceDiagram
    participant USER as Manager
    participant OWUI as @Adolf_Lex
    participant API as Lex API
    participant PG as PostgreSQL

    USER->>OWUI: "Покажи непрочитанные алерты"
    OWUI->>API: GET /api/v1/lex/alerts?status=unread
    
    API->>PG: SELECT * FROM lex_alerts<br/>WHERE user_id = ? AND status = 'unread'
    PG-->>API: alerts[]
    
    API-->>OWUI: {alerts: [...]}
    
    OWUI->>OWUI: Format response
    OWUI-->>USER: Список алертов с резюме
    
    Note over USER: Пользователь читает алерт
    
    USER->>OWUI: "Подробнее про первый"
    OWUI->>API: GET /api/v1/lex/documents/{id}
    API->>PG: SELECT * FROM lex_documents
    PG-->>API: document
    
    API->>API: Fetch from KB if needed
    API-->>OWUI: {document with full text}
    
    OWUI-->>USER: Полная информация о документе
    
    OWUI->>API: PATCH /api/v1/lex/alerts/{id}<br/>{status: "read"}
    API->>PG: UPDATE lex_alerts SET status = 'read'
```

---

## 1.8 REST API

### 1.8.1 Endpoints

| Метод | Endpoint | Описание | Доступ |
|-------|----------|----------|--------|
| GET | `/api/v1/lex/alerts` | Список алертов | Manager+ |
| GET | `/api/v1/lex/alerts/{id}` | Детали алерта | Manager+ |
| PATCH | `/api/v1/lex/alerts/{id}` | Отметить прочитанным | Manager+ |
| GET | `/api/v1/lex/documents` | Список документов | Manager+ |
| GET | `/api/v1/lex/documents/{id}` | Детали документа | Manager+ |
| POST | `/api/v1/lex/upload` | Ручная загрузка | Senior+ |
| DELETE | `/api/v1/lex/documents/{id}` | Удалить документ | Senior+ |
| GET | `/api/v1/lex/statistics` | Статистика | Manager+ |
| GET | `/api/v1/lex/keywords` | Список ключевых слов | Manager+ |
| PUT | `/api/v1/lex/keywords` | Обновить ключевые слова | Admin |
| GET | `/api/v1/lex/settings` | Настройки модуля | Admin |
| PUT | `/api/v1/lex/settings` | Обновить настройки | Admin |
| GET | `/api/v1/lex/sources` | Список источников | Admin |
| PUT | `/api/v1/lex/sources/{id}` | Обновить источник | Admin |

### 1.8.2 Примеры запросов

**Получение алертов:**

```http
GET /api/v1/lex/alerts?status=unread&category=marking&limit=10
Authorization: Bearer {token}

Response 200:
{
  "alerts": [
    {
      "id": 456,
      "document_id": 123,
      "type": "new_law",
      "title": "ФЗ о маркировке товаров лёгкой промышленности",
      "category": "marking",
      "relevance": "high",
      "effective_date": "2026-03-01",
      "summary": "Новые требования к маркировке...",
      "created_at": "2026-01-20T08:00:00Z",
      "status": "unread"
    }
  ],
  "total": 1,
  "unread_count": 1
}
```

**Ручная загрузка документа:**

```http
POST /api/v1/lex/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [PDF/DOCX file]
# или
url: "https://www.consultant.ru/document/..."

Response 200:
{
  "success": true,
  "document_id": 124,
  "relevance_score": 0.85,
  "category": "consumer_rights",
  "relevance_level": "high",
  "summary": "..."
}

Response 400:
{
  "success": false,
  "reason": "low_relevance",
  "relevance_score": 0.42,
  "threshold": 0.60
}
```

---

## 1.9 Конфигурация

### 1.9.1 Environment Variables

```bash
# Database
DATABASE_URL=postgresql://adolf:password@postgres:5432/adolf

# Redis (shared with Watcher)
REDIS_URL=redis://redis:6379/0

# AI
TIMEWEB_AI_URL=https://api.timeweb.cloud/ai/v1
TIMEWEB_AI_KEY=xxx

# Lex settings
LEX_RELEVANCE_THRESHOLD=0.60
LEX_TASK_QUEUE=task_queue:lex
LEX_BATCH_SIZE=50

# Knowledge Base
TIMEWEB_KB_URL=https://api.timeweb.cloud/kb/v1
TIMEWEB_KB_ID=xxx
```

### 1.9.2 Настройки в PostgreSQL

```sql
-- lex_settings
INSERT INTO lex_settings (key, value, description) VALUES
('relevance_threshold', '0.60', 'Минимальный порог релевантности (0-1)'),
('max_documents_per_day', '100', 'Максимум документов в день'),
('alert_on_high_relevance', 'true', 'Алерт только для высокой релевантности'),
('enabled_categories', '["trade","marking","consumer_rights","advertising","tax","labor","personal_data"]', 'Активные категории'),
('parse_full_text', 'true', 'Сохранять полный текст документа');
```

### 1.9.3 Ключевые слова (lex_keywords)

```sql
INSERT INTO lex_keywords (category, keywords, weight) VALUES
('trade', '["маркетплейс","дистанционная торговля","интернет-магазин","розничная торговля","оптовая торговля","электронная коммерция"]', 1.0),
('marking', '["маркировка товаров","Честный ЗНАК","товары лёгкой промышленности","одежда","текстиль","обувь"]', 1.2),
('consumer_rights', '["возврат товара","защита прав потребителей","гарантия","претензия","недостаток товара"]', 1.1),
('advertising', '["реклама в интернете","таргетированная реклама","маркетинг","рекламная деятельность"]', 0.9),
('tax', '["НДС","УСН","налог на прибыль","самозанятые","индивидуальный предприниматель"]', 1.0),
('labor', '["трудовой договор","удалённая работа","дистанционная работа","ГПХ","гражданско-правовой договор"]', 0.8),
('personal_data', '["персональные данные","обработка ПДн","согласие на обработку","оператор ПДн"]', 0.9),
('platforms', '["Wildberries","Ozon","Яндекс.Маркет","Яндекс Маркет"]', 1.5);
```

---

## 1.10 Безопасность

### 1.10.1 Аутентификация

| Компонент | Метод |
|-----------|-------|
| REST API | Bearer Token (через Middleware) |
| Celery Tasks | Internal (без аутентификации) |
| Watcher Integration | Shared API Key |

### 1.10.2 Авторизация

| Действие | Manager | Senior | Director | Admin |
|----------|:-------:|:------:|:--------:|:-----:|
| Просмотр алертов | ✅ | ✅ | ✅ | ✅ |
| Просмотр документов | ✅ | ✅ | ✅ | ✅ |
| Ручная загрузка | ❌ | ✅ | ✅ | ✅ |
| Удаление документов | ❌ | ✅ | ✅ | ✅ |
| Редактирование keywords | ❌ | ❌ | ❌ | ✅ |
| Настройки модуля | ❌ | ❌ | ❌ | ✅ |

### 1.10.3 Валидация данных

| Поле | Валидация |
|------|-----------|
| URL для загрузки | Whitelist доменов (consultant.ru, garant.ru) |
| Файл для загрузки | PDF, DOCX, максимум 10 MB |
| Ключевые слова | Максимум 50 слов на категорию |
| Порог релевантности | 0.0 — 1.0 |

---

## 1.11 Мониторинг

### 1.11.1 Метрики

| Метрика | Описание | Хранение |
|---------|----------|----------|
| `lex.documents.total` | Всего документов в KB | PostgreSQL |
| `lex.documents.today` | Добавлено сегодня | PostgreSQL |
| `lex.documents.rejected` | Отклонено по релевантности | PostgreSQL |
| `lex.alerts.unread` | Непрочитанных алертов | PostgreSQL |
| `lex.parse.success_rate` | Успешность парсинга | PostgreSQL |
| `lex.ai.avg_response_time` | Среднее время AI | Redis |

### 1.11.2 Health Checks

| Проверка | Интервал | Действие при сбое |
|----------|----------|-------------------|
| Watcher Queue availability | 5 мин | Алерт Admin |
| AI Filter availability | 5 мин | Алерт Admin |
| KB connection | 5 мин | Алерт Admin |
| Source availability | 1 час | Алерт Admin |

### 1.11.3 Алерты мониторинга

| Событие | Уровень | Получатель |
|---------|---------|------------|
| Источник недоступен > 1 час | `critical` | Admin |
| AI Filter error rate > 10% | `warning` | Admin |
| 0 документов за ночь | `warning` | Admin |
| KB upload failed | `critical` | Admin |

---

## 1.12 Масштабирование

### 1.12.1 Ограничения

| Ресурс | Лимит | Причина |
|--------|-------|---------|
| Документов в день | ~100 | Rate limit источников |
| Размер документа | 10 MB | Лимит KB |
| AI запросов в минуту | 60 | Rate limit Timeweb AI |
| Задач Lex в очереди | 500 | Приоритет Watcher |

### 1.12.2 Приоритеты очередей

```
Watcher tasks (цены) > Lex tasks (документы)
```

Task Dispatcher обрабатывает задачи Lex с меньшим приоритетом, чтобы не влиять на ценовой мониторинг.

---

## 1.13 Диаграмма развёртывания

```mermaid
graph TB
    subgraph VPS["VPS Timeweb Cloud"]
        subgraph DOCKER["Docker Compose"]
            NGINX["Nginx<br/>:443"]
            API["ADOLF API<br/>(incl. Lex endpoints)"]
            CELERY_W["Celery Worker<br/>(incl. Lex tasks)"]
            CELERY_B["Celery Beat"]
            WATCHER_API["Watcher API"]
        end
        
        subgraph DATA["Data Layer"]
            PG["PostgreSQL<br/>(lex_* tables)"]
            REDIS["Redis<br/>(task_queue:lex)"]
        end
    end
    
    subgraph OFFICE["Офис"]
        AGENTS["Watcher Agents<br/>(выполняют задачи Lex)"]
    end
    
    subgraph EXTERNAL["External Services"]
        KB["Timeweb KB"]
        AI["Timeweb AI"]
        CP["КонсультантПлюс"]
        GR["Гарант"]
    end
    
    NGINX --> API
    NGINX --> WATCHER_API
    API --> PG & REDIS
    API --> AI
    API --> KB
    
    CELERY_W --> PG & REDIS
    CELERY_B --> REDIS
    
    WATCHER_API --> REDIS
    AGENTS <-->|tasks| WATCHER_API
    AGENTS -->|parse| CP & GR
```

---

## 1.14 Структура файлов модуля

```
/app/modules/lex/
├── __init__.py
├── api/
│   ├── __init__.py
│   ├── router.py              # FastAPI роутер
│   ├── schemas.py             # Pydantic модели
│   └── dependencies.py        # Зависимости
├── services/
│   ├── __init__.py
│   ├── task_generator.py      # Генерация задач парсинга
│   ├── ai_filter.py           # Фильтрация по релевантности
│   ├── ai_classifier.py       # Классификация документов
│   ├── ai_summarizer.py       # Генерация резюме
│   ├── document_formatter.py  # Формирование Markdown
│   ├── alert_engine.py        # Генерация алертов
│   ├── upload_handler.py      # Ручная загрузка
│   └── statistics.py          # Статистика
├── adapters/
│   ├── __init__.py
│   ├── consultant_plus.py     # Адаптер КонсультантПлюс
│   └── garant.py              # Адаптер Гарант
├── models/
│   ├── __init__.py
│   ├── document.py            # SQLAlchemy модели
│   ├── alert.py
│   ├── keyword.py
│   └── settings.py
├── tasks/
│   ├── __init__.py
│   ├── generate_tasks.py      # Celery задача генерации
│   ├── process_results.py     # Обработка результатов
│   └── maintenance.py         # Очистка, статистика
├── prompts/
│   ├── __init__.py
│   ├── filter_prompt.py       # Промпт фильтрации
│   ├── classifier_prompt.py   # Промпт классификации
│   └── summarizer_prompt.py   # Промпт резюмирования
└── utils/
    ├── __init__.py
    ├── text_extractor.py      # Извлечение текста
    └── validators.py          # Валидация
```

---

## Приложение А: Контрольные точки архитектуры

| Критерий | Проверка |
|----------|----------|
| Задачи Lex в очереди | `LLEN task_queue:lex` > 0 после 20:30 |
| Агенты обрабатывают Lex | Логи агентов содержат `lex_parse` |
| AI Filter работает | Время ответа < 5 сек |
| Документы в KB | Появляются после ночного цикла |
| Алерты генерируются | Уведомления в Open WebUI |
| Статистика обновляется | Данные в `lex_statistics` |
| Ручная загрузка работает | POST `/upload` возвращает 200 |

---

## Приложение Б: Сравнение с Watcher

| Аспект | Watcher | Lex |
|--------|---------|-----|
| Собственные агенты | ✅ | ❌ (использует Watcher) |
| Очередь задач | `task_queue:watcher` | `task_queue:lex` |
| Cookies | Требуются | Не требуются |
| Output | JSON → PostgreSQL | Markdown → KB |
| AI-обработка | Извлечение данных | Фильтрация + резюме |
| Приоритет | Высокий | Средний |
| Алерты | Демпинг | Новые НПА |
| Интерфейс | `@Adolf_Watcher` | `@Adolf_Lex` + `@Adolf_Knowledge` |

---

**Документ подготовлен:** Январь 2026  
**Версия:** 1.0  
**Статус:** Черновик

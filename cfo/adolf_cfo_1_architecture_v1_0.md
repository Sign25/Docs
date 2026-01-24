# ADOLF CFO — Раздел 1: Архитектура

**Проект:** Финансовый учёт и управленческая аналитика  
**Модуль:** CFO  
**Версия:** 1.0  
**Дата:** Январь 2026

---

## 1.1 Назначение модуля

CFO — модуль автоматизированного управленческого учёта, формирования P&L-отчётов и финансовой аналитики для e-commerce бизнеса на маркетплейсах.

### Основные функции

| Функция | Описание |
|---------|----------|
| Data Ingestion | Ежедневный сбор данных из API маркетплейсов и файлов |
| Cost Mapping | Сопоставление продаж с себестоимостью по Barcode/SKU |
| P&L Calculation | Расчёт маржинальности по всем срезам |
| ABC Analysis | Классификация SKU по вкладу в прибыль |
| AI Insights | Формирование выводов и рекомендаций |
| Custom Reports | Генерация отчётов по запросу пользователя |
| Alerting | Уведомления об убыточных SKU и аномалиях |

### Целевые пользователи

| Роль | Доступ | Функции |
|------|--------|---------|
| Senior | Ограниченный | P&L по категориям/брендам/МП, ABC-анализ |
| Director | Полный | Все отчёты + P&L по SKU + кастомные отчёты |
| Administrator | Полный + настройки | Всё + настройка порогов и расписания |

---

## 1.2 Границы модуля

### Входит в модуль CFO

| Компонент | Описание |
|-----------|----------|
| Marketplace Adapters | Получение финансовых данных через API WB, Ozon, YM |
| File Parsers | Парсинг Excel-отчётов из ЛК маркетплейсов |
| Cost Mapper | Сопоставление продаж с себестоимостью из 1С |
| P&L Calculator | Расчёт маржинальности по всем срезам |
| ABC Analyzer | Классификация SKU (A, B, C, D) |
| AI Insights Generator | Формирование выводов (Claude Opus 4.5) |
| Report Builder | Генерация отчётов по запросу |
| Alert Engine | Обнаружение аномалий и убыточных SKU |
| REST API | Endpoints для управления модулем |
| Open WebUI Pipeline | Интерфейс `@Adolf_CFO` |
| Celery Tasks | Фоновые задачи импорта и расчёта |

### Не входит в модуль CFO

| Компонент | Где реализовано | Тип взаимодействия |
|-----------|-----------------|-------------------|
| Авторизация пользователей | ADOLF Core (Middleware) | Используется готовая |
| Обработка файлов 1С | ADOLF Core (ETL) | Файлы из `/data/inbox` |
| Хранение первички | ADOLF Knowledge | Индексация через ETL |
| Хранение пользователей | ADOLF Core (PostgreSQL) | Чтение таблицы `users` |
| Система уведомлений | ADOLF Core (Notifications) | Event Bus |
| Генерация текста (LLM) | OpenAI API | API-вызовы |

### Функционал v2.0 (не входит в MVP)

| Компонент | Описание |
|-----------|----------|
| 1C Integration | Прямое подключение к 1С через API |
| Extended Costs | Учёт ФОТ, упаковки, доставки до МП |
| Forecasting | Прогнозирование маржинальности |
| Budgeting | План-факт анализ |
| Dashboards | Визуальные графики и диаграммы |
| BI Export | Интеграция с Power BI / Tableau |

---

## 1.3 Архитектура модуля

### 1.3.1 Общая схема

```mermaid
graph TB
    subgraph USERS["Пользователи"]
        U1["Senior"]
        U2["Director"]
        U3["Admin"]
    end

    subgraph INTERFACE["Интерфейс"]
        OWUI["Open WebUI<br/>@Adolf_CFO"]
    end

    subgraph CFO_MODULE["CFO Module"]
        API["REST API"]
        INGEST["Data Ingestion"]
        MAPPER["Cost Mapper"]
        CALC["P&L Calculator"]
        ABC["ABC Analyzer"]
        AI["AI Insights"]
        REPORT["Report Builder"]
        ALERT["Alert Engine"]
    end

    subgraph CORE["ADOLF Core"]
        MW["Middleware"]
        PG["PostgreSQL"]
        CELERY["Celery"]
        ETL["ETL"]
        NOTIF["Notifications"]
    end

    subgraph KNOWLEDGE["ADOLF Knowledge"]
        KB["Knowledge Base"]
    end

    subgraph EXTERNAL["Внешние сервисы"]
        WB_API["Wildberries API"]
        OZON_API["Ozon API"]
        YM_API["Yandex.Market API"]
        CLAUDE["Claude Opus 4.5"]
        GPT["GPT-5 mini"]
    end

    subgraph FILES["Файловые источники"]
        MP_EXCEL["Excel из ЛК МП"]
        C1_FILES["Выгрузки 1С"]
        DOCS["Первичка"]
    end

    U1 & U2 & U3 --> OWUI
    OWUI --> MW
    MW --> API
    
    API --> INGEST
    INGEST --> WB_API & OZON_API & YM_API
    
    MP_EXCEL & C1_FILES & DOCS --> ETL
    ETL --> PG
    ETL --> KB
    
    INGEST --> MAPPER
    MAPPER --> CALC
    CALC --> ABC
    ABC --> AI
    AI --> CLAUDE
    
    AI --> REPORT
    AI --> ALERT
    ALERT --> NOTIF
    
    CALC & ABC & REPORT --> PG
    CELERY --> INGEST
```

### 1.3.2 Схема потока данных

```mermaid
flowchart LR
    subgraph INPUT["Входные данные"]
        API_DATA["API маркетплейсов"]
        EXCEL_DATA["Excel-отчёты"]
        COGS_DATA["Себестоимость (1С)"]
        PRIMARY["Первичка"]
    end

    subgraph PROCESS["Обработка"]
        PARSE["Парсинг"]
        NORMALIZE["Нормализация"]
        MAP["Mapping SKU→COGS"]
        CALCULATE["Расчёт P&L"]
    end

    subgraph ANALYZE["Анализ"]
        ABC_CALC["ABC-классификация"]
        ANOMALY["Детекция аномалий"]
        AI_GEN["AI Insights"]
    end

    subgraph OUTPUT["Результат"]
        REPORTS["Отчёты"]
        ALERTS["Алерты"]
        STORAGE["Хранение"]
    end

    API_DATA --> PARSE
    EXCEL_DATA --> PARSE
    COGS_DATA --> NORMALIZE
    PRIMARY --> NORMALIZE
    
    PARSE --> MAP
    NORMALIZE --> MAP
    MAP --> CALCULATE
    
    CALCULATE --> ABC_CALC
    CALCULATE --> ANOMALY
    ABC_CALC --> AI_GEN
    ANOMALY --> AI_GEN
    
    AI_GEN --> REPORTS
    ANOMALY --> ALERTS
    CALCULATE --> STORAGE
```

### 1.3.3 Компонентная диаграмма

```mermaid
graph TB
    subgraph API_LAYER["API Layer"]
        ROUTES["/api/v1/cfo/*"]
    end
    
    subgraph SERVICE_LAYER["Service Layer"]
        INGEST_SVC["IngestionService"]
        PNL_SVC["PnLService"]
        ABC_SVC["ABCService"]
        REPORT_SVC["ReportService"]
        INSIGHT_SVC["InsightService"]
    end
    
    subgraph ADAPTER_LAYER["Adapter Layer"]
        WB_ADAPTER["WBFinanceAdapter"]
        OZON_ADAPTER["OzonFinanceAdapter"]
        YM_ADAPTER["YMFinanceAdapter"]
        EXCEL_PARSER["ExcelParser"]
        COGS_PARSER["COGSParser"]
    end
    
    subgraph TASK_LAYER["Celery Tasks"]
        IMPORT_TASK["import_marketplace_data"]
        CALC_TASK["calculate_pnl"]
        ABC_TASK["run_abc_analysis"]
        ALERT_TASK["check_alerts"]
    end
    
    subgraph EXTERNAL["External"]
        WB["WB API"]
        OZON["Ozon API"]
        YM["YM API"]
        CLAUDE["Claude Opus"]
    end
    
    ROUTES --> INGEST_SVC & PNL_SVC & ABC_SVC & REPORT_SVC
    
    INGEST_SVC --> WB_ADAPTER & OZON_ADAPTER & YM_ADAPTER
    INGEST_SVC --> EXCEL_PARSER & COGS_PARSER
    
    PNL_SVC --> INGEST_SVC
    ABC_SVC --> PNL_SVC
    REPORT_SVC --> PNL_SVC & ABC_SVC
    INSIGHT_SVC --> CLAUDE
    
    WB_ADAPTER --> WB
    OZON_ADAPTER --> OZON
    YM_ADAPTER --> YM
    
    TASK_LAYER --> INGEST_SVC & PNL_SVC & ABC_SVC
```

---

## 1.4 Зависимости от ADOLF Core

### 1.4.1 Middleware (FastAPI)

**Используемые возможности:**

| Возможность | Применение в CFO |
|-------------|------------------|
| Авторизация | Проверка `role IN (senior, director, admin)` |
| Идентификация | Получение `user_id`, `brand_id` из сессии |
| Роутинг | Регистрация endpoints `/api/v1/cfo/*` |
| Фильтрация | Ограничение данных по роли |
| Аудит | Логирование действий в `audit_log` |

**Разграничение доступа:**

```python
# Проверка доступа к CFO
ALLOWED_ROLES = ["senior", "director", "admin"]

# Функции с ограниченным доступом (только Director+)
DIRECTOR_ONLY_FUNCTIONS = [
    "pnl_by_sku",
    "consolidated_pnl", 
    "sku_cost_price",
    "custom_reports"
]

def check_cfo_access(user: User, function: str) -> bool:
    if user.role not in ALLOWED_ROLES:
        return False
    
    if function in DIRECTOR_ONLY_FUNCTIONS:
        return user.role in ["director", "admin"]
    
    return True
```

### 1.4.2 ETL

**Обрабатываемые файлы:**

| Тип файла | Источник | Обработка |
|-----------|----------|-----------|
| Excel отчёты МП | `/data/inbox/cfo/marketplace/` | Парсинг → `cfo_transactions` |
| Себестоимость 1С | `/data/inbox/cfo/costs/` | Парсинг → `cfo_cost_prices` |
| Первичка | `/data/inbox/cfo/primary/` | OCR → Knowledge Base |

**Структура папок:**

```
/data/inbox/cfo/
├── marketplace/          # Excel-отчёты из ЛК маркетплейсов
│   ├── wb/
│   ├── ozon/
│   └── ym/
├── costs/                # Выгрузки себестоимости из 1С
└── primary/              # Бухгалтерская первичка
```

### 1.4.3 PostgreSQL

**Используемые таблицы:**

| Таблица | Назначение |
|---------|------------|
| `users` | Роль пользователя, проверка доступа |
| `cfo_transactions` | Финансовые транзакции с маркетплейсов |
| `cfo_cost_prices` | Справочник себестоимости (Barcode → COGS) |
| `cfo_pnl_daily` | Ежедневный P&L по SKU |
| `cfo_pnl_aggregated` | Агрегированный P&L по периодам |
| `cfo_abc_results` | Результаты ABC-анализа |
| `cfo_alerts` | История алертов |
| `cfo_reports` | Сохранённые отчёты |
| `cfo_settings` | Настройки модуля (пороги, расписание) |
| `audit_log` | Логи всех действий |

### 1.4.4 Celery

**Фоновые задачи:**

| Задача | Описание | Расписание |
|--------|----------|------------|
| `cfo.import_wb_finance` | Импорт данных Wildberries | Ежедневно 06:00 |
| `cfo.import_ozon_finance` | Импорт данных Ozon | Ежедневно 06:10 |
| `cfo.import_ym_finance` | Импорт данных Яндекс.Маркет | Ежедневно 06:20 |
| `cfo.process_excel_reports` | Обработка Excel из ETL | Ежедневно 06:30 |
| `cfo.process_cost_prices` | Обработка себестоимости | Еженедельно (Пн 07:00) |
| `cfo.calculate_daily_pnl` | Расчёт дневного P&L | Ежедневно 07:00 |
| `cfo.run_abc_analysis` | ABC-анализ | Еженедельно (Пн 08:00) |
| `cfo.check_alerts` | Проверка алертов | Ежедневно 08:00 |
| `cfo.cleanup_old_data` | Очистка старых данных | Ежемесячно |

### 1.4.5 Notifications

**События для уведомлений:**

| Событие | Уровень | Получатели | Описание |
|---------|---------|------------|----------|
| `cfo.sku_negative_margin` | warning | Senior, Director | SKU с отрицательной маржой (класс D) |
| `cfo.margin_below_threshold` | warning | Senior, Director | Маржа ниже порога |
| `cfo.data_imported` | info | Admin | Ежедневный импорт завершён |
| `cfo.import_error` | critical | Admin | Ошибка импорта данных |
| `cfo.anomaly_detected` | warning | Admin | Аномалия в данных |

---

## 1.5 Зависимости от других модулей

### 1.5.1 ADOLF Knowledge

**Назначение:** Хранение и поиск бухгалтерской первички.

**Используемые данные:**

| Тип документа | Пример | Применение |
|---------------|--------|------------|
| Накладные | ТОРГ-12 | Подтверждение закупочной цены |
| Счета-фактуры | От поставщиков | Детализация расходов |
| Акты | Акты выполненных работ | Учёт услуг |

**API-вызов:**

```python
async def search_primary_docs(
    query: str,
    doc_type: str,
    date_from: date,
    date_to: date
) -> List[Document]:
    """Поиск первичных документов в Knowledge Base."""
    response = await knowledge_api.search(
        query=query,
        filters={
            "category": "finance",
            "doc_type": doc_type,
            "date_range": [date_from, date_to]
        }
    )
    return response.results
```

### 1.5.2 Другие модули

| Модуль | Взаимодействие |
|--------|----------------|
| Watcher | Не используется в MVP |
| Reputation | Не используется |
| Content Factory | Не используется |
| Marketing | В v2.0: данные о расходах на рекламу |
| Scout | В v2.0: данные для unit-экономики |

---

## 1.6 Внешние интеграции

### 1.6.1 API маркетплейсов (финансовые данные)

```mermaid
graph LR
    subgraph CFO["CFO Module"]
        ADAPTER["Finance Adapters"]
    end

    subgraph WILDBERRIES["Wildberries"]
        WB_FINANCE["Supplier API<br/>/reportDetailByPeriod"]
    end

    subgraph OZON["Ozon"]
        OZON_FINANCE["Finance API<br/>/v3/finance/transaction/list"]
    end

    subgraph YANDEX["Yandex.Market"]
        YM_FINANCE["Finance API<br/>/reports/finances"]
    end

    ADAPTER --> WB_FINANCE
    ADAPTER --> OZON_FINANCE
    ADAPTER --> YM_FINANCE
```

**Сводка API:**

| Маркетплейс | Endpoint | Данные | Rate Limit |
|-------------|----------|--------|------------|
| Wildberries | `GET /api/v1/supplier/reportDetailByPeriod` | Продажи, комиссии, логистика | 1 req/min |
| Ozon | `POST /v3/finance/transaction/list` | Транзакции, удержания | 60 req/min |
| Яндекс.Маркет | `GET /reports/finances` | Финансовый отчёт | 10 req/min |

### 1.6.2 AI-сервисы

| Сервис | Модель | Назначение |
|--------|--------|------------|
| OpenAI | Claude Opus 4.5 | AI-инсайты, кастомные отчёты |
| Timeweb AI | GPT-5 mini | Парсинг Excel, OCR первички |

---

## 1.7 Компоненты модуля

### 1.7.1 Data Ingestion

**Назначение:** Сбор финансовых данных из всех источников.

```mermaid
classDiagram
    class DataIngestionService {
        +import_from_api(marketplace: str, date_range: DateRange) List~Transaction~
        +import_from_excel(file_path: str) List~Transaction~
        +import_cost_prices(file_path: str) List~CostPrice~
        +normalize_transactions(raw: List) List~Transaction~
    }

    class MarketplaceFinanceAdapter {
        <<interface>>
        +get_transactions(date_from: date, date_to: date) List~RawTransaction~
        +get_report(report_type: str) bytes
    }

    class WBFinanceAdapter {
        -api_key: str
        +get_transactions(date_from, date_to) List~RawTransaction~
    }

    class OzonFinanceAdapter {
        -client_id: str
        -api_key: str
        +get_transactions(date_from, date_to) List~RawTransaction~
    }

    class YMFinanceAdapter {
        -oauth_token: str
        -campaign_id: str
        +get_transactions(date_from, date_to) List~RawTransaction~
    }

    MarketplaceFinanceAdapter <|.. WBFinanceAdapter
    MarketplaceFinanceAdapter <|.. OzonFinanceAdapter
    MarketplaceFinanceAdapter <|.. YMFinanceAdapter
    
    DataIngestionService --> MarketplaceFinanceAdapter
```

### 1.7.2 Cost Mapper

**Назначение:** Сопоставление продаж с себестоимостью.

**Алгоритм маппинга:**

```mermaid
flowchart TD
    A["Транзакция продажи"] --> B{"Barcode найден<br/>в справочнике?"}
    B -->|Да| C["Получить COGS"]
    B -->|Нет| D{"SKU найден?"}
    D -->|Да| E["Получить COGS по SKU"]
    D -->|Нет| F["Пометить как<br/>unmapped"]
    
    C --> G["Рассчитать маржу"]
    E --> G
    F --> H["Добавить в отчёт<br/>об ошибках"]
    
    G --> I["Сохранить в<br/>cfo_pnl_daily"]
```

**Приоритет маппинга:**

| Приоритет | Ключ | Описание |
|:---------:|------|----------|
| 1 | Barcode | Точное соответствие штрихкода |
| 2 | SKU (артикул) | Артикул продавца |
| 3 | nm_id + size | Номенклатура МП + размер |

### 1.7.3 P&L Calculator

**Назначение:** Расчёт маржинальности по всем срезам.

**Формула расчёта:**

```
Revenue = Sale Price (после скидок)

Expenses:
  - COGS (себестоимость)
  - Commission (комиссия МП)
  - Logistics (логистика до покупателя)
  - Return Logistics (обратная логистика)
  - Storage (хранение)
  - Advertising (реклама)

Gross Profit = Revenue - COGS
Net Profit = Revenue - All Expenses
Margin % = Net Profit / Revenue * 100
```

**Срезы агрегации:**

| Срез | Ключ группировки | Пример |
|------|------------------|--------|
| По SKU | `sku` | OM-12345 |
| По категории | `category` | Платья |
| По бренду | `brand_id` | ohana_market |
| По маркетплейсу | `marketplace` | wb |
| По периоду | `date` | 2026-01-15 |

### 1.7.4 ABC Analyzer

**Назначение:** Классификация SKU по вкладу в прибыль.

**Алгоритм:**

```mermaid
flowchart TD
    A["Все SKU с прибылью"] --> B["Сортировка по<br/>убыванию прибыли"]
    B --> C["Расчёт накопительной<br/>доли"]
    
    C --> D{"Накопительная<br/>доля ≤ 80%?"}
    D -->|Да| E["Класс A"]
    
    D -->|Нет| F{"Накопительная<br/>доля ≤ 95%?"}
    F -->|Да| G["Класс B"]
    
    F -->|Нет| H{"Прибыль > 0?"}
    H -->|Да| I["Класс C"]
    H -->|Нет| J["Класс D<br/>(убыточные)"]
```

**Пороги классификации:**

| Класс | Накопительная доля прибыли | Характеристика |
|:-----:|:--------------------------:|----------------|
| A | 0% — 80% | Ключевые SKU |
| B | 80% — 95% | Средние SKU |
| C | 95% — 100% | Аутсайдеры (прибыльные) |
| D | Отрицательная прибыль | Убыточные |

### 1.7.5 AI Insights Generator

**Назначение:** Формирование текстовых выводов и рекомендаций.

**Входные данные для AI:**

| Данные | Описание |
|--------|----------|
| P&L summary | Сводка по выручке, расходам, прибыли |
| ABC distribution | Распределение SKU по классам |
| Top/Bottom performers | Лучшие и худшие SKU |
| Anomalies | Выявленные аномалии |
| Trends | Динамика показателей |

**Промпт для Claude Opus 4.5:**

```
Ты финансовый аналитик e-commerce компании.

Проанализируй финансовые данные и сформируй выводы:

Данные:
{pnl_summary}
{abc_distribution}
{top_performers}
{bottom_performers}
{anomalies}

Требования к ответу:
1. Краткое резюме (2-3 предложения)
2. Ключевые проблемы (если есть)
3. Конкретные рекомендации по убыточным SKU
4. Возможности для роста маржи

Формат: структурированный текст на русском языке.
Тон: деловой, конкретный, с цифрами.
```

### 1.7.6 Report Builder

**Назначение:** Генерация отчётов по запросу пользователя.

**Типы отчётов:**

| Тип | Описание | Доступ |
|-----|----------|--------|
| `pnl_by_sku` | P&L по каждому SKU | Director+ |
| `pnl_by_category` | P&L по категориям | Senior+ |
| `pnl_by_brand` | P&L по брендам | Senior+ |
| `pnl_by_marketplace` | P&L по маркетплейсам | Senior+ |
| `pnl_consolidated` | Консолидированный P&L | Director+ |
| `abc_report` | ABC-анализ | Senior+ |
| `loss_makers` | Убыточные SKU (класс D) | Senior+ |
| `custom` | Кастомный отчёт | Director+ |

### 1.7.7 Alert Engine

**Назначение:** Обнаружение проблем и отправка уведомлений.

**Правила алертов:**

| Правило | Условие | Уровень |
|---------|---------|---------|
| Убыточный SKU | `margin < 0` | warning |
| Низкая маржа | `margin < threshold` | warning |
| Аномалия выручки | `revenue_change > 20%` | warning |
| Аномалия расходов | `expense_change > 20%` | warning |
| Ошибка маппинга | `unmapped_count > 10` | warning |

---

## 1.8 Настройки модуля

### 1.8.1 Environment Variables

| Переменная | Описание | Пример |
|------------|----------|--------|
| `WB_API_KEY` | API-ключ Wildberries | `xxx...` |
| `OZON_CLIENT_ID` | Client ID Ozon | `123456` |
| `OZON_API_KEY` | API-ключ Ozon | `xxx...` |
| `YM_OAUTH_TOKEN` | OAuth-токен Яндекс.Маркет | `xxx...` |
| `YM_CAMPAIGN_ID` | ID кампании Яндекс.Маркет | `789012` |
| `CLAUDE_API_KEY` | API-ключ Claude | `sk-...` |
| `CFO_MARGIN_THRESHOLD` | Порог маржи для алерта (%) | `10` |
| `CFO_ANOMALY_THRESHOLD` | Порог аномалии (%) | `20` |

### 1.8.2 Настройки в БД (cfo_settings)

| Ключ | Тип | Описание | Значение по умолчанию |
|------|-----|----------|----------------------|
| `margin_threshold` | float | Порог маржи для алерта | 10.0 |
| `anomaly_threshold` | float | Порог отклонения для аномалии | 20.0 |
| `abc_thresholds` | json | Пороги ABC-классов | `{"a": 80, "b": 95}` |
| `import_schedule` | json | Расписание импорта | `{"time": "06:00"}` |
| `retention_days` | int | Срок хранения детальных данных | 365 |

---

## 1.9 Технические ограничения

| Параметр | Ограничение |
|----------|-------------|
| Период запроса API (WB) | Максимум 30 дней |
| Период запроса API (Ozon) | Максимум 3 месяца |
| Размер Excel-файла | До 50 МБ |
| Время расчёта P&L | < 5 минут (полный пересчёт) |
| Время генерации AI-инсайтов | < 30 секунд |
| Хранение детальных транзакций | 12 месяцев |
| Хранение агрегатов | Бессрочно |

---

## 1.10 Безопасность

### Защита финансовых данных

| Мера | Реализация |
|------|------------|
| Доступ по ролям | Middleware проверяет `role IN (senior, director, admin)` |
| Фильтрация по бренду | Senior видит только свой бренд |
| Аудит | Все действия логируются в `audit_log` |
| Шифрование | API-ключи в environment variables |
| Retention | Автоочистка детальных данных старше 12 месяцев |

---

**Документ подготовлен:** Январь 2026  
**Версия:** 1.0  
**Статус:** Черновик

# ADOLF LOGISTIC — Раздел 1: Architecture

**Проект:** Интеллектуальная система управления логистикой маркетплейсов  
**Модуль:** Logistic / Architecture  
**Версия:** 1.0  
**Дата:** Январь 2026

---

## 1.1 Обзор архитектуры

### Принципы проектирования

| Принцип | Описание |
|---------|----------|
| **Модульность** | Независимые компоненты с чёткими интерфейсами |
| **Отказоустойчивость** | Graceful degradation при недоступности WB API |
| **Кэширование** | Минимизация запросов к API через Redis |
| **Асинхронность** | Фоновая синхронизация через Celery |
| **Расширяемость** | Подготовка к Ozon/YM в v2.0 |

### Архитектурная диаграмма

```mermaid
graph TB
    subgraph EXTERNAL["Внешние системы"]
        WB_API["Wildberries API<br/>statistics-api<br/>common-api<br/>supplies-api"]
    end
    
    subgraph LOGISTIC["Модуль Logistic"]
        subgraph ADAPTERS["Слой адаптеров"]
            WB_ADAPTER["WBLogisticAdapter"]
            RATE_LIMITER["RateLimiter"]
            RETRY["RetryHandler"]
        end
        
        subgraph SERVICES["Слой сервисов"]
            STOCK_SVC["StockService"]
            ORDER_SVC["OrderService"]
            TARIFF_SVC["TariffService"]
            SUPPLY_SVC["SupplyHistoryService"]
            RECOMMEND_SVC["RecommendationService"]
            ALERT_SVC["AlertService"]
        end
        
        subgraph DOMAIN["Доменный слой"]
            STOCK_MON["StockMonitor"]
            ORDER_ANALYZER["OrderAnalyzer"]
            CROSS_DETECTOR["CrossDockDetector"]
            DEMAND_FORECAST["DemandForecaster"]
            DISTRIBUTION_CALC["DistributionCalculator"]
        end
        
        subgraph STORAGE["Слой хранения"]
            PG[(PostgreSQL)]
            REDIS[(Redis)]
        end
    end
    
    subgraph CORE["ADOLF Core"]
        CELERY["Celery Workers"]
        NOTIFY["Notification Service"]
        OWUI["Open WebUI"]
        MW["Middleware"]
    end
    
    WB_API --> RATE_LIMITER
    RATE_LIMITER --> WB_ADAPTER
    WB_ADAPTER --> RETRY
    RETRY --> STOCK_SVC & ORDER_SVC & TARIFF_SVC
    
    STOCK_SVC --> STOCK_MON
    ORDER_SVC --> ORDER_ANALYZER
    TARIFF_SVC --> CROSS_DETECTOR
    
    STOCK_MON --> PG
    ORDER_ANALYZER --> CROSS_DETECTOR
    CROSS_DETECTOR --> PG
    
    PG --> DEMAND_FORECAST
    DEMAND_FORECAST --> DISTRIBUTION_CALC
    DISTRIBUTION_CALC --> RECOMMEND_SVC
    
    STOCK_MON --> ALERT_SVC
    CROSS_DETECTOR --> ALERT_SVC
    
    ALERT_SVC --> NOTIFY
    RECOMMEND_SVC --> OWUI
    
    CELERY --> STOCK_SVC & ORDER_SVC
    MW --> STOCK_SVC & ORDER_SVC & RECOMMEND_SVC
    
    STOCK_SVC & ORDER_SVC & TARIFF_SVC --> REDIS
```

---

## 1.2 Компоненты системы

### Слой адаптеров

| Компонент | Назначение | Технология |
|-----------|------------|------------|
| **WBLogisticAdapter** | Единая точка интеграции с WB API | aiohttp |
| **RateLimiter** | Контроль частоты запросов к API | Redis + asyncio |
| **RetryHandler** | Повторные попытки при ошибках | tenacity |

### Слой сервисов

| Сервис | Назначение | Входные данные | Выходные данные |
|--------|------------|----------------|-----------------|
| **StockService** | Получение и кэширование остатков | WB API | Stock[] |
| **OrderService** | Получение и обработка заказов | WB API | Order[] |
| **TariffService** | Получение тарифов логистики | WB API | Tariff[] |
| **SupplyHistoryService** | История поставок | PostgreSQL | Supply[] |
| **RecommendationService** | Формирование рекомендаций | Domain models | Recommendation |
| **AlertService** | Генерация и отправка алертов | Domain events | Alert[] |

### Доменный слой

| Компонент | Назначение | Логика |
|-----------|------------|--------|
| **StockMonitor** | Отслеживание уровня остатков | Сравнение с порогами, тренды |
| **OrderAnalyzer** | Анализ структуры заказов | Статистика по регионам/складам |
| **CrossDockDetector** | Выявление кросс-докинга | Матрица склад-регион |
| **DemandForecaster** | Прогноз спроса | Moving average, сезонность |
| **DistributionCalculator** | Расчёт распределения | Оптимизация по регионам |

---

## 1.3 Потоки данных

### Поток синхронизации остатков

```mermaid
sequenceDiagram
    participant CELERY as Celery Beat
    participant STOCK_SVC as StockService
    participant WB as WB API
    participant REDIS as Redis
    participant PG as PostgreSQL
    participant ALERT as AlertService
    
    CELERY->>STOCK_SVC: sync_stocks (каждые 30 мин)
    STOCK_SVC->>REDIS: check cache freshness
    REDIS-->>STOCK_SVC: cache expired
    
    STOCK_SVC->>WB: GET /supplier/stocks
    WB-->>STOCK_SVC: stocks[]
    
    STOCK_SVC->>REDIS: update cache (TTL 25 min)
    STOCK_SVC->>PG: upsert stock_snapshots
    
    STOCK_SVC->>STOCK_SVC: detect_critical_levels()
    
    alt Критический уровень
        STOCK_SVC->>ALERT: create_alert(LOW_STOCK)
        ALERT->>PG: save alert
        ALERT->>NOTIFY: send notification
    end
```

### Поток анализа заказов

```mermaid
sequenceDiagram
    participant CELERY as Celery Beat
    participant ORDER_SVC as OrderService
    participant WB as WB API
    participant DETECTOR as CrossDockDetector
    participant TARIFF as TariffService
    participant PG as PostgreSQL
    participant ALERT as AlertService
    
    CELERY->>ORDER_SVC: sync_orders (каждые 30 мин)
    ORDER_SVC->>WB: GET /supplier/orders
    WB-->>ORDER_SVC: orders[]
    
    loop Для каждого заказа
        ORDER_SVC->>DETECTOR: analyze(order)
        DETECTOR->>DETECTOR: check warehouse-region matrix
        
        alt Кросс-докинг обнаружен
            DETECTOR->>TARIFF: get_tariffs(warehouse_from, warehouse_optimal)
            TARIFF-->>DETECTOR: tariff_actual, tariff_optimal
            DETECTOR->>DETECTOR: calculate_loss()
            DETECTOR->>PG: save cross_dock_event
            DETECTOR->>ALERT: create_alert(CROSS_DOCK)
        end
    end
    
    ORDER_SVC->>PG: save orders
```

### Поток генерации рекомендаций

```mermaid
sequenceDiagram
    participant USER as User (Open WebUI)
    participant API as FastAPI
    participant REC as RecommendationService
    participant FORECAST as DemandForecaster
    participant CALC as DistributionCalculator
    participant PG as PostgreSQL
    participant TARIFF as TariffService
    
    USER->>API: POST /logistic/recommendations
    API->>REC: generate(sku, quantity)
    
    REC->>PG: get sales_history(sku)
    PG-->>REC: sales[]
    
    REC->>FORECAST: predict_demand(sku, by_region)
    FORECAST->>FORECAST: calculate moving average
    FORECAST->>FORECAST: apply seasonality
    FORECAST-->>REC: demand_forecast[]
    
    REC->>PG: get current_stocks(sku)
    PG-->>REC: stocks[]
    
    REC->>TARIFF: get_acceptance_coefficients()
    TARIFF-->>REC: coefficients[]
    
    REC->>CALC: calculate_distribution(demand, stocks, coefficients, quantity)
    CALC->>CALC: optimize by regions
    CALC->>CALC: apply warehouse constraints
    CALC-->>REC: distribution[]
    
    REC-->>API: Recommendation
    API-->>USER: JSON response
```

---

## 1.4 Интеграция с ADOLF Core

### Используемые компоненты Core

```mermaid
graph LR
    subgraph LOGISTIC["Logistic Module"]
        L_API["API Endpoints"]
        L_TASKS["Celery Tasks"]
        L_ALERTS["Alert Generator"]
        L_PIPELINE["Pipeline Handler"]
    end
    
    subgraph CORE["ADOLF Core"]
        MW["Middleware<br/>Auth, Roles, Brand Filter"]
        PG["PostgreSQL<br/>Shared Schema"]
        REDIS["Redis<br/>Cache, Queues"]
        CELERY["Celery<br/>Beat, Workers"]
        NOTIFY["Notifications<br/>Event Bus"]
        OWUI["Open WebUI<br/>Pipeline, Tools"]
    end
    
    L_API --> MW
    L_TASKS --> CELERY
    L_ALERTS --> NOTIFY
    L_PIPELINE --> OWUI
    
    MW --> PG
    L_TASKS --> REDIS
    L_ALERTS --> REDIS
```

### Middleware интеграция

| Middleware | Использование |
|------------|---------------|
| `AuthMiddleware` | Валидация JWT/API Key |
| `RoleMiddleware` | Проверка прав доступа |
| `BrandFilterMiddleware` | Фильтрация данных по brand_id |
| `PromptInjectionMiddleware` | Добавление контекста для AI |

### Shared PostgreSQL схема

Модуль Logistic использует:
- **Собственные таблицы** с префиксом `logistic_*`
- **Общие таблицы** Core: `users`, `brands`, `notifications`
- **FK связи** с другими модулями минимизированы

---

## 1.5 Структура кодовой базы

```
adolf/
├── modules/
│   └── logistic/
│       ├── __init__.py
│       ├── config.py                 # Конфигурация модуля
│       │
│       ├── adapters/                 # Слой адаптеров
│       │   ├── __init__.py
│       │   ├── wb_adapter.py         # WBLogisticAdapter
│       │   ├── rate_limiter.py       # RateLimiter
│       │   └── retry_handler.py      # RetryHandler
│       │
│       ├── services/                 # Слой сервисов
│       │   ├── __init__.py
│       │   ├── stock_service.py      # StockService
│       │   ├── order_service.py      # OrderService
│       │   ├── tariff_service.py     # TariffService
│       │   ├── supply_service.py     # SupplyHistoryService
│       │   ├── recommendation_service.py
│       │   └── alert_service.py      # AlertService
│       │
│       ├── domain/                   # Доменный слой
│       │   ├── __init__.py
│       │   ├── models.py             # Pydantic models
│       │   ├── stock_monitor.py      # StockMonitor
│       │   ├── order_analyzer.py     # OrderAnalyzer
│       │   ├── cross_dock_detector.py
│       │   ├── demand_forecaster.py  # DemandForecaster
│       │   └── distribution_calculator.py
│       │
│       ├── api/                      # FastAPI endpoints
│       │   ├── __init__.py
│       │   ├── router.py             # Main router
│       │   ├── stocks.py             # /stocks endpoints
│       │   ├── orders.py             # /orders endpoints
│       │   ├── recommendations.py    # /recommendations endpoints
│       │   ├── alerts.py             # /alerts endpoints
│       │   └── schemas.py            # Request/Response schemas
│       │
│       ├── tasks/                    # Celery tasks
│       │   ├── __init__.py
│       │   ├── sync_stocks.py
│       │   ├── sync_orders.py
│       │   ├── sync_tariffs.py
│       │   └── generate_alerts.py
│       │
│       ├── db/                       # Database
│       │   ├── __init__.py
│       │   ├── models.py             # SQLAlchemy models
│       │   └── repositories.py       # Data access
│       │
│       └── owui/                     # Open WebUI integration
│           ├── __init__.py
│           ├── pipeline.py           # Pipeline handler
│           └── tools.py              # Function tools
```

---

## 1.6 Конфигурация

### Переменные окружения

```python
# config.py
from pydantic_settings import BaseSettings

class LogisticSettings(BaseSettings):
    """Настройки модуля Logistic."""
    
    # WB API
    wb_api_key: str
    wb_statistics_url: str = "https://statistics-api.wildberries.ru"
    wb_common_url: str = "https://common-api.wildberries.ru"
    wb_supplies_url: str = "https://supplies-api.wildberries.ru"
    
    # Rate limits (requests per minute)
    wb_stocks_rpm: int = 1
    wb_orders_rpm: int = 1
    wb_tariffs_rpm: int = 60
    
    # Sync intervals (minutes)
    sync_stocks_interval: int = 30
    sync_orders_interval: int = 30
    sync_tariffs_interval: int = 1440  # daily
    
    # Alert thresholds
    critical_stock_threshold: int = 10
    warning_stock_threshold: int = 30
    cross_dock_alert_min_loss: float = 100.0
    
    # Forecast settings
    forecast_window_days: int = 30
    forecast_horizon_days: int = 14
    
    # Cache TTL (seconds)
    cache_stocks_ttl: int = 1500  # 25 min
    cache_tariffs_ttl: int = 86400  # 24 hours
    
    class Config:
        env_prefix = "LOGISTIC_"
```

### Пример .env

```bash
# Wildberries API
LOGISTIC_WB_API_KEY=your_api_key_here

# Thresholds
LOGISTIC_CRITICAL_STOCK_THRESHOLD=5
LOGISTIC_WARNING_STOCK_THRESHOLD=20
LOGISTIC_CROSS_DOCK_ALERT_MIN_LOSS=50.0

# Intervals
LOGISTIC_SYNC_STOCKS_INTERVAL=30
LOGISTIC_SYNC_ORDERS_INTERVAL=30
```

---

## 1.7 Кэширование

### Стратегия кэширования

| Данные | Хранилище | TTL | Ключ |
|--------|-----------|-----|------|
| Остатки по складам | Redis | 25 мин | `logistic:stocks:{date}` |
| Тарифы | Redis | 24 часа | `logistic:tariffs:{date}` |
| Коэффициенты приёмки | Redis | 1 час | `logistic:acceptance:{date}` |
| Матрица склад-регион | Redis | 7 дней | `logistic:warehouse_matrix` |
| Список складов | Redis | 7 дней | `logistic:warehouses` |

### Структура кэша остатков

```python
# Redis key: logistic:stocks:2026-01-31
{
    "updated_at": "2026-01-31T10:30:00Z",
    "stocks": [
        {
            "sku": "OM-12345",
            "barcode": "2000000000001",
            "warehouse_name": "Коледино",
            "warehouse_id": 507,
            "quantity": 45,
            "in_way_to_client": 3,
            "in_way_from_client": 1
        },
        ...
    ]
}
```

### Cache-aside pattern

```mermaid
flowchart TD
    REQUEST["Запрос остатков"]
    CACHE_CHECK{"Кэш<br/>актуален?"}
    RETURN_CACHE["Вернуть из кэша"]
    FETCH_API["Запрос к WB API"]
    UPDATE_CACHE["Обновить кэш"]
    RETURN_DATA["Вернуть данные"]
    
    REQUEST --> CACHE_CHECK
    CACHE_CHECK -->|Да| RETURN_CACHE
    CACHE_CHECK -->|Нет| FETCH_API
    FETCH_API --> UPDATE_CACHE
    UPDATE_CACHE --> RETURN_DATA
```

---

## 1.8 Обработка ошибок

### Типы ошибок

| Ошибка | Код | Обработка |
|--------|-----|-----------|
| `WBAPIError` | 500 | Retry с exponential backoff |
| `RateLimitError` | 429 | Ожидание, затем retry |
| `AuthenticationError` | 401 | Алерт администратору |
| `DataValidationError` | 422 | Логирование, пропуск записи |
| `CacheError` | — | Fallback на прямой запрос |

### Retry стратегия

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=60),
    retry=retry_if_exception_type(WBAPIError)
)
async def fetch_stocks(self) -> list[Stock]:
    """Получение остатков с retry."""
    ...
```

### Circuit Breaker

```mermaid
stateDiagram-v2
    [*] --> Closed
    Closed --> Open: failures >= threshold
    Open --> HalfOpen: timeout elapsed
    HalfOpen --> Closed: success
    HalfOpen --> Open: failure
    
    Closed: Нормальная работа
    Open: Запросы блокируются
    HalfOpen: Тестовые запросы
```

---

## 1.9 Мониторинг и логирование

### Метрики (Prometheus)

| Метрика | Тип | Описание |
|---------|-----|----------|
| `logistic_wb_api_requests_total` | Counter | Общее число запросов к WB API |
| `logistic_wb_api_errors_total` | Counter | Ошибки WB API |
| `logistic_wb_api_latency_seconds` | Histogram | Латентность запросов |
| `logistic_stocks_sync_duration_seconds` | Histogram | Время синхронизации остатков |
| `logistic_cross_dock_events_total` | Counter | Выявленные кросс-докинги |
| `logistic_alerts_generated_total` | Counter | Сгенерированные алерты |

### Структурированное логирование

```python
import structlog

logger = structlog.get_logger("logistic")

# Пример лога
logger.info(
    "stocks_synced",
    sku_count=1000,
    warehouse_count=15,
    duration_ms=2340,
    cache_updated=True
)
```

### Формат лога

```json
{
    "timestamp": "2026-01-31T10:30:00.123Z",
    "level": "info",
    "logger": "logistic",
    "event": "stocks_synced",
    "sku_count": 1000,
    "warehouse_count": 15,
    "duration_ms": 2340,
    "cache_updated": true,
    "trace_id": "abc123"
}
```

---

## 1.10 Безопасность

### API ключи WB

| Аспект | Реализация |
|--------|------------|
| Хранение | Vault / переменные окружения |
| Ротация | Поддержка hot-reload конфигурации |
| Аудит | Логирование всех API-вызовов |

### Доступ к данным

```mermaid
graph TD
    REQUEST["API Request"]
    AUTH["Auth Middleware"]
    ROLE["Role Check"]
    BRAND["Brand Filter"]
    DATA["Data Access"]
    
    REQUEST --> AUTH
    AUTH -->|valid| ROLE
    AUTH -->|invalid| REJECT1["401 Unauthorized"]
    ROLE -->|allowed| BRAND
    ROLE -->|denied| REJECT2["403 Forbidden"]
    BRAND --> DATA
```

---

## 1.11 Масштабирование

### Горизонтальное масштабирование

| Компонент | Стратегия |
|-----------|-----------|
| API | Stateless, несколько инстансов за LB |
| Celery Workers | Увеличение числа воркеров |
| Redis | Cluster mode (при необходимости) |
| PostgreSQL | Read replicas (v2.0) |

### Ограничения WB API

| Endpoint | Лимит | Стратегия |
|----------|-------|-----------|
| `/supplier/stocks` | 1 req/min | Кэширование, batch requests |
| `/supplier/orders` | 1 req/min | Инкрементальная синхронизация |
| `/tariffs/box` | 60 req/min | Агрессивное кэширование |

---

## 1.12 Зависимости

### Python пакеты

```txt
# requirements-logistic.txt
aiohttp>=3.9.0
tenacity>=8.2.0
redis>=5.0.0
celery>=5.3.0
structlog>=24.1.0
pydantic>=2.5.0
sqlalchemy>=2.0.0
```

### Внутренние зависимости

| Модуль | Зависимость | Тип |
|--------|-------------|-----|
| Core | Middleware, PostgreSQL, Redis, Celery, Notifications | Hard |
| CFO | Отправка данных о логистических издержках | Soft |
| Scout | Получение прогнозов продаж | Soft (v2.0) |

---

**Документ подготовлен:** Январь 2026  
**Версия:** 1.0  
**Статус:** Черновик

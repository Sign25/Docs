# AdolfContentFactoryBack

Backend для генерации SEO-контента карточек товаров маркетплейсов с помощью AI.

## Технологии

- **Python 3.11+**
- **FastAPI** — web-фреймворк
- **asyncpg** — асинхронный драйвер PostgreSQL (чистый SQL, без ORM)
- **Pydantic** — валидация данных
- **Claude CLI (Sonnet 4.5)** — генерация контента через подписку Max
- **httpx** — асинхронные HTTP запросы к WB API

## Структура проекта

```
app/
├── api/routes/           # API эндпоинты
│   ├── generate.py       # /api/content/* — генерация контента
│   └── health.py         # /health, /ready — healthcheck
├── models/
│   └── schemas.py        # Pydantic схемы запросов/ответов
├── prompts/
│   ├── __init__.py        # Экспорт промптов
│   └── content_prompts.py # Промпты для AI, лимиты, запрещённые слова
├── repositories/         # Работа с БД (чистый SQL)
│   ├── product_repo.py   # reputation_products (товары)
│   ├── generation_repo.py # content_generations (лог генераций)
│   ├── draft_repo.py     # content_drafts (черновики AI)
│   └── publication_repo.py # content_publications (что отправили на WB)
├── services/
│   ├── ai_service.py     # Интеграция с Claude AI (CLI)
│   ├── wb_service.py     # Интеграция с Wildberries Content API
│   └── content_service.py # Основная бизнес-логика
├── utils/
│   ├── url_parser.py     # Парсинг URL маркетплейсов
│   ├── validators.py     # Валидация контента
│   └── logging.py        # Структурированное логирование
├── config.py             # Настройки из .env
├── database.py           # Пул соединений asyncpg
└── main.py               # FastAPI приложение
```

## Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│  API Endpoints (generate.py)                                │
│  - Принимает HTTP запросы                                   │
│  - Вызывает сервисы                                         │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│  Services (content_service.py, wb_service.py, ai_service.py)│
│  - Бизнес-логика                                            │
│  - Координирует репозитории                                 │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│  Repositories (product_repo.py, draft_repo.py, etc)         │
│  - Чистый SQL                                               │
│  - Один репозиторий = одна таблица                          │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│  Database (database.py)                                     │
│  - Пул соединений asyncpg (min=2, max=10)                   │
│  - get_connection() контекстный менеджер                    │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints

### 1. `GET /api/content/product`
Получить оригинальные данные товара из БД + валидацию текущего контента.

**Поддерживаются два сценария:**

**Вариант A: По ссылке (маркетплейс определяется автоматически)**
```
GET /api/content/product?url=https://www.wildberries.ru/catalog/123456789/detail.aspx
```

**Вариант B: По маркетплейсу + артикулу (обязательны оба параметра!)**
```
GET /api/content/product?marketplace=wb&sku=123456789
```
или по vendor_code:
```
GET /api/content/product?marketplace=wb&sku=ABC-001
```

**КЛЮЧЕВОЕ ОТЛИЧИЕ:** Если передать `marketplace=ozon&sku=16378`, система ищет товар **только** в Ozon с этим artisan_code. Раньше игнорировалось значение marketplace — теперь это исправлено!

**Query параметры:**
| Параметр | Обязательно | Описание |
|----------|-----------|---------|
| `url` | Нет* | Ссылка на товар (альтернатива sku+marketplace) |
| `sku` | Нет* | Артикул товара: nmID или vendor_code |
| `marketplace` | Нет* | `wb` / `ozon` / `ym` (обязателен если нет url) |

**Требование:** Указать либо `url`, либо оба параметра `sku` + `marketplace`.

**Поддержка склеек:** Если товар входит в склейку (несколько цветов/вариантов), возвращает данные всех товаров в группе.

**Response:**
```json
{
  "sku": "123456789",
  "title": "Оригинальное название",
  "description": "Оригинальное описание",
  "media_urls": ["url1.jpg", "url2.jpg"],
  "video_url": "video.mp4",
  "imt_id": 12345678,
  "group_count": 3,
  "products": [
    {
      "sku": "123456789",
      "title": "Название варианта 1",
      "description": "Описание",
      "media_urls": ["url1.jpg"],
      "video_url": null,
      "color": "Красный",
      "vendor_code": "ABC-001"
    },
    {
      "sku": "123456790",
      "title": "Название варианта 2",
      "description": "Описание",
      "media_urls": ["url2.jpg"],
      "video_url": null,
      "color": "Синий",
      "vendor_code": "ABC-002"
    }
  ],
  "validation": {
    "is_valid": false,
    "issues": [
      {"field": "description", "message": "Описание слишком короткое (минимум 1000 символов)", "severity": "error"}
    ]
  }
}
```

**Поля склейки:**
- `imt_id` — ID группы товаров на WB (null если товар не в склейке)
- `group_count` — количество товаров в склейке (1 если без склейки)
- `products` — массив всех товаров в склейке с их фото, видео и цветом

**Записи в БД:** нет (только чтение)

---

### 2. `POST /api/content/generate`
Генерация SEO-контента для товара.

**Генерация всегда по одному товару.** Даже если товар входит в склейку, AI генерирует контент только для запрошенного SKU (не для всей группы).

**Request:**
```json
{
  "url": "https://www.wildberries.ru/catalog/123456789/detail.aspx",
  "sku": "123456789",
  "marketplace": "wb"
}
```

**Response:**
```json
{
  "draft_id": "uuid",
  "sku": "123456789",
  "marketplace": "wb",
  "title": "SEO-название",
  "description": "SEO-описание",
  "seo_tags": ["тег1", "тег2"],
  "model": "claude-sonnet-4-5-20250929",
  "imt_id": 12345678,
  "group_nm_ids": [123456789, 123456790, 123456791],
  "validation": {
    "is_valid": true,
    "issues": []
  },
  "is_valid": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Поля ответа:**
- `model` — модель AI, которая сгенерировала контент
- `imt_id` — ID склейки (null если товар не в группе)
- `group_nm_ids` — список всех nmID в склейке

**Записи в БД:**
| Таблица | Операция |
|---------|----------|
| `content_generations` | INSERT (pending) → UPDATE (processing) → UPDATE (completed) |
| `content_drafts` | INSERT (status='draft') |

---

### 3. `POST /api/content/regenerate`
Перегенерация контента с учётом пожеланий менеджера.

**Request:**
```json
{
  "draft_id": "uuid",
  "manager_notes": "Сделай описание с акцентом на натуральность"
}
```

**Response:** такой же как `/generate` (с новым draft_id)

**Записи в БД:**
| Таблица | Операция |
|---------|----------|
| `content_generations` | INSERT (новая запись) |
| `content_drafts` | INSERT (новый черновик, старый не трогаем) |

---

### 4. `POST /api/content/drafts/{draft_id}/approve`
Утвердить черновик и отправить на Wildberries.

Обновляет только одну карточку (по SKU из черновика).

**Request:**
```json
{
  "title": "Финальное название",
  "description": "Финальное описание",
  "seo_tags": ["тег1", "тег2"]
}
```

**Параметры:**
- `title` — финальное название (обязательно)
- `description` — финальное описание (обязательно)
- `seo_tags` — SEO теги (опционально, отправляются на WB в поле "Комплектация")

**Response:**
```json
{
  "success": true,
  "draft_id": "uuid",
  "message": "Карточка успешно обновлена на Wildberries",
  "updated_nm_ids": [123456789]
}
```

**Поля ответа:**
- `updated_nm_ids` — список обновлённых nmID (одна карточка)

**Записи в БД:**
| Таблица | Операция |
|---------|----------|
| `content_publications` | INSERT (финальные данные менеджера) |
| `content_drafts` | UPDATE (только status → 'approved', AI-оригинал не трогаем) |

---

---

### 5. `GET /api/content/wb/card/{sku}`
Получить текущее состояние карточки на Wildberries.

**Path:** `sku` — артикул WB (например 203873004)

**Response:**
```json
{
  "sku": 203873004,
  "vendor_code": "16378",
  "title": "Текущее название на WB",
  "description": "Текущее описание на WB",
  "brand": "Ohana market",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Важно:** Возвращает только карточки, принадлежащие магазину с текущим WB_TOKEN. Чужие карточки не видны.

---

### 6. `GET /api/content/wb/errors`
Получить список карточек с ошибками модерации на Wildberries.

**Query:** `?sku=203873004` (опционально)

**Response:**
```json
{
  "sku": 203873004,
  "errors_count": 1,
  "errors": [{"nmID": 203873004, "error": "..."}],
  "has_errors": true
}
```

---

### 7. `GET /api/content/wb/card-by-vendor/{vendor_code}`
Получить карточку по артикулу продавца (vendorCode).

**Path:** `vendor_code` — артикул продавца (например "16378")

**Response:** аналогично `/wb/card/{sku}`

---

### 8. `GET /api/content/wb/my-cards`
Получить список всех карточек магазина (для диагностики).

**Query:** `?limit=50` (опционально)

**Response:**
```json
{
  "count": 50,
  "cards": [
    {"nmID": 203873004, "vendorCode": "16378", "title": "..."},
    ...
  ]
}
```

---

### Health

- `GET /health` — healthcheck
- `GET /ready` — readiness check (включая БД)

---

## Склейки (Product Groups)

### Что такое склейка?

Склейка — это группа товаров на WB, объединённых в одну карточку. Обычно это один товар в разных цветах или вариантах исполнения. Все товары в склейке имеют одинаковый `imt_id`.

### Термины

| Термин | Описание | Пример |
|--------|----------|--------|
| `nmID` / `external_id` | Уникальный ID конкретного варианта товара | 203873004 |
| `imt_id` | ID склейки (группы товаров) | 12345678 |
| Склейка | Несколько nmID с одинаковым imt_id | 3 цвета = 3 nmID, 1 imt_id |

### Как работает генерация для склеек

**Генерация всегда по одному товару** (не по всей склейке). Даже если товар входит в склейку, AI получает данные только запрошенного SKU и генерирует контент для него.

Данные склейки (products[], imt_id, group_count) всё ещё возвращаются в ответе для информации фронта, но AI генерирует только для одного товара.

### Как работает публикация

Approve обновляет только одну карточку (по SKU из черновика).

### Флоу данных для склейки

```
GET /product?sku=123456789
    │
    ├── Находим товар по SKU
    ├── Получаем imt_id товара
    ├── Находим ВСЕ товары с этим imt_id
    └── Возвращаем: products[], imt_id, group_count

POST /generate
    │
    ├── Находим товар по SKU
    ├── Генерируем контент ТОЛЬКО для этого товара
    ├── Вызываем AI с build_generation_prompt()
    └── Возвращаем: imt_id, group_nm_ids[] (инфо)

POST /approve
    │
    ├── Находим товар по SKU
    ├── Получаем текущую карточку с WB
    ├── Мержим новые title/description
    ├── Отправляем на WB
    └── Возвращаем: updated_nm_ids[]
```

## Версионирование

Версия приложения управляется централизованно в `app/config.py`:

```python
APP_VERSION = "1.1.1"  # Меняй здесь при обновлении!
APP_NAME = "Content Factory"
```

Используется в:
- FastAPI metadata (`app/main.py`)
- Корневой endpoint `GET /` (`app/api/routes/health.py`)

Проверить текущую версию на сервере: `GET /` → `{"service": "Content Factory", "version": "1.1.1", ...}`

---

## Конфигурация (.env)

```env
# Wildberries API
WB_TOKEN=

# Database
DB_HOST=
DB_PORT=5432
DB_NAME=
DB_USER=
DB_PASSWORD=

# Logging
LOG_LEVEL=INFO                    # DEBUG, INFO, WARNING, ERROR
LOG_FORMAT=                       # simple, structured или пусто (auto)

# App
DEBUG=false                       # true для разработки
```

**Claude AI (не через .env):** AI-сервис использует Claude CLI с подпиской Max. Настройка — через `claude login` (OAuth-токен сохраняется в `~/.claude/.credentials.json`). Переменные `TIMEWEB_*` больше не нужны.

## База данных

### Таблицы и их назначение

```
┌─────────────────────────────────────────────────────────────┐
│                    reputation_products                       │
│                    (источник данных)                         │
│                                                             │
│  Оригинальные данные товара с WB                            │
│  Только читаем, никогда не пишем                            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   content_generations                        │
│                   (лог всех генераций)                       │
│                                                             │
│  Каждый вызов /generate или /regenerate создаёт запись      │
│  Статусы: pending → processing → completed/failed           │
│  Хранит context (что отправили в AI)                        │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     content_drafts                           │
│                   (черновики от AI)                          │
│                                                             │
│  Хранит ОРИГИНАЛ от AI — не изменяется при approve          │
│  Каждая перегенерация = НОВАЯ запись                        │
│  Статусы: draft → approved                                  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  content_publications                        │
│               (что отправили на WB)                          │
│                                                             │
│  published_title — финальное название от менеджера          │
│  published_description — финальное описание                 │
│  api_response — ответ от WB API                             │
│  Можно сравнить с content_drafts и увидеть правки           │
└─────────────────────────────────────────────────────────────┘
```

### Поля товара для генерации (не отдаются на фронт)

- `composition` — состав/материал
- `attributes` — характеристики товара (включая цвет)
- `size_measurements` — размеры
- `imt_id` — ID склейки (группы товаров на WB)

### Флоу данных: POST /generate

```
1. SELECT FROM reputation_products        — читаем товар по SKU
2. INSERT INTO content_generations        — создаём лог (pending)
3. UPDATE content_generations             — статус → processing
4. Claude CLI (subprocess)                — генерируем контент
   - Всегда: build_generation_prompt() (один товар)
5. Валидация результата                   — проверяем ошибки
6. (Если ошибки) Claude CLI               — автоисправление (до 1 раза)
7. INSERT INTO content_drafts             — сохраняем черновик
8. UPDATE content_generations             — статус → completed
```

### Флоу данных: POST /regenerate

```
1. SELECT FROM content_drafts             — читаем предыдущий черновик
2. SELECT FROM reputation_products        — читаем оригинал товара
3. INSERT INTO content_generations        — НОВАЯ запись в лог
4. Claude CLI (subprocess)                — регенерируем с контекстом
5. INSERT INTO content_drafts             — НОВЫЙ черновик (старый не трогаем)
6. UPDATE content_generations             — статус → completed
```

### Флоу данных: POST /approve

```
1. SELECT FROM content_drafts             — проверяем что черновик существует
2. SELECT FROM reputation_products        — получаем товар
3. GET текущую карточку с WB              — нужны все поля
4. HTTP POST к WB Content API             — обновляем title/description
5. INSERT INTO content_publications       — сохраняем что отправили на WB
6. UPDATE content_drafts                  — только status → 'approved'
```

**Важно:** При approve AI-оригинал в content_drafts НЕ меняется. Финальные данные менеджера сохраняются в content_publications.

### JSON-поля в БД

Некоторые поля в `reputation_products` хранятся как JSON-строки (TEXT), а не как JSONB:

| Поле | Тип в БД | Нужен парсинг |
|------|----------|---------------|
| `media_urls` | TEXT (JSON) | Да |
| `attributes` | TEXT (JSON) | Да |
| `size_measurements` | TEXT (JSON) | Да |

При чтении из БД используется `_parse_json_field()` в `content_service.py`:

```python
def _parse_json_field(value, default=None):
    """Парсит JSON-строку из БД, если нужно."""
    if value is None:
        return default if default is not None else {}
    if isinstance(value, str):
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return default if default is not None else {}
    return value
```

### Извлечение цвета из атрибутов

Цвет товара хранится в поле `attributes` как JSON-массив:

```json
[
  {"name": "Цвет", "value": ["Красный"]},
  {"name": "Размер", "value": "42"}
]
```

Для извлечения цвета (например, в `generate.py`):

```python
color = None
attrs = _parse_json_field(product.get("attributes"), [])
for attr in attrs:
    if attr.get("name") == "Цвет":
        value = attr.get("value")
        color = value[0] if isinstance(value, list) and value else str(value)
        break
```

## Валидация контента

Валидация выполняется в `app/utils/validators.py` и применяется:
- При получении товара (`GET /api/content/product`) — к текущим данным из БД
- При генерации (`POST /generate`, `/regenerate`) — к сгенерированному контенту

### Проверки для Title (название)

| Проверка | Условие | Severity |
|----------|---------|----------|
| Длина max | > 60 символов (WB) | error |
| Длина min | < 10 символов | warning |
| Запрещённые слова | см. список ниже | error |
| Спецсимволы | `/`, `!`, `#`, `&`, `*`, `@`, `\|`, `\` | error |

### Проверки для Description (описание)

| Проверка | Условие | Severity |
|----------|---------|----------|
| Длина max | > 5000 символов (WB) | error |
| Длина min | < 1000 символов (WB) | warning |
| Запрещённые слова | см. список ниже | error |
| Домены | `.ru`, `.com`, `.net`, `.io`, `.org`, `.рф`, `.su`, `.info`, `.biz`, `.me` | error |
| URL | `http://`, `https://`, `www.` | error |
| Email | паттерн `xxx@xxx.xx` | error |
| Телефоны | `+7...`, `8-xxx-xxx-xx-xx` | error |
| Telegram | `t.me/`, `@username`, слово `telegram` | error |
| HTML-теги | `<b>`, `<br>`, любые `<...>` | error |
| Переспам | слово повторяется >4% текста | warning |

### Лимиты по маркетплейсам

| Маркетплейс | Title max | Description min | Description max |
|-------------|-----------|-----------------|-----------------|
| wb          | 60        | 1000            | 5000            |
| ozon        | 255       | 100             | 6000            |
| ym          | 150       | 100             | 3000            |

### Запрещённые слова (FORBIDDEN_WORDS)

Полный список слов, отклоняемых модерацией WB:

```python
FORBIDDEN_WORDS = [
    # Превосходные степени
    "лучший", "лучшее", "лучшая", "лучшие",
    "самый", "самое", "самая", "самые",
    "идеальный", "идеальное", "идеальная", "идеальные",
    "единственный", "единственное", "единственная", "единственные",
    "наивысочайший", "наивысочайшее", "наивысочайшая",

    # Гарантии и абсолюты
    "гарантированно", "гарантируем", "гарантия качества",
    "100%", "100 процентов",
    "абсолютно", "навсегда", "вечный", "вечное", "вечная",

    # Рейтинги
    "номер 1", "номер один", "#1", "№1",

    # Маркетинговые слова
    "топ", "топовый", "топовая", "топовое",
    "хит", "хит продаж", "бестселлер",
    "распродажа", "акция", "скидка",
    "модный", "модное", "модная", "трендовый",
    "эксклюзивный", "эксклюзивное", "эксклюзивная",
    "премиум", "премиальный", "люкс", "luxury",
]
```

**Разрешённые альтернативы:** качественный, отличный, превосходный, надёжный, практичный, удобный.

### Результат валидации

```json
{
  "is_valid": true/false,  // false если есть хотя бы один error
  "issues": [
    {"field": "title", "message": "...", "severity": "error"},
    {"field": "description", "message": "...", "severity": "warning"}
  ]
}
```

- `is_valid: true` — нет ошибок (severity=error), могут быть warnings
- `is_valid: false` — есть хотя бы одна ошибка

### Автоисправление ошибок валидации

При генерации контента, если AI создал текст с ошибками валидации (запрещённые слова, неверная длина), система автоматически вызывает AI повторно для исправления.

```python
# content_service.py
MAX_VALIDATION_RETRIES = 1  # Максимум 1 попытка автоисправления
```

Флоу:
1. AI генерирует контент
2. Валидация находит ошибки
3. Вызов `ai_service.fix_validation_errors()` с промптом `build_fix_validation_prompt()`
4. Повторная валидация
5. Если всё ещё есть ошибки — возвращаем как есть (с `is_valid: false`)

## Запуск

```bash
# Установка зависимостей
pip install -r requirements.txt

# Активация виртуального окружения (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Запуск сервера (порт 3000, т.к. 8080 может быть занят)
uvicorn app.main:app --reload --host 0.0.0.0 --port 3000

# Swagger UI
http://localhost:3000/docs

# Health check
http://localhost:3000/health
```

## Работа с БД (asyncpg)

### Пул соединений

```python
# database.py — инициализация при старте приложения
_pool = await asyncpg.create_pool(
    db_url,
    min_size=2,   # Всегда держим 2 соединения открытыми
    max_size=10,  # Максимум 10 параллельных соединений
)
```

### Использование в репозиториях

```python
# Контекстный менеджер — берём соединение из пула
async with get_connection() as conn:
    row = await conn.fetchrow(
        "SELECT * FROM reputation_products WHERE external_id = $1",
        sku
    )
    return dict(row) if row else None
# Соединение автоматически возвращается в пул
```

### Методы asyncpg

- `conn.fetchrow()` — одна запись (dict)
- `conn.fetch()` — список записей
- `conn.fetchval()` — одно значение (COUNT, etc)
- `conn.execute()` — без возврата (UPDATE без RETURNING)

### Репозиторий товаров (product_repo.py)

| Метод | Назначение |
|-------|------------|
| `get_product_by_sku()` | Поиск товара по SKU (nmID или vendor_code) |
| `get_products_by_imt_id()` | Все товары в склейке по imt_id |
| `get_product_group_by_sku()` | Товар + все товары в его склейке |

```python
# Пример использования
group_data = await product_repo.get_product_group_by_sku("123456789")
# Возвращает:
# {
#     "product": {...},           # основной товар
#     "group_products": [...],    # все товары в склейке
#     "imt_id": 12345678,         # ID склейки
#     "group_count": 3            # количество товаров
# }
```

## Интеграции

### Wildberries Content API

**Документация:** https://dev.wildberries.ru/openapi/work-with-products/

```python
# wb_service.py

# Обновление карточки (POST, не PUT!)
POST https://content-api.wildberries.ru/content/v2/cards/update
Headers: Authorization: {WB_TOKEN}
Body: [{ "nmID": 123, "vendorCode": "16378", "title": "...", "description": "...", "characteristics": [...], "sizes": [...] }]

# Получение карточки (POST, не GET!)
POST https://content-api.wildberries.ru/content/v2/get/cards/list
Body: { "settings": { "cursor": { "limit": 100 }, "filter": { "withPhoto": -1 } }, "nmIDs": [203873004] }

# Список ошибок модерации (POST, не GET!)
POST https://content-api.wildberries.ru/content/v2/cards/error/list
Body: { "cursor": { "limit": 100 }, "order": { "ascending": false } }
```

#### Обязательные поля при обновлении карточки

WB API **перезаписывает карточку целиком**! Нужно отправлять ВСЕ поля:

```json
[
  {
    "nmID": 203873004,
    "vendorCode": "16378",
    "brand": "Ohana market",
    "title": "Новое название",
    "description": "Новое описание",
    "characteristics": [
      { "id": 12, "value": ["значение"] },
      { "id": 14177449, "value": "цвет" }
    ],
    "sizes": [
      {
        "chrtID": 12345678,
        "techSize": "41-45",
        "wbSize": "RU",
        "skus": ["88005553535"]
      }
    ]
  }
]
```

#### Известные проблемы WB API

1. **API возвращает 200 OK даже при ошибках!**
   - Всегда проверяйте `/content/v2/cards/error/list` после обновления
   - Ответ `{"error": false}` НЕ гарантирует, что изменения применились

2. **Дублирование запросов (известный баг)**
   - При обновлении карточки запрос иногда дублируется
   - В личном кабинете появляются 2 черновика с ошибкой "Измените значения полей «Артикул продавца»"
   - Решение: проверять ошибки через API и черновики в ЛК

3. **Синхронизация занимает до 30 минут**
   - После успешного обновления изменения могут появиться не сразу
   - В это время нельзя добавлять остатки и устанавливать цены

4. **Медиафайлы редактируются отдельно**
   - Поля `photos`, `video`, `tags` нельзя обновить через `/cards/update`
   - Используйте отдельные методы для медиафайлов и ярлыков

#### Алгоритм обновления карточки (wb_service.py)

```
1. GET текущую карточку через /content/v2/get/cards/list (по vendorCode)
2. Мержим новые данные (title, description) с текущими
3. POST полную карточку на /content/v2/cards/update
4. Ждём 2 секунды
5. Проверяем ошибки через /content/v2/cards/error/list
6. Если есть ошибки — возвращаем их в ответе
```

#### Пакетное обновление карточек (склейки)

Метод `wb_service.update_multiple_cards()` для обновления всех карточек в склейке:

```python
async def update_multiple_cards(
    cards_data: list[dict],  # [{"nm_id": 123, "vendor_code": "ABC"}, ...]
    title: str,
    description: str,
) -> dict:
    """
    Возвращает:
    {
        "success": True/False,
        "updated_nm_ids": [123, 456],
        "failed_nm_ids": [789],
        "errors": [{"nm_id": 789, "error": "..."}]
    }
    """
```

**Особенности:**
- Карточки обновляются **последовательно** (не параллельно)
- Между запросами пауза **1 секунда**
- При ошибке на одной карточке — продолжаем обновлять остальные
- Возвращает списки успешных и неуспешных обновлений

### Claude AI (CLI + подписка Max)

AI-сервис использует Claude CLI через `subprocess.run` + `asyncio.to_thread` (не httpx).

```python
# ai_service.py — вызов Claude CLI (оптимизированный)
MODEL = "claude-sonnet-4-5-20250929"

def _call_claude_sync(system_prompt: str, user_prompt: str) -> tuple:
    env = os.environ.copy()
    env.pop("ANTHROPIC_API_KEY", None)

    cmd = [
        claude_path, "-p",
        "--model", MODEL,
        "--max-turns", "1",
        "--output-format", "json",          # JSON с usage/cache метриками
        "--no-session-persistence",          # Не сохранять сессию на диск
        "--disable-slash-commands",          # Отключить slash-команды
        "--tools", "",                       # Отключить все инструменты
        "--setting-sources", "",             # Не загружать настройки (CLAUDE.md и т.д.)
        "--system-prompt", system_prompt,    # System message (для prompt caching)
    ]

    result = subprocess.run(
        cmd,
        input=user_prompt,                   # User message через stdin
        capture_output=True, text=True, encoding="utf-8",
        timeout=180, env=env,
    )
    return result.stdout, result.stderr, result.returncode
```

**Оптимизации CLI (из optimization-plan.md):**
- System prompt передаётся через `--system-prompt` как system message (не склеен с user prompt) — необходимо для prompt caching
- `--output-format json` — структурированный ответ с usage/cache метриками
- `--tools ""` + `--disable-slash-commands` + `--setting-sources ""` — отключает загрузку инструментов, настроек и CLAUDE.md
- Prompt caching: Sonnet кэширует system prompt от 1024 токенов, наш ~1963 токенов — подходит. Кэш живёт 5 минут

**Почему `subprocess.run`, а не `asyncio.create_subprocess_shell`:**
На Windows uvicorn использует `SelectorEventLoop`, который не поддерживает `asyncio.create_subprocess_shell`. Поэтому используем синхронный `subprocess.run` через `asyncio.to_thread`.

**Почему убираем `ANTHROPIC_API_KEY` из env:**
Если переменная задана, CLI пойдёт через API (платно). Убирая её, CLI использует OAuth-токен подписки Max из `~/.claude/.credentials.json`.

**Настройка на новой машине:**
1. Установить Node.js
2. `npm install -g @anthropic-ai/claude-code`
3. `claude login` — авторизация через браузер (OAuth)
4. Проверка: `claude -p --model claude-sonnet-4-5-20250929 --max-turns 1 --output-format json "test"`

**Производительность:** ~1.5-3 секунды на один вызов с оптимизированными флагами (было ~12-15 сек).

#### Методы AI сервиса (ai_service.py)

| Метод | Назначение |
|-------|------------|
| `generate_content()` | Генерация для одиночного товара |
| `regenerate_content()` | Перегенерация с учётом предыдущего результата |
| `fix_validation_errors()` | Автоисправление ошибок валидации |

### AI Промпты (content_prompts.py)

| Функция | Назначение |
|---------|------------|
| `SYSTEM_PROMPT` | Базовый системный промпт с правилами WB |
| `build_generation_prompt()` | Первичная генерация контента (одиночный товар) |
| `build_regeneration_prompt()` | Перегенерация с учётом предыдущего результата |
| `build_fix_validation_prompt()` | Исправление ошибок валидации |

**Правила генерации названия:**
- До 60 символов
- Суть товара + 1-2 ключевых слова
- **НЕ добавлять бренд в начало!** (бренд уже отображается отдельно на WB)

## Логирование

### Форматы логов

- **simple** — цветной консольный вывод для разработки
- **structured** — JSON-формат для production (ELK/Datadog)

### Настройка

```env
LOG_LEVEL=INFO          # DEBUG, INFO, WARNING, ERROR
LOG_FORMAT=             # "simple", "structured" или пусто (auto)
```

Если `LOG_FORMAT` не указан — автоматически выбирается:
- `simple` если `DEBUG=true`
- `structured` если `DEBUG=false`

### Пример логов

```
# simple (dev)
2024-01-01 12:00:00 | INFO | Step 1/5: Draft fetched | sku=203873004

# structured (prod)
{"timestamp": "2024-01-01T12:00:00Z", "level": "INFO", "message": "Step 1/5: Draft fetched", "sku": "203873004"}
```

## Важные замечания

### WB API и владение карточками

- `WB_TOKEN` привязан к конкретному магазину
- Через API можно работать только со **своими** карточками
- При попытке обновить чужую карточку — WB вернёт 200 OK, но **ничего не изменит**
- Эндпоинт `/api/content/wb/card/{sku}` показывает только карточки своего магазина

### Диагностика проблем с WB API

Если обновление не применяется:

1. **Проверить ошибки:** `GET /api/content/wb/errors?sku=203873004`
2. **Проверить черновики в ЛК WB:** Личный кабинет → Товары → Черновики
3. **Проверить логи сервера:** Ищите `[WB API update]` в консоли
4. **Подождать до 30 минут:** Синхронизация WB занимает время

### SEO теги vs WB ярлыки

- `seo_tags` в нашем API — это ключевые слова для SEO (хранятся в БД, отправляются на WB в поле "Комплектация")
- WB `tags` (ярлыки) — редактируются через отдельный API метод, не через `/cards/update`

### Термины

| Термин | Описание | Пример |
|--------|----------|--------|
| `sku` / `nmID` | Артикул WB (внутренний ID карточки) | 203873004 |
| `vendor_code` | Артикул продавца | 16378 |
| `external_id` | Поле в БД = nmID | 203873004 |
| `imt_id` | ID склейки (группы товаров с разными цветами) | 12345678 |
| Склейка | Группа товаров, объединённых в одну карточку | 3 цвета = 3 nmID, 1 imt_id |

## Известные особенности

### WB API игнорирует фильтр nmIDs

WB API `POST /content/v2/get/cards/list` с параметром `nmIDs: [123]` **не фильтрует** по указанным nmID — возвращает все карточки магазина (до 100 шт). Поэтому в `wb_service.py:get_card()` реализован поиск по всему списку возвращённых карточек вместо проверки только `cards[0]`.

### Windows cp1251 и Unicode в print()

На Windows консоль использует кодировку cp1251, которая не поддерживает многие Unicode-символы (эмодзи, неразрывный дефис `\u2011` и т.д.). Все `print()` в `wb_service.py` заменены на `_safe_print()`, которая перехватывает `UnicodeEncodeError` и заменяет непечатаемые символы. В `database.py` эмодзи в print заменены на текстовые маркеры `[OK]`.

**Правило:** при добавлении новых `print()` в коде, который может содержать данные с WB (карточки, описания), использовать `_safe_print()` из `wb_service.py` или избегать `ensure_ascii=False` в `json.dumps()`.

## Деплой

- CI/CD через GitHub Actions (`.github/workflows/deploy.yml`)
- Systemd сервис (`deploy/content-factory.service`)
- Скрипт настройки сервера (`deploy/setup-server.sh`)

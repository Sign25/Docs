# AdolfReputationBack API Reference

Полная документация REST API сервиса управления репутацией.

**Base URL:** `http://localhost:8000`
**Swagger UI:** `http://localhost:8000/docs`

---

## Содержание

1. [Health](#health)
2. [Reviews — чтение](#reviews--чтение)
3. [Reviews — генерация AI](#reviews--генерация-ai)
4. [Reviews — модерация](#reviews--модерация)
5. [Reviews — публикация](#reviews--публикация)
6. [Reviews — история](#reviews--история)
7. [Polling](#polling)
8. [Statistics](#statistics)
9. [Settings](#settings)
10. [Схема БД](#схема-бд)

---

## Health

### `GET /`

Информация о сервисе.

**Response 200:**
```json
{
  "service": "AdolfReputationBack",
  "version": "1.2.4",
  "docs": "/docs"
}
```

### `GET /health`

Проверка работоспособности сервиса и подключения к БД.

**Response 200:**
```json
{
  "status": "ok",
  "db": "connected"
}
```

---

## Reviews — чтение

### `GET /api/v1/reviews`

Список отзывов/вопросов с фильтрами и пагинацией.

**Query Parameters:**

| Параметр | Тип | Обязательный | Описание |
|----------|-----|:---:|----------|
| marketplace | string | нет | `wildberries`, `ozon`, `yandex_market` |
| status | string | нет | `new`, `analyzing`, `pending_review`, `approved`, `publishing`, `published`, `answered`, `skipped`, `escalated`, `error` |
| item_type | string | нет | `review`, `question` |
| page | int | нет | Страница (default: 1) |
| page_size | int | нет | Размер страницы 1-100 (default: 20) |

**Response 200:**
```json
{
  "items": [
    {
      "id": 3920781,
      "wb_id": "tlMCv5wBmLVQe3Vyh7kr",
      "item_type": "review",
      "marketplace": "wildberries",
      "client_name": "Иван",
      "client_text": "Отличный товар, всем рекомендую!",
      "rating": 5,
      "status": "new",
      "product_id": 123456789,
      "pros": "Качество, цена",
      "cons": null,
      "wb_created_at": "2026-03-01T10:00:00",
      "created_at": "2026-03-01T12:00:00",
      "is_viewed": false,
      "response": null
    }
  ],
  "total": 155371,
  "page": 1,
  "page_size": 20
}
```

### `GET /api/v1/reviews/{item_id}`

Детали одного отзыва/вопроса с ответом.

**Response 200:**
```json
{
  "id": 3920781,
  "wb_id": "tlMCv5wBmLVQe3Vyh7kr",
  "item_type": "review",
  "marketplace": "wildberries",
  "client_name": "Иван",
  "client_text": "Отличный товар!",
  "rating": 5,
  "status": "pending_review",
  "product_id": 123456789,
  "pros": "Качество",
  "cons": null,
  "wb_created_at": "2026-03-01T10:00:00",
  "created_at": "2026-03-01T12:00:00",
  "is_viewed": false,
  "response": {
    "id": 1,
    "ai_variants": [
      {
        "text": "Спасибо за отзыв!",
        "classification": {"sentiment": "positive"},
        "generated_at": "2026-03-06T12:00:00",
        "generation_id": "uuid",
        "draft_id": "uuid"
      }
    ],
    "final_text": "Спасибо за отзыв!",
    "status": "approved",
    "manager_notes": null,
    "generated_at": "2026-03-06T12:00:00",
    "published_at": null,
    "wb_error": null,
    "marketplace": "wildberries"
  }
}
```

**Response 404:**
```json
{"detail": "Item not found"}
```

---

## Reviews — генерация AI

### `POST /api/v1/reviews/{item_id}/generate`

Классификация отзыва + генерация ответа через Timeweb Cloud AI.

**Что происходит:**
1. Создаётся `reputation_generations` (status: processing)
2. AI классифицирует отзыв (sentiment, tags, category)
3. AI генерирует ответ (50-500 символов)
4. Создаётся `reputation_drafts` (immutable)
5. Обновляется `reputation_responses.ai_variants`
6. Лог в `auto_process_log`

**Request Body (optional):**
```json
{
  "instructions": "Сделай ответ более тёплым"
}
```

**Response 200:**
```json
{
  "item_id": 3920781,
  "generation_id": "470d67da-38d3-4c8e-9548-925b2d7cb237",
  "draft_id": "c977be1d-defa-476b-93ff-101aa18fd8e6",
  "draft_text": "Спасибо за ваш отзыв! Мы очень рады, что вам понравился наш товар.",
  "ai_variants": [
    {
      "text": "Спасибо за ваш отзыв!...",
      "classification": {"sentiment": "positive", "tags": ["quality"]},
      "generated_at": "2026-03-06T12:00:00",
      "generation_id": "470d67da-...",
      "draft_id": "c977be1d-..."
    }
  ]
}
```

**Response 500:** (ошибка AI)
```json
{"detail": "Classification failed: ..."}
```

### `POST /api/v1/reviews/{item_id}/regenerate`

Перегенерация с инструкциями. Максимум 5 вариантов (drafts).

**Request Body (required):**
```json
{
  "instructions": "Добавь извинение, клиент недоволен"
}
```

**Response 200:** (аналогично /generate)

**Response 400:**
```json
{"detail": "No response exists yet. Use /generate first."}
```
```json
{"detail": "Regeneration limit exceeded (max 5)"}
```

---

## Reviews — модерация

### `POST /api/v1/reviews/{item_id}/approve`

Одобрение ответа. Последний draft получает статус `approved`.

**Request Body (optional):**
```json
{
  "final_text": "Ручная правка текста менеджером"
}
```

Если `final_text` не передан — берётся текст из последнего draft.

**Response 200:** ItemResponse (item.status = "approved")

### `POST /api/v1/reviews/bulk-approve`

Массовое одобрение.

**Request Body:**
```json
{
  "item_ids": [100, 101, 102]
}
```

**Response 200:**
```json
{
  "approved_count": 3,
  "item_ids": [100, 101, 102]
}
```

### `POST /api/v1/reviews/{item_id}/skip`

Пропустить отзыв (не отвечать).

**Response 200:** ItemResponse (item.status = "skipped")

### `POST /api/v1/reviews/{item_id}/escalate`

Эскалация (передать менеджеру).

**Response 200:** ItemResponse (item.status = "escalated")

---

## Reviews — публикация

### `POST /api/v1/reviews/{item_id}/publish`

Отправка одобренного ответа на маркетплейс.

**Требование:** response.status должен быть `approved` или `failed`.

**Что происходит:**
1. Выбирается publisher по marketplace (WB / YM / Ozon)
2. Отправляется HTTP-запрос на API маркетплейса
3. Создаётся `reputation_publications` (published_text, api_response)
4. Лог в `auto_process_log`

**API маркетплейсов:**

| Marketplace | Reviews | Questions |
|------------|---------|-----------|
| Wildberries | `POST feedbacks-api.wildberries.ru/api/v1/feedbacks/answer` | `PATCH feedbacks-api.wildberries.ru/api/v1/questions` |
| Yandex Market | `POST api.partner.market.yandex.ru/v2/businesses/{id}/goods-feedback/comments` | `POST api.partner.market.yandex.ru/v1/businesses/{id}/goods-questions/answers` |
| Ozon | Не поддерживается через API | Не поддерживается через API |

**Response 200:**
```json
{
  "item_id": 3920781,
  "publication_id": "d8ecd889-f0c5-41d6-a9aa-7735f1dc578c",
  "status": "published",
  "error": null
}
```

**Response 200 (ошибка публикации):**
```json
{
  "item_id": 3920781,
  "publication_id": "d8ecd889-...",
  "status": "failed",
  "error": "401 Client Error: Unauthorized"
}
```

---

## Reviews — история

### `GET /api/v1/reviews/{item_id}/history`

Полная история генераций, черновиков и публикаций.

**Response 200:**
```json
{
  "item_id": 3920781,
  "generations": [
    {
      "id": "470d67da-...",
      "status": "completed",
      "error_message": null,
      "analysis_result": {"sentiment": "positive", "tags": ["quality"]},
      "created_at": "2026-03-06T12:00:00",
      "completed_at": "2026-03-06T12:00:05"
    }
  ],
  "drafts": [
    {
      "id": "c977be1d-...",
      "generation_id": "470d67da-...",
      "response_text": "Спасибо за ваш отзыв!",
      "classification": {"sentiment": "positive"},
      "is_valid": true,
      "status": "approved",
      "manager_notes": null,
      "created_at": "2026-03-06T12:00:05"
    }
  ],
  "publications": [
    {
      "id": "d8ecd889-...",
      "draft_id": "c977be1d-...",
      "published_text": "Спасибо за ваш отзыв!",
      "status": "success",
      "error_message": null,
      "published_at": "2026-03-06T12:05:00",
      "source": "manual"
    }
  ]
}
```

---

## Polling

### `POST /api/v1/polling/{marketplace}/trigger`

Ручной запуск сбора отзывов/вопросов с маркетплейса.

**Path Parameters:**
- `marketplace`: `wildberries`, `ozon`, `yandex_market`

**Query Parameters:**
- `item_type` (optional): `review` или `question`

**Response 200:**
```json
{
  "results": [
    {"marketplace": "wildberries", "item_type": "review", "fetched": 15, "new": 3},
    {"marketplace": "wildberries", "item_type": "question", "fetched": 5, "new": 1}
  ]
}
```

### `GET /api/v1/polling/status`

Состояние polling для всех маркетплейсов.

**Response 200:**
```json
{
  "states": [
    {
      "marketplace": "wildberries",
      "item_type": "review",
      "last_poll_time": "2026-03-06T12:00:00",
      "last_poll_status": "success",
      "last_poll_error": null,
      "items_fetched_total": 1500,
      "items_fetched_last": 15,
      "consecutive_errors": 0,
      "circuit_breaker_open": false
    }
  ]
}
```

---

## Statistics

### `GET /api/v1/stats`

Агрегированная статистика по дням.

**Query Parameters:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| date_from | date | Начало периода (YYYY-MM-DD) |
| date_to | date | Конец периода |
| marketplace | string | Фильтр по маркетплейсу |

**Response 200:**
```json
{
  "stats": [
    {
      "date": "2026-03-06",
      "marketplace": "wildberries",
      "total_items": 150,
      "reviews_count": 120,
      "questions_count": 30,
      "positive_count": 90,
      "neutral_count": 20,
      "negative_count": 10,
      "avg_rating": 4.2,
      "published_count": 80,
      "avg_response_time_min": 45
    }
  ],
  "total": 1
}
```

### `GET /api/v1/stats/summary`

Агрегированная сводка для дашборда.

**Query Parameters:**

| Параметр | Тип | Обязательный | Описание |
|----------|-----|:---:|----------|
| marketplace | string | нет | Фильтр по маркетплейсу |

**Response 200:**
```json
{
  "total_items": 155371,
  "avg_rating": 4.3,
  "avg_response_time_min": 45,
  "positive_count": 120000,
  "published_count": 80000,
  "marketplaces": [
    {"marketplace": "wildberries", "total": 100000, "avg_rating": 4.5, "response_pct": 75},
    {"marketplace": "ozon", "total": 50000, "avg_rating": 4.1, "response_pct": 60}
  ]
}
```

### `POST /api/v1/stats/recompute`

Пересчёт аналитики за последние N дней.

**Query Parameters:**

| Параметр | Тип | Обязательный | Описание |
|----------|-----|:---:|----------|
| days | int | нет | Количество дней (default: 90, max: 365) |

**Response 200:**
```json
{
  "recomputed_days": 42,
  "message": "Пересчитано 42 записей за 90 дней"
}
```

---

## Settings

### `GET /api/v1/settings`

Все настройки приложения.

**Response 200:**
```json
[
  {"key": "reputation_max_regenerations", "value": "5", "updated_at": "2026-03-06T12:00:00"},
  {"key": "auto_check_enabled", "value": "true", "updated_at": "2026-03-06T10:00:00"}
]
```

### `GET /api/v1/settings/{key}`

Одна настройка.

**Response 200:**
```json
{"key": "reputation_max_regenerations", "value": "5", "updated_at": "2026-03-06T12:00:00"}
```

### `PUT /api/v1/settings/{key}`

Создать или обновить настройку.

**Request Body:**
```json
{"value": "10"}
```

**Response 200:**
```json
{"key": "reputation_max_regenerations", "value": "10", "updated_at": "2026-03-06T12:05:00"}
```

---

## Схема БД

### Таблицы

```
reputation_products          (товары — только чтение)
        │
reputation_items             (отзывы/вопросы)
    ├── reputation_responses     (AI варианты + финальный текст — обратная совместимость)
    ├── reputation_generations   (лог запросов к AI)
    │       └── reputation_drafts    (черновики от AI, immutable)
    │               └── reputation_publications  (что отправлено на МП)
    │
polling_state                (состояние polling)
reputation_analytics         (дневная статистика)
auto_process_log             (аудит-лог всех операций)
app_settings                 (настройки key-value)
```

### reputation_products

Исходные данные товаров. Только чтение (данные от AdolfDataSync).

| Поле | Тип | Описание |
|------|-----|----------|
| external_id | BIGINT | PK — nmID с Wildberries |
| marketplace | VARCHAR | PK — "wildberries", "ozon", "yandex_market" |
| vendor_code | VARCHAR | Артикул продавца |
| brand_tag | VARCHAR | Бренд |
| title | TEXT | Название товара |
| description | TEXT | Описание |
| composition | TEXT | Состав/материал |
| size_measurements | JSONB | Данные по размерам |
| media_urls | JSONB | Массив ссылок на фото |
| attributes | JSONB | Характеристики |
| video_url | VARCHAR | Ссылка на видео |
| imt_id | BIGINT | ID склейки |
| updated_at | TIMESTAMP | Когда обновлено |

### reputation_items

Отзывы и вопросы с маркетплейсов.

| Поле | Тип | Описание |
|------|-----|----------|
| id | INTEGER | PK |
| wb_id | VARCHAR | Внешний ID на маркетплейсе |
| item_type | VARCHAR | "review" / "question" |
| marketplace | VARCHAR | "wildberries" / "ozon" / "yandex_market" |
| client_name | VARCHAR | Имя автора |
| client_text | TEXT | Текст отзыва/вопроса |
| rating | INTEGER | Оценка (1-5, null для вопросов) |
| status | VARCHAR | Статус обработки (см. ниже) |
| product_id | BIGINT | FK → reputation_products.external_id |
| pros | TEXT | Достоинства |
| cons | TEXT | Недостатки |
| photos | JSONB | Фото от клиента |
| video | JSONB | Видео от клиента |
| wb_created_at | TIMESTAMP | Дата на маркетплейсе |
| is_viewed | BOOLEAN | Просмотрен ли |
| created_at | TIMESTAMP | Когда добавлен в систему |

**Статусы item:**
`new` → `analyzing` → `pending_review` → `approved` → `publishing` → `answered`
- Альтернативные: `skipped`, `escalated`, `error`

### reputation_responses

AI-варианты и финальный текст (обратная совместимость).

| Поле | Тип | Описание |
|------|-----|----------|
| id | INTEGER | PK |
| item_id | INTEGER | FK → reputation_items.id |
| ai_variants | JSONB | Массив вариантов [{text, classification, generated_at, generation_id, draft_id}] |
| final_text | TEXT | Финальный одобренный текст |
| status | VARCHAR | "draft" / "approved" / "published" / "failed" |
| manager_notes | TEXT | Заметки менеджера |
| approved_by_id | INTEGER | Кто одобрил |
| generated_at | TIMESTAMP | Первая генерация |
| published_at | TIMESTAMP | Когда опубликовано |
| wb_error | TEXT | Ошибка публикации |
| marketplace | VARCHAR | Маркетплейс |

### reputation_generations

Лог каждого вызова AI. Каждый `/generate` или `/regenerate` = новая запись.

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | PK |
| item_id | INTEGER | FK → reputation_items.id |
| marketplace | VARCHAR(30) | Маркетплейс |
| product_id | BIGINT | ID товара |
| context | JSONB | Полный контекст для AI (client_text, pros, cons, product_info, instructions) |
| user_id | UUID | Кто запустил (nullable) |
| status | VARCHAR(20) | "pending" → "processing" → "completed" / "failed" |
| error_message | TEXT | Ошибка если failed |
| analysis_result | JSONB | Результат классификации |
| created_at | TIMESTAMP | Когда создан |
| completed_at | TIMESTAMP | Когда завершён |

### reputation_drafts

Черновики ответов от AI. **Immutable** — каждая перегенерация = новая запись.

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | PK |
| generation_id | UUID | FK → reputation_generations.id |
| item_id | INTEGER | FK → reputation_items.id |
| marketplace | VARCHAR(30) | Маркетплейс |
| response_text | TEXT | Текст ответа от AI |
| classification | JSONB | Классификация (sentiment, tags) |
| validation_result | JSONB | Результат автопроверки |
| is_valid | BOOLEAN | Прошёл ли валидацию |
| status | VARCHAR(20) | "draft" → "approved" / "rejected" |
| manager_notes | TEXT | Комментарии менеджера |
| approved_by | UUID | Кто утвердил |
| created_at | TIMESTAMP | Когда создан |
| updated_at | TIMESTAMP | Когда обновлён |

### reputation_publications

Записи о публикации на маркетплейс.

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | PK |
| draft_id | UUID | FK → reputation_drafts.id |
| item_id | INTEGER | FK → reputation_items.id |
| marketplace | VARCHAR(30) | Маркетплейс |
| external_id | VARCHAR | wb_id отзыва на МП |
| published_text | TEXT | Финальный текст (может отличаться от draft) |
| status | VARCHAR(20) | "success" / "failed" |
| error_code | VARCHAR(50) | Код ошибки API |
| error_message | TEXT | Текст ошибки |
| api_response | JSONB | Полный ответ API маркетплейса |
| published_by | UUID | Кто опубликовал |
| published_at | TIMESTAMP | Когда опубликовано |
| source | VARCHAR(20) | "manual" / "auto" |

### polling_state

Состояние polling для каждого маркетплейса.

| Поле | Тип | Описание |
|------|-----|----------|
| id | INTEGER | PK |
| marketplace | VARCHAR(30) | Маркетплейс |
| item_type | VARCHAR(20) | "review" / "question" |
| last_poll_time | TIMESTAMP | Последний poll |
| last_poll_status | VARCHAR(20) | "success" / "error" |
| last_poll_error | TEXT | Текст ошибки |
| items_fetched_total | INTEGER | Всего получено |
| items_fetched_last | INTEGER | Получено за последний poll |
| consecutive_errors | INTEGER | Ошибок подряд |
| circuit_breaker_open | BOOLEAN | Circuit breaker активен |
| circuit_breaker_until | TIMESTAMP | Когда снимется |

### reputation_analytics

Дневная статистика.

| Поле | Тип | Описание |
|------|-----|----------|
| id | INTEGER | PK |
| date | DATE | Дата |
| marketplace | VARCHAR(30) | Маркетплейс |
| total_items | INTEGER | Всего items |
| reviews_count | INTEGER | Отзывов |
| questions_count | INTEGER | Вопросов |
| positive/neutral/negative_count | INTEGER | По sentiment |
| avg_rating | NUMERIC(3,2) | Средняя оценка |
| published_count | INTEGER | Опубликовано |
| avg_response_time_min | INTEGER | Среднее время ответа (мин) |

### auto_process_log

Аудит-лог всех автоматических процессов.

| Поле | Тип | Описание |
|------|-----|----------|
| id | SERIAL | PK |
| run_id | VARCHAR(36) | UUID пакетного запуска |
| process_type | VARCHAR(30) | "reputation_generate" / "reputation_publish" |
| external_id | BIGINT | ID товара |
| action | VARCHAR(100) | "generate:success", "publish:wildberries" |
| status | VARCHAR(20) | "success" / "error" |
| error | TEXT | Текст ошибки |
| marketplace | VARCHAR(30) | Маркетплейс |
| generated_title | TEXT | Текст ответа AI |
| generated_description | TEXT | JSON классификации |
| generated_seo_tags | TEXT | Инструкции менеджера |
| created_at | TIMESTAMP | Когда записано |

### app_settings

Настройки приложения (key-value).

| Поле | Тип | Описание |
|------|-----|----------|
| key | VARCHAR(100) | PK — имя настройки |
| value | TEXT | Значение |
| updated_at | TIMESTAMP | Когда обновлено |

---

## Цепочка обработки отзыва

```
1. Polling (или AdolfDataSync)
   └── reputation_items (status: new)

2. POST /generate
   ├── reputation_generations (status: completed)
   ├── reputation_drafts (status: draft)
   ├── reputation_responses.ai_variants (обратная совместимость)
   ├── auto_process_log (process_type: reputation_generate)
   └── reputation_items (status: pending_review)

3. POST /approve
   ├── reputation_drafts (status: approved)
   ├── reputation_responses (final_text, status: approved)
   └── reputation_items (status: approved)

4. POST /publish
   ├── reputation_publications (status: success/failed, api_response)
   ├── reputation_responses (published_at, status: published)
   ├── auto_process_log (process_type: reputation_publish)
   └── reputation_items (status: answered)
```

---

## Запуск

```bash
cd AdolfReputationBack
python -m venv .venv
source .venv/Scripts/activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Переменные окружения (.env):**
```
DB_HOST=...
DB_PORT=5432
DB_NAME=...
DB_USER=...
DB_PASSWORD=...
TIMEWEB_API_TOKEN=...
TIMEWEB_AGENT_ID=...
WB_API_KEY=...
YM_API_KEY=...
YM_BUSINESS_ID=...
YM_CAMPAIGN_ID=...
OZON_CLIENT_ID=...
OZON_API_KEY=...
```

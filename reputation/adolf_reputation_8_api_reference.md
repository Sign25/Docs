# AdolfReputationBack — API Reference

> **Версия:** 1.2.11
> **Base URL:** `https://your-server.com` (dev: `http://localhost:8000`)
> **Swagger UI:** `{BASE_URL}/docs`

---

## Содержание

1. [Health](#1-health)
2. [Reviews — Чтение](#2-reviews--чтение)
3. [Reviews — AI-генерация](#3-reviews--ai-генерация)
4. [Reviews — Модерация](#4-reviews--модерация)
5. [Reviews — Публикация](#5-reviews--публикация)
6. [Reviews — История](#6-reviews--история)
7. [Polling (сбор отзывов)](#7-polling-сбор-отзывов)
8. [Statistics (аналитика)](#8-statistics-аналитика)
9. [Settings (настройки)](#9-settings-настройки)
10. [Автоматические процессы (Scheduler)](#10-автоматические-процессы-scheduler)
11. [Схема БД](#11-схема-бд)
12. [Пайплайн обработки](#12-пайплайн-обработки)

---

## 1. Health

### `GET /`

Информация о сервисе.

**Ответ:**

```json
{
  "service": "AdolfReputationBack",
  "version": "1.2.11",
  "docs": "/docs"
}
```

### `GET /health`

Проверка соединения с БД.

**Ответ:**

```json
{
  "status": "ok",
  "database": "connected"
}
```

---

## 2. Reviews — Чтение

### `GET /api/v1/reviews`

Список отзывов/вопросов с фильтрацией и пагинацией.

**Query-параметры:**

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|----------|
| `marketplace` | string | — | `wildberries`, `ozon`, `yandex_market` |
| `status` | string | — | `new`, `analyzing`, `pending_review`, `approved`, `publishing`, `published`, `answered`, `skipped`, `escalated`, `error` |
| `item_type` | string | — | `review`, `question` |
| `page` | int | `1` | Номер страницы (≥ 1) |
| `page_size` | int | `20` | Записей на странице (1–100) |

**Ответ: `ItemListResponse`**

```json
{
  "items": [ItemResponse],
  "total": 150,
  "page": 1,
  "page_size": 20
}
```

### `GET /api/v1/reviews/{item_id}`

Детали одного отзыва/вопроса.

**Ответ: `ItemResponse`**

```json
{
  "id": 1,
  "wb_id": "12345678",
  "item_type": "review",
  "marketplace": "wildberries",
  "client_name": "Анна",
  "client_text": "Отличное платье, хорошо сидит!",
  "rating": 5,
  "status": "pending_review",
  "product_id": 987654,
  "pros": "Качество ткани, посадка",
  "cons": null,
  "wb_created_at": "2026-03-10T12:00:00",
  "created_at": "2026-03-10T13:05:00",
  "is_viewed": false,
  "response": {
    "id": 1,
    "ai_variants": [
      {
        "text": "Добрый день, Анна! Благодарим...",
        "classification": { "sentiment": "positive", "tags": ["качество"], "scenario": "five_stars" },
        "generated_at": "2026-03-10T13:06:00",
        "generation_id": "uuid",
        "draft_id": "uuid"
      }
    ],
    "final_text": null,
    "status": "draft",
    "manager_notes": null,
    "generated_at": "2026-03-10T13:06:00",
    "published_at": null,
    "wb_error": null,
    "marketplace": "wildberries"
  }
}
```

**Поля `ItemResponse`:**

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | int | Внутренний ID |
| `wb_id` | string | ID на маркетплейсе |
| `item_type` | string | `review` / `question` |
| `marketplace` | string | `wildberries` / `ozon` / `yandex_market` |
| `client_name` | string? | Имя покупателя |
| `client_text` | string? | Текст отзыва/вопроса |
| `rating` | int? | Оценка 1–5 (null для вопросов) |
| `status` | string | Текущий статус обработки |
| `product_id` | int? | ID товара на маркетплейсе |
| `pros` | string? | Достоинства |
| `cons` | string? | Недостатки |
| `wb_created_at` | datetime? | Дата создания на маркетплейсе |
| `created_at` | datetime? | Дата загрузки в систему |
| `is_viewed` | bool? | Просмотрен менеджером |
| `response` | ResponseInfo? | Вложенный объект с ответом |

**Поля `ResponseInfo`:**

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | int | ID ответа |
| `ai_variants` | list? | Массив сгенерированных вариантов (макс. 5) |
| `final_text` | string? | Одобренный текст (может отличаться от AI) |
| `status` | string? | `draft` / `approved` / `published` / `failed` |
| `manager_notes` | string? | Заметки менеджера |
| `generated_at` | datetime? | Дата первой генерации |
| `published_at` | datetime? | Дата публикации |
| `wb_error` | string? | Ошибка от маркетплейса |
| `marketplace` | string? | Маркетплейс |

**Структура элемента `ai_variants[i]`:**

| Поле | Тип | Описание |
|------|-----|----------|
| `text` | string | Текст ответа |
| `classification` | object | Результат классификации AI |
| `generated_at` | string | ISO-дата генерации |
| `generation_id` | string | UUID генерации |
| `draft_id` | string | UUID черновика |

---

## 3. Reviews — AI-генерация

### `POST /api/v1/reviews/{item_id}/generate`

Классификация отзыва + генерация черновика ответа через AI.

**Тело запроса (необязательно):**

```json
{
  "instructions": "Упомяни скидку 20% на следующий заказ"
}
```

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `instructions` | string | Нет | Дополнительные инструкции для AI |

**Что происходит:**

1. Статус отзыва → `analyzing`
2. Создаётся `ReputationGeneration` (status=`processing`)
3. AI **классифицирует** отзыв → sentiment, tags, category, scenario
4. AI **генерирует** ответ (50–600 символов, до 3 попыток с валидацией)
5. Создаётся `ReputationDraft` (immutable черновик)
6. Обновляется `ReputationResponse.ai_variants` (backward compat)
7. Логируется в `AutoProcessLog`
8. Статус отзыва → `pending_review`

**Ответ: `GenerateResponse`**

```json
{
  "item_id": 1,
  "generation_id": "550e8400-e29b-41d4-a716-446655440000",
  "draft_id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "draft_text": "Добрый день, Анна! Благодарим за тёплый отзыв...",
  "ai_variants": [
    {
      "text": "Добрый день, Анна! Благодарим за тёплый отзыв...",
      "classification": { "sentiment": "positive", "scenario": "five_stars" },
      "generated_at": "2026-03-10T13:06:00",
      "generation_id": "uuid",
      "draft_id": "uuid"
    }
  ]
}
```

**Правила валидации AI-ответа:**

| Правило | Условие |
|---------|---------|
| Минимальная длина | ≥ 50 символов |
| Максимальная длина | ≤ 600 символов |
| Запрещённые слова | `конкурент`, `ламода`, `lamoda` |
| Извинение для негатива | При rating ≤ 3 обязательно: «сожалеем» / «извин» / «жаль» |
| Чужой маркетплейс | Нельзя упоминать другие маркетплейсы |

---

### `POST /api/v1/reviews/{item_id}/regenerate`

Генерация нового варианта ответа. **Максимум 5 вариантов на один отзыв.**

**Тело запроса (обязательно):**

```json
{
  "instructions": "Сделай ответ короче и добавь про бесплатную доставку"
}
```

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `instructions` | string | **Да** | Инструкции для нового варианта |

**Предусловия:**
- Должен существовать хотя бы один ответ (сначала вызвать `/generate`)
- Количество черновиков < 5

**Отличия от `/generate`:**
- Не проводит классификацию заново — использует результат предыдущей генерации
- Новый вариант **добавляется** в массив `ai_variants`

**Ответ:** `GenerateResponse` (тот же формат)

**Ошибки:**
- `400` — `No response exists yet. Use /generate first.`
- `400` — `Regeneration limit exceeded (max 5)`

---

## 4. Reviews — Модерация

### `POST /api/v1/reviews/{item_id}/approve`

Одобрение последнего черновика.

**Тело запроса (необязательно):**

```json
{
  "final_text": "Мой отредактированный текст ответа"
}
```

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `final_text` | string | Нет | Текст для ручной правки (замещает AI-вариант) |

**Приоритет выбора текста:**
1. `body.final_text` (если передан) — ручная правка менеджера
2. `latest_draft.response_text` — текст последнего черновика AI
3. `ai_variants[-1].text` — fallback на последний вариант

**Результат:**
- Черновик → `approved`
- Ответ → `approved`
- Отзыв → `approved`

**Ответ:** `ItemResponse`

---

### `POST /api/v1/reviews/bulk-approve`

Массовое одобрение.

**Тело запроса:**

```json
{
  "item_ids": [1, 2, 3, 5, 8]
}
```

**Ответ: `BulkApproveResponse`**

```json
{
  "approved_count": 5,
  "item_ids": [1, 2, 3, 5, 8]
}
```

> Отзывы без ответов молча пропускаются (не попадут в `item_ids`).

---

### `POST /api/v1/reviews/{item_id}/skip`

Пропустить отзыв (не отвечать).

**Результат:** статус → `skipped`
**Ответ:** `ItemResponse`

---

### `POST /api/v1/reviews/{item_id}/escalate`

Эскалация (требует внимания руководства).

**Результат:** статус → `escalated`
**Ответ:** `ItemResponse`

---

## 5. Reviews — Публикация

### `POST /api/v1/reviews/{item_id}/publish`

Отправка одобренного ответа на маркетплейс.

**Предусловия:**
- `response.status` должен быть `approved` или `failed` (повторная попытка)

**Маркетплейсы и API:**

| Маркетплейс | Отзывы | Вопросы |
|-------------|--------|---------|
| **Wildberries** | `POST feedbacks-api.wildberries.ru/api/v1/feedbacks/answer` | `PATCH feedbacks-api.wildberries.ru/api/v1/questions` |
| **Яндекс Маркет** | `POST api.partner.market.yandex.ru/.../goods-feedback/comments` | `POST .../goods-questions/answers` |
| **Ozon** | ❌ Не поддерживается (возвращает `not_supported`) | ❌ Не поддерживается |

**Ответ: `PublishResponse`**

```json
{
  "item_id": 1,
  "publication_id": "uuid",
  "status": "published",
  "error": null
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `item_id` | int | ID отзыва |
| `publication_id` | string? | UUID записи публикации |
| `status` | string | `published` / `failed` / `not_supported` |
| `error` | string? | Текст ошибки |

**При успехе:** отзыв → `answered`, ответ → `published`
**При ошибке:** отзыв → `error`, ответ → `failed` (система попробует повторить автоматически)

---

## 6. Reviews — История

### `GET /api/v1/reviews/{item_id}/history`

Полная история обработки отзыва: генерации, черновики, публикации.

**Ответ:**

```json
{
  "item_id": 1,
  "generations": [
    {
      "id": "uuid",
      "status": "completed",
      "error_message": null,
      "analysis_result": {
        "sentiment": "positive",
        "sentiment_score": 0.95,
        "tags": ["качество", "внешний_вид"],
        "category": "quality",
        "key_points": ["хвалит ткань"],
        "scenario": "five_stars"
      },
      "created_at": "2026-03-10T13:05:30",
      "completed_at": "2026-03-10T13:05:35"
    }
  ],
  "drafts": [
    {
      "id": "uuid",
      "generation_id": "uuid",
      "response_text": "Добрый день, Анна! Благодарим...",
      "classification": { "sentiment": "positive" },
      "is_valid": true,
      "status": "approved",
      "manager_notes": null,
      "created_at": "2026-03-10T13:05:36"
    }
  ],
  "publications": [
    {
      "id": "uuid",
      "draft_id": "uuid",
      "published_text": "Добрый день, Анна! Благодарим...",
      "status": "success",
      "error_message": null,
      "published_at": "2026-03-10T14:00:00",
      "source": "manual"
    }
  ]
}
```

---

## 7. Polling (сбор отзывов)

### `POST /api/v1/polling/{marketplace}/trigger`

Ручной запуск сбора отзывов с маркетплейса.

**Path-параметры:**

| Параметр | Значения |
|----------|----------|
| `marketplace` | `wildberries`, `ozon`, `yandex_market` |

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `item_type` | string? | `review` / `question`. Если не указан — оба типа |

**Ответ:**

```json
{
  "results": [
    {
      "status": "success",
      "marketplace": "wildberries",
      "item_type": "review",
      "fetched": 45,
      "new": 12,
      "duplicates": 33
    }
  ]
}
```

**Особенности:**
- Загружает только **неотвеченные** отзывы/вопросы с маркетплейса
- Дедупликация по `(marketplace, wb_id)` — дубликаты пропускаются
- Circuit breaker: 5 ошибок подряд → пауза 60 секунд

---

### `GET /api/v1/polling/status`

Состояние поллинга по всем маркетплейсам.

**Ответ:**

```json
{
  "states": [
    {
      "marketplace": "wildberries",
      "item_type": "review",
      "last_poll_time": "2026-03-10T13:00:00+00:00",
      "last_poll_status": "success",
      "last_poll_error": null,
      "items_fetched_total": 1500,
      "items_fetched_last": 45,
      "consecutive_errors": 0,
      "circuit_breaker_open": false
    }
  ]
}
```

---

## 8. Statistics (аналитика)

### `GET /api/v1/stats`

Ежедневная статистика с фильтрацией.

**Query-параметры:**

| Параметр | Тип | Формат | Описание |
|----------|-----|--------|----------|
| `date_from` | date | `YYYY-MM-DD` | Начало периода |
| `date_to` | date | `YYYY-MM-DD` | Конец периода |
| `marketplace` | string | — | Фильтр по маркетплейсу |

**Ответ: `StatsResponse`**

```json
{
  "stats": [
    {
      "date": "2026-03-10",
      "marketplace": "wildberries",
      "total_items": 25,
      "reviews_count": 20,
      "questions_count": 5,
      "positive_count": 15,
      "neutral_count": 3,
      "negative_count": 2,
      "avg_rating": 4.10,
      "published_count": 18,
      "avg_response_time_min": 45
    }
  ],
  "total": 30,
  "total_items": 0,
  "avg_rating": 0,
  "avg_response_time_min": 0,
  "positive_count": 0,
  "published_count": 0,
  "marketplaces": []
}
```

**Поля `StatsItem`:**

| Поле | Тип | Описание |
|------|-----|----------|
| `date` | date | Дата |
| `marketplace` | string | Маркетплейс |
| `total_items` | int | Всего отзывов + вопросов за день |
| `reviews_count` | int | Только отзывы |
| `questions_count` | int | Только вопросы |
| `positive_count` | int | rating ≥ 4 |
| `neutral_count` | int | rating = 3 |
| `negative_count` | int | rating ≤ 2 |
| `avg_rating` | decimal? | Средняя оценка (null если нет данных) |
| `published_count` | int | Опубликовано ответов |
| `avg_response_time_min` | int? | Среднее время ответа в минутах |

**Дополнительные поля `StatsResponse` (агрегаты):**

| Поле | Тип | Описание |
|------|-----|----------|
| `total` | int | Количество строк в `stats` |
| `total_items` | int | Агрегат: всего обращений |
| `avg_rating` | float | Агрегат: средняя оценка |
| `avg_response_time_min` | int | Агрегат: среднее время ответа |
| `positive_count` | int | Агрегат: позитивных |
| `published_count` | int | Агрегат: опубликовано |
| `marketplaces` | list | Разбивка по маркетплейсам |

---

### `GET /api/v1/stats/summary`

Сводка для дашборда (за всё время).

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `marketplace` | string? | Фильтр по маркетплейсу |

**Ответ: `DashboardSummary`**

```json
{
  "total_items": 5000,
  "avg_rating": 4.3,
  "avg_response_time_min": 42,
  "positive_count": 3800,
  "published_count": 4200,
  "marketplaces": [
    {
      "marketplace": "wildberries",
      "total": 3000,
      "avg_rating": 4.4,
      "response_pct": 85
    },
    {
      "marketplace": "ozon",
      "total": 1500,
      "avg_rating": 4.1,
      "response_pct": 60
    },
    {
      "marketplace": "yandex_market",
      "total": 500,
      "avg_rating": 4.5,
      "response_pct": 90
    }
  ]
}
```

**Поля `DashboardSummary`:**

| Поле | Тип | Описание |
|------|-----|----------|
| `total_items` | int | Всего обращений за всё время |
| `avg_rating` | float | Средняя оценка (округл. до 1 знака) |
| `avg_response_time_min` | int | Среднее время ответа (минуты) |
| `positive_count` | int | Отзывы с оценкой ≥ 4 |
| `published_count` | int | Опубликовано ответов |
| `marketplaces` | list | По маркетплейсам |

**Поля `MarketplaceSummary`:**

| Поле | Тип | Описание |
|------|-----|----------|
| `marketplace` | string | Название |
| `total` | int | Всего обращений |
| `avg_rating` | float | Средняя оценка |
| `response_pct` | int | Процент отвеченных: `round(answered × 100 / total)` |

---

### `POST /api/v1/stats/recompute`

Пересчёт аналитики за последние N дней.

**Query-параметры:**

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|----------|
| `days` | int | `90` | Количество дней (1–365) |

**Ответ: `RecomputeResponse`**

```json
{
  "recomputed_days": 270,
  "message": "Пересчитано 270 записей за 90 дней"
}
```

---

## 9. Settings (настройки)

### `GET /api/v1/settings`

Все настройки.

**Ответ:** `list[SettingResponse]`

### `GET /api/v1/settings/{key}`

Одна настройка по ключу.

**Ответ: `SettingResponse`**

```json
{
  "key": "auto_check_enabled",
  "value": "true",
  "updated_at": "2026-03-10T12:00:00"
}
```

**Ошибки:** `404` — `Setting '{key}' not found`

### `PUT /api/v1/settings/{key}`

Создать или обновить настройку.

**Тело запроса:**

```json
{
  "value": "true"
}
```

**Ответ:** `SettingResponse`

---

## 10. Автоматические процессы (Scheduler)

Система запускает фоновые задачи по расписанию. Фронту не нужно вызывать их напрямую — это для понимания поведения системы.

### При запуске сервера

| Задача | Описание |
|--------|----------|
| `backfill_analytics` | Пересчёт аналитики за последние **365 дней** по всем маркетплейсам (фоновый поток) |
| `create_missing_tables` | Создание новых таблиц в БД (если не существуют) |

### Периодические задачи

| Задача | Интервал | Описание |
|--------|----------|----------|
| `auto_generate_pending` | Каждые **5 минут** | Берёт до **20** отзывов со статусом `new` (самые старые первыми), классифицирует через AI и генерирует черновик. Статус: `new` → `analyzing` → `pending_review` |
| `retry_failed_publications` | Каждые **1 час** | Находит до **50** отзывов со статусом `error` (кроме Ozon), у которых есть готовый текст, и повторяет публикацию |
| `refresh_today_analytics` | Каждые **30 минут** | Пересчитывает статистику за сегодня и вчера по всем 3 маркетплейсам |

> **Важно для фронта:** отзывы со статусом `new` автоматически переходят в `pending_review` в течение нескольких минут. Не нужно вызывать `/generate` вручную — система сделает это сама. Ручная генерация нужна только если нужно передать свои `instructions`.

---

## 11. Схема БД

### `reputation_products`

Данные о товарах (заполняются из AdolfDataSync).

| Поле | Тип | PK | Описание |
|------|-----|-----|----------|
| `external_id` | BIGINT | ✅ | ID товара на маркетплейсе |
| `marketplace` | VARCHAR | ✅ | `wildberries` / `ozon` / `yandex_market` |
| `vendor_code` | VARCHAR | | Артикул |
| `brand_tag` | VARCHAR | | Бренд |
| `title` | TEXT | | Название |
| `description` | TEXT | | Описание |
| `composition` | TEXT | | Состав |
| `size_measurements` | JSONB | | Размеры |
| `media_urls` | JSONB | | Фото |
| `attributes` | JSONB | | Характеристики |
| `video_url` | TEXT | | Видео |
| `imt_id` | BIGINT | | ID склейки |
| `updated_at` | DATETIME | | Дата обновления |

> **Composite PK:** `(external_id, marketplace)`

---

### `reputation_items`

Отзывы и вопросы.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | INTEGER (PK) | Внутренний ID |
| `wb_id` | VARCHAR(50) | ID на маркетплейсе |
| `item_type` | VARCHAR | `review` / `question` |
| `marketplace` | VARCHAR | Маркетплейс |
| `client_name` | VARCHAR | Имя покупателя |
| `client_text` | TEXT | Текст |
| `rating` | INTEGER | 1–5 (null для вопросов) |
| `status` | VARCHAR | Статус (default: `new`) |
| `product_id` | BIGINT | → `reputation_products.external_id` |
| `pros` | TEXT | Достоинства |
| `cons` | TEXT | Недостатки |
| `photos` | JSONB | Фото покупателя |
| `video` | JSONB | Видео покупателя |
| `wb_created_at` | DATETIME | Дата на маркетплейсе |
| `is_viewed` | BOOLEAN | Просмотрен |
| `created_at` | DATETIME | Дата загрузки в систему |

**Статусы:**

```
new → analyzing → pending_review → approved → publishing → answered
                                                          └→ error (retry)
new → skipped
new → escalated
```

---

### `reputation_responses`

Backward-compatibility слой для AI-вариантов.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | INTEGER (PK) | |
| `item_id` | INTEGER (FK) | → `reputation_items.id` |
| `ai_variants` | JSONB | Массив вариантов |
| `final_text` | TEXT | Одобренный текст |
| `status` | VARCHAR | `draft` / `approved` / `published` / `failed` |
| `manager_notes` | TEXT | Заметки менеджера |
| `approved_by_id` | INTEGER | |
| `generated_at` | DATETIME | |
| `published_at` | DATETIME | |
| `wb_error` | TEXT | Ошибка от маркетплейса |
| `marketplace` | VARCHAR | |

---

### `reputation_generations`

Аудит вызовов AI.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | UUID (PK) | |
| `item_id` | INTEGER (FK) | → `reputation_items.id` |
| `marketplace` | VARCHAR(30) | |
| `product_id` | BIGINT | |
| `context` | JSONB | `{client_text, pros, cons, product_context, instructions, rating, item_type}` |
| `user_id` | UUID | |
| `status` | VARCHAR(20) | `pending` / `processing` / `completed` / `failed` |
| `error_message` | TEXT | |
| `analysis_result` | JSONB | `{sentiment, sentiment_score, tags, category, key_points, scenario}` |
| `created_at` | DATETIME | |
| `completed_at` | DATETIME | |

---

### `reputation_drafts`

Immutable черновики ответов.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | UUID (PK) | |
| `generation_id` | UUID (FK) | → `reputation_generations.id` |
| `item_id` | INTEGER (FK) | → `reputation_items.id` |
| `marketplace` | VARCHAR(30) | |
| `response_text` | TEXT | Текст ответа |
| `classification` | JSONB | Классификация |
| `validation_result` | JSONB | `{is_valid: bool, issues: [str]}` |
| `is_valid` | BOOLEAN | Прошёл валидацию |
| `status` | VARCHAR(20) | `draft` / `approved` / `rejected` |
| `manager_notes` | TEXT | |
| `approved_by` | UUID | |
| `created_at` | DATETIME | |
| `updated_at` | DATETIME | |

---

### `reputation_publications`

Записи публикаций на маркетплейсы.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | UUID (PK) | |
| `draft_id` | UUID (FK) | → `reputation_drafts.id` |
| `item_id` | INTEGER (FK) | → `reputation_items.id` |
| `marketplace` | VARCHAR(30) | |
| `external_id` | VARCHAR | ID на маркетплейсе |
| `published_text` | TEXT | Опубликованный текст |
| `status` | VARCHAR(20) | `success` / `failed` |
| `error_code` | VARCHAR(50) | |
| `error_message` | TEXT | |
| `api_response` | JSONB | Полный ответ API |
| `published_by` | UUID | |
| `published_at` | DATETIME | |
| `source` | VARCHAR(20) | `manual` / `auto` / `scheduler` |

---

### `polling_state`

Состояние поллинга по маркетплейсам.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | INTEGER (PK) | |
| `marketplace` | VARCHAR(30) | |
| `item_type` | VARCHAR(20) | `review` / `question` |
| `last_poll_time` | DATETIME(tz) | |
| `last_poll_status` | VARCHAR(20) | `success` / `error` / `circuit_breaker` |
| `last_poll_error` | TEXT | |
| `items_fetched_total` | INTEGER | Накопительный итог |
| `items_fetched_last` | INTEGER | За последний раз |
| `consecutive_errors` | INTEGER | Ошибки подряд |
| `circuit_breaker_open` | BOOLEAN | |
| `circuit_breaker_until` | DATETIME(tz) | |

> **UNIQUE:** `(marketplace, item_type)`

---

### `reputation_analytics`

Ежедневная агрегация.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | INTEGER (PK) | |
| `date` | DATE | |
| `marketplace` | VARCHAR(30) | |
| `total_items` | INTEGER | |
| `reviews_count` | INTEGER | |
| `questions_count` | INTEGER | |
| `positive_count` | INTEGER | rating ≥ 4 |
| `neutral_count` | INTEGER | rating = 3 |
| `negative_count` | INTEGER | rating ≤ 2 |
| `avg_rating` | NUMERIC(3,2) | |
| `published_count` | INTEGER | |
| `avg_response_time_min` | INTEGER | |
| `calculated_at` | DATETIME(tz) | |

> **UNIQUE:** `(date, marketplace)`

---

### `auto_process_log`

Аудит автоматических операций.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | SERIAL (PK) | |
| `run_id` | VARCHAR(36) | UUID батча |
| `process_type` | VARCHAR(30) | `reputation_generate` / `reputation_auto_generate` / `reputation_publish` |
| `external_id` | BIGINT | product_id |
| `action` | VARCHAR(100) | `generate:success`, `regenerate:success`, `auto_generate:success`, `publish:{marketplace}` |
| `status` | VARCHAR(20) | `success` / `error` |
| `error` | TEXT | |
| `marketplace` | VARCHAR(30) | |
| `generated_title` | TEXT | Текст ответа |
| `generated_description` | TEXT | JSON классификации |
| `generated_seo_tags` | TEXT | Инструкции |
| `created_at` | DATETIME | |

---

### `app_settings`

Key-value хранилище настроек.

| Поле | Тип | Описание |
|------|-----|----------|
| `key` | VARCHAR(100) (PK) | Ключ настройки |
| `value` | TEXT | Значение |
| `updated_at` | DATETIME | |

---

## 12. Пайплайн обработки

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐     ┌──────────┐     ┌───────────┐
│   Polling    │ ──▶ │   new       │ ──▶ │  analyzing   │ ──▶ │ pending_ │ ──▶ │ approved  │
│ (маркетплейс)│     │ (в базе)    │     │ (AI работает)│     │ review   │     │           │
└─────────────┘     └─────────────┘     └──────────────┘     └──────────┘     └─────┬─────┘
                           │                                                         │
                           │ auto_generate_pending                                   │
                           │ (каждые 5 мин, до 20 шт)                               ▼
                           │                                                  ┌───────────┐
                           ▼                                                  │ publishing │
                    ┌─────────────┐                                           └─────┬─────┘
                    │  skipped /  │                                                  │
                    │  escalated  │                                           ┌──────┴──────┐
                    └─────────────┘                                           ▼             ▼
                                                                       ┌──────────┐  ┌─────────┐
                                                                       │ answered │  │  error   │
                                                                       │ (успех)  │  │ (повтор) │
                                                                       └──────────┘  └─────────┘
                                                                                      retry: каждый час
```

**Таблицы, затрагиваемые на каждом этапе:**

| Этап | Таблицы |
|------|---------|
| Polling | `reputation_items` (INSERT), `polling_state` (UPDATE) |
| Generate | `reputation_generations` (INSERT), `reputation_drafts` (INSERT), `reputation_responses` (UPSERT), `auto_process_log` (INSERT), `reputation_items` (UPDATE status) |
| Approve | `reputation_drafts` (UPDATE), `reputation_responses` (UPDATE), `reputation_items` (UPDATE status) |
| Publish | `reputation_publications` (INSERT), `reputation_responses` (UPDATE), `reputation_items` (UPDATE status), `auto_process_log` (INSERT) |

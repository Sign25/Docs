# AdolfReputationBack — API Reference

> **Версия:** 1.2.50
> **Base URL:** `https://your-server.com` (dev: `http://localhost:8000`)
> **Swagger UI:** `{BASE_URL}/docs`

---

## Содержание

1. [Health](#1-health)
2. [Reviews — Чтение](#2-reviews--чтение)
3. [Reviews — Генерация ответов](#3-reviews--генерация-ответов)
4. [Reviews — Модерация](#4-reviews--модерация)
5. [Reviews — Публикация](#5-reviews--публикация)
6. [Reviews — История](#6-reviews--история)
7. [Polling (сбор отзывов)](#7-polling-сбор-отзывов)
8. [Statistics (аналитика)](#8-statistics-аналитика)
9. [Products (рейтинг товаров)](#9-products-рейтинг-товаров)
10. [Settings (настройки)](#10-settings-настройки)
11. [Prompt Management (промт генерации)](#11-prompt-management-промт-генерации)
12. [Автоматические процессы (Scheduler)](#12-автоматические-процессы-scheduler)
13. [Схема БД](#13-схема-бд)
14. [Пайплайн обработки](#14-пайплайн-обработки)
15. [Миграции](#15-миграции)

---

## 1. Health

### `GET /`

Информация о сервисе.

**Ответ:**

```json
{
  "service": "AdolfReputationBack",
  "version": "1.2.50",
  "docs": "/docs"
}
```

### `GET /health`

Проверка соединения с БД.

**Ответ:**

```json
{
  "status": "ok",
  "db": "connected"
}
```

### `GET /worker/status`

Статус worker'а авто-генерации. Проверяет последний запуск по `auto_process_log`.

**Ответ:**

```json
{
  "status": "healthy",
  "last_run": "2026-03-25T12:00:00",
  "age_minutes": 4.2,
  "last_action": "auto_generate:success"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `status` | string | `never_run` / `healthy` / `stale` (stale если > 15 мин) |
| `last_run` | datetime? | ISO-дата последнего запуска (null если не запускался) |
| `age_minutes` | float | Минут с последнего запуска |
| `last_action` | string | Тип последней операции |

---

## 2. Reviews — Чтение

### `GET /api/v1/reviews`

Список отзывов/вопросов с фильтрацией и пагинацией.

**Query-параметры:**

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|----------|
| `marketplace` | string | — | `wildberries`, `ozon`, `yandex_market` |
| `status` | string | — | `new`, `analyzing`, `pending_review`, `approved`, `publishing`, `published`, `answered`, `skipped`, `escalated`, `error`, `manual_required` |
| `item_type` | string | — | `review`, `question` |
| `sort_by` | string | `created_at` | Поле сортировки: `created_at`, `rating`, `wb_created_at` |
| `order` | string | `desc` | Порядок: `asc`, `desc` |
| `rating` | int | — | Фильтр по оценке (1–5) |
| `search` | string | — | Поиск по тексту, имени клиента, плюсам, минусам, артикулу (ILIKE) |
| `date_from` | date | — | Начало периода (`YYYY-MM-DD`), фильтр по `wb_created_at` |
| `date_to` | date | — | Конец периода (`YYYY-MM-DD`), фильтр по `wb_created_at` |
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

---

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
  "vendor_code": "ART-12345",
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
    "marketplace": "wildberries",
    "source": "ai"
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
| `vendor_code` | string? | Артикул продавца |
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
| `final_text` | string? | Одобренный текст |
| `status` | string? | `draft` / `approved` / `published` / `failed` |
| `manager_notes` | string? | Заметки менеджера |
| `generated_at` | datetime? | Дата первой генерации |
| `published_at` | datetime? | Дата публикации |
| `wb_error` | string? | Ошибка от маркетплейса |
| `marketplace` | string? | Маркетплейс |
| `source` | string? | `ai` / `manager` |

---

## 3. Reviews — Генерация ответов

### `POST /api/v1/reviews/{item_id}/generate`

Классификация отзыва + генерация черновика.

**Тело запроса (необязательно):**

```json
{
  "instructions": "Упомяни скидку 20% на следующий заказ"
}
```

**Что происходит:**
1. Статус → `analyzing`
2. Создаётся `ReputationGeneration`
3. Отзыв классифицируется → sentiment, tags, scenario
4. Генерируется ответ (50–700 символов, до 3 попыток с валидацией)
5. Создаётся `ReputationDraft`
6. Статус → `pending_review`

**Правила валидации:**

| Правило | Условие |
|---------|---------|
| Длина | 50–700 символов |
| Запрещённые слова | конкуренты, сторонние сайты |
| Извинение для негатива | При rating ≤ 3 обязательно: «сожалеем» / «извин» / «жаль» |
| Чужой маркетплейс | Нельзя упоминать другие площадки |

**Ответ: `GenerateResponse`**

```json
{
  "item_id": 1,
  "generation_id": "uuid",
  "draft_id": "uuid",
  "draft_text": "Добрый день, Анна! Благодарим за тёплый отзыв...",
  "ai_variants": [...]
}
```

---

### `POST /api/v1/reviews/{item_id}/regenerate`

Генерация нового варианта. **Максимум 5 вариантов на один отзыв.**

**Тело запроса (обязательно):**

```json
{
  "instructions": "Сделай ответ короче"
}
```

**Предусловия:** сначала вызвать `/generate`, количество черновиков < 5.

**Ошибки:** `400` — лимит превышен или нет базового ответа.

---

### `POST /api/v1/reviews/bulk-regenerate`

Массовая перегенерация для всех неопубликованных items.

**Query-параметры:** `item_type`, `marketplace` (необязательны).

**Ответ:**

```json
{
  "updated": 12,
  "errors": 1,
  "total": 13,
  "message": "Перегенерировано 12 из 13"
}
```

---

## 4. Reviews — Модерация

### `POST /api/v1/reviews/{item_id}/approve`

Одобрение последнего черновика.

**Тело запроса (необязательно):**

```json
{
  "final_text": "Мой отредактированный текст"
}
```

**Приоритет текста:** `final_text` из тела → текст черновика → последний вариант `ai_variants`.

**Результат:** черновик, ответ и отзыв → `approved`. **Ответ:** `ItemResponse`.

---

### `POST /api/v1/reviews/bulk-approve`

Массовое одобрение.

**Тело запроса:**

```json
{
  "item_ids": [1, 2, 3]
}
```

**Ответ:**

```json
{
  "approved_count": 3,
  "item_ids": [1, 2, 3]
}
```

---

### `POST /api/v1/reviews/{item_id}/skip`

Пропустить отзыв. Статус → `skipped`. **Ответ:** `ItemResponse`.

### `POST /api/v1/reviews/{item_id}/escalate`

Эскалация. Статус → `escalated`. **Ответ:** `ItemResponse`.

---

## 5. Reviews — Публикация

### `POST /api/v1/reviews/{item_id}/publish`

Отправка одобренного ответа на маркетплейс.

**Предусловия:** `response.status` — `approved` или `failed`.

**Маркетплейсы и API:**

| Маркетплейс | Отзывы | Вопросы |
|-------------|--------|---------|
| **Wildberries** | `POST /api/v1/feedbacks/answer` | `PATCH /api/v1/questions` |
| **Яндекс Маркет** | `POST /v2/businesses/{id}/goods-feedback/comments` | `POST /v1/businesses/{id}/goods-questions/answers` |
| **Ozon** | `POST /v1/review/comment/create` | `POST /v1/question/answer/create` |

**Ответ: `PublishResponse`**

```json
{
  "item_id": 1,
  "publication_id": "uuid",
  "status": "published",
  "error": null
}
```

| `status` | Описание |
|----------|----------|
| `published` | Успешно, отзыв → `answered` |
| `failed` | Ошибка, отзыв → `error` (автоповтор раз в час) |

---

## 6. Reviews — История

### `GET /api/v1/reviews/{item_id}/history`

Полная история: генерации, черновики, публикации.

**Ответ:**

```json
{
  "item_id": 1,
  "generations": [
    {
      "id": "uuid",
      "status": "completed",
      "analysis_result": { "sentiment": "positive", "scenario": "five_stars" },
      "created_at": "2026-03-10T13:05:30",
      "completed_at": "2026-03-10T13:05:35"
    }
  ],
  "drafts": [
    {
      "id": "uuid",
      "generation_id": "uuid",
      "response_text": "Добрый день, Анна!...",
      "is_valid": true,
      "status": "approved",
      "created_at": "2026-03-10T13:05:36"
    }
  ],
  "publications": [
    {
      "id": "uuid",
      "draft_id": "uuid",
      "published_text": "Добрый день, Анна!...",
      "status": "success",
      "published_at": "2026-03-10T14:00:00"
    }
  ]
}
```

---

## 7. Polling (сбор отзывов)

### `POST /api/v1/polling/{marketplace}/trigger`

Ручной запуск сбора. `marketplace`: `wildberries`, `ozon`, `yandex_market`.

**Query:** `item_type` (`review` / `question`). Если не указан — оба типа.

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

**Особенности:** дедупликация по `(marketplace, wb_id)`. Circuit breaker: 5 ошибок → пауза 60 сек.

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
      "items_fetched_total": 1500,
      "consecutive_errors": 0,
      "circuit_breaker_open": false
    }
  ]
}
```

---

## 8. Statistics (аналитика)

### `GET /api/v1/stats`

Ежедневная статистика + счётчики неотвеченных + агрегированная сводка.

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `date_from` | date | `YYYY-MM-DD`, фильтр по `created_at` |
| `date_to` | date | `YYYY-MM-DD`, фильтр по `created_at` |
| `marketplace` | string | `wildberries` / `ozon` / `yandex_market` |

**Ответ: `StatsResponse`**

```json
{
  "stats": [StatsItem],
  "total": 30,
  "counters": {
    "total_unanswered": 42,
    "by_marketplace": [
      {
        "marketplace": "wildberries",
        "new_reviews": 12,
        "new_questions": 5,
        "pending_review": 8
      }
    ]
  },
  "summary": { ... }
}
```

**Поля `StatsItem`:**

| Поле | Тип | Описание |
|------|-----|----------|
| `date` | date | Дата |
| `marketplace` | string | Маркетплейс |
| `total_items` | int | Всего отзывов + вопросов |
| `reviews_count` | int | Только отзывы |
| `questions_count` | int | Только вопросы |
| `positive_count` | int | rating ≥ 4 |
| `neutral_count` | int | rating = 3 |
| `negative_count` | int | rating ≤ 2 |
| `avg_rating` | float? | Средняя оценка |
| `published_count` | int | Опубликовано (всего) |
| `our_published_count` | int | Опубликовано нами |
| `seller_published_count` | int | Опубликовано продавцом |
| `our_avg_response_time_min` | int? | Среднее время ответа — наши |

---

### `GET /api/v1/stats/summary`

Агрегированные метрики для дашборда.

**Query:** `marketplace` (необязательно).

**Ответ: `DashboardSummary`**

```json
{
  "total_items": 5000,
  "avg_rating": 4.3,
  "positive_count": 3500,
  "published_count": 4200,
  "our_published_count": 3000,
  "our_avg_response_time_min": 30,
  "marketplaces": [
    {
      "marketplace": "wildberries",
      "total": 3000,
      "avg_rating": 4.5,
      "response_pct": 85,
      "our_response_pct": 60
    }
  ]
}
```

---

### `POST /api/v1/stats/recompute`

Пересчёт аналитики за последние N дней.

**Query:** `days` (int, по умолчанию `90`, максимум `365`).

**Ответ:**

```json
{
  "recomputed_days": 270,
  "message": "Пересчитано 270 записей за 90 дней"
}
```

---

## 9. Products (рейтинг товаров)

### `GET /api/v1/products`

Листинг всех товаров с агрегированным рейтингом и распределением по звёздам. Показывает и товары **без отзывов** (LEFT JOIN → `avg_rating=null`, `total_reviews=0`, `last_review_at=null`) — именно они обычно и есть кандидаты «куда писать отзывы первыми».

**Query-параметры:**

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|----------|
| `marketplace` | string | — | `wildberries` / `ozon` / `yandex_market` |
| `category` | string | — | Точный фильтр по категории товара |
| `search` | string | — | ILIKE по `title`, `vendor_code`, внутреннему артикулу (`sku_mappings.internal_article`) и SKU маркетплейса (`external_id`) |
| `date_from` | date | — | Учитывать отзывы с этой даты (включительно). Фильтр применяется к **отзывам, формирующим метрики**; товары без отзывов за период остаются в списке с нулями |
| `date_to` | date | — | Учитывать отзывы до этой даты (включительно) |
| `sort_by` | string | `total_reviews` | `avg_rating`, `total_reviews`, `title`, `last_review_at` |
| `order` | string | `desc` | `asc` / `desc`. Для пустых значений используется NULLS LAST — товары без отзывов всегда в конце списка |
| `page` | int | `1` | ≥ 1 |
| `page_size` | int | `20` | 1–100 |

**Ответ: `ProductListResponse`**

```json
{
  "items": [
    {
      "product_id": 293797327,
      "marketplace": "wildberries",
      "title": "Платье с коротким рукавом",
      "first_photo": "https://basket-18.wbbasket.ru/vol2937/part293797/293797327/images/big/1.webp",
      "vendor_code": "91002",
      "internal_article": "91002",
      "category": "платья",
      "avg_rating": 4.62,
      "total_reviews": 3114,
      "stars": {
        "star_1": 139,
        "star_2": 57,
        "star_3": 117,
        "star_4": 209,
        "star_5": 2592
      },
      "last_review_at": "2026-04-14T06:36:30"
    }
  ],
  "total": 855,
  "page": 1,
  "page_size": 20
}
```

**Поля `ProductListItem`:**

| Поле | Тип | Описание |
|------|-----|----------|
| `product_id` | int | `external_id` — SKU товара на маркетплейсе |
| `marketplace` | string | `wildberries` / `ozon` / `yandex_market` |
| `title` | string? | Название товара |
| `first_photo` | string? | URL первого фото (`media_urls[0]`) |
| `vendor_code` | string? | Артикул из справочника маркетплейса |
| `internal_article` | string? | Внутренний артикул из `sku_mappings`; fallback — `vendor_code` |
| `category` | string? | Категория товара |
| `avg_rating` | float? | Средняя оценка (округление до 2 знаков); `null` если отзывов за период нет |
| `total_reviews` | int | Количество отзывов за период (или всего, если даты не заданы) |
| `stars` | StarDistribution | Распределение по звёздам 1–5 |
| `last_review_at` | datetime? | Дата последнего отзыва (в рамках периода) |

**`StarDistribution`:**

| Поле | Тип |
|------|-----|
| `star_1` | int |
| `star_2` | int |
| `star_3` | int |
| `star_4` | int |
| `star_5` | int |

**Типовые сценарии использования:**

| Цель | Запрос |
|------|--------|
| Какие товары «хромают» | `?sort_by=avg_rating&order=asc` — самые низкие рейтинги сверху |
| Где не хватает отзывов | `?sort_by=total_reviews&order=asc` — товары с нулём/мало отзывов сверху |
| Рейтинг за последние 30 дней | `?date_from=2026-03-16&date_to=2026-04-15&sort_by=avg_rating&order=asc` |
| Свежие отзывы | `?sort_by=last_review_at&order=desc` |
| Поиск товара | `?search=<артикул или SKU>` |

---

### `GET /api/v1/products/stats` *(legacy)*

Исторический эндпоинт — возвращает `ProductStatsResponse` с подмножеством полей (без `first_photo`, `internal_article`, `last_review_at`) и только товары, у которых есть хотя бы один отзыв (INNER JOIN). Для нового кода использовать `GET /api/v1/products`.

---

## 10. Settings (настройки)

### `GET /api/v1/settings`

Все настройки. **Ответ:** `list[SettingResponse]`.

### `GET /api/v1/settings/{key}`

Одна настройка. **Ответ:**

```json
{
  "key": "auto_generate_enabled",
  "value": "true",
  "updated_at": "2026-03-10T12:00:00"
}
```

**Ошибки:** `404` — ключ не найден.

### `PUT /api/v1/settings/{key}`

Создать или обновить. **Тело:** `{"value": "true"}`. **Ответ:** `SettingResponse`.

---

## 11. Prompt Management (промт генерации)

Менеджер может просматривать и редактировать системный промт AI-генерации без деплоя. Дефолтное значение захардкожено в `ai_prompts.py`; кастомное хранится в `app_settings` и имеет приоритет.

Менеджер пишет свободный текст (тон, правила, стиль) — данные по отзыву и товару код всегда добавляет сам.

### `GET /api/v1/prompts`

Получить текущий промт.

**Ответ:**

```json
{
  "current_value": "Ты вежливый менеджер...",
  "default_value": "Ты представитель бренда...",
  "is_customized": true,
  "updated_at": "2026-03-30T12:00:00"
}
```

| Поле | Описание |
|------|----------|
| `current_value` | Что реально используется при генерации |
| `default_value` | Дефолт из кода — для кнопки «Посмотреть оригинал» |
| `is_customized` | Менеджер изменял промт — для бейджа «изменён» и кнопки «Сбросить» |
| `updated_at` | Дата последнего изменения, `null` если не менял |

---

### `PUT /api/v1/prompts`

Сохранить кастомный промт.

**Тело:** `{"value": "Новый текст..."}`. Пустая строка → `400`.

**Ответ:** тот же объект с `is_customized: true`.

---

### `DELETE /api/v1/prompts`

Сбросить к дефолту (удаляет запись из `app_settings`).

**Ответ:** тот же объект с `is_customized: false`, `current_value == default_value`, `updated_at: null`.

---

## 12. Автоматические процессы (Scheduler)

Scheduler активен с v1.2.50. Запускается при старте сервера. Backfill убран из автозапуска — для исторических данных: `POST /stats/recompute`.

### Периодические задачи

| Задача | Интервал | Описание |
|--------|----------|----------|
| `auto_generate_pending` | Каждые 5 минут | Берёт до 5 отзывов со статусом `new`, классифицирует и генерирует черновик. Управляется настройкой `auto_generate_enabled` в `app_settings` |
| `retry_failed_publications` | Каждый час | Повторяет публикацию для отзывов со статусом `error` (до 50 шт.) |
| `refresh_today_analytics` | Каждые 30 минут | Пересчитывает статистику за сегодня и вчера |

> Управление авто-генерацией: `PUT /api/v1/settings/auto_generate_enabled` со значением `"true"` / `"false"`.

---

## 13. Схема БД

### `reputation_products`
Данные о товарах (заполняются из AdolfDataSync).

| Поле | Тип | Описание |
|------|-----|----------|
| `external_id` | BIGINT (PK) | ID товара на маркетплейсе |
| `marketplace` | VARCHAR (PK) | `wildberries` / `ozon` / `yandex_market` |
| `vendor_code` | VARCHAR | Артикул |
| `title` | TEXT | Название |
| `description` | TEXT | Описание |
| `composition` | TEXT | Состав |
| `size_measurements` | JSONB | Размеры |
| `media_urls` | JSONB | Фото |
| `attributes` | JSONB | Характеристики |

> Composite PK: `(external_id, marketplace)`

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
| `wb_created_at` | DATETIME | Дата создания на маркетплейсе |
| `created_at` | DATETIME | Дата загрузки в систему |
| `is_viewed` | BOOLEAN | Просмотрен |

**Статусы:**

```
new → analyzing → pending_review → approved → publishing → answered
                                                          └→ error (retry)
new → skipped
new → escalated
```

---

### `reputation_responses`
Backward-compatibility слой.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | INTEGER (PK) | |
| `item_id` | INTEGER (FK) | → `reputation_items.id` |
| `ai_variants` | JSONB | Массив вариантов |
| `final_text` | TEXT | Одобренный текст |
| `status` | VARCHAR | `draft` / `approved` / `published` / `failed` |
| `manager_notes` | TEXT | |
| `generated_at` | DATETIME | |
| `published_at` | DATETIME | |
| `wb_error` | TEXT | Ошибка от маркетплейса |
| `source` | VARCHAR(20) | `ai` / `manager` |

---

### `reputation_generations`
Аудит вызовов генерации.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | UUID (PK) | |
| `item_id` | INTEGER (FK) | → `reputation_items.id` |
| `status` | VARCHAR(20) | `pending` / `processing` / `completed` / `failed` |
| `context` | JSONB | `{client_text, pros, cons, product_context, instructions, rating, item_type}` |
| `analysis_result` | JSONB | `{sentiment, sentiment_score, tags, category, key_points, scenario}` |
| `error_message` | TEXT | |
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
| `response_text` | TEXT | Текст ответа |
| `classification` | JSONB | Классификация |
| `is_valid` | BOOLEAN | Прошёл валидацию |
| `status` | VARCHAR(20) | `draft` / `approved` / `rejected` |
| `manager_notes` | TEXT | |
| `created_at` | DATETIME | |

---

### `reputation_publications`
Записи публикаций.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | UUID (PK) | |
| `draft_id` | UUID (FK) | → `reputation_drafts.id` |
| `item_id` | INTEGER (FK) | → `reputation_items.id` |
| `published_text` | TEXT | Опубликованный текст |
| `status` | VARCHAR(20) | `success` / `failed` |
| `error_message` | TEXT | |
| `api_response` | JSONB | Полный ответ API маркетплейса |
| `published_at` | DATETIME | |
| `source` | VARCHAR(20) | `manual` / `auto` / `scheduler` |

---

### `polling_state`
Состояние поллинга.

| Поле | Тип | Описание |
|------|-----|----------|
| `marketplace` | VARCHAR(30) | |
| `item_type` | VARCHAR(20) | `review` / `question` |
| `last_poll_time` | DATETIME(tz) | |
| `last_poll_status` | VARCHAR(20) | `success` / `error` / `circuit_breaker` |
| `items_fetched_total` | INTEGER | Накопительный итог |
| `consecutive_errors` | INTEGER | Ошибки подряд |
| `circuit_breaker_open` | BOOLEAN | |

> UNIQUE: `(marketplace, item_type)`

---

### `reputation_analytics`
Ежедневная агрегация.

| Поле | Тип | Описание |
|------|-----|----------|
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
| `our_published_count` | INTEGER | |
| `our_avg_response_time_min` | INTEGER | |

> UNIQUE: `(date, marketplace)`

---

### `app_settings`
Key-value хранилище настроек и промтов.

| Поле | Тип | Описание |
|------|-----|----------|
| `key` | VARCHAR(100) (PK) | Ключ |
| `value` | TEXT | Значение |
| `updated_at` | DATETIME | |

**Используемые ключи:**

| Ключ | Описание |
|------|----------|
| `auto_generate_enabled` | `"true"` / `"false"` — управление авто-генерацией |
| `generation_system_prompt` | Кастомный системный промт (если задан менеджером) |

---

## 14. Пайплайн обработки

```
Polling → new → analyzing → pending_review → approved → publishing → answered
                                                                   └→ error (retry hourly)
               → skipped
               → escalated
```

**Таблицы по этапам:**

| Этап | Таблицы |
|------|---------|
| Polling | `reputation_items` (INSERT), `polling_state` (UPDATE) |
| Generate | `reputation_generations`, `reputation_drafts`, `reputation_responses`, `auto_process_log`, `reputation_items` |
| Approve | `reputation_drafts`, `reputation_responses`, `reputation_items` |
| Publish | `reputation_publications`, `reputation_responses`, `reputation_items`, `auto_process_log` |

---

## 15. Миграции

| Файл | Описание |
|------|----------|
| `add_response_source.sql` | Добавляет колонку `source` (VARCHAR(20), default `'manager'`) в `reputation_responses`. Backfill: `source='ai'` для ответов с непустым `ai_variants` |

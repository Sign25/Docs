# AdolfReputationBack — API Reference

> **Версия:** 1.2.62
> **Base URL:** `https://your-server.com` (dev: `http://localhost:8000`)
> **Swagger UI:** `{BASE_URL}/docs`

> **Часовой пояс:** все поля типа `datetime` в JSON-ответах API сериализуются как **naive datetime в часовом поясе Омска (UTC+6)** — в БД хранится UTC, сдвиг на +6 часов выполняется автоматически на сериализации (см. `app/utils/tz.py`). Фронту не нужно дополнительно конвертировать. Поля типа `date` не сдвигаются. Фильтры `date_from`/`date_to` принимаются как есть (без сдвига).

---

## Содержание

1. [Health](#1-health)
2. [Reviews — Чтение](#2-reviews--чтение)
3. [Reviews — Генерация ответов](#3-reviews--генерация-ответов)
4. [Reviews — Модерация](#4-reviews--модерация)
5. [Reviews — Публикация](#5-reviews--публикация)
6. [Reviews — История](#6-reviews--история)
7. [AI Auto-Responses (история ответов AI)](#7-ai-auto-responses-история-ответов-ai)
8. [Negative Reviews (негативные + Excel-экспорт)](#8-negative-reviews-негативные--excel-экспорт)
9. [Polling (сбор отзывов)](#9-polling-сбор-отзывов)
10. [Subscriptions (зонд подписки WB Джем)](#10-subscriptions-зонд-подписки-wb-джем)
11. [Statistics (аналитика)](#11-statistics-аналитика)
12. [Products (рейтинг товаров)](#12-products-рейтинг-товаров)
13. [Settings (настройки)](#13-settings-настройки)
14. [Prompt Management (промт генерации)](#14-prompt-management-промт-генерации)
15. [Автоматические процессы (Scheduler)](#15-автоматические-процессы-scheduler)
16. [Auto-Respond (авто-ответ на 5★)](#16-auto-respond-авто-ответ-на-5)
17. [Схема БД](#17-схема-бд)
18. [Пайплайн обработки](#18-пайплайн-обработки)
19. [Миграции](#19-миграции)

---

## 1. Health

### `GET /`

Информация о сервисе.

**Ответ:**

```json
{
  "service": "AdolfReputationBack",
  "version": "1.2.59",
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
| `status` | string | — | `new`, `analyzing`, `pending_review`, `approved`, `publishing`, `published`, `answered`, `sent`, `skipped`, `escalated`, `error`, `manual_required` |
| `item_type` | string | — | `review`, `question` |
| `sort_by` | string | `created_at` | Поле сортировки: `created_at`, `rating` |
| `order` | string | `desc` | Порядок: `asc`, `desc` |
| `rating` | int | — | Фильтр по оценке (1–5) |
| `search` | string | — | Поиск по тексту, имени клиента, плюсам, минусам, артикулу (ILIKE) |
| `date_from` | date | — | Начало периода (`YYYY-MM-DD`), фильтр по `created_at` (дата загрузки в систему) |
| `date_to` | date | — | Конец периода (`YYYY-MM-DD`), фильтр по `created_at` |
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
| **Яндекс Маркет** | `POST /v2/businesses/{id}/goods-feedback/comments/update` | `POST /v1/businesses/{id}/goods-questions/update` |
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
| `published` | Успешно, отзыв → `answered` (или → `sent` для немых 5★ — см. ниже) |
| `failed` | Ошибка, отзыв → `error` (автоповтор раз в час) |

**Статус `sent` («Отправлено») для немых 5★ отзывов.** Если отзыв — `review` с `rating=5` и **пустыми** `client_text`, `pros` и `cons`, то после успешной публикации он получает статус `sent` вместо `answered`. Маркетплейс не показывает наш ответ на такой отзыв публично — его видит только сам покупатель в своём ЛК (отвечаем для повышения лояльности). Логика едина для обоих путей ответа: ручной `POST /reviews/{item_id}/publish` и авто-публикация 5★ (раздел 16). Любое непустое поле (`client_text`/`pros`/`cons`) или `rating≠5` → обычный `answered`. Вопросы всегда → `answered`. В аналитике (`/stats`) `sent` учитывается как отвеченный наравне с `answered`/`published`.

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

## 7. AI Auto-Responses (история ответов AI)

> ⚠️ **Для вкладки «Ответы AI»** фронт должен вызывать **`GET /api/v1/reviews/ai-responses`**, а **не** `GET /api/v1/reviews?status=answered`. Старый эндпоинт возвращает все отвеченные отзывы вперемешку (и от AI, и от менеджера) без дедупа. Новый отдаёт **только AI-публикации** (`source='ai'`), с дедупом по `item_id` (одна строка = один отзыв, самая свежая попытка) и дополнительными полями `retry_count` и `error_message`.

История авто-публикаций AI на маркетплейсы. Отдельная страница в UI («Ответы AI») — там видно, что AI наотвечал, какие попытки упали и почему. Manager-публикации в эту выдачу не попадают.

### `GET /api/v1/reviews/ai-responses`

**Источник данных:** `reputation_publications WHERE source='ai' AND status IN ('success','failed')`. На каждый отзыв возвращается **одна строка** — самая последняя попытка публикации (`DISTINCT ON (item_id) ORDER BY published_at DESC`). Включает и успешные, и неудачные попытки (для `failed` — с `error_message`).

**Что попадает / что нет:**

| | Попадает в выдачу? |
|---|---|
| 5★ авто-ответ WB/YM (полный цикл `generate→approve→publish`) | ✅ `status=success` |
| 5★ авто-ретрай: упало, не получилось | ✅ `status=failed` + `error_message` |
| 5★ авто-ретрай: успешно повторили | ✅ `status=success` (заменит прежний `failed` по дедупу), `retry_count` = всего попыток |
| Перманентная ошибка (404/401/403) | ✅ последний `failed` остаётся в выдаче (ретрая больше не будет) |
| Cap retry исчерпан (5 попыток) | ✅ последний `failed` остаётся в выдаче |
| Черновик AI создан, но не опубликован (`item.status=pending_review`) | ❌ нет записи в `reputation_publications` |
| Ручной ответ менеджера через UI | ❌ `source='manual'` — отсекается фильтром |
| Авто-ответ на вопрос | ❌ AI на вопросы не отвечает автоматически |
| 5★ Ozon | ❌ Ozon исключён из авто-публикации |

**Query-параметры:**

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `marketplace` | string | — | `wildberries` / `ozon` / `yandex_market`. Технически Ozon принимается, но в авто-ответе не участвует — выдача по нему обычно пуста |
| `date_from` | date | — | Фильтр по `published_at` (включительно) |
| `date_to` | date | — | Фильтр по `published_at` (включительно) |
| `search` | string | — | ILIKE по `client_text`, SKU маркетплейса (`wb_id`), `internal_article` (из `sku_mappings`), `vendor_code` |
| `sort_by` | string | `published_at` | `published_at` или `rating` |
| `order` | string | `desc` | `asc` / `desc` (NULLS LAST) |
| `page` | int | `1` | ≥ 1 |
| `page_size` | int | `20` | 1–100 |

**Ответ: `AIResponsesListResponse`**

```json
{
  "items": [
    {
      "id": 12345,
      "marketplace": "wildberries",
      "marketplace_sku": "feedback_abc123",
      "internal_article": "91002",
      "client_text": "Очень понравилось платье, спасибо!",
      "rating": 5,
      "pros": "Качественная ткань",
      "cons": null,
      "wb_created_at": "2026-05-20T13:42:11",
      "ai_response_text": "Анна, благодарим вас за тёплый отзыв! ...",
      "published_at": "2026-05-20T14:03:22",
      "status": "success",
      "error_message": null,
      "retry_count": 1
    },
    {
      "id": 12346,
      "marketplace": "yandex_market",
      "marketplace_sku": "feedback_xyz999",
      "internal_article": "91008",
      "client_text": "Спасибо!",
      "rating": 5,
      "pros": null,
      "cons": null,
      "wb_created_at": "2026-05-20T11:15:00",
      "ai_response_text": "Благодарим вас за отзыв! ...",
      "published_at": "2026-05-20T11:20:14",
      "status": "failed",
      "error_message": "503 Service Unavailable",
      "retry_count": 3
    }
  ],
  "total": 412,
  "page": 1,
  "page_size": 20
}
```

**Поля `AIResponseItem`:**

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | int | Внутренний ID отзыва (`reputation_items.id`) |
| `marketplace` | string | `wildberries` / `ozon` / `yandex_market` |
| `marketplace_sku` | string | `wb_id` — идентификатор отзыва на маркетплейсе |
| `internal_article` | string? | `sku_mappings.internal_article`; fallback — `vendor_code` |
| `client_text` | string? | Текст отзыва |
| `rating` | int? | Оценка (1–5) |
| `pros` | string? | Достоинства |
| `cons` | string? | Недостатки |
| `wb_created_at` | datetime? | Дата отзыва на маркетплейсе (+6h Омск) |
| `ai_response_text` | string? | Опубликованный AI-ответ (`reputation_publications.published_text`) |
| `published_at` | datetime? | Когда отправили на маркетплейс (+6h Омск) |
| `status` | string | `"success"` или `"failed"` |
| `error_message` | string? | Сообщение об ошибке (только для `failed`) |
| `retry_count` | int | Всего попыток AI-публикации для этого отзыва (включая текущую). Помогает понять «один раз с первого раза» vs «нужно несколько ретраев» |

**Особенности:**

- Запись появляется **в момент попытки публикации**, не в момент генерации черновика. То есть лаг от появления 5★ отзыва на МП до строки в этой выдаче — до 3 минут (тик scheduler-а, см. раздел 15).
- Все datetime отдаются как naive в часовом поясе Омска (UTC+6), фронту дополнительно конвертировать не нужно.
- Дедуп строгий: если по одному отзыву было 3 `failed` подряд — в выдаче ты увидишь **только последний** `failed` с `retry_count=3`. Если потом ретрай сработал — увидишь `success` с `retry_count=4`. Старые `failed` остаются в БД, но в эту выдачу не дублируются.

**Связанные эндпоинты:**

- `GET /api/v1/auto-respond/five-stars` — состояние тогглов авто-ответа на 5★ по каждому МП (см. раздел 16).
- `PUT /api/v1/auto-respond/five-stars/{marketplace}` — включить/выключить.
- `GET /api/v1/reviews/{item_id}/history` — полная история конкретного отзыва: все генерации, черновики и попытки публикации (без дедупа).

---

## 8. Negative Reviews (негативные + Excel-экспорт)

Отдельная страница на фронте: листинг отзывов с `rating ≤ 3` (1–3 звезды) и кнопка выгрузки текущей выборки в Excel. Статус ответа отображается единым бинарным флагом `answered` / `not_answered`.

> **Записи с пустым `wb_created_at` в выдачу не попадают** (`WHERE wb_created_at IS NOT NULL`). Это намеренный фильтр — дата на маркетплейсе должна быть. Для отзывов, у которых маркетплейс не вернул дату создания (бывает у Ozon), используйте обычный `/reviews`.

### `GET /api/v1/reviews/negative`

Листинг негативных отзывов.

**Query-параметры:**

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|----------|
| `marketplace` | string | — | `wildberries` / `ozon` / `yandex_market` |
| `answer_status` | string | — | `answered` / `not_answered` — фильтр по факту ответа |
| `date_from` | date | — | `YYYY-MM-DD`, фильтр по `wb_created_at` (включительно) |
| `date_to` | date | — | `YYYY-MM-DD`, фильтр по `wb_created_at` (включительно) |
| `search` | string | — | ILIKE по тексту отзыва, SKU маркетплейса, внутреннему артикулу, `vendor_code` |
| `sort_by` | string | `wb_created_at` | `wb_created_at` / `rating` |
| `order` | string | `desc` | `asc` / `desc` (NULLS LAST) |
| `page` | int | `1` | ≥ 1 |
| `page_size` | int | `20` | 1–100 |

**Ответ: `NegativeReviewsListResponse`**

```json
{
  "items": [
    {
      "id": 1024,
      "marketplace_sku": "12345678",
      "internal_article": "ART-91002",
      "marketplace": "wildberries",
      "client_text": "Размер не соответствует. Села после первой стирки.",
      "rating": 2,
      "wb_created_at": "2026-05-12T18:30:00",
      "answer_status": "not_answered"
    }
  ],
  "total": 142,
  "page": 1,
  "page_size": 20
}
```

**Поля `NegativeReviewItem`:**

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | int | Внутренний ID отзыва (для перехода в детали через `/reviews/{id}`) |
| `marketplace_sku` | string | `wb_id` — ID отзыва на маркетплейсе |
| `internal_article` | string? | Внутренний артикул из `sku_mappings`, fallback — `reputation_products.vendor_code` |
| `marketplace` | string | `wildberries` / `ozon` / `yandex_market` |
| `client_text` | string? | Текст отзыва |
| `rating` | int | 1–3 |
| `wb_created_at` | datetime? | Дата создания отзыва на маркетплейсе (Омск, +6h) |
| `answer_status` | string | `"answered"` / `"not_answered"` |

**Логика `answer_status`:** `answered` = в БД есть `ReputationPublication.status='success'` для этого `item_id` ИЛИ legacy `ReputationResponse.status='published'`. Иначе `not_answered`. Реализовано через коррелированные `EXISTS` — без дублей в выборке.

---

### `GET /api/v1/reviews/negative/export`

Выгрузка всех отзывов под текущие фильтры в формате Excel (.xlsx).

**Query-параметры:** **те же**, что у `GET /reviews/negative`, **кроме** `page` и `page_size` — экспорт всегда возвращает полную выборку под фильтры.

**Лимит:** `MAX_EXPORT_ROWS = 50_000` строк. При превышении — `400`:

```json
{ "detail": "Слишком много строк для экспорта (123456 > 50000). Сузьте фильтры." }
```

**Ответ:** `200 OK`, `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `Content-Disposition: attachment; filename="negative_reviews_YYYYMMDD_HHMM.xlsx"`.

**Колонки файла (в порядке вывода):**

| Колонка | Источник | Формат |
|---------|----------|--------|
| SKU маркетплейса | `marketplace_sku` | строка |
| Внутренний артикул | `internal_article` | строка (пусто, если нет маппинга) |
| Маркетплейс | `marketplace` | human-readable: `Wildberries` / `Ozon` / `Yandex Market` |
| Текст отзыва | `client_text` | строка с переносом строк |
| Звёзды | `rating` | целое 1–3 |
| Дата отзыва | `wb_created_at` | `DD.MM.YYYY HH:MM` (Омск, +6h) |
| Статус ответа | `answer_status` | `Отвечен` / `Не отвечен` |

Заголовки таблицы зафиксированы (freeze pane), ширины колонок настроены, перенос текста в колонке "Текст отзыва".

**Поведение пагинации:** на экране — обычная постраничная навигация (`page` / `page_size`). При нажатии "Выгрузить в Excel" фронт передаёт **те же** фильтры (`marketplace`, `answer_status`, `date_from`, `date_to`, `search`, `sort_by`, `order`), но **без** `page`/`page_size`. В файл попадают все строки под фильтры. Без фильтров — весь список негативных отзывов (до лимита).

---

## 9. Polling (сбор отзывов)

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

### `POST /api/v1/polling/ratings/refresh`

Ручной запуск обновления **официальных рейтингов товаров** из API маркетплейсов (поля `mp_rating`, `mp_rating_count`, `mp_rating_updated_at` в `reputation_products`). Эта же задача автоматически запускается scheduler-ом ежедневно в 03:00 UTC (см. раздел 15).

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `marketplace` | string | `wildberries` / `ozon` / `yandex_market` — обновить только один МП. Если не указан — обновляются все |

**Источники:**

| Маркетплейс | Источник `mp_rating` |
|-------------|-----------------------|
| **Wildberries** | Публичный `card.wb.ru/cards/v2/detail` (без авторизации) — поля `reviewRating`, `feedbacks`. Неофициальный путь, fallback — расчётный `avg_rating` |
| **Ozon** | `POST /v1/product/rating-by-sku` (требует Premium Plus). При отсутствии подписки/доступа — graceful fallback на `avg_rating` |
| **Yandex Market** | Без реализации — публичного источника нет, `mp_rating` остаётся `NULL` |

**Ответ:** `200 OK` со сводкой обновлённых товаров (точная схема — см. Swagger). Используется как прогрев перед демо или для ручной отладки.

---

## 10. Subscriptions (зонд подписки WB Джем)

Best-effort проверка подписки **WB Джем** — у Wildberries нет публичного API «есть ли Джем», поэтому зондируем feature-gated эндпоинт аналитики поисковых запросов (`POST /api/v2/search-report/report`) и классифицируем ответ.

### `GET /api/v1/subscriptions/wb/jem`

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `probe_url` | string | Переопределить URL зонда (по умолчанию `https://seller-analytics-api.wildberries.ru/api/v2/search-report/report`). Также можно зашить в `app_settings.wb_jem_probe_url` |

**Ответ:**

```json
{
  "status": "active",
  "http_status": 200,
  "probe_url": "https://seller-analytics-api.wildberries.ru/api/v2/search-report/report",
  "message": null,
  "body_snippet": "{\"data\":{\"items\":[...]}}"
}
```

**Классификатор `status`:**

| `status` | HTTP | Смысл |
|----------|------|-------|
| `active` | 2xx | Подписка активна — эндпоинт вернул данные |
| `inactive` | 403 | Подписка не оплачена / отозвана |
| `auth_error` | 401 | Невалидный или отсутствует WB-токен |
| `endpoint_missing` | 404 | WB поменяли путь — нужно поднять `probe_url` |
| `unknown` | 429 / прочее / сетевая ошибка | Не классифицируется однозначно — смотри `body_snippet` (первые 500 символов) |

**Особенности:**
- Эндпоинт всегда отвечает `200 OK` со стороны нашего API. Сетевая ошибка → `status="unknown"`, без `5xx` наружу.
- Минимальное валидное тело зонда: `currentPeriod` за последние 7 дней, `positionCluster="all"`, `orderBy={avgPosition, asc}`, `includeSubstitutedSKUs=true`, `includeSearchTexts=true`, `limit=1`.
- Если WB поменяет схему body, классификатор может выдать `unknown` — анализируй `body_snippet` глазами и при необходимости задай свой `probe_url`.

---

## 11. Statistics (аналитика)

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

## 12. Products (рейтинг товаров)

### `GET /api/v1/products`

Листинг всех товаров с рейтингом и распределением по звёздам. Показывает и товары **без отзывов** (LEFT JOIN → `avg_rating=null`, `total_reviews=0`, `last_review_at=null`) — именно они обычно и есть кандидаты «куда писать отзывы первыми».

**Источник рейтинга:** основное отображаемое значение — `rating = COALESCE(mp_rating, avg_rating)`. `mp_rating` — официальная оценка с маркетплейса (с точностью до сотых, совпадает с ЛК), `avg_rating` — наша агрегация по отзывам в БД. Поле `rating_source` указывает источник:

| `rating_source` | Значение |
|-----------------|----------|
| `"marketplace"` | Используется `mp_rating` — официальный рейтинг |
| `"computed"` | `mp_rating` отсутствует, используется наш `avg_rating` |

`mp_rating` подтягивается ежедневной задачей scheduler-а (см. раздел 15, `refresh_mp_ratings`). Ручной прогрев — `POST /api/v1/polling/ratings/refresh`.

**Query-параметры:**

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|----------|
| `marketplace` | string | — | `wildberries` / `ozon` / `yandex_market` |
| `category` | string | — | Точный фильтр по категории товара |
| `search` | string | — | ILIKE по `title`, `vendor_code`, внутреннему артикулу (`sku_mappings.internal_article`) и SKU маркетплейса (`external_id`) |
| `date_from` | date | — | Учитывать отзывы с этой даты (включительно). Фильтр применяется к **отзывам, формирующим `avg_rating` и `total_reviews`**; на `mp_rating` не влияет |
| `date_to` | date | — | Учитывать отзывы до этой даты (включительно) |
| `sort_by` | string | `total_reviews` | `rating` (COALESCE mp→avg), `mp_rating`, `avg_rating`, `total_reviews`, `title`, `last_review_at` |
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
      "rating": 4.7,
      "rating_source": "marketplace",
      "mp_rating": 4.7,
      "mp_rating_count": 3120,
      "mp_rating_updated_at": "2026-04-17T09:00:00",
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
| `first_photo` | string? | URL первого фото |
| `vendor_code` | string? | Артикул из справочника маркетплейса |
| `internal_article` | string? | Внутренний артикул из `sku_mappings`; fallback — `vendor_code` |
| `category` | string? | Категория товара |
| `rating` | float? | Основное отображаемое значение, `COALESCE(mp_rating, avg_rating)` |
| `rating_source` | string | `"marketplace"` или `"computed"` |
| `mp_rating` | float? | Официальный рейтинг с маркетплейса |
| `mp_rating_count` | int? | Количество отзывов по версии маркетплейса |
| `mp_rating_updated_at` | datetime? | Когда мы последний раз тянули `mp_rating` |
| `avg_rating` | float? | Наша средняя оценка по отзывам (округление до 2 знаков); `null` если отзывов за период нет |
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
| Какие товары «хромают» (по официальному рейтингу) | `?sort_by=rating&order=asc` |
| Расхождение с маркетплейсом | сравнивать `mp_rating` и `avg_rating` (или сортировать по разнице на фронте) |
| Где не хватает отзывов | `?sort_by=total_reviews&order=asc` |
| Рейтинг за последние 30 дней | `?date_from=2026-03-16&date_to=2026-04-15&sort_by=avg_rating&order=asc` |
| Свежие отзывы | `?sort_by=last_review_at&order=desc` |
| Поиск товара | `?search=<артикул или SKU>` |

---

### `GET /api/v1/products/ratings`

Лёгкий листинг товаров **только с рейтингом маркетплейса** — без агрегатов по нашим отзывам. Отдельная страница «Рейтинги товаров» на фронте. Скрывает товары, у которых нет ни `mp_rating`, ни расчётного `avg_rating` (для YM `mp_rating` пока всегда `NULL` — YM в выдачу попадает только если есть отзывы в БД).

**Query-параметры:**

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|----------|
| `marketplace` | string | — | `wildberries` / `ozon` / `yandex_market` |
| `search` | string | — | ILIKE по SKU маркетплейса (`external_id`), `internal_article`, `vendor_code` |
| `sort_by` | string | `rating` | `rating`, `rating_count`, `updated_at` |
| `order` | string | `desc` | `asc` / `desc` (NULLS LAST) |
| `page` | int | `1` | ≥ 1 |
| `page_size` | int | `20` | 1–100 |

**Ответ: `ProductRatingsListResponse`**

```json
{
  "items": [
    {
      "marketplace": "wildberries",
      "external_sku": 293797327,
      "internal_sku": "91002",
      "title": "Платье с коротким рукавом",
      "rating": 4.7,
      "rating_count": 3120,
      "source": "api",
      "updated_at": "2026-04-17T09:00:00"
    }
  ],
  "total": 661,
  "page": 1,
  "page_size": 20
}
```

**Поля `ProductRatingItem`:**

| Поле | Тип | Описание |
|------|-----|----------|
| `marketplace` | string | Маркетплейс |
| `external_sku` | int | SKU на маркетплейсе |
| `internal_sku` | string? | `sku_mappings.internal_article`, fallback — `vendor_code` |
| `title` | string? | Название |
| `rating` | float | `COALESCE(mp_rating, avg_rating)` |
| `rating_count` | int? | `mp_rating_count` |
| `source` | string | `"api"` если есть `mp_rating`, иначе `"calculated"` |
| `updated_at` | datetime? | `mp_rating_updated_at` или `last_review_at` |

---

### `GET /api/v1/products/stats` *(legacy)*

Исторический эндпоинт — возвращает `ProductStatsResponse` с подмножеством полей (без `first_photo`, `internal_article`, `last_review_at`) и только товары, у которых есть хотя бы один отзыв (INNER JOIN). Для нового кода использовать `GET /api/v1/products`.

---

## 13. Settings (настройки)

### `GET /api/v1/settings`

Все настройки. **Ответ:** `list[SettingResponse]`.

### `GET /api/v1/settings/{key}`

Одна настройка. **Ответ:**

```json
{
  "key": "auto_publish_five_stars_enabled_wildberries",
  "value": "true",
  "updated_at": "2026-05-21T12:00:00"
}
```

**Ошибки:** `404` — ключ не найден.

### `PUT /api/v1/settings/{key}`

Создать или обновить. **Тело:** `{"value": "true"}`. **Ответ:** `SettingResponse`.

---

## 14. Prompt Management (промт генерации)

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

### Промты по маркетплейсу

Отдельный промт для каждого МП имеет приоритет над глобальным. `effective` промт выбирается в порядке: `{marketplace}` → глобальный → дефолт из кода.

**`{marketplace}`**: `wildberries` / `ozon` / `yandex_market`. Неверное значение → `400`.

### `GET /api/v1/prompts/{marketplace}`

Effective промт для маркетплейса.

**Ответ:** структура `PromptResponse` (как в глобальном), но `current_value` — итоговое значение с учётом fallback.

### `PUT /api/v1/prompts/{marketplace}`

Сохранить промт, специфичный для маркетплейса. **Тело:** `{"value": "..."}`. Пустая строка → `400`.

Ключ в `app_settings`: `generation_system_prompt_{marketplace}`.

### `DELETE /api/v1/prompts/{marketplace}`

Удалить промт маркетплейса → fallback на глобальный / дефолт.

---

### Сценарии по маркетплейсу

Отдельные инструкции для каждого из 7 сценариев классификации (`positive_with_text`, `positive_no_text`, `five_stars`, `negative`, `defect`, `wrong_item`, `question`). Как и системный промт — хранятся per-МП, приоритет над дефолтом из `ai_prompts.py`.

### `GET /api/v1/prompts/scenarios/{marketplace}`

Все 7 сценариев для маркетплейса с их current/default/is_customized.

**Ответ: `AllScenariosResponse`**

```json
{
  "marketplace": "wildberries",
  "scenarios": [
    {
      "scenario": "positive_with_text",
      "marketplace": "wildberries",
      "current_value": "Сценарий: положительный отзыв с текстом...",
      "default_value": "Сценарий: положительный отзыв с текстом...",
      "is_customized": false,
      "updated_at": null
    }
  ]
}
```

### `PUT /api/v1/prompts/scenarios/{marketplace}/{scenario}`

Сохранить инструкции сценария для маркетплейса. **Тело:** `{"value": "..."}`. Неизвестный `scenario` или пустой `value` → `400`.

Ключ в `app_settings`: `scenario_instructions_{scenario}_{marketplace}`.

### `DELETE /api/v1/prompts/scenarios/{marketplace}/{scenario}`

Сбросить сценарий к дефолту из кода.

---

## 15. Автоматические процессы (Scheduler)

Scheduler активен с v1.2.50. Запускается при старте сервера. Backfill убран из автозапуска — для исторических данных: `POST /stats/recompute`.

### Периодические задачи

| Задача | Интервал | Описание |
|--------|----------|----------|
| `refresh_today_analytics` | Каждые 30 минут | Пересчитывает статистику за сегодня и вчера для всех маркетплейсов |
| `retry_failed_publications` | Каждый час | Повторяет публикацию для отзывов в `status='error'` (до 50 шт.). Пропускает items с последней публикацией `not_supported`. Это safety net для manager-публикаций; для AI-публикаций есть отдельный авто-ретрай внутри 5★ цикла (см. раздел 16) |
| `auto_publish_five_stars_pending` | Каждые 3 минуты | Полный авто-цикл `generate → approve → publish` для 5★ review-ов на WB / YM в статусах `new`, `pending_review`, `error`. Управляется раздельными тоггл-эндпоинтами `PUT /api/v1/auto-respond/five-stars/{marketplace}` (см. раздел 16) — WB и YM включаются независимо. Каждый тик собирает список включённых МП и фильтрует выборку (`marketplace IN :enabled_mps`); если оба выключены — early return. Item-ы в `status='error'` подхватываются для авто-ретрая (правила в разделе 16) |
| `refresh_mp_ratings` | Ежедневно в 03:00 UTC | Тянет официальный рейтинг товара (`mp_rating`, `mp_rating_count`, `mp_rating_updated_at`) из API маркетплейсов. WB — через `card.wb.ru`, Ozon — `POST /v1/product/rating-by-sku` (Premium Plus), YM — без источника. Ручной trigger: `POST /api/v1/polling/ratings/refresh` |

> **Note (v1.2.62):** общая авто-генерация черновиков (`auto_generate_pending`) удалена. Теперь черновики создаются только в составе 5★ авто-цикла либо вручную через `POST /api/v1/reviews/{item_id}/generate`. Ключ `app_settings.auto_generate_enabled` больше не используется.
> Управление авто-ответом на 5★: `PUT /api/v1/auto-respond/five-stars/{marketplace}` с телом `{"enabled": true|false}` (удобный wrapper над `app_settings.auto_publish_five_stars_enabled_{marketplace}`). При старте сервиса `migrate_legacy_five_stars_flag()` одноразово переносит значение legacy-ключа `auto_publish_five_stars_enabled` в оба per-МП ключа и удаляет legacy. Идемпотентна.

---

## 16. Auto-Respond (авто-ответ на 5★)

Раздельные тоггл фоновой обработки 5★ отзывов на Wildberries и Yandex Market — каждый маркетплейс включается и выключается независимо. Пока МП включён, scheduler-задача `auto_publish_five_stars_pending` (раздел 15) каждые 3 минуты выбирает review-ы этого МП с `rating=5`, `status IN (new, pending_review, error)` и проводит каждый через полный цикл **классификация → генерация (сценарий `five_stars`) → approve → публикация на маркетплейс**.

> **Итоговый статус `answered` / `sent`.** Если 5★ отзыв «немой» — без `client_text`, `pros` и `cons` — после успешной публикации он получает статус **`sent`** («Отправлено») вместо `answered`: маркетплейс не показывает такой ответ публично, его видит только сам покупатель. Если у отзыва есть хоть один из текстовых блоков — статус обычный `answered`. Логика общая с ручной публикацией (раздел 5).

**Что не трогается:**
- **Ozon** исключён на уровне SQL-фильтра — нестабильная подписка Premium+. Тоггла для него нет.
- **Вопросы** (`item_type='question'`) — у них нет рейтинга, фильтр их не зацепит.
- **1–4★ отзывы** — идут обычным маршрутом (auto-generate → `pending_review` → ручное одобрение).
- **Невалидный draft** (после 3 retry в `_validate_response` остался `is_valid=False`) — пропускается, item остаётся в `pending_review` для менеджера.

**Ошибки публикации** (4xx / 5xx / network): `item.status='error'`, запись в `reputation_publications` с `source='ai'` и `status='failed'`. Item подхватывается следующим тиком `auto_publish_five_stars_pending` (см. правила авто-ретрая ниже). Существующий `retry_failed_publications` (раз в час) тоже работает, но для AI-публикаций он избыточен — авто-цикл сам ретраит каждые 3 минуты с собственными правилами.

#### Авто-ретрай неудачных AI-публикаций

Каждый тик помимо `new` / `pending_review` подхватывает items в `status='error'`, если у них есть упавшая `reputation_publications` с `source='ai'`. Для таких items **переиспользуется существующий approved-draft** (повторной генерации не происходит) и снова вызывается `publish_item_response`.

**Правила:**

| Условие | Поведение | Action в `auto_process_log` |
|---------|-----------|------------------------------|
| Меньше 5 попыток (`MAX_AUTO_RETRY=5`), ошибка не перманентная | Ретрай через 3 минуты | `auto_publish_five_stars_retry:success` или `:failed` |
| Достигли 5 попыток | SQL-фильтр отсекает item ещё на выборке; не тратится `limit=10` тика. Item остаётся менеджеру в `status='error'` | `auto_publish_five_stars_retry:cap_exceeded` |
| Последний `error_message` содержит `404` / `401` / `403` / `not_found` / `unauthorized` / `forbidden` (case-insensitive) | Перманентная ошибка — не ретраим, оставляем менеджеру | `auto_publish_five_stars_retry:permanent_error` |
| Прочая ошибка (`5xx`, network, `429`) | Ретраим следующим тиком (до cap=5) | — (по результату попытки) |

Все попытки публикации (и успешные, и упавшие) попадают в выдачу `GET /api/v1/reviews/ai-responses` (см. раздел 7) — там в одной строке отображается **самая свежая** попытка по каждому item с полем `retry_count` (всего попыток) и `error_message` (если упало).

**Аудит:** каждая успешная/неуспешная авто-публикация пишется в `auto_process_log` с `process_type='reputation_auto_five_stars'`, `action='auto_publish_five_stars:success'` / `:failed` для первичных попыток и `auto_publish_five_stars_retry:*` для ретраев. Поле `marketplace=<wildberries|yandex_market>` используется для подсчёта статистики per-МП.

**Хранение состояния:** два ключа в `app_settings` (`"true"` / `"false"`, default `"false"`):
- `auto_publish_five_stars_enabled_wildberries`
- `auto_publish_five_stars_enabled_yandex_market`

При старте сервиса одноразовая миграция `migrate_legacy_five_stars_flag()` переносит значение legacy-ключа `auto_publish_five_stars_enabled` (если он есть) в оба per-МП ключа и удаляет legacy. Идемпотентна.

### `GET /api/v1/auto-respond/five-stars`

Состояние тогглов и статистика за последние 24 часа по обоим МП. Порядок элементов в массиве фиксированный: `wildberries`, `yandex_market`. Удобно для рендера всей страницы одним запросом.

**Ответ: `AutoRespondFiveStarsListResponse`**

```json
{
  "marketplaces": [
    {
      "marketplace": "wildberries",
      "enabled": true,
      "last_run_at": "2026-05-18T09:42:00",
      "last_succeeded": 38,
      "last_failed": 2
    },
    {
      "marketplace": "yandex_market",
      "enabled": false,
      "last_run_at": null,
      "last_succeeded": 0,
      "last_failed": 0
    }
  ]
}
```

**Поля одного `AutoRespondFiveStarsMarketplaceStatus`:**

| Поле | Тип | Описание |
|------|-----|----------|
| `marketplace` | string | `"wildberries"` / `"yandex_market"` |
| `enabled` | bool | Текущее значение `app_settings.auto_publish_five_stars_enabled_{marketplace}` (`"true"` / иное → `false`) |
| `last_run_at` | datetime? | Время последней записи в `auto_process_log` (`process_type='reputation_auto_five_stars'`, `marketplace=<mp>`) (Омск, +6h). `null` если задача ещё не запускалась для этого МП |
| `last_succeeded` | int | Сколько раз `status='success'` за последние 24 часа для этого МП |
| `last_failed` | int | Сколько раз `status='error'` или `'failed'` за последние 24 часа для этого МП |

---

### `PUT /api/v1/auto-respond/five-stars/{marketplace}`

Включить или выключить авто-ответ на 5★ для одного маркетплейса.

**Path-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `marketplace` | string | `wildberries` или `yandex_market`. Любое другое значение (включая `ozon`) → `400` |

**Тело запроса:**

```json
{ "enabled": true }
```

**Что происходит:**
- Апсертит `app_settings.auto_publish_five_stars_enabled_{marketplace}` в `"true"` или `"false"`.
- Влияет только на этот МП — состояние второго не меняется.
- Эффект применяется со следующего тика scheduler-а (≤ 3 минуты).
- Никакие текущие в работе items не прерываются — выключение блокирует только новые итерации.

**Ответ:** `AutoRespondFiveStarsMarketplaceStatus` для этого МП (см. выше — со свежим `enabled` и текущей статистикой).

**Ошибки:**

| HTTP | Когда |
|------|-------|
| `400` | `marketplace` не `wildberries` / `yandex_market` (например, `ozon`) — для него тоггл не предусмотрен |

> **Альтернатива через универсальный settings-эндпоинт:** `PUT /api/v1/settings/auto_publish_five_stars_enabled_{marketplace}` с телом `{"value": "true"}`. Делает то же самое, но без валидации path-параметра и без человекочитаемого ответа со статистикой.

---

## 17. Схема БД

### `reputation_products`
Данные о товарах (заполняются из AdolfDataSync).

| Поле | Тип | Описание |
|------|-----|----------|
| `external_id` | BIGINT (PK) | ID товара на маркетплейсе |
| `marketplace` | VARCHAR (PK) | `wildberries` / `ozon` / `yandex_market` |
| `vendor_code` | VARCHAR | Артикул из справочника маркетплейса |
| `brand_tag` | VARCHAR | Бренд |
| `title` | TEXT | Название |
| `description` | TEXT | Описание |
| `composition` | TEXT | Состав |
| `size_measurements` | JSONB | Размеры |
| `media_urls` | JSONB | Массив URL фото (`[0]` используется как `first_photo` в `/products`) |
| `video_url` | TEXT | URL видео |
| `attributes` | JSONB | Характеристики |
| `imt_id` | BIGINT | ID склейки (merch-tree ID) |
| `category` | VARCHAR(100) | Категория товара (платья, штаны и т.д.) |
| `mp_rating` | NUMERIC(3,2) | Официальный рейтинг с маркетплейса (точность 2 знака) |
| `mp_rating_count` | INTEGER | Количество отзывов по версии маркетплейса |
| `mp_rating_updated_at` | TIMESTAMPTZ | Когда мы последний раз тянули `mp_rating` |
| `updated_at` | DATETIME | Дата последнего обновления карточки |

> Composite PK: `(external_id, marketplace)`
> Индексы: `ix_rprod_category` на `category`, `ix_rprod_mp_rating` на `mp_rating`

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
| `photos` | JSONB | Фото клиента |
| `video` | JSONB | Видео клиента |
| `wb_created_at` | DATETIME | Дата создания на маркетплейсе |
| `created_at` | DATETIME | Дата загрузки в систему (используется для сортировки и фильтров по дате) |
| `is_viewed` | BOOLEAN | Просмотрен |

**Статусы:**

```
new → analyzing → pending_review → approved → publishing → answered
                                                          ├→ sent  (немой 5★: rating=5 без text/pros/cons)
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
| `approved_by_id` | INTEGER | ID менеджера, одобрившего ответ |
| `generated_at` | DATETIME | |
| `published_at` | DATETIME | |
| `wb_error` | TEXT | Ошибка от маркетплейса |
| `marketplace` | VARCHAR | Маркетплейс (дублируется из item для быстрых фильтров) |
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
| `auto_publish_five_stars_enabled_wildberries` | `"true"` / `"false"` — тоггл авто-ответа на 5★ отзывы Wildberries (см. раздел 16). Default `"false"` |
| `auto_publish_five_stars_enabled_yandex_market` | `"true"` / `"false"` — тоггл авто-ответа на 5★ отзывы Yandex Market (см. раздел 16). Default `"false"` |
| `auto_check_enabled` | Включение авто-проверки/тегирования |
| `auto_check_interval` | Интервал авто-проверки (сек) |
| `auto_check_threshold` | Порог авто-проверки |
| `reputation_max_regenerations` | Лимит вариантов на один отзыв (по умолчанию 5) |
| `tag_scheduler_enabled` | Включение планировщика тегов |
| `tag_rules` | Правила тегирования (JSON) |
| `generation_system_prompt` | Глобальный кастомный системный промт |
| `generation_system_prompt_{marketplace}` | Per-МП системный промт (приоритет над глобальным) |
| `scenario_instructions_{scenario}_{marketplace}` | Per-МП инструкции для сценария генерации |
| `wb_token` | API-токен Wildberries |
| `ym_token`, `ym_api_key`, `ym_business_id` | Креды Yandex Market |
| `ozon_client_id`, `ozon_api_key`, `ozon_token` | Креды Ozon |

---

### `sku_mappings`
Маппинг SKU маркетплейса ↔ внутренний артикул продавца. Используется в `/reviews` и `/products` для отображения внутреннего артикула.

| Поле | Тип | Описание |
|------|-----|----------|
| `external_sku` | VARCHAR(100) (PK) | SKU маркетплейса (как строка) |
| `marketplace` | VARCHAR(10) (PK) | Короткий код: `wb` / `ym` / `ozon` |
| `internal_article` | VARCHAR(100) | Внутренний артикул продавца |
| `created_at` | TIMESTAMPTZ | |

> Composite PK: `(external_sku, marketplace)`
> Индекс: `ix_sm_ext_sku_mp` на `(external_sku, marketplace)`

---

### `auto_process_log`
Аудит автоматических процессов (auto-generate, retry, scheduler и т.д.). Используется `GET /worker/status` для вычисления `age_minutes`.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | INTEGER (PK) | |
| `run_id` | VARCHAR(36) | ID прогона (UUID как строка) |
| `process_type` | VARCHAR(30) | Тип процесса (`reputation_auto_generate`, ...) |
| `external_id` | BIGINT | ID товара (если релевантно) |
| `action` | VARCHAR(100) | Тип операции (`auto_generate:success`, ...) |
| `status` | VARCHAR(20) | `success` / `error` |
| `error` | TEXT | Сообщение ошибки |
| `marketplace` | VARCHAR(30) | |
| `created_at` | DATETIME | |

---

## 18. Пайплайн обработки

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

## 19. Миграции

| Файл | Описание |
|------|----------|
| `add_response_source.sql` | Добавляет колонку `source` (VARCHAR(20), default `'manager'`) в `reputation_responses`. Backfill: `source='ai'` для ответов с непустым `ai_variants` |
| `add_performance_indexes.sql` | 15 индексов: 8 на `reputation_items` (marketplace, status, item_type, rating, created_at, product_id + составные), 5 на FK-колонки (`ix_rr_item_id`, `ix_rd_item_id`, `ix_rg_item_id`, `ix_rp_item_id`, `ix_rp_status`), 1 на `sku_mappings` (`ix_sm_ext_sku_mp`), 1 на `reputation_products` (`ix_rprod_category`) |
| `add_product_category.sql` | Добавляет колонку `category` (VARCHAR(100)) в `reputation_products` + индекс `ix_rprod_category` |
| `add_mp_rating_columns.sql` | Добавляет в `reputation_products` колонки `mp_rating` (NUMERIC(3,2)), `mp_rating_count` (INTEGER), `mp_rating_updated_at` (TIMESTAMPTZ) + индекс `ix_rprod_mp_rating` для сортировки по официальному рейтингу |

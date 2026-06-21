# ADOLF Content Factory REST API Справочник (v1.4)

## Обзор

Content Factory — это FastAPI-сервис, предназначенный для генерации SEO-оптимизированного контента карточек товаров маркетплейсов с помощью Claude Sonnet 4.5. Поддерживает интеграции с Wildberries, Ozon и Яндекс Маркет.

**Base URL:** `http://<host>:3000`
**Swagger UI:** `GET /docs`
**Версия приложения:** `1.4.0` (см. `app/config.py::APP_VERSION`)

---

## История версий

| Версия | Дата | Изменения |
|--------|------|----------|
| **v1.4.4** | 2026-06-04 | Исправлена публикация выбранных товаров склейки: при `approve` обновляются **все** SKU из `selected_skus` черновика (раньше обновлялась только одна карточка). По каждой обновлённой карточке создаётся **отдельная** запись публикации — в истории (`/approvals/history`) все товары склейки видны как отдельные строки со своим `vendor_code`. Поддержан **частичный успех**: упавшие карточки сохраняются как `failed` (поле `failed_nm_ids` в ответе `/approve`), `502` — только если не обновилось ни одной. `regenerate` наследует `selected_skus` из предыдущего черновика. |
| **v1.4** | 2026-04-08 | Эндпоинты сертификатов (`/api/certificates`), управление правилами тегов (`/api/tag-rules`), кастомные промты (`/api/content/prompts`), пакетная загрузка медиа (`/upload-batch`), синхронизация медиа с маркетплейсом (`/sync`), переработанная система шаблонов фотографий (категории + шаблоны). |
| **v1.3** | 2026-04-07 | Добавлены эндпоинты медиафайлов, шаблонов и сертификатов. Новые параметры `generate_for_group` и `selected_skus`. Поле `vendor_code` во всех ответах. |
| **v1.2** | 2026-02-27 | Полный перевод на русский, мониторинг токенов маркетплейсов. |
| **v1.1** | 2026-01-15 | Добавлена поддержка Ozon и Яндекс Маркета. |
| **v1.0** | 2026-01-01 | Первый релиз (только Wildberries). |

---

## Оглавление

1. [Информация о сервисе](#информация-о-сервисе)
2. [Данные товаров](#данные-товаров)
3. [Генерация контента](#генерация-контента)
4. [Публикация](#публикация)
5. [Кастомные промты](#кастомные-промты)
6. [Управление медиафайлами](#управление-медиафайлами)
7. [Шаблоны фотографий](#шаблоны-фотографий)
8. [Сертификаты товаров](#сертификаты-товаров)
9. [Управление правилами тегов](#управление-правилами-тегов)
10. [Мониторинг и автообработка](#мониторинг-и-автообработка)
11. [Ошибки маркетплейсов](#ошибки-маркетплейсов)
12. [Настройки и мониторинг токенов](#настройки-и-мониторинг-токенов)
13. [Ключевые концепции](#ключевые-концепции)

---

## Информация о сервисе

### `GET /`

Корневой эндпоинт с метаданными сервиса.

**Ответ:**
```json
{
  "service": "Content Factory",
  "version": "1.4.0",
  "status": "running",
  "docs": "/docs",
  "health": "/health"
}
```

### `GET /health`

Healthcheck.

**Ответ:**
```json
{ "status": "ok", "service": "content-factory" }
```

### `GET /ready`

Readiness-check с проверкой подключения к БД.

---

## Данные товаров

### `GET /api/content/product`

Получить оригинальные данные товара из БД с валидацией и SEO-анализом. Возвращает все товары склейки (группы с одинаковым `imt_id`).

**Query параметры:**
| Параметр | Тип | Обязательно | Описание |
|----------|-----|------------|---------|
| `url` | string | один из (url / sku+marketplace) | URL товара на маркетплейсе |
| `sku` | string | один из (url / sku+marketplace) | SKU товара (nmID) или vendor_code |
| `marketplace` | string | обязателен если нет url | `wb` / `ozon` / `ym` |

**Пример запроса:**
```
GET /api/content/product?sku=203873004&marketplace=wb
GET /api/content/product?url=https://www.wildberries.ru/catalog/123456789/detail.aspx
```

**Ответ (`ProductResponse`):**
```json
{
  "sku": "203873004",
  "vendor_code": "16378",
  "title": "Оригинальное название",
  "description": "Оригинальное описание",
  "media_urls": ["https://.../photo1.webp", "https://.../photo2.webp"],
  "video_url": null,
  "rating": 4.86,
  "marketplace": "wb",
  "imt_id": 12345678,
  "group_count": 3,
  "products": [
    {
      "sku": "203873004",
      "main_photo": "https://.../photo.webp",
      "vendor_code": "16378",
      "rating": 4.86
    }
  ],
  "validation": {
    "is_valid": false,
    "issues": [
      { "field": "description", "message": "...", "severity": "error" }
    ]
  },
  "analysis": {
    "total_score": 72,
    "is_valid": true,
    "metrics": {
      "title_quality":       { "name": "Качество названия",   "score": 80, "max_score": 100, "status": "good",    "details": "...", "issues": [] },
      "description_quality": { "name": "Качество описания",   "score": 65, "max_score": 100, "status": "warning", "details": "...", "issues": [] },
      "foreign_words":       { "name": "Иностранные слова",   "score": 100,"max_score": 100, "status": "good",    "details": "...", "issues": [] }
    }
  }
}
```

**Поля склейки:**
- `imt_id` — ID группы товаров (`null`, если товар не в склейке).
- `group_count` — количество товаров в склейке (1, если одиночный).
- `products[]` — все товары в склейке (`sku`, `main_photo`, `vendor_code` + оценка по отзывам, см. ниже).

**Оценка товара по отзывам** (есть и у главного товара, и у каждого элемента `products[]`):
- `rating` — средний рейтинг по отзывам, число (например `4.86`). `null`, если оценок ещё нет.
- `rating_count` — количество **оценок** (поставленных звёзд). `0`, если оценок нет.
- `reviews_count` — количество **текстовых отзывов**. `0`, если отзывов нет.

> **Wildberries:** возвращается **только `rating`** — полей `rating_count` и `reviews_count` в ответе нет (ни у главного товара, ни в элементах `products[]`). Они присутствуют только для **Ozon** и **Яндекс Маркета**. Пример выше — WB, поэтому в нём только `rating`.

> `rating_count` (оценки) и `reviews_count` (отзывы) — независимые числа из разных источников: можно поставить оценку, не написав отзыв, поэтому значения часто различаются (актуально для Ozon/YM).

---

### `GET /api/content/search`

Поиск товаров по артикулу (SKU или vendor_code) в одном или всех маркетплейсах.

**Query параметры:**
| Параметр | Тип | Обязательно | По умолчанию | Описание |
|----------|-----|------------|-------------|---------|
| `query` | string | Да | — | Артикул для поиска (1–50 символов) |
| `marketplace` | string | Нет | — | `wb` / `ozon` (alias `oz`) / `ym`. Без параметра — все МП |
| `limit` | integer | Нет | 50 | Товаров на странице (1–500) |
| `offset` | integer | Нет | 0 | Смещение |

**Ответ (`SearchProductsResponse`):**
```json
{
  "query": "16378",
  "marketplace": "wb",
  "total_count": 3,
  "limit": 50,
  "offset": 0,
  "products": [
    {
      "external_id": "203873004",
      "vendor_code": "16378",
      "marketplace": "wb",
      "title": "Носки мужские набор 5 пар",
      "brand_tag": "MyBrand",
      "imt_id": 12345678,
      "updated_at": "2026-02-12T15:30:00Z"
    }
  ]
}
```

**Поведение:**
- Поиск по `external_id::TEXT LIKE '%query%'` OR `vendor_code LIKE '%query%'` (case-insensitive).
- Точные совпадения поднимаются в начало.
- Пустой результат — `total_count: 0`, `products: []` (не ошибка).

**HTTP статусы:** `200 OK`, `400` (неизвестный маркетплейс), `422` (limit/offset вне границ).

---

## Генерация контента

### `POST /api/content/generate`

Генерация SEO-названия, описания и тегов с помощью AI.

**Запрос (`GenerateRequest`):**
```json
{
  "url": "https://www.wildberries.ru/catalog/123456789/detail.aspx",
  "sku": "123456789",
  "marketplace": "wb",
  "generate_for_group": false,
  "selected_skus": ["123456789", "123456790"]
}
```

| Параметр | Тип | Обязательно | По умолчанию | Описание |
|----------|-----|------------|-------------|---------|
| `url` | string (HttpUrl) | один из (url/sku) | — | URL товара |
| `sku` | string | один из (url/sku) | — | SKU товара |
| `marketplace` | string | Нет | `wb` | `wb` / `ozon` / `ym` |
| `generate_for_group` | bool | Нет | `false` | Генерировать единый title/description для всей склейки |
| `selected_skus` | string[] | Нет | `null` | Список SKU из склейки, для которых применить одинаковый контент |

**Ответ (`GenerateResponse`):**
```json
{
  "draft_id": "uuid",
  "sku": "123456789",
  "vendor_code": "16378",
  "marketplace": "wb",
  "title": "SEO-название",
  "description": "SEO-описание",
  "seo_tags": ["тег1", "тег2"],
  "imt_id": 12345678,
  "group_nm_ids": [123456789, 123456790],
  "generated_for_group": false,
  "validation": { "is_valid": true, "issues": [] },
  "is_valid": true,
  "validation_fixes": {
    "was_fixed": false,
    "original_issues": [],
    "fixed_issues": [],
    "remaining_issues": [],
    "fix_attempts": 0
  },
  "analysis": {
    "total_score": 92,
    "is_valid": true,
    "metrics": {
      "title_quality":       { "name": "Качество названия",   "score": 95, "max_score": 100, "status": "good", "details": "...", "issues": [] },
      "description_quality": { "name": "Качество описания",   "score": 90, "max_score": 100, "status": "good", "details": "...", "issues": [] },
      "foreign_words":       { "name": "Иностранные слова",   "score": 100,"max_score": 100, "status": "good", "details": "...", "issues": [] }
    }
  },
  "comparison": {
    "total_before": 72,
    "total_after": 92,
    "improvements": [
      { "metric": "description_quality", "before": 65, "after": 90, "diff": "+25" }
    ],
    "fixed_errors": ["description too short"]
  },
  "created_at": "2026-04-08T12:34:56Z"
}
```

**SEO-теги по маркетплейсам:**

| Маркетплейс | Формат | Куда отправляется при approve |
|-------------|--------|-------------------------------|
| **WB** | Поисковые фразы, до 12 штук (`"Футболка женская"`) | Поле «Комплектация» на карточке WB |
| **Ozon** | Хештеги через `_`, 5–10 штук (`"халат_женский_ohana"`) | Поле `keywords` через Ozon Seller API |
| **YM** | Не генерируются — `seo_tags: []` | — |

---

### `POST /api/content/regenerate`

Перегенерация контента с учётом пожеланий менеджера и контекста предыдущего черновика.

**Запрос (`RegenerateRequest`):**
```json
{
  "draft_id": "uuid",
  "manager_notes": "Сделай описание с акцентом на натуральность",
  "generate_for_group": false,
  "selected_skus": ["123456789", "123456790"]
}
```

| Параметр | Тип | Обязательно | Описание |
|----------|-----|------------|---------|
| `draft_id` | UUID | Да | ID предыдущего черновика |
| `manager_notes` | string | Нет | Пожелания менеджера |
| `generate_for_group` | bool | Нет | Генерировать для всей склейки |
| `selected_skus` | string[] | Нет | Список выбранных SKU |

**Ответ:** идентичен `POST /api/content/generate` (`GenerateResponse`, новый `draft_id`).

---

## Публикация

### `POST /api/content/drafts/{draft_id}/approve`

Утвердить черновик и опубликовать на маркетплейс.

**Path:** `draft_id` — UUID черновика.

**Запрос (`DraftApproveRequest`):**
```json
{
  "title": "Финальное название",
  "description": "Финальное описание",
  "seo_tags": ["тег1", "тег2"],
  "update_all_in_group": false,
  "source": "manual"
}
```

| Поле | Тип | Обязательно | По умолчанию | Описание |
|------|-----|------------|-------------|---------|
| `title` | string | Да | — | Финальное название |
| `description` | string | Да | — | Финальное описание |
| `seo_tags` | string[] | Нет | `[]` | WB → «Комплектация», Ozon → `keywords`, YM → игнорируется |
| `update_all_in_group` | bool | Нет | `false` | Обновить все карточки склейки (по `imt_id`) |
| `source` | string | Нет | `manual` | `manual` или `auto` |

**Какие карточки обновляются (приоритет сверху вниз):**
1. Если черновик был создан с `selected_skus` (генерация для выбранных товаров склейки) — обновляются **все** эти SKU. Список берётся из черновика, в запросе approve его передавать не нужно.
2. Иначе если `update_all_in_group: true` и товар в склейке — обновляются **все** карточки склейки (по `imt_id`).
3. Иначе — обновляется только один SKU черновика.

**Ответ (`ApproveResponse`):**
```json
{
  "success": true,
  "draft_id": "uuid",
  "vendor_code": "16378",
  "message": "Обновлено 2 из 3 карточек на Wildberries; не удалось: 1",
  "updated_nm_ids": [123456789, 123456790],
  "failed_nm_ids": [123456791]
}
```

| Поле | Описание |
|------|----------|
| `updated_nm_ids` | Все фактически обновлённые карточки (для склейки — несколько) |
| `failed_nm_ids` | Карточки склейки, которые **не** удалось обновить (частичный успех) |

**Частичный успех склейки.** При обновлении нескольких карточек, если часть прошла, а часть упала:
- успешные сохраняются как публикации со статусом `success`;
- упавшие сохраняются со статусом `failed` (видны в истории);
- ответ — `200 OK` с заполненным `failed_nm_ids`.

Ошибка `502` возвращается только если **ни одна** карточка не обновилась.

**HTTP статусы:** `200 OK` (в т.ч. частичный успех), `404` (черновик не найден), `502` (не обновилась ни одна карточка).

---

## Кастомные промты

Управление кастомными промтами для AI по каждому маркетплейсу. Ключ хранения: `content_{marketplace}_{instruction_type}`.

**Поддерживаемые `instruction_type`:**
- `system_prompt` — системный промт
- `generation_instructions` — промт первичной генерации
- `group_generation_instructions` — генерация для склейки
- `regeneration_instructions` — перегенерация
- `group_regeneration_instructions` — перегенерация для склейки
- `fix_validation_instructions` — автоисправление ошибок валидации

Всего: 6 типов × 3 маркетплейса = 18 промтов.

### `GET /api/content/prompts`

Получить все доступные промты.

**Query параметры:**
| Параметр | Тип | Описание |
|----------|-----|---------|
| `marketplace` | string | `wb` / `oz` / `ym` (фильтр, опционально) |

**Ответ:** `list[PromptInfo]`
```json
[
  {
    "key": "content_wb_system_prompt",
    "label": "Системный промт (WB)",
    "current_value": "...",
    "default_value": "...",
    "is_customized": false,
    "updated_at": null
  }
]
```

### `GET /api/content/prompts/{instruction_type}`

Получить один промт.

**Path:** `instruction_type`. **Query:** `marketplace` (default `wb`, pattern `^(wb|oz|ym)$`).

**Ответ:** `PromptInfo`.

### `PUT /api/content/prompts/{instruction_type}`

Сохранить/переопределить промт.

**Запрос:**
```json
{ "value": "Новый текст промта..." }
```

**Ответ:** обновлённый `PromptInfo`.

### `DELETE /api/content/prompts/{instruction_type}`

Сбросить промт к дефолтному значению (удалить кастомизацию).

**Query:** `marketplace` (default `wb`).

**Ответ:** `PromptInfo` с `is_customized: false`.

---

## Управление медиафайлами

### `GET /api/media/{external_id}/list`

Получить все медиафайлы товара из локальной БД.

**Path:** `external_id` — SKU товара (int).
**Query:** `marketplace` (required) — `wb` / `ozon` / `ym`.

**Ответ (`ProductMediaResponse`):**
```json
{
  "external_id": 203873004,
  "marketplace": "wb",
  "photos": [
    {
      "id": "uuid",
      "external_id": 203873004,
      "marketplace": "wb",
      "media_id": "wb-photo-id",
      "media_type": "photo",
      "url": "https://.../photo.webp",
      "position": 0,
      "source": "user_upload",
      "status": "active",
      "file_size_bytes": 245632,
      "published_at": "2026-02-01T10:30:00Z",
      "created_at": "2026-02-01T10:25:00Z",
      "marketplace_meta": {}
    }
  ],
  "videos": [],
  "total_count": 5,
  "synced": false
}
```

**Статусы медиа:** `draft`, `uploading`, `active`, `failed`, `deleted`.
**Источники:** `user_upload`, `marketplace`, `ai_generated`.

---

### `POST /api/media/{external_id}/upload`

Загрузить один медиафайл.

**Path:** `external_id` (int).
**Form (`multipart/form-data`):**
| Поле | Тип | Обязательно | По умолчанию | Описание |
|------|-----|------------|-------------|---------|
| `file` | file | Да | — | JPG/PNG/WebP (фото) или MP4/WebM (видео) |
| `marketplace` | string | Да | — | `wb` / `ozon` / `ym` |
| `position` | integer | Нет | `0` | Позиция в галерее |
| `media_type` | string | Нет | `photo` | `photo` или `video` |

**Ответ (`MediaUploadResponse`):**
```json
{
  "success": true,
  "media_id": "uuid",
  "message": "Медиафайл загружен",
  "error": null
}
```

---

### `POST /api/media/{external_id}/upload-batch`

Пакетная загрузка нескольких медиафайлов за один запрос.

**Path:** `external_id` (int).
**Form (`multipart/form-data`):**
| Поле | Тип | Обязательно | По умолчанию | Описание |
|------|-----|------------|-------------|---------|
| `files` | file[] | Да | — | Массив файлов |
| `marketplace` | string | Да | — | `wb` / `ozon` / `ym` |
| `media_type` | string | Нет | `photo` | `photo` или `video` |
| `start_position` | integer | Нет | `-1` | Позиция первого файла; `-1` — в конец |

**Ограничения:** до 30 файлов за запрос, суммарно ≤ 500 МБ, каждый ≤ 50 МБ.

**Ответ (`BatchUploadResponse`):**
```json
{
  "success": true,
  "total": 3,
  "uploaded": 2,
  "failed": 1,
  "items": [
    { "filename": "1.jpg", "status": "uploaded", "media_id": "uuid", "position": 0, "error": null },
    { "filename": "2.jpg", "status": "uploaded", "media_id": "uuid", "position": 1, "error": null },
    { "filename": "3.gif", "status": "failed",   "media_id": null,   "position": null, "error": "Unsupported format" }
  ]
}
```

---

### `DELETE /api/media/{external_id}/media/{media_id}`

Удалить медиафайл.

**Path:** `external_id` (int), `media_id` (UUID).
**Query:** `marketplace` (required).

**Ответ (`MediaDeleteResponse`):**
```json
{ "success": true, "media_id": "uuid", "message": "Медиафайл удалён" }
```

---

### `PATCH /api/media/{external_id}/reorder`

Переупорядочить фото (drag-drop).

**Path:** `external_id`.
**Запрос (`MediaReorderRequest`):**
```json
{
  "external_id": 203873004,
  "marketplace": "wb",
  "media_ids": ["uuid1", "uuid2", "uuid3"]
}
```

**Ответ (`MediaReorderResponse`):**
```json
{ "success": true, "count": 3, "message": "Порядок обновлён" }
```

---

### `POST /api/media/{external_id}/sync`

Синхронизировать медиафайлы с актуальным состоянием на маркетплейсе (pull).

**Path:** `external_id`.
**Query:** `marketplace` (required).

**Ответ:** `ProductMediaResponse` (с `synced: true`).

---

## Шаблоны фотографий

Система шаблонов состоит из **категорий** и **шаблонов** внутри категорий. Каждый шаблон — это фото определённого типа (размерная сетка, уход, гарантия и т. д.), которое можно применять к товарам (отдельно или сразу к склейке).

### Категории

#### `POST /api/v1/templates/categories` (201)

Создать категорию.

**Запрос (`CategoryCreate`):**
```json
{
  "name": "Футболки женские",
  "slug": "women-t-shirts",
  "marketplace": "wb",
  "marketplace_category_id": "12345"
}
```

**Ответ (`CategoryResponse`):**
```json
{
  "id": 1,
  "name": "Футболки женские",
  "slug": "women-t-shirts",
  "marketplace": "wb",
  "display_order": 0,
  "is_active": true,
  "created_at": "2026-02-01T10:00:00Z",
  "updated_at": "2026-02-01T10:00:00Z"
}
```

#### `GET /api/v1/templates/categories`

Список всех категорий со статистикой.

**Query:** `marketplace` (optional).

**Ответ:** `list[CategoryWithStatsResponse]` — `CategoryResponse` + `template_count`, `mandatory_template_count`, `optional_template_count`.

#### Не реализовано

- `GET /api/v1/templates/categories/{category_id}` — **501**
- `PUT /api/v1/templates/categories/{category_id}` — **501**
- `DELETE /api/v1/templates/categories/{category_id}` — **501**

---

### Шаблоны

#### `POST /api/v1/templates/categories/{category_id}/templates` (201)

Создать шаблон в категории.

**Запрос (`TemplateCreate`):**
```json
{
  "category_id": 1,
  "template_type": "size_chart",
  "name": "Размерная сетка",
  "description": "Стандартная таблица размеров",
  "source_url": "https://cdn.example.com/size_chart.jpg",
  "position_order": 0,
  "is_optional": false
}
```

**`template_type`:** `size_chart`, `care_instruction`, `guarantee`, `return_policy`, `material_composition`, `brand_badge`, `measurement_guide`, `custom`.

**Ответ (`TemplateResponse`):**
```json
{
  "id": "uuid",
  "category_id": 1,
  "template_type": "size_chart",
  "name": "Размерная сетка",
  "description": "Стандартная таблица размеров",
  "source_url": "https://cdn.example.com/size_chart.jpg",
  "position_order": 0,
  "is_optional": false,
  "is_active": true,
  "file_size_bytes": 102400,
  "created_at": "2026-02-01T10:00:00Z",
  "updated_at": "2026-02-01T10:00:00Z"
}
```

#### `GET /api/v1/templates/categories/{category_id}/templates`

Получить шаблоны категории. **Ответ:** `list[TemplateResponse]`.

#### `GET /api/v1/templates/templates/{template_id}`

Получить шаблон по UUID. **Ответ:** `TemplateResponse`.

#### Не реализовано

- `PUT /api/v1/templates/templates/{template_id}` — **501**
- `DELETE /api/v1/templates/templates/{template_id}` — **501**
- `GET /api/v1/templates/templates/{template_id}/applications` — **501**
- `GET /api/v1/templates/products/{product_external_id}/applications` — **501**

---

### Применение шаблонов

#### `POST /api/v1/templates/templates/{template_id}/apply`

Применить один шаблон к нескольким товарам.

**Запрос (`ApplyTemplateRequest`):**
```json
{
  "product_external_ids": [203873004, 203873005],
  "marketplace": "wb",
  "force": false,
  "scope": "products"
}
```

| Поле | Тип | По умолчанию | Описание |
|------|-----|-------------|---------|
| `product_external_ids` | int[] | — | SKU товаров |
| `marketplace` | string | — | `wb` / `ozon` / `ym` |
| `force` | bool | `false` | Переприменить, даже если уже применено |
| `scope` | `"products"` \| `"group"` | `products` | `group` — применить ко всей склейке каждого товара |

**Ответ (`ApplyTemplateResponse`):**
```json
{
  "success": true,
  "total": 2,
  "applied": 2,
  "skipped": 0,
  "failed": 0,
  "errors": null
}
```

#### `POST /api/v1/templates/templates/{template_id}/apply-single`

Применить один шаблон к одному товару.

**Query параметры:**
| Параметр | Тип | Обязательно | По умолчанию | Описание |
|----------|-----|------------|-------------|---------|
| `product_external_id` | int | Да | — | SKU товара |
| `marketplace` | string | Да | — | `wb` / `ozon` / `ym` |
| `force` | bool | Нет | `false` | Переприменить |

**Ответ (`ApplyTemplateToProductResponse`):**
```json
{
  "success": true,
  "status": "applied",
  "message": "Шаблон применён",
  "media_id": "uuid",
  "application_id": "uuid"
}
```
`status`: `applied` / `skipped` / `failed`.

#### `POST /api/v1/templates/categories/{category_id}/apply`

Применить все шаблоны категории к одному товару.

**Query параметры:**
| Параметр | Тип | Обязательно | По умолчанию | Описание |
|----------|-----|------------|-------------|---------|
| `product_external_id` | int | Да | — | SKU товара |
| `marketplace` | string | Да | — | `wb` / `ozon` / `ym` |
| `strategy` | string | Нет | `suggested` | `suggested` / `aggressive` / `passive` |
| `scope` | string | Нет | `products` | `products` / `group` |

**Ответ (`ApplyCategoryTemplatesResponse`):**
```json
{
  "mandatory_applied": 3,
  "mandatory_skipped": 0,
  "mandatory_failed": 0,
  "optional_applied": 2,
  "optional_skipped": 1,
  "optional_failed": 0,
  "notifications": []
}
```

---

### Статистика

#### `GET /api/v1/templates/categories/{category_id}/stats`

**Ответ (`TemplateCoverageStatsResponse`):**
```json
{
  "total_templates": 8,
  "mandatory_templates": 5,
  "optional_templates": 3,
  "products_with_templates": 120,
  "products_successfully_applied": 115,
  "products_with_failures": 3,
  "products_skipped": 2,
  "coverage_percent": 92.3
}
```

#### `GET /api/v1/templates/stats`

**Ответ (`GlobalStatsResponse`):**
```json
{
  "total_categories": 5,
  "total_templates": 32,
  "total_products_with_templates": 450,
  "total_applications": 1840,
  "applications_last_24h": 15,
  "applications_last_week": 120,
  "average_coverage_percent": 74.5,
  "by_category": []
}
```

#### `GET /api/v1/templates/health`

Healthcheck для модуля шаблонов.

**Ответ:** `{ "status": "ok", "service": "templates" }`.

---

## Сертификаты товаров

### `GET /api/certificates/{external_id}`

Проверить наличие сертификата. Возвращает `has_certificate: true/false`, а не 404.

**Path:** `external_id` (int).
**Query:** `marketplace` (default `wb`).

**Ответ (`CertificateCheckResponse`):**
```json
{
  "external_id": 203873004,
  "marketplace": "wb",
  "has_certificate": true,
  "certificate_name": "ГОСТ 123-456",
  "expire_date": "2026-12-31",
  "file_url": "/api/certificates/203873004/file?marketplace=wb"
}
```

Если сертификата нет — `has_certificate: false`, остальные поля `null`.

---

### `POST /api/certificates/{external_id}`

Загрузить сертификат (PDF). При `apply_to_group=true` применяется ко всей склейке.

**Path:** `external_id`.
**Form (`multipart/form-data`):**
| Поле | Тип | Обязательно | По умолчанию | Описание |
|------|-----|------------|-------------|---------|
| `file` | file | Да | — | PDF-файл (макс. 10 МБ) |
| `certificate_name` | string | Да | — | Название сертификата |
| `marketplace` | string | Нет | `wb` | `wb` / `ozon` / `ym` |
| `expire_date` | string (YYYY-MM-DD) | Нет | — | Дата истечения |
| `apply_to_group` | bool | Нет | `false` | Применить ко всей склейке |

**Ответ (`CertificateUploadResponse`):**
```json
{
  "success": true,
  "certificate_id": "uuid",
  "message": "Сертификат загружен для 3 товар(ов)",
  "applied_to": [203873004, 203873005, 203873006]
}
```

---

### `DELETE /api/certificates/{external_id}`

Soft-delete сертификата. Файл удаляется с диска, если нет других ссылок.

**Path:** `external_id`.
**Query:** `marketplace` (default `wb`), `apply_to_group` (default `false`).

**Ответ (`CertificateDeleteResponse`):**
```json
{
  "success": true,
  "message": "Сертификат удалён у 3 товар(ов)",
  "deleted_from": [203873004, 203873005, 203873006]
}
```

---

### `GET /api/certificates/{external_id}/file`

Отдать PDF-файл сертификата (`Content-Disposition: inline`) для встроенного просмотра.

**Path:** `external_id`. **Query:** `marketplace` (default `wb`).

**HTTP статусы:** `200 OK` (PDF), `404` (не найден).

---

## Управление правилами тегов

Менеджер настраивает правила сезонных и праздничных тегов («Декоративные элементы» на WB) через API. Правила хранятся в БД и применяются автоматически планировщиком (если включён `tag_scheduler_enabled`).

### `GET /api/tag-rules`

Получить все правила с флагом `is_active_today`.

**Ответ (`TagRulesListResponse`):**
```json
{
  "rules": [
    {
      "id": "uuid",
      "tags": ["23 февраля"],
      "gender": ["Мужской"],
      "activate":   { "month": 2, "day": 9  },
      "deactivate": { "month": 2, "day": 24 },
      "managed_variants": [],
      "is_active_today": false
    },
    {
      "id": "uuid",
      "tags": ["зимние"],
      "gender": null,
      "activate":   { "month": 11, "day": 15 },
      "deactivate": { "month": 2,  "day": 15 },
      "managed_variants": ["зимний", "зимняя"],
      "is_active_today": true
    }
  ],
  "managed_tags": ["23 февраля", "зимние", "зимний", "зимняя"]
}
```

### `POST /api/tag-rules` (201)

Создать правило.

**Запрос (`TagRuleRequest`):**
```json
{
  "tags": ["День влюблённых"],
  "gender": null,
  "activate":   { "month": 2, "day": 1 },
  "deactivate": { "month": 2, "day": 15 },
  "managed_variants": []
}
```

**Ответ:** `TagRuleResponse` с `id` и `is_active_today`.

### `PUT /api/tag-rules/{rule_id}`

Обновить правило. **Запрос:** как POST. **Ответ:** обновлённый `TagRuleResponse`. **404** если не найдено.

### `DELETE /api/tag-rules/{rule_id}`

Удалить правило.

**Ответ:** `{ "ok": true, "message": "Правило uuid удалено" }`.

### `POST /api/tag-rules/preview`

Превью изменений тегов на указанную дату (dry-run, без обращений к WB API).

**Query:** `target_date` (YYYY-MM-DD, по умолчанию — сегодня).

**Ответ:**
```json
{
  "date": "2026-03-08",
  "active_rules": ["8 марта", "весенние"],
  "total_products": 834,
  "products_with_gender": 791,
  "changes_needed": 45,
  "changes": [
    {
      "sku": 203873004,
      "title": "Носки женские...",
      "gender": "Женский",
      "current_tags": ["для дома"],
      "new_tags": ["для дома", "8 марта", "весенние"],
      "add": ["8 марта", "весенние"],
      "remove": []
    }
  ]
}
```

---

## Мониторинг и автообработка

### `GET /api/content/approvals/history`

История публикаций с фильтрацией.

**Query параметры:**
| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|---------|
| `marketplace` | string | — | `wb` / `ozon` / `ym` |
| `source` | string | — | `manual` / `auto` |
| `status` | string | — | `success` / `failed` |
| `limit` | int | 50 | 1–500 |
| `offset` | int | 0 | ≥ 0 |

**Ответ (`ApprovalHistoryResponse`):**
```json
{
  "total": 120,
  "limit": 50,
  "offset": 0,
  "has_more": true,
  "items": [
    {
      "id": "uuid",
      "sku": "203873004",
      "vendor_code": "16378",
      "marketplace": "wb",
      "title": "Название",
      "description": "Описание",
      "current_score": 85,
      "status": "success",
      "source": "manual",
      "published_at": "2026-04-08T12:34:56Z"
    }
  ]
}
```

**Публикация склейки = несколько записей.** При утверждении контента для нескольких товаров склейки создаётся **отдельная запись на каждую обновлённую карточку** (свой `sku` = nmID и свой `vendor_code`). Поэтому в истории все товары склейки отображаются как отдельные строки — дополнительных полей для этого не требуется.

---

### `GET /api/auto-process/content/preview`

Превью товаров с низким скором контента (dry-run) — кандидаты на автообработку.

**Query параметры:**
| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|---------|
| `marketplace` | string | — | `wb` / `ozon` / `ym` (без параметра — все МП) |
| `limit` | int | 50 | 1–500 |
| `offset` | int | 0 | ≥ 0 |

**Ответ:** список товаров с `score < auto_check_threshold`, отсортированных по score (худшие первые).

```json
{
  "enabled": false,
  "threshold": 98,
  "total_below_threshold": 9,
  "limit": 50,
  "offset": 0,
  "has_more": false,
  "products": [
    {
      "sku": "400541429",
      "vendor_code": "16378",
      "marketplace": "ozon",
      "title": "Текущее название",
      "description": "Текущее описание",
      "current_score": 48,
      "status": "ожидает",
      "rating": 4.86,
      "rating_count": 73,
      "reviews_count": 301
    },
    {
      "sku": "203873004",
      "vendor_code": "16378",
      "marketplace": "wb",
      "title": "Текущее название",
      "description": "Текущее описание",
      "current_score": 52,
      "status": "ожидает",
      "rating": 4.58
    }
  ]
}
```

**Оценка товара по отзывам** (у каждого товара в `products[]`):
- `rating` — средний рейтинг по отзывам (`null`, если оценок нет).
- `rating_count` — количество **оценок** (звёзд), `0` если нет.
- `reviews_count` — количество **текстовых отзывов**, `0` если нет.

> **Wildberries:** у WB-товаров возвращается **только `rating`** — без `rating_count` и `reviews_count` (см. WB-элемент в примере выше). Для **Ozon** и **Яндекс Маркета** — все три поля. Список мультимаркетплейсный, маркетплейс каждого товара указан в поле `marketplace`.

---

## Ошибки маркетплейсов

### `GET /api/content/wb/errors`

Ошибки модерации WB (алиас для `/{marketplace}/errors` с `marketplace=wb`).

**Query:** `sku` (int, optional).

### `GET /api/content/{marketplace}/errors`

Ошибки модерации на любом маркетплейсе.

**Path:** `marketplace` — `wb` / `ozon` / `ym`.
**Query:** `sku` (int, optional).

**Ответ (`WBCardErrorsResponse`):**
```json
{
  "sku": 203873004,
  "errors_count": 1,
  "errors": [
    {
      "nmID": 203873004,
      "vendorCode": "16378",
      "error": "Измените значения полей «Артикул продавца»",
      "batchUUID": "uuid",
      "updatedAt": "2026-04-08T12:34:56Z"
    }
  ],
  "has_errors": true
}
```

---

## Настройки и мониторинг токенов

### `GET /api/settings`

Получить текущие настройки приложения и статус токенов маркетплейсов.

**Ответ (`SettingsResponse`):**
```json
{
  "auto_check_threshold": 98,
  "auto_check_interval": "weekly",
  "auto_check_enabled": false,
  "tag_scheduler_enabled": false,
  "wb_token": "abc1***",
  "ozon_client_id": "1234***",
  "ozon_api_key": "abcd***",
  "ym_api_key": "ACMA***",
  "ym_business_id": "123456",
  "tokens_status": {
    "wb":   { "marketplace": "wb",   "status": "expiring_soon", "configured": true,  "expires_at": "2026-03-25T14:30:00+00:00", "days_remaining": 27, "message": "WB токен истекает через 27 дней", "checked_at": "2026-02-27T12:00:00+00:00" },
    "ozon": { "marketplace": "ozon", "status": "active",        "configured": true,  "expires_at": null,                         "days_remaining": null, "message": "Ozon токен активен (бессрочный)", "checked_at": "2026-02-27T12:00:00+00:00" },
    "ym":   { "marketplace": "ym",   "status": "not_configured","configured": false, "expires_at": null,                         "days_remaining": null, "message": "Яндекс Маркет credentials не настроены", "checked_at": "2026-02-27T12:00:00+00:00" },
    "checked_at": "2026-02-27T12:00:00+00:00",
    "has_warnings": true
  }
}
```

Все токены **маскируются** в ответах (первые 4 символа + `***`).

#### Мониторинг токенов

Поле `tokens_status` обновляется фоновым планировщиком каждые **12 часов**. Первая проверка происходит через ~10 секунд после старта приложения.

| Маркетплейс | Метод проверки | Срок действия |
|-------------|---------------|--------------|
| **WB** | Декодирование JWT (`exp`) | 180 дней |
| **Ozon** | Тестовый `POST /v3/product/list` (limit=1) | Бессрочный |
| **YM** | Тестовый `POST /businesses/{id}/offer-mappings` (limit=1) | Бессрочный |

**Значения `status`:**
| Статус | Описание |
|--------|---------|
| `active` | Токен работает |
| `expiring_soon` | Только WB: < 30 дней |
| `critical` | Только WB: < 7 дней |
| `expired` | Только WB: JWT `exp` в прошлом |
| `invalid` | Токен существует, API вернул 401/403 |
| `error` | Сетевая/таймаут-ошибка при проверке |
| `not_configured` | Токен отсутствует или пуст |

Если `tokens_status: null` — первая проверка ещё не завершена.

---

### `PUT /api/settings`

Частичное обновление настроек.

**Запрос (`SettingsUpdateRequest`):**
```json
{
  "auto_check_threshold": 95,
  "wb_token": "new_token_value",
  "ozon_client_id": "new_client_id",
  "ozon_api_key": "new_api_key"
}
```

Все поля опциональны. Значения, содержащие `***` (маскированные), **игнорируются** — чтобы случайно не перезаписать реальный токен.

| Поле | Тип | Описание |
|------|-----|---------|
| `auto_check_threshold` | int (0–100) | Порог качества для автопроверки |
| `auto_check_interval` | string | `daily` / `every_2_days` / `weekly` / `every_2_weeks` / `monthly` |
| `auto_check_enabled` | bool | Включить автопроверку контента |
| `tag_scheduler_enabled` | bool | Включить планировщик сезонных тегов |
| `wb_token` | string | WB API-токен |
| `ozon_client_id` | string | Ozon Seller Client ID |
| `ozon_api_key` | string | Ozon Seller API Key |
| `ym_api_key` | string | Яндекс Маркет API Key |
| `ym_business_id` | string | Яндекс Маркет Business ID |

**Ответ:** `SettingsResponse` (как в `GET`).

---

## Ключевые концепции

### Валидация

Контент проверяется автоматически:
- Ограничения по символам для каждого МП (title max, description min/max).
- Запрещённые слова (превосходные степени, гарантии, маркетинговые слова).
- URL, домены, email, телефоны, ссылки на Telegram.
- HTML-теги.
- Повтор / спам одного слова (> 4% текста).

**Автокоррекция:** если AI сгенерировал контент с ошибками валидации, система один раз повторяет вызов AI с промтом-исправителем. Информация попадает в `validation_fixes` ответа генерации.

### Ограничения маркетплейсов

| Маркетплейс | Title max | Description min | Description max |
|-------------|-----------|-----------------|-----------------|
| WB | 60 | 1 000 | 5 000 |
| Ozon | 255 | 100 | 6 000 |
| YM | 150 | 100 | 3 000 |

### Обработка склеек (групп товаров)

Товары с одинаковым `imt_id` можно обрабатывать тремя способами:

1. **Отдельно** (по умолчанию) — генерация/approve для одного SKU.
2. **Для выбранных товаров** (`selected_skus`) — одинаковый контент для списка SKU из склейки.
3. **Для всей склейки** (`generate_for_group: true`) — один title/description для всех товаров в `imt_id`.

`selected_skus` сохраняется в черновике (`content_drafts`) при генерации и используется позже при approve, поэтому передавать его повторно в запросе approve не нужно.

При утверждении (`/approve`) выбор карточек определяется по приоритету:
1. **`selected_skus` из черновика** — обновляются все выбранные при генерации SKU склейки (даже если в запросе approve флаги не переданы).
2. **`update_all_in_group: true`** — обновляются все карточки склейки (по `imt_id`).
3. **по умолчанию** — обновляется только один SKU черновика.

`regenerate` наследует `selected_skus` из предыдущего черновика, если не передать новый список, — режим «выбранные товары» сохраняется между перегенерациями.

При публикации нескольких карточек склейки в `content_publications` создаётся **отдельная запись на каждую обновлённую карточку** (свой `sku` = nmID, свой `vendor_code`). Поэтому в истории (`/api/content/approvals/history`) все товары склейки видны как самостоятельные строки. В ответе `/approve` все обновлённые карточки перечислены в `updated_nm_ids`.

### SEO-анализ

Ответы генерации содержат `analysis` с тремя метриками (0–100):
- **title_quality** — релевантность, длина, ключевые слова названия.
- **description_quality** — полнота, плотность ключевых слов, структура.
- **foreign_words** — штраф за не-русские термины.

`total_score` — общая оценка. `comparison` содержит `improvements` по каждой метрике (ДО / ПОСЛЕ) и список исправленных ошибок валидации.

### Источники публикации (`source`)

- `manual` — менеджер проверил и утвердил.
- `auto` — автоматическое утверждение (фоновым процессом).

### Медиафайлы — жизненный цикл

Статусы: `draft` → `uploading` → `active` (или `failed`) → `deleted` (soft).
Источники: `user_upload`, `marketplace` (pull из МП), `ai_generated`.

### Шаблоны фотографий

Двухуровневая структура: **категории** → **шаблоны**.
Шаблоны бывают типов `size_chart`, `care_instruction`, `guarantee`, `return_policy`, `material_composition`, `brand_badge`, `measurement_guide`, `custom`.
Применяются к товарам поштучно (`apply-single`), списком (`apply`) или всей категорией (`categories/{id}/apply`). Параметр `scope` позволяет распространить применение на всю склейку.

### Сертификаты

PDF-файлы хранятся в `uploads/certificates/` на сервере. Soft-delete: файл удаляется с диска только если нет других ссылок из группы. Проверка — через `GET /api/certificates/{id}` (`has_certificate: true/false`, не 404).

### Правила сезонных тегов

Менеджер задаёт правила вида «с 1 по 15 февраля товарам с `gender = Женский` добавить тег `8 марта`». Планировщик (если `tag_scheduler_enabled = true`) раз в сутки применяет активные правила через WB API. Превью — через `POST /api/tag-rules/preview?target_date=YYYY-MM-DD`.

### Кастомные промты

Каждому маркетплейсу можно переопределить любой из 6 типов промтов (system, generation, regeneration и их group-варианты, fix). Ключ хранения в БД: `content_{marketplace}_{instruction_type}`. При удалении кастомизации (`DELETE`) используется дефолтное значение из `app/prompts/content_prompts.py`.

---

## Сводная таблица всех эндпоинтов

| # | Метод | Путь |
|---|-------|------|
| 1 | GET | `/` |
| 2 | GET | `/health` |
| 3 | GET | `/ready` |
| 4 | GET | `/api/content/product` |
| 5 | GET | `/api/content/search` |
| 6 | POST | `/api/content/generate` |
| 7 | POST | `/api/content/regenerate` |
| 8 | POST | `/api/content/drafts/{draft_id}/approve` |
| 9 | GET | `/api/content/wb/errors` |
| 10 | GET | `/api/content/{marketplace}/errors` |
| 11 | GET | `/api/content/approvals/history` |
| 12 | GET | `/api/content/prompts` |
| 13 | GET | `/api/content/prompts/{instruction_type}` |
| 14 | PUT | `/api/content/prompts/{instruction_type}` |
| 15 | DELETE | `/api/content/prompts/{instruction_type}` |
| 16 | GET | `/api/settings` |
| 17 | PUT | `/api/settings` |
| 18 | GET | `/api/auto-process/content/preview` |
| 19 | GET | `/api/media/{external_id}/list` |
| 20 | POST | `/api/media/{external_id}/upload` |
| 21 | POST | `/api/media/{external_id}/upload-batch` |
| 22 | DELETE | `/api/media/{external_id}/media/{media_id}` |
| 23 | PATCH | `/api/media/{external_id}/reorder` |
| 24 | POST | `/api/media/{external_id}/sync` |
| 25 | POST | `/api/v1/templates/categories` |
| 26 | GET | `/api/v1/templates/categories` |
| 27 | POST | `/api/v1/templates/categories/{category_id}/templates` |
| 28 | GET | `/api/v1/templates/categories/{category_id}/templates` |
| 29 | GET | `/api/v1/templates/templates/{template_id}` |
| 30 | POST | `/api/v1/templates/templates/{template_id}/apply` |
| 31 | POST | `/api/v1/templates/templates/{template_id}/apply-single` |
| 32 | POST | `/api/v1/templates/categories/{category_id}/apply` |
| 33 | GET | `/api/v1/templates/categories/{category_id}/stats` |
| 34 | GET | `/api/v1/templates/stats` |
| 35 | GET | `/api/v1/templates/health` |
| 36 | GET | `/api/tag-rules` |
| 37 | POST | `/api/tag-rules` |
| 38 | PUT | `/api/tag-rules/{rule_id}` |
| 39 | DELETE | `/api/tag-rules/{rule_id}` |
| 40 | POST | `/api/tag-rules/preview` |
| 41 | GET | `/api/certificates/{external_id}` |
| 42 | POST | `/api/certificates/{external_id}` |
| 43 | DELETE | `/api/certificates/{external_id}` |
| 44 | GET | `/api/certificates/{external_id}/file` |

**Итого:** 44 эндпоинта. Дополнительно 8 эндпоинтов в модуле шаблонов возвращают **501 Not Implemented** (CRUD категорий, CRUD шаблонов, история применений).

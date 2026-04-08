# ADOLF Content Factory REST API Справочник (v1.4)

## Обзор

Content Factory — это FastAPI-сервис, предназначенный для генерации SEO-оптимизированного контента карточек товаров маркетплейсов с помощью Claude Sonnet 4.5. Поддерживает интеграции с Wildberries, Ozon и Яндекс Маркет.

**Base URL:** `http://<host>:3000`
**Swagger UI:** `GET /docs`

---

## История версий

| Версия | Дата | Изменения |
|--------|------|----------|
| **v1.4** | 2026-04-08 | ✨ Реализованы эндпоинты сертификатов (`/api/certificates`), управление правилами тегов (`/api/tag-rules`). Правила сезонных/праздничных тегов теперь настраиваются через API. |
| **v1.3** | 2026-04-07 | ✨ Добавлены эндпоинты медиафайлов, шаблонов и сертификатов. Новые параметры `generate_for_group` и `selected_skus`. Поле `vendor_code` во всех ответах. |
| **v1.2** | 2026-02-27 | Полный переводом на русский, мониторинг токенов маркетплейсов |
| **v1.1** | 2026-01-15 | Добавлена поддержка Ozon и Яндекс Маркета |
| **v1.0** | 2026-01-01 | Первый релиз (только Wildberries) |

---

## Оглавление

1. [Информация о сервисе](#информация-о-сервисе)
2. [Данные товаров](#данные-товаров)
3. [Генерация контента](#генерация-контента)
4. [Публикация](#публикация)
5. [Управление медиафайлами](#управление-медиафайлами)
6. [Шаблоны фотографий](#шаблоны-фотографий)
7. [Сертификаты товаров](#сертификаты-товаров)
8. [Управление правилами тегов](#управление-правилами-тегов)
9. [Мониторинг](#мониторинг)
10. [Эндпоинты маркетплейсов](#эндпоинты-маркетплейсов)
11. [Настройки и мониторинг токенов](#настройки-и-мониторинг-токенов)
12. [Ключевые концепции](#ключевые-концепции)

---

### `GET /`

Описание сервиса и текущая версия.

**Ответ:**
```json
{
  "service": "Content Factory",
  "version": "1.4.0",
  "status": "running"
}
```

### `GET /health`

Проверка статуса системы.

### `GET /ready`

Проверка готовности (включая подключение к БД).

---

## Данные товаров

### `GET /api/content/product`

Получить оригинальные данные товара из БД с валидацией и SEO-анализом.

**Query параметры:**
| Параметр | Тип | Обязательно | Описание |
|----------|-----|------------|---------|
| `url` | string | Один из (url/sku) | URL товара на маркетплейсе |
| `sku` | string | Один из (url/sku) | SKU товара (nmID) или vendor_code |
| `marketplace` | string | Нет | `wb` / `ozon` / `ym` (автоопределяется из URL) |

**Пример запроса:**
```
GET /api/content/product?sku=203873004&marketplace=wb
GET /api/content/product?sku=16378&marketplace=wb
GET /api/content/product?url=https://www.wildberries.ru/catalog/123456789/detail.aspx
```

**Ответ:** Данные товара, включая `products[]` (все товары в группе/склейке), `validation`, `analysis` оценки, `imt_id`, `group_count`.

**Поддержка склеек:** Если товар входит в группу (несколько цветов/вариантов), возвращает данные всех товаров с одинаковым `imt_id`.

### `GET /api/content/search`

Поиск товаров по артикулу (SKU или vendor_code) в одном или всех маркетплейсах.

**Поддерживает два сценария:**
1. **Поиск по всем маркетплейсам** — возвращает товары из WB, Ozon, Яндекс Маркета
2. **Поиск в конкретном маркетплейсе** — возвращает товары только из указанного МП

**Query параметры:**
| Параметр | Тип | Обязательно | По умолчанию | Описание |
|----------|-----|------------|-------------|---------|
| `query` | string | Да | — | Артикул для поиска: SKU или vendor_code (1-50 символов) |
| `marketplace` | string | Нет | — | Фильтр по маркетплейсу: `wb` / `ozon` / `ym`. Без параметра — ищет по всем. |
| `limit` | integer | Нет | 50 | Товаров на странице (1-500) |
| `offset` | integer | Нет | 0 | Смещение для пагинации |

**Примеры запросов:**
```
# Поиск по всем маркетплейсам
GET /api/content/search?query=203873004

# Поиск в конкретном МП с пагинацией
GET /api/content/search?query=16378&marketplace=wb&limit=20&offset=40
```

**Ответ:**
```json
{
  "query": "203873004",
  "marketplace": "wb",
  "total_count": 1,
  "limit": 50,
  "offset": 0,
  "products": [
    {
      "external_id": "203873004",
      "vendor_code": "16378",
      "marketplace": "wb",
      "title": "Синие носки мужские набор 5 пар хлопок",
      "brand_tag": "MyBrand",
      "imt_id": 12345678,
      "updated_at": "2026-02-12T15:30:00Z"
    }
  ]
}
```

**Поля товара в результатах:**
| Поле | Тип | Описание |
|------|-----|---------|
| `external_id` | string | SKU товара на маркетплейсе (nmID для WB) |
| `vendor_code` | string / null | Артикул продавца |
| `marketplace` | string | Код маркетплейса: `wb`, `ozon`, `ym` |
| `title` | string | Название товара |
| `brand_tag` | string / null | Бренд товара |
| `imt_id` | int / null | ID группы, если товар в склейке (group) |
| `updated_at` | datetime | Дата последнего обновления в БД |

**Алгоритм поиска:**
1. Ищет по `external_id::TEXT LIKE '%query%'` ИЛИ `vendor_code LIKE '%query%'`
2. Приоритет точным совпадениям (показывает их в начале)
3. Применяет фильтр по маркетплейсу (если указан)
4. Возвращает результаты с пагинацией (LIMIT/OFFSET)

**HTTP статус коды:**
- `200 OK` — Поиск выполнен успешно (даже если ничего не найдено)
- `400 Bad Request` — Неверный маркетплейс или query > 50 символов
- `422 Unprocessable Entity` — Ошибка валидации (limit > 500, offset < 0)

**Особенности:**
- Пустой результат возвращает `total_count: 0` и `products: []` (это не ошибка)
- Поиск регистронечувствителен (SQL LIKE)
- Поддерживает частичное совпадение (например, query="203" найдёт все товары, начинающиеся с "203")
- Если ничего не найдено в выбранном МП, возвращается пустой массив

---

## Генерация контента

### `POST /api/content/generate`

Генерация SEO-названия, описания и тегов для товара с помощью AI.

**Запрос:**
```json
{
  "url": "https://www.wildberries.ru/catalog/123456789/detail.aspx",
  "sku": "123456789",
  "marketplace": "wb",
  "generate_for_group": false,
  "selected_skus": ["123456789", "123456790"]
}
```

**Параметры запроса:**
| Параметр | Тип | Обязательно | По умолчанию | Описание |
|----------|-----|------------|-------------|---------|
| `url` | string | Один из (url/sku) | — | URL товара на маркетплейсе |
| `sku` | string | Один из (url/sku) | — | SKU товара (nmID) |
| `marketplace` | string | Нет | `wb` | Маркетплейс: `wb`, `ozon`, `ym` |
| `generate_for_group` | bool | Нет | `false` | Генерировать одинаковый контент для всей склейки (если `true`, создаёт один title/description для всех вариантов) |
| `selected_skus` | string[] | Нет | — | Список выбранных SKU для генерации (если указан, генерирует одинаковый контент только для выбранных товаров) |

**Ответ:**
```json
{
  "draft_id": "uuid",
  "sku": "123456789",
  "vendor_code": "16378",
  "marketplace": "wb",
  "title": "SEO-название",
  "description": "SEO-описание",
  "seo_tags": ["тег1", "тег2"],
  "model": "claude-sonnet-4-5-20250929",
  "imt_id": 12345678,
  "group_nm_ids": [123456789, 123456790],
  "generated_for_group": false,
  "validation": {
    "is_valid": true,
    "issues": []
  },
  "validation_fix": {
    "was_fixed": false,
    "original_issues": [],
    "fixed_issues": [],
    "remaining_issues": [],
    "fix_attempts": 0
  },
  "analysis": {
    "total_score": 85,
    "is_valid": true,
    "metrics": {
      "title_quality": {
        "name": "Качество названия",
        "score": 90,
        "max_score": 100,
        "status": "good",
        "details": "Название хорошо оптимизировано",
        "issues": []
      }
    }
  },
  "created_at": "2024-01-01T00:00:00Z"
},
  "generate_for_group": false,
  "selected_skus": ["123456789", "123456790"]
}
```

**Параметры запроса:**
| Параметр | Тип | Обязательно | Описание |
|----------|-----|------------|---------|
| `draft_id` | UUID | Да | ID предыдущего черновика |
| `manager_notes` | string | Нет | Пожелания менеджера для перегенерации |
| `generate_for_group` | bool | Нет | Генерировать одинаковый контент для всей склейки |
| `selected_skus` | string[] | Нет | Список выбранных SKU для перегенерации |
**Поля ответа:**
| Поле | Описание |
|------|---------|
| `draft_id` | Уникальный ID сгенерированного черновика |
| `vendor_code` | Артикул продавца (внутренний артикул) |
| `generated_for_group` | Был ли контент сгенерирован для всей склейки |
| `validation_fix` | Информация об автоисправлении валидационных ошибок |
| `analysis` | SEO анализ контента с 3 метриками (title_quality, description_quality, foreign_words) |

**SEO-теги по маркетплейсам:**

| Маркетплейс | Формат SEO-тегов | Куда отправляются при публикации |
|-------------|------------------|--------------------------------|
| **WB** | Поисковые фразы, 10-15 штук (напр. `"Футболка женская"`) | Поле «Комплектация» на карточке WB |
| **Ozon** | Хештеги через `_`, 5-10 штук (напр. `"халат_женский_ohana"`) | Поле `keywords` через Ozon Seller API |
| **YM** | Не генерируются (YM не поддерживает кастомные теги) | — |

> **Ozon:** SEO-теги генерируются как хештеги — слова через нижнее подчёркивание, без `#`, строчные, максимум 30 символов каждый. К каждому тегу автоматически добавляется бренд товара. При публикации теги отправляются в поле `keywords` карточки через `POST /v1/product/import-by-sku`.

### `POST /api/content/regenerate`

Перегенерация контента с учётом обратной связи менеджера и/или предыдущего контекста.

**Запрос:**
```json
{
  "draft_id": "uuid",
  "manager_notes": "Сделай описание с акцентом на натуральность",
  "generate_for_group": false,
  "selected_skus": ["123456789", "123456790"]
}
```

**Параметры запроса:**
| Параметр | Тип | Обязательно | Описание |
|----------|-----|------------|---------|
| `draft_id` | UUID | Да | ID предыдущего черновика |
| `manager_notes` | string | Нет | Пожелания менеджера для перегенерации |
| `generate_for_group` | bool | Нет | Генерировать одинаковый контент для всей склейки |
| `selected_skus` | string[] | Нет | Список выбранных SKU для перегенерации |

**Ответ:** Такая же структура как `/generate` (новый `draft_id`).

---

## Публикация

### `POST /api/content/drafts/{draft_id}/approve`

Утвердить черновик и опубликовать на маркетплейс.

**Запрос:**
```json
{
  "title": "Финальное название",
  "description": "Финальное описание",
  "seo_tags": ["тег1", "тег2"],
  "update_all_in_group": false,
  "source": "manual"
}
```

| Поле | Тип | Обязательно | Описание |
|------|-----|------------|---------|
| `title` | string | Да | Финальное название |
| `description` | string | Да | Финальное описание |
| `seo_tags` | string[] | Нет | SEO теги (WB → «Комплектация», Ozon → `keywords`, YM → игнорируется) |
| `update_all_in_group` | bool | Нет | Обновить все карточки в группе (по умолчанию: `false`) |
| `source` | string | Нет | `manual` (по умолчанию) или `auto` |

**Ответ:**
```json
{
  "success": true,
  "draft_id": "uuid",
  "message": "Карточка успешно обновлена",
  "updated_nm_ids": [123456789]
}
```

> **Примечание:** При `update_all_in_group: true` будут обновлены все SKU в группе товаров (по `imt_id`). Поле `updated_nm_ids` будет содержать список всех обновлённых nmID.

---

### `GET /api/media/{external_id}/list`

Получить все медиафайлы (фото и видео) товара.

**Path параметры:**
| Параметр | Описание |
|----------|---------|
| `external_id` | SKU товара (nmID для WB) |

**Query параметры:**
| Параметр | Тип | Обязательно | Описание |
|----------|-----|------------|---------|
| `marketplace` | string | Да | `wb`, `ozon`, `ym` |

**Пример запроса:**
```
GET /api/media/203873004/list?marketplace=wb
```

**Ответ:**
```json
{
  "external_id": 203873004,
  "marketplace": "wb",
  "total_count": 5,
  "media": [
    {
      "id": "uuid",
      "type": "photo",
      "url": "https://basket-01.wb.ru/vol123/part456/photo.webp",
      "position": 0,
      "size_bytes": 245632,
      "uploaded_at": "2026-02-01T10:30:00Z"
    },
    {
      "id": "uuid",
      "type": "video",
      "url": "https://example.com/video.mp4",
      "position": 1,
      "duration_seconds": 15,
      "uploaded_at": "2026-02-01T10:35:00Z"
    }
  ]
}
```

---

### `POST /api/media/{external_id}/upload`

Загрузить новое фото или видео для товара.

**Path параметры:**
| Параметр | Описание |
|----------|---------|
| `external_id` | SKU товара |

**Form параметры:**
| Параметр | Тип | Обязательно | Описание |
|----------|-----|------------|---------|
| `file` | file | Да | Файл фото (JPG/PNG/WebP) или видео (MP4/WebM) |
| `marketplace` | string | Да | `wb`, `ozon`, `ym` |
| `position` | integer | Нет | Позиция в галерее (0 = первое фото) |

**Пример запроса:**
```bash
curl -X POST http://localhost:3000/api/media/203873004/upload \
  -F "file=@photo.jpg" \
  -F "marketplace=wb" \
  -F "position=0"
```

**Ответ:**
```json
{
  "success": true,
  "media_id": "uuid",
  "external_id": 203873004,
  "marketplace": "wb",
  "type": "photo",
  "position": 0,
  "size_bytes": 245632,
  "uploaded_at": "2026-02-01T10:30:00Z"
}
```

---

### `PATCH /api/media/{external_id}/reorder`

Переупорядочить медиафайлы (drag-drop).

**Path параметры:**
| Параметр | Описание |
|----------|---------|
| `external_id` | SKU товара |

**Запрос:**
```json
{
  "external_id": 203873004,
  "marketplace": "wb",
  "media_ids": ["uuid1", "uuid2", "uuid3"]
}
```

| Параметр | Тип | Описание |
|----------|-----|---------|
| `external_id` | int | SKU товара |
| `marketplace` | string | `wb`, `ozon`, `ym` |
| `media_ids` | string[] | Новый порядок ID медиафайлов |

**Ответ:**
```json
{
  "success": true,
  "external_id": 203873004,
  "marketplace": "wb",
  "reordered_count": 3,
  "new_order": ["uuid1", "uuid2", "uuid3"]
}
```

---

### `DELETE /api/media/{external_id}/media/{media_id}`

Удалить медиафайл.

**Path параметры:**
| Параметр | Описание |
|----------|---------|
| `external_id` | SKU товара |
| `media_id` | ID медиафайла (UUID) |

**Query параметры:**
| Параметр | Тип | Описание |
|----------|-----|---------|
| `marketplace` | string | `wb`, `ozon`, `ym` |

**Пример запроса:**
```
DELETE /api/media/203873004/media/uuid?marketplace=wb
```

**Ответ:**
```json
{
  "success": true,
  "media_id": "uuid",
  "external_id": 203873004,
  "marketplace": "wb",
  "message": "Медиафайл удалён"
}
```

---

## Шаблоны фотографий

### `GET /api/v1/templates/categories`

Получить список категорий шаблонов.

**Query параметры:**
| Параметр | Тип | Описание |
|----------|-----|---------|
| `marketplace` | string | Фильтр по маркетплейсу (опционально) |

**Ответ:**
```json
{
  "total": 5,
  "categories": [
    {
      "id": "uuid",
      "name": "Футболки женские",
      "slug": "women-t-shirts",
      "marketplace": "wb",
      "templates_count": 12,
      "created_at": "2026-01-15T10:00:00Z"
    }
  ]
}
```

---

### `POST /api/v1/templates`

Создать новый шаблон фотографий.

**Запрос:**
```json
{
  "category_id": "uuid",
  "name": "Белый фон, 3 фото",
  "description": "Фотографии товара на белом фоне",
  "marketplace": "wb",
  "photo_structure": [
    {
      "position": 0,
      "description": "Фото товара спереди",
      "recommended_size": "800x800"
    },
    {
      "position": 1,
      "description": "Фото деталей",
      "recommended_size": "800x800"
    }
  ]
}
```

**Ответ:**
```json
{
  "id": "uuid",
  "category_id": "uuid",
  "name": "Белый фон, 3 фото",
  "marketplace": "wb",
  "status": "active",
  "photos_count": 2,
  "created_at": "2026-02-01T10:00:00Z"
}
```

---

### `POST /api/v1/templates/apply`

Применить шаблон фотографий к товару.

**Запрос:**
```json
{
  "product_external_id": 203873004,
  "template_id": "uuid",
  "marketplace": "wb",
  "apply_to_group": false
}
```

| Параметр | Тип | Описание |
|----------|-----|---------|
| `product_external_id` | int | SKU товара |
| `template_id` | UUID | ID шаблона |
| `marketplace` | string | `wb`, `ozon`, `ym` |
| `apply_to_group` | bool | Применить ко всей склейке (если `true`) |

**Ответ:**
```json
{
  "success": true,
  "product_external_id": 203873004,
  "template_id": "uuid",
  "marketplace": "wb",
  "message": "Шаблон успешно применён",
  "applied_to_products": [203873004]
}
```

---

## Сертификаты товаров

### `GET /api/certificates/{external_id}`

Проверить наличие сертификата у товара. Возвращает `has_certificate: true/false` (не 404).

**Path параметры:**
| Параметр | Описание |
|----------|---------|
| `external_id` | SKU товара (nmID) |

**Query параметры:**
| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|---------|
| `marketplace` | string | `wb` | `wb`, `ozon`, `ym` |

**Пример запроса:**
```
GET /api/certificates/203873004?marketplace=wb
```

**Ответ (сертификат есть):**
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

**Ответ (сертификата нет):**
```json
{
  "external_id": 203873004,
  "marketplace": "wb",
  "has_certificate": false,
  "certificate_name": null,
  "expire_date": null,
  "file_url": null
}
```

---

### `POST /api/certificates/{external_id}`

Загрузить сертификат (PDF) для товара. При `apply_to_group=true` применяется ко всей склейке.

**Path параметры:**
| Параметр | Описание |
|----------|---------|
| `external_id` | SKU товара |

**Form параметры (multipart/form-data):**
| Параметр | Тип | Обязательно | По умолчанию | Описание |
|----------|-----|------------|-------------|---------|
| `file` | file | Да | — | PDF файл сертификата (макс. 10 МБ) |
| `certificate_name` | string | Да | — | Название сертификата |
| `marketplace` | string | Нет | `wb` | `wb`, `ozon`, `ym` |
| `expire_date` | string | Нет | — | Дата истечения (YYYY-MM-DD) |
| `apply_to_group` | bool | Нет | `false` | Применить ко всей склейке |

**Пример запроса:**
```bash
curl -X POST http://localhost:3000/api/certificates/203873004 \
  -F "file=@gost_certificate.pdf" \
  -F "certificate_name=ГОСТ 123-456" \
  -F "expire_date=2027-12-31" \
  -F "marketplace=wb" \
  -F "apply_to_group=true"
```

**Ответ:**
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

Удалить сертификат товара (soft-delete). Файл удаляется с диска, если нет других ссылок.

**Path параметры:**
| Параметр | Описание |
|----------|---------|
| `external_id` | SKU товара |

**Query параметры:**
| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|---------|
| `marketplace` | string | `wb` | `wb`, `ozon`, `ym` |
| `apply_to_group` | bool | `false` | Удалить у всей склейки |

**Пример запроса:**
```
DELETE /api/certificates/203873004?marketplace=wb&apply_to_group=true
```

**Ответ:**
```json
{
  "success": true,
  "message": "Сертификат удалён у 3 товар(ов)",
  "deleted_from": [203873004, 203873005, 203873006]
}
```

---

### `GET /api/certificates/{external_id}/file`

Отдать PDF-файл сертификата для просмотра в браузере (`Content-Disposition: inline`).

**Path параметры:**
| Параметр | Описание |
|----------|---------|
| `external_id` | SKU товара |

**Query параметры:**
| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|---------|
| `marketplace` | string | `wb` | `wb`, `ozon`, `ym` |

**Пример:** Открыть в браузере: `http://localhost:3000/api/certificates/203873004/file?marketplace=wb`

**Ответ:** PDF-файл с `Content-Type: application/pdf`

**HTTP статус коды:**
- `200 OK` — PDF файл
- `404 Not Found` — Сертификат не найден

---

## Управление правилами тегов

Менеджер настраивает правила сезонных и праздничных тегов ("Декоративные элементы" на WB) через API. Правила хранятся в БД и применяются автоматически планировщиком (если включён в настройках).

### `GET /api/tag-rules`

Получить все правила тегов с флагом `is_active_today`.

**Ответ:**
```json
{
  "rules": [
    {
      "id": "uuid",
      "tags": ["23 февраля"],
      "gender": ["Мужской"],
      "activate": {"month": 2, "day": 9},
      "deactivate": {"month": 2, "day": 24},
      "managed_variants": [],
      "is_active_today": false
    },
    {
      "id": "uuid",
      "tags": ["зимние"],
      "gender": null,
      "activate": {"month": 11, "day": 15},
      "deactivate": {"month": 2, "day": 15},
      "managed_variants": ["зимний", "зимняя"],
      "is_active_today": true
    }
  ],
  "managed_tags": ["23 февраля", "зимние", "зимний", "зимняя", "..."]
}
```

**Поля правила:**
| Поле | Тип | Описание |
|------|-----|---------|
| `id` | string | UUID правила (генерируется автоматически) |
| `tags` | string[] | Теги для применения |
| `gender` | string[] / null | Фильтр по полу (`["Мужской"]`, `["Женский"]`, `null` = все) |
| `activate` | object | Дата начала: `{month, day}` |
| `deactivate` | object | Дата окончания: `{month, day}` |
| `managed_variants` | string[] | Дополнительные формы тегов для очистки |
| `is_active_today` | bool | Активно ли правило сегодня |

**`managed_tags`** — полный список тегов, которыми управляет система (вычисляется автоматически из всех `tags` + `managed_variants`).

---

### `POST /api/tag-rules`

Создать новое правило тегов.

**Запрос:**
```json
{
  "tags": ["День влюблённых"],
  "gender": null,
  "activate": {"month": 2, "day": 1},
  "deactivate": {"month": 2, "day": 15},
  "managed_variants": []
}
```

**Ответ:** Созданное правило с `id` и `is_active_today` (HTTP 201).

---

### `PUT /api/tag-rules/{rule_id}`

Обновить правило по UUID.

**Path:** `rule_id` — UUID правила

**Запрос:** Такой же как POST.

**Ответ:** Обновлённое правило.

**HTTP 404** если правило не найдено.

---

### `DELETE /api/tag-rules/{rule_id}`

Удалить правило по UUID.

**Ответ:**
```json
{
  "ok": true,
  "message": "Правило uuid удалено"
}
```

---

### `POST /api/tag-rules/preview`

Превью изменений тегов на указанную дату (dry-run, без обращений к WB API).

**Query параметры:**
| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|---------|
| `target_date` | string | Сегодня | Дата в формате ISO (YYYY-MM-DD) |

**Пример запроса:**
```
POST /api/tag-rules/preview?target_date=2026-03-08
```

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

## Мониторинг

### `GET /api/content/approvals/history`

История публикаций с фильтрацией.

**Query параметры:**
| Параметр | Тип | По умолчанию | Описание |
|----------|-----|------------|---------|
| `marketplace` | string | — | Фильтр по маркетплейсу (`wb` / `ozon` / `ym`) |
| `source` | string | — | Фильтр по источнику (`manual` / `auto`) |
| `limit` | int | 50 | Максимум результатов |
| `offset` | int | 0 | Смещение для пагинации |

### `GET /api/content/{marketplace}/errors`

Ошибки модерации по маркетплейсам.

**Path:** `marketplace` — `wb`, `ozon` или `ym`
**Query:** `?sku=203873004` (опционально)

### `GET /api/auto-process/content/preview`

Предпросмотр товаров с низкими оценками для автоматической обработки.

**Query параметры:**
| Параметр | Тип | По умолчанию | Описание |
|----------|-----|------------|---------|
| `marketplace` | string | `wb` | Целевой маркетплейс |
| `limit` | int | 50 | Максимум результатов |
| `offset` | int | 0 | Смещение для пагинации |

---

## Эндпоинты маркетплейсов

### `GET /api/content/{marketplace}/card/{sku}`

Получить текущее состояние карточки из API маркетплейса.

**Path:** `marketplace` — `wb`, `ozon` или `ym`; `sku` — SKU товара

### `GET /api/content/wb/card-by-vendor/{vendor_code}`

Получить карточку WB по артикулу продавца.

### `GET /api/content/wb/my-cards`

Список всех карточек продавца на WB (для диагностики). **Query:** `?limit=50`

---

## Настройки и мониторинг токенов

### `GET /api/settings`

Получить текущие настройки приложения, включая **мониторинг статуса токенов маркетплейсов**.

**Ответ:**
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
    "wb": {
      "marketplace": "wb",
      "status": "expiring_soon",
      "configured": true,
      "expires_at": "2026-03-25T14:30:00+00:00",
      "days_remaining": 27,
      "message": "WB токен истекает через 27 дней",
      "checked_at": "2026-02-27T12:00:00+00:00"
    },
    "ozon": {
      "marketplace": "ozon",
      "status": "active",
      "configured": true,
      "expires_at": null,
      "days_remaining": null,
      "message": "Ozon токен активен (бессрочный)",
      "checked_at": "2026-02-27T12:00:00+00:00"
    },
    "ym": {
      "marketplace": "ym",
      "status": "not_configured",
      "configured": false,
      "expires_at": null,
      "days_remaining": null,
      "message": "Яндекс Маркет credentials не настроены",
      "checked_at": "2026-02-27T12:00:00+00:00"
    },
    "checked_at": "2026-02-27T12:00:00+00:00",
    "has_warnings": true
  }
}
```

Все значения токенов **скрыты** в ответах (первые 4 символа + `***`).

#### Мониторинг токенов

Поле `tokens_status` заполняется фоновым планировщиком, запускаемым каждые **12 часов**. При запуске приложения первая проверка происходит через ~10 секунд.

**Как проверяется каждый токен:**

| Маркетплейс | Метод | Срок действия |
|-------------|-------|--------------|
| **WB** | Декодирование JWT (параметр `exp`) | 180 дней с момента создания |
| **Ozon** | Тестовый вызов API (`POST /v3/product/list` с limit=1) | Неограниченный (до удаления) |
| **YM** | Тестовый вызов API (`POST /businesses/{id}/offer-mappings` с limit=1) | Неограниченный (до удаления) |

**Значения статуса токена:**

| Статус | Описание |
|--------|---------|
| `active` | Токен активен и работает |
| `expiring_soon` | Только WB: менее 30 дней осталось |
| `critical` | Только WB: менее 7 дней осталось |
| `expired` | Только WB: параметр JWT `exp` в прошлом |
| `invalid` | Токен существует, но API вернул 401/403 |
| `error` | Токен существует, но вызов API не удался (сеть/таймаут) |
| `not_configured` | Токен отсутствует или пуст |

Если `tokens_status` равен `null`, первая фоновая проверка ещё не завершена (приложение только что запущилось).

### `PUT /api/settings`

Обновить настройки приложения (поддерживаются частичные обновления).

**Запрос:**
```json
{
  "auto_check_threshold": 95,
  "wb_token": "new_token_value",
  "ozon_client_id": "new_client_id",
  "ozon_api_key": "new_api_key"
}
```

Все поля опциональны. Скрытые значения (содержащие `***`) автоматически пропускаются, чтобы не перезаписывать реальные токены.

**Настраиваемые поля:**

| Поле | Тип | Описание |
|------|-----|---------|
| `auto_check_threshold` | int (0-100) | Порог качества для автоматической проверки |
| `auto_check_interval` | string | `daily`, `every_2_days`, `weekly`, `every_2_weeks`, `monthly` |
| `auto_check_enabled` | bool | Включить/отключить автоматическую проверку контента |
| `tag_scheduler_enabled` | bool | Включить/отключить сезонный планировщик тегов |
| `wb_token` | string | API токен Wildberries |
| `ozon_client_id` | string | Ozon Seller Client ID |
| `ozon_api_key` | string | Ozon Seller API Key |
| `ym_api_key` | string | Яндекс Маркет API Key |
| `ym_business_id` | string | Яндекс Маркет Business ID |

---

## Ключевые концепции

### Фреймворк валидации

Контент проверяется автоматически на:
- Ограничения по символам для каждого маркетплейса (максимум названия, минимум/максимум описания)
- Запрещённые слова (превосходные степени, гарантии, маркетинговые слова)
- URL, домены, email адреса, телефоны, ссылки на Telegram
- HTML теги
- Паттерны повтора/спама (слово > 4% текста)

Автокоррекция: если AI генерирует контент с ошибками валидации, система автоматически повторяет попытку один раз.

### Ограничения маркетплейсов

| Маркетплейс | Максимум названия | Минимум описания | Максимум описания |
|-------------|------------------|-----------------|------------------|
| WB | 60 символов | 1,000 символов | 5,000 символов |
| Ozon | 255 символов | 100 символов | 6,000 символов |
| YM | 150 символов | 100 символов | 3,000 символов |

### Обработка групп (Склейки)

Товары в "склейке" (группе товаров с одинаковым `imt_id`) можно обрабатывать несколькими способами:

1. **Отдельно:** Генерировать/утверждать для одного SKU (по умолчанию)
   ```json
   { "sku": "203873004", "marketplace": "wb" }
   ```

2. **Для выбранных товаров** (параметр `selected_skus`): Генерировать одинаковый контент для конкретного списка SKU
   ```json
   {
     "sku": "203873004",
     "marketplace": "wb",
     "selected_skus": ["203873004", "203873005"]
   }
   ```

3. **Как группу** (параметр `generate_for_group: true`): Создать один контент для всех товаров в склейке
   ```json
   {
     "sku": "203873004",
     "marketplace": "wb",
     "generate_for_group": true
   }
   ```

При утверждении (`POST /approve`):
- `update_all_in_group: false` (по умолчанию) — обновляет только один SKU
- `update_all_in_group: true` — обновляет все карточки в склейке (по `imt_id`)

### Отслеживание публикаций

Поле `source` различает между:
- `manual` — проверено менеджером и утверждено
- `auto` — автоматическое/запланированное утверждение

### SEO-анализ

Ответы генерации включают `analysis` с тремя метриками:
- **Качество названия** — релевантность ключевых слов, оптимизация длины
- **Качество описания** — полнота, плотность ключевых слов
- **Иностранные слова** — обнаружение не-русских терминов

Каждая метрика имеет оценку (0-100), ответ включает `total_score` для общей оценки качества.

### Управление медиафайлами

Система поддерживает загрузку, переупорядочивание и удаление фото/видео товаров:

- **Загрузка:** `POST /api/media/{external_id}/upload` — загрузить новое фото или видео
- **Переупорядочивание:** `PATCH /api/media/{external_id}/reorder` — изменить порядок (drag-drop)
- **Получение списка:** `GET /api/media/{external_id}/list` — получить все медиафайлы товара
- **Удаление:** `DELETE /api/media/{external_id}/media/{media_id}` — удалить медиафайл

Все операции поддерживают применение к группе товаров (параметр `apply_to_group`).

### Шаблоны фотографий

Возможность создавать и применять шаблоны расположения фотографий для товаров:

- **Категории:** `GET /api/v1/templates/categories` — получить список категорий
- **Создание:** `POST /api/v1/templates` — создать новый шаблон
- **Применение:** `POST /api/v1/templates/apply` — применить шаблон к товару (с опцией `apply_to_group`)

### Сертификаты товаров

Управление сертификатами товаров (ГОСТ, ISO и т.д.):

- **Проверка:** `GET /api/certificates/{external_id}` — есть ли сертификат (возвращает `has_certificate: true/false`)
- **Загрузка:** `POST /api/certificates/{external_id}` — загрузить PDF с опцией `apply_to_group` для склейки
- **Просмотр PDF:** `GET /api/certificates/{external_id}/file` — открыть PDF в браузере (inline)
- **Удаление:** `DELETE /api/certificates/{external_id}` — удалить с опцией `apply_to_group`

Сертификаты хранятся как PDF-файлы на сервере (`uploads/certificates/`). Soft-delete: при удалении файл убирается с диска только если на него нет других ссылок (из группы).

### Управление правилами тегов

Правила сезонных и праздничных тегов ("Декоративные элементы" на WB) настраиваются менеджером через API:

- **Список:** `GET /api/tag-rules` — все правила с `is_active_today` и вычисленными `managed_tags`
- **Создание:** `POST /api/tag-rules` — новое правило (теги, пол, даты активации)
- **Редактирование:** `PUT /api/tag-rules/{id}` — обновить правило
- **Удаление:** `DELETE /api/tag-rules/{id}` — удалить правило
- **Превью:** `POST /api/tag-rules/preview?target_date=YYYY-MM-DD` — какие товары изменятся на дату

Правила хранятся в БД (таблица `app_settings`, ключ `tag_rules`). Планировщик (раз в сутки, если включён `tag_scheduler_enabled`) автоматически применяет активные правила через WB API.

# Content Factory API — Контракт для фронтенда

**Base URL:** `http://localhost:3000` (dev) / `https://your-api.com` (prod)

---

## Оглавление

1. [GET /api/content/product](#1-get-apicontentproduct) — данные товара + валидация + анализ
2. [POST /api/content/generate](#2-post-apicontentgenerate) — генерация AI-контента
3. [POST /api/content/regenerate](#3-post-apicontentregenerate) — перегенерация с пожеланиями
4. [POST /api/content/drafts/{draft_id}/approve](#4-post-apicontentdraftsdraft_idapprove) — публикация на WB
5. [GET /api/content/wb/errors](#5-get-apicontentwberrors) — ошибки модерации WB
6. [GET /api/settings](#6-get-apisettings) — получить настройки
7. [PUT /api/settings](#7-put-apisettings) — обновить настройки
8. [GET /api/auto-process/content/preview](#8-get-apiauto-processcontentpreview) — товары для автогенерации

**Типы:**
- [ValidationResult](#validationresult)
- [ContentAnalysis / MetricScore](#contentanalysis)
- [AnalysisComparison](#analysiscomparison)
- [ValidationFix](#validationfix)

---

## 1. GET /api/content/product

Получить данные товара из БД + валидацию + анализ текущего контента.

**Поддерживаются два сценария:**

**Вариант A: По ссылке (маркетплейс определяется автоматически)**
```
GET /api/content/product?url=https://www.wildberries.ru/catalog/123456789/detail.aspx
```

**Вариант B: По маркетплейсу + артикулу (обязательны оба параметра!)**
```
GET /api/content/product?marketplace=wb&sku=123456789
```
или по vendor_code (внутреннему артикулу):
```
GET /api/content/product?marketplace=wb&sku=ABC-001
```

**Query параметры:**
| Параметр | Тип | Обязательно | Описание |
|----------|-----|-----------|---------|
| `url` | string | Нет* | Ссылка на товар (альтернатива sku+marketplace) |
| `sku` | string | Нет* | Артикул товара: nmID или vendor_code |
| `marketplace` | string | Нет* | Маркетплейс: `wb` / `ozon` / `ym` (обязателен если нет url) |

**Примечание:** Требуется либо `url`, либо оба параметра `sku` + `marketplace`. Если указаны оба, используется `url`.

**ВАЖНО:** Когда вы передаёте `marketplace=ozon&sku=ABC-001`, система ищет товар **только** в Ozon с этим vendor_code, а не во всех маркетплейсах.

**Response:**
```json
{
  "sku": "123456789",
  "vendor_code": "ABC-001",
  "title": "Оригинальное название",
  "description": "Оригинальное описание",
  "media_urls": ["https://basket-01.wb.ru/vol123/part456/123456789/images/big/1.webp"],
  "video_url": null,

  "imt_id": 12345678,
  "group_count": 3,
  "products": [
    {
      "sku": "123456789",
      "vendor_code": "ABC-001",
      "main_photo": "https://basket-01.wb.ru/.../1.webp"
    },
    {
      "sku": "123456790",
      "vendor_code": "ABC-002",
      "main_photo": "https://basket-01.wb.ru/.../1.webp"
    }
  ],

  "validation": {
    "is_valid": false,
    "issues": [
      {"field": "description", "message": "Описание слишком короткое (минимум 1000 символов)", "severity": "error"}
    ]
  },

  "analysis": {
    "total_score": 45,
    "is_valid": false,
    "metrics": {
      "title_quality": {
        "name": "Качество названия",
        "score": 60,
        "max_score": 100,
        "status": "warning",
        "details": "Название короткое, мало ключевых слов",
        "issues": []
      },
      "description_quality": {
        "name": "Качество описания",
        "score": 30,
        "max_score": 100,
        "status": "error",
        "details": "Описание слишком короткое",
        "issues": [
          {"field": "description", "message": "Минимум 1000 символов", "severity": "error"}
        ]
      },
      "foreign_words": {
        "name": "Иностранные слова",
        "score": 100,
        "max_score": 100,
        "status": "good",
        "details": "Иностранных слов не найдено",
        "issues": []
      }
    }
  }
}
```

**Поля склейки:**
- `imt_id` — ID группы товаров на WB (`null` если товар не в склейке)
- `group_count` — количество товаров в склейке (`1` если без склейки)
- `products` — все товары в склейке (с фото и артикулом продавца)

---

## 2. POST /api/content/generate

Генерация SEO-контента для одного товара с помощью AI.

**Request:**
```json
{
  "sku": "123456789",
  "marketplace": "wb"
}
```

Или через URL:
```json
{
  "url": "https://www.wildberries.ru/catalog/123456789/detail.aspx",
  "marketplace": "wb"
}
```

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `url` | string | нет* | Ссылка на товар |
| `sku` | string | нет* | Артикул товара |
| `marketplace` | string | нет | Маркетплейс (`"wb"` по умолчанию) |

\* Нужно указать `url` или `sku` (что-то одно).

**Response:**
```json
{
  "draft_id": "550e8400-e29b-41d4-a716-446655440000",
  "sku": "123456789",
  "marketplace": "wb",

  "title": "Носки мужские набор 5 пар хлопок спортивные",
  "description": "Мужские носки из натурального хлопка...",
  "seo_tags": ["носки мужские", "набор носков", "хлопковые носки"],

  "imt_id": 12345678,
  "group_nm_ids": [123456789, 123456790],
  "generated_for_group": false,

  "validation": {
    "is_valid": true,
    "issues": []
  },
  "is_valid": true,

  "validation_fixes": null,

  "analysis": {
    "total_score": 92,
    "is_valid": true,
    "metrics": { ... }
  },
  "comparison": {
    "total_before": 45,
    "total_after": 92,
    "improvements": [
      {"metric": "title_quality", "before": 60, "after": 95, "diff": "+35"},
      {"metric": "description_quality", "before": 30, "after": 88, "diff": "+58"}
    ],
    "fixed_errors": ["Описание слишком короткое"]
  },

  "created_at": "2026-02-12T15:30:00Z"
}
```

**Ключевые поля:**
- `draft_id` — ID черновика (нужен для approve и regenerate)
- `validation_fixes` — `null` если автоисправление не потребовалось, иначе объект [ValidationFix](#validationfix)
- `comparison` — сравнение скоров ДО и ПОСЛЕ генерации
- `analysis` — анализ сгенерированного контента

---

## 3. POST /api/content/regenerate

Перегенерация контента с учётом пожеланий менеджера.

**Request:**
```json
{
  "draft_id": "550e8400-e29b-41d4-a716-446655440000",
  "manager_notes": "Сделай описание с акцентом на натуральность материалов. Название не меняй."
}
```

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `draft_id` | UUID | да | ID предыдущего черновика |
| `manager_notes` | string | нет | Пожелания для перегенерации |

**Response:** такой же как [POST /generate](#2-post-apicontentgenerate) (с новым `draft_id`).

---

## 4. POST /api/content/drafts/{draft_id}/approve

Утвердить черновик и отправить на Wildberries.

**Path:** `draft_id` — UUID черновика

**Request:**
```json
{
  "title": "Финальное название товара",
  "description": "Финальное описание товара...",
  "seo_tags": ["носки мужские", "набор носков"]
}
```

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `title` | string | да | Финальное название |
| `description` | string | да | Финальное описание |
| `seo_tags` | string[] | нет | SEO теги (отправляются в «Комплектация» на WB) |

**Response:**
```json
{
  "success": true,
  "draft_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Карточка успешно обновлена на Wildberries",
  "updated_nm_ids": [123456789]
}
```

---

## 5. GET /api/content/wb/errors

Ошибки модерации карточек на Wildberries.

**Query:** `?sku=203873004` (опционально — фильтр по артикулу)

**Response:**
```json
{
  "sku": 203873004,
  "errors_count": 1,
  "errors": [
    {
      "nmID": 203873004,
      "vendorCode": "16378",
      "error": "Текст ошибки модерации",
      "batchUUID": null,
      "updatedAt": "2026-02-10T12:00:00Z"
    }
  ],
  "has_errors": true
}
```

Без `?sku` — возвращает все ошибки всех карточек магазина.

---

## 6. GET /api/settings

Получить текущие настройки.

**Response:**
```json
{
  "auto_check_threshold": 98,
  "auto_check_interval": "weekly",
  "auto_check_enabled": false,
  "tag_scheduler_enabled": false
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `auto_check_threshold` | int (0-100) | Порог скора для автогенерации |
| `auto_check_interval` | string | Периодичность: `daily`, `every_2_days`, `weekly`, `every_2_weeks`, `monthly` |
| `auto_check_enabled` | bool | Включена ли автоматическая проверка |
| `tag_scheduler_enabled` | bool | Включён ли автообработчик сезонных/праздничных тегов |

---

## 7. PUT /api/settings

Обновить настройки. Можно передавать только изменённые поля.

**Request:**
```json
{
  "auto_check_threshold": 95,
  "auto_check_enabled": true
}
```

Все поля опциональные — передаются только те, что нужно обновить.

**Response:** такой же как [GET /api/settings](#6-get-apisettings) (с актуальными значениями после обновления).

---

## 8. GET /api/auto-process/content/preview

Все товары с оценкой ниже порога — кандидаты на автогенерацию контента.

Берёт порог из настроек (`auto_check_threshold`), прогоняет все товары через анализ контента и возвращает те, у которых `current_score < threshold`.

**Response:**
```json
{
  "enabled": false,
  "threshold": 98,
  "total_below_threshold": 25,
  "products": [
    {
      "sku": "203873004",
      "vendor_code": "16378",
      "marketplace": "wb",
      "title": "Носки мужские набор",
      "description": "Носки мужские из хлопка...",
      "current_score": 32,
      "status": "ожидает"
    },
    {
      "sku": "203873005",
      "vendor_code": "16379",
      "marketplace": "wb",
      "title": "Футболка женская оверсайз",
      "description": "Стильная футболка...",
      "current_score": 45,
      "status": "ожидает"
    }
  ]
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `enabled` | bool | Включена ли автогенерация (из настроек) |
| `threshold` | int | Порог скора (из настроек) |
| `total_below_threshold` | int | Количество товаров ниже порога |
| `products[].sku` | string | Артикул товара (nmID) |
| `products[].vendor_code` | string | Артикул продавца |
| `products[].marketplace` | string | Маркетплейс (`"wb"`) |
| `products[].title` | string | Текущее название товара |
| `products[].description` | string | Текущее описание товара |
| `products[].current_score` | int | Текущая оценка контента (0-100) |
| `products[].status` | string | Статус обработки (`"ожидает"`) |

Товары отсортированы по `current_score` — худшие первые.

---

## Типы

### ValidationResult

```typescript
interface ValidationResult {
  is_valid: boolean;       // false если есть хотя бы один error
  issues: ValidationIssue[];
}

interface ValidationIssue {
  field: string;           // "title" | "description"
  message: string;         // Человекочитаемое описание проблемы
  severity: string;        // "error" | "warning" | "info"
}
```

- `is_valid: true` — нет ошибок (severity=error), могут быть warnings
- `is_valid: false` — есть хотя бы одна ошибка

### ContentAnalysis

```typescript
interface ContentAnalysis {
  total_score: number;     // 0-100
  is_valid: boolean;
  metrics: {
    title_quality: MetricScore;
    description_quality: MetricScore;
    foreign_words: MetricScore;
  };
}

interface MetricScore {
  name: string;            // Человекочитаемое название
  score: number;           // 0-100
  max_score: number;       // Всегда 100
  status: string;          // "good" | "warning" | "error"
  details: string;         // Краткое пояснение
  issues: ValidationIssue[];
}
```

### AnalysisComparison

```typescript
interface AnalysisComparison {
  total_before: number;    // Общий скор ДО
  total_after: number;     // Общий скор ПОСЛЕ
  improvements: AnalysisImprovement[];
  fixed_errors: string[];  // Исправленные ошибки
}

interface AnalysisImprovement {
  metric: string;          // "title_quality" | "description_quality" | "foreign_words"
  before: number;
  after: number;
  diff: string;            // "+25"
}
```

### ValidationFix

Присутствует в ответе generate/regenerate если AI сгенерировал контент с ошибками и была попытка автоисправления.

```typescript
interface ValidationFix {
  was_fixed: boolean;              // Были ли применены исправления
  original_issues: ValidationIssue[];  // Ошибки ДО автоисправления
  fixed_issues: ValidationIssue[];     // Исправленные ошибки
  remaining_issues: ValidationIssue[]; // Оставшиеся ошибки
  fix_attempts: number;            // Количество попыток (макс 1)
}
```

---

## Ошибки

Все эндпоинты возвращают ошибки в формате:

```json
{
  "error": "Краткое описание",
  "detail": "Подробности (опционально)"
}
```

| HTTP код | Когда |
|----------|-------|
| 400 | Невалидный запрос (нет sku/url, неверный формат) |
| 404 | Товар не найден / Черновик не найден |
| 500 | Ошибка сервера / AI / WB API |

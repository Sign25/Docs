# ADOLF Content Factory REST API Reference (v1.2)

## Overview

The Content Factory is a FastAPI-based service designed to generate SEO-optimized marketplace product card content using Claude Sonnet 4.5. It supports Wildberries, Ozon, and Яндекс Маркет integrations.

**Base URL:** `http://<host>:3000`
**Swagger UI:** `GET /docs`

---

## Service Information

### `GET /`

Service details and current version.

**Response:**
```json
{
  "service": "Content Factory",
  "version": "1.2.20",
  "status": "running"
}
```

### `GET /health`

System status check.

### `GET /ready`

Readiness check (including database connectivity).

---

## Product Data

### `GET /api/content/product`

Retrieve original product data from DB with validation and SEO analysis.

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | One of url/sku | Marketplace product URL |
| `sku` | string | One of url/sku | Product SKU (nmID) |
| `marketplace` | string | No | `wb` / `ozon` / `ym` (auto-detected from URL) |

**Response:** Product data including `products[]` (all items in group/склейка), `validation`, `analysis` scores, `imt_id`, `group_count`.

**Поддержка склеек:** If a product belongs to a group (several colors/variants), returns data for all products sharing the same `imt_id`.

### `GET /api/content/search`

Search for products by article number (SKU or vendor_code) across all or specific marketplaces.

**Supports two scenarios:**
1. **Search across all marketplaces** — returns products from WB, Ozon, Яндекс Маркет
2. **Search within a specific marketplace** — returns products only from specified MP

**Query Parameters:**
| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `query` | string | Yes | — | SKU or vendor_code to search (1-50 chars) |
| `marketplace` | string | No | — | Filter by marketplace: `wb` / `ozon` / `ym`. Omit to search all. |
| `limit` | integer | No | 50 | Results per page (1-500) |
| `offset` | integer | No | 0 | Pagination offset |

**Example Requests:**
```
# Search all marketplaces
GET /api/content/search?query=203873004

# Search specific marketplace with pagination
GET /api/content/search?query=16378&marketplace=wb&limit=20&offset=40
```

**Response:**
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

**Product Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `external_id` | string | Marketplace SKU (nmID for WB) |
| `vendor_code` | string / null | Seller's article number |
| `marketplace` | string | Marketplace code: `wb`, `ozon`, `ym` |
| `title` | string | Product title |
| `brand_tag` | string / null | Brand name |
| `imt_id` | int / null | Group ID if product belongs to склейка (group) |
| `updated_at` | datetime | Last update time in DB |

**Search Algorithm:**
1. Searches by `external_id::TEXT LIKE '%query%'` OR `vendor_code LIKE '%query%'`
2. Prioritizes exact matches (shows them first)
3. Applies marketplace filter if specified
4. Returns results with pagination (LIMIT/OFFSET)

**Status Codes:**
- `200 OK` — Search completed (even if no results)
- `400 Bad Request` — Invalid marketplace or query > 50 chars
- `422 Unprocessable Entity` — Validation error (limit > 500, offset < 0)

**Notes:**
- Empty results return `total_count: 0` and `products: []` (no error)
- Search is case-insensitive (SQL LIKE query)
- Supports partial matching (e.g., query="203" finds all products starting with "203")
- When searching specific marketplace and no results found, returns empty array

---

## Content Generation

### `POST /api/content/generate`

Generate AI-powered SEO title, description, and tags for a product.

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
  "group_nm_ids": [123456789, 123456790],
  "validation": {
    "is_valid": true,
    "issues": []
  },
  "analysis": { "...": "SEO score metrics" },
  "is_valid": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

**SEO-теги по маркетплейсам:**

| Маркетплейс | Формат SEO-тегов | Куда отправляются при публикации |
|-------------|------------------|--------------------------------|
| **WB** | Поисковые фразы, 10-15 штук (напр. `"Футболка женская"`) | Поле «Комплектация» на карточке WB |
| **Ozon** | Хештеги через `_`, 5-10 штук (напр. `"халат_женский_ohana"`) | Поле `keywords` через Ozon Seller API |
| **YM** | Не генерируются (YM не поддерживает кастомные теги) | — |

> **Ozon:** SEO-теги генерируются как хештеги — слова через нижнее подчёркивание, без `#`, строчные, максимум 30 символов каждый. К каждому тегу автоматически добавляется бренд товара. При публикации теги отправляются в поле `keywords` карточки через `POST /v1/product/import-by-sku`.

### `POST /api/content/regenerate`

Regenerate content with manager feedback and/or previous context.

**Request:**
```json
{
  "draft_id": "uuid",
  "manager_notes": "Сделай описание с акцентом на натуральность"
}
```

**Response:** Same structure as `/generate` (new `draft_id`).

---

## Publishing

### `POST /api/content/drafts/{draft_id}/approve`

Approve a draft and publish to marketplace.

**Request:**
```json
{
  "title": "Финальное название",
  "description": "Финальное описание",
  "seo_tags": ["тег1", "тег2"],
  "update_all_in_group": false,
  "source": "manual"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Final title |
| `description` | string | Yes | Final description |
| `seo_tags` | string[] | No | SEO tags (WB → «Комплектация», Ozon → `keywords`, YM → ignored) |
| `update_all_in_group` | bool | No | Update all cards in group (default: false) |
| `source` | string | No | `manual` (default) or `auto` |

**Response:**
```json
{
  "success": true,
  "draft_id": "uuid",
  "message": "Карточка успешно обновлена",
  "updated_nm_ids": [123456789]
}
```

---

## Monitoring

### `GET /api/content/approvals/history`

Publication history with filtering.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `marketplace` | string | — | Filter by marketplace (`wb` / `ozon` / `ym`) |
| `source` | string | — | Filter by source (`manual` / `auto`) |
| `limit` | int | 50 | Max results |
| `offset` | int | 0 | Pagination offset |

### `GET /api/content/{marketplace}/errors`

Moderation errors by marketplace.

**Path:** `marketplace` — `wb`, `ozon`, or `ym`
**Query:** `?sku=203873004` (optional)

### `GET /api/auto-process/content/preview`

Preview low-scoring product candidates for auto-processing.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `marketplace` | string | `wb` | Target marketplace |
| `limit` | int | 50 | Max results |
| `offset` | int | 0 | Pagination offset |

---

## Marketplace Card Endpoints

### `GET /api/content/{marketplace}/card/{sku}`

Get current card state from marketplace API.

**Path:** `marketplace` — `wb`, `ozon`, or `ym`; `sku` — product SKU

### `GET /api/content/wb/card-by-vendor/{vendor_code}`

Get WB card by seller's vendor code.

### `GET /api/content/wb/my-cards`

List all seller's WB cards (for diagnostics). **Query:** `?limit=50`

---

## Settings & Token Monitoring

### `GET /api/settings`

Get current application settings including **marketplace token status monitoring**.

**Response:**
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

All token values are **masked** in responses (first 4 chars + `***`).

#### Token Monitoring

The `tokens_status` field is populated by a background scheduler that runs every **12 hours**. On app startup, the first check occurs after ~10 seconds.

**How each token is checked:**

| Marketplace | Method | Expiration |
|-------------|--------|------------|
| **WB** | JWT decode (`exp` claim from payload) | 180 days from creation |
| **Ozon** | Test API call (`POST /v3/product/list` with limit=1) | Indefinite (until deleted) |
| **YM** | Test API call (`POST /businesses/{id}/offer-mappings` with limit=1) | Indefinite (until deleted) |

**Token status values:**

| Status | Description |
|--------|-------------|
| `active` | Token is valid and working |
| `expiring_soon` | WB only: less than 30 days remaining |
| `critical` | WB only: less than 7 days remaining |
| `expired` | WB only: JWT `exp` is in the past |
| `invalid` | Token exists but API returned 401/403 |
| `error` | Token exists but API call failed (network/timeout) |
| `not_configured` | Token is empty or missing |

If `tokens_status` is `null`, the first background check hasn't completed yet (app just started).

### `PUT /api/settings`

Update application settings (partial updates supported).

**Request:**
```json
{
  "auto_check_threshold": 95,
  "wb_token": "new_token_value",
  "ozon_client_id": "new_client_id",
  "ozon_api_key": "new_api_key"
}
```

All fields are optional. Masked values (containing `***`) are automatically skipped to prevent overwriting real tokens.

**Configurable fields:**

| Field | Type | Description |
|-------|------|-------------|
| `auto_check_threshold` | int (0-100) | Quality score threshold for auto-check |
| `auto_check_interval` | string | `daily`, `every_2_days`, `weekly`, `every_2_weeks`, `monthly` |
| `auto_check_enabled` | bool | Enable/disable auto content check |
| `tag_scheduler_enabled` | bool | Enable/disable seasonal tag scheduler |
| `wb_token` | string | Wildberries API token |
| `ozon_client_id` | string | Ozon Seller Client ID |
| `ozon_api_key` | string | Ozon Seller API Key |
| `ym_api_key` | string | Yandex Market API Key |
| `ym_business_id` | string | Yandex Market Business ID |

---

## Key Concepts

### Validation Framework

Content undergoes automated checking for:
- Character limits per marketplace (title max, description min/max)
- Forbidden terms (superlatives, guarantees, marketing words)
- URLs, domains, emails, phone numbers, Telegram links
- HTML tags
- Repetition/spam patterns (word > 4% of text)

Auto-correction: if AI generates content with validation errors, the system retries once automatically.

### Marketplace Limits

| Marketplace | Title max | Description min | Description max |
|-------------|-----------|-----------------|-----------------|
| WB | 60 chars | 1,000 chars | 5,000 chars |
| Ozon | 255 chars | 100 chars | 6,000 chars |
| YM | 150 chars | 100 chars | 3,000 chars |

### Group Handling (Склейки)

Products in a "склейка" (bundled group sharing `imt_id`) can be processed:
- **Individually:** Generate/approve for one SKU
- **As a group:** Set `update_all_in_group: true` in approve to update all cards in the group

### Publication Tracking

The `source` field distinguishes between:
- `manual` — manager-reviewed and approved
- `auto` — scheduled/automated approval

### SEO Analysis

Generation responses include `analysis` with three metrics:
- **Title quality** — keyword relevance, length optimization
- **Description quality** — completeness, keyword density
- **Foreign words** — detection of non-Russian terms

Each metric has a score (0-100) and the response includes `total_score` for overall quality.

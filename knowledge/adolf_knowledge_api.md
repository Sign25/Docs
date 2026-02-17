# Adolf Knowledge Base — Справочник API

## Базовый URL

```
http://<host>:8000
```

- Swagger UI: `/api/docs`
- ReDoc: `/api/redoc`
- OpenAPI JSON: `/api/openapi.json`
- Префикс API: `/api/v1/knowledge`
- Префикс роутера документов: `/api/v1/knowledge/documents`
- CORS: разрешены все источники

---

## Эндпоинты

### Системные

| Метод | Путь | Описание | Модель ответа | Статус |
|-------|------|----------|---------------|--------|
| GET | `/health` | Проверка состояния сервиса и БД | `HealthResponse` | 200 |
| GET | `/api/v1/knowledge/stats` | Агрегированная статистика базы знаний | `StatsResponse` | 200 |

### Документы

| Метод | Путь | Описание | Модель ответа | Статус |
|-------|------|----------|---------------|--------|
| GET | `/api/v1/knowledge/documents` | Список документов с фильтрацией | `DocumentListResponse` | 200 |
| GET | `/api/v1/knowledge/documents/search` | Поиск документов по имени файла | `DocumentListResponse` | 200 |
| GET | `/api/v1/knowledge/documents/category-counts` | Количество документов по категориям | `CategoryCountsResponse` | 200 |
| POST | `/api/v1/knowledge/documents/upload` | Загрузка одного файла | `FileUploadResponse` | 202 |
| POST | `/api/v1/knowledge/documents/upload-batch` | Пакетная загрузка файлов (макс. 20) | `BatchUploadResponse` | 202 |
| GET | `/api/v1/knowledge/documents/{doc_id}` | Получение документа по ID | `DocumentResponse` | 200 |

---

## Описание эндпоинтов

### GET /health

Проверка состояния сервиса. Возвращает статус работы и доступность базы данных.

**Ответ:**

```json
{
  "status": "healthy",
  "version": "1.1.17",
  "database": "/path/to/history.db"
}
```

---

### GET /api/v1/knowledge/stats

Агрегированная статистика по всей базе знаний.

**Ответ:**

```json
{
  "total_documents": 142,
  "total_categories": 8,
  "documents_today": 5,
  "moderating": 0,
  "by_category": {"product": 45, "legal": 12},
  "by_status": {"indexed": 130, "failed": 2},
  "by_extension": {".pdf": 80, ".docx": 40},
  "by_brand": {"ohana_market": 90, "ohana_kids": 52},
  "success": 140,
  "indexed": 130,
  "failed": 2,
  "skipped": 0,
  "total_tokens": 125000,
  "avg_processing_seconds": 3.4
}
```

---

### GET /api/v1/knowledge/documents

Список всех документов. Поддерживает опциональную фильтрацию.

**Query-параметры:**

| Параметр | Тип | Обязательный | Значения |
|----------|-----|--------------|----------|
| `status` | string | Нет | `success`, `indexed`, `failed`, `skipped` |
| `category` | string | Нет | `product`, `regulation`, `contract`, `finance`, `analytics`, `hr`, `logistics`, `marketing`, `technical`, `correspondence`, `legal`, `other` |

**Ответ:**

```json
{
  "items": [{ "...DocumentResponse" }],
  "total": 142
}
```

---

### GET /api/v1/knowledge/documents/search

Поиск документов по имени файла (SQLite LIKE).

**Query-параметры:**

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `q` | string | **Да** | Поисковый запрос (подстрока имени файла) |
| `status` | string | Нет | Фильтр по статусу |
| `category` | string | Нет | Фильтр по категории |

**Ответ:** Аналогичен списку документов (`DocumentListResponse`).

---

### GET /api/v1/knowledge/documents/category-counts

Возвращает количество документов в разбивке по категориям.

**Ответ:**

```json
{
  "categories": {
    "product": 45,
    "regulation": 12,
    "contract": 8,
    "legal": 5
  }
}
```

---

### POST /api/v1/knowledge/documents/upload

Загрузка одного файла для обработки. Файл сохраняется в `input_dir` и обрабатывается асинхронно watcher-сервисом.

**Запрос:** `multipart/form-data`

| Поле | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| `file` | file | **Да** | Загружаемый файл |

**Поддерживаемые расширения:** `.csv`, `.xlsx`, `.xls`, `.docx`, `.doc`, `.pdf`, `.html`, `.htm`, `.rtf`, `.odt`, `.txt`, `.md`, `.png`, `.jpg`, `.jpeg`, `.tiff`, `.bmp`, `.gif`, `.webp`

**Ответ (202 Accepted):**

```json
{
  "filename": "report_1.pdf",
  "original_filename": "report.pdf",
  "size_bytes": 245760,
  "status": "accepted",
  "message": "File accepted for processing"
}
```

**Ошибки (400):** Файл слишком большой, неподдерживаемое расширение, пустой файл, отсутствует имя файла.

---

### POST /api/v1/knowledge/documents/upload-batch

Пакетная загрузка файлов. Максимум **20 файлов** за один запрос. Валидные файлы сохраняются даже при ошибке в других.

**Запрос:** `multipart/form-data`

| Поле | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| `files` | file[] | **Да** | Список файлов для загрузки |

**Ответ (202 Accepted):**

```json
{
  "uploaded": [
    {
      "filename": "report.pdf",
      "original_filename": "report.pdf",
      "size_bytes": 245760,
      "status": "accepted",
      "message": "File accepted for processing"
    }
  ],
  "failed": [
    {
      "filename": "broken.exe",
      "error": "Unsupported file extension: .exe"
    }
  ],
  "total_accepted": 4,
  "total_failed": 1
}
```

**Ошибки (400):** Более 20 файлов в одном запросе.

---

### GET /api/v1/knowledge/documents/{doc_id}

Получение полной информации о документе по его ID.

**Path-параметры:**

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `doc_id` | string | **Да** | ID документа |

**Ответ:**

```json
{
  "id": "abc123",
  "original_filename": "report.pdf",
  "extension": ".pdf",
  "file_hash": "sha256...",
  "file_size": 245760,
  "output_path": "./output/report.md",
  "archive_path": "./archive/product/ohana_market/report.pdf",
  "title": "Product Catalog Q1 2025",
  "category": "product",
  "brand_id": "ohana_market",
  "access_level": "staff",
  "confidence": 0.95,
  "classified_by": "claude",
  "kb_file_id": null,
  "status": "indexed",
  "error_message": null,
  "processing_seconds": 4.2,
  "tokens_used": 1500,
  "detected_at": "2025-01-15T10:30:00",
  "created_at": "2025-01-15T10:30:05",
  "indexed_at": "2025-01-15T10:30:09"
}
```

**Ошибки (404):** Документ не найден.

---

## Модели ответов

### HealthResponse

| Поле | Тип | Описание |
|------|-----|----------|
| `status` | string | `"healthy"` |
| `version` | string | Версия API |
| `database` | string | Путь к БД или `"unavailable"` |

### StatsResponse

| Поле | Тип | Описание |
|------|-----|----------|
| `total_documents` | int | Общее количество документов |
| `total_categories` | int | Количество уникальных категорий |
| `documents_today` | int | Документов обработано сегодня |
| `moderating` | int | Документов на модерации |
| `by_category` | dict[str, int] | Количество по категориям |
| `by_status` | dict[str, int] | Количество по статусам |
| `by_extension` | dict[str, int] | Количество по расширениям файлов |
| `by_brand` | dict[str, int] | Количество по брендам |
| `success` | int | Успешно сконвертировано |
| `indexed` | int | Проиндексировано в векторном хранилище |
| `failed` | int | Ошибка обработки |
| `skipped` | int | Пропущено (дубликат и т.д.) |
| `total_tokens` | int | Всего использовано токенов |
| `avg_processing_seconds` | float | Среднее время обработки |

### DocumentListResponse

| Поле | Тип | Описание |
|------|-----|----------|
| `items` | DocumentResponse[] | Список документов |
| `total` | int | Общее количество |

### DocumentResponse

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | string | Уникальный ID документа |
| `original_filename` | string | Исходное имя загруженного файла |
| `extension` | string | Расширение файла (`.pdf`, `.docx` и т.д.) |
| `file_hash` | string? | SHA-256 хеш файла |
| `file_size` | int? | Размер файла в байтах |
| `output_path` | string? | Путь к сконвертированному markdown |
| `archive_path` | string? | Путь в директории архива |
| `title` | string? | Извлечённый/классифицированный заголовок |
| `category` | string? | Категория документа |
| `brand_id` | string? | `ohana_market`, `ohana_kids` или `all` |
| `access_level` | string? | `staff`, `manager`, `senior` или `director` |
| `confidence` | float? | Уверенность классификации (0–1) |
| `classified_by` | string? | Источник классификации |
| `kb_file_id` | string? | Ссылка на внешний файл в KB |
| `status` | string | `success`, `indexed`, `failed`, `skipped` |
| `error_message` | string? | Детали ошибки при сбое |
| `processing_seconds` | float? | Время обработки |
| `tokens_used` | int | Использовано токенов |
| `detected_at` | datetime | Когда файл обнаружен |
| `created_at` | datetime? | Когда запись создана |
| `indexed_at` | datetime? | Когда проиндексирован в векторное хранилище |

### CategoryCountsResponse

| Поле | Тип | Описание |
|------|-----|----------|
| `categories` | dict[str, int] | Количество документов по категориям |

### FileUploadResponse

| Поле | Тип | Описание |
|------|-----|----------|
| `filename` | string | Сохранённое имя файла (может содержать суффикс для дедупликации) |
| `original_filename` | string | Исходное имя файла от клиента |
| `size_bytes` | int | Размер файла |
| `status` | string | Всегда `"accepted"` |
| `message` | string | `"File accepted for processing"` |

### BatchUploadResponse

| Поле | Тип | Описание |
|------|-----|----------|
| `uploaded` | FileUploadResponse[] | Успешно загруженные файлы |
| `failed` | FileUploadErrorDetail[] | Файлы, не прошедшие валидацию |
| `total_accepted` | int | Количество принятых файлов |
| `total_failed` | int | Количество отклонённых файлов |

### FileUploadErrorDetail

| Поле | Тип | Описание |
|------|-----|----------|
| `filename` | string | Имя отклонённого файла |
| `error` | string | Описание ошибки |

---

## Перечисления (Enums)

| Перечисление | Значения |
|--------------|----------|
| DocumentStatus | `success`, `indexed`, `failed`, `skipped` |
| Category | `product`, `regulation`, `contract`, `finance`, `analytics`, `hr`, `logistics`, `marketing`, `technical`, `correspondence`, `legal`, `other` |
| BrandId | `ohana_market`, `ohana_kids`, `all` |
| AccessLevel | `staff`, `manager`, `senior`, `director` |

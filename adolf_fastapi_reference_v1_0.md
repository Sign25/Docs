# ADOLF — Справочник FastAPI Endpoints

**Проект:** Корпоративная AI-система автоматизации E-commerce  
**Компонент:** Единый API Gateway  
**Версия:** 1.0  
**Дата:** Январь 2026

---

## 1. Общие сведения

### 1.1 Базовая информация

| Параметр | Значение |
|----------|----------|
| Base URL | `https://adolf.su/api/v1` |
| Версионирование | Через URL path (`/api/v1/...`) |
| Формат данных | JSON |
| Аутентификация | API ключи (привязаны к пользователям) |
| Пагинация | offset-based (`?offset=0&limit=20`) |

### 1.2 Аутентификация

Все запросы требуют заголовка авторизации:

```
Authorization: Bearer {API_KEY}
```

API ключ наследует роль и `brand_id` пользователя, который его создал.

### 1.3 Формат ошибок

```json
{
  "error": "Описание ошибки"
}
```

### 1.4 Стандартные HTTP-коды

| Код | Описание |
|-----|----------|
| 200 | Успешный запрос |
| 201 | Ресурс создан |
| 204 | Нет контента (успешное удаление) |
| 400 | Некорректный запрос |
| 401 | Не авторизован |
| 403 | Доступ запрещён |
| 404 | Ресурс не найден |
| 429 | Превышен лимит запросов |
| 500 | Внутренняя ошибка сервера |

### 1.5 Пагинация

Для списковых endpoints используются параметры:

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `offset` | int | 0 | Смещение от начала |
| `limit` | int | 20 | Количество записей (макс. 100) |

Ответ содержит метаданные пагинации:

```json
{
  "items": [...],
  "total": 150,
  "offset": 0,
  "limit": 20
}
```

---

## 2. Служебные Endpoints

### 2.1 Health Check

#### GET /health

Проверка работоспособности API.

**Доступ:** Публичный (без авторизации)

**Пример ответа:**

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2026-01-15T10:30:00Z"
}
```

---

#### GET /health/detailed

Детальная проверка состояния компонентов.

**Доступ:** Administrator

**Пример ответа:**

```json
{
  "status": "healthy",
  "components": {
    "database": {"status": "healthy", "latency_ms": 5},
    "redis": {"status": "healthy", "latency_ms": 2},
    "celery": {"status": "healthy", "workers": 4},
    "timeweb_ai": {"status": "healthy", "latency_ms": 150},
    "timeweb_kb": {"status": "healthy", "latency_ms": 80}
  },
  "timestamp": "2026-01-15T10:30:00Z"
}
```

---

### 2.2 Метрики

#### GET /metrics

Метрики системы в формате Prometheus.

**Доступ:** Administrator

**Пример ответа:**

```
# HELP api_requests_total Total API requests
# TYPE api_requests_total counter
api_requests_total{method="GET",endpoint="/api/v1/knowledge/search"} 1234
api_requests_total{method="POST",endpoint="/api/v1/reputation/items"} 567
...
```

---

### 2.3 Celery Tasks

#### GET /tasks/{task_id}

Статус асинхронной задачи Celery.

**Доступ:** Manager+

**Параметры пути:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| task_id | string | UUID задачи |

**Пример ответа:**

```json
{
  "task_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "SUCCESS",
  "result": {"processed": 150, "errors": 0},
  "created_at": "2026-01-15T10:00:00Z",
  "completed_at": "2026-01-15T10:05:00Z"
}
```

**Возможные статусы:** `PENDING`, `STARTED`, `SUCCESS`, `FAILURE`, `RETRY`

---

## 3. Auth — Аутентификация

### 3.1 Сессия

#### GET /auth/session

Информация о текущей сессии пользователя.

**Доступ:** Все авторизованные

**Пример ответа:**

```json
{
  "user_id": 42,
  "username": "ivanov",
  "role": "manager",
  "brand_id": "ohana_market",
  "permissions": ["reputation.read", "reputation.write"]
}
```

---

### 3.2 API ключи

#### GET /auth/api-keys

Список API ключей текущего пользователя.

**Доступ:** Все авторизованные

**Пример ответа:**

```json
{
  "items": [
    {
      "id": 1,
      "name": "Integration Key",
      "prefix": "sk-abc1",
      "created_at": "2026-01-10T12:00:00Z",
      "last_used_at": "2026-01-15T09:30:00Z"
    }
  ],
  "total": 1
}
```

---

#### POST /auth/api-keys

Создание нового API ключа.

**Доступ:** Все авторизованные

**Тело запроса:**

```json
{
  "name": "New Integration Key"
}
```

**Пример ответа:**

```json
{
  "id": 2,
  "name": "New Integration Key",
  "key": "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "created_at": "2026-01-15T10:30:00Z"
}
```

> **Важно:** Полный ключ показывается только один раз при создании.

---

#### DELETE /auth/api-keys/{key_id}

Отзыв API ключа.

**Доступ:** Все авторизованные (только свои ключи)

**Пример ответа:** `204 No Content`

---

## 4. Knowledge — База знаний

### 4.1 Поиск

#### POST /knowledge/search

Семантический поиск по базе знаний.

**Доступ:** Все авторизованные

**Тело запроса:**

```json
{
  "query": "состав артикула OM-001",
  "top_k": 3,
  "filters": {
    "category": "product",
    "brand_id": "ohana_market"
  }
}
```

**Пример ответа:**

```json
{
  "results": [
    {
      "document": "Каталог_ОМ_2026.md",
      "chunk": "Артикул OM-001: Платье летнее. Состав: 95% хлопок, 5% эластан.",
      "score": 0.92,
      "metadata": {
        "category": "product",
        "brand_id": "ohana_market"
      }
    }
  ],
  "answer": "Артикул OM-001 имеет состав: 95% хлопок, 5% эластан.",
  "sources": ["Каталог_ОМ_2026.md"]
}
```

---

### 4.2 Информация о товаре

#### GET /knowledge/product/{sku}

Структурированные данные о товаре для других модулей.

**Доступ:** Internal (для модулей Reputation, Content Factory)

**Параметры пути:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| sku | string | Артикул товара |

**Пример ответа:**

```json
{
  "found": true,
  "sku": "OM-001",
  "composition": "95% хлопок, 5% эластан",
  "sizing": "Размерная сетка: S-XL",
  "care": "Машинная стирка при 30°C"
}
```

---

### 4.3 Документы

#### GET /knowledge/documents

Список документов в базе знаний.

**Доступ:** Senior+

**Query параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| status | string | Фильтр по статусу: `pending`, `approved`, `rejected` |
| category | string | Фильтр по категории |
| offset | int | Смещение |
| limit | int | Лимит |

**Пример ответа:**

```json
{
  "items": [
    {
      "id": 1,
      "filename": "Каталог_ОМ_2026.md",
      "category": "product",
      "access_level": "manager",
      "brand_id": "ohana_market",
      "status": "approved",
      "created_at": "2026-01-10T12:00:00Z"
    }
  ],
  "total": 45,
  "offset": 0,
  "limit": 20
}
```

---

#### GET /knowledge/documents/{id}

Детальная информация о документе.

**Доступ:** Senior+

**Пример ответа:**

```json
{
  "id": 1,
  "filename": "Каталог_ОМ_2026.md",
  "category": "product",
  "access_level": "manager",
  "brand_id": "ohana_market",
  "status": "approved",
  "file_size": 15420,
  "chunks_count": 12,
  "created_at": "2026-01-10T12:00:00Z",
  "approved_by": "senior_user",
  "approved_at": "2026-01-10T14:00:00Z"
}
```

---

#### POST /knowledge/documents/{id}/approve

Одобрение документа на модерации.

**Доступ:** Senior+

**Пример ответа:**

```json
{
  "id": 1,
  "status": "approved",
  "approved_by": "senior_user",
  "approved_at": "2026-01-15T10:30:00Z"
}
```

---

#### POST /knowledge/documents/{id}/reject

Отклонение документа на модерации.

**Доступ:** Senior+

**Тело запроса:**

```json
{
  "reason": "Некорректная классификация"
}
```

**Пример ответа:**

```json
{
  "id": 1,
  "status": "rejected",
  "rejected_by": "senior_user",
  "rejected_at": "2026-01-15T10:30:00Z",
  "rejection_reason": "Некорректная классификация"
}
```

---

#### GET /knowledge/stats

Статистика базы знаний.

**Доступ:** Senior+

**Пример ответа:**

```json
{
  "total_documents": 125,
  "total_chunks": 1540,
  "by_category": {
    "product": 45,
    "policy": 30,
    "guide": 50
  },
  "by_status": {
    "approved": 120,
    "pending": 3,
    "rejected": 2
  },
  "last_updated": "2026-01-15T08:00:00Z"
}
```

---

## 5. Reputation — Управление отзывами

### 5.1 Отзывы и вопросы

#### GET /reputation/items

Список отзывов и вопросов.

**Доступ:** Manager+ (Manager видит только свой бренд)

**Query параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| status | string | `pending_review`, `approved`, `published`, `skipped` |
| item_type | string | `review`, `question` |
| platform | string | `wb`, `ozon`, `ym` |
| rating_min | int | Минимальный рейтинг (1-5) |
| rating_max | int | Максимальный рейтинг (1-5) |
| offset | int | Смещение |
| limit | int | Лимит |

**Пример ответа:**

```json
{
  "items": [
    {
      "id": 1,
      "external_id": "wb_12345",
      "item_type": "review",
      "platform": "wb",
      "sku": "OM-001",
      "client_name": "Мария",
      "client_text": "Отличное платье!",
      "rating": 5,
      "status": "pending_review",
      "generated_response": "Благодарим вас за отзыв...",
      "created_at": "2026-01-15T09:00:00Z"
    }
  ],
  "total": 25,
  "offset": 0,
  "limit": 20
}
```

---

#### GET /reputation/items/{id}

Детальная информация об отзыве/вопросе.

**Доступ:** Manager+

**Пример ответа:**

```json
{
  "id": 1,
  "external_id": "wb_12345",
  "item_type": "review",
  "platform": "wb",
  "sku": "OM-001",
  "product_name": "Платье летнее",
  "client_name": "Мария",
  "client_text": "Отличное платье! Ткань приятная, размер соответствует.",
  "rating": 5,
  "status": "pending_review",
  "sentiment": "positive",
  "topics": ["качество", "размер"],
  "generated_response": "Благодарим вас за отзыв! Рады, что платье вам понравилось.",
  "product_context": {
    "composition": "95% хлопок, 5% эластан",
    "sizing": "Стандартная размерная сетка"
  },
  "created_at": "2026-01-15T09:00:00Z"
}
```

---

#### POST /reputation/items/{id}/approve

Утверждение сгенерированного ответа.

**Доступ:** Manager+

**Пример ответа:**

```json
{
  "id": 1,
  "status": "approved",
  "approved_by": "manager_user",
  "approved_at": "2026-01-15T10:30:00Z",
  "task_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

#### POST /reputation/items/{id}/edit

Редактирование и утверждение ответа.

**Доступ:** Manager+

**Тело запроса:**

```json
{
  "response_text": "Благодарим за отзыв! Мы рады, что вам понравилось наше платье."
}
```

**Пример ответа:**

```json
{
  "id": 1,
  "status": "approved",
  "response_text": "Благодарим за отзыв! Мы рады, что вам понравилось наше платье.",
  "edited_by": "manager_user",
  "approved_at": "2026-01-15T10:30:00Z"
}
```

---

#### POST /reputation/items/{id}/skip

Пропуск отзыва (не отвечать).

**Доступ:** Manager+

**Тело запроса:**

```json
{
  "reason": "Спам"
}
```

**Пример ответа:**

```json
{
  "id": 1,
  "status": "skipped",
  "skip_reason": "Спам"
}
```

---

#### POST /reputation/items/{id}/regenerate

Перегенерация ответа с дополнительными указаниями.

**Доступ:** Manager+

**Тело запроса:**

```json
{
  "instructions": "Сделать ответ более формальным"
}
```

**Пример ответа:**

```json
{
  "id": 1,
  "generated_response": "Уважаемая Мария, благодарим Вас за оставленный отзыв...",
  "regenerated_at": "2026-01-15T10:35:00Z"
}
```

---

#### POST /reputation/items/{id}/escalate

Эскалация отзыва старшему менеджеру.

**Доступ:** Manager+

**Тело запроса:**

```json
{
  "reason": "Требует юридической консультации"
}
```

**Пример ответа:**

```json
{
  "id": 1,
  "status": "escalated",
  "escalation_reason": "Требует юридической консультации"
}
```

---

#### POST /reputation/items/bulk-approve

Массовое утверждение ответов.

**Доступ:** Senior+

**Тело запроса:**

```json
{
  "item_ids": [1, 2, 3, 4, 5]
}
```

**Пример ответа:**

```json
{
  "approved": 5,
  "failed": 0,
  "results": [
    {"id": 1, "status": "approved"},
    {"id": 2, "status": "approved"}
  ]
}
```

---

### 5.2 Статистика

#### GET /reputation/stats

Статистика по отзывам.

**Доступ:** Manager+

**Query параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| period | string | `day`, `week`, `month` |
| platform | string | Фильтр по платформе |

**Пример ответа:**

```json
{
  "period": "week",
  "total_items": 150,
  "by_status": {
    "pending_review": 25,
    "approved": 100,
    "published": 95,
    "skipped": 25
  },
  "by_type": {
    "review": 120,
    "question": 30
  },
  "by_platform": {
    "wb": 80,
    "ozon": 50,
    "ym": 20
  },
  "average_rating": 4.2,
  "response_rate": 0.83
}
```

---

#### GET /reputation/analytics

Расширенная аналитика.

**Доступ:** Senior+

**Пример ответа:**

```json
{
  "sentiment_distribution": {
    "positive": 0.65,
    "neutral": 0.25,
    "negative": 0.10
  },
  "top_topics": [
    {"topic": "качество", "count": 45},
    {"topic": "доставка", "count": 30},
    {"topic": "размер", "count": 25}
  ],
  "response_time_avg_hours": 2.5,
  "ai_suggestions": "Рекомендуется обратить внимание на жалобы о размерах..."
}
```

---

## 6. Watcher — Мониторинг цен

### 6.1 Конкуренты

#### GET /watcher/competitors

Список отслеживаемых конкурентов.

**Доступ:** Manager+

**Пример ответа:**

```json
{
  "items": [
    {
      "id": 1,
      "name": "Конкурент А",
      "marketplace": "wb",
      "seller_id": "12345",
      "products_count": 150,
      "is_active": true
    }
  ],
  "total": 10
}
```

---

#### POST /watcher/competitors

Добавление конкурента для мониторинга.

**Доступ:** Senior+

**Тело запроса:**

```json
{
  "name": "Новый конкурент",
  "marketplace": "wb",
  "seller_id": "67890",
  "product_urls": [
    "https://www.wildberries.ru/catalog/12345/detail.aspx"
  ]
}
```

**Пример ответа:**

```json
{
  "id": 2,
  "name": "Новый конкурент",
  "marketplace": "wb",
  "seller_id": "67890",
  "created_at": "2026-01-15T10:30:00Z"
}
```

---

### 6.2 Цены

#### GET /watcher/prices

История цен по товарам.

**Доступ:** Manager+

**Query параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| competitor_id | int | ID конкурента |
| sku | string | Артикул товара |
| date_from | date | Начало периода |
| date_to | date | Конец периода |

**Пример ответа:**

```json
{
  "items": [
    {
      "sku": "12345",
      "competitor_id": 1,
      "price": 2500,
      "old_price": 3000,
      "discount_percent": 17,
      "in_stock": true,
      "collected_at": "2026-01-15T03:00:00Z"
    }
  ],
  "total": 500
}
```

---

#### GET /watcher/prices/comparison

Сравнение цен с конкурентами.

**Доступ:** Manager+

**Query параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| our_sku | string | Наш артикул |

**Пример ответа:**

```json
{
  "our_sku": "OM-001",
  "our_price": 2500,
  "competitors": [
    {
      "competitor_id": 1,
      "competitor_name": "Конкурент А",
      "sku": "12345",
      "price": 2300,
      "diff_percent": -8.0
    },
    {
      "competitor_id": 2,
      "competitor_name": "Конкурент Б",
      "sku": "67890",
      "price": 2700,
      "diff_percent": 8.0
    }
  ],
  "market_position": "средняя цена"
}
```

---

### 6.3 Алерты

#### GET /watcher/alerts

Список ценовых алертов.

**Доступ:** Manager+

**Пример ответа:**

```json
{
  "items": [
    {
      "id": 1,
      "type": "price_drop",
      "severity": "warning",
      "message": "Конкурент А снизил цену на товар X на 15%",
      "competitor_id": 1,
      "sku": "12345",
      "created_at": "2026-01-15T08:00:00Z",
      "is_read": false
    }
  ],
  "total": 5,
  "unread": 3
}
```

---

#### POST /watcher/alerts/{id}/read

Отметить алерт как прочитанный.

**Доступ:** Manager+

**Пример ответа:**

```json
{
  "id": 1,
  "is_read": true
}
```

---

### 6.4 Задачи агентов

#### GET /watcher/tasks/next

Получение следующей задачи для агента.

**Доступ:** Agent API Key

**Пример ответа:**

```json
{
  "id": "task_123",
  "url": "https://www.wildberries.ru/catalog/12345/detail.aspx",
  "marketplace": "wb",
  "sku": "12345",
  "competitor_id": 1,
  "priority": 5,
  "created_at": "2026-01-15T02:00:00Z"
}
```

При отсутствии задач: `204 No Content`

---

#### POST /watcher/tasks/{task_id}/report

Отправка результата выполнения задачи.

**Доступ:** Agent API Key

**Тело запроса:**

```json
{
  "success": true,
  "raw_text": "{\"price\": 2500, \"old_price\": 3000, \"in_stock\": true}",
  "timing_ms": 1250
}
```

**Пример ответа:**

```json
{
  "status": "ok",
  "processed_at": "2026-01-15T03:05:00Z"
}
```

---

#### POST /watcher/agents/heartbeat

Heartbeat от агента.

**Доступ:** Agent API Key

**Тело запроса:**

```json
{
  "ip_address": "192.168.1.100",
  "cpu_percent": 25,
  "memory_percent": 40,
  "tasks_completed": 150
}
```

**Пример ответа:**

```json
{
  "status": "ok",
  "commands": []
}
```

---

### 6.5 Статистика

#### GET /watcher/stats

Статистика мониторинга.

**Доступ:** Senior+

**Пример ответа:**

```json
{
  "competitors_count": 10,
  "products_monitored": 500,
  "tasks_today": 2500,
  "success_rate": 0.98,
  "agents_online": 5,
  "last_collection": "2026-01-15T03:00:00Z"
}
```

---

#### GET /watcher/category/analysis

Анализ категории для модуля Scout.

**Доступ:** Senior+

**Query параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| category_url | string | URL категории на маркетплейсе |
| marketplace | string | `wb`, `ozon`, `ym` |

**Пример ответа:**

```json
{
  "category_url": "https://www.wildberries.ru/catalog/zhenshchinam/odezhda/platya",
  "avg_price": 2500,
  "price_range": {"min": 500, "max": 15000},
  "top_sellers": [
    {"seller_id": "123", "name": "Бренд А", "products": 50},
    {"seller_id": "456", "name": "Бренд Б", "products": 35}
  ],
  "total_products": 12500
}
```

---

## 7. Content Factory — Генерация контента

### 7.1 Генерация

#### POST /content/generate

Генерация контента для карточки товара.

**Доступ:** Senior+

**Тело запроса:**

```json
{
  "sku": "OM-001",
  "marketplace": "wb",
  "content_types": ["title", "description", "attributes"],
  "style": "professional",
  "additional_context": "Акцент на натуральных материалах"
}
```

**Пример ответа:**

```json
{
  "id": 1,
  "sku": "OM-001",
  "marketplace": "wb",
  "status": "draft",
  "content": {
    "title": "Платье летнее женское из натурального хлопка",
    "description": "Элегантное летнее платье из высококачественного хлопка...",
    "attributes": {
      "Состав": "95% хлопок, 5% эластан",
      "Сезон": "Лето"
    },
    "seo_tags": ["платье", "хлопок", "летнее"]
  },
  "created_at": "2026-01-15T10:30:00Z"
}
```

---

#### POST /content/generate/visual-prompt

Генерация ТЗ для дизайнера.

**Доступ:** Senior+

**Тело запроса:**

```json
{
  "sku": "OM-001",
  "negative_feedback": "Фото не соответствует реальному цвету",
  "requirements": "Добавить фото с разных ракурсов"
}
```

**Пример ответа:**

```json
{
  "id": 1,
  "sku": "OM-001",
  "visual_prompt": {
    "shots_required": ["front", "back", "detail"],
    "lighting": "natural daylight",
    "background": "neutral white",
    "color_accuracy": "high priority",
    "notes": "Обратить внимание на точную передачу цвета ткани"
  }
}
```

---

### 7.2 Черновики

#### GET /content/drafts

Список черновиков контента.

**Доступ:** Senior+

**Пример ответа:**

```json
{
  "items": [
    {
      "id": 1,
      "sku": "OM-001",
      "marketplace": "wb",
      "status": "draft",
      "created_at": "2026-01-15T10:30:00Z"
    }
  ],
  "total": 5
}
```

---

#### GET /content/drafts/{id}

Детали черновика.

**Доступ:** Senior+

**Пример ответа:**

```json
{
  "id": 1,
  "sku": "OM-001",
  "marketplace": "wb",
  "status": "draft",
  "content": {
    "title": "Платье летнее женское из натурального хлопка",
    "description": "Элегантное летнее платье...",
    "attributes": {}
  },
  "tf_idf_score": 0.85,
  "seo_analysis": {
    "keyword_density": 0.03,
    "readability": "good"
  }
}
```

---

#### PUT /content/drafts/{id}

Редактирование черновика.

**Доступ:** Senior+

**Тело запроса:**

```json
{
  "content": {
    "title": "Обновлённое название"
  }
}
```

**Пример ответа:**

```json
{
  "id": 1,
  "status": "draft",
  "updated_at": "2026-01-15T11:00:00Z"
}
```

---

#### POST /content/drafts/{id}/approve

Утверждение черновика для публикации.

**Доступ:** Senior+

**Пример ответа:**

```json
{
  "id": 1,
  "status": "approved",
  "approved_by": "senior_user",
  "approved_at": "2026-01-15T11:00:00Z"
}
```

---

#### POST /content/drafts/{id}/publish

Публикация контента на маркетплейс.

**Доступ:** Senior+

**Пример ответа:**

```json
{
  "id": 1,
  "status": "publishing",
  "task_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### 7.3 Публикации

#### GET /content/publications

История публикаций.

**Доступ:** Senior+

**Пример ответа:**

```json
{
  "items": [
    {
      "id": 1,
      "draft_id": 1,
      "sku": "OM-001",
      "marketplace": "wb",
      "status": "success",
      "published_at": "2026-01-15T11:05:00Z"
    }
  ],
  "total": 20
}
```

---

## 8. Marketing — Управление рекламой

### 8.1 Кампании

#### GET /marketing/campaigns

Список рекламных кампаний.

**Доступ:** Manager+

**Query параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| marketplace | string | `wb`, `ozon`, `ym` |
| status | string | `active`, `paused`, `archived` |
| brand_id | string | Фильтр по бренду |

**Пример ответа:**

```json
{
  "items": [
    {
      "id": 1,
      "external_id": "wb_123456",
      "marketplace": "wb",
      "campaign_type": "wb_auction",
      "name": "Летняя коллекция",
      "status": "active",
      "daily_limit": 5000,
      "spent_today": 2500,
      "strategy": "position_hold",
      "target_position": 5
    }
  ],
  "total": 10
}
```

---

#### POST /marketing/campaigns

Создание рекламной кампании.

**Доступ:** Manager+

**Тело запроса:**

```json
{
  "marketplace": "wb",
  "campaign_type": "wb_auction",
  "name": "Новая кампания",
  "daily_limit": 5000,
  "strategy": "position_hold",
  "strategy_config": {
    "target_position": 5,
    "bid_step": 1
  },
  "product_ids": ["OM-001", "OM-002"]
}
```

**Пример ответа:**

```json
{
  "id": 2,
  "external_id": "wb_789012",
  "status": "creating",
  "task_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

#### GET /marketing/campaigns/{id}

Детали кампании.

**Доступ:** Manager+

**Пример ответа:**

```json
{
  "id": 1,
  "external_id": "wb_123456",
  "marketplace": "wb",
  "campaign_type": "wb_auction",
  "name": "Летняя коллекция",
  "status": "active",
  "daily_limit": 5000,
  "spent_today": 2500,
  "strategy": "position_hold",
  "strategy_config": {
    "target_position": 5,
    "bid_step": 1,
    "max_bid": 100
  },
  "stats": {
    "views": 15000,
    "clicks": 450,
    "ctr": 3.0,
    "orders": 25,
    "revenue": 62500,
    "drr": 4.0
  }
}
```

---

#### PUT /marketing/campaigns/{id}

Обновление кампании.

**Доступ:** Manager+

**Тело запроса:**

```json
{
  "daily_limit": 7000,
  "strategy_config": {
    "target_position": 3
  }
}
```

---

#### POST /marketing/campaigns/{id}/pause

Приостановка кампании.

**Доступ:** Manager+

---

#### POST /marketing/campaigns/{id}/resume

Возобновление кампании.

**Доступ:** Manager+

---

#### POST /marketing/campaigns/{id}/archive

Архивация кампании.

**Доступ:** Senior+

---

### 8.2 Ключевые слова

#### GET /marketing/campaigns/{id}/keywords

Ключевые слова кампании.

**Доступ:** Manager+

**Пример ответа:**

```json
{
  "items": [
    {
      "id": 1,
      "external_id": "kw_12345",
      "text": "платье летнее",
      "match_type": "phrase",
      "bid": 50,
      "status": "active",
      "stats": {
        "views": 5000,
        "clicks": 150,
        "ctr": 3.0,
        "cpc": 45,
        "orders": 8
      }
    }
  ],
  "total": 25
}
```

---

#### POST /marketing/campaigns/{id}/keywords

Добавление ключевых слов.

**Доступ:** Manager+

**Тело запроса:**

```json
{
  "keywords": [
    {"text": "новое ключевое слово", "bid": 30, "match_type": "phrase"}
  ]
}
```

---

#### DELETE /marketing/campaigns/{id}/keywords

Удаление ключевых слов.

**Доступ:** Manager+

**Тело запроса:**

```json
{
  "keyword_ids": [1, 2, 3]
}
```

---

### 8.3 Ставки

#### PUT /marketing/bids

Обновление ставок.

**Доступ:** Manager+

**Тело запроса:**

```json
{
  "updates": [
    {"keyword_id": 1, "new_bid": 55},
    {"keyword_id": 2, "new_bid": 40}
  ]
}
```

**Пример ответа:**

```json
{
  "updated": 2,
  "results": [
    {"keyword_id": 1, "old_bid": 50, "new_bid": 55, "success": true},
    {"keyword_id": 2, "old_bid": 35, "new_bid": 40, "success": true}
  ]
}
```

---

#### GET /marketing/bids/recommendations

Рекомендации по ставкам.

**Доступ:** Senior+

**Query параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| campaign_id | int | ID кампании |

**Пример ответа:**

```json
{
  "campaign_id": 1,
  "recommendations": [
    {
      "keyword_id": 1,
      "current_bid": 50,
      "recommended_bid": 65,
      "reason": "Позиция 8, целевая 5",
      "expected_position": 5
    }
  ]
}
```

---

### 8.4 Статистика

#### GET /marketing/stats

Общая статистика по рекламе.

**Доступ:** Manager+

**Query параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| period | string | `day`, `week`, `month` |
| marketplace | string | Фильтр по маркетплейсу |

**Пример ответа:**

```json
{
  "period": "week",
  "total_spent": 35000,
  "total_revenue": 875000,
  "drr": 4.0,
  "campaigns_active": 5,
  "by_marketplace": {
    "wb": {"spent": 20000, "revenue": 500000, "drr": 4.0},
    "ozon": {"spent": 15000, "revenue": 375000, "drr": 4.0}
  }
}
```

---

#### GET /marketing/reports/daily

Ежедневный отчёт.

**Доступ:** Senior+

**Пример ответа:**

```json
{
  "date": "2026-01-15",
  "campaigns": [
    {
      "id": 1,
      "name": "Летняя коллекция",
      "spent": 2500,
      "views": 15000,
      "clicks": 450,
      "ctr": 3.0,
      "orders": 25,
      "revenue": 62500,
      "drr": 4.0
    }
  ],
  "totals": {
    "spent": 5000,
    "revenue": 125000,
    "drr": 4.0
  }
}
```

---

### 8.5 Настройки

#### GET /marketing/settings

Настройки модуля Marketing.

**Доступ:** Administrator

**Пример ответа:**

```json
{
  "bid_cycle_interval_minutes": 15,
  "default_strategy": "position_hold",
  "safety_rules": {
    "max_daily_spend_percent": 120,
    "min_ctr_threshold": 0.5,
    "min_views_for_pause": 1000,
    "max_drr_threshold": 25
  }
}
```

---

#### PUT /marketing/settings

Обновление настроек.

**Доступ:** Administrator

---

## 9. Scout — Предиктивная аналитика

### 9.1 Анализ ниши

#### POST /scout/analyze

Запуск анализа товарной ниши.

**Доступ:** Senior+

**Тело запроса:**

```json
{
  "category_url": "https://www.wildberries.ru/catalog/zhenshchinam/odezhda/platya",
  "marketplace": "wb",
  "our_cost_price": 800,
  "our_target_margin": 30
}
```

**Пример ответа:**

```json
{
  "id": 1,
  "status": "processing",
  "task_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

#### GET /scout/analyses/{id}

Результаты анализа ниши.

**Доступ:** Senior+

**Пример ответа:**

```json
{
  "id": 1,
  "status": "completed",
  "category_url": "https://www.wildberries.ru/catalog/zhenshchinam/odezhda/platya",
  "marketplace": "wb",
  "market_analysis": {
    "total_products": 12500,
    "avg_price": 2500,
    "price_range": {"min": 500, "max": 15000},
    "top_sellers_count": 50,
    "competition_level": "high"
  },
  "demand_analysis": {
    "search_volume_monthly": 150000,
    "trend": "growing",
    "seasonality": "summer_peak"
  },
  "unit_economics": {
    "recommended_price": 2200,
    "estimated_margin": 35,
    "estimated_orders_monthly": 50,
    "estimated_revenue_monthly": 110000,
    "roi_score": 7.5
  },
  "verdict": "RECOMMENDED",
  "ai_summary": "Ниша демонстрирует стабильный спрос с потенциалом роста...",
  "created_at": "2026-01-15T10:30:00Z"
}
```

---

#### GET /scout/analyses

История анализов.

**Доступ:** Senior+

**Пример ответа:**

```json
{
  "items": [
    {
      "id": 1,
      "category_name": "Платья",
      "marketplace": "wb",
      "verdict": "RECOMMENDED",
      "roi_score": 7.5,
      "created_at": "2026-01-15T10:30:00Z"
    }
  ],
  "total": 15
}
```

---

## 10. CFO — Финансовый учёт

### 10.1 P&L отчёты

#### GET /cfo/pnl

P&L отчёт.

**Доступ:** Senior+ (Senior — по категориям/брендам, Director — по SKU)

**Query параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| period | string | `day`, `week`, `month`, `quarter` |
| group_by | string | `sku`, `category`, `brand`, `marketplace` |
| date_from | date | Начало периода |
| date_to | date | Конец периода |

**Пример ответа:**

```json
{
  "period": {
    "from": "2026-01-01",
    "to": "2026-01-15"
  },
  "group_by": "category",
  "items": [
    {
      "name": "Платья",
      "revenue": 1500000,
      "cogs": 600000,
      "commission": 225000,
      "logistics": 75000,
      "storage": 15000,
      "advertising": 60000,
      "gross_profit": 525000,
      "margin_percent": 35.0
    }
  ],
  "totals": {
    "revenue": 3000000,
    "gross_profit": 1050000,
    "margin_percent": 35.0
  }
}
```

---

#### GET /cfo/pnl/sku/{sku}

P&L по конкретному SKU.

**Доступ:** Director+

**Пример ответа:**

```json
{
  "sku": "OM-001",
  "product_name": "Платье летнее",
  "period": {
    "from": "2026-01-01",
    "to": "2026-01-15"
  },
  "sales_count": 150,
  "returns_count": 5,
  "revenue": 375000,
  "cogs": 120000,
  "commission": 56250,
  "logistics": 15000,
  "return_logistics": 2500,
  "storage": 3000,
  "advertising": 15000,
  "gross_profit": 163250,
  "margin_percent": 43.5,
  "abc_class": "A"
}
```

---

### 10.2 ABC-анализ

#### GET /cfo/abc

ABC-анализ товаров.

**Доступ:** Senior+

**Query параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| period | string | Период анализа |
| brand_id | string | Фильтр по бренду |

**Пример ответа:**

```json
{
  "period": "month",
  "classes": {
    "A": {
      "count": 25,
      "revenue_share": 80.0,
      "profit_share": 75.0
    },
    "B": {
      "count": 50,
      "revenue_share": 15.0,
      "profit_share": 18.0
    },
    "C": {
      "count": 100,
      "revenue_share": 4.5,
      "profit_share": 6.0
    },
    "D": {
      "count": 25,
      "revenue_share": 0.5,
      "profit_share": 1.0
    }
  },
  "loss_makers": [
    {
      "sku": "OM-099",
      "product_name": "Блузка",
      "revenue": 25000,
      "loss": -5000,
      "margin_percent": -20.0
    }
  ]
}
```

---

### 10.3 AI-инсайты

#### GET /cfo/insights

AI-анализ финансовых данных.

**Доступ:** Director+

**Пример ответа:**

```json
{
  "generated_at": "2026-01-15T08:00:00Z",
  "key_insights": [
    {
      "type": "warning",
      "title": "Снижение маржинальности",
      "description": "Маржа категории 'Платья' снизилась на 5% за последний месяц",
      "recommendation": "Рассмотреть пересмотр цен или оптимизацию логистики"
    },
    {
      "type": "opportunity",
      "title": "Рост спроса",
      "description": "Категория 'Юбки' показывает рост продаж на 25%",
      "recommendation": "Увеличить закупки и рекламный бюджет"
    }
  ],
  "top_performers": ["OM-001", "OM-015", "OM-023"],
  "attention_required": ["OM-099", "OM-087"]
}
```

---

### 10.4 Себестоимость

#### GET /cfo/costs

Справочник себестоимости.

**Доступ:** Director+

**Пример ответа:**

```json
{
  "items": [
    {
      "sku": "OM-001",
      "barcode": "4600000000001",
      "cost_price": 800,
      "updated_at": "2026-01-10T12:00:00Z",
      "source": "1c_import"
    }
  ],
  "total": 500,
  "unmapped_count": 5
}
```

---

#### POST /cfo/costs/import

Импорт себестоимости из файла.

**Доступ:** Director+

**Тело запроса:** multipart/form-data с файлом

**Пример ответа:**

```json
{
  "imported": 450,
  "updated": 50,
  "errors": 0,
  "task_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## 11. Lex — Правовой мониторинг

### 11.1 Документы

#### GET /lex/documents

Список правовых документов.

**Доступ:** Manager+

**Query параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| category | string | `marking`, `consumer_protection`, `advertising`, `tax` |
| relevance | string | `high`, `medium`, `low` |

**Пример ответа:**

```json
{
  "items": [
    {
      "id": 1,
      "title": "Изменения в правилах маркировки товаров",
      "category": "marking",
      "relevance": "high",
      "source": "consultant_plus",
      "effective_date": "2026-02-01",
      "summary": "Новые требования к маркировке текстильных изделий...",
      "created_at": "2026-01-10T12:00:00Z"
    }
  ],
  "total": 25
}
```

---

#### GET /lex/documents/{id}

Детали документа.

**Доступ:** Manager+

**Пример ответа:**

```json
{
  "id": 1,
  "title": "Изменения в правилах маркировки товаров",
  "category": "marking",
  "relevance": "high",
  "source": "consultant_plus",
  "source_url": "https://consultant.ru/document/...",
  "effective_date": "2026-02-01",
  "summary": "Новые требования к маркировке текстильных изделий...",
  "full_text": "Полный текст документа...",
  "action_items": [
    "Обновить этикетки до 01.02.2026",
    "Проверить соответствие упаковки"
  ],
  "affected_categories": ["textile", "footwear"]
}
```

---

### 11.2 Алерты

#### GET /lex/alerts

Правовые алерты.

**Доступ:** Manager+

**Пример ответа:**

```json
{
  "items": [
    {
      "id": 1,
      "document_id": 1,
      "type": "deadline",
      "severity": "high",
      "title": "Срок вступления в силу — 01.02.2026",
      "message": "Новые требования к маркировке вступают в силу через 17 дней",
      "created_at": "2026-01-15T08:00:00Z",
      "is_read": false
    }
  ],
  "total": 5,
  "unread": 3
}
```

---

### 11.3 Ключевые слова

#### GET /lex/keywords

Ключевые слова для мониторинга.

**Доступ:** Administrator

**Пример ответа:**

```json
{
  "items": [
    {"id": 1, "keyword": "маркировка", "category": "marking", "is_active": true},
    {"id": 2, "keyword": "защита прав потребителей", "category": "consumer_protection", "is_active": true}
  ],
  "total": 15
}
```

---

#### POST /lex/keywords

Добавление ключевого слова.

**Доступ:** Administrator

**Тело запроса:**

```json
{
  "keyword": "новое ключевое слово",
  "category": "tax"
}
```

---

### 11.4 Статистика

#### GET /lex/stats

Статистика мониторинга.

**Доступ:** Senior+

**Пример ответа:**

```json
{
  "documents_total": 125,
  "documents_this_month": 15,
  "by_category": {
    "marking": 45,
    "consumer_protection": 30,
    "advertising": 25,
    "tax": 25
  },
  "by_relevance": {
    "high": 20,
    "medium": 50,
    "low": 55
  },
  "last_check": "2026-01-15T06:00:00Z"
}
```

---

## 12. Notifications — Уведомления

### 12.1 Уведомления пользователя

#### GET /notifications

Список уведомлений текущего пользователя.

**Доступ:** Все авторизованные

**Query параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| is_read | bool | Фильтр по прочитанности |
| level | string | `info`, `warning`, `critical` |

**Пример ответа:**

```json
{
  "items": [
    {
      "id": 1,
      "title": "Новый негативный отзыв",
      "message": "Получен отзыв с оценкой 1 звезда на товар OM-001",
      "level": "warning",
      "source_module": "reputation",
      "source_id": "review_123",
      "is_read": false,
      "created_at": "2026-01-15T10:00:00Z"
    }
  ],
  "total": 15,
  "unread": 5
}
```

---

#### POST /notifications/{id}/read

Отметить уведомление как прочитанное.

**Доступ:** Все авторизованные

---

#### POST /notifications/read-all

Отметить все уведомления как прочитанные.

**Доступ:** Все авторизованные

---

### 12.2 WebSocket

#### WS /ws/notifications

WebSocket соединение для real-time уведомлений.

**Доступ:** Все авторизованные

**Формат сообщений:**

```json
{
  "type": "notification",
  "payload": {
    "id": 1,
    "title": "Новое уведомление",
    "message": "Текст уведомления",
    "level": "info"
  }
}
```

---

## 13. Webhooks

### 13.1 Приём алертов

#### POST /webhooks/alerts

Приём алертов от внутренних модулей.

**Доступ:** Internal (service-to-service)

**Тело запроса:**

```json
{
  "event_type": "review.negative",
  "source_module": "reputation",
  "title": "Негативный отзыв",
  "message": "Получен отзыв с оценкой 1 звезда",
  "level": "warning",
  "source_id": "review_123",
  "brand_id": "ohana_market",
  "target_roles": ["manager", "senior"],
  "data": {
    "sku": "OM-001",
    "rating": 1
  }
}
```

**Пример ответа:**

```json
{
  "status": "ok",
  "notifications_created": 3
}
```

---

## 14. Chat — AI-интерфейс

### 14.1 Completions

#### POST /chat/completions

Проксирование запросов к AI через Middleware.

**Доступ:** Все авторизованные

**Тело запроса:** OpenAI-compatible формат

```json
{
  "model": "gpt-5-mini",
  "messages": [
    {"role": "user", "content": "Покажи статистику по отзывам за неделю"}
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_reputation_stats",
        "parameters": {"period": "week"}
      }
    }
  ]
}
```

**Пример ответа:**

```json
{
  "id": "chatcmpl-123",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "За последнюю неделю обработано 150 отзывов...",
        "tool_calls": null
      }
    }
  ]
}
```

---

## Приложение А: Сводная таблица endpoints

| Модуль | Prefix | Endpoints | Минимальная роль |
|--------|--------|-----------|------------------|
| Health | `/health` | 2 | Public / Admin |
| Metrics | `/metrics` | 1 | Admin |
| Tasks | `/tasks` | 1 | Manager |
| Auth | `/auth` | 4 | All |
| Knowledge | `/knowledge` | 8 | All / Senior |
| Reputation | `/reputation` | 12 | Manager |
| Watcher | `/watcher` | 12 | Manager / Agent |
| Content | `/content` | 8 | Senior |
| Marketing | `/marketing` | 15 | Manager |
| Scout | `/scout` | 3 | Senior |
| CFO | `/cfo` | 6 | Senior / Director |
| Lex | `/lex` | 6 | Manager |
| Notifications | `/notifications` | 4 | All |
| Webhooks | `/webhooks` | 1 | Internal |
| Chat | `/chat` | 1 | All |

---

## Приложение Б: Матрица доступа по ролям

| Endpoint группа | Staff | Manager | Senior | Director | Admin |
|-----------------|:-----:|:-------:|:------:|:--------:|:-----:|
| Health (public) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Health (detailed) | ❌ | ❌ | ❌ | ❌ | ✅ |
| Metrics | ❌ | ❌ | ❌ | ❌ | ✅ |
| Auth | ✅ | ✅ | ✅ | ✅ | ✅ |
| Knowledge Search | ✅ | ✅ | ✅ | ✅ | ✅ |
| Knowledge Docs | ❌ | ❌ | ✅ | ✅ | ✅ |
| Reputation | ❌ | ✅* | ✅ | ✅ | ✅ |
| Watcher | ❌ | ✅* | ✅ | ✅ | ✅ |
| Content Factory | ❌ | ❌ | ✅ | ✅ | ✅ |
| Marketing | ❌ | ✅* | ✅ | ✅ | ✅ |
| Scout | ❌ | ❌ | ✅ | ✅ | ✅ |
| CFO (категории) | ❌ | ❌ | ✅ | ✅ | ✅ |
| CFO (SKU) | ❌ | ❌ | ❌ | ✅ | ✅ |
| Lex | ❌ | ✅ | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ✅ | ✅ | ✅ |
| Settings | ❌ | ❌ | ❌ | ❌ | ✅ |

*Manager видит только данные своего бренда

---

**Документ подготовлен:** Январь 2026  
**Версия:** 1.0  
**Статус:** Черновик

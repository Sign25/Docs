---
title: "Раздел 3: REST API Reference"
---

**Модуль:** Правки (Feedback)
**Base URL:** `/api/v1/feedback-requests`
**Аутентификация:** Bearer token

---

## Категории (разделы)

### `GET /categories`

Получить список активных разделов.

**Доступ:** Любой авторизованный

**Ответ:**
```json
[
  {
    "id": "uuid",
    "name": "Контент-Фабрика",
    "icon": "content-factory",
    "description": null,
    "is_active": true,
    "sort_order": 1,
    "created_at": 1712345678
  }
]
```

---

### `POST /categories`

Создать раздел.

**Доступ:** Admin

**Тело:**
```json
{
  "name": "Контент-Фабрика",
  "icon": "content-factory",
  "description": "Запросы по модулю КФ",
  "sort_order": 1
}
```

**Ответ:** Созданный объект категории.

---

### `PUT /categories/{category_id}`

Обновить раздел.

**Доступ:** Admin

**Тело:** Те же поля что и POST.

---

### `DELETE /categories/{category_id}`

Мягкое удаление (is_active = false).

**Доступ:** Admin

**Ответ:** `{ "success": true }`

---

## Запросы (правки)

### `GET /`

Список запросов с фильтрацией и пагинацией.

**Доступ:** Любой авторизованный

**Query параметры:**

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|:------------:|----------|
| `category_id` | string | — | Фильтр по разделу |
| `status_filter` | string | — | `new`, `in_progress`, `done`, `rejected` |
| `archived` | bool | `false` | Показать архивные |
| `page` | int | 1 | Страница |
| `page_size` | int | 50 | Записей на страницу |

**Ответ:**
```json
{
  "items": [
    {
      "id": "uuid",
      "user_id": "user-uuid",
      "user_name": "Сергей",
      "category_id": "cat-uuid",
      "title": "Чего-то не грузится",
      "text": "Ошибка при загрузке аналитики",
      "status": "new",
      "admin_comment": null,
      "is_archived": false,
      "created_at": 1712345678,
      "updated_at": 1712345678
    }
  ],
  "total": 42,
  "page": 1,
  "page_size": 50
}
```

---

### `POST /`

Создать запрос.

**Доступ:** Любой авторизованный

**Тело:**
```json
{
  "category_id": "cat-uuid",
  "title": "Заголовок",
  "text": "Описание проблемы"
}
```

**Ответ:** Созданный объект запроса.

---

### `PUT /{request_id}`

Обновить статус / архивировать / добавить комментарий админа.

**Доступ:** Admin

**Тело:**
```json
{
  "status": "in_progress",
  "admin_comment": "Взяли в работу",
  "is_archived": false
}
```

Все поля опциональны. Обновляются только переданные.

---

### `DELETE /{request_id}`

Полное удаление запроса.

**Доступ:** Admin

**Ответ:** `{ "success": true }`

---

## Комментарии

### `GET /{request_id}/comments`

Список комментариев к запросу.

**Доступ:** Любой авторизованный

**Ответ:**
```json
[
  {
    "id": "uuid",
    "request_id": "req-uuid",
    "user_id": "user-uuid",
    "user_name": "Сергей",
    "user_role": "admin",
    "text": "Поправлено",
    "created_at": 1712345678
  }
]
```

---

### `POST /{request_id}/comments`

Добавить комментарий.

**Доступ:** Любой авторизованный

**Тело:**
```json
{
  "text": "Текст комментария"
}
```

**Ответ:** Созданный объект комментария.

---

## Схема БД

### `feedback_category`

| Колонка | Тип | Описание |
|---------|-----|----------|
| id | TEXT PK | UUID |
| name | TEXT | Название раздела |
| icon | TEXT | Имя иконки (SVG модуля или lucide) |
| description | TEXT | Описание |
| is_active | BOOLEAN | Активен (soft delete) |
| sort_order | INTEGER | Порядок сортировки |
| created_at | BIGINT | Timestamp |

### `feedback_request`

| Колонка | Тип | Описание |
|---------|-----|----------|
| id | TEXT PK | UUID |
| user_id | TEXT | ID автора |
| user_name | TEXT | Имя автора |
| category_id | TEXT FK | ID раздела |
| title | TEXT | Заголовок |
| text | TEXT | Описание |
| status | TEXT | new / in_progress / done / rejected |
| admin_comment | TEXT | Комментарий админа (legacy) |
| is_archived | BOOLEAN | В архиве |
| created_at | BIGINT | Timestamp создания |
| updated_at | BIGINT | Timestamp обновления |

### `feedback_comment`

| Колонка | Тип | Описание |
|---------|-----|----------|
| id | TEXT PK | UUID |
| request_id | TEXT FK | ID запроса |
| user_id | TEXT | ID автора комментария |
| user_name | TEXT | Имя автора |
| user_role | TEXT | Роль (admin показывает бейдж) |
| text | TEXT | Текст комментария |
| created_at | BIGINT | Timestamp |

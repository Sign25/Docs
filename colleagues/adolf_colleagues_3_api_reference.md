---
title: "Раздел 3: REST API Reference"
---

**Модуль:** Коллеги + Каналы
**Base URL:** `/api/v1/channels`
**Аутентификация:** Bearer token
**Real-time:** WebSocket (Socket.IO)

---

## Каналы

### `GET /`

Список каналов пользователя (DM + group).

**Доступ:** Любой авторизованный

**Ответ:**
```json
[
  {
    "id": "uuid",
    "type": "dm",
    "name": null,
    "user_ids": ["user-1", "user-2"],
    "users": [
      { "id": "user-2", "name": "Коллега", "is_active": true, "status_emoji": null, "status_message": null }
    ],
    "last_message_at": 1712345678000,
    "unread_count": 3
  }
]
```

---

### `GET /users/{user_id}`

Найти или создать DM канал с пользователем.

**Доступ:** Любой авторизованный

**Логика:**
1. Ищет существующий DM канал между текущим пользователем и `user_id`
2. Если найден — возвращает его
3. Если нет — создаёт новый DM канал, добавляет обоих как members

**Ответ:** Объект канала.

---

### `POST /` (создание группового канала)

**Доступ:** Любой авторизованный

**Тело:**
```json
{
  "type": "group",
  "name": "Название канала",
  "is_private": true,
  "user_ids": ["user-1", "user-2", "user-3"]
}
```

---

### `GET /{channel_id}`

Получить информацию о канале.

---

### `PUT /{channel_id}`

Обновить канал (название, участники).

**Доступ:** Admin или создатель канала.

---

## Сообщения

### `GET /{channel_id}/messages`

Список сообщений канала.

**Query параметры:**

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|:------------:|----------|
| `skip` | int | 0 | Смещение |
| `limit` | int | 50 | Лимит |

**Ответ:**
```json
[
  {
    "id": "msg-uuid",
    "user_id": "user-uuid",
    "channel_id": "chan-uuid",
    "content": "Привет!",
    "reply_to_id": null,
    "parent_id": null,
    "data": {},
    "created_at": 1712345678000,
    "updated_at": null,
    "user": { "id": "user-uuid", "name": "Сергей", "profile_image_url": "..." },
    "reactions": []
  }
]
```

---

### `POST /{channel_id}/messages/post`

Отправить сообщение в канал.

**Тело:**
```json
{
  "content": "Текст сообщения",
  "data": {}
}
```

**Ответ:** Созданное сообщение.

**Побочный эффект:** WebSocket emit `channel:message` всем участникам канала.

---

## Участники

### `POST /{channel_id}/members/update`

Обновить статус участника (активный/неактивный).

Используется для скрытия DM (is_active = false).

---

## WebSocket события

| Событие | Направление | Описание |
|---------|-------------|----------|
| `join-channels` | Client → Server | Присоединиться к комнатам каналов |
| `channel:message` | Server → Client | Новое сообщение в канале |
| `channel:created` | Server → Client | Создан новый канал |
| `channel:updated` | Server → Client | Канал обновлён |

## Схема БД

### `channel`

| Колонка | Тип | Описание |
|---------|-----|----------|
| id | TEXT PK | UUID |
| user_id | TEXT | Создатель |
| type | TEXT | `dm` / `group` |
| name | TEXT | Название (null для DM) |
| description | TEXT | Описание |
| is_private | BOOLEAN | Приватный канал |
| data | JSON | Доп. данные |
| meta | JSON | Метаданные |
| access_control | JSON | ACL |

### `channel_member`

| Колонка | Тип | Описание |
|---------|-----|----------|
| channel_id | TEXT FK | ID канала |
| user_id | TEXT FK | ID участника |
| is_active | BOOLEAN | Активный (false = скрыт) |
| last_read_at | BIGINT | Последнее прочтение |

### `message`

| Колонка | Тип | Описание |
|---------|-----|----------|
| id | TEXT PK | UUID |
| user_id | TEXT FK | Автор |
| channel_id | TEXT FK | Канал |
| content | TEXT | Текст сообщения |
| reply_to_id | TEXT | ID сообщения-ответа |
| parent_id | TEXT | ID родительского (тред) |
| data | JSON | Вложения |
| created_at | BIGINT | Timestamp |
| updated_at | BIGINT | Timestamp обновления |

---
title: "Раздел 1: Архитектура"
---

**Модуль:** Коллеги + Каналы

---

## Стек технологий

| Компонент | Технология |
|-----------|------------|
| Frontend | SvelteKit, shadcn-svelte |
| Backend | Python, FastAPI (Open WebUI core) |
| Database | PostgreSQL |
| Real-time | WebSocket (Socket.IO) |

## Схема данных

```mermaid
erDiagram
    channel {
        TEXT id PK
        TEXT user_id
        TEXT type "dm | group"
        TEXT name
        TEXT description
        BOOLEAN is_private
        JSON data
        JSON meta
        JSON access_control
    }
    channel_member {
        TEXT channel_id FK
        TEXT user_id FK
        BOOLEAN is_active
        BIGINT last_read_at
    }
    message {
        TEXT id PK
        TEXT user_id FK
        TEXT channel_id FK
        TEXT reply_to_id
        TEXT parent_id
        TEXT content
        JSON data
        BIGINT created_at
        BIGINT updated_at
    }
    message_reaction {
        TEXT id PK
        TEXT user_id FK
        TEXT message_id FK
        TEXT name
        BIGINT created_at
    }
    channel ||--o{ channel_member : has
    channel ||--o{ message : contains
    message ||--o{ message_reaction : has
```

## Типы каналов

| Тип | Описание | Участники |
|-----|----------|-----------|
| `dm` | Личное сообщение | Ровно 2 |
| `group` | Групповой канал | 2+ |

## Real-time доставка

```mermaid
sequenceDiagram
    User A->>Backend: POST /channels/{id}/messages/post
    Backend->>WebSocket: emit to channel room
    WebSocket->>User B: new message event
    User B->>UI: render message
```

## Изменения в Open WebUI

| Файл | Изменение |
|------|-----------|
| `routers/channels.py` | `check_channels_access()` → pass (всегда включено) |
| `routers/channels.py` | Удалены проверки `has_permission("features.channels")` |
| `config.py` | `ENABLE_CHANNELS` default → True |
| `Sidebar.svelte` | Убрана проверка `$config.features.enable_channels` |
| `Sidebar.svelte` | Разделение на «Коллеги» (DM) и «Каналы» (group) |
| `ChannelItem.svelte` | ConfirmDialog при скрытии DM |
| `UserList.svelte` | Кнопка DM в списке пользователей админки |

---
title: "Раздел 1: Архитектура"
---

**Модуль:** Правки (Feedback)

---

## Стек технологий

| Компонент | Технология |
|-----------|------------|
| Frontend | SvelteKit, shadcn-svelte, TailwindCSS |
| Backend | Python, FastAPI |
| Database | PostgreSQL (внутренняя БД Open WebUI) |
| Auth | JWT Bearer tokens |

## Схема данных

```mermaid
erDiagram
    feedback_category {
        TEXT id PK
        TEXT name
        TEXT icon
        TEXT description
        BOOLEAN is_active
        INTEGER sort_order
        BIGINT created_at
    }
    feedback_request {
        TEXT id PK
        TEXT user_id FK
        TEXT user_name
        TEXT category_id FK
        TEXT title
        TEXT text
        TEXT status
        TEXT admin_comment
        BOOLEAN is_archived
        BIGINT created_at
        BIGINT updated_at
    }
    feedback_comment {
        TEXT id PK
        TEXT request_id FK
        TEXT user_id FK
        TEXT user_name
        TEXT user_role
        TEXT text
        BIGINT created_at
    }
    feedback_category ||--o{ feedback_request : contains
    feedback_request ||--o{ feedback_comment : has
```

## Статусы запросов

```mermaid
stateDiagram-v2
    [*] --> new : Создан
    new --> in_progress : Взят в работу
    in_progress --> done : Выполнен
    in_progress --> rejected : Отклонён
    new --> rejected : Отклонён
    done --> [*]
    rejected --> [*]
```

## Автоматические миграции

При старте бэкенда:
1. Создаются таблицы `feedback_category`, `feedback_request`, `feedback_comment` если не существуют
2. Добавляется колонка `is_archived` в `feedback_request` если отсутствует
3. Добавляется колонка `icon` в `feedback_category` если отсутствует
4. NULL значения `is_archived` обновляются на FALSE

## Иконки разделов

Два типа иконок:
- **Пресетные модули** — SVG из `/static/{module}-icon.svg` (content-factory, reputation, watcher и др.)
- **Кастомные** — lucide SVG inline (message-square, bug, sparkles, settings и 20+ других)

Иконка хранится в поле `icon` таблицы `feedback_category`.

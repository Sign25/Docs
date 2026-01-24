# ADOLF v4.0 — Реестр несоответствий и решений

**Дата анализа:** Январь 2026  
**Модули:** Core, Knowledge, Reputation  
**Статус:** Промежуточный документ

---

## Сводка изменений

| Категория | Количество |
|-----------|------------|
| Терминология и роли | 4 |
| Схема БД (удаление таблиц) | 12 |
| Схема БД (изменение структуры) | 5 |
| Функционал → v2.0 | 6 |
| Унификация политик | 4 |
| Удаление событий/задач | 3 |

---

## Часть 1: Терминология и роли

### 1.1 Иерархия ролей (5 уровней)

**Решение:** Использовать 5 ролей.

| Код роли | Уровень | Описание |
|----------|:-------:|----------|
| `staff` | 1 | Базовый доступ |
| `manager` | 2 | Работа с отзывами, контентом |
| `senior` | 3 | Расширенный доступ, модерация |
| `director` | 4 | Полный доступ к документам |
| `administrator` | 5 | Управление системой |
| `service` | — | Service Account для межмодульного API |

**Изменения:**
- Core PostgreSQL: `senior_manager` → `senior`
- Добавить роль `service` в CHECK constraint

### 1.2 Значение brand_id

**Решение:** Унифицировать `shared` → `all` везде.

| Контекст | Было | Стало |
|----------|------|-------|
| Пользователи | `all` | `all` (без изменений) |
| Документы | `shared` | `all` |
| Knowledge | `shared` | `all` |
| Reputation | `shared` | `all` |

### 1.3 Уровни доступа к документам

**Решение:** 4 уровня (без `administrator`).

```
staff → manager → senior → director
```

Administrator имеет полный доступ автоматически.

### 1.4 Категории документов

**Решение:** 7 категорий.

```
finance, contract, regulation, product, correspondence, analytics, other
```

---

## Часть 2: Модель данных пользователей

### 2.1 Привязка к брендам

**Решение:** Одно поле `brand_id` (не таблица `user_brands`).

**Изменения в Knowledge:**
- Удалить описание таблицы `user_brands`
- Удалить описание таблицы `brands` (справочник)
- Привести примеры к модели с одним `brand_id`

---

## Часть 3: Удаление таблиц из Core PostgreSQL

### 3.1 Таблицы модуля Watcher (не в скоупе Core)

| Таблица | Причина удаления |
|---------|------------------|
| `watcher_tasks` | Будет в документации Watcher |
| `agents` | Будет в документации Watcher |
| `price_history` | Будет в документации Watcher |
| `price_subscriptions` | Будет в документации Watcher |

### 3.2 Таблицы модуля CFO (не разработан)

| Таблица | Причина удаления |
|---------|------------------|
| `financial_transactions` | Будет в документации CFO |

### 3.3 Устаревшие таблицы

| Таблица | Причина удаления |
|---------|------------------|
| `reputation_log` | Заменена на `reputation_items` + `reputation_responses` |
| `product_knowledge` | Данные хранятся только в Timeweb KB |

---

## Часть 4: Удаление таблиц из Knowledge

| Таблица | Причина удаления |
|---------|------------------|
| `chat_messages` | История хранится в Open WebUI |
| `user_brands` | Используется модель с одним `brand_id` |
| `brands` | Не требуется справочник |

---

## Часть 5: Удаление таблиц из Reputation

| Таблица | Причина удаления |
|---------|------------------|
| `cross_sell_rules` | Cross-sell → v2.0 |
| `marketplace_credentials` | Credentials в environment variables |
| `user_notification_settings` | Упрощённый подход без персонализации |
| `response_quality_reviews` | Обратная связь → v2.0 |

---

## Часть 6: Изменения структуры таблиц

### 6.1 Core: таблица `settings`

**Добавить поля:**
```sql
category VARCHAR(50),
description TEXT
```

### 6.2 Core: таблица `users`

**Изменить CHECK constraint для `role`:**
```sql
CHECK (role IN ('staff', 'manager', 'senior', 'director', 'administrator', 'service'))
```

### 6.3 Reputation: таблица `reputation_items`

**Удалить поля:**
- `photo_urls`
- `video_urls`
- `local_media_paths`

**Изменить поле `ai_analysis`:**
Удалить секцию `vision` из структуры JSONB.

### 6.4 Reputation: таблица `reputation_responses`

**Удалить поля:**
- `cross_sell_sku`
- `cross_sell_text`

---

## Часть 7: Функционал, перенесённый в v2.0

| Функционал | Модуль | Что удалить |
|------------|--------|-------------|
| Vision-анализ фото | Reputation | Задача `analyze_photos`, секция vision в ai_analysis |
| Cross-sell рекомендации | Reputation | Таблица, поля, логика в AI Pipeline |
| Скачивание медиа | Reputation | Задачи `download_media`, `cleanup_media`, директория `/data/media/` |
| Обратная связь по ответам | Reputation | Таблица `response_quality_reviews` |
| Персонализация уведомлений | Core | Таблица `user_notification_settings` |
| Яндекс.Маркет | — | **НЕ переносится** — включён в v4.0 |

---

## Часть 8: Унификация политик

### 8.1 Единая политика обработки ошибок

| Параметр | Значение |
|----------|----------|
| Timeout запроса | 30 секунд |
| Retry стратегия | Exponential backoff: 1с → 2с → 4с |
| Максимум попыток | 3 |
| Circuit breaker открытие | После 5 последовательных ошибок |
| Circuit breaker reset | 60 секунд |

### 8.2 Единая retention policy

| Категория | Срок | Действие |
|-----------|------|----------|
| Временные (raw_text_dump, temp) | 3 дня | Удаление |
| Служебные (audit_log, quarantine, celery_task_log, sessions) | 30 дней | Удаление |
| Операционные (reputation_items, responses) | 12 месяцев | Архивация |
| Аналитика (reputation_analytics) | 24 месяца | Удаление |
| Критичные (документы KB) | Бессрочно | — |

### 8.3 AI модели

| Задача | Модель |
|--------|--------|
| OCR документов | GPT-5 mini |
| Классификация документов | GPT-5 mini |
| Генерация ответов на отзывы | GPT-5 mini |
| Эскалированные случаи | Claude Opus 4.5 |
| Аналитика (CFO, Scout) | Claude Opus 4.5 |

### 8.4 Унифицированная структура API

```
/api/v1/{module}/...
```

Примеры:
- `/api/v1/knowledge/search`
- `/api/v1/reputation/items`

---

## Часть 9: Celery Tasks

### 9.1 Централизованный schedule в Core

Все задачи всех модулей регистрируются в Core Celery Beat.

### 9.2 Распределённый polling (Reputation)

| Задача | Смещение |
|--------|----------|
| `poll_wb_reviews` | :00 |
| `poll_wb_questions` | :50 |
| `poll_ozon_reviews` | 1:40 |
| `poll_ozon_questions` | 2:30 |
| `poll_ym_reviews` | 3:20 |
| `poll_ym_questions` | 4:10 |

### 9.3 Удаляемые задачи из Reputation

| Задача | Причина |
|--------|---------|
| `analyze_photos` | Vision → v2.0 |
| `download_media` | Медиа → v2.0 |
| `cleanup_media` | Медиа → v2.0 |
| `check_credentials` | Credentials в env |

---

## Часть 10: Система уведомлений

### 10.1 Удаляемые события (модули не разработаны)

**Watcher:**
- `price.dumping`
- `price.competitor_out`
- `agent.captcha`
- `agent.banned`
- `agent.offline`

**Marketing:**
- `campaign.budget_exceeded`
- `campaign.paused`
- `campaign.low_ctr`

**CFO:**
- `finance.margin_alert`
- `finance.report_ready`

### 10.2 Актуальные события v4.0

| Event Type | Модуль | Уровень |
|------------|--------|---------|
| `review.new` | Reputation | info |
| `question.new` | Reputation | info |
| `review.negative` | Reputation | warning |
| `document.pending_moderation` | ETL | info |
| `document.approved` | ETL | info |
| `document.rejected` | ETL | warning |
| `document.indexed` | ETL | info |
| `document.quarantine` | ETL | warning |
| `api.token_expiring` | System | warning |
| `api.token_expired` | System | critical |
| `service.unhealthy` | System | critical |
| `service.recovered` | System | info |

---

## Часть 11: Структура директорий

### 11.1 Итоговая структура `/data/`

```
/data/
├── inbox/                  # Входящие документы (ETL)
├── archive/                # Обработанные документы
├── quarantine/             # Документы с ошибками
└── temp/                   # Временные файлы
```

**Удалено:** `/data/media/reputation/` (медиа → v2.0)

---

## Часть 12: Платформы маркетплейсов

**Решение:** Все три платформы включены в v4.0.

| Платформа | Код | Статус |
|-----------|-----|--------|
| Wildberries | `wb` | ✅ v4.0 |
| Ozon | `ozon` | ✅ v4.0 |
| Яндекс.Маркет | `ym` | ✅ v4.0 |

---

## Часть 13: Исправления в коде/примерах

### 13.1 Knowledge

- Заменить `brand_ids` (массив) → `brand_id` (строка)
- Заменить `shared` → `all`
- Удалить примеры с `user_brands`

### 13.2 Reputation

- Заменить `senior_manager` → `senior`
- Удалить `has_defect` из фильтров Tools
- Удалить Cross-sell из примеров API
- Удалить Vision из примеров AI Pipeline

### 13.3 Core

- Обновить CHECK constraints
- Удалить примеры с несуществующими таблицами

---

## Следующие шаги

1. Сформировать артефакты с исправленными главами для каждого модуля
2. Порядок: Core → Knowledge → Reputation
3. Включать только главы, требующие изменений

---

## Часть 14: Дополнительные исправления (обнаружены при анализе)

### 14.1 Структура директорий — унификация

**Решение:** Единый базовый путь `/data/` для всех модулей.

```
/data/
├── inbox/                  # Входящие документы
├── processing/             # Документы в обработке
├── converted/              # Сконвертированные .md
├── archive/                # Обработанные оригиналы
├── quarantine/             # Документы с ошибками
├── temp/                   # Временные файлы
└── logs/                   # Логи ETL
```

**Изменения:**
- Knowledge: `/var/adolf/` → `/data/`

### 14.2 Категории документов — расширенный перечень

**Решение:** 10 категорий (включая `other`).

| Код | Описание |
|-----|----------|
| `finance` | Финансовые документы |
| `contract` | Договоры |
| `regulation` | Регламенты, инструкции |
| `product` | Информация о товарах |
| `correspondence` | Переписка |
| `analytics` | Аналитические отчёты |
| `hr` | Кадровые документы |
| `logistics` | Логистика, склад |
| `marketing` | Маркетинг, реклама |
| `other` | Прочее |

**Изменения:**
- Добавить `analytics` в Knowledge Data Sources
- Обновить глоссарий

### 14.3 Исправления в примерах кода

| Документ | Исправление |
|----------|-------------|
| Knowledge (сценарии) | `Senior Manager` → `Senior` в pie chart |
| Knowledge (аналитика) | `user_brands VARCHAR[]` → `user_brand_id VARCHAR(50)` |
| Reputation (сценарии) | Удалить "Настройка Cross-Sell" из карты |
| Reputation (сценарии) | Удалить "Отзыв с браком" из статистики |
| Reputation (polling) | Удалить Media Downloader из архитектуры |
| Reputation (polling) | Добавить смещения в Celery Beat schedule |
| Reputation (архитектура) | Удалить `vision_analyzer.py` из структуры |

### 14.4 Удаление целей модуля Reputation

| Цель | Причина удаления |
|------|------------------|
| "Выявление проблем — анализ фото на брак" | Vision → v2.0 |
| "Увеличение продаж — Cross-sell рекомендации" | Cross-sell → v2.0 |

### 14.5 Обновление границ модуля Reputation

**Удалить из "Входит в модуль":**
- AI Pipeline → Vision-анализ фото
- Cross-Sell Engine

---

## Сводка всех изменений по документам

### Core

| Документ | Изменения |
|----------|-----------|
| `adolf_core_2_5_postgresql.md` | Удалить таблицы Watcher/CFO, изменить roles, расширить settings |
| `adolf_core_2_6_notifications.md` | Удалить события несуществующих модулей |
| `adolf_core_2_4_celery.md` | Добавить schedule для Reputation tasks |
| `adolf_core_2_1_architecture.md` | Обновить структуру `/data/` |

### Knowledge

| Документ | Изменения |
|----------|-----------|
| `adolf_knowledge_2_data_sources.md` | Добавить `analytics`, убрать `user_brands` |
| `adolf_knowledge_3_rag_pipeline.md` | `shared` → `all`, убрать `chat_messages` |
| `adolf_knowledge_4_access_control.md` | `senior_manager` → `senior`, `shared` → `all` |
| `adolf_knowledge_5_kb_management.md` | `/var/adolf/` → `/data/` |
| `adolf_knowledge_6_user_scenarios.md` | `Senior Manager` → `Senior` |
| `adolf_knowledge_8_analytics.md` | `user_brands` → `user_brand_id` |
| `adolf_knowledge_glossary.md` | Добавить `analytics` |

### Reputation

| Документ | Изменения |
|----------|-----------|
| `adolf_reputation_0_introduction.md` | Удалить Vision, Cross-sell из целей |
| `adolf_reputation_1_architecture.md` | Удалить Vision, Cross-sell, media, credentials |
| `adolf_reputation_2_polling.md` | Удалить Media Downloader, добавить schedule offsets |
| `adolf_reputation_3_ai_pipeline.md` | Удалить Vision, Cross-sell логику |
| `adolf_reputation_4_open_webui.md` | Удалить has_defect, cross_sell, user_notification_settings |
| `adolf_reputation_5_database.md` | Удалить таблицы и поля (см. Часть 5-6) |
| `adolf_reputation_6_scenarios.md` | Удалить Cross-sell, Vision из сценариев |
| `adolf_reputation_7_celery.md` | Удалить analyze_photos, download_media, check_credentials |

---

**Документ подготовлен:** Январь 2026  
**Статус:** Анализ завершён. Готов к формированию исправленных глав.

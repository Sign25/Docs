# ADOLF Documentation

Техническая документация проекта ADOLF (AI-Driven Operations for Logistics and Fashion Development) - платформы автоматизации e-commerce для ОХАНА МАРКЕТ.

## Структура репозитория

```
docs/
├── ADOLF_OVERVIEW_v4_2.md           # Общий обзор платформы
├── adolf_roadmap.md                  # Дорожная карта проекта
├── adolf_fastapi_reference_v1_0.md   # Справочник FastAPI
├── adolf_inconsistencies_registry.md # Реестр несоответствий
│
├── core/                             # Базовая инфраструктура
├── knowledge/                        # База знаний (RAG)
├── reputation/                       # Управление отзывами
├── watcher/                          # Мониторинг конкурентов
├── content_factory/                  # Генерация контента
├── marketing/                        # Маркетинговые кампании
├── scout/                            # Анализ ниш
├── cfo/                              # Финансовая отчётность
├── lex/                              # Правовой мониторинг
├── shop/                             # Управление интернет-магазином
└── office/                           # Визуальный дашборд агентов
```

## Модули платформы

| Модуль | Описание | Версия | Репозиторий |
|--------|----------|--------|-------------|
| **Core** | Базовая инфраструктура: Open WebUI, PostgreSQL, уведомления | v4.1 | — |
| **Knowledge** | Корпоративная база знаний с RAG-пайплайном | v1.1 | — |
| **Reputation** | AI-генерация ответов на отзывы маркетплейсов | v2.1 | — |
| **Watcher** | Мониторинг цен и действий конкурентов | v2.0 | — |
| **Content Factory** | SEO-оптимизированный контент для карточек товаров | v1.0 | — |
| **Marketing** | Автоматизация рекламных кампаний | v1.0 | — |
| **Scout** | Предиктивный анализ рыночных ниш | v1.0 | — |
| **CFO** | Финансовая отчётность и аналитика | v1.0 | — |
| **Lex** | Мониторинг правовых изменений | v1.0 | — |
| **Shop** | AI-управление интернет-магазином через WooCommerce MCP | v1.0 | — |
| **Office** | Визуальный дашборд AI-агентов | v1.0 | [Sign25/Office](https://github.com/Sign25/Office) |

## Технологический стек

- **Backend**: FastAPI, Python 3.11+
- **Database**: PostgreSQL 15+, Redis
- **Task Queue**: Celery
- **AI**: GPT-5 mini (Timeweb AI), Claude Opus 4.5
- **Interface**: Open WebUI с кастомными Pipelines и Tools
- **Auth**: API Key + Role-based Access Control
- **E-commerce**: WooCommerce 10.4+ с MCP Integration

## Целевые платформы

### Маркетплейсы
- Wildberries
- Ozon
- Yandex.Market

### Интернет-магазин
- ohana.market (WooCommerce)

## Документация модулей

Каждый модуль содержит стандартный набор документов:
- `0_introduction` - Введение и обзор модуля
- `1_architecture` - Архитектура и компоненты
- `2_*` - Специфичная функциональность модуля
- `3_ai_pipeline` - AI-пайплайн обработки
- `4_open_webui` - Интеграция с интерфейсом
- `5_database` / `5_scenarios` - Схема БД или сценарии
- `6_scenarios` / `6_celery` - Сценарии или фоновые задачи
- `7_celery` - Фоновые задачи (если есть)

---

*Последнее обновление: Январь 2026*

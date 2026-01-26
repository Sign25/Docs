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
│   ├── adolf_core_0_introduction.md
│   ├── adolf_core_1_1_open_webui_overview_v4_1.md
│   ├── adolf_core_1_2_open_webui_pipelines_v4_1.md
│   ├── adolf_core_1_3_open_webui_tools_v4_1.md
│   ├── adolf_core_1_4_open_webui_pwa_auth_v4_1.md
│   ├── adolf_core_2_5_postgresql_v4_1.md
│   ├── adolf_core_2_6_notifications_v4_1.md
│   └── adolf_core_roadmap.md
│
├── knowledge/                        # База знаний (RAG)
│   ├── adolf_knowledge_1_introduction_v1_1.md
│   ├── adolf_knowledge_2_data_sources_v1_1.md
│   ├── adolf_knowledge_3_rag_pipeline_v1_1.md
│   ├── adolf_knowledge_4_access_control_v1_1.md
│   ├── adolf_knowledge_5_kb_management_v1_1.md
│   ├── adolf_knowledge_6_user_scenarios_v1_1.md
│   ├── adolf_knowledge_7_integrations_v1_1.md
│   ├── adolf_knowledge_8_analytics_v1_1.md
│   └── adolf_knowledge_glossary_v1_1.md
│
├── reputation/                       # Управление отзывами
│   ├── adolf_reputation_0_introduction_v2_1.md
│   ├── adolf_reputation_1_architecture_v2_1.md
│   ├── adolf_reputation_2_polling_v2_1.md
│   ├── adolf_reputation_3_ai_pipeline_v2_1.md
│   ├── adolf_reputation_4_open_webui_v2_1.md
│   ├── adolf_reputation_5_database_v2_1.md
│   ├── adolf_reputation_6_scenarios_v2_1.md
│   └── adolf_reputation_7_celery_v2_1.md
│
├── watcher/                          # Мониторинг конкурентов
│   ├── adolf_watcher_0_introduction_v2_0.md
│   ├── adolf_watcher_1_architecture_v2_0.md
│   ├── adolf_watcher_2_agent_v2_0.md
│   ├── adolf_watcher_3_task_dispatcher_v2_0.md
│   ├── adolf_watcher_4_ai_parser_v2_0.md
│   ├── adolf_watcher_5_database_v2_0.md
│   ├── adolf_watcher_6_open_webui_v2_0.md
│   └── adolf_watcher_7_celery_v2_0.md
│
├── content_factory/                  # Генерация контента
│   ├── adolf_content_factory_0_introduction_v1_0.md
│   ├── adolf_content_factory_1_architecture_v1_0.md
│   ├── adolf_content_factory_2_marketplace_adapters_v1_0.md
│   ├── adolf_content_factory_3_ai_pipeline_v1_0.md
│   ├── adolf_content_factory_4_open_webui_v1_0.md
│   ├── adolf_content_factory_5_database_v1_0.md
│   ├── adolf_content_factory_6_scenarios_v1_0.md
│   └── adolf_content_factory_7_celery_v1_0.md
│
├── marketing/                        # Маркетинговые кампании
│   ├── adolf_marketing_0_introduction_v1_0.md
│   ├── adolf_marketing_1_architecture_v1_0.md
│   ├── adolf_marketing_2_marketplace_adapters_v1_0.md
│   ├── adolf_marketing_3_ai_pipeline_v1_0.md
│   ├── adolf_marketing_4_open_webui_v1_0.md
│   ├── adolf_marketing_5_database_v1_0.md
│   ├── adolf_marketing_6_scenarios_v1_0.md
│   └── adolf_marketing_7_celery_v1_0.md
│
├── scout/                            # Анализ ниш
│   ├── adolf_scout_0_introduction_v1_0.md
│   ├── adolf_scout_1_architecture_v1_0.md
│   ├── adolf_scout_2_data_sources_v1_0.md
│   ├── adolf_scout_3_ai_pipeline_v1_0.md
│   ├── adolf_scout_4_open_webui_v1_0.md
│   ├── adolf_scout_5_database_v1_0.md
│   ├── adolf_scout_6_scenarios_v1_0.md
│   └── adolf_scout_7_celery_v1_0.md
│
├── cfo/                              # Финансовая отчётность
│   ├── adolf_cfo_0_introduction_v1_0.md
│   ├── adolf_cfo_1_architecture_v1_0.md
│   ├── adolf_cfo_2_data_ingestion_v1_0.md
│   ├── adolf_cfo_3_ai_pipeline_v1_0.md
│   ├── adolf_cfo_4_open_webui_v1_0.md
│   ├── adolf_cfo_5_database_v1_0.md
│   ├── adolf_cfo_6_scenarios_v1_0.md
│   └── adolf_cfo_7_celery_v1_0.md
│
├── lex/                              # Правовой мониторинг
│   ├── adolf_lex_0_introduction_v1_0.md
│   ├── adolf_lex_1_architecture_v1_0.md
│   ├── adolf_lex_2_data_sources_v1_0.md
│   ├── adolf_lex_3_ai_pipeline_v1_0.md
│   ├── adolf_lex_4_open_webui_v1_0.md
│   ├── adolf_lex_5_database_v1_0.md
│   ├── adolf_lex_6_scenarios_v1_0.md
│   └── adolf_lex_7_celery_v1_0.md
│
├── shop/                             # Управление интернет-магазином
│   ├── adolf_shop_0_introduction_v1_0.md
│   ├── adolf_shop_1_architecture_v1_0.md
│   ├── adolf_shop_2_mcp_integration_v1_0.md
│   ├── adolf_shop_3_ai_pipeline_v1_0.md
│   ├── adolf_shop_4_open_webui_v1_0.md
│   ├── adolf_shop_5_scenarios_v1_0.md
│   └── adolf_shop_6_celery_v1_0.md
│
└── office/                           # Офисные коммуникации
    ├── adolf_office_0_introduction_v1_0.md
    ├── adolf_office_1_architecture_v1_0.md
    ├── adolf_office_2_database_v1_0.md
    ├── adolf_office_3_api_v1_0.md
    ├── adolf_office_4_open_webui_v1_0.md
    ├── adolf_office_5_scenarios_v1_0.md
    ├── adolf_office_6_celery_v1_0.md
    └── adolf_office_7_visual_v1_0.md
```

## Модули платформы

| Модуль | Описание | Версия |
|--------|----------|--------|
| **Core** | Базовая инфраструктура: Open WebUI, PostgreSQL, уведомления | v4.1 |
| **Knowledge** | Корпоративная база знаний с RAG-пайплайном | v1.1 |
| **Reputation** | AI-генерация ответов на отзывы маркетплейсов | v2.1 |
| **Watcher** | Мониторинг цен и действий конкурентов | v2.0 |
| **Content Factory** | SEO-оптимизированный контент для карточек товаров | v1.0 |
| **Marketing** | Автоматизация рекламных кампаний | v1.0 |
| **Scout** | Предиктивный анализ рыночных ниш | v1.0 |
| **CFO** | Финансовая отчётность и аналитика | v1.0 |
| **Lex** | Мониторинг правовых изменений | v1.0 |
| **Shop** | AI-управление интернет-магазином через WooCommerce MCP | v1.0 |
| **Office** | Управление офисными коммуникациями | v1.0 |

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

## Документация

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
*Всем спасибо*

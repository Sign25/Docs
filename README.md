# ADOLF Documentation

Техническая документация проекта ADOLF (AI-Driven Operations for Logistics and Fashion Development) — платформы автоматизации e-commerce для ОХАНА МАРКЕТ.

## Структура репозитория

```
docs/
├── ADOLF_OVERVIEW_v4_3.md           # Общий обзор платформы
├── adolf_fastapi_reference_v1_1.md  # Справочник FastAPI
│
├── core/                            # Базовая инфраструктура (9 файлов)
│   ├── adolf_core_0_introduction.md
│   ├── adolf_core_1_1_open_webui_overview_v4_1.md
│   ├── adolf_core_1_2_open_webui_pipelines_v4_1.md
│   ├── adolf_core_1_3_open_webui_tools_v4_1.md
│   ├── adolf_core_1_4_open_webui_pwa_auth_v4_1.md
│   ├── adolf_core_2_5_postgresql_v4_1.md
│   ├── adolf_core_2_6_notifications_v4_1.md
│   ├── adolf_core_3_1_launcher_v1_0.md
│   └── adolf_core_roadmap.md
│
├── knowledge/                       # База знаний (9 файлов)
├── reputation/                      # Управление отзывами (7 файлов)
├── watcher/                         # Мониторинг конкурентов (7 файлов)
├── content_factory/                 # Генерация контента (7 файлов)
├── marketing/                       # Маркетинговые кампании (7 файлов)
├── scout/                           # Анализ ниш (7 файлов)
├── cfo/                             # Финансовая отчётность (7 файлов)
├── lex/                             # Правовой мониторинг (7 файлов)
├── shop/                            # Управление интернет-магазином (6 файлов)
├── office/                          # Визуальный дашборд агентов (8 файлов)
├── logistic/                        # Оптимизация логистики (9 файлов)
│
└── ui_reference/                    # UI справочник и стили
    ├── base/                        # Базовые токены и стили
    ├── cfo/                         # UI компоненты CFO
    ├── content_factory/             # UI компоненты Content Factory
    ├── knowledge/                   # UI компоненты Knowledge
    └── reputation/                  # UI компоненты Reputation
```

## Модули платформы

| Модуль | Описание | Версия | Документов |
|--------|----------|:------:|:----------:|
| **Core** | Базовая инфраструктура: Open WebUI, PostgreSQL, уведомления, Launcher | v4.1 | 9 |
| **Knowledge** | Корпоративная база знаний с RAG-пайплайном | v1.1 | 9 |
| **Reputation** | AI-генерация ответов на отзывы маркетплейсов | v2.1 | 7 |
| **Watcher** | Мониторинг цен и действий конкурентов | v2.0 | 7 |
| **Content Factory** | SEO-оптимизированный контент для карточек товаров | v1.0 | 7 |
| **Marketing** | Автоматизация рекламных кампаний | v1.0 | 7 |
| **Scout** | Предиктивный анализ рыночных ниш | v1.0 | 7 |
| **CFO** | Финансовая отчётность и аналитика | v1.0 | 7 |
| **Lex** | Мониторинг правовых изменений | v1.0 | 7 |
| **Shop** | AI-управление интернет-магазином через WooCommerce MCP | v1.0 | 6 |
| **Office** | Визуальный дашборд AI-агентов | v1.0 | 8 |
| **Logistic** | Оптимизация логистики маркетплейсов, минимизация кросс-докинга | v1.0 | 9 |

**Внешний репозиторий:** [Sign25/Office](https://github.com/Sign25/Office) — исходный код модуля Office

## Компоненты Core

| Компонент | Документ | Описание |
|-----------|----------|----------|
| Introduction | `adolf_core_0_introduction.md` | Введение в Core |
| Open WebUI Overview | `adolf_core_1_1_open_webui_overview_v4_1.md` | Архитектура и установка |
| Pipelines | `adolf_core_1_2_open_webui_pipelines_v4_1.md` | Интерфейс и агенты модулей |
| Tools | `adolf_core_1_3_open_webui_tools_v4_1.md` | Function Calling инструменты |
| PWA & Auth | `adolf_core_1_4_open_webui_pwa_auth_v4_1.md` | PWA и аутентификация |
| PostgreSQL | `adolf_core_2_5_postgresql_v4_1.md` | Схема базы данных |
| Notifications | `adolf_core_2_6_notifications_v4_1.md` | Система уведомлений |
| **Launcher** | `adolf_core_3_1_launcher_v1_0.md` | Система баннерного подменю |
| Roadmap | `adolf_core_roadmap.md` | Дорожная карта Core |

## Launcher — Система баннерного подменю

Launcher обеспечивает двухуровневую навигацию с визуальным выбором действий:

```
Sidebar (модуль) → Launcher Page (баннеры) → Result Page (результат)
```

**Ключевые особенности:**
- Код запускается только после явного выбора действия
- JSON-конфигурация баннеров для MVP
- Контроль доступа на уровне модуля
- Отдельная страница результата с навигацией назад

Подробнее: [adolf_core_3_1_launcher_v1_0.md](core/adolf_core_3_1_launcher_v1_0.md)

## Матрица доступа к модулям

| Модуль | Staff | Manager | Senior | Director | Admin |
|--------|:-----:|:-------:|:------:|:--------:|:-----:|
| Knowledge (Public) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Knowledge (Manager) | ❌ | Бренд | Все | Все | Все |
| Reputation | ❌ | Бренд | Все | Все | Все |
| Watcher | ❌ | ✅ | ✅ | ✅ | ✅ |
| Content Factory | ❌ | ❌ | ✅ | ✅ | ✅ |
| Marketing | ❌ | Бренд | Все | Все | Все |
| Scout | ❌ | ❌ | ✅ | ✅ | ✅ |
| CFO | ❌ | ❌ | ✅ | ✅ | ✅ |
| Lex | ❌ | ✅ | ✅ | ✅ | ✅ |
| Shop | ❌ | ❌ | ✅ | ✅ | ✅ |
| Office | ❌ | ❌ | ❌ | Бренд | ✅ |
| Logistic | ❌ | Бренд | Все | Все | Все |

## Технологический стек

| Категория | Технологии |
|-----------|------------|
| **Backend** | FastAPI, Python 3.11+ |
| **Database** | PostgreSQL 15+, Redis |
| **Task Queue** | Celery |
| **AI** | GPT-5 mini (Timeweb AI), Claude Opus 4.5 |
| **Interface** | Open WebUI с кастомными Pipelines и Tools |
| **Auth** | API Key + Role-based Access Control |
| **E-commerce** | WooCommerce 10.4+ с MCP Integration |

## Целевые платформы

**Маркетплейсы:** Wildberries, Ozon, Yandex.Market

**Интернет-магазин:** ohana.market (WooCommerce)

## Документация модулей

Каждый модуль содержит стандартный набор документов:

| Индекс | Документ | Описание |
|:------:|----------|----------|
| 0 | `introduction` | Введение и обзор модуля |
| 1 | `architecture` | Архитектура и компоненты |
| 2 | `*` | Специфичная функциональность (data_sources, adapters, polling) |
| 3 | `ai_pipeline` | AI-пайплайн обработки |
| 4 | `open_webui` | Интеграция с интерфейсом |
| 5 | `database` | Схема базы данных |
| 6 | `scenarios` | Пользовательские сценарии |
| 7 | `celery` | Фоновые задачи |

## UI Reference

Визуальный справочник компонентов интерфейса.

| Папка | Содержимое |
|-------|------------|
| `base/` | Базовые CSS-переменные, токены shadcn/ui, иконки |
| `cfo/` | Демо-страница и стили модуля CFO |
| `content_factory/` | Демо-страница и стили Content Factory |
| `knowledge/` | Демо-страница и стили Knowledge |
| `reputation/` | Демо-страница и стили Reputation |

---

*Последнее обновление: Январь 2026*

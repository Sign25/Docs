---
title: "ADOLF Documentation"
description: "ADOLF Platform - AI-driven e-commerce automation"
mode: "wide"
---

# ADOLF Documentation

Техническая документация проекта ADOLF (AI-Driven Operations for Logistics and Fashion Development) — платформы автоматизации e-commerce для ОХАНА МАРКЕТ.

## Структура репозитория

```
docs/
├── ADOLF_OVERVIEW.md                # Общий обзор платформы
├── adolf_fastapi_reference.md       # Справочник FastAPI
│
├── core/                            # Базовая инфраструктура (9 файлов)
├── knowledge/                       # База знаний (9 файлов)
├── reputation/                      # Управление отзывами (7 файлов)
├── watcher/                         # Мониторинг конкурентов (9 файлов)
├── content_factory/                 # Генерация контента (7 файлов)
├── marketing/                       # Маркетинговые кампании (7 файлов)
├── scout/                           # Анализ ниш (7 файлов)
├── cfo/                             # Финансовая отчётность (7 файлов)
├── lex/                             # Правовой мониторинг (7 файлов)
├── shop/                            # Управление интернет-магазином (6 файлов)
├── office/                          # Визуальный дашборд агентов (8 файлов)
├── logistic/                        # Оптимизация логистики (9 файлов)
│
├── ui/                              # Документация дизайн-системы
│   ├── adolf_ui_0_introduction.md   # Введение в дизайн-систему
│   ├── adolf_ui_1_foundations.md     # Основы: цвета, типографика, отступы
│   ├── adolf_ui_2_module_theming.md  # Тематизация модулей и маркетплейсов
│   ├── adolf_ui_3_components.md      # Каталог компонентов shadcn/ui
│   ├── adolf_ui_4_layout_patterns.md # Паттерны компоновки
│   ├── adolf_ui_appendix_a_icons.md  # Приложение A: Реестр иконок Open WebUI
│   └── icons/                       # SVG-иконки модулей (stroke-width 1.5px)
```

## Модули платформы

| Модуль | Описание | Версия | Документов |
|--------|----------|:------:|:----------:|
| **Core** | Базовая инфраструктура: Open WebUI, PostgreSQL, уведомления, Launcher | v4.1 | 9 |
| **Knowledge** | Корпоративная база знаний с RAG-пайплайном | v1.1 | 9 |
| **Reputation** | AI-генерация ответов на отзывы маркетплейсов | v2.1 | 7 |
| **Watcher** | Мониторинг цен и действий конкурентов | v3.0 | 9 |
| **Content Factory** | SEO-оптимизированный контент для карточек товаров | v1.0 | 7 |
| **Marketing** | Автоматизация рекламных кампаний | v1.0 | 7 |
| **Scout** | Предиктивный анализ рыночных ниш | v1.0 | 7 |
| **CFO** | Финансовая отчётность и аналитика | v1.0 | 7 |
| **Lex** | Мониторинг правовых изменений | v1.0 | 7 |
| **Shop** | AI-управление интернет-магазином через WooCommerce MCP | v1.0 | 6 |
| **Office** | Визуальный дашборд AI-агентов | v1.0 | 9 |
| **Logistic** | Оптимизация логистики Ozon: наряд-задания, прогноз спроса, интеграция 1С | v2.0 | 9 |
| **UI** | Дизайн-система на базе shadcn/ui + Lucide Icons | v1.0 | 5 |

**Внешний репозиторий:** [Sign25/Office](https://github.com/Sign25/Office) — исходный код модуля Office

## Дизайн-система (UI)

Документация дизайн-системы ADOLF на базе [shadcn/ui](https://ui.shadcn.com/) + [Lucide Icons](https://lucide.dev/).

| Раздел | Файл | Описание |
|:-------|:-----|:---------|
| 0. Введение | `adolf_ui_0_introduction.md` | Обзор, архитектура, принципы |
| 1. Основы | `adolf_ui_1_foundations.md` | CSS-переменные, OKLCH-цвета, типографика, отступы, темы |
| 2. Тематизация | `adolf_ui_2_module_theming.md` | Единая цветовая схема, иконки, маркетплейсы, статусные цвета |
| 3. Компоненты | `adolf_ui_3_components.md` | Каталог shadcn-компонентов с примерами |
| 4. Паттерны | `adolf_ui_4_layout_patterns.md` | Launcher, sidebar, dashboard cards, формы |

| Прил. A | `adolf_ui_appendix_a_icons.md` | Реестр Lucide-иконок для Open WebUI |

## Компоненты Core

| Компонент | Документ | Описание |
|-----------|----------|----------|
| Introduction | `adolf_core_0_introduction.md` | Введение в Core |
| Open WebUI Overview | `adolf_core_1_1_open_webui_overview.md` | Архитектура и установка |
| Pipelines | `adolf_core_1_2_open_webui_pipelines.md` | Интерфейс и агенты модулей |
| Tools | `adolf_core_1_3_open_webui_tools.md` | Function Calling инструменты |
| PWA & Auth | `adolf_core_1_4_open_webui_pwa_auth.md` | PWA и аутентификация |
| PostgreSQL | `adolf_core_2_5_postgresql.md` | Схема базы данных |
| Notifications | `adolf_core_2_6_notifications.md` | Система уведомлений |
| Launcher | `adolf_core_3_1_launcher.md` | Система баннерного подменю |

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
| **UI** | shadcn/ui + Tailwind CSS + Lucide Icons |
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

---

*Последнее обновление: Февраль 2026*

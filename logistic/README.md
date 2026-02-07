---
title: "Logistic"
mode: "wide"
---

# ADOLF Logistic — Документация модуля

**Версия модуля:** 2.0  
**Маркетплейс:** Ozon (Seller API)  
**Дата обновления:** Февраль 2026

---

## Структура документации

| # | Документ | Версия | Описание |
|:-:|----------|:------:|----------|
| 0 | [Introduction](adolf_logistic_0_introduction.md) | 2.0 | Назначение, бизнес-модель, архитектурный обзор |
| 1 | [Architecture](adolf_logistic_1_architecture.md) | 2.0 | Компоненты, потоки данных, кэширование, мониторинг |
| 2 | [Ozon Integration](adolf_logistic_2_ozon_integration.md) | 2.0 | Ozon Seller API, endpoints, маппинг, rate limits |
| 3 | [Stock Monitor](adolf_logistic_3_stock_monitor.md) | 2.0 | Мониторинг остатков FBO + 1С, velocity, прогноз, алерты |
| 4 | [Supply Task Engine](adolf_logistic_4_supply_task_engine.md) | 2.0 | Наряд-задания, расчёт дефицита, жизненный цикл |
| 5 | [1С Integration](adolf_logistic_5_1c_integration.md) | 2.0 | Файловый импорт XLSX/XML из 1С |
| 6 | [Database](adolf_logistic_6_database.md) | 2.0 | Схема БД: кластеры, остатки FBO/1С, наряд-задания |
| 7 | [Open WebUI](adolf_logistic_7_open_webui.md) | 2.0 | Диалоговый интерфейс: 8 tools для FBO + 1С + задания |
| 8 | [Celery](adolf_logistic_8_celery.md) | 2.0 | 9 фоновых задач: Ozon sync + 1С import + supply tasks |

---

## Ключевые изменения v1.0 → v2.0

| Аспект | v1.0 | v2.0 |
|--------|------|------|
| Маркетплейс | Wildberries | Ozon |
| Склады | ~15 складов WB | 31 кластер FBO Ozon |
| Источники данных | WB API | Ozon Seller API + 1С (файловый) |
| Пороги | Абсолютные (&lt; 10 шт) | По дням до обнуления (&lt; 3 дн.) |
| Анализ | Постфактум кросс-докинг | Превентивные наряд-задания |
| Velocity | Простое деление | Ozon avg_daily + WMA fallback |
| Celery tasks | 6 задач (WB sync + forecast) | 9 задач (Ozon + 1С + supply tasks) |
| Open WebUI tools | 5 tools (WB stocks + cross-dock) | 8 tools (FBO + 1С + task workflow) |
| БД таблиц | 11 (WB-centric) | 8 (Ozon + 1С focused) |

---

## Технологический стек

- **API:** Ozon Seller API (POST-only, ~5 RPS)
- **Импорт:** 1С XLSX/XML (2 раза в день: 08:00, 14:00)
- **Backend:** FastAPI, Celery, Redis, PostgreSQL
- **AI:** GPT-5 mini (routine), Claude Opus 4.5 (analytics)
- **UI:** Open WebUI (Pipeline + 8 Tools)

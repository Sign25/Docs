---
title: "Logistic"
mode: "wide"
---

# ADOLF Logistic — Документация модуля

**Версия модуля:** 2.1  
**Маркетплейс:** Ozon (Seller API)  
**Дата обновления:** Февраль 2026

---

## Структура документации

| # | Документ | Версия | Описание |
|:-:|----------|:------:|----------|
| 0 | [Introduction](adolf_logistic_0_introduction.md) | 2.0 | Назначение, бизнес-модель, архитектурный обзор |
| 1 | [Architecture](adolf_logistic_1_architecture.md) | 2.1 | Компоненты, потоки данных, кэширование, мониторинг |
| 2 | [Ozon Integration](adolf_logistic_2_ozon_integration.md) | 2.0 | Ozon Seller API, endpoints, маппинг, rate limits |
| 3 | [Stock Monitor](adolf_logistic_3_stock_monitor.md) | 2.1 | Мониторинг остатков FBO + brain_stock_balance, velocity, прогноз, алерты |
| 4 | [Supply Task Engine](adolf_logistic_4_supply_task_engine.md) | 2.0 | Наряд-задания, расчёт дефицита, жизненный цикл |
| 5 | [1С Integration](adolf_logistic_5_1c_integration.md) | 3.0 | Синхронизация из brain_* таблиц PostgreSQL (замена файлового импорта) |
| 6 | [Database](adolf_logistic_6_database.md) | 2.0 | Схема БД: кластеры, остатки FBO/1С, наряд-задания |
| 7 | [Open WebUI](adolf_logistic_7_open_webui.md) | 2.1 | Dashboard-first интерфейс: 13 tools, баннеры, наряд-задания workflow |
| 8 | [Celery](adolf_logistic_8_celery.md) | 2.1 | 10 фоновых задач: Ozon sync + brain_* sync + supply tasks |

---

## Ключевые изменения v2.0 → v2.1

| Аспект | v2.0 | v2.1 |
|--------|------|------|
| Источник данных 1С | Файловый импорт XLSX/XML через SFTP | PostgreSQL `brain_*` таблицы (Экстрактор данных 1С) |
| Компоненты 1С | FileScanner + FileImportAdapter | BrainDataReader + HistoryService |
| История остатков | warehouse_stocks_history | logistic_stock_history (ежедневные снимки) |
| Celery tasks (1С) | import_1c_stocks (2×/день) + cleanup_import_archive | sync_brain_stocks + check_brain_freshness + cleanup_stock_history |
| Мониторинг 1С | Сканирование директории | Проверка `loaded_at` в brain_* (порог 26ч) |
| Зависимости | openpyxl, lxml | Прямое чтение SQL (без парсинга) |

---

## Ключевые изменения v1.0 → v2.0

| Аспект | v1.0 | v2.0 |
|--------|------|------|
| Маркетплейс | Wildberries | Ozon |
| Склады | ~15 складов WB | 31 кластер FBO Ozon |
| Источники данных | WB API | Ozon Seller API + 1С |
| Пороги | Абсолютные (&lt; 10 шт) | По дням до обнуления (&lt; 3 дн.) |
| Анализ | Постфактум кросс-докинг | Превентивные наряд-задания |
| Velocity | Простое деление | Ozon avg_daily + WMA fallback |

---

## Технологический стек

- **API:** Ozon Seller API (POST-only, ~5 RPS)
- **Данные 1С:** PostgreSQL brain_* таблицы (Экстрактор данных 1С, ежедневно 06:00)
- **Backend:** FastAPI, Celery, Redis, PostgreSQL
- **AI:** GPT-5 mini (routine), Claude Opus 4.5 (analytics)
- **UI:** Open WebUI (Pipeline + Tools)

---
title: "Changelog"
description: "История изменений документации ADOLF по всем модулям"
mode: "wide"
---

**Проект:** ADOLF — AI-Driven Operations Layer Framework\
**Обновлено:** 16 февраля 2026

---

## 16 февраля 2026

- **Core / Launcher** → v1.1 — кастомные SVG-иконки, единая тема shadcn/ui, 11 модулей [(c75a086)](https://github.com/Sign25/Docs/commit/c75a086)

---

## 15 февраля 2026

- **Watcher** / Database API — добавлена детальная документация REST API из Sign25/watcher [(108de87)](https://github.com/Sign25/Docs/commit/108de87)
- **Logistic** — каскадное обновление: переименование `brain_*` → `1C_*`, ссылки на 1CExport (разделы 1, 3, 5, 8) [(8c7b725)](https://github.com/Sign25/Docs/commit/8c7b725)
- **CFO** — каскадное обновление v2.0: удалён файловый обмен 1С, переход на `brain_*` VIEW (разделы 1, 2, 5, 7), удалено Приложение А1 [(96a90c2)](https://github.com/Sign25/Docs/commit/96a90c2)
- **1CExport** — новый модуль v1.0: введение, настройка, реестр 18 SQL-запросов, расписание [(d0e54db)](https://github.com/Sign25/Docs/commit/d0e54db)

---

## 14 февраля 2026

- **Watcher** — полная переработка v4.0–4.3: разделы 0–8 переписаны на основе реального кода Collector (Node.js + Puppeteer), двухсерверная архитектура VPS + ADOLF [(f0eefd3)](https://github.com/Sign25/Docs/commit/f0eefd3)
- **Watcher** / Раздел 6 → v4.3 — dashboard-first с баннерами, единый чат ADOLF вместо `@Adolf_Watcher` [(033d26b)](https://github.com/Sign25/Docs/commit/033d26b)
- **CFO** / Open WebUI → v1.2 — dashboard-first, 12 KPI, 11 категорий баннеров, стратегическая аналитика из Qdrant, shadcn/ui компоненты [(197981b)](https://github.com/Sign25/Docs/commit/197981b)
- **CFO** / Open WebUI — единый чат `@Adolf` вместо отдельного `@Adolf_CFO` [(b8c6305)](https://github.com/Sign25/Docs/commit/b8c6305)
- **Logistic** / Open WebUI → v2.1 — dashboard-first подход [(67f5369)](https://github.com/Sign25/Docs/commit/67f5369)
- **Office** / Efficiency → v1.2 — добавлены Watcher (6 агентов) и Content Factory, налог +40.3%, T\_norm +30% [(f13ebbe)](https://github.com/Sign25/Docs/commit/f13ebbe)
- **CFO** / Приложение А2 — руководство по настройке 1С для отчёта валовой прибыли v1.0 [(de87a14)](https://github.com/Sign25/Docs/commit/de87a14)
- **CFO** / Приложение А1 — реестр отчётов 1С:КА2 v1.0 [(0dc51ae)](https://github.com/Sign25/Docs/commit/0dc51ae)
- **UI** / Раздел 3 → v1.1 — маппинг shadcn/ui компонентов для CFO (Badge, Card, DataTable, Chart) [(144a3ed)](https://github.com/Sign25/Docs/commit/144a3ed)

---

## 11 февраля 2026

- **CFO** → v1.1 — SKU вместо штрихкода как идентификатор, 1С:Комплексная Автоматизация 2 [(d44b9dd)](https://github.com/Sign25/Docs/commit/d44b9dd)
- **UI** — удалены модульные цвета, унификация на `--primary` (v1.1); замена lab-иконок на стандартные lucide (v1.2) [(586e7e7)](https://github.com/Sign25/Docs/commit/586e7e7)
- **UI** — удалены HTML-макеты `ui_reference/`, ссылки обновлены во всех модулях [(e4012ac)](https://github.com/Sign25/Docs/commit/e4012ac)
- **UI** / Appendix A — каталог иконок для Open WebUI v1.2 [(b32427a)](https://github.com/Sign25/Docs/commit/b32427a)
- **UI** / Appendix B — shadcn MCP Server v1.0 [(46571c9)](https://github.com/Sign25/Docs/commit/46571c9)

---

## 9 февраля 2026

- **Watcher** / Test — руководство по настройке тестового окружения v0.1 [(105e0ac)](https://github.com/Sign25/Docs/commit/105e0ac)
- **Watcher** / Test — тест сканирования каталога продавца v0.4: эмуляция поведения, ночная статистика [(111977e)](https://github.com/Sign25/Docs/commit/111977e)

---

## 8 февраля 2026

- **UI** — новый модуль v1.0: дизайн-система ADOLF на базе shadcn/ui (разделы 0–4) [(5d90399)](https://github.com/Sign25/Docs/commit/5d90399)
- **Office** / Efficiency — новый раздел v1.0: методология расчёта экономической эффективности AI-агентов [(c92bcb9)](https://github.com/Sign25/Docs/commit/c92bcb9)
- **Config** / VitePress → v1.1 — спецификация миграции на VitePress 2.x, домен `docs.adolf.su` [(dff976d)](https://github.com/Sign25/Docs/commit/dff976d)

---

## 7 февраля 2026

- **Config** / Mintlify — инициализация: `docs.json` (13 табов, 103 страницы), логотипы, favicon, landing page [(a613bd4)](https://github.com/Sign25/Docs/commit/a613bd4)
- **Config** — стандарты MDX-совместимости `mintlify_standards.md` v1.0 [(7fd0d27)](https://github.com/Sign25/Docs/commit/7fd0d27)
- **Все модули** — экранирование MDX-спецсимволов `\{\}` и `<>` (50+ файлов) [(c871eed)](https://github.com/Sign25/Docs/commit/c871eed)
- **Репозиторий** — cleanup устаревших файлов и восстановление документации [(876286f)](https://github.com/Sign25/Docs/commit/876286f)

---

## 6 февраля 2026

- **Все модули** — стандартизация имён файлов: удалены версии из имён, добавлен Mintlify frontmatter [(b33ac5c)](https://github.com/Sign25/Docs/commit/b33ac5c)
- **Logistic** — полная переработка v2.0: WB → Ozon FBO, 1С файловый импорт, наряд-задания (9 документов) [(6fcd878)](https://github.com/Sign25/Docs/commit/6fcd878)
- **Config** / Mintlify — навигация `docs.json` v2, настройка иконок и цветов [(7e69ab1)](https://github.com/Sign25/Docs/commit/7e69ab1)

---

## 1 февраля 2026

- **Различные модули** — редакторские правки через Mintlify web editor (11 файлов) [(6fef683)](https://github.com/Sign25/Docs/commit/6fef683)

---

## 31 января 2026

- **Logistic** — новый модуль v1.0: 9 документов (WB Integration, Stock Monitor, Order Analyzer, Recommendation Engine, Database, Open WebUI, Celery) [(a2f1072)](https://github.com/Sign25/Docs/commit/a2f1072)
- **ADOLF Overview** → v4.3 — добавлены Shop, Office, Launcher, Logistic; обновлена матрица доступа [(fa0ad37)](https://github.com/Sign25/Docs/commit/fa0ad37)
- **FastAPI Reference** → v1.1 — эндпоинты Launcher, Office, Logistic [(02ee7ca)](https://github.com/Sign25/Docs/commit/02ee7ca)
- **Office** — интеграция Celery всех модулей с Office Dashboard (CF v1.1, Reputation v2.2, Watcher v2.1, Marketing v1.1, Scout v1.1, CFO v1.1, Knowledge v1.0, Lex v1.0) [(1b3d5d6)](https://github.com/Sign25/Docs/commit/1b3d5d6)
- **Office** / Integration — руководство по интеграции модулей v1.0 [(5df3258)](https://github.com/Sign25/Docs/commit/5df3258)
- **Core** / Launcher — новый документ v1.0 [(2e7d345)](https://github.com/Sign25/Docs/commit/2e7d345)

---

## 30 января 2026

- **UI Reference** — миграция дизайн-системы: кастомные CSS → Ant Design → shadcn/ui v3.0 (4 модуля) [(ccf1b28)](https://github.com/Sign25/Docs/commit/ccf1b28)

---

## 25 января 2026

- **Shop** — новый модуль v1.0: WooCommerce-интеграция (7 документов) [(b2dc4a1)](https://github.com/Sign25/Docs/commit/b2dc4a1)
- **UI Reference** — каталог визуальных макетов v1.0: Content Factory, Knowledge, CFO, Reputation [(7ffddd9)](https://github.com/Sign25/Docs/commit/7ffddd9)
- **Office** — добавлены поля расчёта экономии (savings) [(d0d095d)](https://github.com/Sign25/Docs/commit/d0d095d)

---

## 24 января 2026

### Первичная загрузка документации

Размещение документации всех модулей в репозитории:

- **Core** — 8 разделов (v4.0–4.1)
- **Knowledge** — 9 разделов + глоссарий (v1.1)
- **Reputation** — 7 разделов (v2.1)
- **Watcher** — 7 разделов (v2.0)
- **Content Factory** — 7 разделов (v1.0)
- **Marketing** — 7 разделов (v1.0)
- **Scout** — 7 разделов (v1.0)
- **CFO** — 7 разделов (v1.0)
- **Lex** — 7 разделов (v1.0)
- **Office** — 8 разделов (v1.0)
- **ADOLF Overview** v4.2, **FastAPI Reference** v1.0

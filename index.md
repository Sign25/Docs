---
title: "ADOLF Platform"
description: "AI-Driven Operations Layer Framework — корпоративная система автоматизации e-commerce для маркетплейсов"
mode: "wide"
---

<Card title="Обзор платформы" icon="rocket" href="/ADOLF_OVERVIEW" horizontal>
  Полное описание архитектуры, модулей и возможностей платформы ADOLF v4.3
</Card>

## Инфраструктура

Ядро платформы: авторизация, база данных, интерфейс пользователя и корпоративная база знаний.

<Columns cols={2}>
  <Card title="Core" icon="server" href="/core/adolf_core_0_introduction">
    Open WebUI, FastAPI middleware, PostgreSQL, система ролей и уведомлений
  </Card>
  <Card title="Knowledge" icon="book-open" href="/knowledge/adolf_knowledge_1_introduction">
    RAG-pipeline, корпоративная база знаний, интеграция с 1С и маркетплейсами
  </Card>
</Columns>

## Операционные модули

AI-автоматизация ключевых бизнес-процессов: отзывы, цены, контент, реклама.

<Columns cols={2}>
  <Card title="Reputation" icon="star" href="/reputation/adolf_reputation_0_introduction">
    AI-генерация ответов на отзывы покупателей Wildberries и Ozon
  </Card>
  <Card title="Watcher" icon="binoculars" href="/watcher/adolf_watcher_0_introduction">
    Мониторинг цен конкурентов, автоматическое ценообразование
  </Card>
  <Card title="Content Factory" icon="pen-nib" href="/content_factory/adolf_content_factory_0_introduction">
    SEO-оптимизация карточек товаров, генерация описаний и заголовков
  </Card>
  <Card title="Marketing" icon="bullhorn" href="/marketing/adolf_marketing_0_introduction">
    Автоматические рекламные кампании, управление ставками и бюджетами
  </Card>
</Columns>

## Аналитика и мониторинг

Финансовая отчётность, правовой мониторинг, предиктивная аналитика ниш.

<Columns cols={3}>
  <Card title="Scout" icon="radar" href="/scout/adolf_scout_0_introduction">
    Предиктивная аналитика ниш и трендов маркетплейсов
  </Card>
  <Card title="CFO" icon="chart-pie" href="/cfo/adolf_cfo_0_introduction">
    P&L отчёты, unit-экономика, финансовый дашборд
  </Card>
  <Card title="Lex" icon="scale-balanced" href="/lex/adolf_lex_0_introduction">
    Мониторинг правовых изменений, анализ compliance
  </Card>
</Columns>

## Управление и интеграции

Единый дашборд AI-агентов, WooCommerce-интеграция и складская логистика.

<Columns cols={3}>
  <Card title="Office" icon="grid-2" href="/office/adolf_office_0_introduction">
    Дашборд мониторинга AI-агентов в реальном времени
  </Card>
  <Card title="Shop" icon="cart-shopping" href="/shop/adolf_shop_0_introduction">
    WooCommerce-интеграция через Model Context Protocol
  </Card>
  <Card title="Logistic" icon="truck-fast" href="/logistic/adolf_logistic_0_introduction">
    Оптимизация складских остатков и поставок на Ozon
  </Card>
</Columns>

---

<Card title="FastAPI Reference" icon="square-terminal" href="/adolf_fastapi_reference" horizontal>
  Полная справка по всем API-эндпоинтам платформы
</Card>

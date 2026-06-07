---
title: "Раздел 2: Источники данных"
description: "API Wildberries, Ozon, Яндекс.Маркет и 1С; нормализованная модель факта"
mode: "wide"
---

**Модуль:** Sales
**Версия:** 1.0
**Дата:** Июнь 2026

---

Раздел описывает все API-источники в формате: блок → описание → источник → поля. Все методы вызываются адаптерами по расписанию Celery (Раздел 1.4). Ручной ввод и Excel-выгрузки не используются.

## 2.1 Wildberries

**Авторизация:** JWT-токен в заголовке `Authorization`. Разные группы методов живут на разных хостах.

| Блок | Метод | Хост | Ключевые поля |
|------|-------|------|---------------|
| Финансовый отчёт (комиссия, логистика, хранение, штрафы) | `GET /api/v5/supplier/reportDetailByPeriod` | statistics-api | sa_name, nm_id, doc_type_name, quantity, retail_price_withdisc_rub, ppvz_for_pay, delivery_rub, storage_fee, penalty |
| Продажи и возвраты | `GET /api/v1/supplier/sales` | statistics-api | nmId, saName, quantity, isReturn, finishedPrice |
| Воронка (показы, корзина, заказы, выкупы, % выкупа) | `POST /api/v2/nm-report/detail` | seller-analytics-api | openCardCount, addToCartCount, ordersCount, ordersSumRub, buyoutsCount, buyoutPercent |
| Остатки | `GET /api/v1/supplier/stocks` | statistics-api | nmId, quantity, warehouseName |
| Цены и скидки | `GET /api/v2/list/goods/filter` | discounts-prices-api | nmID, price, discount |
| Реклама (расход по nmId) | `POST /adv/v2/fullstats` | advert-api | advertId, nmId, sum |
| Комиссия по предметам | `GET /api/v1/tariffs/commission` | common-api | parentName, kgvpMarketplace |
| Номенклатура | `POST /content/v2/get/cards/list` | content-api | nmID, vendorCode, subjectName, dimensions |

Поля сумм финотчёта: `ppvz_for_pay` — к перечислению; `delivery_rub` — логистика; `storage_fee` — хранение; `penalty` — штрафы; `deduction` — прочие удержания. Тип операции `doc_type_name` ∈ {«Продажа», «Возврат»}.

## 2.2 Ozon

**Авторизация:** заголовки `Client-Id` + `Api-Key` (конфиг `OzonAPISettings` из модуля Logistic). Единый хост `https://api-seller.ozon.ru`.

| Блок | Метод | Ключевые поля |
|------|-------|---------------|
| Финансовые операции (комиссия, логистика, эквайринг) | `POST /v3/finance/transaction/list` | operation_type, posting_number, amount, services |
| Отчёт о реализации (за месяц) | `POST /v1/finance/realization` | sku, commission, price, quantity |
| Аналитика продаж (выручка, заказы, доставки) | `POST /v1/analytics/data` | dimensions (sku), metrics (revenue, ordered_units, returns) |
| FBO-заказы | `POST /v2/posting/fbo/list` | posting_number, products (sku, price, quantity) |
| FBS-заказы | `POST /v3/posting/fbs/list` | posting_number, products |
| Остатки | `POST /v4/product/info/stocks` | offer_id, sku, present, reserved |
| Цены | `POST /v5/product/info/prices` | offer_id, price, marketing_seller_price |
| Реклама | Ozon Performance API (`api-performance.ozon.ru`) | campaign, sku, moneySpent |

<Warning>
Ozon убрал из API «цену покупателя» (`marketing_price`, `customer_price`). Средняя цена продажи берётся из `posting` (`products.price`) или `finance/realization`, а не из карточки.
</Warning>

## 2.3 Яндекс.Маркет

**Авторизация:** API-Key токен (доступ `finance-and-accounting` + `all-methods:read-only`). Идентификаторы `businessId` (кабинет) и `campaignId` (магазин) получаются через `GET v2/campaigns`. Хост `https://api.partner.market.yandex.ru`.

| Блок | Метод | Ключевые поля |
|------|-------|---------------|
| Заказы | `GET v2/campaigns/{campaignId}/orders` / `POST v1/businesses/{businessId}/orders` | items (offerId, price, count), status, commissions |
| Отчёт по заказам (суммы, комиссии) | `POST v2/campaigns/{campaignId}/stats/orders` | orders (items, prices, commissions) |
| Статистика по SKU (заказы, выкупы, остатки) | `POST v2/campaigns/{campaignId}/stats/skus` | shopSku, marketSku, ordersCount, byWarehouses (остатки) |
| Отчёт по товарам | `POST v2/campaigns/{campaignId}/stats/skus` (getGoodsStats) | shopSku, warehouse, count |
| Цены | `GET v2/businesses/{businessId}/offer-mappings` | offerId, basicPrice, purchasePrice |
| Оборачиваемость (async) | `POST v2/reports/goods-turnover/generate` | reportId → скачивание готового отчёта |

<Note>
**НДС:** в полях заказов YM значение `VAT_20` — основной НДС до 1 января 2026 г. С 2026 г. для расчётов используется ставка НДС 22% (см. Раздел 3, блок налога). Поле НДС из заказа полезно для сверки, но ставка модуля задаётся в `sales_settings.vat_rate`.
</Note>

## 2.4 Себестоимость из 1С (без ручного ввода)

Себестоимость — единственный показатель, отсутствующий в API маркетплейсов. Он берётся из 1С через слой 1Cexport:

| Источник | Что даёт |
|----------|----------|
| `cfo_v_cost_prices` (VIEW) | Готовая себестоимость по артикулу — основной источник |
| `1C_account_turns_90` (счёт 90.02.1) | Фактическая себестоимость реализованных товаров по SKU |
| `1C_nomenclature_prices` (price_type = «закупочная») | Закупочная цена единицы — fallback для новинок без продаж |
| `1C_nomenclature.kind` | Бренд (Охана Маркет / Охана Кидс) для разграничения доступа |

Модуль обращается только к `sales_v_cost_prices` (обёртка над `cfo_v_cost_prices`), не зная о внутренней структуре 1С-таблиц.

## 2.5 Нормализованная модель факта

Все адаптеры пишут в единую таблицу `sales_fact_daily` (одна строка = день × площадка × SKU):

```
date            DATE
marketplace     VARCHAR    -- wb | ozon | ym
sku             VARCHAR    -- Артикул продавца (= 1С)
brand           VARCHAR    -- из 1C_nomenclature.kind
orders_qty      INTEGER    -- заказано, шт
orders_sum      DECIMAL    -- заказано, ₽
buyouts_qty     INTEGER    -- выкуплено/продано, шт
buyouts_sum     DECIMAL    -- выкуплено, ₽
returns_qty     INTEGER    -- возвраты, шт
cart_adds       INTEGER    -- положили в корзину
stock_qty       INTEGER    -- остаток
ad_spend        DECIMAL    -- расход на рекламу
commission      DECIMAL    -- комиссия площадки
logistics       DECIMAL    -- логистика
storage         DECIMAL    -- хранение
penalty         DECIMAL    -- штрафы
price_avg       DECIMAL    -- средняя цена продажи нетто
```

Маппинг полей источников → канонической модели реализуется в каждом адаптере и фиксируется тестами на сверку сумм с финотчётами площадок.

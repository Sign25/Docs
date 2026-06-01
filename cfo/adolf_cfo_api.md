---
title: "CFO REST API"
mode: "wide"
---

**Версия API:** 0.1.1
**Базовый путь:** `/api/v1/cfo`
**Формат:** JSON (UTF-8)

---

## 1. Обзор

CFO REST API — HTTP-доступ к финансовой аналитике модуля управленческого учёта: P&L по категориям, маркетплейсам и SKU, ABC-анализ по марже, справочники категорий и глобальные исключения, применяемые ко всем расчётам.

Все эндпоинты возвращают JSON, кроме `/abc/export`, `/pnl/category/export` и `/pnl/marketplace/export` (стримят `.xlsx`).

Интерактивная документация, генерируемая FastAPI:

| URL | Что |
|-----|-----|
| `/docs` | Swagger UI |
| `/redoc` | ReDoc |
| `/openapi.json` | OpenAPI 3.1-спецификация |

---

## 2. Базовый URL и аутентификация

| Параметр | Значение |
|----------|----------|
| Базовый путь | `/api/v1/cfo` |
| Системный путь | `/health` (без префикса) |
| Аутентификация | **Отсутствует.** Сервис рассчитан на размещение во внутренней сети либо за внешним reverse-proxy с собственной аутентификацией. |
| Транспорт | HTTP/1.1 + HTTP/2 (зависит от reverse-proxy). |
| HTTP-методы | `GET` для чтения, `POST` для замены списка исключений. |

---

## 3. Запуск и конфигурация

Запуск:

```bash
cfo-api
# или
uvicorn cfo.api.main:app --host 0.0.0.0 --port 8000
```

Переменные окружения:

| Переменная | Дефолт | Назначение |
|------------|--------|------------|
| `CFO_API_HOST` | `0.0.0.0` | Хост uvicorn |
| `CFO_API_PORT` | `8000` | Порт uvicorn |
| `CFO_API_CORS_ORIGINS` | `*` | CSV списка разрешённых origin'ов |
| `CFO_API_POOL_MIN` | `1` | Минимальный размер пула соединений к БД |
| `CFO_API_POOL_MAX` | `10` | Максимальный размер пула |
| `CFO_API_CACHE_TTL` | `1800` | TTL кеша ответов, секунды |
| `CFO_CONFIG` | `config.yaml` | Путь к YAML-конфигу приложения |
| `CFO_DB_NAME` | `reputation` | Имя БД |
| `CFO_EXCLUSIONS_PATH` | `./config/exclusions.json` | Путь к файлу со списком исключений |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_SSL` | — | Параметры подключения к PostgreSQL |
| `DB_DSN` | — | Полный DSN; имеет приоритет над отдельными `DB_*` |

---

## 4. Общие конвенции

| Параметр | Значение |
|----------|----------|
| Кодировка | UTF-8 |
| Формат дат | ISO 8601, `YYYY-MM-DD` |
| Формат datetime | ISO 8601 с TZ-смещением, например `2026-05-21T14:32:11+03:00` |
| Денежные значения | `float`, рубли |
| Проценты | `float`, в пунктах `0…100` |
| Сортировка | Фиксирована на стороне API, обычно `net_profit DESC` / `margin_rub DESC`. Изменить через параметры запроса нельзя. |
| Тело ошибки | `{"detail": "..."}` (см. §7) |
| CORS | `allow_origins` из `CFO_API_CORS_ORIGINS` (CSV, дефолт `*`), `allow_methods=["GET", "POST"]`, `allow_credentials=false`, `allow_headers=["*"]`. |
| Логирование запросов | Middleware `cfo.api.access` пишет строку `METHOD path -> status (duration ms)` на каждый ответ. |

### 4.1 Пагинация

Применяется к `/pnl/sku` и `/abc`. В ответе всегда возвращается объект `pagination`:

```json
{ "total": 2911, "limit": 100, "offset": 0 }
```

- `total` — общее количество строк в результате после применения фильтров (без учёта пагинации).
- `limit` — размер страницы, переданный в запросе.
- `offset` — смещение от начала.

> Важно: `summary` для `/pnl/sku` и `/abc` всегда считается по **полному** результату, а не по текущей странице.

### 4.2 Кеширование

Сервер кеширует ответы на уровне SQL-запросов (ключ — хеш SQL+параметры) с TTL `CFO_API_CACHE_TTL`. Кеш — полностью прозрачный, ответы идентичны некешированным. `POST /api/v1/cfo/exclusions` сбрасывает кеш целиком — следующий запрос сразу видит свежие цифры.

### 4.3 «Мусорные» группы → строка `"Прочее"`

В `/pnl/category` строки с пустыми или техническими значениями группирующего поля собираются в одну строку:

- категории с метками `"— нерасклассифицировано —"`, `"—"`, `"Неопознанный Товар"`, `null`, пустая строка;
- результат — одна строка с `category = "Прочее"`;
- числа суммируются, маржи пересчитываются от итоговых сумм;
- результат пересортировывается по убыванию `net_profit`.

В `/pnl/marketplace` и `/pnl/sku` это правило **не** применяется.

---

## 5. Параметры периода

Все бизнес-эндпоинты (кроме `/exclusions` и `/categories`) принимают одинаковый набор параметров. Период задаётся **одним из трёх** способов: пресетом, явным диапазоном или дефолтом.

Все пресеты привязаны к `yesterday = today − 1 day` (а не к `today`) — сегодняшний день у большинства маркетплейсов закрывается с задержкой.

### 5.1 Параметры

| Параметр | Расположение | Тип | Дефолт | Описание |
|----------|--------------|-----|--------|----------|
| `preset` | query | enum `yesterday \| week \| month \| year` | — | Один из встроенных пресетов |
| `from` | query | date (`YYYY-MM-DD`) | — | Начало диапазона, включительно. Требует `to`. |
| `to` | query | date (`YYYY-MM-DD`) | — | Конец диапазона, включительно. Требует `from`. |

### 5.2 Семантика пресетов

Примеры рассчитаны для `today = 2026-05-21` (`yesterday = 2026-05-20`).

| Пресет | Семантика | Пример |
|--------|-----------|--------|
| `yesterday` | Один день: `[yesterday, yesterday]` | `2026-05-20` … `2026-05-20` |
| `week` | Последние 7 дней по `yesterday` включительно | `2026-05-14` … `2026-05-20` |
| `month` | С 1-го числа текущего месяца по `yesterday` | `2026-05-01` … `2026-05-20` |
| `year` | С 1 января текущего года по `yesterday` | `2026-01-01` … `2026-05-20` |

**Edge case.** Если `yesterday` приходится на предыдущий период:

- На 1-м числе месяца `month` отдаёт полный прошлый месяц.
- На 1 января `year` отдаёт полный прошлый год.

### 5.3 Дефолт

Если в запросе нет ни `preset`, ни `from`/`to`, применяется `yesterday`. Для воспроизводимых ответов передавайте `from`/`to` явно.

### 5.4 Границы дня

Внутренние фильтры используют half-open сравнение `[from 00:00:00, to+1 day 00:00:00)`. Это значит, что `from = to = 2026-05-20` ловит весь день целиком.

### 5.5 Валидация

Все ошибки возвращают HTTP `422` с телом `{"detail": "<сообщение>"}`. Тексты приведены побайтно как в коде:

| Ситуация | `detail` |
|----------|----------|
| `preset` и `from`/`to` переданы одновременно | `Use either 'preset' OR 'from'/'to', not both` |
| Передан только `from` или только `to` | `'from' and 'to' must be provided together` |
| `from > to` | `'from' must be <= 'to'` |
| Невалидный формат даты или значение `preset` | Стандартный `ValidationError` FastAPI |

### 5.6 Эхо в ответе

В каждом ответе бизнес-эндпоинта возвращается блок `period`:

```json
{ "from": "2026-03-01", "to": "2026-03-31" }
```

---

## 6. Эндпоинты

Сводная таблица:

| Метод | Путь | Назначение | Тег OpenAPI |
|:-----:|------|------------|:-----------:|
| GET | `/health` | Liveness-проверка | `meta` |
| GET | `/api/v1/cfo/pnl/category` | P&L по категориям товаров (WB) | `pnl` |
| GET | `/api/v1/cfo/pnl/category/export` | P&L по категориям как `.xlsx` | `pnl` |
| GET | `/api/v1/cfo/pnl/marketplace` | P&L по маркетплейсам | `pnl` |
| GET | `/api/v1/cfo/pnl/marketplace/export` | P&L по маркетплейсам как `.xlsx` | `pnl` |
| GET | `/api/v1/cfo/pnl/sku` | P&L по SKU (фильтры + пагинация) | `pnl` |
| GET | `/api/v1/cfo/abc` | ABC-анализ SKU по марже (WB) | `abc` |
| GET | `/api/v1/cfo/abc/export` | ABC-анализ как `.xlsx` (WB) | `abc` |
| GET | `/api/v1/cfo/exclusions` | Текущий список глобальных исключений | `exclusions` |
| POST | `/api/v1/cfo/exclusions` | Полная замена списка исключений | `exclusions` |
| GET | `/api/v1/cfo/categories` | Справочник родитель → подкатегории | `catalogs` |

> **Глобальные исключения** (`/exclusions`) применяются автоматически ко всем `/pnl/*`, `/abc`, `/abc/export` и `/categories`. Управление списком — только через `POST /exclusions`.

---

### 6.1 GET `/health`

Liveness-проверка. Тег OpenAPI: `meta`.

**Параметры запроса:** нет.

**Ответ 200:**

```json
{ "status": "ok" }
```

| Код | Ситуация |
|:---:|----------|
| 200 | Сервис запущен |

---

### 6.2 GET `/api/v1/cfo/pnl/category`

P&L по категориям товаров за период. Только Wildberries (`wb`).

**Параметры запроса:**

| Имя | Расположение | Тип | Дефолт | Ограничения | Описание |
|-----|--------------|-----|--------|-------------|----------|
| `preset` | query | enum | — | `yesterday \| week \| month \| year` | См. §5 |
| `from` | query | date | — | `YYYY-MM-DD` | См. §5 |
| `to` | query | date | — | `YYYY-MM-DD` | См. §5 |
| `marketplace` | query | string | `null` | regex `^(wb\|ozon\|ym)$` | Сейчас принимается только `wb` или отсутствие параметра |
| `category` | query | string | `null` | `max_length=200` | Single-value фильтр по категории (см. ниже) |

**Семантика `category`.** Auto-detected mode:

- если значение совпадает с верхнеуровневой категорией — ответ drill-down по её подкатегориям;
- иначе — exact match по подкатегории либо по верхнеуровневой категории;
- литерал `"Прочее"` возвращает агрегат «мусорных» строк;
- значение обрезается (`strip`), пустая строка эквивалентна отсутствию фильтра;
- если имя есть и как top-level, и как подкатегория под другим родителем — drill-down wins.

**Семантика `marketplace`.** Эндпоинт WB-only:

- значение проверяется по `enabled_marketplaces`; для выключенного МП — 422;
- любое значение, отличное от `wb`, отвергается с 422;
- `null` (параметр не передан) эквивалентен `wb`.

**Модель ответа:** [`PnLByCategoryReport`](#pnlbycategoryreport).

**Пример запроса:**

```bash
curl 'http://localhost:8000/api/v1/cfo/pnl/category?from=2026-03-01&to=2026-03-31&category=Жилеты'
```

**Пример ответа 200:**

```json
{
  "period": { "from": "2026-03-01", "to": "2026-03-31" },
  "filters": {
    "marketplace": null,
    "category": "Жилеты"
  },
  "data": [
    {
      "category": "Жилеты утеплённые",
      "revenue": 1000000.0,
      "cogs": 300000.0,
      "mp_expenses": 400000.0,
      "gross_profit": 700000.0,
      "net_profit": 300000.0,
      "gross_margin_pct": 70.0,
      "net_margin_pct": 30.0,
      "quantity": 500,
      "logistics": 50000.0,
      "penalties": 0.0,
      "compensation": 0.0,
      "commission_acquiring": 320000.0,
      "deduction": 30000.0,
      "losses_damages": 0.0
    }
  ],
  "summary": {
    "rows_count": 1,
    "revenue": 1000000.0,
    "cogs": 300000.0,
    "mp_expenses": 400000.0,
    "gross_profit": 700000.0,
    "net_profit": 300000.0,
    "gross_margin_pct": 70.0,
    "net_margin_pct": 30.0,
    "quantity": 500,
    "logistics": 50000.0,
    "penalties": 0.0,
    "compensation": 0.0,
    "commission_acquiring": 320000.0,
    "deduction": 30000.0,
    "losses_damages": 0.0
  }
}
```

**Коды ответов:**

| Код | Ситуация |
|:---:|----------|
| 200 | Успех (даже если `data` пустой) |
| 422 | Невалидные параметры периода; `marketplace` не в `enabled_marketplaces`; `marketplace` ≠ `wb` |
| 500 | Внутренняя ошибка БД |

Реальные тексты ошибок 422 (см. §7):

- `marketplace 'ozon' is currently disabled (enabled: ['wb'])`
- `marketplace 'ozon' is not supported for /pnl/category yet (WB-only)`

---

### 6.2.1 GET `/api/v1/cfo/pnl/category/export`

Тот же отчёт «P&L по категориям», что у §6.2, в формате `.xlsx`. Те же параметры, тот же источник данных и та же семантика фильтров; меняется только упаковка ответа. Одна строка на категорию плюс итоговая строка «Все категории».

**Параметры запроса:** идентичны §6.2 — параметры периода (см. §5), `marketplace` (regex `^(wb|ozon|ym)$`, по факту только `wb` или отсутствие) и `category` (`max_length=200`, та же auto-detected семантика drill-down / exact / `"Прочее"`). Пагинации нет.

**Ответ 200:**

| Заголовок | Значение |
|-----------|----------|
| `Content-Type` | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| `Content-Disposition` | `attachment; filename=<ascii_name>; filename*=UTF-8''<percent_encoded>` (RFC 5987) |

Имя файла: `pnl_category_<from>_<to>.xlsx` (например `pnl_category_2026-03-01_2026-03-31.xlsx`).

Тело — бинарный `.xlsx` с одним листом `P&L`. В листе:

- заголовок «P&L по категориям» и блок периода;
- колонки в порядке: `Категория`, `Кол-во, шт`, `Выручка`, `Себестоимость`, `Расходы МП`, `Вал. прибыль`, `Чист. прибыль`, `Чист. маржа, %` (денежные — в ₽);
- строки данных: по одной на категорию;
- итоговая строка «Все категории» с суммами и пересчитанной чистой маржой.

Это **сокращённый** набор колонок управленческого P&L: в Excel выводятся только ключевые метрики (как в детерминированном отчёте), а не весь набор полей строки JSON-эндпоинта `/pnl/category` (расшифровка расходов — логистика, штрафы, комиссия, удержания и т.д. — в файл не попадает). Денежные ячейки не подкрашиваются красным на минусах.

**Коды ответов:**

| Код | Ситуация |
|:---:|----------|
| 200 | Файл сформирован |
| 422 | Невалидные параметры периода; `marketplace` не в `enabled_marketplaces`; `marketplace` ≠ `wb` |
| 500 | Внутренняя ошибка БД или генерации Excel |

---

### 6.3 GET `/api/v1/cfo/pnl/marketplace`

P&L по маркетплейсам за период. Возвращает по одной строке на каждый маркетплейс, включённый в `enabled_marketplaces`. Группировка «Прочее» **не** применяется.

В отличие от `/pnl/category` и `/pnl/sku`, этот эндпоинт отдаёт собственный набор метрик — `revenue`, `sales`, `returns`, `logistics`, `storage`, `penalties`, `compensation`, `commission_acquiring`, `commission`, `partner_services`, `ads`. Поля `cogs`, `mp_expenses`, `gross_profit`, `net_profit`, `gross_margin_pct`, `net_margin_pct`, `quantity`, `losses_damages` здесь **не** возвращаются. Знаки: расходы — положительные величины (как в дашборде WB), `returns` — отрицательное (контр-выручка), `revenue` — нетто (`sales − |returns|`), `compensation` — со знаком (нетто-приток).

**Строка Ozon собирается отдельно** — из разбивки «Начисления» личного кабинета Ozon (агрегация `ozon_finance_transactions` через `catalog/ozon_finance_summary.sql`, сервис `cfo.services.ozon_lk_service`), а не из per-SKU line facts: реклама, услуги FBO и компенсации — это операции уровня периода без SKU, которые в line facts не попадают. Соответствие полей и категорий ЛК Ozon:

| Поле эндпоинта | Категория ЛК Ozon |
|----------------|-------------------|
| `revenue` | Продажи − Возвраты (нетто) |
| `sales` | Продажи |
| `returns` | Возвраты (со знаком минус) |
| `logistics` | Услуги доставки |
| `storage` | Услуги FBO |
| `ads` | Продвижение и реклама |
| `commission_acquiring` | Вознаграждение Ozon + Услуги партнёров |
| `commission` | Вознаграждение Ozon (подкомпонента `commission_acquiring`) |
| `partner_services` | Услуги партнёров (подкомпонента `commission_acquiring`) |
| `penalties` | Другие услуги и штрафы |
| `compensation` | Компенсации/декомпенсации |

Поля `commission` и `partner_services` — это две подкомпоненты `commission_acquiring`, отдаваемые по отдельности (для Ozon `commission + partner_services = commission_acquiring`). Эта разбивка специфична для Ozon: для строк **WB / YM** оба поля = `0` (в Excel-выгрузке `/pnl/marketplace/export` — «—»), а `commission_acquiring` (остаточная комиссия + эквайринг) не меняется.

Для строк **WB / YM** поля `sales` / `returns` / `storage` берутся из тех же line facts, что и раньше (`sales` = выручка по заказам, `returns` = возвраты со знаком минус, `storage` = колонка `storage`); остальные поля без изменений.

**Параметры запроса:** только параметры периода (см. §5).

**Модель ответа:** [`PnLByMarketplaceReport`](#pnlbymarketplacereport).

**Пример запроса:**

```bash
curl 'http://localhost:8000/api/v1/cfo/pnl/marketplace?from=2026-02-01&to=2026-02-28'
```

**Пример ответа 200** (`enabled_marketplaces = ["wb", "ozon"]`):

```json
{
  "period": { "from": "2026-02-01", "to": "2026-02-28" },
  "data": [
    {
      "marketplace": "ozon",
      "revenue": 42333326.34,
      "sales": 46216344.28,
      "returns": -3883017.94,
      "logistics": 12224538.99,
      "storage": 1509398.0,
      "penalties": 20080.0,
      "compensation": 204796.17,
      "commission_acquiring": 19129729.1,
      "commission": 18202729.1,
      "partner_services": 927000.0,
      "ads": 1037017.01
    },
    {
      "marketplace": "wb",
      "revenue": 105027680.32,
      "sales": 110031750.11,
      "returns": -5004069.79,
      "logistics": 180817.02,
      "storage": 0.0,
      "penalties": 92460.1,
      "compensation": 0.0,
      "commission_acquiring": 48605181.93,
      "commission": 0.0,
      "partner_services": 0.0,
      "ads": 11978958.0
    }
  ],
  "summary": {
    "rows_count": 2,
    "revenue": 147361006.66,
    "sales": 156248094.39,
    "returns": -8887087.73,
    "logistics": 12405356.01,
    "storage": 1509398.0,
    "penalties": 112540.1,
    "compensation": 204796.17,
    "commission_acquiring": 67734911.03,
    "commission": 18202729.1,
    "partner_services": 927000.0,
    "ads": 13015975.01
  }
}
```

**Коды ответов:**

| Код | Ситуация |
|:---:|----------|
| 200 | Успех |
| 422 | Невалидные параметры периода |
| 500 | Внутренняя ошибка БД |

---

### 6.3.1 GET `/api/v1/cfo/pnl/marketplace/export`

Тот же отчёт «P&L по маркетплейсам», что у §6.3, в формате `.xlsx`. Одна строка на каждый включённый маркетплейс плюс итоговая строка «Все МП».

**Параметры запроса:** только параметры периода (см. §5). Фильтров и пагинации нет.

**Ответ 200:**

| Заголовок | Значение |
|-----------|----------|
| `Content-Type` | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| `Content-Disposition` | `attachment; filename=<ascii_name>; filename*=UTF-8''<percent_encoded>` (RFC 5987) |

Имя файла: `pnl_marketplace_<from>_<to>.xlsx` (например `pnl_marketplace_2026-04-01_2026-04-30.xlsx`).

Тело — бинарный `.xlsx` с одним листом `P&L`. В листе:

- заголовок «P&L по маркетплейсам» и блок периода;
- колонки в порядке: `Маркетплейс`, `Продажи`, `Возвраты`, `Выручка (нетто)`, `Комиссия и эквайринг`, `Вознаграждение`, `Услуги партнёров`, `Логистика`, `Хранение`, `Реклама`, `Штрафы`, `Компенсации` (все денежные — в ₽);
- строки данных: по одной на маркетплейс (`Wildberries` / `Ozon` / `Я.Маркет`);
- итоговая строка «Все МП» с суммами по каждому столбцу.

Значения соответствуют JSON-полям §6.3 (расходы — положительные, `Возвраты` — отрицательные, `Компенсации` — со знаком), денежные ячейки не подкрашиваются красным на минусах.

> Колонки `Вознаграждение` (`commission`) и `Услуги партнёров` (`partner_services`) — разбивка `commission_acquiring`, специфичная для Ozon. Для строк **WB / YM** в этих двух ячейках выводится «—» (в JSON-эндпоинте там `0`); в итоговой строке «Все МП» они равны суммам по Ozon.

**Коды ответов:**

| Код | Ситуация |
|:---:|----------|
| 200 | Файл сформирован |
| 422 | Невалидные параметры периода |
| 500 | Внутренняя ошибка БД или генерации Excel |

---

### 6.4 GET `/api/v1/cfo/pnl/sku`

P&L по отдельным SKU. Сортировка фиксирована — `net_profit DESC`. Пагинируется.

**Параметры запроса:**

| Имя | Расположение | Тип | Дефолт | Ограничения | Описание |
|-----|--------------|-----|--------|-------------|----------|
| `preset` / `from` / `to` | query | — | — | — | См. §5 |
| `marketplace` | query | string | `null` | regex `^(wb\|ozon\|ym)$` | Фильтр по маркетплейсу. Если значение не в `enabled_marketplaces` — 422 |
| `category` | query | string | `null` | — | Фильтр по категории. Передаётся в сервис как есть, ограничение длины не накладывается |
| `only_loss` | query | bool | `false` | — | Если `true`, в ответе только SKU с `net_profit < 0` |
| `limit` | query | int | `100` | `1 ≤ limit ≤ 500` | Размер страницы |
| `offset` | query | int | `0` | `offset ≥ 0` | Смещение от начала |

**Модель ответа:** [`PnLSkuReport`](#pnlskureport).

**Пример запроса:**

```bash
curl 'http://localhost:8000/api/v1/cfo/pnl/sku?from=2026-03-01&to=2026-03-31&marketplace=wb&only_loss=false&limit=2&offset=0'
```

**Пример ответа 200:**

```json
{
  "period": { "from": "2026-03-01", "to": "2026-03-31" },
  "filters": {
    "marketplace": "wb",
    "category": null,
    "only_loss": false
  },
  "pagination": { "total": 2911, "limit": 2, "offset": 0 },
  "data": [
    {
      "sku": "sku-001",
      "sku_name": "Товар 1",
      "brand": "Бренд А",
      "category": "Жилеты",
      "marketplaces": ["wb"],
      "revenue": 1000000.0,
      "cogs": 300000.0,
      "mp_expenses": 400000.0,
      "gross_profit": 700000.0,
      "net_profit": 300000.0,
      "gross_margin_pct": 70.0,
      "net_margin_pct": 30.0,
      "quantity": 500,
      "logistics": 50000.0,
      "penalties": 0.0,
      "compensation": 0.0,
      "commission_acquiring": 320000.0,
      "deduction": 30000.0,
      "losses_damages": 0.0,
      "cost_source": "turns_90"
    },
    {
      "sku": "sku-002",
      "sku_name": "Товар 2",
      "brand": "Бренд Б",
      "category": "Толстовки",
      "marketplaces": ["wb"],
      "revenue": 800000.0,
      "cogs": 250000.0,
      "mp_expenses": 320000.0,
      "gross_profit": 550000.0,
      "net_profit": 230000.0,
      "gross_margin_pct": 68.75,
      "net_margin_pct": 28.75,
      "quantity": 400,
      "logistics": 40000.0,
      "penalties": 0.0,
      "compensation": 0.0,
      "commission_acquiring": 250000.0,
      "deduction": 30000.0,
      "losses_damages": 0.0,
      "cost_source": "balance_41"
    }
  ],
  "summary": {
    "rows_count": 2911,
    "revenue": 174662871.0,
    "cogs": 24166279.0,
    "mp_expenses": 90157252.0,
    "gross_profit": 150496592.0,
    "net_profit": 60339341.0,
    "gross_margin_pct": 86.2,
    "net_margin_pct": 34.5,
    "quantity": 131397,
    "logistics": 7532660.0,
    "penalties": 381713.0,
    "compensation": 0.0,
    "commission_acquiring": 78900000.0,
    "deduction": 3000000.0,
    "losses_damages": 0.0
  }
}
```

> `summary` считается по всему результату после применения фильтров, без учёта пагинации. `pagination.total` равен `summary.rows_count`.

**Коды ответов:**

| Код | Ситуация |
|:---:|----------|
| 200 | Успех |
| 422 | Невалидные параметры периода; `limit` вне диапазона `1..500`; `offset < 0`; `marketplace` не соответствует regex или не в `enabled_marketplaces` |
| 500 | Внутренняя ошибка БД |

---

### 6.5 GET `/api/v1/cfo/abc`

ABC-классификация SKU по марже (`margin_rub`). Класс D выделяется для убыточных позиций. Только Wildberries.

**Параметры запроса:**

| Имя | Расположение | Тип | Дефолт | Ограничения | Описание |
|-----|--------------|-----|--------|-------------|----------|
| `preset` / `from` / `to` | query | — | — | — | См. §5 |
| `marketplace` | query | string | `"wb"` | regex `^(wb\|ozon\|ym)$` | Сейчас принимается только `wb` |
| `abc_a` | query | float | из конфига (обычно `80`) | `0 ≤ abc_a ≤ 100` | Кумулятивный порог класса A, % |
| `abc_b` | query | float | из конфига (обычно `95`) | `0 ≤ abc_b ≤ 100`, `abc_a < abc_b` | Кумулятивный порог класса B, % |
| `search` | query | string | `null` | `max_length=100` | Case-insensitive **prefix** match по `vendor_code` |
| `limit` | query | int | `100` | `1 ≤ limit ≤ 3000` | Размер страницы |
| `offset` | query | int | `0` | `offset ≥ 0` | Смещение от начала |

**Семантика `search`.**

- Фильтр применяется в Python поверх кешированного полного отчёта.
- `summary` (статистика по классам A/B/C/D, `no_cogs_*`) **всегда** рассчитывается по полному отчёту, не по отфильтрованному.
- `pagination.total` — число найденных по `search` (≤ `summary.total_sku`).
- `rank`, `abc_class`, `cumulative_pct` у каждой строки сохраняются такими же, как в полном отчёте без `search` — классификация рассчитывается до фильтрации.

**Логика классификации (вычисляется в SQL):**

| Класс | Условие |
|:-----:|---------|
| A | `margin_rub > 0` и cumulative_pct ≤ `abc_a` |
| B | `margin_rub > 0` и `abc_a < cumulative_pct ≤ abc_b` |
| C | `margin_rub > 0` и `abc_b < cumulative_pct ≤ 100` |
| D | `margin_rub ≤ 0` (убыточные SKU, отдельная группа) |

Для класса D поля `rank` и `cumulative_pct` всегда `null` — убытки не делятся на положительную базу и не входят в ранжирование. `share_pct` в `AbcClassStat` для класса D тоже `null`.

**Модель ответа:** [`AbcReport`](#abcreport).

**Пример запроса:**

```bash
curl 'http://localhost:8000/api/v1/cfo/abc?from=2026-03-01&to=2026-03-31&abc_a=80&abc_b=95&limit=3'
```

**Пример ответа 200:**

```json
{
  "period": { "from": "2026-03-01", "to": "2026-03-31" },
  "thresholds": { "a": 80.0, "b": 95.0 },
  "summary": {
    "total_sku": 2911,
    "positive_margin": 58064074.0,
    "total_margin": 57629665.0,
    "no_cogs_count": 142,
    "no_cogs_share": 0.0488,
    "classes": {
      "A": { "sku_count": 315,  "margin": 46451259.0, "share_pct": 80.0 },
      "B": { "sku_count": 683,  "margin": 8709611.0,  "share_pct": 15.0 },
      "C": { "sku_count": 1589, "margin": 2903204.0,  "share_pct": 5.0 },
      "D": { "sku_count": 324,  "margin": -434409.0,  "share_pct": null }
    }
  },
  "pagination": { "total": 2911, "limit": 3, "offset": 0 },
  "data": [
    {
      "abc_class": "A",
      "rank": 1,
      "cumulative_pct": 2.1,
      "vendor_code": "sku-001",
      "nm_id": 1234567,
      "has_cogs": true,
      "orders_sum": 3000000.0,
      "orders_qty": 1800,
      "buyouts_sum": 2362270.0,
      "buyouts_qty": 1620,
      "cogs_rub": 676220.0,
      "buyout_rate_pct": 90.0,
      "turnover_days": 14.0,
      "commission_acquiring_rub": 760000.0,
      "logistics_rub": 24000.0,
      "adv_cost_rub": 80000.0,
      "penalties_rub": 0.0,
      "margin_pct": 52.2,
      "margin_rub": 1233358.0,
      "roi_pct": 182.4
    },
    {
      "abc_class": "B",
      "rank": 316,
      "cumulative_pct": 81.4,
      "vendor_code": "sku-002",
      "nm_id": 1234568,
      "has_cogs": true,
      "orders_sum": 400000.0,
      "orders_qty": 240,
      "buyouts_sum": 312500.0,
      "buyouts_qty": 200,
      "cogs_rub": 90000.0,
      "buyout_rate_pct": 83.3,
      "turnover_days": 20.5,
      "commission_acquiring_rub": 110000.0,
      "logistics_rub": 5000.0,
      "adv_cost_rub": 12000.0,
      "penalties_rub": 0.0,
      "margin_pct": 20.5,
      "margin_rub": 64200.0,
      "roi_pct": 71.3
    },
    {
      "abc_class": "D",
      "rank": null,
      "cumulative_pct": null,
      "vendor_code": "sku-099",
      "nm_id": 9999999,
      "has_cogs": true,
      "orders_sum": 60000.0,
      "orders_qty": 40,
      "buyouts_sum": 42100.0,
      "buyouts_qty": 28,
      "cogs_rub": 28000.0,
      "buyout_rate_pct": 70.0,
      "turnover_days": null,
      "commission_acquiring_rub": 16000.0,
      "logistics_rub": 1800.0,
      "adv_cost_rub": 4000.0,
      "penalties_rub": 950.0,
      "margin_pct": -20.5,
      "margin_rub": -8650.0,
      "roi_pct": -30.9
    }
  ]
}
```

**Коды ответов:**

| Код | Ситуация |
|:---:|----------|
| 200 | Успех |
| 422 | `abc_a >= abc_b`; `limit` вне `1..3000`; `offset < 0`; `search` длиной > 100; `marketplace` не в `enabled_marketplaces` или ≠ `wb`; ошибка периода |
| 500 | Внутренняя ошибка БД |

Реальные тексты 422:

- `abc_a (95.0) must be < abc_b (80.0)`
- `marketplace 'ozon' is currently disabled (enabled: ['wb'])`
- `ABC currently supports only 'wb'; 'ozon' data sources are not wired up yet.`

---

### 6.6 GET `/api/v1/cfo/abc/export`

Тот же ABC-отчёт, что у `/abc`, в формате `.xlsx` (без пагинации). Только Wildberries.

**Параметры запроса:** те же, что у `/abc`, **без** `limit` и `offset`.

| Имя | Расположение | Тип | Дефолт | Ограничения |
|-----|--------------|-----|--------|-------------|
| `preset` / `from` / `to` | query | — | — | См. §5 |
| `marketplace` | query | string | `"wb"` | regex `^(wb\|ozon\|ym)$` |
| `abc_a` | query | float | из конфига | `0..100` |
| `abc_b` | query | float | из конфига | `0..100`, `abc_a < abc_b` |
| `search` | query | string | `null` | `max_length=100` |

**Ответ 200:**

| Заголовок | Значение |
|-----------|----------|
| `Content-Type` | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| `Content-Disposition` | `attachment; filename=<ascii_name>; filename*=UTF-8''<percent_encoded>` (RFC 5987) |

Тело — бинарный `.xlsx` с одним листом `ABC`. В листе:

- заголовок «ABC-анализ» и блок периода;
- диагностические строки с итогами по классам A/B/C/D и `no_cogs_*`;
- колонки в порядке: класс, ранг, кумул. %, артикул (`vendor_code`), `nm_id`, заказы (сумма/количество), выкупы (сумма/количество), `cogs_rub`, % выкупа, оборачиваемость, комиссия+эквайринг, логистика, реклама, штрафы, маржа %, маржа ₽, ROI %;
- строки данных: либо все SKU отчёта, либо только те, чей `vendor_code` начинается с `search` (case-insensitive).

> Если в запросе передан `search` — в файл попадают только отфильтрованные строки, но диагностический заголовок остаётся по полному отчёту.

**Коды ответов:**

| Код | Ситуация |
|:---:|----------|
| 200 | Файл сформирован |
| 422 | Те же причины, что у `/abc` |
| 500 | Внутренняя ошибка БД или генерации Excel |

---

### 6.7 GET `/api/v1/cfo/exclusions`

Возвращает текущий список глобальных исключений. Список применяется ко всем `/pnl/*`, `/abc`, `/abc/export` и `/categories`.

**Параметры запроса:** нет.

**Модель ответа:** [`ExclusionsPayload`](#exclusionspayload).

**Пример ответа 200:**

```json
{
  "articles": ["sku-001", "sku-099"],
  "categories": ["Аксессуары"],
  "updated_at": "2026-05-20T10:15:00+03:00"
}
```

При первом запуске, если файл `CFO_EXCLUSIONS_PATH` отсутствует, ответ — пустые массивы и `updated_at` равно времени старта сервера.

**Коды ответов:**

| Код | Ситуация |
|:---:|----------|
| 200 | Успех (даже если списки пустые) |
| 500 | Ошибка чтения файла со списком |

---

### 6.8 POST `/api/v1/cfo/exclusions`

Полная замена списка исключений (idempotent replace). Тело запроса содержит **новое состояние целиком**.

**Параметры запроса:** нет.

**Заголовок:** `Content-Type: application/json`.

**Тело запроса:** [`ExclusionsRequest`](#exclusionsrequest).

| Поле | Тип | Обязательное | Описание |
|------|-----|:---:|----------|
| `articles` | string[] | нет (дефолт `[]`) | Новый список артикулов |
| `categories` | string[] | нет (дефолт `[]`) | Новый список категорий |

Любое отсутствующее поле трактуется как пустой массив, и соответствующая часть исключений очищается. Передача `{}` обнуляет обе.

**Нормализация (выполняется сервером):**

1. trim каждого значения;
2. удаление пустых строк;
3. дедупликация case-insensitive;
4. сортировка алфавитно case-insensitive.

После записи **полностью сбрасывается кеш ответов**: следующий запрос к `/pnl/*` или `/abc*` сразу видит свежий список.

**Модель ответа:** [`ExclusionsPayload`](#exclusionspayload).

**Пример запроса:**

```http
POST /api/v1/cfo/exclusions HTTP/1.1
Content-Type: application/json

{
  "articles": ["sku-001", "  SKU-099  ", "sku-099"],
  "categories": ["Аксессуары"]
}
```

**Пример ответа 200:**

```json
{
  "articles": ["sku-001", "SKU-099"],
  "categories": ["Аксессуары"],
  "updated_at": "2026-05-21T14:32:11+03:00"
}
```

(В примере `"  SKU-099  "` и `"sku-099"` сведены к одному значению нормализацией.)

**«Снять все исключения»:**

```http
POST /api/v1/cfo/exclusions HTTP/1.1
Content-Type: application/json

{ "articles": [], "categories": [] }
```

**Коды ответов:**

| Код | Ситуация |
|:---:|----------|
| 200 | Список заменён и сохранён |
| 422 | Невалидный JSON; поля `articles`/`categories` не являются массивом строк |
| 500 | Ошибка записи файла со списком |

---

### 6.9 GET `/api/v1/cfo/categories`

Справочник родительских категорий и их подкатегорий — для UI-селектора фильтра `?category=` в `/pnl/*`. Не зависит от периода. Глобальные исключения применяются автоматически.

**Параметры запроса:** нет.

**Модель ответа:** [`CategoriesPayload`](#categoriespayload).

**Применение исключений (`exclusions.categories`):**

- имя совпадает с родительской категорией → родитель выпадает целиком вместе со всеми подкатегориями;
- имя совпадает с подкатегорией → выпадает только эта подкатегория, родитель остаётся;
- имя совпадает с `— нерасклассифицировано —` → скрывается хвостовая запись.

**Хвостовая запись `— нерасклассифицировано —`.** Синтетический элемент в конце списка, представляющий SKU без классификации. В `total_parents` и `total_subcategories` **не** учитывается.

**Сортировка.** Алфавитная case-insensitive, регистр исходных значений сохраняется.

**Пример ответа 200:**

```json
{
  "categories": [
    {
      "name": "Аксессуары",
      "subcategories": ["Бейсболки", "Ремни", "Шапки"]
    },
    {
      "name": "Женская одежда",
      "subcategories": ["Брюки", "Платья", "Юбки"]
    },
    {
      "name": "— нерасклассифицировано —",
      "subcategories": []
    }
  ],
  "total_parents": 2,
  "total_subcategories": 6
}
```

**Коды ответов:**

| Код | Ситуация |
|:---:|----------|
| 200 | Успех (хвостовая запись остаётся, если не исключена) |
| 500 | Ошибка чтения БД или файла исключений |

---

## 7. Коды ошибок

Все ошибки возвращают JSON-объект с единственным полем `detail`:

```json
{ "detail": "Human-readable message" }
```

| Код | Когда |
|:---:|-------|
| 200 | Успех (включая случай пустого `data`) |
| 422 | Ошибка валидации параметров запроса или бизнес-правил |
| 500 | Внутренняя ошибка БД (или ошибка генерации Excel в `/abc/export`, `/pnl/category/export`, `/pnl/marketplace/export`) |

**Источники 422:**

- стандартная валидация FastAPI/Pydantic (типы query, regex, длины, обязательность полей тела) — возвращает детальный `ValidationError`;
- прямые `HTTPException(422)` из роутов — поля `marketplace`, `abc_a/abc_b`, проверка `enabled_marketplaces`;
- глобальный обработчик `ValueError` — любой `raise ValueError(...)` из сервисного слоя превращается в `422 {"detail": "<текст>"}`.

**Полный перечень текстовых сообщений `detail`, возвращаемых кодом:**

| Источник | Сообщение |
|----------|-----------|
| Любой эндпоинт с периодом | `Use either 'preset' OR 'from'/'to', not both` |
| Любой эндпоинт с периодом | `'from' and 'to' must be provided together` |
| Любой эндпоинт с периодом | `'from' must be <= 'to'` |
| `/pnl/category`, `/pnl/category/export`, `/pnl/sku`, `/abc`, `/abc/export` | `marketplace 'X' is currently disabled (enabled: [...])` |
| `/pnl/category`, `/pnl/category/export` | `marketplace 'X' is not supported for /pnl/category yet (WB-only)` |
| `/abc`, `/abc/export` | `ABC currently supports only 'wb'; 'X' data sources are not wired up yet.` |
| `/abc`, `/abc/export` | `abc_a (X) must be < abc_b (Y)` |
| Любой эндпоинт | Стандартный FastAPI `ValidationError` для `limit`, `offset`, `search`, тела JSON и т.д. |

**500.** Возвращает шаблонный `{"detail": "Internal database error"}`. Полный стек ошибки пишется в логи (`cfo.api.errors`) и не возвращается клиенту.

---

## 8. Схемы данных

Все Pydantic-модели, которые встречаются в ответах. Описание соответствует исходному коду модели и порядку полей в нём.

### PeriodOut

| Поле | Тип | Описание |
|------|-----|----------|
| `from` | date | Начало периода, включительно |
| `to` | date | Конец периода, включительно |

### PnLGroupMetrics

Общий набор числовых полей, который встраивается в строки `data[]` и `summary` эндпоинтов `/pnl/category` и `/pnl/sku`. Для `/pnl/marketplace` используется сокращённый набор — см. [`PnLMarketplaceMetrics`](#pnlmarketplacemetrics).

| Поле | Тип | Описание |
|------|-----|----------|
| `revenue` | float | Выручка, ₽ |
| `cogs` | float | Себестоимость, ₽ |
| `mp_expenses` | float | Расходы маркетплейса итого, ₽ |
| `gross_profit` | float | Валовая прибыль (`revenue − cogs`), ₽ |
| `net_profit` | float | Чистая прибыль (`gross_profit − mp_expenses`), ₽ |
| `gross_margin_pct` | float | Валовая маржа, % (взвешенная: `Σ gross_profit / Σ revenue × 100`) |
| `net_margin_pct` | float | Чистая маржа, % |
| `quantity` | int | Кол-во штук нетто (продажи − возвраты). Может быть отрицательным при доминирующих возвратах |
| `logistics` | float | Логистика (входит в `mp_expenses`), ₽ |
| `penalties` | float | Штрафы (входят в `mp_expenses`), ₽ |
| `compensation` | float | Доплаты от МП продавцу (WB: `additional_payment`), ₽ |
| `commission_acquiring` | float | Комиссия МП + эквайринг одним числом (входит в `mp_expenses`), ₽ |
| `deduction` | float | Удержания МП за платные услуги (входят в `mp_expenses`), ₽ |
| `losses_damages` | float | Потери, подмены, дефекты — компенсация от МП продавцу, ₽. Справочное поле, в `mp_expenses` **не** входит и к `net_profit` повторно не прибавляется (уже учтено в комиссии). |

### PnLCategoryRow

Расширяет `PnLGroupMetrics` одним полем-меткой.

| Поле | Тип | Описание |
|------|-----|----------|
| `category` | string | Имя категории (или `"Прочее"` для агрегата мусорных) |

### PnLMarketplaceMetrics

Набор числовых полей для `/pnl/marketplace` — встраивается в строки `data[]` и `summary`. Расходы — положительные величины; `returns` — отрицательное; `compensation` — со знаком. Для строки **Ozon** значения берутся из разбивки «Начисления» ЛК (см. §6.3).

| Поле | Тип | Описание |
|------|-----|----------|
| `revenue` | float | Выручка нетто (`sales − |returns|`), ₽ |
| `sales` | float | Продажи (валовая выручка по заказам), ₽ |
| `returns` | float | Возвраты, ₽ (отрицательное; Ozon — категория «Возвраты», WB — `−return_amount`) |
| `logistics` | float | Логистика, ₽ (Ozon — «Услуги доставки») |
| `storage` | float | Хранение, ₽ (Ozon — «Услуги FBO»; WB — колонка `storage`) |
| `penalties` | float | Штрафы, ₽ (Ozon — «Другие услуги и штрафы») |
| `compensation` | float | Доплаты от МП продавцу (WB: `additional_payment`; Ozon — «Компенсации/декомпенсации»), ₽ |
| `commission_acquiring` | float | Комиссия МП + эквайринг одним числом, ₽ (Ozon — «Вознаграждение Ozon + Услуги партнёров») |
| `commission` | float | Подкомпонента `commission_acquiring`: «Вознаграждение Ozon», ₽. Только Ozon; для WB/YM = `0` (в Excel-выгрузке — «—») |
| `partner_services` | float | Подкомпонента `commission_acquiring`: «Услуги партнёров», ₽. Только Ozon; для WB/YM = `0` (в Excel-выгрузке — «—»). Для Ozon `commission + partner_services = commission_acquiring` |
| `ads` | float | Платные услуги: реклама/продвижение (WB — колонка `deduction`; Ozon — «Продвижение и реклама»), ₽ |

### PnLMarketplaceRow

Расширяет `PnLMarketplaceMetrics` одним полем-меткой.

| Поле | Тип | Описание |
|------|-----|----------|
| `marketplace` | string | Машинный код: `wb`, `ozon`, `ym` |

### PnLSkuRow

Расширяет `PnLGroupMetrics`:

| Поле | Тип | Описание |
|------|-----|----------|
| `sku` | string | Артикул |
| `sku_name` | string | Название товара |
| `brand` | string | Бренд |
| `category` | string | Категория |
| `marketplaces` | string[] | Коды маркетплейсов, на которых SKU продаётся |
| `cost_source` | string \| null | Источник стоимости: `turns_90`, `balance_41`, `supplier_prices` или `null` |

### PnLGroupSummary

Расширяет `PnLGroupMetrics`:

| Поле | Тип | Описание |
|------|-----|----------|
| `rows_count` | int | Количество строк в полном результате (не на текущей странице) |

### PnLMarketplaceSummary

Расширяет `PnLMarketplaceMetrics` (сокращённый набор полей `/pnl/marketplace`):

| Поле | Тип | Описание |
|------|-----|----------|
| `rows_count` | int | Количество строк в полном результате |

### PnLCategoryFilters

Эхо применённых фильтров для `/pnl/category`.

| Поле | Тип | Описание |
|------|-----|----------|
| `marketplace` | string \| null | Эхо параметра; `null`, если не передан |
| `category` | string \| null | Эхо параметра; `null`, если не передан |

### PnLSkuFilters

Эхо применённых фильтров для `/pnl/sku`.

| Поле | Тип | Описание |
|------|-----|----------|
| `marketplace` | string \| null | Эхо параметра |
| `category` | string \| null | Эхо параметра |
| `only_loss` | bool | Эхо параметра (`false`, если не передан) |

### Pagination

| Поле | Тип | Описание |
|------|-----|----------|
| `total` | int | Общее количество строк после фильтрации |
| `limit` | int | Размер страницы из запроса |
| `offset` | int | Смещение из запроса |

### PnLByCategoryReport

Ответ `GET /pnl/category`.

| Поле | Тип |
|------|-----|
| `period` | PeriodOut |
| `filters` | PnLCategoryFilters |
| `data` | PnLCategoryRow[] |
| `summary` | PnLGroupSummary |

### PnLByMarketplaceReport

Ответ `GET /pnl/marketplace`.

| Поле | Тип |
|------|-----|
| `period` | PeriodOut |
| `data` | PnLMarketplaceRow[] |
| `summary` | PnLMarketplaceSummary |

### PnLSkuReport

Ответ `GET /pnl/sku`.

| Поле | Тип |
|------|-----|
| `period` | PeriodOut |
| `filters` | PnLSkuFilters |
| `pagination` | Pagination |
| `data` | PnLSkuRow[] |
| `summary` | PnLGroupSummary |

### AbcThresholds

| Поле | Тип | Описание |
|------|-----|----------|
| `a` | float | Применённый порог класса A, % |
| `b` | float | Применённый порог класса B, % |

### AbcClassStat

| Поле | Тип | Описание |
|------|-----|----------|
| `sku_count` | int | Количество SKU в классе |
| `margin` | float | Σ `margin_rub` по классу (для D — отрицательное) |
| `share_pct` | float \| null | Доля от `positive_margin`, %; `null` для класса D |

### AbcSummary

| Поле | Тип | Описание |
|------|-----|----------|
| `total_sku` | int | Общее количество SKU в результате |
| `positive_margin` | float | Σ `margin_rub` по классам A+B+C (база для `share_pct`) |
| `total_margin` | float | Σ `margin_rub` по всем классам (`positive_margin + класс D`) |
| `no_cogs_count` | int | Количество SKU с выкупами, но `cost_price = 0` (пропуск в `product_costs`) |
| `no_cogs_share` | float | Доля строк выкупов без `cost_price`, диапазон `0..1` |
| `classes` | dict[`A`\|`B`\|`C`\|`D`, AbcClassStat] | Статистика по классам |

### AbcRow

| Поле | Тип | Описание |
|------|-----|----------|
| `abc_class` | enum | `A`, `B`, `C`, `D` |
| `rank` | int \| null | Номер в ранжировании по убыванию `margin_rub`; `null` для класса D |
| `cumulative_pct` | float \| null | Кумулятивная доля прибыли с начала списка, %; `null` для класса D |
| `vendor_code` | string | Артикул (код SKU продавца) |
| `nm_id` | int \| null | Номенклатурный ID WB |
| `has_cogs` | bool | `false` — `cogs_rub = 0`, маржа/ROI завышены (пропуск в `product_costs`) |
| `orders_sum` | float | Сумма заказов, ₽ |
| `orders_qty` | int | Количество заказов |
| `buyouts_sum` | float | Сумма выкупов, ₽ |
| `buyouts_qty` | int | Количество выкупов |
| `cogs_rub` | float | Себестоимость по выкупам, ₽ |
| `buyout_rate_pct` | float \| null | % выкупа (выкупы / заказы) |
| `turnover_days` | float \| null | Оборачиваемость, дней |
| `commission_acquiring_rub` | float | Комиссия + эквайринг, ₽ |
| `logistics_rub` | float | Логистика, ₽ |
| `adv_cost_rub` | float | Расходы на рекламу, ₽ |
| `penalties_rub` | float | Штрафы, ₽ |
| `margin_pct` | float \| null | Маржа, % |
| `margin_rub` | float | Маржа, ₽ (для D — отрицательная) |
| `roi_pct` | float \| null | ROI, % |

### AbcReport

Ответ `GET /abc`.

| Поле | Тип |
|------|-----|
| `period` | PeriodOut |
| `thresholds` | AbcThresholds |
| `summary` | AbcSummary |
| `pagination` | Pagination |
| `data` | AbcRow[] |

### ExclusionsRequest

Тело запроса `POST /exclusions`.

| Поле | Тип | Обязательное | Описание |
|------|-----|:---:|----------|
| `articles` | string[] | нет (дефолт `[]`) | Полный новый список артикулов |
| `categories` | string[] | нет (дефолт `[]`) | Полный новый список категорий |

### ExclusionsPayload

Ответ `GET /exclusions` и `POST /exclusions`. Расширяет `ExclusionsRequest`.

| Поле | Тип | Описание |
|------|-----|----------|
| `articles` | string[] | Нормализованный список (trim, dedup case-insensitive, sort) |
| `categories` | string[] | Нормализованный список |
| `updated_at` | datetime | Время последнего обновления файла, ISO 8601 с TZ |

### CategoryNode

| Поле | Тип | Описание |
|------|-----|----------|
| `name` | string | Имя родительской категории (или хвостовое `— нерасклассифицировано —`) |
| `subcategories` | string[] | Подкатегории, отсортированные case-insensitive; может быть пустым |

### CategoriesPayload

Ответ `GET /categories`.

| Поле | Тип | Описание |
|------|-----|----------|
| `categories` | CategoryNode[] | Список узлов дерева; хвостовой элемент — синтетический `— нерасклассифицировано —`, если не скрыт исключениями |
| `total_parents` | int | Кол-во настоящих родителей (без учёта хвостовой записи) |
| `total_subcategories` | int | Суммарное число уникальных подкатегорий по всем родителям |

### Перечисления

| Перечисление | Значения | Где встречается |
|--------------|----------|-----------------|
| `PresetName` | `yesterday`, `week`, `month`, `year` | query `preset` всех бизнес-эндпоинтов |
| `Marketplace` | `wb`, `ozon`, `ym` | query `marketplace` (`/pnl/category`, `/pnl/category/export`, `/pnl/sku`, `/abc`, `/abc/export`); поле `marketplace` в `PnLMarketplaceRow` |
| `AbcClass` | `A`, `B`, `C`, `D` | поле `abc_class` в `AbcRow` и ключи `classes` в `AbcSummary` |
| `cost_source` | `turns_90`, `balance_41`, `supplier_prices`, `null` | поле `cost_source` в `PnLSkuRow` |

---

## 9. Версионирование

- **Текущая версия:** `0.1.1` (метаданные FastAPI на `/openapi.json`).
- **Префикс `/api/v1/cfo`** зарезервирован под мажорную версию 1. В рамках `v1` контракт расширяется обратно совместимо — могут добавляться новые поля и новые эндпоинты, но имена и типы существующих полей не меняются.
- Breaking-changes выходят с новым префиксом (`v2`).

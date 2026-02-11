---
title: "Приложение A: Реестр иконок Open WebUI"
description: "UI Design System v1.1 — полный реестр Lucide-иконок для Open WebUI с миниатюрами, параметрами и ссылками"
mode: "wide"
---

## Общие параметры

Все иконки платформы ADOLF используют библиотеку [Lucide Icons](https://lucide.dev/) со следующими едиными параметрами:

| Параметр | Значение |
|:---------|:---------|
| Размер | 24 × 24 px |
| Stroke width | **1.5 px** |
| Stroke linecap | `round` |
| Stroke linejoin | `round` |
| Fill | `none` |
| Stroke | `currentColor` |

Стандартный stroke-width Lucide — 2 px. В ADOLF используется **1.5 px** для визуально более лёгкого и современного восприятия иконок в интерфейсе Open WebUI.

<Warning>
Две иконки — **jacket** (Content Factory) и **target-arrow** (Marketing) — входят в пакет `@lucide/lab` и не доступны в основной библиотеке `lucide` / `lucide-react`. Для их использования необходим отдельный импорт из `@lucide/lab`.
</Warning>

## Системные иконки

Иконки, используемые для общих элементов интерфейса Open WebUI.

### Логотип приложения

|  |  |
|:---|:---|
| **Назначение** | Основной логотип ADOLF в Open WebUI |
| **Lucide name** | `bot-message-square` |
| **Пакет** | `lucide` (основной) |
| **React import** | `BotMessageSquare` |
| **Ссылка** | [lucide.dev/icons/bot-message-square](https://lucide.dev/icons/bot-message-square) |


```html
<i data-lucide="bot-message-square" stroke-width="1.5"></i>
```

### Новый чат

|  |  |
|:---|:---|
| **Назначение** | Кнопка создания нового чата в sidebar |
| **Lucide name** | `message-square-more` |
| **Пакет** | `lucide` (основной) |
| **React import** | `MessageSquareMore` |
| **Ссылка** | [lucide.dev/icons/message-square-more](https://lucide.dev/icons/message-square-more) |


```html
<i data-lucide="message-square-more" stroke-width="1.5"></i>
```

## Иконки модулей

### Knowledge

|  |  |
|:---|:---|
| **Модуль** | Knowledge — база знаний, RAG |
| **Lucide name** | `database-search` |
| **Пакет** | `lucide` (основной) |
| **React import** | `DatabaseSearch` |
| **Ссылка** | [lucide.dev/icons/database-search](https://lucide.dev/icons/database-search) |


```html
<i data-lucide="database-search" stroke-width="1.5"></i>
```

### Content Factory

|  |  |
|:---|:---|
| **Модуль** | Content Factory — генерация SEO-контента |
| **Lucide name** | `jacket` |
| **Пакет** | `@lucide/lab` ⚠️ |
| **React import** | `import { jacket } from '@lucide/lab'` |
| **Ссылка** | [lucide.dev/icons/lab/jacket](https://lucide.dev/icons/lab/jacket) |


```jsx
import { Icon } from 'lucide-react';
import { jacket } from '@lucide/lab';

<Icon iconNode={jacket} size={24} strokeWidth={1.5} />
```

### CFO

|  |  |
|:---|:---|
| **Модуль** | CFO — финансовая аналитика |
| **Lucide name** | `chart-candlestick` |
| **Пакет** | `lucide` (основной) |
| **React import** | `ChartCandlestick` |
| **Ссылка** | [lucide.dev/icons/chart-candlestick](https://lucide.dev/icons/chart-candlestick) |


```html
<i data-lucide="chart-candlestick" stroke-width="1.5"></i>
```

### Reputation

|  |  |
|:---|:---|
| **Модуль** | Reputation — управление отзывами |
| **Lucide name** | `thumbs-up` |
| **Пакет** | `lucide` (основной) |
| **React import** | `ThumbsUp` |
| **Ссылка** | [lucide.dev/icons/thumbs-up](https://lucide.dev/icons/thumbs-up) |


```html
<i data-lucide="thumbs-up" stroke-width="1.5"></i>
```

### Watcher

|  |  |
|:---|:---|
| **Модуль** | Watcher — мониторинг конкурентов |
| **Lucide name** | `hat-glasses` |
| **Пакет** | `lucide` (основной) |
| **React import** | `HatGlasses` |
| **Ссылка** | [lucide.dev/icons/hat-glasses](https://lucide.dev/icons/hat-glasses) |


```html
<i data-lucide="hat-glasses" stroke-width="1.5"></i>
```

### Marketing

|  |  |
|:---|:---|
| **Модуль** | Marketing — автоматизация рекламы |
| **Lucide name** | `target-arrow` |
| **Пакет** | `@lucide/lab` ⚠️ |
| **React import** | `import { targetArrow } from '@lucide/lab'` |
| **Ссылка** | [lucide.dev/icons/lab/target-arrow](https://lucide.dev/icons/lab/target-arrow) |


```jsx
import { Icon } from 'lucide-react';
import { targetArrow } from '@lucide/lab';

<Icon iconNode={targetArrow} size={24} strokeWidth={1.5} />
```

### Scout

|  |  |
|:---|:---|
| **Модуль** | Scout — предиктивная аналитика |
| **Lucide name** | `binoculars` |
| **Пакет** | `lucide` (основной) |
| **React import** | `Binoculars` |
| **Ссылка** | [lucide.dev/icons/binoculars](https://lucide.dev/icons/binoculars) |


```html
<i data-lucide="binoculars" stroke-width="1.5"></i>
```

### Lex

|  |  |
|:---|:---|
| **Модуль** | Lex — юридический мониторинг |
| **Lucide name** | `scale` |
| **Пакет** | `lucide` (основной) |
| **React import** | `Scale` |
| **Ссылка** | [lucide.dev/icons/scale](https://lucide.dev/icons/scale) |


```html
<i data-lucide="scale" stroke-width="1.5"></i>
```

### Logistic

|  |  |
|:---|:---|
| **Модуль** | Logistic — оптимизация складов |
| **Lucide name** | `truck` |
| **Пакет** | `lucide` (основной) |
| **React import** | `Truck` |
| **Ссылка** | [lucide.dev/icons/truck](https://lucide.dev/icons/truck) |


```html
<i data-lucide="truck" stroke-width="1.5"></i>
```

### Office

|  |  |
|:---|:---|
| **Модуль** | Office — мониторинг AI-агентов |
| **Lucide name** | `building-2` |
| **Пакет** | `lucide` (основной) |
| **React import** | `Building2` |
| **Ссылка** | [lucide.dev/icons/building-2](https://lucide.dev/icons/building-2) |


```html
<i data-lucide="building-2" stroke-width="1.5"></i>
```

### Shop

|  |  |
|:---|:---|
| **Модуль** | Shop — интеграция WooCommerce |
| **Lucide name** | `shopping-cart` |
| **Пакет** | `lucide` (основной) |
| **React import** | `ShoppingCart` |
| **Ссылка** | [lucide.dev/icons/shopping-cart](https://lucide.dev/icons/shopping-cart) |


```html
<i data-lucide="shopping-cart" stroke-width="1.5"></i>
```

## Сводная таблица

| # | Назначение | Lucide Name | Пакет | Файл |
|:-:|:-----------|:------------|:------|:-----|
| 1 | Логотип приложения | `bot-message-square` | lucide | `app-logo.svg` |
| 2 | Новый чат | `message-square-more` | lucide | `new-chat.svg` |
| 3 | Knowledge | `database-search` | lucide | `knowledge.svg` |
| 4 | Content Factory | `jacket` | @lucide/lab | `content-factory.svg` |
| 5 | CFO | `chart-candlestick` | lucide | `cfo.svg` |
| 6 | Reputation | `thumbs-up` | lucide | `reputation.svg` |
| 7 | Watcher | `hat-glasses` | lucide | `watcher.svg` |
| 8 | Marketing | `target-arrow` | @lucide/lab | `marketing.svg` |
| 9 | Scout | `binoculars` | lucide | `scout.svg` |
| 10 | Lex | `scale` | lucide | `lex.svg` |
| 11 | Logistic | `truck` | lucide | `logistic.svg` |
| 12 | Office | `building-2` | lucide | `office.svg` |
| 13 | Shop | `shopping-cart` | lucide | `shop.svg` |

## Установка

### npm

```bash
# Основной пакет
npm install lucide-react

# Lab-иконки (для Content Factory и Marketing)
npm install @lucide/lab
```

### CDN (HTML)

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<script>
  lucide.createIcons({
    attrs: { 'stroke-width': 1.5 }
  });
</script>
```

### Open WebUI (SvelteKit)

Глобальное переопределение stroke-width для всех Lucide-иконок:

```svelte
<script>
  import Icon from '$lib/components/Icon.svelte';
</script>

<Icon name="bot-message-square" strokeWidth={1.5} size={24} />
```

## Использование Lab-иконок в Open WebUI

Lab-иконки требуют специального подхода, так как не входят в стандартный набор `lucide`:

```javascript
// Обёртка для использования lab-иконки в createIcons
function wrapLabIcon(iconNode) {
  return [
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: 24,
      height: 24,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 1.5,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    },
    iconNode
  ];
}
```

```javascript
import { createIcons } from 'lucide';
import { jacket, targetArrow } from '@lucide/lab';

createIcons({
  attrs: { 'stroke-width': 1.5 },
  icons: {
    Jacket: wrapLabIcon(jacket),
    TargetArrow: wrapLabIcon(targetArrow)
  }
});
```

## Связанные документы

| Документ | Описание |
|:---------|:---------|
| [Раздел 0: Введение](/ui/adolf_ui_0_introduction) | Обзор дизайн-системы |
| [Раздел 2: Тематизация](/ui/adolf_ui_2_module_theming) | Единая цветовая схема, маркетплейсы |
| `shadcn-variables.css` | CSS-переменные цветов модулей |
| [Lucide Icons](https://lucide.dev/icons/) | Поиск иконок |
| [Lucide Lab](https://github.com/lucide-icons/lucide-lab) | Lab-пакет (jacket, target-arrow) |

---

**Версия:** 1.1 | **Дата:** Февраль 2026

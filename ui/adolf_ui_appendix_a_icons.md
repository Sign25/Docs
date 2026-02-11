---
title: "Приложение A: Реестр иконок Open WebUI"
description: "UI Design System v1.0 — полный реестр Lucide-иконок для Open WebUI с миниатюрами, параметрами и ссылками"
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
| **Файл** | `ui_reference/icons/app-logo.svg` |
| **Ссылка** | [lucide.dev/icons/bot-message-square](https://lucide.dev/icons/bot-message-square) |

![Логотип приложения](/ui_reference/icons/app-logo.svg)

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
| **Файл** | `ui_reference/icons/new-chat.svg` |
| **Ссылка** | [lucide.dev/icons/message-square-more](https://lucide.dev/icons/message-square-more) |

![Новый чат](/ui_reference/icons/new-chat.svg)

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
| **Цвет модуля** | `--module-knowledge` / #3B82F6 (Blue) |
| **Файл** | `ui_reference/icons/knowledge.svg` |
| **Ссылка** | [lucide.dev/icons/database-search](https://lucide.dev/icons/database-search) |

![Knowledge](/ui_reference/icons/knowledge.svg)

```html
<i data-lucide="database-search" stroke-width="1.5" style="color: var(--module-knowledge)"></i>
```

### Content Factory

|  |  |
|:---|:---|
| **Модуль** | Content Factory — генерация SEO-контента |
| **Lucide name** | `jacket` |
| **Пакет** | `@lucide/lab` ⚠️ |
| **React import** | `import { jacket } from '@lucide/lab'` |
| **Цвет модуля** | `--module-content` / #A855F7 (Purple) |
| **Файл** | `ui_reference/icons/content-factory.svg` |
| **Ссылка** | [lucide.dev/icons/lab/jacket](https://lucide.dev/icons/lab/jacket) |

![Content Factory](/ui_reference/icons/content-factory.svg)

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
| **Цвет модуля** | `--module-cfo` / #22C55E (Green) |
| **Файл** | `ui_reference/icons/cfo.svg` |
| **Ссылка** | [lucide.dev/icons/chart-candlestick](https://lucide.dev/icons/chart-candlestick) |

![CFO](/ui_reference/icons/cfo.svg)

```html
<i data-lucide="chart-candlestick" stroke-width="1.5" style="color: var(--module-cfo)"></i>
```

### Reputation

|  |  |
|:---|:---|
| **Модуль** | Reputation — управление отзывами |
| **Lucide name** | `thumbs-up` |
| **Пакет** | `lucide` (основной) |
| **React import** | `ThumbsUp` |
| **Цвет модуля** | `--module-reputation` / #F97316 (Orange) |
| **Файл** | `ui_reference/icons/reputation.svg` |
| **Ссылка** | [lucide.dev/icons/thumbs-up](https://lucide.dev/icons/thumbs-up) |

![Reputation](/ui_reference/icons/reputation.svg)

```html
<i data-lucide="thumbs-up" stroke-width="1.5" style="color: var(--module-reputation)"></i>
```

### Watcher

|  |  |
|:---|:---|
| **Модуль** | Watcher — мониторинг конкурентов |
| **Lucide name** | `hat-glasses` |
| **Пакет** | `lucide` (основной) |
| **React import** | `HatGlasses` |
| **Цвет модуля** | `--module-watcher` / #EF4444 (Red) |
| **Файл** | `ui_reference/icons/watcher.svg` |
| **Ссылка** | [lucide.dev/icons/hat-glasses](https://lucide.dev/icons/hat-glasses) |

![Watcher](/ui_reference/icons/watcher.svg)

```html
<i data-lucide="hat-glasses" stroke-width="1.5" style="color: var(--module-watcher)"></i>
```

### Marketing

|  |  |
|:---|:---|
| **Модуль** | Marketing — автоматизация рекламы |
| **Lucide name** | `target-arrow` |
| **Пакет** | `@lucide/lab` ⚠️ |
| **React import** | `import { targetArrow } from '@lucide/lab'` |
| **Цвет модуля** | `--module-marketing` / #EC4899 (Pink) |
| **Файл** | `ui_reference/icons/marketing.svg` |
| **Ссылка** | [lucide.dev/icons/lab/target-arrow](https://lucide.dev/icons/lab/target-arrow) |

![Marketing](/ui_reference/icons/marketing.svg)

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
| **Цвет модуля** | `--module-scout` / #06B6D4 (Cyan) |
| **Файл** | `ui_reference/icons/scout.svg` |
| **Ссылка** | [lucide.dev/icons/binoculars](https://lucide.dev/icons/binoculars) |

![Scout](/ui_reference/icons/scout.svg)

```html
<i data-lucide="binoculars" stroke-width="1.5" style="color: var(--module-scout)"></i>
```

### Lex

|  |  |
|:---|:---|
| **Модуль** | Lex — юридический мониторинг |
| **Lucide name** | `scale` |
| **Пакет** | `lucide` (основной) |
| **React import** | `Scale` |
| **Цвет модуля** | `--module-lex` / #64748B (Slate) |
| **Файл** | `ui_reference/icons/lex.svg` |
| **Ссылка** | [lucide.dev/icons/scale](https://lucide.dev/icons/scale) |

![Lex](/ui_reference/icons/lex.svg)

```html
<i data-lucide="scale" stroke-width="1.5" style="color: var(--module-lex)"></i>
```

### Logistic

|  |  |
|:---|:---|
| **Модуль** | Logistic — оптимизация складов |
| **Lucide name** | `truck` |
| **Пакет** | `lucide` (основной) |
| **React import** | `Truck` |
| **Цвет модуля** | `--module-logistic` / #14B8A6 (Teal) |
| **Файл** | `ui_reference/icons/logistic.svg` |
| **Ссылка** | [lucide.dev/icons/truck](https://lucide.dev/icons/truck) |

![Logistic](/ui_reference/icons/logistic.svg)

```html
<i data-lucide="truck" stroke-width="1.5" style="color: var(--module-logistic)"></i>
```

### Office

|  |  |
|:---|:---|
| **Модуль** | Office — мониторинг AI-агентов |
| **Lucide name** | `building-2` |
| **Пакет** | `lucide` (основной) |
| **React import** | `Building2` |
| **Цвет модуля** | — |
| **Файл** | `ui_reference/icons/office.svg` |
| **Ссылка** | [lucide.dev/icons/building-2](https://lucide.dev/icons/building-2) |

![Office](/ui_reference/icons/office.svg)

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
| **Цвет модуля** | — |
| **Файл** | `ui_reference/icons/shop.svg` |
| **Ссылка** | [lucide.dev/icons/shopping-cart](https://lucide.dev/icons/shopping-cart) |

![Shop](/ui_reference/icons/shop.svg)

```html
<i data-lucide="shopping-cart" stroke-width="1.5"></i>
```

## Сводная таблица

| # | Назначение | Lucide Name | Пакет | HEX | Файл |
|:-:|:-----------|:------------|:------|:----|:-----|
| 1 | Логотип приложения | `bot-message-square` | lucide | — | `app-logo.svg` |
| 2 | Новый чат | `message-square-more` | lucide | — | `new-chat.svg` |
| 3 | Knowledge | `database-search` | lucide | #3B82F6 | `knowledge.svg` |
| 4 | Content Factory | `jacket` | @lucide/lab | #A855F7 | `content-factory.svg` |
| 5 | CFO | `chart-candlestick` | lucide | #22C55E | `cfo.svg` |
| 6 | Reputation | `thumbs-up` | lucide | #F97316 | `reputation.svg` |
| 7 | Watcher | `hat-glasses` | lucide | #EF4444 | `watcher.svg` |
| 8 | Marketing | `target-arrow` | @lucide/lab | #EC4899 | `marketing.svg` |
| 9 | Scout | `binoculars` | lucide | #06B6D4 | `scout.svg` |
| 10 | Lex | `scale` | lucide | #64748B | `lex.svg` |
| 11 | Logistic | `truck` | lucide | #14B8A6 | `logistic.svg` |
| 12 | Office | `building-2` | lucide | — | `office.svg` |
| 13 | Shop | `shopping-cart` | lucide | — | `shop.svg` |

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

## Структура файлов

```
ui_reference/icons/
├── app-logo.svg          # bot-message-square
├── new-chat.svg          # message-square-more
├── knowledge.svg         # database-search
├── content-factory.svg   # jacket (lab)
├── cfo.svg               # chart-candlestick
├── reputation.svg        # thumbs-up
├── watcher.svg           # hat-glasses
├── marketing.svg         # target-arrow (lab)
├── scout.svg             # binoculars
├── lex.svg               # scale
├── logistic.svg          # truck
├── office.svg            # building-2
└── shop.svg              # shopping-cart
```

Все SVG-файлы экспортированы со `stroke-width="1.5"` и доступны для использования в контекстах без JavaScript.

## Связанные документы

| Документ | Описание |
|:---------|:---------|
| [Раздел 0: Введение](/ui/adolf_ui_0_introduction) | Обзор дизайн-системы |
| [Раздел 2: Тематизация](/ui/adolf_ui_2_module_theming) | Цвета модулей, CSS-переменные |
| `ui_reference/base/shadcn-variables.css` | CSS-переменные цветов модулей |
| [Lucide Icons](https://lucide.dev/icons/) | Поиск иконок |
| [Lucide Lab](https://github.com/lucide-icons/lucide-lab) | Lab-пакет (jacket, target-arrow) |

---

**Версия:** 1.0 | **Дата:** Февраль 2026

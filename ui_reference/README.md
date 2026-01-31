# ADOLF UI Reference

> Visual Reference для Open WebUI Pipelines на базе **shadcn/ui** + **Lucide Icons**

## Версия 3.0 (January 2026)

## Иконки модулей (Lucide)

| Модуль | Иконка | Lucide | Цвет |
|--------|--------|--------|------|
| 📖 Knowledge | `book-open-check` | `BookOpenCheck` | Blue |
| 🏭 Content Factory | `factory` | `Factory` | Purple |
| 📈 CFO | `line-chart` | `LineChart` | Green |
| 👍 Reputation | `thumbs-up` | `ThumbsUp` | Orange |
| 💬 Новый чат | `message-square` | `MessageSquare` | — |

```jsx
import { BookOpenCheck, Factory, LineChart, ThumbsUp, MessageSquare } from 'lucide-react';
```

## Цвета модулей

```
██████  Knowledge        #3B82F6  Blue
██████  Content Factory  #A855F7  Purple
██████  CFO              #22C55E  Green
██████  Reputation       #F97316  Orange
██████  Watcher          #EF4444  Red
██████  Marketing        #EC4899  Pink
██████  Scout            #06B6D4  Cyan
██████  Lex              #64748B  Slate
```

## Маркетплейсы

```
██████  Wildberries      #CB11AB
██████  Ozon             #005BFF
██████  Yandex Market    #FFCC00
```

## Структура

```
ui_reference/
├── base/
│   ├── shadcn-variables.css   # CSS переменные
│   ├── shadcn-tokens.json     # Design tokens
│   └── README.md              # Документация + иконки
├── content_factory/           # ✅ Ready
├── knowledge/                 # ✅ Ready
├── cfo/                       # ✅ Ready
├── reputation/                # ✅ Ready
└── README.md
```

## Быстрый старт

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <link rel="stylesheet" href="../base/shadcn-variables.css">
  <link rel="stylesheet" href="module.css">
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
</head>
<body>
  <div class="adolf-module-name">
    <i data-lucide="book-open-check"></i>
  </div>
  <script>lucide.createIcons();</script>
</body>
</html>
```

## Ресурсы

- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Figma Kit](https://www.figma.com/community/file/1203061493325953101)

---

**Design System**: shadcn/ui + Lucide | **Version**: 3.0

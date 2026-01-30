# ADOLF UI Reference

> Visual Reference для Open WebUI Pipelines на базе **shadcn/ui**

## Версия 3.0 (January 2026)

Миграция на [shadcn/ui](https://ui.shadcn.com/) — современную дизайн-систему на базе Radix UI и Tailwind CSS.

## Структура

```
ui_reference/
├── base/
│   ├── shadcn-variables.css   # CSS переменные shadcn/ui
│   ├── shadcn-tokens.json     # Design tokens
│   └── README.md              # Документация дизайн-системы
├── content_factory/
│   ├── content-factory.css    # Стили модуля
│   └── index.html             # Демо-страница
├── knowledge/
│   ├── knowledge.css
│   └── index.html
├── cfo/
│   ├── cfo.css
│   └── index.html
├── reputation/
│   ├── reputation.css
│   └── index.html
└── README.md
```

## Статус модулей

| Модуль | Цвет | Статус |
|--------|------|--------|
| Content Factory | Purple | ✅ Ready |
| Knowledge | Blue | ✅ Ready |
| CFO | Green | ✅ Ready |
| Reputation | Orange | ✅ Ready |
| Watcher | Red | 📋 Planned |
| Marketing | Pink | 📋 Planned |
| Scout | Cyan | 📋 Planned |
| Lex | Slate | 📋 Planned |

## Быстрый старт

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <!-- shadcn/ui Variables -->
  <link rel="stylesheet" href="../base/shadcn-variables.css">
  <!-- Module Styles -->
  <link rel="stylesheet" href="module.css">
</head>
<body>
  <div class="adolf-module-name">
    <!-- Контент модуля -->
  </div>
</body>
</html>
```

## Цветовая схема модулей

```css
/* Content Factory */
.adolf-content-factory {
  --module-color: var(--module-content);
}

/* Knowledge */
.adolf-knowledge {
  --module-color: var(--module-knowledge);
}

/* CFO */
.adolf-cfo {
  --module-color: var(--module-cfo);
}

/* Reputation */
.adolf-reputation {
  --module-color: var(--module-reputation);
}
```

## Ключевые переменные

### Цвета
- `--background` / `--foreground` — фон и текст
- `--card` / `--card-foreground` — карточки
- `--primary` / `--primary-foreground` — основной акцент
- `--muted` / `--muted-foreground` — приглушённые элементы
- `--destructive` — ошибки и удаление
- `--border` — границы

### Размеры
- `--spacing-*` — отступы (1-16)
- `--radius-*` — скругления (sm, md, lg)
- `--control-*` — высота элементов (sm, md, lg)
- `--text-*` — размеры текста (xs, sm, base, lg, xl)

### Анимации
- `--transition-fast` — 150ms
- `--transition-normal` — 200ms
- `--transition-slow` — 300ms

## Компоненты

### Общие элементы
- `.adolf-btn` — кнопки (primary, secondary, danger, ghost)
- `.adolf-*-badge` — бейджи статусов и маркетплейсов
- `.adolf-*-card` — карточки контента

### Маркетплейсы
- `.wb` — Wildberries
- `.ozon` — Ozon
- `.ym` — Yandex Market

## Dark Mode

```html
<html class="dark">
```

Все переменные автоматически переключаются на тёмные значения.

## Ресурсы

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Theming Guide](https://ui.shadcn.com/docs/theming)
- [Components](https://ui.shadcn.com/docs/components)

---

**Design System**: shadcn/ui  
**Version**: 3.0  
**Updated**: January 2026

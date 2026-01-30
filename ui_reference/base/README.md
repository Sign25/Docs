# shadcn/ui Design System

> Дизайн-система ADOLF на базе [shadcn/ui](https://ui.shadcn.com/)

## Обзор

shadcn/ui — это коллекция переиспользуемых компонентов, построенных на Radix UI и Tailwind CSS. Мы используем её CSS переменные для единообразного оформления всех модулей ADOLF.

## Быстрый старт

```html
<link rel="stylesheet" href="shadcn-variables.css">
<link rel="stylesheet" href="../module/module.css">
```

## Цветовая схема

### Базовые цвета (Light)

| Переменная | OKLCH | Описание |
|-----------|-------|----------|
| `--background` | `oklch(1 0 0)` | Фон страницы |
| `--foreground` | `oklch(0.145 0 0)` | Основной текст |
| `--card` | `oklch(1 0 0)` | Фон карточек |
| `--primary` | `oklch(0.205 0 0)` | Основной акцент |
| `--secondary` | `oklch(0.97 0 0)` | Вторичный цвет |
| `--muted` | `oklch(0.97 0 0)` | Приглушённый фон |
| `--accent` | `oklch(0.97 0 0)` | Акцентный фон |
| `--destructive` | `oklch(0.577 0.245 27.325)` | Ошибки |
| `--border` | `oklch(0.922 0 0)` | Границы |

### Цвета модулей ADOLF

| Модуль | Переменная | Цвет |
|--------|-----------|------|
| Content Factory | `--module-content` | Purple |
| Knowledge | `--module-knowledge` | Blue |
| CFO | `--module-cfo` | Green |
| Reputation | `--module-reputation` | Orange |
| Watcher | `--module-watcher` | Red |
| Marketing | `--module-marketing` | Pink |
| Scout | `--module-scout` | Cyan |
| Lex | `--module-lex` | Slate |

### Маркетплейсы

| Маркетплейс | Переменная |
|------------|-----------|
| Wildberries | `--mp-wildberries` |
| Ozon | `--mp-ozon` |
| Yandex Market | `--mp-yandex` |

## Типографика

```css
--font-sans: ui-sans-serif, system-ui, sans-serif;
--font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
```

| Размер | Переменная |
|--------|-----------|
| 12px | `--text-xs` |
| 14px | `--text-sm` |
| 16px | `--text-base` |
| 18px | `--text-lg` |
| 20px | `--text-xl` |

## Отступы

```css
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
```

## Скругления

```css
--radius: 0.625rem;    /* 10px — базовый */
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 10px;
--radius-full: 9999px;
```

## Тёмная тема

Активируется классом `.dark`:

```html
<html class="dark">
```

## Ресурсы

- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Theming](https://ui.shadcn.com/docs/theming)
- [Figma Kit](https://www.figma.com/community/file/1203061493325953101)

**Version**: 3.0 | **Date**: January 2026

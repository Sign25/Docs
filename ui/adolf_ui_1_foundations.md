---
title: "Раздел 1: Основы дизайн-системы"
description: "UI Design System v1.1 — CSS-переменные, цветовая модель OKLCH, типографика, отступы, скругления, тёмная тема"
mode: "wide"
---

# Основы дизайн-системы ADOLF

**Версия:** 1.1
**Дата:** Февраль 2026

## Обзор

Раздел описывает фундаментальные элементы дизайн-системы: цветовую модель, типографику, пространственную сетку и механизм тематизации. Все значения определены как CSS custom properties в файле `ui_reference/base/shadcn-variables.css` и продублированы в `ui_reference/base/shadcn-tokens.json` для программного доступа.

## Цветовая модель OKLCH

Дизайн-система использует цветовое пространство **OKLCH** (CSS Color Level 4) вместо HEX/HSL.

### Почему OKLCH

| Свойство | HSL | OKLCH |
|:---------|:----|:------|
| Перцептуальная равномерность | Нет — `hsl(120, 100%, 50%)` и `hsl(240, 100%, 50%)` визуально различаются по яркости | Да — одинаковый L даёт одинаковую воспринимаемую яркость |
| Генерация оттенков | Непредсказуемые результаты при изменении L/S | Предсказуемые `-light` и `-dark` варианты при изменении L и C |
| Поддержка wide-gamut | Ограничен sRGB | Поддерживает P3 и Rec.2020 |
| Интерполяция анимаций | Неравномерные переходы | Плавные перцептуально-линейные переходы |

### Структура значения OKLCH

```
oklch(L C H)
       │ │ │
       │ │ └── Hue (оттенок): 0–360°
       │ └──── Chroma (насыщенность): 0–0.4
       └────── Lightness (яркость): 0–1
```

Пример: `oklch(0.623 0.214 259.815)` — синий цвет с яркостью 62.3%, насыщенностью 0.214 и оттенком 259.8°.

### Принцип генерации вариантов

OKLCH позволяет предсказуемо генерировать `-light` варианты любого цвета, изменяя только L и C:

```css
/* Основной: полная насыщенность */
--info: oklch(0.623 0.214 259.815);

/* Light: L → 0.95, C → 0.04, H — сохраняется */
--info-light: oklch(0.95 0.04 259.815);
```

В тёмной теме `-light` варианты инвертируются:

```css
/* Dark mode: L → 0.3, C → 0.06, H — сохраняется */
--info-light: oklch(0.3 0.06 259.815);
```

## Базовые цвета

Базовые цвета наследуются из стандартной палитры shadcn/ui (base color: **Neutral**). Они не зависят от модулей и применяются ко всем элементам интерфейса.

### Светлая тема (`:root`)

| Переменная | OKLCH | HEX | Назначение |
|:-----------|:------|:----|:-----------|
| `--background` | `oklch(1 0 0)` | #FFFFFF | Фон страницы |
| `--foreground` | `oklch(0.145 0 0)` | #171717 | Основной текст |
| `--card` | `oklch(1 0 0)` | #FFFFFF | Фон карточек |
| `--card-foreground` | `oklch(0.145 0 0)` | #171717 | Текст в карточках |
| `--popover` | `oklch(1 0 0)` | #FFFFFF | Фон всплывающих элементов |
| `--popover-foreground` | `oklch(0.145 0 0)` | #171717 | Текст всплывающих элементов |
| `--primary` | `oklch(0.205 0 0)` | #262626 | Основной акцент (кнопки, ссылки) |
| `--primary-foreground` | `oklch(0.985 0 0)` | #FAFAFA | Текст на primary-фоне |
| `--secondary` | `oklch(0.97 0 0)` | #F5F5F5 | Вторичный фон |
| `--secondary-foreground` | `oklch(0.205 0 0)` | #262626 | Текст на secondary-фоне |
| `--muted` | `oklch(0.97 0 0)` | #F5F5F5 | Приглушённый фон |
| `--muted-foreground` | `oklch(0.556 0 0)` | #737373 | Вспомогательный текст |
| `--accent` | `oklch(0.97 0 0)` | #F5F5F5 | Акцентный фон (hover) |
| `--accent-foreground` | `oklch(0.205 0 0)` | #262626 | Текст на accent-фоне |
| `--destructive` | `oklch(0.577 0.245 27.325)` | #EF4444 | Деструктивные действия |
| `--destructive-foreground` | `oklch(0.985 0 0)` | #FAFAFA | Текст на destructive-фоне |
| `--border` | `oklch(0.922 0 0)` | #E5E5E5 | Границы элементов |
| `--input` | `oklch(0.922 0 0)` | #E5E5E5 | Границы полей ввода |
| `--ring` | `oklch(0.708 0 0)` | #A3A3A3 | Кольцо фокуса |

### Тёмная тема (`.dark`)

| Переменная | OKLCH | HEX | Изменение |
|:-----------|:------|:----|:----------|
| `--background` | `oklch(0.145 0 0)` | #171717 | Инвертирован |
| `--foreground` | `oklch(0.985 0 0)` | #FAFAFA | Инвертирован |
| `--card` | `oklch(0.205 0 0)` | #262626 | Темнее фона |
| `--primary` | `oklch(0.922 0 0)` | #E5E5E5 | Инвертирован |
| `--primary-foreground` | `oklch(0.205 0 0)` | #262626 | Инвертирован |
| `--secondary` | `oklch(0.269 0 0)` | #404040 | Инвертирован |
| `--muted` | `oklch(0.269 0 0)` | #404040 | Инвертирован |
| `--muted-foreground` | `oklch(0.708 0 0)` | #A3A3A3 | Ярче для читаемости |
| `--accent` | `oklch(0.371 0 0)` | #525252 | Инвертирован |
| `--destructive` | `oklch(0.704 0.191 22.216)` | #F87171 | Ярче для контраста |
| `--border` | `oklch(1 0 0 / 10%)` | rgba(255,255,255,0.1) | Полупрозрачный |
| `--input` | `oklch(1 0 0 / 15%)` | rgba(255,255,255,0.15) | Полупрозрачный |

### Переключение темы

Тёмная тема активируется CSS-классом `.dark` на элементе `<html>`:

```html
<!-- Светлая тема (по умолчанию) -->
<html lang="ru">

<!-- Тёмная тема -->
<html lang="ru" class="dark">
```

Все CSS-переменные автоматически переопределяются. Дополнительных действий от компонентов не требуется.

## Семантические цвета

Используются для обратной связи с пользователем: уведомления, валидация, статусы.

| Переменная | OKLCH | HEX | Назначение |
|:-----------|:------|:----|:-----------|
| `--success` | `oklch(0.723 0.191 142.495)` | #22C55E | Успех, подтверждение |
| `--success-foreground` | `oklch(0.985 0 0)` | #FAFAFA | Текст на success-фоне |
| `--warning` | `oklch(0.84 0.16 84)` | #EAB308 | Предупреждение |
| `--warning-foreground` | `oklch(0.28 0.07 46)` | #422006 | Текст на warning-фоне |
| `--info` | `oklch(0.623 0.214 259.815)` | #3B82F6 | Информация |
| `--info-foreground` | `oklch(0.985 0 0)` | #FAFAFA | Текст на info-фоне |
| `--destructive` | `oklch(0.577 0.245 27.325)` | #EF4444 | Ошибка, удаление |

### Тёмная тема — семантические цвета

| Переменная | Светлая | Тёмная | Примечание |
|:-----------|:--------|:-------|:-----------|
| `--success` | `oklch(0.723 0.191 142.495)` | `oklch(0.696 0.17 162.48)` | Hue сдвинут для контраста |
| `--warning` | `oklch(0.84 0.16 84)` | `oklch(0.41 0.11 46)` | L снижен |
| `--info` | `oklch(0.623 0.214 259.815)` | `oklch(0.488 0.243 264.376)` | L снижен, C увеличен |

## Цвета графиков

Палитра для визуализации данных в компонентах Chart (Recharts, Chart.js).

| Переменная | Светлая тема | Тёмная тема |
|:-----------|:-------------|:------------|
| `--chart-1` | `oklch(0.646 0.222 41.116)` | `oklch(0.488 0.243 264.376)` |
| `--chart-2` | `oklch(0.6 0.118 184.704)` | `oklch(0.696 0.17 162.48)` |
| `--chart-3` | `oklch(0.398 0.07 227.392)` | `oklch(0.769 0.188 70.08)` |
| `--chart-4` | `oklch(0.828 0.189 84.429)` | `oklch(0.627 0.265 303.9)` |
| `--chart-5` | `oklch(0.769 0.188 70.08)` | `oklch(0.645 0.246 16.439)` |

## Sidebar

Переменные для боковой панели навигации (компонент Sidebar из shadcn/ui).

| Переменная | Светлая | Тёмная |
|:-----------|:--------|:-------|
| `--sidebar` | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` |
| `--sidebar-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--sidebar-primary` | `oklch(0.205 0 0)` | `oklch(0.488 0.243 264.376)` |
| `--sidebar-primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.985 0 0)` |
| `--sidebar-accent` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--sidebar-accent-foreground` | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` |
| `--sidebar-border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` |
| `--sidebar-ring` | `oklch(0.708 0 0)` | `oklch(0.439 0 0)` |

## Типографика

### Шрифтовые стеки

```css
/* Основной текст */
--font-sans: ui-sans-serif, system-ui, sans-serif,
             "Apple Color Emoji", "Segoe UI Emoji",
             "Segoe UI Symbol", "Noto Color Emoji";

/* Код и моноширинный текст */
--font-mono: ui-monospace, SFMono-Regular, "SF Mono",
             Menlo, Consolas, "Liberation Mono", monospace;
```

Система использует системные шрифты ОС — никаких внешних загрузок. Это обеспечивает минимальное время рендера и нативный вид на каждой платформе.

### Размеры текста

| Переменная | rem | px | Tailwind | Применение |
|:-----------|:----|:---|:---------|:-----------|
| `--text-xs` | 0.75rem | 12px | `text-xs` | Метки, подписи, timestamps |
| `--text-sm` | 0.875rem | 14px | `text-sm` | Вспомогательный текст, описания |
| `--text-base` | 1rem | 16px | `text-base` | Основной текст (body) |
| `--text-lg` | 1.125rem | 18px | `text-lg` | Подзаголовки, акценты |
| `--text-xl` | 1.25rem | 20px | `text-xl` | Заголовки карточек |
| `--text-2xl` | 1.5rem | 24px | `text-2xl` | Заголовки секций |
| `--text-3xl` | 1.875rem | 30px | `text-3xl` | Заголовки страниц |
| `--text-4xl` | 2.25rem | 36px | `text-4xl` | Крупные заголовки, hero |

### Межстрочный интервал

| Переменная | Значение | Tailwind | Применение |
|:-----------|:---------|:---------|:-----------|
| `--leading-none` | 1 | `leading-none` | Заголовки в одну строку |
| `--leading-tight` | 1.25 | `leading-tight` | Компактные заголовки |
| `--leading-snug` | 1.375 | `leading-snug` | Подзаголовки |
| `--leading-normal` | 1.5 | `leading-normal` | Основной текст (по умолчанию) |
| `--leading-relaxed` | 1.625 | `leading-relaxed` | Длинные тексты, описания |

### Начертания

| Переменная | Значение | Tailwind | Применение |
|:-----------|:---------|:---------|:-----------|
| `--font-normal` | 400 | `font-normal` | Основной текст |
| `--font-medium` | 500 | `font-medium` | Кнопки, метки полей |
| `--font-semibold` | 600 | `font-semibold` | Заголовки карточек, подзаголовки |
| `--font-bold` | 700 | `font-bold` | Заголовки страниц, акценты |

## Пространственная сетка

### Отступы (spacing)

Система отступов кратна 4px (0.25rem). Используется для `padding`, `margin`, `gap`.

| Переменная | rem | px | Tailwind | Применение |
|:-----------|:----|:---|:---------|:-----------|
| `--spacing-0` | 0 | 0 | `p-0` | Сброс |
| `--spacing-1` | 0.25rem | 4px | `p-1` | Минимальные внутренние отступы |
| `--spacing-2` | 0.5rem | 8px | `p-2` | Между inline-элементами |
| `--spacing-3` | 0.75rem | 12px | `p-3` | Внутри компактных карточек |
| `--spacing-4` | 1rem | 16px | `p-4` | Стандартный padding карточек |
| `--spacing-5` | 1.25rem | 20px | `p-5` | Расширенный padding |
| `--spacing-6` | 1.5rem | 24px | `p-6` | Между секциями внутри карточки |
| `--spacing-8` | 2rem | 32px | `p-8` | Между карточками |
| `--spacing-10` | 2.5rem | 40px | `p-10` | Между группами элементов |
| `--spacing-12` | 3rem | 48px | `p-12` | Между секциями страницы |
| `--spacing-16` | 4rem | 64px | `p-16` | Крупные внешние отступы |

### Скругления (border-radius)

| Переменная | Формула | Значение | Tailwind | Применение |
|:-----------|:--------|:---------|:---------|:-----------|
| `--radius` | — | 0.625rem (10px) | — | Базовое значение |
| `--radius-sm` | `--radius - 4px` | 6px | `rounded-sm` | Чипы, бейджи, маленькие кнопки |
| `--radius-md` | `--radius - 2px` | 8px | `rounded-md` | Инпуты, кнопки |
| `--radius-lg` | `--radius` | 10px | `rounded-lg` | Карточки, диалоги |
| `--radius-xl` | `--radius + 4px` | 14px | `rounded-xl` | Модальные окна, большие карточки |
| `--radius-full` | — | 9999px | `rounded-full` | Аватары, круглые кнопки |

## Тени

| Переменная | Значение | Применение |
|:-----------|:---------|:-----------|
| `--shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Кнопки, инпуты |
| `--shadow` | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` | Карточки, выпадающие списки |
| `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` | Popover, hover-эффекты |
| `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | Модальные окна, диалоги |

## Анимации и переходы

| Переменная | Значение | Применение |
|:-----------|:---------|:-----------|
| `--transition-fast` | 150ms | Hover-эффекты, смена цвета |
| `--transition-normal` | 200ms | Появление/скрытие элементов |
| `--transition-slow` | 300ms | Раскрытие аккордеонов, модальные окна |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Стандартная кривая анимации |

Пример использования:

```css
.button {
  transition: background-color var(--transition-fast) var(--ease-in-out),
              box-shadow var(--transition-fast) var(--ease-in-out);
}
```

## Высоты контролов

Стандартные высоты интерактивных элементов обеспечивают единообразие кнопок, инпутов и селектов.

| Переменная | Значение | px | Применение |
|:-----------|:---------|:---|:-----------|
| `--control-sm` | 2rem | 32px | Компактные кнопки, фильтры |
| `--control-md` | 2.5rem | 40px | Стандартные кнопки и инпуты |
| `--control-lg` | 3rem | 48px | Крупные кнопки, primary actions |

## Базовые стили

Файл `shadcn-variables.css` включает минимальный набор глобальных стилей:

```css
/* Все border наследуют цвет --border */
*,
*::before,
*::after {
  border-color: var(--border);
}

/* Body наследует фон, текст и шрифт из переменных */
body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
}
```

## Design Tokens (JSON)

Для программного доступа к значениям дизайн-системы используется файл `ui_reference/base/shadcn-tokens.json`. Формат совместим с инструментами вроде Style Dictionary и Figma Tokens.

Структура файла:

```json
{
  "name": "shadcn/ui Design Tokens",
  "version": "1.0",
  "baseColor": "neutral",
  "colors": {
    "light": { ... },
    "dark": { ... },
    "chart": { ... }
  },
  "semantic": { ... },
  "modules": { ... },
  "marketplaces": { ... },
  "typography": { ... },
  "spacing": { ... },
  "borderRadius": { ... },
  "shadows": { ... },
  "controlHeight": { ... },
  "transitions": { ... },
  "components": { ... }
}
```

Полный файл: `ui_reference/base/shadcn-tokens.json`

## Подключение

### HTML

```html
<head>
  <!-- Базовые CSS-переменные дизайн-системы -->
  <link rel="stylesheet" href="ui_reference/base/shadcn-variables.css">

  <!-- Модульные стили (опционально) -->
  <link rel="stylesheet" href="ui_reference/{module}/{module}.css">
</head>
```

### Tailwind CSS

При использовании Tailwind CSS переменные маппятся через конфигурацию:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        // ... остальные переменные
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
    },
  },
}
```

## Связанные документы

| Документ | Описание |
|:---------|:---------|
| [Раздел 0: Введение](/ui/adolf_ui_0_introduction) | Обзор дизайн-системы |
| [Раздел 2: Тематизация модулей](/ui/adolf_ui_2_module_theming) | Цвета модулей и маркетплейсов |
| `ui_reference/base/shadcn-variables.css` | Исходный CSS-файл |
| `ui_reference/base/shadcn-tokens.json` | Design tokens в формате JSON |

---

**Версия:** 1.1 | **Дата:** Февраль 2026

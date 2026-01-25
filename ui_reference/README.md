# ADOLF UI Reference

Визуальный референс интерфейса системы ADOLF для разработчиков Open WebUI.

## Структура

```
ui_reference/
├── README.md                    # Этот файл
├── base/                        # Базовые стили (общие для всех модулей)
│   ├── adolf-design-tokens.css  # CSS-переменные (цвета, шрифты, отступы)
│   └── adolf-components.css     # Базовые компоненты (кнопки, карточки, таблицы)
│
├── content_factory/             # Модуль Content Factory
│   ├── content-factory.css      # Стили модуля
│   └── index.html               # Демо всех компонентов
│
├── cfo/                         # Модуль CFO (планируется)
├── reputation/                  # Модуль Reputation (планируется)
├── watcher/                     # Модуль Watcher (планируется)
├── knowledge/                   # Модуль Knowledge (планируется)
├── marketing/                   # Модуль Marketing (планируется)
├── scout/                       # Модуль Scout (планируется)
└── lex/                         # Модуль Lex (планируется)
```

## Быстрый старт

### 1. Подключение стилей

```html
<!-- Базовые стили (обязательно) -->
<link rel="stylesheet" href="ui_reference/base/adolf-design-tokens.css">
<link rel="stylesheet" href="ui_reference/base/adolf-components.css">

<!-- Стили модуля -->
<link rel="stylesheet" href="ui_reference/content_factory/content-factory.css">
```

### 2. Просмотр демо

Откройте `index.html` в браузере для просмотра всех компонентов модуля:

```bash
# Локально
open ui_reference/content_factory/index.html

# Или запустите простой сервер
python -m http.server 8000
# Затем откройте http://localhost:8000/ui_reference/content_factory/
```

## Использование с Tailwind CSS

Стили совместимы с Tailwind CSS. CSS-переменные можно использовать в Tailwind-конфиге:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'adolf-primary': 'var(--adolf-accent-primary)',
        'adolf-success': 'var(--adolf-success)',
        'adolf-warning': 'var(--adolf-warning)',
        'adolf-error': 'var(--adolf-error)',
        // Модули
        'adolf-content': 'var(--adolf-module-content)',
        'adolf-cfo': 'var(--adolf-module-cfo)',
        // ...
      }
    }
  }
}
```

## Темы

Поддерживается светлая и тёмная тема:

```html
<!-- Светлая тема (по умолчанию) -->
<body>...</body>

<!-- Тёмная тема -->
<body class="dark">...</body>
<!-- или -->
<body data-theme="dark">...</body>
```

## Связь с документацией

| Компонент | CSS-класс | Python-код |
|-----------|-----------|------------|
| Результат генерации | `.adolf-cf-result` | [content_factory_4_open_webui](../content_factory/) |
| Список черновиков | `.adolf-cf-draft-list` | `tool_list_drafts()` |
| ТЗ для дизайнера | `.adolf-cf-visual-prompt` | `tool_generate_visual_prompt()` |
| Кнопки действий | `.adolf-cf-actions` | Event Emitter |

## Версии

- **1.0** (Январь 2026) — Content Factory

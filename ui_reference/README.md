# ADOLF UI Reference

Визуальный референс интерфейса системы ADOLF для разработчиков Open WebUI.

**Design System:** Ant Design 5.0  
**Источник:** [Figma Ant Design Open Source](https://www.figma.com/community/file/831698976089873405)

---

## Структура

```
ui_reference/
├── README.md                          # Этот файл
├── base/                              # 🎨 Базовая дизайн-система (Ant Design)
│   ├── README.md                      # Документация дизайн-системы
│   ├── ant-design-variables.css       # CSS-переменные
│   ├── ant-design-tokens.json         # Design tokens (JSON)
│   └── images/                        # Визуальные референсы
│       ├── button.png
│       ├── colors.png
│       └── components-overview.png
│
├── content_factory/                   # ✅ Модуль Content Factory
│   ├── content-factory.css
│   └── index.html
│
├── knowledge/                         # ✅ Модуль Knowledge
│   ├── knowledge.css
│   └── index.html
│
├── cfo/                               # ✅ Модуль CFO
│   ├── cfo.css
│   └── index.html
│
├── reputation/                        # ✅ Модуль Reputation
│   ├── reputation.css
│   └── index.html
│
├── watcher/                           # 📋 Планируется
├── marketing/                         # 📋 Планируется
├── scout/                             # 📋 Планируется
└── lex/                               # 📋 Планируется
```

---

## Статус модулей

| Модуль | Статус | Компоненты |
|--------|--------|------------|
| **Base (Ant Design)** | ✅ Готов | Цвета, типографика, отступы, компоненты |
| **Content Factory** | ✅ Готов | Результат генерации, черновики, ТЗ дизайнеру |
| **Knowledge** | ✅ Готов | RAG-ответ, источники, загрузка, модерация |
| **CFO** | ✅ Готов | P&L таблицы, ABC-анализ, AI-инсайты |
| **Reputation** | ✅ Готов | Отзывы, AI-анализ, генерация ответов |
| Watcher | 📋 План | — |
| Marketing | 📋 План | — |
| Scout | 📋 План | — |
| Lex | 📋 План | — |

---

## Быстрый старт

### 1. Подключение стилей

```html
<!-- Базовые стили Ant Design -->
<link rel="stylesheet" href="ui_reference/base/ant-design-variables.css">

<!-- Стили модуля -->
<link rel="stylesheet" href="ui_reference/content_factory/content-factory.css">
```

### 2. Использование переменных

```css
.my-card {
  background: var(--ant-color-bg-container);
  border: 1px solid var(--ant-color-border);
  border-radius: var(--ant-border-radius-lg);
  padding: var(--ant-padding-lg);
  box-shadow: var(--ant-box-shadow);
}

.my-button {
  background: var(--ant-color-primary);
  color: #fff;
  height: var(--ant-control-height);
  padding: 0 var(--ant-padding);
  border-radius: var(--ant-border-radius);
}
```

---

## Цветовая палитра

### Семантические цвета

| Назначение | Цвет | CSS-переменная |
|------------|------|----------------|
| Primary | `#1890ff` | `--ant-color-primary` |
| Success | `#52c41a` | `--ant-color-success` |
| Warning | `#faad14` | `--ant-color-warning` |
| Error | `#f5222d` | `--ant-color-error` |
| Info | `#1890ff` | `--ant-color-info` |

### Цветовые палитры (10 оттенков)

- **Blue** (Primary): `--ant-blue-1` ... `--ant-blue-10`
- **Red**: `--ant-red-1` ... `--ant-red-10`
- **Green**: `--ant-green-1` ... `--ant-green-10`
- **Gold**: `--ant-gold-1` ... `--ant-gold-10`
- **Purple**: `--ant-purple-1` ... `--ant-purple-10`

[Полная документация цветов →](base/README.md)

---

## Типографика

```css
--ant-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
--ant-font-size-sm: 12px;
--ant-font-size: 14px;      /* Default */
--ant-font-size-lg: 16px;
--ant-font-size-xl: 20px;
```

---

## Отступы

| Токен | Размер | Padding | Margin |
|-------|--------|---------|--------|
| XXS | 4px | `--ant-padding-xxs` | `--ant-margin-xxs` |
| XS | 8px | `--ant-padding-xs` | `--ant-margin-xs` |
| SM | 12px | `--ant-padding-sm` | `--ant-margin-sm` |
| Default | 16px | `--ant-padding` | `--ant-margin` |
| LG | 24px | `--ant-padding-lg` | `--ant-margin-lg` |
| XL | 32px | `--ant-padding-xl` | `--ant-margin-xl` |

---

## Темы

### Светлая тема (по умолчанию)

```html
<body>...</body>
```

### Тёмная тема

```html
<body data-theme="dark">...</body>
```

### Переключение

```javascript
function toggleTheme() {
  const body = document.body;
  const isDark = body.getAttribute('data-theme') === 'dark';
  body.setAttribute('data-theme', isDark ? '' : 'dark');
}
```

---

## Компоненты модулей

### Content Factory

| Компонент | CSS-класс |
|-----------|-----------|
| Результат генерации | `.adolf-cf-result` |
| Список черновиков | `.adolf-cf-draft-list` |
| ТЗ для дизайнера | `.adolf-cf-visual-prompt` |
| SEO-теги | `.adolf-cf-seo-tags` |

### Knowledge

| Компонент | CSS-класс |
|-----------|-----------|
| Результат RAG | `.adolf-kb-result` |
| Карточка источника | `.adolf-kb-source-card` |
| Загрузка документа | `.adolf-kb-upload` |
| Модерация | `.adolf-kb-moderation` |

### CFO

| Компонент | CSS-класс |
|-----------|-----------|
| P&L таблица | `.adolf-cfo-table` |
| ABC-анализ | `.adolf-cfo-abc` |
| Убыточные SKU | `.adolf-cfo-losers` |
| AI-инсайты | `.adolf-cfo-insights` |

### Reputation

| Компонент | CSS-класс |
|-----------|-----------|
| Список отзывов | `.adolf-rep-list` |
| Карточка отзыва | `.adolf-rep-review-card` |
| AI-анализ | `.adolf-rep-ai-analysis` |
| Ответ | `.adolf-rep-response` |

---

## Ресурсы

| Ресурс | Ссылка |
|--------|--------|
| Ant Design | https://ant.design/ |
| Figma Community | https://www.figma.com/community/file/831698976089873405 |
| Design Tokens | [base/ant-design-tokens.json](base/ant-design-tokens.json) |
| CSS Variables | [base/ant-design-variables.css](base/ant-design-variables.css) |

---

## Версии

| Версия | Дата | Изменения |
|--------|------|-----------|
| **2.0** | Январь 2026 | Переход на Ant Design 5.0 |
| **1.3** | Январь 2026 | + Reputation |
| **1.2** | Январь 2026 | + CFO |
| **1.1** | Январь 2026 | + Knowledge |
| **1.0** | Январь 2026 | Content Factory |

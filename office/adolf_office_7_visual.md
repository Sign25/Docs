---
title: "Раздел 7: Визуализация"
mode: "wide"
---

> Версия: 1.0 (черновик)  
> Статус: MVP  
> Дата: 2025-01-24

## Референс

Стилистика: Game Dev Tycoon, упрощённая изометрия.

Ключевые характеристики:
- Чистые линии, минимум деталей
- Плоские цвета без градиентов
- Читаемость важнее реализма

## Изометрическая проекция

### Принцип

Стандартная изометрия 2:1 — каждый пиксель по горизонтали соответствует 0.5 пикселя по вертикали.

### Базовый тайл

Ромб 64×32 px — основа для построения всех элементов.

## Структура офиса

### Динамическая компоновка

Офис строится автоматически на основе данных из БД:

1. Агенты группируются по `parent_module` (отделы)
2. Каждый отдел — визуальная зона с подписью
3. Столы внутри отдела: сетка 4 в ряд с переносом
4. Отделы располагаются вертикально

```
┌─────────────────────────────────────────────────┐
│  WATCHER                                        │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐               │
│  │Agent│ │Agent│ │Agent│ │Agent│               │
│  └─────┘ └─────┘ └─────┘ └─────┘               │
│  ┌─────┐                                        │
│  │Agent│                                        │
│  └─────┘                                        │
├─────────────────────────────────────────────────┤
│  REPUTATION                                     │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│  ┌─────┐ ┌─────┐                                │
│  │Agent│ │Agent│                                │
│  └─────┘ └─────┘                                │
├─────────────────────────────────────────────────┤
│  KNOWLEDGE                                      │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│  ┌─────┐                                        │
│  │Agent│                                        │
│  └─────┘                                        │
└─────────────────────────────────────────────────┘
```

### Слои (z-index)

| Слой | Содержимое | z-index |
|------|------------|---------|
| Floor | Цветовые зоны отделов | 0 |
| Labels | Подписи отделов | 5 |
| Furniture | Столы, стулья | 10 |
| Characters | Аватары (GIF) | 20 |
| Effects | Подсветка, иконки | 30 |
| UI | Модальные окна | 100 |

## Элементы

### Отдел (Department)

Визуальная группа:
- Цветовая зона (фон)
- Подпись модуля (заголовок)
- Сетка столов агентов

### Рабочее место

Состав:
- Стол (поверхность + ножки) — SVG
- Стул — SVG
- Подпись агента — текст
- Аватар — GIF

Размер: 2×1 тайла (128×64 px)

### Аватар сотрудника (GIF)

Универсальный аватар для всех агентов. Различимость через позицию стола + подпись.

**Файлы:**

| Файл | Состояние | Описание |
|------|-----------|----------|
| `working.gif` | ok + задача | Сидит, печатает |
| `idle.gif` | ok + ожидание | Сидит, смотрит |
| `tired.gif` | warning | Сидит устало |
| `error.gif` | error | Лежит на столе |

**Характеристики:**
- Размер: 64×64 px
- Цикл анимации: 1-2 секунды
- Формат: GIF (прозрачный фон)
- Количество кадров: 4-8

### Индикаторы

Иконки над рабочим местом:
- Размер: 16×16 px
- Позиция: над головой аватара
- Стиль: emoji или простые SVG-иконки

## Цветовая палитра

### Статусы (подсветка стола)

| Статус | Подсветка | HEX |
|--------|-----------|-----|
| ok | Зелёный | #4CAF50 |
| warning | Жёлтый | #FFC107 |
| error | Красный | #F44336 |

### Цветовые зоны отделов

| Модуль | Цвет зоны | HEX |
|--------|-----------|-----|
| watcher | Светло-фиолетовый | #F3E5F5 |
| reputation | Светло-оранжевый | #FFF3E0 |
| content_factory | Светло-зелёный | #E8F5E9 |
| marketing | Светло-красный | #FFEBEE |
| scout | Светло-бирюзовый | #E0F7FA |
| knowledge | Светло-синий | #E3F2FD |
| cfo | Светло-коричневый | #EFEBE9 |
| lex | Светло-индиго | #E8EAF6 |

### Общие элементы

| Элемент | Цвет | HEX |
|---------|------|-----|
| Стол | Дерево | #8D6E63 |
| Стул | Тёмно-серый | #616161 |
| Разделитель | Серый | #BDBDBD |
| Подпись отдела | Тёмно-серый | #424242 |
| Подпись агента | Серый | #757575 |

## Алгоритм компоновки

```javascript
function buildOfficeLayout(agents) {
  // 1. Группировка по модулям
  const departments = groupBy(agents, 'parent_module');
  
  // 2. Сортировка отделов (по алфавиту)
  const sortedModules = Object.keys(departments).sort();
  
  let yOffset = 0;
  
  for (const module of sortedModules) {
    const moduleAgents = departments[module];
    
    // 3. Отрисовка заголовка отдела
    renderDepartmentHeader(module, yOffset);
    yOffset += HEADER_HEIGHT;
    
    // 4. Отрисовка цветовой зоны
    const rows = Math.ceil(moduleAgents.length / 4);
    renderDepartmentZone(module, yOffset, rows);
    
    // 5. Расстановка столов (4 в ряд)
    moduleAgents.forEach((agent, index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      renderDesk(agent, col, yOffset + row * DESK_HEIGHT);
    });
    
    yOffset += rows * DESK_HEIGHT + PADDING;
  }
}
```

## Состояния аватаров

### Маппинг статус → GIF

| status | current_task | GIF-файл |
|--------|--------------|----------|
| ok | есть | working.gif |
| ok | пусто/null | idle.gif |
| warning | любой | tired.gif |
| error | любой | error.gif |

### Анимации подсветки (CSS)

| Статус | Анимация стола |
|--------|----------------|
| ok | Статичная подсветка |
| warning | Мягкий pulse (2s) |
| error | Интенсивный pulse (1s) |

## Принцип реализации

### SVG + GIF структура

```xml
<svg id="office" viewBox="0 0 640 800">
  <!-- Динамически генерируется -->
  
  <!-- Отдел Watcher -->
  <g id="dept-watcher" class="department">
    <rect class="dept-zone" fill="#F3E5F5" />
    <text class="dept-label">Watcher</text>
    
    <g class="desk" data-agent="watcher_price_monitor">
      <use href="#desk-template"/>
      <foreignObject>
        <img src="/static/office/avatars/working.gif" class="avatar" />
      </foreignObject>
      <text class="agent-label">Мониторинг цен</text>
    </g>
    
    <!-- ... другие столы ... -->
  </g>
  
  <!-- Отдел Reputation -->
  <g id="dept-reputation" class="department">
    <!-- ... -->
  </g>
</svg>
```

### CSS

```css
/* Зона отдела */
.dept-zone {
  rx: 8px;
  opacity: 0.7;
}

/* Заголовок отдела */
.dept-label {
  font-size: 14px;
  font-weight: bold;
  fill: #424242;
}

/* Подпись агента */
.agent-label {
  font-size: 11px;
  fill: #757575;
  text-anchor: middle;
}

/* Подсветка стола */
.desk--ok .desk-glow { fill: #4CAF50; opacity: 0.3; }
.desk--warning .desk-glow { fill: #FFC107; animation: pulse 2s infinite; }
.desk--error .desk-glow { fill: #F44336; animation: pulse 1s infinite; }

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}
```

### JavaScript: динамическое построение

```javascript
async function renderOffice() {
  const response = await fetch('/api/v1/office/agents');
  const data = await response.json();
  
  const svg = document.getElementById('office');
  svg.innerHTML = ''; // Очистка
  
  buildOfficeLayout(data.departments);
}

// Polling
setInterval(renderOffice, 30000);
```

## Адаптивность

| Viewport | Поведение |
|----------|-----------|
| Desktop (>1024px) | Полный размер |
| Tablet (768-1024px) | Scale 0.8, вертикальный скролл |
| Mobile (<768px) | Не поддерживается в MVP |

## Файловая структура

```
/static/office/
  ├── office.css          # Стили
  ├── office.js           # Логика компоновки
  ├── sprites.svg         # SVG-шаблоны (стол, стул)
  └── avatars/
      ├── working.gif     # Работает
      ├── idle.gif        # Ожидает
      ├── tired.gif       # Устал
      └── error.gif       # Ошибка
```

## Ограничения MVP

- Порядок отделов по алфавиту (без кастомизации)
- Фиксированная сетка 4 стола в ряд
- Без drag-and-drop
- Только вертикальный скролл при большом количестве агентов
- Только desktop

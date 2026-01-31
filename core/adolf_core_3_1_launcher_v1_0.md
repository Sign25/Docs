# ADOLF CORE — Часть 3.1: Launcher — Система баннерного подменю

**Проект:** Ядро корпоративной AI-системы  
**Модуль:** User Interface / Launcher  
**Версия:** 1.0  
**Дата:** Январь 2026

---

## 1. Введение

### 1.1. Назначение

Launcher — компонент системы ADOLF, обеспечивающий двухуровневую навигацию с визуальным выбором действий через баннеры. Пользователь сначала выбирает модуль в боковом меню, затем видит экран с баннерами доступных действий, и только после выбора конкретного баннера запускается исполняемый код.

### 1.2. Проблема и решение

| Проблема | Решение Launcher |
|----------|------------------|
| Автозапуск LLM при открытии модуля | Код запускается только после явного выбора действия |
| Пользователь не понимает возможности модуля | Визуальные баннеры с описанием каждого действия |
| Нет контроля над запуском задач | Двухуровневая навигация: модуль → действие |
| Сложная навигация в чат-интерфейсе | Продуктовый UX вместо чат-ориентированного |

### 1.3. Ключевые принципы

- **Два уровня навигации** — модуль → баннеры действий → результат
- **Прямой запуск** — действие выполняется сразу без дополнительных параметров (MVP)
- **Контроль доступа на уровне модуля** — если пользователь видит модуль, он видит все его баннеры
- **JSON-конфигурация** — статичные файлы конфигурации для MVP
- **Отдельная страница результата** — с навигацией назад

### 1.4. Связь с UI Reference

Launcher использует дизайн-систему **shadcn/ui** и **Lucide Icons** из `ui_reference/base/`:

| Модуль | CSS Variable | Lucide Icon | HEX |
|--------|--------------|-------------|-----|
| CFO | `--module-cfo` | `line-chart` | #22C55E |
| Reputation | `--module-reputation` | `thumbs-up` | #F97316 |
| Watcher | `--module-watcher` | `eye` | #EF4444 |
| Content Factory | `--module-content` | `factory` | #A855F7 |
| Marketing | `--module-marketing` | `megaphone` | #EC4899 |
| Scout | `--module-scout` | `search` | #06B6D4 |
| Knowledge | `--module-knowledge` | `book-open-check` | #3B82F6 |
| Lex | `--module-lex` | `scale` | #64748B |

---

## 2. Архитектура

### 2.1. Общая схема

\`\`\`mermaid
flowchart TB
    subgraph UI["Frontend (SvelteKit)"]
        SIDEBAR["Sidebar<br/>Боковое меню"]
        LAUNCHER["Launcher Page<br/>/apps/{module}"]
        RESULT["Result Page<br/>/apps/{module}/result"]
    end
    
    subgraph CONFIG["Конфигурация"]
        JSON["JSON Files<br/>/config/launcher/"]
    end
    
    subgraph BACKEND["Backend (FastAPI)"]
        API["Launcher API<br/>/api/launcher/"]
        EXECUTOR["Action Executor"]
    end
    
    subgraph SERVICES["Сервисы"]
        LLM["LLM / AI"]
        TOOLS["Tools"]
        CELERY["Celery Tasks"]
    end
    
    SIDEBAR -->|"Клик по модулю"| LAUNCHER
    JSON -->|"Загрузка баннеров"| LAUNCHER
    LAUNCHER -->|"Выбор баннера"| API
    API --> EXECUTOR
    EXECUTOR --> LLM
    EXECUTOR --> TOOLS
    EXECUTOR --> CELERY
    EXECUTOR -->|"Результат"| RESULT
    RESULT -->|"Кнопка назад"| LAUNCHER
\`\`\`

### 2.2. Поток данных

\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant S as Sidebar
    participant L as Launcher Page
    participant A as Launcher API
    participant E as Executor
    participant R as Result Page
    
    U->>S: Клик по модулю CFO
    S->>L: Переход /apps/cfo
    L->>L: Загрузка banners.json
    L->>U: Отображение баннеров
    
    U->>L: Клик по баннеру "P&L отчёт"
    L->>A: POST /api/launcher/execute
    A->>E: Запуск action: pnl_report
    E->>E: Выполнение логики
    E-->>A: Результат
    A-->>L: Redirect /apps/cfo/result
    L->>R: Переход на страницу результата
    R->>U: Отображение результата
    
    U->>R: Клик "Назад"
    R->>L: Возврат к баннерам
\`\`\`

### 2.3. Структура файлов

\`\`\`
/app/
├── frontend/
│   └── src/
│       ├── lib/
│       │   └── styles/
│       │       └── launcher.css         # Стили Launcher (shadcn/ui)
│       └── routes/
│           └── apps/
│               ├── +layout.svelte       # Общий layout
│               ├── [module]/
│               │   ├── +page.svelte     # Страница баннеров
│               │   └── result/
│               │       └── +page.svelte # Страница результата
│               └── components/
│                   ├── Banner.svelte    # Компонент баннера
│                   ├── BannerGrid.svelte # Сетка баннеров
│                   └── ResultView.svelte # Отображение результата
├── backend/
│   └── routes/
│       └── launcher.py                  # API endpoints
├── config/
│   └── launcher/
│       ├── cfo.json
│       ├── reputation.json
│       ├── watcher.json
│       └── ...
└── executors/
    └── launcher/
        ├── __init__.py
        ├── cfo.py
        └── ...
\`\`\`

---

## 3. Конфигурация баннеров

### 3.1. JSON-схема

\`\`\`json
{
  "module": "cfo",
  "version": "1.0",
  "title": "Финансы",
  "description": "Финансовая аналитика и отчётность",
  "icon": "line-chart",
  "banners": [
    {
      "id": "pnl_report",
      "title": "P&L отчёт",
      "description": "Прибыль и убытки за период",
      "icon": "file-bar-chart",
      "action": "cfo.pnl_report",
      "enabled": true,
      "badge": null
    }
  ]
}
\`\`\`

### 3.2. Поля конфигурации

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `module` | string | ✅ | Идентификатор модуля |
| `version` | string | ✅ | Версия конфигурации |
| `title` | string | ✅ | Заголовок страницы |
| `description` | string | ❌ | Описание модуля |
| `icon` | string | ❌ | Lucide icon name |
| `banners` | array | ✅ | Массив баннеров |

### 3.3. Поля баннера

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `id` | string | ✅ | Уникальный ID |
| `title` | string | ✅ | Заголовок |
| `description` | string | ❌ | Описание действия |
| `icon` | string | ❌ | Lucide icon name |
| `action` | string | ✅ | ID действия (module.action) |
| `enabled` | boolean | ❌ | Активен ли (default: true) |
| `badge` | string | ❌ | Бейдж (NEW, AI, BETA) |

---

## 4. Стили (shadcn/ui)

### 4.1. Подключение базовых стилей

\`\`\`html
<!-- Подключаем базовые переменные из ui_reference -->
<link rel="stylesheet" href="/ui_reference/base/shadcn-variables.css">
<link rel="stylesheet" href="/styles/launcher.css">
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
\`\`\`

### 4.2. CSS компоненты Launcher

\`\`\`css
/* launcher.css - extends shadcn-variables.css */

.launcher-page {
  padding: var(--spacing-6);
  max-width: 1200px;
  margin: 0 auto;
}

.launcher-header {
  margin-bottom: var(--spacing-8);
}

.launcher-header h1 {
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  color: var(--foreground);
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.launcher-header p {
  color: var(--muted-foreground);
  margin-top: var(--spacing-2);
}

/* Banner Grid */
.banner-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-4);
}

/* Banner Card */
.banner {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-4);
  padding: var(--spacing-5);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
}

.banner:hover:not(.banner--disabled) {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--module-color, var(--primary));
}

.banner--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Banner Icon */
.banner__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--module-color-light, var(--secondary));
  color: var(--module-color, var(--primary));
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Banner Content */
.banner__title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--card-foreground);
}

.banner__description {
  font-size: var(--text-sm);
  color: var(--muted-foreground);
  line-height: var(--leading-snug);
}

/* Banner Badge */
.banner__badge {
  position: absolute;
  top: var(--spacing-3);
  right: var(--spacing-3);
  background: var(--module-color, var(--primary));
  color: white;
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-sm);
  text-transform: uppercase;
}

/* Module Color Variants */
.banner[data-module="cfo"] {
  --module-color: var(--module-cfo);
  --module-color-light: var(--module-cfo-light);
}

.banner[data-module="reputation"] {
  --module-color: var(--module-reputation);
  --module-color-light: var(--module-reputation-light);
}

.banner[data-module="watcher"] {
  --module-color: var(--module-watcher);
  --module-color-light: var(--module-watcher-light);
}

.banner[data-module="content_factory"] {
  --module-color: var(--module-content);
  --module-color-light: var(--module-content-light);
}

.banner[data-module="marketing"] {
  --module-color: var(--module-marketing);
  --module-color-light: var(--module-marketing-light);
}

.banner[data-module="scout"] {
  --module-color: var(--module-scout);
  --module-color-light: var(--module-scout-light);
}

.banner[data-module="knowledge"] {
  --module-color: var(--module-knowledge);
  --module-color-light: var(--module-knowledge-light);
}

.banner[data-module="lex"] {
  --module-color: var(--module-lex);
  --module-color-light: var(--module-lex-light);
}

/* Back Button */
.back-button {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  color: var(--muted-foreground);
  font-size: var(--text-sm);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-2) 0;
  margin-bottom: var(--spacing-4);
}

.back-button:hover {
  color: var(--foreground);
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: oklch(0 0 0 / 50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--muted);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Result Page */
.result-page {
  padding: var(--spacing-6);
  max-width: 1200px;
  margin: 0 auto;
}

.result-footer {
  margin-top: var(--spacing-8);
  padding-top: var(--spacing-6);
  border-top: 1px solid var(--border);
  display: flex;
  gap: var(--spacing-4);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  height: var(--control-md);
  padding: 0 var(--spacing-4);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn--secondary {
  background: var(--secondary);
  color: var(--secondary-foreground);
  border: 1px solid var(--border);
}

.btn--secondary:hover {
  background: var(--accent);
}
\`\`\`

---

## 5. Backend API

### 5.1. Endpoints

| Endpoint | Method | Описание |
|----------|--------|----------|
| `/api/launcher/config/{module}` | GET | Конфигурация баннеров |
| `/api/launcher/execute` | POST | Выполнение действия |
| `/api/launcher/modules` | GET | Список модулей |

### 5.2. Реализация

\`\`\`python
# backend/routes/launcher.py

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Any
import json
from pathlib import Path
from datetime import datetime

from core.auth import get_current_user
from core.permissions import check_module_access

router = APIRouter(prefix="/api/launcher", tags=["launcher"])
CONFIG_PATH = Path("/app/config/launcher")


class ExecuteRequest(BaseModel):
    module: str
    action: str
    banner_id: str


class ExecuteResponse(BaseModel):
    success: bool
    action: str
    title: str
    data: Any
    timestamp: str
    error: Optional[str] = None


@router.get("/config/{module}")
async def get_module_config(
    module: str,
    user: dict = Depends(get_current_user)
):
    if not check_module_access(user["role"], module):
        raise HTTPException(403, "Access denied")
    
    config_file = CONFIG_PATH / f"{module}.json"
    if not config_file.exists():
        raise HTTPException(404, "Module not found")
    
    with open(config_file, "r", encoding="utf-8") as f:
        return json.load(f)


@router.post("/execute", response_model=ExecuteResponse)
async def execute_action(
    request: ExecuteRequest,
    user: dict = Depends(get_current_user)
):
    if not check_module_access(user["role"], request.module):
        raise HTTPException(403, "Access denied")
    
    # Load config for title
    config_file = CONFIG_PATH / f"{request.module}.json"
    with open(config_file, "r", encoding="utf-8") as f:
        config = json.load(f)
    
    banner = next(
        (b for b in config["banners"] if b["id"] == request.banner_id),
        None
    )
    
    if not banner or not banner.get("enabled", True):
        raise HTTPException(400, "Banner not available")
    
    try:
        result = await _execute_action(
            request.module, request.action, user
        )
        return ExecuteResponse(
            success=True,
            action=request.action,
            title=banner["title"],
            data=result,
            timestamp=datetime.utcnow().isoformat()
        )
    except Exception as e:
        return ExecuteResponse(
            success=False,
            action=request.action,
            title=banner["title"],
            data=None,
            timestamp=datetime.utcnow().isoformat(),
            error=str(e)
        )


async def _execute_action(module: str, action: str, user: dict) -> Any:
    executor = __import__(
        f"executors.launcher.{module}",
        fromlist=[action.split(".")[-1]]
    )
    func = getattr(executor, action.split(".")[-1])
    return await func(user=user)
\`\`\`

---

## 6. Примеры конфигурации

### 6.1. CFO

\`\`\`json
{
  "module": "cfo",
  "version": "1.0",
  "title": "Финансы",
  "description": "Финансовая аналитика и отчётность",
  "icon": "line-chart",
  "banners": [
    {
      "id": "pnl_report",
      "title": "P&L отчёт",
      "description": "Прибыль и убытки за текущую неделю",
      "icon": "file-bar-chart",
      "action": "cfo.pnl_report"
    },
    {
      "id": "abc_analysis",
      "title": "ABC-анализ",
      "description": "Классификация SKU по вкладу в прибыль",
      "icon": "bar-chart-3",
      "action": "cfo.abc_analysis"
    },
    {
      "id": "margin_report",
      "title": "Маржинальность",
      "description": "Анализ маржи по товарам",
      "icon": "trending-up",
      "action": "cfo.margin_report"
    },
    {
      "id": "weekly_summary",
      "title": "Еженедельная сводка",
      "description": "Сводный отчёт с AI-рекомендациями",
      "icon": "sparkles",
      "action": "cfo.weekly_summary",
      "badge": "AI"
    }
  ]
}
\`\`\`

### 6.2. Reputation

\`\`\`json
{
  "module": "reputation",
  "version": "1.0",
  "title": "Отзывы",
  "description": "Работа с отзывами и вопросами",
  "icon": "thumbs-up",
  "banners": [
    {
      "id": "pending_reviews",
      "title": "На модерацию",
      "description": "Отзывы, ожидающие ответа",
      "icon": "inbox",
      "action": "reputation.pending_reviews"
    },
    {
      "id": "negative_reviews",
      "title": "Негативные отзывы",
      "description": "Отзывы с оценкой 1-2 звезды",
      "icon": "alert-triangle",
      "action": "reputation.negative_reviews"
    },
    {
      "id": "questions",
      "title": "Вопросы",
      "description": "Вопросы покупателей без ответа",
      "icon": "help-circle",
      "action": "reputation.questions"
    },
    {
      "id": "stats",
      "title": "Статистика",
      "description": "Аналитика по отзывам",
      "icon": "pie-chart",
      "action": "reputation.stats"
    }
  ]
}
\`\`\`

### 6.3. Watcher

\`\`\`json
{
  "module": "watcher",
  "version": "1.0",
  "title": "Мониторинг цен",
  "description": "Отслеживание цен конкурентов",
  "icon": "eye",
  "banners": [
    {
      "id": "price_alerts",
      "title": "Ценовые алерты",
      "description": "Товары с изменением цены",
      "icon": "bell-ring",
      "action": "watcher.price_alerts"
    },
    {
      "id": "competitor_report",
      "title": "Отчёт по конкурентам",
      "description": "Сравнение цен с конкурентами",
      "icon": "users",
      "action": "watcher.competitor_report"
    },
    {
      "id": "price_history",
      "title": "История цен",
      "description": "Динамика изменения цен",
      "icon": "history",
      "action": "watcher.price_history"
    },
    {
      "id": "recommendations",
      "title": "Рекомендации",
      "description": "AI-рекомендации по ценам",
      "icon": "sparkles",
      "action": "watcher.recommendations",
      "badge": "AI"
    }
  ]
}
\`\`\`

### 6.4. Knowledge

\`\`\`json
{
  "module": "knowledge",
  "version": "1.0",
  "title": "База знаний",
  "description": "Корпоративная база знаний",
  "icon": "book-open-check",
  "banners": [
    {
      "id": "search",
      "title": "Поиск",
      "description": "Поиск по базе знаний",
      "icon": "search",
      "action": "knowledge.search"
    },
    {
      "id": "recent_docs",
      "title": "Последние документы",
      "description": "Недавно добавленные",
      "icon": "file-text",
      "action": "knowledge.recent_docs"
    },
    {
      "id": "pending_moderation",
      "title": "На модерацию",
      "description": "Документы на проверке",
      "icon": "clock",
      "action": "knowledge.pending_moderation"
    },
    {
      "id": "categories",
      "title": "Категории",
      "description": "Просмотр по категориям",
      "icon": "folder-tree",
      "action": "knowledge.categories"
    }
  ]
}
\`\`\`

---

## 7. Версия 2.0 (планы)

### 7.1. PostgreSQL конфигурация

\`\`\`sql
CREATE TABLE launcher_modules (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true
);

CREATE TABLE launcher_banners (
    id SERIAL PRIMARY KEY,
    module_id INTEGER REFERENCES launcher_modules(id),
    code VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    badge VARCHAR(20),
    UNIQUE(module_id, code)
);
\`\`\`

### 7.2. Форма параметров

\`\`\`json
{
  "id": "custom_report",
  "title": "Кастомный отчёт",
  "action": "cfo.custom_report",
  "params": {
    "type": "form",
    "fields": [
      {"name": "start_date", "type": "date", "label": "Начало", "required": true},
      {"name": "end_date", "type": "date", "label": "Конец", "required": true},
      {"name": "marketplace", "type": "select", "options": ["all", "wb", "ozon"]}
    ]
  }
}
\`\`\`

### 7.3. Типы действий

| Тип | Описание |
|-----|----------|
| `direct` | Прямой запуск (MVP) |
| `form` | Форма параметров |
| `chat` | Переход в чат |
| `redirect` | Внешний URL |

---

## 8. Резюме

### MVP (v1.0)

| Компонент | Статус |
|-----------|--------|
| JSON-конфигурация | ✅ |
| Двухуровневая навигация | ✅ |
| Прямой запуск | ✅ |
| Страница результата | ✅ |
| shadcn/ui стили | ✅ |
| Lucide иконки | ✅ |

### Планы (v2.0)

| Компонент | Статус |
|-----------|--------|
| PostgreSQL конфигурация | 📋 |
| Форма параметров | 📋 |
| Три уровня навигации | 📋 |
| Переход в чат | 📋 |

---

## 9. Связанные документы

| Документ | Описание |
|----------|----------|
| `ui_reference/base/shadcn-variables.css` | CSS переменные |
| `ui_reference/base/shadcn-tokens.json` | Design tokens |
| `ui_reference/README.md` | Обзор дизайн-системы |

---

**Версия:** 1.0  
**Дата:** Январь 2026  
**Статус:** Утверждён

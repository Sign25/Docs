# ADOLF LOGISTIC — Раздел 7: Open WebUI Integration

**Модуль:** Logistic  
**Компонент:** Open WebUI Integration  
**Версия:** 2.0  
**Дата:** Февраль 2026  
**Заменяет:** adolf_logistic_7_open_webui_v1_0.md

---

## 7.1 Назначение

### Описание

Интеграция модуля Logistic с Open WebUI обеспечивает:
- Диалоговый интерфейс для мониторинга остатков FBO по 31 кластеру Ozon
- Управление наряд-заданиями (просмотр, подтверждение, отгрузка)
- Просмотр остатков внутреннего склада (1С)
- Работу с алертами и прогнозами
- Сводный дашборд объединённых данных (Ozon + 1С)

### Изменения v1.0 → v2.0

| Аспект | v1.0 | v2.0 |
|--------|------|------|
| Данные | Остатки WB, кросс-докинг | Кластеры Ozon FBO + 1С |
| Рекомендации | Распределение по складам WB | Наряд-задания с workflow |
| Контекст | warehouse_name, region | cluster_name, velocity, days_to_zero |
| Tools | 5 (stocks, cross_dock, alerts, recommendation, dashboard) | 8 (+ supply tasks, 1С stocks, forecast) |

---

## 7.2 Pipeline

### Конфигурация

```python
# open_webui/pipeline.py
"""
title: Adolf Logistic Pipeline
author: ADOLF Team
version: 2.0
description: Pipeline для управления логистикой Ozon FBO
"""

from typing import List
from pydantic import BaseModel


class Pipeline:
    class Valves(BaseModel):
        LOGISTIC_API_URL: str = "http://localhost:8000"
        ENABLE_ALERTS: bool = True
        ENABLE_SUPPLY_TASKS: bool = True
        DEFAULT_BRAND: str = "ohana_market"
    
    def __init__(self):
        self.name = "Adolf Logistic"
        self.valves = self.Valves()
    
    async def on_startup(self):
        pass
    
    async def on_shutdown(self):
        pass
    
    def pipe(
        self,
        user_message: str,
        model_id: str,
        messages: List[dict],
        body: dict
    ) -> str:
        system_prompt = self._build_system_prompt(body)
        
        if messages and messages[0].get("role") != "system":
            messages.insert(0, {
                "role": "system",
                "content": system_prompt
            })
        
        return body
    
    def _build_system_prompt(self, body: dict) -> str:
        user = body.get("user", {})
        brand_id = user.get("brand_id", self.valves.DEFAULT_BRAND)
        
        return f"""Ты — AI-ассистент модуля Logistic системы ADOLF.
Маркетплейс: Ozon (31 кластер FBO).

## Твои возможности:
1. Показывать остатки FBO по кластерам Ozon
2. Показывать остатки внутреннего склада (1С)
3. Показывать и управлять наряд-заданиями на отгрузку
4. Строить прогнозы по дням до обнуления
5. Показывать и управлять алертами
6. Формировать сводный дашборд

## Контекст пользователя:
- Бренд: {brand_id}
- Роль: {user.get('role', 'manager')}

## Доступные Tools:
- get_dashboard — сводный дашборд (Ozon + 1С)
- get_cluster_stocks — остатки FBO по кластерам
- get_article_details — детали артикула по всем кластерам
- get_warehouse_stocks — остатки склада 1С
- get_urgent_stocks — критические остатки (< 7 дней)
- get_supply_tasks — список наряд-заданий
- update_task_status — подтвердить / собрать / отгрузить задание
- get_alerts — список алертов

## Правила:
- Всегда используй Tools для получения данных
- Форматируй ответы с таблицами и эмодзи
- При критических остатках предупреждай пользователя
- Показывай days_to_zero и velocity для контекста
- При наличии URGENT заданий — выводи их первыми
"""
```

---

## 7.3 Tools

### get_dashboard

```python
# open_webui/tools.py
"""
title: Logistic Tools
author: ADOLF Team
version: 2.0
"""

import httpx
from typing import Optional


class Tools:
    def __init__(self):
        self.api_url = "http://localhost:8000"
    
    async def get_dashboard(
        self,
        __user__: dict = {}
    ) -> str:
        """
        Сводный дашборд логистики: Ozon FBO + 1С + задания.
        
        :return: Ключевые метрики
        """
        headers = {"X-User-Id": __user__.get("id", "")}
        
        async with httpx.AsyncClient() as client:
            stocks_resp = await client.get(
                f"{self.api_url}/logistic/stocks/summary",
                headers=headers
            )
            tasks_resp = await client.get(
                f"{self.api_url}/logistic/supply-tasks/summary",
                headers=headers
            )
            alerts_resp = await client.get(
                f"{self.api_url}/logistic/alerts",
                params={"is_read": False, "limit": 5},
                headers=headers
            )
        
        stocks = stocks_resp.json()
        tasks = tasks_resp.json()
        alerts = alerts_resp.json()
        
        result = "📊 **Дашборд Logistic**\n\n"
        
        # Остатки FBO
        result += "**Ozon FBO (кластеры):**\n"
        result += f"- Артикулов отслеживается: {stocks.get('total_articles', 0)}\n"
        result += f"- 🔴 Urgent (< 3 дн.): {stocks.get('urgent_count', 0)}\n"
        result += f"- 🟡 Soon (< 7 дн.): {stocks.get('soon_count', 0)}\n"
        result += f"- 🚫 Out of stock: {stocks.get('out_of_stock_count', 0)}\n"
        result += f"- ✅ Enough: {stocks.get('enough_count', 0)}\n\n"
        
        # Склад 1С
        result += "**Внутренний склад (1С):**\n"
        result += f"- Последний импорт: {stocks.get('last_import', 'нет данных')}\n"
        result += f"- Артикулов на складе: {stocks.get('warehouse_articles', 0)}\n\n"
        
        # Наряд-задания
        result += "**Наряд-задания (сегодня):**\n"
        result += f"- Всего: {tasks.get('total', 0)}\n"
        by_status = tasks.get('by_status', {})
        if by_status.get('new', 0) > 0:
            result += f"- 📋 Новых: {by_status['new']}\n"
        if by_status.get('confirmed', 0) > 0:
            result += f"- ✅ Подтверждённых: {by_status['confirmed']}\n"
        if by_status.get('collected', 0) > 0:
            result += f"- 📦 Собранных: {by_status['collected']}\n"
        if by_status.get('shipped', 0) > 0:
            result += f"- 🚛 Отгруженных: {by_status['shipped']}\n"
        result += f"- Urgent: {tasks.get('by_priority', {}).get('urgent', 0)}\n\n"
        
        # Алерты
        alert_items = alerts.get("items", [])
        if alert_items:
            result += f"**🔔 Непрочитанных алертов: {len(alert_items)}**\n"
            for a in alert_items[:3]:
                emoji = {"high": "🔴", "medium": "🟡", "low": "🟢"}.get(
                    a["severity"], ""
                )
                result += f"- {emoji} {a['message']}\n"
        else:
            result += "✅ Нет активных алертов\n"
        
        return result
```

### get_cluster_stocks

```python
    async def get_cluster_stocks(
        self,
        cluster: Optional[str] = None,
        status: Optional[str] = None,
        __user__: dict = {}
    ) -> str:
        """
        Остатки FBO по кластерам Ozon.
        
        :param cluster: Фильтр по кластеру (опционально)
        :param status: Фильтр по статусу: urgent, soon, out_of_stock
        :return: Таблица остатков по кластерам
        """
        if cluster:
            url = f"{self.api_url}/logistic/stocks/by-cluster/{cluster}"
        elif status == "urgent":
            url = f"{self.api_url}/logistic/stocks/urgent"
        else:
            url = f"{self.api_url}/logistic/stocks/summary"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                headers={"X-User-Id": __user__.get("id", "")}
            )
            data = response.json()
        
        if isinstance(data, list):
            items = data
        else:
            items = data.get("items", [])
        
        if not items:
            return "Остатки не найдены по заданным критериям."
        
        result = f"📦 **Остатки FBO Ozon"
        if cluster:
            result += f" — {cluster}"
        result += "**\n\n"
        
        result += "| Артикул | Кластер | FBO | В пути | Дней до 0 | Статус |\n"
        result += "|---------|---------|-----|--------|-----------|--------|\n"
        
        for item in items[:25]:
            d2z = item.get("days_to_zero")
            d2z_str = f"{d2z:.1f}" if d2z else "—"
            
            if item.get("fbo_stock", 0) == 0:
                status_icon = "🚫"
            elif d2z and d2z < 3:
                status_icon = "🔴"
            elif d2z and d2z < 7:
                status_icon = "🟡"
            else:
                status_icon = "✅"
            
            result += (
                f"| {item['article']} "
                f"| {item['cluster_name'][:20]} "
                f"| {item.get('fbo_stock', 0)} "
                f"| {item.get('in_transit', 0)} "
                f"| {d2z_str} "
                f"| {status_icon} |\n"
            )
        
        if len(items) > 25:
            result += f"\n_Показано 25 из {len(items)}_"
        
        return result
```

### get_article_details

```python
    async def get_article_details(
        self,
        article: str,
        __user__: dict = {}
    ) -> str:
        """
        Детали артикула: остатки FBO по всем кластерам + склад 1С.
        
        :param article: Артикул товара (= offer_id Ozon)
        :return: Распределение по кластерам + доступность на складе
        """
        async with httpx.AsyncClient() as client:
            # FBO по кластерам
            fbo_resp = await client.get(
                f"{self.api_url}/logistic/stocks/by-article/{article}",
                headers={"X-User-Id": __user__.get("id", "")}
            )
            # 1С склад
            wh_resp = await client.get(
                f"{self.api_url}/logistic/imports/stocks/{article}",
                headers={"X-User-Id": __user__.get("id", "")}
            )
        
        clusters = fbo_resp.json()
        warehouse = wh_resp.json()
        
        result = f"📦 **Артикул: {article}**\n\n"
        
        # 1С склад
        wh_stock = warehouse.get("warehouse_stock", 0)
        result += f"🏭 **Внутренний склад (1С):** {wh_stock or 0} шт\n\n"
        
        # FBO по кластерам
        if clusters:
            total_fbo = sum(c.get("fbo_stock", 0) for c in clusters)
            result += f"📊 **FBO (всего): {total_fbo} шт по {len(clusters)} кластерам**\n\n"
            
            result += "| Кластер | FBO | В пути | Продаж/день | Дней до 0 | Дефицит |\n"
            result += "|---------|-----|--------|-------------|-----------|--------|\n"
            
            for c in sorted(clusters, key=lambda x: x.get("days_to_zero") or 999):
                d2z = c.get("days_to_zero")
                d2z_str = f"{d2z:.1f}" if d2z else "—"
                vel = c.get("avg_daily_sales")
                vel_str = f"{vel:.1f}" if vel else "—"
                deficit = c.get("deficit", 0)
                deficit_str = f"**{deficit}**" if deficit > 0 else "—"
                
                result += (
                    f"| {c['cluster_name'][:25]} "
                    f"| {c.get('fbo_stock', 0)} "
                    f"| {c.get('in_transit', 0)} "
                    f"| {vel_str} "
                    f"| {d2z_str} "
                    f"| {deficit_str} |\n"
                )
        else:
            result += "_Нет данных FBO по кластерам_\n"
        
        return result
```

### get_warehouse_stocks

```python
    async def get_warehouse_stocks(
        self,
        __user__: dict = {}
    ) -> str:
        """
        Остатки внутреннего склада (1С).
        
        :return: Таблица остатков + статус последнего импорта
        """
        async with httpx.AsyncClient() as client:
            stocks_resp = await client.get(
                f"{self.api_url}/logistic/imports/stocks",
                headers={"X-User-Id": __user__.get("id", "")}
            )
            status_resp = await client.get(
                f"{self.api_url}/logistic/imports/status",
                headers={"X-User-Id": __user__.get("id", "")}
            )
        
        stocks = stocks_resp.json()
        status = status_resp.json()
        
        result = "🏭 **Остатки внутреннего склада (1С)**\n\n"
        result += f"Последний импорт: {status.get('last_import', 'нет данных')}\n"
        result += f"Следующий: {status.get('next_scheduled', '—')}\n\n"
        
        if not stocks:
            return result + "_Нет данных_"
        
        result += "| Артикул | Название | Остаток |\n"
        result += "|---------|----------|--------|\n"
        
        for s in sorted(stocks, key=lambda x: x.get("warehouse_stock", 0))[:30]:
            result += (
                f"| {s['article']} "
                f"| {s.get('product_name', '')[:30]} "
                f"| {s['warehouse_stock']} шт |\n"
            )
        
        if len(stocks) > 30:
            result += f"\n_Показано 30 из {len(stocks)}_"
        
        return result
```

### get_supply_tasks

```python
    async def get_supply_tasks(
        self,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        __user__: dict = {}
    ) -> str:
        """
        Список наряд-заданий на отгрузку FBO.
        
        :param status: Фильтр: new, confirmed, collected, shipped, cancelled
        :param priority: Фильтр: urgent, planned, recommended
        :return: Таблица наряд-заданий
        """
        params = {}
        if status:
            params["status"] = status
        if priority:
            params["priority"] = priority
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.api_url}/logistic/supply-tasks",
                params=params,
                headers={"X-User-Id": __user__.get("id", "")}
            )
            tasks = response.json()
        
        if not tasks:
            return "📋 Нет наряд-заданий по заданным критериям."
        
        result = "📋 **Наряд-задания**\n\n"
        
        result += "| # | Артикул | Кластер | Кол-во | Приоритет | Статус |\n"
        result += "|---|---------|---------|--------|-----------|--------|\n"
        
        priority_icons = {
            "urgent": "🔴", "planned": "🟡", "recommended": "🟢"
        }
        status_icons = {
            "new": "📋", "confirmed": "✅",
            "collected": "📦", "shipped": "🚛", "cancelled": "❌"
        }
        
        for t in tasks[:20]:
            result += (
                f"| {t['task_number']} "
                f"| {t['article']} "
                f"| {t['cluster_name'][:20]} "
                f"| {t['quantity']} шт "
                f"| {priority_icons.get(t['priority'], '')} {t['priority']} "
                f"| {status_icons.get(t['status'], '')} {t['status']} |\n"
            )
        
        if len(tasks) > 20:
            result += f"\n_Показано 20 из {len(tasks)}_"
        
        result += "\n\n💡 Для изменения статуса: `update_task_status(task_id, action)`"
        result += "\n   Действия: `confirm`, `collected`, `shipped`, `cancel`"
        
        return result
```

### update_task_status

```python
    async def update_task_status(
        self,
        task_id: str,
        action: str,
        reason: Optional[str] = None,
        __user__: dict = {}
    ) -> str:
        """
        Обновить статус наряд-задания.
        
        :param task_id: UUID задания
        :param action: Действие: confirm, collected, shipped, cancel
        :param reason: Причина отмены (обязательно для cancel)
        :return: Результат операции
        """
        action_map = {
            "confirm": "confirm",
            "collected": "collected",
            "shipped": "shipped",
            "cancel": "cancel"
        }
        
        endpoint = action_map.get(action)
        if not endpoint:
            return f"❌ Неизвестное действие: {action}. Допустимо: confirm, collected, shipped, cancel"
        
        url = f"{self.api_url}/logistic/supply-tasks/{task_id}/{endpoint}"
        params = {}
        if action == "cancel" and reason:
            params["reason"] = reason
        
        async with httpx.AsyncClient() as client:
            response = await client.patch(
                url,
                params=params,
                headers={"X-User-Id": __user__.get("id", "")}
            )
        
        if response.status_code == 200:
            task = response.json()
            action_labels = {
                "confirm": "✅ Подтверждено",
                "collected": "📦 Товар собран",
                "shipped": "🚛 Отгружено",
                "cancel": "❌ Отменено"
            }
            result = f"{action_labels.get(action, '✅')} "
            result += f"Задание **{task.get('task_number', task_id)}**\n"
            result += f"- Артикул: {task.get('article')}\n"
            result += f"- Кластер: {task.get('cluster_name')}\n"
            result += f"- Количество: {task.get('quantity')} шт\n"
            result += f"- Статус: {task.get('status')}"
            return result
        else:
            error = response.json().get("detail", "Неизвестная ошибка")
            return f"❌ Ошибка: {error}"
```

### get_alerts

```python
    async def get_alerts(
        self,
        is_read: bool = False,
        severity: Optional[str] = None,
        __user__: dict = {}
    ) -> str:
        """
        Список алертов модуля Logistic.
        
        :param is_read: False — только непрочитанные
        :param severity: Фильтр: high, medium, low
        :return: Список алертов
        """
        params = {"is_read": is_read}
        if severity:
            params["severity"] = severity
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.api_url}/logistic/alerts",
                params=params,
                headers={"X-User-Id": __user__.get("id", "")}
            )
            data = response.json()
        
        items = data.get("items", [])
        if not items:
            return "✅ Нет активных алертов"
        
        result = "🔔 **Алерты Logistic**\n\n"
        
        severity_icons = {"high": "🔴", "medium": "🟡", "low": "🟢"}
        
        for alert in items[:15]:
            icon = severity_icons.get(alert["severity"], "")
            result += f"{icon} **{alert['alert_type']}**\n"
            result += f"   {alert['message']}\n"
            if alert.get("article"):
                result += f"   Артикул: {alert['article']}"
            if alert.get("cluster_name"):
                result += f" | Кластер: {alert['cluster_name']}"
            result += f"\n   _{alert['created_at']}_\n\n"
        
        if len(items) > 15:
            result += f"_Показано 15 из {len(items)}_"
        
        return result
```

---

## 7.4 Примеры диалогов

### Проверка остатков артикула

```
👤 Покажи остатки по артикулу 51005/54

🤖 📦 **Артикул: 51005/54**

🏭 **Внутренний склад (1С):** 340 шт

📊 **FBO (всего): 87 шт по 5 кластерам**

| Кластер | FBO | В пути | Продаж/день | Дней до 0 | Дефицит |
|---------|-----|--------|-------------|-----------|---------|
| Дальний Восток       | 3   | 0  | 2.1 | 1.4  | **32** |
| Юг                   | 8   | 0  | 3.5 | 2.3  | **51** |
| Поволжье             | 12  | 5  | 2.0 | 8.5  | —      |
| Москва, МО и Дальние | 45  | 10 | 5.2 | 10.6 | —      |
| Урал и Зап. Сибирь   | 19  | 0  | 1.8 | 10.6 | —      |

⚠️ Кластеры «Дальний Восток» и «Юг» требуют срочной поставки.
Сформировать наряд-задания?
```

### Работа с наряд-заданиями

```
👤 Покажи все urgent задания

🤖 📋 **Наряд-задания**

| # | Артикул | Кластер | Кол-во | Приоритет | Статус |
|---|---------|---------|--------|-----------|--------|
| LG-2026-02-06-001 | 51005/54 | Дальний Восток | 32 шт | 🔴 urgent | 📋 new |
| LG-2026-02-06-002 | 51005/54 | Юг | 51 шт | 🔴 urgent | 📋 new |
| LG-2026-02-06-003 | K2001/10 | Москва, МО | 28 шт | 🔴 urgent | ✅ confirmed |

👤 Подтверди задание LG-2026-02-06-001

🤖 ✅ Подтверждено задание **LG-2026-02-06-001**
- Артикул: 51005/54
- Кластер: Дальний Восток
- Количество: 32 шт
- Статус: confirmed
```

### Дашборд

```
👤 Покажи дашборд

🤖 📊 **Дашборд Logistic**

**Ozon FBO (кластеры):**
- Артикулов отслеживается: 2400
- 🔴 Urgent (< 3 дн.): 12
- 🟡 Soon (< 7 дн.): 45
- 🚫 Out of stock: 3
- ✅ Enough: 2340

**Внутренний склад (1С):**
- Последний импорт: 2026-02-06 08:00
- Артикулов на складе: 2380

**Наряд-задания (сегодня):**
- Всего: 20
- 📋 Новых: 8
- ✅ Подтверждённых: 5
- 📦 Собранных: 3
- 🚛 Отгруженных: 4
- Urgent: 3

🔔 **Непрочитанных алертов: 5**
- 🔴 OUT_OF_STOCK: 51005/54 — Дальний Восток: 0 шт
- 🔴 URGENT_STOCK: K2001/10 — Москва: 1.2 дн до 0
- 🟡 WAREHOUSE_LOW: K3005/22 — недостаточно на складе
```

---

## 7.5 Маппинг Tools → API Endpoints

| Tool | HTTP Method | Endpoint | Раздел |
|------|-------------|----------|--------|
| `get_dashboard` | GET | `/stocks/summary` + `/supply-tasks/summary` + `/alerts` | 3, 4, — |
| `get_cluster_stocks` | GET | `/stocks/by-cluster/{name}` или `/stocks/urgent` | 3 |
| `get_article_details` | GET | `/stocks/by-article/{article}` + `/imports/stocks/{article}` | 3, 5 |
| `get_warehouse_stocks` | GET | `/imports/stocks` + `/imports/status` | 5 |
| `get_supply_tasks` | GET | `/supply-tasks/` | 4 |
| `update_task_status` | PATCH | `/supply-tasks/{id}/{action}` | 4 |
| `get_alerts` | GET | `/alerts` | — |

---

## 7.6 Регистрация в Open WebUI

### Pipeline

1. Admin → Pipelines → Add Pipeline
2. Upload `pipeline.py`
3. Настроить Valves:
   - `LOGISTIC_API_URL`: URL API-сервера
   - `ENABLE_ALERTS`: true
   - `ENABLE_SUPPLY_TASKS`: true
   - `DEFAULT_BRAND`: ohana_market

### Tools

1. Admin → Tools → Add Tool
2. Upload `tools.py`
3. Связать с Pipeline «Adolf Logistic»

---

## 7.7 Промпт для Claude Code

```
Реализуй Open WebUI интеграцию для Logistic v2.0 согласно
adolf_logistic_7_open_webui_v2_0.md

Требования:
1. Pipeline: системный промпт с контекстом Ozon FBO + 1С, 
   brand_id из user context, список 8 tools
2. Tools (8 штук):
   - get_dashboard: сводка FBO + 1С + задания + алерты
   - get_cluster_stocks: остатки по кластерам с фильтрами
   - get_article_details: FBO по кластерам + 1С для артикула
   - get_warehouse_stocks: остатки 1С + статус импорта
   - get_supply_tasks: список наряд-заданий с фильтрами
   - update_task_status: confirm/collected/shipped/cancel
   - get_alerts: непрочитанные алерты с фильтрами
   - get_urgent_stocks: все SKU с days_to_zero < 7
3. Формат вывода: markdown таблицы + emoji статусы
4. Endpoints из разделов 3 (stocks), 4 (supply-tasks), 5 (imports)

Зависимости: httpx, pydantic
Файлы: pipeline.py, tools.py
```

---

## 7.8 Связанные документы

| Документ | Описание |
|----------|----------|
| [3. Stock Monitor](adolf_logistic_3_stock_monitor_v2_0.md) | API остатков FBO |
| [4. Supply Task Engine](adolf_logistic_4_supply_task_engine_v2_0.md) | API наряд-заданий |
| [5. 1С Integration](adolf_logistic_5_1c_integration_v2_0.md) | API импорта 1С |
| [Core: Open WebUI](../core/adolf_core_1_1_open_webui_overview_v4_1.md) | Базовая документация |
| [Core: Pipelines](../core/adolf_core_1_2_open_webui_pipelines_v4_1.md) | Pipelines |
| [Core: Tools](../core/adolf_core_1_3_open_webui_tools_v4_1.md) | Tools |

---

**Документ подготовлен:** Февраль 2026  
**Версия:** 2.0  
**Статус:** Черновик  
**Заменяет:** adolf_logistic_7_open_webui_v1_0.md

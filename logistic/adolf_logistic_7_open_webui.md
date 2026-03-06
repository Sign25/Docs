# ADOLF LOGISTIC — Раздел 7: Open WebUI Integration

**Модуль:** Logistic  
**Компонент:** Open WebUI Integration  
**Версия:** 1.0  
**Дата:** Январь 2026

---

## 7.1 Назначение

> **Примечание (Март 2026):** Ниже описана архитектура интеграции через chat-агента. Фактическая реализация использует **standalone-страницу** `/logistic`. Структура страницы:
>
> | Вкладка | Описание |
> |---------|----------|
> | Главная | Общая сводка |
> | Наряд-задания | Управление заданиями |
> | Остатки FBO | Остатки на складах FBO |
> | Межкластерная | Межкластерные перемещения |
> | Кластеры | Управление кластерами |
> | Склад 1С | Интеграция со складом 1С |
> | Алерты | Уведомления |
>
> Документация агента ниже сохранена как спецификация backend API.

Интеграция модуля Logistic с Open WebUI обеспечивает:

- Диалоговый интерфейс для работы с остатками и рекомендациями
- Pipeline для обработки запросов пользователей
- Tools для выполнения операций модуля

---

## 7.2 Pipeline

### Конфигурация

```python
# open_webui/pipeline.py
"""
title: Adolf Logistic Pipeline
author: ADOLF Team
version: 1.0
description: Pipeline для управления логистикой WB
"""

from typing import Optional, List
from pydantic import BaseModel

class Pipeline:
    class Valves(BaseModel):
        LOGISTIC_API_URL: str = "http://localhost:8000"
        ENABLE_ALERTS: bool = True
        ENABLE_RECOMMENDATIONS: bool = True
        DEFAULT_BRAND: str = "ohana_market"
    
    def __init__(self):
        self.name = "Adolf Logistic"
        self.valves = self.Valves()
    
    async def on_startup(self):
        """Инициализация при запуске"""
        pass
    
    async def on_shutdown(self):
        """Очистка при остановке"""
        pass
    
    def pipe(
        self,
        user_message: str,
        model_id: str,
        messages: List[dict],
        body: dict
    ) -> str:
        """
        Основной метод обработки сообщений
        """
        # Prompt injection с контекстом Logistic
        system_prompt = self._build_system_prompt(body)
        
        # Добавляем системный промпт
        if messages and messages[0].get("role") != "system":
            messages.insert(0, {
                "role": "system",
                "content": system_prompt
            })
        
        return body
    
    def _build_system_prompt(self, body: dict) -> str:
        """Формирование системного промпта"""
        user = body.get("user", {})
        brand_id = user.get("brand_id", self.valves.DEFAULT_BRAND)
        
        return f"""Ты — AI-ассистент модуля Logistic системы ADOLF.

## Твои возможности:
1. Показывать остатки товаров на складах WB
2. Анализировать кросс-докинг и рассчитывать убытки
3. Формировать рекомендации по распределению поставок
4. Показывать и управлять алертами

## Контекст пользователя:
- Бренд: {brand_id}
- Роль: {user.get('role', 'manager')}

## Доступные Tools:
- get_stocks - получить остатки
- get_stock_by_article - остатки по артикулу
- get_cross_docking_report - отчёт по кросс-докингу
- get_alerts - список алертов
- generate_recommendation - рекомендация по поставке
- get_dashboard - сводный дашборд

## Правила:
- Всегда используй Tools для получения данных
- Форматируй ответы с таблицами и эмодзи
- При критических остатках предупреждай пользователя
- Предлагай рекомендации при обнаружении проблем
"""
```

---

## 7.3 Tools

### get_stocks

```python
# open_webui/tools.py
"""
title: Logistic Tools
author: ADOLF Team
version: 1.0
"""

import httpx
from typing import Optional

class Tools:
    def __init__(self):
        self.api_url = "http://localhost:8000"
    
    async def get_stocks(
        self,
        warehouse: Optional[str] = None,
        article: Optional[str] = None,
        below_threshold: bool = False,
        __user__: dict = {}
    ) -> str:
        """
        Получить текущие остатки на складах WB.
        
        :param warehouse: Фильтр по складу (опционально)
        :param article: Фильтр по артикулу (опционально)
        :param below_threshold: Только товары ниже порога
        :return: Таблица остатков
        """
        params = {"below_threshold": below_threshold}
        if warehouse:
            params["warehouse"] = warehouse
        if article:
            params["article"] = article
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.api_url}/logistic/stocks",
                params=params,
                headers={"X-User-Id": __user__.get("id", "")}
            )
            data = response.json()
        
        # Форматирование ответа
        if not data.get("items"):
            return "Остатки не найдены по заданным критериям."
        
        result = "📦 **Остатки на складах WB**\n\n"
        result += "| Склад | Артикул | Размер | Остаток | Статус |\n"
        result += "|-------|---------|--------|---------|--------|\n"
        
        for item in data["items"][:20]:
            status = {
                "normal": "✅",
                "warning": "⚠️",
                "low": "🟡",
                "critical": "🔴"
            }.get(item["threshold_status"], "")
            
            result += (
                f"| {item['warehouse_name']} "
                f"| {item['supplier_article']} "
                f"| {item.get('size', '-')} "
                f"| {item['quantity']} шт "
                f"| {status} |\n"
            )
        
        if data["total"] > 20:
            result += f"\n_Показано 20 из {data['total']}_"
        
        return result
```

### get_stock_by_article

```python
    async def get_stock_by_article(
        self,
        article: str,
        __user__: dict = {}
    ) -> str:
        """
        Получить остатки конкретного артикула на всех складах.
        
        :param article: Артикул товара
        :return: Распределение по складам
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.api_url}/logistic/stocks/{article}",
                headers={"X-User-Id": __user__.get("id", "")}
            )
            data = response.json()
        
        result = f"📦 **Остатки {article}**\n\n"
        result += f"Всего: **{data['total_quantity']} шт**\n\n"
        
        result += "| Склад | Остаток | Статус |\n"
        result += "|-------|---------|--------|\n"
        
        for wh in data["warehouses"]:
            status = {"normal": "✅", "low": "🟡", "critical": "🔴"}.get(
                wh["status"], ""
            )
            result += f"| {wh['warehouse_name']} | {wh['quantity']} шт | {status} |\n"
        
        if data.get("alerts"):
            result += "\n⚠️ **Алерты:**\n"
            for alert in data["alerts"]:
                result += f"- {alert['warehouse']}: {alert['message']}\n"
        
        return result
```

### get_cross_docking_report

```python
    async def get_cross_docking_report(
        self,
        period: str = "month",
        __user__: dict = {}
    ) -> str:
        """
        Получить отчёт по кросс-докингу.
        
        :param period: Период: week, month, quarter
        :return: Отчёт с анализом убытков
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.api_url}/logistic/orders/cross-docking",
                params={"period": period},
                headers={"X-User-Id": __user__.get("id", "")}
            )
            data = response.json()
        
        result = f"📊 **Отчёт по кросс-докингу**\n\n"
        result += f"Период: {data['period_label']}\n\n"
        
        result += f"- Всего заказов: **{data['total_orders']}**\n"
        result += f"- Кросс-докинг: **{data['cross_docking_count']}** "
        result += f"({data['cross_docking_rate']:.1f}%)\n"
        result += f"- Доп. издержки: **{data['extra_costs']:,.0f} ₽**\n\n"
        
        if data.get("top_sku"):
            result += "**Топ проблемных SKU:**\n\n"
            result += "| Артикул | Случаев | Убыток |\n"
            result += "|---------|---------|--------|\n"
            for sku in data["top_sku"][:5]:
                result += (
                    f"| {sku['article']} "
                    f"| {sku['count']} "
                    f"| {sku['loss']:,.0f} ₽ |\n"
                )
        
        return result
```

### generate_recommendation

```python
    async def generate_recommendation(
        self,
        article: str,
        quantity: int,
        __user__: dict = {}
    ) -> str:
        """
        Сгенерировать рекомендацию по распределению поставки.
        
        :param article: Артикул товара
        :param quantity: Общее количество для поставки
        :return: Рекомендация по складам
        """
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.api_url}/logistic/recommendations",
                json={"article": article, "quantity": quantity},
                headers={"X-User-Id": __user__.get("id", "")}
            )
            data = response.json()
        
        result = f"📦 **Рекомендация по поставке {article}**\n\n"
        result += f"Общий объём: **{quantity} шт**\n\n"
        
        result += "| Склад | Количество | % | Коэф. приёмки |\n"
        result += "|-------|------------|---|---------------|\n"
        
        for alloc in data["allocations"]:
            coef = alloc["acceptance_coefficient"]
            coef_str = "бесплатно" if coef == 0 else f"{coef}x"
            result += (
                f"| {alloc['warehouse_name']} "
                f"| {alloc['quantity']} шт "
                f"| {alloc['percentage']:.0f}% "
                f"| {coef_str} |\n"
            )
        
        result += f"\n📈 Прогноз кросс-докинга: "
        result += f"**{data['predicted_cross_docking_rate']:.1f}%**\n"
        
        return result
```

### get_alerts

```python
    async def get_alerts(
        self,
        status: str = "active",
        __user__: dict = {}
    ) -> str:
        """
        Получить список алертов.
        
        :param status: Статус: active, acknowledged, all
        :return: Список алертов
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.api_url}/logistic/alerts",
                params={"status": status},
                headers={"X-User-Id": __user__.get("id", "")}
            )
            data = response.json()
        
        if not data.get("items"):
            return "✅ Нет активных алертов"
        
        result = "🔔 **Алерты Logistic**\n\n"
        
        for alert in data["items"]:
            emoji = {"high": "🔴", "medium": "🟡", "low": "🟢"}.get(
                alert["priority"], ""
            )
            result += f"{emoji} **{alert['title']}**\n"
            result += f"   {alert['message']}\n"
            result += f"   _{alert['created_at']}_\n\n"
        
        return result
```

### get_dashboard

```python
    async def get_dashboard(
        self,
        __user__: dict = {}
    ) -> str:
        """
        Получить сводный дашборд логистики.
        
        :return: Ключевые метрики
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.api_url}/logistic/dashboard",
                headers={"X-User-Id": __user__.get("id", "")}
            )
            data = response.json()
        
        result = "📊 **Дашборд Logistic**\n\n"
        
        # Остатки
        result += "**Остатки:**\n"
        stocks = data["stocks"]
        result += f"- Всего SKU: {stocks['total_sku']}\n"
        result += f"- 🔴 Критических: {stocks['critical']}\n"
        result += f"- 🟡 Низких: {stocks['low']}\n"
        result += f"- ✅ В норме: {stocks['normal']}\n\n"
        
        # Кросс-докинг
        result += "**Кросс-докинг (месяц):**\n"
        cd = data["cross_docking"]
        result += f"- Случаев: {cd['count']} ({cd['rate']:.1f}%)\n"
        result += f"- Доп. издержки: {cd['extra_costs']:,.0f} ₽\n\n"
        
        # Алерты
        result += f"**Активных алертов:** {data['alerts_count']}\n"
        
        return result
```

---

## 7.4 Примеры диалогов

### Проверка остатков

```
👤 Покажи остатки по артикулу OM-12345

🤖 📦 **Остатки OM-12345**

Всего: **120 шт**

| Склад | Остаток | Статус |
|-------|---------|--------|
| Коледино | 45 шт | ✅ |
| Краснодар | 12 шт | 🟡 |
| Казань | 0 шт | 🔴 |
| Новосибирск | 63 шт | ✅ |

⚠️ **Алерты:**
- Казань: Критический остаток (0 шт)

💡 Рекомендую пополнить Казань и Краснодар. 
Хотите сформировать рекомендацию по поставке?
```

### Генерация рекомендации

```
👤 Сформируй рекомендацию для поставки 500 шт OM-12345

🤖 📦 **Рекомендация по поставке OM-12345**

Общий объём: **500 шт**

| Склад | Количество | % | Коэф. приёмки |
|-------|------------|---|---------------|
| Коледино | 200 шт | 40% | бесплатно |
| Краснодар | 120 шт | 24% | 1.5x |
| Казань | 100 шт | 20% | бесплатно |
| Новосибирск | 80 шт | 16% | 2x |

📈 Прогноз кросс-докинга: **< 2%**

⚠️ Обратите внимание:
- Краснодар и Новосибирск имеют повышенные коэффициенты приёмки
- Возможно стоит увеличить долю Коледино и Казани
```

---

## 7.5 Регистрация в Open WebUI

### Pipeline

1. Перейти в Admin → Pipelines
2. Add Pipeline → Upload `pipeline.py`
3. Настроить Valves:
   - LOGISTIC_API_URL: URL API
   - ENABLE_ALERTS: true

### Tools

1. Перейти в Admin → Tools
2. Add Tool → Upload `tools.py`
3. Связать с Pipeline

---

## 7.6 Связанные документы

| Документ | Описание |
|----------|----------|
| [1. Architecture](adolf_logistic_1_architecture_v1_0.md) | Архитектура |
| [Core: Open WebUI](../core/adolf_core_1_1_open_webui_overview_v4_1.md) | Базовая документация |
| [Core: Pipelines](../core/adolf_core_1_2_open_webui_pipelines_v4_1.md) | Pipelines |
| [Core: Tools](../core/adolf_core_1_3_open_webui_tools_v4_1.md) | Tools |

---

**Версия:** 1.0  
**Дата:** Январь 2026  
**Статус:** Готов

# ADOLF CFO — Раздел 4: Open WebUI

**Проект:** Финансовый учёт и управленческая аналитика  
**Модуль:** CFO  
**Версия:** 1.0  
**Дата:** Январь 2026

---

## 4.1 Назначение

Раздел описывает интеграцию модуля CFO с Open WebUI: Pipeline, Tools, интерактивные кнопки и пользовательский интерфейс.

### Компоненты интеграции

| Компонент | Описание |
|-----------|----------|
| Pipeline | `@Adolf_CFO` — агент финансовой аналитики |
| Tools | Function Calling для финансовых операций |
| Buttons | Интерактивные кнопки быстрых действий |
| Formatters | Форматирование отчётов в markdown |

---

## 4.2 Pipeline Configuration

### 4.2.1 Регистрация Pipeline

```python
from typing import List
from pydantic import BaseModel

class CFOPipeline:
    """Pipeline финансовой аналитики."""
    
    class Valves(BaseModel):
        CLAUDE_API_KEY: str = ""
        DEFAULT_PERIOD_DAYS: int = 7
        MARGIN_THRESHOLD: float = 10.0
        ENABLE_AI_INSIGHTS: bool = True
    
    def __init__(self):
        self.name = "Adolf_CFO"
        self.description = "Финансовая аналитика: P&L, ABC-анализ, AI-инсайты"
        self.valves = self.Valves()
    
    async def inlet(self, body: dict, user: dict) -> dict:
        """Обработка входящего запроса."""
        
        if user.get("role") not in ["senior", "director", "admin"]:
            raise PermissionError("Доступ к CFO только для Senior, Director и Admin")
        
        body["__user__"] = {
            "id": user.get("id"),
            "role": user.get("role"),
            "brand_id": user.get("brand_id")
        }
        
        return body
    
    async def outlet(self, body: dict, user: dict) -> dict:
        """Обработка исходящего ответа."""
        
        if "buttons" not in body:
            body["buttons"] = self._get_default_buttons(user.get("role"))
        
        return body
    
    def _get_default_buttons(self, role: str) -> List[dict]:
        """Кнопки по умолчанию."""
        
        buttons = [
            {"label": "📊 P&L по категориям", "action": "pnl_by_category"},
            {"label": "🏷️ P&L по брендам", "action": "pnl_by_brand"},
            {"label": "🛒 P&L по МП", "action": "pnl_by_marketplace"},
            {"label": "🔤 ABC-анализ", "action": "abc_analysis"},
            {"label": "🔴 Убыточные SKU", "action": "show_loss_makers"},
        ]
        
        if role in ["director", "admin"]:
            buttons.extend([
                {"label": "📈 P&L по SKU", "action": "pnl_by_sku"},
                {"label": "🤖 AI-инсайты", "action": "ai_insights"},
                {"label": "📝 Кастомный отчёт", "action": "custom_report"},
            ])
        
        buttons.extend([
            {"label": "📥 Экспорт Excel", "action": "export_excel"},
            {"label": "📄 Экспорт PDF", "action": "export_pdf"},
        ])
        
        return buttons
```

### 4.2.2 Системный промпт Pipeline

```python
CFO_SYSTEM_PROMPT = """
Ты финансовый ассистент системы ADOLF для компании ОХАНА МАРКЕТ.

Твои возможности:
1. Формирование P&L отчётов (SKU, категории, бренды, маркетплейсы)
2. ABC-анализ товарного портфеля
3. Выявление убыточных позиций
4. AI-инсайты и рекомендации
5. Кастомные отчёты по запросу

Маркетплейсы: Wildberries (wb), Ozon (ozon), Яндекс.Маркет (ym)
Бренды: Охана Маркет (ohana_market), Охана Кидс (ohana_kids)

Правила:
1. Всегда указывай период данных
2. Числа с разделителями тысяч (1 234 567 ₽)
3. Проценты до 1 знака (15.3%)
4. Для убыточных позиций предлагай рекомендации

Текущий пользователь:
- Роль: {user_role}
- Бренд: {user_brand}

{role_restrictions}
"""

ROLE_RESTRICTIONS = {
    "senior": """
Ограничения Senior:
- P&L по SKU недоступен
- Консолидированный P&L недоступен
- Себестоимость по SKU недоступна
- Кастомные отчёты недоступны
""",
    "director": "Роль Director: полный доступ.",
    "admin": "Роль Administrator: полный доступ + настройки."
}
```

---

## 4.3 Tools (Function Calling)

### 4.3.1 Реестр Tools

| Tool | Описание | Доступ |
|------|----------|--------|
| `cfo_pnl_by_sku` | P&L по артикулам | Director+ |
| `cfo_pnl_by_category` | P&L по категориям | Senior+ |
| `cfo_pnl_by_brand` | P&L по брендам | Senior+ |
| `cfo_pnl_by_marketplace` | P&L по маркетплейсам | Senior+ |
| `cfo_pnl_consolidated` | Консолидированный P&L | Director+ |
| `cfo_abc_analysis` | ABC-анализ | Senior+ |
| `cfo_loss_makers` | Убыточные SKU | Senior+ |
| `cfo_ai_insights` | AI-инсайты | Senior+ |
| `cfo_custom_report` | Кастомный отчёт | Director+ |
| `cfo_export` | Экспорт отчёта | Senior+ |

### 4.3.2 Описание Tools для LLM

```json
{
  "tools": [
    {
      "name": "cfo_pnl_by_sku",
      "description": "P&L по артикулам. Выручка, расходы, прибыль для каждого товара. Только Director+.",
      "parameters": {
        "type": "object",
        "properties": {
          "period": {
            "type": "string",
            "description": "week, month, quarter или YYYY-MM-DD:YYYY-MM-DD",
            "default": "week"
          },
          "marketplace": {
            "type": "string",
            "enum": ["all", "wb", "ozon", "ym"],
            "default": "all"
          },
          "brand_id": {
            "type": "string",
            "enum": ["all", "ohana_market", "ohana_kids"],
            "default": "all"
          },
          "category": {
            "type": "string",
            "description": "Фильтр по категории"
          },
          "limit": {
            "type": "integer",
            "default": 20
          },
          "sort_by": {
            "type": "string",
            "enum": ["revenue", "profit", "margin", "quantity"],
            "default": "profit"
          }
        }
      }
    },
    {
      "name": "cfo_pnl_by_category",
      "description": "P&L по категориям товаров.",
      "parameters": {
        "type": "object",
        "properties": {
          "period": {"type": "string", "default": "week"},
          "marketplace": {"type": "string", "enum": ["all", "wb", "ozon", "ym"], "default": "all"},
          "brand_id": {"type": "string", "enum": ["all", "ohana_market", "ohana_kids"], "default": "all"}
        }
      }
    },
    {
      "name": "cfo_pnl_by_brand",
      "description": "P&L по брендам. Сравнение Охана Маркет и Охана Кидс.",
      "parameters": {
        "type": "object",
        "properties": {
          "period": {"type": "string", "default": "week"},
          "marketplace": {"type": "string", "enum": ["all", "wb", "ozon", "ym"], "default": "all"}
        }
      }
    },
    {
      "name": "cfo_pnl_by_marketplace",
      "description": "P&L по маркетплейсам. Сравнение WB, Ozon, YM.",
      "parameters": {
        "type": "object",
        "properties": {
          "period": {"type": "string", "default": "week"},
          "brand_id": {"type": "string", "enum": ["all", "ohana_market", "ohana_kids"], "default": "all"}
        }
      }
    },
    {
      "name": "cfo_abc_analysis",
      "description": "ABC-анализ: A (80%), B (15%), C (5%), D (убыточные).",
      "parameters": {
        "type": "object",
        "properties": {
          "period": {"type": "string", "default": "month"},
          "marketplace": {"type": "string", "enum": ["all", "wb", "ozon", "ym"], "default": "all"},
          "brand_id": {"type": "string", "enum": ["all", "ohana_market", "ohana_kids"], "default": "all"},
          "show_class": {"type": "string", "enum": ["all", "A", "B", "C", "D"], "default": "all"}
        }
      }
    },
    {
      "name": "cfo_loss_makers",
      "description": "Убыточные SKU с рекомендациями.",
      "parameters": {
        "type": "object",
        "properties": {
          "period": {"type": "string", "default": "week"},
          "marketplace": {"type": "string", "enum": ["all", "wb", "ozon", "ym"], "default": "all"},
          "limit": {"type": "integer", "default": 20}
        }
      }
    },
    {
      "name": "cfo_ai_insights",
      "description": "AI-инсайты: анализ проблем, рекомендации.",
      "parameters": {
        "type": "object",
        "properties": {
          "period": {"type": "string", "default": "week"},
          "focus": {"type": "string", "enum": ["summary", "problems", "recommendations", "trends"], "default": "summary"}
        }
      }
    },
    {
      "name": "cfo_custom_report",
      "description": "Кастомный отчёт по запросу. Только Director+.",
      "parameters": {
        "type": "object",
        "properties": {
          "query": {"type": "string", "description": "Запрос пользователя"},
          "period": {"type": "string", "default": "month"}
        },
        "required": ["query"]
      }
    },
    {
      "name": "cfo_export",
      "description": "Экспорт в Excel или PDF.",
      "parameters": {
        "type": "object",
        "properties": {
          "report_type": {"type": "string", "enum": ["pnl_sku", "pnl_category", "pnl_brand", "pnl_marketplace", "abc"]},
          "format": {"type": "string", "enum": ["excel", "pdf"], "default": "excel"},
          "period": {"type": "string", "default": "week"}
        },
        "required": ["report_type"]
      }
    }
  ]
}
```

### 4.3.3 Реализация Tools

```python
from datetime import date, timedelta
from typing import Optional, List

class CFOTools:
    """Реализация Tools для CFO."""
    
    def __init__(self, pnl_service, abc_service, insight_service, export_service):
        self.pnl = pnl_service
        self.abc = abc_service
        self.insights = insight_service
        self.export = export_service
    
    async def cfo_pnl_by_sku(
        self,
        user: dict,
        period: str = "week",
        marketplace: str = "all",
        brand_id: str = "all",
        category: str = None,
        limit: int = 20,
        sort_by: str = "profit"
    ) -> dict:
        """P&L по SKU."""
        
        if user["role"] not in ["director", "admin"]:
            return {"error": True, "message": "P&L по SKU доступен только для Director и Admin"}
        
        date_from, date_to = self._parse_period(period)
        
        results = await self.pnl.get_pnl_by_sku(
            date_from=date_from,
            date_to=date_to,
            marketplace=marketplace if marketplace != "all" else None,
            brand_id=brand_id if brand_id != "all" else None,
            category=category,
            limit=limit,
            sort_by=sort_by
        )
        
        return {
            "report_type": "pnl_by_sku",
            "period": {"from": date_from.isoformat(), "to": date_to.isoformat()},
            "filters": {"marketplace": marketplace, "brand_id": brand_id, "category": category},
            "data": [r.to_dict() for r in results],
            "summary": self._calculate_summary(results)
        }
    
    async def cfo_pnl_by_category(
        self,
        user: dict,
        period: str = "week",
        marketplace: str = "all",
        brand_id: str = "all"
    ) -> dict:
        """P&L по категориям."""
        
        date_from, date_to = self._parse_period(period)
        
        results = await self.pnl.get_pnl_by_category(
            date_from=date_from,
            date_to=date_to,
            marketplace=marketplace if marketplace != "all" else None,
            brand_id=brand_id if brand_id != "all" else None
        )
        
        return {
            "report_type": "pnl_by_category",
            "period": {"from": date_from.isoformat(), "to": date_to.isoformat()},
            "data": results,
            "summary": self._calculate_summary_from_dict(results)
        }
    
    async def cfo_pnl_by_brand(
        self,
        user: dict,
        period: str = "week",
        marketplace: str = "all"
    ) -> dict:
        """P&L по брендам."""
        
        date_from, date_to = self._parse_period(period)
        
        results = await self.pnl.get_pnl_by_brand(
            date_from=date_from,
            date_to=date_to,
            marketplace=marketplace if marketplace != "all" else None
        )
        
        return {
            "report_type": "pnl_by_brand",
            "period": {"from": date_from.isoformat(), "to": date_to.isoformat()},
            "data": results
        }
    
    async def cfo_pnl_by_marketplace(
        self,
        user: dict,
        period: str = "week",
        brand_id: str = "all"
    ) -> dict:
        """P&L по маркетплейсам."""
        
        date_from, date_to = self._parse_period(period)
        
        results = await self.pnl.get_pnl_by_marketplace(
            date_from=date_from,
            date_to=date_to,
            brand_id=brand_id if brand_id != "all" else None
        )
        
        return {
            "report_type": "pnl_by_marketplace",
            "period": {"from": date_from.isoformat(), "to": date_to.isoformat()},
            "data": results
        }
    
    async def cfo_abc_analysis(
        self,
        user: dict,
        period: str = "month",
        marketplace: str = "all",
        brand_id: str = "all",
        show_class: str = "all"
    ) -> dict:
        """ABC-анализ."""
        
        date_from, date_to = self._parse_period(period)
        
        results, summary = await self.abc.analyze(
            date_from=date_from,
            date_to=date_to,
            marketplace=marketplace if marketplace != "all" else None,
            brand_id=brand_id if brand_id != "all" else None
        )
        
        if show_class != "all":
            results = [r for r in results if r.abc_class == show_class]
        
        return {
            "report_type": "abc_analysis",
            "period": {"from": date_from.isoformat(), "to": date_to.isoformat()},
            "summary": summary.to_dict(),
            "data": [r.to_dict() for r in results]
        }
    
    async def cfo_loss_makers(
        self,
        user: dict,
        period: str = "week",
        marketplace: str = "all",
        limit: int = 20
    ) -> dict:
        """Убыточные SKU."""
        
        date_from, date_to = self._parse_period(period)
        
        results = await self.pnl.get_loss_makers(
            date_from=date_from,
            date_to=date_to,
            marketplace=marketplace if marketplace != "all" else None,
            limit=limit
        )
        
        for r in results:
            r["recommendation"] = self._generate_recommendation(r)
        
        return {
            "report_type": "loss_makers",
            "period": {"from": date_from.isoformat(), "to": date_to.isoformat()},
            "total_count": len(results),
            "total_loss": sum(r["net_profit"] for r in results),
            "data": results
        }
    
    async def cfo_ai_insights(
        self,
        user: dict,
        period: str = "week",
        focus: str = "summary"
    ) -> dict:
        """AI-инсайты."""
        
        date_from, date_to = self._parse_period(period)
        
        pnl_data = await self.pnl.get_summary(date_from, date_to)
        abc_data = await self.abc.get_summary(date_from, date_to)
        anomalies = await self.pnl.get_anomalies(date_from, date_to)
        
        insights = await self.insights.generate(
            pnl_summary=pnl_data,
            abc_summary=abc_data,
            anomalies=anomalies,
            focus=focus
        )
        
        return {
            "report_type": "ai_insights",
            "period": {"from": date_from.isoformat(), "to": date_to.isoformat()},
            "focus": focus,
            "insights": insights
        }
    
    async def cfo_custom_report(
        self,
        user: dict,
        query: str,
        period: str = "month"
    ) -> dict:
        """Кастомный отчёт."""
        
        if user["role"] not in ["director", "admin"]:
            return {"error": True, "message": "Кастомные отчёты только для Director и Admin"}
        
        date_from, date_to = self._parse_period(period)
        
        context = {
            "pnl_by_sku": await self.pnl.get_pnl_by_sku(date_from, date_to, limit=50),
            "pnl_by_category": await self.pnl.get_pnl_by_category(date_from, date_to),
            "abc_results": await self.abc.get_results(date_from, date_to)
        }
        
        report = await self.insights.generate_custom_report(query, context)
        
        return {
            "report_type": "custom",
            "query": query,
            "period": {"from": date_from.isoformat(), "to": date_to.isoformat()},
            "report": report
        }
    
    async def cfo_export(
        self,
        user: dict,
        report_type: str,
        format: str = "excel",
        period: str = "week"
    ) -> dict:
        """Экспорт отчёта."""
        
        date_from, date_to = self._parse_period(period)
        
        if report_type == "pnl_sku":
            if user["role"] not in ["director", "admin"]:
                return {"error": True, "message": "Нет доступа"}
            data = await self.pnl.get_pnl_by_sku(date_from, date_to)
        elif report_type == "pnl_category":
            data = await self.pnl.get_pnl_by_category(date_from, date_to)
        elif report_type == "abc":
            data, _ = await self.abc.analyze(date_from, date_to)
        else:
            return {"error": True, "message": f"Неизвестный тип: {report_type}"}
        
        if format == "excel":
            file_path = await self.export.to_excel(data, report_type)
        else:
            file_path = await self.export.to_pdf(data, report_type)
        
        return {"success": True, "file_path": file_path, "format": format}
    
    def _parse_period(self, period: str) -> tuple:
        """Парсинг периода."""
        
        today = date.today()
        
        if period == "week":
            return today - timedelta(days=7), today - timedelta(days=1)
        elif period == "month":
            return today - timedelta(days=30), today - timedelta(days=1)
        elif period == "quarter":
            return today - timedelta(days=90), today - timedelta(days=1)
        elif ":" in period:
            parts = period.split(":")
            return date.fromisoformat(parts[0]), date.fromisoformat(parts[1])
        else:
            return today - timedelta(days=7), today - timedelta(days=1)
    
    def _generate_recommendation(self, loss_maker: dict) -> str:
        """Рекомендация для убыточного SKU."""
        
        margin = loss_maker.get("net_margin_pct", 0)
        revenue = loss_maker.get("revenue", 1)
        logistics = loss_maker.get("logistics", 0)
        logistics_pct = logistics / revenue * 100 if revenue > 0 else 0
        
        if logistics_pct > 15:
            return "Высокая логистика. Перевод на FBO или пересмотр габаритов."
        elif margin > -10:
            return "Небольшой убыток. Повышение цены на 5-10%."
        else:
            return "Значительный убыток. Вывод из ассортимента."
    
    def _calculate_summary(self, results: List) -> dict:
        """Расчёт сводки."""
        
        return {
            "total_revenue": sum(r.net_revenue for r in results),
            "total_profit": sum(r.net_profit for r in results),
            "avg_margin": sum(r.net_margin_pct for r in results) / len(results) if results else 0,
            "sku_count": len(results)
        }
```

---

## 4.4 Интерактивные кнопки

### 4.4.1 Конфигурация кнопок

```python
CFO_BUTTONS = {
    "pnl_by_category": {
        "label": "📊 P&L по категориям",
        "tool": "cfo_pnl_by_category",
        "params": {"period": "week"},
        "access": ["senior", "director", "admin"]
    },
    "pnl_by_brand": {
        "label": "🏷️ P&L по брендам",
        "tool": "cfo_pnl_by_brand",
        "params": {"period": "week"},
        "access": ["senior", "director", "admin"]
    },
    "pnl_by_marketplace": {
        "label": "🛒 P&L по МП",
        "tool": "cfo_pnl_by_marketplace",
        "params": {"period": "week"},
        "access": ["senior", "director", "admin"]
    },
    "pnl_by_sku": {
        "label": "📈 P&L по SKU",
        "tool": "cfo_pnl_by_sku",
        "params": {"period": "week", "limit": 20},
        "access": ["director", "admin"]
    },
    "abc_analysis": {
        "label": "🔤 ABC-анализ",
        "tool": "cfo_abc_analysis",
        "params": {"period": "month"},
        "access": ["senior", "director", "admin"]
    },
    "show_loss_makers": {
        "label": "🔴 Убыточные SKU",
        "tool": "cfo_loss_makers",
        "params": {"period": "week"},
        "access": ["senior", "director", "admin"]
    },
    "ai_insights": {
        "label": "🤖 AI-инсайты",
        "tool": "cfo_ai_insights",
        "params": {"period": "week", "focus": "summary"},
        "access": ["senior", "director", "admin"]
    },
    "custom_report": {
        "label": "📝 Кастомный отчёт",
        "action": "prompt",
        "prompt_template": "Сформируй отчёт: ",
        "access": ["director", "admin"]
    },
    "export_excel": {
        "label": "📥 Экспорт Excel",
        "tool": "cfo_export",
        "params": {"format": "excel"},
        "requires_context": True,
        "access": ["senior", "director", "admin"]
    },
    "export_pdf": {
        "label": "📄 Экспорт PDF",
        "tool": "cfo_export",
        "params": {"format": "pdf"},
        "requires_context": True,
        "access": ["senior", "director", "admin"]
    },
    "period_week": {
        "label": "📅 Неделя",
        "action": "set_param",
        "param": "period",
        "value": "week",
        "access": ["senior", "director", "admin"]
    },
    "period_month": {
        "label": "📅 Месяц",
        "action": "set_param",
        "param": "period",
        "value": "month",
        "access": ["senior", "director", "admin"]
    },
    "period_quarter": {
        "label": "📅 Квартал",
        "action": "set_param",
        "param": "period",
        "value": "quarter",
        "access": ["senior", "director", "admin"]
    }
}
```

### 4.4.2 Группировка кнопок по контексту

```python
BUTTON_GROUPS = {
    "main_menu": {
        "title": "Отчёты",
        "buttons": ["pnl_by_category", "pnl_by_brand", "pnl_by_marketplace", "pnl_by_sku"]
    },
    "analysis": {
        "title": "Анализ",
        "buttons": ["abc_analysis", "show_loss_makers", "ai_insights"]
    },
    "export": {
        "title": "Экспорт",
        "buttons": ["export_excel", "export_pdf"]
    },
    "period": {
        "title": "Период",
        "buttons": ["period_week", "period_month", "period_quarter"]
    }
}
```

---

## 4.5 Форматирование ответов

### 4.5.1 P&L Formatter

```python
class PnLFormatter:
    """Форматирование P&L в markdown."""
    
    def format_sku_table(self, data: List[dict]) -> str:
        """Таблица P&L по SKU."""
        
        lines = [
            "| SKU | Выручка | Расходы | Прибыль | Маржа |",
            "|-----|--------:|--------:|--------:|------:|"
        ]
        
        for item in data:
            lines.append(
                f"| {item['sku']} | "
                f"{item['net_revenue']:,.0f} ₽ | "
                f"{item['total_expenses']:,.0f} ₽ | "
                f"{item['net_profit']:,.0f} ₽ | "
                f"{item['net_margin_pct']:.1f}% |"
            )
        
        return "\n".join(lines)
    
    def format_category_table(self, data: dict) -> str:
        """Таблица P&L по категориям."""
        
        lines = [
            "| Категория | Выручка | Себест. | Расходы МП | Прибыль | Маржа |",
            "|-----------|--------:|--------:|-----------:|--------:|------:|"
        ]
        
        for category, values in data.items():
            lines.append(
                f"| {category} | "
                f"{values['revenue']:,.0f} ₽ | "
                f"{values['cogs']:,.0f} ₽ | "
                f"{values['mp_expenses']:,.0f} ₽ | "
                f"{values['profit']:,.0f} ₽ | "
                f"{values['margin']:.1f}% |"
            )
        
        return "\n".join(lines)
    
    def format_brand_table(self, data: dict) -> str:
        """Таблица P&L по брендам."""
        
        lines = [
            "| Бренд | Выручка | Прибыль | Маржа |",
            "|-------|--------:|--------:|------:|"
        ]
        
        for brand, values in data.items():
            lines.append(
                f"| {brand} | "
                f"{values['revenue']:,.0f} ₽ | "
                f"{values['profit']:,.0f} ₽ | "
                f"{values['margin']:.1f}% |"
            )
        
        return "\n".join(lines)
    
    def format_marketplace_table(self, data: dict) -> str:
        """Таблица P&L по маркетплейсам."""
        
        mp_names = {"wb": "Wildberries", "ozon": "Ozon", "ym": "Яндекс.Маркет"}
        
        lines = [
            "| Маркетплейс | Выручка | Комиссия | Логистика | Прибыль | Маржа |",
            "|-------------|--------:|---------:|----------:|--------:|------:|"
        ]
        
        for mp, values in data.items():
            lines.append(
                f"| {mp_names.get(mp, mp)} | "
                f"{values['revenue']:,.0f} ₽ | "
                f"{values['commission']:,.0f} ₽ | "
                f"{values['logistics']:,.0f} ₽ | "
                f"{values['profit']:,.0f} ₽ | "
                f"{values['margin']:.1f}% |"
            )
        
        return "\n".join(lines)
    
    def format_summary(self, summary: dict) -> str:
        """Форматирование сводки."""
        
        return f"""
**Сводка за период {summary['period_start']} — {summary['period_end']}**

| Показатель | Значение |
|------------|----------|
| Выручка | {summary['total_revenue']:,.0f} ₽ |
| Себестоимость | {summary['total_cogs']:,.0f} ₽ |
| Расходы МП | {summary['mp_expenses']:,.0f} ₽ |
| Чистая прибыль | {summary['net_profit']:,.0f} ₽ |
| Маржинальность | {summary['margin']:.1f}% |
"""
```

### 4.5.2 ABC Formatter

```python
class ABCFormatter:
    """Форматирование ABC-анализа."""
    
    def format_summary(self, summary: dict) -> str:
        """Сводка ABC-анализа."""
        
        return f"""
**ABC-анализ за период {summary['period_start']} — {summary['period_end']}**

| Класс | SKU | Прибыль | Доля |
|:-----:|----:|--------:|-----:|
| **A** | {summary['class_a_count']} | {summary['class_a_profit']:,.0f} ₽ | {summary['class_a_pct']:.1f}% |
| **B** | {summary['class_b_count']} | {summary['class_b_profit']:,.0f} ₽ | {summary['class_b_pct']:.1f}% |
| **C** | {summary['class_c_count']} | {summary['class_c_profit']:,.0f} ₽ | {summary['class_c_pct']:.1f}% |
| **D** | {summary['class_d_count']} | −{summary['class_d_loss']:,.0f} ₽ | убыток |

Всего SKU: {summary['total_skus']}
"""
    
    def format_class_table(self, data: List[dict], abc_class: str) -> str:
        """Таблица SKU класса."""
        
        lines = [
            f"**Класс {abc_class}**",
            "",
            "| # | SKU | Прибыль | Маржа | Накоп. % |",
            "|--:|-----|--------:|------:|---------:|"
        ]
        
        for item in data:
            lines.append(
                f"| {item['rank']} | {item['sku']} | "
                f"{item['net_profit']:,.0f} ₽ | "
                f"{item['net_margin_pct']:.1f}% | "
                f"{item['cumulative_pct']:.1f}% |"
            )
        
        return "\n".join(lines)


class LossMakersFormatter:
    """Форматирование убыточных SKU."""
    
    def format_table(self, data: List[dict]) -> str:
        """Таблица убыточных SKU."""
        
        lines = [
            "| SKU | Выручка | Убыток | Маржа | Рекомендация |",
            "|-----|--------:|-------:|------:|--------------|"
        ]
        
        for item in data:
            lines.append(
                f"| {item['sku']} | "
                f"{item['revenue']:,.0f} ₽ | "
                f"{abs(item['net_profit']):,.0f} ₽ | "
                f"{item['net_margin_pct']:.1f}% | "
                f"{item['recommendation']} |"
            )
        
        return "\n".join(lines)
    
    def format_summary(self, data: List[dict]) -> str:
        """Сводка по убыточным SKU."""
        
        total_loss = sum(item['net_profit'] for item in data)
        
        return f"""
**Убыточные SKU (класс D)**

Всего: {len(data)} SKU
Общий убыток: {abs(total_loss):,.0f} ₽
"""
```

---

## 4.6 Примеры диалогов

### 4.6.1 P&L по категориям (Senior)

```
Пользователь: Покажи P&L по категориям за неделю

@Adolf_CFO: **P&L по категориям за 08.01.2026 — 14.01.2026**

| Категория | Выручка | Себест. | Расходы МП | Прибыль | Маржа |
|-----------|--------:|--------:|-----------:|--------:|------:|
| Платья | 2 450 000 ₽ | 980 000 ₽ | 367 500 ₽ | 1 102 500 ₽ | 45.0% |
| Блузки | 1 230 000 ₽ | 492 000 ₽ | 184 500 ₽ | 553 500 ₽ | 45.0% |
| Брюки | 890 000 ₽ | 356 000 ₽ | 133 500 ₽ | 400 500 ₽ | 45.0% |

**Итого:** Выручка 4 570 000 ₽, Прибыль 2 056 500 ₽, Маржа 45.0%

[📊 P&L по SKU] [🔤 ABC-анализ] [🤖 AI-инсайты] [📥 Excel]
```

### 4.6.2 ABC-анализ (Director)

```
Пользователь: ABC-анализ за месяц

@Adolf_CFO: **ABC-анализ за 15.12.2025 — 14.01.2026**

| Класс | SKU | Прибыль | Доля |
|:-----:|----:|--------:|-----:|
| **A** | 47 | 7 200 000 ₽ | 80.0% |
| **B** | 89 | 1 350 000 ₽ | 15.0% |
| **C** | 156 | 450 000 ₽ | 5.0% |
| **D** | 23 | −180 000 ₽ | убыток |

Всего SKU: 315

⚠️ Обнаружено 23 убыточных SKU с общим убытком 180 000 ₽

[🔴 Показать убыточные] [📈 Топ-10 класса A] [🤖 AI-инсайты]
```

### 4.6.3 Убыточные SKU

```
Пользователь: Покажи убыточные SKU

@Adolf_CFO: **Убыточные SKU (класс D) за 08.01.2026 — 14.01.2026**

| SKU | Выручка | Убыток | Маржа | Рекомендация |
|-----|--------:|-------:|------:|--------------|
| OM-45678 | 45 000 ₽ | 12 500 ₽ | −27.8% | Высокая логистика. Перевод на FBO. |
| OK-12345 | 23 000 ₽ | 8 200 ₽ | −35.7% | Вывод из ассортимента |
| OM-78901 | 67 000 ₽ | 5 100 ₽ | −7.6% | Повышение цены на 10% |

Всего: 23 SKU, общий убыток: 180 000 ₽

[🤖 AI-рекомендации] [📥 Excel] [📄 PDF]
```

### 4.6.4 AI-инсайты

```
Пользователь: Дай AI-инсайты по финансам

@Adolf_CFO: **AI-инсайты за 08.01.2026 — 14.01.2026**

**Резюме**
Неделя показала стабильные результаты с общей маржинальностью 45%. 
Выручка составила 4.57 млн ₽, чистая прибыль — 2.06 млн ₽.

**Ключевые проблемы**
1. 23 SKU в убытке (−180 000 ₽). Основная причина — высокая логистика.
2. Категория «Аксессуары» показывает падение маржи на 3 п.п. к прошлой неделе.

**Рекомендации**
1. **OM-45678**: перевести на FBO для снижения логистики.
2. **OK-12345, OK-12346**: рассмотреть вывод из ассортимента.
3. Пересмотреть цены в категории «Брюки» (+5-7%).

**Возможности роста**
- Платья класса A показывают маржу 52% — увеличить закупку.
- На Ozon маржа выше WB на 2 п.п. — рассмотреть перераспределение.

[📊 Детальный отчёт] [📥 Excel]
```

### 4.6.5 Кастомный отчёт (Director)

```
Пользователь: Сравни маржинальность WB и Ozon по платьям за квартал

@Adolf_CFO: **Сравнение: Платья на WB vs Ozon, Q4 2025**

| Показатель | Wildberries | Ozon | Δ |
|------------|------------:|-----:|--:|
| Выручка | 8 450 000 ₽ | 3 210 000 ₽ | +163% |
| Себестоимость | 3 380 000 ₽ | 1 284 000 ₽ | — |
| Комиссия | 1 098 500 ₽ (13%) | 545 700 ₽ (17%) | +4 п.п. |
| Логистика | 507 000 ₽ (6%) | 256 800 ₽ (8%) | +2 п.п. |
| Прибыль | 3 464 500 ₽ | 1 123 500 ₽ | — |
| Маржа | 41.0% | 35.0% | −6 п.п. |

**Вывод:** Wildberries показывает более высокую маржинальность за счёт 
меньшей комиссии (13% vs 17%) и более низких затрат на логистику.

**Рекомендация:** На Ozon рассмотреть повышение цен на 5-7% для 
выравнивания маржинальности с WB.

[📥 Excel] [📄 PDF]
```

---

**Документ подготовлен:** Январь 2026  
**Версия:** 1.0  
**Статус:** Черновик

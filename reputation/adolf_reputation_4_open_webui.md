# ADOLF REPUTATION — Раздел 4: Open WebUI Integration

**Проект:** Интеллектуальная система управления репутацией  
**Модуль:** Reputation / Open WebUI  
**Версия:** 2.1  
**Дата:** Январь 2026

---

## 4.1 Назначение

> **Примечание (Март 2026):** Ниже описана архитектура интеграции через chat-агента `@Adolf_Reputation`. Фактическая реализация использует **standalone-страницу** `/reputation` с прямыми вызовами REST API. Структура страницы:
>
> | Таб | Описание |
> |-----|----------|
> | **Дашборд** | Метрики: всего обращений, ожидает, среднее время, средний рейтинг. Фильтр по МП |
> | **Обращения** | Таблица отзывов и вопросов с фильтрацией (МП, статус, тип), сортировкой (дата, рейтинг), пагинацией. Типы: отзыв/вопрос. Статусы: на модерации, с ответом, черновик AI |
> | **Ответы AI** | Черновики AI-ответов с возможностью редактирования, утверждения, перегенерации и публикации |
>
> Документация агента ниже сохранена как спецификация backend API.

Интеграция модуля Reputation с Open WebUI обеспечивает:
- Интерфейс управления отзывами через страницу `/reputation`
- Function Calling для операций с отзывами (backend)
- Отображение статистики и уведомлений

---

## 4.2 Агент @Adolf_Reputation

### Конфигурация

```yaml
name: Adolf_Reputation
description: Управление отзывами и вопросами покупателей
model: gpt-5-mini
temperature: 0.3
system_prompt: |
  Ты — ассистент по управлению отзывами и вопросами покупателей.
  
  Твои возможности:
  - Показать список отзывов и вопросов
  - Показать детали отзыва с AI-анализом и черновиком ответа
  - Утвердить, отредактировать или перегенерировать ответ
  - Показать статистику
  
  Отвечай кратко и по делу. При показе отзывов форматируй информацию наглядно.
```

### Доступ по ролям

| Роль | Доступ | Ограничения |
|------|--------|-------------|
| Staff | ❌ | Нет доступа |
| Manager | ✅ | Только свой brand_id |
| Senior | ✅ | Все бренды |
| Director | ✅ | Все бренды + analytics |
| Administrator | ✅ | Полный доступ |

---

## 4.3 Function Calling (Tools)

### Реестр функций

| Функция | Описание | Параметры |
|---------|----------|-----------|
| `get_pending_items` | Список ожидающих обработки | `limit`, `platform`, `item_type` |
| `get_item_details` | Детали отзыва с анализом | `item_id` |
| `approve_response` | Утвердить ответ | `item_id` |
| `edit_and_approve` | Редактировать и утвердить | `item_id`, `new_text` |
| `regenerate_response` | Перегенерировать | `item_id`, `instructions` |
| `skip_item` | Пропустить (не отвечать) | `item_id`, `reason` |
| `escalate_item` | Эскалировать | `item_id`, `reason` |
| `bulk_approve` | Массовое утверждение | `item_ids` |
| `get_stats` | Статистика | `period`, `platform`, `brand_id` |

### Определения функций

```python
REPUTATION_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_pending_items",
            "description": "Получить список отзывов/вопросов, ожидающих обработки",
            "parameters": {
                "type": "object",
                "properties": {
                    "limit": {
                        "type": "integer",
                        "description": "Количество записей (по умолчанию 10)",
                        "default": 10
                    },
                    "platform": {
                        "type": "string",
                        "enum": ["wb", "ozon", "ym", "all"],
                        "description": "Фильтр по платформе"
                    },
                    "item_type": {
                        "type": "string",
                        "enum": ["review", "question", "all"],
                        "description": "Фильтр по типу"
                    }
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_item_details",
            "description": "Получить детали отзыва/вопроса с AI-анализом и черновиком ответа",
            "parameters": {
                "type": "object",
                "properties": {
                    "item_id": {
                        "type": "integer",
                        "description": "ID записи"
                    }
                },
                "required": ["item_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "approve_response",
            "description": "Утвердить сгенерированный ответ для публикации",
            "parameters": {
                "type": "object",
                "properties": {
                    "item_id": {
                        "type": "integer",
                        "description": "ID записи"
                    }
                },
                "required": ["item_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "edit_and_approve",
            "description": "Отредактировать текст ответа и утвердить",
            "parameters": {
                "type": "object",
                "properties": {
                    "item_id": {
                        "type": "integer",
                        "description": "ID записи"
                    },
                    "new_text": {
                        "type": "string",
                        "description": "Новый текст ответа"
                    }
                },
                "required": ["item_id", "new_text"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "regenerate_response",
            "description": "Перегенерировать ответ с указаниями",
            "parameters": {
                "type": "object",
                "properties": {
                    "item_id": {
                        "type": "integer",
                        "description": "ID записи"
                    },
                    "instructions": {
                        "type": "string",
                        "description": "Инструкции для перегенерации"
                    }
                },
                "required": ["item_id", "instructions"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_stats",
            "description": "Получить статистику по отзывам",
            "parameters": {
                "type": "object",
                "properties": {
                    "period": {
                        "type": "string",
                        "enum": ["today", "week", "month"],
                        "description": "Период"
                    },
                    "platform": {
                        "type": "string",
                        "enum": ["wb", "ozon", "ym", "all"],
                        "description": "Платформа"
                    }
                }
            }
        }
    }
]
```

---

## 4.4 Реализация обработчиков

### Pipeline для Function Calling

```python
# pipelines/reputation_pipeline.py

class ReputationPipeline:
    """Pipeline для обработки функций модуля Reputation."""
    
    def __init__(self):
        self.name = "Reputation"
        self.tools = REPUTATION_TOOLS
    
    async def handle_tool_call(
        self, 
        tool_name: str, 
        arguments: dict,
        user: dict
    ) -> dict:
        """Обработка вызова функции."""
        
        # Проверка доступа
        if user["role"] == "staff":
            return {"error": "Недостаточно прав"}
        
        handlers = {
            "get_pending_items": self._get_pending_items,
            "get_item_details": self._get_item_details,
            "approve_response": self._approve_response,
            "edit_and_approve": self._edit_and_approve,
            "regenerate_response": self._regenerate_response,
            "skip_item": self._skip_item,
            "escalate_item": self._escalate_item,
            "bulk_approve": self._bulk_approve,
            "get_stats": self._get_stats,
        }
        
        handler = handlers.get(tool_name)
        if not handler:
            return {"error": f"Unknown function: {tool_name}"}
        
        return await handler(arguments, user)
    
    async def _get_pending_items(self, args: dict, user: dict) -> dict:
        """Получение списка ожидающих обработки."""
        
        filters = {"status": "pending_review"}
        
        # Фильтр по бренду для Manager
        if user["role"] == "manager":
            filters["brand_id"] = user["brand_id"]
        
        if args.get("platform") and args["platform"] != "all":
            filters["platform"] = args["platform"]
        
        if args.get("item_type") and args["item_type"] != "all":
            filters["item_type"] = args["item_type"]
        
        items = await reputation_api.get_items(
            filters=filters,
            limit=args.get("limit", 10)
        )
        
        return {
            "count": len(items),
            "items": [self._format_item_summary(item) for item in items]
        }
    
    async def _get_item_details(self, args: dict, user: dict) -> dict:
        """Получение деталей отзыва."""
        
        item = await reputation_api.get_item(args["item_id"])
        
        # Проверка доступа к бренду
        if user["role"] == "manager" and item["brand_id"] != user["brand_id"]:
            return {"error": "Нет доступа к этому бренду"}
        
        return self._format_item_details(item)
    
    async def _approve_response(self, args: dict, user: dict) -> dict:
        """Утверждение ответа."""
        
        result = await reputation_api.approve(
            item_id=args["item_id"],
            user_id=user["id"]
        )
        
        return {"status": "approved", "item_id": args["item_id"]}
    
    async def _edit_and_approve(self, args: dict, user: dict) -> dict:
        """Редактирование и утверждение."""
        
        result = await reputation_api.edit_and_approve(
            item_id=args["item_id"],
            new_text=args["new_text"],
            user_id=user["id"]
        )
        
        return {"status": "approved", "item_id": args["item_id"]}
    
    async def _regenerate_response(self, args: dict, user: dict) -> dict:
        """Перегенерация ответа."""
        
        result = await reputation_api.regenerate(
            item_id=args["item_id"],
            instructions=args["instructions"]
        )
        
        return {"status": "regenerating", "item_id": args["item_id"]}
    
    async def _get_stats(self, args: dict, user: dict) -> dict:
        """Получение статистики."""
        
        filters = {}
        
        if user["role"] == "manager":
            filters["brand_id"] = user["brand_id"]
        
        if args.get("platform") and args["platform"] != "all":
            filters["platform"] = args["platform"]
        
        stats = await reputation_api.get_stats(
            period=args.get("period", "today"),
            filters=filters
        )
        
        return stats
    
    def _format_item_summary(self, item: dict) -> dict:
        """Форматирование краткой информации об отзыве."""
        return {
            "id": item["id"],
            "platform": item["platform"],
            "type": item["item_type"],
            "rating": item.get("rating"),
            "client": item["client_name"],
            "text_preview": item["client_text"][:100] + "..." if len(item["client_text"]) > 100 else item["client_text"],
            "sentiment": item.get("ai_analysis", {}).get("sentiment"),
            "created_at": item["created_at"]
        }
    
    def _format_item_details(self, item: dict) -> dict:
        """Форматирование полной информации об отзыве."""
        response = item.get("response", {})
        
        return {
            "id": item["id"],
            "platform": item["platform"],
            "type": item["item_type"],
            "sku": item["sku"],
            "product_name": item.get("product_name"),
            "brand": item["brand_id"],
            "client": {
                "name": item["client_name"],
                "text": item["client_text"],
                "rating": item.get("rating")
            },
            "analysis": item.get("ai_analysis", {}),
            "response": {
                "draft": response.get("draft_text"),
                "status": response.get("status"),
                "regenerate_count": response.get("regenerate_count", 0)
            },
            "created_at": item["created_at"]
        }
```

---

## 4.5 Примеры диалогов

### Просмотр списка

```
Пользователь: Покажи новые отзывы

@Adolf_Reputation → get_pending_items(limit=5)

Ассистент: Найдено 5 отзывов, ожидающих обработки:

1. #1234 | WB | ⭐⭐⭐⭐ | Анна
   "Платье красивое, но размер большемерит..."
   Тональность: нейтральная

2. #1235 | Ozon | ⭐⭐ | Мария  
   "Качество ткани ужасное, нитки торчат..."
   Тональность: негативная

...
```

### Утверждение ответа

```
Пользователь: Покажи отзыв 1234

@Adolf_Reputation → get_item_details(item_id=1234)

Ассистент: 
📦 Отзыв #1234 (Wildberries)
Товар: Платье летнее (OM-2024-050)
Клиент: Анна | Оценка: ⭐⭐⭐⭐

Текст: "Платье красивое, но размер большемерит на один размер"

🤖 AI-анализ:
- Тональность: нейтральная (0.6)
- Категория: sizing
- Теги: размер, большемерит

📝 Черновик ответа:
"Анна, благодарим за отзыв! Мы рады, что платье вам понравилось. 
Данная модель действительно имеет свободный крой, рекомендуем 
ориентироваться на размерную сетку в карточке товара. 
Будем рады видеть вас снова!"

Пользователь: Утверди

@Adolf_Reputation → approve_response(item_id=1234)

Ассистент: ✅ Ответ утверждён и будет опубликован.
```

---

## 4.6 Уведомления

### Интеграция с Notification System

```python
# При получении нового негативного отзыва
notification_publisher.publish(
    event_type="review.negative",
    title="Негативный отзыв",
    message=f"Получен отзыв {rating}⭐ на товар '{product_name}'",
    source_module="reputation",
    source_id=str(item_id),
    level="warning",
    brand_id=brand_id,
    data={
        "item_id": item_id,
        "platform": platform,
        "rating": rating
    }
)
```

---

## Приложение А: Контрольные точки

| Критерий | Проверка |
|----------|----------|
| Агент доступен | `@Adolf_Reputation` отвечает |
| Tools работают | Функции вызываются и возвращают данные |
| Фильтрация по бренду | Manager видит только свой бренд |
| Уведомления | Приходят при новых отзывах |

---

**Документ подготовлен:** Январь 2026  
**Версия:** 2.1  
**Статус:** Согласовано

---
title: "Раздел 4: Open WebUI"
mode: "wide"
---

**Проект:** Автоматизированный правовой мониторинг для e-commerce  
**Модуль:** Lex / Open WebUI  
**Версия:** 1.0  
**Дата:** Январь 2026

---

## 4.1 Назначение

Интеграция модуля Lex с Open WebUI обеспечивает:

| Функция | Описание |
|---------|----------|
| Агент `@Adolf_Lex` | Специализированный интерфейс для работы с правовыми документами |
| Function Calling | Операции с документами, алертами, статистикой |
| Интеграция с Knowledge | Поиск правовых документов через `@Adolf_Knowledge` |
| Уведомления | Отображение алертов о новых документах |

### Комбинированный подход

Lex использует два способа доступа к данным:

| Способ | Pipeline | Назначение |
|--------|----------|------------|
| Поиск документов | `@Adolf_Knowledge` | RAG-поиск по всей базе знаний, включая документы Lex |
| Специфичные функции | `@Adolf_Lex` | Алерты, статистика, последние изменения, ручная загрузка |

---

## 4.2 Агент @Adolf_Lex

### Конфигурация

```yaml
name: Adolf_Lex
description: Правовой мониторинг и аналитика законодательства
model: gpt-5-mini
temperature: 0.3
system_prompt: |
  Ты — ассистент по правовому мониторингу для e-commerce бизнеса.
  
  Твои возможности:
  - Показать последние изменения в законодательстве
  - Показать алерты о новых документах
  - Найти документы по категориям
  - Показать статистику сбора
  - Рассказать о конкретном документе
  - Загрузить документ вручную (для Senior+)
  
  Компания работает в сфере fashion retail на маркетплейсах (WB, Ozon, YM).
  Основные темы: торговля, маркировка, права потребителей, налоги, реклама.
  
  Отвечай кратко и по делу. Форматируй информацию наглядно.
  При описании документов выделяй сроки вступления в силу и влияние на бизнес.
```

### Доступ по ролям

| Роль | Доступ | Ограничения |
|------|--------|-------------|
| Staff | ❌ | Нет доступа |
| Manager | ✅ | Чтение документов, алертов, статистики |
| Senior | ✅ | + Ручная загрузка документов |
| Director | ✅ | + Расширенная аналитика |
| Administrator | ✅ | + Управление настройками |

---

## 4.3 Function Calling (Tools)

### Реестр функций

| Функция | Описание | Доступ | Параметры |
|---------|----------|--------|-----------|
| `get_recent_documents` | Последние документы | Manager+ | `limit`, `category`, `days` |
| `get_alerts` | Список алертов | Manager+ | `status`, `category`, `limit` |
| `get_alert_details` | Детали алерта | Manager+ | `alert_id` |
| `mark_alert_read` | Отметить прочитанным | Manager+ | `alert_id` |
| `get_document` | Информация о документе | Manager+ | `document_id` |
| `search_documents` | Поиск документов | Manager+ | `query`, `category`, `date_from` |
| `get_effective_soon` | Документы, вступающие в силу | Manager+ | `days` |
| `upload_document` | Ручная загрузка | Senior+ | `url` или `file` |
| `get_statistics` | Статистика модуля | Manager+ | `period` |
| `get_categories_summary` | Сводка по категориям | Manager+ | — |
| `get_keywords` | Список ключевых слов | Manager+ | — |
| `update_keywords` | Обновить ключевые слова | Admin | `category`, `keywords` |

### Определения функций

```python
# tools/lex_tools.py

LEX_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_recent_documents",
            "description": "Получить последние добавленные документы по законодательству",
            "parameters": {
                "type": "object",
                "properties": {
                    "limit": {
                        "type": "integer",
                        "description": "Количество документов (по умолчанию 10)",
                        "default": 10
                    },
                    "category": {
                        "type": "string",
                        "enum": ["trade", "marking", "consumer_rights", "advertising", "tax", "labor", "personal_data", "all"],
                        "description": "Фильтр по категории"
                    },
                    "days": {
                        "type": "integer",
                        "description": "За последние N дней (по умолчанию 7)",
                        "default": 7
                    }
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_alerts",
            "description": "Получить список алертов о новых документах",
            "parameters": {
                "type": "object",
                "properties": {
                    "status": {
                        "type": "string",
                        "enum": ["unread", "read", "all"],
                        "description": "Статус алертов",
                        "default": "unread"
                    },
                    "category": {
                        "type": "string",
                        "enum": ["trade", "marking", "consumer_rights", "advertising", "tax", "labor", "personal_data", "all"],
                        "description": "Фильтр по категории"
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Количество алертов",
                        "default": 10
                    }
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_alert_details",
            "description": "Получить детали алерта с полной информацией о документе",
            "parameters": {
                "type": "object",
                "properties": {
                    "alert_id": {
                        "type": "integer",
                        "description": "ID алерта"
                    }
                },
                "required": ["alert_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "mark_alert_read",
            "description": "Отметить алерт как прочитанный",
            "parameters": {
                "type": "object",
                "properties": {
                    "alert_id": {
                        "type": "integer",
                        "description": "ID алерта"
                    }
                },
                "required": ["alert_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_document",
            "description": "Получить полную информацию о документе по ID",
            "parameters": {
                "type": "object",
                "properties": {
                    "document_id": {
                        "type": "integer",
                        "description": "ID документа"
                    }
                },
                "required": ["document_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_documents",
            "description": "Поиск документов по ключевым словам",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Поисковый запрос"
                    },
                    "category": {
                        "type": "string",
                        "enum": ["trade", "marking", "consumer_rights", "advertising", "tax", "labor", "personal_data", "all"],
                        "description": "Фильтр по категории"
                    },
                    "date_from": {
                        "type": "string",
                        "description": "Дата начала (YYYY-MM-DD)"
                    },
                    "limit": {
                        "type": "integer",
                        "default": 10
                    }
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_effective_soon",
            "description": "Получить документы, вступающие в силу в ближайшее время",
            "parameters": {
                "type": "object",
                "properties": {
                    "days": {
                        "type": "integer",
                        "description": "В течение N дней (по умолчанию 30)",
                        "default": 30
                    }
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "upload_document",
            "description": "Загрузить документ вручную по URL (только Senior+)",
            "parameters": {
                "type": "object",
                "properties": {
                    "url": {
                        "type": "string",
                        "description": "URL документа (КонсультантПлюс или Гарант)"
                    }
                },
                "required": ["url"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_statistics",
            "description": "Получить статистику модуля Lex",
            "parameters": {
                "type": "object",
                "properties": {
                    "period": {
                        "type": "string",
                        "enum": ["today", "week", "month", "all"],
                        "description": "Период статистики",
                        "default": "week"
                    }
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_categories_summary",
            "description": "Получить сводку документов по категориям",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_keywords",
            "description": "Получить список ключевых слов для фильтрации",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_keywords",
            "description": "Обновить ключевые слова для категории (только Admin)",
            "parameters": {
                "type": "object",
                "properties": {
                    "category": {
                        "type": "string",
                        "enum": ["trade", "marking", "consumer_rights", "advertising", "tax", "labor", "personal_data", "platforms"],
                        "description": "Категория"
                    },
                    "keywords": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Список ключевых слов"
                    }
                },
                "required": ["category", "keywords"]
            }
        }
    }
]
```

---

## 4.4 Реализация Pipeline

### Основной Pipeline

```python
# pipelines/lex_pipeline.py

from typing import Dict, Any, Optional
from core.database import db_session
from core.api_client import lex_api
from tools.lex_tools import LEX_TOOLS


class LexPipeline:
    """Pipeline для обработки функций модуля Lex."""
    
    def __init__(self):
        self.name = "Lex"
        self.tools = LEX_TOOLS
    
    async def handle_tool_call(
        self,
        tool_name: str,
        arguments: Dict[str, Any],
        user: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Обработка вызова функции."""
        
        # Проверка базового доступа
        if user["role"] == "staff":
            return {"error": "Недостаточно прав. Модуль Lex доступен для Manager и выше."}
        
        # Проверка доступа для Senior+ функций
        senior_plus_functions = ["upload_document"]
        if tool_name in senior_plus_functions and user["role"] == "manager":
            return {"error": "Эта функция доступна для Senior и выше."}
        
        # Проверка доступа для Admin функций
        admin_functions = ["update_keywords"]
        if tool_name in admin_functions and user["role"] != "admin":
            return {"error": "Эта функция доступна только для Administrator."}
        
        # Маршрутизация
        handlers = {
            "get_recent_documents": self._get_recent_documents,
            "get_alerts": self._get_alerts,
            "get_alert_details": self._get_alert_details,
            "mark_alert_read": self._mark_alert_read,
            "get_document": self._get_document,
            "search_documents": self._search_documents,
            "get_effective_soon": self._get_effective_soon,
            "upload_document": self._upload_document,
            "get_statistics": self._get_statistics,
            "get_categories_summary": self._get_categories_summary,
            "get_keywords": self._get_keywords,
            "update_keywords": self._update_keywords,
        }
        
        handler = handlers.get(tool_name)
        if not handler:
            return {"error": f"Неизвестная функция: {tool_name}"}
        
        try:
            return await handler(arguments, user)
        except Exception as e:
            return {"error": f"Ошибка выполнения: {str(e)}"}
    
    async def _get_recent_documents(self, args: Dict, user: Dict) -> Dict:
        """Получение последних документов."""
        
        documents = await lex_api.get_documents(
            limit=args.get("limit", 10),
            category=args.get("category") if args.get("category") != "all" else None,
            days=args.get("days", 7)
        )
        
        return {
            "count": len(documents),
            "period_days": args.get("days", 7),
            "documents": [self._format_document_summary(doc) for doc in documents]
        }
    
    async def _get_alerts(self, args: Dict, user: Dict) -> Dict:
        """Получение алертов."""
        
        alerts = await lex_api.get_alerts(
            user_id=user["id"],
            status=args.get("status", "unread"),
            category=args.get("category") if args.get("category") != "all" else None,
            limit=args.get("limit", 10)
        )
        
        unread_count = await lex_api.get_unread_count(user["id"])
        
        return {
            "unread_total": unread_count,
            "showing": len(alerts),
            "alerts": [self._format_alert_summary(alert) for alert in alerts]
        }
    
    async def _get_alert_details(self, args: Dict, user: Dict) -> Dict:
        """Получение деталей алерта."""
        
        alert = await lex_api.get_alert(args["alert_id"])
        if not alert:
            return {"error": "Алерт не найден"}
        
        document = await lex_api.get_document(alert["document_id"])
        
        return {
            "alert": self._format_alert_details(alert),
            "document": self._format_document_details(document)
        }
    
    async def _mark_alert_read(self, args: Dict, user: Dict) -> Dict:
        """Отметка алерта прочитанным."""
        
        await lex_api.mark_alert_read(
            alert_id=args["alert_id"],
            user_id=user["id"]
        )
        
        return {"status": "success", "alert_id": args["alert_id"]}
    
    async def _get_document(self, args: Dict, user: Dict) -> Dict:
        """Получение документа по ID."""
        
        document = await lex_api.get_document(args["document_id"])
        if not document:
            return {"error": "Документ не найден"}
        
        return self._format_document_details(document)
    
    async def _search_documents(self, args: Dict, user: Dict) -> Dict:
        """Поиск документов."""
        
        documents = await lex_api.search(
            query=args["query"],
            category=args.get("category") if args.get("category") != "all" else None,
            date_from=args.get("date_from"),
            limit=args.get("limit", 10)
        )
        
        return {
            "query": args["query"],
            "count": len(documents),
            "documents": [self._format_document_summary(doc) for doc in documents]
        }
    
    async def _get_effective_soon(self, args: Dict, user: Dict) -> Dict:
        """Получение документов, вступающих в силу."""
        
        documents = await lex_api.get_effective_soon(
            days=args.get("days", 30)
        )
        
        return {
            "period_days": args.get("days", 30),
            "count": len(documents),
            "documents": [self._format_effective_document(doc) for doc in documents]
        }
    
    async def _upload_document(self, args: Dict, user: Dict) -> Dict:
        """Ручная загрузка документа."""
        
        result = await lex_api.upload_document(
            url=args["url"],
            user_id=user["id"]
        )
        
        if result.get("success"):
            return {
                "status": "success",
                "document_id": result["document_id"],
                "title": result["title"],
                "relevance_score": result["relevance_score"],
                "category": result["category"]
            }
        else:
            return {
                "status": "rejected",
                "reason": result.get("reason"),
                "relevance_score": result.get("relevance_score")
            }
    
    async def _get_statistics(self, args: Dict, user: Dict) -> Dict:
        """Получение статистики."""
        
        stats = await lex_api.get_statistics(
            period=args.get("period", "week")
        )
        
        return stats
    
    async def _get_categories_summary(self, args: Dict, user: Dict) -> Dict:
        """Получение сводки по категориям."""
        
        summary = await lex_api.get_categories_summary()
        return summary
    
    async def _get_keywords(self, args: Dict, user: Dict) -> Dict:
        """Получение ключевых слов."""
        
        keywords = await lex_api.get_keywords()
        return {"categories": keywords}
    
    async def _update_keywords(self, args: Dict, user: Dict) -> Dict:
        """Обновление ключевых слов."""
        
        await lex_api.update_keywords(
            category=args["category"],
            keywords=args["keywords"]
        )
        
        return {
            "status": "success",
            "category": args["category"],
            "keywords_count": len(args["keywords"])
        }
    
    # === Форматирование ===
    
    def _format_document_summary(self, doc: Dict) -> Dict:
        """Форматирование краткой информации о документе."""
        return {
            "id": doc["id"],
            "title": doc["title"][:100] + "..." if len(doc["title"]) > 100 else doc["title"],
            "type": self._translate_doc_type(doc["doc_type"]),
            "category": self._translate_category(doc["category"]),
            "relevance": self._translate_relevance(doc["relevance_level"]),
            "date": doc["document_date"],
            "effective_date": doc.get("effective_date"),
            "source": doc["source"]
        }
    
    def _format_document_details(self, doc: Dict) -> Dict:
        """Форматирование полной информации о документе."""
        return {
            "id": doc["id"],
            "title": doc["title"],
            "number": doc.get("document_number"),
            "type": self._translate_doc_type(doc["doc_type"]),
            "category": self._translate_category(doc["category"]),
            "relevance": self._translate_relevance(doc["relevance_level"]),
            "relevance_score": doc.get("relevance_score"),
            "date": doc["document_date"],
            "effective_date": doc.get("effective_date"),
            "issuer": doc.get("issuer"),
            "source": doc["source"],
            "url": doc.get("original_url"),
            "summary": doc.get("summary"),
            "indexed_at": doc["created_at"]
        }
    
    def _format_alert_summary(self, alert: Dict) -> Dict:
        """Форматирование краткой информации об алерте."""
        return {
            "id": alert["id"],
            "type": self._translate_alert_type(alert["alert_type"]),
            "title": alert["title"][:80] + "..." if len(alert["title"]) > 80 else alert["title"],
            "category": self._translate_category(alert["category"]),
            "relevance": self._translate_relevance(alert["relevance_level"]),
            "status": alert["status"],
            "created_at": alert["created_at"]
        }
    
    def _format_alert_details(self, alert: Dict) -> Dict:
        """Форматирование полной информации об алерте."""
        return {
            "id": alert["id"],
            "type": self._translate_alert_type(alert["alert_type"]),
            "title": alert["title"],
            "summary": alert.get("summary"),
            "category": self._translate_category(alert["category"]),
            "relevance": self._translate_relevance(alert["relevance_level"]),
            "status": alert["status"],
            "created_at": alert["created_at"],
            "read_at": alert.get("read_at")
        }
    
    def _format_effective_document(self, doc: Dict) -> Dict:
        """Форматирование документа с датой вступления в силу."""
        base = self._format_document_summary(doc)
        base["days_until_effective"] = doc.get("days_until_effective")
        return base
    
    # === Переводы ===
    
    def _translate_doc_type(self, doc_type: str) -> str:
        """Перевод типа документа."""
        translations = {
            "federal_law": "Федеральный закон",
            "amendment": "Изменение НПА",
            "decree": "Постановление",
            "court_decision": "Судебное решение",
            "clarification": "Разъяснение",
            "standard": "Стандарт",
            "other": "Прочее"
        }
        return translations.get(doc_type, doc_type)
    
    def _translate_category(self, category: str) -> str:
        """Перевод категории."""
        translations = {
            "trade": "Торговля",
            "marking": "Маркировка",
            "consumer_rights": "Права потребителей",
            "advertising": "Реклама",
            "tax": "Налоги",
            "labor": "Труд",
            "personal_data": "Персональные данные"
        }
        return translations.get(category, category)
    
    def _translate_relevance(self, level: str) -> str:
        """Перевод уровня релевантности."""
        translations = {
            "high": "🔴 Высокая",
            "medium": "🟡 Средняя",
            "low": "🟢 Низкая"
        }
        return translations.get(level, level)
    
    def _translate_alert_type(self, alert_type: str) -> str:
        """Перевод типа алерта."""
        translations = {
            "new_law": "📜 Новый закон",
            "amendment": "📝 Изменение",
            "court_decision": "⚖️ Судебное решение",
            "clarification": "📋 Разъяснение",
            "effective_soon": "⏰ Вступает в силу",
            "marketplace_mention": "🏪 Упоминание МП"
        }
        return translations.get(alert_type, alert_type)
```

---

## 4.5 Примеры диалогов

### Просмотр алертов

```
Пользователь: Покажи непрочитанные алерты

@Adolf_Lex → get_alerts(status="unread", limit=5)

Ассистент: 📬 У вас 3 непрочитанных алерта:

1. #456 | 📜 Новый закон | 🔴 Высокая
   "ФЗ о внесении изменений в Закон о защите прав потре..."
   Категория: Права потребителей
   
2. #457 | 📋 Разъяснение | 🟡 Средняя
   "Письмо ФНС о налогообложении продаж на маркетплейсах"
   Категория: Налоги

3. #458 | ⏰ Вступает в силу | 🔴 Высокая
   "Требования к маркировке одежды — срок 01.02.2026"
   Категория: Маркировка

Хотите узнать подробности о каком-либо алерте?
```

### Детали документа

```
Пользователь: Расскажи подробнее про первый алерт

@Adolf_Lex → get_alert_details(alert_id=456)

Ассистент: 📜 **Федеральный закон от 15.12.2025 N 500-ФЗ**
«О внесении изменений в Закон РФ "О защите прав потребителей"»

📊 **Классификация:**
- Категория: Права потребителей
- Тип: Федеральный закон
- Релевантность: 🔴 Высокая (92%)

📅 **Даты:**
- Дата документа: 15.12.2025
- Вступает в силу: 01.03.2026

📝 **Резюме:**
Закон увеличивает срок возврата товаров, купленных на маркетплейсах, 
до 30 дней и устанавливает солидарную ответственность маркетплейса 
и продавца перед покупателем.

**Ключевые положения:**
• Срок возврата увеличен с 7 до 30 дней
• Маркетплейс несёт солидарную ответственность
• Новые требования к информированию покупателя

⚠️ **Влияние на бизнес:** ВЫСОКОЕ
Необходимо пересмотреть политику возврата и обновить карточки товаров.

🔗 Источник: КонсультантПлюс

Отметить как прочитанный?
```

### Последние изменения в законодательстве

```
Пользователь: Что нового в законодательстве за неделю?

@Adolf_Lex → get_recent_documents(days=7, limit=10)

Ассистент: 📚 За последние 7 дней добавлено 8 документов:

**Торговля (2):**
1. ФЗ-500 «О защите прав потребителей» — 🔴 Высокая
2. Постановление о правилах дистанционной торговли — 🟡 Средняя

**Маркировка (3):**
3. Изменения в правилах маркировки одежды — 🔴 Высокая
4. Разъяснение ЦРПТ по срокам маркировки — 🟡 Средняя
5. ГОСТ на маркировку текстиля — 🟢 Низкая

**Налоги (2):**
6. Письмо ФНС о УСН для маркетплейсов — 🟡 Средняя
7. Разъяснение по НДС при возвратах — 🟢 Низкая

**Реклама (1):**
8. Изменения в закон о рекламе — 🟡 Средняя

Показать подробности о каком-либо документе?
```

### Поиск документов

```
Пользователь: Найди всё про возврат товаров на маркетплейсах

@Adolf_Lex → search_documents(query="возврат товаров маркетплейс")

Ассистент: 🔍 Найдено 5 документов по запросу "возврат товаров маркетплейс":

1. **ФЗ-500 от 15.12.2025** — 🔴 Высокая
   Новые правила возврата на маркетплейсах (30 дней)
   Вступает в силу: 01.03.2026

2. **Постановление Правительства от 10.11.2025** — 🟡 Средняя
   Правила возврата товаров надлежащего качества

3. **Решение ВС от 05.12.2025** — 🟡 Средняя
   О солидарной ответственности маркетплейса

4. **Письмо Роспотребнадзора от 20.12.2025** — 🟢 Низкая
   Разъяснения по срокам возврата

5. **Обзор судебной практики 2025** — 🟢 Низкая
   Споры покупателей с маркетплейсами

Какой документ показать подробнее?
```

### Документы, вступающие в силу

```
Пользователь: Какие законы вступают в силу в этом месяце?

@Adolf_Lex → get_effective_soon(days=30)

Ассистент: ⏰ В ближайшие 30 дней вступают в силу 3 документа:

1. **01.02.2026** (через 9 дней) — 🔴 Высокая
   📜 Требования к маркировке одежды (Честный ЗНАК)
   Категория: Маркировка

2. **15.02.2026** (через 23 дня) — 🟡 Средняя
   📝 Изменения в закон о рекламе
   Категория: Реклама

3. **28.02.2026** (через 36 дней) — 🟡 Средняя
   📋 Новые требования к информированию покупателей
   Категория: Права потребителей

⚠️ Рекомендую обратить внимание на документ #1 — требует подготовки!
```

### Статистика

```
Пользователь: Покажи статистику Lex за месяц

@Adolf_Lex → get_statistics(period="month")

Ассистент: 📊 **Статистика Lex за последний месяц:**

**Документов собрано:** 127
- КонсультантПлюс: 85
- Гарант: 42

**По категориям:**
- Торговля: 28 (22%)
- Маркировка: 35 (28%)
- Права потребителей: 24 (19%)
- Налоги: 18 (14%)
- Реклама: 12 (9%)
- Труд: 7 (6%)
- Персональные данные: 3 (2%)

**По релевантности:**
- 🔴 Высокая: 23 (18%)
- 🟡 Средняя: 67 (53%)
- 🟢 Низкая: 37 (29%)

**Алерты:**
- Отправлено: 127
- Прочитано: 98 (77%)

**Эффективность фильтрации:**
- Проверено документов: 312
- Принято: 127 (41%)
- Отклонено: 185 (59%)
```

### Ручная загрузка документа

```
Пользователь: Добавь документ https://www.consultant.ru/document/cons_doc_LAW_XXX/

@Adolf_Lex → upload_document(url="https://www.consultant.ru/document/cons_doc_LAW_XXX/")

Ассистент: ✅ Документ успешно добавлен!

**ID:** 789
**Название:** Приказ Минпромторга о маркировке товаров
**Категория:** Маркировка
**Релевантность:** 🟡 Средняя (73%)

Документ проиндексирован и доступен для поиска.
```

---

## 4.6 Интеграция с @Adolf_Knowledge

### Использование Knowledge для поиска

Документы Lex автоматически индексируются в Knowledge Base и доступны через `@Adolf_Knowledge`:

```
Пользователь: @Adolf_Knowledge Какие штрафы за отсутствие маркировки одежды?

@Adolf_Knowledge → search(query="штрафы маркировка одежда", filters={category: "marking"})

Ассистент: По данным из базы знаний:

**Штрафы за отсутствие маркировки товаров лёгкой промышленности** 
(согласно КоАП РФ, ст. 15.12):

• Для ИП: 5 000 - 10 000 руб.
• Для юрлиц: 50 000 - 300 000 руб.
• При повторном нарушении: до 500 000 руб.
• Конфискация товара: в любом случае

📄 Источник: ФЗ-487 от 31.12.2017, Постановление Правительства №1956

Хотите узнать подробнее о требованиях к маркировке?
```

### Разграничение функций

| Запрос пользователя | Pipeline | Причина |
|---------------------|----------|---------|
| "Какие штрафы за отсутствие маркировки?" | `@Adolf_Knowledge` | Поиск по содержимому документов |
| "Что нового в законодательстве?" | `@Adolf_Lex` | Получение последних документов |
| "Покажи алерты" | `@Adolf_Lex` | Работа с алертами |
| "Найди закон о защите прав потребителей" | `@Adolf_Knowledge` | Поиск конкретного документа |
| "Сколько документов по маркировке?" | `@Adolf_Lex` | Статистика |

---

## 4.7 Уведомления

### Типы уведомлений

| Тип | Описание | Отображение |
|-----|----------|-------------|
| `new_law` | Новый закон | 📜 Badge + push |
| `amendment` | Изменение НПА | 📝 Badge |
| `effective_soon` | Вступает в силу через N дней | ⏰ Badge + push |
| `marketplace_mention` | Упоминание WB/Ozon/YM | 🏪 Badge |

### Интеграция с Open WebUI

```python
# notifications/lex_notifications.py

async def send_lex_notification(alert: LexAlert, recipients: List[User]):
    """Отправка уведомления через Open WebUI."""
    
    notification = {
        "type": "lex_alert",
        "title": f"[Lex] {alert.alert_type_display}",
        "body": alert.title[:100],
        "data": {
            "alert_id": alert.id,
            "document_id": alert.document_id,
            "category": alert.category,
            "relevance": alert.relevance_level
        },
        "priority": "high" if alert.relevance_level == "high" else "normal"
    }
    
    for user in recipients:
        await open_webui.send_notification(
            user_id=user.id,
            notification=notification
        )
```

### Badge Counter

```python
# В Open WebUI показывается количество непрочитанных алертов

async def get_lex_badge_count(user_id: int) -> int:
    """Получение количества непрочитанных алертов для badge."""
    
    async with db_session() as session:
        result = await session.execute(
            """
            SELECT COUNT(*) FROM lex_alerts 
            WHERE user_id = :user_id AND status = 'unread'
            """,
            {"user_id": user_id}
        )
        return result.scalar()
```

---

## 4.8 Регистрация Pipeline

### Конфигурация Open WebUI

```yaml
# open_webui/config/pipelines.yaml

pipelines:
  - name: Adolf_Lex
    module: pipelines.lex_pipeline
    class: LexPipeline
    enabled: true
    access_roles: ["manager", "senior", "director", "admin"]
    tools: true
    
  - name: Adolf_Knowledge
    module: pipelines.knowledge_pipeline
    class: KnowledgePipeline
    enabled: true
    access_roles: ["staff", "manager", "senior", "director", "admin"]
    tools: true
```

### Инициализация

```python
# pipelines/__init__.py

from .lex_pipeline import LexPipeline
from .knowledge_pipeline import KnowledgePipeline

PIPELINES = {
    "Adolf_Lex": LexPipeline,
    "Adolf_Knowledge": KnowledgePipeline,
}

def get_pipeline(name: str):
    """Получение pipeline по имени."""
    pipeline_class = PIPELINES.get(name)
    if pipeline_class:
        return pipeline_class()
    return None
```

---

## 4.9 Конфигурация меню

### Меню для Manager+

```yaml
# open_webui/config/menu.yaml

lex_menu:
  name: "Правовой мониторинг"
  icon: "⚖️"
  access: ["manager", "senior", "director", "admin"]
  items:
    - name: "Алерты"
      action: "@Adolf_Lex Покажи непрочитанные алерты"
      badge: "lex_unread_count"
    - name: "Последние изменения"
      action: "@Adolf_Lex Что нового в законодательстве за неделю?"
    - name: "Вступают в силу"
      action: "@Adolf_Lex Какие законы вступают в силу в этом месяце?"
    - name: "Статистика"
      action: "@Adolf_Lex Покажи статистику"
    - divider: true
    - name: "Поиск документов"
      action: "@Adolf_Knowledge "
      type: "input"
```

### Меню для Admin

```yaml
lex_admin_menu:
  name: "Lex (Администрирование)"
  icon: "⚙️"
  access: ["admin"]
  items:
    - name: "Ключевые слова"
      action: "@Adolf_Lex Покажи ключевые слова"
    - name: "Настройки"
      action: "/settings/modules/lex"
      type: "link"
```

---

## Приложение А: Контрольные точки Open WebUI

| Критерий | Проверка |
|----------|----------|
| Pipeline загружается | Нет ошибок при старте |
| Tools регистрируются | Функции доступны в UI |
| Доступ по ролям | Staff не видит Lex |
| Алерты отображаются | Badge показывает count |
| Knowledge интеграция | Документы Lex в поиске |
| Уведомления работают | Push доставляются |

---

**Документ подготовлен:** Январь 2026  
**Версия:** 1.0  
**Статус:** Черновик

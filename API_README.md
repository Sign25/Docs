# ADOLF API - Краткий справочник

## Где найти документацию

Полная документация API находится в папке `adolf-docs/`:

| Файл | Описание |
|------|----------|
| `adolf_fastapi_reference_v1_1.md` | **Основной справочник** - все endpoints, параметры, примеры |
| `ADOLF_OVERVIEW_v4_2.md` | Общее описание системы и архитектуры |
| `content_factory/` | Детальная документация Content Factory |

## Быстрый старт

### Base URL
```
https://adolf.su/api/v1
```

### Аутентификация
```
Authorization: Bearer {API_KEY}
```

API ключ наследует роль и `brand_id` пользователя.

## Модули и endpoints (89 штук)

| Модуль | Endpoints | Минимальная роль |
|--------|:---------:|------------------|
| Auth | 4 | Все авторизованные |
| Knowledge | 4 | Staff+ |
| Reputation | 9 | Manager+ |
| Watcher | 10 | Manager+ |
| Content Factory | 7 | Senior+ |
| Marketing | 12 | Manager+ |
| Scout | 3 | Senior+ |
| CFO | 6 | Senior+/Director+ |
| Lex | 6 | Manager+ |
| Logistic | 10 | Manager+ |
| Launcher | 3 | Manager+ |
| Office | 5 | Director+ |
| Notifications | 4 | Все авторизованные |
| Chat | 1 | Все авторизованные |
| Служебные | 4 | Публичные/Admin |

## Примеры endpoints

### Health Check (публичный)
```
GET /health
```

### Поиск по базе знаний
```
POST /knowledge/search
{
  "query": "состав артикула OM-001",
  "top_k": 3
}
```

### Генерация контента
```
POST /content/generate
```

### Остатки логистики
```
GET /logistic/stocks?brand_id=ohana_market
```

## Пагинация

```
GET /endpoint?offset=0&limit=20
```

Ответ:
```json
{
  "items": [...],
  "total": 150,
  "offset": 0,
  "limit": 20
}
```

## HTTP коды

| Код | Описание |
|-----|----------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Server Error |

## Иерархия ролей

```
pending → staff → manager → senior → director → admin
```

---

**Полная документация:** `adolf-docs/adolf_fastapi_reference_v1_1.md`

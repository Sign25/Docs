# ADOLF WebUI

Корпоративная AI-система для автоматизации e-commerce операций на маркетплейсах.

**Компания:** ОХАНА МАРКЕТ
**Бренды:** Охана Маркет (взрослая одежда), Охана Кидс (детская одежда)
**Маркетплейсы:** Wildberries, Ozon, Yandex.Market

## Модули

| Модуль | Статус | Описание |
|--------|--------|----------|
| Knowledge | UI готов | Корпоративная база знаний с RAG |
| Content Factory | UI готов | Генерация SEO-контента для карточек товаров |
| CFO | UI готов | Финансовый учёт и аналитика |
| Reputation | Не начат | Управление отзывами |
| Watcher | Не начат | Мониторинг цен конкурентов |
| Marketing | Не начат | Автоматизация рекламы |
| Scout | Не начат | Аналитика ниш |
| Lex | Не начат | Правовой мониторинг |

## Технологии

- **Frontend:** SvelteKit, TailwindCSS
- **Backend:** Python, FastAPI
- **Database:** SQLite / PostgreSQL
- **AI:** OpenAI API, Timeweb AI Agent
- **Base:** Open WebUI (форк)

## Запуск

```bash
# Frontend
npm run dev -- --port 5174

# Backend
cd backend
.\venv\Scripts\activate
python -m uvicorn open_webui.main:app --host 0.0.0.0 --port 8080
```

Подробнее: [ЗАПУСК.md](ЗАПУСК.md)

## Документация

- [TASKS.md](TASKS.md) — задачи и roadmap проекта
- [CLAUDE.md](CLAUDE.md) — инструкции для AI-ассистента
- [adolf-docs/](https://github.com/Sign25/Docs) — полная документация

## Ссылки

- **Репозиторий:** https://github.com/Ohana-market-engineering/WebUI_main
- **Документация:** https://github.com/Sign25/Docs
- **Open WebUI:** https://docs.openwebui.com/

---

**Версия:** 1.2.23
**Дата:** Февраль 2026

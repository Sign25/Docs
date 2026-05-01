# ADOLF WAREHOUSE — Раздел 7: Celery

**Проект:** Управление физическим складом  
**Модуль:** Warehouse  
**Версия:** 1.0 (черновик)  
**Дата:** Май 2026

---

## 7.1 Назначение

Описание фоновых задач модуля Warehouse, выполняемых через Celery + Celery Beat.

---

## 7.2 Список задач

| Task | Описание | Расписание |
|------|----------|------------|
| `wh.sync_nomenclature` | Подтягивает обновлённую номенклатуру из 1С | Каждый час |
| `wh.sync_orders_from_1c` | Получает новые заказы клиентов | Каждые 15 минут |
| `wh.submit_to_honest_sign` | Отправляет накопленные операции в Честный Знак (ввод/вывод/перемаркировка) | Каждые 5 минут |
| `wh.push_confirmations_to_1c` | Подтверждения приёмки/отгрузки в 1С | После закрытия документа (event-triggered) |
| `wh.scheduled_inventory_check` | Создаёт wh_inventory_tasks для циклической инвентаризации | Раз в неделю (Пн 22:00) |
| `wh.cleanup_old_qc_media` | Архивирование/удаление старых фото ОТК | Раз в месяц |
| `wh.aggregate_daily_stats` | Агрегация дневной статистики (для дашборда) | Каждый день 23:55 |
| `wh.detect_idle_tsd` | Алерт админу если ТСД офлайн дольше N минут в рабочее время | Каждые 10 минут |
| `wh.alert_low_stock` | Проверка низких остатков и алерт директору | Каждый день 09:00 |

---

## 7.3 Конфигурация (celery beat schedule)

```python
# backend/open_webui/celery_app.py (фрагмент)
CELERY_BEAT_SCHEDULE.update({
    'wh.sync_nomenclature': {
        'task': 'open_webui.tasks.warehouse.sync_nomenclature',
        'schedule': crontab(minute=0),  # каждый час
    },
    'wh.sync_orders_from_1c': {
        'task': 'open_webui.tasks.warehouse.sync_orders_from_1c',
        'schedule': crontab(minute='*/15'),
    },
    'wh.submit_to_honest_sign': {
        'task': 'open_webui.tasks.warehouse.submit_to_honest_sign',
        'schedule': crontab(minute='*/5'),
    },
    'wh.scheduled_inventory_check': {
        'task': 'open_webui.tasks.warehouse.scheduled_inventory_check',
        'schedule': crontab(hour=22, minute=0, day_of_week='mon'),
    },
    'wh.aggregate_daily_stats': {
        'task': 'open_webui.tasks.warehouse.aggregate_daily_stats',
        'schedule': crontab(hour=23, minute=55),
    },
})
```

---

## 7.4 Обработка ошибок и повторы

| Тип ошибки | Стратегия |
|------------|-----------|
| Сеть до 1С недоступна | Retry с exponential backoff (5 попыток за 30 минут), затем алерт админу |
| Честный Знак вернул 5xx | Retry, накапливаем в очереди, синк при восстановлении |
| Конфликт версий (заказ изменился в 1С) | Re-fetch + merge, конфликты — в `wh_sync_conflicts` для ручного разбора |
| Невалидный QR | Логируем, не повторяем |

---

## 7.5 Идемпотентность

Все задачи синка должны быть идемпотентны — поддерживают повторный запуск без побочных эффектов:
- При синке номенклатуры — UPSERT по `external_id`
- При отправке в ЧЗ — проверка `cs_circulation_state` перед запросом
- При подтверждениях в 1С — флаг `confirmed_to_1c` на документе

---

**Дописать:** конкретные Python-сигнатуры, обработка падения брокера, миграция между Celery воркерами.

# ADOLF Office — Celery

> Версия: 1.0 (черновик)  
> Статус: v2.0 (не входит в MVP)  
> Дата: 2025-01-24

## Обзор

Фоновые задачи для модуля Office. Реализация отложена до версии 2.0.

## Задачи

### 1. Автоочистка истории

**Задача:** `office_cleanup_history`

**Расписание:** Ежедневно в 03:00

**Логика:**
- Удаление записей из `office_module_status_history` старше 24 часов

```python
@celery.task
def office_cleanup_history():
    """Удаление устаревших записей истории"""
    cutoff = datetime.utcnow() - timedelta(hours=24)
    deleted = db.execute(
        "DELETE FROM office_module_status_history WHERE recorded_at < %s",
        [cutoff]
    )
    return {"deleted_rows": deleted.rowcount}
```

---

### 2. Проверка heartbeat

**Задача:** `office_check_heartbeat`

**Расписание:** Каждые 5 минут

**Логика:**
- Проверка `last_activity` всех модулей
- Если > 5 минут — установить статус `warning`
- Если > 15 минут — установить статус `error`

```python
@celery.task
def office_check_heartbeat():
    """Проверка активности модулей"""
    now = datetime.utcnow()
    warning_threshold = now - timedelta(minutes=5)
    error_threshold = now - timedelta(minutes=15)
    
    # Warning для неактивных > 5 мин
    db.execute("""
        UPDATE office_module_status 
        SET status = 'warning'
        WHERE last_activity < %s AND status = 'ok'
    """, [warning_threshold])
    
    # Error для неактивных > 15 мин
    db.execute("""
        UPDATE office_module_status 
        SET status = 'error'
        WHERE last_activity < %s AND status != 'error'
    """, [error_threshold])
```

---

### 3. Агрегация метрик

**Задача:** `office_aggregate_metrics`

**Расписание:** Каждый час

**Логика:**
- Сбор почасовой статистики для отчётов
- Сохранение в отдельную таблицу агрегатов

---

### 4. Уведомления о сбоях

**Задача:** `office_notify_errors`

**Расписание:** Реактивная (по событию)

**Логика:**
- При переходе модуля в статус `error`
- Отправка уведомления Administrator

---

## Celery Beat расписание (v2.0)

```python
CELERY_BEAT_SCHEDULE = {
    'office-cleanup-history': {
        'task': 'office_cleanup_history',
        'schedule': crontab(hour=3, minute=0),
    },
    'office-check-heartbeat': {
        'task': 'office_check_heartbeat',
        'schedule': timedelta(minutes=5),
    },
    'office-aggregate-metrics': {
        'task': 'office_aggregate_metrics',
        'schedule': crontab(minute=0),  # каждый час
    },
}
```

## MVP-альтернатива

Для MVP очистка истории выполняется через PostgreSQL:

```sql
-- Cron или pg_cron
DELETE FROM office_module_status_history 
WHERE recorded_at < NOW() - INTERVAL '24 hours';
```

Проверка heartbeat — ответственность клиента (Dashboard показывает иконку 💤 если `last_activity` устарел).

---
title: "Раздел 7: Celery Tasks"
mode: "wide"
---

**Проект:** Финансовая отчётность и аналитика  
**Модуль:** CFO / Celery  
**Версия:** 1.1  
**Дата:** Январь 2026

---

## 7.1 Обзор задач

### Реестр задач

| Задача | Тип | Очередь | Периодичность | Описание |
|--------|-----|---------|---------------|----------|
| `sync_1c_data` | periodic | default | */30 | Синхронизация с 1С |
| `generate_pnl_report` | async | heavy | По запросу | Генерация P&L |
| `calculate_unit_economics` | async | default | По запросу | Unit-экономика |
| `export_to_excel` | async | export | По запросу | Экспорт в Excel |
| `cleanup_old_reports` | periodic | default | 03:00 | Очистка старых отчётов |
| `office_heartbeat` | periodic | default | */1 | Статус в Office Dashboard |

---

## 7.2 Celery Beat Schedule

```python
from celery.schedules import crontab

beat_schedule = {
    "cfo-sync-1c": {
        "task": "cfo.tasks.sync_1c_data",
        "schedule": crontab(minute="*/30"),
        "options": {"queue": "default"}
    },
    "cfo-cleanup": {
        "task": "cfo.tasks.cleanup_old_reports",
        "schedule": crontab(hour=3, minute=0),
        "options": {"queue": "default"}
    },
    "cfo-office-heartbeat": {
        "task": "cfo.tasks.office_heartbeat",
        "schedule": 60.0,
        "options": {"queue": "default"}
    },
}
```

---

## 7.3 Основные задачи

### sync_1c_data

```python
from celery import shared_task
from app.utils.office_reporter import OfficeReporter

reporter = OfficeReporter(
    agent_id="cfo_report",
    department="cfo",
    name="Отчёт P&L",
    salary_equivalent=80000,
    fte_coefficient=1.0
)

@shared_task(name='cfo.tasks.sync_1c_data')
def sync_1c_data():
    """Синхронизация данных из 1С."""
    
    reporter.report_working("Синхронизация с 1С")
    
    try:
        # ... логика синхронизации ...
        records_synced = fetch_1c_data()
        
        reporter.report_idle(metrics={
            "reports_generated_today": get_daily_reports_count(),
            "last_sync": datetime.utcnow().isoformat()
        })
        
        return {"success": True, "synced": records_synced}
        
    except Exception as e:
        reporter.report_error(f"1C sync: {e}")
        raise
```

### generate_pnl_report

```python
@shared_task(
    name='cfo.tasks.generate_pnl_report',
    bind=True,
    time_limit=600
)
def generate_pnl_report(self, period: str, brand: str):
    """Генерация отчёта P&L."""
    
    reporter.report_working(f"Генерация P&L за {period}")
    
    try:
        # ... логика генерации ...
        report = build_pnl_report(period, brand)
        
        reporter.report_idle(metrics={
            "reports_generated_today": get_daily_reports_count()
        })
        
        return {"success": True, "report_id": report.id}
        
    except Exception as e:
        reporter.report_error(f"P&L generation: {e}")
        raise
```

---

## 7.4 Интеграция с Office Dashboard

### Агент CFO

| agent_id | name | salary_equivalent | fte_coefficient |
|----------|------|-------------------|-----------------|
| cfo_report | Отчёт P&L | 80000 | 1.0 |

### Инициализация репортера

```python
# app/tasks/cfo/office.py

from app.utils.office_reporter import OfficeReporter

OFFICE_REPORTER = OfficeReporter(
    agent_id="cfo_report",
    department="cfo",
    name="Отчёт P&L",
    salary_equivalent=80000,
    fte_coefficient=1.0
)
```

### Heartbeat задача

```python
@shared_task(name='cfo.tasks.office_heartbeat')
def office_heartbeat():
    OFFICE_REPORTER.heartbeat()
    return {"success": True}
```

### Метрики для Office

| Метрика | Описание |
|---------|----------|
| reports_generated_today | Отчётов сгенерировано за день |
| last_sync | Время последней синхронизации с 1С |

---

**Документ подготовлен:** Январь 2026  
**Версия:** 1.1  
**Статус:** Черновик

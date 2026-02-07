---
title: "Раздел 8: Celery Tasks"
mode: "wide"
---

**Проект:** Мониторинг правовых изменений  
**Модуль:** Lex / Celery  
**Версия:** 1.0  
**Дата:** Январь 2026

---

## 8.1 Обзор задач

### Реестр задач

| Задача | Тип | Очередь | Периодичность | Описание |
|--------|-----|---------|---------------|----------|
| `check_legal_updates` | periodic | default | 08:00 | Проверка обновлений законодательства |
| `analyze_document` | async | heavy | По событию | AI-анализ документа |
| `send_legal_digest` | periodic | default | Понедельник 09:00 | Еженедельный дайджест |
| `cleanup_old_alerts` | periodic | default | 03:00 | Очистка старых алертов |
| `office_heartbeat` | periodic | default | */1 | Статус в Office Dashboard |

---

## 8.2 Celery Beat Schedule

```python
from celery.schedules import crontab

beat_schedule = {
    "lex-check-updates": {
        "task": "lex.tasks.check_legal_updates",
        "schedule": crontab(hour=8, minute=0),
        "options": {"queue": "default"}
    },
    "lex-weekly-digest": {
        "task": "lex.tasks.send_legal_digest",
        "schedule": crontab(day_of_week=1, hour=9, minute=0),
        "options": {"queue": "default"}
    },
    "lex-cleanup": {
        "task": "lex.tasks.cleanup_old_alerts",
        "schedule": crontab(hour=3, minute=0),
        "options": {"queue": "default"}
    },
    "lex-office-heartbeat": {
        "task": "lex.tasks.office_heartbeat",
        "schedule": 60.0,
        "options": {"queue": "default"}
    },
}
```

---

## 8.3 Основные задачи

### check_legal_updates

```python
from celery import shared_task
from app.utils.office_reporter import OfficeReporter

reporter = OfficeReporter(
    agent_id="lex_monitor",
    department="lex",
    name="Правовой мониторинг",
    salary_equivalent=70000,
    fte_coefficient=1.0
)

@shared_task(name='lex.tasks.check_legal_updates')
def check_legal_updates():
    """Проверка обновлений законодательства."""
    
    reporter.report_working("Проверка правовых обновлений")
    
    try:
        # ... логика проверки ...
        changes = fetch_legal_changes()
        
        if changes:
            for change in changes:
                analyze_document.delay(change.document_id)
        
        reporter.report_idle(metrics={
            "documents_monitored": get_monitored_count(),
            "changes_detected_today": len(changes)
        })
        
        return {"success": True, "changes": len(changes)}
        
    except Exception as e:
        reporter.report_error(f"Legal check: {e}")
        raise
```

### analyze_document

```python
@shared_task(
    name='lex.tasks.analyze_document',
    bind=True,
    max_retries=2,
    time_limit=300
)
def analyze_document(self, document_id: str):
    """AI-анализ правового документа."""
    
    reporter.report_working(f"Анализ документа {document_id[:8]}...")
    
    try:
        # ... AI-анализ ...
        analysis = run_legal_analysis(document_id)
        
        if analysis.is_critical:
            send_alert.delay(analysis.id)
        
        reporter.report_idle(metrics={
            "documents_monitored": get_monitored_count(),
            "changes_detected_today": get_daily_changes()
        })
        
        return {"success": True, "analysis_id": analysis.id}
        
    except Exception as e:
        reporter.report_error(f"Document analysis: {e}")
        raise self.retry(exc=e)
```

---

## 8.4 Интеграция с Office Dashboard

### Агент Lex

| agent_id | name | salary_equivalent | fte_coefficient |
|----------|------|-------------------|-----------------|
| lex_monitor | Правовой мониторинг | 70000 | 1.0 |

### Инициализация репортера

```python
# app/tasks/lex/office.py

from app.utils.office_reporter import OfficeReporter

OFFICE_REPORTER = OfficeReporter(
    agent_id="lex_monitor",
    department="lex",
    name="Правовой мониторинг",
    salary_equivalent=70000,
    fte_coefficient=1.0
)
```

### Heartbeat задача

```python
@shared_task(name='lex.tasks.office_heartbeat')
def office_heartbeat():
    OFFICE_REPORTER.heartbeat()
    return {"success": True}
```

### Метрики для Office

| Метрика | Описание |
|---------|----------|
| documents_monitored | Документов на мониторинге |
| changes_detected_today | Изменений обнаружено за день |

---

**Документ подготовлен:** Январь 2026  
**Версия:** 1.0  
**Статус:** Черновик

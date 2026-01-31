# ADOLF SCOUT — Раздел 7: Celery

**Проект:** Предиктивная аналитика товарных ниш  
**Модуль:** Scout / Celery  
**Версия:** 1.1  
**Дата:** Январь 2026

---

## 7.1 Обзор задач

### Реестр задач

| Задача | Тип | Очередь | Периодичность | Описание |
|--------|-----|---------|---------------|----------|
| `update_trend_data` | periodic | default | 06:00 | Обновление трендов |
| `analyze_niche` | async | heavy | По запросу | Анализ ниши |
| `calculate_opportunity_score` | async | default | По событию | Расчёт оценки |
| `export_report` | async | export | По запросу | Экспорт отчёта |
| `cleanup_old_analyses` | periodic | default | 03:00 | Очистка старых данных |
| `office_heartbeat` | periodic | default | */1 | Статус в Office Dashboard |

---

## 7.2 Celery Beat Schedule

```python
from celery.schedules import crontab

beat_schedule = {
    "scout-update-trends": {
        "task": "scout.tasks.update_trend_data",
        "schedule": crontab(hour=6, minute=0),
        "options": {"queue": "default"}
    },
    "scout-cleanup": {
        "task": "scout.tasks.cleanup_old_analyses",
        "schedule": crontab(hour=3, minute=0),
        "options": {"queue": "default"}
    },
    "scout-office-heartbeat": {
        "task": "scout.tasks.office_heartbeat",
        "schedule": 60.0,
        "options": {"queue": "default"}
    },
}
```

---

## 7.3 Основные задачи

### update_trend_data

```python
from celery import shared_task
from app.utils.office_reporter import OfficeReporter

reporter = OfficeReporter(
    agent_id="scout_niche",
    department="scout",
    name="Анализ ниш",
    salary_equivalent=70000,
    fte_coefficient=1.0
)

@shared_task(name='scout.tasks.update_trend_data')
def update_trend_data():
    """Обновление данных трендов."""
    
    reporter.report_working("Обновление данных трендов")
    
    try:
        # ... логика обновления ...
        trends_updated = fetch_and_update_trends()
        
        reporter.report_idle(metrics={
            "trends_updated": trends_updated,
            "last_update": datetime.utcnow().isoformat()
        })
        
        return {"success": True, "updated": trends_updated}
        
    except Exception as e:
        reporter.report_error(str(e))
        raise
```

### analyze_niche

```python
@shared_task(
    name='scout.tasks.analyze_niche',
    bind=True,
    max_retries=2,
    time_limit=300
)
def analyze_niche(self, niche_id: str, params: dict):
    """Глубокий анализ товарной ниши."""
    
    reporter.report_working(f"Анализ ниши {niche_id}")
    
    try:
        # ... AI-анализ ...
        result = run_niche_analysis(niche_id, params)
        
        reporter.report_idle(metrics={
            "niches_analyzed_today": get_daily_count(),
            "opportunities_found": result.opportunities_count
        })
        
        return result.to_dict()
        
    except Exception as e:
        reporter.report_error(f"Анализ ниши: {e}")
        raise self.retry(exc=e)
```

---

## 7.4 Интеграция с Office Dashboard

### Агент Scout

| agent_id | name | salary_equivalent | fte_coefficient |
|----------|------|-------------------|-----------------|
| scout_niche | Анализ ниш | 70000 | 1.0 |

### Инициализация репортера

```python
# app/tasks/scout/office.py

from app.utils.office_reporter import OfficeReporter

OFFICE_REPORTER = OfficeReporter(
    agent_id="scout_niche",
    department="scout",
    name="Анализ ниш",
    salary_equivalent=70000,
    fte_coefficient=1.0
)
```

### Heartbeat задача

```python
@shared_task(name='scout.tasks.office_heartbeat')
def office_heartbeat():
    OFFICE_REPORTER.heartbeat()
    return {"success": True}
```

### Метрики для Office

| Метрика | Описание |
|---------|----------|
| niches_analyzed_today | Проанализировано ниш за день |
| opportunities_found | Найдено возможностей |
| trends_updated | Обновлено трендов |

---

**Документ подготовлен:** Январь 2026  
**Версия:** 1.1  
**Статус:** Черновик

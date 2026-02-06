---
title: "Раздел 9: Celery Tasks"
mode: "wide"
---

**Проект:** Корпоративная база знаний с RAG  
**Модуль:** Knowledge / Celery  
**Версия:** 1.0  
**Дата:** Январь 2026

---

## 8.1 Обзор задач

### Реестр задач

| Задача | Тип | Очередь | Периодичность | Описание |
|--------|-----|---------|---------------|----------|
| `index_documents` | async | heavy | По событию | Индексация документов |
| `reindex_all` | periodic | heavy | Воскресенье 02:00 | Полная переиндексация |
| `cleanup_orphan_chunks` | periodic | default | 04:00 | Очистка осиротевших чанков |
| `sync_external_sources` | periodic | default | */60 | Синхронизация внешних источников |
| `office_heartbeat` | periodic | default | */1 | Статус в Office Dashboard |

---

## 8.2 Celery Beat Schedule

```python
from celery.schedules import crontab

beat_schedule = {
    "knowledge-reindex-weekly": {
        "task": "knowledge.tasks.reindex_all",
        "schedule": crontab(day_of_week=0, hour=2, minute=0),
        "options": {"queue": "heavy"}
    },
    "knowledge-cleanup": {
        "task": "knowledge.tasks.cleanup_orphan_chunks",
        "schedule": crontab(hour=4, minute=0),
        "options": {"queue": "default"}
    },
    "knowledge-sync-external": {
        "task": "knowledge.tasks.sync_external_sources",
        "schedule": crontab(minute=0),
        "options": {"queue": "default"}
    },
    "knowledge-office-heartbeat": {
        "task": "knowledge.tasks.office_heartbeat",
        "schedule": 60.0,
        "options": {"queue": "default"}
    },
}
```

---

## 8.3 Основные задачи

### index_documents

```python
from celery import shared_task
from app.utils.office_reporter import OfficeReporter

reporter = OfficeReporter(
    agent_id="knowledge_rag",
    department="knowledge",
    name="RAG процессор",
    salary_equivalent=60000,
    fte_coefficient=1.0
)

@shared_task(
    name='knowledge.tasks.index_documents',
    bind=True,
    max_retries=2
)
def index_documents(self, document_ids: list):
    """Индексация документов для RAG."""
    
    reporter.report_working(f"Индексация {len(document_ids)} документов")
    
    try:
        # ... логика индексации ...
        indexed = process_documents(document_ids)
        
        reporter.report_idle(metrics={
            "docs_indexed": get_total_docs(),
            "chunks_count": get_total_chunks(),
            "rag_queries_today": get_daily_queries()
        })
        
        return {"success": True, "indexed": len(indexed)}
        
    except Exception as e:
        reporter.report_error(f"Indexing: {e}")
        raise self.retry(exc=e)
```

### sync_external_sources

```python
@shared_task(name='knowledge.tasks.sync_external_sources')
def sync_external_sources():
    """Синхронизация внешних источников (Confluence, Google Docs)."""
    
    reporter.report_working("Синхронизация внешних источников")
    
    try:
        # ... логика синхронизации ...
        new_docs = fetch_external_sources()
        
        if new_docs:
            index_documents.delay([d.id for d in new_docs])
        
        reporter.report_idle(metrics={
            "docs_indexed": get_total_docs(),
            "rag_queries_today": get_daily_queries()
        })
        
        return {"success": True, "new_docs": len(new_docs)}
        
    except Exception as e:
        reporter.report_error(f"External sync: {e}")
        raise
```

---

## 8.4 Интеграция с Office Dashboard

### Агент Knowledge

| agent_id | name | salary_equivalent | fte_coefficient |
|----------|------|-------------------|-----------------|
| knowledge_rag | RAG процессор | 60000 | 1.0 |

### Инициализация репортера

```python
# app/tasks/knowledge/office.py

from app.utils.office_reporter import OfficeReporter

OFFICE_REPORTER = OfficeReporter(
    agent_id="knowledge_rag",
    department="knowledge",
    name="RAG процессор",
    salary_equivalent=60000,
    fte_coefficient=1.0
)
```

### Heartbeat задача

```python
@shared_task(name='knowledge.tasks.office_heartbeat')
def office_heartbeat():
    OFFICE_REPORTER.heartbeat()
    return {"success": True}
```

### Метрики для Office

| Метрика | Описание |
|---------|----------|
| docs_indexed | Документов в базе |
| chunks_count | Чанков для RAG |
| rag_queries_today | RAG-запросов за день |

---

**Документ подготовлен:** Январь 2026  
**Версия:** 1.0  
**Статус:** Черновик

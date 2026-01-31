# ADOLF Office — Интеграция модулей

> Версия: 1.0  
> Статус: MVP  
> Дата: 2025-01-31

## Обзор

Для отображения агентов в Office Dashboard, каждый модуль должен отправлять статус своих агентов в таблицу `office_agent_status`.

## Требования к модулям

Каждый модуль ADOLF должен:

1. **При старте агента** — зарегистрировать агента в Office
2. **При изменении статуса** — обновить запись
3. **Периодически (heartbeat)** — обновлять `last_activity`
4. **При ошибке** — установить `status: error`

## Утилита OfficeReporter

### Установка

Добавить в `app/utils/office_reporter.py`:

```python
# app/utils/office_reporter.py

from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.core.database import get_db_session


class OfficeReporter:
    """
    Утилита для отправки статуса агента в Office Dashboard.
    
    Использование:
        reporter = OfficeReporter(
            agent_id="watcher_price_monitor",
            department="watcher",
            name="Мониторинг цен",
            salary_equivalent=60000,
            fte_coefficient=1.0
        )
        
        reporter.report_working("Сканирование цен", {"products_scanned": 100})
        reporter.report_idle()
        reporter.report_error("API timeout")
        reporter.heartbeat()
    """
    
    def __init__(
        self,
        agent_id: str,
        department: str,
        name: str,
        brand: Optional[str] = None,
        salary_equivalent: int = 60000,
        fte_coefficient: float = 1.0
    ):
        self.agent_id = agent_id
        self.department = department
        self.name = name
        self.brand = brand
        self.salary_equivalent = salary_equivalent
        self.fte_coefficient = fte_coefficient
    
    def _upsert(
        self,
        db: Session,
        status: str,
        task: Optional[str] = None,
        metrics: Optional[Dict[str, Any]] = None
    ):
        """UPSERT статуса в office_agent_status."""
        
        stmt = insert(OfficeAgentStatus).values(
            agent_id=self.agent_id,
            department=self.department,
            name=self.name,
            brand=self.brand,
            status=status,
            task=task,
            metrics=metrics or {},
            salary_equivalent=self.salary_equivalent,
            fte_coefficient=self.fte_coefficient,
            last_activity=datetime.utcnow(),
            updated_at=datetime.utcnow()
        ).on_conflict_do_update(
            index_elements=['agent_id'],
            set_={
                'status': status,
                'task': task,
                'metrics': metrics or {},
                'last_activity': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
        )
        
        db.execute(stmt)
        db.commit()
    
    def report_working(
        self,
        task: str,
        metrics: Optional[Dict[str, Any]] = None,
        db: Optional[Session] = None
    ):
        """Статус: работает над задачей."""
        if db is None:
            with get_db_session() as db:
                self._upsert(db, status="ok", task=task, metrics=metrics)
        else:
            self._upsert(db, status="ok", task=task, metrics=metrics)
    
    def report_idle(
        self,
        metrics: Optional[Dict[str, Any]] = None,
        db: Optional[Session] = None
    ):
        """Статус: ожидает задачу."""
        if db is None:
            with get_db_session() as db:
                self._upsert(db, status="ok", task=None, metrics=metrics)
        else:
            self._upsert(db, status="ok", task=None, metrics=metrics)
    
    def report_warning(
        self,
        task: str,
        metrics: Optional[Dict[str, Any]] = None,
        db: Optional[Session] = None
    ):
        """Статус: требует внимания."""
        if db is None:
            with get_db_session() as db:
                self._upsert(db, status="warning", task=task, metrics=metrics)
        else:
            self._upsert(db, status="warning", task=task, metrics=metrics)
    
    def report_error(
        self,
        error_message: str,
        metrics: Optional[Dict[str, Any]] = None,
        db: Optional[Session] = None
    ):
        """Статус: ошибка."""
        if db is None:
            with get_db_session() as db:
                self._upsert(db, status="error", task=f"Ошибка: {error_message}", metrics=metrics)
        else:
            self._upsert(db, status="error", task=f"Ошибка: {error_message}", metrics=metrics)
    
    def report_offline(self, db: Optional[Session] = None):
        """Статус: не в сети."""
        if db is None:
            with get_db_session() as db:
                self._upsert(db, status="offline", task=None, metrics={})
        else:
            self._upsert(db, status="offline", task=None, metrics={})
    
    def heartbeat(self, db: Optional[Session] = None):
        """Обновление last_activity без изменения статуса."""
        if db is None:
            with get_db_session() as db:
                db.execute(
                    "UPDATE office_agent_status SET last_activity = NOW(), updated_at = NOW() WHERE agent_id = :agent_id",
                    {"agent_id": self.agent_id}
                )
                db.commit()
        else:
            db.execute(
                "UPDATE office_agent_status SET last_activity = NOW(), updated_at = NOW() WHERE agent_id = :agent_id",
                {"agent_id": self.agent_id}
            )
            db.commit()
```

### Модель SQLAlchemy

```python
# app/models/office.py

from sqlalchemy import Column, Integer, String, DateTime, Numeric, Enum
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
import enum

from app.core.database import Base


class AgentStatus(enum.Enum):
    ok = "ok"
    warning = "warning"
    error = "error"
    offline = "offline"


class OfficeAgentStatus(Base):
    __tablename__ = "office_agent_status"
    
    id = Column(Integer, primary_key=True)
    agent_id = Column(String(100), unique=True, nullable=False, index=True)
    department = Column(String(50), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    brand = Column(String(20), index=True)
    status = Column(Enum(AgentStatus), nullable=False, default=AgentStatus.ok)
    last_activity = Column(DateTime(timezone=True))
    task = Column(String(255))
    metrics = Column(JSONB, default={})
    salary_equivalent = Column(Integer, default=60000)
    fte_coefficient = Column(Numeric(3, 2), default=1.0)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
```

## Примеры интеграции

### Модуль Watcher

```python
# app/tasks/watcher/polling.py

from app.utils.office_reporter import OfficeReporter

# Инициализация репортера
reporter = OfficeReporter(
    agent_id="watcher_price_monitor",
    department="watcher",
    name="Мониторинг цен",
    brand="ohana_market",
    salary_equivalent=60000,
    fte_coefficient=1.0
)

@shared_task
def poll_prices():
    try:
        # Начало работы
        reporter.report_working("Сканирование цен конкурентов")
        
        # ... логика задачи ...
        products_scanned = 150
        price_changes = 12
        
        # Завершение с метриками
        reporter.report_idle(metrics={
            "products_scanned": products_scanned,
            "price_changes": price_changes
        })
        
    except Exception as e:
        reporter.report_error(str(e))
        raise
```

### Модуль Reputation

```python
# app/tasks/reputation/process.py

from app.utils.office_reporter import OfficeReporter

wb_reporter = OfficeReporter(
    agent_id="reputation_wb",
    department="reputation",
    name="WB отзывы",
    brand="ohana_market"
)

ozon_reporter = OfficeReporter(
    agent_id="reputation_ozon",
    department="reputation",
    name="Ozon отзывы",
    brand="ohana_market"
)

@shared_task
def process_wb_reviews():
    try:
        wb_reporter.report_working("Обработка отзывов Wildberries")
        
        # ... логика ...
        reviews_processed = 47
        
        wb_reporter.report_idle(metrics={
            "reviews_today": reviews_processed,
            "avg_response_min": 12
        })
        
    except APIError as e:
        wb_reporter.report_error(f"API timeout: {e}")
        raise
```

### Модуль Content Factory

```python
# app/tasks/content_factory/generate.py

from app.utils.office_reporter import OfficeReporter

reporter = OfficeReporter(
    agent_id="content_descriptions",
    department="content_factory",
    name="Генератор описаний"
)

@shared_task
def generate_descriptions():
    reporter.report_working("Генерация описаний товаров")
    
    # ... логика ...
    
    reporter.report_idle(metrics={
        "descriptions_today": 156,
        "queue_size": 23
    })
```

## Heartbeat задача

Для автоматического heartbeat добавить Celery Beat задачу:

```python
# celery_config.py

beat_schedule = {
    # ... другие задачи ...
    
    "office-heartbeat": {
        "task": "app.tasks.common.office_heartbeat",
        "schedule": 60.0,  # Каждые 60 секунд
        "options": {"queue": "default"}
    },
}
```

```python
# app/tasks/common.py

from app.utils.office_reporter import OfficeReporter

# Реестр всех репортеров модуля
REPORTERS = [
    OfficeReporter("watcher_price_monitor", "watcher", "Мониторинг цен"),
    OfficeReporter("reputation_wb", "reputation", "WB отзывы"),
    # ... добавить все агенты ...
]

@shared_task
def office_heartbeat():
    """Массовый heartbeat всех агентов."""
    for reporter in REPORTERS:
        reporter.heartbeat()
```

## Проверка offline агентов

Office Dashboard автоматически определяет offline агентов по `last_activity > 5 минут`.

Для принудительной установки offline при shutdown:

```python
# app/main.py

import atexit
from app.utils.office_reporter import OfficeReporter

reporters = [...]  # Список репортеров

def shutdown_handler():
    for reporter in reporters:
        reporter.report_offline()

atexit.register(shutdown_handler)
```

## Checklist интеграции модуля

- [ ] Добавить `OfficeReporter` в `app/utils/`
- [ ] Добавить модель `OfficeAgentStatus` в `app/models/`
- [ ] Создать репортеры для каждого агента модуля
- [ ] Добавить `report_working()` в начало задач
- [ ] Добавить `report_idle()` с метриками в конец задач
- [ ] Добавить `report_error()` в exception handler
- [ ] Добавить heartbeat задачу в Celery Beat
- [ ] Протестировать отображение в Office Dashboard

## Модули для интеграции

| Модуль | Агенты | Статус интеграции |
|--------|--------|-------------------|
| Watcher | watcher_price_monitor, watcher_night_agent, watcher_competitor_scan | ⏳ TODO |
| Reputation | reputation_wb, reputation_ozon, reputation_ym | ⏳ TODO |
| Content Factory | content_descriptions, content_seo | ⏳ TODO |
| Marketing | marketing_wb, marketing_ozon | ⏳ TODO |
| Scout | scout_niche | ⏳ TODO |
| CFO | cfo_report | ⏳ TODO |
| Knowledge | knowledge_rag | ⏳ TODO |
| Lex | lex_monitor | ⏳ TODO |

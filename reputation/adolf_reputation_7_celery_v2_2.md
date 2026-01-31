# ADOLF REPUTATION — Раздел 7: Celery Tasks

**Проект:** Интеллектуальная система управления репутацией  
**Модуль:** Reputation / Celery  
**Версия:** 2.2  
**Дата:** Январь 2026

---

## 7.1 Обзор задач

### Реестр задач модуля Reputation

| Задача | Тип | Очередь | Периодичность | Описание |
|--------|-----|---------|---------------|----------|
| `poll_wb_reviews` | periodic | default | */5 :00 | Polling отзывов WB |
| `poll_wb_questions` | periodic | default | */5 :50 | Polling вопросов WB |
| `poll_ozon_reviews` | periodic | default | */5 1:40 | Polling отзывов Ozon |
| `poll_ozon_questions` | periodic | default | */5 2:30 | Polling вопросов Ozon |
| `poll_ym_reviews` | periodic | default | */5 3:20 | Polling отзывов YM |
| `poll_ym_questions` | periodic | default | */5 4:10 | Polling вопросов YM |
| `analyze_item` | async | default | По событию | AI-анализ item |
| `generate_response` | async | default | По событию | Генерация ответа |
| `regenerate_response` | async | default | По запросу | Перегенерация |
| `send_response` | async | default | По событию | Публикация ответа |
| `retry_failed_publish` | periodic | default | Каждый час | Повтор failed |
| `calculate_daily_analytics` | periodic | default | 01:00 | Расчёт аналитики |
| `archive_old_items` | periodic | default | 02:00 | Архивация |
| `office_heartbeat` | periodic | default | */1 | Статус в Office Dashboard |

---

## 7.2 Celery Beat Schedule

```python
# celery_config.py
from celery.schedules import crontab

beat_schedule = {
    # ===== POLLING (распределённое расписание) =====
    
    # Wildberries Reviews: */5 :00
    "poll-wb-reviews": {
        "task": "tasks.reputation_tasks.poll_wb_reviews",
        "schedule": crontab(minute="*/5"),
        "options": {"queue": "default"}
    },
    # Wildberries Questions: */5 :50
    "poll-wb-questions": {
        "task": "tasks.reputation_tasks.poll_wb_questions",
        "schedule": crontab(minute="*/5"),
        "options": {"queue": "default", "countdown": 50}
    },
    
    # Ozon Reviews: */5 1:40
    "poll-ozon-reviews": {
        "task": "tasks.reputation_tasks.poll_ozon_reviews",
        "schedule": crontab(minute="*/5"),
        "options": {"queue": "default", "countdown": 100}
    },
    # Ozon Questions: */5 2:30
    "poll-ozon-questions": {
        "task": "tasks.reputation_tasks.poll_ozon_questions",
        "schedule": crontab(minute="*/5"),
        "options": {"queue": "default", "countdown": 150}
    },
    
    # Яндекс.Маркет Reviews: */5 3:20
    "poll-ym-reviews": {
        "task": "tasks.reputation_tasks.poll_ym_reviews",
        "schedule": crontab(minute="*/5"),
        "options": {"queue": "default", "countdown": 200}
    },
    # Яндекс.Маркет Questions: */5 4:10
    "poll-ym-questions": {
        "task": "tasks.reputation_tasks.poll_ym_questions",
        "schedule": crontab(minute="*/5"),
        "options": {"queue": "default", "countdown": 250}
    },
    
    # ===== СЛУЖЕБНЫЕ ЗАДАЧИ =====
    
    # Повтор failed публикаций (каждый час)
    "retry-failed-publish": {
        "task": "tasks.reputation_tasks.retry_failed_publish",
        "schedule": crontab(minute=0),
        "options": {"queue": "default"}
    },
    
    # Расчёт аналитики (01:00 ежедневно)
    "calculate-daily-analytics": {
        "task": "tasks.reputation_tasks.calculate_daily_analytics",
        "schedule": crontab(hour=1, minute=0),
        "options": {"queue": "default"}
    },
    
    # Архивация старых записей (02:00 ежедневно)
    "archive-old-items": {
        "task": "tasks.reputation_tasks.archive_old_items",
        "schedule": crontab(hour=2, minute=0),
        "options": {"queue": "default"}
    },
}
```

---

## 7.3 Реализация задач

### Polling Tasks

```python
# tasks/reputation_tasks.py
from celery import shared_task
from services.polling import PollService
from services.circuit_breaker import CircuitBreaker

@shared_task(name="tasks.reputation_tasks.poll_wb_reviews", bind=True, max_retries=3)
def poll_wb_reviews(self):
    """Polling отзывов Wildberries."""
    return _poll_items(self, platform="wb", item_type="review")

@shared_task(name="tasks.reputation_tasks.poll_wb_questions", bind=True, max_retries=3)
def poll_wb_questions(self):
    """Polling вопросов Wildberries."""
    return _poll_items(self, platform="wb", item_type="question")

@shared_task(name="tasks.reputation_tasks.poll_ozon_reviews", bind=True, max_retries=3)
def poll_ozon_reviews(self):
    """Polling отзывов Ozon."""
    return _poll_items(self, platform="ozon", item_type="review")

@shared_task(name="tasks.reputation_tasks.poll_ozon_questions", bind=True, max_retries=3)
def poll_ozon_questions(self):
    """Polling вопросов Ozon."""
    return _poll_items(self, platform="ozon", item_type="question")

@shared_task(name="tasks.reputation_tasks.poll_ym_reviews", bind=True, max_retries=3)
def poll_ym_reviews(self):
    """Polling отзывов Яндекс.Маркет."""
    return _poll_items(self, platform="ym", item_type="review")

@shared_task(name="tasks.reputation_tasks.poll_ym_questions", bind=True, max_retries=3)
def poll_ym_questions(self):
    """Polling вопросов Яндекс.Маркет."""
    return _poll_items(self, platform="ym", item_type="question")


def _poll_items(task, platform: str, item_type: str) -> dict:
    """Общая логика polling."""
    circuit_breaker = CircuitBreaker()
    
    # Проверка circuit breaker
    state = circuit_breaker.get_state(platform, item_type)
    if state == CircuitState.OPEN:
        return {"status": "circuit_open", "platform": platform}
    
    try:
        poll_service = PollService(platform=platform, item_type=item_type)
        result = poll_service.poll()
        
        circuit_breaker.record_success(platform, item_type)
        
        # Запуск анализа для новых items
        for item_id in result["new_item_ids"]:
            analyze_item.delay(item_id)
        
        return {
            "status": "success",
            "platform": platform,
            "item_type": item_type,
            "fetched": result["fetched"],
            "new": result["new"],
            "duplicates": result["duplicates"]
        }
        
    except Exception as e:
        circuit_breaker.record_failure(platform, item_type, str(e))
        raise task.retry(exc=e, countdown=60)
```

### AI Tasks

```python
@shared_task(name="tasks.reputation_tasks.analyze_item", bind=True, max_retries=3)
def analyze_item(self, item_id: int):
    """AI-анализ отзыва/вопроса."""
    from services.ai_pipeline import AIPipeline
    
    try:
        pipeline = AIPipeline()
        result = pipeline.analyze(item_id)
        
        # Запуск генерации ответа
        generate_response.delay(item_id)
        
        return {"status": "analyzed", "item_id": item_id}
        
    except Exception as e:
        raise self.retry(exc=e, countdown=60)


@shared_task(name="tasks.reputation_tasks.generate_response", bind=True, max_retries=3)
def generate_response(self, item_id: int, instructions: str = None):
    """Генерация ответа на отзыв/вопрос."""
    from services.response_generator import ResponseGenerator
    
    try:
        generator = ResponseGenerator()
        result = generator.generate(item_id, instructions=instructions)
        
        return {"status": "generated", "item_id": item_id}
        
    except Exception as e:
        raise self.retry(exc=e, countdown=60)


@shared_task(name="tasks.reputation_tasks.regenerate_response", bind=True, max_retries=3)
def regenerate_response(self, item_id: int, instructions: str):
    """Перегенерация ответа с инструкциями."""
    return generate_response(item_id, instructions=instructions)
```

### Publishing Tasks

```python
@shared_task(name="tasks.reputation_tasks.send_response", bind=True, max_retries=3)
def send_response(self, item_id: int):
    """Публикация ответа на маркетплейс."""
    from services.publisher import ResponsePublisher
    
    with get_db_session() as db:
        item = db.query(ReputationItem).get(item_id)
        response = item.response
        
        try:
            publisher = ResponsePublisher(platform=item.platform)
            success = publisher.publish(
                external_id=item.external_id,
                text=response.final_text or response.draft_text,
                item_type=item.item_type
            )
            
            if success:
                response.status = 'published'
                response.published_at = datetime.utcnow()
                item.status = 'published'
                item.published_at = datetime.utcnow()
            else:
                raise Exception("Publish failed")
                
            db.commit()
            return {"status": "published", "item_id": item_id}
            
        except Exception as e:
            response.status = 'failed'
            response.publish_error = str(e)
            response.publish_retry_count += 1
            db.commit()
            
            raise self.retry(exc=e, countdown=300)


@shared_task(name="tasks.reputation_tasks.retry_failed_publish")
def retry_failed_publish():
    """Повторная попытка публикации failed ответов."""
    with get_db_session() as db:
        failed_responses = db.query(ReputationResponse).filter(
            ReputationResponse.status == 'failed',
            ReputationResponse.publish_retry_count < 5
        ).all()
        
        for response in failed_responses:
            send_response.delay(response.item_id)
        
        return {"status": "ok", "retried": len(failed_responses)}
```

### Служебные Tasks

```python
@shared_task(name="tasks.reputation_tasks.calculate_daily_analytics")
def calculate_daily_analytics():
    """Расчёт ежедневной аналитики."""
    with get_db_session() as db:
        yesterday = date.today() - timedelta(days=1)
        
        # Расчёт по платформам и брендам
        for platform in ['wb', 'ozon', 'ym']:
            for brand_id in ['ohana_market', 'ohana_kids']:
                stats = db.execute(text("""
                    SELECT 
                        COUNT(*) as total,
                        COUNT(*) FILTER (WHERE item_type = 'review') as reviews,
                        COUNT(*) FILTER (WHERE item_type = 'question') as questions,
                        COUNT(*) FILTER (WHERE ai_analysis->>'sentiment' = 'positive') as positive,
                        COUNT(*) FILTER (WHERE ai_analysis->>'sentiment' = 'negative') as negative,
                        AVG(rating) as avg_rating,
                        COUNT(*) FILTER (WHERE status = 'published') as published
                    FROM reputation_items
                    WHERE DATE(created_at) = :date
                      AND platform = :platform
                      AND brand_id = :brand_id
                """), {"date": yesterday, "platform": platform, "brand_id": brand_id}).first()
                
                if stats.total > 0:
                    analytics = ReputationAnalytics(
                        date=yesterday,
                        platform=platform,
                        brand_id=brand_id,
                        total_items=stats.total,
                        reviews_count=stats.reviews,
                        questions_count=stats.questions,
                        positive_count=stats.positive,
                        negative_count=stats.negative,
                        avg_rating=stats.avg_rating,
                        published_count=stats.published
                    )
                    db.merge(analytics)
        
        db.commit()
        return {"status": "ok", "date": str(yesterday)}


@shared_task(name="tasks.reputation_tasks.archive_old_items")
def archive_old_items():
    """Архивация записей старше 12 месяцев."""
    with get_db_session() as db:
        cutoff = datetime.utcnow() - timedelta(days=365)
        
        result = db.execute(text("""
            WITH archived AS (
                DELETE FROM reputation_items
                WHERE created_at < :cutoff
                  AND status IN ('published', 'skipped')
                RETURNING *
            )
            INSERT INTO reputation_items_archive
            SELECT * FROM archived
        """), {"cutoff": cutoff})
        
        db.commit()
        return {"status": "ok", "archived": result.rowcount}
```

---

## 7.4 Конфигурация

### Celery Config

```python
# celery_config.py

# Брокер и бэкенд
broker_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
result_backend = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Сериализация
task_serializer = "json"
result_serializer = "json"
accept_content = ["json"]

# Таймауты
task_soft_time_limit = 300  # 5 минут soft limit
task_time_limit = 600       # 10 минут hard limit

# Retry
task_default_retry_delay = 60
task_max_retries = 3

# Prefetch
worker_prefetch_multiplier = 1

# Очереди
task_routes = {
    "tasks.reputation_tasks.*": {"queue": "default"},
}
```

---

## 7.5 Мониторинг

### Flower Dashboard

```bash
celery -A app flower --port=5555
```

### Ключевые метрики

| Метрика | Описание |
|---------|----------|
| `celery_task_succeeded` | Успешные задачи |
| `celery_task_failed` | Неудачные задачи |
| `celery_task_runtime` | Время выполнения |
| `celery_worker_online` | Онлайн воркеры |

---

## Приложение А: Контрольные точки

| Критерий | Проверка |
|----------|----------|
| Beat запущен | `celery -A app beat --loglevel=info` |
| Workers запущены | `celery -A app worker --loglevel=info` |
| Polling работает | Логи показывают задачи каждые 5 мин |
| Анализ работает | Items переходят в pending_review |
| Публикация работает | Ответы появляются на маркетплейсах |
| Office статус | Агенты отображаются в Office Dashboard |

---

## Приложение B: Интеграция с Office Dashboard

### B.1 Агенты Reputation

| agent_id | name | marketplace | salary_equivalent | fte_coefficient |
|----------|------|-------------|-------------------|-----------------|
| reputation_wb | WB отзывы | Wildberries | 60000 | 1.0 |
| reputation_ozon | Ozon отзывы | Ozon | 60000 | 1.0 |
| reputation_ym | YM отзывы | Yandex.Market | 60000 | 1.0 |

### B.2 Инициализация репортеров

```python
# tasks/office.py

from app.utils.office_reporter import OfficeReporter

# Репортеры для агентов Reputation
OFFICE_REPORTERS = {
    "wb": OfficeReporter(
        agent_id="reputation_wb",
        department="reputation",
        name="WB отзывы",
        salary_equivalent=60000,
        fte_coefficient=1.0
    ),
    "ozon": OfficeReporter(
        agent_id="reputation_ozon",
        department="reputation",
        name="Ozon отзывы",
        salary_equivalent=60000,
        fte_coefficient=1.0
    ),
    "ym": OfficeReporter(
        agent_id="reputation_ym",
        department="reputation",
        name="YM отзывы",
        salary_equivalent=60000,
        fte_coefficient=1.0
    )
}
```

### B.3 Интеграция в polling задачи

```python
# tasks/polling.py

from .office import OFFICE_REPORTERS

@shared_task
def poll_wb_reviews():
    reporter = OFFICE_REPORTERS["wb"]
    
    try:
        reporter.report_working("Polling отзывов Wildberries")
        
        # ... логика polling ...
        new_reviews = fetch_wb_reviews()
        
        reporter.report_idle(metrics={
            "reviews_today": get_daily_count("wb"),
            "avg_response_min": get_avg_response_time("wb"),
            "queue_size": get_queue_size("wb")
        })
        
        return {"success": True, "new_reviews": len(new_reviews)}
        
    except WBApiError as e:
        reporter.report_error(f"WB API: {e}")
        raise


@shared_task
def poll_ozon_reviews():
    reporter = OFFICE_REPORTERS["ozon"]
    
    try:
        reporter.report_working("Polling отзывов Ozon")
        
        # ... логика ...
        
        reporter.report_idle(metrics={
            "reviews_today": get_daily_count("ozon"),
            "queue_size": get_queue_size("ozon")
        })
        
    except OzonApiError as e:
        reporter.report_error(f"Ozon API: {e}")
        raise
```

### B.4 Heartbeat задача

```python
# tasks/office.py

from celery import shared_task

@shared_task(name='reputation.tasks.office_heartbeat')
def office_heartbeat():
    """Обновление статуса агентов в Office Dashboard."""
    for reporter in OFFICE_REPORTERS.values():
        reporter.heartbeat()
    return {"success": True, "agents": len(OFFICE_REPORTERS)}
```

### B.5 Celery Beat Schedule

```python
# Добавить в beat_schedule:

"reputation-office-heartbeat": {
    "task": "reputation.tasks.office_heartbeat",
    "schedule": 60.0,  # Каждую минуту
    "options": {"queue": "default"}
},
```

### B.6 Метрики для Office

| Метрика | Описание | Источник |
|---------|----------|----------|
| reviews_today | Обработано отзывов за день | БД: COUNT reviews WHERE date=today |
| avg_response_min | Среднее время ответа (мин) | БД: AVG(response_time) |
| queue_size | Отзывов в очереди | БД: COUNT WHERE status='pending' |

---

**Документ подготовлен:** Январь 2026  
**Версия:** 2.2  
**Статус:** Согласовано

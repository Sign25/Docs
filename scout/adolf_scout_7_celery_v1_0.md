# ADOLF SCOUT â€” Ð Ð°Ð·Ð´ÐµÐ» 7: Celery

**ÐŸÑ€Ð¾ÐµÐºÑ‚:** ÐŸÑ€ÐµÐ´Ð¸ÐºÑ‚Ð¸Ð²Ð½Ð°Ñ Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ñ‚Ð¾Ð²Ð°Ñ€Ð½Ñ‹Ñ… Ð½Ð¸Ñˆ  
**ÐœÐ¾Ð´ÑƒÐ»ÑŒ:** Scout / Celery  
**Ð’ÐµÑ€ÑÐ¸Ñ:** 1.0  
**Ð”Ð°Ñ‚Ð°:** Ð¯Ð½Ð²Ð°Ñ€ÑŒ 2026

---

## 7.1 ÐžÐ±Ð·Ð¾Ñ€ Ð·Ð°Ð´Ð°Ñ‡

### ÐÑ€Ñ…Ð¸Ñ‚ÐµÐºÑ‚ÑƒÑ€Ð° Celery

```mermaid
flowchart TB
    subgraph TRIGGERS["Ð¢Ñ€Ð¸Ð³Ð³ÐµÑ€Ñ‹"]
        SCHEDULE["Celery Beat<br/>(Ñ€Ð°ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ)"]
        API["Scout API<br/>(on-demand)"]
        ADMIN["Admin Panel"]
    end

    subgraph BROKER["Message Broker"]
        REDIS["Redis"]
    end

    subgraph QUEUES["ÐžÑ‡ÐµÑ€ÐµÐ´Ð¸"]
        Q_DEFAULT["default<br/>(ÑÑ‚Ð°Ð½Ð´Ð°Ñ€Ñ‚Ð½Ñ‹Ðµ)"]
        Q_HEAVY["heavy<br/>(Ñ‚ÑÐ¶Ñ‘Ð»Ñ‹Ðµ)"]
        Q_EXPORT["export<br/>(ÑÐºÑÐ¿Ð¾Ñ€Ñ‚)"]
    end

    subgraph WORKERS["Workers"]
        W1["Worker 1<br/>(default)"]
        W2["Worker 2<br/>(default)"]
        W3["Worker 3<br/>(heavy)"]
        W4["Worker 4<br/>(export)"]
    end

    subgraph TASKS["Ð—Ð°Ð´Ð°Ñ‡Ð¸"]
        T1["update_trend_data"]
        T2["refresh_category_stats"]
        T3["cleanup_old_analyses"]
        T4["recalculate_verdicts"]
        T5["analyze_niche"]
        T6["export_analysis"]
    end

    SCHEDULE --> REDIS
    API --> REDIS
    ADMIN --> REDIS

    REDIS --> Q_DEFAULT
    REDIS --> Q_HEAVY
    REDIS --> Q_EXPORT

    Q_DEFAULT --> W1
    Q_DEFAULT --> W2
    Q_HEAVY --> W3
    Q_EXPORT --> W4

    W1 --> T1
    W1 --> T2
    W2 --> T5
    W3 --> T3
    W3 --> T4
    W4 --> T6
```

### Ð¡Ð²Ð¾Ð´Ð½Ð°Ñ Ñ‚Ð°Ð±Ð»Ð¸Ñ†Ð° Ð·Ð°Ð´Ð°Ñ‡

| Ð—Ð°Ð´Ð°Ñ‡Ð° | Ð¢Ð¸Ð¿ | ÐžÑ‡ÐµÑ€ÐµÐ´ÑŒ | Ð Ð°ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ | Ð’Ñ€ÐµÐ¼Ñ |
|--------|-----|---------|------------|-------|
| `scout.update_trend_data` | ÐŸÐµÑ€Ð¸Ð¾Ð´Ð¸Ñ‡ÐµÑÐºÐ°Ñ | default | Ð•Ð¶ÐµÐ´Ð½ÐµÐ²Ð½Ð¾ 06:00 | ~10 Ð¼Ð¸Ð½ |
| `scout.refresh_category_stats` | ÐŸÐµÑ€Ð¸Ð¾Ð´Ð¸Ñ‡ÐµÑÐºÐ°Ñ | default | Ð•Ð¶ÐµÐ´Ð½ÐµÐ²Ð½Ð¾ 08:00 | ~15 Ð¼Ð¸Ð½ |
| `scout.cleanup_old_analyses` | ÐŸÐµÑ€Ð¸Ð¾Ð´Ð¸Ñ‡ÐµÑÐºÐ°Ñ | heavy | Ð’Ð¾ÑÐºÑ€ÐµÑÐµÐ½ÑŒÐµ 03:00 | ~5 Ð¼Ð¸Ð½ |
| `scout.recalculate_verdicts` | ÐŸÐµÑ€Ð¸Ð¾Ð´Ð¸Ñ‡ÐµÑÐºÐ°Ñ | heavy | 1-Ðµ Ñ‡Ð¸ÑÐ»Ð¾ 04:00 | ~30 Ð¼Ð¸Ð½ |
| `scout.analyze_niche` | On-demand | default | ÐŸÐ¾ Ð·Ð°Ð¿Ñ€Ð¾ÑÑƒ | 30-60 ÑÐµÐº |
| `scout.export_analysis` | On-demand | export | ÐŸÐ¾ Ð·Ð°Ð¿Ñ€Ð¾ÑÑƒ | 5-15 ÑÐµÐº |

---

## 7.2 ÐšÐ¾Ð½Ñ„Ð¸Ð³ÑƒÑ€Ð°Ñ†Ð¸Ñ Celery

### 7.2.1 ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸

```python
# celery_config.py

from celery import Celery
from celery.schedules import crontab
from kombu import Queue

# Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ
app = Celery('adolf_scout')

# Ð‘Ñ€Ð¾ÐºÐµÑ€ Ð¸ Ð±ÑÐºÐµÐ½Ð´
app.conf.broker_url = 'redis://redis:6379/0'
app.conf.result_backend = 'redis://redis:6379/1'

# Ð¡ÐµÑ€Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ
app.conf.task_serializer = 'json'
app.conf.result_serializer = 'json'
app.conf.accept_content = ['json']

# Ð’Ñ€ÐµÐ¼ÐµÐ½Ð½Ð°Ñ Ð·Ð¾Ð½Ð°
app.conf.timezone = 'Europe/Moscow'
app.conf.enable_utc = True

# ÐžÑ‡ÐµÑ€ÐµÐ´Ð¸
app.conf.task_queues = (
    Queue('default', routing_key='default'),
    Queue('heavy', routing_key='heavy'),
    Queue('export', routing_key='export'),
)

app.conf.task_default_queue = 'default'
app.conf.task_default_routing_key = 'default'

# Ð Ð¾ÑƒÑ‚Ð¸Ð½Ð³ Ð·Ð°Ð´Ð°Ñ‡
app.conf.task_routes = {
    'scout.update_trend_data': {'queue': 'default'},
    'scout.refresh_category_stats': {'queue': 'default'},
    'scout.cleanup_old_analyses': {'queue': 'heavy'},
    'scout.recalculate_verdicts': {'queue': 'heavy'},
    'scout.analyze_niche': {'queue': 'default'},
    'scout.export_analysis': {'queue': 'export'},
}

# Ð›Ð¸Ð¼Ð¸Ñ‚Ñ‹
app.conf.task_time_limit = 300  # 5 Ð¼Ð¸Ð½ÑƒÑ‚ Ð¼Ð°ÐºÑÐ¸Ð¼ÑƒÐ¼
app.conf.task_soft_time_limit = 240  # Soft limit 4 Ð¼Ð¸Ð½ÑƒÑ‚Ñ‹
app.conf.worker_max_tasks_per_child = 100  # ÐŸÐµÑ€ÐµÐ·Ð°Ð¿ÑƒÑÐº Ð²Ð¾Ñ€ÐºÐµÑ€Ð° Ð¿Ð¾ÑÐ»Ðµ 100 Ð·Ð°Ð´Ð°Ñ‡
app.conf.worker_prefetch_multiplier = 4

# Retry
app.conf.task_acks_late = True
app.conf.task_reject_on_worker_lost = True

# Ð Ð°ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ
app.conf.beat_schedule = {
    'scout-update-trend-data': {
        'task': 'scout.update_trend_data',
        'schedule': crontab(hour=6, minute=0),
        'options': {'queue': 'default'}
    },
    'scout-refresh-category-stats': {
        'task': 'scout.refresh_category_stats',
        'schedule': crontab(hour=8, minute=0),
        'options': {'queue': 'default'}
    },
    'scout-cleanup-old-analyses': {
        'task': 'scout.cleanup_old_analyses',
        'schedule': crontab(hour=3, minute=0, day_of_week=0),  # Ð’Ð¾ÑÐºÑ€ÐµÑÐµÐ½ÑŒÐµ
        'options': {'queue': 'heavy'}
    },
    'scout-recalculate-verdicts': {
        'task': 'scout.recalculate_verdicts',
        'schedule': crontab(hour=4, minute=0, day_of_month=1),  # 1-Ðµ Ñ‡Ð¸ÑÐ»Ð¾
        'options': {'queue': 'heavy'}
    },
}
```

### 7.2.2 Ð—Ð°Ð¿ÑƒÑÐº Ð²Ð¾Ñ€ÐºÐµÑ€Ð¾Ð²

```bash
# Worker Ð´Ð»Ñ Ð¾Ñ‡ÐµÑ€ÐµÐ´Ð¸ default (2 Ð¸Ð½ÑÑ‚Ð°Ð½ÑÐ°)
celery -A adolf worker -Q default -c 4 -n worker-default-1@%h
celery -A adolf worker -Q default -c 4 -n worker-default-2@%h

# Worker Ð´Ð»Ñ Ð¾Ñ‡ÐµÑ€ÐµÐ´Ð¸ heavy (1 Ð¸Ð½ÑÑ‚Ð°Ð½Ñ)
celery -A adolf worker -Q heavy -c 2 -n worker-heavy@%h

# Worker Ð´Ð»Ñ Ð¾Ñ‡ÐµÑ€ÐµÐ´Ð¸ export (1 Ð¸Ð½ÑÑ‚Ð°Ð½Ñ)
celery -A adolf worker -Q export -c 2 -n worker-export@%h

# Celery Beat (Ð¿Ð»Ð°Ð½Ð¸Ñ€Ð¾Ð²Ñ‰Ð¸Ðº)
celery -A adolf beat -l INFO
```

### 7.2.3 Docker Compose

```yaml
# docker-compose.yml (Ñ„Ñ€Ð°Ð³Ð¼ÐµÐ½Ñ‚)

services:
  celery-worker-default:
    build: .
    command: celery -A adolf worker -Q default -c 4 -l INFO
    environment:
      - CELERY_BROKER_URL=redis://redis:6379/0
      - CELERY_RESULT_BACKEND=redis://redis:6379/1
    depends_on:
      - redis
      - postgres
    restart: unless-stopped
    deploy:
      replicas: 2

  celery-worker-heavy:
    build: .
    command: celery -A adolf worker -Q heavy -c 2 -l INFO
    environment:
      - CELERY_BROKER_URL=redis://redis:6379/0
      - CELERY_RESULT_BACKEND=redis://redis:6379/1
    depends_on:
      - redis
      - postgres
    restart: unless-stopped

  celery-worker-export:
    build: .
    command: celery -A adolf worker -Q export -c 2 -l INFO
    environment:
      - CELERY_BROKER_URL=redis://redis:6379/0
      - CELERY_RESULT_BACKEND=redis://redis:6379/1
    depends_on:
      - redis
      - postgres
    restart: unless-stopped

  celery-beat:
    build: .
    command: celery -A adolf beat -l INFO
    environment:
      - CELERY_BROKER_URL=redis://redis:6379/0
    depends_on:
      - redis
    restart: unless-stopped
```

---

## 7.3 ÐŸÐµÑ€Ð¸Ð¾Ð´Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð·Ð°Ð´Ð°Ñ‡Ð¸

### 7.3.1 scout.update_trend_data

**ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ:** ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÐºÑÑˆÐ° Ñ‚Ñ€ÐµÐ½Ð´Ð¾Ð² Ð´Ð»Ñ Ð¿Ð¾Ð¿ÑƒÐ»ÑÑ€Ð½Ñ‹Ñ… Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð².

**Ð Ð°ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ:** Ð•Ð¶ÐµÐ´Ð½ÐµÐ²Ð½Ð¾ Ð² 06:00 MSK

```python
# tasks/trend_tasks.py

from celery import shared_task
from celery.utils.log import get_task_logger
from datetime import datetime, timedelta
from typing import List, Dict

logger = get_task_logger(__name__)


@shared_task(
    name='scout.update_trend_data',
    bind=True,
    max_retries=3,
    default_retry_delay=300,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def update_trend_data(self) -> Dict:
    """
    ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¾ Ñ‚Ñ€ÐµÐ½Ð´Ð°Ñ….
    
    Ð›Ð¾Ð³Ð¸ÐºÐ°:
    1. ÐŸÐ¾Ð»ÑƒÑ‡Ð¸Ñ‚ÑŒ ÑÐ¿Ð¸ÑÐ¾Ðº Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð² Ñ Ð¸ÑÑ‚ÐµÐºÐ°ÑŽÑ‰Ð¸Ð¼ ÐºÑÑˆÐµÐ¼
    2. Ð”Ð»Ñ ÐºÐ°Ð¶Ð´Ð¾Ð³Ð¾ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ° ÑÐ¾Ð±Ñ€Ð°Ñ‚ÑŒ ÑÐ²ÐµÐ¶Ð¸Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ
    3. ÐžÐ±Ð½Ð¾Ð²Ð¸Ñ‚ÑŒ ÐºÑÑˆ
    
    Returns:
        Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ° Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ñ
    """
    logger.info("Starting trend data update")
    start_time = datetime.utcnow()
    
    stats = {
        'queries_processed': 0,
        'queries_updated': 0,
        'queries_failed': 0,
        'duration_seconds': 0
    }
    
    try:
        # ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð² Ñ Ð¸ÑÑ‚ÐµÐºÐ°ÑŽÑ‰Ð¸Ð¼ ÐºÑÑˆÐµÐ¼
        queries = get_expiring_trend_queries(hours_ahead=24)
        logger.info(f"Found {len(queries)} queries to update")
        
        for query_data in queries:
            try:
                # Ð¡Ð±Ð¾Ñ€ ÑÐ²ÐµÐ¶Ð¸Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ…
                trend_result = collect_trend_data_sync(
                    query=query_data['query'],
                    sources=['wordstat', 'ozon_analytics', 'wb_analytics']
                )
                
                # ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÐºÑÑˆÐ°
                update_trend_cache(
                    query_hash=query_data['query_hash'],
                    trend_data=trend_result,
                    ttl_hours=24
                )
                
                stats['queries_updated'] += 1
                
            except Exception as e:
                logger.warning(f"Failed to update trend for '{query_data['query']}': {e}")
                stats['queries_failed'] += 1
            
            stats['queries_processed'] += 1
        
        stats['duration_seconds'] = (datetime.utcnow() - start_time).total_seconds()
        
        logger.info(
            f"Trend update completed: {stats['queries_updated']}/{stats['queries_processed']} updated, "
            f"{stats['queries_failed']} failed, {stats['duration_seconds']:.1f}s"
        )
        
        return stats
        
    except Exception as e:
        logger.error(f"Trend update failed: {e}")
        raise self.retry(exc=e)


def get_expiring_trend_queries(hours_ahead: int = 24) -> List[Dict]:
    """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð² Ñ Ð¸ÑÑ‚ÐµÐºÐ°ÑŽÑ‰Ð¸Ð¼ ÐºÑÑˆÐµÐ¼."""
    from database import get_db_session
    
    with get_db_session() as db:
        result = db.execute("""
            SELECT query_hash, query
            FROM scout_trend_cache
            WHERE expires_at < NOW() + INTERVAL '%s hours'
            ORDER BY expires_at
            LIMIT 100
        """, (hours_ahead,))
        
        return [{'query_hash': row[0], 'query': row[1]} for row in result]


def collect_trend_data_sync(query: str, sources: List[str]) -> Dict:
    """Ð¡Ð¸Ð½Ñ…Ñ€Ð¾Ð½Ð½Ñ‹Ð¹ ÑÐ±Ð¾Ñ€ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¾ Ñ‚Ñ€ÐµÐ½Ð´Ð°Ñ…."""
    import asyncio
    from services.trend_miner import TrendMiner
    
    # Ð—Ð°Ð¿ÑƒÑÐº async ÐºÐ¾Ð´Ð° Ð² sync ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ðµ
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        miner = TrendMiner()
        result = loop.run_until_complete(
            miner.collect_from_sources(query, sources)
        )
        return result
    finally:
        loop.close()


def update_trend_cache(query_hash: str, trend_data: Dict, ttl_hours: int):
    """ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÐºÑÑˆÐ° Ñ‚Ñ€ÐµÐ½Ð´Ð¾Ð²."""
    from database import get_db_session
    
    with get_db_session() as db:
        db.execute("""
            UPDATE scout_trend_cache
            SET 
                trend_data = %s,
                trend_slope = %s,
                trend_status = %s,
                total_volume = %s,
                confidence = %s,
                sources_used = %s,
                expires_at = NOW() + INTERVAL '%s hours',
                updated_at = NOW()
            WHERE query_hash = %s
        """, (
            trend_data.get('raw_data', {}),
            trend_data.get('trend_slope', 0),
            trend_data.get('trend_status', 'unknown'),
            trend_data.get('total_volume', 0),
            trend_data.get('confidence', 0),
            trend_data.get('sources_used', []),
            ttl_hours,
            query_hash
        ))
        db.commit()
```

### 7.3.2 scout.refresh_category_stats

**ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ:** ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ¸ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹ Ð¸Ð· Watcher.

**Ð Ð°ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ:** Ð•Ð¶ÐµÐ´Ð½ÐµÐ²Ð½Ð¾ Ð² 08:00 MSK

```python
# tasks/trend_tasks.py

@shared_task(
    name='scout.refresh_category_stats',
    bind=True,
    max_retries=3,
    default_retry_delay=300
)
def refresh_category_stats(self) -> Dict:
    """
    ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ¸ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹.
    
    Ð›Ð¾Ð³Ð¸ÐºÐ°:
    1. ÐŸÐ¾Ð»ÑƒÑ‡Ð¸Ñ‚ÑŒ ÑÐ¿Ð¸ÑÐ¾Ðº Ð°ÐºÑ‚Ð¸Ð²Ð½Ñ‹Ñ… ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹ Ð¸Ð· Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð²
    2. Ð—Ð°Ð¿Ñ€Ð¾ÑÐ¸Ñ‚ÑŒ ÑÐ²ÐµÐ¶ÑƒÑŽ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÑƒ Ð¸Ð· Watcher
    3. ÐžÐ±Ð½Ð¾Ð²Ð¸Ñ‚ÑŒ ÐºÑÑˆ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹
    """
    logger.info("Starting category stats refresh")
    start_time = datetime.utcnow()
    
    stats = {
        'categories_processed': 0,
        'categories_updated': 0,
        'categories_failed': 0,
        'duration_seconds': 0
    }
    
    try:
        # ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð°ÐºÑ‚Ð¸Ð²Ð½Ñ‹Ñ… ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹ (Ð¸Ð· Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð² Ð·Ð° Ð¿Ð¾ÑÐ»ÐµÐ´Ð½Ð¸Ðµ 30 Ð´Ð½ÐµÐ¹)
        categories = get_active_categories(days=30)
        logger.info(f"Found {len(categories)} active categories")
        
        for category in categories:
            try:
                # Ð—Ð°Ð¿Ñ€Ð¾Ñ Ðº Watcher API
                category_data = fetch_category_from_watcher(
                    marketplace=category['marketplace'],
                    category_url=category['category_url']
                )
                
                # ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÐºÑÑˆÐ°
                update_category_cache(
                    url_hash=category['url_hash'],
                    data=category_data,
                    ttl_hours=12
                )
                
                stats['categories_updated'] += 1
                
            except Exception as e:
                logger.warning(f"Failed to refresh category '{category['category_url']}': {e}")
                stats['categories_failed'] += 1
            
            stats['categories_processed'] += 1
        
        stats['duration_seconds'] = (datetime.utcnow() - start_time).total_seconds()
        
        logger.info(
            f"Category refresh completed: {stats['categories_updated']}/{stats['categories_processed']} updated"
        )
        
        return stats
        
    except Exception as e:
        logger.error(f"Category refresh failed: {e}")
        raise self.retry(exc=e)


def get_active_categories(days: int = 30) -> List[Dict]:
    """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð°ÐºÑ‚Ð¸Ð²Ð½Ñ‹Ñ… ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹ Ð¸Ð· Ð½ÐµÐ´Ð°Ð²Ð½Ð¸Ñ… Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð²."""
    from database import get_db_session
    
    with get_db_session() as db:
        # Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ ÑƒÐ½Ð¸ÐºÐ°Ð»ÑŒÐ½Ñ‹Ñ… URL ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹ Ð¸Ð· competitor_results
        result = db.execute("""
            SELECT DISTINCT 
                mp.key as marketplace,
                mp.value->>'category_url' as category_url,
                MD5(mp.value->>'category_url') as url_hash
            FROM scout_analyses,
                 jsonb_each(competitor_results) as mp
            WHERE analyzed_at > NOW() - INTERVAL '%s days'
              AND mp.value->>'category_url' IS NOT NULL
            LIMIT 50
        """, (days,))
        
        return [
            {
                'marketplace': row[0],
                'category_url': row[1],
                'url_hash': row[2]
            }
            for row in result
        ]


def fetch_category_from_watcher(marketplace: str, category_url: str) -> Dict:
    """Ð—Ð°Ð¿Ñ€Ð¾Ñ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ¸ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸ Ð¸Ð· Watcher."""
    import httpx
    
    with httpx.Client(timeout=30) as client:
        response = client.get(
            f"http://middleware:8000/api/v1/watcher/category/analysis",
            params={
                'marketplace': marketplace,
                'category_url': category_url,
                'limit': 50
            }
        )
        response.raise_for_status()
        return response.json()
```

### 7.3.3 scout.cleanup_old_analyses

**ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ:** ÐÑ€Ñ…Ð¸Ð²Ð°Ñ†Ð¸Ñ ÑÑ‚Ð°Ñ€Ñ‹Ñ… Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð² Ð¸ Ð¾Ñ‡Ð¸ÑÑ‚ÐºÐ° ÐºÑÑˆÐ°.

**Ð Ð°ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ:** Ð’Ð¾ÑÐºÑ€ÐµÑÐµÐ½ÑŒÐµ Ð² 03:00 MSK

```python
# tasks/maintenance_tasks.py

@shared_task(
    name='scout.cleanup_old_analyses',
    bind=True,
    max_retries=2
)
def cleanup_old_analyses(self) -> Dict:
    """
    ÐÑ€Ñ…Ð¸Ð²Ð°Ñ†Ð¸Ñ ÑÑ‚Ð°Ñ€Ñ‹Ñ… Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð² Ð¸ Ð¾Ñ‡Ð¸ÑÑ‚ÐºÐ°.
    
    ÐžÐ¿ÐµÑ€Ð°Ñ†Ð¸Ð¸:
    1. ÐŸÐµÑ€ÐµÐ½Ð¾Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð² ÑÑ‚Ð°Ñ€ÑˆÐµ 12 Ð¼ÐµÑÑÑ†ÐµÐ² Ð² Ð°Ñ€Ñ…Ð¸Ð²
    2. Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ ÑƒÑÑ‚Ð°Ñ€ÐµÐ²ÑˆÐµÐ³Ð¾ ÐºÑÑˆÐ° Ñ‚Ñ€ÐµÐ½Ð´Ð¾Ð²
    3. Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ Ð¸ÑÑ‚Ñ‘ÐºÑˆÐ¸Ñ… ÑÐºÑÐ¿Ð¾Ñ€Ñ‚Ð¾Ð²
    4. ÐžÑ‡Ð¸ÑÑ‚ÐºÐ° Ñ„Ð°Ð¹Ð»Ð¾Ð² ÑÐºÑÐ¿Ð¾Ñ€Ñ‚Ð°
    """
    logger.info("Starting cleanup task")
    start_time = datetime.utcnow()
    
    stats = {
        'analyses_archived': 0,
        'trend_cache_deleted': 0,
        'exports_deleted': 0,
        'files_deleted': 0,
        'space_freed_mb': 0,
        'duration_seconds': 0
    }
    
    try:
        from database import get_db_session
        
        with get_db_session() as db:
            # 1. ÐÑ€Ñ…Ð¸Ð²Ð°Ñ†Ð¸Ñ ÑÑ‚Ð°Ñ€Ñ‹Ñ… Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð²
            result = db.execute("""
                WITH moved AS (
                    DELETE FROM scout_analyses
                    WHERE analyzed_at < NOW() - INTERVAL '12 months'
                    RETURNING *
                )
                INSERT INTO scout_analyses_archive
                SELECT * FROM moved
                RETURNING id
            """)
            stats['analyses_archived'] = result.rowcount
            logger.info(f"Archived {stats['analyses_archived']} analyses")
            
            # 2. ÐžÑ‡Ð¸ÑÑ‚ÐºÐ° ÐºÑÑˆÐ° Ñ‚Ñ€ÐµÐ½Ð´Ð¾Ð²
            result = db.execute("""
                DELETE FROM scout_trend_cache
                WHERE expires_at < NOW() - INTERVAL '7 days'
            """)
            stats['trend_cache_deleted'] = result.rowcount
            logger.info(f"Deleted {stats['trend_cache_deleted']} trend cache entries")
            
            # 3. ÐžÑ‡Ð¸ÑÑ‚ÐºÐ° ÑÐºÑÐ¿Ð¾Ñ€Ñ‚Ð¾Ð²
            result = db.execute("""
                DELETE FROM scout_export_jobs
                WHERE expires_at < NOW() - INTERVAL '1 day'
                RETURNING file_path
            """)
            
            deleted_files = [row[0] for row in result if row[0]]
            stats['exports_deleted'] = result.rowcount
            
            db.commit()
        
        # 4. Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ Ñ„Ð°Ð¹Ð»Ð¾Ð²
        import os
        for file_path in deleted_files:
            try:
                if os.path.exists(file_path):
                    size = os.path.getsize(file_path)
                    os.remove(file_path)
                    stats['files_deleted'] += 1
                    stats['space_freed_mb'] += size / (1024 * 1024)
            except Exception as e:
                logger.warning(f"Failed to delete file {file_path}: {e}")
        
        stats['space_freed_mb'] = round(stats['space_freed_mb'], 2)
        stats['duration_seconds'] = (datetime.utcnow() - start_time).total_seconds()
        
        logger.info(
            f"Cleanup completed: archived={stats['analyses_archived']}, "
            f"cache={stats['trend_cache_deleted']}, exports={stats['exports_deleted']}, "
            f"freed={stats['space_freed_mb']}MB"
        )
        
        return stats
        
    except Exception as e:
        logger.error(f"Cleanup failed: {e}")
        raise self.retry(exc=e)
```

### 7.3.4 scout.recalculate_verdicts

**ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ:** ÐŸÐµÑ€ÐµÑÑ‡Ñ‘Ñ‚ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚Ð¾Ð² Ð´Ð»Ñ Ð¾Ñ‚ÑÐ»ÐµÐ¶Ð¸Ð²Ð°Ð½Ð¸Ñ Ñ‚Ð¾Ñ‡Ð½Ð¾ÑÑ‚Ð¸ Ð¿Ñ€Ð¾Ð³Ð½Ð¾Ð·Ð¾Ð².

**Ð Ð°ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ:** 1-Ðµ Ñ‡Ð¸ÑÐ»Ð¾ Ð¼ÐµÑÑÑ†Ð° Ð² 04:00 MSK

```python
# tasks/maintenance_tasks.py

@shared_task(
    name='scout.recalculate_verdicts',
    bind=True,
    max_retries=2
)
def recalculate_verdicts(self) -> Dict:
    """
    ÐŸÐµÑ€ÐµÑÑ‡Ñ‘Ñ‚ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚Ð¾Ð² Ð´Ð»Ñ Ð¾Ñ†ÐµÐ½ÐºÐ¸ Ñ‚Ð¾Ñ‡Ð½Ð¾ÑÑ‚Ð¸.
    
    Ð›Ð¾Ð³Ð¸ÐºÐ°:
    1. Ð’Ñ‹Ð±Ñ€Ð°Ñ‚ÑŒ Ð°Ð½Ð°Ð»Ð¸Ð·Ñ‹ Ð·Ð° Ð¿Ñ€Ð¾ÑˆÐ»Ñ‹Ð¹ Ð¼ÐµÑÑÑ†
    2. ÐŸÐ¾Ð»ÑƒÑ‡Ð¸Ñ‚ÑŒ Ñ‚ÐµÐºÑƒÑ‰Ð¸Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð¿Ð¾ Ñ‚ÐµÐ¼ Ð¶Ðµ Ð½Ð¸ÑˆÐ°Ð¼
    3. Ð¡Ñ€Ð°Ð²Ð½Ð¸Ñ‚ÑŒ Ð¿Ñ€Ð¾Ð³Ð½Ð¾Ð· Ñ Ñ€ÐµÐ°Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒÑŽ
    4. Ð¡Ð¾Ñ…Ñ€Ð°Ð½Ð¸Ñ‚ÑŒ Ð¼ÐµÑ‚Ñ€Ð¸ÐºÐ¸ Ñ‚Ð¾Ñ‡Ð½Ð¾ÑÑ‚Ð¸
    
    Ð­Ñ‚Ð¾ Ð¿Ð¾Ð·Ð²Ð¾Ð»ÑÐµÑ‚:
    - ÐžÑ†ÐµÐ½Ð¸Ñ‚ÑŒ ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð¾ Ð¿Ñ€Ð¾Ð³Ð½Ð¾Ð·Ð¾Ð²
    - ÐšÐ°Ð»Ð¸Ð±Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ Ð¿Ð¾Ñ€Ð¾Ð³Ð¸
    - Ð£Ð»ÑƒÑ‡ÑˆÐ°Ñ‚ÑŒ Ð¼Ð¾Ð´ÐµÐ»ÑŒ (v2.0)
    """
    logger.info("Starting verdict recalculation")
    start_time = datetime.utcnow()
    
    stats = {
        'analyses_checked': 0,
        'go_accurate': 0,
        'consider_accurate': 0,
        'risky_accurate': 0,
        'accuracy_rate': 0.0,
        'duration_seconds': 0
    }
    
    try:
        from database import get_db_session
        
        with get_db_session() as db:
            # ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð² Ð·Ð° Ð¿Ñ€Ð¾ÑˆÐ»Ñ‹Ð¹ Ð¼ÐµÑÑÑ†
            analyses = db.execute("""
                SELECT 
                    id,
                    query,
                    marketplaces,
                    cogs,
                    verdict,
                    metrics
                FROM scout_analyses
                WHERE analyzed_at BETWEEN 
                    NOW() - INTERVAL '2 months' 
                    AND NOW() - INTERVAL '1 month'
                LIMIT 100
            """).fetchall()
            
            logger.info(f"Found {len(analyses)} analyses to check")
            
            for analysis in analyses:
                try:
                    # ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ñ‚ÐµÐºÑƒÑ‰Ð¸Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ…
                    current_data = get_current_niche_data(
                        query=analysis.query,
                        marketplaces=analysis.marketplaces
                    )
                    
                    # ÐžÑ†ÐµÐ½ÐºÐ° Ñ‚Ð¾Ñ‡Ð½Ð¾ÑÑ‚Ð¸ Ð¿Ñ€Ð¾Ð³Ð½Ð¾Ð·Ð°
                    is_accurate = evaluate_prediction_accuracy(
                        original_verdict=analysis.verdict,
                        original_metrics=analysis.metrics,
                        current_data=current_data
                    )
                    
                    if is_accurate:
                        if analysis.verdict == 'GO':
                            stats['go_accurate'] += 1
                        elif analysis.verdict == 'CONSIDER':
                            stats['consider_accurate'] += 1
                        else:
                            stats['risky_accurate'] += 1
                    
                    stats['analyses_checked'] += 1
                    
                except Exception as e:
                    logger.warning(f"Failed to check analysis {analysis.id}: {e}")
            
            # Ð Ð°ÑÑ‡Ñ‘Ñ‚ Ð¾Ð±Ñ‰ÐµÐ¹ Ñ‚Ð¾Ñ‡Ð½Ð¾ÑÑ‚Ð¸
            total_accurate = stats['go_accurate'] + stats['consider_accurate'] + stats['risky_accurate']
            if stats['analyses_checked'] > 0:
                stats['accuracy_rate'] = round(total_accurate / stats['analyses_checked'] * 100, 1)
            
            # Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ð¼ÐµÑ‚Ñ€Ð¸Ðº
            db.execute("""
                INSERT INTO scout_settings (key, value, description)
                VALUES ('metrics.accuracy.%s', %s, 'Accuracy metrics for month')
                ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
            """, (
                datetime.utcnow().strftime('%Y-%m'),
                stats
            ))
            
            db.commit()
        
        stats['duration_seconds'] = (datetime.utcnow() - start_time).total_seconds()
        
        logger.info(
            f"Verdict recalculation completed: checked={stats['analyses_checked']}, "
            f"accuracy={stats['accuracy_rate']}%"
        )
        
        return stats
        
    except Exception as e:
        logger.error(f"Verdict recalculation failed: {e}")
        raise self.retry(exc=e)


def evaluate_prediction_accuracy(
    original_verdict: str,
    original_metrics: Dict,
    current_data: Dict
) -> bool:
    """
    ÐžÑ†ÐµÐ½ÐºÐ° Ñ‚Ð¾Ñ‡Ð½Ð¾ÑÑ‚Ð¸ Ð¿Ñ€Ð¾Ð³Ð½Ð¾Ð·Ð°.
    
    ÐšÑ€Ð¸Ñ‚ÐµÑ€Ð¸Ð¸:
    - GO: Ð½Ð¸ÑˆÐ° Ð´Ð¾Ð»Ð¶Ð½Ð° Ð¿Ð¾ÐºÐ°Ð·Ð°Ñ‚ÑŒ Ñ€Ð¾ÑÑ‚ Ð¸Ð»Ð¸ ÑÑ‚Ð°Ð±Ð¸Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ
    - RISKY: Ð½Ð¸ÑˆÐ° Ð´Ð¾Ð»Ð¶Ð½Ð° Ð¿Ð¾ÐºÐ°Ð·Ð°Ñ‚ÑŒ Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼Ñ‹
    - CONSIDER: Ð»ÑŽÐ±Ð¾Ð¹ Ð¸ÑÑ…Ð¾Ð´ Ð¿Ñ€Ð¸ÐµÐ¼Ð»ÐµÐ¼
    """
    if not current_data:
        return False
    
    original_trend = original_metrics.get('trend_slope', 0)
    current_trend = current_data.get('trend_slope', 0)
    
    if original_verdict == 'GO':
        # GO ÑÑ‡Ð¸Ñ‚Ð°ÐµÑ‚ÑÑ Ñ‚Ð¾Ñ‡Ð½Ñ‹Ð¼, ÐµÑÐ»Ð¸ Ñ‚Ñ€ÐµÐ½Ð´ Ð½Ðµ ÑƒÐ¿Ð°Ð» Ð·Ð½Ð°Ñ‡Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾
        return current_trend > -0.1
    
    elif original_verdict == 'RISKY':
        # RISKY ÑÑ‡Ð¸Ñ‚Ð°ÐµÑ‚ÑÑ Ñ‚Ð¾Ñ‡Ð½Ñ‹Ð¼, ÐµÑÐ»Ð¸ Ñ‚Ñ€ÐµÐ½Ð´ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ Ð¿Ð»Ð¾Ñ…Ð¾Ð¹
        return current_trend < 0.1
    
    else:  # CONSIDER
        # CONSIDER Ð²ÑÐµÐ³Ð´Ð° ÑÑ‡Ð¸Ñ‚Ð°ÐµÑ‚ÑÑ Ð¿Ñ€Ð¸ÐµÐ¼Ð»ÐµÐ¼Ñ‹Ð¼
        return True
```

---

## 7.4 On-demand Ð·Ð°Ð´Ð°Ñ‡Ð¸

### 7.4.1 scout.analyze_niche

**ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ:** ÐÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð½Ñ‹Ð¹ Ð°Ð½Ð°Ð»Ð¸Ð· Ð½Ð¸ÑˆÐ¸ Ð¿Ð¾ Ð·Ð°Ð¿Ñ€Ð¾ÑÑƒ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ.

```python
# tasks/analysis_tasks.py

from celery import shared_task
from celery.utils.log import get_task_logger
from typing import Dict, Optional
import uuid

logger = get_task_logger(__name__)


@shared_task(
    name='scout.analyze_niche',
    bind=True,
    max_retries=2,
    default_retry_delay=60,
    soft_time_limit=90,
    time_limit=120,
    track_started=True
)
def analyze_niche(
    self,
    query: str,
    cogs: float,
    marketplaces: Optional[list] = None,
    user_id: int = None,
    cogs_min: Optional[float] = None,
    cogs_max: Optional[float] = None
) -> Dict:
    """
    ÐÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð½Ñ‹Ð¹ Ð°Ð½Ð°Ð»Ð¸Ð· Ð½Ð¸ÑˆÐ¸.
    
    Args:
        query: ÐŸÐ¾Ð¸ÑÐºÐ¾Ð²Ñ‹Ð¹ Ð·Ð°Ð¿Ñ€Ð¾Ñ Ð¸Ð»Ð¸ URL ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸
        cogs: Ð—Ð°ÐºÑƒÐ¿Ð¾Ñ‡Ð½Ð°Ñ Ñ†ÐµÐ½Ð°
        marketplaces: Ð¡Ð¿Ð¸ÑÐ¾Ðº Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ¾Ð²
        user_id: ID Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
        cogs_min: ÐœÐ¸Ð½Ð¸Ð¼ÑƒÐ¼ Ð´Ð¸Ð°Ð¿Ð°Ð·Ð¾Ð½Ð° COGS
        cogs_max: ÐœÐ°ÐºÑÐ¸Ð¼ÑƒÐ¼ Ð´Ð¸Ð°Ð¿Ð°Ð·Ð¾Ð½Ð° COGS
    
    Returns:
        Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Ð°Ð½Ð°Ð»Ð¸Ð·Ð°
    """
    task_id = self.request.id
    logger.info(f"Starting niche analysis task {task_id}: query='{query}', cogs={cogs}")
    
    try:
        import asyncio
        from services.analysis_orchestrator import AnalysisOrchestrator
        from services.input_parser import ParsedInput
        
        # Ð¤Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð²Ñ…Ð¾Ð´Ð½Ñ‹Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ…
        parsed_input = ParsedInput(
            marketplaces=marketplaces or ['wildberries', 'ozon', 'yandex_market'],
            query=query,
            cogs=cogs,
            cogs_min=cogs_min,
            cogs_max=cogs_max,
            raw_input=query
        )
        
        # Ð—Ð°Ð¿ÑƒÑÐº async Ð°Ð½Ð°Ð»Ð¸Ð·Ð°
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            orchestrator = AnalysisOrchestrator()
            result = loop.run_until_complete(
                orchestrator.analyze_async(parsed_input, user_id)
            )
        finally:
            loop.close()
        
        # Ð¡ÐµÑ€Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð°
        result_dict = {
            'analysis_id': str(result.analysis_id),
            'query': result.query,
            'marketplaces': result.marketplaces,
            'verdict': result.verdict.value,
            'color': result.color,
            'confidence': result.confidence,
            'metrics': {
                'trend_slope': result.metrics.trend_slope,
                'trend_status': result.metrics.trend_status,
                'monopoly_rate': result.metrics.monopoly_rate,
                'monopoly_status': result.metrics.monopoly_status,
                'expected_margin': result.metrics.expected_margin,
                'margin_status': result.metrics.margin_status
            },
            'summary': result.summary,
            'recommendations': result.recommendations,
            'risks': result.risks,
            'processing_time_ms': result.processing_time_ms
        }
        
        logger.info(
            f"Analysis completed: task={task_id}, verdict={result.verdict.value}, "
            f"time={result.processing_time_ms}ms"
        )
        
        return result_dict
        
    except Exception as e:
        logger.error(f"Analysis failed: task={task_id}, error={e}")
        raise self.retry(exc=e)


@shared_task(
    name='scout.analyze_niche_batch',
    bind=True,
    max_retries=1,
    soft_time_limit=300,
    time_limit=360
)
def analyze_niche_batch(
    self,
    queries: list,
    cogs: float,
    user_id: int
) -> Dict:
    """
    ÐŸÐ°ÐºÐµÑ‚Ð½Ñ‹Ð¹ Ð°Ð½Ð°Ð»Ð¸Ð· Ð½ÐµÑÐºÐ¾Ð»ÑŒÐºÐ¸Ñ… Ð½Ð¸Ñˆ.
    
    Args:
        queries: Ð¡Ð¿Ð¸ÑÐ¾Ðº Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð²
        cogs: Ð—Ð°ÐºÑƒÐ¿Ð¾Ñ‡Ð½Ð°Ñ Ñ†ÐµÐ½Ð° (Ð¾Ð´Ð½Ð° Ð´Ð»Ñ Ð²ÑÐµÑ…)
        user_id: ID Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
    
    Returns:
        Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ñ‹ Ð¿Ð¾ Ð²ÑÐµÐ¼ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ°Ð¼
    """
    logger.info(f"Starting batch analysis: {len(queries)} queries")
    
    results = {
        'total': len(queries),
        'completed': 0,
        'failed': 0,
        'analyses': []
    }
    
    for query in queries[:10]:  # Ð›Ð¸Ð¼Ð¸Ñ‚ 10 Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð²
        try:
            # Ð’Ñ‹Ð·Ð¾Ð² Ð¾ÑÐ½Ð¾Ð²Ð½Ð¾Ð¹ Ð·Ð°Ð´Ð°Ñ‡Ð¸ ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð½Ð¾
            result = analyze_niche.apply(
                args=[query, cogs],
                kwargs={'user_id': user_id}
            ).get(timeout=120)
            
            results['analyses'].append(result)
            results['completed'] += 1
            
        except Exception as e:
            logger.warning(f"Batch item failed: query='{query}', error={e}")
            results['analyses'].append({
                'query': query,
                'error': str(e)
            })
            results['failed'] += 1
    
    logger.info(
        f"Batch analysis completed: {results['completed']}/{results['total']} successful"
    )
    
    return results
```

### 7.4.2 scout.export_analysis

**ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ:** Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð° Ð² PDF Ð¸Ð»Ð¸ Excel.

```python
# tasks/export_tasks.py

from celery import shared_task
from celery.utils.log import get_task_logger
from typing import Dict, Literal
import uuid
import os

logger = get_task_logger(__name__)

EXPORT_DIR = '/var/exports/scout'


@shared_task(
    name='scout.export_analysis',
    bind=True,
    max_retries=2,
    default_retry_delay=30,
    soft_time_limit=60,
    time_limit=90
)
def export_analysis(
    self,
    analysis_id: str,
    format: Literal['pdf', 'xlsx'] = 'pdf',
    user_id: int = None
) -> Dict:
    """
    Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° Ð² Ñ„Ð°Ð¹Ð».
    
    Args:
        analysis_id: ID Ð°Ð½Ð°Ð»Ð¸Ð·Ð° (Ð¸Ð»Ð¸ 'latest' Ð´Ð»Ñ Ð¿Ð¾ÑÐ»ÐµÐ´Ð½ÐµÐ³Ð¾)
        format: Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚ ÑÐºÑÐ¿Ð¾Ñ€Ñ‚Ð°
        user_id: ID Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
    
    Returns:
        Ð˜Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ñ Ð¾ Ñ„Ð°Ð¹Ð»Ðµ Ð¸ ÑÑÑ‹Ð»ÐºÐ° Ð´Ð»Ñ ÑÐºÐ°Ñ‡Ð¸Ð²Ð°Ð½Ð¸Ñ
    """
    task_id = self.request.id
    export_id = str(uuid.uuid4())
    
    logger.info(f"Starting export: task={task_id}, analysis={analysis_id}, format={format}")
    
    try:
        from database import get_db_session
        
        with get_db_session() as db:
            # ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð°Ð½Ð°Ð»Ð¸Ð·Ð°
            if analysis_id == 'latest':
                analysis = db.execute("""
                    SELECT * FROM scout_analyses
                    WHERE user_id = %s
                    ORDER BY analyzed_at DESC
                    LIMIT 1
                """, (user_id,)).fetchone()
            else:
                analysis = db.execute("""
                    SELECT * FROM scout_analyses
                    WHERE id = %s AND user_id = %s
                """, (analysis_id, user_id)).fetchone()
            
            if not analysis:
                raise ValueError(f"Analysis not found: {analysis_id}")
            
            # Ð¡Ð¾Ð·Ð´Ð°Ð½Ð¸Ðµ Ð·Ð°Ð´Ð°Ñ‡Ð¸ ÑÐºÑÐ¿Ð¾Ñ€Ñ‚Ð°
            db.execute("""
                INSERT INTO scout_export_jobs (id, analysis_id, format, status, user_id)
                VALUES (%s, %s, %s, 'processing', %s)
            """, (export_id, analysis.id, format, user_id))
            db.commit()
        
        # Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Ñ„Ð°Ð¹Ð»Ð°
        if format == 'pdf':
            file_path = generate_pdf_report(analysis, export_id)
        else:
            file_path = generate_xlsx_report(analysis, export_id)
        
        file_size = os.path.getsize(file_path)
        download_url = f"https://storage.adolf.local/exports/{os.path.basename(file_path)}"
        
        # ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ñ‚ÑƒÑÐ°
        with get_db_session() as db:
            db.execute("""
                UPDATE scout_export_jobs
                SET 
                    status = 'completed',
                    file_path = %s,
                    download_url = %s,
                    file_size_bytes = %s,
                    expires_at = NOW() + INTERVAL '24 hours',
                    completed_at = NOW()
                WHERE id = %s
            """, (file_path, download_url, file_size, export_id))
            db.commit()
        
        result = {
            'export_id': export_id,
            'analysis_id': str(analysis.id),
            'format': format,
            'status': 'completed',
            'file_path': file_path,
            'download_url': download_url,
            'file_size_bytes': file_size
        }
        
        logger.info(f"Export completed: {export_id}, size={file_size}B")
        
        return result
        
    except Exception as e:
        logger.error(f"Export failed: {e}")
        
        # ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ñ‚ÑƒÑÐ° Ð¾ÑˆÐ¸Ð±ÐºÐ¸
        try:
            with get_db_session() as db:
                db.execute("""
                    UPDATE scout_export_jobs
                    SET status = 'failed', error_message = %s
                    WHERE id = %s
                """, (str(e), export_id))
                db.commit()
        except:
            pass
        
        raise self.retry(exc=e)


def generate_pdf_report(analysis, export_id: str) -> str:
    """Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ PDF-Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð°."""
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import A4
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet
    
    file_path = os.path.join(EXPORT_DIR, f"scout_{analysis.id}_{export_id[:8]}.pdf")
    
    doc = SimpleDocTemplate(file_path, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []
    
    # Ð—Ð°Ð³Ð¾Ð»Ð¾Ð²Ð¾Ðº
    story.append(Paragraph(f"ÐÐ½Ð°Ð»Ð¸Ð· Ð½Ð¸ÑˆÐ¸: {analysis.query}", styles['Title']))
    story.append(Spacer(1, 12))
    
    # Ð’ÐµÑ€Ð´Ð¸ÐºÑ‚
    verdict_text = f"Ð’ÐµÑ€Ð´Ð¸ÐºÑ‚: {analysis.verdict}"
    story.append(Paragraph(verdict_text, styles['Heading1']))
    story.append(Spacer(1, 12))
    
    # ÐœÐµÑ‚Ñ€Ð¸ÐºÐ¸
    metrics = analysis.metrics
    metrics_data = [
        ['ÐœÐµÑ‚Ñ€Ð¸ÐºÐ°', 'Ð—Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ', 'Ð¡Ñ‚Ð°Ñ‚ÑƒÑ'],
        ['Ð¢Ñ€ÐµÐ½Ð´ ÑÐ¿Ñ€Ð¾ÑÐ°', f"{metrics.get('trend_slope', 0):+.2f}", metrics.get('trend_status', '')],
        ['ÐœÐ¾Ð½Ð¾Ð¿Ð¾Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ', f"{metrics.get('monopoly_rate', 0)*100:.0f}%", metrics.get('monopoly_status', '')],
        ['ÐžÐ¶Ð¸Ð´. Ð¼Ð°Ñ€Ð¶Ð°', f"{metrics.get('expected_margin', 0):.1f}%", metrics.get('margin_status', '')]
    ]
    
    metrics_table = Table(metrics_data)
    metrics_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    story.append(metrics_table)
    story.append(Spacer(1, 20))
    
    # Ð ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸
    if analysis.recommendations:
        story.append(Paragraph("Ð ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸:", styles['Heading2']))
        for i, rec in enumerate(analysis.recommendations, 1):
            story.append(Paragraph(f"{i}. {rec}", styles['Normal']))
        story.append(Spacer(1, 12))
    
    # Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ PDF
    doc.build(story)
    
    return file_path


def generate_xlsx_report(analysis, export_id: str) -> str:
    """Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Excel-Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð°."""
    import openpyxl
    from openpyxl.styles import Font, Alignment, PatternFill
    
    file_path = os.path.join(EXPORT_DIR, f"scout_{analysis.id}_{export_id[:8]}.xlsx")
    
    wb = openpyxl.Workbook()
    
    # Ð›Ð¸ÑÑ‚ Summary
    ws_summary = wb.active
    ws_summary.title = "Summary"
    
    ws_summary['A1'] = "ÐÐ½Ð°Ð»Ð¸Ð· Ð½Ð¸ÑˆÐ¸"
    ws_summary['A1'].font = Font(bold=True, size=14)
    
    ws_summary['A3'] = "Ð—Ð°Ð¿Ñ€Ð¾Ñ:"
    ws_summary['B3'] = analysis.query
    
    ws_summary['A4'] = "Ð’ÐµÑ€Ð´Ð¸ÐºÑ‚:"
    ws_summary['B4'] = analysis.verdict
    
    ws_summary['A5'] = "Ð”Ð°Ñ‚Ð°:"
    ws_summary['B5'] = str(analysis.analyzed_at)
    
    # ÐœÐµÑ‚Ñ€Ð¸ÐºÐ¸
    ws_summary['A7'] = "ÐšÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ðµ Ð¼ÐµÑ‚Ñ€Ð¸ÐºÐ¸"
    ws_summary['A7'].font = Font(bold=True)
    
    metrics = analysis.metrics
    ws_summary['A8'] = "Trend Slope"
    ws_summary['B8'] = metrics.get('trend_slope', 0)
    
    ws_summary['A9'] = "Monopoly Rate"
    ws_summary['B9'] = metrics.get('monopoly_rate', 0)
    
    ws_summary['A10'] = "Expected Margin"
    ws_summary['B10'] = metrics.get('expected_margin', 0)
    
    # Ð›Ð¸ÑÑ‚ Unit Economics
    ws_unit = wb.create_sheet("Unit Economics")
    
    unit_econ = analysis.unit_economics
    row = 1
    for mp, data in unit_econ.items():
        ws_unit.cell(row=row, column=1, value=mp.upper())
        ws_unit.cell(row=row, column=1).font = Font(bold=True)
        row += 1
        
        for key, value in data.items():
            ws_unit.cell(row=row, column=1, value=key)
            ws_unit.cell(row=row, column=2, value=value)
            row += 1
        
        row += 1
    
    # Ð›Ð¸ÑÑ‚ Recommendations
    ws_recs = wb.create_sheet("Recommendations")
    
    ws_recs['A1'] = "Ð ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸"
    ws_recs['A1'].font = Font(bold=True)
    
    for i, rec in enumerate(analysis.recommendations or [], 1):
        ws_recs.cell(row=i+1, column=1, value=f"{i}. {rec}")
    
    wb.save(file_path)
    
    return file_path
```

---

## 7.5 ÐœÐ¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³ Ð¸ Ð°Ð»ÐµÑ€Ñ‚Ñ‹

### 7.5.1 Flower (Ð¼Ð¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³ Celery)

```yaml
# docker-compose.yml

services:
  flower:
    image: mher/flower:0.9.7
    command: celery flower --broker=redis://redis:6379/0
    ports:
      - "5555:5555"
    environment:
      - CELERY_BROKER_URL=redis://redis:6379/0
    depends_on:
      - redis
```

### 7.5.2 ÐœÐµÑ‚Ñ€Ð¸ÐºÐ¸ Ð·Ð°Ð´Ð°Ñ‡

```python
# monitoring/celery_metrics.py

from prometheus_client import Counter, Histogram, Gauge

# Ð¡Ñ‡Ñ‘Ñ‚Ñ‡Ð¸ÐºÐ¸
scout_tasks_total = Counter(
    'scout_celery_tasks_total',
    'Total Scout Celery tasks',
    ['task_name', 'status']
)

# Ð“Ð¸ÑÑ‚Ð¾Ð³Ñ€Ð°Ð¼Ð¼Ñ‹ Ð²Ñ€ÐµÐ¼ÐµÐ½Ð¸ Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ñ
scout_task_duration = Histogram(
    'scout_celery_task_duration_seconds',
    'Scout task duration',
    ['task_name'],
    buckets=[1, 5, 10, 30, 60, 120, 300]
)

# Ð¢ÐµÐºÑƒÑ‰ÐµÐµ ÑÐ¾ÑÑ‚Ð¾ÑÐ½Ð¸Ðµ
scout_tasks_active = Gauge(
    'scout_celery_tasks_active',
    'Currently active Scout tasks',
    ['task_name']
)


# Ð¥ÑƒÐºÐ¸ Celery
from celery.signals import task_prerun, task_postrun, task_failure

@task_prerun.connect
def task_prerun_handler(task_id, task, **kwargs):
    if task.name.startswith('scout.'):
        scout_tasks_active.labels(task_name=task.name).inc()

@task_postrun.connect
def task_postrun_handler(task_id, task, retval, state, **kwargs):
    if task.name.startswith('scout.'):
        scout_tasks_active.labels(task_name=task.name).dec()
        scout_tasks_total.labels(task_name=task.name, status='success').inc()

@task_failure.connect
def task_failure_handler(task_id, exception, **kwargs):
    task_name = kwargs.get('sender', {}).name
    if task_name and task_name.startswith('scout.'):
        scout_tasks_active.labels(task_name=task_name).dec()
        scout_tasks_total.labels(task_name=task_name, status='failure').inc()
```

### 7.5.3 ÐÐ»ÐµÑ€Ñ‚Ñ‹

```yaml
# alertmanager/scout_alerts.yml

groups:
  - name: scout_celery_alerts
    rules:
      - alert: ScoutTaskQueueBacklog
        expr: celery_queue_length{queue=~"default|heavy|export"} > 100
        for: 5m
        labels:
          severity: warning
          module: scout
        annotations:
          summary: "Scout task queue backlog"
          description: "Queue {{ $labels.queue }} has {{ $value }} pending tasks"

      - alert: ScoutTaskFailureRate
        expr: |
          rate(scout_celery_tasks_total{status="failure"}[5m]) 
          / rate(scout_celery_tasks_total[5m]) > 0.1
        for: 10m
        labels:
          severity: critical
          module: scout
        annotations:
          summary: "High Scout task failure rate"
          description: "Task {{ $labels.task_name }} failure rate is {{ $value | humanizePercentage }}"

      - alert: ScoutAnalysisSlowdown
        expr: |
          histogram_quantile(0.95, 
            rate(scout_celery_task_duration_seconds_bucket{task_name="scout.analyze_niche"}[15m])
          ) > 90
        for: 15m
        labels:
          severity: warning
          module: scout
        annotations:
          summary: "Scout analysis tasks are slow"
          description: "95th percentile analysis time is {{ $value }}s"

      - alert: ScoutWorkerDown
        expr: celery_workers{queue=~"default|heavy|export"} == 0
        for: 2m
        labels:
          severity: critical
          module: scout
        annotations:
          summary: "No Scout Celery workers"
          description: "No workers available for queue {{ $labels.queue }}"
```

---

## 7.6 ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð¾ÑˆÐ¸Ð±Ð¾Ðº

### 7.6.1 Retry-ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ñ

```python
# tasks/base.py

from celery import Task
from celery.exceptions import MaxRetriesExceededError

class ScoutBaseTask(Task):
    """Ð‘Ð°Ð·Ð¾Ð²Ñ‹Ð¹ ÐºÐ»Ð°ÑÑ Ð´Ð»Ñ Ð·Ð°Ð´Ð°Ñ‡ Scout."""
    
    autoretry_for = (Exception,)
    retry_backoff = True
    retry_backoff_max = 600  # ÐœÐ°ÐºÑÐ¸Ð¼ÑƒÐ¼ 10 Ð¼Ð¸Ð½ÑƒÑ‚ Ð¼ÐµÐ¶Ð´Ñƒ Ð¿Ð¾Ð¿Ñ‹Ñ‚ÐºÐ°Ð¼Ð¸
    retry_jitter = True
    
    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ñ„Ð¸Ð½Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð¿Ñ€Ð¾Ð²Ð°Ð»Ð° Ð·Ð°Ð´Ð°Ñ‡Ð¸."""
        logger.error(
            f"Task {self.name} failed permanently: "
            f"task_id={task_id}, error={exc}"
        )
        
        # Ð£Ð²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ðµ
        send_alert(
            title=f"Scout Task Failed: {self.name}",
            message=str(exc),
            severity="error"
        )
    
    def on_retry(self, exc, task_id, args, kwargs, einfo):
        """Ð›Ð¾Ð³Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ retry."""
        logger.warning(
            f"Task {self.name} retry: "
            f"task_id={task_id}, attempt={self.request.retries}, error={exc}"
        )
```

### 7.6.2 Dead Letter Queue

```python
# celery_config.py

# ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ° DLQ Ð´Ð»Ñ Ð½ÐµÑƒÐ´Ð°Ñ‡Ð½Ñ‹Ñ… Ð·Ð°Ð´Ð°Ñ‡
app.conf.task_routes = {
    'scout.*': {
        'queue': 'default',
        'dead_letter_exchange': 'scout_dlx',
        'dead_letter_routing_key': 'scout_dlq'
    }
}

# ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸Ðº DLQ
@shared_task(name='scout.process_dead_letter', queue='scout_dlq')
def process_dead_letter(body):
    """ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð·Ð°Ð´Ð°Ñ‡ Ð¸Ð· Dead Letter Queue."""
    logger.error(f"Dead letter received: {body}")
    
    # Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ð´Ð»Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð°
    save_failed_task_for_analysis(body)
    
    # Ð£Ð²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ðµ
    send_alert(
        title="Scout Dead Letter",
        message=f"Task failed permanently: {body.get('task', 'unknown')}",
        severity="critical"
    )
```

---

## 7.7 ÐŸÑ€Ð¸Ð¼ÐµÑ€Ñ‹ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ

### 7.7.1 Ð—Ð°Ð¿ÑƒÑÐº Ð·Ð°Ð´Ð°Ñ‡Ð¸ Ð¸Ð· API

```python
# api/endpoints.py

from fastapi import APIRouter, BackgroundTasks
from tasks.analysis_tasks import analyze_niche

router = APIRouter()

@router.post("/api/v1/scout/analyze")
async def create_analysis(
    request: AnalyzeRequest,
    user: User = Depends(get_current_user)
):
    """Ð¡Ð¾Ð·Ð´Ð°Ð½Ð¸Ðµ Ð·Ð°Ð´Ð°Ñ‡Ð¸ Ð°Ð½Ð°Ð»Ð¸Ð·Ð°."""
    
    # Ð—Ð°Ð¿ÑƒÑÐº async Ð·Ð°Ð´Ð°Ñ‡Ð¸
    task = analyze_niche.delay(
        query=request.query,
        cogs=request.cogs,
        marketplaces=request.marketplaces,
        user_id=user.id
    )
    
    return {
        "task_id": task.id,
        "status": "pending",
        "message": "Analysis started"
    }


@router.get("/api/v1/scout/analyze/{task_id}/status")
async def get_analysis_status(task_id: str):
    """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ñ‚ÑƒÑÐ° Ð·Ð°Ð´Ð°Ñ‡Ð¸."""
    
    from celery.result import AsyncResult
    
    result = AsyncResult(task_id)
    
    if result.ready():
        if result.successful():
            return {
                "task_id": task_id,
                "status": "completed",
                "result": result.get()
            }
        else:
            return {
                "task_id": task_id,
                "status": "failed",
                "error": str(result.result)
            }
    else:
        return {
            "task_id": task_id,
            "status": result.status
        }
```

### 7.7.2 Ð ÑƒÑ‡Ð½Ð¾Ð¹ Ð·Ð°Ð¿ÑƒÑÐº Ð¿ÐµÑ€Ð¸Ð¾Ð´Ð¸Ñ‡ÐµÑÐºÐ¾Ð¹ Ð·Ð°Ð´Ð°Ñ‡Ð¸

```python
# Ð˜Ð· shell Ð¸Ð»Ð¸ admin panel

from tasks.trend_tasks import update_trend_data
from tasks.maintenance_tasks import cleanup_old_analyses

# ÐÐµÐ¼ÐµÐ´Ð»ÐµÐ½Ð½Ñ‹Ð¹ Ð·Ð°Ð¿ÑƒÑÐº
result = update_trend_data.apply_async()
print(f"Task ID: {result.id}")

# Ð—Ð°Ð¿ÑƒÑÐº Ñ Ð·Ð°Ð´ÐµÑ€Ð¶ÐºÐ¾Ð¹
result = cleanup_old_analyses.apply_async(countdown=60)  # Ð§ÐµÑ€ÐµÐ· 1 Ð¼Ð¸Ð½ÑƒÑ‚Ñƒ

# Ð—Ð°Ð¿ÑƒÑÐº Ð² Ð¾Ð¿Ñ€ÐµÐ´ÐµÐ»Ñ‘Ð½Ð½Ð¾Ðµ Ð²Ñ€ÐµÐ¼Ñ
from datetime import datetime, timedelta
eta = datetime.utcnow() + timedelta(hours=2)
result = update_trend_data.apply_async(eta=eta)
```

---

**Ð”Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚ Ð¿Ð¾Ð´Ð³Ð¾Ñ‚Ð¾Ð²Ð»ÐµÐ½:** Ð¯Ð½Ð²Ð°Ñ€ÑŒ 2026  
**Ð’ÐµÑ€ÑÐ¸Ñ:** 1.0  
**Ð¡Ñ‚Ð°Ñ‚ÑƒÑ:** Ð§ÐµÑ€Ð½Ð¾Ð²Ð¸Ðº

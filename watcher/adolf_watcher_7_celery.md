---
title: "Раздел 7: Celery Tasks"
mode: "wide"
---

**Проект:** Интеллектуальная система мониторинга цен конкурентов  
**Модуль:** Watcher / Celery  
**Версия:** 2.1  
**Дата:** Январь 2026

---

## 7.1 Обзор

### Назначение

Celery обеспечивает выполнение фоновых и периодических задач модуля Watcher:

- Генерация задач парсинга по расписанию
- Проверка алертов и отправка уведомлений
- Мониторинг состояния агентов
- Очистка устаревших данных
- Расчёт приоритетов мониторинга

### Архитектура

```mermaid
graph TB
    subgraph CELERY["Celery Infrastructure"]
        BEAT["Celery Beat<br/>(Scheduler)"]
        
        subgraph WORKERS["Workers"]
            W_DEFAULT["Worker: default<br/>(2 процесса)"]
            W_CRITICAL["Worker: critical<br/>(1 процесс)"]
            W_HEAVY["Worker: heavy<br/>(1 процесс)"]
        end
    end
    
    subgraph QUEUES["Redis Queues"]
        Q_DEFAULT[("default")]
        Q_CRITICAL[("critical")]
        Q_HEAVY[("heavy")]
    end
    
    subgraph TASKS["Watcher Tasks"]
        T_GEN["generate_daily_tasks"]
        T_ALERT["check_alerts"]
        T_AGENT["sync_agent_status"]
        T_CLEAN["cleanup_old_data"]
        T_PRIO["calculate_priorities"]
        T_NOTIFY["send_notifications"]
    end
    
    subgraph STORAGE["Storage"]
        PG[("PostgreSQL")]
        REDIS[("Redis")]
    end
    
    BEAT -->|schedule| Q_DEFAULT & Q_CRITICAL & Q_HEAVY
    
    Q_DEFAULT --> W_DEFAULT
    Q_CRITICAL --> W_CRITICAL
    Q_HEAVY --> W_HEAVY
    
    W_DEFAULT --> T_GEN & T_ALERT & T_CLEAN
    W_CRITICAL --> T_AGENT & T_NOTIFY
    W_HEAVY --> T_PRIO
    
    T_GEN & T_ALERT & T_CLEAN & T_AGENT & T_PRIO --> PG
    T_GEN & T_AGENT --> REDIS
    T_NOTIFY --> REDIS
```

---

## 7.2 Конфигурация Celery

### Настройки

```python
# app/core/celery_config.py

from celery import Celery
from celery.schedules import crontab
from kombu import Queue

from app.core.config import settings


# Создание приложения Celery
celery_app = Celery(
    "adolf_watcher",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=[
        "app.tasks.watcher.generation",
        "app.tasks.watcher.alerts",
        "app.tasks.watcher.agents",
        "app.tasks.watcher.cleanup",
        "app.tasks.watcher.priorities",
        "app.tasks.watcher.notifications",
    ]
)

# Конфигурация
celery_app.conf.update(
    # Сериализация
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    
    # Таймзона
    timezone="Europe/Moscow",
    enable_utc=True,
    
    # Очереди
    task_queues=(
        Queue("default", routing_key="default"),
        Queue("critical", routing_key="critical"),
        Queue("heavy", routing_key="heavy"),
    ),
    task_default_queue="default",
    task_default_routing_key="default",
    
    # Роутинг задач
    task_routes={
        "app.tasks.watcher.agents.*": {"queue": "critical"},
        "app.tasks.watcher.notifications.*": {"queue": "critical"},
        "app.tasks.watcher.priorities.*": {"queue": "heavy"},
        "app.tasks.watcher.*": {"queue": "default"},
    },
    
    # Ретраи
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    
    # Лимиты
    worker_prefetch_multiplier=4,
    worker_max_tasks_per_child=1000,
    
    # Результаты
    result_expires=3600,  # 1 час
    
    # Мониторинг
    worker_send_task_events=True,
    task_send_sent_event=True,
)

# Расписание периодических задач
celery_app.conf.beat_schedule = {
    # === Генерация задач ===
    "watcher-generate-daily-tasks": {
        "task": "app.tasks.watcher.generation.generate_daily_tasks",
        "schedule": crontab(hour=20, minute=30),  # 20:30 MSK
        "options": {"queue": "default"}
    },
    
    # === Проверка алертов ===
    "watcher-check-alerts": {
        "task": "app.tasks.watcher.alerts.check_alerts",
        "schedule": crontab(minute="*/15"),  # Каждые 15 минут
        "options": {"queue": "default"}
    },
    
    # === Мониторинг агентов ===
    "watcher-sync-agent-status": {
        "task": "app.tasks.watcher.agents.sync_agent_status",
        "schedule": crontab(minute="*"),  # Каждую минуту
        "options": {"queue": "critical"}
    },
    
    # === Очистка данных ===
    "watcher-cleanup-old-tasks": {
        "task": "app.tasks.watcher.cleanup.cleanup_old_tasks",
        "schedule": crontab(hour=3, minute=0),  # 03:00 MSK
        "options": {"queue": "default"}
    },
    "watcher-cleanup-old-logs": {
        "task": "app.tasks.watcher.cleanup.cleanup_old_logs",
        "schedule": crontab(hour=3, minute=30),  # 03:30 MSK
        "options": {"queue": "default"}
    },
    
    # === Расчёт приоритетов (v2.0) ===
    "watcher-calculate-priorities": {
        "task": "app.tasks.watcher.priorities.calculate_priorities",
        "schedule": crontab(hour=4, minute=0),  # 04:00 MSK
        "options": {"queue": "heavy"}
    },
    
    # === Ежедневная статистика ===
    "watcher-daily-stats": {
        "task": "app.tasks.watcher.stats.generate_daily_stats",
        "schedule": crontab(hour=8, minute=0),  # 08:00 MSK
        "options": {"queue": "default"}
    },
    
    # === Проверка cookies ===
    "watcher-check-cookies-validity": {
        "task": "app.tasks.watcher.agents.check_cookies_validity",
        "schedule": crontab(hour=19, minute=30),  # 19:30 MSK (до копирования)
        "options": {"queue": "critical"}
    },
}
```

---

## 7.3 Задачи генерации

### generate_daily_tasks

```python
# app/tasks/watcher/generation.py

from celery import shared_task
from datetime import date
import logging

from app.core.database import get_db_session
from app.services.watcher.task_generator import TaskGenerator
from app.core.redis import get_redis


logger = logging.getLogger(__name__)


@shared_task(
    name="app.tasks.watcher.generation.generate_daily_tasks",
    bind=True,
    max_retries=3,
    default_retry_delay=300,  # 5 минут
    autoretry_for=(Exception,),
    acks_late=True
)
def generate_daily_tasks(self):
    """
    Генерация задач парсинга на ночь.
    
    Запускается ежедневно в 20:30.
    Создаёт задачи для всех активных подписок и их конкурентов.
    """
    logger.info("Starting daily task generation")
    
    try:
        with get_db_session() as db:
            redis = get_redis()
            generator = TaskGenerator(db=db, redis=redis)
            
            # Генерация задач
            stats = generator.generate_daily_tasks()
            
            total = sum(stats.values())
            
            logger.info(
                f"Task generation completed: {total} tasks created. "
                f"WB: {stats.get('wildberries', 0)}, "
                f"Ozon: {stats.get('ozon', 0)}, "
                f"YM: {stats.get('yandex_market', 0)}"
            )
            
            # Сохранение статистики
            redis.hset(
                f"watcher:generation:{date.today().isoformat()}",
                mapping={
                    "total": total,
                    "wildberries": stats.get("wildberries", 0),
                    "ozon": stats.get("ozon", 0),
                    "yandex_market": stats.get("yandex_market", 0),
                    "status": "completed"
                }
            )
            redis.expire(f"watcher:generation:{date.today().isoformat()}", 86400 * 7)
            
            return {
                "status": "success",
                "total_tasks": total,
                "by_marketplace": stats
            }
            
    except Exception as e:
        logger.error(f"Task generation failed: {e}")
        
        # Сохранение ошибки
        redis = get_redis()
        redis.hset(
            f"watcher:generation:{date.today().isoformat()}",
            mapping={
                "status": "failed",
                "error": str(e)
            }
        )
        
        raise


@shared_task(
    name="app.tasks.watcher.generation.regenerate_failed_tasks",
    bind=True
)
def regenerate_failed_tasks(self, scheduled_date: str = None):
    """
    Повторная генерация для провалившихся задач.
    
    Используется для ручного перезапуска.
    """
    if not scheduled_date:
        scheduled_date = date.today().isoformat()
    
    logger.info(f"Regenerating failed tasks for {scheduled_date}")
    
    with get_db_session() as db:
        # Находим провалившиеся задачи
        from sqlalchemy import select, and_
        from app.models.watcher import WatcherTask, TaskStatus
        
        query = select(WatcherTask).where(
            and_(
                WatcherTask.scheduled_date == scheduled_date,
                WatcherTask.status == TaskStatus.FAILED.value,
                WatcherTask.retry_count >= 3  # Исчерпаны попытки
            )
        )
        
        result = db.execute(query)
        failed_tasks = result.scalars().all()
        
        if not failed_tasks:
            return {"status": "no_failed_tasks"}
        
        # Сброс статуса и retry_count
        for task in failed_tasks:
            task.status = TaskStatus.PENDING.value
            task.retry_count = 0
            task.error = None
            task.agent_id = None
        
        db.commit()
        
        # Добавление обратно в очереди Redis
        redis = get_redis()
        for task in failed_tasks:
            queue_key = f"watcher:task_queue:{task.marketplace}"
            redis.rpush(queue_key, str(task.id))
        
        logger.info(f"Regenerated {len(failed_tasks)} failed tasks")
        
        return {
            "status": "success",
            "regenerated_count": len(failed_tasks)
        }
```

---

## 7.4 Задачи алертов

### check_alerts

```python
# app/tasks/watcher/alerts.py

from celery import shared_task
from datetime import datetime, timedelta
from typing import List, Dict
import logging

from app.core.database import get_db_session
from app.services.watcher.alert_engine import AlertEngine
from app.services.notifications import NotificationService


logger = logging.getLogger(__name__)


@shared_task(
    name="app.tasks.watcher.alerts.check_alerts",
    bind=True,
    max_retries=2,
    default_retry_delay=60
)
def check_alerts(self):
    """
    Проверка условий для генерации алертов.
    
    Запускается каждые 15 минут.
    Анализирует новые данные и создаёт алерты при превышении порогов.
    """
    logger.info("Starting alert check")
    
    with get_db_session() as db:
        alert_engine = AlertEngine(db=db)
        
        # Временное окно: последние 20 минут (с запасом)
        since = datetime.utcnow() - timedelta(minutes=20)
        
        # Проверка всех условий
        alerts_created = alert_engine.check_all_conditions(since=since)
        
        if alerts_created:
            logger.info(f"Created {len(alerts_created)} new alerts")
            
            # Отправка уведомлений
            for alert in alerts_created:
                send_alert_notification.delay(alert_id=str(alert.id))
        
        return {
            "status": "success",
            "alerts_created": len(alerts_created)
        }


@shared_task(
    name="app.tasks.watcher.alerts.send_alert_notification",
    bind=True,
    max_retries=3,
    default_retry_delay=30
)
def send_alert_notification(self, alert_id: str):
    """
    Отправка уведомления об алерте.
    
    Определяет получателей на основе severity и brand_id.
    """
    logger.info(f"Sending notification for alert {alert_id}")
    
    with get_db_session() as db:
        from sqlalchemy import select
        from app.models.watcher import WatcherAlert
        from app.models.users import User
        
        # Получение алерта
        query = select(WatcherAlert).where(WatcherAlert.id == alert_id)
        result = db.execute(query)
        alert = result.scalar_one_or_none()
        
        if not alert:
            logger.warning(f"Alert {alert_id} not found")
            return {"status": "alert_not_found"}
        
        # Определение получателей
        recipients = _get_alert_recipients(
            db=db,
            severity=alert.severity,
            brand_id=alert.brand_id,
            alert_type=alert.alert_type
        )
        
        if not recipients:
            logger.info(f"No recipients for alert {alert_id}")
            return {"status": "no_recipients"}
        
        # Отправка уведомлений
        notification_service = NotificationService()
        
        for user_id in recipients:
            notification_service.send(
                user_id=user_id,
                event_type=f"watcher_alert_{alert.alert_type}",
                data={
                    "alert_id": str(alert.id),
                    "sku": alert.sku,
                    "marketplace": alert.marketplace,
                    "alert_type": alert.alert_type,
                    "severity": alert.severity,
                    "details": alert.details
                }
            )
        
        logger.info(f"Sent notifications to {len(recipients)} users")
        
        return {
            "status": "success",
            "recipients_count": len(recipients)
        }


def _get_alert_recipients(
    db,
    severity: str,
    brand_id: str,
    alert_type: str
) -> List[str]:
    """Определение получателей алерта."""
    from sqlalchemy import select, or_
    from app.models.users import User
    
    recipients = []
    
    # Правила получателей по severity
    if severity == "critical":
        # Критичные: Manager по бренду + Senior + Director + Admin
        roles = ["manager", "senior", "director", "admin"]
    elif severity == "warning":
        # Предупреждения: Manager по бренду + Senior
        roles = ["manager", "senior"]
    else:
        # Информационные: только Manager по бренду
        roles = ["manager"]
    
    # Запрос пользователей
    query = select(User).where(
        User.role.in_(roles),
        User.is_active == True
    )
    
    result = db.execute(query)
    users = result.scalars().all()
    
    for user in users:
        # Фильтрация Manager по бренду
        if user.role == "manager":
            if user.brand_id == brand_id or user.brand_id == "all":
                recipients.append(str(user.id))
        else:
            # Senior, Director, Admin получают все
            recipients.append(str(user.id))
    
    return list(set(recipients))


@shared_task(
    name="app.tasks.watcher.alerts.process_dumping_alert",
    bind=True
)
def process_dumping_alert(self, alert_id: str):
    """
    Дополнительная обработка алерта о демпинге.
    
    Может включать:
    - Автоматическое создание задачи для Marketing
    - Уведомление в Slack/Telegram
    - Логирование в отдельную систему
    """
    logger.info(f"Processing dumping alert {alert_id}")
    
    with get_db_session() as db:
        from sqlalchemy import select
        from app.models.watcher import WatcherAlert
        
        query = select(WatcherAlert).where(WatcherAlert.id == alert_id)
        result = db.execute(query)
        alert = result.scalar_one_or_none()
        
        if not alert or alert.alert_type != "dumping_detected":
            return {"status": "not_dumping_alert"}
        
        details = alert.details
        
        # Создание задачи для Marketing модуля (если интегрирован)
        # marketing_task = create_bid_adjustment_task(
        #     sku=alert.sku,
        #     marketplace=alert.marketplace,
        #     competitor_price=details.get("new_price"),
        #     reason="dumping_response"
        # )
        
        logger.info(f"Dumping alert {alert_id} processed")
        
        return {"status": "success"}
```

---

## 7.5 Задачи мониторинга агентов

### sync_agent_status

```python
# app/tasks/watcher/agents.py

from celery import shared_task
from datetime import datetime, timedelta
import logging

from app.core.database import get_db_session
from app.core.redis import get_redis
from app.services.watcher.agent_manager import AgentManager


logger = logging.getLogger(__name__)


@shared_task(
    name="app.tasks.watcher.agents.sync_agent_status",
    bind=True,
    max_retries=1
)
def sync_agent_status(self):
    """
    Синхронизация статуса агентов.
    
    Запускается каждую минуту.
    Проверяет heartbeat и помечает offline агентов.
    """
    with get_db_session() as db:
        redis = get_redis()
        agent_manager = AgentManager(db=db, redis=redis)
        
        # Проверка offline агентов
        offline_agents = agent_manager.check_offline_agents()
        
        if offline_agents:
            logger.warning(f"Agents went offline: {offline_agents}")
            
            # Перераспределение задач offline агентов
            for agent_id in offline_agents:
                redistribute_agent_tasks.delay(agent_id=agent_id)
        
        # Обновление общей статистики
        stats = agent_manager.get_aggregate_stats()
        
        redis.hset(
            "watcher:agents:stats",
            mapping={
                "total": stats["total"],
                "online": stats["online"],
                "offline": stats["offline"],
                "working": stats["working"],
                "updated_at": datetime.utcnow().isoformat()
            }
        )
        redis.expire("watcher:agents:stats", 120)
        
        return {
            "status": "success",
            "offline_count": len(offline_agents),
            "stats": stats
        }


@shared_task(
    name="app.tasks.watcher.agents.redistribute_agent_tasks",
    bind=True
)
def redistribute_agent_tasks(self, agent_id: str):
    """
    Перераспределение задач агента при его отключении.
    
    Возвращает in_progress задачи обратно в очередь.
    """
    logger.info(f"Redistributing tasks from agent {agent_id}")
    
    with get_db_session() as db:
        from sqlalchemy import select, update
        from app.models.watcher import WatcherTask, TaskStatus
        
        # Находим задачи агента
        query = select(WatcherTask).where(
            WatcherTask.agent_id == agent_id,
            WatcherTask.status == TaskStatus.IN_PROGRESS.value
        )
        
        result = db.execute(query)
        tasks = result.scalars().all()
        
        if not tasks:
            return {"status": "no_tasks"}
        
        redis = get_redis()
        
        # Возврат задач в очереди
        for task in tasks:
            # Сброс статуса
            task.status = TaskStatus.PENDING.value
            task.agent_id = None
            task.started_at = None
            
            # Добавление в очередь
            queue_key = f"watcher:task_queue:{task.marketplace}"
            redis.lpush(queue_key, str(task.id))  # В начало очереди
        
        db.commit()
        
        logger.info(f"Redistributed {len(tasks)} tasks from agent {agent_id}")
        
        return {
            "status": "success",
            "redistributed_count": len(tasks)
        }


@shared_task(
    name="app.tasks.watcher.agents.check_cookies_validity",
    bind=True
)
def check_cookies_validity(self):
    """
    Проверка валидности cookies агентов.
    
    Запускается в 19:30, до копирования cookies.
    Уведомляет администратора о проблемах.
    """
    logger.info("Checking cookies validity")
    
    with get_db_session() as db:
        from sqlalchemy import select
        from app.models.watcher import WatcherAgent
        
        query = select(WatcherAgent).where(WatcherAgent.cookies_valid == False)
        result = db.execute(query)
        invalid_agents = result.scalars().all()
        
        if invalid_agents:
            agent_names = [a.name for a in invalid_agents]
            logger.warning(f"Agents with invalid cookies: {agent_names}")
            
            # Уведомление администратора
            send_alert_notification.delay(
                alert_id=None,
                custom_notification={
                    "type": "cookies_warning",
                    "message": f"Агенты с невалидными cookies: {', '.join(agent_names)}",
                    "agents": agent_names,
                    "severity": "warning"
                }
            )
        
        return {
            "status": "success",
            "invalid_count": len(invalid_agents)
        }


@shared_task(
    name="app.tasks.watcher.agents.handle_panic_mode",
    bind=True
)
def handle_panic_mode(self, agent_id: str, reason: str, details: dict):
    """
    Обработка Panic Mode агента.
    
    Вызывается при получении сигнала PANIC от агента.
    """
    logger.warning(f"Handling panic mode for agent {agent_id}: {reason}")
    
    with get_db_session() as db:
        redis = get_redis()
        
        from sqlalchemy import select, update
        from app.models.watcher import WatcherAgent, WatcherAgentLog
        
        # Обновление статуса агента
        query = (
            update(WatcherAgent)
            .where(WatcherAgent.id == agent_id)
            .values(status="panic")
        )
        db.execute(query)
        
        # Логирование события
        log = WatcherAgentLog(
            agent_id=agent_id,
            event_type="panic",
            severity="error",
            message=reason,
            details=details
        )
        db.add(log)
        db.commit()
        
        # Блокировка IP (если известен)
        agent_ip = details.get("ip")
        if agent_ip:
            redis.setex(
                f"watcher:ip_blocked:{agent_ip}",
                3600,  # 1 час
                reason
            )
        
        # Перераспределение задач
        redistribute_agent_tasks.delay(agent_id=agent_id)
        
        # Уведомление администратора
        from app.services.notifications import NotificationService
        notification_service = NotificationService()
        
        notification_service.send_to_admins(
            event_type="watcher_agent_panic",
            data={
                "agent_id": agent_id,
                "reason": reason,
                "details": details
            }
        )
        
        return {"status": "success"}
```

---

## 7.6 Задачи очистки данных

### cleanup_old_tasks

```python
# app/tasks/watcher/cleanup.py

from celery import shared_task
from datetime import datetime, timedelta, date
import logging

from app.core.database import get_db_session


logger = logging.getLogger(__name__)


@shared_task(
    name="app.tasks.watcher.cleanup.cleanup_old_tasks",
    bind=True,
    max_retries=2
)
def cleanup_old_tasks(self, days: int = 90):
    """
    Удаление старых задач.
    
    Запускается ежедневно в 03:00.
    Удаляет задачи старше 90 дней.
    """
    logger.info(f"Cleaning up tasks older than {days} days")
    
    with get_db_session() as db:
        from sqlalchemy import delete
        from app.models.watcher import WatcherTask
        
        cutoff_date = date.today() - timedelta(days=days)
        
        query = delete(WatcherTask).where(
            WatcherTask.scheduled_date < cutoff_date
        )
        
        result = db.execute(query)
        deleted_count = result.rowcount
        db.commit()
        
        logger.info(f"Deleted {deleted_count} old tasks")
        
        # VACUUM (через raw SQL)
        db.execute("VACUUM ANALYZE watcher_tasks")
        
        return {
            "status": "success",
            "deleted_count": deleted_count,
            "cutoff_date": cutoff_date.isoformat()
        }


@shared_task(
    name="app.tasks.watcher.cleanup.cleanup_old_logs",
    bind=True,
    max_retries=2
)
def cleanup_old_logs(self, days: int = 30):
    """
    Удаление старых логов агентов.
    
    Запускается ежедневно в 03:30.
    Удаляет логи старше 30 дней.
    """
    logger.info(f"Cleaning up agent logs older than {days} days")
    
    with get_db_session() as db:
        from sqlalchemy import delete
        from app.models.watcher import WatcherAgentLog
        
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        query = delete(WatcherAgentLog).where(
            WatcherAgentLog.created_at < cutoff_date
        )
        
        result = db.execute(query)
        deleted_count = result.rowcount
        db.commit()
        
        logger.info(f"Deleted {deleted_count} old agent logs")
        
        return {
            "status": "success",
            "deleted_count": deleted_count
        }


@shared_task(
    name="app.tasks.watcher.cleanup.cleanup_resolved_alerts",
    bind=True
)
def cleanup_resolved_alerts(self, days: int = 365):
    """
    Удаление разрешённых алертов старше года.
    
    Запускается еженедельно.
    """
    logger.info(f"Cleaning up resolved alerts older than {days} days")
    
    with get_db_session() as db:
        from sqlalchemy import delete, and_
        from app.models.watcher import WatcherAlert
        
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        query = delete(WatcherAlert).where(
            and_(
                WatcherAlert.is_resolved == True,
                WatcherAlert.created_at < cutoff_date
            )
        )
        
        result = db.execute(query)
        deleted_count = result.rowcount
        db.commit()
        
        logger.info(f"Deleted {deleted_count} old resolved alerts")
        
        return {
            "status": "success",
            "deleted_count": deleted_count
        }


@shared_task(
    name="app.tasks.watcher.cleanup.cleanup_redis_keys",
    bind=True
)
def cleanup_redis_keys(self):
    """
    Очистка устаревших ключей в Redis.
    
    Удаляет ключи с истёкшим TTL и orphan данные.
    """
    logger.info("Cleaning up Redis keys")
    
    redis = get_redis()
    deleted_count = 0
    
    # Очистка старых статистик
    pattern = "watcher:stats:*"
    keys = redis.keys(pattern)
    
    for key in keys:
        # Проверка TTL
        ttl = redis.ttl(key)
        if ttl == -1:  # Нет TTL
            # Проверка возраста по содержимому
            data = redis.hgetall(key)
            if data:
                # Удаляем если старше 7 дней
                redis.delete(key)
                deleted_count += 1
    
    # Очистка orphan agent states
    pattern = "watcher:agent:*:state"
    keys = redis.keys(pattern)
    
    with get_db_session() as db:
        from sqlalchemy import select
        from app.models.watcher import WatcherAgent
        
        query = select(WatcherAgent.id)
        result = db.execute(query)
        valid_agent_ids = {str(row[0]) for row in result}
    
    for key in keys:
        # Извлечение agent_id из ключа
        parts = key.split(":")
        if len(parts) >= 3:
            agent_id = parts[2]
            if agent_id not in valid_agent_ids:
                redis.delete(key)
                deleted_count += 1
    
    logger.info(f"Deleted {deleted_count} Redis keys")
    
    return {
        "status": "success",
        "deleted_count": deleted_count
    }
```

---

## 7.7 Задачи расчёта приоритетов (v2.0)

### calculate_priorities

```python
# app/tasks/watcher/priorities.py

from celery import shared_task
from datetime import datetime, timedelta
from typing import Dict
import logging

from app.core.database import get_db_session


logger = logging.getLogger(__name__)


@shared_task(
    name="app.tasks.watcher.priorities.calculate_priorities",
    bind=True,
    max_retries=2,
    soft_time_limit=1800,  # 30 минут
    time_limit=2100  # 35 минут
)
def calculate_priorities(self):
    """
    Расчёт приоритетов мониторинга для v2.0.
    
    Запускается ежедневно в 04:00.
    Анализирует активность конкурентов и корректирует приоритеты.
    
    Факторы приоритета:
    - Частота изменения цен
    - Величина скидок
    - Близость цены к нашей
    - История демпинга
    """
    logger.info("Starting priority calculation")
    
    with get_db_session() as db:
        from sqlalchemy import select, update, func
        from app.models.watcher import (
            WatcherCompetitor,
            WatcherPriceHistory,
            WatcherAlert
        )
        
        # Получение всех активных конкурентов
        query = select(WatcherCompetitor).where(
            WatcherCompetitor.is_active == True
        )
        result = db.execute(query)
        competitors = result.scalars().all()
        
        updated_count = 0
        
        for competitor in competitors:
            new_priority = _calculate_competitor_priority(
                db=db,
                competitor=competitor
            )
            
            if new_priority != competitor.priority:
                competitor.priority = new_priority
                updated_count += 1
        
        db.commit()
        
        logger.info(f"Updated priorities for {updated_count} competitors")
        
        return {
            "status": "success",
            "updated_count": updated_count,
            "total_competitors": len(competitors)
        }


def _calculate_competitor_priority(db, competitor) -> int:
    """
    Расчёт приоритета для конкурента.
    
    Returns:
        Приоритет от 0 (низкий) до 100 (высокий)
    """
    from sqlalchemy import select, func, and_
    from app.models.watcher import WatcherPriceHistory, WatcherAlert
    
    score = 50  # Базовый приоритет
    
    # Период анализа: последние 30 дней
    since = datetime.utcnow() - timedelta(days=30)
    
    # 1. Частота изменения цен (+/- 20)
    price_changes = _count_price_changes(db, competitor.id, since)
    if price_changes >= 10:
        score += 20
    elif price_changes >= 5:
        score += 10
    elif price_changes == 0:
        score -= 10
    
    # 2. Величина скидок (+/- 15)
    avg_discount = _get_avg_discount(db, competitor.id, since)
    if avg_discount and avg_discount >= 30:
        score += 15
    elif avg_discount and avg_discount >= 15:
        score += 5
    
    # 3. Близость к нашей цене (+/- 15)
    price_diff_pct = _get_price_difference(db, competitor)
    if price_diff_pct is not None:
        if abs(price_diff_pct) <= 5:
            score += 15  # Очень близко
        elif abs(price_diff_pct) <= 15:
            score += 5  # Близко
        elif abs(price_diff_pct) > 50:
            score -= 10  # Далеко
    
    # 4. История демпинга (+20)
    dumping_alerts = _count_dumping_alerts(db, competitor.id, since)
    if dumping_alerts >= 2:
        score += 20
    elif dumping_alerts >= 1:
        score += 10
    
    # Нормализация в диапазон 0-100
    return max(0, min(100, score))


def _count_price_changes(db, competitor_id: str, since: datetime) -> int:
    """Подсчёт изменений цены."""
    from sqlalchemy import select, func
    from app.models.watcher import WatcherPriceHistory
    
    # Получаем историю цен
    query = select(WatcherPriceHistory.current_price).where(
        WatcherPriceHistory.competitor_id == competitor_id,
        WatcherPriceHistory.parsed_at >= since,
        WatcherPriceHistory.current_price.isnot(None)
    ).order_by(WatcherPriceHistory.parsed_at)
    
    result = db.execute(query)
    prices = [row[0] for row in result]
    
    if len(prices) < 2:
        return 0
    
    # Подсчёт изменений
    changes = 0
    for i in range(1, len(prices)):
        if prices[i] != prices[i-1]:
            changes += 1
    
    return changes


def _get_avg_discount(db, competitor_id: str, since: datetime) -> float | None:
    """Средний процент скидки."""
    from sqlalchemy import select, func
    from app.models.watcher import WatcherPriceHistory
    
    query = select(func.avg(WatcherPriceHistory.discount_percent)).where(
        WatcherPriceHistory.competitor_id == competitor_id,
        WatcherPriceHistory.parsed_at >= since,
        WatcherPriceHistory.discount_percent.isnot(None)
    )
    
    result = db.execute(query)
    avg = result.scalar()
    
    return float(avg) if avg else None


def _get_price_difference(db, competitor) -> float | None:
    """Разница в цене с нашим товаром (%)."""
    from sqlalchemy import select
    from app.models.watcher import WatcherPriceHistory
    
    # Последняя цена конкурента
    query = select(WatcherPriceHistory.current_price).where(
        WatcherPriceHistory.competitor_id == competitor.id,
        WatcherPriceHistory.current_price.isnot(None)
    ).order_by(WatcherPriceHistory.parsed_at.desc()).limit(1)
    
    result = db.execute(query)
    comp_price = result.scalar()
    
    if not comp_price:
        return None
    
    # Последняя наша цена
    query = select(WatcherPriceHistory.current_price).where(
        WatcherPriceHistory.sku == competitor.our_sku,
        WatcherPriceHistory.marketplace == competitor.marketplace,
        WatcherPriceHistory.competitor_id.is_(None),
        WatcherPriceHistory.current_price.isnot(None)
    ).order_by(WatcherPriceHistory.parsed_at.desc()).limit(1)
    
    result = db.execute(query)
    our_price = result.scalar()
    
    if not our_price:
        return None
    
    return ((comp_price - our_price) / our_price) * 100


def _count_dumping_alerts(db, competitor_id: str, since: datetime) -> int:
    """Количество алертов о демпинге."""
    from sqlalchemy import select, func
    from app.models.watcher import WatcherAlert
    
    query = select(func.count()).where(
        WatcherAlert.competitor_id == competitor_id,
        WatcherAlert.alert_type == "dumping_detected",
        WatcherAlert.created_at >= since
    )
    
    result = db.execute(query)
    return result.scalar() or 0
```

---

## 7.8 Задачи статистики

### generate_daily_stats

```python
# app/tasks/watcher/stats.py

from celery import shared_task
from datetime import datetime, date, timedelta
import logging

from app.core.database import get_db_session
from app.core.redis import get_redis


logger = logging.getLogger(__name__)


@shared_task(
    name="app.tasks.watcher.stats.generate_daily_stats",
    bind=True
)
def generate_daily_stats(self, target_date: str = None):
    """
    Генерация ежедневной статистики.
    
    Запускается в 08:00 для статистики за предыдущий день.
    """
    if target_date:
        stats_date = date.fromisoformat(target_date)
    else:
        stats_date = date.today() - timedelta(days=1)
    
    logger.info(f"Generating daily stats for {stats_date}")
    
    with get_db_session() as db:
        from sqlalchemy import select, func, and_
        from app.models.watcher import (
            WatcherTask, WatcherPriceHistory, WatcherAlert, TaskStatus
        )
        
        stats = {}
        
        # Статистика задач
        task_query = select(
            WatcherTask.status,
            func.count().label("count"),
            func.avg(WatcherTask.execution_time_ms).label("avg_time")
        ).where(
            WatcherTask.scheduled_date == stats_date
        ).group_by(WatcherTask.status)
        
        result = db.execute(task_query)
        task_stats = {row.status: {"count": row.count, "avg_time": row.avg_time} for row in result}
        
        stats["tasks"] = {
            "total": sum(t["count"] for t in task_stats.values()),
            "completed": task_stats.get(TaskStatus.COMPLETED.value, {}).get("count", 0),
            "failed": task_stats.get(TaskStatus.FAILED.value, {}).get("count", 0),
            "avg_time_ms": task_stats.get(TaskStatus.COMPLETED.value, {}).get("avg_time")
        }
        
        # Статистика по маркетплейсам
        mp_query = select(
            WatcherTask.marketplace,
            func.count().label("count")
        ).where(
            WatcherTask.scheduled_date == stats_date,
            WatcherTask.status == TaskStatus.COMPLETED.value
        ).group_by(WatcherTask.marketplace)
        
        result = db.execute(mp_query)
        stats["by_marketplace"] = {row.marketplace: row.count for row in result}
        
        # Статистика алертов
        alert_query = select(
            WatcherAlert.alert_type,
            func.count().label("count")
        ).where(
            func.date(WatcherAlert.created_at) == stats_date
        ).group_by(WatcherAlert.alert_type)
        
        result = db.execute(alert_query)
        stats["alerts"] = {row.alert_type: row.count for row in result}
        stats["alerts_total"] = sum(stats["alerts"].values())
        
        # Сохранение в Redis
        redis = get_redis()
        redis.hset(
            f"watcher:daily_stats:{stats_date.isoformat()}",
            mapping={k: str(v) if not isinstance(v, dict) else str(v) for k, v in stats.items()}
        )
        redis.expire(f"watcher:daily_stats:{stats_date.isoformat()}", 86400 * 90)  # 90 дней
        
        # Сохранение в PostgreSQL (опционально)
        # _save_stats_to_db(db, stats_date, stats)
        
        logger.info(f"Daily stats generated: {stats}")
        
        return {
            "status": "success",
            "date": stats_date.isoformat(),
            "stats": stats
        }


@shared_task(
    name="app.tasks.watcher.stats.generate_weekly_report",
    bind=True
)
def generate_weekly_report(self):
    """
    Генерация еженедельного отчёта.
    
    Запускается по понедельникам в 09:00.
    """
    logger.info("Generating weekly report")
    
    redis = get_redis()
    
    # Сбор статистики за неделю
    today = date.today()
    week_stats = []
    
    for i in range(7):
        day = today - timedelta(days=i+1)
        key = f"watcher:daily_stats:{day.isoformat()}"
        stats = redis.hgetall(key)
        if stats:
            week_stats.append(stats)
    
    if not week_stats:
        return {"status": "no_data"}
    
    # Агрегация
    report = {
        "period": f"{today - timedelta(days=7)} — {today - timedelta(days=1)}",
        "total_tasks": sum(int(s.get("tasks", "0")) for s in week_stats),
        "total_alerts": sum(int(s.get("alerts_total", "0")) for s in week_stats),
        # ... дополнительная агрегация
    }
    
    # Отправка отчёта (опционально)
    # send_weekly_report_email.delay(report)
    
    return {
        "status": "success",
        "report": report
    }
```

---

## 7.9 Мониторинг Celery

### Flower конфигурация

```python
# docker-compose.yml (фрагмент)

services:
  flower:
    image: mher/flower:0.9.7
    command: celery flower --broker=redis://redis:6379/0 --port=5555
    ports:
      - "5555:5555"
    environment:
      - CELERY_BROKER_URL=redis://redis:6379/0
      - FLOWER_BASIC_AUTH=admin:password
    depends_on:
      - redis
```

### Health Check задача

```python
# app/tasks/watcher/health.py

from celery import shared_task
import logging

from app.core.redis import get_redis
from app.core.database import get_db_session


logger = logging.getLogger(__name__)


@shared_task(
    name="app.tasks.watcher.health.health_check",
    bind=True
)
def health_check(self):
    """
    Проверка здоровья системы.
    
    Проверяет доступность всех компонентов.
    """
    checks = {}
    
    # Redis
    try:
        redis = get_redis()
        redis.ping()
        checks["redis"] = "ok"
    except Exception as e:
        checks["redis"] = f"error: {e}"
    
    # PostgreSQL
    try:
        with get_db_session() as db:
            db.execute("SELECT 1")
        checks["postgresql"] = "ok"
    except Exception as e:
        checks["postgresql"] = f"error: {e}"
    
    # Очереди
    try:
        redis = get_redis()
        for mp in ["wildberries", "ozon", "yandex_market"]:
            queue_len = redis.llen(f"watcher:task_queue:{mp}")
            checks[f"queue_{mp}"] = queue_len
    except Exception as e:
        checks["queues"] = f"error: {e}"
    
    all_ok = all(
        v == "ok" for k, v in checks.items() 
        if k in ["redis", "postgresql"]
    )
    
    return {
        "status": "healthy" if all_ok else "unhealthy",
        "checks": checks
    }
```

---

## 7.10 Запуск Workers

### Docker Compose

```yaml
# docker-compose.yml (фрагмент)

services:
  celery-worker-default:
    build: .
    command: celery -A app.core.celery_config worker -Q default -c 2 --loglevel=info
    environment:
      - REDIS_URL=redis://redis:6379/0
      - DATABASE_URL=postgresql://adolf:password@postgres:5432/adolf
    depends_on:
      - redis
      - postgres
    volumes:
      - ./app:/app/app
    restart: unless-stopped

  celery-worker-critical:
    build: .
    command: celery -A app.core.celery_config worker -Q critical -c 1 --loglevel=info
    environment:
      - REDIS_URL=redis://redis:6379/0
      - DATABASE_URL=postgresql://adolf:password@postgres:5432/adolf
    depends_on:
      - redis
      - postgres
    restart: unless-stopped

  celery-worker-heavy:
    build: .
    command: celery -A app.core.celery_config worker -Q heavy -c 1 --loglevel=info
    environment:
      - REDIS_URL=redis://redis:6379/0
      - DATABASE_URL=postgresql://adolf:password@postgres:5432/adolf
    depends_on:
      - redis
      - postgres
    restart: unless-stopped

  celery-beat:
    build: .
    command: celery -A app.core.celery_config beat --loglevel=info
    environment:
      - REDIS_URL=redis://redis:6379/0
      - DATABASE_URL=postgresql://adolf:password@postgres:5432/adolf
    depends_on:
      - redis
      - postgres
    restart: unless-stopped
```

### Systemd Service (альтернатива)

```ini
# /etc/systemd/system/watcher-celery-worker.service

[Unit]
Description=Watcher Celery Worker
After=network.target redis.service postgresql.service

[Service]
Type=forking
User=adolf
Group=adolf
WorkingDirectory=/opt/adolf
ExecStart=/opt/adolf/venv/bin/celery -A app.core.celery_config worker -Q default,critical -c 3 --loglevel=info --detach
ExecStop=/opt/adolf/venv/bin/celery -A app.core.celery_config control shutdown
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

---

## 7.11 Расписание задач (сводка)

| Задача | Расписание | Очередь | Описание |
|--------|------------|---------|----------|
| `generate_daily_tasks` | 20:30 | default | Генерация задач на ночь |
| `check_alerts` | */15 мин | default | Проверка алертов |
| `sync_agent_status` | */1 мин | critical | Мониторинг агентов |
| `cleanup_old_tasks` | 03:00 | default | Очистка задач (90 дней) |
| `cleanup_old_logs` | 03:30 | default | Очистка логов (30 дней) |
| `calculate_priorities` | 04:00 | heavy | Расчёт приоритетов |
| `generate_daily_stats` | 08:00 | default | Ежедневная статистика |
| `check_cookies_validity` | 19:30 | critical | Проверка cookies |
| `office_heartbeat` | */1 мин | default | Статус в Office Dashboard |

---

## Приложение А: Контрольные точки Celery

| Критерий | Проверка |
|----------|----------|
| Workers запущены | `celery -A app inspect active` |
| Beat запущен | Логи показывают scheduled tasks |
| Очереди работают | `celery -A app inspect reserved` |
| Задачи выполняются | Flower dashboard |
| Генерация работает | Задачи появляются в 20:30 |
| Алерты проверяются | Логи каждые 15 минут |
| Очистка работает | Старые данные удаляются |
| Office статус | Агенты отображаются в Office Dashboard |

---

## Приложение B: Интеграция с Office Dashboard

### B.1 Агенты Watcher

| agent_id | name | salary_equivalent | fte_coefficient |
|----------|------|-------------------|-----------------|
| watcher_price_monitor | Мониторинг цен | 60000 | 1.0 |
| watcher_night_agent | Ночной агент | 60000 | 0.5 |
| watcher_competitor_scan | Сканер конкурентов | 60000 | 1.0 |

### B.2 Инициализация репортеров

```python
# app/tasks/watcher/office.py

from app.utils.office_reporter import OfficeReporter

# Репортеры для агентов Watcher
OFFICE_REPORTERS = {
    "price_monitor": OfficeReporter(
        agent_id="watcher_price_monitor",
        department="watcher",
        name="Мониторинг цен",
        salary_equivalent=60000,
        fte_coefficient=1.0
    ),
    "night_agent": OfficeReporter(
        agent_id="watcher_night_agent",
        department="watcher",
        name="Ночной агент",
        salary_equivalent=60000,
        fte_coefficient=0.5
    ),
    "competitor_scan": OfficeReporter(
        agent_id="watcher_competitor_scan",
        department="watcher",
        name="Сканер конкурентов",
        salary_equivalent=60000,
        fte_coefficient=1.0
    )
}
```

### B.3 Интеграция в задачу generate_daily_tasks

```python
# app/tasks/watcher/generation.py

from .office import OFFICE_REPORTERS

@shared_task
def generate_daily_tasks():
    reporter = OFFICE_REPORTERS["price_monitor"]
    
    try:
        reporter.report_working("Генерация задач на ночь")
        
        # ... логика генерации ...
        tasks_created = create_parsing_tasks()
        
        reporter.report_idle(metrics={
            "products_monitored": get_monitored_count(),
            "tasks_generated": len(tasks_created),
            "price_changes_today": get_daily_changes()
        })
        
        return {"success": True, "tasks": len(tasks_created)}
        
    except Exception as e:
        reporter.report_error(str(e))
        raise
```

### B.4 Интеграция с ночным агентом

```python
# Ночной агент активируется в 00:00-06:00

@shared_task
def night_parsing_batch():
    reporter = OFFICE_REPORTERS["night_agent"]
    
    try:
        reporter.report_working("Ночное сканирование цен")
        
        # ... логика ...
        
        reporter.report_idle(metrics={
            "products_scanned": scanned_count,
            "price_changes_found": changes_count
        })
        
    except Exception as e:
        reporter.report_error(str(e))
        raise
```

### B.5 Heartbeat задача

```python
# app/tasks/watcher/office.py

from celery import shared_task

@shared_task(name='watcher.tasks.office_heartbeat')
def office_heartbeat():
    """Обновление статуса агентов в Office Dashboard."""
    for reporter in OFFICE_REPORTERS.values():
        reporter.heartbeat()
    return {"success": True, "agents": len(OFFICE_REPORTERS)}
```

### B.6 Celery Beat Schedule

```python
# Добавить в beat_schedule:

"watcher-office-heartbeat": {
    "task": "watcher.tasks.office_heartbeat",
    "schedule": 60.0,  # Каждую минуту
    "options": {"queue": "default"}
},
```

### B.7 Метрики для Office

| Метрика | Описание | Источник |
|---------|----------|----------|
| products_monitored | Товаров на мониторинге | БД: COUNT active products |
| price_changes_today | Изменений цен за день | БД: COUNT changes WHERE date=today |
| tasks_generated | Задач сгенерировано | Redis: tasks counter |
| queue_size | Задач в очереди | Redis: pending tasks |

---

**Документ подготовлен:** Январь 2026  
**Версия:** 2.1  
**Статус:** Черновик

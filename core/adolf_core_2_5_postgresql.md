---
title: "Раздел 2.5: PostgreSQL"
mode: "wide"
---

**Проект:** Ядро корпоративной AI-системы  
**Модуль:** Database Layer  
**Версия:** 4.1  
**Дата:** Январь 2026

---

## 1. Обзор

### 1.1 Назначение

PostgreSQL — основное хранилище структурированных данных системы Adolf:

- Пользователи и сессии
- Метаданные документов
- Журналы аудита
- Уведомления и настройки
- Состояние polling и аналитика (модуль Reputation)

### 1.2 Инфраструктура

| Параметр | Значение |
|----------|----------|
| Сервис | Timeweb Managed PostgreSQL |
| Версия | PostgreSQL 15+ |
| RAM | 2 GB (стартовая конфигурация) |
| Storage | 20 GB NVMe (автомасштабирование) |
| Бэкапы | Ежедневные, хранение 7 дней |
| Репликация | Не требуется (v4.0) |

### 1.3 Подключение

```bash
# Connection string
DATABASE_URL=postgresql://adolf:password@pg-host.timeweb.cloud:5432/adolf

# Параметры пула соединений
POOL_SIZE=10
MAX_OVERFLOW=20
POOL_TIMEOUT=30
```

---

## 2. ER-диаграмма

### 2.1 Core-таблицы

```mermaid
erDiagram
    users ||--o{ sessions : "has"
    users ||--o{ documents : "uploads"
    users ||--o{ documents : "moderates"
    users ||--o{ quarantine : "uploads"
    users ||--o{ audit_log : "performs"
    users ||--o{ notifications : "receives"
    users ||--o{ settings : "updates"
    
    users {
        int id PK
        varchar username UK
        varchar password_hash
        varchar owui_id UK
        varchar role
        varchar brand_id
        boolean is_active
        timestamp created_at
        timestamp last_login
    }
    
    sessions {
        int id PK
        int user_id FK
        varchar token UK
        varchar device_info
        timestamp created_at
        timestamp expires_at
    }
    
    documents {
        int id PK
        varchar original_name
        varchar stored_name
        varchar kb_document_id
        varchar archive_path
        varchar category
        varchar access_level
        varchar brand_id
        varchar processing_type
        int uploaded_by_id FK
        int moderated_by_id FK
        varchar status
        timestamp created_at
    }
    
    quarantine {
        int id PK
        varchar original_name
        varchar quarantine_path
        int uploaded_by_id FK
        varchar error_code
        text error_message
        jsonb error_details
        int retry_count
        timestamp created_at
        timestamp expires_at
    }
    
    audit_log {
        int id PK
        timestamp timestamp
        varchar module
        varchar action
        int user_id FK
        varchar brand_id
        jsonb details
        varchar ip_address
    }
    
    notifications {
        int id PK
        int user_id FK
        varchar event_type
        varchar level
        varchar title
        text message
        jsonb data
        boolean is_read
        timestamp created_at
    }
    
    settings {
        varchar key PK
        jsonb value
        varchar category
        text description
        timestamp updated_at
        int updated_by_id FK
    }
    
    celery_task_log {
        int id PK
        varchar task_id UK
        varchar task_name
        varchar status
        jsonb args
        timestamp created_at
        timestamp completed_at
    }
```

---

## 3. Схема таблиц

### 3.1 Core: Пользователи и авторизация

#### users

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    
    -- Идентификация
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    owui_id VARCHAR(100) UNIQUE,          -- ID в Open WebUI
    
    -- Права доступа
    role VARCHAR(20) NOT NULL 
        CHECK (role IN ('staff', 'manager', 'senior', 'director', 'administrator', 'service')),
    brand_id VARCHAR(50) 
        CHECK (brand_id IN ('ohana_market', 'ohana_kids', 'all') OR brand_id IS NULL),
    
    -- Статус
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Контактные данные
    email VARCHAR(255),
    full_name VARCHAR(100),
    
    -- Метаданные
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Индексы
CREATE INDEX idx_users_owui_id ON users(owui_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_brand_id ON users(brand_id);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Триггер обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
```

**Роли пользователей:**

| Роль | Уровень | Описание |
|------|:-------:|----------|
| `staff` | 1 | Базовый доступ |
| `manager` | 2 | Работа с отзывами, контентом |
| `senior` | 3 | Расширенный доступ, модерация |
| `director` | 4 | Полный доступ к документам |
| `administrator` | 5 | Управление системой |
| `service` | — | Service Account для межмодульного API |

#### sessions

```sql
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Токен
    token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255),
    
    -- Устройство
    device_info VARCHAR(255),
    ip_address VARCHAR(50),
    user_agent TEXT,
    
    -- Время жизни
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

### 3.2 Core: Документы

#### documents

```sql
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    
    -- Файл
    original_name VARCHAR(255) NOT NULL,
    stored_name VARCHAR(255),
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    
    -- Timeweb KB
    kb_document_id VARCHAR(100),
    
    -- Архив
    archive_path VARCHAR(500),
    
    -- Обработка
    processing_type VARCHAR(20) CHECK (processing_type IN ('direct', 'convert')),
    converted_format VARCHAR(10),
    
    -- Классификация
    category VARCHAR(50) 
        CHECK (category IN ('finance', 'contract', 'regulation', 'product', 
                            'correspondence', 'analytics', 'hr', 'logistics', 
                            'marketing', 'other')),
    access_level VARCHAR(20) 
        CHECK (access_level IN ('staff', 'manager', 'senior', 'director')),
    brand_id VARCHAR(50) 
        CHECK (brand_id IN ('ohana_market', 'ohana_kids', 'all')),
    suggested_name VARCHAR(255),
    summary TEXT,
    
    -- Владелец
    uploaded_by_id INT REFERENCES users(id),
    moderated_by_id INT REFERENCES users(id),
    
    -- Статус
    status VARCHAR(30) DEFAULT 'uploaded'
        CHECK (status IN ('uploaded', 'routing', 'converting', 'classifying', 
                          'pending_user', 'pending_moderation', 'uploading', 
                          'indexed', 'archived', 'rejected', 'quarantine', 'error')),
    rejection_reason TEXT,
    
    -- Метаданные обработки
    pages_count INT,
    processing_duration_sec FLOAT,
    
    -- Даты
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processing_started_at TIMESTAMP WITH TIME ZONE,
    processing_completed_at TIMESTAMP WITH TIME ZONE,
    moderated_at TIMESTAMP WITH TIME ZONE,
    indexed_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE
);

-- Индексы
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by_id);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_brand_id ON documents(brand_id);
CREATE INDEX idx_documents_access_level ON documents(access_level);
CREATE INDEX idx_documents_kb_document_id ON documents(kb_document_id);
CREATE INDEX idx_documents_created_at ON documents(created_at);

-- Составной индекс для фильтрации
CREATE INDEX idx_documents_access_filter 
    ON documents(brand_id, access_level, status);
```

**Категории документов:**

| Код | Описание |
|-----|----------|
| `finance` | Финансовые документы |
| `contract` | Договоры |
| `regulation` | Регламенты, инструкции |
| `product` | Информация о товарах |
| `correspondence` | Переписка |
| `analytics` | Аналитические отчёты |
| `hr` | Кадровые документы |
| `logistics` | Логистика, склад |
| `marketing` | Маркетинг, реклама |
| `other` | Прочее |

#### quarantine

```sql
CREATE TABLE quarantine (
    id SERIAL PRIMARY KEY,
    
    -- Файл
    original_name VARCHAR(255) NOT NULL,
    quarantine_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT,
    
    -- Владелец
    uploaded_by_id INT REFERENCES users(id),
    
    -- Ошибка
    error_code VARCHAR(50) NOT NULL,
    error_message TEXT,
    error_details JSONB,
    
    -- Retry
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    last_retry_at TIMESTAMP WITH TIME ZONE,
    
    -- Даты
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days'
);

-- Индексы
CREATE INDEX idx_quarantine_uploaded_by ON quarantine(uploaded_by_id);
CREATE INDEX idx_quarantine_error_code ON quarantine(error_code);
CREATE INDEX idx_quarantine_created_at ON quarantine(created_at);
CREATE INDEX idx_quarantine_expires_at ON quarantine(expires_at);
```

### 3.3 Core: Аудит и уведомления

#### audit_log

```sql
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    
    -- Время
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Контекст
    module VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    
    -- Пользователь
    user_id INT REFERENCES users(id),
    brand_id VARCHAR(50),
    
    -- Детали
    details JSONB,
    
    -- Сеть
    ip_address VARCHAR(50),
    user_agent TEXT,
    
    -- Результат
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT
);

-- Индексы
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_module ON audit_log(module);
CREATE INDEX idx_audit_log_action ON audit_log(action);

-- Составной индекс для запросов
CREATE INDEX idx_audit_log_user_time 
    ON audit_log(user_id, timestamp DESC);
```

#### notifications

```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    
    -- Получатель
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Событие
    event_type VARCHAR(50) NOT NULL,
    level VARCHAR(20) DEFAULT 'info'
        CHECK (level IN ('info', 'warning', 'critical')),
    
    -- Содержимое
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB,
    
    -- Источник
    source_module VARCHAR(50),
    source_id VARCHAR(100),
    
    -- Статус
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Даты
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_event_type ON notifications(event_type);

-- Составной индекс для непрочитанных
CREATE INDEX idx_notifications_unread 
    ON notifications(user_id, is_read, created_at DESC) 
    WHERE is_read = FALSE;
```

#### settings

```sql
CREATE TABLE settings (
    key VARCHAR(100) PRIMARY KEY,
    
    -- Значение
    value JSONB NOT NULL,
    
    -- Метаданные
    category VARCHAR(50),
    description TEXT,
    
    -- Аудит
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by_id INT REFERENCES users(id)
);

-- Индекс
CREATE INDEX idx_settings_category ON settings(category);
```

**Категории настроек:**

| Категория | Описание |
|-----------|----------|
| `system` | Системные настройки |
| `etl` | Настройки ETL-препроцессора |
| `knowledge` | Настройки модуля Knowledge |
| `reputation` | Настройки модуля Reputation |
| `notifications` | Настройки уведомлений |

### 3.4 Core: Celery Tasks

#### celery_task_log

```sql
CREATE TABLE celery_task_log (
    id SERIAL PRIMARY KEY,
    
    -- Идентификация
    task_id VARCHAR(255) UNIQUE NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    
    -- Параметры
    args JSONB,
    kwargs JSONB,
    
    -- Статус
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'started', 'success', 'failure', 'retry', 'revoked')),
    
    -- Результат
    result JSONB,
    error_message TEXT,
    traceback TEXT,
    
    -- Retry
    retries INT DEFAULT 0,
    
    -- Время
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    runtime_seconds FLOAT
);

-- Индексы
CREATE INDEX idx_celery_task_log_task_id ON celery_task_log(task_id);
CREATE INDEX idx_celery_task_log_task_name ON celery_task_log(task_name);
CREATE INDEX idx_celery_task_log_status ON celery_task_log(status);
CREATE INDEX idx_celery_task_log_created_at ON celery_task_log(created_at);
```

---

## 4. Начальные данные

### 4.1 Service Account

```sql
-- Service Account для межмодульного взаимодействия
INSERT INTO users (
    username, 
    password_hash, 
    role, 
    brand_id, 
    is_active, 
    full_name
) VALUES (
    'service_account',
    '---NOT-FOR-LOGIN---',
    'service',
    'all',
    TRUE,
    'Service Account'
);
```

### 4.2 Начальные настройки

```sql
-- Системные настройки
INSERT INTO settings (key, value, category, description) VALUES 
(
    'system_version',
    '"4.1"',
    'system',
    'Версия системы ADOLF'
),
(
    'etl_supported_formats',
    '["pdf", "docx", "xlsx", "md", "txt", "csv", "html", "xml", "jpg", "png"]',
    'etl',
    'Поддерживаемые форматы файлов'
),
(
    'knowledge_relevance_thresholds',
    '{"high": 0.7, "medium": 0.4, "min": 0.3}',
    'knowledge',
    'Пороги релевантности для RAG-поиска'
),
(
    'knowledge_history_limits',
    '{"max_db": 300, "max_llm": 20, "max_tokens": 3000}',
    'knowledge',
    'Лимиты истории диалога'
),
(
    'reputation_poll_interval_minutes',
    '5',
    'reputation',
    'Интервал polling маркетплейсов (минуты)'
),
(
    'error_handling_policy',
    '{
        "timeout_seconds": 30,
        "retry_delays": [1, 2, 4],
        "max_retries": 3,
        "circuit_breaker_threshold": 5,
        "circuit_breaker_reset_seconds": 60
    }',
    'system',
    'Единая политика обработки ошибок'
);
```

---

## 5. Политики хранения и очистка

### 5.1 Retention Policy

| Категория | Данные | Срок | Действие |
|-----------|--------|------|----------|
| Временные | raw_text_dump, temp | 3 дня | Удаление |
| Служебные | audit_log, quarantine, celery_task_log, sessions | 30 дней | Удаление |
| Критичные | documents, users, settings | Бессрочно | — |

### 5.2 Скрипты очистки

```sql
-- Очистка истёкших сессий
DELETE FROM sessions 
WHERE expires_at < NOW();

-- Очистка карантина по expires_at
DELETE FROM quarantine 
WHERE expires_at < NOW();

-- Очистка celery_task_log старше 30 дней
DELETE FROM celery_task_log 
WHERE created_at < NOW() - INTERVAL '30 days';

-- Очистка audit_log старше 30 дней
DELETE FROM audit_log 
WHERE timestamp < NOW() - INTERVAL '30 days';

-- Очистка прочитанных уведомлений старше 30 дней
DELETE FROM notifications 
WHERE is_read = TRUE 
  AND created_at < NOW() - INTERVAL '30 days';
```

### 5.3 Celery Task для очистки

```python
# tasks/core_tasks.py

@shared_task(name="tasks.core_tasks.cleanup_expired_data")
def cleanup_expired_data():
    """
    Ежедневная очистка устаревших данных.
    Запуск: 03:00 UTC.
    """
    with get_db_session() as db:
        # Sessions
        db.execute(text("DELETE FROM sessions WHERE expires_at < NOW()"))
        
        # Quarantine
        db.execute(text("DELETE FROM quarantine WHERE expires_at < NOW()"))
        
        # Celery task log (30 дней)
        db.execute(text("""
            DELETE FROM celery_task_log 
            WHERE created_at < NOW() - INTERVAL '30 days'
        """))
        
        # Audit log (30 дней)
        db.execute(text("""
            DELETE FROM audit_log 
            WHERE timestamp < NOW() - INTERVAL '30 days'
        """))
        
        # Notifications (30 дней, только прочитанные)
        db.execute(text("""
            DELETE FROM notifications 
            WHERE is_read = TRUE 
              AND created_at < NOW() - INTERVAL '30 days'
        """))
        
        db.commit()
```

---

## 6. Миграции

### 6.1 Инструменты

| Инструмент | Назначение |
|------------|------------|
| Alembic | Миграции SQLAlchemy |

### 6.2 Структура миграций

```
/app/
├── alembic/
│   ├── versions/
│   │   ├── 001_initial_schema.py
│   │   ├── 002_add_documents_table.py
│   │   ├── 003_add_celery_task_log.py
│   │   └── ...
│   ├── env.py
│   └── alembic.ini
└── models/
    ├── __init__.py
    ├── user.py
    ├── document.py
    └── ...
```

### 6.3 Пример миграции

```python
# alembic/versions/001_initial_schema.py
"""Initial schema

Revision ID: 001
Create Date: 2026-01-15
"""
from alembic import op
import sqlalchemy as sa

revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Users
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('username', sa.String(50), unique=True, nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('owui_id', sa.String(100), unique=True),
        sa.Column('role', sa.String(20), nullable=False),
        sa.Column('brand_id', sa.String(50)),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('email', sa.String(255)),
        sa.Column('full_name', sa.String(100)),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('last_login', sa.DateTime(timezone=True)),
        sa.CheckConstraint(
            "role IN ('staff', 'manager', 'senior', 'director', 'administrator', 'service')",
            name='check_role'
        ),
        sa.CheckConstraint(
            "brand_id IN ('ohana_market', 'ohana_kids', 'all') OR brand_id IS NULL",
            name='check_brand_id'
        )
    )
    
    op.create_index('idx_users_owui_id', 'users', ['owui_id'])
    op.create_index('idx_users_role', 'users', ['role'])
    
    # Sessions
    op.create_table(
        'sessions',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('token', sa.String(255), unique=True, nullable=False),
        sa.Column('device_info', sa.String(255)),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('expires_at', sa.DateTime(timezone=True)),
    )

def downgrade():
    op.drop_table('sessions')
    op.drop_table('users')
```

### 6.4 Команды Alembic

```bash
# Создание миграции
alembic revision --autogenerate -m "Add documents table"

# Применение миграций
alembic upgrade head

# Откат последней миграции
alembic downgrade -1

# Просмотр текущей версии
alembic current

# История миграций
alembic history
```

---

## 7. Резервное копирование

### 7.1 Стратегия бэкапов

| Тип | Частота | Хранение | Назначение |
|-----|---------|----------|------------|
| Full | Ежедневно (03:00) | 7 дней | Восстановление |
| Incremental | Каждые 6 часов | 2 дня | Point-in-time recovery |
| WAL архивация | Постоянно | 24 часа | Минимальная потеря данных |

### 7.2 Managed PostgreSQL (Timeweb)

Timeweb Managed PostgreSQL включает:

- Автоматические ежедневные бэкапы
- Хранение 7 дней
- Восстановление через панель управления

### 7.3 Дополнительные бэкапы (опционально)

```bash
# Полный дамп
pg_dump -Fc -h $PG_HOST -U $PG_USER -d adolf > backup_$(date +%Y%m%d).dump

# Восстановление
pg_restore -h $PG_HOST -U $PG_USER -d adolf backup_20260115.dump

# Бэкап критичных таблиц
pg_dump -Fc -h $PG_HOST -U $PG_USER -d adolf \
    -t users \
    -t documents \
    -t settings \
    > critical_tables_$(date +%Y%m%d).dump
```

### 7.4 Cron для бэкапов

```bash
# /etc/cron.d/adolf-backup
0 3 * * * adolf /app/scripts/backup.sh >> /var/log/backup.log 2>&1
```

---

## 8. Мониторинг

### 8.1 Ключевые метрики

| Метрика | Порог | Алерт |
|---------|-------|-------|
| Connections | &gt; 80% max | warning |
| Disk usage | &gt; 80% | warning |
| Slow queries | &gt; 5s | warning |
| Dead tuples | &gt; 10% | warning |

### 8.2 Полезные запросы

```sql
-- Размер таблиц
SELECT 
    relname AS table_name,
    pg_size_pretty(pg_total_relation_size(relid)) AS total_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 10;

-- Активные соединения
SELECT 
    state,
    COUNT(*) 
FROM pg_stat_activity 
GROUP BY state;

-- Медленные запросы (pg_stat_statements)
SELECT 
    query,
    calls,
    mean_exec_time,
    total_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;

-- Статистика индексов
SELECT 
    indexrelname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Неиспользуемые индексы
SELECT 
    indexrelname
FROM pg_stat_user_indexes
WHERE idx_scan = 0;
```

---

## 9. Оптимизация производительности

### 9.1 Параметры PostgreSQL

```ini
# postgresql.conf (рекомендации для 2 GB RAM)

# Memory
shared_buffers = 512MB
effective_cache_size = 1536MB
work_mem = 16MB
maintenance_work_mem = 128MB

# Connections
max_connections = 100

# WAL
wal_buffers = 16MB
checkpoint_completion_target = 0.9

# Query Planner
random_page_cost = 1.1  # SSD
effective_io_concurrency = 200

# Logging
log_min_duration_statement = 1000  # 1 секунда
log_statement = 'ddl'
```

### 9.2 Типичные проблемы

| Проблема | Диагностика | Решение |
|----------|-------------|---------|
| Медленные JOIN | EXPLAIN ANALYZE | Добавить индексы |
| Bloat таблиц | pg_stat_user_tables | VACUUM ANALYZE |
| Lock contention | pg_locks | Оптимизация транзакций |
| Seq scans | pg_stat_user_tables | Проверить индексы |

---

## Приложение А: Полный скрипт создания схемы

```sql
-- Файл: init_schema.sql
-- Версия: 4.1
-- Дата: Январь 2026

BEGIN;

-- Вспомогательная функция
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Core: users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    owui_id VARCHAR(100) UNIQUE,
    role VARCHAR(20) NOT NULL 
        CHECK (role IN ('staff', 'manager', 'senior', 'director', 'administrator', 'service')),
    brand_id VARCHAR(50)
        CHECK (brand_id IN ('ohana_market', 'ohana_kids', 'all') OR brand_id IS NULL),
    is_active BOOLEAN DEFAULT TRUE,
    email VARCHAR(255),
    full_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_owui_id ON users(owui_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_brand_id ON users(brand_id);
CREATE INDEX idx_users_is_active ON users(is_active);

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Core: sessions
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255),
    device_info VARCHAR(255),
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Core: documents
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    stored_name VARCHAR(255),
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    kb_document_id VARCHAR(100),
    archive_path VARCHAR(500),
    processing_type VARCHAR(20) CHECK (processing_type IN ('direct', 'convert')),
    converted_format VARCHAR(10),
    category VARCHAR(50) 
        CHECK (category IN ('finance', 'contract', 'regulation', 'product', 
                            'correspondence', 'analytics', 'hr', 'logistics', 
                            'marketing', 'other')),
    access_level VARCHAR(20) 
        CHECK (access_level IN ('staff', 'manager', 'senior', 'director')),
    brand_id VARCHAR(50) 
        CHECK (brand_id IN ('ohana_market', 'ohana_kids', 'all')),
    suggested_name VARCHAR(255),
    summary TEXT,
    uploaded_by_id INT REFERENCES users(id),
    moderated_by_id INT REFERENCES users(id),
    status VARCHAR(30) DEFAULT 'uploaded'
        CHECK (status IN ('uploaded', 'routing', 'converting', 'classifying', 
                          'pending_user', 'pending_moderation', 'uploading', 
                          'indexed', 'archived', 'rejected', 'quarantine', 'error')),
    rejection_reason TEXT,
    pages_count INT,
    processing_duration_sec FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processing_started_at TIMESTAMP WITH TIME ZONE,
    processing_completed_at TIMESTAMP WITH TIME ZONE,
    moderated_at TIMESTAMP WITH TIME ZONE,
    indexed_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by_id);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_brand_id ON documents(brand_id);
CREATE INDEX idx_documents_access_level ON documents(access_level);
CREATE INDEX idx_documents_kb_document_id ON documents(kb_document_id);
CREATE INDEX idx_documents_created_at ON documents(created_at);
CREATE INDEX idx_documents_access_filter ON documents(brand_id, access_level, status);

-- Core: quarantine
CREATE TABLE quarantine (
    id SERIAL PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    quarantine_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT,
    uploaded_by_id INT REFERENCES users(id),
    error_code VARCHAR(50) NOT NULL,
    error_message TEXT,
    error_details JSONB,
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    last_retry_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days'
);

CREATE INDEX idx_quarantine_uploaded_by ON quarantine(uploaded_by_id);
CREATE INDEX idx_quarantine_error_code ON quarantine(error_code);
CREATE INDEX idx_quarantine_expires_at ON quarantine(expires_at);

-- Core: audit_log
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    module VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    user_id INT REFERENCES users(id),
    brand_id VARCHAR(50),
    details JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT
);

CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_module ON audit_log(module);
CREATE INDEX idx_audit_log_user_time ON audit_log(user_id, timestamp DESC);

-- Core: notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    level VARCHAR(20) DEFAULT 'info' CHECK (level IN ('info', 'warning', 'critical')),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB,
    source_module VARCHAR(50),
    source_id VARCHAR(100),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_event_type ON notifications(event_type);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read, created_at DESC) WHERE is_read = FALSE;

-- Core: settings
CREATE TABLE settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    category VARCHAR(50),
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by_id INT REFERENCES users(id)
);

CREATE INDEX idx_settings_category ON settings(category);

-- Core: celery_task_log
CREATE TABLE celery_task_log (
    id SERIAL PRIMARY KEY,
    task_id VARCHAR(255) UNIQUE NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    args JSONB,
    kwargs JSONB,
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'started', 'success', 'failure', 'retry', 'revoked')),
    result JSONB,
    error_message TEXT,
    traceback TEXT,
    retries INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    runtime_seconds FLOAT
);

CREATE INDEX idx_celery_task_log_task_id ON celery_task_log(task_id);
CREATE INDEX idx_celery_task_log_task_name ON celery_task_log(task_name);
CREATE INDEX idx_celery_task_log_status ON celery_task_log(status);
CREATE INDEX idx_celery_task_log_created_at ON celery_task_log(created_at);

-- Service Account
INSERT INTO users (username, password_hash, role, brand_id, is_active, full_name)
VALUES ('service_account', '---NOT-FOR-LOGIN---', 'service', 'all', TRUE, 'Service Account');

COMMIT;
```

---

## Приложение Б: Контрольные точки

| Критерий | Проверка |
|----------|----------|
| Подключение | `psql -h host -U user -d adolf` успешно |
| Схема создана | Все таблицы существуют |
| Индексы созданы | `\di` показывает индексы |
| Миграции применены | `alembic current` = head |
| Service Account создан | `SELECT * FROM users WHERE role = 'service'` |
| Бэкапы работают | Последний бэкап &lt; 24 часов |
| Очистка работает | Старые данные удаляются |

---

## Приложение В: Примечание о модульных таблицах

Таблицы функциональных модулей (Reputation, Watcher, CFO и др.) описаны в документации соответствующих модулей:

| Модуль | Документ | Таблицы |
|--------|----------|---------|
| Reputation | `adolf_reputation_5_database.md` | `reputation_items`, `reputation_responses`, `polling_state`, `reputation_analytics` |
| Watcher | `adolf_watcher_database.md` | `watcher_tasks`, `agents`, `price_history`, `price_subscriptions` |
| CFO | `adolf_cfo_database.md` | `financial_transactions`, `financial_reports` |

Модули добавляют свои таблицы через Alembic-миграции при подключении к системе.

---

**Документ подготовлен:** Январь 2026  
**Версия:** 4.1  
**Статус:** Согласовано

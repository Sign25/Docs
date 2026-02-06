---
title: "Раздел 5: База данных"
mode: "wide"
---

**ÐŸÑ€Ð¾ÐµÐºÑ‚:** Ð˜Ð½Ñ‚ÐµÐ»Ð»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð°Ñ ÑÐ¸ÑÑ‚ÐµÐ¼Ð° Ð¼Ð¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³Ð° Ñ†ÐµÐ½ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð¾Ð²  
**ÐœÐ¾Ð´ÑƒÐ»ÑŒ:** Watcher / Database  
**Ð’ÐµÑ€ÑÐ¸Ñ:** 2.0  
**Ð”Ð°Ñ‚Ð°:** Ð¯Ð½Ð²Ð°Ñ€ÑŒ 2026

---

## 5.1 ÐžÐ±Ð·Ð¾Ñ€

### Ð¥Ñ€Ð°Ð½Ð¸Ð»Ð¸Ñ‰Ð° Ð´Ð°Ð½Ð½Ñ‹Ñ…

| Ð¥Ñ€Ð°Ð½Ð¸Ð»Ð¸Ñ‰Ðµ | ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ | Ð”Ð°Ð½Ð½Ñ‹Ðµ |
|-----------|------------|--------|
| **PostgreSQL** | ÐžÑÐ½Ð¾Ð²Ð½Ð¾Ðµ Ñ…Ñ€Ð°Ð½Ð¸Ð»Ð¸Ñ‰Ðµ | ÐÐ³ÐµÐ½Ñ‚Ñ‹, Ð·Ð°Ð´Ð°Ñ‡Ð¸, Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ñ Ñ†ÐµÐ½, Ð¿Ð¾Ð´Ð¿Ð¸ÑÐºÐ¸, ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ñ‹, Ð°Ð»ÐµÑ€Ñ‚Ñ‹ |
| **Redis** | ÐžÐ¿ÐµÑ€Ð°Ñ‚Ð¸Ð²Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ | ÐžÑ‡ÐµÑ€ÐµÐ´Ð¸ Ð·Ð°Ð´Ð°Ñ‡, IP Semaphore, ÑÑ‚Ð°Ñ‚ÑƒÑÑ‹ Ð°Ð³ÐµÐ½Ñ‚Ð¾Ð², ÐºÑÑˆ |

### Ð¡Ñ…ÐµÐ¼Ð° Ð´Ð°Ð½Ð½Ñ‹Ñ…

```mermaid
erDiagram
    watcher_agents ||--o{ watcher_tasks : executes
    watcher_subscriptions ||--o{ watcher_tasks : generates
    watcher_subscriptions ||--o{ watcher_competitors : has
    watcher_competitors ||--o{ watcher_tasks : generates
    watcher_tasks ||--o| watcher_price_history : produces
    watcher_subscriptions ||--o{ watcher_price_history : tracks
    watcher_price_history ||--o{ watcher_alerts : triggers
    
    watcher_agents {
        uuid id PK
        string name
        string api_key_hash
        enum status
        string current_ip
        timestamp last_heartbeat
        timestamp created_at
    }
    
    watcher_subscriptions {
        uuid id PK
        string sku
        string brand_id FK
        enum marketplace
        int priority
        boolean is_active
        timestamp created_at
    }
    
    watcher_competitors {
        uuid id PK
        string our_sku FK
        string competitor_sku
        enum marketplace
        string seller_name
        string url
        int priority
        boolean is_active
    }
    
    watcher_tasks {
        uuid id PK
        string url
        enum marketplace
        string sku
        uuid competitor_id FK
        uuid agent_id FK
        enum status
        date scheduled_date
        timestamp started_at
        timestamp completed_at
    }
    
    watcher_price_history {
        bigint id PK
        string sku
        enum marketplace
        uuid competitor_id FK
        decimal current_price
        decimal old_price
        decimal spp_price
        boolean in_stock
        float rating
        int reviews_count
        timestamp parsed_at
    }
    
    watcher_alerts {
        uuid id PK
        string sku
        enum marketplace
        enum alert_type
        jsonb details
        boolean is_read
        timestamp created_at
    }
```

---

## 5.2 Ð¢Ð°Ð±Ð»Ð¸Ñ†Ñ‹ PostgreSQL

### 5.2.1 watcher_agents

Ð ÐµÐµÑÑ‚Ñ€ Ð°Ð³ÐµÐ½Ñ‚Ð¾Ð² Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð°.

```sql
CREATE TABLE watcher_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Ð˜Ð´ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ñ
    name VARCHAR(100) NOT NULL,
    description TEXT,
    api_key_hash VARCHAR(64) NOT NULL UNIQUE,
    
    -- ÐŸÑ€Ð¸Ð²ÑÐ·ÐºÐ° Ðº Ð¼ÐµÐ½ÐµÐ´Ð¶ÐµÑ€Ñƒ
    manager_user_id UUID REFERENCES users(id),
    pc_name VARCHAR(100),
    
    -- Ð¡Ð¾ÑÑ‚Ð¾ÑÐ½Ð¸Ðµ
    status VARCHAR(20) NOT NULL DEFAULT 'offline',
    current_ip VARCHAR(45),
    current_task_id UUID,
    
    -- Ð˜Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ñ Ð¾ Ð¼Ð¾Ð´ÐµÐ¼Ðµ
    modem_operator VARCHAR(50),
    signal_strength INTEGER,
    
    -- Cookies
    cookies_updated_at TIMESTAMP,
    cookies_valid BOOLEAN DEFAULT FALSE,
    
    -- Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ°
    tasks_completed_total INTEGER DEFAULT 0,
    tasks_failed_total INTEGER DEFAULT 0,
    avg_task_time_ms INTEGER,
    
    -- Ð’ÐµÑ€ÑÐ¸Ñ Ð¸ Ð¼ÐµÑ‚Ð°Ð´Ð°Ð½Ð½Ñ‹Ðµ
    version VARCHAR(20),
    config JSONB DEFAULT '{}',
    
    -- Timestamps
    last_heartbeat TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_agent_status CHECK (
        status IN ('idle', 'preparing', 'ready', 'working', 'paused', 'panic', 'offline', 'stopped')
    )
);

-- Indexes
CREATE INDEX idx_watcher_agents_status ON watcher_agents(status);
CREATE INDEX idx_watcher_agents_last_heartbeat ON watcher_agents(last_heartbeat);

-- Comments
COMMENT ON TABLE watcher_agents IS 'Ð ÐµÐµÑÑ‚Ñ€ Ð°Ð³ÐµÐ½Ñ‚Ð¾Ð² Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð° Watcher';
COMMENT ON COLUMN watcher_agents.api_key_hash IS 'SHA-256 Ñ…ÐµÑˆ API ÐºÐ»ÑŽÑ‡Ð°';
COMMENT ON COLUMN watcher_agents.status IS 'Ð¢ÐµÐºÑƒÑ‰Ð¸Ð¹ ÑÑ‚Ð°Ñ‚ÑƒÑ Ð°Ð³ÐµÐ½Ñ‚Ð°';
```

### 5.2.2 watcher_subscriptions

ÐŸÐ¾Ð´Ð¿Ð¸ÑÐºÐ¸ Ð½Ð° Ð¼Ð¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³ SKU.

```sql
CREATE TABLE watcher_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Ð˜Ð´ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ñ Ñ‚Ð¾Ð²Ð°Ñ€Ð°
    sku VARCHAR(50) NOT NULL,
    marketplace VARCHAR(20) NOT NULL,
    brand_id VARCHAR(20) NOT NULL,
    
    -- URL ÐºÐ°Ñ€Ñ‚Ð¾Ñ‡ÐºÐ¸ (Ð´Ð»Ñ ÑÐ¾Ð±ÑÑ‚Ð²ÐµÐ½Ð½Ñ‹Ñ… Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð²)
    url VARCHAR(500),
    
    -- ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ Ð¼Ð¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³Ð°
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ Ð°Ð»ÐµÑ€Ñ‚Ð¾Ð²
    alert_price_drop_percent INTEGER DEFAULT 10,
    alert_price_rise_percent INTEGER DEFAULT 20,
    alert_out_of_stock BOOLEAN DEFAULT TRUE,
    
    -- ÐœÐµÑ‚Ð°Ð´Ð°Ð½Ð½Ñ‹Ðµ
    notes TEXT,
    created_by UUID REFERENCES users(id),
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_subscription_marketplace CHECK (
        marketplace IN ('wildberries', 'ozon', 'yandex_market')
    ),
    CONSTRAINT chk_subscription_brand CHECK (
        brand_id IN ('ohana_market', 'ohana_kids', 'all')
    ),
    CONSTRAINT uq_subscription_sku_marketplace UNIQUE (sku, marketplace)
);

-- Indexes
CREATE INDEX idx_watcher_subscriptions_sku ON watcher_subscriptions(sku);
CREATE INDEX idx_watcher_subscriptions_marketplace ON watcher_subscriptions(marketplace);
CREATE INDEX idx_watcher_subscriptions_brand ON watcher_subscriptions(brand_id);
CREATE INDEX idx_watcher_subscriptions_active ON watcher_subscriptions(is_active) WHERE is_active = TRUE;

-- Comments
COMMENT ON TABLE watcher_subscriptions IS 'ÐŸÐ¾Ð´Ð¿Ð¸ÑÐºÐ¸ Ð½Ð° Ð¼Ð¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³ ÑÐ¾Ð±ÑÑ‚Ð²ÐµÐ½Ð½Ñ‹Ñ… SKU';
COMMENT ON COLUMN watcher_subscriptions.priority IS 'ÐŸÑ€Ð¸Ð¾Ñ€Ð¸Ñ‚ÐµÑ‚ Ð¼Ð¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³Ð° (0 = Ð¾Ð±Ñ‹Ñ‡Ð½Ñ‹Ð¹)';
```

### 5.2.3 watcher_competitors

ÐšÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ñ‹ Ð´Ð»Ñ Ð¼Ð¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³Ð°.

```sql
CREATE TABLE watcher_competitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- ÐŸÑ€Ð¸Ð²ÑÐ·ÐºÐ° Ðº Ð½Ð°ÑˆÐµÐ¼Ñƒ Ñ‚Ð¾Ð²Ð°Ñ€Ñƒ
    our_sku VARCHAR(50) NOT NULL,
    subscription_id UUID REFERENCES watcher_subscriptions(id) ON DELETE CASCADE,
    
    -- Ð”Ð°Ð½Ð½Ñ‹Ðµ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð°
    competitor_sku VARCHAR(50) NOT NULL,
    marketplace VARCHAR(20) NOT NULL,
    seller_name VARCHAR(200),
    url VARCHAR(500) NOT NULL,
    
    -- ÐšÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð·Ð°Ñ†Ð¸Ñ
    category VARCHAR(200),
    
    -- ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- ÐœÐµÑ‚Ð°Ð´Ð°Ð½Ð½Ñ‹Ðµ
    notes TEXT,
    added_by UUID REFERENCES users(id),
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_competitor_marketplace CHECK (
        marketplace IN ('wildberries', 'ozon', 'yandex_market')
    ),
    CONSTRAINT uq_competitor_url UNIQUE (url)
);

-- Indexes
CREATE INDEX idx_watcher_competitors_our_sku ON watcher_competitors(our_sku);
CREATE INDEX idx_watcher_competitors_marketplace ON watcher_competitors(marketplace);
CREATE INDEX idx_watcher_competitors_active ON watcher_competitors(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_watcher_competitors_subscription ON watcher_competitors(subscription_id);

-- Comments
COMMENT ON TABLE watcher_competitors IS 'ÐšÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ñ‹ Ð´Ð»Ñ Ð¼Ð¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³Ð° Ñ†ÐµÐ½';
COMMENT ON COLUMN watcher_competitors.our_sku IS 'ÐÑ€Ñ‚Ð¸ÐºÑƒÐ» Ð½Ð°ÑˆÐµÐ³Ð¾ Ñ‚Ð¾Ð²Ð°Ñ€Ð°, Ñ ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ð¼ ÑÑ€Ð°Ð²Ð½Ð¸Ð²Ð°ÐµÐ¼';
COMMENT ON COLUMN watcher_competitors.priority IS 'ÐŸÑ€Ð¸Ð¾Ñ€Ð¸Ñ‚ÐµÑ‚ Ð¼Ð¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³Ð° (Ð²Ð»Ð¸ÑÐµÑ‚ Ð½Ð° Ñ‡Ð°ÑÑ‚Ð¾Ñ‚Ñƒ Ð² v2.0)';
```

### 5.2.4 watcher_tasks

Ð—Ð°Ð´Ð°Ñ‡Ð¸ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð°.

```sql
CREATE TABLE watcher_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Ð¦ÐµÐ»ÑŒ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð°
    url VARCHAR(500) NOT NULL,
    marketplace VARCHAR(20) NOT NULL,
    sku VARCHAR(50) NOT NULL,
    brand_id VARCHAR(20) NOT NULL,
    
    -- Ð¡Ð²ÑÐ·Ð¸
    subscription_id UUID REFERENCES watcher_subscriptions(id),
    competitor_id UUID REFERENCES watcher_competitors(id),
    
    -- Ð˜ÑÐ¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ðµ
    agent_id UUID REFERENCES watcher_agents(id),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    priority INTEGER DEFAULT 0,
    
    -- ÐŸÐ»Ð°Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ
    scheduled_date DATE NOT NULL,
    
    -- Timing
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    execution_time_ms INTEGER,
    
    -- Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚
    retry_count INTEGER DEFAULT 0,
    error TEXT,
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_task_status CHECK (
        status IN ('pending', 'in_progress', 'completed', 'failed', 'parse_error', 'cancelled')
    ),
    CONSTRAINT chk_task_marketplace CHECK (
        marketplace IN ('wildberries', 'ozon', 'yandex_market')
    )
);

-- Indexes
CREATE INDEX idx_watcher_tasks_status ON watcher_tasks(status);
CREATE INDEX idx_watcher_tasks_scheduled ON watcher_tasks(scheduled_date);
CREATE INDEX idx_watcher_tasks_agent ON watcher_tasks(agent_id);
CREATE INDEX idx_watcher_tasks_sku ON watcher_tasks(sku);
CREATE INDEX idx_watcher_tasks_marketplace_status ON watcher_tasks(marketplace, status);

-- Partitioning by scheduled_date (Ð´Ð»Ñ Ð¿Ñ€Ð¾Ð¸Ð·Ð²Ð¾Ð´Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ÑÑ‚Ð¸)
-- Ð’ production Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´ÑƒÐµÑ‚ÑÑ Ð¿Ð°Ñ€Ñ‚Ð¸Ñ†Ð¸Ð¾Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð¿Ð¾ Ð¼ÐµÑÑÑ†Ð°Ð¼

-- Comments
COMMENT ON TABLE watcher_tasks IS 'Ð—Ð°Ð´Ð°Ñ‡Ð¸ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð° (Ð³ÐµÐ½ÐµÑ€Ð¸Ñ€ÑƒÑŽÑ‚ÑÑ ÐµÐ¶ÐµÐ´Ð½ÐµÐ²Ð½Ð¾)';
COMMENT ON COLUMN watcher_tasks.scheduled_date IS 'Ð”Ð°Ñ‚Ð°, Ð½Ð° ÐºÐ¾Ñ‚Ð¾Ñ€ÑƒÑŽ Ð·Ð°Ð¿Ð»Ð°Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð° Ð·Ð°Ð´Ð°Ñ‡Ð°';
COMMENT ON COLUMN watcher_tasks.retry_count IS 'ÐšÐ¾Ð»Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾ Ð¿Ð¾Ð²Ñ‚Ð¾Ñ€Ð½Ñ‹Ñ… Ð¿Ð¾Ð¿Ñ‹Ñ‚Ð¾Ðº';
```

### 5.2.5 watcher_price_history

Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ñ Ñ†ÐµÐ½ (Ð¾ÑÐ½Ð¾Ð²Ð½Ð°Ñ Ñ‚Ð°Ð±Ð»Ð¸Ñ†Ð° Ð´Ð°Ð½Ð½Ñ‹Ñ…).

```sql
CREATE TABLE watcher_price_history (
    id BIGSERIAL PRIMARY KEY,
    
    -- Ð˜Ð´ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ñ
    sku VARCHAR(50) NOT NULL,
    marketplace VARCHAR(20) NOT NULL,
    brand_id VARCHAR(20) NOT NULL,
    
    -- Ð¡Ð²ÑÐ·Ð¸
    subscription_id UUID REFERENCES watcher_subscriptions(id),
    competitor_id UUID REFERENCES watcher_competitors(id),
    task_id UUID REFERENCES watcher_tasks(id),
    
    -- Ð¦ÐµÐ½Ñ‹
    current_price DECIMAL(12, 2),
    old_price DECIMAL(12, 2),
    spp_price DECIMAL(12, 2),
    discount_percent INTEGER,
    
    -- ÐÐ°Ð»Ð¸Ñ‡Ð¸Ðµ
    in_stock BOOLEAN,
    stock_quantity INTEGER,
    
    -- Ð ÐµÐ¹Ñ‚Ð¸Ð½Ð³ Ð¸ Ð¾Ñ‚Ð·Ñ‹Ð²Ñ‹
    rating DECIMAL(2, 1),
    reviews_count INTEGER,
    sales_count INTEGER,
    
    -- ÐŸÐ¾Ð·Ð¸Ñ†Ð¸Ñ Ð¸ Ñ€ÐµÐºÐ»Ð°Ð¼Ð°
    position INTEGER,
    ad_bid DECIMAL(10, 2),
    
    -- Ð˜Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ñ Ð¾ Ð¿Ñ€Ð¾Ð´Ð°Ð²Ñ†Ðµ
    seller_name VARCHAR(200),
    
    -- ÐšÐ¾Ð½Ñ‚ÐµÐ½Ñ‚ ÐºÐ°Ñ€Ñ‚Ð¾Ñ‡ÐºÐ¸
    card_title VARCHAR(500),
    card_description TEXT,
    card_attributes JSONB,
    category VARCHAR(500),
    
    -- AI Parser Ð¼ÐµÑ‚Ð°Ð´Ð°Ð½Ð½Ñ‹Ðµ
    parse_confidence DECIMAL(3, 2),
    
    -- Timestamps
    parsed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_price_history_marketplace CHECK (
        marketplace IN ('wildberries', 'ozon', 'yandex_market')
    ),
    CONSTRAINT chk_price_history_rating CHECK (
        rating IS NULL OR (rating >= 1.0 AND rating <= 5.0)
    )
);

-- Indexes Ð´Ð»Ñ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð²
CREATE INDEX idx_watcher_price_history_sku ON watcher_price_history(sku);
CREATE INDEX idx_watcher_price_history_marketplace ON watcher_price_history(marketplace);
CREATE INDEX idx_watcher_price_history_brand ON watcher_price_history(brand_id);
CREATE INDEX idx_watcher_price_history_parsed_at ON watcher_price_history(parsed_at);
CREATE INDEX idx_watcher_price_history_competitor ON watcher_price_history(competitor_id);

-- Composite index Ð´Ð»Ñ Ñ‚Ð¸Ð¿Ð¸Ñ‡Ð½Ñ‹Ñ… Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð²
CREATE INDEX idx_watcher_price_history_sku_mp_date 
    ON watcher_price_history(sku, marketplace, parsed_at DESC);

-- Partial index Ð´Ð»Ñ ÑÐ¾Ð±ÑÑ‚Ð²ÐµÐ½Ð½Ñ‹Ñ… Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð²
CREATE INDEX idx_watcher_price_history_own 
    ON watcher_price_history(sku, marketplace, parsed_at DESC) 
    WHERE competitor_id IS NULL;

-- Comments
COMMENT ON TABLE watcher_price_history IS 'Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ñ Ñ†ÐµÐ½ Ð¸ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¾ Ñ‚Ð¾Ð²Ð°Ñ€Ð°Ñ… (5 Ð»ÐµÑ‚ Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ñ)';
COMMENT ON COLUMN watcher_price_history.parse_confidence IS 'Ð£Ð²ÐµÑ€ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ AI Parser (0.0-1.0)';
```

### 5.2.6 watcher_alerts

ÐÐ»ÐµÑ€Ñ‚Ñ‹ Ð¾ Ñ†ÐµÐ½Ð¾Ð²Ñ‹Ñ… Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸ÑÑ….

```sql
CREATE TABLE watcher_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- ÐšÐ¾Ð½Ñ‚ÐµÐºÑÑ‚
    sku VARCHAR(50) NOT NULL,
    marketplace VARCHAR(20) NOT NULL,
    brand_id VARCHAR(20) NOT NULL,
    competitor_id UUID REFERENCES watcher_competitors(id),
    
    -- Ð¢Ð¸Ð¿ Ð¸ Ð´ÐµÑ‚Ð°Ð»Ð¸
    alert_type VARCHAR(30) NOT NULL,
    severity VARCHAR(10) NOT NULL DEFAULT 'warning',
    
    -- Ð”Ð°Ð½Ð½Ñ‹Ðµ Ð°Ð»ÐµÑ€Ñ‚Ð°
    details JSONB NOT NULL,
    /*
    ÐŸÑ€Ð¸Ð¼ÐµÑ€Ñ‹ details:
    {
        "old_price": 2999,
        "new_price": 1999,
        "change_percent": -33.3,
        "competitor_name": "Fashion Store"
    }
    */
    
    -- Ð¡Ñ‚Ð°Ñ‚ÑƒÑ
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP,
    read_by UUID REFERENCES users(id),
    
    -- Ð”ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_at TIMESTAMP,
    resolved_by UUID REFERENCES users(id),
    resolution_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_alert_type CHECK (
        alert_type IN (
            'price_drop',           -- Ð¡Ð½Ð¸Ð¶ÐµÐ½Ð¸Ðµ Ñ†ÐµÐ½Ñ‹ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð°
            'price_rise',           -- ÐŸÐ¾Ð²Ñ‹ÑˆÐµÐ½Ð¸Ðµ Ñ†ÐµÐ½Ñ‹ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð°
            'out_of_stock',         -- Ð¢Ð¾Ð²Ð°Ñ€ Ð·Ð°ÐºÐ¾Ð½Ñ‡Ð¸Ð»ÑÑ
            'back_in_stock',        -- Ð¢Ð¾Ð²Ð°Ñ€ ÑÐ½Ð¾Ð²Ð° Ð² Ð½Ð°Ð»Ð¸Ñ‡Ð¸Ð¸
            'new_competitor',       -- ÐÐ¾Ð²Ñ‹Ð¹ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚
            'rating_drop',          -- ÐŸÐ°Ð´ÐµÐ½Ð¸Ðµ Ñ€ÐµÐ¹Ñ‚Ð¸Ð½Ð³Ð°
            'dumping_detected'      -- ÐžÐ±Ð½Ð°Ñ€ÑƒÐ¶ÐµÐ½ Ð´ÐµÐ¼Ð¿Ð¸Ð½Ð³
        )
    ),
    CONSTRAINT chk_alert_severity CHECK (
        severity IN ('info', 'warning', 'critical')
    )
);

-- Indexes
CREATE INDEX idx_watcher_alerts_sku ON watcher_alerts(sku);
CREATE INDEX idx_watcher_alerts_brand ON watcher_alerts(brand_id);
CREATE INDEX idx_watcher_alerts_type ON watcher_alerts(alert_type);
CREATE INDEX idx_watcher_alerts_unread ON watcher_alerts(is_read, created_at DESC) WHERE is_read = FALSE;
CREATE INDEX idx_watcher_alerts_created ON watcher_alerts(created_at DESC);

-- Comments
COMMENT ON TABLE watcher_alerts IS 'ÐÐ»ÐµÑ€Ñ‚Ñ‹ Ð¾Ð± Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸ÑÑ… Ñ†ÐµÐ½ Ð¸ Ð½Ð°Ð»Ð¸Ñ‡Ð¸Ñ';
COMMENT ON COLUMN watcher_alerts.severity IS 'ÐšÑ€Ð¸Ñ‚Ð¸Ñ‡Ð½Ð¾ÑÑ‚ÑŒ: info, warning, critical';
```

### 5.2.7 watcher_settings

Ð“Ð»Ð¾Ð±Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ Ð¼Ð¾Ð´ÑƒÐ»Ñ.

```sql
CREATE TABLE watcher_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES users(id)
);

-- Default settings
INSERT INTO watcher_settings (key, value, description) VALUES
-- Ð­Ð¼ÑƒÐ»ÑÑ†Ð¸Ñ
('emulation.min_delay_ms', '2000', 'ÐœÐ¸Ð½Ð¸Ð¼Ð°Ð»ÑŒÐ½Ð°Ñ Ð·Ð°Ð´ÐµÑ€Ð¶ÐºÐ° Ð¼ÐµÐ¶Ð´Ñƒ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸ÑÐ¼Ð¸ (Ð¼Ñ)'),
('emulation.max_delay_ms', '5000', 'ÐœÐ°ÐºÑÐ¸Ð¼Ð°Ð»ÑŒÐ½Ð°Ñ Ð·Ð°Ð´ÐµÑ€Ð¶ÐºÐ° Ð¼ÐµÐ¶Ð´Ñƒ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸ÑÐ¼Ð¸ (Ð¼Ñ)'),
('emulation.scroll_enabled', 'true', 'Ð’ÐºÐ»ÑŽÑ‡Ð¸Ñ‚ÑŒ ÑÐ¼ÑƒÐ»ÑÑ†Ð¸ÑŽ ÑÐºÑ€Ð¾Ð»Ð»Ð°'),
('emulation.scroll_steps', '3', 'ÐšÐ¾Ð»Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾ ÑˆÐ°Ð³Ð¾Ð² ÑÐºÑ€Ð¾Ð»Ð»Ð°'),
('emulation.mouse_movement', 'true', 'Ð’ÐºÐ»ÑŽÑ‡Ð¸Ñ‚ÑŒ ÑÐ¼ÑƒÐ»ÑÑ†Ð¸ÑŽ Ð´Ð²Ð¸Ð¶ÐµÐ½Ð¸Ð¹ Ð¼Ñ‹ÑˆÐ¸'),
('emulation.mouse_curve', 'bezier', 'Ð¢Ð¸Ð¿ ÐºÑ€Ð¸Ð²Ð¾Ð¹ Ð´Ð²Ð¸Ð¶ÐµÐ½Ð¸Ñ Ð¼Ñ‹ÑˆÐ¸'),
('emulation.page_view_min_ms', '3000', 'ÐœÐ¸Ð½Ð¸Ð¼Ð°Ð»ÑŒÐ½Ð¾Ðµ Ð²Ñ€ÐµÐ¼Ñ Ð¿Ñ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€Ð° ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹ (Ð¼Ñ)'),
('emulation.page_view_max_ms', '8000', 'ÐœÐ°ÐºÑÐ¸Ð¼Ð°Ð»ÑŒÐ½Ð¾Ðµ Ð²Ñ€ÐµÐ¼Ñ Ð¿Ñ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€Ð° ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹ (Ð¼Ñ)'),
('emulation.random_order', 'true', 'Ð¡Ð»ÑƒÑ‡Ð°Ð¹Ð½Ñ‹Ð¹ Ð¿Ð¾Ñ€ÑÐ´Ð¾Ðº Ð¾Ð±Ñ…Ð¾Ð´Ð° URL'),

-- ÐÐ»ÐµÑ€Ñ‚Ñ‹
('alerts.price_drop_threshold', '10', 'ÐŸÐ¾Ñ€Ð¾Ð³ ÑÐ½Ð¸Ð¶ÐµÐ½Ð¸Ñ Ñ†ÐµÐ½Ñ‹ Ð´Ð»Ñ Ð°Ð»ÐµÑ€Ñ‚Ð° (%)'),
('alerts.price_rise_threshold', '20', 'ÐŸÐ¾Ñ€Ð¾Ð³ Ð¿Ð¾Ð²Ñ‹ÑˆÐµÐ½Ð¸Ñ Ñ†ÐµÐ½Ñ‹ Ð´Ð»Ñ Ð°Ð»ÐµÑ€Ñ‚Ð° (%)'),
('alerts.dumping_threshold', '30', 'ÐŸÐ¾Ñ€Ð¾Ð³ Ð´ÐµÐ¼Ð¿Ð¸Ð½Ð³Ð° (%)'),

-- Ð¡Ð¸ÑÑ‚ÐµÐ¼Ð°
('system.task_max_retries', '3', 'ÐœÐ°ÐºÑÐ¸Ð¼ÑƒÐ¼ Ð¿Ð¾Ð²Ñ‚Ð¾Ñ€Ð½Ñ‹Ñ… Ð¿Ð¾Ð¿Ñ‹Ñ‚Ð¾Ðº Ð´Ð»Ñ Ð·Ð°Ð´Ð°Ñ‡Ð¸'),
('system.agent_heartbeat_timeout', '120', 'Ð¢Ð°Ð¹Ð¼Ð°ÑƒÑ‚ heartbeat Ð°Ð³ÐµÐ½Ñ‚Ð° (ÑÐµÐº)'),
('system.ip_semaphore_ttl', '300', 'TTL Ð±Ð»Ð¾ÐºÐ¸Ñ€Ð¾Ð²ÐºÐ¸ IP Semaphore (ÑÐµÐº)'),
('system.panic_cooldown', '3600', 'Ð’Ñ€ÐµÐ¼Ñ cooldown Ð¿Ð¾ÑÐ»Ðµ PANIC (ÑÐµÐº)');

-- Comments
COMMENT ON TABLE watcher_settings IS 'Ð“Ð»Ð¾Ð±Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ Ð¼Ð¾Ð´ÑƒÐ»Ñ Watcher';
```

### 5.2.8 watcher_agent_logs

Ð›Ð¾Ð³Ð¸ ÑÐ¾Ð±Ñ‹Ñ‚Ð¸Ð¹ Ð°Ð³ÐµÐ½Ñ‚Ð¾Ð².

```sql
CREATE TABLE watcher_agent_logs (
    id BIGSERIAL PRIMARY KEY,
    
    agent_id UUID NOT NULL REFERENCES watcher_agents(id),
    
    -- Ð¡Ð¾Ð±Ñ‹Ñ‚Ð¸Ðµ
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(10) NOT NULL DEFAULT 'info',
    message TEXT NOT NULL,
    details JSONB,
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_agent_log_event CHECK (
        event_type IN (
            'status_change', 'heartbeat', 'task_start', 'task_complete', 
            'task_fail', 'panic', 'cookies_update', 'network_switch',
            'modem_reboot', 'command_received', 'error'
        )
    ),
    CONSTRAINT chk_agent_log_severity CHECK (
        severity IN ('debug', 'info', 'warning', 'error', 'critical')
    )
);

-- Indexes
CREATE INDEX idx_watcher_agent_logs_agent ON watcher_agent_logs(agent_id);
CREATE INDEX idx_watcher_agent_logs_event ON watcher_agent_logs(event_type);
CREATE INDEX idx_watcher_agent_logs_created ON watcher_agent_logs(created_at DESC);

-- ÐÐ²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ°Ñ Ð¾Ñ‡Ð¸ÑÑ‚ÐºÐ° ÑÑ‚Ð°Ñ€Ñ‹Ñ… Ð»Ð¾Ð³Ð¾Ð² (30 Ð´Ð½ÐµÐ¹)
-- Ð ÐµÐºÐ¾Ð¼ÐµÐ½Ð´ÑƒÐµÑ‚ÑÑ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¸Ñ‚ÑŒ pg_partman Ð¸Ð»Ð¸ pg_cron

-- Comments
COMMENT ON TABLE watcher_agent_logs IS 'Ð›Ð¾Ð³Ð¸ ÑÐ¾Ð±Ñ‹Ñ‚Ð¸Ð¹ Ð°Ð³ÐµÐ½Ñ‚Ð¾Ð² (30 Ð´Ð½ÐµÐ¹ Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ñ)';
```

---

## 5.3 Ð¡Ñ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ñ‹ Redis

### 5.3.1 ÐžÑ‡ÐµÑ€ÐµÐ´Ð¸ Ð·Ð°Ð´Ð°Ñ‡

```
# ÐžÑ‡ÐµÑ€ÐµÐ´ÑŒ Ð·Ð°Ð´Ð°Ñ‡ Ð¿Ð¾ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°Ð¼ (List)
watcher:task_queue:wildberries    = [task_id_1, task_id_2, ...]
watcher:task_queue:ozon           = [task_id_1, task_id_2, ...]
watcher:task_queue:yandex_market  = [task_id_1, task_id_2, ...]

# ÐžÐ¿ÐµÑ€Ð°Ñ†Ð¸Ð¸:
LPOP  watcher:task_queue:{marketplace}        # ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð·Ð°Ð´Ð°Ñ‡Ð¸
RPUSH watcher:task_queue:{marketplace} {id}   # Ð”Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð·Ð°Ð´Ð°Ñ‡Ð¸
LLEN  watcher:task_queue:{marketplace}        # ÐšÐ¾Ð»Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾ Ð² Ð¾Ñ‡ÐµÑ€ÐµÐ´Ð¸
```

### 5.3.2 IP Semaphore

```
# Ð‘Ð»Ð¾ÐºÐ¸Ñ€Ð¾Ð²ÐºÐ° IP Ð´Ð»Ñ Ð´Ð¾Ð¼ÐµÐ½Ð° (String Ñ TTL)
watcher:ip_sem:{ip}:{domain} = "1"
TTL = 300 ÑÐµÐºÑƒÐ½Ð´

# ÐŸÑ€Ð¸Ð¼ÐµÑ€Ñ‹:
watcher:ip_sem:10.0.0.1:wildberries.ru = "1"
watcher:ip_sem:10.0.0.2:ozon.ru = "1"

# ÐžÐ¿ÐµÑ€Ð°Ñ†Ð¸Ð¸:
SET   watcher:ip_sem:{ip}:{domain} 1 NX EX 300   # Ð—Ð°Ñ…Ð²Ð°Ñ‚
DEL   watcher:ip_sem:{ip}:{domain}               # ÐžÑÐ²Ð¾Ð±Ð¾Ð¶Ð´ÐµÐ½Ð¸Ðµ
EXISTS watcher:ip_sem:{ip}:{domain}              # ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ°
```

### 5.3.3 Ð¡Ð¾ÑÑ‚Ð¾ÑÐ½Ð¸Ðµ Ð°Ð³ÐµÐ½Ñ‚Ð¾Ð²

```
# Ð¢ÐµÐºÑƒÑ‰ÐµÐµ ÑÐ¾ÑÑ‚Ð¾ÑÐ½Ð¸Ðµ Ð°Ð³ÐµÐ½Ñ‚Ð° (Hash)
watcher:agent:{agent_id}:state = {
    "status": "working",
    "current_task": "task_uuid",
    "last_heartbeat": "2026-01-15T22:30:00",
    "current_ip": "10.0.0.1"
}
TTL = 300 ÑÐµÐºÑƒÐ½Ð´ (Ð¾Ð±Ð½Ð¾Ð²Ð»ÑÐµÑ‚ÑÑ Ð¿Ñ€Ð¸ heartbeat)

# IP Ð°Ð³ÐµÐ½Ñ‚Ð° (String)
watcher:agent:{agent_id}:ip = "10.0.0.1"

# WebSocket ÑÐµÑÑÐ¸Ñ (Hash)
watcher:agent:{agent_id}:ws = {
    "connected_at": "2026-01-15T21:00:00",
    "active": "1"
}

# Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ° Ð·Ð° Ð´ÐµÐ½ÑŒ (String)
watcher:agent:{agent_id}:completed:2026-01-15 = "1234"
watcher:agent:{agent_id}:failed:2026-01-15 = "5"
TTL = 172800 ÑÐµÐºÑƒÐ½Ð´ (2 Ð´Ð½Ñ)

# Ð¡Ñ€ÐµÐ´Ð½ÐµÐµ Ð²Ñ€ÐµÐ¼Ñ Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ñ (List, Ð¿Ð¾ÑÐ»ÐµÐ´Ð½Ð¸Ðµ 100)
watcher:agent:{agent_id}:timing = ["1250", "980", "1100", ...]
```

### 5.3.4 Panic Ð¸ Ð±Ð»Ð¾ÐºÐ¸Ñ€Ð¾Ð²ÐºÐ¸

```
# Ð—Ð°Ð±Ð»Ð¾ÐºÐ¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ðµ IP (String Ñ TTL)
watcher:ip_blocked:{ip} = "captcha_detected"
TTL = 3600 ÑÐµÐºÑƒÐ½Ð´ (1 Ñ‡Ð°Ñ)

# Ð˜Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ñ Ð¾ Panic (Hash)
watcher:agent:{agent_id}:panic = {
    "reason": "captcha",
    "details": "{...}",
    "timestamp": "2026-01-15T23:45:00"
}
```

### 5.3.5 ÐšÑÑˆ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð°

```
# ÐšÑÑˆ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð² AI Parser (String)
watcher:parse_cache:{marketplace}:{text_hash} = "{...json...}"
TTL = 3600 ÑÐµÐºÑƒÐ½Ð´ (1 Ñ‡Ð°Ñ)
```

### 5.3.6 Ð”Ð½ÐµÐ²Ð½Ð°Ñ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ°

```
# Ð“Ð»Ð¾Ð±Ð°Ð»ÑŒÐ½Ð°Ñ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ° (Hash)
watcher:stats:2026-01-15 = {
    "tasks_total": "33000",
    "tasks_completed": "32500",
    "tasks_failed": "500",
    "avg_parse_time_ms": "1250",
    "alerts_generated": "15"
}
TTL = 604800 ÑÐµÐºÑƒÐ½Ð´ (7 Ð´Ð½ÐµÐ¹)
```

---

## 5.4 ÐœÐ¸Ð³Ñ€Ð°Ñ†Ð¸Ð¸

### ÐÐ°Ñ‡Ð°Ð»ÑŒÐ½Ð°Ñ Ð¼Ð¸Ð³Ñ€Ð°Ñ†Ð¸Ñ

```python
# alembic/versions/001_create_watcher_tables.py

"""Create Watcher tables

Revision ID: 001
Create Date: 2026-01-15
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB


revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # watcher_agents
    op.create_table(
        'watcher_agents',
        sa.Column('id', UUID(), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('description', sa.Text()),
        sa.Column('api_key_hash', sa.String(64), nullable=False, unique=True),
        sa.Column('manager_user_id', UUID(), sa.ForeignKey('users.id')),
        sa.Column('pc_name', sa.String(100)),
        sa.Column('status', sa.String(20), nullable=False, server_default='offline'),
        sa.Column('current_ip', sa.String(45)),
        sa.Column('current_task_id', UUID()),
        sa.Column('modem_operator', sa.String(50)),
        sa.Column('signal_strength', sa.Integer()),
        sa.Column('cookies_updated_at', sa.DateTime()),
        sa.Column('cookies_valid', sa.Boolean(), server_default='false'),
        sa.Column('tasks_completed_total', sa.Integer(), server_default='0'),
        sa.Column('tasks_failed_total', sa.Integer(), server_default='0'),
        sa.Column('avg_task_time_ms', sa.Integer()),
        sa.Column('version', sa.String(20)),
        sa.Column('config', JSONB(), server_default='{}'),
        sa.Column('last_heartbeat', sa.DateTime()),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()'))
    )
    
    op.create_index('idx_watcher_agents_status', 'watcher_agents', ['status'])
    op.create_index('idx_watcher_agents_last_heartbeat', 'watcher_agents', ['last_heartbeat'])
    
    # watcher_subscriptions
    op.create_table(
        'watcher_subscriptions',
        sa.Column('id', UUID(), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('sku', sa.String(50), nullable=False),
        sa.Column('marketplace', sa.String(20), nullable=False),
        sa.Column('brand_id', sa.String(20), nullable=False),
        sa.Column('url', sa.String(500)),
        sa.Column('priority', sa.Integer(), server_default='0'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('alert_price_drop_percent', sa.Integer(), server_default='10'),
        sa.Column('alert_price_rise_percent', sa.Integer(), server_default='20'),
        sa.Column('alert_out_of_stock', sa.Boolean(), server_default='true'),
        sa.Column('notes', sa.Text()),
        sa.Column('created_by', UUID(), sa.ForeignKey('users.id')),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.UniqueConstraint('sku', 'marketplace', name='uq_subscription_sku_marketplace')
    )
    
    op.create_index('idx_watcher_subscriptions_sku', 'watcher_subscriptions', ['sku'])
    op.create_index('idx_watcher_subscriptions_marketplace', 'watcher_subscriptions', ['marketplace'])
    op.create_index('idx_watcher_subscriptions_brand', 'watcher_subscriptions', ['brand_id'])
    
    # watcher_competitors
    op.create_table(
        'watcher_competitors',
        sa.Column('id', UUID(), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('our_sku', sa.String(50), nullable=False),
        sa.Column('subscription_id', UUID(), sa.ForeignKey('watcher_subscriptions.id', ondelete='CASCADE')),
        sa.Column('competitor_sku', sa.String(50), nullable=False),
        sa.Column('marketplace', sa.String(20), nullable=False),
        sa.Column('seller_name', sa.String(200)),
        sa.Column('url', sa.String(500), nullable=False, unique=True),
        sa.Column('category', sa.String(200)),
        sa.Column('priority', sa.Integer(), server_default='0'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('notes', sa.Text()),
        sa.Column('added_by', UUID(), sa.ForeignKey('users.id')),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()'))
    )
    
    op.create_index('idx_watcher_competitors_our_sku', 'watcher_competitors', ['our_sku'])
    op.create_index('idx_watcher_competitors_marketplace', 'watcher_competitors', ['marketplace'])
    
    # watcher_tasks
    op.create_table(
        'watcher_tasks',
        sa.Column('id', UUID(), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('url', sa.String(500), nullable=False),
        sa.Column('marketplace', sa.String(20), nullable=False),
        sa.Column('sku', sa.String(50), nullable=False),
        sa.Column('brand_id', sa.String(20), nullable=False),
        sa.Column('subscription_id', UUID(), sa.ForeignKey('watcher_subscriptions.id')),
        sa.Column('competitor_id', UUID(), sa.ForeignKey('watcher_competitors.id')),
        sa.Column('agent_id', UUID(), sa.ForeignKey('watcher_agents.id')),
        sa.Column('status', sa.String(20), nullable=False, server_default='pending'),
        sa.Column('priority', sa.Integer(), server_default='0'),
        sa.Column('scheduled_date', sa.Date(), nullable=False),
        sa.Column('started_at', sa.DateTime()),
        sa.Column('completed_at', sa.DateTime()),
        sa.Column('execution_time_ms', sa.Integer()),
        sa.Column('retry_count', sa.Integer(), server_default='0'),
        sa.Column('error', sa.Text()),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()'))
    )
    
    op.create_index('idx_watcher_tasks_status', 'watcher_tasks', ['status'])
    op.create_index('idx_watcher_tasks_scheduled', 'watcher_tasks', ['scheduled_date'])
    op.create_index('idx_watcher_tasks_agent', 'watcher_tasks', ['agent_id'])
    op.create_index('idx_watcher_tasks_sku', 'watcher_tasks', ['sku'])
    
    # watcher_price_history
    op.create_table(
        'watcher_price_history',
        sa.Column('id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('sku', sa.String(50), nullable=False),
        sa.Column('marketplace', sa.String(20), nullable=False),
        sa.Column('brand_id', sa.String(20), nullable=False),
        sa.Column('subscription_id', UUID(), sa.ForeignKey('watcher_subscriptions.id')),
        sa.Column('competitor_id', UUID(), sa.ForeignKey('watcher_competitors.id')),
        sa.Column('task_id', UUID(), sa.ForeignKey('watcher_tasks.id')),
        sa.Column('current_price', sa.Numeric(12, 2)),
        sa.Column('old_price', sa.Numeric(12, 2)),
        sa.Column('spp_price', sa.Numeric(12, 2)),
        sa.Column('discount_percent', sa.Integer()),
        sa.Column('in_stock', sa.Boolean()),
        sa.Column('stock_quantity', sa.Integer()),
        sa.Column('rating', sa.Numeric(2, 1)),
        sa.Column('reviews_count', sa.Integer()),
        sa.Column('sales_count', sa.Integer()),
        sa.Column('position', sa.Integer()),
        sa.Column('ad_bid', sa.Numeric(10, 2)),
        sa.Column('seller_name', sa.String(200)),
        sa.Column('card_title', sa.String(500)),
        sa.Column('card_description', sa.Text()),
        sa.Column('card_attributes', JSONB()),
        sa.Column('category', sa.String(500)),
        sa.Column('parse_confidence', sa.Numeric(3, 2)),
        sa.Column('parsed_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()'))
    )
    
    op.create_index('idx_watcher_price_history_sku', 'watcher_price_history', ['sku'])
    op.create_index('idx_watcher_price_history_marketplace', 'watcher_price_history', ['marketplace'])
    op.create_index('idx_watcher_price_history_brand', 'watcher_price_history', ['brand_id'])
    op.create_index('idx_watcher_price_history_parsed_at', 'watcher_price_history', ['parsed_at'])
    op.create_index('idx_watcher_price_history_sku_mp_date', 'watcher_price_history', 
                    ['sku', 'marketplace', sa.text('parsed_at DESC')])
    
    # watcher_alerts
    op.create_table(
        'watcher_alerts',
        sa.Column('id', UUID(), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('sku', sa.String(50), nullable=False),
        sa.Column('marketplace', sa.String(20), nullable=False),
        sa.Column('brand_id', sa.String(20), nullable=False),
        sa.Column('competitor_id', UUID(), sa.ForeignKey('watcher_competitors.id')),
        sa.Column('alert_type', sa.String(30), nullable=False),
        sa.Column('severity', sa.String(10), nullable=False, server_default='warning'),
        sa.Column('details', JSONB(), nullable=False),
        sa.Column('is_read', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('read_at', sa.DateTime()),
        sa.Column('read_by', UUID(), sa.ForeignKey('users.id')),
        sa.Column('is_resolved', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('resolved_at', sa.DateTime()),
        sa.Column('resolved_by', UUID(), sa.ForeignKey('users.id')),
        sa.Column('resolution_notes', sa.Text()),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()'))
    )
    
    op.create_index('idx_watcher_alerts_sku', 'watcher_alerts', ['sku'])
    op.create_index('idx_watcher_alerts_brand', 'watcher_alerts', ['brand_id'])
    op.create_index('idx_watcher_alerts_type', 'watcher_alerts', ['alert_type'])
    op.create_index('idx_watcher_alerts_unread', 'watcher_alerts', ['is_read', 'created_at'],
                    postgresql_where=sa.text('is_read = false'))
    
    # watcher_settings
    op.create_table(
        'watcher_settings',
        sa.Column('key', sa.String(100), primary_key=True),
        sa.Column('value', sa.Text(), nullable=False),
        sa.Column('description', sa.Text()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('updated_by', UUID(), sa.ForeignKey('users.id'))
    )
    
    # watcher_agent_logs
    op.create_table(
        'watcher_agent_logs',
        sa.Column('id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('agent_id', UUID(), sa.ForeignKey('watcher_agents.id'), nullable=False),
        sa.Column('event_type', sa.String(50), nullable=False),
        sa.Column('severity', sa.String(10), nullable=False, server_default='info'),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('details', JSONB()),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()'))
    )
    
    op.create_index('idx_watcher_agent_logs_agent', 'watcher_agent_logs', ['agent_id'])
    op.create_index('idx_watcher_agent_logs_event', 'watcher_agent_logs', ['event_type'])
    op.create_index('idx_watcher_agent_logs_created', 'watcher_agent_logs', [sa.text('created_at DESC')])


def downgrade():
    op.drop_table('watcher_agent_logs')
    op.drop_table('watcher_settings')
    op.drop_table('watcher_alerts')
    op.drop_table('watcher_price_history')
    op.drop_table('watcher_tasks')
    op.drop_table('watcher_competitors')
    op.drop_table('watcher_subscriptions')
    op.drop_table('watcher_agents')
```

---

## 5.5 ÐœÐ¾Ð´ÐµÐ»Ð¸ SQLAlchemy

```python
# app/models/watcher.py

from datetime import datetime, date
from typing import Optional, List
from enum import Enum as PyEnum

from sqlalchemy import (
    Column, String, Integer, BigInteger, Boolean, Text, Date, 
    DateTime, Numeric, ForeignKey, UniqueConstraint, Index
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid

from app.core.database import Base


class AgentStatus(str, PyEnum):
    IDLE = "idle"
    PREPARING = "preparing"
    READY = "ready"
    WORKING = "working"
    PAUSED = "paused"
    PANIC = "panic"
    OFFLINE = "offline"
    STOPPED = "stopped"


class TaskStatus(str, PyEnum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    PARSE_ERROR = "parse_error"
    CANCELLED = "cancelled"


class Marketplace(str, PyEnum):
    WILDBERRIES = "wildberries"
    OZON = "ozon"
    YANDEX_MARKET = "yandex_market"


class AlertType(str, PyEnum):
    PRICE_DROP = "price_drop"
    PRICE_RISE = "price_rise"
    OUT_OF_STOCK = "out_of_stock"
    BACK_IN_STOCK = "back_in_stock"
    NEW_COMPETITOR = "new_competitor"
    RATING_DROP = "rating_drop"
    DUMPING_DETECTED = "dumping_detected"


class WatcherAgent(Base):
    __tablename__ = "watcher_agents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    api_key_hash = Column(String(64), nullable=False, unique=True)
    manager_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    pc_name = Column(String(100))
    status = Column(String(20), nullable=False, default=AgentStatus.OFFLINE.value)
    current_ip = Column(String(45))
    current_task_id = Column(UUID(as_uuid=True))
    modem_operator = Column(String(50))
    signal_strength = Column(Integer)
    cookies_updated_at = Column(DateTime)
    cookies_valid = Column(Boolean, default=False)
    tasks_completed_total = Column(Integer, default=0)
    tasks_failed_total = Column(Integer, default=0)
    avg_task_time_ms = Column(Integer)
    version = Column(String(20))
    config = Column(JSONB, default={})
    last_heartbeat = Column(DateTime)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    tasks = relationship("WatcherTask", back_populates="agent")
    logs = relationship("WatcherAgentLog", back_populates="agent")


class WatcherSubscription(Base):
    __tablename__ = "watcher_subscriptions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sku = Column(String(50), nullable=False)
    marketplace = Column(String(20), nullable=False)
    brand_id = Column(String(20), nullable=False)
    url = Column(String(500))
    priority = Column(Integer, default=0)
    is_active = Column(Boolean, nullable=False, default=True)
    alert_price_drop_percent = Column(Integer, default=10)
    alert_price_rise_percent = Column(Integer, default=20)
    alert_out_of_stock = Column(Boolean, default=True)
    notes = Column(Text)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        UniqueConstraint('sku', 'marketplace', name='uq_subscription_sku_marketplace'),
    )
    
    # Relationships
    competitors = relationship("WatcherCompetitor", back_populates="subscription")
    tasks = relationship("WatcherTask", back_populates="subscription")
    price_history = relationship("WatcherPriceHistory", back_populates="subscription")


class WatcherCompetitor(Base):
    __tablename__ = "watcher_competitors"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    our_sku = Column(String(50), nullable=False)
    subscription_id = Column(UUID(as_uuid=True), ForeignKey("watcher_subscriptions.id", ondelete="CASCADE"))
    competitor_sku = Column(String(50), nullable=False)
    marketplace = Column(String(20), nullable=False)
    seller_name = Column(String(200))
    url = Column(String(500), nullable=False, unique=True)
    category = Column(String(200))
    priority = Column(Integer, default=0)
    is_active = Column(Boolean, nullable=False, default=True)
    notes = Column(Text)
    added_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    subscription = relationship("WatcherSubscription", back_populates="competitors")
    tasks = relationship("WatcherTask", back_populates="competitor")
    price_history = relationship("WatcherPriceHistory", back_populates="competitor")
    alerts = relationship("WatcherAlert", back_populates="competitor")


class WatcherTask(Base):
    __tablename__ = "watcher_tasks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    url = Column(String(500), nullable=False)
    marketplace = Column(String(20), nullable=False)
    sku = Column(String(50), nullable=False)
    brand_id = Column(String(20), nullable=False)
    subscription_id = Column(UUID(as_uuid=True), ForeignKey("watcher_subscriptions.id"))
    competitor_id = Column(UUID(as_uuid=True), ForeignKey("watcher_competitors.id"))
    agent_id = Column(UUID(as_uuid=True), ForeignKey("watcher_agents.id"))
    status = Column(String(20), nullable=False, default=TaskStatus.PENDING.value)
    priority = Column(Integer, default=0)
    scheduled_date = Column(Date, nullable=False)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    execution_time_ms = Column(Integer)
    retry_count = Column(Integer, default=0)
    error = Column(Text)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    # Relationships
    subscription = relationship("WatcherSubscription", back_populates="tasks")
    competitor = relationship("WatcherCompetitor", back_populates="tasks")
    agent = relationship("WatcherAgent", back_populates="tasks")
    price_history = relationship("WatcherPriceHistory", back_populates="task", uselist=False)


class WatcherPriceHistory(Base):
    __tablename__ = "watcher_price_history"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    sku = Column(String(50), nullable=False)
    marketplace = Column(String(20), nullable=False)
    brand_id = Column(String(20), nullable=False)
    subscription_id = Column(UUID(as_uuid=True), ForeignKey("watcher_subscriptions.id"))
    competitor_id = Column(UUID(as_uuid=True), ForeignKey("watcher_competitors.id"))
    task_id = Column(UUID(as_uuid=True), ForeignKey("watcher_tasks.id"))
    current_price = Column(Numeric(12, 2))
    old_price = Column(Numeric(12, 2))
    spp_price = Column(Numeric(12, 2))
    discount_percent = Column(Integer)
    in_stock = Column(Boolean)
    stock_quantity = Column(Integer)
    rating = Column(Numeric(2, 1))
    reviews_count = Column(Integer)
    sales_count = Column(Integer)
    position = Column(Integer)
    ad_bid = Column(Numeric(10, 2))
    seller_name = Column(String(200))
    card_title = Column(String(500))
    card_description = Column(Text)
    card_attributes = Column(JSONB)
    category = Column(String(500))
    parse_confidence = Column(Numeric(3, 2))
    parsed_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    # Relationships
    subscription = relationship("WatcherSubscription", back_populates="price_history")
    competitor = relationship("WatcherCompetitor", back_populates="price_history")
    task = relationship("WatcherTask", back_populates="price_history")


class WatcherAlert(Base):
    __tablename__ = "watcher_alerts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sku = Column(String(50), nullable=False)
    marketplace = Column(String(20), nullable=False)
    brand_id = Column(String(20), nullable=False)
    competitor_id = Column(UUID(as_uuid=True), ForeignKey("watcher_competitors.id"))
    alert_type = Column(String(30), nullable=False)
    severity = Column(String(10), nullable=False, default="warning")
    details = Column(JSONB, nullable=False)
    is_read = Column(Boolean, nullable=False, default=False)
    read_at = Column(DateTime)
    read_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    is_resolved = Column(Boolean, nullable=False, default=False)
    resolved_at = Column(DateTime)
    resolved_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    resolution_notes = Column(Text)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    # Relationships
    competitor = relationship("WatcherCompetitor", back_populates="alerts")


class WatcherSetting(Base):
    __tablename__ = "watcher_settings"
    
    key = Column(String(100), primary_key=True)
    value = Column(Text, nullable=False)
    description = Column(Text)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    updated_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))


class WatcherAgentLog(Base):
    __tablename__ = "watcher_agent_logs"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    agent_id = Column(UUID(as_uuid=True), ForeignKey("watcher_agents.id"), nullable=False)
    event_type = Column(String(50), nullable=False)
    severity = Column(String(10), nullable=False, default="info")
    message = Column(Text, nullable=False)
    details = Column(JSONB)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    # Relationships
    agent = relationship("WatcherAgent", back_populates="logs")
```

---

## 5.6 Ð¢Ð¸Ð¿Ð¾Ð²Ñ‹Ðµ Ð·Ð°Ð¿Ñ€Ð¾ÑÑ‹

### 5.6.1 ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ð¸ Ñ†ÐµÐ½

```sql
-- Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ñ Ñ†ÐµÐ½ Ð´Ð»Ñ SKU Ð·Ð° Ð¿Ð¾ÑÐ»ÐµÐ´Ð½Ð¸Ðµ 30 Ð´Ð½ÐµÐ¹
SELECT 
    parsed_at::date as date,
    current_price,
    old_price,
    spp_price,
    in_stock,
    rating,
    reviews_count
FROM watcher_price_history
WHERE sku = 'OM-12345'
  AND marketplace = 'wildberries'
  AND competitor_id IS NULL  -- Ð¢Ð¾Ð»ÑŒÐºÐ¾ Ð½Ð°Ñˆ Ñ‚Ð¾Ð²Ð°Ñ€
  AND parsed_at >= NOW() - INTERVAL '30 days'
ORDER BY parsed_at DESC;
```

### 5.6.2 Ð¡Ñ€Ð°Ð²Ð½ÐµÐ½Ð¸Ðµ Ñ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð°Ð¼Ð¸

```sql
-- Ð¢ÐµÐºÑƒÑ‰Ð¸Ðµ Ñ†ÐµÐ½Ñ‹ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð¾Ð² Ð´Ð»Ñ SKU
WITH latest_prices AS (
    SELECT DISTINCT ON (competitor_id)
        competitor_id,
        current_price,
        spp_price,
        in_stock,
        seller_name,
        parsed_at
    FROM watcher_price_history
    WHERE sku = 'OM-12345'
      AND marketplace = 'wildberries'
      AND competitor_id IS NOT NULL
    ORDER BY competitor_id, parsed_at DESC
)
SELECT 
    c.seller_name,
    lp.current_price,
    lp.spp_price,
    lp.in_stock,
    lp.parsed_at
FROM latest_prices lp
JOIN watcher_competitors c ON c.id = lp.competitor_id
WHERE c.is_active = TRUE
ORDER BY lp.current_price ASC;
```

### 5.6.3 Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ° Ð·Ð°Ð´Ð°Ñ‡ Ð·Ð° Ð´ÐµÐ½ÑŒ

```sql
-- Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ° Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ñ Ð·Ð°Ð´Ð°Ñ‡
SELECT 
    status,
    COUNT(*) as count,
    AVG(execution_time_ms) as avg_time_ms
FROM watcher_tasks
WHERE scheduled_date = CURRENT_DATE
GROUP BY status;
```

### 5.6.4 ÐÐµÐ¿Ñ€Ð¾Ñ‡Ð¸Ñ‚Ð°Ð½Ð½Ñ‹Ðµ Ð°Ð»ÐµÑ€Ñ‚Ñ‹

```sql
-- ÐÐµÐ¿Ñ€Ð¾Ñ‡Ð¸Ñ‚Ð°Ð½Ð½Ñ‹Ðµ Ð°Ð»ÐµÑ€Ñ‚Ñ‹ Ð´Ð»Ñ Ð¼ÐµÐ½ÐµÐ´Ð¶ÐµÑ€Ð°
SELECT 
    a.id,
    a.alert_type,
    a.severity,
    a.sku,
    a.marketplace,
    a.details,
    a.created_at,
    c.seller_name as competitor_name
FROM watcher_alerts a
LEFT JOIN watcher_competitors c ON c.id = a.competitor_id
WHERE a.brand_id IN ('ohana_market', 'all')  -- Ð¤Ð¸Ð»ÑŒÑ‚Ñ€ Ð¿Ð¾ Ð±Ñ€ÐµÐ½Ð´Ñƒ
  AND a.is_read = FALSE
ORDER BY 
    CASE a.severity 
        WHEN 'critical' THEN 1 
        WHEN 'warning' THEN 2 
        ELSE 3 
    END,
    a.created_at DESC
LIMIT 50;
```

### 5.6.5 ÐŸÑ€Ð¾Ð¸Ð·Ð²Ð¾Ð´Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ÑÑ‚ÑŒ Ð°Ð³ÐµÐ½Ñ‚Ð¾Ð²

```sql
-- Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ° Ð°Ð³ÐµÐ½Ñ‚Ð¾Ð² Ð·Ð° ÑÐµÐ³Ð¾Ð´Ð½Ñ
SELECT 
    a.id,
    a.name,
    a.status,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed,
    COUNT(CASE WHEN t.status = 'failed' THEN 1 END) as failed,
    AVG(t.execution_time_ms) as avg_time_ms,
    a.last_heartbeat
FROM watcher_agents a
LEFT JOIN watcher_tasks t ON t.agent_id = a.id 
    AND t.scheduled_date = CURRENT_DATE
GROUP BY a.id, a.name, a.status, a.last_heartbeat
ORDER BY completed DESC;
```

---

## 5.7 ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ¸ Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ñ Ð´Ð°Ð½Ð½Ñ‹Ñ…

### Ð¡Ñ€Ð¾ÐºÐ¸ Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ñ

| Ð¢Ð°Ð±Ð»Ð¸Ñ†Ð° | Ð¡Ñ€Ð¾Ðº | Ð”ÐµÐ¹ÑÑ‚Ð²Ð¸Ðµ |
|---------|------|----------|
| `watcher_price_history` | 5 Ð»ÐµÑ‚ | ÐŸÐ°Ñ€Ñ‚Ð¸Ñ†Ð¸Ð¾Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð¿Ð¾ Ð¼ÐµÑÑÑ†Ð°Ð¼ |
| `watcher_tasks` | 90 Ð´Ð½ÐµÐ¹ | Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ñ€Ñ‹Ñ… Ð·Ð°Ð¿Ð¸ÑÐµÐ¹ |
| `watcher_alerts` | 1 Ð³Ð¾Ð´ | Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ Ñ€Ð°Ð·Ñ€ÐµÑˆÑ‘Ð½Ð½Ñ‹Ñ… Ð°Ð»ÐµÑ€Ñ‚Ð¾Ð² |
| `watcher_agent_logs` | 30 Ð´Ð½ÐµÐ¹ | ÐÐ²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ°Ñ Ð¾Ñ‡Ð¸ÑÑ‚ÐºÐ° |

### ÐÐ²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ°Ñ Ð¾Ñ‡Ð¸ÑÑ‚ÐºÐ°

```sql
-- Ð—Ð°Ð´Ð°Ñ‡Ð° Ð´Ð»Ñ pg_cron (ÐµÐ¶ÐµÐ´Ð½ÐµÐ²Ð½Ð¾ Ð² 04:00)

-- ÐžÑ‡Ð¸ÑÑ‚ÐºÐ° ÑÑ‚Ð°Ñ€Ñ‹Ñ… Ð·Ð°Ð´Ð°Ñ‡
DELETE FROM watcher_tasks
WHERE scheduled_date < CURRENT_DATE - INTERVAL '90 days';

-- ÐžÑ‡Ð¸ÑÑ‚ÐºÐ° ÑÑ‚Ð°Ñ€Ñ‹Ñ… Ð»Ð¾Ð³Ð¾Ð² Ð°Ð³ÐµÐ½Ñ‚Ð¾Ð²
DELETE FROM watcher_agent_logs
WHERE created_at < NOW() - INTERVAL '30 days';

-- ÐžÑ‡Ð¸ÑÑ‚ÐºÐ° Ñ€Ð°Ð·Ñ€ÐµÑˆÑ‘Ð½Ð½Ñ‹Ñ… Ð°Ð»ÐµÑ€Ñ‚Ð¾Ð² ÑÑ‚Ð°Ñ€ÑˆÐµ Ð³Ð¾Ð´Ð°
DELETE FROM watcher_alerts
WHERE is_resolved = TRUE
  AND created_at < NOW() - INTERVAL '1 year';

-- Ð’Ð°ÐºÑƒÑƒÐ¼ Ð¿Ð¾ÑÐ»Ðµ ÑƒÐ´Ð°Ð»ÐµÐ½Ð¸Ñ
VACUUM ANALYZE watcher_tasks;
VACUUM ANALYZE watcher_agent_logs;
VACUUM ANALYZE watcher_alerts;
```

### ÐŸÐ°Ñ€Ñ‚Ð¸Ñ†Ð¸Ð¾Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ price_history

```sql
-- Ð¡Ð¾Ð·Ð´Ð°Ð½Ð¸Ðµ Ð¿Ð°Ñ€Ñ‚Ð¸Ñ†Ð¸Ð¾Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾Ð¹ Ñ‚Ð°Ð±Ð»Ð¸Ñ†Ñ‹ (Ð¿Ñ€Ð¸ Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ð¾ÑÑ‚Ð¸)
CREATE TABLE watcher_price_history_partitioned (
    LIKE watcher_price_history INCLUDING ALL
) PARTITION BY RANGE (parsed_at);

-- Ð¡Ð¾Ð·Ð´Ð°Ð½Ð¸Ðµ Ð¿Ð°Ñ€Ñ‚Ð¸Ñ†Ð¸Ð¹ Ð¿Ð¾ Ð¼ÐµÑÑÑ†Ð°Ð¼
CREATE TABLE watcher_price_history_2026_01 
    PARTITION OF watcher_price_history_partitioned
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE watcher_price_history_2026_02 
    PARTITION OF watcher_price_history_partitioned
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

-- Ð˜ Ñ‚.Ð´.
```

---

## 5.8 Ð ÐµÐ·ÐµÑ€Ð²Ð½Ð¾Ðµ ÐºÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ

### Ð¡Ñ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ñ

| Ð¢Ð¸Ð¿ | Ð§Ð°ÑÑ‚Ð¾Ñ‚Ð° | Ð¥Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ |
|-----|---------|----------|
| Full backup | Ð•Ð¶ÐµÐ´Ð½ÐµÐ²Ð½Ð¾ 03:00 | 30 Ð´Ð½ÐµÐ¹ |
| WAL Ð°Ñ€Ñ…Ð¸Ð²Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ | ÐÐµÐ¿Ñ€ÐµÑ€Ñ‹Ð²Ð½Ð¾ | 7 Ð´Ð½ÐµÐ¹ |
| Snapshots Redis | ÐšÐ°Ð¶Ð´Ñ‹Ðµ 15 Ð¼Ð¸Ð½ | 24 Ñ‡Ð°ÑÐ° |

### Ð¡ÐºÑ€Ð¸Ð¿Ñ‚ Ð±ÑÐºÐ°Ð¿Ð°

```bash
#!/bin/bash
# /opt/scripts/watcher_backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/watcher"
PG_DUMP="/usr/bin/pg_dump"

# PostgreSQL backup (Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ñ‚Ð°Ð±Ð»Ð¸Ñ†Ñ‹ Watcher)
$PG_DUMP -h localhost -U adolf -d adolf \
    -t 'watcher_*' \
    -F c \
    -f "$BACKUP_DIR/watcher_pg_$DATE.dump"

# Redis backup (RDB)
redis-cli BGSAVE
cp /var/lib/redis/dump.rdb "$BACKUP_DIR/watcher_redis_$DATE.rdb"

# ÐžÑ‡Ð¸ÑÑ‚ÐºÐ° ÑÑ‚Ð°Ñ€Ñ‹Ñ… Ð±ÑÐºÐ°Ð¿Ð¾Ð² (>30 Ð´Ð½ÐµÐ¹)
find $BACKUP_DIR -name "*.dump" -mtime +30 -delete
find $BACKUP_DIR -name "*.rdb" -mtime +1 -delete

# Ð›Ð¾Ð³Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ
echo "$(date): Backup completed" >> /var/log/watcher_backup.log
```

---

## ÐŸÑ€Ð¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ Ð: ÐžÑ†ÐµÐ½ÐºÐ° Ñ€Ð°Ð·Ð¼ÐµÑ€Ð° Ð´Ð°Ð½Ð½Ñ‹Ñ…

### Ð Ð°ÑÑ‡Ñ‘Ñ‚ (5 Ð»ÐµÑ‚)

| Ð”Ð°Ð½Ð½Ñ‹Ðµ | Ð—Ð°Ð¿Ð¸ÑÐµÐ¹/Ð´ÐµÐ½ÑŒ | Ð Ð°Ð·Ð¼ÐµÑ€ Ð·Ð°Ð¿Ð¸ÑÐ¸ | Ð—Ð° 5 Ð»ÐµÑ‚ |
|--------|:------------:|:-------------:|:--------:|
| price_history | 33 000 | ~500 Ð±Ð°Ð¹Ñ‚ | ~30 GB |
| tasks | 33 000 | ~300 Ð±Ð°Ð¹Ñ‚ | ~18 GB |
| alerts | ~50 | ~200 Ð±Ð°Ð¹Ñ‚ | ~18 MB |
| agent_logs | ~10 000 | ~150 Ð±Ð°Ð¹Ñ‚ | ~2.7 GB |

**Ð˜Ñ‚Ð¾Ð³Ð¾:** ~50 GB (Ð±ÐµÐ· ÑƒÑ‡Ñ‘Ñ‚Ð° Ð¸Ð½Ð´ÐµÐºÑÐ¾Ð²)  
**Ð¡ Ð¸Ð½Ð´ÐµÐºÑÐ°Ð¼Ð¸:** ~75-100 GB

### Ð ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸

- SSD Ñ…Ñ€Ð°Ð½Ð¸Ð»Ð¸Ñ‰Ðµ Ð´Ð»Ñ PostgreSQL
- ÐŸÐ°Ñ€Ñ‚Ð¸Ñ†Ð¸Ð¾Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ price_history Ð¿Ð¾ Ð¼ÐµÑÑÑ†Ð°Ð¼
- Ð ÐµÐ³ÑƒÐ»ÑÑ€Ð½Ñ‹Ð¹ VACUUM ANALYZE
- ÐœÐ¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³ Ñ€Ð¾ÑÑ‚Ð° Ñ‚Ð°Ð±Ð»Ð¸Ñ†

---

## ÐŸÑ€Ð¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ Ð‘: ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÑŒÐ½Ñ‹Ðµ Ñ‚Ð¾Ñ‡ÐºÐ¸ Database

| ÐšÑ€Ð¸Ñ‚ÐµÑ€Ð¸Ð¹ | ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° |
|----------|----------|
| Ð¢Ð°Ð±Ð»Ð¸Ñ†Ñ‹ ÑÐ¾Ð·Ð´Ð°Ð½Ñ‹ | `\dt watcher_*` Ð² psql |
| Ð˜Ð½Ð´ÐµÐºÑÑ‹ ÑÐ¾Ð·Ð´Ð°Ð½Ñ‹ | `\di watcher_*` Ð² psql |
| FK constraints | ÐÐµÑ‚ orphan Ð·Ð°Ð¿Ð¸ÑÐµÐ¹ |
| Redis ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ñ‹ | `KEYS watcher:*` |
| Ð‘ÑÐºÐ°Ð¿Ñ‹ Ñ€Ð°Ð±Ð¾Ñ‚Ð°ÑŽÑ‚ | Ð¤Ð°Ð¹Ð»Ñ‹ Ð² /var/backups/watcher |
| ÐžÑ‡Ð¸ÑÑ‚ÐºÐ° Ñ€Ð°Ð±Ð¾Ñ‚Ð°ÐµÑ‚ | ÐÐµÑ‚ Ð·Ð°Ð¿Ð¸ÑÐµÐ¹ ÑÑ‚Ð°Ñ€ÑˆÐµ Ð»Ð¸Ð¼Ð¸Ñ‚Ð° |

---

**Ð”Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚ Ð¿Ð¾Ð´Ð³Ð¾Ñ‚Ð¾Ð²Ð»ÐµÐ½:** Ð¯Ð½Ð²Ð°Ñ€ÑŒ 2026  
**Ð’ÐµÑ€ÑÐ¸Ñ:** 2.0  
**Ð¡Ñ‚Ð°Ñ‚ÑƒÑ:** Ð§ÐµÑ€Ð½Ð¾Ð²Ð¸Ðº

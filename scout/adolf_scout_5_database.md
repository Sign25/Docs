---
title: "Раздел 5: База данных"
mode: "wide"
---

**ÐŸÑ€Ð¾ÐµÐºÑ‚:** ÐŸÑ€ÐµÐ´Ð¸ÐºÑ‚Ð¸Ð²Ð½Ð°Ñ Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ñ‚Ð¾Ð²Ð°Ñ€Ð½Ñ‹Ñ… Ð½Ð¸Ñˆ  
**ÐœÐ¾Ð´ÑƒÐ»ÑŒ:** Scout / Database  
**Ð’ÐµÑ€ÑÐ¸Ñ:** 1.0  
**Ð”Ð°Ñ‚Ð°:** Ð¯Ð½Ð²Ð°Ñ€ÑŒ 2026

---

## 5.1 ÐžÐ±Ð·Ð¾Ñ€ ÑÑ…ÐµÐ¼Ñ‹ Ð´Ð°Ð½Ð½Ñ‹Ñ…

### ER-Ð´Ð¸Ð°Ð³Ñ€Ð°Ð¼Ð¼Ð°

```mermaid
erDiagram
    scout_analyses {
        uuid id PK
        varchar query
        varchar[] marketplaces
        decimal cogs
        decimal cogs_min
        decimal cogs_max
        varchar verdict
        varchar color
        decimal confidence
        jsonb metrics
        jsonb trend_result
        jsonb competitor_results
        jsonb unit_economics
        text summary
        jsonb detailed_analysis
        jsonb recommendations
        jsonb risks
        jsonb opportunities
        jsonb action_plan
        jsonb price_recommendations
        varchar[] data_sources
        int processing_time_ms
        int user_id
        timestamp analyzed_at
        timestamp created_at
    }

    scout_marketplace_rates {
        int id PK
        varchar marketplace
        varchar category
        decimal commission_pct
        decimal logistics_pct
        decimal return_logistics_pct
        decimal storage_pct
        decimal acquiring_pct
        int updated_by
        timestamp updated_at
        timestamp created_at
    }

    scout_trend_cache {
        int id PK
        varchar query_hash
        varchar query
        jsonb trend_data
        decimal trend_slope
        varchar trend_status
        int total_volume
        varchar[] sources_used
        timestamp expires_at
        timestamp created_at
    }

    scout_settings {
        int id PK
        varchar key
        jsonb value
        text description
        int updated_by
        timestamp updated_at
    }

    scout_export_jobs {
        uuid id PK
        uuid analysis_id FK
        varchar format
        varchar status
        varchar file_path
        varchar download_url
        int file_size_bytes
        int user_id
        timestamp expires_at
        timestamp created_at
        timestamp completed_at
    }

    users {
        int id PK
        varchar name
        varchar role
    }

    scout_analyses ||--o{ scout_export_jobs : "has exports"
    scout_analyses }o--|| users : "created by"
    scout_marketplace_rates }o--|| users : "updated by"
    scout_settings }o--|| users : "updated by"
```

### Ð¡Ð¿Ð¸ÑÐ¾Ðº Ñ‚Ð°Ð±Ð»Ð¸Ñ†

| Ð¢Ð°Ð±Ð»Ð¸Ñ†Ð° | ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ | ÐŸÑ€Ð¸Ð¼ÐµÑ€Ð½Ñ‹Ð¹ Ð¾Ð±ÑŠÑ‘Ð¼ |
|---------|------------|-----------------|
| `scout_analyses` | Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð² | ~1-2 KB/Ð·Ð°Ð¿Ð¸ÑÑŒ |
| `scout_marketplace_rates` | Ð¡Ñ‚Ð°Ð²ÐºÐ¸ Ñ€Ð°ÑÑ…Ð¾Ð´Ð¾Ð² ÐœÐŸ | ~10 Ð·Ð°Ð¿Ð¸ÑÐµÐ¹ |
| `scout_trend_cache` | ÐšÑÑˆ Ñ‚Ñ€ÐµÐ½Ð´Ð¾Ð² (Ð´Ð¾Ð»Ð³Ð¾ÑÑ€Ð¾Ñ‡Ð½Ñ‹Ð¹) | ~500 B/Ð·Ð°Ð¿Ð¸ÑÑŒ |
| `scout_settings` | ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ Ð¼Ð¾Ð´ÑƒÐ»Ñ | ~20 Ð·Ð°Ð¿Ð¸ÑÐµÐ¹ |
| `scout_export_jobs` | Ð—Ð°Ð´Ð°Ñ‡Ð¸ ÑÐºÑÐ¿Ð¾Ñ€Ñ‚Ð° | ~200 B/Ð·Ð°Ð¿Ð¸ÑÑŒ |

---

## 5.2 Ð¢Ð°Ð±Ð»Ð¸Ñ†Ð° scout_analyses

### 5.2.1 ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

Ð¥Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ð¿Ð¾Ð»Ð½Ð¾Ð¹ Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ð¸ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð² Ð½Ð¸Ñˆ Ñ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð°Ð¼Ð¸, Ð¼ÐµÑ‚Ñ€Ð¸ÐºÐ°Ð¼Ð¸ Ð¸ Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸ÑÐ¼Ð¸.

### 5.2.2 DDL

```sql
CREATE TABLE scout_analyses (
    -- Ð˜Ð´ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ñ
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Ð’Ñ…Ð¾Ð´Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ
    query VARCHAR(500) NOT NULL,
    marketplaces VARCHAR(50)[] NOT NULL DEFAULT ARRAY['wildberries', 'ozon', 'yandex_market'],
    cogs DECIMAL(12, 2) NOT NULL,
    cogs_min DECIMAL(12, 2),
    cogs_max DECIMAL(12, 2),
    
    -- Ð’ÐµÑ€Ð´Ð¸ÐºÑ‚
    verdict VARCHAR(20) NOT NULL CHECK (verdict IN ('GO', 'CONSIDER', 'RISKY')),
    color VARCHAR(10) NOT NULL CHECK (color IN ('green', 'yellow', 'red')),
    confidence DECIMAL(4, 3) NOT NULL DEFAULT 0.5 CHECK (confidence BETWEEN 0 AND 1),
    
    -- ÐœÐµÑ‚Ñ€Ð¸ÐºÐ¸ (Ð°Ð³Ñ€ÐµÐ³Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ðµ)
    metrics JSONB NOT NULL DEFAULT '{}',
    /*
    {
        "trend_slope": 0.08,
        "trend_status": "yellow",
        "monopoly_rate": 0.52,
        "monopoly_status": "yellow",
        "expected_margin": 18.5,
        "margin_status": "yellow"
    }
    */
    
    -- Ð”ÐµÑ‚Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ñ‹
    trend_result JSONB NOT NULL DEFAULT '{}',
    /*
    {
        "trend_slope": 0.08,
        "confidence": 0.85,
        "total_volume": 125000,
        "monthly_data": [...],
        "seasonality_detected": true,
        "related_queries": [...]
    }
    */
    
    competitor_results JSONB NOT NULL DEFAULT '{}',
    /*
    {
        "wildberries": {
            "monopoly_rate": 0.48,
            "top_sellers": [...],
            "price_analysis": {...},
            "entry_barrier_score": 0.45
        },
        "ozon": {...}
    }
    */
    
    unit_economics JSONB NOT NULL DEFAULT '{}',
    /*
    {
        "wildberries": {
            "selling_price": 2450,
            "cogs": 500,
            "net_profit": 362,
            "net_margin_pct": 14.8,
            ...
        },
        "ozon": {...}
    }
    */
    
    -- AI-Ð°Ð½Ð°Ð»Ð¸Ð·
    summary TEXT,
    detailed_analysis JSONB DEFAULT '{}',
    /*
    {
        "trend_assessment": "...",
        "competition_assessment": "...",
        "economics_assessment": "..."
    }
    */
    
    recommendations JSONB DEFAULT '[]',
    /* ["Ð ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ñ 1", "Ð ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ñ 2", ...] */
    
    risks JSONB DEFAULT '[]',
    /*
    [
        {
            "risk": "Ð’Ñ‹ÑÐ¾ÐºÐ°Ñ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ†Ð¸Ñ",
            "probability": "high",
            "mitigation": "..."
        }
    ]
    */
    
    opportunities JSONB DEFAULT '[]',
    /* ["Ð’Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚ÑŒ 1", "Ð’Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚ÑŒ 2", ...] */
    
    action_plan JSONB DEFAULT '{}',
    /*
    {
        "if_go": ["Ð¨Ð°Ð³ 1", "Ð¨Ð°Ð³ 2"],
        "if_not": ["ÐÐ»ÑŒÑ‚ÐµÑ€Ð½Ð°Ñ‚Ð¸Ð²Ð° 1"]
    }
    */
    
    price_recommendations JSONB DEFAULT '{}',
    /*
    {
        "optimal_price": 2800,
        "min_viable_price": 2200,
        "premium_price": 3500,
        "reasoning": "..."
    }
    */
    
    -- ÐœÐµÑ‚Ð°Ð´Ð°Ð½Ð½Ñ‹Ðµ
    data_sources VARCHAR(50)[] NOT NULL DEFAULT '{}',
    processing_time_ms INT NOT NULL DEFAULT 0,
    user_id INT NOT NULL REFERENCES users(id),
    analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ÐšÐ¾Ð¼Ð¼ÐµÐ½Ñ‚Ð°Ñ€Ð¸Ð¸
COMMENT ON TABLE scout_analyses IS 'Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð² Ñ‚Ð¾Ð²Ð°Ñ€Ð½Ñ‹Ñ… Ð½Ð¸Ñˆ';
COMMENT ON COLUMN scout_analyses.verdict IS 'Ð˜Ñ‚Ð¾Ð³Ð¾Ð²Ñ‹Ð¹ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚: GO, CONSIDER, RISKY';
COMMENT ON COLUMN scout_analyses.confidence IS 'Ð£Ð²ÐµÑ€ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð² Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚Ðµ Ð¾Ñ‚ 0 Ð´Ð¾ 1';
COMMENT ON COLUMN scout_analyses.metrics IS 'ÐÐ³Ñ€ÐµÐ³Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ðµ Ð¼ÐµÑ‚Ñ€Ð¸ÐºÐ¸ Ð´Ð»Ñ Ð±Ñ‹ÑÑ‚Ñ€Ð¾Ð³Ð¾ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð°';
COMMENT ON COLUMN scout_analyses.trend_result IS 'ÐŸÐ¾Ð»Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° Ñ‚Ñ€ÐµÐ½Ð´Ð¾Ð²';
COMMENT ON COLUMN scout_analyses.competitor_results IS 'Ð”Ð°Ð½Ð½Ñ‹Ðµ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð½Ð¾Ð³Ð¾ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° Ð¿Ð¾ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°Ð¼';
COMMENT ON COLUMN scout_analyses.unit_economics IS 'Ð Ð°ÑÑ‡Ñ‘Ñ‚Ñ‹ unit-ÑÐºÐ¾Ð½Ð¾Ð¼Ð¸ÐºÐ¸ Ð¿Ð¾ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°Ð¼';
```

### 5.2.3 Ð˜Ð½Ð´ÐµÐºÑÑ‹

```sql
-- ÐŸÐ¾Ð¸ÑÐº Ð¿Ð¾ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŽ Ð¸ Ð´Ð°Ñ‚Ðµ
CREATE INDEX idx_scout_analyses_user_date 
ON scout_analyses(user_id, analyzed_at DESC);

-- ÐŸÐ¾Ð¸ÑÐº Ð¿Ð¾ Ð·Ð°Ð¿Ñ€Ð¾ÑÑƒ (Ð¿Ð¾Ð»Ð½Ð¾Ñ‚ÐµÐºÑÑ‚Ð¾Ð²Ñ‹Ð¹)
CREATE INDEX idx_scout_analyses_query_gin 
ON scout_analyses USING GIN (to_tsvector('russian', query));

-- Ð¤Ð¸Ð»ÑŒÑ‚Ñ€ Ð¿Ð¾ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚Ñƒ
CREATE INDEX idx_scout_analyses_verdict 
ON scout_analyses(verdict);

-- ÐŸÐ¾Ð¸ÑÐº Ð¿Ð¾ Ð¼ÐµÑ‚Ñ€Ð¸ÐºÐ°Ð¼ (JSONB)
CREATE INDEX idx_scout_analyses_metrics_gin 
ON scout_analyses USING GIN (metrics jsonb_path_ops);

-- Ð¤Ð¸Ð»ÑŒÑ‚Ñ€ Ð¿Ð¾ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°Ð¼
CREATE INDEX idx_scout_analyses_marketplaces_gin 
ON scout_analyses USING GIN (marketplaces);

-- ÐŸÐ¾Ð¸ÑÐº Ð¿Ð¾ Ð´Ð°Ñ‚Ðµ Ð´Ð»Ñ Ð°Ñ€Ñ…Ð¸Ð²Ð°Ñ†Ð¸Ð¸
CREATE INDEX idx_scout_analyses_analyzed_at 
ON scout_analyses(analyzed_at);
```

### 5.2.4 ÐŸÑ€Ð¸Ð¼ÐµÑ€Ñ‹ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð²

```sql
-- ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ð¸ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ Ñ Ð¿Ð°Ð³Ð¸Ð½Ð°Ñ†Ð¸ÐµÐ¹
SELECT 
    id,
    query,
    marketplaces,
    verdict,
    metrics->>'expected_margin' as margin,
    analyzed_at
FROM scout_analyses
WHERE user_id = $1
ORDER BY analyzed_at DESC
LIMIT $2 OFFSET $3;

-- ÐŸÐ¾Ð¸ÑÐº Ð¿Ð¾ Ð·Ð°Ð¿Ñ€Ð¾ÑÑƒ
SELECT *
FROM scout_analyses
WHERE user_id = $1
  AND to_tsvector('russian', query) @@ plainto_tsquery('russian', $2)
ORDER BY analyzed_at DESC
LIMIT 20;

-- Ð¤Ð¸Ð»ÑŒÑ‚Ñ€ Ð¿Ð¾ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚Ñƒ Ð¸ Ð¼Ð°Ñ€Ð¶Ðµ
SELECT *
FROM scout_analyses
WHERE user_id = $1
  AND verdict = 'GO'
  AND (metrics->>'expected_margin')::decimal > 25
ORDER BY analyzed_at DESC;

-- Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ° Ð¿Ð¾ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚Ð°Ð¼
SELECT 
    verdict,
    COUNT(*) as count,
    AVG((metrics->>'expected_margin')::decimal) as avg_margin
FROM scout_analyses
WHERE user_id = $1
  AND analyzed_at > NOW() - INTERVAL '30 days'
GROUP BY verdict;

-- Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð² Ð¾Ð´Ð½Ð¾Ð¹ Ð½Ð¸ÑˆÐ¸ (Ð´Ð»Ñ Ð¾Ñ‚ÑÐ»ÐµÐ¶Ð¸Ð²Ð°Ð½Ð¸Ñ Ð´Ð¸Ð½Ð°Ð¼Ð¸ÐºÐ¸)
SELECT 
    id,
    analyzed_at,
    verdict,
    metrics->>'trend_slope' as trend,
    metrics->>'monopoly_rate' as monopoly,
    metrics->>'expected_margin' as margin
FROM scout_analyses
WHERE user_id = $1
  AND query ILIKE '%' || $2 || '%'
ORDER BY analyzed_at DESC
LIMIT 10;
```

---

## 5.3 Ð¢Ð°Ð±Ð»Ð¸Ñ†Ð° scout_marketplace_rates

### 5.3.1 ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

Ð¥Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ð½Ð°ÑÑ‚Ñ€Ð°Ð¸Ð²Ð°ÐµÐ¼Ñ‹Ñ… ÑÑ‚Ð°Ð²Ð¾Ðº Ñ€Ð°ÑÑ…Ð¾Ð´Ð¾Ð² Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ¾Ð² Ð´Ð»Ñ Ñ€Ð°ÑÑ‡Ñ‘Ñ‚Ð° unit-ÑÐºÐ¾Ð½Ð¾Ð¼Ð¸ÐºÐ¸.

### 5.3.2 DDL

```sql
CREATE TABLE scout_marketplace_rates (
    id SERIAL PRIMARY KEY,
    
    -- Ð˜Ð´ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ñ
    marketplace VARCHAR(50) NOT NULL CHECK (marketplace IN ('wildberries', 'ozon', 'yandex_market')),
    category VARCHAR(100) NOT NULL DEFAULT 'default',
    
    -- Ð¡Ñ‚Ð°Ð²ÐºÐ¸ (Ð² Ð¿Ñ€Ð¾Ñ†ÐµÐ½Ñ‚Ð°Ñ…)
    commission_pct DECIMAL(5, 2) NOT NULL DEFAULT 15.0 CHECK (commission_pct BETWEEN 0 AND 100),
    logistics_pct DECIMAL(5, 2) NOT NULL DEFAULT 5.0 CHECK (logistics_pct BETWEEN 0 AND 100),
    return_logistics_pct DECIMAL(5, 2) NOT NULL DEFAULT 3.0 CHECK (return_logistics_pct BETWEEN 0 AND 100),
    storage_pct DECIMAL(5, 2) NOT NULL DEFAULT 1.0 CHECK (storage_pct BETWEEN 0 AND 100),
    acquiring_pct DECIMAL(5, 2) NOT NULL DEFAULT 0.0 CHECK (acquiring_pct BETWEEN 0 AND 100),
    
    -- ÐœÐµÑ‚Ð°Ð´Ð°Ð½Ð½Ñ‹Ðµ
    updated_by INT REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Ð£Ð½Ð¸ÐºÐ°Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ
    CONSTRAINT uq_scout_rates_mp_category UNIQUE (marketplace, category)
);

-- ÐšÐ¾Ð¼Ð¼ÐµÐ½Ñ‚Ð°Ñ€Ð¸Ð¸
COMMENT ON TABLE scout_marketplace_rates IS 'Ð¡Ñ‚Ð°Ð²ÐºÐ¸ Ñ€Ð°ÑÑ…Ð¾Ð´Ð¾Ð² Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ¾Ð² Ð´Ð»Ñ unit-ÑÐºÐ¾Ð½Ð¾Ð¼Ð¸ÐºÐ¸';
COMMENT ON COLUMN scout_marketplace_rates.category IS 'ÐšÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ñ Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð² (default Ð´Ð»Ñ Ð¾Ð±Ñ‰Ð¸Ñ… ÑÑ‚Ð°Ð²Ð¾Ðº)';
COMMENT ON COLUMN scout_marketplace_rates.commission_pct IS 'ÐšÐ¾Ð¼Ð¸ÑÑÐ¸Ñ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ° (%)';
COMMENT ON COLUMN scout_marketplace_rates.logistics_pct IS 'Ð›Ð¾Ð³Ð¸ÑÑ‚Ð¸ÐºÐ° Ð´Ð¾ Ð¿Ð¾ÐºÑƒÐ¿Ð°Ñ‚ÐµÐ»Ñ (%)';
COMMENT ON COLUMN scout_marketplace_rates.return_logistics_pct IS 'ÐžÐ±Ñ€Ð°Ñ‚Ð½Ð°Ñ Ð»Ð¾Ð³Ð¸ÑÑ‚Ð¸ÐºÐ° (%)';
COMMENT ON COLUMN scout_marketplace_rates.storage_pct IS 'Ð¥Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ð½Ð° ÑÐºÐ»Ð°Ð´Ðµ (%)';
COMMENT ON COLUMN scout_marketplace_rates.acquiring_pct IS 'Ð­ÐºÐ²Ð°Ð¹Ñ€Ð¸Ð½Ð³ (%)';

-- Ð¢Ñ€Ð¸Ð³Ð³ÐµÑ€ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ updated_at
CREATE OR REPLACE FUNCTION update_scout_rates_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_scout_rates_updated
    BEFORE UPDATE ON scout_marketplace_rates
    FOR EACH ROW
    EXECUTE FUNCTION update_scout_rates_timestamp();
```

### 5.3.3 ÐÐ°Ñ‡Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ

```sql
-- Ð¡Ñ‚Ð°Ð²ÐºÐ¸ Ð¿Ð¾ ÑƒÐ¼Ð¾Ð»Ñ‡Ð°Ð½Ð¸ÑŽ Ð´Ð»Ñ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸ "ÐžÐ´ÐµÐ¶Ð´Ð°"
INSERT INTO scout_marketplace_rates 
    (marketplace, category, commission_pct, logistics_pct, return_logistics_pct, storage_pct, acquiring_pct)
VALUES
    ('wildberries', 'default', 15.0, 5.0, 3.0, 1.0, 0.0),
    ('ozon', 'default', 18.0, 6.0, 4.0, 1.5, 0.0),
    ('yandex_market', 'default', 15.0, 7.0, 4.0, 1.0, 1.5);
```

### 5.3.4 ÐŸÑ€Ð¸Ð¼ÐµÑ€Ñ‹ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð²

```sql
-- ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²Ð¾Ðº Ð´Ð»Ñ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°
SELECT 
    marketplace,
    category,
    commission_pct,
    logistics_pct,
    return_logistics_pct,
    storage_pct,
    acquiring_pct,
    (commission_pct + logistics_pct + return_logistics_pct + storage_pct + acquiring_pct) as total_overhead_pct
FROM scout_marketplace_rates
WHERE marketplace = $1
  AND (category = $2 OR category = 'default')
ORDER BY CASE WHEN category = $2 THEN 0 ELSE 1 END
LIMIT 1;

-- ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð²ÑÐµÑ… ÑÑ‚Ð°Ð²Ð¾Ðº
SELECT 
    marketplace,
    category,
    commission_pct,
    logistics_pct,
    return_logistics_pct,
    storage_pct,
    acquiring_pct,
    (commission_pct + logistics_pct + return_logistics_pct + storage_pct + acquiring_pct) as total_overhead_pct,
    updated_at,
    updated_by
FROM scout_marketplace_rates
WHERE category = 'default'
ORDER BY marketplace;

-- ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²Ð¾Ðº
UPDATE scout_marketplace_rates
SET 
    commission_pct = COALESCE($3, commission_pct),
    logistics_pct = COALESCE($4, logistics_pct),
    return_logistics_pct = COALESCE($5, return_logistics_pct),
    storage_pct = COALESCE($6, storage_pct),
    acquiring_pct = COALESCE($7, acquiring_pct),
    updated_by = $8
WHERE marketplace = $1 AND category = $2;
```

---

## 5.4 Ð¢Ð°Ð±Ð»Ð¸Ñ†Ð° scout_trend_cache

### 5.4.1 ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

Ð”Ð¾Ð»Ð³Ð¾ÑÑ€Ð¾Ñ‡Ð½Ð¾Ðµ ÐºÑÑˆÐ¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¾ Ñ‚Ñ€ÐµÐ½Ð´Ð°Ñ… Ð´Ð»Ñ ÑƒÑÐºÐ¾Ñ€ÐµÐ½Ð¸Ñ Ð¿Ð¾Ð²Ñ‚Ð¾Ñ€Ð½Ñ‹Ñ… Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð² Ð¸ Ð¿ÐµÑ€Ð¸Ð¾Ð´Ð¸Ñ‡ÐµÑÐºÐ¾Ð³Ð¾ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ.

### 5.4.2 DDL

```sql
CREATE TABLE scout_trend_cache (
    id SERIAL PRIMARY KEY,
    
    -- Ð˜Ð´ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ñ
    query_hash VARCHAR(32) NOT NULL UNIQUE,
    query VARCHAR(500) NOT NULL,
    
    -- Ð”Ð°Ð½Ð½Ñ‹Ðµ Ñ‚Ñ€ÐµÐ½Ð´Ð¾Ð²
    trend_data JSONB NOT NULL DEFAULT '{}',
    /*
    {
        "wordstat": {...},
        "ozon_analytics": {...},
        "wb_analytics": {...},
        "external": {...}
    }
    */
    
    -- ÐÐ³Ñ€ÐµÐ³Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ðµ Ð¼ÐµÑ‚Ñ€Ð¸ÐºÐ¸ (Ð´Ð»Ñ Ð±Ñ‹ÑÑ‚Ñ€Ð¾Ð³Ð¾ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð°)
    trend_slope DECIMAL(6, 4),
    trend_status VARCHAR(10) CHECK (trend_status IN ('green', 'yellow', 'red')),
    total_volume INT,
    confidence DECIMAL(4, 3),
    
    -- Ð˜ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¸
    sources_used VARCHAR(50)[] NOT NULL DEFAULT '{}',
    sources_failed VARCHAR(50)[] DEFAULT '{}',
    
    -- ÐœÐµÑ‚Ð°Ð´Ð°Ð½Ð½Ñ‹Ðµ
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ÐšÐ¾Ð¼Ð¼ÐµÐ½Ñ‚Ð°Ñ€Ð¸Ð¸
COMMENT ON TABLE scout_trend_cache IS 'ÐšÑÑˆ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¾ Ñ‚Ñ€ÐµÐ½Ð´Ð°Ñ… ÑÐ¿Ñ€Ð¾ÑÐ°';
COMMENT ON COLUMN scout_trend_cache.query_hash IS 'MD5-Ñ…ÑÑˆ Ð½Ð¾Ñ€Ð¼Ð°Ð»Ð¸Ð·Ð¾Ð²Ð°Ð½Ð½Ð¾Ð³Ð¾ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ°';
COMMENT ON COLUMN scout_trend_cache.trend_data IS 'Ð¡Ñ‹Ñ€Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð¸Ð· Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¾Ð²';
COMMENT ON COLUMN scout_trend_cache.expires_at IS 'Ð’Ñ€ÐµÐ¼Ñ Ð¸ÑÑ‚ÐµÑ‡ÐµÐ½Ð¸Ñ ÐºÑÑˆÐ°';

-- Ð¢Ñ€Ð¸Ð³Ð³ÐµÑ€ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ updated_at
CREATE TRIGGER trg_scout_trend_cache_updated
    BEFORE UPDATE ON scout_trend_cache
    FOR EACH ROW
    EXECUTE FUNCTION update_scout_rates_timestamp();
```

### 5.4.3 Ð˜Ð½Ð´ÐµÐºÑÑ‹

```sql
-- ÐŸÐ¾Ð¸ÑÐº Ð¿Ð¾ Ñ…ÑÑˆÑƒ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ°
CREATE INDEX idx_scout_trend_cache_hash 
ON scout_trend_cache(query_hash);

-- ÐŸÐ¾Ð¸ÑÐº Ð½ÐµÐ²Ð°Ð»Ð¸Ð´Ð½Ð¾Ð³Ð¾ ÐºÑÑˆÐ° Ð´Ð»Ñ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ
CREATE INDEX idx_scout_trend_cache_expires 
ON scout_trend_cache(expires_at)
WHERE expires_at < NOW();

-- ÐŸÐ¾Ð»Ð½Ð¾Ñ‚ÐµÐºÑÑ‚Ð¾Ð²Ñ‹Ð¹ Ð¿Ð¾Ð¸ÑÐº Ð¿Ð¾ Ð·Ð°Ð¿Ñ€Ð¾ÑÑƒ
CREATE INDEX idx_scout_trend_cache_query_gin 
ON scout_trend_cache USING GIN (to_tsvector('russian', query));
```

### 5.4.4 ÐŸÑ€Ð¸Ð¼ÐµÑ€Ñ‹ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð²

```sql
-- ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¸Ð· ÐºÑÑˆÐ°
SELECT 
    trend_data,
    trend_slope,
    trend_status,
    total_volume,
    confidence,
    sources_used
FROM scout_trend_cache
WHERE query_hash = $1
  AND expires_at > NOW();

-- Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ/Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÐºÑÑˆÐ°
INSERT INTO scout_trend_cache 
    (query_hash, query, trend_data, trend_slope, trend_status, total_volume, confidence, sources_used, expires_at)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() + INTERVAL '24 hours')
ON CONFLICT (query_hash)
DO UPDATE SET
    trend_data = EXCLUDED.trend_data,
    trend_slope = EXCLUDED.trend_slope,
    trend_status = EXCLUDED.trend_status,
    total_volume = EXCLUDED.total_volume,
    confidence = EXCLUDED.confidence,
    sources_used = EXCLUDED.sources_used,
    expires_at = EXCLUDED.expires_at,
    updated_at = NOW();

-- ÐžÑ‡Ð¸ÑÑ‚ÐºÐ° ÑƒÑÑ‚Ð°Ñ€ÐµÐ²ÑˆÐµÐ³Ð¾ ÐºÑÑˆÐ°
DELETE FROM scout_trend_cache
WHERE expires_at < NOW() - INTERVAL '7 days';

-- ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÐºÑÑˆÐ° Ð´Ð»Ñ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ (Celery task)
SELECT query_hash, query
FROM scout_trend_cache
WHERE expires_at < NOW()
ORDER BY expires_at
LIMIT 100;
```

---

## 5.5 Ð¢Ð°Ð±Ð»Ð¸Ñ†Ð° scout_settings

### 5.5.1 ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

Ð¥Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ð½Ð°ÑÑ‚Ñ€Ð¾ÐµÐº Ð¼Ð¾Ð´ÑƒÐ»Ñ: Ð¿Ð¾Ñ€Ð¾Ð³Ð¸ ÑÐ²ÐµÑ‚Ð¾Ñ„Ð¾Ñ€Ð°, API-ÐºÐ»ÑŽÑ‡Ð¸ Ð²Ð½ÐµÑˆÐ½Ð¸Ñ… ÑÐµÑ€Ð²Ð¸ÑÐ¾Ð², Ð¿Ð°Ñ€Ð°Ð¼ÐµÑ‚Ñ€Ñ‹ ÐºÑÑˆÐ¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ.

### 5.5.2 DDL

```sql
CREATE TABLE scout_settings (
    id SERIAL PRIMARY KEY,
    
    -- Ð˜Ð´ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ñ
    key VARCHAR(100) NOT NULL UNIQUE,
    
    -- Ð—Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ
    value JSONB NOT NULL,
    
    -- ÐœÐµÑ‚Ð°Ð´Ð°Ð½Ð½Ñ‹Ðµ
    description TEXT,
    is_secret BOOLEAN NOT NULL DEFAULT FALSE,
    updated_by INT REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ÐšÐ¾Ð¼Ð¼ÐµÐ½Ñ‚Ð°Ñ€Ð¸Ð¸
COMMENT ON TABLE scout_settings IS 'ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ Ð¼Ð¾Ð´ÑƒÐ»Ñ Scout';
COMMENT ON COLUMN scout_settings.key IS 'ÐšÐ»ÑŽÑ‡ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ (ÑƒÐ½Ð¸ÐºÐ°Ð»ÑŒÐ½Ñ‹Ð¹)';
COMMENT ON COLUMN scout_settings.value IS 'Ð—Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ Ð² Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚Ðµ JSON';
COMMENT ON COLUMN scout_settings.is_secret IS 'Ð¤Ð»Ð°Ð³ ÑÐµÐºÑ€ÐµÑ‚Ð½Ð¾Ð³Ð¾ Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ñ (Ð½Ðµ Ð¿Ð¾ÐºÐ°Ð·Ñ‹Ð²Ð°Ñ‚ÑŒ Ð² UI)';

-- Ð¢Ñ€Ð¸Ð³Ð³ÐµÑ€ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ
CREATE TRIGGER trg_scout_settings_updated
    BEFORE UPDATE ON scout_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_scout_rates_timestamp();
```

### 5.5.3 ÐÐ°Ñ‡Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ

```sql
-- ÐŸÐ¾Ñ€Ð¾Ð³Ð¸ ÑÐ²ÐµÑ‚Ð¾Ñ„Ð¾Ñ€Ð°
INSERT INTO scout_settings (key, value, description) VALUES
('thresholds.trend_slope', 
 '{"green": 0.15, "yellow": 0, "red": -999}',
 'ÐŸÐ¾Ñ€Ð¾Ð³Ð¸ Trend Slope: green > 0.15, yellow > 0, red < 0'),

('thresholds.monopoly_rate',
 '{"green": 0.5, "yellow": 0.7, "red": 1.0}',
 'ÐŸÐ¾Ñ€Ð¾Ð³Ð¸ Monopoly Rate: green < 50%, yellow < 70%, red >= 70%'),

('thresholds.expected_margin',
 '{"green": 25, "yellow": 15, "red": 0}',
 'ÐŸÐ¾Ñ€Ð¾Ð³Ð¸ Expected Margin: green > 25%, yellow > 15%, red <= 15%');

-- ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ ÐºÑÑˆÐ¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ
INSERT INTO scout_settings (key, value, description) VALUES
('cache.trend_ttl_hours', '24', 'TTL ÐºÑÑˆÐ° Ñ‚Ñ€ÐµÐ½Ð´Ð¾Ð² Ð² Ñ‡Ð°ÑÐ°Ñ…'),
('cache.category_ttl_hours', '12', 'TTL ÐºÑÑˆÐ° ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹ Ð² Ñ‡Ð°ÑÐ°Ñ…'),
('cache.rates_ttl_minutes', '60', 'TTL ÐºÑÑˆÐ° ÑÑ‚Ð°Ð²Ð¾Ðº Ð² Ð¼Ð¸Ð½ÑƒÑ‚Ð°Ñ…');

-- API-ÐºÐ»ÑŽÑ‡Ð¸ (ÑÐµÐºÑ€ÐµÑ‚Ð½Ñ‹Ðµ)
INSERT INTO scout_settings (key, value, description, is_secret) VALUES
('api.wordstat_token', '"__ENCRYPTED__"', 'OAuth-Ñ‚Ð¾ÐºÐµÐ½ Ð¯Ð½Ð´ÐµÐºÑ.Ð”Ð¸Ñ€ÐµÐºÑ‚', TRUE),
('api.ozon_client_id', '"__ENCRYPTED__"', 'Client ID Ozon Seller API', TRUE),
('api.ozon_api_key', '"__ENCRYPTED__"', 'API Key Ozon Seller API', TRUE),
('api.similarweb_key', '"__ENCRYPTED__"', 'API Key SimilarWeb', TRUE),
('api.serpstat_key', '"__ENCRYPTED__"', 'API Key Serpstat', TRUE);

-- ÐŸÐ°Ñ€Ð°Ð¼ÐµÑ‚Ñ€Ñ‹ Ð°Ð½Ð°Ð»Ð¸Ð·Ð°
INSERT INTO scout_settings (key, value, description) VALUES
('analysis.default_period_months', '3', 'ÐŸÐµÑ€Ð¸Ð¾Ð´ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° Ñ‚Ñ€ÐµÐ½Ð´Ð¾Ð² Ð¿Ð¾ ÑƒÐ¼Ð¾Ð»Ñ‡Ð°Ð½Ð¸ÑŽ'),
('analysis.top_products_limit', '50', 'ÐšÐ¾Ð»Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾ Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð² Ð´Ð»Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð¾Ð²'),
('analysis.max_processing_time_sec', '120', 'ÐœÐ°ÐºÑÐ¸Ð¼Ð°Ð»ÑŒÐ½Ð¾Ðµ Ð²Ñ€ÐµÐ¼Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð°');

-- ÐŸÐ°Ñ€Ð°Ð¼ÐµÑ‚Ñ€Ñ‹ ÑÐºÑÐ¿Ð¾Ñ€Ñ‚Ð°
INSERT INTO scout_settings (key, value, description) VALUES
('export.url_expiry_hours', '24', 'Ð’Ñ€ÐµÐ¼Ñ Ð¶Ð¸Ð·Ð½Ð¸ ÑÑÑ‹Ð»ÐºÐ¸ Ð½Ð° ÑÐºÐ°Ñ‡Ð¸Ð²Ð°Ð½Ð¸Ðµ'),
('export.max_file_size_mb', '10', 'ÐœÐ°ÐºÑÐ¸Ð¼Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ñ€Ð°Ð·Ð¼ÐµÑ€ Ñ„Ð°Ð¹Ð»Ð° ÑÐºÑÐ¿Ð¾Ñ€Ñ‚Ð°');
```

### 5.5.4 ÐŸÑ€Ð¸Ð¼ÐµÑ€Ñ‹ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð²

```sql
-- ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸
SELECT value
FROM scout_settings
WHERE key = $1;

-- ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð²ÑÐµÑ… Ð¿Ð¾Ñ€Ð¾Ð³Ð¾Ð²
SELECT key, value
FROM scout_settings
WHERE key LIKE 'thresholds.%';

-- ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ (Admin)
UPDATE scout_settings
SET value = $2, updated_by = $3
WHERE key = $1;

-- ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð½ÐµÑÐµÐºÑ€ÐµÑ‚Ð½Ñ‹Ñ… Ð½Ð°ÑÑ‚Ñ€Ð¾ÐµÐº Ð´Ð»Ñ UI
SELECT key, value, description
FROM scout_settings
WHERE is_secret = FALSE
ORDER BY key;
```

---

## 5.6 Ð¢Ð°Ð±Ð»Ð¸Ñ†Ð° scout_export_jobs

### 5.6.1 ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

ÐžÑ‚ÑÐ»ÐµÐ¶Ð¸Ð²Ð°Ð½Ð¸Ðµ Ð·Ð°Ð´Ð°Ñ‡ ÑÐºÑÐ¿Ð¾Ñ€Ñ‚Ð° Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð¾Ð² Ð¸ Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ ÑÑÑ‹Ð»Ð¾Ðº Ð´Ð»Ñ ÑÐºÐ°Ñ‡Ð¸Ð²Ð°Ð½Ð¸Ñ.

### 5.6.2 DDL

```sql
CREATE TABLE scout_export_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Ð¡Ð²ÑÐ·ÑŒ Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð¼
    analysis_id UUID NOT NULL REFERENCES scout_analyses(id) ON DELETE CASCADE,
    
    -- ÐŸÐ°Ñ€Ð°Ð¼ÐµÑ‚Ñ€Ñ‹ ÑÐºÑÐ¿Ð¾Ñ€Ñ‚Ð°
    format VARCHAR(10) NOT NULL CHECK (format IN ('pdf', 'xlsx', 'json')),
    
    -- Ð¡Ñ‚Ð°Ñ‚ÑƒÑ
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    
    -- Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚
    file_path VARCHAR(500),
    download_url VARCHAR(500),
    file_size_bytes INT,
    
    -- ÐœÐµÑ‚Ð°Ð´Ð°Ð½Ð½Ñ‹Ðµ
    user_id INT NOT NULL REFERENCES users(id),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ÐšÐ¾Ð¼Ð¼ÐµÐ½Ñ‚Ð°Ñ€Ð¸Ð¸
COMMENT ON TABLE scout_export_jobs IS 'Ð—Ð°Ð´Ð°Ñ‡Ð¸ ÑÐºÑÐ¿Ð¾Ñ€Ñ‚Ð° Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð¾Ð²';
COMMENT ON COLUMN scout_export_jobs.status IS 'Ð¡Ñ‚Ð°Ñ‚ÑƒÑ: pending, processing, completed, failed';
COMMENT ON COLUMN scout_export_jobs.expires_at IS 'Ð’Ñ€ÐµÐ¼Ñ Ð¸ÑÑ‚ÐµÑ‡ÐµÐ½Ð¸Ñ ÑÑÑ‹Ð»ÐºÐ¸ Ð½Ð° ÑÐºÐ°Ñ‡Ð¸Ð²Ð°Ð½Ð¸Ðµ';
```

### 5.6.3 Ð˜Ð½Ð´ÐµÐºÑÑ‹

```sql
-- ÐŸÐ¾Ð¸ÑÐº Ð¿Ð¾ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŽ
CREATE INDEX idx_scout_export_jobs_user 
ON scout_export_jobs(user_id, created_at DESC);

-- ÐŸÐ¾Ð¸ÑÐº Ð¿Ð¾ Ð°Ð½Ð°Ð»Ð¸Ð·Ñƒ
CREATE INDEX idx_scout_export_jobs_analysis 
ON scout_export_jobs(analysis_id);

-- ÐŸÐ¾Ð¸ÑÐº pending Ð·Ð°Ð´Ð°Ñ‡ Ð´Ð»Ñ Celery
CREATE INDEX idx_scout_export_jobs_pending 
ON scout_export_jobs(status, created_at)
WHERE status = 'pending';

-- ÐžÑ‡Ð¸ÑÑ‚ÐºÐ° Ð¸ÑÑ‚Ñ‘ÐºÑˆÐ¸Ñ… Ñ„Ð°Ð¹Ð»Ð¾Ð²
CREATE INDEX idx_scout_export_jobs_expired 
ON scout_export_jobs(expires_at)
WHERE expires_at IS NOT NULL AND status = 'completed';
```

### 5.6.4 ÐŸÑ€Ð¸Ð¼ÐµÑ€Ñ‹ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð²

```sql
-- Ð¡Ð¾Ð·Ð´Ð°Ð½Ð¸Ðµ Ð·Ð°Ð´Ð°Ñ‡Ð¸ ÑÐºÑÐ¿Ð¾Ñ€Ñ‚Ð°
INSERT INTO scout_export_jobs (analysis_id, format, user_id)
VALUES ($1, $2, $3)
RETURNING id;

-- ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ñ‚ÑƒÑÐ° (Celery worker)
UPDATE scout_export_jobs
SET 
    status = 'completed',
    file_path = $2,
    download_url = $3,
    file_size_bytes = $4,
    expires_at = NOW() + INTERVAL '24 hours',
    completed_at = NOW()
WHERE id = $1;

-- ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ñ‚ÑƒÑÐ° ÑÐºÑÐ¿Ð¾Ñ€Ñ‚Ð°
SELECT status, download_url, file_size_bytes, expires_at, error_message
FROM scout_export_jobs
WHERE id = $1 AND user_id = $2;

-- ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¿Ð¾ÑÐ»ÐµÐ´Ð½ÐµÐ³Ð¾ ÑÐºÑÐ¿Ð¾Ñ€Ñ‚Ð° Ð°Ð½Ð°Ð»Ð¸Ð·Ð°
SELECT id, format, status, download_url, expires_at
FROM scout_export_jobs
WHERE analysis_id = $1 AND status = 'completed'
ORDER BY created_at DESC
LIMIT 1;

-- ÐžÑ‡Ð¸ÑÑ‚ÐºÐ° Ð¸ÑÑ‚Ñ‘ÐºÑˆÐ¸Ñ… ÑÐºÑÐ¿Ð¾Ñ€Ñ‚Ð¾Ð²
DELETE FROM scout_export_jobs
WHERE expires_at < NOW() - INTERVAL '1 day';
```

---

## 5.7 Ð’ÑÐ¿Ð¾Ð¼Ð¾Ð³Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¸

### 5.7.1 Ð¤ÑƒÐ½ÐºÑ†Ð¸Ñ Ñ€Ð°ÑÑ‡Ñ‘Ñ‚Ð° Ñ…ÑÑˆÐ° Ð·Ð°Ð¿Ñ€Ð¾ÑÐ°

```sql
CREATE OR REPLACE FUNCTION scout_query_hash(query TEXT)
RETURNS VARCHAR(32)
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    -- ÐÐ¾Ñ€Ð¼Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ: lowercase, trim, remove extra spaces
    RETURN MD5(LOWER(TRIM(REGEXP_REPLACE(query, '\s+', ' ', 'g'))));
END;
$$;

COMMENT ON FUNCTION scout_query_hash IS 'Ð’Ñ‹Ñ‡Ð¸ÑÐ»ÐµÐ½Ð¸Ðµ MD5-Ñ…ÑÑˆÐ° Ð½Ð¾Ñ€Ð¼Ð°Ð»Ð¸Ð·Ð¾Ð²Ð°Ð½Ð½Ð¾Ð³Ð¾ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ°';
```

### 5.7.2 Ð¤ÑƒÐ½ÐºÑ†Ð¸Ñ Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ñ ÑÑ‚Ð°Ð²Ð¾Ðº Ñ fallback

```sql
CREATE OR REPLACE FUNCTION scout_get_rates(
    p_marketplace VARCHAR(50),
    p_category VARCHAR(100) DEFAULT 'default'
)
RETURNS TABLE (
    commission_pct DECIMAL(5,2),
    logistics_pct DECIMAL(5,2),
    return_logistics_pct DECIMAL(5,2),
    storage_pct DECIMAL(5,2),
    acquiring_pct DECIMAL(5,2),
    total_overhead_pct DECIMAL(5,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.commission_pct,
        r.logistics_pct,
        r.return_logistics_pct,
        r.storage_pct,
        r.acquiring_pct,
        (r.commission_pct + r.logistics_pct + r.return_logistics_pct + 
         r.storage_pct + r.acquiring_pct) as total_overhead_pct
    FROM scout_marketplace_rates r
    WHERE r.marketplace = p_marketplace
      AND (r.category = p_category OR r.category = 'default')
    ORDER BY CASE WHEN r.category = p_category THEN 0 ELSE 1 END
    LIMIT 1;
END;
$$;

COMMENT ON FUNCTION scout_get_rates IS 'ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²Ð¾Ðº ÐœÐŸ Ñ fallback Ð½Ð° default';
```

### 5.7.3 Ð¤ÑƒÐ½ÐºÑ†Ð¸Ñ Ð¾Ð¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ñ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚Ð°

```sql
CREATE OR REPLACE FUNCTION scout_determine_verdict(
    p_trend_status VARCHAR(10),
    p_monopoly_status VARCHAR(10),
    p_margin_status VARCHAR(10)
)
RETURNS TABLE (
    verdict VARCHAR(20),
    color VARCHAR(10)
)
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    v_green_count INT := 0;
    v_yellow_count INT := 0;
    v_red_count INT := 0;
BEGIN
    -- ÐŸÐ¾Ð´ÑÑ‡Ñ‘Ñ‚ ÑÑ‚Ð°Ñ‚ÑƒÑÐ¾Ð²
    IF p_trend_status = 'green' THEN v_green_count := v_green_count + 1;
    ELSIF p_trend_status = 'yellow' THEN v_yellow_count := v_yellow_count + 1;
    ELSE v_red_count := v_red_count + 1;
    END IF;
    
    IF p_monopoly_status = 'green' THEN v_green_count := v_green_count + 1;
    ELSIF p_monopoly_status = 'yellow' THEN v_yellow_count := v_yellow_count + 1;
    ELSE v_red_count := v_red_count + 1;
    END IF;
    
    IF p_margin_status = 'green' THEN v_green_count := v_green_count + 1;
    ELSIF p_margin_status = 'yellow' THEN v_yellow_count := v_yellow_count + 1;
    ELSE v_red_count := v_red_count + 1;
    END IF;
    
    -- ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚Ð°
    IF v_red_count > 0 OR v_yellow_count = 3 THEN
        verdict := 'RISKY';
        color := 'red';
    ELSIF v_green_count = 3 OR (v_green_count = 2 AND v_yellow_count = 1) THEN
        verdict := 'GO';
        color := 'green';
    ELSE
        verdict := 'CONSIDER';
        color := 'yellow';
    END IF;
    
    RETURN NEXT;
END;
$$;

COMMENT ON FUNCTION scout_determine_verdict IS 'ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚Ð° Ð½Ð° Ð¾ÑÐ½Ð¾Ð²Ðµ ÑÑ‚Ð°Ñ‚ÑƒÑÐ¾Ð² Ð¼ÐµÑ‚Ñ€Ð¸Ðº';
```

### 5.7.4 Ð¤ÑƒÐ½ÐºÑ†Ð¸Ñ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ¸ Ð¿Ð¾ Ð°Ð½Ð°Ð»Ð¸Ð·Ð°Ð¼

```sql
CREATE OR REPLACE FUNCTION scout_user_stats(
    p_user_id INT,
    p_days INT DEFAULT 30
)
RETURNS TABLE (
    total_analyses INT,
    go_count INT,
    consider_count INT,
    risky_count INT,
    avg_margin DECIMAL(5,2),
    avg_processing_time_ms INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INT as total_analyses,
        COUNT(*) FILTER (WHERE verdict = 'GO')::INT as go_count,
        COUNT(*) FILTER (WHERE verdict = 'CONSIDER')::INT as consider_count,
        COUNT(*) FILTER (WHERE verdict = 'RISKY')::INT as risky_count,
        AVG((metrics->>'expected_margin')::DECIMAL)::DECIMAL(5,2) as avg_margin,
        AVG(processing_time_ms)::INT as avg_processing_time_ms
    FROM scout_analyses
    WHERE user_id = p_user_id
      AND analyzed_at > NOW() - (p_days || ' days')::INTERVAL;
END;
$$;

COMMENT ON FUNCTION scout_user_stats IS 'Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ° Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð² Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ Ð·Ð° Ð¿ÐµÑ€Ð¸Ð¾Ð´';
```

---

## 5.8 ÐœÐ¸Ð³Ñ€Ð°Ñ†Ð¸Ð¸

### 5.8.1 ÐœÐ¸Ð³Ñ€Ð°Ñ†Ð¸Ñ ÑÐ¾Ð·Ð´Ð°Ð½Ð¸Ñ ÑÑ…ÐµÐ¼Ñ‹

```sql
-- migrations/001_create_scout_tables.sql

BEGIN;

-- ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° ÑÑƒÑ‰ÐµÑÑ‚Ð²Ð¾Ð²Ð°Ð½Ð¸Ñ Ñ‚Ð°Ð±Ð»Ð¸Ñ†
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'scout_analyses') THEN
        RAISE EXCEPTION 'Scout tables already exist';
    END IF;
END $$;

-- Ð¡Ð¾Ð·Ð´Ð°Ð½Ð¸Ðµ Ñ‚Ð°Ð±Ð»Ð¸Ñ† (DDL Ð¸Ð· Ñ€Ð°Ð·Ð´ÐµÐ»Ð¾Ð² Ð²Ñ‹ÑˆÐµ)
-- scout_analyses
-- scout_marketplace_rates
-- scout_trend_cache
-- scout_settings
-- scout_export_jobs

-- Ð¡Ð¾Ð·Ð´Ð°Ð½Ð¸Ðµ Ð¸Ð½Ð´ÐµÐºÑÐ¾Ð²

-- Ð¡Ð¾Ð·Ð´Ð°Ð½Ð¸Ðµ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¹

-- ÐÐ°Ñ‡Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ
INSERT INTO scout_marketplace_rates ...
INSERT INTO scout_settings ...

-- Ð’ÐµÑ€ÑÐ¸Ñ Ð¼Ð¸Ð³Ñ€Ð°Ñ†Ð¸Ð¸
INSERT INTO schema_migrations (version, description, applied_at)
VALUES ('001', 'Create Scout module tables', NOW());

COMMIT;
```

### 5.8.2 Rollback Ð¼Ð¸Ð³Ñ€Ð°Ñ†Ð¸Ñ

```sql
-- migrations/001_create_scout_tables_rollback.sql

BEGIN;

DROP TABLE IF EXISTS scout_export_jobs CASCADE;
DROP TABLE IF EXISTS scout_settings CASCADE;
DROP TABLE IF EXISTS scout_trend_cache CASCADE;
DROP TABLE IF EXISTS scout_marketplace_rates CASCADE;
DROP TABLE IF EXISTS scout_analyses CASCADE;

DROP FUNCTION IF EXISTS scout_query_hash CASCADE;
DROP FUNCTION IF EXISTS scout_get_rates CASCADE;
DROP FUNCTION IF EXISTS scout_determine_verdict CASCADE;
DROP FUNCTION IF EXISTS scout_user_stats CASCADE;

DELETE FROM schema_migrations WHERE version = '001';

COMMIT;
```

---

## 5.9 ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ¸ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð°

### 5.9.1 Row Level Security

```sql
-- Ð’ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ RLS
ALTER TABLE scout_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE scout_export_jobs ENABLE ROW LEVEL SECURITY;

-- ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ°: Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒ Ð²Ð¸Ð´Ð¸Ñ‚ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ ÑÐ²Ð¾Ð¸ Ð°Ð½Ð°Ð»Ð¸Ð·Ñ‹
CREATE POLICY scout_analyses_user_policy ON scout_analyses
    FOR ALL
    TO authenticated
    USING (user_id = current_user_id());

-- ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ°: Admin Ð²Ð¸Ð´Ð¸Ñ‚ Ð²ÑÐµ
CREATE POLICY scout_analyses_admin_policy ON scout_analyses
    FOR ALL
    TO admin
    USING (TRUE);

-- ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð´Ð»Ñ ÑÐºÑÐ¿Ð¾Ñ€Ñ‚Ð¾Ð²
CREATE POLICY scout_export_jobs_user_policy ON scout_export_jobs
    FOR ALL
    TO authenticated
    USING (user_id = current_user_id());
```

### 5.9.2 Ð“Ñ€Ð°Ð½Ñ‚Ñ‹

```sql
-- Ð Ð¾Ð»ÑŒ scout_reader (Ð´Ð»Ñ API)
CREATE ROLE scout_reader;
GRANT SELECT ON scout_analyses TO scout_reader;
GRANT SELECT ON scout_marketplace_rates TO scout_reader;
GRANT SELECT ON scout_trend_cache TO scout_reader;
GRANT SELECT ON scout_settings TO scout_reader;
GRANT SELECT ON scout_export_jobs TO scout_reader;

-- Ð Ð¾Ð»ÑŒ scout_writer (Ð´Ð»Ñ Celery)
CREATE ROLE scout_writer;
GRANT ALL ON scout_analyses TO scout_writer;
GRANT ALL ON scout_trend_cache TO scout_writer;
GRANT ALL ON scout_export_jobs TO scout_writer;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO scout_writer;

-- Ð Ð¾Ð»ÑŒ scout_admin (Ð´Ð»Ñ Ð°Ð´Ð¼Ð¸Ð½Ð¸ÑÑ‚Ñ€Ð°Ñ‚Ð¾Ñ€Ð¾Ð²)
CREATE ROLE scout_admin;
GRANT ALL ON ALL TABLES IN SCHEMA public TO scout_admin;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO scout_admin;
```

---

## 5.10 ÐžÐ±ÑÐ»ÑƒÐ¶Ð¸Ð²Ð°Ð½Ð¸Ðµ

### 5.10.1 ÐÑ€Ñ…Ð¸Ð²Ð°Ñ†Ð¸Ñ ÑÑ‚Ð°Ñ€Ñ‹Ñ… Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð²

```sql
-- ÐŸÐµÑ€ÐµÐ½Ð¾Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð² ÑÑ‚Ð°Ñ€ÑˆÐµ 12 Ð¼ÐµÑÑÑ†ÐµÐ² Ð² Ð°Ñ€Ñ…Ð¸Ð²Ð½ÑƒÑŽ Ñ‚Ð°Ð±Ð»Ð¸Ñ†Ñƒ
CREATE TABLE scout_analyses_archive (LIKE scout_analyses INCLUDING ALL);

-- ÐŸÑ€Ð¾Ñ†ÐµÐ´ÑƒÑ€Ð° Ð°Ñ€Ñ…Ð¸Ð²Ð°Ñ†Ð¸Ð¸
CREATE OR REPLACE PROCEDURE scout_archive_old_analyses()
LANGUAGE plpgsql
AS $$
DECLARE
    v_count INT;
BEGIN
    -- ÐŸÐµÑ€ÐµÐ½Ð¾Ñ Ð² Ð°Ñ€Ñ…Ð¸Ð²
    WITH moved AS (
        DELETE FROM scout_analyses
        WHERE analyzed_at < NOW() - INTERVAL '12 months'
        RETURNING *
    )
    INSERT INTO scout_analyses_archive
    SELECT * FROM moved;
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    
    RAISE NOTICE 'Archived % analyses', v_count;
END;
$$;
```

### 5.10.2 ÐžÑ‡Ð¸ÑÑ‚ÐºÐ° ÐºÑÑˆÐ°

```sql
-- ÐŸÑ€Ð¾Ñ†ÐµÐ´ÑƒÑ€Ð° Ð¾Ñ‡Ð¸ÑÑ‚ÐºÐ¸ ÑƒÑÑ‚Ð°Ñ€ÐµÐ²ÑˆÐµÐ³Ð¾ ÐºÑÑˆÐ°
CREATE OR REPLACE PROCEDURE scout_cleanup_cache()
LANGUAGE plpgsql
AS $$
DECLARE
    v_trend_count INT;
    v_export_count INT;
BEGIN
    -- ÐžÑ‡Ð¸ÑÑ‚ÐºÐ° trend_cache
    DELETE FROM scout_trend_cache
    WHERE expires_at < NOW() - INTERVAL '7 days';
    GET DIAGNOSTICS v_trend_count = ROW_COUNT;
    
    -- ÐžÑ‡Ð¸ÑÑ‚ÐºÐ° export_jobs
    DELETE FROM scout_export_jobs
    WHERE expires_at < NOW() - INTERVAL '1 day';
    GET DIAGNOSTICS v_export_count = ROW_COUNT;
    
    RAISE NOTICE 'Cleaned: % trend cache, % export jobs', v_trend_count, v_export_count;
END;
$$;
```

### 5.10.3 ÐœÐ¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³ Ñ€Ð°Ð·Ð¼ÐµÑ€Ð° Ñ‚Ð°Ð±Ð»Ð¸Ñ†

```sql
-- Ð Ð°Ð·Ð¼ÐµÑ€ Ñ‚Ð°Ð±Ð»Ð¸Ñ† Ð¼Ð¾Ð´ÑƒÐ»Ñ Scout
SELECT 
    relname as table_name,
    pg_size_pretty(pg_total_relation_size(relid)) as total_size,
    pg_size_pretty(pg_relation_size(relid)) as table_size,
    pg_size_pretty(pg_indexes_size(relid)) as index_size,
    n_live_tup as row_count
FROM pg_stat_user_tables
WHERE relname LIKE 'scout_%'
ORDER BY pg_total_relation_size(relid) DESC;
```

---

**Ð”Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚ Ð¿Ð¾Ð´Ð³Ð¾Ñ‚Ð¾Ð²Ð»ÐµÐ½:** Ð¯Ð½Ð²Ð°Ñ€ÑŒ 2026  
**Ð’ÐµÑ€ÑÐ¸Ñ:** 1.0  
**Ð¡Ñ‚Ð°Ñ‚ÑƒÑ:** Ð§ÐµÑ€Ð½Ð¾Ð²Ð¸Ðº

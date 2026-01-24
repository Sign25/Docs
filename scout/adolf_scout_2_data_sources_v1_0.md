# ADOLF SCOUT â€” Ð Ð°Ð·Ð´ÐµÐ» 2: Data Sources

**ÐŸÑ€Ð¾ÐµÐºÑ‚:** ÐŸÑ€ÐµÐ´Ð¸ÐºÑ‚Ð¸Ð²Ð½Ð°Ñ Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ñ‚Ð¾Ð²Ð°Ñ€Ð½Ñ‹Ñ… Ð½Ð¸Ñˆ  
**ÐœÐ¾Ð´ÑƒÐ»ÑŒ:** Scout / Data Sources  
**Ð’ÐµÑ€ÑÐ¸Ñ:** 1.0  
**Ð”Ð°Ñ‚Ð°:** Ð¯Ð½Ð²Ð°Ñ€ÑŒ 2026

---

## 2.1 ÐžÐ±Ð·Ð¾Ñ€ Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¾Ð² Ð´Ð°Ð½Ð½Ñ‹Ñ…

### ÐšÐ°Ñ€Ñ‚Ð° Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¾Ð²

```mermaid
graph TB
    subgraph SCOUT["Scout Module"]
        TREND["Trend Miner"]
        COMP["Competitor Analyzer"]
        UNIT["Unit Calculator"]
    end

    subgraph INTERNAL["Ð’Ð½ÑƒÑ‚Ñ€ÐµÐ½Ð½Ð¸Ðµ Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¸"]
        WATCHER["ADOLF Watcher"]
        PG["PostgreSQL<br/>(Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸)"]
    end

    subgraph YANDEX["Ð¯Ð½Ð´ÐµÐºÑ"]
        WORDSTAT["Wordstat API"]
        YM_ANAL["YM Analytics"]
    end

    subgraph MARKETPLACES["ÐœÐ°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÑ‹"]
        WB_ANAL["WB Analytics"]
        OZON_ANAL["Ozon Seller Analytics"]
    end

    subgraph EXTERNAL["Ð’Ð½ÐµÑˆÐ½Ð¸Ðµ ÑÐµÑ€Ð²Ð¸ÑÑ‹"]
        SIMILAR["SimilarWeb"]
        SERPSTAT["Serpstat"]
        KEYS["Keys.so"]
    end

    TREND --> WORDSTAT
    TREND --> WB_ANAL
    TREND --> OZON_ANAL
    TREND --> YM_ANAL
    TREND --> SIMILAR
    TREND --> SERPSTAT
    TREND --> KEYS

    COMP --> WATCHER

    UNIT --> PG
    UNIT --> WATCHER
```

### Ð¡Ð²Ð¾Ð´Ð½Ð°Ñ Ñ‚Ð°Ð±Ð»Ð¸Ñ†Ð° Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¾Ð²

| Ð˜ÑÑ‚Ð¾Ñ‡Ð½Ð¸Ðº | Ð¢Ð¸Ð¿ Ð´Ð°Ð½Ð½Ñ‹Ñ… | ÐœÐµÑ‚Ð¾Ð´ | ÐŸÑ€Ð¸Ð¾Ñ€Ð¸Ñ‚ÐµÑ‚ | ÐžÐ±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾ÑÑ‚ÑŒ |
|----------|------------|-------|:---------:|:--------------:|
| ADOLF Watcher | Ð¦ÐµÐ½Ñ‹, ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ñ‹, Ð¢ÐžÐŸ-50 | REST API | 1 | âœ… ÐžÐ±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾ |
| Ð¯Ð½Ð´ÐµÐºÑ.Wordstat | Ð§Ð°ÑÑ‚Ð¾Ñ‚Ð½Ð¾ÑÑ‚ÑŒ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð² | API / ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ | 2 | âœ… ÐžÐ±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾ |
| Ozon Seller Analytics | Ð¢Ñ€ÐµÐ½Ð´Ñ‹ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹ | REST API | 3 | Ð–ÐµÐ»Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾ |
| WB Analytics | Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ° ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹ | ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ | 4 | Ð–ÐµÐ»Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾ |
| YM Analytics | Ð¢Ñ€ÐµÐ½Ð´Ñ‹ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹ | REST API | 5 | Ð–ÐµÐ»Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾ |
| SimilarWeb | ÐŸÐ¾Ð¸ÑÐºÐ¾Ð²Ñ‹Ðµ Ñ‚Ñ€ÐµÐ½Ð´Ñ‹ | REST API | 6 | ÐžÐ¿Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾ |
| Serpstat | SEO-Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ° | REST API | 7 | ÐžÐ¿Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾ |
| Keys.so | ÐšÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ðµ ÑÐ»Ð¾Ð²Ð° | REST API | 8 | ÐžÐ¿Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾ |

---

## 2.2 ADOLF Watcher (Ð²Ð½ÑƒÑ‚Ñ€ÐµÐ½Ð½Ð¸Ð¹)

### 2.2.1 ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

ÐžÑÐ½Ð¾Ð²Ð½Ð¾Ð¹ Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸Ðº Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¾ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð°Ñ…, Ñ†ÐµÐ½Ð°Ñ… Ð¸ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ðµ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ¾Ð².

### 2.2.2 Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼Ñ‹Ðµ endpoints

| Endpoint | ÐœÐµÑ‚Ð¾Ð´ | ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ |
|----------|-------|----------|
| `/api/v1/watcher/category/analysis` | GET | ÐÐ³Ñ€ÐµÐ³Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ð¹ Ð°Ð½Ð°Ð»Ð¸Ð· ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸ |
| `/api/v1/watcher/prices/aggregated` | GET | ÐÐ³Ñ€ÐµÐ³Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ðµ Ñ†ÐµÐ½Ñ‹ Ð¿Ð¾ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸ |
| `/api/v1/watcher/competitors/top` | GET | Ð¢ÐžÐŸ Ð¿Ñ€Ð¾Ð´Ð°Ð²Ñ†Ð¾Ð² Ð² ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸ |
| `/api/v1/watcher/search/results` | GET | Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ñ‹ Ð¿Ð¾Ð¸ÑÐºÐ¾Ð²Ð¾Ð¹ Ð²Ñ‹Ð´Ð°Ñ‡Ð¸ |

### 2.2.3 Endpoint: Category Analysis

**Ð—Ð°Ð¿Ñ€Ð¾Ñ:**

```http
GET /api/v1/watcher/category/analysis?category_url={url}&marketplace={mp}
Authorization: Bearer {token}
```

**ÐŸÐ°Ñ€Ð°Ð¼ÐµÑ‚Ñ€Ñ‹:**

| ÐŸÐ°Ñ€Ð°Ð¼ÐµÑ‚Ñ€ | Ð¢Ð¸Ð¿ | ÐžÐ±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ð¹ | ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ |
|----------|-----|:------------:|----------|
| `category_url` | string | Ð”Ð°* | URL ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸ Ð½Ð° Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐµ |
| `search_query` | string | Ð”Ð°* | ÐŸÐ¾Ð¸ÑÐºÐ¾Ð²Ñ‹Ð¹ Ð·Ð°Ð¿Ñ€Ð¾Ñ (Ð°Ð»ÑŒÑ‚ÐµÑ€Ð½Ð°Ñ‚Ð¸Ð²Ð° URL) |
| `marketplace` | string | Ð”Ð° | `wildberries`, `ozon`, `yandex_market` |
| `limit` | int | ÐÐµÑ‚ | ÐšÐ¾Ð»Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾ Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð² Ð´Ð»Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° (default: 50) |

*ÐžÐ´Ð¸Ð½ Ð¸Ð· Ð¿Ð°Ñ€Ð°Ð¼ÐµÑ‚Ñ€Ð¾Ð² Ð¾Ð±ÑÐ·Ð°Ñ‚ÐµÐ»ÐµÐ½

**ÐžÑ‚Ð²ÐµÑ‚:**

```json
{
  "success": true,
  "data": {
    "marketplace": "wildberries",
    "category": "ÐŸÐ»Ð°Ñ‚ÑŒÑ",
    "category_url": "https://www.wildberries.ru/catalog/zhenshchinam/odezhda/platya",
    "analyzed_at": "2026-01-21T08:00:00Z",
    "products_count": 50,
    
    "price_stats": {
      "avg": 2450.00,
      "median": 2200.00,
      "min": 890.00,
      "max": 8900.00,
      "std": 1250.00,
      "percentile_25": 1500.00,
      "percentile_75": 3200.00
    },
    
    "sellers": [
      {
        "name": "BrandX Official",
        "products_in_top": 12,
        "share": 0.24,
        "avg_position": 8.5,
        "avg_price": 2800.00,
        "avg_rating": 4.7
      },
      {
        "name": "FashionStore",
        "products_in_top": 8,
        "share": 0.16,
        "avg_position": 15.2,
        "avg_price": 2100.00,
        "avg_rating": 4.5
      }
    ],
    
    "quality_stats": {
      "avg_rating": 4.52,
      "avg_reviews_count": 245,
      "products_rating_above_4_5": 32,
      "products_with_photos": 48,
      "products_with_video": 12
    },
    
    "competition_metrics": {
      "monopoly_rate": 0.52,
      "herfindahl_index": 0.15,
      "top_3_share": 0.52,
      "top_10_share": 0.78,
      "unique_sellers": 28
    }
  }
}
```

### 2.2.4 Endpoint: Search Results

**Ð—Ð°Ð¿Ñ€Ð¾Ñ:**

```http
GET /api/v1/watcher/search/results?query={query}&marketplace={mp}&limit=50
Authorization: Bearer {token}
```

**ÐžÑ‚Ð²ÐµÑ‚:**

```json
{
  "success": true,
  "data": {
    "query": "Ð»ÐµÑ‚Ð½ÐµÐµ Ð¿Ð»Ð°Ñ‚ÑŒÐµ",
    "marketplace": "wildberries",
    "total_found": 15420,
    "analyzed": 50,
    
    "products": [
      {
        "position": 1,
        "sku": "12345678",
        "title": "ÐŸÐ»Ð°Ñ‚ÑŒÐµ Ð»ÐµÑ‚Ð½ÐµÐµ Ð¶ÐµÐ½ÑÐºÐ¾Ðµ",
        "seller": "BrandX Official",
        "price": 2490.00,
        "old_price": 3500.00,
        "discount_pct": 29,
        "rating": 4.8,
        "reviews_count": 1250,
        "in_stock": true,
        "delivery_days": 2
      }
    ],
    
    "price_distribution": {
      "under_1000": 5,
      "1000_2000": 18,
      "2000_3000": 15,
      "3000_5000": 8,
      "above_5000": 4
    }
  }
}
```

### 2.2.5 ÐšÐ»Ð¸ÐµÐ½Ñ‚ Watcher API

```python
# integrations/watcher_client.py

from typing import Optional, Dict, Any
from dataclasses import dataclass
import httpx

@dataclass
class WatcherConfig:
    """ÐšÐ¾Ð½Ñ„Ð¸Ð³ÑƒÑ€Ð°Ñ†Ð¸Ñ ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð° Watcher."""
    base_url: str = "http://middleware:8000"
    timeout: int = 30
    retry_count: int = 3


class WatcherClient:
    """ÐšÐ»Ð¸ÐµÐ½Ñ‚ Ð´Ð»Ñ Ð²Ð·Ð°Ð¸Ð¼Ð¾Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ Ñ Watcher API."""
    
    def __init__(self, config: WatcherConfig, auth_token: str):
        self.config = config
        self.auth_token = auth_token
        self.client = httpx.AsyncClient(
            base_url=config.base_url,
            timeout=config.timeout,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
    
    async def get_category_analysis(
        self,
        marketplace: str,
        category_url: Optional[str] = None,
        search_query: Optional[str] = None,
        limit: int = 50
    ) -> Dict[str, Any]:
        """
        ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸.
        
        Args:
            marketplace: ÐšÐ¾Ð´ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°
            category_url: URL ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸
            search_query: ÐŸÐ¾Ð¸ÑÐºÐ¾Ð²Ñ‹Ð¹ Ð·Ð°Ð¿Ñ€Ð¾Ñ
            limit: ÐšÐ¾Ð»Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾ Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð² Ð´Ð»Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð°
            
        Returns:
            Ð”Ð°Ð½Ð½Ñ‹Ðµ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸
        """
        params = {
            "marketplace": marketplace,
            "limit": limit
        }
        
        if category_url:
            params["category_url"] = category_url
        elif search_query:
            params["search_query"] = search_query
        else:
            raise ValueError("Either category_url or search_query required")
        
        response = await self.client.get(
            "/api/v1/watcher/category/analysis",
            params=params
        )
        response.raise_for_status()
        
        return response.json()
    
    async def get_price_aggregation(
        self,
        marketplace: str,
        category_url: str
    ) -> Dict[str, Any]:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð°Ð³Ñ€ÐµÐ³Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ñ… Ñ†ÐµÐ½."""
        response = await self.client.get(
            "/api/v1/watcher/prices/aggregated",
            params={
                "marketplace": marketplace,
                "category_url": category_url
            }
        )
        response.raise_for_status()
        return response.json()
    
    async def get_top_sellers(
        self,
        marketplace: str,
        category_url: str,
        limit: int = 20
    ) -> Dict[str, Any]:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¢ÐžÐŸ Ð¿Ñ€Ð¾Ð´Ð°Ð²Ñ†Ð¾Ð²."""
        response = await self.client.get(
            "/api/v1/watcher/competitors/top",
            params={
                "marketplace": marketplace,
                "category_url": category_url,
                "limit": limit
            }
        )
        response.raise_for_status()
        return response.json()
    
    async def close(self):
        """Ð—Ð°ÐºÑ€Ñ‹Ñ‚Ð¸Ðµ ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð°."""
        await self.client.aclose()
```

---

## 2.3 Ð¯Ð½Ð´ÐµÐºÑ.Wordstat

### 2.3.1 ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

ÐžÑÐ½Ð¾Ð²Ð½Ð¾Ð¹ Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸Ðº Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¾ Ñ‡Ð°ÑÑ‚Ð¾Ñ‚Ð½Ð¾ÑÑ‚Ð¸ Ð¿Ð¾Ð¸ÑÐºÐ¾Ð²Ñ‹Ñ… Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð² Ð¸ Ñ‚Ñ€ÐµÐ½Ð´Ð°Ñ… ÑÐ¿Ñ€Ð¾ÑÐ°.

### 2.3.2 ÐœÐµÑ‚Ð¾Ð´Ñ‹ Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ñ Ð´Ð°Ð½Ð½Ñ‹Ñ…

| ÐœÐµÑ‚Ð¾Ð´ | ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ | ÐžÐ³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð¸Ñ |
|-------|----------|-------------|
| **Direct API** | ÐžÑ„Ð¸Ñ†Ð¸Ð°Ð»ÑŒÐ½Ñ‹Ð¹ API Ð¯Ð½Ð´ÐµÐºÑ.Ð”Ð¸Ñ€ÐµÐºÑ‚ | Ð¢Ñ€ÐµÐ±ÑƒÐµÑ‚ÑÑ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚ Ð”Ð¸Ñ€ÐµÐºÑ‚Ð°, Ð»Ð¸Ð¼Ð¸Ñ‚Ñ‹ |
| **ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ Ñ‡ÐµÑ€ÐµÐ· Watcher** | Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð°Ð³ÐµÐ½Ñ‚Ð¾Ð² Watcher | ÐÐ¾Ñ‡Ð½Ð¾Ðµ Ð²Ñ€ÐµÐ¼Ñ, Ñ€Ð¸ÑÐº Ð±Ð»Ð¾ÐºÐ¸Ñ€Ð¾Ð²ÐºÐ¸ |

### 2.3.3 Direct API (Ð¯Ð½Ð´ÐµÐºÑ.Ð”Ð¸Ñ€ÐµÐºÑ‚)

**Endpoint:** `https://api.direct.yandex.com/json/v5/`

**ÐœÐµÑ‚Ð¾Ð´:** `KeywordsResearch` â†’ `GetWordstatReport`

**ÐŸÑ€Ð¾Ñ†ÐµÑÑ:**

```mermaid
sequenceDiagram
    participant SCOUT as Scout
    participant YD as Yandex.Direct API
    
    SCOUT->>YD: CreateNewWordstatReport(phrases)
    YD-->>SCOUT: report_id
    
    loop Polling (max 5 min)
        SCOUT->>YD: GetWordstatReport(report_id)
        alt Report ready
            YD-->>SCOUT: WordstatReport data
        else Not ready
            YD-->>SCOUT: status: pending
            Note over SCOUT: Wait 10 seconds
        end
    end
    
    SCOUT->>YD: DeleteWordstatReport(report_id)
```

**Ð—Ð°Ð¿Ñ€Ð¾Ñ ÑÐ¾Ð·Ð´Ð°Ð½Ð¸Ñ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð°:**

```json
{
  "method": "CreateNewWordstatReport",
  "params": {
    "Phrases": ["Ð»ÐµÑ‚Ð½ÐµÐµ Ð¿Ð»Ð°Ñ‚ÑŒÐµ", "Ð¿Ð»Ð°Ñ‚ÑŒÐµ Ð¶ÐµÐ½ÑÐºÐ¾Ðµ"],
    "GeoID": [225],
    "Device": ["mobile", "desktop", "tablet"]
  }
}
```

**ÐžÑ‚Ð²ÐµÑ‚ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð°:**

```json
{
  "data": [
    {
      "Phrase": "Ð»ÐµÑ‚Ð½ÐµÐµ Ð¿Ð»Ð°Ñ‚ÑŒÐµ",
      "SearchedWith": [
        {"Phrase": "Ð»ÐµÑ‚Ð½ÐµÐµ Ð¿Ð»Ð°Ñ‚ÑŒÐµ ÐºÑƒÐ¿Ð¸Ñ‚ÑŒ", "Shows": 45000},
        {"Phrase": "Ð»ÐµÑ‚Ð½ÐµÐµ Ð¿Ð»Ð°Ñ‚ÑŒÐµ 2026", "Shows": 12000}
      ],
      "SearchedAlso": [
        {"Phrase": "ÑÐ°Ñ€Ð°Ñ„Ð°Ð½ Ð»ÐµÑ‚Ð½Ð¸Ð¹", "Shows": 38000}
      ],
      "Shows": 125000
    }
  ]
}
```

### 2.3.4 ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ Ñ‡ÐµÑ€ÐµÐ· Watcher Agent

Ð”Ð»Ñ ÑÐ»ÑƒÑ‡Ð°ÐµÐ², ÐºÐ¾Ð³Ð´Ð° Direct API Ð½ÐµÐ´Ð¾ÑÑ‚ÑƒÐ¿ÐµÐ½ Ð¸Ð»Ð¸ Ñ‚Ñ€ÐµÐ±ÑƒÐµÑ‚ÑÑ Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ.

**ÐŸÑ€Ð¾Ñ†ÐµÑÑ:**

1. Scout Ñ„Ð¾Ñ€Ð¼Ð¸Ñ€ÑƒÐµÑ‚ Ð·Ð°Ð´Ð°Ñ‡Ñƒ Ð´Ð»Ñ Watcher
2. Watcher Agent Ð½Ð¾Ñ‡ÑŒÑŽ Ð¿Ð°Ñ€ÑÐ¸Ñ‚ wordstat.yandex.ru
3. Ð”Ð°Ð½Ð½Ñ‹Ðµ ÑÐ¾Ñ…Ñ€Ð°Ð½ÑÑŽÑ‚ÑÑ Ð² `scout_trend_cache`
4. Scout Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÑ‚ ÐºÑÑˆÐ¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ

**Ð¡Ñ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð° Ð·Ð°Ð´Ð°Ñ‡Ð¸ Ð´Ð»Ñ Watcher:**

```python
@dataclass
class WordstatTask:
    """Ð—Ð°Ð´Ð°Ñ‡Ð° Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð° Wordstat."""
    task_type: str = "wordstat"
    phrases: List[str]
    regions: List[int] = field(default_factory=lambda: [225])  # Ð Ð¾ÑÑÐ¸Ñ
    period_months: int = 3
    priority: int = 50
```

### 2.3.5 ÐšÐ»Ð¸ÐµÐ½Ñ‚ Wordstat

```python
# integrations/wordstat_client.py

from typing import List, Dict, Optional
from dataclasses import dataclass
from datetime import datetime, timedelta
import httpx

@dataclass
class WordstatData:
    """Ð”Ð°Ð½Ð½Ñ‹Ðµ Ð¸Ð· Wordstat."""
    phrase: str
    total_shows: int
    monthly_data: List[Dict[str, int]]  # [{month: shows}, ...]
    related_phrases: List[Dict[str, int]]
    collected_at: datetime


class WordstatClient:
    """ÐšÐ»Ð¸ÐµÐ½Ñ‚ Ð´Ð»Ñ Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ñ Ð´Ð°Ð½Ð½Ñ‹Ñ… Wordstat."""
    
    DIRECT_API_URL = "https://api.direct.yandex.com/json/v5/"
    
    def __init__(
        self,
        oauth_token: str,
        client_login: Optional[str] = None,
        use_sandbox: bool = False
    ):
        self.oauth_token = oauth_token
        self.client_login = client_login
        self.use_sandbox = use_sandbox
        
        self.client = httpx.AsyncClient(
            headers={
                "Authorization": f"Bearer {oauth_token}",
                "Accept-Language": "ru",
                "Content-Type": "application/json"
            },
            timeout=60
        )
    
    async def get_wordstat_data(
        self,
        phrases: List[str],
        geo_ids: List[int] = [225]
    ) -> List[WordstatData]:
        """
        ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð´Ð°Ð½Ð½Ñ‹Ñ… Wordstat Ñ‡ÐµÑ€ÐµÐ· Direct API.
        
        Args:
            phrases: Ð¡Ð¿Ð¸ÑÐ¾Ðº Ñ„Ñ€Ð°Ð· Ð´Ð»Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð°
            geo_ids: ID Ñ€ÐµÐ³Ð¸Ð¾Ð½Ð¾Ð² (225 = Ð Ð¾ÑÑÐ¸Ñ)
            
        Returns:
            Ð¡Ð¿Ð¸ÑÐ¾Ðº Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¿Ð¾ Ñ„Ñ€Ð°Ð·Ð°Ð¼
        """
        # Ð¡Ð¾Ð·Ð´Ð°Ð½Ð¸Ðµ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð°
        report_id = await self._create_report(phrases, geo_ids)
        
        # ÐžÐ¶Ð¸Ð´Ð°Ð½Ð¸Ðµ Ð³Ð¾Ñ‚Ð¾Ð²Ð½Ð¾ÑÑ‚Ð¸
        report_data = await self._wait_for_report(report_id)
        
        # Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð°
        await self._delete_report(report_id)
        
        # ÐŸÑ€ÐµÐ¾Ð±Ñ€Ð°Ð·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð´Ð°Ð½Ð½Ñ‹Ñ…
        return self._parse_report(report_data)
    
    async def _create_report(
        self,
        phrases: List[str],
        geo_ids: List[int]
    ) -> int:
        """Ð¡Ð¾Ð·Ð´Ð°Ð½Ð¸Ðµ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð° Wordstat."""
        payload = {
            "method": "CreateNewWordstatReport",
            "params": {
                "Phrases": phrases[:10],  # Ð›Ð¸Ð¼Ð¸Ñ‚ 10 Ñ„Ñ€Ð°Ð·
                "GeoID": geo_ids
            }
        }
        
        response = await self.client.post(
            self.DIRECT_API_URL,
            json=payload
        )
        response.raise_for_status()
        
        data = response.json()
        return data["data"]
    
    async def _wait_for_report(
        self,
        report_id: int,
        max_attempts: int = 30,
        interval: int = 10
    ) -> Dict:
        """ÐžÐ¶Ð¸Ð´Ð°Ð½Ð¸Ðµ Ð³Ð¾Ñ‚Ð¾Ð²Ð½Ð¾ÑÑ‚Ð¸ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð°."""
        import asyncio
        
        for _ in range(max_attempts):
            payload = {
                "method": "GetWordstatReport",
                "params": {"ReportID": report_id}
            }
            
            response = await self.client.post(
                self.DIRECT_API_URL,
                json=payload
            )
            
            data = response.json()
            
            if "data" in data and data["data"]:
                return data["data"]
            
            await asyncio.sleep(interval)
        
        raise TimeoutError(f"Wordstat report {report_id} not ready")
    
    async def _delete_report(self, report_id: int):
        """Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð°."""
        payload = {
            "method": "DeleteWordstatReport",
            "params": {"ReportID": report_id}
        }
        
        await self.client.post(
            self.DIRECT_API_URL,
            json=payload
        )
    
    def _parse_report(self, report_data: List[Dict]) -> List[WordstatData]:
        """ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð°."""
        results = []
        
        for item in report_data:
            results.append(WordstatData(
                phrase=item["Phrase"],
                total_shows=item.get("Shows", 0),
                monthly_data=[],  # Ð¢Ñ€ÐµÐ±ÑƒÐµÑ‚ Ð´Ð¾Ð¿Ð¾Ð»Ð½Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾Ð³Ð¾ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ°
                related_phrases=[
                    {"phrase": r["Phrase"], "shows": r["Shows"]}
                    for r in item.get("SearchedWith", [])[:20]
                ],
                collected_at=datetime.utcnow()
            ))
        
        return results
    
    async def close(self):
        """Ð—Ð°ÐºÑ€Ñ‹Ñ‚Ð¸Ðµ ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð°."""
        await self.client.aclose()
```

### 2.3.6 Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ (Wordstat History)

Ð”Ð»Ñ Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ñ Ð¿Ð¾Ð¼ÐµÑÑÑ‡Ð½Ð¾Ð¹ Ð´Ð¸Ð½Ð°Ð¼Ð¸ÐºÐ¸ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÑ‚ÑÑ Ð¾Ñ‚Ð´ÐµÐ»ÑŒÐ½Ñ‹Ð¹ endpoint.

```python
async def get_wordstat_history(
    self,
    phrase: str,
    months: int = 3
) -> List[Dict[str, int]]:
    """
    ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ð¸ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð² Ð¿Ð¾ Ð¼ÐµÑÑÑ†Ð°Ð¼.
    
    Returns:
        [{"month": "2025-11", "shows": 45000}, ...]
    """
    # Wordstat History API Ð¸Ð»Ð¸ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³
    # ...
```

---

## 2.4 Ozon Seller Analytics

### 2.4.1 ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ¸ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹ Ð¸ Ñ‚Ñ€ÐµÐ½Ð´Ð¾Ð² Ð½Ð° Ozon.

### 2.4.2 API Endpoints

| Endpoint | ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ |
|----------|----------|
| `/v1/analytics/data` | ÐÐ½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð¿Ñ€Ð¾Ð´Ð°Ð¶ |
| `/v2/category/tree` | Ð”ÐµÑ€ÐµÐ²Ð¾ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹ |
| `/v1/analytics/stock_on_warehouses` | ÐžÑÑ‚Ð°Ñ‚ÐºÐ¸ Ð½Ð° ÑÐºÐ»Ð°Ð´Ð°Ñ… |

### 2.4.3 ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ñ‚Ñ€ÐµÐ½Ð´Ð¾Ð² ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸

**Ð—Ð°Ð¿Ñ€Ð¾Ñ:**

```http
POST https://api-seller.ozon.ru/v1/analytics/data
Content-Type: application/json
Client-Id: {client_id}
Api-Key: {api_key}

{
  "date_from": "2025-10-01",
  "date_to": "2026-01-01",
  "metrics": ["ordered_units", "revenue", "returns"],
  "dimension": ["category1", "category2"],
  "filters": [
    {
      "key": "category1",
      "value": "ÐžÐ´ÐµÐ¶Ð´Ð°"
    }
  ],
  "limit": 1000,
  "offset": 0
}
```

**ÐžÑ‚Ð²ÐµÑ‚:**

```json
{
  "result": {
    "data": [
      {
        "dimensions": [
          {"id": "category1", "name": "ÐžÐ´ÐµÐ¶Ð´Ð°"},
          {"id": "category2", "name": "ÐŸÐ»Ð°Ñ‚ÑŒÑ"}
        ],
        "metrics": [15420, 38550000, 1230]
      }
    ],
    "totals": [154200, 385500000, 12300]
  }
}
```

### 2.4.4 ÐšÐ»Ð¸ÐµÐ½Ñ‚ Ozon Analytics

```python
# integrations/ozon_analytics.py

from typing import List, Dict, Optional
from dataclasses import dataclass
from datetime import date
import httpx

@dataclass
class OzonTrendData:
    """Ð”Ð°Ð½Ð½Ñ‹Ðµ Ð¾ Ñ‚Ñ€ÐµÐ½Ð´Ð°Ñ… Ozon."""
    category: str
    subcategory: Optional[str]
    period_start: date
    period_end: date
    ordered_units: int
    revenue: float
    returns: int
    avg_price: float


class OzonAnalyticsClient:
    """ÐšÐ»Ð¸ÐµÐ½Ñ‚ Ozon Seller Analytics API."""
    
    BASE_URL = "https://api-seller.ozon.ru"
    
    def __init__(self, client_id: str, api_key: str):
        self.client_id = client_id
        self.api_key = api_key
        
        self.client = httpx.AsyncClient(
            base_url=self.BASE_URL,
            headers={
                "Client-Id": client_id,
                "Api-Key": api_key,
                "Content-Type": "application/json"
            },
            timeout=30
        )
    
    async def get_category_trends(
        self,
        category: str,
        date_from: date,
        date_to: date,
        subcategory: Optional[str] = None
    ) -> List[OzonTrendData]:
        """
        ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ñ‚Ñ€ÐµÐ½Ð´Ð¾Ð² Ð¿Ð¾ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸.
        
        Args:
            category: ÐÐ°Ð·Ð²Ð°Ð½Ð¸Ðµ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸
            date_from: ÐÐ°Ñ‡Ð°Ð»Ð¾ Ð¿ÐµÑ€Ð¸Ð¾Ð´Ð°
            date_to: ÐšÐ¾Ð½ÐµÑ† Ð¿ÐµÑ€Ð¸Ð¾Ð´Ð°
            subcategory: ÐŸÐ¾Ð´ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ñ (Ð¾Ð¿Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾)
        """
        filters = [{"key": "category1", "value": category}]
        if subcategory:
            filters.append({"key": "category2", "value": subcategory})
        
        payload = {
            "date_from": date_from.isoformat(),
            "date_to": date_to.isoformat(),
            "metrics": ["ordered_units", "revenue", "returns"],
            "dimension": ["category1", "category2", "day"],
            "filters": filters,
            "limit": 1000,
            "offset": 0
        }
        
        response = await self.client.post(
            "/v1/analytics/data",
            json=payload
        )
        response.raise_for_status()
        
        return self._parse_trends(response.json(), date_from, date_to)
    
    async def get_category_tree(self) -> Dict:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð´ÐµÑ€ÐµÐ²Ð° ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹."""
        response = await self.client.post(
            "/v2/category/tree",
            json={"language": "RU"}
        )
        response.raise_for_status()
        return response.json()
    
    def _parse_trends(
        self,
        data: Dict,
        date_from: date,
        date_to: date
    ) -> List[OzonTrendData]:
        """ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ñ‚Ñ€ÐµÐ½Ð´Ð¾Ð²."""
        results = []
        
        for item in data.get("result", {}).get("data", []):
            dimensions = {d["id"]: d["name"] for d in item["dimensions"]}
            metrics = item["metrics"]
            
            results.append(OzonTrendData(
                category=dimensions.get("category1", ""),
                subcategory=dimensions.get("category2"),
                period_start=date_from,
                period_end=date_to,
                ordered_units=metrics[0] if len(metrics) > 0 else 0,
                revenue=metrics[1] if len(metrics) > 1 else 0,
                returns=metrics[2] if len(metrics) > 2 else 0,
                avg_price=metrics[1] / metrics[0] if metrics[0] > 0 else 0
            ))
        
        return results
    
    async def close(self):
        await self.client.aclose()
```

---

## 2.5 Wildberries Analytics

### 2.5.1 ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ¸ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹ Ð½Ð° Wildberries.

### 2.5.2 ÐœÐµÑ‚Ð¾Ð´Ñ‹ Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ñ

| ÐœÐµÑ‚Ð¾Ð´ | ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ | Ð¡Ñ‚Ð°Ñ‚ÑƒÑ |
|-------|----------|--------|
| **Seller API** | ÐžÑ„Ð¸Ñ†Ð¸Ð°Ð»ÑŒÐ½Ñ‹Ð¹ API Ð¿Ñ€Ð¾Ð´Ð°Ð²Ñ†Ð° | ÐžÐ³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ |
| **ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³** | Ð§ÐµÑ€ÐµÐ· Watcher Agent | ÐŸÐ¾Ð»Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ |

### 2.5.3 Seller API (Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð½Ñ‹Ð¹)

WB Seller API Ð½Ðµ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÑ‚ Ð¿ÑƒÐ±Ð»Ð¸Ñ‡Ð½Ð¾Ð¹ Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ¸ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹. Ð”Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð¿Ð¾ ÑÐ¾Ð±ÑÑ‚Ð²ÐµÐ½Ð½Ñ‹Ð¼ Ñ‚Ð¾Ð²Ð°Ñ€Ð°Ð¼.

**Ð”Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹Ðµ endpoints:**

| Endpoint | Ð”Ð°Ð½Ð½Ñ‹Ðµ |
|----------|--------|
| `/api/v1/supplier/stocks` | ÐžÑÑ‚Ð°Ñ‚ÐºÐ¸ |
| `/api/v1/supplier/orders` | Ð—Ð°ÐºÐ°Ð·Ñ‹ |
| `/api/v1/supplier/sales` | ÐŸÑ€Ð¾Ð´Ð°Ð¶Ð¸ |

### 2.5.4 ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ Ñ‡ÐµÑ€ÐµÐ· Watcher Agent

Ð”Ð»Ñ Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ñ Ð¿ÑƒÐ±Ð»Ð¸Ñ‡Ð½Ð¾Ð¹ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ¸ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÑ‚ÑÑ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³.

**Ð¦ÐµÐ»ÐµÐ²Ñ‹Ðµ ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹:**

| URL | Ð”Ð°Ð½Ð½Ñ‹Ðµ |
|-----|--------|
| `/catalog/{category}` | ÐšÐ¾Ð»Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾ Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð², Ñ†ÐµÐ½Ð¾Ð²Ð¾Ð¹ Ð´Ð¸Ð°Ð¿Ð°Ð·Ð¾Ð½ |
| `/catalog/{category}?sort=popular` | Ð¢ÐžÐŸ Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð² |
| `/brands/{brand}` | Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ° Ð±Ñ€ÐµÐ½Ð´Ð° |

**Ð¡Ñ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð° Ð·Ð°Ð´Ð°Ñ‡Ð¸:**

```python
@dataclass
class WBCategoryTask:
    """Ð—Ð°Ð´Ð°Ñ‡Ð° Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð° ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸ WB."""
    task_type: str = "wb_category_stats"
    category_url: str
    collect_top: int = 50
    collect_price_distribution: bool = True
    priority: int = 50
```

### 2.5.5 ÐšÐ»Ð¸ÐµÐ½Ñ‚ WB Analytics

```python
# integrations/wb_analytics.py

from typing import Dict, Optional
from dataclasses import dataclass
from datetime import datetime
import httpx

@dataclass
class WBCategoryStats:
    """Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ° ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸ WB."""
    category_url: str
    category_name: str
    total_products: int
    price_min: float
    price_max: float
    price_avg: float
    brands_count: int
    sellers_count: int
    collected_at: datetime


class WBAnalyticsClient:
    """ÐšÐ»Ð¸ÐµÐ½Ñ‚ Ð´Ð»Ñ Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ¸ Wildberries."""
    
    def __init__(self, watcher_client):
        """
        Args:
            watcher_client: ÐšÐ»Ð¸ÐµÐ½Ñ‚ Watcher Ð´Ð»Ñ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð°
        """
        self.watcher = watcher_client
    
    async def get_category_stats(
        self,
        category_url: str
    ) -> WBCategoryStats:
        """
        ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ¸ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸.
        
        Ð”Ð°Ð½Ð½Ñ‹Ðµ Ð±ÐµÑ€ÑƒÑ‚ÑÑ Ð¸Ð· ÐºÑÑˆÐ° Watcher Ð¸Ð»Ð¸ Ð·Ð°Ð¿Ñ€Ð°ÑˆÐ¸Ð²Ð°ÑŽÑ‚ÑÑ ÑÐ²ÐµÐ¶Ð¸Ðµ.
        """
        # ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° ÐºÑÑˆÐ°
        cached = await self._get_from_cache(category_url)
        if cached:
            return cached
        
        # Ð—Ð°Ð¿Ñ€Ð¾Ñ ÑÐ²ÐµÐ¶Ð¸Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ… Ñ‡ÐµÑ€ÐµÐ· Watcher
        data = await self.watcher.get_category_analysis(
            marketplace="wildberries",
            category_url=category_url
        )
        
        return WBCategoryStats(
            category_url=category_url,
            category_name=data["data"]["category"],
            total_products=data["data"]["products_count"],
            price_min=data["data"]["price_stats"]["min"],
            price_max=data["data"]["price_stats"]["max"],
            price_avg=data["data"]["price_stats"]["avg"],
            brands_count=len(set(s["name"] for s in data["data"]["sellers"])),
            sellers_count=data["data"]["competition_metrics"]["unique_sellers"],
            collected_at=datetime.utcnow()
        )
    
    async def _get_from_cache(
        self,
        category_url: str
    ) -> Optional[WBCategoryStats]:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¸Ð· ÐºÑÑˆÐ°."""
        # Ð ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ ÐºÑÑˆÐ¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ
        pass
```

---

## 2.6 Ð¯Ð½Ð´ÐµÐºÑ.ÐœÐ°Ñ€ÐºÐµÑ‚ Analytics

### 2.6.1 ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ¸ Ð¸ Ñ‚Ñ€ÐµÐ½Ð´Ð¾Ð² ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹ Ð½Ð° Ð¯Ð½Ð´ÐµÐºÑ.ÐœÐ°Ñ€ÐºÐµÑ‚Ðµ.

### 2.6.2 API Endpoints

| Endpoint | ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ |
|----------|----------|
| `/businesses/{id}/offer-mappings` | ÐœÐ°Ð¿Ð¿Ð¸Ð½Ð³ Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð² |
| `/businesses/{id}/stats/skus` | Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ° SKU |
| `/categories` | Ð”ÐµÑ€ÐµÐ²Ð¾ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹ |

### 2.6.3 ÐšÐ»Ð¸ÐµÐ½Ñ‚ YM Analytics

```python
# integrations/ym_analytics.py

from typing import List, Dict, Optional
from dataclasses import dataclass
from datetime import date
import httpx

@dataclass
class YMCategoryData:
    """Ð”Ð°Ð½Ð½Ñ‹Ðµ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸ Ð¯Ð½Ð´ÐµÐºÑ.ÐœÐ°Ñ€ÐºÐµÑ‚Ð°."""
    category_id: int
    category_name: str
    products_count: int
    avg_price: float
    price_range: tuple


class YMAnalyticsClient:
    """ÐšÐ»Ð¸ÐµÐ½Ñ‚ Ð¯Ð½Ð´ÐµÐºÑ.ÐœÐ°Ñ€ÐºÐµÑ‚ Analytics API."""
    
    BASE_URL = "https://api.partner.market.yandex.ru"
    
    def __init__(self, oauth_token: str, campaign_id: int):
        self.oauth_token = oauth_token
        self.campaign_id = campaign_id
        
        self.client = httpx.AsyncClient(
            base_url=self.BASE_URL,
            headers={
                "Authorization": f"OAuth {oauth_token}",
                "Content-Type": "application/json"
            },
            timeout=30
        )
    
    async def get_categories(self) -> List[Dict]:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð´ÐµÑ€ÐµÐ²Ð° ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹."""
        response = await self.client.get("/categories")
        response.raise_for_status()
        return response.json().get("result", {}).get("categories", [])
    
    async def get_category_stats(
        self,
        category_id: int
    ) -> YMCategoryData:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ¸ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸."""
        # YM Ð½Ðµ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÑ‚ Ð¿ÑƒÐ±Ð»Ð¸Ñ‡Ð½Ð¾Ð¹ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ¸ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹
        # Ð”Ð°Ð½Ð½Ñ‹Ðµ Ð¿Ð¾Ð»ÑƒÑ‡Ð°ÑŽÑ‚ÑÑ Ñ‡ÐµÑ€ÐµÐ· Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³ Ð¸Ð»Ð¸ Ð¾Ñ†ÐµÐ½ÐºÐ¸
        pass
    
    async def close(self):
        await self.client.aclose()
```

---

## 2.7 Ð’Ð½ÐµÑˆÐ½Ð¸Ðµ ÑÐµÑ€Ð²Ð¸ÑÑ‹

### 2.7.1 SimilarWeb

**ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ:** ÐÐ½Ð°Ð»Ð¸Ð· Ñ‚Ñ€Ð°Ñ„Ð¸ÐºÐ° Ð¸ Ð¿Ð¾Ð¸ÑÐºÐ¾Ð²Ñ‹Ñ… Ñ‚Ñ€ÐµÐ½Ð´Ð¾Ð².

**API:** `https://api.similarweb.com/v1/`

```python
# integrations/external_services.py

class SimilarWebClient:
    """ÐšÐ»Ð¸ÐµÐ½Ñ‚ SimilarWeb API."""
    
    BASE_URL = "https://api.similarweb.com/v1"
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.client = httpx.AsyncClient(
            base_url=self.BASE_URL,
            params={"api_key": api_key},
            timeout=30
        )
    
    async def get_keyword_analysis(
        self,
        keyword: str,
        country: str = "ru"
    ) -> Dict:
        """ÐÐ½Ð°Ð»Ð¸Ð· ÐºÐ»ÑŽÑ‡ÐµÐ²Ð¾Ð³Ð¾ ÑÐ»Ð¾Ð²Ð°."""
        response = await self.client.get(
            f"/keywords/{keyword}/analysis",
            params={"country": country}
        )
        response.raise_for_status()
        return response.json()
    
    async def get_search_trends(
        self,
        keyword: str,
        country: str = "ru",
        months: int = 3
    ) -> List[Dict]:
        """Ð¢Ñ€ÐµÐ½Ð´Ñ‹ Ð¿Ð¾Ð¸ÑÐºÐ¾Ð²Ñ‹Ñ… Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð²."""
        response = await self.client.get(
            f"/keywords/{keyword}/trends",
            params={
                "country": country,
                "granularity": "monthly",
                "months": months
            }
        )
        response.raise_for_status()
        return response.json().get("data", [])
```

### 2.7.2 Serpstat

**ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ:** SEO-Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð¸ Ð°Ð½Ð°Ð»Ð¸Ð· ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ñ… ÑÐ»Ð¾Ð².

**API:** `https://api.serpstat.com/v4/`

```python
class SerpstatClient:
    """ÐšÐ»Ð¸ÐµÐ½Ñ‚ Serpstat API."""
    
    BASE_URL = "https://api.serpstat.com/v4"
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.client = httpx.AsyncClient(
            base_url=self.BASE_URL,
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=30
        )
    
    async def get_keyword_info(
        self,
        keyword: str,
        search_engine: str = "g_ru"  # Google Russia
    ) -> Dict:
        """Ð˜Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ñ Ð¾ ÐºÐ»ÑŽÑ‡ÐµÐ²Ð¾Ð¼ ÑÐ»Ð¾Ð²Ðµ."""
        response = await self.client.get(
            "/keyword_info",
            params={
                "keyword": keyword,
                "se": search_engine
            }
        )
        response.raise_for_status()
        return response.json()
    
    async def get_keyword_trends(
        self,
        keyword: str,
        search_engine: str = "g_ru"
    ) -> List[Dict]:
        """Ð¢Ñ€ÐµÐ½Ð´Ñ‹ ÐºÐ»ÑŽÑ‡ÐµÐ²Ð¾Ð³Ð¾ ÑÐ»Ð¾Ð²Ð°."""
        response = await self.client.get(
            "/keyword_trends",
            params={
                "keyword": keyword,
                "se": search_engine
            }
        )
        response.raise_for_status()
        return response.json().get("result", [])
```

### 2.7.3 Keys.so

**ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ:** ÐÐ½Ð°Ð»Ð¸Ð· ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ñ… ÑÐ»Ð¾Ð² Ð´Ð»Ñ e-commerce.

```python
class KeysClient:
    """ÐšÐ»Ð¸ÐµÐ½Ñ‚ Keys.so API."""
    
    BASE_URL = "https://api.keys.so/v1"
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.client = httpx.AsyncClient(
            base_url=self.BASE_URL,
            headers={"X-API-Key": api_key},
            timeout=30
        )
    
    async def get_keyword_data(
        self,
        keyword: str,
        region: str = "ru"
    ) -> Dict:
        """Ð”Ð°Ð½Ð½Ñ‹Ðµ Ð¿Ð¾ ÐºÐ»ÑŽÑ‡ÐµÐ²Ð¾Ð¼Ñƒ ÑÐ»Ð¾Ð²Ñƒ."""
        response = await self.client.get(
            "/keywords/info",
            params={
                "keyword": keyword,
                "region": region
            }
        )
        response.raise_for_status()
        return response.json()
```

---

## 2.8 ÐÐ³Ñ€ÐµÐ³Ð°Ñ†Ð¸Ñ Ð´Ð°Ð½Ð½Ñ‹Ñ…

### 2.8.1 Ð¡Ñ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ñ Ð°Ð³Ñ€ÐµÐ³Ð°Ñ†Ð¸Ð¸

```mermaid
flowchart TB
    subgraph SOURCES["Ð˜ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¸"]
        S1["Wordstat"]
        S2["Ozon Analytics"]
        S3["WB (Watcher)"]
        S4["External"]
    end
    
    subgraph COLLECT["Ð¡Ð±Ð¾Ñ€"]
        C1["Async gather"]
        TIMEOUT["Timeout 30s"]
    end
    
    subgraph PROCESS["ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ°"]
        NORMALIZE["ÐÐ¾Ñ€Ð¼Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ"]
        WEIGHT["Ð’Ð·Ð²ÐµÑˆÐ¸Ð²Ð°Ð½Ð¸Ðµ"]
        MERGE["ÐžÐ±ÑŠÐµÐ´Ð¸Ð½ÐµÐ½Ð¸Ðµ"]
    end
    
    subgraph OUTPUT["Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚"]
        TREND["TrendResult"]
    end
    
    S1 --> C1
    S2 --> C1
    S3 --> C1
    S4 --> C1
    
    C1 --> TIMEOUT
    TIMEOUT --> NORMALIZE
    NORMALIZE --> WEIGHT
    WEIGHT --> MERGE
    MERGE --> TREND
```

### 2.8.2 Ð’ÐµÑÐ° Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¾Ð²

| Ð˜ÑÑ‚Ð¾Ñ‡Ð½Ð¸Ðº | Ð’ÐµÑ | ÐžÐ±Ð¾ÑÐ½Ð¾Ð²Ð°Ð½Ð¸Ðµ |
|----------|:---:|-------------|
| Ð¯Ð½Ð´ÐµÐºÑ.Wordstat | 0.35 | ÐžÑÐ½Ð¾Ð²Ð½Ð¾Ð¹ Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸Ðº Ð¿Ð¾Ð¸ÑÐºÐ¾Ð²Ñ‹Ñ… Ñ‚Ñ€ÐµÐ½Ð´Ð¾Ð² |
| Ozon Analytics | 0.25 | ÐŸÑ€ÑÐ¼Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ° |
| WB (Watcher) | 0.25 | ÐŸÑ€ÑÐ¼Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ° |
| SimilarWeb | 0.10 | Ð”Ð¾Ð¿Ð¾Ð»Ð½Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ð¹ Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸Ðº |
| Serpstat / Keys | 0.05 | Ð’ÑÐ¿Ð¾Ð¼Ð¾Ð³Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ |

### 2.8.3 Ð ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð°Ð³Ñ€ÐµÐ³Ð°Ñ‚Ð¾Ñ€Ð°

```python
# services/trend_miner.py

from typing import List, Dict, Optional
from dataclasses import dataclass
import asyncio

@dataclass
class SourceWeight:
    """Ð’ÐµÑ Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ° Ð´Ð°Ð½Ð½Ñ‹Ñ…."""
    source: str
    weight: float
    is_required: bool = False


class TrendAggregator:
    """ÐÐ³Ñ€ÐµÐ³Ð°Ñ‚Ð¾Ñ€ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¾ Ñ‚Ñ€ÐµÐ½Ð´Ð°Ñ…."""
    
    SOURCE_WEIGHTS = [
        SourceWeight("wordstat", 0.35, is_required=True),
        SourceWeight("ozon_analytics", 0.25, is_required=False),
        SourceWeight("wb_analytics", 0.25, is_required=False),
        SourceWeight("similarweb", 0.10, is_required=False),
        SourceWeight("serpstat", 0.05, is_required=False),
    ]
    
    def __init__(
        self,
        wordstat_client,
        ozon_client,
        wb_client,
        external_clients: Dict
    ):
        self.wordstat = wordstat_client
        self.ozon = ozon_client
        self.wb = wb_client
        self.external = external_clients
    
    async def collect_trend_data(
        self,
        query: str,
        marketplaces: List[str],
        timeout: int = 30
    ) -> Dict[str, any]:
        """
        Ð¡Ð±Ð¾Ñ€ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¾ Ñ‚Ñ€ÐµÐ½Ð´Ð°Ñ… Ð¸Ð· Ð²ÑÐµÑ… Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¾Ð².
        
        Args:
            query: ÐŸÐ¾Ð¸ÑÐºÐ¾Ð²Ñ‹Ð¹ Ð·Ð°Ð¿Ñ€Ð¾Ñ
            marketplaces: Ð¡Ð¿Ð¸ÑÐ¾Ðº Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ¾Ð²
            timeout: Ð¢Ð°Ð¹Ð¼Ð°ÑƒÑ‚ Ð² ÑÐµÐºÑƒÐ½Ð´Ð°Ñ…
            
        Returns:
            ÐÐ³Ñ€ÐµÐ³Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ
        """
        tasks = []
        source_names = []
        
        # Wordstat (Ð¾Ð±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ð¹)
        tasks.append(self._collect_wordstat(query))
        source_names.append("wordstat")
        
        # Ozon Analytics
        if "ozon" in marketplaces:
            tasks.append(self._collect_ozon(query))
            source_names.append("ozon_analytics")
        
        # WB Analytics
        if "wildberries" in marketplaces:
            tasks.append(self._collect_wb(query))
            source_names.append("wb_analytics")
        
        # External
        if self.external.get("similarweb"):
            tasks.append(self._collect_similarweb(query))
            source_names.append("similarweb")
        
        # ÐŸÐ°Ñ€Ð°Ð»Ð»ÐµÐ»ÑŒÐ½Ñ‹Ð¹ ÑÐ±Ð¾Ñ€ Ñ Ñ‚Ð°Ð¹Ð¼Ð°ÑƒÑ‚Ð¾Ð¼
        results = await asyncio.gather(
            *tasks,
            return_exceptions=True
        )
        
        # ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð²
        collected_data = {}
        for name, result in zip(source_names, results):
            if isinstance(result, Exception):
                collected_data[name] = {"error": str(result)}
            else:
                collected_data[name] = result
        
        return self._aggregate(collected_data)
    
    def _aggregate(self, data: Dict) -> Dict:
        """ÐÐ³Ñ€ÐµÐ³Ð°Ñ†Ð¸Ñ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ñ ÑƒÑ‡Ñ‘Ñ‚Ð¾Ð¼ Ð²ÐµÑÐ¾Ð²."""
        trend_values = []
        total_weight = 0
        
        for source_config in self.SOURCE_WEIGHTS:
            source_data = data.get(source_config.source)
            
            if source_data and "error" not in source_data:
                trend_value = source_data.get("trend_slope", 0)
                trend_values.append((trend_value, source_config.weight))
                total_weight += source_config.weight
        
        if total_weight == 0:
            return {"trend_slope": 0, "confidence": 0}
        
        # Ð’Ð·Ð²ÐµÑˆÐµÐ½Ð½Ð¾Ðµ ÑÑ€ÐµÐ´Ð½ÐµÐµ
        weighted_sum = sum(v * w for v, w in trend_values)
        avg_trend = weighted_sum / total_weight
        
        # Ð£Ð²ÐµÑ€ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ = Ð´Ð¾Ð»Ñ ÑÐ¾Ð±Ñ€Ð°Ð½Ð½Ñ‹Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ…
        confidence = total_weight / sum(s.weight for s in self.SOURCE_WEIGHTS)
        
        return {
            "trend_slope": round(avg_trend, 4),
            "confidence": round(confidence, 2),
            "sources_used": [n for n, d in data.items() if "error" not in d],
            "sources_failed": [n for n, d in data.items() if "error" in d]
        }
    
    async def _collect_wordstat(self, query: str) -> Dict:
        """Ð¡Ð±Ð¾Ñ€ Ð´Ð°Ð½Ð½Ñ‹Ñ… Wordstat."""
        data = await self.wordstat.get_wordstat_data([query])
        if not data:
            return {"error": "No data"}
        
        # Ð Ð°ÑÑ‡Ñ‘Ñ‚ trend_slope Ð¸Ð· Ð¿Ð¾Ð¼ÐµÑÑÑ‡Ð½Ñ‹Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ…
        # ...
        return {"trend_slope": 0.12, "total_shows": data[0].total_shows}
    
    async def _collect_ozon(self, query: str) -> Dict:
        """Ð¡Ð±Ð¾Ñ€ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ozon."""
        # ...
        pass
    
    async def _collect_wb(self, query: str) -> Dict:
        """Ð¡Ð±Ð¾Ñ€ Ð´Ð°Ð½Ð½Ñ‹Ñ… WB."""
        # ...
        pass
    
    async def _collect_similarweb(self, query: str) -> Dict:
        """Ð¡Ð±Ð¾Ñ€ Ð´Ð°Ð½Ð½Ñ‹Ñ… SimilarWeb."""
        # ...
        pass
```

---

## 2.9 ÐšÑÑˆÐ¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ

### 2.9.1 Ð¡Ñ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ñ ÐºÑÑˆÐ¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ

| Ð”Ð°Ð½Ð½Ñ‹Ðµ | Ð¥Ñ€Ð°Ð½Ð¸Ð»Ð¸Ñ‰Ðµ | TTL | ÐšÐ»ÑŽÑ‡ |
|--------|-----------|-----|------|
| Ð¢Ñ€ÐµÐ½Ð´Ñ‹ Wordstat | Redis | 24 Ñ‡Ð°ÑÐ° | `scout:trend:wordstat:{query_hash}` |
| Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ° ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹ | Redis | 12 Ñ‡Ð°ÑÐ¾Ð² | `scout:category:{url_hash}` |
| Ð¡Ñ‚Ð°Ð²ÐºÐ¸ ÐœÐŸ | Redis | 1 Ñ‡Ð°Ñ | `scout:rates:{marketplace}` |
| Ð”ÐµÑ€ÐµÐ²Ð¾ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹ | Redis | 7 Ð´Ð½ÐµÐ¹ | `scout:categories:{marketplace}` |
| Ð’Ð½ÐµÑˆÐ½Ð¸Ðµ ÑÐµÑ€Ð²Ð¸ÑÑ‹ | Redis | 7 Ð´Ð½ÐµÐ¹ | `scout:external:{service}:{query_hash}` |

### 2.9.2 Ð ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ ÐºÑÑˆÐ°

```python
# utils/cache.py

import hashlib
import json
from typing import Optional, Any
from datetime import timedelta
import redis.asyncio as redis

class ScoutCache:
    """ÐšÑÑˆ Ð´Ð»Ñ Ð¼Ð¾Ð´ÑƒÐ»Ñ Scout."""
    
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
    
    def _make_key(self, prefix: str, *args) -> str:
        """Ð¡Ð¾Ð·Ð´Ð°Ð½Ð¸Ðµ ÐºÐ»ÑŽÑ‡Ð° ÐºÑÑˆÐ°."""
        data = ":".join(str(a) for a in args)
        hash_value = hashlib.md5(data.encode()).hexdigest()[:12]
        return f"scout:{prefix}:{hash_value}"
    
    async def get(self, prefix: str, *args) -> Optional[Any]:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¸Ð· ÐºÑÑˆÐ°."""
        key = self._make_key(prefix, *args)
        data = await self.redis.get(key)
        
        if data:
            return json.loads(data)
        return None
    
    async def set(
        self,
        prefix: str,
        *args,
        value: Any,
        ttl: timedelta
    ):
        """Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ð² ÐºÑÑˆ."""
        key = self._make_key(prefix, *args)
        await self.redis.setex(
            key,
            ttl,
            json.dumps(value, default=str)
        )
    
    async def delete(self, prefix: str, *args):
        """Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ Ð¸Ð· ÐºÑÑˆÐ°."""
        key = self._make_key(prefix, *args)
        await self.redis.delete(key)
    
    async def get_trend(self, query: str) -> Optional[Dict]:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÐºÑÑˆÐ¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾Ð³Ð¾ Ñ‚Ñ€ÐµÐ½Ð´Ð°."""
        return await self.get("trend", query)
    
    async def set_trend(self, query: str, data: Dict):
        """Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ñ‚Ñ€ÐµÐ½Ð´Ð°."""
        await self.set("trend", query, value=data, ttl=timedelta(hours=24))
    
    async def get_category(self, url: str) -> Optional[Dict]:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÐºÑÑˆÐ¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾Ð¹ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸."""
        return await self.get("category", url)
    
    async def set_category(self, url: str, data: Dict):
        """Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸."""
        await self.set("category", url, value=data, ttl=timedelta(hours=12))
```

---

## 2.10 ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð¾ÑˆÐ¸Ð±Ð¾Ðº

### 2.10.1 Ð¢Ð¸Ð¿Ñ‹ Ð¾ÑˆÐ¸Ð±Ð¾Ðº

| ÐžÑˆÐ¸Ð±ÐºÐ° | ÐŸÑ€Ð¸Ñ‡Ð¸Ð½Ð° | Ð”ÐµÐ¹ÑÑ‚Ð²Ð¸Ðµ |
|--------|---------|----------|
| `SourceUnavailable` | API Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ° Ð½ÐµÐ´Ð¾ÑÑ‚ÑƒÐ¿ÐµÐ½ | Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ ÐºÑÑˆ Ð¸Ð»Ð¸ Ð¿Ñ€Ð¾Ð¿ÑƒÑÑ‚Ð¸Ñ‚ÑŒ |
| `RateLimitExceeded` | ÐŸÑ€ÐµÐ²Ñ‹ÑˆÐµÐ½ Ð»Ð¸Ð¼Ð¸Ñ‚ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð² | Retry Ñ backoff |
| `AuthenticationError` | ÐÐµÐ²Ð°Ð»Ð¸Ð´Ð½Ñ‹Ð¹ Ñ‚Ð¾ÐºÐµÐ½ | Ð£Ð²ÐµÐ´Ð¾Ð¼Ð¸Ñ‚ÑŒ Admin |
| `DataParseError` | ÐžÑˆÐ¸Ð±ÐºÐ° Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð° Ð¾Ñ‚Ð²ÐµÑ‚Ð° | Ð›Ð¾Ð³Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ, Ð¿Ñ€Ð¾Ð¿ÑƒÑÑ‚Ð¸Ñ‚ÑŒ Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸Ðº |
| `TimeoutError` | Ð¢Ð°Ð¹Ð¼Ð°ÑƒÑ‚ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ° | Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ ÐºÑÑˆ |

### 2.10.2 Retry-ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ñ

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
async def fetch_with_retry(client, endpoint, **kwargs):
    """Ð—Ð°Ð¿Ñ€Ð¾Ñ Ñ Ð¿Ð¾Ð²Ñ‚Ð¾Ñ€Ð½Ñ‹Ð¼Ð¸ Ð¿Ð¾Ð¿Ñ‹Ñ‚ÐºÐ°Ð¼Ð¸."""
    return await client.get(endpoint, **kwargs)
```

### 2.10.3 Graceful Degradation

```python
async def collect_data_safe(self, query: str) -> Dict:
    """
    Ð¡Ð±Ð¾Ñ€ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ñ graceful degradation.
    
    Ð•ÑÐ»Ð¸ Ð¾ÑÐ½Ð¾Ð²Ð½Ñ‹Ðµ Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¸ Ð½ÐµÐ´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹, Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼ ÐºÑÑˆ.
    Ð•ÑÐ»Ð¸ ÐºÑÑˆ Ð¿ÑƒÑÑ‚ â€” Ð²Ð¾Ð·Ð²Ñ€Ð°Ñ‰Ð°ÐµÐ¼ Ñ‡Ð°ÑÑ‚Ð¸Ñ‡Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ.
    """
    try:
        return await self.collect_data(query)
    except SourceUnavailable as e:
        # ÐŸÐ¾Ð¿Ñ‹Ñ‚ÐºÐ° Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ ÐºÑÑˆ
        cached = await self.cache.get_trend(query)
        if cached:
            cached["from_cache"] = True
            return cached
        
        # ÐœÐ¸Ð½Ð¸Ð¼Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ð¾Ñ‚Ð²ÐµÑ‚
        return {
            "trend_slope": None,
            "confidence": 0,
            "error": str(e),
            "sources_used": []
        }
```

---

**Ð”Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚ Ð¿Ð¾Ð´Ð³Ð¾Ñ‚Ð¾Ð²Ð»ÐµÐ½:** Ð¯Ð½Ð²Ð°Ñ€ÑŒ 2026  
**Ð’ÐµÑ€ÑÐ¸Ñ:** 1.0  
**Ð¡Ñ‚Ð°Ñ‚ÑƒÑ:** Ð§ÐµÑ€Ð½Ð¾Ð²Ð¸Ðº

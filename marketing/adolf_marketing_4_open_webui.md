---
title: "Раздел 4: Open WebUI"
mode: "wide"
---

**ÐŸÑ€Ð¾ÐµÐºÑ‚:** ÐÐ²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¾Ðµ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ñ€ÐµÐºÐ»Ð°Ð¼Ð½Ñ‹Ð¼Ð¸ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸ÑÐ¼Ð¸  
**ÐœÐ¾Ð´ÑƒÐ»ÑŒ:** Marketing / Open WebUI  
**Ð’ÐµÑ€ÑÐ¸Ñ:** 1.0  
**Ð”Ð°Ñ‚Ð°:** Ð¯Ð½Ð²Ð°Ñ€ÑŒ 2026

---

## 4.1 ÐžÐ±Ð·Ð¾Ñ€

### ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

Ð Ð°Ð·Ð´ÐµÐ» Ð¾Ð¿Ð¸ÑÑ‹Ð²Ð°ÐµÑ‚ Ð¸Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ð¸ÑŽ Ð¼Ð¾Ð´ÑƒÐ»Ñ Marketing Ñ Open WebUI:

- **Pipeline** `@Adolf_Marketing` â€” Ð°Ð³ÐµÐ½Ñ‚ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ Ñ€ÐµÐºÐ»Ð°Ð¼Ð¾Ð¹
- **Tools** â€” Function Calling Ð´Ð»Ñ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¹ Ñ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸ÑÐ¼Ð¸ Ð¸ ÑÑ‚Ð°Ð²ÐºÐ°Ð¼Ð¸
- **Interactive UI** â€” ÐºÐ½Ð¾Ð¿ÐºÐ¸, ÐºÐ°Ñ€Ñ‚Ð¾Ñ‡ÐºÐ¸, Ð³Ñ€Ð°Ñ„Ð¸ÐºÐ¸ Ð² Ñ‡Ð°Ñ‚Ðµ

### ÐšÐ¾Ð¼Ð¿Ð¾Ð½ÐµÐ½Ñ‚Ñ‹ Ð¸Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ð¸Ð¸

| ÐšÐ¾Ð¼Ð¿Ð¾Ð½ÐµÐ½Ñ‚ | ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ |
|-----------|------------|
| Pipeline | ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð², Ð¼Ð°Ñ€ÑˆÑ€ÑƒÑ‚Ð¸Ð·Ð°Ñ†Ð¸Ñ, Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ |
| Tools | Ð¤ÑƒÐ½ÐºÑ†Ð¸Ð¸ Ð´Ð»Ñ Function Calling |
| Valves | ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ Pipeline |
| Buttons | ÐšÐ½Ð¾Ð¿ÐºÐ¸ Ð±Ñ‹ÑÑ‚Ñ€Ñ‹Ñ… Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ð¹ |
| Cards | ÐšÐ°Ñ€Ñ‚Ð¾Ñ‡ÐºÐ¸ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¹ Ð¸ ÐºÐ»ÑŽÑ‡ÐµÐ¹ |
| Charts | Ð“Ñ€Ð°Ñ„Ð¸ÐºÐ¸ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ¸ |

### ÐÑ€Ñ…Ð¸Ñ‚ÐµÐºÑ‚ÑƒÑ€Ð° Ð¸Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ð¸Ð¸

```mermaid
graph TB
    subgraph USER["ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒ"]
        CHAT["Chat Interface"]
    end
    
    subgraph OWUI["Open WebUI"]
        PIPELINE["Marketing Pipeline"]
        TOOLS["Marketing Tools"]
        UI["Interactive UI"]
    end
    
    subgraph MIDDLEWARE["ADOLF Middleware"]
        AUTH["Auth & RBAC"]
        ROUTE["Router"]
    end
    
    subgraph MARKETING["Marketing Backend"]
        API["REST API"]
        BID_ENGINE["Bid Engine"]
        SAFETY["Safety Logic"]
    end
    
    CHAT --> PIPELINE
    PIPELINE --> TOOLS
    TOOLS --> UI
    PIPELINE --> AUTH
    AUTH --> ROUTE
    ROUTE --> API
    
    API --> BID_ENGINE
    API --> SAFETY
    
    API --> PIPELINE
    UI --> CHAT
```

---

## 4.2 Pipeline: @Adolf_Marketing

### 4.2.1 ÐšÐ¾Ð½Ñ„Ð¸Ð³ÑƒÑ€Ð°Ñ†Ð¸Ñ

```python
# pipelines/adolf_marketing.py
"""
title: Adolf Marketing Pipeline
author: Adolf Team
version: 1.0.0
description: Ð£Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ñ€ÐµÐºÐ»Ð°Ð¼Ð½Ñ‹Ð¼Ð¸ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸ÑÐ¼Ð¸ Ð½Ð° Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°Ñ…
"""

from typing import List, Generator, Optional
from pydantic import BaseModel, Field
import requests
import json


class Pipeline:
    """Pipeline Ð´Ð»Ñ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ Ñ€ÐµÐºÐ»Ð°Ð¼Ð½Ñ‹Ð¼Ð¸ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸ÑÐ¼Ð¸."""
    
    class Valves(BaseModel):
        """ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ Pipeline."""
        MIDDLEWARE_URL: str = Field(
            default="http://middleware:8000",
            description="URL Middleware API"
        )
        MIDDLEWARE_API_KEY: str = Field(
            default="",
            description="API ÐºÐ»ÑŽÑ‡ Middleware"
        )
        DEFAULT_MODEL: str = Field(
            default="gpt-5-mini",
            description="ÐœÐ¾Ð´ÐµÐ»ÑŒ Ð´Ð»Ñ Ñ€ÑƒÑ‚Ð¸Ð½Ð½Ñ‹Ñ… Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð²"
        )
        ANALYTICS_MODEL: str = Field(
            default="claude-opus-4-5",
            description="ÐœÐ¾Ð´ÐµÐ»ÑŒ Ð´Ð»Ñ Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ¸"
        )
        ENABLE_REALTIME_STATS: bool = Field(
            default=True,
            description="Ð—Ð°Ð³Ñ€ÑƒÐ¶Ð°Ñ‚ÑŒ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÑƒ Ð² Ñ€ÐµÐ°Ð»ÑŒÐ½Ð¾Ð¼ Ð²Ñ€ÐµÐ¼ÐµÐ½Ð¸"
        )
        DEFAULT_STATS_PERIOD: int = Field(
            default=7,
            description="ÐŸÐµÑ€Ð¸Ð¾Ð´ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ¸ Ð¿Ð¾ ÑƒÐ¼Ð¾Ð»Ñ‡Ð°Ð½Ð¸ÑŽ (Ð´Ð½Ð¸)"
        )
    
    def __init__(self):
        self.name = "Adolf Marketing"
        self.valves = self.Valves()
    
    async def on_startup(self):
        """Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð¿Ñ€Ð¸ Ð·Ð°Ð¿ÑƒÑÐºÐµ."""
        print(f"[{self.name}] Pipeline started")
    
    async def on_shutdown(self):
        """ÐžÑ‡Ð¸ÑÑ‚ÐºÐ° Ð¿Ñ€Ð¸ Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐµ."""
        print(f"[{self.name}] Pipeline stopped")
    
    def inlet(self, body: dict, __user__: dict) -> dict:
        """
        Preprocessing â€” Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð° Ð¸ Ð´Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ð°.
        """
        user_role = __user__.get("role", "staff")
        user_brand = __user__.get("valves", {}).get("brand_id", "all")
        
        # ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð° (Staff Ð½Ðµ Ð¸Ð¼ÐµÐµÑ‚ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð°)
        if user_role == "staff":
            body["messages"].append({
                "role": "system",
                "content": "Ð£ Ð²Ð°Ñ Ð½ÐµÑ‚ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð° Ðº Ð¼Ð¾Ð´ÑƒÐ»ÑŽ Marketing. ÐžÐ±Ñ€Ð°Ñ‚Ð¸Ñ‚ÐµÑÑŒ Ðº Ñ€ÑƒÐºÐ¾Ð²Ð¾Ð´Ð¸Ñ‚ÐµÐ»ÑŽ."
            })
            return body
        
        # Ð”Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÐ¸ÑÑ‚ÐµÐ¼Ð½Ð¾Ð³Ð¾ ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ð°
        system_context = self._build_system_context(user_role, user_brand)
        
        messages = body.get("messages", [])
        if messages and messages[0].get("role") != "system":
            messages.insert(0, {"role": "system", "content": system_context})
        
        # Ð—Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° summary Ð´Ð»Ñ ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ð° (ÐµÑÐ»Ð¸ Ð²ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¾)
        if self.valves.ENABLE_REALTIME_STATS:
            summary = self._fetch_campaigns_summary(__user__)
            if summary:
                messages.insert(1, {
                    "role": "system", 
                    "content": f"Ð¢ÐµÐºÑƒÑ‰Ð°Ñ ÑÐ²Ð¾Ð´ÐºÐ° Ð¿Ð¾ Ñ€ÐµÐºÐ»Ð°Ð¼Ðµ:\n{summary}"
                })
        
        body["messages"] = messages
        return body
    
    def pipe(
        self,
        body: dict,
        __user__: dict,
        __event_emitter__: callable = None
    ) -> Generator:
        """ÐžÑÐ½Ð¾Ð²Ð½Ð°Ñ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð²."""
        
        user_id = __user__.get("id")
        user_role = __user__.get("role", "staff")
        user_brand = __user__.get("valves", {}).get("brand_id", "all")
        
        # ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ Ð¼Ð¾Ð´ÐµÐ»Ð¸
        model = self._select_model(body.get("messages", []))
        
        # Ð—Ð°Ð¿Ñ€Ð¾Ñ Ðº Middleware
        response = requests.post(
            f"{self.valves.MIDDLEWARE_URL}/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {self.valves.MIDDLEWARE_API_KEY}",
                "X-User-ID": str(user_id),
                "X-User-Role": user_role,
                "X-User-Brand": user_brand,
                "X-Module": "marketing"
            },
            json={
                "model": model,
                "messages": body.get("messages", []),
                "stream": True,
                "tools": self._get_tools_for_role(user_role)
            },
            stream=True
        )
        
        # Streaming response
        for line in response.iter_lines():
            if line:
                yield line.decode("utf-8")
    
    def outlet(self, body: dict, __user__: dict) -> dict:
        """
        Postprocessing â€” Ð´Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ ÐºÐ½Ð¾Ð¿Ð¾Ðº Ð¸ Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ.
        """
        user_role = __user__.get("role", "staff")
        
        # Ð”Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ ÐºÐ½Ð¾Ð¿Ð¾Ðº Ð¿Ð¾ ÑƒÐ¼Ð¾Ð»Ñ‡Ð°Ð½Ð¸ÑŽ
        if "buttons" not in body:
            body["buttons"] = self._get_default_buttons(user_role)
        
        return body
    
    def _build_system_context(self, role: str, brand: str) -> str:
        """Ð¤Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ ÑÐ¸ÑÑ‚ÐµÐ¼Ð½Ð¾Ð³Ð¾ ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ð°."""
        
        context = """Ð¢Ñ‹ â€” Adolf Marketing, AI-Ð°ÑÑÐ¸ÑÑ‚ÐµÐ½Ñ‚ Ð´Ð»Ñ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ Ñ€ÐµÐºÐ»Ð°Ð¼Ð½Ñ‹Ð¼Ð¸ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸ÑÐ¼Ð¸ Ð½Ð° Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°Ñ….

Ð¢Ð²Ð¾Ð¸ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚Ð¸:
- ÐŸÑ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€ Ð¸ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ñ€ÐµÐºÐ»Ð°Ð¼Ð½Ñ‹Ð¼Ð¸ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸ÑÐ¼Ð¸ (WB, Ozon, YM)
- ÐŸÑ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ¸: CTR, CPC, CPO, Ð”Ð Ð 
- Ð£Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²ÐºÐ°Ð¼Ð¸ Ð¸ Ð±ÑŽÐ´Ð¶ÐµÑ‚Ð°Ð¼Ð¸
- ÐÐ½Ð°Ð»Ð¸Ð· ÑÑ„Ñ„ÐµÐºÑ‚Ð¸Ð²Ð½Ð¾ÑÑ‚Ð¸ Ð¸ Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸
- ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ° ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ð¹ Ð±Ð¸Ð´Ð´Ð¸Ð½Ð³Ð°

ÐŸÑ€Ð°Ð²Ð¸Ð»Ð°:
- ÐžÑ‚Ð²ÐµÑ‡Ð°Ð¹ Ð½Ð° Ñ€ÑƒÑÑÐºÐ¾Ð¼ ÑÐ·Ñ‹ÐºÐµ
- Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐ¹ Ð¸Ð½ÑÑ‚Ñ€ÑƒÐ¼ÐµÐ½Ñ‚Ñ‹ (tools) Ð´Ð»Ñ Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ñ Ð´Ð°Ð½Ð½Ñ‹Ñ…
- ÐŸÐ¾ÐºÐ°Ð·Ñ‹Ð²Ð°Ð¹ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð² ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾Ð¼ Ð²Ð¸Ð´Ðµ
- ÐŸÑ€Ð¸ Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ð¸ ÑÑ‚Ð°Ð²Ð¾Ðº Ð²ÑÐµÐ³Ð´Ð° Ð¿Ð¾ÐºÐ°Ð·Ñ‹Ð²Ð°Ð¹ Ñ‚ÐµÐºÑƒÑ‰ÐµÐµ Ð¸ Ð½Ð¾Ð²Ð¾Ðµ Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ
- ÐŸÑ€ÐµÐ´ÑƒÐ¿Ñ€ÐµÐ¶Ð´Ð°Ð¹ Ð¾ Ñ€Ð¸ÑÐºÐ°Ñ… Ð¿Ñ€Ð¸ Ð°Ð³Ñ€ÐµÑÑÐ¸Ð²Ð½Ñ‹Ñ… Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ°Ñ…
"""
        
        # Ð”Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð¸Ð¹ Ð¿Ð¾ Ñ€Ð¾Ð»Ð¸
        if role == "manager":
            context += f"""
ÐžÐ³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð¸Ñ Ð´Ð»Ñ Ñ€Ð¾Ð»Ð¸ Manager:
- Ð”Ð¾ÑÑ‚ÑƒÐ¿ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ðº Ð±Ñ€ÐµÐ½Ð´Ñƒ: {brand}
- Ð˜Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²Ð¾Ðº Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð² Ð¿Ñ€ÐµÐ´ÐµÐ»Ð°Ñ… ÑƒÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð½Ñ‹Ñ… Ð»Ð¸Ð¼Ð¸Ñ‚Ð¾Ð²
- ÐÐµÑ‚ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð° Ðº Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸ÑŽ Max Bid, Daily Limit, ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ð¹
"""
        elif role == "senior":
            context += """
ÐŸÑ€Ð°Ð²Ð° Ð´Ð»Ñ Ñ€Ð¾Ð»Ð¸ Senior:
- Ð”Ð¾ÑÑ‚ÑƒÐ¿ ÐºÐ¾ Ð²ÑÐµÐ¼ Ð±Ñ€ÐµÐ½Ð´Ð°Ð¼
- Ð˜Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ Max Bid, Daily Limit, ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ð¹
- ÐŸÑ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€ ÑÐ²Ð¾Ð´Ð½Ñ‹Ñ… Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð¾Ð²
- AI-Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸
"""
        elif role in ("director", "administrator"):
            context += """
ÐŸÐ¾Ð»Ð½Ñ‹Ð¹ Ð´Ð¾ÑÑ‚ÑƒÐ¿:
- Ð’ÑÐµ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¸ Ð±ÐµÐ· Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð¸Ð¹
- ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ Safety Logic (Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Admin)
- Ð¡Ð¸ÑÑ‚ÐµÐ¼Ð½Ñ‹Ðµ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ (Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Admin)
"""
        
        return context
    
    def _select_model(self, messages: List[dict]) -> str:
        """Ð’Ñ‹Ð±Ð¾Ñ€ Ð¼Ð¾Ð´ÐµÐ»Ð¸ Ð½Ð° Ð¾ÑÐ½Ð¾Ð²Ðµ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ°."""
        
        last_message = messages[-1].get("content", "").lower() if messages else ""
        
        # ÐÐ½Ð°Ð»Ð¸Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð·Ð°Ð¿Ñ€Ð¾ÑÑ‹ â†’ Claude Opus 4.5
        analytics_keywords = [
            "Ð°Ð½Ð°Ð»Ð¸Ð·", "Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†", "Ð¾Ð¿Ñ‚Ð¸Ð¼Ð¸Ð·", "Ð¿Ñ€Ð¾Ð³Ð½Ð¾Ð·", 
            "Ð¿Ð¾Ñ‡ÐµÐ¼Ñƒ", "Ñ‡Ñ‚Ð¾ Ð´ÐµÐ»Ð°Ñ‚ÑŒ", "Ð¸Ð½ÑÐ°Ð¹Ñ‚", "trend"
        ]
        
        if any(kw in last_message for kw in analytics_keywords):
            return self.valves.ANALYTICS_MODEL
        
        return self.valves.DEFAULT_MODEL
    
    def _fetch_campaigns_summary(self, user: dict) -> Optional[str]:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÐºÑ€Ð°Ñ‚ÐºÐ¾Ð¹ ÑÐ²Ð¾Ð´ÐºÐ¸ Ð¿Ð¾ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸ÑÐ¼."""
        
        try:
            response = requests.get(
                f"{self.valves.MIDDLEWARE_URL}/api/v1/marketing/summary",
                headers={
                    "Authorization": f"Bearer {self.valves.MIDDLEWARE_API_KEY}",
                    "X-User-ID": str(user.get("id")),
                    "X-User-Role": user.get("role"),
                    "X-User-Brand": user.get("valves", {}).get("brand_id", "all")
                },
                params={"period_days": self.valves.DEFAULT_STATS_PERIOD},
                timeout=5
            )
            
            if response.status_code != 200:
                return None
            
            data = response.json()
            
            summary = f"""
ÐÐºÑ‚Ð¸Ð²Ð½Ñ‹Ñ… ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¹: {data.get('active_campaigns', 0)}
Ð Ð°ÑÑ…Ð¾Ð´ Ð·Ð° {self.valves.DEFAULT_STATS_PERIOD} Ð´Ð½ÐµÐ¹: {data.get('total_spent', 0):,.0f} â‚½
Ð¡Ñ€ÐµÐ´Ð½Ð¸Ð¹ Ð”Ð Ð : {data.get('avg_drr', 0):.1f}%
ÐšÐ»ÑŽÑ‡ÐµÐ¹ Ð¿Ñ€Ð¸Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð¾: {data.get('paused_keywords', 0)}
ÐÐ»ÐµÑ€Ñ‚Ð¾Ð²: {data.get('pending_alerts', 0)}
"""
            return summary
            
        except Exception:
            return None
    
    def _get_tools_for_role(self, role: str) -> List[dict]:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÐ¿Ð¸ÑÐºÐ° Ð¸Ð½ÑÑ‚Ñ€ÑƒÐ¼ÐµÐ½Ñ‚Ð¾Ð² Ð¿Ð¾ Ñ€Ð¾Ð»Ð¸."""
        
        # Ð‘Ð°Ð·Ð¾Ð²Ñ‹Ðµ tools Ð´Ð»Ñ Manager+
        base_tools = [
            {
                "type": "function",
                "function": {
                    "name": "marketing_campaigns_list",
                    "description": "Ð¡Ð¿Ð¸ÑÐ¾Ðº Ñ€ÐµÐºÐ»Ð°Ð¼Ð½Ñ‹Ñ… ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¹",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "marketplace": {
                                "type": "string",
                                "enum": ["wb", "ozon", "ym", "all"],
                                "description": "ÐœÐ°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹Ñ"
                            },
                            "status": {
                                "type": "string",
                                "enum": ["active", "paused", "all"],
                                "description": "Ð¡Ñ‚Ð°Ñ‚ÑƒÑ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸"
                            }
                        }
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "marketing_campaign_stats",
                    "description": "Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ° ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "campaign_id": {
                                "type": "string",
                                "description": "ID ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸"
                            },
                            "period_days": {
                                "type": "integer",
                                "description": "ÐŸÐµÑ€Ð¸Ð¾Ð´ Ð² Ð´Ð½ÑÑ…",
                                "default": 7
                            }
                        },
                        "required": ["campaign_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "marketing_keywords_list",
                    "description": "Ð¡Ð¿Ð¸ÑÐ¾Ðº ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ñ… ÑÐ»Ð¾Ð² ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "campaign_id": {
                                "type": "string",
                                "description": "ID ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸"
                            },
                            "status": {
                                "type": "string",
                                "enum": ["active", "paused", "all"],
                                "description": "Ð¡Ñ‚Ð°Ñ‚ÑƒÑ ÐºÐ»ÑŽÑ‡ÐµÐ¹"
                            }
                        },
                        "required": ["campaign_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "marketing_update_bid",
                    "description": "Ð˜Ð·Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ ÑÑ‚Ð°Ð²ÐºÑƒ ÐºÐ»ÑŽÑ‡ÐµÐ²Ð¾Ð³Ð¾ ÑÐ»Ð¾Ð²Ð°",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "keyword_id": {
                                "type": "string",
                                "description": "ID ÐºÐ»ÑŽÑ‡ÐµÐ²Ð¾Ð³Ð¾ ÑÐ»Ð¾Ð²Ð°"
                            },
                            "new_bid": {
                                "type": "number",
                                "description": "ÐÐ¾Ð²Ð°Ñ ÑÑ‚Ð°Ð²ÐºÐ° Ð² Ñ€ÑƒÐ±Ð»ÑÑ…"
                            }
                        },
                        "required": ["keyword_id", "new_bid"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "marketing_pause_keyword",
                    "description": "ÐŸÑ€Ð¸Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²Ð¸Ñ‚ÑŒ ÐºÐ»ÑŽÑ‡ÐµÐ²Ð¾Ðµ ÑÐ»Ð¾Ð²Ð¾",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "keyword_id": {
                                "type": "string",
                                "description": "ID ÐºÐ»ÑŽÑ‡ÐµÐ²Ð¾Ð³Ð¾ ÑÐ»Ð¾Ð²Ð°"
                            }
                        },
                        "required": ["keyword_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "marketing_resume_keyword",
                    "description": "Ð’Ð¾Ð·Ð¾Ð±Ð½Ð¾Ð²Ð¸Ñ‚ÑŒ ÐºÐ»ÑŽÑ‡ÐµÐ²Ð¾Ðµ ÑÐ»Ð¾Ð²Ð¾",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "keyword_id": {
                                "type": "string",
                                "description": "ID ÐºÐ»ÑŽÑ‡ÐµÐ²Ð¾Ð³Ð¾ ÑÐ»Ð¾Ð²Ð°"
                            }
                        },
                        "required": ["keyword_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "marketing_alerts_list",
                    "description": "Ð¡Ð¿Ð¸ÑÐ¾Ðº Ð°Ð»ÐµÑ€Ñ‚Ð¾Ð²",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "status": {
                                "type": "string",
                                "enum": ["unread", "all"],
                                "description": "Ð¡Ñ‚Ð°Ñ‚ÑƒÑ Ð°Ð»ÐµÑ€Ñ‚Ð¾Ð²"
                            }
                        }
                    }
                }
            }
        ]
        
        # Ð Ð°ÑÑˆÐ¸Ñ€ÐµÐ½Ð½Ñ‹Ðµ tools Ð´Ð»Ñ Senior+
        senior_tools = [
            {
                "type": "function",
                "function": {
                    "name": "marketing_update_strategy",
                    "description": "Ð˜Ð·Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸ÑŽ Ð±Ð¸Ð´Ð´Ð¸Ð½Ð³Ð°",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "campaign_id": {
                                "type": "string",
                                "description": "ID ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸"
                            },
                            "strategy": {
                                "type": "string",
                                "enum": ["position_hold", "min_price", "aggressive", "roi_optimize"],
                                "description": "Ð¡Ñ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ñ"
                            },
                            "target_position": {
                                "type": "integer",
                                "description": "Ð¦ÐµÐ»ÐµÐ²Ð°Ñ Ð¿Ð¾Ð·Ð¸Ñ†Ð¸Ñ (Ð´Ð»Ñ position_hold)"
                            },
                            "target_drr": {
                                "type": "number",
                                "description": "Ð¦ÐµÐ»ÐµÐ²Ð¾Ð¹ Ð”Ð Ð  % (Ð´Ð»Ñ roi_optimize)"
                            }
                        },
                        "required": ["campaign_id", "strategy"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "marketing_update_limits",
                    "description": "Ð˜Ð·Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ Ð»Ð¸Ð¼Ð¸Ñ‚Ñ‹ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "campaign_id": {
                                "type": "string",
                                "description": "ID ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸"
                            },
                            "max_bid": {
                                "type": "number",
                                "description": "ÐœÐ°ÐºÑÐ¸Ð¼Ð°Ð»ÑŒÐ½Ð°Ñ ÑÑ‚Ð°Ð²ÐºÐ°"
                            },
                            "daily_limit": {
                                "type": "number",
                                "description": "Ð”Ð½ÐµÐ²Ð½Ð¾Ð¹ Ð±ÑŽÐ´Ð¶ÐµÑ‚"
                            }
                        },
                        "required": ["campaign_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "marketing_summary_report",
                    "description": "Ð¡Ð²Ð¾Ð´Ð½Ñ‹Ð¹ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚ Ð¿Ð¾ Ñ€ÐµÐºÐ»Ð°Ð¼Ðµ",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "period_days": {
                                "type": "integer",
                                "description": "ÐŸÐµÑ€Ð¸Ð¾Ð´ Ð² Ð´Ð½ÑÑ…",
                                "default": 7
                            },
                            "group_by": {
                                "type": "string",
                                "enum": ["marketplace", "brand", "campaign"],
                                "description": "Ð“Ñ€ÑƒÐ¿Ð¿Ð¸Ñ€Ð¾Ð²ÐºÐ°"
                            }
                        }
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "marketing_ai_recommendations",
                    "description": "AI-Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸ Ð¿Ð¾ Ð¾Ð¿Ñ‚Ð¸Ð¼Ð¸Ð·Ð°Ñ†Ð¸Ð¸",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "campaign_id": {
                                "type": "string",
                                "description": "ID ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸ (Ð¾Ð¿Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾)"
                            }
                        }
                    }
                }
            }
        ]
        
        # Admin tools
        admin_tools = [
            {
                "type": "function",
                "function": {
                    "name": "marketing_safety_settings",
                    "description": "ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ Safety Logic",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "action": {
                                "type": "string",
                                "enum": ["get", "update"],
                                "description": "Ð”ÐµÐ¹ÑÑ‚Ð²Ð¸Ðµ"
                            },
                            "settings": {
                                "type": "object",
                                "description": "ÐÐ¾Ð²Ñ‹Ðµ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ (Ð´Ð»Ñ update)"
                            }
                        },
                        "required": ["action"]
                    }
                }
            }
        ]
        
        tools = base_tools.copy()
        
        if role in ("senior", "director", "administrator"):
            tools.extend(senior_tools)
        
        if role == "administrator":
            tools.extend(admin_tools)
        
        return tools
    
    def _get_default_buttons(self, role: str) -> List[dict]:
        """ÐšÐ½Ð¾Ð¿ÐºÐ¸ Ð¿Ð¾ ÑƒÐ¼Ð¾Ð»Ñ‡Ð°Ð½Ð¸ÑŽ Ð´Ð»Ñ Ñ€Ð¾Ð»Ð¸."""
        
        buttons = [
            {
                "label": "ðŸ“Š ÐœÐ¾Ð¸ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸",
                "action": "marketing_campaigns_list",
                "params": {"status": "active"}
            },
            {
                "label": "ðŸ”” ÐÐ»ÐµÑ€Ñ‚Ñ‹",
                "action": "marketing_alerts_list",
                "params": {"status": "unread"}
            }
        ]
        
        if role in ("senior", "director", "administrator"):
            buttons.extend([
                {
                    "label": "ðŸ“ˆ Ð¡Ð²Ð¾Ð´Ð½Ñ‹Ð¹ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚",
                    "action": "marketing_summary_report",
                    "params": {"period_days": 7}
                },
                {
                    "label": "ðŸ’¡ AI-Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸",
                    "action": "marketing_ai_recommendations",
                    "params": {}
                }
            ])
        
        return buttons
```

---

## 4.3 Marketing Tools

### 4.3.1 Ð¡Ð¿Ð¸ÑÐ¾Ðº Tools

| Tool | ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ | Ð Ð¾Ð»Ð¸ |
|------|----------|------|
| `marketing_campaigns_list` | Ð¡Ð¿Ð¸ÑÐ¾Ðº ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¹ | Manager+ |
| `marketing_campaign_stats` | Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ° ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸ | Manager+ |
| `marketing_keywords_list` | ÐšÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ðµ ÑÐ»Ð¾Ð²Ð° ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸ | Manager+ |
| `marketing_update_bid` | Ð˜Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²ÐºÐ¸ | Manager+ |
| `marketing_pause_keyword` | ÐŸÐ°ÑƒÐ·Ð° ÐºÐ»ÑŽÑ‡Ð° | Manager+ |
| `marketing_resume_keyword` | Ð’Ð¾Ð·Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÐºÐ»ÑŽÑ‡Ð° | Manager+ |
| `marketing_alerts_list` | Ð¡Ð¿Ð¸ÑÐ¾Ðº Ð°Ð»ÐµÑ€Ñ‚Ð¾Ð² | Manager+ |
| `marketing_pause_campaign` | ÐŸÐ°ÑƒÐ·Ð° ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸ | Manager+ |
| `marketing_resume_campaign` | Ð’Ð¾Ð·Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸ | Manager+ |
| `marketing_update_strategy` | Ð˜Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ð¸ | Senior+ |
| `marketing_update_limits` | Ð˜Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ Ð»Ð¸Ð¼Ð¸Ñ‚Ð¾Ð² | Senior+ |
| `marketing_summary_report` | Ð¡Ð²Ð¾Ð´Ð½Ñ‹Ð¹ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚ | Senior+ |
| `marketing_ai_recommendations` | AI-Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸ | Senior+ |
| `marketing_safety_settings` | ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ Safety Logic | Admin |

### 4.3.2 Tool: marketing_campaigns_list

```python
# tools/marketing_campaigns.py
"""
title: Marketing Campaigns Tools
author: Adolf Team
version: 1.0.0
"""

from typing import Callable, Any, Optional, List
from pydantic import BaseModel, Field
import requests


class Valves(BaseModel):
    MIDDLEWARE_URL: str = Field(default="http://middleware:8000")
    MIDDLEWARE_API_KEY: str = Field(default="")


class Tools:
    """Ð˜Ð½ÑÑ‚Ñ€ÑƒÐ¼ÐµÐ½Ñ‚Ñ‹ Ð´Ð»Ñ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹ Ñ Ñ€ÐµÐºÐ»Ð°Ð¼Ð½Ñ‹Ð¼Ð¸ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸ÑÐ¼Ð¸."""
    
    def __init__(self):
        self.valves = Valves()
    
    def marketing_campaigns_list(
        self,
        marketplace: str = "all",
        status: str = "active",
        __user__: dict = {},
        __event_emitter__: Callable[[dict], Any] = None
    ) -> str:
        """
        ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÐ¿Ð¸ÑÐºÐ° Ñ€ÐµÐºÐ»Ð°Ð¼Ð½Ñ‹Ñ… ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¹.
        
        Args:
            marketplace: ÐœÐ°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹Ñ (wb, ozon, ym, all)
            status: Ð¡Ñ‚Ð°Ñ‚ÑƒÑ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¹ (active, paused, all)
        """
        if __event_emitter__:
            __event_emitter__({
                "type": "status",
                "data": {"description": "Ð—Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¹...", "done": False}
            })
        
        try:
            params = {"status": status}
            if marketplace != "all":
                params["marketplace"] = marketplace
            
            response = requests.get(
                f"{self.valves.MIDDLEWARE_URL}/api/v1/marketing/campaigns",
                headers=self._get_headers(__user__),
                params=params
            )
            
            campaigns = response.json()
            
            if __event_emitter__:
                __event_emitter__({
                    "type": "status",
                    "data": {"description": f"ÐÐ°Ð¹Ð´ÐµÐ½Ð¾ {len(campaigns)} ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¹", "done": True}
                })
            
            if not campaigns:
                return "ÐÐµÑ‚ Ñ€ÐµÐºÐ»Ð°Ð¼Ð½Ñ‹Ñ… ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¹ Ð¿Ð¾ Ð·Ð°Ð´Ð°Ð½Ð½Ñ‹Ð¼ ÐºÑ€Ð¸Ñ‚ÐµÑ€Ð¸ÑÐ¼."
            
            return self._format_campaigns_list(campaigns)
            
        except Exception as e:
            return f"ÐžÑˆÐ¸Ð±ÐºÐ° Ð¿Ñ€Ð¸ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐµ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¹: {str(e)}"
    
    def marketing_campaign_stats(
        self,
        campaign_id: str,
        period_days: int = 7,
        __user__: dict = {},
        __event_emitter__: Callable[[dict], Any] = None
    ) -> str:
        """
        ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ¸ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸.
        
        Args:
            campaign_id: ID ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸
            period_days: ÐŸÐµÑ€Ð¸Ð¾Ð´ Ð² Ð´Ð½ÑÑ…
        """
        if __event_emitter__:
            __event_emitter__({
                "type": "status",
                "data": {"description": f"Ð—Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ¸ Ð·Ð° {period_days} Ð´Ð½ÐµÐ¹...", "done": False}
            })
        
        try:
            response = requests.get(
                f"{self.valves.MIDDLEWARE_URL}/api/v1/marketing/campaigns/{campaign_id}/stats",
                headers=self._get_headers(__user__),
                params={"period_days": period_days}
            )
            
            if response.status_code == 404:
                return f"ÐšÐ°Ð¼Ð¿Ð°Ð½Ð¸Ñ {campaign_id} Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½Ð°."
            
            data = response.json()
            
            if __event_emitter__:
                __event_emitter__({
                    "type": "status",
                    "data": {"description": "Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ° Ð·Ð°Ð³Ñ€ÑƒÐ¶ÐµÐ½Ð°", "done": True}
                })
            
            return self._format_campaign_stats(data)
            
        except Exception as e:
            return f"ÐžÑˆÐ¸Ð±ÐºÐ°: {str(e)}"
    
    def marketing_pause_campaign(
        self,
        campaign_id: str,
        __user__: dict = {},
        __event_emitter__: Callable[[dict], Any] = None
    ) -> str:
        """
        ÐŸÑ€Ð¸Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²Ð¸Ñ‚ÑŒ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸ÑŽ.
        
        Args:
            campaign_id: ID ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸
        """
        if __event_emitter__:
            __event_emitter__({
                "type": "status",
                "data": {"description": "ÐŸÑ€Ð¸Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐ° ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸...", "done": False}
            })
        
        try:
            response = requests.post(
                f"{self.valves.MIDDLEWARE_URL}/api/v1/marketing/campaigns/{campaign_id}/pause",
                headers=self._get_headers(__user__)
            )
            
            if response.status_code == 200:
                if __event_emitter__:
                    __event_emitter__({
                        "type": "status",
                        "data": {"description": "âœ… ÐšÐ°Ð¼Ð¿Ð°Ð½Ð¸Ñ Ð¿Ñ€Ð¸Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð°", "done": True}
                    })
                return f"âœ… ÐšÐ°Ð¼Ð¿Ð°Ð½Ð¸Ñ **{campaign_id}** Ð¿Ñ€Ð¸Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð°."
            else:
                error = response.json().get("detail", "ÐÐµÐ¸Ð·Ð²ÐµÑÑ‚Ð½Ð°Ñ Ð¾ÑˆÐ¸Ð±ÐºÐ°")
                return f"âŒ ÐžÑˆÐ¸Ð±ÐºÐ°: {error}"
                
        except Exception as e:
            return f"âŒ ÐžÑˆÐ¸Ð±ÐºÐ°: {str(e)}"
    
    def marketing_resume_campaign(
        self,
        campaign_id: str,
        __user__: dict = {},
        __event_emitter__: Callable[[dict], Any] = None
    ) -> str:
        """
        Ð’Ð¾Ð·Ð¾Ð±Ð½Ð¾Ð²Ð¸Ñ‚ÑŒ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸ÑŽ.
        
        Args:
            campaign_id: ID ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸
        """
        if __event_emitter__:
            __event_emitter__({
                "type": "status",
                "data": {"description": "Ð’Ð¾Ð·Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸...", "done": False}
            })
        
        try:
            response = requests.post(
                f"{self.valves.MIDDLEWARE_URL}/api/v1/marketing/campaigns/{campaign_id}/resume",
                headers=self._get_headers(__user__)
            )
            
            if response.status_code == 200:
                if __event_emitter__:
                    __event_emitter__({
                        "type": "status",
                        "data": {"description": "âœ… ÐšÐ°Ð¼Ð¿Ð°Ð½Ð¸Ñ Ð²Ð¾Ð·Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð°", "done": True}
                    })
                return f"âœ… ÐšÐ°Ð¼Ð¿Ð°Ð½Ð¸Ñ **{campaign_id}** Ð²Ð¾Ð·Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð°."
            else:
                error = response.json().get("detail", "ÐÐµÐ¸Ð·Ð²ÐµÑÑ‚Ð½Ð°Ñ Ð¾ÑˆÐ¸Ð±ÐºÐ°")
                return f"âŒ ÐžÑˆÐ¸Ð±ÐºÐ°: {error}"
                
        except Exception as e:
            return f"âŒ ÐžÑˆÐ¸Ð±ÐºÐ°: {str(e)}"
    
    def _get_headers(self, user: dict) -> dict:
        """Ð¤Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð·Ð°Ð³Ð¾Ð»Ð¾Ð²ÐºÐ¾Ð² Ð·Ð°Ð¿Ñ€Ð¾ÑÐ°."""
        return {
            "Authorization": f"Bearer {self.valves.MIDDLEWARE_API_KEY}",
            "X-User-ID": str(user.get("id")),
            "X-User-Role": user.get("role", "staff"),
            "X-User-Brand": user.get("valves", {}).get("brand_id", "all")
        }
    
    def _format_campaigns_list(self, campaigns: List[dict]) -> str:
        """Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ ÑÐ¿Ð¸ÑÐºÐ° ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¹."""
        
        output = "**ðŸ“Š Ð ÐµÐºÐ»Ð°Ð¼Ð½Ñ‹Ðµ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸:**\n\n"
        
        # Ð“Ñ€ÑƒÐ¿Ð¿Ð¸Ñ€Ð¾Ð²ÐºÐ° Ð¿Ð¾ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°Ð¼
        by_mp = {}
        for c in campaigns:
            mp = c.get("marketplace", "unknown")
            if mp not in by_mp:
                by_mp[mp] = []
            by_mp[mp].append(c)
        
        mp_icons = {"wb": "ðŸŸ£", "ozon": "ðŸ”µ", "ym": "ðŸŸ¡"}
        status_icons = {"active": "ðŸŸ¢", "paused": "â¸ï¸", "error": "ðŸ”´"}
        
        for mp, mp_campaigns in by_mp.items():
            output += f"\n### {mp_icons.get(mp, 'âšª')} {mp.upper()}\n\n"
            
            for c in mp_campaigns:
                status_icon = status_icons.get(c.get("status"), "â“")
                
                output += f"---\n"
                output += f"{status_icon} **{c.get('name', 'Ð‘ÐµÐ· Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ñ')}**\n"
                output += f"ID: `{c.get('id')}` | Ð¢Ð¸Ð¿: {c.get('campaign_type')}\n"
                output += f"Ð‘ÑŽÐ´Ð¶ÐµÑ‚: {c.get('daily_limit', 0):,.0f} â‚½/Ð´ÐµÐ½ÑŒ | "
                output += f"Max Bid: {c.get('max_bid', 0):,.0f} â‚½\n"
                
                stats = c.get("today_stats", {})
                output += f"Ð¡ÐµÐ³Ð¾Ð´Ð½Ñ: {stats.get('spent', 0):,.0f} â‚½ | "
                output += f"CTR: {stats.get('ctr', 0):.2f}% | "
                output += f"Ð”Ð Ð : {stats.get('drr', 0):.1f}%\n"
                
                output += f"\n`[Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ°: marketing_campaign_stats(\"{c.get('id')}\")]`\n"
        
        return output
    
    def _format_campaign_stats(self, data: dict) -> str:
        """Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ¸ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸."""
        
        campaign = data.get("campaign", {})
        stats = data.get("stats", {})
        keywords = data.get("top_keywords", [])
        
        output = f"**ðŸ“ˆ Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ° ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸: {campaign.get('name')}**\n\n"
        output += f"ÐœÐ°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹Ñ: {campaign.get('marketplace', '').upper()}\n"
        output += f"Ð¡Ñ‚Ð°Ñ‚ÑƒÑ: {campaign.get('status')}\n"
        output += f"Ð¡Ñ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ñ: {campaign.get('strategy')}\n\n"
        
        output += "### ÐœÐµÑ‚Ñ€Ð¸ÐºÐ¸ Ð·Ð° Ð¿ÐµÑ€Ð¸Ð¾Ð´\n\n"
        output += f"| ÐœÐµÑ‚Ñ€Ð¸ÐºÐ° | Ð—Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ |\n"
        output += f"|---------|----------|\n"
        output += f"| ÐŸÐ¾ÐºÐ°Ð·Ñ‹ | {stats.get('views', 0):,} |\n"
        output += f"| ÐšÐ»Ð¸ÐºÐ¸ | {stats.get('clicks', 0):,} |\n"
        output += f"| CTR | {stats.get('ctr', 0):.2f}% |\n"
        output += f"| Ð Ð°ÑÑ…Ð¾Ð´ | {stats.get('spent', 0):,.0f} â‚½ |\n"
        output += f"| CPC | {stats.get('cpc', 0):.2f} â‚½ |\n"
        output += f"| Ð—Ð°ÐºÐ°Ð·Ñ‹ | {stats.get('orders', 0):,} |\n"
        output += f"| Ð’Ñ‹Ñ€ÑƒÑ‡ÐºÐ° | {stats.get('revenue', 0):,.0f} â‚½ |\n"
        output += f"| CPO | {stats.get('cpo', 0):.0f} â‚½ |\n"
        output += f"| Ð”Ð Ð  | {stats.get('drr', 0):.1f}% |\n\n"
        
        if keywords:
            output += "### Ð¢Ð¾Ð¿-5 ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ñ… ÑÐ»Ð¾Ð²\n\n"
            output += "| ÐšÐ»ÑŽÑ‡ | Ð¡Ñ‚Ð°Ð²ÐºÐ° | CTR | Ð”Ð Ð  |\n"
            output += "|------|--------|-----|-----|\n"
            
            for kw in keywords[:5]:
                output += f"| {kw.get('keyword', '')[:20]} | "
                output += f"{kw.get('current_bid', 0):.0f} â‚½ | "
                output += f"{kw.get('ctr', 0):.2f}% | "
                output += f"{kw.get('drr', 0):.1f}% |\n"
        
        return output
```

### 4.3.3 Tool: marketing_keywords

```python
# tools/marketing_keywords.py
"""
title: Marketing Keywords Tools
author: Adolf Team
version: 1.0.0
"""

from typing import Callable, Any, Optional, List
from pydantic import BaseModel, Field
import requests


class Valves(BaseModel):
    MIDDLEWARE_URL: str = Field(default="http://middleware:8000")
    MIDDLEWARE_API_KEY: str = Field(default="")


class Tools:
    """Ð˜Ð½ÑÑ‚Ñ€ÑƒÐ¼ÐµÐ½Ñ‚Ñ‹ Ð´Ð»Ñ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹ Ñ ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ð¼Ð¸ ÑÐ»Ð¾Ð²Ð°Ð¼Ð¸."""
    
    def __init__(self):
        self.valves = Valves()
    
    def marketing_keywords_list(
        self,
        campaign_id: str,
        status: str = "all",
        __user__: dict = {},
        __event_emitter__: Callable[[dict], Any] = None
    ) -> str:
        """
        ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÐ¿Ð¸ÑÐºÐ° ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ñ… ÑÐ»Ð¾Ð² ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸.
        
        Args:
            campaign_id: ID ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸
            status: Ð¡Ñ‚Ð°Ñ‚ÑƒÑ ÐºÐ»ÑŽÑ‡ÐµÐ¹ (active, paused, all)
        """
        if __event_emitter__:
            __event_emitter__({
                "type": "status",
                "data": {"description": "Ð—Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ñ… ÑÐ»Ð¾Ð²...", "done": False}
            })
        
        try:
            response = requests.get(
                f"{self.valves.MIDDLEWARE_URL}/api/v1/marketing/campaigns/{campaign_id}/keywords",
                headers=self._get_headers(__user__),
                params={"status": status}
            )
            
            keywords = response.json()
            
            if __event_emitter__:
                __event_emitter__({
                    "type": "status",
                    "data": {"description": f"ÐÐ°Ð¹Ð´ÐµÐ½Ð¾ {len(keywords)} ÐºÐ»ÑŽÑ‡ÐµÐ¹", "done": True}
                })
            
            if not keywords:
                return "ÐÐµÑ‚ ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ñ… ÑÐ»Ð¾Ð² Ð² ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸."
            
            return self._format_keywords_list(keywords, campaign_id)
            
        except Exception as e:
            return f"ÐžÑˆÐ¸Ð±ÐºÐ°: {str(e)}"
    
    def marketing_update_bid(
        self,
        keyword_id: str,
        new_bid: float,
        __user__: dict = {},
        __event_emitter__: Callable[[dict], Any] = None
    ) -> str:
        """
        Ð˜Ð·Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ ÑÑ‚Ð°Ð²ÐºÑƒ ÐºÐ»ÑŽÑ‡ÐµÐ²Ð¾Ð³Ð¾ ÑÐ»Ð¾Ð²Ð°.
        
        Args:
            keyword_id: ID ÐºÐ»ÑŽÑ‡ÐµÐ²Ð¾Ð³Ð¾ ÑÐ»Ð¾Ð²Ð°
            new_bid: ÐÐ¾Ð²Ð°Ñ ÑÑ‚Ð°Ð²ÐºÐ° Ð² Ñ€ÑƒÐ±Ð»ÑÑ…
        """
        if __event_emitter__:
            __event_emitter__({
                "type": "status",
                "data": {"description": f"ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²ÐºÐ¸ Ð½Ð° {new_bid} â‚½...", "done": False}
            })
        
        try:
            response = requests.put(
                f"{self.valves.MIDDLEWARE_URL}/api/v1/marketing/keywords/{keyword_id}/bid",
                headers=self._get_headers(__user__),
                json={"new_bid": new_bid}
            )
            
            if response.status_code == 200:
                data = response.json()
                old_bid = data.get("old_bid", 0)
                
                if __event_emitter__:
                    __event_emitter__({
                        "type": "status",
                        "data": {"description": "âœ… Ð¡Ñ‚Ð°Ð²ÐºÐ° Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð°", "done": True}
                    })
                
                diff = new_bid - old_bid
                diff_sign = "+" if diff > 0 else ""
                
                return f"âœ… Ð¡Ñ‚Ð°Ð²ÐºÐ° Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð°: **{old_bid:.0f} â‚½** â†’ **{new_bid:.0f} â‚½** ({diff_sign}{diff:.0f} â‚½)"
            
            elif response.status_code == 400:
                error = response.json()
                if error.get("code") == "BID_EXCEEDS_MAX":
                    return f"âŒ Ð¡Ñ‚Ð°Ð²ÐºÐ° {new_bid} â‚½ Ð¿Ñ€ÐµÐ²Ñ‹ÑˆÐ°ÐµÑ‚ Ð¼Ð°ÐºÑÐ¸Ð¼ÑƒÐ¼ ({error.get('max_bid')} â‚½)"
                return f"âŒ ÐžÑˆÐ¸Ð±ÐºÐ°: {error.get('detail')}"
            
            elif response.status_code == 403:
                return "âŒ ÐÐµÑ‚ Ð¿Ñ€Ð°Ð² Ð½Ð° Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²ÐºÐ¸"
            
            else:
                return f"âŒ ÐžÑˆÐ¸Ð±ÐºÐ°: {response.json().get('detail', 'ÐÐµÐ¸Ð·Ð²ÐµÑÑ‚Ð½Ð°Ñ Ð¾ÑˆÐ¸Ð±ÐºÐ°')}"
                
        except Exception as e:
            return f"âŒ ÐžÑˆÐ¸Ð±ÐºÐ°: {str(e)}"
    
    def marketing_pause_keyword(
        self,
        keyword_id: str,
        __user__: dict = {},
        __event_emitter__: Callable[[dict], Any] = None
    ) -> str:
        """
        ÐŸÑ€Ð¸Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²Ð¸Ñ‚ÑŒ ÐºÐ»ÑŽÑ‡ÐµÐ²Ð¾Ðµ ÑÐ»Ð¾Ð²Ð¾.
        
        Args:
            keyword_id: ID ÐºÐ»ÑŽÑ‡ÐµÐ²Ð¾Ð³Ð¾ ÑÐ»Ð¾Ð²Ð°
        """
        if __event_emitter__:
            __event_emitter__({
                "type": "status",
                "data": {"description": "ÐŸÑ€Ð¸Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐ° ÐºÐ»ÑŽÑ‡Ð°...", "done": False}
            })
        
        try:
            response = requests.post(
                f"{self.valves.MIDDLEWARE_URL}/api/v1/marketing/keywords/{keyword_id}/pause",
                headers=self._get_headers(__user__)
            )
            
            if response.status_code == 200:
                if __event_emitter__:
                    __event_emitter__({
                        "type": "status",
                        "data": {"description": "âœ… ÐšÐ»ÑŽÑ‡ Ð¿Ñ€Ð¸Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½", "done": True}
                    })
                return f"âœ… ÐšÐ»ÑŽÑ‡ÐµÐ²Ð¾Ðµ ÑÐ»Ð¾Ð²Ð¾ **{keyword_id}** Ð¿Ñ€Ð¸Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð¾."
            else:
                return f"âŒ ÐžÑˆÐ¸Ð±ÐºÐ°: {response.json().get('detail')}"
                
        except Exception as e:
            return f"âŒ ÐžÑˆÐ¸Ð±ÐºÐ°: {str(e)}"
    
    def marketing_resume_keyword(
        self,
        keyword_id: str,
        __user__: dict = {},
        __event_emitter__: Callable[[dict], Any] = None
    ) -> str:
        """
        Ð’Ð¾Ð·Ð¾Ð±Ð½Ð¾Ð²Ð¸Ñ‚ÑŒ ÐºÐ»ÑŽÑ‡ÐµÐ²Ð¾Ðµ ÑÐ»Ð¾Ð²Ð¾.
        
        Args:
            keyword_id: ID ÐºÐ»ÑŽÑ‡ÐµÐ²Ð¾Ð³Ð¾ ÑÐ»Ð¾Ð²Ð°
        """
        if __event_emitter__:
            __event_emitter__({
                "type": "status",
                "data": {"description": "Ð’Ð¾Ð·Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÐºÐ»ÑŽÑ‡Ð°...", "done": False}
            })
        
        try:
            response = requests.post(
                f"{self.valves.MIDDLEWARE_URL}/api/v1/marketing/keywords/{keyword_id}/resume",
                headers=self._get_headers(__user__)
            )
            
            if response.status_code == 200:
                if __event_emitter__:
                    __event_emitter__({
                        "type": "status",
                        "data": {"description": "âœ… ÐšÐ»ÑŽÑ‡ Ð²Ð¾Ð·Ð¾Ð±Ð½Ð¾Ð²Ð»Ñ‘Ð½", "done": True}
                    })
                return f"âœ… ÐšÐ»ÑŽÑ‡ÐµÐ²Ð¾Ðµ ÑÐ»Ð¾Ð²Ð¾ **{keyword_id}** Ð²Ð¾Ð·Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¾."
            else:
                return f"âŒ ÐžÑˆÐ¸Ð±ÐºÐ°: {response.json().get('detail')}"
                
        except Exception as e:
            return f"âŒ ÐžÑˆÐ¸Ð±ÐºÐ°: {str(e)}"
    
    def _get_headers(self, user: dict) -> dict:
        return {
            "Authorization": f"Bearer {self.valves.MIDDLEWARE_API_KEY}",
            "X-User-ID": str(user.get("id")),
            "X-User-Role": user.get("role", "staff"),
            "X-User-Brand": user.get("valves", {}).get("brand_id", "all")
        }
    
    def _format_keywords_list(self, keywords: List[dict], campaign_id: str) -> str:
        """Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ ÑÐ¿Ð¸ÑÐºÐ° ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ñ… ÑÐ»Ð¾Ð²."""
        
        output = f"**ðŸ”‘ ÐšÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ðµ ÑÐ»Ð¾Ð²Ð° ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸ {campaign_id}:**\n\n"
        
        status_icons = {"active": "ðŸŸ¢", "paused": "â¸ï¸", "rejected": "ðŸ”´"}
        
        output += "| Ð¡Ñ‚Ð°Ñ‚ÑƒÑ | ÐšÐ»ÑŽÑ‡ | Ð¡Ñ‚Ð°Ð²ÐºÐ° | CTR | Ð”Ð Ð  | Ð”ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ |\n"
        output += "|--------|------|--------|-----|-----|----------|\n"
        
        for kw in keywords:
            status = kw.get("status", "unknown")
            icon = status_icons.get(status, "â“")
            keyword_text = kw.get("keyword", "")[:25]
            
            output += f"| {icon} | {keyword_text} | "
            output += f"{kw.get('current_bid', 0):.0f} â‚½ | "
            output += f"{kw.get('ctr', 0):.2f}% | "
            output += f"{kw.get('drr', 0):.1f}% | "
            
            if status == "active":
                output += f"â¸ï¸ `pause` "
            else:
                output += f"â–¶ï¸ `resume` "
            
            output += "|\n"
        
        output += "\n_Ð”Ð»Ñ Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ñ ÑÑ‚Ð°Ð²ÐºÐ¸: `marketing_update_bid(\"keyword_id\", Ð½Ð¾Ð²Ð°Ñ_ÑÑ‚Ð°Ð²ÐºÐ°)`_"
        
        return output
```

### 4.3.4 Tool: marketing_analytics

```python
# tools/marketing_analytics.py
"""
title: Marketing Analytics Tools
author: Adolf Team
version: 1.0.0
"""

from typing import Callable, Any, Optional
from pydantic import BaseModel, Field
import requests


class Valves(BaseModel):
    MIDDLEWARE_URL: str = Field(default="http://middleware:8000")
    MIDDLEWARE_API_KEY: str = Field(default="")


class Tools:
    """ÐÐ½Ð°Ð»Ð¸Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð¸Ð½ÑÑ‚Ñ€ÑƒÐ¼ÐµÐ½Ñ‚Ñ‹ Marketing."""
    
    def __init__(self):
        self.valves = Valves()
    
    def marketing_summary_report(
        self,
        period_days: int = 7,
        group_by: str = "marketplace",
        __user__: dict = {},
        __event_emitter__: Callable[[dict], Any] = None
    ) -> str:
        """
        Ð¡Ð²Ð¾Ð´Ð½Ñ‹Ð¹ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚ Ð¿Ð¾ Ñ€ÐµÐºÐ»Ð°Ð¼Ðµ.
        
        Args:
            period_days: ÐŸÐµÑ€Ð¸Ð¾Ð´ Ð² Ð´Ð½ÑÑ… (7, 14, 30)
            group_by: Ð“Ñ€ÑƒÐ¿Ð¿Ð¸Ñ€Ð¾Ð²ÐºÐ° (marketplace, brand, campaign)
        """
        user_role = __user__.get("role", "staff")
        
        if user_role not in ("senior", "director", "administrator"):
            return "âŒ Ð¡Ð²Ð¾Ð´Ð½Ñ‹Ðµ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ñ‹ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð´Ð»Ñ Senior, Director, Administrator."
        
        if __event_emitter__:
            __event_emitter__({
                "type": "status",
                "data": {"description": f"Ð¤Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð° Ð·Ð° {period_days} Ð´Ð½ÐµÐ¹...", "done": False}
            })
        
        try:
            response = requests.get(
                f"{self.valves.MIDDLEWARE_URL}/api/v1/marketing/reports/summary",
                headers=self._get_headers(__user__),
                params={"period_days": period_days, "group_by": group_by}
            )
            
            data = response.json()
            
            if __event_emitter__:
                __event_emitter__({
                    "type": "status",
                    "data": {"description": "ÐžÑ‚Ñ‡Ñ‘Ñ‚ ÑÑ„Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½", "done": True}
                })
            
            return self._format_summary_report(data, period_days, group_by)
            
        except Exception as e:
            return f"ÐžÑˆÐ¸Ð±ÐºÐ°: {str(e)}"
    
    def marketing_ai_recommendations(
        self,
        campaign_id: Optional[str] = None,
        __user__: dict = {},
        __event_emitter__: Callable[[dict], Any] = None
    ) -> str:
        """
        AI-Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸ Ð¿Ð¾ Ð¾Ð¿Ñ‚Ð¸Ð¼Ð¸Ð·Ð°Ñ†Ð¸Ð¸ Ñ€ÐµÐºÐ»Ð°Ð¼Ñ‹.
        
        Args:
            campaign_id: ID ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸ (Ð¾Ð¿Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾, ÐµÑÐ»Ð¸ Ð½Ðµ ÑƒÐºÐ°Ð·Ð°Ð½ â€” Ð¾Ð±Ñ‰Ð¸Ðµ Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸)
        """
        user_role = __user__.get("role", "staff")
        
        if user_role not in ("senior", "director", "administrator"):
            return "âŒ AI-Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð´Ð»Ñ Senior, Director, Administrator."
        
        if __event_emitter__:
            __event_emitter__({
                "type": "status",
                "data": {"description": "ÐÐ½Ð°Ð»Ð¸Ð· Ð´Ð°Ð½Ð½Ñ‹Ñ…...", "done": False}
            })
        
        try:
            params = {}
            if campaign_id:
                params["campaign_id"] = campaign_id
            
            response = requests.get(
                f"{self.valves.MIDDLEWARE_URL}/api/v1/marketing/ai/recommendations",
                headers=self._get_headers(__user__),
                params=params
            )
            
            data = response.json()
            
            if __event_emitter__:
                __event_emitter__({
                    "type": "status",
                    "data": {"description": "ÐÐ½Ð°Ð»Ð¸Ð· Ð·Ð°Ð²ÐµÑ€ÑˆÑ‘Ð½", "done": True}
                })
            
            return self._format_ai_recommendations(data)
            
        except Exception as e:
            return f"ÐžÑˆÐ¸Ð±ÐºÐ°: {str(e)}"
    
    def marketing_alerts_list(
        self,
        status: str = "unread",
        __user__: dict = {},
        __event_emitter__: Callable[[dict], Any] = None
    ) -> str:
        """
        Ð¡Ð¿Ð¸ÑÐ¾Ðº Ð°Ð»ÐµÑ€Ñ‚Ð¾Ð² Marketing.
        
        Args:
            status: Ð¡Ñ‚Ð°Ñ‚ÑƒÑ (unread, all)
        """
        if __event_emitter__:
            __event_emitter__({
                "type": "status",
                "data": {"description": "Ð—Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° Ð°Ð»ÐµÑ€Ñ‚Ð¾Ð²...", "done": False}
            })
        
        try:
            response = requests.get(
                f"{self.valves.MIDDLEWARE_URL}/api/v1/marketing/alerts",
                headers=self._get_headers(__user__),
                params={"status": status}
            )
            
            alerts = response.json()
            
            if __event_emitter__:
                __event_emitter__({
                    "type": "status",
                    "data": {"description": f"ÐÐ°Ð¹Ð´ÐµÐ½Ð¾ {len(alerts)} Ð°Ð»ÐµÑ€Ñ‚Ð¾Ð²", "done": True}
                })
            
            if not alerts:
                return "âœ… ÐÐµÑ‚ Ð°ÐºÑ‚Ð¸Ð²Ð½Ñ‹Ñ… Ð°Ð»ÐµÑ€Ñ‚Ð¾Ð²."
            
            return self._format_alerts_list(alerts)
            
        except Exception as e:
            return f"ÐžÑˆÐ¸Ð±ÐºÐ°: {str(e)}"
    
    def _get_headers(self, user: dict) -> dict:
        return {
            "Authorization": f"Bearer {self.valves.MIDDLEWARE_API_KEY}",
            "X-User-ID": str(user.get("id")),
            "X-User-Role": user.get("role", "staff"),
            "X-User-Brand": user.get("valves", {}).get("brand_id", "all")
        }
    
    def _format_summary_report(self, data: dict, period: int, group_by: str) -> str:
        """Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ ÑÐ²Ð¾Ð´Ð½Ð¾Ð³Ð¾ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð°."""
        
        output = f"**ðŸ“Š Ð¡Ð²Ð¾Ð´Ð½Ñ‹Ð¹ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚ Ð¿Ð¾ Ñ€ÐµÐºÐ»Ð°Ð¼Ðµ ({period} Ð´Ð½ÐµÐ¹)**\n\n"
        
        totals = data.get("totals", {})
        output += f"### ÐžÐ±Ñ‰Ð¸Ðµ Ð¿Ð¾ÐºÐ°Ð·Ð°Ñ‚ÐµÐ»Ð¸\n\n"
        output += f"| ÐœÐµÑ‚Ñ€Ð¸ÐºÐ° | Ð—Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ |\n"
        output += f"|---------|----------|\n"
        output += f"| ÐÐºÑ‚Ð¸Ð²Ð½Ñ‹Ñ… ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¹ | {totals.get('active_campaigns', 0)} |\n"
        output += f"| ÐžÐ±Ñ‰Ð¸Ð¹ Ñ€Ð°ÑÑ…Ð¾Ð´ | {totals.get('total_spent', 0):,.0f} â‚½ |\n"
        output += f"| Ð¡Ñ€ÐµÐ´Ð½Ð¸Ð¹ Ð”Ð Ð  | {totals.get('avg_drr', 0):.1f}% |\n"
        output += f"| ÐžÐ±Ñ‰Ð¸Ð¹ CTR | {totals.get('avg_ctr', 0):.2f}% |\n"
        output += f"| Ð—Ð°ÐºÐ°Ð·Ñ‹ | {totals.get('total_orders', 0):,} |\n"
        output += f"| Ð’Ñ‹Ñ€ÑƒÑ‡ÐºÐ° | {totals.get('total_revenue', 0):,.0f} â‚½ |\n\n"
        
        # Ð”Ð°Ð½Ð½Ñ‹Ðµ Ð¿Ð¾ Ð³Ñ€ÑƒÐ¿Ð¿Ð°Ð¼
        groups = data.get("groups", [])
        if groups:
            output += f"### ÐŸÐ¾ {group_by}\n\n"
            output += "| Ð“Ñ€ÑƒÐ¿Ð¿Ð° | Ð Ð°ÑÑ…Ð¾Ð´ | Ð”Ð Ð  | CTR | Ð—Ð°ÐºÐ°Ð·Ñ‹ |\n"
            output += "|--------|--------|-----|-----|--------|\n"
            
            for g in groups:
                output += f"| {g.get('name', '-')} | "
                output += f"{g.get('spent', 0):,.0f} â‚½ | "
                output += f"{g.get('drr', 0):.1f}% | "
                output += f"{g.get('ctr', 0):.2f}% | "
                output += f"{g.get('orders', 0):,} |\n"
        
        return output
    
    def _format_ai_recommendations(self, data: dict) -> str:
        """Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ AI-Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¹."""
        
        output = "**ðŸ’¡ AI-Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸ Ð¿Ð¾ Ð¾Ð¿Ñ‚Ð¸Ð¼Ð¸Ð·Ð°Ñ†Ð¸Ð¸**\n\n"
        
        recommendations = data.get("recommendations", [])
        
        if not recommendations:
            output += "_ÐÐµÑ‚ ÐºÑ€Ð¸Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ñ… Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¹. ÐšÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸ Ñ€Ð°Ð±Ð¾Ñ‚Ð°ÑŽÑ‚ ÑÑ„Ñ„ÐµÐºÑ‚Ð¸Ð²Ð½Ð¾._"
            return output
        
        priority_icons = {"high": "ðŸ”´", "medium": "ðŸŸ¡", "low": "ðŸŸ¢"}
        
        for i, rec in enumerate(recommendations, 1):
            priority = rec.get("priority", "low")
            icon = priority_icons.get(priority, "âšª")
            
            output += f"---\n"
            output += f"{icon} **{i}. {rec.get('title')}**\n\n"
            output += f"{rec.get('description')}\n\n"
            output += f"**Ð”ÐµÐ¹ÑÑ‚Ð²Ð¸Ðµ:** {rec.get('action')}\n"
            output += f"**ÐžÐ¶Ð¸Ð´Ð°ÐµÐ¼Ñ‹Ð¹ ÑÑ„Ñ„ÐµÐºÑ‚:** {rec.get('expected_effect')}\n"
            
            if rec.get("risks"):
                output += f"**Ð Ð¸ÑÐºÐ¸:** {rec.get('risks')}\n"
            
            output += "\n"
        
        return output
    
    def _format_alerts_list(self, alerts: list) -> str:
        """Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ ÑÐ¿Ð¸ÑÐºÐ° Ð°Ð»ÐµÑ€Ñ‚Ð¾Ð²."""
        
        output = "**ðŸ”” ÐÐ»ÐµÑ€Ñ‚Ñ‹ Marketing**\n\n"
        
        severity_icons = {"critical": "ðŸ”´", "warning": "ðŸŸ¡", "info": "ðŸ”µ"}
        
        for alert in alerts:
            severity = alert.get("severity", "info")
            icon = severity_icons.get(severity, "âšª")
            
            output += f"---\n"
            output += f"{icon} **{alert.get('title')}**\n"
            output += f"ÐšÐ°Ð¼Ð¿Ð°Ð½Ð¸Ñ: {alert.get('campaign_name')} | {alert.get('marketplace', '').upper()}\n"
            output += f"{alert.get('message')}\n"
            output += f"_Ð’Ñ€ÐµÐ¼Ñ: {alert.get('created_at')}_\n\n"
        
        return output
```

---

## 4.4 Ð˜Ð½Ñ‚ÐµÑ€Ð°ÐºÑ‚Ð¸Ð²Ð½Ñ‹Ðµ ÑÐ»ÐµÐ¼ÐµÐ½Ñ‚Ñ‹

### 4.4.1 ÐšÐ½Ð¾Ð¿ÐºÐ¸ Ð±Ñ‹ÑÑ‚Ñ€Ñ‹Ñ… Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ð¹

| ÐšÐ½Ð¾Ð¿ÐºÐ° | Ð”ÐµÐ¹ÑÑ‚Ð²Ð¸Ðµ | Ð Ð¾Ð»Ð¸ |
|--------|----------|------|
| ðŸ“Š ÐœÐ¾Ð¸ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸ | `marketing_campaigns_list` | Manager+ |
| ðŸ”” ÐÐ»ÐµÑ€Ñ‚Ñ‹ | `marketing_alerts_list` | Manager+ |
| ðŸ“ˆ Ð¡Ð²Ð¾Ð´Ð½Ñ‹Ð¹ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚ | `marketing_summary_report` | Senior+ |
| ðŸ’¡ AI-Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸ | `marketing_ai_recommendations` | Senior+ |

### 4.4.2 ÐšÐ°Ñ€Ñ‚Ð¾Ñ‡ÐºÐ° ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ ðŸŸ¢ Ð›ÐµÑ‚Ð½ÑÑ ÐºÐ¾Ð»Ð»ÐµÐºÑ†Ð¸Ñ 2026                   â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ ðŸŸ£ WB | ÐÑƒÐºÑ†Ð¸Ð¾Ð½ | ID: camp_12345           â”‚
â”‚                                            â”‚
â”‚ Ð‘ÑŽÐ´Ð¶ÐµÑ‚: 5 000 â‚½/Ð´ÐµÐ½ÑŒ  |  Max Bid: 200 â‚½   â”‚
â”‚ Ð¡Ñ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ñ: Position Hold (Ð¿Ð¾Ð·Ð¸Ñ†Ð¸Ñ 5)       â”‚
â”‚                                            â”‚
â”‚ Ð¡ÐµÐ³Ð¾Ð´Ð½Ñ:                                   â”‚
â”‚ â€¢ Ð Ð°ÑÑ…Ð¾Ð´: 3 240 â‚½ (64%)                    â”‚
â”‚ â€¢ CTR: 3.8%  |  Ð”Ð Ð : 12.5%                 â”‚
â”‚ â€¢ Ð—Ð°ÐºÐ°Ð·Ð¾Ð²: 8                               â”‚
â”‚                                            â”‚
â”‚ [ðŸ“Š Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ°] [ðŸ”‘ ÐšÐ»ÑŽÑ‡Ð¸] [â¸ï¸ ÐŸÐ°ÑƒÐ·Ð°]      â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### 4.4.3 ÐšÐ°Ñ€Ñ‚Ð¾Ñ‡ÐºÐ° ÐºÐ»ÑŽÑ‡ÐµÐ²Ð¾Ð³Ð¾ ÑÐ»Ð¾Ð²Ð°

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ ðŸŸ¢ Ð»ÐµÑ‚Ð½ÐµÐµ Ð¿Ð»Ð°Ñ‚ÑŒÐµ Ð¶ÐµÐ½ÑÐºÐ¾Ðµ                   â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ Ð¡Ñ‚Ð°Ð²ÐºÐ°: 120 â‚½  |  ÐŸÐ¾Ð·Ð¸Ñ†Ð¸Ñ: ~5              â”‚
â”‚                                            â”‚
â”‚ Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ° (7 Ð´Ð½ÐµÐ¹):                       â”‚
â”‚ â€¢ ÐŸÐ¾ÐºÐ°Ð·Ñ‹: 12 450  |  ÐšÐ»Ð¸ÐºÐ¸: 485            â”‚
â”‚ â€¢ CTR: 3.9%  |  CPC: 115 â‚½                 â”‚
â”‚ â€¢ Ð—Ð°ÐºÐ°Ð·Ñ‹: 12  |  Ð”Ð Ð : 8.2%                 â”‚
â”‚                                            â”‚
â”‚ [â¬†ï¸ +10â‚½] [â¬‡ï¸ -10â‚½] [âœï¸ Ð¡Ñ‚Ð°Ð²ÐºÐ°] [â¸ï¸ ÐŸÐ°ÑƒÐ·Ð°] â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### 4.4.4 Ð ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ ÐºÐ½Ð¾Ð¿Ð¾Ðº

```python
# tools/marketing_buttons.py

def generate_campaign_buttons(campaign: dict, user_role: str) -> list:
    """Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ ÐºÐ½Ð¾Ð¿Ð¾Ðº Ð´Ð»Ñ ÐºÐ°Ñ€Ñ‚Ð¾Ñ‡ÐºÐ¸ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸."""
    
    buttons = [
        {
            "label": "ðŸ“Š Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ°",
            "action": "marketing_campaign_stats",
            "params": {"campaign_id": campaign["id"]}
        },
        {
            "label": "ðŸ”‘ ÐšÐ»ÑŽÑ‡Ð¸",
            "action": "marketing_keywords_list",
            "params": {"campaign_id": campaign["id"]}
        }
    ]
    
    if campaign["status"] == "active":
        buttons.append({
            "label": "â¸ï¸ ÐŸÐ°ÑƒÐ·Ð°",
            "action": "marketing_pause_campaign",
            "params": {"campaign_id": campaign["id"]},
            "confirm": "ÐŸÑ€Ð¸Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²Ð¸Ñ‚ÑŒ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸ÑŽ?"
        })
    else:
        buttons.append({
            "label": "â–¶ï¸ Ð’Ð¾Ð·Ð¾Ð±Ð½Ð¾Ð²Ð¸Ñ‚ÑŒ",
            "action": "marketing_resume_campaign",
            "params": {"campaign_id": campaign["id"]}
        })
    
    if user_role in ("senior", "director", "administrator"):
        buttons.append({
            "label": "âš™ï¸ ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸",
            "action": "marketing_campaign_settings",
            "params": {"campaign_id": campaign["id"]}
        })
    
    return buttons


def generate_keyword_buttons(keyword: dict, user_role: str) -> list:
    """Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ ÐºÐ½Ð¾Ð¿Ð¾Ðº Ð´Ð»Ñ ÐºÐ°Ñ€Ñ‚Ð¾Ñ‡ÐºÐ¸ ÐºÐ»ÑŽÑ‡ÐµÐ²Ð¾Ð³Ð¾ ÑÐ»Ð¾Ð²Ð°."""
    
    current_bid = keyword.get("current_bid", 0)
    
    buttons = [
        {
            "label": "â¬†ï¸ +10â‚½",
            "action": "marketing_update_bid",
            "params": {"keyword_id": keyword["id"], "new_bid": current_bid + 10}
        },
        {
            "label": "â¬‡ï¸ -10â‚½",
            "action": "marketing_update_bid",
            "params": {"keyword_id": keyword["id"], "new_bid": max(1, current_bid - 10)}
        },
        {
            "label": "âœï¸ Ð¡Ñ‚Ð°Ð²ÐºÐ°",
            "action": "prompt",
            "prompt": f"Ð’Ð²ÐµÐ´Ð¸Ñ‚Ðµ Ð½Ð¾Ð²ÑƒÑŽ ÑÑ‚Ð°Ð²ÐºÑƒ Ð´Ð»Ñ ÐºÐ»ÑŽÑ‡Ð° '{keyword['keyword']}' (Ñ‚ÐµÐºÑƒÑ‰Ð°Ñ: {current_bid} â‚½):"
        }
    ]
    
    if keyword.get("status") == "active":
        buttons.append({
            "label": "â¸ï¸",
            "action": "marketing_pause_keyword",
            "params": {"keyword_id": keyword["id"]}
        })
    else:
        buttons.append({
            "label": "â–¶ï¸",
            "action": "marketing_resume_keyword",
            "params": {"keyword_id": keyword["id"]}
        })
    
    return buttons
```

---

## 4.5 ÐŸÑ€Ð¸Ð¼ÐµÑ€Ñ‹ Ð´Ð¸Ð°Ð»Ð¾Ð³Ð¾Ð²

### 4.5.1 ÐŸÑ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¹ (Manager)

```
ðŸ‘¤ User: ÐŸÐ¾ÐºÐ°Ð¶Ð¸ Ð¼Ð¾Ð¸ Ñ€ÐµÐºÐ»Ð°Ð¼Ð½Ñ‹Ðµ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸

ðŸ¤– Adolf Marketing: 
**ðŸ“Š Ð ÐµÐºÐ»Ð°Ð¼Ð½Ñ‹Ðµ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸:**

### ðŸŸ£ WB

---
ðŸŸ¢ **Ð›ÐµÑ‚Ð½ÑÑ ÐºÐ¾Ð»Ð»ÐµÐºÑ†Ð¸Ñ 2026**
ID: `camp_wb_001` | Ð¢Ð¸Ð¿: ÐÑƒÐºÑ†Ð¸Ð¾Ð½
Ð‘ÑŽÐ´Ð¶ÐµÑ‚: 5 000 â‚½/Ð´ÐµÐ½ÑŒ | Max Bid: 200 â‚½
Ð¡ÐµÐ³Ð¾Ð´Ð½Ñ: 3 240 â‚½ | CTR: 3.8% | Ð”Ð Ð : 12.5%

`[Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ°: marketing_campaign_stats("camp_wb_001")]`

---
ðŸŸ¢ **Ð‘Ð°Ð·Ð¾Ð²Ð°Ñ ÐºÐ¾Ð»Ð»ÐµÐºÑ†Ð¸Ñ**
ID: `camp_wb_002` | Ð¢Ð¸Ð¿: ÐÐ²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ°Ñ
Ð‘ÑŽÐ´Ð¶ÐµÑ‚: 3 000 â‚½/Ð´ÐµÐ½ÑŒ | Max Bid: 150 â‚½
Ð¡ÐµÐ³Ð¾Ð´Ð½Ñ: 1 850 â‚½ | CTR: 2.9% | Ð”Ð Ð : 15.2%

`[Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ°: marketing_campaign_stats("camp_wb_002")]`

[ðŸ“Š ÐœÐ¾Ð¸ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸] [ðŸ”” ÐÐ»ÐµÑ€Ñ‚Ñ‹]
```

### 4.5.2 Ð˜Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²ÐºÐ¸ (Manager)

```
ðŸ‘¤ User: Ð£Ð²ÐµÐ»Ð¸Ñ‡ÑŒ ÑÑ‚Ð°Ð²ÐºÑƒ Ð½Ð° ÐºÐ»ÑŽÑ‡ "Ð»ÐµÑ‚Ð½ÐµÐµ Ð¿Ð»Ð°Ñ‚ÑŒÐµ" Ð´Ð¾ 150 Ñ€ÑƒÐ±Ð»ÐµÐ¹

ðŸ¤– Adolf Marketing: 
âœ… Ð¡Ñ‚Ð°Ð²ÐºÐ° Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð°: **120 â‚½** â†’ **150 â‚½** (+30 â‚½)

ÐšÐ»ÑŽÑ‡ÐµÐ²Ð¾Ðµ ÑÐ»Ð¾Ð²Ð¾: "Ð»ÐµÑ‚Ð½ÐµÐµ Ð¿Ð»Ð°Ñ‚ÑŒÐµ Ð¶ÐµÐ½ÑÐºÐ¾Ðµ"
ÐšÐ°Ð¼Ð¿Ð°Ð½Ð¸Ñ: Ð›ÐµÑ‚Ð½ÑÑ ÐºÐ¾Ð»Ð»ÐµÐºÑ†Ð¸Ñ 2026

âš ï¸ ÐžÐ±Ñ€Ð°Ñ‚Ð¸Ñ‚Ðµ Ð²Ð½Ð¸Ð¼Ð°Ð½Ð¸Ðµ: Ð½Ð¾Ð²Ð°Ñ ÑÑ‚Ð°Ð²ÐºÐ° Ð¿Ñ€Ð¸Ð±Ð»Ð¸Ð¶Ð°ÐµÑ‚ÑÑ Ðº Max Bid (200 â‚½).

[â¬†ï¸ +10â‚½] [â¬‡ï¸ -10â‚½] [â¸ï¸ ÐŸÐ°ÑƒÐ·Ð°]
```

### 4.5.3 AI-Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸ (Senior)

```
ðŸ‘¤ User: Ð”Ð°Ð¹ Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸ Ð¿Ð¾ Ð¾Ð¿Ñ‚Ð¸Ð¼Ð¸Ð·Ð°Ñ†Ð¸Ð¸ Ñ€ÐµÐºÐ»Ð°Ð¼Ñ‹

ðŸ¤– Adolf Marketing: 
**ðŸ’¡ AI-Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸ Ð¿Ð¾ Ð¾Ð¿Ñ‚Ð¸Ð¼Ð¸Ð·Ð°Ñ†Ð¸Ð¸**

---
ðŸ”´ **1. Ð’Ñ‹ÑÐ¾ÐºÐ¸Ð¹ Ð”Ð Ð  Ð² ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸ "Ð‘Ð°Ð·Ð¾Ð²Ð°Ñ ÐºÐ¾Ð»Ð»ÐµÐºÑ†Ð¸Ñ"**

Ð”Ð Ð  ÑÐ¾ÑÑ‚Ð°Ð²Ð»ÑÐµÑ‚ 15.2%, Ñ‡Ñ‚Ð¾ Ð²Ñ‹ÑˆÐµ Ñ†ÐµÐ»ÐµÐ²Ð¾Ð³Ð¾ (10%). ÐžÑÐ½Ð¾Ð²Ð½Ð¾Ð¹ Ð²ÐºÐ»Ð°Ð´ Ð²Ð½Ð¾ÑÑÑ‚ 3 ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ñ… ÑÐ»Ð¾Ð²Ð° Ñ Ð”Ð Ð  > 20%.

**Ð”ÐµÐ¹ÑÑ‚Ð²Ð¸Ðµ:** ÐŸÑ€Ð¸Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²Ð¸Ñ‚ÑŒ ÐºÐ»ÑŽÑ‡Ð¸ "Ñ„ÑƒÑ‚Ð±Ð¾Ð»ÐºÐ° Ð¾Ð²ÐµÑ€ÑÐ°Ð¹Ð·", "Ñ…ÑƒÐ´Ð¸ Ð¶ÐµÐ½ÑÐºÐ¾Ðµ", "Ð´Ð¶Ð¸Ð½ÑÑ‹ Ð¼Ð¾Ð¼" Ð¸Ð»Ð¸ ÑÐ½Ð¸Ð·Ð¸Ñ‚ÑŒ ÑÑ‚Ð°Ð²ÐºÐ¸ Ð½Ð° 30%.
**ÐžÐ¶Ð¸Ð´Ð°ÐµÐ¼Ñ‹Ð¹ ÑÑ„Ñ„ÐµÐºÑ‚:** Ð¡Ð½Ð¸Ð¶ÐµÐ½Ð¸Ðµ Ð”Ð Ð  Ð´Ð¾ 10-11%
**Ð Ð¸ÑÐºÐ¸:** Ð’Ñ€ÐµÐ¼ÐµÐ½Ð½Ð¾Ðµ ÑÐ½Ð¸Ð¶ÐµÐ½Ð¸Ðµ Ð¿Ð¾ÐºÐ°Ð·Ð¾Ð² Ð½Ð° 15-20%

---
ðŸŸ¡ **2. ÐÐ¸Ð·ÐºÐ¸Ð¹ CTR Ð½Ð° Ð¿Ð¾Ð·Ð¸Ñ†Ð¸ÑÑ… 8-10**

5 ÐºÐ»ÑŽÑ‡ÐµÐ¹ Ð½Ð°Ñ…Ð¾Ð´ÑÑ‚ÑÑ Ð½Ð° Ð¿Ð¾Ð·Ð¸Ñ†Ð¸ÑÑ… 8-10 Ñ CTR < 2%. Ð£Ð²ÐµÐ»Ð¸Ñ‡ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²Ð¾Ðº Ð¿Ð¾Ð·Ð²Ð¾Ð»Ð¸Ñ‚ Ð·Ð°Ð½ÑÑ‚ÑŒ Ð¿Ð¾Ð·Ð¸Ñ†Ð¸Ð¸ 4-6.

**Ð”ÐµÐ¹ÑÑ‚Ð²Ð¸Ðµ:** Ð£Ð²ÐµÐ»Ð¸Ñ‡Ð¸Ñ‚ÑŒ ÑÑ‚Ð°Ð²ÐºÐ¸ Ð½Ð° 20 â‚½ Ð´Ð»Ñ ÐºÐ»ÑŽÑ‡ÐµÐ¹: "Ð¿Ð»Ð°Ñ‚ÑŒÐµ Ð¼Ð¸Ð´Ð¸", "ÑÐ°Ñ€Ð°Ñ„Ð°Ð½ Ð»ÐµÑ‚Ð½Ð¸Ð¹", "ÑŽÐ±ÐºÐ° Ð¿Ð»Ð¸ÑÑÐµ"
**ÐžÐ¶Ð¸Ð´Ð°ÐµÐ¼Ñ‹Ð¹ ÑÑ„Ñ„ÐµÐºÑ‚:** Ð Ð¾ÑÑ‚ CTR Ð´Ð¾ 3.5-4%, Ñ€Ð¾ÑÑ‚ Ð·Ð°ÐºÐ°Ð·Ð¾Ð² Ð½Ð° 25%

---
ðŸŸ¢ **3. Ð­Ñ„Ñ„ÐµÐºÑ‚Ð¸Ð²Ð½Ñ‹Ð¹ ÐºÐ»ÑŽÑ‡ Ð±ÐµÐ· Ñ€Ð¾ÑÑ‚Ð° Ð±ÑŽÐ´Ð¶ÐµÑ‚Ð°**

ÐšÐ»ÑŽÑ‡ "Ð¿Ð»Ð°Ñ‚ÑŒÐµ Ð² Ð³Ð¾Ñ€Ð¾ÑˆÐµÐº" Ð¿Ð¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÐµÑ‚ Ð”Ð Ð  5.8% Ð¿Ñ€Ð¸ CTR 4.2%. Ð•ÑÑ‚ÑŒ Ð¿Ð¾Ñ‚ÐµÐ½Ñ†Ð¸Ð°Ð» Ð´Ð»Ñ Ð¼Ð°ÑÑˆÑ‚Ð°Ð±Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ.

**Ð”ÐµÐ¹ÑÑ‚Ð²Ð¸Ðµ:** Ð£Ð²ÐµÐ»Ð¸Ñ‡Ð¸Ñ‚ÑŒ Max Bid Ñ 150 â‚½ Ð´Ð¾ 200 â‚½ Ð¸ Ð´Ð½ÐµÐ²Ð½Ð¾Ð¹ Ð±ÑŽÐ´Ð¶ÐµÑ‚ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸.
**ÐžÐ¶Ð¸Ð´Ð°ÐµÐ¼Ñ‹Ð¹ ÑÑ„Ñ„ÐµÐºÑ‚:** Ð Ð¾ÑÑ‚ Ð·Ð°ÐºÐ°Ð·Ð¾Ð² Ð½Ð° 40% Ð¿Ñ€Ð¸ ÑÐ¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ð¸ Ð”Ð Ð 

[ðŸ“Š Ð¡Ð²Ð¾Ð´Ð½Ñ‹Ð¹ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚] [ðŸ”” ÐÐ»ÐµÑ€Ñ‚Ñ‹]
```

---

## 4.6 ÐœÐ°Ñ‚Ñ€Ð¸Ñ†Ð° Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð° Tools

| Tool | Manager | Senior | Director | Admin |
|------|:-------:|:------:|:--------:|:-----:|
| marketing_campaigns_list | âœ… | âœ… | âœ… | âœ… |
| marketing_campaign_stats | âœ… | âœ… | âœ… | âœ… |
| marketing_keywords_list | âœ… | âœ… | âœ… | âœ… |
| marketing_update_bid | âœ…* | âœ… | âœ… | âœ… |
| marketing_pause_keyword | âœ… | âœ… | âœ… | âœ… |
| marketing_resume_keyword | âœ… | âœ… | âœ… | âœ… |
| marketing_pause_campaign | âœ… | âœ… | âœ… | âœ… |
| marketing_resume_campaign | âœ… | âœ… | âœ… | âœ… |
| marketing_alerts_list | âœ… | âœ… | âœ… | âœ… |
| marketing_update_strategy | âŒ | âœ… | âœ… | âœ… |
| marketing_update_limits | âŒ | âœ… | âœ… | âœ… |
| marketing_summary_report | âŒ | âœ… | âœ… | âœ… |
| marketing_ai_recommendations | âŒ | âœ… | âœ… | âœ… |
| marketing_safety_settings | âŒ | âŒ | âŒ | âœ… |

**\*** Manager Ð¼Ð¾Ð¶ÐµÑ‚ Ð¸Ð·Ð¼ÐµÐ½ÑÑ‚ÑŒ ÑÑ‚Ð°Ð²ÐºÐ¸ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð² Ð¿Ñ€ÐµÐ´ÐµÐ»Ð°Ñ… ÑƒÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð½Ñ‹Ñ… Ð»Ð¸Ð¼Ð¸Ñ‚Ð¾Ð² (max_bid).

---

## 4.7 Ð£Ð²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ñ Ð² UI

### 4.7.1 Ð¢Ð¸Ð¿Ñ‹ ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ð¹

| Ð¢Ð¸Ð¿ | Ð˜ÐºÐ¾Ð½ÐºÐ° | ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ |
|-----|--------|----------|
| budget_warning | âš ï¸ | Ð‘ÑŽÐ´Ð¶ÐµÑ‚ Ð¸Ð·Ñ€Ð°ÑÑ…Ð¾Ð´Ð¾Ð²Ð°Ð½ Ð½Ð° 80% |
| campaign_paused | â¸ï¸ | ÐšÐ°Ð¼Ð¿Ð°Ð½Ð¸Ñ Ð¿Ñ€Ð¸Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð° |
| keyword_paused | ðŸ”´ | ÐšÐ»ÑŽÑ‡ Ð¿Ñ€Ð¸Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½ (Safety Logic) |
| bid_capped | ðŸ“Š | Ð¡Ñ‚Ð°Ð²ÐºÐ° Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð° Max Bid |
| anomaly | ðŸ”” | ÐÐ½Ð¾Ð¼Ð°Ð»Ð¸Ñ Ñ€Ð°ÑÑ…Ð¾Ð´Ð¾Ð² |

### 4.7.2 Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚ push-ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ñ

```json
{
  "title": "Marketing: Ð‘ÑŽÐ´Ð¶ÐµÑ‚ 80%",
  "body": "ÐšÐ°Ð¼Ð¿Ð°Ð½Ð¸Ñ 'Ð›ÐµÑ‚Ð½ÑÑ ÐºÐ¾Ð»Ð»ÐµÐºÑ†Ð¸Ñ': Ð¸Ð·Ñ€Ð°ÑÑ…Ð¾Ð´Ð¾Ð²Ð°Ð½Ð¾ 4 000 Ð¸Ð· 5 000 â‚½",
  "icon": "âš ï¸",
  "action": {
    "tool": "marketing_campaign_stats",
    "params": {"campaign_id": "camp_wb_001"}
  },
  "timestamp": "2026-01-22T14:30:00Z"
}
```

---

**Ð”Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚ Ð¿Ð¾Ð´Ð³Ð¾Ñ‚Ð¾Ð²Ð»ÐµÐ½:** Ð¯Ð½Ð²Ð°Ñ€ÑŒ 2026  
**Ð’ÐµÑ€ÑÐ¸Ñ:** 1.0  
**Ð¡Ñ‚Ð°Ñ‚ÑƒÑ:** Ð§ÐµÑ€Ð½Ð¾Ð²Ð¸Ðº

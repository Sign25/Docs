---
title: "Раздел 4: Open WebUI"
mode: "wide"
---

**ÐŸÑ€Ð¾ÐµÐºÑ‚:** ÐŸÑ€ÐµÐ´Ð¸ÐºÑ‚Ð¸Ð²Ð½Ð°Ñ Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ñ‚Ð¾Ð²Ð°Ñ€Ð½Ñ‹Ñ… Ð½Ð¸Ñˆ  
**ÐœÐ¾Ð´ÑƒÐ»ÑŒ:** Scout / Open WebUI  
**Ð’ÐµÑ€ÑÐ¸Ñ:** 1.0  
**Ð”Ð°Ñ‚Ð°:** Ð¯Ð½Ð²Ð°Ñ€ÑŒ 2026

---

## 4.1 ÐžÐ±Ð·Ð¾Ñ€ Ð¸Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ð¸Ð¸

### ÐÑ€Ñ…Ð¸Ñ‚ÐµÐºÑ‚ÑƒÑ€Ð° Ð²Ð·Ð°Ð¸Ð¼Ð¾Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ

```mermaid
flowchart TB
    subgraph USER["ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒ"]
        CHAT["Chat Interface"]
    end

    subgraph OWUI["Open WebUI"]
        PIPELINE["Pipeline<br/>@Adolf_Scout"]
        TOOLS["Tools"]
        RENDER["Response Renderer"]
    end

    subgraph MIDDLEWARE["ADOLF Middleware"]
        AUTH["ÐÐ²Ñ‚Ð¾Ñ€Ð¸Ð·Ð°Ñ†Ð¸Ñ"]
        ROUTE["Ð Ð¾ÑƒÑ‚Ð¸Ð½Ð³"]
    end

    subgraph SCOUT["Scout Module"]
        API["Scout API"]
        ORCH["Orchestrator"]
    end

    CHAT --> PIPELINE
    PIPELINE --> AUTH
    AUTH --> ROUTE
    ROUTE --> API
    API --> ORCH
    ORCH --> API
    API --> RENDER
    RENDER --> CHAT

    TOOLS -.-> API
```

### ÐšÐ¾Ð¼Ð¿Ð¾Ð½ÐµÐ½Ñ‚Ñ‹ Ð¸Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ð¸Ð¸

| ÐšÐ¾Ð¼Ð¿Ð¾Ð½ÐµÐ½Ñ‚ | Ð¢Ð¸Ð¿ | ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ |
|-----------|-----|------------|
| `@Adolf_Scout` | Pipeline | ÐžÑÐ½Ð¾Ð²Ð½Ð¾Ð¹ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸Ðº Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð² |
| `scout_analyze_niche` | Tool | ÐÐ½Ð°Ð»Ð¸Ð· Ð½Ð¸ÑˆÐ¸ |
| `scout_get_history` | Tool | ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ð¸ |
| `scout_compare` | Tool | Ð¡Ñ€Ð°Ð²Ð½ÐµÐ½Ð¸Ðµ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð² |
| `scout_export` | Tool | Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð° |
| `scout_update_rates` | Tool | ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²Ð¾Ðº ÐœÐŸ |

---

## 4.2 Pipeline @Adolf_Scout

### 4.2.1 ÐšÐ¾Ð½Ñ„Ð¸Ð³ÑƒÑ€Ð°Ñ†Ð¸Ñ

```python
# pipelines/adolf_scout.py

"""
title: Adolf Scout Pipeline
description: ÐŸÑ€ÐµÐ´Ð¸ÐºÑ‚Ð¸Ð²Ð½Ð°Ñ Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ñ‚Ð¾Ð²Ð°Ñ€Ð½Ñ‹Ñ… Ð½Ð¸Ñˆ Ð´Ð»Ñ e-commerce
author: ADOLF Team
version: 1.0.0
license: MIT
requirements:
  - httpx>=0.25.0
  - pydantic>=2.0.0
"""

from typing import Optional, Dict, Any, List, Generator
from pydantic import BaseModel, Field
import httpx
import json

class Pipeline:
    """Pipeline Ð´Ð»Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° Ñ‚Ð¾Ð²Ð°Ñ€Ð½Ñ‹Ñ… Ð½Ð¸Ñˆ."""
    
    class Valves(BaseModel):
        """ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ Pipeline."""
        MIDDLEWARE_URL: str = Field(
            default="http://middleware:8000",
            description="URL ADOLF Middleware"
        )
        REQUEST_TIMEOUT: int = Field(
            default=120,
            description="Ð¢Ð°Ð¹Ð¼Ð°ÑƒÑ‚ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ° Ð² ÑÐµÐºÑƒÐ½Ð´Ð°Ñ…"
        )
        ENABLE_STREAMING: bool = Field(
            default=True,
            description="Ð’ÐºÐ»ÑŽÑ‡Ð¸Ñ‚ÑŒ ÑÑ‚Ñ€Ð¸Ð¼Ð¸Ð½Ð³ Ð¾Ñ‚Ð²ÐµÑ‚Ð°"
        )
        DEBUG_MODE: bool = Field(
            default=False,
            description="Ð ÐµÐ¶Ð¸Ð¼ Ð¾Ñ‚Ð»Ð°Ð´ÐºÐ¸"
        )
    
    def __init__(self):
        self.name = "Adolf Scout"
        self.valves = self.Valves()
        self.client = None
    
    async def on_startup(self):
        """Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð¿Ñ€Ð¸ Ð·Ð°Ð¿ÑƒÑÐºÐµ."""
        self.client = httpx.AsyncClient(
            base_url=self.valves.MIDDLEWARE_URL,
            timeout=self.valves.REQUEST_TIMEOUT
        )
        print(f"[Scout] Pipeline started, middleware: {self.valves.MIDDLEWARE_URL}")
    
    async def on_shutdown(self):
        """ÐžÑ‡Ð¸ÑÑ‚ÐºÐ° Ð¿Ñ€Ð¸ Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐµ."""
        if self.client:
            await self.client.aclose()
        print("[Scout] Pipeline stopped")
    
    def pipe(
        self,
        body: Dict[str, Any],
        __user__: Dict[str, Any],
        __event_emitter__=None
    ) -> Generator[str, None, None]:
        """
        ÐžÑÐ½Ð¾Ð²Ð½Ð¾Ð¹ Ð¼ÐµÑ‚Ð¾Ð´ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¸ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ°.
        
        Args:
            body: Ð¢ÐµÐ»Ð¾ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ° Ð¾Ñ‚ Open WebUI
            __user__: Ð”Ð°Ð½Ð½Ñ‹Ðµ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
            __event_emitter__: Ð­Ð¼Ð¸Ñ‚Ñ‚ÐµÑ€ ÑÐ¾Ð±Ñ‹Ñ‚Ð¸Ð¹ Ð´Ð»Ñ UI
        """
        import asyncio
        
        # Ð—Ð°Ð¿ÑƒÑÐº async Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¸
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            async_gen = self._process_request(body, __user__, __event_emitter__)
            
            while True:
                try:
                    chunk = loop.run_until_complete(async_gen.__anext__())
                    yield chunk
                except StopAsyncIteration:
                    break
        finally:
            loop.close()
    
    async def _process_request(
        self,
        body: Dict[str, Any],
        user: Dict[str, Any],
        event_emitter
    ):
        """ÐÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð½Ð°Ñ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð·Ð°Ð¿Ñ€Ð¾ÑÐ°."""
        
        # Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ ÑÐ¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ñ
        messages = body.get("messages", [])
        if not messages:
            yield "ÐŸÐ¾Ð¶Ð°Ð»ÑƒÐ¹ÑÑ‚Ð°, ÑƒÐºÐ°Ð¶Ð¸Ñ‚Ðµ Ð·Ð°Ð¿Ñ€Ð¾Ñ Ð´Ð»Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° Ð½Ð¸ÑˆÐ¸."
            return
        
        user_message = messages[-1].get("content", "")
        user_id = user.get("id")
        user_role = user.get("role", "user")
        auth_token = user.get("token", "")
        
        # ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð° (Senior+)
        if not await self._check_access(user_role):
            yield "â›” Ð”Ð¾ÑÑ‚ÑƒÐ¿ Ðº Ð¼Ð¾Ð´ÑƒÐ»ÑŽ Scout Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½. Ð¢Ñ€ÐµÐ±ÑƒÐµÑ‚ÑÑ Ñ€Ð¾Ð»ÑŒ Senior Ð¸Ð»Ð¸ Ð²Ñ‹ÑˆÐµ."
            return
        
        # ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ Ñ‚Ð¸Ð¿Ð° Ð·Ð°Ð¿Ñ€Ð¾ÑÐ°
        request_type = self._detect_request_type(user_message)
        
        # ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð¿Ð¾ Ñ‚Ð¸Ð¿Ñƒ
        if request_type == "analyze":
            async for chunk in self._handle_analyze(user_message, user_id, auth_token, event_emitter):
                yield chunk
        
        elif request_type == "history":
            async for chunk in self._handle_history(user_message, user_id, auth_token):
                yield chunk
        
        elif request_type == "compare":
            async for chunk in self._handle_compare(user_message, user_id, auth_token):
                yield chunk
        
        elif request_type == "export":
            async for chunk in self._handle_export(user_message, user_id, auth_token, event_emitter):
                yield chunk
        
        elif request_type == "rates":
            async for chunk in self._handle_rates(user_message, user_id, user_role, auth_token):
                yield chunk
        
        else:
            yield self._get_help_message()
    
    def _detect_request_type(self, message: str) -> str:
        """ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ Ñ‚Ð¸Ð¿Ð° Ð·Ð°Ð¿Ñ€Ð¾ÑÐ°."""
        message_lower = message.lower()
        
        # Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ñ
        if any(kw in message_lower for kw in ["Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ñ", "history", "Ð¿Ñ€Ð¾ÑˆÐ»Ñ‹Ðµ", "Ð¿Ñ€ÐµÐ´Ñ‹Ð´ÑƒÑ‰Ð¸Ðµ"]):
            return "history"
        
        # Ð¡Ñ€Ð°Ð²Ð½ÐµÐ½Ð¸Ðµ
        if any(kw in message_lower for kw in ["ÑÑ€Ð°Ð²Ð½Ð¸", "compare", "ÑÑ€Ð°Ð²Ð½ÐµÐ½Ð¸Ðµ"]):
            return "compare"
        
        # Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚
        if any(kw in message_lower for kw in ["ÑÐºÑÐ¿Ð¾Ñ€Ñ‚", "export", "ÑÐºÐ°Ñ‡Ð°Ñ‚ÑŒ", "pdf", "excel"]):
            return "export"
        
        # Ð¡Ñ‚Ð°Ð²ÐºÐ¸
        if any(kw in message_lower for kw in ["ÑÑ‚Ð°Ð²Ðº", "ÐºÐ¾Ð¼Ð¸ÑÑÐ¸", "rates", "overhead"]):
            return "rates"
        
        # ÐÐ½Ð°Ð»Ð¸Ð· (Ð¿Ð¾ ÑƒÐ¼Ð¾Ð»Ñ‡Ð°Ð½Ð¸ÑŽ)
        if any(kw in message_lower for kw in [
            "Ð°Ð½Ð°Ð»Ð¸Ð·", "analyze", "Ð¾Ñ†ÐµÐ½Ð¸", "Ð¿Ñ€Ð¾Ð°Ð½Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÐ¹", "Ð½Ð¸Ñˆ", "ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸",
            "wildberries", "ozon", "ÑÐ½Ð´ÐµÐºÑ", "Ð¼Ð°Ñ€ÐºÐµÑ‚", "wb", "Ð²Ð±", "cogs", "Ð·Ð°ÐºÑƒÐ¿Ðº"
        ]):
            return "analyze"
        
        # Ð¡Ð¿Ñ€Ð°Ð²ÐºÐ°
        return "help"
    
    async def _check_access(self, role: str) -> bool:
        """ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð° Ð¿Ð¾ Ñ€Ð¾Ð»Ð¸."""
        allowed_roles = ["senior", "senior_manager", "director", "admin", "administrator"]
        return role.lower() in allowed_roles
    
    async def _handle_analyze(
        self,
        message: str,
        user_id: str,
        token: str,
        event_emitter
    ):
        """ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð·Ð°Ð¿Ñ€Ð¾ÑÐ° Ð½Ð° Ð°Ð½Ð°Ð»Ð¸Ð·."""
        
        # ÐŸÑ€Ð¾Ð³Ñ€ÐµÑÑ: Ð½Ð°Ñ‡Ð°Ð»Ð¾
        if event_emitter:
            await event_emitter({
                "type": "status",
                "data": {"description": "ðŸ” ÐÐ°Ñ‡Ð¸Ð½Ð°ÑŽ Ð°Ð½Ð°Ð»Ð¸Ð· Ð½Ð¸ÑˆÐ¸...", "done": False}
            })
        
        yield "ðŸ” **ÐÐ½Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÑŽ Ð½Ð¸ÑˆÑƒ...**\n\n"
        
        try:
            # Ð—Ð°Ð¿Ñ€Ð¾Ñ Ðº API
            response = await self.client.post(
                "/api/v1/scout/analyze",
                json={"query": message, "user_id": user_id},
                headers={"Authorization": f"Bearer {token}"}
            )
            
            if response.status_code == 401:
                yield "â›” ÐžÑˆÐ¸Ð±ÐºÐ° Ð°Ð²Ñ‚Ð¾Ñ€Ð¸Ð·Ð°Ñ†Ð¸Ð¸. ÐŸÐ¾Ð¶Ð°Ð»ÑƒÐ¹ÑÑ‚Ð°, Ð²Ð¾Ð¹Ð´Ð¸Ñ‚Ðµ Ð² ÑÐ¸ÑÑ‚ÐµÐ¼Ñƒ Ð·Ð°Ð½Ð¾Ð²Ð¾."
                return
            
            if response.status_code == 400:
                error = response.json().get("detail", "ÐÐµÐ²ÐµÑ€Ð½Ñ‹Ð¹ Ð·Ð°Ð¿Ñ€Ð¾Ñ")
                yield f"âš ï¸ {error}\n\n"
                yield self._get_analyze_help()
                return
            
            response.raise_for_status()
            result = response.json()
            
            # ÐŸÑ€Ð¾Ð³Ñ€ÐµÑÑ: Ð·Ð°Ð²ÐµÑ€ÑˆÐµÐ½Ð¸Ðµ
            if event_emitter:
                await event_emitter({
                    "type": "status",
                    "data": {"description": "âœ… ÐÐ½Ð°Ð»Ð¸Ð· Ð·Ð°Ð²ÐµÑ€ÑˆÑ‘Ð½", "done": True}
                })
            
            # Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð°
            yield self._format_verdict_result(result)
            
        except httpx.TimeoutException:
            yield "â±ï¸ ÐŸÑ€ÐµÐ²Ñ‹ÑˆÐµÐ½Ð¾ Ð²Ñ€ÐµÐ¼Ñ Ð¾Ð¶Ð¸Ð´Ð°Ð½Ð¸Ñ. ÐŸÐ¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ Ð¿Ð¾Ð²Ñ‚Ð¾Ñ€Ð¸Ñ‚ÑŒ Ð·Ð°Ð¿Ñ€Ð¾Ñ."
        
        except Exception as e:
            if self.valves.DEBUG_MODE:
                yield f"âŒ ÐžÑˆÐ¸Ð±ÐºÐ°: {str(e)}"
            else:
                yield "âŒ ÐŸÑ€Ð¾Ð¸Ð·Ð¾ÑˆÐ»Ð° Ð¾ÑˆÐ¸Ð±ÐºÐ° Ð¿Ñ€Ð¸ Ð°Ð½Ð°Ð»Ð¸Ð·Ðµ. ÐŸÐ¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ Ð¿Ð¾Ð·Ð¶Ðµ."
    
    async def _handle_history(
        self,
        message: str,
        user_id: str,
        token: str
    ):
        """ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð·Ð°Ð¿Ñ€Ð¾ÑÐ° Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ð¸."""
        
        # ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ Ð¿Ð°Ñ€Ð°Ð¼ÐµÑ‚Ñ€Ð¾Ð²
        limit = 10
        if "Ð¿Ð¾ÑÐ»ÐµÐ´Ð½" in message.lower():
            import re
            match = re.search(r"(\d+)", message)
            if match:
                limit = min(int(match.group(1)), 50)
        
        try:
            response = await self.client.get(
                "/api/v1/scout/history",
                params={"user_id": user_id, "limit": limit},
                headers={"Authorization": f"Bearer {token}"}
            )
            response.raise_for_status()
            
            history = response.json()
            yield self._format_history(history)
            
        except Exception as e:
            yield f"âŒ ÐžÑˆÐ¸Ð±ÐºÐ° Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ¸ Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ð¸: {str(e)}"
    
    async def _handle_compare(
        self,
        message: str,
        user_id: str,
        token: str
    ):
        """ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð·Ð°Ð¿Ñ€Ð¾ÑÐ° ÑÑ€Ð°Ð²Ð½ÐµÐ½Ð¸Ñ."""
        yield "ðŸ”„ Ð¤ÑƒÐ½ÐºÑ†Ð¸Ñ ÑÑ€Ð°Ð²Ð½ÐµÐ½Ð¸Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð² Ð±ÑƒÐ´ÐµÑ‚ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð° Ð² ÑÐ»ÐµÐ´ÑƒÑŽÑ‰ÐµÐ¹ Ð²ÐµÑ€ÑÐ¸Ð¸."
    
    async def _handle_export(
        self,
        message: str,
        user_id: str,
        token: str,
        event_emitter
    ):
        """ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð·Ð°Ð¿Ñ€Ð¾ÑÐ° ÑÐºÑÐ¿Ð¾Ñ€Ñ‚Ð°."""
        
        # ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚Ð°
        export_format = "pdf"
        if "excel" in message.lower() or "xlsx" in message.lower():
            export_format = "xlsx"
        
        # ÐŸÐ¾Ð¸ÑÐº ID Ð°Ð½Ð°Ð»Ð¸Ð·Ð°
        import re
        id_match = re.search(r"([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})", message)
        
        if not id_match:
            # Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚ Ð¿Ð¾ÑÐ»ÐµÐ´Ð½ÐµÐ³Ð¾ Ð°Ð½Ð°Ð»Ð¸Ð·Ð°
            yield "ðŸ“¤ Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚Ð¸Ñ€ÑƒÑŽ Ð¿Ð¾ÑÐ»ÐµÐ´Ð½Ð¸Ð¹ Ð°Ð½Ð°Ð»Ð¸Ð·...\n\n"
            analysis_id = "latest"
        else:
            analysis_id = id_match.group(1)
            yield f"ðŸ“¤ Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚Ð¸Ñ€ÑƒÑŽ Ð°Ð½Ð°Ð»Ð¸Ð· `{analysis_id[:8]}...`\n\n"
        
        try:
            response = await self.client.post(
                "/api/v1/scout/export",
                json={
                    "analysis_id": analysis_id,
                    "format": export_format,
                    "user_id": user_id
                },
                headers={"Authorization": f"Bearer {token}"}
            )
            response.raise_for_status()
            
            result = response.json()
            download_url = result.get("download_url")
            
            yield f"âœ… ÐžÑ‚Ñ‡Ñ‘Ñ‚ Ð³Ð¾Ñ‚Ð¾Ð²!\n\n"
            yield f"ðŸ“¥ [Ð¡ÐºÐ°Ñ‡Ð°Ñ‚ÑŒ {export_format.upper()}]({download_url})\n\n"
            yield f"_Ð¡ÑÑ‹Ð»ÐºÐ° Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð° 24 Ñ‡Ð°ÑÐ°._"
            
        except Exception as e:
            yield f"âŒ ÐžÑˆÐ¸Ð±ÐºÐ° ÑÐºÑÐ¿Ð¾Ñ€Ñ‚Ð°: {str(e)}"
    
    async def _handle_rates(
        self,
        message: str,
        user_id: str,
        user_role: str,
        token: str
    ):
        """ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð·Ð°Ð¿Ñ€Ð¾ÑÐ° Ð¿Ð¾ ÑÑ‚Ð°Ð²ÐºÐ°Ð¼."""
        
        message_lower = message.lower()
        
        # ÐŸÑ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€ ÑÑ‚Ð°Ð²Ð¾Ðº
        if any(kw in message_lower for kw in ["Ð¿Ð¾ÐºÐ°Ð¶Ð¸", "Ñ‚ÐµÐºÑƒÑ‰Ð¸", "show", "view"]):
            try:
                response = await self.client.get(
                    "/api/v1/scout/rates",
                    headers={"Authorization": f"Bearer {token}"}
                )
                response.raise_for_status()
                
                rates = response.json()
                yield self._format_rates(rates)
                
            except Exception as e:
                yield f"âŒ ÐžÑˆÐ¸Ð±ÐºÐ° Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ¸ ÑÑ‚Ð°Ð²Ð¾Ðº: {str(e)}"
        
        # Ð˜Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²Ð¾Ðº
        elif any(kw in message_lower for kw in ["Ð¸Ð·Ð¼ÐµÐ½Ð¸", "ÑƒÑÑ‚Ð°Ð½Ð¾Ð²Ð¸", "update", "set"]):
            # ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð¿Ñ€Ð°Ð² (Senior+)
            if user_role.lower() not in ["senior", "senior_manager", "director", "admin", "administrator"]:
                yield "â›” Ð˜Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²Ð¾Ðº Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð´Ð»Ñ Senior Ð¸ Ð²Ñ‹ÑˆÐµ."
                return
            
            yield "âœï¸ Ð”Ð»Ñ Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ñ ÑÑ‚Ð°Ð²Ð¾Ðº Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐ¹Ñ‚Ðµ ÐºÐ½Ð¾Ð¿ÐºÑƒ **Â«ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ ÑÑ‚Ð°Ð²Ð¾ÐºÂ»** Ð½Ð¸Ð¶Ðµ."
            yield "\n\n"
            yield self._get_rates_form()
        
        else:
            yield self._format_rates_help()
    
    def _format_verdict_result(self, result: Dict) -> str:
        """Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð° Ð°Ð½Ð°Ð»Ð¸Ð·Ð°."""
        
        verdict = result.get("verdict", "UNKNOWN")
        color = result.get("color", "gray")
        
        # Ð­Ð¼Ð¾Ð´Ð·Ð¸ ÑÐ²ÐµÑ‚Ð¾Ñ„Ð¾Ñ€Ð°
        verdict_emoji = {
            "GO": "ðŸŸ¢",
            "CONSIDER": "ðŸŸ¡",
            "RISKY": "ðŸ”´"
        }.get(verdict, "âšª")
        
        # Ð—Ð°Ð³Ð¾Ð»Ð¾Ð²Ð¾Ðº
        output = f"## {verdict_emoji} Ð’ÐµÑ€Ð´Ð¸ÐºÑ‚: **{verdict}**\n\n"
        
        # Summary
        summary = result.get("summary", "")
        if summary:
            output += f"_{summary}_\n\n"
        
        # ÐšÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ðµ Ð¼ÐµÑ‚Ñ€Ð¸ÐºÐ¸
        metrics = result.get("metrics", {})
        output += "### ðŸ“Š ÐšÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ðµ Ð¼ÐµÑ‚Ñ€Ð¸ÐºÐ¸\n\n"
        output += "| ÐœÐµÑ‚Ñ€Ð¸ÐºÐ° | Ð—Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ | Ð¡Ñ‚Ð°Ñ‚ÑƒÑ |\n"
        output += "|---------|----------|--------|\n"
        
        # Trend
        trend_slope = metrics.get("trend_slope", 0)
        trend_status = metrics.get("trend_status", "unknown")
        trend_emoji = {"green": "ðŸŸ¢", "yellow": "ðŸŸ¡", "red": "ðŸ”´"}.get(trend_status, "âšª")
        output += f"| Ð¢Ñ€ÐµÐ½Ð´ ÑÐ¿Ñ€Ð¾ÑÐ° | {trend_slope:+.2f} | {trend_emoji} |\n"
        
        # Monopoly
        monopoly_rate = metrics.get("monopoly_rate", 0)
        monopoly_status = metrics.get("monopoly_status", "unknown")
        monopoly_emoji = {"green": "ðŸŸ¢", "yellow": "ðŸŸ¡", "red": "ðŸ”´"}.get(monopoly_status, "âšª")
        output += f"| ÐœÐ¾Ð½Ð¾Ð¿Ð¾Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ | {monopoly_rate*100:.0f}% | {monopoly_emoji} |\n"
        
        # Margin
        margin = metrics.get("expected_margin", 0)
        margin_status = metrics.get("margin_status", "unknown")
        margin_emoji = {"green": "ðŸŸ¢", "yellow": "ðŸŸ¡", "red": "ðŸ”´"}.get(margin_status, "âšª")
        output += f"| ÐžÐ¶Ð¸Ð´. Ð¼Ð°Ñ€Ð¶Ð° | {margin:.1f}% | {margin_emoji} |\n"
        
        output += "\n"
        
        # Unit-ÑÐºÐ¾Ð½Ð¾Ð¼Ð¸ÐºÐ°
        unit_economics = result.get("unit_economics", {})
        if unit_economics:
            output += "### ðŸ’° Unit-ÑÐºÐ¾Ð½Ð¾Ð¼Ð¸ÐºÐ°\n\n"
            
            for mp, econ in unit_economics.items():
                mp_name = {"wildberries": "Wildberries", "ozon": "Ozon", "yandex_market": "Ð¯Ð½Ð´ÐµÐºÑ.ÐœÐ°Ñ€ÐºÐµÑ‚"}.get(mp, mp)
                output += f"**{mp_name}**\n"
                output += f"- Ð¦ÐµÐ½Ð° Ð¿Ñ€Ð¾Ð´Ð°Ð¶Ð¸: {econ.get('selling_price', 0):.0f} â‚½\n"
                output += f"- Ð¡ÐµÐ±ÐµÑÑ‚Ð¾Ð¸Ð¼Ð¾ÑÑ‚ÑŒ: {econ.get('cogs', 0):.0f} â‚½\n"
                output += f"- Ð Ð°ÑÑ…Ð¾Ð´Ñ‹ ÐœÐŸ: {econ.get('total_overhead_pct', 0):.1f}%\n"
                output += f"- Ð§Ð¸ÑÑ‚Ð°Ñ Ð¿Ñ€Ð¸Ð±Ñ‹Ð»ÑŒ: {econ.get('net_profit', 0):.0f} â‚½\n"
                output += f"- Ð§Ð¸ÑÑ‚Ð°Ñ Ð¼Ð°Ñ€Ð¶Ð°: **{econ.get('net_margin_pct', 0):.1f}%**\n"
                output += f"- Ð¦ÐµÐ½Ð° Ð´Ð»Ñ 25% Ð¼Ð°Ñ€Ð¶Ð¸: {econ.get('target_price_25', 0):.0f} â‚½\n\n"
        
        # Ð ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸
        recommendations = result.get("recommendations", [])
        if recommendations:
            output += "### ðŸ’¡ Ð ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸\n\n"
            for i, rec in enumerate(recommendations, 1):
                output += f"{i}. {rec}\n"
            output += "\n"
        
        # Ð Ð¸ÑÐºÐ¸
        risks = result.get("risks", [])
        if risks:
            output += "### âš ï¸ Ð Ð¸ÑÐºÐ¸\n\n"
            for risk in risks[:5]:
                if isinstance(risk, dict):
                    output += f"- **{risk.get('risk', '')}** ({risk.get('probability', '')})\n"
                    mitigation = risk.get('mitigation', '')
                    if mitigation:
                        output += f"  _ÐœÐ¸Ñ‚Ð¸Ð³Ð°Ñ†Ð¸Ñ: {mitigation}_\n"
                else:
                    output += f"- {risk}\n"
            output += "\n"
        
        # Ð’Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚Ð¸
        opportunities = result.get("opportunities", [])
        if opportunities:
            output += "### ðŸš€ Ð’Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚Ð¸\n\n"
            for opp in opportunities[:5]:
                output += f"- {opp}\n"
            output += "\n"
        
        # ÐœÐµÑ‚Ð°Ð´Ð°Ð½Ð½Ñ‹Ðµ
        analysis_id = result.get("analysis_id", "")
        analyzed_at = result.get("analyzed_at", "")
        
        output += "---\n"
        output += f"_ID Ð°Ð½Ð°Ð»Ð¸Ð·Ð°: `{analysis_id[:8]}...` | {analyzed_at[:10]}_\n\n"
        
        # ÐšÐ½Ð¾Ð¿ÐºÐ¸ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ð¹
        output += self._get_action_buttons(analysis_id)
        
        return output
    
    def _format_history(self, history: Dict) -> str:
        """Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ð¸ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð²."""
        
        analyses = history.get("analyses", [])
        
        if not analyses:
            return "ðŸ“‹ Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð² Ð¿ÑƒÑÑ‚Ð°.\n\nÐŸÐ¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ: Â«ÐŸÑ€Ð¾Ð°Ð½Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÐ¹ Ð½Ð¸ÑˆÑƒ Ð»ÐµÑ‚Ð½Ð¸Ñ… Ð¿Ð»Ð°Ñ‚ÑŒÐµÐ² Ð½Ð° WB, Ð·Ð°ÐºÑƒÐ¿ÐºÐ° 500â‚½Â»"
        
        output = "## ðŸ“‹ Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð²\n\n"
        output += "| Ð”Ð°Ñ‚Ð° | Ð—Ð°Ð¿Ñ€Ð¾Ñ | Ð’ÐµÑ€Ð´Ð¸ÐºÑ‚ | ÐœÐ°Ñ€Ð¶Ð° |\n"
        output += "|------|--------|---------|-------|\n"
        
        for item in analyses:
            date = item.get("analyzed_at", "")[:10]
            query = item.get("query", "")[:30]
            if len(item.get("query", "")) > 30:
                query += "..."
            
            verdict = item.get("verdict", "")
            verdict_emoji = {"GO": "ðŸŸ¢", "CONSIDER": "ðŸŸ¡", "RISKY": "ðŸ”´"}.get(verdict, "âšª")
            
            margin = item.get("metrics", {}).get("expected_margin", 0)
            
            output += f"| {date} | {query} | {verdict_emoji} {verdict} | {margin:.1f}% |\n"
        
        output += "\n"
        output += "_Ð”Ð»Ñ Ð´ÐµÑ‚Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð¿Ñ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€Ð° ÑƒÐºÐ°Ð¶Ð¸Ñ‚Ðµ ID Ð°Ð½Ð°Ð»Ð¸Ð·Ð°._"
        
        return output
    
    def _format_rates(self, rates: Dict) -> str:
        """Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ ÑÑ‚Ð°Ð²Ð¾Ðº ÐœÐŸ."""
        
        output = "## ðŸ“Š Ð¢ÐµÐºÑƒÑ‰Ð¸Ðµ ÑÑ‚Ð°Ð²ÐºÐ¸ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ¾Ð²\n\n"
        output += "| Ð¡Ñ‚Ð°Ñ‚ÑŒÑ | Wildberries | Ozon | Ð¯Ð½Ð´ÐµÐºÑ.ÐœÐ°Ñ€ÐºÐµÑ‚ |\n"
        output += "|--------|:-----------:|:----:|:-------------:|\n"
        
        wb = rates.get("wildberries", {})
        ozon = rates.get("ozon", {})
        ym = rates.get("yandex_market", {})
        
        output += f"| ÐšÐ¾Ð¼Ð¸ÑÑÐ¸Ñ | {wb.get('commission_pct', 0)}% | {ozon.get('commission_pct', 0)}% | {ym.get('commission_pct', 0)}% |\n"
        output += f"| Ð›Ð¾Ð³Ð¸ÑÑ‚Ð¸ÐºÐ° | {wb.get('logistics_pct', 0)}% | {ozon.get('logistics_pct', 0)}% | {ym.get('logistics_pct', 0)}% |\n"
        output += f"| Ð’Ð¾Ð·Ð²Ñ€Ð°Ñ‚Ñ‹ | {wb.get('return_logistics_pct', 0)}% | {ozon.get('return_logistics_pct', 0)}% | {ym.get('return_logistics_pct', 0)}% |\n"
        output += f"| Ð¥Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ | {wb.get('storage_pct', 0)}% | {ozon.get('storage_pct', 0)}% | {ym.get('storage_pct', 0)}% |\n"
        output += f"| Ð­ÐºÐ²Ð°Ð¹Ñ€Ð¸Ð½Ð³ | {wb.get('acquiring_pct', 0)}% | {ozon.get('acquiring_pct', 0)}% | {ym.get('acquiring_pct', 0)}% |\n"
        output += f"| **Ð˜Ñ‚Ð¾Ð³Ð¾** | **{wb.get('total_overhead_pct', 0)}%** | **{ozon.get('total_overhead_pct', 0)}%** | **{ym.get('total_overhead_pct', 0)}%** |\n"
        
        output += "\n_Ð¡Ñ‚Ð°Ð²ÐºÐ¸ Ð¼Ð¾Ð¶Ð½Ð¾ Ð¸Ð·Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ (Senior+): Â«Ð˜Ð·Ð¼ÐµÐ½Ð¸ ÑÑ‚Ð°Ð²ÐºÐ¸Â»_"
        
        return output
    
    def _format_rates_help(self) -> str:
        """Ð¡Ð¿Ñ€Ð°Ð²ÐºÐ° Ð¿Ð¾ ÑÑ‚Ð°Ð²ÐºÐ°Ð¼."""
        return """## âš™ï¸ Ð£Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²ÐºÐ°Ð¼Ð¸

**ÐŸÑ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€ ÑÑ‚Ð°Ð²Ð¾Ðº:**
- Â«ÐŸÐ¾ÐºÐ°Ð¶Ð¸ Ñ‚ÐµÐºÑƒÑ‰Ð¸Ðµ ÑÑ‚Ð°Ð²ÐºÐ¸Â»
- Â«ÐšÐ°ÐºÐ¸Ðµ ÐºÐ¾Ð¼Ð¸ÑÑÐ¸Ð¸ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ¾Ð²?Â»

**Ð˜Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²Ð¾Ðº (Senior+):**
- Â«Ð˜Ð·Ð¼ÐµÐ½Ð¸ ÑÑ‚Ð°Ð²ÐºÐ¸Â»
- Â«Ð£ÑÑ‚Ð°Ð½Ð¾Ð²Ð¸ ÐºÐ¾Ð¼Ð¸ÑÑÐ¸ÑŽ WB 16%Â»
"""
    
    def _get_action_buttons(self, analysis_id: str) -> str:
        """ÐšÐ½Ð¾Ð¿ÐºÐ¸ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ð¹ Ð¿Ð¾ÑÐ»Ðµ Ð°Ð½Ð°Ð»Ð¸Ð·Ð°."""
        return f"""<div class="scout-actions">
    <button onclick="sendMessage('Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚ Ð² PDF {analysis_id}')">ðŸ“¥ Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚ PDF</button>
    <button onclick="sendMessage('Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚ Ð² Excel {analysis_id}')">ðŸ“Š Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚ Excel</button>
    <button onclick="sendMessage('Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð²')">ðŸ“‹ Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ñ</button>
</div>
"""
    
    def _get_rates_form(self) -> str:
        """Ð¤Ð¾Ñ€Ð¼Ð° Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ ÑÑ‚Ð°Ð²Ð¾Ðº."""
        return """<div class="scout-rates-form">
    <p>Ð”Ð»Ñ Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ñ ÑÑ‚Ð°Ð²Ð¾Ðº Ð¾Ñ‚Ð¿Ñ€Ð°Ð²ÑŒÑ‚Ðµ ÑÐ¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ðµ Ð² Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚Ðµ:</p>
    <code>Ð£ÑÑ‚Ð°Ð½Ð¾Ð²Ð¸ ÑÑ‚Ð°Ð²ÐºÐ¸ WB: ÐºÐ¾Ð¼Ð¸ÑÑÐ¸Ñ 16%, Ð»Ð¾Ð³Ð¸ÑÑ‚Ð¸ÐºÐ° 5%, Ð²Ð¾Ð·Ð²Ñ€Ð°Ñ‚Ñ‹ 3%, Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ 1%</code>
</div>
"""
    
    def _get_help_message(self) -> str:
        """Ð¡Ð¿Ñ€Ð°Ð²Ð¾Ñ‡Ð½Ð¾Ðµ ÑÐ¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ðµ."""
        return """## ðŸ” ADOLF Scout â€” ÐÐ½Ð°Ð»Ð¸Ð· Ñ‚Ð¾Ð²Ð°Ñ€Ð½Ñ‹Ñ… Ð½Ð¸Ñˆ

### ÐšÐ°Ðº Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ

**ÐÐ½Ð°Ð»Ð¸Ð· Ð½Ð¸ÑˆÐ¸:**
```
ÐŸÑ€Ð¾Ð°Ð½Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÐ¹ Ð½Ð¸ÑˆÑƒ Ð»ÐµÑ‚Ð½Ð¸Ñ… Ð¿Ð»Ð°Ñ‚ÑŒÐµÐ² Ð½Ð° Wildberries, Ð·Ð°ÐºÑƒÐ¿ÐºÐ° 500 Ñ€ÑƒÐ±Ð»ÐµÐ¹
```
```
ÐžÑ†ÐµÐ½Ð¸ https://www.ozon.ru/category/platya-zhenskie-7502/, COGS Ð¾Ñ‚ 400 Ð´Ð¾ 600â‚½
```

**Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ñ:**
```
ÐŸÐ¾ÐºÐ°Ð¶Ð¸ Ð¸ÑÑ‚Ð¾Ñ€Ð¸ÑŽ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð²
ÐŸÐ¾ÐºÐ°Ð¶Ð¸ Ð¿Ð¾ÑÐ»ÐµÐ´Ð½Ð¸Ðµ 5 Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð²
```

**Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚:**
```
Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚ Ð² PDF
Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚ Ð² Excel
```

**Ð¡Ñ‚Ð°Ð²ÐºÐ¸:**
```
ÐŸÐ¾ÐºÐ°Ð¶Ð¸ Ñ‚ÐµÐºÑƒÑ‰Ð¸Ðµ ÑÑ‚Ð°Ð²ÐºÐ¸
Ð˜Ð·Ð¼ÐµÐ½Ð¸ ÑÑ‚Ð°Ð²ÐºÐ¸
```

### ÐŸÐ¾Ñ€Ð¾Ð³Ð¸ Â«Ð¡Ð²ÐµÑ‚Ð¾Ñ„Ð¾Ñ€Ð°Â»

| ÐœÐµÑ‚Ñ€Ð¸ÐºÐ° | ðŸŸ¢ GO | ðŸŸ¡ CONSIDER | ðŸ”´ RISKY |
|---------|-------|-------------|----------|
| Ð¢Ñ€ÐµÐ½Ð´ | > +0.15 | 0 â€” 0.15 | < 0 |
| ÐœÐ¾Ð½Ð¾Ð¿Ð¾Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ | < 50% | 50-70% | > 70% |
| ÐœÐ°Ñ€Ð¶Ð° | > 25% | 15-25% | < 15% |

---
_ÐœÐ¾Ð´ÑƒÐ»ÑŒ Ð´Ð¾ÑÑ‚ÑƒÐ¿ÐµÐ½ Ð´Ð»Ñ Ñ€Ð¾Ð»ÐµÐ¹: Senior, Director, Administrator_
"""
    
    def _get_analyze_help(self) -> str:
        """Ð¡Ð¿Ñ€Ð°Ð²ÐºÐ° Ð¿Ð¾ Ð°Ð½Ð°Ð»Ð¸Ð·Ñƒ."""
        return """**Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ°:**
1. Ð£ÐºÐ°Ð¶Ð¸Ñ‚Ðµ Ð½Ð¸ÑˆÑƒ/ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸ÑŽ (Ñ‚ÐµÐºÑÑ‚ Ð¸Ð»Ð¸ URL)
2. Ð£ÐºÐ°Ð¶Ð¸Ñ‚Ðµ Ð·Ð°ÐºÑƒÐ¿Ð¾Ñ‡Ð½ÑƒÑŽ Ñ†ÐµÐ½Ñƒ (COGS)

**ÐŸÑ€Ð¸Ð¼ÐµÑ€Ñ‹:**
- `ÐÐ½Ð°Ð»Ð¸Ð· Ð½Ð¸ÑˆÐ¸ Ð´ÐµÑ‚ÑÐºÐ¸Ñ… ÐºÐ¾Ð¼Ð±Ð¸Ð½ÐµÐ·Ð¾Ð½Ð¾Ð², Ð·Ð°ÐºÑƒÐ¿ÐºÐ° 800â‚½`
- `ÐžÑ†ÐµÐ½Ð¸ https://www.wildberries.ru/catalog/..., COGS 500`
- `Ð›ÐµÑ‚Ð½Ð¸Ðµ Ð¿Ð»Ð°Ñ‚ÑŒÑ Ð½Ð° Ozon, Ð¾Ñ‚ 400 Ð´Ð¾ 600 Ñ€ÑƒÐ±Ð»ÐµÐ¹`
"""
```

---

## 4.3 Tools

### 4.3.1 Tool: scout_analyze_niche

```python
# tools/scout_analyze_niche.py

"""
title: Scout Analyze Niche
description: ÐÐ½Ð°Ð»Ð¸Ð· Ñ‚Ð¾Ð²Ð°Ñ€Ð½Ð¾Ð¹ Ð½Ð¸ÑˆÐ¸ Ð´Ð»Ñ Ð¾Ñ†ÐµÐ½ÐºÐ¸ Ñ†ÐµÐ»ÐµÑÐ¾Ð¾Ð±Ñ€Ð°Ð·Ð½Ð¾ÑÑ‚Ð¸ Ð²Ñ…Ð¾Ð´Ð°
author: ADOLF Team
version: 1.0.0
"""

from typing import Optional
from pydantic import BaseModel, Field

class Tools:
    """Tools Ð´Ð»Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° Ð½Ð¸ÑˆÐ¸."""
    
    class Valves(BaseModel):
        MIDDLEWARE_URL: str = Field(default="http://middleware:8000")
    
    class UserValves(BaseModel):
        pass
    
    def __init__(self):
        self.valves = self.Valves()
    
    async def analyze_niche(
        self,
        query: str,
        cogs: float,
        marketplace: Optional[str] = None,
        __user__: dict = {}
    ) -> str:
        """
        ÐÐ½Ð°Ð»Ð¸Ð· Ñ‚Ð¾Ð²Ð°Ñ€Ð½Ð¾Ð¹ Ð½Ð¸ÑˆÐ¸.
        
        Args:
            query: ÐŸÐ¾Ð¸ÑÐºÐ¾Ð²Ñ‹Ð¹ Ð·Ð°Ð¿Ñ€Ð¾Ñ Ð¸Ð»Ð¸ URL ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸
            cogs: Ð—Ð°ÐºÑƒÐ¿Ð¾Ñ‡Ð½Ð°Ñ Ñ†ÐµÐ½Ð° Ð² Ñ€ÑƒÐ±Ð»ÑÑ…
            marketplace: ÐœÐ°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹Ñ (wildberries/ozon/yandex_market), Ð¾Ð¿Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾
        
        Returns:
            Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° Ñ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚Ð¾Ð¼
        """
        import httpx
        
        user_id = __user__.get("id")
        token = __user__.get("token", "")
        
        # Ð¤Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ°
        request_body = {
            "query": query,
            "cogs": cogs,
            "user_id": user_id
        }
        
        if marketplace:
            request_body["marketplaces"] = [marketplace]
        
        async with httpx.AsyncClient(timeout=120) as client:
            response = await client.post(
                f"{self.valves.MIDDLEWARE_URL}/api/v1/scout/analyze",
                json=request_body,
                headers={"Authorization": f"Bearer {token}"}
            )
            
            if response.status_code == 403:
                return "â›” Ð”Ð¾ÑÑ‚ÑƒÐ¿ Ð·Ð°Ð¿Ñ€ÐµÑ‰Ñ‘Ð½. Ð¢Ñ€ÐµÐ±ÑƒÐµÑ‚ÑÑ Ñ€Ð¾Ð»ÑŒ Senior Ð¸Ð»Ð¸ Ð²Ñ‹ÑˆÐµ."
            
            response.raise_for_status()
            result = response.json()
        
        # Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð°
        verdict = result.get("verdict", "UNKNOWN")
        emoji = {"GO": "ðŸŸ¢", "CONSIDER": "ðŸŸ¡", "RISKY": "ðŸ”´"}.get(verdict, "âšª")
        
        summary = result.get("summary", "")
        metrics = result.get("metrics", {})
        
        output = f"{emoji} **{verdict}**\n\n"
        output += f"{summary}\n\n"
        output += f"- Ð¢Ñ€ÐµÐ½Ð´: {metrics.get('trend_slope', 0):+.2f}\n"
        output += f"- ÐœÐ¾Ð½Ð¾Ð¿Ð¾Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ: {metrics.get('monopoly_rate', 0)*100:.0f}%\n"
        output += f"- ÐžÐ¶Ð¸Ð´. Ð¼Ð°Ñ€Ð¶Ð°: {metrics.get('expected_margin', 0):.1f}%\n"
        
        return output
```

### 4.3.2 Tool: scout_get_history

```python
# tools/scout_get_history.py

"""
title: Scout Get History
description: ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ð¸ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð² Ð½Ð¸Ñˆ
author: ADOLF Team
version: 1.0.0
"""

from typing import Optional
from pydantic import BaseModel, Field

class Tools:
    """Tools Ð´Ð»Ñ Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ð¸ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð²."""
    
    class Valves(BaseModel):
        MIDDLEWARE_URL: str = Field(default="http://middleware:8000")
    
    def __init__(self):
        self.valves = self.Valves()
    
    async def get_history(
        self,
        limit: int = 10,
        query_filter: Optional[str] = None,
        __user__: dict = {}
    ) -> str:
        """
        ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ð¸ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð².
        
        Args:
            limit: ÐšÐ¾Ð»Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾ Ð·Ð°Ð¿Ð¸ÑÐµÐ¹ (Ð¼Ð°ÐºÑ. 50)
            query_filter: Ð¤Ð¸Ð»ÑŒÑ‚Ñ€ Ð¿Ð¾ Ð·Ð°Ð¿Ñ€Ð¾ÑÑƒ (Ð¾Ð¿Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾)
        
        Returns:
            Ð¡Ð¿Ð¸ÑÐ¾Ðº Ð¿Ð¾ÑÐ»ÐµÐ´Ð½Ð¸Ñ… Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð²
        """
        import httpx
        
        user_id = __user__.get("id")
        token = __user__.get("token", "")
        
        params = {
            "user_id": user_id,
            "limit": min(limit, 50)
        }
        
        if query_filter:
            params["query"] = query_filter
        
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(
                f"{self.valves.MIDDLEWARE_URL}/api/v1/scout/history",
                params=params,
                headers={"Authorization": f"Bearer {token}"}
            )
            response.raise_for_status()
            data = response.json()
        
        analyses = data.get("analyses", [])
        
        if not analyses:
            return "ðŸ“‹ Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð² Ð¿ÑƒÑÑ‚Ð°."
        
        output = "ðŸ“‹ **Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð²:**\n\n"
        
        for item in analyses:
            date = item.get("analyzed_at", "")[:10]
            query = item.get("query", "")[:25]
            verdict = item.get("verdict", "")
            emoji = {"GO": "ðŸŸ¢", "CONSIDER": "ðŸŸ¡", "RISKY": "ðŸ”´"}.get(verdict, "âšª")
            
            output += f"- {date} | {emoji} {verdict} | {query}\n"
        
        return output
```

### 4.3.3 Tool: scout_export

```python
# tools/scout_export.py

"""
title: Scout Export
description: Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð° Ð¿Ð¾ Ð°Ð½Ð°Ð»Ð¸Ð·Ñƒ Ð½Ð¸ÑˆÐ¸
author: ADOLF Team
version: 1.0.0
"""

from typing import Optional, Literal
from pydantic import BaseModel, Field

class Tools:
    """Tools Ð´Ð»Ñ ÑÐºÑÐ¿Ð¾Ñ€Ñ‚Ð° Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð¾Ð²."""
    
    class Valves(BaseModel):
        MIDDLEWARE_URL: str = Field(default="http://middleware:8000")
    
    def __init__(self):
        self.valves = self.Valves()
    
    async def export_report(
        self,
        analysis_id: Optional[str] = None,
        format: Literal["pdf", "xlsx"] = "pdf",
        __user__: dict = {}
    ) -> str:
        """
        Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð° Ð¿Ð¾ Ð°Ð½Ð°Ð»Ð¸Ð·Ñƒ.
        
        Args:
            analysis_id: ID Ð°Ð½Ð°Ð»Ð¸Ð·Ð° (ÐµÑÐ»Ð¸ Ð½Ðµ ÑƒÐºÐ°Ð·Ð°Ð½ â€” Ð¿Ð¾ÑÐ»ÐµÐ´Ð½Ð¸Ð¹)
            format: Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð° (pdf Ð¸Ð»Ð¸ xlsx)
        
        Returns:
            Ð¡ÑÑ‹Ð»ÐºÐ° Ð´Ð»Ñ ÑÐºÐ°Ñ‡Ð¸Ð²Ð°Ð½Ð¸Ñ
        """
        import httpx
        
        user_id = __user__.get("id")
        token = __user__.get("token", "")
        
        request_body = {
            "analysis_id": analysis_id or "latest",
            "format": format,
            "user_id": user_id
        }
        
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                f"{self.valves.MIDDLEWARE_URL}/api/v1/scout/export",
                json=request_body,
                headers={"Authorization": f"Bearer {token}"}
            )
            response.raise_for_status()
            result = response.json()
        
        download_url = result.get("download_url", "")
        
        return f"ðŸ“¥ [Ð¡ÐºÐ°Ñ‡Ð°Ñ‚ÑŒ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚ ({format.upper()})]({download_url})\n\n_Ð¡ÑÑ‹Ð»ÐºÐ° Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð° 24 Ñ‡Ð°ÑÐ°._"
```

### 4.3.4 Tool: scout_update_rates

```python
# tools/scout_update_rates.py

"""
title: Scout Update Rates
description: ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²Ð¾Ðº Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ¾Ð²
author: ADOLF Team
version: 1.0.0
"""

from typing import Optional
from pydantic import BaseModel, Field

class Tools:
    """Tools Ð´Ð»Ñ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ ÑÑ‚Ð°Ð²ÐºÐ°Ð¼Ð¸."""
    
    class Valves(BaseModel):
        MIDDLEWARE_URL: str = Field(default="http://middleware:8000")
    
    def __init__(self):
        self.valves = self.Valves()
    
    async def get_rates(
        self,
        marketplace: Optional[str] = None,
        __user__: dict = {}
    ) -> str:
        """
        ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ñ‚ÐµÐºÑƒÑ‰Ð¸Ñ… ÑÑ‚Ð°Ð²Ð¾Ðº.
        
        Args:
            marketplace: Ð¤Ð¸Ð»ÑŒÑ‚Ñ€ Ð¿Ð¾ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÑƒ (Ð¾Ð¿Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾)
        
        Returns:
            Ð¢Ð°Ð±Ð»Ð¸Ñ†Ð° ÑÑ‚Ð°Ð²Ð¾Ðº
        """
        import httpx
        
        token = __user__.get("token", "")
        
        params = {}
        if marketplace:
            params["marketplace"] = marketplace
        
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(
                f"{self.valves.MIDDLEWARE_URL}/api/v1/scout/rates",
                params=params,
                headers={"Authorization": f"Bearer {token}"}
            )
            response.raise_for_status()
            rates = response.json()
        
        output = "ðŸ“Š **Ð¡Ñ‚Ð°Ð²ÐºÐ¸ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ¾Ð²:**\n\n"
        
        for mp, data in rates.items():
            mp_name = {"wildberries": "WB", "ozon": "Ozon", "yandex_market": "YM"}.get(mp, mp)
            output += f"**{mp_name}:** ÐºÐ¾Ð¼Ð¸ÑÑÐ¸Ñ {data.get('commission_pct')}%, "
            output += f"Ð»Ð¾Ð³Ð¸ÑÑ‚Ð¸ÐºÐ° {data.get('logistics_pct')}%, "
            output += f"Ð¸Ñ‚Ð¾Ð³Ð¾ {data.get('total_overhead_pct')}%\n"
        
        return output
    
    async def update_rates(
        self,
        marketplace: str,
        commission_pct: Optional[float] = None,
        logistics_pct: Optional[float] = None,
        return_logistics_pct: Optional[float] = None,
        storage_pct: Optional[float] = None,
        acquiring_pct: Optional[float] = None,
        __user__: dict = {}
    ) -> str:
        """
        ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²Ð¾Ðº Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°.
        
        Args:
            marketplace: ÐšÐ¾Ð´ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ° (wildberries/ozon/yandex_market)
            commission_pct: ÐšÐ¾Ð¼Ð¸ÑÑÐ¸Ñ (%)
            logistics_pct: Ð›Ð¾Ð³Ð¸ÑÑ‚Ð¸ÐºÐ° (%)
            return_logistics_pct: Ð’Ð¾Ð·Ð²Ñ€Ð°Ñ‚Ñ‹ (%)
            storage_pct: Ð¥Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ (%)
            acquiring_pct: Ð­ÐºÐ²Ð°Ð¹Ñ€Ð¸Ð½Ð³ (%)
        
        Returns:
            Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ
        """
        import httpx
        
        user_id = __user__.get("id")
        user_role = __user__.get("role", "")
        token = __user__.get("token", "")
        
        # ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð¿Ñ€Ð°Ð²
        allowed = ["senior", "senior_manager", "director", "admin", "administrator"]
        if user_role.lower() not in allowed:
            return "â›” Ð˜Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²Ð¾Ðº Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð´Ð»Ñ Senior Ð¸ Ð²Ñ‹ÑˆÐµ."
        
        # Ð¤Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ°
        updates = {"marketplace": marketplace}
        
        if commission_pct is not None:
            updates["commission_pct"] = commission_pct
        if logistics_pct is not None:
            updates["logistics_pct"] = logistics_pct
        if return_logistics_pct is not None:
            updates["return_logistics_pct"] = return_logistics_pct
        if storage_pct is not None:
            updates["storage_pct"] = storage_pct
        if acquiring_pct is not None:
            updates["acquiring_pct"] = acquiring_pct
        
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.put(
                f"{self.valves.MIDDLEWARE_URL}/api/v1/scout/rates",
                json=updates,
                headers={"Authorization": f"Bearer {token}"}
            )
            response.raise_for_status()
        
        return f"âœ… Ð¡Ñ‚Ð°Ð²ÐºÐ¸ Ð´Ð»Ñ {marketplace} Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ñ‹."
```

---

## 4.4 REST API Endpoints

### 4.4.1 ÐžÐ±Ð·Ð¾Ñ€ endpoints

| Endpoint | ÐœÐµÑ‚Ð¾Ð´ | ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ | Ð Ð¾Ð»Ð¸ |
|----------|-------|----------|------|
| `/api/v1/scout/analyze` | POST | ÐÐ½Ð°Ð»Ð¸Ð· Ð½Ð¸ÑˆÐ¸ | Senior+ |
| `/api/v1/scout/history` | GET | Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð² | Senior+ |
| `/api/v1/scout/history/{id}` | GET | Ð”ÐµÑ‚Ð°Ð»Ð¸ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° | Senior+ |
| `/api/v1/scout/export` | POST | Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð° | Senior+ |
| `/api/v1/scout/rates` | GET | ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²Ð¾Ðº | Senior+ |
| `/api/v1/scout/rates` | PUT | ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²Ð¾Ðº | Senior+ |
| `/api/v1/scout/settings` | GET | ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ Ð¼Ð¾Ð´ÑƒÐ»Ñ | Admin |
| `/api/v1/scout/settings` | PUT | Ð˜Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ Ð½Ð°ÑÑ‚Ñ€Ð¾ÐµÐº | Admin |

### 4.4.2 POST /api/v1/scout/analyze

**Ð—Ð°Ð¿Ñ€Ð¾Ñ:**

```json
{
  "query": "Ð»ÐµÑ‚Ð½Ð¸Ðµ Ð¿Ð»Ð°Ñ‚ÑŒÑ",
  "cogs": 500,
  "cogs_min": null,
  "cogs_max": null,
  "marketplaces": ["wildberries", "ozon"],
  "user_id": "user_123"
}
```

**ÐžÑ‚Ð²ÐµÑ‚ (200 OK):**

```json
{
  "analysis_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "query": "Ð»ÐµÑ‚Ð½Ð¸Ðµ Ð¿Ð»Ð°Ñ‚ÑŒÑ",
  "marketplaces": ["wildberries", "ozon"],
  
  "verdict": "CONSIDER",
  "color": "yellow",
  "confidence": 0.78,
  
  "summary": "ÐÐ¸ÑˆÐ° Ð¿Ð¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÐµÑ‚ ÑÑ‚Ð°Ð±Ð¸Ð»ÑŒÐ½Ñ‹Ð¹ ÑÐ¿Ñ€Ð¾Ñ, Ð½Ð¾ Ð²Ñ‹ÑÐ¾ÐºÐ°Ñ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ†Ð¸Ñ Ð¸ ÑƒÐ¼ÐµÑ€ÐµÐ½Ð½Ð°Ñ Ð¼Ð°Ñ€Ð¶Ð° Ñ‚Ñ€ÐµÐ±ÑƒÑŽÑ‚ Ñ‚Ñ‰Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾Ð³Ð¾ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° Ð¿Ð¾Ð·Ð¸Ñ†Ð¸Ð¾Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ.",
  
  "metrics": {
    "trend_slope": 0.08,
    "trend_status": "yellow",
    "monopoly_rate": 0.52,
    "monopoly_status": "yellow",
    "expected_margin": 18.5,
    "margin_status": "yellow"
  },
  
  "detailed_analysis": {
    "trend_assessment": "Ð¡Ð¿Ñ€Ð¾Ñ ÑÑ‚Ð°Ð±Ð¸Ð»ÐµÐ½ Ñ Ð½ÐµÐ±Ð¾Ð»ÑŒÑˆÐ¸Ð¼ Ñ€Ð¾ÑÑ‚Ð¾Ð¼...",
    "competition_assessment": "Ð Ñ‹Ð½Ð¾Ðº ÑƒÐ¼ÐµÑ€ÐµÐ½Ð½Ð¾ Ð¼Ð¾Ð½Ð¾Ð¿Ð¾Ð»Ð¸Ð·Ð¸Ñ€Ð¾Ð²Ð°Ð½...",
    "economics_assessment": "ÐœÐ°Ñ€Ð¶Ð¸Ð½Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ Ð½Ð° Ð½Ð¸Ð¶Ð½ÐµÐ¹ Ð³Ñ€Ð°Ð½Ð¸Ñ†Ðµ..."
  },
  
  "unit_economics": {
    "wildberries": {
      "selling_price": 2450,
      "cogs": 500,
      "total_overhead_pct": 24.0,
      "net_profit": 362,
      "net_margin_pct": 14.8,
      "margin_status": "red",
      "break_even_price": 658,
      "target_price_25": 980
    },
    "ozon": {
      "selling_price": 2600,
      "cogs": 500,
      "total_overhead_pct": 29.5,
      "net_profit": 333,
      "net_margin_pct": 12.8,
      "margin_status": "red",
      "break_even_price": 709,
      "target_price_25": 1099
    }
  },
  
  "recommendations": [
    "Ð Ð°ÑÑÐ¼Ð¾Ñ‚Ñ€Ð¸Ñ‚Ðµ Ð½Ð¸ÑˆÐµÐ²Ñ‹Ðµ Ð¿Ð¾Ð´ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸ Ñ Ð¼ÐµÐ½ÑŒÑˆÐµÐ¹ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ†Ð¸ÐµÐ¹",
    "Ð”Ð»Ñ Ð´Ð¾ÑÑ‚Ð¸Ð¶ÐµÐ½Ð¸Ñ Ð¼Ð°Ñ€Ð¶Ð¸ 25% Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ð° Ð·Ð°ÐºÑƒÐ¿Ð¾Ñ‡Ð½Ð°Ñ Ñ†ÐµÐ½Ð° Ð´Ð¾ 350â‚½",
    "Ð¡Ñ„Ð¾ÐºÑƒÑÐ¸Ñ€ÑƒÐ¹Ñ‚ÐµÑÑŒ Ð½Ð° WB â€” overhead Ð½Ð¸Ð¶Ðµ Ð½Ð° 5.5%"
  ],
  
  "risks": [
    {
      "risk": "Ð’Ñ‹ÑÐ¾ÐºÐ°Ñ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ†Ð¸Ñ Ð¾Ñ‚ ÐºÑ€ÑƒÐ¿Ð½Ñ‹Ñ… Ð±Ñ€ÐµÐ½Ð´Ð¾Ð²",
      "probability": "high",
      "mitigation": "Ð£Ð½Ð¸ÐºÐ°Ð»ÑŒÐ½Ð¾Ðµ Ð¿Ð¾Ð·Ð¸Ñ†Ð¸Ð¾Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð¸ Ð½Ð¸ÑˆÐµÐ²Ð¾Ð¹ Ð´Ð¸Ð·Ð°Ð¹Ð½"
    },
    {
      "risk": "Ð¡ÐµÐ·Ð¾Ð½Ð½Ð¾ÑÑ‚ÑŒ ÑÐ¿Ñ€Ð¾ÑÐ°",
      "probability": "medium",
      "mitigation": "ÐŸÐ»Ð°Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð·Ð°ÐºÑƒÐ¿Ð¾Ðº Ñ ÑƒÑ‡Ñ‘Ñ‚Ð¾Ð¼ Ð¿Ð¸ÐºÐ° Ð² Ð°Ð¿Ñ€ÐµÐ»Ðµ-Ð¸ÑŽÐ½Ðµ"
    }
  ],
  
  "opportunities": [
    "Ð Ð¾ÑÑ‚ ÑÐ¿Ñ€Ð¾ÑÐ° Ð½Ð° ÑÐºÐ¾Ð»Ð¾Ð³Ð¸Ñ‡Ð½Ñ‹Ðµ Ð¼Ð°Ñ‚ÐµÑ€Ð¸Ð°Ð»Ñ‹",
    "ÐÐµÐ´Ð¾ÑÑ‚Ð°Ñ‚Ð¾Ðº Ð¿Ñ€ÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ Ð² ÑÐµÐ³Ð¼ÐµÐ½Ñ‚Ðµ plus-size"
  ],
  
  "action_plan": {
    "if_go": [
      "ÐŸÑ€Ð¾Ð²ÐµÑÑ‚Ð¸ Ñ‚ÐµÑÑ‚Ð¾Ð²ÑƒÑŽ Ð¿Ð°Ñ€Ñ‚Ð¸ÑŽ 50-100 ÐµÐ´Ð¸Ð½Ð¸Ñ†",
      "Ð—Ð°Ð¿ÑƒÑÑ‚Ð¸Ñ‚ÑŒ ÑÐ½Ð°Ñ‡Ð°Ð»Ð° Ð½Ð° WB",
      "ÐœÐ¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ñ‚ÑŒ Ð¼Ð°Ñ€Ð¶Ñƒ Ð¿ÐµÑ€Ð²Ñ‹Ðµ 2 Ð½ÐµÐ´ÐµÐ»Ð¸"
    ],
    "if_not": [
      "Ð Ð°ÑÑÐ¼Ð¾Ñ‚Ñ€ÐµÑ‚ÑŒ ÑÐ¼ÐµÐ¶Ð½Ñ‹Ðµ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸: ÑÐ°Ñ€Ð°Ñ„Ð°Ð½Ñ‹, Ñ‚ÑƒÐ½Ð¸ÐºÐ¸",
      "Ð˜ÑÐºÐ°Ñ‚ÑŒ Ð¿Ð¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ¾Ð² Ñ COGS < 400â‚½"
    ]
  },
  
  "price_recommendations": {
    "optimal_price": 2800,
    "min_viable_price": 2200,
    "premium_price": 3500,
    "reasoning": "ÐžÐ¿Ñ‚Ð¸Ð¼Ð°Ð»ÑŒÐ½Ð°Ñ Ñ†ÐµÐ½Ð° 2800â‚½ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡Ð¸Ð²Ð°ÐµÑ‚ Ð¼Ð°Ñ€Ð¶Ñƒ ~22% Ð¿Ñ€Ð¸ Ñ‚ÐµÐºÑƒÑ‰ÐµÐ¼ COGS"
  },
  
  "data_sources": ["wordstat", "watcher", "ozon_analytics"],
  "analyzed_at": "2026-01-21T10:30:00Z",
  "processing_time_ms": 45200
}
```

**ÐžÑˆÐ¸Ð±ÐºÐ¸:**

| ÐšÐ¾Ð´ | ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ |
|-----|----------|
| 400 | ÐÐµ ÑƒÐºÐ°Ð·Ð°Ð½Ð° Ð·Ð°ÐºÑƒÐ¿Ð¾Ñ‡Ð½Ð°Ñ Ñ†ÐµÐ½Ð° Ð¸Ð»Ð¸ Ð½ÐµÐ²Ð°Ð»Ð¸Ð´Ð½Ñ‹Ð¹ Ð·Ð°Ð¿Ñ€Ð¾Ñ |
| 401 | ÐÐµ Ð°Ð²Ñ‚Ð¾Ñ€Ð¸Ð·Ð¾Ð²Ð°Ð½ |
| 403 | ÐÐµÐ´Ð¾ÑÑ‚Ð°Ñ‚Ð¾Ñ‡Ð½Ð¾ Ð¿Ñ€Ð°Ð² (Ñ‚Ñ€ÐµÐ±ÑƒÐµÑ‚ÑÑ Senior+) |
| 500 | Ð’Ð½ÑƒÑ‚Ñ€ÐµÐ½Ð½ÑÑ Ð¾ÑˆÐ¸Ð±ÐºÐ° |
| 504 | Ð¢Ð°Ð¹Ð¼Ð°ÑƒÑ‚ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° |

### 4.4.3 GET /api/v1/scout/history

**ÐŸÐ°Ñ€Ð°Ð¼ÐµÑ‚Ñ€Ñ‹ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ°:**

| ÐŸÐ°Ñ€Ð°Ð¼ÐµÑ‚Ñ€ | Ð¢Ð¸Ð¿ | ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ |
|----------|-----|----------|
| `user_id` | string | ID Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ |
| `limit` | int | ÐšÐ¾Ð»Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾ (default: 10, max: 50) |
| `offset` | int | Ð¡Ð¼ÐµÑ‰ÐµÐ½Ð¸Ðµ Ð´Ð»Ñ Ð¿Ð°Ð³Ð¸Ð½Ð°Ñ†Ð¸Ð¸ |
| `query` | string | Ð¤Ð¸Ð»ÑŒÑ‚Ñ€ Ð¿Ð¾ Ð·Ð°Ð¿Ñ€Ð¾ÑÑƒ |
| `verdict` | string | Ð¤Ð¸Ð»ÑŒÑ‚Ñ€ Ð¿Ð¾ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚Ñƒ (GO/CONSIDER/RISKY) |
| `date_from` | date | ÐÐ°Ñ‡Ð°Ð»Ð¾ Ð¿ÐµÑ€Ð¸Ð¾Ð´Ð° |
| `date_to` | date | ÐšÐ¾Ð½ÐµÑ† Ð¿ÐµÑ€Ð¸Ð¾Ð´Ð° |

**ÐžÑ‚Ð²ÐµÑ‚:**

```json
{
  "total": 42,
  "limit": 10,
  "offset": 0,
  "analyses": [
    {
      "analysis_id": "a1b2c3d4-...",
      "query": "Ð»ÐµÑ‚Ð½Ð¸Ðµ Ð¿Ð»Ð°Ñ‚ÑŒÑ",
      "marketplaces": ["wildberries", "ozon"],
      "verdict": "CONSIDER",
      "metrics": {
        "trend_slope": 0.08,
        "monopoly_rate": 0.52,
        "expected_margin": 18.5
      },
      "analyzed_at": "2026-01-21T10:30:00Z"
    }
  ]
}
```

### 4.4.4 POST /api/v1/scout/export

**Ð—Ð°Ð¿Ñ€Ð¾Ñ:**

```json
{
  "analysis_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "format": "pdf",
  "user_id": "user_123"
}
```

**ÐžÑ‚Ð²ÐµÑ‚:**

```json
{
  "export_id": "exp_123",
  "format": "pdf",
  "status": "ready",
  "download_url": "https://storage.adolf.local/exports/scout_a1b2c3d4_20260121.pdf",
  "expires_at": "2026-01-22T10:30:00Z",
  "file_size_bytes": 245760
}
```

### 4.4.5 GET/PUT /api/v1/scout/rates

**GET Response:**

```json
{
  "wildberries": {
    "marketplace": "wildberries",
    "category": "default",
    "commission_pct": 15.0,
    "logistics_pct": 5.0,
    "return_logistics_pct": 3.0,
    "storage_pct": 1.0,
    "acquiring_pct": 0.0,
    "total_overhead_pct": 24.0,
    "updated_at": "2026-01-15T12:00:00Z",
    "updated_by": "user_456"
  },
  "ozon": { ... },
  "yandex_market": { ... }
}
```

**PUT Request:**

```json
{
  "marketplace": "wildberries",
  "commission_pct": 16.0,
  "logistics_pct": 5.5
}
```

---

## 4.5 Ð˜Ð½Ñ‚ÐµÑ€Ñ„ÐµÐ¹Ñ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ

### 4.5.1 ÐšÐ¾Ð¼Ð¿Ð¾Ð½ÐµÐ½Ñ‚Ñ‹ UI

```mermaid
flowchart TB
    subgraph CHAT["Chat Interface"]
        INPUT["Ð’Ð²Ð¾Ð´ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ°"]
        PROGRESS["Progress Indicator"]
        RESULT["Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Ð°Ð½Ð°Ð»Ð¸Ð·Ð°"]
        BUTTONS["Action Buttons"]
    end
    
    subgraph RESULT_CARD["Result Card"]
        VERDICT_BADGE["Verdict Badge"]
        METRICS_TABLE["Metrics Table"]
        UNIT_ECON["Unit Economics"]
        RECS_LIST["Recommendations"]
        RISKS_LIST["Risks"]
    end
    
    subgraph ACTIONS["Actions"]
        EXPORT_PDF["Export PDF"]
        EXPORT_XLSX["Export Excel"]
        VIEW_HISTORY["View History"]
        NEW_ANALYSIS["New Analysis"]
    end
    
    INPUT --> PROGRESS
    PROGRESS --> RESULT
    RESULT --> VERDICT_BADGE
    RESULT --> METRICS_TABLE
    RESULT --> UNIT_ECON
    RESULT --> RECS_LIST
    RESULT --> RISKS_LIST
    
    RESULT --> BUTTONS
    BUTTONS --> EXPORT_PDF
    BUTTONS --> EXPORT_XLSX
    BUTTONS --> VIEW_HISTORY
    BUTTONS --> NEW_ANALYSIS
```

### 4.5.2 CSS ÑÑ‚Ð¸Ð»Ð¸ Ð´Ð»Ñ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð°

```css
/* styles/scout.css */

.scout-verdict {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.scout-verdict.go {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border-left: 4px solid #28a745;
}

.scout-verdict.consider {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%);
  border-left: 4px solid #ffc107;
}

.scout-verdict.risky {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  border-left: 4px solid #dc3545;
}

.scout-verdict-icon {
  font-size: 32px;
}

.scout-verdict-text {
  font-size: 24px;
  font-weight: 600;
}

.scout-metrics-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.scout-metrics-table th,
.scout-metrics-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.scout-metrics-table .status-green { color: #28a745; }
.scout-metrics-table .status-yellow { color: #ffc107; }
.scout-metrics-table .status-red { color: #dc3545; }

.scout-unit-economics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 16px 0;
}

.scout-mp-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.scout-mp-card h4 {
  margin: 0 0 12px 0;
  color: #333;
}

.scout-mp-card .metric {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}

.scout-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.scout-actions button {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.scout-actions button:hover {
  background: #f0f0f0;
  border-color: #bbb;
}

.scout-recommendations {
  background: #e8f4fd;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
}

.scout-risks {
  background: #fff5f5;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
}

.scout-opportunities {
  background: #f0fff4;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
}
```

### 4.5.3 ÐŸÑ€Ð¸Ð¼ÐµÑ€ Ð¾Ñ‚Ð¾Ð±Ñ€Ð°Ð¶ÐµÐ½Ð¸Ñ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð°

```html
<!-- ÐŸÑ€Ð¸Ð¼ÐµÑ€ HTML-ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ñ‹ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð° -->
<div class="scout-result">
  
  <!-- Ð’ÐµÑ€Ð´Ð¸ÐºÑ‚ -->
  <div class="scout-verdict consider">
    <span class="scout-verdict-icon">ðŸŸ¡</span>
    <span class="scout-verdict-text">CONSIDER</span>
  </div>
  
  <p class="scout-summary">
    <em>ÐÐ¸ÑˆÐ° Ð¿Ð¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÐµÑ‚ ÑÑ‚Ð°Ð±Ð¸Ð»ÑŒÐ½Ñ‹Ð¹ ÑÐ¿Ñ€Ð¾Ñ, Ð½Ð¾ Ð²Ñ‹ÑÐ¾ÐºÐ°Ñ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ†Ð¸Ñ Ð¸ ÑƒÐ¼ÐµÑ€ÐµÐ½Ð½Ð°Ñ Ð¼Ð°Ñ€Ð¶Ð° 
    Ñ‚Ñ€ÐµÐ±ÑƒÑŽÑ‚ Ñ‚Ñ‰Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾Ð³Ð¾ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° Ð¿Ð¾Ð·Ð¸Ñ†Ð¸Ð¾Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ.</em>
  </p>
  
  <!-- ÐœÐµÑ‚Ñ€Ð¸ÐºÐ¸ -->
  <h3>ðŸ“Š ÐšÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ðµ Ð¼ÐµÑ‚Ñ€Ð¸ÐºÐ¸</h3>
  <table class="scout-metrics-table">
    <tr>
      <th>ÐœÐµÑ‚Ñ€Ð¸ÐºÐ°</th>
      <th>Ð—Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ</th>
      <th>Ð¡Ñ‚Ð°Ñ‚ÑƒÑ</th>
    </tr>
    <tr>
      <td>Ð¢Ñ€ÐµÐ½Ð´ ÑÐ¿Ñ€Ð¾ÑÐ°</td>
      <td>+0.08</td>
      <td class="status-yellow">ðŸŸ¡</td>
    </tr>
    <tr>
      <td>ÐœÐ¾Ð½Ð¾Ð¿Ð¾Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ</td>
      <td>52%</td>
      <td class="status-yellow">ðŸŸ¡</td>
    </tr>
    <tr>
      <td>ÐžÐ¶Ð¸Ð´. Ð¼Ð°Ñ€Ð¶Ð°</td>
      <td>18.5%</td>
      <td class="status-yellow">ðŸŸ¡</td>
    </tr>
  </table>
  
  <!-- Unit-ÑÐºÐ¾Ð½Ð¾Ð¼Ð¸ÐºÐ° -->
  <h3>ðŸ’° Unit-ÑÐºÐ¾Ð½Ð¾Ð¼Ð¸ÐºÐ°</h3>
  <div class="scout-unit-economics">
    <div class="scout-mp-card">
      <h4>Wildberries</h4>
      <div class="metric"><span>Ð¦ÐµÐ½Ð° Ð¿Ñ€Ð¾Ð´Ð°Ð¶Ð¸:</span><span>2 450 â‚½</span></div>
      <div class="metric"><span>Ð¡ÐµÐ±ÐµÑÑ‚Ð¾Ð¸Ð¼Ð¾ÑÑ‚ÑŒ:</span><span>500 â‚½</span></div>
      <div class="metric"><span>Ð Ð°ÑÑ…Ð¾Ð´Ñ‹ ÐœÐŸ:</span><span>24.0%</span></div>
      <div class="metric"><span>Ð§Ð¸ÑÑ‚Ð°Ñ Ð¿Ñ€Ð¸Ð±Ñ‹Ð»ÑŒ:</span><span>362 â‚½</span></div>
      <div class="metric"><span>Ð§Ð¸ÑÑ‚Ð°Ñ Ð¼Ð°Ñ€Ð¶Ð°:</span><strong>14.8%</strong></div>
    </div>
    <div class="scout-mp-card">
      <h4>Ozon</h4>
      <div class="metric"><span>Ð¦ÐµÐ½Ð° Ð¿Ñ€Ð¾Ð´Ð°Ð¶Ð¸:</span><span>2 600 â‚½</span></div>
      <div class="metric"><span>Ð¡ÐµÐ±ÐµÑÑ‚Ð¾Ð¸Ð¼Ð¾ÑÑ‚ÑŒ:</span><span>500 â‚½</span></div>
      <div class="metric"><span>Ð Ð°ÑÑ…Ð¾Ð´Ñ‹ ÐœÐŸ:</span><span>29.5%</span></div>
      <div class="metric"><span>Ð§Ð¸ÑÑ‚Ð°Ñ Ð¿Ñ€Ð¸Ð±Ñ‹Ð»ÑŒ:</span><span>333 â‚½</span></div>
      <div class="metric"><span>Ð§Ð¸ÑÑ‚Ð°Ñ Ð¼Ð°Ñ€Ð¶Ð°:</span><strong>12.8%</strong></div>
    </div>
  </div>
  
  <!-- Ð ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸ -->
  <div class="scout-recommendations">
    <h3>ðŸ’¡ Ð ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸</h3>
    <ol>
      <li>Ð Ð°ÑÑÐ¼Ð¾Ñ‚Ñ€Ð¸Ñ‚Ðµ Ð½Ð¸ÑˆÐµÐ²Ñ‹Ðµ Ð¿Ð¾Ð´ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸ Ñ Ð¼ÐµÐ½ÑŒÑˆÐµÐ¹ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ†Ð¸ÐµÐ¹</li>
      <li>Ð”Ð»Ñ Ð´Ð¾ÑÑ‚Ð¸Ð¶ÐµÐ½Ð¸Ñ Ð¼Ð°Ñ€Ð¶Ð¸ 25% Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ð° Ð·Ð°ÐºÑƒÐ¿Ð¾Ñ‡Ð½Ð°Ñ Ñ†ÐµÐ½Ð° Ð´Ð¾ 350â‚½</li>
      <li>Ð¡Ñ„Ð¾ÐºÑƒÑÐ¸Ñ€ÑƒÐ¹Ñ‚ÐµÑÑŒ Ð½Ð° WB â€” overhead Ð½Ð¸Ð¶Ðµ Ð½Ð° 5.5%</li>
    </ol>
  </div>
  
  <!-- Ð Ð¸ÑÐºÐ¸ -->
  <div class="scout-risks">
    <h3>âš ï¸ Ð Ð¸ÑÐºÐ¸</h3>
    <ul>
      <li>
        <strong>Ð’Ñ‹ÑÐ¾ÐºÐ°Ñ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ†Ð¸Ñ Ð¾Ñ‚ ÐºÑ€ÑƒÐ¿Ð½Ñ‹Ñ… Ð±Ñ€ÐµÐ½Ð´Ð¾Ð²</strong> (high)
        <br><em>ÐœÐ¸Ñ‚Ð¸Ð³Ð°Ñ†Ð¸Ñ: Ð£Ð½Ð¸ÐºÐ°Ð»ÑŒÐ½Ð¾Ðµ Ð¿Ð¾Ð·Ð¸Ñ†Ð¸Ð¾Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð¸ Ð½Ð¸ÑˆÐµÐ²Ð¾Ð¹ Ð´Ð¸Ð·Ð°Ð¹Ð½</em>
      </li>
      <li>
        <strong>Ð¡ÐµÐ·Ð¾Ð½Ð½Ð¾ÑÑ‚ÑŒ ÑÐ¿Ñ€Ð¾ÑÐ°</strong> (medium)
        <br><em>ÐœÐ¸Ñ‚Ð¸Ð³Ð°Ñ†Ð¸Ñ: ÐŸÐ»Ð°Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð·Ð°ÐºÑƒÐ¿Ð¾Ðº Ñ ÑƒÑ‡Ñ‘Ñ‚Ð¾Ð¼ Ð¿Ð¸ÐºÐ° Ð² Ð°Ð¿Ñ€ÐµÐ»Ðµ-Ð¸ÑŽÐ½Ðµ</em>
      </li>
    </ul>
  </div>
  
  <!-- ÐšÐ½Ð¾Ð¿ÐºÐ¸ -->
  <div class="scout-actions">
    <button onclick="exportPDF()">ðŸ“¥ Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚ PDF</button>
    <button onclick="exportExcel()">ðŸ“Š Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚ Excel</button>
    <button onclick="viewHistory()">ðŸ“‹ Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ñ</button>
  </div>
  
  <hr>
  <small>ID Ð°Ð½Ð°Ð»Ð¸Ð·Ð°: a1b2c3d4... | 2026-01-21</small>
  
</div>
```

---

## 4.6 Ð¡Ñ†ÐµÐ½Ð°Ñ€Ð¸Ð¸ Ð²Ð·Ð°Ð¸Ð¼Ð¾Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ

### 4.6.1 Ð‘Ð°Ð·Ð¾Ð²Ñ‹Ð¹ Ð°Ð½Ð°Ð»Ð¸Ð· Ð½Ð¸ÑˆÐ¸

```
ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒ: ÐŸÑ€Ð¾Ð°Ð½Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÐ¹ Ð½Ð¸ÑˆÑƒ Ð»ÐµÑ‚Ð½Ð¸Ñ… Ð¿Ð»Ð°Ñ‚ÑŒÐµÐ² Ð½Ð° Wildberries, Ð·Ð°ÐºÑƒÐ¿ÐºÐ° 500 Ñ€ÑƒÐ±Ð»ÐµÐ¹

Ð¡Ð¸ÑÑ‚ÐµÐ¼Ð°: ðŸ” **ÐÐ½Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÑŽ Ð½Ð¸ÑˆÑƒ...**
         [Ð¿Ñ€Ð¾Ð³Ñ€ÐµÑÑ-Ð¸Ð½Ð´Ð¸ÐºÐ°Ñ‚Ð¾Ñ€]

Ð¡Ð¸ÑÑ‚ÐµÐ¼Ð°: ## ðŸŸ¡ Ð’ÐµÑ€Ð´Ð¸ÐºÑ‚: **CONSIDER**
         
         _ÐÐ¸ÑˆÐ° Ð¿Ð¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÐµÑ‚ ÑÑ‚Ð°Ð±Ð¸Ð»ÑŒÐ½Ñ‹Ð¹ ÑÐ¿Ñ€Ð¾Ñ, Ð½Ð¾ Ð²Ñ‹ÑÐ¾ÐºÐ°Ñ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ†Ð¸Ñ..._
         
         ### ðŸ“Š ÐšÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ðµ Ð¼ÐµÑ‚Ñ€Ð¸ÐºÐ¸
         | ÐœÐµÑ‚Ñ€Ð¸ÐºÐ° | Ð—Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ | Ð¡Ñ‚Ð°Ñ‚ÑƒÑ |
         |---------|----------|--------|
         | Ð¢Ñ€ÐµÐ½Ð´ ÑÐ¿Ñ€Ð¾ÑÐ° | +0.08 | ðŸŸ¡ |
         | ÐœÐ¾Ð½Ð¾Ð¿Ð¾Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ | 52% | ðŸŸ¡ |
         | ÐžÐ¶Ð¸Ð´. Ð¼Ð°Ñ€Ð¶Ð° | 18.5% | ðŸŸ¡ |
         
         ...
```

### 4.6.2 ÐÐ½Ð°Ð»Ð¸Ð· Ñ Ð´Ð¸Ð°Ð¿Ð°Ð·Ð¾Ð½Ð¾Ð¼ COGS

```
ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒ: ÐžÑ†ÐµÐ½Ð¸ Ð½Ð¸ÑˆÑƒ Ð´ÐµÑ‚ÑÐºÐ¸Ñ… ÐºÐ¾Ð¼Ð±Ð¸Ð½ÐµÐ·Ð¾Ð½Ð¾Ð² Ð½Ð° Ozon, Ð·Ð°ÐºÑƒÐ¿ÐºÐ° Ð¾Ñ‚ 800 Ð´Ð¾ 1200 Ñ€ÑƒÐ±Ð»ÐµÐ¹

Ð¡Ð¸ÑÑ‚ÐµÐ¼Ð°: ðŸ” **ÐÐ½Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÑŽ Ð½Ð¸ÑˆÑƒ...**

Ð¡Ð¸ÑÑ‚ÐµÐ¼Ð°: ## ðŸŸ¢ Ð’ÐµÑ€Ð´Ð¸ÐºÑ‚: **GO**
         
         _ÐŸÑ€Ð¸ Ð¾Ð¿Ñ‚Ð¸Ð¼Ð°Ð»ÑŒÐ½Ð¾Ð¹ Ð·Ð°ÐºÑƒÐ¿Ð¾Ñ‡Ð½Ð¾Ð¹ Ñ†ÐµÐ½Ðµ 800â‚½ Ð½Ð¸ÑˆÐ° Ð¿Ð¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÐµÑ‚ Ñ…Ð¾Ñ€Ð¾ÑˆÐ¸Ðµ Ð¿Ð¾ÐºÐ°Ð·Ð°Ñ‚ÐµÐ»Ð¸..._
         
         ### ðŸ’° Unit-ÑÐºÐ¾Ð½Ð¾Ð¼Ð¸ÐºÐ° (Ð´Ð¸Ð°Ð¿Ð°Ð·Ð¾Ð½ COGS)
         
         | COGS | ÐœÐ°Ñ€Ð¶Ð° | ÐŸÑ€Ð¸Ð±Ñ‹Ð»ÑŒ |
         |------|-------|---------|
         | 800 â‚½ (min) | 28.5% | 855 â‚½ |
         | 1000 â‚½ (avg) | 22.1% | 663 â‚½ |
         | 1200 â‚½ (max) | 15.7% | 471 â‚½ |
         
         **Ð ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ñ:** Ð”ÐµÑ€Ð¶Ð¸Ñ‚Ðµ COGS Ð½Ð¸Ð¶Ðµ 1000â‚½ Ð´Ð»Ñ Ð·ÐµÐ»Ñ‘Ð½Ð¾Ð¹ Ð¼Ð°Ñ€Ð¶Ð¸.
```

### 4.6.3 ÐŸÑ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€ Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ð¸

```
ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒ: ÐŸÐ¾ÐºÐ°Ð¶Ð¸ Ð¿Ð¾ÑÐ»ÐµÐ´Ð½Ð¸Ðµ 5 Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð²

Ð¡Ð¸ÑÑ‚ÐµÐ¼Ð°: ## ðŸ“‹ Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð²
         
         | Ð”Ð°Ñ‚Ð° | Ð—Ð°Ð¿Ñ€Ð¾Ñ | Ð’ÐµÑ€Ð´Ð¸ÐºÑ‚ | ÐœÐ°Ñ€Ð¶Ð° |
         |------|--------|---------|-------|
         | 2026-01-21 | Ð»ÐµÑ‚Ð½Ð¸Ðµ Ð¿Ð»Ð°Ñ‚ÑŒÑ | ðŸŸ¡ CONSIDER | 18.5% |
         | 2026-01-20 | Ð´ÐµÑ‚ÑÐºÐ¸Ðµ ÐºÐ¾Ð¼Ð±Ð¸Ð½ÐµÐ·Ð¾Ð½Ñ‹ | ðŸŸ¢ GO | 28.5% |
         | 2026-01-18 | Ð¶ÐµÐ½ÑÐºÐ¸Ðµ ÑÑƒÐ¼ÐºÐ¸ | ðŸ”´ RISKY | 12.1% |
         | 2026-01-15 | Ð¼ÑƒÐ¶ÑÐºÐ¸Ðµ Ñ„ÑƒÑ‚Ð±Ð¾Ð»ÐºÐ¸ | ðŸŸ¢ GO | 31.2% |
         | 2026-01-12 | ÐºÑ€Ð¾ÑÑÐ¾Ð²ÐºÐ¸ ÑÐ¿Ð¾Ñ€Ñ‚Ð¸Ð²Ð½Ñ‹Ðµ | ðŸŸ¡ CONSIDER | 19.8% |
         
         _Ð”Ð»Ñ Ð´ÐµÑ‚Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð¿Ñ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€Ð° ÑƒÐºÐ°Ð¶Ð¸Ñ‚Ðµ ID Ð°Ð½Ð°Ð»Ð¸Ð·Ð°._
```

### 4.6.4 Ð˜Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²Ð¾Ðº

```
ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒ: ÐŸÐ¾ÐºÐ°Ð¶Ð¸ Ñ‚ÐµÐºÑƒÑ‰Ð¸Ðµ ÑÑ‚Ð°Ð²ÐºÐ¸

Ð¡Ð¸ÑÑ‚ÐµÐ¼Ð°: ## ðŸ“Š Ð¢ÐµÐºÑƒÑ‰Ð¸Ðµ ÑÑ‚Ð°Ð²ÐºÐ¸ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ¾Ð²
         
         | Ð¡Ñ‚Ð°Ñ‚ÑŒÑ | Wildberries | Ozon | Ð¯Ð½Ð´ÐµÐºÑ.ÐœÐ°Ñ€ÐºÐµÑ‚ |
         |--------|:-----------:|:----:|:-------------:|
         | ÐšÐ¾Ð¼Ð¸ÑÑÐ¸Ñ | 15% | 18% | 15% |
         | Ð›Ð¾Ð³Ð¸ÑÑ‚Ð¸ÐºÐ° | 5% | 6% | 7% |
         | Ð’Ð¾Ð·Ð²Ñ€Ð°Ñ‚Ñ‹ | 3% | 4% | 4% |
         | Ð¥Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ | 1% | 1.5% | 1% |
         | Ð­ÐºÐ²Ð°Ð¹Ñ€Ð¸Ð½Ð³ | 0% | 0% | 1.5% |
         | **Ð˜Ñ‚Ð¾Ð³Ð¾** | **24%** | **29.5%** | **28.5%** |
         
         _Ð¡Ñ‚Ð°Ð²ÐºÐ¸ Ð¼Ð¾Ð¶Ð½Ð¾ Ð¸Ð·Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ (Senior+): Â«Ð˜Ð·Ð¼ÐµÐ½Ð¸ ÑÑ‚Ð°Ð²ÐºÐ¸Â»_

ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒ: Ð£ÑÑ‚Ð°Ð½Ð¾Ð²Ð¸ ÐºÐ¾Ð¼Ð¸ÑÑÐ¸ÑŽ WB 16%

Ð¡Ð¸ÑÑ‚ÐµÐ¼Ð°: âœ… Ð¡Ñ‚Ð°Ð²ÐºÐ¸ Ð´Ð»Ñ wildberries Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ñ‹.
         
         ÐÐ¾Ð²Ñ‹Ðµ Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ñ:
         - ÐšÐ¾Ð¼Ð¸ÑÑÐ¸Ñ: 16% (Ð±Ñ‹Ð»Ð¾ 15%)
         - Ð˜Ñ‚Ð¾Ð³Ð¾ overhead: 25%
```

---

## 4.7 ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð¾ÑˆÐ¸Ð±Ð¾Ðº

### 4.7.1 Ð¢Ð¸Ð¿Ð¸Ñ‡Ð½Ñ‹Ðµ Ð¾ÑˆÐ¸Ð±ÐºÐ¸

| Ð¡Ð¸Ñ‚ÑƒÐ°Ñ†Ð¸Ñ | Ð¡Ð¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ðµ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŽ |
|----------|------------------------|
| ÐÐµ ÑƒÐºÐ°Ð·Ð°Ð½ COGS | Â«âš ï¸ ÐŸÐ¾Ð¶Ð°Ð»ÑƒÐ¹ÑÑ‚Ð°, ÑƒÐºÐ°Ð¶Ð¸Ñ‚Ðµ Ð·Ð°ÐºÑƒÐ¿Ð¾Ñ‡Ð½ÑƒÑŽ Ñ†ÐµÐ½Ñƒ. ÐŸÑ€Ð¸Ð¼ÐµÑ€: ...Â» |
| ÐÐµÑ‚ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð° | Â«â›” Ð”Ð¾ÑÑ‚ÑƒÐ¿ Ðº Ð¼Ð¾Ð´ÑƒÐ»ÑŽ Scout Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½. Ð¢Ñ€ÐµÐ±ÑƒÐµÑ‚ÑÑ Ñ€Ð¾Ð»ÑŒ Senior Ð¸Ð»Ð¸ Ð²Ñ‹ÑˆÐµ.Â» |
| Ð¢Ð°Ð¹Ð¼Ð°ÑƒÑ‚ | Â«â±ï¸ ÐŸÑ€ÐµÐ²Ñ‹ÑˆÐµÐ½Ð¾ Ð²Ñ€ÐµÐ¼Ñ Ð¾Ð¶Ð¸Ð´Ð°Ð½Ð¸Ñ. ÐŸÐ¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ Ð¿Ð¾Ð²Ñ‚Ð¾Ñ€Ð¸Ñ‚ÑŒ Ð·Ð°Ð¿Ñ€Ð¾Ñ.Â» |
| Ð˜ÑÑ‚Ð¾Ñ‡Ð½Ð¸Ðº Ð½ÐµÐ´Ð¾ÑÑ‚ÑƒÐ¿ÐµÐ½ | Â«âš ï¸ Ð§Ð°ÑÑ‚ÑŒ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð²Ñ€ÐµÐ¼ÐµÐ½Ð½Ð¾ Ð½ÐµÐ´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð°. Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Ð¼Ð¾Ð¶ÐµÑ‚ Ð±Ñ‹Ñ‚ÑŒ Ð½ÐµÐ¿Ð¾Ð»Ð½Ñ‹Ð¼.Â» |
| ÐÐµÐ²Ð°Ð»Ð¸Ð´Ð½Ñ‹Ð¹ URL | Â«âš ï¸ ÐÐµ ÑƒÐ´Ð°Ð»Ð¾ÑÑŒ Ñ€Ð°ÑÐ¿Ð¾Ð·Ð½Ð°Ñ‚ÑŒ URL. ÐŸÐ¾Ð´Ð´ÐµÑ€Ð¶Ð¸Ð²Ð°ÑŽÑ‚ÑÑ: WB, Ozon, Ð¯Ð½Ð´ÐµÐºÑ.ÐœÐ°Ñ€ÐºÐµÑ‚Â» |

### 4.7.2 Graceful Degradation Ð² UI

```python
async def _handle_analyze_with_fallback(self, ...):
    """ÐÐ½Ð°Ð»Ð¸Ð· Ñ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¾Ð¹ Ñ‡Ð°ÑÑ‚Ð¸Ñ‡Ð½Ñ‹Ñ… Ð¾ÑˆÐ¸Ð±Ð¾Ðº."""
    
    try:
        result = await self._request_analyze(...)
        
        # ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ñ‡Ð°ÑÑ‚Ð¸Ñ‡Ð½Ñ‹Ñ… Ð¾ÑˆÐ¸Ð±Ð¾Ðº
        if result.get("sources_failed"):
            yield f"âš ï¸ _ÐÐµÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¸ Ð½ÐµÐ´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹: {', '.join(result['sources_failed'])}_\n\n"
        
        yield self._format_verdict_result(result)
        
    except PartialDataError as e:
        yield f"âš ï¸ ÐÐ½Ð°Ð»Ð¸Ð· Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½ Ñ Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð¸ÑÐ¼Ð¸:\n{e.message}\n\n"
        yield self._format_verdict_result(e.partial_result)
    
    except CriticalError as e:
        yield f"âŒ {e.user_message}"
        yield "\n\nÐŸÐ¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ:\n"
        yield "- ÐŸÐ¾Ð²Ñ‚Ð¾Ñ€Ð¸Ñ‚ÑŒ Ð·Ð°Ð¿Ñ€Ð¾Ñ Ð¿Ð¾Ð·Ð¶Ðµ\n"
        yield "- Ð£Ð¿Ñ€Ð¾ÑÑ‚Ð¸Ñ‚ÑŒ Ð·Ð°Ð¿Ñ€Ð¾Ñ\n"
        yield "- ÐžÐ±Ñ€Ð°Ñ‚Ð¸Ñ‚ÑŒÑÑ Ðº Ð°Ð´Ð¼Ð¸Ð½Ð¸ÑÑ‚Ñ€Ð°Ñ‚Ð¾Ñ€Ñƒ"
```

---

**Ð”Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚ Ð¿Ð¾Ð´Ð³Ð¾Ñ‚Ð¾Ð²Ð»ÐµÐ½:** Ð¯Ð½Ð²Ð°Ñ€ÑŒ 2026  
**Ð’ÐµÑ€ÑÐ¸Ñ:** 1.0  
**Ð¡Ñ‚Ð°Ñ‚ÑƒÑ:** Ð§ÐµÑ€Ð½Ð¾Ð²Ð¸Ðº

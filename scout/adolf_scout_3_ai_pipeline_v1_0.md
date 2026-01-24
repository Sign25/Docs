# ADOLF SCOUT â€” Ð Ð°Ð·Ð´ÐµÐ» 3: AI Pipeline

**ÐŸÑ€Ð¾ÐµÐºÑ‚:** ÐŸÑ€ÐµÐ´Ð¸ÐºÑ‚Ð¸Ð²Ð½Ð°Ñ Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ñ‚Ð¾Ð²Ð°Ñ€Ð½Ñ‹Ñ… Ð½Ð¸Ñˆ  
**ÐœÐ¾Ð´ÑƒÐ»ÑŒ:** Scout / AI Pipeline  
**Ð’ÐµÑ€ÑÐ¸Ñ:** 1.0  
**Ð”Ð°Ñ‚Ð°:** Ð¯Ð½Ð²Ð°Ñ€ÑŒ 2026

---

## 3.1 ÐžÐ±Ð·Ð¾Ñ€ AI Pipeline

### ÐÑ€Ñ…Ð¸Ñ‚ÐµÐºÑ‚ÑƒÑ€Ð° pipeline

```mermaid
flowchart TB
    subgraph INPUT["Ð’Ñ…Ð¾Ð´Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ"]
        USER_INPUT["Ð—Ð°Ð¿Ñ€Ð¾Ñ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ"]
        COGS["Ð—Ð°ÐºÑƒÐ¿Ð¾Ñ‡Ð½Ð°Ñ Ñ†ÐµÐ½Ð°"]
    end

    subgraph STAGE1["Ð­Ñ‚Ð°Ð¿ 1: ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³"]
        PARSER["Input Parser"]
    end

    subgraph STAGE2["Ð­Ñ‚Ð°Ð¿ 2: Ð¡Ð±Ð¾Ñ€ Ð´Ð°Ð½Ð½Ñ‹Ñ…"]
        TREND["Trend Miner<br/>(GPT-5 mini)"]
        COMP["Competitor Analyzer<br/>(GPT-5 mini)"]
        UNIT["Unit Calculator"]
    end

    subgraph STAGE3["Ð­Ñ‚Ð°Ð¿ 3: ÐÐ½Ð°Ð»Ð¸Ð·"]
        METRICS["Metrics Aggregator"]
        CLASSIFY["Status Classifier"]
    end

    subgraph STAGE4["Ð­Ñ‚Ð°Ð¿ 4: Ð’ÐµÑ€Ð´Ð¸ÐºÑ‚"]
        VERDICT["AI Verdict Engine<br/>(Claude Opus 4.5)"]
    end

    subgraph OUTPUT["Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚"]
        RESULT["VerdictResult"]
    end

    USER_INPUT --> PARSER
    COGS --> PARSER
    
    PARSER --> TREND
    PARSER --> COMP
    PARSER --> UNIT
    
    TREND --> METRICS
    COMP --> METRICS
    UNIT --> METRICS
    
    METRICS --> CLASSIFY
    CLASSIFY --> VERDICT
    
    VERDICT --> RESULT
```

### Ð Ð°ÑÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ AI-Ð¼Ð¾Ð´ÐµÐ»ÐµÐ¹

| Ð­Ñ‚Ð°Ð¿ | ÐœÐ¾Ð´ÐµÐ»ÑŒ | ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ | Tokens/Ð·Ð°Ð¿Ñ€Ð¾Ñ |
|------|--------|------------|:-------------:|
| Trend Mining | GPT-5 mini | ÐÐ¾Ñ€Ð¼Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ, Ð°Ð³Ñ€ÐµÐ³Ð°Ñ†Ð¸Ñ Ñ‚Ñ€ÐµÐ½Ð´Ð¾Ð² | ~500 |
| Competitor Analysis | GPT-5 mini | ÐÐ½Ð°Ð»Ð¸Ð· ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ñ‹ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð¾Ð² | ~800 |
| AI Verdict | Claude Opus 4.5 | Ð¤Ð¸Ð½Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚, Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸ | ~2000 |

---

## 3.2 Input Parser

### 3.2.1 ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

Ð Ð°Ð·Ð±Ð¾Ñ€ Ð¸ Ð½Ð¾Ñ€Ð¼Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð²Ñ…Ð¾Ð´Ð½Ñ‹Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¾Ñ‚ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ Ð² ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ð¹ Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚.

### 3.2.2 ÐŸÐ¾Ð´Ð´ÐµÑ€Ð¶Ð¸Ð²Ð°ÐµÐ¼Ñ‹Ðµ Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚Ñ‹

```mermaid
flowchart LR
    INPUT["Ð’Ð²Ð¾Ð´"] --> DETECT{"ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ Ñ‚Ð¸Ð¿Ð°"}
    
    DETECT -->|URL| URL_BRANCH["URL Parser"]
    DETECT -->|Ð¢ÐµÐºÑÑ‚| TEXT_BRANCH["Text Parser"]
    
    URL_BRANCH --> WB_URL{"WB?"}
    URL_BRANCH --> OZON_URL{"Ozon?"}
    URL_BRANCH --> YM_URL{"YM?"}
    
    TEXT_BRANCH --> NLP["NLP + Keywords"]
    
    WB_URL --> EXTRACT["Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ Ð¿Ð°Ñ€Ð°Ð¼ÐµÑ‚Ñ€Ð¾Ð²"]
    OZON_URL --> EXTRACT
    YM_URL --> EXTRACT
    NLP --> EXTRACT
    
    EXTRACT --> OUTPUT["ParsedInput"]
```

### 3.2.3 Ð ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ

```python
# services/input_parser.py

import re
from typing import Optional, List, Tuple
from dataclasses import dataclass, field
from urllib.parse import urlparse, parse_qs

@dataclass
class ParsedInput:
    """Ð Ð°Ð·Ð¾Ð±Ñ€Ð°Ð½Ð½Ñ‹Ð¹ Ð²Ð²Ð¾Ð´ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ."""
    marketplaces: List[str]
    query: str
    category_url: Optional[str] = None
    cogs: float = 0.0
    cogs_min: Optional[float] = None
    cogs_max: Optional[float] = None
    raw_input: str = ""
    parse_confidence: float = 1.0


class InputParser:
    """ÐŸÐ°Ñ€ÑÐµÑ€ Ð²Ñ…Ð¾Ð´Ð½Ñ‹Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ."""
    
    # ÐŸÐ°Ñ‚Ñ‚ÐµÑ€Ð½Ñ‹ URL
    URL_PATTERNS = {
        "wildberries": {
            "category": r"wildberries\.ru/catalog/([^/\?]+(?:/[^/\?]+)*)",
            "search": r"wildberries\.ru/catalog/0/search\.aspx\?.*search=([^&]+)",
            "product": r"wildberries\.ru/catalog/(\d+)/detail"
        },
        "ozon": {
            "category": r"ozon\.ru/category/([^/\?]+)-(\d+)",
            "search": r"ozon\.ru/search/?\?.*text=([^&]+)",
            "product": r"ozon\.ru/product/[^/]+-(\d+)"
        },
        "yandex_market": {
            "category": r"market\.yandex\.ru/catalog--([^/]+)/(\d+)",
            "search": r"market\.yandex\.ru/search\?.*text=([^&]+)",
            "product": r"market\.yandex\.ru/product/(\d+)"
        }
    }
    
    # ÐŸÐ°Ñ‚Ñ‚ÐµÑ€Ð½Ñ‹ COGS
    COGS_PATTERNS = [
        r"(?:cogs|ÑÐµÐ±ÐµÑÑ‚Ð¾Ð¸Ð¼Ð¾ÑÑ‚ÑŒ|Ð·Ð°ÐºÑƒÐ¿Ðº[Ð°Ð¸]|Ð·Ð°ÐºÑƒÐ¿Ð¾Ñ‡Ð½\w+\s*Ñ†ÐµÐ½\w*)[:\s]+(\d+(?:\.\d+)?)",
        r"(\d+(?:\.\d+)?)\s*(?:Ñ€ÑƒÐ±|â‚½|Ñ€ÑƒÐ±Ð»ÐµÐ¹)",
        r"(?:Ð¾Ñ‚\s+)?(\d+)\s*(?:Ð´Ð¾\s+(\d+))?(?:\s*Ñ€ÑƒÐ±|\s*â‚½)?",
    ]
    
    # ÐœÐ°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÑ‹ Ð² Ñ‚ÐµÐºÑÑ‚Ðµ
    MP_KEYWORDS = {
        "wildberries": ["wildberries", "Ð²Ð°Ð¹Ð»Ð´Ð±ÐµÑ€Ñ€Ð¸Ð·", "wb", "Ð²Ð±"],
        "ozon": ["ozon", "Ð¾Ð·Ð¾Ð½"],
        "yandex_market": ["ÑÐ½Ð´ÐµÐºÑ.Ð¼Ð°Ñ€ÐºÐµÑ‚", "ÑÐ½Ð´ÐµÐºÑ Ð¼Ð°Ñ€ÐºÐµÑ‚", "yandex market", "ym", "ÑÐ¼"]
    }
    
    def parse(self, user_input: str) -> ParsedInput:
        """
        ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ Ð²Ñ…Ð¾Ð´Ð½Ñ‹Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ….
        
        Args:
            user_input: Ð¡Ñ‚Ñ€Ð¾ÐºÐ° Ð¾Ñ‚ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
            
        Returns:
            ParsedInput Ñ Ñ€Ð°Ð·Ð¾Ð±Ñ€Ð°Ð½Ð½Ñ‹Ð¼Ð¸ Ð´Ð°Ð½Ð½Ñ‹Ð¼Ð¸
        """
        raw_input = user_input.strip()
        
        # ÐŸÐ¾Ð¿Ñ‹Ñ‚ÐºÐ° Ð½Ð°Ð¹Ñ‚Ð¸ URL
        url_result = self._parse_url(raw_input)
        
        # Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ COGS
        cogs, cogs_min, cogs_max = self._extract_cogs(raw_input)
        
        if url_result:
            # URL Ð½Ð°Ð¹Ð´ÐµÐ½
            marketplace, query, category_url = url_result
            return ParsedInput(
                marketplaces=[marketplace],
                query=query,
                category_url=category_url,
                cogs=cogs,
                cogs_min=cogs_min,
                cogs_max=cogs_max,
                raw_input=raw_input,
                parse_confidence=0.95
            )
        else:
            # Ð¢ÐµÐºÑÑ‚Ð¾Ð²Ñ‹Ð¹ Ð·Ð°Ð¿Ñ€Ð¾Ñ
            marketplaces = self._detect_marketplaces(raw_input)
            query = self._extract_query(raw_input)
            
            return ParsedInput(
                marketplaces=marketplaces if marketplaces else ["wildberries", "ozon", "yandex_market"],
                query=query,
                category_url=None,
                cogs=cogs,
                cogs_min=cogs_min,
                cogs_max=cogs_max,
                raw_input=raw_input,
                parse_confidence=0.8 if marketplaces else 0.6
            )
    
    def _parse_url(self, text: str) -> Optional[Tuple[str, str, str]]:
        """
        ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ URL Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°.
        
        Returns:
            (marketplace, query, full_url) Ð¸Ð»Ð¸ None
        """
        # ÐŸÐ¾Ð¸ÑÐº URL Ð² Ñ‚ÐµÐºÑÑ‚Ðµ
        url_match = re.search(r"https?://[^\s]+", text)
        if not url_match:
            return None
        
        url = url_match.group(0)
        
        for marketplace, patterns in self.URL_PATTERNS.items():
            # ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸
            cat_match = re.search(patterns["category"], url)
            if cat_match:
                query = cat_match.group(1).replace("-", " ").replace("/", " > ")
                return (marketplace, query, url)
            
            # ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð¿Ð¾Ð¸ÑÐºÐ°
            search_match = re.search(patterns["search"], url)
            if search_match:
                from urllib.parse import unquote
                query = unquote(search_match.group(1))
                return (marketplace, query, url)
        
        return None
    
    def _extract_cogs(self, text: str) -> Tuple[float, Optional[float], Optional[float]]:
        """
        Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ Ð·Ð°ÐºÑƒÐ¿Ð¾Ñ‡Ð½Ð¾Ð¹ Ñ†ÐµÐ½Ñ‹.
        
        Returns:
            (cogs, cogs_min, cogs_max)
        """
        text_lower = text.lower()
        
        # ÐŸÐ°Ñ‚Ñ‚ÐµÑ€Ð½ Ð´Ð¸Ð°Ð¿Ð°Ð·Ð¾Ð½Ð° "Ð¾Ñ‚ X Ð´Ð¾ Y"
        range_match = re.search(r"Ð¾Ñ‚\s+(\d+)\s*(?:Ð´Ð¾\s+(\d+))?", text_lower)
        if range_match:
            cogs_min = float(range_match.group(1))
            cogs_max = float(range_match.group(2)) if range_match.group(2) else None
            cogs = (cogs_min + cogs_max) / 2 if cogs_max else cogs_min
            return (cogs, cogs_min, cogs_max)
        
        # ÐŸÑ€Ð¾ÑÑ‚Ð¾Ðµ Ñ‡Ð¸ÑÐ»Ð¾ Ñ ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ð¾Ð¼
        for pattern in self.COGS_PATTERNS:
            match = re.search(pattern, text_lower)
            if match:
                cogs = float(match.group(1))
                return (cogs, None, None)
        
        # ÐŸÑ€Ð¾ÑÑ‚Ð¾ Ñ‡Ð¸ÑÐ»Ð¾ Ð² ÐºÐ¾Ð½Ñ†Ðµ
        number_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:Ñ€ÑƒÐ±|â‚½|$)", text_lower)
        if number_match:
            return (float(number_match.group(1)), None, None)
        
        return (0.0, None, None)
    
    def _detect_marketplaces(self, text: str) -> List[str]:
        """ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ¾Ð² Ð² Ñ‚ÐµÐºÑÑ‚Ðµ."""
        text_lower = text.lower()
        detected = []
        
        for mp, keywords in self.MP_KEYWORDS.items():
            for keyword in keywords:
                if keyword in text_lower:
                    detected.append(mp)
                    break
        
        return detected
    
    def _extract_query(self, text: str) -> str:
        """Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ Ð¿Ð¾Ð¸ÑÐºÐ¾Ð²Ð¾Ð³Ð¾ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ° Ð¸Ð· Ñ‚ÐµÐºÑÑ‚Ð°."""
        # Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ URL
        text = re.sub(r"https?://[^\s]+", "", text)
        
        # Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ COGS
        text = re.sub(r"(?:cogs|ÑÐµÐ±ÐµÑÑ‚Ð¾Ð¸Ð¼Ð¾ÑÑ‚ÑŒ|Ð·Ð°ÐºÑƒÐ¿Ðº\w+)[:\s]+\d+[^\s]*", "", text, flags=re.I)
        text = re.sub(r"\d+\s*(?:Ñ€ÑƒÐ±|â‚½|Ñ€ÑƒÐ±Ð»ÐµÐ¹)", "", text)
        text = re.sub(r"Ð¾Ñ‚\s+\d+\s*(?:Ð´Ð¾\s+\d+)?", "", text)
        
        # Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ð¹ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ¾Ð²
        for keywords in self.MP_KEYWORDS.values():
            for kw in keywords:
                text = re.sub(rf"\b{kw}\b", "", text, flags=re.I)
        
        # Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ ÑÐ»ÑƒÐ¶ÐµÐ±Ð½Ñ‹Ñ… ÑÐ»Ð¾Ð²
        stop_words = [
            "Ð¿Ñ€Ð¾Ð°Ð½Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÐ¹", "Ð°Ð½Ð°Ð»Ð¸Ð·", "Ð¾Ñ†ÐµÐ½Ð¸", "Ð¾Ñ†ÐµÐ½ÐºÐ°", "Ð½Ð¸Ñˆ[Ð°ÑƒÐµ]",
            "ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸[ÑÐ¸ÑŽ]", "Ñ‚Ð¾Ð²Ð°Ñ€\w*", "Ð½Ð°", "Ð´Ð»Ñ", "Ð¿Ð¾"
        ]
        for word in stop_words:
            text = re.sub(rf"\b{word}\b", "", text, flags=re.I)
        
        # ÐžÑ‡Ð¸ÑÑ‚ÐºÐ°
        text = re.sub(r"\s+", " ", text).strip()
        text = re.sub(r"^[,\s]+|[,\s]+$", "", text)
        
        return text
```

### 3.2.4 ÐŸÑ€Ð¸Ð¼ÐµÑ€Ñ‹ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð°

| Ð’Ð²Ð¾Ð´ | Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ |
|------|-----------|
| `https://www.wildberries.ru/catalog/zhenshchinam/odezhda/platya, 500â‚½` | marketplace=wildberries, query="zhenshchinam odezhda platya", cogs=500 |
| `Ð»ÐµÑ‚Ð½Ð¸Ðµ Ð¿Ð»Ð°Ñ‚ÑŒÑ Ð½Ð° Ð²Ð±, Ð·Ð°ÐºÑƒÐ¿ÐºÐ° 450 Ñ€ÑƒÐ±Ð»ÐµÐ¹` | marketplace=wildberries, query="Ð»ÐµÑ‚Ð½Ð¸Ðµ Ð¿Ð»Ð°Ñ‚ÑŒÑ", cogs=450 |
| `ÐžÑ†ÐµÐ½Ð¸ Ð½Ð¸ÑˆÑƒ Ð´ÐµÑ‚ÑÐºÐ¸Ñ… ÐºÐ¾Ð¼Ð±Ð¸Ð½ÐµÐ·Ð¾Ð½Ð¾Ð², Ð¾Ñ‚ 800 Ð´Ð¾ 1200` | marketplaces=[all], query="Ð´ÐµÑ‚ÑÐºÐ¸Ñ… ÐºÐ¾Ð¼Ð±Ð¸Ð½ÐµÐ·Ð¾Ð½Ð¾Ð²", cogs=1000, cogs_min=800, cogs_max=1200 |

---

## 3.3 Trend Miner

### 3.3.1 ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

Ð¡Ð±Ð¾Ñ€, Ð½Ð¾Ñ€Ð¼Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð¸ Ð°Ð½Ð°Ð»Ð¸Ð· Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¾ Ð´Ð¸Ð½Ð°Ð¼Ð¸ÐºÐµ ÑÐ¿Ñ€Ð¾ÑÐ° Ñ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸ÐµÐ¼ GPT-5 mini Ð´Ð»Ñ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¸.

### 3.3.2 ÐÐ»Ð³Ð¾Ñ€Ð¸Ñ‚Ð¼ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹

```mermaid
flowchart TB
    INPUT["ParsedInput"] --> COLLECT["ÐŸÐ°Ñ€Ð°Ð»Ð»ÐµÐ»ÑŒÐ½Ñ‹Ð¹ ÑÐ±Ð¾Ñ€<br/>Ð¸Ð· Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¾Ð²"]
    
    COLLECT --> RAW["Raw Data:<br/>- Wordstat<br/>- MP Analytics<br/>- External"]
    
    RAW --> NORMALIZE["ÐÐ¾Ñ€Ð¼Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ<br/>(GPT-5 mini)"]
    
    NORMALIZE --> CALC["Ð Ð°ÑÑ‡Ñ‘Ñ‚ Ð¼ÐµÑ‚Ñ€Ð¸Ðº"]
    
    subgraph METRICS["ÐœÐµÑ‚Ñ€Ð¸ÐºÐ¸"]
        SLOPE["Trend Slope"]
        VOLUME["Search Volume"]
        SEASON["Ð¡ÐµÐ·Ð¾Ð½Ð½Ð¾ÑÑ‚ÑŒ"]
    end
    
    CALC --> SLOPE
    CALC --> VOLUME
    CALC --> SEASON
    
    SLOPE --> STATUS["ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ñ‚ÑƒÑÐ°"]
    VOLUME --> STATUS
    SEASON --> STATUS
    
    STATUS --> OUTPUT["TrendResult"]
```

### 3.3.3 Ð¡Ñ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ñ‹ Ð´Ð°Ð½Ð½Ñ‹Ñ…

```python
# services/trend_miner.py

from dataclasses import dataclass, field
from typing import List, Dict, Optional
from datetime import datetime, date
from enum import Enum

class TrendStatus(Enum):
    GREEN = "green"      # > 0.15 â€” Ñ€Ð¾ÑÑ‚
    YELLOW = "yellow"    # 0 to 0.15 â€” ÑÑ‚Ð°Ð±Ð¸Ð»ÑŒÐ½Ð¾
    RED = "red"          # < 0 â€” Ð¿Ð°Ð´ÐµÐ½Ð¸Ðµ


@dataclass
class MonthlyVolume:
    """ÐœÐµÑÑÑ‡Ð½Ñ‹Ð¹ Ð¾Ð±ÑŠÑ‘Ð¼ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð²."""
    month: date
    volume: int
    source: str


@dataclass
class TrendResult:
    """Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° Ñ‚Ñ€ÐµÐ½Ð´Ð¾Ð²."""
    query: str
    period_months: int
    
    # ÐžÑÐ½Ð¾Ð²Ð½Ñ‹Ðµ Ð¼ÐµÑ‚Ñ€Ð¸ÐºÐ¸
    trend_slope: float
    trend_status: TrendStatus
    confidence: float
    
    # ÐžÐ±ÑŠÑ‘Ð¼Ñ‹
    total_volume: int
    avg_monthly_volume: int
    peak_volume: int
    min_volume: int
    
    # Ð’Ñ€ÐµÐ¼ÐµÐ½Ð½Ð¾Ð¹ Ñ€ÑÐ´
    monthly_data: List[MonthlyVolume]
    
    # Ð¡ÐµÐ·Ð¾Ð½Ð½Ð¾ÑÑ‚ÑŒ
    seasonality_detected: bool
    seasonality_peak_month: Optional[int]
    
    # Ð¡Ð²ÑÐ·Ð°Ð½Ð½Ñ‹Ðµ Ð·Ð°Ð¿Ñ€Ð¾ÑÑ‹
    related_queries: List[Dict[str, any]]
    
    # ÐœÐµÑ‚Ð°Ð´Ð°Ð½Ð½Ñ‹Ðµ
    sources_used: List[str]
    sources_failed: List[str]
    collected_at: datetime
    
    @property
    def is_growing(self) -> bool:
        return self.trend_slope > 0.15
    
    @property
    def is_declining(self) -> bool:
        return self.trend_slope < 0
```

### 3.3.4 ÐŸÑ€Ð¾Ð¼Ð¿Ñ‚ Ð´Ð»Ñ Ð½Ð¾Ñ€Ð¼Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ð¸ (GPT-5 mini)

```python
# prompts/trend_prompts.py

TREND_NORMALIZATION_SYSTEM = """
Ð¢Ñ‹ â€” Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸Ðº Ð´Ð°Ð½Ð½Ñ‹Ñ…, ÑÐ¿ÐµÑ†Ð¸Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÑŽÑ‰Ð¸Ð¹ÑÑ Ð½Ð° e-commerce Ñ‚Ñ€ÐµÐ½Ð´Ð°Ñ….
Ð¢Ð²Ð¾Ñ Ð·Ð°Ð´Ð°Ñ‡Ð° â€” Ð½Ð¾Ñ€Ð¼Ð°Ð»Ð¸Ð·Ð¾Ð²Ð°Ñ‚ÑŒ Ð¸ Ð°Ð³Ñ€ÐµÐ³Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð¾ Ð¿Ð¾Ð¸ÑÐºÐ¾Ð²Ñ‹Ñ… Ñ‚Ñ€ÐµÐ½Ð´Ð°Ñ… Ð¸Ð· Ñ€Ð°Ð·Ð½Ñ‹Ñ… Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¾Ð².

ÐŸÑ€Ð°Ð²Ð¸Ð»Ð°:
1. ÐŸÑ€Ð¸Ð²Ð¾Ð´Ð¸ Ð²ÑÐµ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ðº ÐµÐ´Ð¸Ð½Ð¾Ð¹ ÑˆÐºÐ°Ð»Ðµ (0-100)
2. Ð£Ñ‡Ð¸Ñ‚Ñ‹Ð²Ð°Ð¹ Ñ€Ð°Ð·Ð½Ð¸Ñ†Ñƒ Ð² Ð°Ð±ÑÐ¾Ð»ÑŽÑ‚Ð½Ñ‹Ñ… Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸ÑÑ… Ð¼ÐµÐ¶Ð´Ñƒ Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ°Ð¼Ð¸
3. Ð’Ñ‹ÑÐ²Ð»ÑÐ¹ Ð°Ð½Ð¾Ð¼Ð°Ð»Ð¸Ð¸ Ð¸ Ð²Ñ‹Ð±Ñ€Ð¾ÑÑ‹
4. ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÑÐ¹ ÑÐµÐ·Ð¾Ð½Ð½Ñ‹Ðµ Ð¿Ð°Ñ‚Ñ‚ÐµÑ€Ð½Ñ‹
5. ÐžÑ‚Ð²ÐµÑ‡Ð°Ð¹ ÑÑ‚Ñ€Ð¾Ð³Ð¾ Ð² JSON Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚Ðµ
"""

TREND_NORMALIZATION_USER = """
Ð”Ð°Ð½Ð½Ñ‹Ðµ Ð¾ Ñ‚Ñ€ÐµÐ½Ð´Ð°Ñ… Ð´Ð»Ñ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ° "{query}":

Wordstat (Ð¯Ð½Ð´ÐµÐºÑ):
{wordstat_data}

Ozon Analytics:
{ozon_data}

WB Analytics:
{wb_data}

Ð’Ð½ÐµÑˆÐ½Ð¸Ðµ ÑÐµÑ€Ð²Ð¸ÑÑ‹:
{external_data}

ÐŸÑ€Ð¾Ð°Ð½Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÐ¹ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð¸ Ð²ÐµÑ€Ð½Ð¸ JSON:
{{
    "normalized_trend_slope": <float Ð¾Ñ‚ -1 Ð´Ð¾ 1>,
    "confidence": <float Ð¾Ñ‚ 0 Ð´Ð¾ 1>,
    "monthly_trend": [
        {{"month": "YYYY-MM", "normalized_value": <0-100>}},
        ...
    ],
    "seasonality": {{
        "detected": <bool>,
        "peak_month": <1-12 Ð¸Ð»Ð¸ null>,
        "pattern": "<Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ>"
    }},
    "data_quality": {{
        "sources_agreement": <float 0-1>,
        "outliers_detected": <int>,
        "notes": "<Ð·Ð°Ð¼ÐµÑ‚ÐºÐ¸>"
    }}
}}
"""
```

### 3.3.5 Ð ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Trend Miner

```python
# services/trend_miner.py

import asyncio
import numpy as np
from typing import Dict, List, Optional
from datetime import datetime, timedelta

class TrendMiner:
    """ÐÐ½Ð°Ð»Ð¸Ð·Ð°Ñ‚Ð¾Ñ€ Ñ‚Ñ€ÐµÐ½Ð´Ð¾Ð² ÑÐ¿Ñ€Ð¾ÑÐ°."""
    
    def __init__(
        self,
        data_aggregator,
        ai_client,
        cache
    ):
        self.aggregator = data_aggregator
        self.ai = ai_client
        self.cache = cache
    
    async def analyze(
        self,
        parsed_input: ParsedInput
    ) -> TrendResult:
        """
        ÐŸÐ¾Ð»Ð½Ñ‹Ð¹ Ð°Ð½Ð°Ð»Ð¸Ð· Ñ‚Ñ€ÐµÐ½Ð´Ð¾Ð² Ð´Ð»Ñ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ°.
        
        Args:
            parsed_input: Ð Ð°Ð·Ð¾Ð±Ñ€Ð°Ð½Ð½Ñ‹Ð¹ Ð²Ð²Ð¾Ð´ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
            
        Returns:
            TrendResult Ñ Ð¼ÐµÑ‚Ñ€Ð¸ÐºÐ°Ð¼Ð¸
        """
        query = parsed_input.query
        
        # ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° ÐºÑÑˆÐ°
        cached = await self.cache.get_trend(query)
        if cached:
            return self._deserialize_trend(cached)
        
        # Ð¡Ð±Ð¾Ñ€ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¸Ð· Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¾Ð²
        raw_data = await self.aggregator.collect_trend_data(
            query=query,
            marketplaces=parsed_input.marketplaces,
            timeout=30
        )
        
        # ÐÐ¾Ñ€Ð¼Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ñ‡ÐµÑ€ÐµÐ· AI
        normalized = await self._normalize_with_ai(query, raw_data)
        
        # Ð Ð°ÑÑ‡Ñ‘Ñ‚ Ð¼ÐµÑ‚Ñ€Ð¸Ðº
        result = self._calculate_metrics(query, raw_data, normalized)
        
        # ÐšÑÑˆÐ¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ
        await self.cache.set_trend(query, self._serialize_trend(result))
        
        return result
    
    async def _normalize_with_ai(
        self,
        query: str,
        raw_data: Dict
    ) -> Dict:
        """ÐÐ¾Ñ€Ð¼Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ñ‡ÐµÑ€ÐµÐ· GPT-5 mini."""
        from prompts.trend_prompts import (
            TREND_NORMALIZATION_SYSTEM,
            TREND_NORMALIZATION_USER
        )
        
        prompt = TREND_NORMALIZATION_USER.format(
            query=query,
            wordstat_data=self._format_source_data(raw_data.get("wordstat", {})),
            ozon_data=self._format_source_data(raw_data.get("ozon_analytics", {})),
            wb_data=self._format_source_data(raw_data.get("wb_analytics", {})),
            external_data=self._format_source_data(raw_data.get("external", {}))
        )
        
        response = await self.ai.complete(
            model="gpt-5-mini",
            system=TREND_NORMALIZATION_SYSTEM,
            user=prompt,
            response_format="json"
        )
        
        return response
    
    def _calculate_metrics(
        self,
        query: str,
        raw_data: Dict,
        normalized: Dict
    ) -> TrendResult:
        """Ð Ð°ÑÑ‡Ñ‘Ñ‚ Ñ„Ð¸Ð½Ð°Ð»ÑŒÐ½Ñ‹Ñ… Ð¼ÐµÑ‚Ñ€Ð¸Ðº."""
        
        # Trend Slope Ð¸Ð· Ð½Ð¾Ñ€Ð¼Ð°Ð»Ð¸Ð·Ð¾Ð²Ð°Ð½Ð½Ñ‹Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ…
        trend_slope = normalized.get("normalized_trend_slope", 0)
        
        # ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ñ‚ÑƒÑÐ°
        if trend_slope > 0.15:
            trend_status = TrendStatus.GREEN
        elif trend_slope >= 0:
            trend_status = TrendStatus.YELLOW
        else:
            trend_status = TrendStatus.RED
        
        # Ð¡Ð±Ð¾Ñ€ monthly_data
        monthly_data = []
        for item in normalized.get("monthly_trend", []):
            monthly_data.append(MonthlyVolume(
                month=datetime.strptime(item["month"], "%Y-%m").date(),
                volume=item["normalized_value"],
                source="aggregated"
            ))
        
        # ÐžÐ±ÑŠÑ‘Ð¼Ñ‹ Ð¸Ð· Wordstat
        wordstat = raw_data.get("wordstat", {})
        total_volume = wordstat.get("total_shows", 0)
        
        volumes = [m.volume for m in monthly_data] if monthly_data else [0]
        
        # Ð¡ÐµÐ·Ð¾Ð½Ð½Ð¾ÑÑ‚ÑŒ
        seasonality = normalized.get("seasonality", {})
        
        # Ð˜ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¸
        sources_used = [k for k, v in raw_data.items() if v and "error" not in v]
        sources_failed = [k for k, v in raw_data.items() if v and "error" in v]
        
        return TrendResult(
            query=query,
            period_months=3,
            trend_slope=round(trend_slope, 4),
            trend_status=trend_status,
            confidence=normalized.get("confidence", 0.5),
            total_volume=total_volume,
            avg_monthly_volume=int(np.mean(volumes)) if volumes else 0,
            peak_volume=max(volumes) if volumes else 0,
            min_volume=min(volumes) if volumes else 0,
            monthly_data=monthly_data,
            seasonality_detected=seasonality.get("detected", False),
            seasonality_peak_month=seasonality.get("peak_month"),
            related_queries=wordstat.get("related_phrases", [])[:10],
            sources_used=sources_used,
            sources_failed=sources_failed,
            collected_at=datetime.utcnow()
        )
    
    def _format_source_data(self, data: Dict) -> str:
        """Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ° Ð´Ð»Ñ Ð¿Ñ€Ð¾Ð¼Ð¿Ñ‚Ð°."""
        if not data or "error" in data:
            return "Ð”Ð°Ð½Ð½Ñ‹Ðµ Ð½ÐµÐ´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹"
        
        import json
        return json.dumps(data, ensure_ascii=False, indent=2)
    
    def _calculate_trend_slope_simple(
        self,
        monthly_values: List[int]
    ) -> float:
        """
        ÐŸÑ€Ð¾ÑÑ‚Ð¾Ð¹ Ñ€Ð°ÑÑ‡Ñ‘Ñ‚ trend slope Ð±ÐµÐ· AI.
        Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÑ‚ÑÑ ÐºÐ°Ðº fallback.
        """
        if len(monthly_values) < 2:
            return 0.0
        
        x = np.arange(len(monthly_values))
        y = np.array(monthly_values)
        
        # Ð›Ð¸Ð½ÐµÐ¹Ð½Ð°Ñ Ñ€ÐµÐ³Ñ€ÐµÑÑÐ¸Ñ
        slope, _ = np.polyfit(x, y, 1)
        
        # ÐÐ¾Ñ€Ð¼Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ
        avg_y = np.mean(y)
        if avg_y == 0:
            return 0.0
        
        normalized = slope / avg_y
        return max(-1.0, min(1.0, normalized))
```

---

## 3.4 Competitor Analyzer

### 3.4.1 ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

ÐÐ½Ð°Ð»Ð¸Ð· ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð½Ð¾Ð¹ ÑÑ€ÐµÐ´Ñ‹ Ð² ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸: Ñ€Ð°ÑÑ‡Ñ‘Ñ‚ Monopoly Rate, Ð°Ð½Ð°Ð»Ð¸Ð· Ñ†ÐµÐ½Ð¾Ð²Ð¾Ð¹ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ñ‹, Ð¾Ñ†ÐµÐ½ÐºÐ° Ð±Ð°Ñ€ÑŒÐµÑ€Ð¾Ð² Ð²Ñ…Ð¾Ð´Ð°.

### 3.4.2 ÐÐ»Ð³Ð¾Ñ€Ð¸Ñ‚Ð¼ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹

```mermaid
flowchart TB
    INPUT["ParsedInput"] --> WATCHER["Ð—Ð°Ð¿Ñ€Ð¾Ñ Ðº Watcher API"]
    
    WATCHER --> TOP50["Ð¢ÐžÐŸ-50 Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð²"]
    
    TOP50 --> PARALLEL["ÐŸÐ°Ñ€Ð°Ð»Ð»ÐµÐ»ÑŒÐ½Ñ‹Ð¹ Ð°Ð½Ð°Ð»Ð¸Ð·"]
    
    subgraph ANALYSIS["ÐÐ½Ð°Ð»Ð¸Ð· (GPT-5 mini)"]
        SELLERS["Ð“Ñ€ÑƒÐ¿Ð¿Ð¸Ñ€Ð¾Ð²ÐºÐ°<br/>Ð¿Ð¾ Ð¿Ñ€Ð¾Ð´Ð°Ð²Ñ†Ð°Ð¼"]
        PRICES["Ð¦ÐµÐ½Ð¾Ð²Ð¾Ð¹<br/>Ð°Ð½Ð°Ð»Ð¸Ð·"]
        QUALITY["ÐÐ½Ð°Ð»Ð¸Ð·<br/>ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð°"]
        BARRIERS["ÐžÑ†ÐµÐ½ÐºÐ°<br/>Ð±Ð°Ñ€ÑŒÐµÑ€Ð¾Ð²"]
    end
    
    PARALLEL --> SELLERS
    PARALLEL --> PRICES
    PARALLEL --> QUALITY
    PARALLEL --> BARRIERS
    
    SELLERS --> MONOPOLY["Monopoly Rate"]
    PRICES --> PRICE_METRICS["Price Metrics"]
    QUALITY --> QUALITY_METRICS["Quality Metrics"]
    BARRIERS --> BARRIER_SCORE["Barrier Score"]
    
    MONOPOLY --> OUTPUT["CompetitorResult"]
    PRICE_METRICS --> OUTPUT
    QUALITY_METRICS --> OUTPUT
    BARRIER_SCORE --> OUTPUT
```

### 3.4.3 Ð¡Ñ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ñ‹ Ð´Ð°Ð½Ð½Ñ‹Ñ…

```python
# services/competitor_analyzer.py

from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime
from enum import Enum

class MonopolyStatus(Enum):
    GREEN = "green"      # < 50%
    YELLOW = "yellow"    # 50-70%
    RED = "red"          # > 70%


class CompetitionLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class EntryBarrier(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


@dataclass
class SellerStats:
    """Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ° Ð¿Ñ€Ð¾Ð´Ð°Ð²Ñ†Ð°."""
    name: str
    products_count: int
    share: float
    avg_position: float
    avg_price: float
    avg_rating: float
    total_reviews: int


@dataclass
class PriceAnalysis:
    """ÐÐ½Ð°Ð»Ð¸Ð· Ñ†ÐµÐ½ Ð² ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸."""
    avg: float
    median: float
    min: float
    max: float
    std: float
    percentile_25: float
    percentile_75: float
    price_segments: Dict[str, int]  # {"budget": 10, "medium": 25, "premium": 15}


@dataclass
class QualityAnalysis:
    """ÐÐ½Ð°Ð»Ð¸Ð· ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð° Ð² ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸."""
    avg_rating: float
    median_rating: float
    avg_reviews_count: int
    products_above_4_5: int
    products_with_photos: int
    products_with_video: int
    avg_photos_count: float


@dataclass
class CompetitorResult:
    """Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð¾Ð²."""
    marketplace: str
    category: str
    query: str
    
    # Monopoly
    monopoly_rate: float
    monopoly_status: MonopolyStatus
    top_sellers: List[SellerStats]
    herfindahl_index: float
    
    # Ð¦ÐµÐ½Ñ‹
    price_analysis: PriceAnalysis
    
    # ÐšÐ°Ñ‡ÐµÑÑ‚Ð²Ð¾
    quality_analysis: QualityAnalysis
    
    # ÐšÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ†Ð¸Ñ
    competition_level: CompetitionLevel
    unique_sellers_count: int
    
    # Ð‘Ð°Ñ€ÑŒÐµÑ€Ñ‹ Ð²Ñ…Ð¾Ð´Ð°
    entry_barrier: EntryBarrier
    entry_barrier_score: float  # 0-1
    barrier_factors: List[str]
    
    # ÐœÐµÑ‚Ð°Ð´Ð°Ð½Ð½Ñ‹Ðµ
    products_analyzed: int
    analyzed_at: datetime
```

### 3.4.4 Ð Ð°ÑÑ‡Ñ‘Ñ‚ Monopoly Rate

```python
def calculate_monopoly_metrics(
    sellers: List[SellerStats]
) -> Dict:
    """
    Ð Ð°ÑÑ‡Ñ‘Ñ‚ Ð¼ÐµÑ‚Ñ€Ð¸Ðº Ð¼Ð¾Ð½Ð¾Ð¿Ð¾Ð»Ð¸Ð·Ð°Ñ†Ð¸Ð¸.
    
    Monopoly Rate = Ð´Ð¾Ð»Ñ Ð¢ÐžÐŸ-3 Ð¿Ñ€Ð¾Ð´Ð°Ð²Ñ†Ð¾Ð²
    Herfindahl Index = ÑÑƒÐ¼Ð¼Ð° ÐºÐ²Ð°Ð´Ñ€Ð°Ñ‚Ð¾Ð² Ð´Ð¾Ð»ÐµÐ¹ Ð²ÑÐµÑ… Ð¿Ñ€Ð¾Ð´Ð°Ð²Ñ†Ð¾Ð²
    """
    if not sellers:
        return {
            "monopoly_rate": 0,
            "herfindahl_index": 0,
            "status": MonopolyStatus.GREEN
        }
    
    # Ð¡Ð¾Ñ€Ñ‚Ð¸Ñ€Ð¾Ð²ÐºÐ° Ð¿Ð¾ Ð´Ð¾Ð»Ðµ
    sorted_sellers = sorted(sellers, key=lambda x: x.share, reverse=True)
    
    # Monopoly Rate (Ð¢ÐžÐŸ-3)
    top_3_share = sum(s.share for s in sorted_sellers[:3])
    
    # Herfindahl Index
    hhi = sum(s.share ** 2 for s in sorted_sellers)
    
    # Ð¡Ñ‚Ð°Ñ‚ÑƒÑ
    if top_3_share < 0.5:
        status = MonopolyStatus.GREEN
    elif top_3_share < 0.7:
        status = MonopolyStatus.YELLOW
    else:
        status = MonopolyStatus.RED
    
    return {
        "monopoly_rate": round(top_3_share, 4),
        "herfindahl_index": round(hhi, 4),
        "status": status
    }
```

### 3.4.5 ÐžÑ†ÐµÐ½ÐºÐ° Ð±Ð°Ñ€ÑŒÐµÑ€Ð¾Ð² Ð²Ñ…Ð¾Ð´Ð°

```python
def calculate_entry_barrier(
    monopoly_rate: float,
    avg_rating: float,
    avg_reviews: int,
    price_std: float,
    avg_price: float
) -> Dict:
    """
    ÐžÑ†ÐµÐ½ÐºÐ° Ð±Ð°Ñ€ÑŒÐµÑ€Ð¾Ð² Ð²Ñ…Ð¾Ð´Ð° Ð² Ð½Ð¸ÑˆÑƒ.
    
    Ð¤Ð°ÐºÑ‚Ð¾Ñ€Ñ‹:
    - Ð’Ñ‹ÑÐ¾ÐºÐ°Ñ Ð¼Ð¾Ð½Ð¾Ð¿Ð¾Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ
    - Ð’Ñ‹ÑÐ¾ÐºÐ¸Ðµ Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ð½Ð¸Ñ Ðº Ñ€ÐµÐ¹Ñ‚Ð¸Ð½Ð³Ñƒ
    - ÐœÐ½Ð¾Ð³Ð¾ Ð¾Ñ‚Ð·Ñ‹Ð²Ð¾Ð² Ñƒ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð¾Ð²
    - ÐÐ¸Ð·ÐºÐ¸Ð¹ Ñ€Ð°Ð·Ð±Ñ€Ð¾Ñ Ñ†ÐµÐ½ (Ñ†ÐµÐ½Ð¾Ð²Ð°Ñ Ð²Ð¾Ð¹Ð½Ð°)
    """
    score = 0.0
    factors = []
    
    # ÐœÐ¾Ð½Ð¾Ð¿Ð¾Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ (Ð²ÐµÑ 0.3)
    if monopoly_rate > 0.7:
        score += 0.3
        factors.append("Ð’Ñ‹ÑÐ¾ÐºÐ°Ñ Ð¼Ð¾Ð½Ð¾Ð¿Ð¾Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ñ€Ñ‹Ð½ÐºÐ° (Ð¢ÐžÐŸ-3 > 70%)")
    elif monopoly_rate > 0.5:
        score += 0.15
        factors.append("Ð£Ð¼ÐµÑ€ÐµÐ½Ð½Ð°Ñ Ð¼Ð¾Ð½Ð¾Ð¿Ð¾Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ (Ð¢ÐžÐŸ-3 > 50%)")
    
    # Ð¢Ñ€ÐµÐ±Ð¾Ð²Ð°Ð½Ð¸Ñ Ðº Ñ€ÐµÐ¹Ñ‚Ð¸Ð½Ð³Ñƒ (Ð²ÐµÑ 0.25)
    if avg_rating > 4.7:
        score += 0.25
        factors.append("Ð’Ñ‹ÑÐ¾ÐºÐ¸Ðµ Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ð½Ð¸Ñ Ðº Ñ€ÐµÐ¹Ñ‚Ð¸Ð½Ð³Ñƒ (>4.7)")
    elif avg_rating > 4.5:
        score += 0.12
        factors.append("Ð¡Ñ€ÐµÐ´Ð½Ð¸Ðµ Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ð½Ð¸Ñ Ðº Ñ€ÐµÐ¹Ñ‚Ð¸Ð½Ð³Ñƒ (>4.5)")
    
    # ÐšÐ¾Ð»Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾ Ð¾Ñ‚Ð·Ñ‹Ð²Ð¾Ð² (Ð²ÐµÑ 0.25)
    if avg_reviews > 500:
        score += 0.25
        factors.append("ÐœÐ½Ð¾Ð³Ð¾ Ð¾Ñ‚Ð·Ñ‹Ð²Ð¾Ð² Ñƒ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð¾Ð² (>500)")
    elif avg_reviews > 200:
        score += 0.12
        factors.append("Ð¡Ñ€ÐµÐ´Ð½ÐµÐµ ÐºÐ¾Ð»Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾ Ð¾Ñ‚Ð·Ñ‹Ð²Ð¾Ð² (>200)")
    
    # Ð¦ÐµÐ½Ð¾Ð²Ð°Ñ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ†Ð¸Ñ (Ð²ÐµÑ 0.2)
    cv = price_std / avg_price if avg_price > 0 else 0  # ÐšÐ¾ÑÑ„Ñ„Ð¸Ñ†Ð¸ÐµÐ½Ñ‚ Ð²Ð°Ñ€Ð¸Ð°Ñ†Ð¸Ð¸
    if cv < 0.2:
        score += 0.2
        factors.append("ÐÐ¸Ð·ÐºÐ¸Ð¹ Ñ€Ð°Ð·Ð±Ñ€Ð¾Ñ Ñ†ÐµÐ½ â€” Ñ†ÐµÐ½Ð¾Ð²Ð°Ñ Ð²Ð¾Ð¹Ð½Ð°")
    elif cv < 0.3:
        score += 0.1
        factors.append("Ð£Ð¼ÐµÑ€ÐµÐ½Ð½Ñ‹Ð¹ Ñ€Ð°Ð·Ð±Ñ€Ð¾Ñ Ñ†ÐµÐ½")
    
    # ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ ÑƒÑ€Ð¾Ð²Ð½Ñ
    if score > 0.6:
        barrier = EntryBarrier.HIGH
    elif score > 0.3:
        barrier = EntryBarrier.MEDIUM
    else:
        barrier = EntryBarrier.LOW
    
    return {
        "barrier": barrier,
        "score": round(score, 2),
        "factors": factors
    }
```

### 3.4.6 ÐŸÑ€Ð¾Ð¼Ð¿Ñ‚ Ð´Ð»Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° (GPT-5 mini)

```python
# prompts/competitor_prompts.py

COMPETITOR_ANALYSIS_SYSTEM = """
Ð¢Ñ‹ â€” Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸Ðº e-commerce, ÑÐ¿ÐµÑ†Ð¸Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÑŽÑ‰Ð¸Ð¹ÑÑ Ð½Ð° ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð½Ð¾Ð¼ Ð°Ð½Ð°Ð»Ð¸Ð·Ðµ.
Ð¢Ð²Ð¾Ñ Ð·Ð°Ð´Ð°Ñ‡Ð° â€” Ð¿Ñ€Ð¾Ð°Ð½Ð°Ð»Ð¸Ð·Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð¾ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð°Ñ… Ð² ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸ Ð¸ Ð²Ñ‹ÑÐ²Ð¸Ñ‚ÑŒ Ð¿Ð°Ñ‚Ñ‚ÐµÑ€Ð½Ñ‹.

ÐŸÑ€Ð°Ð²Ð¸Ð»Ð°:
1. Ð“Ñ€ÑƒÐ¿Ð¿Ð¸Ñ€ÑƒÐ¹ Ð¿Ñ€Ð¾Ð´Ð°Ð²Ñ†Ð¾Ð² Ð¸ Ñ€Ð°ÑÑÑ‡Ð¸Ñ‚Ñ‹Ð²Ð°Ð¹ Ð¸Ñ… Ð´Ð¾Ð»Ð¸
2. ÐÐ½Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÐ¹ Ñ†ÐµÐ½Ð¾Ð²Ñ‹Ðµ ÑÐµÐ³Ð¼ÐµÐ½Ñ‚Ñ‹
3. ÐžÑ†ÐµÐ½Ð¸Ð²Ð°Ð¹ ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð¾ Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð² Ð¿Ð¾ Ñ€ÐµÐ¹Ñ‚Ð¸Ð½Ð³Ð°Ð¼
4. Ð’Ñ‹ÑÐ²Ð»ÑÐ¹ Ð»Ð¸Ð´ÐµÑ€Ð¾Ð² Ð¸ Ð¸Ñ… ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ð¸
5. ÐžÑ‚Ð²ÐµÑ‡Ð°Ð¹ ÑÑ‚Ñ€Ð¾Ð³Ð¾ Ð² JSON Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚Ðµ
"""

COMPETITOR_ANALYSIS_USER = """
Ð”Ð°Ð½Ð½Ñ‹Ðµ Ð¢ÐžÐŸ-50 Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð² Ð² ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸ "{category}" Ð½Ð° {marketplace}:

{products_data}

ÐŸÑ€Ð¾Ð°Ð½Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÐ¹ Ð¸ Ð²ÐµÑ€Ð½Ð¸ JSON:
{{
    "sellers_analysis": [
        {{
            "name": "<Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ðµ Ð¿Ñ€Ð¾Ð´Ð°Ð²Ñ†Ð°>",
            "products_count": <int>,
            "estimated_share": <float 0-1>,
            "avg_position": <float>,
            "price_strategy": "<budget/medium/premium>",
            "strengths": ["<ÑÐ¸Ð»ÑŒÐ½Ð°Ñ ÑÑ‚Ð¾Ñ€Ð¾Ð½Ð°>", ...]
        }},
        ...
    ],
    "price_segments": {{
        "budget": {{"count": <int>, "price_range": "<Ð¾Ñ‚-Ð´Ð¾>"}},
        "medium": {{"count": <int>, "price_range": "<Ð¾Ñ‚-Ð´Ð¾>"}},
        "premium": {{"count": <int>, "price_range": "<Ð¾Ñ‚-Ð´Ð¾>"}}
    }},
    "market_insights": {{
        "dominant_strategy": "<Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ>",
        "gap_opportunities": ["<Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚ÑŒ>", ...],
        "risks": ["<Ñ€Ð¸ÑÐº>", ...]
    }}
}}
"""
```

### 3.4.7 Ð ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Competitor Analyzer

```python
# services/competitor_analyzer.py

from typing import Dict, List
from datetime import datetime

class CompetitorAnalyzer:
    """ÐÐ½Ð°Ð»Ð¸Ð·Ð°Ñ‚Ð¾Ñ€ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð½Ð¾Ð¹ ÑÑ€ÐµÐ´Ñ‹."""
    
    def __init__(
        self,
        watcher_client,
        ai_client
    ):
        self.watcher = watcher_client
        self.ai = ai_client
    
    async def analyze(
        self,
        parsed_input: ParsedInput
    ) -> Dict[str, CompetitorResult]:
        """
        ÐÐ½Ð°Ð»Ð¸Ð· ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð¾Ð² Ð¿Ð¾ Ð²ÑÐµÐ¼ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°Ð¼.
        
        Returns:
            {marketplace: CompetitorResult}
        """
        results = {}
        
        for mp in parsed_input.marketplaces:
            result = await self._analyze_marketplace(
                marketplace=mp,
                query=parsed_input.query,
                category_url=parsed_input.category_url
            )
            results[mp] = result
        
        return results
    
    async def _analyze_marketplace(
        self,
        marketplace: str,
        query: str,
        category_url: str = None
    ) -> CompetitorResult:
        """ÐÐ½Ð°Ð»Ð¸Ð· Ð¾Ð´Ð½Ð¾Ð³Ð¾ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°."""
        
        # ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¸Ð· Watcher
        watcher_data = await self.watcher.get_category_analysis(
            marketplace=marketplace,
            category_url=category_url,
            search_query=query if not category_url else None,
            limit=50
        )
        
        data = watcher_data.get("data", {})
        
        # ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ Ð¿Ñ€Ð¾Ð´Ð°Ð²Ñ†Ð¾Ð²
        sellers = [
            SellerStats(
                name=s["name"],
                products_count=s["products_in_top"],
                share=s["share"],
                avg_position=s["avg_position"],
                avg_price=s["avg_price"],
                avg_rating=s["avg_rating"],
                total_reviews=s.get("total_reviews", 0)
            )
            for s in data.get("sellers", [])
        ]
        
        # Ð Ð°ÑÑ‡Ñ‘Ñ‚ monopoly
        monopoly = calculate_monopoly_metrics(sellers)
        
        # ÐÐ½Ð°Ð»Ð¸Ð· Ñ†ÐµÐ½
        price_stats = data.get("price_stats", {})
        price_analysis = PriceAnalysis(
            avg=price_stats.get("avg", 0),
            median=price_stats.get("median", 0),
            min=price_stats.get("min", 0),
            max=price_stats.get("max", 0),
            std=price_stats.get("std", 0),
            percentile_25=price_stats.get("percentile_25", 0),
            percentile_75=price_stats.get("percentile_75", 0),
            price_segments=await self._analyze_price_segments(data)
        )
        
        # ÐÐ½Ð°Ð»Ð¸Ð· ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð°
        quality_stats = data.get("quality_stats", {})
        quality_analysis = QualityAnalysis(
            avg_rating=quality_stats.get("avg_rating", 0),
            median_rating=quality_stats.get("median_rating", 0),
            avg_reviews_count=quality_stats.get("avg_reviews_count", 0),
            products_above_4_5=quality_stats.get("products_rating_above_4_5", 0),
            products_with_photos=quality_stats.get("products_with_photos", 0),
            products_with_video=quality_stats.get("products_with_video", 0),
            avg_photos_count=quality_stats.get("avg_photos_count", 0)
        )
        
        # Ð‘Ð°Ñ€ÑŒÐµÑ€Ñ‹ Ð²Ñ…Ð¾Ð´Ð°
        barrier = calculate_entry_barrier(
            monopoly_rate=monopoly["monopoly_rate"],
            avg_rating=quality_analysis.avg_rating,
            avg_reviews=quality_analysis.avg_reviews_count,
            price_std=price_analysis.std,
            avg_price=price_analysis.avg
        )
        
        # Ð£Ñ€Ð¾Ð²ÐµÐ½ÑŒ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ†Ð¸Ð¸
        competition = self._determine_competition_level(
            unique_sellers=data.get("competition_metrics", {}).get("unique_sellers", 0),
            monopoly_rate=monopoly["monopoly_rate"]
        )
        
        return CompetitorResult(
            marketplace=marketplace,
            category=data.get("category", query),
            query=query,
            monopoly_rate=monopoly["monopoly_rate"],
            monopoly_status=monopoly["status"],
            top_sellers=sellers[:10],
            herfindahl_index=monopoly["herfindahl_index"],
            price_analysis=price_analysis,
            quality_analysis=quality_analysis,
            competition_level=competition,
            unique_sellers_count=data.get("competition_metrics", {}).get("unique_sellers", 0),
            entry_barrier=barrier["barrier"],
            entry_barrier_score=barrier["score"],
            barrier_factors=barrier["factors"],
            products_analyzed=data.get("products_count", 0),
            analyzed_at=datetime.utcnow()
        )
    
    async def _analyze_price_segments(self, data: Dict) -> Dict[str, int]:
        """ÐÐ½Ð°Ð»Ð¸Ð· Ñ†ÐµÐ½Ð¾Ð²Ñ‹Ñ… ÑÐµÐ³Ð¼ÐµÐ½Ñ‚Ð¾Ð² Ñ‡ÐµÑ€ÐµÐ· AI."""
        # Ð£Ð¿Ñ€Ð¾Ñ‰Ñ‘Ð½Ð½Ð°Ñ Ð²ÐµÑ€ÑÐ¸Ñ Ð±ÐµÐ· AI
        products = data.get("products", [])
        if not products:
            return {"budget": 0, "medium": 0, "premium": 0}
        
        prices = [p.get("price", 0) for p in products if p.get("price")]
        if not prices:
            return {"budget": 0, "medium": 0, "premium": 0}
        
        import numpy as np
        p33 = np.percentile(prices, 33)
        p66 = np.percentile(prices, 66)
        
        return {
            "budget": len([p for p in prices if p <= p33]),
            "medium": len([p for p in prices if p33 < p <= p66]),
            "premium": len([p for p in prices if p > p66])
        }
    
    def _determine_competition_level(
        self,
        unique_sellers: int,
        monopoly_rate: float
    ) -> CompetitionLevel:
        """ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ ÑƒÑ€Ð¾Ð²Ð½Ñ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ†Ð¸Ð¸."""
        if unique_sellers > 20 and monopoly_rate < 0.5:
            return CompetitionLevel.HIGH
        elif unique_sellers > 10 or monopoly_rate < 0.7:
            return CompetitionLevel.MEDIUM
        else:
            return CompetitionLevel.LOW
```

---

## 3.5 Unit Calculator

### 3.5.1 ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

Ð Ð°ÑÑ‡Ñ‘Ñ‚ unit-ÑÐºÐ¾Ð½Ð¾Ð¼Ð¸ÐºÐ¸: Ð¿Ñ€Ð¸Ð±Ñ‹Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ, Ð¼Ð°Ñ€Ð¶Ð¸Ð½Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ, Ñ‚Ð¾Ñ‡ÐºÐ° Ð±ÐµÐ·ÑƒÐ±Ñ‹Ñ‚Ð¾Ñ‡Ð½Ð¾ÑÑ‚Ð¸.

### 3.5.2 Ð¤Ð¾Ñ€Ð¼ÑƒÐ»Ñ‹ Ñ€Ð°ÑÑ‡Ñ‘Ñ‚Ð°

```
Ð’Ð°Ð»Ð¾Ð²Ð°Ñ Ð¿Ñ€Ð¸Ð±Ñ‹Ð»ÑŒ = Ð¦ÐµÐ½Ð° Ð¿Ñ€Ð¾Ð´Ð°Ð¶Ð¸ - Ð¡ÐµÐ±ÐµÑÑ‚Ð¾Ð¸Ð¼Ð¾ÑÑ‚ÑŒ

Ð Ð°ÑÑ…Ð¾Ð´Ñ‹ ÐœÐŸ = ÐšÐ¾Ð¼Ð¸ÑÑÐ¸Ñ + Ð›Ð¾Ð³Ð¸ÑÑ‚Ð¸ÐºÐ° + Ð’Ð¾Ð·Ð²Ñ€Ð°Ñ‚Ñ‹ + Ð¥Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ + Ð­ÐºÐ²Ð°Ð¹Ñ€Ð¸Ð½Ð³

Ð§Ð¸ÑÑ‚Ð°Ñ Ð¿Ñ€Ð¸Ð±Ñ‹Ð»ÑŒ = Ð¦ÐµÐ½Ð° Ð¿Ñ€Ð¾Ð´Ð°Ð¶Ð¸ - Ð¡ÐµÐ±ÐµÑÑ‚Ð¾Ð¸Ð¼Ð¾ÑÑ‚ÑŒ - Ð Ð°ÑÑ…Ð¾Ð´Ñ‹ ÐœÐŸ

ÐœÐ°Ñ€Ð¶Ð° % = Ð§Ð¸ÑÑ‚Ð°Ñ Ð¿Ñ€Ð¸Ð±Ñ‹Ð»ÑŒ / Ð¦ÐµÐ½Ð° Ð¿Ñ€Ð¾Ð´Ð°Ð¶Ð¸ Ã— 100

Ð¢Ð¾Ñ‡ÐºÐ° Ð±ÐµÐ·ÑƒÐ±Ñ‹Ñ‚Ð¾Ñ‡Ð½Ð¾ÑÑ‚Ð¸ = Ð¡ÐµÐ±ÐµÑÑ‚Ð¾Ð¸Ð¼Ð¾ÑÑ‚ÑŒ / (1 - Overhead%)

Ð¦ÐµÐ½Ð° Ð´Ð»Ñ Ð¼Ð°Ñ€Ð¶Ð¸ X% = Ð¡ÐµÐ±ÐµÑÑ‚Ð¾Ð¸Ð¼Ð¾ÑÑ‚ÑŒ / (1 - Overhead% - X%)
```

### 3.5.3 Ð¡Ñ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ñ‹ Ð´Ð°Ð½Ð½Ñ‹Ñ…

```python
# services/unit_calculator.py

from dataclasses import dataclass
from typing import Optional
from enum import Enum

class MarginStatus(Enum):
    GREEN = "green"      # > 25%
    YELLOW = "yellow"    # 15-25%
    RED = "red"          # < 15%


@dataclass
class MarketplaceRates:
    """Ð¡Ñ‚Ð°Ð²ÐºÐ¸ Ñ€Ð°ÑÑ…Ð¾Ð´Ð¾Ð² Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°."""
    marketplace: str
    category: str
    
    commission_pct: float
    logistics_pct: float
    return_logistics_pct: float
    storage_pct: float
    acquiring_pct: float
    
    @property
    def total_overhead_pct(self) -> float:
        return (
            self.commission_pct +
            self.logistics_pct +
            self.return_logistics_pct +
            self.storage_pct +
            self.acquiring_pct
        )


@dataclass
class UnitEconomics:
    """Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Ñ€Ð°ÑÑ‡Ñ‘Ñ‚Ð° unit-ÑÐºÐ¾Ð½Ð¾Ð¼Ð¸ÐºÐ¸."""
    marketplace: str
    
    # Ð’Ñ…Ð¾Ð´Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ
    selling_price: float
    cogs: float
    
    # Ð Ð°ÑÑ…Ð¾Ð´Ñ‹ Ð² Ñ€ÑƒÐ±Ð»ÑÑ…
    commission: float
    logistics: float
    return_logistics: float
    storage: float
    acquiring: float
    total_expenses: float
    
    # Ð Ð°ÑÑ…Ð¾Ð´Ñ‹ Ð² Ð¿Ñ€Ð¾Ñ†ÐµÐ½Ñ‚Ð°Ñ…
    commission_pct: float
    logistics_pct: float
    return_logistics_pct: float
    storage_pct: float
    acquiring_pct: float
    total_overhead_pct: float
    
    # Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ñ‹
    gross_profit: float
    net_profit: float
    gross_margin_pct: float
    net_margin_pct: float
    margin_status: MarginStatus
    
    # Ð”Ð¾Ð¿Ð¾Ð»Ð½Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ Ñ€Ð°ÑÑ‡Ñ‘Ñ‚Ñ‹
    break_even_price: float
    target_price_25: float
    target_price_30: float
    cogs_for_25_margin: float  # ÐŸÑ€Ð¸ Ñ‚ÐµÐºÑƒÑ‰ÐµÐ¹ Ñ†ÐµÐ½Ðµ


# Ð¡Ñ‚Ð°Ð²ÐºÐ¸ Ð¿Ð¾ ÑƒÐ¼Ð¾Ð»Ñ‡Ð°Ð½Ð¸ÑŽ
DEFAULT_RATES = {
    "wildberries": MarketplaceRates(
        marketplace="wildberries",
        category="default",
        commission_pct=15.0,
        logistics_pct=5.0,
        return_logistics_pct=3.0,
        storage_pct=1.0,
        acquiring_pct=0.0
    ),
    "ozon": MarketplaceRates(
        marketplace="ozon",
        category="default",
        commission_pct=18.0,
        logistics_pct=6.0,
        return_logistics_pct=4.0,
        storage_pct=1.5,
        acquiring_pct=0.0
    ),
    "yandex_market": MarketplaceRates(
        marketplace="yandex_market",
        category="default",
        commission_pct=15.0,
        logistics_pct=7.0,
        return_logistics_pct=4.0,
        storage_pct=1.0,
        acquiring_pct=1.5
    )
}
```

### 3.5.4 Ð ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Unit Calculator

```python
# services/unit_calculator.py

from typing import Dict, Optional
from dataclasses import asdict

class UnitCalculator:
    """ÐšÐ°Ð»ÑŒÐºÑƒÐ»ÑÑ‚Ð¾Ñ€ unit-ÑÐºÐ¾Ð½Ð¾Ð¼Ð¸ÐºÐ¸."""
    
    def __init__(self, db_session):
        self.db = db_session
    
    async def calculate(
        self,
        marketplace: str,
        selling_price: float,
        cogs: float,
        category: str = "default"
    ) -> UnitEconomics:
        """
        Ð Ð°ÑÑ‡Ñ‘Ñ‚ unit-ÑÐºÐ¾Ð½Ð¾Ð¼Ð¸ÐºÐ¸.
        
        Args:
            marketplace: ÐšÐ¾Ð´ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°
            selling_price: Ð¦ÐµÐ½Ð° Ð¿Ñ€Ð¾Ð´Ð°Ð¶Ð¸
            cogs: Ð¡ÐµÐ±ÐµÑÑ‚Ð¾Ð¸Ð¼Ð¾ÑÑ‚ÑŒ
            category: ÐšÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ñ Ñ‚Ð¾Ð²Ð°Ñ€Ð° (Ð´Ð»Ñ ÑÐ¿ÐµÑ†Ð¸Ñ„Ð¸Ñ‡Ð½Ñ‹Ñ… ÑÑ‚Ð°Ð²Ð¾Ðº)
        """
        # ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²Ð¾Ðº
        rates = await self._get_rates(marketplace, category)
        
        # Ð Ð°ÑÑ‡Ñ‘Ñ‚ Ñ€Ð°ÑÑ…Ð¾Ð´Ð¾Ð² Ð² Ñ€ÑƒÐ±Ð»ÑÑ…
        commission = selling_price * rates.commission_pct / 100
        logistics = selling_price * rates.logistics_pct / 100
        return_logistics = selling_price * rates.return_logistics_pct / 100
        storage = selling_price * rates.storage_pct / 100
        acquiring = selling_price * rates.acquiring_pct / 100
        
        total_expenses = commission + logistics + return_logistics + storage + acquiring
        
        # ÐŸÑ€Ð¸Ð±Ñ‹Ð»ÑŒ
        gross_profit = selling_price - cogs
        net_profit = selling_price - cogs - total_expenses
        
        # ÐœÐ°Ñ€Ð¶Ð°
        if selling_price > 0:
            gross_margin_pct = (gross_profit / selling_price) * 100
            net_margin_pct = (net_profit / selling_price) * 100
        else:
            gross_margin_pct = 0
            net_margin_pct = 0
        
        # Ð¡Ñ‚Ð°Ñ‚ÑƒÑ Ð¼Ð°Ñ€Ð¶Ð¸
        if net_margin_pct > 25:
            margin_status = MarginStatus.GREEN
        elif net_margin_pct >= 15:
            margin_status = MarginStatus.YELLOW
        else:
            margin_status = MarginStatus.RED
        
        # Ð”Ð¾Ð¿Ð¾Ð»Ð½Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ Ñ€Ð°ÑÑ‡Ñ‘Ñ‚Ñ‹
        overhead_rate = rates.total_overhead_pct / 100
        
        # Ð¢Ð¾Ñ‡ÐºÐ° Ð±ÐµÐ·ÑƒÐ±Ñ‹Ñ‚Ð¾Ñ‡Ð½Ð¾ÑÑ‚Ð¸
        if overhead_rate < 1:
            break_even_price = cogs / (1 - overhead_rate)
        else:
            break_even_price = float('inf')
        
        # Ð¦ÐµÐ½Ð° Ð´Ð»Ñ Ð¼Ð°Ñ€Ð¶Ð¸ 25%
        target_25_rate = 1 - overhead_rate - 0.25
        if target_25_rate > 0:
            target_price_25 = cogs / target_25_rate
        else:
            target_price_25 = float('inf')
        
        # Ð¦ÐµÐ½Ð° Ð´Ð»Ñ Ð¼Ð°Ñ€Ð¶Ð¸ 30%
        target_30_rate = 1 - overhead_rate - 0.30
        if target_30_rate > 0:
            target_price_30 = cogs / target_30_rate
        else:
            target_price_30 = float('inf')
        
        # COGS Ð´Ð»Ñ Ð¼Ð°Ñ€Ð¶Ð¸ 25% Ð¿Ñ€Ð¸ Ñ‚ÐµÐºÑƒÑ‰ÐµÐ¹ Ñ†ÐµÐ½Ðµ
        # net_margin = (price - cogs - overhead) / price = 0.25
        # price - cogs - price * overhead_rate = 0.25 * price
        # cogs = price * (1 - overhead_rate - 0.25)
        cogs_for_25_margin = selling_price * (1 - overhead_rate - 0.25)
        
        return UnitEconomics(
            marketplace=marketplace,
            selling_price=round(selling_price, 2),
            cogs=round(cogs, 2),
            commission=round(commission, 2),
            logistics=round(logistics, 2),
            return_logistics=round(return_logistics, 2),
            storage=round(storage, 2),
            acquiring=round(acquiring, 2),
            total_expenses=round(total_expenses, 2),
            commission_pct=rates.commission_pct,
            logistics_pct=rates.logistics_pct,
            return_logistics_pct=rates.return_logistics_pct,
            storage_pct=rates.storage_pct,
            acquiring_pct=rates.acquiring_pct,
            total_overhead_pct=rates.total_overhead_pct,
            gross_profit=round(gross_profit, 2),
            net_profit=round(net_profit, 2),
            gross_margin_pct=round(gross_margin_pct, 2),
            net_margin_pct=round(net_margin_pct, 2),
            margin_status=margin_status,
            break_even_price=round(break_even_price, 2),
            target_price_25=round(target_price_25, 2),
            target_price_30=round(target_price_30, 2),
            cogs_for_25_margin=round(max(0, cogs_for_25_margin), 2)
        )
    
    async def calculate_range(
        self,
        marketplace: str,
        selling_price: float,
        cogs_min: float,
        cogs_max: float,
        category: str = "default"
    ) -> Dict[str, UnitEconomics]:
        """
        Ð Ð°ÑÑ‡Ñ‘Ñ‚ Ð´Ð»Ñ Ð´Ð¸Ð°Ð¿Ð°Ð·Ð¾Ð½Ð° COGS.
        
        Returns:
            {"min": UnitEconomics, "avg": UnitEconomics, "max": UnitEconomics}
        """
        cogs_avg = (cogs_min + cogs_max) / 2
        
        return {
            "min": await self.calculate(marketplace, selling_price, cogs_min, category),
            "avg": await self.calculate(marketplace, selling_price, cogs_avg, category),
            "max": await self.calculate(marketplace, selling_price, cogs_max, category)
        }
    
    async def _get_rates(
        self,
        marketplace: str,
        category: str
    ) -> MarketplaceRates:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²Ð¾Ðº Ð¸Ð· Ð‘Ð” Ð¸Ð»Ð¸ default."""
        # ÐŸÐ¾Ð¿Ñ‹Ñ‚ÐºÐ° Ð¿Ð¾Ð»ÑƒÑ‡Ð¸Ñ‚ÑŒ Ð¸Ð· Ð‘Ð”
        query = """
            SELECT * FROM scout_marketplace_rates
            WHERE marketplace = $1 AND (category = $2 OR category = 'default')
            ORDER BY CASE WHEN category = $2 THEN 0 ELSE 1 END
            LIMIT 1
        """
        
        row = await self.db.fetchrow(query, marketplace, category)
        
        if row:
            return MarketplaceRates(
                marketplace=row["marketplace"],
                category=row["category"],
                commission_pct=row["commission_pct"],
                logistics_pct=row["logistics_pct"],
                return_logistics_pct=row["return_logistics_pct"],
                storage_pct=row["storage_pct"],
                acquiring_pct=row["acquiring_pct"]
            )
        
        # Fallback Ð½Ð° default
        return DEFAULT_RATES.get(marketplace, DEFAULT_RATES["wildberries"])
    
    async def update_rates(
        self,
        marketplace: str,
        rates: MarketplaceRates,
        user_id: int
    ):
        """ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²Ð¾Ðº (Senior+)."""
        query = """
            INSERT INTO scout_marketplace_rates 
            (marketplace, category, commission_pct, logistics_pct, 
             return_logistics_pct, storage_pct, acquiring_pct, updated_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (marketplace, category)
            DO UPDATE SET
                commission_pct = EXCLUDED.commission_pct,
                logistics_pct = EXCLUDED.logistics_pct,
                return_logistics_pct = EXCLUDED.return_logistics_pct,
                storage_pct = EXCLUDED.storage_pct,
                acquiring_pct = EXCLUDED.acquiring_pct,
                updated_by = EXCLUDED.updated_by,
                updated_at = NOW()
        """
        
        await self.db.execute(
            query,
            rates.marketplace,
            rates.category,
            rates.commission_pct,
            rates.logistics_pct,
            rates.return_logistics_pct,
            rates.storage_pct,
            rates.acquiring_pct,
            user_id
        )
```

---

## 3.6 AI Verdict Engine

### 3.6.1 ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

Ð¤Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ñ„Ð¸Ð½Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚Ð° Ñ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸ÐµÐ¼ Claude Opus 4.5 Ð´Ð»Ñ Ð³Ð»ÑƒÐ±Ð¾ÐºÐ¾Ð³Ð¾ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° Ð¸ Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¹.

### 3.6.2 ÐÐ»Ð³Ð¾Ñ€Ð¸Ñ‚Ð¼ Ñ„Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚Ð°

```mermaid
flowchart TB
    subgraph INPUT["Ð’Ñ…Ð¾Ð´Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ"]
        TREND["TrendResult"]
        COMP["CompetitorResult[]"]
        UNIT["UnitEconomics[]"]
    end
    
    subgraph RULE_ENGINE["Rule Engine"]
        COLLECT["Ð¡Ð±Ð¾Ñ€ ÑÑ‚Ð°Ñ‚ÑƒÑÐ¾Ð²"]
        VERDICT_RULE["ÐŸÑ€Ð°Ð²Ð¸Ð»Ð¾ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚Ð°"]
    end
    
    subgraph AI_ANALYSIS["AI Analysis (Claude Opus 4.5)"]
        CONTEXT["Ð¤Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ð°"]
        DEEP["Ð“Ð»ÑƒÐ±Ð¾ÐºÐ¸Ð¹ Ð°Ð½Ð°Ð»Ð¸Ð·"]
        RECOMMEND["Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¹"]
    end
    
    subgraph OUTPUT["Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚"]
        VERDICT["Verdict"]
        REASON["Reason"]
        RECS["Recommendations"]
        RISKS["Risks"]
        OPPS["Opportunities"]
    end
    
    TREND --> COLLECT
    COMP --> COLLECT
    UNIT --> COLLECT
    
    COLLECT --> VERDICT_RULE
    VERDICT_RULE --> CONTEXT
    
    CONTEXT --> DEEP
    DEEP --> RECOMMEND
    
    RECOMMEND --> VERDICT
    RECOMMEND --> REASON
    RECOMMEND --> RECS
    RECOMMEND --> RISKS
    RECOMMEND --> OPPS
```

### 3.6.3 ÐŸÑ€Ð°Ð²Ð¸Ð»Ð° Ð¾Ð¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ñ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚Ð°

```python
# services/verdict_engine.py

from enum import Enum
from typing import Tuple

class Verdict(Enum):
    GO = "GO"
    CONSIDER = "CONSIDER"
    RISKY = "RISKY"


def determine_verdict(
    trend_status: str,
    monopoly_status: str,
    margin_status: str
) -> Tuple[Verdict, str]:
    """
    ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚Ð° Ð½Ð° Ð¾ÑÐ½Ð¾Ð²Ðµ ÑÑ‚Ð°Ñ‚ÑƒÑÐ¾Ð² Ð¼ÐµÑ‚Ñ€Ð¸Ðº.
    
    Returns:
        (Verdict, color)
    """
    statuses = [trend_status, monopoly_status, margin_status]
    
    green_count = statuses.count("green")
    yellow_count = statuses.count("yellow")
    red_count = statuses.count("red")
    
    # RISKY: ÐµÑÑ‚ÑŒ ÐºÑ€Ð°ÑÐ½Ñ‹Ð¹ Ð¸Ð»Ð¸ Ð²ÑÐµ Ð¶Ñ‘Ð»Ñ‚Ñ‹Ðµ
    if red_count > 0:
        return (Verdict.RISKY, "red")
    
    if yellow_count == 3:
        return (Verdict.RISKY, "red")
    
    # GO: Ð²ÑÐµ Ð·ÐµÐ»Ñ‘Ð½Ñ‹Ðµ Ð¸Ð»Ð¸ 2 Ð·ÐµÐ»Ñ‘Ð½Ñ‹Ðµ + 1 Ð¶Ñ‘Ð»Ñ‚Ð°Ñ
    if green_count == 3:
        return (Verdict.GO, "green")
    
    if green_count == 2 and yellow_count == 1:
        return (Verdict.GO, "green")
    
    # CONSIDER: Ð¾ÑÑ‚Ð°Ð»ÑŒÐ½Ð¾Ðµ
    return (Verdict.CONSIDER, "yellow")
```

### 3.6.4 ÐŸÑ€Ð¾Ð¼Ð¿Ñ‚ Ð´Ð»Ñ Claude Opus 4.5

```python
# prompts/verdict_prompts.py

VERDICT_SYSTEM_PROMPT = """
Ð¢Ñ‹ â€” ÑÑ‚Ð°Ñ€ÑˆÐ¸Ð¹ Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸Ðº e-commerce, ÑÐ¿ÐµÑ†Ð¸Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÑŽÑ‰Ð¸Ð¹ÑÑ Ð½Ð° Ð¾Ñ†ÐµÐ½ÐºÐµ Ñ‚Ð¾Ð²Ð°Ñ€Ð½Ñ‹Ñ… Ð½Ð¸Ñˆ Ð´Ð»Ñ Ð²Ñ‹Ñ…Ð¾Ð´Ð° Ð½Ð° Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÑ‹.

Ð¢Ð²Ð¾Ñ Ð·Ð°Ð´Ð°Ñ‡Ð° â€” Ð¿Ñ€Ð¾Ð°Ð½Ð°Ð»Ð¸Ð·Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð¾ Ð½Ð¸ÑˆÐµ Ð¸ Ð´Ð°Ñ‚ÑŒ Ð¾Ð±Ð¾ÑÐ½Ð¾Ð²Ð°Ð½Ð½ÑƒÑŽ Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸ÑŽ.

ÐŸÑ€Ð¸Ð½Ñ†Ð¸Ð¿Ñ‹ Ð°Ð½Ð°Ð»Ð¸Ð·Ð°:
1. ÐžÐ±ÑŠÐµÐºÑ‚Ð¸Ð²Ð½Ð¾ÑÑ‚ÑŒ â€” Ð¾Ð¿Ð¸Ñ€Ð°Ð¹ÑÑ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð½Ð° Ð´Ð°Ð½Ð½Ñ‹Ðµ
2. ÐšÐ¾Ð½ÐºÑ€ÐµÑ‚Ð½Ð¾ÑÑ‚ÑŒ â€” ÑƒÐºÐ°Ð·Ñ‹Ð²Ð°Ð¹ Ñ‡Ð¸ÑÐ»Ð° Ð¸ Ð¿Ñ€Ð¾Ñ†ÐµÐ½Ñ‚Ñ‹
3. Actionable â€” Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð±Ñ‹Ñ‚ÑŒ Ð²Ñ‹Ð¿Ð¾Ð»Ð½Ð¸Ð¼Ñ‹
4. Ð Ð¸ÑÐº-Ð¾Ñ€Ð¸ÐµÐ½Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾ÑÑ‚ÑŒ â€” Ð²ÑÐµÐ³Ð´Ð° ÑƒÐºÐ°Ð·Ñ‹Ð²Ð°Ð¹ Ñ€Ð¸ÑÐºÐ¸

Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚ Ð¾Ñ‚Ð²ÐµÑ‚Ð° â€” ÑÑ‚Ñ€Ð¾Ð³Ð¾ JSON.
"""

VERDICT_USER_PROMPT = """
## ÐÐ½Ð°Ð»Ð¸Ð· Ð½Ð¸ÑˆÐ¸: {query}

### Ð˜ÑÑ…Ð¾Ð´Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ
- Ð—Ð°ÐºÑƒÐ¿Ð¾Ñ‡Ð½Ð°Ñ Ñ†ÐµÐ½Ð° (COGS): {cogs} â‚½
- ÐœÐ°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÑ‹: {marketplaces}

### Ð¢Ñ€ÐµÐ½Ð´Ñ‹ ÑÐ¿Ñ€Ð¾ÑÐ°
- Trend Slope: {trend_slope} ({trend_status})
- Ð¡Ñ€ÐµÐ´Ð½Ð¸Ð¹ Ð¾Ð±ÑŠÑ‘Ð¼ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð²: {avg_volume}/Ð¼ÐµÑ
- Ð”Ð¸Ð½Ð°Ð¼Ð¸ÐºÐ°: {trend_direction}
- Ð¡ÐµÐ·Ð¾Ð½Ð½Ð¾ÑÑ‚ÑŒ: {seasonality}
- Ð£Ð²ÐµÑ€ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð² Ð´Ð°Ð½Ð½Ñ‹Ñ…: {trend_confidence}%

### ÐšÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð½Ñ‹Ð¹ Ð°Ð½Ð°Ð»Ð¸Ð·
{competitor_analysis}

### Unit-ÑÐºÐ¾Ð½Ð¾Ð¼Ð¸ÐºÐ°
{unit_economics}

### ÐŸÑ€ÐµÐ´Ð²Ð°Ñ€Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ð¹ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚
ÐÐ° Ð¾ÑÐ½Ð¾Ð²Ðµ Ð¿Ñ€Ð°Ð²Ð¸Ð»: **{preliminary_verdict}**

---

ÐŸÑ€Ð¾Ð°Ð½Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÐ¹ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð¸ Ð²ÐµÑ€Ð½Ð¸ JSON:
{{
    "verdict": "{preliminary_verdict}",
    "confidence": <float 0-1, Ñ‚Ð²Ð¾Ñ ÑƒÐ²ÐµÑ€ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð² Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚Ðµ>,
    
    "summary": "<2-3 Ð¿Ñ€ÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ: Ð³Ð»Ð°Ð²Ð½Ñ‹Ð¹ Ð²Ñ‹Ð²Ð¾Ð´>",
    
    "detailed_analysis": {{
        "trend_assessment": "<Ð¾Ñ†ÐµÐ½ÐºÐ° Ñ‚Ñ€ÐµÐ½Ð´Ð¾Ð²>",
        "competition_assessment": "<Ð¾Ñ†ÐµÐ½ÐºÐ° ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ†Ð¸Ð¸>",
        "economics_assessment": "<Ð¾Ñ†ÐµÐ½ÐºÐ° ÑÐºÐ¾Ð½Ð¾Ð¼Ð¸ÐºÐ¸>"
    }},
    
    "key_metrics": {{
        "trend_slope": {trend_slope},
        "monopoly_rate": <float>,
        "expected_margin": <float %>
    }},
    
    "recommendations": [
        "<ÐºÐ¾Ð½ÐºÑ€ÐµÑ‚Ð½Ð°Ñ Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ñ 1>",
        "<ÐºÐ¾Ð½ÐºÑ€ÐµÑ‚Ð½Ð°Ñ Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ñ 2>",
        ...
    ],
    
    "risks": [
        {{
            "risk": "<Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ Ñ€Ð¸ÑÐºÐ°>",
            "probability": "<low/medium/high>",
            "mitigation": "<ÐºÐ°Ðº ÑÐ½Ð¸Ð·Ð¸Ñ‚ÑŒ>"
        }},
        ...
    ],
    
    "opportunities": [
        "<Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚ÑŒ 1>",
        "<Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚ÑŒ 2>",
        ...
    ],
    
    "action_plan": {{
        "if_go": ["<ÑˆÐ°Ð³ 1>", "<ÑˆÐ°Ð³ 2>", ...],
        "if_not": ["<Ð°Ð»ÑŒÑ‚ÐµÑ€Ð½Ð°Ñ‚Ð¸Ð²Ð° 1>", ...]
    }},
    
    "price_recommendations": {{
        "optimal_price": <float>,
        "min_viable_price": <float>,
        "premium_price": <float>,
        "reasoning": "<Ð¾Ð±Ð¾ÑÐ½Ð¾Ð²Ð°Ð½Ð¸Ðµ>"
    }}
}}
"""

COMPETITOR_SECTION_TEMPLATE = """
#### {marketplace}
- Monopoly Rate: {monopoly_rate}% ({monopoly_status})
- Ð£Ð½Ð¸ÐºÐ°Ð»ÑŒÐ½Ñ‹Ñ… Ð¿Ñ€Ð¾Ð´Ð°Ð²Ñ†Ð¾Ð²: {unique_sellers}
- Ð¡Ñ€ÐµÐ´Ð½ÑÑ Ñ†ÐµÐ½Ð°: {avg_price} â‚½
- Ð¦ÐµÐ½Ð¾Ð²Ð¾Ð¹ Ð´Ð¸Ð°Ð¿Ð°Ð·Ð¾Ð½: {price_min} â€” {price_max} â‚½
- Ð¡Ñ€ÐµÐ´Ð½Ð¸Ð¹ Ñ€ÐµÐ¹Ñ‚Ð¸Ð½Ð³: {avg_rating}
- Ð‘Ð°Ñ€ÑŒÐµÑ€ Ð²Ñ…Ð¾Ð´Ð°: {entry_barrier} (score: {barrier_score})

Ð¢ÐžÐŸ-3 Ð¿Ñ€Ð¾Ð´Ð°Ð²Ñ†Ð°:
{top_sellers}
"""

UNIT_ECONOMICS_TEMPLATE = """
#### {marketplace}
- Ð¦ÐµÐ½Ð° Ð¿Ñ€Ð¾Ð´Ð°Ð¶Ð¸: {selling_price} â‚½
- Ð¡ÐµÐ±ÐµÑÑ‚Ð¾Ð¸Ð¼Ð¾ÑÑ‚ÑŒ: {cogs} â‚½
- Overhead: {overhead}%
- Ð§Ð¸ÑÑ‚Ð°Ñ Ð¿Ñ€Ð¸Ð±Ñ‹Ð»ÑŒ: {net_profit} â‚½
- Ð§Ð¸ÑÑ‚Ð°Ñ Ð¼Ð°Ñ€Ð¶Ð°: {net_margin}% ({margin_status})
- Ð¢Ð¾Ñ‡ÐºÐ° Ð±ÐµÐ·ÑƒÐ±Ñ‹Ñ‚Ð¾Ñ‡Ð½Ð¾ÑÑ‚Ð¸: {break_even} â‚½
- Ð¦ÐµÐ½Ð° Ð´Ð»Ñ Ð¼Ð°Ñ€Ð¶Ð¸ 25%: {target_price_25} â‚½
"""
```

### 3.6.5 Ð ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Verdict Engine

```python
# services/verdict_engine.py

from typing import Dict, List, Optional
from dataclasses import dataclass
from datetime import datetime
import uuid

@dataclass
class VerdictMetrics:
    """ÐšÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ðµ Ð¼ÐµÑ‚Ñ€Ð¸ÐºÐ¸ Ð´Ð»Ñ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚Ð°."""
    trend_slope: float
    trend_status: str
    monopoly_rate: float
    monopoly_status: str
    expected_margin: float
    margin_status: str


@dataclass
class VerdictResult:
    """ÐŸÐ¾Ð»Ð½Ñ‹Ð¹ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Ð°Ð½Ð°Ð»Ð¸Ð·Ð°."""
    analysis_id: str
    query: str
    marketplaces: List[str]
    
    # Ð’ÐµÑ€Ð´Ð¸ÐºÑ‚
    verdict: Verdict
    color: str
    confidence: float
    
    # ÐœÐµÑ‚Ñ€Ð¸ÐºÐ¸
    metrics: VerdictMetrics
    
    # AI-Ð°Ð½Ð°Ð»Ð¸Ð·
    summary: str
    detailed_analysis: Dict[str, str]
    recommendations: List[str]
    risks: List[Dict]
    opportunities: List[str]
    action_plan: Dict[str, List[str]]
    price_recommendations: Dict
    
    # Ð˜ÑÑ…Ð¾Ð´Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ
    trend_result: 'TrendResult'
    competitor_results: Dict[str, 'CompetitorResult']
    unit_economics: Dict[str, 'UnitEconomics']
    
    # ÐœÐµÑ‚Ð°Ð´Ð°Ð½Ð½Ñ‹Ðµ
    user_id: int
    cogs_input: float
    cogs_range: Optional[tuple]
    data_sources: List[str]
    analyzed_at: datetime
    processing_time_ms: int


class VerdictEngine:
    """Ð”Ð²Ð¸Ð¶Ð¾Ðº Ñ„Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚Ð°."""
    
    def __init__(self, ai_client):
        self.ai = ai_client
    
    async def generate_verdict(
        self,
        trend_result: 'TrendResult',
        competitor_results: Dict[str, 'CompetitorResult'],
        unit_economics: Dict[str, 'UnitEconomics'],
        parsed_input: 'ParsedInput',
        user_id: int
    ) -> VerdictResult:
        """
        Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Ð¿Ð¾Ð»Ð½Ð¾Ð³Ð¾ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚Ð°.
        """
        start_time = datetime.utcnow()
        
        # ÐÐ³Ñ€ÐµÐ³Ð°Ñ†Ð¸Ñ Ð¼ÐµÑ‚Ñ€Ð¸Ðº
        metrics = self._aggregate_metrics(
            trend_result,
            competitor_results,
            unit_economics
        )
        
        # ÐŸÑ€ÐµÐ´Ð²Ð°Ñ€Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ð¹ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚ Ð¿Ð¾ Ð¿Ñ€Ð°Ð²Ð¸Ð»Ð°Ð¼
        preliminary_verdict, color = determine_verdict(
            metrics.trend_status,
            metrics.monopoly_status,
            metrics.margin_status
        )
        
        # Ð¤Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ð° Ð´Ð»Ñ AI
        context = self._build_context(
            parsed_input,
            trend_result,
            competitor_results,
            unit_economics,
            metrics,
            preliminary_verdict
        )
        
        # Ð—Ð°Ð¿Ñ€Ð¾Ñ Ðº Claude Opus 4.5
        ai_response = await self._call_ai(context)
        
        # ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ Ð¾Ñ‚Ð²ÐµÑ‚Ð°
        analysis_id = str(uuid.uuid4())
        processing_time = int((datetime.utcnow() - start_time).total_seconds() * 1000)
        
        return VerdictResult(
            analysis_id=analysis_id,
            query=parsed_input.query,
            marketplaces=parsed_input.marketplaces,
            verdict=preliminary_verdict,
            color=color,
            confidence=ai_response.get("confidence", 0.7),
            metrics=metrics,
            summary=ai_response.get("summary", ""),
            detailed_analysis=ai_response.get("detailed_analysis", {}),
            recommendations=ai_response.get("recommendations", []),
            risks=ai_response.get("risks", []),
            opportunities=ai_response.get("opportunities", []),
            action_plan=ai_response.get("action_plan", {}),
            price_recommendations=ai_response.get("price_recommendations", {}),
            trend_result=trend_result,
            competitor_results=competitor_results,
            unit_economics=unit_economics,
            user_id=user_id,
            cogs_input=parsed_input.cogs,
            cogs_range=(parsed_input.cogs_min, parsed_input.cogs_max) if parsed_input.cogs_min else None,
            data_sources=trend_result.sources_used,
            analyzed_at=datetime.utcnow(),
            processing_time_ms=processing_time
        )
    
    def _aggregate_metrics(
        self,
        trend: 'TrendResult',
        competitors: Dict[str, 'CompetitorResult'],
        economics: Dict[str, 'UnitEconomics']
    ) -> VerdictMetrics:
        """ÐÐ³Ñ€ÐµÐ³Ð°Ñ†Ð¸Ñ Ð¼ÐµÑ‚Ñ€Ð¸Ðº Ð¸Ð· Ð²ÑÐµÑ… Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¾Ð²."""
        
        # Trend
        trend_slope = trend.trend_slope
        trend_status = trend.trend_status.value
        
        # Monopoly â€” ÑÑ€ÐµÐ´Ð½ÐµÐµ Ð¿Ð¾ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°Ð¼
        monopoly_rates = [c.monopoly_rate for c in competitors.values()]
        avg_monopoly = sum(monopoly_rates) / len(monopoly_rates) if monopoly_rates else 0
        
        if avg_monopoly < 0.5:
            monopoly_status = "green"
        elif avg_monopoly < 0.7:
            monopoly_status = "yellow"
        else:
            monopoly_status = "red"
        
        # Margin â€” ÑÑ€ÐµÐ´Ð½ÐµÐµ Ð¿Ð¾ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°Ð¼
        margins = [e.net_margin_pct for e in economics.values()]
        avg_margin = sum(margins) / len(margins) if margins else 0
        
        if avg_margin > 25:
            margin_status = "green"
        elif avg_margin >= 15:
            margin_status = "yellow"
        else:
            margin_status = "red"
        
        return VerdictMetrics(
            trend_slope=trend_slope,
            trend_status=trend_status,
            monopoly_rate=round(avg_monopoly, 4),
            monopoly_status=monopoly_status,
            expected_margin=round(avg_margin, 2),
            margin_status=margin_status
        )
    
    def _build_context(
        self,
        parsed_input: 'ParsedInput',
        trend: 'TrendResult',
        competitors: Dict[str, 'CompetitorResult'],
        economics: Dict[str, 'UnitEconomics'],
        metrics: VerdictMetrics,
        preliminary_verdict: Verdict
    ) -> str:
        """ÐŸÐ¾ÑÑ‚Ñ€Ð¾ÐµÐ½Ð¸Ðµ ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ð° Ð´Ð»Ñ AI."""
        from prompts.verdict_prompts import (
            VERDICT_USER_PROMPT,
            COMPETITOR_SECTION_TEMPLATE,
            UNIT_ECONOMICS_TEMPLATE
        )
        
        # Ð¡ÐµÐºÑ†Ð¸Ñ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð¾Ð²
        competitor_sections = []
        for mp, comp in competitors.items():
            top_sellers_text = "\n".join([
                f"  {i+1}. {s.name} â€” {s.share*100:.1f}% (Ñ€ÐµÐ¹Ñ‚Ð¸Ð½Ð³ {s.avg_rating})"
                for i, s in enumerate(comp.top_sellers[:3])
            ])
            
            section = COMPETITOR_SECTION_TEMPLATE.format(
                marketplace=mp,
                monopoly_rate=round(comp.monopoly_rate * 100, 1),
                monopoly_status=comp.monopoly_status.value,
                unique_sellers=comp.unique_sellers_count,
                avg_price=round(comp.price_analysis.avg),
                price_min=round(comp.price_analysis.min),
                price_max=round(comp.price_analysis.max),
                avg_rating=comp.quality_analysis.avg_rating,
                entry_barrier=comp.entry_barrier.value,
                barrier_score=comp.entry_barrier_score,
                top_sellers=top_sellers_text
            )
            competitor_sections.append(section)
        
        # Ð¡ÐµÐºÑ†Ð¸Ñ unit-ÑÐºÐ¾Ð½Ð¾Ð¼Ð¸ÐºÐ¸
        economics_sections = []
        for mp, econ in economics.items():
            section = UNIT_ECONOMICS_TEMPLATE.format(
                marketplace=mp,
                selling_price=round(econ.selling_price),
                cogs=round(econ.cogs),
                overhead=round(econ.total_overhead_pct, 1),
                net_profit=round(econ.net_profit),
                net_margin=round(econ.net_margin_pct, 1),
                margin_status=econ.margin_status.value,
                break_even=round(econ.break_even_price),
                target_price_25=round(econ.target_price_25)
            )
            economics_sections.append(section)
        
        # Ð¤Ð¸Ð½Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ð¿Ñ€Ð¾Ð¼Ð¿Ñ‚
        return VERDICT_USER_PROMPT.format(
            query=parsed_input.query,
            cogs=parsed_input.cogs,
            marketplaces=", ".join(parsed_input.marketplaces),
            trend_slope=trend.trend_slope,
            trend_status=metrics.trend_status,
            avg_volume=trend.avg_monthly_volume,
            trend_direction="Ñ€Ð¾ÑÑ‚" if trend.is_growing else ("Ð¿Ð°Ð´ÐµÐ½Ð¸Ðµ" if trend.is_declining else "ÑÑ‚Ð°Ð±Ð¸Ð»ÑŒÐ½Ð¾"),
            seasonality="Ð´Ð°" if trend.seasonality_detected else "Ð½ÐµÑ‚",
            trend_confidence=round(trend.confidence * 100),
            competitor_analysis="\n".join(competitor_sections),
            unit_economics="\n".join(economics_sections),
            preliminary_verdict=preliminary_verdict.value
        )
    
    async def _call_ai(self, context: str) -> Dict:
        """Ð’Ñ‹Ð·Ð¾Ð² Claude Opus 4.5."""
        from prompts.verdict_prompts import VERDICT_SYSTEM_PROMPT
        
        response = await self.ai.complete(
            model="claude-opus-4-5-20250514",
            system=VERDICT_SYSTEM_PROMPT,
            user=context,
            response_format="json",
            max_tokens=2000
        )
        
        return response
```

---

## 3.7 ÐŸÐ¾Ð»Ð½Ñ‹Ð¹ Pipeline

### 3.7.1 ÐžÑ€ÐºÐµÑÑ‚Ñ€Ð°Ñ‚Ð¾Ñ€

```python
# services/analysis_orchestrator.py

from typing import Optional
from datetime import datetime

class AnalysisOrchestrator:
    """ÐžÑ€ÐºÐµÑÑ‚Ñ€Ð°Ñ‚Ð¾Ñ€ Ð¿Ð¾Ð»Ð½Ð¾Ð³Ð¾ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° Ð½Ð¸ÑˆÐ¸."""
    
    def __init__(
        self,
        input_parser: InputParser,
        trend_miner: TrendMiner,
        competitor_analyzer: CompetitorAnalyzer,
        unit_calculator: UnitCalculator,
        verdict_engine: VerdictEngine,
        history_manager: 'HistoryManager'
    ):
        self.parser = input_parser
        self.trend = trend_miner
        self.competitor = competitor_analyzer
        self.unit = unit_calculator
        self.verdict = verdict_engine
        self.history = history_manager
    
    async def analyze(
        self,
        user_input: str,
        user_id: int
    ) -> VerdictResult:
        """
        ÐŸÐ¾Ð»Ð½Ñ‹Ð¹ Ð°Ð½Ð°Ð»Ð¸Ð· Ð½Ð¸ÑˆÐ¸.
        
        Args:
            user_input: Ð¡Ñ‹Ñ€Ð¾Ð¹ Ð²Ð²Ð¾Ð´ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
            user_id: ID Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
            
        Returns:
            VerdictResult Ñ Ð¿Ð¾Ð»Ð½Ñ‹Ð¼ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð¼
        """
        # 1. ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ Ð²Ð²Ð¾Ð´Ð°
        parsed = self.parser.parse(user_input)
        
        if parsed.cogs <= 0:
            raise ValueError("ÐÐµ ÑƒÐºÐ°Ð·Ð°Ð½Ð° Ð·Ð°ÐºÑƒÐ¿Ð¾Ñ‡Ð½Ð°Ñ Ñ†ÐµÐ½Ð° (COGS)")
        
        # 2. ÐŸÐ°Ñ€Ð°Ð»Ð»ÐµÐ»ÑŒÐ½Ñ‹Ð¹ ÑÐ±Ð¾Ñ€ Ð´Ð°Ð½Ð½Ñ‹Ñ…
        import asyncio
        
        trend_task = self.trend.analyze(parsed)
        competitor_task = self.competitor.analyze(parsed)
        
        trend_result, competitor_results = await asyncio.gather(
            trend_task,
            competitor_task
        )
        
        # 3. Ð Ð°ÑÑ‡Ñ‘Ñ‚ unit-ÑÐºÐ¾Ð½Ð¾Ð¼Ð¸ÐºÐ¸
        unit_economics = {}
        for mp, comp in competitor_results.items():
            avg_price = comp.price_analysis.avg
            
            if parsed.cogs_min and parsed.cogs_max:
                # Ð”Ð¸Ð°Ð¿Ð°Ð·Ð¾Ð½ COGS
                econ = await self.unit.calculate_range(
                    marketplace=mp,
                    selling_price=avg_price,
                    cogs_min=parsed.cogs_min,
                    cogs_max=parsed.cogs_max
                )
                unit_economics[mp] = econ["avg"]
            else:
                # ÐžÐ´Ð½Ð¾ Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ COGS
                unit_economics[mp] = await self.unit.calculate(
                    marketplace=mp,
                    selling_price=avg_price,
                    cogs=parsed.cogs
                )
        
        # 4. Ð¤Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚Ð°
        result = await self.verdict.generate_verdict(
            trend_result=trend_result,
            competitor_results=competitor_results,
            unit_economics=unit_economics,
            parsed_input=parsed,
            user_id=user_id
        )
        
        # 5. Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ð² Ð¸ÑÑ‚Ð¾Ñ€Ð¸ÑŽ
        await self.history.save(result)
        
        return result
```

---

## 3.8 ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð¾ÑˆÐ¸Ð±Ð¾Ðº

### 3.8.1 Ð¢Ð¸Ð¿Ñ‹ Ð¾ÑˆÐ¸Ð±Ð¾Ðº AI Pipeline

| ÐžÑˆÐ¸Ð±ÐºÐ° | ÐŸÑ€Ð¸Ñ‡Ð¸Ð½Ð° | Ð”ÐµÐ¹ÑÑ‚Ð²Ð¸Ðµ |
|--------|---------|----------|
| `ParsingError` | ÐÐµ ÑƒÐ´Ð°Ð»Ð¾ÑÑŒ Ñ€Ð°Ð·Ð¾Ð±Ñ€Ð°Ñ‚ÑŒ Ð²Ð²Ð¾Ð´ | Ð—Ð°Ð¿Ñ€Ð¾ÑÐ¸Ñ‚ÑŒ ÑƒÑ‚Ð¾Ñ‡Ð½ÐµÐ½Ð¸Ðµ |
| `MissingCOGSError` | ÐÐµ ÑƒÐºÐ°Ð·Ð°Ð½Ð° Ð·Ð°ÐºÑƒÐ¿Ð¾Ñ‡Ð½Ð°Ñ Ñ†ÐµÐ½Ð° | Ð—Ð°Ð¿Ñ€Ð¾ÑÐ¸Ñ‚ÑŒ COGS |
| `DataSourceError` | Ð˜ÑÑ‚Ð¾Ñ‡Ð½Ð¸Ðº Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð½ÐµÐ´Ð¾ÑÑ‚ÑƒÐ¿ÐµÐ½ | Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ fallback |
| `AIServiceError` | ÐžÑˆÐ¸Ð±ÐºÐ° AI-ÑÐµÑ€Ð²Ð¸ÑÐ° | Retry Ñ backoff |
| `TimeoutError` | ÐŸÑ€ÐµÐ²Ñ‹ÑˆÐµÐ½Ð¾ Ð²Ñ€ÐµÐ¼Ñ Ð¾Ð¶Ð¸Ð´Ð°Ð½Ð¸Ñ | Ð§Ð°ÑÑ‚Ð¸Ñ‡Ð½Ñ‹Ð¹ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ |

### 3.8.2 Graceful Degradation

```python
async def analyze_with_fallback(
    self,
    user_input: str,
    user_id: int
) -> VerdictResult:
    """ÐÐ½Ð°Ð»Ð¸Ð· Ñ graceful degradation."""
    try:
        return await self.analyze(user_input, user_id)
    
    except DataSourceError as e:
        # ÐŸÑ€Ð¾Ð´Ð¾Ð»Ð¶Ð°ÐµÐ¼ Ñ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹Ð¼Ð¸ Ð´Ð°Ð½Ð½Ñ‹Ð¼Ð¸
        logger.warning(f"Data source failed: {e}")
        return await self._analyze_partial(user_input, user_id)
    
    except AIServiceError as e:
        # Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼ rule-based Ð²ÐµÑ€Ð´Ð¸ÐºÑ‚
        logger.error(f"AI service failed: {e}")
        return await self._analyze_without_ai(user_input, user_id)
```

---

**Ð”Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚ Ð¿Ð¾Ð´Ð³Ð¾Ñ‚Ð¾Ð²Ð»ÐµÐ½:** Ð¯Ð½Ð²Ð°Ñ€ÑŒ 2026  
**Ð’ÐµÑ€ÑÐ¸Ñ:** 1.0  
**Ð¡Ñ‚Ð°Ñ‚ÑƒÑ:** Ð§ÐµÑ€Ð½Ð¾Ð²Ð¸Ðº

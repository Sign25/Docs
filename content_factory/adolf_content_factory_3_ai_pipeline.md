---
title: "Раздел 3: AI Pipeline"
mode: "wide"
---

**ÐŸÑ€Ð¾ÐµÐºÑ‚:** Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ SEO-ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð° Ð´Ð»Ñ ÐºÐ°Ñ€Ñ‚Ð¾Ñ‡ÐµÐº Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð²  
**ÐœÐ¾Ð´ÑƒÐ»ÑŒ:** Content Factory  
**Ð’ÐµÑ€ÑÐ¸Ñ:** 1.0  
**Ð”Ð°Ñ‚Ð°:** Ð¯Ð½Ð²Ð°Ñ€ÑŒ 2026

---

## 3.1 ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

AI Pipeline â€” ÐºÐ¾Ð½Ð²ÐµÐ¹ÐµÑ€ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¸ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¸ Ð³ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ð¸ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð° Ñ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸ÐµÐ¼ AI-Ð¼Ð¾Ð´ÐµÐ»ÐµÐ¹.

### Ð­Ñ‚Ð°Ð¿Ñ‹ Ð¿Ð°Ð¹Ð¿Ð»Ð°Ð¹Ð½Ð°

```mermaid
graph LR
    subgraph INPUT["Ð’Ñ…Ð¾Ð´Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ"]
        A1["Ð”Ð°Ð½Ð½Ñ‹Ðµ ÐºÐ°Ñ€Ñ‚Ð¾Ñ‡ÐºÐ¸"]
        A2["Knowledge Base"]
        A3["Ð ÑƒÑ‡Ð½Ð¾Ð¹ Ð²Ð²Ð¾Ð´"]
        A4["ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ Ð±Ñ€ÐµÐ½Ð´Ð°"]
    end

    subgraph PIPELINE["AI Pipeline"]
        B["Context Builder"]
        C["Analyzer<br/>(GPT-5 mini)"]
        D["Generator<br/>(Claude Opus)"]
        E["Validator"]
    end

    subgraph OUTPUT["Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚"]
        F["Ð§ÐµÑ€Ð½Ð¾Ð²Ð¸Ðº ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð°"]
    end

    A1 & A2 & A3 & A4 --> B
    B --> C
    C --> D
    D --> E
    E --> F
```

### Ð Ð°ÑÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ AI-Ð¼Ð¾Ð´ÐµÐ»ÐµÐ¹

| Ð­Ñ‚Ð°Ð¿ | ÐœÐ¾Ð´ÐµÐ»ÑŒ | ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ |
|------|--------|------------|
| ÐÐ½Ð°Ð»Ð¸Ð· ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ð° | GPT-5 mini | Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ñ… ÑÐ»Ð¾Ð², ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð¸Ð·Ð°Ñ†Ð¸Ñ |
| Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Title | Claude Opus 4.5 | ÐšÑ€ÐµÐ°Ñ‚Ð¸Ð²Ð½Ð¾Ðµ Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ðµ Ñ SEO |
| Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Description | Claude Opus 4.5 | ÐŸÑ€Ð¾Ð´Ð°ÑŽÑ‰ÐµÐµ Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ |
| Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Attributes | Claude Opus 4.5 | Ð—Ð°Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ðµ Ñ…Ð°Ñ€Ð°ÐºÑ‚ÐµÑ€Ð¸ÑÑ‚Ð¸Ðº |
| Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ SEO-Ñ‚ÐµÐ³Ð¾Ð² | Claude Opus 4.5 | ÐšÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ðµ ÑÐ»Ð¾Ð²Ð° Ð´Ð»Ñ Ð¿Ð¾Ð¸ÑÐºÐ° |
| Visual Prompting | GPT-5 mini | Ð¢Ð— Ð´Ð»Ñ Ð´Ð¸Ð·Ð°Ð¹Ð½ÐµÑ€Ð° |

---

## 3.2 Context Builder

### 3.2.1 ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

Ð¡Ð±Ð¾Ñ€ Ð¸ Ð°Ð³Ñ€ÐµÐ³Ð°Ñ†Ð¸Ñ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¸Ð· Ñ€Ð°Ð·Ð»Ð¸Ñ‡Ð½Ñ‹Ñ… Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¾Ð² Ð´Ð»Ñ Ñ„Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ð° Ð³ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ð¸.

### 3.2.2 Ð˜ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¸ Ð´Ð°Ð½Ð½Ñ‹Ñ…

```mermaid
graph TB
    subgraph SOURCES["Ð˜ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¸"]
        MP["Marketplace API<br/>Ð¢ÐµÐºÑƒÑ‰Ð°Ñ ÐºÐ°Ñ€Ñ‚Ð¾Ñ‡ÐºÐ°"]
        KB["Knowledge Base<br/>Ð”Ð°Ð½Ð½Ñ‹Ðµ Ð¾ Ñ‚Ð¾Ð²Ð°Ñ€Ðµ"]
        MANUAL["Ð ÑƒÑ‡Ð½Ð¾Ð¹ Ð²Ð²Ð¾Ð´<br/>ÐžÑÐ¾Ð±ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸, Ð°ÐºÑ†ÐµÐ½Ñ‚Ñ‹"]
        SETTINGS["Brand Settings<br/>Ð¢Ð¾Ð½, ÑÑ‚Ð¸Ð»ÑŒ, Ð·Ð°Ð¿Ñ€ÐµÑ‚Ñ‹"]
    end

    subgraph BUILDER["Context Builder"]
        COLLECT["Ð¡Ð±Ð¾Ñ€ Ð´Ð°Ð½Ð½Ñ‹Ñ…"]
        MERGE["ÐžÐ±ÑŠÐµÐ´Ð¸Ð½ÐµÐ½Ð¸Ðµ"]
        FORMAT["Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ"]
    end

    subgraph OUTPUT["Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚"]
        CTX["GenerationContext"]
    end

    MP --> COLLECT
    KB --> COLLECT
    MANUAL --> COLLECT
    SETTINGS --> COLLECT
    
    COLLECT --> MERGE
    MERGE --> FORMAT
    FORMAT --> CTX
```

### 3.2.3 Ð¡Ñ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð° ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ð°

```python
from dataclasses import dataclass, field
from typing import Optional, List, Dict


@dataclass
class BrandSettings:
    """ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ ÑÑ‚Ð¸Ð»Ñ Ð±Ñ€ÐµÐ½Ð´Ð°."""
    brand_id: str
    brand_name: str
    tone: str                              # "ÑÑ‚Ð¸Ð»ÑŒÐ½Ñ‹Ð¹", "Ð·Ð°Ð±Ð¾Ñ‚Ð»Ð¸Ð²Ñ‹Ð¹"
    accent_words: List[str] = field(default_factory=list)
    forbidden_words: List[str] = field(default_factory=list)
    title_template: Optional[str] = None   # Ð¨Ð°Ð±Ð»Ð¾Ð½ Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ñ
    description_style: Optional[str] = None


@dataclass
class ProductKnowledge:
    """Ð”Ð°Ð½Ð½Ñ‹Ðµ Ð¾ Ñ‚Ð¾Ð²Ð°Ñ€Ðµ Ð¸Ð· Knowledge Base."""
    composition: Optional[str] = None      # Ð¡Ð¾ÑÑ‚Ð°Ð² Ñ‚ÐºÐ°Ð½Ð¸
    size_chart: Optional[str] = None       # Ð Ð°Ð·Ð¼ÐµÑ€Ð½Ð°Ñ ÑÐµÑ‚ÐºÐ°
    care_instructions: Optional[str] = None # Ð£Ñ…Ð¾Ð´ Ð·Ð° Ð¸Ð·Ð´ÐµÐ»Ð¸ÐµÐ¼
    features: List[str] = field(default_factory=list)
    source_documents: List[str] = field(default_factory=list)


@dataclass
class ManualInput:
    """Ð ÑƒÑ‡Ð½Ð¾Ð¹ Ð²Ð²Ð¾Ð´ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ."""
    key_features: List[str] = field(default_factory=list)
    target_audience: Optional[str] = None
    unique_selling_points: List[str] = field(default_factory=list)
    additional_notes: Optional[str] = None
    # Ð”Ð»Ñ Visual Prompting
    known_issues: List[str] = field(default_factory=list)
    photo_requirements: List[str] = field(default_factory=list)


@dataclass
class GenerationContext:
    """ÐŸÐ¾Ð»Ð½Ñ‹Ð¹ ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚ Ð´Ð»Ñ Ð³ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ð¸."""
    # Ð˜Ð´ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ñ
    sku: str
    marketplace: str
    category: str
    category_id: int
    
    # Ð¢ÐµÐºÑƒÑ‰Ð¸Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ ÐºÐ°Ñ€Ñ‚Ð¾Ñ‡ÐºÐ¸
    current_title: Optional[str] = None
    current_description: Optional[str] = None
    current_attributes: Dict = field(default_factory=dict)
    
    # ÐžÐ±Ð¾Ð³Ð°Ñ‰ÐµÐ½Ð¸Ðµ
    brand_settings: Optional[BrandSettings] = None
    product_knowledge: Optional[ProductKnowledge] = None
    manual_input: Optional[ManualInput] = None
    
    # ÐœÐµÑ‚Ð°Ð´Ð°Ð½Ð½Ñ‹Ðµ
    user_id: str = ""
    request_id: str = ""
```

### 3.2.4 Ð ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Context Builder

```python
class ContextBuilder:
    """ÐŸÐ¾ÑÑ‚Ñ€Ð¾Ð¸Ñ‚ÐµÐ»ÑŒ ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ð° Ð´Ð»Ñ Ð³ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ð¸."""
    
    def __init__(
        self,
        knowledge_api: KnowledgeAPI,
        settings_repo: SettingsRepository
    ):
        self.knowledge_api = knowledge_api
        self.settings_repo = settings_repo
    
    async def build(
        self,
        card_data: CardData,
        manual_input: Optional[ManualInput] = None,
        user_id: str = ""
    ) -> GenerationContext:
        """Ð¡Ð±Ð¾Ñ€ÐºÐ° ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ð° Ð´Ð»Ñ Ð³ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ð¸."""
        
        # ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð½Ð°ÑÑ‚Ñ€Ð¾ÐµÐº Ð±Ñ€ÐµÐ½Ð´Ð°
        brand_settings = await self._get_brand_settings(card_data.brand)
        
        # ÐŸÐ¾Ð¸ÑÐº Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð² Knowledge Base
        product_knowledge = await self._search_knowledge(card_data.sku)
        
        return GenerationContext(
            sku=card_data.sku,
            marketplace=card_data.marketplace.value,
            category=card_data.category or "",
            category_id=card_data.category_id or 0,
            current_title=card_data.title,
            current_description=card_data.description,
            current_attributes=card_data.attributes or {},
            brand_settings=brand_settings,
            product_knowledge=product_knowledge,
            manual_input=manual_input,
            user_id=user_id,
            request_id=generate_request_id()
        )
    
    async def _get_brand_settings(self, brand_name: str) -> Optional[BrandSettings]:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð½Ð°ÑÑ‚Ñ€Ð¾ÐµÐº Ð±Ñ€ÐµÐ½Ð´Ð°."""
        
        # ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ brand_id Ð¿Ð¾ Ð½Ð°Ð·Ð²Ð°Ð½Ð¸ÑŽ
        brand_id = self._resolve_brand_id(brand_name)
        
        settings = await self.settings_repo.get_content_settings(brand_id)
        if not settings:
            return None
        
        return BrandSettings(
            brand_id=brand_id,
            brand_name=brand_name,
            tone=settings.get("tone", "Ð½ÐµÐ¹Ñ‚Ñ€Ð°Ð»ÑŒÐ½Ñ‹Ð¹"),
            accent_words=settings.get("accent_words", []),
            forbidden_words=settings.get("forbidden_words", []),
            title_template=settings.get("title_template"),
            description_style=settings.get("description_style")
        )
    
    def _resolve_brand_id(self, brand_name: str) -> str:
        """ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ brand_id Ð¿Ð¾ Ð½Ð°Ð·Ð²Ð°Ð½Ð¸ÑŽ Ð±Ñ€ÐµÐ½Ð´Ð°."""
        
        brand_lower = brand_name.lower() if brand_name else ""
        
        if "ÐºÐ¸Ð´Ñ" in brand_lower or "kids" in brand_lower:
            return "ohana_kids"
        elif "Ð¾Ñ…Ð°Ð½Ð°" in brand_lower or "ohana" in brand_lower:
            return "ohana_market"
        else:
            return "ohana_market"  # Default
    
    async def _search_knowledge(self, sku: str) -> Optional[ProductKnowledge]:
        """ÐŸÐ¾Ð¸ÑÐº Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¾ Ñ‚Ð¾Ð²Ð°Ñ€Ðµ Ð² Knowledge Base."""
        
        try:
            results = await self.knowledge_api.search(
                query=f"Ð°Ñ€Ñ‚Ð¸ÐºÑƒÐ» {sku} ÑÐ¾ÑÑ‚Ð°Ð² Ñ€Ð°Ð·Ð¼ÐµÑ€ Ñ…Ð°Ñ€Ð°ÐºÑ‚ÐµÑ€Ð¸ÑÑ‚Ð¸ÐºÐ¸ ÑƒÑ…Ð¾Ð´",
                filters={"category": "product"},
                limit=5
            )
            
            if not results:
                return None
            
            # ÐÐ³Ñ€ÐµÐ³Ð°Ñ†Ð¸Ñ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð²
            knowledge = ProductKnowledge()
            
            for result in results:
                text = result.get("content", "").lower()
                source = result.get("source", "")
                
                knowledge.source_documents.append(source)
                
                # Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ ÑÐ¾ÑÑ‚Ð°Ð²Ð°
                if "ÑÐ¾ÑÑ‚Ð°Ð²" in text and not knowledge.composition:
                    knowledge.composition = self._extract_composition(result["content"])
                
                # Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ Ð¸Ð½ÑÑ‚Ñ€ÑƒÐºÑ†Ð¸Ð¹ Ð¿Ð¾ ÑƒÑ…Ð¾Ð´Ñƒ
                if "ÑƒÑ…Ð¾Ð´" in text or "ÑÑ‚Ð¸Ñ€Ðº" in text:
                    knowledge.care_instructions = self._extract_care(result["content"])
            
            return knowledge
            
        except Exception as e:
            logger.warning(f"Knowledge search failed for {sku}: {e}")
            return None
    
    def _extract_composition(self, text: str) -> Optional[str]:
        """Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ ÑÐ¾ÑÑ‚Ð°Ð²Ð° Ð¸Ð· Ñ‚ÐµÐºÑÑ‚Ð°."""
        # ÐŸÑ€Ð¾ÑÑ‚Ð°Ñ Ñ€ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ, Ð² Ð¿Ñ€Ð¾Ð´Ð°ÐºÑˆÐµÐ½Ðµ â€” Ñ‡ÐµÑ€ÐµÐ· AI
        lines = text.split("\n")
        for line in lines:
            if "ÑÐ¾ÑÑ‚Ð°Ð²" in line.lower():
                return line.strip()
        return None
    
    def _extract_care(self, text: str) -> Optional[str]:
        """Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ Ð¸Ð½ÑÑ‚Ñ€ÑƒÐºÑ†Ð¸Ð¹ Ð¿Ð¾ ÑƒÑ…Ð¾Ð´Ñƒ."""
        lines = text.split("\n")
        for line in lines:
            if "ÑƒÑ…Ð¾Ð´" in line.lower() or "ÑÑ‚Ð¸Ñ€Ðº" in line.lower():
                return line.strip()
        return None
```

---

## 3.3 Analyzer (GPT-5 mini)

### 3.3.1 ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

ÐÐ½Ð°Ð»Ð¸Ð· ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ð° Ð¸ Ð¸Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð´Ð»Ñ Ð³ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ð¸.

### 3.3.2 Ð—Ð°Ð´Ð°Ñ‡Ð¸ Ð°Ð½Ð°Ð»Ð¸Ð·Ð°Ñ‚Ð¾Ñ€Ð°

| Ð—Ð°Ð´Ð°Ñ‡Ð° | ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ | Ð’Ñ‹Ñ…Ð¾Ð´ |
|--------|----------|-------|
| Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ñ… ÑÐ»Ð¾Ð² | ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ SEO-Ñ€ÐµÐ»ÐµÐ²Ð°Ð½Ñ‚Ð½Ñ‹Ñ… Ñ‚ÐµÑ€Ð¼Ð¸Ð½Ð¾Ð² | Ð¡Ð¿Ð¸ÑÐ¾Ðº keywords |
| ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ USP | Ð£Ð½Ð¸ÐºÐ°Ð»ÑŒÐ½Ñ‹Ðµ Ð¿Ñ€ÐµÐ¸Ð¼ÑƒÑ‰ÐµÑÑ‚Ð²Ð° Ñ‚Ð¾Ð²Ð°Ñ€Ð° | Ð¡Ð¿Ð¸ÑÐ¾Ðº USP |
| ÐÐ½Ð°Ð»Ð¸Ð· ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸ | Ð¡Ð¿ÐµÑ†Ð¸Ñ„Ð¸ÐºÐ° ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸ Ð´Ð»Ñ Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ñ | Category insights |
| Ð¡Ñ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð° Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ñ | Ð ÐµÐºÐ¾Ð¼ÐµÐ½Ð´ÑƒÐµÐ¼Ð°Ñ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð° | Outline |

### 3.3.3 ÐŸÑ€Ð¾Ð¼Ð¿Ñ‚ Ð°Ð½Ð°Ð»Ð¸Ð·Ð°Ñ‚Ð¾Ñ€Ð°

```python
ANALYZER_SYSTEM_PROMPT = """
Ð¢Ñ‹ â€” SEO-Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸Ðº Ð´Ð»Ñ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ¾Ð². Ð¢Ð²Ð¾Ñ Ð·Ð°Ð´Ð°Ñ‡Ð° â€” Ð¿Ñ€Ð¾Ð°Ð½Ð°Ð»Ð¸Ð·Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð¾ Ñ‚Ð¾Ð²Ð°Ñ€Ðµ Ð¸ Ð¿Ð¾Ð´Ð³Ð¾Ñ‚Ð¾Ð²Ð¸Ñ‚ÑŒ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ Ð´Ð»Ñ Ð³ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ð¸ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð° ÐºÐ°Ñ€Ñ‚Ð¾Ñ‡ÐºÐ¸.

ÐŸÐ ÐÐ’Ð˜Ð›Ð ÐÐÐÐ›Ð˜Ð—Ð:
1. Ð˜Ð·Ð²Ð»ÐµÐºÐ°Ð¹ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ñ€ÐµÐ»ÐµÐ²Ð°Ð½Ñ‚Ð½Ñ‹Ðµ ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ðµ ÑÐ»Ð¾Ð²Ð° Ð´Ð»Ñ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸
2. ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÑÐ¹ ÑƒÐ½Ð¸ÐºÐ°Ð»ÑŒÐ½Ñ‹Ðµ Ð¿Ñ€ÐµÐ¸Ð¼ÑƒÑ‰ÐµÑÑ‚Ð²Ð° Ñ‚Ð¾Ð²Ð°Ñ€Ð° (USP)
3. Ð£Ñ‡Ð¸Ñ‚Ñ‹Ð²Ð°Ð¹ ÑÐ¿ÐµÑ†Ð¸Ñ„Ð¸ÐºÑƒ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°
4. Ð¤Ð¾Ñ€Ð¼Ð¸Ñ€ÑƒÐ¹ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ñƒ Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ñ Ð½Ð° Ð¾ÑÐ½Ð¾Ð²Ðµ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸

Ð¤ÐžÐ ÐœÐÐ¢ ÐžÐ¢Ð’Ð•Ð¢Ð â€” ÑÑ‚Ñ€Ð¾Ð³Ð¾ JSON:
{
    "keywords": ["ÐºÐ»ÑŽÑ‡ÐµÐ²Ð¾Ðµ ÑÐ»Ð¾Ð²Ð¾ 1", "ÐºÐ»ÑŽÑ‡ÐµÐ²Ð¾Ðµ ÑÐ»Ð¾Ð²Ð¾ 2", ...],
    "usp": ["Ð¿Ñ€ÐµÐ¸Ð¼ÑƒÑ‰ÐµÑÑ‚Ð²Ð¾ 1", "Ð¿Ñ€ÐµÐ¸Ð¼ÑƒÑ‰ÐµÑÑ‚Ð²Ð¾ 2", ...],
    "category_insights": {
        "important_attributes": ["Ð°Ñ‚Ñ€Ð¸Ð±ÑƒÑ‚ 1", "Ð°Ñ‚Ñ€Ð¸Ð±ÑƒÑ‚ 2"],
        "buyer_concerns": ["Ñ‡Ñ‚Ð¾ Ð²Ð°Ð¶Ð½Ð¾ Ð¿Ð¾ÐºÑƒÐ¿Ð°Ñ‚ÐµÐ»ÑŽ 1", "Ñ‡Ñ‚Ð¾ Ð²Ð°Ð¶Ð½Ð¾ Ð¿Ð¾ÐºÑƒÐ¿Ð°Ñ‚ÐµÐ»ÑŽ 2"],
        "recommended_structure": ["Ñ€Ð°Ð·Ð´ÐµÐ» 1", "Ñ€Ð°Ð·Ð´ÐµÐ» 2"]
    },
    "title_keywords": ["ÐºÐ»ÑŽÑ‡ÐµÐ²Ð¾Ðµ ÑÐ»Ð¾Ð²Ð¾ Ð´Ð»Ñ Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ñ 1", ...],
    "description_outline": ["Ð¿ÑƒÐ½ÐºÑ‚ 1", "Ð¿ÑƒÐ½ÐºÑ‚ 2", ...]
}
"""

ANALYZER_USER_PROMPT = """
ÐŸÑ€Ð¾Ð°Ð½Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÐ¹ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð¾ Ñ‚Ð¾Ð²Ð°Ñ€Ðµ:

ÐÐ Ð¢Ð˜ÐšÐ£Ð›: {sku}
ÐœÐÐ ÐšÐ•Ð¢ÐŸÐ›Ð•Ð™Ð¡: {marketplace}
ÐšÐÐ¢Ð•Ð“ÐžÐ Ð˜Ð¯: {category}

Ð¢Ð•ÐšÐ£Ð©Ð•Ð• ÐÐÐ—Ð’ÐÐÐ˜Ð•: {current_title}
Ð¢Ð•ÐšÐ£Ð©Ð•Ð• ÐžÐŸÐ˜Ð¡ÐÐÐ˜Ð•: {current_description}

Ð”ÐÐÐÐ«Ð• Ð˜Ð— Ð‘ÐÐ—Ð« Ð—ÐÐÐÐ˜Ð™:
- Ð¡Ð¾ÑÑ‚Ð°Ð²: {composition}
- Ð£Ñ…Ð¾Ð´: {care_instructions}
- ÐžÑÐ¾Ð±ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸: {features}

Ð”ÐžÐŸÐžÐ›ÐÐ˜Ð¢Ð•Ð›Ð¬ÐÐÐ¯ Ð˜ÐÐ¤ÐžÐ ÐœÐÐ¦Ð˜Ð¯ ÐžÐ¢ ÐŸÐžÐ›Ð¬Ð—ÐžÐ’ÐÐ¢Ð•Ð›Ð¯:
- ÐšÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ðµ Ð¾ÑÐ¾Ð±ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸: {key_features}
- Ð¦ÐµÐ»ÐµÐ²Ð°Ñ Ð°ÑƒÐ´Ð¸Ñ‚Ð¾Ñ€Ð¸Ñ: {target_audience}
- Ð£Ð½Ð¸ÐºÐ°Ð»ÑŒÐ½Ñ‹Ðµ Ð¿Ñ€ÐµÐ¸Ð¼ÑƒÑ‰ÐµÑÑ‚Ð²Ð°: {unique_selling_points}

Ð’ÐµÑ€Ð½Ð¸ JSON Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð¼.
"""
```

### 3.3.4 Ð ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð°Ñ‚Ð¾Ñ€Ð°

```python
import json
from dataclasses import dataclass
from typing import List, Dict


@dataclass
class AnalysisResult:
    """Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ð°."""
    keywords: List[str]
    usp: List[str]
    category_insights: Dict
    title_keywords: List[str]
    description_outline: List[str]
    raw_response: Dict


class ContentAnalyzer:
    """ÐÐ½Ð°Ð»Ð¸Ð·Ð°Ñ‚Ð¾Ñ€ ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ð° Ð´Ð»Ñ Ð³ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ð¸."""
    
    def __init__(self, gpt_client: GPTClient):
        self.gpt_client = gpt_client
    
    async def analyze(self, context: GenerationContext) -> AnalysisResult:
        """ÐÐ½Ð°Ð»Ð¸Ð· ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ð° Ð¸ Ð¸Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ…."""
        
        # ÐŸÐ¾Ð´Ð³Ð¾Ñ‚Ð¾Ð²ÐºÐ° Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð´Ð»Ñ Ð¿Ñ€Ð¾Ð¼Ð¿Ñ‚Ð°
        features = []
        composition = ""
        care = ""
        
        if context.product_knowledge:
            features = context.product_knowledge.features
            composition = context.product_knowledge.composition or ""
            care = context.product_knowledge.care_instructions or ""
        
        key_features = []
        target_audience = ""
        usp_input = []
        
        if context.manual_input:
            key_features = context.manual_input.key_features
            target_audience = context.manual_input.target_audience or ""
            usp_input = context.manual_input.unique_selling_points
        
        # Ð¤Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð¿Ñ€Ð¾Ð¼Ð¿Ñ‚Ð°
        user_prompt = ANALYZER_USER_PROMPT.format(
            sku=context.sku,
            marketplace=context.marketplace,
            category=context.category,
            current_title=context.current_title or "ÐÐµ ÑƒÐºÐ°Ð·Ð°Ð½Ð¾",
            current_description=context.current_description or "ÐÐµ ÑƒÐºÐ°Ð·Ð°Ð½Ð¾",
            composition=composition or "ÐÐµ ÑƒÐºÐ°Ð·Ð°Ð½Ð¾",
            care_instructions=care or "ÐÐµ ÑƒÐºÐ°Ð·Ð°Ð½Ð¾",
            features=", ".join(features) if features else "ÐÐµ ÑƒÐºÐ°Ð·Ð°Ð½Ð¾",
            key_features=", ".join(key_features) if key_features else "ÐÐµ ÑƒÐºÐ°Ð·Ð°Ð½Ð¾",
            target_audience=target_audience or "ÐÐµ ÑƒÐºÐ°Ð·Ð°Ð½Ð¾",
            unique_selling_points=", ".join(usp_input) if usp_input else "ÐÐµ ÑƒÐºÐ°Ð·Ð°Ð½Ð¾"
        )
        
        # Ð’Ñ‹Ð·Ð¾Ð² GPT-5 mini
        response = await self.gpt_client.chat_completion(
            model="gpt-5-mini",
            messages=[
                {"role": "system", "content": ANALYZER_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=1000,
            response_format={"type": "json_object"}
        )
        
        # ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð°
        try:
            data = json.loads(response.content)
        except json.JSONDecodeError:
            data = self._parse_fallback(response.content)
        
        return AnalysisResult(
            keywords=data.get("keywords", []),
            usp=data.get("usp", []),
            category_insights=data.get("category_insights", {}),
            title_keywords=data.get("title_keywords", []),
            description_outline=data.get("description_outline", []),
            raw_response=data
        )
    
    def _parse_fallback(self, content: str) -> Dict:
        """Fallback-Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³ Ð¿Ñ€Ð¸ Ð¾ÑˆÐ¸Ð±ÐºÐµ JSON."""
        return {
            "keywords": [],
            "usp": [],
            "category_insights": {},
            "title_keywords": [],
            "description_outline": []
        }
```

---

## 3.4 Generator (Claude Opus 4.5)

### 3.4.1 ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ ÐºÑ€ÐµÐ°Ñ‚Ð¸Ð²Ð½Ð¾Ð³Ð¾ SEO-Ð¾Ð¿Ñ‚Ð¸Ð¼Ð¸Ð·Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾Ð³Ð¾ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð° Ð´Ð»Ñ ÐºÐ°Ñ€Ñ‚Ð¾Ñ‡ÐºÐ¸ Ñ‚Ð¾Ð²Ð°Ñ€Ð°.

### 3.4.2 Ð“ÐµÐ½ÐµÑ€Ð¸Ñ€ÑƒÐµÐ¼Ñ‹Ð¹ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚

| ÐŸÐ¾Ð»Ðµ | ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ | Ð›Ð¸Ð¼Ð¸Ñ‚Ñ‹ |
|------|----------|--------|
| Title | SEO-Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ðµ Ñ‚Ð¾Ð²Ð°Ñ€Ð° | 100-255 ÑÐ¸Ð¼Ð²Ð¾Ð»Ð¾Ð² |
| Description | ÐŸÑ€Ð¾Ð´Ð°ÑŽÑ‰ÐµÐµ Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ | 3000-6000 ÑÐ¸Ð¼Ð²Ð¾Ð»Ð¾Ð² |
| Attributes | Ð¥Ð°Ñ€Ð°ÐºÑ‚ÐµÑ€Ð¸ÑÑ‚Ð¸ÐºÐ¸ Ñ‚Ð¾Ð²Ð°Ñ€Ð° | Ð—Ð°Ð²Ð¸ÑÐ¸Ñ‚ Ð¾Ñ‚ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸ |
| SEO Tags | ÐšÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ðµ ÑÐ»Ð¾Ð²Ð° | 5-20 Ñ‚ÐµÐ³Ð¾Ð² |

### 3.4.3 ÐŸÑ€Ð¾Ð¼Ð¿Ñ‚Ñ‹ Ð³ÐµÐ½ÐµÑ€Ð°Ñ‚Ð¾Ñ€Ð°

#### System Prompt (Ð±Ð°Ð·Ð¾Ð²Ñ‹Ð¹)

```python
GENERATOR_SYSTEM_PROMPT = """
Ð¢Ñ‹ â€” Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ð¹ ÐºÐ¾Ð¿Ð¸Ñ€Ð°Ð¹Ñ‚ÐµÑ€ Ð´Ð»Ñ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ¾Ð² Ñ Ð¾Ð¿Ñ‹Ñ‚Ð¾Ð¼ Ð² SEO Ð¸ Ð¿Ñ€Ð¾Ð´Ð°ÑŽÑ‰Ð¸Ñ… Ñ‚ÐµÐºÑÑ‚Ð°Ñ….

Ð¢Ð’ÐžÐ˜ Ð—ÐÐ”ÐÐ§Ð˜:
1. Ð¡Ð¾Ð·Ð´Ð°Ð²Ð°Ñ‚ÑŒ SEO-Ð¾Ð¿Ñ‚Ð¸Ð¼Ð¸Ð·Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ðµ Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ñ Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð²
2. ÐŸÐ¸ÑÐ°Ñ‚ÑŒ Ð¿Ñ€Ð¾Ð´Ð°ÑŽÑ‰Ð¸Ðµ Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ñ Ñ ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ð¼Ð¸ ÑÐ»Ð¾Ð²Ð°Ð¼Ð¸
3. Ð¤Ð¾Ñ€Ð¼ÑƒÐ»Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ Ñ…Ð°Ñ€Ð°ÐºÑ‚ÐµÑ€Ð¸ÑÑ‚Ð¸ÐºÐ¸ Ñ‚Ð¾Ð²Ð°Ñ€Ð°
4. ÐŸÐ¾Ð´Ð±Ð¸Ñ€Ð°Ñ‚ÑŒ Ñ€ÐµÐ»ÐµÐ²Ð°Ð½Ñ‚Ð½Ñ‹Ðµ SEO-Ñ‚ÐµÐ³Ð¸

ÐžÐ‘Ð©Ð˜Ð• ÐŸÐ ÐÐ’Ð˜Ð›Ð:
- Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐ¹ ÐµÑÑ‚ÐµÑÑ‚Ð²ÐµÐ½Ð½Ñ‹Ð¹ ÑÐ·Ñ‹Ðº, Ð¸Ð·Ð±ÐµÐ³Ð°Ð¹ Ð¿ÐµÑ€ÐµÑÐ¿Ð°Ð¼Ð° ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ð¼Ð¸ ÑÐ»Ð¾Ð²Ð°Ð¼Ð¸
- ÐŸÐ¸ÑˆÐ¸ Ð½Ð° Ñ€ÑƒÑÑÐºÐ¾Ð¼ ÑÐ·Ñ‹ÐºÐµ
- Ð£Ñ‡Ð¸Ñ‚Ñ‹Ð²Ð°Ð¹ ÑÐ¿ÐµÑ†Ð¸Ñ„Ð¸ÐºÑƒ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸ Ñ‚Ð¾Ð²Ð°Ñ€Ð°
- Ð”ÐµÐ»Ð°Ð¹ Ð°ÐºÑ†ÐµÐ½Ñ‚ Ð½Ð° Ð¿Ñ€ÐµÐ¸Ð¼ÑƒÑ‰ÐµÑÑ‚Ð²Ð°Ñ… Ð´Ð»Ñ Ð¿Ð¾ÐºÑƒÐ¿Ð°Ñ‚ÐµÐ»Ñ
- ÐÐµ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐ¹ Ð·Ð°Ð¿Ñ€ÐµÑ‰Ñ‘Ð½Ð½Ñ‹Ðµ ÑÐ»Ð¾Ð²Ð° Ð±Ñ€ÐµÐ½Ð´Ð°
- Ð¡Ð»ÐµÐ´ÑƒÐ¹ Ñ‚Ð¾Ð½Ñƒ ÐºÐ¾Ð¼Ð¼ÑƒÐ½Ð¸ÐºÐ°Ñ†Ð¸Ð¸ Ð±Ñ€ÐµÐ½Ð´Ð°

{brand_instructions}

Ð’ÐÐ–ÐÐž: Ð¡Ð¾Ð±Ð»ÑŽÐ´Ð°Ð¹ Ð»Ð¸Ð¼Ð¸Ñ‚Ñ‹ ÑÐ¸Ð¼Ð²Ð¾Ð»Ð¾Ð² Ð´Ð»Ñ ÐºÐ°Ð¶Ð´Ð¾Ð³Ð¾ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°.
"""

BRAND_INSTRUCTIONS_TEMPLATE = """
ÐÐÐ¡Ð¢Ð ÐžÐ™ÐšÐ˜ Ð‘Ð Ð•ÐÐ”Ð "{brand_name}":
- Ð¢Ð¾Ð½ ÐºÐ¾Ð¼Ð¼ÑƒÐ½Ð¸ÐºÐ°Ñ†Ð¸Ð¸: {tone}
- Ð¡Ð»Ð¾Ð²Ð°-Ð°ÐºÑ†ÐµÐ½Ñ‚Ñ‹ (Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ): {accent_words}
- Ð—Ð°Ð¿Ñ€ÐµÑ‰Ñ‘Ð½Ð½Ñ‹Ðµ ÑÐ»Ð¾Ð²Ð° (ÐÐ• Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ): {forbidden_words}
- Ð¡Ñ‚Ð¸Ð»ÑŒ Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ñ: {description_style}
"""
```

#### ÐŸÑ€Ð¾Ð¼Ð¿Ñ‚ Ð´Ð»Ñ Title

```python
TITLE_PROMPT = """
Ð¡Ð¾Ð·Ð´Ð°Ð¹ SEO-Ð¾Ð¿Ñ‚Ð¸Ð¼Ð¸Ð·Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾Ðµ Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ðµ Ñ‚Ð¾Ð²Ð°Ñ€Ð°.

Ð˜Ð¡Ð¥ÐžÐ”ÐÐ«Ð• Ð”ÐÐÐÐ«Ð•:
- Ð¢ÐµÐºÑƒÑ‰ÐµÐµ Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ðµ: {current_title}
- ÐšÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ñ: {category}
- Ð‘Ñ€ÐµÐ½Ð´: {brand_name}
- ÐšÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ðµ ÑÐ»Ð¾Ð²Ð° Ð´Ð»Ñ Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ñ: {title_keywords}

Ð¢Ð Ð•Ð‘ÐžÐ’ÐÐÐ˜Ð¯:
- Ð”Ð»Ð¸Ð½Ð°: Ð¼Ð°ÐºÑÐ¸Ð¼ÑƒÐ¼ {max_length} ÑÐ¸Ð¼Ð²Ð¾Ð»Ð¾Ð²
- Ð’ÐºÐ»ÑŽÑ‡Ð¸ Ð±Ñ€ÐµÐ½Ð´ Ð² Ð½Ð°Ñ‡Ð°Ð»Ðµ Ð¸Ð»Ð¸ ÐºÐ¾Ð½Ñ†Ðµ
- Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐ¹ 2-3 ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ñ… ÑÐ»Ð¾Ð²Ð°
- ÐÐ°Ð·Ð²Ð°Ð½Ð¸Ðµ Ð´Ð¾Ð»Ð¶Ð½Ð¾ Ð±Ñ‹Ñ‚ÑŒ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚Ð¸Ð²Ð½Ñ‹Ð¼ Ð¸ Ð¿Ñ€Ð¸Ð²Ð»ÐµÐºÐ°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ð¼

Ð¤ÐžÐ ÐœÐÐ¢ ÐžÐ¢Ð’Ð•Ð¢Ð:
Ð’ÐµÑ€Ð½Ð¸ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ðµ Ñ‚Ð¾Ð²Ð°Ñ€Ð°, Ð±ÐµÐ· Ð¿Ð¾ÑÑÐ½ÐµÐ½Ð¸Ð¹.
"""
```

#### ÐŸÑ€Ð¾Ð¼Ð¿Ñ‚ Ð´Ð»Ñ Description

```python
DESCRIPTION_PROMPT = """
ÐÐ°Ð¿Ð¸ÑˆÐ¸ Ð¿Ñ€Ð¾Ð´Ð°ÑŽÑ‰ÐµÐµ Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ Ñ‚Ð¾Ð²Ð°Ñ€Ð°.

Ð˜Ð¡Ð¥ÐžÐ”ÐÐ«Ð• Ð”ÐÐÐÐ«Ð•:
- ÐÐ°Ð·Ð²Ð°Ð½Ð¸Ðµ: {title}
- ÐšÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ñ: {category}
- Ð‘Ñ€ÐµÐ½Ð´: {brand_name}

ÐšÐ›Ð®Ð§Ð•Ð’Ð«Ð• Ð¡Ð›ÐžÐ’Ð (Ð²ÐºÐ»ÑŽÑ‡Ð¸ ÐµÑÑ‚ÐµÑÑ‚Ð²ÐµÐ½Ð½Ð¾ Ð² Ñ‚ÐµÐºÑÑ‚):
{keywords}

Ð£ÐÐ˜ÐšÐÐ›Ð¬ÐÐ«Ð• ÐŸÐ Ð•Ð˜ÐœÐ£Ð©Ð•Ð¡Ð¢Ð’Ð (USP):
{usp}

Ð”ÐžÐŸÐžÐ›ÐÐ˜Ð¢Ð•Ð›Ð¬ÐÐÐ¯ Ð˜ÐÐ¤ÐžÐ ÐœÐÐ¦Ð˜Ð¯:
- Ð¡Ð¾ÑÑ‚Ð°Ð²: {composition}
- Ð£Ñ…Ð¾Ð´ Ð·Ð° Ð¸Ð·Ð´ÐµÐ»Ð¸ÐµÐ¼: {care_instructions}

Ð¡Ð¢Ð Ð£ÐšÐ¢Ð£Ð Ð ÐžÐŸÐ˜Ð¡ÐÐÐ˜Ð¯:
{description_outline}

Ð¢Ð Ð•Ð‘ÐžÐ’ÐÐÐ˜Ð¯:
- Ð”Ð»Ð¸Ð½Ð°: {min_length}-{max_length} ÑÐ¸Ð¼Ð²Ð¾Ð»Ð¾Ð²
- ÐŸÐµÑ€Ð²Ñ‹Ð¹ Ð°Ð±Ð·Ð°Ñ† â€” Ð·Ð°Ñ…Ð²Ð°Ñ‚Ñ‹Ð²Ð°ÑŽÑ‰Ð¸Ð¹, Ñ Ð³Ð»Ð°Ð²Ð½Ñ‹Ð¼ Ð¿Ñ€ÐµÐ¸Ð¼ÑƒÑ‰ÐµÑÑ‚Ð²Ð¾Ð¼
- Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐ¹ Ð±ÑƒÐ»Ð»ÐµÑ‚Ñ‹ Ð´Ð»Ñ Ñ…Ð°Ñ€Ð°ÐºÑ‚ÐµÑ€Ð¸ÑÑ‚Ð¸Ðº
- Ð—Ð°Ð²ÐµÑ€ÑˆÐ°Ð¹ Ð¿Ñ€Ð¸Ð·Ñ‹Ð²Ð¾Ð¼ Ðº Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸ÑŽ
- Ð’ÐºÐ»ÑŽÑ‡Ð¸ ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ðµ ÑÐ»Ð¾Ð²Ð° ÐµÑÑ‚ÐµÑÑ‚Ð²ÐµÐ½Ð½Ð¾ (Ð½Ðµ Ð±Ð¾Ð»ÐµÐµ 3-4% Ð¿Ð»Ð¾Ñ‚Ð½Ð¾ÑÑ‚ÑŒ)

Ð¤ÐžÐ ÐœÐÐ¢ ÐžÐ¢Ð’Ð•Ð¢Ð:
Ð’ÐµÑ€Ð½Ð¸ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ñ‚ÐµÐºÑÑ‚ Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ñ, Ð±ÐµÐ· Ð¿Ð¾ÑÑÐ½ÐµÐ½Ð¸Ð¹.
"""
```

#### ÐŸÑ€Ð¾Ð¼Ð¿Ñ‚ Ð´Ð»Ñ Attributes

```python
ATTRIBUTES_PROMPT = """
Ð—Ð°Ð¿Ð¾Ð»Ð½Ð¸ Ñ…Ð°Ñ€Ð°ÐºÑ‚ÐµÑ€Ð¸ÑÑ‚Ð¸ÐºÐ¸ Ñ‚Ð¾Ð²Ð°Ñ€Ð° Ð´Ð»Ñ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸ "{category}".

Ð˜Ð¡Ð¥ÐžÐ”ÐÐ«Ð• Ð”ÐÐÐÐ«Ð•:
- Ð¢ÐµÐºÑƒÑ‰Ð¸Ðµ Ñ…Ð°Ñ€Ð°ÐºÑ‚ÐµÑ€Ð¸ÑÑ‚Ð¸ÐºÐ¸: {current_attributes}
- Ð¡Ð¾ÑÑ‚Ð°Ð²: {composition}
- ÐžÑÐ¾Ð±ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸: {features}

Ð’ÐÐ–ÐÐ«Ð• ÐÐ¢Ð Ð˜Ð‘Ð£Ð¢Ð« Ð”Ð›Ð¯ ÐšÐÐ¢Ð•Ð“ÐžÐ Ð˜Ð˜:
{important_attributes}

Ð¢Ð Ð•Ð‘ÐžÐ’ÐÐÐ˜Ð¯:
- Ð—Ð°Ð¿Ð¾Ð»Ð½Ð¸ Ð²ÑÐµ Ð¾Ð±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ Ð°Ñ‚Ñ€Ð¸Ð±ÑƒÑ‚Ñ‹
- Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐ¹ Ñ‚Ð¾Ñ‡Ð½Ñ‹Ðµ Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ñ
- Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚ Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ð¹ Ð´Ð¾Ð»Ð¶ÐµÐ½ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¾Ð²Ð°Ñ‚ÑŒ Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ð½Ð¸ÑÐ¼ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°

Ð¤ÐžÐ ÐœÐÐ¢ ÐžÐ¢Ð’Ð•Ð¢Ð â€” JSON:
{{
    "attribute_name_1": "Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ",
    "attribute_name_2": "Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ"
}}
"""
```

#### ÐŸÑ€Ð¾Ð¼Ð¿Ñ‚ Ð´Ð»Ñ SEO Tags

```python
SEO_TAGS_PROMPT = """
ÐŸÐ¾Ð´Ð±ÐµÑ€Ð¸ SEO-Ñ‚ÐµÐ³Ð¸ Ð´Ð»Ñ Ñ‚Ð¾Ð²Ð°Ñ€Ð°.

Ð˜Ð¡Ð¥ÐžÐ”ÐÐ«Ð• Ð”ÐÐÐÐ«Ð•:
- ÐÐ°Ð·Ð²Ð°Ð½Ð¸Ðµ: {title}
- ÐšÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ñ: {category}
- ÐšÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ðµ ÑÐ»Ð¾Ð²Ð° Ð¸Ð· Ð°Ð½Ð°Ð»Ð¸Ð·Ð°: {keywords}

Ð¢Ð Ð•Ð‘ÐžÐ’ÐÐÐ˜Ð¯:
- ÐšÐ¾Ð»Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾ Ñ‚ÐµÐ³Ð¾Ð²: 10-15
- Ð’ÐºÐ»ÑŽÑ‡Ð¸ Ð²Ñ‹ÑÐ¾ÐºÐ¾Ñ‡Ð°ÑÑ‚Ð¾Ñ‚Ð½Ñ‹Ðµ Ð¸ Ð½Ð¸Ð·ÐºÐ¾Ñ‡Ð°ÑÑ‚Ð¾Ñ‚Ð½Ñ‹Ðµ Ð·Ð°Ð¿Ñ€Ð¾ÑÑ‹
- Ð¢ÐµÐ³Ð¸ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð±Ñ‹Ñ‚ÑŒ Ñ€ÐµÐ»ÐµÐ²Ð°Ð½Ñ‚Ð½Ñ‹ Ñ‚Ð¾Ð²Ð°Ñ€Ñƒ
- Ð‘ÐµÐ· Ð´ÑƒÐ±Ð»Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ

Ð¤ÐžÐ ÐœÐÐ¢ ÐžÐ¢Ð’Ð•Ð¢Ð â€” JSON:
{{
    "tags": ["Ñ‚ÐµÐ³1", "Ñ‚ÐµÐ³2", "Ñ‚ÐµÐ³3", ...]
}}
"""
```

### 3.4.4 Ð ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð³ÐµÐ½ÐµÑ€Ð°Ñ‚Ð¾Ñ€Ð°

```python
@dataclass
class GeneratedContent:
    """Ð¡Ð³ÐµÐ½ÐµÑ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ð¹ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚."""
    title: str
    description: str
    attributes: Dict[str, str]
    seo_tags: List[str]
    generation_metadata: Dict


class ContentGenerator:
    """Ð“ÐµÐ½ÐµÑ€Ð°Ñ‚Ð¾Ñ€ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð° Ñ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸ÐµÐ¼ Claude Opus."""
    
    # Ð›Ð¸Ð¼Ð¸Ñ‚Ñ‹ Ð¿Ð¾ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°Ð¼
    LIMITS = {
        "wb": {"title": 100, "description_min": 500, "description_max": 5000},
        "ozon": {"title": 255, "description_min": 500, "description_max": 6000},
        "ym": {"title": 150, "description_min": 300, "description_max": 3000}
    }
    
    def __init__(self, claude_client: ClaudeClient):
        self.claude_client = claude_client
    
    async def generate(
        self,
        context: GenerationContext,
        analysis: AnalysisResult
    ) -> GeneratedContent:
        """Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Ð¿Ð¾Ð»Ð½Ð¾Ð³Ð¾ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð° ÐºÐ°Ñ€Ñ‚Ð¾Ñ‡ÐºÐ¸."""
        
        # ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð»Ð¸Ð¼Ð¸Ñ‚Ð¾Ð² Ð´Ð»Ñ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°
        limits = self.LIMITS.get(context.marketplace, self.LIMITS["wb"])
        
        # Ð¤Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ ÑÐ¸ÑÑ‚ÐµÐ¼Ð½Ð¾Ð³Ð¾ Ð¿Ñ€Ð¾Ð¼Ð¿Ñ‚Ð° Ñ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ°Ð¼Ð¸ Ð±Ñ€ÐµÐ½Ð´Ð°
        system_prompt = self._build_system_prompt(context.brand_settings)
        
        # Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Title
        title = await self._generate_title(
            context, analysis, system_prompt, limits["title"]
        )
        
        # Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Description
        description = await self._generate_description(
            context, analysis, system_prompt, title,
            limits["description_min"], limits["description_max"]
        )
        
        # Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Attributes
        attributes = await self._generate_attributes(
            context, analysis, system_prompt
        )
        
        # Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ SEO Tags
        seo_tags = await self._generate_seo_tags(
            context, analysis, system_prompt, title
        )
        
        return GeneratedContent(
            title=title,
            description=description,
            attributes=attributes,
            seo_tags=seo_tags,
            generation_metadata={
                "model": "claude-opus-4.5",
                "context_sku": context.sku,
                "marketplace": context.marketplace,
                "keywords_used": analysis.keywords[:10]
            }
        )
    
    def _build_system_prompt(self, brand_settings: Optional[BrandSettings]) -> str:
        """Ð¤Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ ÑÐ¸ÑÑ‚ÐµÐ¼Ð½Ð¾Ð³Ð¾ Ð¿Ñ€Ð¾Ð¼Ð¿Ñ‚Ð° Ñ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ°Ð¼Ð¸ Ð±Ñ€ÐµÐ½Ð´Ð°."""
        
        brand_instructions = ""
        
        if brand_settings:
            brand_instructions = BRAND_INSTRUCTIONS_TEMPLATE.format(
                brand_name=brand_settings.brand_name,
                tone=brand_settings.tone,
                accent_words=", ".join(brand_settings.accent_words) or "Ð½Ðµ ÑƒÐºÐ°Ð·Ð°Ð½Ñ‹",
                forbidden_words=", ".join(brand_settings.forbidden_words) or "Ð½ÐµÑ‚",
                description_style=brand_settings.description_style or "ÑÑ‚Ð°Ð½Ð´Ð°Ñ€Ñ‚Ð½Ñ‹Ð¹"
            )
        
        return GENERATOR_SYSTEM_PROMPT.format(brand_instructions=brand_instructions)
    
    async def _generate_title(
        self,
        context: GenerationContext,
        analysis: AnalysisResult,
        system_prompt: str,
        max_length: int
    ) -> str:
        """Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ñ Ñ‚Ð¾Ð²Ð°Ñ€Ð°."""
        
        user_prompt = TITLE_PROMPT.format(
            current_title=context.current_title or "ÐÐµ ÑƒÐºÐ°Ð·Ð°Ð½Ð¾",
            category=context.category,
            brand_name=context.brand_settings.brand_name if context.brand_settings else "",
            title_keywords=", ".join(analysis.title_keywords[:5]),
            max_length=max_length
        )
        
        response = await self.claude_client.chat_completion(
            model="claude-opus-4.5",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=200
        )
        
        title = response.content.strip()
        
        # ÐžÐ±Ñ€ÐµÐ·ÐºÐ° Ð¿Ð¾ Ð»Ð¸Ð¼Ð¸Ñ‚Ñƒ
        if len(title) > max_length:
            title = title[:max_length-3] + "..."
        
        return title
    
    async def _generate_description(
        self,
        context: GenerationContext,
        analysis: AnalysisResult,
        system_prompt: str,
        title: str,
        min_length: int,
        max_length: int
    ) -> str:
        """Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ñ Ñ‚Ð¾Ð²Ð°Ñ€Ð°."""
        
        composition = ""
        care = ""
        if context.product_knowledge:
            composition = context.product_knowledge.composition or "ÐÐµ ÑƒÐºÐ°Ð·Ð°Ð½"
            care = context.product_knowledge.care_instructions or "ÐÐµ ÑƒÐºÐ°Ð·Ð°Ð½"
        
        user_prompt = DESCRIPTION_PROMPT.format(
            title=title,
            category=context.category,
            brand_name=context.brand_settings.brand_name if context.brand_settings else "",
            keywords="\n".join(f"- {kw}" for kw in analysis.keywords[:10]),
            usp="\n".join(f"- {u}" for u in analysis.usp[:5]),
            composition=composition,
            care_instructions=care,
            description_outline="\n".join(f"- {item}" for item in analysis.description_outline),
            min_length=min_length,
            max_length=max_length
        )
        
        response = await self.claude_client.chat_completion(
            model="claude-opus-4.5",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        description = response.content.strip()
        
        # ÐžÐ±Ñ€ÐµÐ·ÐºÐ° Ð¿Ð¾ Ð»Ð¸Ð¼Ð¸Ñ‚Ñƒ
        if len(description) > max_length:
            description = description[:max_length-3] + "..."
        
        return description
    
    async def _generate_attributes(
        self,
        context: GenerationContext,
        analysis: AnalysisResult,
        system_prompt: str
    ) -> Dict[str, str]:
        """Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Ð°Ñ‚Ñ€Ð¸Ð±ÑƒÑ‚Ð¾Ð² Ñ‚Ð¾Ð²Ð°Ñ€Ð°."""
        
        features = []
        composition = ""
        if context.product_knowledge:
            features = context.product_knowledge.features
            composition = context.product_knowledge.composition or ""
        
        important_attrs = analysis.category_insights.get("important_attributes", [])
        
        user_prompt = ATTRIBUTES_PROMPT.format(
            category=context.category,
            current_attributes=json.dumps(context.current_attributes, ensure_ascii=False),
            composition=composition or "ÐÐµ ÑƒÐºÐ°Ð·Ð°Ð½",
            features=", ".join(features) if features else "ÐÐµ ÑƒÐºÐ°Ð·Ð°Ð½Ñ‹",
            important_attributes=", ".join(important_attrs) if important_attrs else "ÑÑ‚Ð°Ð½Ð´Ð°Ñ€Ñ‚Ð½Ñ‹Ðµ"
        )
        
        response = await self.claude_client.chat_completion(
            model="claude-opus-4.5",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=1000,
            response_format={"type": "json_object"}
        )
        
        try:
            attributes = json.loads(response.content)
        except json.JSONDecodeError:
            attributes = context.current_attributes or {}
        
        return attributes
    
    async def _generate_seo_tags(
        self,
        context: GenerationContext,
        analysis: AnalysisResult,
        system_prompt: str,
        title: str
    ) -> List[str]:
        """Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ SEO-Ñ‚ÐµÐ³Ð¾Ð²."""
        
        user_prompt = SEO_TAGS_PROMPT.format(
            title=title,
            category=context.category,
            keywords=", ".join(analysis.keywords[:15])
        )
        
        response = await self.claude_client.chat_completion(
            model="claude-opus-4.5",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.5,
            max_tokens=500,
            response_format={"type": "json_object"}
        )
        
        try:
            data = json.loads(response.content)
            tags = data.get("tags", [])
        except json.JSONDecodeError:
            tags = analysis.keywords[:10]
        
        return tags[:20]  # ÐœÐ°ÐºÑÐ¸Ð¼ÑƒÐ¼ 20 Ñ‚ÐµÐ³Ð¾Ð²
```

---

## 3.5 Visual Prompting Generator

### 3.5.1 ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Ñ‚ÐµÑ…Ð½Ð¸Ñ‡ÐµÑÐºÐ¾Ð³Ð¾ Ð·Ð°Ð´Ð°Ð½Ð¸Ñ Ð´Ð»Ñ Ð´Ð¸Ð·Ð°Ð¹Ð½ÐµÑ€Ð° Ð½Ð° Ð¾ÑÐ½Ð¾Ð²Ðµ Ñ€ÑƒÑ‡Ð½Ð¾Ð³Ð¾ Ð²Ð²Ð¾Ð´Ð° Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ.

### 3.5.2 ÐŸÑ€Ð¾Ð¼Ð¿Ñ‚ Visual Prompting

```python
VISUAL_PROMPTING_SYSTEM = """
Ð¢Ñ‹ â€” ÑÐºÑÐ¿ÐµÑ€Ñ‚ Ð¿Ð¾ Ð²Ð¸Ð·ÑƒÐ°Ð»ÑŒÐ½Ð¾Ð¼Ñƒ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ñƒ Ð´Ð»Ñ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ¾Ð². 
Ð¢Ð²Ð¾Ñ Ð·Ð°Ð´Ð°Ñ‡Ð° â€” ÑÐ¾ÑÑ‚Ð°Ð²Ð¸Ñ‚ÑŒ Ð¢Ð— Ð´Ð»Ñ Ñ„Ð¾Ñ‚Ð¾Ð³Ñ€Ð°Ñ„Ð°/Ð´Ð¸Ð·Ð°Ð¹Ð½ÐµÑ€Ð° Ð½Ð° Ð¾ÑÐ½Ð¾Ð²Ðµ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸ Ð¾ Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼Ð°Ñ… Ñ‚Ð¾Ð²Ð°Ñ€Ð°.

ÐŸÐ ÐÐ’Ð˜Ð›Ð:
1. Ð¤Ð¾Ñ€Ð¼ÑƒÐ»Ð¸Ñ€ÑƒÐ¹ ÐºÐ¾Ð½ÐºÑ€ÐµÑ‚Ð½Ñ‹Ðµ Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸ Ð´Ð»Ñ Ñ„Ð¾Ñ‚Ð¾
2. Ð£Ñ‡Ð¸Ñ‚Ñ‹Ð²Ð°Ð¹ Ñ‚Ð¸Ð¿Ð¸Ñ‡Ð½Ñ‹Ðµ Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼Ñ‹ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸
3. ÐŸÑ€ÐµÐ´Ð»Ð°Ð³Ð°Ð¹ ÑÐ¿Ð¾ÑÐ¾Ð±Ñ‹ Ð²Ð¸Ð·ÑƒÐ°Ð»ÑŒÐ½Ð¾ Ð¿Ð¾Ð´Ñ‡ÐµÑ€ÐºÐ½ÑƒÑ‚ÑŒ Ð¿Ñ€ÐµÐ¸Ð¼ÑƒÑ‰ÐµÑÑ‚Ð²Ð°
4. Ð ÐµÐºÐ¾Ð¼ÐµÐ½Ð´ÑƒÐ¹ Ñ€Ð°ÐºÑƒÑ€ÑÑ‹ Ð¸ Ð´ÐµÑ‚Ð°Ð»Ð¸ Ð´Ð»Ñ ÑÑŠÑ‘Ð¼ÐºÐ¸
"""

VISUAL_PROMPTING_USER = """
Ð¡Ð¾ÑÑ‚Ð°Ð²ÑŒ Ð¢Ð— Ð´Ð»Ñ Ð´Ð¸Ð·Ð°Ð¹Ð½ÐµÑ€Ð°/Ñ„Ð¾Ñ‚Ð¾Ð³Ñ€Ð°Ñ„Ð°.

Ð¢ÐžÐ’ÐÐ : {title}
ÐšÐÐ¢Ð•Ð“ÐžÐ Ð˜Ð¯: {category}
Ð‘Ð Ð•ÐÐ”: {brand_name}

Ð˜Ð—Ð’Ð•Ð¡Ð¢ÐÐ«Ð• ÐŸÐ ÐžÐ‘Ð›Ð•ÐœÐ« (Ð½Ð° Ñ‡Ñ‚Ð¾ Ð¶Ð°Ð»ÑƒÑŽÑ‚ÑÑ Ð¿Ð¾ÐºÑƒÐ¿Ð°Ñ‚ÐµÐ»Ð¸):
{known_issues}

Ð¢Ð Ð•Ð‘ÐžÐ’ÐÐÐ˜Ð¯ Ðš Ð¤ÐžÐ¢Ðž ÐžÐ¢ ÐŸÐžÐ›Ð¬Ð—ÐžÐ’ÐÐ¢Ð•Ð›Ð¯:
{photo_requirements}

ÐžÐ¡ÐžÐ‘Ð•ÐÐÐžÐ¡Ð¢Ð˜ Ð¢ÐžÐ’ÐÐ Ð:
{features}

Ð¡Ñ„Ð¾Ñ€Ð¼Ð¸Ñ€ÑƒÐ¹ Ð¢Ð— Ð² Ð²Ð¸Ð´Ðµ ÑÐ¿Ð¸ÑÐºÐ° ÐºÐ¾Ð½ÐºÑ€ÐµÑ‚Ð½Ñ‹Ñ… Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¹ Ð´Ð»Ñ Ñ„Ð¾Ñ‚Ð¾ÑÐµÑÑÐ¸Ð¸.
"""
```

### 3.5.3 Ð ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Visual Prompting

```python
@dataclass
class VisualPromptingResult:
    """Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Visual Prompting."""
    recommendations: List[str]
    photo_angles: List[str]
    detail_shots: List[str]
    styling_tips: List[str]
    raw_text: str


class VisualPromptingGenerator:
    """Ð“ÐµÐ½ÐµÑ€Ð°Ñ‚Ð¾Ñ€ Ð¢Ð— Ð´Ð»Ñ Ð´Ð¸Ð·Ð°Ð¹Ð½ÐµÑ€Ð°."""
    
    def __init__(self, gpt_client: GPTClient):
        self.gpt_client = gpt_client
    
    async def generate(
        self,
        context: GenerationContext,
        title: str
    ) -> VisualPromptingResult:
        """Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Ð¢Ð— Ð´Ð»Ñ Ð´Ð¸Ð·Ð°Ð¹Ð½ÐµÑ€Ð°."""
        
        # ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð½Ð°Ð»Ð¸Ñ‡Ð¸Ñ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð´Ð»Ñ Visual Prompting
        if not context.manual_input:
            return VisualPromptingResult(
                recommendations=["ÐÐµÑ‚ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð´Ð»Ñ Ñ„Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ Ð¢Ð—"],
                photo_angles=[],
                detail_shots=[],
                styling_tips=[],
                raw_text="Ð”Ð»Ñ Ñ„Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ Ð¢Ð— Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ð¾ ÑƒÐºÐ°Ð·Ð°Ñ‚ÑŒ Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼Ñ‹ Ð¸Ð»Ð¸ Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ð½Ð¸Ñ Ðº Ñ„Ð¾Ñ‚Ð¾."
            )
        
        known_issues = context.manual_input.known_issues
        photo_requirements = context.manual_input.photo_requirements
        
        if not known_issues and not photo_requirements:
            return VisualPromptingResult(
                recommendations=["ÐÐµÑ‚ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð´Ð»Ñ Ñ„Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ Ð¢Ð—"],
                photo_angles=[],
                detail_shots=[],
                styling_tips=[],
                raw_text="Ð£ÐºÐ°Ð¶Ð¸Ñ‚Ðµ Ð¸Ð·Ð²ÐµÑÑ‚Ð½Ñ‹Ðµ Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼Ñ‹ Ñ‚Ð¾Ð²Ð°Ñ€Ð° Ð¸Ð»Ð¸ Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ð½Ð¸Ñ Ðº Ñ„Ð¾Ñ‚Ð¾."
            )
        
        features = []
        if context.product_knowledge:
            features = context.product_knowledge.features
        
        user_prompt = VISUAL_PROMPTING_USER.format(
            title=title,
            category=context.category,
            brand_name=context.brand_settings.brand_name if context.brand_settings else "",
            known_issues="\n".join(f"- {issue}" for issue in known_issues) or "ÐÐµ ÑƒÐºÐ°Ð·Ð°Ð½Ñ‹",
            photo_requirements="\n".join(f"- {req}" for req in photo_requirements) or "ÐÐµ ÑƒÐºÐ°Ð·Ð°Ð½Ñ‹",
            features="\n".join(f"- {f}" for f in features) or "ÐÐµ ÑƒÐºÐ°Ð·Ð°Ð½Ñ‹"
        )
        
        response = await self.gpt_client.chat_completion(
            model="gpt-5-mini",
            messages=[
                {"role": "system", "content": VISUAL_PROMPTING_SYSTEM},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        raw_text = response.content.strip()
        
        # ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾Ð³Ð¾ Ð¾Ñ‚Ð²ÐµÑ‚Ð°
        return self._parse_response(raw_text)
    
    def _parse_response(self, text: str) -> VisualPromptingResult:
        """ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ Ð¾Ñ‚Ð²ÐµÑ‚Ð° Ð² ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ð¹ Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚."""
        
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        
        recommendations = []
        photo_angles = []
        detail_shots = []
        styling_tips = []
        
        current_section = "recommendations"
        
        for line in lines:
            line_lower = line.lower()
            
            # ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ ÑÐµÐºÑ†Ð¸Ð¸
            if "Ñ€Ð°ÐºÑƒÑ€Ñ" in line_lower or "ÑƒÐ³Ð¾Ð»" in line_lower:
                current_section = "angles"
            elif "Ð´ÐµÑ‚Ð°Ð»" in line_lower or "ÐºÑ€ÑƒÐ¿Ð½" in line_lower:
                current_section = "details"
            elif "ÑÑ‚Ð¸Ð»" in line_lower or "Ð¾Ñ„Ð¾Ñ€Ð¼" in line_lower:
                current_section = "styling"
            
            # Ð”Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð² ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰ÑƒÑŽ ÑÐµÐºÑ†Ð¸ÑŽ
            if line.startswith("-") or line.startswith("â€¢") or line[0].isdigit():
                clean_line = line.lstrip("-â€¢0123456789. ")
                
                if current_section == "angles":
                    photo_angles.append(clean_line)
                elif current_section == "details":
                    detail_shots.append(clean_line)
                elif current_section == "styling":
                    styling_tips.append(clean_line)
                else:
                    recommendations.append(clean_line)
        
        # Ð•ÑÐ»Ð¸ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³ Ð½Ðµ ÑƒÐ´Ð°Ð»ÑÑ, Ð²ÑÐµ Ð² recommendations
        if not recommendations and not photo_angles and not detail_shots:
            recommendations = lines
        
        return VisualPromptingResult(
            recommendations=recommendations or ["Ð¡Ð¼. Ð¿Ð¾Ð»Ð½Ñ‹Ð¹ Ñ‚ÐµÐºÑÑ‚ Ð¢Ð—"],
            photo_angles=photo_angles,
            detail_shots=detail_shots,
            styling_tips=styling_tips,
            raw_text=text
        )
```

---

## 3.6 Content Validator

### 3.6.1 ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° ÑÐ³ÐµÐ½ÐµÑ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾Ð³Ð¾ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð° Ð¿ÐµÑ€ÐµÐ´ Ð¿ÑƒÐ±Ð»Ð¸ÐºÐ°Ñ†Ð¸ÐµÐ¹.

### 3.6.2 ÐŸÑ€Ð°Ð²Ð¸Ð»Ð° Ð²Ð°Ð»Ð¸Ð´Ð°Ñ†Ð¸Ð¸

| ÐŸÑ€Ð°Ð²Ð¸Ð»Ð¾ | ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ | Severity |
|---------|----------|----------|
| Ð”Ð»Ð¸Ð½Ð° Title | Ð¡Ð¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ðµ Ð»Ð¸Ð¼Ð¸Ñ‚Ð°Ð¼ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ° | Error |
| Ð”Ð»Ð¸Ð½Ð° Description | Ð¡Ð¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ðµ Ð»Ð¸Ð¼Ð¸Ñ‚Ð°Ð¼ | Error |
| Ð—Ð°Ð¿Ñ€ÐµÑ‰Ñ‘Ð½Ð½Ñ‹Ðµ ÑÐ»Ð¾Ð²Ð° | ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð¿Ð¾ ÑÐ¿Ð¸ÑÐºÑƒ Ð±Ñ€ÐµÐ½Ð´Ð° | Error |
| Ð‘Ñ€ÐµÐ½Ð´ Ð² Title | ÐšÐ¾Ñ€Ñ€ÐµÐºÑ‚Ð½Ð¾Ðµ Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ðµ Ð±Ñ€ÐµÐ½Ð´Ð° | Warning |
| Ð¡Ð¿ÐµÑ†ÑÐ¸Ð¼Ð²Ð¾Ð»Ñ‹ | ÐÐµÐ´Ð¾Ð¿ÑƒÑÑ‚Ð¸Ð¼Ñ‹Ðµ ÑÐ¸Ð¼Ð²Ð¾Ð»Ñ‹ | Warning |
| ÐšÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ðµ ÑÐ»Ð¾Ð²Ð° | ÐÐ°Ð»Ð¸Ñ‡Ð¸Ðµ Ð¾ÑÐ½Ð¾Ð²Ð½Ñ‹Ñ… keywords | Info |
| Ð¡Ð¿Ð°Ð¼-Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÐ° | ÐŸÐµÑ€ÐµÑÐ¿Ð°Ð¼ ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ð¼Ð¸ ÑÐ»Ð¾Ð²Ð°Ð¼Ð¸ | Warning |

### 3.6.3 Ð ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð²Ð°Ð»Ð¸Ð´Ð°Ñ‚Ð¾Ñ€Ð°

```python
from enum import Enum
from dataclasses import dataclass
from typing import List


class ValidationSeverity(Enum):
    ERROR = "error"
    WARNING = "warning"
    INFO = "info"


@dataclass
class ValidationIssue:
    """ÐŸÑ€Ð¾Ð±Ð»ÐµÐ¼Ð° Ð²Ð°Ð»Ð¸Ð´Ð°Ñ†Ð¸Ð¸."""
    field: str
    message: str
    severity: ValidationSeverity
    suggestion: Optional[str] = None


@dataclass
class ValidationResult:
    """Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Ð²Ð°Ð»Ð¸Ð´Ð°Ñ†Ð¸Ð¸."""
    is_valid: bool
    issues: List[ValidationIssue]
    
    @property
    def errors(self) -> List[ValidationIssue]:
        return [i for i in self.issues if i.severity == ValidationSeverity.ERROR]
    
    @property
    def warnings(self) -> List[ValidationIssue]:
        return [i for i in self.issues if i.severity == ValidationSeverity.WARNING]


class ContentValidator:
    """Ð’Ð°Ð»Ð¸Ð´Ð°Ñ‚Ð¾Ñ€ ÑÐ³ÐµÐ½ÐµÑ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾Ð³Ð¾ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð°."""
    
    # Ð›Ð¸Ð¼Ð¸Ñ‚Ñ‹ Ð¿Ð¾ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°Ð¼
    LIMITS = {
        "wb": {"title_max": 100, "desc_min": 100, "desc_max": 5000},
        "ozon": {"title_max": 255, "desc_min": 100, "desc_max": 6000},
        "ym": {"title_max": 150, "desc_min": 100, "desc_max": 3000}
    }
    
    # ÐžÐ±Ñ‰Ð¸Ðµ Ð·Ð°Ð¿Ñ€ÐµÑ‰Ñ‘Ð½Ð½Ñ‹Ðµ ÑÐ»Ð¾Ð²Ð°
    GLOBAL_FORBIDDEN = [
        "Ð»ÑƒÑ‡ÑˆÐ¸Ð¹", "Ð½Ð¾Ð¼ÐµÑ€ 1", "ÑÐ°Ð¼Ñ‹Ð¹", "ÐµÐ´Ð¸Ð½ÑÑ‚Ð²ÐµÐ½Ð½Ñ‹Ð¹",
        "Ð³Ð°Ñ€Ð°Ð½Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾", "100%", "Ð½Ð°Ð²ÑÐµÐ³Ð´Ð°"
    ]
    
    # Ð¡Ð¿ÐµÑ†ÑÐ¸Ð¼Ð²Ð¾Ð»Ñ‹ Ð´Ð»Ñ ÑƒÐ´Ð°Ð»ÐµÐ½Ð¸Ñ
    FORBIDDEN_CHARS = ["<", ">", "{", "}", "|", "\\", "^", "`"]
    
    def validate(
        self,
        content: GeneratedContent,
        context: GenerationContext
    ) -> ValidationResult:
        """Ð’Ð°Ð»Ð¸Ð´Ð°Ñ†Ð¸Ñ ÑÐ³ÐµÐ½ÐµÑ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾Ð³Ð¾ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð°."""
        
        issues: List[ValidationIssue] = []
        marketplace = context.marketplace
        limits = self.LIMITS.get(marketplace, self.LIMITS["wb"])
        
        # Ð’Ð°Ð»Ð¸Ð´Ð°Ñ†Ð¸Ñ Title
        issues.extend(self._validate_title(content.title, limits, context))
        
        # Ð’Ð°Ð»Ð¸Ð´Ð°Ñ†Ð¸Ñ Description
        issues.extend(self._validate_description(content.description, limits, context))
        
        # Ð’Ð°Ð»Ð¸Ð´Ð°Ñ†Ð¸Ñ Ð·Ð°Ð¿Ñ€ÐµÑ‰Ñ‘Ð½Ð½Ñ‹Ñ… ÑÐ»Ð¾Ð²
        issues.extend(self._validate_forbidden_words(content, context))
        
        # Ð’Ð°Ð»Ð¸Ð´Ð°Ñ†Ð¸Ñ ÑÐ¿ÐµÑ†ÑÐ¸Ð¼Ð²Ð¾Ð»Ð¾Ð²
        issues.extend(self._validate_special_chars(content))
        
        # ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð½Ð° ÑÐ¿Ð°Ð¼
        issues.extend(self._validate_keyword_spam(content))
        
        # ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ Ð²Ð°Ð»Ð¸Ð´Ð½Ð¾ÑÑ‚Ð¸ (Ð½ÐµÑ‚ Ð¾ÑˆÐ¸Ð±Ð¾Ðº)
        is_valid = not any(i.severity == ValidationSeverity.ERROR for i in issues)
        
        return ValidationResult(is_valid=is_valid, issues=issues)
    
    def _validate_title(
        self,
        title: str,
        limits: dict,
        context: GenerationContext
    ) -> List[ValidationIssue]:
        """Ð’Ð°Ð»Ð¸Ð´Ð°Ñ†Ð¸Ñ Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ñ."""
        
        issues = []
        max_len = limits["title_max"]
        
        if len(title) > max_len:
            issues.append(ValidationIssue(
                field="title",
                message=f"Ð”Ð»Ð¸Ð½Ð° Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ñ ({len(title)}) Ð¿Ñ€ÐµÐ²Ñ‹ÑˆÐ°ÐµÑ‚ Ð»Ð¸Ð¼Ð¸Ñ‚ ({max_len})",
                severity=ValidationSeverity.ERROR,
                suggestion=f"Ð¡Ð¾ÐºÑ€Ð°Ñ‚Ð¸Ñ‚Ðµ Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ðµ Ð´Ð¾ {max_len} ÑÐ¸Ð¼Ð²Ð¾Ð»Ð¾Ð²"
            ))
        
        if len(title) < 10:
            issues.append(ValidationIssue(
                field="title",
                message="ÐÐ°Ð·Ð²Ð°Ð½Ð¸Ðµ ÑÐ»Ð¸ÑˆÐºÐ¾Ð¼ ÐºÐ¾Ñ€Ð¾Ñ‚ÐºÐ¾Ðµ",
                severity=ValidationSeverity.WARNING,
                suggestion="Ð”Ð¾Ð±Ð°Ð²ÑŒÑ‚Ðµ ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ðµ Ñ…Ð°Ñ€Ð°ÐºÑ‚ÐµÑ€Ð¸ÑÑ‚Ð¸ÐºÐ¸ Ñ‚Ð¾Ð²Ð°Ñ€Ð°"
            ))
        
        # ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð½Ð°Ð»Ð¸Ñ‡Ð¸Ñ Ð±Ñ€ÐµÐ½Ð´Ð°
        if context.brand_settings:
            brand_name = context.brand_settings.brand_name.lower()
            if brand_name not in title.lower():
                issues.append(ValidationIssue(
                    field="title",
                    message="ÐÐ°Ð·Ð²Ð°Ð½Ð¸Ðµ Ð½Ðµ ÑÐ¾Ð´ÐµÑ€Ð¶Ð¸Ñ‚ Ð±Ñ€ÐµÐ½Ð´",
                    severity=ValidationSeverity.WARNING,
                    suggestion=f"Ð”Ð¾Ð±Ð°Ð²ÑŒÑ‚Ðµ '{context.brand_settings.brand_name}' Ð² Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ðµ"
                ))
        
        return issues
    
    def _validate_description(
        self,
        description: str,
        limits: dict,
        context: GenerationContext
    ) -> List[ValidationIssue]:
        """Ð’Ð°Ð»Ð¸Ð´Ð°Ñ†Ð¸Ñ Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ñ."""
        
        issues = []
        min_len = limits["desc_min"]
        max_len = limits["desc_max"]
        
        if len(description) > max_len:
            issues.append(ValidationIssue(
                field="description",
                message=f"Ð”Ð»Ð¸Ð½Ð° Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ñ ({len(description)}) Ð¿Ñ€ÐµÐ²Ñ‹ÑˆÐ°ÐµÑ‚ Ð»Ð¸Ð¼Ð¸Ñ‚ ({max_len})",
                severity=ValidationSeverity.ERROR,
                suggestion=f"Ð¡Ð¾ÐºÑ€Ð°Ñ‚Ð¸Ñ‚Ðµ Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ Ð´Ð¾ {max_len} ÑÐ¸Ð¼Ð²Ð¾Ð»Ð¾Ð²"
            ))
        
        if len(description) < min_len:
            issues.append(ValidationIssue(
                field="description",
                message=f"ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ ÑÐ»Ð¸ÑˆÐºÐ¾Ð¼ ÐºÐ¾Ñ€Ð¾Ñ‚ÐºÐ¾Ðµ ({len(description)} < {min_len})",
                severity=ValidationSeverity.WARNING,
                suggestion="Ð”Ð¾Ð±Ð°Ð²ÑŒÑ‚Ðµ Ð±Ð¾Ð»ÑŒÑˆÐµ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸ Ð¾ Ñ‚Ð¾Ð²Ð°Ñ€Ðµ"
            ))
        
        return issues
    
    def _validate_forbidden_words(
        self,
        content: GeneratedContent,
        context: GenerationContext
    ) -> List[ValidationIssue]:
        """ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð·Ð°Ð¿Ñ€ÐµÑ‰Ñ‘Ð½Ð½Ñ‹Ñ… ÑÐ»Ð¾Ð²."""
        
        issues = []
        
        # Ð¡Ð¾Ð±Ð¸Ñ€Ð°ÐµÐ¼ Ð²ÑÐµ Ð·Ð°Ð¿Ñ€ÐµÑ‰Ñ‘Ð½Ð½Ñ‹Ðµ ÑÐ»Ð¾Ð²Ð°
        forbidden = list(self.GLOBAL_FORBIDDEN)
        if context.brand_settings and context.brand_settings.forbidden_words:
            forbidden.extend(context.brand_settings.forbidden_words)
        
        # ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Title
        title_lower = content.title.lower()
        for word in forbidden:
            if word.lower() in title_lower:
                issues.append(ValidationIssue(
                    field="title",
                    message=f"ÐÐ°Ð·Ð²Ð°Ð½Ð¸Ðµ ÑÐ¾Ð´ÐµÑ€Ð¶Ð¸Ñ‚ Ð·Ð°Ð¿Ñ€ÐµÑ‰Ñ‘Ð½Ð½Ð¾Ðµ ÑÐ»Ð¾Ð²Ð¾: '{word}'",
                    severity=ValidationSeverity.ERROR,
                    suggestion=f"Ð£Ð´Ð°Ð»Ð¸Ñ‚Ðµ Ð¸Ð»Ð¸ Ð·Ð°Ð¼ÐµÐ½Ð¸Ñ‚Ðµ ÑÐ»Ð¾Ð²Ð¾ '{word}'"
                ))
        
        # ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Description
        desc_lower = content.description.lower()
        for word in forbidden:
            if word.lower() in desc_lower:
                issues.append(ValidationIssue(
                    field="description",
                    message=f"ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ ÑÐ¾Ð´ÐµÑ€Ð¶Ð¸Ñ‚ Ð·Ð°Ð¿Ñ€ÐµÑ‰Ñ‘Ð½Ð½Ð¾Ðµ ÑÐ»Ð¾Ð²Ð¾: '{word}'",
                    severity=ValidationSeverity.ERROR,
                    suggestion=f"Ð£Ð´Ð°Ð»Ð¸Ñ‚Ðµ Ð¸Ð»Ð¸ Ð·Ð°Ð¼ÐµÐ½Ð¸Ñ‚Ðµ ÑÐ»Ð¾Ð²Ð¾ '{word}'"
                ))
        
        return issues
    
    def _validate_special_chars(self, content: GeneratedContent) -> List[ValidationIssue]:
        """ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° ÑÐ¿ÐµÑ†ÑÐ¸Ð¼Ð²Ð¾Ð»Ð¾Ð²."""
        
        issues = []
        
        for char in self.FORBIDDEN_CHARS:
            if char in content.title:
                issues.append(ValidationIssue(
                    field="title",
                    message=f"ÐÐ°Ð·Ð²Ð°Ð½Ð¸Ðµ ÑÐ¾Ð´ÐµÑ€Ð¶Ð¸Ñ‚ Ð½ÐµÐ´Ð¾Ð¿ÑƒÑÑ‚Ð¸Ð¼Ñ‹Ð¹ ÑÐ¸Ð¼Ð²Ð¾Ð»: '{char}'",
                    severity=ValidationSeverity.WARNING,
                    suggestion="Ð£Ð´Ð°Ð»Ð¸Ñ‚Ðµ ÑÐ¿ÐµÑ†ÑÐ¸Ð¼Ð²Ð¾Ð»Ñ‹ Ð¸Ð· Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ñ"
                ))
            
            if char in content.description:
                issues.append(ValidationIssue(
                    field="description",
                    message=f"ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ ÑÐ¾Ð´ÐµÑ€Ð¶Ð¸Ñ‚ Ð½ÐµÐ´Ð¾Ð¿ÑƒÑÑ‚Ð¸Ð¼Ñ‹Ð¹ ÑÐ¸Ð¼Ð²Ð¾Ð»: '{char}'",
                    severity=ValidationSeverity.WARNING,
                    suggestion="Ð£Ð´Ð°Ð»Ð¸Ñ‚Ðµ ÑÐ¿ÐµÑ†ÑÐ¸Ð¼Ð²Ð¾Ð»Ñ‹ Ð¸Ð· Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ñ"
                ))
        
        return issues
    
    def _validate_keyword_spam(self, content: GeneratedContent) -> List[ValidationIssue]:
        """ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð½Ð° Ð¿ÐµÑ€ÐµÑÐ¿Ð°Ð¼ ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ð¼Ð¸ ÑÐ»Ð¾Ð²Ð°Ð¼Ð¸."""
        
        issues = []
        
        # ÐŸÑ€Ð¾ÑÑ‚Ð°Ñ Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÐ°: ÐµÑÐ»Ð¸ ÑÐ»Ð¾Ð²Ð¾ Ð¿Ð¾Ð²Ñ‚Ð¾Ñ€ÑÐµÑ‚ÑÑ Ð±Ð¾Ð»ÐµÐµ 5 Ñ€Ð°Ð·
        words = content.description.lower().split()
        word_count = {}
        
        for word in words:
            if len(word) > 3:  # Ð˜Ð³Ð½Ð¾Ñ€Ð¸Ñ€ÑƒÐµÐ¼ ÐºÐ¾Ñ€Ð¾Ñ‚ÐºÐ¸Ðµ ÑÐ»Ð¾Ð²Ð°
                word_count[word] = word_count.get(word, 0) + 1
        
        total_words = len(words)
        for word, count in word_count.items():
            density = count / total_words * 100
            if density > 4:  # Ð‘Ð¾Ð»ÐµÐµ 4% â€” Ð¿ÐµÑ€ÐµÑÐ¿Ð°Ð¼
                issues.append(ValidationIssue(
                    field="description",
                    message=f"Ð’Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ñ‹Ð¹ Ð¿ÐµÑ€ÐµÑÐ¿Ð°Ð¼: ÑÐ»Ð¾Ð²Ð¾ '{word}' Ð²ÑÑ‚Ñ€ÐµÑ‡Ð°ÐµÑ‚ÑÑ {count} Ñ€Ð°Ð· ({density:.1f}%)",
                    severity=ValidationSeverity.WARNING,
                    suggestion="Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐ¹Ñ‚Ðµ ÑÐ¸Ð½Ð¾Ð½Ð¸Ð¼Ñ‹ Ð´Ð»Ñ Ñ€Ð°Ð·Ð½Ð¾Ð¾Ð±Ñ€Ð°Ð·Ð¸Ñ Ñ‚ÐµÐºÑÑ‚Ð°"
                ))
        
        return issues
```

---

## 3.7 ÐžÑ€ÐºÐµÑÑ‚Ñ€Ð°Ñ‚Ð¾Ñ€ Pipeline

### 3.7.1 ÐžÐ±Ñ‰Ð°Ñ ÑÑ…ÐµÐ¼Ð°

```mermaid
sequenceDiagram
    autonumber
    participant USER as ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒ
    participant ORCH as Orchestrator
    participant CTX as Context Builder
    participant ANAL as Analyzer
    participant GEN as Generator
    participant VAL as Validator
    participant DB as PostgreSQL

    USER->>ORCH: Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Ð´Ð»Ñ SKU
    ORCH->>CTX: Ð¡Ð±Ð¾Ñ€ ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ð°
    CTX-->>ORCH: GenerationContext
    ORCH->>ANAL: ÐÐ½Ð°Ð»Ð¸Ð·
    ANAL-->>ORCH: AnalysisResult
    ORCH->>GEN: Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð°
    GEN-->>ORCH: GeneratedContent
    ORCH->>VAL: Ð’Ð°Ð»Ð¸Ð´Ð°Ñ†Ð¸Ñ
    VAL-->>ORCH: ValidationResult
    ORCH->>DB: Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ñ‡ÐµÑ€Ð½Ð¾Ð²Ð¸ÐºÐ°
    ORCH-->>USER: Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Ð³ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ð¸
```

### 3.7.2 Ð ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð¾Ñ€ÐºÐµÑÑ‚Ñ€Ð°Ñ‚Ð¾Ñ€Ð°

```python
@dataclass
class GenerationResult:
    """ÐŸÐ¾Ð»Ð½Ñ‹Ð¹ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Ð³ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ð¸."""
    success: bool
    draft_id: Optional[str] = None
    content: Optional[GeneratedContent] = None
    visual_prompting: Optional[VisualPromptingResult] = None
    validation: Optional[ValidationResult] = None
    error: Optional[str] = None


class ContentPipelineOrchestrator:
    """ÐžÑ€ÐºÐµÑÑ‚Ñ€Ð°Ñ‚Ð¾Ñ€ AI Pipeline."""
    
    def __init__(
        self,
        context_builder: ContextBuilder,
        analyzer: ContentAnalyzer,
        generator: ContentGenerator,
        visual_generator: VisualPromptingGenerator,
        validator: ContentValidator,
        draft_repo: DraftRepository
    ):
        self.context_builder = context_builder
        self.analyzer = analyzer
        self.generator = generator
        self.visual_generator = visual_generator
        self.validator = validator
        self.draft_repo = draft_repo
    
    async def generate(
        self,
        card_data: CardData,
        manual_input: Optional[ManualInput] = None,
        user_id: str = "",
        include_visual_prompting: bool = False
    ) -> GenerationResult:
        """ÐŸÐ¾Ð»Ð½Ñ‹Ð¹ Ñ†Ð¸ÐºÐ» Ð³ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ð¸ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð°."""
        
        try:
            # 1. Ð¡Ð±Ð¾Ñ€ÐºÐ° ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ð°
            context = await self.context_builder.build(
                card_data=card_data,
                manual_input=manual_input,
                user_id=user_id
            )
            
            # 2. ÐÐ½Ð°Ð»Ð¸Ð·
            analysis = await self.analyzer.analyze(context)
            
            # 3. Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð°
            content = await self.generator.generate(context, analysis)
            
            # 4. Visual Prompting (Ð¾Ð¿Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾)
            visual_prompting = None
            if include_visual_prompting:
                visual_prompting = await self.visual_generator.generate(
                    context, content.title
                )
            
            # 5. Ð’Ð°Ð»Ð¸Ð´Ð°Ñ†Ð¸Ñ
            validation = self.validator.validate(content, context)
            
            # 6. Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ñ‡ÐµÑ€Ð½Ð¾Ð²Ð¸ÐºÐ°
            draft_id = await self.draft_repo.save_draft(
                sku=card_data.sku,
                marketplace=card_data.marketplace.value,
                content=content,
                validation=validation,
                user_id=user_id
            )
            
            return GenerationResult(
                success=True,
                draft_id=draft_id,
                content=content,
                visual_prompting=visual_prompting,
                validation=validation
            )
            
        except Exception as e:
            logger.error(f"Generation failed for {card_data.sku}: {e}")
            return GenerationResult(
                success=False,
                error=str(e)
            )
```

---

## 3.8 ÐšÐ¾Ð½Ñ„Ð¸Ð³ÑƒÑ€Ð°Ñ†Ð¸Ñ AI-ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð¾Ð²

### 3.8.1 GPT Client (Timeweb AI)

```python
class GPTClient:
    """ÐšÐ»Ð¸ÐµÐ½Ñ‚ Ð´Ð»Ñ GPT-5 mini Ñ‡ÐµÑ€ÐµÐ· Timeweb AI."""
    
    def __init__(self):
        self.base_url = os.getenv("TIMEWEB_AI_URL", "https://api.timeweb.cloud/ai")
        self.api_key = os.getenv("TIMEWEB_AI_KEY")
    
    async def chat_completion(
        self,
        model: str,
        messages: List[dict],
        temperature: float = 0.7,
        max_tokens: int = 1000,
        response_format: Optional[dict] = None
    ) -> ChatResponse:
        """Ð’Ñ‹Ð·Ð¾Ð² Chat Completion API."""
        
        payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        
        if response_format:
            payload["response_format"] = response_format
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/v1/chat/completions",
                json=payload,
                headers={"Authorization": f"Bearer {self.api_key}"}
            ) as resp:
                data = await resp.json()
                return ChatResponse(
                    content=data["choices"][0]["message"]["content"],
                    usage=data.get("usage", {})
                )
```

### 3.8.2 Claude Client (OpenAI API)

```python
class ClaudeClient:
    """ÐšÐ»Ð¸ÐµÐ½Ñ‚ Ð´Ð»Ñ Claude Opus 4.5."""
    
    def __init__(self):
        self.base_url = "https://api.anthropic.com"
        self.api_key = os.getenv("CLAUDE_API_KEY")
    
    async def chat_completion(
        self,
        model: str,
        messages: List[dict],
        temperature: float = 0.7,
        max_tokens: int = 1000,
        response_format: Optional[dict] = None
    ) -> ChatResponse:
        """Ð’Ñ‹Ð·Ð¾Ð² Claude API."""
        
        # ÐšÐ¾Ð½Ð²ÐµÑ€Ñ‚Ð°Ñ†Ð¸Ñ Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚Ð° ÑÐ¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ð¹
        system_content = ""
        user_messages = []
        
        for msg in messages:
            if msg["role"] == "system":
                system_content = msg["content"]
            else:
                user_messages.append(msg)
        
        payload = {
            "model": "claude-opus-4-5-20251101",
            "max_tokens": max_tokens,
            "messages": user_messages
        }
        
        if system_content:
            payload["system"] = system_content
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/v1/messages",
                json=payload,
                headers={
                    "x-api-key": self.api_key,
                    "anthropic-version": "2024-01-01",
                    "content-type": "application/json"
                }
            ) as resp:
                data = await resp.json()
                return ChatResponse(
                    content=data["content"][0]["text"],
                    usage=data.get("usage", {})
                )
```

---

**Ð”Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚ Ð¿Ð¾Ð´Ð³Ð¾Ñ‚Ð¾Ð²Ð»ÐµÐ½:** Ð¯Ð½Ð²Ð°Ñ€ÑŒ 2026  
**Ð’ÐµÑ€ÑÐ¸Ñ:** 1.0  
**Ð¡Ñ‚Ð°Ñ‚ÑƒÑ:** Ð§ÐµÑ€Ð½Ð¾Ð²Ð¸Ðº

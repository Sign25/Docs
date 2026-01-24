# ADOLF CONTENT FACTORY — Раздел 2: Marketplace Adapters

**Проект:** Генерация SEO-контента для карточек товаров  
**Модуль:** Content Factory  
**Версия:** 1.0  
**Дата:** Январь 2026

---

## 2.1 Назначение

Marketplace Adapters — унифицированный слой интеграции с API маркетплейсов для чтения и обновления карточек товаров.

### Поддерживаемые маркетплейсы

| Маркетплейс | Порядок интеграции | API Version | Статус |
|-------------|:------------------:|-------------|--------|
| Wildberries | 1 | Content API v2 | MVP |
| Ozon | 2 | Seller API v3 | MVP |
| Yandex.Market | 3 | Partner API | MVP |

### Архитектура адаптеров

```mermaid
graph TB
    subgraph CONTENT_FACTORY["Content Factory"]
        SERVICE["Content Service"]
        FACTORY["Adapter Factory"]
    end

    subgraph ADAPTERS["Marketplace Adapters"]
        BASE["BaseAdapter"]
        WB["WildberriesAdapter"]
        OZON["OzonAdapter"]
        YM["YandexMarketAdapter"]
    end

    subgraph EXTERNAL["Внешние API"]
        WB_API["WB Content API"]
        OZON_API["Ozon Seller API"]
        YM_API["YM Partner API"]
    end

    SERVICE --> FACTORY
    FACTORY --> WB & OZON & YM
    
    BASE <|-- WB
    BASE <|-- OZON
    BASE <|-- YM
    
    WB --> WB_API
    OZON --> OZON_API
    YM --> YM_API
```

---

## 2.2 Базовый интерфейс

### 2.2.1 Абстрактный класс BaseAdapter

```python
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional, List
from enum import Enum


class Marketplace(Enum):
    WILDBERRIES = "wb"
    OZON = "ozon"
    YANDEX_MARKET = "ym"


@dataclass
class CardData:
    """Данные карточки товара."""
    sku: str
    marketplace: Marketplace
    nm_id: Optional[str] = None          # ID на маркетплейсе
    title: Optional[str] = None
    description: Optional[str] = None
    attributes: Optional[dict] = None
    category: Optional[str] = None
    category_id: Optional[int] = None
    brand: Optional[str] = None
    photos: Optional[List[str]] = None
    seo_tags: Optional[List[str]] = None
    raw_data: Optional[dict] = None      # Исходные данные API


@dataclass
class CardContent:
    """Контент для обновления карточки."""
    title: Optional[str] = None
    description: Optional[str] = None
    attributes: Optional[dict] = None
    seo_tags: Optional[List[str]] = None


@dataclass
class PublishResult:
    """Результат публикации."""
    success: bool
    marketplace: Marketplace
    sku: str
    nm_id: Optional[str] = None
    error_code: Optional[str] = None
    error_message: Optional[str] = None
    raw_response: Optional[dict] = None


class BaseAdapter(ABC):
    """Базовый класс адаптера маркетплейса."""
    
    marketplace: Marketplace
    
    @abstractmethod
    async def get_card(self, sku: str) -> Optional[CardData]:
        """Получение данных карточки по артикулу."""
        pass
    
    @abstractmethod
    async def update_card(self, sku: str, content: CardContent) -> PublishResult:
        """Обновление контента карточки."""
        pass
    
    @abstractmethod
    async def get_categories(self) -> List[dict]:
        """Получение списка категорий."""
        pass
    
    @abstractmethod
    async def validate_content(self, content: CardContent, category_id: int) -> List[str]:
        """Валидация контента перед публикацией. Возвращает список ошибок."""
        pass
```

### 2.2.2 Фабрика адаптеров

```python
class AdapterFactory:
    """Фабрика для создания адаптеров маркетплейсов."""
    
    _adapters: dict = {}
    
    @classmethod
    def register(cls, marketplace: Marketplace, adapter_class: type):
        """Регистрация адаптера."""
        cls._adapters[marketplace] = adapter_class
    
    @classmethod
    def create(cls, marketplace: Marketplace, credentials: dict) -> BaseAdapter:
        """Создание экземпляра адаптера."""
        if marketplace not in cls._adapters:
            raise ValueError(f"Adapter for {marketplace} not registered")
        
        return cls._adapters[marketplace](credentials)
    
    @classmethod
    def get_adapter(cls, marketplace: str, credentials: dict) -> BaseAdapter:
        """Получение адаптера по строковому идентификатору."""
        mp = Marketplace(marketplace)
        return cls.create(mp, credentials)


# Регистрация адаптеров
AdapterFactory.register(Marketplace.WILDBERRIES, WildberriesAdapter)
AdapterFactory.register(Marketplace.OZON, OzonAdapter)
AdapterFactory.register(Marketplace.YANDEX_MARKET, YandexMarketAdapter)
```

---

## 2.3 Wildberries Adapter

### 2.3.1 Конфигурация

| Параметр | Environment Variable | Описание |
|----------|---------------------|----------|
| API Key | `WB_API_KEY` | Ключ доступа к Content API |
| Base URL | `WB_API_URL` | `https://content-api.wildberries.ru` |

### 2.3.2 API Endpoints

| Операция | Метод | Endpoint | Описание |
|----------|-------|----------|----------|
| Получение карточки | POST | `/content/v2/get/cards/list` | Список карточек по фильтру |
| Обновление карточки | POST | `/content/v2/cards/update` | Обновление контента |
| Категории | GET | `/content/v2/object/all` | Список категорий |
| Характеристики | GET | `/content/v2/object/charcs/{subjectId}` | Характеристики категории |

### 2.3.3 Лимиты API

| Параметр | Значение |
|----------|----------|
| Requests per minute | 100 |
| Max cards per request | 100 |
| Title max length | 100 символов |
| Description max length | 5000 символов |

### 2.3.4 Реализация адаптера

```python
import aiohttp
from typing import Optional, List


class WildberriesAdapter(BaseAdapter):
    """Адаптер для Wildberries Content API."""
    
    marketplace = Marketplace.WILDBERRIES
    
    def __init__(self, credentials: dict):
        self.api_key = credentials["api_key"]
        self.base_url = credentials.get("base_url", "https://content-api.wildberries.ru")
        self.headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json"
        }
    
    async def get_card(self, sku: str) -> Optional[CardData]:
        """Получение карточки по артикулу продавца."""
        
        url = f"{self.base_url}/content/v2/get/cards/list"
        payload = {
            "settings": {
                "cursor": {"limit": 1},
                "filter": {"textSearch": sku, "withPhoto": -1}
            }
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=self.headers) as resp:
                if resp.status != 200:
                    return None
                
                data = await resp.json()
                cards = data.get("cards", [])
                
                if not cards:
                    return None
                
                card = cards[0]
                return self._map_card_data(card, sku)
    
    def _map_card_data(self, raw: dict, sku: str) -> CardData:
        """Маппинг данных WB в CardData."""
        
        # Извлечение характеристик
        attributes = {}
        for charc in raw.get("characteristics", []):
            for item in charc:
                if "value" in item:
                    attributes[item.get("id", item.get("name"))] = item["value"]
        
        return CardData(
            sku=sku,
            marketplace=Marketplace.WILDBERRIES,
            nm_id=str(raw.get("nmID")),
            title=raw.get("title"),
            description=raw.get("description"),
            attributes=attributes,
            category=raw.get("subjectName"),
            category_id=raw.get("subjectID"),
            brand=raw.get("brand"),
            photos=[p.get("big") for p in raw.get("photos", [])],
            raw_data=raw
        )
    
    async def update_card(self, sku: str, content: CardContent) -> PublishResult:
        """Обновление контента карточки."""
        
        # Получаем текущую карточку для nmID
        current = await self.get_card(sku)
        if not current:
            return PublishResult(
                success=False,
                marketplace=self.marketplace,
                sku=sku,
                error_code="CARD_NOT_FOUND",
                error_message=f"Карточка {sku} не найдена"
            )
        
        url = f"{self.base_url}/content/v2/cards/update"
        
        # Формируем payload
        card_update = {
            "nmID": int(current.nm_id)
        }
        
        if content.title:
            card_update["title"] = content.title[:100]  # Лимит WB
        
        if content.description:
            card_update["description"] = content.description[:5000]
        
        if content.attributes:
            card_update["characteristics"] = self._format_attributes(content.attributes)
        
        payload = [card_update]
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=self.headers) as resp:
                data = await resp.json()
                
                if resp.status == 200 and not data.get("error"):
                    return PublishResult(
                        success=True,
                        marketplace=self.marketplace,
                        sku=sku,
                        nm_id=current.nm_id,
                        raw_response=data
                    )
                else:
                    return PublishResult(
                        success=False,
                        marketplace=self.marketplace,
                        sku=sku,
                        nm_id=current.nm_id,
                        error_code=str(data.get("errorCode", "UNKNOWN")),
                        error_message=data.get("errorText", str(data)),
                        raw_response=data
                    )
    
    def _format_attributes(self, attributes: dict) -> list:
        """Форматирование атрибутов для API WB."""
        result = []
        for key, value in attributes.items():
            result.append({"id": key, "value": value})
        return result
    
    async def get_categories(self) -> List[dict]:
        """Получение списка категорий."""
        
        url = f"{self.base_url}/content/v2/object/all"
        params = {"locale": "ru"}
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params, headers=self.headers) as resp:
                if resp.status != 200:
                    return []
                
                data = await resp.json()
                return data.get("data", [])
    
    async def validate_content(self, content: CardContent, category_id: int) -> List[str]:
        """Валидация контента для WB."""
        
        errors = []
        
        if content.title and len(content.title) > 100:
            errors.append(f"Title превышает лимит 100 символов ({len(content.title)})")
        
        if content.description and len(content.description) > 5000:
            errors.append(f"Description превышает лимит 5000 символов ({len(content.description)})")
        
        return errors
```

### 2.3.5 Маппинг полей WB

| Поле CardData | Поле WB API | Примечание |
|---------------|-------------|------------|
| `sku` | `vendorCode` | Артикул продавца |
| `nm_id` | `nmID` | Номенклатура WB |
| `title` | `title` | Название |
| `description` | `description` | Описание |
| `attributes` | `characteristics` | Массив характеристик |
| `category` | `subjectName` | Название категории |
| `category_id` | `subjectID` | ID категории |
| `brand` | `brand` | Бренд |

---

## 2.4 Ozon Adapter

### 2.4.1 Конфигурация

| Параметр | Environment Variable | Описание |
|----------|---------------------|----------|
| Client ID | `OZON_CLIENT_ID` | ID клиента |
| API Key | `OZON_API_KEY` | Ключ доступа к Seller API |
| Base URL | `OZON_API_URL` | `https://api-seller.ozon.ru` |

### 2.4.2 API Endpoints

| Операция | Метод | Endpoint | Описание |
|----------|-------|----------|----------|
| Получение карточки | POST | `/v3/product/info` | Информация о товаре |
| Обновление карточки | POST | `/v1/product/import` | Импорт/обновление товара |
| Категории | POST | `/v1/description-category/tree` | Дерево категорий |
| Атрибуты | POST | `/v1/description-category/attribute` | Атрибуты категории |

### 2.4.3 Лимиты API

| Параметр | Значение |
|----------|----------|
| Requests per minute | 60 |
| Max products per request | 100 |
| Title max length | 255 символов |
| Description max length | 6000 символов |

### 2.4.4 Реализация адаптера

```python
class OzonAdapter(BaseAdapter):
    """Адаптер для Ozon Seller API."""
    
    marketplace = Marketplace.OZON
    
    def __init__(self, credentials: dict):
        self.client_id = credentials["client_id"]
        self.api_key = credentials["api_key"]
        self.base_url = credentials.get("base_url", "https://api-seller.ozon.ru")
        self.headers = {
            "Client-Id": self.client_id,
            "Api-Key": self.api_key,
            "Content-Type": "application/json"
        }
    
    async def get_card(self, sku: str) -> Optional[CardData]:
        """Получение карточки по артикулу."""
        
        url = f"{self.base_url}/v3/product/info"
        payload = {"offer_id": sku}
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=self.headers) as resp:
                if resp.status != 200:
                    return None
                
                data = await resp.json()
                result = data.get("result")
                
                if not result:
                    return None
                
                return self._map_card_data(result, sku)
    
    def _map_card_data(self, raw: dict, sku: str) -> CardData:
        """Маппинг данных Ozon в CardData."""
        
        # Извлечение атрибутов
        attributes = {}
        for attr in raw.get("attributes", []):
            attr_id = attr.get("attribute_id")
            values = attr.get("values", [])
            if values:
                attributes[attr_id] = values[0].get("value")
        
        return CardData(
            sku=sku,
            marketplace=Marketplace.OZON,
            nm_id=str(raw.get("id")),
            title=raw.get("name"),
            description=raw.get("description"),
            attributes=attributes,
            category=raw.get("description_category_id"),
            category_id=raw.get("description_category_id"),
            brand=raw.get("brand"),
            photos=[img.get("file_name") for img in raw.get("images", [])],
            seo_tags=raw.get("keywords"),
            raw_data=raw
        )
    
    async def update_card(self, sku: str, content: CardContent) -> PublishResult:
        """Обновление контента карточки."""
        
        current = await self.get_card(sku)
        if not current:
            return PublishResult(
                success=False,
                marketplace=self.marketplace,
                sku=sku,
                error_code="CARD_NOT_FOUND",
                error_message=f"Карточка {sku} не найдена"
            )
        
        url = f"{self.base_url}/v1/product/import"
        
        # Формируем item для обновления
        item = {
            "offer_id": sku
        }
        
        if content.title:
            item["name"] = content.title[:255]
        
        if content.description:
            item["description"] = content.description[:6000]
        
        if content.attributes:
            item["attributes"] = self._format_attributes(content.attributes)
        
        if content.seo_tags:
            item["keywords"] = ",".join(content.seo_tags)
        
        payload = {"items": [item]}
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=self.headers) as resp:
                data = await resp.json()
                
                if resp.status == 200:
                    result = data.get("result", {})
                    task_id = result.get("task_id")
                    
                    return PublishResult(
                        success=True,
                        marketplace=self.marketplace,
                        sku=sku,
                        nm_id=current.nm_id,
                        raw_response={"task_id": task_id, **data}
                    )
                else:
                    return PublishResult(
                        success=False,
                        marketplace=self.marketplace,
                        sku=sku,
                        nm_id=current.nm_id,
                        error_code=str(data.get("code", "UNKNOWN")),
                        error_message=data.get("message", str(data)),
                        raw_response=data
                    )
    
    def _format_attributes(self, attributes: dict) -> list:
        """Форматирование атрибутов для Ozon API."""
        result = []
        for attr_id, value in attributes.items():
            result.append({
                "attribute_id": int(attr_id),
                "values": [{"value": str(value)}]
            })
        return result
    
    async def get_categories(self) -> List[dict]:
        """Получение дерева категорий."""
        
        url = f"{self.base_url}/v1/description-category/tree"
        payload = {"language": "RU"}
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=self.headers) as resp:
                if resp.status != 200:
                    return []
                
                data = await resp.json()
                return data.get("result", [])
    
    async def validate_content(self, content: CardContent, category_id: int) -> List[str]:
        """Валидация контента для Ozon."""
        
        errors = []
        
        if content.title and len(content.title) > 255:
            errors.append(f"Title превышает лимит 255 символов ({len(content.title)})")
        
        if content.description and len(content.description) > 6000:
            errors.append(f"Description превышает лимит 6000 символов ({len(content.description)})")
        
        return errors
```

### 2.4.5 Маппинг полей Ozon

| Поле CardData | Поле Ozon API | Примечание |
|---------------|---------------|------------|
| `sku` | `offer_id` | Артикул продавца |
| `nm_id` | `id` | ID товара в Ozon |
| `title` | `name` | Название |
| `description` | `description` | Описание |
| `attributes` | `attributes` | Массив атрибутов |
| `category_id` | `description_category_id` | ID категории |
| `brand` | `brand` | Бренд |
| `seo_tags` | `keywords` | Ключевые слова |

---

## 2.5 Yandex.Market Adapter

### 2.5.1 Конфигурация

| Параметр | Environment Variable | Описание |
|----------|---------------------|----------|
| OAuth Token | `YM_OAUTH_TOKEN` | OAuth-токен |
| Campaign ID | `YM_CAMPAIGN_ID` | ID кампании |
| Business ID | `YM_BUSINESS_ID` | ID бизнеса |
| Base URL | `YM_API_URL` | `https://api.partner.market.yandex.ru` |

### 2.5.2 API Endpoints

| Операция | Метод | Endpoint | Описание |
|----------|-------|----------|----------|
| Получение карточки | POST | `/businesses/{id}/offer-cards` | Информация о карточке |
| Обновление карточки | POST | `/businesses/{id}/offer-cards/update` | Обновление контента |
| Категории | POST | `/categories/tree` | Дерево категорий |
| Характеристики | POST | `/category/{id}/parameters` | Параметры категории |

### 2.5.3 Лимиты API

| Параметр | Значение |
|----------|----------|
| Requests per second | 10 |
| Max offers per request | 500 |
| Title max length | 150 символов |
| Description max length | 3000 символов |

### 2.5.4 Реализация адаптера

```python
class YandexMarketAdapter(BaseAdapter):
    """Адаптер для Yandex.Market Partner API."""
    
    marketplace = Marketplace.YANDEX_MARKET
    
    def __init__(self, credentials: dict):
        self.oauth_token = credentials["oauth_token"]
        self.campaign_id = credentials["campaign_id"]
        self.business_id = credentials["business_id"]
        self.base_url = credentials.get("base_url", "https://api.partner.market.yandex.ru")
        self.headers = {
            "Authorization": f"Bearer {self.oauth_token}",
            "Content-Type": "application/json"
        }
    
    async def get_card(self, sku: str) -> Optional[CardData]:
        """Получение карточки по артикулу."""
        
        url = f"{self.base_url}/businesses/{self.business_id}/offer-cards"
        payload = {
            "offerIds": [sku]
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=self.headers) as resp:
                if resp.status != 200:
                    return None
                
                data = await resp.json()
                cards = data.get("result", {}).get("offerCards", [])
                
                if not cards:
                    return None
                
                return self._map_card_data(cards[0], sku)
    
    def _map_card_data(self, raw: dict, sku: str) -> CardData:
        """Маппинг данных YM в CardData."""
        
        mapping = raw.get("mapping", {})
        card = mapping.get("marketSku", {})
        
        # Извлечение параметров
        attributes = {}
        for param in card.get("parameterValues", []):
            param_id = param.get("parameterId")
            value = param.get("value", {})
            attributes[param_id] = value.get("value") or value.get("optionId")
        
        return CardData(
            sku=sku,
            marketplace=Marketplace.YANDEX_MARKET,
            nm_id=str(card.get("marketSku")),
            title=raw.get("offer", {}).get("name"),
            description=raw.get("offer", {}).get("description"),
            attributes=attributes,
            category=card.get("categoryName"),
            category_id=card.get("categoryId"),
            brand=raw.get("offer", {}).get("vendor"),
            photos=[img for img in raw.get("offer", {}).get("pictures", [])],
            seo_tags=raw.get("offer", {}).get("tags", []),
            raw_data=raw
        )
    
    async def update_card(self, sku: str, content: CardContent) -> PublishResult:
        """Обновление контента карточки."""
        
        current = await self.get_card(sku)
        if not current:
            return PublishResult(
                success=False,
                marketplace=self.marketplace,
                sku=sku,
                error_code="CARD_NOT_FOUND",
                error_message=f"Карточка {sku} не найдена"
            )
        
        url = f"{self.base_url}/businesses/{self.business_id}/offer-cards/update"
        
        # Формируем offer для обновления
        offer = {
            "offerId": sku
        }
        
        if content.title:
            offer["name"] = content.title[:150]
        
        if content.description:
            offer["description"] = content.description[:3000]
        
        if content.seo_tags:
            offer["tags"] = content.seo_tags
        
        payload = {"offerCards": [{"offer": offer}]}
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=self.headers) as resp:
                data = await resp.json()
                
                if resp.status == 200:
                    return PublishResult(
                        success=True,
                        marketplace=self.marketplace,
                        sku=sku,
                        nm_id=current.nm_id,
                        raw_response=data
                    )
                else:
                    errors = data.get("errors", [])
                    error_msg = errors[0].get("message") if errors else str(data)
                    
                    return PublishResult(
                        success=False,
                        marketplace=self.marketplace,
                        sku=sku,
                        nm_id=current.nm_id,
                        error_code=str(data.get("status", "UNKNOWN")),
                        error_message=error_msg,
                        raw_response=data
                    )
    
    async def get_categories(self) -> List[dict]:
        """Получение дерева категорий."""
        
        url = f"{self.base_url}/categories/tree"
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json={}, headers=self.headers) as resp:
                if resp.status != 200:
                    return []
                
                data = await resp.json()
                return data.get("result", {}).get("children", [])
    
    async def validate_content(self, content: CardContent, category_id: int) -> List[str]:
        """Валидация контента для YM."""
        
        errors = []
        
        if content.title and len(content.title) > 150:
            errors.append(f"Title превышает лимит 150 символов ({len(content.title)})")
        
        if content.description and len(content.description) > 3000:
            errors.append(f"Description превышает лимит 3000 символов ({len(content.description)})")
        
        return errors
```

### 2.5.5 Маппинг полей YM

| Поле CardData | Поле YM API | Примечание |
|---------------|-------------|------------|
| `sku` | `offerId` | Артикул продавца |
| `nm_id` | `marketSku` | SKU Яндекса |
| `title` | `offer.name` | Название |
| `description` | `offer.description` | Описание |
| `attributes` | `parameterValues` | Параметры товара |
| `category_id` | `categoryId` | ID категории |
| `brand` | `offer.vendor` | Бренд |
| `seo_tags` | `offer.tags` | Теги |

---

## 2.6 Сводная таблица лимитов

| Параметр | Wildberries | Ozon | Yandex.Market |
|----------|-------------|------|---------------|
| Title max | 100 | 255 | 150 |
| Description max | 5000 | 6000 | 3000 |
| Requests/min | 100 | 60 | 600 |
| Items/request | 100 | 100 | 500 |

---

## 2.7 Обработка ошибок

### 2.7.1 Коды ошибок

| Код | Описание | Действие |
|-----|----------|----------|
| `CARD_NOT_FOUND` | Карточка не найдена | Уведомить пользователя |
| `AUTH_ERROR` | Ошибка авторизации | Проверить credentials |
| `RATE_LIMIT` | Превышен лимит запросов | Retry с backoff |
| `VALIDATION_ERROR` | Ошибка валидации | Показать детали |
| `API_ERROR` | Ошибка API маркетплейса | Retry / уведомить |

### 2.7.2 Стратегия retry

```python
from tenacity import retry, stop_after_attempt, wait_exponential


class RetryConfig:
    MAX_ATTEMPTS = 3
    WAIT_MIN = 1  # секунды
    WAIT_MAX = 10  # секунды


@retry(
    stop=stop_after_attempt(RetryConfig.MAX_ATTEMPTS),
    wait=wait_exponential(min=RetryConfig.WAIT_MIN, max=RetryConfig.WAIT_MAX)
)
async def api_call_with_retry(adapter: BaseAdapter, method: str, *args, **kwargs):
    """Выполнение API-вызова с retry."""
    func = getattr(adapter, method)
    return await func(*args, **kwargs)
```

---

## 2.8 Тестирование адаптеров

### 2.8.1 Unit-тесты

```python
import pytest
from unittest.mock import AsyncMock, patch


@pytest.mark.asyncio
async def test_wb_adapter_get_card():
    """Тест получения карточки WB."""
    
    credentials = {"api_key": "test_key"}
    adapter = WildberriesAdapter(credentials)
    
    mock_response = {
        "cards": [{
            "nmID": 123456,
            "vendorCode": "OM-001",
            "title": "Платье женское",
            "description": "Описание",
            "subjectName": "Платья",
            "subjectID": 100
        }]
    }
    
    with patch.object(adapter, 'get_card', new_callable=AsyncMock) as mock:
        mock.return_value = CardData(
            sku="OM-001",
            marketplace=Marketplace.WILDBERRIES,
            nm_id="123456",
            title="Платье женское"
        )
        
        result = await adapter.get_card("OM-001")
        
        assert result is not None
        assert result.sku == "OM-001"
        assert result.title == "Платье женское"
```

### 2.8.2 Интеграционные тесты

| Тест | Описание | Требования |
|------|----------|------------|
| `test_real_wb_connection` | Проверка подключения к WB | Sandbox API key |
| `test_real_ozon_connection` | Проверка подключения к Ozon | Sandbox credentials |
| `test_real_ym_connection` | Проверка подключения к YM | Sandbox OAuth token |

---

**Документ подготовлен:** Январь 2026  
**Версия:** 1.0  
**Статус:** Черновик

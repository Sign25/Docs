---
title: "Раздел 1.1: Open Webui Overview"
mode: "wide"
---

**Проект:** Ядро корпоративной AI-системы  
**Модуль:** User Interface  
**Версия:** 4.1  
**Дата:** Январь 2026

---

## 1. Обзор

### 1.1. Назначение

Open WebUI — единый интерфейс взаимодействия пользователей с системой Adolf:

- Чат с AI-ассистентом
- Загрузка и модерация документов
- Работа с отзывами и вопросами
- Мониторинг цен конкурентов
- Аналитика и отчёты
- Системные настройки

### 1.2. Почему Open WebUI

| Критерий | Open WebUI | Самописный React |
|----------|------------|------------------|
| Time-to-Market | 1-2 недели | 2-3 месяца |
| Поддержка | Активное сообщество | Своя команда |
| Функциональность | 80% из коробки | 100% кастом |
| PWA | Встроено | Требует разработки |
| Чат-интерфейс | Готовый | С нуля |
| Pipelines/Tools | Встроенная система | Своя архитектура |

### 1.3. Ключевые возможности

- **Pipelines** — агенты для каждого модуля системы
- **Tools** — инструменты с Function Calling
- **PWA** — установка на мобильные устройства
- **WebSocket** — real-time уведомления
- **Markdown/LaTeX** — форматирование в чате
- **Голосовой ввод** — STT/TTS интеграция

---

## 2. Архитектура

### 2.1. Общая схема

```mermaid
flowchart TB
    BROWSER["Браузер / PWA"]
    
    subgraph VPS["VPS Server"]
        NGINX["Nginx"]
        OWUI["Open WebUI"]
        MW["Middleware"]
    end
    
    subgraph EXTERNAL["Внешние сервисы"]
        TIMEWEB["Timeweb AI"]
        OPENAI["OpenAI API"]
    end
    
    BROWSER -->|HTTPS| NGINX
    NGINX --> OWUI
    OWUI --> MW
    MW --> TIMEWEB
    MW --> OPENAI
```

### 2.2. Компоненты Open WebUI

```mermaid
flowchart LR
    subgraph OWUI["Open WebUI (Docker)"]
        FE["React Frontend"]
        BE["Python Backend"]
        PIPES["Pipelines"]
        TOOLS["Tools"]
    end
    
    FE --> BE
    BE --> PIPES
    PIPES --> TOOLS
```

### 2.3. Потоки данных

```mermaid
sequenceDiagram
    participant U as User
    participant OW as Open WebUI
    participant P as Pipeline
    participant T as Tool
    participant MW as Middleware
    participant AI as Timeweb AI
    
    U->>OW: Сообщение в чат
    OW->>P: Выбор Pipeline
    P->>AI: Запрос с Tools
    AI-->>P: tool_calls
    
    loop Для каждого tool call
        P->>T: Execute tool
        T->>MW: API request
        MW-->>T: Response
        T-->>P: Tool result
    end
    
    P->>AI: Messages + tool results
    AI-->>P: Final response
    P-->>OW: Formatted response
    OW-->>U: Отображение
```

### 2.4. Компоненты системы

| Компонент | Технология | Назначение |
|-----------|------------|------------|
| Open WebUI | Docker | Основной интерфейс |
| Nginx | nginx:alpine | SSL, Reverse Proxy, WebSocket |
| Pipelines | Python | Агенты модулей |
| Tools | Python/JS | Function Calling инструменты |
| Middleware | FastAPI | Backend API |

---

## 3. Установка и конфигурация

### 3.1. Требования

| Ресурс | Минимум | Рекомендуется |
|--------|---------|---------------|
| CPU | 2 vCPU | 4 vCPU |
| RAM | 2 GB | 4 GB |
| Disk | 10 GB | 20 GB |
| Docker | 24.0+ | Latest |
| Docker Compose | 2.20+ | Latest |

### 3.2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./nginx/html:/usr/share/nginx/html:ro
    depends_on:
      - open-webui
    restart: unless-stopped

  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    volumes:
      - open-webui-data:/app/backend/data
      - ./pipelines:/app/backend/pipelines:ro
      - ./tools:/app/backend/tools:ro
    environment:
      # Базовые настройки
      - WEBUI_NAME=Adolf
      - WEBUI_URL=https://adolf.su
      - WEBUI_SECRET_KEY=${WEBUI_SECRET_KEY}
      
      # Отключение регистрации
      - ENABLE_SIGNUP=false
      - ENABLE_LOGIN_FORM=true
      
      # OpenAI-compatible endpoint (Middleware)
      - OPENAI_API_BASE_URL=http://middleware:8000/v1
      - OPENAI_API_KEY=${MIDDLEWARE_API_KEY}
      
      # Модели
      - DEFAULT_MODELS=gpt-4o-mini
      
      # RAG (отключаем встроенный, используем Middleware)
      - ENABLE_RAG_WEB_SEARCH=false
      - ENABLE_RAG_LOCAL=false
      
      # WebSocket
      - ENABLE_WEBSOCKET_SUPPORT=true
      
      # Файлы
      - MAX_UPLOAD_SIZE=52428800  # 50 MB
      
      # Логирование
      - LOG_LEVEL=INFO
    depends_on:
      - middleware
    restart: unless-stopped

  middleware:
    build: ./middleware
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - TIMEWEB_AI_API_KEY=${TIMEWEB_AI_API_KEY}
      - TIMEWEB_KB_ID=${TIMEWEB_KB_ID}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    restart: unless-stopped

volumes:
  open-webui-data:
```

### 3.3. Nginx конфигурация

```nginx
# nginx/conf.d/adolf.conf

upstream open-webui {
    server open-webui:8080;
}

upstream middleware {
    server middleware:8000;
}

server {
    listen 80;
    server_name adolf.su;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name adolf.su;

    # SSL
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Open WebUI
    location / {
        proxy_pass http://open-webui;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }

    # Middleware API
    location /api/v1/ {
        proxy_pass http://middleware/api/v1/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # PWA manifest
    location /manifest.json {
        alias /usr/share/nginx/html/manifest.json;
        add_header Cache-Control "public, max-age=86400";
    }

    # Service Worker
    location /sw.js {
        proxy_pass http://open-webui/sw.js;
        add_header Cache-Control "no-cache";
    }

    # File uploads
    client_max_body_size 50M;
}
```

### 3.4. Переменные окружения

```bash
# .env

# Open WebUI
WEBUI_SECRET_KEY=your-secret-key-here
MIDDLEWARE_API_KEY=your-middleware-api-key

# Database
DATABASE_URL=postgresql://adolf:password@postgres:5432/adolf

# Redis
REDIS_URL=redis://redis:6379/0

# Timeweb
TIMEWEB_AI_API_KEY=your-timeweb-api-key
TIMEWEB_KB_ID=your-kb-id

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Domain
DOMAIN=adolf.su
```

### 3.5. Команды запуска

```bash
# Первый запуск
docker compose up -d

# Просмотр логов
docker compose logs -f open-webui

# Перезапуск после изменений
docker compose restart open-webui

# Обновление образа
docker compose pull open-webui
docker compose up -d open-webui
```

---

**Конец части 1.1**

**Следующая часть:** 1.2 — Интерфейс и Pipelines

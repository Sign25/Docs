---
title: "ТЗ: Миграция документации на VitePress"
description: "ADOLF Documentation Platform v1.1 — развёртывание VitePress на VPS"
mode: "wide"
---

## Метаданные

| Параметр | Значение |
|:---------|:---------|
| Проект | ADOLF Documentation Platform |
| Версия ТЗ | 1.1 |
| Дата | Февраль 2026 |
| Причина миграции | IP-адреса Vercel (Mintlify) заблокированы Роскомнадзором |
| Текущий движок | Mintlify (docs.json + MDX) |
| Целевой движок | VitePress 2.x (`vitepress@next`, текущая — v2.0.0-alpha.15) |
| Репозиторий | `https://github.com/Sign25/Docs.git` |
| Домен | `docs.adolf.su` |
| VPS | Timeweb Cloud (4 vCPU, 8 GB RAM, Ubuntu 24) |

---

## 1. Цель

Развернуть self-hosted документацию ADOLF Platform на VitePress 2.x с деплоем на VPS Timeweb, обеспечив доступность `docs.adolf.su` из России без VPN.

## 2. Scope

### 2.1 Входные данные

- 113 файлов `.md` в 12 модулях + корневые файлы
- Конфигурация навигации `docs.json` (Mintlify-формат)
- Mintlify MDX-компоненты: `Note`, `Warning`, `Info`, `Tip`, `Steps/Step`, `Tabs/Tab`, `Accordion`, `Card`, `Columns`, `CodeGroup`, `Frame`
- Mermaid-диаграммы (~50+ штук)
- Frontmatter YAML в каждом файле
- Логотипы SVG (light/dark)

### 2.2 Результат

- VitePress-сайт на `docs.adolf.su`, доступный из РФ
- Автоматический деплой при push в `main`
- Полнотекстовый поиск по документации
- Mermaid-рендеринг
- Адаптивная верстка (desktop + mobile)

---

## 3. Архитектура

```mermaid
flowchart LR
    subgraph DEV["Разработка"]
        MD["Markdown файлы"]
        GIT["GitHub Push"]
    end

    subgraph VPS["VPS Timeweb"]
        WEBHOOK["Webhook listener<br/>(port 9000)"]
        BUILD["VitePress build"]
        NGINX["Nginx<br/>docs.adolf.su:443"]
        STATIC["Static HTML<br/>/var/www/docs"]
    end

    subgraph USER["Пользователь"]
        BROWSER["Браузер"]
    end

    MD --> GIT
    GIT -->|webhook| WEBHOOK
    WEBHOOK -->|git pull + build| BUILD
    BUILD -->|dist/| STATIC
    NGINX -->|serve| STATIC
    BROWSER -->|HTTPS| NGINX
```

### 3.1 Компоненты

| Компонент | Технология | Назначение |
|:----------|:-----------|:-----------|
| SSG | VitePress 2.x (`vitepress@next`) | Генерация статического HTML из Markdown |
| Mermaid | `vitepress-plugin-mermaid` | Рендеринг диаграмм |
| Поиск | VitePress MiniSearch (встроенный) | Полнотекстовый поиск |
| Web-сервер | Nginx | HTTPS, gzip, кэширование |
| SSL | Let's Encrypt (certbot) | TLS-сертификат |
| CI/CD | GitHub Webhook + bash-скрипт | Автодеплой при push |
| Node.js | v20 LTS | Runtime для сборки |

### 3.2 Особенности VitePress 2.x

| Изменение | Влияние на проект |
|:----------|:-----------------|
| `markdown-it-cjk-friendly` включён по умолчанию | Не влияет (контент на кириллице) |
| `markdown-it-attrs` отключён для code-блоков | Не влияет (не используем attrs в code) |
| Улучшенный HMR (без перезапуска при смене темы) | Ускоряет разработку |
| Custom display-name для fenced code blocks | Можно использовать для подписей к коду |
| Установка через `npm install vitepress@next` | npm tag `next` вместо `latest` |

---

## 4. Настройка поддомена docs.adolf.su

### 4.1 DNS-конфигурация

Текущая DNS-запись `doc.adolf.su` (старый домен) указывает на `cname.mintlify-dns.com`. Необходимо создать новый поддомен и удалить старый.

#### Шаг 1: Добавить A-запись в панели DNS-регистратора

| Тип | Имя | Значение | TTL |
|:----|:----|:---------|:----|
| A | docs | `<IP VPS Timeweb>` | 300 |

#### Шаг 2: Удалить старую CNAME-запись (после приёмки)

| Действие | Тип | Имя | Текущее значение |
|:---------|:----|:----|:-----------------|
| Удалить | CNAME | doc | `cname.mintlify-dns.com` |

#### Шаг 3: Проверка DNS-пропагации

```
Промпт для Claude Code:

Проверь DNS-резолвинг для docs.adolf.su:

1. Проверка A-записи:
   dig docs.adolf.su A +short
   # Ожидаемый результат: <IP VPS>

2. Проверка через публичные DNS:
   dig @8.8.8.8 docs.adolf.su A +short
   dig @1.1.1.1 docs.adolf.su A +short

3. Проверка HTTP-доступности:
   curl -sI http://docs.adolf.su | head -5
   # Ожидаемый результат: 301 → https://docs.adolf.su

4. Если пропагация не завершена (TTL=300 → до 5 минут):
   # Подождать и повторить. Для ускорения можно добавить
   # временную запись в /etc/hosts на VPS:
   echo "<IP VPS> docs.adolf.su" >> /etc/hosts
```

### 4.2 Настройка DNS-регистратора (Timeweb)

Если домен `adolf.su` управляется через Timeweb:

```
Промпт для Claude Code:

1. Войти в панель Timeweb → Домены → adolf.su → DNS-записи.

2. Добавить запись:
   Тип: A
   Поддомен: docs
   Значение: <IP VPS>
   TTL: 300

3. Проверить, что нет конфликтующих записей:
   - Не должно быть CNAME для "docs" (конфликтует с A-записью)
   - Не должно быть wildcard (*) CNAME, который перехватит "docs"

4. Сохранить и подождать 5-10 минут для пропагации.
```

### 4.3 Nginx — виртуальный хост для поддомена

Nginx на VPS уже обслуживает `adolf.su` (Open WebUI). Поддомен `docs.adolf.su` настраивается отдельным server-блоком.

```mermaid
flowchart TB
    CLIENT["Браузер"] -->|HTTPS| NGINX["Nginx :443"]
    
    NGINX -->|server_name adolf.su| OWUI["Open WebUI :8080"]
    NGINX -->|server_name docs.adolf.su| STATIC["Static /var/www/docs"]
```

---

## 5. Маппинг Mintlify → VitePress

### 5.1 Frontmatter

Mintlify frontmatter сохраняется без изменений. VitePress также использует YAML frontmatter. Поле `mode: "wide"` игнорируется VitePress — для wide layout используется `layout: doc` + CSS-переопределение.

```yaml
# Было (Mintlify) — остаётся как есть
---
title: "Раздел 1: Архитектура"
description: "Модуль Core v4.0 — описание архитектуры"
mode: "wide"
---
```

### 5.2 Компоненты

| Mintlify | VitePress | Метод |
|:---------|:----------|:------|
| `<Note>` | `:::info` | Custom container |
| `<Warning>` | `:::warning` | Custom container |
| `<Info>` | `:::info` | Custom container |
| `<Tip>` | `:::tip` | Custom container |
| `<Check>` | `:::tip ✅` | Custom container |
| `<Steps>/<Step>` | Нумерованный список или Vue-компонент | Миграционный скрипт |
| `<Tabs>/<Tab>` | `vitepress-plugin-tabs` | Плагин |
| `<Accordion>` | `<details><summary>` | Нативный HTML |
| `<Card>` | Vue-компонент `VPCard` | Кастомный компонент |
| `<Columns>` | CSS Grid wrapper | Кастомный компонент |
| `<CodeGroup>` | VitePress code groups | Нативная поддержка |
| `<Frame>` | `<figure>` с CSS | Кастомный компонент |
| Mermaid | `vitepress-plugin-mermaid` | Плагин (синтаксис тот же) |

### 5.3 Навигация

Mintlify `docs.json` трансформируется в VitePress `config.ts`:

```
docs.json tabs[]          → config.ts nav[]
docs.json groups[]        → config.ts sidebar{}
docs.json groups[].pages  → config.ts sidebar[].items[]
docs.json anchors[]       → config.ts nav[] (правая часть)
```

### 5.4 Ссылки

Mintlify: `/core/adolf_core_0_introduction` (без расширения)
VitePress: `/core/adolf_core_0_introduction` (без расширения — совместимо, изменения не нужны)

### 5.5 MDX-экранирование

В VitePress **не нужно** экранировать `{` и `<` вне code-блоков (MDX-парсер не используется). Однако обратная очистка `\{` → `{` опциональна — VitePress корректно рендерит оба варианта.

---

## 6. Структура проекта

```
docs/                              # Корень VitePress проекта
├── .vitepress/
│   ├── config.ts                  # Конфигурация VitePress
│   ├── theme/
│   │   ├── index.ts               # Кастомная тема (extends default)
│   │   ├── style.css              # Переопределения стилей
│   │   └── components/
│   │       ├── VPCard.vue         # Компонент Card
│   │       ├── VPColumns.vue      # Компонент Columns
│   │       └── VPFrame.vue        # Компонент Frame
│   └── cache/                     # Build cache (в .gitignore)
├── public/
│   ├── logo/
│   │   ├── light.svg
│   │   └── dark.svg
│   └── favicon.svg
├── index.md                       # Главная страница
├── ADOLF_OVERVIEW.md
├── adolf_fastapi_reference.md
├── core/
│   ├── adolf_core_0_introduction.md
│   ├── adolf_core_1_1_open_webui_overview.md
│   └── ...
├── knowledge/
├── reputation/
├── watcher/
├── content_factory/
├── marketing/
├── scout/
├── cfo/
├── lex/
├── office/
├── shop/
└── logistic/
```

---

## 7. Конфигурация VitePress

### 7.1 config.ts (скелет)

```typescript
import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

export default withMermaid(
  defineConfig({
    title: 'ADOLF Platform',
    description: 'AI-Driven Operations Layer Framework',
    lang: 'ru-RU',
    
    head: [
      ['link', { rel: 'icon', href: '/favicon.svg' }],
      ['meta', { property: 'og:locale', content: 'ru_RU' }],
      ['meta', { property: 'og:site_name', content: 'ADOLF Platform Documentation' }],
    ],

    themeConfig: {
      logo: {
        light: '/logo/light.svg',
        dark: '/logo/dark.svg',
      },
      siteTitle: 'ADOLF Platform',

      // --- Навигация (из docs.json tabs + anchors) ---
      nav: [
        { text: 'Overview', link: '/' },
        { text: 'Core', link: '/core/adolf_core_0_introduction' },
        { text: 'Knowledge', link: '/knowledge/adolf_knowledge_1_introduction' },
        { text: 'Logistic', link: '/logistic/adolf_logistic_0_introduction' },
        { text: 'Content', link: '/content_factory/adolf_content_factory_0_introduction' },
        { text: 'CFO', link: '/cfo/adolf_cfo_0_introduction' },
        { text: 'Reputation', link: '/reputation/adolf_reputation_0_introduction' },
        { text: 'Watcher', link: '/watcher/adolf_watcher_0_introduction' },
        { text: 'Marketing', link: '/marketing/adolf_marketing_0_introduction' },
        { text: 'Scout', link: '/scout/adolf_scout_0_introduction' },
        { text: 'Lex', link: '/lex/adolf_lex_0_introduction' },
        { text: 'Office', link: '/office/adolf_office_0_introduction' },
        { text: 'Shop', link: '/shop/adolf_shop_0_introduction' },
      ],

      // --- Sidebar (из docs.json groups → pages) ---
      sidebar: {
        '/core/': [
          {
            text: 'Introduction',
            items: [
              { text: 'Обзор модуля', link: '/core/adolf_core_0_introduction' },
            ]
          },
          {
            text: 'Open WebUI',
            items: [
              { text: 'Overview', link: '/core/adolf_core_1_1_open_webui_overview' },
              { text: 'Pipelines', link: '/core/adolf_core_1_2_open_webui_pipelines' },
              { text: 'Tools', link: '/core/adolf_core_1_3_open_webui_tools' },
              { text: 'PWA & Auth', link: '/core/adolf_core_1_4_open_webui_pwa_auth' },
            ]
          },
          {
            text: 'Infrastructure',
            items: [
              { text: 'PostgreSQL', link: '/core/adolf_core_2_5_postgresql' },
              { text: 'Notifications', link: '/core/adolf_core_2_6_notifications' },
              { text: 'Launcher', link: '/core/adolf_core_3_1_launcher' },
            ]
          }
        ],
        // ... аналогично для остальных 11 модулей
        // (полная конфигурация генерируется миграционным скриптом)
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/Sign25/Docs' }
      ],

      search: {
        provider: 'local',
        options: {
          locales: {
            root: {
              translations: {
                button: { buttonText: 'Поиск', buttonAriaLabel: 'Поиск' },
                modal: {
                  noResultsText: 'Нет результатов',
                  resetButtonTitle: 'Сбросить',
                  footer: { selectText: 'выбрать', navigateText: 'навигация' }
                }
              }
            }
          }
        }
      },

      footer: {
        message: 'ADOLF Platform Documentation',
        copyright: '© 2026 Ohana'
      },

      outline: { level: [2, 3], label: 'Содержание' },
      
      lastUpdated: {
        text: 'Обновлено',
        formatOptions: { dateStyle: 'short' }
      },
    },

    markdown: {
      config(md) {
        md.use(tabsMarkdownPlugin)
      },
      lineNumbers: true,
    },

    mermaid: {
      theme: 'default',
    },

    vite: {
      ssr: {
        noExternal: ['vitepress-plugin-tabs']
      }
    }
  })
)
```

### 7.2 Кастомная тема

```typescript
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import './style.css'
import VPCard from './components/VPCard.vue'
import VPColumns from './components/VPColumns.vue'
import VPFrame from './components/VPFrame.vue'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    enhanceAppWithTabs(app)
    app.component('Card', VPCard)
    app.component('Columns', VPColumns)
    app.component('Frame', VPFrame)
  }
}
```

---

## 8. Миграционный скрипт

Автоматизирует преобразование 113 файлов. Запускается однократно.

### 8.1 Задачи скрипта

1. Преобразовать Mintlify-компоненты в VitePress-аналоги
2. Сгенерировать `config.ts` sidebar из `docs.json`
3. Переместить ассеты в `public/`
4. Опционально: удалить MDX-экранирование (`\{` → `{`, `\<` → `<`)

### 8.2 Промпт для Claude Code

```
Контекст: Репозиторий Sign25/Docs содержит 113 .md файлов документации
в формате Mintlify. Нужно мигрировать на VitePress 2.x.

Задача: Написать Python-скрипт migrate_mintlify_to_vitepress.py, который:

1. Читает docs.json и генерирует sidebar-конфигурацию для VitePress
   config.ts (TypeScript объект).

2. Для каждого .md файла в репозитории выполняет замены:
   - <Note>...</Note>        → :::info\n...\n:::
   - <Warning>...</Warning>  → :::warning\n...\n:::  
   - <Info>...</Info>        → :::info\n...\n:::
   - <Tip>...</Tip>          → :::tip\n...\n:::
   - <Check>...</Check>      → :::tip ✅\n...\n:::
   - <Steps><Step title="X">...</Step></Steps> 
     → нумерованный список с ### заголовками
   - <Tabs><Tab title="X">...</Tab></Tabs>
     → :::tabs\n== X\n...\n:::  (формат vitepress-plugin-tabs)
   - <Accordion title="X">...</Accordion>  
     → <details><summary>X</summary>\n...\n</details>
   - <AccordionGroup>...</AccordionGroup> → убрать обёртку
   - <CodeGroup>...</CodeGroup> → VitePress code groups 
     (заменить обёртку на ::: code-group)
   - <Frame>...</Frame> → <figure class="frame">...</figure>
   - <Card> и <Columns> → оставить как есть (Vue-компоненты)

3. Сохраняет frontmatter без изменений.

4. НЕ трогает содержимое code-блоков и inline-код.

5. Перемещает /logo/ и favicon.svg в public/.

6. Создаёт .vitepress/config.ts с полной sidebar-конфигурацией.

7. Выводит отчёт: количество обработанных файлов, замен по типам.

Требования:
- Python 3.10+, без внешних зависимостей (только stdlib + re)
- Regex-замены должны корректно обрабатывать multiline-контент
- Не модифицировать содержимое ```mermaid блоков
```

---

## 9. Развёртывание на VPS

### 9.1 Предварительные требования

- Ubuntu 24.04 на VPS Timeweb Cloud
- Домен `adolf.su` с доступом к DNS-записям
- SSH-доступ (root или sudo)
- GitHub PAT для клонирования репозитория
- Nginx уже установлен и обслуживает `adolf.su`

### 9.2 Промпт для Claude Code — установка окружения

```
Подключись к VPS по SSH и выполни настройку для VitePress:

1. Установи Node.js 20 LTS (если не установлен):
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
   source ~/.bashrc
   nvm install 20
   nvm alias default 20

2. Установи PM2 глобально:
   npm install -g pm2

3. Создай директории:
   mkdir -p /var/www/docs
   mkdir -p /opt/docs-builder

4. Клонируй репозиторий:
   cd /opt/docs-builder
   git clone https://<PAT>@github.com/Sign25/Docs.git docs
   cd docs

5. Установи зависимости VitePress 2.x:
   npm init -y
   npm install vitepress@next vitepress-plugin-mermaid vitepress-plugin-tabs

6. Выполни первую сборку:
   npx vitepress build
   cp -r .vitepress/dist/* /var/www/docs/

7. Проверь что /var/www/docs/index.html существует.
```

### 9.3 Nginx — конфигурация docs.adolf.su

Создаётся как отдельный server-блок, не затрагивая существующий `adolf.su`.

```nginx
# /etc/nginx/sites-available/docs.adolf.su

server {
    listen 80;
    server_name docs.adolf.su;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name docs.adolf.su;

    # SSL (Let's Encrypt — отдельный сертификат для поддомена)
    ssl_certificate /etc/letsencrypt/live/docs.adolf.su/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/docs.adolf.su/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript
               text/xml application/xml text/javascript image/svg+xml;

    # Статика VitePress
    root /var/www/docs;
    index index.html;

    # SPA fallback — VitePress генерирует .html для каждого маршрута
    location / {
        try_files $uri $uri.html $uri/ /404.html;
    }

    # Кэширование ассетов (хэшированные имена — immutable)
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Кэширование изображений и шрифтов
    location ~* \.(svg|png|jpg|jpeg|webp|woff2|woff)$ {
        expires 30d;
        add_header Cache-Control "public";
    }

    # Webhook для автодеплоя
    location /webhook {
        proxy_pass http://127.0.0.1:9000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Запрет доступа к служебным файлам
    location ~ /\. {
        deny all;
    }
}
```

### 9.4 Промпт для Claude Code — активация Nginx

```
Настрой Nginx для обслуживания docs.adolf.su:

1. Создай конфигурацию:
   nano /etc/nginx/sites-available/docs.adolf.su
   # Вставить конфигурацию из раздела 9.3 ТЗ

2. Включи сайт:
   ln -s /etc/nginx/sites-available/docs.adolf.su /etc/nginx/sites-enabled/

3. Проверь конфигурацию:
   nginx -t
   # Ожидаемый результат: syntax is ok, test is successful

4. Перезагрузи Nginx:
   systemctl reload nginx

5. Убедись что существующий adolf.su не затронут:
   curl -sI https://adolf.su | head -3
   # Должен вернуть HTTP/2 200

6. Проверь что docs.adolf.su отвечает (до SSL — только HTTP):
   curl -sI http://docs.adolf.su | head -3
   # Должен вернуть 301 → https (после получения SSL)
   # или 200 (если SSL ещё не настроен, временно убрать редирект)
```

### 9.5 SSL-сертификат для поддомена

```
Промпт для Claude Code:

Получи SSL-сертификат Let's Encrypt для docs.adolf.su:

1. Убедись что DNS A-запись docs.adolf.su указывает на IP VPS:
   dig docs.adolf.su A +short

2. Получи сертификат (Nginx уже настроен):
   certbot --nginx -d docs.adolf.su --non-interactive --agree-tos -m admin@adolf.su

3. Проверь автообновление:
   certbot renew --dry-run

4. Проверь что сертификат получен:
   ls -la /etc/letsencrypt/live/docs.adolf.su/

5. Проверь HTTPS:
   curl -sI https://docs.adolf.su | head -5
   # Ожидаемый результат: HTTP/2 200

6. Альтернатива — SAN-сертификат (если adolf.su уже имеет сертификат):
   certbot --nginx -d adolf.su -d docs.adolf.su --expand
   # Это добавит docs.adolf.su к существующему сертификату
```

### 9.6 Webhook автодеплоя

```
Промпт для Claude Code:

Создай webhook-listener для автодеплоя VitePress при push в GitHub:

1. Создай файл /opt/docs-builder/webhook.js:
   - Слушает POST на порту 9000 (только 127.0.0.1)
   - Проверяет X-Hub-Signature-256 (secret: сгенерировать)
   - При валидном запросе выполняет deploy.sh
   - Логирует в /var/log/docs-deploy.log

2. Создай файл /opt/docs-builder/deploy.sh:
   #!/bin/bash
   set -e
   LOCK="/tmp/docs-deploy.lock"
   
   # Защита от параллельных запусков
   exec 200>"$LOCK"
   flock -n 200 || { echo "Deploy already running"; exit 1; }
   
   cd /opt/docs-builder/docs
   git pull origin main
   npm install
   npx vitepress build
   rsync -a --delete .vitepress/dist/ /var/www/docs/
   echo "$(date): Deploy successful" >> /var/log/docs-deploy.log

3. Настрой PM2:
   pm2 start /opt/docs-builder/webhook.js --name docs-webhook
   pm2 save
   pm2 startup

4. Настрой GitHub Webhook:
   URL: https://docs.adolf.su/webhook
   Content type: application/json
   Secret: <сгенерированный>
   Events: push (только ветка main)
```

---

## 10. План выполнения

```mermaid
gantt
    title Миграция Mintlify → VitePress 2.x
    dateFormat YYYY-MM-DD
    axisFormat %d.%m
    
    section Подготовка
    DNS запись docs.adolf.su          :a0, 2026-02-08, 1d
    Миграционный скрипт              :a1, 2026-02-08, 1d
    Запуск миграции файлов           :a2, after a1, 1d
    
    section VitePress
    Конфигурация config.ts           :b1, after a2, 1d
    Кастомные Vue-компоненты         :b2, after b1, 1d
    Локальная проверка сборки        :b3, after b2, 1d
    
    section VPS
    Установка Node.js + зависимости  :c1, after b3, 1d
    Nginx vhost + SSL                :c2, after c1, 1d
    Первый деплой                    :c3, after c2, 1d
    
    section CI/CD
    Webhook автодеплоя               :d1, after c3, 1d
    
    section Финализация
    Проверка из РФ                   :e1, after d1, 1d
    Удаление Mintlify-конфига        :e2, after e1, 1d
```

Ориентировочный срок: 7–10 рабочих дней.

---

## 11. Чек-лист приёмки

- [ ] DNS: `dig docs.adolf.su A` возвращает IP VPS
- [ ] `https://docs.adolf.su` открывается из РФ без VPN
- [ ] SSL-сертификат валиден (`certbot certificates`)
- [ ] Все 12 модулей отображаются в навигации
- [ ] Все 113 страниц рендерятся без ошибок
- [ ] Mermaid-диаграммы рендерятся корректно
- [ ] Полнотекстовый поиск работает (на русском)
- [ ] Мобильная версия адаптивна
- [ ] Автодеплой срабатывает при push в `main`
- [ ] `adolf.su` (Open WebUI) не затронут — работает штатно
- [ ] Время сборки < 60 секунд
- [ ] Lighthouse Performance > 90

---

## 12. Откат

В случае проблем:

1. Nginx: отключить vhost `docs.adolf.su`, перезагрузить
2. DNS: вернуть CNAME `doc.adolf.su` → `cname.mintlify-dns.com` (доступно только через VPN)
3. Mintlify-конфигурация (`docs.json`) сохраняется в репозитории до полной приёмки
4. Файлы `.md` обратно совместимы — Mintlify frontmatter не удаляется
5. `adolf.su` не затронут ни при каких сценариях

---

## 13. Файлы для удаления после миграции

После успешной приёмки удалить из репозитория:

| Файл | Причина |
|:-----|:--------|
| `docs.json` | Конфигурация Mintlify, заменена на `.vitepress/config.ts` |
| `.mintignore` | Специфичен для Mintlify |
| `config/mintlify_standards.md` | Стандарт заменяется на `config/vitepress_standards.md` |

---

## 14. Безопасность

| Мера | Реализация |
|:-----|:-----------|
| HTTPS | Let's Encrypt, автообновление через certbot timer |
| Webhook secret | HMAC SHA-256 подпись GitHub |
| Firewall | UFW: 22, 80, 443 (порт 9000 только localhost) |
| Git credentials | PAT в переменной окружения, не в коде |
| Webhook listener | Привязан к 127.0.0.1:9000, проксируется через Nginx |
| Изоляция | Отдельный vhost, не влияет на adolf.su |

---

Версия документа: 1.1

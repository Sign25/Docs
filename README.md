# 🏢 Adolf Ohana Market - Open WebUI Integration

## 📋 Описание проекта

Кастомная установка Open WebUI, интегрированная с внутренними системами компании Adolf для управления репутацией на маркетплейсах (Wildberries, Ozon, Yandex Market).

### Основные компоненты:

- **Open WebUI** - фронтенд для работы с AI агентами
- **Reputation Module** - система управления отзывами и вопросами покупателей
- **AI Agent @Adolf_Reputation** - интеллектуальный ассистент для менеджеров

---

## 🎯 Назначение

Система предоставляет единый интерфейс для:
- ✅ Управления отзывами с маркетплейсов
- 🤖 AI-анализа тональности и генерации ответов
- 📊 Статистики и аналитики по отзывам
- 👥 Контроля доступа по брендам и ролям
- 🔔 Уведомлений о новых отзывах

---

## 🏗️ Архитектура

```
┌─────────────────────────────────────────────────────┐
│           Open WebUI Frontend (SvelteKit)           │
│  • Чат с AI агентами                                │
│  • Интерфейс управления моделями                    │
│  • Файловая система                                 │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│        Open WebUI Backend (FastAPI + SQLite)        │
│  • Function Calling (Tools)                         │
│  • Роли и группы пользователей                      │
│  • Pipelines для обработки запросов                 │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP/REST
┌──────────────────▼──────────────────────────────────┐
│         External Reputation API (Adolf)             │
│  • База отзывов с маркетплейсов                     │
│  • AI-движок для генерации ответов                  │
│  • Интеграция с WB/Ozon/YM API                      │
└─────────────────────────────────────────────────────┘
```

---

## 👥 Система ролей и доступа

### Группы пользователей:

| Группа | Доступ к агенту | Ограничения | Функции |
|--------|----------------|-------------|---------|
| **Staff** | ❌ | Нет доступа к @Adolf_Reputation | - |
| **Managers** | ✅ | Только свой `brand_id` | Утверждение ответов |
| **Senior** | ✅ | Все бренды | + Эскалация |
| **Directors** | ✅ | Все бренды | + Статистика |
| **Administrators** | ✅ | Полный доступ | + Настройка системы |

### Маппинг с Open WebUI:

```
Open WebUI Role  →  Adolf Group        →  Permissions
─────────────────────────────────────────────────────
pending          →  (регистрация)     →  Нет доступа
user             →  Reputation Staff  →  Нет агента
user             →  Reputation Managers →  brand_id filter
user             →  Reputation Senior →  access_all_brands
user             →  Reputation Directors → + analytics
admin            →  (встроенная)      →  Полный доступ
```

---

## 🤖 AI Агент @Adolf_Reputation

### Возможности:
- 📋 Показать список отзывов и вопросов
- 🔍 Детальный просмотр с AI-анализом
- ✅ Утверждение/редактирование ответов
- 🔄 Перегенерация с инструкциями
- 📊 Статистика по периодам
- ⚡ Массовые операции

### Технические детали:
- **Model**: GPT-4 / Claude / Llama
- **Temperature**: 0.3 (для консистентности)
- **System Prompt**: Специализированный промпт для работы с отзывами
- **Tools**: 9 функций для работы с Reputation API

---

## 🛠️ Function Calling Tools

Агент имеет доступ к следующим инструментам:

1. `get_pending_items` - Список ожидающих обработки
2. `get_item_details` - Детали отзыва с AI-анализом
3. `approve_response` - Утвердить сгенерированный ответ
4. `edit_and_approve` - Отредактировать и утвердить
5. `regenerate_response` - Перегенерировать с указаниями
6. `skip_item` - Пропустить (не отвечать)
7. `escalate_item` - Эскалировать руководству
8. `bulk_approve` - Массовое утверждение
9. `get_stats` - Статистика по отзывам

---

## 📦 Установка и запуск

Подробная инструкция в файле [ЗАПУСК.md](ЗАПУСК.md)

### Быстрый старт:

```bash
# Frontend (корень проекта)
npm run dev -- --port 5174

# Backend (из папки backend)
cd backend
.\venv\Scripts\activate
python -m uvicorn open_webui.main:app --host 0.0.0.0 --port 8080
```

---

## 📁 Структура проекта

```
openWebUI_test/
├── backend/
│   ├── open_webui/
│   │   ├── tools/              # Function Calling функции
│   │   │   └── reputation_tools.py
│   │   ├── models/             # Модели БД
│   │   ├── routers/            # API endpoints
│   │   └── pipelines/          # Middleware
│   └── data/                   # SQLite БД
├── src/
│   ├── routes/(app)/
│   │   ├── files/              # Файловый менеджер
│   │   └── workspace/          # Модели, промпты, tools
│   └── lib/components/         # UI компоненты
├── import_files_from_frontend/ # Загруженные файлы
└── ЗАПУСК.md                   # Инструкции
```

---

## 🔐 Безопасность

- ✅ Изоляция по `brand_id` на уровне API запросов
- ✅ Проверка прав в каждой Tool функции
- ✅ JWT токены для авторизации
- ✅ Логирование всех действий
- ✅ Rate limiting для API

---

## 📚 Документация

- [Полное ТЗ Reputation Module](https://wiki.adolf.su/link/28)
- [Open WebUI Docs](https://docs.openwebui.com/)
- [Function Calling Guide](https://docs.openwebui.com/features/plugin/)

---

## 🔗 Связанные репозитории

- **Reputation API Backend** - (ссылка на репо)
- **Adolf Internal Wiki** - https://wiki.adolf.su

---

## 👨‍💻 Разработка

**Версия**: 2.1  
**Статус**: Согласовано  
**Дата**: Январь 2026  

---

## ⚙️ Конфигурация

### Переменные окружения:

```bash
# Reputation API
REPUTATION_API_URL=http://reputation-api:8000
REPUTATION_API_KEY=your-secret-key

# Open WebUI
DATABASE_URL=sqlite:///./backend/data/webui.db
DEFAULT_USER_ROLE=pending
```

---

---

## Original Open WebUI Features

Open WebUI is an extensible, feature-rich, and user-friendly self-hosted AI platform.

For more information about base Open WebUI features, check out [Open WebUI Documentation](https://docs.openwebui.com/).

---

## 📄 License

MIT License - see original Open WebUI project for details.


- 🔍 **Web Search for RAG**: Perform web searches using 15+ providers including `SearXNG`, `Google PSE`, `Brave Search`, `Kagi`, `Mojeek`, `Tavily`, `Perplexity`, `serpstack`, `serper`, `Serply`, `DuckDuckGo`, `SearchApi`, `SerpApi`, `Bing`, `Jina`, `Exa`, `Sougou`, `Azure AI Search`, and `Ollama Cloud`, injecting results directly into your chat experience.

- 🌐 **Web Browsing Capability**: Seamlessly integrate websites into your chat experience using the `#` command followed by a URL. This feature allows you to incorporate web content directly into your conversations, enhancing the richness and depth of your interactions.

- 🎨 **Image Generation & Editing Integration**: Create and edit images using multiple engines including OpenAI's DALL-E, Gemini, ComfyUI (local), and AUTOMATIC1111 (local), with support for both generation and prompt-based editing workflows.

- ⚙️ **Many Models Conversations**: Effortlessly engage with various models simultaneously, harnessing their unique strengths for optimal responses. Enhance your experience by leveraging a diverse set of models in parallel.

- 🔐 **Role-Based Access Control (RBAC)**: Ensure secure access with restricted permissions; only authorized individuals can access your Ollama, and exclusive model creation/pulling rights are reserved for administrators.

- 🗄️ **Flexible Database & Storage Options**: Choose from SQLite (with optional encryption), PostgreSQL, or configure cloud storage backends (S3, Google Cloud Storage, Azure Blob Storage) for scalable deployments.

- 🔍 **Advanced Vector Database Support**: Select from 9 vector database options including ChromaDB, PGVector, Qdrant, Milvus, Elasticsearch, OpenSearch, Pinecone, S3Vector, and Oracle 23ai for optimal RAG performance.

- 🔐 **Enterprise Authentication**: Full support for LDAP/Active Directory integration, SCIM 2.0 automated provisioning, and SSO via trusted headers alongside OAuth providers. Enterprise-grade user and group provisioning through SCIM 2.0 protocol, enabling seamless integration with identity providers like Okta, Azure AD, and Google Workspace for automated user lifecycle management.

- ☁️ **Cloud-Native Integration**: Native support for Google Drive and OneDrive/SharePoint file picking, enabling seamless document import from enterprise cloud storage.

- 📊 **Production Observability**: Built-in OpenTelemetry support for traces, metrics, and logs, enabling comprehensive monitoring with your existing observability stack.

- ⚖️ **Horizontal Scalability**: Redis-backed session management and WebSocket support for multi-worker and multi-node deployments behind load balancers.

- 🌐🌍 **Multilingual Support**: Experience Open WebUI in your preferred language with our internationalization (i18n) support. Join us in expanding our supported languages! We're actively seeking contributors!

- 🧩 **Pipelines, Open WebUI Plugin Support**: Seamlessly integrate custom logic and Python libraries into Open WebUI using [Pipelines Plugin Framework](https://github.com/open-webui/pipelines). Launch your Pipelines instance, set the OpenAI URL to the Pipelines URL, and explore endless possibilities. [Examples](https://github.com/open-webui/pipelines/tree/main/examples) include **Function Calling**, User **Rate Limiting** to control access, **Usage Monitoring** with tools like Langfuse, **Live Translation with LibreTranslate** for multilingual support, **Toxic Message Filtering** and much more.

- 🌟 **Continuous Updates**: We are committed to improving Open WebUI with regular updates, fixes, and new features.

Want to learn more about Open WebUI's features? Check out our [Open WebUI documentation](https://docs.openwebui.com/features) for a comprehensive overview!

---

## How to Install 🚀

### Installation via Python pip 🐍

Open WebUI can be installed using pip, the Python package installer. Before proceeding, ensure you're using **Python 3.11** to avoid compatibility issues.

1. **Install Open WebUI**:
   Open your terminal and run the following command to install Open WebUI:

   ```bash
   pip install open-webui
   ```

2. **Running Open WebUI**:
   After installation, you can start Open WebUI by executing:

   ```bash
   open-webui serve
   ```

This will start the Open WebUI server, which you can access at [http://localhost:8080](http://localhost:8080)

### Quick Start with Docker 🐳

> [!NOTE]  
> Please note that for certain Docker environments, additional configurations might be needed. If you encounter any connection issues, our detailed guide on [Open WebUI Documentation](https://docs.openwebui.com/) is ready to assist you.

> [!WARNING]
> When using Docker to install Open WebUI, make sure to include the `-v open-webui:/app/backend/data` in your Docker command. This step is crucial as it ensures your database is properly mounted and prevents any loss of data.

> [!TIP]  
> If you wish to utilize Open WebUI with Ollama included or CUDA acceleration, we recommend utilizing our official images tagged with either `:cuda` or `:ollama`. To enable CUDA, you must install the [Nvidia CUDA container toolkit](https://docs.nvidia.com/dgx/nvidia-container-runtime-upgrade/) on your Linux/WSL system.

### Installation with Default Configuration

- **If Ollama is on your computer**, use this command:

  ```bash
  docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
  ```

- **If Ollama is on a Different Server**, use this command:

  To connect to Ollama on another server, change the `OLLAMA_BASE_URL` to the server's URL:

  ```bash
  docker run -d -p 3000:8080 -e OLLAMA_BASE_URL=https://example.com -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
  ```

- **To run Open WebUI with Nvidia GPU support**, use this command:

  ```bash
  docker run -d -p 3000:8080 --gpus all --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:cuda
  ```

### Installation for OpenAI API Usage Only

- **If you're only using OpenAI API**, use this command:

  ```bash
  docker run -d -p 3000:8080 -e OPENAI_API_KEY=your_secret_key -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
  ```

### Installing Open WebUI with Bundled Ollama Support

This installation method uses a single container image that bundles Open WebUI with Ollama, allowing for a streamlined setup via a single command. Choose the appropriate command based on your hardware setup:

- **With GPU Support**:
  Utilize GPU resources by running the following command:

  ```bash
  docker run -d -p 3000:8080 --gpus=all -v ollama:/root/.ollama -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:ollama
  ```

- **For CPU Only**:
  If you're not using a GPU, use this command instead:

  ```bash
  docker run -d -p 3000:8080 -v ollama:/root/.ollama -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:ollama
  ```

Both commands facilitate a built-in, hassle-free installation of both Open WebUI and Ollama, ensuring that you can get everything up and running swiftly.

After installation, you can access Open WebUI at [http://localhost:3000](http://localhost:3000). Enjoy! 😄

### Other Installation Methods

We offer various installation alternatives, including non-Docker native installation methods, Docker Compose, Kustomize, and Helm. Visit our [Open WebUI Documentation](https://docs.openwebui.com/getting-started/) or join our [Discord community](https://discord.gg/5rJgQTnV4s) for comprehensive guidance.

Look at the [Local Development Guide](https://docs.openwebui.com/getting-started/advanced-topics/development) for instructions on setting up a local development environment.

### Troubleshooting

Encountering connection issues? Our [Open WebUI Documentation](https://docs.openwebui.com/troubleshooting/) has got you covered. For further assistance and to join our vibrant community, visit the [Open WebUI Discord](https://discord.gg/5rJgQTnV4s).

#### Open WebUI: Server Connection Error

If you're experiencing connection issues, it’s often due to the WebUI docker container not being able to reach the Ollama server at 127.0.0.1:11434 (host.docker.internal:11434) inside the container . Use the `--network=host` flag in your docker command to resolve this. Note that the port changes from 3000 to 8080, resulting in the link: `http://localhost:8080`.

**Example Docker Command**:

```bash
docker run -d --network=host -v open-webui:/app/backend/data -e OLLAMA_BASE_URL=http://127.0.0.1:11434 --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

### Keeping Your Docker Installation Up-to-Date

Check our Updating Guide available in our [Open WebUI Documentation](https://docs.openwebui.com/getting-started/updating).

### Using the Dev Branch 🌙

> [!WARNING]
> The `:dev` branch contains the latest unstable features and changes. Use it at your own risk as it may have bugs or incomplete features.

If you want to try out the latest bleeding-edge features and are okay with occasional instability, you can use the `:dev` tag like this:

```bash
docker run -d -p 3000:8080 -v open-webui:/app/backend/data --name open-webui --add-host=host.docker.internal:host-gateway --restart always ghcr.io/open-webui/open-webui:dev
```

### Offline Mode

If you are running Open WebUI in an offline environment, you can set the `HF_HUB_OFFLINE` environment variable to `1` to prevent attempts to download models from the internet.

```bash
export HF_HUB_OFFLINE=1
```

## What's Next? 🌟

Discover upcoming features on our roadmap in the [Open WebUI Documentation](https://docs.openwebui.com/roadmap/).

## License 📜

This project contains code under multiple licenses. The current codebase includes components licensed under the Open WebUI License with an additional requirement to preserve the "Open WebUI" branding, as well as prior contributions under their respective original licenses. For a detailed record of license changes and the applicable terms for each section of the code, please refer to [LICENSE_HISTORY](./LICENSE_HISTORY). For complete and updated licensing details, please see the [LICENSE](./LICENSE) and [LICENSE_HISTORY](./LICENSE_HISTORY) files.

## Support 💬

If you have any questions, suggestions, or need assistance, please open an issue or join our
[Open WebUI Discord community](https://discord.gg/5rJgQTnV4s) to connect with us! 🤝

## Star History

<a href="https://star-history.com/#open-webui/open-webui&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=open-webui/open-webui&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=open-webui/open-webui&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=open-webui/open-webui&type=Date" />
  </picture>
</a>

---

Created by [Timothy Jaeryang Baek](https://github.com/tjbck) - Let's make Open WebUI even more amazing together! 💪

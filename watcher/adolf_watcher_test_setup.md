---
title: "Watcher v3.0: Тестовая сборка агента"
description: "Пошаговая инструкция по настройке и проверке работоспособности"
version: "0.1"
date: "Февраль 2026"
---

## Цель

Проверить работоспособность связки **Claude Code CLI + agent-browser** на Windows 10 для автоматизированного сбора данных с карточек товаров Wildberries. Тестовый сценарий: 5 артикулов, поиск через строку WB, сбор данных, сохранение в локальный JSON.

## Требования

| Компонент | Требование |
|-----------|------------|
| ОС | Windows 10 (build 1809+) |
| RAM | 8 GB (минимум), 16 GB (рекомендуется) |
| Подписка | Claude Max 5x |
| Браузер | Google Chrome (менеджер авторизован на WB) |
| Сеть | Стабильное интернет-соединение |

## Шаг 1: Установка Claude Code CLI

Открыть **PowerShell** (не от администратора) и выполнить:

```powershell
# Установка через нативный инсталлятор (Node.js не требуется)
irm https://claude.ai/install.ps1 | iex
```

Проверка:

```powershell
claude --version
```

Авторизация:

```powershell
claude
# Откроется браузер для OAuth авторизации через Claude Max аккаунт
# После авторизации закрыть Claude Code (Ctrl+C)
```

Диагностика (при проблемах):

```powershell
claude doctor
```

## Шаг 2: Установка agent-browser

```powershell
# Установка глобально через npm
npm install -g agent-browser

# Загрузка Chromium
agent-browser install
```

Проверка (standalone, без CDP):

```powershell
# Открыть тестовую страницу в headed-режиме
agent-browser open https://www.wildberries.ru --headed

# Получить snapshot
agent-browser snapshot -i

# Закрыть
agent-browser close
```

\{/* Если npm недоступен, установить Node.js 18+ с https://nodejs.org */\}

## Шаг 3: Установка Claude Code Skill для agent-browser

```powershell
# Создать директорию для skills
mkdir -Force "$HOME\.claude\skills\agent-browser"

# Скачать skill
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/vercel-labs/agent-browser/main/skills/agent-browser/SKILL.md" -OutFile "$HOME\.claude\skills\agent-browser\SKILL.md"
```

## Шаг 4: Подготовка рабочей директории проекта

```powershell
# Создать директорию проекта
mkdir -Force C:\watcher-test
cd C:\watcher-test
```

### 4.1 Тестовые артикулы

Создать файл `test_articles.json`:

```json
{
  "marketplace": "wildberries",
  "articles": [
    {"sku": "12345678", "name": "Тестовый товар 1"},
    {"sku": "23456789", "name": "Тестовый товар 2"},
    {"sku": "34567890", "name": "Тестовый товар 3"},
    {"sku": "45678901", "name": "Тестовый товар 4"},
    {"sku": "56789012", "name": "Тестовый товар 5"}
  ]
}
```

\{/* Замените артикулы на реальные SKU конкурентов с Wildberries */\}

### 4.2 Файл инструкций CLAUDE.md

Создать файл `CLAUDE.md` в корне проекта:

```markdown
# Watcher Agent — Тестовый режим

## Роль
Ты — агент мониторинга цен. Твоя задача: последовательно найти каждый товар
на Wildberries по артикулу, собрать все доступные данные с карточки и сохранить
результат в JSON-файл.

## Инструменты
Используй `agent-browser` для управления браузером. Браузер должен быть
в headed-режиме (--headed).

## Алгоритм работы

### Фаза 1: Инициализация
1. Прочитай файл test_articles.json — получи список артикулов.
2. Подключись к Chrome через CDP: `agent-browser --cdp 9222 open https://www.wildberries.ru`
3. Дождись полной загрузки страницы.

### Фаза 2: Калибровка парсинга
1. Найди первый артикул через строку поиска WB.
2. Открой карточку товара.
3. Выполни `agent-browser snapshot -i` на карточке.
4. Проанализируй snapshot — определи refs для всех доступных данных:
   цена, старая цена, скидка, рейтинг, отзывы, остатки, бренд,
   название, характеристики, количество фото и любые другие данные.
5. Сформируй схему извлечения данных (mapping refs → поля JSON).

### Фаза 3: Сбор данных
Для каждого артикула из списка:

1. Кликни на строку поиска WB.
2. Очисти строку поиска.
3. Введи артикул посимвольно (эмуляция набора, 50-150 мс между символами).
4. Нажми Enter.
5. Дождись загрузки результатов.
6. Проверь — совпадает ли артикул найденного товара с искомым:
   - Совпал → кликни на карточку товара.
   - Не совпал → запиши статус "not_found", перейди к следующему.
7. На карточке товара выполни эмуляцию:
   - Подожди 2-3 секунды.
   - Прокрути страницу вниз (случайная глубина 30-70% страницы).
   - Кликни на 1-2 фото в галерее товара.
   - Наведи курсор на блок с ценой.
   - Подожди 1-2 секунды.
   - Прокрути страницу вверх.
8. Извлеки данные по схеме из Фазы 2.
9. Если извлечение не удалось — выполни новый snapshot и попробуй снова.
10. Сохрани результат в массив.
11. Подожди случайное время 40-50 секунд.
12. Раз в случайные 5-15 товаров — кликни на рандомный товар из выдачи,
    прокрути страницу, подожди 3-5 секунд, вернись назад.

### Фаза 4: Сохранение
1. Запиши все результаты в файл results.json.
2. Выведи краткую сводку: сколько товаров найдено, сколько not_found.
3. Закрой браузер.

### Обработка CAPTCHA
1. При обнаружении CAPTCHA — попробуй решить её.
2. Если не удалось — подожди 5 минут, попробуй снова.
3. Если снова неудачно — запиши статус "captcha_blocked", заверши работу.

## Формат результата (results.json)

Каждый товар сохраняется как объект. Набор полей определяется
динамически на основе snapshot карточки. Минимальный набор:

- sku (артикул)
- status ("ok" | "not_found" | "captcha_blocked" | "error")
- timestamp (ISO 8601)
- url (ссылка на карточку)
- data (объект со всеми извлечёнными данными)

## Ограничения
- Всегда подключайся к Chrome через `--cdp 9222`, не запускай отдельный Chromium.
- Не переходи по прямым URL карточек — только через поиск.
- Не ускоряй паузы — минимум 40 секунд между товарами.
- При ошибке не останавливайся — логируй и продолжай.
```

## Шаг 5: Запуск тестового прогона

### Ручной запуск (первый тест)

```powershell
cd C:\watcher-test

# 1. Закрыть Chrome
taskkill /F /IM chrome.exe 2>$null

# 2. Запустить Chrome с CDP
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --remote-debugging-port=9222 `
  --user-data-dir="$env:LOCALAPPDATA\Google\Chrome\User Data" `
  --profile-directory="Default" --no-first-run

# 3. Подождать 10 сек
Start-Sleep -Seconds 10

# 4. Запустить Claude Code CLI
claude --prompt "Прочитай CLAUDE.md и выполни задание. Используй agent-browser с --cdp 9222. Начни с Фазы 1."
```

### Автоматический запуск (через bat-скрипт)

```powershell
C:\watcher-test\run_watcher.bat
```

Ожидаемое поведение:

1. Chrome откроется с профилем менеджера (все авторизации сохранены).
2. Claude подключится к Chrome через CDP (порт 9222).
3. Перейдёт на wildberries.ru.
4. Найдёт первый артикул → проанализирует структуру карточки.
5. Последовательно обработает 5 артикулов с эмуляцией.
6. Сохранит `results.json` в рабочую директорию.

Ориентировочное время: ~5–7 минут (5 товаров × ~70 сек).

## Шаг 6: Проверка результатов

Открыть `C:\watcher-test\results.json` и проверить:

| Критерий | Ожидание |
|----------|----------|
| Файл создан | results.json существует |
| Количество записей | 5 объектов в массиве |
| Статусы | Хотя бы 3 из 5 — "ok" |
| Поля данных | Присутствуют цена, название, рейтинг |
| Timestamps | Корректные ISO 8601 |
| URL | Валидные ссылки на WB |

## Шаг 7: Запуск через bat-файл

### 7.1 Создать bat-файл `C:\watcher-test\run_watcher.bat`

```bat
@echo off
cd /d C:\watcher-test

REM === Создать директорию для логов ===
if not exist logs mkdir logs

REM === 1. Принудительно закрыть Chrome ===
taskkill /F /IM chrome.exe >nul 2>&1
timeout /t 5 /nobreak >nul

REM === 2. Запустить Chrome с CDP и профилем менеджера ===
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --remote-debugging-port=9222 ^
  --user-data-dir="%LOCALAPPDATA%\Google\Chrome\User Data" ^
  --profile-directory="Default" ^
  --no-first-run
timeout /t 10 /nobreak >nul

REM === 3. Запустить Claude Code CLI ===
claude --prompt "Прочитай CLAUDE.md и выполни задание. Используй agent-browser с --cdp 9222. Начни с Фазы 1." > logs\%date:~-4%-%date:~3,2%-%date:~0,2%.log 2>&1

REM === 4. Закрыть Chrome после завершения ===
taskkill /F /IM chrome.exe >nul 2>&1
```

### 7.2 Запуск

```powershell
C:\watcher-test\run_watcher.bat
```

После успешного теста, для автоматизации ночного запуска — добавить задачу в Windows Task Scheduler на 20:00.

## Возможные проблемы

| Проблема | Причина | Решение |
|----------|---------|---------|
| `claude: command not found` | CLI не в PATH | Перезапустить PowerShell или добавить путь вручную |
| `agent-browser: command not found` | npm глобальный путь | `npm config get prefix` → добавить в PATH |
| Chromium не открывается | Не выполнен `agent-browser install` | Выполнить `agent-browser install` |
| CDP connection refused | Chrome не запущен или порт занят | Проверить `netstat -an \| findstr 9222`, перезапустить Chrome |
| Cookies не видны | Указан неверный профиль Chrome | Проверить путь `--user-data-dir` и `--profile-directory` |
| Claude Max лимит | Превышены сообщения | Уменьшить количество артикулов |
| Chrome не закрывается | Процесс завис | `taskkill /F /IM chrome.exe` вручную |

### Использование профиля Chrome менеджера

CDP-подключение автоматизировано в `run_watcher.bat`:

1. Скрипт принудительно закрывает Chrome менеджера.
2. Перезапускает Chrome с тем же профилем + флаг `--remote-debugging-port=9222`.
3. Agent-browser подключается через `--cdp 9222`.
4. Все cookies, авторизации и сессии менеджера доступны агенту.
5. По завершении Chrome закрывается.

Менеджер утром открывает Chrome как обычно — без CDP-флага, в штатном режиме.

Для ручного теста CDP-подключения:

```powershell
# Закрыть Chrome
taskkill /F /IM chrome.exe

# Запустить с CDP
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --remote-debugging-port=9222 `
  --user-data-dir="$env:LOCALAPPDATA\Google\Chrome\User Data" `
  --profile-directory="Default" `
  --no-first-run

# Подключить agent-browser
agent-browser --cdp 9222 open https://www.wildberries.ru
agent-browser snapshot -i
```

## Что дальше

После успешного теста:

1. Увеличить количество артикулов до 50–100.
2. Добавить второй маркетплейс (Ozon) как вторую вкладку.
3. Подключить отправку результатов на сервер через REST API.
4. Перейти к полноценной ночной конфигурации (580 артикулов × 3 маркетплейса).

---

**Версия:** 0.1  
**Статус:** Тестовая инструкция  
**Дата:** Февраль 2026

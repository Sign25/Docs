---
title: "Раздел 2: Open WebUI (UI/UX)"
---

**Модуль:** Коллеги + Каналы

---

## Сайдбар

### Секция «Коллеги» (DM)

- **Появление** — только когда есть хотя бы один DM канал
- **Анимация** — `animate-slide-in` (fade + translateY)
- **Заголовок** — «Коллеги» с chevron
- **Кнопка +** — «Написать коллеге» → модалка выбора
- **Элементы** — аватар собеседника + имя + онлайн-статус + непрочитанные
- **Скрытие** — крестик при наведении → ConfirmDialog

### Секция «Каналы» (Group)

- **Видимость** — всегда (даже если каналов нет → «Нет каналов»)
- **Кнопка +** — «Новый канал» → ChannelModal (создание группового канала)
- **Элементы** — иконка (# или замок) + название + непрочитанные

### Управление ролями

Обе секции контролируются через админ-панель:
- Настройки → Доступ к модулям → «Коллеги» / «Каналы»
- Используют `canAccessModule($user?.role, 'colleagues')` и `canAccessModule($user?.role, 'channels')`

## Модалка «Написать коллеге»

- Открывается по кнопке + в секции «Коллеги»
- Поле поиска по имени
- Список пользователей (аватар + имя + email)
- API: `searchUsers(token)` → `/api/v1/users/search`
- Клик → `getDMChannelByUserId(token, userId)` → переход на `/channels/{id}`
- Если канал не существует — создаётся автоматически

## Страница канала

URL: `/channels/{id}`

Компоненты (из Open WebUI):
- `Channel.svelte` — основной контейнер
- `Messages.svelte` — список сообщений с аватарами
- `MessageInput.svelte` — ввод сообщения (текст, файлы)
- `Thread.svelte` — треды ответов
- `Navbar.svelte` — заголовок канала
- `ChannelInfoModal.svelte` — информация о канале
- `PinnedMessagesModal.svelte` — закреплённые сообщения

## Элемент DM в сайдбаре (ChannelItem)

```
[Аватар 24px] Имя собеседника     [3]
              ● онлайн
```

- Аватар собеседника (size-5.5, rounded-full, border)
- Зелёный индикатор онлайн с пульсацией `animate-ping`
- Имя / статус-сообщение / emoji статуса
- Счётчик непрочитанных (bg-gray-100/800, rounded-xl)
- При наведении — крестик для скрытия

## Кнопка DM в админке

- Расположение: Админка → Пользователи → таблица → колонка действий
- Иконка: `MessageSquare` (lucide)
- Tooltip: «Написать»
- По клику: `getDMChannelByUserId` → `goto(/channels/{id})`
- Видна только если `$config?.features?.enable_channels` и `user.id !== $user.id`

## Ключевые файлы

```
src/lib/components/layout/Sidebar.svelte              — секции DM + Каналы
src/lib/components/layout/Sidebar/ChannelItem.svelte   — элемент канала
src/lib/components/layout/Sidebar/ChannelModal.svelte  — создание канала
src/lib/components/channel/Channel.svelte              — страница чата
src/lib/components/channel/Messages/                   — сообщения
src/lib/components/channel/MessageInput/               — ввод
src/lib/components/admin/Users/UserList.svelte         — кнопка DM в админке
src/lib/apis/channels/index.ts                         — API клиент
```

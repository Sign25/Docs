# ADOLF WAREHOUSE — Раздел 4: Open WebUI

**Проект:** Управление физическим складом  
**Модуль:** Warehouse  
**Версия:** 1.0 (черновик)  
**Дата:** Май 2026

---

## 4.1 Назначение

Описание интеграции модуля Warehouse в Open WebUI: страницы, навигация, тулзы (function calling) и пермишены.

---

## 4.2 Структура страниц

### 4.2.1 Основная страница `/warehouse`

Standalone страница (не в чате) для Director / Admin.

| Вкладка | Tool | Default access |
|---------|------|----------------|
| Дашборд | `warehouse_view` | director+ |
| Приёмка | `warehouse_receive` | director+ |
| ОТК | `warehouse_qc` | director+ |
| Перемаркировка | `warehouse_remark` | director+ |
| Размещение | `warehouse_place` | director+ |
| Внутрискладские | `warehouse_internal` | director+ |
| Комплектация | `warehouse_pick` | director+ |
| Фасовка | `warehouse_pack` | director+ |
| Отгрузка | `warehouse_ship` | director+ |
| Инвентаризация | `warehouse_inventory` | director+ |
| Остатки | `warehouse_view` | director+ |
| Зоны и ячейки | `warehouse_locations` | admin only |

### 4.2.2 ТСД-страница `/warehouse/tsd`

Отдельный full-screen роут для кладовщика. Авторизация через ПИН-код, не через ADOLF-аккаунт. Подробности в разделе 2.

### 4.2.3 Страница печати `/warehouse/print/labels`

Утилитарная страница для печати ярлыков ячеек, КИТУ-кодов, новых QR после перемаркировки.

---

## 4.3 Навигация

В сайдбаре ADOLF — иконка `warehouse-icon.svg` (Lucide warehouse style). Доступна тем, у кого `canAccessModule(role, 'warehouse') === true`.

ТСД-страница доступна по прямой ссылке `/warehouse/tsd`, в сайдбаре ADOLF не отображается (отдельная аудитория).

---

## 4.4 Tools (Function Calling)

### 4.4.1 Реестр тулзов

| Tool | Описание | Default access |
|------|----------|----------------|
| `warehouse_view` | Просмотр остатков, дашборда, отчётов | director+ |
| `warehouse_receive` | Приёмка товара | director+ |
| `warehouse_qc` | ОТК-проверка с фото-фиксацией | director+ |
| `warehouse_remark` | Перемаркировка (запрос новых КИЗов) | director+ |
| `warehouse_place` | Размещение по ячейкам | director+ |
| `warehouse_internal` | Внутрискладские перемещения | director+ |
| `warehouse_pick` | Комплектация заказов | director+ |
| `warehouse_pack` | Фасовка | director+ |
| `warehouse_ship` | Отгрузка | director+ |
| `warehouse_inventory` | Инвентаризация | director+ |
| `warehouse_locations` | Управление зонами и ячейками | admin only |
| `warehouse_export` | Экспорт остатков и отчётов в Excel | director+ |

### 4.4.2 Pipeline `@Adolf_Warehouse` (опционально, в перспективе)

Для запросов «когда поступит OM-1024?», «сколько на складе платьев ROSE?», «топ дефицитных артикулов» — Pipeline для чата с function calling над Tools выше.

---

## 4.5 Интерактивные элементы UI

### 4.5.1 Дашборд

- Карточки-метрики (5 шт.): Всего SKU, Общий остаток, Активные заказы, Дубликаты за неделю, Загрузка ТСД
- График движений за неделю (приходы / отгрузки / списания)
- Топ проблемных артикулов

### 4.5.2 Управление приходами

- Список приходов с фильтрацией по статусу/дате/поставщику
- Детальная карточка прихода: план vs факт, дубликаты, недостачи
- Кнопки: «Открыть на ТСД» (показать QR-код приёма для сканирования), «Подписать недостачу», «Запросить пересчёт»

### 4.5.3 Перемаркировка

- Список накопленных запросов
- Батч-выбор для запроса в ЧЗ
- История полученных кодов (для печати/контроля)

---

## 4.6 Per-tool permissions

Используется существующая система `MODULE_TOOLS_ACCESS` (см. модуль admin/Settings/ModuleAccess). Default-роли указаны в таблице 4.4.1, переопределяются админом в `/admin/settings → Доступ к модулям → Склад`.

---

## 4.7 Стиль и дизайн

Соответствует общему shadcn-стилю ADOLF:
- Карточки-метрики — `Card.Root` с иконкой Lucide и крупной цифрой
- Таблицы остатков — `Table.Root` с adaptive скрытием колонок на мобиле
- Цветовая индикация:
  - Низкий остаток (< 10) → amber
  - Нет остатка → red
  - Брак / дубль → red badge
  - Норма → muted

Иконки модуля: `Boxes`, `ScanLine`, `ArrowDownToLine` (приёмка), `ArrowUpFromLine` (отгрузка), `Sliders` (корректировки), `MapPin` (зоны), `Package`, `Wifi`, `Smartphone`.

---

**Дописать:** конкретные wireframes по каждой вкладке, типы props/events компонентов, REST API contract.

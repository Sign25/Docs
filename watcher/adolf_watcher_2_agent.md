---
title: "Раздел 2: Агент"
mode: "wide"
---

**ÐŸÑ€Ð¾ÐµÐºÑ‚:** Ð˜Ð½Ñ‚ÐµÐ»Ð»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð°Ñ ÑÐ¸ÑÑ‚ÐµÐ¼Ð° Ð¼Ð¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³Ð° Ñ†ÐµÐ½ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð¾Ð²  
**ÐœÐ¾Ð´ÑƒÐ»ÑŒ:** Watcher / Agent  
**Ð’ÐµÑ€ÑÐ¸Ñ:** 2.0  
**Ð”Ð°Ñ‚Ð°:** Ð¯Ð½Ð²Ð°Ñ€ÑŒ 2026

---

## 2.1 ÐžÐ±Ð·Ð¾Ñ€ Ð°Ð³ÐµÐ½Ñ‚Ð°

### ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

Watcher Agent â€” ÐºÐ»Ð¸ÐµÐ½Ñ‚ÑÐºÐ¾Ðµ Ð¿Ñ€Ð¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ, Ñ€Ð°Ð±Ð¾Ñ‚Ð°ÑŽÑ‰ÐµÐµ Ð½Ð° Ð¾Ñ„Ð¸ÑÐ½Ñ‹Ñ… ÐŸÐš Ð¼ÐµÐ½ÐµÐ´Ð¶ÐµÑ€Ð¾Ð². ÐÐ³ÐµÐ½Ñ‚ Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÑÐµÑ‚ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³ ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ† Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ¾Ð² Ð² Ð½Ð¾Ñ‡Ð½Ð¾Ðµ Ð²Ñ€ÐµÐ¼Ñ, Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÑ cookies Ð¼ÐµÐ½ÐµÐ´Ð¶ÐµÑ€Ð° Ð´Ð»Ñ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð° Ðº Ð·Ð°ÐºÑ€Ñ‹Ñ‚Ð¾Ð¹ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸.

### Ð¥Ð°Ñ€Ð°ÐºÑ‚ÐµÑ€Ð¸ÑÑ‚Ð¸ÐºÐ¸

| ÐŸÐ°Ñ€Ð°Ð¼ÐµÑ‚Ñ€ | Ð—Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ |
|----------|----------|
| Ð¯Ð·Ñ‹Ðº | Python 3.11 |
| Ð‘Ñ€Ð°ÑƒÐ·ÐµÑ€Ð½Ð°Ñ Ð°Ð²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ð·Ð°Ñ†Ð¸Ñ | Playwright |
| ÐžÐ¡ | Windows 10/11 |
| Ð ÐµÐ¶Ð¸Ð¼ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹ | Windows Service (MVP) |
| ÐšÐ¾Ð½Ñ„Ð¸Ð³ÑƒÑ€Ð°Ñ†Ð¸Ñ | YAML |
| Ð›Ð¾ÐºÐ°Ð»ÑŒÐ½Ð¾Ðµ Ñ…Ñ€Ð°Ð½Ð¸Ð»Ð¸Ñ‰Ðµ | SQLite |

### Ð¡Ñ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð° Ð¿Ñ€Ð¾ÐµÐºÑ‚Ð°

```
watcher-agent/
â”œâ”€â”€ agent/
â”‚   â”œâ”€â”€ __init__.py
â”‚   â”œâ”€â”€ main.py              # Ð¢Ð¾Ñ‡ÐºÐ° Ð²Ñ…Ð¾Ð´Ð°
â”‚   â”œâ”€â”€ config.py            # Ð—Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° ÐºÐ¾Ð½Ñ„Ð¸Ð³ÑƒÑ€Ð°Ñ†Ð¸Ð¸
â”‚   â”œâ”€â”€ service.py           # Windows Service wrapper
â”‚   â”‚
â”‚   â”œâ”€â”€ core/
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ scheduler.py     # ÐŸÐ»Ð°Ð½Ð¸Ñ€Ð¾Ð²Ñ‰Ð¸Ðº Ñ€ÐµÐ¶Ð¸Ð¼Ð¾Ð²
â”‚   â”‚   â”œâ”€â”€ task_manager.py  # Ð£Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð·Ð°Ð´Ð°Ñ‡Ð°Ð¼Ð¸
â”‚   â”‚   â””â”€â”€ state_machine.py # Ð¡Ð¾ÑÑ‚Ð¾ÑÐ½Ð¸Ñ Ð°Ð³ÐµÐ½Ñ‚Ð°
â”‚   â”‚
â”‚   â”œâ”€â”€ browser/
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ cloner.py        # Browser Cloner
â”‚   â”‚   â”œâ”€â”€ controller.py    # Playwright controller
â”‚   â”‚   â””â”€â”€ emulation.py     # Ð­Ð¼ÑƒÐ»ÑÑ†Ð¸Ñ Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸Ñ
â”‚   â”‚
â”‚   â”œâ”€â”€ network/
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ switcher.py      # Network Switcher
â”‚   â”‚   â”œâ”€â”€ modem.py         # Modem Controller
â”‚   â”‚   â””â”€â”€ routing.py       # Route management
â”‚   â”‚
â”‚   â”œâ”€â”€ communication/
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ rest_client.py   # REST API client
â”‚   â”‚   â”œâ”€â”€ ws_client.py     # WebSocket client
â”‚   â”‚   â””â”€â”€ retry.py         # Retry logic
â”‚   â”‚
â”‚   â”œâ”€â”€ cache/
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ local_db.py      # SQLite cache
â”‚   â”‚   â””â”€â”€ sync.py          # Cache synchronization
â”‚   â”‚
â”‚   â””â”€â”€ utils/
â”‚       â”œâ”€â”€ __init__.py
â”‚       â”œâ”€â”€ logging.py       # Ð›Ð¾Ð³Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ
â”‚       â”œâ”€â”€ crypto.py        # Ð¨Ð¸Ñ„Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ cookies
â”‚       â””â”€â”€ helpers.py       # Ð’ÑÐ¿Ð¾Ð¼Ð¾Ð³Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¸
â”‚
â”œâ”€â”€ config.yaml              # ÐšÐ¾Ð½Ñ„Ð¸Ð³ÑƒÑ€Ð°Ñ†Ð¸Ñ
â”œâ”€â”€ requirements.txt         # Ð—Ð°Ð²Ð¸ÑÐ¸Ð¼Ð¾ÑÑ‚Ð¸
â”œâ”€â”€ install_service.py       # Ð£ÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐ° Windows Service
â”œâ”€â”€ uninstall_service.py     # Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ Windows Service
â””â”€â”€ README.md
```

---

## 2.2 Ð–Ð¸Ð·Ð½ÐµÐ½Ð½Ñ‹Ð¹ Ñ†Ð¸ÐºÐ» Ð°Ð³ÐµÐ½Ñ‚Ð°

### Ð”Ð¸Ð°Ð³Ñ€Ð°Ð¼Ð¼Ð° ÑÐ¾ÑÑ‚Ð¾ÑÐ½Ð¸Ð¹

```mermaid
stateDiagram-v2
    [*] --> Idle: Ð—Ð°Ð¿ÑƒÑÐº ÑÐ»ÑƒÐ¶Ð±Ñ‹
    
    Idle --> PreparingCookies: 20:00
    PreparingCookies --> PreparingNetwork: cookies ÑÐºÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ð½Ñ‹
    PreparingNetwork --> Ready: ÑÐµÑ‚ÑŒ Ð¿ÐµÑ€ÐµÐºÐ»ÑŽÑ‡ÐµÐ½Ð°
    
    Ready --> Working: 21:00
    Working --> Working: task loop
    Working --> Paused: ÐºÐ¾Ð¼Ð°Ð½Ð´Ð° pause
    Paused --> Working: ÐºÐ¾Ð¼Ð°Ð½Ð´Ð° resume
    Working --> Panic: CAPTCHA/403
    Panic --> Working: cooldown Ð·Ð°Ð²ÐµÑ€ÑˆÑ‘Ð½
    Panic --> Panic: Ð¿ÐµÑ€ÐµÐ·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° Ð¼Ð¾Ð´ÐµÐ¼Ð°
    
    Working --> Cleanup: 07:00
    Cleanup --> Idle: Ð¾Ñ‡Ð¸ÑÑ‚ÐºÐ° Ð·Ð°Ð²ÐµÑ€ÑˆÐµÐ½Ð°
    
    Working --> Offline: Ð¿Ð¾Ñ‚ÐµÑ€Ñ ÑÐ²ÑÐ·Ð¸
    Offline --> Working: ÑÐ²ÑÐ·ÑŒ Ð²Ð¾ÑÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð°
    Offline --> Offline: Ñ€Ð°Ð±Ð¾Ñ‚Ð° Ð¸Ð· ÐºÑÑˆÐ°
    
    Panic --> Stopped: ÐºÑ€Ð¸Ñ‚Ð¸Ñ‡ÐµÑÐºÐ°Ñ Ð¾ÑˆÐ¸Ð±ÐºÐ°
    Stopped --> Idle: Ñ€ÑƒÑ‡Ð½Ð¾Ð¹ Ð¿ÐµÑ€ÐµÐ·Ð°Ð¿ÑƒÑÐº
```

### ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ ÑÐ¾ÑÑ‚Ð¾ÑÐ½Ð¸Ð¹

| Ð¡Ð¾ÑÑ‚Ð¾ÑÐ½Ð¸Ðµ | ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ | Ð”ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ |
|-----------|----------|----------|
| `Idle` | ÐžÐ¶Ð¸Ð´Ð°Ð½Ð¸Ðµ (Ð´Ð½ÐµÐ²Ð½Ð¾Ð¹ Ñ€ÐµÐ¶Ð¸Ð¼) | Heartbeat ÐºÐ°Ð¶Ð´Ñ‹Ðµ 30 ÑÐµÐº |
| `PreparingCookies` | ÐšÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ cookies | Ð—Ð°Ð²ÐµÑ€ÑˆÐµÐ½Ð¸Ðµ Chrome, ÐºÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ |
| `PreparingNetwork` | ÐŸÐµÑ€ÐµÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ ÑÐµÑ‚Ð¸ | Ð¡Ð¼ÐµÐ½Ð° Ð¸Ð½Ñ‚ÐµÑ€Ñ„ÐµÐ¹ÑÐ° Ð½Ð° USB-Ð¼Ð¾Ð´ÐµÐ¼ |
| `Ready` | Ð“Ð¾Ñ‚Ð¾Ð² Ðº Ñ€Ð°Ð±Ð¾Ñ‚Ðµ | ÐžÐ¶Ð¸Ð´Ð°Ð½Ð¸Ðµ 21:00 |
| `Working` | ÐÐºÑ‚Ð¸Ð²Ð½Ñ‹Ð¹ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³ | ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð·Ð°Ð´Ð°Ñ‡, Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³, Ð¾Ñ‚Ð¿Ñ€Ð°Ð²ÐºÐ° |
| `Paused` | ÐŸÑ€Ð¸Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½ | ÐžÐ¶Ð¸Ð´Ð°Ð½Ð¸Ðµ ÐºÐ¾Ð¼Ð°Ð½Ð´Ñ‹ resume |
| `Panic` | ÐÐ²Ð°Ñ€Ð¸Ð¹Ð½Ñ‹Ð¹ Ñ€ÐµÐ¶Ð¸Ð¼ | Cooldown, Ð¿ÐµÑ€ÐµÐ·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° Ð¼Ð¾Ð´ÐµÐ¼Ð° |
| `Offline` | ÐÐµÑ‚ ÑÐ²ÑÐ·Ð¸ Ñ ÑÐµÑ€Ð²ÐµÑ€Ð¾Ð¼ | Ð Ð°Ð±Ð¾Ñ‚Ð° Ð¸Ð· Ð»Ð¾ÐºÐ°Ð»ÑŒÐ½Ð¾Ð³Ð¾ ÐºÑÑˆÐ° |
| `Cleanup` | Ð—Ð°Ð²ÐµÑ€ÑˆÐµÐ½Ð¸Ðµ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹ | ÐžÑ‡Ð¸ÑÑ‚ÐºÐ° Ð¿Ñ€Ð¾Ñ„Ð¸Ð»Ñ, ÑÐ¼ÐµÐ½Ð° ÑÐµÑ‚Ð¸ |
| `Stopped` | ÐžÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½ | ÐžÐ¶Ð¸Ð´Ð°Ð½Ð¸Ðµ Ñ€ÑƒÑ‡Ð½Ð¾Ð³Ð¾ Ð²Ð¼ÐµÑˆÐ°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð° |

---

## 2.3 Browser Cloner

### ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

ÐšÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ cookies Ð¸Ð· Ð¿Ñ€Ð¾Ñ„Ð¸Ð»Ñ Chrome Ð¼ÐµÐ½ÐµÐ´Ð¶ÐµÑ€Ð° Ð´Ð»Ñ Ð°Ð²Ñ‚Ð¾Ñ€Ð¸Ð·Ð°Ñ†Ð¸Ð¸ Ð°Ð³ÐµÐ½Ñ‚Ð° Ð½Ð° Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°Ñ….

### Ð Ð°ÑÐ¿Ð¾Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ cookies Ð² Chrome

```
Windows:
C:\Users\{Username}\AppData\Local\Google\Chrome\User Data\Default\
â”œâ”€â”€ Cookies          # SQLite Ð±Ð°Ð·Ð° Ñ cookies
â”œâ”€â”€ Login Data       # Ð¡Ð¾Ñ…Ñ€Ð°Ð½Ñ‘Ð½Ð½Ñ‹Ðµ Ð¿Ð°Ñ€Ð¾Ð»Ð¸ (Ð½Ðµ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼)
â””â”€â”€ Local State      # ÐšÐ»ÑŽÑ‡ ÑˆÐ¸Ñ„Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ
```

### ÐÐ»Ð³Ð¾Ñ€Ð¸Ñ‚Ð¼ ÐºÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ

```mermaid
flowchart TD
    A["ÐÐ°Ñ‡Ð°Ð»Ð¾ (20:00)"] --> B["ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ°: Chrome Ð·Ð°Ð¿ÑƒÑ‰ÐµÐ½?"]
    B -->|Ð”Ð°| C["Ð—Ð°Ð²ÐµÑ€ÑˆÐµÐ½Ð¸Ðµ Ð¿Ñ€Ð¾Ñ†ÐµÑÑÐ¾Ð² Chrome"]
    B -->|ÐÐµÑ‚| D["ÐŸÑ€Ð¾Ð´Ð¾Ð»Ð¶ÐµÐ½Ð¸Ðµ"]
    C --> D
    
    D --> E["Ð§Ñ‚ÐµÐ½Ð¸Ðµ Local State"]
    E --> F["Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ master key (DPAPI)"]
    F --> G["Ð§Ñ‚ÐµÐ½Ð¸Ðµ Cookies SQLite"]
    
    G --> H["Ð”Ð»Ñ ÐºÐ°Ð¶Ð´Ð¾Ð³Ð¾ cookie"]
    H --> I["Ð Ð°ÑÑˆÐ¸Ñ„Ñ€Ð¾Ð²ÐºÐ° encrypted_value"]
    I --> J["Ð¤Ð¸Ð»ÑŒÑ‚Ñ€Ð°Ñ†Ð¸Ñ Ð¿Ð¾ Ð´Ð¾Ð¼ÐµÐ½Ð°Ð¼"]
    
    J --> K{{"Ð”Ð¾Ð¼ÐµÐ½ Ð² ÑÐ¿Ð¸ÑÐºÐµ?"}}
    K -->|Ð”Ð°| L["Ð”Ð¾Ð±Ð°Ð²Ð¸Ñ‚ÑŒ Ð² Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚"]
    K -->|ÐÐµÑ‚| M["ÐŸÑ€Ð¾Ð¿ÑƒÑÑ‚Ð¸Ñ‚ÑŒ"]
    L --> H
    M --> H
    
    H -->|Ð’ÑÐµ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚Ð°Ð½Ñ‹| N["Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ cookies.json"]
    N --> O["ÐžÑ‚Ð¿Ñ€Ð°Ð²ÐºÐ° ÑÑ‚Ð°Ñ‚ÑƒÑÐ° Ð½Ð° ÑÐµÑ€Ð²ÐµÑ€"]
    O --> P["Ð—Ð°Ð²ÐµÑ€ÑˆÐµÐ½Ð¸Ðµ"]
```

### Ð ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ

```python
# agent/browser/cloner.py

import os
import json
import sqlite3
import shutil
import base64
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime

import win32crypt
from Cryptodome.Cipher import AES


class BrowserCloner:
    """ÐšÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ cookies Ð¸Ð· Chrome."""
    
    # Ð”Ð¾Ð¼ÐµÐ½Ñ‹ Ð´Ð»Ñ ÐºÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ
    TARGET_DOMAINS = [
        ".wildberries.ru",
        ".ozon.ru",
        ".yandex.ru",
        ".market.yandex.ru",
    ]
    
    def __init__(self, chrome_profile_path: str, output_path: str):
        self.chrome_profile_path = Path(chrome_profile_path)
        self.output_path = Path(output_path)
        self.master_key: Optional[bytes] = None
    
    def clone(self) -> bool:
        """
        ÐžÑÐ½Ð¾Ð²Ð½Ð¾Ð¹ Ð¼ÐµÑ‚Ð¾Ð´ ÐºÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ cookies.
        
        Returns:
            True ÐµÑÐ»Ð¸ ÑƒÑÐ¿ÐµÑˆÐ½Ð¾, False Ð¿Ñ€Ð¸ Ð¾ÑˆÐ¸Ð±ÐºÐµ
        """
        try:
            # 1. Ð—Ð°Ð²ÐµÑ€ÑˆÐµÐ½Ð¸Ðµ Chrome
            self._kill_chrome()
            
            # 2. ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ master key
            self.master_key = self._get_master_key()
            if not self.master_key:
                raise Exception("Failed to get master key")
            
            # 3. ÐšÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð¸ Ñ€Ð°ÑÑˆÐ¸Ñ„Ñ€Ð¾Ð²ÐºÐ° cookies
            cookies = self._extract_cookies()
            
            # 4. Ð¤Ð¸Ð»ÑŒÑ‚Ñ€Ð°Ñ†Ð¸Ñ Ð¿Ð¾ Ð´Ð¾Ð¼ÐµÐ½Ð°Ð¼
            filtered = self._filter_cookies(cookies)
            
            # 5. Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ
            self._save_cookies(filtered)
            
            return True
            
        except Exception as e:
            logging.error(f"Cookie cloning failed: {e}")
            return False
    
    def _kill_chrome(self) -> None:
        """Ð—Ð°Ð²ÐµÑ€ÑˆÐµÐ½Ð¸Ðµ Ð²ÑÐµÑ… Ð¿Ñ€Ð¾Ñ†ÐµÑÑÐ¾Ð² Chrome."""
        import subprocess
        
        processes = ["chrome.exe", "chromedriver.exe"]
        for proc in processes:
            subprocess.run(
                ["taskkill", "/F", "/IM", proc],
                capture_output=True
            )
        
        # ÐžÐ¶Ð¸Ð´Ð°Ð½Ð¸Ðµ Ð·Ð°Ð²ÐµÑ€ÑˆÐµÐ½Ð¸Ñ
        import time
        time.sleep(2)
    
    def _get_master_key(self) -> Optional[bytes]:
        """Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ master key Ð¸Ð· Local State."""
        local_state_path = self.chrome_profile_path.parent / "Local State"
        
        with open(local_state_path, "r", encoding="utf-8") as f:
            local_state = json.load(f)
        
        encrypted_key = base64.b64decode(
            local_state["os_crypt"]["encrypted_key"]
        )
        
        # Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ Ð¿Ñ€ÐµÑ„Ð¸ÐºÑÐ° "DPAPI"
        encrypted_key = encrypted_key[5:]
        
        # Ð Ð°ÑÑˆÐ¸Ñ„Ñ€Ð¾Ð²ÐºÐ° Ñ‡ÐµÑ€ÐµÐ· Windows DPAPI
        master_key = win32crypt.CryptUnprotectData(
            encrypted_key, None, None, None, 0
        )[1]
        
        return master_key
    
    def _extract_cookies(self) -> List[Dict]:
        """Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ cookies Ð¸Ð· SQLite Ð±Ð°Ð·Ñ‹."""
        cookies_db = self.chrome_profile_path / "Cookies"
        
        # ÐšÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð±Ð°Ð·Ñ‹ (Ð¸Ð·Ð±ÐµÐ¶Ð°Ð½Ð¸Ðµ Ð±Ð»Ð¾ÐºÐ¸Ñ€Ð¾Ð²ÐºÐ¸)
        temp_db = self.output_path / "Cookies_temp"
        shutil.copy2(cookies_db, temp_db)
        
        conn = sqlite3.connect(temp_db)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT host_key, name, encrypted_value, path, 
                   expires_utc, is_secure, is_httponly
            FROM cookies
        """)
        
        cookies = []
        for row in cursor.fetchall():
            decrypted_value = self._decrypt_value(row[2])
            
            cookies.append({
                "domain": row[0],
                "name": row[1],
                "value": decrypted_value,
                "path": row[3],
                "expires": row[4],
                "secure": bool(row[5]),
                "httpOnly": bool(row[6]),
            })
        
        conn.close()
        os.remove(temp_db)
        
        return cookies
    
    def _decrypt_value(self, encrypted_value: bytes) -> str:
        """Ð Ð°ÑÑˆÐ¸Ñ„Ñ€Ð¾Ð²ÐºÐ° Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ñ cookie."""
        if not encrypted_value:
            return ""
        
        # Chrome v80+ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÑ‚ AES-256-GCM
        if encrypted_value[:3] == b"v10" or encrypted_value[:3] == b"v11":
            nonce = encrypted_value[3:15]
            ciphertext = encrypted_value[15:]
            
            cipher = AES.new(self.master_key, AES.MODE_GCM, nonce=nonce)
            decrypted = cipher.decrypt(ciphertext)[:-16]  # Remove auth tag
            
            return decrypted.decode("utf-8")
        
        # Ð¡Ñ‚Ð°Ñ€Ñ‹Ðµ Ð²ÐµÑ€ÑÐ¸Ð¸ Chrome (DPAPI)
        return win32crypt.CryptUnprotectData(
            encrypted_value, None, None, None, 0
        )[1].decode("utf-8")
    
    def _filter_cookies(self, cookies: List[Dict]) -> List[Dict]:
        """Ð¤Ð¸Ð»ÑŒÑ‚Ñ€Ð°Ñ†Ð¸Ñ cookies Ð¿Ð¾ Ñ†ÐµÐ»ÐµÐ²Ñ‹Ð¼ Ð´Ð¾Ð¼ÐµÐ½Ð°Ð¼."""
        filtered = []
        
        for cookie in cookies:
            domain = cookie["domain"]
            for target in self.TARGET_DOMAINS:
                if domain.endswith(target) or domain == target.lstrip("."):
                    filtered.append(cookie)
                    break
        
        return filtered
    
    def _save_cookies(self, cookies: List[Dict]) -> None:
        """Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ cookies Ð² JSON Ñ„Ð°Ð¹Ð»."""
        output_file = self.output_path / "cookies.json"
        
        data = {
            "extracted_at": datetime.now().isoformat(),
            "source": str(self.chrome_profile_path),
            "cookies": cookies,
            "count": len(cookies),
        }
        
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
```

### Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚ cookies.json

```json
{
  "extracted_at": "2026-01-15T20:00:05",
  "source": "C:\\Users\\Manager\\AppData\\Local\\Google\\Chrome\\User Data\\Default",
  "count": 47,
  "cookies": [
    {
      "domain": ".wildberries.ru",
      "name": "___wbu",
      "value": "xxx...",
      "path": "/",
      "expires": 1737936000000000,
      "secure": true,
      "httpOnly": true
    },
    {
      "domain": ".ozon.ru",
      "name": "__Secure-access-token",
      "value": "yyy...",
      "path": "/",
      "expires": 1737849600000000,
      "secure": true,
      "httpOnly": true
    }
  ]
}
```

---

## 2.4 Network Switcher

### ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

ÐŸÐµÑ€ÐµÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ ÑÐµÑ‚ÐµÐ²Ð¾Ð³Ð¾ Ð¸Ð½Ñ‚ÐµÑ€Ñ„ÐµÐ¹ÑÐ° Ð¼ÐµÐ¶Ð´Ñƒ Ð¾Ñ„Ð¸ÑÐ½Ð¾Ð¹ ÑÐµÑ‚ÑŒÑŽ (Ethernet) Ð¸ USB-Ð¼Ð¾Ð´ÐµÐ¼Ð¾Ð¼.

### ÐÐ»Ð³Ð¾Ñ€Ð¸Ñ‚Ð¼ Ð¿ÐµÑ€ÐµÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ñ

```mermaid
flowchart TD
    A["ÐÐ°Ñ‡Ð°Ð»Ð¾ Ð¿ÐµÑ€ÐµÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ñ"] --> B["ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ Ñ‚ÐµÐºÑƒÑ‰ÐµÐ³Ð¾ Ð¸Ð½Ñ‚ÐµÑ€Ñ„ÐµÐ¹ÑÐ°"]
    B --> C{{"Ð¦ÐµÐ»ÐµÐ²Ð¾Ð¹ Ñ€ÐµÐ¶Ð¸Ð¼?"}}
    
    C -->|ÐœÐ¾Ð´ÐµÐ¼| D["ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° USB-Ð¼Ð¾Ð´ÐµÐ¼Ð°"]
    D --> E{{"ÐœÐ¾Ð´ÐµÐ¼ Ð¿Ð¾Ð´ÐºÐ»ÑŽÑ‡Ñ‘Ð½?"}}
    E -->|ÐÐµÑ‚| F["ÐžÑˆÐ¸Ð±ÐºÐ°: Ð¼Ð¾Ð´ÐµÐ¼ Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½"]
    E -->|Ð”Ð°| G["ÐžÑ‚ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ Ethernet"]
    G --> H["Ð£ÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐ° Ð¼Ð°Ñ€ÑˆÑ€ÑƒÑ‚Ð¾Ð² Ð´Ð»Ñ Ð¼Ð¾Ð´ÐµÐ¼Ð°"]
    H --> I["ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° IP Ñ‡ÐµÑ€ÐµÐ· Ð¼Ð¾Ð´ÐµÐ¼"]
    I --> J["Ð£ÑÐ¿ÐµÑ…"]
    
    C -->|ÐžÑ„Ð¸Ñ| K["ÐžÑ‚ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ Ð¼Ð°Ñ€ÑˆÑ€ÑƒÑ‚Ð¾Ð² Ð¼Ð¾Ð´ÐµÐ¼Ð°"]
    K --> L["Ð’ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ Ethernet"]
    L --> M["Ð’Ð¾ÑÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ default route"]
    M --> N["ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð¾Ñ„Ð¸ÑÐ½Ð¾Ð³Ð¾ IP"]
    N --> J
```

### Ð ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ

```python
# agent/network/switcher.py

import subprocess
import socket
import time
from typing import Optional, Tuple
from dataclasses import dataclass

import requests


@dataclass
class NetworkInterface:
    name: str
    ip: Optional[str]
    gateway: Optional[str]
    is_up: bool


class NetworkSwitcher:
    """Ð£Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÐµÑ‚ÐµÐ²Ñ‹Ð¼Ð¸ Ð¸Ð½Ñ‚ÐµÑ€Ñ„ÐµÐ¹ÑÐ°Ð¼Ð¸."""
    
    # Ð”Ð¾Ð¼ÐµÐ½Ñ‹ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ¾Ð² Ð´Ð»Ñ Ð¼Ð°Ñ€ÑˆÑ€ÑƒÑ‚Ð¸Ð·Ð°Ñ†Ð¸Ð¸ Ñ‡ÐµÑ€ÐµÐ· Ð¼Ð¾Ð´ÐµÐ¼
    MARKETPLACE_HOSTS = [
        "www.wildberries.ru",
        "wildberries.ru",
        "www.ozon.ru",
        "ozon.ru",
        "market.yandex.ru",
    ]
    
    def __init__(
        self,
        modem_interface: str,
        office_interface: str,
        vps_ip: str
    ):
        self.modem_interface = modem_interface
        self.office_interface = office_interface
        self.vps_ip = vps_ip
    
    def switch_to_modem(self) -> bool:
        """
        ÐŸÐµÑ€ÐµÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ Ð½Ð° USB-Ð¼Ð¾Ð´ÐµÐ¼.
        
        Returns:
            True ÐµÑÐ»Ð¸ ÑƒÑÐ¿ÐµÑˆÐ½Ð¾
        """
        try:
            # 1. ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð¼Ð¾Ð´ÐµÐ¼Ð°
            if not self._is_interface_available(self.modem_interface):
                raise Exception(f"Interface {self.modem_interface} not found")
            
            # 2. ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ gateway Ð¼Ð¾Ð´ÐµÐ¼Ð°
            modem_gateway = self._get_gateway(self.modem_interface)
            if not modem_gateway:
                raise Exception("Modem gateway not found")
            
            # 3. Ð”Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð¼Ð°Ñ€ÑˆÑ€ÑƒÑ‚Ð¾Ð² Ð´Ð»Ñ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ¾Ð²
            for host in self.MARKETPLACE_HOSTS:
                ips = self._resolve_host(host)
                for ip in ips:
                    self._add_route(ip, modem_gateway, self.modem_interface)
            
            # 4. Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ð¼Ð°Ñ€ÑˆÑ€ÑƒÑ‚Ð° Ðº VPS Ñ‡ÐµÑ€ÐµÐ· Ð¾Ñ„Ð¸ÑÐ½ÑƒÑŽ ÑÐµÑ‚ÑŒ
            office_gateway = self._get_gateway(self.office_interface)
            if office_gateway:
                self._add_route(self.vps_ip, office_gateway, self.office_interface)
            
            # 5. ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ°
            modem_ip = self._get_external_ip_via(self.modem_interface)
            if not modem_ip:
                raise Exception("Failed to get modem external IP")
            
            logging.info(f"Switched to modem. External IP: {modem_ip}")
            return True
            
        except Exception as e:
            logging.error(f"Failed to switch to modem: {e}")
            return False
    
    def switch_to_office(self) -> bool:
        """
        ÐŸÐµÑ€ÐµÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ Ð½Ð° Ð¾Ñ„Ð¸ÑÐ½ÑƒÑŽ ÑÐµÑ‚ÑŒ.
        
        Returns:
            True ÐµÑÐ»Ð¸ ÑƒÑÐ¿ÐµÑˆÐ½Ð¾
        """
        try:
            # 1. Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ Ð¼Ð°Ñ€ÑˆÑ€ÑƒÑ‚Ð¾Ð² Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ¾Ð²
            for host in self.MARKETPLACE_HOSTS:
                ips = self._resolve_host(host)
                for ip in ips:
                    self._delete_route(ip)
            
            # 2. Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ ÑÐ¿ÐµÑ†Ð¸Ñ„Ð¸Ñ‡Ð½Ð¾Ð³Ð¾ Ð¼Ð°Ñ€ÑˆÑ€ÑƒÑ‚Ð° Ðº VPS
            self._delete_route(self.vps_ip)
            
            # 3. ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð¾Ñ„Ð¸ÑÐ½Ð¾Ð³Ð¾ Ð¿Ð¾Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ñ
            office_ip = self._get_external_ip_via(self.office_interface)
            
            logging.info(f"Switched to office. External IP: {office_ip}")
            return True
            
        except Exception as e:
            logging.error(f"Failed to switch to office: {e}")
            return False
    
    def _is_interface_available(self, interface: str) -> bool:
        """ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸ Ð¸Ð½Ñ‚ÐµÑ€Ñ„ÐµÐ¹ÑÐ°."""
        result = subprocess.run(
            ["netsh", "interface", "show", "interface", interface],
            capture_output=True,
            text=True
        )
        return "Connected" in result.stdout
    
    def _get_gateway(self, interface: str) -> Optional[str]:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ gateway Ð´Ð»Ñ Ð¸Ð½Ñ‚ÐµÑ€Ñ„ÐµÐ¹ÑÐ°."""
        result = subprocess.run(
            ["netsh", "interface", "ip", "show", "config", interface],
            capture_output=True,
            text=True
        )
        
        for line in result.stdout.split("\n"):
            if "Default Gateway" in line:
                parts = line.split(":")
                if len(parts) > 1:
                    gateway = parts[1].strip()
                    if gateway:
                        return gateway
        
        return None
    
    def _resolve_host(self, host: str) -> list:
        """Ð Ð°Ð·Ñ€ÐµÑˆÐµÐ½Ð¸Ðµ DNS Ð¸Ð¼ÐµÐ½Ð¸ Ð² IP-Ð°Ð´Ñ€ÐµÑÐ°."""
        try:
            return list(set(
                info[4][0] for info in socket.getaddrinfo(host, 443)
            ))
        except socket.gaierror:
            return []
    
    def _add_route(
        self,
        destination: str,
        gateway: str,
        interface: str
    ) -> None:
        """Ð”Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð¼Ð°Ñ€ÑˆÑ€ÑƒÑ‚Ð°."""
        subprocess.run(
            [
                "route", "add", destination, "mask", "255.255.255.255",
                gateway, "metric", "1", "if", self._get_interface_index(interface)
            ],
            capture_output=True
        )
    
    def _delete_route(self, destination: str) -> None:
        """Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ Ð¼Ð°Ñ€ÑˆÑ€ÑƒÑ‚Ð°."""
        subprocess.run(
            ["route", "delete", destination],
            capture_output=True
        )
    
    def _get_interface_index(self, interface: str) -> str:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¸Ð½Ð´ÐµÐºÑÐ° Ð¸Ð½Ñ‚ÐµÑ€Ñ„ÐµÐ¹ÑÐ°."""
        result = subprocess.run(
            ["netsh", "interface", "ipv4", "show", "interfaces"],
            capture_output=True,
            text=True
        )
        
        for line in result.stdout.split("\n"):
            if interface in line:
                parts = line.split()
                if parts:
                    return parts[0]
        
        return "1"
    
    def _get_external_ip_via(self, interface: str) -> Optional[str]:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð²Ð½ÐµÑˆÐ½ÐµÐ³Ð¾ IP Ñ‡ÐµÑ€ÐµÐ· ÑƒÐºÐ°Ð·Ð°Ð½Ð½Ñ‹Ð¹ Ð¸Ð½Ñ‚ÐµÑ€Ñ„ÐµÐ¹Ñ."""
        try:
            # ÐŸÑ€Ð¸Ð²ÑÐ·ÐºÐ° Ðº Ð¸Ð½Ñ‚ÐµÑ€Ñ„ÐµÐ¹ÑÑƒ
            local_ip = self._get_local_ip(interface)
            
            response = requests.get(
                "https://api.ipify.org",
                timeout=10,
                # Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼ source_address Ð´Ð»Ñ Ð¿Ñ€Ð¸Ð²ÑÐ·ÐºÐ¸
            )
            return response.text
        except:
            return None
    
    def _get_local_ip(self, interface: str) -> Optional[str]:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð»Ð¾ÐºÐ°Ð»ÑŒÐ½Ð¾Ð³Ð¾ IP Ð¸Ð½Ñ‚ÐµÑ€Ñ„ÐµÐ¹ÑÐ°."""
        result = subprocess.run(
            ["netsh", "interface", "ip", "show", "addresses", interface],
            capture_output=True,
            text=True
        )
        
        for line in result.stdout.split("\n"):
            if "IP Address" in line:
                parts = line.split(":")
                if len(parts) > 1:
                    return parts[1].strip()
        
        return None
```

---

## 2.5 Modem Controller

### ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

Ð£Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ USB-Ð¼Ð¾Ð´ÐµÐ¼Ð¾Ð¼ Ñ‡ÐµÑ€ÐµÐ· AT-ÐºÐ¾Ð¼Ð°Ð½Ð´Ñ‹: Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÐ° ÑÑ‚Ð°Ñ‚ÑƒÑÐ°, Ð¿ÐµÑ€ÐµÐ·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ°, Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸.

### AT-ÐºÐ¾Ð¼Ð°Ð½Ð´Ñ‹

| ÐšÐ¾Ð¼Ð°Ð½Ð´Ð° | ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ | ÐžÑ‚Ð²ÐµÑ‚ |
|---------|----------|-------|
| `AT` | ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° ÑÐ²ÑÐ·Ð¸ | `OK` |
| `AT+CPIN?` | Ð¡Ñ‚Ð°Ñ‚ÑƒÑ SIM-ÐºÐ°Ñ€Ñ‚Ñ‹ | `+CPIN: READY` |
| `AT+CSQ` | Ð£Ñ€Ð¾Ð²ÐµÐ½ÑŒ ÑÐ¸Ð³Ð½Ð°Ð»Ð° | `+CSQ: 15,99` |
| `AT+COPS?` | Ð¢ÐµÐºÑƒÑ‰Ð¸Ð¹ Ð¾Ð¿ÐµÑ€Ð°Ñ‚Ð¾Ñ€ | `+COPS: 0,0,"MegaFon"` |
| `AT+CGDCONT?` | ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ APN | `+CGDCONT: 1,"IP","internet"` |
| `AT^RESET` | ÐŸÐµÑ€ÐµÐ·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° Ð¼Ð¾Ð´ÐµÐ¼Ð° | â€” |
| `AT+CFUN=1,1` | ÐŸÐµÑ€ÐµÐ·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° (Ð°Ð»ÑŒÑ‚ÐµÑ€Ð½Ð°Ñ‚Ð¸Ð²Ð°) | `OK` |

### Ð ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ

```python
# agent/network/modem.py

import serial
import time
from typing import Optional, Tuple
from dataclasses import dataclass
from enum import Enum


class ModemStatus(Enum):
    OK = "ok"
    NO_SIM = "no_sim"
    NO_SIGNAL = "no_signal"
    ERROR = "error"
    NOT_FOUND = "not_found"


@dataclass
class ModemInfo:
    status: ModemStatus
    operator: Optional[str]
    signal_strength: Optional[int]  # 0-31, 99=unknown
    sim_ready: bool


class ModemController:
    """Ð£Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ USB-Ð¼Ð¾Ð´ÐµÐ¼Ð¾Ð¼ Ñ‡ÐµÑ€ÐµÐ· AT-ÐºÐ¾Ð¼Ð°Ð½Ð´Ñ‹."""
    
    def __init__(self, com_port: str, baud_rate: int = 115200):
        self.com_port = com_port
        self.baud_rate = baud_rate
        self.serial: Optional[serial.Serial] = None
    
    def connect(self) -> bool:
        """ÐŸÐ¾Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ Ðº Ð¼Ð¾Ð´ÐµÐ¼Ñƒ."""
        try:
            self.serial = serial.Serial(
                port=self.com_port,
                baudrate=self.baud_rate,
                timeout=5,
                write_timeout=5
            )
            
            # ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° ÑÐ²ÑÐ·Ð¸
            response = self._send_command("AT")
            return "OK" in response
            
        except serial.SerialException as e:
            logging.error(f"Failed to connect to modem: {e}")
            return False
    
    def disconnect(self) -> None:
        """ÐžÑ‚ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ Ð¾Ñ‚ Ð¼Ð¾Ð´ÐµÐ¼Ð°."""
        if self.serial and self.serial.is_open:
            self.serial.close()
    
    def get_info(self) -> ModemInfo:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸ Ð¾ Ð¼Ð¾Ð´ÐµÐ¼Ðµ."""
        if not self.serial or not self.serial.is_open:
            return ModemInfo(
                status=ModemStatus.NOT_FOUND,
                operator=None,
                signal_strength=None,
                sim_ready=False
            )
        
        # ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° SIM
        sim_response = self._send_command("AT+CPIN?")
        sim_ready = "READY" in sim_response
        
        if not sim_ready:
            return ModemInfo(
                status=ModemStatus.NO_SIM,
                operator=None,
                signal_strength=None,
                sim_ready=False
            )
        
        # Ð£Ñ€Ð¾Ð²ÐµÐ½ÑŒ ÑÐ¸Ð³Ð½Ð°Ð»Ð°
        signal_response = self._send_command("AT+CSQ")
        signal_strength = self._parse_signal(signal_response)
        
        if signal_strength == 99 or signal_strength == 0:
            return ModemInfo(
                status=ModemStatus.NO_SIGNAL,
                operator=None,
                signal_strength=signal_strength,
                sim_ready=True
            )
        
        # ÐžÐ¿ÐµÑ€Ð°Ñ‚Ð¾Ñ€
        operator_response = self._send_command("AT+COPS?")
        operator = self._parse_operator(operator_response)
        
        return ModemInfo(
            status=ModemStatus.OK,
            operator=operator,
            signal_strength=signal_strength,
            sim_ready=True
        )
    
    def reboot(self) -> bool:
        """
        ÐŸÐµÑ€ÐµÐ·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° Ð¼Ð¾Ð´ÐµÐ¼Ð°.
        
        Returns:
            True ÐµÑÐ»Ð¸ ÐºÐ¾Ð¼Ð°Ð½Ð´Ð° Ð¾Ñ‚Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð° ÑƒÑÐ¿ÐµÑˆÐ½Ð¾
        """
        try:
            # ÐŸÐ¾Ð¿Ñ‹Ñ‚ÐºÐ° 1: AT^RESET (Huawei)
            response = self._send_command("AT^RESET", timeout=2)
            
            if "ERROR" in response:
                # ÐŸÐ¾Ð¿Ñ‹Ñ‚ÐºÐ° 2: AT+CFUN=1,1 (ÑƒÐ½Ð¸Ð²ÐµÑ€ÑÐ°Ð»ÑŒÐ½Ð°Ñ)
                response = self._send_command("AT+CFUN=1,1", timeout=2)
            
            # Ð—Ð°ÐºÑ€Ñ‹Ð²Ð°ÐµÐ¼ ÑÐ¾ÐµÐ´Ð¸Ð½ÐµÐ½Ð¸Ðµ
            self.disconnect()
            
            # ÐžÐ¶Ð¸Ð´Ð°Ð½Ð¸Ðµ Ð¿ÐµÑ€ÐµÐ·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ¸
            time.sleep(30)
            
            # ÐŸÐ¾Ð¿Ñ‹Ñ‚ÐºÐ° Ð¿ÐµÑ€ÐµÐ¿Ð¾Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ñ
            for attempt in range(5):
                time.sleep(5)
                if self.connect():
                    info = self.get_info()
                    if info.status == ModemStatus.OK:
                        return True
            
            return False
            
        except Exception as e:
            logging.error(f"Modem reboot failed: {e}")
            return False
    
    def _send_command(
        self,
        command: str,
        timeout: float = 5
    ) -> str:
        """ÐžÑ‚Ð¿Ñ€Ð°Ð²ÐºÐ° AT-ÐºÐ¾Ð¼Ð°Ð½Ð´Ñ‹ Ð¸ Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¾Ñ‚Ð²ÐµÑ‚Ð°."""
        if not self.serial or not self.serial.is_open:
            return ""
        
        # ÐžÑ‡Ð¸ÑÑ‚ÐºÐ° Ð±ÑƒÑ„ÐµÑ€Ð°
        self.serial.reset_input_buffer()
        
        # ÐžÑ‚Ð¿Ñ€Ð°Ð²ÐºÐ° ÐºÐ¾Ð¼Ð°Ð½Ð´Ñ‹
        self.serial.write(f"{command}\r\n".encode())
        
        # Ð§Ñ‚ÐµÐ½Ð¸Ðµ Ð¾Ñ‚Ð²ÐµÑ‚Ð°
        response = ""
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            if self.serial.in_waiting:
                chunk = self.serial.read(self.serial.in_waiting).decode("utf-8", errors="ignore")
                response += chunk
                
                if "OK" in response or "ERROR" in response:
                    break
            
            time.sleep(0.1)
        
        return response
    
    def _parse_signal(self, response: str) -> int:
        """ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ ÑƒÑ€Ð¾Ð²Ð½Ñ ÑÐ¸Ð³Ð½Ð°Ð»Ð° Ð¸Ð· Ð¾Ñ‚Ð²ÐµÑ‚Ð° AT+CSQ."""
        # +CSQ: 15,99
        try:
            if "+CSQ:" in response:
                parts = response.split(":")[1].split(",")
                return int(parts[0].strip())
        except:
            pass
        return 99
    
    def _parse_operator(self, response: str) -> Optional[str]:
        """ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ Ð¾Ð¿ÐµÑ€Ð°Ñ‚Ð¾Ñ€Ð° Ð¸Ð· Ð¾Ñ‚Ð²ÐµÑ‚Ð° AT+COPS?."""
        # +COPS: 0,0,"MegaFon",7
        try:
            if "+COPS:" in response and '"' in response:
                start = response.index('"') + 1
                end = response.index('"', start)
                return response[start:end]
        except:
            pass
        return None
```

### ÐÐ¿Ð¿Ð°Ñ€Ð°Ñ‚Ð½Ð°Ñ Ð¿ÐµÑ€ÐµÐ·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° Ñ‡ÐµÑ€ÐµÐ· USB Hub

```python
# agent/network/modem.py (Ð´Ð¾Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ðµ)

class USBHubController:
    """
    Ð£Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ USB-Ñ…Ð°Ð±Ð¾Ð¼ Ñ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÐµÐ¼ Ð¿Ð¸Ñ‚Ð°Ð½Ð¸Ñ.
    ÐŸÐ¾Ð´Ð´ÐµÑ€Ð¶Ð¸Ð²Ð°ÐµÐ¼Ñ‹Ðµ Ð¼Ð¾Ð´ÐµÐ»Ð¸: Yepkit YKUSH, Acroname USBHub
    """
    
    def __init__(self, hub_type: str, port: int):
        self.hub_type = hub_type
        self.port = port
    
    def power_cycle(self, off_duration: int = 10) -> bool:
        """
        Ð¦Ð¸ÐºÐ» Ð¿Ð¸Ñ‚Ð°Ð½Ð¸Ñ: Ð²Ñ‹ÐºÐ»ÑŽÑ‡Ð¸Ñ‚ÑŒ â†’ Ð¿Ð¾Ð´Ð¾Ð¶Ð´Ð°Ñ‚ÑŒ â†’ Ð²ÐºÐ»ÑŽÑ‡Ð¸Ñ‚ÑŒ.
        
        Args:
            off_duration: Ð’Ñ€ÐµÐ¼Ñ Ð±ÐµÐ· Ð¿Ð¸Ñ‚Ð°Ð½Ð¸Ñ Ð² ÑÐµÐºÑƒÐ½Ð´Ð°Ñ…
        
        Returns:
            True ÐµÑÐ»Ð¸ ÑƒÑÐ¿ÐµÑˆÐ½Ð¾
        """
        try:
            if self.hub_type == "ykush":
                return self._ykush_power_cycle(off_duration)
            else:
                raise ValueError(f"Unknown hub type: {self.hub_type}")
                
        except Exception as e:
            logging.error(f"USB power cycle failed: {e}")
            return False
    
    def _ykush_power_cycle(self, off_duration: int) -> bool:
        """Ð£Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ñ‡ÐµÑ€ÐµÐ· Yepkit YKUSH."""
        import subprocess
        
        # Ð’Ñ‹ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ Ð¿Ð¾Ñ€Ñ‚Ð°
        result = subprocess.run(
            ["ykushcmd", "-d", str(self.port)],
            capture_output=True
        )
        
        if result.returncode != 0:
            return False
        
        time.sleep(off_duration)
        
        # Ð’ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ Ð¿Ð¾Ñ€Ñ‚Ð°
        result = subprocess.run(
            ["ykushcmd", "-u", str(self.port)],
            capture_output=True
        )
        
        return result.returncode == 0
```

---

## 2.6 Browser Controller

### ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

Ð£Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð±Ñ€Ð°ÑƒÐ·ÐµÑ€Ð¾Ð¼ Playwright Ð´Ð»Ñ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð° ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ† Ñ ÑÐ¼ÑƒÐ»ÑÑ†Ð¸ÐµÐ¹ Ñ‡ÐµÐ»Ð¾Ð²ÐµÑ‡ÐµÑÐºÐ¾Ð³Ð¾ Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸Ñ.

### Ð ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ

```python
# agent/browser/controller.py

import asyncio
import random
from typing import Optional, Dict, List
from pathlib import Path

from playwright.async_api import async_playwright, Browser, Page, BrowserContext


class BrowserController:
    """Ð£Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð±Ñ€Ð°ÑƒÐ·ÐµÑ€Ð¾Ð¼ Ð´Ð»Ñ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð°."""
    
    def __init__(
        self,
        cookies_path: str,
        headless: bool = True,
        user_agent: Optional[str] = None
    ):
        self.cookies_path = Path(cookies_path)
        self.headless = headless
        self.user_agent = user_agent or self._generate_user_agent()
        
        self.playwright = None
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
        self.page: Optional[Page] = None
    
    async def start(self) -> None:
        """Ð—Ð°Ð¿ÑƒÑÐº Ð±Ñ€Ð°ÑƒÐ·ÐµÑ€Ð°."""
        self.playwright = await async_playwright().start()
        
        self.browser = await self.playwright.chromium.launch(
            headless=self.headless,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--disable-dev-shm-usage",
                "--no-sandbox",
            ]
        )
        
        self.context = await self.browser.new_context(
            user_agent=self.user_agent,
            viewport={"width": 1920, "height": 1080},
            locale="ru-RU",
            timezone_id="Europe/Moscow",
        )
        
        # Ð—Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° cookies
        await self._load_cookies()
        
        # ÐÐ½Ñ‚Ð¸Ð´ÐµÑ‚ÐµÐºÑ‚
        await self._setup_antidetect()
        
        self.page = await self.context.new_page()
    
    async def stop(self) -> None:
        """ÐžÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐ° Ð±Ñ€Ð°ÑƒÐ·ÐµÑ€Ð°."""
        if self.page:
            await self.page.close()
        if self.context:
            await self.context.close()
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()
    
    async def navigate(self, url: str) -> str:
        """
        ÐŸÐµÑ€ÐµÑ…Ð¾Ð´ Ð½Ð° ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñƒ Ñ ÑÐ¼ÑƒÐ»ÑÑ†Ð¸ÐµÐ¹ Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸Ñ.
        
        Args:
            url: URL ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹
        
        Returns:
            Ð¢ÐµÐºÑÑ‚Ð¾Ð²Ð¾Ðµ ÑÐ¾Ð´ÐµÑ€Ð¶Ð¸Ð¼Ð¾Ðµ ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹
        """
        if not self.page:
            raise RuntimeError("Browser not started")
        
        # ÐŸÐµÑ€ÐµÑ…Ð¾Ð´
        await self.page.goto(url, wait_until="domcontentloaded")
        
        # ÐžÐ¶Ð¸Ð´Ð°Ð½Ð¸Ðµ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ¸
        await self.page.wait_for_load_state("networkidle")
        
        # Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ Ñ‚ÐµÐºÑÑ‚Ð°
        text = await self.page.evaluate("document.body.innerText")
        
        return text
    
    async def _load_cookies(self) -> None:
        """Ð—Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° cookies Ð¸Ð· Ñ„Ð°Ð¹Ð»Ð°."""
        import json
        
        with open(self.cookies_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        cookies = []
        for cookie in data.get("cookies", []):
            cookies.append({
                "name": cookie["name"],
                "value": cookie["value"],
                "domain": cookie["domain"],
                "path": cookie.get("path", "/"),
                "secure": cookie.get("secure", False),
                "httpOnly": cookie.get("httpOnly", False),
            })
        
        await self.context.add_cookies(cookies)
    
    async def _setup_antidetect(self) -> None:
        """ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ° Ð°Ð½Ñ‚Ð¸Ð´ÐµÑ‚ÐµÐºÑ‚ ÑÐºÑ€Ð¸Ð¿Ñ‚Ð¾Ð²."""
        await self.context.add_init_script("""
            // Ð¡ÐºÑ€Ñ‹Ñ‚Ð¸Ðµ webdriver
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
            
            // ÐŸÐ¾Ð´Ð¼ÐµÐ½Ð° plugins
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5]
            });
            
            // ÐŸÐ¾Ð´Ð¼ÐµÐ½Ð° languages
            Object.defineProperty(navigator, 'languages', {
                get: () => ['ru-RU', 'ru', 'en-US', 'en']
            });
            
            // Chrome runtime
            window.chrome = {
                runtime: {}
            };
            
            // Permissions
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' ?
                    Promise.resolve({ state: Notification.permission }) :
                    originalQuery(parameters)
            );
        """)
    
    def _generate_user_agent(self) -> str:
        """Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Ñ€ÐµÐ°Ð»Ð¸ÑÑ‚Ð¸Ñ‡Ð½Ð¾Ð³Ð¾ User-Agent."""
        chrome_versions = ["120.0.0.0", "121.0.0.0", "122.0.0.0"]
        version = random.choice(chrome_versions)
        
        return (
            f"Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            f"AppleWebKit/537.36 (KHTML, like Gecko) "
            f"Chrome/{version} Safari/537.36"
        )
```

---

## 2.7 Emulation Engine

### ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

Ð­Ð¼ÑƒÐ»ÑÑ†Ð¸Ñ Ñ‡ÐµÐ»Ð¾Ð²ÐµÑ‡ÐµÑÐºÐ¾Ð³Ð¾ Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸Ñ Ð¿Ñ€Ð¸ Ð¿Ñ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€Ðµ ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†: Ð´Ð²Ð¸Ð¶ÐµÐ½Ð¸Ñ Ð¼Ñ‹ÑˆÐ¸, ÑÐºÑ€Ð¾Ð»Ð», Ð·Ð°Ð´ÐµÑ€Ð¶ÐºÐ¸.

### ÐŸÐ°Ñ€Ð°Ð¼ÐµÑ‚Ñ€Ñ‹ ÑÐ¼ÑƒÐ»ÑÑ†Ð¸Ð¸

| ÐŸÐ°Ñ€Ð°Ð¼ÐµÑ‚Ñ€ | ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ | Ð”Ð¸Ð°Ð¿Ð°Ð·Ð¾Ð½ |
|----------|----------|----------|
| `min_delay_ms` | ÐœÐ¸Ð½Ð¸Ð¼Ð°Ð»ÑŒÐ½Ð°Ñ Ð·Ð°Ð´ÐµÑ€Ð¶ÐºÐ° Ð¼ÐµÐ¶Ð´Ñƒ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸ÑÐ¼Ð¸ | 1000-5000 |
| `max_delay_ms` | ÐœÐ°ÐºÑÐ¸Ð¼Ð°Ð»ÑŒÐ½Ð°Ñ Ð·Ð°Ð´ÐµÑ€Ð¶ÐºÐ° Ð¼ÐµÐ¶Ð´Ñƒ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸ÑÐ¼Ð¸ | 3000-10000 |
| `scroll_enabled` | Ð’ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ ÑÐºÑ€Ð¾Ð»Ð»Ð° | true/false |
| `scroll_steps` | ÐšÐ¾Ð»Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾ ÑˆÐ°Ð³Ð¾Ð² ÑÐºÑ€Ð¾Ð»Ð»Ð° | 1-10 |
| `mouse_movement` | Ð’ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ Ð´Ð²Ð¸Ð¶ÐµÐ½Ð¸Ð¹ Ð¼Ñ‹ÑˆÐ¸ | true/false |
| `mouse_curve` | Ð¢Ð¸Ð¿ ÐºÑ€Ð¸Ð²Ð¾Ð¹ Ð´Ð²Ð¸Ð¶ÐµÐ½Ð¸Ñ | bezier/linear |
| `page_view_min_ms` | ÐœÐ¸Ð½Ð¸Ð¼Ð°Ð»ÑŒÐ½Ð¾Ðµ Ð²Ñ€ÐµÐ¼Ñ Ð¿Ñ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€Ð° ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹ | 2000-5000 |
| `page_view_max_ms` | ÐœÐ°ÐºÑÐ¸Ð¼Ð°Ð»ÑŒÐ½Ð¾Ðµ Ð²Ñ€ÐµÐ¼Ñ Ð¿Ñ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€Ð° ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹ | 5000-15000 |

### Ð ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ

```python
# agent/browser/emulation.py

import asyncio
import random
import math
from typing import Tuple, List
from dataclasses import dataclass

from playwright.async_api import Page


@dataclass
class EmulationConfig:
    """ÐšÐ¾Ð½Ñ„Ð¸Ð³ÑƒÑ€Ð°Ñ†Ð¸Ñ ÑÐ¼ÑƒÐ»ÑÑ†Ð¸Ð¸."""
    min_delay_ms: int = 2000
    max_delay_ms: int = 5000
    scroll_enabled: bool = True
    scroll_steps: int = 3
    mouse_movement: bool = True
    mouse_curve: str = "bezier"  # bezier | linear
    page_view_min_ms: int = 3000
    page_view_max_ms: int = 8000
    random_order: bool = True


class EmulationEngine:
    """Ð”Ð²Ð¸Ð¶Ð¾Ðº ÑÐ¼ÑƒÐ»ÑÑ†Ð¸Ð¸ Ñ‡ÐµÐ»Ð¾Ð²ÐµÑ‡ÐµÑÐºÐ¾Ð³Ð¾ Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸Ñ."""
    
    def __init__(self, page: Page, config: EmulationConfig):
        self.page = page
        self.config = config
        self.current_position = (0, 0)
    
    async def emulate_page_view(self) -> None:
        """ÐŸÐ¾Ð»Ð½Ð°Ñ ÑÐ¼ÑƒÐ»ÑÑ†Ð¸Ñ Ð¿Ñ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€Ð° ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹."""
        # 1. ÐÐ°Ñ‡Ð°Ð»ÑŒÐ½Ð°Ñ Ð·Ð°Ð´ÐµÑ€Ð¶ÐºÐ° (Ñ‡ÐµÐ»Ð¾Ð²ÐµÐº Ñ‡Ð¸Ñ‚Ð°ÐµÑ‚ Ð·Ð°Ð³Ð¾Ð»Ð¾Ð²Ð¾Ðº)
        await self._random_delay(1000, 2000)
        
        # 2. Ð”Ð²Ð¸Ð¶ÐµÐ½Ð¸Ðµ Ð¼Ñ‹ÑˆÐ¸ Ð² ÑÐ»ÑƒÑ‡Ð°Ð¹Ð½ÑƒÑŽ Ñ‚Ð¾Ñ‡ÐºÑƒ
        if self.config.mouse_movement:
            await self._move_mouse_to_random()
        
        # 3. Ð¡ÐºÑ€Ð¾Ð»Ð» ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹
        if self.config.scroll_enabled:
            await self._scroll_page()
        
        # 4. Ð’Ñ€ÐµÐ¼Ñ Ð¿Ñ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€Ð° ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð°
        await self._random_delay(
            self.config.page_view_min_ms,
            self.config.page_view_max_ms
        )
        
        # 5. Ð”Ð¾Ð¿Ð¾Ð»Ð½Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ ÑÐ»ÑƒÑ‡Ð°Ð¹Ð½Ñ‹Ðµ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ
        if random.random() < 0.3:  # 30% ÑˆÐ°Ð½Ñ
            await self._move_mouse_to_random()
    
    async def wait_between_actions(self) -> None:
        """Ð—Ð°Ð´ÐµÑ€Ð¶ÐºÐ° Ð¼ÐµÐ¶Ð´Ñƒ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸ÑÐ¼Ð¸."""
        await self._random_delay(
            self.config.min_delay_ms,
            self.config.max_delay_ms
        )
    
    async def _random_delay(self, min_ms: int, max_ms: int) -> None:
        """Ð¡Ð»ÑƒÑ‡Ð°Ð¹Ð½Ð°Ñ Ð·Ð°Ð´ÐµÑ€Ð¶ÐºÐ°."""
        delay = random.randint(min_ms, max_ms) / 1000
        await asyncio.sleep(delay)
    
    async def _move_mouse_to_random(self) -> None:
        """Ð”Ð²Ð¸Ð¶ÐµÐ½Ð¸Ðµ Ð¼Ñ‹ÑˆÐ¸ Ð² ÑÐ»ÑƒÑ‡Ð°Ð¹Ð½ÑƒÑŽ Ñ‚Ð¾Ñ‡ÐºÑƒ."""
        viewport = self.page.viewport_size
        if not viewport:
            return
        
        # Ð¡Ð»ÑƒÑ‡Ð°Ð¹Ð½Ð°Ñ Ñ†ÐµÐ»ÐµÐ²Ð°Ñ Ñ‚Ð¾Ñ‡ÐºÐ°
        target_x = random.randint(100, viewport["width"] - 100)
        target_y = random.randint(100, viewport["height"] - 100)
        
        # Ð”Ð²Ð¸Ð¶ÐµÐ½Ð¸Ðµ Ð¿Ð¾ ÐºÑ€Ð¸Ð²Ð¾Ð¹
        if self.config.mouse_curve == "bezier":
            await self._move_mouse_bezier(target_x, target_y)
        else:
            await self._move_mouse_linear(target_x, target_y)
        
        self.current_position = (target_x, target_y)
    
    async def _move_mouse_bezier(self, target_x: int, target_y: int) -> None:
        """Ð”Ð²Ð¸Ð¶ÐµÐ½Ð¸Ðµ Ð¼Ñ‹ÑˆÐ¸ Ð¿Ð¾ ÐºÑ€Ð¸Ð²Ð¾Ð¹ Ð‘ÐµÐ·ÑŒÐµ."""
        start_x, start_y = self.current_position
        
        # ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÑŒÐ½Ñ‹Ðµ Ñ‚Ð¾Ñ‡ÐºÐ¸
        ctrl1_x = start_x + random.randint(-100, 100)
        ctrl1_y = start_y + random.randint(-100, 100)
        ctrl2_x = target_x + random.randint(-100, 100)
        ctrl2_y = target_y + random.randint(-100, 100)
        
        # Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Ñ‚Ð¾Ñ‡ÐµÐº ÐºÑ€Ð¸Ð²Ð¾Ð¹
        steps = random.randint(20, 40)
        points = self._bezier_curve(
            (start_x, start_y),
            (ctrl1_x, ctrl1_y),
            (ctrl2_x, ctrl2_y),
            (target_x, target_y),
            steps
        )
        
        # Ð”Ð²Ð¸Ð¶ÐµÐ½Ð¸Ðµ Ð¿Ð¾ Ñ‚Ð¾Ñ‡ÐºÐ°Ð¼
        for x, y in points:
            await self.page.mouse.move(x, y)
            await asyncio.sleep(random.uniform(0.01, 0.03))
    
    async def _move_mouse_linear(self, target_x: int, target_y: int) -> None:
        """Ð›Ð¸Ð½ÐµÐ¹Ð½Ð¾Ðµ Ð´Ð²Ð¸Ð¶ÐµÐ½Ð¸Ðµ Ð¼Ñ‹ÑˆÐ¸."""
        start_x, start_y = self.current_position
        
        steps = random.randint(10, 20)
        
        for i in range(steps + 1):
            t = i / steps
            x = int(start_x + (target_x - start_x) * t)
            y = int(start_y + (target_y - start_y) * t)
            
            # ÐÐµÐ±Ð¾Ð»ÑŒÑˆÐ¾Ðµ ÑÐ»ÑƒÑ‡Ð°Ð¹Ð½Ð¾Ðµ Ð¾Ñ‚ÐºÐ»Ð¾Ð½ÐµÐ½Ð¸Ðµ
            x += random.randint(-2, 2)
            y += random.randint(-2, 2)
            
            await self.page.mouse.move(x, y)
            await asyncio.sleep(random.uniform(0.02, 0.05))
    
    def _bezier_curve(
        self,
        p0: Tuple[int, int],
        p1: Tuple[int, int],
        p2: Tuple[int, int],
        p3: Tuple[int, int],
        steps: int
    ) -> List[Tuple[int, int]]:
        """Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Ñ‚Ð¾Ñ‡ÐµÐº ÐºÑƒÐ±Ð¸Ñ‡ÐµÑÐºÐ¾Ð¹ ÐºÑ€Ð¸Ð²Ð¾Ð¹ Ð‘ÐµÐ·ÑŒÐµ."""
        points = []
        
        for i in range(steps + 1):
            t = i / steps
            
            # ÐšÑƒÐ±Ð¸Ñ‡ÐµÑÐºÐ°Ñ ÐºÑ€Ð¸Ð²Ð°Ñ Ð‘ÐµÐ·ÑŒÐµ
            x = (
                (1 - t) ** 3 * p0[0] +
                3 * (1 - t) ** 2 * t * p1[0] +
                3 * (1 - t) * t ** 2 * p2[0] +
                t ** 3 * p3[0]
            )
            y = (
                (1 - t) ** 3 * p0[1] +
                3 * (1 - t) ** 2 * t * p1[1] +
                3 * (1 - t) * t ** 2 * p2[1] +
                t ** 3 * p3[1]
            )
            
            points.append((int(x), int(y)))
        
        return points
    
    async def _scroll_page(self) -> None:
        """Ð¡ÐºÑ€Ð¾Ð»Ð» ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹."""
        viewport = self.page.viewport_size
        if not viewport:
            return
        
        # ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð²Ñ‹ÑÐ¾Ñ‚Ñ‹ ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹
        page_height = await self.page.evaluate("document.body.scrollHeight")
        viewport_height = viewport["height"]
        
        if page_height <= viewport_height:
            return
        
        # Ð¡ÐºÑ€Ð¾Ð»Ð» Ð²Ð½Ð¸Ð·
        current_scroll = 0
        scroll_amount = viewport_height * 0.7  # 70% ÑÐºÑ€Ð°Ð½Ð° Ð·Ð° ÑˆÐ°Ð³
        
        for _ in range(self.config.scroll_steps):
            # Ð¡Ð»ÑƒÑ‡Ð°Ð¹Ð½Ð°Ñ Ð²ÐµÐ»Ð¸Ñ‡Ð¸Ð½Ð° ÑÐºÑ€Ð¾Ð»Ð»Ð°
            scroll = scroll_amount * random.uniform(0.8, 1.2)
            
            await self.page.mouse.wheel(0, scroll)
            current_scroll += scroll
            
            # ÐŸÐ°ÑƒÐ·Ð° Ð¿Ð¾ÑÐ»Ðµ ÑÐºÑ€Ð¾Ð»Ð»Ð°
            await self._random_delay(500, 1500)
            
            # Ð¡Ð»ÑƒÑ‡Ð°Ð¹Ð½Ð¾Ðµ Ð´Ð²Ð¸Ð¶ÐµÐ½Ð¸Ðµ Ð¼Ñ‹ÑˆÐ¸
            if self.config.mouse_movement and random.random() < 0.5:
                await self._move_mouse_to_random()
            
            if current_scroll >= page_height - viewport_height:
                break
        
        # Ð’Ð¾Ð·Ð²Ñ€Ð°Ñ‚ Ð½Ð°Ð²ÐµÑ€Ñ… (Ð¸Ð½Ð¾Ð³Ð´Ð°)
        if random.random() < 0.3:
            await self._random_delay(500, 1000)
            await self.page.evaluate("window.scrollTo(0, 0)")
```

---

## 2.8 Task Manager

### ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

Ð£Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð·Ð°Ð´Ð°Ñ‡Ð°Ð¼Ð¸: Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ñ ÑÐµÑ€Ð²ÐµÑ€Ð°, Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ðµ, Ð¾Ñ‚Ð¿Ñ€Ð°Ð²ÐºÐ° Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð², Ñ€Ð°Ð±Ð¾Ñ‚Ð° Ñ Ð»Ð¾ÐºÐ°Ð»ÑŒÐ½Ñ‹Ð¼ ÐºÑÑˆÐµÐ¼.

### Ð ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ

```python
# agent/core/task_manager.py

import asyncio
from typing import Optional, List, Dict
from dataclasses import dataclass
from datetime import datetime
from enum import Enum

from agent.communication.rest_client import RestClient
from agent.browser.controller import BrowserController
from agent.browser.emulation import EmulationEngine, EmulationConfig
from agent.cache.local_db import LocalCache


class TaskStatus(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass
class Task:
    id: str
    url: str
    marketplace: str
    sku: str
    competitor_id: Optional[str]
    priority: int
    created_at: datetime


@dataclass
class TaskResult:
    task_id: str
    raw_text: str
    timing_ms: int
    success: bool
    error: Optional[str] = None


class TaskManager:
    """Ð£Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð·Ð°Ð´Ð°Ñ‡Ð°Ð¼Ð¸ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð°."""
    
    def __init__(
        self,
        rest_client: RestClient,
        browser: BrowserController,
        emulation_config: EmulationConfig,
        cache: LocalCache,
        batch_size: int = 10
    ):
        self.rest_client = rest_client
        self.browser = browser
        self.emulation = EmulationEngine(browser.page, emulation_config)
        self.cache = cache
        self.batch_size = batch_size
        
        self.current_task: Optional[Task] = None
        self.is_running = False
    
    async def run(self) -> None:
        """ÐžÑÐ½Ð¾Ð²Ð½Ð¾Ð¹ Ñ†Ð¸ÐºÐ» Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ñ Ð·Ð°Ð´Ð°Ñ‡."""
        self.is_running = True
        
        while self.is_running:
            try:
                # ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð·Ð°Ð´Ð°Ñ‡Ð¸
                task = await self._get_next_task()
                
                if not task:
                    # ÐÐµÑ‚ Ð·Ð°Ð´Ð°Ñ‡ â€” Ð¾Ð¶Ð¸Ð´Ð°Ð½Ð¸Ðµ
                    await asyncio.sleep(5)
                    continue
                
                self.current_task = task
                
                # Ð’Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ðµ Ð·Ð°Ð´Ð°Ñ‡Ð¸
                result = await self._execute_task(task)
                
                # ÐžÑ‚Ð¿Ñ€Ð°Ð²ÐºÐ° Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð°
                await self._submit_result(result)
                
                self.current_task = None
                
                # Ð—Ð°Ð´ÐµÑ€Ð¶ÐºÐ° Ð¼ÐµÐ¶Ð´Ñƒ Ð·Ð°Ð´Ð°Ñ‡Ð°Ð¼Ð¸
                await self.emulation.wait_between_actions()
                
            except Exception as e:
                logging.error(f"Task loop error: {e}")
                await asyncio.sleep(10)
    
    def stop(self) -> None:
        """ÐžÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐ° Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ñ Ð·Ð°Ð´Ð°Ñ‡."""
        self.is_running = False
    
    async def _get_next_task(self) -> Optional[Task]:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÐ»ÐµÐ´ÑƒÑŽÑ‰ÐµÐ¹ Ð·Ð°Ð´Ð°Ñ‡Ð¸."""
        try:
            # ÐŸÐ¾Ð¿Ñ‹Ñ‚ÐºÐ° Ð¿Ð¾Ð»ÑƒÑ‡Ð¸Ñ‚ÑŒ Ñ ÑÐµÑ€Ð²ÐµÑ€Ð°
            task_data = await self.rest_client.get_next_task()
            
            if task_data:
                task = Task(
                    id=task_data["id"],
                    url=task_data["url"],
                    marketplace=task_data["marketplace"],
                    sku=task_data["sku"],
                    competitor_id=task_data.get("competitor_id"),
                    priority=task_data.get("priority", 0),
                    created_at=datetime.fromisoformat(task_data["created_at"])
                )
                
                # Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ð² ÐºÑÑˆ
                self.cache.save_task(task)
                
                return task
            
            # ÐÐµÑ‚ Ð·Ð°Ð´Ð°Ñ‡ Ð½Ð° ÑÐµÑ€Ð²ÐµÑ€Ðµ â€” Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÐ° ÐºÑÑˆÐ°
            return self.cache.get_pending_task()
            
        except ConnectionError:
            # Ð¡ÐµÑ€Ð²ÐµÑ€ Ð½ÐµÐ´Ð¾ÑÑ‚ÑƒÐ¿ÐµÐ½ â€” Ñ€Ð°Ð±Ð¾Ñ‚Ð° Ð¸Ð· ÐºÑÑˆÐ°
            logging.warning("Server unavailable, using cache")
            return self.cache.get_pending_task()
    
    async def _execute_task(self, task: Task) -> TaskResult:
        """Ð’Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ðµ Ð·Ð°Ð´Ð°Ñ‡Ð¸ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð°."""
        start_time = datetime.now()
        
        try:
            # ÐŸÐµÑ€ÐµÑ…Ð¾Ð´ Ð½Ð° ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñƒ
            raw_text = await self.browser.navigate(task.url)
            
            # Ð­Ð¼ÑƒÐ»ÑÑ†Ð¸Ñ Ð¿Ñ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€Ð°
            await self.emulation.emulate_page_view()
            
            timing_ms = int((datetime.now() - start_time).total_seconds() * 1000)
            
            return TaskResult(
                task_id=task.id,
                raw_text=raw_text,
                timing_ms=timing_ms,
                success=True
            )
            
        except Exception as e:
            timing_ms = int((datetime.now() - start_time).total_seconds() * 1000)
            
            return TaskResult(
                task_id=task.id,
                raw_text="",
                timing_ms=timing_ms,
                success=False,
                error=str(e)
            )
    
    async def _submit_result(self, result: TaskResult) -> None:
        """ÐžÑ‚Ð¿Ñ€Ð°Ð²ÐºÐ° Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð° Ð½Ð° ÑÐµÑ€Ð²ÐµÑ€."""
        try:
            await self.rest_client.submit_result(
                task_id=result.task_id,
                raw_text=result.raw_text,
                timing_ms=result.timing_ms,
                success=result.success,
                error=result.error
            )
            
            # Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ Ð¸Ð· ÐºÑÑˆÐ°
            self.cache.mark_completed(result.task_id)
            
        except ConnectionError:
            # Ð¡ÐµÑ€Ð²ÐµÑ€ Ð½ÐµÐ´Ð¾ÑÑ‚ÑƒÐ¿ÐµÐ½ â€” ÑÐ¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ð² ÐºÑÑˆ
            logging.warning("Server unavailable, caching result")
            self.cache.save_result(result)
    
    async def sync_cached_results(self) -> int:
        """Ð¡Ð¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð°Ñ†Ð¸Ñ ÐºÑÑˆÐ¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ñ… Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð² Ñ ÑÐµÑ€Ð²ÐµÑ€Ð¾Ð¼."""
        results = self.cache.get_pending_results()
        synced = 0
        
        for result in results:
            try:
                await self.rest_client.submit_result(
                    task_id=result.task_id,
                    raw_text=result.raw_text,
                    timing_ms=result.timing_ms,
                    success=result.success,
                    error=result.error
                )
                
                self.cache.mark_result_synced(result.task_id)
                synced += 1
                
            except ConnectionError:
                break
        
        return synced
```

---

## 2.9 Communication Layer

### REST Client

```python
# agent/communication/rest_client.py

import aiohttp
from typing import Optional, Dict, Any
from dataclasses import dataclass


@dataclass
class RestClientConfig:
    base_url: str
    api_key: str
    timeout: int = 30
    retry_attempts: int = 3
    retry_delay: int = 5


class RestClient:
    """REST API ÐºÐ»Ð¸ÐµÐ½Ñ‚ Ð´Ð»Ñ ÑÐ²ÑÐ·Ð¸ Ñ ÑÐµÑ€Ð²ÐµÑ€Ð¾Ð¼."""
    
    def __init__(self, config: RestClientConfig, agent_id: str):
        self.config = config
        self.agent_id = agent_id
        self.session: Optional[aiohttp.ClientSession] = None
    
    async def start(self) -> None:
        """Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ HTTP ÑÐµÑÑÐ¸Ð¸."""
        self.session = aiohttp.ClientSession(
            base_url=self.config.base_url,
            headers={
                "Authorization": f"Bearer {self.config.api_key}",
                "X-Agent-ID": self.agent_id,
                "Content-Type": "application/json"
            },
            timeout=aiohttp.ClientTimeout(total=self.config.timeout)
        )
    
    async def stop(self) -> None:
        """Ð—Ð°ÐºÑ€Ñ‹Ñ‚Ð¸Ðµ HTTP ÑÐµÑÑÐ¸Ð¸."""
        if self.session:
            await self.session.close()
    
    async def get_next_task(self) -> Optional[Dict]:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÐ»ÐµÐ´ÑƒÑŽÑ‰ÐµÐ¹ Ð·Ð°Ð´Ð°Ñ‡Ð¸."""
        response = await self._request("GET", "/tasks/next")
        
        if response.status == 200:
            return await response.json()
        elif response.status == 204:
            return None
        else:
            raise Exception(f"Unexpected status: {response.status}")
    
    async def submit_result(
        self,
        task_id: str,
        raw_text: str,
        timing_ms: int,
        success: bool,
        error: Optional[str] = None
    ) -> None:
        """ÐžÑ‚Ð¿Ñ€Ð°Ð²ÐºÐ° Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð° Ð·Ð°Ð´Ð°Ñ‡Ð¸."""
        payload = {
            "raw_text": raw_text,
            "timing_ms": timing_ms,
            "success": success,
            "error": error
        }
        
        response = await self._request(
            "POST",
            f"/tasks/{task_id}/report",
            json=payload
        )
        
        if response.status != 200:
            raise Exception(f"Submit failed: {response.status}")
    
    async def send_heartbeat(self, status: str, current_task: Optional[str] = None) -> None:
        """ÐžÑ‚Ð¿Ñ€Ð°Ð²ÐºÐ° heartbeat."""
        payload = {
            "status": status,
            "current_task": current_task,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        await self._request("POST", "/agents/heartbeat", json=payload)
    
    async def report_panic(self, reason: str, details: Dict) -> None:
        """Ð¡Ð¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ðµ Ð¾ PANIC Ñ€ÐµÐ¶Ð¸Ð¼Ðµ."""
        payload = {
            "reason": reason,
            "details": details,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        await self._request("POST", "/agents/panic", json=payload)
    
    async def get_emulation_config(self) -> Dict:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð³Ð»Ð¾Ð±Ð°Ð»ÑŒÐ½Ð¾Ð¹ ÐºÐ¾Ð½Ñ„Ð¸Ð³ÑƒÑ€Ð°Ñ†Ð¸Ð¸ ÑÐ¼ÑƒÐ»ÑÑ†Ð¸Ð¸."""
        response = await self._request("GET", "/config/emulation")
        return await response.json()
    
    async def _request(
        self,
        method: str,
        path: str,
        **kwargs
    ) -> aiohttp.ClientResponse:
        """Ð’Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ðµ HTTP Ð·Ð°Ð¿Ñ€Ð¾ÑÐ° Ñ retry."""
        last_error = None
        
        for attempt in range(self.config.retry_attempts):
            try:
                response = await self.session.request(method, path, **kwargs)
                return response
                
            except aiohttp.ClientError as e:
                last_error = e
                if attempt < self.config.retry_attempts - 1:
                    await asyncio.sleep(self.config.retry_delay * (attempt + 1))
        
        raise ConnectionError(f"Request failed after {self.config.retry_attempts} attempts: {last_error}")
```

### WebSocket Client

```python
# agent/communication/ws_client.py

import asyncio
import json
from typing import Optional, Callable, Dict, Any

import websockets
from websockets.client import WebSocketClientProtocol


class WebSocketClient:
    """WebSocket ÐºÐ»Ð¸ÐµÐ½Ñ‚ Ð´Ð»Ñ Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ñ ÐºÐ¾Ð¼Ð°Ð½Ð´ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ."""
    
    def __init__(
        self,
        ws_url: str,
        api_key: str,
        agent_id: str,
        on_command: Callable[[str, Dict], None]
    ):
        self.ws_url = ws_url
        self.api_key = api_key
        self.agent_id = agent_id
        self.on_command = on_command
        
        self.websocket: Optional[WebSocketClientProtocol] = None
        self.is_running = False
        self.reconnect_delay = 5
    
    async def connect(self) -> None:
        """ÐŸÐ¾Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ Ðº WebSocket ÑÐµÑ€Ð²ÐµÑ€Ñƒ."""
        self.is_running = True
        
        while self.is_running:
            try:
                uri = f"{self.ws_url}?api_key={self.api_key}&agent_id={self.agent_id}"
                
                async with websockets.connect(uri) as websocket:
                    self.websocket = websocket
                    self.reconnect_delay = 5  # Reset delay on successful connect
                    
                    logging.info("WebSocket connected")
                    
                    await self._listen()
                    
            except Exception as e:
                logging.error(f"WebSocket error: {e}")
                
                if self.is_running:
                    logging.info(f"Reconnecting in {self.reconnect_delay}s...")
                    await asyncio.sleep(self.reconnect_delay)
                    
                    # Exponential backoff
                    self.reconnect_delay = min(self.reconnect_delay * 2, 60)
    
    async def disconnect(self) -> None:
        """ÐžÑ‚ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ Ð¾Ñ‚ WebSocket ÑÐµÑ€Ð²ÐµÑ€Ð°."""
        self.is_running = False
        
        if self.websocket:
            await self.websocket.close()
    
    async def send_ack(self, command_id: str, status: str) -> None:
        """ÐžÑ‚Ð¿Ñ€Ð°Ð²ÐºÐ° Ð¿Ð¾Ð´Ñ‚Ð²ÐµÑ€Ð¶Ð´ÐµÐ½Ð¸Ñ ÐºÐ¾Ð¼Ð°Ð½Ð´Ñ‹."""
        if self.websocket:
            message = json.dumps({
                "type": "ack",
                "command_id": command_id,
                "status": status,
                "agent_id": self.agent_id
            })
            
            await self.websocket.send(message)
    
    async def _listen(self) -> None:
        """ÐŸÑ€Ð¾ÑÐ»ÑƒÑˆÐ¸Ð²Ð°Ð½Ð¸Ðµ Ð²Ñ…Ð¾Ð´ÑÑ‰Ð¸Ñ… ÑÐ¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ð¹."""
        async for message in self.websocket:
            try:
                data = json.loads(message)
                
                if data.get("type") == "command":
                    action = data.get("action")
                    params = data.get("params", {})
                    command_id = data.get("command_id")
                    
                    logging.info(f"Received command: {action}")
                    
                    # Ð’Ñ‹Ð·Ð¾Ð² Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÐ°
                    self.on_command(action, params)
                    
                    # ÐžÑ‚Ð¿Ñ€Ð°Ð²ÐºÐ° Ð¿Ð¾Ð´Ñ‚Ð²ÐµÑ€Ð¶Ð´ÐµÐ½Ð¸Ñ
                    await self.send_ack(command_id, "received")
                    
            except json.JSONDecodeError:
                logging.error(f"Invalid JSON: {message}")
```

---

## 2.10 Local Cache

### ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ

Ð›Ð¾ÐºÐ°Ð»ÑŒÐ½Ð¾Ðµ Ñ…Ñ€Ð°Ð½Ð¸Ð»Ð¸Ñ‰Ðµ Ð·Ð°Ð´Ð°Ñ‡ Ð¸ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð² Ð´Ð»Ñ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹ Ð¿Ñ€Ð¸ Ð¿Ð¾Ñ‚ÐµÑ€Ðµ ÑÐ²ÑÐ·Ð¸ Ñ ÑÐµÑ€Ð²ÐµÑ€Ð¾Ð¼.

### Ð ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ

```python
# agent/cache/local_db.py

import sqlite3
import json
from pathlib import Path
from typing import Optional, List
from datetime import datetime
from dataclasses import asdict


class LocalCache:
    """Ð›Ð¾ÐºÐ°Ð»ÑŒÐ½Ñ‹Ð¹ ÐºÑÑˆ Ð·Ð°Ð´Ð°Ñ‡ Ð¸ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð²."""
    
    def __init__(self, db_path: str, max_tasks: int = 500):
        self.db_path = Path(db_path)
        self.max_tasks = max_tasks
        self._init_db()
    
    def _init_db(self) -> None:
        """Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð±Ð°Ð·Ñ‹ Ð´Ð°Ð½Ð½Ñ‹Ñ…."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.executescript("""
            CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                url TEXT NOT NULL,
                marketplace TEXT NOT NULL,
                sku TEXT NOT NULL,
                competitor_id TEXT,
                priority INTEGER DEFAULT 0,
                created_at TEXT NOT NULL,
                status TEXT DEFAULT 'pending'
            );
            
            CREATE TABLE IF NOT EXISTS results (
                task_id TEXT PRIMARY KEY,
                raw_text TEXT,
                timing_ms INTEGER,
                success INTEGER,
                error TEXT,
                created_at TEXT NOT NULL,
                synced INTEGER DEFAULT 0
            );
            
            CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
            CREATE INDEX IF NOT EXISTS idx_results_synced ON results(synced);
        """)
        
        conn.commit()
        conn.close()
    
    def save_task(self, task) -> None:
        """Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ð·Ð°Ð´Ð°Ñ‡Ð¸ Ð² ÐºÑÑˆ."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT OR REPLACE INTO tasks 
            (id, url, marketplace, sku, competitor_id, priority, created_at, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
        """, (
            task.id,
            task.url,
            task.marketplace,
            task.sku,
            task.competitor_id,
            task.priority,
            task.created_at.isoformat()
        ))
        
        conn.commit()
        conn.close()
        
        # ÐžÑ‡Ð¸ÑÑ‚ÐºÐ° ÑÑ‚Ð°Ñ€Ñ‹Ñ… Ð·Ð°Ð´Ð°Ñ‡
        self._cleanup_old_tasks()
    
    def get_pending_task(self) -> Optional:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð·Ð°Ð´Ð°Ñ‡Ð¸ Ð¸Ð· ÐºÑÑˆÐ°."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, url, marketplace, sku, competitor_id, priority, created_at
            FROM tasks
            WHERE status = 'pending'
            ORDER BY priority DESC, created_at ASC
            LIMIT 1
        """)
        
        row = cursor.fetchone()
        conn.close()
        
        if row:
            from agent.core.task_manager import Task
            return Task(
                id=row[0],
                url=row[1],
                marketplace=row[2],
                sku=row[3],
                competitor_id=row[4],
                priority=row[5],
                created_at=datetime.fromisoformat(row[6])
            )
        
        return None
    
    def mark_completed(self, task_id: str) -> None:
        """ÐŸÐ¾Ð¼ÐµÑ‚ÐºÐ° Ð·Ð°Ð´Ð°Ñ‡Ð¸ ÐºÐ°Ðº Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð½Ð¾Ð¹."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute(
            "UPDATE tasks SET status = 'completed' WHERE id = ?",
            (task_id,)
        )
        
        conn.commit()
        conn.close()
    
    def save_result(self, result) -> None:
        """Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð° Ð´Ð»Ñ Ð¿Ð¾ÑÐ»ÐµÐ´ÑƒÑŽÑ‰ÐµÐ¹ ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð°Ñ†Ð¸Ð¸."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT OR REPLACE INTO results
            (task_id, raw_text, timing_ms, success, error, created_at, synced)
            VALUES (?, ?, ?, ?, ?, ?, 0)
        """, (
            result.task_id,
            result.raw_text,
            result.timing_ms,
            1 if result.success else 0,
            result.error,
            datetime.utcnow().isoformat()
        ))
        
        conn.commit()
        conn.close()
    
    def get_pending_results(self) -> List:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð½ÐµÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ñ… Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð²."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT task_id, raw_text, timing_ms, success, error
            FROM results
            WHERE synced = 0
            ORDER BY created_at ASC
        """)
        
        rows = cursor.fetchall()
        conn.close()
        
        from agent.core.task_manager import TaskResult
        return [
            TaskResult(
                task_id=row[0],
                raw_text=row[1],
                timing_ms=row[2],
                success=bool(row[3]),
                error=row[4]
            )
            for row in rows
        ]
    
    def mark_result_synced(self, task_id: str) -> None:
        """ÐŸÐ¾Ð¼ÐµÑ‚ÐºÐ° Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð° ÐºÐ°Ðº ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾Ð³Ð¾."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute(
            "UPDATE results SET synced = 1 WHERE task_id = ?",
            (task_id,)
        )
        
        conn.commit()
        conn.close()
    
    def _cleanup_old_tasks(self) -> None:
        """ÐžÑ‡Ð¸ÑÑ‚ÐºÐ° ÑÑ‚Ð°Ñ€Ñ‹Ñ… Ð·Ð°Ð´Ð°Ñ‡ Ð¿Ñ€Ð¸ Ð¿Ñ€ÐµÐ²Ñ‹ÑˆÐµÐ½Ð¸Ð¸ Ð»Ð¸Ð¼Ð¸Ñ‚Ð°."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM tasks WHERE status = 'pending'")
        count = cursor.fetchone()[0]
        
        if count > self.max_tasks:
            # Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ ÑÐ°Ð¼Ñ‹Ñ… ÑÑ‚Ð°Ñ€Ñ‹Ñ… Ð·Ð°Ð´Ð°Ñ‡
            delete_count = count - self.max_tasks
            cursor.execute("""
                DELETE FROM tasks
                WHERE id IN (
                    SELECT id FROM tasks
                    WHERE status = 'pending'
                    ORDER BY created_at ASC
                    LIMIT ?
                )
            """, (delete_count,))
            
            conn.commit()
        
        conn.close()
    
    def get_stats(self) -> Dict:
        """Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ° ÐºÑÑˆÐ°."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM tasks WHERE status = 'pending'")
        pending_tasks = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM results WHERE synced = 0")
        pending_results = cursor.fetchone()[0]
        
        conn.close()
        
        return {
            "pending_tasks": pending_tasks,
            "pending_results": pending_results
        }
```

---

## 2.11 Windows Service

### Ð£ÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐ°

```python
# install_service.py

import sys
import win32serviceutil
import win32service
import win32event
import servicemanager

from agent.main import WatcherAgent


class WatcherService(win32serviceutil.ServiceFramework):
    """Windows Service wrapper Ð´Ð»Ñ Watcher Agent."""
    
    _svc_name_ = "WatcherAgent"
    _svc_display_name_ = "ADOLF Watcher Agent"
    _svc_description_ = "ÐÐ²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ð¹ ÑÐ±Ð¾Ñ€ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¾ Ñ†ÐµÐ½Ð°Ñ… ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð¾Ð²"
    
    def __init__(self, args):
        win32serviceutil.ServiceFramework.__init__(self, args)
        self.stop_event = win32event.CreateEvent(None, 0, 0, None)
        self.agent = None
    
    def SvcStop(self):
        """ÐžÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐ° ÑÐ»ÑƒÐ¶Ð±Ñ‹."""
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        win32event.SetEvent(self.stop_event)
        
        if self.agent:
            self.agent.stop()
    
    def SvcDoRun(self):
        """Ð—Ð°Ð¿ÑƒÑÐº ÑÐ»ÑƒÐ¶Ð±Ñ‹."""
        servicemanager.LogMsg(
            servicemanager.EVENTLOG_INFORMATION_TYPE,
            servicemanager.PYS_SERVICE_STARTED,
            (self._svc_name_, "")
        )
        
        self.agent = WatcherAgent()
        self.agent.run()


if __name__ == "__main__":
    if len(sys.argv) == 1:
        servicemanager.Initialize()
        servicemanager.PrepareToHostSingle(WatcherService)
        servicemanager.StartServiceCtrlDispatcher()
    else:
        win32serviceutil.HandleCommandLine(WatcherService)
```

### ÐšÐ¾Ð¼Ð°Ð½Ð´Ñ‹ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ

```bash
# Ð£ÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐ° ÑÐ»ÑƒÐ¶Ð±Ñ‹
python install_service.py install

# Ð—Ð°Ð¿ÑƒÑÐº
python install_service.py start

# ÐžÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐ°
python install_service.py stop

# Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ
python install_service.py remove

# Ð¡Ñ‚Ð°Ñ‚ÑƒÑ
sc query WatcherAgent
```

---

## 2.12 ÐšÐ¾Ð½Ñ„Ð¸Ð³ÑƒÑ€Ð°Ñ†Ð¸Ñ Ð°Ð³ÐµÐ½Ñ‚Ð°

### config.yaml (Ð¿Ð¾Ð»Ð½Ñ‹Ð¹ Ð¿Ñ€Ð¸Ð¼ÐµÑ€)

```yaml
# Ð˜Ð´ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ñ Ð°Ð³ÐµÐ½Ñ‚Ð°
agent_id: "AGENT-PC-MANAGER1"
api_key: "watcher_sk_xxxxxxxxxxxxx"

# ÐŸÐ¾Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ Ðº ÑÐµÑ€Ð²ÐµÑ€Ñƒ
server:
  api_url: "https://adolf.su/api/v1/watcher"
  ws_url: "wss://adolf.su/ws/watcher"
  timeout: 30
  retry_attempts: 3
  retry_delay: 5

# Ð¡ÐµÑ‚ÐµÐ²Ñ‹Ðµ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸
network:
  modem_interface: "Mobile Broadband Connection"
  office_interface: "Ethernet"
  vps_ip: "185.xxx.xxx.xxx"
  modem:
    com_port: "COM3"
    baud_rate: 115200
  usb_hub:
    enabled: false
    type: "ykush"
    port: 1

# Ð Ð°ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹
schedule:
  cookies_copy_time: "20:00"
  work_start_time: "21:00"
  work_end_time: "07:00"
  timezone: "Europe/Moscow"

# Ð‘Ñ€Ð°ÑƒÐ·ÐµÑ€
browser:
  chrome_profile_path: "C:\\Users\\Manager1\\AppData\\Local\\Google\\Chrome\\User Data\\Default"
  headless: true
  user_agent: null  # null = Ð°Ð²Ñ‚Ð¾Ð³ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ

# Ð­Ð¼ÑƒÐ»ÑÑ†Ð¸Ñ (Ð»Ð¾ÐºÐ°Ð»ÑŒÐ½Ñ‹Ðµ Ð¿ÐµÑ€ÐµÐ¾Ð¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ñ)
# null = Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ Ð³Ð»Ð¾Ð±Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ Ñ ÑÐµÑ€Ð²ÐµÑ€Ð°
emulation:
  min_delay_ms: null
  max_delay_ms: null
  scroll_enabled: null
  scroll_steps: null
  mouse_movement: null
  mouse_curve: null
  page_view_min_ms: null
  page_view_max_ms: null

# Ð›Ð¾ÐºÐ°Ð»ÑŒÐ½Ñ‹Ð¹ ÐºÑÑˆ
cache:
  enabled: true
  max_tasks: 500
  db_path: "./data/cache.db"

# Ð›Ð¾Ð³Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ
logging:
  level: "INFO"  # DEBUG | INFO | WARNING | ERROR
  file: "./logs/agent.log"
  max_size_mb: 50
  backup_count: 5
  console: true

# Panic Ñ€ÐµÐ¶Ð¸Ð¼
panic:
  cooldown_minutes: 60
  modem_reboot_enabled: true
  usb_hub_reboot_enabled: false
```

---

## ÐŸÑ€Ð¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ Ð: ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÑŒÐ½Ñ‹Ðµ Ñ‚Ð¾Ñ‡ÐºÐ¸ Ð°Ð³ÐµÐ½Ñ‚Ð°

| ÐšÑ€Ð¸Ñ‚ÐµÑ€Ð¸Ð¹ | ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° |
|----------|----------|
| Ð¡Ð»ÑƒÐ¶Ð±Ð° ÑƒÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð° | `sc query WatcherAgent` |
| Ð¡Ð»ÑƒÐ¶Ð±Ð° Ð·Ð°Ð¿ÑƒÑÐºÐ°ÐµÑ‚ÑÑ | Ð¡Ñ‚Ð°Ñ‚ÑƒÑ = RUNNING |
| Cookies ÐºÐ¾Ð¿Ð¸Ñ€ÑƒÑŽÑ‚ÑÑ | Ð¤Ð°Ð¹Ð» `cookies.json` Ð¾Ð±Ð½Ð¾Ð²Ð»ÑÐµÑ‚ÑÑ Ð² 20:00 |
| Ð¡ÐµÑ‚ÑŒ Ð¿ÐµÑ€ÐµÐºÐ»ÑŽÑ‡Ð°ÐµÑ‚ÑÑ | Ð’Ð½ÐµÑˆÐ½Ð¸Ð¹ IP Ð¼ÐµÐ½ÑÐµÑ‚ÑÑ |
| Ð—Ð°Ð´Ð°Ñ‡Ð¸ Ð¿Ð¾Ð»ÑƒÑ‡Ð°ÑŽÑ‚ÑÑ | Ð›Ð¾Ð³Ð¸ Ð¿Ð¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÑŽÑ‚ GET /tasks/next |
| Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ñ‹ Ð¾Ñ‚Ð¿Ñ€Ð°Ð²Ð»ÑÑŽÑ‚ÑÑ | Ð›Ð¾Ð³Ð¸ Ð¿Ð¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÑŽÑ‚ POST /tasks/\{id\}/report |
| WebSocket Ð¿Ð¾Ð´ÐºÐ»ÑŽÑ‡Ñ‘Ð½ | ÐšÐ¾Ð¼Ð°Ð½Ð´Ñ‹ Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÑÑŽÑ‚ÑÑ |
| ÐšÑÑˆ Ñ€Ð°Ð±Ð¾Ñ‚Ð°ÐµÑ‚ | ÐŸÑ€Ð¸ Ð¿Ð¾Ñ‚ÐµÑ€Ðµ ÑÐ²ÑÐ·Ð¸ Ð·Ð°Ð´Ð°Ñ‡Ð¸ Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÑÑŽÑ‚ÑÑ |

---

**Ð”Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚ Ð¿Ð¾Ð´Ð³Ð¾Ñ‚Ð¾Ð²Ð»ÐµÐ½:** Ð¯Ð½Ð²Ð°Ñ€ÑŒ 2026  
**Ð’ÐµÑ€ÑÐ¸Ñ:** 2.0  
**Ð¡Ñ‚Ð°Ñ‚ÑƒÑ:** Ð§ÐµÑ€Ð½Ð¾Ð²Ð¸Ðº

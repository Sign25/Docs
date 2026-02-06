---
title: "Раздел 2: Источники данных"
mode: "wide"
---

**ÐŸÑ€Ð¾ÐµÐºÑ‚:** ÐÐ²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ð·Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ð¹ Ð¿Ñ€Ð°Ð²Ð¾Ð²Ð¾Ð¹ Ð¼Ð¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³ Ð´Ð»Ñ e-commerce  
**ÐœÐ¾Ð´ÑƒÐ»ÑŒ:** Lex / Data Sources  
**Ð’ÐµÑ€ÑÐ¸Ñ:** 1.0  
**Ð”Ð°Ñ‚Ð°:** Ð¯Ð½Ð²Ð°Ñ€ÑŒ 2026

---

## 2.1 ÐžÐ±Ð·Ð¾Ñ€ Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¾Ð² Ð´Ð°Ð½Ð½Ñ‹Ñ…

### ÐšÐ°Ñ€Ñ‚Ð° Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¾Ð²

```mermaid
graph TB
    subgraph LEX["Lex Module"]
        TASK_GEN["Task Generator"]
        ADAPTERS["Source Adapters"]
        UPLOAD["Manual Upload"]
    end

    subgraph AUTO["ÐÐ²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ð¹ ÑÐ±Ð¾Ñ€ (MVP)"]
        CP["ÐšÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ð½Ñ‚ÐŸÐ»ÑŽÑ"]
        GR["Ð“Ð°Ñ€Ð°Ð½Ñ‚"]
    end

    subgraph AUTO_V2["ÐÐ²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ð¹ ÑÐ±Ð¾Ñ€ (v2.0)"]
        RG["Ð Ð¾ÑÑÐ¸Ð¹ÑÐºÐ°Ñ Ð³Ð°Ð·ÐµÑ‚Ð°"]
        PRAVO["pravo.gov.ru"]
        FNS["Ð¤ÐÐ¡"]
        RPN["Ð Ð¾ÑÐ¿Ð¾Ñ‚Ñ€ÐµÐ±Ð½Ð°Ð´Ð·Ð¾Ñ€"]
        RA["Ð Ð¾ÑÐ°ÐºÐºÑ€ÐµÐ´Ð¸Ñ‚Ð°Ñ†Ð¸Ñ"]
        CZ["Ð§ÐµÑÑ‚Ð½Ñ‹Ð¹ Ð—ÐÐÐš"]
    end

    subgraph MANUAL["Ð ÑƒÑ‡Ð½Ð°Ñ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ°"]
        URL["URL Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð°"]
        FILE["PDF / DOCX"]
    end

    TASK_GEN --> ADAPTERS
    ADAPTERS --> CP & GR
    ADAPTERS -.->|v2.0| RG & PRAVO & FNS & RPN & RA & CZ

    UPLOAD --> URL & FILE
```

### Ð¡Ð²Ð¾Ð´Ð½Ð°Ñ Ñ‚Ð°Ð±Ð»Ð¸Ñ†Ð° Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¾Ð²

| Ð˜ÑÑ‚Ð¾Ñ‡Ð½Ð¸Ðº | Ð¢Ð¸Ð¿ | ÐœÐµÑ‚Ð¾Ð´ | Ð’ÐµÑ€ÑÐ¸Ñ | ÐŸÑ€Ð¸Ð¾Ñ€Ð¸Ñ‚ÐµÑ‚ | ÐžÐ±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾ÑÑ‚ÑŒ |
|----------|-----|-------|--------|:---------:|:--------------:|
| ÐšÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ð½Ñ‚ÐŸÐ»ÑŽÑ | ÐŸÑ€Ð°Ð²Ð¾Ð²Ð°Ñ ÑÐ¸ÑÑ‚ÐµÐ¼Ð° | ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ | MVP | 1 | âœ… ÐžÐ±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾ |
| Ð“Ð°Ñ€Ð°Ð½Ñ‚ | ÐŸÑ€Ð°Ð²Ð¾Ð²Ð°Ñ ÑÐ¸ÑÑ‚ÐµÐ¼Ð° | ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ | MVP | 2 | âœ… ÐžÐ±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾ |
| Ð ÑƒÑ‡Ð½Ð°Ñ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° (URL) | ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒÑÐºÐ¸Ð¹ Ð²Ð²Ð¾Ð´ | HTTP Fetch | MVP | â€” | âœ… ÐžÐ±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾ |
| Ð ÑƒÑ‡Ð½Ð°Ñ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° (Ñ„Ð°Ð¹Ð») | ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒÑÐºÐ¸Ð¹ Ð²Ð²Ð¾Ð´ | File Parse | MVP | â€” | âœ… ÐžÐ±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾ |
| Ð Ð¾ÑÑÐ¸Ð¹ÑÐºÐ°Ñ Ð³Ð°Ð·ÐµÑ‚Ð° | ÐžÑ„Ð¸Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾Ðµ Ð¸Ð·Ð´Ð°Ð½Ð¸Ðµ | ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ | v2.0 | 3 | Ð–ÐµÐ»Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾ |
| pravo.gov.ru | ÐŸÐ¾Ñ€Ñ‚Ð°Ð» Ð¿Ñ€Ð°Ð²Ð¾Ð²Ð¾Ð¹ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸ | API/ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ | v2.0 | 4 | Ð–ÐµÐ»Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾ |
| Ð¤ÐÐ¡ (nalog.gov.ru) | Ð“Ð¾ÑÐ¾Ñ€Ð³Ð°Ð½ | ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ | v2.0 | 5 | ÐžÐ¿Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾ |
| Ð Ð¾ÑÐ¿Ð¾Ñ‚Ñ€ÐµÐ±Ð½Ð°Ð´Ð·Ð¾Ñ€ | Ð“Ð¾ÑÐ¾Ñ€Ð³Ð°Ð½ | ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ | v2.0 | 6 | ÐžÐ¿Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾ |
| Ð Ð¾ÑÐ°ÐºÐºÑ€ÐµÐ´Ð¸Ñ‚Ð°Ñ†Ð¸Ñ | Ð“Ð¾ÑÐ¾Ñ€Ð³Ð°Ð½ | ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ | v2.0 | 7 | ÐžÐ¿Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾ |
| Ð§ÐµÑÑ‚Ð½Ñ‹Ð¹ Ð—ÐÐÐš | Ð¡Ð¸ÑÑ‚ÐµÐ¼Ð° Ð¼Ð°Ñ€ÐºÐ¸Ñ€Ð¾Ð²ÐºÐ¸ | ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ | v2.0 | 8 | ÐžÐ¿Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾ |

### Ð¢Ð¸Ð¿Ñ‹ ÑÐ¾Ð±Ð¸Ñ€Ð°ÐµÐ¼Ñ‹Ñ… Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð¾Ð²

| Ð¢Ð¸Ð¿ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð° | ÐšÐ¾Ð´ | Ð˜ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¸ | ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ |
|---------------|-----|-----------|----------|
| Ð¤ÐµÐ´ÐµÑ€Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ð·Ð°ÐºÐ¾Ð½ | `federal_law` | ÐšÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ð½Ñ‚ÐŸÐ»ÑŽÑ, Ð“Ð°Ñ€Ð°Ð½Ñ‚ | Ð¤Ð—, Ð¿Ñ€Ð¸Ð½ÑÑ‚Ñ‹Ðµ Ð“Ð¾ÑÐ´ÑƒÐ¼Ð¾Ð¹ |
| Ð˜Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ ÐÐŸÐ | `amendment` | ÐšÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ð½Ñ‚ÐŸÐ»ÑŽÑ, Ð“Ð°Ñ€Ð°Ð½Ñ‚ | ÐŸÐ¾Ð¿Ñ€Ð°Ð²ÐºÐ¸ Ð² Ð´ÐµÐ¹ÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ðµ Ð·Ð°ÐºÐ¾Ð½Ñ‹ |
| ÐŸÐ¾ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ | `decree` | ÐšÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ð½Ñ‚ÐŸÐ»ÑŽÑ, Ð“Ð°Ñ€Ð°Ð½Ñ‚ | ÐŸÐ¾ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ ÐŸÑ€Ð°Ð²Ð¸Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð° Ð Ð¤ |
| Ð¡ÑƒÐ´ÐµÐ±Ð½Ð¾Ðµ Ñ€ÐµÑˆÐµÐ½Ð¸Ðµ | `court_decision` | ÐšÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ð½Ñ‚ÐŸÐ»ÑŽÑ, Ð“Ð°Ñ€Ð°Ð½Ñ‚ | Ð ÐµÑˆÐµÐ½Ð¸Ñ ÑÑƒÐ´Ð¾Ð² Ð¿Ð¾ e-commerce |
| Ð Ð°Ð·ÑŠÑÑÐ½ÐµÐ½Ð¸Ðµ | `clarification` | ÐšÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ð½Ñ‚ÐŸÐ»ÑŽÑ, Ð“Ð°Ñ€Ð°Ð½Ñ‚ | ÐŸÐ¸ÑÑŒÐ¼Ð° Ð¤ÐÐ¡, ÐœÐ¸Ð½Ð¿Ñ€Ð¾Ð¼Ñ‚Ð¾Ñ€Ð³Ð° |
| Ð¡Ñ‚Ð°Ð½Ð´Ð°Ñ€Ñ‚ | `standard` | ÐšÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ð½Ñ‚ÐŸÐ»ÑŽÑ, Ð“Ð°Ñ€Ð°Ð½Ñ‚ | Ð“ÐžÐ¡Ð¢Ñ‹, Ñ‚ÐµÑ…Ð½Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ñ€ÐµÐ³Ð»Ð°Ð¼ÐµÐ½Ñ‚Ñ‹ |

---

## 2.2 ÐšÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ð½Ñ‚ÐŸÐ»ÑŽÑ

### 2.2.1 ÐžÐ±Ñ‰Ð°Ñ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ñ

| ÐŸÐ°Ñ€Ð°Ð¼ÐµÑ‚Ñ€ | Ð—Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ |
|----------|----------|
| ÐÐ°Ð·Ð²Ð°Ð½Ð¸Ðµ | ÐšÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ð½Ñ‚ÐŸÐ»ÑŽÑ |
| URL | `https://www.consultant.ru` |
| Ð¢Ð¸Ð¿ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð° | ÐŸÑƒÐ±Ð»Ð¸Ñ‡Ð½Ñ‹Ð¹ (Ð±ÐµÑÐ¿Ð»Ð°Ñ‚Ð½Ñ‹Ðµ Ñ€Ð°Ð·Ð´ÐµÐ»Ñ‹) |
| ÐœÐµÑ‚Ð¾Ð´ ÑÐ±Ð¾Ñ€Ð° | ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ Ñ‡ÐµÑ€ÐµÐ· Watcher Agents |
| Ð§Ð°ÑÑ‚Ð¾Ñ‚Ð° | Ð•Ð¶ÐµÐ´Ð½ÐµÐ²Ð½Ð¾ (21:00â€“07:00) |

### 2.2.2 Ð¡Ñ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð° ÑÐ°Ð¹Ñ‚Ð°

```mermaid
graph TB
    subgraph CONSULTANT["consultant.ru"]
        MAIN["Ð“Ð»Ð°Ð²Ð½Ð°Ñ"]
        
        subgraph LAW["Ð—Ð°ÐºÐ¾Ð½Ð¾Ð´Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð¾"]
            FZ["Ð¤ÐµÐ´ÐµÑ€Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð·Ð°ÐºÐ¾Ð½Ñ‹"]
            PP["ÐŸÐ¾ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ ÐŸÑ€Ð°Ð²Ð¸Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð°"]
            UKAZ["Ð£ÐºÐ°Ð·Ñ‹ ÐŸÑ€ÐµÐ·Ð¸Ð´ÐµÐ½Ñ‚Ð°"]
        end
        
        subgraph PRACTICE["Ð¡ÑƒÐ´ÐµÐ±Ð½Ð°Ñ Ð¿Ñ€Ð°ÐºÑ‚Ð¸ÐºÐ°"]
            VS["Ð’ÐµÑ€Ñ…Ð¾Ð²Ð½Ñ‹Ð¹ ÑÑƒÐ´"]
            AS["ÐÑ€Ð±Ð¸Ñ‚Ñ€Ð°Ð¶Ð½Ñ‹Ðµ ÑÑƒÐ´Ñ‹"]
        end
        
        subgraph CONSULT["ÐšÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ñ†Ð¸Ð¸"]
            FNS_C["Ð¤ÐÐ¡"]
            MINFIN["ÐœÐ¸Ð½Ñ„Ð¸Ð½"]
            MINTRUD["ÐœÐ¸Ð½Ñ‚Ñ€ÑƒÐ´"]
        end
        
        subgraph NEWS["ÐÐ¾Ð²Ð¾ÑÑ‚Ð¸"]
            HOT["Ð“Ð¾Ñ€ÑÑ‡Ð¸Ðµ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ñ‹"]
            NEW_DOCS["ÐÐ¾Ð²Ñ‹Ðµ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ñ‹"]
        end
    end
    
    MAIN --> LAW & PRACTICE & CONSULT & NEWS
```

### 2.2.3 Ð¢Ð¾Ñ‡ÐºÐ¸ Ð²Ñ…Ð¾Ð´Ð° Ð´Ð»Ñ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð°

| Ð Ð°Ð·Ð´ÐµÐ» | URL | Ð§Ð°ÑÑ‚Ð¾Ñ‚Ð° Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ | ÐŸÑ€Ð¸Ð¾Ñ€Ð¸Ñ‚ÐµÑ‚ |
|--------|-----|-------------------|:---------:|
| Ð“Ð¾Ñ€ÑÑ‡Ð¸Ðµ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ñ‹ | `/hotdocs/` | Ð•Ð¶ÐµÐ´Ð½ÐµÐ²Ð½Ð¾ | 1 |
| ÐÐ¾Ð²Ñ‹Ðµ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ñ‹ | `/new/` | Ð•Ð¶ÐµÐ´Ð½ÐµÐ²Ð½Ð¾ | 2 |
| Ð¤ÐµÐ´ÐµÑ€Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð·Ð°ÐºÐ¾Ð½Ñ‹ | `/document/cons_doc_LAW/` | ÐŸÐ¾ ÑÐ¾Ð±Ñ‹Ñ‚Ð¸ÑŽ | 3 |
| Ð¡ÑƒÐ´ÐµÐ±Ð½Ð°Ñ Ð¿Ñ€Ð°ÐºÑ‚Ð¸ÐºÐ° | `/cons/cgi/online.cgi?req=card` | Ð•Ð¶ÐµÐ½ÐµÐ´ÐµÐ»ÑŒÐ½Ð¾ | 4 |
| ÐŸÐ¸ÑÑŒÐ¼Ð° Ð¤ÐÐ¡ | `/document/cons_doc_QUEST/` | Ð•Ð¶ÐµÐ½ÐµÐ´ÐµÐ»ÑŒÐ½Ð¾ | 5 |

### 2.2.4 Ð¡ÐµÐ»ÐµÐºÑ‚Ð¾Ñ€Ñ‹ Ð´Ð»Ñ Ð¸Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ñ Ð´Ð°Ð½Ð½Ñ‹Ñ…

```python
# consultant_plus_selectors.py

SELECTORS = {
    # Ð¡Ð¿Ð¸ÑÐ¾Ðº Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð¾Ð² (ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ð° Ð½Ð¾Ð²Ð¾ÑÑ‚ÐµÐ¹)
    "document_list": {
        "container": "div.news-list, div.hot-docs-list",
        "item": "div.news-item, div.hot-doc-item",
        "title": "a.title, h3 a",
        "date": "span.date, div.doc-date",
        "link": "a.title::attr(href), h3 a::attr(href)"
    },
    
    # ÐšÐ°Ñ€Ñ‚Ð¾Ñ‡ÐºÐ° Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð°
    "document_card": {
        "title": "h1.document-title, div.doc-header h1",
        "number": "div.doc-number, span.requisites",
        "date": "div.doc-date, span.doc-date",
        "effective_date": "div.entry-into-force, span.effective-date",
        "status": "div.doc-status, span.status",
        "category": "div.doc-rubric, span.category",
        "text_container": "div.document-text, div.doc-body",
        "related_docs": "div.related-documents a"
    },
    
    # ÐœÐµÑ‚Ð°Ð´Ð°Ð½Ð½Ñ‹Ðµ
    "metadata": {
        "issuer": "div.issuer, span.organ",
        "doc_type": "div.doc-type, span.type",
        "keywords": "div.keywords, meta[name='keywords']::attr(content)"
    }
}
```

### 2.2.5 ÐŸÑ€Ð¸Ð¼ÐµÑ€ Ð·Ð°Ð´Ð°Ñ‡Ð¸ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð°

```json
{
  "task_id": "lex_cp_001",
  "task_type": "lex_parse",
  "source": "consultant_plus",
  "url": "https://www.consultant.ru/document/cons_doc_LAW_XXX/",
  "created_at": "2026-01-20T20:30:00Z",
  "priority": 2,
  "metadata": {
    "entry_point": "hot_docs",
    "expected_type": "federal_law"
  }
}
```

### 2.2.6 ÐŸÑ€Ð¸Ð¼ÐµÑ€ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð° Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð°

```json
{
  "task_id": "lex_cp_001",
  "status": "completed",
  "source": "consultant_plus",
  "url": "https://www.consultant.ru/document/cons_doc_LAW_XXX/",
  "parsed_at": "2026-01-20T23:45:00Z",
  
  "raw_data": {
    "title": "Ð¤ÐµÐ´ÐµÑ€Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ð·Ð°ÐºÐ¾Ð½ Ð¾Ñ‚ 15.12.2025 N 500-Ð¤Ð— \"Ðž Ð²Ð½ÐµÑÐµÐ½Ð¸Ð¸ Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ð¹ Ð² Ð—Ð°ÐºÐ¾Ð½ Ð Ð¾ÑÑÐ¸Ð¹ÑÐºÐ¾Ð¹ Ð¤ÐµÐ´ÐµÑ€Ð°Ñ†Ð¸Ð¸ \"Ðž Ð·Ð°Ñ‰Ð¸Ñ‚Ðµ Ð¿Ñ€Ð°Ð² Ð¿Ð¾Ñ‚Ñ€ÐµÐ±Ð¸Ñ‚ÐµÐ»ÐµÐ¹\"",
    "number": "500-Ð¤Ð—",
    "date": "2025-12-15",
    "effective_date": "2026-03-01",
    "status": "Ð”ÐµÐ¹ÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ð¹",
    "issuer": "Ð“Ð¾ÑÑƒÐ´Ð°Ñ€ÑÑ‚Ð²ÐµÐ½Ð½Ð°Ñ Ð”ÑƒÐ¼Ð°",
    "doc_type": "Ð¤ÐµÐ´ÐµÑ€Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ð·Ð°ÐºÐ¾Ð½",
    "category": "Ð—Ð°Ñ‰Ð¸Ñ‚Ð° Ð¿Ñ€Ð°Ð² Ð¿Ð¾Ñ‚Ñ€ÐµÐ±Ð¸Ñ‚ÐµÐ»ÐµÐ¹",
    
    "text": "[ÐŸÐ¾Ð»Ð½Ñ‹Ð¹ Ñ‚ÐµÐºÑÑ‚ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð°...]",
    "text_length": 45230,
    
    "related_docs": [
      {
        "title": "Ð—Ð°ÐºÐ¾Ð½ Ð Ð¤ \"Ðž Ð·Ð°Ñ‰Ð¸Ñ‚Ðµ Ð¿Ñ€Ð°Ð² Ð¿Ð¾Ñ‚Ñ€ÐµÐ±Ð¸Ñ‚ÐµÐ»ÐµÐ¹\"",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_305/"
      }
    ],
    
    "keywords": ["Ð·Ð°Ñ‰Ð¸Ñ‚Ð° Ð¿Ñ€Ð°Ð² Ð¿Ð¾Ñ‚Ñ€ÐµÐ±Ð¸Ñ‚ÐµÐ»ÐµÐ¹", "Ð²Ð¾Ð·Ð²Ñ€Ð°Ñ‚ Ñ‚Ð¾Ð²Ð°Ñ€Ð°", "Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹Ñ"]
  },
  
  "extraction_metadata": {
    "parser_version": "1.0",
    "extraction_time_ms": 1250,
    "selectors_used": ["document_card", "metadata"]
  }
}
```

---

## 2.3 Ð“Ð°Ñ€Ð°Ð½Ñ‚

### 2.3.1 ÐžÐ±Ñ‰Ð°Ñ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ñ

| ÐŸÐ°Ñ€Ð°Ð¼ÐµÑ‚Ñ€ | Ð—Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ |
|----------|----------|
| ÐÐ°Ð·Ð²Ð°Ð½Ð¸Ðµ | Ð“Ð°Ñ€Ð°Ð½Ñ‚ |
| URL | `https://www.garant.ru` |
| Ð¢Ð¸Ð¿ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð° | ÐŸÑƒÐ±Ð»Ð¸Ñ‡Ð½Ñ‹Ð¹ (Ð±ÐµÑÐ¿Ð»Ð°Ñ‚Ð½Ñ‹Ðµ Ñ€Ð°Ð·Ð´ÐµÐ»Ñ‹) |
| ÐœÐµÑ‚Ð¾Ð´ ÑÐ±Ð¾Ñ€Ð° | ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ Ñ‡ÐµÑ€ÐµÐ· Watcher Agents |
| Ð§Ð°ÑÑ‚Ð¾Ñ‚Ð° | Ð•Ð¶ÐµÐ´Ð½ÐµÐ²Ð½Ð¾ (21:00â€“07:00) |

### 2.3.2 Ð¡Ñ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð° ÑÐ°Ð¹Ñ‚Ð°

```mermaid
graph TB
    subgraph GARANT["garant.ru"]
        MAIN["Ð“Ð»Ð°Ð²Ð½Ð°Ñ"]
        
        subgraph LAW["ÐŸÑ€Ð°Ð²Ð¾Ð²Ð°Ñ Ð±Ð°Ð·Ð°"]
            FEDERAL["Ð¤ÐµÐ´ÐµÑ€Ð°Ð»ÑŒÐ½Ð¾Ðµ Ð·Ð°ÐºÐ¾Ð½Ð¾Ð´Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð¾"]
            REGIONAL["Ð ÐµÐ³Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾Ðµ"]
            INTERNATIONAL["ÐœÐµÐ¶Ð´ÑƒÐ½Ð°Ñ€Ð¾Ð´Ð½Ð¾Ðµ"]
        end
        
        subgraph PRACTICE["Ð¡ÑƒÐ´ÐµÐ±Ð½Ð°Ñ Ð¿Ñ€Ð°ÐºÑ‚Ð¸ÐºÐ°"]
            COURT["Ð¡ÑƒÐ´ÐµÐ±Ð½Ñ‹Ðµ Ñ€ÐµÑˆÐµÐ½Ð¸Ñ"]
            REVIEWS["ÐžÐ±Ð·Ð¾Ñ€Ñ‹ Ð¿Ñ€Ð°ÐºÑ‚Ð¸ÐºÐ¸"]
        end
        
        subgraph NEWS["ÐÐ¾Ð²Ð¾ÑÑ‚Ð¸"]
            TODAY["Ð¡ÐµÐ³Ð¾Ð´Ð½Ñ"]
            WEEK["ÐÐ° ÑÑ‚Ð¾Ð¹ Ð½ÐµÐ´ÐµÐ»Ðµ"]
            CALENDAR["ÐšÐ°Ð»ÐµÐ½Ð´Ð°Ñ€ÑŒ"]
        end
        
        subgraph ARTICLES["Ð¡Ñ‚Ð°Ñ‚ÑŒÐ¸"]
            ANALYTICS["ÐÐ½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ°"]
            COMMENTS["ÐšÐ¾Ð¼Ð¼ÐµÐ½Ñ‚Ð°Ñ€Ð¸Ð¸"]
        end
    end
    
    MAIN --> LAW & PRACTICE & NEWS & ARTICLES
```

### 2.3.3 Ð¢Ð¾Ñ‡ÐºÐ¸ Ð²Ñ…Ð¾Ð´Ð° Ð´Ð»Ñ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð°

| Ð Ð°Ð·Ð´ÐµÐ» | URL | Ð§Ð°ÑÑ‚Ð¾Ñ‚Ð° Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ | ÐŸÑ€Ð¸Ð¾Ñ€Ð¸Ñ‚ÐµÑ‚ |
|--------|-----|-------------------|:---------:|
| ÐÐ¾Ð²Ð¾ÑÑ‚Ð¸ Ð¿Ñ€Ð°Ð²Ð° | `/news/` | Ð•Ð¶ÐµÐ´Ð½ÐµÐ²Ð½Ð¾ | 1 |
| Ð“Ð¾Ñ€ÑÑ‡Ð¸Ðµ Ñ‚ÐµÐ¼Ñ‹ | `/hot/` | Ð•Ð¶ÐµÐ´Ð½ÐµÐ²Ð½Ð¾ | 2 |
| Ð¤ÐµÐ´ÐµÑ€Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð·Ð°ÐºÐ¾Ð½Ñ‹ | `/products/ipo/prime/doc/` | ÐŸÐ¾ ÑÐ¾Ð±Ñ‹Ñ‚Ð¸ÑŽ | 3 |
| Ð¡ÑƒÐ´ÐµÐ±Ð½Ð°Ñ Ð¿Ñ€Ð°ÐºÑ‚Ð¸ÐºÐ° | `/products/ipo/prime/doc/court/` | Ð•Ð¶ÐµÐ½ÐµÐ´ÐµÐ»ÑŒÐ½Ð¾ | 4 |

### 2.3.4 Ð¡ÐµÐ»ÐµÐºÑ‚Ð¾Ñ€Ñ‹ Ð´Ð»Ñ Ð¸Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ñ Ð´Ð°Ð½Ð½Ñ‹Ñ…

```python
# garant_selectors.py

SELECTORS = {
    # Ð¡Ð¿Ð¸ÑÐ¾Ðº Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð¾Ð²
    "document_list": {
        "container": "div.news-list, ul.document-list",
        "item": "li.news-item, div.doc-item",
        "title": "a.doc-title, h3 a",
        "date": "span.pub-date, div.date",
        "link": "a.doc-title::attr(href)"
    },
    
    # ÐšÐ°Ñ€Ñ‚Ð¾Ñ‡ÐºÐ° Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð°
    "document_card": {
        "title": "h1.doc-title, div.document-header h1",
        "number": "div.doc-requisites span.number",
        "date": "div.doc-requisites span.date",
        "effective_date": "div.effective-info span.date",
        "status": "div.doc-status span",
        "category": "div.doc-category a",
        "text_container": "div.document-content, div.doc-text",
        "source_org": "div.source-organization"
    },
    
    # ÐœÐµÑ‚Ð°Ð´Ð°Ð½Ð½Ñ‹Ðµ
    "metadata": {
        "issuer": "div.issuing-authority",
        "doc_type": "div.document-type",
        "tags": "div.doc-tags a"
    }
}
```

### 2.3.5 ÐŸÑ€Ð¸Ð¼ÐµÑ€ Ð·Ð°Ð´Ð°Ñ‡Ð¸ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð°

```json
{
  "task_id": "lex_gr_001",
  "task_type": "lex_parse",
  "source": "garant",
  "url": "https://www.garant.ru/products/ipo/prime/doc/XXXXXXX/",
  "created_at": "2026-01-20T20:30:00Z",
  "priority": 2,
  "metadata": {
    "entry_point": "news",
    "expected_type": "clarification"
  }
}
```

### 2.3.6 ÐŸÑ€Ð¸Ð¼ÐµÑ€ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð° Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð°

```json
{
  "task_id": "lex_gr_001",
  "status": "completed",
  "source": "garant",
  "url": "https://www.garant.ru/products/ipo/prime/doc/XXXXXXX/",
  "parsed_at": "2026-01-20T23:50:00Z",
  
  "raw_data": {
    "title": "ÐŸÐ¸ÑÑŒÐ¼Ð¾ Ð¤ÐÐ¡ Ð Ð¾ÑÑÐ¸Ð¸ Ð¾Ñ‚ 10.01.2026 N Ð‘Ð¡-4-11/123@ \"Ðž Ð½Ð°Ð»Ð¾Ð³Ð¾Ð¾Ð±Ð»Ð¾Ð¶ÐµÐ½Ð¸Ð¸ Ð´Ð¾Ñ…Ð¾Ð´Ð¾Ð² Ð¾Ñ‚ Ð¿Ñ€Ð¾Ð´Ð°Ð¶ Ð½Ð° Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹ÑÐ°Ñ…\"",
    "number": "Ð‘Ð¡-4-11/123@",
    "date": "2026-01-10",
    "effective_date": null,
    "status": "Ð”ÐµÐ¹ÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ð¹",
    "issuer": "Ð¤ÐÐ¡ Ð Ð¾ÑÑÐ¸Ð¸",
    "doc_type": "ÐŸÐ¸ÑÑŒÐ¼Ð¾",
    "category": "ÐÐ°Ð»Ð¾Ð³Ð¾Ð¾Ð±Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ",
    
    "text": "[ÐŸÐ¾Ð»Ð½Ñ‹Ð¹ Ñ‚ÐµÐºÑÑ‚ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð°...]",
    "text_length": 12500,
    
    "tags": ["Ð½Ð°Ð»Ð¾Ð³Ð¸", "Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¿Ð»ÐµÐ¹Ñ", "ÐÐ”Ð¤Ð›", "Ð£Ð¡Ð"]
  },
  
  "extraction_metadata": {
    "parser_version": "1.0",
    "extraction_time_ms": 980,
    "selectors_used": ["document_card", "metadata"]
  }
}
```

---

## 2.4 Ð ÑƒÑ‡Ð½Ð°Ñ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð¾Ð²

### 2.4.1 Ð—Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° Ð¿Ð¾ URL

**ÐŸÐ¾Ð´Ð´ÐµÑ€Ð¶Ð¸Ð²Ð°ÐµÐ¼Ñ‹Ðµ Ð´Ð¾Ð¼ÐµÐ½Ñ‹ (whitelist):**

| Ð”Ð¾Ð¼ÐµÐ½ | Ð˜ÑÑ‚Ð¾Ñ‡Ð½Ð¸Ðº |
|-------|----------|
| `consultant.ru` | ÐšÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ð½Ñ‚ÐŸÐ»ÑŽÑ |
| `www.consultant.ru` | ÐšÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ð½Ñ‚ÐŸÐ»ÑŽÑ |
| `garant.ru` | Ð“Ð°Ñ€Ð°Ð½Ñ‚ |
| `www.garant.ru` | Ð“Ð°Ñ€Ð°Ð½Ñ‚ |
| `pravo.gov.ru` | ÐžÑ„Ð¸Ñ†Ð¸Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ð¿Ð¾Ñ€Ñ‚Ð°Ð» (v2.0) |
| `publication.pravo.gov.ru` | ÐžÑ„Ð¸Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾Ðµ Ð¾Ð¿ÑƒÐ±Ð»Ð¸ÐºÐ¾Ð²Ð°Ð½Ð¸Ðµ (v2.0) |

**ÐŸÑ€Ð¾Ñ†ÐµÑÑ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ¸:**

```mermaid
sequenceDiagram
    participant USER as Senior/Director
    participant API as Lex API
    participant FETCH as URL Fetcher
    participant PARSE as Text Extractor
    participant AI as AI Pipeline

    USER->>API: POST /upload {url: "..."}
    
    API->>API: Validate URL (whitelist)
    
    alt URL Ð½Ðµ Ð² whitelist
        API-->>USER: 400 Bad Request
    else URL Ð²Ð°Ð»Ð¸Ð´ÐµÐ½
        API->>FETCH: fetch(url)
        FETCH-->>API: HTML content
        
        API->>PARSE: extract_text(html)
        PARSE-->>API: raw_text + metadata
        
        API->>AI: process_document(text)
        Note over AI: Filter â†’ Classify â†’ Summarize
        
        AI-->>API: processed_document
        API-->>USER: 200 OK {document_id}
    end
```

**ÐŸÑ€Ð¸Ð¼ÐµÑ€ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ°:**

```http
POST /api/v1/lex/upload
Authorization: Bearer {token}
Content-Type: application/json

{
  "url": "https://www.consultant.ru/document/cons_doc_LAW_XXX/"
}
```

**ÐŸÑ€Ð¸Ð¼ÐµÑ€ Ð¾Ñ‚Ð²ÐµÑ‚Ð°:**

```json
{
  "success": true,
  "document_id": 456,
  "source": "consultant_plus",
  "title": "Ð¤ÐµÐ´ÐµÑ€Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ð·Ð°ÐºÐ¾Ð½ Ð¾Ñ‚ 15.12.2025 N 500-Ð¤Ð—",
  "relevance_score": 0.87,
  "relevance_level": "high",
  "category": "consumer_rights",
  "summary": "Ð—Ð°ÐºÐ¾Ð½ Ð²Ð½Ð¾ÑÐ¸Ñ‚ Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ñ Ð² Ð¿Ñ€Ð°Ð²Ð¸Ð»Ð° Ð²Ð¾Ð·Ð²Ñ€Ð°Ñ‚Ð° Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð²..."
}
```

### 2.4.2 Ð—Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° Ñ„Ð°Ð¹Ð»Ð°

**ÐŸÐ¾Ð´Ð´ÐµÑ€Ð¶Ð¸Ð²Ð°ÐµÐ¼Ñ‹Ðµ Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚Ñ‹:**

| Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚ | MIME Type | ÐœÐ°ÐºÑÐ¸Ð¼Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ñ€Ð°Ð·Ð¼ÐµÑ€ | ÐœÐµÑ‚Ð¾Ð´ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð° |
|--------|-----------|---------------------|----------------|
| PDF | `application/pdf` | 10 MB | PyMuPDF + OCR (Ð¿Ñ€Ð¸ Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ð¾ÑÑ‚Ð¸) |
| DOCX | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | 10 MB | python-docx |
| DOC | `application/msword` | 10 MB | antiword / LibreOffice |
| TXT | `text/plain` | 5 MB | ÐŸÑ€ÑÐ¼Ð¾Ðµ Ñ‡Ñ‚ÐµÐ½Ð¸Ðµ |
| RTF | `application/rtf` | 10 MB | striprtf |

**ÐŸÑ€Ð¾Ñ†ÐµÑÑ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ¸:**

```mermaid
sequenceDiagram
    participant USER as Senior/Director
    participant API as Lex API
    participant PARSE as File Parser
    participant AI as AI Pipeline
    participant KB as Knowledge Base

    USER->>API: POST /upload (multipart/form-data)
    Note over USER,API: file: document.pdf

    API->>API: Validate file (format, size)
    
    alt ÐÐµÐ²Ð°Ð»Ð¸Ð´Ð½Ñ‹Ð¹ Ñ„Ð°Ð¹Ð»
        API-->>USER: 400 Bad Request
    else Ð¤Ð°Ð¹Ð» Ð²Ð°Ð»Ð¸Ð´ÐµÐ½
        API->>PARSE: parse_file(file)
        
        alt PDF
            PARSE->>PARSE: PyMuPDF extract
            alt Ð¡ÐºÐ°Ð½ (no text layer)
                PARSE->>PARSE: OCR (GPT-5 mini Vision)
            end
        else DOCX
            PARSE->>PARSE: python-docx extract
        end
        
        PARSE-->>API: raw_text + file_metadata
        
        API->>AI: process_document(text)
        AI-->>API: processed_document
        
        API->>KB: upload_document(markdown)
        KB-->>API: kb_document_id
        
        API-->>USER: 200 OK {document_id}
    end
```

**ÐŸÑ€Ð¸Ð¼ÐµÑ€ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ°:**

```http
POST /api/v1/lex/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="law_500fz.pdf"
Content-Type: application/pdf

[Binary PDF content]
------WebKitFormBoundary--
```

**ÐŸÑ€Ð¸Ð¼ÐµÑ€ Ð¾Ñ‚Ð²ÐµÑ‚Ð°:**

```json
{
  "success": true,
  "document_id": 457,
  "source": "manual_upload",
  "filename": "law_500fz.pdf",
  "title": "Ðž Ð²Ð½ÐµÑÐµÐ½Ð¸Ð¸ Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ð¹ Ð² Ð—Ð°ÐºÐ¾Ð½ Ð¾ Ð·Ð°Ñ‰Ð¸Ñ‚Ðµ Ð¿Ñ€Ð°Ð² Ð¿Ð¾Ñ‚Ñ€ÐµÐ±Ð¸Ñ‚ÐµÐ»ÐµÐ¹",
  "relevance_score": 0.92,
  "relevance_level": "high",
  "category": "consumer_rights",
  "summary": "Ð”Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚ ÑƒÑÑ‚Ð°Ð½Ð°Ð²Ð»Ð¸Ð²Ð°ÐµÑ‚ Ð½Ð¾Ð²Ñ‹Ðµ Ð¿Ñ€Ð°Ð²Ð¸Ð»Ð°...",
  "file_metadata": {
    "pages": 15,
    "size_bytes": 245780,
    "has_ocr": false
  }
}
```

---

## 2.5 ÐÐ´Ð°Ð¿Ñ‚ÐµÑ€Ñ‹ Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¾Ð²

### 2.5.1 Ð‘Ð°Ð·Ð¾Ð²Ñ‹Ð¹ ÐºÐ»Ð°ÑÑ Ð°Ð´Ð°Ð¿Ñ‚ÐµÑ€Ð°

```python
# adapters/base.py

from abc import ABC, abstractmethod
from typing import List, Dict, Optional
from dataclasses import dataclass
from datetime import datetime


@dataclass
class RawDocument:
    """Ð¡Ñ‹Ñ€Ð¾Ð¹ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚ Ð¿Ð¾ÑÐ»Ðµ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð°."""
    source: str
    url: str
    title: str
    number: Optional[str]
    date: Optional[datetime]
    effective_date: Optional[datetime]
    status: str
    issuer: Optional[str]
    doc_type: str
    category: Optional[str]
    text: str
    text_length: int
    related_docs: List[Dict]
    keywords: List[str]
    raw_html: str
    parsed_at: datetime


@dataclass
class TaskDefinition:
    """ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ Ð·Ð°Ð´Ð°Ñ‡Ð¸ Ð´Ð»Ñ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð°."""
    task_type: str = "lex_parse"
    source: str = ""
    url: str = ""
    priority: int = 5
    metadata: Dict = None


class BaseSourceAdapter(ABC):
    """Ð‘Ð°Ð·Ð¾Ð²Ñ‹Ð¹ ÐºÐ»Ð°ÑÑ Ð°Ð´Ð°Ð¿Ñ‚ÐµÑ€Ð° Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ° Ð´Ð°Ð½Ð½Ñ‹Ñ…."""
    
    source_name: str = ""
    base_url: str = ""
    
    @abstractmethod
    async def generate_tasks(self) -> List[TaskDefinition]:
        """Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Ð·Ð°Ð´Ð°Ñ‡ Ð´Ð»Ñ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð° Ð½Ð¾Ð²Ñ‹Ñ… Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð¾Ð²."""
        pass
    
    @abstractmethod
    async def parse_document(self, html: str, url: str) -> RawDocument:
        """ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ HTML-ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð°."""
        pass
    
    @abstractmethod
    def get_entry_points(self) -> List[Dict]:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ñ‚Ð¾Ñ‡ÐµÐº Ð²Ñ…Ð¾Ð´Ð° Ð´Ð»Ñ Ð¼Ð¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³Ð°."""
        pass
    
    async def fetch_entry_point(self, entry_point: Dict) -> List[str]:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÐ¿Ð¸ÑÐºÐ° URL Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð¾Ð² Ñ Ñ‚Ð¾Ñ‡ÐºÐ¸ Ð²Ñ…Ð¾Ð´Ð°."""
        # Ð ÐµÐ°Ð»Ð¸Ð·ÑƒÐµÑ‚ÑÑ Ð² ÐºÐ¾Ð½ÐºÑ€ÐµÑ‚Ð½Ñ‹Ñ… Ð°Ð´Ð°Ð¿Ñ‚ÐµÑ€Ð°Ñ…
        pass
```

### 2.5.2 ÐÐ´Ð°Ð¿Ñ‚ÐµÑ€ ÐšÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ð½Ñ‚ÐŸÐ»ÑŽÑ

```python
# adapters/consultant_plus.py

from .base import BaseSourceAdapter, RawDocument, TaskDefinition
from .selectors import CONSULTANT_SELECTORS
from typing import List, Dict
from bs4 import BeautifulSoup
from datetime import datetime
import re


class ConsultantPlusAdapter(BaseSourceAdapter):
    """ÐÐ´Ð°Ð¿Ñ‚ÐµÑ€ Ð´Ð»Ñ ÐšÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ð½Ñ‚ÐŸÐ»ÑŽÑ."""
    
    source_name = "consultant_plus"
    base_url = "https://www.consultant.ru"
    
    def get_entry_points(self) -> List[Dict]:
        """Ð¢Ð¾Ñ‡ÐºÐ¸ Ð²Ñ…Ð¾Ð´Ð° Ð´Ð»Ñ Ð¼Ð¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³Ð°."""
        return [
            {
                "name": "hot_docs",
                "url": f"{self.base_url}/hotdocs/",
                "priority": 1,
                "frequency": "daily"
            },
            {
                "name": "new_docs",
                "url": f"{self.base_url}/new/",
                "priority": 2,
                "frequency": "daily"
            },
            {
                "name": "fns_letters",
                "url": f"{self.base_url}/document/cons_doc_QUEST/",
                "priority": 3,
                "frequency": "weekly"
            }
        ]
    
    async def generate_tasks(self) -> List[TaskDefinition]:
        """Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Ð·Ð°Ð´Ð°Ñ‡ Ð½Ð° Ð¾ÑÐ½Ð¾Ð²Ðµ Ñ‚Ð¾Ñ‡ÐµÐº Ð²Ñ…Ð¾Ð´Ð°."""
        tasks = []
        
        for entry_point in self.get_entry_points():
            # Ð—Ð°Ð´Ð°Ñ‡Ð° Ð½Ð° Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³ Ñ‚Ð¾Ñ‡ÐºÐ¸ Ð²Ñ…Ð¾Ð´Ð° (Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÐ¿Ð¸ÑÐºÐ° Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð¾Ð²)
            tasks.append(TaskDefinition(
                source=self.source_name,
                url=entry_point["url"],
                priority=entry_point["priority"],
                metadata={
                    "task_subtype": "list_documents",
                    "entry_point": entry_point["name"]
                }
            ))
        
        return tasks
    
    async def parse_document_list(self, html: str) -> List[str]:
        """ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ ÑÐ¿Ð¸ÑÐºÐ° Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð¾Ð² Ñ Ñ‚Ð¾Ñ‡ÐºÐ¸ Ð²Ñ…Ð¾Ð´Ð°."""
        soup = BeautifulSoup(html, 'lxml')
        urls = []
        
        selectors = CONSULTANT_SELECTORS["document_list"]
        container = soup.select_one(selectors["container"])
        
        if container:
            items = container.select(selectors["item"])
            for item in items:
                link = item.select_one(selectors["link"])
                if link and link.get("href"):
                    url = link["href"]
                    if not url.startswith("http"):
                        url = f"{self.base_url}{url}"
                    urls.append(url)
        
        return urls
    
    async def parse_document(self, html: str, url: str) -> RawDocument:
        """ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð°."""
        soup = BeautifulSoup(html, 'lxml')
        selectors = CONSULTANT_SELECTORS["document_card"]
        meta_selectors = CONSULTANT_SELECTORS["metadata"]
        
        # Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ Ð¾ÑÐ½Ð¾Ð²Ð½Ñ‹Ñ… Ð¿Ð¾Ð»ÐµÐ¹
        title = self._extract_text(soup, selectors["title"])
        number = self._extract_text(soup, selectors["number"])
        date_str = self._extract_text(soup, selectors["date"])
        effective_date_str = self._extract_text(soup, selectors["effective_date"])
        status = self._extract_text(soup, selectors["status"]) or "Ð”ÐµÐ¹ÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ð¹"
        category = self._extract_text(soup, selectors["category"])
        
        # Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ Ð¼ÐµÑ‚Ð°Ð´Ð°Ð½Ð½Ñ‹Ñ…
        issuer = self._extract_text(soup, meta_selectors["issuer"])
        doc_type = self._extract_text(soup, meta_selectors["doc_type"]) or self._detect_doc_type(title)
        keywords = self._extract_keywords(soup, meta_selectors["keywords"])
        
        # Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ Ñ‚ÐµÐºÑÑ‚Ð° Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð°
        text_container = soup.select_one(selectors["text_container"])
        text = text_container.get_text(separator="\n", strip=True) if text_container else ""
        
        # Ð¡Ð²ÑÐ·Ð°Ð½Ð½Ñ‹Ðµ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ñ‹
        related_docs = self._extract_related_docs(soup, selectors.get("related_docs"))
        
        return RawDocument(
            source=self.source_name,
            url=url,
            title=title,
            number=number,
            date=self._parse_date(date_str),
            effective_date=self._parse_date(effective_date_str),
            status=status,
            issuer=issuer,
            doc_type=doc_type,
            category=category,
            text=text,
            text_length=len(text),
            related_docs=related_docs,
            keywords=keywords,
            raw_html=html,
            parsed_at=datetime.utcnow()
        )
    
    def _extract_text(self, soup: BeautifulSoup, selector: str) -> str:
        """Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ Ñ‚ÐµÐºÑÑ‚Ð° Ð¿Ð¾ ÑÐµÐ»ÐµÐºÑ‚Ð¾Ñ€Ñƒ."""
        if not selector:
            return ""
        
        for sel in selector.split(", "):
            element = soup.select_one(sel)
            if element:
                return element.get_text(strip=True)
        return ""
    
    def _parse_date(self, date_str: str) -> datetime:
        """ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ Ð´Ð°Ñ‚Ñ‹ Ð¸Ð· ÑÑ‚Ñ€Ð¾ÐºÐ¸."""
        if not date_str:
            return None
        
        patterns = [
            r"(\d{2})\.(\d{2})\.(\d{4})",  # DD.MM.YYYY
            r"(\d{4})-(\d{2})-(\d{2})",     # YYYY-MM-DD
        ]
        
        for pattern in patterns:
            match = re.search(pattern, date_str)
            if match:
                groups = match.groups()
                if len(groups[0]) == 4:  # YYYY-MM-DD
                    return datetime(int(groups[0]), int(groups[1]), int(groups[2]))
                else:  # DD.MM.YYYY
                    return datetime(int(groups[2]), int(groups[1]), int(groups[0]))
        
        return None
    
    def _detect_doc_type(self, title: str) -> str:
        """ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ Ñ‚Ð¸Ð¿Ð° Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð° Ð¿Ð¾ Ð·Ð°Ð³Ð¾Ð»Ð¾Ð²ÐºÑƒ."""
        title_lower = title.lower()
        
        if "Ñ„ÐµÐ´ÐµÑ€Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ð·Ð°ÐºÐ¾Ð½" in title_lower:
            return "federal_law"
        elif "Ð¿Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ" in title_lower:
            return "decree"
        elif "Ð¿Ð¸ÑÑŒÐ¼Ð¾" in title_lower:
            return "clarification"
        elif "Ñ€ÐµÑˆÐµÐ½Ð¸Ðµ" in title_lower and ("ÑÑƒÐ´" in title_lower or "Ð°Ñ€Ð±Ð¸Ñ‚Ñ€Ð°Ð¶" in title_lower):
            return "court_decision"
        elif "Ð³Ð¾ÑÑ‚" in title_lower or "ÑÑ‚Ð°Ð½Ð´Ð°Ñ€Ñ‚" in title_lower:
            return "standard"
        elif "Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸" in title_lower:
            return "amendment"
        
        return "other"
    
    def _extract_keywords(self, soup: BeautifulSoup, selector: str) -> List[str]:
        """Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ñ… ÑÐ»Ð¾Ð²."""
        keywords = []
        
        if selector:
            for sel in selector.split(", "):
                if "::attr" in sel:
                    base_sel, attr = sel.split("::attr(")
                    attr = attr.rstrip(")")
                    element = soup.select_one(base_sel)
                    if element and element.get(attr):
                        keywords.extend([k.strip() for k in element[attr].split(",")])
                else:
                    elements = soup.select(sel)
                    for el in elements:
                        keywords.append(el.get_text(strip=True))
        
        return list(set(keywords))
    
    def _extract_related_docs(self, soup: BeautifulSoup, selector: str) -> List[Dict]:
        """Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ ÑÐ²ÑÐ·Ð°Ð½Ð½Ñ‹Ñ… Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð¾Ð²."""
        related = []
        
        if selector:
            elements = soup.select(selector)
            for el in elements[:10]:  # ÐžÐ³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð¸Ðµ Ð´Ð¾ 10
                href = el.get("href", "")
                if not href.startswith("http"):
                    href = f"{self.base_url}{href}"
                related.append({
                    "title": el.get_text(strip=True),
                    "url": href
                })
        
        return related
```

### 2.5.3 ÐÐ´Ð°Ð¿Ñ‚ÐµÑ€ Ð“Ð°Ñ€Ð°Ð½Ñ‚

```python
# adapters/garant.py

from .base import BaseSourceAdapter, RawDocument, TaskDefinition
from .selectors import GARANT_SELECTORS
from typing import List, Dict
from bs4 import BeautifulSoup
from datetime import datetime


class GarantAdapter(BaseSourceAdapter):
    """ÐÐ´Ð°Ð¿Ñ‚ÐµÑ€ Ð´Ð»Ñ Ð“Ð°Ñ€Ð°Ð½Ñ‚."""
    
    source_name = "garant"
    base_url = "https://www.garant.ru"
    
    def get_entry_points(self) -> List[Dict]:
        """Ð¢Ð¾Ñ‡ÐºÐ¸ Ð²Ñ…Ð¾Ð´Ð° Ð´Ð»Ñ Ð¼Ð¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³Ð°."""
        return [
            {
                "name": "news",
                "url": f"{self.base_url}/news/",
                "priority": 1,
                "frequency": "daily"
            },
            {
                "name": "hot",
                "url": f"{self.base_url}/hot/",
                "priority": 2,
                "frequency": "daily"
            },
            {
                "name": "federal_law",
                "url": f"{self.base_url}/products/ipo/prime/doc/",
                "priority": 3,
                "frequency": "weekly"
            }
        ]
    
    async def generate_tasks(self) -> List[TaskDefinition]:
        """Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Ð·Ð°Ð´Ð°Ñ‡ Ð½Ð° Ð¾ÑÐ½Ð¾Ð²Ðµ Ñ‚Ð¾Ñ‡ÐµÐº Ð²Ñ…Ð¾Ð´Ð°."""
        tasks = []
        
        for entry_point in self.get_entry_points():
            tasks.append(TaskDefinition(
                source=self.source_name,
                url=entry_point["url"],
                priority=entry_point["priority"],
                metadata={
                    "task_subtype": "list_documents",
                    "entry_point": entry_point["name"]
                }
            ))
        
        return tasks
    
    async def parse_document(self, html: str, url: str) -> RawDocument:
        """ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð°."""
        soup = BeautifulSoup(html, 'lxml')
        selectors = GARANT_SELECTORS["document_card"]
        meta_selectors = GARANT_SELECTORS["metadata"]
        
        title = self._extract_text(soup, selectors["title"])
        number = self._extract_text(soup, selectors["number"])
        date_str = self._extract_text(soup, selectors["date"])
        effective_date_str = self._extract_text(soup, selectors["effective_date"])
        status = self._extract_text(soup, selectors["status"]) or "Ð”ÐµÐ¹ÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ð¹"
        category = self._extract_text(soup, selectors["category"])
        
        issuer = self._extract_text(soup, meta_selectors["issuer"])
        doc_type = self._extract_text(soup, meta_selectors["doc_type"]) or self._detect_doc_type(title)
        keywords = self._extract_tags(soup, meta_selectors["tags"])
        
        text_container = soup.select_one(selectors["text_container"])
        text = text_container.get_text(separator="\n", strip=True) if text_container else ""
        
        return RawDocument(
            source=self.source_name,
            url=url,
            title=title,
            number=number,
            date=self._parse_date(date_str),
            effective_date=self._parse_date(effective_date_str),
            status=status,
            issuer=issuer,
            doc_type=doc_type,
            category=category,
            text=text,
            text_length=len(text),
            related_docs=[],
            keywords=keywords,
            raw_html=html,
            parsed_at=datetime.utcnow()
        )
    
    # ... Ð°Ð½Ð°Ð»Ð¾Ð³Ð¸Ñ‡Ð½Ñ‹Ðµ Ð²ÑÐ¿Ð¾Ð¼Ð¾Ð³Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ Ð¼ÐµÑ‚Ð¾Ð´Ñ‹
```

---

## 2.6 Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Ð·Ð°Ð´Ð°Ñ‡

### 2.6.1 ÐŸÑ€Ð¾Ñ†ÐµÑÑ Ð³ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ð¸

```mermaid
sequenceDiagram
    participant BEAT as Celery Beat
    participant GEN as Task Generator
    participant ADAPTERS as Source Adapters
    participant DB as PostgreSQL
    participant REDIS as Redis Queue

    Note over BEAT: 20:30 - Ð¢Ñ€Ð¸Ð³Ð³ÐµÑ€ Ð³ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ð¸

    BEAT->>GEN: generate_lex_tasks()
    
    GEN->>DB: SELECT * FROM lex_sources WHERE enabled = true
    DB-->>GEN: sources[]
    
    loop Ð”Ð»Ñ ÐºÐ°Ð¶Ð´Ð¾Ð³Ð¾ Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ°
        GEN->>ADAPTERS: adapter.generate_tasks()
        ADAPTERS-->>GEN: task_definitions[]
        
        loop Ð”Ð»Ñ ÐºÐ°Ð¶Ð´Ð¾Ð¹ Ð·Ð°Ð´Ð°Ñ‡Ð¸
            GEN->>DB: Check if URL already processed today
            
            alt ÐÐ¾Ð²Ñ‹Ð¹ URL
                GEN->>REDIS: RPUSH task_queue:lex {task}
                GEN->>DB: INSERT INTO lex_task_log
            else Ð£Ð¶Ðµ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚Ð°Ð½
                Note over GEN: Skip
            end
        end
    end
    
    GEN-->>BEAT: {tasks_created: 45}
```

### 2.6.2 ÐšÐ¾Ð´ Ð³ÐµÐ½ÐµÑ€Ð°Ñ‚Ð¾Ñ€Ð° Ð·Ð°Ð´Ð°Ñ‡

```python
# services/task_generator.py

from typing import List, Dict
from datetime import datetime, timedelta
from adapters import ConsultantPlusAdapter, GarantAdapter
from models import LexSource, LexTaskLog
from core.redis import redis_client
from core.database import db_session
import json


class LexTaskGenerator:
    """Ð“ÐµÐ½ÐµÑ€Ð°Ñ‚Ð¾Ñ€ Ð·Ð°Ð´Ð°Ñ‡ Ð´Ð»Ñ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð° Ð¿Ñ€Ð°Ð²Ð¾Ð²Ñ‹Ñ… Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¾Ð²."""
    
    ADAPTERS = {
        "consultant_plus": ConsultantPlusAdapter,
        "garant": GarantAdapter
    }
    
    QUEUE_NAME = "task_queue:lex"
    
    async def generate_tasks(self) -> Dict:
        """Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Ð²ÑÐµÑ… Ð·Ð°Ð´Ð°Ñ‡ Ð½Ð° Ñ‚ÐµÐºÑƒÑ‰ÑƒÑŽ Ð½Ð¾Ñ‡ÑŒ."""
        stats = {
            "sources_processed": 0,
            "tasks_created": 0,
            "tasks_skipped": 0,
            "errors": []
        }
        
        # ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð°ÐºÑ‚Ð¸Ð²Ð½Ñ‹Ñ… Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¾Ð²
        sources = await self._get_enabled_sources()
        
        for source in sources:
            try:
                adapter_class = self.ADAPTERS.get(source.adapter_name)
                if not adapter_class:
                    stats["errors"].append(f"Unknown adapter: {source.adapter_name}")
                    continue
                
                adapter = adapter_class()
                tasks = await adapter.generate_tasks()
                
                for task in tasks:
                    if await self._should_process(task.url):
                        await self._enqueue_task(task)
                        stats["tasks_created"] += 1
                    else:
                        stats["tasks_skipped"] += 1
                
                stats["sources_processed"] += 1
                
            except Exception as e:
                stats["errors"].append(f"{source.name}: {str(e)}")
        
        return stats
    
    async def _get_enabled_sources(self) -> List[LexSource]:
        """ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð°ÐºÑ‚Ð¸Ð²Ð½Ñ‹Ñ… Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¾Ð²."""
        async with db_session() as session:
            result = await session.execute(
                "SELECT * FROM lex_sources WHERE enabled = true ORDER BY priority"
            )
            return result.fetchall()
    
    async def _should_process(self, url: str) -> bool:
        """ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ°, Ð½ÑƒÐ¶Ð½Ð¾ Ð»Ð¸ Ð¾Ð±Ñ€Ð°Ð±Ð°Ñ‚Ñ‹Ð²Ð°Ñ‚ÑŒ URL."""
        today = datetime.utcnow().date()
        
        async with db_session() as session:
            result = await session.execute(
                """
                SELECT COUNT(*) FROM lex_task_log 
                WHERE url = :url 
                AND DATE(created_at) = :today
                AND status IN ('completed', 'in_progress')
                """,
                {"url": url, "today": today}
            )
            count = result.scalar()
            return count == 0
    
    async def _enqueue_task(self, task) -> None:
        """Ð”Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð·Ð°Ð´Ð°Ñ‡Ð¸ Ð² Ð¾Ñ‡ÐµÑ€ÐµÐ´ÑŒ."""
        task_data = {
            "task_id": f"lex_{task.source}_{datetime.utcnow().timestamp()}",
            "task_type": task.task_type,
            "source": task.source,
            "url": task.url,
            "priority": task.priority,
            "metadata": task.metadata or {},
            "created_at": datetime.utcnow().isoformat()
        }
        
        await redis_client.rpush(self.QUEUE_NAME, json.dumps(task_data))
        
        # Ð›Ð¾Ð³Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ
        async with db_session() as session:
            await session.execute(
                """
                INSERT INTO lex_task_log (task_id, source, url, status, created_at)
                VALUES (:task_id, :source, :url, 'queued', :created_at)
                """,
                {
                    "task_id": task_data["task_id"],
                    "source": task.source,
                    "url": task.url,
                    "created_at": datetime.utcnow()
                }
            )
            await session.commit()
```

---

## 2.7 ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð² Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð°

### 2.7.1 Pipeline Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¸

```mermaid
flowchart TB
    subgraph INPUT["Ð’Ñ…Ð¾Ð´Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ"]
        RAW["Raw HTML Ð¾Ñ‚ Ð°Ð³ÐµÐ½Ñ‚Ð°"]
    end

    subgraph PARSE["ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³"]
        ADAPTER["Source Adapter"]
        EXTRACT["Ð˜Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ Ñ‚ÐµÐºÑÑ‚Ð° Ð¸ Ð¼ÐµÑ‚Ð°Ð´Ð°Ð½Ð½Ñ‹Ñ…"]
    end

    subgraph VALIDATE["Ð’Ð°Ð»Ð¸Ð´Ð°Ñ†Ð¸Ñ"]
        CHECK_TEXT["ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð½Ð°Ð»Ð¸Ñ‡Ð¸Ñ Ñ‚ÐµÐºÑÑ‚Ð°"]
        CHECK_META["ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð¼ÐµÑ‚Ð°Ð´Ð°Ð½Ð½Ñ‹Ñ…"]
        DEDUP["ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð´ÑƒÐ±Ð»Ð¸ÐºÐ°Ñ‚Ð¾Ð²"]
    end

    subgraph AI["AI Pipeline"]
        FILTER["AI Filter"]
        CLASSIFY["AI Classifier"]
        SUMMARIZE["AI Summarizer"]
    end

    subgraph OUTPUT["Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚"]
        SUCCESS["Ð”Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚ Ð² KB + Ð°Ð»ÐµÑ€Ñ‚"]
        REJECT["ÐžÑ‚ÐºÐ»Ð¾Ð½Ñ‘Ð½ (Ð½Ð¸Ð·ÐºÐ°Ñ Ñ€ÐµÐ»ÐµÐ²Ð°Ð½Ñ‚Ð½Ð¾ÑÑ‚ÑŒ)"]
        ERROR["ÐžÑˆÐ¸Ð±ÐºÐ° (ÐºÐ°Ñ€Ð°Ð½Ñ‚Ð¸Ð½)"]
    end

    RAW --> ADAPTER
    ADAPTER --> EXTRACT
    EXTRACT --> CHECK_TEXT
    
    CHECK_TEXT -->|ÐŸÑƒÑÑ‚Ð¾| ERROR
    CHECK_TEXT -->|OK| CHECK_META
    
    CHECK_META -->|ÐÐµÐ²Ð°Ð»Ð¸Ð´Ð½Ð¾| ERROR
    CHECK_META -->|OK| DEDUP
    
    DEDUP -->|Ð”ÑƒÐ±Ð»Ð¸ÐºÐ°Ñ‚| REJECT
    DEDUP -->|Ð£Ð½Ð¸ÐºÐ°Ð»ÐµÐ½| FILTER
    
    FILTER -->|< Ð¿Ð¾Ñ€Ð¾Ð³Ð°| REJECT
    FILTER -->|>= Ð¿Ð¾Ñ€Ð¾Ð³Ð°| CLASSIFY
    
    CLASSIFY --> SUMMARIZE
    SUMMARIZE --> SUCCESS
```

### 2.7.2 ÐšÐ¾Ð´ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÐ° Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð²

```python
# services/result_processor.py

from typing import Optional, Dict
from dataclasses import dataclass
from adapters.base import RawDocument
from services.ai_filter import AIFilter
from services.ai_classifier import AIClassifier
from services.ai_summarizer import AISummarizer
from services.document_formatter import DocumentFormatter
from services.alert_engine import AlertEngine
from core.knowledge_base import kb_client
from core.database import db_session
from models import LexDocument, LexAlert


@dataclass
class ProcessingResult:
    """Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¸ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð°."""
    success: bool
    document_id: Optional[int] = None
    reject_reason: Optional[str] = None
    error: Optional[str] = None


class ResultProcessor:
    """ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸Ðº Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð² Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð°."""
    
    def __init__(self):
        self.ai_filter = AIFilter()
        self.ai_classifier = AIClassifier()
        self.ai_summarizer = AISummarizer()
        self.formatter = DocumentFormatter()
        self.alert_engine = AlertEngine()
    
    async def process(self, raw_document: RawDocument) -> ProcessingResult:
        """ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° ÑÐ¿Ð°Ñ€ÑÐµÐ½Ð½Ð¾Ð³Ð¾ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð°."""
        
        # 1. Ð’Ð°Ð»Ð¸Ð´Ð°Ñ†Ð¸Ñ
        validation_error = self._validate(raw_document)
        if validation_error:
            return ProcessingResult(success=False, error=validation_error)
        
        # 2. ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð´ÑƒÐ±Ð»Ð¸ÐºÐ°Ñ‚Ð¾Ð²
        if await self._is_duplicate(raw_document):
            return ProcessingResult(success=False, reject_reason="duplicate")
        
        # 3. AI-Ñ„Ð¸Ð»ÑŒÑ‚Ñ€Ð°Ñ†Ð¸Ñ
        relevance = await self.ai_filter.evaluate(raw_document.text)
        if not relevance.is_relevant:
            await self._log_rejected(raw_document, relevance.score)
            return ProcessingResult(
                success=False, 
                reject_reason=f"low_relevance ({relevance.score:.2f})"
            )
        
        # 4. AI-ÐºÐ»Ð°ÑÑÐ¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ñ
        classification = await self.ai_classifier.classify(
            raw_document.text,
            raw_document.title
        )
        
        # 5. AI-Ñ€ÐµÐ·ÑŽÐ¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ
        summary = await self.ai_summarizer.summarize(
            raw_document.text,
            raw_document.title,
            classification.category
        )
        
        # 6. Ð¤Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Markdown
        markdown = self.formatter.format(
            raw_document=raw_document,
            classification=classification,
            summary=summary,
            relevance_score=relevance.score
        )
        
        # 7. Ð—Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° Ð² Knowledge Base
        kb_id = await kb_client.upload(
            content=markdown,
            metadata={
                "source": raw_document.source,
                "category": classification.category,
                "access_level": "manager",
                "brand_id": "shared"
            }
        )
        
        # 8. Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ð¼ÐµÑ‚Ð°Ð´Ð°Ð½Ð½Ñ‹Ñ…
        document_id = await self._save_document(
            raw_document=raw_document,
            classification=classification,
            summary=summary,
            relevance_score=relevance.score,
            kb_id=kb_id
        )
        
        # 9. Ð¡Ð¾Ð·Ð´Ð°Ð½Ð¸Ðµ Ð°Ð»ÐµÑ€Ñ‚Ð°
        await self.alert_engine.create_alert(
            document_id=document_id,
            title=raw_document.title,
            category=classification.category,
            relevance=classification.relevance_level,
            summary=summary.short_summary
        )
        
        return ProcessingResult(success=True, document_id=document_id)
    
    def _validate(self, doc: RawDocument) -> Optional[str]:
        """Ð’Ð°Ð»Ð¸Ð´Ð°Ñ†Ð¸Ñ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð°."""
        if not doc.text or len(doc.text) < 100:
            return "Text too short or empty"
        
        if not doc.title:
            return "Title is missing"
        
        if len(doc.text) > 1_000_000:
            return "Text too long (>1MB)"
        
        return None
    
    async def _is_duplicate(self, doc: RawDocument) -> bool:
        """ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð½Ð° Ð´ÑƒÐ±Ð»Ð¸ÐºÐ°Ñ‚."""
        async with db_session() as session:
            result = await session.execute(
                """
                SELECT COUNT(*) FROM lex_documents 
                WHERE (url = :url OR document_number = :number)
                AND source = :source
                """,
                {
                    "url": doc.url,
                    "number": doc.number,
                    "source": doc.source
                }
            )
            return result.scalar() > 0
    
    async def _log_rejected(self, doc: RawDocument, score: float) -> None:
        """Ð›Ð¾Ð³Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð¾Ñ‚ÐºÐ»Ð¾Ð½Ñ‘Ð½Ð½Ð¾Ð³Ð¾ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð°."""
        async with db_session() as session:
            await session.execute(
                """
                INSERT INTO lex_statistics 
                (date, source, action, count, metadata)
                VALUES (CURRENT_DATE, :source, 'rejected', 1, :metadata)
                ON CONFLICT (date, source, action) 
                DO UPDATE SET count = lex_statistics.count + 1
                """,
                {
                    "source": doc.source,
                    "metadata": {"url": doc.url, "score": score}
                }
            )
            await session.commit()
    
    async def _save_document(self, **kwargs) -> int:
        """Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð° Ð² Ð‘Ð”."""
        async with db_session() as session:
            result = await session.execute(
                """
                INSERT INTO lex_documents (
                    source, url, title, document_number, document_date,
                    effective_date, doc_type, category, relevance_level,
                    relevance_score, summary, kb_id, created_at
                ) VALUES (
                    :source, :url, :title, :number, :date,
                    :effective_date, :doc_type, :category, :relevance_level,
                    :relevance_score, :summary, :kb_id, :created_at
                ) RETURNING id
                """,
                {
                    "source": kwargs["raw_document"].source,
                    "url": kwargs["raw_document"].url,
                    "title": kwargs["raw_document"].title,
                    "number": kwargs["raw_document"].number,
                    "date": kwargs["raw_document"].date,
                    "effective_date": kwargs["raw_document"].effective_date,
                    "doc_type": kwargs["classification"].doc_type,
                    "category": kwargs["classification"].category,
                    "relevance_level": kwargs["classification"].relevance_level,
                    "relevance_score": kwargs["relevance_score"],
                    "summary": kwargs["summary"].full_summary,
                    "kb_id": kwargs["kb_id"],
                    "created_at": kwargs["raw_document"].parsed_at
                }
            )
            await session.commit()
            return result.scalar()
```

---

## 2.8 Ð˜ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¸ v2.0 (Ð¿Ð»Ð°Ð½Ñ‹)

### 2.8.1 Ð Ð¾ÑÑÐ¸Ð¹ÑÐºÐ°Ñ Ð³Ð°Ð·ÐµÑ‚Ð°

| ÐŸÐ°Ñ€Ð°Ð¼ÐµÑ‚Ñ€ | Ð—Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ |
|----------|----------|
| URL | `https://rg.ru` |
| Ð Ð°Ð·Ð´ÐµÐ» | `/official-documents/` |
| Ð¢Ð¸Ð¿ | ÐžÑ„Ð¸Ñ†Ð¸Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð¿ÑƒÐ±Ð»Ð¸ÐºÐ°Ñ†Ð¸Ð¸ |
| Ð§Ð°ÑÑ‚Ð¾Ñ‚Ð° | Ð•Ð¶ÐµÐ´Ð½ÐµÐ²Ð½Ð¾ |

### 2.8.2 pravo.gov.ru

| ÐŸÐ°Ñ€Ð°Ð¼ÐµÑ‚Ñ€ | Ð—Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ |
|----------|----------|
| URL | `http://pravo.gov.ru`, `http://publication.pravo.gov.ru` |
| API | Ð’Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ Ð½Ð°Ð»Ð¸Ñ‡Ð¸Ðµ API |
| Ð¢Ð¸Ð¿ | ÐžÑ„Ð¸Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾Ðµ Ð¾Ð¿ÑƒÐ±Ð»Ð¸ÐºÐ¾Ð²Ð°Ð½Ð¸Ðµ |
| Ð§Ð°ÑÑ‚Ð¾Ñ‚Ð° | Ð•Ð¶ÐµÐ´Ð½ÐµÐ²Ð½Ð¾ |

### 2.8.3 Ð¡Ð°Ð¹Ñ‚Ñ‹ Ð³Ð¾ÑÐ¾Ñ€Ð³Ð°Ð½Ð¾Ð²

| Ð˜ÑÑ‚Ð¾Ñ‡Ð½Ð¸Ðº | URL | Ð Ð°Ð·Ð´ÐµÐ»Ñ‹ |
|----------|-----|---------|
| Ð¤ÐÐ¡ | `nalog.gov.ru` | ÐŸÐ¸ÑÑŒÐ¼Ð°, Ñ€Ð°Ð·ÑŠÑÑÐ½ÐµÐ½Ð¸Ñ |
| Ð Ð¾ÑÐ¿Ð¾Ñ‚Ñ€ÐµÐ±Ð½Ð°Ð´Ð·Ð¾Ñ€ | `rospotrebnadzor.ru` | Ð˜Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ñ Ð´Ð»Ñ Ð¿Ð¾Ñ‚Ñ€ÐµÐ±Ð¸Ñ‚ÐµÐ»ÐµÐ¹ |
| Ð Ð¾ÑÐ°ÐºÐºÑ€ÐµÐ´Ð¸Ñ‚Ð°Ñ†Ð¸Ñ | `fsa.gov.ru` | ÐœÐ°Ñ€ÐºÐ¸Ñ€Ð¾Ð²ÐºÐ°, ÑÐµÑ€Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ñ |
| Ð§ÐµÑÑ‚Ð½Ñ‹Ð¹ Ð—ÐÐÐš | `Ñ‡ÐµÑÑ‚Ð½Ñ‹Ð¹Ð·Ð½Ð°Ðº.Ñ€Ñ„` | ÐÐ¾Ð²Ð¾ÑÑ‚Ð¸ ÑÐ¸ÑÑ‚ÐµÐ¼Ñ‹ Ð¼Ð°Ñ€ÐºÐ¸Ñ€Ð¾Ð²ÐºÐ¸ |

---

## 2.9 ÐœÐ¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³ Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¾Ð²

### 2.9.1 Health Checks

| ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° | Ð˜Ð½Ñ‚ÐµÑ€Ð²Ð°Ð» | Ð”ÐµÐ¹ÑÑ‚Ð²Ð¸Ðµ Ð¿Ñ€Ð¸ ÑÐ±Ð¾Ðµ |
|----------|----------|-------------------|
| Ð”Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚ÑŒ ÐšÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ð½Ñ‚ÐŸÐ»ÑŽÑ | 1 Ñ‡Ð°Ñ | ÐÐ»ÐµÑ€Ñ‚ Admin |
| Ð”Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚ÑŒ Ð“Ð°Ñ€Ð°Ð½Ñ‚ | 1 Ñ‡Ð°Ñ | ÐÐ»ÐµÑ€Ñ‚ Admin |
| Ð£ÑÐ¿ÐµÑˆÐ½Ð¾ÑÑ‚ÑŒ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð° > 90% | ÐŸÐ¾ÑÐ»Ðµ Ñ†Ð¸ÐºÐ»Ð° | ÐÐ»ÐµÑ€Ñ‚ Admin |
| ÐšÐ¾Ð»Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð¾Ð² > 0 | ÐŸÐ¾ÑÐ»Ðµ Ñ†Ð¸ÐºÐ»Ð° | Warning Admin |

### 2.9.2 ÐœÐµÑ‚Ñ€Ð¸ÐºÐ¸

| ÐœÐµÑ‚Ñ€Ð¸ÐºÐ° | ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ |
|---------|----------|
| `lex.source.{name}.tasks_created` | Ð¡Ð¾Ð·Ð´Ð°Ð½Ð¾ Ð·Ð°Ð´Ð°Ñ‡ |
| `lex.source.{name}.tasks_completed` | Ð£ÑÐ¿ÐµÑˆÐ½Ð¾ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚Ð°Ð½Ð¾ |
| `lex.source.{name}.tasks_failed` | ÐžÑˆÐ¸Ð±ÐºÐ¸ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð° |
| `lex.source.{name}.documents_accepted` | ÐŸÑ€Ð¸Ð½ÑÑ‚Ð¾ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð¾Ð² |
| `lex.source.{name}.documents_rejected` | ÐžÑ‚ÐºÐ»Ð¾Ð½ÐµÐ½Ð¾ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð¾Ð² |
| `lex.source.{name}.avg_parse_time` | Ð¡Ñ€ÐµÐ´Ð½ÐµÐµ Ð²Ñ€ÐµÐ¼Ñ Ð¿Ð°Ñ€ÑÐ¸Ð½Ð³Ð° |

---

## ÐŸÑ€Ð¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ Ð: ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÑŒÐ½Ñ‹Ðµ Ñ‚Ð¾Ñ‡ÐºÐ¸ Data Sources

| ÐšÑ€Ð¸Ñ‚ÐµÑ€Ð¸Ð¹ | ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° |
|----------|----------|
| ÐÐ´Ð°Ð¿Ñ‚ÐµÑ€Ñ‹ Ð·Ð°Ð³Ñ€ÑƒÐ¶Ð°ÑŽÑ‚ÑÑ | Ð˜Ð¼Ð¿Ð¾Ñ€Ñ‚ Ð±ÐµÐ· Ð¾ÑˆÐ¸Ð±Ð¾Ðº |
| Ð¢Ð¾Ñ‡ÐºÐ¸ Ð²Ñ…Ð¾Ð´Ð° ÐºÐ¾Ñ€Ñ€ÐµÐºÑ‚Ð½Ñ‹ | URL Ð²Ð¾Ð·Ð²Ñ€Ð°Ñ‰Ð°ÑŽÑ‚ 200 |
| Ð¡ÐµÐ»ÐµÐºÑ‚Ð¾Ñ€Ñ‹ Ñ€Ð°Ð±Ð¾Ñ‚Ð°ÑŽÑ‚ | ÐŸÐ°Ñ€ÑÐ¸Ð½Ð³ Ñ‚ÐµÑÑ‚Ð¾Ð²Ñ‹Ñ… ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ† ÑƒÑÐ¿ÐµÑˆÐµÐ½ |
| Ð—Ð°Ð´Ð°Ñ‡Ð¸ Ð³ÐµÐ½ÐµÑ€Ð¸Ñ€ÑƒÑŽÑ‚ÑÑ | > 0 Ð·Ð°Ð´Ð°Ñ‡ Ð² 20:30 |
| Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ñ‹ Ð¾Ð±Ñ€Ð°Ð±Ð°Ñ‚Ñ‹Ð²Ð°ÑŽÑ‚ÑÑ | Ð”Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ñ‹ Ð¿Ð¾ÑÐ²Ð»ÑÑŽÑ‚ÑÑ Ð² KB |
| ÐÐ»ÐµÑ€Ñ‚Ñ‹ ÑÐ¾Ð·Ð´Ð°ÑŽÑ‚ÑÑ | Ð£Ð²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ñ Ð´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÑŽÑ‚ÑÑ |

---

**Ð”Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚ Ð¿Ð¾Ð´Ð³Ð¾Ñ‚Ð¾Ð²Ð»ÐµÐ½:** Ð¯Ð½Ð²Ð°Ñ€ÑŒ 2026  
**Ð’ÐµÑ€ÑÐ¸Ñ:** 1.0  
**Ð¡Ñ‚Ð°Ñ‚ÑƒÑ:** Ð§ÐµÑ€Ð½Ð¾Ð²Ð¸Ðº

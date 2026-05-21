# ChatApp — How It Works (Visual)

> End-to-end chat app flow for **understanding + interviews**.  
> **Update:** `Use architecture-visualizer — update chat flow`

*Last synced: 2026-05-15*

---

## Changelog

### 2026-05-15
- Initial user journey, component tree, message lifecycle (live vs planned).

---

## Legend

| Tag | Meaning |
|-----|---------|
| 🟢 `[LIVE]` | Exists now |
| 🟡 `[PARTIAL]` | File exists, logic incomplete |
| ⚪ `[PLANNED]` | Not built yet |

---

## 1. Poora app — user journey

<!-- STATUS: partial -->

```mermaid
flowchart TD
    Start([User opens app]) --> Load["[LIVE] Vite loads main.jsx"]
    Load --> App["[LIVE] App.jsx renders"]
    App --> RouteCheck{Router wired?}
    RouteCheck -->|No — today| Stub["[PARTIAL] Single App div only"]
    RouteCheck -->|Yes — target| Login["[PLANNED] LoginPage"]
    Login --> Auth{Valid user?}
    Auth -->|No| Login
    Auth -->|Yes| Home["[PLANNED] HomePage\nchat list"]
    Home --> Pick["[PLANNED] Select conversation"]
    Pick --> ChatWin["[PLANNED] Chat window"]
    ChatWin --> Type["[PLANNED] Type message"]
    Type --> Send["[PLANNED] Send btn / Enter"]
    Send --> Socket["[PLANNED] Socket emit"]
    Socket --> Show["[PLANNED] Message appears both sides"]
    Home --> Profile["[PARTIAL] ProfilePage stub"]
```

**Hinglish:** Aaj app start hoti hai `main.jsx` se, lekin router nahi — isliye pages dikhte hi nahi. Neeche wala flow **target** hai jab sab wire ho jayega.

---

## 2. Screens map (files)

<!-- STATUS: partial -->

```mermaid
flowchart LR
    subgraph pages [client/src/pages]
        LP["[PARTIAL] LoginPage.jsx"]
        HP["[PARTIAL] HomePage.jsx"]
        PP["[PARTIAL] ProfilePage.jsx"]
        CW["[PLANNED] ChatWindow.jsx"]
    end

    App["[LIVE] App.jsx"] --> LP
    App --> HP
    App --> PP
    HP --> CW

    subgraph data [Data source]
        Dummy["[LIVE] assets.js\nuserDummyData"]
        API["[PLANNED] REST API"]
    end

    HP -.-> Dummy
    HP -.-> API
    CW -.-> API
```

---

## 3. Ek message bhejne ka lifecycle

<!-- STATUS: planned -->

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Chat UI [PLANNED]
    participant ST as React State [PLANNED]
    participant SK as Socket [PLANNED]
    participant SV as Server [PLANNED]
    participant O as Other User [PLANNED]

    U->>UI: Type + click send
    UI->>ST: add optimistic message
    UI->>SK: emit send_message
    SK->>SV: relay
    SV->>SV: save DB
    SV->>SK: broadcast new_message
    SK->>ST: update state
    ST->>UI: re-render
    SK->>O: deliver to other client
```

**Hinglish:** Pehle message turant screen par (optimistic), phir server confirm kare — fast UX ke liye.

---

## 4. Abhi LIVE kya hota hai (today)

<!-- STATUS: implemented -->

```mermaid
flowchart TD
    A["index.html #root"] --> B["main.jsx"]
    B --> C["StrictMode"]
    C --> D["App.jsx"]
    D --> E["div: App text only"]
    F["assets.js dummy data"] -.->|"not imported in App yet"| D
    G["pages/*.jsx"] -.->|"not routed"| D
```

**Hinglish:** Dummy data aur pages **ban chuke** hain par `App.jsx` unhe use nahi karta — agla step router + layout.

---

## 5. Socket connection states (target)

<!-- STATUS: planned -->

```mermaid
stateDiagram-v2
    [*] --> Disconnected
    Disconnected --> Connecting: user logs in
    Connecting --> Connected: auth OK
    Connected --> Disconnected: network lost
    Disconnected --> Reconnecting: auto retry
    Reconnecting --> Connected: success
    Reconnecting --> Disconnected: max retries
    Connected --> Connected: send/receive messages
```

---

## 6. Component tree (target layout)

<!-- STATUS: planned -->

```mermaid
flowchart TD
    App["App.jsx"] --> Router["BrowserRouter [PLANNED]"]
    Router --> Routes["Routes [PLANNED]"]
    Routes --> Login["LoginPage"]
    Routes --> Layout["MainLayout [PLANNED]"]
    Layout --> Sidebar["Sidebar [PLANNED]\nuser list from API"]
    Layout --> Main["ChatArea [PLANNED]"]
    Main --> Header["ChatHeader [PLANNED]"]
    Main --> Messages["MessageList [PLANNED]"]
    Main --> Input["MessageInput [PLANNED]"]
    Sidebar --> Dummy["[LIVE] map userDummyData"]
```

---

## 7. Data on screen — dummy vs real

| UI need | Today | Later |
|---------|--------|--------|
| User list | `userDummyData` in assets.js | `GET /api/users` |
| Avatars | imported PNGs | same URLs from API |
| Messages | hardcoded / mock | WebSocket + DB |
| Login | stub page | JWT + API |

---

## Optional GIFs

See [`gifs/README.md`](./gifs/README.md) — screen recordings you can add for demos.

---

*Run `update chat flow` when pages, router, or chat UI change.*

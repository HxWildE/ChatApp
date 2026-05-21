# ChatApp — System Design (Architecture)

> Visual architecture: API, DB, WebSocket, fallbacks, storage.  
> **Update:** `Use architecture-visualizer — update architecture`

*Last synced: 2026-05-15*

---

## Changelog

### 2026-05-15
- Initial diagrams: current frontend-only vs target full-stack design.

---

## Legend

| Tag | Meaning |
|-----|---------|
| 🟢 `[LIVE]` | Code exists in repo now |
| 🟡 `[PARTIAL]` | Started, not finished |
| ⚪ `[PLANNED]` | Target design — not built yet |

---

## 1. Context (C4 — Level 1)

<!-- STATUS: partial -->

```mermaid
flowchart TB
    User([User / Browser])
    ChatApp[ChatApp System]
    GitHub[GitHub Remote]

    User --> ChatApp
    ChatApp -.-> GitHub

    subgraph live [LIVE today]
        SPA["[LIVE] React SPA\nclient/"]
    end

    subgraph planned [PLANNED]
        API["[PLANNED] REST API\nserver/"]
        WS["[PLANNED] WebSocket\nSocket.io"]
        DB[(PLANNED MongoDB)]
    end

    User --> SPA
    SPA -.-> API
    SPA -.-> WS
    API -.-> DB
    WS -.-> DB
```

**Hinglish:** Abhi user sirf browser se React app dekhta hai. Backend/DB baad mein add honge — diagram mein dotted = planned.

---

## 2. Containers (Level 2)

<!-- STATUS: partial -->

```mermaid
flowchart LR
    subgraph client [Client — LIVE]
        Vite["[LIVE] Vite Dev Server"]
        React["[LIVE] React 19 SPA"]
        Assets["[LIVE] assets.js\ndummy data"]
        Pages["[PARTIAL] pages/\nstubs only"]
        React --> Assets
        React --> Pages
        Vite --> React
    end

    subgraph server [Server — PLANNED]
        Express["[PLANNED] Express API\n:5000"]
        SocketIO["[PLANNED] Socket.io\nsame server"]
        AuthMW["[PLANNED] JWT middleware"]
        Express --> AuthMW
        Express --> SocketIO
    end

    subgraph data [Data — PLANNED]
        Mongo[(MongoDB)]
        Redis[(Redis — optional\ncache / pubsub)]
    end

    React -->|"REST [PLANNED]"| Express
    React -->|"WS [PLANNED]"| SocketIO
    Express --> Mongo
    SocketIO --> Mongo
    SocketIO -.-> Redis
```

---

## 3. REST call flow (login + fetch chats)

<!-- STATUS: planned -->

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant R as [LIVE] React client
    participant A as [PLANNED] API
    participant D as [PLANNED] MongoDB

    U->>R: Enter email/password
    R->>A: POST /api/auth/login
    A->>D: find user + verify password
    D-->>A: user document
    A-->>R: JWT + user profile
    Note over R: store token localStorage [PLANNED]

    U->>R: Open chat list
    R->>A: GET /api/conversations + Bearer JWT
    A->>D: query conversations
    D-->>A: list
    A-->>R: JSON
    R-->>U: render sidebar [PLANNED UI]
```

**Hinglish:** Login pehle API se token lega, phir har request ke saath JWT bhejega — abhi ye flow code mein nahi, design ready hai.

---

## 4. Real-time message flow (WebSocket)

<!-- STATUS: planned -->

```mermaid
sequenceDiagram
    autonumber
    participant U1 as User A
    participant C1 as React A
    participant S as Socket.io Server
    participant D as MongoDB
    participant C2 as React B
    participant U2 as User B

    C1->>S: connect + JWT
    C2->>S: connect + JWT
    U1->>C1: type message + send
    C1->>S: emit("send_message", payload)
    S->>D: save message
    D-->>S: ack
    S->>C1: emit("message_sent")
    S->>C2: emit("new_message", data)
    C2-->>U2: UI updates instantly
```

---

## 5. Database schema (target)

<!-- STATUS: planned -->

```mermaid
erDiagram
    USER ||--o{ CONVERSATION_MEMBER : joins
    CONVERSATION ||--|{ CONVERSATION_MEMBER : has
    CONVERSATION ||--o{ MESSAGE : contains
    USER ||--o{ MESSAGE : sends

    USER {
        ObjectId _id
        string email
        string fullName
        string profilePic
        string bio
        datetime lastSeen
        string passwordHash
    }

    CONVERSATION {
        ObjectId _id
        string type
        datetime updatedAt
    }

    MESSAGE {
        ObjectId _id
        ObjectId conversationId
        ObjectId senderId
        string text
        datetime createdAt
        boolean seen
    }
```

**Note:** `assets.js` mein `userDummyData` isi shape ka **fake** data hai — API aane par replace hoga.

---

## 6. Fallback & error handling

<!-- STATUS: planned -->

```mermaid
flowchart TD
    A[User action] --> B{Network OK?}
    B -->|Yes| C[Call API / Socket]
    B -->|No| D["[PLANNED] Show offline banner"]
    D --> E["[PLANNED] Queue in localStorage"]
    C --> F{Response?}
    F -->|2xx| G[Update React state]
    F -->|401| H["[PLANNED] Redirect LoginPage"]
    F -->|5xx / timeout| I["[PLANNED] Retry 3x"]
    I --> J{Still failing?}
    J -->|Yes| K["[PLANNED] Toast error +\nkeep queue"]
    J -->|No| G

    subgraph socket [WebSocket reconnect]
        S1[disconnect] --> S2["[PLANNED] exponential backoff"]
        S2 --> S3[reconnect]
        S3 --> S4["[PLANNED] sync missed messages REST"]
    end
```

---

## 7. Storage map

| What | Where | Status |
|------|--------|--------|
| UI state (messages list) | React `useState` / Context | PLANNED |
| Auth token | `localStorage` | PLANNED |
| User/chat list (dev) | `client/src/assets/assets.js` | LIVE (dummy) |
| Persistent messages | MongoDB `messages` | PLANNED |
| Session cache | Redis (optional) | PLANNED |
| Static assets | `client/src/assets/` | LIVE |
| Built SPA | `client/dist/` after build | LIVE tooling |

---

## 8. Deployment (target)

<!-- STATUS: planned -->

```mermaid
flowchart LR
    Dev[Developer] --> Git[GitHub ChatApp]
    Git --> CI["[PLANNED] CI build"]
    CI --> FE["[PLANNED] Host client/dist\nVercel / Netlify"]
    CI --> BE["[PLANNED] Host server\nRailway / Render"]
    BE --> Mongo[(MongoDB Atlas)]
```

---

*Run `update architecture` after adding `server/` or changing data flow.*

# 🌟 ChatApp Architecture & Flow Map

This document serves as the master blueprint of your ChatApp. It maps every frontend function to its corresponding API route, backend controller, database action, and Socket.IO real-time event.

To make the architecture easy to read and understand, the complete system has been broken down into three focused flow diagrams.

---

## 🔐 1. Authentication & Profile Flow

This diagram covers how users sign up, log in, maintain their session on refresh, and update their profile.

```mermaid
graph TD
    %% Define Styles
    classDef frontend fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef route fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff;
    classDef controller fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef db fill:#6366f1,stroke:#4338ca,stroke-width:2px,color:#fff;

    %% Frontend Actions
    subgraph Frontend ["Frontend (AuthContext.jsx)"]
        direction TB
        fnSignup("signup()"):::frontend
        fnLogin("login()"):::frontend
        fnCheckAuth("checkAuth()"):::frontend
        fnUpdateProfile("updateProfile()"):::frontend
    end

    %% Express Routes
    subgraph Routes ["Backend Routes (/api/auth/)"]
        direction TB
        URoute_Signup["POST /signup"]:::route
        URoute_Login["POST /login"]:::route
        URoute_Check["GET /check"]:::route
        URoute_Update["PUT /update-profile"]:::route
    end

    %% Controllers
    subgraph Controllers ["Controllers (userController.js)"]
        direction TB
        UControl_Signup["signup"]:::controller
        UControl_Login["login"]:::controller
        UControl_Check["checkAuth (via protectRoute)"]:::controller
        UControl_Update["updateProfile"]:::controller
    end

    %% Database/Services
    subgraph Services ["External Services"]
        direction TB
        MongoDB[("MongoDB User Collection")]:::db
        Cloudinary["Cloudinary API"]:::db
    end

    %% Connections
    fnSignup -->|"axios.post"| URoute_Signup
    URoute_Signup --> UControl_Signup
    UControl_Signup -->|"Hash Password & Create"| MongoDB

    fnLogin -->|"axios.post"| URoute_Login
    URoute_Login --> UControl_Login
    UControl_Login -->|"Find & Compare Hash"| MongoDB

    fnCheckAuth -->|"axios.get"| URoute_Check
    URoute_Check --> UControl_Check
    UControl_Check -->|"Return req.user"| Frontend

    fnUpdateProfile -->|"axios.put"| URoute_Update
    URoute_Update --> UControl_Update
    UControl_Update -->|"1. Upload Image"| Cloudinary
    Cloudinary -->|"Secure URL"| UControl_Update
    UControl_Update -->|"2. FindByIdAndUpdate"| MongoDB
```

---

## 💬 2. Messaging & Sidebar Flow

This diagram maps how the app fetches the users list (with unread badges) and how users send and fetch messages.

```mermaid
graph TD
    %% Define Styles
    classDef frontend fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef route fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff;
    classDef controller fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef db fill:#6366f1,stroke:#4338ca,stroke-width:2px,color:#fff;

    %% Frontend Actions
    subgraph Frontend ["Frontend (ChatContext.jsx)"]
        direction TB
        fnGetUsers("getUsers()"):::frontend
        fnGetMessages("getMessages(userId)"):::frontend
        fnSendMsg("sendMessage(data)"):::frontend
    end

    %% Express Routes
    subgraph Routes ["Backend Routes (/api/messages/)"]
        direction TB
        MRoute_Users["GET /users"]:::route
        MRoute_Msgs["GET /:id"]:::route
        MRoute_Send["POST /send/:id"]:::route
    end

    %% Controllers
    subgraph Controllers ["Controllers (messageController.js)"]
        direction TB
        MControl_Users["getUsersForSidebar"]:::controller
        MControl_Msgs["getMessages"]:::controller
        MControl_Send["sendMessage"]:::controller
    end

    %% Database/Services
    subgraph Services ["Databases"]
        direction TB
        MongoDB_Users[("MongoDB User Collection")]:::db
        MongoDB_Msgs[("MongoDB Message Collection")]:::db
    end

    %% Connections
    fnGetUsers -->|"axios.get"| MRoute_Users
    MRoute_Users -->|"protectRoute"| MControl_Users
    MControl_Users -->|"Find all Users & Count Unseen"| MongoDB_Users
    MControl_Users -.->|"Counts unseen msgs"| MongoDB_Msgs

    fnGetMessages -->|"axios.get"| MRoute_Msgs
    MRoute_Msgs -->|"protectRoute"| MControl_Msgs
    MControl_Msgs -->|"Find Messages & Update seen:true"| MongoDB_Msgs

    fnSendMsg -->|"axios.post"| MRoute_Send
    MRoute_Send -->|"protectRoute"| MControl_Send
    MControl_Send -->|"Message.create"| MongoDB_Msgs
```

---

## 🚀 ⚡ 3. Real-Time Socket.IO Flow

This diagram illustrates how a newly sent message triggers real-time events to the receiver.

```mermaid
graph TD
    %% Define Styles
    classDef frontend fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef socket fill:#ef4444,stroke:#b91c1c,stroke-width:2px,color:#fff;
    classDef controller fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef db fill:#6366f1,stroke:#4338ca,stroke-width:2px,color:#fff;

    %% Components
    Sender["Sender (sendMessage in Controller)"]:::controller
    SocketIO(("Socket.IO Server")):::socket
    Receiver["Receiver (ChatContext.jsx)"]:::frontend
    
    BackendRoute["GET /api/messages/mark/:id"]:::controller
    MongoDB[("MongoDB Message Collection")]:::db

    %% Flow
    Sender -->|"io.to(receiverId).emit('newMessage')"| SocketIO
    SocketIO -->|"Broadcasts 'newMessage' event"| Receiver
    
    Receiver -->|"Checks if currently chatting with sender"| Condition{"Is Receiver active in this chat?"}
    
    Condition -->|YES| Action1["Add to UI instantly"]
    Action1 -->|"axios.get()"| BackendRoute
    BackendRoute -->|"markMessagesAsSeen()"| MongoDB
    
    Condition -->|NO| Action2["+1 to Unread Badge (State Update)"]
```

---

## 🗂️ Route to Function Quick Reference Table

| Frontend Action / Function | API Method & Route | Backend Controller Function | What Database/Service Does it Hit? |
| :--- | :--- | :--- | :--- |
| `login()` | `POST /api/auth/login` | `login` | MongoDB: `User.findOne()`, bcrypt comparison |
| `signup()` | `POST /api/auth/signup` | `signup` | MongoDB: `User.create()`, bcrypt hashing |
| `checkAuth()` | `GET /api/auth/check` | `checkAuth` | Uses `protectRoute` middleware (JWT Decode) |
| `updateProfile()` | `PUT /api/auth/update-profile` | `updateProfile` | Cloudinary Upload -> MongoDB: `User.findByIdAndUpdate()` |
| `getUsers()` | `GET /api/messages/users` | `getUsersForSidebar` | MongoDB: `User.find()`, multiple `Message.find()` |
| `getMessages(userId)` | `GET /api/messages/:id` | `getMessages` | MongoDB: `Message.find()`, `Message.updateMany()` |
| `sendMessage(data)` | `POST /api/messages/send/:id` | `sendMessage` | Cloudinary Upload -> MongoDB: `Message.create()` -> Socket.IO |
| (Auto on new msg) | `GET /api/messages/mark/:id` | `markMessagesAsSeen`| MongoDB: `Message.findByIdAndUpdate()` |

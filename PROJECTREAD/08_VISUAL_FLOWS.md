# 🌟 08 — 🖼️ Visual Flow Diagrams
### 📌 See How Every Feature ACTUALLY Works — End to End

> **How to use**: For each flow, look at the diagram first, then read the step-by-step breakdown.
> These are the flows interviewers ask you to draw on a whiteboard.

---

## 🚀 1. 🏗️ System Architecture Overview

This shows the big picture — how the browser, server, and external services connect.

![System Architecture Diagram](./img_architecture.jpg)

### 📌 What this shows:
- 💡 **Browser** runs React components (Sidebar, ChatContainer, RightSidebar)
- 💡 **Two communication channels** to the server:
  - **HTTP/REST via Axios** — for login, signup, sending messages, fetching data
  - **WebSocket via Socket.io** — for real-time events (new messages, typing, online status)
- 💡 **Server** has Express API routes AND Socket.io event handlers on the same port
- 💡 **External services**: MongoDB Atlas (data) and Cloudinary CDN (images)

---

## 🚀 2. 📨 Sending a Message — Complete End-to-End Flow

This is the #1 flow interviewers ask about. Know every step.

![Message Send Flow](./img_message_flow.jpg)

### 📌 Step-by-Step Breakdown:

```
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 1: USER A (Frontend — ChatContainer.jsx)                     │
│                                                                     │
│  User types "Hello" → presses Send button                          │
│  handleSendMessage() fires:                                         │
│    → clearTimeout(typingTimeoutRef)  // stop typing indicator       │
│    → socket.emit("stopTyping")      // tell receiver I stopped     │
│    → setInput("")                    // clear the input box         │
│    → sendMessage({ text: "Hello" }) // call ChatContext function   │
└─────────────────────────────────────────┬───────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 2: ChatContext (chatContent.jsx)                             │
│                                                                     │
│  sendMessage(messageData):                                          │
│    → axios.post(`/api/messages/send/${selectedUser._id}`, data)    │
│    → Header automatically includes: { token: <JWT> }               │
└─────────────────────────────────────────┬───────────────────────────┘
                                          │
                              ════════ NETWORK ════════
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 3: SERVER — Middleware Chain                                  │
│                                                                     │
│  Express routes → /api/messages/send/:id                           │
│    → protectRoute middleware:                                       │
│      → reads req.headers.token                                     │
│      → jwt.verify(token, JWT_SECRET)                               │
│      → decoded = { userId: "User_A_id" }                           │
│      → User.findById(decoded.userId).select('-password')           │
│      → req.user = foundUser                                        │
│      → next()                                                       │
└─────────────────────────────────────────┬───────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 4: SERVER — messageController.sendMessage()                  │
│                                                                     │
│  const { text, image } = req.body;                                 │
│  const receiverId = req.params.id;                                 │
│  const senderId = req.user._id;                                    │
│                                                                     │
│  if (image) {                                                       │
│    → cloudinary.uploader.upload(image)  // base64 → CDN URL       │
│    → imageUrl = upload.secure_url                                   │
│  }                                                                  │
│                                                                     │
│  → Message.create({ senderId, receiverId, text, image: imageUrl }) │
│  → Message saved to MongoDB ✅                                     │
└─────────────────────────────────────────┬───────────────────────────┘
                                          │
                              ┌───────────┴───────────┐
                              │                       │
                              ▼                       ▼
┌───────────────────────────────────┐  ┌──────────────────────────────┐
│  PATH A: HTTP Response            │  │  PATH B: WebSocket Push      │
│  → User A (sender)                │  │  → User B (receiver)         │
│                                   │  │                              │
│  res.json({                       │  │  receiverSocketId =          │
│    success: true,                 │  │    userSocketMap[receiverId] │
│    newMessage                     │  │                              │
│  })                               │  │  if (receiverSocketId) {     │
│                                   │  │    io.to(receiverSocketId)   │
│  ChatContext:                     │  │      .emit("newMessage",msg) │
│  setMessages(                     │  │  }                           │
│    prev => [...prev, newMessage]  │  │                              │
│  )                                │  │  chatContent.jsx:            │
│                                   │  │  socket.on("newMessage") →   │
│  ChatContainer re-renders         │  │  setMessages(                │
│  "Hello" appears ✅               │  │    prev => [...prev, msg])   │
│                                   │  │  "Hello" appears ✅          │
└───────────────────────────────────┘  └──────────────────────────────┘
```

### 📌 Key Insight:
> **The sender gets the message via HTTP response. The receiver gets it via WebSocket push.**
> Two completely different delivery mechanisms, both updating the same `messages` state array.

---

## 🚀 3. ⌨️ Typing Indicator — Real-Time Debouncing Flow

This flow demonstrates your understanding of debouncing, WebSockets, and useEffect cleanup.

![Typing Indicator Flow](./img_typing_flow.jpg)

### 📌 Step-by-Step Breakdown:

```
USER A (Sender)                     SERVER (Relay)              USER B (Receiver)
─────────────────                   ──────────────              ─────────────────

Types "H"                          
  │                                 
  ├─ setInput("H")                  
  ├─ socket.emit("typing",         ──────────────────►  socket.on("typing")
  │   {receiverId: B})              looks up B's                │
  │                                 socketId in                 ├─ if senderId === 
  └─ setTimeout(stopTyping,         userSocketMap               │   selectedUser._id
     1500ms) ← TIMER STARTS        io.to(socketId)             │   → setIsTyping(true)
                                    .emit("typing",             │   → "typing..." shows
                                     {senderId: A})             │
Types "e" (400ms later)                                         │
  │                                                             │
  ├─ setInput("He")                                             │
  ├─ socket.emit("typing"...)      ──────────────────►  (already isTyping=true,
  └─ clearTimeout(old timer)                             no visual change)
     setTimeout(stopTyping,         
     1500ms) ← TIMER RESETS                                     
                                                                
Types "l" (300ms later)                                         
  │   ...same pattern...                                        
  │   TIMER RESETS AGAIN                                        
                                                                
[User STOPS typing]                                             
  │                                                             
  └─ 1500ms passes... ⏰                                       
     TIMER FIRES!                                               
     socket.emit("stopTyping",     ──────────────────►  socket.on("stopTyping")
      {receiverId: B})              looks up B's                │
                                    socketId                    ├─ if senderId === 
                                    io.to(socketId)             │   selectedUser._id
                                    .emit("stopTyping",         │   → setIsTyping(false)
                                     {senderId: A})             │   → "typing..." hides
```

### 📌 Why useRef for the timer?
```
typingTimeoutRef = useRef(null)  // NOT useState!
```
> `useRef` stores the timeout ID without causing re-renders. If we used `useState`, 
> every keystroke would set state → re-render → set state → infinite loop of renders 
> just to track an internal timer that the user never sees.

### 📌 The Cleanup Pattern (prevents ghost typing):
```jsx
// When user switches from Chat A to Chat B:
useEffect(() => {
  socket.on("typing", handleTyping);      // Add listener for Chat B
  return () => {
    socket.off("typing", handleTyping);   // Remove listener for Chat A
  };
}, [selectedUser]);  // Re-runs when chat changes
```

---

## 🚀 4. 🔐 JWT Authentication — Login → Every Request

![JWT Authentication Flow](./img_auth_flow.jpg)

### 📌 The Two Phases:

```
╔══════════════════════════════════════════════════════════════════════╗
║  PHASE 1: LOGIN (happens once)                                      ║
║                                                                      ║
║  User enters email + password                                        ║
║    │                                                                 ║
║    ▼                                                                 ║
║  POST /api/auth/login                                                ║
║    │                                                                 ║
║    ▼                                                                 ║
║  Server: loginSchema.safeParse(req.body)  ← ZOD validates format    ║
║    │                                                                 ║
║    ▼                                                                 ║
║  Server: bcrypt.compare(password, storedHash)  ← verify password    ║
║    │                                                                 ║
║    ▼                                                                 ║
║  Server: jwt.sign({ userId }, JWT_SECRET)  ← create token           ║
║    │                                                                 ║
║    ▼                                                                 ║
║  Response: { success: true, token: "eyJhbG...", userData }           ║
║    │                                                                 ║
║    ▼                                                                 ║
║  Client:                                                             ║
║    localStorage.setItem("token", token)  ← persist for page reload  ║
║    api.defaults.headers.common["token"] = token ← auto-attach       ║
║    connectSocket(userData)  ← start WebSocket connection             ║
╚══════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════╗
║  PHASE 2: EVERY SUBSEQUENT REQUEST (automatic)                      ║
║                                                                      ║
║  Any axios.get/post/put call                                         ║
║    │                                                                 ║
║    ├─ Axios automatically adds header: { token: "eyJhbG..." }       ║
║    │  (because of api.defaults.headers.common["token"])              ║
║    │                                                                 ║
║    ▼                                                                 ║
║  Server: protectRoute middleware                                     ║
║    │                                                                 ║
║    ├─ const token = req.headers.token                                ║
║    ├─ const decoded = jwt.verify(token, JWT_SECRET)                  ║
║    │   → Splits token: header.payload.signature                      ║
║    │   → Re-computes HMAC of header+payload with SECRET              ║
║    │   → Compares with token's signature                             ║
║    │   → If match: token is valid, returns payload { userId }        ║
║    │                                                                 ║
║    ├─ const user = User.findById(decoded.userId).select('-password') ║
║    ├─ req.user = user                                                ║
║    └─ next()  → controller runs with req.user available              ║
╚══════════════════════════════════════════════════════════════════════╝
```

### 📌 JWT Token Anatomy:
```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2N2ZiMzcuLi4ifQ.SflKxwRJSM...
│                     │                                   │
└─── Header ──────────└─── Payload ───────────────────────└─── Signature
     { "alg":"HS256" }     { "userId":"67fb37..." }            HMAC-SHA256(
     (base64)              (base64 — NOT encrypted!)            header+payload,
                                                                JWT_SECRET)
```

> ⚠️ **JWT is SIGNED, not ENCRYPTED.** Anyone can decode the payload. Never put sensitive data in it.

---

## 🚀 5. 🟢 Online Presence — How the Green Dot Works

![Online Presence Flow](./img_online_presence.jpg)

### 📌 Step-by-Step:

```
═══ USER COMES ONLINE ═══

1. User A logs in
     │
     ▼
2. AuthContext.connectSocket(userData)
     │
     ▼
3. const newSocket = io(backendUrl, { query: { userId: A._id } })
   newSocket.connect()
     │
     ▼ [WebSocket handshake]
     │
4. SERVER: io.on("connection") fires
     │
     ├── userSocketMap["A_id"] = socket.id
     │
     └── io.emit("getOnlineUsers", ["A_id", "B_id", ...])
              │
              ▼ [Broadcast to ALL connected clients]
              │
5. EVERY CLIENT: socket.on("getOnlineUsers") fires
     │
     ├── setOnlineUsers(["A_id", "B_id", ...])
     │
     └── Sidebar re-renders:
         onlineUsers.includes(user._id)
           ? <span>Online 🟢</span>
           : <span>Offline ⚫</span>


═══ USER GOES OFFLINE ═══

1. User A closes browser / calls logout()
     │
     ▼
2. SERVER: socket.on("disconnect") fires
     │
     ├── delete userSocketMap["A_id"]
     │
     └── io.emit("getOnlineUsers", ["B_id", ...])  // A removed
              │
              ▼
3. ALL CLIENTS: Green dot disappears for User A
```

### 📌 The `userSocketMap` at runtime:
```javascript
// After User A and User C connect:
userSocketMap = {
  "67fb37abc123": "socket_xYz789",   // User A
  "67fb37def456": "socket_aBc012"    // User C
}

// After User A disconnects:
userSocketMap = {
  "67fb37def456": "socket_aBc012"    // Only User C remains
}
```

---

## 🚀 6. 📱 Page Load — Session Restoration Flow

What happens when a user refreshes the page or opens the app in a new tab:

```
Browser opens / Page refreshes
         │
         ▼
main.jsx renders → AuthProvider mounts
         │
         ▼
useState(localStorage.getItem("token"))
  → token = "eyJhbG..." (from previous session)
  → OR token = null (never logged in)
         │
         ▼
useEffect([token]) fires:
         │
         ├── IF token exists:
         │     │
         │     ├── api.defaults.headers.common["token"] = token
         │     │   (set Axios default header)
         │     │
         │     └── checkAuth() → GET /api/auth/check
         │           │
         │           ▼
         │     Server: protectRoute → jwt.verify → User.findById
         │           │
         │           ├── IF valid: { success: true, user: {...} }
         │           │     │
         │           │     ├── setAuthUser(data.user)
         │           │     └── connectSocket(data.user)
         │           │           → WebSocket connects
         │           │           → Online status broadcasts
         │           │
         │           └── IF invalid/expired:
         │                 → Error caught → user stays on login page
         │
         └── IF token is null:
               → authUser remains null
               → Route guard redirects to /login
               → <Navigate to="/login" />
```

---

## 🚀 7. 🔄 Unseen Messages — Badge Counter Flow

How the red badge numbers work on the sidebar:

```
═══ MESSAGE ARRIVES WHILE CHATTING WITH SOMEONE ELSE ═══

User B is chatting with User C (selectedUser = C)
         │
User A sends a message to User B
         │
         ▼
Server: io.to(B's socketId).emit("newMessage", msg)
         │
         ▼
chatContent.jsx → socket.on("newMessage"):
         │
         ├── Is msg.senderId === selectedUser._id?
         │
         ├── NO! (msg is from A, but B is chatting with C)
         │     │
         │     └── setunseenMessages(prev => ({
         │           ...prev,
         │           [A._id]: (prev[A._id] || 0) + 1  // A: 1 → 2 → 3
         │         }))
         │         → Badge shows "3" next to User A's name
         │
         └── YES! (if B was chatting with A)
               │
               ├── setMessages(prev => [...prev, newMessage])
               ├── newMessage.seen = true
               └── axios.get(`/api/messages/mark/${msg._id}`)
                   → Mark as seen on server (no badge needed)


═══ USER B CLICKS ON USER A ═══

onClick: 
  setSelectedUser(A)
  setUnseenMessages(prev => ({ ...prev, [A._id]: 0 }))  // Reset badge to 0
  │
  ▼
useEffect([selectedUser]) fires:
  getMessages(A._id)  → fetches full conversation
  Message.updateMany({ senderId: A, receiverId: B }, { seen: true })
  → All A's messages to B are now marked seen in DB
```

---

*You've seen all the flows. Now try drawing the message send flow on paper from memory. If you can do it — you own this project.*

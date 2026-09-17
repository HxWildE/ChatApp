# 📚 PROJECTREAD — ChatApp Master Learning Hub

> Read this folder **in order**. Each doc builds on the previous one.
> After reading, you should be able to walk into any interview and own the room.

---

## 🗂️ Document Map

| # | File | What You'll Learn |
|---|------|-------------------|
| 00 | `00_INDEX.md` | This file — reading plan, tech stack overview, key facts |
| 01 | `01_ARCHITECTURE_OVERVIEW.md` | The big picture — stack, why each tech, folder structure, data flow diagram |
| 02 | `02_BACKEND_DEEP_DIVE.md` | Express 5, MongoDB/Mongoose, JWT, bcrypt, Zod, Cloudinary — every line explained |
| 03 | `03_FRONTEND_DEEP_DIVE.md` | React 19, Context API, Axios, React Router 7, Socket.io-client — every component |
| 04 | `04_REALTIME_SOCKETIO.md` | How real-time works — Socket.io full lifecycle, typing indicators, online presence |
| 05 | `05_INTERVIEW_100Q.md` | 100 most probable interview questions with detailed answers from this project |
| 06 | `06_10MIN_INTRO.md` | 🎤 10-minute interview walkthrough script — structured, timed, with talking points |
| 07 | `07_DEEP_DIVE_QUESTIONS.md` | 🔥 2-3 layer deep questions per stack — what interviewers ACTUALLY drill into |
| 08 | `08_VISUAL_FLOWS.md` | 🖼️ Visual diagrams — message send, typing indicator, auth, online presence flows |
| 09 | `09_TECHNICAL_CHALLENGES.md` | 🧗‍♂️ The "Tell me about a time you solved a bug" interview answers (STAR method) |
| 📐 | `diagrams/ALL_DIAGRAMS.html` | 🚀 **15 Must-Know Interview Diagrams** — open in browser for live visuals! |
| 📐 | `diagrams/ALL_DIAGRAMS.md` | Same 15 diagrams in Markdown (needs Mermaid extension in VS Code) |
| 💥 | `breakpoints/01_CORE_BREAKPOINTS.md` | The ultimate "What If" scenarios — how the app breaks and why (Advanced) |

---

## 🚀 ⚡ Quick-Start Reading Plan

```
Day 1 → Read 01 (Architecture) → Look at server.js + package.json
Day 2 → Read 02 (Backend)      → Look at controllers/ + models/ + middleware/
Day 3 → Read 03 (Frontend)     → Look at context/ + pages/ + components/
Day 4 → Read 04 (Sockets)      → Run the app, open two browsers, test real-time
Day 5 → Read 05 (Questions)    → Answer out loud. Repeat the ones you can't nail.
Day 6 → Read 06 (10-Min Intro) → Practice delivering it aloud with a timer.
Day 7 → Read 07 (Deep Dive Q)  → These are the follow-ups. Nail them.
       → Read 08 (Visual Flows) → Trace each flow visually. Draw on whiteboard.

DAILY → Open diagrams/ALL_DIAGRAMS.html → scroll through all 15 → try to draw from memory
MASTERY → Read breakpoints/01_CORE_BREAKPOINTS.md → understand the "Why" behind the code
```

---

## 🏗️ Tech Stack At A Glance (Current — Verified Against Code)

```
CLIENT (React 19 + Vite 8)                SERVER (Node.js + Express 5)
┌─────────────────────────────┐          ┌──────────────────────────────┐
│  React 19       (UI)        │  HTTP    │  Express 5    (API server)   │
│  React Router 7 (routing)   │ <------> │  Mongoose 9   (DB ODM)       │
│  Axios 1.19     (HTTP)      │          │  JWT          (auth tokens)  │
│  Socket.io-client 4.8(RT)   │ WebSocket│  bcryptjs 3   (passwords)    │
│  TailwindCSS 4  (styling)   │ <------> │  Socket.io 4.8(realtime)     │
│  react-hot-toast(alerts)    │          │  Cloudinary   (images)       │
│                             │          │  Zod 4        (validation)   │
└─────────────────────────────┘          └──────────────────────────────┘
                                                      │
                                                      ▼
                                         ┌─────────────────────┐
                                         │  MongoDB Atlas      │
                                         │  (cloud database)   │
                                         │  Collections:       │
                                         │   - users           │
                                         │   - messages        │
                                         └─────────────────────┘
```

---

## 🔑 Key Things to Know Before You Start

1. **This is a MERN app** — MongoDB, Express, React, Node.js
2. **Auth uses JWT stored in localStorage** — not sessions/cookies
3. **Real-time via Socket.io** — WebSocket connection per user
4. **Images stored on Cloudinary** — base64 → cloud URL pipeline
5. **Two contexts** — `AuthContext` (who am I?) and `ChatContext` (who am I talking to?)
6. **Zod validation** — signup & login inputs validated server-side with Zod schemas
7. **Express 5** — latest major version (not Express 4)
8. **Health check endpoint** — `GET /api/status` returns "Server is live !"

---

## 📊 Quick-Fire Numbers (Updated)

| Topic | Key Number/Fact |
|-------|----------------|
| JWT parts | 3 (header.payload.signature) |
| bcrypt salt rounds | default (genSalt() without argument) |
| MongoDB document limit | 16MB |
| Typing debounce delay | 1500ms |
| Express body limit | 15mb |
| Port (server) | 5000 (default) |
| Image encoding overhead | ~33% larger in base64 |
| DB collections | 2 (users, messages) |
| Contexts | 2 (AuthContext, ChatContext) |
| Pages | 3 (Login, Home, Profile) |
| Components | 3 (Sidebar, ChatContainer, RightSidebar) |
| Socket.io custom events | 5 (getOnlineUsers, newMessage, typing, stopTyping, disconnect) |
| Protected routes | All message routes + /auth/check + /auth/update-profile |
| Public routes | /auth/signup, /auth/login, /api/status |
| Validation library | Zod 4 (server-side schema validation) |

---

*Generated for ChatApp project — start with `01_ARCHITECTURE_OVERVIEW.md`*

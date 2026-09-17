# 📅 ChatApp — Progress Log

Keep track of the project's milestones, daily development logs, and feature additions here.

---

## 🚀 **2026-08-11: Full-Stack Skeleton & Auth**

### 📝 Summary
The project is now a working full-stack chat app skeleton with a **React/Vite frontend** and an **Express/Mongoose backend**. Authentication, protected message routes, and profile update support are implemented, while the UI is already wired to a chat-focused layout.

### 🛠️ What Changed
- **Frontend Layout**: Renders a home chat experience with sidebar, chat window, and optional right-side panel.
- **Routing**: Active for `Home`, `Login`, and `Profile` views.
- **Backend Auth**: Endpoints exposed for signup, login, auth checks, and profile updates.
- **Messaging**: Endpoints support sidebar user discovery, fetching message history, and marking messages as seen.
- **Media Uploads**: Cloudinary support is available for profile image uploads.

### 📊 Current Status

| Area | Status | Notes |
|------|--------|-------|
| 🖥️ **Frontend UI** | 🟢 Live | HomePage, LoginPage, ProfilePage, and chat layout are present. |
| 🔀 **Routing** | 🟢 Live | React Router is configured in the app shell. |
| 🔐 **Authentication API**| 🟢 Live | Signup/login/profile update routes exist. |
| 💬 **Message API** | 🟢 Live | User/message retrieval and seen-state logic exist. |
| ⚡ **Real-time Chat** | 🟡 Partial | Socket.IO server is ready, but full frontend integration is pending. |

### 🎯 Next Steps
- [ ] Connect the chat UI to live backend message APIs
- [ ] Wire Socket.IO into the frontend for instant message updates
- [ ] Replace dummy data with real user/message payloads from the API
- [ ] Add stronger error handling and loading states

---

## 🎨 **2026-06-17: UI/UX Fixes**

### 📝 Summary
The chat container and homepage layout were corrected so the selected user flow works properly.

### 🛠️ Notes
- Chat container props were fixed.
- The sidebar-to-chat layout gap was removed.
- Right sidebar now hides when a conversation is selected.

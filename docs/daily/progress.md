# ChatApp — Progress Log

> Active file. Rotated via `new progress doc`. Updated via `update progress`.

---

## 2026-06-17

### Summary

Fixed critical bug in `ChatContainer` component where props were not being received. Component was checking undefined variable `setselectedUser` instead of using passed props `selectedUser` and `setSelectedUser`. Fixed sidebar-to-chat-container width gap (was `gap-64`, now `gap-0`). Hidden RightSidebar on user selection.

### Changes

- **Modified:** `client/src/components/chatContainer.jsx`
  - Line 4: Accept props destructuring `{ selectedUser, setSelectedUser }`
  - Line 5: Use `selectedUser` instead of `setselectedUser` in conditional
  - Line 15: Fix onClick to call `setSelectedUser(null)` (was `selectedUser(null)`)
  - Line 32: Export `ChatContainer` instead of `chatContainer`
- **Modified:** `client/src/pages/HomePage.jsx`
  - Line 13: Change `gap-64` → `gap-0` to remove huge gap between sidebar and chat
  - Line 13: Swap grid layout logic so RightSidebar hidden on selection
  - Line 18: Conditional render RightSidebar only when no user selected

### Not committed yet

Changes in `ChatContainer.jsx` and `HomePage.jsx` — staged and ready to commit.

### Stack & tools in use

| Tool | Version | Used for |
|------|---------|----------|
| React | 19.2.6 | UI components & state |
| Vite | 8.0.12 | Dev server & build |
| Tailwind CSS | 4.3.0 | Responsive grid layout |
| react-router-dom | 7.15.1 | (not yet active) |
| Git | — | Version control |

### Features / pages status

| Area | Status | Notes |
|------|--------|-------|
| ChatContainer | Fixed | Props now work; shows selected user |
| Sidebar | Working | Click user → state updates |
| HomePage layout | Fixed | Gap removed; RightSidebar conditionally rendered |
| Message list | Not started | Next: display actual messages |
| Real-time | Not started | WebSocket planned |

### Blockers / next steps

- Test chat selection flow in browser
- Display actual messages in ChatContainer (instead of hard-coded Martin Johnson)
- Add message input form
- Implement message send/receive flow

### Git

- Last commit: `d7aed95` — "chat Screens"
- Current branch: `main`
- Uncommitted: `ChatContainer.jsx`, `HomePage.jsx` (both modified)

---

## 2026-05-15

### Summary

Project bootstrapped as a monorepo with Vite + React frontend in `client/`. Git initialized at repo root and pushed to GitHub (`HxWildE/ChatApp`). UI scaffolding started: page components, asset barrel file with dummy chat data, Tailwind configured. Routing and main App shell not wired yet.

### Changes

- **Added:** `client/` — Vite React app (React 19, Vite 8, Tailwind 4, React Router 7 in package.json)
- **Added:** Pages — `HomePage`, `LoginPage`, `ProfilePage` (placeholder JSX)
- **Added:** `client/src/assets/assets.js` — image imports, `assets` export, `userDummyData`, `imagesDummyData`
- **Added:** Many UI assets (icons, profile pics, logos, dummy images)
- **Modified:** `client/src/index.css`, `client/public/favicon.svg`
- **Not committed yet:** All pages, assets, `assets.js`, CSS/favicon changes (still local / untracked)

### Stack & tools in use

| Tool | Version | Used for |
|------|---------|----------|
| React | 19.2.6 | UI components |
| Vite | 8.0.12 | Dev server & build |
| Tailwind CSS | 4.3.0 | Styling (`@tailwindcss/vite`) |
| react-router-dom | 7.15.1 | Installed; **not wired in App yet** |
| ESLint | 10.x | Linting |
| Git + GitHub | — | Version control; remote `origin/main` |

### Features / pages status

| Area | Status | Notes |
|------|--------|-------|
| App shell | Placeholder | `App.jsx` minimal |
| HomePage | Stub | Static heading |
| LoginPage | Stub | Static heading |
| ProfilePage | Stub | Invalid `color` attr on `<h1>` |
| Routing | Not started | Router not in `main.jsx` |
| Chat UI | Not started | Dummy data in `assets.js` |
| Backend / API | Not started | — |

### Blockers / next steps

- Wire `react-router-dom` in `App.jsx` / `main.jsx`
- Build chat layout using dummy data from `assets.js`
- Fix `ProfilePage` — use `className` instead of `color`
- Commit current WIP assets and pages

### Git

- Commits: `393a530` — first commit
- Branch: `main` (tracking `origin/main`)

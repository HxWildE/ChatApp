# ChatApp — Progress Log

> Active file. Rotated via `new progress doc`. Updated via `update progress`.

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

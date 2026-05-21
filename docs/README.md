# ChatApp — Documentation Commands

Run in **Agent chat**. Schedule is yours — no auto calendar.

---

## Progress & interview (`daily-progress-reporter`)

| Command | Action |
|---------|--------|
| **`update progress`** | Progress log + interview prep (Hinglish Q&A) |
| **`new progress doc`** | Rotate `docs/daily/progress-part-NN.md` |
| **`new interview doc`** | Rotate `docs/interview/part-NN.md` |

**Example:**  
> Use daily-progress-reporter — **update progress**

---

## Architecture & visuals (`architecture-visualizer`)

| Command | Action |
|---------|--------|
| **`update architecture`** | Refresh system design + chat flow Mermaid diagrams |
| **`update chat flow`** | Same (focus on `chat-app-working.md`) |
| **`new architecture doc`** | Rotate/split when `system-design.md` too long |

**Example:**  
> Use architecture-visualizer — **update architecture**

### What you get

| File | Content |
|------|---------|
| `docs/architecture/system-design.md` | API, DB, WebSocket, fallback, storage diagrams |
| `docs/architecture/chat-app-working.md` | User journey, message lifecycle, component tree |
| `docs/architecture/gifs/README.md` | GIF wishlist (you record, agent links) |

**Diagrams dekho:** Install **Markdown Preview Mermaid Support** extension, then `Ctrl+Shift+V` — **OR** open `docs/architecture/preview.html` in browser.

**GIFs:** Agent does not auto-create GIF files — follow wishlist, drop `.gif` in `docs/architecture/gifs/`, then run `update architecture`.

---

## Folder layout

```
docs/
  README.md
  ACTIVE.md
  daily/progress.md
  interview/part-01.md
  architecture/
    system-design.md
    chat-app-working.md
    gifs/README.md
```

---

## Tips

- After big feature: run **both** `update progress` and `update architecture`
- Commit docs with code
- Interview answers: **Hinglish** | Architecture explanations under diagrams: **Hinglish**

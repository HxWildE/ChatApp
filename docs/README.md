# 📚 ChatApp Documentation

This folder holds the working notes, architecture references, and interview preparation material for the project.

## 🗂️ Current Documentation Set

- [**docs/ACTIVE.md**](ACTIVE.md) — Active docs map and pointers
- [**docs/daily/progress.md**](daily/progress.md) — Feature and milestone log
- [**docs/interview/part-01.md**](interview/part-01.md) — Interview notes and talking points
- [**docs/architecture/system-design.md**](architecture/system-design.md) — Overall system structure and architecture
- [**docs/architecture/chat-app-working.md**](architecture/chat-app-working.md) — User journey and application flow
- [**docs/architecture/preview.html**](architecture/preview.html) — **Interactive Visual Diagrams Viewer (Browser)**
- [**docs/architecture/gifs/README.md**](architecture/gifs/README.md) — GIF/demo asset notes

---

## 🔁 Recommended Update Flow

After a meaningful feature change, update the docs in this logical order to maintain consistency:

1. **Progress log** in [docs/daily/progress.md](daily/progress.md)
2. **Architecture notes** in [docs/architecture/system-design.md](architecture/system-design.md)
3. **User-flow notes** in [docs/architecture/chat-app-working.md](architecture/chat-app-working.md)
4. **Interview notes** in [docs/interview/part-01.md](interview/part-01.md)

---

## 📂 Folder Layout

```text
docs/
  ├── ACTIVE.md
  ├── README.md
  ├── daily/
  │   └── progress.md
  ├── interview/
  │   └── part-01.md
  └── architecture/
      ├── system-design.md
      ├── chat-app-working.md
      ├── preview.html
      └── gifs/
          └── README.md
```

---

## 📝 Important Notes

- The current implementation includes a **React frontend**, an **Express backend**, and **Mongoose-based persistence**.
- The architecture docs should be actively updated whenever routes, database models, or UI flows change.
- **Visuals & Diagrams**: Mermaid diagrams can be previewed in VS Code with the Markdown preview support extension, or natively in the browser via `preview.html`.

# ChatApp Documentation

This folder holds the working notes, architecture references, and interview prep material for the project.

## Current documentation set

- [docs/ACTIVE.md](ACTIVE.md) — active docs map
- [docs/daily/progress.md](daily/progress.md) — feature and milestone log
- [docs/interview/part-01.md](interview/part-01.md) — interview notes and talking points
- [docs/architecture/system-design.md](architecture/system-design.md) — overall system structure
- [docs/architecture/chat-app-working.md](architecture/chat-app-working.md) — user journey and app flow
- [docs/architecture/gifs/README.md](architecture/gifs/README.md) — GIF/demo asset notes

## Recommended update flow

After a meaningful feature change, update the docs in this order:

1. Progress log in [docs/daily/progress.md](daily/progress.md)
2. Architecture notes in [docs/architecture/system-design.md](architecture/system-design.md)
3. User-flow notes in [docs/architecture/chat-app-working.md](architecture/chat-app-working.md)
4. Interview notes in [docs/interview/part-01.md](interview/part-01.md)

## Folder layout

```text
docs/
  ACTIVE.md
  README.md
  daily/progress.md
  interview/part-01.md
  architecture/
    system-design.md
    chat-app-working.md
    gifs/README.md
```

## Notes

- The current implementation already includes a React frontend, an Express backend, and Mongoose-based persistence.
- The architecture docs should be updated whenever routes, models, or UI flow change.
- Mermaid diagrams can be previewed in VS Code with Markdown preview support.

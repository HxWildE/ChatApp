---
name: update-all-docs
description: >-
  Scans the codebase to detect architectural changes and dynamically updates all markdown documentation and diagrams in the docs, PROJECTREAD, and interview-dossier directories.
---

# Update All Docs Skill

When the user asks to "update all docs" or invokes this skill, you must execute the following workflow to ensure all documentation reflects the living codebase.

## Workflow

1. **Scan Core Logic:**
   - Use `grep_search` and `view_file` to inspect the main application entry points (`server/server.js`, `server/app.js`, `client/src/main.jsx`).
   - Check `server/socket/socket.js` for real-time logic changes.
   - Inspect database schemas in `server/models/` to identify new fields or indexes.
   - Look at `client/package.json` and `server/package.json` to identify newly added dependencies.

2. **Target Directories for Updates:**
   You must ensure documentation in the following directories is completely accurate:
   - `docs/`
   - `PROJECTREAD/`
   - `docs/interview-dossier/`

3. **Execution Protocol:**
   - Instead of blindly rewriting entire files, identify outdated architectural claims (e.g., deprecated authentication methods, old database query logic, missing caching layers).
   - Use `multi_replace_file_content` to surgically inject or rewrite the outdated sections.
   - If a major architectural shift has occurred (e.g., transitioning from MongoDB to PostgreSQL, or adding Redis), regenerate the Mermaid diagrams in `docs/architecture/FINAL_ARCHITECTURE_DIAGRAMS.md` to reflect the new state.
   - If legacy files in `PROJECTREAD/` are too massive to update line-by-line, ensure they have a prominent Update Notice at the top linking to the newer `interview-dossier` files.

4. **Completion Report:**
   - After updating, output a clear, bulleted summary to the user detailing exactly which Markdown files were modified and what specific architectural changes were synchronized.

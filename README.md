# FLUX Notes

> A local-first productivity app combining connected notes, task management, and focus tools.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)
![Electron](https://img.shields.io/badge/Electron-40-47848F.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg)

## Philosophy

FLUX Notes is built on the **Omakase** principle — opinionated defaults that just work. No plugins, no endless configuration, no feature bloat. Just the tools you need to enter and maintain flow state.

### Core Principles

- **Flow State First** — Every interaction minimizes friction and cognitive load
- **Local-First** — All data stays on your device. No account required, no sync tax
- **Connected Thinking** — Notes and tasks aren't silos. Everything links
- **Keyboard-First** — Everything accessible via shortcuts. `Cmd+K` for anything
- **Speed as a Feature** — <500ms startup, instant search, no loading spinners

## Features

### Connected Notes
- Rich markdown editing with live preview
- Auto-extracted `#tags` and `@mentions`
- Bidirectional `[[wiki-style]]` links
- Full-text search with FTS5
- Backlinks panel for each note

### Smart Tasks
- Link tasks to related notes for context
- Status workflow: Pending → In Progress → Completed
- Priority levels (Low / Medium / High)
- Due dates with relative display
- Kanban board & list views
- Today / Upcoming / Someday filters

### Focus Timer
- Pomodoro presets (25/5/45/60 min)
- Desktop notifications
- Session history & statistics
- Daily and weekly focus streaks
- Associate sessions with specific tasks

### Knowledge Graph
- Interactive visualization of note connections
- Local graph (single note) & global graph views
- Discover hidden relationships
- Cluster detection

## Tech Stack

```
FLUX Notes
├── Runtime: Electron 40 (Chromium + Node.js)
├── Build: Vite 6
├── UI: React 19 + TypeScript 5.9
├── Styling: Tailwind CSS v4
├── Components: shadcn/ui (Zinc theme)
├── Icons: Remix Icon
├── Database: better-sqlite3 (WAL mode)
├── Search: FTS5 full-text + transformers.js (semantic)
└── Graph: react-force-graph
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/Jericoz-JC/flux-notes.git
cd flux-notes

# Install dependencies
pnpm install

# Rebuild native modules for Electron
pnpm exec electron-rebuild

# Start development server
pnpm dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite + Electron in development mode |
| `pnpm build` | Build for production |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm lint` | Run ESLint |

## Project Structure

```
flux-notes/
├── electron/                 # Electron main process
│   ├── main.ts              # Main entry, IPC handlers
│   ├── preload.ts           # Context bridge (secure IPC)
│   ├── database.ts          # SQLite initialization
│   └── repositories/        # Data access layer
│       ├── notes.ts         # Notes CRUD + tags + search
│       ├── todos.ts         # Todos CRUD + filters
│       ├── focus.ts         # Focus sessions + streaks
│       └── links.ts         # Bidirectional links
├── src/
│   ├── App.tsx              # Main React component
│   ├── main.tsx             # React entry point
│   ├── components/ui/       # shadcn/ui components
│   ├── features/            # Feature modules (WIP)
│   ├── stores/              # Zustand stores (WIP)
│   └── styles/globals.css   # Tailwind + theme
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Database Schema

```sql
-- Core entities
notes (id, title, body, created_at, updated_at)
todos (id, title, description, status, priority, due_date, note_id, parent_id, ...)
tags (id, name)
links (id, source_type, source_id, target_type, target_id, link_type, ...)
focus_sessions (id, start_time, end_time, duration, actual_duration, status, todo_id, ...)

-- Full-text search
notes_fts (title, body) -- FTS5 virtual table
todos_fts (title, description) -- FTS5 virtual table
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` | Command palette |
| `Cmd+Shift+N` | Quick capture |
| `Cmd+N` | New note |
| `Cmd+Enter` | Create task |
| `Cmd+F` | Search |

## Roadmap

- [x] Phase 0: Foundation (Electron + Vite + React + SQLite)
- [ ] Phase 1: Notes Module (TipTap editor, wiki links)
- [ ] Phase 2: Todos Module (Kanban, filters)
- [ ] Phase 3: Focus Timer (Pomodoro, notifications)
- [ ] Phase 4: Graph View (react-force-graph)
- [ ] Phase 5: Search (semantic with transformers.js)
- [ ] Phase 6: Daily Notes & Templates
- [ ] Phase 7: Import/Export

## What We Don't Build

Following the Omakase philosophy, we intentionally avoid:

- ❌ Plugin/extension ecosystem
- ❌ Complex permission systems
- ❌ 50 block types (keep it simple)
- ❌ AI chatbot (focus on your workflow)
- ❌ Collaboration features (local-first)
- ❌ Cloud sync (maybe later, not at launch)

## Contributing

This is currently a personal project. Feel free to open issues for bugs or suggestions.

## License

MIT

---

**FLUX Notes** — Flow state first.

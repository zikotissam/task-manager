# Task Manager

A full-stack task manager built with Next.js, TypeScript, Tailwind CSS, and SQLite.

## Tech stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (dark mode via class) |
| Database | SQLite via better-sqlite3 |

## Project structure

```
src/
├── app/
│   ├── layout.tsx          (root layout + theme provider)
│   ├── page.tsx            (task list page)
│   ├── globals.css
│   └── api/
│       └── tasks/
│           ├── route.ts    (GET list, POST create)
│           └── [id]/
│               └── route.ts (GET, PATCH, DELETE)
├── components/
│   ├── ThemeProvider.tsx
│   ├── ThemeToggle.tsx
│   ├── TaskList.tsx
│   ├── TaskItem.tsx
│   ├── AddTaskForm.tsx
│   └── SearchBar.tsx
├── lib/
│   └── db.ts               (SQLite helpers)
└── types.ts
```

## opencode config

| What | Name | File |
|------|------|------|
| Subagent | `feature-planner` | `.opencode/agents/feature-planner.md` |
| Subagent | `teacher` | `.opencode/agents/teacher.md` |
| Subagent | `reviewer` | `.opencode/agents/reviewer.md` |
| Skill | `add-page` | `.opencode/skills/add-page/SKILL.md` |
| Skill | `create-agent` | `.opencode/skills/create-agent/SKILL.md` |
| Command | `seed` | `.opencode/commands/seed.md` |
| Script | `seed-db.sh` | `.opencode/scripts/seed-db.sh` |

## Commands

- `npm run dev` — start the dev server
- `npm run build` — build for production
- `npm start` — run production build
- `/seed` in opencode — populate the database with sample tasks

## Shell

Git Bash is available. Do not use PowerShell cmdlets.

# Task Manager

Full-stack task manager: Next.js 16, TypeScript, Tailwind CSS v4, SQLite via libSQL/Turso.

## Structure

```
src/
├── middleware.ts               (auth guard – protects all private routes)
├── types.ts
├── app/
│   ├── layout.tsx              (root layout – ThemeProvider + AuthProvider, no sidebar)
│   ├── page.tsx                (redirect / → /tasks)
│   ├── globals.css
│   ├── not-found.tsx           (custom 404)
│   ├── login/page.tsx          (email/password + GitHub OAuth)
│   ├── register/page.tsx       (POST /api/auth/signup, then redirect /login)
│   ├── tasks/
│   │   ├── layout.tsx          (sidebar layout via AppLayout)
│   │   ├── page.tsx            (task list – filter, sort, search, inline edit)
│   │   └── error.tsx           (error boundary)
│   ├── dashboard/
│   │   ├── layout.tsx          (sidebar layout via AppLayout)
│   │   └── page.tsx            (stats cards, priority breakdown, recent activity)
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/route.ts   (next-auth handler)
│       │   └── signup/route.ts          (POST – bcryptjs hash, create user)
│       └── tasks/
│           ├── route.ts        (GET list/search, POST create)
│           └── [id]/route.ts   (GET, PATCH, DELETE – owner check)
├── components/
│   ├── AppLayout.tsx           (shared Sidebar + ToastProvider wrapper)
│   ├── AuthProvider.tsx        (SessionProvider wrapper)
│   ├── ThemeProvider.tsx       (dark mode context + localStorage)
│   ├── ThemeToggle.tsx
│   ├── Sidebar.tsx             (nav: Tasks/Dashboard, user avatar, theme, sign out)
│   ├── ToastProvider.tsx       (toast context + useToast hook)
│   ├── ConfirmDialog.tsx       (modal – Escape to close, Cancel/Delete)
│   ├── TaskSkeleton.tsx        (pulsing card skeleton)
│   ├── TaskList.tsx / TaskItem.tsx / AddTaskForm.tsx / SearchBar.tsx
└── lib/
    ├── db.ts                   (@libsql/client – local file:data/tasks.db or remote Turso)
    ├── auth.ts                 (next-auth config – GitHub + Credentials providers)
    └── env.ts                  (validates required env vars at runtime)
```

## Commands

| Command | What |
|---------|------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Run production build |
| `npm run lint` | ESLint (not `next lint`) |
| `/seed` in opencode | Seed `data/tasks.db` with 10 sample tasks (hardcoded user_id=1) |

No test framework is configured.

## Authentication

- **next-auth v5** with GitHub OAuth + Credentials (email/password via bcryptjs).
- Custom signup at `POST /api/auth/signup` (validates email format, checks dups, hashes with bcryptjs cost 12).
- `.env*` is gitignored. Local `.env.local` contains `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`.

## Database

Uses `@libsql/client` (Turso), NOT `better-sqlite3`. Two modes:
- **Local**: `file:data/tasks.db` (default) – `data/` dir created automatically, gitignored.
- **Remote**: set `TURSO_DB_URL` (libsql://…) and `TURSO_AUTH_TOKEN` env vars.

Seed script (`npm run seed` not available; use `/seed` in opencode or run `.opencode/scripts/seed-db.sh` manually from project root).

## Routing (Next.js 16)

Route handler `params` is `Promise<{ id: string }>` — must `await` before use.

## Path alias

`@/*` → `./src/*` (configured in `tsconfig.json`).

## opencode config

| What | Name | File |
|------|------|------|
| Subagent | feature-planner | `.opencode/agents/feature-planner.md` |
| Subagent | teacher | `.opencode/agents/teacher.md` |
| Subagent | reviewer | `.opencode/agents/reviewer.md` |
| Skill | add-page | `.opencode/skills/add-page/SKILL.md` |
| Skill | create-agent | `.opencode/skills/create-agent/SKILL.md` |
| Command | seed | `.opencode/commands/seed.md` |
| Script | seed-db.sh | `.opencode/scripts/seed-db.sh` |

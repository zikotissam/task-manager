# Task Manager

A full-stack task manager built with Next.js 16, TypeScript, Tailwind CSS v4, and SQLite via libSQL/Turso.

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
npm install
cp .env.example .env.local   # then edit AUTH_SECRET, AUTH_GITHUB_ID, AUTH_GITHUB_SECRET
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Var | Required | Default | Description |
|-----|----------|---------|-------------|
| `AUTH_SECRET` | Yes | — | NextAuth secret (generate via `openssl rand -hex 32`) |
| `AUTH_GITHUB_ID` | Yes* | — | GitHub OAuth App client ID |
| `AUTH_GITHUB_SECRET` | Yes* | — | GitHub OAuth App client secret |
| `TURSO_DB_URL` | No | `file:data/tasks.db` | Turso DB URL for remote mode |
| `TURSO_AUTH_TOKEN` | No | — | Turso auth token for remote mode |

*Only required if using GitHub OAuth — credentials provider works without them.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Run production build |
| `npm run lint` | Run ESLint |

## Database

- **Local**: SQLite via `@libsql/client` at `data/tasks.db` (auto-created, gitignored).
- **Remote**: Set `TURSO_DB_URL` and `TURSO_AUTH_TOKEN`.

### Seed

```bash
# In opencode:
/seed

# Or manually:
bash .opencode/scripts/seed-db.sh
```

Seeds 10 sample tasks for `user_id=1`.

## Tech stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (dark mode via class toggle) |
| Database | SQLite via `@libsql/client` (Turso SDK) |
| Auth | next-auth v5 (GitHub OAuth + Credentials) |
| Hashing | bcryptjs (cost 12) |

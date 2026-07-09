# Task Manager

Full-stack task manager with auth, dashboard, and dark mode. Built with Next.js 16, TypeScript, Tailwind CSS v4, and SQLite via libSQL/Turso.

## Features

- **Auth** — GitHub OAuth + email/password (next-auth v5, bcryptjs)
- **Task CRUD** — Create, read, update, delete; inline edit title/status/priority/due date
- **Filter, sort & search** — By status, priority, due date; sort by date/priority/title
- **Dashboard** — Stats cards, priority breakdown, recent activity
- **Dark mode** — Toggle via sidebar, persisted in localStorage
- **Responsive sidebar** — Fixed on desktop, hamburger drawer on mobile
- **Keyboard shortcut** — Press `N` to create a new task
- **Error handling** — Custom 404 page, error boundary for `/tasks`, toasts for success/error

## Routes

| Path | Description |
|------|-------------|
| `/` | Redirects to `/tasks` |
| `/tasks` | Task list with filter, sort, search, inline edit |
| `/dashboard` | Statistics and activity overview |
| `/login` | Sign in (GitHub OAuth + credentials) |
| `/register` | Create an account |
| `/api/auth/*` | NextAuth handler |
| `/api/tasks` | Task CRUD API (GET list, POST create) |
| `/api/tasks/[id]` | Task CRUD API (GET, PATCH, DELETE) |

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in secrets (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Auth setup

1. Create a GitHub OAuth App at **Settings → Developer settings → OAuth Apps**
2. Set callback URL to `http://localhost:3000/api/auth/callback/github`
3. Fill `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` in `.env.local`
4. Credentials provider works without GitHub — sign up at `/register`

## Environment variables

| Var | Required | Default | Description |
|-----|----------|---------|-------------|
| `AUTH_SECRET` | Yes | — | NextAuth secret (`openssl rand -hex 32`) |
| `AUTH_GITHUB_ID` | No* | — | GitHub OAuth App client ID |
| `AUTH_GITHUB_SECRET` | No* | — | GitHub OAuth App client secret |
| `AUTH_URL` | No | `http://localhost:3000` | App URL (set on Vercel) |
| `TURSO_DB_URL` | No | `file:data/tasks.db` | Turso DB URL for remote mode |
| `TURSO_AUTH_TOKEN` | No | — | Turso auth token for remote mode |

\* Only if using GitHub OAuth. Credentials provider works without them.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Run production build |
| `npm run lint` | Run ESLint |

## Database

- **Local**: SQLite via `@libsql/client` at `data/tasks.db` (auto-created, gitignored)
- **Remote**: Set `TURSO_DB_URL` and `TURSO_AUTH_TOKEN` for Turso

### Seed data

```bash
# In opencode:
/seed

# Or manually (requires bash):
bash .opencode/scripts/seed-db.sh
```

Seeds 10 sample tasks for `user_id=1`. Requires a registered user with id 1.

## Deployment (Vercel)

1. Set **all** env vars in Vercel Dashboard → Settings → Environment Variables
2. `TURSO_DB_URL` + `TURSO_AUTH_TOKEN` are **required** — Vercel has no persistent filesystem
3. `AUTH_SECRET` is required; `AUTH_URL` recommended
4. The middleware uses `secureCookie` in production and `trustHost: true` for cookie compatibility

## Tech stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (class-based dark mode) |
| Database | SQLite via `@libsql/client` (Turso SDK) |
| Auth | next-auth v5 (GitHub OAuth + Credentials) |
| Hashing | bcryptjs (cost 12) |

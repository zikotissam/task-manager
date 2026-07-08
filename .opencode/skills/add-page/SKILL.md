---
name: add-page
description: |
  Use when adding a new page, route, or screen to the Task Manager app.
  Covers: route file, component, API endpoint, database query. Do NOT use
  for editing existing pages or for pure component changes.
---

# Add Page

## Workflow

### 1. Define the types

Add any new types or interfaces to `src/types.ts`.

### 2. Database (if needed)

Add query functions to `src/lib/db.ts` following the existing patterns (`getAllTasks`, `createTask`, etc.).

### 3. API route (if needed)

Create route handlers in `src/app/api/<name>/route.ts` (or `src/app/api/<name>/[id]/route.ts` for dynamic routes). Use the existing `src/app/api/tasks/route.ts` as a reference.

### 4. React component

Create components in `src/components/`. Use `'use client'` for interactive components. Follow the existing patterns (Tailwind classes, dark mode via `dark:` prefix, TypeScript props interface).

### 5. Page route

Add the page in `src/app/<name>/page.tsx`. Reference existing page patterns in `src/app/page.tsx`.

## Conventions

- Use `@/` path aliases for imports (e.g., `@/components/...`, `@/lib/...`, `@/types`)
- Database calls go in `src/lib/db.ts` only
- API routes use `NextRequest`/`NextResponse` from `next/server`
- Components use Tailwind v4 with `@custom-variant dark`
- All new files are TypeScript (`.ts` or `.tsx`)

# Feature Plan: Due datetime + countdown, task status, notes, card redesign

Shared understanding from the grilling session. Verification for all work:
`npm run lint` + `npm run build` (no test framework exists).

## 1. Due datetime + countdown

- `AddTaskForm` and `TaskItem` edit: the due input becomes `datetime-local`, still optional.
  - If a date is picked with no time, default the time to the submit moment's time-of-day.
- Store the full ISO string in the existing `due_date` TEXT column — no schema change.
  - Legacy rows stored as bare `YYYY-MM-DD` are read as `date + created_at time-of-day`.
- New `DueBadge` component on the task card:
  - `>24h` left: static `in Xd`, hover shows the exact datetime.
  - `<24h` left: amber `HH:MM:SS` ticking every second.
  - Overdue: red `Overdue Xh` (elapsed time), static.
  - Hidden when the task is done or has no due date.

## 2. Status field

- New `status TEXT NOT NULL DEFAULT 'pending'` column via a one-time inline
  `ALTER TABLE` on DB init (try/catch so it's a no-op if the column exists).
- `Status = 'pending' | 'in_progress' | 'stopped' | 'done'`.
- Status is the source of truth; `completed` stays as a derived column
  (written `1` when `status = 'done'`, else `0`) so old data/logic keep working.
- Checkbox remains a fast-path: check → `done`, uncheck → `pending`.
- Tasks filters: "Active" now means `status !== 'done'`. Add a status filter row
  (all / pending / in_progress / stopped / done) alongside the priority filter.

## 3. Notes ("just to remember", persist until deleted)

- New `notes` table: `id, user_id, title, body, pinned, created_at, updated_at`
  (auto-created via `CREATE TABLE IF NOT EXISTS` — no migration pain).
- Types + `db.ts` CRUD + `GET/POST /api/notes` + `PATCH/DELETE /api/notes/[id]`,
  all with auth + ownership checks (mirroring `/api/tasks`).
- New sidebar item **Notes** → `/notes` page: add-form, note cards, inline edit,
  pin-to-top, delete with confirm dialog, empty state.

## 4. Task card redesign

- Left accent bar colored by status: pending = zinc, in_progress = blue,
  stopped = amber, done = green.
- Title row: title (font-semibold, one-line truncate), a status dropdown directly
  on the card, and the priority badge.
- Description: line-clamped to 2 lines with an inline "expand" toggle.
- Meta row (bottom): `Due Aug 12, 14:30 · in 2d`; `<24h` → amber ticking
  `HH:MM:SS`; overdue → red `Overdue 3h`; no due date → row omitted.
- Done state: green accent, strikethrough title, countdown hidden.
- Hover edit/delete actions kept in place.

## 5. Dashboard

- Overdue stat compares full datetime (`now`), so a task due today at 14:30
  isn't overdue until 14:30 passes (current code truncates to midnight).

# Your Task Manager — Explained Like You're 12

## 1. What this project IS

Imagine you have a **sticky note pad** on your desk. You write things on it like "buy milk" or "do homework." When you finish something, you cross it out. When you lose the note, you make a new one.

This project is that sticky note pad — but **inside your web browser** (like Chrome or Edge). You can:

- **Add** a task ("buy milk")
- **Check it off** when done
- **Delete** it
- **Search** through your tasks
- **Filter** to see only active or only completed tasks
- Change to **dark mode** (like night mode on your phone)

The difference from a real sticky note: the tasks are saved in a **file on your computer** (the "database"), so if you close the browser and open it again, your tasks are still there.

---

## 2. Every File Explained

A software project is like a recipe book. Each file is one page of the recipe. Let's go through every single page.

---

### `package.json` — The shopping list + instructions

**Analogy:** This is the **ingredients list** and **cooking instructions** all in one. If you wanted to make this project from scratch, you'd look here to know what to download and what commands to run.

```
{
  "name": "task-manager",        ← The name of our recipe
  "version": "0.1.0",            ← Version number (0.1 = early draft)
  "private": true,               ← This is MY recipe, not published
  "scripts": {
    "dev": "next dev",            ← "npm run dev" starts the cooking
    "build": "next build",        ← Prepares everything for serving
    "start": "next start",        ← Serves the finished meal
    "lint": "eslint"              ← Checks for mistakes in the recipe
  },
```

**Dependencies** are ingredients you NEED to run the app:

| Package | What it is, like you're 12 |
|---------|---------------------------|
| `next` | The **oven and plates** — a framework that helps cook and serve web pages |
| `react` / `react-dom` | The **ingredients** — tools to build the user interface (buttons, inputs, lists) |
| `better-sqlite3` | The **filing cabinet** — saves your tasks to a file on your computer |

**DevDependencies** are tools you only need while **cooking**, not while eating:

| Package | What it is |
|---------|-----------|
| `tailwindcss` | A **stamp set** for making things look pretty without writing much CSS |
| `typescript` | A **spell-checker** for code — catches mistakes before you run it |
| `eslint` | A **grammar checker** for code style |
| `@types/*` | **Dictionaries** that help the spell-checker understand different ingredients |

**But what's really happening one layer down:** When you run `npm install`, npm (Node Package Manager) reads this file, goes to a **giant online warehouse** (npmjs.com), downloads every package listed, and puts them in a folder called `node_modules`. That folder is like your pantry — full of pre-made ingredients.

**And deeper:** Each package is itself a folder with its own `package.json`, which lists its own dependencies. So npm downloads those too, and their dependencies, and so on — like a chain of nested recipe boxes. This is called the **dependency tree**. Your `node_modules` folder can easily have **thousands** of files, all because you listed 6 things in your shopping list.

---

### `next.config.ts` — The oven settings

```
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.36.242.101'],
};

export default nextConfig;
```

**Analogy:** This is the **instructions sticker on the oven**. It tells the oven what special settings to use.

**What it does:** `allowedDevOrigins` says "I allow people to connect to this app from a different computer at the address `10.36.242.101`." Normally when you're developing, only YOUR computer can see the app. But if you want someone ELSE on the same network to test it, you add their IP address (their **house number on the internet**) here.

**But what's really happening one layer down:** Your computer has multiple **network interfaces** (like different doors). `localhost` is a door that only opens from inside your own computer. An IP address like `10.36.242.101` is a door that other computers in your office/school can find. Without this setting, Next.js would say "Sorry, I don't recognize that door — no entry."

**And deeper:** This is a security feature. When you're developing, the app is in "debug mode" and might show error messages that contain sensitive info. Only allowing known addresses prevents random people on your network from peeking at your code. The origin check happens in the HTTP header called `Origin` — the browser sends "I came from this address" and Next.js checks it against the allowed list.

---

### `tsconfig.json` — The spell-checker settings

**Analogy:** This is the **rules sheet for the spelling bee**. It says which dictionary to use, what kind of words to allow, and how strict to be.

```
{
  "compilerOptions": {
    "target": "ES2017",            ← Speak in a version of JavaScript from 2017
    "lib": ["dom", "dom.iterable", "esnext"],  ← Knows about browsers and modern JS
    "strict": true,                ← BE VERY STRICT. No mistakes allowed.
    "jsx": "react-jsx",            ← Allow HTML-inside-JavaScript (JSX)
    "paths": {
      "@/*": ["./src/*"]           ← "@" is shorthand for "src/" folder
    }
  }
}
```

**What is TypeScript?** JavaScript is the language web browsers understand. TypeScript is a **stricter version** of JavaScript. It's like writing an essay with a spell-checker that underlines words in red before you even turn it in. TypeScript checks your code for mistakes BEFORE it runs.

**Paths:** The `@/*` thing means when you see `import { Task } from '@/types'`, TypeScript translates `@` to `./src/` so it actually reads `./src/types.ts`. It's like a nickname — instead of saying "the tall building on the corner of 5th and Main," you just say "the office."

---

### `postcss.config.mjs` — The paint mixer

**Analogy:** This is the **machine that mixes paint colors** before you apply them to a wall.

```
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

**What is PostCSS?** When you write modern CSS (the language that makes things look pretty), PostCSS is a **transformer** — it takes your fancy new CSS and turns it into CSS that every browser understands.

**What is Tailwind?** Tailwind is a **pre-made stamp collection** for CSS. Instead of writing "make this button blue with rounded corners" in a long sentence, you just write small stamps like `bg-blue-500` (background blue, shade 500) and `rounded-lg` (rounded large). Tailwind translates those stamps into real CSS.

**One layer down:** PostCSS is a plugin system. `@tailwindcss/postcss` is a plugin that tells PostCSS "when you see these stamp-classes, expand them into full CSS." The whole Tailwind CSS framework gets injected into your stylesheet — but only the parts you actually use (that's called "tree-shaking" — like shaking a tree so only the ripe fruit falls).

---

### `src/types.ts` — The definition of what a "Task" looks like

**Analogy:** This is a **blank form** at the doctor's office. It says:
- Name: ________
- Age: ________
- Reason for visit: ________

It defines the SHAPE of the data, not the actual data itself.

```typescript
export type Priority = 'low' | 'medium' | 'high'
```

This says: "Priority can ONLY be one of these three words: low, medium, or high." Not "urgent," not "super high." If someone tries to use 'super high', TypeScript the spell-checker will say "That's not a valid option!"

```typescript
export interface Task {
  id: number            ← A unique number for each task (like a student ID)
  title: string         ← The task text, like "buy milk" (a string = a piece of text)
  description: string | null  ← Optional longer notes, or null (nothing)
  priority: Priority    ← low, medium, or high
  due_date: string | null     ← When it's due, or null if no due date
  completed: number     ← 0 = not done, 1 = done (computers use numbers for yes/no)
  created_at: string    ← When the task was made (auto-filled)
  updated_at: string    ← When the task was last changed (auto-filled)
}
```

**What are types/interfaces?** Think of them as **molds** — like a cookie cutter. No matter what dough you use (what data you have), the shape must match the cutter. If the cutter says "round cookie" and you try to make a star, it won't work.

```typescript
export interface CreateTaskInput {
  title: string         ← Only title is REQUIRED (no "?")
  description?: string  ← The "?" means this is optional
  priority?: Priority
  due_date?: string
}
```

This is a simpler form — it's what you fill out when CREATING a task. You don't need to provide `id`, `completed`, or timestamps because the computer figures those out automatically.

---

### `src/lib/db.ts` — The filing cabinet

**Analogy:** This is the **person who manages the filing cabinet**. You tell them "give me all tasks" or "save this new task" and they do it.

**What is a database?** Imagine a **really organized filing cabinet**. Each drawer is a "table" (like a spreadsheet). Each folder is a "row" (one task). Each piece of paper in the folder is a "column" (title, description, etc.).

**What is SQLite?** SQLite is the **simplest possible filing cabinet** — it's just one single file on your hard drive. No big server program needed. The file is at `data/tasks.db`. SQL is the **language** you speak to the filing cabinet: "SELECT * FROM tasks" means "Show me everything from the tasks drawer."

Let's walk through every function:

```typescript
import Database from 'better-sqlite3'
import path from 'path'
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types'

const DB_PATH = path.join(process.cwd(), 'data', 'tasks.db')
```

- `process.cwd()` = Current Working Directory = where the project lives on your computer
- `path.join` = glues together folder names the right way (with `\` on Windows, `/` on Mac)
- So the full path might be something like: `C:\Users\you\opencode\data\tasks.db`

```typescript
let db: Database.Database
```

This declares a **variable** called `db` but doesn't set it yet. Like reserving a parking spot.

```typescript
export function getDb(): Database.Database {
  if (!db) {                      ← If db hasn't been created yet
    db = new Database(DB_PATH)    ← Open the filing cabinet file
    db.pragma('journal_mode = WAL')  ← WAL = Write-Ahead Log (makes things faster)
    db.pragma('foreign_keys = ON')   ← Make sure connections between tables are valid
    initSchema()                  ← Create the tasks drawer if it doesn't exist
  }
  return db                       ← Give back the filing cabinet
}
```

**Why the `if (!db)` check?** This is the **Singleton pattern** — you only want ONE copy of the database open. Opening it multiple times would be like trying to open the same filing cabinet with two keys.

```typescript
function initSchema() {
  db.exec(`                      ← Execute this SQL command
    CREATE TABLE IF NOT EXISTS tasks (   ← Create a drawer called "tasks"
      id INTEGER PRIMARY KEY AUTOINCREMENT,  ← Each task gets a unique number
      title TEXT NOT NULL,         ← Title is text and MUST be provided
      description TEXT,           ← Description is optional (nullable)
      priority TEXT NOT NULL DEFAULT 'medium'  ← Default priority is 'medium'
        CHECK(priority IN ('low', 'medium', 'high')),  ← Only these 3 allowed
      due_date TEXT,              ← Optional due date
      completed INTEGER NOT NULL DEFAULT 0,  ← Default: not completed
      created_at TEXT NOT NULL DEFAULT (datetime('now')),  ← Auto-set to current time
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))   ← Auto-set to current time
    )
  `)
}
```

**What is a PRIMARY KEY?** It's like a **student ID number**. Every student has a unique one. No two tasks can have the same `id`. `AUTOINCREMENT` means the computer picks the next number for you (1, 2, 3...).

**One layer down:** SQLite stores this table definition in a special hidden table called `sqlite_master`. When you run `CREATE TABLE`, it writes the table structure into `sqlite_master` first, then prepares the new table for data.

**And deeper:** The database file `tasks.db` is a binary file (not human-readable text). It's organized into **pages** (usually 4KB chunks). The first page contains the **header** (magic number "SQLite format 3\0", page size, etc.). Other pages contain table data organized as **B-trees** — a data structure that makes searching very fast (like a well-organized index at the back of a textbook).

Now the main database functions:

**getAllTasks:**
```typescript
export function getAllTasks(): Task[] {
  return getDb()
    .prepare('SELECT * FROM tasks ORDER BY created_at DESC')
    .all() as Task[]
}
```
- `.prepare(...)` = The filing cabinet person gets ready. They read your request.
- `SELECT * FROM tasks` = "Give me EVERYTHING from the tasks drawer" (the `*` means "all columns")
- `ORDER BY created_at DESC` = "Show newest tasks first" (DESC = descending)
- `.all()` = "And give me ALL matching results"
- `as Task[]` = TypeScript says "I promise the result looks like an array of Task objects"

**One layer down:** `.prepare()` returns a **Statement** object. The database **compiles** the SQL into a simplified program (bytecode). Then `.all()` **executes** that program, iterating through all matching rows and collecting them into an array. This is called **prepared statement** — it's faster if you run the same query multiple times because the compilation step is done once.

**createTask:**
```typescript
export function createTask(input: CreateTaskInput): Task {
  const stmt = getDb().prepare(`
    INSERT INTO tasks (title, description, priority, due_date)
    VALUES (@title, @description, @priority, @due_date)
  `)
  const result = stmt.run({           ← Run with these values
    title: input.title,
    description: input.description ?? null,  ← ?? null means "if undefined, use null"
    priority: input.priority ?? 'medium',
    due_date: input.due_date ?? null,
  })
  return getTaskById(result.lastInsertRowid as number) as Task
}
```
- `INSERT INTO tasks` = "Add a new folder to the tasks drawer"
- `@title`, `@description` etc. are **placeholders** — like blanks on a form waiting to be filled
- `stmt.run({...})` fills in the blanks with actual values
- `lastInsertRowid` = the ID number of the newly created task (SQLite tells us this)
- Then it fetches the full task with `getTaskById` and returns it

**updateTask:**
```typescript
export function updateTask(id: number, input: UpdateTaskInput): Task | undefined {
  const existing = getTaskById(id)
  if (!existing) return undefined    ← If task doesn't exist, give up

  const fields: string[] = []
  const values: Record<string, unknown> = { id }

  if (input.title !== undefined) { fields.push('title = @title'); values.title = input.title }
  if (input.description !== undefined) { fields.push('description = @description'); values.description = input.description }
  // ... same for priority, due_date, completed

  if (fields.length === 0) return existing  ← Nothing to change? Return original.

  fields.push("updated_at = datetime('now')")  ← Auto-update the timestamp

  getDb().prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = @id`).run(values)
  return getTaskById(id)
}
```
- This **dynamically builds** the SQL query — it only updates the fields that were actually provided
- If you only send `{ completed: 1 }`, the query becomes: `UPDATE tasks SET completed = @completed, updated_at = datetime('now') WHERE id = @id`
- The `WHERE id = @id` part says "only change the task whose ID matches"

**deleteTask:**
```typescript
export function deleteTask(id: number): boolean {
  const result = getDb().prepare('DELETE FROM tasks WHERE id = ?').run(id)
  return result.changes > 0  ← Did we actually delete anything? (true/false)
}
```
- `DELETE FROM tasks WHERE id = ?` = "Remove the task with this ID"
- The `?` is another placeholder style (positional instead of named)
- `result.changes` tells us how many rows were affected (0 if the task didn't exist, 1 if it did)

**searchTasks:**
```typescript
export function searchTasks(query: string): Task[] {
  return getDb()
    .prepare("SELECT * FROM tasks WHERE title LIKE ? ORDER BY created_at DESC")
    .all(`%${query}%`) as Task[]
}
```
- `LIKE` is a fuzzy matcher
- The `%` symbols are **wildcards** — `%milk%` means "title contains the word 'milk' anywhere"
- So searching "mi" would match "milk", "midterm", "family"

**One layer down on LIKE:** SQLite's LIKE is case-insensitive for ASCII characters by default (so "MILK" matches "milk"). Under the hood, it uses a simple character-by-character comparison with case folding.

---

### `src/app/api/tasks/route.ts` — The waiter for the tasks list

**Analogy:** This is a **waiter** at a restaurant. When you ask "Can I see the menu?" (GET) or "I'd like to order a pizza" (POST), the waiter takes your request to the kitchen (the database) and brings back your response.

**What is an API?** API stands for **Application Programming Interface**. It's a set of rules for how two programs talk to each other. In this case, it's how the browser (frontend) talks to the database (backend). Think of it like the **menu at a restaurant** — it lists what you can order and how to ask for it.

**What is a URL?** A URL is an **address**. Just like your house has an address (123 Main Street), every page or API endpoint on the web has a URL. `/api/tasks` is like saying "I want to talk to the tasks department."

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getAllTasks, createTask, searchTasks } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  const tasks = q ? searchTasks(q) : getAllTasks()
  return NextResponse.json(tasks)
}
```

- `GET` = "I want to READ data"
- `request.url` might be `/api/tasks?q=milk` or just `/api/tasks`
- `searchParams.get('q')` extracts the `?q=milk` part. If there's a `q`, search. Otherwise, get all.
- `NextResponse.json(tasks)` = wraps the tasks array into JSON format and sends it back

```typescript
export async function POST(request: NextRequest) {
  const body: CreateTaskInput = await request.json()

  if (!body.title || body.title.trim().length === 0) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  const task = createTask(body)
  return NextResponse.json(task, { status: 201 })
}
```

- `POST` = "I want to CREATE something new"
- `await request.json()` = reads the body of the request (the data the browser sent) and converts it from JSON (text format) into a JavaScript object
- The `if` check = "Is the title empty? If so, send back error 400 (Bad Request)" — like a waiter saying "Sorry, you have to tell me what you want to order"
- `status: 400` and `status: 201` are **HTTP status codes**:
  - **200** = OK (everything worked)
  - **201** = Created (a new resource was made)
  - **400** = Bad Request (you messed up the request)
  - **404** = Not Found (the thing you asked for doesn't exist)

**One layer down on HTTP:** When the browser sends a fetch request, it opens a **TCP connection** (like a phone call) to the server. It sends a **request line** like `GET /api/tasks HTTP/1.1`, then **headers** (metadata like content type), then optionally a **body** (for POST). The server reads this, processes it, and sends back a **response** with a status line like `HTTP/1.1 200 OK`, headers, and a body. The whole thing happens in milliseconds.

---

### `src/app/api/tasks/[id]/route.ts` — The waiter for individual tasks

**Analogy:** This is the same waiter, but now they're handling specific orders. Instead of "all tasks" it's "task number 5."

**What is a dynamic route?** The `[id]` in the folder name means "this is a placeholder." When the URL is `/api/tasks/5`, the `[id]` captures `5`. When the URL is `/api/tasks/42`, it captures `42`. Like a mail slot labeled "Apartment [number]" — the number changes based on who's getting mail.

```typescript
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const task = getTaskById(Number(id))
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  return NextResponse.json(task)
}
```

- `params` is a **Promise** (something that will arrive in the future) containing `{ id: string }`
- `await params` = "Wait for the params to arrive, then give me the id"
- `Number(id)` = convert the string "5" to the number 5
- If no task with that ID exists, return 404 (Not Found) — like a waiter saying "Sorry, we don't have table 99"

```typescript
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body: UpdateTaskInput = await request.json()
  const task = updateTask(Number(id), body)
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  return NextResponse.json(task)
}
```

- `PATCH` = "I want to UPDATE part of something" (like changing the title of an existing task)
- Compare to PUT which replaces the ENTIRE thing — PATCH is for partial updates

```typescript
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const deleted = deleteTask(Number(id))
  if (!deleted) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}
```

- `DELETE` = "I want to REMOVE this task"
- Returns `{ success: true }` if deleted

**What is REST?** REST is a **style** for designing APIs. It says: use the HTTP methods (GET, POST, PATCH, DELETE) to match what you're doing (Read, Create, Update, Delete). Use clear URLs like `/api/tasks/5` to identify specific things. This project is a REST API.

**What is CRUD?** Create, Read, Update, Delete — the four basic operations for any data:
- **Create** = POST `/api/tasks`
- **Read** = GET `/api/tasks` (all) or GET `/api/tasks/5` (one)
- **Update** = PATCH `/api/tasks/5`
- **Delete** = DELETE `/api/tasks/5`

---

### `src/app/layout.tsx` — The page wrapper

**Analogy:** This is the **frame of the house** — the walls, the roof, the foundation. Every page of the app gets placed inside this frame. It's the thing that wraps around every page.

```typescript
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Manager",
  description: "A full-stack task manager built with Next.js",
};
```

- `Metadata` = the stuff that appears in your browser tab (the title you see)
- `Geist` = a font (a style of letters) from Google. It's loaded as a **CSS variable** (`--font-geist-sans`) so it can be used everywhere

```typescript
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme &&
                  window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }} />
      </head>
```

**The dark mode script — this is important:**
- `localStorage` = a tiny pocket in your browser where websites can store small pieces of info
- `localStorage.getItem('theme')` = "Did I save a preference about dark mode?"
- `window.matchMedia('(prefers-color-scheme: dark)')` = "Does my computer/phone SAY it's in dark mode right now?"
- If either condition is true, it adds `class="dark"` to the `<html>` element

**Why is this a script in the `<head>`?** This runs BEFORE anything renders on screen. It prevents what's called a **flash of unstyled content** or **FOUC** — the page briefly showing white before switching to dark mode. By adding the dark class BEFORE the page paints, the page starts in the right mode.

```typescript
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

- `children` = whatever page content goes here (in this case, `page.tsx`)
- `min-h-full` = at least full screen height
- `flex flex-col` = stack things vertically
- `bg-background text-foreground` = use the CSS variables for background and text color (these change based on dark/light mode)

---

### `src/app/page.tsx` — The main page

**Analogy:** This is the **living room** — the main space where everything happens. It's the first thing you see when you open the app.

```typescript
'use client'
```

**This is crucial.** `'use client'` means this code runs in the **browser** (the client), not on the server. In Next.js, by default, components run on the server (where they generate HTML and send it to you). But interactive things (like buttons, typing, clicking) need to run in the browser. The `'use client'` directive says "Hey, this needs to be downloaded to the browser and run there."

**Analogy:** Server-side is like a **TV broadcast** — you just watch what's sent to you. Client-side is like a **video game** — it needs the controller (your interaction) to work.

```typescript
import { useState, useEffect, useCallback } from 'react'
import type { Task, Priority } from '@/types'
import AddTaskForm from '@/components/AddTaskForm'
import TaskList from '@/components/TaskList'
import SearchBar from '@/components/SearchBar'
import ThemeToggle from '@/components/ThemeToggle'

type Filter = 'all' | 'active' | 'completed'
```

**State variables — the app's short-term memory:**

```typescript
export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])       ← Tasks list, starts empty
  const [filter, setFilter] = useState<Filter>('all')  ← Current filter: All/Active/Completed
  const [searchQuery, setSearchQuery] = useState('')   ← What's typed in search box
  const [loading, setLoading] = useState(true)          ← Are we still loading?
  const [error, setError] = useState<string | null>(null)  ← Error message if something fails
```

**What is `useState`?** Think of it as a **whiteboard** that the app can write on and erase. When you write something new on the whiteboard, the app re-draws the screen to show the update. The `const [thing, setThing]` pattern:
- `thing` = what's currently on the whiteboard
- `setThing` = the eraser + marker, used to change what's written

**What is state?** State is what the app **remembers** while it's running. Like when you're playing a video game and pause — the game remembers your health, your position, your items. That's the game's state. If you close the game, state is lost (unless saved — that's what the database is for).

**Loading tasks from the server:**

```typescript
const fetchTasks = useCallback(async (query?: string) => {
    setError(null)
    try {
      const url = query ? `/api/tasks?q=${encodeURIComponent(query)}` : '/api/tasks'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch tasks')
      setTasks(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    }
  }, [])
```

- `useCallback` = "Remember this function between re-renders, don't recreate it unless something changes" (the `[]` means "nothing changes it — it's stable")
- `fetch(url)` = the browser goes to that URL and asks for data
- `await` = "Wait for the response to come back" (this is an **async/await** pattern — handling operations that take time, like asking a question and waiting for the answer)
- `res.json()` = convert the response from JSON format into a JavaScript object
- `encodeURIComponent(query)` = if the search has special characters (spaces, ?, &), this makes them URL-safe (e.g., "milk & cookies" becomes "milk%20%26%20cookies")

```typescript
  useEffect(() => {
    fetchTasks().then(() => setLoading(false))
  }, [fetchTasks])
```

**What is `useEffect`?** It means "run this code AFTER the page first appears on screen." Like setting up a fish tank after the tank is already in the room. The `[]` (dependency array) says "only run this once, when the component first loads."

So when you first open the page:
1. The page renders (shows loading spinner)
2. `useEffect` fires
3. `fetchTasks()` runs — goes to `/api/tasks`
4. The server reads all tasks from the database
5. The response comes back
6. `setTasks([...])` updates the tasks state
7. `setLoading(false)` stops the loading spinner
8. The page re-renders showing the task list

**Search debounce:**

```typescript
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks(searchQuery || undefined)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, fetchTasks])
```

- Whenever `searchQuery` changes (user types), this effect runs
- It sets a **timer** for 300 milliseconds (0.3 seconds)
- If the user types again before 300ms, the `clearTimeout(timer)` cancels the old timer and starts a new one
- This is called **debouncing** — like waiting for someone to finish typing before you answer
- Result: the search only fires after the user PAUSES typing, not on every keystroke

**Handlers for add, toggle, delete:**

```typescript
const handleAdd = async (title, description, priority, due_date) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, priority, due_date }),
    })
    const task = await res.json()
    setTasks((prev) => [task, ...prev])  ← Add new task to the FRONT of the list
}
```

- `JSON.stringify(...)` = converts the JavaScript object into JSON text (a string)
- `'Content-Type': 'application/json'` = tells the server "I'm sending you JSON, not a form or something else"
- `setTasks((prev) => [task, ...prev])` = take the previous list, put the new task at the beginning (`...prev` spreads the old list)

```typescript
const handleToggle = async (id, completed) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: completed ? 0 : 1 }),
    })
    const updated = await res.json()
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
}
```

- `completed ? 0 : 1` = if currently completed (1), set to not completed (0). If currently not completed (0), set to completed (1). It's a **toggle** — like flipping a light switch.

```typescript
const handleDelete = async (id) => {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    setTasks((prev) => prev.filter((t) => t.id !== id))
}
```

- `filter` creates a new list WITHOUT the deleted task — like removing a card from a deck

**The render (JSX):**

The rest of the file is the **HTML-like code** (JSX) that describes what the page looks like:
- A sticky header with the title "Tasks" and count
- Error message banner (if any)
- The Add Task form
- The search bar
- Filter buttons (All/Active/Completed)
- Loading spinner or the TaskList

**What is JSX?** It stands for JavaScript XML. It lets you write HTML inside JavaScript. It's like when you write a letter (JavaScript) and paste a photo (HTML) directly into the letter instead of attaching it separately. Browsers don't understand JSX — it gets transformed into regular JavaScript function calls by a tool called a **transpiler** (Babel or the Next.js compiler).

---

### `src/app/globals.css` — The paint and wallpaper

**Analogy:** This is the **color palette and wallpaper** for the whole house. It defines what colors are used and how things look.

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
}

:root {
  --background: #ffffff;
  --foreground: #171717;
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), Arial, Helvetica, sans-serif;
}
```

**What is CSS?** CSS = **Cascading Style Sheets**. It's the language that describes how things LOOK — colors, sizes, spacing, fonts. If HTML is the skeleton and JavaScript is the muscles, CSS is the skin and clothes.

**What are CSS variables?** The `--background` and `--foreground` are **variables** (like in math — a name for a value). When the class is `dark`, `--background` becomes `#0a0a0a` (near-black). Without the dark class, `--background` is `#ffffff` (white). Everything that uses `var(--background)` automatically switches color.

`@import "tailwindcss"` — pulls in the entire Tailwind CSS library, which provides thousands of pre-made classes like `bg-blue-500`, `rounded-lg`, `p-4` (padding of 4 units).

---

### `src/components/ThemeProvider.tsx` — The dark/light mode brain

**Analogy:** This is the **light switch operator** who remembers your preference. When you toggle dark mode, this tells every part of the page to switch colors.

**What is Context (React Context)?** It's like a **public announcement system** in a school. Instead of walking to every classroom and telling each teacher "it's dark mode now," you just make one announcement over the PA system, and everyone hears it at once. Context lets a piece of data (the current theme) be available to every component without passing it manually through each one.

```typescript
'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{
  theme: Theme
  toggle: () => void
}>({ theme: 'light', toggle: () => {} })
```

- `createContext` = creates the PA system
- The context will hold `{ theme: 'light' or 'dark', toggle: a function to switch }`

```typescript
export function useTheme() {
  return useContext(ThemeContext)
}
```

- `useTheme` is a **custom hook** — a reusable piece of logic. Any component can call `useTheme()` and get the current theme and the toggle function.

```typescript
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initial = stored ?? preferred
    setTheme(initial)
    document.documentElement.classList.toggle('dark', initial === 'dark')
    setMounted(true)
  }, [])
```

- On first load: check `localStorage` (did user pick a theme before?). If no saved preference, check the computer's system preference (`prefers-color-scheme`).
- `classList.toggle('dark', condition)` = if condition is true, ADD the 'dark' class. If false, REMOVE it.

```typescript
  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  if (!mounted) return <>{children}</>
  // ^ Before we know the theme, just show children without providing context

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

- `localStorage.setItem('theme', next)` = saves the preference so it persists (survives closing the browser)
- If `!mounted`, the component hasn't read `localStorage` yet. It shows children without context to avoid a flash of wrong theme.

---

### `src/components/ThemeToggle.tsx` — The toggle switch

**Analogy:** This is the **physical light switch** on the wall. You click it, the lights change.

```typescript
export default function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button onClick={toggle} className="relative h-8 w-14 rounded-full bg-zinc-200 ...">
      <span className={`block h-6 w-6 rounded-full bg-white shadow-md transition-transform ... ${
          theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
        }`}>
        <span className="flex h-full items-center justify-center text-sm">
          {theme === 'dark' ? '🌙' : '☀️'}
        </span>
      </span>
    </button>
  )
}
```

- The button is a **track** (the background pill shape)
- The span inside is the **thumb** (the circle that slides)
- `translate-x-6` = shift 24 pixels to the right (dark mode = thumb on the right)
- `translate-x-0` = shift 0 pixels (light mode = thumb on the left)
- `transition-transform duration-300` = animate the sliding over 300ms (smooth movement)
- Shows 🌙 or ☀️ depending on mode

---

### `src/components/TaskList.tsx` — The list of tasks

**Analogy:** This is the **bulletin board** that shows your tasks. It can filter what's shown.

```typescript
interface Props {
  tasks: Task[]
  filter: 'all' | 'active' | 'completed'
  onToggle: (id: number, completed: number) => void
  onDelete: (id: number) => void
  searchQuery: string
}
```

**What are Props?** Props = **properties**. They're like **arguments to a function** but for components. When you write `<TaskList tasks={tasks} filter="active" />`, you're passing `tasks` and `filter` as props. It's like handing someone a box of LEGOs and saying "build something with these."

```typescript
export default function TaskList({ tasks, filter, onToggle, onDelete, searchQuery }: Props) {
  const filtered = tasks.filter((task) => {
    if (filter === 'active' && task.completed) return false
    if (filter === 'completed' && !task.completed) return false
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })
```

- This is **client-side filtering** — after getting ALL tasks from the server, it filters them in the browser
- `filter === 'active' && task.completed` = if filter is "active" but the task is completed, remove it (`return false`)
- `task.title.toLowerCase().includes(searchQuery.toLowerCase())` = case-insensitive search (so "Milk" matches "milk")

```typescript
  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        {/* SVG icon + message */}
        <p>No tasks yet. Add one above!</p>
      </div>
    )
  }
```

- **Empty state** — when there are no tasks (or no matching tasks), show a friendly message instead of an empty list. This is important UX (user experience) — without it, the user would just see a blank page and wonder if it's broken.

```typescript
  return (
    <div className="space-y-2">
      {filtered.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  )
}
```

- `tasks.map(...)` = for each task in the filtered list, render a `TaskItem` component
- `key={task.id}` = a unique identifier React uses to track items (like a tracking number for packages). If the list changes, React knows exactly which items to update.

---

### `src/components/TaskItem.tsx` — A single task card

**Analogy:** This is one **sticky note** on the bulletin board. It shows the task, the priority color, a checkbox, and a delete button.

```typescript
const priorityColors: Record<string, string> = {
  low: 'bg-green-100 text-green-800 ...',
  medium: 'bg-yellow-100 text-yellow-800 ...',
  high: 'bg-red-100 text-red-800 ...',
}
```

- Each priority gets a color: 🟢 low (green), 🟡 medium (yellow), 🔴 high (red)
- The dark mode versions (`dark:bg-green-900 dark:text-green-200`) are darker variants

The component renders:
1. A **checkbox circle** — click to toggle done/un-done
2. The **title** — with line-through when completed
3. A **priority badge** — colored label
4. **Description** (optional)
5. **Due date** (optional)
6. A **delete button** — appears on hover (the `opacity-0 group-hover:opacity-100` makes it fade in)

```typescript
<button onClick={() => onToggle(task.id, task.completed)}
  className={`... ${task.completed
    ? 'border-green-500 bg-green-500 ...'
    : 'border-zinc-300 ...'}`}
>
  {task.completed ? (
    <svg ...>✓</svg>  ← checkmark icon
  ) : null}
</button>
```

- If completed: green circle with white checkmark
- If not completed: gray outline circle, no checkmark
- Clicking calls `onToggle(task.id, task.completed)`

```typescript
<h3 className={`... ${task.completed
    ? 'text-zinc-400 line-through ...'  ← crossed out + faded
    : 'text-zinc-900 ...'              ← normal text
  }`}>
  {task.title}
</h3>
```

- `line-through` = the CSS property that puts a line through text

---

### `src/components/AddTaskForm.tsx` — The form to add a new task

**Analogy:** This is a **notepad and pencil** on your desk. You write a task, optionally add details, and press a button to stick it on the board.

```typescript
export default function AddTaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
```

- Each form field has its own **state** (whiteboard)
- `isExpanded` controls whether the extra fields (description, priority, due date) are visible

```typescript
const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title.trim(), description.trim(), priority, dueDate)
    // Reset all fields
    setTitle(''); setDescription(''); setPriority('medium')
    setDueDate(''); setIsExpanded(false)
  }
```

- `e.preventDefault()` = stops the browser from reloading the page when a form is submitted (forms normally reload the page — we don't want that)
- `if (!title.trim()) return` = "If the title is empty or just spaces, don't submit"

**The expandable part:** The form shows a `+` button. Clicking it rotates the `+` to `×` (45° rotation) and reveals:
- A textarea for description
- A dropdown for priority (Low/Medium/High)
- A date picker for due date

```typescript
<button type="button" onClick={() => setIsExpanded(!isExpanded)}
  className={`... ${isExpanded ? 'rotate-45' : ''}`}>
  <svg ...>+</svg>
</button>
```

- The `+` icon rotates 45 degrees to become `×` when expanded — a common UI pattern

---

### `src/components/SearchBar.tsx` — The search box

**Analogy:** This is the **search box** at the top of your email or phone contacts. As you type, it filters the list.

```typescript
interface Props {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <svg ...>🔍</svg>  ← magnifying glass icon
      <input type="text" value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tasks..." />
    </div>
  )
}
```

- This is a **controlled component** — it doesn't manage its own state. Instead, it receives `value` and `onChange` from its parent (the main page). The parent tells it "here's what's typed" and the child says "user changed it to this" — it's like a walkie-talkie conversation.
- The actual search logic (debounce, fetching) happens in the parent page, not in this component

---

## 3. Key Concepts — Deep Dives

### Server vs Client (Kitchen vs Table)

**Simple:** Imagine a restaurant. The **kitchen** (server) is where food is made. You sit at a **table** (client/browser). The **waiter** (API) brings food from the kitchen to your table.

**One layer down:** The server is a program running on a computer somewhere (maybe the same computer, maybe across the world). It has access to the database, it can do heavy computation. The client is your web browser — it can show things and let you interact, but it doesn't have direct access to the database.

**Deeper:** The server sends **HTML** (the structure), **CSS** (the styles), and **JavaScript** (the behavior) to the browser. Once loaded, the JavaScript can make further requests (fetch calls) to get more data. This is called **client-server architecture**. The server is always listening on a **port** (like 3000) for incoming requests.

### Frontend vs Backend (What you see vs Hidden machinery)

**Simple:** **Frontend** = the buttons, colors, text you see on screen. **Backend** = the database, the logic, the hidden parts that make it work.

**One layer down:** The frontend code is in `src/components/` and `src/app/page.tsx`. It runs in your browser. The backend code is in `src/lib/db.ts` and `src/app/api/`. It runs on the server (the computer hosting the website).

**Deeper:** In Next.js, some code can run in BOTH places. The `'use client'` directive determines which code is frontend-only. By default, Next.js tries to run as much as possible on the server (server-side rendering) for speed, then "hydrates" (wakes up) the page on the client for interactivity.

### HTTP Methods (Waiter taking orders)

**Simple:**
- **GET** = "What's on the menu?" (just reading, no change)
- **POST** = "I'd like to order a pizza" (creating something new)
- **PATCH** = "Can you add extra cheese to my pizza?" (updating part of something)
- **DELETE** = "Cancel my order" (removing something)

**One layer down:** Each HTTP method has a standard meaning:
- GET = safe (doesn't change anything), idempotent (same result every time)
- POST = not safe, not idempotent (submitting twice creates two orders)
- PUT = replace entirely, idempotent
- PATCH = partial update
- DELETE = remove

**Deeper:** HTTP methods map to database operations (CRUD). The HTTP spec defines these methods as part of **REST** (Representational State Transfer). Each request and response includes **headers** (metadata like content type, authentication tokens) and an optional **body** (the actual data).

### Database / SQLite (Filing cabinet with folders)

**Simple:** A database is a **giant digital filing cabinet**. Each drawer (table) holds related items. Each item is a row (folder). Each characteristic is a column (paper in the folder).

**One layer down:** SQLite stores everything in **one file** on your disk. That file has a specific binary format. When you run a query, SQLite reads parts of that file into memory, processes your request, and writes changes back.

**Deeper still:** The file is organized into **pages** (usually 4KB each). The **B-tree** data structure is used for tables and indexes, providing O(log n) lookup time — meaning even with millions of tasks, finding one by ID takes only a few page reads. SQLite uses **locking** to handle multiple readers/writers safely. WAL mode (Write-Ahead Log) improves performance by writing changes to a separate log file first, then merging them into the main database later.

### SQL (The language of the filing cabinet)

**Simple:** SQL = **Structured Query Language**. It's how you talk to the database. Like speaking to a filing cabinet in a specific language:
- "SELECT * FROM tasks" = "Show me everything in the tasks drawer"
- "INSERT INTO tasks (title) VALUES ('buy milk')" = "Put a new note saying 'buy milk' in the tasks drawer"
- "DELETE FROM tasks WHERE id = 5" = "Remove the note numbered 5"
- "UPDATE tasks SET completed = 1 WHERE id = 5" = "On note 5, check the 'done' box"

### localhost vs Network IP (Your house vs Street address)

**Simple:**
- **localhost** = your own computer. Like writing a note to yourself and putting it on your own desk.
- **127.0.0.1** = the numeric address for localhost (your home address within your own house)
- **IP address like 10.36.242.101** = your computer's address on the network, like your house number on your street
- **192.168.x.x** or **10.x.x.x** = private IP addresses (internal networks, like a gated community)

**One layer down:** When you type `localhost:3000`, your browser says "I want to talk to my own computer on port 3000." No network traffic happens — it uses a virtual network interface (loopback). When you use `10.36.242.101:3000`, your browser sends actual network packets to that computer through the network.

### Ports (Apartment numbers)

**Simple:** An IP address is like a **building address**. A port is like an **apartment number**. The building at 123 Main Street might have apartments 1, 2, 3. Your computer (at IP `10.36.242.101`) might have:
- Port 3000 = the Task Manager
- Port 80 = a web server
- Port 443 = a secure web server

**One layer down:** Ports range from 0 to 65535. Ports below 1024 are "well-known" (HTTP = 80, HTTPS = 443, SSH = 22). Higher ports (like 3000) are used for development servers. The OS (operating system) manages port allocation — only one program can listen on a specific port at a time.

### Firewall (Bouncer)

**Simple:** A firewall is a **bouncer** at the door of your computer. It decides who gets in and who doesn't. If port 3000 isn't in the bouncer's list, he says "Sorry, you can't come in" — even if the Task Manager is running.

**One layer down:** Firewalls can be software (Windows Defender Firewall) or hardware (a router). They check each network packet's source, destination, port, and protocol. They have **rules** like "allow incoming on port 3000 from the local network" or "block all incoming on port 22 from the internet."

### JSON (The language of data exchange)

**Simple:** JSON = **JavaScript Object Notation**. It's a way to write data as text so both computers and humans can read it. Like writing a shopping list that everyone can understand:

```json
{
  "id": 1,
  "title": "buy milk",
  "completed": 0
}
```

**One layer down:** JSON has only a few rules:
- Objects are `{ }` with key-value pairs
- Arrays are `[ ]`
- Values can be strings (`"text"`), numbers (`42`), booleans (`true`/`false`), null, objects, or arrays
- Keys must be in double quotes

**Deeper:** When the browser does `fetch('/api/tasks')`, the server reads tasks from the database, converts them to JSON text, and sends it in the HTTP response body. The browser then parses the JSON text back into JavaScript objects with `res.json()`. The conversion happens at both ends: **serialization** (JS → JSON string) and **deserialization** (JSON string → JS).

### State (What the app remembers)

**Simple:** State is the **app's short-term memory**. Like your score in a video game — the game remembers it while you play, but if you turn off the console and come back later, it's gone (unless saved to a file — that's the database).

**One layer down:** In React, state is stored in **closures** (functions that remember their surrounding variables). When `setTasks(newList)` is called, React:
1. Updates the internal state value
2. Schedules a **re-render** of the component
3. During re-render, React compares the new virtual DOM (a lightweight copy of the real DOM) with the old one
4. Only the changed parts get updated in the real browser DOM

### Props (Passing data between components)

**Simple:** Props are like **passing notes in class**. One component (the parent) writes a note and hands it to another component (the child). The child can READ the note but can't change it.

```tsx
// Parent passes props
<TaskItem task={myTask} onDelete={handleDelete} />

// Child receives and uses props
export default function TaskItem({ task, onDelete }: Props) {
  // task.title, task.completed — read-only
  // onDelete(task.id) — call the function the parent gave
}
```

**One layer down:** Props flow **one-way** — from parent to child. Data goes down, events go up (via callback functions like `onDelete`). This is called **unidirectional data flow** and makes the app easier to understand and debug.

---

## 4. The Full Flow — End to End

### Opening the page (Read all tasks)

```
1. You type http://localhost:3000 in browser
2. Browser asks your computer: "What's at port 3000?"
3. Next.js dev server (running on port 3000) says: "I'll handle that"

4. Server runs layout.tsx → generates HTML with:
   - The dark mode inline script (checks localStorage)
   - ThemeProvider wrapping
   - The page content (loading spinner initially)

5. Server sends back HTML + CSS + JavaScript files
6. Browser receives them and starts painting the page
7. The dark mode script runs FIRST (in <head>)
   - Checks localStorage for 'theme'
   - If dark mode, adds class="dark" before anything renders
   - Prevents white flash

8. Browser finishes loading JavaScript (page.tsx)
9. React starts running in the browser (hydration)
10. useEffect fires → calls fetchTasks()
11. fetchTasks() calls fetch('/api/tasks')

12. Browser sends HTTP GET request to /api/tasks
13. Server receives request, runs GET function in route.ts
14. No 'q' parameter → calls getAllTasks()
15. getAllTasks() → getDb() opens/creates SQLite file
16. SQLite executes: SELECT * FROM tasks ORDER BY created_at DESC
17. SQLite reads the B-tree structure in tasks.db file
18. Returns all tasks as an array of objects

19. Response converted to JSON, sent back with 200 OK
20. Browser receives JSON array like [{id:1, title:"buy milk", ...}]
21. res.json() converts JSON string to JavaScript objects
22. setTasks(array) updates state
23. setLoading(false) removes spinner
24. React re-renders the page
25. TaskList receives tasks as props
26. TaskList filters (none yet, filter = 'all')
27. For each task, renders TaskItem with priority colors
28. You see your task list on screen!
```

### Adding a task (Create)

```
1. You type "buy milk" in the text input
2. useState updates title state on every keystroke
3. You click the "Add" button
4. handleSubmit runs:
   - e.preventDefault() stops page reload
   - Checks title is not empty
   - Calls onAdd(title, description, priority, dueDate)

5. onAdd is handleAdd in page.tsx:
   - fetch('/api/tasks', { method: 'POST', body: JSON.stringify({...}) })
   - Content-Type header tells server "this is JSON"

6. Browser sends HTTP POST request with JSON body
7. Server runs POST function in route.ts
8. Reads JSON body with request.json()
9. Validates: if title empty, return 400
10. Calls createTask(body)

11. db.ts: getDb() → prepares INSERT statement
12. SQLite executes: INSERT INTO tasks (title, ...) VALUES (...)
13. SQLite writes to the WAL file (Write-Ahead Log)
14. SQLite allocates a new row ID (AUTOINCREMENT)
15. Calls getTaskById with the new ID
16. Returns the full task (with id, created_at filled in)

17. Server sends 201 Created with JSON of the new task
18. Browser receives response
19. setTasks(prev => [newTask, ...prev]) adds to front
20. React re-renders: new TaskItem appears instantly
```

### Toggling a task done (Update)

```
1. You click the circle checkbox on task #5
2. onClick fires → calls onToggle(5, 0)  (0 = currently not done)
3. onToggle is handleToggle:
   - completed ? 0 : 1 → since 0, send 1
   - fetch(`/api/tasks/5`, { method: 'PATCH',
       body: JSON.stringify({ completed: 1 }) })

4. Server runs PATCH in [id]/route.ts
5. Reads params.id = "5", converts to number 5
6. Calls updateTask(5, { completed: 1 })

7. db.ts: checks if task exists (getTaskById)
8. Builds dynamic SET clause
9. Executes: UPDATE tasks SET completed = 1, updated_at = 'now' WHERE id = 5
10. SQLite writes to WAL file
11. Fetches and returns the updated task

12. Server sends 200 OK with JSON of updated task
13. Browser receives it
14. setTasks(prev => prev.map(t => t.id === 5 ? updated : t))
15. React re-renders just that TaskItem
16. The checkbox shows green fill with checkmark
17. The title gets line-through (strikethrough)
```

### Searching with debounce

```
1. You start typing "mi" in the search box
2. onChange fires on every keypress: setSearchQuery("m"), then "mi"
3. This triggers the useEffect with debounce:
   - First "m": timer starts (300ms)
   - 50ms later "mi": old timer cancelled, new 300ms timer starts
   - You pause typing
   - After 300ms, timer fires → calls fetchTasks("mi")

4. fetchTasks("mi"):
   - url = '/api/tasks?q=mi'
   - fetch(url)

5. Server: GET /api/tasks?q=mi
6. route.ts: q = "mi" → calls searchTasks("mi")
7. db.ts: SELECT * FROM tasks WHERE title LIKE '%mi%'
8. SQLite scans the tasks table, checks each title
9. Returns matching tasks (milk, midterm, etc.)
```

---

## 5. The Visual Architecture

```
                    YOUR BROWSER
  ┌──────────────────────────────────────────────┐
  │  layout.tsx (frame + dark mode script)        │
  │    └─ ThemeProvider (context for theme)        │
  │       └─ page.tsx (main page logic)           │
  │           ├─ ThemeToggle (dark/light switch)   │
  │           ├─ AddTaskForm (expandable form)     │
  │           ├─ SearchBar (controlled input)      │
  │           ├─ Filter buttons                   │
  │           └─ TaskList                         │
  │               └─ TaskItem × N                 │
  │                  ├─ Checkbox circle            │
  │                  ├─ Title + Priority badge     │
  │                  ├─ Description + Due date     │
  │                  └─ Delete button              │
  │                    │  fetch()                  │
  │                    ▼                           │
  │  GET/POST/PATCH/DELETE /api/tasks              │
  └───────────────────┬──────────────────────────┘
                      │ (network or localhost)
  ┌───────────────────┴──────────────────────────┐
  │            NEXT.JS SERVER (Node.js)           │
  │                                               │
  │  /api/tasks/route.ts   /api/tasks/[id]/route  │
  │  ├─ GET (list/search)  ├─ GET (single)        │
  │  └─ POST (create)      ├─ PATCH (update)      │
  │                        └─ DELETE (delete)      │
  │             │                                  │
  │  src/lib/db.ts (database functions)            │
  │  ├─ getAllTasks() → SELECT * FROM tasks        │
  │  ├─ createTask() → INSERT INTO tasks           │
  │  ├─ updateTask() → UPDATE ... WHERE id = ?    │
  │  ├─ deleteTask() → DELETE ... WHERE id = ?    │
  │  └─ searchTasks() → SELECT ... LIKE ?         │
  │             │                                  │
  │  better-sqlite3 (reads/writes the DB file)     │
  │             │                                  │
  │  data/tasks.db (The actual file on disk)       │
  │  + tasks.db-wal (Write-Ahead Log, temporary)   │
  └──────────────────────────────────────────────┘
```

---

## 6. The Deepest Layer — One Click, Every Step

Let's trace the absolute deepest path when you click the **"Add" button** after typing "buy milk":

### Step 1: The Click (Physical)
- You press your mouse button
- Your mouse sends an electrical signal via USB or Bluetooth
- Your operating system's **input driver** interprets the signal
- The OS creates a **mouse click event** in the event queue
- Your browser (Chrome, Edge) picks up the event
- The browser determines which DOM element was under the cursor

### Step 2: React Event Handling
- React's event system intercepts the native browser event
- React maps it to the synthetic `onClick` handler on the "Add" button
- React calls `handleSubmit(e)` with the synthetic event

### Step 3: Form Submission
- `e.preventDefault()` calls the native `preventDefault()` on the HTML form event
- This stops the browser from doing its default form-submit behavior (page reload)
- The function checks `!title.trim()` — if title is empty or whitespace, it returns

### Step 4: Calling the Parent
- `onAdd(title.trim(), description.trim(), priority, dueDate)` is called
- This is actually `handleAdd` from `page.tsx` (passed as a prop)

### Step 5: Fetch Request
- `fetch('/api/tasks', { method: 'POST', ... })` is called
- This is a **Promise** — an object representing a future value
- JavaScript doesn't wait — it continues running other code
- Under the hood, the browser's **Fetch API** creates an HTTP request

### Step 6: HTTP Request Creation
- The browser creates an HTTP/1.1 request (or HTTP/2 if available):
  ```
  POST /api/tasks HTTP/1.1
  Host: localhost:3000
  Content-Type: application/json
  Content-Length: 42

  {"title":"buy milk","description":"","priority":"medium","due_date":""}
  ```
- This request goes through the browser's **networking stack**

### Step 7: Network Stack (Browser Side)
- DNS resolution: `localhost` is in the hosts file → resolves to `127.0.0.1`
- TCP connection: Browser opens a TCP socket to `127.0.0.1:3000`
- A three-way handshake happens: SYN → SYN-ACK → ACK
- The request is sent over this socket

### Step 8: Network Stack (OS Side)
- Since it's `127.0.0.1` (loopback), the packet never leaves your computer
- The OS's TCP/IP stack routes it back to the listening process
- The firewall checks: loopback traffic is usually allowed
- Node.js is listening on port 3000 → receives the data

### Step 9: Next.js Server
- Node.js's HTTP parser reads the incoming bytes
- It parses the HTTP method (POST), path (/api/tasks), headers, body
- The server routes to the matching API route handler
- It calls the `POST` function from route.ts

### Step 10: JSON Parsing
- `await request.json()` reads the raw body text
- JSON.parse() is called on the string
- The parser tokenizes: `{` → object, `"title"` → key, etc.
- A JavaScript object `{ title: "buy milk", description: "", ... }` is created

### Step 11: Validation
- `body.title.trim().length === 0` is checked
- "buy milk".trim() = "buy milk", length = 8 → passes validation

### Step 12: Database Call
- `createTask(body)` is called
- Inside, `getDb()` returns the singleton database connection
- A prepared statement is created: `INSERT INTO tasks (...) VALUES (...)`
- The statement is **compiled** into SQLite's internal bytecode

### Step 13: SQLite Execution
- SQLite parses the bytecode
- It checks the **schema** (table structure from `sqlite_master`)
- It validates the data types and constraints
- It starts a **transaction** (automatically for DML statements)

### Step 14: File I/O
- SQLite writes the data to the **WAL file** (tasks.db-wal)
- The WAL record contains: page number, old data, new data
- SQLite updates its **page cache** in memory
- The WAL file grows by ~4KB (one page)

### Step 15: Auto-increment
- SQLite reads the internal `sqlite_sequence` table
- It gets the current max ID for the tasks table
- Increments it: next ID = current max + 1
- Writes the new sequence value back

### Step 16: Return the Data
- `result.lastInsertRowid` returns the new row ID (e.g., 42)
- `getTaskById(42)` queries the database again
- A new `SELECT` statement reads the row
- The full task object is returned, including `created_at` and `updated_at`

### Step 17: Response
- The task object is returned from the API route handler
- `NextResponse.json(task, { status: 201 })` creates the HTTP response:
  ```
  HTTP/1.1 201 Created
  Content-Type: application/json

  {"id":42,"title":"buy milk",...,"completed":0,"created_at":"2026-07-08 ..."}
  ```

### Step 18: Back to Browser
- The response travels back through the same path:
  - HTTP → TCP → loopback → OS network stack → browser
- The `fetch()` Promise resolves
- `res.ok` is checked (status 201 is ok)
- `await res.json()` parses the JSON string back into a JavaScript object

### Step 19: State Update
- `setTasks(prev => [task, ...prev])` is called
- React starts a **batch update** (state updates in React 18+ are batched)
- The new state is: `[{new task}, {old task 1}, {old task 2}, ...]`

### Step 20: Reconciliation
- React compares the new virtual DOM with the previous one
- It finds that TaskList now has one additional TaskItem
- React creates a new fiber node (React's internal representation)
- It commits the change to the real DOM

### Step 21: DOM Update
- A new `<div>` element is inserted at the top of the task list
- The browser recalculates the layout (reflow) and repaints the screen
- You see "buy milk" appear at the top of your list

### Step 22: Database Persistence
- Later, when WAL file reaches a threshold, SQLite **checkpoints**:
  - Reads the WAL records
  - Applies them to the main database file (tasks.db)
  - Truncates the WAL file
- Or when you close the database connection, checkpoint happens automatically

---

## One Sentence Summary

**You clicked "Add" → the browser sent your task as JSON text via HTTP to the Next.js server → the server ran a function that spoke SQL to a SQLite database file on your disk → the database inserted a new row into a B-tree structure → the server sent back the saved task as JSON → the browser parsed the JSON, React updated its state, compared old and new virtual DOM trees, found one new task, added a single DIV element to the page, and your screen updated — all in less time than it takes you to blink.**

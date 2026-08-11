import { createClient } from '@libsql/client'
import path from 'path'
import fs from 'fs'
import type { Task, Note, User, Priority, Status, CreateTaskInput, UpdateTaskInput, CreateNoteInput, UpdateNoteInput } from '@/types'

function mapUser(row: Record<string, unknown>): User {
  return {
    id: row.id as number,
    name: row.name as string,
    email: row.email as string,
    password_hash: row.password_hash as string | null,
    image: row.image as string | null,
    created_at: row.created_at as string,
  }
}

function mapTask(row: Record<string, unknown>): Task {
  return {
    id: row.id as number,
    user_id: row.user_id as number,
    title: row.title as string,
    description: row.description as string | null,
    priority: row.priority as Priority,
    due_date: row.due_date as string | null,
    status: (row.status as Status) ?? 'pending',
    completed: row.completed as number,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  }
}

function mapNote(row: Record<string, unknown>): Note {
  return {
    id: row.id as number,
    user_id: row.user_id as number,
    title: row.title as string,
    body: row.body as string,
    pinned: row.pinned as number,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  }
}

const url = process.env.TURSO_DB_URL ?? 'file:data/tasks.db'
const authToken = process.env.TURSO_AUTH_TOKEN

const isLocal = url.startsWith('file:')

let client: Awaited<ReturnType<typeof createClient>> | null = null

async function getClient() {
  if (!client) {
    client = createClient({ url, authToken, intMode: 'number' })

    if (isLocal) {
      const dbPath = url.slice(5)
      const dir = path.dirname(dbPath)
      fs.mkdirSync(dir, { recursive: true })
    }

    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        image TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `)

    await client.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
        due_date TEXT,
        completed INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `)

    try {
      await client.execute(`ALTER TABLE tasks ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'`)
      await client.execute(`UPDATE tasks SET status = 'done' WHERE completed = 1`)
    } catch {
      // Column already exists — migration is a no-op
    }

    await client.execute(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        body TEXT NOT NULL DEFAULT '',
        pinned INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `)
  }
  return client
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const c = await getClient()
  const rs = await c.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email] })
  const row = rs.rows[0]
  return row ? mapUser(row as Record<string, unknown>) : undefined
}

export async function getUserById(id: number): Promise<User | undefined> {
  const c = await getClient()
  const rs = await c.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [id] })
  const row = rs.rows[0]
  return row ? mapUser(row as Record<string, unknown>) : undefined
}

export async function createUser(name: string, email: string, password_hash: string): Promise<User> {
  const c = await getClient()
  const rs = await c.execute({
    sql: 'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    args: [name, email, password_hash],
  })
  return getUserById(Number(rs.lastInsertRowid)) as Promise<User>
}

export async function getAllTasks(userId: number): Promise<Task[]> {
  const c = await getClient()
  const rs = await c.execute({
    sql: 'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
    args: [userId],
  })
  return (rs.rows as Record<string, unknown>[]).map(mapTask)
}

export async function getTaskById(id: number): Promise<Task | undefined> {
  const c = await getClient()
  const rs = await c.execute({ sql: 'SELECT * FROM tasks WHERE id = ?', args: [id] })
  const row = rs.rows[0]
  return row ? mapTask(row as Record<string, unknown>) : undefined
}

export async function createTask(input: CreateTaskInput, userId: number): Promise<Task> {
  const c = await getClient()
  const rs = await c.execute({
    sql: 'INSERT INTO tasks (user_id, title, description, priority, due_date) VALUES (?, ?, ?, ?, ?)',
    args: [userId, input.title, input.description ?? null, input.priority ?? 'medium', input.due_date ?? null],
  })
  return getTaskById(Number(rs.lastInsertRowid)) as Promise<Task>
}

export async function updateTask(id: number, input: UpdateTaskInput): Promise<Task | undefined> {
  const existing = await getTaskById(id)
  if (!existing) return undefined

  const fields: string[] = []
  const values: (string | number | null)[] = []

  if (input.title !== undefined) { fields.push('title = ?'); values.push(input.title) }
  if (input.description !== undefined) { fields.push('description = ?'); values.push(input.description) }
  if (input.priority !== undefined) { fields.push('priority = ?'); values.push(input.priority) }
  if (input.due_date !== undefined) { fields.push('due_date = ?'); values.push(input.due_date) }
  if (input.status !== undefined) {
    fields.push('status = ?'); values.push(input.status)
    fields.push('completed = ?'); values.push(input.status === 'done' ? 1 : 0)
  } else if (input.completed !== undefined) {
    fields.push('completed = ?'); values.push(input.completed)
    fields.push('status = ?'); values.push(input.completed ? 'done' : 'pending')
  }

  if (fields.length === 0) return existing

  fields.push("updated_at = datetime('now')")
  values.push(id)

  const c = await getClient()
  await c.execute({ sql: `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`, args: values })
  return getTaskById(id)
}

export async function deleteTask(id: number): Promise<boolean> {
  const c = await getClient()
  const rs = await c.execute({ sql: 'DELETE FROM tasks WHERE id = ?', args: [id] })
  return rs.rowsAffected > 0
}

export async function searchTasks(query: string, userId: number): Promise<Task[]> {
  const c = await getClient()
  const rs = await c.execute({
    sql: "SELECT * FROM tasks WHERE user_id = ? AND title LIKE ? ORDER BY created_at DESC",
    args: [userId, `%${query}%`],
  })
  return (rs.rows as Record<string, unknown>[]).map(mapTask)
}

export async function getAllNotes(userId: number): Promise<Note[]> {
  const c = await getClient()
  const rs = await c.execute({
    sql: 'SELECT * FROM notes WHERE user_id = ? ORDER BY pinned DESC, updated_at DESC',
    args: [userId],
  })
  return (rs.rows as Record<string, unknown>[]).map(mapNote)
}

export async function getNoteById(id: number): Promise<Note | undefined> {
  const c = await getClient()
  const rs = await c.execute({ sql: 'SELECT * FROM notes WHERE id = ?', args: [id] })
  const row = rs.rows[0]
  return row ? mapNote(row as Record<string, unknown>) : undefined
}

export async function createNote(input: CreateNoteInput, userId: number): Promise<Note> {
  const c = await getClient()
  const rs = await c.execute({
    sql: 'INSERT INTO notes (user_id, title, body) VALUES (?, ?, ?)',
    args: [userId, input.title, input.body ?? ''],
  })
  return getNoteById(Number(rs.lastInsertRowid)) as Promise<Note>
}

export async function updateNote(id: number, input: UpdateNoteInput): Promise<Note | undefined> {
  const existing = await getNoteById(id)
  if (!existing) return undefined

  const fields: string[] = []
  const values: (string | number | null)[] = []

  if (input.title !== undefined) { fields.push('title = ?'); values.push(input.title) }
  if (input.body !== undefined) { fields.push('body = ?'); values.push(input.body) }
  if (input.pinned !== undefined) { fields.push('pinned = ?'); values.push(input.pinned) }

  if (fields.length === 0) return existing

  fields.push("updated_at = datetime('now')")
  values.push(id)

  const c = await getClient()
  await c.execute({ sql: `UPDATE notes SET ${fields.join(', ')} WHERE id = ?`, args: values })
  return getNoteById(id)
}

export async function deleteNote(id: number): Promise<boolean> {
  const c = await getClient()
  const rs = await c.execute({ sql: 'DELETE FROM notes WHERE id = ?', args: [id] })
  return rs.rowsAffected > 0
}

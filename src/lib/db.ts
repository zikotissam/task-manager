import { createClient } from '@libsql/client'
import path from 'path'
import fs from 'fs'
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types'

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
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
        due_date TEXT,
        completed INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `)
  }
  return client
}

export async function getAllTasks(): Promise<Task[]> {
  const c = await getClient()
  const rs = await c.execute('SELECT * FROM tasks ORDER BY created_at DESC')
  return rs.rows as unknown as Task[]
}

export async function getTaskById(id: number): Promise<Task | undefined> {
  const c = await getClient()
  const rs = await c.execute({ sql: 'SELECT * FROM tasks WHERE id = ?', args: [id] })
  return rs.rows[0] as unknown as Task | undefined
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const c = await getClient()
  const rs = await c.execute({
    sql: 'INSERT INTO tasks (title, description, priority, due_date) VALUES (?, ?, ?, ?)',
    args: [input.title, input.description ?? null, input.priority ?? 'medium', input.due_date ?? null],
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
  if (input.completed !== undefined) { fields.push('completed = ?'); values.push(input.completed) }

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

export async function searchTasks(query: string): Promise<Task[]> {
  const c = await getClient()
  const rs = await c.execute({
    sql: "SELECT * FROM tasks WHERE title LIKE ? ORDER BY created_at DESC",
    args: [`%${query}%`],
  })
  return rs.rows as unknown as Task[]
}

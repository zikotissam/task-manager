import Database from 'better-sqlite3'
import path from 'path'
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types'

const DB_PATH = path.join(process.cwd(), 'data', 'tasks.db')

let db: Database.Database

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    initSchema()
  }
  return db
}

function initSchema() {
  db.exec(`
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

export function getAllTasks(): Task[] {
  return getDb()
    .prepare('SELECT * FROM tasks ORDER BY created_at DESC')
    .all() as Task[]
}

export function getTaskById(id: number): Task | undefined {
  return getDb().prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task | undefined
}

export function createTask(input: CreateTaskInput): Task {
  const stmt = getDb().prepare(`
    INSERT INTO tasks (title, description, priority, due_date)
    VALUES (@title, @description, @priority, @due_date)
  `)
  const result = stmt.run({
    title: input.title,
    description: input.description ?? null,
    priority: input.priority ?? 'medium',
    due_date: input.due_date ?? null,
  })
  return getTaskById(result.lastInsertRowid as number) as Task
}

export function updateTask(id: number, input: UpdateTaskInput): Task | undefined {
  const existing = getTaskById(id)
  if (!existing) return undefined

  const fields: string[] = []
  const values: Record<string, unknown> = { id }

  if (input.title !== undefined) { fields.push('title = @title'); values.title = input.title }
  if (input.description !== undefined) { fields.push('description = @description'); values.description = input.description }
  if (input.priority !== undefined) { fields.push('priority = @priority'); values.priority = input.priority }
  if (input.due_date !== undefined) { fields.push('due_date = @due_date'); values.due_date = input.due_date }
  if (input.completed !== undefined) { fields.push('completed = @completed'); values.completed = input.completed }

  if (fields.length === 0) return existing

  fields.push("updated_at = datetime('now')")

  getDb().prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = @id`).run(values)
  return getTaskById(id)
}

export function deleteTask(id: number): boolean {
  const result = getDb().prepare('DELETE FROM tasks WHERE id = ?').run(id)
  return result.changes > 0
}

export function searchTasks(query: string): Task[] {
  return getDb()
    .prepare("SELECT * FROM tasks WHERE title LIKE ? ORDER BY created_at DESC")
    .all(`%${query}%`) as Task[]
}

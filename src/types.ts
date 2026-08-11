export type Priority = 'low' | 'medium' | 'high'

export type Status = 'pending' | 'in_progress' | 'stopped' | 'done'

export const STATUSES: Status[] = ['pending', 'in_progress', 'stopped', 'done']

export interface User {
  id: number
  name: string
  email: string
  password_hash: string | null
  image: string | null
  created_at: string
}

export interface Task {
  id: number
  user_id: number
  title: string
  description: string | null
  priority: Priority
  due_date: string | null
  status: Status
  completed: number
  created_at: string
  updated_at: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  priority?: Priority
  due_date?: string
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  priority?: Priority
  due_date?: string
  status?: Status
  completed?: number
}

export interface Note {
  id: number
  user_id: number
  title: string
  body: string
  pinned: number
  created_at: string
  updated_at: string
}

export interface CreateNoteInput {
  title: string
  body?: string
}

export interface UpdateNoteInput {
  title?: string
  body?: string
  pinned?: number
}

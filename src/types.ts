export type Priority = 'low' | 'medium' | 'high'

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
  completed?: number
}

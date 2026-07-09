'use client'

import type { Task, Priority, UpdateTaskInput } from '@/types'
import TaskItem from './TaskItem'

type SortBy = 'created_desc' | 'created_asc' | 'due_date' | 'priority_high'

interface Props {
  tasks: Task[]
  filter: 'all' | 'active' | 'completed'
  priorityFilter: 'all' | Priority
  sortBy: SortBy
  onToggle: (id: number, completed: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number, data: UpdateTaskInput) => void
  searchQuery: string
  disabled?: boolean
}

const priorityRank: Record<Priority, number> = { high: 3, medium: 2, low: 1 }

export default function TaskList({ tasks, filter, priorityFilter, sortBy, onToggle, onDelete, onEdit, searchQuery, disabled }: Props) {
  const filtered = tasks.filter((task) => {
    if (filter === 'active' && task.completed) return false
    if (filter === 'completed' && !task.completed) return false
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'created_asc':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'due_date': {
        if (!a.due_date && !b.due_date) return 0
        if (!a.due_date) return 1
        if (!b.due_date) return -1
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      }
      case 'priority_high':
        return priorityRank[b.priority] - priorityRank[a.priority]
      case 'created_desc':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg className="mb-4 h-16 w-16 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {searchQuery
            ? 'No tasks match your search.'
            : filter === 'all'
              ? 'No tasks yet. Add one above!'
              : filter === 'active'
                ? 'No active tasks. Nice!'
                : 'No completed tasks yet.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {sorted.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} disabled={disabled} />
      ))}
    </div>
  )
}

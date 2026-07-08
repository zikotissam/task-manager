'use client'

import type { Task } from '@/types'
import TaskItem from './TaskItem'

interface Props {
  tasks: Task[]
  filter: 'all' | 'active' | 'completed'
  onToggle: (id: number, completed: number) => void
  onDelete: (id: number) => void
  searchQuery: string
}

export default function TaskList({ tasks, filter, onToggle, onDelete, searchQuery }: Props) {
  const filtered = tasks.filter((task) => {
    if (filter === 'active' && task.completed) return false
    if (filter === 'completed' && !task.completed) return false
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  if (filtered.length === 0) {
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
      {filtered.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  )
}

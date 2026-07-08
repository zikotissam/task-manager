'use client'

import type { Task, Priority } from '@/types'

interface Props {
  task: Task
  onToggle: (id: number, completed: number) => void
  onDelete: (id: number) => void
  disabled?: boolean
}

const priorityColors: Record<Priority, string> = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export default function TaskItem({ task, onToggle, onDelete, disabled }: Props) {
  return (
    <div
      className={`group flex items-start gap-3 rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${
        task.completed
          ? 'border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50'
          : 'border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800'
      }`}
    >
      <button
        onClick={() => onToggle(task.id, task.completed)}
        disabled={disabled}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
          task.completed
            ? 'border-green-500 bg-green-500 dark:border-green-400 dark:bg-green-400'
            : 'border-zinc-300 hover:border-green-400 dark:border-zinc-600 dark:hover:border-green-500'
        }`}
      >
        {task.completed ? (
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : null}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3
            className={`text-sm font-medium transition-all duration-200 ${
              task.completed ? 'text-zinc-400 line-through dark:text-zinc-500' : 'text-zinc-900 dark:text-zinc-100'
            }`}
          >
            {task.title}
          </h3>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[task.priority] || priorityColors.medium}`}
          >
            {task.priority}
          </span>
        </div>
        {task.description && (
          <p
            className={`mt-1 text-sm ${
              task.completed ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            {task.description}
          </p>
        )}
        {task.due_date && (
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            Due: {new Date(task.due_date).toLocaleDateString()}
          </p>
        )}
      </div>

      <button
        onClick={() => onDelete(task.id)}
        disabled={disabled}
        className="shrink-0 rounded p-1 text-zinc-400 opacity-60 transition-all duration-200 hover:bg-red-50 hover:text-red-500 focus:opacity-100 disabled:cursor-not-allowed disabled:opacity-30 sm:opacity-0 sm:group-hover:opacity-100 dark:hover:bg-red-900/30 dark:hover:text-red-400"
        aria-label="Delete task"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}

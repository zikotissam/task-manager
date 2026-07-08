'use client'

import { useState, type FormEvent } from 'react'
import type { Priority } from '@/types'

interface Props {
  onAdd: (title: string, description: string, priority: Priority, due_date: string) => void
}

export default function AddTaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title.trim(), description.trim(), priority, dueDate)
    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate('')
    setIsExpanded(false)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Collapse form' : 'Expand form'}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-dashed transition-all duration-200 ${
            isExpanded
              ? 'border-blue-400 bg-blue-50 text-blue-500 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-400'
              : 'border-zinc-300 text-zinc-400 hover:border-blue-400 hover:text-blue-500 dark:border-zinc-600 dark:hover:border-blue-500'
          }`}
        >
          <svg className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-45' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-blue-400"
          onFocus={() => setIsExpanded(true)}
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 space-y-3 border-t border-zinc-100 pt-3 dark:border-zinc-700">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-blue-400"
          />
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:focus:border-blue-400"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:focus:border-blue-400"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

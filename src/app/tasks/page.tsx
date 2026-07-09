'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import type { Task, Priority, UpdateTaskInput } from '@/types'
import AddTaskForm from '@/components/AddTaskForm'
import TaskList from '@/components/TaskList'
import SearchBar from '@/components/SearchBar'
import { useToast } from '@/components/ToastProvider'
import ConfirmDialog from '@/components/ConfirmDialog'
import TaskSkeleton from '@/components/TaskSkeleton'

type Filter = 'all' | 'active' | 'completed'
type SortBy = 'created_desc' | 'created_asc' | 'due_date' | 'priority_high'

export default function TasksPage() {
  const { status } = useSession()
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all')
  const [sortBy, setSortBy] = useState<SortBy>('created_desc')
  const [searchQuery, setSearchQuery] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)
  const addInputRef = useRef<HTMLInputElement | null>(null)

  const fetchTasks = useCallback(async (query?: string) => {
    try {
      const url = query ? `/api/tasks?q=${encodeURIComponent(query)}` : '/api/tasks'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch tasks')
      setTasks(await res.json())
    } catch (e) {
      toast('error', e instanceof Error ? e.message : 'Failed to fetch tasks')
    }
  }, [toast])

  useEffect(() => {
    if (status === 'authenticated') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchTasks().then(() => setLoaded(true))
    }
  }, [status, fetchTasks])

  useEffect(() => {
    if (status !== 'authenticated') return
    const timer = setTimeout(() => {
      fetchTasks(searchQuery || undefined)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, fetchTasks, status])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        addInputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleAdd = async (title: string, description: string, priority: Priority, due_date: string) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: description || undefined, priority, due_date: due_date || undefined }),
      })
      if (!res.ok) throw new Error('Failed to add task')
      const task = await res.json()
      setTasks((prev) => [task, ...prev])
      toast('success', 'Task added')
    } catch (e) {
      toast('error', e instanceof Error ? e.message : 'Failed to add task')
    }
  }

  const handleToggle = async (id: number, completed: number) => {
    setPendingId(id)
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: completed ? 0 : 1 }),
      })
      if (!res.ok) throw new Error('Failed to update task')
      const updated = await res.json()
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
      toast('success', completed ? 'Task reopened' : 'Task completed')
    } catch (e) {
      toast('error', e instanceof Error ? e.message : 'Failed to update task')
    } finally {
      setPendingId(null)
    }
  }

  const handleDeleteRequest = (id: number) => {
    setDeleteTarget(id)
  }

  const handleConfirmDelete = async () => {
    if (deleteTarget === null) return
    const id = deleteTarget
    setDeleteTarget(null)
    setPendingId(id)
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete task')
      setTasks((prev) => prev.filter((t) => t.id !== id))
      toast('success', 'Task deleted')
    } catch (e) {
      toast('error', e instanceof Error ? e.message : 'Failed to delete task')
    } finally {
      setPendingId(null)
    }
  }

  const handleEdit = async (id: number, data: UpdateTaskInput) => {
    setPendingId(id)
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update task')
      const updated = await res.json()
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
      toast('success', 'Task updated')
    } catch (e) {
      toast('error', e instanceof Error ? e.message : 'Failed to update task')
    } finally {
      setPendingId(null)
    }
  }

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
  ]

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-500 dark:border-zinc-700 dark:border-t-blue-400" />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 pl-12 md:pl-4">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Tasks
            <span className="ml-2 text-sm font-normal text-zinc-400 dark:text-zinc-500">
              {tasks.length} total
            </span>
          </h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <div className="space-y-4">
          <AddTaskForm onAdd={handleAdd} inputRef={addInputRef} />

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-400"
              aria-label="Sort tasks"
            >
              <option value="created_desc">Newest first</option>
              <option value="created_asc">Oldest first</option>
              <option value="due_date">Due date</option>
              <option value="priority_high">Priority</option>
            </select>
          </div>

          <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800" role="tablist">
            {filters.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                role="tab"
                aria-selected={filter === key}
                className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                  filter === key
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800" role="tablist">
            {(['all', 'low', 'medium', 'high'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                role="tab"
                aria-selected={priorityFilter === p}
                className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 capitalize ${
                  priorityFilter === p
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
>
                {p === 'all' ? 'All priority' : p}
              </button>
            ))}
          </div>

          {!loaded ? (
            <TaskSkeleton />
          ) : (
            <TaskList
              tasks={tasks}
              filter={filter}
              priorityFilter={priorityFilter}
              sortBy={sortBy}
              onToggle={handleToggle}
              onDelete={handleDeleteRequest}
              onEdit={handleEdit}
              searchQuery={searchQuery}
              disabled={pendingId !== null}
            />
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

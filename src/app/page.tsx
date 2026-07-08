'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import type { Task, Priority } from '@/types'
import AddTaskForm from '@/components/AddTaskForm'
import TaskList from '@/components/TaskList'
import SearchBar from '@/components/SearchBar'
import ThemeToggle from '@/components/ThemeToggle'

type Filter = 'all' | 'active' | 'completed'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const fetchTasks = useCallback(async (query?: string) => {
    setError(null)
    try {
      const url = query ? `/api/tasks?q=${encodeURIComponent(query)}` : '/api/tasks'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch tasks')
      setTasks(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTasks().then(() => setLoading(false))
    }
  }, [status, fetchTasks])

  useEffect(() => {
    if (status !== 'authenticated') return
    const timer = setTimeout(() => {
      fetchTasks(searchQuery || undefined)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, fetchTasks, status])

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
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add task')
    }
  }

  const handleToggle = async (id: number, completed: number) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: completed ? 0 : 1 }),
      })
      if (!res.ok) throw new Error('Failed to update task')
      const updated = await res.json()
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update task')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete task')
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete task')
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
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Tasks
              <span className="ml-2 text-sm font-normal text-zinc-400 dark:text-zinc-500">
                {tasks.length} total
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-zinc-500 dark:text-zinc-400 sm:inline">
              {session?.user?.name}
            </span>
            <button
              onClick={() => signOut()}
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              Sign out
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
            {error}
            <button onClick={() => setError(null)} className="ml-2 font-medium underline">Dismiss</button>
          </div>
        )}

        <div className="space-y-4">
          <AddTaskForm onAdd={handleAdd} />

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
          </div>

          <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
            {filters.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
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

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-500 dark:border-zinc-700 dark:border-t-blue-400" />
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              filter={filter}
              onToggle={handleToggle}
              onDelete={handleDelete}
              searchQuery={searchQuery}
            />
          )}
        </div>
      </main>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import type { Task } from '@/types'

function computeStats(tasks: Task[]) {
  const total = tasks.length
  const completed = tasks.filter((t) => t.completed).length
  const active = total - completed
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const overdue = tasks.filter((t) => !t.completed && t.due_date && new Date(t.due_date) < now).length
  const low = tasks.filter((t) => t.priority === 'low').length
  const medium = tasks.filter((t) => t.priority === 'medium').length
  const high = tasks.filter((t) => t.priority === 'high').length
  return { total, completed, active, overdue, low, medium, high }
}

export default function DashboardPage() {
  const { status } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch('/api/tasks')
      .then((r) => r.json())
      .then((data) => {
        setTasks(data)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [status])

  if (status === 'loading') {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-500 dark:border-zinc-700 dark:border-t-blue-400" />
      </div>
    )
  }

  const stats = computeStats(tasks)
  const pMax = Math.max(stats.low, stats.medium, stats.high, 1)

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5)

  const cards = [
    { label: 'Total', value: stats.total, color: 'text-zinc-900 dark:text-zinc-100' },
    { label: 'Active', value: stats.active, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Completed', value: stats.completed, color: 'text-green-600 dark:text-green-400' },
    { label: 'Overdue', value: stats.overdue, color: stats.overdue > 0 ? 'text-red-600 dark:text-red-400' : 'text-zinc-400 dark:text-zinc-500' },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-3xl items-center px-4 py-4 pl-12 md:pl-4">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Dashboard</h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl flex-1 space-y-8 px-4 py-6">
        {!loaded ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-500 dark:border-zinc-700 dark:border-t-blue-400" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {cards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900"
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    {card.label}
                  </p>
                  <p className={`mt-1 text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            <section>
              <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Priority Breakdown
              </h2>
              <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                {[
                  { key: 'high', label: 'High', count: stats.high, color: 'bg-red-500' },
                  { key: 'medium', label: 'Medium', count: stats.medium, color: 'bg-yellow-500' },
                  { key: 'low', label: 'Low', count: stats.low, color: 'bg-green-500' },
                ].map((p) => (
                  <div key={p.key} className="flex items-center gap-3">
                    <span className="w-16 text-sm text-zinc-600 dark:text-zinc-400">{p.label}</span>
                    <div className="flex h-4 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${p.color}`}
                        style={{ width: `${(p.count / pMax) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {p.count}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Recent Activity
              </h2>
              {recentTasks.length === 0 ? (
                <p className="text-sm text-zinc-400 dark:text-zinc-500">No tasks yet.</p>
              ) : (
                <div className="space-y-2">
                  {recentTasks.map((task) => (
                    <Link
                      key={task.id}
                      href="/tasks"
                      className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`h-2 w-2 shrink-0 rounded-full ${
                            task.completed
                              ? 'bg-green-400'
                              : task.priority === 'high'
                              ? 'bg-red-400'
                              : task.priority === 'medium'
                              ? 'bg-yellow-400'
                              : 'bg-green-400'
                          }`}
                        />
                        <span
                          className={`truncate text-sm ${
                            task.completed
                              ? 'text-zinc-400 line-through dark:text-zinc-500'
                              : 'text-zinc-900 dark:text-zinc-100'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                      <span className="ml-4 shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
                        {new Date(task.updated_at).toLocaleDateString()}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}

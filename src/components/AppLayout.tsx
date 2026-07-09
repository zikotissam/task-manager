'use client'

import { useState, type ReactNode } from 'react'
import Sidebar from './Sidebar'
import { ToastProvider } from './ToastProvider'

export default function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-full">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="relative flex flex-1 flex-col overflow-auto">
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-sm md:hidden dark:border-zinc-700 dark:bg-zinc-800"
          aria-label="Open menu"
        >
          <svg className="h-5 w-5 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <ToastProvider>
          {children}
        </ToastProvider>
      </main>
    </div>
  )
}

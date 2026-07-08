'use client'

import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className="relative h-8 w-14 rounded-full bg-zinc-200 p-1 transition-colors duration-300 dark:bg-zinc-700"
      aria-label="Toggle theme"
    >
      <span
        className={`block h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
          theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        <span className="flex h-full items-center justify-center text-sm" aria-hidden="true">
          {theme === 'dark' ? '🌙' : '☀️'}
        </span>
      </span>
    </button>
  )
}

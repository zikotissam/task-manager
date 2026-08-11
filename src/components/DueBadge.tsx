'use client'

import { useEffect, useState } from 'react'
import { parseDueDate } from '@/lib/dates'

interface Props {
  dueDate: string
  createdAt?: string
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function DueBadge({ dueDate, createdAt }: Props) {
  const due = parseDueDate(dueDate, createdAt)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const msLeft = due.getTime() - Date.now()
    if (msLeft > 0 && msLeft <= 24 * 60 * 60 * 1000) {
      const timer = setInterval(() => setNow(Date.now()), 1000)
      return () => clearInterval(timer)
    }
  }, [due])

  const diffMs = due.getTime() - now
  const exact = due.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  if (diffMs > 24 * 60 * 60 * 1000) {
    const days = Math.ceil(diffMs / (24 * 60 * 60 * 1000))
    return (
      <span
        className="cursor-default text-zinc-400 dark:text-zinc-500"
        title={`Due ${exact}`}
      >
        in {days}d
      </span>
    )
  }

  if (diffMs > 0) {
    const total = Math.floor(diffMs / 1000)
    const hh = Math.floor(total / 3600)
    const mm = Math.floor((total % 3600) / 60)
    const ss = total % 60
    return (
      <span
        className="cursor-default font-medium tabular-nums text-amber-600 dark:text-amber-400"
        title={`Due ${exact}`}
      >
        {pad(hh)}:{pad(mm)}:{pad(ss)}
      </span>
    )
  }

  const elapsed = Math.floor(-diffMs / (60 * 60 * 1000))
  return (
    <span
      className="cursor-default font-medium text-red-600 dark:text-red-400"
      title={`Was due ${exact}`}
    >
      Overdue {elapsed}h
    </span>
  )
}

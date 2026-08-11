const LEGACY_DATE = /^\d{4}-\d{2}-\d{2}$/

export function parseDueDate(dueDate: string, createdAt?: string): Date {
  if (LEGACY_DATE.test(dueDate)) {
    const time = createdAt ? createdAt.slice(11) : '12:00:00'
    return new Date(`${dueDate}T${time || '12:00:00'}`)
  }
  return new Date(dueDate)
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

// datetime-local value is `YYYY-MM-DDTHH:MM`. If only a date was picked (no
// time part), default the time to the submit moment's time-of-day.
export function normalizeDatetimeLocal(value: string): string {
  const [datePart, timePart] = value.split('T')
  if (!datePart || timePart) return value
  const now = new Date()
  return `${datePart}T${pad(now.getHours())}:${pad(now.getMinutes())}`
}

export function toDatetimeLocal(value: string | null | undefined, createdAt?: string): string {
  if (!value) return ''
  const d = parseDueDate(value, createdAt)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

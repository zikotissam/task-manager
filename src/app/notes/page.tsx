'use client'

import { useState, useEffect, useCallback, type FormEvent } from 'react'
import { useSession } from 'next-auth/react'
import type { Note, UpdateNoteInput } from '@/types'
import NoteItem from '@/components/NoteItem'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useToast } from '@/components/ToastProvider'

export default function NotesPage() {
  const { status } = useSession()
  const { toast } = useToast()
  const [notes, setNotes] = useState<Note[]>([])
  const [loaded, setLoaded] = useState(false)
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch('/api/notes')
      if (!res.ok) throw new Error('Failed to fetch notes')
      setNotes(await res.json())
    } catch (e) {
      toast('error', e instanceof Error ? e.message : 'Failed to fetch notes')
    }
  }, [toast])

  useEffect(() => {
    if (status === 'authenticated') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchNotes().then(() => setLoaded(true))
    }
  }, [status, fetchNotes])

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), body: body.trim() || undefined }),
      })
      if (!res.ok) throw new Error('Failed to add note')
      const note = await res.json()
      setNotes((prev) => [note, ...prev])
      setTitle('')
      setBody('')
      setIsExpanded(false)
      toast('success', 'Note added')
    } catch (e) {
      toast('error', e instanceof Error ? e.message : 'Failed to add note')
    }
  }

  const handleUpdate = async (id: number, data: UpdateNoteInput) => {
    setPendingId(id)
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update note')
      const updated = await res.json()
      setNotes((prev) =>
        prev
          .map((n) => (n.id === id ? updated : n))
          .sort((a, b) => b.pinned - a.pinned || new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      )
      toast('success', data.pinned !== undefined ? (data.pinned ? 'Note pinned' : 'Note unpinned') : 'Note updated')
    } catch (e) {
      toast('error', e instanceof Error ? e.message : 'Failed to update note')
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
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete note')
      setNotes((prev) => prev.filter((n) => n.id !== id))
      toast('success', 'Note deleted')
    } catch (e) {
      toast('error', e instanceof Error ? e.message : 'Failed to delete note')
    } finally {
      setPendingId(null)
    }
  }

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
            Notes
            <span className="ml-2 text-sm font-normal text-zinc-400 dark:text-zinc-500">
              {notes.length} total
            </span>
          </h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <div className="space-y-4">
          <form
            onSubmit={handleAdd}
            className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
          >
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
                placeholder="Add a new note..."
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
              <div className="mt-3 border-t border-zinc-100 pt-3 dark:border-zinc-700">
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Note body (optional)"
                  rows={3}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-blue-400"
                />
              </div>
            )}
          </form>

          {!loaded ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-500 dark:border-zinc-700 dark:border-t-blue-400" />
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="mb-4 h-16 w-16 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No notes yet. Add one above!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  onUpdate={handleUpdate}
                  onDelete={handleDeleteRequest}
                  disabled={pendingId !== null}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

'use client'

import { useState } from 'react'
import type { Note, UpdateNoteInput } from '@/types'

interface Props {
  note: Note
  onUpdate: (id: number, data: UpdateNoteInput) => void
  onDelete: (id: number) => void
  disabled?: boolean
}

export default function NoteItem({ note, onUpdate, onDelete, disabled }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(note.title)
  const [editBody, setEditBody] = useState(note.body)

  function startEditing() {
    setEditTitle(note.title)
    setEditBody(note.body)
    setIsEditing(true)
  }

  function cancelEditing() {
    setIsEditing(false)
  }

  function saveEditing() {
    if (!editTitle.trim()) return
    onUpdate(note.id, {
      title: editTitle.trim(),
      body: editBody.trim(),
    })
    setIsEditing(false)
  }

  const inputClass = "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-blue-400"

  return (
    <div className="group rounded-lg border border-zinc-200 bg-white p-4 transition-all duration-200 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800">
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className={inputClass}
            placeholder="Note title"
            autoFocus
          />
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            className={inputClass}
            placeholder="Note body (optional)"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={saveEditing}
              disabled={!editTitle.trim() || disabled}
              className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={cancelEditing}
              disabled={disabled}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100" title={note.title}>
              {note.title}
            </h3>
            {note.pinned === 1 && (
              <span className="text-xs font-medium text-amber-500">Pinned</span>
            )}
            <div className="flex shrink-0 gap-0.5">
              <button
                onClick={() => onUpdate(note.id, { pinned: note.pinned ? 0 : 1 })}
                disabled={disabled}
                className={`rounded p-1 transition-all duration-200 ${
                  note.pinned ? 'text-amber-500' : 'text-zinc-400 hover:text-amber-500'
                } disabled:cursor-not-allowed disabled:opacity-30`}
                aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 4h3a1 1 0 011 1v3m-4 0l4-4m-4 4l-6 6m-4 2l-3 3m3-3l3 3m-3-3l3-3m4-4l-6 6" />
                </svg>
              </button>
              <button
                onClick={startEditing}
                disabled={disabled}
                className="rounded p-1 text-zinc-400 transition-all duration-200 hover:bg-blue-50 hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                aria-label="Edit note"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(note.id)}
                disabled={disabled}
                className="rounded p-1 text-zinc-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                aria-label="Delete note"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          {note.body && (
            <p className="mt-1 text-sm whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">{note.body}</p>
          )}
          <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
            {new Date(note.updated_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </>
      )}
    </div>
  )
}

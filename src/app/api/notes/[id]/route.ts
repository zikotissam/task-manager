import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getNoteById, updateNote, deleteNote } from '@/lib/db'
import type { UpdateNoteInput } from '@/types'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const note = await getNoteById(Number(id))
    if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    if (note.user_id !== Number(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json(note)
  } catch (e) {
    console.error('GET /api/notes/[id] failed:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const note = await getNoteById(Number(id))
    if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    if (note.user_id !== Number(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body: UpdateNoteInput = await request.json()
    if (body.title !== undefined && body.title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (body.pinned !== undefined && body.pinned !== 0 && body.pinned !== 1) {
      return NextResponse.json({ error: 'Invalid pinned value' }, { status: 400 })
    }

    const updated = await updateNote(Number(id), body)
    return NextResponse.json(updated)
  } catch (e) {
    console.error('PATCH /api/notes/[id] failed:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const note = await getNoteById(Number(id))
    if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    if (note.user_id !== Number(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const deleted = await deleteNote(Number(id))
    if (!deleted) return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('DELETE /api/notes/[id] failed:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

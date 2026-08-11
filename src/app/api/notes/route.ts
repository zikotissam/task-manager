import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getAllNotes, createNote } from '@/lib/db'
import type { CreateNoteInput } from '@/types'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const notes = await getAllNotes(Number(session.user.id))
    return NextResponse.json(notes)
  } catch (e) {
    console.error('GET /api/notes failed:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: CreateNoteInput = await request.json()

    if (!body.title || body.title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const note = await createNote(body, Number(session.user.id))
    return NextResponse.json(note, { status: 201 })
  } catch (e) {
    console.error('POST /api/notes failed:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

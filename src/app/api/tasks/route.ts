import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getAllTasks, createTask, searchTasks } from '@/lib/db'
import type { CreateTaskInput } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')

    const tasks = q
      ? await searchTasks(q, Number(session.user.id))
      : await getAllTasks(Number(session.user.id))
    return NextResponse.json(tasks)
  } catch (e) {
    console.error('GET /api/tasks failed:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: CreateTaskInput = await request.json()

    if (!body.title || body.title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const task = await createTask(body, Number(session.user.id))
    return NextResponse.json(task, { status: 201 })
  } catch (e) {
    console.error('POST /api/tasks failed:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getTaskById, updateTask, deleteTask } from '@/lib/db'
import type { UpdateTaskInput } from '@/types'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const task = await getTaskById(Number(id))
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  if (task.user_id !== Number(session.user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return NextResponse.json(task)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const task = await getTaskById(Number(id))
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  if (task.user_id !== Number(session.user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body: UpdateTaskInput = await request.json()
  const updated = await updateTask(Number(id), body)
  return NextResponse.json(updated)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const task = await getTaskById(Number(id))
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  if (task.user_id !== Number(session.user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const deleted = await deleteTask(Number(id))
  if (!deleted) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}

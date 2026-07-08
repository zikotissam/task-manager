import { NextRequest, NextResponse } from 'next/server'
import { getTaskById, updateTask, deleteTask } from '@/lib/db'
import type { UpdateTaskInput } from '@/types'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const task = await getTaskById(Number(id))
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  return NextResponse.json(task)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body: UpdateTaskInput = await request.json()
  const task = await updateTask(Number(id), body)
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  return NextResponse.json(task)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const deleted = await deleteTask(Number(id))
  if (!deleted) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}

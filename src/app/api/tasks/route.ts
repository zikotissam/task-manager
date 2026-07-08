import { NextRequest, NextResponse } from 'next/server'
import { getAllTasks, createTask, searchTasks } from '@/lib/db'
import type { CreateTaskInput } from '@/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  const tasks = q ? await searchTasks(q) : await getAllTasks()
  return NextResponse.json(tasks)
}

export async function POST(request: NextRequest) {
  const body: CreateTaskInput = await request.json()

  if (!body.title || body.title.trim().length === 0) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  const task = await createTask(body)
  return NextResponse.json(task, { status: 201 })
}

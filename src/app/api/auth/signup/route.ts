import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { createUser, getUserByEmail } from "@/lib/db"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, email, password } = body

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
  }

  const existing = await getUserByEmail(email)
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 })
  }

  const password_hash = await hash(password, 12)
  const user = await createUser(name, email, password_hash)

  return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 })
}

import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { createUser, getUserByEmail } from "@/lib/db"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { name?: string; email?: string; password?: string }
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const existing = await getUserByEmail(email)
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    const password_hash = await hash(password, 12)
    const user = await createUser(name, email, password_hash)

    return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 })
  } catch (e) {
    console.error("POST /api/auth/signup failed:", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

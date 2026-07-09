import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { getUserByEmail, createUser } from "./db"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials.email as string
        const password = credentials.password as string

        const user = await getUserByEmail(email)
        if (!user || !user.password_hash) return null

        const isValid = await compare(password, user.password_hash)
        if (!isValid) return null

        return { id: String(user.id), email: user.email, name: user.name }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user?.email) {
        let localUser = await getUserByEmail(user.email)
        if (!localUser) {
          localUser = await createUser(user.name ?? "", user.email, "")
        }
        token.id = String(localUser.id)
      } else if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})

import type { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'

import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Senha', type: 'password' },
      },
      authorize: async (credentials) => {
        const email = credentials?.email
        const password = credentials?.password
        if (!email || !password) return null

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user?.passwordHash) return null

        const passwordValid = await bcrypt.compare(password, user.passwordHash)
        if (!passwordValid) return null

        // Only return safe fields (avoid exposing passwordHash)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          bio: user.bio,
        } as any
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      // When using credentials, `user` is available on the initial sign-in.
      if (user) {
        token.id = user.id
        token.bio = user.bio
      }
      return token
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token?.id as string | undefined
        session.user.bio = token?.bio as string | null | undefined
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export const handler = NextAuth(authOptions)


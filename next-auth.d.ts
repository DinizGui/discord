import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user?: {
      id?: string
      bio?: string | null
    } & DefaultSession['user']
  }
}


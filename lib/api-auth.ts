import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'

export async function requireSessionUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  const id = (session?.user as { id?: string } | undefined)?.id
  return id ?? null
}

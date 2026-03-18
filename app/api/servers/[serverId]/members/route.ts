import { NextResponse } from 'next/server'

import { requireSessionUserId } from '@/lib/api-auth'
import { dbUserToChatUser } from '@/lib/chat-types'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ serverId: string }> },
) {
  const userId = await requireSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { serverId } = await params
  const me = await prisma.serverMember.findUnique({
    where: { serverId_userId: { serverId, userId } },
  })
  if (!me) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const members = await prisma.serverMember.findMany({
    where: { serverId },
    include: { user: true },
    orderBy: { joinedAt: 'asc' },
  })

  return NextResponse.json({
    members: members.map((m) => dbUserToChatUser(m.user)),
  })
}

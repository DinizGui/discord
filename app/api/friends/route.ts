import { NextResponse } from 'next/server'

import { requireSessionUserId } from '@/lib/api-auth'
import { dbUserToChatUser } from '@/lib/chat-types'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const userId = await requireSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [{ userAId: userId }, { userBId: userId }],
    },
    include: { userA: true, userB: true },
  })

  const friends = friendships.map((f) => {
    const other = f.userAId === userId ? f.userB : f.userA
    return dbUserToChatUser(other)
  })

  const incoming = await prisma.friendRequest.findMany({
    where: { receiverId: userId, status: 'PENDING' },
    include: { sender: true },
    orderBy: { createdAt: 'desc' },
  })

  const outgoing = await prisma.friendRequest.findMany({
    where: { senderId: userId, status: 'PENDING' },
    select: { receiverId: true },
  })

  return NextResponse.json({
    friends,
    pendingIncoming: incoming.map((r) => ({
      id: r.id,
      user: dbUserToChatUser(r.sender),
    })),
    pendingOutgoing: outgoing.map((r) => r.receiverId),
  })
}

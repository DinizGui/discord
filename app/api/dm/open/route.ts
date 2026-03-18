import { NextResponse } from 'next/server'

import { requireSessionUserId } from '@/lib/api-auth'
import { orderedPair } from '@/lib/chat-types'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const userId = await requireSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { peerId?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const peerId = body.peerId?.trim()
  if (!peerId || peerId === userId) {
    return NextResponse.json({ error: 'peerId inválido' }, { status: 400 })
  }

  const [a, b] = orderedPair(userId, peerId)
  const friend = await prisma.friendship.findUnique({
    where: { userAId_userBId: { userAId: a, userBId: b } },
  })
  if (!friend) {
    return NextResponse.json({ error: 'Apenas amigos podem conversar por DM' }, { status: 403 })
  }

  let conv = await prisma.dmConversation.findUnique({
    where: { user1Id_user2Id: { user1Id: a, user2Id: b } },
  })
  if (!conv) {
    conv = await prisma.dmConversation.create({
      data: { user1Id: a, user2Id: b },
    })
  }

  return NextResponse.json({ conversationId: conv.id })
}

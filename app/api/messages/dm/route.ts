import { NextResponse } from 'next/server'

import { requireSessionUserId } from '@/lib/api-auth'
import type { ChatMessage } from '@/lib/chat-types'
import { prisma } from '@/lib/prisma'

async function assertDmMember(userId: string, conversationId: string) {
  const c = await prisma.dmConversation.findUnique({
    where: { id: conversationId },
  })
  if (!c) return null
  if (c.user1Id !== userId && c.user2Id !== userId) return null
  return c
}

export async function GET(req: Request) {
  const userId = await requireSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const conversationId = new URL(req.url).searchParams.get('conversationId') || ''
  if (!conversationId) {
    return NextResponse.json({ error: 'conversationId obrigatório' }, { status: 400 })
  }

  if (!(await assertDmMember(userId, conversationId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const rows = await prisma.dmMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    take: 200,
    include: { sender: true },
  })

  const messages: ChatMessage[] = rows.map((m) => ({
    id: m.id,
    channelId: `dm-${conversationId}`,
    userId: m.senderId,
    content: m.content,
    timestamp: m.createdAt,
    authorName: m.sender.name ?? m.sender.email ?? 'Usuário',
    authorAvatar: m.sender.image ?? undefined,
  }))

  return NextResponse.json({ messages })
}

export async function POST(req: Request) {
  const userId = await requireSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { conversationId?: string; content?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const conversationId = body.conversationId?.trim()
  const content = (body.content || '').trim()
  if (!conversationId || !content || content.length > 4000) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  if (!(await assertDmMember(userId, conversationId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const m = await prisma.dmMessage.create({
    data: { conversationId, senderId: userId, content },
    include: { sender: true },
  })

  const message: ChatMessage = {
    id: m.id,
    channelId: `dm-${conversationId}`,
    userId: m.senderId,
    content: m.content,
    timestamp: m.createdAt,
    authorName: m.sender.name ?? m.sender.email ?? 'Usuário',
    authorAvatar: m.sender.image ?? undefined,
  }

  return NextResponse.json({ message })
}

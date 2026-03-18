import { NextResponse } from 'next/server'

import { requireSessionUserId } from '@/lib/api-auth'
import type { ChatMessage } from '@/lib/chat-types'
import { prisma } from '@/lib/prisma'

async function canAccessChannel(userId: string, channelId: string) {
  const ch = await prisma.channel.findUnique({
    where: { id: channelId },
    include: { server: true },
  })
  if (!ch) return null
  const mem = await prisma.serverMember.findUnique({
    where: { serverId_userId: { serverId: ch.serverId, userId } },
  })
  return mem ? ch : null
}

export async function GET(req: Request) {
  const userId = await requireSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const channelId = new URL(req.url).searchParams.get('channelId') || ''
  if (!channelId) {
    return NextResponse.json({ error: 'channelId obrigatório' }, { status: 400 })
  }

  const access = await canAccessChannel(userId, channelId)
  if (!access) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const rows = await prisma.channelMessage.findMany({
    where: { channelId },
    orderBy: { createdAt: 'asc' },
    take: 200,
    include: { user: true },
  })

  const messages: ChatMessage[] = rows.map((m) => ({
    id: m.id,
    channelId: m.channelId,
    userId: m.userId,
    content: m.content,
    timestamp: m.createdAt,
    authorName: m.user.name ?? m.user.email ?? 'Usuário',
    authorAvatar: m.user.image ?? undefined,
  }))

  return NextResponse.json({ messages })
}

export async function POST(req: Request) {
  const userId = await requireSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { channelId?: string; content?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const channelId = body.channelId?.trim()
  const content = (body.content || '').trim()
  if (!channelId || !content || content.length > 4000) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const access = await canAccessChannel(userId, channelId)
  if (!access) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const m = await prisma.channelMessage.create({
    data: { channelId, userId, content },
    include: { user: true },
  })

  const message: ChatMessage = {
    id: m.id,
    channelId: m.channelId,
    userId: m.userId,
    content: m.content,
    timestamp: m.createdAt,
    authorName: m.user.name ?? m.user.email ?? 'Usuário',
    authorAvatar: m.user.image ?? undefined,
  }

  return NextResponse.json({ message })
}

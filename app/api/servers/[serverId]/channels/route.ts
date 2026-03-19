import { NextResponse } from 'next/server'

import { requireSessionUserId } from '@/lib/api-auth'
import type { ChatChannel } from '@/lib/chat-types'
import { prisma } from '@/lib/prisma'

async function assertMember(serverId: string, userId: string) {
  return prisma.serverMember.findUnique({
    where: { serverId_userId: { serverId, userId } },
  })
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ serverId: string }> },
) {
  const userId = await requireSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { serverId } = await params
  if (!(await assertMember(serverId, userId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const rows = await prisma.channel.findMany({
    where: { serverId },
    orderBy: { createdAt: 'asc' },
  })

  const channels: ChatChannel[] = rows.map((c) => ({
    id: c.id,
    serverId: c.serverId,
    name: c.name,
    type: (c.type === 'voice' ? 'voice' : 'text') as 'text' | 'voice',
    description: c.description ?? undefined,
  }))

  return NextResponse.json({ channels })
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> },
) {
  const userId = await requireSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { serverId } = await params
  if (!(await assertMember(serverId, userId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: { name?: string; description?: string; type?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const raw = (body.name || '').trim().toLowerCase().replace(/\s+/g, '-')
  if (!raw || raw.length > 50) {
    return NextResponse.json({ error: 'Nome do canal inválido' }, { status: 400 })
  }

  const chType = body.type === 'voice' ? 'voice' : 'text'

  const c = await prisma.channel.create({
    data: {
      serverId,
      name: raw,
      type: chType,
      description: body.description?.trim() || null,
    },
  })

  const channel: ChatChannel = {
    id: c.id,
    serverId: c.serverId,
    name: c.name,
    type: (c.type === 'voice' ? 'voice' : 'text') as 'text' | 'voice',
    description: c.description ?? undefined,
  }

  return NextResponse.json({ channel })
}

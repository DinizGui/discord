import { NextResponse } from 'next/server'

import { requireSessionUserId } from '@/lib/api-auth'
import type { ChatServer } from '@/lib/chat-types'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const userId = await requireSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const memberships = await prisma.serverMember.findMany({
    where: { userId },
    include: {
      server: true,
    },
    orderBy: { joinedAt: 'asc' },
  })

  const servers: ChatServer[] = await Promise.all(
    memberships.map(async (m) => {
      const count = await prisma.serverMember.count({
        where: { serverId: m.server.id },
      })
      return {
        id: m.server.id,
        name: m.server.name,
        icon:
          m.server.icon ??
          `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(m.server.name)}`,
        ownerId: m.server.ownerId,
        memberCount: count,
        description: m.server.description ?? undefined,
      }
    }),
  )

  return NextResponse.json({ servers })
}

export async function POST(req: Request) {
  const userId = await requireSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { name?: string; description?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const name = (body.name || '').trim()
  if (!name || name.length > 80) {
    return NextResponse.json({ error: 'Nome inválido' }, { status: 400 })
  }

  const description = body.description?.trim()

  const server = await prisma.$transaction(async (tx) => {
    const s = await tx.server.create({
      data: {
        name,
        description: description || null,
        ownerId: userId,
        icon: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(name)}`,
      },
    })
    await tx.serverMember.create({
      data: { serverId: s.id, userId },
    })
    await tx.channel.create({
      data: {
        serverId: s.id,
        name: 'geral',
        type: 'text',
        description: 'Canal geral',
      },
    })
    await tx.channel.create({
      data: {
        serverId: s.id,
        name: 'voz',
        type: 'voice',
        description: 'Canal de voz',
      },
    })
    return s
  })

  const memberCount = 1
  const chatServer: ChatServer = {
    id: server.id,
    name: server.name,
    icon: server.icon ?? '',
    ownerId: server.ownerId,
    memberCount,
    description: server.description ?? undefined,
  }

  return NextResponse.json({ server: chatServer })
}

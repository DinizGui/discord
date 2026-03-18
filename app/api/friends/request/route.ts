import { NextResponse } from 'next/server'

import { requireSessionUserId } from '@/lib/api-auth'
import { orderedPair } from '@/lib/chat-types'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const userId = await requireSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { toUserId?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const toUserId = body.toUserId?.trim()
  if (!toUserId || toUserId === userId) {
    return NextResponse.json({ error: 'Usuário inválido' }, { status: 400 })
  }

  const target = await prisma.user.findUnique({ where: { id: toUserId } })
  if (!target) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  }

  const [a, b] = orderedPair(userId, toUserId)
  const existingFriend = await prisma.friendship.findUnique({
    where: { userAId_userBId: { userAId: a, userBId: b } },
  })
  if (existingFriend) {
    return NextResponse.json({ error: 'Já são amigos' }, { status: 400 })
  }

  const reverse = await prisma.friendRequest.findFirst({
    where: {
      senderId: toUserId,
      receiverId: userId,
      status: 'PENDING',
    },
  })
  if (reverse) {
    return NextResponse.json(
      { error: 'Essa pessoa já te enviou um pedido. Aceite nas notificações.' },
      { status: 400 },
    )
  }

  const existing = await prisma.friendRequest.findUnique({
    where: {
      senderId_receiverId: { senderId: userId, receiverId: toUserId },
    },
  })

  if (existing?.status === 'PENDING') {
    return NextResponse.json({ ok: true, alreadyPending: true })
  }

  if (existing?.status === 'REJECTED') {
    await prisma.friendRequest.update({
      where: { id: existing.id },
      data: { status: 'PENDING', createdAt: new Date() },
    })
    return NextResponse.json({ ok: true })
  }

  await prisma.friendRequest.create({
    data: { senderId: userId, receiverId: toUserId, status: 'PENDING' },
  })

  return NextResponse.json({ ok: true })
}

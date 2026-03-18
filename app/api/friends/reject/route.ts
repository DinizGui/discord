import { NextResponse } from 'next/server'

import { requireSessionUserId } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const userId = await requireSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { requestId?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const requestId = body.requestId?.trim()
  if (!requestId) {
    return NextResponse.json({ error: 'requestId obrigatório' }, { status: 400 })
  }

  const fr = await prisma.friendRequest.findUnique({
    where: { id: requestId },
  })
  if (!fr || fr.receiverId !== userId || fr.status !== 'PENDING') {
    return NextResponse.json({ error: 'Pedido inválido' }, { status: 400 })
  }

  await prisma.friendRequest.update({
    where: { id: fr.id },
    data: { status: 'REJECTED' },
  })

  return NextResponse.json({ ok: true })
}

import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const name = (searchParams.get('name') || '').trim()

  if (!name) {
    return NextResponse.json({ results: [] })
  }

  // Search by `name` substring, case-insensitive.
  // Prisma: `contains` does not support `mode: 'insensitive'` for all versions,
  // so we use `mode: 'insensitive'` which should work in modern prisma.
  const users = await prisma.user.findMany({
    where: {
      name: {
        contains: name,
        mode: 'insensitive',
      },
    },
    take: 10,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
    },
    orderBy: { name: 'asc' },
  })

  // Map DB shape into your UI's expected `mock-data.ts` shape.
  const results = users.map((u) => ({
    id: u.id,
    name: u.name ?? u.email ?? 'Usuário',
    email: u.email ?? '',
    avatar: u.image ?? '',
    status: 'online',
    bio: u.bio ?? undefined,
  }))

  return NextResponse.json({ results })
}


import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

const RegisterSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = RegisterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.errors[0]?.message ?? 'Dados inválidos' },
        { status: 400 },
      )
    }

    const { name, email, password } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ message: 'Este email já está em uso' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        image: null,
        bio: null,
      },
    })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao criar usuário'
    // Ajuda a depurar durante desenvolvimento (não expõe stack trace).
    // Em produção, considere remover/ocultar detalhes.
    if (process.env.NODE_ENV !== 'production') {
      console.error('[register] failed:', err)
      return NextResponse.json({ message }, { status: 500 })
    }
    return NextResponse.json({ message: 'Erro ao criar usuário' }, { status: 500 })
  }
}


'use client'

import { useReducedMotion, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { MessageSquare, Radio, Shield, Sparkles } from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'Conversa em tempo real',
    description: 'Troque mensagens com fluidez em canais organizados para cada comunidade.',
  },
  {
    icon: Shield,
    title: 'Comunidades privadas',
    description: 'Crie espaços exclusivos com controle de acesso e identidade própria.',
  },
  {
    icon: Radio,
    title: 'Experiência viva',
    description: 'Presença online, interação rápida e sensação de ambiente sempre ativo.',
  },
  {
    icon: Sparkles,
    title: 'Visual moderno',
    description: 'Uma interface premium, envolvente e pensada para destacar sua comunidade.',
  },
]

export function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">
      <BackgroundEffects />
      <Header />
      <Hero />
      <Features />
      <PreviewSection />
      <FinalCta />
    </main>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
            <span className="text-sm font-bold tracking-wide">F</span>
          </div>
          <span className="text-sm font-semibold tracking-[0.2em] text-zinc-200 uppercase">
            Aura
          </span>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-zinc-300 transition hover:text-white">
            Recursos
          </a>
          <a href="#preview" className="text-sm text-zinc-300 transition hover:text-white">
            Preview
          </a>
          <Link
            href="/login"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Entrar
          </Link>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  const reduceMotion = useReducedMotion() ?? false

  return (
    <section className="relative px-6 pb-24 pt-20 md:pb-32 md:pt-28">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-sm text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Comunidades em tempo real
          </div>

          <h1 className="max-w-3xl text-5xl font-black tracking-tight text-white md:text-7xl">
            Um novo jeito de criar
            <motion.span
              className="block bg-gradient-to-r from-emerald-300 via-cyan-300 to-zinc-100 bg-clip-text text-transparent"
              style={{ backgroundSize: '200% 100%' }}
              initial={reduceMotion ? undefined : { backgroundPosition: '0% 50%' }}
              animate={
                reduceMotion
                  ? undefined
                  : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }
              }
              transition={
                reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              conexões digitais
            </motion.span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl">
            Organize servidores, abra canais, converse com sua comunidade e transforme
            interação em presença real com uma interface moderna, intensa e viva.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:scale-[1.02]"
            >
              Criar conta
            </Link>
            <a
              href="#preview"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Ver interface
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-900/80 shadow-2xl backdrop-blur-xl">
            <div className="border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
              </div>
            </div>

            <div className="grid min-h-[480px] grid-cols-[88px_220px_1fr]">
              <div className="border-r border-white/10 bg-zinc-950/80 p-4">
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-12 w-12 rounded-2xl bg-white/6 ring-1 ring-white/10 transition hover:scale-105 hover:bg-white/10"
                    />
                  ))}
                </div>
              </div>

              <div className="border-r border-white/10 bg-zinc-900/60 p-4">
                <div className="mb-4 h-5 w-28 rounded bg-white/10" />
                <div className="space-y-3">
                  {['geral', 'networking', 'música', 'projetos'].map((channel) => (
                    <div
                      key={channel}
                      className={`rounded-xl px-3 py-2 text-sm ${
                        channel === 'networking'
                          ? 'bg-white/10 text-white'
                          : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      # {channel}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col bg-zinc-950/40 p-5">
                <div className="mb-6">
                  <div className="text-sm text-zinc-500">Canal ativo</div>
                  <div className="text-xl font-semibold text-white"># networking</div>
                </div>

                <div className="space-y-4">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                    <ChatBubble
                      name="Ana"
                      message="Alguém topa fechar uma collab pro próximo projeto?"
                    />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.06 }}>
                    <ChatBubble
                      name="Lucas"
                      message="Fecho demais. Também queria montar uma sala focada em música."
                      active
                    />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.12 }}>
                    <ChatBubble
                      name="Marina"
                      message="Dá pra criar um servidor só pra isso e separar por temas."
                    />
                  </motion.div>
                </div>

                <div className="mt-auto pt-8">
                  <TypingBubble />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Features() {
  const reduceMotion = useReducedMotion() ?? false

  return (
    <section id="features" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="text-sm font-medium uppercase tracking-[0.25em] text-zinc-500">
            Recursos
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
            Feito para comunidades que querem mais do que só conversar
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : index * 0.08 }}
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:-translate-y-1 hover:bg-white/[0.05]"
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -6,
                        boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 18px 42px rgba(0,0,0,0.35)',
                      }
                }
                whileTap={reduceMotion ? undefined : { scale: 0.99 }}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/8 text-emerald-300 ring-1 ring-white/10">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function PreviewSection() {
  const reduceMotion = useReducedMotion() ?? false

  return (
    <section id="preview" className="px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center"
        >
          <span className="text-sm font-medium uppercase tracking-[0.25em] text-zinc-500">
            Interface
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            Visual marcante, fluxo intuitivo e presença constante
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
            De canais organizados até interações em tempo real, cada área foi pensada
            para parecer viva, rápida e memorável.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/8 to-white/[0.02] p-4 backdrop-blur-xl"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-5">
              <div className="text-sm text-zinc-500">Membros ativos</div>
              <AnimatedNumber value={12400} format="k" reduceMotion={reduceMotion} />
            </div>
            <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-5">
              <div className="text-sm text-zinc-500">Mensagens hoje</div>
              <AnimatedNumber value={98000} format="k" reduceMotion={reduceMotion} />
            </div>
            <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-5 md:col-span-2">
              <div className="text-sm text-zinc-500">Ambientes criados para crescer</div>
              <div className="mt-4 h-40 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(16,185,129,0.12),transparent)]" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="px-6 pb-24 pt-12">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-white/10 bg-white/[0.04] px-8 py-14 text-center backdrop-blur-xl">
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
          Sua comunidade merece um espaço à altura
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Crie servidores, organize canais, conecte pessoas e transforme conversas em algo memorável.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:scale-[1.02]"
          >
            Começar agora
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Já tenho conta
          </Link>
        </div>
      </div>
    </section>
  )
}

function ChatBubble({
  name,
  message,
  active = false,
}: {
  name: string
  message: string
  active?: boolean
}) {
  return (
    <div
      className={`max-w-[85%] rounded-2xl border px-4 py-3 ${
        active
          ? 'ml-auto border-emerald-400/20 bg-emerald-400/10'
          : 'border-white/10 bg-white/5'
      }`}
    >
      <div className="mb-1 text-xs font-medium text-zinc-500">{name}</div>
      <div className="text-sm leading-relaxed text-zinc-200">{message}</div>
    </div>
  )
}

function AnimatedNumber({
  value,
  reduceMotion,
  format,
}: {
  value: number
  reduceMotion: boolean
  format: 'k' | 'raw'
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [shownValue, setShownValue] = useState(0)

  const formatted = useMemo(() => {
    if (format === 'raw') return shownValue.toLocaleString('pt-BR')
    // "k" format: 12.4k style
    if (shownValue >= 1000) {
      const k = shownValue / 1000
      const isInteger = Math.abs(k - Math.round(k)) < 1e-8
      const digits = k >= 10 ? (isInteger ? 0 : 1) : isInteger ? 0 : 2
      return `${k.toFixed(digits).replace('.', ',')}k`
    }
    return shownValue.toString()
  }, [format, shownValue])

  useEffect(() => {
    if (reduceMotion) {
      setShownValue(value)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return

        const start = performance.now()
        const duration = 950

        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          // easeOutCubic
          const eased = 1 - Math.pow(1 - t, 3)
          setShownValue(Math.round(value * eased))
          if (t < 1) requestAnimationFrame(tick)
        }

        requestAnimationFrame(tick)
        observer.disconnect()
      },
      { threshold: 0.35 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [reduceMotion, value])

  return (
    <div ref={ref} className="mt-3 text-4xl font-black text-white">
      {formatted}
    </div>
  )
}

function TypingBubble() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-500">
      <span className="inline-flex items-center gap-1">
        Envie uma mensagem
        {!reduceMotion && (
          <motion.span
            aria-hidden
            className="inline-flex"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="mx-[1px]">.</span>
            <motion.span
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
            >
              .
            </motion.span>
            <motion.span
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            >
              .
            </motion.span>
          </motion.span>
        )}
        {reduceMotion && <span aria-hidden>...</span>}
      </span>
    </div>
  )
}

function BackgroundEffects() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      animate={reduceMotion ? undefined : { opacity: [0.95, 1, 0.95] }}
      transition={reduceMotion ? undefined : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.div
        className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-3xl"
        animate={reduceMotion ? undefined : { y: [0, -22, 0], x: [0, 16, 0] }}
        transition={reduceMotion ? undefined : { duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[-10%] top-[15%] h-[380px] w-[380px] rounded-full bg-cyan-500/10 blur-3xl"
        animate={reduceMotion ? undefined : { y: [0, 18, 0], x: [0, -12, 0] }}
        transition={reduceMotion ? undefined : { duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-12%] left-[25%] h-[340px] w-[340px] rounded-full bg-white/5 blur-3xl"
        animate={reduceMotion ? undefined : { y: [0, 14, 0] }}
        transition={reduceMotion ? undefined : { duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.12]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />
    </motion.div>
  )
}
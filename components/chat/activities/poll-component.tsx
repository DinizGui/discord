'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, CheckCircle2 } from 'lucide-react'
import type { PollActivity } from '@/lib/chat-activities'
import { SoftCard } from '@/components/ui/soft-card'

export function PollComponent({
  poll,
  onVote,
}: {
  poll: PollActivity
  onVote?: (optionId: string) => void
}) {
  const [local, setLocal] = useState<PollActivity>(() => ({ ...poll, options: poll.options.map((o) => ({ ...o })) }))
  const [voted, setVoted] = useState<string | null>(null)

  const total = local.options.reduce((s, o) => s + o.votes, 0)

  const vote = useCallback(
    (optionId: string) => {
      if (voted) return
      setVoted(optionId)
      setLocal((p) => ({
        ...p,
        options: p.options.map((o) =>
          o.id === optionId ? { ...o, votes: o.votes + 1 } : o,
        ),
      }))
      onVote?.(optionId)
    },
    [voted, onVote],
  )

  return (
    <SoftCard hover={false} className="border-cyan-500/15 bg-gradient-to-br from-cyan-950/40 to-zinc-900/90">
      <div className="mb-4 flex items-center gap-2 text-cyan-400">
        <BarChart3 className="h-5 w-5" />
        <span className="text-xs font-bold uppercase tracking-wider">Enquete</span>
      </div>
      <p className="mb-4 text-base font-medium text-zinc-100">{local.question}</p>
      <div className="flex flex-col gap-2">
        {local.options.map((opt, i) => {
          const pct = total ? Math.round((opt.votes / total) * 100) : 0
          const isVoted = voted === opt.id
          return (
            <motion.button
              key={opt.id}
              type="button"
              disabled={Boolean(voted)}
              onClick={() => vote(opt.id)}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-950/50 py-3 pl-4 pr-4 text-left transition hover:border-cyan-500/30 disabled:cursor-default"
            >
              <div
                className="absolute inset-y-0 left-0 bg-cyan-500/20 transition-all duration-500"
                style={{ width: `${voted ? pct : 0}%` }}
              />
              <div className="relative flex items-center justify-between gap-2">
                <span className="text-sm text-zinc-200">{opt.label}</span>
                {voted && (
                  <span className="flex items-center gap-1 text-xs font-medium text-cyan-300">
                    {pct}%
                    {isVoted && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </span>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>
      {voted && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-center text-xs text-zinc-500"
        >
          {total} votos · atualização em tempo real (simulado)
        </motion.p>
      )}
    </SoftCard>
  )
}

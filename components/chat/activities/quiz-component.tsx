'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Trophy } from 'lucide-react'
import type { QuizActivity } from '@/lib/chat-activities'
import { SoftCard } from '@/components/ui/soft-card'

export function QuizComponent({ quiz }: { quiz: QuizActivity }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const [correct, setCorrect] = useState(0)

  const q = quiz.questions[idx]
  const isLast = idx >= quiz.questions.length - 1

  const pick = (choiceIndex: number) => {
    if (selected !== null) return
    setSelected(choiceIndex)
    const ok = choiceIndex === q.correctIndex
    if (ok) setCorrect((c) => c + 1)
    setTimeout(() => {
      if (isLast) {
        setDone(true)
      } else {
        setIdx((i) => i + 1)
        setSelected(null)
      }
    }, 900)
  }

  if (done) {
    return (
      <SoftCard hover={false} className="border-violet-500/20 bg-gradient-to-br from-violet-950/50 to-zinc-900/90 text-center">
        <Trophy className="mx-auto mb-3 h-10 w-10 text-amber-400" />
        <p className="text-lg font-semibold text-white">Quiz concluído!</p>
        <p className="mt-2 text-sm text-zinc-400">
          Você acertou {correct} de {quiz.questions.length}
        </p>
      </SoftCard>
    )
  }

  return (
    <SoftCard hover={false} className="border-violet-500/15 bg-gradient-to-br from-violet-950/40 to-zinc-900/90">
      <div className="mb-3 flex items-center gap-2 text-violet-400">
        <Brain className="h-5 w-5" />
        <span className="text-xs font-bold uppercase tracking-wider">Quiz</span>
        <span className="ml-auto text-xs text-zinc-500">
          {idx + 1}/{quiz.questions.length}
        </span>
      </div>
      <p className="mb-1 text-sm font-medium text-violet-200/90">{quiz.title}</p>
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mt-4"
        >
          <p className="mb-4 text-sm text-zinc-200">{q.prompt}</p>
          <div className="flex flex-col gap-2">
            {q.choices.map((c, i) => {
              const state =
                selected === null
                  ? 'idle'
                  : i === q.correctIndex
                    ? 'correct'
                    : selected === i
                      ? 'wrong'
                      : 'fade'
              return (
                <button
                  key={c}
                  type="button"
                  disabled={selected !== null}
                  onClick={() => pick(i)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                    state === 'idle'
                      ? 'border-white/10 bg-zinc-950/50 hover:border-violet-500/40'
                      : state === 'correct'
                        ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-200'
                        : state === 'wrong'
                          ? 'border-red-500/40 bg-red-500/10 text-red-200'
                          : 'border-white/5 opacity-40'
                  }`}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </SoftCard>
  )
}

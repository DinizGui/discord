'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Sparkles } from 'lucide-react'
import type { FriendProfile } from '@/lib/mock-friends-hub'
import { STATUS_LABELS } from '@/lib/mock-friends-hub'
import { SoftCard } from '@/components/ui/soft-card'

export function FriendModal({
  profile,
  onClose,
}: {
  profile: FriendProfile | null
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {profile && (
        <>
          <motion.button
            type="button"
            aria-label="Fechar"
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 z-[101] w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.92, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          >
            <SoftCard hover={false} className="relative overflow-hidden p-0">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 z-10 rounded-xl bg-zinc-800/80 p-2 text-zinc-400 transition hover:bg-zinc-700 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="h-28 bg-gradient-to-br from-violet-600/40 via-cyan-500/20 to-fuchsia-500/30" />
              <div className="-mt-12 flex flex-col items-center px-6 pb-6">
                <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-4 border-zinc-900 shadow-xl">
                  <Image src={profile.avatar} alt={profile.name} fill className="object-cover" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-white">{profile.name}</h2>
                <p className="mt-1 text-sm text-violet-300/90">{STATUS_LABELS[profile.status]}</p>
                <p className="mt-4 text-center text-sm leading-relaxed text-zinc-400">{profile.bio}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {profile.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300 ring-1 ring-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5 w-full">
                  <p className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    <Sparkles className="h-3 w-3" />
                    Interesses
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((s) => (
                      <span key={s} className="rounded-lg bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-200/90">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                {profile.link && (
                  <a
                    href={profile.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600/80 py-3 text-sm font-medium text-white transition hover:bg-violet-500"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {profile.linkLabel || 'Link'}
                  </a>
                )}
              </div>
            </SoftCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

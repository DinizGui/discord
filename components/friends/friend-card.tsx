'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { MessageCircle, UserPlus } from 'lucide-react'
import type { FriendProfile } from '@/lib/mock-friends-hub'
import { STATUS_LABELS } from '@/lib/mock-friends-hub'
import { cn } from '@/lib/utils'

const statusDot: Record<string, string> = {
  online: 'bg-emerald-400',
  offline: 'bg-zinc-500',
  busy: 'bg-amber-400',
  studying: 'bg-sky-400',
  open_to_chat: 'bg-violet-400',
}

export function FriendCard({
  profile,
  onMessage,
  onAdd,
  onOpenProfile,
  showAdd,
}: {
  profile: FriendProfile
  onMessage?: () => void
  onAdd?: () => void
  onOpenProfile: () => void
  showAdd?: boolean
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        'group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-zinc-900/50 p-4 shadow-lg transition',
        'hover:border-violet-500/20 hover:bg-zinc-900/80',
      )}
    >
      <button
        type="button"
        onClick={onOpenProfile}
        className="relative shrink-0"
      >
        <div className="h-12 w-12 overflow-hidden rounded-xl ring-2 ring-white/5 transition group-hover:ring-violet-500/30">
          <Image src={profile.avatar} alt={profile.name} width={48} height={48} className="object-cover" />
        </div>
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-zinc-900',
            statusDot[profile.status] ?? 'bg-zinc-500',
          )}
        />
      </button>
      <div className="min-w-0 flex-1 text-left">
        <button type="button" onClick={onOpenProfile} className="block w-full text-left">
          <span className="font-semibold text-zinc-100">{profile.name}</span>
          <p className="truncate text-xs text-zinc-500">{STATUS_LABELS[profile.status]}</p>
        </button>
        <div className="mt-2 flex flex-wrap gap-1">
          {profile.tags.slice(0, 3).map((t) => (
            <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-zinc-400">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="flex shrink-0 flex-col gap-2">
        {showAdd ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onAdd?.()
            }}
            className="flex items-center gap-1.5 rounded-xl bg-violet-600/90 px-3 py-2 text-xs font-medium text-white transition hover:bg-violet-500"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Adicionar
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onMessage?.()
            }}
            className="flex items-center gap-1.5 rounded-xl bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:bg-zinc-700"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Mensagem
          </button>
        )}
      </div>
    </motion.div>
  )
}

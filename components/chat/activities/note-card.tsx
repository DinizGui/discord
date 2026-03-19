'use client'

import { motion } from 'framer-motion'
import { Pin } from 'lucide-react'
import type { NoteActivity } from '@/lib/chat-activities'
import { SoftCard } from '@/components/ui/soft-card'

export function NoteCard({ note }: { note: NoteActivity }) {
  return (
    <SoftCard hover={false} className="border-amber-500/15 bg-gradient-to-br from-amber-950/25 to-zinc-900/90">
      <div className="mb-3 flex items-center gap-2 text-amber-400/90">
        <Pin className="h-5 w-5" />
        <span className="text-xs font-bold uppercase tracking-wider">Recado</span>
      </div>
      <p className="text-lg font-semibold text-zinc-100">
        {note.emoji ? `${note.emoji} ` : ''}
        {note.title}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{note.body}</p>
    </SoftCard>
  )
}

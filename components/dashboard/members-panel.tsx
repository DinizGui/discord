'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useApp } from '@/lib/app-context'
import type { ChatUser } from '@/lib/chat-types'
import { cn } from '@/lib/utils'
import { Users, Phone } from 'lucide-react'

export function MembersPanel() {
  const { selectedServer, currentUser, openVoiceCall } = useApp()
  const [members, setMembers] = useState<ChatUser[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedServer?.id) {
      setMembers([])
      return
    }
    let cancelled = false
    setLoading(true)
    void (async () => {
      const res = await fetch(`/api/servers/${selectedServer.id}/members`)
      if (cancelled) return
      if (res.ok) {
        const data = await res.json()
        setMembers((data.members as ChatUser[]) ?? [])
      } else {
        setMembers([])
      }
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [selectedServer?.id])

  if (!selectedServer) return null

  const hasMe = currentUser ? members.some((m) => m.id === currentUser.id) : false
  const merged = hasMe || !currentUser ? members : [currentUser, ...members]

  return (
    <aside className="hidden w-[300px] shrink-0 flex-col border-l border-white/[0.06] bg-zinc-950/50 lg:flex lg:rounded-l-2xl lg:shadow-lg">
      <div className="flex h-14 items-center gap-2 border-b border-white/[0.06] px-5">
        <Users className="h-4 w-4 text-violet-400/80" />
        <span className="text-sm font-semibold text-zinc-200">Membros</span>
        <span className="ml-auto text-xs text-zinc-500">{loading ? '…' : merged.length}</span>
      </div>

      <div className="custom-scrollbar flex flex-col gap-2 overflow-y-auto p-4">
        {merged.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 transition hover:border-white/[0.06] hover:bg-white/[0.03]"
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10">
              <Image
                src={member.avatar || '/placeholder.svg'}
                alt={member.name || 'member'}
                fill
                className="object-cover"
              />
              <div
                className={cn(
                  'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-zinc-950',
                  member.status === 'online' && 'bg-emerald-400',
                  member.status === 'away' && 'bg-amber-400',
                  member.status === 'busy' && 'bg-amber-500',
                  member.status === 'offline' && 'bg-zinc-600',
                )}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-zinc-200">{member.name}</div>
              <div className="text-xs capitalize text-zinc-500">{member.status}</div>
            </div>
            {member.id !== currentUser?.id && (
              <button
                type="button"
                title="Ligar"
                onClick={() =>
                  openVoiceCall({
                    kind: 'dm',
                    title: 'Chamada de voz',
                    subtitle: member.name,
                    peerName: member.name,
                    peerAvatar: member.avatar,
                  })
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 transition hover:bg-emerald-500/25"
              >
                <Phone className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </aside>
  )
}

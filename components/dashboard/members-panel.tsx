'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useApp } from '@/lib/app-context'
import type { ChatUser } from '@/lib/chat-types'
import { cn } from '@/lib/utils'
import { Users } from 'lucide-react'

export function MembersPanel() {
  const { selectedServer, currentUser } = useApp()
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
    <aside className="w-80 bg-surface-1 border-l border-border hidden lg:block">
      <div className="h-14 px-4 flex items-center gap-2 border-b border-border">
        <Users className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-semibold">Membros</span>
        <span className="text-xs text-muted-foreground ml-auto">
          {loading ? '…' : `${merged.length} no servidor`}
        </span>
      </div>

      <div className="p-3 flex flex-col gap-2">
        {merged.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 px-3 py-2 rounded-lg border border-transparent hover:border-border hover:bg-surface-2"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden">
              <Image
                src={member.avatar || '/placeholder.svg'}
                alt={member.name || 'member'}
                fill
                className="object-cover"
              />
              <div
                className={cn(
                  'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-surface-1',
                  member.status === 'online' && 'bg-online',
                  member.status === 'away' && 'bg-typing',
                  member.status === 'busy' && 'bg-destructive',
                  member.status === 'offline' && 'bg-offline',
                )}
              />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{member.name}</div>
              <div className="text-xs text-muted-foreground">{member.status}</div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

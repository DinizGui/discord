'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Users, UserPlus } from 'lucide-react'
import type { FriendProfile } from '@/lib/mock-friends-hub'
import { filterSuggestions } from '@/lib/mock-friends-hub'
import { FriendCard } from './friend-card'
import type { ChatUser } from '@/lib/chat-types'

export function FriendList({
  friends,
  onMessage,
  onAddFriend,
  onOpenProfile,
}: {
  friends: FriendProfile[]
  onMessage: (p: FriendProfile) => void
  onAddFriend: (p: FriendProfile) => void
  onOpenProfile: (p: FriendProfile) => void
}) {
  const [query, setQuery] = useState('')
  const friendIds = useMemo(() => new Set(friends.map((f) => f.id)), [friends])

  const online = friends.filter((f) => f.status === 'online' || f.status === 'open_to_chat')
  const offline = friends.filter((f) => f.status === 'offline' || f.status === 'busy' || f.status === 'studying')
  const suggestions = filterSuggestions(query, friendIds)

  const filterFriends = (list: FriendProfile[]) => {
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q)) ||
        f.interests.some((s) => s.toLowerCase().includes(q)),
    )
  }

  return (
    <div className="flex flex-col gap-6 px-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome ou interesse…"
          className="h-11 w-full rounded-2xl border border-white/[0.06] bg-zinc-900/60 pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none ring-violet-500/30 focus:ring-2"
        />
      </div>

      <button
        type="button"
        onClick={() => {
          /* abre painel de busca global — já temos input acima */
          document.querySelector<HTMLInputElement>('input[placeholder*="Buscar"]')?.focus()
        }}
        className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-violet-500/30 bg-violet-500/5 py-3 text-sm font-medium text-violet-300 transition hover:bg-violet-500/10"
      >
        <UserPlus className="h-4 w-4" />
        Adicionar amigo
      </button>

      <Section title="Online agora" icon={<Users className="h-4 w-4 text-emerald-400" />}>
        {filterFriends(online).length === 0 ? (
          <Empty text="Ninguém online com esse filtro." />
        ) : (
          filterFriends(online).map((p) => (
            <FriendCard
              key={p.id}
              profile={p}
              onMessage={() => onMessage(p)}
              onOpenProfile={() => onOpenProfile(p)}
            />
          ))
        )}
      </Section>

      <Section title="Offline / ocupados" icon={<Users className="h-4 w-4 text-zinc-500" />}>
        {filterFriends(offline).length === 0 ? (
          <Empty text="Lista vazia." />
        ) : (
          filterFriends(offline).map((p) => (
            <FriendCard
              key={p.id}
              profile={p}
              onMessage={() => onMessage(p)}
              onOpenProfile={() => onOpenProfile(p)}
            />
          ))
        )}
      </Section>

      <Section title="Sugestões para você" icon={<span className="text-violet-400">✦</span>}>
        <p className="mb-3 text-[11px] leading-relaxed text-zinc-500">
          Pessoas que talvez você queira conhecer — por enquanto são sugestões de demonstração.
        </p>
        {suggestions.length === 0 ? (
          <Empty text="Nenhuma sugestão para esse filtro." />
        ) : (
          suggestions.map((p) => (
            <FriendCard
              key={p.id}
              profile={p}
              showAdd
              onAdd={() => onAddFriend(p)}
              onOpenProfile={() => onOpenProfile(p)}
            />
          ))
        )}
      </Section>
    </div>
  )
}

function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center gap-2 px-1">
        {icon}
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">{title}</h3>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </motion.section>
  )
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-2xl border border-white/[0.04] bg-zinc-900/30 px-4 py-6 text-center text-xs text-zinc-500">{text}</p>
}

/** Converte amigos reais da API para FriendProfile */
export function mapChatUsersToProfiles(users: ChatUser[]): FriendProfile[] {
  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    avatar: u.avatar || '/placeholder.svg',
    status: u.status === 'offline' ? 'offline' : u.status === 'busy' ? 'busy' : 'online',
    tags: ['Amigos'],
    bio: u.bio || 'Na sua lista de amigos.',
    interests: ['Bate-papo', 'Comunidade'],
  }))
}

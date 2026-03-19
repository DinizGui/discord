'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useApp } from '@/lib/app-context'
import { FriendList, mapChatUsersToProfiles } from '@/components/friends/friend-list'
import { FriendModal } from '@/components/friends/friend-modal'
import type { FriendProfile } from '@/lib/mock-friends-hub'
import { cn } from '@/lib/utils'
import { AtSign, MessageSquare, Network, Zap } from 'lucide-react'

type Tab = 'network' | 'dms'

export function SocialSidebar() {
  const { friends, openDM, goDMs, goHome, currentView, selectedDM, sendFriendRequest } = useApp()
  const [tab, setTab] = useState<Tab>('network')
  const [modalProfile, setModalProfile] = useState<FriendProfile | null>(null)

  const profiles = useMemo(() => mapChatUsersToProfiles(friends), [friends])
  const activeDm = selectedDM?.id ?? null

  const profileToChatUser = (p: FriendProfile) => ({
    id: p.id,
    name: p.name,
    email: p.email,
    avatar: p.avatar,
    status: 'online' as const,
    bio: p.bio,
  })

  return (
    <>
      <div className="flex h-full flex-col overflow-hidden rounded-none border-0 bg-zinc-950/40 lg:rounded-2xl lg:border lg:border-white/[0.06] lg:shadow-xl">
        <div className="flex h-16 shrink-0 items-center gap-1 border-b border-white/[0.06] px-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15">
            <Zap className="h-4 w-4 text-violet-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-100">Amigos</p>
            <p className="truncate text-[10px] text-zinc-500">Lista e mensagens</p>
          </div>
        </div>

        <div className="flex gap-1 p-2">
          <TabBtn active={tab === 'network'} onClick={() => setTab('network')} icon={<Network className="h-3.5 w-3.5" />}>
            Lista
          </TabBtn>
          <TabBtn active={tab === 'dms'} onClick={() => { setTab('dms'); goDMs() }} icon={<MessageSquare className="h-3.5 w-3.5" />}>
            DMs
          </TabBtn>
          <button
            type="button"
            onClick={goHome}
            className={cn(
              'rounded-xl px-3 py-2 text-xs font-medium transition',
              currentView === 'home' && tab === 'network'
                ? 'bg-white/10 text-white'
                : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300',
            )}
          >
            Início
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar px-3 pb-4">
          {tab === 'network' ? (
            <FriendList
              friends={profiles}
              onMessage={(p) => {
                openDM(profileToChatUser(p))
                setTab('dms')
                goDMs()
              }}
              onAddFriend={(p) => {
                if (p.id.startsWith('sug-')) {
                  toast.message('Sugestão de demonstração', {
                    description: 'Esses perfis são exemplos. Com contas reais, o pedido de amizade funcionaria de verdade.',
                  })
                  return
                }
                void sendFriendRequest(profileToChatUser(p))
                toast.success('Pedido enviado')
              }}
              onOpenProfile={setModalProfile}
            />
          ) : (
            <DmList friends={friends} activeId={activeDm} onSelect={(u) => openDM(u)} />
          )}
        </div>
      </div>
      <FriendModal profile={modalProfile} onClose={() => setModalProfile(null)} />
    </>
  )
}

function TabBtn({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  icon: React.ReactNode
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-medium transition',
        active ? 'bg-violet-600/25 text-violet-200 ring-1 ring-violet-500/30' : 'text-zinc-500 hover:bg-white/5',
      )}
    >
      {icon}
      {children}
    </motion.button>
  )
}

function DmList({
  friends,
  activeId,
  onSelect,
}: {
  friends: { id: string; name: string; avatar: string; status: string }[]
  activeId: string | null
  onSelect: (u: import('@/lib/chat-types').ChatUser) => void
}) {
  if (friends.length === 0) {
    return (
      <div className="px-2 py-10 text-center">
        <AtSign className="mx-auto mb-3 h-10 w-10 text-zinc-600" />
        <p className="text-sm text-zinc-400">Nenhum amigo ainda</p>
        <p className="mt-1 text-xs text-zinc-600">Use a aba Rede para adicionar.</p>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-1 pt-2">
      {friends.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() =>
            onSelect({
              id: f.id,
              name: f.name,
              email: '',
              avatar: f.avatar,
              status: f.status as 'online',
            })
          }
          className={cn(
            'flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition',
            activeId === f.id ? 'bg-violet-500/15 ring-1 ring-violet-500/20' : 'hover:bg-white/[0.04]',
          )}
        >
          <div className="relative h-11 w-11 overflow-hidden rounded-xl">
            <Image src={f.avatar || '/placeholder.svg'} alt={f.name} fill className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-zinc-200">{f.name}</p>
            <p className="text-xs text-zinc-500">Mensagem direta</p>
          </div>
        </button>
      ))}
    </div>
  )
}

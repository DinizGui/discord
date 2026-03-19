'use client'

import { useMemo } from 'react'
import { useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'
import { Hash, Plus, ChevronDown, Users, Settings, Volume2 } from 'lucide-react'
import Image from 'next/image'

export function ChannelList() {
  const {
    selectedServer,
    selectedChannel,
    selectChannel,
    currentUser,
    serverChannels,
    channelsLoading,
    openCreateChannelModal,
  } = useApp()

  const textChannels = useMemo(
    () => serverChannels.filter((c) => c.type === 'text'),
    [serverChannels],
  )
  const voiceChannels = useMemo(
    () => serverChannels.filter((c) => c.type === 'voice'),
    [serverChannels],
  )

  if (!selectedServer) {
    return (
      <div className="flex h-full w-full min-w-[240px] max-w-[280px] flex-col border-r border-white/[0.06] bg-transparent">
        <div className="flex h-full items-center justify-center p-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-2">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Selecione um servidor</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full min-w-[240px] max-w-[280px] flex-col border-r border-white/[0.06] bg-transparent">
      <div className="group flex h-14 cursor-pointer items-center justify-between border-b border-border px-4 transition-colors hover:bg-surface-2">
        <h2 className="truncate font-semibold text-foreground">{selectedServer.name}</h2>
        <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto p-2">
        <div className="mb-4">
          <div className="group flex items-center justify-between px-2 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Canais de texto
            </span>
            <button
              type="button"
              onClick={() => openCreateChannelModal('text')}
              className="cursor-pointer opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Plus className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          </div>

          {channelsLoading ? (
            <div className="px-2 py-4 text-xs text-muted-foreground">Carregando…</div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {textChannels.map((channel, index) => (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => selectChannel(channel)}
                  className={cn(
                    'group/channel flex animate-fade-in items-center gap-2 rounded-md px-2 py-1.5 transition-all duration-150',
                    selectedChannel?.id === channel.id
                      ? 'bg-surface-3 text-foreground'
                      : 'text-muted-foreground hover:bg-surface-2 hover:text-foreground',
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <Hash className="h-5 w-5 shrink-0" />
                  <span className="truncate text-sm">{channel.name}</span>
                  <Settings className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover/channel:opacity-100" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="group flex items-center justify-between px-2 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Canais de voz
            </span>
            <button
              type="button"
              onClick={() => openCreateChannelModal('voice')}
              className="cursor-pointer opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Plus className="h-4 w-4 text-muted-foreground hover:text-emerald-400" />
            </button>
          </div>
          {voiceChannels.length === 0 && !channelsLoading ? (
            <p className="px-2 py-2 text-xs text-muted-foreground">
              Nenhum canal de voz. Crie um com + ou use um servidor novo (vem com “voz”).
            </p>
          ) : (
            <div className="flex flex-col gap-0.5">
              {voiceChannels.map((channel, index) => (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => selectChannel(channel)}
                  className={cn(
                    'flex animate-fade-in items-center gap-2 rounded-md px-2 py-1.5 transition-all duration-150',
                    selectedChannel?.id === channel.id
                      ? 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/25'
                      : 'text-muted-foreground hover:bg-surface-2 hover:text-foreground',
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <Volume2 className="h-5 w-5 shrink-0 text-emerald-500/80" />
                  <span className="truncate text-sm">{channel.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex h-14 items-center gap-2 border-t border-border bg-surface-2 px-2">
        <div className="relative shrink-0">
          <div className="h-9 w-9 overflow-hidden rounded-full">
            <Image
              src={currentUser?.avatar || '/placeholder.svg'}
              alt={currentUser?.name || 'user'}
              width={36}
              height={36}
              className="object-cover"
            />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{currentUser?.name}</div>
          <div className="truncate text-xs text-muted-foreground">{currentUser?.email}</div>
        </div>
      </div>
    </div>
  )
}

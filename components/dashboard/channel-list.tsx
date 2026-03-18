'use client'

import { useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'
import { Hash, Plus, ChevronDown, Users, Settings } from 'lucide-react'
import Image from 'next/image'

export function ChannelList() {
  const {
    selectedServer,
    selectedChannel,
    selectChannel,
    setModal,
    currentUser,
    serverChannels,
    channelsLoading,
  } = useApp()

  if (!selectedServer) {
    return (
      <div className="w-60 bg-surface-1 flex flex-col border-r border-border">
        <div className="p-4 flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">Selecione um servidor</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-60 bg-surface-1 flex flex-col border-r border-border">
      <div className="h-14 px-4 flex items-center justify-between border-b border-border hover:bg-surface-2 transition-colors cursor-pointer group">
        <h2 className="font-semibold text-foreground truncate">{selectedServer.name}</h2>
        <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        <div className="mb-4">
          <div className="flex items-center justify-between px-2 py-1.5 group">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Canais de texto
            </span>
            <button
              type="button"
              onClick={() => setModal('create-channel')}
              className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Plus className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          </div>

          {channelsLoading ? (
            <div className="px-2 py-4 text-xs text-muted-foreground">Carregando canais…</div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {serverChannels.map((channel, index) => (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => selectChannel(channel)}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-150 group/channel animate-fade-in',
                    selectedChannel?.id === channel.id
                      ? 'bg-surface-3 text-foreground'
                      : 'text-muted-foreground hover:bg-surface-2 hover:text-foreground',
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <Hash className="w-5 h-5 shrink-0" />
                  <span className="truncate text-sm">{channel.name}</span>
                  <Settings className="w-4 h-4 ml-auto opacity-0 group-hover/channel:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="h-14 px-2 flex items-center gap-2 bg-surface-2 border-t border-border">
        <div className="relative">
          <div className="w-9 h-9 rounded-full overflow-hidden">
            <Image
              src={currentUser?.avatar || '/placeholder.svg'}
              alt={currentUser?.name || 'user'}
              width={36}
              height={36}
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{currentUser?.name}</div>
          <div className="text-xs text-muted-foreground truncate">{currentUser?.email}</div>
        </div>
      </div>
    </div>
  )
}

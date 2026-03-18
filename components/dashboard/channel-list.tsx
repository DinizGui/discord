'use client'

import { useApp } from '@/lib/app-context'
import { getServerChannels, getOnlineMembers } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { Hash, Plus, ChevronDown, Users, Settings } from 'lucide-react'
import Image from 'next/image'

export function ChannelList() {
  const { selectedServer, selectedChannel, selectChannel, setModal, currentUser } = useApp()

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

  const channels = getServerChannels(selectedServer.id)
  const onlineMembers = getOnlineMembers(selectedServer.id)

  return (
    <div className="w-60 bg-surface-1 flex flex-col border-r border-border">
      {/* Server header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-border hover:bg-surface-2 transition-colors cursor-pointer group">
        <h2 className="font-semibold text-foreground truncate">{selectedServer.name}</h2>
        <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>

      {/* Channel list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {/* Text channels section */}
        <div className="mb-4">
          <div className="flex items-center justify-between px-2 py-1.5 group">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Canais de texto
            </span>
            <button
              onClick={() => setModal('create-channel')}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Plus className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          </div>

          <div className="flex flex-col gap-0.5">
            {channels.map((channel, index) => (
              <button
                key={channel.id}
                onClick={() => selectChannel(channel)}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-150 group/channel animate-fade-in",
                  selectedChannel?.id === channel.id
                    ? "bg-surface-3 text-foreground"
                    : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <Hash className="w-5 h-5 shrink-0" />
                <span className="truncate text-sm">{channel.name}</span>
                
                {/* Settings on hover */}
                <Settings className="w-4 h-4 ml-auto opacity-0 group-hover/channel:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Online members section */}
        <div>
          <div className="flex items-center px-2 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Online — {onlineMembers.length}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            {onlineMembers.slice(0, 5).map((member, index) => (
              <div
                key={member.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-surface-2 transition-colors cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 30 + 200}ms` }}
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <div className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface-1",
                    member.status === 'online' && "bg-online",
                    member.status === 'away' && "bg-typing",
                    member.status === 'busy' && "bg-destructive",
                    member.status === 'offline' && "bg-offline"
                  )} />
                </div>
                <span className="text-sm text-muted-foreground truncate">{member.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User info bar */}
      <div className="h-14 px-2 flex items-center gap-2 bg-surface-2 border-t border-border">
        <div className="relative">
          <div className="w-9 h-9 rounded-full overflow-hidden">
            <Image
              src={currentUser?.avatar || ''}
              alt={currentUser?.name || ''}
              width={36}
              height={36}
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-online border-2 border-surface-2" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{currentUser?.name}</p>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
        <button className="p-1.5 hover:bg-surface-3 rounded-md transition-colors">
          <Settings className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}

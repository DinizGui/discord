'use client'

import { useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'
import { LogOut, Plus, Settings, Zap } from 'lucide-react'
import Image from 'next/image'

export function ServerSidebar() {
  const { servers, selectedServer, selectServer, setModal, setView, logout } = useApp()

  return (
    <div className="flex w-[76px] shrink-0 flex-col items-center gap-3 border-r border-white/[0.06] bg-zinc-950/80 py-4 sm:w-[80px] sm:rounded-r-2xl sm:shadow-lg">
      {/* Aura logo (no "Home" navigation; Home lives in SecondarySidebar) */}
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200",
        "bg-primary/10 ring-1 ring-primary/20 cursor-pointer"
      )}>
        <Zap className="w-6 h-6 text-primary" />
      </div>

      {/* Divider */}
      <div className="w-8 h-[2px] bg-sidebar-border my-2" />

      {/* Server list */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar px-2">
        {servers.map((server, index) => (
          <div key={server.id} className="relative group">
            {/* Active indicator */}
            <div className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-1 rounded-r-full bg-foreground transition-all duration-200",
              selectedServer?.id === server.id ? "h-10" : "h-0 group-hover:h-5"
            )} />
            
            <button
              onClick={() => selectServer(server)}
              className={cn(
                "w-12 h-12 rounded-2xl overflow-hidden transition-all duration-200 hover:rounded-xl relative cursor-pointer",
                selectedServer?.id === server.id && "rounded-xl"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Image
                src={server.icon}
                alt={server.name}
                fill
                className="object-cover"
              />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-popover rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-border">
                <span className="text-sm font-medium text-popover-foreground">{server.name}</span>
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-popover" />
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Add server button */}
      <button
        onClick={() => setModal('create-server')}
        className="w-12 h-12 rounded-2xl flex items-center justify-center bg-surface-2 hover:bg-online/20 hover:rounded-xl transition-all duration-200 group border border-dashed border-border hover:border-online"
      >
        <Plus className="w-6 h-6 text-online transition-transform group-hover:rotate-90 duration-200" />
      </button>

      {/* Settings */}
      <button
        onClick={() => setView('profile')}
        className="w-12 h-12 rounded-2xl flex items-center justify-center bg-surface-2 hover:bg-surface-3 hover:rounded-xl transition-all duration-200 mt-2"
      >
        <Settings className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
      </button>

      {/* Logout */}
      <button
        onClick={logout}
        className="mt-2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl bg-zinc-900/80 transition-all hover:rounded-xl hover:bg-zinc-800"
        type="button"
      >
        <LogOut className="h-5 w-5 text-zinc-500 transition-colors hover:text-zinc-200" />
      </button>
    </div>
  )
}

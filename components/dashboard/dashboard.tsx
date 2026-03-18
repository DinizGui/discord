'use client'

import { ServerSidebar } from './server-sidebar'
import { ChatArea } from './chat-area'
import { SecondarySidebar } from './secondary-sidebar'
import { MembersPanel } from './members-panel'
import { DMView } from './dm-view'
import { useApp } from '@/lib/app-context'
import { Inbox, Hash } from 'lucide-react'

export function Dashboard() {
  const { currentView, selectedServer } = useApp()

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <ServerSidebar />

      <SecondarySidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {currentView === 'home' && (
          <div className="flex-1 flex items-center justify-center bg-background">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="w-20 h-20 rounded-3xl bg-surface-2 flex items-center justify-center mx-auto mb-6">
                <Inbox className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Nenhum servidor selecionado</h2>
              <p className="text-muted-foreground">
                Use a barra de servidores para entrar em um servidor, ou selecione um amigo para abrir uma DM.
              </p>
            </div>
          </div>
        )}

        {currentView === 'dm' && <DMView />}

        {currentView === 'server' && (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Server header (Discord-like context) */}
            {selectedServer && (
              <div className="h-14 px-4 flex items-center gap-3 border-b border-border shrink-0 bg-background">
                <Hash className="w-5 h-5 text-muted-foreground" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{selectedServer.name}</div>
                  <div className="text-xs text-muted-foreground">Canais do servidor</div>
                </div>
              </div>
            )}
            <ChatArea />
          </div>
        )}
      </main>

      {currentView === 'server' && selectedServer && <MembersPanel />}
    </div>
  )
}

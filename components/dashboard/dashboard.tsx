'use client'

import { ServerSidebar } from './server-sidebar'
import { ChatArea } from './chat-area'
import { VoiceRoom } from './voice-room'
import { SecondarySidebar } from './secondary-sidebar'
import { MembersPanel } from './members-panel'
import { DMView } from './dm-view'
import { useApp } from '@/lib/app-context'
import { AmbientGlow } from '@/components/ambient/ambient-glow'
import { Inbox, Hash } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Dashboard() {
  const { currentView, selectedServer, selectedChannel, voiceCall, closeVoiceCall } = useApp()

  return (
    <div className="relative flex h-screen overflow-hidden bg-zinc-950 p-0 sm:gap-3 sm:p-3">
      <AmbientGlow />

      <ServerSidebar />

      <SecondarySidebar />

      <motion.main
        layout
        className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-none border-0 bg-zinc-900/40 shadow-none sm:rounded-2xl sm:border sm:border-white/[0.06] sm:shadow-xl"
      >
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.22 }}
              className="flex flex-1 items-center justify-center px-6"
            >
              <div className="max-w-md text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 shadow-lg ring-1 ring-white/10">
                  <Inbox className="h-11 w-11 text-violet-300/80" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">Bem-vindo de volta</h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                  Veja seus <strong className="text-zinc-300">amigos</strong> ao lado, mande uma mensagem direta ou entre em um servidor pra conversar nos canais.
                </p>
              </div>
            </motion.div>
          )}

          {currentView === 'dm' && (
            <motion.div
              key="dm"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.22 }}
              className="flex min-h-0 flex-1 flex-col"
            >
              <DMView />
            </motion.div>
          )}

          {currentView === 'server' && (
            <motion.div
              key="server"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.22 }}
              className="flex min-h-0 flex-1 flex-col"
            >
              {selectedServer && selectedChannel && (
                <div className="flex h-14 shrink-0 items-center gap-3 border-b border-white/[0.06] px-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800/80">
                    <Hash className="h-4 w-4 text-cyan-400/90" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-100">
                      # {selectedChannel.name}
                    </p>
                    <p className="text-xs text-zinc-500">{selectedServer.name}</p>
                  </div>
                </div>
              )}

              <ChatArea />
            </motion.div>
          )}
        </AnimatePresence>

        {voiceCall && (
        <div className="pointer-events-auto fixed right-4 bottom-4 z-50 w-[360px] max-w-[95vw]">
          <div className="h-[260px] overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/80 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.85)] backdrop-blur">
              <VoiceRoom
                title={voiceCall.title}
                subtitle={voiceCall.subtitle}
                variant={voiceCall.kind}
                peerAvatar={voiceCall.peerAvatar}
                peerName={voiceCall.peerName}
                closeLabel="Sair da call"
                layout="dock"
                onClosePanel={closeVoiceCall}
              />
            </div>
          </div>
        )}
      </motion.main>

      {currentView === 'server' && selectedServer && <MembersPanel />}
    </div>
  )
}

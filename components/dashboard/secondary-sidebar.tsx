'use client'

import { useApp } from '@/lib/app-context'
import { ChannelList } from './channel-list'
import { SocialSidebar } from './social-sidebar'

export function SecondarySidebar() {
  const { currentView } = useApp()

  return (
    <aside className="flex w-[min(100%,380px)] shrink-0 flex-col gap-0 p-0 sm:p-3 sm:pl-0">
      {currentView === 'server' ? (
        <div className="flex h-full min-h-0 flex-1 overflow-hidden rounded-none border-0 bg-zinc-950/40 sm:rounded-2xl sm:border sm:border-white/[0.06] sm:shadow-xl">
          <ChannelList />
        </div>
      ) : (
        <SocialSidebar />
      )}
    </aside>
  )
}


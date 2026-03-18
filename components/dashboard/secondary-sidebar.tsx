'use client'

import { useApp } from '@/lib/app-context'
import { ChannelList } from './channel-list'
import { FriendsView } from './friends-view'

export function SecondarySidebar() {
  const { currentView } = useApp()

  return (
    <div className="w-72 bg-surface-1 flex flex-col border-r border-border">
      {currentView === 'server' ? <ChannelList /> : <FriendsView />}
    </div>
  )
}


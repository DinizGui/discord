'use client'

import { ServerSidebar } from './server-sidebar'
import { ChannelList } from './channel-list'
import { ChatArea } from './chat-area'

export function Dashboard() {
  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <ServerSidebar />
      <ChannelList />
      <ChatArea />
    </div>
  )
}

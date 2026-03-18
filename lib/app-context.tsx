'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { signOut, useSession } from 'next-auth/react'
import type { ChatUser, ChatServer, ChatChannel } from '@/lib/chat-types'
import { dbUserToChatUser } from '@/lib/chat-types'

type View = 'login' | 'register' | 'dashboard' | 'profile'
type Modal = 'none' | 'create-server' | 'create-channel' | 'server-settings' | 'user-settings'
type CurrentView = 'home' | 'dm' | 'server'

export interface PendingIncoming {
  id: string
  user: ChatUser
}

interface AppState {
  view: View
  modal: Modal
  isAuthenticated: boolean
  currentUser: ChatUser | null

  currentView: CurrentView
  selectedDM: ChatUser | null

  friends: ChatUser[]
  pendingOutgoing: string[]
  pendingIncoming: PendingIncoming[]
  sendFriendRequest: (target: ChatUser) => Promise<void>
  acceptFriendRequest: (requestId: string) => Promise<void>
  rejectFriendRequest: (requestId: string) => Promise<void>
  refreshFriends: () => Promise<void>

  serverChannels: ChatChannel[]
  channelsLoading: boolean

  selectedServer: ChatServer | null
  selectedChannel: ChatChannel | null
  servers: ChatServer[]
  serversLoading: boolean
  setView: (view: View) => void
  setModal: (modal: Modal) => void
  logout: () => void

  goHome: () => void
  goDMs: () => void
  openDM: (user: ChatUser) => void

  selectServer: (server: ChatServer | null) => void
  selectChannel: (channel: ChatChannel | null) => void
  addServer: (name: string, description?: string) => Promise<void>
  addChannel: (name: string, description?: string) => Promise<void>
  refreshServers: () => Promise<void>
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>('login')
  const [modal, setModal] = useState<Modal>('none')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<ChatUser | null>(null)
  const [currentView, setCurrentView] = useState<CurrentView>('home')
  const [selectedDM, setSelectedDM] = useState<ChatUser | null>(null)
  const [selectedServer, setSelectedServer] = useState<ChatServer | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<ChatChannel | null>(null)
  const [serverList, setServerList] = useState<ChatServer[]>([])
  const [serversLoading, setServersLoading] = useState(false)
  const [serverChannels, setServerChannels] = useState<ChatChannel[]>([])
  const [channelsLoading, setChannelsLoading] = useState(false)

  const [friends, setFriends] = useState<ChatUser[]>([])
  const [pendingOutgoing, setPendingOutgoing] = useState<string[]>([])
  const [pendingIncoming, setPendingIncoming] = useState<PendingIncoming[]>([])

  const { data: session, status } = useSession()

  const refreshServers = useCallback(async () => {
    setServersLoading(true)
    try {
      const res = await fetch('/api/servers')
      if (!res.ok) return
      const data = await res.json()
      setServerList((data.servers as ChatServer[]) ?? [])
    } finally {
      setServersLoading(false)
    }
  }, [])

  const refreshFriends = useCallback(async () => {
    try {
      const res = await fetch('/api/friends')
      if (!res.ok) return
      const data = await res.json()
      setFriends((data.friends as ChatUser[]) ?? [])
      setPendingOutgoing((data.pendingOutgoing as string[]) ?? [])
      setPendingIncoming((data.pendingIncoming as PendingIncoming[]) ?? [])
    } catch {
      /* ignore */
    }
  }, [])

  const loadChannels = useCallback(async (serverId: string) => {
    setChannelsLoading(true)
    try {
      const res = await fetch(`/api/servers/${serverId}/channels`)
      if (!res.ok) {
        setServerChannels([])
        return
      }
      const data = await res.json()
      const list = (data.channels as ChatChannel[]) ?? []
      setServerChannels(list)
      setSelectedChannel((prev) => {
        if (prev && list.some((c) => c.id === prev.id)) return prev
        return list[0] ?? null
      })
    } finally {
      setChannelsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const sessionUser = session.user as {
        id?: string
        name?: string | null
        email?: string | null
        image?: string | null
        bio?: string | null
      }

      const mappedUser: ChatUser = dbUserToChatUser({
        id: sessionUser.id ?? '',
        name: sessionUser.name ?? null,
        email: sessionUser.email ?? null,
        image: sessionUser.image ?? null,
        bio: sessionUser.bio,
      })

      if (!mappedUser.id) return

      setUser(mappedUser)
      setIsAuthenticated(true)
      setCurrentView('home')
      setSelectedDM(null)
      setSelectedServer(null)
      setSelectedChannel(null)
      setServerChannels([])
      setView((prev) => (prev === 'login' || prev === 'register' ? 'dashboard' : prev))

      void refreshServers()
      void refreshFriends()
    }

    if (status === 'unauthenticated') {
      setUser(null)
      setIsAuthenticated(false)
      setCurrentView('home')
      setSelectedDM(null)
      setSelectedServer(null)
      setSelectedChannel(null)
      setServerList([])
      setServerChannels([])
      setFriends([])
      setPendingOutgoing([])
      setPendingIncoming([])
      setView('login')
    }
  }, [status, session, refreshServers, refreshFriends])

  useEffect(() => {
    if (selectedServer?.id) {
      void loadChannels(selectedServer.id)
    } else {
      setServerChannels([])
      setSelectedChannel(null)
    }
  }, [selectedServer?.id, loadChannels])

  const logout = () => {
    void signOut({ redirect: false })
    setUser(null)
    setIsAuthenticated(false)
    setCurrentView('home')
    setSelectedDM(null)
    setSelectedServer(null)
    setSelectedChannel(null)
    setServerList([])
    setServerChannels([])
    setView('login')
  }

  const goHome = () => {
    setCurrentView('home')
    setSelectedDM(null)
    setSelectedServer(null)
    setSelectedChannel(null)
    setModal('none')
  }

  const goDMs = () => {
    setCurrentView('dm')
    setSelectedServer(null)
    setSelectedChannel(null)
    setModal('none')
  }

  const openDM = (dmUser: ChatUser) => {
    setCurrentView('dm')
    setSelectedDM(dmUser)
    setSelectedServer(null)
    setSelectedChannel(null)
    setModal('none')
  }

  const sendFriendRequest = async (target: ChatUser) => {
    if (!user?.id) return
    if (target.id === user.id) return
    if (friends.some((f) => f.id === target.id)) return
    if (pendingOutgoing.includes(target.id)) return

    const res = await fetch('/api/friends/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toUserId: target.id }),
    })
    if (res.ok) await refreshFriends()
  }

  const acceptFriendRequest = async (requestId: string) => {
    const res = await fetch('/api/friends/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId }),
    })
    if (res.ok) await refreshFriends()
  }

  const rejectFriendRequest = async (requestId: string) => {
    const res = await fetch('/api/friends/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId }),
    })
    if (res.ok) await refreshFriends()
  }

  const selectServer = (server: ChatServer | null) => {
    if (!server) {
      goHome()
      return
    }
    setCurrentView('server')
    setSelectedDM(null)
    setSelectedServer(server)
    setSelectedChannel(null)
    setModal('none')
  }

  const selectChannel = (channel: ChatChannel | null) => {
    setSelectedChannel(channel)
  }

  const addServer = async (name: string, description?: string) => {
    const res = await fetch('/api/servers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    })
    if (!res.ok) return
    const data = await res.json()
    const s = data.server as ChatServer
    if (s) {
      setServerList((prev) => [...prev, s])
      setSelectedServer(s)
      setSelectedChannel(null)
      setCurrentView('server')
      setSelectedDM(null)
      setModal('none')
      await loadChannels(s.id)
    }
  }

  const addChannel = async (name: string, description?: string) => {
    if (!selectedServer) return
    const res = await fetch(`/api/servers/${selectedServer.id}/channels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    })
    if (!res.ok) return
    const data = await res.json()
    const ch = data.channel as ChatChannel
    if (ch) {
      setServerChannels((prev) => [...prev, ch])
      setSelectedChannel(ch)
      setCurrentView('server')
      setModal('none')
    }
  }

  return (
    <AppContext.Provider
      value={{
        view,
        modal,
        isAuthenticated,
        currentUser: user,
        currentView,
        selectedDM,
        friends,
        pendingOutgoing,
        pendingIncoming,
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        refreshFriends,
        serverChannels,
        channelsLoading,
        selectedServer,
        selectedChannel,
        servers: serverList,
        serversLoading,
        setView,
        setModal,
        logout,
        goHome,
        goDMs,
        openDM,
        selectServer,
        selectChannel,
        addServer,
        addChannel,
        refreshServers,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

// Re-export types for components that imported from mock-data
export type { ChatUser as User, ChatServer as Server, ChatChannel as Channel } from '@/lib/chat-types'
export type { ChatMessage as Message } from '@/lib/chat-types'

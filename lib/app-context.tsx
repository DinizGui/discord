'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { servers, channels, currentUser, type Server, type Channel, type User } from './mock-data'

type View = 'login' | 'register' | 'dashboard' | 'profile'
type Modal = 'none' | 'create-server' | 'create-channel' | 'server-settings' | 'user-settings'

interface AppState {
  view: View
  modal: Modal
  isAuthenticated: boolean
  currentUser: User | null
  selectedServer: Server | null
  selectedChannel: Channel | null
  servers: Server[]
  setView: (view: View) => void
  setModal: (modal: Modal) => void
  login: (email: string, password: string) => void
  register: (name: string, email: string, password: string) => void
  logout: () => void
  selectServer: (server: Server | null) => void
  selectChannel: (channel: Channel | null) => void
  addServer: (name: string, description?: string) => void
  addChannel: (name: string, description?: string) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>('login')
  const [modal, setModal] = useState<Modal>('none')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [selectedServer, setSelectedServer] = useState<Server | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [serverList, setServerList] = useState<Server[]>(servers)

  const login = (email: string, password: string) => {
    // Mock login
    setUser(currentUser)
    setIsAuthenticated(true)
    setSelectedServer(serverList[0])
    const serverChannels = channels.filter(ch => ch.serverId === serverList[0].id)
    setSelectedChannel(serverChannels[0] || null)
    setView('dashboard')
  }

  const register = (name: string, email: string, password: string) => {
    // Mock register
    const newUser: User = {
      ...currentUser,
      name,
      email,
    }
    setUser(newUser)
    setIsAuthenticated(true)
    setSelectedServer(serverList[0])
    const serverChannels = channels.filter(ch => ch.serverId === serverList[0].id)
    setSelectedChannel(serverChannels[0] || null)
    setView('dashboard')
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setSelectedServer(null)
    setSelectedChannel(null)
    setView('login')
  }

  const selectServer = (server: Server | null) => {
    setSelectedServer(server)
    if (server) {
      const serverChannels = channels.filter(ch => ch.serverId === server.id)
      setSelectedChannel(serverChannels[0] || null)
    } else {
      setSelectedChannel(null)
    }
  }

  const selectChannel = (channel: Channel | null) => {
    setSelectedChannel(channel)
  }

  const addServer = (name: string, description?: string) => {
    const newServer: Server = {
      id: `server-${Date.now()}`,
      name,
      icon: `https://api.dicebear.com/7.x/shapes/svg?seed=${name}`,
      ownerId: user?.id || 'user-1',
      memberCount: 1,
      description
    }
    setServerList(prev => [...prev, newServer])
    setSelectedServer(newServer)
    setSelectedChannel(null)
    setModal('none')
  }

  const addChannel = (name: string, description?: string) => {
    if (!selectedServer) return
    
    const newChannel: Channel = {
      id: `ch-${Date.now()}`,
      serverId: selectedServer.id,
      name: name.toLowerCase().replace(/\s+/g, '-'),
      type: 'text',
      description
    }
    channels.push(newChannel)
    setSelectedChannel(newChannel)
    setModal('none')
  }

  return (
    <AppContext.Provider value={{
      view,
      modal,
      isAuthenticated,
      currentUser: user,
      selectedServer,
      selectedChannel,
      servers: serverList,
      setView,
      setModal,
      login,
      register,
      logout,
      selectServer,
      selectChannel,
      addServer,
      addChannel,
    }}>
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

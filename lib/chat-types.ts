/** UI shapes shared by dashboard (aligned with former mock-data). */

export interface ChatUser {
  id: string
  name: string
  email: string
  avatar: string
  status: 'online' | 'offline' | 'away' | 'busy'
  bio?: string
}

export interface ChatServer {
  id: string
  name: string
  icon: string
  ownerId: string
  memberCount: number
  description?: string
}

export interface ChatChannel {
  id: string
  serverId: string
  name: string
  type: 'text' | 'voice'
  description?: string
}

export interface ChatMessage {
  id: string
  channelId: string
  userId: string
  content: string
  timestamp: Date
  edited?: boolean
  authorName?: string
  authorAvatar?: string
}

export function dbUserToChatUser(u: {
  id: string
  name: string | null
  email: string | null
  image: string | null
  bio?: string | null
}): ChatUser {
  return {
    id: u.id,
    name: u.name ?? u.email ?? 'Usuário',
    email: u.email ?? '',
    avatar: u.image ?? '',
    status: 'online',
    bio: u.bio ?? undefined,
  }
}

export function orderedPair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a]
}

export function formatTimestamp(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  if (diff < 60000) return 'agora'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}min`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

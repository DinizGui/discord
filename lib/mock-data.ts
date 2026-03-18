// Mock data for Fiadaputins Chat

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  status: 'online' | 'offline' | 'away' | 'busy'
  bio?: string
}

export interface Server {
  id: string
  name: string
  icon: string
  ownerId: string
  memberCount: number
  description?: string
}

export interface Channel {
  id: string
  serverId: string
  name: string
  type: 'text' | 'voice'
  description?: string
}

export interface Message {
  id: string
  channelId: string
  userId: string
  content: string
  timestamp: Date
  edited?: boolean
}

// Current logged in user
export const currentUser: User = {
  id: 'user-1',
  name: 'Lucas Silva',
  email: 'lucas@nexus.chat',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas',
  status: 'online',
  bio: 'Full-stack developer apaixonado por tecnologia'
}

// Mock users
export const users: User[] = [
  currentUser,
  {
    id: 'user-2',
    name: 'Marina Costa',
    email: 'marina@nexus.chat',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marina',
    status: 'online',
    bio: 'Designer UI/UX'
  },
  {
    id: 'user-3',
    name: 'Pedro Almeida',
    email: 'pedro@nexus.chat',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro',
    status: 'away',
    bio: 'DevOps Engineer'
  },
  {
    id: 'user-4',
    name: 'Julia Santos',
    email: 'julia@nexus.chat',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julia',
    status: 'offline',
    bio: 'Product Manager'
  },
  {
    id: 'user-5',
    name: 'Rafael Oliveira',
    email: 'rafael@nexus.chat',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rafael',
    status: 'online',
    bio: 'Backend Developer'
  },
  {
    id: 'user-6',
    name: 'Camila Ferreira',
    email: 'camila@nexus.chat',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Camila',
    status: 'busy',
    bio: 'QA Engineer'
  }
]

// Mock servers
export const servers: Server[] = [
  {
    id: 'server-1',
    name: 'Tech Hub Brasil',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=TechHub',
    ownerId: 'user-1',
    memberCount: 1247,
    description: 'Comunidade de desenvolvedores brasileiros'
  },
  {
    id: 'server-2',
    name: 'Design System',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=Design',
    ownerId: 'user-2',
    memberCount: 543,
    description: 'Discussões sobre design systems e UI/UX'
  },
  {
    id: 'server-3',
    name: 'Open Source BR',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=OpenSource',
    ownerId: 'user-5',
    memberCount: 892,
    description: 'Projetos open source da comunidade brasileira'
  },
  {
    id: 'server-4',
    name: 'Startup Connect',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=Startup',
    ownerId: 'user-4',
    memberCount: 2156,
    description: 'Networking para empreendedores'
  }
]

// Mock channels per server
export const channels: Channel[] = [
  // Tech Hub Brasil channels
  { id: 'ch-1', serverId: 'server-1', name: 'boas-vindas', type: 'text', description: 'Apresente-se para a comunidade' },
  { id: 'ch-2', serverId: 'server-1', name: 'geral', type: 'text', description: 'Conversas gerais' },
  { id: 'ch-3', serverId: 'server-1', name: 'frontend', type: 'text', description: 'React, Vue, Angular e mais' },
  { id: 'ch-4', serverId: 'server-1', name: 'backend', type: 'text', description: 'Node, Python, Go e mais' },
  { id: 'ch-5', serverId: 'server-1', name: 'vagas', type: 'text', description: 'Oportunidades de trabalho' },
  { id: 'ch-6', serverId: 'server-1', name: 'off-topic', type: 'text', description: 'Assuntos diversos' },
  
  // Design System channels
  { id: 'ch-7', serverId: 'server-2', name: 'geral', type: 'text' },
  { id: 'ch-8', serverId: 'server-2', name: 'showcase', type: 'text', description: 'Mostre seus projetos' },
  { id: 'ch-9', serverId: 'server-2', name: 'feedback', type: 'text' },
  { id: 'ch-10', serverId: 'server-2', name: 'recursos', type: 'text' },
  
  // Open Source BR channels
  { id: 'ch-11', serverId: 'server-3', name: 'anuncios', type: 'text' },
  { id: 'ch-12', serverId: 'server-3', name: 'projetos', type: 'text' },
  { id: 'ch-13', serverId: 'server-3', name: 'contribuicoes', type: 'text' },
  { id: 'ch-14', serverId: 'server-3', name: 'ajuda', type: 'text' },
  
  // Startup Connect channels
  { id: 'ch-15', serverId: 'server-4', name: 'networking', type: 'text' },
  { id: 'ch-16', serverId: 'server-4', name: 'pitch-deck', type: 'text' },
  { id: 'ch-17', serverId: 'server-4', name: 'investidores', type: 'text' },
  { id: 'ch-18', serverId: 'server-4', name: 'eventos', type: 'text' },
]

// Mock messages
export const messages: Message[] = [
  {
    id: 'msg-1',
    channelId: 'ch-2',
    userId: 'user-2',
    content: 'Bom dia pessoal! Alguém mais está trabalhando com Next.js 16?',
    timestamp: new Date(Date.now() - 3600000 * 2)
  },
  {
    id: 'msg-2',
    channelId: 'ch-2',
    userId: 'user-5',
    content: 'Opa! Estou sim, o novo sistema de cache está muito bom',
    timestamp: new Date(Date.now() - 3600000 * 1.5)
  },
  {
    id: 'msg-3',
    channelId: 'ch-2',
    userId: 'user-1',
    content: 'Legal! Eu migrei um projeto semana passada, a performance melhorou bastante',
    timestamp: new Date(Date.now() - 3600000)
  },
  {
    id: 'msg-4',
    channelId: 'ch-2',
    userId: 'user-3',
    content: 'Vocês estão usando o Turbopack em produção já?',
    timestamp: new Date(Date.now() - 1800000)
  },
  {
    id: 'msg-5',
    channelId: 'ch-2',
    userId: 'user-2',
    content: 'Ainda não em prod, mas os testes estão promissores',
    timestamp: new Date(Date.now() - 1200000)
  },
  {
    id: 'msg-6',
    channelId: 'ch-2',
    userId: 'user-6',
    content: 'Alguém tem algum recurso bom sobre Server Components?',
    timestamp: new Date(Date.now() - 600000)
  },
  {
    id: 'msg-7',
    channelId: 'ch-2',
    userId: 'user-1',
    content: 'A documentação oficial está muito boa, recomendo começar por lá. Tem também uns vídeos excelentes no canal da Vercel no YouTube',
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: 'msg-8',
    channelId: 'ch-2',
    userId: 'user-5',
    content: 'Concordo! E o novo AI SDK 6 está incrível para quem está trabalhando com LLMs',
    timestamp: new Date(Date.now() - 120000)
  },
]

// Helper functions
export function getServerChannels(serverId: string): Channel[] {
  return channels.filter(ch => ch.serverId === serverId)
}

export function getChannelMessages(channelId: string): Message[] {
  return messages.filter(msg => msg.channelId === channelId)
}

export function getUserById(userId: string): User | undefined {
  return users.find(u => u.id === userId)
}

export function getServerById(serverId: string): Server | undefined {
  return servers.find(s => s.id === serverId)
}

export function getChannelById(channelId: string): Channel | undefined {
  return channels.find(ch => ch.id === channelId)
}

export function getOnlineMembers(serverId: string): User[] {
  // Simula membros online de um servidor
  return users.filter(u => u.status === 'online' || u.status === 'away' || u.status === 'busy')
}

export function formatTimestamp(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) return 'agora'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}min`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`
  
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

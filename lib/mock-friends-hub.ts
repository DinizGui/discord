/**
 * Sugestões e perfis enriquecidos — linguagem para qualquer comunidade (jogos, estudo, hobby).
 */

export type NetworkStatus =
  | 'online'
  | 'offline'
  | 'busy'
  | 'studying'
  | 'open_to_chat'

export interface FriendProfile {
  id: string
  name: string
  email: string
  avatar: string
  status: NetworkStatus
  tags: string[]
  bio: string
  /** Interesses / jogos / hobbies (o que a pessoa curte) */
  interests: string[]
  link?: string
  linkLabel?: string
  matchScore?: number
}

export const STATUS_LABELS: Record<NetworkStatus, string> = {
  online: 'Disponível',
  offline: 'Offline',
  busy: 'Ocupado',
  studying: 'Estudando / focado',
  open_to_chat: 'Querendo conversar',
}

export const MOCK_SUGGESTIONS: FriendProfile[] = [
  {
    id: 'sug-1',
    name: 'Marina',
    email: 'marina@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarinaG',
    status: 'open_to_chat',
    tags: ['Música', 'Shows', 'Indie'],
    bio: 'Sempre com uma playlist nova. Bora trocar recomendação?',
    interests: ['Spotify', 'Vinil', 'Festivais'],
    link: 'https://instagram.com',
    linkLabel: 'Instagram',
    matchScore: 94,
  },
  {
    id: 'sug-2',
    name: 'Lucas',
    email: 'lucas@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LucasGame',
    status: 'studying',
    tags: ['Games', 'FPS', 'Valorant'],
    bio: 'Ranked de noite, estudos de dia. Procura duo tranquilo.',
    interests: ['Valorant', 'LoL', 'Indies'],
    matchScore: 88,
  },
  {
    id: 'sug-3',
    name: 'Sofia',
    email: 'sofia@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SofiaA',
    status: 'online',
    tags: ['Séries', 'Filmes', 'Anime'],
    bio: 'Spoiler: aviso antes. Amo debater final de temporada.',
    interests: ['Netflix', 'Crunchyroll', 'Cinema'],
    linkLabel: 'Letterboxd',
    link: 'https://letterboxd.com',
    matchScore: 82,
  },
  {
    id: 'sug-4',
    name: 'Rafa',
    email: 'rafa@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RafaF',
    status: 'busy',
    tags: ['Esportes', 'Futebol', 'Corrida'],
    bio: 'Grupo do fantasy league sempre aceita mais um.',
    interests: ['Brasileirão', 'NBA', 'Maratona'],
    matchScore: 79,
  },
  {
    id: 'sug-5',
    name: 'Camila',
    email: 'camila@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CamilaP',
    status: 'open_to_chat',
    tags: ['Arte', 'Desenho', 'Pets'],
    bio: 'Mando foto do gato sem pedir. 🐱',
    interests: ['Digital art', 'Adoção', 'Comunidades criativas'],
    matchScore: 76,
  },
]

const EXTRA_DEFAULT: Partial<FriendProfile> = {
  tags: ['Amigos'],
  bio: 'Na sua lista de amigos.',
  interests: ['Conversar', 'Comunidade'],
}

export function enrichFriend(f: {
  id: string
  name: string
  email: string
  avatar: string
  status?: string
  bio?: string
}): FriendProfile {
  const st = String(f.status || 'online')
  const status: NetworkStatus =
    st === 'busy'
      ? 'busy'
      : st === 'offline'
        ? 'offline'
        : st === 'studying'
          ? 'studying'
          : st === 'open_to_chat'
            ? 'open_to_chat'
            : 'online'

  return {
    id: f.id,
    name: f.name,
    email: f.email,
    avatar: f.avatar || '/placeholder.svg',
    status,
    tags: EXTRA_DEFAULT.tags!,
    bio: f.bio || EXTRA_DEFAULT.bio!,
    interests: EXTRA_DEFAULT.interests!,
  }
}

export function filterSuggestions(query: string, excludeIds: Set<string>): FriendProfile[] {
  const q = query.trim().toLowerCase()
  return MOCK_SUGGESTIONS.filter((s) => !excludeIds.has(s.id)).filter((s) => {
    if (!q) return true
    const blob = `${s.name} ${s.tags.join(' ')} ${s.interests.join(' ')}`.toLowerCase()
    return blob.includes(q)
  })
}

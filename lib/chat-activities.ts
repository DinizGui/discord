import type { ChatMessage } from '@/lib/chat-types'

export type PollOption = { id: string; label: string; votes: number }

export interface PollActivity {
  type: 'poll'
  id: string
  question: string
  options: PollOption[]
  endsAt?: string
}

export interface QuizActivity {
  type: 'quiz'
  id: string
  title: string
  questions: { id: string; prompt: string; choices: string[]; correctIndex: number }[]
}

/** Recado fixado / aviso — estilo comunicado no canal */
export interface NoteActivity {
  type: 'note'
  id: string
  title: string
  body: string
  emoji?: string
}

export type EmbeddedActivity = PollActivity | QuizActivity | NoteActivity

export interface ActivityMessage {
  kind: 'activity'
  id: string
  channelId: string
  userId: string
  authorName: string
  authorAvatar?: string
  timestamp: Date
  activity: EmbeddedActivity
}

export type TimelineItem =
  | { kind: 'text'; message: ChatMessage }
  | ActivityMessage

function seedPoll(): PollActivity {
  return {
    type: 'poll',
    id: `poll-seed-${Date.now()}`,
    question: 'Qual dia da semana costuma funcionar melhor pra call do grupo?',
    options: [
      { id: 'a', label: 'Segunda a quinta à noite', votes: 18 },
      { id: 'b', label: 'Fim de semana', votes: 24 },
      { id: 'c', label: 'Sexta à noite', votes: 12 },
    ],
  }
}

function seedQuiz(): QuizActivity {
  return {
    type: 'quiz',
    id: `quiz-seed-${Date.now()}`,
    title: 'Quiz rápido 🎬',
    questions: [
      {
        id: 'q1',
        prompt: 'Em filmes, o que significa “spoiler”?',
        choices: [
          'Revelar algo importante da história antes de assistir',
          'É o nome de um gênero de terror',
          'Significa “filme ruim”',
        ],
        correctIndex: 0,
      },
    ],
  }
}

function seedNote(): NoteActivity {
  return {
    type: 'note',
    id: `note-seed-${Date.now()}`,
    title: 'Regras do canal',
    emoji: '📌',
    body: 'Seja respeitoso, não mande spam e use os canais certos pra cada assunto. Dúvidas falem com um mod!',
  }
}

export function getSeedActivities(channelId: string, authorName = 'Aura'): ActivityMessage[] {
  const t = Date.now() - 1000 * 60 * 45
  return [
    {
      kind: 'activity',
      id: `act-note-${channelId}`,
      channelId,
      userId: 'system',
      authorName,
      timestamp: new Date(t - 720000),
      activity: seedNote(),
    },
    {
      kind: 'activity',
      id: `act-poll-${channelId}`,
      channelId,
      userId: 'system',
      authorName,
      timestamp: new Date(t - 600000),
      activity: seedPoll(),
    },
    {
      kind: 'activity',
      id: `act-quiz-${channelId}`,
      channelId,
      userId: 'system',
      authorName,
      timestamp: new Date(t - 300000),
      activity: seedQuiz(),
    },
  ]
}

export function mergeTimeline(
  messages: ChatMessage[],
  extras: ActivityMessage[],
): TimelineItem[] {
  const textItems: TimelineItem[] = messages.map((m) => ({
    kind: 'text',
    message: m,
  }))
  const all = [...textItems, ...extras]
  all.sort(
    (a, b) =>
      new Date(a.kind === 'text' ? a.message.timestamp : a.timestamp).getTime() -
      new Date(b.kind === 'text' ? b.message.timestamp : b.timestamp).getTime(),
  )
  return all
}

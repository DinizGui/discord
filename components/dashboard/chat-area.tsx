'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/lib/app-context'
import { formatTimestamp, type ChatMessage } from '@/lib/chat-types'
import {
  getSeedActivities,
  mergeTimeline,
  type ActivityMessage,
  type PollActivity,
  type QuizActivity,
  type NoteActivity,
} from '@/lib/chat-activities'
import { ActivityMessageRow } from '@/components/chat/activities/activity-message'
import { cn } from '@/lib/utils'
import {
  Hash,
  Smile,
  Send,
  Inbox,
  BarChart3,
  Brain,
  Pin,
  Sparkles,
} from 'lucide-react'
import Image from 'next/image'
import type { TimelineItem } from '@/lib/chat-activities'

function MessageBubble({ message, isFirst }: { message: ChatMessage; isFirst: boolean }) {
  const { currentUser } = useApp()
  const isMe = Boolean(currentUser?.id) && message.userId === currentUser?.id
  const name = isMe ? (currentUser?.name ?? 'Você') : (message.authorName ?? 'Usuário')
  const avatar = isMe
    ? currentUser?.avatar || '/placeholder.svg'
    : message.authorAvatar || '/placeholder.svg'

  return (
    <div
      className={cn(
        'group flex gap-4 px-5 py-1.5 transition-colors hover:bg-white/[0.02]',
        isFirst && 'mt-4',
      )}
    >
      {isFirst ? (
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10">
          <Image src={avatar} alt={name} width={40} height={40} className="object-cover" />
        </div>
      ) : (
        <div className="flex w-10 shrink-0 items-center justify-center">
          <span className="text-[10px] text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100">
            {formatTimestamp(new Date(message.timestamp))}
          </span>
        </div>
      )}
      <div className="min-w-0 flex-1">
        {isFirst && (
          <div className="mb-1 flex items-baseline gap-2">
            <span className="font-semibold text-zinc-100">{name}</span>
            <span className="text-xs text-zinc-500">{formatTimestamp(new Date(message.timestamp))}</span>
          </div>
        )}
        <p className="break-words leading-relaxed text-zinc-300">{message.content}</p>
      </div>
    </div>
  )
}

function EmptyChat() {
  const { selectedChannel } = useApp()
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/15 to-violet-500/10 ring-1 ring-white/10">
        <Hash className="h-9 w-9 text-cyan-400/70" />
      </div>
      <h3 className="text-xl font-semibold text-white">#{selectedChannel?.name || 'canal'}</h3>
      <p className="mt-2 max-w-sm text-center text-sm text-zinc-500">
        Mensagens e atividades aparecem aqui. Use <Sparkles className="inline h-3.5 w-3.5" /> para enquete, quiz ou recado.
      </p>
    </div>
  )
}

function timelineItemFirst(timeline: TimelineItem[], index: number): boolean {
  const item = timeline[index]
  if (item.kind !== 'text') return true
  const prev = timeline[index - 1]
  if (!prev || prev.kind !== 'text') return true
  const a = item.message
  const b = prev.message
  if (a.userId !== b.userId) return true
  return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime() > 300000
}

export function ChatArea() {
  const { selectedChannel, selectedServer, currentUser } = useApp()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [userActivities, setUserActivities] = useState<ActivityMessage[]>([])
  const [activityMenu, setActivityMenu] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const loadMessages = useCallback(async (channelId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/messages/channel?channelId=${encodeURIComponent(channelId)}`)
      if (!res.ok) {
        setMessages([])
        return
      }
      const data = await res.json()
      const raw = (data.messages as ChatMessage[]) ?? []
      setMessages(
        raw.map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp as unknown as string),
        })),
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setUserActivities([])
  }, [selectedChannel?.id])

  useEffect(() => {
    if (selectedChannel?.id) void loadMessages(selectedChannel.id)
    else setMessages([])
  }, [selectedChannel?.id, loadMessages])

  const seedActivities = useMemo(
    () => (selectedChannel ? getSeedActivities(selectedChannel.id) : []),
    [selectedChannel?.id],
  )

  const timeline = useMemo(
    () => mergeTimeline(messages, [...seedActivities, ...userActivities]),
    [messages, seedActivities, userActivities],
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [timeline])

  const pushActivity = (activity: ActivityMessage['activity']) => {
    if (!selectedChannel || !currentUser) return
    const row: ActivityMessage = {
      kind: 'activity',
      id: `local-${Date.now()}`,
      channelId: selectedChannel.id,
      userId: currentUser.id,
      authorName: currentUser.name || 'Você',
      authorAvatar: currentUser.avatar,
      timestamp: new Date(),
      activity,
    }
    setUserActivities((prev) => [...prev, row])
    setActivityMenu(false)
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChannel) return
    const content = message.trim()
    setMessage('')
    const res = await fetch('/api/messages/channel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelId: selectedChannel.id, content }),
    })
    if (res.ok) {
      const data = await res.json()
      const m = data.message as ChatMessage
      if (m) {
        setMessages((prev) => [
          ...prev,
          { ...m, timestamp: new Date(m.timestamp as unknown as string) },
        ])
      }
    } else {
      setMessage(content)
    }
  }

  if (!selectedServer) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-zinc-800/50 ring-1 ring-white/10">
            <Inbox className="h-10 w-10 text-zinc-600" />
          </div>
          <h2 className="text-xl font-semibold text-white">Escolha um espaço</h2>
          <p className="mt-2 text-sm text-zinc-500">Selecione um servidor na coluna à esquerda.</p>
        </div>
      </div>
    )
  }

  if (!selectedChannel) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
        Selecione um canal
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-transparent">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.06] px-5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-cyan-500/80">#</span>
          <span className="truncate font-medium text-zinc-100">{selectedChannel.name}</span>
        </div>
      </div>

      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <p className="p-6 text-sm text-zinc-500">Carregando…</p>
        ) : timeline.length === 0 ? (
          <EmptyChat />
        ) : (
          <>
            {timeline.map((item, i) =>
              item.kind === 'activity' ? (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ActivityMessageRow item={item} />
                </motion.div>
              ) : (
                <MessageBubble
                  key={item.message.id}
                  message={item.message}
                  isFirst={timelineItemFirst(timeline, i)}
                />
              ),
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="shrink-0 border-t border-white/[0.06] p-4">
        <div className="relative mb-2 flex items-center gap-2">
          <div className="relative">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActivityMenu((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs font-medium text-violet-200 transition hover:bg-violet-500/20"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Atividades
            </motion.button>
            <AnimatePresence>
              {activityMenu && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-40 cursor-default"
                    aria-label="Fechar"
                    onClick={() => setActivityMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute bottom-full left-0 z-50 mb-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 py-2 shadow-xl"
                  >
                    <ActivityMenuBtn
                      icon={<BarChart3 className="h-4 w-4 text-cyan-400" />}
                      label="Nova enquete"
                      onClick={() => {
                        const p: PollActivity = {
                          type: 'poll',
                          id: `p-${Date.now()}`,
                          question: 'Qual horário é melhor pra gente se reunir?',
                          options: [
                            { id: '1', label: 'Tarde', votes: 2 },
                            { id: '2', label: 'Noite', votes: 1 },
                            { id: '3', label: 'Fim de semana', votes: 0 },
                          ],
                        }
                        pushActivity(p)
                      }}
                    />
                    <ActivityMenuBtn
                      icon={<Brain className="h-4 w-4 text-violet-400" />}
                      label="Quiz rápido"
                      onClick={() => {
                        const q: QuizActivity = {
                          type: 'quiz',
                          id: `q-${Date.now()}`,
                          title: 'Quiz do grupo 🎯',
                          questions: [
                            {
                              id: '1',
                              prompt: 'O que significa “mutar” alguém no chat de voz?',
                              choices: [
                                'Você para de ouvir a pessoa (sem ela saber)',
                                'A pessoa é expulsa do servidor',
                                'O microfone dela quebra',
                              ],
                              correctIndex: 0,
                            },
                          ],
                        }
                        pushActivity(q)
                      }}
                    />
                    <ActivityMenuBtn
                      icon={<Pin className="h-4 w-4 text-amber-400" />}
                      label="Recado fixado"
                      onClick={() => {
                        const n: NoteActivity = {
                          type: 'note',
                          id: `n-${Date.now()}`,
                          title: 'Aviso do canal',
                          emoji: '📢',
                          body: 'Lembrem-se: respeito acima de tudo. Qualquer problema chame um moderador.',
                        }
                        pushActivity(n)
                      }}
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-end gap-3 rounded-2xl border border-white/[0.08] bg-zinc-900/60 p-2 shadow-inner">
          <Smile className="mb-3 h-5 w-5 shrink-0 text-zinc-600" />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void handleSendMessage()
              }
            }}
            placeholder={`Mensagem em #${selectedChannel.name}…`}
            className="max-h-32 min-h-[44px] flex-1 resize-none border-0 bg-transparent py-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
            rows={1}
          />
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => void handleSendMessage()}
            disabled={!message.trim()}
            className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-600 text-white shadow-lg disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

function ActivityMenuBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-zinc-300 transition hover:bg-white/5"
    >
      {icon}
      {label}
    </button>
  )
}

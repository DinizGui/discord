'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { useApp } from '@/lib/app-context'
import { formatTimestamp, type ChatMessage } from '@/lib/chat-types'
import { cn } from '@/lib/utils'
import { AtSign, Send, Phone } from 'lucide-react'

function DMMessageBubble({ message }: { message: ChatMessage }) {
  const { currentUser } = useApp()

  const isMe = Boolean(currentUser?.id && message.userId === currentUser.id)
  const name = isMe ? (currentUser?.name ?? 'Você') : (message.authorName ?? 'Usuário')
  const avatar = isMe
    ? currentUser?.avatar || '/placeholder.svg'
    : message.authorAvatar || '/placeholder.svg'

  return (
    <div className={cn('flex gap-3 px-4 py-2', isMe && 'justify-end')}>
      {!isMe && (
        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
          <Image src={avatar} alt={name} width={36} height={36} className="object-cover" />
        </div>
      )}

      <div
        className={cn(
          'max-w-[75%] rounded-2xl border px-4 py-3',
          isMe ? 'border-primary/20 bg-primary/10' : 'border-white/10 bg-white/5',
        )}
      >
        <div className="text-xs font-medium text-muted-foreground mb-1">{name}</div>
        <div className="text-sm text-foreground/90 leading-relaxed break-words">{message.content}</div>
        <div className="text-[10px] text-muted-foreground mt-2">
          {formatTimestamp(new Date(message.timestamp))}
        </div>
      </div>
    </div>
  )
}

export function DMView() {
  const { selectedDM, currentUser, openVoiceCall } = useApp()
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [opening, setOpening] = useState(false)
  const [openError, setOpenError] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  const loadDm = useCallback(async (convId: string) => {
    const res = await fetch(`/api/messages/dm?conversationId=${encodeURIComponent(convId)}`)
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
  }, [])

  useEffect(() => {
    if (!selectedDM?.id || !currentUser?.id) {
      setConversationId(null)
      setMessages([])
      setOpenError(null)
      return
    }

    let cancelled = false
    setOpening(true)
    setOpenError(null)
    void (async () => {
      const res = await fetch('/api/dm/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peerId: selectedDM.id }),
      })
      if (cancelled) return
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setConversationId(null)
        setMessages([])
        setOpenError((err as { error?: string }).error || 'Não foi possível abrir a conversa.')
        setOpening(false)
        return
      }
      const data = await res.json()
      const id = data.conversationId as string
      setConversationId(id)
      await loadDm(id)
      setOpening(false)
    })()

    return () => {
      cancelled = true
    }
  }, [selectedDM?.id, currentUser?.id, loadDm])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const onSend = async () => {
    if (!selectedDM || !currentUser || !conversationId) return
    if (!text.trim()) return
    const content = text.trim()
    setText('')

    const res = await fetch('/api/messages/dm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId, content }),
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
      setText(content)
    }
  }

  if (!selectedDM) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-3xl bg-surface-2 flex items-center justify-center mx-auto mb-6">
            <AtSign className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Nenhuma DM selecionada</h2>
          <p className="text-muted-foreground">Selecione um amigo na barra lateral para abrir uma conversa.</p>
        </div>
      </div>
    )
  }

  if (openError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <p className="text-destructive text-sm mb-2">{openError}</p>
          <p className="text-xs text-muted-foreground">Só é possível enviar DM para amigos aceitos.</p>
        </div>
      </div>
    )
  }

  if (opening || !conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">Abrindo conversa…</p>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-background">
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <Image src={selectedDM.avatar || '/placeholder.svg'} alt={selectedDM.name} fill className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold">{selectedDM.name}</div>
          <div className="text-xs text-muted-foreground">Mensagem direta</div>
        </div>
        <button
          type="button"
          onClick={() =>
            openVoiceCall({
              kind: 'dm',
              title: 'Chamada de voz',
              subtitle: selectedDM.name,
              peerName: selectedDM.name,
              peerAvatar: selectedDM.avatar,
            })
          }
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 transition hover:bg-emerald-600/30"
          title="Ligação de voz"
        >
          <Phone className="h-5 w-5" />
        </button>
      </div>

      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto py-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">Nenhuma mensagem ainda. Diga oi!</div>
        ) : (
          messages.map((m) => <DMMessageBubble key={m.id} message={m} />)
        )}
        <div ref={endRef} />
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void onSend()}
            placeholder={`Mensagem para @${selectedDM.name}`}
            className="flex-1 h-11 rounded-xl bg-surface-2 border border-border px-4 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => void onSend()}
            disabled={!text.trim()}
            className="h-11 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useApp } from '@/lib/app-context'
import { formatTimestamp, type ChatMessage } from '@/lib/chat-types'
import { cn } from '@/lib/utils'
import { Hash, Smile, PlusCircle, Gift, ImageIcon, Send, Bell, Pin, Users, Search, Inbox } from 'lucide-react'
import Image from 'next/image'

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
        'flex gap-4 px-4 py-1 hover:bg-surface-2/50 transition-colors group animate-fade-in',
        isFirst && 'mt-4',
      )}
    >
      {isFirst ? (
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
          <Image src={avatar} alt={name} width={40} height={40} className="object-cover" />
        </div>
      ) : (
        <div className="w-10 shrink-0 flex items-center justify-center">
          <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            {formatTimestamp(new Date(message.timestamp))}
          </span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        {isFirst && (
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-semibold text-foreground hover:underline cursor-pointer">{name}</span>
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(new Date(message.timestamp))}
            </span>
          </div>
        )}
        <p className="text-foreground/90 leading-relaxed break-words">{message.content}</p>
      </div>
    </div>
  )
}

function EmptyChat() {
  const { selectedChannel } = useApp()

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-sm mx-auto px-4">
        <div className="w-20 h-20 rounded-full bg-surface-2 flex items-center justify-center mx-auto mb-6">
          <Hash className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Bem-vindo ao #{selectedChannel?.name || 'canal'}
        </h3>
        <p className="text-muted-foreground">
          Este é o início do canal. Seja o primeiro a enviar uma mensagem!
        </p>
      </div>
    </div>
  )
}

export function ChatArea() {
  const { selectedChannel, selectedServer, currentUser } = useApp()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
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
    if (selectedChannel?.id) {
      void loadMessages(selectedChannel.id)
    } else {
      setMessages([])
    }
  }, [selectedChannel?.id, loadMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSendMessage()
    }
  }

  if (!selectedServer) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 rounded-3xl bg-surface-2 flex items-center justify-center mx-auto mb-6">
            <Inbox className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Bem-vindo ao Aura</h2>
          <p className="text-muted-foreground mb-6">
            Selecione um servidor na barra lateral para começar a conversar com sua comunidade.
          </p>
        </div>
      </div>
    )
  }

  if (!selectedChannel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Selecione um canal para começar</p>
        </div>
      </div>
    )
  }

  const groupedMessages: { message: ChatMessage; isFirst: boolean }[] = messages.map((msg, index) => ({
    message: msg,
    isFirst:
      index === 0 ||
      messages[index - 1].userId !== msg.userId ||
      new Date(msg.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() > 300000,
  }))

  return (
    <div className="flex-1 flex flex-col bg-background min-w-0">
      <div className="h-14 px-4 flex items-center justify-between border-b border-border shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <Hash className="w-5 h-5 text-muted-foreground shrink-0" />
          <span className="font-semibold truncate">{selectedChannel.name}</span>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <Bell className="w-5 h-5 cursor-pointer hover:text-foreground" />
          <Pin className="w-5 h-5 cursor-pointer hover:text-foreground" />
          <Users className="w-5 h-5 cursor-pointer hover:text-foreground" />
          <Search className="w-5 h-5 cursor-pointer hover:text-foreground" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="p-4 text-sm text-muted-foreground">Carregando mensagens…</div>
        ) : messages.length === 0 ? (
          <EmptyChat />
        ) : (
          <>
            {groupedMessages.map(({ message: msg, isFirst }) => (
              <MessageBubble key={msg.id} message={msg} isFirst={isFirst} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-4">
        <div className="bg-surface-2 rounded-lg flex items-end gap-2 p-2 border border-border">
          <PlusCircle className="w-6 h-6 text-muted-foreground shrink-0 mb-2 cursor-pointer" />
          <Gift className="w-6 h-6 text-muted-foreground shrink-0 mb-2 cursor-pointer hidden sm:block" />
          <ImageIcon className="w-6 h-6 text-muted-foreground shrink-0 mb-2 cursor-pointer hidden sm:block" />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Conversar em #${selectedChannel.name}`}
            className="flex-1 bg-transparent border-0 resize-none outline-none text-foreground placeholder:text-muted-foreground min-h-[44px] max-h-32 py-3"
            rows={1}
          />
          <Smile className="w-6 h-6 text-muted-foreground shrink-0 mb-2 cursor-pointer" />
          <button
            type="button"
            onClick={() => void handleSendMessage()}
            disabled={!message.trim()}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer shrink-0 mb-1"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

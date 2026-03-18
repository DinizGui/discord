'use client'

import { useState, useRef, useEffect } from 'react'
import { useApp } from '@/lib/app-context'
import { getChannelMessages, getUserById, formatTimestamp, type Message } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { Hash, AtSign, Smile, PlusCircle, Gift, ImageIcon, Send, Bell, Pin, Users, Search, Inbox } from 'lucide-react'
import Image from 'next/image'

function MessageBubble({ message, isFirst }: { message: Message; isFirst: boolean }) {
  const user = getUserById(message.userId)
  
  if (!user) return null

  return (
    <div className={cn(
      "flex gap-4 px-4 py-1 hover:bg-surface-2/50 transition-colors group animate-fade-in",
      isFirst && "mt-4"
    )}>
      {isFirst ? (
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
          <Image
            src={user.avatar}
            alt={user.name}
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-10 shrink-0 flex items-center justify-center">
          <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        {isFirst && (
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-semibold text-foreground hover:underline cursor-pointer">
              {user.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(message.timestamp)}
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
  const { selectedChannel, selectedServer } = useApp()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedChannel) {
      setMessages(getChannelMessages(selectedChannel.id))
    }
  }, [selectedChannel])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChannel) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      channelId: selectedChannel.id,
      userId: 'user-1',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!selectedServer) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 rounded-3xl bg-surface-2 flex items-center justify-center mx-auto mb-6">
            <Inbox className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Bem-vindo ao Fiadaputins</h2>
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

  // Group messages by user for better visual hierarchy
  const groupedMessages: { message: Message; isFirst: boolean }[] = messages.map((msg, index) => ({
    message: msg,
    isFirst: index === 0 || 
      messages[index - 1].userId !== msg.userId ||
      (msg.timestamp.getTime() - messages[index - 1].timestamp.getTime()) > 300000 // 5 min gap
  }))

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Channel header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-muted-foreground" />
          <span className="font-semibold text-foreground">{selectedChannel.name}</span>
          {selectedChannel.description && (
            <>
              <div className="w-px h-5 bg-border mx-2" />
              <span className="text-sm text-muted-foreground truncate max-w-xs">
                {selectedChannel.description}
              </span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-surface-2 rounded-md transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-surface-2 rounded-md transition-colors">
            <Pin className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-surface-2 rounded-md transition-colors">
            <Users className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="relative ml-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar"
              className="h-8 w-36 pl-9 pr-3 rounded-md bg-surface-2 border-none text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {messages.length === 0 ? (
          <EmptyChat />
        ) : (
          <div className="py-4">
            {groupedMessages.map(({ message, isFirst }) => (
              <MessageBubble key={message.id} message={message} isFirst={isFirst} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message input - Modern Composer */}
      <div className="px-4 pb-4 pt-2 shrink-0">
        <div className="relative bg-surface-1 rounded-2xl border border-border shadow-lg overflow-hidden transition-all focus-within:border-primary/50 focus-within:shadow-[0_0_0_1px_var(--primary),0_4px_20px_-4px_var(--glow)]">
          {/* Attachment preview area (hidden when empty) */}
          {message.trim() && (
            <div className="absolute -top-1 left-4 right-4 h-1 bg-gradient-to-r from-primary/60 via-accent/60 to-primary/60 rounded-full opacity-80" />
          )}
          
          {/* Top toolbar */}
          <div className="flex items-center gap-1 px-3 pt-3 pb-1">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-surface-2 rounded-lg transition-all group">
              <PlusCircle className="w-4 h-4 group-hover:text-primary transition-colors" />
              <span className="hidden sm:inline">Anexar</span>
            </button>
            <div className="w-px h-5 bg-border mx-1" />
            <button className="p-2 hover:bg-surface-2 rounded-lg transition-colors group" title="Imagem">
              <ImageIcon className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
            </button>
            <button className="p-2 hover:bg-surface-2 rounded-lg transition-colors group" title="GIF">
              <Gift className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
            </button>
            <button className="p-2 hover:bg-surface-2 rounded-lg transition-colors group" title="Emoji">
              <Smile className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
            </button>
            <button className="p-2 hover:bg-surface-2 rounded-lg transition-colors group" title="Mencionar">
              <AtSign className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
            </button>
          </div>

          {/* Input area */}
          <div className="flex items-end gap-3 px-3 pb-3">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value)
                  // Auto-resize
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'
                }}
                onKeyDown={handleKeyDown}
                placeholder={`Mensagem para #${selectedChannel.name}`}
                rows={1}
                className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground resize-none leading-relaxed py-2 min-h-[40px] max-h-[200px]"
                style={{ height: 'auto' }}
              />
            </div>

            {/* Send button */}
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 shrink-0",
                message.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-md shadow-primary/25"
                  : "bg-surface-2 text-muted-foreground cursor-not-allowed"
              )}
            >
              <Send className={cn(
                "w-5 h-5 transition-transform",
                message.trim() && "translate-x-0.5"
              )} />
            </button>
          </div>

          {/* Bottom hint */}
          <div className="flex items-center justify-between px-3 pb-2 text-[11px] text-muted-foreground/60">
            <span>Enter para enviar, Shift+Enter para nova linha</span>
            <span className={cn(
              "transition-opacity",
              message.length > 0 ? "opacity-100" : "opacity-0"
            )}>
              {message.length}/2000
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import Image from 'next/image'
import { useApp } from '@/lib/app-context'
import type { ChatUser } from '@/lib/chat-types'
import { cn } from '@/lib/utils'
import { AtSign, MessageSquare, Users, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

export function FriendsView() {
  const {
    currentView,
    currentUser,
    selectedDM,
    openDM,
    goHome,
    goDMs,
    friends,
    pendingOutgoing,
    pendingIncoming,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
  } = useApp()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<ChatUser[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const activeUserId = selectedDM?.id ?? null

  const incomingIds = useMemo(() => new Set(pendingIncoming.map((p) => p.user.id)), [pendingIncoming])

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return searchResults.filter(
      (u) =>
        u.id !== currentUser?.id &&
        !friends.some((f) => f.id === u.id) &&
        !incomingIds.has(u.id),
    )
  }, [query, searchResults, currentUser?.id, friends, incomingIds])

  useEffect(() => {
    const q = query.trim()
    if (!q) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const controller = new AbortController()

    const t = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/users/search?name=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        })
        const data = await res.json().catch(() => null)
        setSearchResults((data?.results as ChatUser[]) || [])
      } catch {
        /* aborted */
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => {
      controller.abort()
      window.clearTimeout(t)
    }
  }, [query])

  const canShowAddPanel = currentView === 'home' || currentView === 'dm'

  return (
    <div className="h-full flex flex-col">
      <div className="h-14 px-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-semibold">
            {currentView === 'dm' ? 'Mensagens diretas' : 'Amigos'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={cn(
              'px-2 py-1 text-xs rounded-lg border transition-colors cursor-pointer',
              currentView === 'home' ? 'bg-surface-2 border-primary' : 'bg-transparent border-border hover:bg-surface-2',
            )}
            onClick={goHome}
          >
            Home
          </button>
          <button
            type="button"
            className={cn(
              'px-2 py-1 text-xs rounded-lg border transition-colors hidden md:inline-flex cursor-pointer',
              currentView === 'home' ? 'bg-surface-2 border-primary' : 'bg-transparent border-border hover:bg-surface-2',
            )}
            onClick={goHome}
          >
            Amigos
          </button>
          <button
            type="button"
            className={cn(
              'px-2 py-1 text-xs rounded-lg border transition-colors cursor-pointer',
              currentView === 'dm' ? 'bg-surface-2 border-primary' : 'bg-transparent border-border hover:bg-surface-2',
            )}
            onClick={goDMs}
          >
            DMs
          </button>

          {canShowAddPanel && (
            <button
              type="button"
              className="px-2 py-1 text-xs rounded-lg border border-dashed border-border hover:border-primary hover:bg-surface-2 transition-colors cursor-pointer"
              onClick={() => setIsAddOpen((v) => !v)}
            >
              Adicionar
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {pendingIncoming.length > 0 && (
          <div className="mb-4 px-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              <Users className="w-4 h-4" />
              Pedidos de amizade
            </div>
            <div className="flex flex-col gap-2">
              {pendingIncoming.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-surface-2 border border-border"
                >
                  <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
                    <Image src={req.user.avatar || '/placeholder.svg'} alt={req.user.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold truncate">{req.user.name}</div>
                    <div className="text-xs text-muted-foreground">Quer ser seu amigo</div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => void acceptFriendRequest(req.id)}
                      className="text-xs px-2 py-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                    >
                      Aceitar
                    </button>
                    <button
                      type="button"
                      onClick={() => void rejectFriendRequest(req.id)}
                      className="text-xs px-2 py-1 rounded-lg border border-border hover:bg-surface-3 cursor-pointer"
                    >
                      Recusar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'dm' ? (
          <div className="flex flex-col gap-2">
            <div className="px-2 py-1">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <MessageSquare className="w-4 h-4" />
                Threads
              </div>
            </div>

            {friends.length === 0 ? (
              <div className="px-2 py-6">
                <div className="text-sm font-semibold text-foreground mb-1">Sem DMs ainda</div>
                <div className="text-xs text-muted-foreground mb-3">
                  Adicione um amigo pra liberar suas conversas.
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(true)}
                  className="w-full px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Adicionar amigos
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {friends.map((friend) => (
                  <button
                    key={friend.id}
                    type="button"
                    onClick={() => openDM(friend)}
                    className={cn(
                      'flex items-center gap-3 px-2 py-2 rounded-lg transition-colors text-left w-full cursor-pointer',
                      activeUserId === friend.id ? 'bg-surface-3' : 'hover:bg-surface-2',
                    )}
                  >
                    <div className="relative w-9 h-9 rounded-full overflow-hidden">
                      <Image src={friend.avatar || '/placeholder.svg'} alt={friend.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold truncate">{friend.name}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <AtSign className="w-3 h-3" />
                          {friend.status}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {friends.length === 0 ? (
              <div className="px-2 py-6">
                <div className="text-sm font-semibold text-foreground mb-1">Você não tem amigos ainda</div>
                <div className="text-xs text-muted-foreground mb-3">
                  Use “Adicionar” pra buscar por nome e enviar uma solicitação.
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(true)}
                  className="w-full px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Adicionar amigos
                </button>
              </div>
            ) : (
              <>
                <div className="px-2 py-1">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Users className="w-4 h-4" />
                    Amigos
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  {friends.map((friend) => (
                    <button
                      key={friend.id}
                      type="button"
                      onClick={() => openDM(friend)}
                      className={cn(
                        'flex items-center gap-3 px-2 py-2 rounded-lg transition-colors text-left w-full cursor-pointer',
                        activeUserId === friend.id ? 'bg-surface-3' : 'hover:bg-surface-2',
                      )}
                    >
                      <div className="relative w-9 h-9 rounded-full overflow-hidden">
                        <Image src={friend.avatar || '/placeholder.svg'} alt={friend.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold truncate">{friend.name}</span>
                          <span className="text-xs text-muted-foreground">{friend.status}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">Mensagem direta</div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="border-t border-border pt-4">
              <div className="px-2 py-1">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <MessageSquare className="w-4 h-4" />
                  Mensagens diretas
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {friends.length === 0 ? (
                  <div className="px-2 py-3 text-xs text-muted-foreground">Sem conversas ainda.</div>
                ) : (
                  friends.map((friend) => (
                    <button
                      key={`dm-${friend.id}`}
                      type="button"
                      onClick={() => openDM(friend)}
                      className={cn(
                        'flex items-center gap-3 px-2 py-2 rounded-lg transition-colors text-left w-full cursor-pointer',
                        activeUserId === friend.id ? 'bg-surface-3' : 'hover:bg-surface-2',
                      )}
                    >
                      <div className="relative w-9 h-9 rounded-full overflow-hidden">
                        <Image src={friend.avatar || '/placeholder.svg'} alt={friend.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-semibold truncate">{friend.name}</span>
                        <div className="text-xs text-muted-foreground mt-0.5">Abrir conversa</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {isAddOpen && (
          <div className="border-t border-border pt-4">
            <div className="px-2 py-1">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Users className="w-4 h-4" />
                Adicionar amigos
              </div>
            </div>

            <div className="px-2 pb-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome..."
                className="w-full h-10 rounded-lg bg-surface-2 border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1 px-2 pb-3">
              {query.trim() && isSearching ? (
                <div className="text-xs text-muted-foreground py-3">Buscando...</div>
              ) : query.trim() && filteredResults.length === 0 ? (
                <div className="text-xs text-muted-foreground py-3">Nenhum usuário encontrado.</div>
              ) : (
                filteredResults.map((u) => {
                  const pending = pendingOutgoing.includes(u.id)
                  return (
                    <div key={u.id} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface-2">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden">
                        <Image src={u.avatar || '/placeholder.svg'} alt={u.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold truncate">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.status}</div>
                      </div>
                      {pending ? (
                        <div className="text-xs text-muted-foreground">Pedido enviado</div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void sendFriendRequest(u)}
                          className="text-xs px-2 py-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                          Adicionar
                        </button>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

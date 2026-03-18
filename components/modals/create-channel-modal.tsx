'use client'

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Hash, Volume2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CreateChannelModal() {
  const { modal, setModal, addChannel, selectedServer } = useApp()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<'text' | 'voice'>('text')
  const [isLoading, setIsLoading] = useState(false)

  if (modal !== 'create-channel') return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 600))
    
    addChannel(name, description)
    setName('')
    setDescription('')
    setType('text')
    setIsLoading(false)
  }

  const handleClose = () => {
    setModal('none')
    setName('')
    setDescription('')
    setType('text')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 glass rounded-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 hover:bg-surface-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <h2 className="text-xl font-bold text-foreground">Criar Canal</h2>
          <p className="text-muted-foreground text-sm mt-1">
            em {selectedServer?.name}
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          {/* Channel type */}
          <div className="flex flex-col gap-2 mb-4">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tipo de canal
            </Label>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setType('text')}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all",
                  type === 'text'
                    ? "bg-surface-2 border-primary"
                    : "bg-transparent border-border hover:bg-surface-2"
                )}
              >
                <Hash className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Texto</p>
                  <p className="text-xs text-muted-foreground">Envie mensagens, imagens e arquivos</p>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setType('voice')}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all",
                  type === 'voice'
                    ? "bg-surface-2 border-primary"
                    : "bg-transparent border-border hover:bg-surface-2"
                )}
              >
                <Volume2 className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Voz</p>
                  <p className="text-xs text-muted-foreground">Converse por áudio com membros</p>
                </div>
              </button>
            </div>
          </div>

          {/* Channel name */}
          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="channel-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Nome do canal
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {type === 'text' ? <Hash className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </span>
              <Input
                id="channel-name"
                type="text"
                placeholder="novo-canal"
                value={name}
                onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                className="h-11 pl-10 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          {/* Channel description */}
          <div className="flex flex-col gap-2 mb-6">
            <Label htmlFor="channel-description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tópico (opcional)
            </Label>
            <Input
              id="channel-description"
              type="text"
              placeholder="Do que se trata este canal?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-11 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="flex-1 h-11"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="flex-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Canal'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

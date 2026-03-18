'use client'

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Upload, Loader2, Camera } from 'lucide-react'

export function CreateServerModal() {
  const { modal, setModal, addServer } = useApp()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (modal !== 'create-server') return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    addServer(name, description)
    setName('')
    setDescription('')
    setIsLoading(false)
  }

  const handleClose = () => {
    setModal('none')
    setName('')
    setDescription('')
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
        <div className="relative px-6 pt-6 pb-4 text-center">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 hover:bg-surface-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <h2 className="text-2xl font-bold text-foreground">Criar Servidor</h2>
          <p className="text-muted-foreground mt-1">
            Dê ao seu servidor uma personalidade com nome e ícone
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          {/* Server icon upload */}
          <div className="flex justify-center mb-6">
            <div className="relative group cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-surface-2 border-2 border-dashed border-border flex items-center justify-center group-hover:border-primary transition-colors">
                <Camera className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <Upload className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
          </div>

          {/* Server name */}
          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="server-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Nome do servidor
            </Label>
            <Input
              id="server-name"
              type="text"
              placeholder="Meu servidor incrível"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {/* Server description */}
          <div className="flex flex-col gap-2 mb-6">
            <Label htmlFor="server-description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Descrição (opcional)
            </Label>
            <Input
              id="server-description"
              type="text"
              placeholder="Sobre o que é seu servidor?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-11 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {/* Info text */}
          <p className="text-xs text-muted-foreground mb-6">
            Ao criar um servidor, você concorda com as diretrizes da comunidade Fiadaputins.
          </p>

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
                'Criar'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

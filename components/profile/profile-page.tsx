'use client'

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Camera, Check, Loader2, LogOut, Mail, User, Shield, Bell, Palette, Globe } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

type SettingsTab = 'profile' | 'account' | 'notifications' | 'appearance'

export function ProfilePage() {
  const { currentUser, setView, logout } = useApp()
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [name, setName] = useState(currentUser?.name || '')
  const [bio, setBio] = useState(currentUser?.bio || '')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs = [
    { id: 'profile' as const, label: 'Perfil', icon: User },
    { id: 'account' as const, label: 'Conta', icon: Shield },
    { id: 'notifications' as const, label: 'Notificações', icon: Bell },
    { id: 'appearance' as const, label: 'Aparência', icon: Palette },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-60 bg-surface-1 border-r border-border flex flex-col">
        {/* Back button */}
        <button
          onClick={() => setView('dashboard')}
          className="flex items-center gap-2 px-4 py-4 text-muted-foreground hover:text-foreground transition-colors border-b border-border"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Voltar</span>
        </button>

        {/* User section */}
        <div className="p-4 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Configurações
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mb-1",
                activeTab === tab.id
                  ? "bg-surface-3 text-foreground"
                  : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              )}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-border">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-8">
          {activeTab === 'profile' && (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold text-foreground mb-2">Meu Perfil</h1>
              <p className="text-muted-foreground mb-8">
                Gerencie suas informações de perfil visíveis para outros usuários
              </p>

              {/* Avatar section */}
              <div className="glass rounded-xl p-6 mb-6">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden">
                      <Image
                        src={currentUser?.avatar || ''}
                        alt={currentUser?.name || ''}
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    </div>
                    <button className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6 text-foreground" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{currentUser?.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{currentUser?.email}</p>
                    <Button variant="outline" size="sm">
                      Alterar avatar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Profile form */}
              <div className="glass rounded-xl p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="display-name" className="text-sm font-medium text-foreground">
                      Nome de exibição
                    </Label>
                    <Input
                      id="display-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="bio" className="text-sm font-medium text-foreground">
                      Sobre mim
                    </Label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none text-foreground placeholder:text-muted-foreground"
                      placeholder="Conte um pouco sobre você..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className={cn(
                        "h-11 px-6 transition-all",
                        saved ? "bg-online hover:bg-online" : "bg-primary hover:bg-primary/90"
                      )}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : saved ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Salvo!
                        </>
                      ) : (
                        'Salvar alterações'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold text-foreground mb-2">Conta</h1>
              <p className="text-muted-foreground mb-8">
                Gerencie suas informações de login e segurança
              </p>

              <div className="glass rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">{currentUser?.email}</p>
                  <Button variant="outline" size="sm">
                    Alterar
                  </Button>
                </div>
              </div>

              <div className="glass rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Senha
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">Última alteração há 30 dias</p>
                  <Button variant="outline" size="sm">
                    Alterar senha
                  </Button>
                </div>
              </div>

              <div className="glass rounded-xl p-6 border-destructive/20">
                <h3 className="font-semibold text-destructive mb-2">Zona de perigo</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ações irreversíveis para sua conta
                </p>
                <Button variant="destructive" size="sm">
                  Excluir conta
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold text-foreground mb-2">Notificações</h1>
              <p className="text-muted-foreground mb-8">
                Controle como e quando você recebe notificações
              </p>

              <div className="glass rounded-xl p-6">
                <div className="flex flex-col gap-6">
                  {[
                    { title: 'Mensagens diretas', desc: 'Notificar sobre novas mensagens diretas' },
                    { title: 'Menções', desc: 'Notificar quando alguém mencionar você' },
                    { title: 'Novos membros', desc: 'Notificar quando alguém entrar no servidor' },
                    { title: 'Atualizações do sistema', desc: 'Receber novidades e atualizações do Fiadaputins' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <button className="w-12 h-7 rounded-full bg-primary p-1 transition-colors">
                        <div className="w-5 h-5 rounded-full bg-primary-foreground translate-x-5 transition-transform" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold text-foreground mb-2">Aparência</h1>
              <p className="text-muted-foreground mb-8">
                Personalize a aparência do Fiadaputins
              </p>

              <div className="glass rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Tema
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: 'Escuro', active: true },
                    { name: 'Claro', active: false },
                    { name: 'Sistema', active: false },
                  ].map((theme) => (
                    <button
                      key={theme.name}
                      className={cn(
                        "p-4 rounded-xl border transition-all",
                        theme.active
                          ? "bg-surface-2 border-primary"
                          : "bg-transparent border-border hover:bg-surface-2"
                      )}
                    >
                      <div className="h-8 rounded bg-surface-3 mb-2" />
                      <p className="text-sm font-medium text-foreground">{theme.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Idioma
                </h3>
                <select className="w-full h-11 px-3 rounded-lg bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-foreground">
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { AppProvider, useApp } from '@/lib/app-context'
import { LoginForm } from '@/components/auth/login-form'
import { RegisterForm } from '@/components/auth/register-form'
import { Dashboard } from '@/components/dashboard/dashboard'
import { ProfilePage } from '@/components/profile/profile-page'
import { CreateServerModal } from '@/components/modals/create-server-modal'
import { CreateChannelModal } from '@/components/modals/create-channel-modal'

function AppContent() {
  const { view } = useApp()

  return (
    <>
      {view === 'login' && <LoginForm />}
      {view === 'register' && <RegisterForm />}
      {view === 'dashboard' && <Dashboard />}
      {view === 'profile' && <ProfilePage />}
      
      {/* Modals */}
      <CreateServerModal />
      <CreateChannelModal />
    </>
  )
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

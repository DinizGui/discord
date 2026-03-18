/* eslint-disable react/no-unknown-property */
'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AppProvider, useApp } from '@/lib/app-context'
import { LoginForm } from '@/components/auth/login-form'
import { RegisterForm } from '@/components/auth/register-form'
import { Dashboard } from '@/components/dashboard/dashboard'
import { ProfilePage } from '@/components/profile/profile-page'
import { CreateServerModal } from '@/components/modals/create-server-modal'
import { CreateChannelModal } from '@/components/modals/create-channel-modal'

type View = 'login' | 'register' | 'dashboard' | 'profile'

function AppShellInner({ initialView }: { initialView: View }) {
  const { view, setView } = useApp()
  const { status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') return
    setView(initialView)
  }, [initialView, setView, status])

  return (
    <>
      {view === 'login' && <LoginForm />}
      {view === 'register' && <RegisterForm />}
      {view === 'dashboard' && <Dashboard />}
      {view === 'profile' && <ProfilePage />}

      {/* Always mounted so they can open via modal state */}
      <CreateServerModal />
      <CreateChannelModal />
    </>
  )
}

export function AppShell({ initialView }: { initialView: View }) {
  return (
    <AppProvider>
      <AppShellInner initialView={initialView} />
    </AppProvider>
  )
}


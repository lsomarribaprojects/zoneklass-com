'use client'

import { useUser } from '@/hooks/useUser'
import { signout } from '@/actions/auth'

export default function DashboardPage() {
  const { profile, loading } = useUser()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">ZK</span>
            </div>
            <span className="text-lg font-bold text-foreground font-heading">ZoneKlass</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{profile?.full_name || 'Usuario'}</p>
              <p className="text-xs text-foreground-muted capitalize">{profile?.role?.replace('_', ' ')}</p>
            </div>
            <form action={signout}>
              <button
                type="submit"
                className="text-sm text-foreground-secondary hover:text-foreground transition-colors"
              >
                Cerrar sesion
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-display-sm text-foreground font-heading">
            Hola, {profile?.full_name?.split(' ')[0] || 'estudiante'}
          </h1>
          <p className="text-foreground-secondary mt-1">Bienvenido a ZoneKlass</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-border">
            <p className="text-sm text-foreground-secondary">Nivel</p>
            <p className="text-3xl font-bold text-foreground mt-1">{profile?.level ?? 1}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-border">
            <p className="text-sm text-foreground-secondary">XP</p>
            <p className="text-3xl font-bold text-primary-500 mt-1">{profile?.xp ?? 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-border">
            <p className="text-sm text-foreground-secondary">Racha</p>
            <p className="text-3xl font-bold text-foreground mt-1">{profile?.streak_days ?? 0} dias</p>
          </div>
        </div>

        {/* Placeholder for courses */}
        <div className="bg-white rounded-2xl p-8 border border-border text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-xl font-heading font-semibold text-foreground">Tus cursos apareceran aqui</h2>
          <p className="text-foreground-secondary mt-2">Pronto podras explorar y tomar cursos en ZoneKlass</p>
        </div>
      </main>
    </div>
  )
}

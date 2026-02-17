'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  Users,
  Trophy,
  MessageCircle,
  Shield,
} from 'lucide-react'
import { useUser } from '@/hooks/useUser'

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Mis Cursos', href: '/dashboard', icon: BookOpen },
  { label: 'Explorar Cursos', href: '/cursos', icon: Compass },
  { label: 'Comunidad', href: '/comunidad', icon: Users },
  { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { label: 'Mensajes', href: '/mensajes', icon: MessageCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const { profile } = useUser()

  const xpForNextLevel = (profile?.level ?? 1) * 100
  const xpProgress = profile?.xp ? Math.min((profile.xp / xpForNextLevel) * 100, 100) : 0

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 flex-col bg-white dark:bg-slate-900 border-r border-border-light dark:border-slate-700 z-30">
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {SIDEBAR_ITEMS.map(item => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-500 shadow-sm'
                  : 'text-foreground-secondary dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-foreground dark:hover:text-slate-200'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-500' : ''}`} />
              {item.label}
            </Link>
          )
        })}

        {(profile?.role === 'super_admin' || profile?.role === 'admin') && (
          <>
            <div className="border-t border-border-light dark:border-slate-700 my-2" />
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all"
            >
              <Shield className="w-5 h-5" />
              Panel Admin
            </Link>
          </>
        )}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-border-light dark:border-slate-700">
        <div className="flex items-center gap-3">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name || 'Avatar'}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-200 dark:ring-primary-800"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground dark:text-slate-100 truncate">
              {profile?.full_name || 'Usuario'}
            </p>
            <p className="text-xs text-foreground-muted dark:text-slate-500">
              Nivel {profile?.level ?? 1}
            </p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-foreground-muted dark:text-slate-500 mb-1">
            <span>{profile?.xp ?? 0} XP</span>
            <span>{xpForNextLevel} XP</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-primary rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  )
}

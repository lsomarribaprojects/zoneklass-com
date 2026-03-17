'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  BookOpen,
  Users,
  Trophy,
  User,
} from 'lucide-react'
import { useLocale } from '@/features/i18n'

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useLocale()

  const BOTTOM_NAV_ITEMS = [
    { label: t.nav.home, href: '/dashboard', icon: Home },
    { label: t.nav.courses, href: '/cursos', icon: BookOpen },
    { label: t.nav.community, href: '/comunidad', icon: Users },
    { label: t.nav.ranking, href: '/leaderboard', icon: Trophy },
    { label: t.nav.profile, href: '/settings', icon: User },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-border-light dark:border-slate-700 z-50">
      <div className="flex items-center justify-around h-full px-2">
        {BOTTOM_NAV_ITEMS.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 py-1 px-3 min-w-0"
            >
              <item.icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-primary-500' : 'text-foreground-muted dark:text-slate-500'
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-primary-500' : 'text-foreground-muted dark:text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

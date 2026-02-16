'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bell,
  Menu,
  X,
  Sun,
  Moon,
  User,
  Settings,
  Shield,
  LogOut,
  Home,
  BookOpen,
  Users,
  Trophy,
} from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { useUser } from '@/hooks/useUser'
import { signout } from '@/actions/auth'

const NAV_ITEMS = [
  { label: 'Inicio', href: '/dashboard', icon: Home },
  { label: 'Cursos', href: '/cursos', icon: BookOpen },
  { label: 'Comunidad', href: '/members', icon: Users },
  { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
]

export function Header() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const { profile } = useUser()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false)
  }, [pathname])

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border-light dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Menú"
          >
            {showMobileMenu ? (
              <X className="w-5 h-5 text-foreground dark:text-slate-200" />
            ) : (
              <Menu className="w-5 h-5 text-foreground dark:text-slate-200" />
            )}
          </button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold font-heading text-gradient-primary">
              ZoneKlass
            </span>
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/30'
                    : 'text-foreground-secondary dark:text-slate-400 hover:text-foreground dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right: Theme toggle + Notifications + Avatar */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Cambiar tema"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-foreground-secondary" />
            )}
          </button>

          <button
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5 text-foreground-secondary dark:text-slate-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full" />
          </button>

          {/* User Avatar Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || 'Avatar'}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-200 dark:ring-primary-800"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
              )}
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-elevated border border-border-light dark:border-slate-700 py-2 animate-scale-in z-50">
                <div className="px-4 py-3 border-b border-border-light dark:border-slate-700">
                  <p className="text-sm font-medium text-foreground dark:text-slate-100 truncate">
                    {profile?.full_name || 'Usuario'}
                  </p>
                  <p className="text-xs text-foreground-muted dark:text-slate-500 truncate">
                    {profile?.email}
                  </p>
                </div>

                <Link
                  href="/settings"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground-secondary dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Mi Perfil
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground-secondary dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Configuracion
                </Link>

                {(profile?.role === 'super_admin' || profile?.role === 'admin') && (
                  <Link
                    href="/admin"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Panel Admin
                  </Link>
                )}

                <div className="border-t border-border-light dark:border-slate-700 mt-1 pt-1">
                  <button
                    onClick={() => signout()}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-border-light dark:border-slate-700 shadow-elevated animate-slide-down z-40">
          <nav className="flex flex-col p-4 gap-1">
            {NAV_ITEMS.map(item => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/30'
                      : 'text-foreground-secondary dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}

'use client'
import { useState } from 'react'
import { Moon, Sun, LogOut, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/components/layout/ThemeProvider'
import { useUser } from '@/hooks/useUser'
import { signout } from '@/actions/auth'
import { AdminSidebar } from './AdminSidebar'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { theme, toggleTheme } = useTheme()
  const { profile } = useUser()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A'

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-foreground transition-colors duration-300">
      {/* Admin Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-slate-800 border-b border-border shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Z</span>
            </div>
            <span className="text-xl font-bold text-foreground font-heading">ZoneKlass</span>
            <span className="text-xs font-medium text-white bg-primary-500 px-2 py-0.5 rounded-full">Admin</span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-foreground-muted" />
              ) : (
                <Moon className="w-5 h-5 text-foreground-muted" />
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                {initials}
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-border py-1 z-50">
                    {profile && (
                      <div className="px-4 py-2.5 border-b border-border">
                        <p className="text-sm font-medium text-foreground truncate">{profile.full_name}</p>
                        <p className="text-xs text-foreground-muted truncate">{profile.email}</p>
                      </div>
                    )}
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <ArrowLeft className="w-4 h-4 text-foreground-muted" />
                      <span className="text-sm text-foreground">Volver al sitio</span>
                    </Link>
                    <div className="border-t border-border my-1" />
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-error-500"
                      onClick={() => signout()}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Cerrar sesion</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="pt-16 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}

'use client'
import { LayoutDashboard, BookOpen, Users, Bot, Link2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Cursos', href: '/admin/courses', icon: BookOpen },
  { label: 'Usuarios', href: '/admin/users', icon: Users },
  { label: 'Hanna IA', href: '/admin/hanna', icon: Bot },
  { label: 'Invite Links', href: '/admin/invite-links', icon: Link2 },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-slate-800 border-r border-border hidden lg:flex flex-col">
      {/* Purple Gradient Header */}
      <div className="p-4 bg-gradient-to-r from-primary-500 to-accent-500">
        <div className="flex items-center justify-center">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-l-4 border-primary-500'
                    : 'text-foreground-muted hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-foreground'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Back to Site Link */}
      <div className="p-4 border-t border-border">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground-muted hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Volver al sitio</span>
        </Link>
      </div>
    </aside>
  )
}

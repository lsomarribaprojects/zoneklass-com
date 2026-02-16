'use client'

import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />
      <Sidebar />
      <main className="pt-16 lg:ml-64 pb-20 lg:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

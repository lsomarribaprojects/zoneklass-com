'use client'

import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ChatWidget } from '@/features/hanna/components'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <DashboardLayout>
        {children}
      </DashboardLayout>
      <ChatWidget />
    </ThemeProvider>
  )
}

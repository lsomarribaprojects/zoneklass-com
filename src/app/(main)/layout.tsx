'use client'

import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

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
    </ThemeProvider>
  )
}

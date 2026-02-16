'use client'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { AdminLayout } from '@/features/courses/components/admin/AdminLayout'

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AdminLayout>
        {children}
      </AdminLayout>
    </ThemeProvider>
  )
}

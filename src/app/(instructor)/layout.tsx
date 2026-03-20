import { redirect } from 'next/navigation'
import { requireInstructor } from '@/lib/auth/permissions'
import { InstructorNav } from '@/features/courses/components/instructor/InstructorNav'

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verify user is an instructor
  const { error } = await requireInstructor()

  if (error) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <InstructorNav />
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}

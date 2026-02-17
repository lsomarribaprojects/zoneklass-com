'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { BookOpen, Flame, Star, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { EnrolledCoursesSection } from '@/features/courses/components/catalog'
import { ProfileBadges } from '@/features/gamification/components/ProfileBadges'

export default function DashboardPage() {
  const { profile, loading } = useUser()
  const [enrolledCount, setEnrolledCount] = useState(0)

  useEffect(() => {
    if (!profile) return

    async function fetchCount() {
      const supabase = createClient()
      const { count } = await supabase
        .from('course_enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile!.id)
      setEnrolledCount(count || 0)
    }

    fetchCount()
  }, [profile])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-display-sm text-foreground dark:text-slate-100 font-heading">
          Hola, {profile?.full_name?.split(' ')[0] || 'estudiante'}
        </h1>
        <p className="text-foreground-secondary dark:text-slate-400 mt-1">
          Bienvenido a ZoneKlass
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-border-light dark:border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
              <Star className="w-5 h-5 text-primary-500" />
            </div>
          </div>
          <p className="text-sm text-foreground-secondary dark:text-slate-400">Nivel</p>
          <p className="text-3xl font-bold text-foreground dark:text-slate-100 mt-1">
            {profile?.level ?? 1}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-border-light dark:border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-500" />
            </div>
          </div>
          <p className="text-sm text-foreground-secondary dark:text-slate-400">XP Total</p>
          <p className="text-3xl font-bold text-primary-500 mt-1">
            {profile?.xp ?? 0}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-border-light dark:border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-warning-50 dark:bg-warning-500/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-warning-500" />
            </div>
          </div>
          <p className="text-sm text-foreground-secondary dark:text-slate-400">Racha</p>
          <p className="text-3xl font-bold text-foreground dark:text-slate-100 mt-1">
            {profile?.streak_days ?? 0} <span className="text-lg">dias</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-border-light dark:border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-success-50 dark:bg-success-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-success-500" />
            </div>
          </div>
          <p className="text-sm text-foreground-secondary dark:text-slate-400">Cursos</p>
          <p className="text-3xl font-bold text-foreground dark:text-slate-100 mt-1">
            {enrolledCount}
          </p>
        </div>
      </div>

      {/* Enrolled Courses */}
      <EnrolledCoursesSection />

      {/* Badges */}
      <div className="mt-8">
        <ProfileBadges />
      </div>
    </div>
  )
}

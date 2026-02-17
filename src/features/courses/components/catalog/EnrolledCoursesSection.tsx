'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Clock, ArrowRight, Compass } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { getBatchCourseProgress } from '@/actions/progress'
import type { CourseWithStats, CourseCategory, CourseLevel } from '@/types/database'

const CATEGORY_GRADIENTS: Record<string, string> = {
  'Programación': 'from-violet-500 to-purple-600',
  'IA': 'from-blue-500 to-cyan-500',
  'Diseño': 'from-pink-500 to-rose-500',
  'Marketing': 'from-amber-500 to-orange-500',
  'Negocios': 'from-teal-500 to-emerald-500',
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

interface EnrolledCourse extends CourseWithStats {
  enrolled_at: string
}

export function EnrolledCoursesSection() {
  const { profile } = useUser()
  const [courses, setCourses] = useState<EnrolledCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [progressMap, setProgressMap] = useState<Record<string, { completed: number; total: number; percentage: number }>>({})

  useEffect(() => {
    if (!profile) {
      setLoading(false)
      return
    }

    async function fetchEnrolled() {
      const supabase = createClient()

      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select(`
          enrolled_at,
          course:courses (
            *,
            modules (
              id,
              lessons (
                id,
                duration_minutes
              )
            )
          )
        `)
        .eq('user_id', profile!.id)
        .order('enrolled_at', { ascending: false })

      if (enrollments) {
        const mapped = enrollments
          .filter((e) => e.course)
          .map((enrollment) => {
            const course = enrollment.course as unknown as Record<string, unknown>
            const modules = (course.modules || []) as Array<{
              id: string
              lessons: Array<{ id: string; duration_minutes: number }>
            }>
            const allLessons = modules.flatMap(m => m.lessons || [])

            return {
              id: course.id as string,
              title: course.title as string,
              description: course.description as string | null,
              slug: course.slug as string,
              category: course.category as CourseCategory,
              level: course.level as CourseLevel,
              thumbnail_url: course.thumbnail_url as string | null,
              price: course.price as number,
              is_published: course.is_published as boolean,
              created_by: course.created_by as string,
              created_at: course.created_at as string,
              updated_at: course.updated_at as string,
              modules_count: modules.length,
              lessons_count: allLessons.length,
              total_duration_minutes: allLessons.reduce((sum, l) => sum + (l.duration_minutes || 0), 0),
              enrolled_count: 0,
              enrolled_at: enrollment.enrolled_at,
            }
          })
        setCourses(mapped)

        // Fetch progress for all courses in batch
        if (mapped.length > 0) {
          const courseIds = mapped.map(c => c.id)
          const progressResult = await getBatchCourseProgress(courseIds)
          if (progressResult.data) {
            setProgressMap(progressResult.data)
          }
        }
      }
      setLoading(false)
    }

    fetchEnrolled()
  }, [profile])

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-heading font-semibold text-foreground dark:text-slate-100 mb-4">
          Mis Cursos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-border-light dark:border-slate-700 animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-slate-700" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-heading font-semibold text-foreground dark:text-slate-100 mb-4">
          Mis Cursos
        </h2>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-border-light dark:border-slate-700 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-primary-500" />
          </div>
          <h3 className="text-lg font-heading font-semibold text-foreground dark:text-slate-100 mb-2">
            Aun no te has inscrito en ningun curso
          </h3>
          <p className="text-foreground-secondary dark:text-slate-400 mb-4">
            Explora nuestro catalogo y comienza a aprender hoy
          </p>
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary-500 hover:bg-primary-600 text-white transition-colors"
          >
            <Compass className="w-4 h-4" />
            Explorar Cursos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-semibold text-foreground dark:text-slate-100">
          Mis Cursos
        </h2>
        <Link
          href="/cursos"
          className="flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
        >
          Ver todos
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(course => {
          const gradient = CATEGORY_GRADIENTS[course.category] || 'from-violet-500 to-purple-600'
          const progress = progressMap[course.id]
          const percentage = progress?.percentage ?? 0

          return (
            <Link
              key={course.id}
              href={`/cursos/${course.slug}`}
              className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-border-light dark:border-slate-700 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Mini Thumbnail */}
              <div className="relative h-32 overflow-hidden">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <BookOpen className="w-8 h-8 text-white/80" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h4 className="text-sm font-semibold text-[#0F172A] dark:text-slate-100 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                  {course.title}
                </h4>

                {/* Stats */}
                <div className="flex items-center gap-3 text-xs text-foreground-muted dark:text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {course.lessons_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(course.total_duration_minutes)}
                  </span>
                </div>

                {/* Progress bar with real data */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-foreground-muted dark:text-slate-500">
                    {percentage}%
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

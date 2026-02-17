'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  Clock,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Lock,
  PlayCircle,
  CheckCircle,
} from 'lucide-react'
import { getCourseBySlug } from '@/actions/enrollments'
import { getLessonProgress } from '@/actions/progress'
import { EnrollButton } from '@/features/courses/components/catalog'
import type { CourseDetail, CourseLevel } from '@/types/database'

const LEVEL_STYLES: Record<CourseLevel, string> = {
  'Principiante': 'bg-green-100 text-green-700',
  'Intermedio': 'bg-yellow-100 text-yellow-700',
  'Avanzado': 'bg-red-100 text-red-700',
}

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

export default function CourseDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedModules, setExpandedModules] = useState<string[]>([])
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([])

  useEffect(() => {
    async function load() {
      const result = await getCourseBySlug(slug)
      if (result.error || !result.data) {
        setError(result.error || 'Curso no encontrado')
      } else {
        setCourse(result.data)
        // Expandir el primer modulo por defecto
        if (result.data.modules.length > 0) {
          setExpandedModules([result.data.modules[0].id])
        }
        // Cargar progreso si esta inscrito
        if (result.data.is_enrolled) {
          const progressResult = await getLessonProgress(result.data.id)
          if (progressResult.data) {
            setCompletedLessonIds(progressResult.data)
          }
        }
      }
      setLoading(false)
    }
    load()
  }, [slug])

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto animate-pulse">
        <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded mb-6" />
        <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded-2xl mb-6" />
        <div className="h-8 w-3/4 bg-gray-200 dark:bg-slate-700 rounded mb-4" />
        <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded mb-2" />
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-slate-700 rounded" />
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto text-center py-20">
        <BookOpen className="w-16 h-16 text-foreground-muted dark:text-slate-500 mx-auto mb-4" />
        <h2 className="text-xl font-heading font-semibold text-foreground dark:text-slate-100 mb-2">
          Curso no encontrado
        </h2>
        <p className="text-foreground-secondary dark:text-slate-400 mb-6">{error}</p>
        <Link
          href="/cursos"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary-500 hover:bg-primary-600 text-white transition-colors"
        >
          Volver al catalogo
        </Link>
      </div>
    )
  }

  const gradient = CATEGORY_GRADIENTS[course.category] || 'from-violet-500 to-purple-600'
  const levelStyle = LEVEL_STYLES[course.level] || 'bg-gray-100 text-gray-700'
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0)
  const totalDuration = course.modules.reduce(
    (sum, m) => sum + m.lessons.reduce((s, l) => s + l.duration_minutes, 0), 0
  )
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessonIds.length / totalLessons) * 100) : 0

  // Find the first incomplete lesson (or first lesson if none completed)
  const allLessons = course.modules.flatMap(m => m.lessons)
  const nextUncompletedLesson = allLessons.find(l => !completedLessonIds.includes(l.id))
  const continueLessonId = nextUncompletedLesson?.id || allLessons[0]?.id

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Back link */}
      <Link
        href="/cursos"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-secondary dark:text-slate-400 hover:text-foreground dark:hover:text-slate-200 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al catalogo
      </Link>

      {/* Hero */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-border-light dark:border-slate-700 mb-8">
        {/* Thumbnail */}
        <div className="relative h-56 sm:h-72">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <BookOpen className="w-20 h-20 text-white/60" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${levelStyle}`}>
              {course.level}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800">
              {course.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#0F172A] dark:text-slate-100 mb-3">
            {course.title}
          </h1>

          {course.description && (
            <p className="text-foreground-secondary dark:text-slate-400 text-base leading-relaxed mb-6">
              {course.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-border-light dark:border-slate-700">
            <div className="flex items-center gap-2 text-sm text-foreground-secondary dark:text-slate-400">
              <BookOpen className="w-4 h-4 text-primary-500" />
              <span><strong className="text-foreground dark:text-slate-200">{totalLessons}</strong> lecciones</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground-secondary dark:text-slate-400">
              <Clock className="w-4 h-4 text-primary-500" />
              <span><strong className="text-foreground dark:text-slate-200">{formatDuration(totalDuration)}</strong> de contenido</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground-secondary dark:text-slate-400">
              <BarChart3 className="w-4 h-4 text-primary-500" />
              <span><strong className="text-foreground dark:text-slate-200">{course.modules.length}</strong> modulos</span>
            </div>
          </div>

          {/* Progress bar (only for enrolled users) */}
          {course.is_enrolled && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground dark:text-slate-200">
                  Tu progreso
                </span>
                <span className="text-sm font-semibold text-primary-500">
                  {progressPercentage}%
                </span>
              </div>
              <div className="h-2.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-foreground-muted dark:text-slate-500 mt-1">
                {completedLessonIds.length} de {totalLessons} lecciones completadas
              </p>
            </div>
          )}

          {/* Enroll / Continue Button */}
          {course.is_enrolled && continueLessonId ? (
            <Link
              href={`/cursos/${course.slug}/leccion/${continueLessonId}`}
              className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl text-base font-semibold bg-primary-500 hover:bg-primary-600 text-white transition-colors shadow-lg shadow-primary-500/25"
            >
              <PlayCircle className="w-5 h-5" />
              {completedLessonIds.length > 0 ? 'Continuar Curso' : 'Comenzar Curso'}
            </Link>
          ) : (
            <EnrollButton
              courseId={course.id}
              isEnrolled={course.is_enrolled}
              courseSlug={course.slug}
              price={course.price}
            />
          )}
        </div>
      </div>

      {/* Modules & Lessons */}
      <div>
        <h2 className="text-xl font-heading font-semibold text-[#0F172A] dark:text-slate-100 mb-4">
          Contenido del Curso
        </h2>

        <div className="space-y-3">
          {course.modules.map((mod, modIndex) => {
            const isExpanded = expandedModules.includes(mod.id)
            const moduleDuration = mod.lessons.reduce((sum, l) => sum + l.duration_minutes, 0)
            const completedInModule = mod.lessons.filter(l => completedLessonIds.includes(l.id)).length

            return (
              <div
                key={mod.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-border-light dark:border-slate-700 overflow-hidden"
              >
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-slate-750 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-sm font-bold text-primary-500">
                      {modIndex + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-[#0F172A] dark:text-slate-100">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-foreground-muted dark:text-slate-500 mt-0.5">
                        {course.is_enrolled ? `${completedInModule}/` : ''}{mod.lessons.length} lecciones &middot; {formatDuration(moduleDuration)}
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-foreground-muted dark:text-slate-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-foreground-muted dark:text-slate-500 flex-shrink-0" />
                  )}
                </button>

                {/* Lessons List */}
                {isExpanded && (
                  <div className="border-t border-border-light dark:border-slate-700">
                    {mod.lessons.map((lesson) => {
                      const isLessonCompleted = completedLessonIds.includes(lesson.id)

                      return course.is_enrolled ? (
                        <Link
                          key={lesson.id}
                          href={`/cursos/${course.slug}/leccion/${lesson.id}`}
                          className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b last:border-b-0 border-border-light dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-750 transition-colors"
                        >
                          {isLessonCompleted ? (
                            <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" />
                          ) : (
                            <PlayCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                          )}
                          <span className="flex-1 text-sm text-foreground dark:text-slate-200">
                            {lesson.title}
                          </span>
                          <span className="text-xs text-foreground-muted dark:text-slate-500 flex-shrink-0">
                            {lesson.duration_minutes} min
                          </span>
                        </Link>
                      ) : (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b last:border-b-0 border-border-light dark:border-slate-700"
                        >
                          <Lock className="w-4 h-4 text-foreground-muted dark:text-slate-500 flex-shrink-0" />
                          <span className="flex-1 text-sm text-foreground-secondary dark:text-slate-400">
                            {lesson.title}
                          </span>
                          <span className="text-xs text-foreground-muted dark:text-slate-500 flex-shrink-0">
                            {lesson.duration_minutes} min
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

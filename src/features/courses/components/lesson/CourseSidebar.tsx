'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronUp, Play, CheckCircle, Clock } from 'lucide-react'
import type { CourseDetail } from '@/types/database'

interface CourseSidebarProps {
  course: CourseDetail
  currentLessonId: string
  completedLessonIds: string[]
  courseSlug: string
}

export function CourseSidebar({
  course,
  currentLessonId,
  completedLessonIds,
  courseSlug,
}: CourseSidebarProps) {
  const router = useRouter()
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(course.modules.map((m) => m.id))
  )

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(moduleId)) {
        next.delete(moduleId)
      } else {
        next.add(moduleId)
      }
      return next
    })
  }

  const handleLessonClick = (lessonId: string) => {
    router.push(`/cursos/${courseSlug}/leccion/${lessonId}`)
  }

  return (
    <aside className="hidden lg:block w-full h-[calc(100vh-8rem)] overflow-y-auto border-l border-border dark:border-slate-700 bg-surface dark:bg-slate-900">
      <div className="p-4">
        <h2 className="font-heading font-semibold text-[#0F172A] dark:text-slate-100 text-lg mb-4">
          Contenido del Curso
        </h2>

        <div className="space-y-2">
          {course.modules.map((module) => {
            const isExpanded = expandedModules.has(module.id)
            const moduleLessons = module.lessons || []
            const completedInModule = moduleLessons.filter((l) =>
              completedLessonIds.includes(l.id)
            ).length

            return (
              <div
                key={module.id}
                className="border border-border dark:border-slate-700 rounded-xl overflow-hidden"
              >
                {/* Module header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex-1 text-left">
                    <h3 className="font-heading font-medium text-foreground dark:text-slate-100 text-sm">
                      {module.title}
                    </h3>
                    <p className="text-xs text-foreground-secondary dark:text-slate-400 mt-0.5">
                      {completedInModule}/{moduleLessons.length} lecciones
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-foreground-secondary dark:text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-foreground-secondary dark:text-slate-400" />
                  )}
                </button>

                {/* Lessons list */}
                {isExpanded && (
                  <div className="bg-white dark:bg-slate-900">
                    {moduleLessons.map((lesson) => {
                      const isCompleted = completedLessonIds.includes(lesson.id)
                      const isCurrent = lesson.id === currentLessonId

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonClick(lesson.id)}
                          className={`w-full flex items-start gap-3 p-3 text-left transition-all ${
                            isCurrent
                              ? 'bg-primary-50 dark:bg-primary-950/30 border-l-4 border-primary-600 dark:border-primary-500'
                              : 'hover:bg-gray-50 dark:hover:bg-slate-800 border-l-4 border-transparent'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-success-500 dark:text-success-400 mt-0.5 flex-shrink-0" />
                          ) : (
                            <Play className="w-5 h-5 text-foreground-muted dark:text-slate-500 mt-0.5 flex-shrink-0" />
                          )}

                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium ${
                                isCurrent
                                  ? 'text-primary-600 dark:text-primary-400'
                                  : 'text-foreground dark:text-slate-200'
                              }`}
                            >
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3 text-foreground-secondary dark:text-slate-400" />
                              <span className="text-xs text-foreground-secondary dark:text-slate-400">
                                {lesson.duration_minutes} min
                              </span>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

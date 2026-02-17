'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface LessonHeaderProps {
  courseTitle: string
  courseSlug: string
  currentLessonIndex: number
  totalLessons: number
  progressPercentage: number
}

export function LessonHeader({
  courseTitle,
  courseSlug,
  currentLessonIndex,
  totalLessons,
  progressPercentage,
}: LessonHeaderProps) {
  return (
    <header className="fixed top-16 left-0 right-0 z-20 bg-white dark:bg-slate-900 border-b border-border dark:border-slate-700 lg:left-64">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left - Back button */}
        <Link
          href={`/cursos/${courseSlug}`}
          className="flex items-center gap-2 text-foreground-secondary dark:text-slate-400 hover:text-foreground dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Volver</span>
        </Link>

        {/* Center - Course info */}
        <div className="flex-1 mx-4 text-center">
          <h1 className="font-heading font-semibold text-[#0F172A] dark:text-slate-100 text-sm lg:text-base truncate">
            {courseTitle}
          </h1>
          <p className="text-xs text-foreground-secondary dark:text-slate-400 mt-0.5">
            Lección {currentLessonIndex} de {totalLessons}
          </p>
        </div>

        {/* Right - Progress bar */}
        <div className="flex items-center gap-3 min-w-[120px]">
          <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 dark:bg-primary-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-xs font-medium text-foreground-secondary dark:text-slate-400 tabular-nums">
            {progressPercentage}%
          </span>
        </div>
      </div>
    </header>
  )
}

'use client'

import { BookOpen } from 'lucide-react'
import type { CourseWithStats } from '@/types/database'
import { CourseCard } from './CourseCard'

interface CourseGridProps {
  courses: CourseWithStats[]
  enrolledCourseIds: string[]
}

export function CourseGrid({ courses, enrolledCourseIds }: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-border-light dark:border-slate-700 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-foreground-muted dark:text-slate-500" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-foreground dark:text-slate-100 mb-2">
          No se encontraron cursos
        </h3>
        <p className="text-foreground-secondary dark:text-slate-400">
          Intenta ajustar los filtros de busqueda
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <CourseCard
          key={course.id}
          course={course}
          isEnrolled={enrolledCourseIds.includes(course.id)}
        />
      ))}
    </div>
  )
}

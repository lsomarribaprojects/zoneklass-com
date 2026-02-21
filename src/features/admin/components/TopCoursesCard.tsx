'use client'

import { Trophy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { PopularCourse } from '@/actions/admin'

interface TopCoursesCardProps {
  courses: PopularCourse[]
  loading: boolean
}

const categoryColors: Record<string, string> = {
  'Programacion': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Programación': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'IA': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Diseno': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'Diseño': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'Marketing': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'Negocios': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
}

export function TopCoursesCard({ courses, loading }: TopCoursesCardProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-slate-700" />
            <div className="flex-1 h-4 bg-gray-200 dark:bg-slate-700 rounded" />
            <div className="w-8 h-4 bg-gray-200 dark:bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-8">
        <Trophy className="w-10 h-10 text-foreground-muted mx-auto mb-2" />
        <p className="text-sm text-foreground-muted">Sin datos de cursos</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {courses.map((course, i) => (
        <div key={course.id} className="flex items-center gap-3">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
            i === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            : i === 1 ? 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            : i === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
            : 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-gray-400'
          }`}>
            {i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{course.title}</p>
          </div>
          <Badge className={categoryColors[course.category] || 'bg-gray-100 text-gray-700'}>
            {course.category}
          </Badge>
          <span className="text-sm font-semibold text-foreground tabular-nums flex-shrink-0">
            {course.enrollmentCount}
          </span>
        </div>
      ))}
    </div>
  )
}

'use client'

import Link from 'next/link'
import { BookOpen, Clock, Users, CheckCircle } from 'lucide-react'
import type { CourseWithStats, CourseCategory, CourseLevel } from '@/types/database'

const CATEGORY_GRADIENTS: Record<CourseCategory, string> = {
  'Programación': 'from-violet-500 to-purple-600',
  'IA': 'from-blue-500 to-cyan-500',
  'Diseño': 'from-pink-500 to-rose-500',
  'Marketing': 'from-amber-500 to-orange-500',
  'Negocios': 'from-teal-500 to-emerald-500',
}

const LEVEL_STYLES: Record<CourseLevel, string> = {
  'Principiante': 'bg-green-100 text-green-700',
  'Intermedio': 'bg-yellow-100 text-yellow-700',
  'Avanzado': 'bg-red-100 text-red-700',
}

interface CourseCardProps {
  course: CourseWithStats
  isEnrolled?: boolean
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function CourseCard({ course, isEnrolled = false }: CourseCardProps) {
  const gradient = CATEGORY_GRADIENTS[course.category] || 'from-violet-500 to-purple-600'
  const levelStyle = LEVEL_STYLES[course.level] || 'bg-gray-100 text-gray-700'

  return (
    <Link
      href={`/cursos/${course.slug}`}
      className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-border-light dark:border-slate-700 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <BookOpen className="w-12 h-12 text-white/80" />
          </div>
        )}

        {/* Level Badge */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${levelStyle}`}>
          {course.level}
        </span>

        {/* Enrolled Badge */}
        {isEnrolled && (
          <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            <CheckCircle className="w-3.5 h-3.5" />
            Inscrito
          </span>
        )}

        {/* Price Badge */}
        {course.price === 0 && (
          <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 text-primary-600 backdrop-blur-sm">
            Gratis
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category */}
        <span className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-1.5">
          {course.category}
        </span>

        {/* Title */}
        <h3 className="text-lg font-heading font-semibold text-[#0F172A] dark:text-slate-100 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {course.title}
        </h3>

        {/* Description */}
        {course.description && (
          <p className="text-sm text-foreground-secondary dark:text-slate-400 mb-4 line-clamp-2 flex-1">
            {course.description}
          </p>
        )}

        {/* Stats Footer */}
        <div className="flex items-center gap-4 text-xs text-foreground-muted dark:text-slate-500 mt-auto pt-3 border-t border-border-light dark:border-slate-700">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {course.lessons_count} lecciones
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatDuration(course.total_duration_minutes)}
          </span>
          {course.modules_count > 0 && (
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {course.modules_count} modulos
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

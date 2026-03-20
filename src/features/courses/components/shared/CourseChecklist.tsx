'use client'

import { CheckCircle2, Circle, AlertCircle } from 'lucide-react'

interface CourseChecklistProps {
  course: {
    title: string
    description: string | null
    thumbnail_url: string | null
    price: number
    is_published: boolean
    modules?: Array<{
      lessons?: Array<{
        content: string | null
      }>
    }>
  }
}

export function CourseChecklist({ course }: CourseChecklistProps) {
  // Check: Title and description
  const hasTitleAndDescription =
    course.title.length > 0 &&
    course.description !== null &&
    course.description.length > 0

  // Check: At least 1 module with lessons
  const modules = course.modules || []
  const hasModuleWithLessons =
    modules.length > 0 && modules.some((m) => m.lessons && m.lessons.length > 0)

  // Check: All lessons have content
  const allLessonsHaveContent = modules.every((module) => {
    const lessons = module.lessons || []
    return lessons.every((lesson) => lesson.content && lesson.content.trim().length > 0)
  })

  // Check: Has thumbnail
  const hasThumbnail = course.thumbnail_url !== null && course.thumbnail_url.length > 0

  // Check: Price is defined (even $0 counts)
  const hasPriceDefined = course.price >= 0

  // Calculate completion percentage
  const checks = [
    hasTitleAndDescription,
    hasModuleWithLessons,
    allLessonsHaveContent,
    hasThumbnail,
    hasPriceDefined,
  ]
  const completedCount = checks.filter(Boolean).length
  const totalCount = checks.length
  const percentage = Math.round((completedCount / totalCount) * 100)

  // Determine status color
  const statusColor =
    percentage === 100
      ? 'text-green-700 dark:text-green-400'
      : percentage >= 60
        ? 'text-blue-700 dark:text-blue-400'
        : 'text-orange-700 dark:text-orange-400'

  const progressBarColor =
    percentage === 100
      ? 'bg-green-600'
      : percentage >= 60
        ? 'bg-blue-600'
        : 'bg-orange-600'

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <AlertCircle className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Preparacion del Curso
          </h3>
          <p className={`text-sm font-medium ${statusColor}`}>
            Tu curso esta {percentage}% listo para publicar
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${progressBarColor} transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        <ChecklistItem
          completed={hasTitleAndDescription}
          label="Titulo y descripcion"
        />
        <ChecklistItem
          completed={hasModuleWithLessons}
          label="Al menos 1 modulo con lecciones"
        />
        <ChecklistItem
          completed={allLessonsHaveContent}
          label="Todas las lecciones tienen contenido"
        />
        <ChecklistItem completed={hasThumbnail} label="Imagen de portada" />
        <ChecklistItem completed={hasPriceDefined} label="Precio definido" />
      </div>

      {/* Publish status */}
      {percentage === 100 && !course.is_published && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300 font-medium">
            Tu curso esta listo para ser publicado
          </p>
        </div>
      )}

      {course.is_published && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
            Este curso esta publicado y visible para estudiantes
          </p>
        </div>
      )}
    </div>
  )
}

interface ChecklistItemProps {
  completed: boolean
  label: string
}

function ChecklistItem({ completed, label }: ChecklistItemProps) {
  return (
    <div className="flex items-center gap-3">
      {completed ? (
        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
      ) : (
        <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0" />
      )}
      <span
        className={`text-sm ${
          completed
            ? 'text-gray-900 dark:text-white font-medium'
            : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

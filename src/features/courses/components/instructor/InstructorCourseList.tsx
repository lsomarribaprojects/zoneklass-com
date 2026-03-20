'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui'
import { Button } from '@/components/ui'
import { Badge } from '@/components/ui'
import { BookOpen, Plus, Clock, Eye, EyeOff } from 'lucide-react'

interface InstructorCourse {
  id: string
  title: string
  slug: string
  description: string | null
  category: string
  level: string
  thumbnail_url: string | null
  is_published: boolean
  created_at: string
  module_count: number
  lesson_count: number
}

interface InstructorCourseListProps {
  courses: InstructorCourse[]
  error: string | null
}

export function InstructorCourseList({ courses, error }: InstructorCourseListProps) {
  const router = useRouter()

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
          Error al cargar cursos
        </h2>
        <p className="text-red-700 dark:text-red-300">{error}</p>
      </div>
    )
  }

  // Empty state
  if (courses.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-4">
          <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No tienes cursos todavía
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Comienza a compartir tu conocimiento creando tu primer curso. Es rápido y fácil con nuestra herramienta de generación con IA.
        </p>
        <Button
          variant="primary"
          onClick={() => router.push('/instructor/courses/new')}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Crea tu primer curso
        </Button>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mis Cursos
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gestiona y edita tus cursos publicados
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push('/instructor/courses/new')}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Crear Nuevo Curso
        </Button>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card
            key={course.id}
            clickable
            onClick={() => router.push(`/instructor/courses/${course.id}/edit`)}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative h-48 bg-gradient-to-br from-purple-500 to-blue-600 overflow-hidden">
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-white/50" />
                </div>
              )}
              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <Badge
                  variant={course.is_published ? 'confirmed' : 'default'}
                  className="flex items-center gap-1 bg-white/90 dark:bg-gray-900/90"
                >
                  {course.is_published ? (
                    <>
                      <Eye className="w-3 h-3" />
                      Publicado
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3" />
                      Borrador
                    </>
                  )}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                {course.title}
              </h3>

              <div className="flex items-center gap-2 mb-3">
                <Badge variant="default" className="text-xs">
                  {course.category}
                </Badge>
                <Badge variant="default" className="text-xs">
                  {course.level}
                </Badge>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {course.module_count} módulos
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.lesson_count} lecciones
                  </span>
                </div>
              </div>

              {/* Date */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Creado el {new Date(course.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}

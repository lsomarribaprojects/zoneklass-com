'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Eye, EyeOff, Trash2, BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { togglePublish, deleteCourse } from '@/actions/courses'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import type { Course } from '@/types/database'

function getCategoryBadgeColor(category: string): string {
  const colors: Record<string, string> = {
    'Programación': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    'IA': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    'Diseño': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    'Marketing': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    'Negocios': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  }
  return colors[category] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
}

function getLevelBadgeColor(level: string): string {
  const colors: Record<string, string> = {
    'Principiante': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    'Intermedio': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    'Avanzado': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  }
  return colors[level] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
}

function formatPrice(price: number): string {
  if (price === 0) return 'Gratis'
  return `$${price.toFixed(2)}`
}

interface CourseRowProps {
  course: Course
  onTogglePublish: (courseId: string) => Promise<void>
  onDelete: (course: Course) => void
  isUpdating: boolean
}

function CourseRow({ course, onTogglePublish, onDelete, isUpdating }: CourseRowProps) {
  const [isTogglingPublish, setIsTogglingPublish] = useState(false)

  const handleTogglePublish = async () => {
    setIsTogglingPublish(true)
    try {
      await onTogglePublish(course.id)
    } finally {
      setIsTogglingPublish(false)
    }
  }

  return (
    <tr className="border-b border-border hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700 flex-shrink-0">
            {course.thumbnail_url ? (
              <Image
                src={course.thumbnail_url}
                alt={course.title}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-foreground-muted" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{course.title}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <Badge className={getCategoryBadgeColor(course.category)}>
          {course.category}
        </Badge>
      </td>
      <td className="py-4 px-4">
        <Badge className={getLevelBadgeColor(course.level)}>
          {course.level}
        </Badge>
      </td>
      <td className="py-4 px-4">
        <Badge variant={course.is_published ? 'confirmed' : 'pending'}>
          {course.is_published ? 'Publicado' : 'Borrador'}
        </Badge>
      </td>
      <td className="py-4 px-4 font-medium text-foreground">
        {formatPrice(course.price)}
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/courses/${course.id}/edit`}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            title="Editar curso"
          >
            <Pencil className="w-4 h-4 text-foreground-secondary" />
          </Link>
          <button
            onClick={handleTogglePublish}
            disabled={isTogglingPublish || isUpdating}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={course.is_published ? 'Despublicar' : 'Publicar'}
          >
            {isTogglingPublish ? (
              <div className="w-4 h-4 border-2 border-foreground-secondary border-t-transparent rounded-full animate-spin" />
            ) : course.is_published ? (
              <EyeOff className="w-4 h-4 text-foreground-secondary" />
            ) : (
              <Eye className="w-4 h-4 text-foreground-secondary" />
            )}
          </button>
          <button
            onClick={() => onDelete(course)}
            disabled={isUpdating}
            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Eliminar curso"
          >
            <Trash2 className="w-4 h-4 text-error-500" />
          </button>
        </div>
      </td>
    </tr>
  )
}

interface CourseCardProps {
  course: Course
  onTogglePublish: (courseId: string) => Promise<void>
  onDelete: (course: Course) => void
  isUpdating: boolean
}

function CourseCard({ course, onTogglePublish, onDelete, isUpdating }: CourseCardProps) {
  const [isTogglingPublish, setIsTogglingPublish] = useState(false)

  const handleTogglePublish = async () => {
    setIsTogglingPublish(true)
    try {
      await onTogglePublish(course.id)
    } finally {
      setIsTogglingPublish(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-gray-100 dark:bg-slate-700 relative">
        {course.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-foreground-muted" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
          {course.title}
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={getCategoryBadgeColor(course.category)}>
            {course.category}
          </Badge>
          <Badge className={getLevelBadgeColor(course.level)}>
            {course.level}
          </Badge>
          <Badge variant={course.is_published ? 'confirmed' : 'pending'}>
            {course.is_published ? 'Publicado' : 'Borrador'}
          </Badge>
        </div>
        <p className="text-lg font-bold text-foreground mb-4">
          {formatPrice(course.price)}
        </p>
        <div className="flex items-center gap-2">
          <Link href={`/admin/courses/${course.id}/edit`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              leftIcon={<Pencil className="w-4 h-4" />}
            >
              Editar
            </Button>
          </Link>
          <button
            onClick={handleTogglePublish}
            disabled={isTogglingPublish || isUpdating}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={course.is_published ? 'Despublicar' : 'Publicar'}
          >
            {isTogglingPublish ? (
              <div className="w-4 h-4 border-2 border-foreground-secondary border-t-transparent rounded-full animate-spin" />
            ) : course.is_published ? (
              <EyeOff className="w-4 h-4 text-foreground-secondary" />
            ) : (
              <Eye className="w-4 h-4 text-foreground-secondary" />
            )}
          </button>
          <button
            onClick={() => onDelete(course)}
            disabled={isUpdating}
            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Eliminar curso"
          >
            <Trash2 className="w-4 h-4 text-error-500" />
          </button>
        </div>
      </div>
    </Card>
  )
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchCourses = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCourses(data || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleTogglePublish = async (courseId: string) => {
    setIsUpdating(true)
    try {
      const result = await togglePublish(courseId)
      if (result?.error) {
        console.error('Error toggling publish:', result.error)
        return
      }
      await fetchCourses()
    } catch (error) {
      console.error('Error toggling publish:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteCourse(courseToDelete.id)
      if (result?.error) {
        console.error('Error deleting course:', result.error)
        return
      }
      setDeleteModalOpen(false)
      setCourseToDelete(null)
      await fetchCourses()
    } catch (error) {
      console.error('Error deleting course:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setCourseToDelete(null)
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Gestión de Cursos
          </h1>
          <p className="text-foreground-secondary">
            {courses.length} {courses.length === 1 ? 'curso' : 'cursos'} en total
          </p>
        </div>
        <Link href="/admin/courses/new">
          <Button leftIcon={<Plus className="w-5 h-5" />}>
            Nuevo Curso
          </Button>
        </Link>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 dark:bg-slate-700 rounded" />
            </Card>
          ))}
        </div>
      ) : courses.length === 0 ? (
        /* Empty State */
        <Card>
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-full mb-4">
              <BookOpen className="w-10 h-10 text-foreground-muted" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No hay cursos creados aún
            </h2>
            <p className="text-foreground-secondary mb-6 max-w-md mx-auto">
              Comienza a crear tu primer curso y comparte tu conocimiento con los estudiantes
            </p>
            <Link href="/admin/courses/new">
              <Button leftIcon={<Plus className="w-5 h-5" />}>
                Crear Primer Curso
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-700/50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-foreground-secondary uppercase tracking-wider">
                        Título
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-foreground-secondary uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-foreground-secondary uppercase tracking-wider">
                        Nivel
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-foreground-secondary uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-foreground-secondary uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-foreground-secondary uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800">
                    {courses.map((course) => (
                      <CourseRow
                        key={course.id}
                        course={course}
                        onTogglePublish={handleTogglePublish}
                        onDelete={handleDeleteClick}
                        isUpdating={isUpdating}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Mobile Card Grid View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onTogglePublish={handleTogglePublish}
                onDelete={handleDeleteClick}
                isUpdating={isUpdating}
              />
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        title="Confirmar Eliminación"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-foreground-secondary">
            ¿Estás seguro de que deseas eliminar el curso{' '}
            <span className="font-semibold text-foreground">
              "{courseToDelete?.title}"
            </span>
            ?
          </p>
          <p className="text-sm text-error-500">
            Esta acción no se puede deshacer. Se eliminarán también todos los módulos y lecciones asociados.
          </p>
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              isLoading={isDeleting}
              leftIcon={!isDeleting ? <Trash2 className="w-4 h-4" /> : undefined}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar Curso'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

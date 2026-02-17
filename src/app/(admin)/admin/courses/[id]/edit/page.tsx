'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui'
import { Modal } from '@/components/ui/modal'
import { CourseForm } from '@/features/courses/components/admin/CourseForm'
import { ModuleCard } from '@/features/courses/components/admin/ModuleCard'
import { ModuleFormModal } from '@/features/courses/components/admin/ModuleFormModal'
import { deleteCourse, togglePublish } from '@/actions/courses'
import { deleteModule, reorderModules } from '@/actions/modules'
import type { CourseWithModules, Module } from '@/types/database'
import { Plus, Loader2, Trash2, Eye, EyeOff, Link2 } from 'lucide-react'

export default function EditCoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<CourseWithModules | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModuleModal, setShowModuleModal] = useState(false)
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTogglingPublish, setIsTogglingPublish] = useState(false)

  const supabase = createClient()

  const fetchCourse = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*, modules(*, lessons(*))')
        .eq('id', courseId)
        .order('order_index', { referencedTable: 'modules', ascending: true })
        .single()

      if (error) throw error

      // Sort lessons within each module
      if (data?.modules) {
        data.modules.forEach((mod: { lessons?: { order_index: number }[] }) => {
          if (mod.lessons) {
            mod.lessons.sort((a, b) => a.order_index - b.order_index)
          }
        })
      }

      setCourse(data as CourseWithModules)
    } catch (error) {
      console.error('Error fetching course:', error)
      alert('Error al cargar el curso')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourse()
  }, [courseId])

  const handleDeleteCourse = async () => {
    setIsDeleting(true)
    try {
      await deleteCourse(courseId)
      // deleteCourse redirects to /admin/courses on success
    } catch {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const handleTogglePublish = async () => {
    if (!course) return

    setIsTogglingPublish(true)
    const result = await togglePublish(courseId)

    if (result?.error) {
      console.error('Error toggling publish:', result.error)
    } else {
      await fetchCourse()
    }
    setIsTogglingPublish(false)
  }

  const handleEditModule = (module: Module) => {
    setEditingModule(module)
    setShowModuleModal(true)
  }

  const handleAddModule = () => {
    setEditingModule(null)
    setShowModuleModal(true)
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (!window.confirm('Estas seguro de eliminar este modulo y todas sus lecciones?')) {
      return
    }

    const result = await deleteModule(moduleId)
    if (result?.error) {
      console.error('Error deleting module:', result.error)
    } else {
      await fetchCourse()
    }
  }

  const handleMoveModuleUp = async (module: Module, index: number) => {
    if (!course || index === 0) return

    const mods = course.modules || []
    const prevModule = mods[index - 1]
    const newOrder = mods.map((m, i) => {
      if (i === index - 1) return module.id
      if (i === index) return prevModule.id
      return m.id
    })

    const result = await reorderModules(courseId, newOrder)
    if (result?.error) {
      console.error('Error reordering modules:', result.error)
    } else {
      await fetchCourse()
    }
  }

  const handleMoveModuleDown = async (module: Module, index: number) => {
    if (!course || !course.modules) return

    const mods = course.modules
    if (index === mods.length - 1) return

    const nextModule = mods[index + 1]
    const newOrder = mods.map((m, i) => {
      if (i === index) return nextModule.id
      if (i === index + 1) return module.id
      return m.id
    })

    const result = await reorderModules(courseId, newOrder)
    if (result?.error) {
      console.error('Error reordering modules:', result.error)
    } else {
      await fetchCourse()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Curso no encontrado
        </h1>
        <Button variant="primary" onClick={() => router.push('/admin/courses')}>
          Volver a Cursos
        </Button>
      </div>
    )
  }

  const modules = course.modules || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        <ol className="flex items-center gap-2">
          <li>
            <a href="/admin" className="hover:text-gray-900 dark:hover:text-white">
              Admin
            </a>
          </li>
          <li>/</li>
          <li>
            <a
              href="/admin/courses"
              className="hover:text-gray-900 dark:hover:text-white"
            >
              Cursos
            </a>
          </li>
          <li>/</li>
          <li className="truncate max-w-xs">{course.title}</li>
          <li>/</li>
          <li className="text-gray-900 dark:text-white font-medium">Editar</li>
        </ol>
      </nav>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Editar Curso
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Actualiza los detalles del curso y gestiona su contenido
        </p>
      </div>

      {/* Section A: Course Details */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Detalles del Curso
        </h2>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <CourseForm course={course} onSuccess={fetchCourse} />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant={course.is_published ? 'outline' : 'primary'}
            onClick={handleTogglePublish}
            disabled={isTogglingPublish}
            isLoading={isTogglingPublish}
            leftIcon={course.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          >
            {course.is_published ? 'Despublicar Curso' : 'Publicar Curso'}
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push(`/admin/courses/${courseId}/links`)}
            leftIcon={<Link2 className="w-4 h-4" />}
          >
            Links de Invitacion
          </Button>

          <Button
            variant="danger"
            onClick={() => setShowDeleteModal(true)}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Eliminar Curso
          </Button>
        </div>
      </section>

      {/* Section B: Course Content */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Módulos y Lecciones
          </h2>
          <Button variant="primary" onClick={handleAddModule}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Módulo
          </Button>
        </div>

        {modules.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Este curso no tiene módulos aún. Agrega el primer módulo para comenzar.
            </p>
            <Button variant="primary" onClick={handleAddModule}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Módulo
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {modules.map((module, index) => (
              <ModuleCard
                key={module.id}
                module={module}
                courseId={courseId}
                isFirst={index === 0}
                isLast={index === modules.length - 1}
                onMoveUp={() => handleMoveModuleUp(module, index)}
                onMoveDown={() => handleMoveModuleDown(module, index)}
                onEdit={() => handleEditModule(module)}
                onDelete={() => handleDeleteModule(module.id)}
                onRefresh={fetchCourse}
              />
            ))}
          </div>
        )}
      </section>

      {/* Module Form Modal */}
      <ModuleFormModal
        isOpen={showModuleModal}
        onClose={() => {
          setShowModuleModal(false)
          setEditingModule(null)
        }}
        courseId={courseId}
        module={editingModule || undefined}
        onSuccess={() => {
          setShowModuleModal(false)
          setEditingModule(null)
          fetchCourse()
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        title="Eliminar Curso"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 font-medium mb-2">
              ¿Estás seguro?
            </p>
            <p className="text-red-700 dark:text-red-300 text-sm">
              Esta acción no se puede deshacer. Se eliminará permanentemente el curso
              "{course.title}", todos sus módulos, lecciones y progreso de estudiantes.
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteCourse}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Sí, Eliminar Curso
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

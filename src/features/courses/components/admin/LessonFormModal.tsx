'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui'
import { Button } from '@/components/ui'
import { createLesson, updateLesson } from '@/actions/lessons'
import type { Lesson } from '@/types/database'
import { FileEdit } from 'lucide-react'

interface LessonFormModalProps {
  isOpen: boolean
  onClose: () => void
  moduleId: string
  courseId: string
  lesson?: Lesson
  onSuccess: () => void
}

export function LessonFormModal({
  isOpen,
  onClose,
  moduleId,
  courseId,
  lesson,
  onSuccess,
}: LessonFormModalProps) {
  const [title, setTitle] = useState(lesson?.title || '')
  const [videoUrl, setVideoUrl] = useState(lesson?.video_url || '')
  const [duration, setDuration] = useState(lesson?.duration_minutes?.toString() || '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditMode = !!lesson

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', lesson?.content || '')
      formData.append('video_url', videoUrl)
      formData.append('duration_minutes', duration || '0')
      formData.append('module_id', moduleId)

      if (isEditMode) {
        const result = await updateLesson(lesson.id, formData)
        if (result?.error) {
          setError(result.error)
          setIsSubmitting(false)
          return
        }
      } else {
        const result = await createLesson(formData)
        if (result?.error) {
          setError(result.error)
          setIsSubmitting(false)
          return
        }
      }

      onSuccess()
      onClose()
      resetForm()
    } catch {
      setError('Error inesperado al guardar la leccion')
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setVideoUrl('')
    setDuration('')
    setError(null)
  }

  const handleClose = () => {
    if (!isSubmitting) {
      if (!isEditMode) {
        resetForm()
      } else {
        setTitle(lesson?.title || '')
        setVideoUrl(lesson?.video_url || '')
        setDuration(lesson?.duration_minutes?.toString() || '')
        setError(null)
      }
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Editar Leccion' : 'Agregar Leccion'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Titulo <span className="text-red-500">*</span>
          </label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Introduccion a Componentes"
            required
            disabled={isSubmitting}
            className="w-full"
          />
        </div>

        <div>
          <label
            htmlFor="videoUrl"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            URL del Video
          </label>
          <Input
            id="videoUrl"
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/..."
            disabled={isSubmitting}
            className="w-full"
          />
        </div>

        <div>
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Duracion en minutos
          </label>
          <Input
            id="duration"
            type="number"
            min="0"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="0"
            disabled={isSubmitting}
            className="w-full"
          />
        </div>

        {isEditMode && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <FileEdit className="w-4 h-4 shrink-0" />
              <span>
                Para editar el contenido rico, usa el boton{' '}
                <a
                  href={`/admin/courses/${courseId}/lessons/${lesson?.id}/edit`}
                  className="font-medium underline"
                >
                  Editor de Contenido
                </a>
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting
              ? 'Guardando...'
              : isEditMode
                ? 'Actualizar'
                : 'Crear Leccion'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

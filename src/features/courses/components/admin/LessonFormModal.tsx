'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui'
import { Button } from '@/components/ui'
import { Textarea } from '@/components/ui/textarea'
import { createLesson, updateLesson } from '@/actions/lessons'
import type { Lesson } from '@/types/database'

interface LessonFormModalProps {
  isOpen: boolean
  onClose: () => void
  moduleId: string
  lesson?: Lesson
  onSuccess: () => void
}

export function LessonFormModal({
  isOpen,
  onClose,
  moduleId,
  lesson,
  onSuccess,
}: LessonFormModalProps) {
  const [title, setTitle] = useState(lesson?.title || '')
  const [content, setContent] = useState(lesson?.content || '')
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
      formData.append('content', content)
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
    } catch (err) {
      setError('Error inesperado al guardar la lección')
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setContent('')
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
        setContent(lesson?.content || '')
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
      title={isEditMode ? 'Editar Lección' : 'Agregar Lección'}
      size="lg"
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
            Título <span className="text-red-500">*</span>
          </label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Introducción a Componentes"
            required
            disabled={isSubmitting}
            className="w-full"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Contenido
          </label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Descripción y contenido de la lección..."
            rows={8}
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
            Duración en minutos
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
                : 'Crear Lección'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

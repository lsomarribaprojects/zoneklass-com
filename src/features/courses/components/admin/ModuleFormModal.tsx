'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui'
import { Button } from '@/components/ui'
import { createModule, updateModule } from '@/actions/modules'
import type { Module } from '@/types/database'

interface ModuleFormModalProps {
  isOpen: boolean
  onClose: () => void
  courseId: string
  module?: Module
  onSuccess: () => void
}

export function ModuleFormModal({
  isOpen,
  onClose,
  courseId,
  module,
  onSuccess,
}: ModuleFormModalProps) {
  const [title, setTitle] = useState(module?.title || '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditMode = !!module

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('course_id', courseId)

      if (isEditMode) {
        const result = await updateModule(module.id, formData)
        if (result?.error) {
          setError(result.error)
          setIsSubmitting(false)
          return
        }
      } else {
        const result = await createModule(formData)
        if (result?.error) {
          setError(result.error)
          setIsSubmitting(false)
          return
        }
      }

      onSuccess()
      onClose()
      setTitle('')
    } catch (err) {
      setError('Error inesperado al guardar el módulo')
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle(module?.title || '')
      setError(null)
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Editar Módulo' : 'Agregar Módulo'}
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
            Título del Módulo
          </label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Introducción a React"
            required
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
                : 'Crear Módulo'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

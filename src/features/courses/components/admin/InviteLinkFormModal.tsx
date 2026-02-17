'use client'

import { useState, useTransition } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button, Input, Select } from '@/components/ui'
import { createInviteLink } from '@/actions/invite-links'
import { INVITE_SOURCE_LABELS, INVITE_SOURCES } from '@/features/courses/types/schemas'

interface InviteLinkFormModalProps {
  isOpen: boolean
  onClose: () => void
  courseId: string
  onSuccess: () => void
}

export function InviteLinkFormModal({ isOpen, onClose, courseId, onSuccess }: InviteLinkFormModalProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    formData.append('course_id', courseId)

    startTransition(async () => {
      const result = await createInviteLink(formData)

      if (result.error) {
        setError(result.error)
        return
      }

      form.reset()
      onSuccess()
      onClose()
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Link de Invitacion" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
            <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
          </div>
        )}

        <Input
          name="label"
          label="Etiqueta"
          placeholder="Ej: Link para Twitter"
          required
          disabled={isPending}
        />

        <Select
          name="source"
          label="Fuente"
          options={INVITE_SOURCES.map(source => ({
            value: source,
            label: INVITE_SOURCE_LABELS[source],
          }))}
          disabled={isPending}
        />

        <Input
          name="expires_at"
          label="Fecha de Expiracion"
          type="datetime-local"
          hint="Dejar vacio para sin expiracion"
          disabled={isPending}
        />

        <Input
          name="max_uses"
          label="Maximo de Usos"
          type="number"
          min={0}
          placeholder="0"
          hint="0 o vacio = ilimitado"
          disabled={isPending}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            className="flex-1"
          >
            Crear Link
          </Button>
        </div>
      </form>
    </Modal>
  )
}

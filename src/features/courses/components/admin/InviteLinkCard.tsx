'use client'

import { useState, useTransition } from 'react'
import { Button, Badge } from '@/components/ui'
import {
  MessageCircle,
  MessageSquare,
  Mail,
  Globe,
  Link2,
  Copy,
  Check
} from 'lucide-react'
import { toggleInviteLink, deleteInviteLink } from '@/actions/invite-links'
import type { InviteLinkWithStats } from '@/types/database'
import { INVITE_SOURCE_LABELS } from '@/features/courses/types/schemas'

interface InviteLinkCardProps {
  link: InviteLinkWithStats
  onRefresh: () => void
}

const SOURCE_ICONS = {
  twitter: MessageCircle,
  whatsapp: MessageSquare,
  email: Mail,
  website: Globe,
  other: Link2,
}

export function InviteLinkCard({ link, onRefresh }: InviteLinkCardProps) {
  const [isPending, startTransition] = useTransition()
  const [copied, setCopied] = useState(false)

  const SourceIcon = SOURCE_ICONS[link.source]
  const fullUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/invite/${link.code}`
    : `zoneklass.com/invite/${link.code}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleInviteLink(link.id)
      if (!result.error) {
        onRefresh()
      }
    })
  }

  const handleDelete = () => {
    if (!window.confirm('¿Estas seguro de eliminar este link de invitacion? Esta accion no se puede deshacer.')) {
      return
    }

    startTransition(async () => {
      const result = await deleteInviteLink(link.id)
      if (!result.error) {
        onRefresh()
      }
    })
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <SourceIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{link.label}</h3>
            <p className="text-sm text-foreground-muted">{INVITE_SOURCE_LABELS[link.source]}</p>
          </div>
        </div>
        <Badge variant={link.is_active ? 'confirmed' : 'default'}>
          {link.is_active ? 'Activo' : 'Inactivo'}
        </Badge>
      </div>

      {/* URL Row */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <code className="flex-1 text-sm font-mono text-foreground truncate">
          {fullUrl}
        </code>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          className="shrink-0"
        >
          {copied ? 'Copiado!' : 'Copiar'}
        </Button>
      </div>

      {/* Stats Row */}
      <div className="flex gap-2 flex-wrap">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          {link.clicks} clicks
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
          {link.registrations} registros
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          {link.enrollments} inscripciones
        </span>
      </div>

      {/* Details Row */}
      <div className="flex flex-wrap gap-4 text-sm text-foreground-muted pt-2 border-t border-gray-200 dark:border-gray-700">
        <div>
          <span className="font-medium">Creado:</span> {formatDate(link.created_at)}
        </div>
        <div>
          <span className="font-medium">Expira:</span>{' '}
          {link.expires_at ? formatDate(link.expires_at) : 'Sin expiracion'}
        </div>
        <div>
          <span className="font-medium">Usos:</span>{' '}
          {link.max_uses > 0
            ? `${link.current_uses}/${link.max_uses}`
            : `${link.current_uses} (Ilimitado)`}
        </div>
      </div>

      {/* Actions Row */}
      <div className="flex gap-2 pt-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleToggle}
          disabled={isPending}
          className="flex-1"
        >
          {link.is_active ? 'Desactivar' : 'Activar'}
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={handleDelete}
          disabled={isPending}
          className="flex-1"
        >
          Eliminar
        </Button>
      </div>
    </div>
  )
}

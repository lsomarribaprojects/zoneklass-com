'use client'

import type { AIContextType } from '@/types/database'
import {
  Lightbulb,
  FileText,
  BookOpen,
  CheckCircle,
  Sparkles,
  MessageSquare
} from 'lucide-react'

interface AIQuickActionsProps {
  contextType: AIContextType
  onAction: (action: string) => void
  disabled?: boolean
}

const ACTION_CONFIGS: Record<AIContextType, Array<{ icon: any; label: string; prompt: string }>> = {
  lesson_editing: [
    { icon: Sparkles, label: 'Mejora contenido', prompt: 'Mejora este contenido y hazlo más claro y didáctico' },
    { icon: FileText, label: 'Agrega ejercicios', prompt: 'Agrega ejercicios prácticos para esta lección' },
    { icon: Lightbulb, label: 'Simplifica', prompt: 'Simplifica este contenido para que sea más fácil de entender' },
    { icon: CheckCircle, label: 'Genera quiz', prompt: 'Genera un quiz de 5 preguntas sobre este contenido' }
  ],
  course_creation: [
    { icon: BookOpen, label: 'Sugiere estructura', prompt: 'Sugiere una estructura de módulos para este curso' },
    { icon: FileText, label: 'Genera descripción', prompt: 'Genera una descripción atractiva para este curso' },
    { icon: Lightbulb, label: 'Sugiere lecciones', prompt: 'Sugiere lecciones para el primer módulo' }
  ],
  review: [
    { icon: CheckCircle, label: 'Revisa curso', prompt: 'Revisa mi curso y dame feedback constructivo' },
    { icon: Sparkles, label: 'Sugiere mejoras', prompt: 'Qué mejoras puedo hacer a este curso?' },
    { icon: BookOpen, label: 'Verifica estructura', prompt: 'Verifica si la estructura del curso es adecuada' }
  ],
  general: [
    { icon: Lightbulb, label: 'Consejos pedagógicos', prompt: 'Dame consejos de pedagogía para mis cursos' },
    { icon: BookOpen, label: 'Mejores prácticas', prompt: 'Cuáles son las mejores prácticas para crear cursos online?' },
    { icon: MessageSquare, label: 'Ideas para curso', prompt: 'Tengo una idea de curso, ayúdame a desarrollarla' }
  ]
}

export function AIQuickActions({ contextType, onAction, disabled = false }: AIQuickActionsProps) {
  const actions = ACTION_CONFIGS[contextType]

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
      {actions.map((action, idx) => {
        const Icon = action.icon
        return (
          <button
            key={idx}
            onClick={() => onAction(action.prompt)}
            disabled={disabled}
            className="
              flex items-center gap-2 px-3 py-2 rounded-full
              bg-gray-100 dark:bg-gray-800
              text-gray-700 dark:text-gray-300
              hover:bg-gray-200 dark:hover:bg-gray-700
              active:bg-gray-300 dark:active:bg-gray-600
              transition-all duration-200
              text-sm font-medium whitespace-nowrap
              disabled:opacity-50 disabled:cursor-not-allowed
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
            "
          >
            <Icon className="w-4 h-4" />
            <span>{action.label}</span>
          </button>
        )
      })}
    </div>
  )
}

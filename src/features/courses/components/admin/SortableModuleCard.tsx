'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { ModuleCard } from './ModuleCard'
import type { ModuleWithLessons } from '@/types/database'

interface SortableModuleCardProps {
  module: ModuleWithLessons
  courseId: string
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onEdit: () => void
  onDelete: () => void
  onRefresh: () => void
}

export function SortableModuleCard(props: SortableModuleCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.module.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-6 z-10 cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        title="Arrastra para reordenar"
      >
        <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-500" />
      </div>

      {/* Add left padding to make space for drag handle */}
      <div className="pl-12">
        <ModuleCard {...props} />
      </div>
    </div>
  )
}

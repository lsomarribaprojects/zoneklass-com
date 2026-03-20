'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

interface SortableLessonItemProps {
  id: string
  children: React.ReactNode
}

export function SortableLessonItem({ id, children }: SortableLessonItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

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
        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        title="Arrastra para reordenar"
      >
        <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      </div>

      {/* Add left padding to make space for drag handle */}
      <div className="pl-8">{children}</div>
    </div>
  )
}

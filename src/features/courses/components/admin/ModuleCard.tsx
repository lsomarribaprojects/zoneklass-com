'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Button } from '@/components/ui'
import { Badge } from '@/components/ui'
import { LessonFormModal } from './LessonFormModal'
import { deleteLesson, reorderLessons } from '@/actions/lessons'
import type { ModuleWithLessons, Lesson } from '@/types/database'
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  Plus,
  Video,
  Clock,
} from 'lucide-react'

interface ModuleCardProps {
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

export function ModuleCard({
  module,
  courseId,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
  onRefresh,
}: ModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showLessonModal, setShowLessonModal] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)

  const lessons = module.lessons || []
  const sortedLessons = [...lessons].sort((a, b) => a.order_index - b.order_index)

  const handleDeleteLesson = async (lessonId: string) => {
    if (!window.confirm('Estas seguro de eliminar esta leccion?')) {
      return
    }

    const result = await deleteLesson(lessonId)
    if (result?.error) {
      console.error('Error deleting lesson:', result.error)
    } else {
      onRefresh()
    }
  }

  const handleMoveLessonUp = async (lesson: Lesson, index: number) => {
    if (index === 0) return

    const prevLesson = sortedLessons[index - 1]
    const newOrder = sortedLessons.map((l, i) => {
      if (i === index - 1) return lesson.id
      if (i === index) return prevLesson.id
      return l.id
    })

    const result = await reorderLessons(module.id, newOrder)
    if (result?.error) {
      console.error('Error reordering lessons:', result.error)
    } else {
      onRefresh()
    }
  }

  const handleMoveLessonDown = async (lesson: Lesson, index: number) => {
    if (index === sortedLessons.length - 1) return

    const nextLesson = sortedLessons[index + 1]
    const newOrder = sortedLessons.map((l, i) => {
      if (i === index) return nextLesson.id
      if (i === index + 1) return lesson.id
      return l.id
    })

    const result = await reorderLessons(module.id, newOrder)
    if (result?.error) {
      console.error('Error reordering lessons:', result.error)
    } else {
      onRefresh()
    }
  }

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setShowLessonModal(true)
  }

  const handleAddLesson = () => {
    setEditingLesson(null)
    setShowLessonModal(true)
  }

  const handleLessonSuccess = () => {
    setShowLessonModal(false)
    setEditingLesson(null)
    onRefresh()
  }

  return (
    <>
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              <div className="flex items-center gap-2">
                <Badge className="bg-primary-100 text-primary-700 font-semibold">
                  {module.order_index + 1}
                </Badge>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {module.title}
                </h3>
              </div>

              <Badge className="ml-2 bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300">
                {lessons.length} {lessons.length === 1 ? 'leccion' : 'lecciones'}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Pencil className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onMoveUp}
                disabled={isFirst}
                className="hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onMoveDown}
                disabled={isLast}
                className="hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="p-4">
            {sortedLessons.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="mb-4">Este módulo no tiene lecciones aún.</p>
                <Button variant="primary" onClick={handleAddLesson}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Primera Lección
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {sortedLessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <Badge className="shrink-0 bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300">
                      {lesson.order_index + 1}
                    </Badge>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {lesson.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {lesson.video_url && (
                          <Badge variant="confirmed" className="text-xs">
                            <Video className="w-3 h-3 mr-1" />
                            Video
                          </Badge>
                        )}
                        {lesson.duration_minutes && lesson.duration_minutes > 0 && (
                          <Badge className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            <Clock className="w-3 h-3 mr-1" />
                            {lesson.duration_minutes} min
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditLesson(lesson)}
                        className="hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveLessonUp(lesson, index)}
                        disabled={index === 0}
                        className="hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveLessonDown(lesson, index)}
                        disabled={index === sortedLessons.length - 1}
                        className="hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  variant="secondary"
                  onClick={handleAddLesson}
                  className="w-full mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Lección
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      <LessonFormModal
        isOpen={showLessonModal}
        onClose={() => {
          setShowLessonModal(false)
          setEditingLesson(null)
        }}
        moduleId={module.id}
        lesson={editingLesson || undefined}
        onSuccess={handleLessonSuccess}
      />
    </>
  )
}

'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react'
import { VideoPlayer } from './VideoPlayer'
import type { Lesson } from '@/types/database'

interface LessonContentProps {
  lesson: Lesson
  isCompleted: boolean
  onComplete: () => void
  isCompleting: boolean
  prevLessonUrl: string | null
  nextLessonUrl: string | null
  isLastLesson: boolean
  isCourseCompleted: boolean
  courseSlug: string
}

export function LessonContent({
  lesson,
  isCompleted,
  onComplete,
  isCompleting,
  prevLessonUrl,
  nextLessonUrl,
  isLastLesson,
  isCourseCompleted,
  courseSlug,
}: LessonContentProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
      {/* Video */}
      {lesson.video_url && (
        <div className="mb-8">
          <VideoPlayer videoUrl={lesson.video_url} />
        </div>
      )}

      {/* Lesson title and info */}
      <div className="mb-6">
        <h1 className="font-heading font-bold text-[#0F172A] dark:text-slate-100 text-2xl lg:text-3xl mb-2">
          {lesson.title}
        </h1>
        <p className="text-sm text-foreground-secondary dark:text-slate-400">
          Duración estimada: {lesson.duration_minutes} minutos
        </p>
      </div>

      {/* Lesson content */}
      {lesson.content && (
        <div
          className="prose prose-slate dark:prose-invert max-w-none mb-8
            prose-headings:font-heading prose-headings:font-semibold
            prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
            prose-p:text-foreground dark:prose-p:text-slate-300
            prose-a:text-primary-600 dark:prose-a:text-primary-400
            prose-strong:text-foreground dark:prose-strong:text-slate-100
            prose-code:text-primary-600 dark:prose-code:text-primary-400
            prose-pre:bg-slate-900 prose-pre:text-slate-100
            prose-ul:text-foreground dark:prose-ul:text-slate-300
            prose-ol:text-foreground dark:prose-ol:text-slate-300"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      )}

      {/* Complete lesson button */}
      <div className="mb-8">
        {isCompleted ? (
          <div className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-success-50 dark:bg-success-950/20 text-success-600 dark:text-success-400 rounded-xl border border-success-200 dark:border-success-900/30">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Lección Completada</span>
          </div>
        ) : (
          <button
            onClick={onComplete}
            disabled={isCompleting}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 dark:bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCompleting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Completar Lección</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-4 pt-6 border-t border-border dark:border-slate-700">
        {prevLessonUrl ? (
          <Link
            href={prevLessonUrl}
            className="flex items-center gap-2 px-4 py-2 text-foreground-secondary dark:text-slate-400 hover:text-foreground dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Anterior</span>
          </Link>
        ) : (
          <div />
        )}

        {nextLessonUrl ? (
          <Link
            href={nextLessonUrl}
            className="flex items-center gap-2 px-4 py-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            <span className="font-medium">Siguiente</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : isLastLesson && isCourseCompleted ? (
          <Link
            href={`/cursos/${courseSlug}`}
            className="flex items-center gap-2 px-4 py-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            <span className="font-medium">Finalizar</span>
            <CheckCircle className="w-4 h-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}

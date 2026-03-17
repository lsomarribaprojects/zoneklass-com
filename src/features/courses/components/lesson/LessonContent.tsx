'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, BookOpen } from 'lucide-react'
import { VideoPlayer } from './VideoPlayer'
import { RichLessonContent } from './RichLessonContent'
import { useLocale, localized } from '@/features/i18n'
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
  const { t, locale } = useLocale()

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
      {/* Video */}
      {lesson.video_url && (
        <div className="mb-8">
          <VideoPlayer videoUrl={lesson.video_url} />
        </div>
      )}

      {/* Cover image (only when no video) */}
      {lesson.cover_image_url && !lesson.video_url && (
        <div className="mb-8 rounded-2xl overflow-hidden">
          <img
            src={lesson.cover_image_url}
            alt={localized(lesson, 'title', locale)}
            className="w-full h-auto object-cover max-h-[400px]"
            loading="lazy"
          />
        </div>
      )}

      {/* Lesson title and info */}
      <div className="mb-6">
        <h1 className="font-heading font-bold text-[#0F172A] dark:text-slate-100 text-2xl lg:text-3xl mb-2">
          {localized(lesson, 'title', locale)}
        </h1>
        <p className="text-sm text-foreground-secondary dark:text-slate-400">
          {t.lesson.estimatedDuration}: {lesson.duration_minutes} {t.lesson.minutes}
        </p>
      </div>

      {/* Lesson content */}
      {lesson.content && (
        <div className="mb-8">
          <RichLessonContent html={localized(lesson, 'content', locale)} />
        </div>
      )}

      {/* Summary infographic (filmina) */}
      {lesson.summary_image_url && (
        <div className="mb-8">
          <h3 className="font-heading font-semibold text-lg text-[#0F172A] dark:text-slate-100 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-500" />
            {t.lesson.summaryInfographic}
          </h3>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
            <img
              src={lesson.summary_image_url}
              alt={`${t.lesson.summaryInfographic}: ${localized(lesson, 'title', locale)}`}
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Complete lesson button */}
      <div className="mb-8">
        {isCompleted ? (
          <div className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-success-50 dark:bg-success-950/20 text-success-600 dark:text-success-400 rounded-xl border border-success-200 dark:border-success-900/30">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{t.lesson.lessonCompleted}</span>
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
                <span>{t.lesson.saving}</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>{t.lesson.completeLesson}</span>
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
            <span className="font-medium">{t.lesson.previous}</span>
          </Link>
        ) : (
          <div />
        )}

        {nextLessonUrl ? (
          <Link
            href={nextLessonUrl}
            className="flex items-center gap-2 px-4 py-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            <span className="font-medium">{t.lesson.next}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : isLastLesson && isCourseCompleted ? (
          <Link
            href={`/cursos/${courseSlug}`}
            className="flex items-center gap-2 px-4 py-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            <span className="font-medium">{t.lesson.finish}</span>
            <CheckCircle className="w-4 h-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}

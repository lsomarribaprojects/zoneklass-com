'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, notFound } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Loader2 } from 'lucide-react'
import { getCourseBySlug } from '@/actions/enrollments'
import { getLessonProgress, completeLesson } from '@/actions/progress'
import {
  LessonHeader,
  CourseSidebar,
  MobileCourseSidebar,
  LessonContent,
  CompletionCelebration,
} from '@/features/courses/components/lesson'
import type { CourseDetail, Lesson } from '@/types/database'

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const lessonId = params.lessonId as string

  // State
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCompleting, setIsCompleting] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  // Computed values
  const allLessons = course?.modules.flatMap((m) => m.lessons) || []
  const currentLessonIndex = allLessons.findIndex((l) => l.id === lessonId) + 1
  const totalLessons = allLessons.length
  const progressPercentage =
    totalLessons > 0
      ? Math.round((completedLessonIds.length / totalLessons) * 100)
      : 0

  const currentLessonPosition = allLessons.findIndex((l) => l.id === lessonId)
  const prevLesson = currentLessonPosition > 0 ? allLessons[currentLessonPosition - 1] : null
  const nextLesson =
    currentLessonPosition < allLessons.length - 1
      ? allLessons[currentLessonPosition + 1]
      : null

  const isLastLesson = currentLessonPosition === allLessons.length - 1
  const isCompleted = completedLessonIds.includes(lessonId)
  const isCourseCompleted = completedLessonIds.length === totalLessons

  // URLs
  const prevLessonUrl = prevLesson ? `/cursos/${slug}/leccion/${prevLesson.id}` : null
  const nextLessonUrl = nextLesson ? `/cursos/${slug}/leccion/${nextLesson.id}` : null

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch course
        const courseResult = await getCourseBySlug(slug)
        if (courseResult.error || !courseResult.data) {
          setError(courseResult.error || 'Curso no encontrado')
          setIsLoading(false)
          return
        }

        // Check enrollment
        if (!courseResult.data.is_enrolled) {
          router.push(`/cursos/${slug}`)
          return
        }

        setCourse(courseResult.data)

        // Find current lesson
        const allLessonsData = courseResult.data.modules.flatMap((m) => m.lessons)
        const lesson = allLessonsData.find((l) => l.id === lessonId)
        if (!lesson) {
          setError('Lección no encontrada')
          setIsLoading(false)
          return
        }

        setCurrentLesson(lesson)

        // Fetch progress
        const progressResult = await getLessonProgress(courseResult.data.id)
        if (progressResult.data) {
          setCompletedLessonIds(progressResult.data)
        }
      } catch (err) {
        setError('Error al cargar la lección')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [slug, lessonId, router])

  // Complete lesson handler
  const handleComplete = async () => {
    if (!course || !currentLesson || isCompleting || isCompleted) return

    setIsCompleting(true)

    try {
      const result = await completeLesson(currentLesson.id, course.id)

      if (result.error && !result.alreadyCompleted) {
        alert(`Error: ${result.error}`)
        setIsCompleting(false)
        return
      }

      // Update local state
      setCompletedLessonIds((prev) => [...prev, currentLesson.id])

      // Check if course is now 100% complete
      const newCompletedCount = completedLessonIds.length + 1
      const newIsCourseCompleted = newCompletedCount === totalLessons

      if (newIsCourseCompleted) {
        // Show celebration
        setShowCelebration(true)
      } else if (nextLessonUrl) {
        // Navigate to next lesson after delay
        setTimeout(() => {
          router.push(nextLessonUrl)
        }, 500)
      }
    } catch (err) {
      alert('Error al completar la lección')
      console.error(err)
    } finally {
      setIsCompleting(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 lg:pt-32 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded-lg w-1/3 mb-6" />

            {/* Video skeleton */}
            <div className="aspect-video bg-gray-200 dark:bg-slate-700 rounded-xl mb-6" />

            {/* Content skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !course || !currentLesson) {
    return (
      <div className="min-h-screen pt-32 lg:pt-32 pb-20 lg:pb-8">
        <div className="max-w-2xl mx-auto px-4 lg:px-8">
          <div className="bg-error-50 dark:bg-error-950/20 border border-error-200 dark:border-error-900/30 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-error-500 dark:text-error-400 mx-auto mb-4" />
            <h2 className="font-heading font-semibold text-[#0F172A] dark:text-slate-100 text-xl mb-2">
              {error || 'Lección no encontrada'}
            </h2>
            <p className="text-foreground-secondary dark:text-slate-400 mb-6">
              No pudimos cargar esta lección. Por favor, intenta nuevamente.
            </p>
            <Link
              href={`/cursos/${slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
            >
              Volver al Curso
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <LessonHeader
        courseTitle={course.title}
        courseSlug={slug}
        currentLessonIndex={currentLessonIndex}
        totalLessons={totalLessons}
        progressPercentage={progressPercentage}
      />

      {/* Main layout */}
      <div className="pt-32 lg:pt-32 pb-20 lg:pb-8 min-h-screen bg-background dark:bg-slate-950">
        <div className="flex">
          {/* Left - Main content */}
          <main className="flex-1 lg:pr-0">
            <LessonContent
              lesson={currentLesson}
              isCompleted={isCompleted}
              onComplete={handleComplete}
              isCompleting={isCompleting}
              prevLessonUrl={prevLessonUrl}
              nextLessonUrl={nextLessonUrl}
              isLastLesson={isLastLesson}
              isCourseCompleted={isCourseCompleted}
              courseSlug={slug}
            />
          </main>

          {/* Right - Sidebar (desktop) */}
          <aside className="hidden lg:block lg:w-[380px] flex-shrink-0">
            <CourseSidebar
              course={course}
              currentLessonId={lessonId}
              completedLessonIds={completedLessonIds}
              courseSlug={slug}
            />
          </aside>
        </div>
      </div>

      {/* Mobile sidebar */}
      <MobileCourseSidebar
        course={course}
        currentLessonId={lessonId}
        completedLessonIds={completedLessonIds}
        courseSlug={slug}
      />

      {/* Completion celebration */}
      {showCelebration && (
        <CompletionCelebration courseTitle={course.title} courseSlug={slug} />
      )}
    </>
  )
}

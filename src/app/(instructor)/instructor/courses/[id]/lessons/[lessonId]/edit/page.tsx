'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LessonEditor } from '@/features/courses/components/admin/LessonEditor'
import '@/features/courses/components/admin/lesson-editor.css'
import { AIAssistantPanel, AIAssistantButton } from '@/features/instructor-ai/components'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'
import type { Lesson } from '@/types/database'

interface CourseMinimal {
  id: string
  slug: string
  title: string
}

export default function InstructorLessonEditorPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  const lessonId = params.lessonId as string

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [course, setCourse] = useState<CourseMinimal | null>(null)
  const [moduleName, setModuleName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAI, setShowAI] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      // Fetch course for slug + title
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id, slug, title')
        .eq('id', courseId)
        .single()

      if (courseError || !courseData) {
        setError('Curso no encontrado')
        setLoading(false)
        return
      }

      // Fetch lesson with module name
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*, modules(title)')
        .eq('id', lessonId)
        .single()

      if (lessonError || !lessonData) {
        setError('Lección no encontrada')
        setLoading(false)
        return
      }

      setCourse(courseData)
      setLesson(lessonData as Lesson)
      setModuleName((lessonData as { modules?: { title: string } }).modules?.title || '')
      setLoading(false)
    }

    fetchData()
  }, [courseId, lessonId])

  const handleBack = () => {
    router.push(`/instructor/courses/${courseId}/edit`)
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  // Error state
  if (error || !lesson || !course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {error || 'Error inesperado'}
        </h1>
        <Button variant="primary" onClick={handleBack}>
          Volver al curso
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="h-[calc(100vh-4rem)]">
        <LessonEditor
          lesson={lesson}
          courseSlug={course.slug}
          moduleId={lesson.module_id}
          onBack={handleBack}
        />
      </div>

      {/* AI Assistant */}
      <div className="fixed bottom-6 right-6 z-40">
        <AIAssistantButton onClick={() => setShowAI(true)} />
      </div>

      <AIAssistantPanel
        isOpen={showAI}
        onClose={() => setShowAI(false)}
        contextType="lesson_editing"
        contextId={lessonId}
        courseTitle={course.title}
        moduleTitle={moduleName}
        lessonTitle={lesson.title}
        lessonContent={lesson.content || undefined}
      />
    </>
  )
}

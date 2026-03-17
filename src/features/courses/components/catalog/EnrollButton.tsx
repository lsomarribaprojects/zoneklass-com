'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2 } from 'lucide-react'
import { enrollInCourse } from '@/actions/enrollments'
import { useUser } from '@/hooks/useUser'
import { useLocale } from '@/features/i18n'

interface EnrollButtonProps {
  courseId: string
  isEnrolled: boolean
  courseSlug: string
  price: number
}

export function EnrollButton({ courseId, isEnrolled, courseSlug, price }: EnrollButtonProps) {
  const { t } = useLocale()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [enrolled, setEnrolled] = useState(isEnrolled)
  const router = useRouter()
  const { profile } = useUser()

  const handleEnroll = () => {
    if (!profile) {
      router.push('/login')
      return
    }

    setError(null)
    startTransition(async () => {
      const result = await enrollInCourse(courseId)
      if (result.error) {
        setError(result.error)
      } else {
        setEnrolled(true)
      }
    })
  }

  if (enrolled) {
    return (
      <div className="flex flex-col gap-2">
        <button
          disabled
          className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl text-base font-semibold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 cursor-default"
        >
          <CheckCircle className="w-5 h-5" />
          {t.course.alreadyEnrolled}
        </button>
        <button
          onClick={() => router.push(`/cursos/${courseSlug}`)}
          className="w-full px-6 py-3 rounded-xl text-base font-semibold bg-primary-500 hover:bg-primary-600 text-white transition-colors"
        >
          {t.course.continueCourse}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleEnroll}
        disabled={isPending}
        className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl text-base font-semibold bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white transition-colors shadow-lg shadow-primary-500/25"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t.course.enrolling}
          </>
        ) : (
          price === 0 ? t.course.enrollFree : t.course.enrollPrice.replace('{price}', String(price))
        )}
      </button>
      {error && (
        <p className="text-sm text-error-500 text-center">{error}</p>
      )}
    </div>
  )
}

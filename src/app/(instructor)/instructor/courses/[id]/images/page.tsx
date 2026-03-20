'use client'

import { ImageManager } from '@/features/courses/components/shared/ImageManager'
import { use } from 'react'

export default function InstructorImagesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const courseId = resolvedParams.id

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ImageManager courseId={courseId} basePath="/instructor/courses" />
    </div>
  )
}

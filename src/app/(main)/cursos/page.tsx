import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getPublishedCourses, getEnrolledCourses } from '@/actions/enrollments'
import { CatalogFilters, CatalogHeader, CourseGrid } from '@/features/courses/components/catalog'
import type { CourseCategory, CourseLevel } from '@/types/database'

export const metadata: Metadata = {
  title: 'Cursos',
  description: 'Explora nuestro catalogo de cursos interactivos. Aprende a tu ritmo con contenido de calidad y la asistencia de Hanna, tu tutora IA.',
}

interface PageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    level?: string
  }>
}

export default async function CursosPage({ searchParams }: PageProps) {
  const params = await searchParams

  const filters = {
    search: params.q || undefined,
    category: params.category as CourseCategory | undefined,
    level: params.level as CourseLevel | undefined,
  }

  const [coursesResult, enrolledResult] = await Promise.all([
    getPublishedCourses(filters),
    getEnrolledCourses().catch(() => ({ data: null, error: null })),
  ])

  const courses = coursesResult.data || []
  const enrolledCourseIds = (enrolledResult.data || []).map(c => c.id)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <CatalogHeader />

      {/* Filters */}
      <Suspense fallback={null}>
        <CatalogFilters />
      </Suspense>

      {/* Course Grid */}
      <CourseGrid courses={courses} enrolledCourseIds={enrolledCourseIds} />
    </div>
  )
}

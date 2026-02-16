import { Suspense } from 'react'
import { getPublishedCourses, getEnrolledCourses } from '@/actions/enrollments'
import { CatalogFilters, CourseGrid } from '@/features/courses/components/catalog'
import type { CourseCategory, CourseLevel } from '@/types/database'

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
      <div className="mb-6">
        <h1 className="text-display-sm text-[#0F172A] dark:text-slate-100 font-heading">
          Explorar Cursos
        </h1>
        <p className="text-foreground-secondary dark:text-slate-400 mt-1">
          Descubre cursos y comienza a aprender hoy
        </p>
      </div>

      {/* Filters */}
      <Suspense fallback={null}>
        <CatalogFilters />
      </Suspense>

      {/* Course Grid */}
      <CourseGrid courses={courses} enrolledCourseIds={enrolledCourseIds} />
    </div>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Eye, FileText, Clock, Plus, ArrowRight } from 'lucide-react'
import { getInstructorCourses } from '@/actions/instructor-courses'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>
  value: number | string
  label: string
  color: string
}

function StatCard({ icon: Icon, value, label, color }: StatCardProps) {
  return (
    <Card className={`${color} border-l-4`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color.replace('border-l-', 'bg-').replace('-500', '-100')}`}>
          <Icon className={`w-6 h-6 ${color.replace('border-l-', 'text-')}`} />
        </div>
        <div>
          <div className="text-3xl font-bold text-foreground">{value}</div>
          <div className="text-sm text-foreground-secondary">{label}</div>
        </div>
      </div>
    </Card>
  )
}

interface CourseRowProps {
  id: string
  title: string
  thumbnail_url: string | null
  is_published: boolean
  module_count: number
  lesson_count: number
}

function CourseRow({ id, title, thumbnail_url, is_published, module_count, lesson_count }: CourseRowProps) {
  return (
    <Link
      href={`/instructor/courses/${id}/edit`}
      className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
        {thumbnail_url ? (
          <Image
            src={thumbnail_url}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <BookOpen className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground group-hover:text-primary-600 transition-colors truncate">
          {title}
        </h3>
        <div className="flex items-center gap-3 mt-1 text-sm text-foreground-secondary">
          <span>{module_count} módulos</span>
          <span>•</span>
          <span>{lesson_count} lecciones</span>
        </div>
      </div>

      {/* Status Badge */}
      <Badge variant={is_published ? 'confirmed' : 'pending'}>
        {is_published ? 'Publicado' : 'Borrador'}
      </Badge>

      {/* Arrow */}
      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
    </Link>
  )
}

export default async function InstructorDashboardPage() {
  const { data: courses, error } = await getInstructorCourses()

  // Calculate stats
  const stats = {
    totalCourses: courses?.length || 0,
    publishedCourses: courses?.filter((c) => c.is_published).length || 0,
    totalLessons: courses?.reduce((sum, course) => sum + course.lesson_count, 0) || 0,
    totalHours: Math.round(
      (courses?.reduce((sum, course) => {
        // Assuming average 15 minutes per lesson
        return sum + course.lesson_count * 15
      }, 0) || 0) / 60
    ),
  }

  const recentCourses = courses?.slice(0, 5) || []

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Bienvenido, Instructor
          </h1>
          <p className="text-foreground-secondary mt-2">
            Gestiona tus cursos y contenido desde este panel
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={BookOpen}
            value={stats.totalCourses}
            label="Total Cursos"
            color="border-l-primary-500"
          />
          <StatCard
            icon={Eye}
            value={stats.publishedCourses}
            label="Publicados"
            color="border-l-success-500"
          />
          <StatCard
            icon={FileText}
            value={stats.totalLessons}
            label="Total Lecciones"
            color="border-l-accent-500"
          />
          <StatCard
            icon={Clock}
            value={stats.totalHours}
            label="Horas de Contenido"
            color="border-l-secondary-500"
          />
        </div>

        {/* Recent Courses Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Mis Cursos Recientes
            </h2>
            <Link href="/instructor/courses/new">
              <Button leftIcon={<Plus className="w-4 h-4" />}>
                Crear Nuevo Curso
              </Button>
            </Link>
          </div>

          {error && (
            <Card variant="bordered" className="border-error-300 bg-error-50 dark:bg-error-900/20">
              <p className="text-error-700 dark:text-error-300">
                Error al cargar cursos: {error}
              </p>
            </Card>
          )}

          {!error && recentCourses.length === 0 && (
            <Card className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Aún no tienes cursos
              </h3>
              <p className="text-foreground-secondary mb-6">
                Crea tu primer curso para comenzar a compartir tu conocimiento
              </p>
              <Link href="/instructor/courses/new">
                <Button leftIcon={<Plus className="w-4 h-4" />}>
                  Crear Mi Primer Curso
                </Button>
              </Link>
            </Card>
          )}

          {!error && recentCourses.length > 0 && (
            <Card padding="none" className="divide-y divide-border">
              {recentCourses.map((course) => (
                <CourseRow
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  thumbnail_url={course.thumbnail_url}
                  is_published={course.is_published}
                  module_count={course.module_count}
                  lesson_count={course.lesson_count}
                />
              ))}
            </Card>
          )}

          {!error && courses && courses.length > 5 && (
            <div className="mt-4 text-center">
              <Link href="/instructor/courses">
                <Button
                  variant="ghost"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Ver Todos los Cursos ({courses.length})
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

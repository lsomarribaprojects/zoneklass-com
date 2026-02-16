'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Globe, FileEdit, Users, Plus, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Course } from '@/types/database'

interface DashboardStats {
  totalCourses: number
  publishedCourses: number
  draftCourses: number
  totalStudents: number
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  iconBgColor: string
  loading: boolean
}

function StatCard({ title, value, icon, iconBgColor, loading }: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-xl ${iconBgColor}`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-foreground-secondary">{title}</p>
          {loading ? (
            <div className="h-8 w-16 bg-gray-200 dark:bg-slate-700 animate-pulse rounded mt-1" />
          ) : (
            <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
          )}
        </div>
      </div>
    </Card>
  )
}

function getCategoryBadgeColor(category: string): string {
  const colors: Record<string, string> = {
    'Programación': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    'IA': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    'Diseño': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    'Marketing': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    'Negocios': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  }
  return colors[category] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
}

export default function AdminDashboardPage() {
  const { profile, loading: userLoading } = useUser()
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalStudents: 0,
  })
  const [recentCourses, setRecentCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const supabase = createClient()

        // Get total courses count
        const { count: totalCourses } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true })

        // Get published courses count
        const { count: publishedCourses } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true })
          .eq('is_published', true)

        // Get total students count
        const { count: totalStudents } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'estudiante')

        // Get recent courses
        const { data: courses } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        setStats({
          totalCourses: totalCourses || 0,
          publishedCourses: publishedCourses || 0,
          draftCourses: (totalCourses || 0) - (publishedCourses || 0),
          totalStudents: totalStudents || 0,
        })
        setRecentCourses(courses || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const firstName = profile?.full_name?.split(' ')[0] || 'Admin'

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Panel de Administración
        </h1>
        <p className="text-foreground-secondary">
          {userLoading ? 'Cargando...' : `Bienvenido, ${firstName}`}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Cursos"
          value={stats.totalCourses}
          icon={<BookOpen className="w-6 h-6 text-white" />}
          iconBgColor="bg-primary-500"
          loading={loading}
        />
        <StatCard
          title="Publicados"
          value={stats.publishedCourses}
          icon={<Globe className="w-6 h-6 text-white" />}
          iconBgColor="bg-success-500"
          loading={loading}
        />
        <StatCard
          title="Borradores"
          value={stats.draftCourses}
          icon={<FileEdit className="w-6 h-6 text-white" />}
          iconBgColor="bg-warning-500"
          loading={loading}
        />
        <StatCard
          title="Estudiantes"
          value={stats.totalStudents}
          icon={<Users className="w-6 h-6 text-white" />}
          iconBgColor="bg-info-500"
          loading={loading}
        />
      </div>

      {/* Recent Courses Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Cursos Recientes
          </h2>
          <Link href="/admin/courses">
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Ver Todos
            </Button>
          </Link>
        </div>

        {loading ? (
          <Card>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded" />
                  <div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded" />
                  <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded ml-auto" />
                </div>
              ))}
            </div>
          </Card>
        ) : recentCourses.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-foreground-muted mx-auto mb-3" />
              <p className="text-foreground-secondary mb-4">
                No hay cursos creados aún
              </p>
              <Link href="/admin/courses/new">
                <Button leftIcon={<Plus className="w-4 h-4" />}>
                  Crear Primer Curso
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="divide-y divide-border">
              {recentCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/admin/courses/${course.id}/edit`}
                  className="flex items-center gap-4 py-4 px-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate group-hover:text-primary-500 transition-colors">
                      {course.title}
                    </h3>
                  </div>
                  <Badge
                    className={getCategoryBadgeColor(course.category)}
                  >
                    {course.category}
                  </Badge>
                  <Badge
                    variant={course.is_published ? 'confirmed' : 'pending'}
                  >
                    {course.is_published ? 'Publicado' : 'Borrador'}
                  </Badge>
                  <span className="text-sm text-foreground-secondary tabular-nums">
                    {new Date(course.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
              <Plus className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Crear Curso
            </h3>
            <p className="text-sm text-foreground-secondary mb-4">
              Comienza a crear un nuevo curso desde cero
            </p>
            <Link href="/admin/courses/new" className="w-full">
              <Button className="w-full">
                Nuevo Curso
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-info-100 dark:bg-info-900/30 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-info-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Ver Todos los Cursos
            </h3>
            <p className="text-sm text-foreground-secondary mb-4">
              Gestiona todos los cursos de la plataforma
            </p>
            <Link href="/admin/courses" className="w-full">
              <Button variant="outline" className="w-full">
                Ir a Cursos
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

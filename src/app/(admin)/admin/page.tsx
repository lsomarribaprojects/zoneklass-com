'use client'

import { useState, useEffect } from 'react'
import { Users, UserCheck, BookOpen, Globe, GraduationCap, CheckCircle2 } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { Card } from '@/components/ui/card'
import { BarChart, ActivityFeed, TopCoursesCard } from '@/features/admin/components'
import {
  getAdminStats,
  getRegistrationChart,
  getEnrollmentsByCourse,
  getTopCourses,
  getActivityFeed,
} from '@/actions/admin'
import type { AdminStats, RegistrationDataPoint, CourseEnrollmentStat, PopularCourse, ActivityEvent } from '@/actions/admin'

interface StatCardProps {
  title: string
  value: number | string
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

export default function AdminDashboardPage() {
  const { profile, loading: userLoading } = useUser()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [chartData, setChartData] = useState<RegistrationDataPoint[]>([])
  const [enrollmentData, setEnrollmentData] = useState<CourseEnrollmentStat[]>([])
  const [topCourses, setTopCourses] = useState<PopularCourse[]>([])
  const [activity, setActivity] = useState<ActivityEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      const [statsRes, chartRes, enrollRes, topRes, activityRes] = await Promise.all([
        getAdminStats(),
        getRegistrationChart(),
        getEnrollmentsByCourse(),
        getTopCourses(),
        getActivityFeed(),
      ])

      if (statsRes.data) setStats(statsRes.data)
      if (chartRes.data) setChartData(chartRes.data)
      if (enrollRes.data) setEnrollmentData(enrollRes.data)
      if (topRes.data) setTopCourses(topRes.data)
      if (activityRes.data) setActivity(activityRes.data)
      setLoading(false)
    }
    fetchAll()
  }, [])

  const firstName = profile?.full_name?.split(' ')[0] || 'Admin'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Panel de Administracion
        </h1>
        <p className="text-foreground-secondary">
          {userLoading ? 'Cargando...' : `Bienvenido, ${firstName}`}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Usuarios"
          value={stats?.totalUsers || 0}
          icon={<Users className="w-6 h-6 text-white" />}
          iconBgColor="bg-primary-500"
          loading={loading}
        />
        <StatCard
          title="Activos (7 dias)"
          value={stats?.activeUsers7d || 0}
          icon={<UserCheck className="w-6 h-6 text-white" />}
          iconBgColor="bg-green-500"
          loading={loading}
        />
        <StatCard
          title="Total Cursos"
          value={stats?.totalCourses || 0}
          icon={<BookOpen className="w-6 h-6 text-white" />}
          iconBgColor="bg-blue-500"
          loading={loading}
        />
        <StatCard
          title="Cursos Publicados"
          value={stats?.publishedCourses || 0}
          icon={<Globe className="w-6 h-6 text-white" />}
          iconBgColor="bg-teal-500"
          loading={loading}
        />
        <StatCard
          title="Total Inscripciones"
          value={stats?.totalEnrollments || 0}
          icon={<GraduationCap className="w-6 h-6 text-white" />}
          iconBgColor="bg-orange-500"
          loading={loading}
        />
        <StatCard
          title="Lecciones Completadas"
          value={stats?.lessonsCompleted || 0}
          icon={<CheckCircle2 className="w-6 h-6 text-white" />}
          iconBgColor="bg-pink-500"
          loading={loading}
        />
      </div>

      {/* Registration Chart */}
      <Card>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Registros Ultimos 30 Dias
        </h3>
        {loading ? (
          <div className="h-[200px] bg-gray-100 dark:bg-slate-700/50 animate-pulse rounded-lg" />
        ) : chartData.length > 0 ? (
          <BarChart
            data={chartData.map((d) => ({
              label: new Date(d.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
              value: d.count,
            }))}
            height={200}
            color="bg-primary-500"
          />
        ) : (
          <p className="text-center text-foreground-muted py-8 text-sm">Sin datos de registros</p>
        )}
      </Card>

      {/* Enrollments + Top Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Inscripciones por Curso
          </h3>
          {loading ? (
            <div className="h-[200px] bg-gray-100 dark:bg-slate-700/50 animate-pulse rounded-lg" />
          ) : enrollmentData.length > 0 ? (
            <BarChart
              data={enrollmentData.map((d) => ({
                label: d.courseTitle.length > 15 ? d.courseTitle.slice(0, 15) + '...' : d.courseTitle,
                value: d.enrollmentCount,
              }))}
              height={200}
              color="bg-blue-500"
            />
          ) : (
            <p className="text-center text-foreground-muted py-8 text-sm">Sin inscripciones</p>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Top 5 Cursos Populares
          </h3>
          <TopCoursesCard courses={topCourses} loading={loading} />
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Actividad Reciente
        </h3>
        <ActivityFeed events={activity} loading={loading} />
      </Card>
    </div>
  )
}

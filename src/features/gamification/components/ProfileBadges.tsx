'use client'

import { useEffect, useState } from 'react'
import {
  BookOpen,
  GraduationCap,
  Award,
  Flame,
  Zap,
  MessageCircle,
  Users,
  Shield,
  Crown,
  Footprints,
  Lock,
} from 'lucide-react'
import { getUserStats, getAllBadges, getUserBadges } from '@/actions/gamification'
import type { Badge, UserBadgeWithDetails } from '@/types/database'

// ============================================
// Icon mapping
// ============================================

const ICON_MAP: Record<string, React.ElementType> = {
  'footprints': Footprints,
  'book-open': BookOpen,
  'graduation-cap': GraduationCap,
  'award': Award,
  'flame': Flame,
  'zap': Zap,
  'message-circle': MessageCircle,
  'users': Users,
  'shield': Shield,
  'crown': Crown,
}

function BadgeIcon({ iconName, className }: { iconName: string; className?: string }) {
  const Icon = ICON_MAP[iconName] ?? Award
  return <Icon className={className} />
}

// ============================================
// Stat card
// ============================================

interface StatCardProps {
  icon: React.ReactNode
  count: number
  label: string
}

function StatCard({ icon, count, label }: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
      <div className="text-primary-500">{icon}</div>
      <span className="text-2xl font-bold font-heading text-foreground dark:text-slate-100">
        {count}
      </span>
      <span className="text-body-xs text-foreground-secondary dark:text-slate-400 text-center leading-tight">
        {label}
      </span>
    </div>
  )
}

// ============================================
// Badge card
// ============================================

interface BadgeCardProps {
  badge: Badge
  earned: boolean
}

function BadgeCard({ badge, earned }: BadgeCardProps) {
  if (earned) {
    return (
      <div
        className="flex flex-col items-center gap-2 p-3 rounded-xl transition-transform hover:scale-105"
        style={{ backgroundColor: badge.color }}
        title={badge.description}
      >
        <div className="w-10 h-10 flex items-center justify-center">
          <BadgeIcon iconName={badge.icon_name} className="w-6 h-6 text-white" />
        </div>
        <span className="text-body-xs font-semibold text-white text-center leading-tight line-clamp-2">
          {badge.name}
        </span>
        <span className="text-[10px] text-white/80 font-medium">Ganado</span>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-100 dark:bg-slate-700"
      title={badge.description}
    >
      <div className="w-10 h-10 flex items-center justify-center">
        <Lock className="w-6 h-6 text-gray-400 dark:text-slate-500" />
      </div>
      <span className="text-body-xs font-semibold text-gray-400 dark:text-slate-500 text-center leading-tight line-clamp-2">
        {badge.name}
      </span>
      <span className="text-[10px] text-gray-400 dark:text-slate-500 text-center leading-tight line-clamp-1">
        {badge.description}
      </span>
    </div>
  )
}

// ============================================
// Skeleton
// ============================================

function ProfileBadgesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* XP progress skeleton */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-border-light dark:border-slate-700 shadow-card p-6">
        <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-40 mb-4" />
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-100 dark:bg-slate-700 rounded-xl h-24" />
          ))}
        </div>
      </div>
      {/* Badges skeleton */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-border-light dark:border-slate-700 shadow-card p-6">
        <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-48 mb-6" />
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-gray-100 dark:bg-slate-700 rounded-xl h-24" />
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Main component
// ============================================

interface UserStatsData {
  xp: number
  level: number
  xp_to_next_level: number
  streak_days: number
  lessons_completed: number
  courses_completed: number
  badges_count: number
}

export function ProfileBadges() {
  const [stats, setStats] = useState<UserStatsData | null>(null)
  const [allBadges, setAllBadges] = useState<Badge[]>([])
  const [userBadges, setUserBadges] = useState<UserBadgeWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)

      const [statsResult, allBadgesResult, userBadgesResult] = await Promise.all([
        getUserStats(),
        getAllBadges(),
        getUserBadges(),
      ])

      if (statsResult.error) {
        setError(statsResult.error)
        setLoading(false)
        return
      }

      if (statsResult.data) {
        setStats({
          xp: statsResult.data.xp,
          level: statsResult.data.level,
          xp_to_next_level: statsResult.data.xp_to_next_level,
          streak_days: statsResult.data.streak_days,
          lessons_completed: statsResult.data.lessons_completed,
          courses_completed: statsResult.data.courses_completed,
          badges_count: statsResult.data.badges_count,
        })
      }

      setAllBadges(allBadgesResult.data ?? [])
      setUserBadges(userBadgesResult.data ?? [])
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) return <ProfileBadgesSkeleton />

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-border-light dark:border-slate-700 shadow-card p-8 text-center">
        <p className="text-error-500 font-medium">Error al cargar el perfil</p>
        <p className="text-foreground-secondary dark:text-slate-400 text-body-sm mt-1">{error}</p>
      </div>
    )
  }

  const earnedBadgeIds = new Set(userBadges.map(ub => ub.badge_id))

  // XP progress within current level
  // The action uses formula: level * (level + 1) * 50 for XP needed to reach next level
  const xpProgress = stats
    ? (() => {
        const level = stats.level
        const xpForCurrentLevel = (level - 1) * level * 50
        const xpForNextLevel = level * (level + 1) * 50
        const xpInCurrentLevel = Math.max(0, stats.xp - xpForCurrentLevel)
        const xpNeeded = xpForNextLevel - xpForCurrentLevel
        const percentage = xpNeeded > 0
          ? Math.min(100, Math.round((xpInCurrentLevel / xpNeeded) * 100))
          : 100
        return { xpInCurrentLevel, xpNeeded, percentage }
      })()
    : { xpInCurrentLevel: 0, xpNeeded: 100, percentage: 0 }

  return (
    <div className="space-y-6">
      {/* Section 1: Stats + XP Progress */}
      <section
        className="bg-white dark:bg-slate-800 rounded-xl border border-border-light dark:border-slate-700 shadow-card p-6"
        aria-label="Estadisticas y progreso de XP"
      >
        {/* Level + XP bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-display-xs text-foreground dark:text-slate-100 font-heading">
              Nivel {stats?.level ?? 1}
            </h2>
            <span className="text-body-sm font-medium text-foreground-secondary dark:text-slate-400">
              {xpProgress.xpInCurrentLevel}/{xpProgress.xpNeeded} XP
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="w-full h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={xpProgress.percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progreso de XP: ${xpProgress.percentage}%`}
          >
            <div
              className="h-full bg-gradient-primary rounded-full transition-all duration-700 ease-out"
              style={{ width: `${xpProgress.percentage}%` }}
            />
          </div>

          <p className="text-body-xs text-foreground-muted dark:text-slate-500 mt-1.5">
            {stats?.xp_to_next_level ?? 0} XP para el siguiente nivel
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={<BookOpen className="w-5 h-5" />}
            count={stats?.lessons_completed ?? 0}
            label="Lecciones completadas"
          />
          <StatCard
            icon={<GraduationCap className="w-5 h-5" />}
            count={stats?.courses_completed ?? 0}
            label="Cursos completados"
          />
          <StatCard
            icon={<Flame className="w-5 h-5" />}
            count={stats?.streak_days ?? 0}
            label="Racha actual"
          />
          <StatCard
            icon={<Award className="w-5 h-5" />}
            count={stats?.badges_count ?? 0}
            label="Badges ganados"
          />
        </div>
      </section>

      {/* Section 2: Badges Grid */}
      <section
        className="bg-white dark:bg-slate-800 rounded-xl border border-border-light dark:border-slate-700 shadow-card p-6"
        aria-label="Coleccion de badges"
      >
        <h2 className="text-display-xs text-foreground dark:text-slate-100 font-heading mb-6">
          Badges{' '}
          <span className="text-body-md font-normal text-foreground-secondary dark:text-slate-400">
            ({earnedBadgeIds.size} de {allBadges.length} ganados)
          </span>
        </h2>

        {allBadges.length === 0 ? (
          <p className="text-foreground-secondary dark:text-slate-400 text-body-sm text-center py-8">
            No hay badges disponibles todavia
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {allBadges.map(badge => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                earned={earnedBadgeIds.has(badge.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

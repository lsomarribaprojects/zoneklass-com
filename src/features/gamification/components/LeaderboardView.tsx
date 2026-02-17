'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Trophy, Crown, Medal, Award } from 'lucide-react'
import { getLeaderboard } from '@/actions/gamification'
import type { LeaderboardEntry } from '@/types/database'

type Period = 'weekly' | 'monthly' | 'all'

const PERIODS: { value: Period; label: string }[] = [
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'all', label: 'Total' },
]

// ============================================
// Avatar helper
// ============================================

function Avatar({
  src,
  name,
  size,
}: {
  src: string | null
  name: string | null
  size: number
}) {
  const initials = (name ?? 'U')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const sizeClass =
    size === 64
      ? 'w-16 h-16 text-xl'
      : size === 48
      ? 'w-12 h-12 text-base'
      : 'w-8 h-8 text-xs'

  if (src) {
    return (
      <div className={`${sizeClass} relative rounded-full overflow-hidden flex-shrink-0`}>
        <Image
          src={src}
          alt={name ?? 'Usuario'}
          fill
          className="object-cover"
          sizes={`${size}px`}
        />
      </div>
    )
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 font-semibold flex items-center justify-center flex-shrink-0`}
    >
      {initials}
    </div>
  )
}

// ============================================
// Level badge
// ============================================

function LevelBadge({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-semibold">
      Nv. {level}
    </span>
  )
}

// ============================================
// Podium card for positions 1-3
// ============================================

interface PodiumCardProps {
  entry: LeaderboardEntry
  rank: 1 | 2 | 3
}

const RANK_CONFIG = {
  1: {
    border: 'border-yellow-400 dark:border-yellow-500',
    accent: 'text-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-900/10',
    ring: 'ring-2 ring-yellow-400',
    label: 'text-yellow-600 dark:text-yellow-400',
    xpBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    xpText: 'text-yellow-700 dark:text-yellow-300',
    iconBg: 'bg-yellow-400',
    order: 'order-2',
    scale: 'sm:scale-105',
    avatarSize: 64,
  },
  2: {
    border: 'border-slate-400 dark:border-slate-500',
    accent: 'text-slate-500',
    bg: 'bg-slate-50 dark:bg-slate-700/20',
    ring: 'ring-2 ring-slate-400',
    label: 'text-slate-500 dark:text-slate-400',
    xpBg: 'bg-slate-100 dark:bg-slate-700/40',
    xpText: 'text-slate-600 dark:text-slate-300',
    iconBg: 'bg-slate-400',
    order: 'order-1',
    scale: '',
    avatarSize: 48,
  },
  3: {
    border: 'border-amber-600 dark:border-amber-700',
    accent: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-900/10',
    ring: 'ring-2 ring-amber-600',
    label: 'text-amber-600 dark:text-amber-500',
    xpBg: 'bg-amber-100 dark:bg-amber-900/30',
    xpText: 'text-amber-700 dark:text-amber-300',
    iconBg: 'bg-amber-600',
    order: 'order-3',
    scale: '',
    avatarSize: 48,
  },
}

function PodiumCard({ entry, rank }: PodiumCardProps) {
  const config = RANK_CONFIG[rank]
  const isFirst = rank === 1

  return (
    <div
      className={`
        flex-1 flex flex-col items-center p-4 sm:p-5 rounded-2xl border-2 transition-all
        ${config.border} ${config.bg} ${config.order} ${config.scale}
        ${entry.is_current_user ? 'shadow-elevated' : 'shadow-card'}
      `}
      aria-label={`Posición ${rank}: ${entry.profile.full_name ?? 'Usuario'}`}
    >
      {/* Position icon */}
      <div className={`relative mb-3 ${isFirst ? 'mb-4' : ''}`}>
        {isFirst && (
          <Crown
            className={`absolute -top-5 left-1/2 -translate-x-1/2 w-6 h-6 ${config.accent}`}
            aria-hidden="true"
          />
        )}
        <Avatar
          src={entry.profile.avatar_url}
          name={entry.profile.full_name}
          size={config.avatarSize as 64 | 48 | 32}
        />
        <span
          className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full ${config.iconBg} text-white text-xs font-bold flex items-center justify-center`}
        >
          {rank}
        </span>
      </div>

      {/* Name */}
      <p
        className={`font-semibold text-center text-foreground dark:text-slate-100 leading-tight mt-2 ${isFirst ? 'text-base' : 'text-sm'}`}
      >
        {entry.profile.full_name ?? 'Usuario'}
      </p>

      {/* Level */}
      <div className="mt-1.5">
        <LevelBadge level={entry.profile.level} />
      </div>

      {/* XP */}
      <div className={`mt-2 px-3 py-1 rounded-full ${config.xpBg}`}>
        <span className={`font-bold text-sm ${config.xpText}`}>
          {entry.profile.xp.toLocaleString('es')} XP
        </span>
      </div>

      {/* Badges count */}
      {entry.badges_count > 0 && (
        <div className="mt-1.5 flex items-center gap-1">
          <Award className={`w-3.5 h-3.5 ${config.label}`} aria-hidden="true" />
          <span className={`text-xs ${config.label}`}>{entry.badges_count} badges</span>
        </div>
      )}
    </div>
  )
}

// ============================================
// Table row for positions 4-20
// ============================================

function LeaderboardRow({
  entry,
  isEven,
}: {
  entry: LeaderboardEntry
  isEven: boolean
}) {
  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
        ${
          entry.is_current_user
            ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500'
            : isEven
            ? 'bg-white dark:bg-slate-800'
            : 'bg-slate-50/60 dark:bg-slate-800/60'
        }
      `}
      aria-label={`Posición ${entry.position}: ${entry.profile.full_name ?? 'Usuario'}`}
    >
      {/* Position number */}
      <span className="w-7 text-center text-sm font-semibold text-foreground-secondary dark:text-slate-400 flex-shrink-0">
        {entry.position}
      </span>

      {/* Avatar */}
      <Avatar src={entry.profile.avatar_url} name={entry.profile.full_name} size={32} />

      {/* Name + level */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground dark:text-slate-100 truncate">
          {entry.profile.full_name ?? 'Usuario'}
          {entry.is_current_user && (
            <span className="ml-2 text-xs text-primary-500 font-normal">(Tú)</span>
          )}
        </p>
        <LevelBadge level={entry.profile.level} />
      </div>

      {/* XP */}
      <span className="text-sm font-semibold text-foreground dark:text-slate-200 flex-shrink-0">
        {entry.profile.xp.toLocaleString('es')} XP
      </span>

      {/* Badges */}
      <div className="hidden sm:flex items-center gap-1 w-20 justify-end flex-shrink-0">
        {entry.badges_count > 0 && (
          <>
            <Medal className="w-4 h-4 text-foreground-muted dark:text-slate-500" aria-hidden="true" />
            <span className="text-xs text-foreground-secondary dark:text-slate-400">
              {entry.badges_count}
            </span>
          </>
        )}
      </div>
    </div>
  )
}

// ============================================
// Skeleton loader
// ============================================

function LeaderboardSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Podium skeleton */}
      <div className="flex gap-3 items-end mb-8">
        {[48, 64, 48].map((size, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
          >
            <div
              className={`rounded-full bg-gray-200 dark:bg-slate-700`}
              style={{ width: size, height: size }}
            />
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20" />
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-16" />
          </div>
        ))}
      </div>

      {/* Rows skeleton */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-slate-800"
        >
          <div className="w-7 h-4 bg-gray-200 dark:bg-slate-700 rounded" />
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32 mb-1" />
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-16" />
          </div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20" />
        </div>
      ))}
    </div>
  )
}

// ============================================
// Empty state
// ============================================

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 mb-4">
        <Trophy className="w-8 h-8 text-primary-400" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-foreground dark:text-slate-100 mb-2">
        No hay datos para este periodo
      </h3>
      <p className="text-foreground-secondary dark:text-slate-400 max-w-xs">
        Completa lecciones y participa en la comunidad para aparecer en el leaderboard.
      </p>
    </div>
  )
}

// ============================================
// Main component
// ============================================

export function LeaderboardView() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [activePeriod, setActivePeriod] = useState<Period>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadLeaderboard() {
      setLoading(true)
      const result = await getLeaderboard(activePeriod)
      if (result.data) {
        setEntries(result.data)
      } else {
        setEntries([])
      }
      setLoading(false)
    }

    loadLeaderboard()
  }, [activePeriod])

  const topThree = entries.slice(0, 3)
  const rest = entries.slice(3)

  // Arrange podium: silver (2) | gold (1) | bronze (3)
  const podiumOrder: (LeaderboardEntry | undefined)[] = [
    topThree[1], // position 2 on left
    topThree[0], // position 1 in center
    topThree[2], // position 3 on right
  ]

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <Trophy className="w-7 h-7 text-primary-500" aria-hidden="true" />
            <h1 className="text-display-sm text-[#0F172A] dark:text-slate-100 font-heading">
              Leaderboard
            </h1>
          </div>
          <p className="text-foreground-secondary dark:text-slate-400 mt-1 ml-10">
            Compite con los mejores estudiantes
          </p>
        </header>

        {/* Period tabs */}
        <nav aria-label="Periodo del leaderboard" className="mb-8">
          <div className="flex gap-2">
            {PERIODS.map((period) => (
              <button
                key={period.value}
                onClick={() => setActivePeriod(period.value)}
                aria-pressed={activePeriod === period.value}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
                  ${
                    activePeriod === period.value
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-foreground-secondary dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 border border-border-light dark:border-slate-700'
                  }
                `}
              >
                {period.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        {loading ? (
          <LeaderboardSkeleton />
        ) : entries.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-border-light dark:border-slate-700 shadow-card">
            <EmptyState />
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Podium — top 3 */}
            {topThree.length > 0 && (
              <section aria-label="Top 3 estudiantes">
                <div className="flex gap-3 items-end">
                  {podiumOrder.map((entry, idx) => {
                    if (!entry) return <div key={idx} className="flex-1" />
                    const rank = (entry.position as 1 | 2 | 3)
                    return <PodiumCard key={entry.profile.id} entry={entry} rank={rank} />
                  })}
                </div>
              </section>
            )}

            {/* Positions 4-20 */}
            {rest.length > 0 && (
              <section
                aria-label="Posiciones 4 al 20"
                className="bg-white dark:bg-slate-800 rounded-xl border border-border-light dark:border-slate-700 shadow-card overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-border-light dark:border-slate-700">
                  <h2 className="text-sm font-semibold text-foreground-secondary dark:text-slate-400 uppercase tracking-wide">
                    Clasificacion
                  </h2>
                </div>
                <div className="divide-y divide-border-light dark:divide-slate-700/50">
                  {rest.map((entry, idx) => (
                    <LeaderboardRow key={entry.profile.id} entry={entry} isEven={idx % 2 === 0} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

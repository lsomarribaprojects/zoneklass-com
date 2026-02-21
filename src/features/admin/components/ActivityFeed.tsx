'use client'

import { UserPlus, BookOpen, CheckCircle } from 'lucide-react'
import type { ActivityEvent } from '@/actions/admin'

interface ActivityFeedProps {
  events: ActivityEvent[]
  loading: boolean
}

const iconMap = {
  registration: { icon: UserPlus, color: 'text-primary-500 bg-primary-100 dark:bg-primary-900/30' },
  enrollment: { icon: BookOpen, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
  completion: { icon: CheckCircle, color: 'text-green-500 bg-green-100 dark:bg-green-900/30' },
}

function timeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
  if (seconds < 60) return 'hace un momento'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `hace ${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours}h`
  const days = Math.floor(hours / 24)
  return `hace ${days}d`
}

export function ActivityFeed({ events, loading }: ActivityFeedProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-slate-700" />
            <div className="flex-1">
              <div className="h-4 w-48 bg-gray-200 dark:bg-slate-700 rounded" />
            </div>
            <div className="h-3 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <p className="text-center text-foreground-muted py-8 text-sm">
        No hay actividad reciente
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {events.map((event, i) => {
        const { icon: Icon, color } = iconMap[event.type]
        return (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">
                <span className="font-medium">{event.userName}</span>{' '}
                <span className="text-foreground-secondary">{event.description}</span>
              </p>
            </div>
            <span className="text-xs text-foreground-muted whitespace-nowrap flex-shrink-0">
              {timeAgo(event.timestamp)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

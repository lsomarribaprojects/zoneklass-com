'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell,
  Heart,
  MessageCircle,
  Mail,
  Award,
  TrendingUp,
  Check,
} from 'lucide-react'
import {
  getUnreadNotificationCount,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '@/actions/community'
import type { Notification } from '@/types/database'
import { timeAgo } from '@/lib/utils/time'

// Icon mapping por tipo de notificación
const NOTIFICATION_ICONS = {
  like: { icon: Heart, color: 'text-error-500' },
  comment: { icon: MessageCircle, color: 'text-blue-500' },
  reply: { icon: MessageCircle, color: 'text-blue-500' },
  dm: { icon: Mail, color: 'text-primary-500' },
  badge: { icon: Award, color: 'text-amber-500' },
  level_up: { icon: TrendingUp, color: 'text-emerald-500' },
}

export function NotificationDropdown() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch unread count
  const fetchUnreadCount = async () => {
    const { count } = await getUnreadNotificationCount()
    setUnreadCount(count)
  }

  // Fetch notifications when dropdown opens
  const fetchNotifications = async () => {
    setLoading(true)
    const { data } = await getNotifications(20)
    if (data) {
      setNotifications(data)
    }
    setLoading(false)
  }

  // Poll unread count every 30 seconds
  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen && notifications.length === 0) {
      fetchNotifications()
    }
  }, [isOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Handle notification click
  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.is_read) {
      await markNotificationRead(notification.id)
      setUnreadCount(prev => Math.max(0, prev - 1))
      setNotifications(prev =>
        prev.map(n => (n.id === notification.id ? { ...n, is_read: true } : n))
      )
    }

    // Navigate to link if present
    if (notification.link) {
      router.push(notification.link)
      setIsOpen(false)
    }
  }

  // Mark all as read
  const handleMarkAllRead = async () => {
    await markAllNotificationsRead()
    setUnreadCount(0)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="w-5 h-5 text-foreground-secondary dark:text-slate-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 max-h-96 bg-white dark:bg-slate-800 rounded-xl shadow-elevated border border-border-light dark:border-slate-700 overflow-hidden animate-scale-in z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-light dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
            <h3 className="text-sm font-semibold text-foreground dark:text-slate-100">
              Notificaciones
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors"
              >
                <Check className="w-3 h-3" />
                Marcar todas leídas
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-80">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <Bell className="w-12 h-12 text-foreground-muted dark:text-slate-600 mb-2" />
                <p className="text-sm text-foreground-secondary dark:text-slate-400">
                  No tienes notificaciones
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border-light dark:divide-slate-700">
                {notifications.map(notification => {
                  const iconData = NOTIFICATION_ICONS[notification.type]
                  const Icon = iconData.icon
                  const isUnread = !notification.is_read

                  return (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${
                        isUnread ? 'border-l-2 border-primary-500 bg-primary-50/30 dark:bg-primary-900/10' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          <div className={`w-8 h-8 rounded-full ${isUnread ? 'bg-white dark:bg-slate-800' : 'bg-gray-100 dark:bg-slate-700'} flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 ${iconData.color}`} />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${isUnread ? 'font-semibold text-foreground dark:text-slate-100' : 'font-medium text-foreground-secondary dark:text-slate-300'}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-foreground-secondary dark:text-slate-400 line-clamp-2 mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-foreground-muted dark:text-slate-500 mt-1">
                            {timeAgo(notification.created_at)}
                          </p>
                        </div>

                        {/* Unread indicator */}
                        {isUnread && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-primary-500 rounded-full" />
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

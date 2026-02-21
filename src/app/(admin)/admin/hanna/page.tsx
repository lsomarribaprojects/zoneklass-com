'use client'

import { useState, useEffect, useCallback } from 'react'
import { MessageCircle, Star, ThumbsUp, Activity, Bot } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HannaConversationModal, HannaConfigCard } from '@/features/admin/components'
import {
  getHannaStats,
  getHannaConversations,
  getHannaConfigs,
} from '@/actions/admin'
import type { HannaStats, HannaConversationListItem } from '@/actions/admin'
import type { HannaConfig, HannaMode } from '@/types/database'

const MODE_OPTIONS = [
  { value: 'all', label: 'Todos los modos' },
  { value: 'tutora', label: 'Tutora' },
  { value: 'code_review', label: 'Code Review' },
  { value: 'orientadora', label: 'Orientadora' },
  { value: 'motivadora', label: 'Motivadora' },
  { value: 'estudio', label: 'Estudio' },
  { value: 'evaluadora', label: 'Evaluadora' },
]

const RATING_OPTIONS = [
  { value: '0', label: 'Todas las calificaciones' },
  { value: '1', label: '1+ estrellas' },
  { value: '2', label: '2+ estrellas' },
  { value: '3', label: '3+ estrellas' },
  { value: '4', label: '4+ estrellas' },
  { value: '5', label: '5 estrellas' },
]

const MODE_LABELS: Record<string, string> = {
  tutora: 'Tutora',
  code_review: 'Code Review',
  orientadora: 'Orientadora',
  motivadora: 'Motivadora',
  estudio: 'Estudio',
  evaluadora: 'Evaluadora',
}

const MODE_BADGE_COLORS: Record<string, string> = {
  tutora: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  code_review: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  orientadora: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  motivadora: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  estudio: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  evaluadora: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

interface StatCardProps {
  title: string
  value: string | number
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

export default function AdminHannaPage() {
  const [activeTab, setActiveTab] = useState<'conversations' | 'config'>('conversations')
  const [stats, setStats] = useState<HannaStats | null>(null)
  const [conversations, setConversations] = useState<HannaConversationListItem[]>([])
  const [totalConvCount, setTotalConvCount] = useState(0)
  const [configs, setConfigs] = useState<HannaConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [configsLoading, setConfigsLoading] = useState(true)

  // Filters
  const [modeFilter, setModeFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('0')
  const [page, setPage] = useState(1)
  const perPage = 20

  // Modal
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  const fetchConversations = useCallback(async () => {
    setLoading(true)
    const { data } = await getHannaConversations({
      mode: modeFilter,
      minRating: parseInt(ratingFilter) || undefined,
      page,
      perPage,
    })
    if (data) {
      setConversations(data.conversations)
      setTotalConvCount(data.totalCount)
    }
    setLoading(false)
  }, [modeFilter, ratingFilter, page])

  useEffect(() => {
    getHannaStats().then(({ data }) => {
      if (data) setStats(data)
    })
    fetchConversations()
  }, [fetchConversations])

  useEffect(() => {
    if (activeTab === 'config' && configsLoading) {
      getHannaConfigs().then(({ data }) => {
        if (data) setConfigs(data)
        setConfigsLoading(false)
      })
    }
  }, [activeTab, configsLoading])

  useEffect(() => {
    setPage(1)
  }, [modeFilter, ratingFilter])

  const totalPages = Math.ceil(totalConvCount / perPage)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Bot className="w-8 h-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-foreground">Hanna IA</h1>
        </div>
        <p className="text-foreground-secondary">Metricas y configuracion del tutor IA</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Conversaciones"
          value={stats?.totalConversations || 0}
          icon={<MessageCircle className="w-6 h-6 text-white" />}
          iconBgColor="bg-primary-500"
          loading={!stats}
        />
        <StatCard
          title="Rating Promedio"
          value={stats?.avgRating ? stats.avgRating.toFixed(1) : '-'}
          icon={<Star className="w-6 h-6 text-white" />}
          iconBgColor="bg-yellow-500"
          loading={!stats}
        />
        <StatCard
          title="Satisfaccion"
          value={stats ? `${stats.satisfactionPercent}%` : '-'}
          icon={<ThumbsUp className="w-6 h-6 text-white" />}
          iconBgColor="bg-green-500"
          loading={!stats}
        />
        <StatCard
          title="Mensajes / Dia"
          value={stats?.messagesPerDay || 0}
          icon={<Activity className="w-6 h-6 text-white" />}
          iconBgColor="bg-blue-500"
          loading={!stats}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('conversations')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'conversations'
              ? 'bg-white dark:bg-slate-700 text-foreground shadow-sm'
              : 'text-foreground-muted hover:text-foreground'
          }`}
        >
          Conversaciones
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'config'
              ? 'bg-white dark:bg-slate-700 text-foreground shadow-sm'
              : 'text-foreground-muted hover:text-foreground'
          }`}
        >
          Configuracion
        </button>
      </div>

      {/* Tab: Conversations */}
      {activeTab === 'conversations' && (
        <>
          {/* Filters */}
          <Card>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="px-4 py-2.5 bg-surface text-foreground border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
              >
                {MODE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-4 py-2.5 bg-surface text-foreground border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
              >
                {RATING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <p className="text-sm text-foreground-muted self-center ml-auto">
                {totalConvCount} conversaciones
              </p>
            </div>
          </Card>

          {/* Conversations Table (Desktop) */}
          <div className="hidden md:block">
            <Card className="overflow-hidden" padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-gray-50 dark:bg-slate-800/50">
                      <th className="text-left text-xs font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">Usuario</th>
                      <th className="text-left text-xs font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">Modo</th>
                      <th className="text-center text-xs font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">Mensajes</th>
                      <th className="text-center text-xs font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">Rating</th>
                      <th className="text-left text-xs font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-4 py-3"><div className="h-4 w-28 bg-gray-200 dark:bg-slate-700 rounded" /></td>
                          <td className="px-4 py-3"><div className="h-6 w-20 bg-gray-200 dark:bg-slate-700 rounded-full" /></td>
                          <td className="px-4 py-3 text-center"><div className="h-4 w-8 bg-gray-200 dark:bg-slate-700 rounded mx-auto" /></td>
                          <td className="px-4 py-3 text-center"><div className="h-4 w-8 bg-gray-200 dark:bg-slate-700 rounded mx-auto" /></td>
                          <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded" /></td>
                        </tr>
                      ))
                    ) : conversations.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12">
                          <MessageCircle className="w-10 h-10 text-foreground-muted mx-auto mb-2" />
                          <p className="text-foreground-muted text-sm">No hay conversaciones</p>
                        </td>
                      </tr>
                    ) : (
                      conversations.map((conv) => (
                        <tr
                          key={conv.id}
                          className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                          onClick={() => setSelectedConversationId(conv.id)}
                        >
                          <td className="px-4 py-3 text-sm font-medium text-foreground">
                            {conv.userName}
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={MODE_BADGE_COLORS[conv.mode] || ''}>
                              {MODE_LABELS[conv.mode] || conv.mode}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-foreground tabular-nums">
                            {conv.messageCount}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {conv.rating ? (
                              <div className="flex items-center justify-center gap-1 text-yellow-500">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="text-sm font-medium">{conv.rating}</span>
                              </div>
                            ) : (
                              <span className="text-foreground-muted text-sm">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground-secondary">
                            {new Date(conv.createdAt).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Conversations Cards (Mobile) */}
          <div className="md:hidden space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded" />
                    <div className="h-3 w-48 bg-gray-200 dark:bg-slate-700 rounded" />
                  </div>
                </Card>
              ))
            ) : conversations.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <MessageCircle className="w-10 h-10 text-foreground-muted mx-auto mb-2" />
                  <p className="text-foreground-muted text-sm">No hay conversaciones</p>
                </div>
              </Card>
            ) : (
              conversations.map((conv) => (
                <Card
                  key={conv.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedConversationId(conv.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-foreground">{conv.userName}</p>
                    {conv.rating && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-sm font-medium">{conv.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={MODE_BADGE_COLORS[conv.mode] || ''}>
                      {MODE_LABELS[conv.mode] || conv.mode}
                    </Badge>
                    <span className="text-xs text-foreground-muted">{conv.messageCount} mensajes</span>
                    <span className="text-xs text-foreground-muted ml-auto">
                      {new Date(conv.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground-secondary">
                Pagina {page} de {totalPages}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                  Siguiente
                </Button>
              </div>
            </div>
          )}

          {/* Conversation Modal */}
          <HannaConversationModal
            conversationId={selectedConversationId}
            isOpen={!!selectedConversationId}
            onClose={() => setSelectedConversationId(null)}
          />
        </>
      )}

      {/* Tab: Configuration */}
      {activeTab === 'config' && (
        <div className="space-y-4">
          {configsLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <div className="space-y-3 animate-pulse">
                    <div className="h-5 w-24 bg-gray-200 dark:bg-slate-700 rounded" />
                    <div className="h-24 bg-gray-200 dark:bg-slate-700 rounded" />
                    <div className="flex gap-3">
                      <div className="h-8 flex-1 bg-gray-200 dark:bg-slate-700 rounded" />
                      <div className="h-8 flex-1 bg-gray-200 dark:bg-slate-700 rounded" />
                      <div className="h-8 flex-1 bg-gray-200 dark:bg-slate-700 rounded" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : configs.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Bot className="w-10 h-10 text-foreground-muted mx-auto mb-2" />
                <p className="text-foreground-muted">No hay configuraciones de Hanna</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {configs.map((config) => (
                <HannaConfigCard
                  key={config.id}
                  config={config}
                  onUpdated={() => setConfigsLoading(true)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useChatStore } from '@/features/hanna/store/chatStore'
import { HANNA_MODE_LABELS } from '@/features/hanna/types'
import type { HannaConversation } from '@/features/hanna/types'

// ============================================
// HANNA AI TUTOR - ConversationList Component
// ============================================

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'ahora'
  if (minutes < 60) return `hace ${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours}h`
  const days = Math.floor(hours / 24)
  return `hace ${days}d`
}

export function ConversationList() {
  const { setCurrentConversation, toggleHistory, setConversations, conversations } = useChatStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClient()
        const { data, error: sbError } = await supabase
          .from('hanna_conversations')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(20)

        if (cancelled) return
        if (sbError) throw sbError
        setConversations((data as HannaConversation[]) ?? [])
      } catch {
        if (!cancelled) setError('No se pudieron cargar las conversaciones.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [setConversations])

  function handleSelect(conv: HannaConversation) {
    setCurrentConversation(conv)
    toggleHistory()
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-foreground-secondary dark:text-slate-400">Cargando historial...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <p className="text-sm text-error-500 text-center">{error}</p>
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <MessageSquare className="w-12 h-12 text-foreground-muted dark:text-slate-600 mb-3" />
        <p className="text-sm font-medium text-foreground-secondary dark:text-slate-400">
          No hay conversaciones previas
        </p>
        <p className="text-xs text-foreground-muted dark:text-slate-500 mt-1">
          Tus chats con Hanna apareceran aqui
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto" role="list" aria-label="Historial de conversaciones">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          type="button"
          onClick={() => handleSelect(conv)}
          role="listitem"
          className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700/50 transition-colors text-left focus-visible:outline-none focus-visible:bg-primary-50 dark:focus-visible:bg-primary-900/20"
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mt-0.5">
            <MessageSquare className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-sm font-medium text-foreground dark:text-slate-100 truncate">
                {conv.title}
              </p>
              <span className="flex-shrink-0 flex items-center gap-0.5 text-[10px] text-foreground-muted dark:text-slate-500">
                <Clock className="w-3 h-3" />
                {relativeTime(conv.updated_at)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-[10px] font-medium">
                {HANNA_MODE_LABELS[conv.mode]}
              </span>
              <span className="text-[10px] text-foreground-muted dark:text-slate-500">
                {conv.messages.length} {conv.messages.length === 1 ? 'mensaje' : 'mensajes'}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

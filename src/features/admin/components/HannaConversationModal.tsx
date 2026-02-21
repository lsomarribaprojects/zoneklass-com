'use client'

import { useState, useEffect } from 'react'
import { X, Star, Bot, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getHannaConversation } from '@/actions/admin'
import type { HannaConversation } from '@/types/database'

interface HannaConversationModalProps {
  conversationId: string | null
  isOpen: boolean
  onClose: () => void
}

const MODE_LABELS: Record<string, string> = {
  tutora: 'Tutora',
  code_review: 'Code Review',
  orientadora: 'Orientadora',
  motivadora: 'Motivadora',
  estudio: 'Estudio',
  evaluadora: 'Evaluadora',
}

export function HannaConversationModal({ conversationId, isOpen, onClose }: HannaConversationModalProps) {
  const [conversation, setConversation] = useState<HannaConversation | null>(null)
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!conversationId || !isOpen) return
    setLoading(true)
    getHannaConversation(conversationId).then(({ data }) => {
      if (data) {
        setConversation(data.conversation)
        setUserName(data.userName)
      }
      setLoading(false)
    })
  }, [conversationId, isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[80vh] bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {loading ? 'Cargando...' : conversation?.title || 'Conversacion'}
            </h3>
            {conversation && (
              <>
                <Badge className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                  {MODE_LABELS[conversation.mode] || conversation.mode}
                </Badge>
                {conversation.rating && (
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{conversation.rating}</span>
                  </div>
                )}
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5 text-foreground-muted" />
          </button>
        </div>

        {/* User info */}
        {!loading && userName && (
          <div className="px-4 py-2 text-xs text-foreground-muted border-b border-border">
            Usuario: <span className="font-medium text-foreground-secondary">{userName}</span>
            {conversation && (
              <span className="ml-3">
                {new Date(conversation.created_at).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <div className="h-16 w-64 bg-gray-200 dark:bg-slate-700 animate-pulse rounded-2xl" />
                </div>
              ))}
            </div>
          ) : conversation?.messages?.length ? (
            conversation.messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary-500 text-white rounded-br-md'
                      : 'bg-gray-100 dark:bg-slate-700 text-foreground rounded-bl-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-gray-300 dark:bg-slate-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-foreground-muted text-sm py-8">Sin mensajes</p>
          )}
        </div>
      </div>
    </div>
  )
}

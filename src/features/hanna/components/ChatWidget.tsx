'use client'

import { useRef, useEffect, useState } from 'react'
import { Bot, X, Clock, Plus, ChevronDown } from 'lucide-react'
import { useChatStore } from '@/features/hanna/store/chatStore'
import {
  HANNA_MODE_LABELS,
  HANNA_MODE_DESCRIPTIONS,
  type HannaMode,
} from '@/features/hanna/types'
import { ChatMessage, StreamingBubble } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { ConversationList } from './ConversationList'
import { RatingModal } from './RatingModal'
import { createClient } from '@/lib/supabase/client'
import type { HannaConversation } from '@/features/hanna/types'

// ============================================
// HANNA AI TUTOR - ChatWidget (Main Orchestrator)
// ============================================

const MODES = Object.keys(HANNA_MODE_LABELS) as HannaMode[]

export function ChatWidget() {
  const {
    isOpen,
    showHistory,
    showRating,
    currentConversation,
    mode,
    isStreaming,
    streamingContent,
    lessonContext,
    toggleOpen,
    toggleHistory,
    setMode,
    addMessage,
    newConversation,
    setConversations,
    setCurrentConversation,
    startStreaming,
    appendStreamContent,
    finishStreaming,
    setShowRating,
  } = useChatStore()

  const [inputValue, setInputValue] = useState('')
  const [showModeMenu, setShowModeMenu] = useState(false)
  const [pendingConvId, setPendingConvId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const modeMenuRef = useRef<HTMLDivElement>(null)

  // Auto-scroll on new messages or streaming updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentConversation?.messages, streamingContent])

  // Close mode menu on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (modeMenuRef.current && !modeMenuRef.current.contains(e.target as Node)) {
        setShowModeMenu(false)
      }
    }
    if (showModeMenu) document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [showModeMenu])

  function handleClose() {
    const hasMessages = (currentConversation?.messages.length ?? 0) > 0
    const hasRating = currentConversation?.rating !== null && currentConversation?.rating !== undefined
    if (hasMessages && !hasRating) {
      setShowRating(true)
    } else {
      toggleOpen()
    }
  }

  async function loadConversations() {
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('hanna_conversations')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(20)
      if (data) setConversations(data as HannaConversation[])
    } catch {
      // Non-critical
    }
  }

  async function sendMessage() {
    const text = inputValue.trim()
    if (!text || isStreaming) return

    setInputValue('')

    const userMessage = {
      role: 'user' as const,
      content: text,
      timestamp: new Date().toISOString(),
    }

    // Ensure a conversation shell exists before adding the message
    const convId = pendingConvId ?? currentConversation?.id
    if (!currentConversation) {
      const shell: HannaConversation = {
        id: convId ?? '',
        user_id: '',
        title: text.slice(0, 60),
        mode,
        messages: [],
        rating: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setCurrentConversation(shell)
    }

    addMessage(userMessage)
    startStreaming()

    let fullContent = ''
    let resolvedConvId = convId ?? ''

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationId: convId || undefined,
          mode,
          lessonContext: lessonContext ?? undefined,
        }),
      })

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (raw === '[DONE]') continue

          try {
            const parsed: unknown = JSON.parse(raw)
            if (typeof parsed !== 'object' || parsed === null) continue
            const event = parsed as Record<string, unknown>

            if (typeof event.conversationId === 'string') {
              resolvedConvId = event.conversationId
              setPendingConvId(resolvedConvId)
            } else if (typeof event.content === 'string') {
              fullContent += event.content
              appendStreamContent(event.content)
            }
          } catch {
            // Malformed SSE line - skip
          }
        }
      }
    } catch (err) {
      fullContent = 'Lo siento, hubo un error al procesar tu mensaje. Intentalo de nuevo.'
    } finally {
      finishStreaming(fullContent)

      // Ensure conversation has the correct ID after first exchange
      if (resolvedConvId && !currentConversation?.id) {
        setCurrentConversation({
          id: resolvedConvId,
          user_id: '',
          title: text.slice(0, 60),
          mode,
          messages: [
            userMessage,
            {
              role: 'assistant',
              content: fullContent,
              timestamp: new Date().toISOString(),
            },
          ],
          rating: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }

      // Refresh conversation list in background
      loadConversations()
    }
  }

  const messages = currentConversation?.messages ?? []

  return (
    <>
      {/* Floating trigger button */}
      {!isOpen && (
        <button
          type="button"
          onClick={toggleOpen}
          aria-label="Abrir asistente Hanna"
          className="fixed bottom-20 right-6 lg:bottom-6 z-50 w-14 h-14 rounded-full bg-gradient-primary text-white shadow-elevated flex items-center justify-center hover:scale-105 active:scale-95 transition-transform focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          <Bot className="w-6 h-6" />
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-primary-500 opacity-30 animate-ping" aria-hidden="true" />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Chat con Hanna IA"
          aria-modal="true"
          className="fixed inset-0 lg:inset-auto lg:bottom-6 lg:right-6 lg:w-[400px] lg:h-[600px] z-50 flex flex-col bg-white dark:bg-[--color-surface] lg:rounded-2xl lg:shadow-modal overflow-hidden animate-slide-up"
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-[--color-surface] flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>

            <h2 className="font-heading text-base font-semibold text-foreground dark:text-slate-100 flex-shrink-0">
              Hanna
            </h2>

            {/* Mode selector */}
            <div className="relative flex-1" ref={modeMenuRef}>
              <button
                type="button"
                onClick={() => setShowModeMenu((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={showModeMenu}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                {HANNA_MODE_LABELS[mode]}
                <ChevronDown className={`w-3 h-3 transition-transform ${showModeMenu ? 'rotate-180' : ''}`} />
              </button>

              {showModeMenu && (
                <div
                  role="listbox"
                  aria-label="Seleccionar modo de Hanna"
                  className="absolute top-full left-0 mt-1 w-52 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-elevated z-20 overflow-hidden animate-scale-in"
                >
                  {MODES.map((m) => (
                    <button
                      key={m}
                      type="button"
                      role="option"
                      aria-selected={mode === m}
                      onClick={() => { setMode(m); setShowModeMenu(false) }}
                      className={`w-full text-left px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
                        mode === m ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                      }`}
                    >
                      <p className={`text-xs font-semibold ${mode === m ? 'text-primary-600 dark:text-primary-400' : 'text-foreground dark:text-slate-100'}`}>
                        {HANNA_MODE_LABELS[m]}
                      </p>
                      <p className="text-[10px] text-foreground-muted dark:text-slate-500 mt-0.5">
                        {HANNA_MODE_DESCRIPTIONS[m]}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Header actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={newConversation}
                aria-label="Nueva conversacion"
                title="Nueva conversacion"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground-secondary dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <Plus className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={toggleHistory}
                aria-label={showHistory ? 'Ocultar historial' : 'Ver historial'}
                title="Historial"
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 ${
                  showHistory
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/30'
                    : 'text-foreground-secondary dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                <Clock className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Cerrar chat"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground-secondary dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body area */}
          <div className="flex-1 relative overflow-hidden">
            {/* History overlay */}
            {showHistory && (
              <div className="absolute inset-0 z-10 bg-white dark:bg-[--color-surface] flex flex-col animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                  <h3 className="text-sm font-semibold text-foreground dark:text-slate-100">
                    Historial de conversaciones
                  </h3>
                </div>
                <ConversationList />
              </div>
            )}

            {/* Rating overlay */}
            {showRating && <RatingModal />}

            {/* Messages area */}
            <div
              className="h-full overflow-y-auto px-4 py-4 bg-gray-50 dark:bg-slate-900/50 flex flex-col gap-3"
              role="list"
              aria-label="Mensajes"
              aria-live="polite"
            >
              {messages.length === 0 && !isStreaming && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
                    <Bot className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-foreground dark:text-slate-100 mb-1">
                    Hola, soy Hanna
                  </p>
                  <p className="text-xs text-foreground-secondary dark:text-slate-400 max-w-[220px] leading-relaxed">
                    Tu tutora de IA. Estoy en modo{' '}
                    <strong className="text-primary-600 dark:text-primary-400">
                      {HANNA_MODE_LABELS[mode]}
                    </strong>
                    . En que te puedo ayudar?
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} />
              ))}

              {isStreaming && <StreamingBubble content={streamingContent} />}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={sendMessage}
            isDisabled={isStreaming}
          />
        </div>
      )}
    </>
  )
}

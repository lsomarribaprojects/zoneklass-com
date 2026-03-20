'use client'

import { useState, useEffect, useRef } from 'react'
import type { AIContextType, AIConversationMessage } from '@/types/database'
import { X, Send, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AIChatMessage } from './AIChatMessage'
import { AIQuickActions } from './AIQuickActions'
import { sendMessage, getActiveConversation } from '@/actions/instructor-ai'

interface AIAssistantPanelProps {
  isOpen: boolean
  onClose: () => void
  contextType: AIContextType
  contextId?: string
  courseTitle?: string
  moduleTitle?: string
  lessonTitle?: string
  lessonContent?: string
}

export function AIAssistantPanel({
  isOpen,
  onClose,
  contextType,
  contextId,
  courseTitle,
  moduleTitle,
  lessonTitle,
  lessonContent
}: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<AIConversationMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [creditsRemaining, setCreditsRemaining] = useState<number | undefined>()
  const [conversationId, setConversationId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load active conversation on mount or when context changes
  useEffect(() => {
    if (isOpen) {
      loadActiveConversation()
    }
  }, [isOpen, contextType, contextId])

  const loadActiveConversation = async () => {
    const result = await getActiveConversation(contextType, contextId)

    if (result.error) {
      console.error('Error loading conversation:', result.error)
      return
    }

    if (result.conversation) {
      setMessages(result.conversation.messages || [])
      setConversationId(result.conversation.id)
    } else {
      // No active conversation, start fresh
      setMessages([])
      setConversationId(null)
    }
  }

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return

    const userMessage: AIConversationMessage = {
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toISOString()
    }

    // Optimistically add user message
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const result = await sendMessage(
        messageText.trim(),
        contextType,
        contextId,
        undefined // selectedText can be added later
      )

      if (result.error) {
        // Show error message
        const errorMessage: AIConversationMessage = {
          role: 'assistant',
          content: `Error: ${result.error}`,
          timestamp: new Date().toISOString()
        }
        setMessages(prev => [...prev, errorMessage])
      } else {
        // Add assistant response
        const assistantMessage: AIConversationMessage = {
          role: 'assistant',
          content: result.response || '',
          timestamp: new Date().toISOString()
        }
        setMessages(prev => [...prev, assistantMessage])
        setCreditsRemaining(result.creditsRemaining)
        setConversationId(result.conversationId)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: AIConversationMessage = {
        role: 'assistant',
        content: 'Lo siento, ocurrió un error al procesar tu mensaje.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (actionPrompt: string) => {
    handleSendMessage(actionPrompt)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  // Get context title for header
  const getContextTitle = () => {
    if (lessonTitle) return `Lección: ${lessonTitle}`
    if (courseTitle) return `Curso: ${courseTitle}`
    return 'Asistente AI'
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`
          fixed right-0 top-0 bottom-0 z-50
          w-full md:w-[400px]
          bg-white dark:bg-gray-900
          border-l border-gray-200 dark:border-gray-800
          shadow-2xl
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {getContextTitle()}
              </h2>
              {creditsRemaining !== undefined && (
                <Badge variant="success" className="text-xs mt-1">
                  {creditsRemaining} créditos
                </Badge>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="
              w-8 h-8 rounded-lg flex-shrink-0
              hover:bg-gray-200 dark:hover:bg-gray-700
              text-gray-700 dark:text-gray-300
              transition-colors
              flex items-center justify-center
            "
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <AIQuickActions
            contextType={contextType}
            onAction={handleQuickAction}
            disabled={isLoading}
          />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center px-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Asistente AI Listo
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pregúntame lo que necesites o usa las acciones rápidas de arriba
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <AIChatMessage key={idx} message={msg} />
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Pensando...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex gap-2">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta... (Enter para enviar)"
              disabled={isLoading}
              className="
                flex-1 resize-none
                px-4 py-3 rounded-xl
                bg-white dark:bg-gray-900
                border border-gray-300 dark:border-gray-700
                text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
                min-h-[44px] max-h-[120px]
              "
              rows={1}
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              variant="primary"
              size="md"
              className="h-[44px] w-[44px] p-0 flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

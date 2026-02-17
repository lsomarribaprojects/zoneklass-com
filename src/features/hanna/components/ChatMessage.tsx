'use client'

import type React from 'react'
import type { ChatMessage as ChatMessageType } from '@/features/hanna/types'

// ============================================
// HANNA AI TUTOR - ChatMessage Component
// ============================================

interface Props {
  message: ChatMessageType
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Renders message content with basic markdown support:
 * - Triple backtick code blocks
 * - Inline backtick code
 * - Bold (**text**)
 */
function renderContent(content: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let keyIndex = 0

  // Process code blocks first (``` ... ```)
  const codeBlockRegex = /```[\s\S]*?```/g
  const segments = content.split(codeBlockRegex)
  const codeBlocks = content.match(codeBlockRegex) ?? []

  segments.forEach((segment, i) => {
    if (segment) {
      parts.push(...renderInline(segment, keyIndex))
      keyIndex += 100
    }
    if (codeBlocks[i]) {
      const code = codeBlocks[i].replace(/^```[^\n]*\n?/, '').replace(/```$/, '')
      parts.push(
        <pre
          key={`code-${keyIndex++}`}
          className="my-2 p-3 bg-gray-900 dark:bg-black text-gray-100 rounded-lg text-xs overflow-x-auto font-mono leading-relaxed whitespace-pre-wrap"
        >
          {code}
        </pre>
      )
    }
  })

  return <>{parts}</>
}

function renderInline(text: string, baseKey: number): React.ReactNode[] {
  const result: React.ReactNode[] = []
  // Split on inline code and bold
  const regex = /(`[^`]+`|\*\*[^*]+\*\*)/g
  const parts = text.split(regex)

  parts.forEach((part, i) => {
    const key = baseKey + i
    if (part.startsWith('`') && part.endsWith('`')) {
      result.push(
        <code
          key={key}
          className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs font-mono"
        >
          {part.slice(1, -1)}
        </code>
      )
    } else if (part.startsWith('**') && part.endsWith('**')) {
      result.push(
        <strong key={key} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      )
    } else if (part) {
      result.push(<span key={key}>{part}</span>)
    }
  })

  return result
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`flex animate-slide-up ${isUser ? 'justify-end' : 'justify-start'}`}
      role="listitem"
    >
      <div className={`max-w-[80%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed break-words ${
            isUser
              ? 'bg-primary-500 text-white rounded-2xl rounded-br-md'
              : 'bg-gray-100 dark:bg-[--color-surface-elevated] text-foreground dark:text-slate-100 rounded-2xl rounded-bl-md border border-gray-200 dark:border-slate-700'
          }`}
        >
          {renderContent(message.content)}
        </div>
        <span
          className="mt-1 text-[10px] text-foreground-muted dark:text-slate-500 px-1"
          aria-label={`Enviado a las ${formatTime(message.timestamp)}`}
        >
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  )
}

// Streaming bubble shown while Hanna is typing
interface StreamingBubbleProps {
  content: string
}

export function StreamingBubble({ content }: StreamingBubbleProps) {
  return (
    <div className="flex justify-start animate-fade-in" role="listitem" aria-live="polite">
      <div className="max-w-[80%] flex flex-col items-start">
        <div className="px-4 py-2.5 text-sm leading-relaxed bg-gray-100 dark:bg-[--color-surface-elevated] text-foreground dark:text-slate-100 rounded-2xl rounded-bl-md border border-gray-200 dark:border-slate-700 break-words">
          {content ? (
            <>
              {renderContent(content)}
              <span className="inline-block w-1.5 h-4 bg-primary-500 ml-0.5 animate-pulse align-middle" />
            </>
          ) : (
            <span className="flex items-center gap-1 text-foreground-secondary dark:text-slate-400">
              <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

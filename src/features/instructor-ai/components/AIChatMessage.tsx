'use client'

import type { AIConversationMessage } from '@/types/database'

interface AIChatMessageProps {
  message: AIConversationMessage
  onInsertContent?: (html: string) => void
}

export function AIChatMessage({ message, onInsertContent }: AIChatMessageProps) {
  const isUser = message.role === 'user'
  const timestamp = new Date(message.timestamp).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })

  // Detect if message contains code blocks or HTML
  const hasCodeBlock = message.content.includes('```')
  const extractedHTML = hasCodeBlock
    ? message.content.match(/```(?:html)?\n([\s\S]*?)```/)?.[1]
    : null

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`
            rounded-2xl px-4 py-3 shadow-sm
            ${isUser
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
            }
          `}
        >
          {/* Message content with markdown-style rendering */}
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {message.content.split('\n').map((line, idx) => {
              // Handle bold text **text**
              if (line.includes('**')) {
                const parts = line.split(/\*\*(.*?)\*\*/g)
                return (
                  <p key={idx} className="mb-2 last:mb-0">
                    {parts.map((part, i) =>
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                    )}
                  </p>
                )
              }

              // Handle bullet lists
              if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                return (
                  <li key={idx} className="ml-4">
                    {line.trim().substring(2)}
                  </li>
                )
              }

              // Handle code blocks (render as pre)
              if (line.trim().startsWith('```')) {
                return null // Handled separately below
              }

              // Regular paragraph
              if (line.trim()) {
                return (
                  <p key={idx} className="mb-2 last:mb-0">
                    {line}
                  </p>
                )
              }

              return <br key={idx} />
            })}
          </div>

          {/* Code block rendering */}
          {hasCodeBlock && (
            <div className="mt-3 bg-gray-900 dark:bg-gray-950 rounded-lg p-3 overflow-x-auto">
              <pre className="text-xs text-gray-100">
                <code>{extractedHTML || message.content.match(/```[\s\S]*?```/)?.[0]}</code>
              </pre>
            </div>
          )}

          {/* Insert content button */}
          {extractedHTML && onInsertContent && (
            <button
              onClick={() => onInsertContent(extractedHTML)}
              className="mt-2 text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Insertar en lección
            </button>
          )}
        </div>

        {/* Timestamp */}
        <div
          className={`text-xs text-gray-500 dark:text-gray-400 mt-1 px-2 ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {timestamp}
        </div>
      </div>
    </div>
  )
}

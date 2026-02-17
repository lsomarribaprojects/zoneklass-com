'use client'

import { useRef, useEffect, type KeyboardEvent, type ChangeEvent } from 'react'
import { SendHorizontal } from 'lucide-react'

// ============================================
// HANNA AI TUTOR - ChatInput Component
// ============================================

interface Props {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  isDisabled?: boolean
}

export function ChatInput({ value, onChange, onSend, isDisabled = false }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea up to 4 rows
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    const lineHeight = 22
    const maxHeight = lineHeight * 4 + 24 // 4 rows + padding
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
  }, [value])

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isDisabled && value.trim()) {
        onSend()
      }
    }
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value)
  }

  return (
    <div
      className="flex items-end gap-2 p-3 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-[--color-surface]"
      role="region"
      aria-label="Area de entrada de mensaje"
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Escribe tu mensaje..."
        rows={1}
        disabled={isDisabled}
        aria-label="Mensaje para Hanna"
        aria-multiline="true"
        className="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-foreground dark:text-slate-100 placeholder:text-foreground-muted dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed"
        style={{ minHeight: '42px' }}
      />
      <button
        type="button"
        onClick={onSend}
        disabled={isDisabled || !value.trim()}
        aria-label="Enviar mensaje"
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary-500 text-white rounded-xl hover:bg-primary-600 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      >
        <SendHorizontal className="w-4 h-4" />
      </button>
    </div>
  )
}

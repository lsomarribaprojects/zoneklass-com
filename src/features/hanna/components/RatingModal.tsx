'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useChatStore } from '@/features/hanna/store/chatStore'

// ============================================
// HANNA AI TUTOR - RatingModal Component
// ============================================

export function RatingModal() {
  const { currentConversation, setShowRating, toggleOpen } = useChatStore()
  const [hovered, setHovered] = useState(0)
  const [selected, setSelected] = useState(0)
  const [saving, setSaving] = useState(false)

  async function handleSubmit() {
    if (!currentConversation || selected === 0) return
    setSaving(true)

    try {
      const supabase = createClient()
      await supabase
        .from('hanna_conversations')
        .update({ rating: selected })
        .eq('id', currentConversation.id)
    } catch {
      // Non-blocking - silently ignore rating save errors
    } finally {
      setSaving(false)
      setShowRating(false)
      toggleOpen()
    }
  }

  function handleSkip() {
    setShowRating(false)
    toggleOpen()
  }

  const displayRating = hovered > 0 ? hovered : selected

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rating-title"
    >
      <div className="mx-4 w-full max-w-xs bg-white dark:bg-[--color-surface] rounded-2xl p-6 shadow-modal animate-scale-in">
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-white" />
          </div>
          <h3
            id="rating-title"
            className="font-heading text-base font-semibold text-foreground dark:text-slate-100"
          >
            Como fue tu experiencia con Hanna?
          </h3>
          <p className="text-xs text-foreground-secondary dark:text-slate-400 mt-1">
            Tu opinion ayuda a mejorar las respuestas
          </p>
        </div>

        <div
          className="flex items-center justify-center gap-2 mb-6"
          role="group"
          aria-label="Calificacion de 1 a 5 estrellas"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setSelected(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              aria-label={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
              aria-pressed={selected === star}
              className="p-1 transition-transform hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= displayRating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-transparent text-gray-300 dark:text-slate-600'
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={selected === 0 || saving}
          className="w-full py-2.5 bg-primary-500 text-white text-sm font-medium rounded-xl hover:bg-primary-600 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 mb-2"
        >
          {saving ? 'Guardando...' : 'Enviar calificacion'}
        </button>

        <button
          type="button"
          onClick={handleSkip}
          className="w-full py-2 text-sm text-foreground-secondary dark:text-slate-400 hover:text-foreground dark:hover:text-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 rounded-xl"
        >
          Saltar
        </button>
      </div>
    </div>
  )
}

'use client'

import { Brain, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

interface AIAssistantButtonProps {
  onClick: () => void
  creditsRemaining?: number
}

export function AIAssistantButton({ onClick, creditsRemaining }: AIAssistantButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative">
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap shadow-lg">
          Asistente AI
          <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800" />
        </div>
      )}

      {/* Button */}
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="
          relative
          w-14 h-14 rounded-full
          bg-gradient-to-br from-blue-500 to-purple-600
          text-white
          shadow-lg hover:shadow-xl
          hover:scale-110 active:scale-95
          transition-all duration-300
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
          animate-pulse hover:animate-none
        "
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className="w-6 h-6" />
        </div>

        {/* Sparkle decoration */}
        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />

        {/* Credits badge */}
        {creditsRemaining !== undefined && (
          <div className="absolute -bottom-1 -right-1">
            <Badge variant="success" className="text-xs px-1.5 py-0.5 shadow-sm">
              {creditsRemaining}
            </Badge>
          </div>
        )}
      </button>
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { Trophy, X } from 'lucide-react'

// ============================================
// Confetti dot
// ============================================

interface ConfettiDotProps {
  color: string
  top: string
  left: string
  delay: string
  size: string
}

function ConfettiDot({ color, top, left, delay, size }: ConfettiDotProps) {
  return (
    <span
      aria-hidden="true"
      className="absolute rounded-full animate-confetti-dot pointer-events-none"
      style={{
        backgroundColor: color,
        top,
        left,
        width: size,
        height: size,
        animationDelay: delay,
      }}
    />
  )
}

// ============================================
// Confetti data
// ============================================

const CONFETTI_DOTS: ConfettiDotProps[] = [
  { color: '#7C3AED', top: '-8px', left: '10%', delay: '0s', size: '8px' },
  { color: '#EAB308', top: '-8px', left: '30%', delay: '0.1s', size: '6px' },
  { color: '#10B981', top: '-8px', left: '50%', delay: '0.2s', size: '10px' },
  { color: '#EF4444', top: '-8px', left: '70%', delay: '0.05s', size: '7px' },
  { color: '#3B82F6', top: '-8px', left: '88%', delay: '0.15s', size: '9px' },
  { color: '#F59E0B', top: '15%', left: '-8px', delay: '0.3s', size: '6px' },
  { color: '#7C3AED', top: '40%', left: '-8px', delay: '0.1s', size: '8px' },
  { color: '#10B981', top: '65%', left: '-8px', delay: '0.25s', size: '7px' },
  { color: '#EAB308', top: '15%', left: 'calc(100% + 2px)', delay: '0.2s', size: '9px' },
  { color: '#EF4444', top: '40%', left: 'calc(100% + 2px)', delay: '0.05s', size: '6px' },
  { color: '#3B82F6', top: '65%', left: 'calc(100% + 2px)', delay: '0.35s', size: '8px' },
]

// ============================================
// Props
// ============================================

interface BadgeToastProps {
  badges: string[]
  onClose: () => void
}

// ============================================
// Component
// ============================================

export function BadgeToast({ badges, onClose }: BadgeToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onClose()
    }, 5000)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [onClose])

  const badgeList = badges.length === 1
    ? badges[0]
    : badges.slice(0, -1).join(', ') + ' y ' + badges[badges.length - 1]

  const motivationalText =
    badges.length > 1
      ? '¡Increible! Has desbloqueado varios badges a la vez.'
      : '¡Sigue aprendiendo para desbloquear mas badges!'

  return (
    <>
      {/* Keyframe styles */}
      <style>{`
        @keyframes confettiDot {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
          100% { transform: translateY(4px) scale(0.8); opacity: 0; }
        }
        .animate-confetti-dot {
          animation: confettiDot 1.2s ease-in-out infinite;
        }
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>

      {/* Toast container */}
      <div
        role="alert"
        aria-live="polite"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
      >
        <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-modal border border-border-light dark:border-slate-700 p-5 animate-scale-in">
          {/* Confetti dots */}
          {CONFETTI_DOTS.map((dot, i) => (
            <ConfettiDot key={i} {...dot} />
          ))}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700 text-foreground-secondary dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Cerrar notificacion"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="flex flex-col items-center text-center gap-3">
            {/* Trophy icon with golden background */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-elevated"
              style={{ backgroundColor: '#EAB308' }}
            >
              <Trophy className="w-7 h-7 text-white" />
            </div>

            {/* Heading */}
            <div>
              <h3 className="text-display-xs font-heading font-bold text-foreground dark:text-slate-100">
                ¡Felicidades!
              </h3>
              <p className="text-body-sm font-medium text-foreground-secondary dark:text-slate-400 mt-0.5">
                Badge desbloqueado
              </p>
            </div>

            {/* Badge name(s) */}
            <div
              className="px-4 py-2 rounded-xl text-white font-semibold text-body-sm text-center"
              style={{ backgroundColor: '#EAB308' }}
            >
              {badgeList}
            </div>

            {/* Motivational text */}
            <p className="text-body-xs text-foreground-secondary dark:text-slate-400">
              {motivationalText}
            </p>

            {/* Auto-dismiss progress bar */}
            <div className="w-full h-1 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  backgroundColor: '#EAB308',
                  animation: 'shrink 5s linear forwards',
                }}
              />
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

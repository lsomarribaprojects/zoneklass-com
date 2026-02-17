'use client'

import Link from 'next/link'
import { Trophy, ArrowRight, Home } from 'lucide-react'

interface CompletionCelebrationProps {
  courseTitle: string
  courseSlug: string
}

export function CompletionCelebration({
  courseTitle,
  courseSlug,
}: CompletionCelebrationProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      {/* Confetti animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              backgroundColor: [
                '#7C3AED',
                '#A78BFA',
                '#10B981',
                '#F59E0B',
                '#EF4444',
                '#3B82F6',
              ][Math.floor(Math.random() * 6)],
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content card */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-modal p-8 max-w-md mx-4 text-center animate-scale-in">
        {/* Trophy icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-6">
          <Trophy className="w-10 h-10 text-white" />
        </div>

        {/* Heading */}
        <h2 className="font-heading font-bold text-[#0F172A] dark:text-slate-100 text-3xl mb-3">
          ¡Felicidades!
        </h2>

        {/* Message */}
        <p className="text-foreground-secondary dark:text-slate-400 text-lg mb-8">
          Has completado el curso{' '}
          <span className="font-semibold text-foreground dark:text-slate-100">
            {courseTitle}
          </span>
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href={`/cursos/${courseSlug}`}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
          >
            <span>Volver al Curso</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-slate-800 text-foreground dark:text-slate-100 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Ir al Dashboard</span>
          </Link>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear infinite;
        }
      `}</style>
    </div>
  )
}

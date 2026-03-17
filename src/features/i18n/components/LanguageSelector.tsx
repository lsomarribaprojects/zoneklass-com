'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { useLocale } from '../context'
import type { Locale } from '../types'

const LANGUAGE_OPTIONS: { value: Locale; label: string; flag: string }[] = [
  { value: 'es', label: 'Espanol', flag: 'ES' },
  { value: 'en', label: 'English', flag: 'EN' },
]

export function LanguageSelector() {
  const { locale, setLocale } = useLocale()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5 text-foreground-secondary" />
        <span className="text-xs font-medium text-foreground-secondary">
          {locale.toUpperCase()}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-elevated border border-border-light dark:border-slate-700 py-1 z-50">
          {LANGUAGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setLocale(opt.value); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                locale === opt.value
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-foreground-secondary dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              <span className="font-medium">{opt.flag}</span>{' '}{opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

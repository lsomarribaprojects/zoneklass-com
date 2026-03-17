'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Locale, Dictionary } from './types'
import { DEFAULT_LOCALE } from './types'
import { es } from './dictionaries/es'
import { en } from './dictionaries/en'
import { getLocaleFromCookie, setLocaleCookie } from './utils'

const dictionaries: Record<Locale, Dictionary> = { es, en }

interface LocaleContextValue {
  locale: Locale
  t: Dictionary
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  t: dictionaries[DEFAULT_LOCALE],
  setLocale: () => {},
})

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    const saved = getLocaleFromCookie()
    if (saved) {
      setLocaleState(saved)
      document.documentElement.lang = saved
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    setLocaleCookie(newLocale)
    document.documentElement.lang = newLocale
  }, [])

  return (
    <LocaleContext.Provider value={{
      locale,
      t: dictionaries[locale],
      setLocale,
    }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}

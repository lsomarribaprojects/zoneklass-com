'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { COURSE_CATEGORIES, COURSE_LEVELS } from '@/features/courses/types/schemas'

export function CatalogFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSearch = searchParams.get('q') || ''
  const currentCategory = searchParams.get('category') || ''
  const currentLevel = searchParams.get('level') || ''

  const [search, setSearch] = useState(currentSearch)

  // Sincronizar estado local con URL
  useEffect(() => {
    setSearch(currentSearch)
  }, [currentSearch])

  const updateFilters = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== currentSearch) {
        updateFilters('q', search)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [search, currentSearch, updateFilters])

  const hasFilters = currentSearch || currentCategory || currentLevel

  const clearFilters = () => {
    router.push(pathname)
    setSearch('')
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted dark:text-slate-500" />
        <input
          type="text"
          placeholder="Buscar cursos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-light dark:border-slate-700 bg-white dark:bg-slate-800 text-foreground dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-foreground-muted dark:placeholder:text-slate-500"
        />
      </div>

      {/* Category Filter */}
      <select
        value={currentCategory}
        onChange={(e) => updateFilters('category', e.target.value)}
        className="px-4 py-2.5 rounded-xl border border-border-light dark:border-slate-700 bg-white dark:bg-slate-800 text-foreground dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
      >
        <option value="">Todas las categorias</option>
        {COURSE_CATEGORIES.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Level Filter */}
      <select
        value={currentLevel}
        onChange={(e) => updateFilters('level', e.target.value)}
        className="px-4 py-2.5 rounded-xl border border-border-light dark:border-slate-700 bg-white dark:bg-slate-800 text-foreground dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
      >
        <option value="">Todos los niveles</option>
        {COURSE_LEVELS.map(lvl => (
          <option key={lvl} value={lvl}>{lvl}</option>
        ))}
      </select>

      {/* Clear Filters */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-foreground-secondary dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
          Limpiar
        </button>
      )}
    </div>
  )
}

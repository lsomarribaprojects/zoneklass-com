'use client'

import { useLocale } from '@/features/i18n'

export function CatalogHeader() {
  const { t } = useLocale()

  return (
    <div className="mb-6">
      <h1 className="text-display-sm text-[#0F172A] dark:text-slate-100 font-heading">
        {t.course.exploreCourses}
      </h1>
      <p className="text-foreground-secondary dark:text-slate-400 mt-1">
        {t.course.exploreSubtitle}
      </p>
    </div>
  )
}

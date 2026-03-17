import type { Locale } from './types'
import { LOCALES, DEFAULT_LOCALE } from './types'

const COOKIE_NAME = 'zoneklass-locale'
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 year

export function getLocaleFromCookie(): Locale | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))
  const value = match?.[1]
  return value && LOCALES.includes(value as Locale) ? (value as Locale) : null
}

export function setLocaleCookie(locale: Locale): void {
  document.cookie = `${COOKIE_NAME}=${locale};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`
}

/**
 * Returns the localized value of a field from a DB record.
 * If locale is 'en', tries `field_en` first, falls back to `field`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function localized(item: any, field: string, locale: Locale): string {
  if (locale === 'en') {
    const enValue = item[`${field}_en`]
    if (typeof enValue === 'string' && enValue.length > 0) return enValue
  }
  return (item[field] as string) ?? ''
}

export { COOKIE_NAME, DEFAULT_LOCALE }

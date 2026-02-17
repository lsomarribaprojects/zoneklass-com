/**
 * Convert a date string to a relative time string (e.g., "hace 5 min")
 */
export function timeAgo(date: string): string {
  const now = new Date()
  const then = new Date(date)
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (seconds < 60) {
    return 'ahora'
  }

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `hace ${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`
  }

  const days = Math.floor(hours / 24)
  if (days < 7) {
    return `hace ${days} ${days === 1 ? 'día' : 'días'}`
  }

  // Format as date
  return then.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: then.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

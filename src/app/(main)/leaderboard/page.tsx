import type { Metadata } from 'next'
import { LeaderboardView } from '@/features/gamification/components/LeaderboardView'

export const metadata: Metadata = {
  title: 'Leaderboard',
  description: 'Descubre quienes son los estudiantes mas activos. Gana XP, sube de nivel y compite en el ranking de ZoneKlass.',
}

export default function LeaderboardPage() {
  return <LeaderboardView />
}

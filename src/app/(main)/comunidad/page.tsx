import type { Metadata } from 'next'
import { CommunityFeed } from '@/features/community/components/CommunityFeed'

export const metadata: Metadata = {
  title: 'Comunidad',
  description: 'Conecta con otros estudiantes, comparte conocimiento y crece juntos en la comunidad de ZoneKlass.',
}

export default function ComunidadPage() {
  return <CommunityFeed />
}

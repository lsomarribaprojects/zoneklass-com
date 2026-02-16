import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ZoneKlass - Plataforma de Cursos Online',
  description: 'Aprende, crece y domina nuevas habilidades con ZoneKlass',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

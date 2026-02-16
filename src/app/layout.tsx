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
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('zoneklass-theme');
                  if (theme === 'dark') document.documentElement.classList.add('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

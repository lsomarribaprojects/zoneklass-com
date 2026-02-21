import type { Metadata } from 'next'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoneklass.com'

export const metadata: Metadata = {
  title: {
    default: 'ZoneKlass - Aprende con IA',
    template: '%s | ZoneKlass',
  },
  description: 'Plataforma de aprendizaje con IA. Cursos interactivos, comunidad activa y tutora inteligente Hanna. Aprende, crece y domina nuevas habilidades.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'ZoneKlass - Aprende con IA',
    description: 'Plataforma de aprendizaje con IA. Cursos interactivos, comunidad activa y tutora inteligente Hanna.',
    url: siteUrl,
    siteName: 'ZoneKlass',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ZoneKlass - Aprende con IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZoneKlass - Aprende con IA',
    description: 'Plataforma de aprendizaje con IA. Cursos interactivos, comunidad activa y tutora inteligente Hanna.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
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

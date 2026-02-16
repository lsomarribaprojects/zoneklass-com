import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">ZK</span>
          </div>
          <span className="text-xl font-bold text-foreground font-heading">ZoneKlass</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors"
          >
            Iniciar Sesion
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-700 rounded-xl transition-colors"
          >
            Registrarse
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-500 text-sm font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-primary-500"></span>
          Plataforma de aprendizaje
        </div>
        <h1 className="text-display-lg md:text-display-xl text-foreground mb-6">
          Aprende, crece y domina nuevas habilidades
        </h1>
        <p className="text-body-lg text-foreground-secondary mb-8 max-w-2xl">
          ZoneKlass es tu plataforma de cursos online donde puedes aprender a tu ritmo,
          ganar experiencia y subir de nivel.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/signup"
            className="px-6 py-3 text-base font-medium text-white gradient-primary rounded-xl hover:opacity-90 transition-opacity shadow-md"
          >
            Comenzar gratis
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 text-base font-medium text-primary-500 border-2 border-primary-500 rounded-xl hover:bg-primary-50 transition-colors"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </section>
    </main>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Bot,
  BookOpen,
  Users,
  UserPlus,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Clock,
  BarChart3,
  Twitter,
  Instagram,
  Youtube,
  Github,
} from 'lucide-react'

// ── Scroll reveal hook ─────────────────────────────────
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    const children = el.querySelectorAll('.reveal')
    children.forEach((child) => observer.observe(child))

    return () => observer.disconnect()
  }, [])

  return ref
}

// ── Mock courses ───────────────────────────────────────
const FEATURED_COURSES = [
  {
    title: 'Desarrollo Web Full Stack',
    description: 'HTML, CSS, JavaScript, React y Node.js desde cero.',
    level: 'Principiante',
    lessons: 42,
    color: 'from-violet-500 to-purple-600',
  },
  {
    title: 'Inteligencia Artificial con Python',
    description: 'Machine Learning, Deep Learning y proyectos reales.',
    level: 'Intermedio',
    lessons: 36,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Diseño UX/UI Profesional',
    description: 'Figma, Design Systems y prototipado avanzado.',
    level: 'Avanzado',
    lessons: 28,
    color: 'from-pink-500 to-rose-500',
  },
]

const LEVEL_COLORS: Record<string, string> = {
  Principiante: 'bg-green-100 text-green-700',
  Intermedio: 'bg-yellow-100 text-yellow-700',
  Avanzado: 'bg-red-100 text-red-700',
}

// ── Page ───────────────────────────────────────────────
export default function Home() {
  const revealRef = useScrollReveal()

  return (
    <div ref={revealRef} className="min-h-screen bg-[#F8FAFC]">
      {/* ─── NAVBAR ─────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">ZK</span>
            </div>
            <span className="text-xl font-bold font-heading text-gradient-primary">
              ZoneKlass
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Funciones
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Cómo Funciona
            </a>
            <a href="#courses" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Cursos
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium text-white gradient-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO ───────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-violet-50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-20 sm:pb-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Potenciado con Inteligencia Artificial
            </div>

            <h1 className="reveal text-4xl sm:text-5xl lg:text-display-xl font-heading font-bold text-gray-900 mb-6 leading-tight">
              Aprende con{' '}
              <span className="text-gradient-primary">inteligencia artificial</span>
            </h1>

            <p className="reveal text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Tu tutora personal <strong className="text-primary-500">Hanna</strong> te guía paso
              a paso. Cursos interactivos, comunidad activa y aprendizaje personalizado.
            </p>

            <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white gradient-primary rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-purple-500/25"
              >
                Empieza Gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#courses"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-primary-600 bg-white border-2 border-primary-200 rounded-2xl hover:border-primary-400 hover:bg-primary-50 transition-all"
              >
                Ver Cursos
              </a>
            </div>

            {/* Social proof */}
            <div className="reveal mt-12 flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-500" />
                100% Gratis para comenzar
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Sin tarjeta de crédito
              </div>
              <div className="hidden md:flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Cancela cuando quieras
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ───────────────────────────────── */}
      <section id="features" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="reveal text-sm font-semibold text-primary-500 uppercase tracking-wider mb-3">
              Funciones
            </p>
            <h2 className="reveal text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">
              Todo lo que necesitas para aprender
            </h2>
            <p className="reveal text-lg text-gray-600 max-w-2xl mx-auto">
              ZoneKlass combina inteligencia artificial, contenido interactivo y comunidad
              para una experiencia de aprendizaje única.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="reveal group p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-gray-900 mb-3">
                Tutora IA Personal
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Hanna, tu asistente de IA, te ayuda 24/7 con tus dudas. Respuestas
                instantáneas y explicaciones personalizadas a tu nivel.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="reveal group p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-gray-900 mb-3">
                Cursos Interactivos
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Aprende a tu ritmo con contenido multimedia: videos, ejercicios prácticos,
                quizzes y proyectos reales.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="reveal group p-8 rounded-3xl bg-gradient-to-br from-pink-50 to-white border border-pink-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-gray-900 mb-3">
                Comunidad Activa
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Conecta con otros estudiantes, comparte tu progreso, resuelve dudas juntos
                y celebra logros en comunidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────── */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="reveal text-sm font-semibold text-primary-500 uppercase tracking-wider mb-3">
              Cómo Funciona
            </p>
            <h2 className="reveal text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">
              Empieza en 3 simples pasos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="reveal text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6 relative">
                <UserPlus className="w-7 h-7 text-primary-600" />
                <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full gradient-primary text-white text-sm font-bold flex items-center justify-center">
                  1
                </span>
              </div>
              <h3 className="text-xl font-heading font-semibold text-gray-900 mb-3">
                Regístrate gratis
              </h3>
              <p className="text-gray-600">
                Crea tu cuenta en segundos. Sin tarjeta de crédito, sin compromisos.
              </p>
            </div>

            {/* Step 2 */}
            <div className="reveal text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6 relative">
                <GraduationCap className="w-7 h-7 text-blue-600" />
                <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm font-bold flex items-center justify-center">
                  2
                </span>
              </div>
              <h3 className="text-xl font-heading font-semibold text-gray-900 mb-3">
                Elige un curso
              </h3>
              <p className="text-gray-600">
                Explora nuestro catálogo y elige el curso que más te interese.
              </p>
            </div>

            {/* Step 3 */}
            <div className="reveal text-center">
              <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-6 relative">
                <Sparkles className="w-7 h-7 text-pink-600" />
                <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white text-sm font-bold flex items-center justify-center">
                  3
                </span>
              </div>
              <h3 className="text-xl font-heading font-semibold text-gray-900 mb-3">
                Aprende con Hanna
              </h3>
              <p className="text-gray-600">
                Tu tutora IA te acompaña en cada lección, resolviendo dudas al instante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED COURSES ───────────────────────── */}
      <section id="courses" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="reveal text-sm font-semibold text-primary-500 uppercase tracking-wider mb-3">
              Cursos Destacados
            </p>
            <h2 className="reveal text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">
              Aprende las habilidades del futuro
            </h2>
            <p className="reveal text-lg text-gray-600 max-w-2xl mx-auto">
              Cursos diseñados por expertos y potenciados con inteligencia artificial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_COURSES.map((course) => (
              <div
                key={course.title}
                className="reveal group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className={`h-48 bg-gradient-to-br ${course.color} relative`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <GraduationCap className="w-16 h-16 text-white/30" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${LEVEL_COLORS[course.level]}`}>
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      {course.lessons} lecciones
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {Math.round(course.lessons * 0.4)}h contenido
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal text-center mt-12">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              Ver todos los cursos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── STATS ──────────────────────────────────── */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-primary-500">500+</p>
              <p className="text-sm text-gray-600 mt-1">Estudiantes activos</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-primary-500">25+</p>
              <p className="text-sm text-gray-600 mt-1">Cursos disponibles</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-primary-500">50K+</p>
              <p className="text-sm text-gray-600 mt-1">Lecciones completadas</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-primary-500">4.9</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <BarChart3 className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">Satisfacción</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="reveal relative overflow-hidden rounded-3xl gradient-primary p-10 sm:p-16 text-center">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/4" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white mb-4">
                ¿Listo para aprender?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Únete a cientos de estudiantes que ya están aprendiendo con Hanna.
                Tu primera clase es gratis.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-primary-600 bg-white rounded-2xl hover:bg-gray-50 transition-colors shadow-lg"
              >
                Crear Cuenta Gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ZK</span>
                </div>
                <span className="text-xl font-bold font-heading text-white">
                  ZoneKlass
                </span>
              </div>
              <p className="text-gray-500 max-w-xs leading-relaxed">
                Tu plataforma de aprendizaje potenciada con inteligencia artificial.
                Aprende, crece y domina nuevas habilidades.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#courses" className="hover:text-white transition-colors">Cursos</a>
                </li>
                <li>
                  <a href="#features" className="hover:text-white transition-colors">Funciones</a>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-white transition-colors">Registrarse</Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-white transition-colors">Términos de Uso</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Contacto</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; 2026 ZoneKlass. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

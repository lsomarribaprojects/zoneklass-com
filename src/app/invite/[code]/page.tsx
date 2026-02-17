'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  BookOpen,
  Clock,
  Layers,
  GraduationCap,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { validateInviteCode, trackInviteAction, enrollViaInvite } from '@/actions/invite-links'
import { useUser } from '@/hooks/useUser'

interface ValidatedInvite {
  invite_link_id: string
  course: {
    id: string
    title: string
    description: string | null
    slug: string
    category: string
    level: string
    thumbnail_url: string | null
    price: number
    modules_count: number
    lessons_count: number
    total_duration_minutes: number
    is_enrolled: boolean
  }
}

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string
  const { profile, loading: userLoading } = useUser()

  const [data, setData] = useState<ValidatedInvite | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    async function loadInvite() {
      if (!code) return

      setLoading(true)
      const result = await validateInviteCode(code)

      if (result.error || !result.data) {
        setError(result.error || 'Enlace de invitación no válido')
        setLoading(false)
        return
      }

      setData(result.data)
      setError(null)
      setLoading(false)

      // Track click action
      await trackInviteAction(result.data.invite_link_id, 'click')
    }

    loadInvite()
  }, [code])

  async function handleEnroll() {
    if (!data) return

    setEnrolling(true)
    const result = await enrollViaInvite(code)

    if (result.error) {
      alert(result.error)
      setEnrolling(false)
      return
    }

    // Redirect to course
    const slug = result.slug || data.course.slug
    router.push(`/cursos/${slug}`)
  }

  function handleSignup() {
    router.push(`/signup?redirect=/invite/${code}`)
  }

  function handleGoToCourse() {
    router.push(`/cursos/${data!.course.slug}`)
  }

  // Loading state
  if (loading || userLoading) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-lg">Cargando invitación...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-gradient-primary">
              <GraduationCap className="w-8 h-8 text-purple-600" />
              ZoneKlass
            </Link>
          </div>

          {/* Error Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Invitación no válida
            </h1>
            <p className="text-foreground-secondary mb-6">
              {error || 'Este enlace de invitación no es válido o ha expirado.'}
            </p>
            <Link
              href="/cursos"
              className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Explorar Cursos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-foreground-muted mt-8">
            Powered by ZoneKlass
          </p>
        </div>
      </div>
    )
  }

  const { course } = data
  const isLoggedIn = !!profile

  // Determine CTA
  let ctaLabel = 'Crear Cuenta y Unirse'
  let ctaAction = handleSignup
  if (isLoggedIn) {
    if (course.is_enrolled) {
      ctaLabel = 'Ir al Curso'
      ctaAction = handleGoToCourse
    } else {
      ctaLabel = 'Unirse al Curso Gratis'
      ctaAction = handleEnroll
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-gradient-primary hover:opacity-80 transition-opacity">
            <GraduationCap className="w-8 h-8 text-purple-600" />
            ZoneKlass
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Thumbnail */}
          <div className="relative w-full aspect-video overflow-hidden">
            {course.thumbnail_url ? (
              <Image
                src={course.thumbnail_url}
                alt={course.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full gradient-primary flex items-center justify-center">
                <BookOpen className="w-20 h-20 text-white/80" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Title */}
            <h1 className="text-3xl font-bold text-foreground mb-3">
              {course.title}
            </h1>

            {/* Description */}
            {course.description && (
              <p className="text-gray-600 mb-6 line-clamp-3">
                {course.description}
              </p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                <GraduationCap className="w-4 h-4" />
                {course.level}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                <BookOpen className="w-4 h-4" />
                {course.category}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-foreground-secondary mb-1">
                  <Layers className="w-4 h-4" />
                  <span className="text-sm">Módulos</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{course.modules_count}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-foreground-secondary mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">Lecciones</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{course.lessons_count}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-foreground-secondary mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Duración</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(course.total_duration_minutes / 60)}h
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              {course.price > 0 ? (
                <div className="text-center">
                  <p className="text-foreground-secondary text-sm mb-1">Precio normal</p>
                  <p className="text-3xl font-bold text-foreground">
                    ${course.price.toFixed(2)}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-lg font-bold">
                    Gratis
                  </span>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <button
              onClick={ctaAction}
              disabled={enrolling}
              className="w-full gradient-primary text-white font-semibold py-3.5 rounded-xl text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enrolling ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Inscribiendo...
                </>
              ) : (
                <>
                  {ctaLabel}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Invite Message */}
            <p className="text-center text-sm text-foreground-muted mt-4">
              {isLoggedIn && course.is_enrolled
                ? 'Ya estás inscrito en este curso'
                : 'Te invitaron a unirte a este curso'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-foreground-muted mt-8">
          Powered by ZoneKlass
        </p>
      </div>
    </div>
  )
}

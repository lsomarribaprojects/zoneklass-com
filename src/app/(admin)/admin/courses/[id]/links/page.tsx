'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui'
import { getInviteLinks } from '@/actions/invite-links'
import { InviteLinkFormModal } from '@/features/courses/components/admin/InviteLinkFormModal'
import { InviteLinkCard } from '@/features/courses/components/admin/InviteLinkCard'
import type { InviteLinkWithStats } from '@/types/database'
import { Plus, Loader2, Link2, ArrowLeft } from 'lucide-react'

export default function CourseLinksPage() {
  const params = useParams()
  const courseId = params.id as string

  const [courseTitle, setCourseTitle] = useState('')
  const [links, setLinks] = useState<InviteLinkWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const supabase = createClient()

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch course title
      const { data: course } = await supabase
        .from('courses')
        .select('title')
        .eq('id', courseId)
        .single()

      if (course) setCourseTitle(course.title)

      // Fetch invite links
      const result = await getInviteLinks(courseId)
      if (result.data) setLinks(result.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [courseId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        <ol className="flex items-center gap-2">
          <li>
            <a href="/admin" className="hover:text-gray-900 dark:hover:text-white">
              Admin
            </a>
          </li>
          <li>/</li>
          <li>
            <a href="/admin/courses" className="hover:text-gray-900 dark:hover:text-white">
              Cursos
            </a>
          </li>
          <li>/</li>
          <li className="truncate max-w-xs">
            <a
              href={`/admin/courses/${courseId}/edit`}
              className="hover:text-gray-900 dark:hover:text-white"
            >
              {courseTitle}
            </a>
          </li>
          <li>/</li>
          <li className="text-gray-900 dark:text-white font-medium">Links de Invitacion</li>
        </ol>
      </nav>

      {/* Back to edit */}
      <a
        href={`/admin/courses/${courseId}/edit`}
        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Editar Curso
      </a>

      {/* Page Title */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Links de Invitacion
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Crea y gestiona enlaces para compartir este curso
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Link
        </Button>
      </div>

      {/* Links List */}
      {links.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Link2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No hay links de invitacion
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Crea tu primer link para compartir este curso en redes sociales, email o tu sitio web.
          </p>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Primer Link
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {links.map((link) => (
            <InviteLinkCard
              key={link.id}
              link={link}
              onRefresh={fetchData}
            />
          ))}
        </div>
      )}

      {/* Create Link Modal */}
      <InviteLinkFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        courseId={courseId}
        onSuccess={fetchData}
      />
    </div>
  )
}

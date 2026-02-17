'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { createPost } from '@/actions/community'
import type { PostCategory } from '@/types/database'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated: () => void
}

const categories: { value: PostCategory; label: string; description: string }[] = [
  {
    value: 'general',
    label: 'General',
    description: 'Conversaciones generales de la comunidad',
  },
  {
    value: 'pregunta',
    label: 'Pregunta',
    description: 'Pide ayuda o consejos a la comunidad',
  },
  {
    value: 'recurso',
    label: 'Recurso',
    description: 'Comparte artículos, videos o herramientas útiles',
  },
  {
    value: 'logro',
    label: 'Logro',
    description: 'Celebra tus victorias y avances',
  },
  {
    value: 'presentacion',
    label: 'Presentación',
    description: 'Preséntate a la comunidad',
  },
]

export function CreatePostModal({ isOpen, onClose, onCreated }: CreatePostModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<PostCategory>('general')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    formData.append('category', category)

    const result = await createPost(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      // Reset form
      setTitle('')
      setContent('')
      setCategory('general')
      setActiveTab('write')
      setLoading(false)
      onCreated()
    }
  }

  function handleClose() {
    if (!loading) {
      setTitle('')
      setContent('')
      setCategory('general')
      setActiveTab('write')
      setError(null)
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Crear Post" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-border-light dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'write'
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-foreground-secondary dark:text-slate-400 hover:text-foreground dark:hover:text-slate-300'
            }`}
          >
            Escribir
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'preview'
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-foreground-secondary dark:text-slate-400 hover:text-foreground dark:hover:text-slate-300'
            }`}
          >
            Vista previa
          </button>
        </div>

        {/* Write Tab */}
        {activeTab === 'write' ? (
          <>
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground dark:text-slate-100 mb-1.5">
                Título
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="¿De qué quieres hablar?"
                required
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 text-foreground dark:text-slate-100 border border-border dark:border-slate-700 rounded-xl placeholder:text-foreground-muted dark:placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-border-dark dark:hover:border-slate-600"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-foreground dark:text-slate-100 mb-1.5">
                Categoría
              </label>
              <select
                id="category"
                value={category}
                onChange={e => setCategory(e.target.value as PostCategory)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 text-foreground dark:text-slate-100 border border-border dark:border-slate-700 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-border-dark dark:hover:border-slate-600"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label} - {cat.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-foreground dark:text-slate-100 mb-1.5">
                Contenido
              </label>
              <textarea
                id="content"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Comparte tus pensamientos, preguntas o experiencias..."
                required
                rows={8}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 text-foreground dark:text-slate-100 border border-border dark:border-slate-700 rounded-xl placeholder:text-foreground-muted dark:placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-border-dark dark:hover:border-slate-600 resize-none min-h-[200px]"
              />
            </div>
          </>
        ) : (
          /* Preview Tab */
          <div className="space-y-4">
            {title || content ? (
              <>
                <div>
                  <h3 className="text-xl font-semibold text-foreground dark:text-slate-100 mb-2">
                    {title || 'Sin título'}
                  </h3>
                  <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-medium rounded-full">
                    {categories.find(c => c.value === category)?.label}
                  </span>
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="text-foreground-secondary dark:text-slate-400 whitespace-pre-wrap">
                    {content || 'Sin contenido'}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-foreground-secondary dark:text-slate-400">
                Escribe algo para ver la vista previa
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-error-50 dark:bg-error-900/20 border border-error-500/20 p-3">
            <p className="text-sm text-error-700 dark:text-error-400">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-light dark:border-slate-700">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2.5 text-foreground-secondary dark:text-slate-400 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !title.trim() || !content.trim()}
            className="px-4 py-2.5 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Publicando...
              </>
            ) : (
              'Publicar'
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}

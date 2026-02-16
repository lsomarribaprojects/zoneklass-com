'use client'

import { useState } from 'react'
import { createCourse, updateCourse } from '@/actions/courses'
import type { Course } from '@/types/database'
import { COURSE_CATEGORIES, COURSE_LEVELS } from '@/features/courses/types/schemas'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'

interface CourseFormProps {
  course?: Course
  onSuccess?: () => void
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function CourseForm({ course, onSuccess }: CourseFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [title, setTitle] = useState(course?.title || '')
  const [slug, setSlug] = useState(course?.slug || '')

  const handleTitleBlur = () => {
    if (title && !slug) {
      setSlug(generateSlug(title))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)

    let result
    if (course) {
      result = await updateCourse(course.id, formData)
    } else {
      result = await createCourse(formData)
      // createCourse redirects on success, so this only runs on error
    }

    if (result?.error) {
      setError(result.error)
    } else if (course && onSuccess) {
      onSuccess()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {/* Titulo */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
          Titulo <span className="text-red-500">*</span>
        </label>
        <Input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          placeholder="Introduccion a React"
          className="w-full"
        />
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-foreground mb-2">
          Slug <span className="text-red-500">*</span>
        </label>
        <Input
          id="slug"
          name="slug"
          type="text"
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="introduccion-a-react"
          className="w-full"
        />
        <p className="text-xs text-foreground-muted mt-1">
          Se genera automaticamente del titulo
        </p>
      </div>

      {/* Descripcion */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
          Descripcion
        </label>
        <Textarea
          id="description"
          name="description"
          defaultValue={course?.description || ''}
          placeholder="Describe el contenido del curso..."
          rows={4}
          className="w-full"
        />
      </div>

      {/* Categoria + Nivel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
            Categoria
          </label>
          <select
            id="category"
            name="category"
            defaultValue={course?.category || ''}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Selecciona una categoria</option>
            {COURSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="level" className="block text-sm font-medium text-foreground mb-2">
            Nivel
          </label>
          <select
            id="level"
            name="level"
            defaultValue={course?.level || ''}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Selecciona un nivel</option>
            {COURSE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Precio + Thumbnail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">
            Precio
          </label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={course?.price || '0'}
            placeholder="29.99"
            className="w-full"
          />
          <p className="text-xs text-foreground-muted mt-1">0 = Gratis</p>
        </div>

        <div>
          <label htmlFor="thumbnail_url" className="block text-sm font-medium text-foreground mb-2">
            URL Thumbnail
          </label>
          <Input
            id="thumbnail_url"
            name="thumbnail_url"
            type="url"
            defaultValue={course?.thumbnail_url || ''}
            placeholder="https://..."
            className="w-full"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-800"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : course ? (
            'Guardar Cambios'
          ) : (
            'Crear Curso'
          )}
        </Button>
      </div>
    </form>
  )
}

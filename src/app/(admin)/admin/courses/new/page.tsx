'use client'

import Link from 'next/link'
import { CourseForm } from '@/features/courses/components/admin/CourseForm'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight, ArrowLeft } from 'lucide-react'

export default function NewCoursePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-foreground-muted mb-6">
        <Link href="/admin" className="hover:text-foreground transition-colors">
          Admin
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/admin/courses" className="hover:text-foreground transition-colors">
          Cursos
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">Nuevo</span>
      </nav>

      {/* Back Button */}
      <div className="mb-6">
        <Link href="/admin/courses">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver a Cursos
          </Button>
        </Link>
      </div>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-display-xs font-bold font-heading text-foreground">
          Crear Nuevo Curso
        </h1>
        <p className="text-foreground-muted mt-2">
          Completa la informacion basica del curso. Podras agregar modulos y lecciones despues.
        </p>
      </div>

      {/* Form */}
      <Card className="p-6 bg-card dark:bg-card border-border dark:border-border">
        <CourseForm />
      </Card>
    </div>
  )
}

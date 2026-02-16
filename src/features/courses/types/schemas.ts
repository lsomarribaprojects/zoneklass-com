import { z } from 'zod'

export const COURSE_CATEGORIES = [
  'Programación', 'IA', 'Diseño', 'Marketing', 'Negocios',
] as const

export const COURSE_LEVELS = [
  'Principiante', 'Intermedio', 'Avanzado',
] as const

export const courseSchema = z.object({
  title: z.string().min(3, 'El titulo debe tener al menos 3 caracteres').max(200),
  description: z.string().max(2000).optional().default(''),
  slug: z.string().min(3, 'El slug debe tener al menos 3 caracteres').max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug invalido (solo letras minusculas, numeros y guiones)'),
  category: z.enum(COURSE_CATEGORIES),
  level: z.enum(COURSE_LEVELS),
  thumbnail_url: z.string().url('URL invalida').optional().or(z.literal('')),
  price: z.coerce.number().min(0, 'El precio no puede ser negativo'),
})

export const moduleSchema = z.object({
  title: z.string().min(2, 'El titulo debe tener al menos 2 caracteres').max(200),
  course_id: z.string().uuid(),
})

export const lessonSchema = z.object({
  title: z.string().min(2, 'El titulo debe tener al menos 2 caracteres').max(200),
  content: z.string().max(50000).optional().default(''),
  video_url: z.string().url('URL invalida').optional().or(z.literal('')),
  duration_minutes: z.coerce.number().int().min(0).default(0),
  module_id: z.string().uuid(),
})

export const enrollmentSchema = z.object({
  course_id: z.string().uuid('ID de curso invalido'),
})

export type CourseFormData = z.infer<typeof courseSchema>
export type ModuleFormData = z.infer<typeof moduleSchema>
export type LessonFormData = z.infer<typeof lessonSchema>
export type EnrollmentFormData = z.infer<typeof enrollmentSchema>

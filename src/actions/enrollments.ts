'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { CourseWithStats, CourseDetail, CourseCategory, CourseLevel } from '@/types/database'

// ============================================
// Auth helper (cualquier usuario autenticado)
// ============================================

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado', supabase: null, user: null }
  return { error: null, supabase, user }
}

// ============================================
// Catalogo publico
// ============================================

interface CatalogFilters {
  search?: string
  category?: CourseCategory
  level?: CourseLevel
}

export async function getPublishedCourses(filters?: CatalogFilters): Promise<{
  data: CourseWithStats[] | null
  error: string | null
}> {
  const supabase = await createClient()

  // Query cursos publicados con modulos y lecciones
  let query = supabase
    .from('courses')
    .select(`
      *,
      modules (
        id,
        lessons (
          id,
          duration_minutes
        )
      )
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  // Aplicar filtros
  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  if (filters?.level) {
    query = query.eq('level', filters.level)
  }
  if (filters?.search) {
    query = query.ilike('title', `%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) {
    return { data: null, error: error.message }
  }

  // Transformar datos para agregar stats
  const coursesWithStats: CourseWithStats[] = (data || []).map((course) => {
    const modules = (course.modules || []) as Array<{
      id: string
      lessons: Array<{ id: string; duration_minutes: number }>
    }>
    const allLessons = modules.flatMap(m => m.lessons || [])

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      slug: course.slug,
      category: course.category,
      level: course.level,
      thumbnail_url: course.thumbnail_url,
      price: course.price,
      is_published: course.is_published,
      created_by: course.created_by,
      created_at: course.created_at,
      updated_at: course.updated_at,
      modules_count: modules.length,
      lessons_count: allLessons.length,
      total_duration_minutes: allLessons.reduce((sum, l) => sum + (l.duration_minutes || 0), 0),
      enrolled_count: 0, // RLS impide contar inscripciones de otros
    }
  })

  return { data: coursesWithStats, error: null }
}

// ============================================
// Detalle de curso
// ============================================

export async function getCourseBySlug(slug: string): Promise<{
  data: CourseDetail | null
  error: string | null
}> {
  const supabase = await createClient()

  // Obtener curso con modulos y lecciones
  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      *,
      modules (
        *,
        lessons (*)
      )
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error || !course) {
    return { data: null, error: error?.message || 'Curso no encontrado' }
  }

  // Ordenar modulos y lecciones por order_index
  const modules = (course.modules || [])
    .sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index)
    .map((mod: { lessons?: Array<{ order_index: number }> }) => ({
      ...mod,
      lessons: (mod.lessons || []).sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index),
    }))

  // Verificar si el usuario esta inscrito
  let isEnrolled = false
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: enrollment } = await supabase
      .from('course_enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .single()
    isEnrolled = !!enrollment
  }

  return {
    data: {
      id: course.id,
      title: course.title,
      description: course.description,
      slug: course.slug,
      category: course.category,
      level: course.level,
      thumbnail_url: course.thumbnail_url,
      price: course.price,
      is_published: course.is_published,
      created_by: course.created_by,
      created_at: course.created_at,
      updated_at: course.updated_at,
      modules,
      enrolled_count: 0,
      is_enrolled: isEnrolled,
    },
    error: null,
  }
}

// ============================================
// Inscripcion
// ============================================

export async function enrollInCourse(courseId: string): Promise<{
  error: string | null
}> {
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autenticado' }
  }

  // Verificar que el curso existe y esta publicado
  const { data: course } = await supabase
    .from('courses')
    .select('id, is_published')
    .eq('id', courseId)
    .single()

  if (!course) {
    return { error: 'Curso no encontrado' }
  }
  if (!course.is_published) {
    return { error: 'Este curso no esta disponible' }
  }

  // Verificar que no esta ya inscrito
  const { data: existing } = await supabase
    .from('course_enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single()

  if (existing) {
    return { error: 'Ya estas inscrito en este curso' }
  }

  // Inscribir
  const { error } = await supabase
    .from('course_enrollments')
    .insert({
      user_id: user.id,
      course_id: courseId,
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/cursos', 'layout')
  revalidatePath('/dashboard', 'layout')
  return { error: null }
}

// ============================================
// Cursos inscritos del usuario
// ============================================

export async function getEnrolledCourses(): Promise<{
  data: Array<CourseWithStats & { enrolled_at: string }> | null
  error: string | null
}> {
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { data: null, error: authError || 'No autenticado' }
  }

  const { data: enrollments, error } = await supabase
    .from('course_enrollments')
    .select(`
      enrolled_at,
      course:courses (
        *,
        modules (
          id,
          lessons (
            id,
            duration_minutes
          )
        )
      )
    `)
    .eq('user_id', user.id)
    .order('enrolled_at', { ascending: false })

  if (error) {
    return { data: null, error: error.message }
  }

  const courses = (enrollments || [])
    .filter((e) => e.course)
    .map((enrollment) => {
      const course = enrollment.course as unknown as Record<string, unknown>
      const modules = (course.modules || []) as Array<{
        id: string
        lessons: Array<{ id: string; duration_minutes: number }>
      }>
      const allLessons = modules.flatMap(m => m.lessons || [])

      return {
        id: course.id as string,
        title: course.title as string,
        description: course.description as string | null,
        slug: course.slug as string,
        category: course.category as CourseCategory,
        level: course.level as CourseLevel,
        thumbnail_url: course.thumbnail_url as string | null,
        price: course.price as number,
        is_published: course.is_published as boolean,
        created_by: course.created_by as string,
        created_at: course.created_at as string,
        updated_at: course.updated_at as string,
        modules_count: modules.length,
        lessons_count: allLessons.length,
        total_duration_minutes: allLessons.reduce((sum, l) => sum + (l.duration_minutes || 0), 0),
        enrolled_count: 0,
        enrolled_at: enrollment.enrolled_at,
      }
    })

  return { data: courses, error: null }
}

// ============================================
// Verificar inscripcion
// ============================================

export async function isEnrolled(courseId: string): Promise<boolean> {
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) return false

  const { data } = await supabase
    .from('course_enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single()

  return !!data
}

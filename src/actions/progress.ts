'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { awardXP, checkAndAwardBadges } from './gamification'

// ============================================
// Auth helper
// ============================================

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado', supabase: null, user: null }
  return { error: null, supabase, user }
}

// ============================================
// Completar leccion
// ============================================

export async function completeLesson(lessonId: string, courseId: string): Promise<{
  error: string | null
  alreadyCompleted: boolean
}> {
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autenticado', alreadyCompleted: false }
  }

  // Verificar que esta inscrito en el curso
  const { data: enrollment } = await supabase
    .from('course_enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single()

  if (!enrollment) {
    return { error: 'No estas inscrito en este curso', alreadyCompleted: false }
  }

  // Verificar si ya esta completada
  const { data: existing } = await supabase
    .from('lesson_progress')
    .select('id')
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
    .single()

  if (existing) {
    return { error: null, alreadyCompleted: true }
  }

  // Marcar como completada
  const { error } = await supabase
    .from('lesson_progress')
    .insert({
      user_id: user.id,
      lesson_id: lessonId,
      course_id: courseId,
    })

  if (error) {
    return { error: error.message, alreadyCompleted: false }
  }

  // Otorgar XP por completar lección
  await awardXP(user.id, 10, 'lesson_complete', 'Lección completada')

  // Verificar si completó el curso
  const { data: modules } = await supabase
    .from('modules')
    .select('id, lessons(id)')
    .eq('course_id', courseId)

  const totalLessons = (modules || []).reduce(
    (sum, m) => sum + ((m.lessons as unknown as Array<{ id: string }>)?.length || 0), 0
  )
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)

  if ((progress || []).length >= totalLessons && totalLessons > 0) {
    // Marcar curso como completado
    await supabase
      .from('course_enrollments')
      .update({ completed_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('course_id', courseId)

    // XP bonus por completar curso
    await awardXP(user.id, 100, 'course_complete', 'Curso completado')
  }

  // Verificar badges
  await checkAndAwardBadges(user.id)

  revalidatePath('/cursos', 'layout')
  revalidatePath('/dashboard', 'layout')
  return { error: null, alreadyCompleted: false }
}

// ============================================
// Obtener progreso de lecciones de un curso
// ============================================

export async function getLessonProgress(courseId: string): Promise<{
  data: string[] | null
  error: string | null
}> {
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { data: null, error: authError || 'No autenticado' }
  }

  const { data, error } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: (data || []).map(p => p.lesson_id), error: null }
}

// ============================================
// Obtener porcentaje de progreso de un curso
// ============================================

export async function getCourseProgress(courseId: string): Promise<{
  data: { completed: number; total: number; percentage: number } | null
  error: string | null
}> {
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { data: null, error: authError || 'No autenticado' }
  }

  // Contar lecciones completadas
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)

  // Contar lecciones totales del curso
  const { data: modules } = await supabase
    .from('modules')
    .select('id, lessons(id)')
    .eq('course_id', courseId)

  const totalLessons = (modules || []).reduce(
    (sum, m) => sum + ((m.lessons as unknown as Array<{ id: string }>)?.length || 0), 0
  )
  const completedLessons = (progress || []).length
  const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return {
    data: { completed: completedLessons, total: totalLessons, percentage },
    error: null,
  }
}

// ============================================
// Obtener progreso de multiples cursos (batch)
// ============================================

export async function getBatchCourseProgress(courseIds: string[]): Promise<{
  data: Record<string, { completed: number; total: number; percentage: number }> | null
  error: string | null
}> {
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { data: null, error: authError || 'No autenticado' }
  }

  // Progreso del usuario para todos los cursos
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id, course_id')
    .eq('user_id', user.id)
    .in('course_id', courseIds)

  // Lecciones totales por curso
  const { data: modules } = await supabase
    .from('modules')
    .select('course_id, lessons(id)')
    .in('course_id', courseIds)

  // Agrupar lecciones por curso
  const totalByCourse: Record<string, number> = {}
  for (const mod of modules || []) {
    const courseId = mod.course_id
    const lessonCount = (mod.lessons as unknown as Array<{ id: string }>)?.length || 0
    totalByCourse[courseId] = (totalByCourse[courseId] || 0) + lessonCount
  }

  // Agrupar completadas por curso
  const completedByCourse: Record<string, number> = {}
  for (const p of progress || []) {
    completedByCourse[p.course_id] = (completedByCourse[p.course_id] || 0) + 1
  }

  // Calcular porcentajes
  const result: Record<string, { completed: number; total: number; percentage: number }> = {}
  for (const courseId of courseIds) {
    const total = totalByCourse[courseId] || 0
    const completed = completedByCourse[courseId] || 0
    result[courseId] = {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  }

  return { data: result, error: null }
}
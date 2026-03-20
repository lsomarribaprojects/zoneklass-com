'use server'

import { revalidatePath } from 'next/cache'
import { lessonSchema } from '@/features/courses/types/schemas'
import { requireCourseAccess, requireInstructor, getCourseIdFromModule, getCourseIdFromLesson } from '@/lib/auth/permissions'

export async function createLesson(formData: FormData) {
  const moduleId = formData.get('module_id') as string
  if (!moduleId) return { error: 'module_id es requerido' }

  // Resolve module → course, then check ownership
  const auth = await requireInstructor()
  if (auth.error || !auth.supabase) {
    return { error: auth.error || 'No autorizado' }
  }

  const courseId = await getCourseIdFromModule(auth.supabase, moduleId)
  if (!courseId) return { error: 'Módulo no encontrado' }

  const { error: accessError, supabase } = await requireCourseAccess(courseId)
  if (accessError || !supabase) {
    return { error: accessError || 'No autorizado' }
  }

  // Validar datos
  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    video_url: formData.get('video_url'),
    duration_minutes: formData.get('duration_minutes'),
    module_id: moduleId,
  }

  const parsed = lessonSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  // Calcular siguiente order_index
  const { data: maxOrderData } = await supabase
    .from('lessons')
    .select('order_index')
    .eq('module_id', parsed.data.module_id)
    .order('order_index', { ascending: false })
    .limit(1)
    .single()

  const nextOrder = maxOrderData ? maxOrderData.order_index + 1 : 0

  // Insertar lección
  const { data, error } = await supabase
    .from('lessons')
    .insert({
      ...parsed.data,
      order_index: nextOrder,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/courses', 'layout')
  revalidatePath('/instructor/courses', 'layout')
  return { data }
}

export async function updateLesson(lessonId: string, formData: FormData) {
  // Resolve lesson → module → course, then check ownership
  const auth = await requireInstructor()
  if (auth.error || !auth.supabase) {
    return { error: auth.error || 'No autorizado' }
  }

  const courseId = await getCourseIdFromLesson(auth.supabase, lessonId)
  if (!courseId) return { error: 'Lección no encontrada' }

  const { error: accessError, supabase } = await requireCourseAccess(courseId)
  if (accessError || !supabase) {
    return { error: accessError || 'No autorizado' }
  }

  // Validar datos
  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    video_url: formData.get('video_url'),
    duration_minutes: formData.get('duration_minutes'),
    module_id: formData.get('module_id'),
  }

  const parsed = lessonSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  // Actualizar lección
  const { data, error } = await supabase
    .from('lessons')
    .update(parsed.data)
    .eq('id', lessonId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/courses', 'layout')
  revalidatePath('/instructor/courses', 'layout')
  return { data }
}

export async function deleteLesson(lessonId: string) {
  // Resolve lesson → module → course, then check ownership
  const auth = await requireInstructor()
  if (auth.error || !auth.supabase) {
    return { error: auth.error || 'No autorizado' }
  }

  const courseId = await getCourseIdFromLesson(auth.supabase, lessonId)
  if (!courseId) return { error: 'Lección no encontrada' }

  const { error: accessError, supabase } = await requireCourseAccess(courseId)
  if (accessError || !supabase) {
    return { error: accessError || 'No autorizado' }
  }

  // Eliminar lección
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', lessonId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/courses', 'layout')
  revalidatePath('/instructor/courses', 'layout')
  return { data: { success: true } }
}

export async function reorderLessons(moduleId: string, lessonIds: string[]) {
  // Resolve module → course, then check ownership
  const auth = await requireInstructor()
  if (auth.error || !auth.supabase) {
    return { error: auth.error || 'No autorizado' }
  }

  const courseId = await getCourseIdFromModule(auth.supabase, moduleId)
  if (!courseId) return { error: 'Módulo no encontrado' }

  const { error: accessError, supabase } = await requireCourseAccess(courseId)
  if (accessError || !supabase) {
    return { error: accessError || 'No autorizado' }
  }

  if (!Array.isArray(lessonIds) || lessonIds.length === 0) {
    return { error: 'IDs de lecciones inválidos' }
  }

  // Actualizar order_index para cada lección
  const updates = lessonIds.map((id, index) =>
    supabase
      .from('lessons')
      .update({ order_index: index })
      .eq('id', id)
      .eq('module_id', moduleId)
  )

  const results = await Promise.all(updates)

  const firstError = results.find(result => result.error)
  if (firstError?.error) {
    return { error: firstError.error.message }
  }

  revalidatePath('/admin/courses', 'layout')
  revalidatePath('/instructor/courses', 'layout')
  return { data: { success: true } }
}

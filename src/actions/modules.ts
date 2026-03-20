'use server'

import { revalidatePath } from 'next/cache'
import { moduleSchema } from '@/features/courses/types/schemas'
import { requireCourseAccess, requireInstructor, getCourseIdFromModule } from '@/lib/auth/permissions'

export async function createModule(formData: FormData) {
  const courseId = formData.get('course_id') as string
  if (!courseId) return { error: 'course_id es requerido' }

  // Ownership check: instructor solo sus cursos, admin cualquier curso
  const { error: authError, supabase } = await requireCourseAccess(courseId)
  if (authError || !supabase) {
    return { error: authError || 'No autorizado' }
  }

  // Validar datos
  const rawData = {
    title: formData.get('title'),
    course_id: courseId,
  }

  const parsed = moduleSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  // Calcular siguiente order_index
  const { data: maxOrderData } = await supabase
    .from('modules')
    .select('order_index')
    .eq('course_id', parsed.data.course_id)
    .order('order_index', { ascending: false })
    .limit(1)
    .single()

  const nextOrder = maxOrderData ? maxOrderData.order_index + 1 : 0

  // Insertar módulo
  const { data, error } = await supabase
    .from('modules')
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

export async function updateModule(moduleId: string, formData: FormData) {
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

  // Validar título
  const title = formData.get('title')
  if (!title || typeof title !== 'string' || title.trim().length < 2) {
    return { error: 'El título debe tener al menos 2 caracteres' }
  }

  if (title.length > 200) {
    return { error: 'El título no puede exceder 200 caracteres' }
  }

  // Actualizar módulo
  const { data, error } = await supabase
    .from('modules')
    .update({ title: title.trim() })
    .eq('id', moduleId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/courses', 'layout')
  revalidatePath('/instructor/courses', 'layout')
  return { data }
}

export async function deleteModule(moduleId: string) {
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

  // Eliminar módulo (CASCADE manejará las lecciones)
  const { error } = await supabase
    .from('modules')
    .delete()
    .eq('id', moduleId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/courses', 'layout')
  revalidatePath('/instructor/courses', 'layout')
  return { data: { success: true } }
}

export async function reorderModules(courseId: string, moduleIds: string[]) {
  // Ownership check
  const { error: authError, supabase } = await requireCourseAccess(courseId)
  if (authError || !supabase) {
    return { error: authError || 'No autorizado' }
  }

  if (!Array.isArray(moduleIds) || moduleIds.length === 0) {
    return { error: 'IDs de módulos inválidos' }
  }

  // Actualizar order_index para cada módulo
  const updates = moduleIds.map((id, index) =>
    supabase
      .from('modules')
      .update({ order_index: index })
      .eq('id', id)
      .eq('course_id', courseId)
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

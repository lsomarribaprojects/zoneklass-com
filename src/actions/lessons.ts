'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { lessonSchema } from '@/features/courses/types/schemas'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado', supabase: null, user: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['super_admin', 'admin'].includes(profile.role)) {
    return { error: 'No autorizado', supabase: null, user: null }
  }
  return { error: null, supabase, user }
}

export async function createLesson(formData: FormData) {
  // 1. Verificar autorización
  const { error: authError, supabase } = await requireAdmin()
  if (authError || !supabase) {
    return { error: authError || 'No autorizado' }
  }

  // 2. Validar datos
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

  // 3. Calcular siguiente order_index
  const { data: maxOrderData } = await supabase
    .from('lessons')
    .select('order_index')
    .eq('module_id', parsed.data.module_id)
    .order('order_index', { ascending: false })
    .limit(1)
    .single()

  const nextOrder = maxOrderData ? maxOrderData.order_index + 1 : 0

  // 4. Insertar lección
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

  // 5. Revalidar
  revalidatePath('/admin/courses', 'layout')
  return { data }
}

export async function updateLesson(lessonId: string, formData: FormData) {
  // 1. Verificar autorización
  const { error: authError, supabase } = await requireAdmin()
  if (authError || !supabase) {
    return { error: authError || 'No autorizado' }
  }

  // 2. Validar datos
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

  // 3. Actualizar lección
  const { data, error } = await supabase
    .from('lessons')
    .update(parsed.data)
    .eq('id', lessonId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // 4. Revalidar
  revalidatePath('/admin/courses', 'layout')
  return { data }
}

export async function deleteLesson(lessonId: string) {
  // 1. Verificar autorización
  const { error: authError, supabase } = await requireAdmin()
  if (authError || !supabase) {
    return { error: authError || 'No autorizado' }
  }

  // 2. Eliminar lección
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', lessonId)

  if (error) {
    return { error: error.message }
  }

  // 3. Revalidar
  revalidatePath('/admin/courses', 'layout')
  return { data: { success: true } }
}

export async function reorderLessons(moduleId: string, lessonIds: string[]) {
  // 1. Verificar autorización
  const { error: authError, supabase } = await requireAdmin()
  if (authError || !supabase) {
    return { error: authError || 'No autorizado' }
  }

  // 2. Validar entrada
  if (!Array.isArray(lessonIds) || lessonIds.length === 0) {
    return { error: 'IDs de lecciones inválidos' }
  }

  // 3. Actualizar order_index para cada lección
  const updates = lessonIds.map((id, index) =>
    supabase
      .from('lessons')
      .update({ order_index: index })
      .eq('id', id)
      .eq('module_id', moduleId)
  )

  const results = await Promise.all(updates)

  // 4. Verificar errores
  const firstError = results.find(result => result.error)
  if (firstError?.error) {
    return { error: firstError.error.message }
  }

  // 5. Revalidar
  revalidatePath('/admin/courses', 'layout')
  return { data: { success: true } }
}

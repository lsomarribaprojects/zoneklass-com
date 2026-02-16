'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { moduleSchema } from '@/features/courses/types/schemas'

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

export async function createModule(formData: FormData) {
  // 1. Verificar autorización
  const { error: authError, supabase } = await requireAdmin()
  if (authError || !supabase) {
    return { error: authError || 'No autorizado' }
  }

  // 2. Validar datos
  const rawData = {
    title: formData.get('title'),
    course_id: formData.get('course_id'),
  }

  const parsed = moduleSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  // 3. Calcular siguiente order_index
  const { data: maxOrderData } = await supabase
    .from('modules')
    .select('order_index')
    .eq('course_id', parsed.data.course_id)
    .order('order_index', { ascending: false })
    .limit(1)
    .single()

  const nextOrder = maxOrderData ? maxOrderData.order_index + 1 : 0

  // 4. Insertar módulo
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

  // 5. Revalidar
  revalidatePath('/admin/courses', 'layout')
  return { data }
}

export async function updateModule(moduleId: string, formData: FormData) {
  // 1. Verificar autorización
  const { error: authError, supabase } = await requireAdmin()
  if (authError || !supabase) {
    return { error: authError || 'No autorizado' }
  }

  // 2. Validar título
  const title = formData.get('title')
  if (!title || typeof title !== 'string' || title.trim().length < 2) {
    return { error: 'El título debe tener al menos 2 caracteres' }
  }

  if (title.length > 200) {
    return { error: 'El título no puede exceder 200 caracteres' }
  }

  // 3. Actualizar módulo
  const { data, error } = await supabase
    .from('modules')
    .update({ title: title.trim() })
    .eq('id', moduleId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // 4. Revalidar
  revalidatePath('/admin/courses', 'layout')
  return { data }
}

export async function deleteModule(moduleId: string) {
  // 1. Verificar autorización
  const { error: authError, supabase } = await requireAdmin()
  if (authError || !supabase) {
    return { error: authError || 'No autorizado' }
  }

  // 2. Eliminar módulo (CASCADE manejará las lecciones)
  const { error } = await supabase
    .from('modules')
    .delete()
    .eq('id', moduleId)

  if (error) {
    return { error: error.message }
  }

  // 3. Revalidar
  revalidatePath('/admin/courses', 'layout')
  return { data: { success: true } }
}

export async function reorderModules(courseId: string, moduleIds: string[]) {
  // 1. Verificar autorización
  const { error: authError, supabase } = await requireAdmin()
  if (authError || !supabase) {
    return { error: authError || 'No autorizado' }
  }

  // 2. Validar entrada
  if (!Array.isArray(moduleIds) || moduleIds.length === 0) {
    return { error: 'IDs de módulos inválidos' }
  }

  // 3. Actualizar order_index para cada módulo
  const updates = moduleIds.map((id, index) =>
    supabase
      .from('modules')
      .update({ order_index: index })
      .eq('id', id)
      .eq('course_id', courseId)
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

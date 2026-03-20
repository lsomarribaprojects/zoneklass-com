'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { courseSchema } from '@/features/courses/types/schemas'
import {
  requireInstructor,
  requireCourseOwnership,
  canCreateCourse,
  requireAdmin
} from '@/lib/auth/permissions'

function generateSlug(title: string): string {
  return title.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function createCourse(formData: FormData) {
  // 1. Verificar autorización (instructor o admin)
  const { error: authError, supabase, user } = await requireInstructor()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autorizado' }
  }

  // 2. Verificar límites del plan (solo para instructores, no para admins)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'instructor') {
    const { canCreate, error: limitError } = await canCreateCourse(user.id)
    if (!canCreate) {
      return { error: limitError || 'Has alcanzado el límite de cursos de tu plan' }
    }
  }

  // 3. Validar datos
  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    slug: formData.get('slug'),
    category: formData.get('category'),
    level: formData.get('level'),
    thumbnail_url: formData.get('thumbnail_url'),
    price: formData.get('price'),
  }

  const parsed = courseSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  // 4. Auto-generar slug si está vacío
  const slug = parsed.data.slug || generateSlug(parsed.data.title)

  // 5. Verificar que el slug no esté en uso
  const { data: existingCourse } = await supabase
    .from('courses')
    .select('id')
    .eq('slug', slug)
    .single()

  if (existingCourse) {
    return { error: 'El slug ya está en uso. Elige uno diferente.' }
  }

  // 6. Insertar curso
  const { data, error } = await supabase
    .from('courses')
    .insert({
      ...parsed.data,
      slug,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // 7. Revalidar y redirigir
  revalidatePath('/admin/courses', 'layout')
  revalidatePath('/instructor/courses', 'layout')
  redirect(`/admin/courses/${data.id}/edit`)
}

export async function updateCourse(courseId: string, formData: FormData) {
  // 1. Verificar ownership (instructor puede editar solo SUS cursos)
  const { error: ownershipError, isOwner } = await requireCourseOwnership(courseId)
  if (ownershipError || !isOwner) {
    return { error: ownershipError || 'No eres el propietario de este curso' }
  }

  // 2. Get supabase client
  const supabase = await createClient()

  // 3. Validar datos
  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    slug: formData.get('slug'),
    category: formData.get('category'),
    level: formData.get('level'),
    thumbnail_url: formData.get('thumbnail_url'),
    price: formData.get('price'),
  }

  const parsed = courseSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  // 4. Verificar que el slug no esté en uso por otro curso
  const { data: existingCourse } = await supabase
    .from('courses')
    .select('id')
    .eq('slug', parsed.data.slug)
    .neq('id', courseId)
    .single()

  if (existingCourse) {
    return { error: 'El slug ya está en uso por otro curso.' }
  }

  // 5. Actualizar curso (RLS garantiza que solo el owner puede actualizar)
  const { data, error } = await supabase
    .from('courses')
    .update(parsed.data)
    .eq('id', courseId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // 6. Revalidar
  revalidatePath('/admin/courses', 'layout')
  revalidatePath('/instructor/courses', 'layout')
  return { data }
}

export async function deleteCourse(courseId: string) {
  // 1. Verificar ownership (instructor puede eliminar solo SUS cursos)
  const { error: ownershipError, isOwner } = await requireCourseOwnership(courseId)
  if (ownershipError || !isOwner) {
    return { error: ownershipError || 'No eres el propietario de este curso' }
  }

  // 2. Get supabase client
  const supabase = await createClient()

  // 3. Eliminar curso (CASCADE manejará módulos y lecciones)
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId)

  if (error) {
    return { error: error.message }
  }

  // 4. Revalidar y redirigir
  revalidatePath('/admin/courses', 'layout')
  revalidatePath('/instructor/courses', 'layout')
  redirect('/admin/courses')
}

export async function togglePublish(courseId: string) {
  // 1. Verificar ownership (instructor puede publicar solo SUS cursos)
  const { error: ownershipError, isOwner } = await requireCourseOwnership(courseId)
  if (ownershipError || !isOwner) {
    return { error: ownershipError || 'No eres el propietario de este curso' }
  }

  // 2. Get supabase client
  const supabase = await createClient()

  // 3. Obtener estado actual
  const { data: course, error: fetchError } = await supabase
    .from('courses')
    .select('is_published')
    .eq('id', courseId)
    .single()

  if (fetchError || !course) {
    return { error: fetchError?.message || 'Curso no encontrado' }
  }

  // 4. Toggle is_published
  const { data, error } = await supabase
    .from('courses')
    .update({ is_published: !course.is_published })
    .eq('id', courseId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // 5. Revalidar
  revalidatePath('/admin/courses', 'layout')
  revalidatePath('/instructor/courses', 'layout')
  revalidatePath('/marketplace', 'layout')
  return { data }
}

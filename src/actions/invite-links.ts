'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { inviteLinkSchema } from '@/features/courses/types/schemas'
import type { InviteLinkWithStats, InviteAction, CourseWithStats } from '@/types/database'

// ============================================
// Auth helpers
// ============================================

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

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado', supabase: null, user: null }
  return { error: null, supabase, user }
}

// ============================================
// Helpers
// ============================================

function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// ============================================
// CRUD - Admin only
// ============================================

export async function createInviteLink(formData: FormData): Promise<{
  data?: { id: string; code: string }
  error: string | null
}> {
  const { error: authError, supabase, user } = await requireAdmin()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autorizado' }
  }

  const rawData = {
    label: formData.get('label'),
    source: formData.get('source'),
    expires_at: formData.get('expires_at'),
    max_uses: formData.get('max_uses') || 0,
    course_id: formData.get('course_id'),
  }

  const parsed = inviteLinkSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  // Generate unique code with retry
  let code = ''
  for (let attempt = 0; attempt < 5; attempt++) {
    code = generateInviteCode()
    const { data: existing } = await supabase
      .from('invite_links')
      .select('id')
      .eq('code', code)
      .single()

    if (!existing) break
    if (attempt === 4) return { error: 'No se pudo generar un codigo unico. Intenta de nuevo.' }
  }

  const { data, error } = await supabase
    .from('invite_links')
    .insert({
      course_id: parsed.data.course_id,
      code,
      label: parsed.data.label,
      source: parsed.data.source,
      expires_at: parsed.data.expires_at || null,
      max_uses: parsed.data.max_uses || 0,
      created_by: user.id,
    })
    .select('id, code')
    .single()

  if (error) return { error: error.message }

  revalidatePath(`/admin/courses/${parsed.data.course_id}/links`)
  return { data, error: null }
}

export async function getInviteLinks(courseId: string): Promise<{
  data: InviteLinkWithStats[] | null
  error: string | null
}> {
  const { error: authError, supabase } = await requireAdmin()
  if (authError || !supabase) {
    return { data: null, error: authError || 'No autorizado' }
  }

  const { data: links, error } = await supabase
    .from('invite_links')
    .select('*')
    .eq('course_id', courseId)
    .order('created_at', { ascending: false })

  if (error) return { data: null, error: error.message }
  if (!links || links.length === 0) return { data: [], error: null }

  // Get tracking stats for all links
  const linkIds = links.map(l => l.id)
  const { data: tracking } = await supabase
    .from('invite_tracking')
    .select('invite_link_id, action')
    .in('invite_link_id', linkIds)

  // Aggregate stats
  const statsMap = new Map<string, { clicks: number; registrations: number; enrollments: number }>()
  for (const link of links) {
    statsMap.set(link.id, { clicks: 0, registrations: 0, enrollments: 0 })
  }
  for (const t of tracking || []) {
    const stats = statsMap.get(t.invite_link_id)
    if (!stats) continue
    if (t.action === 'click') stats.clicks++
    else if (t.action === 'register') stats.registrations++
    else if (t.action === 'enroll') stats.enrollments++
  }

  const linksWithStats: InviteLinkWithStats[] = links.map(link => ({
    ...link,
    ...statsMap.get(link.id)!,
  }))

  return { data: linksWithStats, error: null }
}

export async function toggleInviteLink(linkId: string): Promise<{
  error: string | null
}> {
  const { error: authError, supabase } = await requireAdmin()
  if (authError || !supabase) {
    return { error: authError || 'No autorizado' }
  }

  // Get current state
  const { data: link } = await supabase
    .from('invite_links')
    .select('is_active, course_id')
    .eq('id', linkId)
    .single()

  if (!link) return { error: 'Link no encontrado' }

  const { error } = await supabase
    .from('invite_links')
    .update({ is_active: !link.is_active })
    .eq('id', linkId)

  if (error) return { error: error.message }

  revalidatePath(`/admin/courses/${link.course_id}/links`)
  return { error: null }
}

export async function deleteInviteLink(linkId: string): Promise<{
  error: string | null
}> {
  const { error: authError, supabase } = await requireAdmin()
  if (authError || !supabase) {
    return { error: authError || 'No autorizado' }
  }

  // Get course_id for revalidation
  const { data: link } = await supabase
    .from('invite_links')
    .select('course_id')
    .eq('id', linkId)
    .single()

  const { error } = await supabase
    .from('invite_links')
    .delete()
    .eq('id', linkId)

  if (error) return { error: error.message }

  if (link) {
    revalidatePath(`/admin/courses/${link.course_id}/links`)
  }
  return { error: null }
}

// ============================================
// Public actions
// ============================================

interface ValidatedInvite {
  invite_link_id: string
  course: CourseWithStats & { slug: string; is_enrolled: boolean }
}

export async function validateInviteCode(code: string): Promise<{
  data: ValidatedInvite | null
  error: string | null
}> {
  const supabase = await createClient()

  // Find invite link
  const { data: link, error: linkError } = await supabase
    .from('invite_links')
    .select('*, courses(*)')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single()

  if (linkError || !link) {
    return { data: null, error: 'Este enlace de invitacion no es valido' }
  }

  // Check expiration
  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    return { data: null, error: 'Este enlace de invitacion ha expirado' }
  }

  // Check max uses (0 = unlimited)
  if (link.max_uses > 0 && link.current_uses >= link.max_uses) {
    return { data: null, error: 'Este enlace de invitacion ha alcanzado su limite de usos' }
  }

  const course = link.courses as unknown as Record<string, unknown>
  if (!course || !(course.is_published as boolean)) {
    return { data: null, error: 'El curso asociado no esta disponible' }
  }

  // Get modules/lessons stats
  const { data: modules } = await supabase
    .from('modules')
    .select('id, lessons(id, duration_minutes)')
    .eq('course_id', course.id as string)

  const allLessons = (modules || []).flatMap(
    (m: { lessons: Array<{ id: string; duration_minutes: number }> }) => m.lessons || []
  )

  // Check if user is enrolled
  let isEnrolled = false
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: enrollment } = await supabase
      .from('course_enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', course.id as string)
      .single()
    isEnrolled = !!enrollment
  }

  return {
    data: {
      invite_link_id: link.id,
      course: {
        id: course.id as string,
        title: course.title as string,
        description: course.description as string | null,
        slug: course.slug as string,
        category: course.category as CourseWithStats['category'],
        level: course.level as CourseWithStats['level'],
        thumbnail_url: course.thumbnail_url as string | null,
        price: course.price as number,
        is_published: course.is_published as boolean,
        created_by: course.created_by as string,
        created_at: course.created_at as string,
        updated_at: course.updated_at as string,
        modules_count: (modules || []).length,
        lessons_count: allLessons.length,
        total_duration_minutes: allLessons.reduce((sum, l) => sum + (l.duration_minutes || 0), 0),
        enrolled_count: 0,
        is_enrolled: isEnrolled,
      },
    },
    error: null,
  }
}

export async function trackInviteAction(
  linkId: string,
  action: InviteAction
): Promise<{ error: string | null }> {
  const supabase = await createClient()

  // Get user if authenticated
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('invite_tracking')
    .insert({
      invite_link_id: linkId,
      user_id: user?.id || null,
      action,
      ip_hash: null,
    })

  if (error) return { error: error.message }

  return { error: null }
}

export async function enrollViaInvite(code: string): Promise<{
  error: string | null
  slug?: string
}> {
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autenticado' }
  }

  // Validate invite code
  const { data: validated, error: validateError } = await validateInviteCode(code)
  if (validateError || !validated) {
    return { error: validateError || 'Codigo invalido' }
  }

  const courseId = validated.course.id

  // Check not already enrolled
  if (validated.course.is_enrolled) {
    return { error: null, slug: validated.course.slug }
  }

  // Enroll
  const { error: enrollError } = await supabase
    .from('course_enrollments')
    .insert({
      user_id: user.id,
      course_id: courseId,
    })

  if (enrollError) return { error: enrollError.message }

  // Track enroll action + increment uses
  await supabase
    .from('invite_tracking')
    .insert({
      invite_link_id: validated.invite_link_id,
      user_id: user.id,
      action: 'enroll' as InviteAction,
      ip_hash: null,
    })

  // Increment current_uses
  const { data: link } = await supabase
    .from('invite_links')
    .select('current_uses')
    .eq('id', validated.invite_link_id)
    .single()

  if (link) {
    await supabase
      .from('invite_links')
      .update({ current_uses: link.current_uses + 1 })
      .eq('id', validated.invite_link_id)
  }

  revalidatePath('/cursos', 'layout')
  revalidatePath('/dashboard', 'layout')
  return { error: null, slug: validated.course.slug }
}

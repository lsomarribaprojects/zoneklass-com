'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { HannaConfig, HannaConversation, HannaMode, UserRole } from '@/types/database'

// ============================================
// Auth Helper
// ============================================

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado', supabase: null, user: null, role: null as UserRole | null }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['super_admin', 'admin'].includes(profile.role)) {
    return { error: 'No autorizado', supabase: null, user: null, role: null as UserRole | null }
  }
  return { error: null, supabase, user, role: profile.role as UserRole }
}

// ============================================
// Dashboard Stats
// ============================================

export interface AdminStats {
  totalUsers: number
  activeUsers7d: number
  totalCourses: number
  publishedCourses: number
  totalEnrollments: number
  lessonsCompleted: number
}

export async function getAdminStats(): Promise<{ data: AdminStats | null; error: string | null }> {
  const { error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  try {
    const service = createServiceClient()
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const [users, active, courses, published, enrollments, lessons] = await Promise.all([
      service.from('profiles').select('*', { count: 'exact', head: true }),
      service.from('lesson_progress').select('user_id', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo),
      service.from('courses').select('*', { count: 'exact', head: true }),
      service.from('courses').select('*', { count: 'exact', head: true }).eq('is_published', true),
      service.from('course_enrollments').select('*', { count: 'exact', head: true }),
      service.from('lesson_progress').select('*', { count: 'exact', head: true }),
    ])

    return {
      data: {
        totalUsers: users.count || 0,
        activeUsers7d: active.count || 0,
        totalCourses: courses.count || 0,
        publishedCourses: published.count || 0,
        totalEnrollments: enrollments.count || 0,
        lessonsCompleted: lessons.count || 0,
      },
      error: null,
    }
  } catch (err) {
    console.error('Error fetching admin stats:', err)
    return { data: null, error: 'Error al obtener estadisticas' }
  }
}

// ============================================
// Registration Chart (last 30 days)
// ============================================

export interface RegistrationDataPoint {
  date: string
  count: number
}

export async function getRegistrationChart(): Promise<{ data: RegistrationDataPoint[] | null; error: string | null }> {
  const { error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  try {
    const service = createServiceClient()
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const { data: profiles } = await service
      .from('profiles')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: true })

    // Group by date
    const countsByDate: Record<string, number> = {}
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      countsByDate[d.toISOString().split('T')[0]] = 0
    }

    profiles?.forEach((p) => {
      const date = new Date(p.created_at).toISOString().split('T')[0]
      if (countsByDate[date] !== undefined) {
        countsByDate[date]++
      }
    })

    const result: RegistrationDataPoint[] = Object.entries(countsByDate).map(([date, count]) => ({
      date,
      count,
    }))

    return { data: result, error: null }
  } catch (err) {
    console.error('Error fetching registration chart:', err)
    return { data: null, error: 'Error al obtener datos de registros' }
  }
}

// ============================================
// Enrollments by Course
// ============================================

export interface CourseEnrollmentStat {
  courseId: string
  courseTitle: string
  enrollmentCount: number
}

export async function getEnrollmentsByCourse(): Promise<{ data: CourseEnrollmentStat[] | null; error: string | null }> {
  const { error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  try {
    const service = createServiceClient()

    const { data: enrollments } = await service
      .from('course_enrollments')
      .select('course_id, courses(id, title)')

    if (!enrollments) return { data: [], error: null }

    const countMap: Record<string, { title: string; count: number }> = {}
    enrollments.forEach((e: Record<string, unknown>) => {
      const courseId = e.course_id as string
      const course = e.courses as { id: string; title: string } | null
      if (!countMap[courseId]) {
        countMap[courseId] = { title: course?.title || 'Sin titulo', count: 0 }
      }
      countMap[courseId].count++
    })

    const result: CourseEnrollmentStat[] = Object.entries(countMap)
      .map(([courseId, { title, count }]) => ({ courseId, courseTitle: title, enrollmentCount: count }))
      .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
      .slice(0, 10)

    return { data: result, error: null }
  } catch (err) {
    console.error('Error fetching enrollments by course:', err)
    return { data: null, error: 'Error al obtener inscripciones por curso' }
  }
}

// ============================================
// Top 5 Popular Courses
// ============================================

export interface PopularCourse {
  id: string
  title: string
  category: string
  enrollmentCount: number
}

export async function getTopCourses(): Promise<{ data: PopularCourse[] | null; error: string | null }> {
  const { error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  try {
    const service = createServiceClient()

    const { data: enrollments } = await service
      .from('course_enrollments')
      .select('course_id, courses(id, title, category)')

    if (!enrollments) return { data: [], error: null }

    const countMap: Record<string, { title: string; category: string; count: number }> = {}
    enrollments.forEach((e: Record<string, unknown>) => {
      const courseId = e.course_id as string
      const course = e.courses as { id: string; title: string; category: string } | null
      if (!countMap[courseId]) {
        countMap[courseId] = { title: course?.title || '', category: course?.category || '', count: 0 }
      }
      countMap[courseId].count++
    })

    const result: PopularCourse[] = Object.entries(countMap)
      .map(([id, { title, category, count }]) => ({ id, title, category, enrollmentCount: count }))
      .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
      .slice(0, 5)

    return { data: result, error: null }
  } catch (err) {
    console.error('Error fetching top courses:', err)
    return { data: null, error: 'Error al obtener cursos populares' }
  }
}

// ============================================
// Activity Feed
// ============================================

export interface ActivityEvent {
  type: 'registration' | 'enrollment' | 'completion'
  description: string
  userName: string
  timestamp: string
}

export async function getActivityFeed(): Promise<{ data: ActivityEvent[] | null; error: string | null }> {
  const { error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  try {
    const service = createServiceClient()

    const [registrations, enrollments, completions] = await Promise.all([
      service
        .from('profiles')
        .select('full_name, created_at')
        .order('created_at', { ascending: false })
        .limit(10),
      service
        .from('course_enrollments')
        .select('enrolled_at, profiles(full_name), courses(title)')
        .order('enrolled_at', { ascending: false })
        .limit(10),
      service
        .from('lesson_progress')
        .select('completed_at, profiles(full_name), lessons(title)')
        .order('completed_at', { ascending: false })
        .limit(10),
    ])

    const events: ActivityEvent[] = []

    registrations.data?.forEach((r: Record<string, unknown>) => {
      events.push({
        type: 'registration',
        description: 'se registro en la plataforma',
        userName: (r.full_name as string) || 'Usuario',
        timestamp: r.created_at as string,
      })
    })

    enrollments.data?.forEach((e: Record<string, unknown>) => {
      const profile = e.profiles as { full_name: string } | null
      const course = e.courses as { title: string } | null
      events.push({
        type: 'enrollment',
        description: `se inscribio en "${course?.title || 'curso'}"`,
        userName: profile?.full_name || 'Usuario',
        timestamp: e.enrolled_at as string,
      })
    })

    completions.data?.forEach((c: Record<string, unknown>) => {
      const profile = c.profiles as { full_name: string } | null
      const lesson = c.lessons as { title: string } | null
      events.push({
        type: 'completion',
        description: `completo la leccion "${lesson?.title || 'leccion'}"`,
        userName: profile?.full_name || 'Usuario',
        timestamp: c.completed_at as string,
      })
    })

    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return { data: events.slice(0, 10), error: null }
  } catch (err) {
    console.error('Error fetching activity feed:', err)
    return { data: null, error: 'Error al obtener actividad reciente' }
  }
}

// ============================================
// User Management
// ============================================

export interface AdminUser {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  level: number
  xp: number
  created_at: string
  updated_at: string
}

export interface UserFilters {
  role?: string
  search?: string
  page?: number
  perPage?: number
}

export interface UsersResult {
  users: AdminUser[]
  totalCount: number
  totalPages: number
  currentPage: number
}

export async function getUsers(filters: UserFilters = {}): Promise<{ data: UsersResult | null; error: string | null }> {
  const { error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  try {
    const service = createServiceClient()
    const page = filters.page || 1
    const perPage = filters.perPage || 20
    const offset = (page - 1) * perPage

    let query = service
      .from('profiles')
      .select('id, email, full_name, avatar_url, role, level, xp, created_at, updated_at', { count: 'exact' })

    if (filters.role && filters.role !== 'all') {
      query = query.eq('role', filters.role)
    }

    if (filters.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
    }

    const { data: users, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + perPage - 1)

    if (error) return { data: null, error: error.message }

    const totalCount = count || 0

    return {
      data: {
        users: (users || []) as AdminUser[],
        totalCount,
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
      },
      error: null,
    }
  } catch (err) {
    console.error('Error fetching users:', err)
    return { data: null, error: 'Error al obtener usuarios' }
  }
}

export async function changeUserRole(userId: string, newRole: string): Promise<{ error: string | null }> {
  const { error: authError, user, role } = await requireAdmin()
  if (authError || !user) return { error: authError || 'No autorizado' }

  // Only super_admin can change roles
  if (role !== 'super_admin') {
    return { error: 'Solo super_admin puede cambiar roles' }
  }

  // Cannot change own role
  if (userId === user.id) {
    return { error: 'No puedes cambiar tu propio rol' }
  }

  // Validate role
  const validRoles: UserRole[] = ['super_admin', 'admin', 'estudiante']
  if (!validRoles.includes(newRole as UserRole)) {
    return { error: 'Rol invalido' }
  }

  try {
    const service = createServiceClient()

    const { error } = await service
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) return { error: error.message }

    revalidatePath('/admin/users')
    return { error: null }
  } catch (err) {
    console.error('Error changing user role:', err)
    return { error: 'Error al cambiar rol' }
  }
}

export async function exportUsersCSV(): Promise<{ data: string | null; error: string | null }> {
  const { error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  try {
    const service = createServiceClient()

    const { data: users, error } = await service
      .from('profiles')
      .select('full_name, email, role, level, xp, created_at')
      .order('created_at', { ascending: false })

    if (error) return { data: null, error: error.message }

    const headers = 'Nombre,Email,Rol,Nivel,XP,Fecha Registro'
    const rows = (users || []).map((u: Record<string, unknown>) => {
      const name = ((u.full_name as string) || '').replace(/,/g, ' ')
      const email = (u.email as string) || ''
      const role = (u.role as string) || ''
      const level = u.level as number
      const xp = u.xp as number
      const date = new Date(u.created_at as string).toLocaleDateString('es-ES')
      return `${name},${email},${role},${level},${xp},${date}`
    })

    // UTF-8 BOM for Excel compatibility
    const csv = '\uFEFF' + headers + '\n' + rows.join('\n')

    return { data: csv, error: null }
  } catch (err) {
    console.error('Error exporting CSV:', err)
    return { data: null, error: 'Error al exportar CSV' }
  }
}

// ============================================
// Hanna AI Admin
// ============================================

export interface HannaStats {
  totalConversations: number
  avgRating: number | null
  satisfactionPercent: number
  messagesPerDay: number
}

export async function getHannaStats(): Promise<{ data: HannaStats | null; error: string | null }> {
  const { error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  try {
    const service = createServiceClient()
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const [totalResult, ratedResult, recentResult] = await Promise.all([
      service.from('hanna_conversations').select('*', { count: 'exact', head: true }),
      service.from('hanna_conversations').select('rating').not('rating', 'is', null),
      service.from('hanna_conversations').select('messages').gte('created_at', sevenDaysAgo),
    ])

    const totalConversations = totalResult.count || 0

    const ratings = (ratedResult.data || []).map((r: Record<string, unknown>) => r.rating as number)
    const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null
    const satisfied = ratings.filter((r) => r >= 4).length
    const satisfactionPercent = ratings.length > 0 ? Math.round((satisfied / ratings.length) * 100) : 0

    const totalMessages = (recentResult.data || []).reduce(
      (sum, c: Record<string, unknown>) => sum + ((c.messages as unknown[]) || []).length,
      0
    )
    const messagesPerDay = Math.round(totalMessages / 7)

    return {
      data: { totalConversations, avgRating, satisfactionPercent, messagesPerDay },
      error: null,
    }
  } catch (err) {
    console.error('Error fetching Hanna stats:', err)
    return { data: null, error: 'Error al obtener estadisticas de Hanna' }
  }
}

export interface HannaConversationListItem {
  id: string
  userName: string
  mode: HannaMode
  messageCount: number
  rating: number | null
  createdAt: string
}

export interface HannaConversationFilters {
  mode?: string
  minRating?: number
  page?: number
  perPage?: number
}

export async function getHannaConversations(filters: HannaConversationFilters = {}): Promise<{
  data: { conversations: HannaConversationListItem[]; totalCount: number } | null
  error: string | null
}> {
  const { error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  try {
    const service = createServiceClient()
    const page = filters.page || 1
    const perPage = filters.perPage || 20
    const offset = (page - 1) * perPage

    let query = service
      .from('hanna_conversations')
      .select('id, user_id, mode, messages, rating, created_at, profiles(full_name)', { count: 'exact' })

    if (filters.mode && filters.mode !== 'all') {
      query = query.eq('mode', filters.mode)
    }

    if (filters.minRating) {
      query = query.gte('rating', filters.minRating)
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + perPage - 1)

    if (error) return { data: null, error: error.message }

    const conversations: HannaConversationListItem[] = (data || []).map((c: Record<string, unknown>) => {
      const profile = c.profiles as { full_name: string } | null
      const messages = (c.messages as unknown[]) || []
      return {
        id: c.id as string,
        userName: profile?.full_name || 'Usuario',
        mode: c.mode as HannaMode,
        messageCount: messages.length,
        rating: c.rating as number | null,
        createdAt: c.created_at as string,
      }
    })

    return { data: { conversations, totalCount: count || 0 }, error: null }
  } catch (err) {
    console.error('Error fetching Hanna conversations:', err)
    return { data: null, error: 'Error al obtener conversaciones' }
  }
}

export async function getHannaConversation(conversationId: string): Promise<{
  data: { conversation: HannaConversation; userName: string } | null
  error: string | null
}> {
  const { error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  try {
    const service = createServiceClient()

    const { data, error } = await service
      .from('hanna_conversations')
      .select('*, profiles(full_name)')
      .eq('id', conversationId)
      .single()

    if (error || !data) return { data: null, error: error?.message || 'Conversacion no encontrada' }

    const profile = (data as Record<string, unknown>).profiles as { full_name: string } | null
    const conversation: HannaConversation = {
      id: data.id,
      user_id: data.user_id,
      title: data.title,
      mode: data.mode,
      messages: data.messages || [],
      rating: data.rating,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }

    return { data: { conversation, userName: profile?.full_name || 'Usuario' }, error: null }
  } catch (err) {
    console.error('Error fetching Hanna conversation:', err)
    return { data: null, error: 'Error al obtener conversacion' }
  }
}

export async function getHannaConfigs(): Promise<{ data: HannaConfig[] | null; error: string | null }> {
  const { error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  try {
    const service = createServiceClient()

    const { data, error } = await service
      .from('hanna_config')
      .select('*')
      .order('mode')

    if (error) return { data: null, error: error.message }
    return { data: (data || []) as HannaConfig[], error: null }
  } catch (err) {
    console.error('Error fetching Hanna configs:', err)
    return { data: null, error: 'Error al obtener configuraciones' }
  }
}

export async function updateHannaConfig(
  configId: string,
  updates: {
    system_prompt?: string
    model?: string
    temperature?: number
    max_tokens?: number
    is_active?: boolean
  }
): Promise<{ error: string | null }> {
  const { error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  // Validate temperature
  if (updates.temperature !== undefined && (updates.temperature < 0 || updates.temperature > 2)) {
    return { error: 'La temperatura debe estar entre 0 y 2' }
  }

  // Validate max_tokens
  if (updates.max_tokens !== undefined && updates.max_tokens < 1) {
    return { error: 'max_tokens debe ser mayor a 0' }
  }

  try {
    const service = createServiceClient()

    const { error } = await service
      .from('hanna_config')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', configId)

    if (error) return { error: error.message }

    revalidatePath('/admin/hanna')
    return { error: null }
  } catch (err) {
    console.error('Error updating Hanna config:', err)
    return { error: 'Error al actualizar configuracion' }
  }
}

// ============================================
// Invite Links (Global View)
// ============================================

export interface InviteLinkGlobal {
  id: string
  code: string
  label: string
  source: string
  courseName: string
  courseId: string
  maxUses: number
  currentUses: number
  isActive: boolean
  createdAt: string
  clicks: number
  registrations: number
  enrollments: number
}

export async function getAllInviteLinks(filters?: {
  courseId?: string
  source?: string
  isActive?: string
}): Promise<{ data: InviteLinkGlobal[] | null; error: string | null }> {
  const { error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  try {
    const service = createServiceClient()

    let query = service
      .from('invite_links')
      .select('*, courses(title)')
      .order('created_at', { ascending: false })

    if (filters?.courseId) {
      query = query.eq('course_id', filters.courseId)
    }

    if (filters?.source && filters.source !== 'all') {
      query = query.eq('source', filters.source)
    }

    if (filters?.isActive === 'active') {
      query = query.eq('is_active', true)
    } else if (filters?.isActive === 'inactive') {
      query = query.eq('is_active', false)
    }

    const { data: links, error } = await query

    if (error) return { data: null, error: error.message }
    if (!links || links.length === 0) return { data: [], error: null }

    // Fetch tracking stats for all links
    const linkIds = links.map((l: Record<string, unknown>) => l.id as string)
    const { data: tracking } = await service
      .from('invite_tracking')
      .select('invite_link_id, action')
      .in('invite_link_id', linkIds)

    const statsMap: Record<string, { clicks: number; registrations: number; enrollments: number }> = {}
    linkIds.forEach((id) => {
      statsMap[id] = { clicks: 0, registrations: 0, enrollments: 0 }
    })

    tracking?.forEach((t: Record<string, unknown>) => {
      const linkId = t.invite_link_id as string
      const action = t.action as string
      if (statsMap[linkId]) {
        if (action === 'click') statsMap[linkId].clicks++
        else if (action === 'register') statsMap[linkId].registrations++
        else if (action === 'enroll') statsMap[linkId].enrollments++
      }
    })

    const result: InviteLinkGlobal[] = links.map((l: Record<string, unknown>) => {
      const course = l.courses as { title: string } | null
      const id = l.id as string
      return {
        id,
        code: l.code as string,
        label: l.label as string,
        source: l.source as string,
        courseName: course?.title || 'Sin curso',
        courseId: l.course_id as string,
        maxUses: l.max_uses as number,
        currentUses: l.current_uses as number,
        isActive: l.is_active as boolean,
        createdAt: l.created_at as string,
        ...statsMap[id],
      }
    })

    return { data: result, error: null }
  } catch (err) {
    console.error('Error fetching invite links:', err)
    return { data: null, error: 'Error al obtener invite links' }
  }
}

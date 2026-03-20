/**
 * Permission System for Multi-Tenant ZoneKlass
 *
 * Provides granular permission checks and ownership validation
 * for instructors managing their own courses.
 */

import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/types/database'

// ============================================
// Permission Types
// ============================================

export type Permission =
  | 'course.create'
  | 'course.edit.own'
  | 'course.edit.any'
  | 'course.delete.own'
  | 'course.delete.any'
  | 'course.publish'
  | 'course.marketplace.publish'
  | 'analytics.view.own'
  | 'analytics.view.all'
  | 'users.manage'
  | 'users.view.all'
  | 'subscription.manage'
  | 'ai.generate'

// ============================================
// Role-Based Permissions Matrix
// ============================================

const rolePermissions: Record<UserRole, Permission[]> = {
  super_admin: ['*'] as any, // All permissions
  admin: [
    'course.edit.any',
    'course.delete.any',
    'course.publish',
    'course.marketplace.publish',
    'analytics.view.all',
    'users.view.all',
    'users.manage',
  ],
  instructor: [
    'course.create',
    'course.edit.own',
    'course.delete.own',
    'course.publish',
    'course.marketplace.publish',
    'analytics.view.own',
    'ai.generate',
  ],
  estudiante: [],
}

// ============================================
// Permission Helpers
// ============================================

/**
 * Check if user has a specific permission
 * @returns { authorized: boolean, error: string | null, user, profile }
 */
export async function requirePermission(permission: Permission) {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      authorized: false,
      error: 'No autenticado',
      user: null,
      profile: null,
      supabase: null
    }
  }

  // Get user profile with role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, email, full_name')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return {
      authorized: false,
      error: 'Perfil no encontrado',
      user,
      profile: null,
      supabase: null
    }
  }

  // Check permission
  const userRole = profile.role as UserRole
  const permissions = rolePermissions[userRole]
  const hasPermission = permissions.includes('*' as any) || permissions.includes(permission)

  if (!hasPermission) {
    return {
      authorized: false,
      error: `No tienes permiso para realizar esta acción (requiere: ${permission})`,
      user,
      profile,
      supabase: null
    }
  }

  return {
    authorized: true,
    error: null,
    user,
    profile,
    supabase
  }
}

/**
 * Require user to be an instructor (or higher role)
 * Used for creating courses, accessing instructor dashboard, etc.
 */
export async function requireInstructor() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      error: 'No autenticado',
      supabase: null,
      user: null,
      profile: null
    }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, email, full_name')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return {
      error: 'Perfil no encontrado',
      supabase: null,
      user,
      profile: null
    }
  }

  // Only instructors, admins, and super_admins can access instructor features
  const allowedRoles: UserRole[] = ['super_admin', 'admin', 'instructor']
  if (!allowedRoles.includes(profile.role)) {
    return {
      error: 'Solo instructores pueden acceder a esta función',
      supabase: null,
      user,
      profile
    }
  }

  return {
    error: null,
    supabase,
    user,
    profile
  }
}

/**
 * Require user to be an admin (or super_admin)
 * Legacy helper for admin-only features
 */
export async function requireAdmin() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      error: 'No autenticado',
      supabase: null,
      user: null,
      profile: null
    }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, email, full_name')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return {
      error: 'Perfil no encontrado',
      supabase: null,
      user,
      profile: null
    }
  }

  const allowedRoles: UserRole[] = ['super_admin', 'admin']
  if (!allowedRoles.includes(profile.role)) {
    return {
      error: 'Solo administradores pueden acceder a esta función',
      supabase: null,
      user,
      profile
    }
  }

  return {
    error: null,
    supabase,
    user,
    profile
  }
}

/**
 * Check if user owns a specific course
 * Returns isOwner=true for:
 * - Super admins (can edit any course)
 * - The course creator
 */
export async function requireCourseOwnership(courseId: string) {
  const { authorized, user, profile, supabase } = await requirePermission('course.edit.own')

  if (!authorized || !user || !profile || !supabase) {
    return {
      error: 'No autorizado',
      isOwner: false,
      course: null
    }
  }

  // Super admins bypass ownership check
  if (profile.role === 'super_admin') {
    const { data: course } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single()

    return {
      error: null,
      isOwner: true,
      course
    }
  }

  // Get course and verify ownership
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single()

  if (courseError || !course) {
    return {
      error: 'Curso no encontrado',
      isOwner: false,
      course: null
    }
  }

  const isOwner = course.created_by === user.id

  if (!isOwner) {
    return {
      error: 'No eres el propietario de este curso',
      isOwner: false,
      course
    }
  }

  return {
    error: null,
    isOwner: true,
    course
  }
}

/**
 * Get instructor's active subscription and plan details
 * Returns subscription, plan, and usage limits
 */
export async function getInstructorSubscription(userId: string) {
  const supabase = await createClient()

  const { data: subscription, error } = await supabase
    .from('instructor_subscriptions')
    .select(`
      *,
      subscription_plans (*)
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()

  if (error || !subscription) {
    return {
      error: 'No tienes una suscripción activa',
      subscription: null,
      plan: null
    }
  }

  return {
    error: null,
    subscription,
    plan: subscription.subscription_plans
  }
}

/**
 * Check if instructor can create more courses (plan limits)
 */
export async function canCreateCourse(userId: string) {
  const { subscription, plan, error } = await getInstructorSubscription(userId)

  if (error || !plan) {
    return {
      canCreate: false,
      error: error || 'No se pudo verificar el plan',
      currentCount: 0,
      limit: 0
    }
  }

  // Unlimited courses (NULL or 0)
  if (plan.max_courses === null || plan.max_courses === 0) {
    return {
      canCreate: true,
      error: null,
      currentCount: 0,
      limit: null
    }
  }

  // Count existing courses (excluding official courses)
  const supabase = await createClient()
  const { count, error: countError } = await supabase
    .from('courses')
    .select('id', { count: 'exact', head: true })
    .eq('created_by', userId)
    .eq('is_official', false) // Don't count official courses against limit

  if (countError) {
    return {
      canCreate: false,
      error: 'Error al verificar límite de cursos',
      currentCount: 0,
      limit: plan.max_courses
    }
  }

  const currentCount = count || 0
  const canCreate = currentCount < plan.max_courses

  return {
    canCreate,
    error: canCreate ? null : `Has alcanzado el límite de ${plan.max_courses} cursos de tu plan`,
    currentCount,
    limit: plan.max_courses
  }
}

/**
 * Require course access (ownership for instructors, any for admins)
 * Returns same interface as the old inline requireAdmin for easy migration.
 * Instructors can only access their own courses.
 * Admins and super_admins can access any course.
 */
export async function requireCourseAccess(courseId: string) {
  const auth = await requireInstructor()
  if (auth.error || !auth.supabase || !auth.user || !auth.profile) {
    return { error: auth.error || 'No autorizado', supabase: null as any, user: null as any }
  }

  // super_admin and admin can access any course
  if (['super_admin', 'admin'].includes(auth.profile.role)) {
    return { error: null, supabase: auth.supabase, user: auth.user }
  }

  // Instructor must own the course
  const { data: course } = await auth.supabase
    .from('courses')
    .select('created_by')
    .eq('id', courseId)
    .single()

  if (!course || course.created_by !== auth.user.id) {
    return { error: 'No eres el propietario de este curso', supabase: null as any, user: null as any }
  }

  return { error: null, supabase: auth.supabase, user: auth.user }
}

/**
 * Resolve module → course_id
 */
export async function getCourseIdFromModule(supabase: any, moduleId: string): Promise<string | null> {
  const { data } = await supabase
    .from('modules')
    .select('course_id')
    .eq('id', moduleId)
    .single()
  return data?.course_id || null
}

/**
 * Resolve lesson → module → course_id
 */
export async function getCourseIdFromLesson(supabase: any, lessonId: string): Promise<string | null> {
  const { data } = await supabase
    .from('lessons')
    .select('module_id, modules!inner(course_id)')
    .eq('id', lessonId)
    .single()
  return (data?.modules as any)?.course_id || null
}

/**
 * Check if instructor has enough AI credits
 */
export async function hasAICredits(userId: string, creditsNeeded: number) {
  const { subscription, plan, error } = await getInstructorSubscription(userId)

  if (error || !plan) {
    return {
      hasCredits: false,
      error: error || 'No se pudo verificar créditos IA',
      remaining: 0
    }
  }

  // Unlimited AI credits (0 means unlimited)
  if (plan.ai_generation_credits === 0) {
    return {
      hasCredits: true,
      error: null,
      remaining: Infinity
    }
  }

  // Calculate used credits this month
  const supabase = await createClient()
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: transactions } = await supabase
    .from('ai_credit_transactions')
    .select('credits_used')
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString())

  const usedCredits = transactions?.reduce((sum, t) => sum + t.credits_used, 0) || 0
  const remaining = plan.ai_generation_credits - usedCredits
  const hasCredits = remaining >= creditsNeeded

  return {
    hasCredits,
    error: hasCredits ? null : `No tienes suficientes créditos IA (necesitas ${creditsNeeded}, tienes ${remaining})`,
    remaining
  }
}

/**
 * Deduct AI credits from instructor's monthly quota
 */
export async function deductAICredits(
  userId: string,
  creditsUsed: number,
  actionType: string,
  resourceId?: string
) {
  const supabase = await createClient()

  // Get subscription
  const { subscription, error: subError } = await getInstructorSubscription(userId)

  if (subError || !subscription) {
    return { error: subError || 'No se pudo registrar uso de créditos' }
  }

  // Insert transaction
  const { error: insertError } = await supabase
    .from('ai_credit_transactions')
    .insert({
      user_id: userId,
      subscription_id: subscription.id,
      credits_used: creditsUsed,
      action_type: actionType,
      resource_id: resourceId
    })

  if (insertError) {
    return { error: 'Error al registrar uso de créditos IA' }
  }

  return { error: null }
}

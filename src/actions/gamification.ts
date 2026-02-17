'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type {
  XpSource,
  Badge,
  UserBadgeWithDetails,
  XpTransaction,
  LeaderboardEntry,
  Profile,
} from '@/types/database'

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
// XP: Otorgar puntos de experiencia
// ============================================

export async function awardXP(
  userId: string,
  amount: number,
  source: XpSource,
  description: string
): Promise<{
  error: string | null
  data: { new_xp: number; new_level: number } | null
}> {
  const { error: authError, supabase } = await requireAuth()
  if (authError || !supabase) {
    return { error: authError || 'No autenticado', data: null }
  }

  const { data, error } = await supabase.rpc('award_xp', {
    p_user_id: userId,
    p_amount: amount,
    p_source: source,
    p_description: description,
  })

  if (error) {
    console.error('Error awarding XP:', error)
    return { error: error.message, data: null }
  }

  revalidatePath('/dashboard')
  return { error: null, data: data as { new_xp: number; new_level: number } }
}

// ============================================
// XP: Historial de transacciones
// ============================================

export async function getXPHistory(
  userId?: string,
  limit: number = 50
): Promise<{
  error: string | null
  data: XpTransaction[] | null
}> {
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autenticado', data: null }
  }

  const targetUserId = userId || user.id

  const { data, error } = await supabase
    .from('xp_transactions')
    .select('*')
    .eq('user_id', targetUserId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    return { error: error.message, data: null }
  }

  return { error: null, data: data as XpTransaction[] }
}

// ============================================
// BADGES: Obtener todos los badges
// ============================================

export async function getAllBadges(): Promise<{
  error: string | null
  data: Badge[] | null
}> {
  const { error: authError, supabase } = await requireAuth()
  if (authError || !supabase) {
    return { error: authError || 'No autenticado', data: null }
  }

  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .order('requirement_value', { ascending: true })

  if (error) {
    return { error: error.message, data: null }
  }

  return { error: null, data: data as Badge[] }
}

// ============================================
// BADGES: Badges ganados por el usuario
// ============================================

export async function getUserBadges(userId?: string): Promise<{
  error: string | null
  data: UserBadgeWithDetails[] | null
}> {
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autenticado', data: null }
  }

  const targetUserId = userId || user.id

  const { data, error } = await supabase
    .from('user_badges')
    .select('*, badge:badges(*)')
    .eq('user_id', targetUserId)
    .order('earned_at', { ascending: false })

  if (error) {
    return { error: error.message, data: null }
  }

  return { error: null, data: data as UserBadgeWithDetails[] }
}

// ============================================
// BADGES: Verificar y otorgar badges
// ============================================

export async function checkAndAwardBadges(userId: string): Promise<{
  error: string | null
  data: string[]
}> {
  const { error: authError, supabase } = await requireAuth()
  if (authError || !supabase) {
    return { error: authError || 'No autenticado', data: [] }
  }

  // a. Obtener todos los badges y los ya ganados por el usuario
  const [allBadgesResult, userBadgesResult] = await Promise.all([
    supabase.from('badges').select('*').order('requirement_value', { ascending: true }),
    supabase.from('user_badges').select('badge_id').eq('user_id', userId),
  ])

  if (allBadgesResult.error) {
    return { error: allBadgesResult.error.message, data: [] }
  }

  const allBadges = allBadgesResult.data as Badge[]
  const earnedBadgeIds = new Set(
    (userBadgesResult.data || []).map((ub: { badge_id: string }) => ub.badge_id)
  )

  const unearnedBadges = allBadges.filter((b) => !earnedBadgeIds.has(b.id))

  if (unearnedBadges.length === 0) {
    return { error: null, data: [] }
  }

  // b. Obtener todos los conteos en paralelo
  const [
    lessonsResult,
    coursesResult,
    profileResult,
    postsResult,
    commentsResult,
  ] = await Promise.all([
    supabase
      .from('lesson_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase
      .from('course_enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .not('completed_at', 'is', null),
    supabase
      .from('profiles')
      .select('xp, streak_days')
      .eq('id', userId)
      .single(),
    supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId),
    supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId),
  ])

  const counts: Record<string, number> = {
    lessons_completed: lessonsResult.count || 0,
    courses_completed: coursesResult.count || 0,
    xp_earned: profileResult.data?.xp || 0,
    streak_days: profileResult.data?.streak_days || 0,
    posts_created: postsResult.count || 0,
    comments_created: commentsResult.count || 0,
  }

  // c. Verificar cada badge no ganado y otorgar si se cumple el requisito
  const newlyEarnedNames: string[] = []

  for (const badge of unearnedBadges) {
    const currentCount = counts[badge.requirement_type] ?? 0

    if (currentCount >= badge.requirement_value) {
      // Insertar user_badge
      const { error: insertError } = await supabase
        .from('user_badges')
        .insert({ user_id: userId, badge_id: badge.id })

      if (insertError) {
        console.error(`Error awarding badge ${badge.name}:`, insertError)
        continue
      }

      // Crear notificacion
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'badge',
          title: '¡Badge ganado!',
          message: `Ganaste el badge "${badge.name}"`,
          link: '/dashboard',
        })

      if (notifError) {
        console.error(`Error creating notification for badge ${badge.name}:`, notifError)
      }

      newlyEarnedNames.push(badge.name)
    }
  }

  if (newlyEarnedNames.length > 0) {
    revalidatePath('/dashboard')
  }

  // d. Retornar nombres de badges recien ganados
  return { error: null, data: newlyEarnedNames }
}

// ============================================
// LEADERBOARD: Tabla de posiciones
// ============================================

export async function getLeaderboard(
  period: 'weekly' | 'monthly' | 'all'
): Promise<{
  error: string | null
  data: LeaderboardEntry[] | null
}> {
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autenticado', data: null }
  }

  let topProfiles: Array<Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'xp' | 'level'>> = []

  if (period === 'all') {
    // Top 20 por XP total del perfil
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, xp, level')
      .order('xp', { ascending: false })
      .limit(20)

    if (error) {
      return { error: error.message, data: null }
    }

    topProfiles = profiles as Array<Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'xp' | 'level'>>
  } else {
    // Calcular fecha de inicio del periodo
    const now = new Date()
    const startDate = new Date(now)

    if (period === 'weekly') {
      startDate.setDate(now.getDate() - 7)
    } else {
      startDate.setMonth(now.getMonth() - 1)
    }

    // Obtener transacciones del periodo
    const { data: transactions, error } = await supabase
      .from('xp_transactions')
      .select('user_id, amount')
      .gte('created_at', startDate.toISOString())

    if (error) {
      return { error: error.message, data: null }
    }

    // Agrupar XP por usuario en JS
    const xpByUser = new Map<string, number>()
    for (const tx of transactions || []) {
      xpByUser.set(tx.user_id, (xpByUser.get(tx.user_id) || 0) + tx.amount)
    }

    // Ordenar y tomar top 20
    const sortedUserIds = Array.from(xpByUser.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([uid]) => uid)

    if (sortedUserIds.length === 0) {
      return { error: null, data: [] }
    }

    // Obtener perfiles de los top usuarios
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, xp, level')
      .in('id', sortedUserIds)

    if (profilesError) {
      return { error: profilesError.message, data: null }
    }

    // Reordenar perfiles segun el ranking del periodo
    const profilesMap = new Map(
      (profiles || []).map((p: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'xp' | 'level'>) => [p.id, p])
    )

    topProfiles = sortedUserIds
      .map((uid) => profilesMap.get(uid))
      .filter((p): p is Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'xp' | 'level'> => !!p)

    // Sobreescribir xp con el xp del periodo
    topProfiles = topProfiles.map((p) => ({
      ...p,
      xp: xpByUser.get(p.id) || 0,
    }))
  }

  if (topProfiles.length === 0) {
    return { error: null, data: [] }
  }

  // Obtener conteo de badges por usuario
  const userIds = topProfiles.map((p) => p.id)
  const { data: userBadges } = await supabase
    .from('user_badges')
    .select('user_id')
    .in('user_id', userIds)

  const badgesCountByUser = new Map<string, number>()
  for (const ub of userBadges || []) {
    badgesCountByUser.set(ub.user_id, (badgesCountByUser.get(ub.user_id) || 0) + 1)
  }

  // Construir leaderboard con posicion y flag de usuario actual
  const leaderboard: LeaderboardEntry[] = topProfiles.map((profile, index) => ({
    position: index + 1,
    profile,
    badges_count: badgesCountByUser.get(profile.id) || 0,
    is_current_user: profile.id === user.id,
  }))

  return { error: null, data: leaderboard }
}

// ============================================
// STATS: Estadisticas completas del usuario
// ============================================

interface UserStats {
  xp: number
  level: number
  streak_days: number
  lessons_completed: number
  courses_completed: number
  posts_count: number
  comments_count: number
  badges_count: number
  xp_to_next_level: number
}

export async function getUserStats(userId?: string): Promise<{
  error: string | null
  data: UserStats | null
}> {
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autenticado', data: null }
  }

  const targetUserId = userId || user.id

  // Obtener todos los datos en paralelo
  const [
    profileResult,
    lessonsResult,
    coursesResult,
    postsResult,
    commentsResult,
    badgesResult,
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('xp, level, streak_days')
      .eq('id', targetUserId)
      .single(),
    supabase
      .from('lesson_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', targetUserId),
    supabase
      .from('course_enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', targetUserId)
      .not('completed_at', 'is', null),
    supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', targetUserId),
    supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', targetUserId),
    supabase
      .from('user_badges')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', targetUserId),
  ])

  if (profileResult.error) {
    return { error: profileResult.error.message, data: null }
  }

  const profile = profileResult.data
  const currentXp = profile?.xp || 0
  const currentLevel = profile?.level || 1

  // Calcular XP necesario para el siguiente nivel
  // Formula: triangular: nivel N requiere N*(N+1)*50 XP acumulado
  const xpForNextLevel = currentLevel * (currentLevel + 1) * 50
  const xpToNextLevel = Math.max(0, xpForNextLevel - currentXp)

  const stats: UserStats = {
    xp: currentXp,
    level: currentLevel,
    streak_days: profile?.streak_days || 0,
    lessons_completed: lessonsResult.count || 0,
    courses_completed: coursesResult.count || 0,
    posts_count: postsResult.count || 0,
    comments_count: commentsResult.count || 0,
    badges_count: badgesResult.count || 0,
    xp_to_next_level: xpToNextLevel,
  }

  return { error: null, data: stats }
}

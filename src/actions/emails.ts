'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/resend'
import { WelcomeEmail } from '@/lib/email/templates/WelcomeEmail'
import { CourseEnrollmentEmail } from '@/lib/email/templates/CourseEnrollmentEmail'
import { CourseCompletedEmail } from '@/lib/email/templates/CourseCompletedEmail'
import { BadgeEarnedEmail } from '@/lib/email/templates/BadgeEarnedEmail'
import type { EmailPreferences } from '@/types/database'

// ============================================
// Email Preference Check
// ============================================

type PreferenceKey = 'welcome' | 'enrollment' | 'completion' | 'badges' | 'weekly_digest' | 'marketing'

async function checkEmailPreference(userId: string, key: PreferenceKey): Promise<boolean> {
  try {
    const service = createServiceClient()
    const { data } = await service
      .from('email_preferences')
      .select(key)
      .eq('user_id', userId)
      .single()

    if (!data) return true // Default: send if no preferences found
    return (data as Record<string, boolean>)[key] !== false
  } catch {
    return true // Default: send on error
  }
}

// ============================================
// Send Welcome Email
// ============================================

export async function sendWelcomeEmail(email: string, fullName: string): Promise<void> {
  // Welcome email doesn't check preferences because the profile/preferences may not exist yet
  // (trigger creates them async)
  const userName = fullName.split(' ')[0] || fullName

  await sendEmail({
    to: email,
    subject: `Bienvenido a ZoneKlass, ${userName}!`,
    react: WelcomeEmail({ userName }),
  })
}

// ============================================
// Send Enrollment Email
// ============================================

export async function sendEnrollmentEmail(userId: string, courseId: string): Promise<void> {
  const allowed = await checkEmailPreference(userId, 'enrollment')
  if (!allowed) return

  const service = createServiceClient()

  const [profileRes, courseRes] = await Promise.all([
    service.from('profiles').select('email, full_name').eq('id', userId).single(),
    service.from('courses').select('title, slug').eq('id', courseId).single(),
  ])

  if (!profileRes.data || !courseRes.data) return

  const userName = profileRes.data.full_name?.split(' ')[0] || 'Estudiante'

  await sendEmail({
    to: profileRes.data.email,
    subject: `Te inscribiste en ${courseRes.data.title}`,
    react: CourseEnrollmentEmail({
      userName,
      courseTitle: courseRes.data.title,
      courseSlug: courseRes.data.slug,
    }),
  })
}

// ============================================
// Send Course Completion Email
// ============================================

export async function sendCompletionEmail(userId: string, courseId: string): Promise<void> {
  const allowed = await checkEmailPreference(userId, 'completion')
  if (!allowed) return

  const service = createServiceClient()

  const [profileRes, courseRes, lessonsRes] = await Promise.all([
    service.from('profiles').select('email, full_name').eq('id', userId).single(),
    service.from('courses').select('title').eq('id', courseId).single(),
    service.from('lesson_progress').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('course_id', courseId),
  ])

  if (!profileRes.data || !courseRes.data) return

  const userName = profileRes.data.full_name?.split(' ')[0] || 'Estudiante'
  // 10 XP per lesson + 100 bonus for course completion
  const lessonsCompleted = lessonsRes.count || 0
  const xpEarned = (lessonsCompleted * 10) + 100

  await sendEmail({
    to: profileRes.data.email,
    subject: `Felicidades! Completaste ${courseRes.data.title}`,
    react: CourseCompletedEmail({
      userName,
      courseTitle: courseRes.data.title,
      lessonsCompleted,
      xpEarned,
    }),
  })
}

// ============================================
// Send Badge Earned Email
// ============================================

export async function sendBadgeEmail(userId: string, badgeId: string): Promise<void> {
  const allowed = await checkEmailPreference(userId, 'badges')
  if (!allowed) return

  const service = createServiceClient()

  const [profileRes, badgeRes] = await Promise.all([
    service.from('profiles').select('email, full_name').eq('id', userId).single(),
    service.from('badges').select('name, description').eq('id', badgeId).single(),
  ])

  if (!profileRes.data || !badgeRes.data) return

  const userName = profileRes.data.full_name?.split(' ')[0] || 'Estudiante'

  await sendEmail({
    to: profileRes.data.email,
    subject: `Ganaste el badge ${badgeRes.data.name}!`,
    react: BadgeEarnedEmail({
      userName,
      badgeName: badgeRes.data.name,
      badgeDescription: badgeRes.data.description,
    }),
  })
}

// ============================================
// Email Preferences CRUD
// ============================================

export async function getEmailPreferences(): Promise<{
  data: EmailPreferences | null
  error: string | null
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'No autenticado' }

  const { data, error } = await supabase
    .from('email_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    // If no preferences exist yet, return defaults
    if (error.code === 'PGRST116') {
      return {
        data: {
          id: '',
          user_id: user.id,
          welcome: true,
          enrollment: true,
          completion: true,
          badges: true,
          weekly_digest: true,
          marketing: false,
          created_at: '',
          updated_at: '',
        },
        error: null,
      }
    }
    return { data: null, error: error.message }
  }

  return { data: data as EmailPreferences, error: null }
}

export async function updateEmailPreferences(prefs: {
  welcome?: boolean
  enrollment?: boolean
  completion?: boolean
  badges?: boolean
  weekly_digest?: boolean
  marketing?: boolean
}): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  // Try update first
  const { error: updateError, count } = await supabase
    .from('email_preferences')
    .update({ ...prefs, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)

  // If no row existed, insert
  if (count === 0) {
    const { error: insertError } = await supabase
      .from('email_preferences')
      .insert({
        user_id: user.id,
        ...prefs,
      })

    if (insertError) return { error: insertError.message }
  } else if (updateError) {
    return { error: updateError.message }
  }

  revalidatePath('/settings')
  return { error: null }
}

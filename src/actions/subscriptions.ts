'use server'

import { createClient } from '@/lib/supabase/server'
import { requireInstructor } from '@/lib/auth/permissions'
import { redirect } from 'next/navigation'

export interface SubscriptionPlan {
  id: string
  name: string
  name_en: string
  description: string | null
  description_en: string | null
  price_monthly: number
  price_yearly: number
  max_courses: number | null
  max_students_per_course: number | null
  ai_generation_credits: number
  can_sell_courses: boolean
  features: string[] | null
}

/**
 * Get all active subscription plans
 */
export async function getSubscriptionPlans() {
  const supabase = await createClient()

  const { data: plans, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .order('price_monthly', { ascending: true })

  if (error) {
    console.error('Error fetching plans:', error)
    return { error: error.message, plans: null }
  }

  return { error: null, plans: plans as SubscriptionPlan[] }
}

/**
 * Create a free subscription for instructor
 * (automatically assigns Free plan)
 */
export async function createFreeSubscription() {
  const { error, user, profile, supabase } = await requireInstructor()

  if (error || !user || !profile || !supabase) {
    return { error: error || 'No autorizado' }
  }

  // Check if already has subscription
  const { data: existing } = await supabase
    .from('instructor_subscriptions')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (existing) {
    return { error: 'Ya tienes una suscripción activa' }
  }

  // Get Free plan
  const { data: freePlan } = await supabase
    .from('subscription_plans')
    .select('id')
    .eq('price_monthly', 0)
    .eq('is_active', true)
    .single()

  if (!freePlan) {
    return { error: 'Plan Free no encontrado' }
  }

  // Create subscription
  const { error: insertError } = await supabase
    .from('instructor_subscriptions')
    .insert({
      user_id: user.id,
      plan_id: freePlan.id,
      status: 'active',
      billing_cycle: 'monthly',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now (free plan)
    })

  if (insertError) {
    console.error('Error creating free subscription:', insertError)
    return { error: 'Error al crear suscripción gratuita' }
  }

  return { error: null }
}

/**
 * Create Stripe Checkout Session for paid plan
 */
export async function createStripeCheckoutSession(
  planId: string,
  billingCycle: 'monthly' | 'yearly'
) {
  const { error, user, profile, supabase } = await requireInstructor()

  if (error || !user || !profile || !supabase) {
    return { error: error || 'No autorizado', url: null }
  }

  // Get plan details
  const { data: plan, error: planError } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('id', planId)
    .single()

  if (planError || !plan) {
    return { error: 'Plan no encontrado', url: null }
  }

  // Check if plan is free (shouldn't use Stripe for free plans)
  if (plan.price_monthly === 0 && plan.price_yearly === 0) {
    return { error: 'Use createFreeSubscription() para plan gratuito', url: null }
  }

  // TODO: Implement Stripe Checkout Session creation
  // For now, return placeholder
  // This will be implemented when Stripe is configured

  return {
    error: 'Stripe no configurado aún. Use plan Free por ahora.',
    url: null,
  }
}

/**
 * Update instructor profile (bio, website, social links)
 */
export async function updateInstructorProfile(formData: FormData) {
  const { error, user, supabase } = await requireInstructor()

  if (error || !user || !supabase) {
    return { error: error || 'No autorizado' }
  }

  const bio = formData.get('bio') as string
  const bio_en = formData.get('bio_en') as string
  const website_url = formData.get('website_url') as string
  const twitter = formData.get('twitter') as string
  const linkedin = formData.get('linkedin') as string
  const youtube = formData.get('youtube') as string

  const social_links = {
    twitter: twitter || null,
    linkedin: linkedin || null,
    youtube: youtube || null,
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      bio: bio || null,
      bio_en: bio_en || null,
      website_url: website_url || null,
      social_links,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (updateError) {
    console.error('Error updating instructor profile:', updateError)
    return { error: 'Error al actualizar perfil' }
  }

  return { error: null }
}

/**
 * Complete onboarding and redirect to instructor dashboard
 */
export async function completeOnboarding() {
  const { error } = await requireInstructor()

  if (error) {
    return { error }
  }

  // Redirect to instructor dashboard
  redirect('/instructor/dashboard')
}

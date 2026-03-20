'use server'

import { createClient } from '@/lib/supabase/server'
import {
  hasAICredits,
  deductAICredits,
  getInstructorSubscription,
} from '@/lib/auth/permissions'
import { AI_CREDIT_COSTS, type AIActionType } from '@/lib/ai/constants'

// ============================================
// Server Actions
// ============================================

/**
 * Check if instructor has enough AI credits
 * @param userId - Instructor's user ID
 * @param creditsNeeded - Number of credits needed
 * @returns { hasCredits: boolean, remaining: number, error: string | null }
 */
export async function checkAICredits(userId: string, creditsNeeded: number) {
  // Validate input
  if (!userId) {
    return {
      hasCredits: false,
      remaining: 0,
      error: 'ID de usuario requerido',
    }
  }

  if (creditsNeeded < 0) {
    return {
      hasCredits: false,
      remaining: 0,
      error: 'Cantidad de créditos inválida',
    }
  }

  // Check credits using existing function
  const result = await hasAICredits(userId, creditsNeeded)

  return {
    hasCredits: result.hasCredits,
    remaining: result.remaining === Infinity ? -1 : result.remaining, // -1 means unlimited
    error: result.error,
  }
}

/**
 * Deduct AI credits and record transaction
 * @param userId - Instructor's user ID
 * @param amount - Number of credits to deduct
 * @param actionType - Type of AI action performed
 * @param resourceId - Optional ID of the resource created (course_id, lesson_id, etc)
 * @returns { error: string | null }
 */
export async function useAICredits(
  userId: string,
  amount: number,
  actionType: AIActionType,
  resourceId?: string
) {
  // 1. Validate input
  if (!userId) {
    return { error: 'ID de usuario requerido' }
  }

  if (amount <= 0) {
    return { error: 'Cantidad de créditos inválida' }
  }

  if (!Object.keys(AI_CREDIT_COSTS).includes(actionType)) {
    return { error: 'Tipo de acción inválida' }
  }

  // 2. Check if user has enough credits
  const creditCheck = await hasAICredits(userId, amount)

  if (!creditCheck.hasCredits) {
    return {
      error:
        creditCheck.error ||
        `No tienes suficientes créditos IA (necesitas ${amount}, tienes ${creditCheck.remaining})`,
    }
  }

  // 3. Deduct credits and record transaction
  const deductResult = await deductAICredits(
    userId,
    amount,
    actionType,
    resourceId
  )

  if (deductResult.error) {
    return { error: deductResult.error }
  }

  return { error: null }
}

/**
 * Get AI credit balance for the current month
 * @param userId - Instructor's user ID
 * @returns { used: number, limit: number, remaining: number, isUnlimited: boolean, error: string | null }
 */
export async function getAICreditBalance(userId: string) {
  // 1. Validate input
  if (!userId) {
    return {
      used: 0,
      limit: 0,
      remaining: 0,
      isUnlimited: false,
      error: 'ID de usuario requerido',
    }
  }

  // 2. Get subscription and plan
  const { subscription, plan, error } = await getInstructorSubscription(userId)

  if (error || !plan) {
    return {
      used: 0,
      limit: 0,
      remaining: 0,
      isUnlimited: false,
      error: error || 'No se pudo obtener información de suscripción',
    }
  }

  // 3. Check if unlimited
  const isUnlimited = plan.ai_generation_credits === 0

  if (isUnlimited) {
    return {
      used: 0,
      limit: 0,
      remaining: -1, // -1 means unlimited
      isUnlimited: true,
      error: null,
    }
  }

  // 4. Calculate used credits this month
  const supabase = await createClient()
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: transactions, error: txError } = await supabase
    .from('ai_credit_transactions')
    .select('credits_used')
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString())

  if (txError) {
    return {
      used: 0,
      limit: plan.ai_generation_credits,
      remaining: plan.ai_generation_credits,
      isUnlimited: false,
      error: 'Error al calcular uso de créditos',
    }
  }

  const usedCredits =
    transactions?.reduce((sum, t) => sum + t.credits_used, 0) || 0
  const remaining = Math.max(0, plan.ai_generation_credits - usedCredits)

  return {
    used: usedCredits,
    limit: plan.ai_generation_credits,
    remaining,
    isUnlimited: false,
    error: null,
  }
}

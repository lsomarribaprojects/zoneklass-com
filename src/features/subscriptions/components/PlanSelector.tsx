'use client'

import { useState } from 'react'
import { useLocale } from '@/features/i18n'

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

interface PlanSelectorProps {
  plans: SubscriptionPlan[]
  onSelectPlan: (planId: string, billingCycle: 'monthly' | 'yearly') => void
  loading?: boolean
}

export function PlanSelector({ plans, onSelectPlan, loading = false }: PlanSelectorProps) {
  const { t, locale } = useLocale()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const getPrice = (plan: SubscriptionPlan) => {
    return billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly
  }

  const getMonthlyPrice = (plan: SubscriptionPlan) => {
    if (billingCycle === 'yearly') {
      return (plan.price_yearly / 12).toFixed(2)
    }
    return plan.price_monthly.toFixed(2)
  }

  const getPlanName = (plan: SubscriptionPlan) => {
    return locale === 'en' ? plan.name_en : plan.name
  }

  const getPlanDescription = (plan: SubscriptionPlan) => {
    return locale === 'en' ? plan.description_en : plan.description
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Billing Cycle Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-foreground shadow-sm'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all relative ${
              billingCycle === 'yearly'
                ? 'bg-white text-foreground shadow-sm'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          const price = getPrice(plan)
          const monthlyPrice = getMonthlyPrice(plan)
          const isFree = price === 0
          const isPro = index === 1
          const features = (plan.features as string[]) || []

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col p-6 rounded-2xl border-2 transition-all ${
                isPro
                  ? 'border-primary-500 bg-primary-50 shadow-lg scale-105'
                  : 'border-border bg-white hover:border-primary-500'
              }`}
            >
              {/* Recommended Badge */}
              {isPro && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-xl font-bold text-foreground mb-2">
                {getPlanName(plan)}
              </h3>

              {/* Plan Description */}
              <p className="text-sm text-foreground-muted mb-6">
                {getPlanDescription(plan)}
              </p>

              {/* Price */}
              <div className="mb-6">
                {isFree ? (
                  <div className="text-4xl font-bold text-foreground">Free</div>
                ) : (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">
                        ${monthlyPrice}
                      </span>
                      <span className="text-foreground-muted">/month</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-sm text-foreground-muted mt-1">
                        ${price.toFixed(2)} billed annually
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => onSelectPlan(plan.id, billingCycle)}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isPro
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-white text-foreground border-2 border-border hover:border-primary-500'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </span>
                ) : (
                  isFree ? 'Start Free' : 'Get Started'
                )}
              </button>

              {/* Features List */}
              <ul className="mt-6 space-y-3">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" opacity="0.2" />
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                    <span className="text-sm text-foreground-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Bottom Note */}
      <p className="text-center text-sm text-foreground-muted mt-8">
        All plans include 14-day free trial • Cancel anytime • No hidden fees
      </p>
    </div>
  )
}

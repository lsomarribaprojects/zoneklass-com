'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlanSelector, type SubscriptionPlan } from '@/features/subscriptions/components'
import {
  getSubscriptionPlans,
  createFreeSubscription,
  createStripeCheckoutSession,
  updateInstructorProfile,
  completeOnboarding,
} from '@/actions/subscriptions'

type OnboardingStep = 'welcome' | 'plan' | 'checkout' | 'profile' | 'tutorial'

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome')
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch plans on mount
  useEffect(() => {
    async function loadPlans() {
      const { plans: fetchedPlans, error: plansError } = await getSubscriptionPlans()
      if (plansError) {
        setError(plansError)
        return
      }
      if (fetchedPlans) {
        setPlans(fetchedPlans)
      }
    }
    loadPlans()
  }, [])

  const handlePlanSelection = async (planId: string, billingCycle: 'monthly' | 'yearly') => {
    setLoading(true)
    setError(null)
    setSelectedPlan(planId)
    setSelectedBillingCycle(billingCycle)

    const plan = plans.find((p) => p.id === planId)
    if (!plan) {
      setError('Plan no encontrado')
      setLoading(false)
      return
    }

    // If Free plan, create subscription immediately and go to profile step
    if (plan.price_monthly === 0 && plan.price_yearly === 0) {
      const { error: subscriptionError } = await createFreeSubscription()
      if (subscriptionError) {
        setError(subscriptionError)
        setLoading(false)
        return
      }
      setLoading(false)
      setCurrentStep('profile')
      return
    }

    // If paid plan, redirect to Stripe Checkout
    const { url, error: checkoutError } = await createStripeCheckoutSession(planId, billingCycle)
    if (checkoutError) {
      setError(checkoutError)
      setLoading(false)
      return
    }

    if (url) {
      window.location.href = url
    } else {
      setError('Error creating checkout session')
      setLoading(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const { error: profileError } = await updateInstructorProfile(formData)

    if (profileError) {
      setError(profileError)
      setLoading(false)
      return
    }

    setLoading(false)
    setCurrentStep('tutorial')
  }

  const handleCompleteOnboarding = async () => {
    setLoading(true)
    const { error: completeError } = await completeOnboarding()

    if (completeError) {
      setError(completeError)
      setLoading(false)
      return
    }

    // Redirect happens in server action
  }

  const getStepNumber = () => {
    const stepNumbers: Record<OnboardingStep, number> = {
      welcome: 1,
      plan: 2,
      checkout: 3,
      profile: 4,
      tutorial: 5,
    }
    return stepNumbers[currentStep]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {['welcome', 'plan', 'profile', 'tutorial'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    getStepNumber() > index + 1
                      ? 'bg-primary-500 text-white'
                      : getStepNumber() === index + 1
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                {index < 3 && (
                  <div
                    className={`w-20 h-1 ${
                      getStepNumber() > index + 1 ? 'bg-primary-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-error-50 border border-error-500/20 rounded-xl">
            <p className="text-sm text-error-700">{error}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: Welcome */}
          {currentStep === 'welcome' && (
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl gradient-primary mb-6">
                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                ¡Bienvenido a ZoneKlass! 🎉
              </h1>
              <p className="text-lg text-foreground-secondary mb-8">
                Estás a pocos pasos de crear y vender tus propios cursos online con la ayuda de IA.
              </p>
              <button
                onClick={() => setCurrentStep('plan')}
                className="px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors"
              >
                Comenzar
              </button>
            </div>
          )}

          {/* Step 2: Plan Selection */}
          {currentStep === 'plan' && (
            <div>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-foreground mb-3">
                  Elige tu Plan
                </h2>
                <p className="text-foreground-secondary">
                  Selecciona el plan que mejor se adapte a tus necesidades
                </p>
              </div>
              <PlanSelector
                plans={plans}
                onSelectPlan={handlePlanSelection}
                loading={loading}
              />
            </div>
          )}

          {/* Step 4: Profile Setup */}
          {currentStep === 'profile' && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-3">
                  Configura tu Perfil de Instructor
                </h2>
                <p className="text-foreground-secondary">
                  Cuéntanos más sobre ti para que tus estudiantes te conozcan mejor
                </p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Bio (Spanish) */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-2">
                    Biografía (Español)
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    placeholder="Cuéntanos sobre tu experiencia y por qué eres el instructor ideal..."
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>

                {/* Bio (English) */}
                <div>
                  <label htmlFor="bio_en" className="block text-sm font-medium text-foreground mb-2">
                    Bio (English) - Optional
                  </label>
                  <textarea
                    id="bio_en"
                    name="bio_en"
                    rows={4}
                    placeholder="Tell us about your experience and why you're the ideal instructor..."
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>

                {/* Website URL */}
                <div>
                  <label htmlFor="website_url" className="block text-sm font-medium text-foreground mb-2">
                    Sitio Web
                  </label>
                  <input
                    id="website_url"
                    name="website_url"
                    type="url"
                    placeholder="https://tuportfolio.com"
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Social Links */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="twitter" className="block text-sm font-medium text-foreground mb-2">
                      Twitter
                    </label>
                    <input
                      id="twitter"
                      name="twitter"
                      type="text"
                      placeholder="@usuario"
                      className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-foreground mb-2">
                      LinkedIn
                    </label>
                    <input
                      id="linkedin"
                      name="linkedin"
                      type="text"
                      placeholder="linkedin.com/in/usuario"
                      className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="youtube" className="block text-sm font-medium text-foreground mb-2">
                      YouTube
                    </label>
                    <input
                      id="youtube"
                      name="youtube"
                      type="text"
                      placeholder="@canal"
                      className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('plan')}
                    disabled={loading}
                    className="px-6 py-3 border-2 border-border text-foreground font-semibold rounded-xl hover:border-primary-500 transition-colors disabled:opacity-50"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Guardando...
                      </>
                    ) : (
                      'Continuar'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 5: Tutorial */}
          {currentStep === 'tutorial' && (
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary-100 mb-6">
                <svg className="w-10 h-10 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                ¡Todo listo! 🚀
              </h2>
              <p className="text-lg text-foreground-secondary mb-8">
                Tu perfil de instructor está configurado. Ahora puedes empezar a crear tu primer curso con la ayuda de nuestra IA.
              </p>

              {/* Quick Tips */}
              <div className="bg-gray-50 rounded-xl p-6 text-left mb-8">
                <h3 className="font-semibold text-foreground mb-4">Próximos pasos:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" opacity="0.2" />
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                    <span className="text-sm text-foreground-secondary">
                      <strong>Crea tu primer curso:</strong> Usa el wizard de IA para generar el contenido automáticamente
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" opacity="0.2" />
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                    <span className="text-sm text-foreground-secondary">
                      <strong>Personaliza tu contenido:</strong> Edita y refina las lecciones generadas
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" opacity="0.2" />
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                    <span className="text-sm text-foreground-secondary">
                      <strong>Publica en el marketplace:</strong> Comparte tu curso y empieza a ganar dinero
                    </span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleCompleteOnboarding}
                disabled={loading}
                className="px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Redirigiendo...
                  </>
                ) : (
                  <>
                    Ir al Dashboard
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

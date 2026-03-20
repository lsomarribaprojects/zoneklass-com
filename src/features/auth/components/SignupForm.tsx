'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup, loginWithGoogle } from '@/actions/auth'
import { useLocale } from '@/features/i18n'

export function SignupForm() {
  const { t } = useLocale()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'estudiante' | 'instructor'>('estudiante')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const fullName = formData.get('full_name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!fullName || !email || !password) {
      setError(t.auth.allFieldsRequired)
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError(t.auth.passwordMinLength)
      setLoading(false)
      return
    }

    const result = await signup(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary mb-4">
          <span className="text-white font-bold text-xl">ZK</span>
        </div>
        <h1 className="text-display-xs text-foreground font-heading">{t.auth.createYourAccount}</h1>
        <p className="text-foreground-secondary mt-1">{t.auth.joinAndLearn}</p>
      </div>

      {/* Google OAuth */}
      <form action={loginWithGoogle}>
        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-white text-foreground font-medium rounded-xl border border-border hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {t.auth.signUpWithGoogle}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-gradient-to-br from-primary-50 via-white to-primary-50 text-foreground-muted">{t.auth.or}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            {t.auth.iAmA}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Student Option */}
            <label
              className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedRole === 'estudiante'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-border bg-white hover:border-border-dark'
              }`}
            >
              <input
                type="radio"
                name="role"
                value="estudiante"
                checked={selectedRole === 'estudiante'}
                onChange={(e) => setSelectedRole(e.target.value as 'estudiante' | 'instructor')}
                className="sr-only"
              />
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
                <span className="font-semibold text-foreground">{t.auth.student}</span>
              </div>
              <p className="text-xs text-foreground-muted">{t.auth.studentDescription}</p>
              {selectedRole === 'estudiante' && (
                <div className="absolute top-3 right-3">
                  <svg className="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
              )}
            </label>

            {/* Instructor Option */}
            <label
              className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedRole === 'instructor'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-border bg-white hover:border-border-dark'
              }`}
            >
              <input
                type="radio"
                name="role"
                value="instructor"
                checked={selectedRole === 'instructor'}
                onChange={(e) => setSelectedRole(e.target.value as 'estudiante' | 'instructor')}
                className="sr-only"
              />
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-semibold text-foreground">{t.auth.instructor}</span>
              </div>
              <p className="text-xs text-foreground-muted">{t.auth.instructorDescription}</p>
              {selectedRole === 'instructor' && (
                <div className="absolute top-3 right-3">
                  <svg className="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-foreground mb-1.5">
            {t.auth.fullName}
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            placeholder={t.auth.fullNamePlaceholder}
            required
            className="w-full px-4 py-2.5 bg-white text-foreground border border-border rounded-xl placeholder:text-foreground-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-border-dark"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
            {t.auth.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder={t.auth.emailPlaceholder}
            required
            className="w-full px-4 py-2.5 bg-white text-foreground border border-border rounded-xl placeholder:text-foreground-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-border-dark"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
            {t.auth.password}
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder={t.auth.minChars}
              required
              minLength={6}
              className="w-full px-4 py-2.5 pr-12 bg-white text-foreground border border-border rounded-xl placeholder:text-foreground-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-border-dark"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground-secondary transition-colors"
              aria-label={showPassword ? t.auth.hidePassword : t.auth.showPassword}
            >
              {showPassword ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          <p className="mt-1.5 text-sm text-foreground-muted">{t.auth.minChars}</p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-error-50 border border-error-500/20 p-3">
            <p className="text-sm text-error-700">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 text-white font-medium rounded-xl gradient-primary hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            t.auth.createAccount
          )}
        </button>

        {/* Links */}
        <p className="text-center text-sm text-foreground-secondary">
          {t.auth.hasAccount}{' '}
          <Link href="/login" className="text-primary-500 hover:text-primary-700 font-medium hover:underline">
            {t.auth.signIn}
          </Link>
        </p>
      </form>
    </div>
  )
}

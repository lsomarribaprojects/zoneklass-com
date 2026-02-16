'use client'

import { useState } from 'react'
import Link from 'next/link'
import { resetPassword } from '@/actions/auth'

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await resetPassword(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
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
        <h1 className="text-display-xs text-foreground font-heading">Recuperar contrasena</h1>
        <p className="text-foreground-secondary mt-1">Te enviaremos un enlace para restablecerla</p>
      </div>

      {success ? (
        <div className="rounded-xl bg-success-50 border border-success-500/20 p-6 text-center">
          <div className="mb-3">
            <svg className="w-12 h-12 mx-auto text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-success-700 font-medium">Revisa tu correo electronico</p>
          <p className="text-success-600 text-sm mt-1">Te hemos enviado un enlace para restablecer tu contrasena.</p>
          <Link href="/login" className="inline-block mt-4 text-sm text-primary-500 hover:text-primary-700 hover:underline">
            Volver al login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
              Correo electronico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
              className="w-full px-4 py-2.5 bg-white text-foreground border border-border rounded-xl placeholder:text-foreground-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-border-dark"
            />
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
              'Enviar Enlace'
            )}
          </button>

          {/* Back to login */}
          <p className="text-center text-sm text-foreground-secondary">
            <Link href="/login" className="text-primary-500 hover:text-primary-700 hover:underline">
              Volver al login
            </Link>
          </p>
        </form>
      )}
    </div>
  )
}

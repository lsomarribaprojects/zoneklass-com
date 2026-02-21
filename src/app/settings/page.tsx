'use client'

import { useState, useEffect } from 'react'
import { Mail, Bell, BellOff, Save, Check, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@/hooks/useUser'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateProfile } from '@/actions/auth'
import { getEmailPreferences, updateEmailPreferences } from '@/actions/emails'
import type { EmailPreferences } from '@/types/database'

const EMAIL_PREF_ITEMS: Array<{
  key: keyof Pick<EmailPreferences, 'welcome' | 'enrollment' | 'completion' | 'badges' | 'weekly_digest' | 'marketing'>
  label: string
  description: string
}> = [
  { key: 'welcome', label: 'Bienvenida', description: 'Email de bienvenida al registrarte' },
  { key: 'enrollment', label: 'Inscripciones', description: 'Confirmacion al inscribirte en un curso' },
  { key: 'completion', label: 'Cursos completados', description: 'Felicitacion al completar un curso' },
  { key: 'badges', label: 'Badges', description: 'Notificacion al ganar un nuevo badge' },
  { key: 'weekly_digest', label: 'Resumen semanal', description: 'Tu progreso y estadisticas de la semana' },
  { key: 'marketing', label: 'Novedades', description: 'Nuevos cursos, features y promociones' },
]

function Toggle({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
        checked ? 'bg-primary-500' : 'bg-gray-300 dark:bg-slate-600'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export default function SettingsPage() {
  const { profile, loading: userLoading } = useUser()
  const [fullName, setFullName] = useState('')
  const [prefs, setPrefs] = useState<EmailPreferences | null>(null)
  const [prefsLoading, setPrefsLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPrefs, setSavingPrefs] = useState(false)
  const [profileFeedback, setProfileFeedback] = useState<string | null>(null)
  const [prefsFeedback, setPrefsFeedback] = useState<string | null>(null)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
    }
  }, [profile])

  useEffect(() => {
    getEmailPreferences().then(({ data }) => {
      if (data) setPrefs(data)
      setPrefsLoading(false)
    })
  }, [])

  async function handleSaveProfile() {
    setSavingProfile(true)
    setProfileFeedback(null)
    const formData = new FormData()
    formData.append('full_name', fullName)
    const result = await updateProfile(formData)
    if (result?.error) {
      setProfileFeedback(result.error)
    } else {
      setProfileFeedback('Perfil actualizado')
      setTimeout(() => setProfileFeedback(null), 3000)
    }
    setSavingProfile(false)
  }

  async function handleSavePrefs() {
    if (!prefs) return
    setSavingPrefs(true)
    setPrefsFeedback(null)
    const { error } = await updateEmailPreferences({
      welcome: prefs.welcome,
      enrollment: prefs.enrollment,
      completion: prefs.completion,
      badges: prefs.badges,
      weekly_digest: prefs.weekly_digest,
      marketing: prefs.marketing,
    })
    if (error) {
      setPrefsFeedback(error)
    } else {
      setPrefsFeedback('Preferencias guardadas')
      setTimeout(() => setPrefsFeedback(null), 3000)
    }
    setSavingPrefs(false)
  }

  function updatePref(key: string, value: boolean) {
    if (!prefs) return
    setPrefs({ ...prefs, [key]: value })
  }

  if (userLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-slate-700 animate-pulse rounded" />
        <Card>
          <div className="space-y-4 animate-pulse">
            <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded" />
            <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded" />
            <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded" />
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground-muted" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuracion</h1>
          <p className="text-sm text-foreground-secondary">Gestiona tu perfil y preferencias</p>
        </div>
      </div>

      {/* Profile Section */}
      <Card>
        <h2 className="text-lg font-semibold text-foreground mb-4">Perfil</h2>
        <div className="space-y-4">
          <Input
            label="Nombre completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Tu nombre"
          />
          <Input
            label="Email"
            value={profile?.email || ''}
            disabled
            hint="El email no se puede cambiar"
          />
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSaveProfile}
              isLoading={savingProfile}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Guardar Perfil
            </Button>
            {profileFeedback && (
              <span className={`text-sm flex items-center gap-1 ${
                profileFeedback === 'Perfil actualizado' ? 'text-green-600' : 'text-red-500'
              }`}>
                {profileFeedback === 'Perfil actualizado' && <Check className="w-4 h-4" />}
                {profileFeedback}
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Email Preferences Section */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-foreground">Notificaciones por Email</h2>
        </div>

        {prefsLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-48 bg-gray-200 dark:bg-slate-700 rounded mt-1" />
                </div>
                <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 rounded-full" />
              </div>
            ))}
          </div>
        ) : prefs ? (
          <>
            <div className="space-y-5">
              {EMAIL_PREF_ITEMS.map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {prefs[item.key] ? (
                        <Bell className="w-4 h-4 text-primary-500" />
                      ) : (
                        <BellOff className="w-4 h-4 text-foreground-muted" />
                      )}
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                    </div>
                    <p className="text-xs text-foreground-muted mt-0.5 ml-6">{item.description}</p>
                  </div>
                  <Toggle
                    checked={prefs[item.key]}
                    onChange={(val) => updatePref(item.key, val)}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
              <Button
                onClick={handleSavePrefs}
                isLoading={savingPrefs}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Guardar Preferencias
              </Button>
              {prefsFeedback && (
                <span className={`text-sm flex items-center gap-1 ${
                  prefsFeedback === 'Preferencias guardadas' ? 'text-green-600' : 'text-red-500'
                }`}>
                  {prefsFeedback === 'Preferencias guardadas' && <Check className="w-4 h-4" />}
                  {prefsFeedback}
                </span>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-foreground-muted">No se pudieron cargar las preferencias</p>
        )}
      </Card>
    </div>
  )
}

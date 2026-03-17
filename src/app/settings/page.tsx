'use client'

import { useState, useEffect, useMemo } from 'react'
import { Mail, Bell, BellOff, Save, Check, ArrowLeft, Globe } from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@/hooks/useUser'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateProfile } from '@/actions/auth'
import { getEmailPreferences, updateEmailPreferences } from '@/actions/emails'
import { useLocale } from '@/features/i18n'
import type { Locale } from '@/features/i18n'
import type { EmailPreferences } from '@/types/database'

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

const LANGUAGE_OPTIONS: { value: Locale; label: string; flag: string }[] = [
  { value: 'es', label: 'Espanol', flag: 'ES' },
  { value: 'en', label: 'English', flag: 'EN' },
]

export default function SettingsPage() {
  const { profile, loading: userLoading } = useUser()
  const { t, locale, setLocale } = useLocale()
  const [fullName, setFullName] = useState('')
  const [prefs, setPrefs] = useState<EmailPreferences | null>(null)
  const [prefsLoading, setPrefsLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPrefs, setSavingPrefs] = useState(false)
  const [profileFeedback, setProfileFeedback] = useState<string | null>(null)
  const [prefsFeedback, setPrefsFeedback] = useState<string | null>(null)

  const emailPrefItems = useMemo(() => [
    { key: 'welcome' as const, label: t.settings.welcome, description: t.settings.welcomeDesc },
    { key: 'enrollment' as const, label: t.settings.enrollments, description: t.settings.enrollmentsDesc },
    { key: 'completion' as const, label: t.settings.coursesCompleted, description: t.settings.coursesCompletedDesc },
    { key: 'badges' as const, label: t.settings.badges, description: t.settings.badgesDesc },
    { key: 'weekly_digest' as const, label: t.settings.weeklyDigest, description: t.settings.weeklyDigestDesc },
    { key: 'marketing' as const, label: t.settings.news, description: t.settings.newsDesc },
  ], [t])

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
      setProfileFeedback(t.settings.profileUpdated)
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
      setPrefsFeedback(t.settings.preferencesSaved)
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
          <h1 className="text-2xl font-bold text-foreground">{t.settings.title}</h1>
          <p className="text-sm text-foreground-secondary">{t.settings.subtitle}</p>
        </div>
      </div>

      {/* Profile Section */}
      <Card>
        <h2 className="text-lg font-semibold text-foreground mb-4">{t.settings.profile}</h2>
        <div className="space-y-4">
          <Input
            label={t.settings.fullName}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t.settings.yourName}
          />
          <Input
            label={t.settings.emailLabel}
            value={profile?.email || ''}
            disabled
            hint={t.settings.emailCannotChange}
          />
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSaveProfile}
              isLoading={savingProfile}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {t.settings.saveProfile}
            </Button>
            {profileFeedback && (
              <span className={`text-sm flex items-center gap-1 ${
                profileFeedback === t.settings.profileUpdated ? 'text-green-600' : 'text-red-500'
              }`}>
                {profileFeedback === t.settings.profileUpdated && <Check className="w-4 h-4" />}
                {profileFeedback}
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Language Section */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-foreground">{t.settings.language}</h2>
        </div>
        <p className="text-sm text-foreground-secondary mb-4">{t.settings.languageDesc}</p>
        <div className="flex gap-3">
          {LANGUAGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setLocale(opt.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                locale === opt.value
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400'
                  : 'bg-white dark:bg-slate-800 border-border-light dark:border-slate-700 text-foreground-secondary hover:border-primary-200 dark:hover:border-primary-800'
              }`}
            >
              <span className="text-base">{opt.flag}</span>
              {opt.label}
              {locale === opt.value && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </Card>

      {/* Email Preferences Section */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-foreground">{t.settings.emailNotifications}</h2>
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
              {emailPrefItems.map((item) => (
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
                {t.settings.savePreferences}
              </Button>
              {prefsFeedback && (
                <span className={`text-sm flex items-center gap-1 ${
                  prefsFeedback === t.settings.preferencesSaved ? 'text-green-600' : 'text-red-500'
                }`}>
                  {prefsFeedback === t.settings.preferencesSaved && <Check className="w-4 h-4" />}
                  {prefsFeedback}
                </span>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-foreground-muted">{t.settings.couldNotLoad}</p>
        )}
      </Card>
    </div>
  )
}

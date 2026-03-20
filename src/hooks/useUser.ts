'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, UserRole } from '@/types/database'

interface UseUserReturn {
  profile: Profile | null
  role: UserRole | null
  loading: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
}

export function useUser(): UseUserReturn {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url, role, xp, level, streak_days, preferred_locale, bio, bio_en, website_url, social_links, is_instructor_verified, instructor_since, created_at, updated_at')
        .eq('id', user.id)
        .single()

      setProfile(data)
      setLoading(false)
    }

    fetchProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          fetchProfile()
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return {
    profile,
    role: profile?.role ?? null,
    loading,
    isAdmin: profile?.role === 'admin' || profile?.role === 'super_admin',
    isSuperAdmin: profile?.role === 'super_admin',
  }
}

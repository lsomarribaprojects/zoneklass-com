// ============================================
// TIPOS DEL DOMINIO - ZoneKlass
// ============================================

export type UserRole = 'super_admin' | 'admin' | 'estudiante'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  xp: number
  level: number
  streak_days: number
  created_at: string
  updated_at: string
}

// ============================================
// Permisos por Rol
// ============================================

export const ROLE_PERMISSIONS = {
  super_admin: {
    canManageUsers: true,
    canManageCourses: true,
    canManageAdmins: true,
    canViewAnalytics: true,
    canAccessAdmin: true,
  },
  admin: {
    canManageUsers: false,
    canManageCourses: true,
    canManageAdmins: false,
    canViewAnalytics: true,
    canAccessAdmin: true,
  },
  estudiante: {
    canManageUsers: false,
    canManageCourses: false,
    canManageAdmins: false,
    canViewAnalytics: false,
    canAccessAdmin: false,
  },
} as const

export type Permission = keyof typeof ROLE_PERMISSIONS.super_admin

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role][permission]
}

// ============================================
// Database type para Supabase client
// ============================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at' | 'xp' | 'level' | 'streak_days'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
    }
  }
}

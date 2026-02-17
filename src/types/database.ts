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
// Tipos de Cursos
// ============================================

export type CourseCategory = 'Programación' | 'IA' | 'Diseño' | 'Marketing' | 'Negocios'
export type CourseLevel = 'Principiante' | 'Intermedio' | 'Avanzado'

export interface Course {
  id: string
  title: string
  description: string | null
  slug: string
  category: CourseCategory
  level: CourseLevel
  thumbnail_url: string | null
  price: number
  is_published: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface Module {
  id: string
  course_id: string
  title: string
  order_index: number
  created_at: string
}

export interface Lesson {
  id: string
  module_id: string
  title: string
  content: string | null
  video_url: string | null
  order_index: number
  duration_minutes: number
  created_at: string
}

export interface CourseWithModules extends Course {
  modules: ModuleWithLessons[]
}

export interface ModuleWithLessons extends Module {
  lessons: Lesson[]
}

// ============================================
// Inscripciones
// ============================================

export interface CourseEnrollment {
  id: string
  user_id: string
  course_id: string
  enrolled_at: string
  completed_at: string | null
}

// ============================================
// Progreso de Lecciones
// ============================================

export interface LessonProgress {
  id: string
  user_id: string
  lesson_id: string
  course_id: string
  completed_at: string
  created_at: string
}

export interface CourseWithStats extends Course {
  modules_count: number
  lessons_count: number
  total_duration_minutes: number
  enrolled_count: number
}

export interface CourseDetail extends CourseWithModules {
  enrolled_count: number
  is_enrolled: boolean
}

// ============================================
// Invite Links
// ============================================

export type InviteSource = 'twitter' | 'whatsapp' | 'email' | 'website' | 'other'
export type InviteAction = 'click' | 'register' | 'enroll'

export interface InviteLink {
  id: string
  course_id: string
  code: string
  label: string
  source: InviteSource
  expires_at: string | null
  max_uses: number
  current_uses: number
  is_active: boolean
  created_by: string
  created_at: string
}

export interface InviteTracking {
  id: string
  invite_link_id: string
  user_id: string | null
  action: InviteAction
  ip_hash: string | null
  created_at: string
}

export interface InviteLinkWithStats extends InviteLink {
  clicks: number
  registrations: number
  enrollments: number
}

// ============================================
// Comunidad
// ============================================

export type PostCategory = 'general' | 'pregunta' | 'recurso' | 'logro' | 'presentacion'
export type NotificationType = 'like' | 'comment' | 'reply' | 'dm' | 'badge' | 'level_up'

export interface Post {
  id: string
  author_id: string
  title: string
  content: string
  category: PostCategory
  likes_count: number
  comments_count: number
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export interface PostWithAuthor extends Post {
  author: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'level'>
  has_liked?: boolean
}

export interface Comment {
  id: string
  post_id: string
  author_id: string
  content: string
  parent_id: string | null
  created_at: string
}

export interface CommentWithAuthor extends Comment {
  author: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'level'>
  replies?: CommentWithAuthor[]
}

export interface PostLike {
  id: string
  post_id: string
  user_id: string
  created_at: string
}

export interface DirectMessage {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  is_read: boolean
  created_at: string
}

export interface DirectMessageWithUser extends DirectMessage {
  other_user: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'level'>
}

export interface Conversation {
  user: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'level'>
  last_message: string
  last_message_at: string
  unread_count: number
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  link: string | null
  is_read: boolean
  created_at: string
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
      courses: {
        Row: Course
        Insert: Omit<Course, 'id' | 'created_at' | 'updated_at' | 'is_published'>
        Update: Partial<Omit<Course, 'id' | 'created_at' | 'created_by'>>
      }
      modules: {
        Row: Module
        Insert: Omit<Module, 'id' | 'created_at'>
        Update: Partial<Omit<Module, 'id' | 'created_at' | 'course_id'>>
      }
      lessons: {
        Row: Lesson
        Insert: Omit<Lesson, 'id' | 'created_at'>
        Update: Partial<Omit<Lesson, 'id' | 'created_at' | 'module_id'>>
      }
      course_enrollments: {
        Row: CourseEnrollment
        Insert: Omit<CourseEnrollment, 'id' | 'enrolled_at' | 'completed_at'>
        Update: Partial<Pick<CourseEnrollment, 'completed_at'>>
      }
      lesson_progress: {
        Row: LessonProgress
        Insert: Omit<LessonProgress, 'id' | 'completed_at' | 'created_at'>
        Update: never
      }
      invite_links: {
        Row: InviteLink
        Insert: Omit<InviteLink, 'id' | 'created_at' | 'current_uses' | 'is_active'>
        Update: Partial<Pick<InviteLink, 'label' | 'source' | 'expires_at' | 'max_uses' | 'current_uses' | 'is_active'>>
      }
      invite_tracking: {
        Row: InviteTracking
        Insert: Omit<InviteTracking, 'id' | 'created_at'>
        Update: never
      }
      posts: {
        Row: Post
        Insert: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'comments_count' | 'is_pinned'>
        Update: Partial<Omit<Post, 'id' | 'created_at' | 'author_id'>>
      }
      comments: {
        Row: Comment
        Insert: Omit<Comment, 'id' | 'created_at'>
        Update: never
      }
      post_likes: {
        Row: PostLike
        Insert: Omit<PostLike, 'id' | 'created_at'>
        Update: never
      }
      direct_messages: {
        Row: DirectMessage
        Insert: Omit<DirectMessage, 'id' | 'created_at' | 'is_read'>
        Update: Partial<Pick<DirectMessage, 'is_read'>>
      }
      notifications: {
        Row: Notification
        Insert: Omit<Notification, 'id' | 'created_at' | 'is_read'>
        Update: Partial<Pick<Notification, 'is_read'>>
      }
    }
  }
}

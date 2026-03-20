/**
 * TypeScript Types for instructor-courses Server Actions
 */

// ============================================
// REQUEST TYPES
// ============================================

export interface CreateCourseLesson {
  title: string
  title_en?: string
  content?: string | null
  order_index: number
  duration_minutes: number
}

export interface CreateCourseModule {
  title: string
  title_en?: string
  order_index: number
  lessons: CreateCourseLesson[]
}

export interface CreateCourseWithOutlineInput {
  title: string
  description: string
  category: 'Programacion' | 'IA' | 'Diseno' | 'Marketing' | 'Negocios'
  level: 'Principiante' | 'Intermedio' | 'Avanzado'
  modules: CreateCourseModule[]
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface CreateCourseResponse {
  error: string | null
  courseId?: string
  slug?: string
}

export interface CourseWithCounts {
  id: string
  title: string
  description: string | null
  slug: string
  category: string
  level: string
  thumbnail_url: string | null
  price: number
  is_published: boolean
  is_official: boolean
  created_by: string
  created_at: string
  updated_at: string
  module_count: number
  lesson_count: number
}

export interface GetInstructorCoursesResponse {
  error: string | null
  data: CourseWithCounts[] | null
}

export interface UpdatePublishStatusResponse {
  error: string | null
}

// ============================================
// DATABASE TYPES (for reference)
// ============================================

/**
 * Course category enum values in DATABASE
 * Note: These have accents unlike the form input values
 */
export type DBCourseCategory =
  | 'Programación'
  | 'IA'
  | 'Diseño'
  | 'Marketing'
  | 'Negocios'

/**
 * Course level enum values
 */
export type CourseLevel = 'Principiante' | 'Intermedio' | 'Avanzado'

/**
 * Mapping from form category (unaccented) to DB category (accented)
 */
export const CATEGORY_MAP: Record<string, DBCourseCategory> = {
  'Programacion': 'Programación',
  'Diseno': 'Diseño',
  'IA': 'IA',
  'Marketing': 'Marketing',
  'Negocios': 'Negocios',
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { requireInstructor, canCreateCourse } from '@/lib/auth/permissions'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { generateCourseOutline } from '@/lib/ai/course-generator'

// ============================================
// TYPES & SCHEMAS
// ============================================

const lessonSchema = z.object({
  title: z.string().min(3, 'El título de la lección debe tener al menos 3 caracteres'),
  title_en: z.string().optional(),
  content: z.string().nullable().optional(),
  order_index: z.number().int().min(0),
  duration_minutes: z.number().int().min(0).default(0),
})

const moduleSchema = z.object({
  title: z.string().min(3, 'El título del módulo debe tener al menos 3 caracteres'),
  title_en: z.string().optional(),
  order_index: z.number().int().min(0),
  lessons: z.array(lessonSchema).min(1, 'Cada módulo debe tener al menos una lección'),
})

const createCourseSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  category: z.enum(['Programacion', 'IA', 'Diseno', 'Marketing', 'Negocios']),
  level: z.enum(['Principiante', 'Intermedio', 'Avanzado']),
  modules: z.array(moduleSchema).min(1, 'El curso debe tener al menos un módulo'),
})

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate URL-friendly slug from title
 * - Lowercase
 * - Remove accents
 * - Replace spaces with hyphens
 * - Remove special characters
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
}

/**
 * Generate unique slug by checking existence and appending random suffix if needed
 */
async function generateUniqueSlug(
  supabase: any,
  baseTitle: string
): Promise<{ slug: string; error: string | null }> {
  const baseSlug = generateSlug(baseTitle)

  // Check if base slug is available
  const { data: existing } = await supabase
    .from('courses')
    .select('id')
    .eq('slug', baseSlug)
    .single()

  if (!existing) {
    return { slug: baseSlug, error: null }
  }

  // Generate slug with random 4-char suffix
  const randomSuffix = Math.random().toString(36).substring(2, 6)
  const uniqueSlug = `${baseSlug}-${randomSuffix}`

  return { slug: uniqueSlug, error: null }
}

/**
 * Map form category names (unaccented) to DB category names (accented)
 */
function mapCategoryToDB(category: string): string {
  const categoryMap: Record<string, string> = {
    'Programacion': 'Programación',
    'Diseno': 'Diseño',
    'IA': 'IA',
    'Marketing': 'Marketing',
    'Negocios': 'Negocios',
  }
  return categoryMap[category] || category
}

// ============================================
// SERVER ACTIONS
// ============================================

/**
 * Create a full course with modules and lessons from AI-generated outline
 *
 * @param data - Course data with nested modules and lessons
 * @returns { error: string | null, courseId?: string, slug?: string }
 */
export async function createCourseWithOutline(data: unknown) {
  // 1. Verify instructor authentication
  const { error: authError, supabase, user } = await requireInstructor()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autorizado' }
  }

  // 2. Validate input data
  const parsed = createCourseSchema.safeParse(data)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return { error: firstError.message }
  }

  const { title, description, category, level, modules } = parsed.data

  // 3. Check plan limits (can this instructor create more courses?)
  const { canCreate, error: limitError } = await canCreateCourse(user.id)
  if (!canCreate) {
    return { error: limitError || 'Has alcanzado el límite de cursos de tu plan' }
  }

  // 4. Generate unique slug
  const { slug, error: slugError } = await generateUniqueSlug(supabase, title)
  if (slugError) {
    return { error: slugError }
  }

  // 5. Map category to DB format (Programacion -> Programación)
  const dbCategory = mapCategoryToDB(category)

  // 6. Insert course
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .insert({
      title,
      description,
      slug,
      category: dbCategory,
      level,
      created_by: user.id,
      is_published: false,
      is_official: false,
    })
    .select()
    .single()

  if (courseError) {
    return { error: `Error al crear curso: ${courseError.message}` }
  }

  // 7. Insert modules and lessons
  try {
    for (const moduleData of modules) {
      // Insert module
      const { data: module, error: moduleError } = await supabase
        .from('modules')
        .insert({
          course_id: course.id,
          title: moduleData.title,
          title_en: moduleData.title_en || null,
          order_index: moduleData.order_index,
        })
        .select()
        .single()

      if (moduleError) {
        throw new Error(`Error al crear módulo "${moduleData.title}": ${moduleError.message}`)
      }

      // Insert lessons for this module
      const lessonsToInsert = moduleData.lessons.map((lesson) => ({
        module_id: module.id,
        title: lesson.title,
        title_en: lesson.title_en || null,
        content: lesson.content || null,
        order_index: lesson.order_index,
        duration_minutes: lesson.duration_minutes,
      }))

      const { error: lessonsError } = await supabase
        .from('lessons')
        .insert(lessonsToInsert)

      if (lessonsError) {
        throw new Error(`Error al crear lecciones para módulo "${moduleData.title}": ${lessonsError.message}`)
      }
    }
  } catch (err) {
    // Rollback: delete the course (CASCADE will delete modules and lessons)
    await supabase.from('courses').delete().eq('id', course.id)

    return {
      error: err instanceof Error ? err.message : 'Error al crear módulos y lecciones',
    }
  }

  // 8. Revalidate paths
  revalidatePath('/instructor/courses')
  revalidatePath('/instructor/dashboard')

  return {
    error: null,
    courseId: course.id,
    slug: course.slug,
  }
}

/**
 * Get all courses created by the current instructor
 *
 * @returns Array of courses with module and lesson counts
 */
export async function getInstructorCourses() {
  // 1. Verify instructor authentication
  const { error: authError, supabase, user } = await requireInstructor()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autorizado', data: null }
  }

  // 2. Query courses with counts
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select(`
      *,
      modules (
        id,
        lessons (
          id
        )
      )
    `)
    .eq('created_by', user.id)
    .order('created_at', { ascending: false })

  if (coursesError) {
    return { error: `Error al obtener cursos: ${coursesError.message}`, data: null }
  }

  // 3. Transform data to include counts
  const coursesWithCounts = courses.map((course) => {
    const moduleCount = course.modules?.length || 0
    const lessonCount =
      course.modules?.reduce((total: number, module: any) => {
        return total + (module.lessons?.length || 0)
      }, 0) || 0

    // Remove nested data from response
    const { modules, ...courseWithoutNested } = course

    return {
      ...courseWithoutNested,
      module_count: moduleCount,
      lesson_count: lessonCount,
    }
  })

  return { error: null, data: coursesWithCounts }
}

/**
 * Publish or unpublish a course
 *
 * @param courseId - UUID of the course
 * @param isPublished - New publish status
 */
export async function updateCoursePublishStatus(courseId: string, isPublished: boolean) {
  // 1. Verify instructor authentication
  const { error: authError, supabase, user } = await requireInstructor()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autorizado' }
  }

  // 2. Verify course ownership
  const { data: course, error: fetchError } = await supabase
    .from('courses')
    .select('created_by')
    .eq('id', courseId)
    .single()

  if (fetchError) {
    return { error: 'Curso no encontrado' }
  }

  // 3. Check ownership (or super_admin bypass)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isSuperAdmin = profile?.role === 'super_admin'
  const isOwner = course.created_by === user.id

  if (!isSuperAdmin && !isOwner) {
    return { error: 'No eres el propietario de este curso' }
  }

  // 4. Update publish status
  const { error: updateError } = await supabase
    .from('courses')
    .update({ is_published: isPublished })
    .eq('id', courseId)

  if (updateError) {
    return { error: `Error al actualizar curso: ${updateError.message}` }
  }

  // 5. Revalidate paths
  revalidatePath('/instructor/courses')
  revalidatePath('/instructor/dashboard')
  revalidatePath('/cursos')
  revalidatePath(`/cursos/${course.created_by}`)

  return { error: null }
}

/**
 * Generate course outline using AI (server action callable from client)
 *
 * @param title - Course title
 * @param category - Course category
 * @param level - Course level
 * @param description - Course description
 * @returns { error: string | null, modules: array }
 */
export async function generateOutlineAction(
  title: string,
  category: string,
  level: string,
  description: string
) {
  // 1. Verify instructor authentication
  const { error: authError } = await requireInstructor()
  if (authError) {
    return { error: authError, modules: [] }
  }

  // 2. Generate outline via AI
  try {
    const outline = await generateCourseOutline(title, category, level, description)
    return { error: null, modules: outline.modules }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Error al generar la estructura del curso',
      modules: [],
    }
  }
}

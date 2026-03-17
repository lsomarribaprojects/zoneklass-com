'use server'

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { generateImage } from '@/lib/openai/image-generation'
import { uploadGeneratedImage } from '@/lib/openai/upload-generated-image'
import {
  buildCoverPrompt,
  buildCourseCoverPrompt,
  buildContentPrompt,
  buildSummaryPrompt,
  parsePendienteImgPlaceholders,
  insertContentImagePlaceholders,
} from '@/lib/openai/prompt-templates'
import { extractLessonConcepts } from '@/lib/openai/extract-lesson-concepts'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['super_admin', 'admin'].includes(profile.role)) {
    return { error: 'No autorizado' }
  }
  return { error: null }
}

export async function generateCourseCoverImage(courseId: string) {
  const { error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const serviceClient = createServiceClient()

  const { data: course } = await serviceClient
    .from('courses')
    .select('id, title, description, slug')
    .eq('id', courseId)
    .single()

  if (!course) return { error: 'Curso no encontrado' }

  const { count } = await serviceClient
    .from('modules')
    .select('id', { count: 'exact', head: true })
    .eq('course_id', courseId)

  try {
    const prompt = buildCourseCoverPrompt({
      courseTitle: course.title,
      courseDescription: course.description || '',
      moduleCount: count || 10,
    })

    const result = await generateImage({ prompt })

    const publicUrl = await uploadGeneratedImage({
      base64Data: result.imageBase64,
      courseSlug: course.slug,
      lessonId: 'course-cover',
      imageType: 'cover',
      imageName: 'course-cover',
    })

    await serviceClient
      .from('courses')
      .update({ thumbnail_url: publicUrl })
      .eq('id', courseId)

    revalidatePath('/admin/courses', 'layout')
    revalidatePath('/cursos', 'layout')
    return { data: { url: publicUrl } }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return { error: `Error generando cover del curso: ${message}` }
  }
}

export async function insertAndGenerateContentImages(lessonId: string) {
  const { error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const serviceClient = createServiceClient()

  const { data: lesson } = await serviceClient
    .from('lessons')
    .select('id, title, content, module_id')
    .eq('id', lessonId)
    .single()

  if (!lesson || !lesson.content) return { error: 'Leccion sin contenido' }

  // First, insert placeholders if none exist
  const updatedHtml = insertContentImagePlaceholders(lesson.content, lesson.title)
  if (updatedHtml !== lesson.content) {
    await serviceClient
      .from('lessons')
      .update({ content: updatedHtml })
      .eq('id', lessonId)
  }

  // Now generate images (reuse existing generateContentImages logic)
  return generateContentImages(lessonId)
}

export async function generateLessonCoverImage(lessonId: string) {
  const { error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const serviceClient = createServiceClient()

  const { data: lesson, error: lessonError } = await serviceClient
    .from('lessons')
    .select('id, title, order_index, cover_image_url, module_id')
    .eq('id', lessonId)
    .single()

  if (lessonError || !lesson) return { error: 'Leccion no encontrada' }

  const { data: module } = await serviceClient
    .from('modules')
    .select('id, title, order_index, course_id')
    .eq('id', lesson.module_id)
    .single()

  if (!module) return { error: 'Modulo no encontrado' }

  const { data: course } = await serviceClient
    .from('courses')
    .select('id, title, slug')
    .eq('id', module.course_id)
    .single()

  if (!course) return { error: 'Curso no encontrado' }

  try {
    const prompt = buildCoverPrompt({
      lessonTitle: lesson.title,
      moduleTitle: module.title,
      courseTitle: course.title,
      lessonIndex: lesson.order_index,
      moduleIndex: module.order_index,
    })

    const result = await generateImage({ prompt })

    const publicUrl = await uploadGeneratedImage({
      base64Data: result.imageBase64,
      courseSlug: course.slug,
      lessonId: lesson.id,
      imageType: 'cover',
      imageName: 'cover',
    })

    await serviceClient
      .from('lessons')
      .update({ cover_image_url: publicUrl })
      .eq('id', lessonId)

    revalidatePath('/admin/courses', 'layout')
    return { data: { url: publicUrl } }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return { error: `Error generando imagen: ${message}` }
  }
}

export async function generateContentImages(lessonId: string) {
  const { error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const serviceClient = createServiceClient()

  const { data: lesson } = await serviceClient
    .from('lessons')
    .select('id, title, content, module_id')
    .eq('id', lessonId)
    .single()

  if (!lesson || !lesson.content) return { error: 'Leccion sin contenido' }

  const placeholders = parsePendienteImgPlaceholders(lesson.content)
  if (placeholders.length === 0) return { data: { replacements: 0, total: 0 } }

  const { data: module } = await serviceClient
    .from('modules')
    .select('course_id')
    .eq('id', lesson.module_id)
    .single()

  if (!module) return { error: 'Modulo no encontrado' }

  const { data: moduleData } = await serviceClient
    .from('modules')
    .select('course_id, order_index')
    .eq('id', lesson.module_id)
    .single()

  const { data: course } = await serviceClient
    .from('courses')
    .select('slug')
    .eq('id', module.course_id)
    .single()

  if (!course) return { error: 'Curso no encontrado' }

  let updatedContent = lesson.content
  let replacements = 0
  const errors: string[] = []

  for (let idx = 0; idx < placeholders.length; idx++) {
    const placeholder = placeholders[idx]
    try {
      const prompt = buildContentPrompt({
        altText: placeholder.altText,
        lessonTitle: lesson.title,
        moduleIndex: moduleData?.order_index ?? 0,
        imageIndex: idx,
      })

      const result = await generateImage({ prompt })

      const publicUrl = await uploadGeneratedImage({
        base64Data: result.imageBase64,
        courseSlug: course.slug,
        lessonId: lesson.id,
        imageType: 'content',
        imageName: placeholder.imageName.replace('PENDIENTE_IMG_', ''),
      })

      updatedContent = updatedContent.replace(placeholder.imageName, publicUrl)
      replacements++

      // Rate limit: 2 seconds between requests
      await new Promise(resolve => setTimeout(resolve, 2000))
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      errors.push(`${placeholder.imageName}: ${msg}`)
    }
  }

  if (replacements > 0) {
    await serviceClient
      .from('lessons')
      .update({ content: updatedContent })
      .eq('id', lessonId)

    revalidatePath('/admin/courses', 'layout')
  }

  return {
    data: {
      replacements,
      total: placeholders.length,
      errors: errors.length > 0 ? errors : undefined,
    },
  }
}

export async function generateLessonSummaryImage(lessonId: string) {
  const { error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const serviceClient = createServiceClient()

  const { data: lesson, error: lessonError } = await serviceClient
    .from('lessons')
    .select('id, title, content, order_index, summary_image_url, module_id')
    .eq('id', lessonId)
    .single()

  if (lessonError || !lesson) return { error: 'Leccion no encontrada' }
  if (!lesson.content) return { error: 'Leccion sin contenido para generar resumen' }

  const { data: module } = await serviceClient
    .from('modules')
    .select('id, title, order_index, course_id')
    .eq('id', lesson.module_id)
    .single()

  if (!module) return { error: 'Modulo no encontrado' }

  const { data: course } = await serviceClient
    .from('courses')
    .select('id, title, slug')
    .eq('id', module.course_id)
    .single()

  if (!course) return { error: 'Curso no encontrado' }

  try {
    const concepts = extractLessonConcepts(lesson.content, lesson.title)

    const prompt = buildSummaryPrompt({
      lessonTitle: lesson.title,
      moduleTitle: module.title,
      courseTitle: course.title,
      moduleIndex: module.order_index,
      lessonIndex: lesson.order_index,
      keyConcepts: concepts.keyConcepts,
      keyTerms: concepts.keyTerms,
    })

    const result = await generateImage({ prompt })

    const publicUrl = await uploadGeneratedImage({
      base64Data: result.imageBase64,
      courseSlug: course.slug,
      lessonId: lesson.id,
      imageType: 'summary',
      imageName: 'summary',
    })

    await serviceClient
      .from('lessons')
      .update({ summary_image_url: publicUrl })
      .eq('id', lessonId)

    revalidatePath('/admin/courses', 'layout')
    revalidatePath(`/cursos/${course.slug}`, 'layout')
    return { data: { url: publicUrl } }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return { error: `Error generando filmina: ${message}` }
  }
}

export async function getImageGenerationStatus(courseId: string) {
  const { error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const serviceClient = createServiceClient()

  const { data: course, error: courseError } = await serviceClient
    .from('courses')
    .select('id, slug, title')
    .eq('id', courseId)
    .single()

  if (!course) return { error: 'Curso no encontrado' }

  const { data: modules } = await serviceClient
    .from('modules')
    .select('id, title, order_index')
    .eq('course_id', courseId)
    .order('order_index')

  if (!modules) return { error: 'No hay modulos' }

  const lessons = []

  for (const mod of modules) {
    const { data: modLessons } = await serviceClient
      .from('lessons')
      .select('id, title, order_index, cover_image_url, summary_image_url, content')
      .eq('module_id', mod.id)
      .order('order_index')

    if (!modLessons) continue

    for (const lesson of modLessons) {
      const placeholders = lesson.content
        ? parsePendienteImgPlaceholders(lesson.content)
        : []

      lessons.push({
        id: lesson.id,
        title: lesson.title,
        moduleTitle: mod.title,
        moduleIndex: mod.order_index,
        lessonIndex: lesson.order_index,
        hasCoverImage: !!lesson.cover_image_url,
        coverImageUrl: lesson.cover_image_url,
        hasSummaryImage: !!lesson.summary_image_url,
        summaryImageUrl: lesson.summary_image_url,
        pendingContentImages: placeholders.length,
      })
    }
  }

  return {
    data: {
      courseId: course.id,
      courseTitle: course.title,
      courseSlug: course.slug,
      lessons,
    },
  }
}

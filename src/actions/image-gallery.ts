'use server'

import { requireCourseAccess, hasAICredits, deductAICredits } from '@/lib/auth/permissions'
import { createServiceClient } from '@/lib/supabase/server'
import { generateImage } from '@/lib/openai/image-generation'
import { uploadGeneratedImage } from '@/lib/openai/upload-generated-image'

interface ImageFile {
  name: string
  url: string
  createdAt: string
}

/**
 * List all images for a course from Supabase Storage
 */
export async function listCourseImages(courseId: string, courseSlug: string) {
  // Check course access
  const { error: authError } = await requireCourseAccess(courseId)
  if (authError) return { error: authError }

  const serviceClient = createServiceClient()

  try {
    // List all files in the course folder
    const { data: files, error } = await serviceClient.storage
      .from('lesson-images')
      .list(courseSlug, {
        sortBy: { column: 'created_at', order: 'desc' },
      })

    if (error) {
      return { error: `Error listando imagenes: ${error.message}` }
    }

    if (!files || files.length === 0) {
      return { data: [] }
    }

    // Get public URLs for all files
    const images: ImageFile[] = files
      .filter((file) => file.name !== '.emptyFolderPlaceholder') // Filter out placeholder files
      .map((file) => {
        const { data: urlData } = serviceClient.storage
          .from('lesson-images')
          .getPublicUrl(`${courseSlug}/${file.name}`)

        return {
          name: file.name,
          url: urlData.publicUrl,
          createdAt: file.created_at || new Date().toISOString(),
        }
      })

    return { data: images }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return { error: `Error listando imagenes: ${message}` }
  }
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImage(courseId: string, filePath: string) {
  // Check course access
  const { error: authError } = await requireCourseAccess(courseId)
  if (authError) return { error: authError }

  const serviceClient = createServiceClient()

  try {
    const { error } = await serviceClient.storage
      .from('lesson-images')
      .remove([filePath])

    if (error) {
      return { error: `Error eliminando imagen: ${error.message}` }
    }

    return { data: { success: true } }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return { error: `Error eliminando imagen: ${message}` }
  }
}

/**
 * Generate a single inline image from a text description (for use in lesson editor)
 */
export async function generateInlineImage(
  courseId: string,
  lessonId: string,
  description: string
) {
  // Check course access
  const { error: authError, user } = await requireCourseAccess(courseId)
  if (authError || !user) return { error: authError || 'No autorizado' }

  // Check AI credits (2 credits per image)
  const creditCheck = await hasAICredits(user.id, 2)
  if (!creditCheck.hasCredits) {
    return { error: creditCheck.error || 'No tienes suficientes créditos IA' }
  }

  const serviceClient = createServiceClient()

  try {
    // Get course slug for file path
    const { data: course } = await serviceClient
      .from('courses')
      .select('slug')
      .eq('id', courseId)
      .single()

    if (!course) return { error: 'Curso no encontrado' }

    // Generate image using the description as prompt
    const result = await generateImage({ prompt: description })

    // Upload to storage
    const timestamp = Date.now()
    const publicUrl = await uploadGeneratedImage({
      base64Data: result.imageBase64,
      courseSlug: course.slug,
      lessonId: lessonId,
      imageType: 'content',
      imageName: `inline_${timestamp}`,
    })

    // Deduct AI credits
    await deductAICredits(user.id, 2, 'image', lessonId)

    return { data: { url: publicUrl } }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return { error: `Error generando imagen: ${message}` }
  }
}

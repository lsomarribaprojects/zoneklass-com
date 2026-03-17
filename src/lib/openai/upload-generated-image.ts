import { createServiceClient } from '@/lib/supabase/server'

const BUCKET_NAME = 'lesson-images'

export async function uploadGeneratedImage(params: {
  base64Data: string
  courseSlug: string
  lessonId: string
  imageType: 'cover' | 'content' | 'summary'
  imageName: string
}): Promise<string> {
  const { base64Data, courseSlug, lessonId, imageType, imageName } = params
  const serviceClient = createServiceClient()

  const buffer = Buffer.from(base64Data, 'base64')

  const timestamp = Date.now()
  const safeName = imageName.replace(/[^a-z0-9_-]/gi, '_').slice(0, 50)
  const filePath = `${courseSlug}/${lessonId}/${imageType}_${safeName}_${timestamp}.png`

  const { data, error } = await serviceClient.storage
    .from(BUCKET_NAME)
    .upload(filePath, buffer, {
      contentType: 'image/png',
      cacheControl: '31536000',
      upsert: false,
    })

  if (error) {
    throw new Error(`Storage upload error: ${error.message}`)
  }

  const { data: urlData } = serviceClient.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

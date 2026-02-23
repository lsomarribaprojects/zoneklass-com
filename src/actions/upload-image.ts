'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

const BUCKET_NAME = 'lesson-images'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']

async function ensureBucketExists() {
  const serviceClient = createServiceClient()
  const { data: buckets } = await serviceClient.storage.listBuckets()
  const exists = buckets?.some((b) => b.id === BUCKET_NAME)

  if (!exists) {
    await serviceClient.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: MAX_FILE_SIZE,
      allowedMimeTypes: ALLOWED_TYPES,
    })
  }
}

export async function uploadLessonImage(formData: FormData) {
  // 1. Auth check
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

  // 2. Get file from form data
  const file = formData.get('file') as File
  const courseSlug = formData.get('courseSlug') as string
  const lessonId = formData.get('lessonId') as string

  if (!file || !courseSlug || !lessonId) {
    return { error: 'Faltan datos requeridos' }
  }

  // 3. Validate file
  if (file.size > MAX_FILE_SIZE) {
    return { error: 'La imagen no puede superar 5MB' }
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: 'Formato no soportado. Usa JPG, PNG, GIF, WebP o SVG' }
  }

  // 4. Ensure bucket exists
  try {
    await ensureBucketExists()
  } catch {
    // Bucket might already exist, continue
  }

  // 5. Upload file with unique name
  const ext = file.name.split('.').pop() || 'jpg'
  const timestamp = Date.now()
  const safeName = `${timestamp}.${ext}`
  const filePath = `${courseSlug}/${lessonId}/${safeName}`

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    return { error: `Error al subir imagen: ${error.message}` }
  }

  // 6. Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path)

  return { url: urlData.publicUrl }
}

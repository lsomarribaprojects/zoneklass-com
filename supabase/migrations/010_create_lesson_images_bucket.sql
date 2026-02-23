-- Create the lesson-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lesson-images',
  'lesson-images',
  true,
  5242880,  -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to all files in lesson-images bucket
CREATE POLICY "Public read access for lesson images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'lesson-images');

-- Allow authenticated admins to upload images
CREATE POLICY "Admins can upload lesson images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'lesson-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid())
    AND role IN ('super_admin', 'admin')
  )
);

-- Allow authenticated admins to update images
CREATE POLICY "Admins can update lesson images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'lesson-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid())
    AND role IN ('super_admin', 'admin')
  )
);

-- Allow authenticated admins to delete images
CREATE POLICY "Admins can delete lesson images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'lesson-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid())
    AND role IN ('super_admin', 'admin')
  )
);

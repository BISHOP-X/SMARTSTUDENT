-- ============================================
-- EduSync Storage Buckets Setup
-- ============================================
-- This migration creates storage buckets for file uploads

-- Create submissions bucket (for student assignment uploads)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'submissions',
  'submissions',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
) ON CONFLICT (id) DO NOTHING;

-- Create study-materials bucket (for study materials)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'study-materials',
  'study-materials',
  false,
  5242880, -- 5MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects (if not already enabled)
-- Note: Storage RLS is typically already enabled by default

-- Policy: Users can upload files to their own folder in submissions
CREATE POLICY "Users can upload submissions"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'submissions' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can view their own submissions
CREATE POLICY "Users can view own submissions"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'submissions' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own submissions
CREATE POLICY "Users can delete own submissions"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'submissions' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Lecturers can view all submissions (for grading)
-- Note: You may need to adjust this based on how you identify lecturers
CREATE POLICY "Lecturers can view all submissions"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'submissions'
);

-- Policy: Users can upload to their study-materials folder
CREATE POLICY "Users can upload study materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'study-materials' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can view their own study materials
CREATE POLICY "Users can view own study materials"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'study-materials' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own study materials
CREATE POLICY "Users can delete own study materials"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'study-materials' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- Course materials uploads for lecturer courses
-- ============================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.course_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  uploader_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'course_materials' AND policyname = 'Users can view course materials'
  ) THEN
    CREATE POLICY "Users can view course materials"
    ON public.course_materials FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1
        FROM public.courses c
        WHERE c.id = course_materials.course_id
          AND c.lecturer_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1
        FROM public.enrollments e
        WHERE e.course_id = course_materials.course_id
          AND e.student_id = auth.uid()
      )
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'course_materials' AND policyname = 'Lecturers can insert course materials'
  ) THEN
    CREATE POLICY "Lecturers can insert course materials"
    ON public.course_materials FOR INSERT
    TO authenticated
    WITH CHECK (
      uploader_id = auth.uid()
      AND EXISTS (
        SELECT 1
        FROM public.courses c
        WHERE c.id = course_materials.course_id
          AND c.lecturer_id = auth.uid()
      )
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'course_materials' AND policyname = 'Lecturers can update own course materials'
  ) THEN
    CREATE POLICY "Lecturers can update own course materials"
    ON public.course_materials FOR UPDATE
    TO authenticated
    USING (uploader_id = auth.uid())
    WITH CHECK (uploader_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'course_materials' AND policyname = 'Lecturers can delete own course materials'
  ) THEN
    CREATE POLICY "Lecturers can delete own course materials"
    ON public.course_materials FOR DELETE
    TO authenticated
    USING (uploader_id = auth.uid());
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_course_materials_course_id ON public.course_materials(course_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_uploader_id ON public.course_materials(uploader_id);

CREATE OR REPLACE FUNCTION public.update_course_materials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS course_materials_updated_at ON public.course_materials;
CREATE TRIGGER course_materials_updated_at
  BEFORE UPDATE ON public.course_materials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_course_materials_updated_at();

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-materials',
  'course-materials',
  true,
  52428800,
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain'
  ]
) ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can upload course materials'
  ) THEN
    CREATE POLICY "Users can upload course materials"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'course-materials' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can delete own course materials files'
  ) THEN
    CREATE POLICY "Users can delete own course materials files"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'course-materials' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );
  END IF;
END $$;

COMMIT;

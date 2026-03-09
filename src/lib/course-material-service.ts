import { supabase } from './supabase';
import { deleteFile, uploadFile } from './file-upload-service';

export interface CourseMaterial {
  id: string;
  course_id: string;
  uploader_id: string;
  title: string;
  description: string | null;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  storage_path: string;
  public_url: string;
  created_at: string;
  updated_at: string;
}

const ALLOWED_MATERIAL_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
];

const MAX_MATERIAL_SIZE = 50 * 1024 * 1024;

export async function getCourseMaterials(courseId: string): Promise<{ materials: CourseMaterial[]; error?: string }> {
  const { data, error } = await supabase
    .from('course_materials')
    .select('*')
    .eq('course_id', courseId)
    .order('created_at', { ascending: false });

  if (error) return { materials: [], error: error.message };
  return { materials: (data || []) as CourseMaterial[] };
}

export async function uploadCourseMaterial(input: {
  courseId: string;
  title: string;
  file: File;
  description?: string;
}): Promise<{ material?: CourseMaterial; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  if (!ALLOWED_MATERIAL_TYPES.includes(input.file.type)) {
    return { error: 'Invalid file type. Upload PDF, PPT, PPTX, DOC, DOCX, or TXT files only.' };
  }

  if (input.file.size > MAX_MATERIAL_SIZE) {
    return { error: 'File too large. Maximum size is 50MB.' };
  }

  const upload = await uploadFile(input.file, 'course-materials', `course-${input.courseId}`);
  if (!upload.success || !upload.path || !upload.url) {
    return { error: upload.error || 'Upload failed' };
  }

  const { data, error } = await supabase
    .from('course_materials')
    .insert({
      course_id: input.courseId,
      uploader_id: user.id,
      title: input.title,
      description: input.description || null,
      file_name: input.file.name,
      file_type: input.file.type || null,
      file_size: input.file.size,
      storage_path: upload.path,
      public_url: upload.url,
    })
    .select()
    .single();

  if (error) {
    await deleteFile('course-materials', upload.path);
    return { error: error.message };
  }

  return { material: data as CourseMaterial };
}

export async function deleteCourseMaterial(materialId: string): Promise<{ success: boolean; error?: string }> {
  const { data: material, error: fetchError } = await supabase
    .from('course_materials')
    .select('*')
    .eq('id', materialId)
    .single();

  if (fetchError || !material) {
    return { success: false, error: fetchError?.message || 'Material not found' };
  }

  const storageDeleted = await deleteFile('course-materials', material.storage_path);
  if (!storageDeleted) {
    return { success: false, error: 'Failed to delete file from storage' };
  }

  const { error } = await supabase
    .from('course_materials')
    .delete()
    .eq('id', materialId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

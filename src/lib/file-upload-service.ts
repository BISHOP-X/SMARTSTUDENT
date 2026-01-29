/**
 * ============================================
 * File Upload Service - Supabase Storage
 * ============================================
 * 
 * Handles file uploads for:
 * - Student assignment submissions (PDFs, docs)
 * - Study materials for AI analysis
 */

import { supabase } from './supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Upload a file to Supabase Storage
 */
export const uploadFile = async (
  file: File,
  bucket: string,
  folder: string
): Promise<UploadResult> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    console.log('[Upload] Uploading file:', { bucket, fileName, size: file.size });

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('[Upload] Upload error:', error);
      return { success: false, error: error.message };
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrl,
      path: data.path
    };
  } catch (error) {
    console.error('[Upload] Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
};

/**
 * Upload an assignment submission file
 */
export const uploadSubmission = async (
  file: File,
  assignmentId: string
): Promise<UploadResult> => {
  // Validate file type
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: 'Invalid file type. Please upload PDF, DOC, DOCX, or TXT files.'
    };
  }

  // Max 10MB
  if (file.size > 10 * 1024 * 1024) {
    return {
      success: false,
      error: 'File too large. Maximum size is 10MB.'
    };
  }

  return uploadFile(file, 'submissions', `assignment-${assignmentId}`);
};

/**
 * Upload a study material for AI analysis
 */
export const uploadStudyMaterial = async (file: File): Promise<UploadResult> => {
  // Validate file type
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: 'Invalid file type. Please upload PDF, DOC, DOCX, or TXT files.'
    };
  }

  // Max 5MB for study materials
  if (file.size > 5 * 1024 * 1024) {
    return {
      success: false,
      error: 'File too large. Maximum size is 5MB.'
    };
  }

  return uploadFile(file, 'study-materials', 'uploads');
};

/**
 * Delete a file from Supabase Storage
 */
export const deleteFile = async (bucket: string, path: string): Promise<boolean> => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    console.error('[Upload] Delete error:', error);
    return false;
  }

  return true;
};

/**
 * Extract text content from a file (for AI analysis)
 * Note: This is a simplified version. In production, you'd use
 * a server-side service for PDF parsing.
 */
export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    } else {
      // For PDF/DOC files, we'd need server-side parsing
      // For now, return a placeholder message
      resolve(`[Content from ${file.name} - ${(file.size / 1024).toFixed(1)}KB]`);
    }
  });
};

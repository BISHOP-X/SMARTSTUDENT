/**
 * ============================================
 * Assignment Service - CRUD for assignments
 * ============================================
 */

import { supabase } from './supabase';

export interface Assignment {
  id: string;
  course_id: string;
  lecturer_id: string;
  title: string;
  description: string | null;
  due_date: string;
  max_score: number;
  grading_rubric: string | null;
  allow_file_upload: boolean;
  created_at: string;
  updated_at: string;
  // From joins
  course_title?: string;
  course_code?: string;
  submission_count?: number;
}

// ---- Create assignment ----
export async function createAssignment(data: {
  course_id: string;
  title: string;
  description: string;
  due_date: string;
  max_score: number;
  grading_rubric: string;
  allow_file_upload: boolean;
}): Promise<{ success: boolean; assignment?: Assignment; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { data: assignment, error } = await supabase
    .from('assignments')
    .insert({
      course_id: data.course_id,
      lecturer_id: user.id,
      title: data.title,
      description: data.description,
      due_date: data.due_date,
      max_score: data.max_score,
      grading_rubric: data.grading_rubric,
      allow_file_upload: data.allow_file_upload,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, assignment };
}

// ---- Get assignments for a course ----
export async function getCourseAssignments(courseId: string): Promise<{ assignments: Assignment[]; error?: string }> {
  const { data: assignments, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('course_id', courseId)
    .order('due_date', { ascending: true });

  if (error) return { assignments: [], error: error.message };
  return { assignments: assignments || [] };
}

// ---- Get single assignment ----
export async function getAssignment(assignmentId: string): Promise<{ assignment: Assignment | null; error?: string }> {
  const { data: assignment, error } = await supabase
    .from('assignments')
    .select('*, course:courses(title, course_code)')
    .eq('id', assignmentId)
    .single();

  if (error) return { assignment: null, error: error.message };
  
  // Flatten course info
  if (assignment?.course) {
    assignment.course_title = (assignment.course as any).title;
    assignment.course_code = (assignment.course as any).course_code;
    delete (assignment as any).course;
  }
  
  return { assignment };
}

// ---- Get all assignments for a lecturer (across all their courses) ----
export async function getMyAssignments(): Promise<{ assignments: Assignment[]; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { assignments: [], error: 'Not authenticated' };

  const { data: assignments, error } = await supabase
    .from('assignments')
    .select('*, course:courses(title, course_code)')
    .eq('lecturer_id', user.id)
    .order('due_date', { ascending: true });

  if (error) return { assignments: [], error: error.message };
  return { assignments: assignments || [] };
}

// ---- Delete assignment ----
export async function deleteAssignment(assignmentId: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('assignments')
    .delete()
    .eq('id', assignmentId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

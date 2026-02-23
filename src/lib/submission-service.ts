/**
 * ============================================
 * Submission Service - Student submissions & grading
 * ============================================
 * 
 * Handles the full submission → AI grading → lecturer review loop
 */

import { supabase } from './supabase';

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  content_text: string | null;
  file_url: string | null;
  ai_score: number | null;
  ai_feedback: string | null;
  manual_score: number | null;
  manual_feedback: string | null;
  status: 'pending' | 'graded' | 'reviewed';
  submitted_at: string;
  graded_at: string | null;
  reviewed_at: string | null;
  // From joins
  student_name?: string;
  student_email?: string;
  assignment_title?: string;
  course_title?: string;
  course_code?: string;
  course_id?: string;
  max_score?: number;
}

// ---- Student: Submit assignment ----
export async function submitAssignment(data: {
  assignment_id: string;
  content_text: string;
  file_url?: string | null;
}): Promise<{ success: boolean; submission?: Submission; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { data: submission, error } = await supabase
    .from('submissions')
    .insert({
      assignment_id: data.assignment_id,
      student_id: user.id,
      content_text: data.content_text,
      file_url: data.file_url || null,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') return { success: false, error: 'You already submitted this assignment' };
    return { success: false, error: error.message };
  }
  return { success: true, submission };
}

// ---- Student: Update submission with AI grade ----
export async function updateSubmissionWithAIGrade(
  submissionId: string,
  aiScore: number,
  aiFeedback: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('submissions')
    .update({
      ai_score: aiScore,
      ai_feedback: aiFeedback,
      status: 'graded',
      graded_at: new Date().toISOString(),
    })
    .eq('id', submissionId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ---- Student: Get my submission for an assignment ----
export async function getMySubmission(assignmentId: string): Promise<{ submission: Submission | null; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { submission: null, error: 'Not authenticated' };

  const { data: submission, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('assignment_id', assignmentId)
    .eq('student_id', user.id)
    .maybeSingle();

  if (error) return { submission: null, error: error.message };
  return { submission };
}

// ---- Student: Get all my submissions (for grades page) ----
export async function getMySubmissions(): Promise<{ submissions: Submission[]; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { submissions: [], error: 'Not authenticated' };

  const { data: submissions, error } = await supabase
    .from('submissions')
    .select('*, assignment:assignments(title, max_score, course_id, course:courses(title, course_code))')
    .eq('student_id', user.id)
    .order('submitted_at', { ascending: false });

  if (error) return { submissions: [], error: error.message };

  // Flatten joined data
  const flattened = (submissions || []).map(s => {
    const assignment = s.assignment as any;
    return {
      ...s,
      assignment_title: assignment?.title,
      max_score: assignment?.max_score,
      course_id: assignment?.course_id,
      course_title: assignment?.course?.title,
      course_code: assignment?.course?.course_code,
      assignment: undefined,
    };
  });

  return { submissions: flattened };
}

// ---- Lecturer: Get all submissions for an assignment ----
export async function getAssignmentSubmissions(assignmentId: string): Promise<{ submissions: Submission[]; error?: string }> {
  const { data: submissions, error } = await supabase
    .from('submissions')
    .select('*, student:profiles(full_name, email)')
    .eq('assignment_id', assignmentId)
    .order('submitted_at', { ascending: true });

  if (error) return { submissions: [], error: error.message };

  // Flatten student info
  const flattened = (submissions || []).map(s => {
    const student = s.student as any;
    return {
      ...s,
      student_name: student?.full_name || 'Unknown',
      student_email: student?.email,
      student: undefined,
    };
  });

  return { submissions: flattened };
}

// ---- Lecturer: Get ALL pending submissions across ALL their assignments ----
export async function getPendingSubmissions(): Promise<{ submissions: Submission[]; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { submissions: [], error: 'Not authenticated' };

  // Get all assignments by this lecturer, then all pending submissions
  const { data: submissions, error } = await supabase
    .from('submissions')
    .select(`
      *,
      student:profiles(full_name, email),
      assignment:assignments!inner(title, max_score, course_id, lecturer_id, course:courses(title, course_code))
    `)
    .eq('assignment.lecturer_id', user.id)
    .order('submitted_at', { ascending: true });

  if (error) return { submissions: [], error: error.message };

  // Flatten joined data
  const flattened = (submissions || []).map(s => {
    const student = s.student as any;
    const assignment = s.assignment as any;
    return {
      ...s,
      student_name: student?.full_name || 'Unknown',
      student_email: student?.email,
      assignment_title: assignment?.title,
      max_score: assignment?.max_score,
      course_id: assignment?.course_id,
      course_title: assignment?.course?.title,
      course_code: assignment?.course?.course_code,
      student: undefined,
      assignment: undefined,
    };
  });

  return { submissions: flattened };
}

// ---- Lecturer: Save manual grade (override AI) ----
export async function saveManualGrade(
  submissionId: string,
  manualScore: number,
  manualFeedback: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('submissions')
    .update({
      manual_score: manualScore,
      manual_feedback: manualFeedback,
      status: 'reviewed',
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', submissionId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ---- Get a single submission by ID ----
export async function getSubmission(submissionId: string): Promise<{ submission: Submission | null; error?: string }> {
  const { data: submission, error } = await supabase
    .from('submissions')
    .select('*, student:profiles(full_name, email)')
    .eq('id', submissionId)
    .single();

  if (error) return { submission: null, error: error.message };
  
  const student = (submission as any).student;
  return {
    submission: {
      ...submission,
      student_name: student?.full_name || 'Unknown',
      student_email: student?.email,
      student: undefined,
    } as Submission
  };
}

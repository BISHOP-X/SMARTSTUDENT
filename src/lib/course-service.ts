/**
 * ============================================
 * Course Service - CRUD operations for courses
 * ============================================
 */

import { supabase } from './supabase';

export interface Course {
  id: string;
  lecturer_id: string;
  title: string;
  course_code: string;
  description: string | null;
  semester: string;
  credits: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  // Computed fields from joins
  lecturer_name?: string;
  student_count?: number;
  assignment_count?: number;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_at: string;
  course?: Course;
}

// ---- LECTURER: Create a course ----
export async function createCourse(data: {
  title: string;
  course_code: string;
  description?: string;
  semester?: string;
  credits?: number;
}): Promise<{ success: boolean; course?: Course; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { data: course, error } = await supabase
    .from('courses')
    .insert({
      lecturer_id: user.id,
      title: data.title,
      course_code: data.course_code,
      description: data.description || null,
      semester: data.semester || 'Spring 2026',
      credits: data.credits || 3,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, course };
}

// ---- Get courses for current user ----
export async function getMyCourses(): Promise<{ courses: Course[]; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { courses: [], error: 'Not authenticated' };

  // Get user role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role === 'lecturer') {
    // Lecturers see courses they created
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .eq('lecturer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) return { courses: [], error: error.message };
    return { courses: courses || [] };
  } else {
    // Students see courses they're enrolled in
    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select('*, course:courses(*)')
      .eq('student_id', user.id);

    if (error) return { courses: [], error: error.message };
    const courses = enrollments?.map(e => e.course).filter(Boolean) as Course[] || [];
    return { courses };
  }
}

// ---- Get all available courses (for student enrollment) ----
export async function getAllCourses(): Promise<{ courses: Course[]; error?: string }> {
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return { courses: [], error: error.message };
  return { courses: courses || [] };
}

// ---- Get single course by ID ----
export async function getCourse(courseId: string): Promise<{ course: Course | null; error?: string }> {
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();

  if (error) return { course: null, error: error.message };
  return { course };
}

// ---- Enroll student in course ----
export async function enrollInCourse(courseId: string): Promise<{ success: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { error } = await supabase
    .from('enrollments')
    .insert({
      student_id: user.id,
      course_id: courseId,
    });

  if (error) {
    if (error.code === '23505') return { success: false, error: 'Already enrolled' };
    return { success: false, error: error.message };
  }
  return { success: true };
}

// ---- Get enrolled students for a course ----
export async function getCourseStudents(courseId: string): Promise<{ students: any[]; error?: string }> {
  const { data, error } = await supabase
    .from('enrollments')
    .select('student_id, enrolled_at, profile:profiles(full_name, email)')
    .eq('course_id', courseId);

  if (error) return { students: [], error: error.message };
  return { students: data || [] };
}

/**
 * ============================================
 * Supabase Database Types
 * ============================================
 * 
 * TypeScript types generated from the database schema.
 * These provide type safety when working with Supabase.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'student' | 'lecturer';
          avatar_url: string | null;
          phone: string | null;
          parent_phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: 'student' | 'lecturer';
          avatar_url?: string | null;
          phone?: string | null;
          parent_phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: 'student' | 'lecturer';
          avatar_url?: string | null;
          phone?: string | null;
          parent_phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      personal_goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: 'academic' | 'personal' | 'health' | 'career';
          target_date: string | null;
          status: 'not_started' | 'in_progress' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          category?: 'academic' | 'personal' | 'health' | 'career';
          target_date?: string | null;
          status?: 'not_started' | 'in_progress' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          category?: 'academic' | 'personal' | 'health' | 'career';
          target_date?: string | null;
          status?: 'not_started' | 'in_progress' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_grading_logs: {
        Row: {
          id: string;
          user_id: string | null;
          assignment_title: string;
          student_answer: string;
          rubric_context: string | null;
          ai_score: number | null;
          ai_feedback: string | null;
          model_used: string;
          processing_time_ms: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          assignment_title: string;
          student_answer: string;
          rubric_context?: string | null;
          ai_score?: number | null;
          ai_feedback?: string | null;
          model_used?: string;
          processing_time_ms?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          assignment_title?: string;
          student_answer?: string;
          rubric_context?: string | null;
          ai_score?: number | null;
          ai_feedback?: string | null;
          model_used?: string;
          processing_time_ms?: number | null;
          created_at?: string;
        };
      };
    };
    Functions: {
      // Add custom functions here if needed
    };
    Enums: {
      user_role: 'student' | 'lecturer';
      goal_category: 'academic' | 'personal' | 'health' | 'career';
      goal_status: 'not_started' | 'in_progress' | 'completed';
    };
  };
}

// Helper types for easier use
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type PersonalGoal = Database['public']['Tables']['personal_goals']['Row'];
export type PersonalGoalInsert = Database['public']['Tables']['personal_goals']['Insert'];
export type PersonalGoalUpdate = Database['public']['Tables']['personal_goals']['Update'];

export type AIGradingLog = Database['public']['Tables']['ai_grading_logs']['Row'];

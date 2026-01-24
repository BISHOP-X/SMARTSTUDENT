/**
 * ============================================
 * AI Service - Connects to Supabase Edge Functions
 * ============================================
 * 
 * This service handles all AI-related API calls to the
 * Supabase Edge Functions powered by Groq's free LLM.
 */

import { supabase } from './supabase';

// Types for Study Tools
export interface StudyToolSettings {
  // Notes settings
  format?: "bullet" | "paragraph" | "mindmap" | "cornell";
  detailLevel?: "concise" | "detailed" | "comprehensive";
  includeExamples?: boolean;
  
  // Summary settings
  length?: "brief" | "moderate" | "detailed";
  focusAreas?: string[];
  includeKeyTerms?: boolean;
  
  // Questions settings
  difficulty?: "easy" | "medium" | "hard" | "mixed";
  questionCount?: number;
  questionTypes?: string[];
  includeExplanations?: boolean;
}

export interface StudyToolResponse {
  success: boolean;
  type?: "notes" | "summary" | "questions";
  content?: string;
  error?: string;
}

// Types for Grading
export interface GradingRequest {
  assignmentTitle: string;
  assignmentContext: string;
  studentAnswer: string;
  maxScore: number;
}

export interface GradingResponse {
  score: number | null;
  feedback: string | null;
  processingTimeMs?: number;
  error?: string;
}

/**
 * Get the Supabase Edge Function URL
 */
const getEdgeFunctionUrl = (functionName: string): string => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xqdfhatvsiztgdretlyl.supabase.co';
  return `${supabaseUrl}/functions/v1/${functionName}`;
};

/**
 * Get the current user's access token for authentication
 */
const getAccessToken = async (): Promise<string> => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session?.access_token) {
    throw new Error('Not authenticated. Please log in to use AI features.');
  }
  return session.access_token;
};

/**
 * Generate study content (notes, summary, or questions) using AI
 * 
 * @param type - The type of content to generate
 * @param content - The source material text
 * @param settings - Generation settings
 */
export const generateStudyContent = async (
  type: "notes" | "summary" | "questions",
  content: string,
  settings: StudyToolSettings
): Promise<StudyToolResponse> => {
  try {
    const accessToken = await getAccessToken();
    
    const response = await fetch(getEdgeFunctionUrl('study-tools'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        type,
        content,
        settings,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Failed to generate ${type}`,
      };
    }

    return {
      success: true,
      type: data.type,
      content: data.content,
    };
  } catch (error) {
    console.error('AI generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

/**
 * Grade a student submission using AI
 * 
 * @param request - The grading request with assignment context and student answer
 */
export const gradeSubmission = async (request: GradingRequest): Promise<GradingResponse> => {
  try {
    const accessToken = await getAccessToken();
    
    const response = await fetch(getEdgeFunctionUrl('grade-submission'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        score: null,
        feedback: null,
        error: data.error || 'Failed to grade submission',
      };
    }

    return {
      score: data.score,
      feedback: data.feedback,
      processingTimeMs: data.processingTimeMs,
    };
  } catch (error) {
    console.error('Grading error:', error);
    return {
      score: null,
      feedback: null,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

/**
 * Check if user is authenticated and can use AI features
 */
export const canUseAI = async (): Promise<{ canUse: boolean; reason?: string }> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { 
      canUse: false, 
      reason: 'Please log in with a real account to use AI features. Demo mode uses simulated responses.' 
    };
  }
  
  return { canUse: true };
};

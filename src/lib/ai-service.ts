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

// No need for getEdgeFunctionUrl or getAccessToken - supabase.functions.invoke handles it all!

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
    // Check if user is authenticated first
    const { data: { session } } = await supabase.auth.getSession();
    console.log('[AI Service] Session check:', { 
      hasSession: !!session, 
      hasUser: !!session?.user,
      userId: session?.user?.id 
    });
    
    if (!session?.user) {
      return {
        success: false,
        error: 'You must be logged in to use AI features. Please log out of demo mode and create a real account.',
      };
    }
    
    console.log('[AI Service] Generating content...', { type, contentLength: content.length });
    
    // Use supabase.functions.invoke - auth is automatic!
    const { data, error } = await supabase.functions.invoke('study-tools', {
      body: {
        type,
        content,
        settings,
      },
    });

    if (error) {
      console.error('[AI Service] Function error:', error);
      
      // Extract detailed error message from response body
      let errorMessage = error.message;
      if (error.context?.body) {
        try {
          const errorBody = typeof error.context.body === 'string' 
            ? JSON.parse(error.context.body) 
            : error.context.body;
          if (errorBody?.error) errorMessage = errorBody.error;
        } catch { /* ignore */ }
      }
      
      return {
        success: false,
        error: errorMessage || `Failed to generate ${type}`,
      };
    }

    if (!data?.success) {
      return {
        success: false,
        error: data?.error || `Failed to generate ${type}`,
      };
    }

    console.log('[AI Service] Success:', { hasContent: !!data.content });

    return {
      success: true,
      type: data.type,
      content: data.content,
    };
  } catch (error) {
    console.error('[AI Service] Generation error:', error);
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

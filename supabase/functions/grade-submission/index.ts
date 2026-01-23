// ============================================
// AI Grading Edge Function
// Sends student submission to OpenAI for grading
// ============================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GradingRequest {
  assignmentTitle: string;
  assignmentContext: string; // The rubric/correct answer
  studentAnswer: string;
  maxScore: number;
}

interface GradingResponse {
  score: number;
  feedback: string;
  processingTimeMs: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    // Create Supabase client with user's auth
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // Parse the request body
    const { assignmentTitle, assignmentContext, studentAnswer, maxScore }: GradingRequest = await req.json();

    // Validate input
    if (!studentAnswer || !assignmentContext) {
      throw new Error("Missing required fields: studentAnswer and assignmentContext");
    }

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    // Create the grading prompt
    const systemPrompt = `You are an expert academic grader. Your task is to evaluate student submissions fairly and provide constructive feedback.

You will receive:
1. An assignment context/rubric describing what a good answer should include
2. A student's submitted answer

Evaluate the submission and respond with a JSON object containing:
- "score": A number from 0 to ${maxScore} representing the grade
- "feedback": A constructive feedback paragraph (2-3 sentences) explaining the score and how to improve

Be fair but rigorous. Acknowledge what the student did well, then explain what could be improved.`;

    const userPrompt = `## Assignment: ${assignmentTitle}

## Grading Rubric/Context:
${assignmentContext}

## Student's Answer:
${studentAnswer}

Please grade this submission and provide feedback in JSON format.`;

    // Call OpenAI API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3, // Lower temperature for more consistent grading
        max_tokens: 500,
        response_format: { type: "json_object" },
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error("OpenAI API error:", errorData);
      throw new Error("Failed to get AI grading response");
    }

    const aiData = await openaiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    
    // Parse the AI response
    let gradingResult;
    try {
      gradingResult = JSON.parse(aiContent);
    } catch {
      console.error("Failed to parse AI response:", aiContent);
      throw new Error("Invalid AI response format");
    }

    const processingTimeMs = Date.now() - startTime;

    // Ensure score is within bounds
    const score = Math.min(Math.max(0, gradingResult.score), maxScore);
    const feedback = gradingResult.feedback || "No feedback provided.";

    // Log the grading to database
    const { error: logError } = await supabaseClient
      .from("ai_grading_logs")
      .insert({
        user_id: user.id,
        assignment_title: assignmentTitle,
        student_answer: studentAnswer.substring(0, 5000), // Limit stored text
        rubric_context: assignmentContext.substring(0, 2000),
        ai_score: score,
        ai_feedback: feedback,
        model_used: "gpt-4o-mini",
        processing_time_ms: processingTimeMs,
      });

    if (logError) {
      console.error("Failed to log grading:", logError);
      // Don't fail the request, just log the error
    }

    // Return the grading result
    const response: GradingResponse = {
      score,
      feedback,
      processingTimeMs,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Grading error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred during grading",
        score: null,
        feedback: null,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: error.message === "Unauthorized" ? 401 : 500,
      }
    );
  }
});

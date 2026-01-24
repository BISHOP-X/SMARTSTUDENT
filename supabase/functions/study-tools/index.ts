// ============================================
// AI Study Tools Edge Function
// Generates notes, summaries, and questions using Groq (FREE LLM)
// ============================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type GenerationType = "notes" | "summary" | "questions";

interface StudyToolRequest {
  type: GenerationType;
  content: string; // The source material text
  settings: {
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
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header. Please log in." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with user's auth
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Try to verify user is authenticated (optional for now - allows demo mode)
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    // Log authentication attempt (for debugging)
    console.log("Auth attempt:", { hasUser: !!user, userError: userError?.message });

    // Parse the request body
    const { type, content, settings }: StudyToolRequest = await req.json();

    // Validate input
    if (!type || !content) {
      throw new Error("Missing required fields: type and content");
    }

    // Get Groq API key from environment (FREE LLM!)
    const groqApiKey = Deno.env.get("GROQ_API_KEY");
    if (!groqApiKey) {
      throw new Error("Groq API key not configured");
    }

    // Build the appropriate prompt based on type
    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "notes":
        systemPrompt = buildNotesPrompt(settings);
        userPrompt = `Generate study notes from the following content:\n\n${content}`;
        break;
      case "summary":
        systemPrompt = buildSummaryPrompt(settings);
        userPrompt = `Summarize the following content:\n\n${content}`;
        break;
      case "questions":
        systemPrompt = buildQuestionsPrompt(settings);
        userPrompt = `Generate practice questions from the following content:\n\n${content}`;
        break;
      default:
        throw new Error("Invalid generation type");
    }

    // Call Groq API (FREE and fast!)
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Free, fast, and capable
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text();
      console.error("Groq API error:", errorData);
      throw new Error("Failed to generate study content");
    }

    const aiData = await groqResponse.json();
    const generatedContent = aiData.choices[0].message.content;

    return new Response(
      JSON.stringify({ 
        success: true,
        type,
        content: generatedContent,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Study tools error:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "An error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: error.message === "Unauthorized" ? 401 : 500,
      }
    );
  }
});

// Helper functions to build prompts
function buildNotesPrompt(settings: StudyToolRequest["settings"]): string {
  const format = settings.format || "bullet";
  const detail = settings.detailLevel || "detailed";
  
  let formatInstructions = "";
  switch (format) {
    case "bullet":
      formatInstructions = "Use bullet points with proper indentation for sub-topics.";
      break;
    case "paragraph":
      formatInstructions = "Write in clear, organized paragraphs with topic sentences.";
      break;
    case "mindmap":
      formatInstructions = "Structure as a text-based mind map with main topics and branching subtopics.";
      break;
    case "cornell":
      formatInstructions = "Use Cornell note format with main notes, cues/questions in margins, and a summary section.";
      break;
  }

  return `You are an expert study assistant. Create ${detail} study notes from the provided content.
${formatInstructions}
${settings.includeExamples ? "Include relevant examples to illustrate key concepts." : ""}
Focus on the most important information that would help a student understand and remember the material.`;
}

function buildSummaryPrompt(settings: StudyToolRequest["settings"]): string {
  const length = settings.length || "moderate";
  const lengthGuide = {
    brief: "Keep the summary to 2-3 paragraphs maximum.",
    moderate: "Provide a comprehensive summary of 4-6 paragraphs.",
    detailed: "Create a thorough summary covering all major points in detail.",
  };

  const focusAreas = settings.focusAreas?.length 
    ? `Focus particularly on: ${settings.focusAreas.join(", ")}.` 
    : "";

  return `You are an expert at creating clear, informative summaries.
${lengthGuide[length]}
${focusAreas}
${settings.includeKeyTerms ? "Highlight and define key terms and concepts." : ""}
Write in clear, accessible language suitable for students.`;
}

function buildQuestionsPrompt(settings: StudyToolRequest["settings"]): string {
  const difficulty = settings.difficulty || "medium";
  const count = settings.questionCount || 10;
  const types = settings.questionTypes?.length 
    ? settings.questionTypes.join(", ") 
    : "multiple choice, true/false, short answer";

  return `You are an expert educator creating practice questions.
Generate exactly ${count} questions at ${difficulty} difficulty level.
Include these question types: ${types}.
${settings.includeExplanations ? "Provide explanations for the correct answers." : ""}

Format each question clearly with:
- Question number
- Question text
- Answer options (for multiple choice/true-false)
- Correct answer
${settings.includeExplanations ? "- Brief explanation" : ""}`;
}

/**
 * ============================================
 * Supabase Client Configuration
 * ============================================
 * 
 * This file creates and exports the Supabase client
 * for use throughout the application.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Environment variables for Supabase connection
// These should be set in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase credentials not found. Running in demo mode with mock data.\n' +
    'To enable real backend features, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

// Create the Supabase client
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return supabase !== null;
};

// Export types for use in components
export type { Database } from './database.types';

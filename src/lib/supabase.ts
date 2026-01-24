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

// Supabase connection credentials
// These are included directly for easy demo/evaluation purposes
// In production, you would use environment variables instead
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xqdfhatvsiztgdretlyl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_677MqU1hnBeYXNCH2gz66A_YV689T6q';

// Create the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return true; // Always configured with fallback values
};

// Export types for use in components
export type { Database } from './database.types';

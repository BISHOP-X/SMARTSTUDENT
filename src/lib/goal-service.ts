/**
 * ============================================
 * Goal Service - CRUD operations for personal goals
 * ============================================
 */

import { supabase } from './supabase';
import type { PersonalGoal } from '@/data/mockData';

// DB row shape
interface GoalRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  target_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

// Map DB row → app PersonalGoal
function toPersonalGoal(row: GoalRow): PersonalGoal {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description || undefined,
    eventDate: row.target_date
      ? new Date(row.target_date).toISOString()
      : new Date().toISOString(),
    status: row.status === 'done' ? 'done' : 'todo',
    category: (['study', 'personal', 'health', 'career', 'other'].includes(row.category)
      ? row.category
      : 'personal') as PersonalGoal['category'],
    createdAt: row.created_at,
  };
}

// ---- Fetch all goals for current user ----
export async function getMyGoals(): Promise<{ goals: PersonalGoal[]; error?: string }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { goals: [], error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('personal_goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return { goals: [], error: error.message };
  return { goals: (data || []).map(toPersonalGoal) };
}

// ---- Create a new goal ----
export async function createGoal(data: {
  title: string;
  description?: string;
  category: string;
  eventDate: string;
}): Promise<{ goal?: PersonalGoal; error?: string }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: row, error } = await supabase
    .from('personal_goals')
    .insert({
      user_id: user.id,
      title: data.title,
      description: data.description || null,
      category: data.category,
      target_date: data.eventDate ? data.eventDate.split('T')[0] : null,
      status: 'todo',
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { goal: toPersonalGoal(row) };
}

// ---- Update goal fields ----
export async function updateGoal(
  goalId: string,
  data: {
    title?: string;
    description?: string;
    category?: string;
    eventDate?: string;
    status?: string;
  }
): Promise<{ goal?: PersonalGoal; error?: string }> {
  const updates: Record<string, unknown> = {};
  if (data.title !== undefined) updates.title = data.title;
  if (data.description !== undefined) updates.description = data.description || null;
  if (data.category !== undefined) updates.category = data.category;
  if (data.eventDate !== undefined) updates.target_date = data.eventDate.split('T')[0];
  if (data.status !== undefined) updates.status = data.status;
  updates.updated_at = new Date().toISOString();

  const { data: row, error } = await supabase
    .from('personal_goals')
    .update(updates)
    .eq('id', goalId)
    .select()
    .single();

  if (error) return { error: error.message };
  return { goal: toPersonalGoal(row) };
}

// ---- Delete a goal ----
export async function deleteGoal(goalId: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('personal_goals').delete().eq('id', goalId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

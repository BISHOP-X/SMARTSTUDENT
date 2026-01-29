/**
 * ============================================
 * Calendar Service - User-specific calendar events
 * ============================================
 */

import { supabase } from './supabase';

export interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  event_date: string;
  event_type: 'goal' | 'assignment' | 'reminder';
  category: 'study' | 'health' | 'personal' | 'career' | 'other';
  status: 'todo' | 'in-progress' | 'completed' | 'overdue';
  course_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  event_date: Date;
  event_type?: 'goal' | 'assignment' | 'reminder';
  category?: 'study' | 'health' | 'personal' | 'career' | 'other';
  course_id?: string;
}

/**
 * Fetch all calendar events for the current user
 */
export const fetchUserCalendarEvents = async (): Promise<CalendarEvent[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.log('[Calendar] No user logged in');
    return [];
  }

  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', user.id)
    .order('event_date', { ascending: true });

  if (error) {
    console.error('[Calendar] Error fetching events:', error);
    return [];
  }

  return (data || []) as CalendarEvent[];
};

/**
 * Fetch events for a specific month
 */
export const fetchEventsForMonth = async (year: number, month: number): Promise<CalendarEvent[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59);

  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', user.id)
    .gte('event_date', startDate.toISOString())
    .lte('event_date', endDate.toISOString())
    .order('event_date', { ascending: true });

  if (error) {
    console.error('[Calendar] Error fetching monthly events:', error);
    return [];
  }

  return (data || []) as CalendarEvent[];
};

/**
 * Create a new calendar event
 */
export const createCalendarEvent = async (input: CreateEventInput): Promise<CalendarEvent | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('[Calendar] Cannot create event: No user logged in');
    return null;
  }

  const { data, error } = await supabase
    .from('calendar_events')
    .insert({
      user_id: user.id,
      title: input.title,
      description: input.description || null,
      event_date: input.event_date.toISOString(),
      event_type: input.event_type || 'goal',
      category: input.category || 'other',
      status: 'todo',
      course_id: input.course_id || null,
    })
    .select()
    .single();

  if (error) {
    console.error('[Calendar] Error creating event:', error);
    return null;
  }

  return data as CalendarEvent;
};

/**
 * Update a calendar event
 */
export const updateCalendarEvent = async (
  id: string, 
  updates: Partial<Omit<CalendarEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<CalendarEvent | null> => {
  const { data, error } = await supabase
    .from('calendar_events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[Calendar] Error updating event:', error);
    return null;
  }

  return data as CalendarEvent;
};

/**
 * Delete a calendar event
 */
export const deleteCalendarEvent = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('calendar_events')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[Calendar] Error deleting event:', error);
    return false;
  }

  return true;
};

/**
 * Mark an event as completed
 */
export const completeCalendarEvent = async (id: string): Promise<CalendarEvent | null> => {
  return updateCalendarEvent(id, { status: 'completed' });
};

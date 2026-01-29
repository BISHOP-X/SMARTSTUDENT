-- ============================================
-- EduSync Calendar Events Schema
-- ============================================
-- This migration adds user-specific calendar events

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  event_type TEXT DEFAULT 'goal' CHECK (event_type IN ('goal', 'assignment', 'reminder')),
  category TEXT DEFAULT 'other' CHECK (category IN ('study', 'health', 'personal', 'career', 'other')),
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'completed', 'overdue')),
  course_id TEXT, -- Optional: link to a course
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Users can only see their own events
CREATE POLICY "Users can view own events"
  ON public.calendar_events FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own events
CREATE POLICY "Users can insert own events"
  ON public.calendar_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own events
CREATE POLICY "Users can update own events"
  ON public.calendar_events FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own events
CREATE POLICY "Users can delete own events"
  ON public.calendar_events FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_calendar_events_user_date 
  ON public.calendar_events(user_id, event_date);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_calendar_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calendar_events_updated_at
  BEFORE UPDATE ON public.calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_calendar_events_updated_at();

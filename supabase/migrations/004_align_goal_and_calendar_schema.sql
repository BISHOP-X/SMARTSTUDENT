-- ============================================
-- Align goal and calendar schemas with app usage
-- ============================================

BEGIN;

-- -------------------------------------------------------------------------
-- calendar_events: align production schema with app expectations
-- -------------------------------------------------------------------------
ALTER TABLE public.calendar_events
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT,
  ADD COLUMN IF NOT EXISTS course_id TEXT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'calendar_events'
      AND column_name = 'event_date'
      AND data_type = 'date'
  ) THEN
    ALTER TABLE public.calendar_events
      ALTER COLUMN event_date TYPE TIMESTAMPTZ
      USING CASE
        WHEN event_time IS NOT NULL THEN event_date::timestamp + event_time
        ELSE event_date::timestamp
      END;
  END IF;
END $$;

UPDATE public.calendar_events
SET
  category = COALESCE(NULLIF(category, ''), 'other'),
  status = COALESCE(NULLIF(status, ''), CASE WHEN COALESCE(completed, false) THEN 'completed' ELSE 'todo' END);

ALTER TABLE public.calendar_events
  ALTER COLUMN category SET DEFAULT 'other',
  ALTER COLUMN category SET NOT NULL,
  ALTER COLUMN status SET DEFAULT 'todo',
  ALTER COLUMN status SET NOT NULL,
  ALTER COLUMN event_type SET DEFAULT 'goal';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'calendar_events_event_type_check'
  ) THEN
    ALTER TABLE public.calendar_events
      ADD CONSTRAINT calendar_events_event_type_check
      CHECK (event_type IN ('goal', 'assignment', 'reminder'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'calendar_events_category_check'
  ) THEN
    ALTER TABLE public.calendar_events
      ADD CONSTRAINT calendar_events_category_check
      CHECK (category IN ('study', 'health', 'personal', 'career', 'other'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'calendar_events_status_check'
  ) THEN
    ALTER TABLE public.calendar_events
      ADD CONSTRAINT calendar_events_status_check
      CHECK (status IN ('todo', 'in-progress', 'completed', 'overdue'));
  END IF;
END $$;

-- -------------------------------------------------------------------------
-- personal_goals: align goal categories with app values
-- -------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'personal_goals_category_check'
  ) THEN
    ALTER TABLE public.personal_goals DROP CONSTRAINT personal_goals_category_check;
  END IF;
END $$;

UPDATE public.personal_goals
SET category = CASE
  WHEN category = 'academic' THEN 'study'
  WHEN category IN ('study', 'personal', 'health', 'career', 'other') THEN category
  ELSE 'other'
END;

ALTER TABLE public.personal_goals
  ALTER COLUMN category SET DEFAULT 'personal';

ALTER TABLE public.personal_goals
  ADD CONSTRAINT personal_goals_category_check
  CHECK (category IN ('study', 'personal', 'health', 'career', 'other'));

COMMIT;

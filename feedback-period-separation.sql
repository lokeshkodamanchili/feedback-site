-- Run in the Supabase SQL Editor. Existing rows are preserved as previous.
ALTER TABLE public.feedbacks ADD COLUMN IF NOT EXISTS feedback_period text;
UPDATE public.feedbacks SET feedback_period='previous' WHERE feedback_period IS NULL;
ALTER TABLE public.feedbacks ALTER COLUMN feedback_period SET DEFAULT 'new';
ALTER TABLE public.feedbacks ALTER COLUMN feedback_period SET NOT NULL;
DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='feedbacks_feedback_period_check' AND conrelid='public.feedbacks'::regclass) THEN
  ALTER TABLE public.feedbacks ADD CONSTRAINT feedbacks_feedback_period_check CHECK (feedback_period IN ('previous','new'));
 END IF;
END $$;

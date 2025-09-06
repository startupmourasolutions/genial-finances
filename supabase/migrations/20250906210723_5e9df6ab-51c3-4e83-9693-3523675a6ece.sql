-- Add recurrence fields to debts to support new UI
ALTER TABLE public.debts
  ADD COLUMN IF NOT EXISTS is_recurring boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS installments integer,
  ADD COLUMN IF NOT EXISTS end_date date;

-- Optional: comment for documentation
COMMENT ON COLUMN public.debts.is_recurring IS 'Indicates if the debt recurs indefinitely (true) or has a fixed number of installments (false)';
COMMENT ON COLUMN public.debts.installments IS 'Number of installments when not recurring';
COMMENT ON COLUMN public.debts.end_date IS 'End date for fixed-duration debts (derived from first due_date + duration)';
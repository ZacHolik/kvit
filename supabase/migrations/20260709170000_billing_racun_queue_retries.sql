-- Retry tracking + terminal failure status for billing_racun_queue
ALTER TABLE public.billing_racun_queue
  ADD COLUMN IF NOT EXISTS attempt_count INT NOT NULL DEFAULT 0;

ALTER TABLE public.billing_racun_queue
  DROP CONSTRAINT IF EXISTS billing_racun_queue_status_check;

ALTER TABLE public.billing_racun_queue
  ADD CONSTRAINT billing_racun_queue_status_check
  CHECK (status IN ('pending', 'completed', 'failed', 'permanently_failed'));

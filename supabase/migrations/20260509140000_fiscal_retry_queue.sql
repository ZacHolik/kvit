-- Redoslijed za ponovni pokušaj fiskalizacije (CIS timeout / greška), do 48h
CREATE TABLE IF NOT EXISTS public.fiscal_retry_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  racun_id UUID NOT NULL REFERENCES public.racuni (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  attempt_count INT NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  max_attempts INT NOT NULL DEFAULT 10,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'success', 'failed', 'expired')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '48 hours')
);

CREATE INDEX IF NOT EXISTS fiscal_retry_queue_user_status_next_idx
  ON public.fiscal_retry_queue (user_id, status, next_attempt_at);

ALTER TABLE public.fiscal_retry_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own retry queue"
  ON public.fiscal_retry_queue
  FOR ALL
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.fiscal_retry_queue IS
  'CIS fiscalization retries with exponential backoff; expires after 48h.';

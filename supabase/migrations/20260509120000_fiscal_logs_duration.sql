-- Trajanje CIS HTTP poziva (ms) za debugging i SLA praćenje
ALTER TABLE public.fiscal_logs
ADD COLUMN IF NOT EXISTS duration_ms INTEGER;

COMMENT ON COLUMN public.fiscal_logs.duration_ms IS
  'Round-trip time in milliseconds for the CIS HTTP request.';

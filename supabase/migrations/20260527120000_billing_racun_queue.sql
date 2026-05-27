-- Async obrada Stripe invoice.payment_succeeded (račun + PDF + email)
CREATE TABLE IF NOT EXISTS public.billing_racun_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  stripe_invoice_id TEXT NOT NULL UNIQUE,
  amount_eur NUMERIC(10, 2) NOT NULL,
  interval TEXT CHECK (interval IN ('month', 'year')),
  datum_iso TEXT NOT NULL,
  customer_email TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS billing_racun_queue_status_created_idx
  ON public.billing_racun_queue (status, created_at);

ALTER TABLE public.billing_racun_queue ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.billing_racun_queue IS
  'Background jobs: Kvik pretplatnički račun, PDF i potvrda plaćanja nakon Stripe webhooka.';

-- ─────────────────────────────────────────────────────────────────────────────
-- Stripe subscription podaci po korisniku
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.subscriptions (
  id                    UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               UUID         REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id    TEXT         UNIQUE,
  stripe_subscription_id TEXT        UNIQUE,
  stripe_price_id       TEXT,
  plan                  TEXT         NOT NULL DEFAULT 'free'
    CHECK (plan IN ('free', 'pausalist', 'pro')),
  interval              TEXT
    CHECK (interval IN ('month', 'year')),
  status                TEXT         NOT NULL DEFAULT 'inactive'
    CHECK (status IN ('active', 'inactive', 'past_due', 'canceled', 'trialing')),
  current_period_start  TIMESTAMPTZ,
  current_period_end    TIMESTAMPTZ,
  cancel_at_period_end  BOOLEAN      DEFAULT false,
  canceled_at           TIMESTAMPTZ,
  trial_end             TIMESTAMPTZ,
  created_at            TIMESTAMPTZ  DEFAULT NOW(),
  updated_at            TIMESTAMPTZ  DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Svaki korisnik može čitati/mijenjati samo svoju pretplatu.
-- Webhook (service_role) pišu bez ograničenja.
CREATE POLICY "Korisnik vidi samo svoju pretplatu"
  ON public.subscriptions FOR ALL
  USING (auth.uid() = user_id);

-- Automatski updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
  RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Index za brzo traženje po Stripe ID-jevima (webhook lookups)
CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_id_idx
  ON public.subscriptions (stripe_customer_id);

CREATE INDEX IF NOT EXISTS subscriptions_stripe_subscription_id_idx
  ON public.subscriptions (stripe_subscription_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Billing history — svaka naplata, povrat ili neuspjeh
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.billing_events (
  id                        UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                   UUID         REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_invoice_id         TEXT         UNIQUE,
  stripe_payment_intent_id  TEXT,
  amount_eur                NUMERIC(10,2) NOT NULL,
  interval                  TEXT
    CHECK (interval IN ('month', 'year')),
  status                    TEXT         NOT NULL
    CHECK (status IN ('paid', 'failed', 'refunded', 'pending')),
  -- FK na Kvikov R1 račun vezan uz ovu naplatu (null dok se ne izda)
  invoice_id                UUID         REFERENCES public.racuni(id) ON DELETE SET NULL,
  pdf_url                   TEXT,
  created_at                TIMESTAMPTZ  DEFAULT NOW()
);

ALTER TABLE public.billing_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Korisnik vidi samo svoje billing događaje"
  ON public.billing_events FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS billing_events_user_id_idx
  ON public.billing_events (user_id);

CREATE INDEX IF NOT EXISTS billing_events_stripe_invoice_id_idx
  ON public.billing_events (stripe_invoice_id);

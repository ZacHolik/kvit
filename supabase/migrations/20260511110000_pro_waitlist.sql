CREATE TABLE public.pro_waitlist (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT        NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bez RLS-a — samo service_role piše, nema javnih SELECT-ova.
-- Ako zatreba admin pregled: ALTER TABLE pro_waitlist ENABLE ROW LEVEL SECURITY;

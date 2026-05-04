-- FINA certifikati (fiskalizacija 1.0) + CIS logovi
CREATE TABLE public.fiscal_certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  encrypted_p12 TEXT NOT NULL,
  iv TEXT NOT NULL,
  salt TEXT NOT NULL,
  fina_oib VARCHAR(11) NOT NULL,
  poslovni_prostor VARCHAR(20) NOT NULL,
  blagajna VARCHAR(20) NOT NULL,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.fiscal_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Korisnik vidi samo svoje certifikate"
  ON public.fiscal_certificates
  FOR ALL
  USING (auth.uid() = user_id);

CREATE TABLE public.fiscal_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  racun_id UUID REFERENCES public.racuni (id) ON DELETE SET NULL,
  zki VARCHAR(32),
  jir VARCHAR(36),
  cis_request TEXT,
  cis_response TEXT,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.fiscal_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Korisnik vidi samo svoje logove"
  ON public.fiscal_logs
  FOR ALL
  USING (auth.uid() = user_id);

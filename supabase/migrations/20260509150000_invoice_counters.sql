-- Atomski brojač računa po (korisnik, PP, NU, godina) za fiskalizaciju
CREATE TABLE IF NOT EXISTS public.invoice_counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  poslovni_prostor TEXT NOT NULL,
  blagajna TEXT NOT NULL,
  godina INT NOT NULL,
  zadnji_broj INT NOT NULL DEFAULT 0,
  UNIQUE (user_id, poslovni_prostor, blagajna, godina)
);

CREATE INDEX IF NOT EXISTS invoice_counters_user_idx ON public.invoice_counters (user_id);

ALTER TABLE public.invoice_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own invoice counters"
  ON public.invoice_counters
  FOR ALL
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.bump_invoice_counter(
  p_user_id UUID,
  p_poslovni_prostor TEXT,
  p_blagajna TEXT,
  p_godina INT
) RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v INT;
BEGIN
  IF p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  INSERT INTO public.invoice_counters (user_id, poslovni_prostor, blagajna, godina, zadnji_broj)
  VALUES (p_user_id, p_poslovni_prostor, p_blagajna, p_godina, 1)
  ON CONFLICT (user_id, poslovni_prostor, blagajna, godina)
  DO UPDATE SET zadnji_broj = public.invoice_counters.zadnji_broj + 1
  RETURNING zadnji_broj INTO v;

  RETURN v;
END;
$$;

REVOKE ALL ON FUNCTION public.bump_invoice_counter (uuid, text, text, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.bump_invoice_counter (uuid, text, text, int) TO authenticated;

COMMENT ON FUNCTION public.bump_invoice_counter IS
  'Returns next sequential invoice number for (user, PP, cash desk, year); increments atomically.';

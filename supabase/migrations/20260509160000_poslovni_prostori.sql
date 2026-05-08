-- Poslovni prostori i naplatni uređaji (tablice + RLS; seed iz aktivnog certifikata)
CREATE TABLE IF NOT EXISTS public.poslovni_prostori (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  oznaka TEXT NOT NULL,
  adresa TEXT,
  radno_vrijeme TEXT,
  datum_primjene DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, oznaka)
);

CREATE TABLE IF NOT EXISTS public.naplatni_uredaji (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poslovni_prostor_id UUID NOT NULL REFERENCES public.poslovni_prostori (id) ON DELETE CASCADE,
  oznaka TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (poslovni_prostor_id, oznaka)
);

CREATE INDEX IF NOT EXISTS poslovni_prostori_user_idx ON public.poslovni_prostori (user_id);
CREATE INDEX IF NOT EXISTS naplatni_uredaji_pp_idx ON public.naplatni_uredaji (poslovni_prostor_id);

ALTER TABLE public.poslovni_prostori ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.naplatni_uredaji ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own poslovni_prostori"
  ON public.poslovni_prostori FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own naplatni_uredaji"
  ON public.naplatni_uredaji FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.poslovni_prostori pp
      WHERE pp.id = naplatni_uredaji.poslovni_prostor_id AND pp.user_id = auth.uid()
    )
  );

INSERT INTO public.poslovni_prostori (user_id, oznaka, is_active)
SELECT DISTINCT fc.user_id, trim(fc.poslovni_prostor), TRUE
FROM public.fiscal_certificates fc
WHERE fc.is_active = TRUE
  AND trim(fc.poslovni_prostor) <> ''
ON CONFLICT (user_id, oznaka) DO NOTHING;

INSERT INTO public.naplatni_uredaji (poslovni_prostor_id, oznaka, is_active)
SELECT p.id, trim(fc.blagajna), TRUE
FROM public.fiscal_certificates fc
JOIN public.poslovni_prostori p ON p.user_id = fc.user_id AND p.oznaka = trim(fc.poslovni_prostor)
WHERE fc.is_active = TRUE
  AND trim(fc.blagajna) <> ''
ON CONFLICT (poslovni_prostor_id, oznaka) DO NOTHING;

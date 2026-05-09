-- Storno kao novi račun (negativni iznosi) + referenca na izvornik za CIS / PDF.
ALTER TABLE public.racuni
  ADD COLUMN IF NOT EXISTS storniran_od UUID REFERENCES public.racuni (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS tip_dokumenta TEXT NOT NULL DEFAULT 'racun';

ALTER TABLE public.racuni
  DROP CONSTRAINT IF EXISTS racuni_tip_dokumenta_check;

ALTER TABLE public.racuni
  ADD CONSTRAINT racuni_tip_dokumenta_check
  CHECK (tip_dokumenta IN ('racun', 'storno'));

COMMENT ON COLUMN public.racuni.storniran_od IS
  'Za tip_dokumenta=storno: UUID izvornog računa koji se stornira (JIR ostaje na originalu).';

COMMENT ON COLUMN public.racuni.tip_dokumenta IS
  'racun = obični račun; storno = knjižni storno (negativni iznosi, vlastiti JIR/ZKI na CIS-u).';

CREATE INDEX IF NOT EXISTS idx_racuni_storno_ref
  ON public.racuni (storniran_od)
  WHERE storniran_od IS NOT NULL;

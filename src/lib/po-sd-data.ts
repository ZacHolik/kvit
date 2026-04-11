import type { SupabaseClient } from '@supabase/supabase-js';

/** KPR godina za PO-SD (URL ?year=) — ista logika na stranici i u PDF ruti. */
export function normalizePoSdGodina(raw: string | null | undefined): number {
  const trenutna = new Date().getFullYear();
  const defaultGodina = trenutna - 1;
  if (raw == null || raw === '') {
    return defaultGodina;
  }
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed < 2000 || parsed > 2100) {
    return defaultGodina;
  }
  return parsed;
}

export type KprGodisnjiZbroj = {
  gotovina: number;
  bezgotovinsko: number;
  ukupno: number;
};

export async function zbrojiKprZaGodinu(
  supabase: SupabaseClient,
  userId: string,
  godina: number,
): Promise<KprGodisnjiZbroj> {
  const od = `${godina}-01-01`;
  const doDatuma = `${godina}-12-31`;

  const { data: redovi } = await supabase
    .from('kpr_unosi')
    .select('iznos_gotovina, iznos_bezgotovinsko, ukupno')
    .eq('user_id', userId)
    .gte('datum', od)
    .lte('datum', doDatuma);

  return (redovi ?? []).reduce<KprGodisnjiZbroj>(
    (acc, red) => ({
      gotovina: acc.gotovina + Number(red.iznos_gotovina ?? 0),
      bezgotovinsko: acc.bezgotovinsko + Number(red.iznos_bezgotovinsko ?? 0),
      ukupno: acc.ukupno + Number(red.ukupno ?? 0),
    }),
    { gotovina: 0, bezgotovinsko: 0, ukupno: 0 },
  );
}

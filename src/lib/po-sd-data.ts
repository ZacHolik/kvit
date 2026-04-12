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

export type PoSdPrimiciResolved = {
  zbroj: KprGodisnjiZbroj;
  izvorOnboardinga: boolean;
};

/**
 * Za prošlu kalendarsku godinu, ako KPR još nema unosa, koristi ručni zbroj
 * iz onboardinga (`profiles.godisnji_primici_prosle_godine`).
 */
export function applyPoSdOnboardingPrimici(
  godina: number,
  kprZbroj: KprGodisnjiZbroj,
  godisnjiPrimiciProsleGodine: number | null | undefined,
): PoSdPrimiciResolved {
  const proslogodisnja = new Date().getFullYear() - 1;
  if (godina !== proslogodisnja || kprZbroj.ukupno !== 0) {
    return { zbroj: kprZbroj, izvorOnboardinga: false };
  }
  const v = Number(godisnjiPrimiciProsleGodine ?? 0);
  if (!Number.isFinite(v) || v <= 0) {
    return { zbroj: kprZbroj, izvorOnboardinga: false };
  }
  return {
    zbroj: { gotovina: 0, bezgotovinsko: v, ukupno: v },
    izvorOnboardinga: true,
  };
}

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

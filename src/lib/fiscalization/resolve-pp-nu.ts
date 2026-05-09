import type { SupabaseClient } from '@supabase/supabase-js';

export type ResolvedPpNu = { poslovniProstor: string; blagajna: string };

/**
 * PP/NU za brojač i ZKI: prvo aktivni zapis u tablicama, inače stringovi s certifikata.
 */
export async function resolvePpNuForFiscal(
  supabase: SupabaseClient,
  userId: string,
  certFallback: { poslovni_prostor: string; blagajna: string } | null,
): Promise<ResolvedPpNu | { error: string }> {
  const { data: pps } = await supabase
    .from('poslovni_prostori')
    .select('id, oznaka')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (pps?.length) {
    const certPp = certFallback?.poslovni_prostor?.trim();
    const ppRow =
      certPp && pps.some((p) => p.oznaka === certPp)
        ? pps.find((p) => p.oznaka === certPp)!
        : pps[0];

    const { data: nus } = await supabase
      .from('naplatni_uredaji')
      .select('oznaka')
      .eq('poslovni_prostor_id', ppRow.id)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (nus?.length) {
      const certNu = certFallback?.blagajna?.trim();
      const nuRow =
        certNu && nus.some((n) => n.oznaka === certNu)
          ? nus.find((n) => n.oznaka === certNu)!
          : nus[0];
      return {
        poslovniProstor: String(ppRow.oznaka).trim(),
        blagajna: String(nuRow.oznaka).trim(),
      };
    }
  }

  const fp = certFallback?.poslovni_prostor?.trim() ?? '';
  const fn = certFallback?.blagajna?.trim() ?? '';
  if (fp && fn) {
    return { poslovniProstor: fp, blagajna: fn };
  }

  return { error: 'Dodajte poslovni prostor u postavkama.' };
}

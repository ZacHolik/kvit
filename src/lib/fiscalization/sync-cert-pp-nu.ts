import type { SupabaseClient } from '@supabase/supabase-js';

/** Nakon spremanja certifikata — PP/NU i u tablicama (backward + CRUD). */
export async function syncCertPpNuToTables(
  supabase: SupabaseClient,
  userId: string,
  ppOznaka: string,
  nuOznaka: string,
): Promise<void> {
  const pp = ppOznaka.trim();
  const nu = nuOznaka.trim();
  if (!pp || !nu) {
    return;
  }

  const { data: existingPp } = await supabase
    .from('poslovni_prostori')
    .select('id')
    .eq('user_id', userId)
    .eq('oznaka', pp)
    .maybeSingle();

  let ppId: string;
  if (existingPp?.id) {
    ppId = existingPp.id as string;
    await supabase.from('poslovni_prostori').update({ is_active: true }).eq('id', ppId);
  } else {
    const { data: ins, error } = await supabase
      .from('poslovni_prostori')
      .insert({ user_id: userId, oznaka: pp, is_active: true })
      .select('id')
      .single();
    if (error || !ins) {
      return;
    }
    ppId = ins.id as string;
  }

  const { data: existingNu } = await supabase
    .from('naplatni_uredaji')
    .select('id')
    .eq('poslovni_prostor_id', ppId)
    .eq('oznaka', nu)
    .maybeSingle();

  if (existingNu?.id) {
    await supabase
      .from('naplatni_uredaji')
      .update({ is_active: true })
      .eq('id', existingNu.id as string);
  } else {
    await supabase.from('naplatni_uredaji').insert({
      poslovni_prostor_id: ppId,
      oznaka: nu,
      is_active: true,
    });
  }
}

import type { SupabaseClient } from '@supabase/supabase-js';

import { fiscalizeRacunWithClient } from './fiscalize';

const BACKOFF_MS = [
  5 * 60 * 1000,
  15 * 60 * 1000,
  30 * 60 * 1000,
  60 * 60 * 1000,
  2 * 60 * 60 * 1000,
  4 * 60 * 60 * 1000,
];

export function backoffMsForAttempt(attemptCountAfterFailure: number): number {
  const i = Math.min(
    Math.max(attemptCountAfterFailure - 1, 0),
    BACKOFF_MS.length - 1,
  );
  return BACKOFF_MS[i] ?? BACKOFF_MS[BACKOFF_MS.length - 1];
}

async function markQueueSuccess(
  supabase: SupabaseClient,
  racunId: string,
): Promise<void> {
  await supabase
    .from('fiscal_retry_queue')
    .update({ status: 'success', last_attempt_at: new Date().toISOString() })
    .eq('racun_id', racunId)
    .eq('status', 'pending');
}

/**
 * Ponovni pokušaj fiskalizacije za jedan red u redu (RLS ili service role klijent).
 */
export async function processFiscalRetryJob(
  supabase: SupabaseClient,
  jobId: string,
  userId: string,
): Promise<{ ok: boolean; message: string }> {
  const { data: job, error: jobErr } = await supabase
    .from('fiscal_retry_queue')
    .select('id, racun_id, attempt_count, max_attempts, expires_at, status')
    .eq('id', jobId)
    .eq('user_id', userId)
    .maybeSingle();

  if (jobErr || !job || job.status !== 'pending') {
    return { ok: false, message: 'Zadatak nije pronađen.' };
  }

  const now = new Date();
  if (new Date(job.expires_at as string) < now) {
    await supabase
      .from('fiscal_retry_queue')
      .update({ status: 'expired', last_attempt_at: now.toISOString() })
      .eq('id', job.id);
    return { ok: false, message: 'Zadatak je istekao (48h).' };
  }

  const { data: profil } = await supabase
    .from('profiles')
    .select('oib')
    .eq('id', userId)
    .maybeSingle();
  const oib = profil?.oib?.trim() ?? '';
  if (!oib) {
    return { ok: false, message: 'OIB profila nedostaje.' };
  }

  const { data: racun } = await supabase
    .from('racuni')
    .select('id, broj_racuna, ukupni_iznos, nacin_placanja, datum, jir')
    .eq('id', job.racun_id)
    .eq('user_id', userId)
    .maybeSingle();

  if (!racun) {
    return { ok: false, message: 'Račun nije pronađen.' };
  }
  if (racun.jir) {
    await markQueueSuccess(supabase, racun.id);
    return { ok: true, message: 'Račun je već fiskaliziran.' };
  }

  const result = await fiscalizeRacunWithClient(supabase, {
    racunId: racun.id,
    userId,
    oib,
    brojRacuna: racun.broj_racuna,
    ukupniIznos: Number(racun.ukupni_iznos),
    nacinPlacanja: racun.nacin_placanja as 'gotovina' | 'ziro' | 'kartica',
    datum: racun.datum ? new Date(racun.datum as string) : undefined,
  });

  const attempt = Number(job.attempt_count) + 1;
  const maxAttempts = Number(job.max_attempts) || 10;

  if (result.success && result.zki && result.jir) {
    await supabase
      .from('racuni')
      .update({
        zki: result.zki,
        jir: result.jir,
        fiskalizirano_at: new Date().toISOString(),
        fiskalizacija_error: null,
      })
      .eq('id', racun.id)
      .eq('user_id', userId);
    await markQueueSuccess(supabase, racun.id);
    return { ok: true, message: 'Fiskalizacija uspjela.' };
  }

  const errMsg = result.error ?? 'CIS greška';
  if (attempt >= maxAttempts) {
    await supabase
      .from('fiscal_retry_queue')
      .update({
        attempt_count: attempt,
        last_attempt_at: now.toISOString(),
        status: 'failed',
        error_message: errMsg,
      })
      .eq('id', job.id);
    return { ok: false, message: errMsg };
  }

  const nextAt = new Date(Date.now() + backoffMsForAttempt(attempt)).toISOString();
  await supabase
    .from('fiscal_retry_queue')
    .update({
      attempt_count: attempt,
      last_attempt_at: now.toISOString(),
      next_attempt_at: nextAt,
      error_message: errMsg,
    })
    .eq('id', job.id);

  return { ok: false, message: errMsg };
}

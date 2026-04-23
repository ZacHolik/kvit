import type { SupabaseClient } from '@supabase/supabase-js';

const WINDOW_MS = 60 * 60 * 1000;
export const REGISTRATION_ATTEMPTS_PER_HOUR = 3;

export async function countRegistrationAttemptsInWindow(
  admin: SupabaseClient,
  ip: string,
): Promise<number | null> {
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  const { count, error } = await admin
    .from('registration_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('created_at', since);

  if (error) {
    console.error('[registration_rate_limit] count failed', error.message);
    return null;
  }
  return count ?? 0;
}

export async function recordRegistrationAttempt(
  admin: SupabaseClient,
  ip: string,
): Promise<boolean> {
  const { error } = await admin.from('registration_attempts').insert({ ip });
  if (error) {
    console.error('[registration_rate_limit] insert failed', error.message);
    return false;
  }
  return true;
}

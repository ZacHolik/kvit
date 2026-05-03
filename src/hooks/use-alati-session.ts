'use client';

import { useCallback, useEffect, useState } from 'react';

import { createClient } from '@/lib/supabase/client';

export type AlatiProfile = {
  oib: string;
  naziv_obrta: string;
  adresa: string | null;
  opcina: string | null;
};

export type AlatiSessionState =
  | { status: 'loading' }
  | {
      status: 'guest';
    }
  | {
      status: 'signed_in';
      userId: string;
      isPro: boolean;
      profile: AlatiProfile | null;
    };

export function useAlatiSession(): AlatiSessionState {
  const [state, setState] = useState<AlatiSessionState>({ status: 'loading' });

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setState({ status: 'guest' });
      return;
    }

    const { data: profil, error } = await supabase
      .from('profiles')
      .select('oib, naziv_obrta, adresa, opcina, kvit_plan, pro_expires_at')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('useAlatiSession profile', error);
    }

    const row = profil as {
      oib?: string | null;
      naziv_obrta?: string | null;
      adresa?: string | null;
      opcina?: string | null;
      kvit_plan?: string | null;
      pro_expires_at?: string | null;
    } | null;

    const proUntil = row?.pro_expires_at ? new Date(row.pro_expires_at) : null;
    const trialActive = proUntil != null && !Number.isNaN(proUntil.getTime()) && proUntil > new Date();

    setState({
      status: 'signed_in',
      userId: user.id,
      isPro: row?.kvit_plan === 'pro' || trialActive,
      profile: row
        ? {
            oib: row.oib?.trim() ?? '',
            naziv_obrta: row.naziv_obrta?.trim() ?? '',
            adresa: row.adresa?.trim() ?? null,
            opcina: row.opcina?.trim() ?? null,
          }
        : null,
    });
  }, []);

  useEffect(() => {
    void refresh();
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void refresh();
    });
    return () => subscription.unsubscribe();
  }, [refresh]);

  return state;
}

export function useKprYearTotal(enabled: boolean) {
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!enabled) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/alati/kpr-year', { credentials: 'same-origin' });
      const body = (await res.json()) as { year?: number; total?: number; error?: string };
      if (!res.ok) {
        setError(body.error ?? 'Greška pri učitavanju KPR-a.');
        setTotal(null);
        setYear(null);
        return;
      }
      setYear(body.year ?? new Date().getFullYear());
      setTotal(typeof body.total === 'number' ? body.total : null);
    } catch (e) {
      console.error(e);
      setError('Mrežna greška.');
      setTotal(null);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { loading, year, total, error, reload };
}

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

import { InvoiceList, type InvoiceRow } from './invoice-list';

export default async function RacuniPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [{ data: racuni }, { data: profil }, { data: retryRows }] = await Promise.all([
    supabase
      .from('racuni')
      .select(
        'id, broj_racuna, datum, nacin_placanja, status, ukupni_iznos, email_poslano_at, email_poslano_na, zki, jir, fiskalizirano_at, fiskalizacija_error, tip_dokumenta, storniran_od, kupci(naziv, email)',
      )
      .eq('user_id', user.id)
      .order('datum', { ascending: false }),
    supabase
      .from('profiles')
      .select('naziv_obrta')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('fiscal_retry_queue')
      .select('racun_id')
      .eq('user_id', user.id)
      .eq('status', 'pending'),
  ]);

  const pendingRetryRacunIds = new Set(
    (retryRows ?? []).map((r) => r.racun_id as string),
  );

  const rawRows = (racuni ?? []) as unknown as Array<
    Omit<InvoiceRow, 'kupci' | 'storno_original_broj'> & {
      kupci: InvoiceRow['kupci'] | InvoiceRow['kupci'][];
      tip_dokumenta?: string | null;
      storniran_od?: string | null;
    }
  >;

  const stornoRefIds = rawRows
    .map((r) => r.storniran_od)
    .filter((id): id is string => Boolean(id));
  let brojByOriginalId = new Map<string, string>();
  if (stornoRefIds.length > 0) {
    const { data: origRows } = await supabase
      .from('racuni')
      .select('id, broj_racuna')
      .eq('user_id', user.id)
      .in('id', stornoRefIds);
    brojByOriginalId = new Map(
      (origRows ?? []).map((o) => [o.id as string, o.broj_racuna as string]),
    );
  }

  const invoiceRows = rawRows.map((racun) => ({
    ...racun,
    kupci: Array.isArray(racun.kupci) ? (racun.kupci[0] ?? null) : racun.kupci,
    tip_dokumenta: racun.tip_dokumenta ?? 'racun',
    storniran_od: racun.storniran_od ?? null,
    storno_original_broj: racun.storniran_od
      ? brojByOriginalId.get(racun.storniran_od) ?? null
      : null,
  }));

  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-8 text-[#e2e8e7] sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-6'>
        <header className='flex flex-col gap-4 rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6'>
          <div>
            <p className='font-body text-sm text-[#94a3a0]'>
              Evidencija računa
            </p>
            <h1 className='font-heading mt-2 text-2xl sm:text-3xl'>Računi</h1>
          </div>
          <Link
            href='/racuni/novi'
            className='font-body rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6]'
          >
            Novi račun
          </Link>
        </header>

        <InvoiceList
          invoices={invoiceRows}
          nazivObrta={profil?.naziv_obrta ?? 'Kvik'}
          pendingRetryRacunIds={Array.from(pendingRetryRacunIds)}
        />
      </div>
    </main>
  );
}

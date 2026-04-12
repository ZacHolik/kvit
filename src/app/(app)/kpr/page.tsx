import Link from 'next/link';
import { redirect } from 'next/navigation';

import { formatDatumHr, formatIznosEurHr } from '@/lib/format-hr';
import { opisAutomatskogKprUnosaZaRacun } from '@/lib/kpr-export';
import { createClient } from '@/lib/supabase/server';

type PaidInvoice = {
  id: string;
  broj_racuna: string;
  datum: string;
  datum_placanja: string | null;
  nacin_placanja: 'ziro' | 'gotovina' | 'kartica' | null;
  ukupni_iznos: number;
};

export default async function KprPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [{ data: paidInvoices }, { data: existingKpr }] = await Promise.all([
    supabase
      .from('racuni')
      .select(
        'id, broj_racuna, datum, datum_placanja, nacin_placanja, ukupni_iznos',
      )
      .eq('user_id', user.id)
      .eq('status', 'placeno'),
    supabase.from('kpr_unosi').select('racun_id').eq('user_id', user.id),
  ]);

  const existingRacunIds = new Set(
    (existingKpr ?? []).map((item) => item.racun_id),
  );
  const missingEntries = ((paidInvoices ?? []) as PaidInvoice[]).filter(
    (invoice) => !existingRacunIds.has(invoice.id),
  );

  if (missingEntries.length > 0) {
    const payload = missingEntries.map((invoice) => {
      const amount = Number(invoice.ukupni_iznos ?? 0);
      const isCash = invoice.nacin_placanja === 'gotovina';
      return {
        user_id: user.id,
        racun_id: invoice.id,
        datum: invoice.datum_placanja || invoice.datum,
        broj_temeljnice: invoice.broj_racuna,
        opis: opisAutomatskogKprUnosaZaRacun(invoice.broj_racuna),
        iznos_gotovina: isCash ? amount : 0,
        iznos_bezgotovinsko: isCash ? 0 : amount,
        ukupno: amount,
      };
    });

    // TODO: Move this sync to a dedicated background job when volume grows.
    await supabase.from('kpr_unosi').insert(payload);
  }

  const { data: kprUnosi } = await supabase
    .from('kpr_unosi')
    .select(
      'id, datum, broj_temeljnice, opis, iznos_gotovina, iznos_bezgotovinsko, ukupno',
    )
    .eq('user_id', user.id)
    .order('datum', { ascending: false });

  const totals = (kprUnosi ?? []).reduce(
    (accumulator, item) => ({
      gotovina: accumulator.gotovina + Number(item.iznos_gotovina ?? 0),
      bezgotovinsko:
        accumulator.bezgotovinsko + Number(item.iznos_bezgotovinsko ?? 0),
      ukupno: accumulator.ukupno + Number(item.ukupno ?? 0),
    }),
    { gotovina: 0, bezgotovinsko: 0, ukupno: 0 },
  );

  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-8 text-[#e2e8e7] sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-6'>
        <header className='flex flex-col gap-4 rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6'>
          <div>
            <p className='font-body text-sm text-[#94a3a0]'>Knjiga prometa</p>
            <h1 className='font-heading mt-2 text-2xl sm:text-3xl'>KPR</h1>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Link
              href={`/api/kpr/pdf?year=${new Date().getFullYear()}`}
              target='_blank'
              className='font-body rounded-xl border border-[#2a3734] px-4 py-2 text-sm text-[#d5dfdd] transition hover:border-[#0d9488]'
            >
              PDF izvoz
            </Link>
            <Link
              href={`/api/kpr/xlsx?year=${new Date().getFullYear()}`}
              target='_blank'
              className='font-body rounded-xl bg-[#0d9488] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#14b8a6]'
            >
              XLSX izvoz
            </Link>
          </div>
        </header>

        <section className='grid gap-4 sm:grid-cols-3'>
          <article className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5'>
            <p className='font-body text-sm text-[#94a3a0]'>Gotovina</p>
            <p className='font-heading mt-2 text-2xl'>
              {formatIznosEurHr(totals.gotovina)}
            </p>
          </article>
          <article className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5'>
            <p className='font-body text-sm text-[#94a3a0]'>Bezgotovinsko</p>
            <p className='font-heading mt-2 text-2xl'>
              {formatIznosEurHr(totals.bezgotovinsko)}
            </p>
          </article>
          <article className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5'>
            <p className='font-body text-sm text-[#94a3a0]'>Ukupno</p>
            <p className='font-heading mt-2 text-2xl'>
              {formatIznosEurHr(totals.ukupno)}
            </p>
          </article>
        </section>

        <section className='overflow-x-auto rounded-2xl border border-[#1f2a28] bg-[#111716]'>
          <table className='min-w-full divide-y divide-[#24312f]'>
            <thead>
              <tr className='text-left text-sm text-[#94a3a0]'>
                <th className='px-4 py-3 font-medium'>Datum</th>
                <th className='px-4 py-3 font-medium'>Temeljnica</th>
                <th className='px-4 py-3 font-medium'>Opis</th>
                <th className='px-4 py-3 font-medium'>Gotovina</th>
                <th className='px-4 py-3 font-medium'>Bezgotovinsko</th>
                <th className='px-4 py-3 font-medium'>Ukupno</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-[#24312f]'>
              {(kprUnosi ?? []).map((item) => (
                <tr key={item.id} className='text-sm'>
                  <td className='px-4 py-4'>{formatDatumHr(item.datum)}</td>
                  <td className='px-4 py-4'>{item.broj_temeljnice ?? '-'}</td>
                  <td className='px-4 py-4'>{item.opis ?? '-'}</td>
                  <td className='px-4 py-4'>
                    {formatIznosEurHr(Number(item.iznos_gotovina ?? 0))}
                  </td>
                  <td className='px-4 py-4'>
                    {formatIznosEurHr(Number(item.iznos_bezgotovinsko ?? 0))}
                  </td>
                  <td className='px-4 py-4'>
                    {formatIznosEurHr(Number(item.ukupno ?? 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

import { MarkAsPaidButton } from './paid-button';

type InvoiceRow = {
  id: string;
  broj_racuna: string;
  datum: string;
  status: 'izdano' | 'placeno' | 'stornirano';
  ukupni_iznos: number;
  kupci: {
    naziv: string;
  } | null;
};

export default async function RacuniPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: racuni } = await supabase
    .from('racuni')
    .select('id, broj_racuna, datum, status, ukupni_iznos, kupci(naziv)')
    .eq('user_id', user.id)
    .order('datum', { ascending: false });

  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-8 text-[#e2e8e7] sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-6'>
        <header className='flex flex-col gap-4 rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6'>
          <div>
            <p className='font-body text-sm text-[#94a3a0]'>Evidencija racuna</p>
            <h1 className='font-heading mt-2 text-2xl sm:text-3xl'>Racuni</h1>
          </div>
          <Link
            href='/racuni/novi'
            className='font-body rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6]'
          >
            Novi racun
          </Link>
        </header>

        <section className='overflow-x-auto rounded-2xl border border-[#1f2a28] bg-[#111716]'>
          <table className='min-w-full divide-y divide-[#24312f]'>
            <thead>
              <tr className='text-left text-sm text-[#94a3a0]'>
                <th className='px-4 py-3 font-medium'>Broj</th>
                <th className='px-4 py-3 font-medium'>Kupac</th>
                <th className='px-4 py-3 font-medium'>Datum</th>
                <th className='px-4 py-3 font-medium'>Iznos</th>
                <th className='px-4 py-3 font-medium'>Status</th>
                <th className='px-4 py-3 font-medium'>Akcije</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-[#24312f]'>
              {(racuni as InvoiceRow[] | null)?.map((racun) => (
                <tr key={racun.id} className='text-sm'>
                  <td className='px-4 py-4'>{racun.broj_racuna}</td>
                  <td className='px-4 py-4'>{racun.kupci?.naziv ?? '-'}</td>
                  <td className='px-4 py-4'>{racun.datum}</td>
                  <td className='px-4 py-4'>
                    {Number(racun.ukupni_iznos).toFixed(2)} EUR
                  </td>
                  <td className='px-4 py-4 uppercase tracking-wide text-[#b9c7c4]'>
                    {racun.status}
                  </td>
                  <td className='px-4 py-4'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <a
                        href={`/api/racuni/${racun.id}/pdf`}
                        target='_blank'
                        rel='noreferrer'
                        className='font-body rounded-lg border border-[#2a3734] px-3 py-2 text-xs text-[#d5dfdd] transition hover:border-[#0d9488]'
                      >
                        PDF
                      </a>
                      {racun.status !== 'placeno' ? (
                        <MarkAsPaidButton racunId={racun.id} />
                      ) : null}
                    </div>
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

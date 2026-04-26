import Link from 'next/link';
import { redirect } from 'next/navigation';

import { formatDatumHr, formatIznosEurHr } from '@/lib/format-hr';
import { createClient } from '@/lib/supabase/server';

import { ConvertOfferButton } from './convert-button';

type PonudaRow = {
  id: string;
  broj_ponude: string;
  datum: string;
  datum_valjanosti: string | null;
  kupac_naziv: string;
  status: 'poslana' | 'prihvacena' | 'odbijena' | 'istekla';
  ukupno: number;
};

const STATUS_LABELS: Record<PonudaRow['status'], string> = {
  poslana: 'Poslana',
  prihvacena: 'Prihvaćena',
  odbijena: 'Odbijena',
  istekla: 'Istekla',
};

export default async function PonudePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: ponude } = await supabase
    .from('ponude')
    .select('id, broj_ponude, datum, datum_valjanosti, kupac_naziv, status, ukupno')
    .eq('user_id', user.id)
    .order('datum', { ascending: false });

  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-8 text-[#e2e8e7] sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-6'>
        <header className='flex flex-col gap-4 rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6'>
          <div>
            <p className='font-body text-sm text-[#94a3a0]'>Evidencija ponuda</p>
            <h1 className='font-heading mt-2 text-2xl sm:text-3xl'>Ponude</h1>
          </div>
          <Link
            href='/ponude/nova'
            className='font-body rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6]'
          >
            Nova ponuda
          </Link>
        </header>

        <section className='overflow-x-auto rounded-2xl border border-[#1f2a28] bg-[#111716]'>
          <table className='min-w-full divide-y divide-[#24312f]'>
            <thead>
              <tr className='text-left text-sm text-[#94a3a0]'>
                <th className='px-4 py-3 font-medium'>Broj</th>
                <th className='px-4 py-3 font-medium'>Kupac</th>
                <th className='px-4 py-3 font-medium'>Datum</th>
                <th className='px-4 py-3 font-medium'>Vrijedi do</th>
                <th className='px-4 py-3 font-medium'>Iznos</th>
                <th className='px-4 py-3 font-medium'>Status</th>
                <th className='px-4 py-3 font-medium'>Akcije</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-[#24312f]'>
              {((ponude ?? []) as PonudaRow[]).map((ponuda) => (
                <tr key={ponuda.id} className='text-sm'>
                  <td className='px-4 py-4'>{ponuda.broj_ponude}</td>
                  <td className='px-4 py-4'>{ponuda.kupac_naziv}</td>
                  <td className='px-4 py-4'>{formatDatumHr(ponuda.datum)}</td>
                  <td className='px-4 py-4'>
                    {ponuda.datum_valjanosti
                      ? formatDatumHr(ponuda.datum_valjanosti)
                      : '-'}
                  </td>
                  <td className='px-4 py-4'>{formatIznosEurHr(Number(ponuda.ukupno))}</td>
                  <td className='px-4 py-4 text-[#b9c7c4]'>
                    {STATUS_LABELS[ponuda.status] ?? ponuda.status}
                  </td>
                  <td className='px-4 py-4'>
                    <div className='flex flex-wrap gap-2'>
                      <a
                        href={`/api/ponude/${ponuda.id}/pdf`}
                        target='_blank'
                        rel='noreferrer'
                        className='rounded-lg border border-[#2a3734] px-3 py-2 text-xs text-[#d5dfdd] transition hover:border-[#0d9488]'
                      >
                        PDF
                      </a>
                      <ConvertOfferButton ponudaId={ponuda.id} />
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

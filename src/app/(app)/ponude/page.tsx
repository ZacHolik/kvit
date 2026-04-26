import Link from 'next/link';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

import { OfferList, type PonudaRow } from './offer-list';

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

        <OfferList offers={(ponude ?? []) as PonudaRow[]} />
      </div>
    </main>
  );
}

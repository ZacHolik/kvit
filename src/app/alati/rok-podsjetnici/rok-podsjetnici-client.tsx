'use client';

import Link from 'next/link';

import { ZAKONSKI_ROKOVI } from '@/lib/alati/zakonski-rokovi';
import { useAlatiSession } from '@/hooks/use-alati-session';

const ucestalostLabel: Record<string, string> = {
  dnevno: 'Dnevno',
  mjesecno: 'Mjesečno',
  kvartalno: 'Kvartalno',
  godisnje: 'Godišnje',
};

export function RokPodsjetniciClient() {
  const session = useAlatiSession();
  const isPro = session.status === 'signed_in' && session.isPro;

  return (
    <div className='space-y-6'>
      {session.status === 'guest' ? (
        <p className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-4 text-sm text-[#b9c7c4]'>
          Pregled rokova je otvoren.{' '}
          <Link href='/login' className='font-semibold text-[#0d9488] hover:underline'>
            Prijavi se
          </Link>{' '}
          za sinkronizaciju s Kvitom.
        </p>
      ) : null}

      {!isPro && session.status === 'signed_in' ? (
        <div className='rounded-2xl border border-[#0d9488]/35 bg-[#0d9488]/10 p-4 text-sm text-[#b9c7c4]'>
          <span className='font-semibold text-[#e2e8e7]'>PRO</span> uključuje push i email
          obavijesti za ove rokove (kad aktiviramo u aplikaciji).{' '}
          <a href='/#cijene' className='font-medium text-[#5eead4] underline'>
            Nadogradi plan
          </a>
          .
        </div>
      ) : null}

      {isPro ? (
        <p className='rounded-2xl border border-[#0d9488]/40 bg-[#111716] p-4 text-sm text-[#b9c7c4]'>
          PRO: push i email podsjetnici na zakonite rokove bit će dostupni kroz postavke
          Kvita.
        </p>
      ) : null}

      <div className='overflow-x-auto rounded-2xl border border-[#1f2a28] bg-[#111716]'>
        <table className='w-full min-w-[280px] border-collapse text-left text-sm'>
          <caption className='sr-only'>Sažetak zakonskih rokova za paušalnog obrtnika</caption>
          <thead>
            <tr className='border-b border-[#1f2a28] text-xs uppercase tracking-wide text-[#64706e]'>
              <th className='px-3 py-3 font-medium'>Obveza</th>
              <th className='px-3 py-3 font-medium'>Učestalost</th>
              <th className='px-3 py-3 font-medium'>Rok (kratko)</th>
            </tr>
          </thead>
          <tbody>
            {ZAKONSKI_ROKOVI.map((z) => (
              <tr key={z.id} className='border-b border-[#1f2a28] last:border-b-0'>
                <td className='px-3 py-3 align-top'>
                  <p className='font-medium text-[#e2e8e7]'>{z.naziv}</p>
                  <p className='mt-1 text-xs text-[#64706e]'>{z.opis}</p>
                </td>
                <td className='px-3 py-3 text-[#94a3a0]'>
                  {ucestalostLabel[z.ucestalost] ?? z.ucestalost}
                </td>
                <td className='px-3 py-3 font-medium text-[#5eead4]'>{z.rokKratak}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';

import { CANONICAL_SITE_ORIGIN } from '@/lib/vodici-config';

import { FiskalKviz } from './fiskal-kviz';

const url = `${CANONICAL_SITE_ORIGIN}/provjera`;

/** Izbjegava zastarjeli statički HTML na CDN-u ako se ruta dodala kasnije. */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Provjera znanja — fiskalizacija i eRačuni',
  description:
    'Kratki kviz za paušaliste: rokovi 2026./2027., MIKROeRACUN, informacijski posrednik i certifikat. Besplatno, bez prijave.',
  openGraph: {
    title: 'Provjera znanja — fiskalizacija | Kvik',
    description:
      'Kratki kviz za paušaliste: rokovi, eRačuni i certifikat. Edukacija prije posla.',
    url,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'website',
  },
};

export default function ProvjeraPage() {
  return (
    <main className='min-h-screen bg-[#0b1010] px-4 py-12 text-[#d5dfdd] sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-3xl'>
        <nav aria-label='Putanja' className='mb-8 text-sm text-[#94a3a0]'>
          <ol className='flex flex-wrap items-center gap-2'>
            <li>
              <Link href='/' className='transition hover:text-[#0d9488]'>
                Kvik
              </Link>
            </li>
            <li aria-hidden='true'>/</li>
            <li className='text-[#d5dfdd]'>Provjera znanja</li>
          </ol>
        </nav>

        <header className='mb-10'>
          <p className='text-xs font-semibold uppercase tracking-wide text-[#0d9488]'>
            Kviz · oko 4 minute
          </p>
          <h1 className='font-heading mt-2 text-3xl font-bold text-[#e2e8e7] sm:text-4xl'>
            Znaš li rokove za fiskalizaciju 2.0?
          </h1>
          <p className='mt-4 text-lg text-[#b9c7c4]'>
            Šest pitanja za brzu provjeru — bez prijave, bez bodovanja za Poreznu. Kad završiš,
            prođi vodiče na <strong>https://kvik.online/vodici/fiskalizacija-20</strong> i{' '}
            <strong>https://kvik.online/vodici/fina-certifikat-fiskalizacija</strong>.
          </p>
        </header>

        <FiskalKviz />

        <p className='mt-12 text-center text-sm text-[#64748b]'>
          <Link href='/register' className='text-[#0d9488] hover:underline'>
            Probaj Kvik besplatno
          </Link>
          {' · '}
          <Link href='/vodici' className='text-[#0d9488] hover:underline'>
            Svi vodiči
          </Link>
        </p>
      </div>
    </main>
  );
}

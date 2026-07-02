'use client';

import Link from 'next/link';
import { useState } from 'react';

const FAQ_ITEMS = [
  {
    q: 'Moram li imati tehničko znanje?',
    a: 'Ne. Sve je klik po klik. Ako znaš koristiti WhatsApp, znaš koristiti Kvik.',
  },
  {
    q: 'Je li aplikacija usklađena s Fiskalizacijom 2.0?',
    a: 'Da, u potpunosti. Fiskalizacija 1.0 (B2C) je uključena u svaki plan. Fiskalizacija 2.0 dolazi Q4 2026.',
  },
  {
    q: 'Mogu li otkazati pretplatu?',
    a: 'Da, otkazuješ kad god hoćeš iz Settings → Pretplata. Nema kazni, nema ugovornih obveza.',
  },
  {
    q: 'Što je s informacijskim posrednikom?',
    a: 'Uključen je u cijenu. Nema API keyeva, nema čekanja na odobrenje ugovora.',
  },
];

export default function CijenePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-16 text-[#e2e8e7] sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-5xl'>
        {/* Header */}
        <div className='mb-3 text-center'>
          <Link
            href='/'
            className='text-2xl font-bold tracking-tight text-[#e2e8e7]'
          >
            Kvik<span className='text-[#0d9488]'>.</span>
          </Link>
        </div>

        <div className='mb-12 text-center'>
          <h1 className='text-4xl font-bold sm:text-5xl'>Cijene</h1>
          <p className='mt-3 text-sm text-[#94a3a0]'>
            Bez skrivenih troškova · Bez aktivacijske naknade · Otkaži kad
            hoćeš
          </p>
        </div>

        {/* Plan kartica */}
        <div className='mx-auto max-w-md'>
          {/* Paušalist (featured) */}
          <div className='relative flex flex-col rounded-2xl border border-[#0d9488] bg-[#111716] p-6 shadow-[0_0_32px_rgba(13,148,136,0.18)]'>
            <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
              <span className='rounded-full bg-[#0d9488] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white'>
                Najpopularnije
              </span>
            </div>
            <div className='mb-4'>
              <p className='text-xs font-medium uppercase tracking-widest text-[#94a3a0]'>
                Najpopularnije
              </p>
              <p className='mt-1 text-xl font-bold text-[#e2e8e7]'>Paušalist</p>
            </div>
            <div className='mb-1'>
              <span className='text-4xl font-bold text-[#e2e8e7]'>7€</span>
              <span className='ml-1 text-sm text-[#94a3a0]'>/mj</span>
            </div>
            <p className='mb-6 text-sm text-[#94a3a0]'>Za aktivne obrtnike</p>
            <ul className='mb-8 flex-1 space-y-2.5 text-sm text-[#b9c7c4]'>
              {[
                'Neograničeni računi',
                'Automatski KPR i PO-SD',
                'Fiskalizacija 1.0 (2.0 dolazi Q4 2026.)',
                'AI asistent neograničeno',
                'Podsjetnici na rokove',
                'eRačuni — zaprimanje besplatno',
              ].map((f) => (
                <li key={f} className='flex items-start gap-2'>
                  <span className='mt-0.5 text-[#0d9488]'>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href='/register'
              className='block w-full rounded-xl bg-[#0d9488] py-3 text-center text-sm font-semibold text-white transition hover:bg-[#14b8a6]'
            >
              Pretplati se za 7€/mj →
            </Link>
          </div>
        </div>

        {/* Zašto Kvik */}
        <section className='mt-16 max-w-3xl mx-auto'>
          <h2 className='mb-6 text-center text-2xl font-bold'>Zašto Kvik?</h2>
          <ul className='space-y-3 text-[#e2e8e7]'>
            <li className='flex gap-3'>
              <span className='text-emerald-400'>✓</span>
              0€ aktivacija (konkurenti naplaćuju onboarding)
            </li>
            <li className='flex gap-3'>
              <span className='text-emerald-400'>✓</span>
              AI asistent uključen (konkurenti nemaju)
            </li>
            <li className='flex gap-3'>
              <span className='text-emerald-400'>✓</span>
              Fiskalizacija 1.0 uključena u svaki plan
            </li>
            <li className='flex gap-3'>
              <span className='text-emerald-400'>✓</span>
              Cijena se ne mijenja (early adopter garancija)
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section className='mt-16'>
          <h2 className='mb-6 text-center text-2xl font-bold'>
            Pitanja i odgovori
          </h2>
          <div className='mx-auto max-w-2xl divide-y divide-[#1f2a28] rounded-2xl border border-[#1f2a28]'>
            {FAQ_ITEMS.map((item, idx) => (
              <div key={item.q}>
                <button
                  type='button'
                  onClick={() => setOpenFaq((p) => (p === idx ? null : idx))}
                  className='flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-[#e2e8e7] transition hover:text-[#14b8a6]'
                >
                  {item.q}
                  <span className='ml-4 text-[#94a3a0]'>
                    {openFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {openFaq === idx && (
                  <p className='px-5 pb-4 text-sm leading-relaxed text-[#94a3a0]'>
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Footer nav */}
        <div className='mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-[#94a3a0]'>
          <Link href='/' className='hover:text-[#e2e8e7]'>
            Početna
          </Link>
          <Link href='/alati' className='hover:text-[#e2e8e7]'>
            Alati
          </Link>
          <Link href='/vodici' className='hover:text-[#e2e8e7]'>
            Vodiči
          </Link>
          <Link href='/privacy' className='hover:text-[#e2e8e7]'>
            Privatnost
          </Link>
          <Link href='/uvjeti' className='hover:text-[#e2e8e7]'>
            Uvjeti
          </Link>
        </div>
        <p className='mt-6 text-center text-xs text-[#94a3a0]'>
          © 2026 Kvik. Sva prava pridržana.
        </p>
      </div>
    </main>
  );
}

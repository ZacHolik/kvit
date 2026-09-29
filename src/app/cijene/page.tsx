'use client';

import Link from 'next/link';
import { useState } from 'react';

type SelectedInterval = 'monthly' | 'yearly';

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
    a: 'Da, bilo kada. Otkazivanjem zaustavljaš sljedeću uplatu, a Kvik koristiš do kraja mjeseca ili godine koju si platio.',
  },
  {
    q: 'Zašto je godišnje jeftinije?',
    a: 'Jedna uplata godišnje znači jedan račun i jednu proviziju za karticu umjesto dvanaest, a nama lakše planiranje. Tu uštedu dijelimo s tobom. Usput: paušalistu troškovi ne smanjuju porez, pa ti ostaje svih 36 € uštede.',
  },
  {
    q: 'Što je PROMO26?',
    a: 'Cijena za prve korisnike: tko nam se pridruži u 2026., prvu godinu plaća upola, 72 € umjesto 144 €. Na stranici za plaćanje klikni „Dodaj promotivni kôd" i upiši ga. Vrijedi do 31. prosinca 2026.',
  },
  {
    q: 'Što je s informacijskim posrednikom?',
    a: 'Uključen je u cijenu. Nema API keyeva, nema čekanja na odobrenje ugovora.',
  },
];

async function startCheckout(plan: SelectedInterval) {
  const leadEmail =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('kvik_lead_email') ?? undefined
      : undefined;

  const res = await fetch('/api/stripe/checkout-anonymous', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan, lead_email: leadEmail }),
  });
  const data = (await res.json()) as { url?: string };
  if (data.url) {
    window.location.href = data.url;
  }
}

export default function CijenePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedInterval, setSelectedInterval] =
    useState<SelectedInterval>('monthly');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const intervalHint =
    selectedInterval === 'monthly'
      ? '→ 15 € svaki mjesec, uvijek na isti datum.'
      : '→ 144 € odjednom, za 12 mjeseci unaprijed. Uštediš 36 €.';

  const ctaLabel =
    selectedInterval === 'monthly'
      ? 'Pretplati se za 15 €/mj →'
      : 'Pretplati se za 144 €/god →';

  const handleCheckout = () => {
    setCheckoutLoading(true);
    void startCheckout(selectedInterval);
  };

  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-16 text-[#e2e8e7] sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-5xl'>
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

        <div className='mx-auto max-w-md'>
          <div className='mb-6 flex flex-col items-center gap-3'>
            <div
              className='inline-flex rounded-xl border border-[#1f2a28] bg-[#111716] p-1'
              role='group'
              aria-label='Odabir intervala naplate'
            >
              <button
                type='button'
                onClick={() => setSelectedInterval('monthly')}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  selectedInterval === 'monthly'
                    ? 'bg-[#0d9488] text-white'
                    : 'text-[#94a3a0] hover:text-[#e2e8e7]'
                }`}
              >
                Mjesečno
              </button>
              <button
                type='button'
                onClick={() => setSelectedInterval('yearly')}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  selectedInterval === 'yearly'
                    ? 'bg-[#0d9488] text-white'
                    : 'text-[#94a3a0] hover:text-[#e2e8e7]'
                }`}
              >
                Godišnje{' '}
                <span className='text-xs font-bold text-[#5eead4]'>
                  −20%
                </span>
              </button>
            </div>
            <p className='text-center text-sm text-[#94a3a0]'>{intervalHint}</p>
          </div>

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

            {selectedInterval === 'monthly' ? (
              <div className='mb-1'>
                <span className='text-4xl font-bold text-[#e2e8e7]'>15 €</span>
                <span className='ml-1 text-sm text-[#94a3a0]'>/mj</span>
              </div>
            ) : (
              <>
                <div className='mb-1'>
                  <span className='text-4xl font-bold text-[#e2e8e7]'>
                    144 €
                  </span>
                  <span className='ml-1 text-sm text-[#94a3a0]'>/god</span>
                  <span className='ml-2 text-sm text-[#94a3a0]'>
                    (12 € mjesečno)
                  </span>
                </div>
                <p className='mb-4 text-xs leading-relaxed text-[#94a3a0]'>
                  Uz kôd PROMO26: 72 € za prvu godinu. Vrijedi do 31. 12.
                  2026.
                </p>
              </>
            )}

            {selectedInterval === 'monthly' ? (
              <p className='mb-6 text-sm text-[#94a3a0]'>Za aktivne obrtnike</p>
            ) : null}

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
            <button
              type='button'
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className='block w-full rounded-xl bg-[#0d9488] py-3 text-center text-sm font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-70'
            >
              {checkoutLoading ? 'Otvaram plaćanje...' : ctaLabel}
            </button>
          </div>
        </div>

        <section className='mx-auto mt-16 max-w-3xl'>
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
          </ul>
        </section>

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

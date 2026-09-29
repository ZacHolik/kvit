'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import PricingPlanSelector from '@/components/pricing/PricingPlanSelector';
import type { BillingPlan } from '@/config/pricing';
import { eur } from '@/config/pricing';
import { getCijeneFaqItems } from '@/lib/pricing-faq';

async function startCheckout(plan: BillingPlan) {
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
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const faqItems = useMemo(() => getCijeneFaqItems(), []);

  const handleCheckout = (plan: BillingPlan) => {
    setCheckoutLoading(true);
    void startCheckout(plan);
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

        <PricingPlanSelector
          theme='cijene'
          defaultInterval='yearly'
          checkoutLoading={checkoutLoading}
          onCheckout={handleCheckout}
        />

        <section className='mx-auto mt-16 max-w-3xl'>
          <h2 className='mb-6 text-center text-2xl font-bold'>Zašto Kvik?</h2>
          <ul className='space-y-3 text-[#e2e8e7]'>
            <li className='flex gap-3'>
              <span className='text-emerald-400'>✓</span>
              {eur(0)} za aktivaciju (drugi naplaćuju postavljanje)
            </li>
            <li className='flex gap-3'>
              <span className='text-emerald-400'>✓</span>
              AI asistent uključen (konkurenti nemaju)
            </li>
            <li className='flex gap-3'>
              <span className='text-emerald-400'>✓</span>
              Fiskalizacija računa uključena u cijenu
            </li>
          </ul>
        </section>

        <section className='mt-16'>
          <h2 className='mb-6 text-center text-2xl font-bold'>
            Pitanja i odgovori
          </h2>
          <div className='mx-auto max-w-2xl divide-y divide-[#1f2a28] rounded-2xl border border-[#1f2a28]'>
            {faqItems.map((item, idx) => (
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

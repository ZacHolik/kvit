'use client';

import { useEffect } from 'react';

type Props = {
  showUpgrade: boolean;
};

async function startCheckout(trial: boolean) {
  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan: 'pausalist', trial }),
  });
  const data = (await res.json()) as { url?: string; error?: string };
  if (data.url) {
    window.location.href = data.url;
  }
}

/** P1-1/P1-4: checkout intent nakon registracije + upgrade CTA za free korisnike. */
export function DashboardUpgradeBanner({ showUpgrade }: Props) {
  useEffect(() => {
    const intent = sessionStorage.getItem('kvik_checkout_intent');
    if (!intent) return;
    sessionStorage.removeItem('kvik_checkout_intent');
    const { plan, trial } = JSON.parse(intent) as {
      plan: string;
      trial: boolean;
    };
    fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, trial }),
    })
      .then((r) => r.json())
      .then((data: { url?: string }) => {
        if (data.url) window.location.href = data.url;
      })
      .catch(() => {});
  }, []);

  if (!showUpgrade) return null;

  return (
    <section className='rounded-2xl border border-[#0d9488]/40 bg-[#0d9488]/10 p-4 sm:p-5'>
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <p className='font-body text-sm text-[#e2e8e7]'>
          Otključaj neograničene račune i fiskalizaciju →
        </p>
        <button
          type='button'
          onClick={() => void startCheckout(true)}
          className='font-body shrink-0 rounded-xl bg-[#0d9488] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#14b8a6]'
        >
          Isprobaj 7 dana besplatno
        </button>
      </div>
    </section>
  );
}

'use client';

import { useMemo, useState } from 'react';

import { getPausalRazred2026 } from '@/lib/pausal-tax';
import { formatIznosEurHr } from '@/lib/format-hr';

import { PostValueCta } from '../_components/post-value-cta';
import { PoweredByKvikBadge } from '../_components/powered-by-kvik-badge';
import { ShareResult } from '../_components/share-result';

export function PoSdTool() {
  const [godina, setGodina] = useState(new Date().getFullYear() - 1);
  const [gotovina, setGotovina] = useState(0);
  const [bezgotovinsko, setBezgotovinsko] = useState(0);
  const [generated, setGenerated] = useState(false);

  const ukupno = Math.max(0, gotovina) + Math.max(0, bezgotovinsko);
  const razred = useMemo(() => getPausalRazred2026(ukupno), [ukupno]);

  return (
    <div className='space-y-6'>
      <section className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
        <h2 className='font-heading text-lg text-[#e2e8e7]'>PO-SD generator (besplatno)</h2>
        <p className='mt-2 text-sm text-[#b9c7c4]'>
          Unesi primitke i izračunaj procjenu razreda i poreza.
        </p>
        <div className='mt-4 grid gap-4 sm:grid-cols-3'>
          <label className='text-sm text-[#b9c7c4]'>
            Godina
            <input
              type='number'
              value={godina}
              onChange={(e) => setGodina(Number(e.target.value))}
              className='mt-2 w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-3 py-2 text-[#e2e8e7]'
            />
          </label>
          <label className='text-sm text-[#b9c7c4]'>
            Gotovina (€)
            <input
              type='number'
              value={gotovina}
              onChange={(e) => setGotovina(Number(e.target.value))}
              className='mt-2 w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-3 py-2 text-[#e2e8e7]'
            />
          </label>
          <label className='text-sm text-[#b9c7c4]'>
            Bezgotovinsko (€)
            <input
              type='number'
              value={bezgotovinsko}
              onChange={(e) => setBezgotovinsko(Number(e.target.value))}
              className='mt-2 w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-3 py-2 text-[#e2e8e7]'
            />
          </label>
        </div>
        <button
          type='button'
          onClick={() => setGenerated(true)}
          className='mt-4 rounded-xl bg-[#0d9488] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#14b8a6]'
        >
          Generiraj PO-SD pregled
        </button>
      </section>

      {generated ? (
        <section className='rounded-2xl border border-[#0d9488]/35 bg-[#111716] p-5 sm:p-6'>
          <h3 className='font-heading text-lg text-[#e2e8e7]'>Rezultat</h3>
          <dl className='mt-4 space-y-2 text-sm text-[#b9c7c4]'>
            <div className='flex justify-between gap-4'>
              <dt>Godina</dt>
              <dd>{godina}</dd>
            </div>
            <div className='flex justify-between gap-4'>
              <dt>Ukupno primitci</dt>
              <dd className='font-semibold text-[#e2e8e7]'>{formatIznosEurHr(ukupno)}</dd>
            </div>
            <div className='flex justify-between gap-4'>
              <dt>Razred</dt>
              <dd>{razred?.label ?? '—'}</dd>
            </div>
            <div className='flex justify-between gap-4'>
              <dt>Porez kvartalno (procjena)</dt>
              <dd>{formatIznosEurHr(razred?.porezKvartalnoEur ?? 0)}</dd>
            </div>
          </dl>
          <PoweredByKvikBadge />
          <ShareResult pageTitle='PO-SD generator' pageUrl='https://kvik.online/po-sd' />
          <PostValueCta />
        </section>
      ) : null}
    </div>
  );
}

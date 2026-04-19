'use client';

import { useMemo, useState } from 'react';

type Bracket = {
  razred: number;
  min: number;
  max: number;
  quarterly: number;
  annual: number;
};

const BRACKETS: Bracket[] = [
  { razred: 0, min: 0, max: 11_300, quarterly: 50.85, annual: 203.4 },
  { razred: 1, min: 11_300, max: 22_600, quarterly: 101.7, annual: 406.8 },
  { razred: 2, min: 22_600, max: 33_900, quarterly: 152.55, annual: 610.2 },
  { razred: 3, min: 33_900, max: 45_200, quarterly: 237.7, annual: 950.8 },
  { razred: 4, min: 45_200, max: 60_000, quarterly: 338.75, annual: 1_355.0 },
];

const MAX_INCOME = 60_000;
const MONTHLY_DOPRINOSI = 290.98;

function bracketForIncome(income: number): Bracket | null {
  if (!Number.isFinite(income) || income <= 0) {
    return null;
  }
  const capped = Math.min(MAX_INCOME, income);
  for (const b of BRACKETS) {
    if (capped > b.min && capped <= b.max) {
      return b;
    }
  }
  return null;
}

const eur = new Intl.NumberFormat('hr-HR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const pct = new Intl.NumberFormat('hr-HR', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function PausalTaxCalculator() {
  const [income, setIncome] = useState(20_000);
  const bracket = useMemo(() => bracketForIncome(income), [income]);

  const effectiveRate = bracket && income > 0 ? bracket.annual / income : 0;

  function clampIncome(n: number) {
    if (!Number.isFinite(n)) {
      return;
    }
    setIncome(Math.min(MAX_INCOME, Math.max(0, n)));
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
        <label
          htmlFor='godisnji-prihod'
          className='font-heading text-sm font-semibold text-[#e2e8e7]'
        >
          Godišnji prihod (€)
        </label>
        <p className='mt-1 text-xs text-[#64706e]'>Raspon 0 – 60.000 € (2026.)</p>
        <input
          id='godisnji-prihod'
          type='number'
          inputMode='decimal'
          min={0}
          max={MAX_INCOME}
          step={100}
          value={income === 0 ? '' : income}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === '') {
              setIncome(0);
              return;
            }
            const n = Number.parseFloat(raw.replace(/\s/g, '').replace(',', '.'));
            if (Number.isNaN(n)) {
              return;
            }
            clampIncome(n);
          }}
          onBlur={() => {
            if (income === 0) {
              return;
            }
            clampIncome(income);
          }}
          className='mt-4 w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 font-body text-[#e2e8e7] outline-none ring-[#0d9488]/0 transition focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/30'
        />
        <div className='mt-5'>
          <input
            type='range'
            min={0}
            max={MAX_INCOME}
            step={100}
            value={income}
            onChange={(e) => clampIncome(Number(e.target.value))}
            className='w-full accent-[#0d9488]'
            aria-label='Godišnji prihod klizačem'
          />
          <div className='mt-1 flex justify-between font-body text-xs text-[#64706e]'>
            <span>0 €</span>
            <span>60.000 €</span>
          </div>
        </div>
      </div>

      <div className='rounded-2xl border border-[#0d9488]/35 bg-[#111716] p-5 sm:p-6'>
        <h2 className='font-heading text-lg font-semibold text-[#e2e8e7]'>
          Rezultat
        </h2>
        {bracket ? (
          <dl className='mt-4 grid gap-3 sm:grid-cols-2'>
            <div className='rounded-xl border border-[#1f2a28] bg-[#0b0f0e] p-4'>
              <dt className='text-xs font-medium uppercase tracking-wide text-[#64706e]'>
                Porezni razred
              </dt>
              <dd className='mt-1 font-heading text-2xl font-bold text-[#0d9488]'>
                {bracket.razred}
              </dd>
            </div>
            <div className='rounded-xl border border-[#1f2a28] bg-[#0b0f0e] p-4'>
              <dt className='text-xs font-medium uppercase tracking-wide text-[#64706e]'>
                Stopa poreza
              </dt>
              <dd className='mt-1 font-heading text-2xl font-bold text-[#e2e8e7]'>
                {pct.format(effectiveRate)}
              </dd>
            </div>
            <div className='rounded-xl border border-[#1f2a28] bg-[#0b0f0e] p-4'>
              <dt className='text-xs font-medium uppercase tracking-wide text-[#64706e]'>
                Porez po kvartalu
              </dt>
              <dd className='mt-1 font-body text-xl font-semibold text-[#e2e8e7]'>
                {eur.format(bracket.quarterly)}
              </dd>
            </div>
            <div className='rounded-xl border border-[#1f2a28] bg-[#0b0f0e] p-4'>
              <dt className='text-xs font-medium uppercase tracking-wide text-[#64706e]'>
                Porez godišnje
              </dt>
              <dd className='mt-1 font-body text-xl font-semibold text-[#e2e8e7]'>
                {eur.format(bracket.annual)}
              </dd>
            </div>
          </dl>
        ) : (
          <p className='mt-4 text-sm text-[#94a3a0]'>
            Unesi godišnji prihod veći od 0 € da vidiš razred i iznose.
          </p>
        )}
      </div>

      <div className='rounded-xl border border-[#1f2a28] bg-[#111716] p-4 text-sm text-[#b9c7c4]'>
        <p className='font-medium text-[#e2e8e7]'>Mjesečni doprinosi (podsjetnik)</p>
        <p className='mt-1'>
          Zdravstveno i mirovinsko:{' '}
          <span className='font-semibold text-[#0d9488]'>{eur.format(MONTHLY_DOPRINOSI)}</span>{' '}
          / mj. (do 15. u mjesecu).
        </p>
      </div>

      <div className='rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-[#b9c7c4]'>
        Ovo je procjena. Točan iznos ovisi o općini (prirez) i individualnoj situaciji.
      </div>
    </div>
  );
}

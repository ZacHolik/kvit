'use client';

import { useMemo, useState } from 'react';

const THRESHOLD = 60_000;
const WARN_AFTER = 54_000;
const YELLOW_START = 40_000;

const eur = new Intl.NumberFormat('hr-HR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function parseAmount(raw: string): number {
  const n = Number.parseFloat(raw.replace(/\s/g, '').replace(',', '.'));
  if (Number.isNaN(n) || n < 0) {
    return 0;
  }
  return n;
}

function barTone(amount: number): 'green' | 'yellow' | 'red' | 'over' {
  if (amount > THRESHOLD) {
    return 'over';
  }
  if (amount >= WARN_AFTER) {
    return 'red';
  }
  if (amount >= YELLOW_START && amount < WARN_AFTER) {
    return 'yellow';
  }
  return 'green';
}

const toneClass: Record<ReturnType<typeof barTone>, string> = {
  green: 'bg-emerald-500',
  yellow: 'bg-amber-400',
  red: 'bg-red-500',
  over: 'bg-red-600 animate-pulse',
};

export function PdvPragCalculator() {
  const [raw, setRaw] = useState('');
  const amount = useMemo(() => parseAmount(raw), [raw]);
  const tone = barTone(amount);
  const pctUsed = amount <= 0 ? 0 : (amount / THRESHOLD) * 100;
  const barWidth = Math.min(100, pctUsed);
  const remaining = Math.max(0, THRESHOLD - amount);

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
        <label
          htmlFor='pdv-prihodi'
          className='font-heading text-sm font-semibold text-[#e2e8e7]'
        >
          Dosadašnji prihodi ove godine (€)
        </label>
        <p className='mt-1 text-xs text-[#64706e]'>
          Usporedba s PDV pragom 60.000 € (paušalni obrt).
        </p>
        <input
          id='pdv-prihodi'
          type='number'
          inputMode='decimal'
          min={0}
          step={100}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder='npr. 35.000'
          className='mt-4 w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 font-body text-[#e2e8e7] outline-none transition focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/30'
        />
      </div>

      <div className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
        <h2 className='font-heading text-lg font-semibold text-[#e2e8e7]'>
          PDV prag
        </h2>
        <p className='mt-2 text-sm text-[#94a3a0]'>
          Ostalo do praga:{' '}
          <span className='font-semibold text-[#e2e8e7]'>{eur.format(remaining)}</span>
        </p>
        <p className='mt-1 text-sm text-[#94a3a0]'>
          Iskorišteno:{' '}
          <span className='font-semibold text-[#e2e8e7]'>
            {new Intl.NumberFormat('hr-HR', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 1,
            }).format(pctUsed)}
            % praga
          </span>
        </p>

        <div
          className='mt-5 h-4 w-full overflow-hidden rounded-full bg-[#1f2a28]'
          role='progressbar'
          aria-valuemin={0}
          aria-valuemax={THRESHOLD}
          aria-valuenow={Math.min(amount, THRESHOLD)}
          aria-label='Napredak prema PDV pragu'
        >
          <div
            className={`h-full rounded-full transition-all duration-300 ${toneClass[tone]}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
        <div className='mt-2 flex justify-between font-body text-xs text-[#64706e]'>
          <span>0 €</span>
          <span>60.000 €</span>
        </div>
        <ul className='mt-4 space-y-1 text-xs text-[#64706e]'>
          <li>
            <span className='inline-block h-2 w-2 rounded-full bg-emerald-500 align-middle' />{' '}
            0 – 40.000 €: siguran
          </li>
          <li>
            <span className='inline-block h-2 w-2 rounded-full bg-amber-400 align-middle' />{' '}
            40.000 – 54.000 €: pazi
          </li>
          <li>
            <span className='inline-block h-2 w-2 rounded-full bg-red-500 align-middle' />{' '}
            54.000 – 60.000 €: kritično
          </li>
          <li>
            <span className='inline-block h-2 w-2 rounded-full bg-red-600 align-middle' />{' '}
            Iznad 60.000 €: prekoračeno
          </li>
        </ul>
      </div>

      {amount > WARN_AFTER && amount <= THRESHOLD ? (
        <div className='rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100'>
          ⚠️ Blizu si PDV praga! Savjetuj se s računovođom.
        </div>
      ) : null}

      {amount > THRESHOLD ? (
        <div className='rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-100'>
          🚨 Prešao si PDV prag! Moraš se prijaviti kao PDV obveznik.
        </div>
      ) : null}
    </div>
  );
}

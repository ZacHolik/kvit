'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { useAlatiSession, useKprYearTotal } from '@/hooks/use-alati-session';

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

/** Linearna projekcija do kraja godine od dosadašnjeg YTD. */
function projectYearEnd(ytd: number, monthIndex1Based: number): number {
  if (monthIndex1Based < 1) {
    return ytd;
  }
  return (ytd / monthIndex1Based) * 12;
}

export function PdvPragCalculator() {
  const session = useAlatiSession();
  const signedIn = session.status === 'signed_in';
  const kpr = useKprYearTotal(signedIn);

  const [raw, setRaw] = useState('');
  const amount = useMemo(() => parseAmount(raw), [raw]);

  const now = new Date();
  const monthIdx = now.getMonth() + 1;
  const projected = projectYearEnd(amount, monthIdx);
  const monthsToThreshold =
    amount >= THRESHOLD || amount <= 0
      ? null
      : (() => {
          const avg = amount / monthIdx;
          if (avg <= 0) {
            return null;
          }
          const remaining = THRESHOLD - amount;
          return remaining / avg;
        })();

  const tone = barTone(amount);
  const pctUsed = amount <= 0 ? 0 : (amount / THRESHOLD) * 100;
  const barWidth = Math.min(100, pctUsed);
  const remaining = Math.max(0, THRESHOLD - amount);

  function applyKpr() {
    if (kpr.total != null) {
      setRaw(String(kpr.total));
    }
  }

  return (
    <div className='space-y-6'>
      {signedIn ? (
        <div className='rounded-2xl border border-[#0d9488]/35 bg-[#0d9488]/10 p-4 sm:p-5'>
          <p className='font-heading text-sm font-semibold text-[#e2e8e7]'>
            Prihodi iz KPR-a (YTD)
          </p>
          <p className='mt-1 text-sm text-[#94a3a0]'>
            {kpr.loading
              ? 'Učitavam…'
              : kpr.error
                ? kpr.error
                : kpr.total != null
                  ? `Zbrojeno: ${eur.format(kpr.total)}.`
                  : 'Nema unosa za ovu godinu.'}
          </p>
          <div className='mt-3 flex flex-wrap gap-2'>
            <button
              type='button'
              onClick={() => void kpr.reload()}
              className='rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-2.5 text-sm font-medium text-[#e2e8e7] transition hover:border-[#0d9488]/60'
            >
              Osvježi
            </button>
            <button
              type='button'
              onClick={applyKpr}
              disabled={kpr.total == null || kpr.loading}
              className='rounded-xl bg-[#0d9488] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14b8a6] disabled:opacity-40'
            >
              Učitaj iz KPR-a
            </button>
            <Link
              href='/kpr'
              className='inline-flex items-center rounded-xl border border-[#0d9488]/50 px-4 py-2.5 text-sm font-medium text-[#5eead4] hover:bg-[#0d9488]/15'
            >
              KPR →
            </Link>
          </div>
        </div>
      ) : (
        <div className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-4 text-sm text-[#b9c7c4]'>
          <Link href='/login' className='font-semibold text-[#0d9488] hover:underline'>
            Prijavi se
          </Link>{' '}
          za automatsko punjenje iz stvarnog KPR-a.
        </div>
      )}

      <div className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
        <label
          htmlFor='pdv-prihodi'
          className='font-heading text-sm font-semibold text-[#e2e8e7]'
        >
          Dosadašnji prihodi ove godine (€)
        </label>
        <p className='mt-1 text-xs text-[#64706e]'>
          Usporedba s PDV pragom 60.000 € (paušalni obrt). PDV prag kalkulator — instant
          rezultat.
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
          className='mt-4 min-h-[52px] w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-lg text-[#e2e8e7] outline-none transition focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/30'
        />
      </div>

      <div className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
        <h2 className='font-heading text-lg font-semibold text-[#e2e8e7]'>PDV prag</h2>
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
          className='mt-5 h-5 w-full overflow-hidden rounded-full bg-[#1f2a28]'
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

      {amount > 0 ? (
        <div className='rounded-2xl border border-[#2a3734] bg-[#111716] p-5 sm:p-6'>
          <h3 className='font-heading text-base font-semibold text-[#e2e8e7]'>
            Projekcija (jednostavna)
          </h3>
          <p className='mt-2 text-sm text-[#94a3a0]'>
            Pretpostavlja ravnomjerni primitak kroz godinu. Stvarni tijek može biti drugačiji.
          </p>
          <dl className='mt-4 space-y-2 text-sm'>
            <div className='flex justify-between gap-4'>
              <dt className='text-[#64706e]'>Procjena kraj godine</dt>
              <dd className='font-semibold text-[#e2e8e7]'>{eur.format(projected)}</dd>
            </div>
            {monthsToThreshold != null && monthsToThreshold > 0 && monthsToThreshold < 36 ? (
              <div className='flex justify-between gap-4'>
                <dt className='text-[#64706e]'>Okvirno do praga</dt>
                <dd className='font-semibold text-[#e2e8e7]'>
                  {monthsToThreshold < 1
                    ? 'manje od mjesec dana'
                    : `~${monthsToThreshold.toFixed(1)} mj.`}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      ) : null}

      {amount > WARN_AFTER && amount <= THRESHOLD ? (
        <div className='rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100'>
          Blizu si PDV praga. Savjetuj se s računovođom.
        </div>
      ) : null}

      {amount > THRESHOLD ? (
        <div className='rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-100'>
          Prekoračen je PDV prag u ovom modelu. Obavezno se posavjetuj s poreznim savjetnikom.
        </div>
      ) : null}
    </div>
  );
}

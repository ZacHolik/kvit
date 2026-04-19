'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import {
  bracketTrackColor,
  MJESECNI_DOPRINOSI_EUR,
  PAUSAL_BRACKETS,
  PAUSAL_MAX_INCOME,
  pausalBracketForIncome,
} from '@/lib/alati/pausal-brackets';
import { useAlatiSession, useKprYearTotal } from '@/hooks/use-alati-session';

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

function segmentFlex(min: number, max: number): number {
  return ((max - min) / PAUSAL_MAX_INCOME) * 100;
}

export function PausalTaxCalculator() {
  const session = useAlatiSession();
  const signedIn = session.status === 'signed_in';
  const kpr = useKprYearTotal(signedIn);

  const [income, setIncome] = useState(20_000);
  const bracket = useMemo(() => pausalBracketForIncome(income), [income]);
  const effectiveRate = bracket && income > 0 ? bracket.annual / income : 0;

  function clampIncome(n: number) {
    if (!Number.isFinite(n)) {
      return;
    }
    setIncome(Math.min(PAUSAL_MAX_INCOME, Math.max(0, n)));
  }

  function applyKpr() {
    if (kpr.total != null) {
      clampIncome(Math.min(PAUSAL_MAX_INCOME, Math.round(kpr.total)));
    }
  }

  const thumbPct = (Math.min(income, PAUSAL_MAX_INCOME) / PAUSAL_MAX_INCOME) * 100;

  return (
    <div className='space-y-6'>
      {signedIn ? (
        <div className='rounded-2xl border border-[#0d9488]/35 bg-[#0d9488]/10 p-4 sm:p-5'>
          <p className='font-heading text-sm font-semibold text-[#e2e8e7]'>
            Podaci iz KPR-a (tekuća godina)
          </p>
          <p className='mt-1 text-sm text-[#94a3a0]'>
            {kpr.loading
              ? 'Učitavam zbroj primitaka…'
              : kpr.error
                ? kpr.error
                : kpr.total != null
                  ? `Zbrojeno iz KPR-a: ${eur.format(kpr.total)}${
                      kpr.year != null ? ` (${kpr.year}.)` : ''
                    }.`
                  : 'Nema unosa u KPR-u za ovu godinu.'}
          </p>
          <div className='mt-3 flex flex-wrap gap-2'>
            <button
              type='button'
              onClick={() => void kpr.reload()}
              className='rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-2.5 text-sm font-medium text-[#e2e8e7] transition hover:border-[#0d9488]/60'
            >
              Osvježi KPR
            </button>
            <button
              type='button'
              onClick={applyKpr}
              disabled={kpr.total == null || kpr.loading}
              className='rounded-xl bg-[#0d9488] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-40'
            >
              Učitaj u kalkulator
            </button>
            <Link
              href='/kpr'
              className='inline-flex items-center rounded-xl border border-[#0d9488]/50 px-4 py-2.5 text-sm font-medium text-[#5eead4] transition hover:bg-[#0d9488]/15'
            >
              Otvori KPR →
            </Link>
          </div>
        </div>
      ) : (
        <div className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-4 sm:p-5'>
          <p className='text-sm text-[#b9c7c4]'>
            <Link href='/login' className='font-semibold text-[#0d9488] hover:underline'>
              Prijavi se
            </Link>{' '}
            da automatski povučeš primitke iz KPR-a u ovaj kalkulator.
          </p>
        </div>
      )}

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
          max={PAUSAL_MAX_INCOME}
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
            if (income !== 0) {
              clampIncome(income);
            }
          }}
          className='mt-4 min-h-[52px] w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-lg text-[#e2e8e7] outline-none ring-[#0d9488]/0 transition focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/30'
        />
        <div className='mt-5'>
          <p className='mb-2 text-xs font-medium uppercase tracking-wide text-[#64706e]'>
            Napredak kroz razrede
          </p>
          <div className='relative h-4 w-full overflow-hidden rounded-full bg-[#1f2a28]'>
            <div className='absolute inset-0 flex'>
              {PAUSAL_BRACKETS.map((b) => (
                <div
                  key={b.razred}
                  className='h-full border-r border-[#0b0f0e]/80 last:border-r-0'
                  style={{
                    flex: segmentFlex(b.min, b.max),
                    backgroundColor:
                      bracket?.razred === b.razred
                        ? bracketTrackColor(b.razred)
                        : `${bracketTrackColor(b.razred)}55`,
                  }}
                  title={`Razred ${b.razred}`}
                />
              ))}
            </div>
            <div
              className='absolute top-1/2 z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#0d9488] shadow-md'
              style={{ left: `${thumbPct}%` }}
              aria-hidden
            />
          </div>
          <input
            type='range'
            min={0}
            max={PAUSAL_MAX_INCOME}
            step={100}
            value={income}
            onChange={(e) => clampIncome(Number(e.target.value))}
            className='mt-3 w-full accent-[#0d9488]'
            aria-label='Godišnji prihod klizačem'
          />
          <div className='mt-1 flex justify-between font-body text-xs text-[#64706e]'>
            <span>0 €</span>
            <span>60.000 €</span>
          </div>
        </div>
      </div>

      <div className='overflow-x-auto rounded-2xl border border-[#1f2a28] bg-[#111716]'>
        <table className='w-full min-w-[320px] border-collapse text-left text-sm'>
          <caption className='sr-only'>Porezni razredi paušalnog obrta 2026.</caption>
          <thead>
            <tr className='border-b border-[#1f2a28] text-xs uppercase tracking-wide text-[#64706e]'>
              <th className='px-3 py-3 font-medium'>Razred</th>
              <th className='px-3 py-3 font-medium'>Prihod (€)</th>
              <th className='px-3 py-3 font-medium'>Kvartal</th>
              <th className='px-3 py-3 font-medium'>Godišnje</th>
            </tr>
          </thead>
          <tbody>
            {PAUSAL_BRACKETS.map((b) => {
              const active = bracket?.razred === b.razred;
              return (
                <tr
                  key={b.razred}
                  className={`border-b border-[#1f2a28] last:border-b-0 ${
                    active ? 'bg-[#0d9488]/15' : ''
                  }`}
                >
                  <td className='px-3 py-3 font-heading font-semibold text-[#e2e8e7]'>
                    {b.razred}
                    {active ? (
                      <span className='ml-2 text-xs font-normal text-[#5eead4]'>(aktivno)</span>
                    ) : null}
                  </td>
                  <td className='px-3 py-3 text-[#b9c7c4]'>
                    {b.min.toLocaleString('hr-HR')} – {b.max.toLocaleString('hr-HR')}
                  </td>
                  <td className='px-3 py-3 text-[#e2e8e7]'>{eur.format(b.quarterly)}</td>
                  <td className='px-3 py-3 text-[#e2e8e7]'>{eur.format(b.annual)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className='rounded-2xl border border-[#0d9488]/35 bg-[#111716] p-5 sm:p-6'>
        <h2 className='font-heading text-lg font-semibold text-[#e2e8e7]'>Rezultat</h2>
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
                Stopa (efektivno)
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
          <span className='font-semibold text-[#0d9488]'>{eur.format(MJESECNI_DOPRINOSI_EUR)}</span>{' '}
          / mj. (do 15. u mjesecu).
        </p>
      </div>

      <div className='rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-[#b9c7c4]'>
        Ovo je procjena. Točan iznos ovisi o općini (prirez) i individualnoj situaciji.
      </div>
    </div>
  );
}

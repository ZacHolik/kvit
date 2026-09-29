'use client';

import { useState } from 'react';

import {
  PRICING,
  PROMO_ORANGE,
  type BillingPlan,
  eur,
  isPromoActive,
} from '@/config/pricing';

import PromoBadge from './PromoBadge';
import PromoLine from './PromoLine';

const PLAN_FEATURES = [
  'Neograničeni računi',
  'Automatski KPR i PO-SD',
  'Računi se fiskaliziraju automatski',
  'AI asistent neograničeno',
  'Podsjetnici na rokove',
  'eRačuni — zaprimanje besplatno',
] as const;

type PricingPlanSelectorProps = {
  defaultInterval?: BillingPlan;
  onCheckout: (plan: BillingPlan) => void;
  checkoutLoading?: boolean;
  /** register = teal theme; cijene = dark green card */
  theme?: 'cijene' | 'register';
};

export default function PricingPlanSelector({
  defaultInterval = 'yearly',
  onCheckout,
  checkoutLoading = false,
  theme = 'cijene',
}: PricingPlanSelectorProps) {
  const [selectedInterval, setSelectedInterval] =
    useState<BillingPlan>(defaultInterval);

  const isCijene = theme === 'cijene';
  const cardClass = isCijene
    ? 'relative flex flex-col rounded-2xl border border-[#0d9488] bg-[#111716] p-6 shadow-[0_0_32px_rgba(13,148,136,0.18)]'
    : 'relative flex flex-col rounded-2xl border border-tealBorder bg-tealSofter p-8 text-center md:p-10';

  const ctaLabel =
    selectedInterval === 'monthly'
      ? `Pretplati se za ${eur(PRICING.monthly.amount)}/mj →`
      : `Pretplati se za ${eur(PRICING.annual.amount)}/god →`;

  const btnClass = isCijene
    ? 'block w-full rounded-xl bg-[#0d9488] py-3 text-center text-sm font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-70'
    : 'mb-4 block w-full rounded-xl bg-teal px-6 py-4 text-center font-bold text-white transition hover:bg-tealHover disabled:cursor-not-allowed disabled:opacity-70';

  return (
    <div className={isCijene ? '' : 'mx-auto max-w-md'}>
      <div className={`${isCijene ? 'mb-6' : 'mb-8'} flex flex-col items-center gap-3`}>
        <div
          className={`inline-flex rounded-xl border p-1 ${
            isCijene
              ? 'border-[#1f2a28] bg-[#111716]'
              : 'border-tealBorder bg-[#0b0f0e]'
          }`}
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
              −{PRICING.annual.discountPct} %
            </span>
          </button>
        </div>

        {selectedInterval === 'monthly' ? (
          <div className='space-y-2 text-center'>
            <p className='text-sm text-[#94a3a0]'>
              → {eur(PRICING.monthly.amount)} svaki mjesec, na dan u mjesecu kad
              si se pretplatio.
            </p>
            {isPromoActive() ? (
              <button
                type='button'
                onClick={() => setSelectedInterval('yearly')}
                className='text-sm font-semibold underline-offset-2 hover:underline'
                style={{ color: PROMO_ORANGE }}
              >
                Uz {PRICING.promo.code} godišnje izlazi {eur(PRICING.promo.perMonth)}{' '}
                mjesečno →
              </button>
            ) : null}
          </div>
        ) : (
          <p className='text-center text-sm text-[#94a3a0]'>
            → {eur(PRICING.annual.amount)} odjednom, za 12 mjeseci unaprijed.
            Uštediš {eur(PRICING.annual.savings)}.
          </p>
        )}
      </div>

      <div className={cardClass}>
        {selectedInterval === 'yearly' && isPromoActive() ? <PromoBadge /> : null}

        {!isCijene ? (
          <>
            <p className='font-display mb-1 text-lg font-bold text-teal'>
              Kvik Paušalist
            </p>
            <p className='mb-6 text-sm text-mutedDim'>Pretplata</p>
          </>
        ) : (
          <div className='mb-4'>
            <p className='mt-1 text-xl font-bold text-[#e2e8e7]'>Paušalist</p>
          </div>
        )}

        {selectedInterval === 'monthly' ? (
          <div className={`mb-1 ${isCijene ? '' : 'mb-6 flex items-baseline justify-center gap-2'}`}>
            <span
              className={`font-bold text-white ${isCijene ? 'text-4xl text-[#e2e8e7]' : 'font-display text-5xl'}`}
            >
              {eur(PRICING.monthly.amount)}
            </span>
            <span className={isCijene ? 'ml-1 text-sm text-[#94a3a0]' : 'text-mutedDim'}>
              /mj
            </span>
          </div>
        ) : (
          <>
            <div
              className={`mb-1 ${isCijene ? '' : 'mb-4 flex flex-wrap items-baseline justify-center gap-2'}`}
            >
              <span
                className={`font-bold ${isCijene ? 'text-4xl text-[#e2e8e7]' : 'font-display text-5xl text-white'}`}
              >
                {eur(PRICING.annual.amount)}
              </span>
              <span className={isCijene ? 'ml-1 text-sm text-[#94a3a0]' : 'text-mutedDim'}>
                /god
              </span>
              <span className='text-sm text-[#94a3a0]'>
                ({eur(PRICING.annual.perMonth)} mjesečno)
              </span>
            </div>
            {isPromoActive() ? (
              <div className='mb-4'>
                <PromoLine variant='card' />
              </div>
            ) : null}
          </>
        )}

        {selectedInterval === 'monthly' && isCijene ? (
          <p className='mb-6 text-sm text-[#94a3a0]'>Za aktivne obrtnike</p>
        ) : null}

        <ul
          className={`mb-8 flex-1 space-y-2.5 text-sm ${
            isCijene ? 'text-[#b9c7c4]' : 'text-muted text-left'
          }`}
        >
          {PLAN_FEATURES.map((f) => (
            <li key={f} className='flex items-start gap-2'>
              <span className={`mt-0.5 shrink-0 ${isCijene ? 'text-[#0d9488]' : 'font-bold text-success'}`}>
                ✓
              </span>
              {f}
            </li>
          ))}
        </ul>

        <button
          type='button'
          onClick={() => onCheckout(selectedInterval)}
          disabled={checkoutLoading}
          className={btnClass}
        >
          {checkoutLoading ? 'Otvaram plaćanje...' : ctaLabel}
        </button>
        <p
          className={`mt-3 text-xs leading-relaxed ${
            isCijene ? 'text-[#94a3a0]' : 'text-mutedDim'
          }`}
        >
          30 dana bez rizika: ako ti Kvik ne odgovara, vraćamo cijeli iznos.
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

import { PRICING, PROMO_ORANGE, eur, isPromoActive } from '@/config/pricing';

type PromoLineVariant = 'card' | 'cta' | 'floating';

type PromoLineProps = {
  variant?: PromoLineVariant;
  className?: string;
};

function CopyCodeButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PRICING.promo.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type='button'
      onClick={() => void handleCopy()}
      className='shrink-0 rounded-lg border-2 px-3 py-1.5 text-sm font-semibold transition hover:brightness-110'
      style={{
        borderColor: PROMO_ORANGE,
        color: PROMO_ORANGE,
        backgroundColor: 'transparent',
      }}
    >
      {copied ? 'Kopirano ✓' : 'Kopiraj kôd'}
    </button>
  );
}

export default function PromoLine({
  variant = 'cta',
  className = '',
}: PromoLineProps) {
  if (!isPromoActive()) {
    return null;
  }

  const lineClass =
    'text-[15px] font-bold leading-snug sm:text-base';

  if (variant === 'card') {
    return (
      <div className={`space-y-2 ${className}`}>
        <p className={lineClass} style={{ color: PROMO_ORANGE }}>
          Uz kôd {PRICING.promo.code} prva godina je {eur(PRICING.promo.annualAmount)}{' '}
          ({eur(PRICING.promo.perMonth)} mjesečno).
        </p>
        <p className='text-xs leading-relaxed text-[#94a3a0]'>
          Kôd upisuješ na stranici za plaćanje. Vrijedi do {PRICING.promo.endsLabel}
        </p>
        <CopyCodeButton />
      </div>
    );
  }

  if (variant === 'floating') {
    return (
      <span className={`${lineClass} ${className}`} style={{ color: PROMO_ORANGE }}>
        {PRICING.promo.code}: prva godina {eur(PRICING.promo.annualAmount)} umjesto{' '}
        {eur(PRICING.annual.amount)}. Vrijedi do {PRICING.promo.endsLabel}
      </span>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <p className={lineClass} style={{ color: PROMO_ORANGE }}>
        {PRICING.promo.code}: prva godina {eur(PRICING.promo.annualAmount)} umjesto{' '}
        {eur(PRICING.annual.amount)}. Vrijedi do {PRICING.promo.endsLabel}
      </p>
      <CopyCodeButton />
    </div>
  );
}

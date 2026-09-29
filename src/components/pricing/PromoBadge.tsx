'use client';

import { PRICING, PROMO_ORANGE, isPromoActive } from '@/config/pricing';

export default function PromoBadge() {
  if (!isPromoActive()) {
    return null;
  }
  return (
    <span
      className='absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white'
      style={{ backgroundColor: PROMO_ORANGE }}
    >
      {PRICING.promo.code} · −{PRICING.promo.percentOff} %
    </span>
  );
}

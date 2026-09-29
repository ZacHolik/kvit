import { PRICING, eur, isPromoActive } from '@/config/pricing';

/** Stripe Checkout custom_text za godišnji plan dok traje PROMO26. */
export function yearlyCheckoutCustomText():
  | { submit: { message: string } }
  | undefined {
  if (!isPromoActive()) {
    return undefined;
  }
  return {
    submit: {
      message: `Imaš kôd ${PRICING.promo.code}? Klikni ‚Dodaj promotivni kôd' i upiši ga. Plaćaš ${eur(PRICING.promo.annualAmount)} umjesto ${eur(PRICING.annual.amount)}.`,
    },
  };
}

export function checkoutSessionPromoFields(interval: 'month' | 'year') {
  const customText =
    interval === 'year' ? yearlyCheckoutCustomText() : undefined;
  return {
    allow_promotion_codes: true as const,
    ...(customText ? { custom_text: customText } : {}),
  };
}

export const PRICING = {
  monthly: { amount: 15 },
  annual: { amount: 144, perMonth: 12, savings: 36, discountPct: 20 },
  promo: {
    code: 'PROMO26',
    percentOff: 50,
    annualAmount: 72,
    perMonth: 6,
    endsAt: '2026-12-31T23:59:59+01:00',
    endsLabel: '31. 12. 2026.',
  },
} as const;

export const PROMO_ORANGE = '#d97706';

export const isPromoActive = (now: Date = new Date()) =>
  now.getTime() <= new Date(PRICING.promo.endsAt).getTime();

/** „15 €": nerazdvojni razmak da se iznos ne lomi u dva reda */
export const eur = (n: number) => `${n}\u00A0€`;

export type BillingPlan = 'monthly' | 'yearly';

/** Kratki marketing tekst za upgrade s asistenta / alata. */
export function pausalistUpgradeLinkLabel(): string {
  return `nadograd na Paušalist (${eur(PRICING.monthly.amount)}/mj)`;
}

export function paidPlanTeaserShort(): string {
  if (isPromoActive()) {
    return `Pretplati se — ${eur(PRICING.monthly.amount)}/mj ili ${eur(PRICING.promo.perMonth)}/mj uz ${PRICING.promo.code} (prva godina ${eur(PRICING.promo.annualAmount)}).`;
  }
  return `Pretplati se — ${eur(PRICING.monthly.amount)}/mj ili ${eur(PRICING.annual.perMonth)}/mj uz godišnji plan.`;
}

export function kvikPricingAssistantSnippet(): string {
  const lines = [
    `KVIK CIJENE (ažurirano): Paušalist ${eur(PRICING.monthly.amount)}/mj ili ${eur(PRICING.annual.amount)}/god (${eur(PRICING.annual.perMonth)}/mj efektivno).`,
  ];
  if (isPromoActive()) {
    lines.push(
      `Promocija ${PRICING.promo.code}: prva godina godišnje pretplate ${eur(PRICING.promo.annualAmount)} umjesto ${eur(PRICING.annual.amount)} (${eur(PRICING.promo.perMonth)}/mj) — kôd upisuje se na Stripe checkout stranici. Vrijedi do ${PRICING.promo.endsLabel}`,
    );
  }
  return lines.join(' ');
}

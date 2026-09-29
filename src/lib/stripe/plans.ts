/**
 * Kvik plan + price definitions.
 *
 * Stripe Price ID-jevi dolaze iz env varijabli — ne hardkodiramo ih jer se
 * razlikuju između test i prod modova.
 *
 * Iznosi za prikaz: @/config/pricing (PRICING).
 *
 * Usage:
 *   import { PLANS, getPriceId } from '@/lib/stripe/plans'
 */

import { PRICING } from '@/config/pricing';

export type PlanId = 'free' | 'pausalist';
export type BillingInterval = 'month' | 'year';

export interface Plan {
  id: PlanId;
  name: string;
  /** Cijena prikazana korisniku */
  displayPriceMonthly: number; // EUR
  displayPriceYearly: number; // EUR (godišnji ukupno)
  /** Efektivna cijena po mjesecu za godišnji plan */
  displayPriceYearlyPerMonth: number; // EUR
  currency: 'EUR';
  features: string[];
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: 'free',
    name: 'Besplatno',
    displayPriceMonthly: 0,
    displayPriceYearly: 0,
    displayPriceYearlyPerMonth: 0,
    currency: 'EUR',
    features: [
      'AI asistent — 3 pitanja dnevno',
      'Kalkulator poreza',
      'Kalkulator doprinosa',
      'PO-SD generator',
    ],
  },
  pausalist: {
    id: 'pausalist',
    name: 'Pausalist',
    displayPriceMonthly: PRICING.monthly.amount,
    displayPriceYearly: PRICING.annual.amount,
    displayPriceYearlyPerMonth: PRICING.annual.perMonth,
    currency: 'EUR',
    features: [
      'Sve iz besplatnog plana',
      'AI asistent — neograničeno',
      'Izdavanje R1 računa s fiskalizacijom',
      'KPR (Knjiga primitaka i rashoda)',
      'PO-SD automatski iz KPR-a',
      'Generiranje HUB-3 uplatnica',
      'Ponude / predračuni',
      'Email slanje računa',
    ],
  },
};

/**
 * Vraća Stripe Price ID za odabrani plan i interval.
 * Baca ako env nije postavljen — bolje odmah u dev nego tihi fail u prod.
 */
export function getPriceId(interval: BillingInterval): string {
  if (interval === 'year') {
    const id = process.env.STRIPE_PRICE_YEARLY;
    if (!id) throw new Error('Missing env var: STRIPE_PRICE_YEARLY');
    return id;
  }
  const id = process.env.STRIPE_PRICE_MONTHLY;
  if (!id) throw new Error('Missing env var: STRIPE_PRICE_MONTHLY');
  return id;
}

/** Supabase `plan` kolona string → PlanId  */
export function toPlanId(raw: string | null | undefined): PlanId {
  if (raw === 'pausalist' || raw === 'pro') return 'pausalist';
  return 'free';
}

import { eur } from '@/config/pricing';

/** Prikaz intervala pretplate s iznosom iz naplate (ne iz marketing PRICING). */
export function subscriptionPlanIntervalLabel(
  interval: string | null,
  amountEur: number | null | undefined,
): string {
  if (interval === 'year') {
    const base = 'Godišnji';
    if (amountEur == null || Number.isNaN(amountEur)) {
      return base;
    }
    const perMonth = Math.round((amountEur / 12) * 100) / 100;
    return `${base} (${eur(perMonth)}/mj)`;
  }
  if (interval === 'month') {
    const base = 'Mjesečni';
    if (amountEur == null || Number.isNaN(amountEur)) {
      return base;
    }
    return `${base} (${eur(amountEur)}/mj)`;
  }
  return 'Plan';
}

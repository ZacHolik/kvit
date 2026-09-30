export const PARTNER_CODES = ['PR01'] as const;

export type PartnerCode = (typeof PARTNER_CODES)[number];

export function isPartnerCode(kod: string): kod is PartnerCode {
  return (PARTNER_CODES as readonly string[]).includes(kod);
}

export function canonicalPartnerCode(kod: string): PartnerCode | null {
  const upper = kod.toUpperCase();
  return isPartnerCode(upper) ? upper : null;
}

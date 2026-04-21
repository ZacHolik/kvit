export type PausalBracket = {
  razred: number;
  min: number;
  max: number;
  monthly: number;
  quarterly: number;
  annual: number;
};

/**
 * Paušalni porez na dohodak — razredi 1–7, službeni iznosi za 2026.
 * Izvor: fiskalopedija.hr/pausalni-obrt-razredi
 */
export const PAUSAL_BRACKETS: PausalBracket[] = [
  { razred: 1, min: 0, max: 11_300, monthly: 16.95, quarterly: 50.85, annual: 203.4 },
  { razred: 2, min: 11_300, max: 15_300, monthly: 22.86, quarterly: 68.58, annual: 274.32 },
  { razred: 3, min: 15_300, max: 19_900, monthly: 29.85, quarterly: 89.55, annual: 358.2 },
  { razred: 4, min: 19_900, max: 30_600, monthly: 45.9, quarterly: 137.7, annual: 550.8 },
  { razred: 5, min: 30_600, max: 40_000, monthly: 60.0, quarterly: 180.0, annual: 720.0 },
  { razred: 6, min: 40_000, max: 50_000, monthly: 75.0, quarterly: 225.0, annual: 900.0 },
  { razred: 7, min: 50_000, max: 60_000, monthly: 90.0, quarterly: 270.0, annual: 1_080.0 },
];

export const PAUSAL_MAX_INCOME = 60_000;

/** Zdravstveno + mirovinsko, tipični iznos (podsjetnik). */
export const MJESECNI_DOPRINOSI_EUR = 290.98;

export function pausalBracketForIncome(income: number): PausalBracket | null {
  if (!Number.isFinite(income) || income <= 0) {
    return null;
  }
  const capped = Math.min(PAUSAL_MAX_INCOME, income);
  for (const b of PAUSAL_BRACKETS) {
    if (capped > b.min && capped <= b.max) {
      return b;
    }
  }
  return null;
}

/** Boja segmenta trake 0–60k € prema razredu (1–7). */
export function bracketTrackColor(razred: number): string {
  const map: Record<number, string> = {
    1: '#64748b',
    2: '#0ea5e9',
    3: '#06b6d4',
    4: '#0d9488',
    5: '#84cc16',
    6: '#f97316',
    7: '#ef4444',
  };
  return map[razred] ?? '#334155';
}

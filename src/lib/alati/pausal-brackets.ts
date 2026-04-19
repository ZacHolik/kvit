export type PausalBracket = {
  razred: number;
  min: number;
  max: number;
  quarterly: number;
  annual: number;
};

/** Paušalni porez na dohodak — razredi 0–4, iznosi 2026. (informativno). */
export const PAUSAL_BRACKETS: PausalBracket[] = [
  { razred: 0, min: 0, max: 11_300, quarterly: 50.85, annual: 203.4 },
  { razred: 1, min: 11_300, max: 22_600, quarterly: 101.7, annual: 406.8 },
  { razred: 2, min: 22_600, max: 33_900, quarterly: 152.55, annual: 610.2 },
  { razred: 3, min: 33_900, max: 45_200, quarterly: 237.7, annual: 950.8 },
  { razred: 4, min: 45_200, max: 60_000, quarterly: 338.75, annual: 1_355.0 },
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

/** Boja segmenta trake 0–60k € prema razredu. */
export function bracketTrackColor(razred: number): string {
  const map: Record<number, string> = {
    0: '#64748b',
    1: '#0ea5e9',
    2: '#0d9488',
    3: '#eab308',
    4: '#f97316',
  };
  return map[razred] ?? '#334155';
}

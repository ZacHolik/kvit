// DISABLED 6.6.2026. — vidi KVIK_MASTER_BRIEF v2.6 + Marketing chat odluka.
// Ne uključuj bez odobrenja marketing chata.
// Uvjeti za ON: exit due diligence, dedicirani landing kampanja,
// ili ≥100 plaćenih korisnika.
export const priceLockEnabled =
  process.env.NEXT_PUBLIC_PRICE_LOCK_FEATURE === 'true';

// Određuje je li vodič "compliance" (obveza/zakon) ili "how-to".
// Compliance → FLOATING-CTA-A obvezno (ne obećavamo preuzimanje pravne odgovornosti).
// How-to → FLOATING-CTA-B dozvoljen ("Kvik to radi umjesto tebe").

export type PageVariant = 'compliance' | 'howto';

// Eksplicitni override po slugu. Dodaj ovdje kako pišeš nove vodiče.
const COMPLIANCE_SLUGS = new Set<string>([
  'fiskalizacija',
  'fiskalizacija-2-0',
  'eracuni',
  'eracun',
  'pdv-prag',
  'pdv-prelazak',
  'pdv',
  'rokovi',
  'po-sd-obveza',
  'po-sd',
  'doprinosi-obveza',
  'doprinosi',
  'kazne',
  'porezne-obveze',
  'godisnji-porez',
  'kpr-obveza',
]);

const HOWTO_SLUGS = new Set<string>([
  'kako-izdati-racun',
  'kako-odabrati-djelatnost',
  'fotograf',
  'frizer',
  'it',
  'programer',
  'prijevoditelj',
  'arhitekt',
  'majstor',
  'revolut',
  'wise',
  'kreiraj-obrt',
  'otvaranje-obrta',
]);

// Keyword fallback ako slug nije eksplicitno mapiran.
const COMPLIANCE_KEYWORDS = ['obveza', 'zakon', 'rok', 'kazna', 'porez', 'fiskal', 'eracun'];

export function detectPageVariant(slug: string): PageVariant {
  const s = slug.toLowerCase();
  if (COMPLIANCE_SLUGS.has(s)) return 'compliance';
  if (HOWTO_SLUGS.has(s)) return 'howto';
  if (COMPLIANCE_KEYWORDS.some((kw) => s.includes(kw))) return 'compliance';
  // Granično → siguran default
  return 'compliance';
}

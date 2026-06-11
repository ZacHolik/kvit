// Određuje je li vodič "compliance" (obveza/zakon) ili "how-to".
// Compliance → FLOATING-CTA-A obvezno (ne obećavamo preuzimanje pravne odgovornosti).
// How-to → FLOATING-CTA-B dozvoljen ("Kvik to radi umjesto tebe").

export type PageVariant = 'compliance' | 'howto';

// Eksplicitni override po slugu. Dodaj ovdje kako pišeš nove vodiče.
const COMPLIANCE_SLUGS = new Set<string>([
  'fiskalizacija',
  'fiskalizacija-2-0',
  'fiskalizacija-20',
  'fina-certifikat-fiskalizacija',
  'usporedba-fiskalizacija-1-2',
  'eracuni',
  'eracun',
  'pdv-prag',
  'pdv-prelazak',
  'pdv',
  'pdv-id',
  'pdv-facebook-oglasavanje',
  'rokovi',
  'rokovi-placanja',
  'po-sd-obveza',
  'po-sd',
  'po-sd-obrazac',
  'doprinosi-obveza',
  'doprinosi',
  'doprinosi-uz-posao',
  'povrat-preplacenih-doprinosa',
  'kazne',
  'porezne-obveze',
  'porez-na-dohodak',
  'godisnji-porez',
  'kpr-obveza',
  'kpr-knjiga-prometa',
  'prikriveni-radni-odnos',
  'rpo-obrazac',
]);

const HOWTO_SLUGS = new Set<string>([
  'kako-izdati-racun',
  'izdavanje-racuna',
  'izdavanje-racuna-vodic',
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
  'prvi-koraci-nakon-obrta',
  'pausalni-obrt-vodic',
  'pausalni-obrt-za-fotografe',
  'pausalni-obrt-za-it-freelancere',
  'pausalni-obrt-za-kozmeticare',
  'pausalni-obrt-za-ugostitelje',
  'pausalni-obrt-za-konzultante',
  'pausalni-obrt-vs-doo',
  'bankovni-racun-pausalisti',
  'alati-za-pausalne-obrtnike',
  'kpr-online-generator',
  'zatvaranje-obrta',
  'sezonski-obrt',
  'storno-racuna',
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

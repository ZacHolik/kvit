/**
 * Sastavlja tekst za HRVHUB30 PDF417 (EUR) — struktura prema uobičajenom HUB-3 obliku.
 * Iznos u centima, 15 znamenki. Primatelj i IBAN moraju odgovarati stvarnoj uplatnici;
 * ovdje su generički podaci za demonstraciju u alatu (korisnik provjerava kod HZZO/HZMO).
 */

export type Hub3EurInput = {
  /** Iznos u EUR (npr. 290.98) */
  iznosEur: number;
  platiteljIme: string;
  platiteljAdresa1: string;
  platiteljAdresa2: string;
  primateljIme: string;
  primateljAdresa1: string;
  primateljAdresa2: string;
  iban: string;
  /** npr. HR01 */
  model: string;
  /** Poziv na broj */
  pozivNaBroj: string;
  sifraNamjene: string;
  opis: string;
};

function padAmountCents(eur: number): string {
  const cents = Math.round(eur * 100);
  const s = String(Math.max(0, cents));
  return s.padStart(15, '0').slice(-15);
}

function line(s: string, max = 30): string {
  const t = s.trim().slice(0, max);
  return t;
}

export function buildHub30EurCode(input: Hub3EurInput): string {
  const rows = [
    'HRVHUB30',
    'EUR',
    padAmountCents(input.iznosEur),
    line(input.platiteljIme, 30),
    line(input.platiteljAdresa1, 27),
    line(input.platiteljAdresa2, 27),
    line(input.primateljIme, 25),
    line(input.primateljAdresa1, 25),
    line(input.primateljAdresa2, 27),
    line(input.iban.replace(/\s/g, ''), 34),
    line(input.model, 4),
    line(input.pozivNaBroj.replace(/\s/g, ''), 22),
    line(input.sifraNamjene, 4),
    line(input.opis, 35),
  ];
  return rows.join('\n');
}

/** Ilustrativni IBAN / primatelj — korisnik zamijeni podacima s uplatnice. */
export const DOPRINOSI_PRIMATELJ_DEMO = {
  naziv: 'HZZO (ilustrativno — provjeri IBAN)',
  adresa1: 'Mjesto uplate',
  adresa2: 'Hrvatska',
  /** Format HR + brojevi; provjeri na službenim uplatnicama. */
  iban: 'HR1210010051863000160',
};

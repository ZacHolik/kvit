/** Stari zapis u bazi (bez dijakritike na „račun”). */
const LEGACY_KPR_AUTOMAT_OPIS_PREFIX = 'Automatski unos za racun';

/**
 * Opis KPR retka kad se račun automatski unosi (npr. nakon plaćanja).
 * Koristi se pri insertu u `kpr_unosi`.
 */
export function opisAutomatskogKprUnosaZaRacun(brojRacuna: string): string {
  return `Automatski unos za račun ${brojRacuna}`;
}

/**
 * PDF/XLSX: ispravlja stari tekst iz baze bez „č“ u riječi račun.
 */
export function normalizeKprOpisZaEksport(
  opis: string | null | undefined,
): string {
  const s = opis ?? '';
  return s.replaceAll(
    LEGACY_KPR_AUTOMAT_OPIS_PREFIX,
    'Automatski unos za račun',
  );
}

/** Godina iz ?year= za KPR izvoz; inače tekuća kalendarska godina. */
export function getKprExportYear(searchParams: URLSearchParams): number {
  const raw = searchParams.get('year');
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  const current = new Date().getFullYear();
  if (Number.isNaN(parsed) || parsed < 2000 || parsed > 2100) {
    return current;
  }
  return parsed;
}

export function kprDatumRangeZaGodinu(godina: number): {
  od: string;
  kraj: string;
} {
  return { od: `${godina}-01-01`, kraj: `${godina}-12-31` };
}

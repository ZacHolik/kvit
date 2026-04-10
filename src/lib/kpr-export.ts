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

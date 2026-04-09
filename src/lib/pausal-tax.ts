/**
 * Paušalni porez po razredima primitaka — 2026. (kvartalni iznos po razredu).
 * Izvor: Kvit specifikacija proizvoda.
 *
 * Granicni razredi: [donja, gornja) osim zadnjeg [50000, 60000].
 */
const RAZREDI_2026: Array<{
  od: number;
  do: number | 'INF';
  porezKvartalnoEur: number;
}> = [
  { od: 0, do: 11300, porezKvartalnoEur: 50.85 },
  { od: 11300, do: 15300, porezKvartalnoEur: 68.58 },
  { od: 15300, do: 19900, porezKvartalnoEur: 89.55 },
  { od: 19900, do: 30600, porezKvartalnoEur: 137.7 },
  { od: 30600, do: 40000, porezKvartalnoEur: 180 },
  { od: 40000, do: 50000, porezKvartalnoEur: 225 },
  { od: 50000, do: 60000, porezKvartalnoEur: 270 },
];

export type PausalRazredInfo = {
  label: string;
  min: number;
  max: number | null;
  porezKvartalnoEur: number;
  porezGodisnjeEur: number;
};

function formatEur(n: number) {
  return new Intl.NumberFormat('hr-HR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function getPausalRazred2026(godisnjiPrimici: number): PausalRazredInfo | null {
  const value = Number(godisnjiPrimici);
  if (Number.isNaN(value) || value < 0) {
    return null;
  }

  for (let i = 0; i < RAZREDI_2026.length; i += 1) {
    const row = RAZREDI_2026[i];
    const zadnji = i === RAZREDI_2026.length - 1;

    if (row.do === 'INF') {
      break;
    }

    const gornja = row.do;
    const uOpsegu = zadnji
      ? value >= row.od && value <= gornja
      : value >= row.od && value < gornja;

    if (uOpsegu) {
      const label = zadnji
        ? `${formatEur(row.od)} – ${formatEur(gornja)} €`
        : `${formatEur(row.od)} – ispod ${formatEur(gornja)} €`;

      return {
        label,
        min: row.od,
        max: zadnji ? gornja : gornja,
        porezKvartalnoEur: row.porezKvartalnoEur,
        porezGodisnjeEur: row.porezKvartalnoEur * 4,
      };
    }
  }

  return {
    label: 'Iznad 60.000 € — provjeri PDV i poreske obveze',
    min: 60000,
    max: null,
    porezKvartalnoEur: 0,
    porezGodisnjeEur: 0,
  };
}

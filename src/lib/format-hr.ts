/**
 * HR prikaz datuma: ISO YYYY-MM-DD ili Date → DD.MM.YYYY.
 */
export function formatDatumHr(value: string | Date | null | undefined): string {
  if (value == null) {
    return '—';
  }
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return '—';
    }
    const d = value.getDate().toString().padStart(2, '0');
    const m = (value.getMonth() + 1).toString().padStart(2, '0');
    const y = value.getFullYear();
    return `${d}.${m}.${y}.`;
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!m) {
    return value;
  }
  return `${m[3]}.${m[2]}.${m[1]}.`;
}

const RACUN_STATUS_LABELS: Record<string, string> = {
  izdano: 'Izdano',
  placeno: 'Plaćeno',
  stornirano: 'Stornirano',
};

/** Status iz baze (racuni.status) → label za prikaz. */
export function formatRacunStatusHr(status: string): string {
  return RACUN_STATUS_LABELS[status] ?? status;
}

/** Iznos u EUR prema hr-HR (npr. 6.240,00 €). */
export function formatIznosEurHr(amount: number): string {
  return new Intl.NumberFormat('hr-HR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

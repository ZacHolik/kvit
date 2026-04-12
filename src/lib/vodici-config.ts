/** Javna baza URL-a za SEO (og:url, sitemap, JSON-LD). */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'https://kvit.online'
  );
}

export type VodiciCategoryId = 'osnove' | 'porezi' | 'fiskalizacija';

export type VodiciEntry = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  readingMinutes: number;
  category: VodiciCategoryId;
  primaryKeyword: string;
};

export const VODICI_CATEGORY_LABELS: Record<VodiciCategoryId, string> = {
  osnove: 'Osnove',
  porezi: 'Porezi',
  fiskalizacija: 'Fiskalizacija',
};

export const VODICI_ENTRIES: VodiciEntry[] = [
  {
    slug: 'pausalni-obrt-vodic',
    title: 'Paušalni obrt 2026. – kompletan vodič',
    shortTitle: 'Paušalni obrt 2026.',
    description:
      'Što je paušalni obrt, tko ga može otvoriti, limit 60.000 €, obveze i usporedba s d.o.o. Savjeti za paušaliste u Hrvatskoj.',
    readingMinutes: 14,
    category: 'osnove',
    primaryKeyword: 'paušalni obrt 2026',
  },
  {
    slug: 'fiskalizacija-20',
    title: 'Fiskalizacija 2.0 za paušaliste – vodič 2026.',
    shortTitle: 'Fiskalizacija 2.0',
    description:
      'Fiskalizacija 2.0 za paušaliste: transakcijski računi, eRačuni, rokovi B2C i B2B te kako se pripremiti bez stresa.',
    readingMinutes: 12,
    category: 'fiskalizacija',
    primaryKeyword: 'fiskalizacija 2.0 paušalisti',
  },
  {
    slug: 'po-sd-obrazac',
    title: 'PO-SD obrazac 2026. – kako ispuniti i predati',
    shortTitle: 'PO-SD obrazac',
    description:
      'PO-SD obrazac: rok do 15. siječnja, ispunjavanje, ePorezna i česte greške. Vodič za paušalni obrt u Hrvatskoj.',
    readingMinutes: 11,
    category: 'porezi',
    primaryKeyword: 'PO-SD obrazac kako ispuniti',
  },
  {
    slug: 'doprinosi',
    title: 'Doprinosi za paušalni obrt 2026. – iznosi i rokovi',
    shortTitle: 'Doprinosi',
    description:
      'Doprinosi paušalni obrt iznos 2026.: mirovinsko, zdravstveno, ukupno 290,98 €, rokovi i što ako zakasniš.',
    readingMinutes: 10,
    category: 'porezi',
    primaryKeyword: 'doprinosi paušalni obrt iznos',
  },
  {
    slug: 'otvaranje-obrta',
    title: 'Kako otvoriti paušalni obrt 2026. – korak po korak',
    shortTitle: 'Otvaranje obrta',
    description:
      'Kako otvoriti paušalni obrt: dokumenti, e-Obrtnica, troškovi i što napraviti odmah nakon registracije.',
    readingMinutes: 13,
    category: 'osnove',
    primaryKeyword: 'kako otvoriti paušalni obrt',
  },
  {
    slug: 'izdavanje-racuna',
    title: 'Izdavanje računa u paušalnom obrtu – što mora pisati',
    shortTitle: 'Izdavanje računa',
    description:
      'Izdavanje računa paušalni obrt: obvezni elementi, format broja, PDV napomena, IBAN i čuvanje dokumenata.',
    readingMinutes: 11,
    category: 'osnove',
    primaryKeyword: 'izdavanje računa paušalni obrt',
  },
  {
    slug: 'kpr-knjiga-prometa',
    title: 'KPR – Knjiga prometa za paušaliste 2026.',
    shortTitle: 'KPR knjiga prometa',
    description:
      'KPR knjiga prometa paušalisti: što se upisuje, gotovina i bezgotovina, rokovi i veza s PO-SD obrascem.',
    readingMinutes: 10,
    category: 'osnove',
    primaryKeyword: 'KPR knjiga prometa paušalisti',
  },
];

export function vodiciEntryBySlug(slug: string): VodiciEntry | undefined {
  return VODICI_ENTRIES.find((e) => e.slug === slug);
}

export function vodiciHref(slug: string): string {
  return `/vodici/${slug}`;
}

/** Canonical marketing origin (sitemap, robots, OG, JSON-LD) — uvijek apex domena. */
export const CANONICAL_SITE_ORIGIN = 'https://kvit.online';

/**
 * Javna baza URL-a za SEO (og:url, sitemap, JSON-LD, robots).
 * Deploy na app.kvit.online ne smije ući u sitemap — normaliziramo na kvit.online.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || '';
  if (!raw) {
    return CANONICAL_SITE_ORIGIN;
  }
  try {
    const url = new URL(raw);
    if (url.hostname === 'app.kvit.online') {
      return CANONICAL_SITE_ORIGIN;
    }
  } catch {
    // ako env nije valjan URL, fallback
    return CANONICAL_SITE_ORIGIN;
  }
  return raw;
}

export type VodiciCategoryId =
  | 'osnove'
  | 'djelatnosti'
  | 'porezi'
  | 'fiskalizacija';

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
  djelatnosti: 'Po djelatnostima',
  porezi: 'Porezi',
  fiskalizacija: 'Fiskalizacija',
};

/**
 * Redoslijed unutar kategorije = redoslijed kartica na /vodici.
 * Brojke i rokovi u tekstovima usklađeni su sa službenim izvorima (Porezna uprava, NN)
 * i s Kvit vodičima / alatima — bez vanjskih edukativnih portala.
 */
export const VODICI_ENTRIES: VodiciEntry[] = [
  // =========================================================================
  // OSNOVE
  // =========================================================================
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
    slug: 'rpo-obrazac',
    title: 'RPO obrazac – kako ispuniti i predati online 2026.',
    shortTitle: 'RPO obrazac',
    description:
      'Što je RPO obrazac, tko ga mora predati, rokovi i kako ga predati putem ePorezne korak po korak.',
    readingMinutes: 11,
    category: 'osnove',
    primaryKeyword: 'RPO obrazac paušalni obrt',
  },
  {
    slug: 'doprinosi-uz-posao',
    title: 'Doprinosi paušalni obrt uz posao 2026.',
    shortTitle: 'Doprinosi uz zaposlenje',
    description:
      'Kako se plaćaju doprinosi ako uz paušalni obrt imaš i zaposlenje. Točni iznosi 2026., godišnje rješenje i rokovi.',
    readingMinutes: 9,
    category: 'osnove',
    primaryKeyword: 'doprinosi paušalni obrt uz posao',
  },
  {
    slug: 'rokovi-placanja',
    title: 'Rokovi plaćanja paušalni obrt 2026. – svi rokovi',
    shortTitle: 'Rokovi plaćanja',
    description:
      'Kompletan cheat sheet svih rokova za paušalne obrtnike: doprinosi, porez, PO-SD, HOK.',
    readingMinutes: 9,
    category: 'osnove',
    primaryKeyword: 'rokovi plaćanja paušalni obrt 2026',
  },
  {
    slug: 'zatvaranje-obrta',
    title: 'Kako zatvoriti paušalni obrt 2026. – korak po korak',
    shortTitle: 'Zatvaranje obrta',
    description:
      'Postupak zatvaranja paušalnog obrta: dokumenti, redoslijed koraka, rokovi i obveze koje ostaju.',
    readingMinutes: 10,
    category: 'osnove',
    primaryKeyword: 'zatvaranje paušalnog obrta',
  },
  {
    slug: 'sezonski-obrt',
    title: 'Sezonski paušalni obrt – mirovanje i doprinosi',
    shortTitle: 'Sezonski obrt i mirovanje',
    description:
      'Sve o mirovanju paušalnog obrta: kako prijaviti, doprinosi za neaktivne mjesece, KPR i PO-SD.',
    readingMinutes: 9,
    category: 'osnove',
    primaryKeyword: 'sezonski paušalni obrt mirovanje',
  },
  {
    slug: 'knjiga-trazbi',
    title: 'Knjiga tražbina paušalni obrt – moraš li je voditi',
    shortTitle: 'Knjiga tražbina',
    description:
      'Što je knjiga tražbina, razlika prema KPR-u i tko je obvezan voditi evidenciju nenaplaćenih računa.',
    readingMinutes: 8,
    category: 'osnove',
    primaryKeyword: 'knjiga tražbina paušalni obrt',
  },
  {
    slug: 'pausalni-obrt-vs-doo',
    title: 'Paušalni obrt vs d.o.o. – kada prijeći i što uzeti u obzir',
    shortTitle: 'Paušalni obrt vs d.o.o.',
    description:
      'Usporedba paušalnog obrta i d.o.o.: troškovi, odgovornost, porezi i kada je pravo vrijeme za promjenu.',
    readingMinutes: 12,
    category: 'osnove',
    primaryKeyword: 'paušalni obrt vs d.o.o.',
  },
  {
    slug: 'prikriveni-radni-odnos',
    title: 'Prikriveni radni odnos – što je, kako ga izbjeći i rizici',
    shortTitle: 'Prikriveni radni odnos',
    description:
      'Što je prikriveni radni odnos, kako ga Porezna prepoznaje i kako IT freelanceri mogu smanjiti rizik.',
    readingMinutes: 12,
    category: 'osnove',
    primaryKeyword: 'prikriveni radni odnos paušalac',
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
  {
    slug: 'alati-za-pausalne-obrtnike',
    title:
      'Alati za paušalne obrtnike 2026. — zašto izolirani alati nisu dovoljni',
    shortTitle: 'Alati za paušalne obrtnike',
    description:
      'Kalkulator, uplatnica, checklista i PO-SD generator kao izolirani alati ne rade umjesto tebe. Kako Kvit povezuje sve u jedan sustav.',
    readingMinutes: 9,
    category: 'osnove',
    primaryKeyword: 'alati za paušalne obrtnike',
  },

  // =========================================================================
  // PO DJELATNOSTIMA (IT vodič ovdje — posebno za freelancere / platforme)
  // =========================================================================
  {
    slug: 'pausalni-obrt-za-it-freelancere',
    title: 'Paušalni obrt za IT freelancere – kompletan vodič 2026.',
    shortTitle: 'Paušalni obrt za IT freelancere',
    description:
      'Sve što IT freelancer treba znati o paušalnom obrtu: ugovori, limiti, fiskalizacija, kada prijeći na d.o.o.',
    readingMinutes: 13,
    category: 'djelatnosti',
    primaryKeyword: 'paušalni obrt za IT freelancere',
  },
  {
    slug: 'pausalni-obrt-za-konzultante',
    title: 'Paušalni obrt za konzultante i dizajnere 2026.',
    shortTitle: 'Paušalni obrt za konzultante',
    description:
      'IT konzultanti, UX/UI dizajneri i arhitekti: paušalni obrt, prikriveni radni odnos i inozemni klijenti.',
    readingMinutes: 12,
    category: 'djelatnosti',
    primaryKeyword: 'paušalni obrt za konzultante',
  },
  {
    slug: 'pausalni-obrt-za-kozmeticare',
    title: 'Paušalni obrt za kozmetičare – vodič 2026.',
    shortTitle: 'Paušalni obrt za kozmetičare',
    description:
      'Kozmetičari i beauty terapeuti: kako otvoriti paušalni obrt, koje su obveze i kako voditi poslovanje.',
    readingMinutes: 11,
    category: 'djelatnosti',
    primaryKeyword: 'paušalni obrt za kozmetičare',
  },
  {
    slug: 'pausalni-obrt-za-fotografe',
    title: 'Paušalni obrt za fotografe – vodič 2026.',
    shortTitle: 'Paušalni obrt za fotografe',
    description:
      'Fotografi i snimatelji: paušalni obrt, autorski ugovori, oprema kao trošak i fiskalizacija.',
    readingMinutes: 11,
    category: 'djelatnosti',
    primaryKeyword: 'paušalni obrt za fotografe',
  },
  {
    slug: 'pausalni-obrt-za-ugostitelje',
    title: 'Paušalni obrt za ugostitelje 2026.',
    shortTitle: 'Paušalni obrt za ugostitelje',
    description:
      'Ugostitelji i paušalni obrt: fiskalizacija, turistička članarina, sezonsko poslovanje i limit 60.000 €.',
    readingMinutes: 11,
    category: 'djelatnosti',
    primaryKeyword: 'paušalni obrt za ugostitelje',
  },

  // =========================================================================
  // POREZI
  // =========================================================================
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
    slug: 'porez-na-dohodak',
    title: 'Porez na dohodak u paušalnom obrtu 2026.',
    shortTitle: 'Porez na dohodak',
    description:
      'Kako se obračunava paušalni porez na dohodak, 7 poreznih razreda, kvartalni rokovi i kako platiti.',
    readingMinutes: 12,
    category: 'porezi',
    primaryKeyword: 'porez na dohodak paušalni obrt 2026',
  },
  {
    slug: 'turisticka-clanarina',
    title: 'Turistička članarina – tko plaća i koliko 2026.',
    shortTitle: 'Turistička članarina',
    description:
      'Koji paušalni obrtnici moraju plaćati turističku članarinu, iznosi za 2026. i kako ispuniti TZ1 obrazac.',
    readingMinutes: 11,
    category: 'porezi',
    primaryKeyword: 'turistička članarina paušalni obrt',
  },
  {
    slug: 'pdv-id',
    title: 'PDV ID broj za paušalce – kada ti treba',
    shortTitle: 'PDV ID broj',
    description:
      'PDV ID nije ulazak u PDV sustav. Kada ga paušalist mora zatražiti i kako — konkretni primjeri.',
    readingMinutes: 10,
    category: 'porezi',
    primaryKeyword: 'PDV ID broj paušalni obrt',
  },

  // =========================================================================
  // FISKALIZACIJA
  // =========================================================================
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
    slug: 'fina-certifikat-fiskalizacija',
    title: 'FINA certifikat za fiskalizaciju — kako nabaviti i koliko košta',
    shortTitle: 'FINA certifikat fiskalizacija',
    description:
      'Certilia vs FINA PKI, što trebaš za nabavu, cijene i obnova, tko ne treba certifikat i što nakon instalacije (ZKI, JIR).',
    readingMinutes: 8,
    category: 'fiskalizacija',
    primaryKeyword: 'FINA certifikat fiskalizacija paušalni obrt',
  },
  {
    slug: 'kpr-online-generator',
    title: 'KPR online – kako voditi knjige prometa digitalno',
    shortTitle: 'KPR online generator',
    description:
      'Kako voditi KPR knjige prometa online: što se upisuje, greške koje paušalci rade i veza s PO-SD.',
    readingMinutes: 9,
    category: 'fiskalizacija',
    primaryKeyword: 'KPR online paušalni obrt',
  },
  {
    slug: 'izdavanje-racuna-vodic',
    title: 'Vodič za izdavanje računa – paušalni obrt 2026.',
    shortTitle: 'Vodič za izdavanje računa',
    description:
      'Kompletan vodič za izdavanje računa: interni akt, numeracija, obvezni elementi, fiskalizacija i čuvanje.',
    readingMinutes: 12,
    category: 'fiskalizacija',
    primaryKeyword: 'izdavanje računa paušalni obrt vodič',
  },
];

export function vodiciEntryBySlug(slug: string): VodiciEntry | undefined {
  return VODICI_ENTRIES.find((e) => e.slug === slug);
}

export function vodiciHref(slug: string): string {
  return `/vodici/${slug}`;
}

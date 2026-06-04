// Centralni copy za sve CTA pozicije. Evergreen.
// Uređivati ovdje; komponente čitaju iz ovog fajla.

export type CtaVariant = 'A' | 'B' | 'C';

// =====================================================
// VRH — vodiči
// =====================================================
export const TOP_VODIC = {
  A: {
    text:
      'Imaš pitanje koje ovaj vodič ne pokriva? Kvik AI asistent odgovara na pitanja o paušalnom obrtu na hrvatskom — bez tražilice, bez čekanja.',
    button: 'Pitaj asistenta',
    href: '/asistent',
  },
  B: {
    text:
      'Čitanje oduzima vrijeme. Ako te konkretno nešto muči — pitaj direktno i dobit ćeš odgovor za svoju situaciju.',
    button: 'Postavi pitanje',
    href: '/asistent',
  },
} as const;

// =====================================================
// VRH — alati
// =====================================================
// NAPOMENA: href je placeholder. Po stranici proslijedi konkretan
// (/alati/po-sd, /alati/kalkulator-poreza, itd.) kroz prop `ctaHrefOverride`.
export const TOP_ALAT = {
  A: {
    text: 'Alat je besplatan. Popuni polja i dobij rezultat — nema registracije, nema čekanja.',
    button: 'Kreni',
    href: '/alati',
  },
  B: {
    text:
      'Ovo je samo jedan alat. Kvik ih ima osmero — računi, KPR, doprinosi, fiskalizacija. Isprobaj i ostale kad završiš.',
    button: 'Vidi sve alate',
    href: '/alati',
  },
} as const;

// =====================================================
// SREDINA (InlineCTA) — kontekstualni po temi
// =====================================================
export type InlineTema = 'po-sd' | 'razred' | 'doprinosi' | 'interni-akt';

export const INLINE: Record<InlineTema, { text: string; button: string; href: string }> = {
  'po-sd': {
    text:
      'Ovaj PO-SD ti Kvik ispuni u 2 minute — uneseš prihode, aplikacija generira obrazac.',
    button: 'Isprobaj generator',
    href: '/alati/po-sd',
  },
  razred: {
    text:
      'Koji paušalni razred ti odgovara? Kvik kalkulator to izračuna za tebe — uneseš djelatnost i prihod, dobiješ odgovor.',
    button: 'Izračunaj razred',
    href: '/alati/kalkulator-poreza',
  },
  doprinosi: {
    text:
      'Koliko točno plaćaš doprinosa ovaj mjesec? Kvik to izračuna automatski čim uneseš podatke.',
    button: 'Izračunaj doprinose',
    href: '/alati/doprinosi',
  },
  'interni-akt': {
    text:
      'Interni akt možeš generirati u Kviku — bez Word predloška, bez pogađanja što staviti.',
    button: 'Generiraj interni akt',
    href: '/alati/interni-akt',
  },
};

// =====================================================
// FLOATING — sticky traka
// =====================================================
export const FLOATING = {
  A: {
    text: 'Pitanje dok čitaš? Kvik asistent zna odgovor.',
    button: 'Pitaj AI',
    href: '/asistent',
  },
  B: {
    text: 'Sve što čitaš — Kvik to radi umjesto tebe.',
    button: 'Isprobaj',
    href: '/register',
  },
} as const;

// =====================================================
// DNO — pain-relief close
// DNO-CTA-A je DEFAULT svuda; B i C su test varijante.
// =====================================================
export const BOTTOM = {
  A: {
    text:
      'Pročitao si cijeli vodič — to znači da ovo pitanje stvarno muči. Sada više ne moraš pamtiti, pretraživati ni nagađati. Kvik prati rokove, generira obrasce i odgovara na porezna pitanja — ti samo vodiš obrt.',
    button: 'Preuzmi kontrolu nad obrtom',
    href: '/register',
  },
  B: {
    // Nova verzija "Aktiviraj Kvik" — ispravljena hrvatska + status-marker.
    text:
      'Ako si ovo dočitao, znaš više od prosječnog paušalista. Sad imaš i alat koji to znanje primjenjuje umjesto tebe — svaki rok, svaki obrazac, svako porezno pitanje.',
    button: 'Aktiviraj Kvik',
    href: '/register',
  },
  C: {
    text:
      'Nema uvijek koga pitati — ali asistent je tu i u ponoć, i za manje gradove, i za pitanja kojih se sramiš pitati računovođu. Besplatan je. Provjeri sam.',
    button: 'Pitaj što te muči',
    href: '/asistent',
  },
} as const;

// =====================================================
// SHARE — pre-fill tekstovi
// {url} se zamjenjuje na klijentu (ShareBar to radi automatski)
// {tema} (samo C) se zamjenjuje na stranici kroz prop shareText
// =====================================================
export const SHARE_TEXT = {
  A:
    'Naišao sam na koristan vodič za paušaliste — mislim da bi ti koristio. Ovdje sam našao odgovor na ono što me mučilo tjednima: {url}',
  B:
    'Imaš li nekoga tko upravo otvara obrt ili se muči s paušalom? Pošalji mu ovo — meni je pomoglo. {url}',
  C: (tema: string) =>
    `Kvik ima vodiče za paušaliste koji zapravo objasne što se mora napraviti i do kada — bez pravničkog žargona. Ovaj je o ${tema}: {url}`,
} as const;

// Default pre-fill po tipu stranice
export const defaultShareText = (pageType: 'vodic' | 'alat' | 'ai-share' | 'other'): string => {
  switch (pageType) {
    case 'alat':
      return 'Ovo mi je uštedjelo živce — možda zatreba i tebi: {url}';
    case 'vodic':
      return SHARE_TEXT.A;
    case 'ai-share':
      return 'Pitao Kvik AI ovo o porezima, evo odgovora: {url}';
    default:
      return 'Koristan link iz Kvika: {url}';
  }
};

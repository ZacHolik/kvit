export const BANKA_OPTIONS = [
  'PBZ',
  'Erste',
  'Zagrebačka banka',
  'Raiffeisen',
  'OTP',
  'Addiko',
  'Ostalo',
] as const;

export type BankaOption = (typeof BANKA_OPTIONS)[number];

export type PismoBankaFields = {
  banka: BankaOption;
  bankaEmail: string;
  nazivObrta: string;
  oib: string;
  adresa: string;
  vlasnikIme: string;
  email: string;
  mobitel: string;
  zeljeniPaket: string;
  preferiranaPoslovnica: string;
};

export type BankaEmailInfo =
  | { type: 'email'; email: string }
  | { type: 'info'; message: string }
  | { type: 'manual' };

export function getBankaEmailInfo(banka: BankaOption): BankaEmailInfo {
  switch (banka) {
    case 'PBZ':
      return { type: 'email', email: 'poduzeca.sastanci@pbz.hr' };
    case 'Erste':
      return { type: 'info', message: 'Kontaktirajte Erste poslovnicu direktno' };
    case 'Zagrebačka banka':
      return { type: 'info', message: 'Kontaktirajte Zaba poslovnicu direktno' };
    case 'Raiffeisen':
      return { type: 'info', message: 'Kontaktirajte RBA poslovnicu direktno' };
    case 'OTP':
      return { type: 'info', message: 'Kontaktirajte OTP poslovnicu direktno' };
    case 'Addiko':
      return { type: 'info', message: 'Kontaktirajte Addiko poslovnicu direktno' };
    case 'Ostalo':
      return { type: 'manual' };
    default:
      return { type: 'manual' };
  }
}

export function resolvePrimateljEmail(
  banka: BankaOption,
  bankaEmail: string,
): string {
  const info = getBankaEmailInfo(banka);
  if (info.type === 'email') {
    return info.email;
  }
  if (info.type === 'manual') {
    return bankaEmail.trim();
  }
  return '';
}

export function generatePismoBankaText(fields: PismoBankaFields): string {
  const primatelj = resolvePrimateljEmail(fields.banka, fields.bankaEmail);
  const predmet = `Zahtjev za otvaranje poslovnog računa – Paušalni obrt ${fields.nazivObrta.trim()}`;

  const paketLinija =
    fields.zeljeniPaket.trim().length > 0
      ? `Želio bih ugovoriti ${fields.zeljeniPaket.trim()}.`
      : '';

  const poslovnicaLinija =
    fields.preferiranaPoslovnica.trim().length > 0
      ? `Molim Vas da pregledate dokumentaciju i javite mi termin za dolazak u poslovnicu ${fields.preferiranaPoslovnica.trim()} radi potpisivanja ugovora.`
      : 'Molim Vas da pregledate dokumentaciju i javite mi termin za dolazak u poslovnicu radi potpisivanja ugovora.';

  const lines: string[] = [];

  if (primatelj) {
    lines.push(`Primatelj: ${primatelj}`);
    lines.push('');
  }

  lines.push(`Predmet: ${predmet}`);
  lines.push('');
  lines.push('Poštovani,');
  lines.push('');
  lines.push(
    'obraćam Vam se sa zahtjevom za otvaranje poslovnog transakcijskog računa u eurima za paušalni obrt.',
  );

  if (paketLinija) {
    lines.push(paketLinija);
  }

  lines.push('');
  lines.push('U privitku ovog e-maila dostavljam Vam potrebnu dokumentaciju za pripremu ugovora:');
  lines.push('');
  lines.push('Rješenje o otvaranju obrta');
  lines.push('Aktualni Izvadak iz Obrtnog registra (iz sustava e-Obrt)');
  lines.push('Presliku osobne iskaznice vlasnika obrta');
  lines.push('');
  lines.push(
    'Napomena: Budući da se radi o obrtu, Državni zavod za statistiku ne izdaje zasebnu Obavijest o razvrstavanju prema NKD-u, već je ključna djelatnost vidljiva na priloženom Izvatku iz Obrtnog registra.',
  );
  lines.push('');
  lines.push('Podaci o obrtu za ugovor:');
  lines.push(`Naziv obrta: ${fields.nazivObrta.trim()}`);
  lines.push(`OIB obrta: ${fields.oib.replace(/\s/g, '')}`);
  lines.push(`Adresa sjedišta: ${fields.adresa.trim()}`);
  lines.push(`Kontakt mobitel: ${fields.mobitel.trim() || '—'}`);
  lines.push(`Email: ${fields.email.trim() || '—'}`);
  lines.push('');
  lines.push(poslovnicaLinija);
  lines.push('');
  lines.push('Unaprijed hvala i srdačan pozdrav,');
  lines.push('');
  lines.push(fields.vlasnikIme.trim() || '—');
  lines.push(`Vlasnik obrta ${fields.nazivObrta.trim()}`);
  lines.push('');
  lines.push('Generirano na kvik.online/alati/pismo-banka');

  return lines.join('\n');
}

export function pismoBankaPdfFilename(banka: BankaOption): string {
  const slug = banka
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const datum = new Date().toISOString().slice(0, 10);
  return `pismo_${slug}_${datum}.pdf`;
}

export const INPUT_CLASS =
  'mt-2 min-h-[52px] w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-base text-[#e2e8e7] outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/30';

export const LABEL_CLASS = 'font-heading text-sm font-semibold text-[#e2e8e7]';

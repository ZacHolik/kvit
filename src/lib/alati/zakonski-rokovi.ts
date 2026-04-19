export type RokUcestalost = 'dnevno' | 'mjesecno' | 'kvartalno' | 'godisnje';

export type ZakonskiRok = {
  id: string;
  naziv: string;
  opis: string;
  ucestalost: RokUcestalost;
  /** Kratica za prikaz, npr. „do 15.“ */
  rokKratak: string;
};

/** Sažetak tipičnih rokova za paušalnog obrtnika (informativno, nije pravni savjet). */
export const ZAKONSKI_ROKOVI: ZakonskiRok[] = [
  {
    id: 'doprinosi',
    naziv: 'Doprinosi (zdravstveno + mirovinsko)',
    opis: 'Redovita obveza za obrtnika u sustavu obveznog osiguranja.',
    ucestalost: 'mjesecno',
    rokKratak: 'Do 15. u mjesecu',
  },
  {
    id: 'kpr',
    naziv: 'Knjiga prometa (KPR)',
    opis: 'Unos prometa i primitaka sukladno pravilima knjiženja.',
    ucestalost: 'mjesecno',
    rokKratak: 'Nakon završenog mjeseca',
  },
  {
    id: 'pdv-prag',
    naziv: 'PDV prag (pratiti primitke)',
    opis: 'Prag 60.000 € godišnjih primitaka — priprema za eventualni ulazak u PDV.',
    ucestalost: 'mjesecno',
    rokKratak: 'Kontinuirano',
  },
  {
    id: 'pausal-porez',
    naziv: 'Paušalni porez na dohodak',
    opis: 'Kvartalna obveza prema razredu.',
    ucestalost: 'kvartalno',
    rokKratak: 'Do kraja mjeseca nakon kvartala',
  },
  {
    id: 'po-sd',
    naziv: 'PO-SD (godišnji obračun)',
    opis: 'Obrazac u ePoreznoj za paušalne obrtnike.',
    ucestalost: 'godisnje',
    rokKratak: 'Do 15. siječnja',
  },
  {
    id: 'godisnji-kpr',
    naziv: 'Godišnji pregled KPR-a',
    opis: 'Usklađivanje s računima i bankom prije zatvaranja godine.',
    ucestalost: 'godisnje',
    rokKratak: 'Prije podnošenja PO-SD',
  },
];

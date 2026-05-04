/**
 * TypeScript tipovi za fiskalizaciju 1.0
 * Prema: Tehnička specifikacija fiskalizacije v2.6 (Porezna uprava HR)
 */

export type FiscalizationMode = 'test' | 'production';

export type NacinPlacanja = 'G' | 'K' | 'C' | 'O' | 'T';
// G = gotovina, K = kartica, C = ček, O = ostalo, T = transakcijski

export type TipRacuna = 'P' | 'S';
// P = prodajno mjesto, S = samostalni uređaj

export type OznakaPDV = {
  stopaPDV: string; // npr. "25.00"
  osnovica: string; // iznos u EUR, 2 decimale
  iznos: string; // iznos PDV-a
};

export type OznakaPNP = {
  stopaPNP: string;
  osnovica: string;
  iznos: string;
};

export type NaknadaZaRacun = {
  naziv: string;
  iznos: string;
};

export type RacunZaCIS = {
  // Identifikacija
  oib: string; // OIB izdavatelja (11 znamenki)
  uspostavljenoOsiguranje: boolean;

  // Datum i vrijeme
  datVrijeme: string; // format: dd.MM.yyyy'T'HH:mm:ss

  // Broj računa
  brOznRac: string; // oznaka računa (npr. "1")
  brOznPosPr: string; // oznaka poslovnog prostora (npr. "PP1")
  brOznUr: string; // oznaka uređaja/blagajne (npr. "BL1")

  // Iznosi
  iznosUkupno: string; // ukupni iznos, 2 decimale, točka separator

  // Način plaćanja
  nacinPlac: NacinPlacanja;

  // Operater
  oibOper: string; // OIB operatera (može biti isti kao izdavatelj)

  // Naknade (opcionalno)
  naknade?: NaknadaZaRacun[];

  // PDV (opcionalno za paušaliste — nisu u sustavu PDV-a)
  pdv?: OznakaPDV[];

  // ZKI (generira se lokalno)
  zki?: string;

  // Tip
  tipRacuna?: TipRacuna;
};

export type CISResponse = {
  success: boolean;
  jir?: string; // 36 znakova UUID format
  zki?: string;
  error?: string;
  rawResponse?: string;
};

export type FiscalizationResult = {
  success: boolean;
  zki?: string;
  jir?: string;
  error?: string;
  code?: string;
};

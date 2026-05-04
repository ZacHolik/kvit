/**
 * ZKI = Zaštitni Kod Izdavatelja
 * Generira se lokalno RSA-SHA1 potpisom, zatim MD5 hashom.
 * Prema: Tehnička specifikacija fiskalizacije v2.6, poglavlje 3.
 *
 * Format podataka za potpis:
 * OIB + datum_vrijeme + brRac + ozPosP + ozUr + ukupniIznos
 * Sve spojeno bez separatora.
 */

import crypto from 'crypto';
import forge from 'node-forge';

import { decryptCertificate } from './encryption';

export type ZkiInput = {
  oib: string;
  datVrijeme: string; // format: dd.MM.yyyy'T'HH:mm:ss
  brOznRac: string;
  brOznPosPr: string;
  brOznUr: string;
  iznosUkupno: string; // format: "100.00"
};

export type ZkiCertificateData = {
  encryptedP12: string;
  iv: string;
  salt: string;
  /** PKCS#12 lozinka (ista kao pri uploadu). Zaštićeni .p12 zahtijeva vrijednost. */
  p12Password?: string;
};

function loadPrivateKeyPemFromP12(
  p12Buffer: Buffer,
  p12Password: string,
): string {
  const p12Der = forge.util.createBuffer(p12Buffer.toString('binary'));
  const p12Asn1 = forge.asn1.fromDer(p12Der);
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, p12Password);

  const shrouded = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
  const shroudedBags = shrouded[forge.pki.oids.pkcs8ShroudedKeyBag];
  const keyFromShrouded = shroudedBags?.[0]?.key;

  if (keyFromShrouded) {
    return forge.pki.privateKeyToPem(keyFromShrouded);
  }

  const keyBags = p12.getBags({ bagType: forge.pki.oids.keyBag });
  const kb = keyBags[forge.pki.oids.keyBag];
  const keyFromBag = kb?.[0]?.key;
  if (!keyFromBag) {
    throw new Error('Privatni ključ nije pronađen u certifikatu.');
  }
  return forge.pki.privateKeyToPem(keyFromBag);
}

/**
 * Generira ZKI prema specifikaciji Porezne uprave.
 * 1. Spoji podatke u string
 * 2. RSA-SHA1 potpis privatnim ključem iz certifikata
 * 3. MD5 hash potpisa → ZKI (32 hex znaka)
 */
export function generateZki(input: ZkiInput, certData: ZkiCertificateData): string {
  const p12Buffer = decryptCertificate(
    certData.encryptedP12,
    certData.iv,
    certData.salt,
  );

  const password = certData.p12Password ?? '';
  const privateKeyPem = loadPrivateKeyPemFromP12(p12Buffer, password);

  const data = [
    input.oib,
    input.datVrijeme,
    input.brOznRac,
    input.brOznPosPr,
    input.brOznUr,
    input.iznosUkupno,
  ].join('');

  const sign = crypto.createSign('SHA1');
  sign.update(data, 'utf8');
  const signature = sign.sign(privateKeyPem);

  const zki = crypto.createHash('md5').update(signature).digest('hex');

  return zki;
}

/**
 * Formatira datum i vrijeme za CIS prema specifikaciji.
 * Format: dd.MM.yyyy'T'HH:mm:ss
 */
export function formatDatVrijemeZaCIS(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

/**
 * Formatira iznos za CIS: 2 decimale, točka kao separator.
 * Primjer: 100.5 → "100.50"
 */
export function formatIznosZaCIS(iznos: number): string {
  return iznos.toFixed(2);
}

/**
 * Parsira broj računa u komponente za CIS.
 * Format: "1/PP1/BL1" ili "1" (samo redni broj)
 * CIS treba tri odvojena polja.
 */
export function parsesBrojRacuna(brojRacuna: string): {
  brOznRac: string;
  brOznPosPr: string;
  brOznUr: string;
} {
  const parts = brojRacuna.split('/');
  return {
    brOznRac: parts[0]?.trim() ?? '1',
    brOznPosPr: parts[1]?.trim() ?? 'PP1',
    brOznUr: parts[2]?.trim() ?? 'BL1',
  };
}

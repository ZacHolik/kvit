/**
 * Validacija FINA .p12 certifikata korištenjem node-forge.
 * Izvlači OIB, valid_from, valid_until.
 * NIKAD ne logirati lozinku niti sadržaj certifikata.
 */

import forge from 'node-forge';

export type CertificateInfo = {
  valid: boolean;
  oib?: string;
  validFrom?: Date;
  validUntil?: Date;
  error?: string;
};

type SubjectAttr = {
  name?: string;
  shortName?: string;
  value?: unknown;
};

function attributeValue(attr: SubjectAttr): string {
  if (typeof attr.value === 'string') {
    return attr.value;
  }
  if (attr.value != null && typeof attr.value === 'object' && 'value' in attr.value) {
    return String((attr.value as { value?: unknown }).value ?? '');
  }
  return String(attr.value ?? '');
}

export function validateCertificate(
  p12Buffer: Buffer,
  password: string,
): CertificateInfo {
  try {
    const p12Der = forge.util.createBuffer(p12Buffer.toString('binary'));
    const p12Asn1 = forge.asn1.fromDer(p12Der);
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

    const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
    const bags = certBags[forge.pki.oids.certBag];
    if (!bags || bags.length === 0) {
      return { valid: false, error: 'Certifikat nije pronađen u .p12 datoteci.' };
    }

    const cert = bags[0]?.cert;
    if (!cert) {
      return { valid: false, error: 'Certifikat nije ispravan.' };
    }

    const subject = cert.subject;
    let oib: string | undefined;

    for (const attr of subject.attributes) {
      if (attr.name === 'commonName' || attr.shortName === 'CN') {
        const match = /\((\d{11})\)/.exec(attributeValue(attr));
        if (match) {
          oib = match[1];
          break;
        }
      }
      if (attr.name === 'serialNumber' && /^\d{11}$/.test(attributeValue(attr))) {
        oib = attributeValue(attr);
        break;
      }
    }

    const validFrom = new Date(cert.validity.notBefore);
    const validUntil = new Date(cert.validity.notAfter);
    const now = new Date();

    if (now > validUntil) {
      return {
        valid: false,
        error: 'Certifikat je istekao.',
        validFrom,
        validUntil,
        oib,
      };
    }

    return { valid: true, oib, validFrom, validUntil };
  } catch {
    return { valid: false, error: 'Pogrešna lozinka ili oštećena .p12 datoteka.' };
  }
}

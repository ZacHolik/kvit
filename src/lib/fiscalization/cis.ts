/**
 * CIS SOAP klijent za fiskalizaciju 1.0
 * Komunikacija s Poreznom upravom (CIS = Centralni informacijski sustav).
 *
 * Endpoint: CIS_URL env ako je postavljen; inače test/prod na :8449 (FINA spec. v2.6).
 *
 * Potpis: XML-DSig nad SOAP Body (Exclusive C14N + SHA1 digest, RSA-SHA1 nad SignedInfo),
 * wsse:BinarySecurityToken + KeyInfo s SecurityTokenReference (spec. v2.5 / WS-Security).
 */

import forge from 'node-forge';
import { create } from 'xmlbuilder2';
import { SignedXml } from 'xml-crypto';

import { decryptCertificate } from './encryption';
import type { CISResponse, RacunZaCIS } from './types';

const CIS_TEST_URL = 'https://cistest.apis-it.hr:8449/FiskalizacijaServiceTest';
const CIS_DEFAULT_PROD =
  'https://cis.porezna-uprava.hr:8449/FiskalizacijaService';

/** CIS SOAP endpoint (override za staging s test CIS-om). */
export function resolveCisUrl(mode: 'test' | 'production'): string {
  const fromEnv = process.env.CIS_URL?.trim();
  if (fromEnv) {
    return fromEnv;
  }
  return mode === 'production' ? CIS_DEFAULT_PROD : CIS_TEST_URL;
}

export type CISCertificateData = {
  encryptedP12: string;
  iv: string;
  salt: string;
  p12Password?: string;
};

export type CISCallMeta = {
  /** Trajanje HTTP poziva u ms. */
  durationMs: number;
  /** Potpuni SOAP XML poslan na CIS (za log — sanitiziraj prije spremanja u bazu). */
  requestXml: string;
};

function loadP12KeyAndCert(
  p12Buffer: Buffer,
  p12Password: string,
): { privateKeyPem: string; certDerB64: string; certPem: string } {
  const p12Der = forge.util.createBuffer(p12Buffer.toString('binary'));
  const p12Asn1 = forge.asn1.fromDer(p12Der);
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, p12Password);

  const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
  const certBag = certBags[forge.pki.oids.certBag]?.[0]?.cert;
  const certDer = certBag
    ? forge.util.encode64(
        forge.asn1.toDer(forge.pki.certificateToAsn1(certBag)).getBytes(),
      )
    : '';
  const certPem = certBag ? forge.pki.certificateToPem(certBag) : '';

  const shrouded = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
  const shroudedKey = shrouded[forge.pki.oids.pkcs8ShroudedKeyBag]?.[0]?.key;
  if (shroudedKey) {
    return {
      privateKeyPem: forge.pki.privateKeyToPem(shroudedKey),
      certDerB64: certDer,
      certPem,
    };
  }

  const keyBags = p12.getBags({ bagType: forge.pki.oids.keyBag });
  const privateKeyForge = keyBags[forge.pki.oids.keyBag]?.[0]?.key;
  if (!privateKeyForge) {
    throw new Error('Privatni ključ nije pronađen.');
  }
  return {
    privateKeyPem: forge.pki.privateKeyToPem(privateKeyForge),
    certDerB64: certDer,
    certPem,
  };
}

/**
 * Gradi SOAP envelope (bez potpisa). Security: Timestamp + BinarySecurityToken.
 * Potpis (ds:Signature) dodaje signSoapEnvelope pomoću xml-crypto.
 */
function buildSoapEnvelope(racun: RacunZaCIS, messageId: string): string {
  const now = new Date();
  const created = now.toISOString();
  const expires = new Date(now.getTime() + 5 * 60 * 1000).toISOString();

  const doc = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('soapenv:Envelope', {
      'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
      'xmlns:tns': 'http://www.apis-it.hr/fin/2012/types/f73',
      'xmlns:wsu':
        'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
    })
    .ele('soapenv:Header')
    .ele('wsse:Security', {
      'xmlns:wsse':
        'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd',
      'soapenv:mustUnderstand': '1',
    })
    .ele('wsu:Timestamp', { 'wsu:Id': 'Timestamp' })
    .ele('wsu:Created')
    .txt(created)
    .up()
    .ele('wsu:Expires')
    .txt(expires)
    .up()
    .up()
    .up()
    .up()
    .ele('soapenv:Body')
    .ele('tns:RacunZahtjev')
    .ele('tns:Zaglavlje')
    .ele('tns:IdPoruke')
    .txt(messageId)
    .up()
    .ele('tns:DatumVrijeme')
    .txt(racun.datVrijeme)
    .up()
    .up()
    .ele('tns:Racun')
    .ele('tns:Oib')
    .txt(racun.oib)
    .up()
    .ele('tns:UspostavljenoOsiguranje')
    .txt(racun.uspostavljenoOsiguranje ? 'true' : 'false')
    .up()
    .ele('tns:DatVrijeme')
    .txt(racun.datVrijeme)
    .up()
    .ele('tns:OznRac')
    .ele('tns:BrOznRac')
    .txt(racun.brOznRac)
    .up()
    .ele('tns:OznPosPr')
    .txt(racun.brOznPosPr)
    .up()
    .ele('tns:OznUr')
    .txt(racun.brOznUr)
    .up()
    .up()
    .ele('tns:IznosUkupno')
    .txt(racun.iznosUkupno)
    .up()
    .ele('tns:NacinPlac')
    .txt(racun.nacinPlac)
    .up()
    .ele('tns:OibOper')
    .txt(racun.oibOper)
    .up()
    .ele('tns:ZastKodIzdav')
    .txt(racun.zki ?? '')
    .up()
    .ele('tns:NakDost')
    .txt('false')
    .up()
    .up()
    .up()
    .up()
    .end({ prettyPrint: false });

  return doc;
}

/**
 * Umeće BinarySecurityToken u prvi wsse:Security (nakon Timestamp).
 */
function insertBinarySecurityToken(
  envelopeXml: string,
  certDerB64: string,
): string {
  const token = `<wsse:BinarySecurityToken EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3" wsu:Id="X509Token" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">${certDerB64}</wsse:BinarySecurityToken>`;
  const closeTs = '</wsu:Timestamp>';
  const idx = envelopeXml.indexOf(closeTs);
  if (idx === -1) {
    throw new Error('SOAP: Timestamp nije pronađen za umetanje certifikata.');
  }
  return (
    envelopeXml.slice(0, idx + closeTs.length) +
    token +
    envelopeXml.slice(idx + closeTs.length)
  );
}

/**
 * Potpisuje SOAP envelope: referenca na soapenv:Body, Exclusive C14N, SHA1, RSA-SHA1.
 */
function signSoapEnvelope(
  envelopeXml: string,
  privateKeyPem: string,
  certPem: string,
): string {
  const sig = new SignedXml({
    privateKey: privateKeyPem,
    publicCert: certPem,
    signatureAlgorithm: 'http://www.w3.org/2000/09/xmldsig#rsa-sha1',
    canonicalizationAlgorithm: 'http://www.w3.org/2001/10/xml-exc-c14n#',
    idMode: 'wssecurity',
    getKeyInfoContent: () =>
      '<wsse:SecurityTokenReference xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">' +
      '<wsse:Reference URI="#X509Token" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3"/>' +
      '</wsse:SecurityTokenReference>',
  });

  sig.addReference({
    xpath:
      "//*[local-name(.)='Body' and namespace-uri(.)='http://schemas.xmlsoap.org/soap/envelope/']",
    transforms: ['http://www.w3.org/2001/10/xml-exc-c14n#'],
    digestAlgorithm: 'http://www.w3.org/2000/09/xmldsig#sha1',
  });

  sig.computeSignature(envelopeXml, {
    location: {
      reference: "//*[local-name(.)='BinarySecurityToken']",
      action: 'after',
    },
  });

  return sig.getSignedXml();
}

/** Za fiscal_logs: ukloni sadržaj BinarySecurityToken (DER base64). */
export function sanitizeCisRequestForLog(xml: string): string {
  return xml.replace(
    /(<wsse:BinarySecurityToken[^>]*>)([\s\S]*?)(<\/wsse:BinarySecurityToken>)/i,
    '$1[REDACTED]$3',
  );
}

function generateMessageId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function parseJirFromResponse(responseXml: string): string | null {
  const match = /<(?:tns:)?Jir>([^<]+)<\/(?:tns:)?Jir>/i.exec(responseXml);
  return match?.[1]?.trim() ?? null;
}

function parseErrorFromResponse(responseXml: string): string | null {
  const match =
    /<(?:tns:)?PorukaGreske>([^<]+)<\/(?:tns:)?PorukaGreske>/i.exec(responseXml);
  return match?.[1]?.trim() ?? null;
}

/**
 * Šalje račun na CIS i vraća JIR.
 *
 * ATOMARNA OPERACIJA:
 * Ako CIS ne odgovori ili vrati grešku — račun NE smije biti
 * označen kao fiskaliziran. Pozivatelj mora provjeriti success.
 */
export async function sendRacunToCIS(
  racun: RacunZaCIS,
  certData: CISCertificateData,
  mode: 'test' | 'production' = 'test',
): Promise<CISResponse & Partial<CISCallMeta>> {
  const url = resolveCisUrl(mode);
  const messageId = generateMessageId();
  const started = Date.now();

  try {
    const p12Buffer = decryptCertificate(
      certData.encryptedP12,
      certData.iv,
      certData.salt,
    );

    const password = certData.p12Password ?? '';
    const { privateKeyPem, certDerB64, certPem } = loadP12KeyAndCert(
      p12Buffer,
      password,
    );

    if (!certDerB64 || !certPem) {
      return {
        success: false,
        error: 'X.509 certifikat nije pronađen u .p12 datoteci.',
        durationMs: Date.now() - started,
        requestXml: '',
      };
    }

    const envelope = buildSoapEnvelope(racun, messageId);
    const withToken = insertBinarySecurityToken(envelope, certDerB64);
    const signedXml = signSoapEnvelope(withToken, privateKeyPem, certPem);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        SOAPAction: '"RacunZahtjev"',
      },
      body: signedXml,
      signal: AbortSignal.timeout(15000),
    });

    const responseText = await response.text();
    const durationMs = Date.now() - started;

    if (!response.ok) {
      return {
        success: false,
        error: `CIS HTTP greška: ${response.status}`,
        rawResponse: responseText,
        durationMs,
        requestXml: signedXml,
      };
    }

    const jir = parseJirFromResponse(responseText);
    if (jir) {
      return {
        success: true,
        jir,
        zki: racun.zki,
        rawResponse: responseText,
        durationMs,
        requestXml: signedXml,
      };
    }

    const errorMsg = parseErrorFromResponse(responseText);
    return {
      success: false,
      error: errorMsg ?? 'CIS nije vratio JIR ni grešku.',
      rawResponse: responseText,
      durationMs,
      requestXml: signedXml,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Nepoznata greška.';
    return {
      success: false,
      error: message,
      durationMs: Date.now() - started,
      requestXml: '',
    };
  }
}

/**
 * Echo zahtjev — bez potpisa; provjera dostupnosti CIS **test (demo)** okoline.
 * Uvijek `cistest.apis-it.hr:8449/FiskalizacijaServiceTest` (ne CIS_URL / ne prod),
 * kako UI „CIS dostupan“ ne bi slučajno pingao produkciju.
 */
export async function echoCIS(): Promise<{
  ok: boolean;
  message: string;
  durationMs: number;
}> {
  const url = CIS_TEST_URL;
  const body =
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:fis="http://www.apis-it.hr/fin/2012/types/f73">' +
    '<soapenv:Body><fis:EchoRequest>Test</fis:EchoRequest></soapenv:Body></soapenv:Envelope>';
  const started = Date.now();
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        SOAPAction: '"Echo"',
      },
      body,
      signal: AbortSignal.timeout(10000),
    });
    const text = await response.text();
    const durationMs = Date.now() - started;
    if (!response.ok) {
      return {
        ok: false,
        message: `HTTP ${response.status}`,
        durationMs,
      };
    }
    if (/EchoResponse/i.test(text) && !/soapenv:Fault/i.test(text)) {
      return { ok: true, message: 'CIS odgovorio.', durationMs };
    }
    return { ok: false, message: 'Neočekivan odgovor.', durationMs };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Greška mreže.';
    return { ok: false, message: msg, durationMs: Date.now() - started };
  }
}

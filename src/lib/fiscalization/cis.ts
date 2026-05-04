/**
 * CIS SOAP klijent za fiskalizaciju 1.0
 * Komunikacija s Poreznom upravom (CIS = Centralni informacijski sustav).
 *
 * Endpoints:
 * TEST: https://cistest.apis-it.hr:443/FiskalizacijaService
 * PROD: https://cis.porezna-uprava.hr:443/FiskalizacijaService
 *
 * Standard: SOAP 1.1 s WS-Security (XML potpis)
 */

import { createSign } from 'crypto';
import forge from 'node-forge';
import { create } from 'xmlbuilder2';

import { decryptCertificate } from './encryption';
import type { CISResponse, RacunZaCIS } from './types';

// Paket je u projektu za kanonski XML-DSig / WS-Security (vidi NAPOMENE u zadatku).
import { SignedXml } from 'xml-crypto';

/** Rezervirano za kanonski potpis tijela poruke (xml-crypto). */
export const XmlCryptoSignedXml = SignedXml;

const CIS_TEST_URL = 'https://cistest.apis-it.hr:443/FiskalizacijaService';
const CIS_PROD_URL = 'https://cis.porezna-uprava.hr:443/FiskalizacijaService';

export type CISCertificateData = {
  encryptedP12: string;
  iv: string;
  salt: string;
  p12Password?: string;
};

function loadP12KeyAndCert(
  p12Buffer: Buffer,
  p12Password: string,
): { privateKeyPem: string; certDerB64: string } {
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

  const shrouded = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
  const shroudedKey = shrouded[forge.pki.oids.pkcs8ShroudedKeyBag]?.[0]?.key;
  if (shroudedKey) {
    return {
      privateKeyPem: forge.pki.privateKeyToPem(shroudedKey),
      certDerB64: certDer,
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
  };
}

/**
 * Gradi SOAP envelope za RacunZahtjev prema specifikaciji.
 */
function buildSoapEnvelope(racun: RacunZaCIS, messageId: string): string {
  const now = new Date();
  const created = now.toISOString();
  const expires = new Date(now.getTime() + 5 * 60 * 1000).toISOString();

  const doc = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('soapenv:Envelope', {
      'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
      'xmlns:tns': 'http://www.apis-it.hr/fin/2012/types/f73',
    })
    .ele('soapenv:Header')
    .ele('wsse:Security', {
      'xmlns:wsse':
        'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd',
      'xmlns:wsu':
        'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
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
 * Generira UUID v4 za messageId.
 */
function generateMessageId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Parsira CIS SOAP odgovor i izvlači JIR.
 */
function parseJirFromResponse(responseXml: string): string | null {
  const match = /<(?:tns:)?Jir>([^<]+)<\/(?:tns:)?Jir>/i.exec(responseXml);
  return match?.[1]?.trim() ?? null;
}

/**
 * Parsira grešku iz CIS SOAP odgovora.
 */
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
): Promise<CISResponse> {
  const url = mode === 'production' ? CIS_PROD_URL : CIS_TEST_URL;
  const messageId = generateMessageId();

  try {
    const p12Buffer = decryptCertificate(
      certData.encryptedP12,
      certData.iv,
      certData.salt,
    );

    const password = certData.p12Password ?? '';
    const { privateKeyPem, certDerB64 } = loadP12KeyAndCert(p12Buffer, password);

    const soapXml = buildSoapEnvelope(racun, messageId);

    const signer = createSign('SHA1');
    signer.update(soapXml, 'utf8');
    const signature = signer.sign(privateKeyPem, 'base64');

    const signedXml = soapXml.replace(
      '</wsse:Security>',
      `<wsse:BinarySecurityToken ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3" EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary" wsu:Id="X509Token" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">${certDerB64}</wsse:BinarySecurityToken><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignatureValue>${signature}</ds:SignatureValue></ds:Signature></wsse:Security>`,
    );

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

    if (!response.ok) {
      return {
        success: false,
        error: `CIS HTTP greška: ${response.status}`,
        rawResponse: responseText,
      };
    }

    const jir = parseJirFromResponse(responseText);
    if (jir) {
      return {
        success: true,
        jir,
        zki: racun.zki,
        rawResponse: responseText,
      };
    }

    const errorMsg = parseErrorFromResponse(responseText);
    return {
      success: false,
      error: errorMsg ?? 'CIS nije vratio JIR ni grešku.',
      rawResponse: responseText,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Nepoznata greška.';
    return { success: false, error: message };
  }
}

/**
 * CIS SOAP klijent — FIX za s004: URI="#RacunZahtjev" umjesto URI=""
 * Tri nezavisna LLM-a (Gemini, ChatGPT, Grok) konzistentno identificirala problem.
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { Agent, fetch as undiciFetch } from 'undici';
import forge from 'node-forge';
import { create } from 'xmlbuilder2';
import { SignedXml } from 'xml-crypto';
import { decryptCertificate } from './encryption';
import type { CISResponse, RacunZaCIS } from './types';

const CIS_TEST_URL = 'https://cistest.apis-it.hr:8449/FiskalizacijaServiceTest';
const CIS_DEFAULT_PROD =
  'https://cis.porezna-uprava.hr:8449/FiskalizacijaService';

export function resolveCisUrl(mode: 'test' | 'production'): string {
  const fromEnv = process.env.CIS_URL?.trim();
  if (fromEnv) return fromEnv;
  return mode === 'production' ? CIS_DEFAULT_PROD : CIS_TEST_URL;
}

function getFinaAgent(): Agent {
  console.log('[FINA] CWD:', process.cwd());
  console.log('[FINA] CERT PATH:', process.env.FINA_CA_CERT_PATH ?? join(process.cwd(), 'certs', 'fina_full_chain.pem'));
  console.log('[FINA] CERT BASE64:', process.env.FINA_CA_CERT_BASE64 ? 'SET' : 'NOT SET');
  const b64 = process.env.FINA_CA_CERT_BASE64?.trim();
  if (b64) return new Agent({ connect: { ca: Buffer.from(b64, 'base64').toString('utf8') } });
  const certPath = process.env.FINA_CA_CERT_PATH?.trim() ?? join(process.cwd(), 'certs', 'fina_full_chain.pem');
  try { return new Agent({ connect: { ca: readFileSync(certPath, 'utf8') } }); }
  catch { return new Agent({}); }
}

const finaAgent = getFinaAgent();

export type CISCertificateData = { encryptedP12: string; iv: string; salt: string; p12Password?: string };
export type CISCallMeta = { durationMs: number; requestXml: string };

function loadP12KeyAndCert(p12Buffer: Buffer, p12Password: string): { privateKeyPem: string; certDerB64: string; certPem: string } {
  const p12Der = forge.util.createBuffer(p12Buffer.toString('binary'));
  const p12Asn1 = forge.asn1.fromDer(p12Der);
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, p12Password);
  const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
  const certBag = certBags[forge.pki.oids.certBag]?.[0]?.cert;
  const certDer = certBag ? forge.util.encode64(forge.asn1.toDer(forge.pki.certificateToAsn1(certBag)).getBytes()) : '';
  const certPem = certBag ? forge.pki.certificateToPem(certBag) : '';
  const shrouded = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
  const shroudedKey = shrouded[forge.pki.oids.pkcs8ShroudedKeyBag]?.[0]?.key;
  if (shroudedKey) return { privateKeyPem: forge.pki.privateKeyToPem(shroudedKey), certDerB64: certDer, certPem };
  const keyBags = p12.getBags({ bagType: forge.pki.oids.keyBag });
  const privateKeyForge = keyBags[forge.pki.oids.keyBag]?.[0]?.key;
  if (!privateKeyForge) throw new Error('Privatni ključ nije pronađen.');
  return { privateKeyPem: forge.pki.privateKeyToPem(privateKeyForge), certDerB64: certDer, certPem };
}

function buildRacunZahtjevXml(racun: RacunZaCIS, messageId: string): string {
  return create({ version: '1.0', encoding: 'UTF-8' })
    .ele('tns:RacunZahtjev', { 'xmlns:tns': 'http://www.apis-it.hr/fin/2012/types/f73', Id: 'RacunZahtjev' })
    .ele('tns:Zaglavlje')
      .ele('tns:IdPoruke').txt(messageId).up()
      .ele('tns:DatumVrijeme').txt(racun.datVrijeme).up()
    .up()
    .ele('tns:Racun')
      .ele('tns:Oib').txt(racun.oib).up()
      .ele('tns:USustPdv').txt('false').up()
      .ele('tns:DatVrijeme').txt(racun.datVrijeme).up()
      .ele('tns:OznSlijed').txt('N').up()
      .ele('tns:BrRac')
        .ele('tns:BrOznRac').txt(racun.brOznRac).up()
        .ele('tns:OznPosPr').txt(racun.brOznPosPr).up()
        .ele('tns:OznNapUr').txt('1').up()
      .up()
      .ele('tns:IznosUkupno').txt(racun.iznosUkupno).up()
      .ele('tns:NacinPlac').txt(racun.nacinPlac).up()
      .ele('tns:OibOper').txt(racun.oibOper).up()
      .ele('tns:ZastKod').txt(racun.zki ?? '').up()
      .ele('tns:NakDost').txt('false').up()
      .ele('tns:ParagonBrRac').txt('').up()
      .ele('tns:SpecNamj').txt('').up()
    .up()
    .up()
    .end({ prettyPrint: false });
}

function signRacunZahtjev(zahtjevXml: string, privateKeyPem: string, certDerB64: string): string {
  const sig = new SignedXml({
    privateKey: privateKeyPem,
    signatureAlgorithm: 'http://www.w3.org/2000/09/xmldsig#rsa-sha1',
    canonicalizationAlgorithm: 'http://www.w3.org/2001/10/xml-exc-c14n#',
    getKeyInfoContent: () => '<X509Data><X509Certificate>' + certDerB64 + '</X509Certificate></X509Data>',
  });

  sig.addReference({
    xpath: "//*[@Id='RacunZahtjev']",
    transforms: [
      'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
      'http://www.w3.org/2001/10/xml-exc-c14n#',
    ],
    digestAlgorithm: 'http://www.w3.org/2000/09/xmldsig#sha1',
    uri: '#RacunZahtjev',
  });

  sig.computeSignature(zahtjevXml, {
    location: { reference: "//*[local-name(.)='RacunZahtjev']", action: 'append' },
  });

  return sig.getSignedXml();
}

function wrapInSoapEnvelope(signedZahtjevXml: string): string {
  const xmlWithoutDecl = signedZahtjevXml.replace(/<\?xml[^?]*\?>/, '').trim();
  return '<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body>' + xmlWithoutDecl + '</soapenv:Body></soapenv:Envelope>';
}

export function sanitizeCisRequestForLog(xml: string): string {
  return xml
    .replace(/(<wsse:BinarySecurityToken[^>]*>)([\s\S]*?)(<\/wsse:BinarySecurityToken>)/i, '$1[REDACTED]$3')
    .replace(/(<X509Certificate>)([\s\S]*?)(<\/X509Certificate>)/i, '$1[REDACTED]$3');
}

function generateMessageId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function parseJirFromResponse(xml: string): string | null {
  return /<(?:tns:)?Jir>([^<]+)<\/(?:tns:)?Jir>/i.exec(xml)?.[1]?.trim() ?? null;
}

function parseAllErrorsFromResponse(xml: string): string[] {
  const errors: string[] = [];
  let m;
  const r1 = /<(?:tns:)?PorukaGreske>([^<]+)<\/(?:tns:)?PorukaGreske>/gi;
  while ((m = r1.exec(xml)) !== null) errors.push(m[1].trim());
  const r2 = /<(?:tns:)?SifraGreske>([^<]+)<\/(?:tns:)?SifraGreske>/gi;
  while ((m = r2.exec(xml)) !== null) errors.push('Šifra: ' + m[1].trim());
  const f = /<faultstring>([^<]+)<\/faultstring>/i.exec(xml);
  if (f) errors.push('SOAP Fault: ' + f[1].trim());
  return errors;
}

export async function sendRacunToCIS(
  racun: RacunZaCIS, certData: CISCertificateData, mode: 'test' | 'production' = 'test',
): Promise<CISResponse & Partial<CISCallMeta>> {
  const url = resolveCisUrl(mode);
  const messageId = generateMessageId();
  const started = Date.now();
  try {
    const p12Buffer = decryptCertificate(certData.encryptedP12, certData.iv, certData.salt);
    const { privateKeyPem, certDerB64, certPem } = loadP12KeyAndCert(p12Buffer, certData.p12Password ?? '');
    if (!certDerB64 || !certPem) return { success: false, error: 'X.509 certifikat nije pronađen.', durationMs: Date.now() - started, requestXml: '' };

    const zahtjevXml = buildRacunZahtjevXml(racun, messageId);
    const signedZahtjev = signRacunZahtjev(zahtjevXml, privateKeyPem, certDerB64);
    const soapXml = wrapInSoapEnvelope(signedZahtjev);

    console.log('\n========== CIS REQUEST ==========');
    console.log('[CIS] URL:', url, 'MessageId:', messageId);
    console.log('[CIS] OIB:', racun.oib, 'DatVrijeme:', racun.datVrijeme);
    console.log('[CIS] BrOznRac:', racun.brOznRac, 'PP:', racun.brOznPosPr, 'NU:', racun.brOznUr);
    console.log('[CIS] IznosUkupno:', racun.iznosUkupno, 'ZKI:', racun.zki);
    console.log('[CIS] Potpisani XML (prvih 3000):\n', signedZahtjev.substring(0, 3000));
    console.log('=================================\n');

    const response = await undiciFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml;charset=UTF-8', SOAPAction: '' },
      body: soapXml, signal: AbortSignal.timeout(15000), dispatcher: finaAgent,
    });
    const responseText = await response.text();
    const durationMs = Date.now() - started;
    const allErrors = parseAllErrorsFromResponse(responseText);

    console.log('\n========== CIS RESPONSE ==========');
    console.log('[CIS] HTTP:', response.status, 'Duration:', durationMs, 'ms');
    console.log('[CIS] Body:\n', responseText);
    if (allErrors.length) console.log('[CIS] Greške:', allErrors);
    console.log('==================================\n');

    if (!response.ok) return {
      success: false,
      error: allErrors.length ? 'CIS HTTP ' + response.status + ': ' + allErrors.join(' | ') : 'CIS HTTP greška: ' + response.status,
      rawResponse: responseText, durationMs, requestXml: soapXml,
    };

    const jir = parseJirFromResponse(responseText);
    if (jir) {
      console.log('[CIS] ✅ JIR DOBIVEN:', jir);
      return { success: true, jir, zki: racun.zki, rawResponse: responseText, durationMs, requestXml: soapXml };
    }

    console.log('[CIS] ❌ Nema JIR-a.');
    return { success: false, error: allErrors.length ? allErrors.join(' | ') : 'CIS nije vratio JIR ni grešku.', rawResponse: responseText, durationMs, requestXml: soapXml };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Nepoznata greška.';
    console.log('[CIS] ❌ EXCEPTION:', message);
    return { success: false, error: message, durationMs: Date.now() - started, requestXml: '' };
  }
}

export async function echoCIS(): Promise<{ ok: boolean; message: string; durationMs: number }> {
  const url = CIS_TEST_URL;
  const body = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:fis="http://www.apis-it.hr/fin/2012/types/f73"><soapenv:Body><fis:EchoRequest>Test</fis:EchoRequest></soapenv:Body></soapenv:Envelope>';
  const started = Date.now();
  try {
    const response = await undiciFetch(url, {
      method: 'POST', headers: { 'Content-Type': 'text/xml;charset=UTF-8', SOAPAction: '' },
      body, signal: AbortSignal.timeout(10000), dispatcher: finaAgent,
    });
    const text = await response.text();
    const durationMs = Date.now() - started;
    if (!response.ok) return { ok: false, message: 'HTTP ' + response.status, durationMs };
    if (/EchoResponse/i.test(text) && !/soapenv:Fault/i.test(text)) return { ok: true, message: 'CIS odgovorio.', durationMs };
    return { ok: false, message: 'Neočekivan odgovor.', durationMs };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Greška mreže.', durationMs: Date.now() - started };
  }
}

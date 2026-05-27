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
const CIS_PROD_URL =
  'https://cis.porezna-uprava.hr:8449/FiskalizacijaService';

function cisUrlFromFinaEnv(): string {
  return process.env.FINA_ENV === 'production' ? CIS_PROD_URL : CIS_TEST_URL;
}

export function resolveCisUrl(mode: 'test' | 'production'): string {
  const fromEnv = process.env.CIS_URL?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.FINA_ENV === 'production' || process.env.FINA_ENV === 'test') {
    return cisUrlFromFinaEnv();
  }
  return mode === 'production' ? CIS_PROD_URL : CIS_TEST_URL;
}

function resolveCisProxyFiscalizeUrl(): string | null {
  const base = process.env.CIS_PROXY_URL?.trim();
  if (!base) return null;
  return `${base.replace(/\/$/, '')}/fiscalize`;
}

function resolveFinaEnvForProxy(mode: 'test' | 'production'): string {
  const env = process.env.FINA_ENV?.trim();
  if (env === 'production' || env === 'test') return env;
  return mode;
}

/** SOAP POST — Cloud Run proxy (Vercel) ili direktno CIS (lokalno + FINA_CA_CERT_PATH). */
async function postSoapToCis(
  soapXml: string,
  cisUrl: string,
  mode: 'test' | 'production',
  timeoutMs: number,
) {
  const proxyUrl = resolveCisProxyFiscalizeUrl();
  if (proxyUrl) {
    console.log('[CIS] Proxy:', proxyUrl.replace(/\/fiscalize$/, ''), 'FINA_ENV:', resolveFinaEnvForProxy(mode));
    return undiciFetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        SOAPAction: '',
        'x-proxy-secret': process.env.CIS_PROXY_SECRET?.trim() ?? '',
        'x-fina-env': resolveFinaEnvForProxy(mode),
      },
      body: soapXml,
      signal: AbortSignal.timeout(timeoutMs),
    });
  }

  return undiciFetch(cisUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/xml;charset=UTF-8', SOAPAction: '' },
    body: soapXml,
    signal: AbortSignal.timeout(timeoutMs),
    dispatcher: getAgent(),
  });
}

function getFinaAgent(): Agent {
  console.log('[FINA] CWD:', process.cwd());
  console.log('[FINA] ENV:', process.env.FINA_ENV ?? 'test (default)');
  console.log('[FINA] CERT PATH:', process.env.FINA_CA_CERT_PATH ?? join(process.cwd(), 'certs', 'fina_full_chain.pem'));
  const caCert =
    process.env.FINA_ENV === 'production'
      ? process.env.FINA_CA_CERT_BASE64_PROD
      : (process.env.FINA_CA_CERT_BASE64_TEST ?? process.env.FINA_CA_CERT_BASE64);

  const FINA_RDC_2020_CERT = `-----BEGIN CERTIFICATE-----
MIIHOzCCBSOgAwIBAgIRAIqrCSPT6y2uAAAAAFZUvzwwDQYJKoZIhvcNAQELBQAw
QzELMAkGA1UEBhMCSFIxHTAbBgNVBAoTFEZpbmFuY2lqc2thIGFnZW5jaWphMRUw
EwYDVQQDEwxGaW5hIFJvb3QgQ0EwHhcNMjAxMTI1MTIzNzEwWhcNMzAxMTI1MTIz
NzEwWjBEMQswCQYDVQQGEwJIUjEdMBsGA1UEChMURmluYW5jaWpza2EgYWdlbmNp
amExFjAUBgNVBAMTDUZpbmEgUkRDIDIwMjAwggIiMA0GCSqGSIb3DQEBAQUAA4IC
DwAwggIKAoICAQCv75uR4V36v7r5SeK8Jig3kxGwHvjTWfkaWg8urJhMZnOmzpMG
9QWtNJ/HzMYYCjHBncKquKXHYeh3Ds/oJwHeMWHCS381LhAGj/sFDF2LnANR7mwK
GgXpe4j9y/e57/uGQ5U4OOYo6mlsOPVvjGlSoTqoAFVWR64m+B8Zx7ceRIaiXd1q
WNJih87eFY4pHXb3K2PFdD34TfqdR9Rnz2TGoyguF7s+Ph3tWOZYbByGEAAHTiv/
JQbY41DQhM0tFnbcO+2lEFztkGpD6S1uLbs4COLSKtpR5+tkHND25QsUDEAi6sRB
6bcDwnYZ+CdweMohnF5S0wzPwGnHLNJV/Lt2sErZHtZB6wEuDrTfBNPs9f59/UVq
8Wt5jYDqLiiagFy5rUAN+uuv7QRlS1uaUN/2SmOlQaf105mUCVoWrPXkpiBUZrDR
M06uLmJTv75RkSaMEoPr2PLPuS3bRmwnYRZ/s6uin/pqnvw4ogD8eZAtWEvuYRLr
5evAJYVI8ud0JJfZ6yZhvBbLQd1w/vD/oR4XOXctjqB267lD9d0egvQ9+Wh0o+Kq
Bi9iUfiwE11mu0lFYcNz/8+tApJ6w9O6wNtutaNU2xYrMrtFNK/arQ0PFucmUEeu
dr2zICKNCcOlFzFwp8s7hrX4sBuM+BNbMTUdrp8Mr1mhiERzuZCyf1jIiwIDAQAB
o4ICJzCCAiMwDgYDVR0PAQH/BAQDAgEGMBIGA1UdEwEB/wQIMAYBAf8CAQAwgb8G
A1UdIASBtzCBtDCBsQYHK3yIUAUCATCBpTBMBggrBgEFBQcCARZAaHR0cHM6Ly93
d3cuZmluYS5oci9yZWd1bGF0aXZhLWRva3VtZW50aS1pLXBvdHZyZGUtby1zdWts
YWRub3N0aTBVBggrBgEFBQcCARZJaHR0cHM6Ly93d3cuZmluYS5oci9lbi9sZWdp
c2xhdGlvbi1kb2N1bWVudHMtYW5kLWNvbmZvcm1hbmNlLWNlcnRpZmljYXRlczBj
BggrBgEFBQcBAQRXMFUwHwYIKwYBBQUHMAGGE2h0dHA6Ly9vY3NwLmZpbmEuaHIw
MgYIKwYBBQUHMAKGJmh0dHA6Ly9yZGMuZmluYS5oci9Sb290L0ZpbmFSb290Q0Eu
Y2VyMIGVBgNVHR8EgY0wgYowLKAqoCiGJmh0dHA6Ly9yZGMuZmluYS5oci9Sb290
L0ZpbmFSb290Q0EuY3JsMFqgWKBWpFQwUjELMAkGA1UEBhMCSFIxHTAbBgNVBAoT
FEZpbmFuY2lqc2thIGFnZW5jaWphMRUwEwYDVQQDEwxGaW5hIFJvb3QgQ0ExDTAL
BgNVBAMTBENSTDEwHwYDVR0jBBgwFoAU/hGibBDu3uIDuFWCTiI8huQ+a1QwHQYD
VR0OBBYEFHok8OJzOcWBFAwTUzAicydI3iuLMA0GCSqGSIb3DQEBCwUAA4ICAQBw
kpiNO2Rr2fPWVAmR91TEof/QeCcout+CnWbeVSxgxe5pkzT68zJZ5WhyAxkKeDRK
1DHDbbIt2Sc6WiVxz+Zq0cDVOxAtqlhdR1TQkqTbE1UdMwwggOGPscOt6RhQtBt+
ewdmaEBUxdLg7WHB6aohYPR65RHAIiIvxpkJ6dxBGwJQECkmG+phQPC+9oYfaE9f
vYEkeTuHLMjFsS6oODQRJ7BgrOp1at2GKMzI/f8AJ8ZgYp6FqFk1UelsfC3nycmc
kxqcCVGzRZHq5EmgkSEAezcTfZUXiUCy4Vkmrt4Tm3AxltnfpObOzza2qRHe2I3f
zr0fIDEn5f8TSv2cZhcRefdlQPsOeS45p8YzNLn82gGHoO5lED24ctr8cbQWMcs2
W1aPwchRaBPtk5zgjRiDZSby5xFMhgXIgbjL9ThSYd7sMPRZiblvGyo8hfRbHmN4
jGVKlcCkhylCw8A5pjms7xSa9HNyecamPxlUAHPA6rg5+OIR4K8djrgv88zdzztO
xo+fiG3SbcN++NUZHo6eJTdkJr3VcNwZCAvXRH2tQnNzRvSAEvKNJmS7QI6nH99o
RJAyxN7TKK/nlMFwef/rGuPkEGZ9r0dC4rFgg8tIjpnpjXywqrZyTL2vuvzY9xYe
Bc62Yo8RYL7E8hPT2h1Yfxi3X9AP0/AyqUjdTRXnKg==
-----END CERTIFICATE-----`;

  const resolvedCaCert =
    caCert?.trim() ||
    (process.env.FINA_ENV === 'production' ? FINA_RDC_2020_CERT : null);

  console.log(
    '[FINA] CERT:',
    caCert?.trim() ? 'env' : resolvedCaCert ? 'embedded/fallback' : 'NOT SET',
  );

  if (resolvedCaCert) {
    return new Agent({
      connect: {
        ca: resolvedCaCert.includes('-----BEGIN')
          ? resolvedCaCert
          : Buffer.from(resolvedCaCert, 'base64').toString('utf8'),
      },
    });
  }

  const certPath = process.env.FINA_CA_CERT_PATH?.trim() ?? join(process.cwd(), 'certs', 'fina_full_chain.pem');
  try { return new Agent({ connect: { ca: readFileSync(certPath, 'utf8') } }); }
  catch { return new Agent({}); }
}

let _finaAgent: Agent | null = null;
function getAgent(): Agent {
  if (!_finaAgent) _finaAgent = getFinaAgent();
  return _finaAgent;
}

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

    const response = await postSoapToCis(soapXml, url, mode, 15000);
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
    const response = await postSoapToCis(body, url, 'test', 10000);
    const text = await response.text();
    const durationMs = Date.now() - started;
    if (!response.ok) return { ok: false, message: 'HTTP ' + response.status, durationMs };
    if (/EchoResponse/i.test(text) && !/soapenv:Fault/i.test(text)) return { ok: true, message: 'CIS odgovorio.', durationMs };
    return { ok: false, message: 'Neočekivan odgovor.', durationMs };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Greška mreže.', durationMs: Date.now() - started };
  }
}

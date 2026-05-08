/**
 * QR za provjeru računa na poreznoj (Tehnička specifikacija fiskalizacije).
 * URL: https://porezna.gov.hr/rn/?jir=&datv=&izn=
 */

import QRCode from 'qrcode';

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** YYYYMMDDHHmm u lokalnoj vremenskoj zoni (kao uobičajeno za HR PDF). */
export function formatDatvForFiscalQr(d: Date): string {
  return (
    `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}` +
    `${pad2(d.getHours())}${pad2(d.getMinutes())}`
  );
}

export function buildFiscalRnUrl(
  jir: string,
  datv: Date,
  ukupnoEur: number,
): string {
  const jirBezCrtica = jir.replace(/-/g, '');
  const datvStr = formatDatvForFiscalQr(datv);
  const izn = ukupnoEur.toFixed(2);
  return `https://porezna.gov.hr/rn/?jir=${encodeURIComponent(
    jirBezCrtica,
  )}&datv=${datvStr}&izn=${encodeURIComponent(izn)}`;
}

/**
 * PNG data URL pogodan za @react-pdf/renderer <Image src="..." />.
 */
export async function fiscalQrPngDataUrl(
  jir: string,
  fiscalizedAt: Date,
  ukupnoEur: number,
): Promise<string> {
  const url = buildFiscalRnUrl(jir, fiscalizedAt, ukupnoEur);
  return QRCode.toDataURL(url, {
    type: 'image/png',
    margin: 1,
    width: 240,
    errorCorrectionLevel: 'M',
  });
}

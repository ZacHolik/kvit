import QRCode from 'qrcode';

/**
 * QR s punim HRVHUB30 payloadom (isti tekst kao za PDF417) — mobilne bankovne
 * aplikacije u HR često skeniraju QR umjesto PDF417 na papiru.
 */
export async function hub3PaymentQrDataUrl(hub3Payload: string): Promise<string> {
  return QRCode.toDataURL(hub3Payload, {
    type: 'image/png',
    margin: 2,
    width: 320,
    errorCorrectionLevel: 'H',
  });
}

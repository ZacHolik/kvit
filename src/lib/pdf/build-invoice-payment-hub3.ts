import { buildHub30EurCode, type Hub3EurInput } from '@/lib/alati/hub3-eur';

import { hub3PaymentQrDataUrl } from './hub3-payment-qr';

export type InvoicePaymentHub3Block = {
  hub3QrPngDataUrl: string;
  iban: string;
  amountEur: number;
  reference: string;
};

/**
 * Sastavi HUB3 payload, opcijski logiraj (DEBUG_HUB3=1), generiraj PNG QR za @react-pdf Image.
 */
export async function buildInvoicePaymentHub3Block(
  input: Hub3EurInput,
  forDisplay: { iban: string; amountEur: number; reference: string },
  logContext: string,
): Promise<InvoicePaymentHub3Block> {
  const hub3Payload = buildHub30EurCode(input);
  if (process.env.DEBUG_HUB3 === '1') {
    console.log(`[${logContext}] HUB3 raw payload (PDF417/QR test):\n${hub3Payload}`);
  }
  const hub3QrPngDataUrl = await hub3PaymentQrDataUrl(hub3Payload);
  return {
    hub3QrPngDataUrl,
    iban: forDisplay.iban,
    amountEur: forDisplay.amountEur,
    reference: forDisplay.reference,
  };
}

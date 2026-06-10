import crypto from 'crypto';

export function createUnsubscribeToken(leadId: string): string | null {
  const secret = process.env.LEADS_UNSUBSCRIBE_SECRET;
  if (!secret) return null;
  return crypto.createHmac('sha256', secret).update(leadId).digest('hex');
}

export function verifyUnsubscribeToken(leadId: string, token: string): boolean {
  const expected = createUnsubscribeToken(leadId);
  if (!expected || !token) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(token, 'hex'),
      Buffer.from(expected, 'hex'),
    );
  } catch {
    return false;
  }
}

export function unsubscribeUrl(leadId: string, token: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://kvik.online';
  const params = new URLSearchParams({ id: leadId, token });
  return `${appUrl}/api/leads/unsubscribe?${params.toString()}`;
}

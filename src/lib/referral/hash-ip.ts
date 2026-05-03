import { createHash } from 'crypto';

/** Sloj 2: jednosmjerni hash IP-a za referral_visits (ne sprema čisti IP). */
export function hashVisitorIpForReferral(ip: string): string {
  const normalized = ip.trim().toLowerCase() || 'unknown';
  return createHash('sha256').update(normalized).digest('hex');
}

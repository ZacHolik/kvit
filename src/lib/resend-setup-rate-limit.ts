const emailMap = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 3;
const WINDOW_MS = 60 * 60 * 1000;

export function checkResendSetupRateLimit(email: string): boolean {
  const key = email.toLowerCase().trim();
  const now = Date.now();
  const entry = emailMap.get(key);
  if (!entry || now > entry.resetAt) {
    emailMap.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= LIMIT) return false;
  entry.count++;
  return true;
}

const ipMap = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);
  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= LIMIT) return false;
  entry.count++;
  return true;
}

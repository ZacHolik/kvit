/** Client IP for rate limiting (Vercel / proxies). */
export function getClientIpFromRequest(
  request: Request & { ip?: string },
): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) {
      return first;
    }
  }
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) {
    return realIp;
  }
  if (request.ip) {
    return request.ip;
  }
  return 'unknown';
}

/** Escapes `<` for safe embedding in script[type=application/ld+json]. */
export function jsonLdSafe(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

'use client';

import { useEffect, useState } from 'react';
import type { CtaVariant } from '@/lib/cta-copy';

type Position = 'top-vodic' | 'top-alat' | 'floating' | 'bottom' | 'share';

/**
 * Vraća A/B varijantu za danu poziciju, persistent po localStorageu.
 * Default je 'A' dok useEffect ne odredi (sprječava layout shift SSR-a).
 *
 * Ako želiš per-session umjesto persistent, zamijeni localStorage sa sessionStorage.
 */
export function useCtaVariant(
  position: Position,
  available: readonly CtaVariant[] = ['A', 'B'],
): CtaVariant {
  const [variant, setVariant] = useState<CtaVariant>('A');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = `kvik_ab_${position}`;
    let stored: CtaVariant | null = null;
    try {
      stored = localStorage.getItem(key) as CtaVariant | null;
    } catch {
      /* private mode */
    }
    if (!stored || !available.includes(stored)) {
      stored = available[Math.floor(Math.random() * available.length)];
      try {
        localStorage.setItem(key, stored);
      } catch {
        /* private mode — uredu, nećemo persistati */
      }
    }
    setVariant(stored);
  }, [position, available]);

  return variant;
}

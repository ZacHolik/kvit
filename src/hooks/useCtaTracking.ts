'use client';

import { useCallback } from 'react';
import type { CtaVariant } from '@/lib/cta-copy';

type CtaPosition = 'vrh' | 'sredina' | 'floating' | 'dno';
type PageType = 'vodic' | 'alat';

type CtaClickParams = {
  cta_position: CtaPosition;
  cta_variant: CtaVariant;
  page_type: PageType;
  page_slug: string;
  cta_href?: string;
};

export function useCtaTracking() {
  const trackCtaClick = useCallback((params: CtaClickParams) => {
    if (typeof window === 'undefined') return;
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    w.gtag?.('event', 'cta_click', params);
  }, []);

  return { trackCtaClick };
}

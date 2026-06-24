'use client';

import { useCallback } from 'react';
import type { CtaVariant } from '@/lib/cta-copy';
import { sendCapiEvent } from '@/lib/meta-capi';

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

    const { cta_href, cta_variant, page_slug } = params;
    if (
      cta_href &&
      (cta_href.includes('/register') ||
        cta_href.includes('/cijene') ||
        cta_href.includes('/pricing'))
    ) {
      const eventId = crypto.randomUUID();
      if (window.fbq) {
        window.fbq(
          'track',
          'InitiateCheckout',
          { content_category: cta_href, cta_variant, page_slug },
          { eventID: eventId },
        );
      }
      void sendCapiEvent({
        event_name: 'InitiateCheckout',
        event_id: eventId,
        custom_data: { content_category: cta_href },
      });
    }
  }, []);

  return { trackCtaClick };
}

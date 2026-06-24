'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import FloatingCTA from '@/components/cta/FloatingCTA';
import { detectPageVariant } from '@/lib/cta-compliance';
import { sendCapiEvent } from '@/lib/meta-capi';

export default function VodiciFloatingWrapper() {
  const pathname = usePathname() ?? '';
  // /vodici/[slug] → slug = prvi segment nakon /vodici/
  const slug = pathname.replace(/^\/vodici\/?/, '').split('/')[0] ?? '';

  useEffect(() => {
    if (!slug) return;

    const eventId = crypto.randomUUID();
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq(
        'track',
        'ViewContent',
        { content_name: slug, content_category: 'vodic' },
        { eventID: eventId },
      );
    }
    void sendCapiEvent({
      event_name: 'ViewContent',
      event_id: eventId,
      custom_data: { content_name: slug, content_category: 'vodic' },
    });
  }, [pathname]);

  // /vodici landing — preskačemo (može distrahirati od izbornika vodiča)
  if (!slug) return null;

  const pageVariant = detectPageVariant(slug);
  return <FloatingCTA pageType="vodic" pageSlug={slug} pageVariant={pageVariant} />;
}

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import FloatingCTA from '@/components/cta/FloatingCTA';
import { sendCapiEvent } from '@/lib/meta-capi';

export default function AlatiFloatingWrapper() {
  const pathname = usePathname() ?? '';
  // /alati/[slug] → slug = prvi segment nakon /alati/
  const slug = pathname.replace(/^\/alati\/?/, '').split('/')[0] ?? '';

  useEffect(() => {
    if (!slug) return;

    const eventId = crypto.randomUUID();
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq(
        'track',
        'ViewContent',
        { content_name: slug, content_category: 'alat' },
        { eventID: eventId },
      );
    }
    void sendCapiEvent({
      event_name: 'ViewContent',
      event_id: eventId,
      custom_data: { content_name: slug, content_category: 'alat' },
    });
  }, [pathname]);

  // /alati landing — preskačemo FloatingCTA (može distrahirati od izbornika alata)
  if (!slug) return null;

  // Alati uvijek tretiraju FloatingCTA kao 'compliance' → FLOATING-A
  return <FloatingCTA pageType="alat" pageSlug={slug} pageVariant="compliance" />;
}

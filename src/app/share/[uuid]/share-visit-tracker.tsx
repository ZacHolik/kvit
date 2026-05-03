'use client';

import { useEffect, useRef } from 'react';

/** Sloj 1: jednokratno povećanje visit_count pri učitavanju /share/[uuid]. */
export function ShareVisitTracker({ shareId }: { shareId: string }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) {
      return;
    }
    sent.current = true;
    void fetch(`/api/share/${shareId}/visit`, { method: 'POST' }).catch(() => {
      // best-effort tracking
    });
  }, [shareId]);

  return null;
}

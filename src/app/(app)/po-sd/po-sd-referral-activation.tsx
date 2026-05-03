'use client';

import { useEffect, useRef } from 'react';

/** Sloj 3: jednokratno bilježenje PO-SD pregleda za referral aktivaciju. */
export function PoSdReferralActivation() {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) {
      return;
    }
    sent.current = true;
    void fetch('/api/referral/record-activation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ activationType: 'posd_preview' }),
    }).catch(() => {});
  }, []);

  return null;
}

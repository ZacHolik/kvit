'use client';

import { useEffect, useRef } from 'react';

const CODE_RE = /^[a-z0-9]{6}$/;

/** Sloj 2: referral posjet kad alat učita URL s ?ref=. */
export function ToolRefTracker({ code }: { code?: string | null }) {
  const sent = useRef(false);
  const normalized = code?.trim().toLowerCase() ?? '';

  useEffect(() => {
    if (!normalized || !CODE_RE.test(normalized) || sent.current) {
      return;
    }
    sent.current = true;
    void fetch('/api/referral/tool-ref-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referralCode: normalized }),
    }).catch(() => {});
  }, [normalized]);

  return null;
}

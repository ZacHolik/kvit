'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCtaVariant } from '@/hooks/useCtaVariant';
import { useCtaTracking } from '@/hooks/useCtaTracking';
import { FLOATING, type CtaVariant } from '@/lib/cta-copy';
import type { PageVariant } from '@/lib/cta-compliance';

type FloatingCTAProps = {
  pageType: 'vodic' | 'alat';
  pageSlug: string;
  /** compliance → FLOATING-A obvezno; howto → A/B random */
  pageVariant: PageVariant;
  /** Force varijanta (samo za /test-cta). */
  forceVariant?: CtaVariant;
  /** Force visible (samo za /test-cta — preskače scroll trigger). */
  forceVisible?: boolean;
};

const DISMISS_KEY = 'kvik_floating_cta_dismissed';
const SCROLL_THRESHOLD = 0.3; // 30%

export default function FloatingCTA({
  pageType,
  pageSlug,
  pageVariant,
  forceVariant,
  forceVisible,
}: FloatingCTAProps) {
  const randomVariant = useCtaVariant('floating', ['A', 'B']);
  const effectiveVariant: CtaVariant =
    forceVariant ?? (pageVariant === 'compliance' ? 'A' : randomVariant);

  const { trackCtaClick } = useCtaTracking();

  const [visible, setVisible] = useState<boolean>(!!forceVisible);
  const [dismissed, setDismissed] = useState(false);

  // Dismiss state iz sessionStorage
  useEffect(() => {
    if (forceVisible) return;
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === '1') {
        setDismissed(true);
      }
    } catch {
      /* private mode */
    }
  }, [forceVisible]);

  // Scroll listener — pojavi se nakon 30% scrolla
  useEffect(() => {
    if (forceVisible || dismissed) return;
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? scrollTop / docHeight : 0;
      if (ratio >= SCROLL_THRESHOLD) {
        setVisible(true);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [forceVisible, dismissed]);

  if (dismissed || !visible) return null;

  // FLOATING ima samo A i B (ne C).
  const copy = FLOATING[effectiveVariant as 'A' | 'B'] ?? FLOATING.A;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* private mode */
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-700 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/80"
      data-cta-position="floating"
      data-cta-variant={effectiveVariant}
      role="region"
      aria-label="Brza akcija"
    >
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
        <p className="min-w-0 flex-1 truncate text-sm text-slate-200">{copy.text}</p>

        <Link
          href={copy.href}
          onClick={() =>
            trackCtaClick({
              cta_position: 'floating',
              cta_variant: effectiveVariant,
              page_type: pageType,
              page_slug: pageSlug,
              cta_href: copy.href,
            })
          }
          className="inline-flex flex-shrink-0 items-center gap-2 rounded-md bg-teal-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-teal-500"
        >
          {copy.button}
          <span aria-hidden>→</span>
        </Link>

        <button
          onClick={handleDismiss}
          aria-label="Zatvori"
          className="flex-shrink-0 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

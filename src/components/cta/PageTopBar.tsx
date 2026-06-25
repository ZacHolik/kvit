'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ShareBar from '@/components/ShareBar';
import { useCtaVariant } from '@/hooks/useCtaVariant';
import { useCtaTracking } from '@/hooks/useCtaTracking';
import { TOP_VODIC, TOP_ALAT, defaultShareText } from '@/lib/cta-copy';
import type { CtaVariant } from '@/lib/cta-copy';

type PageTopBarProps = {
  pageType: 'vodic' | 'alat';
  pageSlug: string;
  /** Apsolutni URL stranice — koristi se za share i UTM. */
  pageUrl?: string;
  /** Pre-fill share tekst; default po pageType. Mora sadržavati `{url}`. */
  shareText?: string;
  /** Override hrefa CTA — koristi se na /alati/* da pokazuje na konkretan alat. */
  ctaHrefOverride?: string;
  /** Force varijanta (samo za /test-cta). U produkciji ne koristiti. */
  forceVariant?: CtaVariant;
};

export default function PageTopBar({
  pageType,
  pageSlug,
  pageUrl,
  shareText,
  ctaHrefOverride,
  forceVariant,
}: PageTopBarProps) {
  const randomVariant = useCtaVariant(pageType === 'vodic' ? 'top-vodic' : 'top-alat', ['A', 'B']);
  const variant = forceVariant ?? randomVariant;
  const { trackCtaClick } = useCtaTracking();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      !sessionStorage.getItem('kvik_landing_page')
    ) {
      sessionStorage.setItem('kvik_landing_page', window.location.pathname);
    }
  }, []);

  const source = pageType === 'vodic' ? TOP_VODIC : TOP_ALAT;
  // C nije definiran za TOP — ako je forceVariant 'C' (greška), fallback na A.
  const copy = source[variant as 'A' | 'B'] ?? source.A;
  const href = ctaHrefOverride ?? copy.href;

  const resolvedShareText = shareText ?? defaultShareText(pageType);
  const url =
    pageUrl ??
    (currentUrl ||
      `https://kvik.online/${pageType === 'vodic' ? 'vodici' : 'alati'}/${pageSlug}`);

  return (
    <div
      className="my-4 flex flex-col gap-4 rounded-lg border border-slate-800 bg-slate-900/60 p-4 md:flex-row md:items-center md:justify-between md:p-5"
      data-cta-position="vrh"
      data-cta-variant={variant}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-relaxed text-slate-200 md:text-base">{copy.text}</p>
        <div className="mt-3">
          <Link
            href={href}
            onClick={() =>
              trackCtaClick({
                cta_position: 'vrh',
                cta_variant: variant,
                page_type: pageType,
                page_slug: pageSlug,
                cta_href: href,
              })
            }
            className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500"
          >
            {copy.button}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <div className="md:flex-shrink-0">
        <ShareBar url={url} shareText={resolvedShareText} pageType={pageType} pageSlug={pageSlug} />
      </div>
    </div>
  );
}

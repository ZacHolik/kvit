'use client';

import Link from 'next/link';
import { useCtaTracking } from '@/hooks/useCtaTracking';
import { INLINE, type InlineTema } from '@/lib/cta-copy';

type InlineCTAProps = {
  /** Tema kontekstualnog CTA-a (mora odgovarati sekciji vodiča u kojoj se nalazi) */
  tema: InlineTema;
  pageSlug: string;
  /** Override teksta */
  ctaText?: string;
  /** Override gumba */
  ctaButton?: string;
  /** Override hrefa */
  ctaHref?: string;
};

export default function InlineCTA({
  tema,
  pageSlug,
  ctaText,
  ctaButton,
  ctaHref,
}: InlineCTAProps) {
  const { trackCtaClick } = useCtaTracking();
  const copy = INLINE[tema];

  const text = ctaText ?? copy.text;
  const button = ctaButton ?? copy.button;
  const href = ctaHref ?? copy.href;

  return (
    <aside
      className="my-8 rounded-lg border-l-4 border-teal-600 bg-slate-900/40 p-5"
      data-cta-position="sredina"
      data-cta-tema={tema}
    >
      <p className="text-base leading-relaxed text-slate-200">{text}</p>
      <div className="mt-3">
        <Link
          href={href}
          onClick={() =>
            trackCtaClick({
              cta_position: 'sredina',
              cta_variant: 'A',
              page_type: 'vodic',
              page_slug: pageSlug,
              cta_href: href,
            })
          }
          className="inline-flex items-center gap-2 font-medium text-teal-400 transition hover:text-teal-300"
        >
          {button}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </aside>
  );
}

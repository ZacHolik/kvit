'use client';

import Link from 'next/link';
import { useCtaVariant } from '@/hooks/useCtaVariant';
import { useCtaTracking } from '@/hooks/useCtaTracking';
import { BOTTOM, type CtaVariant } from '@/lib/cta-copy';

type BottomCTAProps = {
  pageType: 'vodic' | 'alat';
  pageSlug: string;
  /** Force varijanta — koristi se na /test-cta i ako želiš ručno odrediti varijantu. */
  forceVariant?: CtaVariant;
};

export default function BottomCTA({ pageType, pageSlug, forceVariant }: BottomCTAProps) {
  // Default A/B random. C dodaješ kad ga želiš uključiti u test: useCtaVariant('bottom', ['A','B','C']).
  const randomVariant = useCtaVariant('bottom', ['A', 'B']);
  const variant = forceVariant ?? randomVariant;

  const { trackCtaClick } = useCtaTracking();

  const copy = BOTTOM[variant];

  // Sekundarni tihi link — komplementaran primarnoj ruti
  const secondary =
    copy.href === '/register'
      ? { text: 'ili pitaj asistenta', href: '/asistent' }
      : { text: 'ili otvori račun', href: '/register' };

  return (
    <section
      className="mt-12 rounded-xl border border-slate-800 bg-slate-900/60 p-6 md:p-8"
      data-cta-position="dno"
      data-cta-variant={variant}
    >
      <p className="text-base leading-relaxed text-slate-200 md:text-lg">{copy.text}</p>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Link
          href={copy.href}
          onClick={() =>
            trackCtaClick({
              cta_position: 'dno',
              cta_variant: variant,
              page_type: pageType,
              page_slug: pageSlug,
              cta_href: copy.href,
            })
          }
          className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-5 py-2.5 font-medium text-white transition hover:bg-teal-500"
        >
          {copy.button}
          <span aria-hidden>→</span>
        </Link>

        <Link
          href={secondary.href}
          onClick={() =>
            trackCtaClick({
              cta_position: 'dno',
              cta_variant: variant,
              page_type: pageType,
              page_slug: pageSlug,
              cta_href: secondary.href,
            })
          }
          className="text-sm text-slate-400 transition hover:text-slate-200"
        >
          {secondary.text} →
        </Link>
      </div>
    </section>
  );
}

import Link from 'next/link';
import Script from 'next/script';
import { Suspense } from 'react';

import ShareBar from '@/components/ShareBar';
import LeadCapture from '@/components/LeadCapture';
import { getSiteUrl } from '@/lib/vodici-config';

export type GuideTocItem = { id: string; label: string };

export type GuideFaqItem = { question: string; answer: string };

export type GuideRelated = { href: string; title: string };

export type HowToStep = { name: string; text: string };

type GuideShellProps = {
  slug: string;
  title: string;
  /** Kratki naslov u breadcrumbu; default = title */
  breadcrumbTitle?: string;
  subtitle: string;
  readingMinutes: number;
  metaDescription: string;
  /** ISO YYYY-MM-DD za JSON-LD dateModified; default ostaje za starije stranice. */
  articleDateModified?: string;
  toc: GuideTocItem[];
  children: React.ReactNode;
  faq: GuideFaqItem[];
  related: GuideRelated[];
  howTo?: { name: string; description: string; steps: HowToStep[] };
};

function jsonLdSafe(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

export function GuideShell({
  slug,
  title,
  breadcrumbTitle,
  subtitle,
  readingMinutes,
  metaDescription,
  articleDateModified,
  toc,
  children,
  faq,
  related,
  howTo,
}: GuideShellProps) {
  const base = getSiteUrl();
  const pageUrl = `${base}/vodici/${slug}`;
  const published = '2026-04-11';
  const modified = articleDateModified ?? '2026-04-11';
  const breadcrumbLabel = breadcrumbTitle ?? title;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Kvik',
        item: base,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Vodiči',
        item: `${base}/vodici`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: breadcrumbLabel,
        item: pageUrl,
      },
    ],
  };

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${pageUrl}#article`,
    headline: title,
    description: metaDescription,
    datePublished: published,
    dateModified: modified,
    author: {
      '@type': 'Organization',
      name: 'Kvik',
      url: base,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kvik',
      url: base,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    inLanguage: 'hr-HR',
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const howToLd = howTo
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: howTo.name,
        description: howTo.description,
        step: howTo.steps.map((s, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: s.name,
          text: s.text,
        })),
      }
    : null;

  return (
    <>
      <Script
        id={`vodici-${slug}-breadcrumb-jsonld`}
        key={`vodici-${slug}-breadcrumb-jsonld`}
        type='application/ld+json'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(breadcrumbLd) }}
      />
      <Script
        id={`vodici-${slug}-article-jsonld`}
        key={`vodici-${slug}-article-jsonld`}
        type='application/ld+json'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(articleLd) }}
      />
      <Script
        id={`vodici-${slug}-faq-jsonld`}
        key={`vodici-${slug}-faq-jsonld`}
        type='application/ld+json'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(faqLd) }}
      />
      {howToLd ? (
        <Script
          id={`vodici-${slug}-howto-jsonld`}
          key={`vodici-${slug}-howto-jsonld`}
          type='application/ld+json'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{ __html: jsonLdSafe(howToLd) }}
        />
      ) : null}

      <article className='mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8'>
        <nav aria-label='Putanja' className='mb-8 text-sm text-[#94a3a0]'>
          <ol className='flex flex-wrap items-center gap-2'>
            <li>
              <Link href='/' className='transition hover:text-[#0d9488]'>
                Kvik
              </Link>
            </li>
            <li aria-hidden='true'>/</li>
            <li>
              <Link href='/vodici' className='transition hover:text-[#0d9488]'>
                Vodiči
              </Link>
            </li>
            <li aria-hidden='true'>/</li>
            <li className='text-[#d5dfdd]'>{breadcrumbLabel}</li>
          </ol>
        </nav>

        <header className='mb-10 border-b border-[#1f2a28] pb-8'>
          <p className='font-body flex flex-wrap items-center gap-2 text-sm font-medium text-[#0d9488]'>
            <span>Vodič · oko {readingMinutes} min čitanja</span>
            <span
              className='rounded-full border border-[#0d9488]/40 bg-[#0d9488]/10 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-[#5eead4]'
              title='Sadržaj je usklađen s pravilima i iznosima za kalendarsku godinu 2026.'
            >
              Ažurirano za 2026.
            </span>
          </p>
          <h1 className='font-heading mt-3 text-3xl font-bold leading-tight text-[#e2e8e7] sm:text-4xl'>
            {title}
          </h1>
          <p className='font-body mt-4 text-lg text-[#b9c7c4]'>{subtitle}</p>
        </header>

        {/* Share */}
        <div className="my-6 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-[#94a3a0] mr-1">Podijeli ovaj članak:</span>
          <ShareBar
            url={pageUrl}
            shareText={`Koristan vodič za paušaliste: {url}`}
            pageType="vodic"
            pageSlug={slug}
          />
        </div>

        {/* Stripe CTA */}
        <div
          className="my-6 rounded-2xl border-[1.5px] border-[#d97706] p-6 text-center"
          style={{ background: 'rgba(217,119,6,0.04)' }}
        >
          <p className="text-xs font-medium uppercase tracking-widest text-[#d97706] mb-2">
            Pretplati se na Kvik.online aplikaciju
          </p>
          <p className="text-base text-[#e2e8e7] leading-relaxed mb-4">
            Knjigovodstvo za paušaliste, bez stresa, bez knjigovođe.
            <br className="hidden sm:inline" />
            Uvijek i svugdje s tobom na tvome mobitelu.
          </p>
          <Link
            href="/cijene"
            className="inline-block rounded-xl px-8 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            style={{ backgroundColor: '#d97706' }}
          >
            Probaj 7 dana besplatno →
          </Link>
        </div>

        {/* Email capture */}
        <Suspense fallback={null}>
          <LeadCapture
            sourceTool={`vodic-${slug}`}
            personaHint="citac-vodica"
            headlineOverride="📩 Primi ovaj skraćeni vodič kao PDF na email"
            subtitleOverride="Dobivaš skraćenu verziju ovog vodiča s najvažnijim točkama i aktivnim linkovima — za čitanje kad imaš vremena."
          />
        </Suspense>

        <nav
          aria-label='Sadržaj'
          className='mb-10 rounded-2xl border border-[#1f2a28] bg-[#111716] p-5'
        >
          <h2 className='font-heading text-sm font-semibold uppercase tracking-wide text-[#94a3a0]'>
            Sadržaj
          </h2>
          <ol className='mt-3 list-decimal space-y-2 pl-5 font-body text-sm text-[#d5dfdd]'>
            {toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className='text-[#0d9488] hover:underline'>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href='#faq' className='text-[#0d9488] hover:underline'>
                Česta pitanja
              </a>
            </li>
          </ol>
        </nav>

        <div className='guide-prose font-body text-[#d5dfdd]'>{children}</div>

        <section
          id='faq'
          className='mt-14 scroll-mt-24 border-t border-[#1f2a28] pt-10'
        >
          <h2 className='font-heading text-2xl font-bold text-[#e2e8e7]'>
            Česta pitanja
          </h2>
          <dl className='mt-6 space-y-6'>
            {faq.map((item) => (
              <div
                key={item.question}
                className='rounded-xl border border-[#1f2a28] bg-[#111716] p-5'
              >
                <dt className='font-heading font-semibold text-[#e2e8e7]'>
                  {item.question}
                </dt>
                <dd className='mt-2 text-sm leading-relaxed text-[#b9c7c4]'>
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className='mt-14'>
          <h2 className='font-heading text-xl font-bold text-[#e2e8e7]'>
            Povezani vodiči
          </h2>
          <ul className='mt-4 space-y-3'>
            {related.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className='font-body text-[#0d9488] hover:underline'
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Stripe CTA — podnožje */}
        <div
          className="mt-14 rounded-2xl border-[1.5px] border-[#d97706] p-6 text-center"
          style={{ background: 'rgba(217,119,6,0.04)' }}
        >
          <p className="text-lg font-medium text-[#e2e8e7] leading-relaxed mb-2">
            Ako si ovo dočitao, znaš više od prosječnog paušalista.
          </p>
          <p className="text-sm text-[#94a3a0] leading-relaxed mb-5">
            Sad imaš i alat koji to primjenjuje umjesto tebe — svaki rok,
            svaki obrazac, svako porezno pitanje.
          </p>
          <Link
            href="/cijene"
            className="inline-block rounded-xl px-8 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            style={{ backgroundColor: '#d97706' }}
          >
            Aktiviraj Kvik →
          </Link>
        </div>

        {/* Share — podnožje */}
        <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-sm text-[#94a3a0] mr-1">Podijeli ovaj članak:</span>
          <ShareBar
            url={pageUrl}
            shareText={`Koristan vodič za paušaliste: {url}`}
            pageType="vodic"
            pageSlug={slug}
          />
        </div>

        {/* Email capture — podnožje */}
        <div className="mt-8">
          <Suspense fallback={null}>
            <LeadCapture
              sourceTool={`vodic-${slug}`}
              personaHint="citac-vodica"
              headlineOverride="📩 Primi ovaj skraćeni vodič kao PDF na email"
              subtitleOverride="Dobivaš skraćenu verziju ovog vodiča s najvažnijim točkama i aktivnim linkovima — za čitanje kad imaš vremena."
            />
          </Suspense>
        </div>
      </article>
    </>
  );
}

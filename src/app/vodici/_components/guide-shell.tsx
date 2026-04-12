import Link from 'next/link';

import { getSiteUrl } from '@/lib/vodici-config';

export type GuideTocItem = { id: string; label: string };

export type GuideFaqItem = { question: string; answer: string };

export type GuideRelated = { href: string; title: string };

export type HowToStep = { name: string; text: string };

type GuideShellProps = {
  slug: string;
  title: string;
  subtitle: string;
  readingMinutes: number;
  metaDescription: string;
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
  subtitle,
  readingMinutes,
  metaDescription,
  toc,
  children,
  faq,
  related,
  howTo,
}: GuideShellProps) {
  const base = getSiteUrl();
  const pageUrl = `${base}/vodici/${slug}`;
  const published = '2026-04-11';
  const modified = '2026-04-11';

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Kvit',
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
        name: title,
        item: pageUrl,
      },
    ],
  };

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: metaDescription,
    datePublished: published,
    dateModified: modified,
    author: {
      '@type': 'Organization',
      name: 'Kvit',
      url: base,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kvit',
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
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(breadcrumbLd) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(articleLd) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(faqLd) }}
      />
      {howToLd ? (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: jsonLdSafe(howToLd) }}
        />
      ) : null}

      <article className='mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8'>
        <nav aria-label='Putanja' className='mb-8 text-sm text-[#94a3a0]'>
          <ol className='flex flex-wrap items-center gap-2'>
            <li>
              <Link href='/' className='transition hover:text-[#0d9488]'>
                Kvit
              </Link>
            </li>
            <li aria-hidden='true'>/</li>
            <li>
              <Link href='/vodici' className='transition hover:text-[#0d9488]'>
                Vodiči
              </Link>
            </li>
            <li aria-hidden='true'>/</li>
            <li className='text-[#d5dfdd]'>{title}</li>
          </ol>
        </nav>

        <header className='mb-10 border-b border-[#1f2a28] pb-8'>
          <p className='font-body text-sm font-medium text-[#0d9488]'>
            Vodič · oko {readingMinutes} min čitanja
          </p>
          <h1 className='font-heading mt-3 text-3xl font-bold leading-tight text-[#e2e8e7] sm:text-4xl'>
            {title}
          </h1>
          <p className='font-body mt-4 text-lg text-[#b9c7c4]'>{subtitle}</p>
        </header>

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

        <div className='mt-10 grid gap-4 sm:grid-cols-2'>
          <div className='rounded-2xl border border-[#0d9488]/40 bg-[#111716] p-6'>
            <p className='font-heading text-lg font-semibold text-[#e2e8e7]'>
              Isprobaj Kvit besplatno
            </p>
            <p className='mt-2 text-sm text-[#94a3a0]'>
              Računi, KPR i PO-SD na jednom mjestu — bez papira.
            </p>
            <Link
              href='/register'
              className='mt-4 inline-flex rounded-lg bg-[#0d9488] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14b8a6]'
            >
              Registriraj se
            </Link>
          </div>
          <div className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-6'>
            <p className='font-heading text-lg font-semibold text-[#e2e8e7]'>
              Imaš pitanje? Pitaj AI asistenta
            </p>
            <p className='mt-2 text-sm text-[#94a3a0]'>
              Unutar aplikacije Kvit AI odgovara na pitanja o paušalu.
            </p>
            <Link
              href='/asistent'
              className='mt-4 inline-flex rounded-lg border border-[#0d9488] px-4 py-2.5 text-sm font-semibold text-[#0d9488] transition hover:bg-[#0d9488]/10'
            >
              Otvori asistenta
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}

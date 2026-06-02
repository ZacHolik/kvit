import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

import { getSiteUrl } from '@/lib/vodici-config';
import PageTopBar from '@/components/cta/PageTopBar';
import BottomCTA from '@/components/cta/BottomCTA';

import { AlatiBreadcrumb } from '../_components/alati-breadcrumb';
import { PoweredByKvikBadge } from '../_components/powered-by-kvik-badge';
import { jsonLdSafe } from '../_components/json-ld';

import { PdvPragCalculator } from './pdv-prag-calculator';

const TITLE = 'Kalkulator PDV praga 2026 — paušalni obrt | Kvik';
const DESC =
  'Provjeri koliko si blizu PDV praga od 60.000€. Unesi dosadašnje prihode i vidi upozorenje na vrijeme.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    'PDV prag kalkulator',
    'PDV prag paušalni obrt',
    'PDV prag 60000',
    'paušalni obrt PDV',
  ],
  alternates: { canonical: 'https://kvik.online/alati/pdv-prag' },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `${getSiteUrl()}/alati/pdv-prag`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'website',
  },
};

export default function PdvPragPage() {
  const base = getSiteUrl();
  const pageUrl = `${base}/alati/pdv-prag`;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Kvik', item: base },
      { '@type': 'ListItem', position: 2, name: 'Alati', item: `${base}/alati` },
      { '@type': 'ListItem', position: 3, name: 'PDV prag', item: pageUrl },
    ],
  };

  return (
    <>
      <Script
        id='alati-pdv-breadcrumb-jsonld'
        type='application/ld+json'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(breadcrumbLd) }}
      />

      <article className='mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8'>
        <AlatiBreadcrumb
          items={[
            { label: 'Kvik', href: '/' },
            { label: 'Alati', href: '/alati' },
            { label: 'PDV prag' },
          ]}
        />

        <header className='mb-8 border-b border-[#1f2a28] pb-8'>
          <p className='font-body text-sm font-medium text-[#0d9488]'>Alat · FREEMIUM · 2026.</p>
          <h1 className='font-heading mt-3 text-3xl font-bold leading-tight text-[#e2e8e7] sm:text-4xl'>
            {TITLE}
          </h1>
          <p className='font-body mt-4 text-lg text-[#b9c7c4]'>{DESC}</p>
        </header>

        <PageTopBar
          pageType='alat'
          pageSlug='pdv-prag'
          pageUrl={pageUrl}
          ctaHrefOverride='/alati/pdv-prag'
        />

        <PdvPragCalculator />

        <section className='mt-10 font-body text-sm text-[#94a3a0]'>
          <h2 className='font-heading text-base font-semibold text-[#e2e8e7]'>
            Povezani vodiči
          </h2>
          <ul className='mt-3 list-disc space-y-2 pl-5'>
            <li>
              <Link
                href='/vodici/pausalni-obrt-vodic'
                className='text-[#0d9488] hover:underline'
              >
                Paušalni obrt — kompletan vodič
              </Link>
            </li>
            <li>
              <Link href='/vodici/po-sd-obrazac' className='text-[#0d9488] hover:underline'>
                PO-SD obrazac
              </Link>
            </li>
          </ul>
        </section>

        <BottomCTA pageType='alat' pageSlug='pdv-prag' />
        <PoweredByKvikBadge />
      </article>
    </>
  );
}

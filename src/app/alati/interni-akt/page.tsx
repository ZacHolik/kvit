import type { Metadata } from 'next';

import { buildAlatMetadata } from '@/lib/og-metadata';
import Link from 'next/link';
import Script from 'next/script';

import { getSiteUrl } from '@/lib/vodici-config';
import PageTopBar from '@/components/cta/PageTopBar';
import BottomCTA from '@/components/cta/BottomCTA';

import { AlatiBreadcrumb } from '../_components/alati-breadcrumb';
import { PoweredByKvikBadge } from '../_components/powered-by-kvik-badge';
import { jsonLdSafe } from '../_components/json-ld';

import { InterniAktTool } from './interni-akt-tool';

const TITLE = 'Generator internog akta za paušalce 2026 | Kvik';
const DESC =
  'Uredi interni akt paušalnog obrta online i preuzmi PDF. Besplatno za goste; prijavljeni korisnici dobiju automatsko popunjavanje iz profila.';

export const metadata: Metadata = buildAlatMetadata(
  'interni-akt',
  TITLE,
  DESC,
  { keywords: [
    'interni akt paušalni obrt',
    'interni akt obrt',
    'predložak internog akta',
    'interni akt 2026',
  ] }
);

export default function InterniAktPage() {
  const base = getSiteUrl();
  const pageUrl = `${base}/alati/interni-akt`;
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Kvik', item: base },
      { '@type': 'ListItem', position: 2, name: 'Alati', item: `${base}/alati` },
      { '@type': 'ListItem', position: 3, name: 'Interni akt', item: pageUrl },
    ],
  };

  return (
    <>
      <Script
        id='alati-interni-akt-breadcrumb-jsonld'
        type='application/ld+json'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(breadcrumbLd) }}
      />
      <article className='mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8'>
        <AlatiBreadcrumb
          items={[
            { label: 'Kvik', href: '/' },
            { label: 'Alati', href: '/alati' },
            { label: 'Interni akt' },
          ]}
        />
        <header className='mb-8 border-b border-[#1f2a28] pb-8'>
          <p className='font-body text-sm font-medium text-[#0d9488]'>Alat · FREEMIUM</p>
          <h1 className='font-heading mt-3 text-3xl font-bold leading-tight text-[#e2e8e7] sm:text-4xl'>
            {TITLE}
          </h1>
          <p className='font-body mt-4 text-lg text-[#b9c7c4]'>{DESC}</p>
        </header>
        <PageTopBar
          pageType='alat'
          pageSlug='interni-akt'
          pageUrl={pageUrl}
          ctaHrefOverride='/alati/interni-akt'
        />
        <InterniAktTool />
        <section className='mt-10 font-body text-sm text-[#94a3a0]'>
          <h2 className='font-heading text-base font-semibold text-[#e2e8e7]'>Povezano</h2>
          <ul className='mt-3 list-disc space-y-2 pl-5'>
            <li>
              <Link href='/vodici/otvaranje-obrta' className='text-[#0d9488] hover:underline'>
                Otvaranje obrta
              </Link>
            </li>
          </ul>
        </section>
        <BottomCTA pageType='alat' pageSlug='interni-akt' />
        <PoweredByKvikBadge />
      </article>
    </>
  );
}

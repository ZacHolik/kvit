import type { Metadata } from 'next';

import { buildAlatMetadata } from '@/lib/og-metadata';
import Script from 'next/script';

import { getSiteUrl } from '@/lib/vodici-config';
import PageTopBar from '@/components/cta/PageTopBar';
import BottomCTA from '@/components/cta/BottomCTA';

import { AlatiBreadcrumb } from '../_components/alati-breadcrumb';
import { jsonLdSafe } from '../_components/json-ld';

import { IzjavaPoslovniProstorTool } from './izjava-poslovni-prostor-tool';

const TITLE = 'Izjava o suglasnosti za tuđi poslovni prostor (PDF)';
const DESC =
  'Generator PDF izjave za paušalni obrt koji koristi tuđi poslovni prostor. Alat je dostupan pretplatnicima Paušalist PRO.';

export const metadata: Metadata = buildAlatMetadata(
  'izjava-poslovni-prostor',
  TITLE,
  DESC,
  { keywords: ['izjava poslovni prostor', 'tuđi poslovni prostor obrt', 'suglasnost'] }
);

export default function IzjavaPoslovniProstorPage() {
  const base = getSiteUrl();
  const pageUrl = `${base}/alati/izjava-poslovni-prostor`;
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Kvik', item: base },
      { '@type': 'ListItem', position: 2, name: 'Alati', item: `${base}/alati` },
      { '@type': 'ListItem', position: 3, name: 'Izjava — poslovni prostor', item: pageUrl },
    ],
  };

  return (
    <>
      <Script
        id='alati-izjava-prostor-jsonld'
        type='application/ld+json'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(breadcrumbLd) }}
      />
      <article className='mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8'>
        <AlatiBreadcrumb
          items={[
            { label: 'Kvik', href: '/' },
            { label: 'Alati', href: '/alati' },
            { label: 'Izjava — poslovni prostor' },
          ]}
        />
        <header className='mb-8 border-b border-[#1f2a28] pb-8'>
          <p className='font-body text-sm font-medium text-amber-400/90'>Alat · PRO</p>
          <h1 className='font-heading mt-3 text-3xl font-bold leading-tight text-[#e2e8e7] sm:text-4xl'>
            {TITLE}
          </h1>
          <p className='font-body mt-4 text-lg text-[#b9c7c4]'>{DESC}</p>
        </header>
        <PageTopBar
          pageType='alat'
          pageSlug='izjava-poslovni-prostor'
          pageUrl={pageUrl}
          ctaHrefOverride='/alati/izjava-poslovni-prostor'
        />
        <IzjavaPoslovniProstorTool />
        <BottomCTA pageType='alat' pageSlug='izjava-poslovni-prostor' />
      </article>
    </>
  );
}

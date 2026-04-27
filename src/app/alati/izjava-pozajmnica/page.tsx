import type { Metadata } from 'next';
import Script from 'next/script';

import { getSiteUrl } from '@/lib/vodici-config';

import { AlatiBreadcrumb } from '../_components/alati-breadcrumb';
import { jsonLdSafe } from '../_components/json-ld';

import { IzjavaPozajmnicaTool } from './izjava-pozajmnica-tool';

const TITLE = 'Izjava o pozajmici vlasnika — PDF za obrt';
const DESC =
  'Predložak PDF izjave o pozajmici imovine vlasnika za potrebe paušalnog obrta. Dostupno isključivo pretplatnicima Paušalist PRO.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ['izjava pozajmnica', 'pozajmica vlasnika obrt', 'paušalni obrt izjava'],
  openGraph: {
    title: `${TITLE} | Kvik`,
    description: DESC,
    url: `${getSiteUrl()}/alati/izjava-pozajmnica`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'website',
  },
};

export default function IzjavaPozajmnicaPage() {
  const base = getSiteUrl();
  const pageUrl = `${base}/alati/izjava-pozajmnica`;
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Kvik', item: base },
      { '@type': 'ListItem', position: 2, name: 'Alati', item: `${base}/alati` },
      { '@type': 'ListItem', position: 3, name: 'Izjava — pozajmnica', item: pageUrl },
    ],
  };

  return (
    <>
      <Script
        id='alati-izjava-pozajmnica-jsonld'
        type='application/ld+json'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(breadcrumbLd) }}
      />
      <article className='mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8'>
        <AlatiBreadcrumb
          items={[
            { label: 'Kvik', href: '/' },
            { label: 'Alati', href: '/alati' },
            { label: 'Izjava — pozajmnica' },
          ]}
        />
        <header className='mb-8 border-b border-[#1f2a28] pb-8'>
          <p className='font-body text-sm font-medium text-amber-400/90'>Alat · PRO</p>
          <h1 className='font-heading mt-3 text-3xl font-bold leading-tight text-[#e2e8e7] sm:text-4xl'>
            {TITLE}
          </h1>
          <p className='font-body mt-4 text-lg text-[#b9c7c4]'>{DESC}</p>
        </header>
        <IzjavaPozajmnicaTool />
      </article>
    </>
  );
}

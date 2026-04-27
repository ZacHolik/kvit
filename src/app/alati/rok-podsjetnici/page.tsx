import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

import { getSiteUrl } from '@/lib/vodici-config';

import { AlatiBreadcrumb } from '../_components/alati-breadcrumb';
import { CtaRegister } from '../_components/cta-register';
import { jsonLdSafe } from '../_components/json-ld';

import { RokPodsjetniciClient } from './rok-podsjetnici-client';

const TITLE = 'Rok podsjetnici — zakoniti rokovi za paušalni obrt';
const DESC =
  'Pregled tipičnih mjesečnih, kvartalnih i godišnjih rokova za paušalnog obrtnika. Gost: pregled. PRO: push i email obavijesti (uskoro u Kviku).';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ['rokovi paušalni obrt', 'podsjetnici porez', 'obveze obrt'],
  openGraph: {
    title: `${TITLE} | Kvik`,
    description: DESC,
    url: `${getSiteUrl()}/alati/rok-podsjetnici`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'website',
  },
};

export default function RokPodsjetniciPage() {
  const base = getSiteUrl();
  const pageUrl = `${base}/alati/rok-podsjetnici`;
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Kvik', item: base },
      { '@type': 'ListItem', position: 2, name: 'Alati', item: `${base}/alati` },
      { '@type': 'ListItem', position: 3, name: 'Rok podsjetnici', item: pageUrl },
    ],
  };

  return (
    <>
      <Script
        id='alati-rokovi-jsonld'
        type='application/ld+json'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(breadcrumbLd) }}
      />
      <article className='mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8'>
        <AlatiBreadcrumb
          items={[
            { label: 'Kvik', href: '/' },
            { label: 'Alati', href: '/alati' },
            { label: 'Rok podsjetnici' },
          ]}
        />
        <header className='mb-8 border-b border-[#1f2a28] pb-8'>
          <p className='font-body text-sm font-medium text-[#0d9488]'>Alat · FREEMIUM</p>
          <h1 className='font-heading mt-3 text-3xl font-bold leading-tight text-[#e2e8e7] sm:text-4xl'>
            {TITLE}
          </h1>
          <p className='font-body mt-4 text-lg text-[#b9c7c4]'>{DESC}</p>
        </header>
        <RokPodsjetniciClient />
        <section className='mt-10 font-body text-sm text-[#94a3a0]'>
          <h2 className='font-heading text-base font-semibold text-[#e2e8e7]'>Povezano</h2>
          <ul className='mt-3 list-disc space-y-2 pl-5'>
            <li>
              <Link href='/alati/checklista' className='text-[#0d9488] hover:underline'>
                Checklista obveza
              </Link>
            </li>
          </ul>
        </section>
        <CtaRegister
          title='Želiš rokove na dashboardu i u mobitelu?'
          body='Kvik povezuje KPR, račune i podsjetnike na jednom mjestu.'
          buttonLabel='Registriraj se →'
        />
      </article>
    </>
  );
}

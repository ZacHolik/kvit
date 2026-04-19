import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

import { getSiteUrl } from '@/lib/vodici-config';

import { AlatiBreadcrumb } from '../_components/alati-breadcrumb';
import { CtaRegister } from '../_components/cta-register';
import { jsonLdSafe } from '../_components/json-ld';

import { ObligationsChecklist } from './obligations-checklist';

const TITLE = 'Checklista obveza paušalnog obrtnika 2026.';
const DESC =
  'Kompletna checklista svih obveza paušalnog obrtnika: mjesečnih, kvartalnih i godišnjih. Interaktivna i besplatna.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ['obveze paušalnog obrtnika checklista', 'paušalni obrt obveze', 'checklista'],
  openGraph: {
    title: `${TITLE} | Kvit`,
    description: DESC,
    url: `${getSiteUrl()}/alati/checklista`,
    siteName: 'Kvit',
    locale: 'hr_HR',
    type: 'website',
  },
};

export default function ChecklistaPage() {
  const base = getSiteUrl();
  const pageUrl = `${base}/alati/checklista`;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Kvit', item: base },
      { '@type': 'ListItem', position: 2, name: 'Alati', item: `${base}/alati` },
      { '@type': 'ListItem', position: 3, name: 'Checklista', item: pageUrl },
    ],
  };

  return (
    <>
      <Script
        id='alati-checklista-breadcrumb-jsonld'
        type='application/ld+json'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(breadcrumbLd) }}
      />

      <article className='mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8'>
        <AlatiBreadcrumb
          items={[
            { label: 'Kvit', href: '/' },
            { label: 'Alati', href: '/alati' },
            { label: 'Checklista' },
          ]}
        />

        <header className='mb-8 border-b border-[#1f2a28] pb-8'>
          <p className='font-body text-sm font-medium text-[#0d9488]'>Alat · 2026.</p>
          <h1 className='font-heading mt-3 text-3xl font-bold leading-tight text-[#e2e8e7] sm:text-4xl'>
            {TITLE}
          </h1>
          <p className='font-body mt-4 text-lg text-[#b9c7c4]'>{DESC}</p>
        </header>

        <ObligationsChecklist />

        <section className='mt-10 font-body text-sm text-[#94a3a0]'>
          <h2 className='font-heading text-base font-semibold text-[#e2e8e7]'>
            Povezani vodiči
          </h2>
          <ul className='mt-3 list-disc space-y-2 pl-5'>
            <li>
              <Link href='/vodici/doprinosi' className='text-[#0d9488] hover:underline'>
                Doprinosi
              </Link>
            </li>
            <li>
              <Link href='/vodici/po-sd-obrazac' className='text-[#0d9488] hover:underline'>
                PO-SD obrazac
              </Link>
            </li>
            <li>
              <Link
                href='/vodici/kpr-knjiga-prometa'
                className='text-[#0d9488] hover:underline'
              >
                KPR — knjiga prometa
              </Link>
            </li>
          </ul>
        </section>

        <CtaRegister
          title='Kvit automatski prati rokove i šalje ti podsjetnike da ništa ne zaboraviš.'
          body='Kombiniraj ovu listu s aplikacijom — podsjetnici stižu kad treba.'
          buttonLabel='Registriraj se besplatno →'
        />
      </article>
    </>
  );
}

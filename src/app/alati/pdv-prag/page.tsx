import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

import { getSiteUrl } from '@/lib/vodici-config';

import { AlatiBreadcrumb } from '../_components/alati-breadcrumb';
import { CtaRegister } from '../_components/cta-register';
import { jsonLdSafe } from '../_components/json-ld';

import { PdvPragCalculator } from './pdv-prag-calculator';

const TITLE = 'Kalkulator PDV praga – paušalni obrt 2026.';
const DESC =
  'Provjeri koliko si blizu PDV praga od 60.000€. Unesi dosadašnje prihode i vidi upozorenje na vrijeme.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    'PDV prag kalkulator',
    'PDV prag paušalni obrt',
    'PDV prag',
    'paušalni obrt',
  ],
  openGraph: {
    title: `${TITLE} | Kvik`,
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

        <CtaRegister
          title='Kvik ti pokazuje PDV prag u realnom vremenu na dashboardu — uvijek znaš gdje si.'
          body='Prati primitke i prag bez ručnog proračuna u tablicama.'
          buttonLabel='Isprobaj besplatno →'
        />
      </article>
    </>
  );
}

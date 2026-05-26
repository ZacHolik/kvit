import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

import { getSiteUrl } from '@/lib/vodici-config';

import { AlatiBreadcrumb } from '../_components/alati-breadcrumb';
import { CtaRegister } from '../_components/cta-register';
import { PoweredByKvikBadge } from '../_components/powered-by-kvik-badge';
import { jsonLdSafe } from '../_components/json-ld';

import { PismoBankaForm } from './PismoBankaForm';

const TITLE = 'Generator pisma za otvaranje bankovnog računa | Kvik';
const DESC =
  'Automatski generiraj profesionalno pismo za otvaranje poslovnog računa u banci. Povlači podatke iz Kvik registracije — brzo i bez greške.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    'pismo banka obrt',
    'otvaranje poslovnog računa',
    'paušalni obrt banka',
    'generator pisma banka',
  ],
  alternates: { canonical: 'https://kvik.online/alati/pismo-banka' },
  openGraph: {
    title: 'Generator pisma za banku | Kvik',
    description:
      'Brzo generiraj pismo za otvaranje računa — povlači podatke iz tvog Kvik profila.',
    url: `${getSiteUrl()}/alati/pismo-banka`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'website',
  },
};

export default function PismoBankaPage() {
  const base = getSiteUrl();
  const pageUrl = `${base}/alati/pismo-banka`;
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Kvik', item: base },
      { '@type': 'ListItem', position: 2, name: 'Alati', item: `${base}/alati` },
      { '@type': 'ListItem', position: 3, name: 'Pismo za banku', item: pageUrl },
    ],
  };

  return (
    <>
      <Script
        id='alati-pismo-banka-breadcrumb-jsonld'
        type='application/ld+json'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(breadcrumbLd) }}
      />
      <article className='mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
        <AlatiBreadcrumb
          items={[
            { label: 'Kvik', href: '/' },
            { label: 'Alati', href: '/alati' },
            { label: 'Pismo za banku' },
          ]}
        />
        <header className='mb-8 border-b border-[#1f2a28] pb-8'>
          <p className='font-body text-sm font-medium text-[#0d9488]'>Alat · FREEMIUM</p>
          <h1 className='font-heading mt-3 text-3xl font-bold leading-tight text-[#e2e8e7] sm:text-4xl'>
            Generator pisma za otvaranje bankovnog računa
          </h1>
          <p className='font-body mt-4 text-lg text-[#b9c7c4]'>{DESC}</p>
        </header>
        <PismoBankaForm />
        <section className='mt-10 font-body text-sm text-[#94a3a0]'>
          <h2 className='font-heading text-base font-semibold text-[#e2e8e7]'>Povezano</h2>
          <ul className='mt-3 list-disc space-y-2 pl-5'>
            <li>
              <Link href='/vodici/otvaranje-obrta' className='text-[#0d9488] hover:underline'>
                Otvaranje obrta
              </Link>
            </li>
            <li>
              <Link href='/alati/interni-akt' className='text-[#0d9488] hover:underline'>
                Interni akt
              </Link>
            </li>
          </ul>
        </section>
        <CtaRegister
          title='Kvik drži profil, KPR i račune na jednom mjestu.'
          body='Manje kopiranja u obrasce — više vremena za klijente.'
          buttonLabel='Registriraj se besplatno →'
          utmSrc='pismo-banka'
        />
        <PoweredByKvikBadge />
      </article>
    </>
  );
}

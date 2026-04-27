import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

import { getSiteUrl } from '@/lib/vodici-config';

import { AlatiBreadcrumb } from '../_components/alati-breadcrumb';
import { CtaRegister } from '../_components/cta-register';
import { jsonLdSafe } from '../_components/json-ld';

import { PausalTaxCalculator } from './pausal-tax-calculator';

const TITLE = 'Kalkulator paušalnog poreza 2026 — razredi i obveze';
const DESC =
  'Izračunaj paušalni porez za 2026. godinu. Unesi godišnji prihod i odmah vidi porezni razred, kvartalnu i godišnju obvezu.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ['kalkulator paušalnog poreza 2026', 'paušalni porez', 'porezni razred'],
  openGraph: {
    title: `${TITLE} | Kvik`,
    description: DESC,
    url: `${getSiteUrl()}/alati/kalkulator-poreza`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'website',
  },
};

const FAQ = [
  {
    question: 'Kako se računa paušalni porez na dohodak?',
    answer:
      'Paušalni obrt plaća fiksni iznos po kvartalu ovisno o poreznom razredu, koji ovisi o godišnjem prihodu. Ovaj alat koristi službene iznose za 2026.',
  },
  {
    question: 'Je li ovo konačan iznos poreza?',
    answer:
      'Ne — ovo je informativna procjena. Na stvarni iznos utječu prirez općine i drugi faktori; provjeri s računovođom ili Poreznom upravom.',
  },
  {
    question: 'Kada se plaća paušalni porez?',
    answer:
      'Kvartalna obveza dospijeva do kraja mjeseca nakon završetka kvartala (npr. za I. kvartal tipično do kraja travnja).',
  },
  {
    question: 'Gdje predajem PO-SD i pratim obveze?',
    answer:
      'Godišnji PO-SD predaje se u ePoreznoj. U aplikaciji Kvik možeš voditi KPR i račune na jednom mjestu.',
  },
];

export default function KalkulatorPorezaPage() {
  const base = getSiteUrl();
  const pageUrl = `${base}/alati/kalkulator-poreza`;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Kvik', item: base },
      { '@type': 'ListItem', position: 2, name: 'Alati', item: `${base}/alati` },
      {
        '@type': 'ListItem',
        position: 3,
        name: TITLE,
        item: pageUrl,
      },
    ],
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <>
      <Script
        id='alati-kalkulator-breadcrumb-jsonld'
        type='application/ld+json'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(breadcrumbLd) }}
      />
      <Script
        id='alati-kalkulator-faq-jsonld'
        type='application/ld+json'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(faqLd) }}
      />

      <article className='mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8'>
        <AlatiBreadcrumb
          items={[
            { label: 'Kvik', href: '/' },
            { label: 'Alati', href: '/alati' },
            { label: 'Kalkulator poreza' },
          ]}
        />

        <header className='mb-8 border-b border-[#1f2a28] pb-8'>
          <p className='font-body text-sm font-medium text-[#0d9488]'>Alat · FREEMIUM · 2026.</p>
          <h1 className='font-heading mt-3 text-3xl font-bold leading-tight text-[#e2e8e7] sm:text-4xl'>
            {TITLE}
          </h1>
          <p className='font-body mt-4 text-lg text-[#b9c7c4]'>{DESC}</p>
        </header>

        <PausalTaxCalculator />

        <section className='mt-10 font-body text-sm text-[#94a3a0]'>
          <h2 className='font-heading text-base font-semibold text-[#e2e8e7]'>
            Povezani vodiči
          </h2>
          <ul className='mt-3 list-disc space-y-2 pl-5'>
            <li>
              <Link href='/vodici/po-sd-obrazac' className='text-[#0d9488] hover:underline'>
                PO-SD obrazac
              </Link>
            </li>
            <li>
              <Link href='/vodici/doprinosi' className='text-[#0d9488] hover:underline'>
                Doprinosi za paušalni obrt
              </Link>
            </li>
          </ul>
        </section>

        <CtaRegister
          title='Kvik automatski prati tvoj razred i šalje podsjetnike za kvartalni porez.'
          body='Manje ručnog proračuna — više vremena za posao.'
          buttonLabel='Registriraj se besplatno →'
        />
      </article>
    </>
  );
}

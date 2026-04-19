import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

import { getSiteUrl } from '@/lib/vodici-config';

import { jsonLdSafe } from './_components/json-ld';

const META_DESC =
  'Besplatni online alati za paušalne obrtnike: kalkulator poreza, PDV prag, checklista obveza.';

export const metadata: Metadata = {
  title: 'Besplatni alati za paušalne obrtnike',
  description: META_DESC,
  openGraph: {
    title: 'Besplatni alati za paušalne obrtnike | Kvit',
    description: META_DESC,
    url: `${getSiteUrl()}/alati`,
    siteName: 'Kvit',
    locale: 'hr_HR',
    type: 'website',
  },
};

const TOOLS = [
  {
    href: '/alati/kalkulator-poreza',
    icon: '🧮',
    title: 'Kalkulator paušalnog poreza 2026.',
    description:
      'Unesi godišnji prihod i odmah vidi porezni razred, kvartalnu i godišnju obvezu te stopu.',
  },
  {
    href: '/alati/pdv-prag',
    icon: '📊',
    title: 'Kalkulator PDV praga',
    description:
      'Provjeri koliko si blizu PDV praga od 60.000 € i dobij upozorenje na vrijeme.',
  },
  {
    href: '/alati/checklista',
    icon: '✅',
    title: 'Checklista obveza',
    description:
      'Mjesečne, kvartalne i godišnje obveze paušalnog obrtnika — interaktivna lista.',
  },
] as const;

export default function AlatiIndexPage() {
  const base = getSiteUrl();

  const navLd = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: 'Alati Kvit',
    url: `${base}/alati`,
    hasPart: TOOLS.map((t) => ({
      '@type': 'WebPage',
      name: t.title,
      url: `${base}${t.href}`,
      description: t.description,
    })),
  };

  return (
    <>
      <Script
        id='alati-navigation-jsonld'
        key='alati-navigation-jsonld'
        type='application/ld+json'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(navLd) }}
      />

      <div className='mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8'>
        <header className='max-w-3xl'>
          <p className='font-body text-sm font-medium text-[#0d9488]'>
            Besplatno · bez prijave
          </p>
          <h1 className='font-heading mt-3 text-4xl font-bold tracking-tight text-[#e2e8e7] sm:text-5xl'>
            Besplatni alati za paušalne obrtnike
          </h1>
          <p className='font-body mt-5 text-lg leading-relaxed text-[#b9c7c4]'>
            {META_DESC} Koristi ih uz aplikaciju{' '}
            <Link href='/register' className='text-[#0d9488] hover:underline'>
              Kvit
            </Link>
            .
          </p>
        </header>

        <ul className='mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {TOOLS.map((tool) => (
            <li key={tool.href}>
              <Link
                href={tool.href}
                className='group flex h-full flex-col rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 transition hover:border-[#0d9488]/50'
              >
                <span
                  className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#0d9488]/15 text-2xl'
                  aria-hidden
                >
                  {tool.icon}
                </span>
                <h2 className='font-heading mt-4 text-xl font-semibold text-[#e2e8e7] group-hover:text-[#0d9488]'>
                  {tool.title}
                </h2>
                <p className='font-body mt-2 flex-1 text-sm leading-relaxed text-[#94a3a0]'>
                  {tool.description}
                </p>
                <span className='mt-4 inline-flex items-center text-sm font-medium text-[#0d9488]'>
                  Otvori alat
                  <span className='ml-1' aria-hidden>
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className='mt-14 rounded-2xl border border-[#0d9488]/30 bg-[#111716] p-8 text-center'>
          <p className='font-heading text-xl font-semibold text-[#e2e8e7]'>
            Isprobaj Kvit besplatno
          </p>
          <p className='font-body mx-auto mt-2 max-w-lg text-sm text-[#94a3a0]'>
            Automatski prati razrede, rokove i PDV prag — manje brige oko papira.
          </p>
          <Link
            href='/register'
            className='mt-5 inline-flex rounded-lg bg-[#0d9488] px-6 py-3 font-semibold text-white transition hover:bg-[#14b8a6]'
          >
            Registriraj se
          </Link>
        </div>
      </div>
    </>
  );
}

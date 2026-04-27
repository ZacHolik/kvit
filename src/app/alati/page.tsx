import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

import { getSiteUrl } from '@/lib/vodici-config';

import { jsonLdSafe } from './_components/json-ld';

const META_DESC =
  'Alati za paušalne obrtnike: kalkulator paušalnog poreza 2026, PDV prag kalkulator, interni akt, checklista, plaćanje doprinosa, rokovi i PRO izjave. FREE, FREEMIUM i PRO oznake.';

export const metadata: Metadata = {
  title: 'Alati za paušalne obrtnike — FREE, FREEMIUM i PRO',
  description: META_DESC,
  keywords: [
    'kalkulator paušalnog poreza 2026',
    'PDV prag kalkulator',
    'interni akt paušalni obrt',
    'alati obrt',
  ],
  openGraph: {
    title: 'Alati za paušalne obrtnike | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/alati`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'website',
  },
};

type PlanBadge = 'FREE' | 'FREEMIUM' | 'PRO';

const TOOLS: {
  href: string;
  icon: string;
  title: string;
  description: string;
  badge: PlanBadge;
}[] = [
  {
    href: '/alati/kalkulator-poreza',
    icon: '🧮',
    title: 'Kalkulator paušalnog poreza 2026',
    description:
      'Tablica svih razreda, traka napretka, instant izračun. Ulogirani: podaci iz KPR-a.',
    badge: 'FREEMIUM',
  },
  {
    href: '/alati/pdv-prag',
    icon: '📊',
    title: 'PDV prag kalkulator',
    description:
      'Zeleno / žuto / crveno, projekcija do praga. Ulogirani: stvarni primitci iz KPR-a.',
    badge: 'FREEMIUM',
  },
  {
    href: '/alati/interni-akt',
    icon: '📋',
    title: 'Interni akt paušalnog obrta',
    description: 'Uredi predložak i preuzmi PDF. Ulogirani: automatsko popunjavanje profila.',
    badge: 'FREEMIUM',
  },
  {
    href: '/alati/checklista',
    icon: '✅',
    title: 'Checklista obveza',
    description:
      'Dnevne, mjesečne, kvartalne i godišnje obveze. Gost: samo pregled. Pretplata: email podsjetnici.',
    badge: 'FREEMIUM',
  },
  {
    href: '/alati/placanje-doprinosa',
    icon: '💶',
    title: 'Plaćanje doprinosa',
    description:
      'OIB, općina, razred → uplatni podaci i 2D barkod (demo). Gost: jednom. PRO: email 14. u mjesecu.',
    badge: 'FREEMIUM',
  },
  {
    href: '/alati/rok-podsjetnici',
    icon: '📅',
    title: 'Rok podsjetnici',
    description: 'Sažetak zakonskih rokova. Gost: pregled. PRO: push i email obavijesti.',
    badge: 'FREEMIUM',
  },
  {
    href: '/alati/izjava-poslovni-prostor',
    icon: '🏢',
    title: 'Izjava — tuđi poslovni prostor',
    description: 'PDF generator izjave o suglasnosti. Samo Paušalist PRO.',
    badge: 'PRO',
  },
  {
    href: '/alati/izjava-pozajmnica',
    icon: '🤝',
    title: 'Izjava — pozajmnica vlasnika',
    description: 'PDF generator izjave o pozajmici. Samo Paušalist PRO.',
    badge: 'PRO',
  },
];

function Badge({ kind }: { kind: PlanBadge }) {
  const cls =
    kind === 'FREE'
      ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-200'
      : kind === 'PRO'
        ? 'border-amber-400/50 bg-amber-500/15 text-amber-100'
        : 'border-sky-500/50 bg-sky-500/15 text-sky-100';
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cls}`}
    >
      {kind}
    </span>
  );
}

export default function AlatiIndexPage() {
  const base = getSiteUrl();

  const navLd = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: 'Alati Kvik',
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
          <p className='font-body text-sm font-medium text-[#0d9488]'>kvik.online /alati</p>
          <h1 className='font-heading mt-3 text-4xl font-bold tracking-tight text-[#e2e8e7] sm:text-5xl'>
            Alati za paušalne obrtnike
          </h1>
          <p className='font-body mt-5 text-lg leading-relaxed text-[#b9c7c4]'>{META_DESC}</p>
          <p className='mt-4 flex flex-wrap gap-2 text-xs text-[#64706e]'>
            <Badge kind='FREE' />
            <span>— cjelovita funkcija bez računa.</span>
            <Badge kind='FREEMIUM' />
            <span>— gost + ulogirani + PRO dodaci.</span>
            <Badge kind='PRO' />
            <span>— pretplatnički PDF-ovi i podsjetnici.</span>
          </p>
        </header>

        <ul className='mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {TOOLS.map((tool) => (
            <li key={tool.href}>
              <Link
                href={tool.href}
                className='group flex h-full flex-col rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 transition hover:border-[#0d9488]/50'
              >
                <div className='flex items-start justify-between gap-2'>
                  <span
                    className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0d9488]/15 text-2xl'
                    aria-hidden
                  >
                    {tool.icon}
                  </span>
                  <Badge kind={tool.badge} />
                </div>
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
          <div className='mt-5 flex flex-wrap justify-center gap-3'>
            <Link href='/register' className='btn-cta-primary px-6 py-3 text-base'>
              Registriraj se
            </Link>
            <a
              href='/#cijene'
              className='inline-flex rounded-lg border border-[#0d9488]/60 px-6 py-3 font-semibold text-[#d5dfdd] transition hover:border-[#0d9488] hover:bg-[#0d9488]/10'
            >
              Paušalist PRO
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

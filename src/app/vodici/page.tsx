import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

import {
  getSiteUrl,
  VODICI_CATEGORY_LABELS,
  VODICI_ENTRIES,
  type VodiciCategoryId,
} from '@/lib/vodici-config';

const DESC =
  'Besplatni vodiči za paušalne obrtnike u Hrvatskoj: osnove, djelatnosti, porezi i fiskalizacija. KPR, PO-SD, rokovi, PDV ID, doprinosi uz posao — sve na jednom mjestu.';

export const metadata: Metadata = {
  title: 'Vodiči za paušalne obrtnike',
  description: DESC,
  openGraph: {
    title: 'Vodiči za paušalne obrtnike | Kvit',
    description: DESC,
    url: `${getSiteUrl()}/vodici`,
    siteName: 'Kvit',
    locale: 'hr_HR',
    type: 'website',
  },
};

function byCategory(cat: VodiciCategoryId) {
  return VODICI_ENTRIES.filter((e) => e.category === cat);
}

export default function VodiciIndexPage() {
  const base = getSiteUrl();

  const navLd = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: 'Vodiči Kvit',
    url: `${base}/vodici`,
    hasPart: VODICI_ENTRIES.map((e) => ({
      '@type': 'WebPage',
      name: e.title,
      url: `${base}/vodici/${e.slug}`,
      description: e.description,
    })),
  };

  return (
    <>
      <Script
        id='vodici-navigation-jsonld'
        key='vodici-navigation-jsonld'
        type='application/ld+json'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(navLd).replace(/</g, '\\u003c'),
        }}
      />

      <div className='mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8'>
        <header className='max-w-3xl'>
          <p className='font-body text-sm font-medium text-[#0d9488]'>
            Besplatno · ažurirano za 2026.
          </p>
          <h1 className='font-heading mt-3 text-4xl font-bold tracking-tight text-[#e2e8e7] sm:text-5xl'>
            Vodiči za paušalne obrtnike
          </h1>
          <p className='font-body mt-5 text-lg leading-relaxed text-[#b9c7c4]'>
            {DESC} Koristi vodiče uz aplikaciju{' '}
            <Link href='/register' className='text-[#0d9488] hover:underline'>
              Kvit
            </Link>{' '}
            — računi, KPR i PO-SD na jednom mjestu.
          </p>
        </header>

        {(
          ['osnove', 'djelatnosti', 'porezi', 'fiskalizacija'] as const
        ).map((cat) => (
          <section key={cat} className='mt-14'>
            <h2 className='font-heading text-2xl font-bold text-[#e2e8e7]'>
              {VODICI_CATEGORY_LABELS[cat]}
            </h2>
            <p className='font-body mt-2 max-w-2xl text-sm text-[#94a3a0]'>
              {cat === 'osnove'
                ? 'Otvaranje, rokovi, KPR, zatvaranje, sezonski obrt i knjiga tražbina — temelj poslovanja prije nego što uđeš u detalje pojedinih djelatnosti.'
                : cat === 'djelatnosti'
                  ? 'IT freelanceri, konzultanti, kreativci, ugostitelji i ostale uobičajene kombinacije obrta — s naglaskom na rizike i limite.'
                  : cat === 'porezi'
                    ? 'PO-SD, paušalni porez po razredima, doprinosi i PDV ID kad posluješ s EU partnerima.'
                    : 'Fiskalizacija 2.0, izdavanje računa i digitalni alati koji štede vrijeme na godišnjim obvezama.'}
            </p>
            <ul className='mt-6 grid gap-5 sm:grid-cols-2'>
              {byCategory(cat).map((guide) => (
                <li key={guide.slug}>
                  <Link
                    href={`/vodici/${guide.slug}`}
                    className='group block h-full rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 transition hover:border-[#0d9488]/50'
                  >
                    <span
                      className='inline-block rounded-full bg-[#0d9488]/15 px-3 py-1 font-body text-xs font-medium text-[#0d9488]'
                      aria-hidden='true'
                    >
                      {guide.readingMinutes} min čitanja
                    </span>
                    <h3 className='font-heading mt-3 text-xl font-semibold text-[#e2e8e7] group-hover:text-[#0d9488]'>
                      {guide.shortTitle}
                    </h3>
                    <p className='font-body mt-2 text-sm leading-relaxed text-[#94a3a0]'>
                      {guide.description}
                    </p>
                    <span className='mt-4 inline-flex items-center text-sm font-medium text-[#0d9488]'>
                      Čitaj vodič
                      <span className='ml-1' aria-hidden='true'>
                        →
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className='mt-14 rounded-2xl border border-[#0d9488]/30 bg-[#111716] p-8 text-center'>
          <p className='font-heading text-xl font-semibold text-[#e2e8e7]'>
            Isprobaj Kvit besplatno
          </p>
          <p className='font-body mx-auto mt-2 max-w-lg text-sm text-[#94a3a0]'>
            Automatski KPR, PDF računi i PO-SD — manje papira, više vremena za
            posao.
          </p>
          <Link href='/register' className='btn-cta-primary mt-5 px-6 py-3 text-base'>
            Registriraj se
          </Link>
        </div>
      </div>
    </>
  );
}

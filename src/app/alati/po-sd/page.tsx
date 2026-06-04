import type { Metadata } from 'next';

import { buildAlatMetadata } from '@/lib/og-metadata';

import PageTopBar from '@/components/cta/PageTopBar';
import BottomCTA from '@/components/cta/BottomCTA';

import { AlatiBreadcrumb } from '../_components/alati-breadcrumb';
import { PoweredByKvikBadge } from '../_components/powered-by-kvik-badge';

import { PoSdTool } from './po-sd-tool';

const PO_SD_TITLE = 'PO-SD Generator 2026 — Besplatni kalkulator za paušalce | Kvik';
const PO_SD_DESC =
  'Besplatni online PO-SD generator za hrvatske paušalne obrtnike. Izračunaj razred poreza i pripremi PO-SD obrazac za 2026. Bez registracije.';

export const metadata: Metadata = buildAlatMetadata('po-sd', PO_SD_TITLE, PO_SD_DESC, {
  keywords: [
    'PO-SD',
    'paušalni obrt',
    'kalkulator poreza 2026',
    'PO-SD obrazac',
    'paušalac porez',
    'PO-SD generator',
  ],
});

export default function PoSdPublicPage() {
  return (
    <article className='mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8'>
      <AlatiBreadcrumb
        items={[
          { label: 'Kvik', href: '/' },
          { label: 'Alati', href: '/alati' },
          { label: 'PO-SD' },
        ]}
      />
      <header className='mb-8 border-b border-[#1f2a28] pb-8'>
        <p className='font-body text-sm font-medium text-[#0d9488]'>Alat · FREEMIUM</p>
        <h1 className='font-heading mt-3 text-3xl font-bold text-[#e2e8e7] sm:text-4xl'>
          PO-SD Generator 2026
        </h1>
      </header>
      <PageTopBar
        pageType='alat'
        pageSlug='po-sd'
        pageUrl='https://kvik.online/alati/po-sd'
        ctaHrefOverride='/alati/po-sd'
      />
      <PoSdTool />
      <BottomCTA pageType='alat' pageSlug='po-sd' />
      <PoweredByKvikBadge />
    </article>
  );
}

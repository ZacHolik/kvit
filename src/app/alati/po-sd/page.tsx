import type { Metadata } from 'next';

import { AlatiBreadcrumb } from '../_components/alati-breadcrumb';
import { CtaRegister } from '../_components/cta-register';
import { PoweredByKvikBadge } from '../_components/powered-by-kvik-badge';

import { PoSdTool } from './po-sd-tool';

export const metadata: Metadata = {
  title: 'PO-SD Generator 2026 — Besplatni kalkulator za paušalce | Kvik',
  description:
    'Besplatni online PO-SD generator za hrvatske paušalne obrtnike. Izračunaj razred poreza i pripremi PO-SD obrazac za 2026. Bez registracije.',
  keywords: [
    'PO-SD',
    'paušalni obrt',
    'kalkulator poreza 2026',
    'PO-SD obrazac',
    'paušalac porez',
    'PO-SD generator',
  ],
  alternates: { canonical: 'https://kvik.online/alati/po-sd' },
  openGraph: {
    title: 'PO-SD Generator 2026 — Besplatni kalkulator za paušalce',
    description:
      'Izračunaj razred poreza i pripremi PO-SD obrazac za 2026. Bez registracije.',
    url: 'https://kvik.online/alati/po-sd',
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'website',
  },
};

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
      <PoSdTool />
      <CtaRegister
        title='Kvik automatski popunjava PO-SD iz tvojih računa.'
        body='Bez ručnog unosa — svi primitci iz KPR-a idu ravno u obrazac.'
        buttonLabel='Registriraj se besplatno →'
        utmSrc='po-sd'
      />
      <PoweredByKvikBadge />
    </article>
  );
}

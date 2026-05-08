import type { Metadata } from 'next';

import { AlatiBreadcrumb } from '../_components/alati-breadcrumb';

import { PoSdTool } from './po-sd-tool';

export const metadata: Metadata = {
  title: 'PO-SD generator (besplatno)',
  description: 'Besplatan PO-SD generator za paušalne obrtnike.',
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
          PO-SD generator
        </h1>
      </header>
      <PoSdTool />
    </article>
  );
}

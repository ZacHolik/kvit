import type { Metadata } from 'next';

import { VodiciNav } from '../vodici/_components/vodici-nav';

export const metadata: Metadata = {
  title: {
    default: 'Alati | Kvit',
    template: '%s | Kvit',
  },
  description:
    'Besplatni online alati za paušalne obrtnike: kalkulator poreza, PDV prag, checklista obveza.',
};

export default function AlatiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-[#0b0f0e]'>
      <VodiciNav />
      <main>{children}</main>
      <footer className='border-t border-[#1f2a28] px-4 py-8 text-center text-sm text-[#64756f] sm:px-6'>
        <p className='font-body'>
          © {new Date().getFullYear()} Kvit ·{' '}
          <a href='/' className='text-[#0d9488] hover:underline'>
            Početna
          </a>
          {' · '}
          <a href='/alati' className='text-[#0d9488] hover:underline'>
            Alati
          </a>
          {' · '}
          <a href='/vodici' className='text-[#0d9488] hover:underline'>
            Vodiči
          </a>
        </p>
      </footer>
    </div>
  );
}

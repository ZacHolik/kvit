import type { Metadata } from 'next';

import { VodiciNav } from './_components/vodici-nav';

export const metadata: Metadata = {
  title: {
    default: 'Vodiči | Kvik',
    template: '%s | Kvik',
  },
  description:
    'Besplatni vodiči za paušalne obrtnike u Hrvatskoj. KPR, PO-SD, fiskalizacija 2.0, doprinosi – sve na jednom mjestu.',
};

export default function VodiciLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-[#0b0f0e]'>
      <VodiciNav />
      <main>{children}</main>
      <footer className='border-t border-[#1f2a28] px-4 py-8 text-center text-sm text-[#64756f] sm:px-6'>
        <p className='font-body'>
          © {new Date().getFullYear()} Kvik ·{' '}
          <a href='/' className='text-[#0d9488] hover:underline'>
            Početna
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

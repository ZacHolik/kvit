'use client';

import Link from 'next/link';

import { sendCapiEvent } from '@/lib/meta-capi';

export function VodiciNav() {
  const handleRegisterClick = () => {
    const eventId = crypto.randomUUID();
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq(
        'track',
        'InitiateCheckout',
        { content_category: '/register', page_slug: 'nav' },
        { eventID: eventId },
      );
    }
    void sendCapiEvent({ event_name: 'InitiateCheckout', event_id: eventId });
  };

  return (
    <header className='sticky top-0 z-50 border-b border-[#1f2a28] bg-[#0b0f0e]/95 backdrop-blur-sm'>
      <nav className='mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8'>
        <Link
          href='/'
          className='font-heading text-xl font-bold tracking-tight text-[#e2e8e7]'
        >
          Kvik<span className='text-[#0d9488]'>.</span>
        </Link>
        <ul className='flex flex-wrap items-center gap-4 text-sm text-[#b9c7c4]'>
          <li>
            <Link href='/vodici' className='transition hover:text-[#0d9488]'>
              Vodiči
            </Link>
          </li>
          <li>
            <Link href='/alati' className='transition hover:text-[#0d9488]'>
              Alati
            </Link>
          </li>
          <li>
            <Link href='/cijene' className='transition hover:text-[#0d9488]'>
              Cijene
            </Link>
          </li>
        </ul>
        <div className='flex flex-wrap items-center gap-3 sm:gap-4'>
          <Link
            href='/login'
            className='rounded-lg border border-[#0d9488]/60 px-4 py-2.5 text-sm font-medium text-[#d5dfdd] transition hover:border-[#0d9488] hover:bg-[#0d9488]/10'
          >
            Prijavi se
          </Link>
          <Link
            href='/register'
            className='btn-cta-primary px-3 py-2 text-sm'
            onClick={handleRegisterClick}
          >
            Pretplati se
          </Link>
        </div>
      </nav>
    </header>
  );
}

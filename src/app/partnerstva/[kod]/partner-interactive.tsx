'use client';

import { useCallback, useState } from 'react';

import { PARTNER_OFFER } from '@/config/pricing';

type PartnerInteractiveProps = {
  pageCode: string;
};

function trackGa(event: string, pageCode: string) {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.('event', event, { page_code: pageCode });
}

export function PartnerJaviSeButton() {
  return (
    <a
      href='#javi-se'
      className='mt-6 inline-flex rounded-xl bg-[#0d9488] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#14b8a6]'
    >
      Javi se →
    </a>
  );
}

export function PartnerCopyTemplateButton({
  pageCode,
  template,
}: PartnerInteractiveProps & { template: string }) {
  const [label, setLabel] = useState('Kopiraj predložak');

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(template);
      trackGa('partner_template_copy', pageCode);
      setLabel('Kopirano');
      window.setTimeout(() => setLabel('Kopiraj predložak'), 2000);
    } catch {
      /* clipboard blocked */
    }
  }, [pageCode, template]);

  return (
    <button
      type='button'
      onClick={() => void onCopy()}
      className='mt-4 rounded-lg border border-[#1f2a28] bg-[#111716] px-4 py-2 text-sm font-medium text-[#e2e8e7] transition hover:border-[#0d9488] hover:text-white'
    >
      {label}
    </button>
  );
}

export function PartnerContactMailButton({ pageCode }: PartnerInteractiveProps) {
  const subject = `Partnerstvo ${PARTNER_OFFER.version}`;
  const body = [
    'Naziv obrta, tvrtke, udruge ili agencije:',
    'Kanal (Instagram, TikTok, Facebook, newsletter...):',
    'Link na profil ili newsletter:',
    'Broj pratitelja ili pretplatnika:',
    'Željeni kôd (npr. IME5):',
    'Okvirni datum prve objave:',
    '',
    '(U prilogu: snimka zaslona statistike publike, zemlja i dob)',
  ].join('\r\n');
  const href = `mailto:podrska@kvik.hr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <a
      href={href}
      onClick={() => trackGa('partner_contact', pageCode)}
      className='inline-flex rounded-xl bg-[#0d9488] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#14b8a6]'
    >
      Pošalji upit za suradnju
    </a>
  );
}

export function PartnerCopyEmailButton() {
  const [label, setLabel] = useState('Kopiraj adresu');
  const email = 'podrska@kvik.hr';

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      setLabel('Kopirano');
      window.setTimeout(() => setLabel('Kopiraj adresu'), 2000);
    } catch {
      /* clipboard blocked */
    }
  }, []);

  return (
    <button
      type='button'
      onClick={() => void onCopy()}
      className='ml-2 rounded-md border border-[#1f2a28] px-2 py-1 text-xs text-[#94a3a0] transition hover:border-[#0d9488] hover:text-[#e2e8e7]'
    >
      {label}
    </button>
  );
}

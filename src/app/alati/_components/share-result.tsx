'use client';

import { useState } from 'react';

type Props = {
  pageTitle: string;
  pageUrl: string;
};

export function ShareResult({ pageTitle, pageUrl }: Props) {
  const [copied, setCopied] = useState(false);

  const whatsappText = `Pogledaj ovaj besplatni alat za paušaliste — ${pageTitle}: ${pageUrl}`;
  const emailSubject = `${pageTitle} — besplatan alat za paušaliste`;
  const emailBody = `Bok, pogledaj ovo: ${pageUrl} — besplatan alat za paušalne obrtnike.`;

  return (
    <div className='mt-4 rounded-xl border border-[#253330] bg-[#0b0f0e] p-4'>
      <p className='font-body text-xs uppercase tracking-wide text-[#94a3a0]'>
        Podijeli rezultat
      </p>
      <div className='mt-3 flex flex-wrap gap-2'>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(whatsappText)}`}
          target='_blank'
          rel='noopener noreferrer'
          className='rounded-lg border border-[#2a3734] bg-[#111716] px-3 py-2 text-xs font-medium text-[#d5dfdd] transition hover:border-[#0d9488]'
        >
          📱 WhatsApp
        </a>
        <a
          href={`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
          className='rounded-lg border border-[#2a3734] bg-[#111716] px-3 py-2 text-xs font-medium text-[#d5dfdd] transition hover:border-[#0d9488]'
        >
          📧 Email
        </a>
        <button
          type='button'
          onClick={() => {
            void navigator.clipboard.writeText(pageUrl).then(() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          className='rounded-lg border border-[#2a3734] bg-[#111716] px-3 py-2 text-xs font-medium text-[#d5dfdd] transition hover:border-[#0d9488]'
        >
          {copied ? 'Kopirano ✓' : '🔗 Kopiraj link'}
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

const CONSENT_TEXT =
  'Suglasan/a sam da Kvik (operativan na kvik.online i kvik.hr) obrađuje ' +
  'moju email adresu kako bi mi poslao traženi rezultat i povremene ' +
  'obavijesti vezane za paušalni obrt. Odjava je moguća u svakom trenutku ' +
  'jednim klikom u podnožju maila.';

type Props = {
  sourceTool: string;
  personaHint?: string;
  resultPayload?: Record<string, unknown>;
};

export default function LeadCapture({
  sourceTool,
  personaHint,
  resultPayload,
}: Props) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const searchParams = useSearchParams();

  const handleSubmit = useCallback(async () => {
    if (!email || !consent) return;
    setStatus('loading');

    const ctaVariant =
      typeof window !== 'undefined'
        ? (localStorage.getItem('kvik_cta_variant') ?? null)
        : null;
    const landingPage =
      typeof window !== 'undefined'
        ? (sessionStorage.getItem('kvik_landing_page') ??
          window.location.pathname)
        : null;

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        source_tool: sourceTool,
        persona_hint: personaHint ?? null,
        result_payload: resultPayload ?? null,
        consent: true,
        consent_text: CONSENT_TEXT,
        utm_source: searchParams.get('utm_source') ?? undefined,
        utm_medium: searchParams.get('utm_medium') ?? undefined,
        utm_campaign: searchParams.get('utm_campaign') ?? undefined,
        utm_content: searchParams.get('utm_content') ?? undefined,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
        landing_page: landingPage ?? undefined,
        cta_variant: ctaVariant ?? undefined,
        website: honeypot,
      }),
    });

    if (res.ok) {
      setStatus('success');
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'lead_captured', {
          source_tool: sourceTool,
          persona_hint: personaHint ?? null,
          cta_variant: ctaVariant ?? null,
          has_payload: !!resultPayload,
        });
      }
    } else {
      setStatus('error');
    }
  }, [
    email,
    consent,
    honeypot,
    sourceTool,
    personaHint,
    resultPayload,
    searchParams,
  ]);

  if (status === 'success') {
    return (
      <div className='mt-6 rounded-2xl border border-[#0d9488]/40 bg-[#0d9488]/10 p-5 text-center'>
        <p className='font-semibold text-[#0d9488]'>
          Poslano! Provjeri inbox (i spam folder).
        </p>
      </div>
    );
  }

  return (
    <div className='mt-6 rounded-2xl border border-[#1f2a28] bg-[#111716] p-5'>
      <h3 className='mb-1 font-heading text-base font-semibold text-[#e2e8e7]'>
        📩 Pošalji mi PO-SD na email
      </h3>
      <p className='mb-4 text-sm text-[#94a3a0]'>
        Dobit ćeš rezultat kao PDF u inbox — korisno za arhivu i podsjetnik na
        rokove.
      </p>

      <input
        type='text'
        name='website'
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete='off'
      />

      <input
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='tvoj@email.com'
        className='mb-3 w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e]
          px-4 py-3 text-sm text-[#e2e8e7] placeholder-[#64756f]
          focus:border-[#0d9488] focus:outline-none'
      />

      <label className='mb-4 flex items-start gap-3 text-xs text-[#94a3a0]'>
        <input
          type='checkbox'
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className='mt-0.5 shrink-0 accent-[#0d9488]'
        />
        <span>
          {CONSENT_TEXT}{' '}
          <a
            href='/privacy'
            className='text-[#0d9488] underline'
            target='_blank'
          >
            Privacy Policy
          </a>
          .
        </span>
      </label>

      {status === 'error' && (
        <p className='mb-3 text-xs text-red-400'>
          Pokušaj ponovo za par trenutaka.
        </p>
      )}

      <button
        type='button'
        onClick={() => void handleSubmit()}
        disabled={!email || !consent || status === 'loading'}
        className='w-full rounded-xl bg-[#0d9488] py-3 text-sm font-semibold
          text-white transition hover:bg-[#14b8a6]
          disabled:cursor-not-allowed disabled:opacity-50'
      >
        {status === 'loading' ? 'Šaljem...' : 'Pošalji mi na email'}
      </button>
    </div>
  );
}

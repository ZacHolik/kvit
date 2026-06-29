'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

const COOKIE_NAME = 'kvik_reader';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 godina

function getCookie(name: string): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some((c) => c.trim().startsWith(`${name}=true`));
}

function setCookie(name: string): void {
  document.cookie = `${name}=true; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure`;
}

const CONSENT_TEXT =
  'Pristanak na otključavanje vodiča i povremene obavijesti o paušalnom obrtu. Odjava je moguća u svakom trenutku.';

type ArticleGateProps = {
  children: React.ReactNode;
  slug: string;
  /** Prikazuje se samo nakon otključavanja (npr. sredinski CTA). */
  unlockedExtra?: React.ReactNode;
  previewChars?: number;
};

export default function ArticleGate({
  children,
  slug,
  unlockedExtra,
}: ArticleGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const gateRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
    if (getCookie(COOKIE_NAME)) {
      setUnlocked(true);
    }
  }, []);

  // Autofocus email polje kad gate dođe u viewport
  useEffect(() => {
    if (!mounted || unlocked) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const input = gateRef.current?.querySelector(
            'input[type="email"]',
          ) as HTMLInputElement | null;
          input?.focus({ preventScroll: true });
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    if (gateRef.current) observer.observe(gateRef.current);
    return () => observer.disconnect();
  }, [mounted, unlocked]);

  const handleUnlock = async () => {
    if (!email || status === 'loading') return;
    setStatus('loading');
    setErrorMsg('');

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        source_tool: 'article_gate',
        persona_hint: 'citac-vodica',
        consent: true,
        consent_text: CONSENT_TEXT,
        landing_page: `/vodici/${slug}`,
        utm_source: searchParams.get('utm_source') ?? undefined,
        utm_medium: searchParams.get('utm_medium') ?? undefined,
        utm_campaign: searchParams.get('utm_campaign') ?? undefined,
        utm_content: searchParams.get('utm_content') ?? undefined,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
        website: honeypot,
      }),
    });

    if (res.ok) {
      setCookie(COOKIE_NAME);
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'article_unlocked', {
          source_page: `/vodici/${slug}`,
          method: 'email_gate',
        });
      }
      setUnlocked(true);
    } else {
      setStatus('error');
      setErrorMsg('Nešto nije u redu. Pokušaj ponovo.');
    }
  };

  // SSR / prije mounta — prikaži puni sadržaj (SSR indeksiranje za Google)
  if (!mounted) return <>{children}</>;

  // Otključano — prikaži sve
  if (unlocked) {
    return (
      <>
        {children}
        {unlockedExtra}
      </>
    );
  }

  // Locked — prikaži preview + gate
  return (
    <>
      <div className="article-gate-preview">{children}</div>

      <div
        ref={gateRef}
        className="relative mt-0 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8"
      >
        <p className="mb-1 font-heading text-lg font-semibold text-[#e2e8e7]">
          📖 Pročitaj cijeli vodič
        </p>
        <p className="mb-5 text-sm text-[#94a3a0] leading-relaxed">
          Upiši email za pristup ostatku članka i svim vodičima za paušalni obrt
          na ovoj stranici.
        </p>

        <input
          type="text"
          name="kvit_hp_confirm"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && void handleUnlock()}
          placeholder="tvoj@email.com"
          className="mb-3 w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e]
            px-4 py-3 text-sm text-[#e2e8e7] placeholder-[#64756f]
            focus:border-[#0d9488] focus:outline-none"
        />

        {errorMsg && <p className="mb-3 text-xs text-red-400">{errorMsg}</p>}

        <button
          type="button"
          onClick={() => void handleUnlock()}
          disabled={!email || status === 'loading'}
          className="w-full min-h-[48px] rounded-xl bg-[#0d9488] py-3 text-sm
            font-semibold text-white transition hover:bg-[#14b8a6]
            disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'loading' ? 'Otključavam...' : 'Pristupi vodičima →'}
        </button>

        <p className="mt-3 text-center text-xs text-[#64756f]">
          Bez spama. Odjavi se kad poželiš.
        </p>
      </div>
    </>
  );
}

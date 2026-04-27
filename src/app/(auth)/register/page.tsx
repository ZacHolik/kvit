'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useRef, useState } from 'react';

const turnstileSiteKey =
  typeof process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY === 'string'
    ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY.trim()
    : '';

function buildEmailRedirectTo(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  const origin =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
    window.location.origin;
  const next = encodeURIComponent('/confirm-email?verified=1');
  return `${origin}/auth/callback?next=${next}`;
}

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedLegalTerms, setAcceptedLegalTerms] = useState(false);
  /** Honeypot — ostaje prazno; botovi ga često popune. */
  const [kvitHpConfirm, setKvitHpConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!turnstileSiteKey || !turnstileContainerRef.current) {
      return;
    }
    const container = turnstileContainerRef.current;
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (!window.turnstile || !container) {
        return;
      }
      turnstileWidgetIdRef.current = window.turnstile.render(container, {
        sitekey: turnstileSiteKey,
        callback: (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () => setTurnstileToken(''),
      });
    };
    document.body.appendChild(script);
    return () => {
      if (window.turnstile && turnstileWidgetIdRef.current) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }
      script.remove();
    };
  }, []);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Lozinke se ne podudaraju.');
      return;
    }

    if (!acceptedLegalTerms) {
      setError(
        'Za registraciju je potrebno prihvatiti uvjete i politiku privatnosti.',
      );
      return;
    }

    if (turnstileSiteKey && !turnstileToken.trim()) {
      setError('Potvrdi da nisi robot (Turnstile).');
      return;
    }

    setIsLoading(true);
    let response: Response;
    try {
      response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          emailRedirectTo: buildEmailRedirectTo(),
          kvit_hp_confirm: kvitHpConfirm,
          turnstileToken: turnstileSiteKey ? turnstileToken : undefined,
        }),
      });
    } catch {
      setIsLoading(false);
      setError('Mrežna greška. Pokušaj ponovno.');
      return;
    }

    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
      ok?: boolean;
    };

    setIsLoading(false);

    if (!response.ok) {
      setError(
        payload.error ||
          (response.status === 429
            ? 'Previše pokušaja. Pokušaj kasnije.'
            : 'Registracija nije uspjela.'),
      );
      if (window.turnstile && turnstileWidgetIdRef.current) {
        window.turnstile.reset(turnstileWidgetIdRef.current);
      }
      setTurnstileToken('');
      return;
    }

    if (window.turnstile && turnstileWidgetIdRef.current) {
      window.turnstile.reset(turnstileWidgetIdRef.current);
    }
    setTurnstileToken('');
    setRegisteredEmail(email.trim());
  };

  if (registeredEmail) {
    return (
      <main className='flex min-h-screen items-center justify-center bg-[#0b0f0e] px-4 py-10'>
        <section className='w-full max-w-md rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 shadow-xl shadow-black/25 sm:p-8'>
          <p className='font-body text-sm text-[#94a3a0]'>Još jedan korak</p>
          <h1 className='font-heading mt-2 text-2xl text-[#e2e8e7] sm:text-3xl'>
            Provjeri email!
          </h1>
          <p className='font-body mt-6 text-base leading-relaxed text-[#d5dfdd]'>
            Poslali smo ti link za potvrdu na{' '}
            <span className='font-semibold break-all text-[#0d9488]'>
              {registeredEmail}
            </span>
            .
          </p>
          <p className='font-body mt-4 text-sm text-[#94a3a0]'>
            Ne vidiš poruku? Provjeri spam ili Promocije.
          </p>
          <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
            <Link
              href='/login'
              className='font-body inline-flex justify-center rounded-xl bg-[#0d9488] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#14b8a6]'
            >
              Na prijavu
            </Link>
            <button
              type='button'
              className='font-body inline-flex justify-center rounded-xl border border-[#2a3734] px-5 py-3 text-center text-[#d5dfdd] transition hover:border-[#0d9488]'
              onClick={() => {
                setRegisteredEmail(null);
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setAcceptedLegalTerms(false);
                setKvitHpConfirm('');
              }}
            >
              Drugi email
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className='flex min-h-screen items-center justify-center bg-[#0b0f0e] px-4 py-10'>
      <section className='w-full max-w-md rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 shadow-xl shadow-black/25 sm:p-8'>
        <p className='font-body text-sm text-[#94a3a0]'>Kreiraj Kvit račun</p>
        <h1 className='font-heading mt-2 text-3xl text-[#e2e8e7]'>
          Registracija
        </h1>

        <form className='mt-8 space-y-4' onSubmit={handleRegister}>
          {/*
            Honeypot: skriveno polje koje ljudi ne vide; botovi ga često popune.
            Ne uklanjati — zaštita od jednostavnih skripti.
          */}
          <div
            className='absolute -left-[9999px] h-px w-px overflow-hidden opacity-0'
            aria-hidden='true'
          >
            <label className='font-body text-xs text-[#64748b]'>
              Tvrtka (ne ispunjavati)
              <input
                type='text'
                tabIndex={-1}
                autoComplete='off'
                value={kvitHpConfirm}
                onChange={(event) => setKvitHpConfirm(event.target.value)}
                className='mt-1 block'
              />
            </label>
          </div>

          <label className='block'>
            <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
              Email
            </span>
            <input
              required
              type='email'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-[#e2e8e7] outline-none transition focus:border-[#0d9488]'
              placeholder='ime@obrt.hr'
            />
          </label>

          <label className='block'>
            <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
              Lozinka
            </span>
            <input
              required
              minLength={8}
              type='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-[#e2e8e7] outline-none transition focus:border-[#0d9488]'
              placeholder='Min. 8 znakova'
            />
          </label>

          <label className='block'>
            <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
              Ponovi lozinku
            </span>
            <input
              required
              minLength={8}
              type='password'
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-[#e2e8e7] outline-none transition focus:border-[#0d9488]'
              placeholder='Ponovi lozinku'
            />
          </label>

          {/*
            Cloudflare Turnstile (opcionalno): postavi NEXT_PUBLIC_TURNSTILE_SITE_KEY
            i TURNSTILE_SECRET_KEY u .env — inače se widget ne prikazuje.
          */}
          {turnstileSiteKey ? (
            <div className='flex justify-center pt-1'>
              <div ref={turnstileContainerRef} />
            </div>
          ) : null}

          <label className='font-body flex gap-3 rounded-xl border border-[#2a3734] bg-[#0b0f0e] p-4 text-sm leading-relaxed text-[#d5dfdd]'>
            <input
              required
              type='checkbox'
              checked={acceptedLegalTerms}
              onChange={(event) => setAcceptedLegalTerms(event.target.checked)}
              className='mt-1 h-4 w-4 rounded border-[#2a3734] accent-[#0d9488]'
            />
            <span>
              Prihvaćam{' '}
              <Link
                href='/uvjeti'
                className='font-semibold text-[#5eead4] hover:underline'
                target='_blank'
                rel='noopener noreferrer'
              >
                Uvjete korištenja
              </Link>{' '}
              i{' '}
              <Link
                href='/privacy'
                className='font-semibold text-[#5eead4] hover:underline'
                target='_blank'
                rel='noopener noreferrer'
              >
                Politiku privatnosti
              </Link>
              .
            </span>
          </label>

          {error ? (
            <p className='font-body rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200'>
              {error}
            </p>
          ) : null}

          <button
            type='submit'
            disabled={isLoading}
            className='font-body mt-2 w-full rounded-xl bg-[#0d9488] px-4 py-3 font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-70'
          >
            {isLoading ? 'Kreiram račun...' : 'Registriraj se'}
          </button>
        </form>

        <p className='font-body mt-6 text-sm text-[#94a3a0]'>
          Već imaš račun?{' '}
          <Link href='/login' className='font-semibold text-[#0d9488]'>
            Prijavi se
          </Link>
        </p>
      </section>
    </main>
  );
}

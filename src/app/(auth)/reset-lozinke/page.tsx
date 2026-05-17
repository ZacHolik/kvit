'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

import { createClient } from '@/lib/supabase/client';

function buildPasswordResetRedirectTo(): string {
  const origin =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
    (typeof window !== 'undefined' ? window.location.origin : '');
  const next = encodeURIComponent('/nova-lozinke');
  return `${origin}/auth/callback?next=${next}`;
}

export default function ResetLozinkePage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: buildPasswordResetRedirectTo() },
      );

      if (resetError) {
        console.error('resetPasswordForEmail', resetError);
      }
    } catch {
      setIsLoading(false);
      setError('Nešto je pošlo po zlu, pokušaj ponovno.');
      return;
    }

    setIsLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className='flex min-h-screen items-center justify-center bg-[#0b0f0e] px-4 py-10'>
        <section className='w-full max-w-md rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 shadow-xl shadow-black/25 sm:p-8'>
          <p className='font-body text-sm text-[#94a3a0]'>Reset lozinke</p>
          <h1 className='font-heading mt-2 text-2xl text-[#e2e8e7] sm:text-3xl'>
            Provjeri email
          </h1>
          <p className='font-body mt-6 text-base leading-relaxed text-[#d5dfdd]'>
            Ako postoji račun s tom adresom, poslali smo link za reset. Provjeri
            email (i spam/Promocije).
          </p>
          <Link
            href='/login'
            className='font-body mt-8 inline-flex w-full justify-center rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6]'
          >
            Natrag na prijavu
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className='flex min-h-screen items-center justify-center bg-[#0b0f0e] px-4 py-10'>
      <section className='w-full max-w-md rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 shadow-xl shadow-black/25 sm:p-8'>
        <p className='font-body text-sm text-[#94a3a0]'>Zaboravljena lozinka</p>
        <h1 className='font-heading mt-2 text-3xl text-[#e2e8e7]'>Resetiraj lozinku</h1>
        <p className='font-body mt-4 text-sm leading-relaxed text-[#94a3a0]'>
          Upiši email s kojim si registriran. Poslat ćemo ti link za novu lozinku.
        </p>

        <form className='mt-8 space-y-4' onSubmit={handleSubmit}>
          <label className='block'>
            <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>Email</span>
            <input
              required
              type='email'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-[#e2e8e7] outline-none transition focus:border-[#0d9488]'
              placeholder='ime@obrt.hr'
            />
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
            {isLoading ? 'Šaljem...' : 'Pošalji link'}
          </button>
        </form>

        <p className='font-body mt-6 text-center text-sm'>
          <Link
            href='/login'
            className='text-[#94a3a0] underline underline-offset-4 hover:text-[#e2e8e7]'
          >
            ← Natrag na prijavu
          </Link>
        </p>
      </section>
    </main>
  );
}

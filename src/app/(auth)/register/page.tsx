'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

import { createClient } from '@/lib/supabase/client';

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
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Lozinke se ne podudaraju.');
      return;
    }

    setIsLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: buildEmailRedirectTo(),
      },
    });
    setIsLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

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

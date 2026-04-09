'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <main className='flex min-h-screen items-center justify-center bg-[#0b0f0e] px-4 py-10'>
      <section className='w-full max-w-md rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 shadow-xl shadow-black/25 sm:p-8'>
        <p className='font-body text-sm text-[#94a3a0]'>Dobrodošao natrag</p>
        <h1 className='font-heading mt-2 text-3xl text-[#e2e8e7]'>Prijava</h1>

        <form className='mt-8 space-y-4' onSubmit={handleLogin}>
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
              type='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-[#e2e8e7] outline-none transition focus:border-[#0d9488]'
              placeholder='••••••••'
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
            {isLoading ? 'Prijavljujem...' : 'Prijavi se'}
          </button>
        </form>

        <p className='font-body mt-6 text-sm text-[#94a3a0]'>
          Nemaš račun?{' '}
          <Link href='/register' className='font-semibold text-[#0d9488]'>
            Registriraj se
          </Link>
        </p>
      </section>
    </main>
  );
}

'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';

import { createClient } from '@/lib/supabase/client';

type RecoveryState = 'loading' | 'ready' | 'expired';

export default function NovaLozinkePage() {
  const supabase = createClient();
  const [recoveryState, setRecoveryState] = useState<RecoveryState>('loading');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const refreshSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) {
        return;
      }
      setRecoveryState(session ? 'ready' : 'expired');
    };

    void refreshSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) {
        return;
      }
      if (event === 'PASSWORD_RECOVERY' || session) {
        setRecoveryState(session ? 'ready' : 'expired');
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- createClient() je stabilan za auth listener
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Lozinka mora imati najmanje 8 znakova.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Lozinke se ne podudaraju.');
      return;
    }

    setIsLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    setIsLoading(false);

    if (updateError) {
      setError(
        'Link za reset je istekao ili nije valjan. Zatraži novi.',
      );
      return;
    }

    await supabase.auth.signOut();
    setSaved(true);
  };

  if (saved) {
    return (
      <main className='flex min-h-screen items-center justify-center bg-[#0b0f0e] px-4 py-10'>
        <section className='w-full max-w-md rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 shadow-xl shadow-black/25 sm:p-8'>
          <p className='font-body text-sm text-[#94a3a0]'>Reset lozinke</p>
          <h1 className='font-heading mt-2 text-2xl text-[#e2e8e7] sm:text-3xl'>
            Lozinka je promijenjena.
          </h1>
          <Link
            href='/login'
            className='font-body mt-8 inline-flex w-full justify-center rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6]'
          >
            Prijavi se
          </Link>
        </section>
      </main>
    );
  }

  if (recoveryState === 'loading') {
    return (
      <main className='flex min-h-screen items-center justify-center bg-[#0b0f0e] px-4 py-10'>
        <section className='w-full max-w-md rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 shadow-xl shadow-black/25 sm:p-8'>
          <p className='font-body text-sm text-[#94a3a0]'>Učitavam…</p>
        </section>
      </main>
    );
  }

  if (recoveryState === 'expired') {
    return (
      <main className='flex min-h-screen items-center justify-center bg-[#0b0f0e] px-4 py-10'>
        <section className='w-full max-w-md rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 shadow-xl shadow-black/25 sm:p-8'>
          <p className='font-body text-sm text-[#94a3a0]'>Reset lozinke</p>
          <h1 className='font-heading mt-2 text-2xl text-[#e2e8e7] sm:text-3xl'>
            Link nije valjan
          </h1>
          <p className='font-body mt-6 text-base leading-relaxed text-[#d5dfdd]'>
            Link za reset je istekao ili nije valjan. Zatraži novi.
          </p>
          <Link
            href='/reset-lozinke'
            className='font-body mt-8 inline-flex w-full justify-center rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6]'
          >
            Zatraži novi link
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className='flex min-h-screen items-center justify-center bg-[#0b0f0e] px-4 py-10'>
      <section className='w-full max-w-md rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 shadow-xl shadow-black/25 sm:p-8'>
        <p className='font-body text-sm text-[#94a3a0]'>Nova lozinka</p>
        <h1 className='font-heading mt-2 text-3xl text-[#e2e8e7]'>Postavi novu lozinku</h1>

        <form className='mt-8 space-y-4' onSubmit={handleSubmit}>
          <label className='block'>
            <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
              Nova lozinka
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
              {error.includes('istekao') ? (
                <>
                  {' '}
                  <Link href='/reset-lozinke' className='font-semibold underline'>
                    Zatraži novi
                  </Link>
                </>
              ) : null}
            </p>
          ) : null}

          <button
            type='submit'
            disabled={isLoading}
            className='font-body mt-2 w-full rounded-xl bg-[#0d9488] px-4 py-3 font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-70'
          >
            {isLoading ? 'Spremam...' : 'Spremi lozinku'}
          </button>
        </form>
      </section>
    </main>
  );
}

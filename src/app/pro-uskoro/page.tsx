'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

export default function ProUskoroPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/waitlist/pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? 'Nešto je pošlo po zlu, pokušaj ponovno.');
        setIsLoading(false);
        return;
      }

      setSent(true);
    } catch {
      setError('Nešto je pošlo po zlu, pokušaj ponovno.');
    }

    setIsLoading(false);
  };

  return (
    <main className='flex min-h-screen items-center justify-center bg-[#0b0f0e] px-4 py-16 text-[#e2e8e7]'>
      <div className='w-full max-w-md'>
        <p className='text-center text-sm text-[#94a3a0]'>
          <Link href='/' className='font-bold text-[#e2e8e7] hover:text-[#14b8a6]'>
            Kvik<span className='text-[#0d9488]'>.</span>
          </Link>
        </p>

        <section className='mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 shadow-xl shadow-black/25 sm:p-8'>
          <h1 className='text-center text-2xl font-bold sm:text-3xl'>
            Paušalist PRO — Uskoro
          </h1>
          <p className='mt-4 text-center text-sm leading-relaxed text-[#94a3a0]'>
            Trenutno razvijamo PRO plan. Ostavite email za obavijest.
          </p>
          <p className='mt-2 text-center text-xs text-[#64756f]'>
            F2.0 eRačuni, portal za računovođu, export i prioritetna podrška — bez
            lažne cijene na landingu dok ne bude spremno.
          </p>

          {sent ? (
            <p className='mt-8 rounded-xl border border-[#0d9488]/30 bg-[#0d9488]/10 p-4 text-center text-sm text-[#14b8a6]'>
              ✓ Hvala! Javit ćemo vam kad PRO bude dostupan.
            </p>
          ) : (
            <form className='mt-8 space-y-4' onSubmit={handleSubmit}>
              <label className='block'>
                <span className='mb-2 block text-sm text-[#b9c7c4]'>Email</span>
                <input
                  type='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='ime@obrt.hr'
                  className='w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-[#e2e8e7] outline-none transition focus:border-[#0d9488]'
                />
              </label>
              {error ? (
                <p className='rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200'>
                  {error}
                </p>
              ) : null}
              <button
                type='submit'
                disabled={isLoading}
                className='w-full rounded-xl bg-[#0d9488] px-4 py-3 font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-70'
              >
                {isLoading ? 'Šaljem...' : 'Prijavi me na waitlist'}
              </button>
            </form>
          )}

          <p className='mt-6 text-center text-xs text-[#94a3a0]'>
            ✓ Bez spama · Javljamo se samo kad je spremno
          </p>
        </section>

        <p className='mt-8 text-center text-sm text-[#94a3a0]'>
          <Link href='/cijene' className='text-[#0d9488] hover:underline'>
            ← Pogledaj Paušalist planove
          </Link>
        </p>
      </div>
    </main>
  );
}

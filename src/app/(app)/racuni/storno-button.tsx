'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function StornoInvoiceButton({
  racunId,
  brojRacuna,
}: {
  racunId: string;
  brojRacuna: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function confirmStorno() {
    setIsLoading(true);
    setError('');

    const response = await fetch(`/api/racuni/${racunId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'stornirano',
      }),
    });

    setIsLoading(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setError(payload.error || 'Storniranje računa nije uspjelo.');
      return;
    }

    setIsOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        className='font-body rounded-lg border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/10'
      >
        Storniraj
      </button>

      {isOpen ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4'>
          <div className='w-full max-w-md rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 shadow-2xl'>
            <h2 className='font-heading text-xl text-[#e2e8e7]'>Storniranje računa</h2>
            <p className='font-body mt-3 text-sm text-[#b9c7c4]'>
              Jesi li siguran da želiš stornirati račun {brojRacuna}?
            </p>
            <p className='font-body mt-2 text-xs text-[#94a3a0]'>
              U KPR će se dodati storno unos s negativnim iznosom.
            </p>

            {error ? (
              <p className='font-body mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200'>
                {error}
              </p>
            ) : null}

            <div className='mt-5 flex flex-wrap justify-end gap-3'>
              <button
                type='button'
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className='font-body rounded-xl border border-[#2a3734] px-4 py-2 text-sm text-[#d5dfdd] transition hover:border-[#0d9488] disabled:opacity-60'
              >
                Odustani
              </button>
              <button
                type='button'
                onClick={() => void confirmStorno()}
                disabled={isLoading}
                className='font-body rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {isLoading ? 'Storniram...' : 'Potvrdi storno'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

'use client';

import { useCallback, useState } from 'react';

const SHARE_ORIGIN = 'https://kvik.online';

type Props = {
  question: string;
  answer: string;
};

/** Sloj 1: dijeljenje ispod AI odgovora na /asistent. */
export function ShareAiResponse({ question, answer }: Props) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const createShare = useCallback(async () => {
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/share/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer }),
      });
      const payload = (await res.json().catch(() => ({}))) as { id?: string; error?: string };
      if (!res.ok || !payload.id) {
        throw new Error(payload.error ?? 'Ne mogu stvoriti link za dijeljenje.');
      }
      return payload.id as string;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Greška pri dijeljenju.';
      setError(msg);
      return null;
    } finally {
      setBusy(false);
    }
  }, [question, answer]);

  const onWhatsApp = useCallback(async () => {
    const id = await createShare();
    if (!id) {
      return;
    }
    const link = `${SHARE_ORIGIN}/share/${id}`;
    const text = encodeURIComponent(
      `Pogledaj odgovor na porezno pitanje koje me mučilo → ${link}`,
    );
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  }, [createShare]);

  const onEmail = useCallback(async () => {
    const id = await createShare();
    if (!id) {
      return;
    }
    const link = `${SHARE_ORIGIN}/share/${id}`;
    const subject = encodeURIComponent('Odgovor na porezno pitanje koji ti može pomoći');
    const body = encodeURIComponent(
      `Pitao/la sam Kvik AI i dobio/la odgovor koji ti može biti koristan: ${link}`,
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }, [createShare]);

  const onCopy = useCallback(async () => {
    const id = await createShare();
    if (!id) {
      return;
    }
    const link = `${SHARE_ORIGIN}/share/${id}`;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      setError('Kopiranje u međuspremnik nije uspjelo.');
    }
  }, [createShare]);

  return (
    <div className='mt-3 border-t border-[#253330] pt-3'>
      <p className='font-body text-xs text-[#94a3a0]'>Ovaj odgovor je besplatan.</p>
      <p className='font-body mt-1 text-sm text-[#b9c7c4]'>
        Imaš prijatelja koji se muči s porezom?
      </p>
      <div className='mt-3 flex flex-wrap gap-2'>
        <button
          type='button'
          disabled={busy}
          onClick={() => void onWhatsApp()}
          className='font-body rounded-lg border border-[#2a3734] bg-[#111716] px-3 py-2 text-xs font-medium text-[#d5dfdd] transition hover:border-[#0d9488] disabled:opacity-50'
        >
          📱 Pošalji na WhatsApp
        </button>
        <button
          type='button'
          disabled={busy}
          onClick={() => void onEmail()}
          className='font-body rounded-lg border border-[#2a3734] bg-[#111716] px-3 py-2 text-xs font-medium text-[#d5dfdd] transition hover:border-[#0d9488] disabled:opacity-50'
        >
          📧 Pošalji emailom
        </button>
        <button
          type='button'
          disabled={busy}
          onClick={() => void onCopy()}
          className='font-body rounded-lg border border-[#2a3734] bg-[#111716] px-3 py-2 text-xs font-medium text-[#d5dfdd] transition hover:border-[#0d9488] disabled:opacity-50'
        >
          🔗 Kopiraj link
        </button>
      </div>
      {error ? (
        <p className='font-body mt-2 text-xs text-red-300'>{error}</p>
      ) : null}
    </div>
  );
}

'use client';

import { useCallback, useState } from 'react';

const SHARE_ORIGIN = 'https://kvik.online';

type Props = {
  question: string;
  answer: string;
  variant?: 'default' | 'highlight';
};

/** Sloj 1: dijeljenje ispod AI odgovora na /asistent. */
export function ShareAiResponse({
  question,
  answer,
  variant = 'default',
}: Props) {
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

  const isHighlight = variant === 'highlight';

  return (
    <div
      className={
        isHighlight
          ? 'mt-2 rounded-2xl border border-[#0d9488]/60 bg-gradient-to-br from-[#0d9488]/25 to-[#0f172a]/45 p-4 shadow-[0_8px_24px_rgba(13,148,136,0.15)]'
          : 'mt-4 border-t border-[#253330] pt-4'
      }
    >
      {isHighlight ? (
        <p className='font-body text-sm leading-relaxed text-[#d9fffa] sm:text-[15px]'>
          Mali klik, velika pomoć.
          <br />
          Proslijedi nekome kome bi ovaj odgovor baš sad dobro došao.
        </p>
      ) : (
        <>
          <p className='font-body text-xs text-[#94a3a0]'>Ovaj odgovor je besplatan.</p>
          <p className='font-body mt-1 text-sm text-[#b9c7c4]'>
            Imaš prijatelja koji se muči s porezom?
          </p>
        </>
      )}
      <div className='mt-4 flex flex-wrap gap-2'>
        <button
          type='button'
          disabled={busy}
          onClick={() => void onWhatsApp()}
          className='font-body inline-flex items-center justify-center rounded-xl border border-[#0d9488]/70 bg-[#14b8a6] px-3.5 py-2.5 text-xs font-semibold text-[#042f2e] shadow-[0_6px_18px_rgba(20,184,166,0.28)] transition hover:-translate-y-0.5 hover:bg-[#2dd4bf] disabled:cursor-not-allowed disabled:opacity-60'
        >
          📱 Pošalji na WhatsApp
        </button>
        <button
          type='button'
          disabled={busy}
          onClick={() => void onEmail()}
          className='font-body inline-flex items-center justify-center rounded-xl border border-[#0d9488]/70 bg-[#14b8a6] px-3.5 py-2.5 text-xs font-semibold text-[#042f2e] shadow-[0_6px_18px_rgba(20,184,166,0.28)] transition hover:-translate-y-0.5 hover:bg-[#2dd4bf] disabled:cursor-not-allowed disabled:opacity-60'
        >
          📧 Pošalji emailom
        </button>
        <button
          type='button'
          disabled={busy}
          onClick={() => void onCopy()}
          className='font-body inline-flex items-center justify-center rounded-xl border border-[#0d9488]/70 bg-[#14b8a6] px-3.5 py-2.5 text-xs font-semibold text-[#042f2e] shadow-[0_6px_18px_rgba(20,184,166,0.28)] transition hover:-translate-y-0.5 hover:bg-[#2dd4bf] disabled:cursor-not-allowed disabled:opacity-60'
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

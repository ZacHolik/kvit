'use client';

import { useCallback, useEffect, useState } from 'react';

const SHARE_ORIGIN = 'https://kvik.online';

type Summary = {
  code: string | null;
  activatedFriendCount: number;
  priceLocked: boolean;
  lockedPrice: number | null;
};

/** Sloj 3 B): referral progress + modal na /dashboard. */
export function DashboardReferralSection() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const [sumRes, codeRes] = await Promise.all([
        fetch('/api/referral/dashboard-summary', { credentials: 'same-origin' }),
        fetch('/api/referral/ensure-code', { credentials: 'same-origin' }),
      ]);
      const sum = (await sumRes.json()) as Summary & { error?: string };
      if (!sumRes.ok) {
        throw new Error(sum.error ?? 'Učitavanje nije uspjelo.');
      }
      let code = sum.code;
      if (!code && codeRes.ok) {
        const c = (await codeRes.json()) as { code?: string };
        code = c.code ?? null;
      }
      setSummary({
        code: code ?? sum.code ?? null,
        activatedFriendCount: sum.activatedFriendCount ?? 0,
        priceLocked: Boolean(sum.priceLocked),
        lockedPrice: sum.lockedPrice,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Greška.');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const code = summary?.code ?? '';
  const link = code ? `${SHARE_ORIGIN}/r/${code}` : '';
  const filled = Math.min(summary?.activatedFriendCount ?? 0, 3);
  const shareText = `Koristim Kvik za paušalni obrt — AI mi odgovara na porezna pitanja, a KPR se vodi sam. Isprobaj besplatno: ${link}`;

  const onCopy = useCallback(async () => {
    if (!link) {
      return;
    }
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      setError('Kopiranje nije uspjelo.');
    }
  }, [link, shareText]);

  if (!summary && !error) {
    return (
      <section className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
        <p className='font-body text-sm text-[#94a3a0]'>Učitavam referral…</p>
      </section>
    );
  }

  return (
    <>
      <section className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
        <h2 className='font-heading text-xl text-[#e2e8e7]'>
          🔒 Zaključaj 5,60€/mj — zauvijek
        </h2>
        <p className='font-body mt-2 text-sm text-[#b9c7c4]'>
          Dovedi 3 prijatelja koji koriste Kvik → zadrži early adopter cijenu i nakon isteka
          ponude.
        </p>
        {summary?.priceLocked ? (
          <p className='font-body mt-4 rounded-lg border border-[#0d9488]/40 bg-[#0d9488]/10 px-4 py-3 text-sm font-medium text-[#5eead4]'>
            ✅ Cijena zaključana — {summary.lockedPrice ?? 5.6}€/mj zauvijek
          </p>
        ) : (
          <>
            <div
              className='mt-4 flex items-center gap-2 font-mono text-lg text-[#d5dfdd]'
              aria-label={`${filled} od 3 prijatelja`}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    i < filled
                      ? 'border-[#0d9488] bg-[#0d9488]/25 text-[#5eead4]'
                      : 'border-[#2a3734] text-[#64706e]'
                  }`}
                >
                  {i < filled ? '●' : '○'}
                </span>
              ))}
              <span className='font-body text-sm text-[#94a3a0]'>
                {filled} / 3
              </span>
            </div>
            <button
              type='button'
              onClick={() => setModalOpen(true)}
              className='font-body mt-5 rounded-xl bg-[#0d9488] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#14b8a6]'
            >
              Pozovi prijatelja →
            </button>
          </>
        )}
        {error ? (
          <p className='font-body mt-3 text-xs text-red-300'>{error}</p>
        ) : null}
      </section>

      {modalOpen ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4'>
          <div
            role='dialog'
            aria-modal='true'
            className='max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 text-[#e2e8e7]'
          >
            <h3 className='font-heading text-lg'>Podijeli Kvik</h3>
            <p className='font-body mt-2 text-sm text-[#94a3a0]'>Tvoj link</p>
            <p className='font-body mt-1 break-all rounded-lg border border-[#2a3734] bg-[#0b0f0e] p-3 text-sm text-[#5eead4]'>
              {link || '…'}
            </p>
            <p className='font-body mt-4 text-sm text-[#94a3a0]'>Tekst za dijeljenje</p>
            <p className='font-body mt-1 rounded-lg border border-[#2a3734] bg-[#0b0f0e] p-3 text-sm leading-relaxed text-[#d5dfdd]'>
              {shareText}
            </p>
            <div className='mt-4 flex flex-wrap gap-2'>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target='_blank'
                rel='noopener noreferrer'
                className='rounded-lg border border-[#2a3734] px-3 py-2 text-xs font-medium text-[#d5dfdd] hover:border-[#0d9488]'
              >
                WhatsApp
              </a>
              <a
                href={`viber://forward?text=${encodeURIComponent(shareText)}`}
                className='rounded-lg border border-[#2a3734] px-3 py-2 text-xs font-medium text-[#d5dfdd] hover:border-[#0d9488]'
              >
                Viber
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent('Kvik — paušalni obrt')}&body=${encodeURIComponent(shareText)}`}
                className='rounded-lg border border-[#2a3734] px-3 py-2 text-xs font-medium text-[#d5dfdd] hover:border-[#0d9488]'
              >
                Email
              </a>
              <button
                type='button'
                onClick={() => void onCopy()}
                className='rounded-lg border border-[#2a3734] px-3 py-2 text-xs font-medium text-[#d5dfdd] hover:border-[#0d9488]'
              >
                Kopiraj
              </button>
            </div>
            <button
              type='button'
              onClick={() => setModalOpen(false)}
              className='font-body mt-6 w-full rounded-xl border border-[#2a3734] py-2 text-sm text-[#b9c7c4] hover:border-[#0d9488]'
            >
              Zatvori
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

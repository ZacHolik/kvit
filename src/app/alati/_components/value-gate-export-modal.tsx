'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';

const SHARE_ORIGIN = 'https://kvik.online';

type Props = {
  open: boolean;
  onClose: () => void;
  /** Trenutni referral kod u URL-u (?ref=), inače prazno. */
  refFromUrl?: string | null;
  /** Putanja alata za dijeljenje, npr. /alati/kalkulator-poreza */
  toolPath: string;
};

/** Sloj 2: modal za neregistrirane korisnike prije PDF exporta. */
export function ValueGateExportModal({
  open,
  onClose,
  refFromUrl,
  toolPath,
}: Props) {
  const [copied, setCopied] = useState(false);
  const code = refFromUrl?.trim().toLowerCase() ?? '';
  const shareUrl =
    code.length === 6
      ? `${SHARE_ORIGIN}${toolPath}?ref=${encodeURIComponent(code)}`
      : `${SHARE_ORIGIN}${toolPath}`;

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [shareUrl]);

  if (!open) {
    return null;
  }

  const registerHref =
    code.length === 6
      ? `/register?ref=${encodeURIComponent(code)}&src=gate`
      : '/register?src=gate';

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4'>
      <div
        role='dialog'
        aria-modal='true'
        className='w-full max-w-md rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 text-[#e2e8e7]'
      >
        <h3 className='font-heading text-lg'>Spremi svoj rezultat</h3>
        <p className='font-body mt-3 text-sm text-[#94a3a0]'>Dva načina:</p>
        <div className='mt-4 flex flex-col gap-3'>
          <Link
            href={registerHref}
            className='font-body rounded-xl bg-[#0d9488] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#14b8a6]'
            onClick={onClose}
          >
            Registriraj se besplatno → dobij PDF odmah
          </Link>
          <p className='font-body text-center text-xs text-[#64706e]'>ili</p>
          <div className='rounded-xl border border-[#2a3734] bg-[#0b0f0e] p-4'>
            <p className='font-body text-sm text-[#b9c7c4]'>
              Pošalji link prijatelju → dobij PDF + 1 tjedan PRO
            </p>
            <p className='font-body mt-2 break-all text-xs text-[#5eead4]'>{shareUrl}</p>
            <div className='mt-3 flex flex-wrap gap-2'>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Pogledaj ovaj alat na Kviku: ${shareUrl}`)}`}
                target='_blank'
                rel='noopener noreferrer'
                className='rounded-lg border border-[#2a3734] px-2 py-1.5 text-xs text-[#d5dfdd]'
              >
                📱 WhatsApp
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent('Kvik alat')}&body=${encodeURIComponent(shareUrl)}`}
                className='rounded-lg border border-[#2a3734] px-2 py-1.5 text-xs text-[#d5dfdd]'
              >
                📧 Email
              </a>
              <button
                type='button'
                onClick={() => void onCopy()}
                className='rounded-lg border border-[#2a3734] px-2 py-1.5 text-xs text-[#d5dfdd]'
              >
                {copied ? '✓ Kopirano' : '🔗 Kopiraj link'}
              </button>
            </div>
          </div>
        </div>
        <button
          type='button'
          onClick={onClose}
          className='font-body mt-6 w-full rounded-xl border border-[#2a3734] py-2 text-sm text-[#94a3a0]'
        >
          Odustani
        </button>
      </div>
    </div>
  );
}

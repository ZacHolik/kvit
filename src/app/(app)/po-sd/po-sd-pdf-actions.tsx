'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ValueGateExportModal } from '@/app/alati/_components/value-gate-export-modal';

const PO_SD_PATH = '/po-sd';

type Props = {
  year: number;
};

/** Sloj 2: PDF export na /po-sd s value gateom za korisnike bez PRO pristupa. */
export function PoSdPdfActions({ year }: Props) {
  const [gateOpen, setGateOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [kvitPlan, setKvitPlan] = useState<string | null>(null);
  const [proExpiresAt, setProExpiresAt] = useState<string | null>(null);
  const [myCode, setMyCode] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user || cancelled) {
          return;
        }
        const { data: prof } = await supabase
          .from('profiles')
          .select('kvit_plan, pro_expires_at')
          .eq('id', user.id)
          .maybeSingle();
        if (cancelled) {
          return;
        }
        setKvitPlan((prof?.kvit_plan as string | undefined) ?? null);
        setProExpiresAt((prof?.pro_expires_at as string | undefined) ?? null);

        const proOk =
          prof?.kvit_plan === 'pro' ||
          (prof?.pro_expires_at && new Date(prof.pro_expires_at as string) > new Date());
        if (!proOk) {
          const res = await fetch('/api/referral/ensure-code', { credentials: 'same-origin' });
          const body = (await res.json()) as { code?: string };
          if (!cancelled && res.ok && body.code) {
            setMyCode(body.code);
          }
        }
      } catch {
        /* noop */
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasProAccess =
    kvitPlan === 'pro' ||
    (proExpiresAt != null && proExpiresAt !== '' && new Date(proExpiresAt) > new Date());

  const shareLink = myCode
    ? `https://kvik.online${PO_SD_PATH}?ref=${encodeURIComponent(myCode)}`
    : `https://kvik.online${PO_SD_PATH}`;

  if (!ready) {
    return (
      <section className='flex flex-wrap gap-3'>
        <span className='font-body text-sm text-[#94a3a0]'>Učitavam…</span>
      </section>
    );
  }

  return (
    <>
      <section className='flex flex-col gap-4'>
        {!hasProAccess ? (
          <div className='rounded-xl border border-[#0d9488]/25 bg-[#0b0f0e] p-4'>
            <p className='font-body text-sm font-medium text-[#e2e8e7]'>Želiš PDF export?</p>
            <p className='font-body mt-2 text-sm text-[#94a3a0]'>
              Pošalji link jednom prijatelju paušalistu → dobij PDF export + 1 tjedan PRO pristupa
            </p>
            <div className='mt-3 flex flex-wrap gap-2'>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Kvik PO-SD pregled: ${shareLink}`)}`}
                target='_blank'
                rel='noopener noreferrer'
                className='rounded-lg border border-[#2a3734] px-3 py-2 text-xs text-[#d5dfdd]'
              >
                📱 WhatsApp
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent('Kvik — PO-SD')}&body=${encodeURIComponent(shareLink)}`}
                className='rounded-lg border border-[#2a3734] px-3 py-2 text-xs text-[#d5dfdd]'
              >
                📧 Email
              </a>
              <button
                type='button'
                onClick={() => void navigator.clipboard.writeText(shareLink).catch(() => {})}
                className='rounded-lg border border-[#2a3734] px-3 py-2 text-xs text-[#d5dfdd]'
              >
                🔗 Kopiraj link
              </button>
            </div>
            <p className='font-body mt-4 text-sm text-[#94a3a0]'>
              Ili:{' '}
              <a href='/#cijene' className='font-semibold text-[#5eead4] underline'>
                nadogradi na PRO za 12€/mj
              </a>
            </p>
          </div>
        ) : null}

        {hasProAccess ? (
          <Link
            href={`/api/po-sd/pdf?year=${year}`}
            target='_blank'
            rel='noreferrer'
            className='font-body inline-flex rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6]'
          >
            Preuzmi PDF
          </Link>
        ) : (
          <button
            type='button'
            onClick={() => setGateOpen(true)}
            className='font-body inline-flex rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6]'
          >
            Preuzmi PDF
          </button>
        )}

        <Link
          href='/kpr'
          className='font-body inline-flex rounded-xl border border-[#2a3734] px-5 py-3 text-[#d5dfdd] transition hover:border-[#0d9488]'
        >
          KPR knjiga
        </Link>
      </section>

      <ValueGateExportModal
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        refFromUrl={myCode}
        toolPath={PO_SD_PATH}
      />
    </>
  );
}

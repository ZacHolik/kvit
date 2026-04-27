'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  buildHub30EurCode,
  DOPRINOSI_PRIMATELJ_DEMO,
} from '@/lib/alati/hub3-eur';
import { MJESECNI_DOPRINOSI_EUR } from '@/lib/alati/pausal-brackets';
import { useAlatiSession } from '@/hooks/use-alati-session';

const GUEST_USE_KEY = 'kvik-alat-doprinos-guest-used';

const eur = new Intl.NumberFormat('hr-HR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function PlacanjeDoprinosaTool() {
  const session = useAlatiSession();
  const signedIn = session.status === 'signed_in';
  const isPro = signedIn && session.isPro;
  const prof = signedIn ? session.profile : null;

  const [oib, setOib] = useState('');
  const [opcina, setOpcina] = useState('');
  const [razred, setRazred] = useState('1');
  const [platiteljLinija2, setPlatiteljLinija2] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [guestLocked, setGuestLocked] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (session.status === 'guest' && window.localStorage.getItem(GUEST_USE_KEY) === '1') {
      setGuestLocked(true);
    }
  }, [session.status]);

  useEffect(() => {
    if (!prof) {
      return;
    }
    setOib((v) => v || prof.oib);
    setOpcina((v) => v || (prof.opcina ?? ''));
    const adr = prof.adresa?.trim();
    if (adr) {
      setPlatiteljLinija2((prev) => prev || adr.slice(0, 27));
    }
  }, [prof]);

  const platiteljIme = prof?.naziv_obrta?.trim() || 'Platitelj (ime i prezime / obrt)';
  const plat1 = (opcina || 'Općina').slice(0, 27);
  const plat2 = (platiteljLinija2 || 'Adresa').slice(0, 27);

  const hubCode = useMemo(() => {
    const oibClean = oib.replace(/\s/g, '');
    return buildHub30EurCode({
      iznosEur: MJESECNI_DOPRINOSI_EUR,
      platiteljIme: platiteljIme.slice(0, 30),
      platiteljAdresa1: plat1,
      platiteljAdresa2: plat2,
      primateljIme: DOPRINOSI_PRIMATELJ_DEMO.naziv.slice(0, 25),
      primateljAdresa1: DOPRINOSI_PRIMATELJ_DEMO.adresa1,
      primateljAdresa2: DOPRINOSI_PRIMATELJ_DEMO.adresa2,
      iban: DOPRINOSI_PRIMATELJ_DEMO.iban,
      model: 'HR01',
      pozivNaBroj: oibClean.length === 11 ? oibClean : '00000000000',
      sifraNamjene: 'OTHR',
      opis: `Doprinosi · razred ${razred}`.slice(0, 35),
    });
  }, [platiteljIme, plat1, plat2, oib, razred]);

  const redraw = useCallback(async () => {
    const el = canvasRef.current;
    if (!el) {
      return;
    }
    const mod = (await import('pdf417-generator')) as typeof import('pdf417-generator');
    mod.draw(
      hubCode,
      el,
      2,
      -1,
      typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    );
  }, [hubCode]);

  useEffect(() => {
    if (session.status !== 'signed_in') {
      return;
    }
    void redraw();
  }, [redraw, session.status]);

  async function onGuestOnce() {
    await redraw();
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(GUEST_USE_KEY, '1');
    }
    setGuestLocked(true);
  }

  if (session.status === 'guest' && guestLocked) {
    return (
      <div className='rounded-2xl border border-[#0d9488]/40 bg-[#111716] p-6 text-center text-[#b9c7c4]'>
        <p className='text-lg font-medium text-[#e2e8e7]'>Dostigao si limit za goste</p>
        <p className='mt-2 text-sm'>
          <Link href='/register' className='font-semibold text-[#0d9488] hover:underline'>
            Registriraj se
          </Link>{' '}
          za neograničeno generiranje ili{' '}
          <a href='/#cijene' className='font-semibold text-[#5eead4] hover:underline'>
            PRO
          </a>{' '}
          za email podsjetnik svakog 14. u mjesecu.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl border border-amber-500/35 bg-amber-500/10 p-4 text-sm text-amber-50'>
        IBAN i primatelj su{' '}
        <strong>ilustrativni</strong> — uvijek provjeri zadnje upute HZZO/HZMO i svoju
        uplatnicu prije plaćanja.
      </div>

      {signedIn && !isPro ? (
        <p className='rounded-2xl border border-[#0d9488]/30 bg-[#0d9488]/10 p-4 text-sm text-[#b9c7c4]'>
          <a href='/#cijene' className='font-semibold text-[#5eead4] underline'>
            PRO
          </a>{' '}
          uključuje automatski email podsjetnik za doprinose svakog 14. u mjesecu (kad
          aktiviramo slanje u aplikaciji).
        </p>
      ) : null}

      {isPro ? (
        <p className='rounded-2xl border border-[#0d9488]/40 bg-[#111716] p-4 text-sm text-[#b9c7c4]'>
          PRO: predviđen automatski podsjetnik 14. u mjesecu — prati obavijesti u Kviku.
        </p>
      ) : null}

      <div className='grid gap-4 rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:grid-cols-2 sm:p-6'>
        <label className='block'>
          <span className='text-sm font-semibold text-[#e2e8e7]'>OIB platitelja</span>
          <input
            value={oib}
            onChange={(e) => setOib(e.target.value.replace(/\D/g, '').slice(0, 11))}
            className='mt-2 min-h-[52px] w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-lg text-[#e2e8e7] outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/30'
            inputMode='numeric'
          />
        </label>
        <label className='block'>
          <span className='text-sm font-semibold text-[#e2e8e7]'>Općina</span>
          <input
            value={opcina}
            onChange={(e) => setOpcina(e.target.value)}
            placeholder='npr. Zagreb'
            className='mt-2 min-h-[52px] w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-lg text-[#e2e8e7] outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/30'
          />
        </label>
        <label className='block sm:col-span-2'>
          <span className='text-sm font-semibold text-[#e2e8e7]'>
            Druga linija adrese platitelja
          </span>
          <input
            value={platiteljLinija2}
            onChange={(e) => setPlatiteljLinija2(e.target.value)}
            className='mt-2 min-h-[52px] w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-lg text-[#e2e8e7] outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/30'
          />
        </label>
        <label className='block sm:col-span-2'>
          <span className='text-sm font-semibold text-[#e2e8e7]'>
            Paušalni razred (informativno u opisu)
          </span>
          <select
            value={razred}
            onChange={(e) => setRazred(e.target.value)}
            className='mt-2 min-h-[52px] w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-lg text-[#e2e8e7] outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/30'
          >
            {['1', '2', '3', '4', '5', '6', '7'].map((r) => (
              <option key={r} value={r}>
                Razred {r}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
        <h2 className='font-heading text-lg font-semibold text-[#e2e8e7]'>
          Uplatni podaci
        </h2>
        <dl className='mt-4 space-y-2 text-sm text-[#b9c7c4]'>
          <div className='flex justify-between gap-4'>
            <dt>Iznos</dt>
            <dd className='font-semibold text-[#e2e8e7]'>{eur.format(MJESECNI_DOPRINOSI_EUR)}</dd>
          </div>
          <div className='flex justify-between gap-4'>
            <dt>IBAN (demo)</dt>
            <dd className='break-all text-right text-[#e2e8e7]'>{DOPRINOSI_PRIMATELJ_DEMO.iban}</dd>
          </div>
          <div className='flex justify-between gap-4'>
            <dt>Model / poziv</dt>
            <dd className='text-[#e2e8e7]'>HR01 · {oib.replace(/\s/g, '') || '—'}</dd>
          </div>
        </dl>
      </div>

      <div className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 text-center sm:p-6'>
        <p className='text-left text-sm font-medium text-[#94a3a0]'>2D barkod (HUB-3 / PDF417)</p>
        {session.status === 'guest' ? (
          <p className='mt-2 text-left text-xs text-[#64706e]'>
            Jedna besplatna generacija — nakon toga registracija ili PRO.
          </p>
        ) : null}
        <canvas
          ref={canvasRef}
          className='mx-auto mt-4 max-w-full bg-white p-2'
          aria-label='PDF417 barkod uplatnice'
        />
        {session.status === 'guest' && !guestLocked ? (
          <button
            type='button'
            onClick={() => void onGuestOnce()}
            className='mt-4 rounded-xl bg-[#0d9488] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#14b8a6]'
          >
            Generiraj 2D barkod (jednom)
          </button>
        ) : null}
      </div>

      <details className='rounded-xl border border-[#2a3734] bg-[#0b0f0e] p-4 text-xs text-[#94a3a0]'>
        <summary className='cursor-pointer font-medium text-[#b9c7c4]'>
          Tehnički sadržaj barkoda
        </summary>
        <pre className='mt-3 max-h-48 overflow-auto whitespace-pre-wrap break-words'>
          {hubCode}
        </pre>
      </details>
    </div>
  );
}

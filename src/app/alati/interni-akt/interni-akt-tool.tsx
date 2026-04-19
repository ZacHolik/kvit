'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useAlatiSession } from '@/hooks/use-alati-session';

function todayHr(): string {
  return new Intl.DateTimeFormat('hr-HR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}

const DEFAULT_PRAVILA = `Radno vrijeme: prema potrebi poslovanja.
Način vođenja evidencije: KPR i izdavanje računa u skladu s propisima.
Obveze prema kupcima: jasno istaknute cijene i rokovi.`;

export function InterniAktTool() {
  const session = useAlatiSession();
  const prof = session.status === 'signed_in' ? session.profile : null;

  const [nazivObrta, setNazivObrta] = useState('');
  const [oib, setOib] = useState('');
  const [adresa, setAdresa] = useState('');
  const [djelatnost, setDjelatnost] = useState('');
  const [pravila, setPravila] = useState(DEFAULT_PRAVILA);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!prof) {
      return;
    }
    setNazivObrta((prev) => prev || prof.naziv_obrta);
    setOib((prev) => prev || prof.oib);
    setAdresa((prev) => prev || (prof.adresa ?? ''));
  }, [prof]);

  const canPdf =
    nazivObrta.trim().length > 0 &&
    /^\d{11}$/.test(oib.replace(/\s/g, '')) &&
    adresa.trim().length > 3;

  async function onDownload() {
    if (!canPdf) {
      return;
    }
    setBusy(true);
    try {
      const [{ downloadReactPdfClient }, { InterniAktDocument }] = await Promise.all([
        import('@/lib/alati/download-react-pdf-client'),
        import('@/lib/pdf/interni-akt-document'),
      ]);
      await downloadReactPdfClient(
        <InterniAktDocument
          nazivObrta={nazivObrta.trim()}
          oib={oib.replace(/\s/g, '')}
          adresa={adresa.trim()}
          djelatnost={djelatnost.trim() || '—'}
          pravilaPoslovanja={pravila.trim() || '—'}
          datum={todayHr()}
        />,
        'interni-akt-pausalni-obrt.pdf',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className='space-y-6'>
      {session.status === 'guest' ? (
        <p className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-4 text-sm text-[#b9c7c4]'>
          Predložak možeš uređivati i preuzeti kao PDF.{' '}
          <Link href='/login' className='text-[#0d9488] hover:underline'>
            Prijavi se
          </Link>{' '}
          da polja automatski popune podaci iz profila.
        </p>
      ) : session.status === 'signed_in' && prof ? (
        <p className='rounded-2xl border border-[#0d9488]/30 bg-[#0d9488]/10 p-4 text-sm text-[#b9c7c4]'>
          Polja su djelomično popunjena iz tvog Kvit profila — prilagodi tekst prije ispisa.
        </p>
      ) : null}

      <div className='grid gap-4 sm:grid-cols-2'>
        <label className='block sm:col-span-2'>
          <span className='font-heading text-sm font-semibold text-[#e2e8e7]'>
            Naziv obrta
          </span>
          <input
            value={nazivObrta}
            onChange={(e) => setNazivObrta(e.target.value)}
            className='mt-2 min-h-[52px] w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-base text-[#e2e8e7] outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/30'
          />
        </label>
        <label className='block'>
          <span className='font-heading text-sm font-semibold text-[#e2e8e7]'>OIB</span>
          <input
            value={oib}
            onChange={(e) => setOib(e.target.value.replace(/\D/g, '').slice(0, 11))}
            inputMode='numeric'
            className='mt-2 min-h-[52px] w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-base text-[#e2e8e7] outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/30'
          />
        </label>
        <label className='block'>
          <span className='font-heading text-sm font-semibold text-[#e2e8e7]'>
            Djelatnost (kratko)
          </span>
          <input
            value={djelatnost}
            onChange={(e) => setDjelatnost(e.target.value)}
            placeholder='npr. IT usluge'
            className='mt-2 min-h-[52px] w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-base text-[#e2e8e7] outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/30'
          />
        </label>
        <label className='block sm:col-span-2'>
          <span className='font-heading text-sm font-semibold text-[#e2e8e7]'>Adresa</span>
          <input
            value={adresa}
            onChange={(e) => setAdresa(e.target.value)}
            className='mt-2 min-h-[52px] w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-base text-[#e2e8e7] outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/30'
          />
        </label>
        <label className='block sm:col-span-2'>
          <span className='font-heading text-sm font-semibold text-[#e2e8e7]'>
            Pravila poslovanja (slobodan tekst)
          </span>
          <textarea
            value={pravila}
            onChange={(e) => setPravila(e.target.value)}
            rows={8}
            className='mt-2 w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-base leading-relaxed text-[#e2e8e7] outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/30'
          />
        </label>
      </div>

      <div className='flex flex-wrap gap-3'>
        <button
          type='button'
          disabled={!canPdf || busy}
          onClick={() => void onDownload()}
          className='rounded-xl bg-[#0d9488] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-40'
        >
          {busy ? 'Generiram…' : 'Preuzmi PDF'}
        </button>
      </div>
    </div>
  );
}

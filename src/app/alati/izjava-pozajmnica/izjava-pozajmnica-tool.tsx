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

export function IzjavaPozajmnicaTool() {
  const session = useAlatiSession();
  const isPro = session.status === 'signed_in' && session.isPro;
  const prof = session.status === 'signed_in' ? session.profile : null;

  const [nazivObrta, setNazivObrta] = useState('');
  const [oib, setOib] = useState('');
  const [adresaObrta, setAdresaObrta] = useState('');
  const [vlasnikImovine, setVlasnikImovine] = useState('');
  const [predmetPozajmice, setPredmetPozajmice] = useState(
    'oprema / vozilo / drugo (opiši)',
  );
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!prof) {
      return;
    }
    setNazivObrta((v) => v || prof.naziv_obrta);
    setOib((v) => v || prof.oib);
    setAdresaObrta((v) => v || (prof.adresa ?? ''));
  }, [prof]);

  const canPdf =
    isPro &&
    nazivObrta.trim().length > 0 &&
    /^\d{11}$/.test(oib.replace(/\s/g, '')) &&
    adresaObrta.trim().length > 3 &&
    vlasnikImovine.trim().length > 2 &&
    predmetPozajmice.trim().length > 2;

  async function onDownload() {
    if (!canPdf) {
      return;
    }
    setBusy(true);
    try {
      const [{ downloadReactPdfClient }, { IzjavaPozajmnicaDocument }] = await Promise.all([
        import('@/lib/alati/download-react-pdf-client'),
        import('@/lib/pdf/izjava-pozajmnica-document'),
      ]);
      await downloadReactPdfClient(
        <IzjavaPozajmnicaDocument
          nazivObrta={nazivObrta.trim()}
          oib={oib.replace(/\s/g, '')}
          adresaObrta={adresaObrta.trim()}
          vlasnikImovine={vlasnikImovine.trim()}
          predmetPozajmice={predmetPozajmice.trim()}
          datum={todayHr()}
        />,
        'izjava-pozajmnica-vlasnika.pdf',
      );
    } finally {
      setBusy(false);
    }
  }

  if (session.status === 'loading') {
    return <p className='text-sm text-[#94a3a0]'>Učitavam…</p>;
  }

  if (!isPro) {
    return (
      <div className='rounded-2xl border border-[#0d9488]/40 bg-[#111716] p-6 text-center'>
        <p className='font-heading text-lg font-semibold text-[#e2e8e7]'>
          Dostupno uz Paušalist PRO
        </p>
        <p className='mt-2 text-sm text-[#94a3a0]'>
          PDF izjava o pozajmici vlasnika za paušalni obrt rezervirana je za PRO pretplatu.
        </p>
        <div className='mt-5 flex flex-wrap justify-center gap-3'>
          <Link
            href='/login'
            className='rounded-xl border border-[#0d9488]/60 px-5 py-2.5 text-sm font-medium text-[#e2e8e7] hover:bg-[#0d9488]/15'
          >
            Prijava
          </Link>
          <a
            href='/#cijene'
            className='rounded-xl bg-[#0d9488] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#14b8a6]'
          >
            PRO planovi
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='grid gap-4 sm:grid-cols-2'>
        <label className='block sm:col-span-2'>
          <span className='text-sm font-semibold text-[#e2e8e7]'>Naziv obrta</span>
          <input
            value={nazivObrta}
            onChange={(e) => setNazivObrta(e.target.value)}
            className='mt-2 min-h-[52px] w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-base text-[#e2e8e7] outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/30'
          />
        </label>
        <label className='block'>
          <span className='text-sm font-semibold text-[#e2e8e7]'>OIB</span>
          <input
            value={oib}
            onChange={(e) => setOib(e.target.value.replace(/\D/g, '').slice(0, 11))}
            className='mt-2 min-h-[52px] w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-base text-[#e2e8e7] outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/30'
            inputMode='numeric'
          />
        </label>
        <label className='block sm:col-span-2'>
          <span className='text-sm font-semibold text-[#e2e8e7]'>Adresa obrta</span>
          <input
            value={adresaObrta}
            onChange={(e) => setAdresaObrta(e.target.value)}
            className='mt-2 min-h-[52px] w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-base text-[#e2e8e7] outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/30'
          />
        </label>
        <label className='block sm:col-span-2'>
          <span className='text-sm font-semibold text-[#e2e8e7]'>Vlasnik imovine</span>
          <input
            value={vlasnikImovine}
            onChange={(e) => setVlasnikImovine(e.target.value)}
            className='mt-2 min-h-[52px] w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-base text-[#e2e8e7] outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/30'
          />
        </label>
        <label className='block sm:col-span-2'>
          <span className='text-sm font-semibold text-[#e2e8e7]'>Predmet pozajmice</span>
          <textarea
            value={predmetPozajmice}
            onChange={(e) => setPredmetPozajmice(e.target.value)}
            rows={3}
            className='mt-2 w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-base text-[#e2e8e7] outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/30'
          />
        </label>
      </div>
      <button
        type='button'
        disabled={!canPdf || busy}
        onClick={() => void onDownload()}
        className='rounded-xl bg-[#0d9488] px-6 py-3 text-sm font-semibold text-white hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-40'
      >
        {busy ? 'Generiram…' : 'Preuzmi PDF'}
      </button>
    </div>
  );
}

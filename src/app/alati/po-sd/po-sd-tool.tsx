'use client';

import { useMemo, useState } from 'react';

import { getPausalRazred2026 } from '@/lib/pausal-tax';
import { formatIznosEurHr } from '@/lib/format-hr';

import LeadCapture from '@/components/LeadCapture';

import { PostValueCta } from '../_components/post-value-cta';
import { PoweredByKvikBadge } from '../_components/powered-by-kvik-badge';
import { ShareResult } from '../_components/share-result';

/** Dopušta prazan unos tijekom tipkanja; prazno ili nevaljano → 0 za izračun. */
function parseEurInput(raw: string): number {
  const t = raw.trim().replace(/\s/g, '').replace(',', '.');
  if (t === '' || t === '.') {
    return 0;
  }
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

/**
 * Uklanja vodeće nule u cjelobrojnom dijelu (npr. "052" → "52").
 * Zadržava jednu nulu ispred decimala ("0,5", "0.25").
 */
function stripMoneyLeadingZeros(v: string): string {
  if (v === '' || v === ',' || v === '.') {
    return v;
  }
  const m = /^(\d*)([.,])(\d*)$/.exec(v);
  if (m) {
    let intPart = m[1].replace(/^0+/, '');
    const sep = m[2];
    const decPart = m[3];
    if (intPart === '') {
      intPart = '0';
    }
    return `${intPart}${sep}${decPart}`;
  }
  if (/^\d+$/.test(v)) {
    return v.replace(/^0+/, '');
  }
  return v;
}

/** Znamenke + najviše jedan decimalni separator (korak unosa, uključ. prazno). */
function trySetMoney(setter: (v: string) => void, raw: string) {
  let v = raw.replace(/\s/g, '').replace(/[^\d.,]/g, '');
  if (v === '') {
    setter('');
    return;
  }
  if (!/^\d*([.,]\d*)?$/.test(v)) {
    return;
  }
  v = stripMoneyLeadingZeros(v);
  setter(v);
}

export function PoSdTool() {
  const defaultGodina = new Date().getFullYear() - 1;
  const [godinaStr, setGodinaStr] = useState(String(defaultGodina));
  const [gotovinaStr, setGotovinaStr] = useState('');
  const [bezgotovinskoStr, setBezgotovinskoStr] = useState('');
  const [generated, setGenerated] = useState(false);

  const godina =
    godinaStr === ''
      ? defaultGodina
      : Math.min(2100, Math.max(1970, parseInt(godinaStr, 10) || defaultGodina));

  const gotovina = parseEurInput(gotovinaStr);
  const bezgotovinsko = parseEurInput(bezgotovinskoStr);

  const ukupno = Math.max(0, gotovina) + Math.max(0, bezgotovinsko);
  const razred = useMemo(() => getPausalRazred2026(ukupno), [ukupno]);
  const porezKvartalno = razred?.porezKvartalnoEur ?? 0;
  const porezMjesecno = porezKvartalno / 3;
  const porezGodisnje = razred?.porezGodisnjeEur ?? porezKvartalno * 4;

  return (
    <div className='space-y-6'>
      <section className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
        <h2 className='font-heading text-lg text-[#e2e8e7]'>PO-SD generator (besplatno)</h2>
        <p className='mt-2 text-sm text-[#b9c7c4]'>
          Unesi primitke i izračunaj procjenu razreda i poreza.
        </p>
        <div className='mt-4 grid gap-4 sm:grid-cols-3'>
          <label className='text-sm text-[#b9c7c4]'>
            Godina
            <input
              type='text'
              inputMode='numeric'
              autoComplete='off'
              value={godinaStr}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                setGodinaStr(v);
              }}
              onFocus={() => {
                if (godinaStr === '0') {
                  setGodinaStr('');
                }
              }}
              onBlur={() => {
                if (godinaStr === '') {
                  setGodinaStr(String(defaultGodina));
                }
              }}
              className='mt-2 w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-3 py-2 text-[#e2e8e7]'
            />
          </label>
          <label className='text-sm text-[#b9c7c4]'>
            Gotovina (€)
            <input
              type='text'
              inputMode='decimal'
              autoComplete='off'
              placeholder='0'
              value={gotovinaStr}
              onChange={(e) => trySetMoney(setGotovinaStr, e.target.value)}
              onFocus={() => {
                if (gotovinaStr === '0') {
                  setGotovinaStr('');
                }
              }}
              className='mt-2 w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-3 py-2 text-[#e2e8e7] placeholder:text-[#64748b]'
            />
          </label>
          <label className='text-sm text-[#b9c7c4]'>
            Bezgotovinsko (€)
            <input
              type='text'
              inputMode='decimal'
              autoComplete='off'
              placeholder='0'
              value={bezgotovinskoStr}
              onChange={(e) => trySetMoney(setBezgotovinskoStr, e.target.value)}
              onFocus={() => {
                if (bezgotovinskoStr === '0') {
                  setBezgotovinskoStr('');
                }
              }}
              className='mt-2 w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-3 py-2 text-[#e2e8e7] placeholder:text-[#64748b]'
            />
          </label>
        </div>
        <button
          type='button'
          onClick={() => setGenerated(true)}
          className='mt-4 rounded-xl bg-[#0d9488] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#14b8a6]'
        >
          Generiraj PO-SD pregled
        </button>
      </section>

      {generated ? (
        <>
          <section className='rounded-2xl border border-[#0d9488]/35 bg-[#111716] p-5 sm:p-6'>
            <h3 className='font-heading text-lg text-[#e2e8e7]'>Rezultat</h3>
            <dl className='mt-4 space-y-2 text-sm text-[#b9c7c4]'>
              <div className='flex justify-between gap-4'>
                <dt>Godina</dt>
                <dd>{godina}</dd>
              </div>
              <div className='flex justify-between gap-4'>
                <dt>Ukupno primitci</dt>
                <dd className='font-semibold text-[#e2e8e7]'>
                  {formatIznosEurHr(ukupno)}
                </dd>
              </div>
              <div className='flex justify-between gap-4'>
                <dt>Razred</dt>
                <dd>{razred?.label ?? '—'}</dd>
              </div>
              <div className='flex justify-between gap-4'>
                <dt>Porez mjesečno (procjena)</dt>
                <dd>{formatIznosEurHr(porezMjesecno)}</dd>
              </div>
              <div className='flex justify-between gap-4'>
                <dt>Porez kvartalno (procjena)</dt>
                <dd>{formatIznosEurHr(porezKvartalno)}</dd>
              </div>
              <div className='flex justify-between gap-4'>
                <dt>Porez godišnje (procjena)</dt>
                <dd>{formatIznosEurHr(porezGodisnje)}</dd>
              </div>
            </dl>
            <PoweredByKvikBadge />
            <ShareResult
              pageTitle='PO-SD generator'
              pageUrl='https://kvik.online/alati/po-sd'
            />
            <PostValueCta />
          </section>
          <LeadCapture
            sourceTool='po-sd'
            personaHint='uplaseni-pocetnik'
            resultPayload={{
              godina,
              gotovina,
              bezgotovinsko,
              ukupno,
              razred: razred?.label ?? null,
              porezMjesecno,
              porezKvartalno,
              porezGodisnje,
            }}
          />
        </>
      ) : null}
    </div>
  );
}

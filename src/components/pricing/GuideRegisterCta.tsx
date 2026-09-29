'use client';

import Link from 'next/link';

import PromoLine from './PromoLine';

/** CTA okvir na vodičima (sredina / dno) — narančasti gumb bez iznosa. */
export default function GuideRegisterCta({
  className = 'mt-14',
}: {
  className?: string;
}) {
  return (
    <div
      className={`${className} rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 text-center`}
    >
      <p className='mb-1 text-base font-medium leading-relaxed text-[#e2e8e7]'>
        Kvik aplikacija za džepno knjigovodstvo za paušaliste pomaže ti s rokovima,
        obrascima i poreznim pitanjima.
      </p>
      <p className='mb-5 text-sm leading-relaxed text-[#94a3a0]'>
        Provjeri kako je jednostavno izdavati račune u pokretu dok aplikacija
        automatski popunjava KPR. Džepno knjigovodstvo za paušaliste — uvijek uz
        tebe, na tvome mobitelu.
      </p>
      <PromoLine variant='cta' className='mb-5' />
      <Link
        href='/register'
        className='inline-block rounded-xl px-8 py-3 text-sm font-semibold text-white transition hover:brightness-110'
        style={{ backgroundColor: '#d97706' }}
      >
        Pretplati se →
      </Link>
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';

import { formatDatumHr, formatIznosEurHr } from '@/lib/format-hr';

import { ConvertOfferButton } from './convert-button';

export type PonudaRow = {
  id: string;
  broj_ponude: string;
  datum: string;
  datum_valjanosti: string | null;
  kupac_naziv: string;
  status: 'poslana' | 'prihvacena' | 'odbijena' | 'istekla';
  ukupno: number;
};

const STATUS_LABELS: Record<PonudaRow['status'], string> = {
  poslana: 'Poslana',
  prihvacena: 'Prihvaćena',
  odbijena: 'Odbijena',
  istekla: 'Istekla',
};

export function OfferList({ offers }: { offers: PonudaRow[] }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('svi');

  const filteredOffers = useMemo(() => {
    const q = search.trim().toLocaleLowerCase();
    return offers.filter((ponuda) => {
      const matchesSearch =
        q.length === 0 || ponuda.kupac_naziv.toLocaleLowerCase().includes(q);
      const matchesStatus = status === 'svi' || ponuda.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [offers, search, status]);

  return (
    <>
      <section className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
        <div className='grid gap-4 md:grid-cols-[1fr_14rem]'>
          <label className='block'>
            <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
              Pretraži po kupcu...
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-[#e2e8e7] outline-none transition focus:border-[#0d9488]'
              placeholder='npr. Studio Kreativ'
            />
          </label>
          <label className='block'>
            <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>Status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-[#e2e8e7] outline-none transition focus:border-[#0d9488]'
            >
              <option value='svi'>Svi</option>
              <option value='poslana'>Poslana</option>
              <option value='prihvacena'>Prihvaćena</option>
              <option value='odbijena'>Odbijena</option>
              <option value='istekla'>Istekla</option>
            </select>
          </label>
        </div>
      </section>

      <section className='overflow-x-auto rounded-2xl border border-[#1f2a28] bg-[#111716]'>
        <table className='min-w-full divide-y divide-[#24312f]'>
          <thead>
            <tr className='text-left text-sm text-[#94a3a0]'>
              <th className='px-4 py-3 font-medium'>Broj</th>
              <th className='px-4 py-3 font-medium'>Kupac</th>
              <th className='px-4 py-3 font-medium'>Datum</th>
              <th className='px-4 py-3 font-medium'>Vrijedi do</th>
              <th className='px-4 py-3 font-medium'>Iznos</th>
              <th className='px-4 py-3 font-medium'>Status</th>
              <th className='px-4 py-3 font-medium'>Akcije</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-[#24312f]'>
            {filteredOffers.map((ponuda) => (
              <tr key={ponuda.id} className='text-sm'>
                <td className='px-4 py-4'>{ponuda.broj_ponude}</td>
                <td className='px-4 py-4'>{ponuda.kupac_naziv}</td>
                <td className='px-4 py-4'>{formatDatumHr(ponuda.datum)}</td>
                <td className='px-4 py-4'>
                  {ponuda.datum_valjanosti
                    ? formatDatumHr(ponuda.datum_valjanosti)
                    : '-'}
                </td>
                <td className='px-4 py-4'>{formatIznosEurHr(Number(ponuda.ukupno))}</td>
                <td className='px-4 py-4 text-[#b9c7c4]'>
                  {STATUS_LABELS[ponuda.status] ?? ponuda.status}
                </td>
                <td className='px-4 py-4'>
                  <div className='flex flex-wrap gap-2'>
                    <a
                      href={`/api/ponude/${ponuda.id}/pdf`}
                      target='_blank'
                      rel='noreferrer'
                      className='rounded-lg border border-[#2a3734] px-3 py-2 text-xs text-[#d5dfdd] transition hover:border-[#0d9488]'
                    >
                      PDF
                    </a>
                    <ConvertOfferButton ponudaId={ponuda.id} />
                  </div>
                </td>
              </tr>
            ))}
            {filteredOffers.length === 0 ? (
              <tr>
                <td colSpan={7} className='px-4 py-8 text-center text-sm text-[#94a3a0]'>
                  Nema ponuda za odabrane filtere.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </>
  );
}

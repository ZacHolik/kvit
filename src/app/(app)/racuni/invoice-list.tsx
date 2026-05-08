'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import {
  formatDatumHr,
  formatIznosEurHr,
  formatRacunStatusHr,
} from '@/lib/format-hr';

import { EmailInvoiceButton } from './email-button';
import { MarkAsPaidButton } from './paid-button';
import { StornoInvoiceButton } from './storno-button';

export type InvoiceRow = {
  id: string;
  broj_racuna: string;
  datum: string;
  nacin_placanja: 'ziro' | 'gotovina' | 'kartica' | null;
  status: 'izdano' | 'placeno' | 'stornirano';
  ukupni_iznos: number;
  email_poslano_at: string | null;
  email_poslano_na: string | null;
  jir: string | null;
  fiskalizirano_at: string | null;
  fiskalizacija_error: string | null;
  kupci: {
    naziv: string;
    email: string | null;
  } | null;
};

type InvoiceListProps = {
  invoices: InvoiceRow[];
  nazivObrta: string;
  /** Računi s pending redom za ponovni CIS pokušaj. */
  pendingRetryRacunIds?: string[];
};

const PAYMENT_LABELS: Record<string, string> = {
  ziro: 'Žiro',
  gotovina: 'Gotovina',
  kartica: 'Kartica',
};

function FiscalRetryActions({ racunId }: { racunId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function retry() {
    setBusy(true);
    setMsg('');
    try {
      const res = await fetch('/api/fiscal/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ racunId }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (res.ok && data.ok) {
        router.refresh();
      } else {
        setMsg(data.message ?? 'Pokušaj nije uspio.');
      }
    } catch {
      setMsg('Mrežna greška.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className='mt-1 flex flex-col items-end gap-1'>
      <span className='inline-flex rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-200'>
        Čeka fiskalizaciju
      </span>
      <button
        type='button'
        disabled={busy}
        onClick={() => void retry()}
        className='font-body rounded border border-amber-500/50 px-2 py-1 text-[10px] text-amber-100 transition hover:bg-amber-500/10 disabled:opacity-50'
      >
        {busy ? '…' : 'Pokušaj ponovo'}
      </button>
      {msg ? <span className='max-w-[8rem] text-[10px] text-red-300'>{msg}</span> : null}
    </div>
  );
}

export function InvoiceList({
  invoices,
  nazivObrta,
  pendingRetryRacunIds = [],
}: InvoiceListProps) {
  const retrySet = useMemo(() => new Set(pendingRetryRacunIds), [pendingRetryRacunIds]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('svi');
  const [payment, setPayment] = useState('svi');

  const filteredInvoices = useMemo(() => {
    const q = search.trim().toLocaleLowerCase();
    return invoices.filter((racun) => {
      const buyerName = racun.kupci?.naziv?.toLocaleLowerCase() ?? '';
      const matchesSearch = q.length === 0 || buyerName.includes(q);
      const matchesStatus = status === 'svi' || racun.status === status;
      const matchesPayment =
        payment === 'svi' || racun.nacin_placanja === payment;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [invoices, payment, search, status]);

  return (
    <>
      <section className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
        <div className='grid gap-4 lg:grid-cols-[1fr_12rem_12rem]'>
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
              <option value='izdano'>Izdano</option>
              <option value='placeno'>Plaćeno</option>
              <option value='stornirano'>Stornirano</option>
            </select>
          </label>
          <label className='block'>
            <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
              Način plaćanja
            </span>
            <select
              value={payment}
              onChange={(event) => setPayment(event.target.value)}
              className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-[#e2e8e7] outline-none transition focus:border-[#0d9488]'
            >
              <option value='svi'>Svi</option>
              <option value='ziro'>Žiro</option>
              <option value='gotovina'>Gotovina</option>
              <option value='kartica'>Kartica</option>
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
              <th className='px-4 py-3 font-medium'>Iznos</th>
              <th className='px-4 py-3 font-medium'>Status</th>
              <th className='px-4 py-3 font-medium'>Način</th>
              <th className='px-4 py-3 font-medium'>Email</th>
              <th className='px-4 py-3 font-medium'>Fiskal</th>
              <th className='px-4 py-3 font-medium'>Akcije</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-[#24312f]'>
            {filteredInvoices.map((racun) => {
              const sentAt = racun.email_poslano_at
                ? formatDatumHr(racun.email_poslano_at)
                : null;
              const emailTitle =
                racun.email_poslano_at && racun.email_poslano_na
                  ? `Poslano na ${racun.email_poslano_na} ${sentAt}`
                  : undefined;

              const isStornirano = racun.status === 'stornirano';
              const rowClass = isStornirano
                ? 'text-sm text-red-200 line-through decoration-red-400/80'
                : 'text-sm';

              return (
                <tr key={racun.id} className={rowClass}>
                  <td className='px-4 py-4'>{racun.broj_racuna}</td>
                  <td className='px-4 py-4'>{racun.kupci?.naziv ?? '-'}</td>
                  <td className='px-4 py-4'>{formatDatumHr(racun.datum)}</td>
                  <td className='px-4 py-4'>
                    {formatIznosEurHr(Number(racun.ukupni_iznos))}
                  </td>
                  <td className='px-4 py-4 text-[#b9c7c4]'>
                    {formatRacunStatusHr(racun.status)}
                  </td>
                  <td className='px-4 py-4 text-[#b9c7c4]'>
                    {racun.nacin_placanja
                      ? PAYMENT_LABELS[racun.nacin_placanja]
                      : '-'}
                  </td>
                  <td className='px-4 py-4'>
                    {racun.email_poslano_at ? (
                      <span
                        title={emailTitle}
                        className='inline-flex rounded-full border border-[#0d9488]/40 bg-[#0d9488]/10 px-2.5 py-1 text-xs font-semibold text-[#5eead4]'
                      >
                        Poslano
                      </span>
                    ) : (
                      <span className='text-[#64756f]'>-</span>
                    )}
                  </td>
                  <td className='px-4 py-4'>
                    {racun.jir ? (
                      <span
                        title={`JIR: ${racun.jir}`}
                        className='inline-flex rounded-full border border-[#0d9488]/40 bg-[#0d9488]/10 px-2.5 py-1 text-xs font-semibold text-[#5eead4]'
                      >
                        Fiskalizirano
                      </span>
                    ) : racun.fiskalizacija_error ? (
                      <div className='flex flex-col items-end gap-1'>
                        <span
                          title={racun.fiskalizacija_error}
                          className='inline-flex rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-200'
                        >
                          Nije fiskalizirano
                        </span>
                        {retrySet.has(racun.id) ? (
                          <FiscalRetryActions racunId={racun.id} />
                        ) : null}
                      </div>
                    ) : retrySet.has(racun.id) ? (
                      <FiscalRetryActions racunId={racun.id} />
                    ) : (
                      <span className='text-[#64756f]'>-</span>
                    )}
                  </td>
                  <td className='px-4 py-4'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <a
                        href={`/api/racuni/${racun.id}/pdf`}
                        target='_blank'
                        rel='noreferrer'
                        className='font-body rounded-lg border border-[#2a3734] px-3 py-2 text-xs text-[#d5dfdd] transition hover:border-[#0d9488]'
                      >
                        PDF
                      </a>
                      {racun.status === 'izdano' ? (
                        <MarkAsPaidButton racunId={racun.id} />
                      ) : null}
                      {racun.status === 'izdano' ? (
                        <StornoInvoiceButton
                          racunId={racun.id}
                          brojRacuna={racun.broj_racuna}
                        />
                      ) : null}
                      <EmailInvoiceButton
                        racunId={racun.id}
                        defaultEmail={racun.kupci?.email ?? ''}
                        defaultSubject={`Račun broj ${racun.broj_racuna} - ${nazivObrta}`}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={9} className='px-4 py-8 text-center text-sm text-[#94a3a0]'>
                  Nema računa za odabrane filtere.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </>
  );
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useState } from 'react';

import { formatIznosEurHr } from '@/lib/format-hr';
import { createClient } from '@/lib/supabase/client';

type OfferStatus = 'poslana' | 'prihvacena' | 'odbijena' | 'istekla';

type Item = {
  id: string;
  opis: string;
  kolicina: string;
  jedinicnaCijena: string;
};

type Customer = {
  id: string;
  naziv: string;
  oib: string | null;
  adresa: string | null;
  email: string | null;
};

function createItem(): Item {
  return {
    id: crypto.randomUUID(),
    opis: '',
    kolicina: '1',
    jedinicnaCijena: '0',
  };
}

export default function NovaPonudaPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([createItem()]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({
    brojPonude: '',
    datum: new Date().toISOString().slice(0, 10),
    datumValjanosti: '',
    status: 'poslana' as OfferStatus,
    kupacNaziv: '',
    kupacOib: '',
    kupacAdresa: '',
    kupacEmail: '',
    napomena: '',
  });

  const ukupno = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum +
          (Number(item.kolicina) || 0) * (Number(item.jedinicnaCijena) || 0),
        0,
      ),
    [items],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) {
        return;
      }

      const [{ data: kupci }, { count }] = await Promise.all([
        supabase
          .from('kupci')
          .select('id, naziv, oib, adresa, email')
          .eq('user_id', user.id)
          .order('naziv', { ascending: true }),
        supabase
          .from('ponude')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
      ]);

      if (!cancelled) {
        setCustomers((kupci ?? []) as Customer[]);
        setFormState((previous) =>
          previous.brojPonude
            ? previous
            : {
                ...previous,
                brojPonude: `P-${(count ?? 0) + 1}-${new Date().getFullYear()}`,
              },
        );
      }
    }

    void loadData();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  function updateItem(id: string, patch: Partial<Item>) {
    setItems((previous) =>
      previous.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function applyCustomerByName(name: string) {
    const customer = customers.find(
      (item) => item.naziv.toLocaleLowerCase() === name.toLocaleLowerCase(),
    );
    if (!customer) {
      return;
    }
    setFormState((previous) => ({
      ...previous,
      kupacNaziv: customer.naziv,
      kupacOib: customer.oib ?? '',
      kupacAdresa: customer.adresa ?? '',
      kupacEmail: customer.email ?? '',
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const payloadItems = items
      .map((item) => ({
        opis: item.opis.trim(),
        kolicina: Number(item.kolicina),
        jedinicnaCijena: Number(item.jedinicnaCijena),
      }))
      .filter(
        (item) =>
          item.opis &&
          Number.isFinite(item.kolicina) &&
          item.kolicina > 0 &&
          Number.isFinite(item.jedinicnaCijena) &&
          item.jedinicnaCijena >= 0,
      );

    if (payloadItems.length === 0) {
      setError('Dodaj barem jednu ispravnu stavku ponude.');
      return;
    }

    setIsLoading(true);
    const response = await fetch('/api/ponude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brojPonude: formState.brojPonude,
        datum: formState.datum,
        datumValjanosti: formState.datumValjanosti || undefined,
        status: formState.status,
        napomena: formState.napomena,
        kupac: {
          naziv: formState.kupacNaziv,
          oib: formState.kupacOib || undefined,
          adresa: formState.kupacAdresa || undefined,
          email: formState.kupacEmail || undefined,
        },
        items: payloadItems,
      }),
    });
    setIsLoading(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setError(payload.error || 'Spremanje ponude nije uspjelo.');
      return;
    }

    router.push('/ponude');
    router.refresh();
  }

  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-8 text-[#e2e8e7] sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-4xl flex-col gap-6'>
        <header className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          <p className='font-body text-sm text-[#94a3a0]'>Ponuda</p>
          <h1 className='font-heading mt-2 text-2xl sm:text-3xl'>Nova ponuda</h1>
        </header>

        <form
          onSubmit={handleSubmit}
          className='space-y-6 rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'
        >
          <section className='grid gap-4 sm:grid-cols-3'>
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Broj ponude
              </span>
              <input
                required
                value={formState.brojPonude}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    brojPonude: event.target.value,
                  }))
                }
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              />
            </label>
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>Datum</span>
              <input
                required
                type='date'
                value={formState.datum}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    datum: event.target.value,
                  }))
                }
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              />
            </label>
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Vrijedi do
              </span>
              <input
                type='date'
                value={formState.datumValjanosti}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    datumValjanosti: event.target.value,
                  }))
                }
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              />
            </label>
          </section>

          <label className='block max-w-xs'>
            <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>Status</span>
            <select
              value={formState.status}
              onChange={(event) =>
                setFormState((previous) => ({
                  ...previous,
                  status: event.target.value as OfferStatus,
                }))
              }
              className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
            >
              <option value='poslana'>Poslana</option>
              <option value='prihvacena'>Prihvaćena</option>
              <option value='odbijena'>Odbijena</option>
              <option value='istekla'>Istekla</option>
            </select>
          </label>

          <section className='grid gap-4 sm:grid-cols-2'>
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Kupac naziv
              </span>
              <input
                required
                list='ponuda-kupci'
                value={formState.kupacNaziv}
                onChange={(event) => {
                  const value = event.target.value;
                  setFormState((previous) => ({ ...previous, kupacNaziv: value }));
                  applyCustomerByName(value);
                }}
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              />
              <datalist id='ponuda-kupci'>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.naziv} />
                ))}
              </datalist>
            </label>
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>OIB</span>
              <input
                value={formState.kupacOib}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    kupacOib: event.target.value,
                  }))
                }
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              />
            </label>
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>Adresa</span>
              <input
                value={formState.kupacAdresa}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    kupacAdresa: event.target.value,
                  }))
                }
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              />
            </label>
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>Email</span>
              <input
                type='email'
                value={formState.kupacEmail}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    kupacEmail: event.target.value,
                  }))
                }
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              />
            </label>
          </section>

          <section className='space-y-4'>
            <div className='flex items-center justify-between gap-3'>
              <h2 className='font-heading text-lg text-[#e2e8e7]'>Stavke</h2>
              <button
                type='button'
                onClick={() => setItems((previous) => [...previous, createItem()])}
                className='font-body rounded-xl border border-[#0d9488] px-4 py-2 text-sm font-semibold text-[#5eead4] transition hover:bg-[#0d9488]/10'
              >
                + Dodaj stavku
              </button>
            </div>
            {items.map((item, index) => {
              const total =
                (Number(item.kolicina) || 0) * (Number(item.jedinicnaCijena) || 0);
              return (
                <div
                  key={item.id}
                  className='grid gap-3 rounded-2xl border border-[#24312f] bg-[#0b0f0e] p-4 sm:grid-cols-12'
                >
                  <input
                    required
                    value={item.opis}
                    onChange={(event) =>
                      updateItem(item.id, { opis: event.target.value })
                    }
                    className='font-body rounded-xl border border-[#2a3734] bg-[#111716] px-4 py-3 outline-none transition focus:border-[#0d9488] sm:col-span-5'
                    placeholder={`Stavka ${index + 1}`}
                  />
                  <input
                    required
                    type='number'
                    min='0'
                    step='0.01'
                    value={item.kolicina}
                    onChange={(event) =>
                      updateItem(item.id, { kolicina: event.target.value })
                    }
                    className='font-body rounded-xl border border-[#2a3734] bg-[#111716] px-4 py-3 outline-none transition focus:border-[#0d9488] sm:col-span-2'
                  />
                  <input
                    required
                    type='number'
                    min='0'
                    step='0.01'
                    value={item.jedinicnaCijena}
                    onChange={(event) =>
                      updateItem(item.id, { jedinicnaCijena: event.target.value })
                    }
                    className='font-body rounded-xl border border-[#2a3734] bg-[#111716] px-4 py-3 outline-none transition focus:border-[#0d9488] sm:col-span-2'
                  />
                  <p className='font-body rounded-xl border border-[#2a3734] bg-[#111716] px-4 py-3 text-sm text-[#d5dfdd] sm:col-span-2'>
                    {formatIznosEurHr(total)}
                  </p>
                  <button
                    type='button'
                    onClick={() =>
                      setItems((previous) =>
                        previous.length === 1
                          ? previous
                          : previous.filter((row) => row.id !== item.id),
                      )
                    }
                    disabled={items.length === 1}
                    className='rounded-xl border border-red-500/30 text-red-200 disabled:opacity-40'
                  >
                    ×
                  </button>
                </div>
              );
            })}
            <p className='font-body rounded-xl border border-[#0d9488]/40 bg-[#0d9488]/10 px-4 py-3 text-right text-lg font-semibold'>
              Ukupno ponuda: {formatIznosEurHr(ukupno)}
            </p>
          </section>

          <label className='block'>
            <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>Napomena</span>
            <textarea
              rows={3}
              value={formState.napomena}
              onChange={(event) =>
                setFormState((previous) => ({
                  ...previous,
                  napomena: event.target.value,
                }))
              }
              className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
            />
          </label>

          {error ? (
            <p className='font-body rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200'>
              {error}
            </p>
          ) : null}

          <div className='flex flex-wrap gap-3'>
            <button
              type='submit'
              disabled={isLoading}
              className='font-body rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-60'
            >
              {isLoading ? 'Spremam...' : 'Spremi ponudu'}
            </button>
            <Link
              href='/ponude'
              className='font-body rounded-xl border border-[#2a3734] px-5 py-3 text-[#d5dfdd] transition hover:border-[#0d9488]'
            >
              Odustani
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

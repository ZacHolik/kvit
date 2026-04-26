'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useState } from 'react';

import { formatIznosEurHr } from '@/lib/format-hr';
import { createClient } from '@/lib/supabase/client';

type FormState = {
  brojRacuna: string;
  datum: string;
  datumPlacanja: string;
  nacinPlacanja: 'ziro' | 'gotovina' | 'kartica';
  status: 'izdano' | 'placeno' | 'stornirano';
  napomena: string;
  kupacNaziv: string;
  kupacOib: string;
  kupacAdresa: string;
  kupacEmail: string;
};

type InvoiceItemForm = {
  id: string;
  opis: string;
  kolicina: string;
  jedinicnaCijena: string;
};

type SavedCustomer = {
  id: string;
  naziv: string;
  oib: string | null;
  adresa: string | null;
  email: string | null;
};

type SavedArticle = {
  id: string;
  naziv: string;
  jedinicna_cijena: number | string;
};

function createEmptyItem(): InvoiceItemForm {
  return {
    id: crypto.randomUUID(),
    opis: '',
    kolicina: '1',
    jedinicnaCijena: '0',
  };
}

export default function NoviRacunPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedCustomers, setSavedCustomers] = useState<SavedCustomer[]>([]);
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [items, setItems] = useState<InvoiceItemForm[]>([createEmptyItem()]);
  const [formState, setFormState] = useState<FormState>({
    brojRacuna: '',
    datum: new Date().toISOString().slice(0, 10),
    datumPlacanja: '',
    nacinPlacanja: 'ziro',
    status: 'izdano',
    napomena: '',
    kupacNaziv: '',
    kupacOib: '',
    kupacAdresa: '',
    kupacEmail: '',
  });

  const ukupno = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum +
        (Number(item.kolicina) || 0) * (Number(item.jedinicnaCijena) || 0),
      0,
    );
  }, [items]);

  useEffect(() => {
    let cancelled = false;

    async function loadReusableData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) {
        return;
      }

      const [{ data: kupci }, { data: artikli }] = await Promise.all([
        supabase
          .from('kupci')
          .select('id, naziv, oib, adresa, email')
          .eq('user_id', user.id)
          .order('naziv', { ascending: true }),
        supabase
          .from('artikli')
          .select('id, naziv, jedinicna_cijena')
          .eq('user_id', user.id)
          .order('naziv', { ascending: true }),
      ]);

      if (!cancelled) {
        setSavedCustomers((kupci ?? []) as SavedCustomer[]);
        setSavedArticles((artikli ?? []) as SavedArticle[]);
      }
    }

    void loadReusableData();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  // Sljedeći broj računa za paušal (broj-godina), ako polje još nije ručno popunjeno.
  useEffect(() => {
    let cancelled = false;

    async function suggestBrojRacuna() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) {
        return;
      }

      const { count, error } = await supabase
        .from('racuni')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (cancelled) {
        return;
      }

      const brojPostojecih = error ? 0 : (count ?? 0);
      const godina = new Date().getFullYear();
      const prijedlog = `${brojPostojecih + 1}-${godina}`;

      setFormState((previous) =>
        previous.brojRacuna.trim() !== ''
          ? previous
          : { ...previous, brojRacuna: prijedlog },
      );
    }

    void suggestBrojRacuna();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  function updateItem(id: string, patch: Partial<InvoiceItemForm>) {
    setItems((previous) =>
      previous.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function addItem() {
    setItems((previous) => [...previous, createEmptyItem()]);
  }

  function removeItem(id: string) {
    setItems((previous) =>
      previous.length === 1 ? previous : previous.filter((item) => item.id !== id),
    );
  }

  function applyCustomerByName(name: string) {
    const customer = savedCustomers.find(
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

  function applyArticleByName(itemId: string, name: string) {
    const article = savedArticles.find(
      (item) => item.naziv.toLocaleLowerCase() === name.toLocaleLowerCase(),
    );
    if (!article) {
      return;
    }
    updateItem(itemId, {
      opis: article.naziv,
      jedinicnaCijena: String(article.jedinicna_cijena ?? 0),
    });
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
          item.opis.length > 0 &&
          Number.isFinite(item.kolicina) &&
          item.kolicina > 0 &&
          Number.isFinite(item.jedinicnaCijena) &&
          item.jedinicnaCijena >= 0,
      );

    if (payloadItems.length === 0) {
      setError('Dodaj barem jednu ispravnu stavku računa.');
      return;
    }

    setIsLoading(true);

    const response = await fetch('/api/racuni', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brojRacuna: formState.brojRacuna,
        datum: formState.datum,
        datumPlacanja: formState.datumPlacanja || undefined,
        nacinPlacanja: formState.nacinPlacanja,
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
      const payload = (await response.json()) as { error?: string };
      setError(payload.error || 'Dogodila se greška prilikom spremanja.');
      return;
    }

    router.push('/racuni');
    router.refresh();
  };

  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-8 text-[#e2e8e7] sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-3xl flex-col gap-6'>
        <header className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          <p className='font-body text-sm text-[#94a3a0]'>
            Kreiranje dokumenta
          </p>
          <h1 className='font-heading mt-2 text-2xl sm:text-3xl'>Novi račun</h1>
        </header>

        <form
          onSubmit={handleSubmit}
          className='space-y-6 rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'
        >
          <section className='grid gap-4 sm:grid-cols-2'>
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Broj računa
              </span>
              <input
                required
                value={formState.brojRacuna}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    brojRacuna: event.target.value,
                  }))
                }
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                placeholder='1-2026'
              />
              <span className='font-body mt-1 block text-xs text-[#64756f]'>
                Format: redni-broj/godina (npr. 1-2026, 2-2026...)
              </span>
            </label>
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Datum izdavanja
              </span>
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
          </section>

          <section className='grid gap-4 sm:grid-cols-3'>
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Način plaćanja
              </span>
              <select
                value={formState.nacinPlacanja}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    nacinPlacanja: event.target
                      .value as FormState['nacinPlacanja'],
                  }))
                }
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              >
                <option value='ziro'>Žiro</option>
                <option value='gotovina'>Gotovina</option>
                <option value='kartica'>Kartica</option>
              </select>
            </label>
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Status
              </span>
              <select
                value={formState.status}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    status: event.target.value as FormState['status'],
                  }))
                }
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              >
                <option value='izdano'>Izdano</option>
                <option value='placeno'>Plaćeno</option>
                <option value='stornirano'>Stornirano</option>
              </select>
            </label>
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Datum plaćanja
              </span>
              <input
                type='date'
                value={formState.datumPlacanja}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    datumPlacanja: event.target.value,
                  }))
                }
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              />
            </label>
          </section>

          <section className='grid gap-4 sm:grid-cols-2'>
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Kupac naziv
              </span>
              <input
                required
                value={formState.kupacNaziv}
                list='kupci-suggestions'
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setFormState((previous) => ({
                    ...previous,
                    kupacNaziv: nextValue,
                  }));
                  applyCustomerByName(nextValue);
                }}
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              />
              <datalist id='kupci-suggestions'>
                {savedCustomers.map((customer) => (
                  <option key={customer.id} value={customer.naziv} />
                ))}
              </datalist>
            </label>
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Kupac OIB
              </span>
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
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Kupac adresa
              </span>
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
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Kupac email
              </span>
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
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <h2 className='font-heading text-lg text-[#e2e8e7]'>Stavke</h2>
                <p className='font-body mt-1 text-sm text-[#94a3a0]'>
                  Stavke se automatski spremaju u katalog za sljedeći račun.
                </p>
              </div>
              <button
                type='button'
                onClick={addItem}
                className='font-body rounded-xl border border-[#0d9488] px-4 py-2 text-sm font-semibold text-[#5eead4] transition hover:bg-[#0d9488]/10'
              >
                + Dodaj stavku
              </button>
            </div>

            <datalist id='artikli-suggestions'>
              {savedArticles.map((article) => (
                <option key={article.id} value={article.naziv} />
              ))}
            </datalist>

            {items.map((item, index) => {
              const itemTotal =
                (Number(item.kolicina) || 0) *
                (Number(item.jedinicnaCijena) || 0);
              return (
                <div
                  key={item.id}
                  className='grid gap-3 rounded-2xl border border-[#24312f] bg-[#0b0f0e] p-4 sm:grid-cols-12'
                >
                  <label className='block sm:col-span-5'>
                    <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                      Opis stavke
                    </span>
                    <input
                      required
                      list='artikli-suggestions'
                      value={item.opis}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        updateItem(item.id, { opis: nextValue });
                        applyArticleByName(item.id, nextValue);
                      }}
                      className='font-body w-full rounded-xl border border-[#2a3734] bg-[#111716] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                      placeholder={`Stavka ${index + 1}`}
                    />
                  </label>
                  <label className='block sm:col-span-2'>
                    <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                      Količina
                    </span>
                    <input
                      required
                      type='number'
                      min='0'
                      step='0.01'
                      value={item.kolicina}
                      onChange={(event) =>
                        updateItem(item.id, { kolicina: event.target.value })
                      }
                      className='font-body w-full rounded-xl border border-[#2a3734] bg-[#111716] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                    />
                  </label>
                  <label className='block sm:col-span-2'>
                    <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                      Jed. cijena
                    </span>
                    <input
                      required
                      type='number'
                      min='0'
                      step='0.01'
                      value={item.jedinicnaCijena}
                      onChange={(event) =>
                        updateItem(item.id, {
                          jedinicnaCijena: event.target.value,
                        })
                      }
                      className='font-body w-full rounded-xl border border-[#2a3734] bg-[#111716] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                    />
                  </label>
                  <div className='flex flex-col justify-end sm:col-span-2'>
                    <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                      Ukupno
                    </span>
                    <p className='font-body rounded-xl border border-[#2a3734] bg-[#111716] px-4 py-3 text-sm text-[#d5dfdd]'>
                      {formatIznosEurHr(itemTotal)}
                    </p>
                  </div>
                  <div className='flex items-end sm:col-span-1'>
                    <button
                      type='button'
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className='font-body h-12 w-full rounded-xl border border-red-500/30 text-red-200 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40'
                      aria-label='Ukloni stavku'
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}

            <p className='font-body rounded-xl border border-[#0d9488]/40 bg-[#0d9488]/10 px-4 py-3 text-right text-lg font-semibold text-[#e2e8e7]'>
              Ukupno račun: {formatIznosEurHr(ukupno)}
            </p>
          </section>

          <label className='block'>
            <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
              Napomena
            </span>
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

          <div className='flex flex-wrap items-center gap-3'>
            <button
              type='submit'
              disabled={isLoading}
              className='font-body rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-60'
            >
              {isLoading ? 'Spremam...' : 'Spremi račun'}
            </button>
            <Link
              href='/racuni'
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

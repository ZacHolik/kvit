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
  popust: string;
};

type Customer = {
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

type OfferRow = {
  id: string;
  broj_ponude: string;
  datum: string;
  datum_valjanosti: string | null;
  kupac_naziv: string;
  kupac_oib: string | null;
  kupac_adresa: string | null;
  kupac_email: string | null;
  status: OfferStatus;
  popust_racun: number | string | null;
  rok_placanja: string | null;
  datum_dospijeca: string | null;
  dostava_iznos: number | string | null;
  dostava_opis: string | null;
  napomena: string | null;
};

type OfferItemRow = {
  id: string;
  opis: string;
  kolicina: number | string;
  jedinicna_cijena: number | string;
  popust: number | string | null;
};

const PAYMENT_TERMS = [0, 7, 10, 15, 20, 30, 60, 90] as const;

function createItem(): Item {
  return {
    id: crypto.randomUUID(),
    opis: '',
    kolicina: '1',
    jedinicnaCijena: '0',
    popust: '0',
  };
}

function addDaysToIsoDate(date: string, days: number) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }
  parsed.setDate(parsed.getDate() + days);
  return parsed.toISOString().slice(0, 10);
}

function clampPercent(value: string | number) {
  return Math.min(Math.max(Number(value) || 0, 0), 100);
}

function calculateItemTotal(item: Item) {
  return (
    (Number(item.kolicina) || 0) *
    (Number(item.jedinicnaCijena) || 0) *
    (1 - clampPercent(item.popust) / 100)
  );
}

export default function UrediPonuduPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [articleSuggestions, setArticleSuggestions] = useState<
    Record<string, SavedArticle[]>
  >({});
  const [activeArticleItemId, setActiveArticleItemId] = useState<string | null>(
    null,
  );
  const [items, setItems] = useState<Item[]>([createItem()]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [formState, setFormState] = useState({
    brojPonude: '',
    datum: new Date().toISOString().slice(0, 10),
    datumValjanosti: '',
    status: 'poslana' as OfferStatus,
    kupacNaziv: '',
    kupacOib: '',
    kupacAdresa: '',
    kupacEmail: '',
    popustRacun: '0',
    rokPlacanja: '15 dana',
    datumDospijeca: addDaysToIsoDate(new Date().toISOString().slice(0, 10), 15),
    dodajDostavu: false,
    dostavaOpis: 'Troškovi dostave',
    dostavaIznos: '0',
    napomena: '',
  });

  const totals = useMemo(() => {
    const meduzbrojPrijePopusta = items.reduce(
      (sum, item) =>
        sum +
        (Number(item.kolicina) || 0) * (Number(item.jedinicnaCijena) || 0),
      0,
    );
    const meduzbroj = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    const popustStavke = meduzbrojPrijePopusta - meduzbroj;
    const popustPostotak = clampPercent(formState.popustRacun);
    const popustIznos = meduzbroj * (popustPostotak / 100);
    const dostavaIznos = formState.dodajDostavu
      ? Math.max(Number(formState.dostavaIznos) || 0, 0)
      : 0;
    return {
      meduzbrojPrijePopusta,
      meduzbroj,
      popustStavke,
      popustPostotak,
      popustIznos,
      dostavaIznos,
      ukupno: Math.max(meduzbroj - popustIznos + dostavaIznos, 0),
    };
  }, [formState.dodajDostavu, formState.dostavaIznos, formState.popustRacun, items]);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) {
        return;
      }
      setCurrentUserId(user.id);

      const [{ data: ponuda }, { data: stavke }, { data: kupci }, { data: artikli }] =
        await Promise.all([
          supabase
            .from('ponude')
            .select(
              'id, broj_ponude, datum, datum_valjanosti, kupac_naziv, kupac_oib, kupac_adresa, kupac_email, status, popust_racun, rok_placanja, datum_dospijeca, dostava_iznos, dostava_opis, napomena',
            )
            .eq('id', params.id)
            .eq('user_id', user.id)
            .single(),
          supabase
            .from('ponuda_items')
            .select('id, opis, kolicina, jedinicna_cijena, popust')
            .eq('ponuda_id', params.id),
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

      if (cancelled) {
        return;
      }

      if (!ponuda) {
        setError('Ponuda nije pronađena.');
        setIsInitialLoading(false);
        return;
      }

      const offer = ponuda as OfferRow;
      setCustomers((kupci ?? []) as Customer[]);
      setSavedArticles((artikli ?? []) as SavedArticle[]);
      setItems(
        ((stavke ?? []) as OfferItemRow[]).map((item) => ({
          id: item.id,
          opis: item.opis,
          kolicina: String(item.kolicina ?? 1),
          jedinicnaCijena: String(item.jedinicna_cijena ?? 0),
          popust: String(item.popust ?? 0),
        })),
      );
      if ((stavke ?? []).length === 0) {
        setItems([createItem()]);
      }
      setFormState({
        brojPonude: offer.broj_ponude,
        datum: offer.datum,
        datumValjanosti: offer.datum_valjanosti ?? '',
        status: offer.status,
        kupacNaziv: offer.kupac_naziv,
        kupacOib: offer.kupac_oib ?? '',
        kupacAdresa: offer.kupac_adresa ?? '',
        kupacEmail: offer.kupac_email ?? '',
        popustRacun: String(offer.popust_racun ?? 0),
        rokPlacanja: offer.rok_placanja ?? '15 dana',
        datumDospijeca:
          offer.datum_dospijeca ??
          addDaysToIsoDate(offer.datum, Number.parseInt(offer.rok_placanja ?? '', 10) || 15),
        dodajDostavu: Number(offer.dostava_iznos ?? 0) > 0,
        dostavaOpis: offer.dostava_opis ?? 'Troškovi dostave',
        dostavaIznos: String(offer.dostava_iznos ?? 0),
        napomena: offer.napomena ?? '',
      });
      setIsInitialLoading(false);
    }

    void loadData();
    return () => {
      cancelled = true;
    };
  }, [params.id, supabase]);

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

  async function searchArticles(itemId: string, query: string) {
    const q = query.trim();
    if (q.length < 2) {
      setArticleSuggestions((previous) => ({ ...previous, [itemId]: [] }));
      return;
    }

    const localMatches = savedArticles
      .filter((article) =>
        article.naziv.toLocaleLowerCase().includes(q.toLocaleLowerCase()),
      )
      .slice(0, 8);
    setArticleSuggestions((previous) => ({ ...previous, [itemId]: localMatches }));

    const userId =
      currentUserId ||
      (await supabase.auth.getUser()).data.user?.id ||
      null;
    if (!userId) {
      return;
    }

    const { data, error: searchError } = await supabase
      .from('artikli')
      .select('id, naziv, jedinicna_cijena')
      .eq('user_id', userId)
      .ilike('naziv', `%${q}%`)
      .order('naziv', { ascending: true })
      .limit(8);

    setArticleSuggestions((previous) => ({
      ...previous,
      [itemId]: searchError ? [] : ((data ?? []) as SavedArticle[]),
    }));
  }

  function handleItemOpisChange(itemId: string, nextValue: string) {
    updateItem(itemId, { opis: nextValue });
    applyArticleByName(itemId, nextValue);
    setActiveArticleItemId(itemId);
    void searchArticles(itemId, nextValue);
  }

  function selectArticle(itemId: string, article: SavedArticle) {
    updateItem(itemId, {
      opis: article.naziv,
      jedinicnaCijena: String(article.jedinicna_cijena ?? 0),
    });
    setActiveArticleItemId(null);
    setArticleSuggestions((previous) => ({ ...previous, [itemId]: [] }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const payloadItems = items
      .map((item) => ({
        opis: item.opis.trim(),
        kolicina: Number(item.kolicina),
        jedinicnaCijena: Number(item.jedinicnaCijena),
        popust: clampPercent(item.popust),
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
    const response = await fetch(`/api/ponude/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brojPonude: formState.brojPonude,
        datum: formState.datum,
        datumValjanosti: formState.datumValjanosti || undefined,
        status: formState.status,
        popustRacun: totals.popustPostotak,
        rokPlacanja: formState.rokPlacanja,
        datumDospijeca: formState.datumDospijeca,
        dostava: {
          enabled: formState.dodajDostavu,
          opis: formState.dostavaOpis,
          iznos: Number(formState.dostavaIznos) || 0,
        },
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

  if (isInitialLoading) {
    return (
      <main className='min-h-screen bg-[#0b0f0e] px-4 py-8 text-[#e2e8e7] sm:px-6 lg:px-8'>
        <div className='mx-auto w-full max-w-4xl rounded-2xl border border-[#1f2a28] bg-[#111716] p-6'>
          <p className='font-body text-sm text-[#94a3a0]'>Učitavam ponudu...</p>
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-8 text-[#e2e8e7] sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-4xl flex-col gap-6'>
        <header className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          <p className='font-body text-sm text-[#94a3a0]'>Ponuda</p>
          <h1 className='font-heading mt-2 text-2xl sm:text-3xl'>Uredi ponudu</h1>
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
                    datumDospijeca: addDaysToIsoDate(
                      event.target.value,
                      Number.parseInt(previous.rokPlacanja, 10) || 0,
                    ),
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

          <section className='grid gap-4 sm:grid-cols-2'>
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Rok plaćanja
              </span>
              <select
                value={formState.rokPlacanja}
                onChange={(event) => {
                  const value = event.target.value;
                  const days = Number.parseInt(value, 10) || 0;
                  setFormState((previous) => ({
                    ...previous,
                    rokPlacanja: value,
                    datumDospijeca: addDaysToIsoDate(previous.datum, days),
                  }));
                }}
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              >
                {PAYMENT_TERMS.map((days) => (
                  <option key={days} value={days === 0 ? 'Odmah' : `${days} dana`}>
                    {days === 0 ? 'Odmah' : `${days} dana`}
                  </option>
                ))}
              </select>
              <span className='font-body mt-1 block text-xs text-[#64756f]'>
                Datum dospijeća: {formState.datumDospijeca || '—'}
              </span>
            </label>
            <label className='block'>
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
          </section>

          <section className='grid gap-4 sm:grid-cols-2'>
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Kupac naziv
              </span>
              <input
                required
                list='ponuda-edit-kupci'
                value={formState.kupacNaziv}
                onChange={(event) => {
                  const value = event.target.value;
                  setFormState((previous) => ({ ...previous, kupacNaziv: value }));
                  applyCustomerByName(value);
                }}
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              />
              <datalist id='ponuda-edit-kupci'>
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
              const undiscountedTotal =
                (Number(item.kolicina) || 0) * (Number(item.jedinicnaCijena) || 0);
              const total = calculateItemTotal(item);
              const suggestions = articleSuggestions[item.id] ?? [];
              return (
                <div
                  key={item.id}
                  className='space-y-4 rounded-2xl border border-[#24312f] bg-[#0b0f0e] p-4'
                >
                  <label className='relative block'>
                    <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                      Opis stavke
                    </span>
                    <input
                      required
                      value={item.opis}
                      onFocus={() => {
                        setActiveArticleItemId(item.id);
                        void searchArticles(item.id, item.opis);
                      }}
                      onChange={(event) => {
                        handleItemOpisChange(item.id, event.target.value);
                      }}
                      onBlur={() => {
                        window.setTimeout(() => {
                          setActiveArticleItemId((activeId) =>
                            activeId === item.id ? null : activeId,
                          );
                        }, 120);
                      }}
                      className='font-body w-full rounded-xl border border-[#2a3734] bg-[#111716] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                      placeholder={`Stavka ${index + 1}`}
                    />
                    {activeArticleItemId === item.id && suggestions.length > 0 ? (
                      <div className='absolute left-0 right-0 top-full z-20 mt-2 max-h-56 overflow-y-auto rounded-xl border border-[#2a3734] bg-[#111716] shadow-xl shadow-black/30'>
                        {suggestions.map((article) => (
                          <button
                            key={article.id}
                            type='button'
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => selectArticle(item.id, article)}
                            className='flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm text-[#d5dfdd] transition hover:bg-[#1f2a28]'
                          >
                            <span>{article.naziv}</span>
                            <span className='shrink-0 text-[#5eead4]'>
                              {formatIznosEurHr(
                                Number(article.jedinicna_cijena ?? 0),
                              )}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </label>
                  <div className='grid gap-3 sm:grid-cols-[1fr_1fr_1fr_1.35fr_3rem]'>
                    <label className='block'>
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
                    <label className='block'>
                      <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                        Jed. cijena (€)
                      </span>
                      <input
                        required
                        type='number'
                        min='0'
                        step='0.01'
                        value={item.jedinicnaCijena}
                        onChange={(event) =>
                          updateItem(item.id, { jedinicnaCijena: event.target.value })
                        }
                        className='font-body w-full rounded-xl border border-[#2a3734] bg-[#111716] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                      />
                    </label>
                    <label className='block'>
                      <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                        Popust (%)
                      </span>
                      <input
                        type='number'
                        min='0'
                        max='100'
                        step='0.5'
                        value={item.popust}
                        onChange={(event) =>
                          updateItem(item.id, { popust: event.target.value })
                        }
                        className='font-body w-full rounded-xl border border-[#2a3734] bg-[#111716] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                      />
                    </label>
                    <div className='flex flex-col justify-end'>
                      <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                        Ukupno
                      </span>
                      <div className='font-body min-h-12 rounded-xl border border-[#2a3734] bg-[#111716] px-4 py-3 text-sm text-[#d5dfdd]'>
                        <p>{formatIznosEurHr(total)}</p>
                        {clampPercent(item.popust) > 0 ? (
                          <p className='mt-1 text-xs text-[#94a3a0]'>
                            Prije popusta: {formatIznosEurHr(undiscountedTotal)}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className='flex items-end'>
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
                        className='h-12 w-full rounded-xl border border-red-500/30 text-red-200 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40'
                        aria-label='Ukloni stavku'
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className='space-y-3 rounded-xl border border-[#2a3734] bg-[#0b0f0e] p-4'>
              <label className='block max-w-xs'>
                <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                  Popust na cijelu ponudu (%)
                </span>
                <input
                  type='number'
                  min='0'
                  max='100'
                  step='0.5'
                  value={formState.popustRacun}
                  onChange={(event) =>
                    setFormState((previous) => ({
                      ...previous,
                      popustRacun: event.target.value,
                    }))
                  }
                  className='font-body w-full rounded-xl border border-[#2a3734] bg-[#111716] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                />
              </label>
              <label className='font-body flex items-center gap-3 text-sm text-[#d5dfdd]'>
                <input
                  type='checkbox'
                  checked={formState.dodajDostavu}
                  onChange={(event) =>
                    setFormState((previous) => ({
                      ...previous,
                      dodajDostavu: event.target.checked,
                    }))
                  }
                  className='h-4 w-4 accent-[#0d9488]'
                />
                Dodaj trošak dostave/prijevoza
              </label>
              {formState.dodajDostavu ? (
                <div className='grid gap-3 sm:grid-cols-2'>
                  <input
                    value={formState.dostavaOpis}
                    onChange={(event) =>
                      setFormState((previous) => ({
                        ...previous,
                        dostavaOpis: event.target.value,
                      }))
                    }
                    className='font-body rounded-xl border border-[#2a3734] bg-[#111716] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                    placeholder='Opis dostave'
                  />
                  <input
                    type='number'
                    min='0'
                    step='0.01'
                    value={formState.dostavaIznos}
                    onChange={(event) =>
                      setFormState((previous) => ({
                        ...previous,
                        dostavaIznos: event.target.value,
                      }))
                    }
                    className='font-body rounded-xl border border-[#2a3734] bg-[#111716] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                    placeholder='Iznos (€)'
                  />
                </div>
              ) : null}
              <div className='font-body space-y-2 text-sm text-[#d5dfdd]'>
                <p className='flex justify-between gap-4'>
                  <span>Međuzbroj:</span>
                  <span>{formatIznosEurHr(totals.meduzbrojPrijePopusta)}</span>
                </p>
                <p className='flex justify-between gap-4'>
                  <span>Popust na stavke:</span>
                  <span>-{formatIznosEurHr(totals.popustStavke)}</span>
                </p>
                <p className='flex justify-between gap-4'>
                  <span>Popust na ponudu:</span>
                  <span>-{formatIznosEurHr(totals.popustIznos)}</span>
                </p>
                {formState.dodajDostavu ? (
                  <p className='flex justify-between gap-4'>
                    <span>Dostava:</span>
                    <span>+{formatIznosEurHr(totals.dostavaIznos)}</span>
                  </p>
                ) : null}
                <p className='flex justify-between gap-4 border-t border-[#2a3734] pt-3 text-lg font-semibold text-[#e2e8e7]'>
                  <span>UKUPNO:</span>
                  <span>{formatIznosEurHr(totals.ukupno)}</span>
                </p>
              </div>
            </div>
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
              {isLoading ? 'Spremam...' : 'Spremi promjene'}
            </button>
            <Link
              href='/ponude'
              className='font-body rounded-xl border border-[#2a3734] px-5 py-3 text-[#d5dfdd] transition hover:border-[#0d9488]'
            >
              Natrag
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

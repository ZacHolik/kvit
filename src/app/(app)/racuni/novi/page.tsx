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
  tipRacuna: 'R1' | 'R2' | 'bez_oznake';
  dodajBarkodPlacanja: boolean;
  recurring: boolean;
  recurringInterval: 'mjesecno' | 'kvartalno' | 'godisnje';
  popustRacun: string;
  rokPlacanja: string;
  datumDospijeca: string;
  dodajDostavu: boolean;
  dostavaOpis: string;
  dostavaIznos: string;
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
  popust: string;
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

type ProfilePreview = {
  naziv_obrta: string | null;
  oib: string | null;
  iban: string | null;
  adresa: string | null;
  ulica: string | null;
  postanski_broj: string | null;
  grad: string | null;
};

function createEmptyItem(): InvoiceItemForm {
  return {
    id: crypto.randomUUID(),
    opis: '',
    kolicina: '1',
    jedinicnaCijena: '0',
    popust: '0',
  };
}

const PAYMENT_TERMS = [0, 7, 10, 15, 20, 30, 60, 90] as const;

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

function calculateItemTotal(item: InvoiceItemForm) {
  return (
    (Number(item.kolicina) || 0) *
    (Number(item.jedinicnaCijena) || 0) *
    (1 - clampPercent(item.popust) / 100)
  );
}

export default function NoviRacunPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [savedCustomers, setSavedCustomers] = useState<SavedCustomer[]>([]);
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [articleSuggestions, setArticleSuggestions] = useState<
    Record<string, SavedArticle[]>
  >({});
  const [activeArticleItemId, setActiveArticleItemId] = useState<string | null>(
    null,
  );
  const [profile, setProfile] = useState<ProfilePreview | null>(null);
  const [items, setItems] = useState<InvoiceItemForm[]>([createEmptyItem()]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    brojRacuna: '',
    datum: new Date().toISOString().slice(0, 10),
    datumPlacanja: '',
    nacinPlacanja: 'ziro',
    status: 'izdano',
    tipRacuna: 'R1',
    dodajBarkodPlacanja: true,
    recurring: false,
    recurringInterval: 'mjesecno',
    popustRacun: '0',
    rokPlacanja: '15 dana',
    datumDospijeca: addDaysToIsoDate(new Date().toISOString().slice(0, 10), 15),
    dodajDostavu: false,
    dostavaOpis: 'Troškovi dostave',
    dostavaIznos: '0',
    napomena: '',
    kupacNaziv: '',
    kupacOib: '',
    kupacAdresa: '',
    kupacEmail: '',
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

    async function loadReusableData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) {
        return;
      }
      setCurrentUserId(user.id);

      const [{ data: kupci }, { data: artikli }, { data: profil }] = await Promise.all([
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
        supabase
          .from('profiles')
          .select('naziv_obrta, oib, iban, adresa, ulica, postanski_broj, grad')
          .eq('id', user.id)
          .maybeSingle(),
      ]);

      if (!cancelled) {
        setSavedCustomers((kupci ?? []) as SavedCustomer[]);
        setSavedArticles((artikli ?? []) as SavedArticle[]);
        setProfile(profil as ProfilePreview | null);
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
    setArticleSuggestions((previous) => ({
      ...previous,
      [itemId]: localMatches,
    }));

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

    if (process.env.NODE_ENV === 'development') {
      console.log('[racuni/novi] artikli autocomplete', {
        query: q,
        data,
        error: searchError,
      });
    }

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

  function getPayloadItems() {
    return items
      .map((item) => ({
        opis: item.opis.trim(),
        kolicina: Number(item.kolicina),
        jedinicnaCijena: Number(item.jedinicnaCijena),
        popust: clampPercent(item.popust),
      }))
      .filter(
        (item) =>
          item.opis.length > 0 &&
          Number.isFinite(item.kolicina) &&
          item.kolicina > 0 &&
          Number.isFinite(item.jedinicnaCijena) &&
          item.jedinicnaCijena >= 0,
      );
  }

  async function saveInvoice() {
    setError('');

    const payloadItems = getPayloadItems();

    if (payloadItems.length === 0) {
      setError('Dodaj barem jednu ispravnu stavku računa.');
      return false;
    }

    if (formState.tipRacuna === 'R1' && formState.kupacOib.trim().length === 0) {
      setError('R1 račun zahtijeva OIB kupca.');
      return false;
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
        tipRacuna: formState.tipRacuna,
        popustRacun: totals.popustPostotak,
        rokPlacanja: formState.rokPlacanja,
        datumDospijeca: formState.datumDospijeca,
        dostava: {
          enabled: formState.dodajDostavu,
          opis: formState.dostavaOpis,
          iznos: Number(formState.dostavaIznos) || 0,
        },
        dodajBarkodPlacanja:
          formState.nacinPlacanja === 'ziro'
            ? formState.dodajBarkodPlacanja
            : false,
        recurring: formState.recurring,
        recurringInterval: formState.recurring
          ? formState.recurringInterval
          : undefined,
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
      return false;
    }

    router.push('/racuni');
    router.refresh();
    return true;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await saveInvoice();
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
                    datumDospijeca: addDaysToIsoDate(
                      event.target.value,
                      Number.parseInt(previous.rokPlacanja, 10) || 0,
                    ),
                  }))
                }
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              />
            </label>
          </section>

          <section className='grid gap-4 sm:grid-cols-3'>
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Tip računa
              </span>
              <select
                value={formState.tipRacuna}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    tipRacuna: event.target.value as FormState['tipRacuna'],
                  }))
                }
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              >
                <option value='R1'>R1 - firme (B2B)</option>
                <option value='R2'>R2 - građani (B2C)</option>
                <option value='bez_oznake'>Bez oznake</option>
              </select>
              {formState.tipRacuna === 'R1' ? (
                <span className='font-body mt-1 block text-xs text-[#64756f]'>
                  R1 račun zahtijeva OIB kupca.
                </span>
              ) : null}
            </label>
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Način plaćanja
              </span>
              <select
                value={formState.nacinPlacanja}
                onChange={(event) => {
                  const nacin = event.target.value as FormState['nacinPlacanja'];
                  setFormState((previous) => ({
                    ...previous,
                    nacinPlacanja: nacin,
                    dodajBarkodPlacanja:
                      nacin === 'ziro' ? previous.dodajBarkodPlacanja : false,
                  }));
                }}
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              >
                <option value='ziro'>Žiro</option>
                <option value='gotovina'>Gotovina</option>
                <option value='kartica'>Kartica</option>
              </select>
            </label>
            {formState.nacinPlacanja === 'ziro' ? (
              <label className='block rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3'>
                <span className='font-body flex items-center gap-3 text-sm text-[#d5dfdd]'>
                  <input
                    type='checkbox'
                    checked={formState.dodajBarkodPlacanja}
                    onChange={(event) =>
                      setFormState((previous) => ({
                        ...previous,
                        dodajBarkodPlacanja: event.target.checked,
                      }))
                    }
                    className='h-4 w-4 accent-[#0d9488]'
                  />
                  Dodaj barkod za plaćanje
                </span>
                <span className='font-body mt-1 block text-xs text-[#64756f]'>
                  Barkod se prikazuje na PDF-u ako profil ima IBAN.
                </span>
              </label>
            ) : null}
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
            <div className='rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3'>
              <label className='font-body flex items-center gap-3 text-sm text-[#d5dfdd]'>
                <input
                  type='checkbox'
                  checked={formState.recurring}
                  onChange={(event) =>
                    setFormState((previous) => ({
                      ...previous,
                      recurring: event.target.checked,
                    }))
                  }
                  className='h-4 w-4 accent-[#0d9488]'
                />
                Ponavljajući račun
              </label>
              {formState.recurring ? (
                <label className='mt-3 block'>
                  <span className='font-body mb-2 block text-xs text-[#94a3a0]'>
                    Ponovi svaki
                  </span>
                  <select
                    value={formState.recurringInterval}
                    onChange={(event) =>
                      setFormState((previous) => ({
                        ...previous,
                        recurringInterval: event.target
                          .value as FormState['recurringInterval'],
                      }))
                    }
                    className='font-body w-full rounded-xl border border-[#2a3734] bg-[#111716] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                  >
                    <option value='mjesecno'>Mjesečno</option>
                    <option value='kvartalno'>Kvartalno</option>
                    <option value='godisnje'>Godišnje</option>
                  </select>
                </label>
              ) : null}
            </div>
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

            {items.map((item, index) => {
              const undiscountedTotal =
                (Number(item.kolicina) || 0) * (Number(item.jedinicnaCijena) || 0);
              const itemTotal = calculateItemTotal(item);
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
                      onInput={(event) => {
                        handleItemOpisChange(
                          item.id,
                          event.currentTarget.value,
                        );
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
                          updateItem(item.id, {
                            jedinicnaCijena: event.target.value,
                          })
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
                        step='0.01'
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
                      <p className='font-body min-h-12 rounded-xl border border-[#2a3734] bg-[#111716] px-4 py-3 text-sm text-[#d5dfdd]'>
                        {formatIznosEurHr(itemTotal)}
                      </p>
                      {clampPercent(item.popust) > 0 ? (
                        <span className='font-body mt-1 text-xs text-[#94a3a0]'>
                          Prije popusta: {formatIznosEurHr(undiscountedTotal)}
                        </span>
                      ) : null}
                    </div>
                    <div className='flex items-end'>
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
                </div>
              );
            })}

            <div className='space-y-3 rounded-xl border border-[#2a3734] bg-[#0b0f0e] p-4'>
              <label className='block max-w-xs'>
                <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                  Popust na cijeli račun (%)
                </span>
                <input
                  type='number'
                  min='0'
                  max='100'
                  step='0.01'
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
                  <label className='block'>
                    <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                      Opis dostave
                    </span>
                    <input
                      value={formState.dostavaOpis}
                      onChange={(event) =>
                        setFormState((previous) => ({
                          ...previous,
                          dostavaOpis: event.target.value,
                        }))
                      }
                      className='font-body w-full rounded-xl border border-[#2a3734] bg-[#111716] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                    />
                  </label>
                  <label className='block'>
                    <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                      Iznos (€)
                    </span>
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
                      className='font-body w-full rounded-xl border border-[#2a3734] bg-[#111716] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                    />
                  </label>
                </div>
              ) : null}
              <div className='font-body space-y-2 text-sm text-[#d5dfdd]'>
                <p className='flex justify-between gap-4'>
                  <span>Međuzbrojak:</span>
                  <span>{formatIznosEurHr(totals.meduzbrojPrijePopusta)}</span>
                </p>
                <p className='flex justify-between gap-4'>
                  <span>Popust na stavke:</span>
                  <span>-{formatIznosEurHr(totals.popustStavke)}</span>
                </p>
                <p className='flex justify-between gap-4'>
                  <span>Popust na račun:</span>
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
              type='button'
              onClick={() => setPreviewOpen(true)}
              className='font-body rounded-xl border border-[#0d9488] px-5 py-3 font-semibold text-[#5eead4] transition hover:bg-[#0d9488]/10'
            >
              Pregled
            </button>
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

        {profile?.iban ? (
          <p className='font-body rounded-xl border border-[#0d9488]/40 bg-[#0d9488]/10 px-4 py-3 text-sm text-[#b9c7c4]'>
            IBAN za plaćanje:{' '}
            <span className='font-semibold text-[#e2e8e7]'>
              {profile.iban.replace(/\s/g, '')}
            </span>
          </p>
        ) : (
          <p className='font-body rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100'>
            ⚠️ Dodaj IBAN u{' '}
            <Link href='/postavke' className='font-semibold underline'>
              Postavkama
            </Link>{' '}
            da bi barkod bio vidljiv na PDF-u.
          </p>
        )}

        {previewOpen ? (
          <div className='fixed inset-0 z-50 overflow-y-auto bg-black/70 px-4 py-8'>
            <div className='mx-auto max-w-4xl rounded-2xl border border-[#1f2a28] bg-[#0b0f0e] p-4 shadow-2xl sm:p-6'>
              <div className='flex flex-wrap items-center justify-between gap-3 border-b border-[#1f2a28] pb-4'>
                <h2 className='font-heading text-xl text-[#e2e8e7]'>
                  Pregled računa
                </h2>
                <div className='flex flex-wrap gap-2'>
                  <button
                    type='button'
                    onClick={() => setPreviewOpen(false)}
                    className='font-body rounded-xl border border-[#2a3734] px-4 py-2 text-sm text-[#d5dfdd] transition hover:border-[#0d9488]'
                  >
                    Zatvori
                  </button>
                  <button
                    type='button'
                    onClick={() => void saveInvoice()}
                    disabled={isLoading}
                    className='font-body rounded-xl bg-[#0d9488] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-60'
                  >
                    {isLoading ? 'Spremam...' : 'Spremi račun'}
                  </button>
                </div>
              </div>

              <div className='mt-6 rounded-xl bg-white p-6 font-sans text-[#111] sm:p-8'>
                <div className='flex flex-col justify-between gap-6 border-b border-black pb-5 sm:flex-row'>
                  <div>
                    <p className='font-bold'>{profile?.naziv_obrta || 'Moj obrt'}</p>
                    <p className='text-sm'>
                      {profile?.ulica || profile?.adresa || '—'}
                    </p>
                    {profile?.postanski_broj || profile?.grad ? (
                      <p className='text-sm'>
                        {[profile?.postanski_broj, profile?.grad]
                          .filter(Boolean)
                          .join(' ')}
                      </p>
                    ) : null}
                    <p className='text-sm'>OIB: {profile?.oib || '—'}</p>
                    {profile?.iban ? (
                      <p className='text-sm'>IBAN: {profile.iban}</p>
                    ) : null}
                  </div>
                  <div className='text-left sm:text-right'>
                    <p className='text-xl font-bold'>Račun</p>
                    {formState.tipRacuna !== 'bez_oznake' ? (
                      <p className='text-sm font-semibold'>{formState.tipRacuna}</p>
                    ) : null}
                    <p className='text-sm'>Broj: {formState.brojRacuna || '—'}</p>
                    <p className='text-sm'>Datum: {formState.datum || '—'}</p>
                  </div>
                </div>

                <section className='mt-5'>
                  <h3 className='font-bold'>Kupac</h3>
                  <p className='mt-2 text-sm'>{formState.kupacNaziv || '—'}</p>
                  <p className='text-sm'>OIB: {formState.kupacOib || '—'}</p>
                  <p className='text-sm'>{formState.kupacAdresa || '—'}</p>
                  <p className='text-sm'>E-mail: {formState.kupacEmail || '—'}</p>
                </section>

                <table className='mt-6 w-full border-collapse text-sm'>
                  <thead>
                    <tr className='border-b border-black text-left'>
                      <th className='py-2'>Opis</th>
                      <th className='py-2 text-right'>Količina</th>
                      <th className='py-2 text-right'>Jed. cijena</th>
                      <th className='py-2 text-right'>Ukupno</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      const itemTotal = calculateItemTotal(item);
                      return (
                        <tr key={item.id} className='border-b border-gray-300'>
                          <td className='py-2 pr-3'>{item.opis || '—'}</td>
                          <td className='py-2 text-right'>
                            {Number(item.kolicina) || 0}
                          </td>
                          <td className='py-2 text-right'>
                            {formatIznosEurHr(Number(item.jedinicnaCijena) || 0)}
                          </td>
                          <td className='py-2 text-right'>
                            {formatIznosEurHr(itemTotal)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className='mt-6 space-y-1 border-t border-black pt-4 text-right text-sm'>
                  <p>
                    Međuzbrojak:{' '}
                    {formatIznosEurHr(totals.meduzbrojPrijePopusta)}
                  </p>
                  <p>Popust na stavke: -{formatIznosEurHr(totals.popustStavke)}</p>
                  <p>Popust na račun: -{formatIznosEurHr(totals.popustIznos)}</p>
                  {formState.dodajDostavu ? (
                    <p>Dostava: +{formatIznosEurHr(totals.dostavaIznos)}</p>
                  ) : null}
                  <p className='text-lg font-bold'>
                    UKUPNO: {formatIznosEurHr(totals.ukupno)}
                  </p>
                </div>
                {formState.napomena ? (
                  <p className='mt-4 text-sm'>Napomena: {formState.napomena}</p>
                ) : null}
                <p className='mt-10 border-t border-gray-400 pt-3 text-xs text-gray-700'>
                  Sukladno članku 90. Zakona o porezu na dodanu vrijednost,
                  izdavatelj računa nije u sustavu PDV-a te PDV nije obračunat.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

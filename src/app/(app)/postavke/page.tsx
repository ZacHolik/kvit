'use client';

import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { formatDatumHr, formatIznosEurHr } from '@/lib/format-hr';
import { OPCINE, type Opcina } from '@/lib/opcine';
import { createClient } from '@/lib/supabase/client';

type ProfileForm = {
  nazivObrta: string;
  oib: string;
  iban: string;
  ulica: string;
  postanskiBroj: string;
  grad: string;
  opcina: string;
  sifraOpcine: string;
  adresaIsta: boolean;
  vlasnikIme: string;
  vlasnikUlica: string;
  vlasnikPostanskiBroj: string;
  vlasnikGrad: string;
  vlasnikOpcina: string;
  vlasnikSifraOpcine: string;
  vlasnikIspostavaPu: string;
  jeJedinaDjelatnost: boolean;
  godisnjiPrimiciProsleGodine: string;
  ispostavaPorezne: string;
};

const EMPTY_FORM: ProfileForm = {
  nazivObrta: '',
  oib: '',
  iban: '',
  ulica: '',
  postanskiBroj: '',
  grad: '',
  opcina: '',
  sifraOpcine: '',
  adresaIsta: true,
  vlasnikIme: '',
  vlasnikUlica: '',
  vlasnikPostanskiBroj: '',
  vlasnikGrad: '',
  vlasnikOpcina: '',
  vlasnikSifraOpcine: '',
  vlasnikIspostavaPu: '',
  jeJedinaDjelatnost: true,
  godisnjiPrimiciProsleGodine: '0',
  ispostavaPorezne: '',
};

function normalizeIban(value: string) {
  return value.replace(/\s/g, '').trim().toUpperCase();
}

function addressFromParts(form: ProfileForm) {
  const street = form.ulica.trim();
  const cityLine = [form.postanskiBroj.trim(), form.grad.trim()]
    .filter(Boolean)
    .join(' ');
  return [street, cityLine].filter(Boolean).join(', ');
}

/** Sprint 3: opis retka u povijesti naplate (interval iz Stripe webhooka). */
function billingOpis(interval: string | null): string {
  const base = 'Kvik Paušalist';
  if (interval === 'year') {
    return `${base} — Godišnje`;
  }
  if (interval === 'month') {
    return `${base} — Mjesečno`;
  }
  return `${base} — Probno`;
}

export default function PostavkePage() {
  const supabase = useMemo(() => createClient(), []);
  const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
  const [municipalityQuery, setMunicipalityQuery] = useState('');
  const [ownerMunicipalityQuery, setOwnerMunicipalityQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );
  const [priceLockBanner, setPriceLockBanner] = useState<{
    locked: boolean;
    amount: number | null;
  }>({ locked: false, amount: null });

  type FiscalCertApi =
    | { exists: false }
    | {
        exists: true;
        fina_oib: string;
        valid_from: string;
        valid_until: string;
        poslovni_prostor: string;
        blagajna: string;
      };

  const [fiscalCert, setFiscalCert] = useState<FiscalCertApi | null>(null);
  const [fiscalLoading, setFiscalLoading] = useState(true);
  const [fiscalDeleteConfirm, setFiscalDeleteConfirm] = useState(false);
  const [fiscalActionLoading, setFiscalActionLoading] = useState(false);

  // ── Subscription state (stripe_subscription_id: Sprint 3 plan sync nakon checkouta) ──
  type SubRow = {
    plan: string;
    status: string;
    interval: string | null;
    current_period_end: string | null;
    cancel_at_period_end: boolean | null;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
  };
  const [sub, setSub] = useState<SubRow | null>(null);
  const [subLoading, setSubLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  type BillingEventRow = {
    id: string;
    created_at: string;
    amount_eur: number;
    interval: string | null;
    status: string;
    invoice_id: string | null;
  };
  const [billingEvents, setBillingEvents] = useState<BillingEventRow[]>([]);
  const [billingLoading, setBillingLoading] = useState(true);

  const openPortal = useCallback(async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setToast({ type: 'error', message: data.error ?? 'Greška pri otvaranju portala.' });
      }
    } catch {
      setToast({ type: 'error', message: 'Mrežna greška.' });
    } finally {
      setPortalLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadFiscalCertificate() {
      try {
        const res = await fetch('/api/fiscal/certificate');
        if (cancelled) {
          return;
        }
        if (!res.ok) {
          setFiscalCert({ exists: false });
          return;
        }
        const data = (await res.json()) as FiscalCertApi | { error?: string };
        if ('error' in data && data.error === 'Unauthorized') {
          setFiscalCert({ exists: false });
          return;
        }
        setFiscalCert(data as FiscalCertApi);
      } catch {
        if (!cancelled) {
          setFiscalCert({ exists: false });
        }
      } finally {
        if (!cancelled) {
          setFiscalLoading(false);
        }
      }
    }

    void loadFiscalCertificate();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const p = new URLSearchParams(window.location.search);
    setCheckoutSuccess(p.get('checkout') === 'success');
  }, []);

  const loadSubscription = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!opts?.silent) {
        setSubLoading(true);
      }
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setSub(null);
          return;
        }
        const { data } = await supabase
          .from('subscriptions')
          .select(
            'plan, status, interval, current_period_end, cancel_at_period_end, stripe_customer_id, stripe_subscription_id',
          )
          .eq('user_id', user.id)
          .maybeSingle();
        setSub(data as SubRow | null);
      } finally {
        if (!opts?.silent) {
          setSubLoading(false);
        }
      }
    },
    [supabase],
  );

  useEffect(() => {
    void loadSubscription();
  }, [loadSubscription]);

  /** Sprint 3: polling dok webhook ne upiše stripe_subscription_id nakon checkouta. */
  useEffect(() => {
    if (!checkoutSuccess || sub?.stripe_subscription_id) {
      return;
    }
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      if (n > 15) {
        window.clearInterval(id);
        return;
      }
      void loadSubscription({ silent: true });
    }, 2000);
    return () => window.clearInterval(id);
  }, [checkoutSuccess, sub?.stripe_subscription_id, loadSubscription]);

  const loadBillingEvents = useCallback(async () => {
    setBillingLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setBillingEvents([]);
        return;
      }
      const { data, error } = await supabase
        .from('billing_events')
        .select('id, created_at, amount_eur, interval, status, invoice_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        setBillingEvents([]);
        return;
      }
      setBillingEvents((data ?? []) as BillingEventRow[]);
    } finally {
      setBillingLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void loadBillingEvents();
  }, [loadBillingEvents]);

  useEffect(() => {
    if (sub?.stripe_subscription_id) {
      void loadBillingEvents();
    }
  }, [sub?.stripe_subscription_id, loadBillingEvents]);

  const isActivating =
    checkoutSuccess && !subLoading && !sub?.stripe_subscription_id;

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select(
          'naziv_obrta, oib, iban, adresa, ulica, postanski_broj, grad, opcina, sifra_opcine, vlasnik_ime, vlasnik_ulica, vlasnik_postanski_broj, vlasnik_grad, vlasnik_sifra_opcine, vlasnik_ispostava_pu, adresa_ista, je_jedina_djelatnost, godisnji_primici_prosle_godine, ispostava_porezne, price_locked, locked_price',
        )
        .eq('id', user.id)
        .maybeSingle();

      if (cancelled) {
        return;
      }

      if (error) {
        setToast({ type: 'error', message: error.message });
      }

      const selectedOpcina = OPCINE.find(
        (opcina) => opcina.sifra === data?.sifra_opcine,
      );
      const opcinaNaziv = selectedOpcina?.naziv ?? data?.opcina ?? '';
      const selectedOwnerOpcina = OPCINE.find(
        (opcina) => opcina.sifra === data?.vlasnik_sifra_opcine,
      );
      const ownerOpcinaNaziv = selectedOwnerOpcina?.naziv ?? '';

      setForm({
        nazivObrta: data?.naziv_obrta ?? '',
        oib: data?.oib ?? '',
        iban: data?.iban ?? '',
        ulica: data?.ulica ?? data?.adresa ?? '',
        postanskiBroj: data?.postanski_broj ?? '',
        grad: data?.grad ?? '',
        opcina: opcinaNaziv,
        sifraOpcine: data?.sifra_opcine ?? selectedOpcina?.sifra ?? '',
        adresaIsta: data?.adresa_ista ?? true,
        vlasnikIme: data?.vlasnik_ime ?? '',
        vlasnikUlica: data?.vlasnik_ulica ?? '',
        vlasnikPostanskiBroj: data?.vlasnik_postanski_broj ?? '',
        vlasnikGrad: data?.vlasnik_grad ?? '',
        vlasnikOpcina: ownerOpcinaNaziv,
        vlasnikSifraOpcine: data?.vlasnik_sifra_opcine ?? selectedOwnerOpcina?.sifra ?? '',
        vlasnikIspostavaPu: data?.vlasnik_ispostava_pu ?? '',
        jeJedinaDjelatnost: data?.je_jedina_djelatnost ?? true,
        godisnjiPrimiciProsleGodine: String(
          data?.godisnji_primici_prosle_godine ?? 0,
        ),
        ispostavaPorezne: data?.ispostava_porezne ?? '',
      });
      setMunicipalityQuery(opcinaNaziv);
      setOwnerMunicipalityQuery(ownerOpcinaNaziv);
      setPriceLockBanner({
        locked: Boolean(data?.price_locked),
        amount: data?.locked_price != null ? Number(data.locked_price) : null,
      });
      setIsLoading(false);
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const filteredOpcine = useMemo(() => {
    const q = municipalityQuery.trim().toLocaleLowerCase();
    if (q.length === 0) {
      return OPCINE.slice(0, 25);
    }
    return OPCINE.filter(
      (opcina) =>
        opcina.naziv.toLocaleLowerCase().includes(q) || opcina.sifra.includes(q),
    ).slice(0, 25);
  }, [municipalityQuery]);

  const filteredOwnerOpcine = useMemo(() => {
    const q = ownerMunicipalityQuery.trim().toLocaleLowerCase();
    if (q.length === 0) {
      return OPCINE.slice(0, 25);
    }
    return OPCINE.filter(
      (opcina) =>
        opcina.naziv.toLocaleLowerCase().includes(q) || opcina.sifra.includes(q),
    ).slice(0, 25);
  }, [ownerMunicipalityQuery]);

  function selectOpcina(opcina: Opcina) {
    setForm((previous) => ({
      ...previous,
      opcina: opcina.naziv,
      sifraOpcine: opcina.sifra,
    }));
    setMunicipalityQuery(opcina.naziv);
  }

  function selectOwnerOpcina(opcina: Opcina) {
    setForm((previous) => ({
      ...previous,
      vlasnikOpcina: opcina.naziv,
      vlasnikSifraOpcine: opcina.sifra,
    }));
    setOwnerMunicipalityQuery(opcina.naziv);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setToast(null);

    const iban = normalizeIban(form.iban);
    if (!/^\d{11}$/.test(form.oib.trim())) {
      setToast({ type: 'error', message: 'OIB mora imati točno 11 znamenki.' });
      return;
    }
    if (!/^HR\d{17}$/.test(iban)) {
      setToast({ type: 'error', message: 'IBAN mora biti u formatu HR + 17 znamenki.' });
      return;
    }
    if (form.postanskiBroj.trim() && !/^\d{5}$/.test(form.postanskiBroj.trim())) {
      setToast({ type: 'error', message: 'Poštanski broj mora imati 5 znamenki.' });
      return;
    }
    if (
      !form.adresaIsta &&
      form.vlasnikPostanskiBroj.trim() &&
      !/^\d{5}$/.test(form.vlasnikPostanskiBroj.trim())
    ) {
      setToast({
        type: 'error',
        message: 'Poštanski broj prebivališta mora imati 5 znamenki.',
      });
      return;
    }

    setIsSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIsSaving(false);
      setToast({ type: 'error', message: 'Sesija je istekla. Prijavi se ponovno.' });
      return;
    }

    const { error } = await supabase.from('profiles').upsert(
      {
        id: user.id,
        naziv_obrta: form.nazivObrta.trim(),
        oib: form.oib.trim(),
        iban,
        adresa: addressFromParts(form),
        ulica: form.ulica.trim() || null,
        postanski_broj: form.postanskiBroj.trim() || null,
        grad: form.grad.trim() || null,
        opcina: form.opcina.trim() || null,
        sifra_opcine: form.sifraOpcine.trim() || null,
        vlasnik_ime: form.adresaIsta ? null : form.vlasnikIme.trim() || null,
        vlasnik_ulica: form.adresaIsta ? null : form.vlasnikUlica.trim() || null,
        vlasnik_postanski_broj: form.adresaIsta
          ? null
          : form.vlasnikPostanskiBroj.trim() || null,
        vlasnik_grad: form.adresaIsta ? null : form.vlasnikGrad.trim() || null,
        vlasnik_sifra_opcine: form.adresaIsta
          ? null
          : form.vlasnikSifraOpcine.trim() || null,
        vlasnik_ispostava_pu: form.adresaIsta
          ? null
          : form.vlasnikIspostavaPu.trim() || null,
        adresa_ista: form.adresaIsta,
        je_jedina_djelatnost: form.jeJedinaDjelatnost,
        godisnji_primici_prosle_godine: Number(
          form.godisnjiPrimiciProsleGodine || 0,
        ),
        ispostava_porezne: form.ispostavaPorezne.trim() || null,
      },
      { onConflict: 'id' },
    );

    setIsSaving(false);

    if (error) {
      setToast({ type: 'error', message: error.message });
      return;
    }

    setToast({ type: 'success', message: 'Postavke su uspješno spremljene' });
  }

  async function handleRemoveFiscalCertificate() {
    setFiscalActionLoading(true);
    setToast(null);
    try {
      const res = await fetch('/api/fiscal/certificate', { method: 'DELETE' });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || data.success === false) {
        setToast({
          type: 'error',
          message: data.error ?? 'Brisanje certifikata nije uspjelo.',
        });
        return;
      }
      setFiscalCert({ exists: false });
      setFiscalDeleteConfirm(false);
      setToast({ type: 'success', message: 'FINA certifikat je uklonjen.' });
    } catch {
      setToast({ type: 'error', message: 'Mrežna greška pri uklanjanju certifikata.' });
    } finally {
      setFiscalActionLoading(false);
    }
  }

  const fiscalExpiresSoon =
    fiscalCert?.exists === true
      ? (() => {
          const until = new Date(fiscalCert.valid_until);
          const days = (until.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
          return days >= 0 && days < 30;
        })()
      : false;

  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-8 text-[#e2e8e7] sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-4xl flex-col gap-6'>
        <header className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          <p className='font-body text-sm text-[#94a3a0]'>Profil i porezni podaci</p>
          <h1 className='font-heading mt-2 text-2xl sm:text-3xl'>
            Postavke obrta
          </h1>
        </header>

        {priceLockBanner.locked ? (
          <section className='rounded-2xl border border-[#0d9488]/35 bg-[#0d9488]/10 p-4 font-body text-sm text-[#b9c7c4]'>
            ✅ Cijena zaključana — {priceLockBanner.amount ?? 5.6}€/mj zauvijek (early
            adopter referral).
          </section>
        ) : null}

        {toast ? (
          <p
            className={`font-body rounded-xl border p-4 text-sm ${
              toast.type === 'success'
                ? 'border-[#0d9488]/40 bg-[#0d9488]/10 text-[#5eead4]'
                : 'border-red-500/40 bg-red-500/10 text-red-200'
            }`}
          >
            {toast.message}
          </p>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className='space-y-6 rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'
        >
          <fieldset disabled={isLoading || isSaving} className='space-y-6'>
            <section className='space-y-4'>
              <h2 className='font-heading text-lg'>Podaci obrta</h2>
              <div className='grid gap-4 sm:grid-cols-2'>
                <label className='block sm:col-span-2'>
                  <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                    Naziv obrta
                  </span>
                  <input
                    required
                    value={form.nazivObrta}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        nazivObrta: event.target.value,
                      }))
                    }
                    className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                  />
                </label>
                <label className='block'>
                  <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>OIB</span>
                  <input
                    required
                    inputMode='numeric'
                    value={form.oib}
                    onChange={(event) =>
                      setForm((previous) => ({ ...previous, oib: event.target.value }))
                    }
                    className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                    placeholder='12345678901'
                  />
                </label>
                <label className='block'>
                  <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>IBAN</span>
                  <input
                    required
                    value={form.iban}
                    onChange={(event) =>
                      setForm((previous) => ({ ...previous, iban: event.target.value }))
                    }
                    className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 uppercase outline-none transition focus:border-[#0d9488]'
                    placeholder='HR1210010051863000160'
                  />
                </label>
              </div>
            </section>

            <section className='space-y-4'>
              <h2 className='font-heading text-lg'>Adresa sjedišta</h2>
              <div className='grid gap-4 sm:grid-cols-2'>
                <label className='block sm:col-span-2'>
                  <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                    Ulica i kućni broj
                  </span>
                  <input
                    value={form.ulica}
                    onChange={(event) =>
                      setForm((previous) => ({ ...previous, ulica: event.target.value }))
                    }
                    className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                  />
                </label>
                <label className='block'>
                  <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                    Poštanski broj
                  </span>
                  <input
                    inputMode='numeric'
                    value={form.postanskiBroj}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        postanskiBroj: event.target.value,
                      }))
                    }
                    className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                    placeholder='10000'
                  />
                </label>
                <label className='block'>
                  <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                    Grad/Mjesto
                  </span>
                  <input
                    value={form.grad}
                    onChange={(event) =>
                      setForm((previous) => ({ ...previous, grad: event.target.value }))
                    }
                    className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                  />
                </label>
                <label className='relative block'>
                  <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                    Općina/Grad za PO-SD
                  </span>
                  <input
                    value={municipalityQuery}
                    onChange={(event) => {
                      setMunicipalityQuery(event.target.value);
                      setForm((previous) => ({
                        ...previous,
                        opcina: event.target.value,
                        sifraOpcine: '',
                      }));
                    }}
                    className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                    placeholder='Počni tipkati naziv ili šifru...'
                  />
                  {municipalityQuery ? (
                    <div className='absolute left-0 right-0 top-full z-20 mt-2 max-h-60 overflow-y-auto rounded-xl border border-[#2a3734] bg-[#111716] shadow-xl shadow-black/30'>
                      {filteredOpcine.map((opcina) => (
                        <button
                          key={opcina.sifra}
                          type='button'
                          onClick={() => selectOpcina(opcina)}
                          className='flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm text-[#d5dfdd] transition hover:bg-[#1f2a28]'
                        >
                          <span>{opcina.naziv}</span>
                          <span className='font-semibold text-[#5eead4]'>
                            {opcina.sifra}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </label>
                <label className='block'>
                  <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                    Šifra općine
                  </span>
                  <input
                    readOnly
                    value={form.sifraOpcine}
                    className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-[#94a3a0] outline-none'
                  />
                </label>
              </div>
            </section>

            <section className='space-y-4'>
              <h2 className='font-heading text-lg'>Prebivalište vlasnika</h2>
              <label className='font-body flex items-center gap-3 rounded-xl border border-[#2a3734] bg-[#0b0f0e] p-4 text-sm text-[#d5dfdd]'>
                <input
                  type='checkbox'
                  checked={form.adresaIsta}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      adresaIsta: event.target.checked,
                    }))
                  }
                  className='h-4 w-4 accent-[#0d9488]'
                />
                Adresa prebivališta ista kao sjedište obrta
              </label>

              {!form.adresaIsta ? (
                <div className='grid gap-4 sm:grid-cols-2'>
                  <label className='block sm:col-span-2'>
                    <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                      Ime i prezime vlasnika
                    </span>
                    <input
                      value={form.vlasnikIme}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          vlasnikIme: event.target.value,
                        }))
                      }
                      className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                    />
                  </label>
                  <label className='block sm:col-span-2'>
                    <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                      Ulica i kućni broj
                    </span>
                    <input
                      value={form.vlasnikUlica}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          vlasnikUlica: event.target.value,
                        }))
                      }
                      className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                    />
                  </label>
                  <label className='block'>
                    <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                      Poštanski broj
                    </span>
                    <input
                      inputMode='numeric'
                      value={form.vlasnikPostanskiBroj}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          vlasnikPostanskiBroj: event.target.value,
                        }))
                      }
                      className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                    />
                  </label>
                  <label className='block'>
                    <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                      Grad/Mjesto
                    </span>
                    <input
                      value={form.vlasnikGrad}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          vlasnikGrad: event.target.value,
                        }))
                      }
                      className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                    />
                  </label>
                  <label className='relative block'>
                    <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                      Općina
                    </span>
                    <input
                      value={ownerMunicipalityQuery}
                      onChange={(event) => {
                        setOwnerMunicipalityQuery(event.target.value);
                        setForm((previous) => ({
                          ...previous,
                          vlasnikOpcina: event.target.value,
                          vlasnikSifraOpcine: '',
                        }));
                      }}
                      className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                      placeholder='Počni tipkati naziv ili šifru...'
                    />
                    {ownerMunicipalityQuery ? (
                      <div className='absolute left-0 right-0 top-full z-20 mt-2 max-h-60 overflow-y-auto rounded-xl border border-[#2a3734] bg-[#111716] shadow-xl shadow-black/30'>
                        {filteredOwnerOpcine.map((opcina) => (
                          <button
                            key={opcina.sifra}
                            type='button'
                            onClick={() => selectOwnerOpcina(opcina)}
                            className='flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm text-[#d5dfdd] transition hover:bg-[#1f2a28]'
                          >
                            <span>{opcina.naziv}</span>
                            <span className='font-semibold text-[#5eead4]'>
                              {opcina.sifra}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </label>
                  <label className='block'>
                    <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                      Šifra općine
                    </span>
                    <input
                      readOnly
                      value={form.vlasnikSifraOpcine}
                      className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-[#94a3a0] outline-none'
                    />
                  </label>
                  <label className='block sm:col-span-2'>
                    <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                      Ispostava Porezne uprave
                    </span>
                    <input
                      value={form.vlasnikIspostavaPu}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          vlasnikIspostavaPu: event.target.value,
                        }))
                      }
                      className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                    />
                  </label>
                </div>
              ) : null}
            </section>

            <section className='space-y-4'>
              <h2 className='font-heading text-lg'>Djelatnost</h2>
              <div className='space-y-3 rounded-xl border border-[#2a3734] bg-[#0b0f0e] p-4'>
                <label className='font-body flex items-center gap-3 text-sm text-[#d5dfdd]'>
                  <input
                    type='radio'
                    name='vrsta-djelatnosti'
                    checked={form.jeJedinaDjelatnost}
                    onChange={() =>
                      setForm((previous) => ({
                        ...previous,
                        jeJedinaDjelatnost: true,
                      }))
                    }
                    className='h-4 w-4 accent-[#0d9488]'
                  />
                  Jedina djelatnost
                </label>
                <label className='font-body flex items-center gap-3 text-sm text-[#d5dfdd]'>
                  <input
                    type='radio'
                    name='vrsta-djelatnosti'
                    checked={!form.jeJedinaDjelatnost}
                    onChange={() =>
                      setForm((previous) => ({
                        ...previous,
                        jeJedinaDjelatnost: false,
                      }))
                    }
                    className='h-4 w-4 accent-[#0d9488]'
                  />
                  Uz zaposlenje kod drugog poslodavca
                </label>
              </div>
              <label className='block'>
                <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                  Godišnji primitak prethodne godine
                </span>
                <input
                  type='number'
                  min='0'
                  step='0.01'
                  value={form.godisnjiPrimiciProsleGodine}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      godisnjiPrimiciProsleGodine: event.target.value,
                    }))
                  }
                  className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                />
              </label>
            </section>

            <section className='space-y-4'>
              <h2 className='font-heading text-lg'>Ispostava Porezne</h2>
              <label className='block'>
                <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                  Ispostava Porezne uprave
                </span>
                <input
                  value={form.ispostavaPorezne}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      ispostavaPorezne: event.target.value,
                    }))
                  }
                  className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                  placeholder='npr. Zagreb - Centar'
                />
              </label>
            </section>
          </fieldset>

          <button
            type='submit'
            disabled={isLoading || isSaving}
            className='font-body rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-60'
          >
            {isSaving ? 'Spremam...' : 'Spremi postavke'}
          </button>
        </form>

        {/* ── Pretplata ─────────────────────────────────────────────────── */}
        <section className='space-y-4 rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          <h2 className='font-heading text-lg'>Pretplata</h2>
          {isActivating ? (
            <div className='rounded-xl border border-[#0d9488]/40 bg-[#0d9488]/10 p-4'>
              <p className='font-body text-sm text-[#5eead4]'>
                ⏳ Pretplata se aktivira... Osvježite stranicu za trenutak.
              </p>
            </div>
          ) : null}
          {subLoading ? (
            <p className='font-body text-sm text-[#94a3a0]'>Učitavam...</p>
          ) : sub?.plan === 'pausalist' && (sub.status === 'active' || sub.status === 'trialing') ? (
            <div className='space-y-4 font-body text-sm text-[#b9c7c4]'>
              <div className='flex items-center gap-2'>
                <span className='h-2 w-2 rounded-full bg-emerald-400' aria-hidden />
                <span className='font-medium text-[#e2e8e7]'>
                  Kvik Paušalist
                  {sub.status === 'trialing' && (
                    <span className='ml-2 rounded-full bg-[#0d9488]/20 px-2 py-0.5 text-xs text-[#5eead4]'>
                      Probno
                    </span>
                  )}
                </span>
              </div>
              {sub.interval && (
                <p>
                  Plan:{' '}
                  <span className='text-[#e2e8e7]'>
                    {sub.interval === 'year' ? 'Godišnji (5,60€/mj)' : 'Mjesečni (7€/mj)'}
                  </span>
                </p>
              )}
              {sub.current_period_end && (
                <p>
                  {sub.cancel_at_period_end ? 'Ističe' : 'Sljedeća naplata'}:{' '}
                  <span className='text-[#e2e8e7]'>
                    {new Date(sub.current_period_end).toLocaleDateString('hr-HR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </span>
                  {sub.cancel_at_period_end && (
                    <span className='ml-2 text-amber-300'>Otkazano — aktivan do kraja perioda</span>
                  )}
                </p>
              )}
              {sub.stripe_customer_id && (
                <button
                  type='button'
                  disabled={portalLoading}
                  onClick={() => void openPortal()}
                  className='inline-flex rounded-xl bg-[#0d9488] px-4 py-2 font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {portalLoading ? 'Otvarum...' : 'Upravljaj pretplatom →'}
                </button>
              )}
            </div>
          ) : sub?.status === 'past_due' ? (
            <div className='space-y-3 font-body text-sm'>
              <div className='flex items-center gap-2 text-amber-300'>
                <span className='h-2 w-2 rounded-full bg-amber-400' aria-hidden />
                <span>Plaćanje nije uspjelo</span>
              </div>
              <p className='text-[#b9c7c4]'>
                Molimo ažurirajte podatke platne kartice kako bi nastavili koristiti Kvik.
              </p>
              <button
                type='button'
                disabled={portalLoading}
                onClick={() => void openPortal()}
                className='inline-flex rounded-xl bg-amber-500 px-4 py-2 font-semibold text-white transition hover:bg-amber-400 disabled:opacity-60'
              >
                {portalLoading ? 'Otvarum...' : 'Ažuriraj platnu karticu →'}
              </button>
            </div>
          ) : (
            <div className='space-y-3 font-body text-sm'>
              <div className='flex items-center gap-2 text-[#b9c7c4]'>
                <span className='h-2 w-2 rounded-full bg-[#94a3a0]' aria-hidden />
                <span>Besplatni plan</span>
              </div>
              <p className='text-[#94a3a0]'>
                Nadogradite na Paušalist — 7 dana besplatno, bez kartice.
              </p>
              <Link
                href='/cijene'
                className='inline-flex rounded-xl bg-[#0d9488] px-4 py-2 font-semibold text-white transition hover:bg-[#14b8a6]'
              >
                Pogledaj planove →
              </Link>
            </div>
          )}
        </section>

        {/* Sprint 3: povijest naplata (billing_events) */}
        <section className='space-y-4 rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          <h2 className='font-heading text-lg'>Povijest naplate</h2>
          {billingLoading ? (
            <p className='font-body text-sm text-[#94a3a0]'>Učitavam...</p>
          ) : billingEvents.length === 0 ? (
            <p className='font-body text-sm text-[#94a3a0]'>Još nema plaćanja.</p>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full min-w-[640px] border-collapse font-body text-left text-sm text-[#b9c7c4]'>
                <thead>
                  <tr className='border-b border-[#2a3734] text-xs uppercase tracking-wide text-[#94a3a0]'>
                    <th className='py-2 pr-3 font-medium'>Datum</th>
                    <th className='py-2 pr-3 font-medium'>Opis</th>
                    <th className='py-2 pr-3 font-medium'>Iznos</th>
                    <th className='py-2 pr-3 font-medium'>Status</th>
                    <th className='py-2 font-medium'>Račun</th>
                  </tr>
                </thead>
                <tbody>
                  {billingEvents.map((ev) => {
                    const amt =
                      typeof ev.amount_eur === 'string'
                        ? Number.parseFloat(ev.amount_eur)
                        : ev.amount_eur;
                    const badge =
                      ev.status === 'paid' ? (
                        <span className='inline-flex rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-300'>
                          Plaćeno
                        </span>
                      ) : ev.status === 'failed' ? (
                        <span className='inline-flex rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-300'>
                          Neuspješno
                        </span>
                      ) : ev.status === 'refunded' ? (
                        <span className='inline-flex rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-200'>
                          Povrat
                        </span>
                      ) : (
                        <span className='inline-flex rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-200'>
                          U tijeku
                        </span>
                      );
                    return (
                      <tr key={ev.id} className='border-b border-[#1f2a28]'>
                        <td className='py-3 pr-3 align-middle text-[#e2e8e7]'>
                          {formatDatumHr(ev.created_at)}
                        </td>
                        <td className='py-3 pr-3 align-middle'>{billingOpis(ev.interval)}</td>
                        <td className='py-3 pr-3 align-middle tabular-nums text-[#e2e8e7]'>
                          {formatIznosEurHr(Number.isFinite(amt) ? amt : 0)}
                        </td>
                        <td className='py-3 pr-3 align-middle'>{badge}</td>
                        <td className='py-3 align-middle'>
                          {ev.invoice_id ? (
                            <a
                              href={`/api/racuni/${ev.invoice_id}/pdf`}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='font-medium text-[#5eead4] underline decoration-[#0d9488]/50 underline-offset-2 hover:text-[#99f6e4]'
                            >
                              PDF
                            </a>
                          ) : (
                            <span className='text-[#64748b]'>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Fiskalizacija — certifikat (GET /api/fiscal/certificate na mountu) */}
        <section className='space-y-4 rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          <h2 className='font-heading text-lg'>Fiskalizacija</h2>
          {fiscalLoading ? (
            <p className='font-body text-sm text-[#94a3a0]'>Učitavam status...</p>
          ) : fiscalCert?.exists ? (
            <div className='space-y-4 font-body text-sm text-[#b9c7c4]'>
              <div className='flex items-center gap-2'>
                <span className='h-2 w-2 rounded-full bg-emerald-400' aria-hidden />
                <span className='text-[#e2e8e7]'>Aktivno</span>
              </div>
              <p>
                OIB:{' '}
                <span className='font-medium text-[#e2e8e7]'>{fiscalCert.fina_oib}</span>
              </p>
              <p>
                Vrijedi do:{' '}
                <span className='font-medium text-[#e2e8e7]'>
                  {new Date(fiscalCert.valid_until).toLocaleDateString('hr-HR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </span>
                {fiscalExpiresSoon ? (
                  <span className='ml-2 font-semibold text-red-300'>Uskoro istječe!</span>
                ) : null}
              </p>
              <p>
                Poslovni prostor:{' '}
                <span className='text-[#e2e8e7]'>{fiscalCert.poslovni_prostor}</span>
                {' · '}
                Blagajna: <span className='text-[#e2e8e7]'>{fiscalCert.blagajna}</span>
              </p>
              {fiscalDeleteConfirm ? (
                <div className='flex flex-wrap items-center gap-3 rounded-xl border border-[#2a3734] bg-[#0b0f0e] p-4'>
                  <span className='text-[#e2e8e7]'>Sigurno ukloniti certifikat?</span>
                  <button
                    type='button'
                    disabled={fiscalActionLoading}
                    onClick={() => void handleRemoveFiscalCertificate()}
                    className='rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-500 disabled:opacity-50'
                  >
                    {fiscalActionLoading ? 'Uklanjam...' : 'Da, ukloni'}
                  </button>
                  <button
                    type='button'
                    disabled={fiscalActionLoading}
                    onClick={() => setFiscalDeleteConfirm(false)}
                    className='rounded-lg border border-[#2a3734] px-3 py-2 text-xs text-[#b9c7c4] transition hover:bg-[#1f2a28]'
                  >
                    Odustani
                  </button>
                </div>
              ) : (
                <button
                  type='button'
                  onClick={() => setFiscalDeleteConfirm(true)}
                  className='font-body rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20'
                >
                  Ukloni certifikat
                </button>
              )}
            </div>
          ) : (
            <div className='space-y-4 font-body text-sm'>
              <div className='flex items-center gap-2 text-[#b9c7c4]'>
                <span className='h-2 w-2 rounded-full bg-amber-400' aria-hidden />
                <span>Nije postavljeno</span>
              </div>
              <p className='text-[#94a3a0]'>
                Postavi FINA certifikat za fiskalizaciju računa.
              </p>
              <Link
                href='/postavke/fiskalizacija'
                className='inline-flex rounded-xl bg-[#0d9488] px-4 py-2 font-semibold text-white transition hover:bg-[#14b8a6]'
              >
                Postavi certifikat →
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

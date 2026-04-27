'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

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

export default function PostavkePage() {
  const supabase = useMemo(() => createClient(), []);
  const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
  const [municipalityQuery, setMunicipalityQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

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
          'naziv_obrta, oib, iban, adresa, ulica, postanski_broj, grad, opcina, sifra_opcine, je_jedina_djelatnost, godisnji_primici_prosle_godine, ispostava_porezne',
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

      setForm({
        nazivObrta: data?.naziv_obrta ?? '',
        oib: data?.oib ?? '',
        iban: data?.iban ?? '',
        ulica: data?.ulica ?? data?.adresa ?? '',
        postanskiBroj: data?.postanski_broj ?? '',
        grad: data?.grad ?? '',
        opcina: opcinaNaziv,
        sifraOpcine: data?.sifra_opcine ?? selectedOpcina?.sifra ?? '',
        jeJedinaDjelatnost: data?.je_jedina_djelatnost ?? true,
        godisnjiPrimiciProsleGodine: String(
          data?.godisnji_primici_prosle_godine ?? 0,
        ),
        ispostavaPorezne: data?.ispostava_porezne ?? '',
      });
      setMunicipalityQuery(opcinaNaziv);
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

  function selectOpcina(opcina: Opcina) {
    setForm((previous) => ({
      ...previous,
      opcina: opcina.naziv,
      sifraOpcine: opcina.sifra,
    }));
    setMunicipalityQuery(opcina.naziv);
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

  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-8 text-[#e2e8e7] sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-4xl flex-col gap-6'>
        <header className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          <p className='font-body text-sm text-[#94a3a0]'>Profil i porezni podaci</p>
          <h1 className='font-heading mt-2 text-2xl sm:text-3xl'>
            Postavke obrta
          </h1>
        </header>

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
      </div>
    </main>
  );
}

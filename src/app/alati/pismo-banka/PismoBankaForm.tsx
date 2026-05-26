'use client';

import Link from 'next/link';
import { type FocusEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  BANKA_OPTIONS,
  type PismoBankaFields,
  generatePismoBankaText,
  getBankaEmailInfo,
  INPUT_CLASS,
  LABEL_CLASS,
  pismoBankaPdfFilename,
} from '@/lib/alati/pismo-banka';
import { createClient } from '@/lib/supabase/client';
import { useAlatiSession } from '@/hooks/use-alati-session';

type FormValues = PismoBankaFields;

const FIELD_ORDER: (keyof FormValues)[] = [
  'banka',
  'bankaEmail',
  'nazivObrta',
  'oib',
  'adresa',
  'vlasnikIme',
  'email',
  'mobitel',
  'zeljeniPaket',
  'preferiranaPoslovnica',
];

export function PismoBankaForm() {
  const session = useAlatiSession();
  const prof = session.status === 'signed_in' ? session.profile : null;

  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const fieldRefs = useRef<Partial<Record<keyof FormValues, HTMLElement | null>>>({});

  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      banka: 'PBZ',
      bankaEmail: '',
      nazivObrta: '',
      oib: '',
      adresa: '',
      vlasnikIme: '',
      email: '',
      mobitel: '',
      zeljeniPaket: '',
      preferiranaPoslovnica: '',
    },
  });

  const values = watch();
  const bankaInfo = getBankaEmailInfo(values.banka);

  useEffect(() => {
    if (!prof || profileLoaded) {
      return;
    }

    if (!getValues('nazivObrta') && prof.naziv_obrta) {
      setValue('nazivObrta', prof.naziv_obrta);
    }
    if (!getValues('oib') && prof.oib) {
      setValue('oib', prof.oib);
    }
    if (!getValues('adresa') && prof.adresa) {
      setValue('adresa', prof.adresa);
    }
  }, [prof, profileLoaded, setValue, getValues]);

  useEffect(() => {
    if (session.status !== 'signed_in' || profileLoaded) {
      return;
    }

    let cancelled = false;

    void (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || cancelled) {
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('naziv_obrta, oib, adresa, vlasnik_ime')
        .eq('id', user.id)
        .maybeSingle();

      if (cancelled) {
        return;
      }

      const row = data as {
        naziv_obrta?: string | null;
        oib?: string | null;
        adresa?: string | null;
        vlasnik_ime?: string | null;
      } | null;

      if (row?.naziv_obrta && !getValues('nazivObrta')) {
        setValue('nazivObrta', row.naziv_obrta.trim());
      }
      if (row?.oib && !getValues('oib')) {
        setValue('oib', row.oib.trim());
      }
      if (row?.adresa && !getValues('adresa')) {
        setValue('adresa', row.adresa.trim());
      }
      if (row?.vlasnik_ime && !getValues('vlasnikIme')) {
        setValue('vlasnikIme', row.vlasnik_ime.trim());
      }
      if (user.email && !getValues('email')) {
        setValue('email', user.email.trim());
      }

      setProfileLoaded(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [session.status, profileLoaded, setValue, getValues]);

  const previewText = useMemo(() => generatePismoBankaText(values), [values]);

  const canExport =
    values.nazivObrta.trim().length > 0 &&
    /^\d{11}$/.test(values.oib.replace(/\s/g, '')) &&
    values.adresa.trim().length > 3 &&
    values.vlasnikIme.trim().length > 0;

  const scrollToField = useCallback((key: keyof FormValues) => {
    const el = fieldRefs.current[key];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handleFieldFocus = useCallback(
    (key: keyof FormValues) => (event: FocusEvent<HTMLElement>) => {
      fieldRefs.current[key] = event.currentTarget;
      if (window.matchMedia('(max-width: 640px)').matches) {
        requestAnimationFrame(() => {
          event.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }
    },
    [],
  );

  async function onCopy() {
    if (!canExport) {
      return;
    }
    try {
      await navigator.clipboard.writeText(previewText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  }

  async function onDownloadPdf() {
    if (!canExport) {
      return;
    }
    setBusy(true);
    try {
      const [{ downloadReactPdfClient }, { PismoBankaDocument }] = await Promise.all([
        import('@/lib/alati/download-react-pdf-client'),
        import('@/lib/pdf/pismo-banka-document'),
      ]);
      await downloadReactPdfClient(
        <PismoBankaDocument {...values} />,
        pismoBankaPdfFilename(values.banka),
      );
    } finally {
      setBusy(false);
    }
  }

  const oibRegister = register('oib', {
    validate: (v) => /^\d{11}$/.test(v.replace(/\s/g, '')) || 'OIB mora imati 11 znamenki',
  });

  return (
    <div className='grid gap-8 lg:grid-cols-2 lg:items-start'>
      <form
        className='space-y-4'
        onSubmit={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key !== 'Tab' || e.shiftKey) {
            return;
          }
          const active = document.activeElement as HTMLElement | null;
          const idx = FIELD_ORDER.findIndex((k) => fieldRefs.current[k] === active);
          if (idx >= 0 && idx < FIELD_ORDER.length - 1) {
            const nextKey = FIELD_ORDER[idx + 1];
            if (bankaInfo.type !== 'manual' && nextKey === 'bankaEmail') {
              scrollToField(FIELD_ORDER[idx + 2] ?? nextKey);
            }
          }
        }}
      >
        {session.status === 'guest' ? (
          <p className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-4 text-sm text-[#b9c7c4]'>
            Popuni polja ručno ili se{' '}
            <Link href='/login' className='text-[#0d9488] hover:underline'>
              prijavi
            </Link>{' '}
            da podaci automatski dođu iz Kvik registracije.
          </p>
        ) : session.status === 'signed_in' && prof ? (
          <p className='rounded-2xl border border-[#0d9488]/30 bg-[#0d9488]/10 p-4 text-sm text-[#b9c7c4]'>
            Polja su djelomično popunjena iz tvog Kvik profila — provjeri i prilagodi prije slanja.
          </p>
        ) : null}

        <label className='block'>
          <span className={LABEL_CLASS}>Banka</span>
          <select
            {...register('banka')}
            onFocus={handleFieldFocus('banka')}
            ref={(el) => {
              register('banka').ref(el);
              fieldRefs.current.banka = el;
            }}
            className={INPUT_CLASS}
          >
            {BANKA_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        {bankaInfo.type === 'email' ? (
          <p className='rounded-xl border border-[#1f2a28] bg-[#111716] px-4 py-3 text-sm text-[#94a3a0]'>
            Email banke:{' '}
            <span className='font-medium text-[#e2e8e7]'>{bankaInfo.email}</span>
          </p>
        ) : bankaInfo.type === 'info' ? (
          <p className='rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100'>
            {bankaInfo.message}
          </p>
        ) : (
          <label className='block'>
            <span className={LABEL_CLASS}>Email banke</span>
            <input
              {...register('bankaEmail')}
              type='email'
              placeholder='npr. poslovnica@banka.hr'
              enterKeyHint='next'
              onFocus={handleFieldFocus('bankaEmail')}
              ref={(el) => {
                register('bankaEmail').ref(el);
                fieldRefs.current.bankaEmail = el;
              }}
              className={INPUT_CLASS}
            />
          </label>
        )}

        <label className='block'>
          <span className={LABEL_CLASS}>Naziv obrta</span>
          <input
            {...register('nazivObrta', { required: true })}
            enterKeyHint='next'
            onFocus={handleFieldFocus('nazivObrta')}
            ref={(el) => {
              register('nazivObrta').ref(el);
              fieldRefs.current.nazivObrta = el;
            }}
            className={INPUT_CLASS}
          />
        </label>

        <label className='block'>
          <span className={LABEL_CLASS}>OIB</span>
          <input
            {...oibRegister}
            inputMode='numeric'
            enterKeyHint='next'
            onFocus={handleFieldFocus('oib')}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 11);
              setValue('oib', val, { shouldValidate: true });
            }}
            ref={(el) => {
              oibRegister.ref(el);
              fieldRefs.current.oib = el;
            }}
            className={INPUT_CLASS}
          />
          {errors.oib ? (
            <span className='mt-1 block text-xs text-red-400'>{errors.oib.message}</span>
          ) : null}
        </label>

        <label className='block'>
          <span className={LABEL_CLASS}>Adresa sjedišta</span>
          <input
            {...register('adresa', { required: true })}
            enterKeyHint='next'
            onFocus={handleFieldFocus('adresa')}
            ref={(el) => {
              register('adresa').ref(el);
              fieldRefs.current.adresa = el;
            }}
            className={INPUT_CLASS}
          />
        </label>

        <label className='block'>
          <span className={LABEL_CLASS}>Ime i prezime vlasnika</span>
          <input
            {...register('vlasnikIme', { required: true })}
            enterKeyHint='next'
            onFocus={handleFieldFocus('vlasnikIme')}
            ref={(el) => {
              register('vlasnikIme').ref(el);
              fieldRefs.current.vlasnikIme = el;
            }}
            className={INPUT_CLASS}
          />
        </label>

        <label className='block'>
          <span className={LABEL_CLASS}>Email</span>
          <input
            {...register('email')}
            type='email'
            enterKeyHint='next'
            onFocus={handleFieldFocus('email')}
            ref={(el) => {
              register('email').ref(el);
              fieldRefs.current.email = el;
            }}
            className={INPUT_CLASS}
          />
        </label>

        <label className='block'>
          <span className={LABEL_CLASS}>Mobitel</span>
          <input
            {...register('mobitel')}
            type='tel'
            inputMode='tel'
            enterKeyHint='next'
            onFocus={handleFieldFocus('mobitel')}
            ref={(el) => {
              register('mobitel').ref(el);
              fieldRefs.current.mobitel = el;
            }}
            className={INPUT_CLASS}
          />
        </label>

        <label className='block'>
          <span className={LABEL_CLASS}>Željeni paket (opcionalno)</span>
          <input
            {...register('zeljeniPaket')}
            placeholder='PBZ Sinergo Standard 2.0'
            enterKeyHint='next'
            onFocus={handleFieldFocus('zeljeniPaket')}
            ref={(el) => {
              register('zeljeniPaket').ref(el);
              fieldRefs.current.zeljeniPaket = el;
            }}
            className={INPUT_CLASS}
          />
        </label>

        <label className='block'>
          <span className={LABEL_CLASS}>Preferirana poslovnica (opcionalno)</span>
          <input
            {...register('preferiranaPoslovnica')}
            placeholder='Zagreb, Radnička cesta'
            enterKeyHint='done'
            onFocus={handleFieldFocus('preferiranaPoslovnica')}
            ref={(el) => {
              register('preferiranaPoslovnica').ref(el);
              fieldRefs.current.preferiranaPoslovnica = el;
            }}
            className={INPUT_CLASS}
          />
        </label>
      </form>

      <div className='space-y-4 lg:sticky lg:top-6'>
        <div>
          <h2 className='font-heading text-lg font-semibold text-[#e2e8e7]'>Pregled pisma</h2>
          <p className='mt-1 text-sm text-[#94a3a0]'>
            Ažurira se uživo dok tipkaš. Kopiraj u email ili preuzmi PDF.
          </p>
        </div>

        <textarea
          readOnly
          value={previewText}
          rows={22}
          aria-label='Pregled generiranog pisma'
          className='w-full resize-none rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 font-mono text-sm leading-relaxed text-[#e2e8e7] outline-none'
        />

        <div className='flex flex-wrap gap-3'>
          <button
            type='button'
            disabled={!canExport}
            onClick={() => void onCopy()}
            className='rounded-xl border border-[#2a3734] bg-[#111716] px-6 py-3 text-sm font-semibold text-[#e2e8e7] transition hover:border-[#0d9488]/50 disabled:cursor-not-allowed disabled:opacity-40'
          >
            {copied ? 'Kopirano!' : 'Kopiraj tekst'}
          </button>
          <button
            type='button'
            disabled={!canExport || busy}
            onClick={() => void onDownloadPdf()}
            className='rounded-xl bg-[#0d9488] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-40'
          >
            {busy ? 'Generiram PDF…' : 'Preuzmi PDF'}
          </button>
        </div>

        {!canExport ? (
          <p className='text-xs text-[#64706e]'>
            Za export popuni naziv obrta, OIB (11 znamenki), adresu i ime vlasnika.
          </p>
        ) : null}
      </div>
    </div>
  );
}

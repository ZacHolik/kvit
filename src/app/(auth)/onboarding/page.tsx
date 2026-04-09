'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';

import { createClient } from '@/lib/supabase/client';

type OnboardingData = {
  nazivObrta: string;
  oib: string;
  adresa: string;
  jeJedinaDjelatnost: boolean;
  godisnjiPrimiciProsleGodine: string;
};

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<OnboardingData>({
    nazivObrta: '',
    oib: '',
    adresa: '',
    jeJedinaDjelatnost: true,
    godisnjiPrimiciProsleGodine: '0',
  });

  const progressPercent = useMemo(
    () => Math.round((step / TOTAL_STEPS) * 100),
    [step],
  );

  const canGoForward = () => {
    if (step === 1) {
      return formData.nazivObrta.trim().length > 1;
    }

    if (step === 2) {
      return /^\d{11}$/.test(formData.oib);
    }

    if (step === 3) {
      return formData.adresa.trim().length >= 5;
    }

    if (step === 4) {
      return Number(formData.godisnjiPrimiciProsleGodine) >= 0;
    }

    return false;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (step < TOTAL_STEPS) {
      if (!canGoForward()) {
        setError('Molim unesi valjane podatke prije nastavka.');
        return;
      }

      setStep((previousStep) => previousStep + 1);
      return;
    }

    setIsLoading(true);

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    const user = session?.user;

    if (sessionError || !user) {
      console.error('Onboarding: missing auth session before profile upsert.', {
        sessionError,
      });
      setIsLoading(false);
      router.push('/confirm-email');
      return;
    }

    const payload = {
      id: user.id,
      naziv_obrta: formData.nazivObrta.trim(),
      oib: formData.oib.trim(),
      adresa: formData.adresa.trim(),
      je_jedina_djelatnost: formData.jeJedinaDjelatnost,
      godisnji_primici_prosle_godine: Number(formData.godisnjiPrimiciProsleGodine),
    };

    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' });

    setIsLoading(false);

    if (upsertError) {
      console.error('Onboarding profile upsert failed.', {
        error: upsertError,
        payload,
        userId: user.id,
      });
      setError(upsertError.message);
      return;
    }

    const { data: savedProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (verifyError || !savedProfile) {
      console.error('Onboarding profile verification failed after upsert.', {
        error: verifyError,
        userId: user.id,
      });
      setError(
        'Spremanje profila nije uspjelo. Pokušaj ponovno ili kontaktiraj podršku.',
      );
      return;
    }

    // TODO: Next step can include onboarding completeness tracking table if needed.
    router.push(`/confirm-email?email=${encodeURIComponent(user.email ?? '')}`);
    router.refresh();
  };

  return (
    <main className='flex min-h-screen items-center justify-center bg-[#0b0f0e] px-4 py-10'>
      <section className='w-full max-w-xl rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 shadow-xl shadow-black/25 sm:p-8'>
        <p className='font-body text-sm text-[#94a3a0]'>
          Korak {step} od {TOTAL_STEPS}
        </p>
        <h1 className='font-heading mt-2 text-3xl text-[#e2e8e7]'>
          Onboarding obrta
        </h1>

        <div className='mt-6 h-2 w-full rounded-full bg-[#22302d]'>
          <div
            className='h-2 rounded-full bg-[#0d9488] transition-all'
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <form className='mt-8 space-y-5' onSubmit={handleSubmit}>
          {step === 1 ? (
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Naziv obrta
              </span>
              <input
                required
                type='text'
                value={formData.nazivObrta}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    nazivObrta: event.target.value,
                  }))
                }
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-[#e2e8e7] outline-none transition focus:border-[#0d9488]'
                placeholder='Obrt Horvat'
              />
            </label>
          ) : null}

          {step === 2 ? (
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                OIB (11 znamenki)
              </span>
              <input
                required
                maxLength={11}
                type='text'
                value={formData.oib}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    oib: event.target.value.replace(/\D/g, ''),
                  }))
                }
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-[#e2e8e7] outline-none transition focus:border-[#0d9488]'
                placeholder='12345678901'
              />
            </label>
          ) : null}

          {step === 3 ? (
            <>
              <label className='block'>
                <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                  Adresa obrta
                </span>
                <input
                  required
                  type='text'
                  value={formData.adresa}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      adresa: event.target.value,
                    }))
                  }
                  className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-[#e2e8e7] outline-none transition focus:border-[#0d9488]'
                  placeholder='Ulica i broj, grad'
                />
              </label>

              <label className='flex items-center gap-3 rounded-xl border border-[#2a3734] bg-[#0b0f0e] p-4'>
                <input
                  type='checkbox'
                  checked={formData.jeJedinaDjelatnost}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      jeJedinaDjelatnost: event.target.checked,
                    }))
                  }
                  className='h-4 w-4 accent-[#0d9488]'
                />
                <span className='font-body text-sm text-[#d5dfdd]'>
                  Obrt mi je jedina djelatnost
                </span>
              </label>
            </>
          ) : null}

          {step === 4 ? (
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Godišnji primici prošle godine (EUR)
              </span>
              <input
                required
                min='0'
                step='0.01'
                type='number'
                value={formData.godisnjiPrimiciProsleGodine}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    godisnjiPrimiciProsleGodine: event.target.value,
                  }))
                }
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-[#e2e8e7] outline-none transition focus:border-[#0d9488]'
                placeholder='0.00'
              />
            </label>
          ) : null}

          {error ? (
            <p className='font-body rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200'>
              {error}
            </p>
          ) : null}

          <div className='flex items-center justify-between gap-3'>
            <button
              type='button'
              disabled={step === 1 || isLoading}
              onClick={() => setStep((previousStep) => previousStep - 1)}
              className='font-body rounded-xl border border-[#2a3734] px-4 py-3 text-[#d5dfdd] transition hover:border-[#0d9488] disabled:cursor-not-allowed disabled:opacity-40'
            >
              Nazad
            </button>

            <button
              type='submit'
              disabled={isLoading}
              className='font-body rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-70'
            >
              {step < TOTAL_STEPS
                ? 'Nastavi'
                : isLoading
                  ? 'Spremam...'
                  : 'Završi onboarding'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

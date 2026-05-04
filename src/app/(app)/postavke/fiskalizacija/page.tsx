'use client';

import Link from 'next/link';
import {
  type ChangeEvent,
  type DragEvent,
  useCallback,
  useMemo,
  useState,
} from 'react';

type ValidateOk = {
  valid: true;
  oib?: string;
  validFrom?: string;
  validUntil?: string;
};

type ValidateFail = { valid: false; error?: string };

type SaveOk = { success: true; oib?: string; validUntil?: string };
type SaveFail = { success: false; error?: string };

const MAX_BYTES = 1024 * 1024;

function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={`inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#2a3734] border-t-[#0d9488] ${className ?? ''}`}
      aria-hidden
    />
  );
}

export default function FiskalizacijaWizardPage() {
  const [step, setStep] = useState(1);
  const [p12File, setP12File] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [poslovniProstor, setPoslovniProstor] = useState('');
  const [blagajna, setBlagajna] = useState('');
  const [validateLoading, setValidateLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [validateResult, setValidateResult] = useState<ValidateOk | ValidateFail | null>(
    null,
  );
  const [saveError, setSaveError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  const progressPct = useMemo(() => (step / 6) * 100, [step]);

  const pickFile = useCallback((file: File | null) => {
    if (!file) {
      return;
    }
    if (!file.name.toLowerCase().endsWith('.p12')) {
      setToast({ type: 'error', message: 'Dozvoljene su samo .p12 datoteke.' });
      return;
    }
    if (file.size > MAX_BYTES) {
      setToast({ type: 'error', message: 'Datoteka ne smije biti veća od 1MB.' });
      return;
    }
    setP12File(file);
    setValidateResult(null);
    setToast(null);
  }, []);

  const onFileInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      pickFile(file);
      event.target.value = '';
    },
    [pickFile],
  );

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragActive(false);
      const file = event.dataTransfer.files?.[0] ?? null;
      pickFile(file);
    },
    [pickFile],
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setDragActive(false);
  }, []);

  const runValidate = useCallback(async () => {
    if (!p12File || !password) {
      return;
    }
    setValidateLoading(true);
    setValidateResult(null);
    setToast(null);
    try {
      const fd = new FormData();
      fd.set('p12File', p12File);
      fd.set('password', password);
      const res = await fetch('/api/fiscal/certificate/validate', {
        method: 'POST',
        body: fd,
      });
      const data = (await res.json()) as ValidateOk | ValidateFail;
      if (data.valid) {
        setValidateResult({
          valid: true,
          oib: data.oib,
          validFrom: typeof data.validFrom === 'string' ? data.validFrom : undefined,
          validUntil: typeof data.validUntil === 'string' ? data.validUntil : undefined,
        });
      } else {
        setValidateResult({ valid: false, error: data.error ?? 'Validacija nije uspjela.' });
      }
    } catch {
      setValidateResult({ valid: false, error: 'Mrežna greška pri validaciji.' });
    } finally {
      setValidateLoading(false);
    }
  }, [p12File, password]);

  const runSave = useCallback(async () => {
    if (!p12File || !password || !poslovniProstor.trim() || !blagajna.trim()) {
      return;
    }
    setSaveLoading(true);
    setSaveError(null);
    try {
      const fd = new FormData();
      fd.set('p12File', p12File);
      fd.set('password', password);
      fd.set('poslovniProstor', poslovniProstor.trim());
      fd.set('blagajna', blagajna.trim());
      const res = await fetch('/api/fiscal/certificate', { method: 'POST', body: fd });
      const data = (await res.json()) as SaveOk | SaveFail;
      if (res.ok && 'success' in data && data.success) {
        setStep(6);
        setPassword('');
      } else {
        setSaveError(
          'success' in data && data.success === false && data.error
            ? data.error
            : 'Spremanje nije uspjelo.',
        );
      }
    } catch {
      setSaveError('Mrežna greška pri spremanju.');
    } finally {
      setSaveLoading(false);
    }
  }, [p12File, password, poslovniProstor, blagajna]);

  const startSaveFromStep4 = useCallback(() => {
    setStep(5);
    void runSave();
  }, [runSave]);

  const formatDate = (iso?: string) => {
    if (!iso) {
      return '—';
    }
    try {
      return new Date(iso).toLocaleDateString('hr-HR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const validUntilIso =
    validateResult && validateResult.valid ? validateResult.validUntil : undefined;

  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-8 text-[#e2e8e7] sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-2xl flex-col gap-6'>
        <div className='h-2 overflow-hidden rounded-full bg-[#1f2a28]'>
          <div
            className='h-full rounded-full bg-[#0d9488] transition-[width] duration-500 ease-out'
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <header className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          <p className='font-body text-sm text-[#94a3a0]'>Postavke · Fiskalizacija</p>
          <h1 className='font-heading mt-2 text-2xl sm:text-3xl'>FINA certifikat</h1>
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

        <section className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          {step === 1 ? (
            <div className='space-y-5'>
              <h2 className='font-heading text-xl'>Postavi FINA certifikat</h2>
              <p className='font-body text-sm leading-relaxed text-[#b9c7c4]'>
                Za fiskalizaciju računa trebaš FINA poslovni certifikat (~40€ / 5 godina).
                Nabavi ga na fina.hr → Certifikati → Poslovni certifikati.
              </p>
              <p>
                <a
                  href='https://www.fina.hr'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-body text-sm font-semibold text-[#5eead4] underline decoration-[#0d9488] underline-offset-4 hover:text-[#14b8a6]'
                >
                  fina.hr →
                </a>
              </p>
              <button
                type='button'
                onClick={() => setStep(2)}
                className='font-body rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6]'
              >
                Imam certifikat, nastavi →
              </button>
            </div>
          ) : null}

          {step === 2 ? (
            <div className='space-y-5'>
              <h2 className='font-heading text-xl'>Učitaj .p12</h2>
              <div
                role='button'
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    document.getElementById('fiscal-p12-input')?.click();
                  }
                }}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => document.getElementById('fiscal-p12-input')?.click()}
                className={`cursor-pointer rounded-2xl border-2 border-dashed px-4 py-10 text-center transition ${
                  dragActive
                    ? 'border-[#0d9488] bg-[#0d9488]/10'
                    : 'border-[#2a3734] bg-[#0b0f0e] hover:border-[#0d9488]/60'
                }`}
              >
                <input
                  id='fiscal-p12-input'
                  type='file'
                  accept='.p12'
                  className='sr-only'
                  onChange={onFileInput}
                />
                <p className='font-body text-sm text-[#b9c7c4]'>
                  Povuci i ispusti .p12 ovdje ili klikni za odabir
                </p>
                {p12File ? (
                  <p className='font-body mt-3 text-sm font-medium text-[#e2e8e7]'>
                    {p12File.name}
                  </p>
                ) : null}
              </div>
              <label className='block'>
                <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                  Lozinka certifikata
                </span>
                <input
                  type='password'
                  autoComplete='off'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                />
              </label>
              <div className='flex flex-wrap gap-3'>
                <button
                  type='button'
                  onClick={() => setStep(1)}
                  className='font-body rounded-xl border border-[#2a3734] px-4 py-2 text-sm text-[#b9c7c4] transition hover:bg-[#1f2a28]'
                >
                  Natrag
                </button>
                <button
                  type='button'
                  disabled={!p12File || !password}
                  onClick={() => {
                    setStep(3);
                    void runValidate();
                  }}
                  className='font-body rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-50'
                >
                  Provjeri certifikat →
                </button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className='space-y-5'>
              <h2 className='font-heading text-xl'>Rezultat provjere</h2>
              {validateLoading ? (
                <div className='flex items-center gap-3 py-6'>
                  <Spinner />
                  <span className='font-body text-sm text-[#b9c7c4]'>Provjeravamo...</span>
                </div>
              ) : validateResult?.valid ? (
                <div className='space-y-3 rounded-xl border border-[#0d9488]/35 bg-[#0d9488]/10 p-4'>
                  <p className='font-body text-lg text-[#5eead4]'>✓ Certifikat je valjan</p>
                  {validateResult.oib ? (
                    <p className='font-body text-sm text-[#e2e8e7]'>
                      OIB: <span className='font-semibold'>{validateResult.oib}</span>
                    </p>
                  ) : null}
                  <p className='font-body text-sm text-[#b9c7c4]'>
                    Vrijedi do:{' '}
                    <span className='text-[#e2e8e7]'>{formatDate(validUntilIso)}</span>
                  </p>
                </div>
              ) : (
                <p className='font-body rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200'>
                  {validateResult?.valid === false
                    ? validateResult.error ?? 'Greška'
                    : 'Nema podataka o validaciji.'}
                </p>
              )}
              <div className='flex flex-wrap gap-3'>
                <button
                  type='button'
                  onClick={() => setStep(2)}
                  className='font-body rounded-xl border border-[#2a3734] px-4 py-2 text-sm text-[#b9c7c4] transition hover:bg-[#1f2a28]'
                >
                  Natrag
                </button>
                <button
                  type='button'
                  disabled={validateLoading || !validateResult?.valid}
                  onClick={() => setStep(4)}
                  className='font-body rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-50'
                >
                  Izgleda dobro, nastavi →
                </button>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className='space-y-5'>
              <h2 className='font-heading text-xl'>Poslovni prostor i blagajna</h2>
              <p className='font-body text-sm text-[#94a3a0]'>
                Ove oznake moraju odgovarati registraciji u ePorezna sustavu.
              </p>
              <label className='block'>
                <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                  Oznaka poslovnog prostora
                </span>
                <input
                  value={poslovniProstor}
                  onChange={(e) => setPoslovniProstor(e.target.value)}
                  placeholder='PP1'
                  className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                />
              </label>
              <label className='block'>
                <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                  Oznaka blagajne
                </span>
                <input
                  value={blagajna}
                  onChange={(e) => setBlagajna(e.target.value)}
                  placeholder='BL1'
                  className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                />
              </label>
              <div className='flex flex-wrap gap-3'>
                <button
                  type='button'
                  onClick={() => setStep(3)}
                  className='font-body rounded-xl border border-[#2a3734] px-4 py-2 text-sm text-[#b9c7c4] transition hover:bg-[#1f2a28]'
                >
                  Natrag
                </button>
                <button
                  type='button'
                  disabled={!poslovniProstor.trim() || !blagajna.trim()}
                  onClick={() => startSaveFromStep4()}
                  className='font-body rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-50'
                >
                  Nastavi →
                </button>
              </div>
            </div>
          ) : null}

          {step === 5 ? (
            <div className='space-y-5'>
              <h2 className='font-heading text-xl'>Spremanje</h2>
              {saveLoading ? (
                <div className='flex flex-col items-center gap-4 py-8'>
                  <Spinner />
                  <p className='font-body text-center text-sm text-[#b9c7c4]'>
                    Enkriptiramo i spremamo certifikat...
                  </p>
                </div>
              ) : (
                <>
                  {saveError ? (
                    <p className='font-body rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200'>
                      {saveError}
                    </p>
                  ) : null}
                  <div className='flex flex-wrap gap-3'>
                    <button
                      type='button'
                      onClick={() => setStep(4)}
                      disabled={saveLoading}
                      className='font-body rounded-xl border border-[#2a3734] px-4 py-2 text-sm text-[#b9c7c4] transition hover:bg-[#1f2a28] disabled:opacity-50'
                    >
                      Natrag
                    </button>
                    {saveError ? (
                      <button
                        type='button'
                        disabled={saveLoading}
                        onClick={() => void runSave()}
                        className='font-body rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        Pokušaj ponovno
                      </button>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          ) : null}

          {step === 6 ? (
            <div className='space-y-6 text-center'>
              <div className='text-5xl' aria-hidden>
                ✅
              </div>
              <h2 className='font-heading text-2xl'>Fiskalizacija je aktivna!</h2>
              <div className='rounded-xl border border-[#2a3734] bg-[#0b0f0e] p-4 text-left font-body text-sm text-[#b9c7c4]'>
                <p>
                  OIB:{' '}
                  <span className='text-[#e2e8e7]'>
                    {validateResult && validateResult.valid ? validateResult.oib ?? '—' : '—'}
                  </span>
                </p>
                <p className='mt-2'>
                  Vrijedi do:{' '}
                  <span className='text-[#e2e8e7]'>{formatDate(validUntilIso)}</span>
                </p>
                <p className='mt-2'>
                  Poslovni prostor:{' '}
                  <span className='text-[#e2e8e7]'>{poslovniProstor || '—'}</span>
                </p>
                <p className='mt-2'>
                  Blagajna: <span className='text-[#e2e8e7]'>{blagajna || '—'}</span>
                </p>
              </div>
              <Link
                href='/racuni'
                className='inline-flex font-body rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6]'
              >
                Idi na račune →
              </Link>
            </div>
          ) : null}
        </section>

        <p className='text-center font-body text-xs text-[#94a3a0]'>
          <Link href='/postavke' className='underline decoration-[#2a3734] hover:text-[#b9c7c4]'>
            ← Natrag na postavke
          </Link>
        </p>
      </div>
    </main>
  );
}

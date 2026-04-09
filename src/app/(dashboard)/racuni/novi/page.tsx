'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';

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
  stavkaOpis: string;
  stavkaKolicina: string;
  stavkaCijena: string;
};

export default function NoviRacunPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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
    stavkaOpis: '',
    stavkaKolicina: '1',
    stavkaCijena: '0',
  });

  const ukupno = useMemo(() => {
    return (
      (Number(formState.stavkaKolicina) || 0) * (Number(formState.stavkaCijena) || 0)
    );
  }, [formState.stavkaCijena, formState.stavkaKolicina]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
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
        stavka: {
          opis: formState.stavkaOpis,
          kolicina: Number(formState.stavkaKolicina),
          jedinicnaCijena: Number(formState.stavkaCijena),
        },
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
          <p className='font-body text-sm text-[#94a3a0]'>Kreiranje dokumenta</p>
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
                placeholder='1/1/2026'
              />
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
                    nacinPlacanja: event.target.value as FormState['nacinPlacanja'],
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
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    kupacNaziv: event.target.value,
                  }))
                }
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              />
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

          <section className='grid gap-4 sm:grid-cols-3'>
            <label className='block sm:col-span-3'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Opis stavke
              </span>
              <input
                required
                value={formState.stavkaOpis}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    stavkaOpis: event.target.value,
                  }))
                }
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
                placeholder='Knjigovodstvene usluge'
              />
            </label>
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Količina
              </span>
              <input
                required
                type='number'
                min='0'
                step='0.01'
                value={formState.stavkaKolicina}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    stavkaKolicina: event.target.value,
                  }))
                }
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              />
            </label>
            <label className='block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Jedinična cijena
              </span>
              <input
                required
                type='number'
                min='0'
                step='0.01'
                value={formState.stavkaCijena}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    stavkaCijena: event.target.value,
                  }))
                }
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              />
            </label>
            <div className='flex items-end'>
              <p className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-sm text-[#d5dfdd]'>
                Ukupno: {ukupno.toFixed(2)} EUR
              </p>
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

'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

import { createClient } from '@/lib/supabase/client';

type Kupac = {
  id: string;
  naziv: string;
  oib: string | null;
  adresa: string | null;
  email: string | null;
};

type FormState = {
  naziv: string;
  oib: string;
  adresa: string;
  email: string;
};

const EMPTY_FORM: FormState = {
  naziv: '',
  oib: '',
  adresa: '',
  email: '',
};

export default function KupciPage() {
  const supabase = useMemo(() => createClient(), []);
  const [kupci, setKupci] = useState<Kupac[]>([]);
  const [formState, setFormState] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function loadKupci() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }
    const { data, error: loadError } = await supabase
      .from('kupci')
      .select('id, naziv, oib, adresa, email')
      .eq('user_id', user.id)
      .order('naziv', { ascending: true });
    if (loadError) {
      setError(loadError.message);
      return;
    }
    setKupci((data ?? []) as Kupac[]);
  }

  useEffect(() => {
    void loadKupci();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError('Nisi prijavljen.');
      return;
    }

    const payload = {
      user_id: user.id,
      naziv: formState.naziv.trim(),
      oib: formState.oib.trim() || null,
      adresa: formState.adresa.trim() || null,
      email: formState.email.trim() || null,
    };
    if (!payload.naziv) {
      setError('Naziv kupca je obavezan.');
      return;
    }

    const result = editingId
      ? await supabase
          .from('kupci')
          .update(payload)
          .eq('id', editingId)
          .eq('user_id', user.id)
      : await supabase.from('kupci').insert(payload);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setFormState(EMPTY_FORM);
    setEditingId(null);
    await loadKupci();
  }

  async function deleteKupac(id: string) {
    const { error: deleteError } = await supabase.from('kupci').delete().eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    await loadKupci();
  }

  function startEdit(kupac: Kupac) {
    setEditingId(kupac.id);
    setFormState({
      naziv: kupac.naziv,
      oib: kupac.oib ?? '',
      adresa: kupac.adresa ?? '',
      email: kupac.email ?? '',
    });
  }

  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-8 text-[#e2e8e7] sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-6'>
        <header className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          <p className='font-body text-sm text-[#94a3a0]'>Baza kupaca</p>
          <h1 className='font-heading mt-2 text-2xl sm:text-3xl'>Kupci</h1>
          <p className='font-body mt-3 text-sm text-[#b9c7c4]'>
            Spremljeni kupci automatski se nude pri izradi novog računa.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className='grid gap-4 rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:grid-cols-2'
        >
          <label className='block'>
            <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>Naziv</span>
            <input
              required
              value={formState.naziv}
              onChange={(event) =>
                setFormState((previous) => ({
                  ...previous,
                  naziv: event.target.value,
                }))
              }
              className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              placeholder='Studio Kreativ d.o.o.'
            />
          </label>
          <label className='block'>
            <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>OIB</span>
            <input
              value={formState.oib}
              onChange={(event) =>
                setFormState((previous) => ({
                  ...previous,
                  oib: event.target.value,
                }))
              }
              className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
            />
          </label>
          <label className='block'>
            <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>Adresa</span>
            <input
              value={formState.adresa}
              onChange={(event) =>
                setFormState((previous) => ({
                  ...previous,
                  adresa: event.target.value,
                }))
              }
              className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
            />
          </label>
          <label className='block'>
            <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>Email</span>
            <input
              type='email'
              value={formState.email}
              onChange={(event) =>
                setFormState((previous) => ({
                  ...previous,
                  email: event.target.value,
                }))
              }
              className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
            />
          </label>
          <div className='flex flex-wrap gap-3 sm:col-span-2'>
            <button
              type='submit'
              className='font-body rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6]'
            >
              {editingId ? 'Spremi kupca' : 'Dodaj kupca'}
            </button>
            {editingId ? (
              <button
                type='button'
                onClick={() => {
                  setEditingId(null);
                  setFormState(EMPTY_FORM);
                }}
                className='font-body rounded-xl border border-[#2a3734] px-5 py-3 text-[#d5dfdd] transition hover:border-[#0d9488]'
              >
                Odustani
              </button>
            ) : null}
          </div>
        </form>

        {error ? (
          <p className='font-body rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200'>
            {error}
          </p>
        ) : null}

        <section className='overflow-x-auto rounded-2xl border border-[#1f2a28] bg-[#111716]'>
          <table className='min-w-full divide-y divide-[#24312f]'>
            <thead>
              <tr className='text-left text-sm text-[#94a3a0]'>
                <th className='px-4 py-3 font-medium'>Naziv</th>
                <th className='px-4 py-3 font-medium'>OIB</th>
                <th className='px-4 py-3 font-medium'>Adresa</th>
                <th className='px-4 py-3 font-medium'>Email</th>
                <th className='px-4 py-3 font-medium'>Akcije</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-[#24312f]'>
              {kupci.map((kupac) => (
                <tr key={kupac.id} className='text-sm'>
                  <td className='px-4 py-4'>{kupac.naziv}</td>
                  <td className='px-4 py-4'>{kupac.oib ?? '-'}</td>
                  <td className='px-4 py-4'>{kupac.adresa ?? '-'}</td>
                  <td className='px-4 py-4'>{kupac.email ?? '-'}</td>
                  <td className='px-4 py-4'>
                    <div className='flex flex-wrap gap-2'>
                      <button
                        type='button'
                        onClick={() => startEdit(kupac)}
                        className='rounded-lg border border-[#2a3734] px-3 py-2 text-xs text-[#d5dfdd] transition hover:border-[#0d9488]'
                      >
                        Uredi
                      </button>
                      <button
                        type='button'
                        onClick={() => void deleteKupac(kupac.id)}
                        className='rounded-lg border border-red-500/30 px-3 py-2 text-xs text-red-200 transition hover:bg-red-500/10'
                      >
                        Obriši
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}

'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

import { formatIznosEurHr } from '@/lib/format-hr';
import { createClient } from '@/lib/supabase/client';

type Artikl = {
  id: string;
  naziv: string;
  jedinicna_cijena: number | string;
};

export default function StavkePage() {
  const supabase = useMemo(() => createClient(), []);
  const [artikli, setArtikli] = useState<Artikl[]>([]);
  const [naziv, setNaziv] = useState('');
  const [cijena, setCijena] = useState('0');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function loadArtikli() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }
    const { data, error: loadError } = await supabase
      .from('artikli')
      .select('id, naziv, jedinicna_cijena')
      .eq('user_id', user.id)
      .order('naziv', { ascending: true });
    if (loadError) {
      setError(loadError.message);
      return;
    }
    setArtikli((data ?? []) as Artikl[]);
  }

  useEffect(() => {
    void loadArtikli();
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
      naziv: naziv.trim(),
      jedinicna_cijena: Number(cijena) || 0,
    };
    if (!payload.naziv) {
      setError('Naziv stavke je obavezan.');
      return;
    }

    const result = editingId
      ? await supabase
          .from('artikli')
          .update(payload)
          .eq('id', editingId)
          .eq('user_id', user.id)
      : await supabase.from('artikli').insert(payload);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setNaziv('');
    setCijena('0');
    setEditingId(null);
    await loadArtikli();
  }

  async function deleteArtikl(id: string) {
    const { error: deleteError } = await supabase.from('artikli').delete().eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    await loadArtikli();
  }

  function startEdit(artikl: Artikl) {
    setEditingId(artikl.id);
    setNaziv(artikl.naziv);
    setCijena(String(artikl.jedinicna_cijena ?? 0));
  }

  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-8 text-[#e2e8e7] sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-6'>
        <header className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          <p className='font-body text-sm text-[#94a3a0]'>Katalog stavki</p>
          <h1 className='font-heading mt-2 text-2xl sm:text-3xl'>Stavke</h1>
          <p className='font-body mt-3 text-sm text-[#b9c7c4]'>
            Spremljene stavke automatski se nude pri izradi novog računa.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className='grid gap-4 rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:grid-cols-[1fr_12rem_auto]'
        >
          <label className='block'>
            <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>Naziv</span>
            <input
              required
              value={naziv}
              onChange={(event) => setNaziv(event.target.value)}
              className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              placeholder='Usluga savjetovanja'
            />
          </label>
          <label className='block'>
            <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
              Jed. cijena
            </span>
            <input
              required
              type='number'
              min='0'
              step='0.01'
              value={cijena}
              onChange={(event) => setCijena(event.target.value)}
              className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
            />
          </label>
          <div className='flex items-end'>
            <button
              type='submit'
              className='font-body w-full rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6]'
            >
              {editingId ? 'Spremi' : 'Dodaj'}
            </button>
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
                <th className='px-4 py-3 font-medium'>Jed. cijena</th>
                <th className='px-4 py-3 font-medium'>Akcije</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-[#24312f]'>
              {artikli.map((artikl) => (
                <tr key={artikl.id} className='text-sm'>
                  <td className='px-4 py-4'>{artikl.naziv}</td>
                  <td className='px-4 py-4'>
                    {formatIznosEurHr(Number(artikl.jedinicna_cijena ?? 0))}
                  </td>
                  <td className='px-4 py-4'>
                    <div className='flex flex-wrap gap-2'>
                      <button
                        type='button'
                        onClick={() => startEdit(artikl)}
                        className='rounded-lg border border-[#2a3734] px-3 py-2 text-xs text-[#d5dfdd] transition hover:border-[#0d9488]'
                      >
                        Uredi
                      </button>
                      <button
                        type='button'
                        onClick={() => void deleteArtikl(artikl.id)}
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

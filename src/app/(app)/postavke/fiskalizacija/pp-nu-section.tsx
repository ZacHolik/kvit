'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type PoslovniProstor = {
  id: string;
  oznaka: string;
  adresa: string | null;
  radno_vrijeme: string | null;
  is_active: boolean;
};

type NaplatniUredaj = {
  id: string;
  poslovni_prostor_id: string;
  oznaka: string;
  is_active: boolean;
};

type InvoiceCounter = {
  poslovni_prostor: string;
  blagajna: string;
  godina: number;
  zadnji_broj: number;
};

function counterLabel(
  counters: InvoiceCounter[],
  godina: number,
  ppOznaka: string,
  nuOznaka: string,
): string {
  const row = counters.find(
    (c) =>
      c.godina === godina &&
      c.poslovni_prostor === ppOznaka &&
      c.blagajna === nuOznaka,
  );
  if (!row) {
    return 'Još nema izdanih računa';
  }
  return `Zadnji broj: ${row.zadnji_broj}`;
}

export function PpNuSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pps, setPps] = useState<PoslovniProstor[]>([]);
  const [nusByPp, setNusByPp] = useState<Record<string, NaplatniUredaj[]>>({});
  const [counters, setCounters] = useState<InvoiceCounter[]>([]);
  const [godina, setGodina] = useState(() => new Date().getFullYear());
  const [openPp, setOpenPp] = useState<string | null>(null);

  const [newPpOznaka, setNewPpOznaka] = useState('');
  const [newPpAdresa, setNewPpAdresa] = useState('');
  const [newPpRadno, setNewPpRadno] = useState('');

  const [editPp, setEditPp] = useState<Record<string, { oznaka: string; adresa: string; radno: string }>>(
    {},
  );
  const [newNu, setNewNu] = useState<Record<string, string>>({});
  const [editNu, setEditNu] = useState<Record<string, string>>({});

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const resPp = await fetch('/api/fiscal/poslovni-prostori');
      const dataPp = (await resPp.json()) as {
        poslovniProstori?: PoslovniProstor[];
        invoiceCounters?: InvoiceCounter[];
        godina?: number;
        error?: string;
      };
      if (!resPp.ok) {
        setError(dataPp.error ?? 'Učitavanje PP nije uspjelo.');
        setPps([]);
        setCounters([]);
        return;
      }
      setPps(dataPp.poslovniProstori ?? []);
      setCounters(dataPp.invoiceCounters ?? []);
      if (typeof dataPp.godina === 'number') {
        setGodina(dataPp.godina);
      }

      const ppList = dataPp.poslovniProstori ?? [];
      const nuMap: Record<string, NaplatniUredaj[]> = {};
      await Promise.all(
        ppList.map(async (pp) => {
          const r = await fetch(
            `/api/fiscal/naplatni-uredaji?poslovni_prostor_id=${encodeURIComponent(pp.id)}`,
          );
          const d = (await r.json()) as { naplatniUredaji?: NaplatniUredaj[] };
          nuMap[pp.id] = d.naplatniUredaji ?? [];
        }),
      );
      setNusByPp(nuMap);

      const ed: Record<string, { oznaka: string; adresa: string; radno: string }> = {};
      for (const p of ppList) {
        ed[p.id] = {
          oznaka: p.oznaka,
          adresa: p.adresa ?? '',
          radno: p.radno_vrijeme ?? '',
        };
      }
      setEditPp(ed);

      const nuEdits: Record<string, string> = {};
      for (const list of Object.values(nuMap)) {
        for (const nu of list) {
          nuEdits[nu.id] = nu.oznaka;
        }
      }
      setEditNu(nuEdits);
    } catch {
      setError('Mrežna greška.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const hasAnyPp = pps.length > 0;

  const sortedPps = useMemo(
    () => [...pps].sort((a, b) => a.oznaka.localeCompare(b.oznaka, 'hr')),
    [pps],
  );

  async function addPp() {
    const oznaka = newPpOznaka.trim();
    if (!oznaka) {
      return;
    }
    const res = await fetch('/api/fiscal/poslovni-prostori', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        oznaka,
        adresa: newPpAdresa.trim() || null,
        radno_vrijeme: newPpRadno.trim() || null,
      }),
    });
    const d = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(d.error ?? 'Spremanje nije uspjelo.');
      return;
    }
    setNewPpOznaka('');
    setNewPpAdresa('');
    setNewPpRadno('');
    await loadAll();
  }

  async function savePp(id: string) {
    const ed = editPp[id];
    if (!ed) {
      return;
    }
    const res = await fetch(`/api/fiscal/poslovni-prostori/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        oznaka: ed.oznaka.trim(),
        adresa: ed.adresa.trim() || null,
        radno_vrijeme: ed.radno.trim() || null,
      }),
    });
    const d = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(d.error ?? 'Ažuriranje nije uspjelo.');
      return;
    }
    setError('');
    await loadAll();
  }

  async function deactivatePp(id: string) {
    if (!window.confirm('Deaktivirati poslovni prostor?')) {
      return;
    }
    const res = await fetch(`/api/fiscal/poslovni-prostori/${id}`, { method: 'DELETE' });
    const d = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(d.error ?? 'Brisanje nije uspjelo.');
      return;
    }
    setError('');
    await loadAll();
  }

  async function addNu(ppId: string) {
    const oznaka = (newNu[ppId] ?? '').trim();
    if (!oznaka) {
      return;
    }
    const res = await fetch('/api/fiscal/naplatni-uredaji', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oznaka, poslovni_prostor_id: ppId }),
    });
    const d = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(d.error ?? 'Spremanje NU nije uspjelo.');
      return;
    }
    setNewNu((prev) => ({ ...prev, [ppId]: '' }));
    setError('');
    await loadAll();
  }

  async function saveNu(id: string) {
    let oznaka = (editNu[id] ?? '').trim();
    if (!oznaka) {
      for (const list of Object.values(nusByPp)) {
        const n = list.find((x) => x.id === id);
        if (n) {
          oznaka = n.oznaka;
          break;
        }
      }
    }
    if (!oznaka) {
      return;
    }
    const res = await fetch(`/api/fiscal/naplatni-uredaji/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oznaka }),
    });
    const d = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(d.error ?? 'Ažuriranje NU nije uspjelo.');
      return;
    }
    setError('');
    await loadAll();
  }

  async function deactivateNu(id: string) {
    if (!window.confirm('Deaktivirati naplatni uređaj?')) {
      return;
    }
    const res = await fetch(`/api/fiscal/naplatni-uredaji/${id}`, { method: 'DELETE' });
    const d = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(d.error ?? 'Deaktivacija nije uspjela.');
      return;
    }
    setError('');
    await loadAll();
  }

  return (
    <section className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
      <h2 className='font-heading text-xl text-[#e2e8e7]'>
        Poslovni prostori i naplatni uređaji
      </h2>
      <p className='font-body mt-2 text-sm text-[#94a3a0]'>
        Oznake moraju odgovarati ePoreznoj. Brojač računa ({godina}.) po paru PP/NU.
      </p>

      {error ? (
        <p className='font-body mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200'>
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className='font-body mt-6 text-sm text-[#94a3a0]'>Učitavam…</p>
      ) : !hasAnyPp ? (
        <p className='font-body mt-6 rounded-xl border border-[#2a3734] bg-[#0b0f0e] p-4 text-sm text-[#b9c7c4]'>
          Nemaš dodanih poslovnih prostora. Dodaj prvi da možeš izdavati fiskalizirane račune.
        </p>
      ) : (
        <div className='mt-6 space-y-3'>
          {sortedPps.map((pp) => {
            const open = openPp === pp.id;
            const nus = nusByPp[pp.id] ?? [];
            const ed = editPp[pp.id];
            return (
              <div
                key={pp.id}
                className='rounded-xl border border-[#2a3734] bg-[#0b0f0e] p-4'
              >
                <button
                  type='button'
                  onClick={() => setOpenPp(open ? null : pp.id)}
                  className='flex w-full items-center justify-between text-left font-heading text-sm font-semibold text-[#e2e8e7]'
                >
                  <span>PP: {pp.oznaka}</span>
                  <span className='text-[#94a3a0]'>{open ? '▼' : '▶'}</span>
                </button>
                {open ? (
                  <div className='mt-4 space-y-4 border-t border-[#24312f] pt-4'>
                    {ed ? (
                      <div className='grid gap-3 sm:grid-cols-2'>
                        <label className='block sm:col-span-2'>
                          <span className='font-body text-xs text-[#94a3a0]'>Oznaka PP</span>
                          <input
                            value={ed.oznaka}
                            onChange={(e) =>
                              setEditPp((p) => ({
                                ...p,
                                [pp.id]: { ...ed, oznaka: e.target.value },
                              }))
                            }
                            className='font-body mt-1 w-full rounded-lg border border-[#2a3734] bg-[#111716] px-3 py-2 text-sm text-[#e2e8e7] outline-none focus:border-[#0d9488]'
                          />
                        </label>
                        <label className='block sm:col-span-2'>
                          <span className='font-body text-xs text-[#94a3a0]'>Adresa (opc.)</span>
                          <input
                            value={ed.adresa}
                            onChange={(e) =>
                              setEditPp((p) => ({
                                ...p,
                                [pp.id]: { ...ed, adresa: e.target.value },
                              }))
                            }
                            className='font-body mt-1 w-full rounded-lg border border-[#2a3734] bg-[#111716] px-3 py-2 text-sm text-[#e2e8e7] outline-none focus:border-[#0d9488]'
                          />
                        </label>
                        <label className='block sm:col-span-2'>
                          <span className='font-body text-xs text-[#94a3a0]'>
                            Radno vrijeme (opc.)
                          </span>
                          <input
                            value={ed.radno}
                            onChange={(e) =>
                              setEditPp((p) => ({
                                ...p,
                                [pp.id]: { ...ed, radno: e.target.value },
                              }))
                            }
                            className='font-body mt-1 w-full rounded-lg border border-[#2a3734] bg-[#111716] px-3 py-2 text-sm text-[#e2e8e7] outline-none focus:border-[#0d9488]'
                          />
                        </label>
                        <div className='flex flex-wrap gap-2 sm:col-span-2'>
                          <button
                            type='button'
                            onClick={() => void savePp(pp.id)}
                            className='rounded-lg bg-[#0d9488] px-3 py-2 text-xs font-semibold text-white hover:bg-[#14b8a6]'
                          >
                            Spremi PP
                          </button>
                          <button
                            type='button'
                            onClick={() => void deactivatePp(pp.id)}
                            className='rounded-lg border border-red-500/40 px-3 py-2 text-xs text-red-200 hover:bg-red-500/10'
                          >
                            Deaktiviraj PP
                          </button>
                        </div>
                      </div>
                    ) : null}

                    <div>
                      <p className='font-body text-xs font-semibold uppercase tracking-wide text-[#94a3a0]'>
                        Naplatni uređaji
                      </p>
                      <ul className='mt-2 space-y-2'>
                        {nus.map((nu) => (
                          <li
                            key={nu.id}
                            className='flex flex-col gap-2 rounded-lg border border-[#24312f] bg-[#111716] p-3 sm:flex-row sm:items-center sm:justify-between'
                          >
                            <div className='flex flex-1 flex-col gap-1'>
                              <input
                                value={editNu[nu.id] ?? nu.oznaka}
                                onChange={(e) =>
                                  setEditNu((m) => ({ ...m, [nu.id]: e.target.value }))
                                }
                                className='font-body max-w-xs rounded border border-[#2a3734] bg-[#0b0f0e] px-2 py-1 text-sm text-[#e2e8e7]'
                              />
                              <span className='font-body text-xs text-[#94a3a0]'>
                                {counterLabel(counters, godina, pp.oznaka, nu.oznaka)}
                              </span>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                              <button
                                type='button'
                                onClick={() => void saveNu(nu.id)}
                                className='rounded border border-[#2a3734] px-2 py-1 text-xs text-[#d5dfdd] hover:border-[#0d9488]'
                              >
                                Spremi NU
                              </button>
                              <button
                                type='button'
                                onClick={() => void deactivateNu(nu.id)}
                                className='rounded border border-red-500/40 px-2 py-1 text-xs text-red-200'
                              >
                                Deaktiviraj
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                      {nus.length === 0 ? (
                        <p className='font-body mt-2 text-xs text-[#64748b]'>
                          Nema naplatnih uređaja — dodaj barem jedan.
                        </p>
                      ) : null}
                      <div className='mt-3 flex flex-wrap items-end gap-2'>
                        <input
                          placeholder='Nova oznaka NU'
                          value={newNu[pp.id] ?? ''}
                          onChange={(e) =>
                            setNewNu((m) => ({ ...m, [pp.id]: e.target.value }))
                          }
                          className='font-body min-w-[8rem] flex-1 rounded-lg border border-[#2a3734] bg-[#111716] px-3 py-2 text-sm text-[#e2e8e7] outline-none focus:border-[#0d9488]'
                        />
                        <button
                          type='button'
                          onClick={() => void addNu(pp.id)}
                          className='rounded-lg bg-[#0d9488] px-3 py-2 text-xs font-semibold text-white hover:bg-[#14b8a6]'
                        >
                          Dodaj naplatni uređaj
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      <div className='mt-6 space-y-3 rounded-xl border border-[#2a3734] bg-[#0b0f0e] p-4'>
        <p className='font-body text-xs font-semibold uppercase tracking-wide text-[#94a3a0]'>
          Dodaj poslovni prostor
        </p>
        <div className='grid gap-2 sm:grid-cols-2'>
          <input
            placeholder='Oznaka PP (npr. PP1)'
            value={newPpOznaka}
            onChange={(e) => setNewPpOznaka(e.target.value)}
            className='font-body rounded-lg border border-[#2a3734] bg-[#111716] px-3 py-2 text-sm text-[#e2e8e7] outline-none focus:border-[#0d9488] sm:col-span-2'
          />
          <input
            placeholder='Adresa (opc.)'
            value={newPpAdresa}
            onChange={(e) => setNewPpAdresa(e.target.value)}
            className='font-body rounded-lg border border-[#2a3734] bg-[#111716] px-3 py-2 text-sm text-[#e2e8e7] outline-none focus:border-[#0d9488] sm:col-span-2'
          />
          <input
            placeholder='Radno vrijeme (opc.)'
            value={newPpRadno}
            onChange={(e) => setNewPpRadno(e.target.value)}
            className='font-body rounded-lg border border-[#2a3734] bg-[#111716] px-3 py-2 text-sm text-[#e2e8e7] outline-none focus:border-[#0d9488] sm:col-span-2'
          />
        </div>
        <button
          type='button'
          onClick={() => void addPp()}
          className='font-body mt-2 rounded-lg bg-[#0d9488] px-4 py-2 text-sm font-semibold text-white hover:bg-[#14b8a6]'
        >
          Dodaj poslovni prostor
        </button>
      </div>
    </section>
  );
}

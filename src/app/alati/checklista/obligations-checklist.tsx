'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type Section = {
  title: string;
  items: { id: string; label: string }[];
};

const SECTIONS: Section[] = [
  {
    title: 'Mjesečne obveze (do 15. u mjesecu)',
    items: [
      { id: 'mj-doprinosi', label: 'Platiti doprinose (290,98 €)' },
      { id: 'mj-kpr', label: 'Ažurirati KPR s računima prošlog mjeseca' },
      { id: 'mj-pdv', label: 'Provjeriti stanje primitaka (PDV prag)' },
    ],
  },
  {
    title: 'Kvartalne obveze',
    items: [
      { id: 'kv-pausal', label: 'Platiti paušalni porez na dohodak' },
      { id: 'kv-kpr', label: 'Pregledati KPR za kvartal' },
      { id: 'kv-racuni', label: 'Izdati sve potrebne račune' },
    ],
  },
  {
    title: 'Godišnje obveze (do 15. siječnja)',
    items: [
      { id: 'god-po-sd', label: 'Predati PO-SD obrazac u ePoreznoj' },
      { id: 'god-kpr', label: 'Pregledati godišnji KPR' },
      { id: 'god-obveze', label: 'Platiti sve zaostale obveze' },
      { id: 'god-razred', label: 'Provjeriti razred za sljedeću godinu' },
    ],
  },
];

const allIds = SECTIONS.flatMap((s) => s.items.map((i) => i.id));

function storageKey(id: string) {
  return `kvit-checklista-${id}`;
}

function readStored(id: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.localStorage.getItem(storageKey(id)) === '1';
}

export function ObligationsChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const next: Record<string, boolean> = {};
    for (const id of allIds) {
      next[id] = readStored(id);
    }
    setChecked(next);
  }, []);

  const toggle = useCallback((id: string, value: boolean) => {
    setChecked((prev) => ({ ...prev, [id]: value }));
    if (typeof window !== 'undefined') {
      if (value) {
        window.localStorage.setItem(storageKey(id), '1');
      } else {
        window.localStorage.removeItem(storageKey(id));
      }
    }
  }, []);

  const total = allIds.length;
  const done = useMemo(
    () => allIds.filter((id) => checked[id]).length,
    [checked],
  );

  function resetAll() {
    const cleared: Record<string, boolean> = {};
    for (const id of allIds) {
      cleared[id] = false;
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(storageKey(id));
      }
    }
    setChecked(cleared);
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <p className='font-body text-sm text-[#94a3a0]'>
          <span className='font-semibold text-[#0d9488]'>
            {done} od {total}
          </span>{' '}
          obveza završeno
        </p>
        <button
          type='button'
          onClick={resetAll}
          className='self-start rounded-lg border border-[#2a3734] px-4 py-2 text-sm font-medium text-[#d5dfdd] transition hover:border-[#0d9488]/50 hover:bg-[#1f2a28]'
        >
          Resetiraj
        </button>
      </div>

      {SECTIONS.map((section) => (
        <section
          key={section.title}
          className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'
        >
          <h2 className='font-heading text-lg font-semibold text-[#e2e8e7]'>
            {section.title}
          </h2>
          <ul className='mt-4 space-y-3'>
            {section.items.map((item) => (
              <li key={item.id}>
                <label className='flex cursor-pointer items-start gap-3 text-sm text-[#d5dfdd]'>
                  <input
                    type='checkbox'
                    className='mt-1 h-4 w-4 shrink-0 rounded border-[#2a3734] bg-[#0b0f0e] text-[#0d9488] accent-[#0d9488]'
                    checked={Boolean(checked[item.id])}
                    onChange={(e) => toggle(item.id, e.target.checked)}
                  />
                  <span>{item.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

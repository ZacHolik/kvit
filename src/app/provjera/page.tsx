'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Answer = 'da' | 'ne' | 'nepoznato';

const QUESTIONS: Array<{ id: string; text: string }> = [
  { id: 'b2c', text: 'Izdaješ li račune krajnjim potrošačima (B2C)?' },
  { id: 'b2b', text: 'Izdaješ li račune tvrtkama / obrtima s OIB-om (B2B)?' },
  { id: 'cert', text: 'Imaš li FINA certifikat za fiskalizaciju?' },
  { id: 'soft', text: 'Koristiš li program koji šalje račune na CIS (fiskalizacija)?' },
  { id: 'akt', text: 'Imaš li interni akt (brojčani red, PP, NU)?' },
];

function scoreFor(a: Answer): number {
  if (a === 'da') {
    return 1;
  }
  if (a === 'ne') {
    return 0;
  }
  return 0;
}

export default function ProvjeraFiskalizacijePage() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);

  const total = useMemo(() => {
    return QUESTIONS.reduce((s, q) => s + scoreFor(answers[q.id] ?? 'nepoznato'), 0);
  }, [answers]);

  function setAnswer(id: string, v: Answer) {
    setAnswers((prev) => ({ ...prev, [id]: v }));
  }

  const verdict = useMemo(() => {
    if (!submitted) {
      return null;
    }
    if (total >= 4) {
      return {
        title: 'Čini se da si većinom pokriven/a',
        body: 'I dalje provjeri detalje (posebno CIS i interni akt) prije sljedeće sezone ili promjene poslovanja.',
      };
    }
    if (total >= 2) {
      return {
        title: 'Ima rupa koje vrijedi zatvoriti',
        body: 'Najčešće nedostaje certifikat, CIS integracija ili interni akt. Rokovi ovise o situaciji — provjeri s poreznom ili stručnjakom.',
      };
    }
    return {
      title: 'Vjerojatno trebaš pripremu za fiskalizaciju',
      body: 'Kombinacija certifikata, softvera i internog akta je standard. Kvik automatski vodi račune i fiskalizaciju kad to uključiš u postavkama.',
    };
  }, [submitted, total]);

  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-10 text-[#e2e8e7] sm:px-6'>
      <div className='mx-auto max-w-xl space-y-8'>
        <header className='space-y-2'>
          <p className='font-body text-sm text-[#94a3a0]'>Brza provjera · bez registracije</p>
          <h1 className='font-heading text-2xl sm:text-3xl'>Fiskalizacija — što ti treba?</h1>
          <p className='font-body text-sm text-[#b9c7c4]'>
            Pet pitanja — odgovori iskreno. Ovo nije pravni savjet; služi kao podsjetnik.
          </p>
        </header>

        <ol className='space-y-6'>
          {QUESTIONS.map((q, i) => (
            <li
              key={q.id}
              className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-4 sm:p-5'
            >
              <p className='font-heading text-sm font-semibold text-[#e2e8e7]'>
                {i + 1}. {q.text}
              </p>
              <div className='mt-3 flex flex-wrap gap-2'>
                {(['da', 'ne', 'nepoznato'] as const).map((v) => (
                  <button
                    key={v}
                    type='button'
                    onClick={() => setAnswer(q.id, v)}
                    className={`font-body rounded-lg border px-3 py-2 text-xs font-medium transition ${
                      answers[q.id] === v
                        ? 'border-[#0d9488] bg-[#0d9488]/20 text-[#99f6e4]'
                        : 'border-[#2a3734] text-[#b9c7c4] hover:border-[#0d9488]/50'
                    }`}
                  >
                    {v === 'da' ? 'Da' : v === 'ne' ? 'Ne' : 'Ne znam'}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ol>

        <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
          <button
            type='button'
            onClick={() => setSubmitted(true)}
            className='font-body rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6]'
          >
            Prikaži rezultat
          </button>
          <Link
            href='/'
            className='font-body text-center text-sm text-[#94a3a0] underline decoration-[#2a3734] hover:text-[#b9c7c4] sm:text-left'
          >
            ← Natrag na početnu
          </Link>
        </div>

        {verdict ? (
          <section className='space-y-4 rounded-2xl border border-[#0d9488]/35 bg-[#0d9488]/10 p-5'>
            <h2 className='font-heading text-lg text-[#5eead4]'>{verdict.title}</h2>
            <p className='font-body text-sm text-[#b9c7c4]'>{verdict.body}</p>
            <p className='font-body text-xs text-[#94a3a0]'>
              Bodovi (gruba procjena): {total} / {QUESTIONS.length}
            </p>
            <Link
              href='https://kvik.online'
              className='inline-flex font-body rounded-xl border border-[#0d9488] bg-[#0b0f0e] px-4 py-2 text-sm font-semibold text-[#5eead4] transition hover:bg-[#0d9488]/20'
            >
              Kvik to rješava automatski → kvik.online
            </Link>
          </section>
        ) : null}
      </div>
    </main>
  );
}

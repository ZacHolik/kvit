'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { ShareResult } from '@/app/alati/_components/share-result';

type Q = {
  id: string;
  prompt: string;
  choices: { id: string; label: string }[];
  correctId: string;
  explain: string;
};

const QUESTIONS: Q[] = [
  {
    id: 'q1',
    prompt: 'Kada paušalist (izvan PDV-a, tipičan obrt) mora zaprimati eRačune?',
    choices: [
      { id: 'a', label: 'Od 1.1.2026.' },
      { id: 'b', label: 'Od 1.1.2027.' },
      { id: 'c', label: 'Tek kad prijeđe 60.000 € primitaka' },
    ],
    correctId: 'a',
    explain:
      'Zaprimanje eRačuna za tipičnog paušalnog obrtnika veže se uz 1.1.2026. — slanje (izdavanje) u B2B kontekstu često tek 1.1.2027.',
  },
  {
    id: 'q2',
    prompt: 'Je li PDF u prilogu maila isto što i službeni eRačun?',
    choices: [
      { id: 'a', label: 'Da, ako je lijepo formatiran' },
      { id: 'b', label: 'Ne — izvornik je UBL 2.1 XML, ne PDF' },
      { id: 'c', label: 'Da, ako kupac potvrdi čitanje' },
    ],
    correctId: 'b',
    explain:
      'Strukturirani eRačun ide kao XML prema EN 16931 + HR proširenja; PDF može biti prilog za ljude, ali nije izvornik.',
  },
  {
    id: 'q3',
    prompt: 'Što je informacijski posrednik?',
    choices: [
      { id: 'a', label: 'Računovođa koji šalje mailove' },
      { id: 'b', label: 'Servis koji u tvoje ime šalje i zaprima eRačune u sustavu' },
      { id: 'c', label: 'FINA blagajna u poslovnici' },
    ],
    correctId: 'b',
    explain:
      'Posrednik tehnički povezuje tvoj program s mrežom eRačuna; mora biti odabran i potvrđen u ePoreznoj.',
  },
  {
    id: 'q4',
    prompt: 'Gdje potvrđuješ pristupnu točku za eRačune?',
    choices: [
      { id: 'a', label: 'U e-Obrtnici' },
      { id: 'b', label: 'U ePoreznoj → FiskAplikacija → Administracija' },
      { id: 'c', label: 'U HRK ili CNB' },
    ],
    correctId: 'b',
    explain:
      'Bez potvrde pristupne točke kanal nije “živ” — eRačuni ti neće stizati kako treba.',
  },
  {
    id: 'q5',
    prompt: 'Je li MIKROeRACUN plaćena usluga Porezne?',
    choices: [
      { id: 'a', label: 'Da, 7 € mjesečno' },
      { id: 'b', label: 'Ne — besplatna aplikacija za one koji ispunjavaju uvjete' },
      { id: 'c', label: 'Plaća se jednokratno 39,82 €' },
    ],
    correctId: 'b',
    explain:
      'MIKROeRACUN je besplatna opcija u ePoreznoj za male obveznike koji nisu PDV obveznici niti javni naručitelji.',
  },
  {
    id: 'q6',
    prompt: 'Moraš li zbog Fiskalizacije 2.0 kupiti potpuno novi FINA certifikat ako već imaš valjani .p12 za fiskalizaciju 1.0?',
    choices: [
      { id: 'a', label: 'Da, F2.0 zahtijeva novi tip certifikata' },
      { id: 'b', label: 'Ne — isti certifikat vezan je uz OIB, mijenjaju se procesi i kanali' },
      { id: 'c', label: 'Samo ako si u PDV-u' },
    ],
    correctId: 'b',
    explain:
      'Isti aplikativni certifikat služi elektroničkom potpisu; novo je što oko eRačuna radiš kroz posrednika i propisane formate.',
  },
];

export function FiskalKviz() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const score = useMemo(() => {
    let ok = 0;
    for (const q of QUESTIONS) {
      if (answers[q.id] === q.correctId) ok += 1;
    }
    return ok;
  }, [answers]);

  const allAnswered = QUESTIONS.every((q) => answers[q.id]);

  return (
    <div className='mx-auto max-w-2xl space-y-8'>
      {QUESTIONS.map((q, idx) => (
        <section
          key={q.id}
          className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'
        >
          <p className='text-xs font-semibold uppercase tracking-wide text-[#0d9488]'>
            Pitanje {idx + 1} / {QUESTIONS.length}
          </p>
          <h2 className='font-heading mt-2 text-lg font-semibold text-[#e2e8e7]'>{q.prompt}</h2>
          <ul className='mt-4 space-y-2'>
            {q.choices.map((c) => {
              const selected = answers[q.id] === c.id;
              return (
                <li key={c.id}>
                  <button
                    type='button'
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, [q.id]: c.id }));
                      setShowResult(false);
                    }}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                      selected
                        ? 'border-[#0d9488] bg-[#0d9488]/15 text-[#e2e8e7]'
                        : 'border-[#1f2a28] text-[#d5dfdd] hover:border-[#0d9488]/50'
                    }`}
                  >
                    {c.label}
                  </button>
                </li>
              );
            })}
          </ul>
          {showResult && answers[q.id] ? (
            <p
              className={`mt-4 text-sm leading-relaxed ${
                answers[q.id] === q.correctId ? 'text-[#5eead4]' : 'text-[#fca5a5]'
              }`}
            >
              {answers[q.id] === q.correctId ? 'Točno. ' : 'Netočno. '}
              {q.explain}
            </p>
          ) : null}
        </section>
      ))}

      <div className='flex flex-wrap items-center gap-3'>
        <button
          type='button'
          disabled={!allAnswered}
          onClick={() => setShowResult(true)}
          className='btn-cta-primary px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40'
        >
          Prikaži rezultat
        </button>
        {showResult && allAnswered ? (
          <p className='font-heading text-sm font-semibold text-[#e2e8e7]'>
            Rezultat: {score} / {QUESTIONS.length}
          </p>
        ) : null}
      </div>

      {showResult && allAnswered ? (
        <div className='space-y-4'>
          <div className='rounded-2xl border border-[#1f2a28] bg-[#0c1211] p-5 text-sm text-[#b9c7c4]'>
            <p>
              Ovo je edukativni kviz, ne pravni test. Za detalje i iznimke uvijek provjeri službene
              izvore i svog savjetnika. Nastavi čitanje na{' '}
              <Link href='/vodici/fiskalizacija-20' className='text-[#0d9488] hover:underline'>
                Fiskalizacija 2.0 za paušaliste
              </Link>{' '}
              i{' '}
              <Link
                href='/vodici/fina-certifikat-fiskalizacija'
                className='text-[#0d9488] hover:underline'
              >
                FINA certifikat korak po korak
              </Link>
              .
            </p>
          </div>
          <ShareResult
            pageTitle='Provjeri jesi li spreman za fiskalizaciju — 30 sekundi'
            pageUrl='https://kvik.online/provjera'
          />
        </div>
      ) : null}
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useState } from 'react';

async function startAnonymousCheckout() {
  const leadEmail =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('kvik_lead_email') ?? undefined
      : undefined;

  const res = await fetch('/api/stripe/checkout-anonymous', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan: 'monthly', lead_email: leadEmail }),
  });
  const data = (await res.json()) as { url?: string };
  if (data.url) {
    window.location.href = data.url;
  }
}

export default function RegisterLandingPage() {
  const [loading, setLoading] = useState(false);

  const handleCta = async () => {
    setLoading(true);
    await startAnonymousCheckout();
  };

  return (
    <main className='bg-[#0A0A0A] text-white'>
      <section className='flex min-h-screen items-center px-6 py-20'>
        <div className='mx-auto max-w-2xl'>
          <p className='text-xl leading-relaxed text-[#e2e8e7] sm:text-2xl'>
            Tri je ujutro.
          </p>
          <p className='mt-6 text-xl leading-relaxed text-[#e2e8e7] sm:text-2xl'>
            Ne spavaš jer si upravo pročitao da moraš &ldquo;fiskalizirati svaki
            račun&rdquo; — a nisi siguran što to uopće znači.
          </p>
          <p className='mt-6 text-lg leading-relaxed text-[#94a3a0]'>
            U mobitelu imaš otvorena četiri taba. Forum iz 2019. kaže jedno. Članak
            iz 2024. kaže drugo. Porezna stranica se učitava sporo i piše jezikom
            koji kao da nije hrvatski.
          </p>
          <p className='mt-6 text-lg leading-relaxed text-[#94a3a0]'>
            Tipkao si &ldquo;moram li fiskalizirati račun ako sam paušalist&rdquo; i
            sad znaš manje nego prije nego si počeo čitati.
          </p>
        </div>
      </section>

      <section className='bg-white px-6 py-20 text-black'>
        <div className='mx-auto max-w-2xl text-center'>
          <h2 className='mb-6 text-3xl font-bold sm:text-4xl'>
            Nisi glup. I nisi lijen.
          </h2>
          <p className='mb-4 text-lg leading-relaxed'>
            Otvorio si obrt jer znaš svoj posao. Fotografiraš, kodiraš, šišaš,
            prevodiš, gradiš, savjetuješ, pišeš, montiraš, dizajniraš.
          </p>
          <p className='mb-4 text-lg leading-relaxed'>
            Ali uz taj posao stigao je i drugi, nevidljivi: KPR. PO-SD. ZKI. JIR.
            Interni akt. Fiskalizacija.
          </p>
          <p className='mb-4 text-lg leading-relaxed'>
            Nitko ti ih nije objasnio jer se pretpostavlja da ih već znaš.
          </p>
          <p className='mb-6 text-xl font-semibold'>
            Ne znaš ih. Ni 90 od 100 paušalista ih ne zna.
          </p>
          <p className='text-lg italic leading-relaxed text-gray-600'>
            A ispod svega stoji strah koji ne kažeš nikome: Što ako negdje
            pogriješim — a ne saznam dok ne stigne kazna?
          </p>
        </div>
      </section>

      <section className='bg-[#F5F5F5] px-6 py-20 text-black'>
        <div className='mx-auto max-w-2xl'>
          <h2 className='mb-8 text-center text-2xl font-bold sm:text-3xl'>
            Znam gdje si jer svaki paušalist prođe isto.
          </h2>
          <p className='mb-6 text-lg'>
            Otvoriš obrt. Bude ti uzbudljivo tri dana. Onda shvatiš da imaš
            dvadeset pitanja i nijedan jasan odgovor:
          </p>
          <div className='mb-6 space-y-3'>
            {[
              'Trebam li certifikat od FINA-e ili ne?',
              'Kako da vodim Knjigu prometa kad ne znam što je KPR?',
              'PO-SD — do kad se predaje? Kako izgleda?',
              'Što ako mi klijent plati na račun — moram li to fiskalizirati?',
              'Kolika je kazna ako nešto krivo ispunim?',
            ].map((q) => (
              <div key={q} className='rounded-xl bg-white p-4 text-base'>
                {q}
              </div>
            ))}
          </div>
          <p className='mb-4 text-lg'>
            Guglаš. Nađeš deset izvora. Sedam se međusobno protivriječi.
          </p>
          <p className='mb-6 text-lg'>
            Pošalješ mail računovođi. Odgovori za pet dana. Naplati sat vremena.
          </p>
          <p className='text-xl font-semibold'>
            To nije tvoj problem. To je problem alata koji nisi imao.
          </p>
        </div>
      </section>

      <section className='bg-white px-6 py-20 text-black'>
        <div className='mx-auto max-w-2xl'>
          <p className='mb-4 text-lg leading-relaxed'>
            Kvik je aplikacija koja postoji jer nijedna druga ne gleda isključivo
            na tebe — paušalista.
          </p>
          <p className='mb-10 text-lg leading-relaxed'>
            Ne na d.o.o. Ne na računovođu. Ne na &ldquo;sve poduzetnike.&rdquo;
            Samo na tebe. I svaki dio Kvika radi jednu stvar: makne ti ono od
            čega te hvata grč u želucu.
          </p>

          <div className='space-y-8'>
            <div>
              <p className='mb-1 text-lg font-bold'>Onaj google u tri ujutro?</p>
              <p className='text-gray-700'>
                Kvik ima AI asistenta koji odgovara na porezna pitanja u sekundi —
                ne za tjedan dana. Pitaj ga &ldquo;moram li fiskalizirati ovaj
                račun&rdquo; u tri ujutro i dobit ćeš jasan odgovor na hrvatskom,
                odmah. Nitko drugi na tržištu ovo nema. Doslovno nitko.
              </p>
            </div>
            <div>
              <p className='mb-1 text-lg font-bold'>
                Knjiga prometa koju &ldquo;vodiš&rdquo; u Excelu — ili je uopće ne
                vodiš?
              </p>
              <p className='text-gray-700'>
                Svaki račun koji izdaš u Kviku automatski završi u KPR-u. Bez
                tablice. Bez ručnog unosa. Bez greške koju bi primijetio tek kad
                bude kasno.
              </p>
            </div>
            <div>
              <p className='mb-1 text-lg font-bold'>
                PO-SD za koji jednom godišnje platiš računovođi?
              </p>
              <p className='text-gray-700'>
                U Kviku ga ispuniš sam, za 2 minute. Aplikacija već zna tvoje
                brojke jer ih je pratila cijelu godinu.
              </p>
            </div>
            <div>
              <p className='mb-1 text-lg font-bold'>
                &ldquo;Jesam li dobro fiskalizirao?&rdquo;
              </p>
              <p className='text-gray-700'>
                Automatski. Svaki račun zakonski ispravan pred Poreznom. Ne moraš
                ni razmišljati o tome — radi u pozadini.
              </p>
            </div>
            <div>
              <p className='mb-1 text-lg font-bold'>Rokovi koje zaboraviš?</p>
              <p className='text-gray-700'>
                Kvik te podsjeća prije nego prođe rok. Ne nakon.
              </p>
            </div>
          </div>

          <div className='mt-12 text-center'>
            <button
              type='button'
              onClick={() => void handleCta()}
              disabled={loading}
              className='inline-block rounded-lg bg-orange-500 px-8 py-4 text-lg font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60'
            >
              {loading ? 'Otvaram plaćanje...' : 'Pretplati se za 7€/mj →'}
            </button>
          </div>
        </div>
      </section>

      <section className='bg-[#F5F5F5] px-6 py-20 text-black'>
        <div className='mx-auto max-w-2xl'>
          <p className='mb-4 text-lg leading-relaxed'>
            Parra PO-SD generator uvodi tek u prosincu 2026. Kvik ga ima danas.
          </p>
          <p className='mb-4 text-lg leading-relaxed'>
            Solo je dobar alat, ali cilja na sve — d.o.o., obrte, udruge, trgovce.
            Kvik je napravljen samo za paušaliste. Svaki ekran, svako pitanje
            AI-ja, svaki vodič — samo za tebe.
          </p>
          <p className='text-lg leading-relaxed'>
            I jedini smo koji imaju AI asistenta za porezna pitanja. Ne chatbot
            koji te šalje na FAQ stranicu — nego asistenta koji razumije tvoje
            pitanje i odgovara u sekundi.
          </p>
        </div>
      </section>

      <section className='bg-white px-6 py-20 text-black'>
        <div className='mx-auto max-w-lg text-center'>
          <h2 className='mb-4 text-2xl font-bold'>30 dana. Bez rizika.</h2>
          <p className='mb-2 text-lg text-gray-700'>
            Ako u prvih 30 dana ne smatraš da Kvik vrijedi 7€ — vraćamo ti novac.
            Jedan mail. Bez forme. Bez pitanja zašto.
          </p>
        </div>
      </section>

      <section className='bg-orange-500 px-6 py-24 text-center text-white'>
        <div className='mx-auto max-w-xl'>
          <p className='mb-2 text-2xl font-semibold leading-relaxed'>
            Ne moraš sve znati.
          </p>
          <p className='mb-2 text-2xl font-semibold leading-relaxed'>
            Ne moraš postati stručnjak za porezno pravo.
          </p>
          <p className='mb-10 text-2xl font-semibold leading-relaxed'>
            Ne moraš u tri ujutro čitati forume.
          </p>
          <p className='mb-10 text-xl'>Moraš samo imati nešto što zna umjesto tebe.</p>
          <button
            type='button'
            onClick={() => void handleCta()}
            disabled={loading}
            className='inline-block rounded-lg bg-white px-10 py-5 text-xl font-bold text-orange-600 transition hover:bg-gray-100 disabled:opacity-60'
          >
            {loading ? 'Otvaram plaćanje...' : 'Pretplati se za 7€/mj →'}
          </button>
        </div>
      </section>

      <div className='bg-white py-6 text-center text-sm text-gray-500'>
        <Link href='/signup' className='underline'>
          Već imaš lozinku? Prijavi se
        </Link>
      </div>
    </main>
  );
}

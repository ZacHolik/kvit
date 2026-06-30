'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

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

const ctaBase =
  'bg-teal font-bold text-white transition-colors hover:bg-tealHover disabled:opacity-60';

const QUESTIONS = [
  'Trebam li certifikat od FINA-e ili ne?',
  'Kako da vodim Knjigu prometa kad ne znam što je KPR?',
  'PO-SD — do kad se predaje? Kako izgleda?',
  'Što ako mi klijent plati na račun — moram li to fiskalizirati?',
  'Kolika je kazna ako nešto krivo ispunim?',
];

const FEATURES = [
  {
    label: 'Onaj google u tri ujutro?',
    body: 'Kvik ima AI asistenta koji odgovara na porezna pitanja u sekundi — ne za tjedan dana. Pitaj ga "moram li fiskalizirati ovaj račun" u tri ujutro i dobit ćeš jasan odgovor na hrvatskom, odmah.',
  },
  {
    label: 'Knjiga prometa koju "vodiš" u Excelu — ili je uopće ne vodiš?',
    body: 'Svaki račun koji izdaš u Kviku automatski završi u KPR-u. Bez tablice. Bez ručnog unosa. Bez greške koju bi primijetio tek kad bude kasno.',
  },
  {
    label: 'PO-SD za koji jednom godišnje platiš računovođi?',
    body: 'U Kviku ga ispuniš sam, za 2 minute. Aplikacija već zna tvoje brojke jer ih je pratila cijelu godinu.',
  },
  {
    label: '"Jesam li dobro fiskalizirao?"',
    body: 'Automatski. Svaki račun zakonski ispravan pred Poreznom. Ne moraš ni razmišljati o tome — radi u pozadini.',
  },
  {
    label: 'Rokovi koje zaboraviš?',
    body: 'Kvik te podsjeća prije nego prođe rok. Ne nakon.',
  },
];

const PRICING_ITEMS = [
  'AI porezni asistent — odgovori u sekundi',
  'Automatski KPR iz svakog računa',
  'PO-SD generator u 2 minute',
  'Automatska fiskalizacija',
  'Podsjetnici prije roka, ne nakon',
];

function CtaButton({
  loading,
  onClick,
  className,
  children,
}: {
  loading: boolean;
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <button type='button' onClick={onClick} disabled={loading} className={className}>
      {loading ? 'Otvaram plaćanje...' : children}
    </button>
  );
}

export default function RegisterLandingPage() {
  const [loading, setLoading] = useState(false);
  const [navShadow, setNavShadow] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavShadow(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCta = () => {
    setLoading(true);
    void startAnonymousCheckout();
  };

  return (
    <div className='scroll-smooth bg-bg text-ink'>
      <nav
        className={`sticky top-0 z-50 border-b border-tealBorder bg-bg/95 backdrop-blur-sm transition-shadow ${
          navShadow ? 'shadow-lg' : ''
        }`}
      >
        <div className='mx-auto flex max-w-6xl items-center justify-between px-6 py-4'>
          <Link href='/' className='font-display text-xl font-bold text-white'>
            Kvik<span className='text-teal'>.</span>
          </Link>
          <CtaButton
            loading={loading}
            onClick={handleCta}
            className={`${ctaBase} rounded-lg px-5 py-2.5 text-sm font-semibold`}
          >
            Pretplati se — 7€/mj
          </CtaButton>
        </div>
      </nav>

      <section
        className='relative overflow-hidden'
        style={{
          background:
            'radial-gradient(circle at 25% 10%, rgba(13,148,136,0.22), transparent 55%)',
        }}
      >
        <div className='relative z-10 mx-auto max-w-3xl px-6 pb-16 pt-20 text-center'>
          <p className='mb-6 text-xs font-bold uppercase tracking-widest text-teal'>
            Za hrvatske paušalne obrtnike
          </p>
          <h1 className='font-display mb-6 text-4xl font-bold leading-tight md:text-5xl'>
            Kvik: potpuno knjigovodstvo za paušaliste.
          </h1>
          <p className='mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted md:text-xl'>
            Na tvome mobitelu. S tobom uvijek i svugdje.
          </p>
          <CtaButton
            loading={loading}
            onClick={handleCta}
            className={`${ctaBase} mb-4 inline-block rounded-xl px-8 py-4 text-base`}
          >
            Pretplati se za 7€/mj →
          </CtaButton>
          <p className='text-sm text-mutedDim'>30 dana bez rizika. Otkaži kad god želiš.</p>
        </div>
      </section>

      <section className='border-t border-tealBorder'>
        <div className='mx-auto max-w-2xl px-6 py-16 md:py-20'>
          <p className='font-display mb-8 text-2xl font-bold text-white md:text-3xl'>
            Tri je ujutro.
          </p>
          <p className='mb-6 text-xl leading-relaxed text-muted md:text-2xl'>
            Ne spavaš jer si upravo pročitao da moraš &ldquo;fiskalizirati svaki
            račun&rdquo; — a nisi siguran što to uopće znači.
          </p>
          <p className='mb-6 text-lg leading-relaxed text-mutedDim'>
            U mobitelu imaš otvorena četiri taba. Forum iz 2019. kaže jedno. Članak
            iz 2024. kaže drugo. Porezna stranica se učitava sporo i piše jezikom
            koji kao da nije hrvatski.
          </p>
          <p className='text-lg leading-relaxed text-mutedDim'>
            Tipkao si &ldquo;moram li fiskalizirati račun ako sam paušalist&rdquo; i
            sad znaš manje nego prije nego si počeo čitati.
          </p>
        </div>
      </section>

      <section className='border-t border-tealBorder'>
        <div className='mx-auto max-w-2xl px-6 py-16 text-center md:py-20'>
          <h2 className='font-display mb-8 text-3xl font-bold text-white md:text-4xl'>
            Nisi lijen.
          </h2>
          <div className='space-y-5 text-lg leading-relaxed text-muted'>
            <p>
              Otvorio si obrt jer znaš svoj posao. Fotografiraš, kodiraš, šišaš,
              prevodiš, gradiš, savjetuješ, pišeš, montiraš, dizajniraš.
            </p>
            <p className='font-semibold text-white'>
              Nisi glup, ali čitajući propise, počinješ sumnjati u to.
            </p>
            <p>
              Propisi, rokovi, nepoznate riječi: KPR. PO-SD. ZKI. JIR. Interni akt.
              Fiskalizacija.
            </p>
            <p>Nitko ti ih nije objasnio jer se pretpostavlja da ih već znaš.</p>
          </div>
          <div className='mx-auto mt-10 max-w-xl rounded-r-xl border-l-4 border-teal bg-tealSofter px-6 py-5 text-left'>
            <p className='text-lg italic text-muted'>
              A ispod svega stoji strah koji ne kažeš nikome: što ako negdje
              pogriješiš — a ne saznaš dok ne stigne kazna?
            </p>
          </div>
        </div>
      </section>

      <section className='border-t border-tealBorder'>
        <div className='mx-auto max-w-2xl px-6 py-16 md:py-20'>
          <h2 className='font-display mb-10 text-center text-2xl font-bold text-white md:text-3xl'>
            Znam gdje si jer svaki paušalist prođe isto.
          </h2>
          <p className='mb-8 text-center text-lg leading-relaxed text-muted'>
            Otvoriš obrt. Bude ti uzbudljivo tri dana. Onda shvatiš da imaš dvadeset
            pitanja i nijedan jasan odgovor:
          </p>

          <div className='mb-10 space-y-3'>
            {QUESTIONS.map((q) => (
              <div
                key={q}
                className='flex gap-4 rounded-xl border border-tealBorder bg-tealSofter p-5'
              >
                <span className='shrink-0 font-display text-lg font-bold text-teal'>?</span>
                <span className='text-base text-white/90 md:text-lg'>{q}</span>
              </div>
            ))}
          </div>

          <div className='space-y-4 text-center text-lg leading-relaxed text-muted'>
            <p>Guglaš. Nađeš deset izvora. Sedam se međusobno protivriječi.</p>
            <p>Pošalješ mail računovođi. Odgovori za pet dana. Naplati sat vremena.</p>
          </div>
          <p className='font-display mt-8 text-center text-xl font-bold text-white md:text-2xl'>
            To nije tvoj problem. To je problem alata koji nisi imao.
          </p>
        </div>
      </section>

      <section className='border-t border-tealBorder'>
        <div className='mx-auto max-w-2xl px-6 py-16 md:py-20'>
          <p className='mb-2 text-center text-lg leading-relaxed text-muted'>
            Kvik je aplikacija koja postoji jer nijedna druga ne gleda isključivo na
            tebe — paušalista.
          </p>
          <p className='mb-14 text-center text-lg leading-relaxed text-mutedDim'>
            Ne na d.o.o. Ne na računovođu. Ne na &ldquo;sve poduzetnike.&rdquo; Samo
            na tebe. I svaki dio Kvika radi jednu stvar: makne ti ono od čega te
            hvata grč u želucu.
          </p>

          <div className='space-y-5'>
            {FEATURES.map((feature) => (
              <div
                key={feature.label}
                className='rounded-xl border border-tealBorder bg-tealSofter p-6 md:p-7'
              >
                <p className='mb-2 text-sm font-bold text-teal'>{feature.label}</p>
                <div className='flex items-start gap-3'>
                  <span className='mt-0.5 shrink-0 text-xl font-bold text-success'>✓</span>
                  <p className='text-base leading-relaxed text-white/90 md:text-lg'>
                    {feature.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className='mt-14 text-center'>
            <CtaButton
              loading={loading}
              onClick={handleCta}
              className={`${ctaBase} inline-block rounded-xl px-10 py-4 text-base md:text-lg`}
            >
              Pretplati se za 7€/mj →
            </CtaButton>
          </div>
        </div>
      </section>

      <section id='pricing' className='border-t border-tealBorder'>
        <div className='mx-auto max-w-md px-6 py-16 md:py-20'>
          <div className='rounded-2xl border border-tealBorder bg-tealSofter p-8 text-center md:p-10'>
            <p className='font-display mb-1 text-lg font-bold text-teal'>Kvik Paušalist</p>
            <p className='mb-6 text-sm text-mutedDim'>Mjesečna pretplata</p>

            <div className='mb-6 flex items-baseline justify-center gap-2'>
              <span className='font-display text-5xl font-bold text-white'>7€</span>
              <span className='text-mutedDim'>/mj</span>
            </div>

            <div className='mb-8 space-y-3 border-t border-tealBorder pt-6 text-left'>
              {PRICING_ITEMS.map((item) => (
                <div key={item} className='flex gap-3'>
                  <span className='shrink-0 font-bold text-success'>✓</span>
                  <span className='text-sm text-muted'>{item}</span>
                </div>
              ))}
            </div>

            <CtaButton
              loading={loading}
              onClick={handleCta}
              className={`${ctaBase} mb-4 block w-full rounded-xl px-6 py-4 text-center`}
            >
              Pretplati se za 7€/mj →
            </CtaButton>
            <p className='text-xs text-mutedDim'>30 dana bez rizika. Otkaži kad god želiš.</p>
          </div>
        </div>
      </section>

      <section className='border-t border-tealBorder'>
        <div className='mx-auto max-w-xl px-6 py-16 text-center'>
          <div className='mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 text-white'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2.5}
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9 12l2 2 4-4M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z'
              />
            </svg>
          </div>
          <h2 className='font-display mb-4 text-2xl font-bold text-white md:text-3xl'>
            30 dana. Bez rizika.
          </h2>
          <p className='text-lg leading-relaxed text-muted'>
            Ako u prvih 30 dana ne smatraš da Kvik vrijedi 7€ — vraćamo ti novac.
            Jedan mail. Bez forme. Bez pitanja zašto.
          </p>
        </div>
      </section>

      <section className='border-t border-tealBorder'>
        <div className='mx-auto max-w-2xl px-6 py-16 text-center md:py-24'>
          <p className='font-display mb-3 text-2xl font-bold leading-relaxed text-white md:text-3xl'>
            Ne moraš sve znati.
          </p>
          <p className='font-display mb-3 text-2xl font-bold leading-relaxed text-white md:text-3xl'>
            Ne moraš postati stručnjak za porezno pravo.
          </p>
          <p className='font-display mb-10 text-2xl font-bold leading-relaxed text-white md:text-3xl'>
            Ne moraš u tri ujutro čitati forume.
          </p>
          <p className='mb-10 text-xl text-muted md:text-2xl'>
            Moraš samo imati nešto što zna umjesto tebe.
          </p>
          <CtaButton
            loading={loading}
            onClick={handleCta}
            className={`${ctaBase} inline-block rounded-xl px-10 py-4 text-base md:text-lg`}
          >
            Pretplati se za 7€/mj →
          </CtaButton>
        </div>
      </section>

      <footer className='border-t border-tealBorder'>
        <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm md:flex-row'>
          <span className='font-display font-bold text-white'>
            Kvik<span className='text-teal'>.</span>
          </span>
          <Link href='/login' className='text-teal hover:underline'>
            Već imaš lozinku? Prijavi se
          </Link>
          <span className='text-mutedDim'>© 2026 Kvik · Sva prava pridržana</span>
        </div>
      </footer>
    </div>
  );
}

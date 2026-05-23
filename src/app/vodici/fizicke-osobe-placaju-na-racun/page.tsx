import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'fizicke-osobe-placaju-na-racun';

const META_DESC =
  'B2C scenarij: paušalist izdaje račun fizičkoj osobi koja plaća na transakcijski račun. Fiskalizacija od 1.1.2026., JIR, ZKI i što je obvezno.';

export const metadata: Metadata = {
  title: 'Kada fizičke osobe plaćaju na račun obrta',
  description: META_DESC,
  openGraph: {
    title: 'Kada fizičke osobe plaćaju na račun obrta | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Moram li fiskalizirati račun kad fizička osoba plaća na račun?',
    answer:
      'Od 1.1.2026. transakcijski računi (uključujući B2C uplate fizičkih osoba) ulaze u obveze fiskalizacije 2.0. Detalji u punoj verziji vodiča.',
  },
  {
    question: 'Trebam li JIR i ZKI na računu za uplatu na transakcijski račun?',
    answer:
      'Pravila o JIR/ZKI ovise o načinu plaćanja i rokovima fiskalizacije. Side-by-side usporedba u vodiču o fiskalizaciji 1.0 vs 2.0.',
  },
  {
    question: 'Kako upisati uplatu s računa u KPR?',
    answer:
      'U KPR se upisuje naplaćeni račun — bezgotovinski primitak ide u odgovarajuću kolonu. Vidi vodič o KPR knjizi prometa.',
  },
];

export default function FizickeOsobePlacajuNaRacunPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Kada fizičke osobe plaćaju na račun obrta'
      subtitle='B2C scenarij: paušalist izdaje račun fizičkoj osobi koja plaća na transakcijski račun. Fiskalizacija od 1.1.2026., JIR, ZKI i što je obvezno.'
      readingMinutes={9}
      metaDescription={META_DESC}
      toc={[{ id: 'b2c', label: 'B2C: fizička osoba plaća na račun' }]}
      faq={faq}
      related={[
        { href: vodiciHref('fiskalizacija-20'), title: 'Fiskalizacija 2.0' },
        { href: vodiciHref('izdavanje-racuna-vodic'), title: 'Izdavanje računa' },
        { href: vodiciHref('usporedba-fiskalizacija-1-2'), title: 'Fiskalizacija 1.0 vs 2.0' },
        { href: vodiciHref('kpr-knjiga-prometa'), title: 'KPR knjiga prometa' },
        { href: vodiciHref('fina-certifikat-fiskalizacija'), title: 'FINA certifikat' },
      ]}
    >
      <p>
        <strong>Kada fizičke osobe plaćaju na račun obrta</strong> — B2C scenarij u
        kojem paušalist izdaje račun fizičkoj osobi koja plaća na transakcijski račun —
        postaje sve češći. Od 1.1.2026. takvi računi ulaze u obveze fiskalizacije 2.0,
        uz JIR, ZKI i ostale propisane elemente.
      </p>
      <p>
        Ovaj vodič (u pripremi) objašnjava što je obvezno kad klijent nije tvrtka nego
        građanin koji plaća IBAN-om. Za širi kontekst vidi{' '}
        <Link href={vodiciHref('fiskalizacija-20')}>fiskalizacija 2.0</Link> i{' '}
        <Link href={vodiciHref('usporedba-fiskalizacija-1-2')}>
          usporedba fiskalizacija 1.0 vs 2.0
        </Link>
        .
      </p>
      <p>
        Za pravilno izdavanje računa pogledaj{' '}
        <Link href={vodiciHref('izdavanje-racuna-vodic')}>vodič za izdavanje računa</Link>.
      </p>

      <h2 id='b2c'>B2C: fizička osoba plaća na račun</h2>
      <p>
        Kad fizička osoba (B2C) plati uslugu ili robu na tvoj transakcijski račun, račun
        mora sadržavati sve obvezne elemente — uključujući IBAN, napomenu o PDV-u ako si
        izvan sustava i, prema rokovima, podatke fiskalizacije (JIR/ZKI).
      </p>
      <p>
        Uplatu upišeš u{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR</Link> kao bezgotovinski
        primitak. Za digitalnu fiskalizaciju treba ti{' '}
        <Link href={vodiciHref('fina-certifikat-fiskalizacija')}>FINA certifikat</Link>.
      </p>
      <p>
        Detaljni koraci i primjeri računa bit će dodani u punoj verziji vodiča.
      </p>

      <h2 id='alat'>Korisni alat</h2>
      <p>
        Prije izdavanja računa fizičkoj osobi složi{' '}
        <Link href='/alati/interni-akt' className='text-[#0d9488] hover:underline'>
          interni akt
        </Link>{' '}
        s ispravnom numeracijom — temelj za fiskalizaciju i KPR evidenciju.
      </p>
    </GuideShell>
  );
}

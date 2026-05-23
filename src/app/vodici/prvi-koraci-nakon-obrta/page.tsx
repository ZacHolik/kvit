import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'prvi-koraci-nakon-obrta';

const META_DESC =
  'Checklista prvih 30 dana: RPO obrazac, banka, doprinosi, fiskalizacija i što moraš napraviti odmah nakon upisa u obrtni registar.';

export const metadata: Metadata = {
  title: 'Prvi koraci nakon dobivanja obrtnice',
  description: META_DESC,
  openGraph: {
    title: 'Prvi koraci nakon dobivanja obrtnice | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Koliko imam vremena nakon otvaranja obrta?',
    answer:
      'Prvi rokovi — RPO obrazac, bankovni račun i prijava u sustav doprinosa — dolaze u prvih 8–30 dana. Detaljni vodič s rokovima bit će proširen u sljedećoj verziji.',
  },
  {
    question: 'Što je najvažnije odmah nakon rješenja o obrtu?',
    answer:
      'Predaja RPO obrasca, otvaranje poslovnog računa i priprema za izdavanje računa i vođenje KPR-a. Bez toga kasnije dolazi do kašnjenja i kazni.',
  },
  {
    question: 'Moram li odmah fiskalizirati račune?',
    answer:
      'Ovisi o načinu plaćanja i djelatnosti. Za gotovinu već danas vrijedi fiskalizacija 1.0, a za transakcijske račune dolaze novi rokovi od 2026. i 2027.',
  },
];

export default function PrviKoraciNakonObrtaPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Prvi koraci nakon dobivanja obrtnice'
      subtitle='Checklista prvih 30 dana: RPO obrazac, banka, doprinosi, fiskalizacija i što moraš napraviti odmah nakon upisa u obrtni registar.'
      readingMinutes={12}
      metaDescription={META_DESC}
      toc={[{ id: 'checklista', label: 'Checklista prvih 30 dana' }]}
      faq={faq}
      related={[
        { href: vodiciHref('otvaranje-obrta'), title: 'Otvaranje obrta' },
        { href: vodiciHref('rpo-obrazac'), title: 'RPO obrazac' },
        { href: vodiciHref('bankovni-racun-pausalisti'), title: 'Bankovni račun' },
        { href: vodiciHref('doprinosi'), title: 'Doprinosi' },
        { href: vodiciHref('pausalist-uz-posao'), title: 'Paušalist uz posao' },
      ]}
    >
      <p>
        <strong>Prvi koraci nakon dobivanja obrtnice</strong> često su haotičniji od samog
        otvaranja obrta. Rješenje iz e-Obrtnice stigne brzo, ali administrativni rokovi ne
        čekaju — RPO, banka, doprinosi i priprema za račune dolaze u prvih tjedan-dva.
        Ovaj vodič (u pripremi) služi kao checklista što napraviti odmah nakon upisa u
        obrtni registar.
      </p>
      <p>
        Ako si tek dobio obrtnicu, kreni redom: predaj{' '}
        <Link href={vodiciHref('rpo-obrazac')}>RPO obrazac</Link>, otvori{' '}
        <Link href={vodiciHref('bankovni-racun-pausalisti')}>poslovni račun</Link> i
        pripremi se za{' '}
        <Link href={vodiciHref('doprinosi')}>doprinose</Link> i{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR</Link>. Detaljan sadržaj ovog
        vodiča bit će proširen u sljedećoj verziji.
      </p>
      <p>
        Za paušaliste koji već imaju redovno zaposlenje, poseban je postupak — vidi{' '}
        <Link href={vodiciHref('pausalist-uz-posao')}>paušalist uz posao</Link>.
      </p>

      <h2 id='checklista'>Checklista prvih 30 dana</h2>
      <p>
        U prvih 30 dana nakon otvaranja obrta tipičan paušalist treba: predati RPO u roku
        od 8 dana, otvoriti poslovni račun, prijaviti se u sustav doprinosa, pripremiti
        interni akt za numeraciju računa i započeti vođenje KPR-a čim izda prvi račun.
      </p>
      <p>
        Paralelno provjeri obveze fiskalizacije — za gotovinu odmah, za transakcijske
        račune prema rokovima fiskalizacije 2.0. Ako ne znaš odakle krenuti, prođi
        checklistu u Kvik alatima.
      </p>
      <p>
        Pun sadržaj s rokovima, primjerima i uputama za ePoreznu bit će dodan uskoro.
      </p>

      <h2 id='alat'>Korisni alat</h2>
      <p>
        Besplatna{' '}
        <Link href='/alati/checklista' className='text-[#0d9488] hover:underline'>
          checklista obveza
        </Link>{' '}
        pomaže da ne propustiš RPO, doprinose, porez i PO-SD u prvih mjesecima poslovanja.
      </p>
    </GuideShell>
  );
}

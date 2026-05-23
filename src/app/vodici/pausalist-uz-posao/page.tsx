import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'pausalist-uz-posao';

const META_DESC =
  'Kompletna procedura od e-Obrtnice do plaćanja doprinosa za paušaliste koji već imaju stalno zaposlenje. Rok 8 dana, duplo osiguranje i pravo na odmor.';

export const metadata: Metadata = {
  title: 'Paušalni obrt uz redovno zaposlenje 9-5',
  description: META_DESC,
  openGraph: {
    title: 'Paušalni obrt uz redovno zaposlenje 9-5 | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Mogu li imati paušalni obrt uz redovno zaposlenje?',
    answer:
      'Da, u mnogim slučajevima možeš imati paušalni obrt uz stalno zaposlenje kod drugog poslodavca. Pravila o doprinosima i rokovima bit će detaljno objašnjena u punoj verziji vodiča.',
  },
  {
    question: 'Koliki je rok za prijavu obrta uz zaposlenje?',
    answer:
      'RPO obrazac i ostale prijave imaju rok od 8 dana od otvaranja obrta. Doprinosi za obrt uz zaposlenje idu drugačijim modelom — godišnje prema rješenju.',
  },
  {
    question: 'Plaćam li duple doprinose?',
    answer:
      'Ne nužno u punom iznosu — ako si već osiguran kao zaposlenik, doprinosi za obrt često se obračunavaju drugačije. Detalji u vodiču o doprinosima uz posao.',
  },
];

export default function PausalistUzPosaoPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Paušalni obrt uz redovno zaposlenje 9-5'
      subtitle='Kompletna procedura od e-Obrtnice do plaćanja doprinosa za paušaliste koji već imaju stalno zaposlenje. Rok 8 dana, duplo osiguranje i pravo na odmor.'
      readingMinutes={14}
      metaDescription={META_DESC}
      toc={[{ id: 'procedura', label: 'Procedura od e-Obrtnice do doprinosa' }]}
      faq={faq}
      related={[
        { href: vodiciHref('doprinosi-uz-posao'), title: 'Doprinosi uz posao' },
        { href: vodiciHref('prvi-koraci-nakon-obrta'), title: 'Prvi koraci' },
        { href: vodiciHref('rpo-obrazac'), title: 'RPO obrazac' },
        { href: vodiciHref('rad-s-pola-radnog-vremena-pausalni-obrt'), title: 'Rad s polovicom' },
        { href: vodiciHref('prikriveni-radni-odnos'), title: 'Prikriveni radni odnos' },
      ]}
    >
      <p>
        <strong>Paušalni obrt uz redovno zaposlenje</strong> popularan je model za
        freelancere i stručnjake koji rade 9-5, a side projekt vode kroz paušalni obrt.
        Procedura od e-Obrtnice do plaćanja doprinosa ima specifična pravila: rok 8 dana,
        drugačiji model doprinosa i pitanja duplog osiguranja.
      </p>
      <p>
        Ovaj vodič (u pripremi) pokriva kompletan postupak — od otvaranja obrta uz
        zaposlenje do godišnjeg rješenja za doprinose. Za iznose i rokove doprinosa vidi
        i{' '}
        <Link href={vodiciHref('doprinosi-uz-posao')}>doprinosi uz posao</Link>.
      </p>
      <p>
        Prije otvaranja obrta provjeri{' '}
        <Link href={vodiciHref('prikriveni-radni-odnos')}>prikriveni radni odnos</Link>{' '}
        — ako jedan klijent dominira prihodima, Porezna može promatrati situaciju drugačije.
      </p>

      <h2 id='procedura'>Procedura od e-Obrtnice do doprinosa</h2>
      <p>
        Koraci uključuju: otvaranje obrta putem e-Obrtnice, predaju{' '}
        <Link href={vodiciHref('rpo-obrazac')}>RPO obrasca</Link> u roku od 8 dana,
        prijavu u sustav doprinosa i godišnje plaćanje doprinosa prema rješenju Porezne
        uprave (za tipičan model uz zaposlenje).
      </p>
      <p>
        Paušalist uz posao i dalje mora voditi KPR, izdavati račune i plaćati paušalni
        porez na dohodak kvartalno. Pravo na godišnji odmor i pitanje duplog osiguranja
        bit će detaljno objašnjeno u punoj verziji vodiča.
      </p>
      <p>
        Za privremeno smanjenje opterećenja usporedi i{' '}
        <Link href={vodiciHref('rad-s-pola-radnog-vremena-pausalni-obrt')}>
          rad s polovicom radnog vremena
        </Link>
        .
      </p>

      <h2 id='alat'>Korisni alat</h2>
      <p>
        Za izračun i podsjetnik na doprinose koristi{' '}
        <Link href='/alati/placanje-doprinosa' className='text-[#0d9488] hover:underline'>
          alat za plaćanje doprinosa
        </Link>{' '}
        — posebno korisno kad doprinosi za obrt idu godišnje, a ne mjesečno.
      </p>
    </GuideShell>
  );
}

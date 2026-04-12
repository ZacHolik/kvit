import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'kpr-knjiga-prometa';

const META_DESC =
  'KPR knjiga prometa paušalisti: što se upisuje, gotovina i bezgotovina, rokovi, veza s PO-SD-om, digitalno vođenje i ispravljanje grešaka. Vodič 2026.';

export const metadata: Metadata = {
  title: 'KPR knjiga prometa paušalisti',
  description: META_DESC,
  openGraph: {
    title: 'KPR knjiga prometa paušalisti | Kvit',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvit',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Što je KPR i moram li ga voditi?',
    answer:
      'KPR je knjiga prometa računa u koju se upisuju naplaćeni računi. Paušalni obrtnici su obvezni je voditi kako bi država imala uvid u primitke kroz godinu.',
  },
  {
    question: 'Što se upisuje u KPR?',
    answer:
      'Za svaki naplaćeni račun upisuješ podatke poput datuma, broja računa, opisa, iznosa u gotovini ili bezgotovinskom dijelu i ukupno, sukladno obrascu koji koristiš.',
  },
  {
    question: 'Do kada moram unijeti račun u KPR?',
    answer:
      'Pravilo je da se KPR ažurira redovito, praktično na kraju dana ili odmah nakon naplate, kako ne bi gomilali zastarela knjiženja. Točan rok provjeri u uputama koje pratiš.',
  },
  {
    question: 'Kako KPR pomaže pri ispunjavanju PO-SD obrasca?',
    answer:
      'Zbrojevi iz KPR-a daju ulazne brojke za gotovinske i bezgotovinske primitke koje upisuješ na PO-SD. Bez točnog KPR-a PO-SD postaje pogađanje.',
  },
  {
    question: 'Mogu li voditi KPR digitalno?',
    answer:
      'Da, digitalno vođenje je uobičajeno i često pouzdanije od ručnog — manje aritmetičkih grešaka, lakša arhiva i izvoz u PDF ili servise poput ePorezne.',
  },
];

export default function KprKnjigaPrometaPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='KPR – Knjiga prometa za paušaliste 2026.'
      subtitle='Jasna evidencija primitaka: što upisati, kada i kako to povezati s PO-SD-om.'
      readingMinutes={10}
      metaDescription={META_DESC}
      toc={[
        { id: 'sto-je', label: 'Što je KPR?' },
        { id: 'sto-upisati', label: 'Što se upisuje' },
        { id: 'gotovina', label: 'Gotovina i bezgotovina' },
        { id: 'rokovi', label: 'Rokovi i navike' },
        { id: 'digitalno', label: 'Digitalno vs ručno' },
        { id: 'po-sd-veza', label: 'Veza s PO-SD obrascem' },
        { id: 'greske', label: 'Što ako pogriješiš' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('po-sd-obrazac'), title: 'PO-SD obrazac' },
        { href: vodiciHref('izdavanje-racuna'), title: 'Izdavanje računa' },
        { href: vodiciHref('doprinosi'), title: 'Doprinosi' },
      ]}
      howTo={{
        name: 'Vođenje KPR-a za paušalni obrt',
        description:
          'Redoviti koraci da KPR ostane točan cijelu godinu i spreman za PO-SD.',
        steps: [
          {
            name: 'Izdaj račun',
            text: 'Kreiraj račun s ispravnim brojem i svim obveznim podacima.',
          },
          {
            name: 'Evidentiraj naplatu',
            text: 'Označi je li uplata došla gotovinom, karticom ili žiralno.',
          },
          {
            name: 'Upiši u KPR isti dan',
            text: 'Unesi datum, broj računa, iznose u odgovarajuće kolone i ukupno.',
          },
          {
            name: 'Uskladi s bankovnim izvodom',
            text: 'Za bezgotovinske uplate provjeri izvod da se iznos i datum slažu.',
          },
          {
            name: 'Mjesečno provjeri zbrojeve',
            text: 'Na kraju mjeseca usporedi zbroj KPR-a s izvodima i arhivom računa.',
          },
        ],
      }}
    >
      <p>
        Pojam <strong>KPR knjiga prometa paušalisti</strong> zvuči birokratski, ali u
        praksi je to tvoj dnevnik zarade: što si naplatio, kada i kojim putem. Bez KPR-a
        ne možeš točno ispunjavati <Link href={vodiciHref('po-sd-obrazac')}>PO-SD</Link>{' '}
        niti dokazati primitke u slučaju kontrole. Zato ga trebaš shvatiti kao alat, ne
        kao kaznu. Ako koristiš <Link href='/register'>Kvit</Link>, dio unosa može biti
        automatski vezan uz{' '}
        <Link href={vodiciHref('izdavanje-racuna')}>izdavanje računa</Link>.
      </p>

      <h2 id='sto-je'>Što je KPR?</h2>
      <p>
        Knjiga prometa računa služi poreznim tijelima i tebi: iz nje se vidi koliko si
        ostvario primitaka kroz godinu i kako su raspoređeni između gotovinskog i
        bezgotovinskog kanala. To su iste brojke koje kasnije traži PO-SD. Drugim
        riječima, KPR je izvor istine za godišnji izvještaj — ako je KPR netočan, cijela
        godišnja slika je pomačena.
      </p>

      <h2 id='sto-upisati'>Što se upisuje</h2>
      <p>
        Tipično upisuješ datum prometa ili naplate, broj računa, naziv kupca ako ga
        knjiga traži, opis, iznose po kolonama za gotovinu i bezgotovinsko te ukupno.
        Svaka stavka mora imati odgovarajući račun u arhivi. Ako koristiš storno ili
        korekciju, i to mora biti vidljivo u tragovima — ne briši nasumično redove bez
        dokumentacije.
      </p>

      <h2 id='gotovina'>Gotovina i bezgotovina</h2>
      <p>
        Paušalisti često miješaju karticu s gotovinom — u KPR-u je važno slijediti
        definicije koje koristiš na obrascu. U pravilu kartična uplata kod obrta može ići
        u gotovinski dio ovisno o uputi obrasca koji pratiš. Bezgotovinsko su žiralne
        uplate koje vidiš na izvodu. Kad god si u dvojbi, uskladi s primjerima iz
        Porezne ili svog računovođe.
      </p>

      <h2 id='rokovi'>Rokovi i navike</h2>
      <p>
        Najbolja navika je unos isti dan kad naplatiš. Ako gomilaš tjednima, raste
        rizik pogrešnog datuma ili iznosa. Postavi ritual: pet minuta navečer ili ujutro
        za jučerašnje račune. Podsjetnik u kalendaru ili u aplikaciji drži disciplinu
        bolje od &quot;sjetit ću se jednom mjesečno&quot;.
      </p>

      <h2 id='digitalno'>Digitalno vs ručno</h2>
      <p>
        Ručni PDF ili papir još uvijek postoje, ali digitalni KPR donosi brže zbrojeve,
        manje grešaka i jednostavniji izvoz. Ako planiraš rasti, digitalno je skoro
        neizbježno — posebno uz <Link href={vodiciHref('fiskalizacija-20')}>fiskalizaciju 2.0</Link>{' '}
        i potrebu za tragom od računa do prijave. Usporedi trošak vremena: sat ručnog
        zbrajanja mjesečno brzo premaši cijenu alata.
      </p>

      <h2 id='po-sd-veza'>Veza s PO-SD obrascem</h2>
      <p>
        Kad u siječnju popunjavaš PO-SD, prve brojke koje trebaš su godišnji zbrojevi
        primitaka iz KPR-a. Ako si tijekom godine pazio na usklađenost KPR-a s računima
        i izvodima, PO-SD postaje formalnost umjesto noćne more. Zato{' '}
        <Link href={vodiciHref('doprinosi')}>doprinosi</Link> i porez na dohodak nisu
        jedini mjesečni ritam — KPR je tihi heroj koji štedi sate u siječnju.
      </p>

      <h2 id='greske'>Što ako pogriješiš</h2>
      <p>
        Greške se događaju: krivi iznos, krivi datum, pogrešna kolona. Ispravi ih što
        prije i dokumentiraj razlog. Ako si već predao neki izvještaj temeljen na
        pogrešnom KPR-u, možda će trebati korekcijski postupak — pitaj savjetnika. Bolje
        priznati i ispraviti odmah nego čekati inspekciju.
      </p>
      <p>
        Za početak poslovanja pročitaj{' '}
        <Link href={vodiciHref('otvaranje-obrta')}>kako otvoriti paušalni obrt</Link> i
        širi okvir <Link href={vodiciHref('pausalni-obrt-vodic')}>paušalni obrt 2026.</Link>{' '}
        U aplikaciji pitaj <Link href='/asistent'>AI asistenta</Link> za konkretne
        korake u Kvitu.
      </p>
    </GuideShell>
  );
}

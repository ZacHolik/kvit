import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'porez-na-dohodak';

const META_DESC =
  'Kako se obračunava paušalni porez na dohodak, 7 poreznih razreda, kvartalni rokovi i kako platiti.';

export const metadata: Metadata = {
  title: 'Porez na dohodak u paušalnom obrtu 2026.',
  description: META_DESC,
  openGraph: {
    title: 'Porez na dohodak u paušalnom obrtu 2026. | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Koliko iznosi paušalni porez na dohodak?',
    answer:
      'Za 2026. iznos ovisi o razredu primitaka i prema dostupnom izvoru ide od 50,85 € do 270,00 € po tromjesečju, kroz 7 razreda.',
  },
  {
    question: 'Kada se plaća paušalni porez?',
    answer:
      'Kvartalno: do 31.03., 30.06., 30.09. i 31.12. Uplata je za tri mjeseca pa je mjesečni iznos potrebno pomnožiti s tri.',
  },
  {
    question: 'Kako se određuje porezni razred?',
    answer:
      'Razred se određuje prema primicima iz prethodne godine. U prvoj godini poslovanja gleda se iznos primitaka prijavljen u RPO obrascu.',
  },
  {
    question: 'Što je prirez i moram li ga plaćati?',
    answer:
      'Prirez je lokalno povećanje porezne obveze povezano s mjestom prebivališta. Ako je primjenjiv, utječe na konačni iznos koji plaćaš uz osnovni paušalni porez.',
  },
  {
    question: 'Razlikuje li se porez uz zaposlenje?',
    answer:
      'Kod obrta uz zaposlenje često postoje posebnosti u ukupnim javnim davanjima i obračunima. Osnovna logika razreda ostaje, ali je dobro provjeriti konkretan status s Poreznom.',
  },
];

export default function PorezNaDohodakPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Porez na dohodak u paušalnom obrtu 2026.'
      subtitle='7 razreda, kvartalni rokovi i praktičan način da uplatu odradiš bez greške.'
      readingMinutes={12}
      metaDescription={META_DESC}
      toc={[
        { id: 'sto-je', label: 'Što je paušalni porez na dohodak' },
        { id: 'razredi', label: '7 poreznih razreda 2026.' },
        { id: 'odredivanje', label: 'Kako se određuje razred' },
        { id: 'rokovi', label: 'Kvartalni rokovi plaćanja' },
        { id: 'placanje', label: 'Kako platiti – IBAN i modeli' },
        { id: 'po-sd', label: 'Veza s PO-SD obrascem' },
        { id: 'prirez', label: 'Prirez na dohodak' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('po-sd-obrazac'), title: 'PO-SD obrazac' },
        { href: vodiciHref('doprinosi'), title: 'Doprinosi za paušalni obrt' },
        { href: vodiciHref('rokovi-placanja'), title: 'Rokovi plaćanja' },
        { href: vodiciHref('doprinosi-uz-posao'), title: 'Doprinosi uz posao' },
      ]}
      howTo={{
        name: 'Kvartalna uplata paušalnog poreza',
        description:
          'Operativni koraci koje ponavljaš četiri puta godišnje za uredno plaćanje poreza.',
        steps: [
          {
            name: 'Utvrdi svoj razred',
            text: 'Provjeri primitive prethodne godine ili podatak iz RPO obrasca ako ti je prva godina poslovanja.',
          },
          {
            name: 'Odredi kvartalni iznos',
            text: 'Uplata je tromjesečna i odgovara iznosu tvog razreda.',
          },
          {
            name: 'Pripremi nalog',
            text: 'Unesi točan IBAN, model i poziv na broj prema aktualnim uputama Porezne.',
          },
          {
            name: 'Uplati do roka i arhiviraj potvrdu',
            text: 'Rokovi su 31.03., 30.06., 30.09. i 31.12., a potvrde čuvaj za PO-SD usklađenje.',
          },
        ],
      }}
    >
      <p>
        Ako pretražuješ <strong>porez na dohodak paušalni obrt 2026</strong>, najvažnije je
        razumjeti da ne postoji jedan univerzalni iznos za sve. Paušalni porez se plaća
        kvartalno, prema razredu primitaka, i zato je direktno povezan s tim koliko si
        ostvario u prethodnoj godini. U bazi je to jasno opisano: četiri roka tijekom godine,
        tromjesečna uplata i sedam razreda iznosa.
      </p>
      <p>
        Kad sustav postaviš dobro, porez postaje rutina. Kad ga vodiš stihijski, svako
        tromjesečje izgleda kao mini porezna kriza. Zato ovaj vodič spaja brojke, rokove i
        postupak uplate, a povezuje te i s vodičima za{' '}
        <Link href={vodiciHref('po-sd-obrazac')}>PO-SD</Link> i{' '}
        <Link href={vodiciHref('rokovi-placanja')}>rokove plaćanja</Link>.
      </p>

      <h2 id='sto-je'>Što je paušalni porez na dohodak</h2>
      <p>
        Paušalni porez na dohodak je pojednostavljen način oporezivanja za obrtnike u
        paušalnom režimu. Umjesto detaljnog obračuna dohotka kroz poslovne knjige kao kod
        drugih modela, ovdje plaćaš propisani iznos prema razredu primitaka. Time je sustav
        jednostavniji, ali i dalje traži disciplinu u rokovima i evidenciji naplate.
      </p>
      <p>
        U praksi to znači da porez možeš unaprijed planirati ako znaš razred, ali samo ako su
        ti podaci o primicima ažurni. Zato su kvalitetno vođenje računa i KPR-a izravno
        povezani s točnim poreznim obvezama.
      </p>

      <h2 id='razredi'>7 poreznih razreda 2026. (točni iznosi)</h2>
      <p>
        Prema dostupnom izvoru za 2026. tromjesečni iznosi su:
      </p>
      <p>
        1) primici 0,00 – 11.300,00 €: <strong>50,85 €</strong>
        <br />
        2) primici 11.300,01 – 15.300,00 €: <strong>68,85 €</strong>
        <br />
        3) primici 15.300,01 – 19.900,00 €: <strong>89,50 €</strong>
        <br />
        4) primici 19.900,01 – 30.600,00 €: <strong>137,70 €</strong>
        <br />
        5) primici 30.600,01 – 40.000,00 €: <strong>180,00 €</strong>
        <br />
        6) primici 40.000,01 – 50.000,00 €: <strong>225,00 €</strong>
        <br />
        7) primici 50.000,01 – 60.000,00 €: <strong>270,00 €</strong>
      </p>
      <p>
        Ovo su iznosi koje koristiš za kvartalnu uplatu, ne mjesečnu. U samom izvoru je
        navedeno da je uplata za tri mjeseca, odnosno da bi mjesečni iznos trebalo množiti s
        tri ako radiš internu simulaciju po mjesecima.
      </p>

      <h2 id='odredivanje'>Kako se određuje razred</h2>
      <p>
        Razred se određuje prema ukupnim primicima prethodne godine. Ako si u prvoj godini
        poslovanja, koristi se podatak koji si prijavio u RPO obrascu. Taj detalj je često
        podcijenjen, a upravo zato polje predviđenog primitka u RPO-u nije formalnost.
      </p>
      <p>
        Dobra praksa je da svako tromjesečje pratiš trend naplate i usporediš ga s razredom u
        kojem trenutno plaćaš. Tako na vrijeme vidiš postoji li rizik prelaska u viši razred u
        sljedećoj godini i možeš planirati likvidnost.
      </p>

      <h2 id='rokovi'>Kvartalni rokovi plaćanja (31.3, 30.6, 30.9, 31.12)</h2>
      <p>
        Rokovi iz izvora su precizni: <strong>31.03.</strong>, <strong>30.06.</strong>,
        <strong> 30.09.</strong> i <strong>31.12.</strong>. To su četiri datuma koja svaki
        paušalist treba imati u kalendaru, uz redovne mjesečne obveze kao što su{' '}
        <Link href={vodiciHref('doprinosi')}>doprinosi</Link>.
      </p>
      <p>
        Praktično je postaviti podsjetnik 7 dana prije svakog roka. Time dobivaš prostor za
        provjeru iznosa, pripremu naloga i eventualno usklađenje ako si propustio neki prethodni
        korak.
      </p>

      <h2 id='placanje'>Kako platiti – IBAN i modeli</h2>
      <p>
        U izvoru se naglašava da obrtnici često zapinju baš na tehničkim podacima uplate: IBAN,
        model i poziv na broj. Zato je važno da svaku uplatu radiš prema aktualnim službenim
        podacima, a ne po staroj spremljenoj šabloni bez provjere.
      </p>
      <p>
        Operativni minimum je jednostavan: odredi razred, uzmi kvartalni iznos, pripremi nalog,
        uplati prije roka i arhiviraj potvrdu. Ako koristiš alat koji generira naloge, i dalje
        ti ostaje odgovornost za točnost ulaznih podataka.
      </p>

      <h2 id='po-sd'>Veza s PO-SD obrascem</h2>
      <p>
        Kvartalne uplate nisu kraj priče. Na kraju godine kroz{' '}
        <Link href={vodiciHref('po-sd-obrazac')}>PO-SD obrazac</Link> prijavljuješ primitke i
        usklađuješ ih s onime što je uplaćeno. Zato je važno da svaku kvartalnu uplatu uredno
        evidentiraš i čuvaš dokaze, jer bez toga godišnje usklađenje postaje sporije i sklonije
        greškama.
      </p>
      <p>
        U dobro postavljenom sustavu sve je povezano: račun ulazi u KPR, KPR utječe na razred,
        razred utječe na kvartalnu uplatu, a uplata završava na PO-SD-u.
      </p>

      <h2 id='prirez'>Prirez na dohodak – što je i kako utječe</h2>
      <p>
        Uz osnovni paušalni porez može postojati i lokalna komponenta kroz prirez, ovisno o
        mjestu prebivališta. To znači da dvije osobe u istom razredu primitaka ne moraju imati
        identičan ukupan teret ako su u različitim jedinicama lokalne samouprave.
      </p>
      <p>
        U praksi je zato pametno promatrati poreznu obvezu kao zbroj osnovnog razreda i lokalnog
        utjecaja. Ako uz obrt imaš i zaposlenje, dodatno provjeri specifičnosti statusa kroz vodič
        <Link href={vodiciHref('doprinosi-uz-posao')}> Doprinosi uz posao</Link>. Za brzu
        simulaciju uplata i podsjetnika koristi{' '}
        <Link href='/alati/kalkulator-poreza'>Kalkulator poreza</Link>.
      </p>
    </GuideShell>
  );
}

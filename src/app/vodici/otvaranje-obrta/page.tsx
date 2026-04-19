import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, VODICI_ENTRIES, vodiciHref } from '@/lib/vodici-config';

const RELATED_OTVARANJE = [
  'pausalni-obrt-vodic',
  'pausalni-obrt-vs-doo',
  'izdavanje-racuna',
  'kpr-knjiga-prometa',
] as const;

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'otvaranje-obrta';

const META_DESC =
  'Kako otvoriti paušalni obrt u 2026.: e-Obrtnica, dokumenti, troškovi, OIB, IBAN i što odmah nakon registracije — KPR, doprinosi, računi.';

export const metadata: Metadata = {
  title: 'Kako otvoriti paušalni obrt',
  description: META_DESC,
  openGraph: {
    title: 'Kako otvoriti paušalni obrt | Kvit',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvit',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Koliko košta otvaranje paušalnog obrta?',
    answer:
      'Državna naknada za upis u obrtni registar putem e-Obrtnice u novijim godinama može biti nula kuna/eura za osnivanje same obrti, dok komora i ostale stavke ovise o situaciji. Ukupni trošak često je nizak u usporedbi s d.o.o.',
  },
  {
    question: 'Mogu li otvoriti paušalni obrt online?',
    answer:
      'Da, većina koraka ide kroz e-Obrtnicu i prateće digitalne servise. Potrebni su digitalni certifikati ili NIAS login, ovisno o kanalu.',
  },
  {
    question: 'Koji dokumenti su potrebni za otvaranje obrta?',
    answer:
      'Ovisno o djelatnosti: osobna iskaznica, dokaz o stručnosti ako je propisan, najam ili suglasnost za adresu obrta, OIB, podaci za žiro račun. Lista varira — provjeri za svoju šifru djelatnosti.',
  },
  {
    question: 'Koliko traje postupak otvaranja obrta?',
    answer:
      'Digitalni postupci često traju od nekoliko dana do par tjedana, ovisno o provjerama i eventualnim dopunama. Fizički odlasci su sve rjeđi.',
  },
  {
    question: 'Što trebam napraviti odmah nakon otvaranja obrta?',
    answer:
      'Otvori žiro račun ako ga nemaš, prijavi se u sustav Porezne, pripremi izdavanje računa, dogovori KPR i raspored doprinosa. U prvom tjednu složi i podsjetnike za kvartalni porez i godišnji PO-SD.',
  },
];

const otherGuides = VODICI_ENTRIES.filter((e) => e.slug !== SLUG);

export default function OtvaranjeObrtaPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Kako otvoriti paušalni obrt 2026. – korak po korak'
      subtitle='Od odluke do prvog računa: dokumenti, digitalni postupci i što ne smije čekati.'
      readingMinutes={13}
      metaDescription={META_DESC}
      toc={[
        { id: 'uvjeti', label: 'Uvjeti i priprema' },
        { id: 'dokumenti', label: 'Dokumenti' },
        { id: 'e-obrtnica', label: 'e-Obrtnica online' },
        { id: 'troskovi', label: 'Troškovi osnivanja' },
        { id: 'oib-iban', label: 'OIB i IBAN' },
        { id: 'odmah', label: 'Što odmah nakon registracije' },
        { id: 'prvi-racun', label: 'Prvi račun' },
      ]}
      faq={faq}
      related={RELATED_OTVARANJE.map((slug) => {
        const e = VODICI_ENTRIES.find((x) => x.slug === slug)!;
        return { href: vodiciHref(e.slug), title: e.shortTitle };
      })}
      howTo={{
        name: 'Otvaranje paušalnog obrta korak po korak',
        description:
          'Pregled koraka od prijave do prvog izdanog računa za tipičan paušalni obrt.',
        steps: [
          {
            name: 'Provjeri djelatnost i paušalni model',
            text: 'Potvrdi može li tvoja šifra u paušalni režim i koja su ograničenja.',
          },
          {
            name: 'Prikupljaj dokumente i adresu obrta',
            text: 'Pripremi dokaze o stručnosti ako treba i najam ili suglasnost vlasnika.',
          },
          {
            name: 'Podnesi prijavu putem e-Obrtnice',
            text: 'Ispuni digitalni obrazac i prati status obrade.',
          },
          {
            name: 'Otvori žiro račun i poveži s obrtom',
            text: 'Koristi račun isključivo za poslovne tokove kako bi KPR i izvodi bili čisti.',
          },
          {
            name: 'Postavi izdavanje računa i KPR',
            text: 'Od prvog dana bilježi svaki primitak — aplikacija Kvit može to pojednostaviti.',
          },
        ],
      }}
    >
      <p>
        Ako te zanima <strong>kako otvoriti paušalni obrt</strong> u Hrvatskoj danas,
        najčešći put vodi kroz digitalne servise i jasno definirane korake. Ovaj vodič
        povezuje registraciju s onim što slijedi odmah nakon toga:{' '}
        <Link href={vodiciHref('izdavanje-racuna')}>izdavanje računa</Link>,{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR</Link>,{' '}
        <Link href={vodiciHref('doprinosi')}>doprinosi</Link>,{' '}
        <Link href={vodiciHref('fiskalizacija-20')}>fiskalizacija 2.0</Link>,{' '}
        <Link href={vodiciHref('po-sd-obrazac')}>PO-SD</Link> i širi okvir{' '}
        <Link href={vodiciHref('pausalni-obrt-vodic')}>paušalni obrt 2026.</Link> Na
        kraju ćeš znati što napraviti u prvom tjednu da izbjegneš kašnjenje s obvezama.
        Ako si u beauty ili foto segmentu, vidi i{' '}
        <Link href={vodiciHref('pausalni-obrt-za-kozmeticare')}>paušalni obrt za kozmetičare</Link> te{' '}
        <Link href={vodiciHref('pausalni-obrt-za-fotografe')}>paušalni obrt za fotografe</Link>.
      </p>

      <h2 id='uvjeti'>Uvjeti i priprema</h2>
      <p>
        Prije nego što kreneš u postupak, provjeri može li tvoja djelatnost uopće u
        paušalni model i postoje li posebni uvjeti (stručni ispiti, dozvole). Ako si u
        dvojbi, kratak poziv obrtnoj komori ili poreznom savjetniku može uštedjeti
        tjedne ispravaka kasnije. Također razmisli hoćeš li obrt biti jedina djelatnost
        — to direktno dira način doprinosa koji opisujemo u vodiču o doprinosima.
      </p>

      <h2 id='dokumenti'>Dokumenti</h2>
      <p>
        Tipični set uključuje osobnu iskaznicu, OIB, dokaz o stručnosti ako je propisan
        za tvoju djelatnost, te dokumentaciju za sjedište ili adresu obavljanja. Za
        najam trebaš suglasnost ili ugovor; za vlastiti prostor dokaz vlasništva ili
        korištenja. Digitalni upload štedi vrijeme, ali kvaliteta skenova mora biti
        čitka.
      </p>

      <h2 id='e-obrtnica'>e-Obrtnica online</h2>
      <p>
        e-Obrtnica je središnji portal: tamo podnosiš prijavu, pratiš status i dobivaš
        obavijesti o nedostacima. Priprema NIAS ili e-Osobne iskaznice ubrzava login.
        Nakon odobrenja upisa u obrtni registar nastavljaš s poreznim i bankovnim
        koracima paralelno gdje je moguće kako bi izgubio što manje vremena.
      </p>

      <h2 id='troskovi'>Troškovi osnivanja</h2>
      <p>
        Mnogi paušalisti danas ističu da je formalni trošak upisa kroz digitalne kanale
        simboličan ili besplatniji nego prije, dok članarine i dodatne usluge ovise o
        komori i opcijama koje odabereš. Usporedi to s troškovima d.o.o. ako si u
        dilemi — obrt je često jeftiniji start, ali s drugačijom odgovornošću.
      </p>

      <h2 id='oib-iban'>OIB i IBAN</h2>
      <p>
        OIB već imaš kao građanin, ali podaci o obrtu moraju biti usklađeni u svim
        sustavima. Žiro račun otvaraš kao obrtnik i koristiš ga za poslovne primitke —
        to olakšava usklađivanje KPR-a s bankovnim izvodom. IBAN kasnije stavljaš i na
        račun klijentima, što detaljnije objašnjavamo u vodiču o računima.
      </p>

      <h2 id='odmah'>Što odmah nakon registracije</h2>
      <p>
        Čim dobiješ aktivni status, paralelno pokreni: (1) podešavanje izdavanja računa
        s obveznim elementima, (2) KPR ili alat koji ga vodi, (3) kalendar doprinosa do
        15. u mjesecu, (4) podsjetnik za kvartalni paušalni porez, (5) plan za{' '}
        <Link href={vodiciHref('fiskalizacija-20')}>fiskalizaciju 2.0</Link> ako
        izdaješ transakcijske račune. Na kraju godine ne smiješ zaboraviti{' '}
        <Link href={vodiciHref('po-sd-obrazac')}>PO-SD</Link> — bolje ga znati unaprijed
        nego u panici u siječnju.
      </p>
      <p>
        Aplikacija <Link href='/register'>Kvit</Link> cilja pokriti veći dio tog
        &quot;odmah&quot; kroz jedan onboarding: podaci obrta, računi, KPR i podloga za
        PO-SD. Za pitanja unutar aplikacije koristi{' '}
        <Link href='/asistent'>AI asistenta</Link>.
      </p>

      <h2 id='prvi-racun'>Prvi račun</h2>
      <p>
        Prvi izdani račun simbolički pokreće stvarni posao: provjeri broj u formatu
        poput 1-2026., naziv i OIB obrta, PDV napomenu, način plaćanja i iznos. Nakon
        izdavanja isti dan ili najkasnije prema tvom internom pravilu upiši ga u{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR</Link>. Tako već od starta
        gradiš naviku koja štedi sate pri PO-SD-u.
      </p>
      <p>
        Za dublje čitanje otvori sve vodiče u rubrici:{' '}
        {otherGuides.map((e, i) => (
          <span key={e.slug}>
            {i > 0 ? ', ' : null}
            <Link href={vodiciHref(e.slug)}>{e.shortTitle}</Link>
          </span>
        ))}
        .
      </p>
    </GuideShell>
  );
}

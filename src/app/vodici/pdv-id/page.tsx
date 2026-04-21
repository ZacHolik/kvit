import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'pdv-id';

const META_DESC =
  'PDV ID broj paušalni obrt: što je, kada treba za EU usluge i robu, kako podnijeti P-PDV na ePoreznoj — prema Fiskalopediji.';

export const metadata: Metadata = {
  title: 'PDV ID broj paušalni obrt',
  description: META_DESC,
  openGraph: {
    title: 'PDV ID broj paušalni obrt | Kvit',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvit',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Što je PDV ID broj?',
    answer:
      'To je tvoj OIB s prefiksom HR koji dodjeljuje Porezna uprava na zahtjev. Fiskalopedija naglašava: PDV ID ne znači da ulaziš u sustav PDV-a niti da moraš obračunavati PDV na izlazne račune.',
  },
  {
    question: 'Trebam li PDV ID ako radim za Upwork?',
    answer:
      'Ako primaš usluge od EU tvrtki ili isporučuješ EU klijentima unutar EU, trebaš PDV ID za ispravno izdavanje i zaprimanje računa. Za čisto izvanEU poslovanje Fiskalopedija navodi da PDV ID nije potreban.',
  },
  {
    question: 'Kako zatražiti PDV ID na ePoreznoj?',
    answer:
      'Postupak ide kroz obrazac P-PDV: ne aktiviraš ulazak u registar PDV obveznika, nego odabireš opciju za dodjelu PDV identifikacijskog broja tuzemnome poreznom obvezniku, s razlogom “porezni obveznik koji prima ili obavlja usluge unutar EU”. Paušalni obrt u polju oblika upisuje se kao “Paušalni obrt”.',
  },
  {
    question: 'Znači li PDV ID da moram obračunavati PDV?',
    answer:
      'Ne automatski. PDV ID omogućuje ispravnu komunikaciju s EU partnerima u sustavu PDV-a, ali prema Fiskalopediji nisi zbog toga automatski u sustavu PDV-a koji zahtijeva obračun PDV-a na svoje račune.',
  },
  {
    question: 'Što se dogodi ako nisam zatražio PDV ID?',
    answer:
      'Možeš imati problem s valjanim EU računima i reverse charge mehanizmima. Fiskalopedija preporučuje provjeru PDV brojeva partnera u VIES bazi prije suradnje.',
  },
];

export default function PdvIdPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='PDV ID broj za paušalce — kada ti treba'
      subtitle='EU usluge i roba: identifikacija bez “ulaska” u PDV ako to nije tvoj sljedeći korak.'
      readingMinutes={10}
      metaDescription={META_DESC}
      toc={[
        { id: 'sto', label: 'Što je PDV ID (i što nije)' },
        { id: 'eu-usluge', label: 'Usluge iz EU bez praga' },
        { id: 'roba', label: 'Roba iz EU i prag 10.000 €' },
        { id: 'primjeri', label: 'Primjeri: platforme i pretplate' },
        { id: 'postupak', label: 'Kako zatražiti na ePoreznoj' },
        { id: 'posljedice', label: 'Ako zakašnjiš' },
        { id: 'pdv-sustav', label: 'PDV ID vs ulazak u PDV sustav' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('pausalni-obrt-za-it-freelancere'), title: 'Paušalni obrt za IT freelancere' },
        { href: vodiciHref('pausalni-obrt-za-konzultante'), title: 'Paušalni obrt za konzultante' },
        { href: vodiciHref('pausalni-obrt-vodic'), title: 'Paušalni obrt 2026.' },
      ]}
    >
      <p>
        Ključna fraza <strong>PDV ID broj paušalni obrt</strong> zbunjuje jer zvuči kao
        “ulazak u PDV”. Službeno objašnjenje na Fiskalopediji kaže: PDV ID je OIB s
        prefiksom HR koji dodjeljuje Porezna na zahtjev, a{' '}
        <strong>ne znači</strong> da postaješ PDV obveznik koji mora PDV stavljati na
        vlastite račune (
        <a
          href='https://fiskalopedija.hr/baza-znanja/pdv-id-broj'
          className='text-[#0d9488] hover:underline'
          rel='noopener noreferrer'
          target='_blank'
        >
          izvor
        </a>
        ). To je kritična razlika za freelancere koji rade za njemačku ili irsku tvrtku,
        ali i dalje žele ostati u paušalnom obrtu dok su ispod limita od 60.000 €
        primitaka koji Fiskalopedija ističe kao granicu paušalnog statusa.
      </p>

      <h2 id='sto'>Što je PDV ID (i što nije)</h2>
      <p>
        PDV ID je identifikator u unutarnjem tržištu EU-a. Omogućuje da tvoji partneri
        ispravno evidentiraju transakcije u svojim PDV povratima i da ti zaprimiš
        eRačune bez administrativnog čvora. Fiskalopedija posebno ističe da identifikator
        trebaš ako prodaješ ili kupuješ kod EU tvrtki — bez obzira jesi li paušal, obrt s
        knjigama, j.d.o.o. ili d.o.o.
      </p>

      <h2 id='eu-usluge'>Usluge iz EU bez praga</h2>
      <p>
        Za usluge unutar EU prag od 10.000 € koji se često spominje kod isporuke robe nije
        isti scenario kao kod digitalnih usluga — zato freelanceri često čuju “moraš PDV
        ID odmah”. Fiskalopedija u uvodu kaže da uz EU partnere trebaš imati PDV ID. To
        se ne mijenja time što si paušalist: EU sustav traži identifikaciju sudionika.
      </p>

      <h2 id='roba'>Roba iz EU i prag 10.000 €</h2>
      <p>
        Kod robe iz EU i dalje postoji diskusija o pragu i daljnjim obvezama — tu je
        važno čitati i Zakon o PDV-u i individualne slučajeve. Ovaj vodič ne zamjenjuje
        poreznog savjetnika; služi kao most prema službenim člancima. Ako kupuješ
        pretplate (Adobe, Google Ads) koje dolaze kao EU transakcije, često ćeš u praksi
        čuti zahtjev za PDV ID od platforme — u komentarima na Fiskalopediji spominju i
        Shopify kao primjer gdje trži PDV ID za njihove izlazne račune prema tebi, bez
        da automatski mijenja tvoju maloprodaju fizičkim osobama.
      </p>

      <h2 id='primjeri'>Primjeri: platforme i pretplate</h2>
      <p>
        Upwork, Fiverr, Adobe, Google, hosting u EU — svi mogu tražiti identifikator radi
        vlastite usklađenosti. To nije “kazna”, nego tehnički podatak. Paušalac i dalje
        vodi KPR po naplaćenim primitcima i pripremu PO-SD prema uputama s Fiskalopedije.
      </p>

      <h2 id='postupak'>Kako zatražiti na ePoreznoj</h2>
      <p>
        Fiskalopedija opisuje korake: prijava na ePoreznu, obrazac P-PDV, prvi korak s
        osnovnim podacima i datumom početka, drugi korak gdje{' '}
        <strong>ne smiješ</strong> aktivirati opciju upisa u registar PDV obveznika, nego
        odabireš dodjelu PDV ID-a tuzemnome poreznom obvezniku, razlog “porezni obveznik
        koji prima ili obavlja usluge unutar EU”, te za paušalni obrt u polju oblika
        vlasništva “Ostalo” i upis “Paušalni obrt”. Nakon provjere šalješ zahtjev. Rješenje
        stiže od Porezne kada dodijele broj.
      </p>

      <h2 id='posljedice'>Ako zakašnjiš</h2>
      <p>
        Kašnjenje s identifikacijom može zakomplicirati reverse charge i valjanost
        računa dobavljača. Zato mnogi podnesu zahtjev čim potpišu prvi EU ugovor. Fiskalopedija
        preporučuje i VIES provjeru brojeva partnera.
      </p>

      <h2 id='pdv-sustav'>PDV ID vs ulazak u PDV sustav</h2>
      <p>
        Ulazak u PDV sustav znači obračun PDV-a na vlastite račune, razdoblja i dodatne
        liste — to je druga težinska kategorija od “samo PDV ID”. Limit od 60.000 €
        primitaka i dalje je signal za prekid paušalnog statusa prema Fiskalopediji. Kad
        se približiš tom broju, paralelno planiraš i PDV status, ne samo ID.
      </p>
      <p>
        Fiskalopedija preporučuje provjeru valjanosti PDV brojeva partnera u VIES bazi
        prije suradnje. To je korisno kad EU klijent pošalje “čudan” OIB format ili kad
        sumnjaš da je tvrtka u međuvremenu ukinuta. Isti alat pomaže i tebi: kad dobiješ
        vlastiti PDV ID, možeš ga testirati prije nego što ga pošalješ dobavljaču.
      </p>
      <p>
        Reverse charge scenarij (npr. kad primaš uslugu iz EU) tehnički zahtijeva ispravan
        ID i knjiženje kod partnera. Paušalac i dalje ne vodi PDV knjige kao klasičan
        obveznik, ali to ne znači da možeš ignorirati dokumentaciju: ulazni eRačun treba
        znati zaprimiti, što Fiskalopedija spominje u kontekstu Mikro eRačuna i programa za
        izdavanje računa.
      </p>
      <p>
        Za individualna pitanja koristi <Link href='/asistent'>Kvit asistenta</Link> u
        aplikaciji i stručnjaka za granične slučajeve. Za cjelinu obrta vidi još{' '}
        <Link href={vodiciHref('pausalni-obrt-vodic')}>paušalni obrt 2026.</Link> i{' '}
        <Link href='/register'>registraciju na Kvit</Link>.
      </p>
    </GuideShell>
  );
}

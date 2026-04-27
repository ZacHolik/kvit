import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'pausalni-obrt-za-konzultante';

const META_DESC =
  'Paušalni obrt za konzultante i dizajnere 2026.: EU klijenti, PDV ID, platforme poput Upworka, prikriveni radni odnos i limit 60.000 €.';

export const metadata: Metadata = {
  title: 'Paušalni obrt za konzultante',
  description: META_DESC,
  openGraph: {
    title: 'Paušalni obrt za konzultante | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Mogu li konzultant fakturirati stranoj firmi?',
    answer:
      'Da — paušalni obrt može izdavati račune inozemnim tvrtkama uz poštivanje pravila o računu i evidentenciji primitaka. Ako posluješ s EU partnerima, često trebaš PDV ID (vidi vodič o PDV ID-u) iako nisi u sustavu PDV-a.',
  },
  {
    question: 'Što je PDV ID i trebam li ga?',
    answer:
      'PDV ID je OIB s prefiksom HR koji dodjeljuje Porezna na zahtjev. Nije isto što i ulazak u sustav PDV-a. Za usluge unutar EU obično ga trebaš odmah, bez obzira na prag od 10.000 € koji se odnosi na isporuke robe.',
  },
  {
    question: 'Kako se zaštititi od prikrivenog radnog odnosa?',
    answer:
      'Diversifikacija klijenata, jasni ugovori, autonomija u radu i dokumentiranje isporuke. Ako jedan naručitelj dominira prihodima i kontroliše rad, rizik raste — detalje vidi u vodiču o prikrivenom radnom odnosu.',
  },
  {
    question: 'Mogu li imati paušalni obrt i raditi za agenciju?',
    answer:
      'Možeš imati suradnju, ali model “radiš kao da si zaposlen, ali račun ide na obrt” Porezna često ispituje. Svaka situacija je individualna — provjeri s odvjetnikom ili poreznim savjetnikom.',
  },
  {
    question: 'Koji je maksimum primitaka za konzultanta paušalista?',
    answer:
      'Opći limit za paušalni obrt za ulazak u sustav PDV-a je 60.000 € godišnjih primitaka. Prelazak praga mijenja PDV status i često znači izlazak iz paušalnog modela — planiraj prije nego što brojke iznenade.',
  },
];

export default function PauzalniObrtZaKonzultantePage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Paušalni obrt za konzultante i dizajnere 2026.'
      subtitle='IT savjetovanje, UX/UI, brand dizajn: ugovori, EU promet i realni rizici kad jedan klijent “previše” dominira.'
      readingMinutes={12}
      metaDescription={META_DESC}
      toc={[
        { id: 'tko', label: 'Tko spada u ovaj vodič' },
        { id: 'prikriveni', label: 'Prikriveni radni odnos' },
        { id: 'platforme', label: 'Upwork, Toptal, Freelancer' },
        { id: 'pdv-id', label: 'PDV ID za EU' },
        { id: 'ugovor', label: 'Ugovor o djelu vs obrt' },
        { id: 'diversifikacija', label: 'Diversifikacija klijenata' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('pausalni-obrt-za-it-freelancere'), title: 'Paušalni obrt za IT freelancere' },
        { href: vodiciHref('prikriveni-radni-odnos'), title: 'Prikriveni radni odnos' },
        { href: vodiciHref('pdv-id'), title: 'PDV ID broj' },
        { href: vodiciHref('pausalni-obrt-vs-doo'), title: 'Paušalni obrt vs d.o.o.' },
      ]}
    >
      <p>
        <strong>Paušalni obrt za konzultante</strong> danas znači rad s inozemnim
        klijentima, platformama i stalnom promjenom alata. Porezni okvir i dalje je
        isti kao za svaki paušalni obrt: mjesečni doprinosi do 15. u mjesecu (npr. 290,98 €
        u samostalnom modelu), kvartalni paušalni porez prema razredu primitaka, KPR,
        PO-SD do 15. siječnja i limit <strong>60.000 €</strong> primitaka (
        <Link href={vodiciHref('pausalni-obrt-vodic')} className='text-[#0d9488] hover:underline'>
          paušalni obrt — kompletan vodič
        </Link>
        ). Specifičnost konzultanata je poslovni model, ne forma obrta.
      </p>

      <h2 id='tko'>Tko spada u ovaj vodič</h2>
      <p>
        Vodič je pisan za IT konzultante, UX/UI dizajnere, brand dizajnere i slične
        profile koji prodaju vrijeme i ekspertizu. Samostalna arhitektonska djelatnost u
        smislu slobodnih zanimanja spada u poseban režim koji prema službenom vodiču
        Porezne <strong>ne može</strong> biti paušal — ako si arhitekt u tom smislu,
        provjeri klasifikaciju prije registracije. Za dizajn koji nije u izuzetku
        slobodnih zanimanja, paušal ostaje relevantan model uz disciplinu oko primitaka.
      </p>

      <h2 id='prikriveni'>Prikriveni radni odnos</h2>
      <p>
        Najveći rizik za konzultante nije KPR nego odnos s naručiteljem: ako jedna tvrtka
        određuje radno vrijeme, alate i način rada, Porezna može postaviti pitanje
        prikrivenog radnog odnosa. Zato paralelno čitaj{' '}
        <Link href={vodiciHref('prikriveni-radni-odnos')}>vodič o prikrivenom radnom odnosu</Link>
        . Praktična zaštita: više klijenata, jasni opisi isporuke u ponudi, prekid
        suradnji kad uvjeti postanu “zaposlenički”.
      </p>

      <h2 id='platforme'>Upwork, Toptal, Freelancer</h2>
      <p>
        Platforme su marketinški kanal, ne pravni oblik. Račun i dalje izdaješ kao
        hrvatski obrt, a primitak evidentiraš u KPR-u kad novac stigne. Imaj na umu da
        provizije platformi smanjuju neto, ali ne mijenjaju bruto račun prema klijentu.
        Ako primaš isplate iz inozemstva, prati i devizne troškove i datume valute jer
        KPR vežeš uz stvarnu naplatu.
      </p>

      <h2 id='pdv-id'>PDV ID za EU</h2>
      <p>
        Ako posluješ s tvrtkama iz EU (prodaja usluge ili kupnja od dobavljača), trebaš
        PDV identifikacijski broj — bez obzira jesi li u sustavu PDV-a. PDV ID je OIB s
        prefiksom HR, dodjeljuje ga Porezna na zahtjev, i <strong>ne znači</strong> da
        automatski postaješ PDV obveznik koji zaračunava PDV na račune. Postupak na
        ePoreznoj ide kroz obrazac P-PDV s posebnim odabirom opcije za dodjelu PDV ID-a;
        službeni opis provjeri na{' '}
        <a
          href='https://www.porezna-uprava.hr'
          className='text-[#0d9488] hover:underline'
          rel='noopener noreferrer'
          target='_blank'
        >
          Poreznoj upravi
        </a>
        . Za sažetak na Kviku otvori <Link href={vodiciHref('pdv-id')}>PDV ID vodič</Link>.
      </p>

      <h2 id='ugovor'>Ugovor o djelu vs obrt</h2>
      <p>
        Ugovor o djelu i obrt nisu isti pravni okvir. Obrt ti daje kontinuitet branda,
        žiro račun i jednostavnije skaliranje prema više klijenata, ali nosi i fiksne
        mjesečne obveze koje u samostalnom paušalu često znače oko 300 € kada nemaš primitaka
        —
        zato planiraš cashflow kao consultant, ne samo kao “honorar”.
      </p>

      <h2 id='diversifikacija'>Diversifikacija klijenata</h2>
      <p>
        Limit od 60.000 € brzo se približava kad radiš za jednu inozemnu plaću. Loša
        strategija je “jedan enterprise klijent = 100% prihoda”. Bolja je mješavina
        veličina i industrija: lakše dokazuješ autonomiju, lakše preživiš otkaz projekta.
        Kad se približiš limitu, paralelno razmišljaš o{' '}
        <Link href={vodiciHref('pausalni-obrt-vs-doo')}>d.o.o.</Link> ili drugom poreznom
        režimu — prijelaz treba pripremiti prije nego što zadnji kvartal godine postane
        paničan.
      </p>
      <p>
        Konzultantski posao često uključuje i “mali B2B” u Hrvatskoj: lokalna tvrtka želi
        reviziju procesa, paralelno s inozemnim retainerom. I tu vrijedi isti KPR — svaka
        uplata ide u knjigu, bez obzira valuta. Ako klijent plaća u kunama prema starom
        ugovoru ili u eurima, bitno je da iznos na računu, bankovnom nalogu i KPR-u bude
        isti niz znamenki. Inače PO-SD postaje detektivski posao umjesto copy-pastea u
        ePoreznu.
      </p>
      <p>
        Još jedan savjet za dizajnere: licencije (Figma, Adobe) nisu “primitak”, ali su
        trošak koji utječe na maržu. Paušalac ne vodi ulazni PDV kao klasičan obveznik, pa
        se trošak ne “odbija” — zato u cijeni projekta uračunaj pretplate, a ne tek na kraju
        godine kad vidiš prazan račun.
      </p>
      <p>
        Za svakodnevni rad koristi <Link href='/register'>Kvik</Link> za račune i KPR, a
        za složena pitanja <Link href='/asistent'>AI asistenta</Link> unutar aplikacije.
      </p>
    </GuideShell>
  );
}

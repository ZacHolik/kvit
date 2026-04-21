import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'zatvaranje-obrta';

const META_DESC =
  'Zatvaranje paušalnog obrta 2026.: e-Obrtnica, odjava HZMO-a i Porezne, žiro račun, PO-SD za nepotpunu godinu i čuvanje dokumentacije.';

export const metadata: Metadata = {
  title: 'Zatvaranje paušalnog obrta',
  description: META_DESC,
  openGraph: {
    title: 'Zatvaranje paušalnog obrta | Kvit',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvit',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Kako zatvoriti paušalni obrt online?',
    answer:
      'Tipičan slijed započinje e-Obrtnicom (brisanje iz obrtnog registra), zatim slijede odjave kod HZMO-a i Porezne uprave prema uputama koje ti institucije daju u digitalnim servisima. Svaka promjena statusa treba dokaz (PDF potvrde).',
  },
  {
    question: 'Moram li predati PO-SD ako zatvorim obrt?',
    answer:
      'PO-SD prijavljuje primitke i porez za kalendarsku godinu. Ako si dio godine poslovao, u praksi se rješava razdoblje koje je ostvarilo promet — detalje provjeri u uputama za PO-SD i s poreznim savjetnikom ako je situacija složena.',
  },
  {
    question: 'Što se dogodi s dugovima prema Poreznoj?',
    answer:
      'Zatvaranje obrta ne “briše” eventualne obveze koje su nastale do zadnjeg dana poslovanja. Dugovanja i dalje postoje prema propisima; zato prije zatvaranja provjeri PKK na ePoreznoj i podmiruješ doprinos, porez i obrasce.',
  },
  {
    question: 'Koliko traje postupak zatvaranja?',
    answer:
      'Ovisi o brzini obrade u registru, banki i državnim tijelima. Digitalni koraci mogu biti brzi, ali arhiva dokumenata i završni obračuni zahtijevaju strpljenje — planiraj najmanje nekoliko radnih dana po instituciji.',
  },
  {
    question: 'Mogu li ponovo otvoriti obrt nakon zatvaranja?',
    answer:
      'U pravilu da, ali svako novo otvaranje ima svoje troškove i porezne početne korake (npr. RPO). Ako planiraš pauzu, razmisli i o mirovanju obrta umjesto potpunog brisanja — vidi vodič o sezonskom obrtu.',
  },
];

export default function ZatvaranjeObrtaPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Kako zatvoriti paušalni obrt 2026. — korak po korak'
      subtitle='Redoslijed institucija, dokumenti i što ostaje i nakon zadnjeg računa.'
      readingMinutes={10}
      metaDescription={META_DESC}
      toc={[
        { id: 'razlozi', label: 'Razlozi za zatvaranje' },
        { id: 'koraci', label: 'Redoslijed koraka' },
        { id: 'rokovi', label: 'Rokovi po institucijama' },
        { id: 'dugovi', label: 'Dugovi i porezne obveze' },
        { id: 'dokumenti', label: 'KPR, računi i čuvanje' },
        { id: 'po-sd', label: 'PO-SD za nepotpunu godinu' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('pausalni-obrt-vodic'), title: 'Paušalni obrt 2026.' },
        { href: vodiciHref('po-sd-obrazac'), title: 'PO-SD obrazac' },
        { href: vodiciHref('pausalni-obrt-vs-doo'), title: 'Paušalni obrt vs d.o.o.' },
        { href: vodiciHref('sezonski-obrt'), title: 'Sezonski obrt i mirovanje' },
      ]}
      howTo={{
        name: 'Zatvaranje paušalnog obrta — praktični redoslijed',
        description:
          'Sažetak koraka koje većina obrtnika prođe pri prestanku obrta (nisu zamjena za individualni savjet).',
        steps: [
          {
            name: 'Zaustavi nova poslovanja',
            text: 'Zatvori otvorene narudžbe, fakturiraj preostalo i pripremi završni KPR.',
          },
          {
            name: 'e-Obrtnica — brisanje iz registra',
            text: 'Podnesi zahtjev za brisanje obrta i prati status obrta u digitalnom registru.',
          },
          {
            name: 'HZMO — odjava osiguranja',
            text: 'Riješi status obrtnika u mirovinskom sustavu prema uputama HZMO-a.',
          },
          {
            name: 'Porezna — odjava i završni obračuni',
            text: 'Provjeri PKK, podnesi potrebne obrasce i podmiri preostale obveze.',
          },
          {
            name: 'Banka — zatvaranje žiro računa',
            text: 'Nakon što nema novih uplatila, zatvori poslovni račun i arhiviraj izvode.',
          },
        ],
      }}
    >
      <p>
        <strong>Zatvaranje paušalnog obrta</strong> nije samo “ugasiti web stranicu”.
        Paušalni model i dalje ostavlja trag u Poreznoj, HZMO-u i obrtnom registru dok
        formalno ne završiš lanac prijava. Brojčane obveze (doprinosi, kvartalni porez)
        do zadnjeg dana poslovanja prati isti okvir kao u vodiču{' '}
        <a
          href='https://fiskalopedija.hr/baza-znanja/pausalni-obrt'
          className='text-[#0d9488] hover:underline'
          rel='noopener noreferrer'
          target='_blank'
        >
          Paušalni obrt na Fiskalopediji
        </a>
        : mjesečni doprinosi do 15. u mjesecu i kvartalni porez do kraja 3./6./9./12.
        mjeseca. Ovaj članak povezuje te obveze s logistikom zatvaranja.
      </p>

      <h2 id='razlozi'>Razlozi za zatvaranje</h2>
      <p>
        Najčešći razlozi su prijelaz na d.o.o., zaposlenje kao primarni izvor prihoda,
        selidba u inozemstvo ili jednostavno završetak projekta. Paušalni obrt je
        privlačan jer je administrativno lagan, ali kad godina donese promjenu modela,
        zatvaranje treba planirati kao mini-projekt: prvo miran KPR i zadnji računi, pa
        tek institucije. Ako još nisi siguran trebaš li uopće gasiti obrt, usporedi s{' '}
        <Link href={vodiciHref('pausalni-obrt-vs-doo')}>d.o.o.</Link> i razgovorom sa
        savjetnikom.
      </p>

      <h2 id='koraci'>Redoslijed koraka</h2>
      <ol className='list-decimal space-y-3 pl-5'>
        <li>
          <strong>e-Obrtnica — brisanje iz obrtnog registra.</strong> To je “izlazna
          vrata” iz javnog statusa obrtnika. Drži ID prijave i PDF potvrde.
        </li>
        <li>
          <strong>HZMO — odjava osiguranja.</strong> Bez toga ostaješ u sustavu koji
          očekuje obračun doprinosa; zatvaranje obrta i HZMO korak idu ruku pod ruku.
        </li>
        <li>
          <strong>Porezna uprava — odjava poreznog obveznika.</strong> Paralelno provjeri
          ima li otvorenih obveza na PKK-u i podnesi što je potrebno za zadnje razdoblje.
        </li>
        <li>
          <strong>Žiro račun obrta.</strong> Banka traži da nema aktivnih naloga; prvo
          podmiri transakcije, tek onda zatvaranje.
        </li>
      </ol>
      <p>
        Redoslijed može malo varirati ovisno o točnim uputama koje dobiješ u digitalnim
        obrascima — bitno je da nijedna strana ne ostane u zabludi da još posluješ kad si
        već prestao izdati račune.
      </p>

      <h2 id='rokovi'>Rokovi po institucijama</h2>
      <p>
        Za porez i doprinose vrijede isti datumi kao i tijekom života obrta: doprinosi do
        15. u mjesecu, porez do zadnjeg dana kvartala. Zatvaranje sredinom godine znači da
        i dalje moraš paziti na te točke do zadnjeg dana kada si imao status obrtnika.
        PO-SD za tu godinu, kada dođe siječanj, i dalje je tema — vidi sljedeća poglavlja.
      </p>

      <h2 id='dugovi'>Dugovi i porezne obveze</h2>
      <p>
        ePorezna PKK prikazuje što je otvoreno. Ako vidiš dug prema porezu na dohodak ili
        prema doprinosima, podmiruješ prije nego što zatvaraš račun obrta — inače
        slijediš kamate i pisma. Fiskalopedija u kontekstu paušalnog obrta podsjeća da se
        čak i bez primitaka u pojedinim mjesecima dio obveza i dalje može javiti — zato
        zatvaranje ne tretiraj kao “nula prometa, nula brige” bez provjere.
      </p>

      <h2 id='dokumenti'>KPR, računi i čuvanje</h2>
      <p>
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR</Link> i izdani računi ostaju
        arhivska obveza dugi niz godina (u praksi se često spominje jedanaest godina za
        poslovnu dokumentaciju — potvrdi s računovođom za svoj slučaj). Pri zatvaranju
        obrta napravi ZIP arhivu: izvozi iz aplikacije, PDF račune, bankovne izvode i
        potvrde institucija. To ti kasnije štedi živce ako Porezna ili klijent traže
        dokaz o starom obrtu.
      </p>

      <h2 id='po-sd'>PO-SD za nepotpunu godinu</h2>
      <p>
        PO-SD prijavljuje primitke i uplaćeni paušalni porez za kalendarsku godinu. Ako
        si zatvorio obrt nakon nekoliko mjeseci, i dalje očekuj obvezu predaje do{' '}
        <strong>15. siječnja</strong> za tu godinu, uz prilagodbu podataka koje nosi
        nepotpuno razdoblje. U komentarima na Fiskalopediji za PO-SD ističu da u paušalu
        bez primitaka dio obveza i dalje postoji — zato savjet “sve na nulu” nije univerzalan
        bez provjere. Za detalje o poljima otvori{' '}
        <Link href={vodiciHref('po-sd-obrazac')}>vodič o PO-SD-u</Link>.
      </p>
      <p>
        Kada završiš s formalnostima, razmisli želiš li u budućnosti opet{' '}
        <Link href={vodiciHref('otvaranje-obrta')}>otvoriti obrt</Link> ili preći na drugi
        oblik. Ako planiraš ostati u poduzetništvu uz manje papira,{' '}
        <Link href='/register'>Kvit</Link> i dalje može pomoći dok si u paušalu.
      </p>
    </GuideShell>
  );
}

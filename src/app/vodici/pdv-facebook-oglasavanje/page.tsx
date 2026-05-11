import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'pdv-facebook-oglasavanje';

const META_DESC =
  'Kako paušalni obrtnici plaćaju PDV na Facebook i Instagram oglase: reverse charge, PDV ID, ePorezna prijava i knjiženje — korak po korak.';

export const metadata: Metadata = {
  title: 'PDV za Facebook oglašavanje – vodič za paušaliste 2026.',
  description: META_DESC,
  openGraph: {
    title: 'PDV za Facebook oglašavanje – vodič za paušaliste 2026. | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Moram li platiti PDV na Facebook oglase kao paušalist?',
    answer:
      'U tipičnom scenariju da: kad paušalist kupuje oglašavanje od Meta/Facebooka (EU dobavljač), radi se o usluzi iz inozemstva pa se PDV obračunava po “reverse charge” logici. To ne znači da si u sustavu PDV-a za vlastite račune, nego da imaš obvezu obračuna i prijave PDV-a na primljenu uslugu.',
  },
  {
    question: 'Kako dobiti PDV ID broj za Facebook oglašavanje?',
    answer:
      'Najčešće se traži PDV ID (OIB s prefiksom HR) kroz ePoreznu putem obrasca P-PDV, kao dodjela PDV identifikacijskog broja tuzemnom poreznom obvezniku (bez automatskog ulaska u sustav PDV-a). Detaljnije korake imaš u vodiču o PDV ID-u.',
  },
  {
    question: 'Što je reverse charge i kako se primjenjuje?',
    answer:
      'Reverse charge znači da dobavljač ne zaračuna PDV, nego ti kao primatelj usluge u Hrvatskoj sam obračunaš hrvatski PDV na tu uslugu i prijaviš ga u propisanom obrascu za usluge iz inozemstva (najčešće PDV-S).',
  },
  {
    question: 'Koji obrazac predajem za PDV na strane usluge?',
    answer:
      'Za usluge iz inozemstva paušalci najčešće predaju obrazac PDV-S (prema uputama Porezne uprave). U praksi se predaje za razdoblje u kojem je usluga primljena (račun) i/ili plaćena, ovisno o pravilima za nastanak obveze.',
  },
  {
    question: 'Što ako sam oglašavao bez PDV ID broja?',
    answer:
      'To ne znači da PDV “ne postoji”. I dalje može postojati obveza obračuna i prijave PDV-a za ranija razdoblja. U praksi rješenje je napraviti pregled računa i uplata, zatražiti PDV ID i podnijeti ispravke/prijave za propuštena razdoblja uz savjet stručnjaka.',
  },
  {
    question: 'Vrijede li ista pravila za Google i TikTok oglase?',
    answer:
      'U velikom broju slučajeva da: kad primaš uslugu oglašavanja od stranog dobavljača (EU ili izvan EU), mehanizam oporezivanja može biti sličan (reverse charge / oporezivanje prema mjestu primatelja usluge). Detalji ovise o sjedištu dobavljača i pravilima za tu vrstu usluge.',
  },
  {
    question: 'Ulazi li trošak FB oglasa u moj limit od 60.000€?',
    answer:
      'Limit 60.000 € odnosi se na primitke (naplaćene račune / prihod), ne na rashode poput troška oglasa. Trošak oglasa može utjecati na likvidnost, ali sam po sebi ne povećava primitke.',
  },
];

export default function PdvFacebookOglasavanjePage() {
  return (
    <GuideShell
      slug={SLUG}
      title='PDV za Facebook oglašavanje – vodič za paušaliste 2026.'
      subtitle='Meta (Facebook/Instagram) oglasi su “strana usluga”: reverse charge, PDV ID i PDV-S bez ulaska u PDV sustav.'
      readingMinutes={12}
      metaDescription={META_DESC}
      articleDateModified='2026-05-11'
      toc={[
        { id: 'zasto-bez-pdv', label: 'Zašto Facebook naplaćuje bez PDV-a (Irska)' },
        { id: 'reverse-charge', label: 'Reverse charge — što je i kako funkcionira' },
        { id: 'trebam-pdv-id', label: 'Trebam li PDV ID kao paušalist za FB oglase' },
        { id: 'ppdv', label: 'Prijava PDV ID broja (P-PDV) kroz ePoreznu' },
        { id: 'pdvs', label: 'Kako prijaviti PDV na FB oglase (PDV-S)' },
        { id: 'rokovi', label: 'Rokovi za prijavu i plaćanje PDV-a' },
        { id: 'kpr', label: 'Knjiženje FB oglasa u KPR — da ili ne' },
        { id: 'retro', label: 'Što ako si već oglašavao bez PDV-a' },
        { id: 'profil-vs-bm', label: 'Osobni profil vs poslovni oglašivački račun' },
        { id: 'ostali-oglasi', label: 'Google Ads i TikTok Ads — ista pravila?' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('pdv-id'), title: 'PDV ID broj za paušalce – kada ti treba' },
        { href: vodiciHref('doprinosi'), title: 'Doprinosi za paušalni obrt 2026.' },
        { href: vodiciHref('fiskalizacija-20'), title: 'Fiskalizacija 2.0 za paušaliste' },
        { href: vodiciHref('pausalni-obrt-vodic'), title: 'Paušalni obrt 2026. – kompletan vodič' },
        { href: vodiciHref('pausalni-obrt-za-it-freelancere'), title: 'Paušalni obrt za IT freelancere' },
        { href: vodiciHref('pausalni-obrt-vs-doo'), title: 'Paušalni obrt vs d.o.o.' },
      ]}
      howTo={{
        name: 'PDV na Facebook oglašavanje za paušalce (reverse charge)',
        description:
          'Praktičan redoslijed koraka: od PDV ID-a do PDV-S prijave i plaćanja.',
        steps: [
          {
            name: 'Provjeri račune i dobavljača',
            text: 'U Ads Manageru preuzmi račune i provjeri je li dobavljač iz EU (Meta Ireland) te na koga glase podaci (obrt / privatno).',
          },
          {
            name: 'Zatraži PDV ID (ako ga nemaš)',
            text: 'Na ePoreznoj podnesi P-PDV za dodjelu PDV identifikacijskog broja tuzemnom obvezniku (bez ulaska u PDV sustav).',
          },
          {
            name: 'Obračunaj PDV po reverse charge principu',
            text: 'Na osnovicu s računa (bez PDV-a) obračunaj hrvatski PDV po odgovarajućoj stopi za uslugu oglašavanja.',
          },
          {
            name: 'Predaj PDV-S i plati u roku',
            text: 'Predaj obrazac PDV-S za razdoblje u kojem je nastala obveza te izvrši uplatu PDV-a na propisani račun.',
          },
        ],
      }}
    >
      <p>
        Ako si paušalist i pitaš se treba li ti{' '}
        <strong>PDV Facebook oglašavanje paušalni obrt</strong> “nešto posebno”,
        najkraći odgovor je: oglasi na Meta platformama (Facebook i Instagram) u
        pravilu se tretiraju kao usluga iz inozemstva pa dolazi obveza obračuna i
        prijave PDV-a kroz <strong>reverse charge</strong>. Ovo nije isto što i
        “ulazak u PDV” za tvoje izlazne račune, ali jest obveza koju paušalci
        često zaborave dok ne dobiju prvu veću kampanju.
      </p>
      <p>
        U nastavku prolazimo zašto Meta najčešće fakturira bez PDV-a (sjedište u
        Irskoj), treba li ti PDV ID, kako ga prijaviti (P-PDV), kako se radi
        prijava PDV-a na strane usluge (PDV-S), rokove i što s evidencijom u KPR-u.
        Ako želiš širu sliku paušala, kreni od{' '}
        <Link href={vodiciHref('pausalni-obrt-vodic')} className='text-[#0d9488] hover:underline'>
          paušalnog obrta 2026.
        </Link>
        .
      </p>

      <h2 id='zasto-bez-pdv'>Zašto Facebook naplaćuje bez PDV-a (sjedište u Irskoj)</h2>
      <p>
        Kad kupuješ oglase, dobavljač nije “Facebook Hrvatska” nego najčešće{' '}
        <strong>Meta Platforms Ireland</strong> (ili druga povezana entiteta, ovisno o
        postavkama računa). To znači da dobivaš račun iz druge države članice EU-a.
        U B2B režimu (kad je kupac poduzetnik) dobavljač često izdaje račun bez PDV-a
        i očekuje da se porez riješi u državi primatelja usluge.
      </p>
      <p>
        To je jedan od razloga zašto se u praksi pojavljuje potreba za PDV ID brojem:
        platforme žele tehnički dokaz da si porezni obveznik (u smislu PDV identifikacije),
        iako nisi u sustavu PDV-a za svoje račune. Više o razlici pročitaj u vodiču{' '}
        <Link href={vodiciHref('pdv-id')} className='text-[#0d9488] hover:underline'>
          PDV ID broj za paušalce
        </Link>
        .
      </p>

      <h2 id='reverse-charge'>Reverse charge mehanizam — što je i kako funkcionira</h2>
      <p>
        <strong>Reverse charge</strong> (prijenos porezne obveze) pojednostavljeno znači:
        dobavljač ti ne naplati PDV na računu, nego ti u Hrvatskoj sam obračunaš PDV na
        tu uslugu i prijaviš ga u propisanom obrascu. Zato je tema{' '}
        <strong>PDV Facebook oglašavanje paušalni obrt</strong> u praksi kombinacija
        dvije stvari: (1) formalna identifikacija (PDV ID) i (2) periodična prijava/plaćanje
        PDV-a na primljenu uslugu.
      </p>
      <p>
        Važno: reverse charge ovdje ne znači da si “ušao u PDV” u smislu da na svoje račune
        dodaješ PDV. To je zasebna priča vezana uz prag od 60.000 € primitaka i druge uvjete.
        Ako želiš usporedbu što se mijenja kad narasteš, vidi{' '}
        <Link href={vodiciHref('pausalni-obrt-vs-doo')} className='text-[#0d9488] hover:underline'>
          paušalni obrt vs d.o.o.
        </Link>
        .
      </p>

      <h2 id='trebam-pdv-id'>Trebam li PDV ID broj kao paušalist za FB oglase</h2>
      <p>
        U praksi: <strong>najčešće da</strong>, jer Meta račune i porezni tretman postavlja
        kao B2B transakciju unutar EU-a. PDV ID je tvoj OIB s prefiksom HR. Dobivaš ga na
        zahtjev i koristiš ga kad primaš (ili obavljaš) određene usluge unutar EU.
      </p>
      <p>
        Ako ne upišeš PDV ID u postavke oglašavanja, platforma može račun tretirati kao B2C
        (što vodi do drugačijih scenarija s PDV-om), ili možeš završiti s “nečistom”
        dokumentacijom koja te kasnije usporava kod ispravaka. U svakom slučaju, za oglašavanje
        na Meti želiš jasan trag: tko je kupac, koja je država dobavljača i na temelju čega
        se PDV obračunava.
      </p>

      <h2 id='ppdv'>Prijava PDV ID broja kroz ePoreznu (obrazac P-PDV)</h2>
      <p>
        PDV ID se tipično traži preko ePorezne kroz obrazac <strong>P-PDV</strong>, ali uz
        ključnu napomenu: ne prijavljuješ se automatski kao obveznik PDV-a za svoje račune,
        nego tražiš dodjelu PDV identifikacijskog broja. Ako si već upoznat s procesom,
        provjeri sažetak u vodiču{' '}
        <Link href={vodiciHref('pdv-id')} className='text-[#0d9488] hover:underline'>
          PDV ID broj paušalni obrt
        </Link>
        .
      </p>
      <p>
        Nakon dodjele broja, upisuješ ga u Meta Business postavke (Billing/Tax). Time se
        najčešće osigurava da računi budu izdani bez PDV-a i da je reverse charge korektno
        primjenjiv u Hrvatskoj.
      </p>

      <h2 id='pdvs'>Kako prijaviti PDV na FB oglase (obrazac PDV-S)</h2>
      <p>
        Za paušaliste je ključna operativa: kada primiš račun za oglašavanje (ili kada nastane
        obveza prema pravilima), obračunaš PDV na osnovicu i prijaviš ga kroz obrazac{' '}
        <strong>PDV-S</strong>. Obrazac je zamišljen upravo za PDV na “strane usluge” i slične
        transakcije gdje primatelj u Hrvatskoj obračunava PDV.
      </p>
      <p>
        Najčešće greške su: (1) zaboraviti prijavu jer “račun nema PDV”, (2) miješati PDV-S s
        drugim PDV obrascima, (3) pogrešno uzeti tečaj ili osnovicu ako je račun u drugoj valuti,
        (4) nemati konzistentan arhiv računa po mjesecima.
      </p>

      <h2 id='rokovi'>Rokovi za prijavu i plaćanje PDV-a na strane usluge</h2>
      <p>
        Rokovi ovise o razdoblju i pravilima nastanka obveze, ali bit poruke je ista: PDV na
        strane usluge nije “godišnja obveza”, nego se rješava kroz godinu, u rokovima propisanima
        za taj obrazac. Ako želiš širi kalendar obveza, usporedi s{' '}
        <Link href={vodiciHref('rokovi-placanja')} className='text-[#0d9488] hover:underline'>
          rokovima plaćanja za paušalni obrt
        </Link>
        .
      </p>
      <p>
        Ako već koristiš podsjetnike za doprinose (do 15. u mjesecu) iz vodiča{' '}
        <Link href={vodiciHref('doprinosi')} className='text-[#0d9488] hover:underline'>
          doprinosi
        </Link>
        , isti princip primijeni i na PDV-S: napravi si mjesečnu rutinu pregleda oglasa i računa,
        posebno ako kampanje pališ povremeno.
      </p>

      <h2 id='kpr'>Knjiženje FB oglasa u KPR — da ili ne</h2>
      <p>
        KPR (knjiga prometa) je evidencija <strong>naplaćenih primitaka</strong>. Trošak oglasa
        nije primitak i zato se ne upisuje u KPR kao stavka. Ono što paušalist treba imati
        uredno su: ulazni računi/dokazi o usluzi, evidencija plaćanja i dokumentacija za PDV-S
        prijave. KPR i dalje vodiš po naplatama svojih računa prema klijentima — vidi{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')} className='text-[#0d9488] hover:underline'>
          KPR vodič
        </Link>
        .
      </p>
      <p>
        Drugim riječima: <strong>PDV Facebook oglašavanje paušalni obrt</strong> je “PDV obveza”
        na ulaznu uslugu, a ne promjena logike evidencije primitaka.
      </p>

      <h2 id='retro'>Što ako sam već oglašavao bez PDV-a</h2>
      <p>
        Ako si već imao kampanje bez PDV ID-a ili bez prijava, najvažnije je ne “zatvoriti oči”.
        Napravi listu: razdoblja, iznosi, računi i uplate. Zatim odluči hoćeš li prvo rješavati
        PDV ID pa onda PDV-S prijave, ili obrnuto (ovisno o savjetu stručnjaka). U praksi
        je često moguće “posložiti” situaciju retroaktivno, ali što duže čekaš, to je teže
        objasniti i skuplje ispraviti.
      </p>

      <h2 id='profil-vs-bm'>Razlika: osobni FB profil vs poslovni oglašivački račun</h2>
      <p>
        Osobni profil je identitet, ali oglašavanje se u praksi vodi kroz Business Manager / Ads
        račun gdje se postavljaju podaci za naplatu (billing), valuta, metoda plaćanja i porezne
        postavke. Ako oglašavanje “visi” na privatnim podacima, često se dogodi da računi ne glase
        na obrt ili da se PDV tretman ne može uredno dokazati. Cilj je jednostavan: neka kupac bude
        obrt, s jasnim podacima i PDV ID-om.
      </p>

      <h2 id='ostali-oglasi'>Google Ads, TikTok Ads — ista pravila</h2>
      <p>
        U većini scenarija logika je slična: strane platforme oglašavanja izdaju račune iz svojih
        entiteta (često EU) i primjenjuju B2B tretman, što povlači reverse charge i obvezu
        obračuna/prijave PDV-a u Hrvatskoj. Zato pravilo nije “Facebook pravilo”, nego pravilo za
        kupnju stranih usluga oglašavanja.
      </p>
      <p>
        Ako ti je oglašavanje dio šire strategije rasta, paralelno planiraj i fiskalizaciju, eRačune
        i proces izdavanja računa klijentima. Kreni od{' '}
        <Link href={vodiciHref('fiskalizacija-20')} className='text-[#0d9488] hover:underline'>
          fiskalizacije 2.0
        </Link>{' '}
        i{' '}
        <Link href={vodiciHref('izdavanje-racuna')} className='text-[#0d9488] hover:underline'>
          izdavanja računa
        </Link>
        .
      </p>
    </GuideShell>
  );
}


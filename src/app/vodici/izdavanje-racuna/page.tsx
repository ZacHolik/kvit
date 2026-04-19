import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'izdavanje-racuna';

const META_DESC =
  'Izdavanje računa paušalni obrt: obvezni elementi, format broja 1-2026, PDV čl. 90, IBAN, fiskalizacija i eRačun. Praktičan vodič za 2026.';

export const metadata: Metadata = {
  title: 'Izdavanje računa paušalni obrt',
  description: META_DESC,
  openGraph: {
    title: 'Izdavanje računa paušalni obrt | Kvit',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvit',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Što mora pisati na računu paušalnog obrtnika?',
    answer:
      'Obvezno su naziv i OIB obrtnika, adresa, datum izdavanja, jedinstveni broj računa, opis usluge ili robe, količina, cijena, ukupni iznos, način plaćanja te napomena o PDV-u ako nisi u sustavu PDV-a (često članak 90. Zakona o PDV-u).',
  },
  {
    question: 'Trebam li PDV na računu?',
    answer:
      'Ako nisi u sustavu PDV-a, ne obračunavaš PDV, ali moraš imati jasnu rečenicu da PDV nije obračunat sukladno zakonu. Kad uđeš u PDV, format računa se mijenja.',
  },
  {
    question: 'Koji je ispravan format broja računa?',
    answer:
      'Mnogi paušalisti koriste jednostavan redni broj i godinu, npr. 1-2026, 2-2026. Bitno je dosljednost i jedinstvenost broja unutar godine.',
  },
  {
    question: 'Moram li fiskalizirati račun?',
    answer:
      'Za transakcijske račune u krajnjoj potrošnji od 1.1.2026. često da, prema pravilima fiskalizacije 2.0. Za čiste B2B scenarije do 2027. mogu postojati iznimke — provjeri svoj slučaj.',
  },
  {
    question: 'Kako poslati račun firmi (eRačun)?',
    answer:
      'eRačun ide kroz certificirane sustave i propisane formate, ne kao običan PDF u prilogu. Program za račune povezan s informacijskim posrednikom obično pokriva slanje.',
  },
];

export default function IzdavanjeRacunaPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Izdavanje računa u paušalnom obrtu – što mora pisati'
      subtitle='Obvezni elementi, format, fiskalizacija i čuvanje — da svaki račun drži vodu.'
      readingMinutes={11}
      metaDescription={META_DESC}
      toc={[
        { id: 'elementi', label: 'Obvezni elementi računa' },
        { id: 'broj', label: 'Format broja računa' },
        { id: 'pdv', label: 'PDV i članak 90.' },
        { id: 'fiskal', label: 'Fiskalizacija i gotovina' },
        { id: 'eracun', label: 'eRačun za firme' },
        { id: 'iban', label: 'IBAN na računu' },
        { id: 'cuvanje', label: 'Čuvanje računa' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('fiskalizacija-20'), title: 'Fiskalizacija 2.0' },
        { href: vodiciHref('pausalni-obrt-za-it-freelancere'), title: 'Paušalni obrt za IT freelancere' },
        { href: vodiciHref('pausalni-obrt-za-fotografe'), title: 'Paušalni obrt za fotografe' },
        { href: vodiciHref('kpr-knjiga-prometa'), title: 'KPR knjiga prometa' },
        { href: vodiciHref('po-sd-obrazac'), title: 'PO-SD obrazac' },
      ]}
      howTo={{
        name: 'Izdavanje ispravnog računa u paušalu',
        description:
          'Kratki tijek od ponude do arhive računa za tipičan paušalni obrt.',
        steps: [
          {
            name: 'Provjeri podatke kupca',
            text: 'Za firmu OIB i sjedište; za fizičku osobu ime i kontakt ako treba.',
          },
          {
            name: 'Odredi broj računa i datum',
            text: 'Koristi dosljedan niz (npr. 12-2026) i stvarni datum izdavanja.',
          },
          {
            name: 'Unesi stavke i ukupno',
            text: 'Jasno opiši uslugu, količinu, cijenu i zbroj; dodaj PDV napomenu.',
          },
          {
            name: 'Fiskaliziraj ako je potrebno',
            text: 'Za B2C transakcijske račune pokreni fiskalni korak u programu.',
          },
          {
            name: 'Pošalji i arhiviraj PDF',
            text: 'Spremi izdanu kopiju najmanje 11 godina sukladno zakonu o računovodstvu.',
          },
        ],
      }}
    >
      <p>
        <strong>Izdavanje računa paušalni obrt</strong> nije &quot;lijep PDF&quot; nego
        pravni dokument koji mora zadovoljiti propise i kasnije se pojaviti u{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR-u</Link> i na{' '}
        <Link href={vodiciHref('po-sd-obrazac')}>PO-SD obrascu</Link>. U vodiču prolazimo
        elemente koje moraš znati napamet, vezu s{' '}
        <Link href={vodiciHref('fiskalizacija-20')}>fiskalizacijom 2.0</Link> i razliku
        između običnog računa i eRačuna. Za širi kontekst vidi i{' '}
        <Link href={vodiciHref('pausalni-obrt-vodic')}>paušalni obrt 2026.</Link>
      </p>

      <h2 id='elementi'>Obvezni elementi računa</h2>
      <p>
        Račun mora jasno identificirati izdavatelja: poslovno ime obrta, OIB, adresa
        obavljanja ili sjedište ako je primjenjivo. Zatim slijede podaci o kupcu koliko
        ih zakon zahtijeva u tvojoj vrsti prometa, broj računa koji se ne smije
        ponavljati u istoj godini, datum, način plaćanja i stavke s cijenom i ukupno.
        Ako primaš plaćanje na žiro, IBAN na računu olakšava klijentu i smanjuje
        pitanja &quot;kamo platiti&quot;.
      </p>
      <p>
        Mnogi paušalisti zaborave rečenicu o PDV-u — to nije sitnica. Ako nisi u sustavu
        PDV-a, jasno napiši da PDV nije obračunat sukladno članku 90. Zakona o PDV-u
        (tekst može biti kraći ili duži, ali smisao mora biti točan). Kupac tako zna da
        ne traži uračunati PDV.
      </p>

      <h2 id='broj'>Format broja računa</h2>
      <p>
        Uobičajeni format za paušaliste bez fiskalnog brojačkog sustava starog tipa je
        jednostavan: redni broj i godina odvojeni crticom, npr. <strong>1-2026</strong>.
        Bitno je da sustav koji koristiš ne generira duplikate i da brojevi idu
        logičkim redom. Ako kasnije prelaziš na softver koji upravlja serijama, prilagodi
        se njegovim pravilima, ali zadrži čitljivost za klijente.
      </p>

      <h2 id='pdv'>PDV i članak 90.</h2>
      <p>
        Paušalisti ispod praga PDV-a ne dodaju PDV na račun, ali moraju transparentno
        reći da nisu u sustavu. Ta napomena štiti i tebe i kupca u slučaju inspekcije.
        Kad prijeđeš prag, cijela logika računa se mijenja — tada trebaš modele računa
        s PDV stopama i evidencijom.
      </p>

      <h2 id='fiskal'>Fiskalizacija i gotovina</h2>
      <p>
        Gotovina i kartice u B2C često povlače fiskalizaciju transakcijskih računa od
        2026. To znači da program mora poslati podatke Poreznoj i vratiti potvrdu prije
        nego što račun smatraš konačnim. Ako si do sada slao Word ili Excel klijentima,
        vrijeme je za <Link href='/register'>digitalno rješenje</Link> poput Kvita.
      </p>

      <h2 id='eracun'>eRačun za firme</h2>
      <p>
        Kad izdaješ račun pravnoj osobi, u mnogim slučajevima ćeš morati slati pravi
        eRačun kroz mrežu, ne samo PDF. To je odvojeno od fiskalizacije, iako se u praksi
        često događa u istom programu. Rokovi za paušaliste u B2B kontekstu često su
        vezani uz 2027. — prati službene novosti.
      </p>

      <h2 id='iban'>IBAN na računu</h2>
      <p>
        IBAN nije uvijek zakonski obvezan na svakom obrascu, ali je praktičan i smanjuje
        greške pri plaćanju. U Kvitu ga možeš spremiti u profil obrta i automatski
        ispisivati na PDF računima. Ako ga nemaš, klijenti često traže dodatne poruke.
      </p>

      <h2 id='cuvanje'>Čuvanje računa</h2>
      <p>
        Zakonski rok čuvanja računa u poslovanju tipično je jedanaest godina — arhiviraj
        PDF-ove i povezane potvrde fiskalizacije na sigurnom mediju. Cloud uz backup je
        praktičan, ali provjeri tko je voditelj obrade podataka. Za poveznicu s
        knjigovodstvenim tragom vidi vodič o{' '}
        <Link href={vodiciHref('otvaranje-obrta')}>otvaranju obrta</Link> i{' '}
        <Link href={vodiciHref('doprinosi')}>doprinosima</Link>. Za brza pitanja o
        aplikaciji koristi <Link href='/asistent'>AI asistenta</Link>.
      </p>
    </GuideShell>
  );
}

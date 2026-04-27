import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'knjiga-trazbi';

const META_DESC =
  'Knjiga tražbina paušalni obrt: razlika od KPR-a, tko vodi evidenciju nenaplaćenih računa i veza s PO-SD-om (naplaćeno vs izdano).';

export const metadata: Metadata = {
  title: 'Knjiga tražbina paušalni obrt',
  description: META_DESC,
  openGraph: {
    title: 'Knjiga tražbina paušalni obrt | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Što je knjiga tražbina?',
    answer:
      'Knjiga tražbina je evidencija potraživanja: popis izdanih računa koji još nisu plaćeni ili su djelomično plaćeni. Služi da vidiš tko ti duguje novac, odvojeno od knjige prometa.',
  },
  {
    question: 'Razlikuje li se od KPR-a?',
    answer:
      'Da. KPR za paušaliste bilježi naplaćene primitke (gotovina / bezgotovina). Knjiga tražbina prati stanje potraživanja i ne zamjenjuje KPR.',
  },
  {
    question: 'Moram li je voditi kao paušalist?',
    answer:
      'Obveza ovisi o zakonu koji regulira vođenje knjige tražbina za tvoj oblik i djelatnost. Ako si u dvojbi, provjeri s računovođom ili Poreznom. Mnogi paušalisti je ipak vode dobrovoljno jer im olakšava naplatu.',
  },
  {
    question: 'Što ako klijent ne plati račun?',
    answer:
      'Prvo evidencija u knjizi tražbina, potom proces naplate (opomene, dogovor, ovrha). Paušalni PO-SD gleda naplaćene primitke, stoga izdan ali neplaćen račun ne smiješ tretirati kao “već završeno u KPR-u”.',
  },
  {
    question: 'Kako evidentirati djelomično plaćene račune?',
    answer:
      'Vodi kolonu preostalog iznosa po računu. Kad uplata stigne u cijelosti, tada unosiš primitak u KPR u skladu s pravilima knjige prometa.',
  },
];

export default function KnjigaTrazbiPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Knjiga tražbina paušalni obrt — moraš li je voditi'
      subtitle='Potraživanja vs promet: zašto KPR i tražbine rješavaju dvije različite glavobolje.'
      readingMinutes={8}
      metaDescription={META_DESC}
      toc={[
        { id: 'sto', label: 'Što je knjiga tražbina' },
        { id: 'kpr', label: 'Razlika prema KPR-u' },
        { id: 'tko', label: 'Tko je obvezan' },
        { id: 'vodjenje', label: 'Jednostavno vođenje' },
        { id: 'neplaceno', label: 'Neplaćeni račun' },
        { id: 'po-sd', label: 'Veza s PO-SD-om' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('kpr-knjiga-prometa'), title: 'KPR knjiga prometa' },
        { href: vodiciHref('izdavanje-racuna'), title: 'Izdavanje računa' },
        { href: vodiciHref('po-sd-obrazac'), title: 'PO-SD obrazac' },
      ]}
    >
      <p>
        <strong>Knjiga tražbina paušalni obrt</strong> često zvuči kao još jedna knjiga
        pored KPR-a. U praksi je to točnije evidencija <em>tko ti još duguje novac</em>,
        dok je KPR (vidi{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>vodič o KPR-u</Link>) popis{' '}
        <em>naplaćenih</em> primitaka koji
        ulaze u porezni i statistički krug paušaliste. Razumijevanje te razlike štedi od
        grešaka na PO-SD-u, jer se tamo prijavljuju primitci koji su stvarno prošli kroz
        račun obrta, ne “onoliko koliko sam mislio da će platiti”.
      </p>

      <h2 id='sto'>Što je knjiga tražbina</h2>
      <p>
        Knjiga tražbina je poslovna evidencija potraživanja. Svaki red tipično sadrži:
        broj računa, partnera, datum dospijeća, iznos, uplaćeni dio i preostalo. Za
        jednoosobni obrt dovoljna je i jednostavna tablica — bitna je disciplina, ne
        zlatni okvir. Mnogi koriste istu tablicu i kao CRM: tko kasni, tko često plaća u
        dijelovima, tko treba podsjetnik prije zatvaranja godine.
      </p>

      <h2 id='kpr'>Razlika prema KPR-u</h2>
      <p>
        U KPR se upisuju primitci — uplate na žiro, gotovina,
        kartice — vezano uz izdane račune. Ako račun još nije plaćen, nema primitka u tom
        smislu. Knjiga tražbina drži “pending” stanje: račun je izdan, usluga odrađena ili
        roba predana, ali novac još nije stigao. Kad uplata legne, tada radiš unos u KPR
        (isti dan ili u skladu s pravilom koje si si zadao) i u knjizi tražbina zatvaraš
        stavku.
      </p>
      <p>
        Zato paralelno vođenje nije dupli posao nego dva različita kuta iste priče: KPR =
        “što je prošlo kroz blagajnu”, tražbine = “tko još mora poslati nalog”.
      </p>

      <h2 id='tko'>Tko je obvezan</h2>
      <p>
        Zakonska obveza vođenja knjige tražbina ovisi o tvrtki/obliku i djelatnosti. Za
        paušalni obrt ne postoji isti medijski mit kao za KPR — zato ne možemo reći
        univerzalno “moraš” bez pregleda tvog slučaja. Ako si u dvojbi, pitaj
        računovođu. Čak i kad nije strogo obavezno, tražbine su često isplative jer
        smanjuju izgubljene iznose kod agencija i većih klijenata.
      </p>

      <h2 id='vodjenje'>Jednostavno vođenje</h2>
      <p>
        Minimalni set stupaca: broj računa, kupac, iznos, datum, dospijeće, status
        (otvoreno / djelomično / zatvoreno), zadnja napomena. Ako koristiš Kvik ili drugi
        alat, provjeri postoji li modul za otvorene stavke; ako ne, CSV u mapi “obrt
        2026” sasvim dobro radi. Važnije od softvera je tjedni ritual: petkom pregledaš
        otvorene račune i šalješ podsjetnik prije vikenda.
      </p>

      <h2 id='neplaceno'>Neplaćeni račun</h2>
      <p>
        Kad klijent ne plati, proces je poslovni, ne samo knjigovodstveni: ponuda za
        plan otplate, zadržana usluga, ili prekid suradnje. Knjiga tražbina ti daje broj
        dana kašnjenja i zbroj rizika. Ako vjeruješ da naplata neće doći, računovođa
        može voditi i kroz otpis — to je već druga kategorija i ne smiješ je miješati s
        KPR-om bez stručnog savjeta.
      </p>

      <h2 id='po-sd'>Veza s PO-SD-om</h2>
      <p>
        PO-SD sumira naplaćene primitke u godini, prema poljima obrasca i uputama Porezne.
        Ako si
        u knjizi tražbina “bogat” neplaćenim računima, tvoj KPR (i stoga PO-SD) neće
        odražavati tu želju — što je dobro za porez, ali loše za cashflow. Zato
        konsultanti i agencijski klijenti često traže avans ili milestone uplate: smanjuje
        tražbine i drži KPR usklađenim s novcem koji stvarno leži na računu.
      </p>
      <p>
        Zamisli scenarij: izdao si račun u studenom, klijent platio pola u prosincu, ostatak
        u siječnju. Knjiga tražbina ima jedan red s dva “partial payment” zapisa. KPR dobiva
        dva unosa u datume stvarnih uplata, jer je paušalni primitak vezan uz naplatu, ne uz
        datum izdavanja računa. Na kraju godine PO-SD zbraja samo ono što je prošlo kroz
        te unose — ako to vizualiziraš unaprijed, izbjegavaš paniku kad ePorezna traži
        podudaranje s bankom.
      </p>
      <p>
        Knjiga tražbina pomaže i kod interne odluke “trebam li ići u ovrhu”. Kad vidiš da
        isti iznos visi mjesecima, lakše procijeniš trošak advokata naspram otpisa. To
        nije porezna tema nego poslovna, ali izravno utječe na likvidnost iz koje plaćaš
        i <Link href={vodiciHref('doprinosi')}>doprinose</Link> do 15. u mjesecu.
      </p>
      <p>
        Za praktičan rad na računima i KPR-u otvori{' '}
        <Link href='/register'>Kvik</Link> i pročitaj{' '}
        <Link href={vodiciHref('izdavanje-racuna')}>izdavanje računa</Link>.
      </p>
    </GuideShell>
  );
}

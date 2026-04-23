import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'po-sd-obrazac';

const META_DESC =
  'PO-SD obrazac kako ispuniti: rok 15. siječnja, ePorezna, razredi paušalnog poreza 2026., česte greške i što ako kasniš. Vodič za paušaliste.';

export const metadata: Metadata = {
  title: 'PO-SD obrazac kako ispuniti',
  description: META_DESC,
  openGraph: {
    title: 'PO-SD obrazac kako ispuniti | Kvit',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvit',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Do kada se predaje PO-SD obrazac?',
    answer:
      'PO-SD se predaje do 15. siječnja za prethodnu kalendarsku godinu. Rok je fiksan u praksi paušalista i kasnjenje može povući kamate ili druge posljedice — provjeri uvijek i službeni kalendar Porezne uprave.',
  },
  {
    question: 'Gdje se predaje PO-SD obrazac?',
    answer:
      'Najčešće putem ePorezne, elektroničkim putem. Alternativno, ovisno o uputama za godinu, moguće je i fizička predaja u ispostavu ako je propisano — digitalni kanal je danas standard.',
  },
  {
    question: 'Kako izračunati paušalni porez?',
    answer:
      'Paušalni porez na dohodak ovisi o razredu ukupnih primitaka u prethodnoj godini. Tromjesečne uplate množeš prema propisanim iznosima za svoj razred. Na PO-SD-u zbrajaš primitke i usklađuješ s već uplaćenim iznosima.',
  },
  {
    question: 'Što ako nisam predao PO-SD na vrijeme?',
    answer:
      'Predaja nakon roka može značiti kamate, uključivanje u nadzor ili druge mjere. Najbolje je što prije predati i dokumentirati razlog kašnjenja ako postoji opravdana okolnost — kontaktiraj Poreznu ili savjetnika.',
  },
  {
    question: 'Moram li predati PO-SD ako nisam imao prihoda?',
    answer:
      'Ako si u paušalnom režimu i obrt je bio aktivan, često postoji obveza predaje i uz nulte primitke — potvrdi za svoj slučaj. Nulta predaja i dalje može biti formalni zahtjev.',
  },
];

export default function PoSdObrazacPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='PO-SD obrazac 2026. – kako ispuniti i predati'
      subtitle='Od podataka u KPR-u do predaje u ePoreznoj: praktičan pregled za paušaliste.'
      readingMinutes={11}
      metaDescription={META_DESC}
      toc={[
        { id: 'sto-je', label: 'Što je PO-SD?' },
        { id: 'rok', label: 'Rok predaje' },
        { id: 'razredi', label: 'Razredi poreza i primitci' },
        { id: 'ispuna', label: 'Kako ispuniti obrazac' },
        { id: 'eporezna', label: 'Predaja putem ePorezne' },
        { id: 'greske', label: 'Česte greške' },
        { id: 'kasnjenje', label: 'Što ako kasniš' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('doprinosi'), title: 'Doprinosi za paušalni obrt' },
        { href: vodiciHref('kpr-knjiga-prometa'), title: 'KPR knjiga prometa' },
        { href: vodiciHref('pausalni-obrt-vodic'), title: 'Paušalni obrt 2026.' },
        { href: vodiciHref('pausalni-obrt-vs-doo'), title: 'Paušalni obrt vs d.o.o.' },
      ]}
      howTo={{
        name: 'Kako ispuniti i predati PO-SD obrazac',
        description:
          'Koraci od prikupljanja podataka do službene predaje za paušalni obrt.',
        steps: [
          {
            name: 'Zbroji primitke iz KPR-a',
            text: 'Odvoji gotovinske i bezgotovinske primitke prema poljima obrasca i uskladi s računima.',
          },
          {
            name: 'Utvrdi razred i uplaćeni porez',
            text: 'Prema ukupnim primitcima odredi razred i zbroji što si već platio kvartalno.',
          },
          {
            name: 'Popuni PO-SD u ePoreznoj ili PDF predlošku',
            text: 'Unesi podatke polje po polje; provjeri zbrojeve i zaokruženja.',
          },
          {
            name: 'Predaj i spremi potvrdu',
            text: 'Pošalji obrazac prije roka i arhiviraj XML/PDF i potvrdu o primitku.',
          },
        ],
      }}
    >
      <p>
        Ako tražiš odgovor na pitanje <strong>PO-SD obrazac kako ispuniti</strong>, ovaj
        vodič prolazi cijeli životni ciklus obrasca: što predstavlja, koji je rok, kako
        povezuješ podatke s <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR knjigom prometa</Link>{' '}
        i kako izbjegavati tipične greške. Paušalni obrt 2026. i dalje zahtijeva disciplinu
        u evidenciji — bez nje PO-SD postaje noćna mora umjesto rutine.
      </p>

      <h2 id='sto-je'>Što je PO-SD?</h2>
      <p>
        PO-SD je godišnji izvještaj o paušalnom dohotku i uplaćenom paušalnom porezu na
        dohodak. Drugim riječima, državi jednom godišnje pokazuješ koliko si naplatio
        primitaka i koliko si poreza stvarno platio kroz kvartale. Obrazac povezuje
        realne primitke iz poslovanja s razredima i obračunom koji si već primjenjivao
        tijekom godine.
      </p>
      <p>
        Bez točnog KPR-a teško ispunjavaš PO-SD: brojke moraju biti konzistentne s
        računima i bankovnim izvodima. Zato mnogi paušalisti prvo srede digitalni KPR
        u Kvitu, pa tek onda prelaze na PO-SD generiran iz istih podataka.
      </p>

      <h2 id='rok'>Rok predaje</h2>
      <p>
        Standardni rok za prethodnu godinu je <strong>15. siječnja</strong>. Taj datum
        pamti kao jednako važan kao kvartalni porezi ili mjesečni{' '}
        <Link href={vodiciHref('doprinosi')}>doprinosi paušalni obrt iznos</Link>: ako
        propustiš, otvaraju se dodatni administrativni i financijski rizici. U kalendaru
        si postavi podsjetnik barem tjedan dana ranije da imaš vremena za korekcije.
      </p>

      <h2 id='razredi'>Razredi poreza i primitci</h2>
      <p>
        Paušalni porez nije jedan fiksni iznos za sve: razredi ovise o ukupnim
        primitcima u prethodnoj godini. Tromjesečno plaćaš prema tablici koja odgovara
        tvom razredu, a na PO-SD-u pokazuješ je li zbroj uplata usklađen s godišnjom
        slikom. Ako si tek prvu godinu u obrtu, posebna pravila za početnike mogu
        koristiti procjene iz RPO obrasca — detalje provjeri u službenim uputama.
      </p>
      <p>
        U praksi greške nastaju kad se pomiješaju primitci iz gotovine i žiralnih
        uplata ili kad se zaboravi račun iz prosinca koji je stigao na račun u siječnju.
        Svaka stavka mora imati jasan trag do izdanog računa.
      </p>

      <h2 id='ispuna'>Kako ispuniti obrazac</h2>
      <p>
        Počni od tri brojke: ukupno gotovina, ukupno bezgotovina, zbroj. Zatim usporedi
        s poljima obrasca koja traže te iste kategorije. Nakon toga upiši paušalni
        dohodak prema uputi i provjeri podudaranje s razredom. Na kraju unesi ukupno
        uplaćeni paušalni porez — zbroj kvartalnih uplata mora se slagati s bankovnim
        izvodima.
      </p>
      <p>
        Ako koristiš online kalkulator ili predložak s interneta, dobro je presjeći
        ručno ključne zbrojeve. Automatizacija pomaže, ali
        odgovornost za točnost ostaje na tebi kao poreznom obvezniku.
      </p>

      <h2 id='eporezna'>Predaja putem ePorezne</h2>
      <p>
        ePorezna je glavni kanal predaje: prijavi se certifikatom, odaberi obrazac,
        prenesi podatke i pošalji. Spremi potvrdu o primitku i izvoz u arhivu. Ako si
        prvi put u sustavu, rezerviraj vrijeme za tehničke korake (certifikat, lozinke,
        testna okolina ako postoji).
      </p>
      <p>
        Kvit kao aplikacija cilja olakšati dio posla prikupljanjem primitaka kroz godinu
        tako da kasnije imaš manje ručnog prepisivanja u PO-SD — pogledaj{' '}
        <Link href='/register'>besplatnu registraciju</Link> ako želiš cjelinu na jednom
        mjestu.
      </p>

      <h2 id='greske'>Česte greške</h2>
      <p>
        Najčešće su: pogrješno zbrojeni gotovinski i bezgotovinski dio, krivi razred,
        zaboravljeni računi iz zadnjih dana godine, nekonzistentnost između KPR-a i
        bankovnog izvoda te pogrješno zaokruživanje na cent. Druga skupina grešaka je
        procesna — predaja bez arhive potvrde ili predaja zadnjeg trenutka bez provjere.
      </p>

      <h2 id='kasnjenje'>Što ako kasniš</h2>
      <p>
        Ako si zakasnio, predaj što prije i dokumentiraj razlog. Porezna može naplatiti
        kamate ili pokrenuti postupak. Bolje je proaktivno kontaktirati nego čekati
        automatsku sankciju. Uz to, uskladi KPR i buduće kvartalne uplate da se problem
        ne ponavlja.
      </p>
      <p>
        Za povezanu logiku primitaka pročitaj i vodič o{' '}
        <Link href={vodiciHref('izdavanje-racuna')}>izdavanju računa</Link>, a za širi
        kontekst <Link href={vodiciHref('pausalni-obrt-vodic')}>paušalni obrt 2026.</Link>{' '}
        Pitaj <Link href='/asistent'>AI asistenta u Kvitu</Link> za sitnice u aplikaciji.
      </p>
    </GuideShell>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'sezonski-obrt';

const META_DESC =
  'Sezonski paušalni obrt i mirovanje: KPR, PO-SD, doprinosi do 15. u mjesecu kad posluješ, turističke djelatnosti i planiranje limita od 60.000 €.';

export const metadata: Metadata = {
  title: 'Sezonski paušalni obrt mirovanje',
  description: META_DESC,
  openGraph: {
    title: 'Sezonski paušalni obrt mirovanje | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Mogu li privremeno zaustaviti obrt?',
    answer:
      'Privremeni prekid ili mirovanje obrta formalno se rješava kroz obrtni registar i povezane digitalne servise. Prije odluke provjeri aktualne upute na e-Obrtnici i kod savjetnika jer se propisi mogu mijenjati.',
  },
  {
    question: 'Moram li plaćati doprinose dok obrt miruje?',
    answer:
      'Dok si obrtnik u statusu koji podliježe doprinosima, država i dalje vidi obvezu osim ako postoji poseban režim ili rješenje koje to mijenja. U tipičnom samostalnom paušalu mjesečni doprinosi idu do 15. u mjesecu — zato mirovanje moraš planirati zajedno s HZMO-om i obrtnim registrom, ne “u glavi”.',
  },
  {
    question: 'Kako prijaviti mirovanje obrta?',
    answer:
      'Koristi digitalne kanale obrtnog registra (e-Obrtnica) i sljedeće korake koje ti sustav prikaže. Spremi potvrde i datume jer će ti trebati za godišnje obrasce.',
  },
  {
    question: 'Koliko dugo može trajati mirovanje?',
    answer:
      'Trajanje ovisi o vrsti mirovanja i obrtnom zakonu — provjeri zadnji tekst zakona ili uputu na stranicama Ministarstva / obrtničke komore. Ovaj vodič ne navodi maksimum jer se može zakonski mijenjati.',
  },
  {
    question: 'Utječe li mirovanje na PO-SD obrazac?',
    answer:
      'PO-SD i dalje prikazuje što se dogodilo u kalendarskoj godini: ako si dio godine poslovao, upisuješ stvarne naplaćene primitke iz KPR-a. Ako si cijelu godinu u mirovanju bez prometa, situacija je drugačija — provjeri primjer s PO-SD stranice i Porezne.',
  },
];

export default function SezonskiObrtPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Sezonski paušalni obrt — mirovanje i doprinosi'
      subtitle='Kako planirati sezonu, evidenciju i poreske obveze kad posao nije ravnomjeran kroz godinu.'
      readingMinutes={9}
      metaDescription={META_DESC}
      toc={[
        { id: 'sto', label: 'Što je mirovanje i tko ga koristi' },
        { id: 'prijava', label: 'Kako prijaviti mirovanje' },
        { id: 'doprinosi', label: 'Doprinosi u neaktivnim mjesecima' },
        { id: 'nastavak', label: 'Odjava mirovanja i nastavak rada' },
        { id: 'kpr', label: 'KPR za nepotpunu godinu' },
        { id: 'po-sd', label: 'PO-SD i sezonalnost' },
        { id: 'turizam', label: 'Turistička djelatnost' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('zatvaranje-obrta'), title: 'Zatvaranje obrta' },
        { href: vodiciHref('doprinosi'), title: 'Doprinosi za paušalni obrt' },
        { href: vodiciHref('pausalni-obrt-za-ugostitelje'), title: 'Paušalni obrt za ugostitelje' },
        { href: vodiciHref('rokovi-placanja'), title: 'Rokovi plaćanja' },
      ]}
    >
      <p>
        Pojam <strong>sezonski paušalni obrt mirovanje</strong> spaja dvije stvari:
        neravnomjerni primitci (ljeto puno, zima ništa) i formalni status obrta koji ne
        smiješ “pustiti niz vodu” jer državni sustavi i dalje očekuju prijave. Osnovni
        Osnovni ritam paušala: račun → KPR isti dan, doprinosi do 15. u mjesecu, kvartalni
        porez, godišnji PO-SD do 15. siječnja — vidi{' '}
        <Link href={vodiciHref('pausalni-obrt-vodic')} className='text-[#0d9488] hover:underline'>
          paušalni obrt 2026.
        </Link>
        . Sezonalnost mijenja samo to koliko često diraš KPR, ne i postojanje obveza dok
        si aktivan obrtnik.
      </p>

      <h2 id='sto'>Što je mirovanje i tko ga koristi</h2>
      <p>
        Mirovanje obrta koriste obrtnici koji privremeno neće obavljati djelatnost:
        sezonski ugostitelji, ski instruktori, festival fotografi ili obrti vezani uz
        ljetni turizam. Cilj je formalno odvojiti “ne radim” od “radim ali ne prijavljujem
        promet”. Bez prijave mirovanja i dalje izgledaš kao aktivan obrt u registru, što
        nije ista poruka prema Poreznoj i HZMO-u.
      </p>

      <h2 id='prijava'>Kako prijaviti mirovanje</h2>
      <p>
        Praktičan put je digitalan: e-Obrtnica i službena dokumentacija obrtnog registra.
        Prije slanja provjeri ima li otvorenih računa, najavljenih poslova ili najma
        opreme koji te vežu uz “aktivnost”. Ako si u turizmu, paralelno provjeri i TZ1
        obvezu jer se turistička članarina veže uz registriranu djelatnost i postojanje
        prometa — provjeri TZ1 upute na{' '}
        <a
          href='https://www.gov.hr'
          className='text-[#0d9488] hover:underline'
          rel='noopener noreferrer'
          target='_blank'
        >
          gov.hr
        </a>{' '}
        i kod nadležne turističke zajednice.
      </p>

      <h2 id='doprinosi'>Doprinosi u neaktivnim mjesecima</h2>
      <p>
        Za samostalni paušal u praksi se najčešće navodi mjesečni iznos <strong>290,98 €</strong>{' '}
        doprinosa do 15. u mjesecu. To znači da sezonalnost sama po sebi ne ukida
        mjesečnu obvezu dok si u statusu aktivnog obrta bez posebnog režima. Mirovanje,
        ako je formalno prihvaćeno, mijenja tu sliku — stoga je ključno imati datum
        početka i kraja mirovanja iz registra, ne vlastitu procjenu “nismo na plaži pa
        ne plaćam”.
      </p>

      <h2 id='nastavak'>Odjava mirovanja i nastavak rada</h2>
      <p>
        Kad sezona krene, obratno prijavi nastavak rada kako bi računi i fiskalizacija bili
        usklađeni. Ako koristiš aplikaciju za račune, provjeri da su serijske oznake i
        godine ispravno postavljene kako ne bi nastala praznina u numeraciji koja zbunjuje
        klijente. Za vezu s fiskalizacijom 2.0 vidi{' '}
        <Link href={vodiciHref('fiskalizacija-20')}>fiskalizacija 2.0</Link>.
      </p>

      <h2 id='kpr'>KPR za nepotpunu godinu</h2>
      <p>
        KPR bilježi isključivo <strong>naplaćene</strong> primitke. Sezona znači da ćeš u
        ljetnim mjesecima imati gust unos, a u zimskim pauzu — to je u redu ako zaista
        nema naplate. Ako izdaješ račun s odgođenom naplatom, i dalje vrijedi pravilo da
        KPR prati stvarno stanje plaćanja prema uobičajenoj praksi paušalnog obrta. Za
        detalje strukture knjige vidi{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR vodič</Link>.
      </p>

      <h2 id='po-sd'>PO-SD i sezonalnost</h2>
      <p>
        Na kraju godine zbrajaš što je stvarno naplaćeno kroz sve mjesece, bez obzira na
        to jesi li “osjećao” sezonu kao jednaku cijelu godinu. PO-SD do{' '}
        <strong>15. siječnja</strong> prenosi te zbrojeve u obrazac koji Porezna koristi
        za kontrolu poreza. Ako planiraš mirovanje preko granice godine, dogovori s
        savjetnikom kako to utječe na zadnji KPR i prvu godinu bez prometa.
      </p>

      <h2 id='turizam'>Turistička djelatnost</h2>
      <p>
        Ugostitelji i prateće djelatnosti često brzo priđu limitu od{' '}
        <strong>60.000 €</strong> godišnjih primitaka — prag za ulazak u sustav PDV-a i
        često signal za promjenu paušalnog okvira (uz ostale uvjete). Zato sezonski rad nije samo
        pitanje ljeta na otoku, nego i poreznog plana: ako rasteš, pripremaš prijelaz u
        drugi režim ili d.o.o. — vidi{' '}
        <Link href={vodiciHref('pausalni-obrt-za-ugostitelje')}>ugostiteljski vodič</Link>{' '}
        i <Link href={vodiciHref('pausalni-obrt-vs-doo')}>usporedbu s d.o.o.</Link>.
      </p>
      <p>
        Turistička članarina (TZ1) ulazi u godišnji plan jer se osnovica u paušalnom obrtu
        veže na ukupan primitak kad postoji barem jedan račun
        koji podliježe obvezi. Sezonski obrt često znači da si “šutio” cijelu zimu, pa u
        lipnju kreneš s prvim računima — i tada TZ1 logika i dalje gleda godinu kao
        cjelinu. Zato je pametno već u ožujku imati predložak tablice primitaka po
        mjesecima kako ne bi u siječnju ručno rekonstruirao ljeto iz bankovnih izvoda.
      </p>
      <p>
        Još jedan praktičan kut su zaposlenici na sezonu: ako zapošljavaš studente ili
        honorare, to više nije “solo paušal” u smislu poslovnice — pojavljuju se novi
        obrasci i odgovornosti. Prije nego što proširiš šalter, razgovaraj s računovođom
        hoćeš li zadržati paušal ili prijeći na knjige / d.o.o., jer sezona sama po sebi
        neće pričekati poreznu analizu u rujnu.
      </p>
      <p>
        Za svakodnevni rad izvan sezone koristi{' '}
        <Link href='/alati/rok-podsjetnici'>rok podsjetnike</Link> i aplikaciju{' '}
        <Link href='/register'>Kvik</Link> kako ne bi propustio prvi račun kad sezona krene.
      </p>
    </GuideShell>
  );
}

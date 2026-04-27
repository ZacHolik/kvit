import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'pausalni-obrt-za-kozmeticare';

const META_DESC =
  'Kozmetičari i beauty terapeuti: kako otvoriti paušalni obrt, koje su obveze i kako voditi poslovanje.';

export const metadata: Metadata = {
  title: 'Paušalni obrt za kozmetičare',
  description: META_DESC,
  openGraph: {
    title: 'Paušalni obrt za kozmetičare | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Može li kozmetičar otvoriti paušalni obrt?',
    answer:
      'U mnogim slučajevima da, ako djelatnost i stručni uvjeti odgovaraju obrtnom modelu i paušalnom režimu. Prije otvaranja provjeri je li tvoja šifra djelatnosti dopuštena i treba li dodatna licenca ili komora.',
  },
  {
    question: 'Koje šifre djelatnosti koristiti?',
    answer:
      'Odabir ovisi o tome radiš li frizerske, kozmetičke ili wellness usluge. U praksi se koriste NKD šifre koje najbolje opisuju glavni prihod — točan odabir dogovori s obrtnom komorom ili savjetnikom jer utječe na doprinose i nadzor.',
  },
  {
    question: 'Moram li fiskalizirati račune?',
    answer:
      'Za naplatu fizičkim osobama u krajnjoj potrošnji često da, sukladno fiskalizaciji 2.0 od 2026. Gotovinske uplate klijenata salonu tipično padaju u tu skupinu — ne zanemari tehničku pripremu.',
  },
  {
    question: 'Što je turistička članarina i moram li je plaćati?',
    answer:
      'Turistička članarina može se odnositi na određene djelatnosti u turističkim područjima. Ako pružaš usluge koje podliježu propisu, obračun je dodatna obveza uz redovite doprinose — provjeri lokalna pravila.',
  },
  {
    question: 'Mogu li mirovati obrt van sezone?',
    answer:
      'Postoje mehanizmi pauze obrta ovisno o situaciji, ali doprinosi i ostale obveze često ne staju automatski. Prije mirovanja provjeri u komori i kod savjetnika kako to utječe na paušalni model.',
  },
];

export default function PauzalniObrtZaKozmeticarePage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Paušalni obrt za kozmetičare – vodič 2026.'
      subtitle='Salon, najam stola ili vlastiti prostor — kako ostati usklađen s računima i doprinosima.'
      readingMinutes={11}
      metaDescription={META_DESC}
      toc={[
        { id: 'moze-pausal', label: 'Može li kozmetičar biti paušalist' },
        { id: 'sifre', label: 'Koje su šifre djelatnosti za kozmetiku' },
        { id: 'turisticka', label: 'Turistička članarina za kozmetičare' },
        { id: 'salon-prostor', label: 'Rad u salonu vs vlastiti prostor' },
        { id: 'fiskal-gotovina', label: 'Fiskalizacija za gotovinu (obvezna!)' },
        { id: 'sezona', label: 'Sezonski rad i mirovanje obrta' },
        { id: 'doprinosi-porez', label: 'Doprinosi i porez' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('fiskalizacija-20'), title: 'Fiskalizacija 2.0 za paušaliste' },
        { href: vodiciHref('doprinosi'), title: 'Doprinosi za paušalni obrt' },
        { href: vodiciHref('otvaranje-obrta'), title: 'Kako otvoriti paušalni obrt' },
        { href: vodiciHref('izdavanje-racuna'), title: 'Izdavanje računa u paušalu' },
      ]}
      howTo={{
        name: 'Dnevni red kozmetičara na paušalnom obrtu',
        description:
          'Kako poslovanje u salonu ostane čisto za Poreznu i za tebe.',
        steps: [
          {
            name: 'Izdaj račun odmah nakon usluge',
            text: 'Za gotovinu pokreni fiskalni korak ako je potreban i daj kupcu potvrdu.',
          },
          {
            name: 'Upiši primitak u KPR',
            text: 'Na kraju smjene unesi sve račune kako sezona ne bi nagomilala greške.',
          },
          {
            name: 'Provjeri članarine i najam',
            text: 'Odvojene stavke najma stola i članarine prati kao trošak poslovanja izvan paušala gdje je primjenjivo.',
          },
          {
            name: 'Mjesečno zatvori doprinose',
            text: 'Do 15. u mjesecu završi uplate ako si u standardnom ciklusu.',
          },
        ],
      }}
    >
      <p>
        <strong>Paušalni obrt za kozmetičare</strong> popularan je izbor jer
        omogućuje jednostavnije vođenje poslovanja uz predvidljive mjesečne
        obveze prema državi. Bilo da radiš manikuru, tretmane lica, masaže ili
        kombinirane beauty usluge, klijenti često plaćaju gotovinom — što znači
        da moraš znati pravila <Link href={vodiciHref('fiskalizacija-20')}>fiskalizacije</Link>,{' '}
        <Link href={vodiciHref('izdavanje-racuna')}>izdavanja računa</Link> i{' '}
        <Link href={vodiciHref('doprinosi')}>doprinosa</Link>. Ovaj vodič
        povezuje tipične situacije salona s obrtnim okvirom u Hrvatskoj 2026.
      </p>

      <h2 id='moze-pausal'>Može li kozmetičar biti paušalist</h2>
      <p>
        Većina kozmetičkih usluga spada u obrtničke djelatnosti koje mogu ići u
        paušalni režim ako su ispunjeni uvjeti stručnosti i registracije. Ako imaš
        diplome ili potvrde o osposobljenosti, one idu uz prijavu u obrtni
        registar. Bitno je da glavni prihod dolazi iz usluga koje su dozvoljene
        u paušalu — izuzete kategorije treba izbjegavati još prije otvaranja.
      </p>
      <p>
        Ako si zaposlena u salonu i razmišljaš o vlastitom obrtu, provjeri
        postoji li klauzula o konkurenciji u ugovoru o radu. Paušalni obrt nije
        zamjena za radni odnos prema istom poslodavcu bez jasnog prelaska u
        suradnju obrta i tvrtke.
      </p>

      <h2 id='sifre'>Koje su šifre djelatnosti za kozmetiku</h2>
      <p>
        Šifre NKD-a trebaju odražavati glavnu djelatnost: npr. frizerske i
        srodne usluge, ostale osobne usluge ili specijalizirane wellness
        kategorije, ovisno o tome što naplaćuješ. Kriva šifra može otežati
        promjene kasnije ili dovesti do pitanja komore. Pri otvaranju koristi
        vodič <Link href={vodiciHref('otvaranje-obrta')}>kako otvoriti paušalni obrt</Link>{' '}
        kao kontrolnu listu dokumenata.
      </p>
      <p>
        Ako kombiniraš maloprodaju kozmetike uz usluge, provjeri smije li se
        prodaja uklopiti u isti obrt ili treba drugačiji model — paušalni obrt
        za kozmetičare najčešće je čist uslužni profil bez velikog lagera robe.
      </p>

      <h2 id='turisticka'>Turistička članarina za kozmetičare</h2>
      <p>
        U turističkim sredinama članarina se pojavljuje kao dodatak ako su
        ispunjeni uvjeti propisa. To nije isto što i obrtnička naknada —
        obračun i rokovi idu prema lokalnim pravilima. Ako radiš sezonski uz
        more, uključi tu stavku u poslovni plan prije ljeta kad je promet
        najjači.
      </p>
      <p>
        Nepoznavanje članarine ne oslobađa obveze, a inspekcije u sezoni česte
        su. Zato dobro dokumentiraj lokaciju pružanja usluge i vrstu djelatnosti
        na računima.
      </p>

      <h2 id='salon-prostor'>Rad u salonu vs vlastiti prostor</h2>
      <p>
        Najam stola u tuđem salonu često znači podugovor s vlasnikom salona i
        jasnu podjelu tko izdaje račun kupcu. Ako ti izdaješ račun za vlastitu
        uslugu, tvoj je KPR i tvoja fiskalizacija. Ako sve ide preko salona,
        provjeri jesi li uopće u obrtu ili u drugom obliku suradnje — tu su
        česti sporovi oko prikrivenog rada.
      </p>
      <p>
        Vlastiti mini-salon donosi troškove najma, utilities i opreme, ali i
        punu kontrolu nad brendom. U oba slučaja <strong>paušalni obrt za kozmetičare</strong>{' '}
        zahtijeva redovito izdavanje računa i evidenciju primitaka bez obzira
        što je paušalni porez fiksiran kroz razrede.
      </p>

      <h2 id='fiskal-gotovina'>Fiskalizacija za gotovinu (obvezna!)</h2>
      <p>
        Gotovina je srž beauty poslovanja. Od 2026. transakijski računi u B2C
        često moraju proći kroz fiskalizaciju 2.0. To znači program koji šalje
        podatke Poreznoj, JIR/ZKI gdje je primjenjivo, i arhivu. Nemoj se
        oslanjati na ručno pisane blokove bez digitalnog traga ako zakon
        zahtijeva više — kazne i prekid rada skuplji su od pretplate na alat.
      </p>
      <p>
        Ako uz gotovinu primaš i kartice, svaki kanal treba završiti istom
        logikom evidencije. <Link href='/register'>Kvik</Link> i slični alati
        pomažu da se brojevi računa ne preklapaju i da KPR ostane čitljiv
        inspektoru.
      </p>

      <h2 id='sezona'>Sezonski rad i mirovanje obrta</h2>
      <p>
        Mnogi saloni žive od ljeta ili blagdana. Sezonski raskorak između
        prihoda i stalnih obveza bolje podnosiš ako unaprijed znaš što se
        događa s doprinosima tijekom pauze obrta. Mirovanje ima formalne korake
        — ne pretpostavljaj da prestankom rada nestaju sve obveze.
      </p>
      <p>
        Planiraj cashflow: tijekom špice odvoji dio za uplate u mirnijim
        mjesecima. To čini <strong>paušalni obrt za kozmetičare</strong>
        održivim i kad broj termina padne.
      </p>

      <h2 id='doprinosi-porez'>Doprinosi i porez</h2>
      <p>
        Doprinosi za mirovinsko i zdravstveno idu redovito dok si aktivan
        obrtnik, uz kvartalni paušalni porez. Iznosi prate opća pravila — vidi
        aktualne brojke u vodiču o doprinosima. PO-SD na kraju godine zbraja
        primitke; ako KPR nije vođen, PO-SD postaje noćna mora.
      </p>
      <p>
        Za kraj: kombiniraj ovaj vodič s <Link href={vodiciHref('pausalni-obrt-vodic')}>općim vodičem o paušalnom obrtu</Link>{' '}
        i ostani u toku s promjenama fiskalizacije — kozmetički segment jako je
        vidljiv Poreznoj upravo zbog gotovine.
      </p>
    </GuideShell>
  );
}

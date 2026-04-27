import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'doprinosi';

const META_DESC =
  'Doprinosi paušalni obrt iznos 2026.: mirovinsko 1. i 2. stup, zdravstveno, ukupno 290,98 €, rok do 15. u mjesecu, IBAN i posljedice kašnjenja.';

export const metadata: Metadata = {
  title: 'Doprinosi paušalni obrt iznos',
  description: META_DESC,
  openGraph: {
    title: 'Doprinosi paušalni obrt iznos | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Koliko iznose doprinosi za paušalni obrt u 2026.?',
    answer:
      'Za tipičan model jedine djelatnosti često se navodi ukupno 290,98 € mjesečno: mirovinsko 1. stup 119,58 €, 2. stup 39,86 € i zdravstveno 131,54 €. Iznosi se mogu mijenjati odlukama — provjeri aktualnu tablicu na dan uplate.',
  },
  {
    question: 'Do kada se plaćaju doprinosi?',
    answer:
      'Uobičajeni rok je do 15. u mjesecu za prethodni mjesec kada si u standardnom režimu jedine djelatnosti. Ako si zaposlen kod drugog poslodavca, primjenjuju se drugačija pravila i godišnji obračun prema rješenju.',
  },
  {
    question: 'Na koji račun se plaćaju doprinosi?',
    answer:
      'Svaka vrsta doprinosa ima propisani model, poziv na broj i IBAN koji Porezna objavljuje. Krivi podaci mogu usporiti knjiženje uplate — koristi službene upute ili generator uplatnica iz pouzdanog alata.',
  },
  {
    question: 'Što ako kasnim s plaćanjem doprinosa?',
    answer:
      'Kašnjenje može donijeti kamate i administrativne probleme. Najbolje odmah platiti i zatražiti pojašnjenje ako postoji spor oko datuma primitka. Redoviti podsjetnici smanjuju rizik.',
  },
  {
    question: 'Moram li plaćati doprinose ako nisam imao prihoda?',
    answer:
      'U mnogim situacijama da — doprinosi za obrt često su obvezni dok si registriran, neovisno o tome jesi li naplatio račun. Potvrdi iznimke za svoj slučaj (npr. pauze, zaposlenje) kod savjetnika.',
  },
];

export default function DoprinosiPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Doprinosi za paušalni obrt 2026. – iznosi i rokovi'
      subtitle='Mirovinsko, zdravstveno, rokovi i praktični savjeti da ne zaboraviš uplatiti.'
      readingMinutes={10}
      metaDescription={META_DESC}
      toc={[
        { id: 'vrste', label: 'Vrste doprinosa' },
        { id: 'iznosi', label: 'Iznosi za 2026.' },
        { id: 'rokovi', label: 'Rokovi plaćanja' },
        { id: 'uplatnice', label: 'Uplatnice i IBAN' },
        { id: 'kasnjenje', label: 'Što ako kasniš' },
        { id: 'zaposlenje', label: 'Razlika ako si zaposlen' },
        { id: 'planiranje', label: 'Planiranje cashflowa' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('po-sd-obrazac'), title: 'PO-SD obrazac' },
        { href: vodiciHref('pausalni-obrt-vodic'), title: 'Paušalni obrt 2026.' },
        { href: vodiciHref('pausalni-obrt-za-it-freelancere'), title: 'Paušalni obrt za IT freelancere' },
        { href: vodiciHref('prikriveni-radni-odnos'), title: 'Prikriveni radni odnos' },
        { href: vodiciHref('otvaranje-obrta'), title: 'Otvaranje obrta' },
      ]}
      howTo={{
        name: 'Plaćanje doprinosa kao paušalist',
        description:
          'Jednostavan tijek mjesečne uplate doprinosa za obrt s jednom djelatnošću.',
        steps: [
          {
            name: 'Provjeri aktualne iznose',
            text: 'Uskladi se s najnovijom tablicom HZZO-a i mirovinskih stupova za svoj mjesec.',
          },
          {
            name: 'Pripremi tri uplate ili združeni način ako je dopušten',
            text: 'Koristi točne modele i pozive na broj za svaki doprinos.',
          },
          {
            name: 'Uplati do 15. za prethodni mjesec',
            text: 'Pošalji nalog iz bankarstva i spremi potvrdu.',
          },
          {
            name: 'Arhiviraj dokaz o uplati',
            text: 'Spremi PDF izvoda i poveži s mjesecnim kontrolnim listom obrta.',
          },
        ],
      }}
    >
      <p>
        Razumijevanje pojma <strong>doprinosi paušalni obrt iznos</strong> ključno je da
        mjesečni rashod ne bude iznenađenje. U ovom vodiču sabiremo vrste doprinosa,
        tipične iznose za 2026., rokove i vezu s ostalim obvezama poput{' '}
        <Link href={vodiciHref('po-sd-obrazac')}>PO-SD obrasca</Link> i{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR-a</Link>. Iako su brojke
        stabilne unutar godine, službeni izvori ipak imaju posljednju riječ.
      </p>

      <h2 id='vrste'>Vrste doprinosa</h2>
      <p>
        Paušalisti najčešće plaćaju doprinose za mirovinsko osiguranje na prvi i drugi
        stup te doprinose za obvezno zdravstveno osiguranje. Svaka stavka ima svoju
        osnovicu i stopu koja proizlazi iz propisa. Kada uz obrt imaš i zaposlenje,
        presjek pravila je složeniji — država želi izbjeći dvostruko ili premalo
        osiguranje.
      </p>

      <h2 id='iznosi'>Iznosi za 2026.</h2>
      <p>
        U materijalima koji kruže zajednicom paušalista često se za jednu djelatnost
        navodi ukupno <strong>290,98 €</strong> mjesečno, od čega je{' '}
        <strong>119,58 €</strong> na prvi stup, <strong>39,86 €</strong> na drugi stup
        mirovinskog te <strong>131,54 €</strong> zdravstveno. To su iznosi koje ljudi
        stvarno vide na uplatnicama u tipičnom scenariju — ipak, prije svake uplate
        provjeri ima li korekcije u službenim obavijestima.
      </p>
      <p>
        Tablični prikaz olakšava planiranje cashflowa: ako znaš da svakog 12. u mjesecu
        ide renta, a dopinosi do 15., možeš si složiti jednostavan kalendar. Alati poput
        Kvika mogu poslati podsjetnik prije roka.
      </p>

      <h2 id='rokovi'>Rokovi plaćanja</h2>
      <p>
        Standard je <strong>do 15. u mjesecu za prethodni mjesec</strong> kada posluješ
        kao paušalist s jednom djelatnošću bez posebnih iznimki. Rok &quot;do 15.&quot;
        znači da moraš paziti na vikende i praznike: nekada je zadnji dan raniji. Ako
        uplaćuješ iz inozemstva, uračunaj vrijeme kliringa.
      </p>

      <h2 id='uplatnice'>Uplatnice i IBAN</h2>
      <p>
        Svaka uplatnica traži točan IBAN primatelja, model, poziv na broj i opis. Pogrešan
        model često znači da sredstva &quot;vise&quot; dok ih ručno ne prebaceš. Zato
        većina modernih obrta koristi predpopunjene naloge iz aplikacije — npr.{' '}
        <Link href='/alati/placanje-doprinosa'>Plaćanje doprinosa</Link> u Kviku. Za
        porezni kontekst usporedi i{' '}
        <Link href={vodiciHref('pausalni-obrt-vodic')}>paušalni obrt 2026.</Link>
      </p>

      <h2 id='kasnjenje'>Što ako kasniš</h2>
      <p>
        Kamate i slova Porezne nisu teoretski rizik — događaju se. Ako si zaboravio,
        uplati čim prije, spremi dokaz i eventualno se javi s objašnjenjem. Ponavljajuće
        kašnjenje privlači pažnju inspekcije. Bolja navika: automatski podsjetnik i
        rezervirani iznos na transakcijskom računu obrta.
      </p>

      <h2 id='zaposlenje'>Razlika ako si zaposlen</h2>
      <p>
        Kad si zaposlen kod drugog poslodavca, dio doprinosa već ide kroz plaću. Obrt
        tada često prelazi na godišnji obračun prema rješenju Porezne. To nije isto što
        i mjesečna tri uplate — zato ne kopiraj savjete kolega bez provjere njihovog
        statusa. U takvim slučajevima individualni savjet štedi novac.
      </p>

      <h2 id='planiranje'>Planiranje cashflowa</h2>
      <p>
        Doprinosi su fiksni trošak koji ne smiješ tretirati kao &quot;ostalo ću platiti
        kad stigne veća uplata&quot;. Bolja praksa je da prvog dana u mjesecu prebaciš
        290,98 € (ili aktualni iznos) na poseban podračun ili označiš ih u proračunu
        obrta. Tako izbjegavaš situaciju u kojoj si potrošio novac koji zapravo pripada
        doprinosima. Mnogi obrtnici paralelno vode i tablicu rokova: doprinosi 15. u
        mjesecu, porez kvartalno, PO-SD u siječnju — jedan pogled na kalendar i znaš
        cijelu godinu unaprijed.
      </p>
      <p>
        Ako primaš veće projekte s odgođenom naplatom, dogovori avans ili milestone
        uplate kako bi prije roka doprinosa imao likvidnost. Likvidnost nije samo
        problem velikih tvrtki: paušalisti koji zaborave doprinos često padnu na
        kamatama koje su skuplje od bilo kojeg kratkoročnog kredita. Zato integracija
        podsjetnika u poslovni alat nije luksuz nego osiguranje da ostaneš u
        zelenom području s Poreznom.
      </p>
      <p>
        Za početak poslovanja pročitaj{' '}
        <Link href={vodiciHref('otvaranje-obrta')}>kako otvoriti paušalni obrt</Link>, a
        za račune i primitke koji utječu na razrede poreza vidi{' '}
        <Link href={vodiciHref('izdavanje-racuna')}>izdavanje računa</Link>. U aplikaciji
        otvori <Link href='/asistent'>AI asistenta</Link> za brza pitanja o Kviku.
      </p>
    </GuideShell>
  );
}

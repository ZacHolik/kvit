import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'pausalni-obrt-vodic';

const META_DESC =
  'Paušalni obrt 2026: što je, tko može otvoriti, limit 60.000 €, KPR, PO-SD, doprinosi i fiskalizacija. Kompletan vodič za hrvatske paušaliste.';

export const metadata: Metadata = {
  title: 'Paušalni obrt 2026',
  description: META_DESC,
  openGraph: {
    title: 'Paušalni obrt 2026 | Kvit',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvit',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Koliki je limit primitaka za paušalni obrt?',
    answer:
      'Prag za ulazak u sustav PDV-a za paušalne obrtnike iznosi 60.000 € godišnjih primitaka. Ako ga prekoračiš, moraš se prijaviti kao obveznik PDV-a i mijenja se način obračuna poreza. Pratiti ukupne primitke ključno je kroz godinu — KPR i alati poput Kvita pomažu da uvijek vidiš gdje si.',
  },
  {
    question: 'Moram li voditi KPR ako sam paušalist?',
    answer:
      'Da. Knjiga prometa računa (KPR) obvezna je za paušalne obrtnike. U nju se upisuju naplaćeni računi (gotovina i bezgotovina). Podaci iz KPR-a služe i za godišnji PO-SD obrazac. Više u vodiču o KPR-u.',
  },
  {
    question: 'Što se dogodi ako prijeđem limit od 60.000 €?',
    answer:
      'Prelaskom praga od 60.000 € primitaka u kalendarskoj godini postaješ obveznik PDV-a prema propisima. To znači obvezu izdavanja računa s PDV-om (gdje je primjenjivo), drugačije izvještavanje i često složenije vođenje poslovanja. Zato je važno pravovremeno pratiti primitke.',
  },
  {
    question: 'Mogu li imati paušalni obrt uz zaposlenje?',
    answer:
      'U mnogim situacijama da, ali pravila o doprinosima i porezu ovise o tome jesi li već pokriven kao zaposlena osoba. Ako si zaposlen kod drugog poslodavca, doprinosi za obrt često se plaćaju drugačije (npr. godišnje prema rješenju). Provjeri individualno stanje kod poreznog savjetnika ili Porezne uprave.',
  },
  {
    question: 'Koliko košta otvaranje paušalnog obrta?',
    answer:
      'Postupak preko e-Obrtnice može biti besplatnog karaktera za osnivanje same obrtničke obrade (troškovi komore i slično mogu varirati). Detalje imaš u vodiču o otvaranju obrta.',
  },
];

export default function PauzalniObrtVodicPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Paušalni obrt 2026. – kompletan vodič'
      subtitle='Što znači biti paušalist u Hrvatskoj, koje su prednosti i što moraš redovito raditi.'
      readingMinutes={14}
      metaDescription={META_DESC}
      toc={[
        { id: 'sto-je', label: 'Što je paušalni obrt?' },
        { id: 'prednosti', label: 'Prednosti i ograničenja' },
        { id: 'tko-moze', label: 'Tko može otvoriti paušalni obrt?' },
        { id: 'limit', label: 'Godišnji limit 60.000 €' },
        { id: 'obveze', label: 'Obveze: KPR, PO-SD, doprinosi, fiskalizacija' },
        { id: 'usporedba', label: 'Paušalni obrt i d.o.o.' },
        { id: 'kada-prestati', label: 'Kada prestati biti paušalist?' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('otvaranje-obrta'), title: 'Kako otvoriti paušalni obrt' },
        { href: vodiciHref('fiskalizacija-20'), title: 'Fiskalizacija 2.0 za paušaliste' },
        { href: vodiciHref('po-sd-obrazac'), title: 'PO-SD obrazac – kako ispuniti' },
      ]}
      howTo={{
        name: 'Redovite obveze paušalnog obrta',
        description:
          'Pregled koraka koje paušalist treba ponavljati kroz godinu da ostane usklađen.',
        steps: [
          {
            name: 'Izdaj račun za svaki primitak',
            text: 'Za svaku naplatu izdaj račun s obveznim podacima i prati format broja (npr. 1-2026).',
          },
          {
            name: 'Upiši primitak u KPR',
            text: 'Na kraju dana ili najkasnije u roku koji si zadao unesi račun u knjigu prometa (gotovina / bezgotovina).',
          },
          {
            name: 'Plaćaj doprinose do 15. u mjesecu',
            text: 'Za prethodni mjesec uplate propisane doprinose na odgovarajuće račune.',
          },
          {
            name: 'Plaćaj paušalni porez kvartalno',
            text: 'Prema razredu primitaka uplate porez na dohodak do rokova 31.3., 30.6., 30.9. i 31.12.',
          },
          {
            name: 'Predaj PO-SD do 15. siječnja',
            text: 'Za prethodnu godinu prijavi primitke i uplaćeni porez putem ePorezne ili na drugi propisani način.',
          },
        ],
      }}
    >
      <p>
        <strong>Paušalni obrt 2026.</strong> i dalje je jedan od najjednostavnijih
        načina legalnog poslovanja u Hrvatskoj za mnoge obrtnike i slobodna zanimanja
        koja ne spadaju u izuzete kategorije. U ovom vodiču sažeto prolazimo što
        paušalni obrt zapravo znači, koje su prednosti, tko ga može otvoriti i koje
        obveze ne smiju ispasti iz vida — uključujući vezu s{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR knjigom prometa</Link>,{' '}
        <Link href={vodiciHref('po-sd-obrazac')}>PO-SD obrascem</Link> i{' '}
        <Link href={vodiciHref('doprinosi')}>doprinosima</Link>.
      </p>

      <h2 id='sto-je'>Što je paušalni obrt?</h2>
      <p>
        Paušalni obrt nije poseban pravni oblik nego način oporezivanja i vođenja
        evidencija za klasičan obrt. Umjesto detaljnog knjigovodstva i obračuna
        dohotka po stvarnim prihodima i rashodima, država pretpostavlja
        &quot;paušalni&quot; dohodak i propisuje fiksne ili razredne iznose poreza
        na dohodak te jasna pravila za doprinose. Zato mnogi početnici biraju ovaj
        model: manje administracije, predvidljiviji mjesečni i kvartalni troškovi.
      </p>
      <p>
        Bitno je znati da i dalje moraš izdavati račune za primitke, voditi KPR i
        godišnje izvještavati primitke — samo se ne radi puni poslovni knjigovodstveni
        obrt kao kod većih tvrtki. Ako želiš digitalno olakšanje, aplikacija{' '}
        <Link href='/register'>Kvit</Link> spaja izdavanje računa, KPR i pripremu
        podataka za PO-SD na jednom mjestu.
      </p>

      <h2 id='prednosti'>Prednosti i ograničenja</h2>
      <p>
        Glavne prednosti su jednostavnost, niži administrativni teret u usporedbi s
        punim knjigovodstvom i često niži ukupni fiskalni tlak za male primitke.
        Paušalni model privlači freelancere, manje servise, kreativce i obrtnike koji
        ne žele zapošljavati velik tim ili ulaziti u složene PDV strukture dok su mali.
      </p>
      <p>
        Ograničenja uključuju gornju granicu primitaka (60.000 € za PDV), zabrane
        određenih djelatnosti (npr. slobodna zanimanja koja ne mogu kroz paušal prema
        zakonu) i manje fleksibilnosti kad posao jako naraste — tada je često
        racionalnije prijeći na drugi oblik. Također, od 2026. pausalisti su u
        fokusu <Link href={vodiciHref('fiskalizacija-20')}>fiskalizacije 2.0</Link>{' '}
        za transakcijske račune i zaprimanje eRačuna, što treba ugraditi u svakodnevni
        rad.
      </p>

      <h2 id='tko-moze'>Tko može otvoriti paušalni obrt?</h2>
      <p>
        Obrt može otvoriti osoba koja ispunjava opće uvjete (sposobnost, registar
        obrta, odabrana djelatnost koja nije izuzeta). Paušalni režim nije za sve
        djelatnosti: neka slobodna zanimanja i specifični obrti padaju izvan modela.
        Prije odluke provjeri je li tvoja šifra djelatnosti kompatibilna s paušalom i
        postoje li dodatne obveze (npr. turistička članarina za neke djelatnosti).
      </p>
      <p>
        Postupak registracije danas je uglavnom digitalan — vodič{' '}
        <Link href={vodiciHref('otvaranje-obrta')}>kako otvoriti paušalni obrt</Link>{' '}
        prolazi korake od e-Obrtnice do prvog računa.
      </p>

      <h2 id='limit'>Godišnji limit 60.000 €</h2>
      <p>
        Limit od 60.000 € godišnjih primitaka nije &quot;kazna&quot; nego prag za
        obvezni ulazak u PDV. Dok si ispod praga, ne obračunavaš PDV na računima kao
        tipičan obveznik (uz uobičajenu napomenu da nisi u sustavu PDV-a). Prelaskom
        praga mijenjaju se obveze prema zakonu — zato kontinuirano praćenje ukupnih
        primitaka kroz KPR nije luksuz nego nužnost.
      </p>
      <p>
        Ako se približavaš limitu, planiraj: dogovor s računovođom ili korištenje
        alata koji upozorava na trend primitaka. <strong>Paušalni obrt 2026.</strong>{' '}
        u praksi znači disciplina u evidenciji jednako kao i u samom radu.
      </p>

      <h2 id='obveze'>Obveze: KPR, PO-SD, doprinosi, fiskalizacija</h2>
      <p>
        Četiri stupa koje gotovo svaki paušalist dodiruje su:{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR</Link> (dnevno ili redovito
        ažuriranje), <Link href={vodiciHref('doprinosi')}>doprinosi</Link> (mjesečno,
        do 15. za prethodni mjesec kod tipičnog modela jedine djelatnosti), paušalni
        porez na dohodak (kvartalno) i{' '}
        <Link href={vodiciHref('fiskalizacija-20')}>fiskalizacija / eRačuni</Link>{' '}
        prema rokovima koji te se tiču. Na kraju godine dolazi{' '}
        <Link href={vodiciHref('po-sd-obrazac')}>PO-SD</Link> — izvještaj o
        primitcima i uplaćenom porezu, s rokom predaje do 15. siječnja.
      </p>
      <p>
        Izdavanje računa mora biti u skladu s propisima: obvezni elementi, ispravan
        broj (npr. format <Link href={vodiciHref('izdavanje-racuna')}>1-2026</Link>),
        IBAN ako ga koristiš, te napomena o neobračunatom PDV-u kada si izvan sustava.
        Račune treba čuvati godinama u skladu s propisima o arhiviranju.
      </p>

      <h2 id='usporedba'>Paušalni obrt i d.o.o.</h2>
      <p>
        Dok je obrt izravno vezan uz osobu obrtnika, d.o.o. je kapitalska društvo s
        drugačijim troškovima osnivanja, knjigovodstvom i odgovornošću. Paušalni obrt
        je često jeftiniji za start, ali d.o.o. može biti privlačniji kad rasteš,
        zapošljavaš ili želiš ograničiti osobnu odgovornost. Odluka ovisi o primitcima,
        planu širenja i savjetu stručnjaka — ovaj vodič ne zamjenjuje individualni
        savjet.
      </p>

      <h2 id='kada-prestati'>Kada prestati biti paušalist?</h2>
      <p>
        Promjena modela (prelazak u PDV, veći primitci, drugačiji oblik poslovanja)
        često zahtijeva izlazak iz paušalnog režima ili zatvaranje obrta. Također,
        ako djelatnost više ne ispunjava uvjete ili želiš preći u zaposlenje kao
        primarni izvor prihoda, treba planirati formalne korake kod Porezne i obrtnog
        registra. Svaka promjena ima porezne i kadrovsko-pravne posljedice — pripremi
        ih unaprijed.
      </p>
      <p>
        Za praktičan rad od računa do KPR-a i PO-SD-a isprobaj{' '}
        <Link href='/register'>Kvit besplatno</Link>, a dodatna pitanja možeš postaviti
        i <Link href='/asistent'>AI asistentu u aplikaciji</Link>.
      </p>
    </GuideShell>
  );
}

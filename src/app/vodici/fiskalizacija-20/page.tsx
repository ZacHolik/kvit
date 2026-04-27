import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'fiskalizacija-20';

const META_DESC =
  'Fiskalizacija 2.0 paušalisti: transakcijski računi, eRačuni, rokovi 2026. i 2027., informacijski posrednik i kako se pripremiti bez stresa.';

export const metadata: Metadata = {
  title: 'Fiskalizacija 2.0 paušalisti',
  description: META_DESC,
  openGraph: {
    title: 'Fiskalizacija 2.0 paušalisti | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Moram li kao paušalist imati fiskalizaciju 2.0?',
    answer:
      'Ako izdaješ transakcijske račune u krajnjoj potrošnji (B2C), od 1.1.2026. takvi računi podliježu fiskalizaciji. Za B2B eRačune obveza izdavanja za paušaliste dolazi od 1.1.2027. Zaprimanje eRačuna od drugih subjekata također je dio obveza koje treba pokriti.',
  },
  {
    question: 'Što je informacijski posrednik?',
    answer:
      'Informacijski posrednik je posrednik koji tehnički povezuje tvoj sustav izdavanja računa s Poreznom upravom i sustavom eRačuna. Bez pouzdane veze ne možeš ispunjavati obveze fiskalizacije i eRačuna u skladu s propisima.',
  },
  {
    question: 'Kako poslati eRačun firmi?',
    answer:
      'eRačun firmi šalje se kroz certificirane sustave i propisane formate. U praksi to radiš kroz program za račune koji je povezan s informacijskim posrednikom ili državnim servisima. Ručno slanje PDF-a mailom nije isto što i formalni eRačun.',
  },
  {
    question: 'Što je razlika između fiskalnog računa i eRačuna?',
    answer:
      'Fiskalni račun potvrđuje Poreznoj promet u trenutku izdavanja (JIR, ZKI i sl.). eRačun je strukturirana elektronička faktura u sustavu koji omogućuje automatizirani prijenos podataka između poslovnih subjekata. Jedan račun može biti i fiskaliziran i poslan kao eRačun kada to situacija zahtijeva.',
  },
  {
    question: 'Koliko košta informacijski posrednik?',
    answer:
      'Cijene ovise o pružatelju usluge i paketu. Neki alati uključuju posrednika u pretplati. Važno je usporediti ukupni trošak s pouzdanošću i podrškom — kašnjenje ili greške skuplje koštaju od razlike u par eura mjesečno.',
  },
];

export default function Fiskalizacija20Page() {
  return (
    <GuideShell
      slug={SLUG}
      title='Fiskalizacija 2.0 za paušaliste – vodič 2026.'
      subtitle='Promjene za transakcijske račune i eRačune: što te čeka i kako ostati miran.'
      readingMinutes={12}
      metaDescription={META_DESC}
      toc={[
        { id: 'sto-je', label: 'Što je Fiskalizacija 2.0?' },
        { id: 'f1-f2', label: 'Razlika između F1 i F2' },
        { id: 'tko-kada', label: 'Tko mora što i kada?' },
        { id: 'eracuni', label: 'eRačuni i zaprimanje' },
        { id: 'posrednik', label: 'Informacijski posrednik' },
        { id: 'priprema', label: 'Kako se pripremiti' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('fina-certifikat-fiskalizacija'), title: 'FINA certifikat za fiskalizaciju' },
        { href: vodiciHref('izdavanje-racuna'), title: 'Izdavanje računa u paušalu' },
        { href: vodiciHref('pausalni-obrt-za-it-freelancere'), title: 'Paušalni obrt za IT freelancere' },
        { href: vodiciHref('pausalni-obrt-za-kozmeticare'), title: 'Paušalni obrt za kozmetičare' },
        { href: vodiciHref('pausalni-obrt-za-fotografe'), title: 'Paušalni obrt za fotografe' },
        { href: vodiciHref('otvaranje-obrta'), title: 'Kako otvoriti paušalni obrt' },
        { href: vodiciHref('pausalni-obrt-vodic'), title: 'Paušalni obrt 2026.' },
      ]}
      howTo={{
        name: 'Priprema na Fiskalizaciju 2.0 kao paušalist',
        description:
          'Praktični koraci prije nego što počneš izdavati fiskalizirane ili eRačune u novom režimu.',
        steps: [
          {
            name: 'Inventar načina poslovanja',
            text: 'Zapiši izdaješ li račune fizičkim osobama, firmama ili oboje — od toga ovise rokovi i obveze.',
          },
          {
            name: 'Odaberi program i posrednika',
            text: 'Provjeri podržava li tvoj alat fiskalizaciju i eRačune te ima li vezu s informacijskim posrednikom.',
          },
          {
            name: 'Testiraj prije špice',
            text: 'Napravi probne račune u kontroliranom okruženju da vidiš tijek od izdavanja do zapisa.',
          },
          {
            name: 'Obuči sebe ili tim',
            text: 'Dogovori tko unosi podatke, tko šalje eRačune i kako čuvaš potvrde i arhivu.',
          },
        ],
      }}
    >
      <p>
        <strong>Fiskalizacija 2.0 paušalisti</strong> donosi jasnu podjelu: što se
        događa s transakcijskim računima za građane, što s B2B eRačunima i što s
        zaprimanjem računa od drugih. Ovaj vodič povezuje te teme s praksom{' '}
        <Link href={vodiciHref('izdavanje-racuna')}>izdavanja računa</Link> i širim
        kontekstom <Link href={vodiciHref('pausalni-obrt-vodic')}>paušalnog obrta 2026.</Link>
      </p>

      <h2 id='sto-je'>Što je Fiskalizacija 2.0?</h2>
      <p>
        Fiskalizacija 2.0 proširuje digitalni nadzor nad prometom: država želi
        blagovremeno vidjeti transakcije i smanjiti sivi trg. Za obrtnike to znači
        obvezu korištenja rješenja koja su tehnički povezana s Poreznom upravom tamo
        gdje zakon nalaže. Paušalisti nisu izuzeti kad izdaju određene vrste računa
        ili kad moraju zaprimati eRačune od partnera.
      </p>
      <p>
        Ključno je ne miješati pojam &quot;fiskalizacija&quot; s &quot;eRačunom&quot;:
        prvi se odnosi na potvrdu prometa u realnom vremenu, drugi na strukturirani
        elektronički dokument u poslovnom prometu. Oba sustava zahtijevaju pouzdanu
        infrastrukturu — zato većina obrta danas oslanja na softver poput Kvika koji
        te korake pojednostavljuje.
      </p>

      <h2 id='f1-f2'>Razlika između F1 i F2</h2>
      <p>
        Prva faza fiskalizacije fokusirala se uglavnom na fiskalne blagajne i
        klasične maloprodajne tokove. Fiskalizacija 2.0 širi se na širi krug računa,
        uključujući transakijske račune u krajnjoj potrošnji te sustav eRačuna između
        tvrtki i s javnim sektorom. Za paušaliste je važno znati koji se dio odnosi
        upravo na njihov način poslovanja, a ne samo na velike trgovce.
      </p>

      <h2 id='tko-kada'>Tko mora što i kada?</h2>
      <p>
        Prema javno dostupnim sažecima pravila koja se često citiraju u zajednici
        paušalista: od 1.1.2026. paušalni obrt nije obveznik izdavanja eRačuna, ali
        jest obveznik zaprimanja eRačuna od drugih poslovnih subjekata; istodobno je
        obveznik fiskalizirati transakijske račune u krajnjoj potrošnji. Izdavanje
        eRačuna u B2B kontekstu za paušaliste često se veže uz datum 1.1.2027. Pravila
        se mogu pojašnjavati podzakonskim aktima — prati službene izvore Porezne
        uprave.
      </p>
      <p>
        Ako gotovo isključivo radiš s firmama, drugačiji je vremenski okvir nego ako
        prodaješ krajnjim korisnicima gotovinom ili karticom.         U svakom slučaju, dobar početak je dokumentirati tipičan račun i provjeriti ga
        s alatom koji podržava fiskalizaciju 2.0 prije nego kreneš s punim opterećenjem.
      </p>

      <h2 id='eracuni'>eRačuni i zaprimanje</h2>
      <p>
        Zaprimanje eRačuna znači da moraš imati kanal kojim primaš strukturirane
        račune od dobavljača ili klijenata koji ih šalju kao eRačun. Država je
        pripremila besplatne ili pristupačne alate za manje subjekte, ali mnogi
        paušalisti žele sve na jednom mjestu uz izdavanje računa — zato integracija u
        aplikaciji štedi vrijeme. Ako ti je potrebna i evidencija ulaza, planiraj to
        unaprijed; ako ne, i dalje moraš moći zaprimiti račun kada zakon zahtijeva.
      </p>
      <p>
        Za <Link href={vodiciHref('izdavanje-racuna')}>izdavanje računa paušalni obrt</Link>{' '}
        i dalje mora sadržavati sve propisane elemente, a uz fiskalizaciju dolaze i
        tehnički identifikatori koji dokazuju da je račun prijavljen.
      </p>

      <h2 id='posrednik'>Informacijski posrednik</h2>
      <p>
        Informacijski posrednik nije marketing-pojam nego funkcionalna karika: bez
        njega ili ekvivalentnog rješenja teško ispunjavaš obveze u sustavu. Pri odabiru
        provjeri uptime, podršku, cijenu i kompatibilnost s programom koji već koristiš.
        Ako tek otvaraš obrt, pogledaj i vodič{' '}
        <Link href={vodiciHref('otvaranje-obrta')}>kako otvoriti paušalni obrt</Link>{' '}
        kako bi prvi koraci bili usklađeni s digitalnim obvezama.
      </p>

      <h2 id='priprema'>Kako se pripremiti</h2>
      <p>
        Napravi popis scenarija: gotovina, kartica, žiralna uplata, inozemni klijent.
        Za svaki scenarij zapiši treba li fiskalni korak, treba li eRačun i kako ga
        šalješ. Edukuj se o čuvanju potvrda i arhivi jer inspekcije i dalje traže
        tragljivost. Na kraju, isprobaj <Link href='/register'>Kvik</Link> ili drugi
        alat koji objedinjuje račune i evidenciju kako bi prijelaz na nove propise bio
        što glatkiji.
      </p>
      <p>
        Ako zapne, u aplikaciji koristi <Link href='/asistent'>AI asistenta</Link> za
        kontekstualna pitanja — ali za pravne interpretacije uvijek uzmi službeni
        izvor ili savjetnika.
      </p>
    </GuideShell>
  );
}

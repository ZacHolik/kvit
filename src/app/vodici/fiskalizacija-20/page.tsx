import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'fiskalizacija-20';

const META_DESC =
  'Sve o eRačunima, rokovima i obvezama za paušalne obrtnike — praktični vodič bez birokracije.';

export const metadata: Metadata = {
  title: 'Fiskalizacija 2.0 za paušaliste — što se mijenja i do kad?',
  description: META_DESC,
  keywords: [
    'fiskalizacija 2.0',
    'paušalni obrt',
    'eRačun',
    '2026',
    '2027',
    'MIKROeRACUN',
    'informacijski posrednik',
  ],
  openGraph: {
    title: 'Fiskalizacija 2.0 za paušaliste | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Moram li kao paušalist slati eRačune od 1.1.2026.?',
    answer:
      'Ne. Od 1.1.2026. za paušaliste je ključno zaprimanje eRačuna (primanje strukturiranih računa u sustav). Slanje (izdavanje) eRačuna u B2B smislu za tipičnog paušalista dolazi tek od 1.1.2027. — do tada se fokusiraj na kanal zaprimanja i potvrdu pristupne točke u ePoreznoj.',
  },
  {
    question: 'Što je MIKROeRACUN i trebam li ga?',
    answer:
      'MIKROeRACUN je besplatna aplikacija Porezne uprave u ePoreznoj za zaprimanje (i slanje) eRačuna, pod uvjetom da si korisnik ePorezne, nisi PDV obveznik i nisi javni naručitelj. Ako već koristiš Kvik ili drugi poslovni alat koji pokriva eRačun i posrednika, MIKROeRACUN ti ne treba kao dupli kanal — bitno je da negdje legalno zaprimaš eRačune kad zakon to traži.',
  },
  {
    question: 'Što je informacijski posrednik i kako ga odabrati?',
    answer:
      'Informacijski posrednik je servis koji tehnički šalje i zaprima eRačune u tvoje ime, u skladu s propisima. Jednom ga odabereš u ePoreznoj (FiskAplikacija) i potvrdiš pristupnu točku — bez te potvrde računi ti neće stizati kako treba. Posrednika kasnije možeš promijeniti, ali prazan kanal znači prazan inbox u sustavu.',
  },
  {
    question: 'Moram li mijenjati FINA certifikat za F2.0?',
    answer:
      'Ne — isti FINA aplikativni certifikat (.p12) koji koristiš za fiskalizaciju 1.0 vezan je uz tvoj OIB i ostaje temelj elektroničkog potpisa. Fiskalizacija 2.0 donosi nove procese oko eRačuna i posrednika, ne “novi certifikat zbog verzije”. Posrednik ili aplikacija ipak mogu tražiti dodatnu autentikaciju ili tehničke korake — to je razlika u integraciji, ne nužno u samom certifikatu.',
  },
  {
    question: 'Što ako ne budem spreman do 1.1.2027.?',
    answer:
      'Ako ne izdaješ eRačun kad zakon to od tebe traži, ulaziš u rizik novčanih kazni. Za ozbiljne prekršaje u području računa i fiskalizacije Zakon o fiskalizaciji (NN 114/23) predviđa kazne u rasponu koji za neke stvari ide i do 39.810 €, dok su za račune bez propisanih podataka predviđene kazne od 1.320 € do 39.810 € (čl. 34.a). Zato je jeftinije pripremiti se unaprijed nego gasiti požar u siječnju.',
  },
  {
    question: 'Je li Kvik informacijski posrednik?',
    answer:
      'Ne. Porezna uprava je pisano potvrdila da aplikacije koje koriste certifikate samih korisnika nisu informacijski posrednici. Kvik je softversko rješenje — tvoj certifikat, tvoji računi, tvoja kontrola.',
  },
  {
    question: 'Moram li koristiti AS4 protokol za eRačune?',
    answer:
      "Ne nužno. Zakon dopušta 'druge tehnologije i procedure' za razmjenu eRačuna (čl. 37. st. 3.). Za zaprimanje možeš koristiti besplatni MIKROeRACUN. Za izdavanje od 2027. Kvik priprema web portal dostavu koja je potvrđena kao zakonski sukladna.",
  },
];

const tableWrap =
  'my-6 overflow-x-auto rounded-xl border border-[#1f2a28] bg-[#111716] text-sm';

export default function Fiskalizacija20Page() {
  return (
    <GuideShell
      slug={SLUG}
      title='Fiskalizacija 2.0 za paušaliste — što se mijenja i do kad?'
      subtitle='eRačuni, rokovi i digitalni “prometni dnevnik” — objašnjeno kao frendu, bez panike.'
      readingMinutes={14}
      metaDescription={META_DESC}
      articleDateModified='2026-06-02'
      toc={[
        { id: 'sto-je', label: 'Što je Fiskalizacija 2.0?' },
        { id: 'zasto', label: 'Zašto se uvodi?' },
        { id: 'f1-f2', label: 'Razlika F1.0 i F2.0' },
        { id: 'rokovi', label: 'Rokovi za paušaliste' },
        { id: 'kvik-eracun', label: 'Kvik i eRačuni' },
        { id: 'koraci-2026', label: 'Što napraviti do 1.1.2026.' },
        { id: 'mikro', label: 'MIKROeRACUN' },
        { id: 'mikro-vs-kvik', label: 'MIKROeRACUN vs Kvik' },
        { id: 'posrednik', label: 'Informacijski posrednik' },
        { id: 'potvrda', label: 'Potvrda pristupne točke' },
        { id: 'format', label: 'Format eRačuna i arhiva' },
        { id: 'cijene', label: 'Koliko košta?' },
        { id: 'kazne', label: 'Kazne' },
        { id: 'izvori', label: 'Izvori' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('fina-certifikat-fiskalizacija'), title: 'FINA certifikat za fiskalizaciju' },
        { href: vodiciHref('izdavanje-racuna'), title: 'Izdavanje računa u paušalu' },
        { href: vodiciHref('pausalni-obrt-vodic'), title: 'Paušalni obrt 2026.' },
        { href: vodiciHref('izdavanje-racuna-vodic'), title: 'Vodič za izdavanje računa' },
        { href: '/alati/interni-akt', title: 'Generator internog akta' },
      ]}
      howTo={{
        name: 'Priprema na zaprimanje eRačuna do 1.1.2026.',
        description:
          'Kratki operativni tijek u ePoreznoj: posrednik, FiskAplikacija i potvrda pristupne točke.',
        steps: [
          {
            name: 'Prijavi se u ePoreznu',
            text: 'Koristi svoj uobičajeni način prijave (certifikat ili drugi propisani kanal).',
          },
          {
            name: 'Otvori FiskAplikaciju',
            text: 'U izborniku Porezne pronađi modul vezan uz fiskalizaciju / eRačun i administraciju pristupne točke.',
          },
          {
            name: 'Odaberi informacijskog posrednika',
            text: 'Odaberi pružatelja koji će zaprimali i slati eRačune u tvoje ime; provjeri da podržava tvoj scenarij (npr. alat koji već koristiš).',
          },
          {
            name: 'Potvrdi pristupnu točku',
            text: 'U FiskAplikaciji pod Administracija dovrši potvrdu — bez nje sustav ne smatra kanal aktivnim.',
          },
          {
            name: 'Testiraj i arhiviraj',
            text: 'Provjeri probni tijek i dogovori gdje čuvaš XML izvornike najmanje propisanih 6 godina.',
          },
        ],
      }}
    >
      <p>
        Ako si paušalist, vjerojatno si već čuo pojmove “eRačun”, “posrednik” i “2026.” u istoj
        rečenici. Ovaj tekst spaja{' '}
        <Link href={vodiciHref('izdavanje-racuna')} className='text-[#0d9488] hover:underline'>
          izdavanje računa
        </Link>
        , digitalne obveze i ono što stvarno moraš kliknuti u ePoreznoj prije nego štoperica
        počne otkucavati. Za šire informacije o obrtu i svemu oko njega pogledaj i{' '}
        <Link href={vodiciHref('pausalni-obrt-vodic')} className='text-[#0d9488] hover:underline'>
          paušalni obrt 2026.
        </Link>
        , a za numeraciju i poslovne oznake besplatno kreiraj {' '}
        <Link href='/alati/interni-akt' className='text-[#0d9488] hover:underline'>
          interni akt
        </Link>{' '}
        prije prvog izdanog računa.
      </p>

      <h2 id='sto-je'>Što je Fiskalizacija 2.0?</h2>
      <p>
        Fiskalizacija 2.0 je nastavak digitalizacije poslovnih računa: država želi strukturirane
        podatke o prometu, manje PDF-a “u prilogu maila” i više automatske obrade. U praksi za
        obrtnika to znači da uz postojeću fiskalizaciju gotovinskih računa dolazi sustav
        standardiziranih eRačuna koji mora “pričati” s Poreznom i s poslovnim partnerima na isti
        način diljem EU-a.
      </p>
      <p>
        Bitno: fiskalizacija (JIR/ZKI, potvrda prometa) i eRačun (UBL XML, poslovni dokument) nisu
        isti film, ali u aplikaciji često dijele isti korisnički tok — zato je pametno odabrati
        alat koji ne razdvaja život na pola.
      </p>

      <h2 id='zasto'>Zašto se uvodi?</h2>
      <p>
        Hrvatska (i EU) žele jedinstveni digitalni format računa kako bi se smanjile greške,
        lažni prometi i ručni prepisi. Tehnički okvir za strukturu eRačuna vezan je uz europsku
        normu <strong>EN 16931</strong> i XML shemu <strong>UBL 2.1</strong>, uz nacionalnu
        proširenja — to omogućuje automatizirani nadzor i brži obračun PDV-a i drugih obveza kod
        onih koji su u PDV sustavu, a tebi kao paušalistu donosi jasna pravila što je “pravi”
        račun u sustavu, a što nije.
      </p>
      <p>
        Kod <strong>PDV obveznika</strong> dio obveza oko eRačuna uključen je u raniji datum
        (često se navodi <strong>1.1.2026.</strong> kao opći start za “sve” u tom segmentu) — ako
        si ili planiraš biti u PDV-u, tretiraj to kao zaseban raspored i ne oslanjaj se isključivo
        na paušalne tablice iz zajednice.
      </p>

      <h2 id='f1-f2'>Koja je razlika između F1.0 i F2.0?</h2>
      <p>
        Grubo rečeno, F1.0 je fokus na <strong>gotovinskom primitku</strong> (gotovina, kartica na
        licu mjesta, ček…) uz potvrdu Poreznoj u stvarnom vremenu. F2.0 širi priču na{' '}
        <strong>eRačune</strong> koji se razmjenjuju kao strogo definirani XML-ovi, ne kao
        skenirani papir.
      </p>
      <p>
        <strong>Promjena od 1.1.2026.:</strong> svi računi prema krajnjim potrošačima moraju biti
        fiskalizirani — uključujući <strong>transakcijske</strong> (npr. uplata na žiro-račun).
        Ranije su se fiskalizirali uglavnom samo gotovinski; sada nema “samo pošaljem PDF na mail”.
      </p>
      <div className={tableWrap}>
        <table className='min-w-full border-collapse text-left'>
          <thead>
            <tr className='border-b border-[#1f2a28] text-[#94a3a0]'>
              <th className='px-3 py-2 font-medium'>Područje</th>
              <th className='px-3 py-2 font-medium'>Fiskalizacija 1.0</th>
              <th className='px-3 py-2 font-medium'>Fiskalizacija 2.0</th>
            </tr>
          </thead>
          <tbody className='text-[#d5dfdd]'>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>Gotovina / kartica na licu mjesta</td>
              <td className='px-3 py-2'>Fiskalni račun, JIR/ZKI, često FINA certifikat</td>
              <td className='px-3 py-2'>Isto načelo digitalne potvrde — ostaje tvoj “svakodnevni” dio</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>B2B dokumenti</td>
              <td className='px-3 py-2'>PDF mailom, razni formati — “ljudski” promet</td>
              <td className='px-3 py-2'>Strukturirani eRačun (UBL 2.1), posrednik, jasni rokovi</td>
            </tr>
            <tr>
              <td className='px-3 py-2'>Državni uvid</td>
              <td className='px-3 py-2'>Točkasti, uz izdavanje računa</td>
              <td className='px-3 py-2'>Širi, automatiziran — manje prostora za “pa ćemo nekako”</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Više o certifikatu imaš u vodiču{' '}
        <Link href={vodiciHref('fina-certifikat-fiskalizacija')} className='text-[#0d9488] hover:underline'>
          FINA certifikat za fiskalizaciju
        </Link>
        .
      </p>

      <h2 id='rokovi'>Rokovi za paušaliste</h2>
      <p>
        Sljedeća tablica je “što me konkretno čeka” za tipičnog paušalnog obrtnika izvan javne
        nabave — ako si u PDV sustavu ili si javni naručitelj, drugačiji su i rokovi i alati; to
        provjeri posebno kod savjetnika.
      </p>
      <div className={tableWrap}>
        <table className='min-w-full border-collapse text-left'>
          <thead>
            <tr className='border-b border-[#1f2a28] text-[#94a3a0]'>
              <th className='px-3 py-2 font-medium'>Rok</th>
              <th className='px-3 py-2 font-medium'>Obveza</th>
              <th className='px-3 py-2 font-medium'>Kvik status</th>
            </tr>
          </thead>
          <tbody className='text-[#d5dfdd]'>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>1.1.2026.</td>
              <td className='px-3 py-2'>
                Fiskalizacija SVIH računa (i transakcijskih) prema B2C
              </td>
              <td className='px-3 py-2'>✅ LIVE</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>1.1.2026.</td>
              <td className='px-3 py-2'>Zaprimanje eRačuna od B2B partnera</td>
              <td className='px-3 py-2'>MIKROeRACUN (besplatno)</td>
            </tr>
            <tr>
              <td className='px-3 py-2'>1.1.2027.</td>
              <td className='px-3 py-2'>Izdavanje eRačuna prema B2B partnerima</td>
              <td className='px-3 py-2'>Kvik priprema web portal</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        PDV obveznici imaju ranije rokove za dio obveza — to je druga priča od paušala, ali je
        dobro znati ako planiraš prijelaz s praga od 60.000 €.
      </p>

      <h2 id='kvik-eracun'>Kvik i eRačuni — što to znači za tebe</h2>
      <p>
        <strong>Kvik NIJE informacijski posrednik</strong> — to je potvrdila Porezna uprava pisanim
        tumačenjem. To znači da Kvik ne mora prolaziti testiranje sukladnosti niti se upisivati na
        posebne popise ovlaštenih posrednika.
      </p>
      <p>
        Tvoj{' '}
        <Link
          href={vodiciHref('fina-certifikat-fiskalizacija')}
          className='text-[#0d9488] hover:underline'
        >
          FINA certifikat
        </Link>{' '}
        koji koristiš za fiskalizaciju 1.0 koristit ćeš i za eRačune. Isti certifikat, isti Kvik —
        samo novi format računa. Prije prvog računa provjeri i{' '}
        <Link href='/alati/interni-akt' className='text-[#0d9488] hover:underline'>
          interni akt
        </Link>
        ; aktivaciju fiskalizacije radi u{' '}
        <Link href='/postavke/fiskalizacija' className='text-[#0d9488] hover:underline'>
          postavkama fiskalizacije
        </Link>
        .
      </p>
      <p>
        Za <strong>zaprimanje</strong> eRačuna (obveza od 2026.) imaš besplatnu opciju:{' '}
        <strong>MIKROeRACUN</strong> u ePoreznoj. Porezna uprava ti je automatski pristupna točka
        — ne trebaš ništa dodatno ugovarati niti graditi vlastitu AS4 infrastrukturu.
      </p>
      <p>
        Za <strong>izdavanje</strong> eRačuna (obveza od 2027.) Kvik priprema rješenje putem web
        portala — primatelj dobije obavijest, preuzme eRačun u UBL XML formatu, potvrdi primitak, a
        Kvik fiskalizira obje strane. Tehnologija razmjene nije uvjetovana isključivo AS4 protokolom
        (čl. 37. st. 3. Zakona o fiskalizaciji) — web portal je zakonski sukladna alternativa.
      </p>
      <p>
        Nisi siguran jesi li spreman? Prođi{' '}
        <Link href='/provjera' className='text-[#0d9488] hover:underline'>
          kviz spremnosti
        </Link>
        .
      </p>
      <p className='text-sm text-[#94a3a0]'>
        Izvor: pisano tumačenje Porezne uprave, ID upita VPS-379909-T2L6W9.
      </p>

      <h2 id='koraci-2026'>Što moraš napraviti do 1.1.2026.?</h2>
      <p>
        Bez dramskog soundtracka: ulogiraj se u <strong>ePoreznu</strong>, otvori{' '}
        <strong>FiskAplikaciju</strong>, u dijelu za <strong>administraciju</strong> odaberi
        informacijskog posrednika koji odgovara tvom načinu rada (npr. Kvik ili drugi servis koji
        podržava tvoj obrt) i završi <strong>potvrdu pristupne točke</strong>. To je onaj korak
        koji mnogi preskoče pa se čude zašto im eRačun “ne pada” u sustav — sustav jednostavno
        ne zna tko je tvoj kanal.
      </p>
      <p>
        Ako još nemaš digitalni certifikat za fiskalizaciju gotovine, sredi ga prije nego što krene
        gužva — uputu imaš ovdje:{' '}
        <Link href={vodiciHref('fina-certifikat-fiskalizacija')} className='text-[#0d9488] hover:underline'>
          FINA certifikat korak po korak
        </Link>
        . Isto tako provjeri ima li tvoj program već ugrađen posrednika ili trebaš paralelno
        držati MIKROeRACUN samo za zaprimanje.
      </p>

      <h2 id='mikro'>Što je MIKROeRACUN?</h2>
      <p>
        <strong>MIKROeRACUN</strong> je besplatna aplikacija Porezne uprave unutar ePorezne za
        male obveznike: možeš njome zaprimati (i slati) eRačune ako si korisnik ePorezne,{' '}
        <strong>nisi PDV obveznik</strong> i <strong>nisi javni naručitelj</strong>. Za čistog
        paušalista koji nema komercijalni program često je to najjednostavniji ulaz u svijet
        strukturiranih računa — ali nije čarobni štapić za cijelo poslovanje.
      </p>
      <p>
        Ako prihvatiš uvjete korištenja MIKROeRACUN-a, ne moraš poduzimati dodatne korake —
        aplikacija se automatski potvrđuje kao pristupna točka (izvor: FAQ Porezne uprave).
        Paušalisti koji koriste MIKROeRACUN za zaprimanje imaju pristupnu točku jer je Porezna
        uprava njihov posrednik — ne treba im vlastita AS4 infrastruktura.
      </p>
      <p>
        <strong>MIKROeRACUN</strong> omogućava <strong>izdavanje</strong> eRačuna tek od{' '}
        <strong>1.1.2027.</strong> Ako trebaš izdavati eRačune tijekom 2026. — trebaš drugog
        informacijskog posrednika (izvor:{' '}
        <a
          href='https://www.porezna-uprava.gov.hr/8190'
          className='text-[#0d9488] hover:underline'
          rel='noopener noreferrer'
          target='_blank'
        >
          porezna-uprava.gov.hr/8190
        </a>
        ).
      </p>

      <h2 id='mikro-vs-kvik'>Prednosti i mane MIKROeRACUN vs Kvik</h2>
      <p>
        <strong>MIKROeRACUN</strong> je <strong>0 €</strong> i državno održavan — super za
        zaprimanje i osnovno slanje. Mana je što je to specijalizirani kanal: ne vodi ti KPR,
        ne šalje marketing račune klijentima, ne povezuje PO-SD, ne drži interni akt i ne
        podsjeća te na doprinose. <strong>Kvik</strong> je plaćena usluga (npr. oko{' '}
        <strong>7 € / mj</strong>) koja spaja račune, fiskalizaciju 1.0 i pripremu za 2.0, KPR i
        administraciju obrta na jednom mjestu — plaćaš praktičnost, ne “državni minimum”.
      </p>
      <p>
        Fer svestka: ako ti treba samo pristupni kanal za par računa godišnje, MIKROeRACUN može
        biti dovoljan. Ako želiš da ti se sve događa iz jedne aplikacije koju već koristiš za
        posao, Kvik ima smisla — nije pitanje ideologije nego volumena i živaca.
      </p>

      <h2 id='posrednik'>Što je informacijski posrednik?</h2>
      <p>
        Posrednik je servis koji tehnički prebacuje UBL XML između tebe, poslovnih partnera i
        Porezne. Jednom ga odabereš i potvrdiš; kasnije ga možeš promijeniti, ali svaka promjena
        traži ponovno usklađivanje u ePoreznoj — zato ne klikaj nasumično “prvi na listi” nego
        onoga tko stvarno podržava tvoj alat.
      </p>

      <h2 id='potvrda'>Kako potvrditi pristupnu točku u ePoreznoj?</h2>
      <p>
        Nakon odabira posrednika u <strong>FiskAplikaciji</strong> idi na{' '}
        <strong>Administracija</strong> i dovrši <strong>potvrdu pristupne točke</strong>. Dok to
        ne prođe uredno, sustav nema kamo poslati uključene eRačune — kao da imaš ispravan OIB,
        ali nemaš poštanski sandučić.
      </p>

      <h2 id='format'>Format eRačuna: UBL 2.1 XML, ne PDF</h2>
      <p>
        Službeni eRačun nije “lijep PDF” nego <strong>UBL 2.1 XML</strong> koji slijedi EN 16931
        i hrvatska proširenja. PDF može postojati kao prilog za ljude, ali <strong>izvornik koji
        se arhivira</strong> je XML — i to elektronički najmanje{' '}
        <strong>šest godina</strong> prema pravilima koja prate eRačun. Zato backup na USB nije
        luksuz nego osiguranje.
      </p>
      <p>
        Tehnički detalji implementacije propisani su u <strong>Tehničkoj specifikaciji v2.5</strong>{' '}
        (APIS IT, listopad 2023.) — tamo ideš kad te zanima “koje polje u XML-u”, ne kad želiš
        filozofiju.
      </p>

      <h2 id='cijene'>Koliko košta?</h2>
      <p>
        <strong>FINA</strong> naplaćuje aplikativni certifikat za fiskalizaciju oko{' '}
        <strong>39,82 € + PDV</strong> na pet godina (ukupno oko <strong>49,78 €</strong> s PDV-om
        pri tipičnoj stopi) — točan iznos uvijek provjeri na{' '}
        <a
          href='https://www.fina.hr'
          className='text-[#0d9488] hover:underline'
          rel='noopener noreferrer'
          target='_blank'
        >
          fina.hr
        </a>{' '}
        i portalu <strong>mojcert.fina.hr</strong>. <strong>Demo certifikat</strong> je besplatan
        za testiranje. <strong>MIKROeRACUN</strong> je <strong>0 €</strong>.{' '}
        <strong>Kvik</strong> košta reda veličine <strong>7 € / mj</strong> i uključuje poslovni
        dio koji državna aplikacija ne pokriva.
      </p>
      <p>
        Za poslovne pakete e-Računa koje nudi FINA (ako ih trebaš izvan MIKROeRACUNa) cijene su na
        njihovim stranicama — usporedi s time što već plaćaš računovođi ili IT podršci.
      </p>

      <h2 id='kazne'>Kazne za neusklađenost</h2>
      <p>
        Zakon o fiskalizaciji (NN 133/12, 115/16, 106/18, 121/19, 114/23) predviđa novčane kazne
        koje za obrtnike idu od stotina eura do desetaka tisuća, ovisno o prekršaju i okolnostima.
        Za <strong>račune bez propisanih podataka</strong> raspon je{' '}
        <strong>1.320 € – 39.810 €</strong> (čl. 34.a), a za <strong>izbjegavanje fiskalizacije</strong>{' '}
        do <strong>39.810 €</strong> (čl. 34.). <strong>Nenabava FINA certifikata</strong> i{' '}
        <strong>neusklađenost veze</strong> mogu ići do <strong>26.540 €</strong> (čl. 35.) — zato
        “nisam znao” ne drži vodu kao poslovni plan.
      </p>

      <h2 id='izvori'>Izvori (za provjeru prije odluke)</h2>
      <p className='text-sm text-[#94a3a0]'>
        Zakon o fiskalizaciji (NN 133/12, 115/16, 106/18, 121/19, 114/23); Tehnička specifikacija
        eRačuna v2.5 (APIS IT, 6.10.2023.); službene stranice Porezne uprave i FINA-e (certifikat,
        mojcert.fina.hr, MIKROeRACUN u ePoreznoj); pisano tumačenje Porezne uprave ID VPS-379909-T2L6W9.
        Kvik ne zamjenjuje poreznog savjetnika — ako si
        u složenom PDV ili inozemnom scenariju, uzmi stručnjaka.
      </p>

      <div className='mt-10 rounded-2xl border border-[#0d9488]/40 bg-[#111716] p-6'>
        <p className='font-heading text-lg font-semibold text-[#e2e8e7]'>
          Kvik automatski rješava fiskalizaciju 1.0 i priprema te za 2.0
        </p>
        <p className='mt-2 text-sm leading-relaxed text-[#b9c7c4]'>
          Gosti: besplatna registracija na <strong>https://kvik.online/register</strong>. Ako
          već imaš račun, u aplikaciji otvori{' '}
          <strong>https://kvik.online/postavke/fiskalizacija</strong> i dovrši čarobnjak za upload
          .p12 certifikata.
        </p>
        <div className='mt-4 flex flex-wrap gap-3'>
          <Link href='/register' className='btn-cta-primary inline-flex px-4 py-2.5 text-sm'>
            Probaj besplatno →
          </Link>
          <Link
            href='/postavke/fiskalizacija'
            className='inline-flex rounded-lg border border-[#0d9488] px-4 py-2.5 text-sm font-semibold text-[#0d9488] transition hover:bg-[#0d9488]/10'
          >
            Otvori postavke fiskalizacije
          </Link>
        </div>
      </div>
    </GuideShell>
  );
}

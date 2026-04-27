import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'pausalni-obrt-za-fotografe';

const META_DESC =
  'Fotografi i snimatelji: paušalni obrt, autorski ugovori, oprema kao trošak i fiskalizacija.';

export const metadata: Metadata = {
  title: 'Paušalni obrt za fotografe',
  description: META_DESC,
  openGraph: {
    title: 'Paušalni obrt za fotografe | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Može li fotograf biti paušalist?',
    answer:
      'Da, ako fotografska djelatnost nije izuzeta iz paušalnog obrta i ispunjavaš obrtne uvjete. Autorski honorari i autorska prava trebaju poseban pravni okvir uz obrt — provjeri ugovore.',
  },
  {
    question: 'Kako fakturirati agenciji ili firmi?',
    answer:
      'Izdaješ račun obrta s punim podacima, opisom usluge (dan snimanja, broj sati, paket) i načinom plaćanja. Za tvrtke često slijedi eRačun kroz sustav — vidi vodič o izdavanju računa i fiskalizaciji.',
  },
  {
    question: 'Mogu li opremu staviti kao trošak?',
    answer:
      'U klasičnom paušalnom modelu ne vodiš rashode kao kod punog knjigovodstva. Investicije u body, objektive i svjetlo ipak su poslovna odluka koja utječe na cashflow, ali porezno se ne odbijaju kao kod obrta s knjigama — potvrdi s računovođom.',
  },
  {
    question: 'Trebam li fiskalizaciju za vjenčanja?',
    answer:
      'Vjenčanja su tipično B2C gotovina ili kartica. Ako izdaješ transakijski račun fizičkoj osobi, fiskalizacija 2.0 često je obvezna od 2026. Priprema unaprijed štedi stres na sam dan snimanja.',
  },
  {
    question: 'Kako fakturirati inozemnom klijentu?',
    answer:
      'Račun na engleskom s jasnim opisom, valutom i podacima obrta; pratiti KPR i eventualne PDV iznimke za isporuke usluga. Swift uplate arhiviraj uz račun.',
  },
];

export default function PauzalniObrtZaFotografePage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Paušalni obrt za fotografe – vodič 2026.'
      subtitle='Od autorskih ugovora do deviznih avansa — kako poslovanje ostane čisto i profesionalno.'
      readingMinutes={11}
      metaDescription={META_DESC}
      toc={[
        { id: 'prednosti-foto', label: 'Fotograf kao paušalist – prednosti' },
        { id: 'autorski', label: 'Autorski honorar vs paušalni obrt' },
        { id: 'oprema', label: 'Oprema – može li biti trošak?' },
        { id: 'agencije', label: 'Fakturiranje agencijama i firmama' },
        { id: 'vjencanja', label: 'Fiskalizacija za wedding fotografe (gotovina!)' },
        { id: 'inozemstvo', label: 'Inozemni klijenti i devizni primitci' },
        { id: 'autorska-pdv', label: 'Autorska prava i PDV' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('fiskalizacija-20'), title: 'Fiskalizacija 2.0 za paušaliste' },
        { href: vodiciHref('izdavanje-racuna'), title: 'Izdavanje računa u paušalu' },
        { href: vodiciHref('pausalni-obrt-za-it-freelancere'), title: 'Paušalni obrt za IT freelancere' },
        { href: vodiciHref('doprinosi'), title: 'Doprinosi za paušalni obrt' },
      ]}
      howTo={{
        name: 'Pakiranje fotografskog projekta za račun',
        description:
          'Kako od avansa do dostave fotografija sve ostane u evidenciji.',
        steps: [
          {
            name: 'Dogovori cjenik i avans',
            text: 'U pisanom predračunu navedi što je uključeno i koliki je avans.',
          },
          {
            name: 'Izdaj račun za avans i dospijeće',
            text: 'Svaka uplata ima svoj račun ili jasno strukturiranu stavku prema praksi.',
          },
          {
            name: 'Fiskaliziraj ako je B2C',
            text: 'Za privatne klijente pokreni fiskalni korak u skladu s propisima.',
          },
          {
            name: 'Zatvori projekt i arhiviraj',
            text: 'Spremi RAW/JPG isporuku kao dokaz izvršenja uz račun.',
          },
        ],
      }}
    >
      <p>
        <strong>Paušalni obrt za fotografe</strong> daje jednostavan okvir za
        naplatu snimanja vjenčanja, portreta, komercijalnih kampanja i
        video-produkcije bez punog knjigovodstva. Ipak, kreativna industrija
        često miješa autorske ugovore, agencijske narudžbe i gotovinu na licu
        mjesta — što sve mora završiti u KPR-u i na računima. Ovaj vodič
        povezuje tvoj rad s <Link href={vodiciHref('fiskalizacija-20')}>fiskalizacijom</Link>,{' '}
        <Link href={vodiciHref('izdavanje-racuna')}>pravilima računa</Link> i{' '}
        <Link href={vodiciHref('doprinosi')}>doprinosima</Link>, uz usporedbu s
        digitalnim freelancingom u vodiču za{' '}
        <Link href={vodiciHref('pausalni-obrt-za-it-freelancere')}>IT freelancere</Link>.
      </p>

      <h2 id='prednosti-foto'>Fotograf kao paušalist – prednosti</h2>
      <p>
        Paušalni model štedi vrijeme: umjesto knjiženja svake memorijske kartice
        kao troška, fokusiraš se na klijente i kalendar. Predvidljivi doprinosi
        i kvartalni porez pomažu planirati sezonu kad su vjenčanja gusto, a
        siječanj miran. To je posebno važno kad su prihodi ciklični.
      </p>
      <p>
        Ograničenje je manjak fleksibilnosti kad prihod skoči iznad praga PDV-a
        ili kad agencija traži složene međunarodne strukture — tada razmisli o{' '}
        <Link href={vodiciHref('pausalni-obrt-vs-doo')}>d.o.o.</Link> ili drugom
        modelu.
      </p>

      <h2 id='autorski'>Autorski honorar vs paušalni obrt</h2>
      <p>
        Autorski honorar može ostati paralelan instrument za određena djela,
        ali većina komercijalnog rada ide kroz račun obrta kad si paušalist.
        Ugovor treba jasno reći tko drži autorska prava, može li klijent
        remiksati snimku i do kada traje licenca. Neprecizan autorski ugovor
        kasnije stvara sporove i porezna pitanja.
      </p>
      <p>
        Ako si isključivo na autorskim ugovorima bez obrta, drugačiji su i
        doprinosi i izvještavanje — usporedi s obrtnim putem prije nego što
        potpišeš dugoročne kontrakte.
      </p>

      <h2 id='oprema'>Oprema – može li biti trošak?</h2>
      <p>
        Paušalni obrt ne funkcionira kao puni obrt s odbitkom rashoda po
        stvarnosti. Kupljeni body, objektivi i svjetla su tvoji poslovni
        investicijski izdaci u smislu cashflowa, ali ih ne knjižiš klasično kao
        kod d.o.o. Zato planiraj amortizaciju mentalno: cijena opreme ide iz
        neto prihoda koji ostane nakon doprinosa i poreza.
      </p>
      <p>
        Neki fotografi zato paralelno vode d.o.o. za veće investicije — to je
        već strateška odluka koja prelazi okvir <strong>paušalnog obrta za fotografe</strong>.
      </p>

      <h2 id='agencije'>Fakturiranje agencijama i firmama</h2>
      <p>
        Agencije traže OIB, IBAN, jasne stavke i često eRačun. Račun mora
        točno odgovarati narudžbenici i ugovoru o snimanju. Ako radiš više
        smjena, razdvoji stavke po danu ili po paketu kako bi knjigovodstvo
        klijenta moglo knjižiti bez pitanja.
      </p>
      <p>
        Za veće iznose dogovori avans i ostatak po isporuci — svaka faza treba
        dokument. Ako kasniš s računom, često kasni i plaćanje, što remeti tvoj
        KPR i plan doprinosa.
      </p>

      <h2 id='vjencanja'>Fiskalizacija za wedding fotografe (gotovina!)</h2>
      <p>
        Vjenčanja gotovo uvijek znače privatne naručitelje. Gotovina i kartice
        na lokaciji padaju pod B2C scenarij. Fiskalizacija 2.0 od 2026. zahtijeva
        tehničku pripremu: mobilni signal, aplikacija ili program, i rezervni
        plan ako mreža zakaže. Bolje probati nego prvi put na subotom u lipnju.
      </p>
      <p>
        Ako dio uplata ide roditeljima mladenaca, a dio paru, dogovori tko je
        primatelj usluge na računu — nejasnoće kasnije kompliciraju reklamacije.
      </p>

      <h2 id='inozemstvo'>Inozemni klijenti i devizni primitci</h2>
      <p>
        Destination vjenčanja i brandovi iz EU ili SAD-a često plaćaju u eurima
        ili dolarima. Račun može biti na engleskom s jasnim PDV napomenama prema
        statusu. Primitak pretvori u eure za praćenje limita od 60.000 € i
        unesi u <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR</Link> sukladno pravilima.
      </p>
      <p>
        Swift potvrde čuvaj uz račun kako bi bilo jasno koji tečaj i datum
        vrijede. Ako radiš za inozemno pravno lice bez hrvatskog PDV broja,
        pravila mjesta isporuke usluge određuju PDV — ovdje je savjetnik must za
        veće iznose.
      </p>

      <h2 id='autorska-pdv'>Autorska prava i PDV</h2>
      <p>
        Dok si izvan sustava PDV-a, na računu stoji napomena da PDV nije
        obračunat sukladno zakonu. Kad uđeš u PDV zbog praga, autorske stavke i
        licencije mogu imati drugačiju obradu. Zato prati rast prihoda već od
        sredine godine, ne tek u prosincu.
      </p>
      <p>
        Za komercijalne fotografije često se događa da klijent traži ekskluzivnu
        licencu na određeno razdoblje — to utječe na cijenu, ali ne mijenja sam
        po sebi činjenicu da i dalje moraš imati ispravan račun i KPR zapis za
        svaku uplatu. Kad licenca postane dugoročna i gotovo neograničena, dobro
        je ponovno provjeriti je li obrt i dalje najbolji oblik ili je vrijeme za
        tvrtku.
      </p>
      <p>
        Zaključno, <strong>paušalni obrt za fotografe</strong> je odličan alat
        za solo snimatelje koji žele profesionalne račune i jednostavnije
        poreze, uz uvjet da gotovinske uplate i autorski ugovori budu jednako
        disciplinirani kao kadar na snimanju.
      </p>
    </GuideShell>
  );
}

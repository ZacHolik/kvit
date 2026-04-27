import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'prikriveni-radni-odnos';

const META_DESC =
  'Što je prikriveni radni odnos, kako ga Porezna prepoznaje i kako IT freelanceri mogu smanjiti rizik.';

export const metadata: Metadata = {
  title: 'Prikriveni radni odnos paušalac',
  description: META_DESC,
  openGraph: {
    title: 'Prikriveni radni odnos paušalac | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Što je prikriveni radni odnos?',
    answer:
      'To je situacija u kojoj osoba radi za poslodavca, ali formalno izgleda kao obrt, ugovor o djelu ili drugi oblik kako bi se izbjegle obveze rada. Zakon i praksa gledaju stvarni sadržaj odnosa, ne samo papir.',
  },
  {
    question: 'Kako Porezna prepoznaje prikriveni radni odnos?',
    answer:
      'Kroz presjek ugovora, uplate, trajanje suradnje, upute o radu, korištenje opreme poslodavca i učešće u organizaciji. Ako podaci ukazuju na podređenost i stalnost, mogu pokrenuti postupak.',
  },
  {
    question: 'Mogu li imati samo jednog klijenta kao paušalist?',
    answer:
      'Jedan klijent nije automatski zabranjen, ali povećava rizik procjene. Važnije je možeš li dokazati autonomiju, vlastiti rizik i rezultate usluge neovisno o tom klijentu.',
  },
  {
    question: 'Što se dogodi ako Porezna utvrdi prikriveni radni odnos?',
    answer:
      'Mogu slijediti doplate doprinosa i poreza, kamate i kazne, te obveze za poslodavca. Posljedice ovise o slučaju — zato prevencija i dokumentacija imaju cijenu manju od sankcija.',
  },
  {
    question: 'Kako napisati ugovor da izbjegnem rizik?',
    answer:
      'Ugovor treba definirati predmet, rokove, način isporuke, cijenu i autonomiju izvođača. Izbjegavaj klauzule koje kopiraju radno mjesto (fiksno radno vrijeme, disciplinske mjere poslodavca).',
  },
];

export default function PrikriveniRadniOdnosPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Prikriveni radni odnos – što je, kako ga izbjeći i rizici'
      subtitle='Kad obrt ili ugovor o djelu izgledaju kao zaposlenje — što Porezna gleda i kako se zaštititi.'
      readingMinutes={12}
      metaDescription={META_DESC}
      toc={[
        { id: 'zakon', label: 'Što je prikriveni radni odnos po zakonu' },
        { id: 'prepoznavanje', label: 'Kako Porezna prepoznaje prikriveni radni odnos' },
        { id: 'kriteriji', label: 'Kriteriji: jedan klijent, radno vrijeme, oprema' },
        { id: 'rizici', label: 'Rizici za paušalista i za klijenta (firmu)' },
        { id: 'ugovor', label: 'Kako strukturirati ugovor da se zaštiti' },
        { id: 'diversifikacija', label: 'Diversifikacija klijenata kao zaštita' },
        { id: 'postupak', label: 'Što napraviti ako te Porezna pozove' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('pausalni-obrt-za-it-freelancere'), title: 'Paušalni obrt za IT freelancere' },
        { href: vodiciHref('pausalni-obrt-vs-doo'), title: 'Paušalni obrt vs d.o.o.' },
        { href: vodiciHref('pausalni-obrt-vodic'), title: 'Paušalni obrt 2026.' },
        { href: vodiciHref('doprinosi'), title: 'Doprinosi za paušalni obrt' },
      ]}
      howTo={{
        name: 'Smanjenje rizika prikrivenog rada',
        description:
          'Koraci koje paušalist može poduzeti prije potpisivanja dugoročnog angažmana.',
        steps: [
          {
            name: 'Analiziraj nalogodavca',
            text: 'Provjeri hoćeš li raditi iste zadatke kao zaposlenici i tko daje opremu.',
          },
          {
            name: 'Dogovori isporuke, ne smjene',
            text: 'Ugovor neka broji rezultate (sprint, modul), ne sate prisutnosti.',
          },
          {
            name: 'Dodaj druge klijente',
            text: 'Čak i manji sporedni projekti pokazuju da nisi isključivo vez uz jednu firmu.',
          },
          {
            name: 'Arhiviraj komunikaciju',
            text: 'Čuvaj dopise o prihvaćanju gotovih isporuka kao dokaz autonomije.',
          },
        ],
      }}
    >
      <p>
        Pojam <strong>prikriveni radni odnos paušalac</strong> danas čuješ na
        svakom meetupu jer država želi osigurati doprinose i prava radnika kad
        poslodavac &quot;prebaci&quot; ljude na obrt ili ugovor o djelu bez
        stvarne promjene u radu. Ako si na paušalnom obrtu, formalno si
        poduzetnik, ali ako u praksi radiš kao član tuđeg tima, Porezna može
        ocijeniti da je obrt samo omot. Ovaj tekst povezuje rizik s vodičem o{' '}
        <Link href={vodiciHref('pausalni-obrt-za-it-freelancere')}>paušalnom obrtu za IT freelancere</Link>{' '}
        i <Link href={vodiciHref('pausalni-obrt-vs-doo')}>odabirom d.o.o.</Link> kad je suradnja
        zapravo trajna.
      </p>

      <h2 id='zakon'>Što je prikriveni radni odnos po zakonu</h2>
      <p>
        Zakonodavstvo štiti osobe koje rade za tuđi račun: ako ispunjavaju
        elemente rada, trebaju radnopravnu zaštitu i doprinose iz plaće. Kad
        poslodavac umjesto toga potpisuje ugovor s obrtom, država gleda je li
        riječ o pravoj usluzi ili o zamaski. Paušalni obrt ovdje nije magična
        zaštita — ako je sadržaj zapošljavanja, rizik postoji i za tebe i za
        firmu.
      </p>
      <p>
        Bitno je razlikovati legitimnu suradnju (projekt s jasnim ishodom) od
        odnosa gdje nalogodavac određuje gdje, kada i kako radiš kao zaposlenik.
        Druga situacija često završava u kategoriji koja zanimljiva poreznom
        inspektoru.
      </p>

      <h2 id='prepoznavanje'>Kako Porezna prepoznaje prikriveni radni odnos</h2>
      <p>
        Službenici skupljaju tragove: uplate gotovo isključivo od jedne tvrtke,
        stalna primanja svaki mjesec, korištenje poslovnog emaila poslodavca,
        prisutnost na internim alatima kao da si zaposlenik. U IT sektoru to
        često izgleda kao Slack pristup, korporativni laptop i dnevni stand-up —
        sve legitimno u suradnji, ali opasno kad nemaš vlastiti brend usluge.
      </p>
      <p>
        Porezna uspoređuje i tržišnu cijenu usluge: ako je angažman ispod
        tržišta uz punu podređenost, to je dodatni signal. Zato dokumentiraj
        vrijednost koju donosiš izvan &quot;satnice&quot;.
      </p>

      <h2 id='kriteriji'>Kriteriji: jedan klijent, radno vrijeme, oprema</h2>
      <p>
        Tri česta stuba rizika su: (1) jedan izvor prihoda dugi mjeseci, (2)
        obavezno prisustvo u uredu ili na callovima točno u radno vrijeme firme,
        (3) oprema i licence isključivo poslodavca bez vlastitog rizika. Ako u
        takvoj slici djeluješ kao <strong>prikriveni radni odnos paušalac</strong>,
        trebaš ili promijeniti način rada ili formalizirati zaposlenje / drugi oblik.
      </p>
      <p>
        Suprotno, ako imaš više klijenata, vlastiti računar, dogovorene
        milestonee i plaćanje po isporuci, rizik pada. Nije jamstvo, ali je
        argument u tvoju korist.
      </p>

      <h2 id='rizici'>Rizici za paušalista i za klijenta (firmu)</h2>
      <p>
        Za paušalista: moguća reklasifikacija u zaposlenje donosi retroaktivne
        doprinose i porezne obveze koje nisi planirao. Za firmu: obveze
        poslodavca, kazne i reputacijski gubitak. Zato veliki klijenti često
        traže dokaz da si stvarno B2B partner — ponekad i to da imaš d.o.o.
      </p>
      <p>
        Ako si u pregovorima, pročitaj i{' '}
        <Link href={vodiciHref('pausalni-obrt-vs-doo')}>paušalni obrt vs d.o.o.</Link>{' '}
        jer neke korporacije jednostavno ne žele obrt zbog internih pravila
        nabave.
      </p>

      <h2 id='ugovor'>Kako strukturirati ugovor da se zaštiti</h2>
      <p>
        Ugovor o izvođenju treba imati predmet (npr. modul ili kampanja), cijenu,
        rok, definiciju prihvaćanja i odgovornost za kvalitetu. Izbjegavaj
        klauzule o disciplinskoj odgovornosti, godišnjem odmoru ili intenzitetu
        rada koji kopiraju Zakon o radu. Umjesto toga, definiraj komunikacijske
        kanale kao potrebne za isporuku, ne kao kontrolu prisutnosti.
      </p>
      <p>
        Ako klijent inzistira na ekskluzivnosti, razmisli je li to tržišno
        opravdano ili zapravo znak zaposlenja. Ekskluzivnost može biti normalna
        u agencijskim angažmanima, ali uz odgovarajuću cijenu i trajanje.
      </p>

      <h2 id='diversifikacija'>Diversifikacija klijenata kao zaštita</h2>
      <p>
        Čak i mali dodatni projekti pomažu pokazati da nisi ekonomski ovisan o
        jednoj osobi. Edukacija, mentori ili open-source reference mogu biti
        dokaz stručnosti izvan jednog ugovora. Ako si isključivo na jednom
        retaineru, pravno i porezno si ranjiviji — posebno u scenariju{' '}
        <strong>prikriveni radni odnos paušalac</strong> koji Porezna često veže
        uz IT i call centre.
      </p>
      <p>
        Diversifikacija ne znači raditi besplatno za deset ljudi; znači imati
        barem formalno raspoređene prihode kroz godine koje se vide u{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR-u</Link>.
      </p>

      <h2 id='postupak'>Što napraviti ako te Porezna pozove</h2>
      <p>
        Mirno prikupi dokumentaciju: ugovore, račune, dopise o isporuci,
        kalendare projekata. Ne odgovaraj sam ako nisi siguran — angažiraj
        odvjetnika ili poreznog savjetnika. Rani odgovor točan i stručan često
        smanji eskalaciju.
      </p>
      <p>
        Paralelno, razmisli o strukturalnim promjenama: dodatni klijent,
        promjena opisa usluge ili formalni prelazak u{' '}
        <Link href={vodiciHref('pausalni-obrt-vodic')}>paušalni obrt</Link> koji je
        usklađen s realnošću, ne s papirima iz prošlosti.
      </p>
      <p>
        Zaključak: <strong>prikriveni radni odnos paušalac</strong> nije etiketa
        koju želiš ignorirati. Pametnije je dizajnirati suradnju tako da i ti i
        klijent spavate mirno — uz digitalnu evidenciju u{' '}
        <Link href='/register'>Kviku</Link> da primitci i računi uvijek pričaju istu
        priču kao ugovor.
      </p>
    </GuideShell>
  );
}

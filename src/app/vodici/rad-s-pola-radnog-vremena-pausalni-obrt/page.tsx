import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'rad-s-pola-radnog-vremena-pausalni-obrt';

const META_DESC =
  'Kako koristiti rad s polovicom radnog vremena kao paušalist: rodiljni dopust, bolovanje, mirovanje obrta, HZZO procedura i doprinosi — sve na jednom mjestu.';

export const metadata: Metadata = {
  title: 'Rad s pola radnog vremena uz paušalni obrt – vodič 2026.',
  description: META_DESC,
  openGraph: {
    title: 'Rad s pola radnog vremena uz paušalni obrt – vodič 2026. | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Mogu li raditi s pola radnog vremena kao paušalist?',
    answer:
      'U određenim situacijama da — najčešće u kontekstu roditeljskih prava ili specifičnih zdravstvenih okolnosti koje uređuje HZZO. Bitno je razlikovati “rad s polovicom radnog vremena” (pravo iz sustava zdravstvenog/rodiljnog osiguranja) od mirovanja obrta.',
  },
  {
    question: 'Kako podnijeti zahtjev HZZO-u za rad s polovicom radnog vremena?',
    answer:
      'Postupak ide kroz HZZO uz propisanu dokumentaciju (ovisno o osnovi: rodiljni/roditeljski, bolovanje djeteta i sl.). U praksi se kreće s prikupljanjem potvrda i podnošenjem zahtjeva u rokovima koje HZZO propisuje, zatim se prati odluka i eventualna dopuna dokumentacije.',
  },
  {
    question: 'Koliko doprinosa plaćam kad radim pola radnog vremena?',
    answer:
      'Ovisi o tvojoj konkretnoj osnovi osiguranja i rješenju, ali se često spominje logika smanjenja (npr. 50% osnovice) tijekom korištenja prava. U praksi treba uskladiti HZZO status i upute Porezne za doprinose — zato je dobro usporediti s vodičem o doprinosima.',
  },
  {
    question: 'Mogu li izdavati račune dok sam na pola radnog vremena?',
    answer:
      'U pravilu obrt ne mora ići u mirovanje samo zato što koristiš pravo rada s polovicom radnog vremena, ali praksa ovisi o osnovi i uvjetima korištenja prava. Ako nastavljaš poslovanje, i dalje vrijede pravila izdavanja računa i vođenja KPR-a.',
  },
  {
    question: 'Koja je razlika između mirovanja obrta i rada s pola radnog vremena?',
    answer:
      'Mirovanje obrta je status obrta u registru (privremeni prekid obavljanja djelatnosti), dok je rad s polovicom radnog vremena pravo koje uređuje HZZO/zakon o rodiljnim i roditeljskim potporama ili srodni propisi. Mirovanje obično znači da ne obavljaš djelatnost, dok kod pola radnog vremena možeš nastaviti (u okvirima uvjeta).',
  },
  {
    question: 'Kolika je naknada od HZZO-a za rad s pola radnog vremena?',
    answer:
      'Visina i trajanje naknade ovise o osnovi (npr. roditeljska prava) i HZZO pravilima. Najbolje je provjeriti aktualne iznose u HZZO uputama i rješenju, jer se mijenjaju kroz godine i ovise o statusu osiguranika.',
  },
  {
    question: 'Mogu li koristiti rad s pola radnog vremena zbog bolovanja djeteta?',
    answer:
      'U praksi se određena prava vežu uz zdravstvene osnove i skrb o djetetu, ali to je strogo regulirano HZZO pravilima i dokumentacijom. Ako je to tvoj slučaj, ključan je razgovor s liječnikom i HZZO-om te praćenje propisanih rokova.',
  },
];

export default function RadSPolaRadnogVremenaPausalniObrtPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Rad s pola radnog vremena uz paušalni obrt – vodič 2026.'
      subtitle='Kako kombinirati obrt i HZZO prava: procedura, doprinosi, računi i razlika prema mirovanju obrta.'
      readingMinutes={12}
      metaDescription={META_DESC}
      articleDateModified='2026-05-11'
      toc={[
        { id: 'sto-je', label: 'Što je rad s pola radnog vremena za paušaliste' },
        { id: 'kada', label: 'Kad se može koristiti (rodiljni, roditeljski, bolovanje djeteta)' },
        { id: 'hzzo', label: 'HZZO procedura korak po korak — zahtjev, dokumenti, rokovi' },
        { id: 'doprinosi', label: 'Doprinosi pri radu s pola radnog vremena (50% osnovice)' },
        { id: 'nema-mirovanja', label: 'Obrt NE mora u mirovanje — što to znači u praksi' },
        { id: 'mirovanje-vs-pola', label: 'Mirovanje obrta vs rad s pola radnog vremena' },
        { id: 'kpr-racuni', label: 'KPR i računi dok radiš pola radnog vremena' },
        { id: 'naknada', label: 'Naknada od HZZO-a — koliko i kako dugo' },
        { id: 'greske', label: 'Česte greške i zamke' },
        { id: 'povratak', label: 'Povratak na puno radno vrijeme — procedura' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('doprinosi'), title: 'Doprinosi za paušalni obrt 2026.' },
        { href: vodiciHref('pausalni-obrt-vodic'), title: 'Paušalni obrt 2026. – kompletan vodič' },
        { href: vodiciHref('otvaranje-obrta'), title: 'Kako otvoriti paušalni obrt 2026.' },
        { href: vodiciHref('pausalni-obrt-za-kozmeticare'), title: 'Paušalni obrt za kozmetičare' },
        { href: vodiciHref('pausalni-obrt-za-fotografe'), title: 'Paušalni obrt za fotografe' },
      ]}
      howTo={{
        name: 'Kako posložiti rad s polovicom radnog vremena uz obrt',
        description:
          'Praktičan redoslijed koraka da HZZO status i obrt ostanu usklađeni.',
        steps: [
          {
            name: 'Odredi osnovu prava i dokumente',
            text: 'Najprije utvrdi koristiš li roditeljsko pravo, zdravstvenu osnovu ili drugi režim, jer dokumenti i rokovi nisu isti.',
          },
          {
            name: 'Podnesi zahtjev HZZO-u u roku',
            text: 'Predaj zahtjev i priloži dokumentaciju, zatim prati eventualne dopune i rješenje.',
          },
          {
            name: 'Uskladi doprinos(e) s novim statusom',
            text: 'Kad dobiješ rješenje, provjeri kako se doprinosi obračunavaju u tvom slučaju (često se spominje 50% osnovice) i postavi podsjetnike.',
          },
          {
            name: 'Nastavi s računima i KPR-om (ako posluješ)',
            text: 'Ako obrt nije u mirovanju i nastavljaš raditi, izdavanje računa i KPR ostaju obvezni kao i prije.',
          },
        ],
      }}
    >
      <p>
        Fraza <strong>rad pola radnog vremena paušalni obrt</strong> u praksi znači da želiš
        kombinirati status paušalnog obrta s pravom iz sustava HZZO-a (najčešće vezano uz roditeljska
        prava ili određene zdravstvene situacije). Najveća zamka je miješanje pojmova: “rad s polovicom
        radnog vremena” nije isto što i <Link href={vodiciHref('sezonski-obrt')}>mirovanje obrta</Link>.
      </p>
      <p>
        Ovaj vodič je “operativni”: kada se pravo koristi, što tipično traži HZZO, kako razmišljati o
        doprinosima i možeš li izdavati račune tijekom tog razdoblja. Za širi kontekst paušala i obveza
        kroz godinu vidi{' '}
        <Link href={vodiciHref('pausalni-obrt-vodic')} className='text-[#0d9488] hover:underline'>
          Paušalni obrt 2026.
        </Link>
        .
      </p>

      <h2 id='sto-je'>Što je rad s pola radnog vremena za paušaliste</h2>
      <p>
        Rad s polovicom radnog vremena je institut koji u praksi dolazi iz okvira rodiljnih/roditeljskih
        prava i/ili zdravstvenog osiguranja (HZZO). Ideja je da osoba u određenom razdoblju radi manje
        (npr. 50% punog vremena) uz odgovarajuću naknadu/pravni režim. Kod paušalnog obrta to otvara
        pitanja: smiješ li i dalje obavljati djelatnost, kako se gleda na doprinose i koje papire trebaš
        imati uredne.
      </p>
      <p>
        Za razliku od radnog odnosa gdje poslodavac odrađuje dio administracije, obrtnik je često sam svoj
        “HR”. Zato je dobro imati jasnu mapu: HZZO procedura, obveze prema Poreznoj i evidencije obrta
        (računi, KPR). Ovdje se fokusiramo na tipična pitanja paušalista, bez pretvaranja da je svaki slučaj
        isti.
      </p>

      <h2 id='kada'>Kad se može koristiti (rodiljni, roditeljski, bolovanje djeteta)</h2>
      <p>
        Najčešće se ova tema pojavi kad obrtnik koristi roditeljska prava (npr. nakon rodiljnog dopusta) i želi
        postupno povećavati radni angažman, ili kad postoji zdravstveni razlog zbog kojeg se traži smanjenje
        opterećenja (npr. skrb o djetetu uz medicinsku dokumentaciju). Ključ je da se ne ide “po osjećaju”,
        nego po osnovi koja je propisana — jer o osnovi ovise dokumenti, rokovi, trajanje i naknada.
      </p>
      <p>
        Ako si u fazi planiranja obrta, a misliš da će ti ovaj režim trebati u sljedećih 12 mjeseci, korisno je
        odmah imati digitalni sustav evidencije (računi i KPR) da kasnije ne tražiš papire po inboxu. Za početak
        obrta vidi{' '}
        <Link href={vodiciHref('otvaranje-obrta')} className='text-[#0d9488] hover:underline'>
          otvaranje obrta
        </Link>
        .
      </p>

      <h2 id='hzzo'>HZZO procedura korak po korak — zahtjev, dokumenti, rokovi</h2>
      <p>
        Realnost je da HZZO procedura izgleda jednostavno na papiru, a u praksi se lomi na rokovima i dopunama
        dokumentacije. Dobar pristup je napraviti checklistu:
      </p>
      <ul>
        <li>
          Identificiraj točnu osnovu prava (roditeljsko / zdravstveno / drugo).
        </li>
        <li>
          Pripremi dokumente (potvrde, obrasci, izjave) koje HZZO traži za tu osnovu.
        </li>
        <li>
          Podnesi zahtjev u propisanom roku i arhiviraj dokaz o predaji.
        </li>
        <li>
          Prati rješenje i eventualne dopune (najčešća točka pucanja).
        </li>
      </ul>
      <p>
        Najveći “time saver” je arhiva. Ako ti se vrate dokumenti na dopunu, želiš odmah izvući prethodne verzije,
        datume i potvrde. To je ista disciplina kao i kod poreznih obveza — vidi i{' '}
        <Link href={vodiciHref('rokovi-placanja')} className='text-[#0d9488] hover:underline'>
          rokovi plaćanja
        </Link>
        .
      </p>

      <h2 id='doprinosi'>Doprinosi pri radu s pola radnog vremena (50% osnovice)</h2>
      <p>
        Ovdje se često prenosi pojednostavljena rečenica “plaćaš 50% doprinosa”. Ponekad se u praksi stvarno
        pojavljuje logika smanjenja osnovice, ali to uvijek vežeš uz svoj status i rješenje. Zato je najbolji
        operativni pristup:
      </p>
      <ol>
        <li>
          Nakon rješenja HZZO-a, provjeri kako se u tvom slučaju vodi osnova osiguranja.
        </li>
        <li>
          Uskladi uplate doprinosa s pravilima za taj režim (ne pretpostavljaj iz tuđeg iskustva).
        </li>
        <li>
          Postavi podsjetnike i evidenciju uplata kao i prije (da ne uđeš u kašnjenje).
        </li>
      </ol>
      <p>
        Ako želiš “default” sliku doprinosa kod tipičnog paušala, kreni od vodiča{' '}
        <Link href={vodiciHref('doprinosi')} className='text-[#0d9488] hover:underline'>
          doprinosi za paušalni obrt
        </Link>
        , pa ga onda prilagodi svom slučaju. U praksi je najveći rizik da nastane rupa u uplati jer si mislio da
        se sve automatski prilagođava.
      </p>

      <h2 id='nema-mirovanja'>Obrt NE mora u mirovanje — što to znači u praksi</h2>
      <p>
        Česta je pretpostavka “ako sam na pola radnog vremena, obrt mora mirovati”. To nije automatski točno.
        Mirovanje obrta je zasebna registracijska odluka i često znači da djelatnost privremeno ne obavljaš.
        Kod rada s polovicom radnog vremena ideja je da obrt može nastaviti, ali u okviru uvjeta prava koje koristiš.
      </p>
      <p>
        Praktično: ako nastavljaš raditi i naplaćivati, i dalje vrijede pravila izdavanja računa, fiskalizacije (ovisno o
        tipu kupaca) i evidencija. Zato je važno da prije odluke razjasniš možeš li nastaviti s poslovanjem u punom opsegu
        ili trebaš smanjiti aktivnosti.
      </p>

      <h2 id='mirovanje-vs-pola'>Razlika: mirovanje obrta vs rad s pola radnog vremena</h2>
      <p>
        <strong>Mirovanje</strong> je “status obrta”; <strong>rad s polovicom radnog vremena</strong> je “status osiguranika/prava”
        u odnosu prema HZZO-u. To je ista vrsta razlike kao “PDV ID” vs “ulazak u PDV”: zvuči slično, ali posljedice su različite.
      </p>
      <p>
        Ako razmišljaš o mirovanju, pročitaj{' '}
        <Link href={vodiciHref('sezonski-obrt')} className='text-[#0d9488] hover:underline'>
          sezonski obrt i mirovanje
        </Link>
        . Ako razmišljaš o pola radnog vremena, fokus je na HZZO proceduri i usklađenju obveza, ne na gašenju aktivnosti.
      </p>

      <h2 id='kpr-racuni'>Kako voditi KPR i izdavati račune za vrijeme pola radnog vremena</h2>
      <p>
        Ako tijekom režima i dalje posluješ, vodiš obrt “kao i inače”:
      </p>
      <ul>
        <li>
          Račun izdaješ za svaku naplatu, s istim obveznim elementima kao i prije (vidi{' '}
          <Link href={vodiciHref('izdavanje-racuna')} className='text-[#0d9488] hover:underline'>
            izdavanje računa
          </Link>
          ).
        </li>
        <li>
          KPR upisuješ po naplaćenim računima (vidi{' '}
          <Link href={vodiciHref('kpr-knjiga-prometa')} className='text-[#0d9488] hover:underline'>
            KPR vodič
          </Link>
          ).
        </li>
        <li>
          Pratiš rokove i obveze kao i prije, samo uz dodatnu pažnju na doprinos(e) i status prava.
        </li>
      </ul>
      <p>
        Drugim riječima, <strong>rad pola radnog vremena paušalni obrt</strong> nije “pauza od papira”. Ako radiš i naplaćuješ,
        evidencija mora biti uredna, inače te sustav “uhvati” na najbanalnijem mjestu: neusklađenim primitcima ili zaboravljenim
        uplatama.
      </p>

      <h2 id='naknada'>Naknada od HZZO-a — koliko i kako dugo</h2>
      <p>
        Naknada ovisi o osnovi i pravilima koja vrijede u trenutku korištenja prava. Umjesto da se osloniš na tuđe iznose iz 2024. ili
        2025., gledaj rješenje i aktualna HZZO pravila. Za planiranje likvidnosti bitno je i trajanje: koliko mjeseci smiješ koristiti
        pravo i što se događa nakon isteka (povratak na puno radno vrijeme ili prelazak u drugi režim).
      </p>

      <h2 id='greske'>Česte greške i zamke (prekasna prijava, krivi obrasci)</h2>
      <p>
        Tipične greške koje stvaraju probleme:
      </p>
      <ul>
        <li>
          Prekasno podnošenje zahtjeva (prođe rok, pa pravo kreće kasnije ili se odbije).
        </li>
        <li>
          Nepotpuna dokumentacija (rješenje se odgađa dok se ne dopuni).
        </li>
        <li>
          Pretpostavka da se doprinosi automatski prepolove bez provjere statusa.
        </li>
        <li>
          Nastavak izdavanja računa bez usklađenja s uvjetima prava (ako prava imaju posebna ograničenja).
        </li>
      </ul>
      <p>
        Najbolja obrana je proces: checklist + arhiva + podsjetnici. Ako već koristiš alat za KPR i račune, drži sve u jednom mjestu i
        izbjegni ručno kopiranje po folderima.
      </p>

      <h2 id='povratak'>Povratak na puno radno vrijeme — procedura</h2>
      <p>
        Povratak je često jednako administrativan kao i početak: obavijest, eventualna promjena statusa i povratak standardnom režimu
        uplata. Najvažnije je da imaš jasne datume (od kada do kada) i da na temelju njih uskladiš obveze. Ako u tom trenutku planiraš
        veći rast poslovanja, podsjeti se šire slike paušala kroz{' '}
        <Link href={vodiciHref('pausalni-obrt-vodic')} className='text-[#0d9488] hover:underline'>
          kompletan vodič
        </Link>
        .
      </p>
    </GuideShell>
  );
}


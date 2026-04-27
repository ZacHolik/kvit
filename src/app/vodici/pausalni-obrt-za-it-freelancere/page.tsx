import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'pausalni-obrt-za-it-freelancere';

const META_DESC =
  'Sve što IT freelancer treba znati o paušalnom obrtu: ugovori, limiti, fiskalizacija, kada prijeći na d.o.o.';

export const metadata: Metadata = {
  title: 'Paušalni obrt za IT freelancere',
  description: META_DESC,
  openGraph: {
    title: 'Paušalni obrt za IT freelancere | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Mogu li kao IT freelancer raditi za strane klijente?',
    answer:
      'Da — paušalni obrt ne zabranjuje inozemne narudžbe. Račun mora biti ispravan, primitak evidentiran u KPR-u, a plaćanja u devizama pratiti kao ostale primitke. Provjeri valutne propise banke i dokumentaciju za prekograničnu uslugu.',
  },
  {
    question: 'Što je prikriveni radni odnos i kako ga izbjeći?',
    answer:
      'Prikriveni radni odnos nastaje kad suradnja s klijentom podsjeća na zaposlenje (stalnost, podređenost, jedan izvor prihoda). Smanjuješ rizik ugovorom o usluzi, jasnim isporukama, više klijenata i autonomijom u radu. Detalje imaš u vodiču o prikrivenom radnom odnosu.',
  },
  {
    question: 'Koliko mogu zaraditi kao IT paušalist?',
    answer:
      'Prag od 60.000 € godišnjih primitaka i dalje je ključna granica za ulazak u sustav PDV-a. Iznad toga mijenja se porezni okvir i administracija — planiraj prijelaz na vrijeme. Paušalni model i dalje pretpostavlja razrede paušalnog poreza, ne stvarni profit.',
  },
  {
    question: 'Trebam li fiskalizaciju kao IT freelancer?',
    answer:
      'Ako naplaćuješ fizičkim osobama u krajnjoj potrošnji (B2C), transakijski računi podliježu fiskalizaciji 2.0 od 2026. Za čiste B2B eRačune prema firmama rokovi su drugačiji — vidi vodič o fiskalizaciji i svoj konkretan mix klijenata.',
  },
  {
    question: 'Kada se isplati prijeći na d.o.o.?',
    answer:
      'Često kad rasteš iznad praga PDV-a, želiš zapošljavati, dijeliti vlasništvo ili ograničiti osobnu odgovornost. Trošak knjigovodstva i osnivanja d.o.o. veći je, ali donosi drugačiju fleksibilnost. Usporedba je u vodiču paušalni obrt vs d.o.o.',
  },
];

export default function PauzalniObrtZaItFreelancerePage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Paušalni obrt za IT freelancere – kompletan vodič 2026.'
      subtitle='Od ugovora do deviznih računa: kako poslovanje drži vodu i kada razmišljati o d.o.o.'
      readingMinutes={13}
      metaDescription={META_DESC}
      toc={[
        { id: 'zasto-it', label: 'Zašto IT freelanceri biraju paušalni obrt' },
        { id: 'ugovor-pausal', label: 'Ugovor o djelu vs paušalni obrt' },
        { id: 'prikriveni', label: 'Prikriveni radni odnos – rizici za IT' },
        { id: 'inozemni', label: 'Fakturiranje inozemnim klijentima (USD/EUR)' },
        { id: 'troskovi', label: 'Koji su troškovi (doprinosi, porez)' },
        { id: 'doo', label: 'Kada prijeći na d.o.o.' },
        { id: 'fiskal-it', label: 'Fiskalizacija za IT usluge (B2B iznimke)' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('pausalni-obrt-vs-doo'), title: 'Paušalni obrt vs d.o.o.' },
        { href: vodiciHref('prikriveni-radni-odnos'), title: 'Prikriveni radni odnos' },
        { href: vodiciHref('fiskalizacija-20'), title: 'Fiskalizacija 2.0 za paušaliste' },
        { href: vodiciHref('doprinosi'), title: 'Doprinosi za paušalni obrt' },
      ]}
      howTo={{
        name: 'Ispravan mjesečni ciklus IT freelancera na paušalu',
        description:
          'Kratki redoslijed obveza da devizni projekti ne poremete evidenciju.',
        steps: [
          {
            name: 'Dogovori opis usluge i rokove',
            text: 'U ugovoru jasno definiraj isporuke, cijenu i način plaćanja prije prvog računa.',
          },
          {
            name: 'Izdaj račun i evidentiraj primitak',
            text: 'Za svaku uplatu izdaj račun i upiši ga u KPR isti dan ili prema svom internom pravilu.',
          },
          {
            name: 'Prati limit primitaka',
            text: 'Mjesečno zbrajaj EUR ekvivalent da rano vidiš približavanje PDV pragu.',
          },
          {
            name: 'Uplati doprinose i porez u roku',
            text: 'Koristi podsjetnike za 15. u mjesecu i kvartalne datume paušalnog poreza.',
          },
        ],
      }}
    >
      <p>
        <strong>Paušalni obrt za IT freelancere</strong> i dalje je jedan od
        najčešćih odabira kad želiš legalno naplatiti programiranje, DevOps,
        dizajn sučelja ili savjetovanje bez punog knjigovodstva. Model je
        privlačan jer donosi predvidljive obveze prema državi, dok ti ostaje
        fleksibilnost rada od kuće ili iz inozemstva. Ipak, IT sektor često je u
        fokusu Porezne zbog ugovora o djelu i rizika prikrivenog radnog odnosa —
        zato ovaj vodič povezuje praksu s vodičima o{' '}
        <Link href={vodiciHref('prikriveni-radni-odnos')}>prikrivenom radnom odnosu</Link>,{' '}
        <Link href={vodiciHref('pausalni-obrt-vs-doo')}>usporedbi s d.o.o.</Link> i{' '}
        <Link href={vodiciHref('fiskalizacija-20')}>fiskalizaciji 2.0</Link>.
      </p>

      <h2 id='zasto-it'>Zašto IT freelanceri biraju paušalni obrt</h2>
      <p>
        Paušalni obrt skraćuje administraciju: ne vodiš poslovne knjige po
        stvarnim prihodima i rashodima u klasičnom smislu, nego plaćaš paušalni
        porez u razredima i mjesečne doprinose. Za freelancera koji naplaćuje
        sate ili projekte to znači manje papira i brži start nego kod d.o.o.
        Dodatno, alati poput <Link href='/register'>Kvika</Link> pomažu da
        računi, KPR i podsjetnici ostanu na jednom mjestu kad broj klijenata
        raste.
      </p>
      <p>
        Ograničenje je što se model ne prilagođava automatski velikim
        zaradama: kad prihod skoči, pojavljuju se pitanja PDV-a, knjigovodstva i
        često i <strong>paušalni obrt za IT freelancere</strong> više nije
        optimalan bez plana prijelaza. Zato je važno znati unaprijed što znači
        ostati ispod ili iznad praga od 60.000 € godišnjih primitaka.
      </p>

      <h2 id='ugovor-pausal'>Ugovor o djelu vs paušalni obrt</h2>
      <p>
        Mnogi klijenti u Hrvatskoj i dalje nude &quot;ugovor o djelu&quot; kao
        brzu suradnju. To može biti u redu za povremene angažmane, ali kad
        postane glavni izvor prihoda, Porezna gleda sadržaj odnosa, ne samo
        naziv dokumenta. Paušalni obrt formalizira obrt kao poslovnu jedinicu:
        izdaješ račun, vodiš KPR i prijavljuješ primitke kroz{' '}
        <Link href={vodiciHref('po-sd-obrazac')}>PO-SD</Link>.
      </p>
      <p>
        Praktična razlika je i percepcija klijenta: tvrtkama je često lakše
        platiti račun obrtnika nego fizičkoj osobi bez obrta, osobito kad trebaju
        eRačun. Ako si na paušalu, poveži se s vodičem o{' '}
        <Link href={vodiciHref('izdavanje-racuna')}>izdavanju računa</Link> da
        elementi računa budu potpuni prije prvog većeg projekta.
      </p>

      <h2 id='prikriveni'>Prikriveni radni odnos – rizici za IT</h2>
      <p>
        IT timovi često angažiraju vanjske suradnike koji rade isti stack,
        iste sastanke i isto radno vrijeme kao zaposlenici — to je tipičan
        signal za pregled prikrivenog radnog odnosa. Ako jedan klijent čini
        gotovo sav prihod, a ti koristiš njihovu opremu i redovito izvještavaš
        menadžmentu kao &quot;tim&quot;, rizik raste. Paušalni obrt sam po sebi
        ne štiti od reklasifikacije ako je sadržaj odnosa zapošljavanje.
      </p>
      <p>
        Zaštita je kombinacija: više nezavisnih klijenata, jasni projektni
        milestonei, vlastiti alati gdje je moguće i ugovor koji naglašava
        rezultat, ne radno mjesto. Detaljno kriterije i primjere obrađuje
        poseban vodič — bitno je znati da se{' '}
        <strong>paušalni obrt za IT freelancere</strong> isplati planirati uz
        pravni okvir, ne samo uz kalkulator poreza.
      </p>

      <h2 id='inozemni'>Fakturiranje inozemnim klijentima (USD/EUR)</h2>
      <p>
        Strani klijenti često plaćaju u USD ili EUR. Na računu trebaju biti jasni
        podaci obrta, opis usluge (npr. razvoj modula), iznos i valuta. Primitak
        u devizama i dalje ulazi u isti kavez godišnjih primitaka kad se
        preračuna u eure — ne smije ispasti iz KPR-a. Banka će tražiti osnovu
        plaćanja; račun i ugovor su standardni prilog.
      </p>
      <p>
        PDV iznimke za isporuke usluga inozemstvu ovise o mjestu obavljanja i
        statusu klijenta — kad nisi u PDV-u, često koristiš klasičnu napomenu o
        neobračunu PDV-a, ali kad uđeš u sustav, scenarij se mijenja. Prije
        većih godišnjih ugovora dobro je provjeriti situaciju s poreznim
        savjetnikom jer greška na inozemnom lancu skuplje košta ispravak.
      </p>

      <h2 id='troskovi'>Koji su troškovi (doprinosi, porez)</h2>
      <p>
        Redoviti troškovi uključuju mjesečne{' '}
        <Link href={vodiciHref('doprinosi')}>doprinose</Link> (mirovinsko i
        zdravstveno do uobičajenog 15. u mjesecu za prethodni mjesec) te
        kvartalni paušalni porez prema razredu. Tu nema posebne &quot;IT
        stope&quot; — obrt je obrt, a razred primitaka određuje iznos. Zato je
        praćenje ukupnih primitaka iz svih izvora ključno za predvidljivost
        cashflowa.
      </p>
      <p>
        Povremeni troškovi uključuju komoru, obrtnu naknadu ili programe koji
        podržavaju <Link href={vodiciHref('fiskalizacija-20')}>fiskalizaciju</Link>{' '}
        i eRačune. One nisu male ako ih zanemariš u budžetu, ali su i dalje
        često niže nego puni knjigovodstveni obrt velikog prometa.
      </p>

      <h2 id='doo'>Kada prijeći na d.o.o.</h2>
      <p>
        Prijelaz na d.o.o. razmotri kad rasteš oko PDV praga, trebaš
        zaposlenike, želiš ulagati u opremu kroz tvrtku ili tražiš ograničenu
        materijalnu odgovornost. d.o.o. donosi složenije godišnje obveze i
        veće troškove vođenja, ali i drugačije opcije za raspodjelu dobiti.
        Usporednu tablicu i signale za migraciju imaš u vodiču{' '}
        <Link href={vodiciHref('pausalni-obrt-vs-doo')}>paušalni obrt vs d.o.o.</Link>
      </p>
      <p>
        Prije migracije riješi otvorene račune na obrtu, arhiviraj KPR i
        dogovori knjigovođu za prvo razdoblje d.o.o. Svaka promjena pravnog
        subjekta utječe na ugovore s klijentima — planiraj obavijest i nove
        podatke za eRačun.
      </p>

      <h2 id='fiskal-it'>Fiskalizacija za IT usluge (B2B iznimke)</h2>
      <p>
        IT usluge često su B2B: firma naručuje razvoj ili održavanje. Prema
        vremenskoj crti fiskalizacije 2.0, transakcijski računi za fizičke osobe
        u krajnjoj potrošnji dolaze prije punog B2B eRačuna. Ako ipak naplaćuješ
        krajnjim korisnicima (npr. manji servisi), provjeri mora li svaki račun
        proći kroz fiskalni sustav. Za čiste B2B lance često koristiš drugačiji
        tijek do 2027., ali iznimke postoje — ne pretpostavljaj bez provjere
        svakog segmenta.
      </p>
      <p>
        Kvik kao alat pomaže držati red oko brojeva računa, KPR-a i priprema za
        obveze koje dolaze u serijama. Kombiniraj ga s individualnim savjetom
        kad ugovor postane složen ili kad uđeš u više jurisdikcija istovremeno.
      </p>
      <p>
        Zaključno, <strong>paušalni obrt za IT freelancere</strong> ostaje
        pragmatičan put za mnoge koji žele fokus na kod, a ne na papir — uz
        uvjet da se pravila o suradnji s klijentima i porezi shvate ozbiljno od
        prvog dana.
      </p>
    </GuideShell>
  );
}

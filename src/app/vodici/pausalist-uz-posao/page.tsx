import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'pausalist-uz-posao';

const META_DESC =
  'Kompletna procedura od e-Obrtnice do plaćanja doprinosa za paušaliste koji već imaju stalno zaposlenje. Rok 8 dana, duplo osiguranje i pravo na odmor.';

export const metadata: Metadata = {
  title: 'Paušalni obrt uz redovno zaposlenje 9-5',
  description: META_DESC,
  openGraph: {
    title: 'Paušalni obrt uz redovno zaposlenje 9-5 | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Mogu li imati paušalni obrt uz redovno zaposlenje?',
    answer:
      'Da — legalno je i čest model među freelancerima. Doprinosi za obrt se obračunavaju godišnje prema rješenju porezne, a ne mjesečno kao kod solo paušalista.',
  },
  {
    question: 'Koliki je rok za prijavu obrta uz zaposlenje?',
    answer:
      'RPO obrazac (M11p) moraš predati u roku od 8 dana od upisa u obrtni registar. Na obrascu označi da si već osiguran kod poslodavca.',
  },
  {
    question: 'Plaćam li duple doprinose?',
    answer:
      'Ne ako ispravno popuniš RPO obrazac. Ako označiš da si već osiguran kod poslodavca, porezna ne duplira mirovinsko osiguranje. Doprinosi za obrt plaćaju se godišnje prema rješenju.',
  },
];

export default function PausalistUzPosaoPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Paušalni obrt uz redovno zaposlenje 9-5'
      subtitle='Kompletna procedura od e-Obrtnice do plaćanja doprinosa za paušaliste koji već imaju stalno zaposlenje. Rok 8 dana, duplo osiguranje i pravo na odmor.'
      readingMinutes={14}
      metaDescription={META_DESC}
      toc={[
        { id: 'zakon', label: 'Što zakon kaže' },
        { id: 'procedura', label: 'Procedura korak po korak' },
        { id: 'porez', label: 'Porezni obračun' },
        { id: 'rizici', label: 'Rizici' },
        { id: 'savjeti', label: 'Praktični savjeti' },
        { id: 'full-time', label: 'Prijelaz na full-time' },
        { id: 'greske', label: 'Česte greške' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('doprinosi-uz-posao'), title: 'Doprinosi uz posao' },
        { href: vodiciHref('prvi-koraci-nakon-obrta'), title: 'Prvi koraci' },
        { href: vodiciHref('rpo-obrazac'), title: 'RPO obrazac' },
        { href: vodiciHref('rad-s-pola-radnog-vremena-pausalni-obrt'), title: 'Rad s polovicom' },
        { href: vodiciHref('prikriveni-radni-odnos'), title: 'Prikriveni radni odnos' },
      ]}
    >
      <p>
        Scenario: Imaš redovno zaposlenje (40h/tjedno), želiš pokrenuti freelance posao uz
        to. Je li moguće imati i obrt i puno radno vrijeme?
      </p>
      <p>
        Kratak odgovor: <strong>DA.</strong> I legalno je i čest je model među
        freelancerima, IT-evcima, konzultantima i kreativcima. Ali postoje uvjeti koje
        moraš ispoštovati i zamke u koje možeš upasti.
      </p>
      <p>
        Ovaj vodič pokriva <strong>kompletnu proceduru</strong> — od e-Obrtnice do
        plaćanja doprinosa, od RPO obrasca do godišnjeg odmora. Konkretno, korak po korak,
        s primjerima što smiješ a što ne smiješ, i kako izbjeći prikriveni radni odnos.
      </p>

      <h2 id='zakon'>Što zakon kaže — dopuštene i zabranjene kombinacije</h2>

      <h3>✅ Dopušteno (bez problema)</h3>
      <ol>
        <li>
          <strong>Stalno zaposlenje (40h/tjedno) + paušalni obrt</strong>
          <ul>
            <li>
              Možeš raditi puno radno vrijeme kod poslodavca i imati obrt za freelance
              poslove
            </li>
            <li>Doprinosi se obračunavaju godišnje (ne svaki mjesec)</li>
          </ul>
        </li>
        <li>
          <strong>Rad s polovicom radnog vremena (20h/tjedno) + paušalni obrt</strong>
          <ul>
            <li>
              Zakonom regulirano — imaš pravo na skraćeno radno vrijeme uz zadržavanje
              dijela plaće i benefita
            </li>
            <li>
              Više o tome →{' '}
              <Link href={vodiciHref('rad-s-pola-radnog-vremena-pausalni-obrt')}>
                Rad s polovicom radnog vremena
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <strong>Više zaposlenja + paušalni obrt</strong>
          <ul>
            <li>Primjer: Radiš na 2 poslodavca (svaki 20h) + imaš obrt</li>
            <li>Doprinosi se obračunavaju na ukupne primitke</li>
          </ul>
        </li>
      </ol>

      <h3>❌ Zabranjeno (rizik kazne + gubitak statusa)</h3>
      <ol>
        <li>
          <strong>Raditi za svog poslodavca preko obrta</strong>
          <ul>
            <li>
              Primjer: Radiš u marketinškoj agenciji kao zaposlenik, otvaraš obrt i
              naplaćuješ agenciji usluge marketinga
            </li>
            <li>
              To je <strong>prikriveni radni odnos</strong> — inspekcija rada može
              intervenirati
            </li>
            <li>Kazna za poslodavca + ti plaćaš porez unatrag</li>
            <li>
              Više o tome →{' '}
              <Link href={vodiciHref('prikriveni-radni-odnos')}>Prikriveni radni odnos</Link>
            </li>
          </ul>
        </li>
        <li>
          <strong>Konkurirati poslodavcu (ako imaš klauzulu o nekonkurenciji)</strong>
          <ul>
            <li>
              Provjeri ugovor o radu — ponekad ugovor zabranjuje otvaranje obrta u istoj
              branši
            </li>
            <li>Ako krši klauzulu, poslodavac može raskinuti ugovor o radu</li>
          </ul>
        </li>
      </ol>

      <h2 id='procedura'>Procedura korak po korak — kako otvoriti obrt uz zaposlenje</h2>

      <h3>KORAK 1: Otvoriti obrt (e-Obrtnica)</h3>
      <p>
        Postupak je <strong>isti kao za nezaposlene</strong>. Ne postoji poseban &quot;obrt
        uz posao&quot; — to je običan paušalni obrt.
      </p>
      <p>Otvaranje obrta preko e-Građani portala (pretinac.gov.hr):</p>
      <ol>
        <li>Prijavi se na portal s osobnom iskaznicom ili digitalnim certifikatom</li>
        <li>Odaberi uslugu &quot;e-Obrtnica&quot;</li>
        <li>Popuni obrazac: djelatnost, naziv obrta, sjedište</li>
        <li>Plati pristojbu (~20 €)</li>
        <li>Rješenje stiglo na mail za 1–2 dana</li>
      </ol>
      <p>
        Detaljna procedura otvaranja →{' '}
        <Link href={vodiciHref('otvaranje-obrta')}>Otvaranje obrta</Link>
      </p>

      <h3>KORAK 2: RPO obrazac — KRITIČNO, rok 8 dana!</h3>
      <p>
        <strong>Što prijaviti:</strong> M11p obrazac (mirovinsko osiguranje)
      </p>
      <p>
        <strong>VAŽNO:</strong> Na obrascu{' '}
        <strong>označavaš da si VEĆ osiguran kod poslodavca</strong>. To je polje koje
        većina ljudi propusti, a onda imaju problem s duplim doprinosima.
      </p>
      <p>Što se događa kad označiš &quot;već osiguran&quot;:</p>
      <ul>
        <li>Porezna te <strong>NEĆE duplirati</strong> u mirovinsko osiguranje</li>
        <li>ALI — otvara ti <strong>drugi osnov osiguranja</strong> za obrt</li>
        <li>Doprinosi za obrt se obračunavaju godišnje (ne odmah)</li>
      </ul>
      <p>
        <strong>Rok:</strong> 8 dana od upisa u obrtni registar. Kazna za kašnjenje: do
        2.650 €.
      </p>
      <p>
        Prijava se radi preko ePorezne (eporezna.gov.hr), elektronički. Detaljna uputa →{' '}
        <Link href={vodiciHref('rpo-obrazac')}>RPO obrazac</Link>
      </p>

      <h3>KORAK 3: Doprinosi — godišnje rješenje</h3>
      <p>
        <strong>Ako otvaraš obrt usred godine:</strong>
      </p>
      <ul>
        <li>
          <strong>NEMA</strong> odmah doprinosa svaki mjesec
        </li>
        <li>
          Doprinose ćeš platiti <strong>sljedeće godine</strong> po godišnjem rješenju
          porezne
        </li>
      </ul>
      <p>
        <strong>Kako se računa:</strong>
      </p>
      <ul>
        <li>Porezna ti šalje rješenje <strong>u travnju sljedeće godine</strong></li>
        <li>Obračun: razlika primitci iz obrta MINUS primitci iz zaposlenja</li>
        <li>
          Ako si zaradio <strong>više iz obrta</strong> nego iz plaće → doplaćuješ
          doprinose
        </li>
        <li>
          Ako si zaradio <strong>manje iz obrta</strong> nego iz plaće → plaćaš minimalne
          doprinose ili ništa (ovisno o razlici)
        </li>
      </ul>
      <p>Primjer:</p>
      <ul>
        <li>Plaća godišnje: 18.000 €</li>
        <li>Obrt primitci godišnje: 12.000 €</li>
        <li>
          Razlika: 12.000 − 18.000 = MINUS 6.000 € → nemaš dodatnih doprinosa za platiti
        </li>
      </ul>
      <p>
        Više o doprinosima uz zaposlenje →{' '}
        <Link href={vodiciHref('doprinosi-uz-posao')}>Doprinosi uz posao</Link>
      </p>

      <h3>KORAK 4: HZZO — duplo osiguranje (zdravstveno)</h3>
      <p>
        <strong>Zdravstveno osiguranje:</strong>
      </p>
      <ul>
        <li>Automatski pokriveno preko poslodavca</li>
        <li>
          Obrt <strong>NE mijenja</strong> tvoj status osiguranja
        </li>
        <li>Ne plaćaš duple zdravstvene doprinose</li>
      </ul>
      <p>
        <strong>Pravo na bolovanje:</strong>
      </p>
      <ul>
        <li>
          Kao <strong>zaposlenik</strong>: punih 100% naknade iz bolovanja
        </li>
        <li>
          Kao <strong>paušalist</strong> (solo): NEMAŠ pravo na bolovanje, osim ako
          prelomiš fibulu ili sličnu tešku ozljedu
        </li>
      </ul>
      <p>
        <strong>Što to znači:</strong> Ako si u radnom odnosu, tvoje bolovanje je pokriveno
        putem poslodavca. Obrt ne mijenja ništa. ALI ako daš otkaz i prijeđeš full-time na
        obrt, gubiš pravo na bolovanje.
      </p>

      <h3>KORAK 5: Pravo na odmor — godišnji i praznici</h3>
      <p>
        <strong>Godišnji odmor:</strong>
      </p>
      <ul>
        <li>
          Poslodavac ti <strong>MORA dati</strong> godišnji odmor (minimum 18 radnih dana
          godišnje prema Zakonu o radu)
        </li>
        <li>
          Obrt <strong>NE utječe</strong> na pravo na godišnji
        </li>
      </ul>
      <p>
        <strong>Tijekom godišnjeg odmora:</strong>
      </p>
      <ul>
        <li>
          <strong>Smiješ raditi</strong> na obrtu (nije zabranjeno)
        </li>
        <li>
          ALI — pripazi na ugovor s poslodavcem, neke tvrtke zabranjuju rad za druge
          tijekom godišnjeg
        </li>
      </ul>
      <p>
        <strong>Praznici:</strong>
      </p>
      <ul>
        <li>Kao zaposlenik: plaćeni dani</li>
        <li>
          Kao paušalist solo: nemaš pravo na plaćene praznike (radiš = zarađuješ, ne
          radiš = ne zarađuješ)
        </li>
      </ul>

      <h2 id='porez'>Porezni obračun — PO-SD obrazac</h2>

      <h3>Kako se obračunava porez kad imaš i plaću i obrt?</h3>
      <p>
        PO-SD obrazac traži <strong>ukupne primitke</strong> kroz godinu — iz SVIH izvora:
      </p>
      <ol>
        <li>Primitci iz zaposlenja (plaća)</li>
        <li>Primitci iz obrta (računi)</li>
      </ol>
      <p>
        <strong>Zbrajaju se</strong> → prema ukupnim primitcima određuje se paušalni
        razred.
      </p>
      <p>
        <strong>Primjer:</strong>
      </p>
      <ul>
        <li>Plaća: 1.200 €/mj × 12 = 14.400 € godišnje</li>
        <li>Obrt: 800 €/mj × 12 = 9.600 € godišnje</li>
        <li>
          <strong>Ukupno: 24.000 €</strong> → <strong>Razred II</strong> (primitci 11.161
          € – 29.080 €)
        </li>
      </ul>
      <p>Paušalni porez za Razred II: 322,92 € godišnje (plaća se tromjesečno po 80,73 €).</p>
      <p>
        Generator PO-SD obrasca →{' '}
        <Link href='/alati/po-sd'>PO-SD generator</Link>
      </p>
      <p>
        Više o razredima i porezima →{' '}
        <Link href={vodiciHref('po-sd-obrazac')}>PO-SD obrazac</Link>
      </p>

      <h2 id='rizici'>Rizici koje moraš izbjegavati</h2>

      <h3>RIZIK #1: Prikriveni radni odnos</h3>
      <p>
        <strong>Što je prikriveni radni odnos:</strong> Situacija gdje netko formalno radi
        preko obrta, ali u stvarnosti obavlja posao koji bi trebao biti radni odnos — isti
        poslodavac, iste obveze, isto radno vrijeme.
      </p>
      <p>
        <strong>Primjeri zabranjenih scenarija:</strong>
      </p>
      <ul>
        <li>
          ❌ Radiš u IT tvrtki kao zaposlenik, otvaraš obrt i naplaćuješ toj istoj tvrtki
          razvoj softvera
        </li>
        <li>
          ❌ Radiš u konzultantskoj kući kao zaposlenik, naplaćuješ im konzultantske
          usluge preko obrta
        </li>
        <li>
          ❌ Radiš u marketinškoj agenciji, naplaćuješ im kreiranje sadržaja preko obrta
        </li>
      </ul>
      <p>
        <strong>Posljedice:</strong>
      </p>
      <ul>
        <li>Inspekcija rada može intervenirati</li>
        <li>Poslodavac plaća porez i doprinose unatrag (kao da si bio zaposlen)</li>
        <li>Ti gubiš obrt ili plaćaš kaznu</li>
      </ul>
      <p>
        <strong>Primjeri dozvoljenih scenarija:</strong>
      </p>
      <ul>
        <li>
          ✅ Radiš u IT tvrtki kao zaposlenik, naplaćuješ <strong>drugim klijentima</strong>{' '}
          razvoj softvera
        </li>
        <li>
          ✅ Radiš u konzultantskoj kući, naplaćuješ <strong>drugim firmama</strong>{' '}
          konzultantske usluge
        </li>
        <li>
          ✅ Radiš u marketinškoj agenciji, naplaćuješ <strong>privatnim klijentima</strong>{' '}
          kreiranje sadržaja
        </li>
      </ul>
      <p>
        Detaljnije o prikrivenom radnom odnosu →{' '}
        <Link href={vodiciHref('prikriveni-radni-odnos')}>Prikriveni radni odnos</Link>
      </p>

      <h3>RIZIK #2: Klauzula o nekonkurenciji u ugovoru o radu</h3>
      <p>
        <strong>Provjeri ugovor s poslodavcem.</strong>
      </p>
      <p>Neke tvrtke uključuju klauzulu koja zabranjuje:</p>
      <ul>
        <li>Otvaranje obrta u istoj branši</li>
        <li>Rad za konkurentske klijente</li>
        <li>Obavljanje sličnih poslova kao kod poslodavca</li>
      </ul>
      <p>Ako krši klauzulu:</p>
      <ul>
        <li>Poslodavac može raskinuti ugovor o radu</li>
        <li>Možeš biti tužen za štetu</li>
      </ul>
      <p>
        <strong>Rješenje:</strong> Prouči ugovor PRIJE nego otvoriš obrt. Ako nisi siguran,
        konzultiraj odvjetnika.
      </p>

      <h3>RIZIK #3: Sukob interesa — rad za obrt tijekom radnog vremena</h3>
      <p>
        <strong>Problem:</strong> Poslodavac očekuje da tijekom radnog vremena (9–17h) radiš
        za njega, ne za svoj obrt.
      </p>
      <p>Ako te &quot;uhvate&quot; da radiš za obrt tijekom radnog vremena:</p>
      <ul>
        <li>
          Poslodavac može raskinuti ugovor o radu zbog kršenja radnih obveza
        </li>
        <li>
          Ne mora postojati klauzula u ugovoru — dovoljno je da ne ispunjavaš svoj posao
        </li>
      </ul>
      <p>
        <strong>Rješenje:</strong>
      </p>
      <ul>
        <li>Obrt = izvan radnog vremena (navečer, vikendom)</li>
        <li>Ne koristi poslodavčevu opremu za obrt (laptop, email, vrijeme...)</li>
        <li>Ne odgovaraj na klijente tijekom radnog vremena</li>
      </ul>

      <h2 id='savjeti'>Praktični savjeti kako balansirati oboje</h2>

      <h3>Savjet #1: Transparentnost s poslodavcem</h3>
      <p>
        Ako nemaš zabranu u ugovoru, <strong>obavijesti poslodavca</strong> da planiraš
        otvoriti obrt.
      </p>
      <p>Zašto?</p>
      <ul>
        <li>Bolje otvoreno nego da te &quot;uhvate&quot;</li>
        <li>Neki poslodavci su okej s time, čak podržavaju</li>
        <li>Izbjegavaš sumnje i napetost</li>
      </ul>
      <p>Kako obavijestiti:</p>
      <ul>
        <li>Razgovor s nadređenim</li>
        <li>Jasno objasni da obrt neće utjecati na tvoj rad</li>
        <li>Naglasi da ne planiraš raditi za konkurenciju</li>
      </ul>

      <h3>Savjet #2: Odvojeni bankovni računi</h3>
      <p>
        <strong>Obavezno imaj odvojen poslovni račun za obrt</strong> — ne miješaj primitke
        obrta s privatnom plaćom.
      </p>
      <p>Zašto?</p>
      <ul>
        <li>Lakše PO-SD popunjavanje</li>
        <li>Lakše dokazivanje poreznoj što je poslovno a što privatno</li>
        <li>Profesionalniji izgled prema klijentima</li>
      </ul>
      <p>
        Više o tome →{' '}
        <Link href={vodiciHref('bankovni-racun-pausalisti')}>
          Bankovni račun za paušaliste
        </Link>
      </p>

      <h3>Savjet #3: Početak u malim koracima</h3>
      <p>
        Ne otvori obrt i odmah daj otkaz. <strong>Testiraj vode prvo.</strong>
      </p>
      <p>Postupak:</p>
      <ol>
        <li>Otvori obrt uz zaposlenje</li>
        <li>Radi freelance projekte 3–6 mjeseci</li>
        <li>Vidi koliko stigne zaraditi, jel ima stabilne klijentele</li>
        <li>
          Ako obrt donosi <strong>više od plaće</strong> 3+ mjeseca zaredom → razmisli o
          full-time prijelazu
        </li>
      </ol>

      <h3>Savjet #4: Financijska rezerva prije full-time prijelaza</h3>
      <p>
        Ako planiš dati otkaz i prijeći na obrt full-time,{' '}
        <strong>pripremi financijsku rezervu</strong>.
      </p>
      <p>
        Preporučena rezerva: <strong>6 mjeseci troškova</strong> (3.000–5.000 € minimum)
      </p>
      <p>Zašto?</p>
      <ul>
        <li>Nemaš bolovanje ako se razboliš</li>
        <li>Nemaš plaćeni godišnji odmor</li>
        <li>Nemaš garantiranu plaću ako nemaš klijenata</li>
      </ul>

      <h2 id='full-time'>Kada prijeći na obrt full-time?</h2>

      <h3>Indikatori da si spreman</h3>
      <ol>
        <li>
          <strong>Obrt donosi više od plaće</strong> — 3+ mjeseca zaredom
        </li>
        <li>
          <strong>Stabilna klijentela</strong> — imaš 2–3 redovna klijenta koji
          garantiraju prihod
        </li>
        <li>
          <strong>Financijska rezerva</strong> — imaš 6 mjeseci troškova na računu
        </li>
        <li>
          <strong>Potencijal rasta</strong> — vidiš put do 60.000 € godišnje (limit
          paušalnog obrta)
        </li>
      </ol>

      <h3>Što se mijenja kad daš otkaz</h3>
      <p>
        <strong>Doprinosi:</strong>
      </p>
      <ul>
        <li>Više ne plaća poslodavac</li>
        <li>
          Ti plaćaš <strong>svaki mjesec</strong> 290,98 €/mj (za 2026.)
        </li>
        <li>Rok: 15. u mjesecu</li>
      </ul>
      <p>
        <strong>Bolovanje:</strong>
      </p>
      <ul>
        <li>Nemaš pravo na bolovanje (osim teške ozljede)</li>
        <li>Ako se razboliš = nema prihoda</li>
      </ul>
      <p>
        <strong>Godišnji odmor:</strong>
      </p>
      <ul>
        <li>Nemaš pravo na plaćeni godišnji</li>
        <li>Ne radiš = ne zarađuješ</li>
      </ul>
      <p>
        <strong>Sigurnost:</strong>
      </p>
      <ul>
        <li>Nemaš garantiranu plaću</li>
        <li>Mora postojati financijska disciplina</li>
      </ul>
      <p>
        Kalkulator doprinosa →{' '}
        <Link href='/alati/placanje-doprinosa'>Kalkulator doprinosa</Link>
      </p>

      <h2 id='greske'>Česte greške</h2>

      <h3>❌ &quot;Zaboravio sam RPO obrazac — prošlo je 3 mjeseca&quot;</h3>
      <p>
        <strong>Posljedica:</strong> Kazna do 2.650 € + retroaktivni gubitak zdravstvenog
        osiguranja.
      </p>
      <p>
        <strong>✅ Rješenje:</strong> Podnesi odmah, čak i nakon roka. Što prije podneseš,
        manja kazna.
      </p>

      <h3>❌ &quot;Nisam označio da sam već osiguran kod poslodavca&quot;</h3>
      <p>
        <strong>Posljedica:</strong> Porezna računa <strong>duple doprinose</strong> — i
        preko poslodavca i preko obrta. Dug se gomila.
      </p>
      <p>
        <strong>✅ Rješenje:</strong> Ispravak RPO obrasca u poreznoj odmah. Donesi dokaz
        da si zaposlen (ugovor o radu, zadnja plaćna lista).
      </p>

      <h3>❌ &quot;Radim za svog poslodavca preko obrta jer mi je ponudio bolju zaradu&quot;</h3>
      <p>
        <strong>Posljedica:</strong> Inspekcija rada + kazna + plaćanje poreza unatrag.
      </p>
      <p>
        <strong>✅ Rješenje:</strong> Nemoj. Čak i ako ti poslodavac predlaže, to je
        prikriveni radni odnos. Ako želiš bolju zaradu, pregovori o povećanju plaće, ne
        otvori obrt za isti posao.
      </p>

      <h3>❌ &quot;Nisam obavijestio poslodavca i &apos;uhvatili&apos; su me dok radim za obrt&quot;</h3>
      <p>
        <strong>Posljedica:</strong> Gubitak povjerenja, mogući otkaz, napeta atmosfera.
      </p>
      <p>
        <strong>✅ Rješenje:</strong> Transparentnost od početka. Razgovor s nadređenim
        prije nego otvoriš obrt.
      </p>

      <h3>❌ &quot;Obrt mi donosi 500 €/mj, dao sam otkaz jer mi se čini dovoljno&quot;</h3>
      <p>
        <strong>Posljedica:</strong> Nemaš rezervu, prvi mjesec bez klijenata = financijska
        kriza, moraš nazad tražiti zaposlenje.
      </p>
      <p>
        <strong>✅ Rješenje:</strong> Ne daj otkaz dok obrt ne donosi{' '}
        <strong>barem koliko plaća</strong> 3+ mjeseca zaredom + imaš financijsku rezervu.
      </p>

      <h2 id='alat'>Korisni alat</h2>
      <p>
        Izračunaj koliko bi ti bili doprinosi ako prijeđeš na obrt full-time:{' '}
        <Link href='/alati/placanje-doprinosa' className='text-[#0d9488] hover:underline'>
          Kalkulator doprinosa
        </Link>
      </p>
      <p>
        Kvik automatski vodi KPR i PO-SD za tebe — fokusiraj se na posao, ne na
        papirologiju. Kreni besplatno:{' '}
        <Link href='/register' className='text-[#0d9488] hover:underline'>
          Isprobaj Kvik
        </Link>
      </p>
    </GuideShell>
  );
}

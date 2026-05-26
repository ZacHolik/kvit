import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'pausalist-fakturira-pausalist';

const META_DESC =
  'Vodič za izdavanje računa između dva paušalna obrta: B2B pravila, fiskalizacija, eRačuni, obvezni elementi i KPR evidentiranje.';

export const metadata: Metadata = {
  title: 'Kako paušalac fakturira paušalcu',
  description: META_DESC,
  openGraph: {
    title: 'Kako paušalac fakturira paušalcu | Kvik',
    description:
      'Kompletna procedura izdavanja računa između paušalista — B2B transakcije, rokovi, eRačuni i česte greške.',
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Je li račun između dva paušalista B2B ili B2C transakcija?',
    answer:
      'B2B. Oba subjekta su poslovni subjekti upisani u Obrtni registar s vlastitim OIB-om. B2C je samo kad izdaješ račun fizičkoj osobi bez obrta.',
  },
  {
    question: 'Mora li se fiskalizirati račun paušalist → paušalist?',
    answer:
      'Gotovina ili kartice: da (F1.0, JIR i ZKI). Uplata na IBAN: ne, do 31.12.2026. izdaješ običan PDF račun. Od 1.1.2027. B2B ide preko eRačuna (XML, MIKROeRACUN) — to nije fiskalizacija.',
  },
  {
    question: 'Mora li kupac (paušalist B) upisati primljeni račun u KPR?',
    answer:
      'Ne. KPR je knjiga primitaka (prihoda). Primljeni račun je trošak, a paušalisti ne vode troškove za Poreznu. U KPR upisuje samo izdavatelj računa.',
  },
  {
    question: 'Kada dolaze eRačuni između paušalista?',
    answer:
      'Zaprimanje eRačuna obvezno od 1.1.2026. Izdavanje eRačuna prema drugim poslovnim subjektima obvezno od 1.1.2027.',
  },
];

const tableWrap =
  'my-6 overflow-x-auto rounded-xl border border-[#1f2a28] bg-[#111716] text-sm';

const linkClass = 'text-[#0d9488] hover:underline';

export default function PausalistFakturiraPausalistPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Kako paušalac fakturira paušalcu'
      subtitle='B2B transakcija između dva paušalna obrta: fiskalizacija, obvezni elementi računa, KPR i eRačuni od 2026./2027.'
      readingMinutes={14}
      metaDescription={META_DESC}
      articleDateModified='2026-05-26'
      toc={[
        { id: 'b2b-b2c', label: 'B2B ili B2C?' },
        { id: 'fiskalizacija', label: 'Fiskalizacija računa' },
        { id: 'elementi', label: 'Obvezni elementi računa' },
        { id: 'kpr', label: 'Upis u KPR' },
        { id: 'eracuni', label: 'eRačuni 2026./2027.' },
        { id: 'rok-placanja', label: 'Rok plaćanja' },
        { id: 'greske', label: 'Česte greške' },
        { id: 'sazetak', label: 'Sažetak po periodima' },
        { id: 'cta', label: 'Kvik i KPR generator' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('izdavanje-racuna'), title: 'Izdavanje računa' },
        { href: vodiciHref('kpr-knjiga-prometa'), title: 'KPR knjiga prometa' },
        { href: vodiciHref('fiskalizacija-20'), title: 'Fiskalizacija 2.0' },
        {
          href: vodiciHref('fizicke-osobe-placaju-na-racun'),
          title: 'Fizičke osobe na račun',
        },
        { href: vodiciHref('pausalni-obrt-vodic'), title: 'Paušalni obrt vodič' },
      ]}
    >
      <p>
        <strong>Scenario:</strong> Fotograf (paušalni obrt) angažira dizajnera (također
        paušalni obrt) za obradu slika. Kako pravilno izdati račun između dva paušalista?
      </p>
      <p>
        Mnogi paušalisti misle da transakcije između njih nisu &quot;prave&quot; poslovne
        transakcije ili da ne trebaju izdavati račune. To je netočno. Paušalist koji izdaje
        račun drugom paušalistu mora poštivati ista pravila kao i kad izdaje račun bilo kojoj
        drugoj firmi — s jednom ključnom razlikom: do 1.1.2027. to{' '}
        <strong>NIJE fiskalizacija</strong> (nema JIR i ZKI).
      </p>
      <p>
        Ovaj vodič pokriva: je li to B2B ili B2C, mora li se fiskalizirati, koji elementi
        moraju biti na računu, kako se upisuje u KPR, i što se mijenja 1.1.2027. s dolaskom
        eRačuna.
      </p>

      <h2 id='b2b-b2c'>Je li to B2B ili B2C transakcija?</h2>
      <p>
        <strong>Odgovor: B2B (business to business)</strong>
      </p>
      <p>
        Oba subjekta su poslovni subjekti upisani u Obrtni registar s vlastitim OIB-om. To
        znači:
      </p>
      <ul>
        <li>Paušalist A (izdavatelj) = poslovni subjekt</li>
        <li>Paušalist B (kupac) = poslovni subjekt</li>
        <li>
          <strong>B2B transakcija</strong>
        </li>
      </ul>
      <p>
        <strong>NIJE B2C</strong> — B2C (business to consumer) je transakcija prema fizičkoj
        osobi koja <strong>NEMA</strong> obrt, nema OIB poslovnog subjekta, kupuje kao
        privatna osoba.
      </p>
      <p>
        <strong>Primjer B2B (paušalist → paušalist):</strong>
      </p>
      <ul>
        <li>Fotograf angažira paušalnog dizajnera za obradu slika</li>
        <li>Frizer kupuje kozmetičke proizvode od paušalnog trgovca</li>
        <li>IT freelancer angažira paušalnog copywritera za sadržaj web stranice</li>
      </ul>
      <p>
        <strong>Primjer B2C (paušalist → fizička osoba):</strong>
      </p>
      <ul>
        <li>Fotograf naplaćuje snimanje vjenčanja mladencima (fizičke osobe bez obrta)</li>
        <li>Frizer naplaćuje šišanje klijentu (fizička osoba)</li>
      </ul>
      <p>
        Više o razlici B2B vs B2C →{' '}
        <Link href={vodiciHref('fizicke-osobe-placaju-na-racun')} className={linkClass}>
          Fizičke osobe plaćaju na račun
        </Link>
      </p>

      <h2 id='fiskalizacija'>Mora li se fiskalizirati račun paušalist→paušalist?</h2>
      <p>
        <strong>KRATKI ODGOVOR:</strong>
      </p>
      <ul>
        <li>Gotovina/kartice: <strong>DA</strong> (fiskalizacija F1.0)</li>
        <li>
          Transakcijski račun (IBAN uplata): <strong>NE</strong> (do 1.1.2027.)
        </li>
      </ul>

      <h3>Do 31.12.2026. — Trenutno stanje</h3>
      <p>
        <strong>AKO PLAĆANJE IDE GOTOVINOM ili KARTICAMA:</strong>
      </p>
      <ul>
        <li>✅ Račun mora biti <strong>fiskaliziran</strong> (F1.0)</li>
        <li>Mora imati JIR i ZKI kod</li>
        <li>Mora biti izdan preko fiskalne blagajne (hardware ili software)</li>
        <li>FINA certifikat potreban</li>
      </ul>
      <p>
        <strong>AKO PLAĆANJE IDE NA TRANSAKCIJSKI RAČUN (IBAN):</strong>
      </p>
      <ul>
        <li>❌ Račun <strong>NE MORA biti fiskaliziran</strong></li>
        <li>Izdaješ običan PDF ili Word račun</li>
        <li>Ne treba JIR i ZKI</li>
        <li>Ne treba FINA certifikat</li>
        <li>Račun mora imati sve obvezne elemente (vidi niže)</li>
      </ul>

      <h3>Od 1.1.2027. — Dolaze eRačuni</h3>
      <p>
        <strong>SVE B2B transakcije (uključujući paušalist→paušalist) moraju biti
        eRačuni:</strong>
      </p>
      <ul>
        <li>eRačun = elektronički račun u XML formatu</li>
        <li>
          Šalje se preko sustava <strong>MIKROeRACUN</strong> (besplatno za paušaliste)
        </li>
        <li>
          <strong>NIJE fiskalizacija</strong> — eRačun NEMA JIR i ZKI kodove
        </li>
        <li>
          <strong>NIJE potreban FINA certifikat</strong> za eRačune (to je samo za
          fiskalizaciju B2C)
        </li>
      </ul>
      <p>
        <strong>Razlika fiskalizacija vs eRačun:</strong>
      </p>
      <div className={tableWrap}>
        <table className='min-w-full border-collapse text-left'>
          <thead>
            <tr className='border-b border-[#1f2a28] text-[#94a3a0]'>
              <th className='px-3 py-2 font-medium'>Aspekt</th>
              <th className='px-3 py-2 font-medium'>Fiskalizacija (B2C)</th>
              <th className='px-3 py-2 font-medium'>eRačun (B2B)</th>
            </tr>
          </thead>
          <tbody className='text-[#d5dfdd]'>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>Primjenjuje se</td>
              <td className='px-3 py-2'>Fizičke osobe (građani)</td>
              <td className='px-3 py-2'>Poslovni subjekti (firme, obrti)</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>JIR i ZKI</td>
              <td className='px-3 py-2'>✅ Obvezno</td>
              <td className='px-3 py-2'>❌ Ne postoji</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>FINA certifikat</td>
              <td className='px-3 py-2'>✅ Potreban</td>
              <td className='px-3 py-2'>❌ Nije potreban</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>Sustav</td>
              <td className='px-3 py-2'>Fiskalna blagajna</td>
              <td className='px-3 py-2'>MIKROeRACUN (ePorezna)</td>
            </tr>
            <tr>
              <td className='px-3 py-2'>Format</td>
              <td className='px-3 py-2'>PDF s JIR/ZKI</td>
              <td className='px-3 py-2'>XML strukturirani</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Više o eRačunima →{' '}
        <Link href={vodiciHref('fiskalizacija-20')} className={linkClass}>
          Fiskalizacija 2.0
        </Link>
      </p>

      <h2 id='elementi'>Obvezni elementi računa paušalist→paušalist</h2>

      <h3>Do 1.1.2027. (obični PDF/Word račun)</h3>
      <p>
        <strong>OBVEZNI ELEMENTI:</strong>
      </p>
      <ol>
        <li>
          <strong>Broj računa</strong> (npr. 1/PP1/2026)
        </li>
        <li>
          <strong>Datum izdavanja</strong> (npr. 15.05.2026.)
        </li>
        <li>
          <strong>OIB izdavatelja</strong> (paušalist A — TI)
        </li>
        <li>
          <strong>Naziv izdavatelja</strong> (tvoj obrt, npr. &quot;FOTO STUDIO, obrt za
          fotografiju, vl. Marko Horvat&quot;)
        </li>
        <li>
          <strong>Adresa izdavatelja</strong>
        </li>
        <li>
          <strong>OIB kupca</strong> (paušalist B) ← <strong>OBAVEZNO</strong>
        </li>
        <li>
          <strong>Naziv kupca</strong> (obrt kupca, npr. &quot;DIZAJN PRO, obrt za grafički
          dizajn, vl. Ana Kovač&quot;)
        </li>
        <li>
          <strong>Adresa kupca</strong>
        </li>
        <li>
          <strong>Opis usluge/robe</strong> (npr. &quot;Obrada 50 fotografija za web
          stranicu&quot;)
        </li>
        <li>
          <strong>Količina</strong> (npr. 50 kom)
        </li>
        <li>
          <strong>Jedinična cijena</strong> (npr. 10,00 EUR)
        </li>
        <li>
          <strong>Ukupna cijena</strong> (npr. 500,00 EUR)
        </li>
        <li>
          <strong>Napomena:</strong> &quot;Obveznik nije u sustavu PDV-a, PDV nije obračunat
          temeljem čl. 90. Zakona o PDV-u.&quot;
        </li>
      </ol>
      <p>
        <strong>PRIMJER RAČUNA:</strong>
      </p>
      <pre className='my-4 overflow-x-auto rounded-xl border border-[#1f2a28] bg-[#111716] p-4 text-sm text-[#d5dfdd]'>
        {`FOTO STUDIO, obrt za fotografiju
Vlasnik: Marko Horvat
OIB: 12345678901
Adresa: Ilica 123, 10000 Zagreb
Račun br. 5/PP1/2026
Datum: 15.05.2026.

KUPAC:
DIZAJN PRO, obrt za grafički dizajn
Vlasnik: Ana Kovač
OIB: 98765432109
Adresa: Trg bana Jelačića 5, 10000 Zagreb

Usluga: Obrada 50 fotografija za web stranicu
Količina: 50 kom
Jedinična cijena: 10,00 EUR
Ukupno: 500,00 EUR

Napomena: Obveznik nije u sustavu PDV-a, PDV nije obračunat temeljem čl. 90. Zakona o PDV-u.

Potpis: ___________________`}
      </pre>
      <p>
        <strong>ZAŠTO JE OIB KUPCA OBAVEZAN?</strong>
      </p>
      <ul>
        <li>Bez OIB-a kupca, račun nije valjan za poslovnu transakciju</li>
        <li>Porezna može odbiti račun kao dokaz primitka/troška</li>
        <li>
          Kupac (paušalist B) ne može dokazati da je primio račun od poslovnog subjekta
        </li>
      </ul>
      <p>
        Više o obveznim elementima računa →{' '}
        <Link href={vodiciHref('izdavanje-racuna')} className={linkClass}>
          Izdavanje računa
        </Link>
      </p>

      <h3>Od 1.1.2027. (eRačun)</h3>
      <p>
        <strong>Svi gore navedeni elementi + eRačun format:</strong>
      </p>
      <ul>
        <li>XML strukturirani dokument</li>
        <li>
          Šalje se preko MIKROeRACUN sustava (mikroeracun.gov.hr)
        </li>
        <li>Kupac (paušalist B) zaprimlja eRačun u svoj MIKROeRACUN inbox</li>
        <li>
          <strong>Do 20. u sljedećem mjesecu</strong> kupac mora označiti eRačun kao
          &quot;Prihvaćen&quot; ili &quot;Odbijen&quot;
        </li>
      </ul>
      <p>
        <strong>Razlika PDF vs eRačun:</strong>
      </p>
      <ul>
        <li>PDF račun = čitljiv ljudima, ali ne strojno</li>
        <li>eRačun = strojno čitljiv, automatski se učitava u sustave</li>
      </ul>

      <h2 id='kpr'>Kako se upisuje u KPR (Knjiga prometa)?</h2>
      <p>
        <strong>Paušalist A (izdavatelj računa):</strong>
      </p>
      <ul>
        <li>✅ <strong>UPISUJE</strong> račun u svoju KPR</li>
        <li>Datum: kad je račun izdan</li>
        <li>Iznos: 500,00 EUR (ukupna cijena)</li>
        <li>Kupac: OIB i naziv paušalista B</li>
      </ul>
      <p>
        <strong>Paušalist B (kupac, primatelj računa):</strong>
      </p>
      <ul>
        <li>❌ <strong>NE UPISUJE</strong> račun u KPR</li>
        <li>
          Razlog: Primljeni račun je <strong>trošak</strong> za paušalista B, a paušalisti{' '}
          <strong>nemaju troškove</strong> u poreznom smislu
        </li>
        <li>KPR se vodi SAMO za <strong>primitke</strong> (prihode), ne za troškove</li>
      </ul>
      <p>
        <strong>ZAŠTO PAUŠALISTI NEMAJU TROŠKOVE?</strong>
      </p>
      <p>
        Paušalno oporezivanje znači da Porezna utvrđuje porez na temelju{' '}
        <strong>primitaka</strong>, ne na temelju dobiti (primitci - troškovi). Zbog toga
        paušalisti ne vode evidenciju troškova i ne mogu odbijati troškove od primitaka.
      </p>
      <p>
        Ako paušalist B želi voditi evidenciju svojih troškova radi pregleda poslovanja, može
        to raditi u privatnoj Excel tablici, ali to <strong>NIJE</strong> zakonska obveza i ne
        ide u KPR.
      </p>
      <p>
        Više o KPR knjizi →{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')} className={linkClass}>
          KPR knjiga prometa
        </Link>
      </p>

      <h2 id='eracuni'>eRačuni između paušalista — što dolazi 1.1.2026. i 1.1.2027.?</h2>

      <h3>Od 1.1.2026. — Obveza ZAPRIMANJA eRačuna</h3>
      <p>
        <strong>Što to znači:</strong>
      </p>
      <p>
        Ako paušalist A izdaje eRačun paušalistu B, paušalist B mora moći{' '}
        <strong>zaprimiti</strong> taj eRačun.
      </p>
      <p>
        <strong>Kako se pripremiti:</strong>
      </p>
      <ol>
        <li>
          Registriraj se na <strong>MIKROeRACUN</strong> aplikaciju (besplatno)
        </li>
        <li>MIKROeRACUN se nalazi unutar ePorezne (eporezna.gov.hr)</li>
        <li>
          Prijavi <strong>adresu za zaprimanje eRačuna</strong> u sustav AMS (Adresni
          menadžment sustav)
        </li>
      </ol>
      <p>
        <strong>Što ako paušalist A još ne izdaje eRačune?</strong>
      </p>
      <ul>
        <li>
          Nema problema — do 1.1.2027. paušalist A može izdavati obične PDF račune
        </li>
        <li>
          Ali mora biti <strong>spreman primati</strong> eRačune od drugih (dobavljača,
          partnera)
        </li>
      </ul>

      <h3>Od 1.1.2027. — Obveza IZDAVANJA eRačuna</h3>
      <p>
        <strong>Što to znači:</strong>
      </p>
      <p>
        Svi paušalisti moraju <strong>izdavati eRačune</strong> prema drugim poslovnim
        subjektima (uključujući druge paušaliste).
      </p>
      <p>
        <strong>Kako se pripremiti:</strong>
      </p>
      <ol>
        <li>Koristi MIKROeRACUN aplikaciju (besplatno) ILI</li>
        <li>Koristi komercijalno rješenje (Kvik, Parra, Fiskal...)</li>
        <li>Izdani eRačun šalješ preko sustava</li>
        <li>Kupac (drugi paušalist) prima eRačun u svoj MIKROeRACUN inbox</li>
      </ol>
      <p>
        <strong>Primjer toka eRačuna (od 1.1.2027.):</strong>
      </p>
      <ol>
        <li>Fotograf izdaje eRačun dizajneru preko Kvika</li>
        <li>Kvik šalje eRačun u XML formatu prema AMS sustavu</li>
        <li>AMS prosljeđuje eRačun u dizajnerov MIKROeRACUN inbox</li>
        <li>Dizajner vidi eRačun u svom MIKROeRACUN aplikaciji</li>
        <li>
          Dizajner označava eRačun kao &quot;Prihvaćen&quot; do 20. u sljedećem mjesecu
        </li>
        <li>
          Ako dizajner ne označi ništa, eRačun automatski postaje &quot;Prihvaćen&quot; nakon
          20.
        </li>
      </ol>
      <p>
        Više o MIKROeRACUN sustavu →{' '}
        <Link href={`${vodiciHref('fiskalizacija-20')}#mikroeracun`} className={linkClass}>
          MIKROeRACUN
        </Link>
      </p>

      <h2 id='rok-placanja'>Rok plaćanja između paušalista</h2>
      <p>
        <strong>Zakon NE propisuje rok plaćanja</strong> između dva paušalista (ili bilo koja
        dva poslovna subjekta).
      </p>
      <p>
        Rok plaćanja je <strong>ugovorna stvar</strong> — dogovarate se:
      </p>
      <ul>
        <li>Plaćanje odmah (avant-avant)</li>
        <li>Plaćanje u roku 7, 15, 30 dana</li>
        <li>Plaćanje nakon izvršene usluge</li>
      </ul>
      <p>
        <strong>Preporuka:</strong>
      </p>
      <ul>
        <li>Za manje iznose: plaćanje odmah ili u roku 7 dana</li>
        <li>Za veće projekte: može 30 dana, ali dogovori se unaprijed</li>
      </ul>
      <p>
        <strong>Što ako paušalist B (kupac) ne plati u dogovorenom roku?</strong>
      </p>
      <ul>
        <li>Imaš pravo tražiti plaćanje + zatezne kamate</li>
        <li>Možeš pisati opomenu</li>
        <li>Ako ne pomogne, možeš pokrenuti ovršni postupak (mala porezna tužba)</li>
      </ul>

      <h2 id='greske'>Česte greške</h2>

      <h3>❌ &quot;Nisam stavio OIB kupca jer smo oba paušalisti&quot;</h3>
      <p>
        <strong>Problem:</strong> Račun bez OIB-a kupca nije valjan za B2B transakciju. Kupac
        ne može dokazati da je primio račun od poslovnog subjekta.
      </p>
      <p>
        <strong>Rješenje:</strong> UVIJEK stavi OIB kupca kad izdaješ račun drugom paušalistu
        (ili bilo kojoj firmi).
      </p>

      <h3>❌ &quot;Fiskalizirao sam račun jer je išla uplata na IBAN&quot;</h3>
      <p>
        <strong>Problem:</strong> B2B transakcije (paušalist→paušalist) NE fiskaliziraju se do
        1.1.2027. Fiskalizacija (JIR, ZKI) je samo za B2C (fizičke osobe).
      </p>
      <p>
        <strong>Rješenje:</strong> Ako izdaješ račun drugom paušalistu na IBAN, to je obični
        PDF račun do 1.1.2027. Od 1.1.2027. to je eRačun (ali i dalje NIJE fiskalizacija).
      </p>

      <h3>❌ &quot;Nisam izdao račun jer smo oba paušalisti — dogovorili smo se usmeno&quot;</h3>
      <p>
        <strong>Problem:</strong> Bez računa nemaš dokaz primitka. Porezna može tražiti
        evidenciju SVIH primitaka u KPR. Ako imaš primitak bez računa, rizikuješ kaznu.
      </p>
      <p>
        <strong>Rješenje:</strong> Izdaj račun za SVAKU transakciju — bez obzira izdaješ li
        ga fizičkoj osobi, paušalistu ili d.o.o.
      </p>

      <h3>❌ &quot;Upisao sam primljeni račun (trošak) u KPR&quot;</h3>
      <p>
        <strong>Problem:</strong> KPR je knjiga <strong>primitaka</strong> (prihoda), ne
        troškova. Paušalisti ne vode evidenciju troškova za Poreznu.
      </p>
      <p>
        <strong>Rješenje:</strong> U KPR upisuješ SAMO račune koje si <strong>izdao</strong>{' '}
        (primitci), ne račune koje si <strong>primio</strong> (troškovi).
      </p>

      <h3>
        ❌ &quot;Mislio sam da eRačuni dolaze tek 2027. — nisam se pripremio za zaprimanje&quot;
      </h3>
      <p>
        <strong>Problem:</strong> <strong>Zaprimanje</strong> eRačuna dolazi 1.1.2026. (moraš
        biti spreman primati). <strong>Izdavanje</strong> eRačuna dolazi 1.1.2027.
      </p>
      <p>
        <strong>Rješenje:</strong> Registriraj se na MIKROeRACUN do kraja 2025. kako bi mogao
        zaprimati eRačune od dobavljača.
      </p>

      <h2 id='sazetak'>Tablica — Sažetak po periodima</h2>
      <div className={tableWrap}>
        <table className='min-w-full border-collapse text-left'>
          <thead>
            <tr className='border-b border-[#1f2a28] text-[#94a3a0]'>
              <th className='px-3 py-2 font-medium'>Period</th>
              <th className='px-3 py-2 font-medium'>Gotovina/kartice</th>
              <th className='px-3 py-2 font-medium'>Transakcijski račun (IBAN)</th>
              <th className='px-3 py-2 font-medium'>Obveze</th>
            </tr>
          </thead>
          <tbody className='text-[#d5dfdd]'>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>Do 31.12.2025.</strong>
              </td>
              <td className='px-3 py-2'>Fiskalizacija F1.0 (JIR, ZKI)</td>
              <td className='px-3 py-2'>Obični PDF/Word račun</td>
              <td className='px-3 py-2'>Nema dodatnih obveza</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>1.1.2026. - 31.12.2026.</strong>
              </td>
              <td className='px-3 py-2'>Fiskalizacija F1.0 (JIR, ZKI)</td>
              <td className='px-3 py-2'>Obični PDF/Word račun</td>
              <td className='px-3 py-2'>
                <strong>Zaprimanje</strong> eRačuna obvezno
              </td>
            </tr>
            <tr>
              <td className='px-3 py-2'>
                <strong>Od 1.1.2027.</strong>
              </td>
              <td className='px-3 py-2'>Fiskalizacija F1.0 (JIR, ZKI)</td>
              <td className='px-3 py-2'>
                <strong>eRačun</strong> (XML, MIKROeRACUN)
              </td>
              <td className='px-3 py-2'>
                <strong>Izdavanje</strong> eRačuna obvezno
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id='cta'>Kvik automatski generira račune između paušalista</h2>
      <p>
        Kvik automatski generira sve obvezne elemente računa — uključujući OIB kupca i
        napomenu PDV:
      </p>
      <p>
        <Link href='/register' className={linkClass}>
          Isprobaj Kvik besplatno
        </Link>
      </p>
      <p>Generator KPR knjige s automatskim upisom svih izdanih računa:</p>
      <p>
        <Link href={vodiciHref('kpr-online-generator')} className={linkClass}>
          KPR generator
        </Link>
      </p>
      <div className='my-6 flex flex-col gap-3 sm:flex-row sm:items-center'>
        <Link href='/register' className='btn-cta-primary px-5 py-3 text-base'>
          Isprobaj Kvik besplatno →
        </Link>
        <Link
          href={vodiciHref('kpr-online-generator')}
          className='inline-flex items-center justify-center rounded-lg border border-[#0d9488] px-5 py-3 font-semibold text-[#0d9488] transition hover:bg-[#0d9488]/10'
        >
          KPR generator
        </Link>
      </div>
    </GuideShell>
  );
}

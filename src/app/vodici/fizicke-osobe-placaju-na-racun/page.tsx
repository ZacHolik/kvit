import type { Metadata } from 'next';

import { buildVodicMetadata } from '@/lib/og-metadata';
import Link from 'next/link';

import { vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'fizicke-osobe-placaju-na-racun';

const META_DESC =
  'B2C scenarij: paušalist izdaje račun fizičkoj osobi koja plaća na transakcijski račun. Fiskalizacija od 1.1.2026., JIR, ZKI i što je obvezno.';

export const metadata: Metadata = buildVodicMetadata(
  SLUG,
  'Kada fizičke osobe plaćaju na račun obrta',
  META_DESC,
  'Kada fizičke osobe plaćaju na račun obrta | Kvik',
);

const faq = [
  {
    question: 'Moram li fiskalizirati račun kad fizička osoba plaća na račun?',
    answer:
      'Do 31.12.2025. transakcijski račun (uplata na IBAN) prema fizičkoj osobi nije morao biti fiskaliziran. Od 1.1.2026. sve transakcije prema fizičkim osobama moraju biti fiskalizirane — uključujući i IBAN uplate.',
  },
  {
    question: 'Trebam li JIR i ZKI na računu za uplatu na transakcijski račun?',
    answer:
      'Od 1.1.2026. da — fiskalizirani B2C račun mora imati JIR (od Porezne pri fiskalizaciji) i ZKI (generira se iz FINA certifikata), uz datum i vrijeme izdavanja, oznaku poslovnog prostora i ostale obvezne elemente.',
  },
  {
    question: 'Kako upisati uplatu s računa u KPR?',
    answer:
      'U KPR se upisuje naplaćeni račun — bezgotovinski primitak (uplata na IBAN) ide u odgovarajuću kolonu. Vidi vodič o KPR knjizi prometa.',
  },
];

const tableWrap =
  'my-6 overflow-x-auto rounded-xl border border-[#1f2a28] bg-[#111716] text-sm';

const linkClass = 'text-[#0d9488] hover:underline';

export default function FizickeOsobePlacajuNaRacunPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Kada fizičke osobe plaćaju na račun obrta'
      subtitle='B2C scenarij: paušalist izdaje račun fizičkoj osobi koja plaća na transakcijski račun. Fiskalizacija od 1.1.2026., JIR, ZKI i što je obvezno.'
      readingMinutes={12}
      metaDescription={META_DESC}
      articleDateModified='2026-05-26'
      toc={[
        { id: 'b2c', label: 'Što je B2C transakcija?' },
        { id: 'kada-fiskalizirati', label: 'Kada moraš fiskalizirati?' },
        { id: 'sadrzaj-racuna', label: 'Što treba račun imati?' },
        { id: 'fina-certifikat', label: 'FINA certifikat' },
        { id: 'interni-akt', label: 'Interni akt' },
        { id: 'b2c-vs-b2b', label: 'B2C vs B2B' },
        { id: 'greske', label: 'Česte greške' },
        { id: 'cta', label: 'Kvik automatski fiskalizira' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('fiskalizacija-20'), title: 'Fiskalizacija 2.0' },
        { href: vodiciHref('izdavanje-racuna-vodic'), title: 'Izdavanje računa' },
        { href: vodiciHref('usporedba-fiskalizacija-1-2'), title: 'Fiskalizacija 1.0 vs 2.0' },
        { href: vodiciHref('kpr-knjiga-prometa'), title: 'KPR knjiga prometa' },
        { href: vodiciHref('fina-certifikat-fiskalizacija'), title: 'FINA certifikat' },
      ]}
    >
      <p>
        <strong>B2C scenarij</strong> (business to consumer) znači da ti kao paušalist
        izdaješ račun <strong>fizičkoj osobi</strong> koja ne posluje — privatna osoba,
        krajnji korisnik. Nema OIB-a tvrtke, nema d.o.o.-a na računu: mladenci, klijent u
        salonu, netko tko naručuje logotip za osobnu upotrebu.
      </p>
      <p>
        Do <strong>31.12.2025.</strong>, ako je fizička osoba plaćala na IBAN (bankovni
        prijenos), račun <strong>nije morao</strong> biti fiskaliziran. Od{' '}
        <strong>1.1.2026.</strong>, <strong>sve transakcije prema fizičkim osobama moraju
        biti fiskalizirane</strong> — uključujući i one plaćene na IBAN. To je najveća
        promjena za freelancere, fotografe, frizere i sve koji su do sada slali “običan”
        PDF račun i čekali uplatu.
      </p>
      <p>
        Ovaj vodič pokriva: što je B2C scenarij, kada moraš fiskalizirati, što treba račun
        imati (JIR, ZKI), i kako se to razlikuje od B2B (firma prema firmi). Ako želiš
        širi kontekst, pogledaj i{' '}
        <Link href={vodiciHref('usporedba-fiskalizacija-1-2')} className={linkClass}>
          usporedbu fiskalizacije 1.0 vs 2.0
        </Link>
        .
      </p>

      <h2 id='b2c'>Što je B2C transakcija?</h2>
      <p>
        <strong>B2C = Business to Consumer</strong> = paušalist naplaćuje uslugu ili robu{' '}
        <strong>fizičkoj osobi</strong> koja je krajnji korisnik (ne posluje).
      </p>
      <p>
        <strong>Primjeri B2C:</strong>
      </p>
      <ul>
        <li>Fotograf naplaćuje snimanje vjenčanja mladencima (fizičke osobe)</li>
        <li>Frizer naplaćuje šišanje klijentu (fizička osoba)</li>
        <li>Freelancer naplaćuje izradu logotipa privatnoj osobi</li>
        <li>Web shop prodaje majice fizičkim osobama</li>
      </ul>
      <p>
        <strong>Primjeri B2B (ovo NIJE B2C):</strong>
      </p>
      <ul>
        <li>IT freelancer naplaćuje razvoj softvera firmi d.o.o.</li>
        <li>Konzultant naplaćuje savjetovanje obrtu</li>
        <li>Fotograf naplaćuje korporativnu fotku agenciji AgencyXYZ d.o.o.</li>
      </ul>
      <p>
        <strong>Ključna razlika:</strong>
      </p>
      <ul>
        <li>
          B2C = kupac je <strong>fizička osoba</strong> bez OIB-a tvrtke
        </li>
        <li>
          B2B = kupac je <strong>firma, obrt ili j.d.o.o.</strong> s OIB-om tvrtke
        </li>
      </ul>

      <h2 id='kada-fiskalizirati'>
        Kada moraš fiskalizirati račun prema fizičkoj osobi?
      </h2>

      <h3>Do 31.12.2025. (staro pravilo)</h3>
      <p>
        <strong>Fiskalizacija obvezna:</strong>
      </p>
      <ul>
        <li>Gotovina</li>
        <li>Kartice (POS terminal)</li>
      </ul>
      <p>
        <strong>Fiskalizacija NIJE obvezna:</strong>
      </p>
      <ul>
        <li>Transakcijski račun (uplata na IBAN)</li>
      </ul>
      <p>
        <strong>Primjer:</strong> Fotograf naplaćuje 1.000 € fizičkoj osobi koja uplaćuje
        na IBAN → račun <strong>ne mora</strong> biti fiskaliziran (do kraja 2025.).
      </p>

      <h3>Od 1.1.2026. (novo pravilo)</h3>
      <p>
        <strong>Fiskalizacija obvezna ZA SVE:</strong>
      </p>
      <ul>
        <li>Gotovina</li>
        <li>Kartice</li>
        <li>
          <strong>Transakcijski račun (uplata na IBAN)</strong> ← novost
        </li>
      </ul>
      <p>
        <strong>Primjer:</strong> Fotograf naplaćuje 1.000 € fizičkoj osobi koja uplaćuje
        na IBAN → račun <strong>mora biti fiskaliziran</strong> od 1.1.2026.
      </p>
      <p>
        <strong>Obvezni elementi fiskaliziranog računa:</strong>
      </p>
      <ul>
        <li>
          <strong>JIR</strong> (Jedinstveni identifikator računa)
        </li>
        <li>
          <strong>ZKI</strong> (Zaštitni kod izdavatelja)
        </li>
        <li>FINA certifikat</li>
        <li>Interni akt</li>
      </ul>
      <p>
        Više o fiskalizaciji općenito →{' '}
        <Link href={vodiciHref('fiskalizacija-20')} className={linkClass}>
          Fiskalizacija 2.0
        </Link>
      </p>

      <h2 id='sadrzaj-racuna'>Što treba sadržavati fiskalizirani račun (B2C)?</h2>
      <p>
        <strong>Obvezni elementi:</strong>
      </p>
      <ol>
        <li>
          <strong>Broj računa</strong> (npr. 1/PP1/2026)
        </li>
        <li>
          <strong>Datum i VRIJEME izdavanja</strong> (npr. 15.05.2026. 14:32)
        </li>
        <li>
          <strong>Naziv i OIB izdavatelja</strong> (tvoj obrt)
        </li>
        <li>
          <strong>Naziv usluge/robe</strong> (npr. &quot;Snimanje vjenčanja&quot;)
        </li>
        <li>
          <strong>Cijena</strong> (npr. 1.000,00 EUR)
        </li>
        <li>
          <strong>JIR</strong> (Jedinstveni identifikator računa) — dobiva se od Porezne
          pri fiskalizaciji
        </li>
        <li>
          <strong>ZKI</strong> (Zaštitni kod izdavatelja) — generira se iz certifikata
        </li>
        <li>
          <strong>Oznaka poslovnog prostora</strong> (npr. PP1)
        </li>
        <li>
          <strong>Napomena:</strong> &quot;Obveznik nije u sustavu PDV-a&quot; (ako nisi u
          PDV-u)
        </li>
      </ol>
      <p>
        <strong>Primjer:</strong>
      </p>
      <pre className='my-4 overflow-x-auto rounded-xl border border-[#1f2a28] bg-[#111716] p-4 text-sm text-[#d5dfdd]'>
        {`Paušalni obrt "Marko Horvat"
OIB: 12345678901
Račun br. 1/PP1/2026
Datum i vrijeme: 15.05.2026. 14:32
Usluga: Snimanje vjenčanja
Cijena: 1.000,00 EUR
Ukupno: 1.000,00 EUR
JIR: 12345678-1234-1234-1234-123456789012
ZKI: a1b2c3d4e5f6
Oznaka poslovnog prostora: PP1
Napomena: Obveznik nije u sustavu PDV-a, PDV nije obračunat temeljem čl. 90. Zakona o PDV-u.`}
      </pre>
      <p>
        Kvik automatski generira sve ove elemente — više o tome →{' '}
        <Link href={vodiciHref('izdavanje-racuna-vodic')} className={linkClass}>
          Izdavanje računa vodič
        </Link>
        . Uplatu u knjigu prometa upišeš prema{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')} className={linkClass}>
          KPR knjizi prometa
        </Link>
        .
      </p>

      <h2 id='fina-certifikat'>FINA certifikat — kako ga nabaviti?</h2>
      <p>
        <strong>Što je FINA certifikat:</strong>
      </p>
      <ul>
        <li>Digitalni certifikat koji omogućuje fiskalizaciju računa</li>
        <li>Izdaje ga FINA (fina.hr)</li>
        <li>Vrijedi 5 godina</li>
        <li>Trošak: ~50 € (39,82 € certifikat + 6,64 € registracija)</li>
      </ul>
      <p>
        <strong>Kako naručiti:</strong>
      </p>
      <ol>
        <li>Prijavi se na FINA portal (fina.hr)</li>
        <li>Odaberi &quot;Certifikati za fiskalizaciju&quot;</li>
        <li>Popuni obrazac (OIB, email, adresa)</li>
        <li>Priloži dokumentaciju (rješenje o upisu u obrtni registar)</li>
        <li>Plati ~50 €</li>
        <li>Certifikat stiže na email za 2–3 radna dana</li>
      </ol>
      <p>
        <strong>Demo certifikat:</strong>
      </p>
      <ul>
        <li>BESPLATAN za testiranje</li>
        <li>
          Možeš ga koristiti za probavanje softvera prije nego naručiš produkcijskog
        </li>
      </ul>
      <p>
        Detaljna procedura →{' '}
        <Link href={vodiciHref('fina-certifikat-fiskalizacija')} className={linkClass}>
          FINA certifikat
        </Link>
      </p>

      <h2 id='interni-akt'>Interni akt — što mora sadržavati?</h2>
      <p>
        <strong>Interni akt = dokument koji propisuje:</strong>
      </p>
      <ul>
        <li>Pravila numeriranja računa (npr. 1/PP1/1, 2/PP1/1...)</li>
        <li>Popis poslovnih prostora s oznakama (PP1, PP2...)</li>
        <li>Oznake operatera (ako imaš zaposlenike)</li>
      </ul>
      <p>
        <strong>Primjer poslovnog prostora:</strong>
      </p>
      <ul>
        <li>PP1 = &quot;Ured u stanu, Ilica 123, Zagreb&quot;</li>
        <li>PP2 = &quot;Web shop, online prodaja&quot;</li>
      </ul>
      <p>
        <strong>Čuva se kod tebe</strong>, NE dostavlja se Poreznoj. Ali inspektor ga može
        zatražiti na kontroli.
      </p>
      <p>
        Generator internog akta →{' '}
        <Link href='/alati/interni-akt' className={linkClass}>
          Interni akt generator
        </Link>
      </p>

      <h2 id='b2c-vs-b2b'>Razlika B2C vs B2B fiskalizacija</h2>
      <div className={tableWrap}>
        <table className='min-w-full border-collapse text-left'>
          <thead>
            <tr className='border-b border-[#1f2a28] text-[#94a3a0]'>
              <th className='px-3 py-2 font-medium'>Aspekt</th>
              <th className='px-3 py-2 font-medium'>B2C (fizička osoba)</th>
              <th className='px-3 py-2 font-medium'>B2B (firma)</th>
            </tr>
          </thead>
          <tbody className='text-[#d5dfdd]'>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>Fiskalizacija</strong>
              </td>
              <td className='px-3 py-2'>✅ Obvezna od 1.1.2026.</td>
              <td className='px-3 py-2'>❌ Nije fiskalizacija (eRačun od 1.1.2027.)</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>JIR i ZKI</strong>
              </td>
              <td className='px-3 py-2'>✅ Obvezno</td>
              <td className='px-3 py-2'>❌ Ne treba</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>FINA certifikat</strong>
              </td>
              <td className='px-3 py-2'>✅ Obvezno</td>
              <td className='px-3 py-2'>❌ Ne treba (za eRačune drugi sustav)</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>Interni akt</strong>
              </td>
              <td className='px-3 py-2'>✅ Obvezno</td>
              <td className='px-3 py-2'>❌ Ne treba</td>
            </tr>
            <tr>
              <td className='px-3 py-2'>
                <strong>Primjer</strong>
              </td>
              <td className='px-3 py-2'>Fotograf naplaćuje mladencima</td>
              <td className='px-3 py-2'>Fotograf naplaćuje agenciji d.o.o.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <strong>Zaključak:</strong>
      </p>
      <ul>
        <li>
          Fizička osoba plaća na IBAN → <strong>fiskalizacija</strong> (JIR, ZKI, FINA
          certifikat)
        </li>
        <li>
          Firma plaća na IBAN → <strong>eRačun</strong> od 1.1.2027. (MIKROeRACUN sustav,
          NE fiskalizacija)
        </li>
      </ul>
      <p>
        Više o eRačunima →{' '}
        <Link href={`${vodiciHref('fiskalizacija-20')}#eracuni`} className={linkClass}>
          eRačuni
        </Link>
      </p>

      <h2 id='greske'>Česte greške</h2>

      <h3>
        ❌ &quot;Fizička osoba mi je platila na IBAN, nisam fiskalizirao račun&quot;
      </h3>
      <p>
        <strong>Posljedica (od 1.1.2026.):</strong> Kazna za nefiskalizirani račun — do
        13.300 € za obrtnike.
      </p>
      <p>
        <strong>Rješenje:</strong> Od 1.1.2026. sve transakcije fizičkim osobama moraju
        biti fiskalizirane — uključujući IBAN uplate.
      </p>

      <h3>
        ❌ &quot;Mislio sam da samo gotovina i kartice moraju biti fiskalizirane&quot;
      </h3>
      <p>
        <strong>Posljedica:</strong> To je bilo točno do 31.12.2025. Od 1.1.2026. i
        transakcijski računi moraju biti fiskalizirani (ako je kupac fizička osoba).
      </p>
      <p>
        <strong>Rješenje:</strong> Ako naplaćuješ fizičkim osobama na IBAN, pripremi se za
        fiskalizaciju — nabavi FINA certifikat, napravi interni akt, koristi software
        (Kvik).
      </p>

      <h3>❌ &quot;Ne znam je li kupac fizička osoba ili firma&quot;</h3>
      <p>
        <strong>Posljedica:</strong> Ako ne znaš, ne znaš treba li fiskalizirati ili ne.
      </p>
      <p>
        <strong>Rješenje:</strong> Pitaj kupca: &quot;Plaćate li kao privatna osoba ili kao
        firma?&quot; Ako kaže firma, traži OIB tvrtke. Ako kaže privatna osoba,
        fiskaliziraj račun.
      </p>

      <h3>
        ❌ &quot;Imam FINA certifikat, ali ne znam kako ga uploadati u software&quot;
      </h3>
      <p>
        <strong>Posljedica:</strong> Certifikat sam ne radi — mora biti uploadan u software
        koji fiskalizira račune.
      </p>
      <p>
        <strong>Rješenje:</strong> Kvik ima uputu kako uploadati certifikat — sve se radi
        kroz interface, 2 klika. Ili pitaj AI asistenta na kvik.online/asistent.
      </p>

      <h2 id='cta'>Kvik automatski fiskalizira račune prema fizičkim osobama</h2>
      <p>
        Kvik automatski fiskalizira račune prema fizičkim osobama — bez ručnog rada.
      </p>
      <p>
        <Link href='/provjera' className={linkClass}>
          Fiskal kviz
        </Link>
      </p>
    </GuideShell>
  );
}

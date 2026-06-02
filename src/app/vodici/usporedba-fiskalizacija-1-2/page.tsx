import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'usporedba-fiskalizacija-1-2';

const META_DESC =
  'Side-by-side tablica: tko mora, certifikat, cijena, rokovi, eRačuni, JIR, poslovni prostor. Fiskalizacija 1.0 (gotovina) vs 2.0 (B2B/B2G).';

export const metadata: Metadata = {
  title: 'Usporedba Fiskalizacija 1.0 vs 2.0',
  description: META_DESC,
  openGraph: {
    title: 'Usporedba Fiskalizacija 1.0 vs 2.0 | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Koja je razlika između fiskalizacije 1.0 i 2.0?',
    answer:
      'Fiskalizacija 1.0 pokriva gotovinu i kartice (JIR/ZKI). Fiskalizacija 2.0 je proširenje koje od 1.1.2026. dodaje fiskalizaciju transakcijskih računa prema fizičkim osobama (B2C). F2.0 ne zamjenjuje F1.0 — oboje može biti obvezno istovremeno.',
  },
  {
    question: 'Trebam li novi certifikat za fiskalizaciju 2.0?',
    answer:
      'Ne — isti FINA aplikativni certifikat (~50 € za 5 godina) koristi se za obje verzije. Ako već imaš certifikat za F1.0, nastavi ga koristiti za F2.0.',
  },
  {
    question: 'Kada paušalist mora fiskalizirati transakcijske račune?',
    answer:
      'Od 1.1.2026. moraš fiskalizirati transakcijske račune prema fizičkim osobama (B2C). B2B računi prema firmama postaju eRačuni tek od 1.1.2027. — do tada izdaješ obične PDF račune.',
  },
];

const tableWrap =
  'my-6 overflow-x-auto rounded-xl border border-[#1f2a28] bg-[#111716] text-sm';

export default function UsporedbaFiskalizacija12Page() {
  return (
    <GuideShell
      slug={SLUG}
      title='Usporedba Fiskalizacija 1.0 vs 2.0'
      subtitle='Side-by-side tablica: tko mora, certifikat, cijena, rokovi, eRačuni, JIR, poslovni prostor. Fiskalizacija 1.0 (gotovina) vs 2.0 (B2B/B2G).'
      readingMinutes={11}
      metaDescription={META_DESC}
      toc={[
        { id: 'f10', label: 'Što je Fiskalizacija 1.0?' },
        { id: 'f20', label: 'Što je Fiskalizacija 2.0?' },
        { id: 'usporedba', label: 'Side-by-side tablica' },
        { id: 'certifikat', label: 'Novi certifikat za F2.0?' },
        { id: 'blagajna', label: 'Već imam fiskalnu blagajnu' },
        { id: 'b2b', label: 'Poslujem samo B2B' },
        { id: 'izvan-pdv', label: 'Nisam u PDV sustavu' },
        { id: 'rokovi', label: 'Rokovi' },
        { id: 'greske', label: 'Česte greške' },
        { id: 'cta', label: 'Spreman za F2.0?' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('fiskalizacija-20'), title: 'Fiskalizacija 2.0' },
        { href: vodiciHref('fina-certifikat-fiskalizacija'), title: 'FINA certifikat' },
        { href: vodiciHref('izdavanje-racuna-vodic'), title: 'Izdavanje računa' },
        { href: vodiciHref('pausalist-izvan-pdv'), title: 'Izvan PDV-a' },
        { href: '/provjera', title: 'Fiskal kviz' },
      ]}
    >
      <p>
        Fiskalizacija 1.0 je postojala od 2013. i pokrivala je{' '}
        <strong>gotovinske transakcije</strong> (blagajna, kartice). Fiskalizacija 2.0 je
        novi sustav koji od 1.1.2026. dodaje fiskalizaciju{' '}
        <strong>transakcijskih računa</strong> prema fizičkim osobama (B2C).
      </p>
      <p>
        Mnogi paušalisti su zbunjeni: što je razlika, moram li nešto mijenjati, trebam li
        novi certifikat, što se događa s mojom blagajnom?
      </p>
      <p>
        Ovaj vodič je <strong>side-by-side usporedba</strong> — sve razlike na jednom
        mjestu, u tablici. Bez teorije, samo konkretni odgovori.
      </p>

      <h2 id='f10'>Što je Fiskalizacija 1.0?</h2>
      <p>
        Fiskalizacija 1.0 je sustav fiskalizacije <strong>gotovine i kartica</strong> koji
        je uveden 2013. godine.
      </p>
      <p>
        <strong>Tko mora:</strong>
      </p>
      <ul>
        <li>Svi koji naplaćuju <strong>gotovinom</strong> (cash)</li>
        <li>Svi koji naplaćuju <strong>karticama</strong> (POS terminal)</li>
      </ul>
      <p>
        <strong>Što treba:</strong>
      </p>
      <ul>
        <li>Fiskalna blagajna (hardware ili software)</li>
        <li>FINA certifikat (~50 € za 5 godina)</li>
        <li>Interni akt</li>
        <li>Račun ima JIR i ZKI kod</li>
      </ul>
      <p>
        <strong>Primjer:</strong> Kafić naplaćuje kavu 2 € gotovinom → mora izdati
        fiskalizirani račun F1.0.
      </p>
      <p>
        Više o fiskalizaciji općenito →{' '}
        <Link href={vodiciHref('fiskalizacija-20')} className='text-[#0d9488] hover:underline'>
          Fiskalizacija 2.0
        </Link>
      </p>

      <h2 id='f20'>Što je Fiskalizacija 2.0?</h2>
      <p>
        Fiskalizacija 2.0 je <strong>proširenje</strong> Fiskalizacije 1.0 koje dodaje
        fiskalizaciju <strong>transakcijskih računa</strong> prema fizičkim osobama (B2C).
      </p>
      <p>
        <strong>Tko mora (od 1.1.2026.):</strong>
      </p>
      <ul>
        <li>
          Svi koji izdaju račune <strong>fizičkim osobama</strong> koje plaćaju na IBAN
          (bankovni prijenos, PayPal, Stripe...)
        </li>
      </ul>
      <p>
        <strong>Što treba:</strong>
      </p>
      <ul>
        <li>Isto kao F1.0: FINA certifikat, interni akt, software za fiskalizaciju</li>
        <li>Račun ima JIR i ZKI kod (isto kao F1.0)</li>
      </ul>
      <p>
        <strong>Primjer:</strong> Fotograf naplaćuje snimanje vjenčanja 1.000 € fizičkoj
        osobi koja uplaćuje na IBAN → mora izdati fiskalizirani račun F2.0 (od 1.1.2026.).
      </p>
      <p>
        <strong>B2B računi (firma prema firmi):</strong>
      </p>
      <ul>
        <li>Do 1.1.2027. → &quot;obični&quot; računi (PDF, Excel)</li>
        <li>Od 1.1.2027. → eRačuni (MIKROeRACUN sustav)</li>
      </ul>
      <p>
        Više o B2B vs B2C fiskalizaciji →{' '}
        <Link
          href={vodiciHref('fizicke-osobe-placaju-na-racun')}
          className='text-[#0d9488] hover:underline'
        >
          Fizičke osobe plaćaju na račun
        </Link>
      </p>

      <h2 id='usporedba'>Side-by-side tablica — Fiskalizacija 1.0 vs 2.0</h2>
      <div className={tableWrap}>
        <table className='min-w-full border-collapse text-left'>
          <thead>
            <tr className='border-b border-[#1f2a28] text-[#94a3a0]'>
              <th className='px-3 py-2 font-medium'>Aspekt</th>
              <th className='px-3 py-2 font-medium'>Fiskalizacija 1.0</th>
              <th className='px-3 py-2 font-medium'>Fiskalizacija 2.0</th>
            </tr>
          </thead>
          <tbody className='text-[#d5dfdd]'>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>Kada uvedena?</strong>
              </td>
              <td className='px-3 py-2'>2013. godina</td>
              <td className='px-3 py-2'>1. siječnja 2026.</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>Što fiskalizira?</strong>
              </td>
              <td className='px-3 py-2'>Gotovina + kartice</td>
              <td className='px-3 py-2'>Transakcijski računi (B2C)</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>Tko mora?</strong>
              </td>
              <td className='px-3 py-2'>Svi koji naplaćuju gotovinom ili karticama</td>
              <td className='px-3 py-2'>Svi koji naplaćuju fizičkim osobama na IBAN</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>FINA certifikat</strong>
              </td>
              <td className='px-3 py-2'>✅ Potreban (~50 € za 5 god)</td>
              <td className='px-3 py-2'>✅ Potreban (isti certifikat kao F1.0)</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>Interni akt</strong>
              </td>
              <td className='px-3 py-2'>✅ Potreban</td>
              <td className='px-3 py-2'>✅ Potreban (isti kao F1.0)</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>JIR kod</strong>
              </td>
              <td className='px-3 py-2'>✅ DA</td>
              <td className='px-3 py-2'>✅ DA</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>ZKI kod</strong>
              </td>
              <td className='px-3 py-2'>✅ DA</td>
              <td className='px-3 py-2'>✅ DA</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>Poslovni prostor</strong>
              </td>
              <td className='px-3 py-2'>✅ Obvezno prijaviti</td>
              <td className='px-3 py-2'>✅ Obvezno prijaviti</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>Fiskalna blagajna</strong>
              </td>
              <td className='px-3 py-2'>✅ Hardware ili software</td>
              <td className='px-3 py-2'>✅ Software (Kvik, Parra, Fiskal)</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>eRačuni (B2B)</strong>
              </td>
              <td className='px-3 py-2'>❌ Ne pokriva</td>
              <td className='px-3 py-2'>✅ Obvezni od 1.1.2027.</td>
            </tr>
            <tr>
              <td className='px-3 py-2'>
                <strong>Primjer transakcije</strong>
              </td>
              <td className='px-3 py-2'>Kafić naplaćuje kavu 2 € gotovinom</td>
              <td className='px-3 py-2'>
                Fotograf naplaćuje 1.000 € fizičkoj osobi na IBAN
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id='certifikat'>Trebam li novi certifikat za F2.0?</h2>
      <p>
        <strong>NE.</strong> Ako već imaš FINA certifikat za Fiskalizaciju 1.0,{' '}
        <strong>isti certifikat</strong> koristiš za Fiskalizaciju 2.0.
      </p>
      <p>
        <strong>Ako nemaš certifikat:</strong>
      </p>
      <ul>
        <li>Naruči kod FINA-e (fina.hr)</li>
        <li>Trošak: ~50 € (vrijedi 5 godina)</li>
        <li>Dokumentacija: Rješenje o upisu, OIB, email adresa</li>
      </ul>
      <p>
        Procedura narudžbe certifikata →{' '}
        <Link
          href={vodiciHref('fina-certifikat-fiskalizacija')}
          className='text-[#0d9488] hover:underline'
        >
          FINA certifikat
        </Link>
      </p>

      <h2 id='blagajna'>Što ako već imam fiskalnu blagajnu (F1.0)?</h2>
      <p>
        Ako već imaš <strong>fiskalnu blagajnu</strong> (hardware ili software za
        gotovinu), postoje 2 scenarija:
      </p>

      <h3>Scenarij A: Naplaćujem samo gotovinom (kafić, trgovina, usluge uživo)</h3>
      <ul>
        <li>
          <strong>Ništa se ne mijenja</strong> — nastaviš koristiti istu blagajnu
        </li>
        <li>
          Fiskalizacija 2.0 te NE tangira (osim ako počneš naplaćivati transakcijski)
        </li>
      </ul>

      <h3>
        Scenarij B: Naplaćujem i gotovinom i transakcijski (fotograf, freelancer, online
        prodaja)
      </h3>
      <ul>
        <li>
          <strong>Trebaš software</strong> koji podržava i F1.0 i F2.0
        </li>
        <li>Većina modernih rješenja (Kvik, Parra, Fiskal) podržavaju oboje</li>
        <li>
          Možeš zadržati postojeću blagajnu za gotovinu + dodati software za transakcijske
          račune
        </li>
      </ul>
      <p>
        <strong>VAŽNO:</strong> Provjeri s dobavljačem blagajne da li podržava F2.0. Stari
        hardware (prije 2020.) možda NE podržava.
      </p>

      <h2 id='b2b'>Što ako poslujem samo B2B (firma prema firmi)?</h2>
      <p>
        Ako <strong>NIKAD ne naplaćuješ fizičkim osobama</strong>, Fiskalizacija 2.0 te NE
        tangira do 1.1.2027.
      </p>
      <p>
        <strong>Od 1.1.2027.:</strong>
      </p>
      <ul>
        <li>
          B2B računi moraju biti <strong>eRačuni</strong> (elektronički računi u XML
          formatu)
        </li>
        <li>
          Šalju se preko sustava MIKROeRACUN (mikroeracun.gov.hr)
        </li>
        <li>NE trebaju JIR i ZKI (nije fiskalizacija, već eRačun sustav)</li>
      </ul>
      <p>
        <strong>Do 1.1.2027.:</strong>
      </p>
      <ul>
        <li>Nastaviš izdavati &quot;obične&quot; račune (PDF, Excel, Word)</li>
      </ul>
      <p>
        Više o eRačunima →{' '}
        <Link
          href={`${vodiciHref('fiskalizacija-20')}#eracuni`}
          className='text-[#0d9488] hover:underline'
        >
          eRačuni
        </Link>
      </p>

      <h2 id='izvan-pdv'>Što ako nisam u PDV sustavu?</h2>
      <p>
        Ako <strong>nisi u PDV sustavu</strong> (što je većina paušalista), situacija je
        sljedeća:
      </p>
      <p>
        <strong>Fiskalizacija 2.0:</strong>
      </p>
      <ul>
        <li>
          Moraš fiskalizirati transakcijske račune prema fizičkim osobama (od 1.1.2026.)
        </li>
        <li>Moraš primati eRačune od dobavljača (od 1.1.2026.)</li>
        <li>Moraš izdavati eRačune prema firmama (od 1.1.2027.)</li>
      </ul>
      <p>
        <strong>NAPOMENA na računima:</strong>
      </p>
      <p>
        Svaki račun mora imati napomenu:{' '}
        <em>
          &quot;Obveznik nije u sustavu PDV-a, PDV nije obračunat temeljem čl. 90. Zakona o
          PDV-u.&quot;
        </em>
      </p>
      <p>
        Više o paušalistima izvan PDV-a →{' '}
        <Link
          href={vodiciHref('pausalist-izvan-pdv')}
          className='text-[#0d9488] hover:underline'
        >
          Paušalist izvan PDV-a
        </Link>
      </p>

      <h2 id='rokovi'>Rokovi — kada što stupa na snagu?</h2>
      <div className={tableWrap}>
        <table className='min-w-full border-collapse text-left'>
          <thead>
            <tr className='border-b border-[#1f2a28] text-[#94a3a0]'>
              <th className='px-3 py-2 font-medium'>Obveza</th>
              <th className='px-3 py-2 font-medium'>Rok</th>
            </tr>
          </thead>
          <tbody className='text-[#d5dfdd]'>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>Fiskalizacija transakcijskih računa (B2C)</strong>
              </td>
              <td className='px-3 py-2'>1. siječnja 2026.</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>Zaprimanje eRačuna od dobavljača</strong>
              </td>
              <td className='px-3 py-2'>1. siječnja 2026.</td>
            </tr>
            <tr>
              <td className='px-3 py-2'>
                <strong>Izdavanje eRačuna prema firmama (B2B)</strong>
              </td>
              <td className='px-3 py-2'>1. siječnja 2027.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <strong>Primjer timeline:</strong>
      </p>
      <ul>
        <li>
          <strong>Do 31.12.2025.:</strong> Fiskaliziraš samo gotovinu (F1.0), B2B računi su
          obični PDF-ovi
        </li>
        <li>
          <strong>Od 1.1.2026.:</strong> Fiskaliziraš gotovinu (F1.0) + transakcijske
          račune fizičkim osobama (F2.0), primaš eRačune, B2B još obični PDF-ovi
        </li>
        <li>
          <strong>Od 1.1.2027.:</strong> Sve gore + B2B računi moraju biti eRačuni
        </li>
      </ul>

      <h2 id='greske'>Česte greške</h2>

      <h3>
        ❌ &quot;Mislio sam da F2.0 zamjenjuje F1.0 — ugasio sam fiskalnu blagajnu&quot;
      </h3>
      <p>
        <strong>Posljedica:</strong> Ako i dalje naplaćuješ gotovinom, F1.0 je i dalje
        obvezan. F2.0 je <strong>dodatak</strong>, ne zamjena.
      </p>
      <p>
        <strong>Rješenje:</strong> Zadrži fiskalnu blagajnu za gotovinu, dodaj software za
        transakcijske račune.
      </p>

      <h3>
        ❌ &quot;Imam račune prema firmama — mislio sam da moram fiskalizirati od
        1.1.2026.&quot;
      </h3>
      <p>
        <strong>Posljedica:</strong> Ne moraš. B2B fiskalizacija ne postoji — B2B postaju
        eRačuni od 1.1.2027.
      </p>
      <p>
        <strong>Rješenje:</strong> Do 1.1.2027. nastaviš izdavati obične račune firmama. Od
        1.1.2027. prelazi na eRačune.
      </p>

      <h3>❌ &quot;Nisam siguran je li moja blagajna kompatibilna s F2.0&quot;</h3>
      <p>
        <strong>Posljedica:</strong> Stari hardware možda NE podržava F2.0. Moraš
        provjeriti s dobavljačem.
      </p>
      <p>
        <strong>Rješenje:</strong> Kontaktiraj dobavljača blagajne i pitaj podržava li F2.0.
        Ako ne, prelazi na software rješenje (Kvik, Parra).
      </p>

      <h3>❌ &quot;Mislio sam da moram novi certifikat za F2.0&quot;</h3>
      <p>
        <strong>Posljedica:</strong> Ne trebaš. Isti FINA certifikat radi i za F1.0 i za
        F2.0.
      </p>
      <p>
        <strong>Rješenje:</strong> Ako već imaš certifikat, nastavi ga koristiti. Ako
        nemaš, naruči jednom i koristi za oboje.
      </p>

      <h2 id='cta'>Spreman za F2.0?</h2>
      <p>Kvik podržava i F1.0 i F2.0 — automatska fiskalizacija bez brige.</p>
      <p>
        <Link href='/provjera' className='text-[#0d9488] hover:underline'>
          Fiskal kviz
        </Link>
      </p>
    </GuideShell>
  );
}

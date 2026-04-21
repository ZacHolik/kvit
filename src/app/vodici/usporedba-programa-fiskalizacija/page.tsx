import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'usporedba-programa-fiskalizacija';

const META_DESC =
  'Program za fiskalizaciju paušalni obrt 2026.: usporedba Kvit, Marketino, FiskAI i Solo — cijena, AI, UX i fokus na paušaliste.';

export const metadata: Metadata = {
  title: 'Program za fiskalizaciju paušalni obrt 2026',
  description: META_DESC,
  openGraph: {
    title: 'Program za fiskalizaciju paušalni obrt 2026 | Kvit',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvit',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Koji program je najbolji za paušalni obrt?',
    answer:
      'Ovisi o prioritetu: ako želiš AI asistenta, KPR/PO-SD u istom produktu i sučelje dizajnirano za paušaliste, Kvit je najspecifičniji izbor. Ako trebaš generički POS za više djelatnosti, Marketino ili Solo mogu bolje odgovarati.',
  },
  {
    question: 'Što je razlika između Kvita i Marketina?',
    answer:
      'Marketino se oglašava kao široki alat (fiskalizacija, računi, više djelatnosti) uz pristupačnu cijenu. Kvit je usmjeren isključivo na paušalne obrtnike i uključuje AI asistenta za pitanja o obvezama.',
  },
  {
    question: 'Trebam li AI asistent za paušalni obrt?',
    answer:
      'Nije obvezno, ali smanjuje vrijeme traženja informacija o rokovima i obrascima — posebno kad se pojavi hitan upit prije uplate doprinosa.',
  },
  {
    question: 'Koliko košta program za fiskalizaciju?',
    answer:
      'Cijene variraju: Marketino se često oglašava oko 5,99 € mjesečno, Solo oko 10 € mjesečno, dok Kvit i FiskAI imaju vlastite modele — provjeri aktivne cijene na službenim stranicama prije kupnje.',
  },
  {
    question: 'Mogu li isprobati besplatno?',
    answer:
      'Kvit nudi registraciju i isprobavanje aplikacije; druge platforme imaju vlastite trial politike — provjeri na njihovim landing stranicama.',
  },
];

export default function UsporedbaProgramaFiskalizacijaPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Koji program za fiskalizaciju 2026. — usporedba'
      subtitle='Kriteriji: cijena, fokus na paušal, AI, UX i koliko brzo “skuži” tvoj obrt.'
      readingMinutes={10}
      metaDescription={META_DESC}
      toc={[
        { id: 'kriteriji', label: 'Kriteriji usporedbe' },
        { id: 'kvit', label: 'Kvit' },
        { id: 'marketino', label: 'Marketino' },
        { id: 'fiskai', label: 'FiskAI' },
        { id: 'solo', label: 'Solo' },
        { id: 'pausal', label: 'Zašto je fokus na paušal važan' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('fiskalizacija-20'), title: 'Fiskalizacija 2.0' },
        { href: vodiciHref('izdavanje-racuna'), title: 'Izdavanje računa' },
        { href: vodiciHref('pausalni-obrt-vodic'), title: 'Paušalni obrt 2026.' },
      ]}
    >
      <p>
        Tražiš <strong>program za fiskalizaciju paušalni obrt 2026</strong> i dobivaš pet
        različitih odgovora od kolege obrtnika. Donja usporedba ne zamjenjuje vlastiti
        test u aplikaciji, ali razdvaja ono što je važno paušalistu: fiskalizacija nije
        samo “POS”, nego dio lanca koji uključuje i KPR i (kroz godinu) PO-SD. Zakonski
        okvir za fiskalizaciju i račune i dalje proizlazi iz hrvatskih propisa i vodiča
        poput{' '}
        <a
          href='https://fiskalopedija.hr/baza-znanja/fiskalizacija-20-pausalni-obrt'
          className='text-[#0d9488] hover:underline'
          rel='noopener noreferrer'
          target='_blank'
        >
          Fiskalopedije — fiskalizacija 2.0 za paušaliste
        </a>
        .
      </p>

      <h2 id='kriteriji'>Kriteriji usporedbe</h2>
      <p>
        Cijena mjesečne pretplate, dubina integracije s KPR-om, podrška za eRačun,
        jednostavnost mobilnog izdavanja računa i postoji li AI koji razumije kontekst
        paušalnog obrta. Generički POS često zna biti moćan, ali te tjera da sama mapiraš
        poslovne procese paušaliste.
      </p>

      <h2 id='kvit'>Kvit</h2>
      <p>
        Kvit je dizajniran isključivo za paušalne obrtnike: računi, KPR, PO-SD i AI
        asistent na hrvatskom jeziku. To znači da se ne boriš s modulima koji su
        nastali za maloprodaju ili restoran s inventarom. Za paušaliste koji rade s
        laptopa i žele “jedan alat za cijelu godinu”, to je najjača razlika.
      </p>

      <h2 id='marketino'>Marketino</h2>
      <p>
        Marketino se na tržištu pozicionira kao pristupačan alat (često oko{' '}
        <strong>5,99 €</strong> mjesečno) koji pokriva širok spektar djelatnosti i
        funkcija (računi, fiskalizacija, eRačuni). Nema isti fokus na paušal kao Kvit, ali
        može biti dobar ako želiš jednostavan POS uz više opcija za različite obrte u
        kućanstvu.
      </p>

      <h2 id='fiskai'>FiskAI</h2>
      <p>
        FiskAI koristi AI u nazivu i marketingu, ali produkt nije nužno optimiziran samo
        za paušalni obrt — provjeri ima li predložak KPR-a i PO-SD-a koji ti trebaju. Ako
        ti je AI važan, usporedi ga s Kvitovim asistentom koji živi unutar istog sustava
        gdje su ti podaci.
      </p>

      <h2 id='solo'>Solo</h2>
      <p>
        Solo se često spominje zbog mobilne aplikacije i cijene reda veličine{' '}
        <strong>10 €</strong> mjesečno. Dobar izbor ako ti je primarno izdavanje računa s
        telefona, ali provjeri pokriva li tvoje potrebe za eRačunima i obrascima koje
        paušal i dalje mora predati.
      </p>

      <h2 id='pausal'>Zašto je fokus na paušal važan</h2>
      <p>
        Paušalni obrt ima jedinstven skup obveza koje Fiskalopedija sažima kao: računi,
        KPR isti dan, doprinosi do 15. u mjesecu, kvartalni porez, PO-SD do 15. siječnja.
        Alat koji razumije taj lanac smanjuje greške na kraju godine. Zato je “jedan
        veliki POS” ponekad skuplji na živcima nego na eurima.
      </p>
      <div className='my-6 overflow-x-auto rounded-xl border border-[#1f2a28] bg-[#111716] text-sm'>
        <table className='min-w-full border-collapse text-left'>
          <thead>
            <tr className='border-b border-[#1f2a28] text-[#94a3a0]'>
              <th className='px-3 py-2 font-medium'>Program</th>
              <th className='px-3 py-2 font-medium'>Cijena (orijentir)</th>
              <th className='px-3 py-2 font-medium'>Paušal fokus</th>
              <th className='px-3 py-2 font-medium'>AI</th>
            </tr>
          </thead>
          <tbody className='text-[#d5dfdd]'>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>Kvit</td>
              <td className='px-3 py-2'>pretplata (provjeri stranicu)</td>
              <td className='px-3 py-2'>visok — samo paušalni obrt</td>
              <td className='px-3 py-2'>da (asistent u aplikaciji)</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>Marketino</td>
              <td className='px-3 py-2'>~5,99 € / mj.</td>
              <td className='px-3 py-2'>srednji — širok spektar djelatnosti</td>
              <td className='px-3 py-2'>ne kao glavna prodajna točka</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>FiskAI</td>
              <td className='px-3 py-2'>ovisno o paketu</td>
              <td className='px-3 py-2'>nizak — generički fiskalni alat</td>
              <td className='px-3 py-2'>brendirano oko AI</td>
            </tr>
            <tr>
              <td className='px-3 py-2'>Solo</td>
              <td className='px-3 py-2'>~10 € / mj.</td>
              <td className='px-3 py-2'>srednji — mobilni naglasak</td>
              <td className='px-3 py-2'>nije fokus</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Tablica je sažetak tržišnog pozicioniranja, ne zamjena za vlastiti test: cijene se
        mijenjaju, a funkcije rastu kvartalno. Ipak, smjer je jasan: ako želiš AI koji
        živi uz KPR i PO-SD, Kvit je jedini koji to veže uz isključivo paušalni obrt.
      </p>
      <p>
        Isprobaj <Link href='/register'>Kvit besplatno</Link> i usporedi s drugim
        trial računima prije konačne odluke.
      </p>
    </GuideShell>
  );
}

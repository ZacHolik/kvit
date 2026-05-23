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
      'Fiskalizacija 1.0 pokriva gotovinske račune (JIR/ZKI). Fiskalizacija 2.0 donosi eRačune za B2B/B2G i transakcijske račune. Side-by-side tablica bit će dodana u punoj verziji.',
  },
  {
    question: 'Trebam li novi certifikat za fiskalizaciju 2.0?',
    answer:
      'Ne — isti FINA aplikativni certifikat koristi se za obje verzije. Detalji u vodiču o FINA certifikatu.',
  },
  {
    question: 'Kada paušalist mora fiskalizirati transakcijske račune?',
    answer:
      'Rokovi za paušaliste: zaprimanje eRačuna od 1.1.2026., izdavanje od 1.1.2027. Pun vodič o fiskalizaciji 2.0 objašnjava sve korake.',
  },
];

export default function UsporedbaFiskalizacija12Page() {
  return (
    <GuideShell
      slug={SLUG}
      title='Usporedba Fiskalizacija 1.0 vs 2.0'
      subtitle='Side-by-side tablica: tko mora, certifikat, cijena, rokovi, eRačuni, JIR, poslovni prostor. Fiskalizacija 1.0 (gotovina) vs 2.0 (B2B/B2G).'
      readingMinutes={11}
      metaDescription={META_DESC}
      toc={[{ id: 'usporedba', label: 'Fiskalizacija 1.0 vs 2.0' }]}
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
        <strong>Usporedba Fiskalizacija 1.0 vs 2.0</strong> pomaže paušalistima da na
        jednom mjestu vide razlike: tko mora, certifikat, cijena, rokovi, eRačuni, JIR,
        poslovni prostor. Fiskalizacija 1.0 pokriva gotovinu, a 2.0 B2B/B2G i
        transakcijske račune.
      </p>
      <p>
        Za detaljan vodič o novim obvezama vidi{' '}
        <Link href={vodiciHref('fiskalizacija-20')}>fiskalizacija 2.0</Link>. Za
        certifikat potreban za obje verzije pogledaj{' '}
        <Link href={vodiciHref('fina-certifikat-fiskalizacija')}>FINA certifikat</Link>.
      </p>
      <p>
        Paušalisti izvan PDV-a imaju posebne rokove — vidi{' '}
        <Link href={vodiciHref('pausalist-izvan-pdv')}>paušalist izvan PDV sustava</Link>.
      </p>

      <h2 id='usporedba'>Fiskalizacija 1.0 vs 2.0</h2>
      <p>
        Fiskalizacija 1.0: gotovinski računi, JIR/ZKI, FINA certifikat, poslovni prostor
        prijavljen u sustavu. Već danas obvezna za gotovinske uplate u mnogim
        djelatnostima.
      </p>
      <p>
        Fiskalizacija 2.0: eRačuni u UBL formatu, informacijski posrednik, zaprimanje od
        1.1.2026. i izdavanje od 1.1.2027. za tipične paušaliste. Isti certifikat, novi
        procesi oko posrednika i pristupne točke u ePoreznoj.
      </p>
      <p>
        Side-by-side tablica s usporedbom bit će dodana u punoj verziji vodiča. Do tada
        provjeri znanje na{' '}
        <Link href='/provjera'>Fiskal kvizu</Link>.
      </p>

      <h2 id='alat'>Korisni alat</h2>
      <p>
        Prije prvog fiskaliziranog računa složi{' '}
        <Link href='/alati/interni-akt' className='text-[#0d9488] hover:underline'>
          interni akt
        </Link>{' '}
        s numeracijom i poslovnim oznakama — potreban za fiskalizaciju i eRačune.
      </p>
    </GuideShell>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'pausalist-izvan-pdv';

const META_DESC =
  'Što znači biti paušalist izvan PDV-a: obveze zaprimanja eRačuna od 1.1.2026., obveze izdavanja od 1.1.2027., napomena na računima i prag 60.000 €.';

export const metadata: Metadata = {
  title: 'Paušalist izvan PDV sustava',
  description: META_DESC,
  openGraph: {
    title: 'Paušalist izvan PDV sustava | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Što znači biti paušalist izvan PDV-a?',
    answer:
      'Paušalist ispod praga od 60.000 € godišnjih primitaka ne obračunava PDV na računima. Na računu stoji napomena da nisi u sustavu PDV-a. Detalji u punoj verziji vodiča.',
  },
  {
    question: 'Moram li zaprimati eRačune ako nisam u PDV-u?',
    answer:
      'Da — od 1.1.2026. paušalisti izvan PDV-a moraju zaprimati eRačune. Izdavanje eRačuna dolazi od 1.1.2027.',
  },
  {
    question: 'Što se dogodi ako prijeđem prag od 60.000 €?',
    answer:
      'Prelaskom praga postaješ obveznik PDV-a prema propisima. Mijenjaju se obveze na računima i izvještavanje.',
  },
];

export default function PausalistIzvanPdvPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Paušalist izvan PDV sustava'
      subtitle='Što znači biti paušalist izvan PDV-a: obveze zaprimanja eRačuna od 1.1.2026., obveze izdavanja od 1.1.2027., napomena na računima i prag 60.000 €.'
      readingMinutes={10}
      metaDescription={META_DESC}
      toc={[{ id: 'izvan-pdv', label: 'Paušalist izvan PDV-a' }]}
      faq={faq}
      related={[
        { href: vodiciHref('pdv-id'), title: 'PDV ID broj' },
        { href: vodiciHref('fiskalizacija-20'), title: 'Fiskalizacija 2.0' },
        { href: vodiciHref('pausalni-obrt-vodic'), title: 'Paušalni obrt vodič' },
        { href: vodiciHref('izdavanje-racuna'), title: 'Izdavanje računa' },
        { href: vodiciHref('usporedba-fiskalizacija-1-2'), title: 'Fiskalizacija 1.0 vs 2.0' },
      ]}
    >
      <p>
        <strong>Paušalist izvan PDV sustava</strong> ne obračunava PDV na izlazne račune
        dok je ispod praga od 60.000 € godišnjih primitaka. To ne znači da nema drugih
        obveza — napomena na računima, zaprimanje eRačuna od 1.1.2026. i izdavanje od
        1.1.2027. i dalje vrijede.
      </p>
      <p>
        Ovaj vodič (u pripremi) objašnjava što znači biti izvan PDV-a, kako to utječe na
        račune i koje su obveze prema fiskalizaciji 2.0. Za PDV ID broj (različit od
        ulaska u PDV) vidi{' '}
        <Link href={vodiciHref('pdv-id')}>PDV ID broj</Link>.
      </p>
      <p>
        Prag primitaka prati se kroz{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR</Link> — prelazak mijenja cijeli
        model poslovanja.
      </p>

      <h2 id='izvan-pdv'>Paušalist izvan PDV-a</h2>
      <p>
        Na računima paušalista izvan PDV-a stoji napomena da PDV nije obračunan prema
        čl. 90. st. 2. Zakona o PDV-u (ili ekvivalentna formulacija). To ne oslobađa od
        ostalih obveza — KPR, doprinosi, paušalni porez i fiskalizacija i dalje vrijede.
      </p>
      <p>
        Od 1.1.2026. moraš zaprimati eRačune; od 1.1.2027. izdavati ih u propisanom
        formatu. Detalji u{' '}
        <Link href={vodiciHref('fiskalizacija-20')}>fiskalizacija 2.0</Link> i{' '}
        <Link href={vodiciHref('usporedba-fiskalizacija-1-2')}>
          usporedba fiskalizacija 1.0 vs 2.0
        </Link>
        .
      </p>
      <p>
        Pun sadržaj s primjerima računa i rokovima bit će dodan u sljedećoj verziji vodiča.
      </p>

      <h2 id='alat'>Korisni alat</h2>
      <p>
        Prati koliko si blizu praga od 60.000 € s{' '}
        <Link href='/alati/pdv-prag' className='text-[#0d9488] hover:underline'>
          PDV prag kalkulatorom
        </Link>{' '}
        — unaprijed znaš kad trebaš planirati ulazak u PDV sustav.
      </p>
    </GuideShell>
  );
}

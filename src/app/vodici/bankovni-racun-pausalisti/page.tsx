import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'bankovni-racun-pausalisti';

const META_DESC =
  'Moraš li odvojiti poslovni i privatni račun? Žiro vs tekući, troškovi, rizici miješanja i kako Porezna gleda na to.';

export const metadata: Metadata = {
  title: 'Bankovni račun za paušaliste: poslovni vs privatni',
  description: META_DESC,
  openGraph: {
    title: 'Bankovni račun za paušaliste: poslovni vs privatni | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Mora li paušalist imati poslovni račun?',
    answer:
      'Za naplatu usluga i roba putem transakcijskog računa potreban je poslovni (žiro) račun vezan uz obrt. Detalji o obvezi odvajanja od privatnog računa bit će prošireni u punoj verziji vodiča.',
  },
  {
    question: 'Može li paušalist koristiti privatni tekući račun za posao?',
    answer:
      'Miješanje privatnog i poslovnog prometa stvara rizike pri kontroli i evidenciji. Preporučuje se odvojen poslovni račun — puni vodič objašnjava zašto.',
  },
  {
    question: 'Koliko košta poslovni račun za obrt?',
    answer:
      'Troškovi ovise o banci i paketu. Usporedba žiro vs tekući i tipičnih naknada bit će dodana u proširenoj verziji.',
  },
];

export default function BankovniRacunPausalistiPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Bankovni račun za paušaliste: poslovni vs privatni'
      subtitle='Moraš li odvojiti poslovni i privatni račun? Žiro vs tekući, troškovi, rizici miješanja i kako Porezna gleda na to.'
      readingMinutes={10}
      metaDescription={META_DESC}
      toc={[{ id: 'odvajanje', label: 'Poslovni vs privatni račun' }]}
      faq={faq}
      related={[
        { href: vodiciHref('prvi-koraci-nakon-obrta'), title: 'Prvi koraci' },
        { href: vodiciHref('kpr-knjiga-prometa'), title: 'KPR knjiga prometa' },
        { href: vodiciHref('po-sd-obrazac'), title: 'PO-SD obrazac' },
        { href: vodiciHref('sjediste-obrta-vs-prebivaliste'), title: 'Sjedište vs prebivalište' },
        { href: vodiciHref('pausalni-obrt-vodic'), title: 'Paušalni obrt vodič' },
      ]}
    >
      <p>
        <strong>Bankovni račun za paušaliste</strong> jedno je od prvih pitanja nakon
        otvaranja obrta: moraš li imati odvojen poslovni račun ili možeš primati uplate na
        privatni tekući? Žiro vs tekući, troškovi otvaranja i vođenja te rizici miješanja
        privatnog i poslovnog prometa — sve to pokriva ovaj vodič (u pripremi).
      </p>
      <p>
        Za paušaliste koji primaju uplate na transakcijski račun, poslovni IBAN ide na
        račune i u{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR</Link>. Porezna pri kontroli
        gleda jasno odvajanje primitaka obrta od privatnih transakcija.
      </p>
      <p>
        Ako si tek otvorio obrt, prvo pročitaj{' '}
        <Link href={vodiciHref('prvi-koraci-nakon-obrta')}>prve korake nakon obrtnice</Link>{' '}
        pa se vrati ovdje za detalje o bankovnom računu.
      </p>

      <h2 id='odvajanje'>Poslovni vs privatni račun</h2>
      <p>
        Poslovni (žiro) račun služi za primitke i rashode obrta. Privatni tekući račun
        nije namijenjen poslovnom prometu — miješanje otežava vođenje KPR-a, godišnji{' '}
        <Link href={vodiciHref('po-sd-obrazac')}>PO-SD</Link> i eventualnu kontrolu
        Porezne uprave.
      </p>
      <p>
        U praksi mnogi paušalisti otvaraju žiro račun u banci po izboru, s IBAN-om koji
        stavlja na račune. Razlika između žiro i tekućeg računa, troškovi i što banka
        traži pri otvaranju bit će detaljno objašnjeno u punoj verziji vodiča.
      </p>
      <p>
        Za adresu na računu i u registrima vidi i{' '}
        <Link href={vodiciHref('sjediste-obrta-vs-prebivaliste')}>
          sjedište obrta vs prebivalište
        </Link>
        .
      </p>

      <h2 id='alat'>Korisni alat</h2>
      <p>
        Ako posluješ iz kućnog ureda, besplatna{' '}
        <Link href='/alati/izjava-pozajmnica' className='text-[#0d9488] hover:underline'>
          izjava o pozajmici poslovnog prostora
        </Link>{' '}
        pomaže pri registraciji adrese obrta kod banke i Porezne.
      </p>
    </GuideShell>
  );
}

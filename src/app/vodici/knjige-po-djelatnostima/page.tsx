import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'knjige-po-djelatnostima';

const META_DESC =
  'KPR za sve + dodatne knjige za ugostiteljstvo, trgovinu, turizam, OPG, graditeljstvo, frizere, prijevoditelje i taxi. Koje su obvezne, koje preporučene.';

export const metadata: Metadata = {
  title: 'Koje knjige mora voditi paušalist po djelatnostima',
  description: META_DESC,
  openGraph: {
    title: 'Koje knjige mora voditi paušalist po djelatnostima | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Koje knjige mora voditi svaki paušalist?',
    answer:
      'Knjiga prometa računa (KPR) obvezna je za sve paušaliste. Dodatne knjige ovise o djelatnosti — puni vodič objašnjava po sektorima.',
  },
  {
    question: 'Mora li ugostitelj voditi dodatne knjige osim KPR-a?',
    answer:
      'Ugostiteljstvo, trgovina i turizam često imaju specifične evidencije. Detaljna lista po djelatnostima bit će dodana u proširenoj verziji.',
  },
  {
    question: 'Trebam li knjigu tražbina?',
    answer:
      'Knjiga tražbina nije obvezna za sve paušaliste, ali je korisna kad imaš nenaplaćene račune. Vidi vodič o knjizi tražbina.',
  },
];

export default function KnjigePoDjelatnostimaPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Koje knjige mora voditi paušalist po djelatnostima'
      subtitle='KPR za sve + dodatne knjige za ugostiteljstvo, trgovinu, turizam, OPG, graditeljstvo, frizere, prijevoditelje i taxi. Koje su obvezne, koje preporučene.'
      readingMinutes={13}
      metaDescription={META_DESC}
      toc={[{ id: 'po-djelatnostima', label: 'Knjige po djelatnostima' }]}
      faq={faq}
      related={[
        { href: vodiciHref('kpr-knjiga-prometa'), title: 'KPR knjiga prometa' },
        { href: vodiciHref('pausalni-obrt-za-ugostitelje'), title: 'Paušalist ugostitelj' },
        { href: vodiciHref('pausalni-obrt-za-kozmeticare'), title: 'Paušalist kozmetičar' },
        { href: vodiciHref('knjiga-trazbi'), title: 'Knjiga tražbina' },
        { href: vodiciHref('izdavanje-racuna-vodic'), title: 'Izdavanje računa' },
      ]}
    >
      <p>
        <strong>Koje knjige mora voditi paušalist</strong> ovisi o djelatnosti. Svi
        paušalisti vode{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR — knjigu prometa računa</Link>,
        ali ugostiteljstvo, trgovina, turizam, OPG, graditeljstvo, frizeri, prijevoditelji
        i taxi imaju dodatne obveze ili preporučene evidencije.
      </p>
      <p>
        Ovaj vodič (u pripremi) daje pregled po djelatnostima: koje su knjige obvezne,
        koje preporučene i kako se povezuju s izdavanjem računa i godišnjim PO-SD
        obrascem.
      </p>
      <p>
        Za specifične djelatnosti vidi i vodiče za{' '}
        <Link href={vodiciHref('pausalni-obrt-za-ugostitelje')}>ugostitelje</Link> i{' '}
        <Link href={vodiciHref('pausalni-obrt-za-kozmeticare')}>kozmetičare</Link>.
      </p>

      <h2 id='po-djelatnostima'>Knjige po djelatnostima</h2>
      <p>
        KPR pokriva sve naplaćene račune — gotovina i bezgotovina. Po djelatnostima
        mogu se tražiti dodatne knjige: npr. evidencije za ugostiteljski objekt, turističku
        članarinu, graditeljske radove ili prijevoz putnika.
      </p>
      <p>
        Knjiga tražbina nije uvijek obvezna, ali je korisna kad klijenti kasne s plaćanjem
        — vidi{' '}
        <Link href={vodiciHref('knjiga-trazbi')}>knjiga tražbina</Link>. Za pravilno
        izdavanje računa i vezu s KPR-om pogledaj{' '}
        <Link href={vodiciHref('izdavanje-racuna-vodic')}>vodič za izdavanje računa</Link>.
      </p>
      <p>
        Detaljna tablica po djelatnostima bit će dodana u punoj verziji vodiča.
      </p>

      <h2 id='alat'>Korisni alat</h2>
      <p>
        Digitalno vođenje KPR-a olakšava svakodnevni rad — isprobaj{' '}
        <Link href='/alati/checklista' className='text-[#0d9488] hover:underline'>
          checklistu obveza
        </Link>{' '}
        da ne propustiš evidencije koje tvoja djelatnost zahtijeva.
      </p>
    </GuideShell>
  );
}

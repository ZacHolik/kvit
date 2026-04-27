import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'fina-certifikat-fiskalizacija';

const META_DESC =
  'FINA certifikat i Certilia za fiskalizaciju paušalnog obrta: što trebaš, cijene, rokovi izdavanja i tko ne treba digitalni certifikat za gotovinske račune.';

export const metadata: Metadata = {
  title: 'FINA certifikat za fiskalizaciju — kako nabaviti i koliko košta',
  description: META_DESC,
  openGraph: {
    title: 'FINA certifikat za fiskalizaciju | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Mogu li koristiti Certilia umjesto FINA certifikata?',
    answer:
      'Da — u praksi su oba puta valjana za fiskalizaciju kad program i posrednik podržavaju odabrani tip certifikata. Certilia je često brža i jeftinija; FINA PKI za poslovne subjekte formalno dolazi s FINA kanala. Uvijek provjeri kompatibilnost s programom koji koristiš.',
  },
  {
    question: 'Koliko traje izdavanje certifikata?',
    answer:
      'Za Certiliu putem online servisa često je rok reda veličine 1–2 radna dana, ovisno o validaciji identiteta. FINA postupak može biti sporiji jer uključuje narudžbu i obradu na fina.hr.',
  },
  {
    question: 'Što ako imam i jedan gotovinski i ostale transakcijske račune?',
    answer:
      'Čim imaš gotovinski primitak u prometu koji podliježe fiskalizaciji, obveza certifikata i povezanog sustava obično nastaje odmah — ne možeš “odabrati” samo transakcijski dio ako gotovina postoji.',
  },
  {
    question: 'Gdje provjeriti točne cijene?',
    answer:
      'Cijene i tarife se mijenjaju — provjeri na fina.hr i kod Certilie (cert.fisk.hr / certilia.com) neposredno prije kupnje ili obnove.',
  },
];

export default function FinaCertifikatFiskalizacijaPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='FINA certifikat za fiskalizaciju — kako nabaviti i koliko košta'
      subtitle='Digitalni certifikat za gotovinske račune: Certilia vs FINA, troškovi i što dalje.'
      readingMinutes={8}
      metaDescription={META_DESC}
      toc={[
        { id: 'uvod', label: 'Uvod' },
        { id: 'dva-certifikata', label: 'Koja su dva certifikata?' },
        { id: 'sto-trebas', label: 'Što trebaš za nabavu?' },
        { id: 'sto-se-placa', label: 'Što se plaća?' },
        { id: 'tko-ne-treba', label: 'Tko NE treba certifikat?' },
        { id: 'nakon-nabave', label: 'Što nakon nabave certifikata?' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('fiskalizacija-20'), title: 'Fiskalizacija 2.0 za paušaliste' },
        { href: vodiciHref('izdavanje-racuna'), title: 'Izdavanje računa u paušalnom obrtu' },
        { href: vodiciHref('izdavanje-racuna-vodic'), title: 'Vodič za izdavanje računa' },
        { href: vodiciHref('pausalni-obrt-vodic'), title: 'Paušalni obrt 2026.' },
      ]}
    >
      <h2 id='uvod'>Uvod</h2>
      <p>
        Svaki paušalni obrtnik koji naplaćuje <strong>gotovinom</strong> mora imati
        odgovarajući digitalni certifikat za fiskalizaciju (npr. putem Certilie ili FINA
        PKI za poslovne subjekte). Bez njega ne možeš legalno izdavati gotovinske
        račune u sustavu fiskalizacije. Širi kontekst rokova i B2C/B2B nalaziš u vodiču{' '}
        <Link href={vodiciHref('fiskalizacija-20')} className='text-[#0d9488] hover:underline'>
          Fiskalizacija 2.0 za paušaliste
        </Link>
        .
      </p>

      <h2 id='dva-certifikata'>Koja su dva certifikata?</h2>
      <ul>
        <li>
          <strong>Certilia</strong> (online servis vezan uz{' '}
          <a
            href='https://www.cert.fisk.hr'
            className='text-[#0d9488] hover:underline'
            rel='noopener noreferrer'
            target='_blank'
          >
            cert.fisk.hr
          </a>
          , odnosno{' '}
          <a
            href='https://www.certilia.com'
            className='text-[#0d9488] hover:underline'
            rel='noopener noreferrer'
            target='_blank'
          >
            certilia.com
          </a>
          ) — oko <strong>12 EUR</strong>, kupuje se online, tipično softverski certifikat,
          brza isporuka.
        </li>
        <li>
          <strong>FINA certifikat za poslovne subjekte</strong> — naručuje se na{' '}
          <a
            href='https://www.fina.hr'
            className='text-[#0d9488] hover:underline'
            rel='noopener noreferrer'
            target='_blank'
          >
            fina.hr
          </a>
          , proces je nešto sporiji od čiste online kupnje Certilie.
        </li>
      </ul>
      <p>
        <strong>Razlika:</strong> Certilia je brža i jeftinija u tipičnom scenariju; FINA
        je &quot;službeni&quot; kanal mnogih obrta — <strong>oba su valjana</strong> kad
        ih tvoj program za fiskalizaciju i posrednik prihvaćaju.
      </p>

      <h2 id='sto-trebas'>Što trebaš za nabavu?</h2>
      <ul>
        <li>
          <strong>eOsobna</strong> ili aktivna Certilia (za identifikaciju / potpis).
        </li>
        <li>
          <strong>OIB obrta</strong>.
        </li>
        <li>
          <strong>Rok izdavanja:</strong> često reda veličine <strong>1–2 radna dana</strong>,
          ovisno o kanalu i provjeri identiteta.
        </li>
      </ul>

      <h2 id='sto-se-placa'>Što se plaća?</h2>
      <ul>
        <li>
          <strong>Certilia:</strong> oko <strong>12 EUR</strong> jednokratno (provjeri
          aktualni iznos prije plaćanja).
        </li>
        <li>
          <strong>FINA PKI registracija poslovnog subjekta:</strong> oko{' '}
          <strong>10,62 EUR + PDV ≈ 13,28 EUR</strong> (indikativno — provjeri tarifu na
          fina.hr).
        </li>
        <li>
          <strong>Godišnja obnova:</strong> ovisi o vrsti certifikata i tarifi — provjeri
          na fina.hr i kod pružatelja Certilie prije obnove.
        </li>
      </ul>
      <p className='text-sm text-[#94a3a0]'>
        Izvor istine za cijene i uvjete:{' '}
        <a
          href='https://www.fina.hr'
          className='text-[#0d9488] hover:underline'
          rel='noopener noreferrer'
          target='_blank'
        >
          fina.hr
        </a>{' '}
        i{' '}
        <a
          href='https://www.certilia.com'
          className='text-[#0d9488] hover:underline'
          rel='noopener noreferrer'
          target='_blank'
        >
          certilia.com
        </a>{' '}
        — provjeri sve iznose prije deploya u produkciju ili kupnje.
      </p>

      <h2 id='tko-ne-treba'>Tko NE treba certifikat?</h2>
      <p>
        Paušalci koji naplaćuju <strong>isključivo transakcijski</strong> (virman, kartica
        online) — u takvom modelu <strong>ne trebaju</strong> certifikat i fiskalizaciju
        gotovinskih računa na isti način kao gotovinska naplata. Ako imaš{' '}
        <strong>i jedan gotovinski primitak</strong>, obveza za certifikat i fiskalizaciju
        gotovinskog dijela <strong>nastaje odmah</strong>.
      </p>
      <p className='text-sm text-[#94a3a0]'>
        Granice B2C/B2B i rokovi (npr. 2026./2027.) detaljno su u{' '}
        <Link href={vodiciHref('fiskalizacija-20')} className='text-[#0d9488] hover:underline'>
          vodiču Fiskalizacija 2.0
        </Link>
        .
      </p>

      <h2 id='nakon-nabave'>Što nakon nabave certifikata?</h2>
      <ul>
        <li>Instaliraš certifikat u program za fiskalizaciju (prema uputama proizvođača).</li>
        <li>
          Program šalje <strong>ZKI</strong> i <strong>JIR</strong> na FINA servis pri
          svakom odgovarajućem gotovinskom računu.
        </li>
        <li>
          Na računu moraju biti navedeni <strong>JIR</strong> i <strong>ZKI</strong> kad
          zakon i tehnički okvir to zahtijevaju.
        </li>
      </ul>

      <div className='mt-8 rounded-2xl border border-[#0d9488]/40 bg-[#111716] p-6'>
        <p className='font-heading text-lg font-semibold text-[#e2e8e7]'>
          Kvik i fiskalizacija
        </p>
        <p className='mt-2 text-sm leading-relaxed text-[#b9c7c4]'>
          Kvik ima fiskalizaciju ugrađenu — nema ručnog podešavanja certifikata u odnosu
          na tipičan “DIY” tijek.
        </p>
        <Link
          href='/register'
          className='btn-cta-primary mt-4 inline-flex px-4 py-2.5 text-sm'
        >
          Registriraj se besplatno →
        </Link>
        <p className='mt-2 text-xs text-[#64748b]'>
          Ili otvori: {getSiteUrl()}/register
        </p>
      </div>
    </GuideShell>
  );
}

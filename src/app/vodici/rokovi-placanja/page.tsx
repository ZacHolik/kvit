import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'rokovi-placanja';

const META_DESC =
  'Rokovi plaćanja paušalni obrt 2026.: doprinosi do 15. u mjesecu, porez 31.3./30.6./30.9./31.12., PO-SD do 15.1., HOK nakon 2+ godine obrta — cheat sheet.';

export const metadata: Metadata = {
  title: 'Rokovi plaćanja paušalni obrt 2026',
  description: META_DESC,
  openGraph: {
    title: 'Rokovi plaćanja paušalni obrt 2026 | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Kada se plaćaju doprinosi za paušalni obrt?',
    answer:
      'U standardnom modelu samostalnog paušalnog obrta doprinosi se plaćaju do 15. u mjesecu za prethodni mjesec. Iznos koji se u praksi najčešće navodi je 290,98 € mjesečno (119,58 + 39,86 + 131,54 €).',
  },
  {
    question: 'Kada se plaća paušalni porez na dohodak?',
    answer:
      'Porez na dohodak u paušalnom obrtu plaća se na kraju svakog tromjesečja: do 31. ožujka, 30. lipnja, 30. rujna i 31. prosinca. Iznos ovisi o razredu primitaka u prethodnoj godini — vidi tablicu u vodiču i kalkulator na Kviku.',
  },
  {
    question: 'Do kada se predaje PO-SD?',
    answer:
      'PO-SD se predaje do 15. siječnja za prethodnu godinu; u praksi se najčešće predaje putem ePorezne.',
  },
  {
    question: 'Što je HOK doprinos i kada se plaća?',
    answer:
      'Ako si obrtnik više od dvije godine, uz ostale obveze dolazi i obavezno članstvo u obrtničkoj komori (HOK) — redovita stavka u pregledu godišnjih troškova obrta. Točan iznos i način uplate prati službene obavijesti komore.',
  },
  {
    question: 'Postoji li kazna za kašnjenje?',
    answer:
      'Kašnjenje može donijeti zatezne kamate i administrativne komplikacije. U praksi se savjetuje odmah platiti i sačuvati dokaz uplate.',
  },
];

export default function RokoviPlacanjaPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Rokovi plaćanja paušalni obrt 2026. — svi rokovi'
      subtitle='Jedan cheat sheet: doprinosi, kvartalni porez, PO-SD, TZ1 gdje vrijedi, plus razlika kad si i zaposlen.'
      readingMinutes={9}
      metaDescription={META_DESC}
      toc={[
        { id: 'cheat', label: 'Cheat sheet — datumi u jednoj tablici' },
        { id: 'doprinosi', label: 'Doprinosi (samostalni)' },
        { id: 'porez', label: 'Paušalni porez (kvartalno)' },
        { id: 'po-sd', label: 'PO-SD obrazac' },
        { id: 'hok', label: 'HOK i ostale godišnje stavke' },
        { id: 'zaposlenje', label: 'Samostalni vs uz zaposlenje' },
        { id: 'propust', label: 'Što ako propustiš rok' },
        { id: 'alati', label: 'Podsjetnici i checkliste' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('doprinosi'), title: 'Doprinosi za paušalni obrt' },
        { href: vodiciHref('po-sd-obrazac'), title: 'PO-SD obrazac' },
        { href: vodiciHref('doprinosi-uz-posao'), title: 'Doprinosi uz zaposlenje' },
      ]}
    >
      <p>
        Tražiš <strong>rokovi plaćanja paušalni obrt 2026</strong> na jednom mjestu.
        Donji sažetak služi kao radni list; brojke i raspored usklađeni su s našim
        vodičima i alatima za 2026.:{' '}
        <Link href={vodiciHref('pausalni-obrt-vodic')} className='text-[#0d9488] hover:underline'>
          paušalni obrt 2026.
        </Link>
        ,{' '}
        <Link href='/alati/kalkulator-poreza' className='text-[#0d9488] hover:underline'>
          kalkulator paušalnog poreza
        </Link>{' '}
        i{' '}
        <Link href={vodiciHref('doprinosi')} className='text-[#0d9488] hover:underline'>
          plaćanje doprinosa
        </Link>
        .
      </p>

      <h2 id='cheat'>Cheat sheet — datumi u jednoj tablici</h2>
      <div className='my-6 overflow-x-auto rounded-xl border border-[#1f2a28] bg-[#111716] text-sm'>
        <table className='min-w-full border-collapse text-left'>
          <thead>
            <tr className='border-b border-[#1f2a28] text-[#94a3a0]'>
              <th className='px-3 py-2 font-medium'>Obveza</th>
              <th className='px-3 py-2 font-medium'>Rok / ritam</th>
              <th className='px-3 py-2 font-medium'>Napomena</th>
            </tr>
          </thead>
          <tbody className='text-[#d5dfdd]'>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>Doprinosi (samostalni obrt)</td>
              <td className='px-3 py-2'>Do 15. u mjesecu</td>
              <td className='px-3 py-2'>Za prethodni mjesec; fiksni iznosi poput 290,98 €</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>Paušalni porez</td>
              <td className='px-3 py-2'>31.3., 30.6., 30.9., 31.12.</td>
              <td className='px-3 py-2'>Kvartalni iznosi ovise o razredu primitaka</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>PO-SD</td>
              <td className='px-3 py-2'>Do 15. siječnja</td>
              <td className='px-3 py-2'>Za prethodnu godinu</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>TZ1 (turistička članarina)</td>
              <td className='px-3 py-2'>Do 15. siječnja</td>
              <td className='px-3 py-2'>Ako si obveznik prema djelatnosti / pravilima TZ</td>
            </tr>
            <tr>
              <td className='px-3 py-2'>HOK članstvo</td>
              <td className='px-3 py-2'>Godišnje / prema komori</td>
              <td className='px-3 py-2'>Obavezno ako si obrtnik više od 2 godine (prema praksi komore)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id='doprinosi'>Doprinosi (samostalni)</h2>
      <p>
        Fiksni mjesečni doprinosi za tipičan paušalni obrt u 2026. godini zbroje se na{' '}
        <strong>290,98 €</strong> (1. stup 119,58 €, 2. stup 39,86 €,
        zdravstveno 131,54 €). Rok je <strong>do 15. u mjesecu za prethodni mjesec</strong>.
        To znači da si u siječnju odgovoran za prosinac, u veljači za siječanj i tako
        redom. Vikendi i blagdani mogu pomaknuti praktičan zadnji dan — zato mnogi
        postavljaju trajni nalog ili podsjetnik tjedan dana ranije.
      </p>

      <h2 id='porez'>Paušalni porez (kvartalno)</h2>
      <p>
        Paušalni porez na dohodak plaća se na kraju svakog tromjesečja: prvi put do{' '}
        <strong>31. ožujka</strong>, zatim do <strong>30. lipnja</strong>,{' '}
        <strong>30. rujna</strong> i <strong>31. prosinca</strong>. Iznos za jedan kvartal
        ovisi o razredu koji proizlazi iz ukupnih primitaka u prethodnoj godini. Tablica
        razreda za 2026. (tromjesečni / godišnji) počinje s 50,85 € kvartalno za primitke
        do 11.300 € i ide do 270,00 € kvartalno za raspon 50.000,01–60.000,00 €. Isti
        raspored koristi i{' '}
        <Link href='/alati/kalkulator-poreza' className='text-[#0d9488] hover:underline'>
          Kvikov kalkulator paušalnog poreza
        </Link>{' '}
        — bitno je da tvoj zbroj KPR-a odgovara
        stvarno naplaćenom.
      </p>

      <h2 id='po-sd'>PO-SD obrazac</h2>
      <p>
        PO-SD je godišnji izvještaj o primitcima i plaćenom porezu. Predaja je{' '}
        <strong>do 15. siječnja</strong> za prethodnu godinu. Obrazac razdvaja
        gotovinske i bezgotovinske primitke — zato je redovan unos u{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR</Link> ključan. Detaljan vodič
        imaš na <Link href={vodiciHref('po-sd-obrazac')}>PO-SD stranici</Link>.
      </p>

      <h2 id='hok'>HOK i ostale godišnje stavke</h2>
      <p>
        Obrtnici koji posluju duže od <strong>dvije godine</strong> često imaju obvezu
        obaveznog članstva u obrtničkoj komori (HOK). To nije isti kalendarski dan kao
        doprinosi — stavi ga kao zasebnu stavku u godišnjem planu troškova. Ako si u
        turizmu ili povezanim djelatnostima, paralelno pratiš i TZ1 (također do 15.
        siječnja kada vrijedi obveza).
      </p>

      <h2 id='zaposlenje'>Samostalni vs uz zaposlenje</h2>
      <p>
        Kad si uz obrt zaposlen kod drugog poslodavca, doprinosi za obrt idu drugačije:
        godišnje, prema rješenju, u roku od 15 dana od primitka — vidi naš članak{' '}
        <Link href={vodiciHref('doprinosi-uz-posao')}>doprinosi uz posao</Link>. Ne
        mijenja se kvartalni porez na dohodak iz paušalnog obrta po istom principu datuma
        kao gore, ali si dužan znati koji modus živiš kako ne bi slučajno “preskočio”
        godišnje doprinose misleći da si pokriven samo plaćom.
      </p>

      <h2 id='propust'>Što ako propustiš rok</h2>
      <p>
        Najbolja strategija: uplata čim primijetiš propust + dokumentacija. Kratko
        kašnjenje kod doprinosa obično znači manje kamate, ali to nije garancija u svim
        slučajevima. Za porez i obrasce uvijek provjeri stanje na ePoreznoj. Ako ti je
        obrt u rastu, paralelno prati i blizinu limita od <strong>60.000 €</strong>{' '}
        primitaka godišnje jer prelazak mijenja PDV status — to je ključna granica za
        paušaliste.
      </p>

      <h2 id='alati'>Podsjetnici i checkliste</h2>
      <p>
        Besplatni alati na Kviku:{' '}
        <Link href='/alati/rok-podsjetnici' className='text-[#0d9488] hover:underline'>
          rok podsjetnici
        </Link>{' '}
        i{' '}
        <Link href='/alati/checklista' className='text-[#0d9488] hover:underline'>
          checklista
        </Link>
        . Kombiniraj ih s ovim cheat sheetom: jednom mjesečno provjeri doprinos, svaka
        tri mjeseca porez, jednom godišnje PO-SD (+ TZ1 ako treba), a HOK držiš na radaru
        čim ispunjavaš uvjet dvije godine. Za registraciju aplikacije koja drži KPR i
        račune otvori <Link href='/register'>Kvik</Link>.
      </p>
    </GuideShell>
  );
}

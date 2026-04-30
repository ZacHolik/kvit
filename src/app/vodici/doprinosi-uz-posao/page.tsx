import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'doprinosi-uz-posao';

const META_DESC =
  'Doprinosi paušalni obrt uz posao 2026.: godišnje rješenje Porezne, rok 15 dana od primitka rješenja, tablica iznosa po razredu primitaka — sažetak uz službene izvore.';

export const metadata: Metadata = {
  title: 'Doprinosi paušalni obrt uz posao',
  description: META_DESC,
  openGraph: {
    title: 'Doprinosi paušalni obrt uz posao | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Moram li plaćati doprinose ako sam već zaposlen?',
    answer:
      'Ako si zaposlen kod drugog poslodavca, doprinosi za paušalni obrt ne idu mjesečno kao kod tipičnog samostalnog paušaliste, nego jednom godišnje prema rješenju Porezne uprave. Iznos na rješenju ovisi o primitcima obrta u prethodnoj godini.',
  },
  {
    question: 'Kada stižu rješenje Porezne za godišnji doprinos?',
    answer:
      'U praksi rješenje za godišnje doprinose uz zaposlenje često stiže na početku sljedeće godine za prethodnu godinu poslovanja. Ako obrt otvoriš unutar godine, doprinose također plaćaš po rješenju za tu nepotpunu godinu.',
  },
  {
    question: 'Koliko iznosi godišnji doprinos uz zaposlenje?',
    answer:
      'Iznosi su vezani uz raspon godišnjih primitaka obrta. Primjerice, za primitke 0–11.300 € godišnje navode se 127,13 € (1. stup), 42,38 € (2. stup) i 127,13 € (zdravstveno). Za više razreda vidi tablicu u vodiču i službeni članak o osnovicama u Narodnim novinama.',
  },
  {
    question: 'Što se dogodi ako ne platim na vrijeme?',
    answer:
      'Kašnjenje može donijeti zatezne kamate. Kratko kašnjenje obično znači manje kamate, ali je pravilo uvijek pravovremena uplata i arhiviranje potvrde.',
  },
  {
    question: 'Mogu li imati paušalni obrt i puno radno vrijeme?',
    answer:
      'Da — kombinacija paušalnog obrta i zaposlenja moguća je i česta za testiranje vlastitog posla. Doprinosi i porez tada se ne ponašaju identično kao kod čistog paušalnog obrta; prati rješenja i upute Porezne.',
  },
];

export default function DoprinosiUzPosaoPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Doprinosi paušalni obrt uz posao 2026.'
      subtitle='Kad uz obrt imaš i poslodavca: godišnji obračun, rješenje Porezne i točni iznosi iz javnih tablica — ne “oko slova”.'
      readingMinutes={9}
      metaDescription={META_DESC}
      toc={[
        { id: 'razlika', label: 'Samostalan obrt vs uz zaposlenje' },
        { id: 'rjesenje', label: 'Godišnje rješenje i rok uplate' },
        { id: 'iznosi', label: 'Tablica iznosa za 2026. (uz posao)' },
        { id: 'kasnjenje', label: 'Što ako zakasniš' },
        { id: 'greske', label: 'Česte greške' },
        { id: 'alat', label: 'Alat za uplate' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('doprinosi'), title: 'Doprinosi' },
        { href: vodiciHref('otvaranje-obrta'), title: 'Otvaranje obrta' },
        { href: vodiciHref('pausalni-obrt-za-it-freelancere'), title: 'Paušalni obrt za IT freelancere' },
        { href: vodiciHref('rokovi-placanja'), title: 'Rokovi plaćanja' },
      ]}
      howTo={{
        name: 'Plaćanje godišnjih doprinosa uz zaposlenje',
        description:
          'Tijek nakon što dobiješ rješenje Porezne uprave za doprinose paušalnog obrta uz radni odnos.',
        steps: [
          {
            name: 'Provjeri rješenje',
            text: 'Na rješenju piše točan iznos i rok (često 15 dana od primitka).',
          },
          {
            name: 'Pripremi tri uplate ili PKK',
            text: 'Koristi IBAN, model i poziv na broj prema uputi ili generatoru uplatnica.',
          },
          {
            name: 'Uplati u roku',
            text: 'Spremi PDF potvrde i poveži s godišnjim mapom obrta.',
          },
          {
            name: 'Planiraj iduću godinu',
            text: 'Prati primitke jer razred primitaka mijenja godišnje iznose doprinosa.',
          },
        ],
      }}
    >
      <p>
        Ključna riječ <strong>doprinosi paušalni obrt uz posao</strong> danas znači: ne
        kopiraj mjesečni model kolege koji radi samo kroz obrt. Naši vodiči{' '}
        <Link href={vodiciHref('doprinosi')} className='text-[#0d9488] hover:underline'>
          doprinosi za paušalni obrt
        </Link>{' '}
        i{' '}
        <Link href={vodiciHref('pausalni-obrt-vodic')} className='text-[#0d9488] hover:underline'>
          paušalni obrt 2026.
        </Link>{' '}
        razdvajaju dva svijeta: samostalni paušalist koji do 15. u mjesecu plaća fiksne
        mjesečne doprinose, i obrtnik koji je već pokriven mirovinskim i zdravstvenim
        dijelom kroz plaću. U drugom scenariju država želi izbjeći dvostruko
        &quot;puno&quot; osiguranje, ali i rupu — zato postoji godišnji presjek.
      </p>

      <h2 id='razlika'>Samostalan obrt vs uz zaposlenje</h2>
      <p>
        Kad si isključivo na obrtu, standard koji se u praksi najčešće spominje je{' '}
        <strong>290,98 €</strong> mjesečno do 15. u mjesecu za prethodni mjesec, od
        čega <strong>119,58 €</strong> ide na prvi stup mirovinskog,{' '}
        <strong>39,86 €</strong> na drugi stup i <strong>131,54 €</strong> na
        zdravstveno — to su brojke koje se u praksi najčešće navode za 2026. Kad uz to
        imaš i radni odnos, dio tih obveza već &quot;ulazi&quot; kroz obračun plaće.
        Paušalni obrt i dalje ima vlastitu osnovicu, ali se način plaćanja mijenja: umjesto
        dvanaest jednakih rata, dolazi <strong>jedna godišnja obveza</strong> prema
        rješenju, s rokom koji se u istom izvoru opisuje kao <strong>15 dana od primitka
        rješenja</strong>.
      </p>
      <p>
        Praktična posljedica: kalendar u glavi mora imati dva modusa. U samostalnom
        obrtu si naviknuo na 15. u mjesecu; uz zaposlenje moraš paziti na pismo
        Porezne, jer se iznos ne čita iz &quot;isti kao prošli mjesec&quot;, nego iz
        primitaka koje si ostvario kroz obrt u protekloj godini. Zato je KPR i zbroj
        računa i dalje kritičan — bez njega ne vidiš u koji razred primitaka padaš.
      </p>

      <h2 id='rjesenje'>Godišnje rješenje i rok uplate</h2>
      <p>
        Uobičajeno je da se uz zaposlenje kod drugog poslodavca doprinosi za paušalni
        obrt plaćaju <strong>jednom godišnje</strong> i da je rok{' '}
        <strong>15 dana od primitka rješenja</strong> Porezne uprave. Na samom rješenju
        piše koliko točno trebaš uplatiti. Ako si obrt otvorio unutar kalendarske godine
        i nisi cijelu godinu poslovao kao paušalist, i tada se doprinose plaćaju{' '}
        <strong>po rješenju</strong>, koje stiže na početku sljedeće
        godine za prethodnu godinu. To je bitno za ljude koji krenu paralelno s
        poslom i žele legalno fakturirati već u prvom mjesecu, ali nemaju punih dvanaest
        mjeseci obrta.
      </p>
      <p>
        Rješenje nije “račun za struju”: treba ga pročitati, provjeriti OIB, razdoblje
        i podjelu na stupove. Ako nešto ne štima, službeni kanal je Porezna (npr. Pišite
        nam), a ne forum bez datuma. Za porezni kontekst cijelog obrta vidi i{' '}
        <Link href={vodiciHref('pausalni-obrt-vodic')}>paušalni obrt 2026.</Link> te{' '}
        <Link href={vodiciHref('po-sd-obrazac')}>PO-SD</Link>, jer su primitci isti
        podaci koji kasnije ulaze u godišnje izvještaje.
      </p>

      <h2 id='iznosi'>Tablica iznosa za 2026. (uz posao)</h2>
      <p>
        Sljedeća tablica prikazuje uobičajene godišnje iznose doprinosa za obrt uz
        zaposlenje (po rasponu primitaka obrta u prethodnoj godini). Brojevi su u eurima;
        prije uplate uvijek uskladi s rješenjem Porezne i aktualnim službenim tablicama:
      </p>
      <div className='my-6 overflow-x-auto rounded-xl border border-[#1f2a28] bg-[#111716] text-sm'>
        <table className='min-w-full border-collapse text-left'>
          <caption className='border-b border-[#1f2a28] px-4 py-3 text-left text-xs text-[#94a3a0]'>
            Godišnji doprinosi uz zaposlenje (2026., informativno)
          </caption>
          <thead>
            <tr className='border-b border-[#1f2a28] text-[#94a3a0]'>
              <th className='px-3 py-2 font-medium'>Rang primitaka (€)</th>
              <th className='px-3 py-2 font-medium'>MIO I stup</th>
              <th className='px-3 py-2 font-medium'>MIO II stup</th>
              <th className='px-3 py-2 font-medium'>Zdravstveno</th>
            </tr>
          </thead>
          <tbody className='text-[#d5dfdd]'>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>0,00 – 11.300,00</td>
              <td className='px-3 py-2'>127,13 €</td>
              <td className='px-3 py-2'>42,38 €</td>
              <td className='px-3 py-2'>127,13 €</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>11.300,01 – 15.300,00</td>
              <td className='px-3 py-2'>172,13 €</td>
              <td className='px-3 py-2'>57,38 €</td>
              <td className='px-3 py-2'>172,13 €</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>15.300,01 – 19.900,00</td>
              <td className='px-3 py-2'>223,88 €</td>
              <td className='px-3 py-2'>74,63 €</td>
              <td className='px-3 py-2'>223,88 €</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>19.900,01 – 30.600,00</td>
              <td className='px-3 py-2'>344,25 €</td>
              <td className='px-3 py-2'>114,75 €</td>
              <td className='px-3 py-2'>344,25 €</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>30.600,01 – 40.000,00</td>
              <td className='px-3 py-2'>450,00 €</td>
              <td className='px-3 py-2'>150,00 €</td>
              <td className='px-3 py-2'>450,00 €</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>40.000,01 – 50.000,00</td>
              <td className='px-3 py-2'>562,00 €</td>
              <td className='px-3 py-2'>187,00 €</td>
              <td className='px-3 py-2'>562,50 €</td>
            </tr>
            <tr>
              <td className='px-3 py-2'>50.000,01 – 60.000,00</td>
              <td className='px-3 py-2'>675,00 €</td>
              <td className='px-3 py-2'>225,00 €</td>
              <td className='px-3 py-2'>675,00 €</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Osnovice u zakonskoj pozadini provjeri u službenom tekstu: Naredba o iznosima
        osnovica za obračun doprinosa za 2026. (
        <a
          href='https://narodne-novine.nn.hr/clanci/sluzbeni/2025_12_150_2237.html'
          className='text-[#0d9488] hover:underline'
          rel='noopener noreferrer'
          target='_blank'
        >
          NN
        </a>
        ). To je važno jer se tablice povremeno korigiraju — uvijek uzmi zadnju verziju
        prije uplate.
      </p>

      <h2 id='kasnjenje'>Što ako zakasniš</h2>
      <p>
        Kratko kašnjenje tipično znači manje zatezne kamate, ali to nije poziv na
        opuštanje: pravilo je platiti u roku iz
        rješenja. Ako zakažeš, uplati što prije, sačuvaj dokaz i provjeri stanje na
        ePoreznoj (PKK). Za samostalne paušaliste paralelno vrijedi disciplina do 15. u
        mjesecu — zato mnogi koriste zajednički podsjetnik za sve obveze.
      </p>

      <h2 id='greske'>Česte greške</h2>
      <p>
        Najčešća greška je tretiranje obrta kao da “već plaćam sve preko poslodavca” i
        zanemarivanje pisma Porezne. Druga je miješanje IBAN-a i modela između tri vrste
        doprinosa — svaka ima svoj kanal. Treća je zaboraviti da razred primitaka
        mijenja iznose: ako ti je obrt “skočio” u viši raspon, godišnji iznos na
        rješenju bit će veći. Zato kontinuirano pratiš KPR i zbroj računa, a ne samo
        stanje žiro računa.
      </p>

      <h2 id='alat'>Alat za uplate</h2>
      <p>
        Kvik ima alat za pripremu podataka o uplatama:{' '}
        <Link href='/alati/placanje-doprinosa' className='text-[#0d9488] hover:underline'>
          Plaćanje doprinosa
        </Link>
        . Kombiniraj ga s ovim vodičem i službenim rješenjem — alat štedi vrijeme, ali
        iznos uvijek mora odgovarati rješenju ili aktualnoj tablici. Za širi kontekst
        pročitaj i{' '}
        <Link href={vodiciHref('doprinosi')}>doprinosi za paušalni obrt</Link> i{' '}
        <Link href={vodiciHref('rokovi-placanja')}>rokove plaćanja</Link>.
      </p>
    </GuideShell>
  );
}

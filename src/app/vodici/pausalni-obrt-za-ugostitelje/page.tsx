import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'pausalni-obrt-za-ugostitelje';

const META_DESC =
  'Paušalni obrt za ugostitelje 2026.: fiskalizacija za B2C, turistička članarina TZ1, sezona, limit 60.000 € i kada d.o.o. ima smisla.';

export const metadata: Metadata = {
  title: 'Paušalni obrt za ugostitelje',
  description: META_DESC,
  openGraph: {
    title: 'Paušalni obrt za ugostitelje | Kvit',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvit',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Može li kafić biti paušalni obrt?',
    answer:
      'Mnoge ugostiteljske djelatnosti mogu ići kroz obrt, ali paušalni režim ovisi o vrsti djelatnosti i o tome nisi li u izuzetku (npr. slobodna zanimanja). Prije otvaranja provjeri šifru djelatnosti i savjet stručnjaka.',
  },
  {
    question: 'Moram li imati fiskalnu blagajnu?',
    answer:
      'Prema Fiskalopediji, prema građanima (B2C) trebaš izdavati fiskalizirane račune. To znači program koji ispunjava zahtjeve fiskalizacije 2.0 — vidi vodič o fiskalizaciji.',
  },
  {
    question: 'Što je turistička članarina?',
    answer:
      'To je obveza prema turističkoj zajednici za određene djelatnosti koje imaju koristi od turizma. Fiskalopedija navodi da je osnovica u paušalnom obrtu ukupan primitak ako postoji barem jedan račun koji podliježe, te skupine djelatnosti s postotcima (npr. skupina s djelatnošću 56 plaća 0,14212% na godišnje primitke).',
  },
  {
    question: 'Kako voditi obrt sezonski?',
    answer:
      'Vodi KPR po naplati, planiraj kvartalni porez i razmisli o mirovanju obrta ako zimi uopće nećeš poslovati — vidi sezonski vodič.',
  },
  {
    question: 'Kada moram prijeći na d.o.o.?',
    answer:
      'Kad rasteš iznad limita paušala (60.000 € primitaka), kad trebaš zapošljavati tim s punim odnosima ili kad želiš ograničiti osobnu odgovornost — usporedi s vodičem paušal vs d.o.o.',
  },
];

export default function PauzalniObrtZaUgostiteljePage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Paušalni obrt za ugostitelje 2026.'
      subtitle='Gotovina, sezona, TZ1 i brzina kojom paušalni limit postaje stvaran problem.'
      readingMinutes={11}
      metaDescription={META_DESC}
      toc={[
        { id: 'model', label: 'Može li ugostitelj biti paušalist' },
        { id: 'fiskalizacija', label: 'Fiskalizacija i gotovina' },
        { id: 'tz', label: 'Turistička članarina' },
        { id: 'sezona', label: 'Sezonsko poslovanje' },
        { id: 'limit', label: 'Limit 60.000 €' },
        { id: 'doo', label: 'Kada je bolje d.o.o.' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('fiskalizacija-20'), title: 'Fiskalizacija 2.0' },
        { href: vodiciHref('sezonski-obrt'), title: 'Sezonski obrt' },
        { href: vodiciHref('pausalni-obrt-vs-doo'), title: 'Paušalni obrt vs d.o.o.' },
        { href: vodiciHref('zatvaranje-obrta'), title: 'Zatvaranje obrta' },
      ]}
    >
      <p>
        <strong>Paušalni obrt za ugostitelje</strong> zvuči jednostavno dok ne vidiš red
        ispred šanka u srpnju. I pored gužve, porezni okvir ostaje isti: doprinosi do 15.
        u mjesecu (290,98 € u samostalnom modelu prema Fiskalopediji), kvartalni paušalni
        porez, KPR, PO-SD do 15. siječnja i limit <strong>60.000 €</strong> godišnjih
        primitaka (
        <a
          href='https://fiskalopedija.hr/baza-znanja/pausalni-obrt'
          className='text-[#0d9488] hover:underline'
          rel='noopener noreferrer'
          target='_blank'
        >
          izvor
        </a>
        ). Specifično za ugostitelje su fiskalizacija prema građanima i turistička
        članarina.
      </p>

      <h2 id='model'>Može li ugostitelj biti paušalist</h2>
      <p>
        Paušalni obrt može biti privlačan za manje lokacije, catering iznajmlivanjem,
        food truck model ili sezonski bar. Ipak, čim zaposljavaš ljude, otvaraš više
        smjena ili ulaziš u veće najmove, često se pojavljuje d.o.o. kao fleksibilniji
        okvir. Obrt i dalje može ostati dobra opcija za solo kuhara, baristu ili mali
        desert bar koji drži troškove pod kontrolom.
      </p>

      <h2 id='fiskalizacija'>Fiskalizacija i gotovina</h2>
      <p>
        Fiskalopedija ističe da prema građanima trebaš izdavati fiskalizirane račune.
        Zato POS sustav ili mobilna aplikacija nisu “dodatak luksuzu” nego dio radnog
        mjesta. Za cjelinu rokova i tehnologije pročitaj{' '}
        <Link href={vodiciHref('fiskalizacija-20')}>fiskalizacija 2.0</Link> i{' '}
        <Link href={vodiciHref('izdavanje-racuna')}>izdavanje računa</Link>.
      </p>

      <h2 id='tz'>Turistička članarina</h2>
      <p>
        Prema Fiskalopedijinom vodiču za TZ1, članarina se plaća ako imaš registriranu
        djelatnost koja podliježe — uključujući ugostiteljske grupe poput djelatnosti
        pripreme i usluživanja hrane i pića (šifra 56 u prvoj skupini s stopom{' '}
        <strong>0,14212%</strong> na godišnje primitke). Rok za predaju TZ1 obrasca je{' '}
        <strong>do 15. siječnja</strong>. Ako nemaš prometa po obvezujućoj djelatnosti,
        i dalje se često predaje prazan obrazac — točno pravilo vidi u članku{' '}
        <a
          href='https://fiskalopedija.hr/baza-znanja/turisticka-clanarina-tz1-obrazac'
          className='text-[#0d9488] hover:underline'
          rel='noopener noreferrer'
          target='_blank'
        >
          Turistička članarina — TZ1
        </a>
        .
      </p>

      <h2 id='sezona'>Sezonsko poslovanje</h2>
      <p>
        Sezona donosi velike primitke u kratkom roku — što znači da brže nailaziš na
        viši paušalni razred poreza i na limit od 60.000 €. Zato je KPR kritičan već u
        kolovozu, ne u prosincu. Ako zimi ne radiš, razmisli o mirovanju obrta:{' '}
        <Link href={vodiciHref('sezonski-obrt')}>sezonski obrt</Link>.
      </p>

      <h2 id='limit'>Limit 60.000 €</h2>
      <p>
        Fiskalopedija naglašava da uz primitke do 60.000 € možeš ostati paušalist (uz
        ostale uvjete). Ugostitelji često brzo priđu tom broju jer je prosječna košarica
        mala, ali volumen velik. Kad se približiš, planiraj PDV status i eventualni prijelaz
        u knjige ili d.o.o. — ne čekaj zadnji tjedan godine.
      </p>

      <h2 id='doo'>Kada je bolje d.o.o.</h2>
      <p>
        d.o.o. ima smisla kad želiš investicije kroz tvrtku, zapošljavati redovito ili
        smanjiti osobnu odgovornost u ugovorima s dobavljačima. Paušal ostaje jeftiniji
        start, ali nije beskonačan. Usporedba je u{' '}
        <Link href={vodiciHref('pausalni-obrt-vs-doo')}>paušal vs d.o.o.</Link>. Za
        zatvaranje obrta ako mijenjaš oblik vidi{' '}
        <Link href={vodiciHref('zatvaranje-obrta')}>zatvaranje</Link>.
      </p>
      <p>
        HOK članstvo je još jedna stavka koja se pojavljuje kad obrt živi duže od dvije
        godine — Fiskalopedija to eksplicitno spominje uz ostale obveze paušalnog obrta.
        Ugostitelj koji raste često prijeđe tu crtu prije nego što osjeti, jer se prve
        godine “lete” oko otvaranja lokacije. Stavi HOK u isti godišnji kalendar kao TZ1
        i PO-SD kako ne bi bio iznenađenje.
      </p>
      <p>
        Gotovinske transakcije na šanku donose i više grešaka u KPR-u nego čisti B2B
        virman: sitni računi, napojnice, povrati. Zato je važno da POS sustav koji biraš
        dobro izvozi evidenciju ili da ručno svaki dan zatvaraš smjenu. Što manje
        “ručnih” razlika između blagajne i žiro računa, to lakši siječanj.
      </p>
      <p>
        Za fiskalizaciju i račune u jednom alatu pogledaj <Link href='/register'>Kvit</Link>.
      </p>
    </GuideShell>
  );
}

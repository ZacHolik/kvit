import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'kpr-online-generator';

const META_DESC =
  'KPR online paušalni obrt: što se upisuje, gotovina vs bezgotovina, greške i veza s PO-SD-om — praktičan pregled za paušaliste.';

export const metadata: Metadata = {
  title: 'KPR online paušalni obrt',
  description: META_DESC,
  openGraph: {
    title: 'KPR online paušalni obrt | Kvit',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvit',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Što se upisuje u KPR?',
    answer:
      'Knjiga prometa računa bilježi primitke — uplate na žiro, gotovina i kartične uplate koje su vezane uz izdane račune.',
  },
  {
    question: 'Mogu li voditi KPR u Excelu?',
    answer:
      'Da, ako tablica ima jasna pravila i backup. Digitalni alati smanjuju greške i povezuju KPR izravno s izdanim računima.',
  },
  {
    question: 'Kada moram upisati račun u KPR?',
    answer:
      'Uobičajena je preporuka upisivati račune na kraju dana. Praksa “sve na kraju mjeseca” povećava rizik pogreške i stresa u siječnju.',
  },
  {
    question: 'Koje su najčešće greške u KPR-u?',
    answer:
      'Miješanje izdanog i naplaćenog iznosa, zaborav kartičnih uplata, kriva podjela gotovina/bezgotovina i odgađanje unosa.',
  },
  {
    question: 'Kako KPR pomaže pri PO-SD obrascu?',
    answer:
      'PO-SD sumira naplaćene primitke po kanalima — točno ono što si tijekom godine trebao zbrajati u KPR-u. Zato digitalni KPR štedi sate u siječnju.',
  },
];

export default function KprOnlineGeneratorPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='KPR online — kako voditi knjige prometa digitalno'
      subtitle='Manje Excela, više automatskog zbrajanja — posebno prije roka za PO-SD.'
      readingMinutes={9}
      metaDescription={META_DESC}
      toc={[
        { id: 'sto', label: 'Što ide u KPR' },
        { id: 'kanali', label: 'Gotovina vs bezgotovinsko' },
        { id: 'kad', label: 'Kada upisati' },
        { id: 'greske', label: 'Najčešće greške' },
        { id: 'digital', label: 'Zašto digitalni KPR' },
        { id: 'po-sd', label: 'Veza s PO-SD-om' },
        { id: 'kvit', label: 'Kvit KPR modul' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('kpr-knjiga-prometa'), title: 'KPR knjiga prometa' },
        { href: vodiciHref('po-sd-obrazac'), title: 'PO-SD obrazac' },
        { href: vodiciHref('izdavanje-racuna'), title: 'Izdavanje računa' },
      ]}
    >
      <p>
        Pojam <strong>KPR online paušalni obrt</strong> danas znači: umjesto ručnog
        prepisivanja u PDF ili papir, koristiš aplikaciju koja iz izdanih računa gradi
        knjigu prometa. KPR je popis primitaka — uplate na žiro, gotovina, kartice — za
        svaki izdani račun; više u{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')} className='text-[#0d9488] hover:underline'>
          vodiču o KPR-u
        </Link>{' '}
        i u{' '}
        <Link href={vodiciHref('pausalni-obrt-vodic')} className='text-[#0d9488] hover:underline'>
          paušalnom obrtu 2026.
        </Link>
        . To je isti podatak koji na kraju godine ide u PO-SD do <strong>15. siječnja</strong>{' '}
        — vidi{' '}
        <Link href={vodiciHref('po-sd-obrazac')} className='text-[#0d9488] hover:underline'>
          PO-SD obrazac
        </Link>
        .
      </p>

      <h2 id='sto'>Što ide u KPR</h2>
      <p>
        Svaki naplaćeni račun treba imati red u KPR-u: datum, broj računa, iznos, način
        plaćanja (gotovina ili bezgotovina). Ako koristiš više valuta, prati konverziju
        prema pravilima koja si dogovorio s računovođom. Bitno je da KPR odražava stvarno
        stanje novca, ne “ugovoreni iznos”.
      </p>

      <h2 id='kanali'>Gotovina vs bezgotovinsko</h2>
      <p>
        PO-SD razdvaja primitke na gotovinske i bezgotovinske staze. Zato KPR mora biti
        konzistentan: kartica često ide u gotovinsku grupu u smislu kartičnog plaćanja
        licu mjesta, dok je virman na žiro obrta bezgotovinski. Pogrešna kolona znači da
        ćeš ručno ispravljati obrazac u siječnju.
      </p>

      <h2 id='kad'>Kada upisati</h2>
      <p>
        Unos na kraju dana sprječava gomilanje i zaborav
        pojedinih računa kad mjesečni broj transakcija poraste. Ako putuješ ili radiš na
        terenu, mobilni unos odmah nakon izdavanja računa je najmanje bolan način.
      </p>

      <h2 id='greske'>Najčešće greške</h2>
      <p>
        Najčešće je unos “kad stignem”, zatim dupli unos iste uplate, pa brisanje koje
        ostavi rupe u numeraciji. Druga greška je tretiranje avansa bez jasnog pravila —
        dogovori s računovođom kada avans postaje primitak. Treća je zanemarenje malih
        gotovinskih računa jer “nisu bitni” — zbrojeno jesu.
      </p>

      <h2 id='digital'>Zašto digitalni KPR</h2>
      <p>
        Digitalni KPR omogućuje filtriranje po mjesecima, izvoz u PDF i sinkronizaciju s
        alatom za račune. U siječnju, kad većina paušalista želi mir, automatski zbroj
        godišnjih primitaka je razlika između dva sata i dva dana ručnog zbrajanja.
      </p>

      <h2 id='po-sd'>Veza s PO-SD-om</h2>
      <p>
        PO-SD traži ukupne naplaćene primitke i podatke o plaćenom paušalnom porezu.
        Ako je KPR točan, samo prepisuješ agregate. Ako nije, PO-SD postaje noćna mora i
        rizik inspekcije. Zato KPR nije “papir za sebe”, nego frontend za godišnji obrazac.
      </p>

      <h2 id='kvit'>Kvit KPR modul</h2>
      <p>
        Kvit automatski puni KPR iz izdanih računa i omogućuje rad u pregledniku ili
        aplikaciji. Direktan link na KPR sučelje:{' '}
        <Link href='/kpr' className='text-[#0d9488] hover:underline'>
          KPR u Kvitu (/kpr)
        </Link>
        . Prije korištenja se{' '}
        <Link href='/register'>registriraj</Link> i poveži obrt. Za teoriju pročitaj još{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR vodič</Link>.
      </p>
      <p>
        Excel ili Google Sheet i dalje su legitimni ako voliš ručnu kontrolu, ali uvijek
        imaj zaključavanje verzija: “KPR_2026_final_v7.xlsx” je meme iz stvarnog života
        obrtnika. Online modul riješava verzije umjesto tebe i smanjuje šansu da slučajno
        editiraš siječanjski zbroj umjesto ožujkovskog lista.
      </p>
      <p>
        Siječanj je “tax season” za paušaliste jer se u istom mjesecu često zatvaraju i
        doprinosi za prosinac, i TZ1 gdje vrijedi, i mentalna priprema za PO-SD. Kad KPR
        živi digitalno cijelu godinu, taj mjesec postaje administrativni zadatak od nekoliko
        sati umjesto nekoliko vikenda. To je ROI koji se teško vidi u cijeni pretplate, ali
        se jako osjeti u životu.
      </p>
    </GuideShell>
  );
}

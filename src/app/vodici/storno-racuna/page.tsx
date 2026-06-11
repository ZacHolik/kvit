import type { Metadata } from 'next';

import { buildVodicMetadata } from '@/lib/og-metadata';
import Link from 'next/link';

import InlineCTA from '@/components/cta/InlineCTA';
import { vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'storno-racuna';

const META_DESC =
  'Pogrešan račun? Saznaj što je storno, kad je potreban i korak-po-korak kako ga provesti za paušalni obrt u 2026. Bez brisanja, bez tehničkog žargona.';

export const metadata: Metadata = buildVodicMetadata(
  SLUG,
  'Storno računa paušalni obrt',
  META_DESC,
  'Storno računa paušalni obrt | Kvik',
);

const faq = [
  {
    question: 'Mogu li jednostavno obrisati račun umjesto storniranja?',
    answer:
      'Ne. Jednom fiskalizirani račun se ne može obrisati. JIR koji je dobio od CIS-a ostaje u evidenciji Porezne uprave. Jedini ispravni put je storno.',
  },
  {
    question: 'Treba li storno račun isti JIR kao izvorni?',
    answer:
      'Ne. Storno račun dobiva vlastiti, novi JIR od CIS-a pri fiskalizaciji. Poziva se na izvorni račun brojem, ali su to dva zasebna dokumenta s dva zasebna JIR-a.',
  },
  {
    question: 'Mogu li stornirati račun iz prošle godine?',
    answer:
      'Da, zakon ne propisuje rok za storniranje. Preporučuje se učiniti to čim otkriješ pogrešku kako bi knjige bile uredne.',
  },
  {
    question: 'Je li storno račun obvezan u KPR-u?',
    answer:
      'Da. Storno se unosi u KPR kao zasebni redak s negativnim iznosom. U Kviku to ide automatski.',
  },
  {
    question: 'Što je s PDV-om na storno računu?',
    answer:
      'Paušalisti nisu u sustavu PDV-a pa PDV nije relevantan za B2C storno. Za eventualne B2B eRačune od 2027. — situacija je ista jer paušalisti ne obračunavaju PDV dok su ispod praga od 60.000 €.',
  },
  {
    question: 'Što ako kupac tvrdi da je izgubio izvorni račun?',
    answer:
      'Storno se provodi jednako — kroz sustav. Ako kupcu treba kopija izvornog računa, možeš mu je ispisati iz Kvika. Gubitak računa ne mijenja proceduru storna.',
  },
];

export default function StornoRacunaPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Storno računa paušalni obrt: kako ispraviti pogrešan račun'
      breadcrumbTitle='Storno računa'
      subtitle='Izdao si račun s krivim iznosom. Ili pogrešnim podacima kupca. Ili za uslugu koja nije ni nastala. Evo što točno radiš dalje — korak po korak, bez tehničkog žargona.'
      readingMinutes={6}
      metaDescription={META_DESC}
      toc={[
        { id: 'sto-je-storno', label: 'Što je storno računa i što nije' },
        { id: 'kada-koristis', label: 'Kada koristiš storno' },
        { id: 'kada-nije', label: 'Kada storno NIJE potreban' },
        { id: 'b2c-storno', label: 'Kako stornirati B2C račun (F1.0)' },
        { id: 'eracun-storno', label: 'Kako stornirati eRačun (F2.0)' },
        { id: 'kpr', label: 'Što se događa u KPR-u' },
        { id: 'korak-po-korak', label: 'Korak-po-korak: što radiš kad otkriješ pogrešku' },
        { id: 'edge-case', label: 'Edge case: kupac je već platio pogrešan iznos' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('izdavanje-racuna'), title: 'Kako izdati račun' },
        {
          href: vodiciHref('fiskalizacija-20'),
          title: 'Fiskalizacija 2.0 — eRačuni za paušaliste',
        },
        { href: vodiciHref('kpr-knjiga-prometa'), title: 'KPR — Knjiga prometa' },
        { href: vodiciHref('pausalni-obrt-vodic'), title: 'Paušalni obrt — kompletan vodič' },
      ]}
      howTo={{
        name: 'Storno računa paušalni obrt — korak po korak',
        description:
          'Što napraviti kad otkriješ pogrešku na već izdanom i fiskaliziranom računu.',
        steps: [
          {
            name: 'Pronađi izvorni račun',
            text: 'U Kviku: /racuni → pronađi račun s pogreškom.',
          },
          {
            name: 'Provjeri je li fiskaliziran',
            text: 'Fiskalizirani račun ima badge "Fiskalizirano" i JIR. Ako nije fiskaliziran — nemoj ga brisati, koristi retry ili se javi podršci.',
          },
          {
            name: 'Klikni "Storniraj"',
            text: 'Kvik automatski kreira storno s negativnim predznakom, ispravnim slijednim brojem i šalje fiskalizacijski zahtjev na CIS.',
          },
          {
            name: 'Izdaj novi ispravljeni račun',
            text: 'Nakon što je storno prošao, kreiraš novi račun s ispravnim podacima. On ide u KPR kao novi pozitivni redak.',
          },
          {
            name: 'Informiraj kupca',
            text: 'Pošalji kupcu storno i novi ispravljeni račun. Ako si primio plaćanje, a ispravljeni iznos je manji — vrati razliku.',
          },
        ],
      }}
    >
      <p>
        <strong>Storno računa paušalni obrt</strong> nije brisanje dokumenta nego
        službeni način ispravka pogreške na već izdanom računu. Ako si izdao račun s
        krivim iznosom, pogrešnim podacima kupca ili za uslugu koja nije nastala, jedini
        ispravan put je storno — novi dokument s negativnim predznakom koji poništava
        izvorni. U ovom vodiču prolazimo kada je storno potreban, kada nije, kako ga
        provesti za B2C i eRačune te što se događa u{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR-u</Link>.
      </p>

      <h2 id='sto-je-storno'>Što je storno računa i što nije</h2>
      <p>
        Storno računa je novi dokument koji poništava prethodno izdani račun. Račun se
        ne briše — jednom izdan i fiskaliziran dokument ostaje u evidenciji zauvijek.
        Ispravljaš ga novim dokumentom s negativnim predznakom.
      </p>
      <p>
        Ovo je temeljno pravilo: jednom fiskalizirani račun se ne mijenja naknadno. Ni
        iznos, ni podaci kupca, ni stavke. Sve izmjene idu kroz storno.
      </p>
      <p>
        Zakon o fiskalizaciji (NN 133/21 i NN 114/23) ne poznaje &quot;ispravak
        računa&quot; kao zasebni akt — postoji storno (poništenje) i, prema potrebi, novi
        ispravljeni račun.
      </p>

      <h2 id='kada-koristis'>Kada koristiš storno</h2>
      <p>Storno koristiš kad je nastala pogreška u sadržaju računa ili kad poslovni događaj nije nastao:</p>
      <ul>
        <li>Pogrešan iznos na računu (zaračunao si previše ili premalo)</li>
        <li>Pogrešna usluga ili stavka (drugačiji opis ili količina od dogovorenog)</li>
        <li>Krivi podaci o kupcu (ime, adresa, OIB)</li>
        <li>
          Usluga otkazana (kupac odustao, posao nije realiziran, a račun je već izdan)
        </li>
        <li>Duplikat računa (isti posao fakturiran dva puta)</li>
      </ul>

      <h2 id='kada-nije'>Kada storno NIJE potreban</h2>
      <p>
        Promjena načina plaćanja ne zahtijeva storno. Ako si izdao račun za gotovinsku
        uplatu, a kupac je platio bankovnim transferom (ili obrnuto), ne trebaš storno —
        možeš prijaviti promjenu načina plaćanja na već fiskalizirani račun. Porezna
        uprava je potvrdila da ova opcija ostaje dostupna i od 1. siječnja 2026. za B2C
        segmenat (prema FAQ Porezne uprave uz Zakon o fiskalizaciji).
      </p>
      <p>
        Dakle: pogreška u sadržaju = storno. Promjena načina plaćanja = prijava promjene,
        bez storna.
      </p>

      <h2 id='b2c-storno'>Kako stornirati B2C račun (F1.0 — gotovinski i transakcijski)</h2>
      <p>
        B2C račun je račun izdan krajnjem potrošaču — fizičkoj osobi. Svi B2C računi u
        2026. moraju biti fiskalizirani, i gotovinski i transakcijski, od 1.1.2026.
      </p>
      <p>Postupak:</p>
      <ol>
        <li>Izdaš novi račun koji poništava prethodni</li>
        <li>Iste stavke, isti iznosi — ali s negativnim predznakom (−)</li>
        <li>Broj storno računa je sljedeći broj u slijedu (ne preskačeš brojeve)</li>
        <li>Storno račun mora proći fiskalizaciju — dobiva vlastiti JIR od CIS-a</li>
        <li>Storno račun se upisuje u KPR kao zasebni redak s negativnim iznosom</li>
      </ol>

      <h3>U Kviku — automatski storno u dva klika</h3>
      <p>
        Klikneš &quot;Storniraj&quot; na izvornom računu. Kvik automatski kreira storno s
        negativnim predznakom, ispravnim slijednim brojem i fiskalizira ga na CIS-u. JIR
        se dodjeljuje automatski. KPR se ažurira. Dva klika, gotovo.
      </p>
      <p>
        Nakon storna — ako kupac ima pravo na ispravljeni račun, izdaješ novi račun s
        ispravnim podacima. Taj novi račun opet fiskaliziraš normalno.
      </p>

      <InlineCTA tema='inline_storno_register' pageSlug={SLUG} />

      <h2 id='eracun-storno'>Kako stornirati eRačun (F2.0 — B2B, od 1.1.2027.)</h2>
      <p>
        Paušalisti moraju izdavati eRačune od 1.1.2027. Do tada vrijedi samo zaprimanje
        eRačuna (od 1.1.2026.). Evo kako funkcionira storno eRačuna kad dođe ta obveza.
      </p>
      <p>Za B2B eRačune postoje dva načina poništavanja:</p>

      <h3>Opcija 1 — Storno eRačun</h3>
      <p>
        Novi eRačun s negativnim predznakom koji se poziva na izvorni dokument. Sadrži
        iste stavke s negativnim iznosima. I storno eRačun mora proći fiskalizaciju.
      </p>

      <h3>Opcija 2 — Odobrenje (credit note)</h3>
      <p>
        Dokument kojim djelomično ili potpuno poništavaš iznos iz izvornog računa. Koristi
        se kad ne storniraš cijeli račun, nego samo dio. Poziva se na izvorni eRačun.
      </p>

      <p>
        Oba dokumenta ostaju u evidenciji i kod izdavatelja i kod primatelja. Odbijeni
        eRačun i storno evidentiraju se i šalju Poreznoj upravi.
      </p>
      <p>
        <Link href={vodiciHref('fiskalizacija-20')}>Saznaj više o eRačunima →</Link>
      </p>

      <h2 id='kpr'>Što se događa u KPR-u</h2>
      <p>
        Knjiga prometa mora prikazivati sve transakcije — i pozitivne i negativne. Storno
        račun ulazi u KPR kao zasebni redak s negativnim iznosom na datum kada je storno
        izdan, ne na datum izvornog računa.
      </p>
      <p>
        Ako koristiš Kvik, KPR se ažurira automatski uz svaki storno. Nema ručnog unosa.
      </p>
      <p>
        <Link href={vodiciHref('kpr-knjiga-prometa')}>Sve o KPR-u →</Link>
      </p>

      <h2 id='korak-po-korak'>Korak-po-korak: što radiš kad otkriješ pogrešku</h2>
      <ol>
        <li>
          <strong>Pronađi izvorni račun.</strong> U Kviku:{' '}
          <Link href='/racuni'>/racuni</Link> → pronađi račun s pogreškom.
        </li>
        <li>
          <strong>Provjeri je li fiskaliziran.</strong> Fiskalizirani račun ima badge
          &quot;Fiskalizirano&quot; i JIR. Ako nije fiskaliziran — nemoj ga brisati,
          koristi retry ili se javi podršci.
        </li>
        <li>
          <strong>Klikni &quot;Storniraj&quot;.</strong> Kvik automatski kreira storno s
          negativnim predznakom, ispravnim slijednim brojem i šalje fiskalizacijski
          zahtjev na CIS. JIR storno računa se dodjeljuje od strane CIS-a.
        </li>
        <li>
          <strong>Izdaj novi ispravljeni račun.</strong> Nakon što je storno prošao,
          kreiraš novi račun s ispravnim podacima. On ide u KPR kao novi pozitivni redak.
        </li>
        <li>
          <strong>Informiraj kupca.</strong> Pošalji kupcu storno i novi ispravljeni
          račun. Ako si primio plaćanje, a ispravljeni iznos je manji — vrati razliku.
          Ako je veći — zatraži doplatak.
        </li>
      </ol>

      <h2 id='edge-case'>Edge case: kupac je već platio pogrešan iznos</h2>
      <p>
        Storno poništava dokument — ali ne vraća novac automatski. To je zasebna
        transakcija između tebe i kupca.
      </p>
      <p>Primjer: primio si 200 €, a trebalo je 150 €:</p>
      <ol>
        <li>Izdaj storno izvornog računa (−200 €)</li>
        <li>Izdaj novi račun s ispravnim iznosom (150 €)</li>
        <li>Vrati kupcu razliku od 50 €</li>
      </ol>
      <p>
        Povrat novca kupcu ne traži poseban dokument prema Zakonu o fiskalizaciji —
        storno i novi račun su dovoljni. Iz poslovne prakse preporučuje se da
        dokumentiraš povrat za vlastitu evidenciju.
      </p>

      <p>
        Za ispravno izdavanje računa od početka pogledaj vodič o{' '}
        <Link href={vodiciHref('izdavanje-racuna')}>izdavanju računa</Link>. Imaš
        pitanje? <Link href='/asistent'>Pitaj AI asistenta</Link>.
      </p>
    </GuideShell>
  );
}

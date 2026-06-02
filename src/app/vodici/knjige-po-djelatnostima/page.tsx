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
      'Knjiga prometa računa (KPR) obvezna je za sve paušaliste — bez obzira na djelatnost. U nju unosiš sve izdane račune isti dan kad ih izdaš. Dodatne knjige ovise o djelatnosti.',
  },
  {
    question: 'Mora li ugostitelj voditi dodatne knjige osim KPR-a?',
    answer:
      'Da. Ugostitelji moraju voditi knjigu popisa (inventura zaliha) i knjigu normativa (recepture i troškovi jela/pića). Sanitarna inspekcija provjerava obje evidencije.',
  },
  {
    question: 'Trebam li knjigu tražbina?',
    answer:
      'Knjiga tražbina nije zakonski obvezna za paušaliste, ali je korisna kad imaš nenaplaćene račune. Vidi vodič o knjizi tražbina.',
  },
  {
    question: 'Mora li IT freelancer voditi nešto osim KPR-a?',
    answer:
      'Ne. Za IT freelancere, dizajnere i konzultante KPR je jedina obvezna knjiga. Preporučena je evidencija projekata radi organizacije, ali nije zakonska obveza.',
  },
  {
    question: 'Vodi li podizvođač građevinski dnevnik?',
    answer:
      'Ne. Građevinski dnevnik vodi vodeći izvođač — onaj tko je ugovorio posao s investitorom. Ako te netko angažirao na gradilištu, dnevnik vodi glavni izvođač, ne ti.',
  },
];

const tableWrap =
  'my-6 overflow-x-auto rounded-xl border border-[#1f2a28] bg-[#111716] text-sm';

export default function KnjigePoDjelatnostimaPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Koje knjige mora voditi paušalist po djelatnostima'
      subtitle='KPR za sve + dodatne knjige za ugostiteljstvo, trgovinu, turizam, OPG, graditeljstvo, frizere, prijevoditelje i taxi. Koje su obvezne, koje preporučene.'
      readingMinutes={13}
      metaDescription={META_DESC}
      toc={[
        { id: 'kpr', label: 'KPR — obvezna za SVE' },
        { id: 'ugostiteljstvo', label: 'Ugostiteljstvo' },
        { id: 'trgovina', label: 'Trgovina' },
        { id: 'turizam', label: 'Turizam' },
        { id: 'opg', label: 'OPG' },
        { id: 'graditeljstvo', label: 'Graditeljstvo' },
        { id: 'frizeri', label: 'Frizeri i kozmetičari' },
        { id: 'prijevoditelji', label: 'Prijevoditelji' },
        { id: 'taxi', label: 'Taxi i prijevoz' },
        { id: 'it', label: 'IT freelanceri' },
        { id: 'tablica', label: 'Tablica po djelatnostima' },
        { id: 'greske', label: 'Česte greške' },
        { id: 'cta', label: 'Kvik automatski vodi KPR' },
      ]}
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
        <strong>KPR je obvezna za SVE paušaliste</strong> — bez obzira na djelatnost. Ali
        ovisno o tome čime se baviš, moguće je da moraš voditi i dodatne knjige. Nema
        smisla voditi knjigu normativa ako si freelance copywriter. Ali ako imaš kafić,
        bez nje ćeš dobiti kaznu na inspekciji.
      </p>
      <p>
        Ovaj vodič pokriva koje su knjige obvezne a koje preporučene po djelatnostima —
        od ugostiteljstva do prijevoditelja, od trgovine do graditeljstva. Za svaku
        djelatnost objašnjavamo što točno moraš evidentirati, u kojem roku i tko to
        provjerava na inspekciji.
      </p>
      <p>
        Ako tek otvaraš obrt ili nisi siguran koje evidencije već imaš pokrivene, kreni
        od{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR knjige prometa</Link> — to je
        zajednička osnova za sve paušaliste.
      </p>

      <h2 id='kpr'>KPR — obvezna za SVE</h2>
      <p>
        Knjiga prometa računa (KPR) je <strong>jedina obvezna knjiga</strong> za paušalne
        obrtnike, bez obzira na djelatnost. U KPR unosiš sve izdane račune — datum, broj
        računa, kupac (ako je firma), iznos.
      </p>
      <p>
        <strong>Rok:</strong> moraš unijeti račun najkasnije na kraju dana kad si ga
        izdao. Kazna za nevođenje KPR: do 13.300 €.
      </p>
      <p>
        Kvik automatski vodi KPR iz tvoje račune — svaki račun automatski ide u KPR s
        mogućnošću export PDF i XLSX. Više o tome →{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR knjiga prometa</Link>
      </p>

      <h2 id='ugostiteljstvo'>Ugostiteljstvo (kafići, restorani, fast food)</h2>

      <h3>Obvezne knjige:</h3>
      <ol>
        <li>
          <strong>KPR</strong> — kao svi
        </li>
        <li>
          <strong>Knjiga popisa</strong> — inventura robe na zalihi (sirovina, pića,
          gotova jela)
        </li>
        <li>
          <strong>Knjiga normativa</strong> — recepture i troškovi svake stavke na meniju
        </li>
      </ol>

      <p>
        <strong>Knjiga popisa:</strong>
      </p>
      <ul>
        <li>Evidencija: što imaš na skladištu (kg, komada, litara)</li>
        <li>Kada: minimalno 1x godišnje (preporuka: kvartalno)</li>
        <li>Zašto: Sanitarna inspekcija provjerava</li>
      </ul>

      <p>
        <strong>Knjiga normativa:</strong>
      </p>
      <ul>
        <li>Evidencija: receptura + cijene sirovina za svako jelo/piće</li>
        <li>
          Primjer: Carbonara = 200g tjestenine (0,40 €) + 100g pancete (1,20 €) + 2 jaja
          (0,50 €) + papar/sol = ukupno 2,10 € trošak
        </li>
        <li>Zašto: Kontrola troška robe, cijene kalkulacije</li>
      </ul>

      <p>
        Više o paušalnom obrtu za ugostitelje →{' '}
        <Link href={vodiciHref('pausalni-obrt-za-ugostitelje')}>
          Paušalni obrt za ugostitelje
        </Link>
      </p>

      <h2 id='trgovina'>Trgovina (maloprodaja, web shop, retail)</h2>

      <h3>Obvezne knjige:</h3>
      <ol>
        <li>
          <strong>KPR</strong> — kao svi
        </li>
        <li>
          <strong>Knjiga popisa</strong> — inventura robe na zalihi
        </li>
      </ol>

      <p>
        <strong>Knjiga popisa:</strong>
      </p>
      <ul>
        <li>Evidencija: sve što prodaješ (komada, veličine, modeli)</li>
        <li>Kada: minimalno 1x godišnje (31. prosinac)</li>
        <li>
          Zašto: Porezna i inspekcija rada provjeravaju usklađenost popisa i računa
        </li>
      </ul>

      <p>
        Primjer: Prodaješ odjeću. Na popisu imaš 50 majica, 30 hlača, 20 jakni. Kroz
        godinu izdaš 200 računa za majice — popis mora odgovarati (50 + kupljeno -
        prodano = ostatak na skladištu).
      </p>

      <h2 id='turizam'>Turizam (smještaj, apartmani, sobe)</h2>

      <h3>Obvezne knjige:</h3>
      <ol>
        <li>
          <strong>KPR</strong> — kao svi
        </li>
        <li>
          <strong>Knjiga gostiju</strong> — evidencija tko je boravio i kada
        </li>
      </ol>

      <p>
        <strong>Knjiga gostiju:</strong>
      </p>
      <ul>
        <li>
          Evidencija: ime gosta, datum dolaska/odlaska, broj noćenja, državljanstvo
        </li>
        <li>Kada: svaki gost mora biti upisan najkasnije 12 sati nakon check-in</li>
        <li>Zašto: Turistička inspekcija + MUP (prijava stranih državljana)</li>
      </ul>

      <p>
        Format: možeš voditi u papirnatom obliku ili digitalno (Excel, Google Sheets,
        Kvik).
      </p>

      <h2 id='opg'>OPG (poljoprivreda, voćarstvo, vinogradarstvo)</h2>

      <h3>Obvezne knjige:</h3>
      <ol>
        <li>
          <strong>KPR</strong> — kao svi
        </li>
        <li>
          <strong>Evidencija proizvodnje</strong> — što si proizveo, kad, koliko
        </li>
      </ol>

      <p>
        <strong>Evidencija proizvodnje:</strong>
      </p>
      <ul>
        <li>
          Evidencija: datumi sjetve/berbe, količine (kg, litara), prodano vs potrošeno
        </li>
        <li>Kada: kontinuirano (dnevno ili tjedno)</li>
        <li>
          Zašto: Inspekcija poljoprivrede provjerava usklađenost s prijavom zemljišta i
          proizvodnje
        </li>
      </ul>

      <p>
        Primjer: Proizvodiš 500 kg jabuka u rujnu. Prodaš 300 kg, ostaviš 200 kg za
        preradu. Evidencija mora pokazivati taj tijek.
      </p>

      <h2 id='graditeljstvo'>Graditeljstvo (obrtnici, majstori, instalacije)</h2>

      <h3>Obvezne knjige:</h3>
      <ol>
        <li>
          <strong>KPR</strong> — kao svi
        </li>
        <li>
          <strong>Građevinski dnevnik</strong> — za svaki projekt odvojeno (ako vodeći
          izvođač)
        </li>
      </ol>

      <p>
        <strong>Građevinski dnevnik:</strong>
      </p>
      <ul>
        <li>
          Evidencija: tko je radio, što je napravljeno, materijali utrošeni, vrijeme rada
        </li>
        <li>Kada: svaki radni dan na gradilištu</li>
        <li>Zašto: Inspekcija rada + nadzorni inženjer traže</li>
      </ul>

      <p>
        <strong>VAŽNO:</strong> Ako radiš kao <strong>podizvođač</strong> (netko te
        angažirao na gradilištu), ne vodiš dnevnik — vodi ga glavni izvođač.
      </p>

      <h2 id='frizeri'>Frizeri, kozmetičari, spa</h2>

      <h3>Obvezne knjige:</h3>
      <ol>
        <li>
          <strong>KPR</strong> — kao svi
        </li>
        <li>
          <strong>Evidencija tretmana</strong> (NIJE zakonski obvezna, ali preporučena)
        </li>
      </ol>

      <p>
        <strong>Evidencija tretmana:</strong>
      </p>
      <ul>
        <li>Evidencija: klijent, datum, vrsta tretmana, korišteni proizvodi</li>
        <li>Kada: kontinuirano (za svaki termin)</li>
        <li>Zašto: Zaštita u slučaju reklamacije ili alergijske reakcije</li>
      </ul>

      <p>
        Primjer: Klijent se žali da je dobio alergiju nakon bojanja kose. Evidencija
        pokazuje koji proizvod si koristio → dokazuješ da je bio certificiran.
      </p>

      <p>
        Više o paušalnom obrtu za kozmetičare →{' '}
        <Link href={vodiciHref('pausalni-obrt-za-kozmeticare')}>
          Paušalni obrt za kozmetičare
        </Link>
      </p>

      <h2 id='prijevoditelji'>Prijevoditelji, prevoditelji</h2>

      <h3>Obvezne knjige:</h3>
      <ol>
        <li>
          <strong>KPR</strong> — kao svi
        </li>
      </ol>

      <p>
        <strong>Dodatne knjige:</strong> NISU potrebne. KPR je dovoljan.
      </p>

      <p>
        Preporuka: evidencija projekata (Excel, Notion) — koliko stranica prevedeno, za
        kojeg klijenta, rok isporuke. Nije zakonska obveza, ali pomaže u organizaciji.
      </p>

      <h2 id='taxi'>Taxi, prijevoz putnika</h2>

      <h3>Obvezne knjige:</h3>
      <ol>
        <li>
          <strong>KPR</strong> — kao svi
        </li>
        <li>
          <strong>Evidencija vožnji</strong> (obično automatski preko taxi app)
        </li>
      </ol>

      <p>
        <strong>Evidencija vožnji:</strong>
      </p>
      <ul>
        <li>Evidencija: datum, vrijeme, relacija (odakle-dokle), cijena</li>
        <li>Kada: svaka vožnja</li>
        <li>Zašto: Inspekcija prometa provjerava usklađenost s izdanim računima</li>
      </ul>

      <p>
        Ako radiš preko platforme (Uber, Bolt, Cammeo), platforma automatski generira
        evidenciju. Spremaš mjesečne izvještaje.
      </p>

      <h2 id='it'>IT freelanceri, dizajneri, konzultanti</h2>

      <h3>Obvezne knjige:</h3>
      <ol>
        <li>
          <strong>KPR</strong> — kao svi
        </li>
      </ol>

      <p>
        <strong>Dodatne knjige:</strong> NISU potrebne. KPR je dovoljan.
      </p>

      <p>
        Preporuka: evidencija projekata (Notion, Trello, Asana) — tko je klijent, što si
        isporučio, koliko sati. Nije zakonska obveza, ali pomaže u organizaciji.
      </p>

      <p>
        Više o paušalnom obrtu za IT freelancere →{' '}
        <Link href={vodiciHref('pausalni-obrt-za-it-freelancere')}>
          Paušalni obrt za IT freelancere
        </Link>
      </p>

      <h2 id='tablica'>Tablica — Koje knjige za koju djelatnost?</h2>

      <div className={tableWrap}>
        <table className='min-w-full border-collapse text-left'>
          <caption className='border-b border-[#1f2a28] px-4 py-3 text-left text-xs text-[#94a3a0]'>
            Pregled obveznih knjiga po djelatnostima za paušalne obrtnike
          </caption>
          <thead>
            <tr className='border-b border-[#1f2a28] text-[#94a3a0]'>
              <th className='px-3 py-2 font-medium'>Djelatnost</th>
              <th className='px-3 py-2 font-medium'>KPR</th>
              <th className='px-3 py-2 font-medium'>Knjiga popisa</th>
              <th className='px-3 py-2 font-medium'>Knjiga normativa</th>
              <th className='px-3 py-2 font-medium'>Knjiga gostiju</th>
              <th className='px-3 py-2 font-medium'>Evidencija proizvodnje</th>
              <th className='px-3 py-2 font-medium'>Građevinski dnevnik</th>
            </tr>
          </thead>
          <tbody className='text-[#d5dfdd]'>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>Ugostiteljstvo</strong>
              </td>
              <td className='px-3 py-2'>✅</td>
              <td className='px-3 py-2'>✅</td>
              <td className='px-3 py-2'>✅</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>Trgovina</strong>
              </td>
              <td className='px-3 py-2'>✅</td>
              <td className='px-3 py-2'>✅</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>Turizam (apartmani)</strong>
              </td>
              <td className='px-3 py-2'>✅</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>✅</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>OPG</strong>
              </td>
              <td className='px-3 py-2'>✅</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>✅</td>
              <td className='px-3 py-2'>❌</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>Graditeljstvo</strong>
              </td>
              <td className='px-3 py-2'>✅</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>✅ (ako vodeći izvođač)</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>Frizeri/kozmetičari</strong>
              </td>
              <td className='px-3 py-2'>✅</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>Prijevoditelji</strong>
              </td>
              <td className='px-3 py-2'>✅</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>Taxi</strong>
              </td>
              <td className='px-3 py-2'>✅</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
            </tr>
            <tr>
              <td className='px-3 py-2'>
                <strong>IT/dizajn</strong>
              </td>
              <td className='px-3 py-2'>✅</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
              <td className='px-3 py-2'>❌</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id='greske'>Česte greške</h2>

      <h3>❌ &quot;Nisam znao da moram voditi knjigu popisa — radim u trgovini&quot;</h3>
      <p>
        <strong>Posljedica:</strong> Kazna na inspekciji do 6.650 €.
      </p>
      <p>
        <strong>Rješenje:</strong> Napravi inventuru odmah — prebroj SVE što imaš na
        skladištu. Upiši u Excel ili Google Sheets s datumom.
      </p>

      <h3>❌ &quot;Vodim knjigu normativa, ali recepture su stare 2 godine&quot;</h3>
      <p>
        <strong>Posljedica:</strong> Inspekcija vidi da cijene sirovina nisu ažurirane —
        sumnja na nepravilnu kalkulaciju cijena.
      </p>
      <p>
        <strong>Rješenje:</strong> Ažuriraj normativ minimalno 1x godišnje (ili kad se
        cijene sirovina drastično promijene).
      </p>

      <h3>❌ &quot;Ne vodim građevinski dnevnik jer sam sam na gradilištu&quot;</h3>
      <p>
        <strong>Posljedica:</strong> Ako si vodeći izvođač (ti si ugovorio posao s
        investitorom), dnevnik je OBVEZAN — čak i ako radiš solo.
      </p>
      <p>
        <strong>Rješenje:</strong> Otvori građevinski dnevnik na početku projekta. Upisuj
        svaki radni dan što si radio.
      </p>

      <h3>❌ &quot;Imam 50 računa mjesečno, ali KPR vodim jednom kvartalno&quot;</h3>
      <p>
        <strong>Posljedica:</strong> KPR mora biti vođen na kraju dana kad izdaš račun.
        Ako inspekcija dođe i vidi da KPR nije ažuriran, kazna.
      </p>
      <p>
        <strong>Rješenje:</strong> Kvik automatski vodi KPR iz tvoje račune — svaki račun
        odmah ide u KPR. Bez ručnog rada.
      </p>

      <h2 id='cta'>Kvik automatski vodi KPR za tebe — bez ručnog unosa, bez brige</h2>
      <p>
        Generator KPR knjige s mogućnošću izvoza za Poreznu preko ePorezne portala
        (eporezna.gov.hr):
      </p>
      <p>
        <Link
          href={vodiciHref('kpr-online-generator')}
          className='text-[#0d9488] hover:underline'
        >
          KPR generator
        </Link>
      </p>
    </GuideShell>
  );
}

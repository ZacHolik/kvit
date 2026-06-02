import type { Metadata } from 'next';

import { buildVodicMetadata } from '@/lib/og-metadata';
import Link from 'next/link';

import { vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'prvi-koraci-nakon-obrta';

const META_DESC =
  'Checklista prvih 30 dana: RPO obrazac, banka, doprinosi, fiskalizacija i što moraš napraviti odmah nakon upisa u obrtni registar.';

export const metadata: Metadata = buildVodicMetadata(
  SLUG,
  'Prvi koraci nakon dobivanja obrtnice',
  META_DESC,
  'Prvi koraci nakon dobivanja obrtnice | Kvik',
);

const faq = [
  {
    question: 'Koliko imam vremena nakon otvaranja obrta?',
    answer:
      'RPO obrazac moraš predati u roku od 8 dana od upisa u obrtni registar. Doprinose plaćaš do 15. u mjesecu. PO-SD obrazac podnosiš tek u siječnju sljedeće godine.',
  },
  {
    question: 'Što je najvažnije odmah nakon rješenja o obrtu?',
    answer:
      'RPO obrazac (M11p + M1p) u roku od 8 dana, otvaranje poslovnog računa i plaćanje doprinosa do 15. u mjesecu. Rješenje o upisu čuvaj u fascikli i na cloudu.',
  },
  {
    question: 'Moram li odmah fiskalizirati račune?',
    answer:
      'Ovisi o načinu plaćanja. Za gotovinu i kartice fiskalizacija je odmah obvezna. Za transakcijske račune prema fizičkim osobama obveza počinje od 1.1.2026., a prema firmama od 1.1.2027.',
  },
];

const tableWrap =
  'my-6 overflow-x-auto rounded-xl border border-[#1f2a28] bg-[#111716] text-sm';

export default function PrviKoraciNakonObrtaPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Prvi koraci nakon dobivanja obrtnice'
      subtitle='Checklista prvih 30 dana: RPO obrazac, banka, doprinosi, fiskalizacija i što moraš napraviti odmah nakon upisa u obrtni registar.'
      readingMinutes={12}
      metaDescription={META_DESC}
      toc={[
        { id: 'hitno', label: 'Dan 1–8 — hitno' },
        { id: 'prvi-mjesec', label: 'Dan 1–30 — prvi mjesec' },
        { id: 'nije-hitno', label: 'Što nije hitno' },
        { id: 'checklista', label: 'Checklista 30 dana' },
        { id: 'greske', label: 'Česte greške' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('otvaranje-obrta'), title: 'Otvaranje obrta' },
        { href: vodiciHref('rpo-obrazac'), title: 'RPO obrazac' },
        { href: vodiciHref('bankovni-racun-pausalisti'), title: 'Bankovni račun' },
        { href: vodiciHref('doprinosi'), title: 'Doprinosi' },
        { href: vodiciHref('pausalist-uz-posao'), title: 'Paušalist uz posao' },
      ]}
    >
      <p>
        Čestitke — upravo si postao službeni obrtnik! Rješenje o upisu u obrtni registar
        imaš u rukama, ali što sada? Većina novih paušalaca se upravo tu osjeća izgubljeno.
        Imaš papir koji kaže da smiješ poslovati, ali nemaš pojma što napraviti prvi.
      </p>
      <p>
        Ovaj vodič je praktična checklista prvih 30 dana nakon dobivanja obrtnice. Nema
        teorije, nema pravnih komentara — samo konkretni koraci s rokovima i linkovima na
        alate koji ti trebaju. Sve što moraš napraviti odmah, sve što može pričekati, i
        što te čeka ako nešto propustiš.
      </p>
      <p>
        Rješenje čuvaš cijeli život obrta. Trebaš ga za otvaranje bankovnog računa, za
        izradu pečata, za prijavu u mirovinsko i zdravstveno, i za poreznu kontrolu kad
        dođe (a može doći). Prvi korak nakon što dobiješ taj papir: jedna kopija u sigurnu
        fasciklu, jedna skenirana verzija na cloud.
      </p>

      <h2 id='hitno'>Dan 1–8 — HITNO (rok je zakonski)</h2>

      <h3>RPO obrazac — najhitnija stvar koju moraš napraviti</h3>
      <p>
        <strong>Rok: 8 dana od upisa u obrtni registar.</strong> Ako propustiš rok, kazna
        ide do 2.650 €. Zato je ovo prvi zadatak na listi, ne treći ili peti.
      </p>
      <p>
        RPO je prijava u sustav mirovinskog i zdravstvenog osiguranja. Bez toga nemaš
        zdravstveno, bez toga porezna ne zna da postojiš, bez toga si nevidljiv u sustavu.
        Prijava se radi elektronički preko ePorezne (eporezna.gov.hr), i trebaš dva
        obrasca:
      </p>
      <ul>
        <li>
          <strong>M11p</strong> — prijava u mirovinsko osiguranje
        </li>
        <li>
          <strong>M1p</strong> — prijava u zdravstveno osiguranje (automatski nakon
          mirovinskog)
        </li>
      </ul>
      <p>
        Ako imaš redovno zaposlenje uz obrt, na M11p obrascu{' '}
        <strong>označavaš da si već osiguran kod poslodavca</strong>. To je kritično jer
        inače porezna računa duple doprinose. Detaljni postupak kako ispuniti obrasce i
        što točno označiti →{' '}
        <Link href={vodiciHref('rpo-obrazac')}>RPO obrazac vodič</Link>
      </p>

      <h3>Bankovni račun — tehnički opcionalno, praktički obavezno</h3>
      <p>
        Zakon ne traži da paušalisti imaju odvojen poslovni račun. Teoretski možeš
        primati sve uplate na privatni tekući. Praktično? Loša ideja.
      </p>
      <p>Zašto je pametnije odvojiti poslovni od privatnog:</p>
      <ol>
        <li>
          <strong>PO-SD obrazac</strong> — moraš unijeti SVE poslovne primitke. Ako
          miješaš privatne i poslovne uplate, svaku transakciju ručno razdvajaš na kraju
          godine.
        </li>
        <li>
          <strong>KPR knjiga</strong> — isto. Svaki poslovni primitak ide u KPR. Ako imaš
          50 transakcija mjesečno, moraš pregledati svaku i odlučiti je li poslovna ili
          privatna.
        </li>
        <li>
          <strong>Porezna kontrola</strong> — mogu tražiti izvadak računa zadnjih 6
          godina. Ako vide nesrazmjer između primitaka na računu i primitaka u PO-SD
          obrascu, sumnjaju na utaju. Onda ti dokazuješ da je svaka &quot;sumnjiva&quot;
          uplata privatna.
        </li>
      </ol>
      <p>Opcije za bankovni račun:</p>
      <ul>
        <li>
          <strong>Tradicionalne banke</strong> (PBZ, Erste, Zaba): žiro račun, 0–5 €/mj
          ovisno o broju transakcija
        </li>
        <li>
          <strong>Revolut Business</strong>: besplatan plan dostupan, može biti jedini
          poslovni račun prema mišljenju Porezne od 31.1.2023. (revolut.com/hr-HR/business)
          — NAPOMENA: latvijski IBAN može utjecati na 2D barkodove
        </li>
        <li>
          <strong>Fintech opcije</strong>: redovito pratimo dostupnost novih opcija i
          ažuriramo ovaj vodič
        </li>
      </ul>
      <p>
        Više o tome koja opcija je najbolja za tvoj slučaj →{' '}
        <Link href={vodiciHref('bankovni-racun-pausalisti')}>
          Bankovni račun za paušaliste
        </Link>
      </p>

      <h2 id='prvi-mjesec'>Dan 1–30 — PRVI MJESEC</h2>

      <h3>Platiti prvi doprinose — iznos i rok</h3>
      <p>
        <strong>Iznos za 2026.: 290,98 €/mj</strong> (mirovinsko 1. stup 119,58 € +
        mirovinsko 2. stup 39,86 € + zdravstveno 131,54 €)
      </p>
      <p>
        Rok: <strong>15. u mjesecu</strong> kad otvaraš obrt. Ako otvaraš obrt 17.
        siječnja, prvi doprinosi plaćaju se do 15. veljače. VAŽNO: plaćaš za cijeli
        mjesec siječanj, bez obzira što si radio samo 14 dana.
      </p>
      <p>Doprinosi se plaćaju na <strong>3 odvojena IBAN-a</strong>:</p>
      <ol>
        <li>MIO I. stup (119,58 €) → Državna riznica</li>
        <li>MIO II. stup (39,86 €) → Tvoj mirovinski fond</li>
        <li>HZZO (131,54 €) → Hrvatski zavod za zdravstveno osiguranje</li>
      </ol>
      <p>
        Generator 2D barkoda za uplatnice + točni IBAN-i i pozivi na broj →{' '}
        <Link href='/alati/placanje-doprinosa'>Kalkulator doprinosa</Link>
      </p>
      <p>
        Najčešća greška: platiti cijeli iznos na jedan IBAN. Porezna tada ne prepoznaje
        uplatu i dobiješ opomenu. Svaka od 3 uplate ide na svoj račun s posebnim pozivom
        na broj.
      </p>
      <p>
        Više o doprinosima, šiframa i kako platiti →{' '}
        <Link href={vodiciHref('doprinosi')}>Doprinosi</Link>
      </p>

      <h3>Interni akt — samo ako planiraš fiskalizaciju</h3>
      <p>Interni akt je dokument koji propisuje:</p>
      <ul>
        <li>Pravila numeriranja računa (npr. 1/PP1/1, 2/PP1/1...)</li>
        <li>Popis poslovnih prostora s oznakama</li>
        <li>Oznake operatera (ako imaš zaposlenike koji izdaju račune)</li>
      </ul>
      <p>
        <strong>Kada ga trebaš:</strong> Prije nego kreneš izdavati fiskalizirane račune
        (gotovina, kartice, transakcijski računi prema fizičkim osobama od 1.1.2026.). Ako
        posluješ samo B2B (računi prema firmama) i ne naplaćuješ gotovinom, ne trebaš ga
        odmah.
      </p>
      <p>
        <strong>Gdje ga spremiti:</strong> Čuva se kod tebe, NE dostavlja se poreznoj. Ali
        inspektor ga može zatražiti na kontroli, pa mora biti dostupan.
      </p>
      <p>
        Generator internog akta s unaprijed ispunjenim šablonima →{' '}
        <Link href='/alati/interni-akt'>Interni akt generator</Link>
      </p>

      <h3>FINA certifikat — samo ako planiraš fiskalizaciju odmah</h3>
      <p>
        Certifikat za fiskalizaciju naručuješ kod FINA-e (fina.hr). Trošak: ~50 € za 5
        godina (39,82 € certifikat + 6,64 € registracija prvog puta).
      </p>
      <p>Dokumentacija za narudžbu:</p>
      <ul>
        <li>Rješenje o upisu u obrtni registar (kopija)</li>
        <li>OIB vlasnika</li>
        <li>Email adresa</li>
      </ul>
      <p>
        Demo certifikat je BESPLATAN i možeš ga koristiti za testiranje prije nego naručiš
        produkcijskog.
      </p>
      <p>
        Procedura narudžbe, kako uploadati u Kvik i kako testirati →{' '}
        <Link href={vodiciHref('fina-certifikat-fiskalizacija')}>
          FINA certifikat za fiskalizaciju
        </Link>
      </p>

      <h2 id='nije-hitno'>Što NIJE hitno (ali ćeš trebati uskoro)</h2>

      <h3>PO-SD obrazac — tek u siječnju sljedeće godine</h3>
      <p>
        Rok: <strong>15. siječnja sljedeće godine</strong>. Ako otvaraš obrt u 2026.,
        prvi PO-SD podnosiš do 15. siječnja 2027. za primitke iz 2026.
      </p>
      <p>
        PO-SD je godišnja prijava primitaka po kojoj porezna određuje u koji razred
        spadaš i koliki porez plaćaš sljedeće godine. Dok ne podneseš PO-SD, plaćaš porez
        prema najnižem razredu I (primitci do 11.160 € godišnje).
      </p>
      <p>
        Generator PO-SD obrasca s automatskim izračunom razreda →{' '}
        <Link href='/alati/po-sd'>PO-SD generator</Link>
      </p>
      <p>
        Vodič o PO-SD obrascu, rokovima i razredima →{' '}
        <Link href={vodiciHref('po-sd-obrazac')}>PO-SD obrazac</Link>
      </p>

      <h3>Knjiga prometa (KPR) — obvezno kad izdaš prvi račun</h3>
      <p>
        KPR nije potrebna odmah. Obveza počinje <strong>čim izdaš prvi račun</strong>.
        Svaki račun koji izdaš moraš upisati u KPR najkasnije na kraju dana kad si ga
        izdao.
      </p>
      <p>
        Kvik automatski vodi KPR iz tvoje račune — svaki račun koji kreiraš automatski
        ide u KPR, generira PDF i XLSX export za poreznu kontrolu. Više o tome →{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR knjiga prometa</Link>
      </p>

      <h3>Fiskalizacija — samo ako naplaćuješ gotovinom ili na račun (fizičke osobe)</h3>
      <p>Fiskalizacija nije odmah obvezna za sve. Ovisi o tome kako naplaćuješ:</p>
      <ul>
        <li>
          <strong>Gotovina ili kartice</strong> → fiskalizacija odmah obvezna
        </li>
        <li>
          <strong>Transakcijski računi prema fizičkim osobama (B2C)</strong> →
          fiskalizacija obvezna od 1.1.2026.
        </li>
        <li>
          <strong>Računi prema firmama (B2B)</strong> → &quot;obični&quot; računi do
          1.1.2027., zatim eRačuni
        </li>
      </ul>
      <p>
        Detaljno o tome tko mora, kada mora i kako →{' '}
        <Link href={vodiciHref('fiskalizacija-20')}>Fiskalizacija 2.0</Link>
      </p>

      <h2 id='checklista'>Checklista za prvih 30 dana (sažetak)</h2>
      <div className={tableWrap}>
        <table className='min-w-full border-collapse text-left'>
          <caption className='border-b border-[#1f2a28] px-4 py-3 text-left text-xs text-[#94a3a0]'>
            Sažetak obveza u prvih 30 dana nakon otvaranja obrta
          </caption>
          <thead>
            <tr className='border-b border-[#1f2a28] text-[#94a3a0]'>
              <th className='px-3 py-2 font-medium'>Dan</th>
              <th className='px-3 py-2 font-medium'>Što</th>
              <th className='px-3 py-2 font-medium'>Rok</th>
              <th className='px-3 py-2 font-medium'>Gdje</th>
            </tr>
          </thead>
          <tbody className='text-[#d5dfdd]'>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>1–8</td>
              <td className='px-3 py-2'>
                <strong>RPO obrazac</strong> (M11p + M1p)
              </td>
              <td className='px-3 py-2'>
                <strong>8 dana</strong> (zakonski)
              </td>
              <td className='px-3 py-2'>ePorezna (eporezna.gov.hr)</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>1–8</td>
              <td className='px-3 py-2'>Otvoriti bankovni račun</td>
              <td className='px-3 py-2'>Preporučljivo</td>
              <td className='px-3 py-2'>Banka po izboru</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>1–30</td>
              <td className='px-3 py-2'>
                <strong>Platiti doprinose</strong>
              </td>
              <td className='px-3 py-2'>
                <strong>15. u mjesecu</strong>
              </td>
              <td className='px-3 py-2'>3 odvojena IBAN-a</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>Kad kreneš</td>
              <td className='px-3 py-2'>FINA certifikat</td>
              <td className='px-3 py-2'>Prije fiskalizacije</td>
              <td className='px-3 py-2'>FINA (fina.hr)</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>Kad kreneš</td>
              <td className='px-3 py-2'>Interni akt</td>
              <td className='px-3 py-2'>Prije fiskalizacije</td>
              <td className='px-3 py-2'>
                <Link href='/alati/interni-akt'>Generator</Link>
              </td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>Prvi račun</td>
              <td className='px-3 py-2'>KPR knjiga</td>
              <td className='px-3 py-2'>Dan izdavanja računa</td>
              <td className='px-3 py-2'>Kvik automatski</td>
            </tr>
            <tr>
              <td className='px-3 py-2'>Siječanj sljedeće godine</td>
              <td className='px-3 py-2'>PO-SD obrazac</td>
              <td className='px-3 py-2'>15. siječnja</td>
              <td className='px-3 py-2'>
                <Link href='/alati/po-sd'>Generator</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id='greske'>Česte greške novih paušalaca</h2>

      <h3>❌ &quot;Nisam znao za RPO — prošlo je 2 mjeseca&quot;</h3>
      <p>
        <strong>Posljedica:</strong> Kazna do 2.650 € + gubiš zdravstveno osiguranje
        retroaktivno
      </p>
      <p>
        <strong>✅ Rješenje:</strong> Podnesi odmah, čak i nakon roka. Što prije podneseš,
        manja kazna. Kontaktiraj poreznu i objasni situaciju — ponekad su blagi za nove
        obrtnike ako vide da si u dobroj namjeri.
      </p>

      <h3>❌ &quot;Mislio sam da doprinose plaćam tek sljedeće godine&quot;</h3>
      <p>
        <strong>Posljedica:</strong> Prvi mjesec plaćaš u istom mjesecu kad otvaraš obrt.
        Ako propustiš rok, zatezne kamate + dug se gomila.
      </p>
      <p>
        <strong>✅ Rješenje:</strong> Doprinosi za siječanj plaćaju se do 15. veljače. Za
        veljač do 15. ožujka. I tako dalje. Postavi si podsjetnik na 10. u mjesecu.
      </p>

      <h3>❌ &quot;Imam sve na jednom računu — poslovni i privatni&quot;</h3>
      <p>
        <strong>Posljedica:</strong> Komplikacije na PO-SD obrascu + rizik porezne
        kontrole. Moraš dokazivati svaku privatnu transakciju.
      </p>
      <p>
        <strong>✅ Rješenje:</strong> Otvori odvojen račun što prije. Prebaci postojeće
        poslovne primitke na novi, drži ih razdvojeno od sad.
      </p>

      <h3>❌ &quot;Kopirao sam interni akt s interneta bez prilagodbe&quot;</h3>
      <p>
        <strong>Posljedica:</strong> Inspektor primijeti nelogičnosti (npr. imaš poslovni
        prostor u Zagrebu a u internom aktu piše Split). Sumnja na copy-paste = dodatna
        provjera.
      </p>
      <p>
        <strong>✅ Rješenje:</strong> Koristi generator ali provjeri SVAKO polje. Adresa
        mora biti stvarna, oznake poslovnih prostora moraju odgovarati stvarnosti.
      </p>

      <h3>❌ &quot;Nisam sačuvao rješenje o upisu&quot;</h3>
      <p>
        <strong>Posljedica:</strong> Trebaš ga za sve — banka, FINA certifikat, porezna
        kontrola. Nabavka duplikata košta vrijeme + novac.
      </p>
      <p>
        <strong>✅ Rješenje:</strong> Jedna kopija u fasciklu, jedna skenirano na cloudu
        (Google Drive, Dropbox). Nikad ne znaš kad će zatrebati.
      </p>

      <h2 id='alat'>Korisni alat</h2>
      <p>
        Preuzmi printabilnu checklistu za prve korake kao PDF:{' '}
        <Link href='/alati/checklista' className='text-[#0d9488] hover:underline'>
          Checklista za nove paušaliste
        </Link>
      </p>
    </GuideShell>
  );
}

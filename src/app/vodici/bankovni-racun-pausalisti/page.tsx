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
      'Zakon ne zahtijeva odvojen poslovni račun, ali porezna preporučuje razdvajanje. Za transakcijske uplate s računa klijenta praktično trebaš poslovni IBAN vezan uz obrt.',
  },
  {
    question: 'Može li paušalist koristiti privatni tekući račun za posao?',
    answer:
      'Tehnički da — legalno je miješati poslovne i privatne transakcije. Ali to otežava PO-SD i KPR te stvara rizik na poreznoj kontroli. Preporučuje se odvojen poslovni račun.',
  },
  {
    question: 'Koliko košta poslovni račun za obrt?',
    answer:
      'Tradicionalne banke naplaćuju 0–5 €/mj ovisno o paketu. Revolut Business nudi besplatan plan. Točne cijene provjeri u banci prije otvaranja.',
  },
];

const tableWrap =
  'my-6 overflow-x-auto rounded-xl border border-[#1f2a28] bg-[#111716] text-sm';

export default function BankovniRacunPausalistiPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Bankovni račun za paušaliste: poslovni vs privatni'
      subtitle='Moraš li odvojiti poslovni i privatni račun? Žiro vs tekući, troškovi, rizici miješanja i kako Porezna gleda na to.'
      readingMinutes={10}
      metaDescription={META_DESC}
      toc={[
        { id: 'zakon', label: 'Što zakon kaže' },
        { id: 'zasto-odvojiti', label: 'Zašto odvojiti' },
        { id: 'kako-odvojiti', label: 'Kako odvojiti' },
        { id: 'opcije', label: 'Opcije i usporedba' },
        { id: 'jedan-racun', label: 'Ako već miješaš' },
        { id: 'greske', label: 'Česte greške' },
      ]}
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
        Najčešće pitanje novih paušalaca:{' '}
        <strong>
          Moram li otvoriti odvojen poslovni račun, ili mogu primati uplate na privatni
          tekući?
        </strong>
      </p>
      <p>
        Kratak odgovor: Ne moraš, ali <strong>pametnije je odvojiti</strong>. Zakon
        dozvoljava jednu račun za sve — poslovanje i privatne potrebe. Ali porezna
        preporučuje razdvajanje, i to nije bez razloga.
      </p>
      <p>
        Ovaj vodič objašnjava zašto je pametnije imati odvojen račun, koje su opcije
        dostupne (tradicionalne banke vs fintech), koliko košta, i što se događa ako
        odlučiš sve držati na jednom računu. Konkretno, bez teorije.
      </p>

      <h2 id='zakon'>Što zakon kaže</h2>

      <h3>Zakon dozvoljava jedan račun za sve</h3>
      <p>
        Paušalisti <strong>mogu</strong> imati jedan račun — poslovni i privatni. Ni jedan
        zakon u Hrvatskoj ne zabranjuje miješanje poslovnih i privatnih transakcija na
        istom računu.
      </p>
      <p>To znači da možeš primati:</p>
      <ul>
        <li>Uplate klijenata (poslovni primitci)</li>
        <li>Plaću od poslodavca (ako si zaposlen)</li>
        <li>Privatne uplate (roditelji ti daju poklon, kredit...)</li>
        <li>Sve na isti IBAN</li>
      </ul>
      <p>Tehnički gledano, to je legalno.</p>

      <h3>ALI — porezna upozorava</h3>
      <p>
        Službeni vodiči porezne kažu:{' '}
        <strong>&quot;Preporučuje se odvojiti poslovne i privatne transakcije.&quot;</strong>
      </p>
      <p>
        Razlog? Komplikacije na <strong>PO-SD obrascu</strong> i{' '}
        <strong>KPR knjizi</strong>. PO-SD obrazac traži SVE poslovne primitke kroz
        godinu. Ako miješaš privatne i poslovne uplate, moraš ručno razdvajati svaku
        transakciju na kraju godine.
      </p>
      <p>
        Primjer: Imaš 200 transakcija kroz godinu. 120 je poslovnih (klijenti), 80 je
        privatnih (plaća, pokloni, refundacije). Moraš pregledati sve 200 i odlučiti za
        svaku — poslovna ili privatna. Greška u kategorizaciji = greška u PO-SD obrascu =
        rizik poreznog nadzora.
      </p>

      <h2 id='zasto-odvojiti'>Zašto je pametnije odvojiti</h2>

      <h3>1. Lakše PO-SD popunjavanje</h3>
      <p>
        PO-SD obrazac = svi <strong>poslovni</strong> primitci kroz godinu. Ako miješaš
        transakcije, moraš ručno filtrirati što je poslovno a što privatno.
      </p>
      <p>Sa odvojenim računima:</p>
      <ul>
        <li>Izvadak poslovnog računa = sve poslovne uplate</li>
        <li>Zbrojiš brojke, uneseš u PO-SD</li>
        <li>Gotovo za 10 minuta</li>
      </ul>
      <p>Sa miješanim računom:</p>
      <ul>
        <li>Izvadak računa = poslovne + privatne uplate</li>
        <li>Pregledavaš svaku transakciju pojedinačno</li>
        <li>&quot;Je li ova uplata od klijenta ili mi sestra vratila kredit?&quot;</li>
        <li>Gotovo za 2 sata + rizik greške</li>
      </ul>
      <p>
        Generator PO-SD obrasca koji automatski povlači podatke iz Kvika →{' '}
        <Link href='/alati/po-sd'>PO-SD generator</Link>
      </p>

      <h3>2. Lakše KPR vođenje</h3>
      <p>
        KPR = knjiga POSLOVNIH primitaka. Svaki račun koji izdaš moraš upisati u KPR.
      </p>
      <p>
        Ako miješaš račune, moraš provjeravati je li svaka uplata vezana za izdani račun
        ili je nešto drugo (privatna uplata, refundacija...). Sa odvojenim računom, sve
        što stigne na poslovni IBAN = poslovna uplata.
      </p>
      <p>
        Kvik automatski vodi KPR iz tvoje račune — više o tome →{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR knjiga prometa</Link>
      </p>

      <h3>3. Rizik poreznog nadzora</h3>
      <p>
        Porezna može zatražiti izvadak računa zadnjih <strong>6 godina</strong>. Ako vide
        nesrazmjer između primitaka na računu i primitaka u PO-SD obrascu, sumnjaju na
        utaju.
      </p>
      <p>Primjer problema:</p>
      <ul>
        <li>U PO-SD obrascu prijaviš 25.000 € primitaka za 2026.</li>
        <li>Izvadak računa pokazuje 45.000 € ukupnih uplata</li>
        <li>Razlika: 20.000 € — što je to?</li>
      </ul>
      <p>
        Sad moraš dokazivati da je svaka &quot;sumnjiva&quot; uplata <strong>privatna</strong>:
      </p>
      <ul>
        <li>&quot;Ovo je poklon od roditelja&quot; → trebaš izjavu</li>
        <li>&quot;Ovo je vraćen kredit od prijatelja&quot; → trebaš dokaz</li>
        <li>&quot;Ovo je refundacija putnih troškova&quot; → trebaš potvrdu</li>
      </ul>
      <p>
        Sa odvojenim računima, to pitanje ne postoji. Poslovni račun = poslovni primitci.
        Sve je jasno.
      </p>

      <h2 id='kako-odvojiti'>Kako odvojiti — 2 opcije</h2>

      <h3>Opcija A: Poslovni žiro + privatni tekući (tradicionalno)</h3>
      <p>
        <strong>Poslovni račun (žiro):</strong>
      </p>
      <ul>
        <li>Koristi se za primitke od klijenata (B2B, B2C)</li>
        <li>IBAN kreiran na OIB obrta</li>
        <li>Naknada: 0–5 €/mj (ovisno o banci i broju transakcija)</li>
      </ul>
      <p>
        <strong>Privatni račun (tekući):</strong>
      </p>
      <ul>
        <li>Koristi se za plaću, privatne uplate, osobne troškove</li>
        <li>IBAN kreiran na OIB fizičke osobe</li>
        <li>Obično besplatno za tekuće</li>
      </ul>
      <p>
        <strong>Prednost:</strong> Preglednost. Lako odvojiš poslovno od privatnog.
      </p>
      <p>
        <strong>Nedostatak:</strong> Dvostruki troškovi ako banka naplaćuje naknadu za
        oboje.
      </p>

      <h3>Opcija B: Dva tekuća (jedan kao &quot;poslovni&quot;)</h3>
      <p>
        Neki paušalisti imaju <strong>dva tekuća računa</strong> — jedan označen kao
        poslovan (ali tehnički i dalje tekući), drugi za privatno.
      </p>
      <p>
        Funkcionira, ali <strong>žiro je pregledniji</strong> za poreznu jer je službeno
        kategoriziran kao poslovni račun.
      </p>

      <h2 id='opcije'>Opcije za bankovni račun — usporedba</h2>

      <h3>Tradicionalne hrvatske banke</h3>
      <div className={tableWrap}>
        <table className='min-w-full border-collapse text-left'>
          <caption className='border-b border-[#1f2a28] px-4 py-3 text-left text-xs text-[#94a3a0]'>
            Usporedba mjesečnih naknada tradicionalnih banaka (informativno)
          </caption>
          <thead>
            <tr className='border-b border-[#1f2a28] text-[#94a3a0]'>
              <th className='px-3 py-2 font-medium'>Banka</th>
              <th className='px-3 py-2 font-medium'>Mjesečna naknada</th>
              <th className='px-3 py-2 font-medium'>Napomena</th>
            </tr>
          </thead>
          <tbody className='text-[#d5dfdd]'>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>PBZ</strong> (eŽiro)
              </td>
              <td className='px-3 py-2'>0–3 €/mj</td>
              <td className='px-3 py-2'>Ovisno o broju transakcija</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>Erste</strong>
              </td>
              <td className='px-3 py-2'>~5 €/mj</td>
              <td className='px-3 py-2'>Paketi za obrtnike dostupni</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>
                <strong>Zaba</strong>
              </td>
              <td className='px-3 py-2'>~5 €/mj</td>
              <td className='px-3 py-2'>Provjeriti u poslovnici</td>
            </tr>
            <tr>
              <td className='px-3 py-2'>
                <strong>Raiffeisen</strong>
              </td>
              <td className='px-3 py-2'>~5 €/mj</td>
              <td className='px-3 py-2'>Paketi za male poduzetnike</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <strong>Napomena:</strong> Točne cijene ovise o paketima i broju transakcija.
        Provjeri u banci prije otvaranja računa — cjenici često nisu javno objavljeni.
      </p>

      <h3>Fintech opcije</h3>
      <p>
        <strong>Revolut Business:</strong>
      </p>
      <ul>
        <li>
          <strong>Besplatan plan</strong> dostupan (Free tier)
        </li>
        <li>
          Potvrđeno od porezne (mišljenje 31.01.2023.) — može biti jedini poslovni račun
          paušalista
        </li>
        <li>Dostupno na revolut.com/hr-HR/business</li>
        <li>
          <strong>NAPOMENA:</strong> Revolut koristi latvijski IBAN što može utjecati na 2D
          barkodove za plaćanje — provjeri kompatibilnost prije prebacivanja svih uplate
        </li>
      </ul>
      <p>
        <strong>Ostale fintech opcije (Wise, N26...):</strong> Trenutno nema potvrđenih
        informacija za paušalne obrte u Hrvatskoj.{' '}
        <strong>Kvik redovito prati dostupnost novih fintech opcija</strong> i ovaj vodič
        ažuriramo čim postanu službeno dostupne.
      </p>

      <h2 id='jedan-racun'>Što ako već imam sve na jednom računu?</h2>

      <h3>Ne moraš mijenjati — ALI pripazi</h3>
      <p>
        Ako već posluješ s miješanim računom (poslovni + privatni primitci na istom IBAN-u),
        ne moraš odmah otvarati novi. ALI:
      </p>
      <ol>
        <li>
          <strong>Precizan PO-SD</strong> — svaku transakciju kategoriziraj točno
          (poslovna/privatna)
        </li>
        <li>
          <strong>Spremaj dokaznice</strong> — za svaku privatnu uplatu čuvaj dokaz (ugovor
          o kreditu, izjava o poklonu...)
        </li>
        <li>
          <strong>Pripremi se za kontrolu</strong> — porezna može zatražiti objašnjenje za
          svaku &quot;sumnjivu&quot; transakciju
        </li>
      </ol>

      <h3>Kada je obavezno odvojiti?</h3>
      <ul>
        <li>
          <strong>Prijelaz na d.o.o.</strong> → poslovni račun obavezan
        </li>
        <li>
          <strong>Ulazak u PDV sustav</strong> → poslovni račun obavezan
        </li>
        <li>
          <strong>Fiskalizacija 2.0</strong> (od 1.1.2027. za izdavanje eRačuna) → poslovni
          račun preporučen
        </li>
      </ul>
      <p>
        Više o tome kad prijeći na d.o.o. →{' '}
        <Link href={vodiciHref('pausalni-obrt-vs-doo')}>Paušalni obrt vs d.o.o.</Link>
      </p>

      <h2 id='greske'>Česte greške</h2>

      <h3>❌ &quot;Imam privatni IBAN na računu koji koristim za posao&quot;</h3>
      <p>
        <strong>Problem:</strong> Račun mora imati <strong>poslovni IBAN</strong> — IBAN
        kreiran na OIB obrta, ne OIB fizičke osobe.
      </p>
      <p>
        <strong>✅ Rješenje:</strong> Otvori žiro račun ili Revolut Business račun na ime
        obrta. Ne smiješ izdavati račune s privatnim IBAN-om.
      </p>

      <h3>❌ &quot;Prebacujem SVE s poslovnog na privatni odmah nakon što mi legne&quot;</h3>
      <p>
        <strong>Problem:</strong> Porezna vidi da poslovni račun uvijek ima 0 € stanje.
        Izgleda sumnjivo — gdje odlazi novac?
      </p>
      <p>
        <strong>✅ Rješenje:</strong> Ostavi <strong>buffer</strong> na poslovnom računu
        (barem 500–1.000 €). Prebacuj periodično (mjesečno), ne svaku uplatu istog dana.
      </p>

      <h3>❌ &quot;Otvorio sam Revolut poslovni, ali ne znam gdje staviti IBAN na račune&quot;</h3>
      <p>
        <strong>Problem:</strong> Latvijski IBAN (LT...) može zbuniti klijente koji nisu
        navikli na inozemne račune.
      </p>
      <p>
        <strong>✅ Rješenje:</strong> Na računima jasno označi &quot;Revolut Business&quot;
        ili &quot;Poslovni račun&quot; uz IBAN. Educiraj klijente da je to regularni račun
        — Revolut je u sustavu SEPA plaćanja kao i sve druge banke.
      </p>

      <h3>❌ &quot;Nisam označio račun kao poslovni u banci&quot;</h3>
      <p>
        <strong>Problem:</strong> Banka vodi račun kao privatni, nema ga u javnom registru
        poslovnih računa. Neki klijenti (javna nabava) traže potvrdu poslovnog računa.
      </p>
      <p>
        <strong>✅ Rješenje:</strong> Pri otvaranju računa <strong>eksplicitno traži da bude
        vođen kao poslovni</strong>. Ako već imaš otvoren tekući, zatraži prebacivanje u
        poslovni status.
      </p>

      <h2 id='alat'>Korisni alat</h2>
      <p>
        Izračunaj koliko moraš zaraditi ovaj mjesec da pokriješ doprinose, poreze i
        troškove:{' '}
        <Link href='/alati/kalkulator-poreza' className='text-[#0d9488] hover:underline'>
          Kalkulator primitaka
        </Link>
      </p>
      <p>
        Kvik automatski poveže sve račune s KPR-om i PO-SD obrascem — bez ručnog rada.
        Kreni besplatno:{' '}
        <Link href='/register' className='text-[#0d9488] hover:underline'>
          Isprobaj Kvik
        </Link>
      </p>
    </GuideShell>
  );
}

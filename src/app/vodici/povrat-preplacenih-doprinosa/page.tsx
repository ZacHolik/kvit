import type { Metadata } from 'next';

import { buildVodicMetadata } from '@/lib/og-metadata';
import Link from 'next/link';

import InlineCTA from '@/components/cta/InlineCTA';
import { vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'povrat-preplacenih-doprinosa';

const META_DESC =
  'Preplaćuješ doprinose? Saznaj kako provjeriti preplatu na PKK i korak-po-korak zatražiti povrat ili preknjiženje kroz ePoreznu. Bez odlaska u ured.';

export const metadata: Metadata = buildVodicMetadata(
  SLUG,
  'Povrat preplaćenih doprinosa paušalni obrt',
  META_DESC,
  'Povrat preplaćenih doprinosa paušalni obrt | Kvik',
);

const faq = [
  {
    question: 'Mogu li tražiti povrat za prošle godine?',
    answer:
      'Da, u roku zastarjelosti od 5 godina od nastanka preplate. Provjeri PKK za prošla stanja i podnesi zahtjev za svaki period u kojem je nastala preplata.',
  },
  {
    question: 'Koliko dugo traje povrat?',
    answer:
      'Nema zakonski fiksiranog roka za povrat doprinosa. Prema iskustvima obrtnika, povrat stiže na IBAN unutar nekoliko radnih dana do 2–3 tjedna od predaje urednog zahtjeva.',
  },
  {
    question: 'Što ako imam i preplatu i dugovanje istovremeno?',
    answer:
      'Porezna najprije poravna dugovanje, a ostatak vraća na IBAN. Ako želiš ciljano prenijeti preplatu s jednog konta na drugi, koristi "Preknjiženje" umjesto "Bezgotovinskog povrata".',
  },
  {
    question: 'Je li zahtjev besplatan?',
    answer:
      'Da. Podnošenje zahtjeva kroz ePoreznu je besplatno i ne zahtijeva dolazak u urede.',
  },
  {
    question:
      'Imam zaposlenje uz obrt i nisam znao da ne smim plaćati fiksne doprinose — što sad?',
    answer:
      'Provjeri PKK za period od zaposlenja do danas. Sve što si platio kao fiksnih 290,98 € a bio si zaposlen može biti preplata. Podnesi zahtjev. Ako nisi siguran za koji period — kontaktiraj svoju ispostavu Porezne uprave.',
  },
];

export default function PovratPreplacenihDoprinosaPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Povrat preplaćenih doprinosa paušalni obrt: korak-po-korak vodič'
      breadcrumbTitle='Povrat preplaćenih doprinosa'
      subtitle='Plaćaš doprinose svaki mjesec, ali jesi li siguran da plaćaš točan iznos? Razliku ti nitko neće sam vratiti — ali možeš je zatražiti sam, online, bez odlaska u poreznu.'
      readingMinutes={5}
      metaDescription={META_DESC}
      articleDateModified='2026-06-11'
      toc={[
        { id: 'kako-nastaje', label: 'Kako nastaje preplata — i zašto je tiha' },
        { id: 'korak-1', label: 'Korak 1 — Provjeri stanje na PKK' },
        { id: 'korak-2', label: 'Korak 2 — Odluči: preknjiženje ili povrat?' },
        { id: 'korak-3', label: 'Korak 3 — Podnesi zahtjev' },
        { id: 'korak-4', label: 'Korak 4 — Zaposlio si se uz obrt' },
        { id: 'rokovi', label: 'Rokovi i zastara' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('doprinosi'), title: 'Doprinosi paušalni obrt 2026' },
        { href: vodiciHref('po-sd-obrazac'), title: 'PO-SD obrazac — vodič' },
        { href: vodiciHref('rokovi-placanja'), title: 'Rokovi plaćanja paušalni obrt' },
        {
          href: vodiciHref('pausalni-obrt-vodic'),
          title: 'Paušalni obrt — kompletan vodič',
        },
      ]}
      howTo={{
        name: 'Povrat preplaćenih doprinosa paušalni obrt',
        description:
          'Korak-po-korak postupak provjere preplate na PKK i podnošenja zahtjeva za povrat ili preknjiženje kroz ePoreznu.',
        steps: [
          {
            name: 'Provjeri stanje na PKK',
            text: 'Prijavi se na ePoreznu, otvori porezno-knjigovodstvenu karticu i provjeri stupac "Raspoloživo za preknjiženje/povrat" po svakom kontu.',
          },
          {
            name: 'Odluči: preknjiženje ili povrat',
            text: 'Ako imaš dugovanje na drugom kontu — traži preknjiženje. Ako nemaš nepodmirenih obveza — traži povrat na IBAN.',
          },
          {
            name: 'Podnesi zahtjev u ePoreznoj',
            text: 'Obrasci → Preknjiženja → Novi zahtjev. Za povrat odaberi "Bezgotovinski povrat", za prijenos "Preknjiženje".',
          },
          {
            name: 'Prati status zahtjeva',
            text: 'Status prati u istom izborniku — "Konačan" znači da je zahtjev obrađen. Povrat na IBAN stiže u nekoliko radnih dana do 2–3 tjedna.',
          },
        ],
      }}
    >
      <p>
        <strong>Povrat preplaćenih doprinosa paušalni obrt</strong> nije automatski
        proces — ako si platio više nego što trebaš, Porezna uprava to ne ispravlja
        sama. U ovom vodiču prolazimo kako nastaje preplata, kako je provjeriti na
        PKK-u u ePoreznoj i kako podnijeti zahtjev za{' '}
        <strong>povrat preplaćenih doprinosa</strong> ili preknjiženje — bez odlaska
        u ured. Za kontekst mjesečnih obveza vidi i{' '}
        <Link href={vodiciHref('doprinosi')}>doprinosi paušalni obrt</Link>.
      </p>

      <h2 id='kako-nastaje'>Kako nastaje preplata — i zašto je tiha</h2>
      <p>
        Paušalni obrtnik koji je jedina djelatnost plaća fiksnih{' '}
        <strong>290,98 €</strong> doprinosa mjesečno u 2026. (prema Naredbi o
        iznosima osnovica, NN 150/2025): MIO I. stup 119,58 €, MIO II. stup 39,86 €,
        zdravstveno 131,54 €. Iznos je određen godišnjom naredbom i vrijedi za cijelu
        godinu.
      </p>
      <p>
        Problem nastaje kad se nešto u tvom životu promijeni — ali tvoja uplatnica
        ostane ista.
      </p>
      <p>Najčešći uzroci preplate:</p>

      <h3>Zaposlenje uz obrt</h3>
      <p>
        Ako si imao paušalni obrt kao jedinu djelatnost i zatim si se zaposlio, od
        trenutka zaposlenja obrt ti postaje &quot;druga djelatnost&quot;. Prestaje
        obveza fiksnih mjesečnih doprinosa — oni se od tada utvrđuju jednom godišnje
        rješenjem Porezne uprave na temelju ostvarenih primitaka, a godišnja osnovica
        je paušalni dohodak (prema čl. 185. st. 3. Zakona o doprinosima). Ako nisi
        znao za ovu promjenu i nastavio plaćati starih 290,98 € svaki mjesec, svaki
        taj euro je preplata.
      </p>

      <h3>Pogrešna uplatnica</h3>
      <p>
        Kriva vrsta prihoda, kriva oznaka, dupla uplata — sve završava kao preplata
        na jednom od kontos dok dug možda stoji na drugom. Porezna uprava to ne
        ispravlja sama od sebe.
      </p>

      <h3>Promijenjen razred pri godišnjem obračunu</h3>
      <p>
        Ako si godinu procijenio u višem razredu, a ostvario primitke u nižem, može
        nastati razlika na razini paušalnog poreza. Ovo se razrješava automatski kroz{' '}
        <Link href={vodiciHref('po-sd-obrazac')}>PO-SD</Link>, ali doprinosi koji su
        plaćeni iznad obveze ostaju kao preplata dok ih ne zatražiš natrag.
      </p>
      <p>
        Preplata se ne briše sama od sebe. Stoji na tvojoj porezno-knjigovodstvenoj
        kartici (PKK) dok je ti ne zatražiš natrag ili ne tražiš preknjiženje.
      </p>

      <h2 id='korak-1'>Korak 1 — Provjeri stanje na PKK</h2>
      <p>
        Sve preplate i dugovi vidljivi su u ePoreznoj, u porezno-knjigovodstvenoj
        kartici (PKK).
      </p>
      <p>Koraci za provjeru:</p>
      <ol>
        <li>
          Prijavi se na ePorezna portal putem NIAS vjerodajnice (token banke, mToken
          ili eID)
        </li>
        <li>
          Otvori PKK — prikazuju se stanja po vrstama prihoda: MIO I. stup, MIO II.
          stup, zdravstveno, paušalni porez
        </li>
        <li>
          Pogledaj stupac &quot;Raspoloživo za preknjiženje/povrat&quot; — pozitivan
          saldo znači preplatu
        </li>
        <li>
          Provjeri sve kontos odvojeno — preplata na jednom ne pokriva dug na drugom
          automatski
        </li>
      </ol>
      <p>
        Ako saldo pokazuje preplatu, sredstva su tamo i možeš ih zatražiti natrag ili
        ih preknjiži na kontni broj gdje imaš dugovanje.
      </p>

      <h2 id='korak-2'>Korak 2 — Odluči: preknjiženje ili povrat?</h2>
      <p>
        <strong>Preknjiženje</strong> = preneseš višak s jednog konta na drugi gdje
        imaš dugovanje. Korisno ako imaš preplatu na MIO I. stupu, a zaostak na
        zdravstvenom. Time izbjegavaš zatezne kamate.
      </p>
      <p>
        <strong>Povrat na IBAN</strong> = novac dolazi natrag na tvoj tekući račun.
        Moguće ako nemaš nikakvih nepodmirenih obveza ni na jednom kontu.
      </p>
      <p>
        Preporučeni redoslijed: prvo provjeri imaš li ikakva dugovanja. Ako imaš —
        traži preknjiženje. Ako nemaš — traži povrat.
      </p>

      <InlineCTA
        tema='doprinosi'
        pageSlug={SLUG}
        ctaText='Nisi siguran imaš li preplate?'
        ctaButton='Pitaj AI asistenta'
        ctaHref='/asistent'
      />

      <h2 id='korak-3'>Korak 3 — Podnesi zahtjev kroz ePoreznu</h2>
      <p>
        Obrazac koji koristiš: <strong>Preknjiženja</strong> (dostupan u ePoreznoj, i
        za povrat i za preknjiženje).
      </p>

      <h3>Za povrat na IBAN</h3>
      <ol>
        <li>U ePoreznoj otvori: Obrasci → Preknjiženja → Novi zahtjev</li>
        <li>Klikni &quot;Dodaj stavku&quot;</li>
        <li>Pod vrstu posla odaberi: &quot;Bezgotovinski povrat&quot;</li>
        <li>
          Unesi: konto (vrstu prihoda) s preplatom, iznos koji tražiš natrag, IBAN
          tekućeg računa
        </li>
        <li>
          U polje za obrazloženje upiši kratku rečenicu, npr. &quot;Molim povrat
          preplate na MIO I. stupu jer nemam nepodmirenih obveza na drugim
          kontima.&quot;
        </li>
        <li>Pošalji zahtjev</li>
      </ol>

      <h3>Za preknjiženje</h3>
      <p>
        Isti put (Obrasci → Preknjiženja → Novi zahtjev), ali pod vrstu posla odabereš
        &quot;Preknjiženje&quot; i unesiš s kojeg konta na koji konto šalješ sredstva.
      </p>
      <p>
        Porezna uprava obrađuje zahtjev i šalje povrat na IBAN unutar nekoliko radnih
        dana. Status zahtjeva pratiš u istom izborniku (stupac &quot;Status&quot; →
        &quot;Konačan&quot;).
      </p>
      <p>
        Zahtjev se može podnijeti i osobno ili poštom na nadležnu ispostavu Porezne
        uprave prema prebivalištu, ali elektronički put kroz ePoreznu je brži i
        ostavlja pisani trag.
      </p>

      <h2 id='korak-4'>Korak 4 — Poseban slučaj: zaposlio si se uz obrt</h2>
      <p>
        Ovo je najčešći i najskuplji uzrok preplate koji paušalisti previđaju.
      </p>
      <p>
        Ako si uz paušalni obrt počeo raditi u radnom odnosu, od tog trenutka obrt
        je &quot;druga djelatnost&quot;. Prema Zakonu o doprinosima, fiksni mjesečni
        doprinosi prestaju — obveza se utvrđuje jednom godišnje, rješenjem Porezne
        uprave, na temelju ostvarenog paušalnog dohotka koji prijavljuješ u{' '}
        <Link href={vodiciHref('po-sd-obrazac')}>PO-SD obrascu</Link>.
      </p>
      <p>
        Ako si i dalje plaćao fiksnih 290,98 € nakon zaposlenja, svaki taj iznos je
        preplata. Porezna uprava to neće sama ispraviti — ti moraš podnijeti zahtjev.
      </p>
      <p>Što napraviti:</p>
      <ol>
        <li>Provjeri od kojeg datuma si zaposlen uz obrt</li>
        <li>Prebroji koliko si mjeseci plaćao fiksne doprinose nakon tog datuma</li>
        <li>Provjeri PKK i vidi koliko se vidi kao preplata</li>
        <li>Podnesi zahtjev za povrat ili preknjiženje</li>
      </ol>
      <p>
        Napomena: ako Porezna uprava nije ažurirala tvoje rješenje temeljem promjene
        osnove osiguranja, kontaktiraj svoju ispostavu — s tim se pokreće ispravak
        rješenja.
      </p>
      <p>
        Saznaj više o{' '}
        <Link href={vodiciHref('doprinosi')}>doprinosima uz zaposlenje</Link>.
      </p>

      <h2 id='rokovi'>Rokovi i zastara</h2>
      <p>
        Prema Općem poreznom zakonu, pravo na povrat preplaćenog poreza i doprinosa
        zastarijeva u roku od 5 godina od dana kada je preplata nastala. To znači da
        možeš tražiti povrat za preplate nastale unazad 5 godina.
      </p>
      <p>
        Porezna uprava nema zakonski propisan rok za obradu zahtjeva za povrat
        doprinosa, ali u praksi obrada traje od nekoliko radnih dana do 2–3 tjedna.
        Status pratiš u ePoreznoj. Za ostale rokove paušalista vidi{' '}
        <Link href={vodiciHref('rokovi-placanja')}>rokovi plaćanja paušalni obrt</Link>
        .
      </p>
      <p>
        Za praktičan rad od računa do KPR-a i PO-SD-a isprobaj{' '}
        <Link href='/register'>Kvik besplatno</Link>, a dodatna pitanja možeš postaviti
        i <Link href='/asistent'>AI asistentu u aplikaciji</Link>.
      </p>
    </GuideShell>
  );
}

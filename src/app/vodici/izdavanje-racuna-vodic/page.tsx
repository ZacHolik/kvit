import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'izdavanje-racuna-vodic';

const META_DESC =
  'Kompletan vodič za izdavanje računa: interni akt, numeracija, obvezni elementi, fiskalizacija i čuvanje.';

export const metadata: Metadata = {
  title: 'Vodič za izdavanje računa – paušalni obrt 2026.',
  description: META_DESC,
  openGraph: {
    title: 'Vodič za izdavanje računa – paušalni obrt 2026. | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Što je interni akt i moram li ga imati?',
    answer:
      'Interni akt je dokument kojim definiraš slijednost brojeva računa, oznaku poslovnog prostora, oznaku naplatnog uređaja i blagajnički maksimum. Potreban je prije prvog izdavanja računa.',
  },
  {
    question: 'Kako numerirati račune?',
    answer:
      'U izvoru je predloženo POSL1 kao oznaka prostora i 1 kao oznaka uređaja, pa računi idu kao 1-POSL1-1, 2-POSL1-1, 3-POSL1-1 i tako dalje. Bitna je dosljednost.',
  },
  {
    question: 'Što mora pisati na računu?',
    answer:
      'Račun mora imati sve obvezne elemente prema propisima: identitet izdavatelja, broj i datum, opis stavki, iznos i podatke potrebne za naplatu te odgovarajuće napomene o poreznom statusu.',
  },
  {
    question: 'Kada moram fiskalizirati?',
    answer:
      'Za krajnjeg potrošača (B2C) račun treba biti fiskaliziran. Kod transakcijskih računa u krajnjoj potrošnji od 1.1.2026. također se primjenjuje obveza fiskalizacije.',
  },
  {
    question: 'Koliko dugo čuvam račune?',
    answer:
      'Račune i povezanu dokumentaciju standardno čuvaš 11 godina. To uključuje i digitalne kopije te potvrde povezane s izdavanjem i slanjem računa.',
  },
];

export default function IzdavanjeRacunaVodicPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Vodič za izdavanje računa – paušalni obrt 2026.'
      subtitle='Od internog akta do arhive: kompletan proces da račun bude ispravan i naplativ.'
      readingMinutes={12}
      metaDescription={META_DESC}
      toc={[
        { id: 'interni-akt', label: 'Interni akt' },
        { id: 'numeracija', label: 'Numeracija računa' },
        { id: 'elementi', label: 'Obvezni elementi računa' },
        { id: 'blagajnicki', label: 'Blagajnički maksimum' },
        { id: 'fiskalizacija', label: 'Fiskalizacija' },
        { id: 'eracun', label: 'eRačun za firme' },
        { id: 'cuvanje', label: 'Čuvanje računa' },
        { id: 'greske', label: 'Česte greške' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('izdavanje-racuna'), title: 'Izdavanje računa' },
        { href: vodiciHref('fiskalizacija-20'), title: 'Fiskalizacija 2.0' },
        { href: vodiciHref('kpr-knjiga-prometa'), title: 'KPR knjiga prometa' },
      ]}
      howTo={{
        name: 'Postavljanje izdavanja računa u paušalnom obrtu',
        description:
          'Redoslijed kojim postavljaš dokumente i pravila prije prvog računa, pa sve do arhive.',
        steps: [
          {
            name: 'Sastavi interni akt',
            text: 'Definiraj numeraciju, oznake poslovnog prostora i uređaja te blagajnički maksimum.',
          },
          {
            name: 'Postavi numeraciju',
            text: 'U sustavu za račune aktiviraj dosljedan format, npr. 1-POSL1-1.',
          },
          {
            name: 'Izdaj račun po tipu klijenta',
            text: 'B2C fiskalizirani račun, a za B2B koristi pravila eRačuna i prijelazne iznimke.',
          },
          {
            name: 'Arhiviraj dokumentaciju',
            text: 'Čuvaj račune i potvrde najmanje 11 godina u sigurnoj digitalnoj arhivi.',
          },
        ],
      }}
    >
      <p>
        Upit <strong>izdavanje računa paušalni obrt vodič</strong> obično znači isto:
        želiš izdavati račune bez pravnih rupa, bez improvizacije i bez kasnijeg vraćanja na
        početak. Račun nije samo dokument za naplatu, nego i temelj za evidenciju primitaka,
        KPR i godišnje porezne obveze. Zato cijeli proces treba postaviti ispravno od prvog
        dana, počevši od internog akta.
      </p>
      <p>
        Ovaj vodič koristi podatke iz baze znanja i pokriva kompletan tok: interni akt,
        numeracija, obvezni elementi, fiskalizacija, eRačun i čuvanje dokumentacije. Za širi
        kontekst obveza provjeri i{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR knjigu prometa</Link> te{' '}
        <Link href={vodiciHref('fiskalizacija-20')}>fiskalizaciju 2.0</Link>.
      </p>

      <h2 id='interni-akt'>Interni akt – što je i zašto je obvezan</h2>
      <p>
        Interni akt je prvi korak prije izdavanja prvog računa. U izvoru je jasno navedeno da
        internim aktom definiraš slijednost brojeva računa, oznaku poslovnog prostora, oznaku
        naplatnog uređaja i blagajnički maksimum. To je dokument koji postavlja pravila igre
        prije nego što počneš naplaćivati.
      </p>
      <p>
        Mnogi paušalisti ga dožive kao čistu formalnost, ali upravo taj dokument kasnije
        objašnjava zašto su brojevi računa točno takvi kakvi jesu. Ako interni akt ne postoji
        ili je postavljen nejasno, svaka promjena numeracije izgleda kao improvizacija. Zato
        ga je bolje kvalitetno postaviti odmah, pa onda samo dosljedno slijediti.
      </p>

      <h2 id='numeracija'>Numeracija računa (format POSL1-1)</h2>
      <p>
        U bazi je predložen praktičan primjer: oznaka poslovnog prostora{' '}
        <strong>POSL1</strong> i oznaka naplatnog uređaja <strong>1</strong>. Računi onda idu
        kao <strong>1-POSL1-1</strong>, <strong>2-POSL1-1</strong>,{' '}
        <strong>3-POSL1-1</strong> i dalje redom. Taj model je jednostavan, čitljiv i lako ga
        je održavati kroz godinu.
      </p>
      <p>
        Najveća pogreška kod numeracije nije „krivi stil”, nego prekidi slijeda i duplikati.
        Ako koristiš više alata ili ručno prepisuješ brojeve, rizik raste. Zato je preporuka
        imati jedan centralni sustav za izdavanje računa koji automatski čuva slijednost.
      </p>

      <h2 id='elementi'>Obvezni elementi računa</h2>
      <p>
        Svaki račun mora sadržavati podatke koji ga čine valjanim poslovnim dokumentom:
        identitet izdavatelja, broj računa, datum, opis usluge ili proizvoda, iznos i podatke
        za plaćanje. U praksi su važne i napomene vezane uz porezni status jer kupac iz računa
        mora razumjeti kako je iznos formiran.
      </p>
      <p>
        Ako izdaješ račune različitim tipovima klijenata (fizičke osobe, firme, javni sektor),
        operativni detalji se mijenjaju. Zato je korisno imati predloške po tipu klijenta umjesto
        jednog univerzalnog obrasca koji kasnije ručno korigiraš.
      </p>

      <h2 id='blagajnicki'>Blagajnički maksimum</h2>
      <p>
        Interni akt uključuje i blagajnički maksimum: količinu gotovine koju smiješ držati u
        blagajni. U izvoru je objašnjeno da nakon dosezanja definiranog iznosa gotovinu treba
        „maknuti” iz blagajne. To pravilo je osobito važno obrtnicima koji rade s gotovinskim
        prometom i žele održati urednu evidenciju.
      </p>
      <p>
        Iako dio paušalista radi gotovo isključivo bezgotovinski, dobro je i tada imati jasno
        definirano pravilo u internom aktu. Time ostaješ konzistentan ako se model naplate
        tijekom godine promijeni.
      </p>

      <h2 id='fiskalizacija'>Fiskalizacija – kada je obvezna</h2>
      <p>
        U dostupnim podacima je vrlo jasno: kada je klijent krajnji potrošač (B2C), treba
        izdati fiskalizirani račun. Dodatno, od 1.1.2026. transakcijski računi izdani u
        krajnjoj potrošnji također ulaze u obvezu fiskalizacije. To znači da Excel i ručni
        predlošci više nisu dovoljni za taj dio poslovanja.
      </p>
      <p>
        Ako već koristiš aplikaciju za fiskalne račune, najčešće je dovoljno uključiti pravila
        i za transakcijske račune prema građanima. Ako do sada nisi fiskalizirao jer si radio
        samo transakcijski, upravo je ovo točka gdje trebaš prijeći na alat koji to podržava.
      </p>

      <h2 id='eracun'>eRačun za firme</h2>
      <p>
        Za poslovne subjekte (B2B) pravilo iz izvora kaže da se isporučuje eRačun, uz navedenu
        iznimku do <strong>1.1.2027.</strong> za subjekte izvan PDV sustava koji prema firmama
        mogu izdavati PDF. Za javne ustanove i državne tvrtke obveza eRačuna je već sada
        standard. Zato je važno da alat koji koristiš podržava i fiskalizaciju i eRačune.
      </p>
      <p>
        Dobra odluka je imati jedinstven proces: jedan sustav za sve tipove klijenata, a ne
        kombinaciju više alata koja povećava rizik grešaka i otežava arhivu.
      </p>

      <h2 id='cuvanje'>Čuvanje računa (11 godina)</h2>
      <p>
        Račune i prateću dokumentaciju treba čuvati <strong>11 godina</strong>. To uključuje
        ne samo PDF račune nego i sve što potvrđuje njihov status: fiskalne potvrde, podatke o
        slanju eRačuna i eventualne dopune. Arhiva treba biti organizirana tako da brzo pronađeš
        dokument po broju računa, klijentu ili datumu.
      </p>
      <p>
        Minimalni standard je redoviti backup i jasna struktura mapa po godinama. Ako ti je
        arhiva rasuta po mailovima i lokalnim diskovima, operativni rizik je velik i nepotrebno
        troši vrijeme kad trebaš dokazati ispravnost poslovanja.
      </p>

      <h2 id='greske'>Česte greške</h2>
      <p>
        Najčešće greške su praktične: račun se izda prije definiranja internog akta, numeracija
        nije dosljedna, za B2C se ne provede fiskalizacija, za B2B se zanemari eRačun logika i
        dokumenti se ne arhiviraju sustavno. Sve su to greške koje ne izgledaju dramatično u
        trenutku nastanka, ali postaju skupe kad ih treba retroaktivno ispravljati.
      </p>
      <p>
        Ako želiš stabilan sustav, koristi ovu jednostavnu rutinu: prvo interni akt, zatim
        numeracija, zatim pravila po tipu klijenta i na kraju arhiva. Za dodatni operativni
        kontekst pogledaj i vodič{' '}
        <Link href={vodiciHref('izdavanje-racuna')}>Izdavanje računa</Link> te{' '}
        <Link href={vodiciHref('fiskalizacija-20')}>Fiskalizacija 2.0</Link>.
      </p>
    </GuideShell>
  );
}

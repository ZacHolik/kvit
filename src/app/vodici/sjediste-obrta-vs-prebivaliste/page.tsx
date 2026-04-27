import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'sjediste-obrta-vs-prebivaliste';

const META_DESC =
  'Koja adresa ide na račun, koja na PO-SD obrazac i koja za fiskalizaciju – jasno objašnjeno.';

const PRIMARY_KEYWORD = 'sjedište obrta prebivalište paušalni obrt';

export const metadata: Metadata = {
  title: 'Sjedište obrta vs prebivalište vlasnika – što ide gdje?',
  description: META_DESC,
  openGraph: {
    title: 'Sjedište obrta vs prebivalište vlasnika – što ide gdje? | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Koja adresa ide na račun?',
    answer:
      'Na račun ide sjedište obrta, odnosno adresa koja je upisana u Obrtni registar. To je poslovna adresa izdavatelja računa, bez obzira na to gdje vlasnik fizički živi.',
  },
  {
    question: 'Koja adresa ide na PO-SD obrazac?',
    answer:
      'Na PO-SD obrazac u pravilu ide prebivalište vlasnika obrta, jer je paušalni porez vezan uz fizičku osobu i nadležnu ispostavu Porezne uprave prema prebivalištu.',
  },
  {
    question: 'Što je šifra općine i zašto je važna?',
    answer:
      'Šifra općine označava jedinicu lokalne samouprave prema kojoj se raspoređuje porez i prirez odnosno lokalna porezna pripadnost. Kod paušalnog obrta gleda se prebivalište vlasnika, ne sjedište obrta.',
  },
  {
    question: 'Mogu li imati obrt u jednom gradu a živjeti u drugom?',
    answer:
      'Da. Obrt može imati sjedište u jednom gradu, a vlasnik može imati prebivalište u drugom. Bitno je da svaku adresu koristiš u ispravnom kontekstu: sjedište za račune, prebivalište za porezne obrasce i nadležnost.',
  },
  {
    question: 'Kako prijaviti poslovni prostor za fiskalizaciju?',
    answer:
      'Poslovni prostor za fiskalizaciju prijavljuje se prema stvarnoj adresi prostora iz kojeg izdaješ fiskalizirane račune. Ako se prostor promijeni, podatke treba ažurirati prije izdavanja računa s te lokacije.',
  },
];

export default function SjedisteObrtaVsPrebivalistePage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Sjedište obrta vs prebivalište vlasnika – što ide gdje?'
      subtitle='Računi, PO-SD, fiskalizacija i Porezna uprava koriste različite adrese — evo kako ih ne pomiješati.'
      readingMinutes={9}
      metaDescription={META_DESC}
      toc={[
        { id: 'razlika', label: 'Glavna razlika' },
        { id: 'sjediste', label: 'Što je sjedište obrta' },
        { id: 'prebivaliste', label: 'Što je prebivalište vlasnika' },
        { id: 'sto-gdje', label: 'Što ide gdje' },
        { id: 'porezna', label: 'Porezna ispostava i šifra općine' },
        { id: 'primjer', label: 'Primjer: Zagreb i Samobor' },
        { id: 'kvik', label: 'Kako unijeti u Kvik' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('po-sd-obrazac'), title: 'PO-SD obrazac' },
        { href: vodiciHref('izdavanje-racuna'), title: 'Izdavanje računa' },
        { href: vodiciHref('fiskalizacija-20'), title: 'Fiskalizacija 2.0' },
        { href: vodiciHref('otvaranje-obrta'), title: 'Otvaranje obrta' },
      ]}
    >
      <p>
        Kod paušalnog obrta često se miješaju dvije adrese koje na papiru zvuče slično,
        ali imaju različitu funkciju: <strong>sjedište obrta</strong> i{' '}
        <strong>prebivalište vlasnika</strong>. Ako tražiš odgovor za{' '}
        <strong>{PRIMARY_KEYWORD}</strong>, najkraće pravilo glasi ovako: sjedište
        obrta koristiš za poslovni identitet obrta, a prebivalište vlasnika za poreznu
        nadležnost fizičke osobe.
      </p>
      <p>
        Ta razlika postaje važna čim izdaješ prvi račun, predaješ{' '}
        <Link href={vodiciHref('po-sd-obrazac')}>PO-SD obrazac</Link>, prijavljuješ
        poslovni prostor za <Link href={vodiciHref('fiskalizacija-20')}>fiskalizaciju</Link>{' '}
        ili tražiš šifru općine. Pogrešna adresa obično ne znači katastrofu, ali može
        dovesti do krivih podataka na dokumentima, nepotrebnih ispravaka i pitanja od
        klijenata ili Porezne uprave.
      </p>

      <h2 id='razlika'>Glavna razlika</h2>
      <p>
        Sjedište obrta je adresa poslovanja upisana u Obrtni registar. Ona predstavlja
        obrt kao gospodarski subjekt: gdje je obrt registriran, koja se adresa prikazuje
        na izvatku i koja se koristi kao službena poslovna adresa u komunikaciji s
        kupcima. Zato se sjedište obrta nalazi na računu, uz naziv obrta, OIB i ostale
        obvezne elemente koje opisujemo u vodiču za{' '}
        <Link href={vodiciHref('izdavanje-racuna')}>izdavanje računa</Link>.
      </p>
      <p>
        Prebivalište vlasnika je osobna adresa fizičke osobe koja je vlasnik obrta. To
        je mjesto gdje vlasnik živi i prema kojem se određuju neke porezne i lokalne
        nadležnosti. Paušalni obrt nije zasebna pravna osoba poput d.o.o.-a, nego je
        snažno vezan uz vlasnika kao fizičku osobu. Upravo zato se kod godišnjih poreznih
        obveza često gleda prebivalište vlasnika, a ne adresa sjedišta obrta.
      </p>

      <h2 id='sjediste'>Što je sjedište obrta</h2>
      <p>
        Sjedište obrta je adresa koja je unesena u Obrtni registar pri otvaranju obrta
        ili kasnijoj promjeni podataka. Može biti vlastiti prostor, unajmljeni prostor
        ili druga dopuštena adresa za koju imaš pravnu osnovu korištenja. Kod{' '}
        <Link href={vodiciHref('otvaranje-obrta')}>otvaranja obrta</Link> zato se
        obično priprema suglasnost vlasnika prostora, ugovor o najmu ili drugi dokaz da
        smiješ koristiti adresu.
      </p>
      <p>
        Na računima se sjedište obrta prikazuje zato što kupac mora znati tko mu izdaje
        račun i na kojoj je poslovnoj adresi izdavatelj registriran. Ako radiš iz
        coworkinga, ateljea, ordinacije, salona ili kućnog ureda koji je prijavljen kao
        sjedište, ta adresa je dio tvog poslovnog identiteta. Ako se sjedište promijeni,
        treba ga ažurirati u registru i zatim u alatu za račune kako bi novi dokumenti
        nosili točan podatak.
      </p>

      <h2 id='prebivaliste'>Što je prebivalište vlasnika</h2>
      <p>
        Prebivalište vlasnika je osobna adresa prijavljena za fizičku osobu. To nije
        nužno ista adresa kao sjedište obrta. Vlasnik može živjeti u Samoboru, a imati
        obrt registriran u Zagrebu, ili živjeti u Splitu, a poslovni prostor imati u
        Solinu. Takve kombinacije nisu neobične, posebno kod obrtnika koji rade na
        terenu, koriste ured u drugom gradu ili se sele nakon otvaranja obrta.
      </p>
      <p>
        Za paušaliste je prebivalište posebno bitno kod porezne nadležnosti. Ispostava
        Porezne uprave određuje se prema prebivalištu vlasnika, a šifra općine na
        poreznim obrascima također prati prebivalište. Ako se preseliš, promjena
        prebivališta može utjecati na to kojoj ispostavi pripadaš i koju šifru općine
        koristiš u obrascima.
      </p>

      <h2 id='sto-gdje'>Što ide gdje</h2>
      <p>
        Na <strong>račun</strong> uvijek ide sjedište obrta. Račun je poslovni dokument
        obrta i zato treba prikazati poslovnu adresu iz Obrtnog registra. Uz nju idu
        naziv obrta, ime vlasnika ako je dio poslovnog imena, OIB, broj računa, datum,
        opis usluge ili robe i ostali elementi. Prebivalište vlasnika ne stavlja se na
        račun samo zato što je vlasnik tamo prijavljen.
      </p>
      <p>
        Na <strong>PO-SD obrazac</strong> ide prebivalište vlasnika. PO-SD je godišnji
        porezni obrazac za paušalni dohodak i povezuje se s fizičkom osobom koja obavlja
        djelatnost. Ako je obrt registriran na jednoj adresi, a vlasnik živi na drugoj,
        za PO-SD je relevantna osobna adresa vlasnika. To je jedna od najčešćih zabuna
        kad ljudi prepisuju podatke s računa ili iz rješenja bez provjere konteksta.
      </p>
      <p>
        Za <strong>fiskalizaciju</strong> je ključna adresa poslovnog prostora, odnosno
        stvarna lokacija s koje izdaješ fiskalizirane račune. To može biti isto kao
        sjedište obrta, ali ne mora. Ako imaš više prostora, pokretno poslovanje ili
        specifičan teren rada, treba provjeriti kako se prostor prijavljuje u tvom
        slučaju. Fiskalizacija gleda operativnu lokaciju prometa, ne automatski
        prebivalište vlasnika.
      </p>

      <h2 id='porezna'>Porezna ispostava i šifra općine</h2>
      <p>
        Ispostava Porezne uprave za paušalni obrt u pravilu se određuje prema
        prebivalištu vlasnika. To znači da ne moraš gledati gdje je sjedište obrta nego
        gdje si ti kao fizička osoba prijavljen. Ako živiš u Samoboru, a obrt ima
        sjedište u Zagrebu, tvoja porezna komunikacija i nadležnost najčešće prate
        Samobor.
      </p>
      <p>
        Šifra općine ide istom logikom: prema prebivalištu, ne prema sjedištu obrta.
        Važna je zato što porezni sustav kroz nju zna lokalnu pripadnost obveznika i
        pravilno raspoređuje obveze. U praksi je to mali broj u obrascu, ali krivi broj
        može proizvesti nepotrebno dopisivanje i ispravke. Zato šifru općine nemoj
        određivati prema adresi na računu ako račun prikazuje sjedište obrta koje nije
        tvoje prebivalište.
      </p>

      <h2 id='primjer'>Primjer: obrt u Zagrebu, vlasnik u Samoboru</h2>
      <p>
        Zamislimo paušalni obrt za web dizajn. Sjedište obrta je u Zagrebu jer vlasnik
        koristi ured i tamo je obrt upisan u Obrtni registar. Vlasnik privatno živi u
        Samoboru i tamo ima prijavljeno prebivalište. Kad izdaje račun klijentu, na
        računu piše zagrebačka adresa obrta. To je poslovna adresa izdavatelja računa i
        klijent ne treba vidjeti privatnu adresu vlasnika ako ona nije sjedište.
      </p>
      <p>
        Kada isti obrtnik predaje PO-SD, koristi prebivalište u Samoboru. Nadležna
        ispostava Porezne uprave i šifra općine gledaju Samobor, ne Zagreb. Ako izdaje
        fiskalizirane račune iz zagrebačkog ureda, poslovni prostor za fiskalizaciju
        prijavljuje prema toj stvarnoj poslovnoj lokaciji. Ako kasnije počne izdavati
        račune iz drugog prostora, taj podatak treba ažurirati prije nego što računi
        krenu iz nove lokacije.
      </p>

      <h2 id='kvik'>Kako to ispravno unijeti u Kvik</h2>
      <p>
        U Kviku razdvoji podatke tako da se poslovni podaci obrta koriste na računima,
        a osobni porezni podaci vlasnika ondje gdje služe za obrasce i poreznu
        nadležnost. Ulogirani korisnici mogu provjeriti i ažurirati podatke u{' '}
        <Link href='/postavke'>postavkama</Link>. Posebno provjeri naziv obrta,
        sjedište, OIB, IBAN, prebivalište vlasnika, šifru općine i podatke poslovnog
        prostora ako koristiš fiskalizaciju.
      </p>
      <p>
        Ako još nemaš račun u aplikaciji, kreni od{' '}
        <Link href='/register'>besplatne registracije</Link> i odmah postavi adrese
        odvojeno. Tako će račun povlačiti sjedište obrta, PO-SD podaci prebivalište
        vlasnika, a fiskalizacija adresu poslovnog prostora. To nije samo urednost u
        profilu; to je razlika između dokumenta koji je točan za svoju svrhu i dokumenta
        koji miješa poslovni i osobni kontekst.
      </p>
    </GuideShell>
  );
}

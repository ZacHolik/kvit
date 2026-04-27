import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'turisticka-clanarina';

const META_DESC =
  'Koji paušalni obrtnici moraju plaćati turističku članarinu, iznosi za 2026. i kako ispuniti TZ1 obrazac.';

export const metadata: Metadata = {
  title: 'Turistička članarina – tko plaća i koliko 2026.',
  description: META_DESC,
  openGraph: {
    title: 'Turistička članarina – tko plaća i koliko 2026. | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Moram li kao paušalist plaćati turističku članarinu?',
    answer:
      'Plaćaš je ako imaš registriranu djelatnost u turizmu, ugostiteljstvu ili djelatnost koja ima koristi od turizma. U bazi je posebno naglašeno da obveza može postojati i kad ti posao na prvi pogled nije turistički.',
  },
  {
    question: 'Koje djelatnosti su obveznici?',
    answer:
      'Djelatnosti su podijeljene u pet skupina. U dostupnim podacima su, primjerice, smještaj (55), priprema i usluživanje hrane i pića (56), taksi-služba (49.32), poslovanje nekretninama (68) i agencije za promidžbu (73.11).',
  },
  {
    question: 'Kako ispuniti TZ1 obrazac?',
    answer:
      'Praktično je krenuti od točnog popisa djelatnosti, utvrditi koja podliježe članarini, izračunati osnovicu prema ukupnom primitku i zatim popuniti TZ1 s točnim podacima obrta. Ako imaš više djelatnosti, prvo provjeri klasifikaciju svake NKD šifre.',
  },
  {
    question: 'Do kada se plaća turistička članarina?',
    answer:
      'U ovom vodiču koristi se pravilo da se članarina prijavljuje i podmiruje kroz godišnji ciklus uz TZ1. Točan rok za tvoju situaciju uvijek provjeri u aktualnim uputama turističke zajednice i Porezne.',
  },
  {
    question: 'Koliko iznosi turistička članarina?',
    answer:
      'U izvoru su eksplicitno navedene stope po skupinama djelatnosti: za prvu skupinu 0,14212%, a za drugu 0,11367% na ukupne godišnje prihode. Konačan iznos ovisi o tvojoj djelatnosti i ostvarenom primitku.',
  },
];

export default function TuristickaClanarinaPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Turistička članarina – tko plaća i koliko 2026.'
      subtitle='Tko je obveznik, kako se računa osnovica i što stvarno upisuješ u TZ1 obrascu.'
      readingMinutes={11}
      metaDescription={META_DESC}
      toc={[
        { id: 'sto-je', label: 'Što je turistička članarina' },
        { id: 'tko-placa', label: 'Tko je obvezan plaćati' },
        { id: 'iznosi', label: 'Iznosi po skupinama i zonama' },
        { id: 'tz1', label: 'TZ1 obrazac – kako ispuniti' },
        { id: 'rok', label: 'Rok plaćanja' },
        { id: 'neplacanje', label: 'Što ako ne platiš' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('doprinosi'), title: 'Doprinosi za paušalni obrt' },
        { href: vodiciHref('rokovi-placanja'), title: 'Rokovi plaćanja' },
        {
          href: vodiciHref('pausalni-obrt-za-ugostitelje'),
          title: 'Paušalni obrt za ugostitelje',
        },
      ]}
      howTo={{
        name: 'Kako riješiti turističku članarinu kroz TZ1',
        description:
          'Kratki redoslijed koraka za paušalni obrt koji treba prijaviti i platiti članarinu.',
        steps: [
          {
            name: 'Provjeri jesi li obveznik',
            text: 'Usporedi registrirane NKD djelatnosti s popisom djelatnosti koje podliježu članarini.',
          },
          {
            name: 'Utvrdi osnovicu',
            text: 'U paušalnom obrtu osnovica je ukupan primitak ako postoji barem jedan primitak koji podliježe članarini.',
          },
          {
            name: 'Primijeni stopu skupine',
            text: 'Za skupinu kojoj pripadaš primijeni propisanu postotnu stopu na godišnji primitak.',
          },
          {
            name: 'Popuni i predaj TZ1',
            text: 'Unesi podatke obrta, djelatnosti i izračuna te arhiviraj potvrdu predaje i uplate.',
          },
        ],
      }}
    >
      <p>
        Fraza <strong>turistička članarina paušalni obrt</strong> često zvuči kao nešto što
        se tiče isključivo apartmana i restorana. U praksi je slika šira. U dostupnim
        podacima iz baze znanja jasno piše da obveza postoji za djelatnosti u turizmu i
        ugostiteljstvu, ali i za djelatnosti koje od turizma imaju posrednu korist. Zato
        dio obrtnika tek nakon prvih mjeseci poslovanja shvati da uz{' '}
        <Link href={vodiciHref('doprinosi')}>doprinose</Link>, kvartalni porez i godišnji{' '}
        <Link href={vodiciHref('po-sd-obrazac')}>PO-SD</Link> mora rješavati i turističku
        članarinu.
      </p>

      <h2 id='sto-je'>Što je turistička članarina</h2>
      <p>
        Turistička članarina je obveza određenih poslovnih subjekata prema sustavu
        turističkih zajednica. Nije zamišljena kao univerzalni namet za sve obrte, nego
        kao doprinos djelatnosti koje izravno ili neizravno ostvaruju koristi od turizma.
        Kod paušalnog obrta je važno razumjeti jednu specifičnost koju izvor posebno
        naglašava: ako imaš barem jedan račun odnosno primitak koji podliježe članarini,
        osnovica se računa na ukupan primitak.
      </p>
      <p>
        To pravilo je ključno jer obrtnici često očekuju da će članarinu plaćati samo na
        dio prihoda vezan uz „turističke” klijente. Ako je djelatnost u obvezničkoj
        skupini, logika je šira i zahvaća cjelinu primitka. U praksi to utječe na plan
        likvidnosti jednako kao i tromjesečni{' '}
        <Link href={vodiciHref('porez-na-dohodak')}>porez na dohodak</Link>.
      </p>

      <h2 id='tko-placa'>Tko je obvezan plaćati</h2>
      <p>
        U izvoru je navedeno da su obvezne djelatnosti podijeljene u pet skupina. Za prvu
        skupinu naveden je dugačak popis, uključujući taksi prijevoz, smještaj, djelatnosti
        pripreme i usluživanja hrane i pića, poslovanje nekretninama, agencije za promidžbu,
        putničke agencije i druge povezane djelatnosti. Za drugu skupinu također postoji
        popis djelatnosti uz drugačiju stopu.
      </p>
      <p>
        Važno je da obveznik može biti i obrt koji se ne doživljava tipično turističkim.
        U bazi se kao primjer izričito navode djelatnosti poput izdavaštva ili izrade
        filmova. Zato je najčešća greška osloniti se na „zdravu logiku” umjesto provjere
        službene klasifikacije djelatnosti. Praktičan pristup je da prije popunjavanja TZ1
        popišeš sve glavne i sporedne NKD šifre koje koristiš u poslovanju.
      </p>

      <h2 id='iznosi'>Iznosi po skupinama i zonama</h2>
      <p>
        Za 2026. u dostupnom izvoru su eksplicitno navedene najmanje dvije stope:
        <strong> 0,14212%</strong> za prvu skupinu i <strong>0,11367%</strong> za drugu
        skupinu, obje na ukupne godišnje prihode. To znači da ne računaš proizvoljan fiksni
        iznos, nego postotak na osnovicu. Ako je godišnji primitak veći, raste i članarina.
      </p>
      <p>
        U praksi ćeš se susresti i s razredima/zonskim podjelama u službenim materijalima
        turističke zajednice. Ovaj vodič zato koristi konzervativni pristup: računaj po
        stopi skupine iz provjerenog izvora, a eventualnu dodatnu razrednu ili zonalnu
        razradu potvrdi na aktualnoj tablici nadležne turističke zajednice za tvoje sjedište.
        Time izbjegavaš poduplatu ili preplatu. Ako vodiš više djelatnosti, prvo utvrdi
        koja djelatnost stvara obvezu i kako se primjenjuje na tvoj ukupni primitak.
      </p>

      <h2 id='tz1'>TZ1 obrazac – kako ispuniti</h2>
      <p>
        TZ1 je operativni korak u kojem formalno prijavljuješ podatke relevantne za
        članarinu. Najjednostavniji redoslijed je: potvrda obvezništva, određivanje
        skupine djelatnosti, izračun osnovice i tek onda unos u obrazac. U praksi
        pomaže da uz sebe imaš KPR ili godišnji pregled primitaka kako bi brojke bile
        konzistentne s ostatkom porezne evidencije.
      </p>
      <p>
        Kod ispunjavanja pripazi na točan naziv obrta, OIB, šifre djelatnosti i razdoblje
        na koje se prijava odnosi. Ako vodiš obrt uz zaposlenje ili imaš kombinaciju više
        izvora naplate, nemoj improvizirati s „procjenom” osnovice. Bolje je uskladiti
        iznos s evidencijom koju ćeš ionako koristiti za{' '}
        <Link href={vodiciHref('rokovi-placanja')}>rokove plaćanja</Link> i završne
        godišnje obveze.
      </p>

      <h2 id='rok'>Rok plaćanja</h2>
      <p>
        Turistička članarina je obveza koju treba planirati unaprijed, a ne rješavati
        zadnji dan. U operativnom smislu postavi si godišnji podsjetnik dovoljno rano da
        stigneš provjeriti razrede i stope koje se primjenjuju na tvoju djelatnost. Time
        izbjegavaš situaciju u kojoj imaš točan izračun, ali kasniš zbog tehničkog dijela
        predaje ili uplate.
      </p>
      <p>
        Ako već koristiš kalendar obveza za doprinose i kvartalni porez, dodaj i ovu stavku
        na isti popis. Većina problema nastaje jer se članarina promatra odvojeno od ostatka
        sustava, iako je za paušalista to samo još jedan financijski tok koji mora biti
        uredno dokumentiran.
      </p>

      <h2 id='neplacanje'>Što ako ne platiš</h2>
      <p>
        Neplaćanje ili kašnjenje može otvoriti isti tip problema kao i kod drugih javnih
        davanja: kamate, opomene i dodatnu administraciju. Osim financijskog efekta, problem
        je i gubitak vremena jer naknadno usklađivanje dokumenata traži više truda nego
        pravovremena uplata. Zato je racionalnije tretirati članarinu kao redoviti trošak
        poslovanja, ne kao iznimku.
      </p>
      <p>
        Ako primijetiš da je obveza propuštena, napravi korekciju odmah: izračunaj stvarnu
        obvezu, podmiri dug i dokumentiraj sve korake. Usporedno provjeri i povezane vodiče,
        posebno <Link href={vodiciHref('doprinosi')}>doprinose</Link> i{' '}
        <Link href={vodiciHref('rokovi-placanja')}>rokove plaćanja</Link>, kako bi idući
        ciklus bio uredan od početka.
      </p>
    </GuideShell>
  );
}

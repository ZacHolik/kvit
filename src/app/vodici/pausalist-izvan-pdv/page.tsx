import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'pausalist-izvan-pdv';

const META_DESC =
  'Što znači biti paušalist izvan PDV-a: obveze zaprimanja eRačuna od 1.1.2026., obveze izdavanja od 1.1.2027., napomena na računima i prag 60.000 €.';

export const metadata: Metadata = {
  title: 'Paušalist izvan PDV sustava',
  description: META_DESC,
  openGraph: {
    title: 'Paušalist izvan PDV sustava | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Što znači biti paušalist izvan PDV-a?',
    answer:
      'Paušalist ispod praga od 60.000 € godišnjih primitaka ne obračunava PDV na računima. Na računu stoji napomena da nisi u sustavu PDV-a. To ne znači da nemaš drugih obveza — eRačuni, KPR i paušalni porez i dalje vrijede.',
  },
  {
    question: 'Moram li zaprimati eRačune ako nisam u PDV-u?',
    answer:
      'Da — od 1.1.2026. paušalisti izvan PDV-a moraju zaprimati eRačune od dobavljača. Izdavanje eRačuna prema firmama (B2B) dolazi od 1.1.2027.',
  },
  {
    question: 'Imam li PDV ID broj ako nisam u PDV sustavu?',
    answer:
      'Da. PDV ID broj (HR + 11 znamenki) imaš neovisno o tome jesi li u PDV sustavu. Potreban je za EU transakcije, ali ne znači da obračunavaš PDV na vlastite račune.',
  },
  {
    question: 'Što se dogodi ako prijeđem prag od 60.000 €?',
    answer:
      'Automatski ulaziš u PDV sustav sljedeći dan nakon prelaska praga. Moraš se prijaviti u roku od 8 dana i od tog dana obračunavati PDV (25%) na svim računima.',
  },
  {
    question: 'Koja napomena mora stajati na računu?',
    answer:
      'Obvezna je napomena: "Obveznik nije u sustavu PDV-a, PDV nije obračunat temeljem čl. 90. Zakona o PDV-u." Kvik je automatski dodaje na sve račune.',
  },
];

const invoiceExample =
  'Paušalni obrt "Marko Horvat"\nOIB: 12345678901\nRačun br. 1/PP1/2026\nDatum: 15.05.2026.\nKUPAC: Firma d.o.o., OIB: 98765432109\nUsluga: Izrada web stranice\nCijena: 2.000,00 EUR\nUkupno: 2.000,00 EUR\nNapomena: Obveznik nije u sustavu PDV-a, PDV nije obračunat temeljem čl. 90. Zakona o PDV-u.';

export default function PausalistIzvanPdvPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Paušalist izvan PDV sustava'
      subtitle='Što znači biti paušalist izvan PDV-a: obveze zaprimanja eRačuna od 1.1.2026., obveze izdavanja od 1.1.2027., napomena na računima i prag 60.000 €.'
      readingMinutes={12}
      metaDescription={META_DESC}
      toc={[
        { id: 'sto-znaci', label: 'Što znači izvan PDV sustava?' },
        { id: 'pdv-id', label: 'PDV ID broj vs PDV sustav' },
        { id: 'obveze', label: 'Obveze od 1.1.2026.' },
        { id: 'oznacavanje', label: 'Kako označavati račune' },
        { id: 'prag', label: 'Prag 60.000 €' },
        { id: 'prednosti', label: 'Prednosti i nedostaci' },
        { id: 'greske', label: 'Česte greške' },
        { id: 'cta', label: 'Korisni alati' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('pdv-id'), title: 'PDV ID broj' },
        { href: vodiciHref('fiskalizacija-20'), title: 'Fiskalizacija 2.0' },
        { href: vodiciHref('pausalni-obrt-vodic'), title: 'Paušalni obrt vodič' },
        { href: vodiciHref('izdavanje-racuna'), title: 'Izdavanje računa' },
        { href: vodiciHref('usporedba-fiskalizacija-1-2'), title: 'Fiskalizacija 1.0 vs 2.0' },
      ]}
    >
      <p>
        Većina paušalista <strong>NIJE u PDV sustavu</strong>. To znači da ne obračunavaš
        PDV na računima, ne vraćaš PDV iz ulaznih računa i ne predaješ PDV prijave.
      </p>
      <p>
        Ali &quot;izvan PDV-a&quot; <strong>NE znači &quot;nema obveza&quot;</strong>. Od
        1.1.2026. i 1.1.2027. dolaze nove obveze vezane uz eRačune — čak i za paušaliste
        izvan PDV-a.
      </p>
      <p>
        Ovaj vodič pokriva što znači biti paušalist izvan PDV-a, koje obveze imaš, kako
        označavaš račune i što se događa kad prijeđeš prag 60.000 €.
      </p>

      <h2 id='sto-znaci'>Što znači &quot;izvan PDV sustava&quot;?</h2>
      <p>
        <strong>Paušalist izvan PDV-a</strong> = ne obračunavaš PDV (porez na dodanu
        vrijednost) na svojim računima.
      </p>
      <p>
        <strong>Što to znači konkretno:</strong>
      </p>
      <ul>
        <li>
          Račun od 1.000 € = kupac plaća 1.000 € (ne 1.000 € + 25% PDV = 1.250 €)
        </li>
        <li>
          Ne vraćaš PDV iz ulaznih računa (ako platiš 1.000 € dobavljaču s PDV-om, ne
          dobiješ povrat)
        </li>
        <li>Ne predaješ PDV prijave (PDV-P obrazac)</li>
      </ul>
      <p>
        <strong>Zašto si izvan PDV-a:</strong>
      </p>
      <ul>
        <li>
          Prag za ulazak u PDV je <strong>60.000 € godišnjih primitaka</strong>
        </li>
        <li>Dok si ispod 60.000 €, možeš biti izvan PDV-a</li>
        <li>Kad prijeđeš 60.000 €, automatski ulaziš u PDV sustav</li>
      </ul>

      <h2 id='pdv-id'>PDV ID broj vs PDV sustav</h2>
      <p>
        <strong>VAŽNO:</strong> PDV ID broj <strong>≠</strong> biti u PDV sustavu.
      </p>
      <p>
        <strong>PDV ID broj:</strong>
      </p>
      <ul>
        <li>Svi paušalisti imaju PDV ID broj (HR + 11 znamenki)</li>
        <li>To je samo identifikacijski broj za transakcije unutar EU</li>
        <li>Imaš ga čak i ako NISI u PDV sustavu</li>
      </ul>
      <p>
        <strong>Biti u PDV sustavu:</strong>
      </p>
      <ul>
        <li>Znači da obračunavaš PDV na računima</li>
        <li>Znači da predaješ PDV prijave</li>
        <li>Znači da vraćaš PDV iz ulaznih računa</li>
      </ul>
      <p>
        <strong>Primjer:</strong>
      </p>
      <ul>
        <li>Marko ima PDV ID: HR12345678901</li>
        <li>Marko je paušalist s primitcima 30.000 €/god</li>
        <li>
          Marko <strong>NIJE u PDV sustavu</strong> (jer je ispod 60.000 €)
        </li>
        <li>
          Ali Marko <strong>IMA PDV ID broj</strong> (jer je potreban za EU transakcije)
        </li>
      </ul>
      <p>
        Više o PDV ID broju →{' '}
        <Link href={vodiciHref('pdv-id')} className='text-[#0d9488] hover:underline'>
          PDV ID broj
        </Link>
      </p>

      <h2 id='obveze'>Obveze paušalista izvan PDV-a (od 1.1.2026.)</h2>

      <h3>Obveza #1: Zaprimanje eRačuna od dobavljača</h3>
      <p>
        <strong>Od 1.1.2026.:</strong>
      </p>
      <ul>
        <li>
          Moraš biti u mogućnosti <strong>zaprimati eRačune</strong> od dobavljača (firme
          koje ti šalju račune)
        </li>
        <li>eRačun = elektronički račun u XML formatu</li>
      </ul>
      <p>
        <strong>Što to znači:</strong>
      </p>
      <ul>
        <li>
          Dobavljač ti šalje eRačun preko sustava MIKROeRACUN (mikroeracun.gov.hr)
        </li>
        <li>Ti ga primaš preko istog sustava</li>
        <li>
          U paušalnom obrtu eRačuni <strong>NE priznaju se kao trošak</strong> (jer
          paušalisti nemaju troškove), ali ih moraš zaprimiti radi dobavljača
        </li>
      </ul>
      <p>
        <strong>Kako se pripremiti:</strong>
      </p>
      <ul>
        <li>Registriraj se na MIKROeRACUN sustav (besplatno do 1.1.2027.)</li>
        <li>Ili koristi Kvik koji automatski zaprimljuje eRačune</li>
      </ul>

      <h3>Obveza #2: Izdavanje eRačuna prema firmama (B2B) — od 1.1.2027.</h3>
      <p>
        <strong>Od 1.1.2027.:</strong>
      </p>
      <ul>
        <li>
          Moraš izdavati <strong>eRačune</strong> prema firmama (B2B transakcije)
        </li>
        <li>&quot;Obični&quot; PDF računi više nisu dovoljni</li>
      </ul>
      <p>
        <strong>Iznimka:</strong> Računi prema <strong>tvrtkama u inozemstvu</strong> mogu
        biti i dalje obični PDF računi.
      </p>
      <p>
        <strong>Primjer:</strong>
      </p>
      <ul>
        <li>
          IT freelancer naplaćuje usluge hrvatskoj firmi → mora biti eRačun (od 1.1.2027.)
        </li>
        <li>
          IT freelancer naplaćuje usluge njemačkoj firmi → može biti obični PDF račun
        </li>
      </ul>

      <h2 id='oznacavanje'>Kako označavati račune kad si izvan PDV-a?</h2>
      <p>
        Svaki račun mora imati <strong>napomenu</strong> koja jasno kaže da nisi u PDV
        sustavu:
      </p>
      <p>
        <strong>Napomena (obvezna):</strong>
        <br />
        &quot;Obveznik nije u sustavu PDV-a, PDV nije obračunat temeljem čl. 90. Zakona o
        PDV-u.&quot;
      </p>
      <p>
        <strong>Gdje staviti:</strong>
      </p>
      <ul>
        <li>Na kraju računa, prije potpisa</li>
        <li>Jasno vidljivo (ne sitnim slovima)</li>
      </ul>
      <p>
        <strong>Primjer računa:</strong>
      </p>
      <pre className='my-4 overflow-x-auto rounded-xl border border-[#1f2a28] bg-[#111716] p-4 text-sm text-[#d5dfdd]'>
        {invoiceExample}
      </pre>
      <p>
        Kvik automatski dodaje ovu napomenu na sve račune — više o tome →{' '}
        <Link href={vodiciHref('izdavanje-racuna')} className='text-[#0d9488] hover:underline'>
          Izdavanje računa
        </Link>
      </p>

      <h2 id='prag'>Prag 60.000 € — što se događa kad ga prijeđeš?</h2>
      <p>
        <strong>Prag za ulazak u PDV:</strong> 60.000 € godišnjih primitaka
      </p>
      <p>
        <strong>Što se događa kad prijeđeš:</strong>
      </p>
      <ul>
        <li>
          Automatski ulaziš u PDV sustav <strong>sljedeći dan</strong> nakon prelaska praga
        </li>
        <li>
          Moraš se prijaviti u sustav PDV-a u roku od <strong>8 dana</strong>
        </li>
        <li>Od tog dana obračunavaš PDV na svim računima (25%)</li>
      </ul>
      <p>
        <strong>Primjer:</strong>
      </p>
      <ul>
        <li>Marko ima primitke 55.000 € do 30. studenog</li>
        <li>1. prosinca prima račun 10.000 € → ukupno 65.000 €</li>
        <li>
          <strong>2. prosinca</strong> Marko ulazi u PDV sustav
        </li>
        <li>Marko mora prijaviti ulazak u PDV u roku 8 dana (do 10. prosinca)</li>
        <li>Svi računi od 2. prosinca moraju imati PDV (25%)</li>
      </ul>
      <p>
        <strong>Kako se prijaviti:</strong>
      </p>
      <ul>
        <li>ePorezna (eporezna.gov.hr) → Obrazac za prijavu u PDV sustav</li>
        <li>Ili kod računovođe</li>
      </ul>

      <h2 id='prednosti'>Prednosti i nedostaci izvan PDV-a</h2>

      <h3>Prednosti ✅</h3>
      <ol>
        <li>
          <strong>Niže cijene za klijente:</strong>
          <ul>
            <li>Račun 1.000 € = kupac plaća 1.000 €</li>
            <li>
              U PDV sustavu: račun 1.000 € + 25% PDV = kupac plaća 1.250 €
            </li>
          </ul>
        </li>
        <li>
          <strong>Manje administracije:</strong>
          <ul>
            <li>Nema PDV prijava (PDV-P obrazac)</li>
            <li>Nema vođenja PDV knjiga</li>
          </ul>
        </li>
        <li>
          <strong>Jednostavnije poslovanje:</strong>
          <ul>
            <li>Fokus na primitke, ne na PDV obračun</li>
          </ul>
        </li>
      </ol>

      <h3>Nedostaci ❌</h3>
      <ol>
        <li>
          <strong>Ne možeš vratiti PDV iz ulaznih računa:</strong>
          <ul>
            <li>Kupiš laptop za 1.000 € + PDV 250 € = platiti 1.250 €</li>
            <li>U PDV sustavu bi vratio 250 € PDV-a nazad</li>
            <li>Izvan PDV-a nemaš povrat</li>
          </ul>
        </li>
        <li>
          <strong>Manje konkurentan prema firmama u PDV-u:</strong>
          <ul>
            <li>Firma u PDV sustavu može vratiti PDV iz tvog računa</li>
            <li>Ali ako nisi u PDV-u, tvoj račun nema PDV za vratiti</li>
            <li>Firme ponekad preferiraju dobavljače u PDV sustavu</li>
          </ul>
        </li>
        <li>
          <strong>Limit 60.000 €:</strong>
          <ul>
            <li>Ne možeš zaraditi više od 60.000 € godišnje bez ulaska u PDV</li>
          </ul>
        </li>
      </ol>

      <h2 id='greske'>Česte greške</h2>

      <h3>❌ &quot;Nemam PDV ID broj jer nisam u PDV sustavu&quot;</h3>
      <p>
        <strong>Posljedica:</strong> PDV ID broj imaš UVIJEK, čak i ako nisi u PDV sustavu.
        Potreban je za EU transakcije.
      </p>
      <p>
        <strong>Rješenje:</strong> PDV ID broj = HR + tvoj OIB. Provjeri na Poreznoj ili
        pitaj računovođu.
      </p>

      <h3>❌ &quot;Zaboravio sam staviti napomenu &apos;nije u PDV sustavu&apos; na račun&quot;</h3>
      <p>
        <strong>Posljedica:</strong> Kupac može pomisliti da si u PDV sustavu i da račun
        uključuje PDV. Komplikacije pri kontroli.
      </p>
      <p>
        <strong>Rješenje:</strong> Ispravi račun (storniraj stari, izdaj novi s napomenom).
        Uvijek koristi template s napomenom.
      </p>

      <h3>❌ &quot;Prešao sam 60.000 € ali nisam se prijavio u PDV sustav&quot;</h3>
      <p>
        <strong>Posljedica:</strong> Kazna za neprijavu + retroaktivno plaćanje PDV-a.
      </p>
      <p>
        <strong>Rješenje:</strong> Prijavi se odmah čim primijetiš da si prešao prag. Rok je
        8 dana od prelaska.
      </p>

      <h3>❌ &quot;Mislio sam da eRačuni dolaze tek 2027.&quot;</h3>
      <p>
        <strong>Posljedica:</strong> <strong>Zaprimanje</strong> eRačuna dolazi 1.1.2026.
        (moraš biti spreman primati). <strong>Izdavanje</strong> eRačuna dolazi 1.1.2027.
      </p>
      <p>
        <strong>Rješenje:</strong> Registriraj se na MIKROeRACUN (mikroeracun.gov.hr) do
        kraja 2025.
      </p>

      <h2 id='cta'>Korisni alati</h2>
      <p>
        Kvik automatski dodaje napomenu &quot;nije u PDV sustavu&quot; na sve račune:
      </p>
      <p>
        <Link href='/register' className='text-[#0d9488] hover:underline'>
          Isprobaj Kvik besplatno
        </Link>
      </p>
      <p>Izračunaj do koliko možeš zaraditi bez ulaska u PDV:</p>
      <p>
        <Link href='/alati/kalkulator' className='text-[#0d9488] hover:underline'>
          Kalkulator primitaka
        </Link>
      </p>
      <div className='my-6 flex flex-col gap-3 sm:flex-row sm:items-center'>
        <Link href='/register' className='btn-cta-primary px-5 py-3 text-base'>
          Isprobaj Kvik besplatno →
        </Link>
        <Link
          href='/alati/kalkulator'
          className='inline-flex items-center justify-center rounded-lg border border-[#0d9488] px-5 py-3 font-semibold text-[#0d9488] transition hover:bg-[#0d9488]/10'
        >
          Kalkulator primitaka
        </Link>
      </div>
    </GuideShell>
  );
}

import type { Metadata } from 'next';

import { buildVodicMetadata } from '@/lib/og-metadata';
import Link from 'next/link';

import InlineCTA from '@/components/cta/InlineCTA';
import { vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'fina-certifikat-fiskalizacija';

const META_DESC =
  'Kako nabaviti FINA certifikat za fiskalizaciju, koliko košta i kako ga uploadati u Kvik.';

export const metadata: Metadata = buildVodicMetadata(
  SLUG,
  'FINA certifikat za fiskalizaciju — korak po korak',
  META_DESC,
  'FINA certifikat za fiskalizaciju | Kvik',
);

const faq = [
  {
    question: 'Koliko košta FINA certifikat?',
    answer:
      'Tipično se za aplikativni certifikat za fiskalizaciju plaća oko 39,82 € + PDV na pet godina (s PDV-om reda veličine 49,78 €). Prva registracija poslovnog subjekta kod FINA-e za PKI često se pojavljuje kao dodatna stavka oko 6,64 € + PDV. Demo certifikat za testiranje je besplatna opcija. Točne tarife provjeri na fina.hr prije plaćanja.',
  },
  {
    question: 'Mogu li dobiti certifikat online?',
    answer:
      'Da — zahtjev ide kroz digitalne kanale FINA-e (npr. OSPD portal kada je dostupan za tvoj slučaj), a preuzimanje gotovog certifikata obavljaš na portalu mojcert.fina.hr uz referentni broj i autorizacijski kod koji dobiješ u postupku.',
  },
  {
    question: 'Što ako zaboravim lozinku?',
    answer:
      'Oporavak lozinke certifikata moguć je samo u prvoj godini od izdavanja. Nakon toga nema “zaboravili ste lozinku” — treba zatražiti novi certifikat. Zato lozinku drži u menadžeru lozinki, ne na Post-it listiću.',
  },
  {
    question: 'Trebam li certifikat kao paušalist?',
    answer:
      'Ako koristiš elektronički sustav za fiskalizaciju gotovinskih računa (npr. Kvik), da — treba ti FINA (ili kompatibilan) aplikativni certifikat u .p12 obliku. Ako isključivo koristiš uvezanu knjigu računa ovjerenu u Poreznoj i nemaš elektronički sustav za fiskalizaciju, taj put je drugačiji — certifikat u tom modelu nije isto što i “PDF račun”.',
  },
  {
    question: 'Mogu li koristiti isti certifikat za F1.0 i F2.0?',
    answer:
      'Da. Certifikat je vezan uz identitet obveznika (OIB poslovnog subjekta) i služi elektroničkom potpisu — nije “certifikat za verziju 1.0”. Što se mijenja su aplikacije, posrednici i poslovni procesi oko eRačuna, ne sam certifikat zbog oznake F2.0.',
  },
];

const tableWrap =
  'my-6 overflow-x-auto rounded-xl border border-[#1f2a28] bg-[#111716] text-sm';

export default function FinaCertifikatFiskalizacijaPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='FINA certifikat za fiskalizaciju — korak po korak'
      subtitle='Od prve registracije do .p12 datoteke u Kviku — bez zbunjujućeg žargona.'
      readingMinutes={10}
      metaDescription={META_DESC}
      articleDateModified='2026-05-09'
      toc={[
        { id: 'sto-je', label: 'Što je FINA certifikat?' },
        { id: 'cijena', label: 'Koliko košta?' },
        { id: 'tko', label: 'Tko ga može zatražiti?' },
        { id: 'koraci', label: 'Kako zatražiti' },
        { id: 'lozinka', label: 'Lozinka — kritično upozorenje' },
        { id: 'valjanost', label: 'Valjanost i obnova' },
        { id: 'demo', label: 'Demo vs produkcija' },
        { id: 'kvik-upload', label: 'Upload u Kvik' },
        { id: 'xmlsigner', label: 'XmlSigner (testiranje)' },
        { id: 'izvori', label: 'Izvori' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('fiskalizacija-20'), title: 'Fiskalizacija 2.0 za paušaliste' },
        { href: vodiciHref('izdavanje-racuna'), title: 'Izdavanje računa u paušalu' },
        { href: vodiciHref('pausalni-obrt-vodic'), title: 'Paušalni obrt 2026.' },
        { href: '/alati/interni-akt', title: 'Generator internog akta' },
      ]}
      howTo={{
        name: 'Nabava FINA certifikata za fiskalizaciju',
        description:
          'Sažetak koraka od registracije subjekta do preuzimanja .p12 datoteke na mojcert.fina.hr.',
        steps: [
          {
            name: 'Registracija poslovnog subjekta kod FINA',
            text: 'Ako prvi put ulaziš u FINA PKI sustav, završi registraciju poslovnog subjekta prema uputama na fina.hr.',
          },
          {
            name: 'Podnesi zahtjev za certifikat',
            text: 'Online kroz OSPD portal ili u poslovnici FINA-e — ovisno što je za tvoj slučaj jednostavnije.',
          },
          {
            name: 'Pripremi dokumentaciju',
            text: 'OIB, osobna iskaznica, izvod iz obrtnog registra i ostalo što traži obrazac.',
          },
          {
            name: 'Preuzmi .p12 na mojcert.fina.hr',
            text: 'S referentnim brojem i autorizacijskim kodom iz postupka preuzmi datoteku i postavi jaku lozinku.',
          },
          {
            name: 'Upload u Kvik',
            text: 'U Postavke → Fiskalizacija učitaj .p12 i unesi lozinku — aplikacija preuzima potpisivanje.',
          },
        ],
      }}
    >
      <p>
        Ovaj vodič je za obrtnika koji želi mir u glavi: što je datoteka na koju FINA misli kad
        kaže “certifikat za fiskalizaciju”, koliko to košta i gdje točno kliknuti. Nakon čitanja
        znat ćeš i kako ga staviti u{' '}
        <Link href='/postavke/fiskalizacija' className='text-[#0d9488] hover:underline'>
          Kvik postavke fiskalizacije
        </Link>
        . Širi kontekst rokova za eRačune imaš u{' '}
        <Link href={vodiciHref('fiskalizacija-20')} className='text-[#0d9488] hover:underline'>
          Fiskalizacija 2.0 za paušaliste
        </Link>
        , a operativu brojeva računa u{' '}
        <Link href={vodiciHref('izdavanje-racuna')} className='text-[#0d9488] hover:underline'>
          izdavanju računa
        </Link>
        . Interni akt (oznake prostora i uređaja) složiš besplatno u{' '}
        <Link href='/alati/interni-akt' className='text-[#0d9488] hover:underline'>
          Kvik generatoru
        </Link>
        .
      </p>

      <InlineCTA tema="interni-akt" pageSlug="fina-certifikat-fiskalizacija" />

      <h2 id='sto-je'>Što je FINA certifikat za fiskalizaciju?</h2>
      <p>
        Radi se o <strong>aplikativnom certifikatu</strong> u obliku <strong>.p12</strong>{' '}
        datoteke: digitalna “iskaznica” tvog obrta koja omogućuje programu (npr. Kviku) da
        kriptografski potpiše podatke koje šalješ Poreznoj pri fiskalizaciji gotovinskih računa.
        Bez tog potpisa moderni elektronički sustav jednostavno ne smije raditi — nije capris
        nego tehnički zid.
      </p>
      <p>
        Certifikat nije ista stvar kao lozinka za ePoreznu niti kao IBAN: to je datoteka koja
        stoji na računalu ili u sigurnom spremniku i koju aplikacija učita kad izdaješ račun.
      </p>

      <h2 id='cijena'>Koliko košta?</h2>
      <div className={tableWrap}>
        <table className='min-w-full border-collapse text-left'>
          <thead>
            <tr className='border-b border-[#1f2a28] text-[#94a3a0]'>
              <th className='px-3 py-2 font-medium'>Stavka</th>
              <th className='px-3 py-2 font-medium'>Okvirno</th>
              <th className='px-3 py-2 font-medium'>Napomena</th>
            </tr>
          </thead>
          <tbody className='text-[#d5dfdd]'>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>Aplikativni certifikat (5 god.)</td>
              <td className='px-3 py-2'>39,82 € + PDV ≈ 49,78 €</td>
              <td className='px-3 py-2'>Provjeri tarifu na fina.hr prije uplate</td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2'>Registracija subjekta (prvi put)</td>
              <td className='px-3 py-2'>oko 6,64 € + PDV</td>
              <td className='px-3 py-2'>Jednokratno kad ulaziš u PKI sustav</td>
            </tr>
            <tr>
              <td className='px-3 py-2'>Demo certifikat</td>
              <td className='px-3 py-2'>0 €</td>
              <td className='px-3 py-2'>Za testiranje, ne za pravi promet</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Ako si tip koji voli pisati mail umjesto čekanja u redu, službeni kanal za upite oko
        certifikata za fiskalizaciju često je{' '}
        <strong>certifikati-fiskalizacija@fina.hr</strong> — u mailu uvijek navedi OIB obrta i
        jasno pitanje da dobiješ konkretan odgovor.
      </p>

      <h2 id='tko'>Tko ga može zatražiti?</h2>
      <p>
        Certifikat za fiskalizaciju zakon vizualno veže uz <strong>obveznika fiskalizacije</strong>
        — dakle tvoj obrt, ne random IT tvrtku “umjesto tebe”. U praksi to znači da ti kao
        obrtnik podnosiš zahtjev za vlastiti OIB. Iznimke gdje druga osoba može postupati u tvoje
        ime (npr. ovlašteni skrbnik ili procesi punomoći) postoje, ali to nije “netko mi samo
        napravi certifikat bez mog sudjelovanja” kao default.
      </p>

      <h2 id='koraci'>Kako zatražiti — korak po korak</h2>
      <ol className='list-decimal space-y-3 pl-5 text-[#d5dfdd]'>
        <li>
          <strong>Registracija poslovnog subjekta kod FINA</strong> ako prvi put ulaziš u njihov
          PKI sustav — bez toga nemaš podlogu za izdavanje certifikata.
        </li>
        <li>
          <strong>Zahtjev za certifikat</strong>: online putem OSPD portala kada je dostupan za
          tvoj tip subjekta, ili osobno / prema uputama u poslovnici FINA-e ako ti je tako lakše.
        </li>
        <li>
          <strong>Dokumentacija</strong>: tipično OIB, osobna iskaznica i izvod iz obrtnog registra;
          FINA na obrascu točno navodi što treba za tvoj slučaj.
        </li>
        <li>
          <strong>Čekanje obrade</strong>: digitalni put često traje nekoliko radnih dana, ali ne
          planiraj zadnji dan prije špice — certifikat je kritičan dependency za izdavanje
          računa.
        </li>
        <li>
          <strong>Preuzimanje</strong>: na portalu{' '}
          <a
            href='https://mojcert.fina.hr'
            className='text-[#0d9488] hover:underline'
            rel='noopener noreferrer'
            target='_blank'
          >
            mojcert.fina.hr
          </a>{' '}
          uneseš referentni broj i autorizacijski kod iz upute koju dobiješ e-mailom ili u
          obrascu, pa preuzmeš .p12.
        </li>
      </ol>

      <h2 id='lozinka'>Lozinka za certifikat — kritično upozorenje</h2>
      <p>
        <strong>Oporavak lozinke moguć je samo u prvoj godini od izdavanja certifikata.</strong>{' '}
        Nakon toga FINA ti neće “resetirati” lozinku kao web shop — moraš kupiti novi certifikat.
        Zvuči oštro, ali tako sustav štiti integritet potpisa. Zato:
      </p>
      <ul className='list-disc space-y-2 pl-5 text-[#d5dfdd]'>
        <li>koristi menadžer lozinki, ne “obrt2026” na papiru;</li>
        <li>ne šalji .p12 na WhatsApp sebi “da imaš backup”;</li>
        <li>napravi sigurnosnu kopiju na šifrirani medij kojem vjeruješ.</li>
      </ul>

      <h2 id='valjanost'>Koliko dugo vrijedi?</h2>
      <p>
        Aplikativni certifikat za fiskalizaciju tipično vrijedi <strong>pet godina</strong>. Prije
        isteka pokreni obnovu istim postupkom kao prvi put — ne čekaj zadnji tjedan jer se i FINA
        i ti možete zaglaviti u gužvi obrtnika koji svi odjednom shvate da im ističe certifikat.
      </p>

      <h2 id='demo'>Demo vs produkcijski certifikat</h2>
      <p>
        <strong>Demo certifikat</strong> je besplatan i služi za testiranje u kontroliranom
        okruženju (često se spominje CIS test okolina poput{' '}
        <strong>cistest.apis-it.hr</strong>). Tamo možeš provjeriti potpisivanje bez straha da si
        “pokvario” produkciju. <strong>Produkcijski certifikat</strong> je onaj koji stavljaš u
        Kvik kad stvarno izdaješ račune klijentima.
      </p>

      <h2 id='kvik-upload'>Kako uploadati u Kvik</h2>
      <p>
        U aplikaciji otvori <strong>Postavke → Fiskalizacija</strong>, odaberi upload{' '}
        <strong>.p12</strong> datoteke, upiši <strong>lozinku certifikata</strong> koju si zadao
        pri izvozu/preuzimanju, i potvrdi. Kvik dalje koristi certifikat za potpisivanje zahtjeva
        prema CIS-u — ne moraš ručno pokretati zasebne alate za svaki račun.
      </p>
      <p>
        Duboki link na čarobnjak:{' '}
        <a href='https://kvik.online/postavke/fiskalizacija' className='text-[#0d9488] hover:underline'>
          https://kvik.online/postavke/fiskalizacija
        </a>
        .
      </p>

      <h2 id='xmlsigner'>XmlSigner modul</h2>
      <p>
        FINA nudi besplatni <strong>XmlSigner</strong> alat za testiranje XML potpisa u
        kontroliranom okruženju — koristan je ako želiš ručno vidjeti što se događa “ispod
        haube”. Ako koristiš Kvik, taj modul <strong>nije obavezan</strong> jer aplikacija već
        pokriva potpisivanje u produkcijskom tijeku.
      </p>

      <h2 id='izvori'>Izvori</h2>
      <p className='text-sm text-[#94a3a0]'>
        FINA (fina.hr, mojcert.fina.hr), Zakon o fiskalizaciji (NN 133/12 i novije izmjene),
        Tehnička specifikacija APIS IT-a za CIS/eRačun. Iznosi i tarife provjeri neposredno prije
        kupnje jer se mogu mijenjati.
      </p>

      <div className='mt-10 rounded-2xl border border-[#0d9488]/40 bg-[#111716] p-6'>
        <p className='font-heading text-lg font-semibold text-[#e2e8e7]'>
          Imaš certifikat? Uploadaj ga u Kvik i fiskaliziraj račune automatski
        </p>
        <p className='mt-2 text-sm text-[#b9c7c4]'>
          Otvori{' '}
          <a href='https://kvik.online/postavke/fiskalizacija' className='text-[#0d9488] hover:underline'>
            https://kvik.online/postavke/fiskalizacija
          </a>{' '}
          i prođi kratki tijek — gotovo je brže nego što pročitaš ovaj odlomak naglas.
        </p>
        <Link
          href='/postavke/fiskalizacija'
          className='btn-cta-primary mt-4 inline-flex px-4 py-2.5 text-sm'
        >
          Otvori postavke fiskalizacije →
        </Link>
      </div>
    </GuideShell>
  );
}

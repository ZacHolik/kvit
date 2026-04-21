import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'alati-za-pausalne-obrtnike';

const META_DESC =
  'Alati za paušalne obrtnike: zašto izolirani kalkulatori, generatori uplatnica i checkliste nisu dovoljni. Kako Kvit povezuje KPR, PDV prag, PO-SD i rokove u jedan sustav.';

export const metadata: Metadata = {
  title: 'Alati za paušalne obrtnike 2026 — zašto izolirani alati nisu dovoljni',
  description: META_DESC,
  openGraph: {
    title: 'Alati za paušalne obrtnike 2026 | Kvit',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvit',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Zašto koristiti povezan sustav umjesto besplatnih alata?',
    answer:
      'Izolirani alati (Fiskalopedija, Plavi ured i slični) rade svoj dio, ali ti si most: prepisuješ iznose između kalkulatora, uplatnica i checklista. Kvit to automatizira — kad izdaš račun, KPR, PDV prag kalkulator i razred poreza se ažuriraju istog trena.',
  },
  {
    question: 'Mogu li koristiti Kvit alate bez prijave?',
    answer:
      'Da. Kalkulator paušalnog poreza, PDV prag kalkulator, checklista i PDF predlošci (interni akt, izjave) dostupni su bez registracije. Razlika je u tome što bez prijave svaki put ručno unosiš podatke, a s prijavom sustav čita tvoje stvarne račune i KPR.',
  },
  {
    question: 'Kako Kvit generira PO-SD automatski?',
    answer:
      'PO-SD se računa iz računa koje si izdao tijekom godine — razdvojeno na gotovinu i bezgotovinu, kako propisuje obrazac. Ti ne zbrajaš ručno iz Excela; klikneš „Generiraj PO-SD" i obrazac je popunjen iz KPR-a.',
  },
  {
    question: 'Pomaže li Kvit s PDV pragom od 60.000 €?',
    answer:
      'Da. Dashboard u svakom trenutku pokazuje koliko si iskoristio od limita od 60.000 € primitaka (što Fiskalopedija navodi kao ključnu granicu za paušaliste). Kad dosegneš 80%, dobiješ upozorenje da pravovremeno reagiraš — prelazak praga mijenja tvoj PDV status.',
  },
  {
    question: 'Treba li mi kreditna kartica za registraciju?',
    answer:
      'Ne. Registracija je besplatna i traje oko 2 minute — uneseš naziv obrta, OIB i okvirni godišnji prihod, i sustav odmah zna koji si razred, koliko kvartalno plaćaš i kada su ti rokovi.',
  },
];

export default function AlatiZaPausalneObrtnikePage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Alati za paušalne obrtnike — zašto izolirani alati nisu dovoljni'
      subtitle='Kalkulator ovdje, uplatnica tamo, checklista negdje drugdje — i opet nisi siguran je li sve točno. Kvit povezuje sve u jedan sustav koji zna tko si.'
      readingMinutes={9}
      metaDescription={META_DESC}
      toc={[
        { id: 'drugi-alati', label: 'Što drugi nude — izolirani alati' },
        { id: 'kvit-sustav', label: 'Što Kvit nudi — jedan ekosustav' },
        { id: 'primjeri', label: 'Konkretni primjeri „prije i poslije"' },
        { id: 'pregled', label: 'Pregled Kvit alata' },
        { id: 'kada-prijaviti', label: 'Kada se prijaviti — i što dobiješ' },
        { id: 'cta', label: 'Isprobaj besplatno' },
      ]}
      faq={faq}
      related={[
        { href: '/alati', title: 'Svi Kvit alati' },
        { href: vodiciHref('po-sd-obrazac'), title: 'PO-SD obrazac' },
        { href: vodiciHref('doprinosi'), title: 'Doprinosi za paušalni obrt' },
        { href: vodiciHref('rokovi-placanja'), title: 'Rokovi plaćanja' },
      ]}
    >
      <p>
        Postoje deseci besplatnih alata za paušalne obrtnike. Kalkulator ovdje,
        uplatnica tamo, checklista negdje drugdje. Otvoriš pet tabova, prekopiraš
        broj iz jednog u drugi, i na kraju opet nisi siguran je li sve točno. Kvit
        radi drugačije — umjesto zbirke izoliranih alata, nudi jedan sustav koji
        zna tko si i koliko zarađuješ.
      </p>

      <p>
        Brojke i rokove koje spominjemo (limit od <strong>60.000 €</strong>{' '}
        primitaka za PDV prag, kvartalne iznose poreza, doprinose{' '}
        <strong>290,98 €</strong> mjesečno) preuzimamo iz materijala koje{' '}
        <a
          href='https://fiskalopedija.hr/baza-znanja'
          className='text-[#0d9488] hover:underline'
          rel='noopener noreferrer'
          target='_blank'
        >
          Fiskalopedija drži usklađenima za 2026.
        </a>
      </p>

      <h2 id='drugi-alati'>Što drugi nude — izolirani alati</h2>
      <p>
        Ostali alati (Fiskalopedija, Plavi ured i slični) nude korisne stvari, ali
        svaki za sebe. Ti si veza između njih — ručno, svaki put:
      </p>
      <ul>
        <li>
          <strong>Generator uplatnice</strong> — uneseš OIB, dobiješ barkod. Ne zna
          koliko zarađuješ ni koji je tvoj razred doprinosa.
        </li>
        <li>
          <strong>Kalkulator poreza</strong> — uneseš prihod, dobiješ razred. Ne
          pamti ništa za sljedeći put; sljedeći mjesec krećeš iznova.
        </li>
        <li>
          <strong>Checklista obveza</strong> — statična lista. Ne zna jesi li već
          platio doprinos za ovaj mjesec.
        </li>
        <li>
          <strong>Izrada računa</strong> — generira PDF i tu staje. Ne upisuje
          račun u KPR, ne zbraja promet, ne gleda PDV prag.
        </li>
        <li>
          <strong>PO-SD generator</strong> — uneseš primitke ručno. Ne vuče ih iz
          tvojih stvarnih računa.
        </li>
      </ul>
      <p>
        Svaki alat je otok. Ti si most između njih — i svaka ručna prepiska je
        prilika za grešku.
      </p>

      <h2 id='kvit-sustav'>Što Kvit nudi — jedan ekosustav koji zna tko si</h2>
      <p>
        Kvit ne nudi alate. Nudi <strong>sustav</strong> koji radi umjesto tebe.
        Tok podataka ide ovako:
      </p>
      <ol>
        <li>Izdaš račun u aplikaciji.</li>
        <li>
          KPR (<Link href={vodiciHref('kpr-knjiga-prometa')}>knjiga prometa</Link>)
          se automatski popunjava — razdvojeno gotovina i bezgotovina.
        </li>
        <li>
          PDV prag kalkulator se ažurira u realnom vremenu prema tvom stvarnom
          prometu.
        </li>
        <li>
          Kad dosegneš 80% od <strong>60.000 €</strong>, sustav ti šalje
          upozorenje.
        </li>
        <li>
          Na kraju godine <Link href={vodiciHref('po-sd-obrazac')}>PO-SD</Link> se
          generira iz tvojih stvarnih podataka, ne iz ručnog unosa.
        </li>
      </ol>

      <h2 id='primjeri'>Konkretni primjeri „prije i poslije”</h2>

      <p>
        <strong>Plaćanje doprinosa</strong>
      </p>
      <p>
        <em>Umjesto:</em> „Otvori kalkulator, unesi prihod, pogledaj razred,
        otvori generator uplatnice, ručno upiši iznos i OIB, generiraj barkod.”
      </p>
      <p>
        <em>U Kvitu:</em> Tvoj razred se zna. Uplatnica je uvijek ispravna. Barkod
        generiraš jednim klikom jer su podaci već tamo.
      </p>

      <p>
        <strong>PO-SD na kraju godine</strong>
      </p>
      <p>
        <em>Umjesto:</em> „Prebroji sve račune u Excelu, zbroji primitke, unesi
        u PO-SD obrazac, provjeri jesi li u dobrom razredu, nadaj se da nisi
        pogriješio.”
      </p>
      <p>
        <em>U Kvitu:</em> Klikneš „Generiraj PO-SD” — obrazac je popunjen iz
        tvojih stvarnih računa. Nula ručnog unosa.
      </p>

      <p>
        <strong>Praćenje PDV praga</strong>
      </p>
      <p>
        <em>Umjesto:</em> „Zapisuješ na papiriću koliko ti ostaje do 60.000 € i
        brineš se hoćeš li ući u PDV sustav.”
      </p>
      <p>
        <em>U Kvitu:</em> Dashboard ti u svakom trenutku pokazuje koliko si
        iskoristio od limita, koji razred ti odgovara i koliko kvartalno plaćaš —
        bez da išta računaš.
      </p>

      <h2 id='pregled'>Pregled Kvit alata</h2>
      <p>
        Ispod je pregled što je dostupno bez prijave i što se otključava kad se
        registriraš. Razlika nije u količini alata, nego u tome što <em>znaju</em>{' '}
        o tebi.
      </p>
      <div className='my-6 overflow-x-auto rounded-xl border border-[#1f2a28] bg-[#111716] text-sm'>
        <table className='min-w-full border-collapse text-left'>
          <thead>
            <tr className='border-b border-[#1f2a28] text-[#94a3a0]'>
              <th className='px-3 py-2 font-medium'>Alat</th>
              <th className='px-3 py-2 font-medium'>Bez prijave (free)</th>
              <th className='px-3 py-2 font-medium'>S prijavom</th>
            </tr>
          </thead>
          <tbody className='text-[#d5dfdd]'>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2 align-top'>
                <Link
                  href='/alati/kalkulator-poreza'
                  className='text-[#0d9488] hover:underline'
                >
                  Kalkulator paušalnog poreza 2026
                </Link>
              </td>
              <td className='px-3 py-2 align-top'>
                Unesi prihod, vidi razred
              </td>
              <td className='px-3 py-2 align-top'>
                Tvoji prihodi su već uneseni — razred se ažurira automatski
              </td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2 align-top'>
                <Link
                  href='/alati/pdv-prag'
                  className='text-[#0d9488] hover:underline'
                >
                  PDV prag kalkulator
                </Link>
              </td>
              <td className='px-3 py-2 align-top'>
                Unesi iznos, vidi postotak
              </td>
              <td className='px-3 py-2 align-top'>
                Prati tvoj stvarni promet iz računa u realnom vremenu
              </td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2 align-top'>
                <Link
                  href='/alati/checklista'
                  className='text-[#0d9488] hover:underline'
                >
                  Checklista obveza
                </Link>
              </td>
              <td className='px-3 py-2 align-top'>Statična lista</td>
              <td className='px-3 py-2 align-top'>
                Označava <em>completed</em> kad uplata prođe
              </td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2 align-top'>
                <Link
                  href='/alati/placanje-doprinosa'
                  className='text-[#0d9488] hover:underline'
                >
                  Plaćanje doprinosa
                </Link>
              </td>
              <td className='px-3 py-2 align-top'>
                Generiraj uplatnicu s OIB-om
              </td>
              <td className='px-3 py-2 align-top'>
                Iznos već popunjen prema tvom razredu
              </td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2 align-top'>
                <Link
                  href='/alati/rok-podsjetnici'
                  className='text-[#0d9488] hover:underline'
                >
                  Rok podsjetnici
                </Link>
              </td>
              <td className='px-3 py-2 align-top'>Pregled rokova</td>
              <td className='px-3 py-2 align-top'>
                Push i email obavijesti 14 dana prije
              </td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2 align-top'>
                <Link
                  href='/alati/interni-akt'
                  className='text-[#0d9488] hover:underline'
                >
                  Interni akt
                </Link>
              </td>
              <td className='px-3 py-2 align-top'>PDF predložak</td>
              <td className='px-3 py-2 align-top'>
                Automatski popunjen s podacima tvog obrta
              </td>
            </tr>
            <tr className='border-b border-[#1f2a28]/80'>
              <td className='px-3 py-2 align-top'>
                <Link
                  href='/alati/izjava-poslovni-prostor'
                  className='text-[#0d9488] hover:underline'
                >
                  Izjava — tuđi poslovni prostor
                </Link>
              </td>
              <td className='px-3 py-2 align-top'>PDF generator</td>
              <td className='px-3 py-2 align-top'>Automatski popunjen</td>
            </tr>
            <tr>
              <td className='px-3 py-2 align-top'>
                <Link
                  href='/alati/izjava-pozajmnica'
                  className='text-[#0d9488] hover:underline'
                >
                  Izjava — pozajmnica vlasnika
                </Link>
              </td>
              <td className='px-3 py-2 align-top'>PDF generator</td>
              <td className='px-3 py-2 align-top'>Automatski popunjen</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id='kada-prijaviti'>Kada se prijaviti — i što dobiješ</h2>
      <p>
        Ako samo povremeno trebaš kalkulator ili PDF predložak, besplatna verzija
        je sasvim dovoljna — i dalje ti je to brže nego kopirati brojke iz
        bilježnice. Prijava počinje imati smisla u trenutku kad:
      </p>
      <ul>
        <li>
          redovito izdaješ račune i ne želiš paralelno voditi{' '}
          <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR</Link> u Excelu,
        </li>
        <li>
          bliziš se limitu od 60.000 € i želiš{' '}
          <Link href={vodiciHref('pdv-id')}>PDV ID / PDV status</Link> planirati
          unaprijed umjesto reagirati,
        </li>
        <li>
          ne želiš pamtiti <Link href={vodiciHref('rokovi-placanja')}>rokove</Link>{' '}
          za doprinose, kvartalni porez i PO-SD,
        </li>
        <li>
          kraj godine želiš završiti{' '}
          <em>jednim klikom na „Generiraj PO-SD”</em>, a ne tjednom čišćenja
          papira.
        </li>
      </ul>

      <h2 id='cta'>Isprobaj besplatno — bez kreditne kartice</h2>
      <p>
        Registracija traje 2 minute. Uneseš naziv obrta, OIB i okvirni godišnji
        prihod — i sustav odmah zna koji si razred, koliko plaćaš i kada su ti
        rokovi.
      </p>
      <div className='my-6 flex flex-col gap-3 sm:flex-row sm:items-center'>
        <Link
          href='/register'
          className='inline-flex items-center justify-center rounded-lg bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6]'
        >
          Registriraj se besplatno →
        </Link>
        <Link
          href='/alati'
          className='inline-flex items-center justify-center rounded-lg border border-[#0d9488] px-5 py-3 font-semibold text-[#0d9488] transition hover:bg-[#0d9488]/10'
        >
          Ili pregledaj sve alate
        </Link>
      </div>
    </GuideShell>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'rpo-obrazac';

const META_DESC =
  'Što je RPO obrazac, tko ga mora predati, rokovi i kako ga predati putem ePorezne korak po korak.';

export const metadata: Metadata = {
  title: 'RPO obrazac – kako ispuniti i predati online 2026.',
  description: META_DESC,
  openGraph: {
    title: 'RPO obrazac – kako ispuniti i predati online 2026. | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Što je RPO obrazac?',
    answer:
      'RPO je prijava u Registar poreznih obveznika. Nakon otvaranja obrta služi za upis poreznog statusa i načina oporezivanja, uključujući odabir paušalnog režima.',
  },
  {
    question: 'Kada moram predati RPO?',
    answer:
      'Prema dostupnom izvoru, RPO treba predati u roku od 8 dana od otvaranja obrta, odnosno od dana rješenja.',
  },
  {
    question: 'Kako predati RPO putem ePorezne?',
    answer:
      'Na ePoreznoj odabereš Zahtjevi i zatim Prijava u registar poreznih obveznika (RPO), prođeš korake unosa podataka i potvrdiš zahtjev.',
  },
  {
    question: 'Što upisati pod predviđeni godišnji primitak?',
    answer:
      'Upisuješ realnu procjenu primitaka za godinu poslovanja. Taj podatak je bitan jer se u prvoj godini poslovanja razred paušalnog poreza oslanja upravo na prijavljeni iznos iz RPO-a.',
  },
  {
    question: 'Moram li predati RPO svake godine?',
    answer:
      'Ne, RPO nije godišnja prijava poput PO-SD obrasca. Predaje se pri ulasku u registar i kod promjena podataka koje zahtijevaju ažuriranje.',
  },
];

export default function RpoObrazacPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='RPO obrazac – kako ispuniti i predati online 2026.'
      subtitle='Prijava u registar poreznih obveznika bez lutanja kroz ePoreznu.'
      readingMinutes={11}
      metaDescription={META_DESC}
      toc={[
        { id: 'sto-je', label: 'Što je RPO obrazac' },
        { id: 'tko', label: 'Tko mora predati RPO' },
        { id: 'kada', label: 'Kada se predaje' },
        { id: 'eporezna', label: 'Predaja putem ePorezne' },
        { id: 'primitak', label: 'Predviđeni primitak' },
        { id: 'kasnjenje', label: 'Što ako kasniš' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('otvaranje-obrta'), title: 'Otvaranje obrta' },
        { href: vodiciHref('po-sd-obrazac'), title: 'PO-SD obrazac' },
        { href: vodiciHref('pausalni-obrt-vodic'), title: 'Paušalni obrt 2026.' },
      ]}
      howTo={{
        name: 'Predaja RPO obrasca online',
        description:
          'Najkraći put od rješenja o otvaranju obrta do uspješne predaje RPO obrasca.',
        steps: [
          {
            name: 'Prijavi se u ePoreznu',
            text: 'Otvori ePoreznu i u izborniku Zahtjevi odaberi Prijava u registar poreznih obveznika.',
          },
          {
            name: 'Unesi rezidentnost i razlog upisa',
            text: 'Provjeri državu i datum rezidentnosti te odaberi razlog I - Obrt.',
          },
          {
            name: 'Upiši djelatnosti i paušal',
            text: 'Na dodatnim podacima unesi glavnu i pretežitu djelatnost te odaberi paušalni način oporezivanja.',
          },
          {
            name: 'Potvrdi i pošalji zahtjev',
            text: 'Pregledaj podatke, potvrdi istinitost i arhiviraj potvrdu predaje.',
          },
        ],
      }}
    >
      <p>
        Ključna fraza <strong>RPO obrazac paušalni obrt</strong> zapravo označava prvi pravi
        kontakt obrtnika s poreznim režimom nakon samog otvaranja obrta. RPO nije „još jedan
        papir”, nego formalni upis u Registar poreznih obveznika. U dostupnim podacima iz
        baze znanja jasno stoji da taj korak treba odraditi u roku od 8 dana od otvaranja
        obrta. Zbog tog roka RPO treba planirati paralelno s koracima iz vodiča za{' '}
        <Link href={vodiciHref('otvaranje-obrta')}>otvaranje obrta</Link>, a ne tek kad
        dobiješ prve klijente.
      </p>

      <h2 id='sto-je'>Što je RPO obrazac (Registar poreznih obveznika)</h2>
      <p>
        RPO je obrazac kojim prijavljuješ osnovne porezne podatke obrta: tko si, gdje si
        porezni obveznik, kojom djelatnošću se baviš i koji način oporezivanja biraš. Za
        paušalni obrt to je mjesto na kojem mora biti odabrano da se oporezuješ kao paušal.
        Ako taj korak propustiš ili ga popuniš pogrešno, kasnije možeš završiti u režimu koji
        nisi planirao.
      </p>
      <p>
        U praktičnom smislu, RPO stvara temelj za iduće obveze: kvartalni paušalni porez,
        godišnji <Link href={vodiciHref('po-sd-obrazac')}>PO-SD</Link> i općenito komunikaciju
        s Poreznom. Zato ga vrijedi odraditi pažljivo, iako je tehnički riječ o kratkom
        obrascu.
      </p>

      <h2 id='tko'>Tko mora predati RPO</h2>
      <p>
        RPO predaje obrtnik nakon otvaranja obrta. Ako tek ulaziš u poduzetništvo, ovo je
        standardni obvezni korak, jednako važan kao prijava na osiguranja i otvaranje
        poslovnog računa. U izvoru je naglašeno da se predaja može obaviti fizički u Poreznoj,
        ali je preporuka i najjednostavniji put online predaja kroz ePoreznu.
      </p>
      <p>
        U praksi nije bitno jesi li tek počeo izdavati račune ili još čekaš prvog klijenta.
        Obveza proizlazi iz statusa otvorenog obrta, ne iz trenutka naplate. Zato „pričekat ću
        dok krenem ozbiljno” nije dobra strategija.
      </p>

      <h2 id='kada'>Kada se predaje (pri otvaranju obrta)</h2>
      <p>
        Rok je vrlo jasan: <strong>u roku od 8 dana od otvaranja obrta</strong>. U izvornom
        tekstu to je ponovljeno više puta i povezano s datumom rješenja. Ako rok probiješ,
        rizik je administrativni problem koji se kasnije prenosi na sve ostale porezne
        obveze. Najbolja praksa je da RPO predaš čim dobiješ rješenje, a ne zadnji dan roka.
      </p>
      <p>
        Realno, otvaranje obrta i RPO često traju zajedno nekoliko dana. To znači da već kod
        pokretanja procesa možeš pripremiti podatke koji će ti trebati: djelatnosti, datum
        rezidentnosti i procjenu primitaka.
      </p>

      <h2 id='eporezna'>Kako predati putem ePorezne – korak po korak</h2>
      <p>
        U dostupnim podacima koraci su konkretni. Nakon prijave u ePoreznu ideš na izbornik
        <strong>Zahtjevi</strong> i biraš <strong>Prijava u registar poreznih obveznika (RPO)</strong>.
        Zatim prolaziš stranice obrasca: rezidentnost i državljanstvo, razlog upisa (za obrt
        je navedeno <strong>I - Obrt</strong>), pa dodatne podatke s glavnom i pretežitom
        djelatnosti.
      </p>
      <p>
        Na trećoj stranici unosiš djelatnosti i odabireš <strong>paušal</strong> kao način
        oporezivanja. Nakon toga potvrđuješ istinitost podataka i šalješ zahtjev. Ovdje je
        najvažnije da nakon predaje spremiš potvrdu jer je to dokaz da si rok ispunio na
        vrijeme. Bez potvrde se kasnije nepotrebno dokazuješ.
      </p>

      <h2 id='primitak'>Što upisati pod predviđeni primitak</h2>
      <p>
        Polje predviđenog primitka nije formalnost. U istom izvoru uz porez na dohodak stoji
        da se u prvoj godini poslovanja razred određuje prema iznosu prijavljenom u RPO-u.
        Zato upiši realnu procjenu, ne minimalan broj „reda radi”. Ako podcijeniš primitke,
        kasnije te može dočekati veći usklađeni iznos i lošiji cashflow.
      </p>
      <p>
        Dobra praksa je da procjenu radiš iz tri scenarija: konzervativni, realni i optimistični.
        Zatim uzmi realni scenarij i njega prijavi. Tako se smanjuje šansa da prva godina
        krene s krivim razredom i nepotrebnim korekcijama.
      </p>

      <h2 id='kasnjenje'>Što se dogodi ako ne predaš na vrijeme</h2>
      <p>
        Kašnjenje s RPO-om najčešće ne boli odmah, ali stvara niz problema: neusklađen status
        u poreznoj evidenciji, nejasan početak oporezivanja i dodatna komunikacija s referentom.
        Kad se tome dodaju redovne obveze poput{' '}
        <Link href={vodiciHref('rokovi-placanja')}>rokova plaćanja</Link>, početak poslovanja
        postaje kaotičan.
      </p>
      <p>
        Ako si već zakasnio, najbolji potez je odmah predati obrazac i sačuvati sve potvrde.
        Zatim napravi osobni kalendar obveza: RPO više ne predaješ svake godine, ali nakon
        njega dolaze kvartalni porezi, godišnji PO-SD i druge obveze koje je lakše voditi kad
        sustav postaviš uredno od početka.
      </p>
    </GuideShell>
  );
}

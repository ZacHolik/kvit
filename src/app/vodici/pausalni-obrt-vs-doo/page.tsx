import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteUrl, vodiciHref } from '@/lib/vodici-config';

import { GuideShell } from '../_components/guide-shell';

const SLUG = 'pausalni-obrt-vs-doo';

const META_DESC =
  'Usporedba paušalnog obrta i d.o.o.: troškovi, odgovornost, porezi i kada je pravo vrijeme za promjenu.';

export const metadata: Metadata = {
  title: 'Paušalni obrt vs d.o.o.',
  description: META_DESC,
  openGraph: {
    title: 'Paušalni obrt vs d.o.o. | Kvik',
    description: META_DESC,
    url: `${getSiteUrl()}/vodici/${SLUG}`,
    siteName: 'Kvik',
    locale: 'hr_HR',
    type: 'article',
  },
};

const faq = [
  {
    question: 'Kada se isplati prijeći s paušalnog obrta na d.o.o.?',
    answer:
      'Često kad prihod raste preko PDV praga, trebaš zaposlenike, želiš ograničenu odgovornost ili složenije ugovore s klijentima. Svaka situacija je individualna — broji trošak knjigovodstva i osnivanja naspram uštede na riziku.',
  },
  {
    question: 'Koliko košta osnivanje d.o.o.?',
    answer:
      'Troškovi uključuju temeljni kapital, sudsku pristojbu, objavu u sudskom registru i često agenciju za osnivanje. Paušalni obrt je tipično jeftiniji za start, ali d.o.o. ima drugačiji raspored fiksnih godišnjih troškova.',
  },
  {
    question: 'Mogu li zadržati isti OIB?',
    answer:
      'OIB je vezan uz osobu, ne i poslovni subjekt. d.o.o. dobiva OIB kao pravna osoba, dok fizička osoba zadržava svoj osobni OIB. Praktično vodiš dva porezna identiteta ako si osnivač u d.o.o.',
  },
  {
    question: 'Što se dogodi s KPR-om i PO-SD-om pri prelasku?',
    answer:
      'Na obrtu trebaš zatvoriti godine i predati zadnje izvještaje sukladno pravilima. d.o.o. vodi druge evidencije — planiraj preklapanje s računovođom da nema rupe u izvještavanju.',
  },
  {
    question: 'Je li d.o.o. uvijek bolji za veće prihode?',
    answer:
      'Ne automatski. Veći prihod često traži PDV i knjige u svakom slučaju, ali izbor obrta vs d.o.o. ovisi i o odgovornosti, dividendama, plaćama i dugoročnoj strategiji.',
  },
];

export default function PauzalniObrtVsDooPage() {
  return (
    <GuideShell
      slug={SLUG}
      title='Paušalni obrt vs d.o.o. – kada prijeći i što uzeti u obzir'
      subtitle='Ista zarada ne znači isti porez i isti rizik — evo kako čitati razlike.'
      readingMinutes={12}
      metaDescription={META_DESC}
      toc={[
        { id: 'kljucne', label: 'Ključne razlike (odgovornost, troškovi, porez)' },
        { id: 'tablica', label: 'Usporedna tablica: paušalni obrt vs d.o.o.' },
        { id: 'kada-dosta', label: 'Kada paušalni obrt prestaje biti dovoljno' },
        { id: 'trosak-doo', label: 'Troškovi osnivanja i vođenja d.o.o.' },
        { id: 'optim', label: 'Porezna optimizacija u d.o.o.' },
        { id: 'koraci', label: 'Postupak prelaska – koraci' },
        { id: 'greske', label: 'Česte greške pri prelasku' },
      ]}
      faq={faq}
      related={[
        { href: vodiciHref('pausalni-obrt-vodic'), title: 'Paušalni obrt 2026.' },
        { href: vodiciHref('pausalni-obrt-za-it-freelancere'), title: 'Paušalni obrt za IT freelancere' },
        { href: vodiciHref('doprinosi'), title: 'Doprinosi za paušalni obrt' },
        { href: vodiciHref('otvaranje-obrta'), title: 'Kako otvoriti paušalni obrt' },
        { href: vodiciHref('zatvaranje-obrta'), title: 'Zatvaranje obrta' },
      ]}
      howTo={{
        name: 'Procjena treba li d.o.o.',
        description:
          'Strukturirani koraci prije nego što potpišeš osnivački akt.',
        steps: [
          {
            name: 'Projiciraj primitke tri godine',
            text: 'Uzmi KPR i trend klijenata da vidiš hoćeš li ostati ispod PDV praga.',
          },
          {
            name: 'Izračunaj ukupni trošak vođenja d.o.o.',
            text: 'Knjigovođa, plaće, godišnji fiksni troškovi registra i agencija.',
          },
          {
            name: 'Usporedi odgovornost',
            text: 'Obrtna neograničena odgovornost vs ograničena u d.o.o. za poslovne dugove.',
          },
          {
            name: 'Dogovori datum prelaska',
            text: 'Sinkroniziraj zadnje račune na obrtu i prve u d.o.o. da klijenti znaju nove podatke.',
          },
        ],
      }}
    >
      <p>
        Odluka između modela često počinje s Google upitom{' '}
        <strong>paušalni obrt vs d.o.o.</strong> — i odmah nailaziš na
        proturječne savjete. Istina je da objašnjenja ovise o industriji,
        brzini rasta i tome želiš li osobno odgovarati za sve obveze obrta. U
        Hrvatskoj 2026. paušalni obrt i dalje nudi najbrži start, dok d.o.o.
        donosi strukturu za tim, investicije i veće ugovore. Ovaj vodič ne
        zamjenjuje računovođu, ali daje zajednički jezik kad razgovaraš s
        stručnjakom, posebno ako dolaziš iz{' '}
        <Link href={vodiciHref('pausalni-obrt-za-it-freelancere')}>IT freelancinga</Link> ili
        drugih uslužnih djelatnosti.
      </p>

      <h2 id='kljucne'>Ključne razlike (odgovornost, troškovi, porez)</h2>
      <p>
        Paušalni obrt veže se uz osobu obrtnika: ti odgovaraš cjelokupnom
        imovinom za obveze obrta. d.o.o. kao pravna osoba tipično nosi
        odgovornost do visine uloženog kapitala (uz iznimke zlouporabe).
        Porezno, paušalni obrt koristi paušalni porez na dohodak i razrede, dok
        d.o.o. plaća porez na dobit i drugačije raspoređuje isplate vlasnicima
        (plaće, dividende).
      </p>
      <p>
        Troškovi vođenja: obrt na paušalu često ima manje formalnih papira, ali
        i dalje imaš <Link href={vodiciHref('doprinosi')}>doprinose</Link>,{' '}
        <Link href={vodiciHref('kpr-knjiga-prometa')}>KPR</Link> i{' '}
        <Link href={vodiciHref('po-sd-obrazac')}>PO-SD</Link>. d.o.o. traži
        knjige, bilancu i redovitog računovođu. Razlika u cijeni mjesečnog
        održavanja može biti stotine eura — zato je <strong>paušalni obrt vs d.o.o.</strong>{' '}
        prvo financijska kalkulacija, tek onda statusni simbol.
      </p>

      <h2 id='tablica'>Usporedna tablica: paušalni obrt vs d.o.o.</h2>
      <div className='my-6 overflow-x-auto rounded-xl border border-[#1f2a28]'>
        <table className='w-full min-w-[280px] border-collapse text-left text-sm'>
          <thead>
            <tr className='border-b border-[#1f2a28] bg-[#111716]'>
              <th className='p-3 font-heading text-[#e2e8e7]'>Tema</th>
              <th className='p-3 font-heading text-[#e2e8e7]'>Paušalni obrt</th>
              <th className='p-3 font-heading text-[#e2e8e7]'>d.o.o.</th>
            </tr>
          </thead>
          <tbody className='text-[#b9c7c4]'>
            <tr className='border-b border-[#1f2a28]'>
              <td className='p-3'>Start trošak</td>
              <td className='p-3'>Niži, brži digitalni obrt</td>
              <td className='p-3'>Viši (kapital, sud, objava)</td>
            </tr>
            <tr className='border-b border-[#1f2a28]'>
              <td className='p-3'>Knjigovodstvo</td>
              <td className='p-3'>KPR + paušalni obračun</td>
              <td className='p-3'>Potpune knjige</td>
            </tr>
            <tr className='border-b border-[#1f2a28]'>
              <td className='p-3'>Odgovornost</td>
              <td className='p-3'>Osobna, neograničena</td>
              <td className='p-3'>Tipično ograničena na kapital</td>
            </tr>
            <tr className='border-b border-[#1f2a28]'>
              <td className='p-3'>PDV prag</td>
              <td className='p-3'>60.000 € primitaka</td>
              <td className='p-3'>Isti prag, drugačija administracija</td>
            </tr>
            <tr>
              <td className='p-3'>Isplate vlasniku</td>
              <td className='p-3'>Dohodak obrtnika</td>
              <td className='p-3'>Plaća / dividenda / troškovi</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Tablica je pojednostavljenje — stvarni porezni režim ovisi o točnim
        brojkama i iznimkama. Kad uspoređuješ <strong>paušalni obrt vs d.o.o.</strong>, dodaj
        stupac za rizik od <Link href={vodiciHref('prikriveni-radni-odnos')}>prikrivenog rada</Link>{' '}
        ako bi tvrtka trebala biti klijent istovremeno.
      </p>

      <h2 id='kada-dosta'>Kada paušalni obrt prestaje biti dovoljno</h2>
      <p>
        Tipični signali su: više zaposlenika koje želiš imati pod sobom,
        potreba za ulaganjem u skupe strojeve kroz tvrtku, inozemni vlasnici
        koji traže udjele, ili klijenti koji zahtijevaju složene SLA ugovore.
        Također, ako si blizu PDV praga cijelu godinu, možda je jednostavnije
        prijeći na knjige u d.o.o. nego ostati na paušalu uz nagli skok
        administracije.
      </p>
      <p>
        IT i kreativne industrije često prijeđu prag kad potpisuju retainer s
        velikom korporacijom — tada se isplati imati pravnu osobu koja izgleda
        &quot;enterprise&quot; u nabavi, iako tehnički obrt može isporučiti istu
        uslugu.
      </p>

      <h2 id='trosak-doo'>Troškovi osnivanja i vođenja d.o.o.</h2>
      <p>
        Osnivanje uključuje minimalni temeljni kapital (iznos prati propisi),
        pristojbe i tiskanje dokumenata. Godišnje imaš troškove računovođe,
        obrade plaća ako ih imaš, i naknade registra. U usporedbi, paušalni obrt
        ima niži ulaz, ali ne donosi istu fleksibilnost raspodjele dobiti.
      </p>
      <p>
        Ako si tek početnik, često je pametnije proći put{' '}
        <Link href={vodiciHref('otvaranje-obrta')}>otvaranja obrta</Link>, naučiti
        KPR i račune, pa tek onda migrirati kad brojke pokažu da{' '}
        <strong>paušalni obrt vs d.o.o.</strong> više nije pitanje nego odgovor.
      </p>

      <h2 id='optim'>Porezna optimizacija u d.o.o.</h2>
      <p>
        U d.o.o. se pojavljuju opcije kombiniranja plaće i dobiti, reinvesticije
        u opremu kroz rashode tvrtke i drugačiji odnos prema PDV-u. To nije
        automatska ušteda — loše planirana isplata dividendi može biti skuplja
        od jednostavnog obrta. Zato optimizacija traži računovođu koja poznaje
        tvoj sektor.
      </p>
      <p>
        Paušalni obrt ima ograničen manevar: fokus je na pravovremenim
        uplatama i točnom KPR-u, ne na agresivnoj optimizaciji rashoda.
      </p>

      <h2 id='koraci'>Postupak prelaska – koraci</h2>
      <p>
        Praktičan redoslijed: (1) zatvori otvorene projekte na obrtu ili
        prebaci ih ugovorno na novi subjekt, (2) osnuj d.o.o. i otvori račun
        tvrtke, (3) obavijesti klijente o novim podacima za eRačun, (4) uskladi
        zadnje obrtničke izvještaje, (5) pokreni knjige u d.o.o. Svaki korak ima
        rok — ne raditi ga vikend prije isteka PDV obveze.
      </p>
      <p>
        Ako zaposlenici prelaze s obrta, provjeri radnopravne posljedice; to nije
        samo copy-paste OIB-a.
      </p>

      <h2 id='greske'>Česte greške pri prelasku</h2>
      <p>
        Najčešća greška je izdavanje računa sa starim OIB-om obrta nakon što je
        faktura trebala ići iz d.o.o. Druga je ignoriranje KPR-a u zadnjem
        mjesecu obrta. Treća — zaboraviti obavijestiti banke i PayPal/Stripe
        profile da sredstva idu na pravi račun. Četvrta — misliti da{' '}
        <strong>paušalni obrt vs d.o.o.</strong> rješava sam od sebe prikriveni
        rad ako si zapravo bio u odnosu s jednom tvrtkom kao zaposlena osoba.
      </p>
      <p>
        Za svakodnevni rad dok si još na obrtu, <Link href='/register'>Kvik</Link>{' '}
        pomaže držati red oko računa i KPR-a; kad pređeš u d.o.o., isti disciplinski
        navici vrijede, samo u složenijem okviru.
      </p>
    </GuideShell>
  );
}

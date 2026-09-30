import Link from 'next/link';

import {
  PARTNER_OFFER,
  PRICING,
  PROMO_ORANGE,
  eur,
  isPartnerOfferActive,
} from '@/config/pricing';

import { buildPartnerPostTemplate } from '@/lib/partner-post-template';

import {
  PartnerContactMailButton,
  PartnerCopyEmailButton,
  PartnerCopyTemplateButton,
  PartnerJaviSeButton,
} from './partner-interactive';

const EARNING_COUNTS = [10, 25, 50, 100] as const;

type PartnerPageViewProps = {
  pageCode: string;
};

function partnerEarnings(n: number) {
  const renewal = (n / 2) * PARTNER_OFFER.commissionRenewal;
  const fresh = n * PARTNER_OFFER.commissionNew;
  return { fresh, renewal, total: fresh + renewal };
}

export default function PartnerPageView({ pageCode }: PartnerPageViewProps) {
  const offerActive = isPartnerOfferActive();
  const postTemplate = buildPartnerPostTemplate();
  const orange = { color: PROMO_ORANGE };

  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-12 text-[#e2e8e7] sm:px-6 lg:py-16'>
      <div className='mx-auto max-w-3xl'>
        <div className='mb-8 text-center'>
          <Link
            href='/'
            className='text-2xl font-bold tracking-tight text-[#e2e8e7]'
          >
            Kvik<span className='text-[#0d9488]'>.</span>
          </Link>
        </div>

        <p className='mb-2 text-center text-xs uppercase tracking-wide text-[#94a3a0]'>
          Partnerski program · {PARTNER_OFFER.version}
        </p>
        <h1 className='mb-10 text-center text-3xl font-bold sm:text-4xl'>
          Partnerstvo s Kvikom
        </h1>

        {!offerActive && (
          <p className='mb-8 rounded-lg border border-[#1f2a28] bg-[#111716] px-4 py-3 text-sm text-[#94a3a0]'>
            Ova ponuda vrijedila je do {PARTNER_OFFER.endsLabel} Za nove
            suradnje piši na podrska@kvik.hr.
          </p>
        )}

        <article className='mb-10 rounded-2xl border border-[#1f2a28] bg-white px-6 py-8 text-[1.0625rem] leading-relaxed text-[#1a2422] sm:px-8'>
          <p className='mb-4'>Pozdrav,</p>
          <p className='mb-4'>
            hvala na vremenu. Ovdje je naša ponuda na jednom mjestu, da je
            možeš pročitati u miru.
          </p>
          <p className='mb-4'>
            Kvik je aplikacija za paušalne obrtnike. U njoj izdaju i
            fiskaliziraju račune, knjiga prometa vodi im se sama, a PO-SD
            obrazac pripreme u nekoliko koraka. Na pitanja o porezima,
            doprinosima i fiskalizaciji odgovara im AI asistent, jasnim
            jezikom i u bilo koje doba dana.
          </p>
          <p className='mb-4'>
            Mnogi koji prate tvoj rad imaju paušalni obrt ili ga planiraju
            otvoriti. Zato ti predlažemo suradnju od koje korist imaju svi:
            tvoja publika dobiva prvu godinu Kvika za{' '}
            <span className='font-semibold' style={orange}>
              {eur(PARTNER_OFFER.firstYear)}
            </span>{' '}
            umjesto {eur(PRICING.annual.amount)}, a ti{' '}
            {eur(PARTNER_OFFER.commissionNew)} za svakog novog kupca i još{' '}
            {eur(PARTNER_OFFER.commissionRenewal)} kad taj kupac nakon godinu
            dana obnovi godišnju pretplatu.
          </p>
          <p className='mb-4'>
            Ne plaćamo za objave, nego za kupce. Zato ne tražimo ni minimalan
            broj objava, ni ekskluzivnost, ni da objaviš naš tekst. Objavljuješ
            kad želiš i svojim riječima, uz nekoliko jednostavnih pravila.
          </p>
          <p className='mb-4'>
            Sve pojedinosti su ispod. Ako ti ponuda odgovara, javi nam se na
            podrska@kvik.hr.
          </p>
          <p>— Kvik tim</p>
        </article>

        <section className='mb-12 rounded-2xl border-2 border-[#0d9488] bg-[rgba(13,148,136,0.08)] px-6 py-6 sm:px-8'>
          <h2 className='mb-4 text-xl font-bold'>Ukratko</h2>
          <ul className='list-disc space-y-3 pl-5 text-[#e2e8e7]'>
            <li>
              <strong>Tvoja publika:</strong> prva godina Kvika za{' '}
              <span className='font-semibold' style={orange}>
                {eur(PARTNER_OFFER.firstYear)}
              </span>{' '}
              umjesto {eur(PRICING.annual.amount)} (što je{' '}
              {eur(PARTNER_OFFER.firstYearPerMonth)} mjesečno), uz tvoj osobni
              kôd.
            </li>
            <li>
              <strong>Ti:</strong> {eur(PARTNER_OFFER.commissionNew)} za
              svakog novog kupca s tvojim kodom i još{' '}
              {eur(PARTNER_OFFER.commissionRenewal)} kad taj kupac obnovi
              godišnju pretplatu.
            </li>
            <li>
              <strong>Bez obveza:</strong> nema minimalnog broja objava ni
              ekskluzivnosti.
            </li>
            <li>
              <strong>Kvik za tebe:</strong> godinu dana besplatno.
            </li>
            <li>
              <strong>Rok:</strong> kodovi vrijede do {PARTNER_OFFER.endsLabel}
            </li>
          </ul>
          <PartnerJaviSeButton />
        </section>

        <section className='mb-12 space-y-4'>
          <h2 className='text-2xl font-bold'>Što je Kvik</h2>
          <p>
            Kvik je web aplikacija napravljena samo za paušalne obrtnike. Radi
            u pregledniku, na računalu i na mobitelu.
          </p>
          <ul className='list-disc space-y-2 pl-5'>
            <li>
              izdavanje i fiskalizacija računa (uz vlastiti FINA certifikat),
              ponude i popis kupaca
            </li>
            <li>
              knjiga prometa (KPR) koja se vodi sama iz računa, s izvozom u PDF
              i Excel
            </li>
            <li>PO-SD obrazac</li>
            <li>
              pregled primitaka prema granici od 60.000 € i rokova koji dolaze
            </li>
            <li>
              AI asistent za pitanja o porezima, doprinosima i fiskalizaciji
            </li>
            <li>
              {PARTNER_OFFER.guaranteeDays} dana jamstva povrata novca
            </li>
          </ul>
          <p>
            Na kvik.online su i besplatni vodiči i alati, npr. kalkulator
            poreza.
          </p>
        </section>

        <section className='mb-12'>
          <h2 className='mb-4 text-2xl font-bold'>Ponuda za tvoju publiku</h2>
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[320px] border-collapse text-left text-sm'>
              <thead>
                <tr className='border-b border-[#1f2a28]'>
                  <th className='py-2 pr-4 font-medium' />
                  <th className='py-2 pr-4 font-medium'>Prva godina</th>
                  <th className='py-2 font-medium'>Nakon prve godine</th>
                </tr>
              </thead>
              <tbody className='text-[#94a3a0]'>
                <tr className='border-b border-[#1f2a28]'>
                  <td className='py-3 pr-4 text-[#e2e8e7]'>Redovna cijena</td>
                  <td className='py-3 pr-4'>{eur(PRICING.annual.amount)}</td>
                  <td className='py-3'>
                    {eur(PRICING.annual.amount)} godišnje
                  </td>
                </tr>
                <tr className='border-b border-[#1f2a28]'>
                  <td className='py-3 pr-4 text-[#e2e8e7]'>
                    Javni kôd {PRICING.promo.code}
                  </td>
                  <td className='py-3 pr-4'>
                    {eur(PRICING.promo.annualAmount)}
                  </td>
                  <td className='py-3'>
                    {eur(PRICING.annual.amount)} godišnje
                  </td>
                </tr>
                <tr>
                  <td className='py-3 pr-4 font-semibold text-[#e2e8e7]'>
                    Tvoj kôd
                  </td>
                  <td className='py-3 pr-4 font-semibold text-[#e2e8e7]'>
                    <span style={orange}>{eur(PARTNER_OFFER.firstYear)}</span>{' '}
                    (što je {eur(PARTNER_OFFER.firstYearPerMonth)} mjesečno)
                  </td>
                  <td className='py-3'>
                    {eur(PRICING.annual.amount)} godišnje
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul className='mt-4 list-disc space-y-2 pl-5 text-[#94a3a0]'>
            <li>
              Kôd se upisuje na stranici za plaćanje, u polje za promotivni
              kôd.
            </li>
            <li>
              Vrijedi za godišnju pretplatu i samo za one koji Kvik još nisu
              plaćali, do {PARTNER_OFFER.endsLabel} u 23:59. Ne vrijedi za
              mjesečnu pretplatu ({eur(PRICING.monthly.amount)} mjesečno).
            </li>
            <li>
              Tvoj kôd je povoljniji od javnog {PRICING.promo.code}, pa se
              tvojoj publici isplati upisati baš njega. Tako znamo koji je
              kupac došao preko tebe.
            </li>
            <li>
              Ako kupac u prvih {PARTNER_OFFER.guaranteeDays} dana zaključi da
              mu Kvik ne odgovara, vraćamo mu cijeli iznos.
            </li>
          </ul>
        </section>

        <section className='mb-12 space-y-4'>
          <h2 className='text-2xl font-bold'>Što dobivaš ti</h2>
          <ul className='list-disc space-y-2 pl-5'>
            <li>
              <strong>{eur(PARTNER_OFFER.commissionNew)}</strong> za svakog
              novog kupca koji plati godišnju pretplatu s tvojim kodom
            </li>
            <li>
              <strong>još {eur(PARTNER_OFFER.commissionRenewal)}</strong> kad
              taj kupac nakon godinu dana obnovi godišnju pretplatu. Za jednog
              kupca plaćamo najviše ove dvije provizije.
            </li>
            <li>
              <strong>godinu dana Kvika besplatno</strong>, da ga možeš
              preporučiti iz vlastitog iskustva. Pri aktivaciji stranica za
              plaćanje traži karticu, a nakon godinu dana pretplata se
              obnavlja po {eur(PRICING.annual.amount)} godišnje ako je prije
              toga ne otkažeš.
            </li>
          </ul>
          <p className='text-[#94a3a0]'>
            Broj kupaca nije ograničen. Iznosi su ukupni: ako si u sustavu
            PDV-a, PDV je u njima sadržan.
          </p>

          <h3 className='pt-2 text-lg font-bold'>Koliko to može biti</h3>
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[360px] border-collapse text-left text-sm'>
              <thead>
                <tr className='border-b border-[#1f2a28] text-[#94a3a0]'>
                  <th className='py-2 pr-3 font-medium'>
                    Kupaca s tvojim kodom
                  </th>
                  <th className='py-2 pr-3 font-medium'>Za nove kupce</th>
                  <th className='py-2 pr-3 font-medium'>
                    Za obnove, ako pola kupaca obnovi
                  </th>
                  <th className='py-2 font-medium'>Ukupno</th>
                </tr>
              </thead>
              <tbody>
                {EARNING_COUNTS.map((n) => {
                  const row = partnerEarnings(n);
                  return (
                    <tr key={n} className='border-b border-[#1f2a28]'>
                      <td className='py-3 pr-3'>{n}</td>
                      <td className='py-3 pr-3'>{eur(row.fresh)}</td>
                      <td className='py-3 pr-3'>{eur(row.renewal)}</td>
                      <td className='py-3 font-medium'>{eur(row.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className='text-sm text-[#94a3a0]'>
            Ovo je primjer. Koliko će kupaca obnoviti pretplatu, ne možemo
            znati unaprijed.
          </p>
        </section>

        <section className='mb-12 space-y-3'>
          <h2 className='text-2xl font-bold'>Tko može biti partner</h2>
          <ul className='list-disc space-y-2 pl-5'>
            <li>
              autori na društvenim mrežama i vlasnici newslettera i mailing
              lista čiju publiku čine ljudi koji rade za sebe
            </li>
            <li>
              za isplatu nam moraš izdati račun, pa suradnja ide preko obrta,
              tvrtke ili udruge registrirane u Hrvatskoj, ili preko agencije iz
              Hrvatske
            </li>
          </ul>
        </section>

        <section className='mb-12 space-y-3'>
          <h2 className='text-2xl font-bold'>Kako funkcionira</h2>
          <ol className='list-decimal space-y-2 pl-5'>
            <li>
              <strong>Javiš nam se</strong> na podrska@kvik.hr s podacima s
              dna ove stranice.
            </li>
            <li>
              <strong>Potvrdiš uvjete mailom.</strong> Kad nam napišeš da
              prihvaćaš uvjete s ove stranice, šaljemo ti tvoj kôd, link i kôd
              za tvoju besplatnu godinu Kvika.
            </li>
            <li>
              <strong>Objavljuješ</strong> kad i kako želiš, uz oznaku
              plaćene suradnje.
            </li>
            <li>
              <strong>Do {PARTNER_OFFER.statementDay}. u mjesecu šaljemo ti
              obračun:</strong> datum i iznos svake uplate kupaca s tvojim
              kodom starije od {PARTNER_OFFER.guaranteeDays} dana. Podatke o
              kupcima ne dijelimo.
            </li>
            <li>
              <strong>Izdaš nam račun</strong>, a isplata stiže do{' '}
              {PARTNER_OFFER.payoutDay}. u mjesecu. Iznos manji od{' '}
              {eur(PARTNER_OFFER.minPayout)} prenosi se u sljedeći mjesec.
              Obračun u siječnju i posljednji obračun isplaćujemo bez obzira na
              iznos.
            </li>
          </ol>
        </section>

        <section className='mb-12 space-y-3 text-sm leading-relaxed'>
          <h2 className='text-2xl font-bold'>Pravila</h2>
          <p className='text-[#94a3a0]'>
            Malo ih je, a vrijede za svaku objavu.
          </p>
          <ol className='list-decimal space-y-3 pl-5'>
            <li>
              <strong>Označi suradnju.</strong> Na početak svake objave u kojoj
              spominješ Kvik stavi #oglas ili #promo, ili uključi oznaku
              platforme za plaćeno partnerstvo. U videu oznaka ide i na
              početak samog videa. Tako traže Smjernice za bolje influencanje
              udruge IAB Croatia. U newsletteru preporuku označi riječju
              „Oglas&quot;.
            </li>
            <li>
              <strong>Dijeli kôd samo na svojim kanalima:</strong> profilima,
              newsletteru i webu. Ne objavljuj ga na stranicama s kuponima i
              popustima.
            </li>
            <li>
              <strong>Ne zakupljuj oglase na naše ime.</strong> Bez oglasa na
              tražilicama na riječ „Kvik&quot; i bez oglasa u ime Kvika.
              Promoviranje vlastite objave je u redu.
            </li>
            <li>
              <strong>Ne šalji neželjene poruke.</strong> Newsletter šalji
              samo onima koji su se na njega prijavili, a kôd ne šalji
              masovnim porukama.
            </li>
            <li>
              <strong>Za vlastitu pretplatu nema provizije</strong>, ni za
              pretplatu svog obrta ili tvrtke.
            </li>
            <li>
              <strong>Kad označavaš Kvik, označi samo njegove službene
              profile.</strong> Kvik predstavljaj kao aplikaciju, a osobe iz
              tima ne spominji i ne označavaj.
            </li>
            <li>
              <strong>Drži se činjenica</strong> iz odjeljaka „Što smiješ
              reći&quot; i „Što ne smiješ tvrditi ni obećati&quot;.
            </li>
          </ol>
          <p className='text-[#94a3a0]'>
            Suradnju svaka strana može prekinuti mailom. Od tog dana tvoj kôd
            više ne vrijedi, a provizije za kupce koji su do tada platili s
            tvojim kodom, i za prvu obnovu njihove godišnje pretplate,
            isplaćujemo i dalje. Ako suradnju prekidamo zbog kršenja pravila,
            za uplate koje su iz kršenja nastale provizije nema.
          </p>
        </section>

        <section className='mb-12 space-y-2'>
          <h2 className='text-2xl font-bold'>Što smiješ reći</h2>
          <ul className='list-disc space-y-2 pl-5'>
            <li>Kvik je aplikacija za paušalne obrtnike.</li>
            <li>
              U Kviku izdaješ i fiskaliziraš račune (uz vlastiti FINA
              certifikat), a knjiga prometa vodi se sama.
            </li>
            <li>U Kviku pripremiš PO-SD obrazac.</li>
            <li>
              AI asistent odgovara na pitanja o porezima, doprinosima i
              fiskalizaciji.
            </li>
            <li>
              S mojim kodom prva godina Kvika stoji {eur(PARTNER_OFFER.firstYear)}{' '}
              umjesto {eur(PRICING.annual.amount)}.
            </li>
            <li>
              Ako ti u prvih {PARTNER_OFFER.guaranteeDays} dana Kvik ne
              odgovara, dobiješ cijeli iznos natrag.
            </li>
          </ul>
        </section>

        <section className='mb-12 space-y-2'>
          <h2 className='text-2xl font-bold'>
            Što ne smiješ tvrditi ni obećati
          </h2>
          <ul className='list-disc space-y-2 pl-5 text-[#94a3a0]'>
            <li>
              da je aplikacija besplatna: besplatni su samo vodiči i alati na
              kvik.online
            </li>
            <li>eRačune: Kvik ih zasad ne izdaje</li>
            <li>
              povezivanje s bankom: Kvik ne povlači uplate ni izvode iz banke
            </li>
            <li>
              da za fiskalizaciju ne treba FINA certifikat: korisnik ga
              pribavlja sam
            </li>
            <li>
              da Kvik umjesto korisnika predaje obrasce ili plaća porez i
              doprinose
            </li>
            <li>
              da AI asistent zamjenjuje knjigovođu ili poreznog savjetnika
            </li>
            <li>
              aplikaciju u Google Playu ili App Storeu: Kvik radi u pregledniku
            </li>
            <li>brojke o korisnicima, uštedi ili zaradi</li>
            <li>da je Kvik jedini ili najbolji</li>
          </ul>
          <p>
            Ako ti nešto nije jasno, pošalji nam tekst prije objave i
            provjerit ćemo činjenice.
          </p>
        </section>

        <section className='mb-12'>
          <h2 className='mb-3 text-2xl font-bold'>Primjer objave</h2>
          <p className='mb-4 text-sm text-[#94a3a0]'>
            Samo kostur. Napiši ga svojim riječima.
          </p>
          <pre className='overflow-x-auto whitespace-pre-wrap rounded-xl border border-[#1f2a28] bg-[#111716] p-4 font-mono text-xs leading-relaxed text-[#94a3a0] sm:text-sm'>
            {postTemplate}
          </pre>
          <PartnerCopyTemplateButton
            pageCode={pageCode}
            template={postTemplate}
          />
        </section>

        <section className='mb-12 space-y-3'>
          <h2 className='text-2xl font-bold'>Česta pitanja</h2>
          <details className='rounded-lg border border-[#1f2a28] px-4 py-2'>
            <summary className='cursor-pointer font-medium'>
              Što ako pratitelj zaboravi upisati kôd?
            </summary>
            <p className='mt-2 text-sm text-[#94a3a0]'>
              Tada ne možemo znati da je došao preko tebe, pa provizije nema.
              Zato kôd uvijek ide u objavu, a niža cijena je razlog da ga
              pratitelj upiše.
            </p>
          </details>
          <details className='rounded-lg border border-[#1f2a28] px-4 py-2'>
            <summary className='cursor-pointer font-medium'>
              Vrijedi li kôd za mjesečnu pretplatu?
            </summary>
            <p className='mt-2 text-sm text-[#94a3a0]'>
              Ne, samo za godišnju.
            </p>
          </details>
          <details className='rounded-lg border border-[#1f2a28] px-4 py-2'>
            <summary className='cursor-pointer font-medium'>
              Vrijedi li kôd za postojeće korisnike Kvika?
            </summary>
            <p className='mt-2 text-sm text-[#94a3a0]'>
              Ne, samo za one koji Kvik još nisu plaćali. Za uplatu nekoga tko
              je Kvik već plaćao provizije nema.
            </p>
          </details>
          <details className='rounded-lg border border-[#1f2a28] px-4 py-2'>
            <summary className='cursor-pointer font-medium'>
              Što ako kupac zatraži povrat novca?
            </summary>
            <p className='mt-2 text-sm text-[#94a3a0]'>
              Ako ga zatraži u {PARTNER_OFFER.guaranteeDays} dana od uplate, za
              tu uplatu provizije nema. Za uplate starije od{' '}
              {PARTNER_OFFER.guaranteeDays} dana provizija je tvoja, osim ako
              kupac uplatu kasnije ospori preko banke.
            </p>
          </details>
          <details className='rounded-lg border border-[#1f2a28] px-4 py-2'>
            <summary className='cursor-pointer font-medium'>
              Plaćate li objavu?
            </summary>
            <p className='mt-2 text-sm text-[#94a3a0]'>
              Ne. Plaćamo za svakog kupca s tvojim kodom, a broj kupaca nije
              ograničen.
            </p>
          </details>
          <details className='rounded-lg border border-[#1f2a28] px-4 py-2'>
            <summary className='cursor-pointer font-medium'>
              Kako znam da je obračun točan?
            </summary>
            <p className='mt-2 text-sm text-[#94a3a0]'>
              Plaćanja idu preko Stripea, a obračun radimo iz Stripeovih
              podataka o uplatama kupaca koji su platili s tvojim kodom. Uz
              svaku uplatu navodimo datum i iznos.
            </p>
          </details>
          <details className='rounded-lg border border-[#1f2a28] px-4 py-2'>
            <summary className='cursor-pointer font-medium'>
              Mogu li objavljivati više puta i na više kanala?
            </summary>
            <p className='mt-2 text-sm text-[#94a3a0]'>
              Da, koliko god želiš, do {PARTNER_OFFER.endsLabel}
            </p>
          </details>
          <details className='rounded-lg border border-[#1f2a28] px-4 py-2'>
            <summary className='cursor-pointer font-medium'>
              Što nakon {PARTNER_OFFER.endsLabel}?
            </summary>
            <p className='mt-2 text-sm text-[#94a3a0]'>
              Kodovi prestaju vrijediti. Provizije za obnove isplaćujemo kako
              kupci obnavljaju pretplatu, zadnje početkom 2028. Ako ponudu
              produljimo, javit ćemo ti se prije isteka.
            </p>
          </details>
          <details className='rounded-lg border border-[#1f2a28] px-4 py-2'>
            <summary className='cursor-pointer font-medium'>
              Nemam obrt ni tvrtku. Možemo li surađivati?
            </summary>
            <p className='mt-2 text-sm text-[#94a3a0]'>
              Možemo, preko udruge registrirane u Hrvatskoj ili agencije iz
              Hrvatske koja nam izdaje račun. Isplate fizičkim osobama ne
              radimo.
            </p>
          </details>
          <details className='rounded-lg border border-[#1f2a28] px-4 py-2'>
            <summary className='cursor-pointer font-medium'>
              Tko odgovara na pitanja?
            </summary>
            <p className='mt-2 text-sm text-[#94a3a0]'>
              Kvik tim, na podrska@kvik.hr.
            </p>
          </details>
        </section>

        <section id='javi-se' className='mb-16 scroll-mt-8 space-y-4'>
          <h2 className='text-2xl font-bold'>Javi se</h2>
          <p>
            Pošalji nam mail s ovim podacima i snimkom zaslona statistike
            publike (zemlja i dob). Odgovaramo u roku od dva radna dana.
          </p>
          <PartnerContactMailButton pageCode={pageCode} />
          <pre className='mt-4 overflow-x-auto whitespace-pre-wrap rounded-xl border border-[#1f2a28] bg-[#111716] p-4 font-mono text-xs text-[#94a3a0] sm:text-sm'>
            {`Naziv obrta, tvrtke, udruge ili agencije:
Kanal (Instagram, TikTok, Facebook, newsletter...):
Link na profil ili newsletter:
Broj pratitelja ili pretplatnika:
Željeni kôd (npr. IME5):
Okvirni datum prve objave:

(U prilogu: snimka zaslona statistike publike, zemlja i dob)`}
          </pre>
          <p className='text-sm text-[#94a3a0]'>
            ili piši na{' '}
            <span className='text-[#e2e8e7]'>podrska@kvik.hr</span>
            <PartnerCopyEmailButton />
          </p>
        </section>

        <p className='text-center text-xs text-[#64756f]'>
          Uvjeti {PARTNER_OFFER.version}. Vrijede za suradnje dogovorene do{' '}
          {PARTNER_OFFER.endsLabel}
        </p>

        <div className='mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-[#1f2a28] pt-8 text-sm text-[#94a3a0]'>
          <Link href='/' className='hover:text-[#e2e8e7]'>
            Početna
          </Link>
          <Link href='/alati' className='hover:text-[#e2e8e7]'>
            Alati
          </Link>
          <Link href='/vodici' className='hover:text-[#e2e8e7]'>
            Vodiči
          </Link>
          <Link href='/privacy' className='hover:text-[#e2e8e7]'>
            Privatnost
          </Link>
          <Link href='/uvjeti' className='hover:text-[#e2e8e7]'>
            Uvjeti
          </Link>
        </div>
        <p className='mt-6 text-center text-xs text-[#94a3a0]'>
          © 2026 Kvik. Sva prava pridržana.
        </p>
      </div>
    </main>
  );
}

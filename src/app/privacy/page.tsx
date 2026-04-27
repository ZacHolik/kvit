import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politika privatnosti | Kvit',
  description:
    'Politika privatnosti za Kvit aplikaciju: obrada osobnih podataka, kolačići, zadržavanje podataka i GDPR prava korisnika.',
};

const updatedAt = '27. travnja 2026.';
const contactEmail = 'privacy@kvik.online';

const toc = [
  ['voditelj-obrade', 'Voditelj obrade'],
  ['podaci', 'Koje podatke prikupljamo'],
  ['pravna-osnova', 'Pravna osnova obrade'],
  ['koristenje', 'Kako koristimo podatke'],
  ['sigurnost', 'Pohrana i sigurnost'],
  ['trece-strane', 'Dijeljenje s trećim stranama'],
  ['prava', 'Prava korisnika'],
  ['kolacici', 'Kolačići'],
  ['zadrzavanje', 'Zadržavanje podataka'],
  ['maloljetnici', 'Maloljetnici'],
  ['izmjene', 'Izmjene politike'],
  ['nadzor', 'Nadzorno tijelo i kontakt'],
] as const;

export default function PrivacyPage() {
  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-10 text-[#e2e8e7] sm:px-6 lg:px-8'>
      <article className='mx-auto max-w-5xl'>
        <Link
          href='/'
          className='font-body text-sm font-semibold text-[#5eead4] transition hover:text-[#99f6e4]'
        >
          ← Natrag na Kvit
        </Link>

        <header className='mt-8 rounded-3xl border border-[#1f2a28] bg-[#111716] p-6 shadow-xl shadow-black/25 sm:p-10'>
          <span className='font-body inline-flex rounded-full border border-[#0d9488]/40 bg-[#0d9488]/10 px-3 py-1 text-xs font-semibold text-[#5eead4]'>
            Zadnje ažurirano: {updatedAt}
          </span>
          <p className='font-body mt-6 text-sm text-[#94a3a0]'>
            Verzija v1.0 · {updatedAt}
          </p>
          <h1 className='font-heading mt-3 text-4xl font-bold tracking-tight text-[#f0faf8] sm:text-5xl'>
            Politika privatnosti
          </h1>
          <p className='font-body mt-5 max-w-3xl text-base leading-relaxed text-[#b9c7c4]'>
            Ova Politika privatnosti objašnjava kako Kvit prikuplja, koristi,
            pohranjuje i štiti osobne podatke korisnika aplikacije i javnih
            stranica na kvik.online, u skladu s Općom uredbom o zaštiti podataka
            (GDPR) i primjenjivim propisima Republike Hrvatske.
          </p>
        </header>

        <div className='mt-8 grid gap-8 lg:grid-cols-[18rem_1fr]'>
          <aside className='lg:sticky lg:top-6 lg:self-start'>
            <nav className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5'>
              <p className='font-heading text-sm font-semibold text-[#e2e8e7]'>
                Sadržaj
              </p>
              <ol className='font-body mt-4 space-y-2 text-sm text-[#94a3a0]'>
                {toc.map(([id, label], index) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className='transition hover:text-[#5eead4]'
                    >
                      {index + 1}. {label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className='space-y-6'>
            <section
              id='voditelj-obrade'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                1. Voditelj obrade
              </h2>
              <p className='font-body mt-4 leading-relaxed text-[#d5dfdd]'>
                Voditelj obrade osobnih podataka je Kvit, digitalna usluga
                dostupna na domeni kvik.online. Za pitanja o privatnosti,
                ostvarivanje GDPR prava ili sigurnosne upite možeš nas
                kontaktirati na{' '}
                <a
                  href={`mailto:${contactEmail}`}
                  className='font-semibold text-[#5eead4] hover:underline'
                >
                  {contactEmail}
                </a>
                .
              </p>
            </section>

            <section
              id='podaci'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                2. Koje podatke prikupljamo
              </h2>
              <ul className='font-body mt-4 list-disc space-y-3 pl-6 leading-relaxed text-[#d5dfdd]'>
                <li>
                  <strong>Registracija:</strong> email adresa, ime korisnika
                  ako ga korisnik unese, lozinka u hashiranom obliku te podaci
                  potrebni za potvrdu računa.
                </li>
                <li>
                  <strong>Profil obrta:</strong> naziv obrta, OIB, IBAN,
                  adresa, općina i drugi podaci koje korisnik unosi radi
                  izdavanja računa i vođenja evidencija.
                </li>
                <li>
                  <strong>Podaci vlasnika:</strong> ime vlasnika obrta i adresa
                  prebivališta kada su potrebni za obrasce, izvještaje ili
                  zakonske evidencije.
                </li>
                <li>
                  <strong>Poslovni podaci:</strong> računi, ponude, kupci,
                  stavke, KPR, PO-SD i povezane poslovne evidencije.
                </li>
                <li>
                  <strong>Tehnički podaci:</strong> IP adresa, tip preglednika,
                  operativni sustav, identifikatori sesije, sigurnosni logovi i
                  podaci o korištenju aplikacije.
                </li>
                <li>
                  <strong>Kolačići i slične tehnologije:</strong> funkcionalni
                  kolačići nužni za rad aplikacije, Vercel Analytics i Meta
                  Pixel za analitiku i mjerenje učinkovitosti kampanja.
                </li>
              </ul>
            </section>

            <section
              id='pravna-osnova'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                3. Pravna osnova obrade
              </h2>
              <p className='font-body mt-4 leading-relaxed text-[#d5dfdd]'>
                Osobne podatke obrađujemo na temelju članka 6. GDPR-a:
              </p>
              <ul className='font-body mt-4 list-disc space-y-3 pl-6 leading-relaxed text-[#d5dfdd]'>
                <li>
                  <strong>Izvršenje ugovora</strong> kada obrađujemo podatke
                  potrebne za registraciju, prijavu, izdavanje računa, vođenje
                  evidencija i pružanje ugovorenih funkcionalnosti.
                </li>
                <li>
                  <strong>Legitimni interes</strong> za sigurnost sustava,
                  sprječavanje zlouporabe, osnovnu analitiku, poboljšanje
                  proizvoda i zaštitu pravnih interesa.
                </li>
                <li>
                  <strong>Privola korisnika</strong> kada je potrebna za
                  analitičke ili marketinške kolačiće i komunikacije koje nisu
                  nužne za korištenje usluge.
                </li>
              </ul>
            </section>

            <section
              id='koristenje'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                4. Kako koristimo podatke
              </h2>
              <ul className='font-body mt-4 list-disc space-y-3 pl-6 leading-relaxed text-[#d5dfdd]'>
                <li>Za pružanje, održavanje i sigurnost Kvit usluge.</li>
                <li>
                  Za izradu računa, ponuda, KPR-a, PO-SD-a i drugih evidencija
                  koje korisnik samostalno generira u aplikaciji.
                </li>
                <li>
                  Za email komunikaciju, uključujući potvrdu računa,
                  transakcijske poruke i slanje dokumenata putem Resenda.
                </li>
                <li>
                  Za analitiku putem Vercel Analyticsa i Meta Pixela u
                  agregiranom ili pseudonimiziranom obliku, gdje je primjenjivo.
                </li>
                <li>
                  Za poboljšanje proizvoda, uklanjanje grešaka i razvoj novih
                  funkcionalnosti za paušalne obrtnike.
                </li>
              </ul>
            </section>

            <section
              id='sigurnost'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                5. Pohrana i sigurnost
              </h2>
              <ul className='font-body mt-4 list-disc space-y-3 pl-6 leading-relaxed text-[#d5dfdd]'>
                <li>
                  Podaci se pohranjuju u Supabase infrastrukturi u EU regiji
                  (Frankfurt), uz kontrole pristupa i izolaciju korisničkih
                  podataka.
                </li>
                <li>
                  Prijenos podataka odvija se putem HTTPS/TLS enkripcije.
                </li>
                <li>
                  Osjetljivi podaci i dokumenti, uključujući FINA certifikate
                  kada se koriste u fiskalizacijskom toku, pohranjuju se
                  enkriptirano uz AES-256 i u privatnim bucketima s ograničenim
                  pristupom.
                </li>
                <li>
                  Lozinke se ne pohranjuju u čitljivom obliku nego u hashiranom
                  obliku kroz sustav autentikacije.
                </li>
              </ul>
            </section>

            <section
              id='trece-strane'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                6. Dijeljenje s trećim stranama
              </h2>
              <p className='font-body mt-4 leading-relaxed text-[#d5dfdd]'>
                Podatke dijelimo samo kada je to potrebno za rad usluge,
                izvršenje korisničkog zahtjeva ili ispunjenje zakonske obveze:
              </p>
              <ul className='font-body mt-4 list-disc space-y-3 pl-6 leading-relaxed text-[#d5dfdd]'>
                <li>
                  <strong>Supabase</strong> za bazu podataka, autentikaciju i
                  pohranu datoteka.
                </li>
                <li>
                  <strong>Anthropic</strong> za AI asistenta; razgovori se šalju
                  radi generiranja odgovora i ne koriste se za trajnu pohranu
                  razgovora u Kvitu osim ako korisnik izričito zatraži funkciju
                  koja to zahtijeva.
                </li>
                <li>
                  <strong>Resend</strong> za email dostavu transakcijskih poruka
                  i dokumenata.
                </li>
                <li>
                  <strong>Vercel</strong> za hosting, infrastrukturu i
                  analitiku.
                </li>
                <li>
                  <strong>Meta</strong> za Pixel i mjerenje kampanja, u skladu s
                  postavkama privole i dostupnim anonimizacijskim mehanizmima.
                </li>
                <li>
                  <strong>FINA i Porezna uprava</strong> za fiskalizaciju,
                  eRačune i druge zakonske obveze kada korisnik koristi
                  povezane funkcionalnosti.
                </li>
              </ul>
            </section>

            <section
              id='prava'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                7. Prava korisnika
              </h2>
              <p className='font-body mt-4 leading-relaxed text-[#d5dfdd]'>
                Korisnik ima prava propisana GDPR-om, uključujući:
              </p>
              <ul className='font-body mt-4 list-disc space-y-3 pl-6 leading-relaxed text-[#d5dfdd]'>
                <li>pravo pristupa osobnim podacima,</li>
                <li>pravo na ispravak netočnih ili nepotpunih podataka,</li>
                <li>pravo na brisanje računa i podataka, kada je primjenjivo,</li>
                <li>pravo na prenosivost podataka i export poslovnih evidencija,</li>
                <li>pravo na prigovor na obradu,</li>
                <li>pravo na povlačenje privole u bilo kojem trenutku.</li>
              </ul>
              <p className='font-body mt-4 leading-relaxed text-[#d5dfdd]'>
                Za ostvarivanje prava pošalji zahtjev na{' '}
                <a
                  href={`mailto:${contactEmail}`}
                  className='font-semibold text-[#5eead4] hover:underline'
                >
                  {contactEmail}
                </a>
                . Zbog sigurnosti možemo zatražiti dodatnu provjeru identiteta.
              </p>
            </section>

            <section
              id='kolacici'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>8. Kolačići</h2>
              <ul className='font-body mt-4 list-disc space-y-3 pl-6 leading-relaxed text-[#d5dfdd]'>
                <li>
                  <strong>Funkcionalni kolačići</strong> nužni su za prijavu,
                  sigurnost sesije i osnovni rad aplikacije.
                </li>
                <li>
                  <strong>Analitički kolačići</strong> pomažu razumjeti kako se
                  javne stranice i aplikacija koriste, primjerice putem Vercel
                  Analyticsa.
                </li>
                <li>
                  <strong>Marketinški kolačići</strong> mogu se koristiti za
                  mjerenje kampanja i oglašavanja putem Meta Pixela, kada je to
                  dopušteno i primjenjivo.
                </li>
              </ul>
            </section>

            <section
              id='zadrzavanje'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                9. Zadržavanje podataka
              </h2>
              <ul className='font-body mt-4 list-disc space-y-3 pl-6 leading-relaxed text-[#d5dfdd]'>
                <li>
                  Podaci aktivnih korisnika čuvaju se dok korisnik koristi
                  uslugu ili dok su potrebni za pružanje ugovorenih
                  funkcionalnosti.
                </li>
                <li>
                  Nakon brisanja računa, podaci mogu ostati u sigurnosnim
                  kopijama do 30 dana.
                </li>
                <li>
                  Računovodstveni i poslovni podaci čuvaju se do 11 godina kada
                  je to potrebno radi zakonskih obveza, poreznih propisa i
                  dokazivanja poslovnih događaja.
                </li>
              </ul>
            </section>

            <section
              id='maloljetnici'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                10. Maloljetnici
              </h2>
              <p className='font-body mt-4 leading-relaxed text-[#d5dfdd]'>
                Kvit nije namijenjen osobama mlađim od 18 godina. Ako saznamo
                da je račun otvorila maloljetna osoba bez valjane pravne osnove,
                poduzet ćemo razumne korake za ograničenje ili brisanje računa.
              </p>
            </section>

            <section
              id='izmjene'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                11. Izmjene politike
              </h2>
              <p className='font-body mt-4 leading-relaxed text-[#d5dfdd]'>
                Kvit može povremeno ažurirati ovu Politiku privatnosti.
                Materijalne izmjene objavit ćemo na ovoj stranici i, kada je
                primjenjivo, poslati obavijest emailom najmanje 30 dana prije
                stupanja izmjena na snagu.
              </p>
            </section>

            <section
              id='nadzor'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                12. Nadzorno tijelo i kontakt
              </h2>
              <p className='font-body mt-4 leading-relaxed text-[#d5dfdd]'>
                Korisnik ima pravo podnijeti pritužbu Agenciji za zaštitu
                osobnih podataka (AZOP), dostupnoj na{' '}
                <a
                  href='https://azop.hr'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-semibold text-[#5eead4] hover:underline'
                >
                  azop.hr
                </a>
                . Za kontakt DPO-a odnosno osobe zadužene za zaštitu podataka i
                voditelja obrade piši na{' '}
                <a
                  href={`mailto:${contactEmail}`}
                  className='font-semibold text-[#5eead4] hover:underline'
                >
                  {contactEmail}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Uvjeti korištenja | Kvik',
  description:
    'Uvjeti korištenja Kvik aplikacije: korisnički račun, dopuštena upotreba, pretplate, fiskalizacija, odgovornost i raskid.',
};

const updatedAt = '27. travnja 2026.';
const contactEmail = 'support@kvik.online';

const toc = [
  ['pruzatelj', 'Pružatelj usluge'],
  ['opis', 'Opis usluge i namjena'],
  ['prihvacanje', 'Prihvaćanje uvjeta'],
  ['racun', 'Korisnički račun'],
  ['upotreba', 'Dopuštena i zabranjena upotreba'],
  ['pretplate', 'Pretplate i plaćanje'],
  ['fiskalizacija', 'Usluga fiskalizacije'],
  ['dostupnost', 'Dostupnost usluge'],
  ['odgovornost', 'Ograničenje odgovornosti'],
  ['vlasnistvo', 'Intelektualno vlasništvo'],
  ['raskid', 'Raskid'],
  ['izmjene', 'Izmjene uvjeta'],
  ['pravo', 'Mjerodavno pravo i kontakt'],
] as const;

export default function TermsPage() {
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
            Uvjeti korištenja
          </h1>
          <p className='font-body mt-5 max-w-3xl text-base leading-relaxed text-[#b9c7c4]'>
            Ovi Uvjeti korištenja uređuju pristup i korištenje Kvit aplikacije,
            javnih stranica i povezanih digitalnih usluga. Molimo pročitaj ih
            pažljivo prije registracije ili korištenja aplikacije.
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
              id='pruzatelj'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                1. Pružatelj usluge
              </h2>
              <p className='font-body mt-4 leading-relaxed text-[#d5dfdd]'>
                Pružatelj usluge je Kvit, digitalna aplikacija dostupna na
                domeni kvik.online. Za pitanja o ovim Uvjetima korištenja možeš
                nas kontaktirati na{' '}
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
              id='opis'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                2. Opis usluge i namjena
              </h2>
              <p className='font-body mt-4 leading-relaxed text-[#d5dfdd]'>
                Kvit je SaaS aplikacija namijenjena prvenstveno hrvatskim
                paušalnim obrtnicima. Usluga omogućuje izradu i slanje računa i
                ponuda, vođenje kupaca i stavki, generiranje poslovnih
                evidencija poput KPR-a i PO-SD-a, korištenje edukativnih vodiča
                i alata te pristup AI asistentu za opće informativne odgovore.
              </p>
              <p className='font-body mt-4 leading-relaxed text-[#d5dfdd]'>
                Kvit ne zamjenjuje poreznog savjetnika, računovođu, odvjetnika
                ili službeno tumačenje nadležnih tijela. Korisnik je odgovoran
                provjeriti je li konkretna poslovna odluka usklađena s njegovom
                situacijom i važećim propisima.
              </p>
            </section>

            <section
              id='prihvacanje'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                3. Prihvaćanje uvjeta
              </h2>
              <p className='font-body mt-4 leading-relaxed text-[#d5dfdd]'>
                Registracijom korisničkog računa, pristupom aplikaciji ili
                korištenjem bilo koje Kvit funkcionalnosti korisnik potvrđuje da
                je pročitao, razumio i prihvatio ove Uvjete korištenja te
                povezanu{' '}
                <Link
                  href='/privacy'
                  className='font-semibold text-[#5eead4] hover:underline'
                >
                  Politiku privatnosti
                </Link>
                .
              </p>
            </section>

            <section
              id='racun'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                4. Korisnički račun
              </h2>
              <ul className='font-body mt-4 list-disc space-y-3 pl-6 leading-relaxed text-[#d5dfdd]'>
                <li>
                  Korisnik mora unositi točne, potpune i ažurne podatke,
                  osobito podatke potrebne za izdavanje računa, fiskalizaciju i
                  zakonske evidencije.
                </li>
                <li>
                  Korisnik je odgovoran za čuvanje svoje lozinke i kontrolu
                  pristupa svom korisničkom računu.
                </li>
                <li>
                  Dijeljenje korisničkog računa s drugim osobama nije dopušteno,
                  osim ako određeni plan ili funkcionalnost izričito omogućuje
                  timski pristup.
                </li>
                <li>
                  Korisnik mora odmah prijaviti sumnju na kompromitirani račun,
                  neovlašten pristup ili sigurnosni incident.
                </li>
              </ul>
            </section>

            <section
              id='upotreba'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                5. Dopuštena i zabranjena upotreba
              </h2>
              <p className='font-body mt-4 leading-relaxed text-[#d5dfdd]'>
                Kvit se smije koristiti samo za zakonito poslovanje, vlastite
                poslovne evidencije i funkcionalnosti dostupne unutar
                odabranog plana.
              </p>
              <p className='font-body mt-4 font-semibold text-[#f0faf8]'>
                Zabranjeno je:
              </p>
              <ul className='font-body mt-3 list-disc space-y-3 pl-6 leading-relaxed text-[#d5dfdd]'>
                <li>
                  reverse engineering, dekompilacija, kopiranje ili pokušaj
                  izvlačenja izvornog koda i poslovne logike aplikacije,
                </li>
                <li>
                  automatski pristup, scraping, botovi ili masovni zahtjevi bez
                  prethodnog pisanog odobrenja,
                </li>
                <li>
                  unos lažnih, obmanjujućih ili tuđih podataka bez ovlaštenja,
                </li>
                <li>
                  korištenje aplikacije za kršenje propisa Republike Hrvatske,
                  poreznih obveza, prava trećih osoba ili sigurnosti sustava.
                </li>
              </ul>
            </section>

            <section
              id='pretplate'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                6. Pretplate i plaćanje
              </h2>
              <ul className='font-body mt-4 list-disc space-y-3 pl-6 leading-relaxed text-[#d5dfdd]'>
                <li>
                  <strong>Free plan:</strong> do 3 računa mjesečno, besplatno.
                </li>
                <li>
                  <strong>Paušalist:</strong> 5,99 €/mj kod godišnje naplate ili
                  7,99 €/mj kod mjesečne naplate.
                </li>
                <li>
                  <strong>Paušalist PRO:</strong> 9,99 €/mj.
                </li>
                <li>
                  Pretplata se može otkazati bez ugovorne obveze. Otkazivanje
                  vrijedi od kraja već plaćenog obračunskog razdoblja, osim ako
                  nije drugačije navedeno u korisničkom sučelju.
                </li>
                <li>
                  Korisnik ima pravo zatražiti povrat sredstava u roku od 14
                  dana od kupnje, osim u mjeri u kojoj primjenjivi propisi ili
                  izričito započeta digitalna usluga dopuštaju drugačiji režim.
                </li>
              </ul>
              <p className='font-body mt-4 text-sm leading-relaxed text-[#94a3a0]'>
                Cijene mogu biti prikazane s PDV-om ili bez PDV-a, ovisno o
                statusu pružatelja i načinu naplate. Aktualne cijene u aplikaciji
                imaju prednost ako se razlikuju od informativnih marketinških
                prikaza.
              </p>
            </section>

            <section
              id='fiskalizacija'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                7. Usluga fiskalizacije
              </h2>
              <ul className='font-body mt-4 list-disc space-y-3 pl-6 leading-relaxed text-[#d5dfdd]'>
                <li>
                  Korisnik je odgovoran za točnost poslovnih, poreznih,
                  fiskalizacijskih i certifikacijskih podataka koje unosi u
                  Kvit.
                </li>
                <li>
                  Kvit poduzima razumne tehničke i organizacijske mjere za
                  komunikaciju s povezanim servisima, ali ne odgovara za greške,
                  nedostupnost ili odbijanja koja nastanu u komunikaciji s FINA
                  sustavima, Poreznom upravom, informacijskim posrednicima ili
                  drugim vanjskim sustavima.
                </li>
                <li>
                  FINA certifikat i povezani privatni ključevi vlasništvo su
                  korisnika. Korisnik je odgovoran osigurati da certifikat
                  pripada njemu ili njegovom poslovnom subjektu i da se koristi
                  zakonito.
                </li>
              </ul>
            </section>

            <section
              id='dostupnost'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                8. Dostupnost usluge
              </h2>
              <ul className='font-body mt-4 list-disc space-y-3 pl-6 leading-relaxed text-[#d5dfdd]'>
                <li>
                  Cilj Kvita je održavati dostupnost usluge od 99,5% na
                  mjesečnoj razini, uz razumne iznimke za održavanje i više sile.
                </li>
                <li>
                  Planirano održavanje nastojat ćemo najaviti unaprijed kada je
                  to razumno moguće.
                </li>
                <li>
                  Kvit nije odgovoran za prekide uzrokovane događajima izvan
                  razumne kontrole, uključujući force majeure, kvarove
                  infrastrukture trećih strana, prekide interneta, regulatorne
                  odluke ili sigurnosne incidente vanjskih sustava.
                </li>
              </ul>
            </section>

            <section
              id='odgovornost'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                9. Ograničenje odgovornosti
              </h2>
              <p className='font-body mt-4 leading-relaxed text-[#d5dfdd]'>
                U najvećoj mjeri dopuštenoj primjenjivim pravom, ukupna
                odgovornost Kvita prema korisniku ograničena je na iznos
                pretplate koju je korisnik stvarno platio za uslugu u razdoblju
                na koje se zahtjev odnosi.
              </p>
              <p className='font-body mt-4 leading-relaxed text-[#d5dfdd]'>
                Kvit ne odgovara za indirektnu, posljedičnu, posebnu ili
                izgubljenu dobit, gubitak prihoda, gubitak podataka, porezne
                kazne nastale zbog netočnih korisničkih podataka ili odluka koje
                korisnik donese bez neovisne provjere.
              </p>
            </section>

            <section
              id='vlasnistvo'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                10. Intelektualno vlasništvo
              </h2>
              <ul className='font-body mt-4 list-disc space-y-3 pl-6 leading-relaxed text-[#d5dfdd]'>
                <li>
                  Kvit kod, dizajn, sučelje, vodiči, tekstovi, vizualni elementi
                  i poslovna logika vlasništvo su Kvita ili njegovih licencora.
                </li>
                <li>
                  Korisnički podaci, računi, ponude, evidencije i dokumenti koje
                  korisnik unese ili generira u aplikaciji ostaju vlasništvo
                  korisnika.
                </li>
                <li>
                  Korisnik Kvitu daje ograničeno pravo obrade korisničkih
                  podataka isključivo radi pružanja, održavanja i poboljšanja
                  usluge u skladu s Politikom privatnosti.
                </li>
              </ul>
            </section>

            <section
              id='raskid'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>11. Raskid</h2>
              <ul className='font-body mt-4 list-disc space-y-3 pl-6 leading-relaxed text-[#d5dfdd]'>
                <li>
                  Korisnik može otkazati korištenje Kvita u bilo kojem trenutku.
                </li>
                <li>
                  Kvit može privremeno suspendirati ili trajno zatvoriti račun
                  korisnika koji krši ove Uvjete, ugrožava sigurnost sustava,
                  unosi lažne podatke ili koristi uslugu nezakonito.
                </li>
                <li>
                  Nakon raskida ili zatvaranja računa, korisnički podaci ostaju
                  dostupni za izvoz 30 dana, osim ako zakon zahtijeva dulje
                  čuvanje ili ako je račun suspendiran zbog sigurnosnog incidenta.
                </li>
              </ul>
            </section>

            <section
              id='izmjene'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                12. Izmjene uvjeta
              </h2>
              <p className='font-body mt-4 leading-relaxed text-[#d5dfdd]'>
                Kvit može ažurirati ove Uvjete korištenja. Materijalne izmjene
                objavit ćemo na ovoj stranici i, kada je primjenjivo, poslati
                obavijest emailom najmanje 30 dana prije stupanja izmjena na
                snagu.
              </p>
            </section>

            <section
              id='pravo'
              className='scroll-mt-8 rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 sm:p-8'
            >
              <h2 className='font-heading text-2xl font-bold'>
                13. Mjerodavno pravo i kontakt
              </h2>
              <p className='font-body mt-4 leading-relaxed text-[#d5dfdd]'>
                Na ove Uvjete primjenjuje se pravo Republike Hrvatske. Za sporove
                je nadležan stvarno nadležni sud u Republici Hrvatskoj, osim ako
                prisilni propisi određuju drugačije.
              </p>
              <p className='font-body mt-4 leading-relaxed text-[#d5dfdd]'>
                Za pitanja o Uvjetima korištenja, pretplatama ili raskidu piši na{' '}
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

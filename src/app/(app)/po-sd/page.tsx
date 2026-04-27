import Link from 'next/link';
import { redirect } from 'next/navigation';

import { formatIznosEurHr } from '@/lib/format-hr';
import { findOpcinaBySifra } from '@/lib/opcine';
import { getPausalRazred2026 } from '@/lib/pausal-tax';
import {
  applyPoSdOnboardingPrimici,
  normalizePoSdGodina,
  zbrojiKprZaGodinu,
} from '@/lib/po-sd-data';
import { createClient } from '@/lib/supabase/server';

export default async function PoSdPage({
  searchParams,
}: {
  searchParams: { year?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const godina = normalizePoSdGodina(searchParams.year);

  const [{ data: profil }, kprZbroj] = await Promise.all([
    supabase
      .from('profiles')
      .select('naziv_obrta, oib, adresa, opcina, sifra_opcine, godisnji_primici_prosle_godine')
      .eq('id', user.id)
      .maybeSingle(),
    zbrojiKprZaGodinu(supabase, user.id, godina),
  ]);

  const { zbroj, izvorOnboardinga } = applyPoSdOnboardingPrimici(
    godina,
    kprZbroj,
    profil?.godisnji_primici_prosle_godine,
  );

  const razred = getPausalRazred2026(zbroj.ukupno);
  const opcina = findOpcinaBySifra(profil?.sifra_opcine);
  const opcinaNaziv = opcina?.naziv ?? profil?.opcina ?? null;
  const godineOpcije = Array.from({ length: 7 }, (_, i) => {
    const y = new Date().getFullYear() - i;
    return y;
  });

  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-8 text-[#e2e8e7] sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-3xl flex-col gap-6'>
        <header className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          <p className='font-body text-sm text-[#94a3a0]'>
            Godišnja prijava primitaka
          </p>
          <h1 className='font-heading mt-2 text-2xl sm:text-3xl'>
            PO-SD (pregled)
          </h1>
          <p className='font-body mt-3 text-sm leading-relaxed text-[#b9c7c4]'>
            Zbroj primitaka iz KPR-a za odabranu kalendarsku godinu i procjena
            paušalnog poreza prema razredima za 2026. Službenu prijavu podnosiš
            u ePoreznoj do 15.1. za prethodnu godinu.
          </p>
        </header>

        <section className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          <p className='font-body text-sm text-[#94a3a0]'>
            Godina KPR podataka
          </p>
          <div className='mt-3 flex flex-wrap gap-2'>
            {godineOpcije.map((y) => (
              <Link
                key={y}
                href={
                  y === new Date().getFullYear() - 1
                    ? '/po-sd'
                    : `/po-sd?year=${y}`
                }
                className={`font-body rounded-lg px-3 py-2 text-sm transition ${
                  y === godina
                    ? 'bg-[#0d9488] font-semibold text-white'
                    : 'border border-[#2a3734] text-[#d5dfdd] hover:border-[#0d9488]'
                }`}
              >
                {y}
              </Link>
            ))}
          </div>
        </section>

        <section className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          <h2 className='font-heading text-lg text-[#e2e8e7]'>Obveznik</h2>
          <dl className='font-body mt-4 space-y-2 text-sm text-[#b9c7c4]'>
            <div className='flex justify-between gap-4'>
              <dt>Obrt</dt>
              <dd className='text-right text-[#e2e8e7]'>
                {profil?.naziv_obrta ?? '—'}
              </dd>
            </div>
            <div className='flex justify-between gap-4'>
              <dt>OIB</dt>
              <dd className='text-right text-[#e2e8e7]'>
                {profil?.oib ?? '—'}
              </dd>
            </div>
            <div className='flex justify-between gap-4'>
              <dt>Adresa</dt>
              <dd className='text-right text-[#e2e8e7]'>
                {profil?.adresa ?? '—'}
              </dd>
            </div>
            <div className='flex justify-between gap-4'>
              <dt>Općina/Grad za PO-SD</dt>
              <dd className='text-right text-[#e2e8e7]'>
                {profil?.sifra_opcine
                  ? `${profil.sifra_opcine} ${opcinaNaziv ? `— ${opcinaNaziv}` : ''}`
                  : '—'}
              </dd>
            </div>
          </dl>
        </section>

        <section className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          <h2 className='font-heading text-lg text-[#e2e8e7]'>
            Primitci iz KPR-a ({godina}.)
          </h2>
          <dl className='font-body mt-4 space-y-3 text-sm'>
            <div className='flex justify-between gap-4 border-b border-[#24312f] pb-3'>
              <dt className='text-[#94a3a0]'>Gotovina</dt>
              <dd>{formatIznosEurHr(zbroj.gotovina)}</dd>
            </div>
            <div className='flex justify-between gap-4 border-b border-[#24312f] pb-3'>
              <dt className='text-[#94a3a0]'>Bezgotovinsko</dt>
              <dd>{formatIznosEurHr(zbroj.bezgotovinsko)}</dd>
            </div>
            <div className='flex justify-between gap-4 pt-1'>
              <dt className='font-semibold text-[#e2e8e7]'>Ukupno primitci</dt>
              <dd className='font-heading text-xl text-[#0d9488]'>
                {formatIznosEurHr(zbroj.ukupno)}
              </dd>
            </div>
          </dl>
          {izvorOnboardinga ? (
            <p className='font-body mt-3 text-xs text-[#94a3a0]'>
              Podatak iz onboardinga (ručni unos)
            </p>
          ) : null}
        </section>

        <section className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          <h2 className='font-heading text-lg text-[#e2e8e7]'>
            Procjena poreza za {godina + 1}. na osnovu primitaka {godina}.
          </h2>
          {razred ? (
            <dl className='font-body mt-4 space-y-3 text-sm'>
              <div className='flex justify-between gap-4'>
                <dt className='text-[#94a3a0]'>Razred</dt>
                <dd className='text-right text-[#e2e8e7]'>{razred.label}</dd>
              </div>
              <div className='flex justify-between gap-4'>
                <dt className='text-[#94a3a0]'>Porez po kvartalu (procjena)</dt>
                <dd>{formatIznosEurHr(razred.porezKvartalnoEur)}</dd>
              </div>
              <div className='flex justify-between gap-4'>
                <dt className='text-[#94a3a0]'>Porez godišnje (4 × kvartal)</dt>
                <dd className='font-semibold text-[#0d9488]'>
                  {formatIznosEurHr(razred.porezGodisnjeEur)}
                </dd>
              </div>
            </dl>
          ) : (
            <p className='font-body mt-3 text-sm text-[#94a3a0]'>
              Nema podataka za obračun.
            </p>
          )}
          <p className='font-body mt-4 text-xs leading-relaxed text-[#94a3a0]'>
            {/* TODO: Uvesti izračun prireza po općini kada budemo imali adresu prebivališta. */}
            Prirez na dohodak ovisi o općini — nije uključen u procjenu.
          </p>
        </section>

        <section className='flex flex-wrap gap-3'>
          <Link
            href={`/api/po-sd/pdf?year=${godina}`}
            target='_blank'
            rel='noreferrer'
            className='font-body inline-flex rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6]'
          >
            Preuzmi PDF
          </Link>
          <Link
            href='/kpr'
            className='font-body inline-flex rounded-xl border border-[#2a3734] px-5 py-3 text-[#d5dfdd] transition hover:border-[#0d9488]'
          >
            KPR knjiga
          </Link>
        </section>
      </div>
    </main>
  );
}

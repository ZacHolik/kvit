import Link from 'next/link';
import { redirect } from 'next/navigation';

import { formatDatumHr, formatIznosEurHr } from '@/lib/format-hr';
import { createClient } from '@/lib/supabase/server';

import { DashboardReferralSection } from './dashboard-referral-section';

const PAUSAL_LIMIT = 60000;
export const dynamic = 'force-dynamic';

function getNextDeadline(referenceDate = new Date()) {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();

  const contributionDeadline = new Date(year, month, 15);
  if (referenceDate <= contributionDeadline) {
    return {
      title: 'Doprinosi',
      date: contributionDeadline,
      description: 'Mjesečna uplata doprinosa do 15. u mjesecu.',
    };
  }

  const quarterlyDeadlines = [
    new Date(year, 2, 31),
    new Date(year, 5, 30),
    new Date(year, 8, 30),
    new Date(year, 11, 31),
  ];

  const nextQuarterly =
    quarterlyDeadlines.find((deadline) => referenceDate <= deadline) ??
    new Date(year + 1, 2, 31);

  return {
    title: 'Kvartalni porez',
    date: nextQuarterly,
    description: 'Provjeri i podmiri paušalni porez za kvartal.',
  };
}

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const yearStart = new Date(now.getFullYear(), 0, 1)
    .toISOString()
    .slice(0, 10);

  const [{ data: profile }, { data: yearlyKpr }, { data: invoices }] =
    await Promise.all([
      supabase
        .from('profiles')
        .select('naziv_obrta')
        .eq('id', user.id)
        .maybeSingle(),
      supabase
        .from('kpr_unosi')
        .select('ukupno')
        .eq('user_id', user.id)
        .gte('datum', yearStart),
      supabase
        .from('racuni')
        .select('id, datum, datum_placanja, status, ukupni_iznos, kupci(naziv)')
        .eq('user_id', user.id),
    ]);

  // TODO: If KPR entries are missing (older data), consider fallback aggregation from paid invoices.
  const yearlyIncome = (yearlyKpr ?? []).reduce(
    (sum, item) => sum + Number(item.ukupno ?? 0),
    0,
  );
  const invoiceRows = ((invoices ?? []) as Array<{
    id: string;
    datum: string;
    datum_placanja: string | null;
    status: string;
    ukupni_iznos: number | string | null;
    kupci: { naziv: string | null } | Array<{ naziv: string | null }> | null;
  }>).map((invoice) => ({
    ...invoice,
    kupci: Array.isArray(invoice.kupci)
      ? (invoice.kupci[0] ?? null)
      : invoice.kupci,
  }));

  const monthlyInvoices = invoiceRows.filter((invoice) => invoice.datum >= monthStart);
  const paidInvoices = invoiceRows.filter((invoice) => invoice.status === 'placeno');
  const monthlyPaidIncome = paidInvoices
    .filter((invoice) => (invoice.datum_placanja ?? invoice.datum) >= monthStart)
    .reduce((sum, item) => sum + Number(item.ukupni_iznos ?? 0), 0);
  const yearlyPaidIncome = paidInvoices
    .filter((invoice) => (invoice.datum_placanja ?? invoice.datum) >= yearStart)
    .reduce((sum, item) => sum + Number(item.ukupni_iznos ?? 0), 0);
  const unpaidInvoices = invoiceRows.filter((invoice) => invoice.status === 'izdano');
  const unpaidCount = unpaidInvoices.length;
  const unpaidTotal = unpaidInvoices.reduce(
    (sum, item) => sum + Number(item.ukupni_iznos ?? 0),
    0,
  );
  const topCustomers = Object.values(
    invoiceRows
      .filter((invoice) => invoice.status !== 'stornirano')
      .reduce<Record<string, { naziv: string; total: number }>>((acc, invoice) => {
        const naziv = invoice.kupci?.naziv?.trim() || 'Nepoznati kupac';
        acc[naziv] = {
          naziv,
          total: (acc[naziv]?.total ?? 0) + Number(invoice.ukupni_iznos ?? 0),
        };
        return acc;
      }, {}),
  )
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);
  const monthlyInvoiceCount = monthlyInvoices.length;
  const progressPercent = Math.min((yearlyIncome / PAUSAL_LIMIT) * 100, 100);
  const deadline = getNextDeadline(now);
  const nazivObrta = profile?.naziv_obrta?.trim() || 'Moj obrt';

  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-8 text-[#e2e8e7] sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-6'>
        <header className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          <p className='font-body text-sm text-[#94a3a0]'>Kvik dashboard</p>
          <h1 className='font-heading mt-2 text-2xl sm:text-3xl'>
            {nazivObrta}
          </h1>
        </header>

        <section className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          <div className='flex items-center justify-between gap-3'>
            <h2 className='font-heading text-xl'>Limit primitaka</h2>
            <span className='font-body text-sm text-[#94a3a0]'>
              {formatIznosEurHr(yearlyIncome)} /{' '}
              {formatIznosEurHr(PAUSAL_LIMIT)}
            </span>
          </div>
          <div className='mt-4 h-3 w-full rounded-full bg-[#22302d]'>
            <div
              className='h-3 rounded-full bg-[#0d9488] transition-all'
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className='font-body mt-3 text-sm text-[#94a3a0]'>
            Iskorišteno {progressPercent.toFixed(1)}% godišnjeg paušalnog
            limita.
          </p>
        </section>

        <section className='grid gap-4 md:grid-cols-3'>
          <article className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5'>
            <p className='font-body text-sm text-[#94a3a0]'>Sljedeći rok</p>
            <h3 className='font-heading mt-2 text-lg'>{deadline.title}</h3>
            <p className='font-body mt-2 text-xl text-[#0d9488]'>
              {formatDatumHr(deadline.date)}
            </p>
            <p className='font-body mt-2 text-sm text-[#b9c7c4]'>
              {deadline.description}
            </p>
          </article>

          <article className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5'>
            <p className='font-body text-sm text-[#94a3a0]'>
              Računi ovaj mjesec
            </p>
            <p className='font-heading mt-3 text-3xl'>{monthlyInvoiceCount}</p>
          </article>

          <article className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5'>
            <p className='font-body text-sm text-[#94a3a0]'>
              Primici ovaj mjesec
            </p>
            <p className='font-heading mt-3 text-3xl'>
              {formatIznosEurHr(
                monthlyInvoices.reduce(
                  (sum, item) => sum + Number(item.ukupni_iznos ?? 0),
                  0,
                ),
              )}
            </p>
          </article>
        </section>

        <section className='grid gap-4 md:grid-cols-2'>
          <article className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5'>
            <p className='font-body text-sm text-[#94a3a0]'>
              Prihodi ovaj mjesec
            </p>
            <p className='font-heading mt-3 text-3xl'>
              {formatIznosEurHr(monthlyPaidIncome)}
            </p>
            <p className='font-body mt-2 text-sm text-[#94a3a0]'>
              Samo računi sa statusom Plaćeno.
            </p>
          </article>

          <article className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5'>
            <p className='font-body text-sm text-[#94a3a0]'>
              Prihodi ova godina
            </p>
            <p className='font-heading mt-3 text-3xl'>
              {formatIznosEurHr(yearlyPaidIncome)}
            </p>
            <p className='font-body mt-2 text-sm text-[#94a3a0]'>
              Zbroj plaćenih računa u tekućoj godini.
            </p>
          </article>

          <article className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5'>
            <p className='font-body text-sm text-[#94a3a0]'>Top 3 kupca</p>
            <div className='mt-3 space-y-2'>
              {topCustomers.length > 0 ? (
                topCustomers.map((customer, index) => (
                  <div
                    key={customer.naziv}
                    className='flex items-center justify-between gap-3 text-sm'
                  >
                    <span className='text-[#d5dfdd]'>
                      {index + 1}. {customer.naziv}
                    </span>
                    <span className='font-semibold text-[#5eead4]'>
                      {formatIznosEurHr(customer.total)}
                    </span>
                  </div>
                ))
              ) : (
                <p className='font-body text-sm text-[#94a3a0]'>Još nema kupaca.</p>
              )}
            </div>
          </article>

          <article className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5'>
            <p className='font-body text-sm text-[#94a3a0]'>Neplaćeni računi</p>
            <p className='font-heading mt-3 text-3xl'>{unpaidCount}</p>
            <p className='font-body mt-2 text-sm text-[#b9c7c4]'>
              Ukupno: {formatIznosEurHr(unpaidTotal)}
            </p>
          </article>
        </section>

        <DashboardReferralSection />

        <section className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
            <div>
              <h2 className='font-heading text-xl'>Brze akcije</h2>
              <p className='font-body mt-1 text-sm text-[#94a3a0]'>
                Kreiraj novi račun i nastavi voditi poslovanje bez kašnjenja.
              </p>
            </div>
            <Link
              href='/racuni/novi'
              className='font-body rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6]'
            >
              Novi račun
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

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

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('hr-HR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('hr-HR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
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
  const yearStart = new Date(now.getFullYear(), 0, 1).toISOString().slice(0, 10);

  const [{ data: profile }, { data: yearlyKpr }, { data: monthlyInvoices }] =
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
        .select('id, ukupni_iznos')
        .eq('user_id', user.id)
        .gte('datum', monthStart),
    ]);

  // TODO: If KPR entries are missing (older data), consider fallback aggregation from paid invoices.
  const yearlyIncome = (yearlyKpr ?? []).reduce(
    (sum, item) => sum + Number(item.ukupno ?? 0),
    0,
  );
  const monthlyIncome = (monthlyInvoices ?? []).reduce(
    (sum, item) => sum + Number(item.ukupni_iznos ?? 0),
    0,
  );
  const monthlyInvoiceCount = monthlyInvoices?.length ?? 0;
  const progressPercent = Math.min((yearlyIncome / PAUSAL_LIMIT) * 100, 100);
  const deadline = getNextDeadline(now);
  const nazivObrta = profile?.naziv_obrta?.trim() || 'Moj obrt';

  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-8 text-[#e2e8e7] sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-6'>
        <header className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          <p className='font-body text-sm text-[#94a3a0]'>Kvit dashboard</p>
          <h1 className='font-heading mt-2 text-2xl sm:text-3xl'>{nazivObrta}</h1>
        </header>

        <section className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          <div className='flex items-center justify-between gap-3'>
            <h2 className='font-heading text-xl'>Limit primitaka</h2>
            <span className='font-body text-sm text-[#94a3a0]'>
              {formatCurrency(yearlyIncome)} / {formatCurrency(PAUSAL_LIMIT)}
            </span>
          </div>
          <div className='mt-4 h-3 w-full rounded-full bg-[#22302d]'>
            <div
              className='h-3 rounded-full bg-[#0d9488] transition-all'
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className='font-body mt-3 text-sm text-[#94a3a0]'>
            Iskorišteno {progressPercent.toFixed(1)}% godišnjeg paušalnog limita.
          </p>
        </section>

        <section className='grid gap-4 md:grid-cols-3'>
          <article className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5'>
            <p className='font-body text-sm text-[#94a3a0]'>Sljedeći rok</p>
            <h3 className='font-heading mt-2 text-lg'>{deadline.title}</h3>
            <p className='font-body mt-2 text-xl text-[#0d9488]'>
              {formatDate(deadline.date)}
            </p>
            <p className='font-body mt-2 text-sm text-[#b9c7c4]'>
              {deadline.description}
            </p>
          </article>

          <article className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5'>
            <p className='font-body text-sm text-[#94a3a0]'>Računi ovaj mjesec</p>
            <p className='font-heading mt-3 text-3xl'>{monthlyInvoiceCount}</p>
          </article>

          <article className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5'>
            <p className='font-body text-sm text-[#94a3a0]'>Primici ovaj mjesec</p>
            <p className='font-heading mt-3 text-3xl'>
              {formatCurrency(monthlyIncome)}
            </p>
          </article>
        </section>

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

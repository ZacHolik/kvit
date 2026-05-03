import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { getSiteUrl } from '@/lib/vodici-config';

const CODE_RE = /^[a-z0-9]{6}$/;

export async function generateMetadata({
  params,
}: {
  params: { code: string };
}): Promise<Metadata> {
  const code = params.code?.trim().toLowerCase() ?? '';
  const title = 'Pozivnica na Kvik';
  if (!CODE_RE.test(code)) {
    return { title };
  }
  return {
    title: `${title} | Kvik`,
    description: 'Tvoj prijatelj koristi Kvik za paušalni obrt — isprobaj besplatno.',
    openGraph: {
      title,
      url: `${getSiteUrl()}/r/${code}`,
      siteName: 'Kvik',
      type: 'website',
      images: ['/opengraph-image'],
    },
  };
}

/** Sloj 3 C): referral landing /r/[code]. */
export default async function ReferralLandingPage({
  params,
}: {
  params: { code: string };
}) {
  const code = params.code?.trim().toLowerCase() ?? '';
  if (!CODE_RE.test(code)) {
    notFound();
  }

  const admin = createServiceRoleClient();
  if (!admin) {
    notFound();
  }

  const { data: codeRow } = await admin
    .from('user_referral_codes')
    .select('user_id')
    .eq('code', code)
    .maybeSingle();

  if (!codeRow?.user_id) {
    notFound();
  }

  const { data: prof } = await admin
    .from('profiles')
    .select('naziv_obrta')
    .eq('id', codeRow.user_id as string)
    .maybeSingle();

  const displayName = prof?.naziv_obrta?.trim() || 'Prijatelj';

  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-12 text-[#e2e8e7] sm:px-6'>
      <div className='mx-auto max-w-lg'>
        <Link
          href='/'
          className='font-heading text-lg font-bold text-[#0d9488]'
        >
          Kvik<span className='text-[#5eead4]'>.</span>
        </Link>
        <h1 className='font-heading mt-8 text-2xl font-bold leading-snug sm:text-3xl'>
          Tvoj prijatelj {displayName} koristi Kvik za paušalni obrt.
        </h1>
        <ul className='font-body mt-8 list-disc space-y-3 pl-5 text-[#b9c7c4]'>
          <li>AI asistent za porezna pitanja</li>
          <li>Automatski KPR iz računa</li>
          <li>PO-SD generator s 7 razreda</li>
        </ul>
        <Link
          href={`/register?ref=${code}`}
          className='font-body mt-10 inline-flex rounded-xl bg-[#0d9488] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#14b8a6]'
        >
          Isprobaj besplatno →
        </Link>
      </div>
    </main>
  );
}

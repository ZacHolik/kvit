import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { getSiteUrl } from '@/lib/vodici-config';

import { ShareVisitTracker } from './share-visit-tracker';
import { ShareAnswerBody } from './share-answer-body';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function ogDescriptionFromQuestion(question: string) {
  const t = question.replace(/\s+/g, ' ').trim();
  if (t.length <= 100) {
    return t.length > 0 ? t : 'Porezno pitanje i odgovor Kvik AI asistenta.';
  }
  return `${t.slice(0, 100)}...`;
}

export async function generateMetadata({
  params,
}: {
  params: { uuid: string };
}): Promise<Metadata> {
  const uuid = params.uuid;
  if (!UUID_RE.test(uuid)) {
    return { title: 'Dijeljeni odgovor | Kvik' };
  }

  const admin = createServiceRoleClient();
  if (!admin) {
    return {
      title: 'Odgovor na porezno pitanje | Kvik AI',
      description: 'Kvik AI',
    };
  }

  const { data } = await admin
    .from('shared_answers')
    .select('question')
    .eq('id', uuid)
    .maybeSingle();

  const desc = data?.question
    ? ogDescriptionFromQuestion(data.question as string)
    : 'Porezno pitanje i odgovor Kvik AI asistenta.';

  return {
    title: 'Odgovor na porezno pitanje | Kvik AI',
    description: desc,
    openGraph: {
      title: 'Odgovor na porezno pitanje | Kvik AI',
      description: desc,
      url: `${getSiteUrl()}/share/${uuid}`,
      siteName: 'Kvik',
      locale: 'hr_HR',
      type: 'article',
      images: ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Odgovor na porezno pitanje | Kvik AI',
      description: desc,
      images: ['/opengraph-image'],
    },
  };
}

export default async function ShareAnswerPage({
  params,
}: {
  params: { uuid: string };
}) {
  const uuid = params.uuid;
  if (!UUID_RE.test(uuid)) {
    notFound();
  }

  const admin = createServiceRoleClient();
  if (!admin) {
    notFound();
  }

  const { data: row, error } = await admin
    .from('shared_answers')
    .select('question, answer')
    .eq('id', uuid)
    .maybeSingle();

  if (error || !row?.question || !row?.answer) {
    notFound();
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className='min-h-screen bg-[#fafaf9] text-[#1c1917]'>
      <ShareVisitTracker shareId={uuid} />
      <header className='border-b border-stone-200/80 bg-white'>
        <div className='mx-auto flex max-w-2xl items-center px-5 py-4'>
          <Link
            href='/'
            className='font-heading text-lg font-bold tracking-tight text-[#0f766e]'
          >
            Kvik<span className='text-[#14b8a6]'>.</span>
          </Link>
        </div>
      </header>

      <main className='mx-auto max-w-2xl px-5 py-10 sm:py-14'>
        <article className='rounded-2xl border border-stone-200 bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10'>
          <h1 className='font-heading text-xl font-bold leading-snug text-stone-900 sm:text-2xl'>
            {row.question as string}
          </h1>
          <ShareAnswerBody answer={row.answer as string} />
        </article>

        <section className='mt-10 rounded-2xl border border-stone-200 bg-white px-6 py-8 text-center sm:px-8'>
          <p className='font-body text-sm text-stone-600'>
            Kvik AI je odgovorio na ovo pitanje besplatno.
          </p>
          <p className='font-body mt-2 text-base font-medium text-stone-800'>
            Imaš vlastito porezno pitanje?
          </p>
          <Link
            href={user ? '/asistent' : `/register?share=${uuid}`}
            className='font-body mt-6 inline-flex rounded-xl bg-[#0d9488] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#14b8a6]'
          >
            Pitaj Kvik AI besplatno →
          </Link>
        </section>
      </main>
    </div>
  );
}

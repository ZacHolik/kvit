import { NextResponse } from 'next/server';

import { processFiscalRetryJob } from '@/lib/fiscalization/fiscal-retry';
import { createClient } from '@/lib/supabase/server';

type PostBody = {
  racunId?: string;
  jobId?: string;
};

/**
 * GET — pending stavke u redu za trenutnog korisnika.
 */
export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('fiscal_retry_queue')
    .select(
      'id, racun_id, attempt_count, next_attempt_at, status, error_message, created_at, expires_at',
    )
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ items: data ?? [] });
}

/**
 * POST — ručni retry: pošalji `jobId` ili `racunId` (zadnji pending za taj račun).
 */
export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: PostBody = {};
  try {
    body = (await request.json()) as PostBody;
  } catch {
    body = {};
  }

  let jobId = body.jobId?.trim();
  if (!jobId && body.racunId?.trim()) {
    const { data: row } = await supabase
      .from('fiscal_retry_queue')
      .select('id')
      .eq('user_id', user.id)
      .eq('racun_id', body.racunId.trim())
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    jobId = row?.id;
  }

  if (!jobId) {
    return NextResponse.json(
      { error: 'Nedostaje jobId ili racunId u tijelu zahtjeva.' },
      { status: 400 },
    );
  }

  const result = await processFiscalRetryJob(supabase, jobId, user.id);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

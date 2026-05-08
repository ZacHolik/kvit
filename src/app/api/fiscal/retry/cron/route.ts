import { NextResponse } from 'next/server';

import { processFiscalRetryJob } from '@/lib/fiscalization/fiscal-retry';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

/**
 * GET — Vercel Cron / scheduler: obradi pending fiskalne retryeve.
 * Zaštita: Authorization: Bearer <CRON_SECRET> ili ?secret=<CRON_SECRET>
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET nije postavljen.' }, { status: 503 });
  }

  const auth = request.headers.get('authorization');
  const q = new URL(request.url).searchParams.get('secret');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : q;
  if (token !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createServiceRoleClient();
  if (!admin) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY nedostaje.' },
      { status: 503 },
    );
  }

  const nowIso = new Date().toISOString();
  const { data: jobs, error } = await admin
    .from('fiscal_retry_queue')
    .select('id, user_id')
    .eq('status', 'pending')
    .lte('next_attempt_at', nowIso)
    .gte('expires_at', nowIso)
    .limit(40);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results: Array<{ id: string; ok: boolean; message: string }> = [];
  for (const row of jobs ?? []) {
    const r = await processFiscalRetryJob(
      admin,
      row.id as string,
      row.user_id as string,
    );
    results.push({ id: row.id as string, ok: r.ok, message: r.message });
  }

  return NextResponse.json({ processed: results.length, results });
}

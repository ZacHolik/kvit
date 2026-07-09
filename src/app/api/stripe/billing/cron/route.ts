import { NextResponse } from 'next/server';

import {
  processBillingRacunJob,
  type BillingQueueRow,
} from '@/lib/stripe/process-billing-payment';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

const MAX_BILLING_ATTEMPTS = 5;

async function sendSlackAlert(message: string) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) {
    console.error('SLACK_WEBHOOK_URL nije postavljen:', message);
    return;
  }

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message }),
  }).catch((err) => console.error('Slack webhook error', err));
}

/**
 * GET — Vercel Cron: obrada billing_racun_queue (račun + PDF + email).
 * Zaštita: Authorization: Bearer <CRON_SECRET>
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'CRON_SECRET nije postavljen.' },
      { status: 503 },
    );
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

  const { data: jobs, error } = await admin
    .from('billing_racun_queue')
    .select(
      'id, user_id, stripe_invoice_id, amount_eur, interval, datum_iso, customer_email, stripe_subscription_id, attempt_count',
    )
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results: Array<{ id: string; ok: boolean; message: string }> = [];
  for (const row of jobs ?? []) {
    const r = await processBillingRacunJob(admin, row as BillingQueueRow);
    results.push({ id: row.id as string, ok: r.ok, message: r.message });

    if (!r.ok && r.exhausted) {
      const contact = row.customer_email || row.stripe_invoice_id;
      await sendSlackAlert(
        `🔴 Kvik billing: račun za ${contact} nije generiran nakon ${MAX_BILLING_ATTEMPTS} pokušaja. Ručna intervencija potrebna. Queue ID: ${row.id}`,
      );
    }
  }

  return NextResponse.json({ processed: results.length, results });
}

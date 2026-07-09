import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe/client';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

function getYesterdayUtcRange(): { gte: number; lte: number; dateLabel: string } {
  const now = new Date();
  const yesterdayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1),
  );
  const yesterdayEnd = new Date(
    Date.UTC(
      yesterdayStart.getUTCFullYear(),
      yesterdayStart.getUTCMonth(),
      yesterdayStart.getUTCDate(),
      23,
      59,
      59,
    ),
  );

  return {
    gte: Math.floor(yesterdayStart.getTime() / 1000),
    lte: Math.floor(yesterdayEnd.getTime() / 1000),
    dateLabel: yesterdayStart.toISOString().slice(0, 10),
  };
}

async function listPaidStripeInvoicesForRange(gte: number, lte: number) {
  const invoiceIds: string[] = [];
  let startingAfter: string | undefined;

  for (;;) {
    const page = await stripe.invoices.list({
      status: 'paid',
      created: { gte, lte },
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });

    for (const invoice of page.data) {
      invoiceIds.push(invoice.id);
    }

    if (!page.has_more || page.data.length === 0) {
      break;
    }

    startingAfter = page.data[page.data.length - 1]?.id;
  }

  return invoiceIds;
}

async function countMatchedBillingEvents(
  admin: NonNullable<ReturnType<typeof createServiceRoleClient>>,
  invoiceIds: string[],
) {
  if (invoiceIds.length === 0) {
    return 0;
  }

  const matchedIds = new Set<string>();
  const chunkSize = 100;

  for (let i = 0; i < invoiceIds.length; i += chunkSize) {
    const chunk = invoiceIds.slice(i, i + chunkSize);
    const { data, error } = await admin
      .from('billing_events')
      .select('stripe_invoice_id')
      .in('stripe_invoice_id', chunk)
      .neq('status', 'failed');

    if (error) {
      throw new Error(error.message);
    }

    for (const row of data ?? []) {
      if (row.stripe_invoice_id) {
        matchedIds.add(row.stripe_invoice_id);
      }
    }
  }

  return matchedIds.size;
}

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
 * GET — Vercel Cron: usporedba Stripe paid invoice-a vs billing_events (jučer UTC).
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

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'STRIPE_SECRET_KEY nije postavljen.' },
      { status: 503 },
    );
  }

  const admin = createServiceRoleClient();
  if (!admin) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY nedostaje.' },
      { status: 503 },
    );
  }

  const { gte, lte, dateLabel } = getYesterdayUtcRange();
  const stripeInvoiceIds = await listPaidStripeInvoicesForRange(gte, lte);
  const checked = stripeInvoiceIds.length;
  const matched = await countMatchedBillingEvents(admin, stripeInvoiceIds);
  const discrepancy = checked !== matched;

  if (discrepancy) {
    await sendSlackAlert(
      `⚠️ Kvik billing reconciliation: [${checked}] Stripe naplata, [${matched}] billing_events. Nesklad za datum [${dateLabel}]. Provjeri billing_racun_queue.`,
    );
  } else {
    console.log(
      `Billing reconciliation OK for ${dateLabel}: ${checked} Stripe invoices, ${matched} billing_events.`,
    );
  }

  return NextResponse.json({ checked, matched, discrepancy });
}

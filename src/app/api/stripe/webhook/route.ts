/**
 * POST /api/stripe/webhook
 *
 * Stripe šalje event ovdje. Body se čita kao raw text jer Stripe
 * signature verification zahtijeva originalnu byte-for-byte reprezentaciju.
 *
 * stripe@22 / 2026-04-22.dahlia API razlike od legacy:
 *   - Subscription.current_period_start/end → sub.items.data[0].current_period_start/end
 *   - Invoice.subscription_details → invoice.parent?.subscription_details
 *   - Invoice.payment_intent → nije top-level, preskačemo (null)
 *   - InvoiceLineItem.price → parent.subscription_item_details?.price (string | Price)
 *
 * Svaki handler je u try/catch — webhook uvijek vraća 200 Stripeu.
 */

import { NextResponse } from 'next/server';
import type Stripe from 'stripe';

import { stripe } from '@/lib/stripe/client';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export const dynamic = 'force-dynamic';

// ─── Email helper (Resend) ───────────────────────────────────────────────────

async function sendEmail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? 'Kvik <noreply@kvik.online>',
      to: [to],
      subject,
      html,
    }),
  }).catch((err) => console.error('Resend webhook email error', err));
}

function formatPeriod(start: number, end: number) {
  const fmt = (ts: number) =>
    new Date(ts * 1000).toLocaleDateString('hr-HR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  return `${fmt(start)} – ${fmt(end)}`;
}

// ─── DB helper: resolve user_id from subscriptions table ────────────────────

type AdminClient = ReturnType<typeof createServiceRoleClient>;

async function resolveUserId(
  admin: AdminClient,
  opts: { subscriptionId?: string | null; customerId?: string | null },
): Promise<string | null> {
  if (!admin) return null;
  const filters: string[] = [];
  if (opts.subscriptionId)
    filters.push(`stripe_subscription_id.eq.${opts.subscriptionId}`);
  if (opts.customerId)
    filters.push(`stripe_customer_id.eq.${opts.customerId}`);
  if (filters.length === 0) return null;
  const { data } = await admin
    .from('subscriptions')
    .select('user_id')
    .or(filters.join(','))
    .maybeSingle();
  return (data as { user_id?: string } | null)?.user_id ?? null;
}

// ─── Event handlers ───────────────────────────────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const admin = createServiceRoleClient();
  const userId =
    session.metadata?.user_id ??
    (await resolveUserId(admin, {
      customerId: session.customer as string | null,
    }));

  if (!userId) {
    console.error('webhook checkout.session.completed: no user_id', session.id);
    return;
  }

  const subscriptionId = session.subscription as string;
  const sub = await stripe.subscriptions.retrieve(subscriptionId);

  // stripe@22: period dates are on the subscription item, not top-level
  const item = sub.items.data[0];
  const periodStart = item?.current_period_start;
  const periodEnd = item?.current_period_end;

  await admin?.from('subscriptions').upsert(
    {
      user_id: userId,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: subscriptionId,
      stripe_price_id: item?.price?.id ?? null,
      plan: 'pausalist',
      interval: item?.price?.recurring?.interval ?? 'month',
      status: sub.status === 'trialing' ? 'trialing' : 'active',
      current_period_start: periodStart
        ? new Date(periodStart * 1000).toISOString()
        : null,
      current_period_end: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null,
      cancel_at_period_end: sub.cancel_at_period_end,
      trial_end: sub.trial_end
        ? new Date(sub.trial_end * 1000).toISOString()
        : null,
    },
    { onConflict: 'user_id' },
  );
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const admin = createServiceRoleClient();

  // stripe@22: subscription context is at invoice.parent?.subscription_details
  const subDetails = invoice.parent?.type === 'subscription_details'
    ? invoice.parent.subscription_details
    : null;

  const subId =
    subDetails?.subscription != null
      ? typeof subDetails.subscription === 'string'
        ? subDetails.subscription
        : subDetails.subscription.id
      : null;

  const userId =
    subDetails?.metadata?.user_id ??
    (await resolveUserId(admin, {
      subscriptionId: subId,
      customerId: invoice.customer as string | null,
    }));

  if (!userId) {
    console.error('webhook invoice.payment_succeeded: no user_id', invoice.id);
    return;
  }

  // Interval iz subscription item (dohvati sub ako imamo ID)
  let lineInterval: string | null = null;
  if (subId) {
    try {
      const sub = await stripe.subscriptions.retrieve(subId);
      lineInterval = sub.items.data[0]?.price?.recurring?.interval ?? null;
    } catch {
      // ne blokira snimanje billing eventa
    }
  }

  await admin?.from('billing_events').upsert(
    {
      user_id: userId,
      stripe_invoice_id: invoice.id,
      stripe_payment_intent_id: null, // not top-level in new API
      amount_eur: (invoice.amount_paid ?? 0) / 100,
      interval: lineInterval,
      status: 'paid',
    },
    { onConflict: 'stripe_invoice_id' },
  );

  // Email potvrda
  if (invoice.customer_email) {
    const { data: profile } = await admin
      ?.from('profiles')
      .select('naziv_obrta')
      .eq('id', userId)
      .maybeSingle() ?? { data: null };
    const name = (profile as { naziv_obrta?: string } | null)?.naziv_obrta ?? '';
    const amount = ((invoice.amount_paid ?? 0) / 100).toFixed(2).replace('.', ',');
    const period = invoice.period_start && invoice.period_end
      ? formatPeriod(invoice.period_start, invoice.period_end)
      : '';

    await sendEmail(
      invoice.customer_email,
      `Kvik — Potvrda plaćanja ${amount} EUR`,
      `
        <p>Pozdrav${name ? ` ${name}` : ''},</p>
        <p>Uspješno smo naplatili <strong>${amount} EUR</strong>${period ? ` za period ${period}` : ''}.</p>
        <p>R1 račun je u pripremi i dobit ćete ga emailom uskoro.</p>
        <p><a href="https://kvik.online/postavke">Upravljajte pretplatom →</a></p>
        <hr/>
        <p style="font-size:12px;color:#999;">Kvik · <a href="https://kvik.online">kvik.online</a></p>
      `,
    );
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const admin = createServiceRoleClient();

  const subDetails = invoice.parent?.type === 'subscription_details'
    ? invoice.parent.subscription_details
    : null;

  const subId =
    subDetails?.subscription != null
      ? typeof subDetails.subscription === 'string'
        ? subDetails.subscription
        : subDetails.subscription.id
      : null;

  const userId =
    subDetails?.metadata?.user_id ??
    (await resolveUserId(admin, {
      subscriptionId: subId,
      customerId: invoice.customer as string | null,
    }));

  if (!userId) {
    console.error('webhook invoice.payment_failed: no user_id', invoice.id);
    return;
  }

  let lineInterval: string | null = null;
  if (subId) {
    try {
      const sub = await stripe.subscriptions.retrieve(subId);
      lineInterval = sub.items.data[0]?.price?.recurring?.interval ?? null;
    } catch { /* silent */ }
  }

  await admin?.from('billing_events').upsert(
    {
      user_id: userId,
      stripe_invoice_id: invoice.id,
      stripe_payment_intent_id: null,
      amount_eur: (invoice.amount_due ?? 0) / 100,
      interval: lineInterval,
      status: 'failed',
    },
    { onConflict: 'stripe_invoice_id' },
  );

  // Update subscription status
  if (subId) {
    await admin?.from('subscriptions').update({ status: 'past_due' })
      .eq('stripe_subscription_id', subId);
  }

  // Dunning email
  if (invoice.customer_email) {
    const amount = ((invoice.amount_due ?? 0) / 100).toFixed(2).replace('.', ',');
    await sendEmail(
      invoice.customer_email,
      `Kvik — Naplata od ${amount} EUR nije uspjela`,
      `
        <p>Pozdrav,</p>
        <p>Nismo uspjeli naplatiti <strong>${amount} EUR</strong> za Kvik pretplatu.</p>
        <p>Molimo ažurirajte podatke platne kartice:</p>
        <p><a href="https://kvik.online/postavke">Ažuriraj podatke plaćanja →</a></p>
        <p>Ako ne riješite situaciju u roku 3 dana, vaš će pristup biti ograničen.</p>
        <hr/>
        <p style="font-size:12px;color:#999;">Kvik · <a href="https://kvik.online">kvik.online</a></p>
      `,
    );
  }
}

async function handleSubscriptionUpdated(sub: Stripe.Subscription) {
  const admin = createServiceRoleClient();
  const userId =
    sub.metadata?.user_id ??
    (await resolveUserId(admin, {
      subscriptionId: sub.id,
      customerId: sub.customer as string | null,
    }));

  if (!userId) {
    console.error('webhook customer.subscription.updated: no user_id', sub.id);
    return;
  }

  // stripe@22: period on items
  const item = sub.items.data[0];
  const periodStart = item?.current_period_start;
  const periodEnd = item?.current_period_end;

  await admin?.from('subscriptions').update({
    status: sub.status as string,
    plan: sub.status === 'canceled' ? 'free' : 'pausalist',
    stripe_price_id: item?.price?.id ?? null,
    interval: item?.price?.recurring?.interval ?? null,
    current_period_start: periodStart
      ? new Date(periodStart * 1000).toISOString()
      : null,
    current_period_end: periodEnd
      ? new Date(periodEnd * 1000).toISOString()
      : null,
    cancel_at_period_end: sub.cancel_at_period_end,
    canceled_at: sub.canceled_at
      ? new Date(sub.canceled_at * 1000).toISOString()
      : null,
    trial_end: sub.trial_end
      ? new Date(sub.trial_end * 1000).toISOString()
      : null,
  }).eq('stripe_subscription_id', sub.id);
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  const admin = createServiceRoleClient();
  await admin?.from('subscriptions').update({
    status: 'canceled',
    plan: 'free',
    canceled_at: new Date().toISOString(),
    cancel_at_period_end: false,
  }).eq('stripe_subscription_id', sub.id);
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || !process.env.STRIPE_SECRET_KEY) {
    console.error('Stripe webhook: missing env vars');
    return NextResponse.json({ error: 'Misconfigured' }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error(`Webhook handler error [${event.type}]`, err);
  }

  return NextResponse.json({ received: true });
}

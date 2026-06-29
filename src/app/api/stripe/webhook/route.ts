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

import { formatIznosEurHr } from '@/lib/format-hr';
import { enqueueBillingRacunJob } from '@/lib/stripe/process-billing-payment';
import { PLANS } from '@/lib/stripe/plans';
import { stripe } from '@/lib/stripe/client';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export const dynamic = 'force-dynamic';

// ─── Email helper (Resend) — checkout / dunning (ne billing račun) ───────────

async function sendEmail(
  to: string,
  subject: string,
  html: string,
) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to?.trim()) {
    return;
  }
  const payload: Record<string, unknown> = {
    from:
      process.env.RESEND_FROM_SUPPORT ??
      process.env.RESEND_FROM_EMAIL ??
      'Kvik Podrška <podrska@kvik.hr>',
    to: [to.trim()],
    subject,
    html,
  };
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).catch((err) => console.error('Resend webhook email error', err));
}

async function sendWelcomeSubscriptionEmail(opts: {
  to: string;
  userName: string;
  plan: string;
  amount: number;
  isTrial: boolean;
}) {
  const trialNote = opts.isTrial
    ? '<p>Uključeno je <strong>probno razdoblje</strong>; prva naplata slijedi nakon isteka proba.</p>'
    : '';
  await sendEmail(
    opts.to,
    'Dobrodošli u Kvik Paušalist',
    `
      <p>Pozdrav ${opts.userName},</p>
      <p>Hvala na pretplati na <strong>${opts.plan}</strong>.</p>
      <p>Plan: ${formatIznosEurHr(opts.amount)} / mj</p>
      ${trialNote}
      <p><a href="https://kvik.online/postavke">Postavke pretplate →</a></p>
      <hr/>
      <p style="font-size:12px;color:#999;">Kvik · <a href="https://kvik.online">kvik.online</a></p>
    `,
  );
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

  const subscriptionId =
    typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription?.id;
  if (!subscriptionId) {
    console.error('webhook checkout.session.completed: no subscription', session.id);
    return;
  }

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

  // Poveži lead s plaćanjem
  const paidEmail =
    session.customer_details?.email?.trim() ??
    session.customer_email?.trim() ??
    '';
  if (admin && paidEmail) {
    await admin
      .from('leads')
      .update({
        converted_to_paid_at: new Date().toISOString(),
      })
      .eq('email', paidEmail.toLowerCase())
      .is('converted_to_paid_at', null);
  }

  const to = paidEmail;
  const { data: profil } =
    (await admin
      ?.from('profiles')
      .select('naziv_obrta')
      .eq('id', userId)
      .maybeSingle()) ?? { data: null };
  const userName =
    (profil as { naziv_obrta?: string } | null)?.naziv_obrta?.trim() || 'Korisnik';
  const interval =
    item?.price?.recurring?.interval === 'year' ? 'year' : 'month';
  const amount =
    interval === 'year'
      ? PLANS.pausalist.displayPriceYearlyPerMonth
      : PLANS.pausalist.displayPriceMonthly;
  const isTrial = Boolean(sub.trial_end);

  try {
    await sendWelcomeSubscriptionEmail({
      to,
      userName,
      plan: 'Paušalist',
      amount,
      isTrial,
    });
  } catch (e) {
    console.error('welcome email checkout', e);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const admin = createServiceRoleClient();
  if (!admin) {
    return;
  }

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

  let lineInterval: 'month' | 'year' | null = null;
  if (subId) {
    try {
      const sub = await stripe.subscriptions.retrieve(subId);
      const int = sub.items.data[0]?.price?.recurring?.interval;
      lineInterval = int === 'year' || int === 'month' ? int : null;
    } catch {
      /* ignore */
    }
  }

  const amountEur = (invoice.amount_paid ?? 0) / 100;
  const paidTs = invoice.status_transitions?.paid_at ?? invoice.created;
  const datumIso = new Date(paidTs * 1000).toISOString().slice(0, 10);

  await admin.from('billing_events').upsert(
    {
      user_id: userId,
      stripe_invoice_id: invoice.id,
      stripe_payment_intent_id: null,
      amount_eur: amountEur,
      interval: lineInterval,
      status: 'paid',
    },
    { onConflict: 'stripe_invoice_id' },
  );

  const { data: bev } = await admin
    .from('billing_events')
    .select('invoice_id')
    .eq('stripe_invoice_id', invoice.id)
    .maybeSingle();

  if ((bev as { invoice_id?: string | null } | null)?.invoice_id) {
    return;
  }

  await enqueueBillingRacunJob(admin, {
    user_id: userId,
    stripe_invoice_id: invoice.id,
    amount_eur: amountEur,
    interval: lineInterval,
    datum_iso: datumIso,
    customer_email: invoice.customer_email?.trim() ?? null,
    stripe_subscription_id: subId,
  });
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const admin = createServiceRoleClient();
  if (!admin) {
    return;
  }
  // Stripe Charge.invoice postoji na API-ju; tipovi paketa ponekad zaostaju.
  const inv = (charge as Stripe.Charge & { invoice?: string | Stripe.Invoice | null })
    .invoice;
  const invId = typeof inv === 'string' ? inv : inv?.id;
  if (!invId) {
    return;
  }
  try {
    await admin
      .from('billing_events')
      .update({ status: 'refunded' })
      .eq('stripe_invoice_id', invId);
  } catch (e) {
    console.error('charge.refunded billing update', e);
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

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const admin = createServiceRoleClient();
  if (!admin) {
    return;
  }

  const email = session.customer_details?.email || session.customer_email;
  if (!email) {
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const { data: existingLead } = await admin
    .from('leads')
    .select('converted_to_paid_at, unsubscribed_at')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (existingLead?.converted_to_paid_at || existingLead?.unsubscribed_at) {
    return;
  }

  const { error } = await admin.from('leads').upsert(
    {
      email: normalizedEmail,
      source_tool: 'abandoned_checkout',
      utm_source: 'stripe',
      utm_medium: 'checkout',
      utm_campaign: 'recovery',
      consent: true,
      consent_text: 'Stripe checkout initiated',
      consent_at: new Date().toISOString(),
      landing_page: '/register',
    },
    { onConflict: 'email' },
  );

  if (error) {
    console.error('Abandoned checkout lead save failed:', error);
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:
          process.env.RESEND_FROM_SUPPORT ?? 'Kvik <podrska@kvik.online>',
        reply_to: 'podrska@kvik.hr',
        to: [normalizedEmail],
        subject: 'Nisi dovršio — Kvik te čeka',
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a">
            <p>Bok,</p>
            <p>Primijetili smo da si krenuo s aktivacijom Kvika, ali nisi dovršio.</p>
            <p>Razumijemo — možda ti je nešto iskočilo, ili si htio još razmisliti.</p>
            <p>Ako želiš nastaviti:</p>
            <p style="margin:24px 0">
              <a href="https://kvik.online/register"
                style="display:inline-block;background:#0d9488;color:#fff;
                padding:12px 24px;border-radius:8px;text-decoration:none;
                font-weight:600">
                Nastavi aktivaciju →
              </a>
            </p>
            <p>Ako imaš pitanja, samo odgovori na ovaj mail.</p>
            <p>— Kvik tim</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
            <p style="color:#999;font-size:12px">
              Ovu poruku si primio jer si započeo aktivaciju na kvik.online.
              Nećemo ti više slati o ovome.
            </p>
          </div>
        `,
      }),
    }).catch((err) => console.error('Recovery email error:', err));
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || !process.env.STRIPE_SECRET_KEY) {
    console.error('Stripe webhook: missing env vars');
    return NextResponse.json({ received: true, warning: 'misconfigured' });
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
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;
      case 'checkout.session.expired':
        await handleCheckoutExpired(event.data.object as Stripe.Checkout.Session);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error(`Webhook handler error [${event.type}]`, err);
  }

  return NextResponse.json({ received: true });
}

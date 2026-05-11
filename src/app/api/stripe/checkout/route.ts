/**
 * POST /api/stripe/checkout
 * Body: { plan?: 'monthly' | 'yearly', trial?: boolean }
 * Returns: { url: string }
 *
 * Kreira Stripe Checkout Session za Paušalist plan.
 * Ako STRIPE_SECRET_KEY nije postavljen vraća fallback Tally URL.
 */

import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe/client';
import { getPriceId } from '@/lib/stripe/plans';
import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

const TALLY_FALLBACK = 'https://tally.so/r/44or65';

type RequestBody = {
  plan?: 'monthly' | 'yearly';
  trial?: boolean;
};

export async function POST(request: Request) {
  // Graceful fallback: redirect to Tally if Stripe not configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ url: TALLY_FALLBACK });
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as RequestBody;
  const interval = body.plan === 'yearly' ? 'year' : 'month';
  const withTrial = body.trial === true;

  // ── Dohvati ili kreiraj Stripe Customer ────────────────────────────────────
  const admin = createServiceRoleClient();
  let stripeCustomerId: string | null = null;

  if (admin) {
    const { data: sub } = await admin
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();
    stripeCustomerId = sub?.stripe_customer_id ?? null;
  }

  if (!stripeCustomerId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('naziv_obrta')
      .eq('id', user.id)
      .maybeSingle();

    const customer = await stripe.customers.create({
      email: user.email,
      name:
        (profile as { naziv_obrta?: string } | null)?.naziv_obrta?.trim() ||
        undefined,
      metadata: { user_id: user.id },
    });
    stripeCustomerId = customer.id;

    if (admin) {
      await admin.from('subscriptions').upsert(
        {
          user_id: user.id,
          stripe_customer_id: stripeCustomerId,
          plan: 'free',
          status: 'inactive',
        },
        { onConflict: 'user_id' },
      );
    }
  }

  // ── Kreiraj Checkout Session ───────────────────────────────────────────────
  const priceId = getPriceId(interval);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://kvik.online';

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: 'subscription',
    payment_method_types: ['card', 'sepa_debit'],
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      metadata: { user_id: user.id },
      ...(withTrial && { trial_period_days: 7 }),
    },
    success_url: `${appUrl}/postavke?checkout=success`,
    cancel_url: `${appUrl}/#cijene`,
    allow_promotion_codes: true,
    locale: 'hr',
    metadata: { user_id: user.id },
  });

  return NextResponse.json({ url: session.url });
}

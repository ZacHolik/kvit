/**
 * POST /api/stripe/checkout
 *
 * Kreira Stripe Checkout Session za Paušalist plan.
 * Body: { plan: 'pausalist', trial?: boolean }
 *
 * Vraća: { url: string } — redirect na Stripe hosted checkout.
 *
 * Ako korisnik nije prijavljen, vraća grešku 401.
 * Stripe customer se kreira ili dohvaća iz subscriptions tablice.
 */

import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe/client';
import { getPriceId } from '@/lib/stripe/plans';
import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

type RequestBody = {
  plan?: string;
  interval?: 'month' | 'year';
  trial?: boolean;
};

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as RequestBody;
  const interval = body.interval ?? 'month';
  const withTrial = body.trial === true;

  // Dohvati ili kreiraj Stripe Customer
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
      .select('email:id, naziv_obrta')
      .eq('id', user.id)
      .maybeSingle();

    const customer = await stripe.customers.create({
      email: user.email,
      name:
        (profile as { naziv_obrta?: string } | null)?.naziv_obrta ?? undefined,
      metadata: { user_id: user.id },
    });
    stripeCustomerId = customer.id;

    // Spremi customer ID u subscriptions (upsert — red možda ne postoji)
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

  const priceId = getPriceId(interval);
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://kvik.online';

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    ...(withTrial && {
      subscription_data: {
        trial_period_days: 7,
        metadata: { user_id: user.id },
      },
    }),
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/#cijene`,
    allow_promotion_codes: true,
    locale: 'hr',
    metadata: { user_id: user.id },
  });

  return NextResponse.json({ url: session.url });
}

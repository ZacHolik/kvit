import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe/client';
import { getPriceId } from '@/lib/stripe/plans';

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe nije konfiguriran.' }, { status: 500 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    plan?: 'monthly' | 'yearly';
    lead_email?: string;
  };
  const interval = body.plan === 'yearly' ? 'year' : 'month';
  const priceId = getPriceId(interval);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://kvik.online';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: body.lead_email || undefined,
    subscription_data: {
      metadata: { anonymous_signup: 'true' },
    },
    success_url: `${appUrl}/dobrodosli?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/register`,
    allow_promotion_codes: true,
    locale: 'hr',
    metadata: { anonymous_signup: 'true' },
  });

  return NextResponse.json({ url: session.url });
}

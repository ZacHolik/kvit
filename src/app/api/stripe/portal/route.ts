/**
 * POST /api/stripe/portal
 *
 * Kreira Stripe Customer Portal sesiju.
 * Korisnik može: promijeniti karticu, otkazati, vidjeti račune.
 * return_url: /postavke
 */

import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function POST() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe nije konfiguriran.' },
      { status: 503 },
    );
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
  }

  const admin = createServiceRoleClient();
  const { data: sub } = await admin
    ?.from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle() ?? { data: null };

  const stripeCustomerId = sub?.stripe_customer_id as string | undefined;

  if (!stripeCustomerId) {
    return NextResponse.json(
      { error: 'Nema aktivne pretplate.' },
      { status: 404 },
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://kvik.online';

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${appUrl}/postavke`,
  });

  return NextResponse.json({ url: session.url });
}
